/**
 * Mini lab N09 - PostgreSQL database/API tests.
 *
 * Required environment variables:
 *   DATABASE_URL          privileged test database connection
 *   APP_USER_DATABASE_URL restricted app_user connection (for the RBAC test)
 *
 * Optional:
 *   API_BASE_URL          URL of a running API, default http://127.0.0.1:3000
 *
 * Run: npm test -- db-tests.test.js --runInBand
 * Dependencies: jest, pg, supertest
 *
 * The target database must already contain the schema and the three objects named
 * fn_calculate_discount, sp_process_checkout and trg_prevent_negative_stock.
 */

'use strict';

const { Pool } = require('pg');
const request = require('supertest');

const databaseUrl = process.env.DATABASE_URL;
const appUserDatabaseUrl = process.env.APP_USER_DATABASE_URL;
const apiBaseUrl = process.env.API_BASE_URL || 'http://127.0.0.1:3000';

if (!databaseUrl) {
  throw new Error('DATABASE_URL is required. Use a disposable PostgreSQL test database.');
}

const db = new Pool({ connectionString: databaseUrl });
const appUserDb = appUserDatabaseUrl
  ? new Pool({ connectionString: appUserDatabaseUrl })
  : null;

let client;
let ids;

async function scalar(sql, params = []) {
  const result = await client.query(sql, params);
  return result.rows[0];
}

beforeAll(async () => {
  client = await db.connect();

  // Keep fixture values deterministic and avoid collisions with normal data.
  await client.query(`
    INSERT INTO users (email, role)
    VALUES
      ('n09.customer1@test.invalid', 'customer'),
      ('n09.customer2@test.invalid', 'customer'),
      ('n09.customer3@test.invalid', 'customer'),
      ('n09.admin@test.invalid', 'admin'),
      ('n09.staff@test.invalid', 'staff')
    ON CONFLICT (email) DO NOTHING
  `);

  await client.query(`
    INSERT INTO products (name, price, stock)
    SELECT *
    FROM (VALUES
      ('N09 Product A', 100.00::numeric, 20),
      ('N09 Product B', 150.00::numeric, 10),
      ('N09 Product C', 200.00::numeric, 5),
      ('N09 Product D', 250.00::numeric, 1),
      ('N09 Out of stock', 300.00::numeric, 0)
    ) AS seed(name, price, stock)
    WHERE NOT EXISTS (
      SELECT 1 FROM products WHERE products.name = seed.name
    )
  `);

  await client.query(`
    INSERT INTO coupons
      (code, discount_type, discount_value, expired_at, is_active)
    VALUES
      ('CP_OK',         'fixed',    50, NOW() + INTERVAL '30 days', 1),
      ('CP_EXPIRED',    'fixed',    50, NOW() - INTERVAL '1 day',  1),
      ('CP_INACTIVE',   'fixed',    50, NOW() + INTERVAL '30 days', 0),
      ('CP_PERCENT150', 'percent', 150, NOW() + INTERVAL '30 days', 1)
    ON CONFLICT (code) DO UPDATE SET
      discount_type = EXCLUDED.discount_type,
      discount_value = EXCLUDED.discount_value,
      expired_at = EXCLUDED.expired_at,
      is_active = EXCLUDED.is_active
  `);

  const fixtureIds = await client.query(`
    SELECT
      (SELECT id FROM users WHERE email = 'n09.customer1@test.invalid') AS user_id,
      (SELECT id FROM products WHERE name = 'N09 Product A') AS product_a,
      (SELECT id FROM products WHERE name = 'N09 Product B') AS product_b,
      (SELECT id FROM products WHERE name = 'N09 Out of stock') AS out_of_stock
  `);
  ids = fixtureIds.rows[0];

  // Add enough orders for planner observations without assuming IDs or sequences.
  await client.query(`
    INSERT INTO orders (user_id, total_amount, final_amount, status)
    SELECT u.id, 100 + n, 90 + n, 'delivered'
    FROM generate_series(1, 200) AS n
    CROSS JOIN LATERAL (
      SELECT id
      FROM users
      WHERE email LIKE 'n09.%@test.invalid'
      ORDER BY id
      OFFSET ((n - 1) % 5)
      LIMIT 1
    ) AS u
    WHERE NOT EXISTS (
      SELECT 1
      FROM orders o
      WHERE o.user_id = u.id AND o.total_amount = 100 + n
    )
  `);
});

afterAll(async () => {
  if (client) {
    // Cleanup only uniquely named fixtures created by this suite.
    await client.query(
      `DELETE FROM coupons WHERE code = ANY($1::text[])`,
      [['CP_OK', 'CP_EXPIRED', 'CP_INACTIVE', 'CP_PERCENT150']]
    );
    await client.query(
      `DELETE FROM products WHERE name LIKE 'N09 Product %' OR name = 'N09 Out of stock'`
    );
    await client.query(`DELETE FROM users WHERE email LIKE 'n09.%@test.invalid'`);
    client.release();
  }
  await db.end();
  if (appUserDb) await appUserDb.end();
});

