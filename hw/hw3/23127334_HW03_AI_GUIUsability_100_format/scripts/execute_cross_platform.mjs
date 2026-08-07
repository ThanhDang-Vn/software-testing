import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import playwright from "../../../hw4/node_modules/@playwright/test/index.js";

const { chromium, firefox, webkit, request } = playwright;
const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "..");
const screenshotDir = path.join(root, "task-3-cross-platform", "screenshots");
const resultPath = path.join(root, "task-3-cross-platform", "execution-results-local.json");
fs.mkdirSync(screenshotDir, { recursive: true });

const frontend = "http://localhost:5173";
const backend = "http://localhost:3000";
const identity = "23127334@hcmus.edu.vn";
const api = await request.newContext();
const loginSetup = await api.post(`${backend}/api/login`, {
  data: { email: "test@eshop.com", password: "Test1234!" },
});
if (!loginSetup.ok()) throw new Error(`Setup login failed: ${loginSetup.status()}`);
const auth = await loginSetup.json();
const orderSetup = await api.post(`${backend}/api/checkout`, {
  headers: { Authorization: `Bearer ${auth.token}` },
  data: { total_amount: 450000, shipping_address: "Cross-platform test address" },
});
if (!orderSetup.ok()) throw new Error(`Order setup failed: ${orderSetup.status()}`);

const configurations = [
  {
    id: "CP-01",
    browserName: "Google Chrome",
    browserType: chromium,
    osDevice: "Windows desktop",
    viewport: { width: 1366, height: 768 },
    launchOptions: { headless: true, channel: "chrome" },
  },
  {
    id: "CP-02",
    browserName: "Firefox",
    browserType: firefox,
    osDevice: "Windows desktop",
    viewport: { width: 1366, height: 768 },
  },
  {
    id: "CP-03",
    browserName: "WebKit",
    browserType: webkit,
    osDevice: "Windows desktop (WebKit engine; not Safari)",
    viewport: { width: 1366, height: 768 },
  },
];

const results = [];

for (const config of configurations) {
  const started = Date.now();
  let browser;
  try {
    browser = await config.browserType.launch(config.launchOptions || { headless: true });
    const context = await browser.newContext({ viewport: config.viewport });
    const page = await context.newPage();

    await page.goto(`${frontend}/login`);
    await page.locator("input").nth(0).fill("test@eshop.com");
    await page.locator("input").nth(1).fill("Test1234!");
    await page.locator('button[type="submit"]').click();
    await page.waitForURL(`${frontend}/`);

    await page.locator('a[href="/profile"]').click();
    await page.waitForURL(`${frontend}/profile`);
    await page.waitForLoadState("networkidle");

    const historyHeading = page.getByText("Lịch sử đơn hàng", { exact: true });
    const rows = page.locator("tbody tr");
    const rowCount = await rows.count();
    const fieldsPresent =
      rowCount > 0 &&
      (await rows.first().locator("td").count()) >= 4 &&
      (await historyHeading.isVisible());

    const browserVersion = browser.version();
    const overlay = [
      identity,
      `${config.id} · ${config.browserName} ${browserVersion}`,
      config.osDevice,
      `${frontend}/profile`,
    ].join(" | ");

    await page.evaluate((text) => {
      const banner = document.createElement("div");
      banner.id = "hw03-evidence-overlay";
      banner.textContent = text;
      Object.assign(banner.style, {
        position: "fixed",
        top: "0",
        left: "0",
        right: "0",
        zIndex: "2147483647",
        padding: "10px 14px",
        background: "#111827",
        color: "#ffffff",
        font: "bold 14px/1.4 Arial, sans-serif",
        borderBottom: "3px solid #f59e0b",
        textAlign: "center",
      });
      document.body.appendChild(banner);
    }, overlay);

    const screenshot = `${config.id}-${config.browserName.toLowerCase().replaceAll(" ", "-")}.png`;
    await page.screenshot({
      path: path.join(screenshotDir, screenshot),
      fullPage: true,
    });

    results.push({
      platformId: config.id,
      browser: config.browserName,
      version: browserVersion,
      osDevice: config.osDevice,
      flow: "Login → Profile → Order History",
      result: fieldsPresent ? "Passed" : "Failed",
      issues: fieldsPresent ? "No engine-specific functional failure observed." : "Order History or required row fields were not visible.",
      rowCount,
      screenshot: `screenshots/${screenshot}`,
      url: `${frontend}/profile`,
      identityOverlay: identity,
      durationMs: Date.now() - started,
    });

    await context.close();
    await browser.close();
  } catch (error) {
    if (browser) await browser.close();
    results.push({
      platformId: config.id,
      browser: config.browserName,
      version: "Unavailable",
      osDevice: config.osDevice,
      flow: "Login → Profile → Order History",
      result: "Blocked",
      issues: String(error.message || error),
      rowCount: 0,
      screenshot: "",
      url: `${frontend}/profile`,
      identityOverlay: identity,
      durationMs: Date.now() - started,
    });
  }
}

await api.dispose();
fs.writeFileSync(
  resultPath,
  JSON.stringify(
    {
      executedAt: new Date().toISOString(),
      frontend,
      identity,
      results,
    },
    null,
    2,
  ),
);
console.log(JSON.stringify(results));
