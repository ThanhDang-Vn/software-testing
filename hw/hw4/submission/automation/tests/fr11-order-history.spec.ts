import { expect, test, type Page, type APIRequestContext } from '@playwright/test';
import { loadOrderFixture, loadSuiteCases } from './support/suite-data.js';

const cases = loadSuiteCases('fr11-order-history.json', 'FR-11');
const api = process.env.API_BASE_URL ?? 'http://127.0.0.1:3000';
const runId = `${Date.now()}-${process.pid}`;

function requiredEnvironment(name: string, caseId: string): string {
  const value = process.env[name];
  if (value === undefined || value.length === 0) {
    throw new Error(`${caseId}: required environment variable ${name} is missing`);
  }
  return value;
}

async function login(request: APIRequestContext) {
  const response = await request.post(`${api}/api/login`, {
    data: {
      email: requiredEnvironment('FR11_CUSTOMER_EMAIL', 'FR-11 login'),
      password: requiredEnvironment('FR11_CUSTOMER_PASSWORD', 'FR-11 login')
    }
  });
  expect(response.ok()).toBe(true);
  return (await response.json()) as { token: string; user: Record<string, unknown> };
}

async function openProfile(page: Page, orders: object[]) {
  const auth = await page.request.post(`${api}/api/login`, {
    data: {
      email: requiredEnvironment('FR11_CUSTOMER_EMAIL', 'FR-11 UI setup'),
      password: requiredEnvironment('FR11_CUSTOMER_PASSWORD', 'FR-11 UI setup')
    }
  });
  expect(auth.ok(), 'FR-11 UI setup login must succeed').toBe(true);
  const session = (await auth.json()) as { token: string; user: object };
  await page.addInitScript(({ token, user }) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
  }, session);
  await page.route('**/api/orders/my-orders', async route => {
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(orders) });
  });
  await page.goto('/profile');
}

function orderRow(page: Page, orderId: number) {
  return page.getByRole('row').filter({
    has: page.getByRole('cell', { name: `#${orderId}`, exact: true })
  });
}

async function registerCustomer(
  request: APIRequestContext,
  email: string,
  password: string
): Promise<string> {
  const registration = await request.post(`${api}/api/register`, {
    data: {
      name: requiredEnvironment('FR11_SYNTHETIC_USER_NAME', 'FR-11 ownership setup'),
      email,
      password
    }
  });
  expect(registration.ok(), `Unable to register ownership user ${email}`).toBe(true);
  const authentication = await request.post(`${api}/api/login`, {
    data: { email, password }
  });
  expect(authentication.ok(), `Unable to authenticate ownership user ${email}`).toBe(true);
  return ((await authentication.json()) as { token: string }).token;
}

function amountPattern(amount: number): RegExp {
  const groups = String(amount).replace(/\B(?=(\d{3})+(?!\d))/g, '|').split('|');
  return new RegExp(`${groups.join('[,.]')}.*₫`);
}

test.describe('FR-11 Order History View', () => {
  for (const item of cases) {
    test(`${item.id} ${item.description}`, async ({ page, request }) => {
      if (item.action === 'api-ownership') {
        const password = requiredEnvironment('FR11_OWNER_PASSWORD', item.id);
        const otherPassword = requiredEnvironment('FR11_OTHER_PASSWORD', item.id);
        const ownerToken = await registerCustomer(
          request,
          `fr11-owner-${runId}-${item.id.toLowerCase()}@eshop.com`,
          password
        );
        const otherToken = await registerCustomer(
          request,
          `fr11-other-${runId}-${item.id.toLowerCase()}@eshop.com`,
          otherPassword
        );
        const checkout = await request.post(`${api}/api/checkout`, {
          headers: { Authorization: `Bearer ${otherToken}` },
          data: {
            total_amount: item.totalAmount,
            shipping_address: item.shippingAddress
          }
        });
        expect(checkout.ok()).toBe(true);
        const { orderId } = (await checkout.json()) as { orderId: number };
        const ownerOrders = await request.get(`${api}/api/orders/my-orders`, {
          headers: { Authorization: `Bearer ${ownerToken}` }
        });
        expect(ownerOrders.status()).toBe(item.expectedStatus);
        const body = (await ownerOrders.json()) as Array<{ id: number }>;
        expect(body.map(order => order.id)).not.toContain(orderId);
        return;
      }

      if (item.action.startsWith('api-')) {
        const headers: Record<string, string> = {};
        if (item.action !== 'api-no-token') {
          headers.Authorization =
            item.action === 'api-bad-token' ? 'Bearer malformed' : `Bearer ${(await login(request)).token}`;
        }
        const response = await request.get(`${api}/api/orders/my-orders`, { headers });
        expect(response.status()).toBe(item.expectedStatus);
        if (!response.ok()) return;
        const body = (await response.json()) as Array<Record<string, unknown>>;
        expect(Array.isArray(body)).toBe(true);
        if (item.action === 'api-shape' && body.length) {
          expect(body[0]).toEqual(expect.objectContaining({
            id: expect.any(Number), total_amount: expect.anything(),
            status: expect.any(String), created_at: expect.anything()
          }));
          expect(body[0]).not.toHaveProperty('password');
        }
        if (item.action === 'api-descending') {
          expect(body.every((order, index) => index === 0 || Number(body[index - 1].id) > Number(order.id))).toBe(true);
        }
        return;
      }

      if (!item.fixtureProfile) throw new Error(`${item.id}: fixtureProfile is required`);
      const fixture = loadOrderFixture(item.fixtureProfile);
      await openProfile(page, item.action === 'ui-empty' ? [] : fixture.orders);
      if (item.action === 'ui-heading') await expect(page.getByRole('heading', { name: /Lịch sử Đơn hàng/i })).toBeVisible();
      if (item.action === 'ui-empty') await expect(page.getByText(/chưa có đơn hàng nào/i)).toBeVisible();
      if (item.action === 'ui-id') {
        await expect(page.getByText(`#${fixture.expectedFirstOrderId}`)).toBeVisible();
      }
      if (item.action === 'ui-date') {
        const localizedDate = await page.evaluate(
          rawDate => new Date(rawDate).toLocaleDateString(),
          fixture.expectedRawDate
        );
        await expect(page.getByText(fixture.expectedRawDate)).toHaveCount(0);
        await expect(orderRow(page, fixture.expectedFirstOrderId).getByRole('cell', {
          name: localizedDate,
          exact: true
        })).toBeVisible();
      }
      if (item.action === 'ui-price') {
        await expect(orderRow(page, fixture.expectedFirstOrderId)).toContainText(
          amountPattern(fixture.expectedTotalAmount)
        );
      }
      if (item.action === 'ui-status') {
        const statusClasses = new Set<string>();
        for (const label of fixture.expectedStatusLabels) {
          const status = page.getByText(label, { exact: true });
          await expect(status).toBeVisible();
          statusClasses.add((await status.getAttribute('class')) ?? '');
        }
        expect(statusClasses.size).toBe(fixture.expectedStatusClassCount);
      }
      if (item.action === 'ui-actions') {
        await expect(page.getByRole('button', { name: 'Hủy đơn' })).toHaveCount(
          fixture.expectedCancelButtonCount
        );
        for (const orderId of fixture.nonCancellableOrderIds) {
          await expect(orderRow(page, orderId).getByRole('button')).toHaveCount(0);
        }
      }
    });
  }
});
