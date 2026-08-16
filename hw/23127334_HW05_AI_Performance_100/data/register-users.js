/**
 * Bulk-register the accounts in users.csv into the running EShop SUT.
 *
 * WHY: server.js re-seeds (DROP + reseed) the SQLite DB on every start, so
 * only admin@eshop.com and test@eshop.com survive a restart. Perf tests need
 * one valid account per virtual user. Run this ONCE against the running server
 * (http://localhost:3000) right before executing the JMeter test plans — or
 * after any server restart.
 *
 * Usage:  node hw5/data/register-users.js
 * Idempotent enough: the SUT allows duplicate emails (no unique constraint),
 * so re-running just re-inserts; login still works with the shared password.
 */
const fs = require("fs");
const path = require("path");
const http = require("http");

const BASE_HOST = "localhost";
const BASE_PORT = 3000;
const CSV = path.resolve(__dirname, "users.csv");
const CONCURRENCY = 20;

function register({ email, password }) {
  return new Promise((resolve) => {
    const body = JSON.stringify({ name: email.split("@")[0], email, password });
    const req = http.request(
      {
        host: BASE_HOST,
        port: BASE_PORT,
        path: "/api/register",
        method: "POST",
        headers: { "Content-Type": "application/json", "Content-Length": Buffer.byteLength(body) },
      },
      (res) => {
        res.on("data", () => {});
        res.on("end", () => resolve(res.statusCode));
      },
    );
    req.on("error", () => resolve("ERR"));
    req.write(body);
    req.end();
  });
}

async function main() {
  const lines = fs.readFileSync(CSV, "utf8").trim().split(/\r?\n/);
  lines.shift(); // drop header
  const users = lines.map((l) => {
    const [email, password] = l.split(",");
    return { email, password };
  });

  let ok = 0, fail = 0, done = 0;
  for (let i = 0; i < users.length; i += CONCURRENCY) {
    const batch = users.slice(i, i + CONCURRENCY);
    const codes = await Promise.all(batch.map(register));
    codes.forEach((c) => (c === 200 ? ok++ : fail++));
    done += batch.length;
    process.stdout.write(`\rregistered ${done}/${users.length} (ok=${ok} fail=${fail})`);
  }
  console.log(`\nDone. ${ok} registered, ${fail} failed.`);
}

main();