describe('1. Schema / constraints', () => {
  test('rejects duplicate user email (UNIQUE)', async () => {
    await client.query('BEGIN');
    try {
      await client.query(
        `INSERT INTO users(email, role) VALUES ($1, $2)`,
        ['n09.unique@test.invalid', 'customer']
      );
      await expect(
        client.query(
          `INSERT INTO users(email, role) VALUES ($1, $2)`,
          ['n09.unique@test.invalid', 'customer']
        )
      ).rejects.toMatchObject({ code: '23505' });
    } finally {
      await client.query('ROLLBACK');
    }
  });

  test('rejects a negative product stock (CHECK or trigger)', async () => {
    await client.query('BEGIN');
    try {
      await expect(
        client.query(`UPDATE products SET stock = $1 WHERE id = $2`, [-5, ids.product_a])
      ).rejects.toThrow();
    } finally {
      await client.query('ROLLBACK');
    }
  });
});

describe('2. Function and trigger', () => {
  test.each([
    ['percent', 150, 200, 200],
    ['percent', 10, 200, 20],
    ['fixed', 250, 200, 200],
    ['fixed', 50, 200, 50]
  ])(
    'fn_calculate_discount(%s, %s, %s) returns a discount in [0, order amount]',
    async (type, value, orderAmount, expected) => {
      const row = await scalar(
        `SELECT fn_calculate_discount($1, $2, $3) AS discount`,
        [type, value, orderAmount]
      );
      const discount = Number(row.discount);
      expect(discount).toBeGreaterThanOrEqual(0);
      expect(discount).toBeLessThanOrEqual(orderAmount);
      expect(discount).toBe(expected);
    }
  );

  test('trg_prevent_negative_stock is attached to products and enabled', async () => {
    const row = await scalar(`
      SELECT COUNT(*)::int AS count
      FROM pg_trigger t
      JOIN pg_class c ON c.oid = t.tgrelid
      WHERE c.relname = 'products'
        AND t.tgname = 'trg_prevent_negative_stock'
        AND NOT t.tgisinternal
        AND t.tgenabled <> 'D'
    `);
    expect(row.count).toBe(1);
  });
});

describe('3. Stored procedure atomicity', () => {
  test('rolls back every stock change when one requested product is out of stock', async () => {
    const before = await db.query(
      `SELECT id, stock FROM products WHERE id = ANY($1::int[]) ORDER BY id`,
      [[ids.product_a, ids.product_b, ids.out_of_stock]]
    );
    const orderCountBefore = await db.query(
      `SELECT COUNT(*)::int AS count FROM orders WHERE user_id = $1`,
      [ids.user_id]
    );

    // Use an independent connection: a stored procedure may control its transaction.
    // Adjust CALL to SELECT only if the supplied object was implemented as a function.
    await expect(
      db.query(`CALL sp_process_checkout($1, $2::int[])`, [
        ids.user_id,
        [ids.product_a, ids.product_b, ids.out_of_stock]
      ])
    ).rejects.toThrow();

    const after = await db.query(
      `SELECT id, stock FROM products WHERE id = ANY($1::int[]) ORDER BY id`,
      [[ids.product_a, ids.product_b, ids.out_of_stock]]
    );
    const orderCountAfter = await db.query(
      `SELECT COUNT(*)::int AS count FROM orders WHERE user_id = $1`,
      [ids.user_id]
    );

    expect(after.rows).toEqual(before.rows);
    expect(orderCountAfter.rows[0].count).toBe(orderCountBefore.rows[0].count);
  });
});

describe('4. Functional API', () => {
  test('rejects an expired coupon', async () => {
    const response = await request(apiBaseUrl)
      .post('/api/apply-coupon')
      .send({ code: 'CP_EXPIRED', order_amount: 300 });
    expect(response.status).toBe(400);
  });

  test('rejects canceled -> delivered transition', async () => {
    const inserted = await db.query(
      `INSERT INTO orders(user_id, total_amount, final_amount, status)
       VALUES ($1, 100, 100, 'canceled')
       RETURNING id`,
      [ids.user_id]
    );
    const orderId = inserted.rows[0].id;
    try {
      const response = await request(apiBaseUrl)
        .put(`/api/admin/orders/${orderId}/status`)
        .send({ status: 'delivered' });
      expect(response.status).toBe(400);
    } finally {
      await db.query(`DELETE FROM orders WHERE id = $1`, [orderId]);
    }
  });
});

describe('5. Security', () => {
  test('product search resists SQL injection and does not mutate data', async () => {
    const before = await db.query(`SELECT COUNT(*)::int AS count FROM products`);
    const response = await request(apiBaseUrl)
      .get('/api/products/search')
      .query({ q: `' OR '1'='1` });
    const after = await db.query(`SELECT COUNT(*)::int AS count FROM products`);

    expect(response.status).not.toBe(500);
    expect(response.status).toBeLessThan(400);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBe(0);
    expect(after.rows[0].count).toBe(before.rows[0].count);
  });

  const rbacTest = appUserDb ? test : test.skip;
  rbacTest('app_user cannot DROP TABLE products', async () => {
    await expect(appUserDb.query(`DROP TABLE products`)).rejects.toMatchObject({
      code: '42501'
    });
    const exists = await db.query(`SELECT to_regclass('public.products') AS relation`);
    expect(exists.rows[0].relation).toBe('products');
  });
});

