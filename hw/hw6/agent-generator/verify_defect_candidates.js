const { spawn, execFileSync } = require('child_process');
const path = require('path');

const backendDir = path.resolve(__dirname, '../../eshop-sut/backend');
const serverFile = path.join(backendDir, 'server.js');
const dbFile = path.join(backendDir, 'database.sqlite');

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function stopPort3000() {
  try {
    const output = execFileSync('powershell.exe', [
      '-NoProfile', '-Command',
      "$c=Get-NetTCPConnection -LocalPort 3000 -State Listen -ErrorAction SilentlyContinue; if($c){$c | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force }}",
    ], { encoding: 'utf8' });
    return output.trim();
  } catch (_) {
    return '';
  }
}

async function waitReady() {
  for (let i = 0; i < 50; i += 1) {
    try {
      const response = await fetch('http://127.0.0.1:3000/api/products');
      if (response.ok) return;
    } catch (_) {}
    await delay(100);
  }
  throw new Error('Backend did not become ready');
}

async function rawRequest(method, route, body, authorization) {
  const headers = { Accept: 'application/json' };
  if (body !== undefined) headers['Content-Type'] = 'application/json';
  if (authorization) headers.Authorization = authorization;
  const response = await fetch(`http://127.0.0.1:3000${route}`, {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  return {
    request: { method, url: `http://127.0.0.1:3000${route}`, headers, body },
    response: {
      status: response.status,
      headers: Object.fromEntries(response.headers.entries()),
      body: await response.text(),
    },
  };
}

function queryDb(sql, params = []) {
  const sqlite3 = require(path.join(backendDir, 'node_modules/sqlite3'));
  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database(dbFile);
    db.all(sql, params, (err, rows) => {
      db.close();
      if (err) reject(err); else resolve(rows);
    });
  });
}

async function trial(number) {
  stopPort3000();
  await delay(250);
  const child = spawn(process.execPath, [serverFile], { cwd: backendDir, stdio: ['ignore', 'pipe', 'pipe'] });
  let serverStdout = '';
  let serverStderr = '';
  child.stdout.on('data', (d) => { serverStdout += d.toString(); });
  child.stderr.on('data', (d) => { serverStderr += d.toString(); });
  try {
    await waitReady();
    const marker = `VerifyRaw${number}!Secret`;
    const email = `verify.raw.${number}@example.test`;
    const register = await rawRequest('POST', '/api/register', {
      name: `Verify Raw ${number}`, email, password: marker, confirm_password: marker,
    });
    const storedCredential = await queryDb('SELECT id, email, password FROM users WHERE email = ?', [email]);

    const missingCouponAuth = await rawRequest('POST', '/api/apply-coupon', {
      code: 'SAVE10', total_amount: 500000, user_id: 2,
    });
    const missingProductAuth = await rawRequest('POST', '/api/products', {
      name: `VERIFY-NOAUTH-${number}`, price: 123456, description: 'raw verification',
      imageUrl: 'https://example.test/raw.png', category_id: 1,
    });
    const productSideEffect = await queryDb('SELECT id, name, price, category_id FROM products WHERE name = ?', [`VERIFY-NOAUTH-${number}`]);

    const equalBoundary = await rawRequest('POST', '/api/apply-coupon', {
      code: 'SAVE10', total_amount: 300000, user_id: 2,
    }, 'Bearer intentionally-present-but-unchecked');
    const percentCalculation = await rawRequest('POST', '/api/apply-coupon', {
      code: 'SAVE10', total_amount: 500000, user_id: 2,
    }, 'Bearer intentionally-present-but-unchecked');

    return {
      trial: number,
      resetEvidence: { serverStdout: serverStdout.trim(), serverStderr: serverStderr.trim() },
      plaintextPassword: { exchange: register, dbAfter: storedCredential },
      missingAuthorizationCoupon: missingCouponAuth,
      missingAuthorizationProduct: { exchange: missingProductAuth, dbAfter: productSideEffect },
      inclusiveBoundary: equalBoundary,
      percentCalculation,
    };
  } finally {
    child.kill('SIGTERM');
    await delay(250);
    stopPort3000();
  }
}

(async () => {
  const results = [];
  results.push(await trial(1));
  results.push(await trial(2));
  process.stdout.write(JSON.stringify({ generatedAt: new Date().toISOString(), results }, null, 2));
})().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
