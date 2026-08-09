import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { chromium } from '@playwright/test';

const studentId = process.env.STUDENT_ID ?? '23127334';
const features = [
  { slug: 'fr02-login-lockout', name: 'FR-02 Login & Account Lockout', spec: 'tests/fr02-login-lockout.spec.ts' },
  { slug: 'fr11-order-history', name: 'FR-11 Order History View', spec: 'tests/fr11-order-history.spec.ts' },
  { slug: 'fr14-category-crud', name: 'FR-14 Category Management CRUD', spec: 'tests/fr14-category-crud.spec.ts' }
];
const browsers = ['chromium', 'firefox', 'webkit'];
const startedAt = new Date().toISOString();
const results = [];
const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const projectDirectory = path.resolve(scriptDirectory, '..');
const playwrightCli = path.join(
  projectDirectory,
  'node_modules',
  '@playwright',
  'test',
  'cli.js'
);

async function verifyVisibleLabel(indexPath, label) {
  if (!fs.existsSync(indexPath)) return false;
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage();
    await page.goto(pathToFileURL(indexPath).href);
    await page.waitForLoadState('domcontentloaded');
    const visibleText = await page.locator('body').innerText();
    const documentTitle = await page.title();
    return visibleText.includes(label) || documentTitle.includes(label);
  } finally {
    await browser.close();
  }
}

function collectTests(suites) {
  const tests = [];
  for (const suite of suites ?? []) {
    for (const spec of suite.specs ?? []) {
      tests.push(...(spec.tests ?? []).map(test => ({ ...test, specTitle: spec.title })));
    }
    tests.push(...collectTests(suite.suites));
  }
  return tests;
}

function readCounts(jsonPath) {
  if (!fs.existsSync(jsonPath)) return null;
  const report = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
  const tests = collectTests(report.suites);
  const counts = { passed: 0, failed: 0, skipped: 0, durationMs: 0 };
  const failureSignatures = [];
  for (const test of tests) {
    const last = test.results?.at(-1);
    const status = last?.status ?? 'skipped';
    counts.durationMs += last?.duration ?? 0;
    if (status === 'passed') counts.passed += 1;
    else if (status === 'skipped') counts.skipped += 1;
    else {
      counts.failed += 1;
      failureSignatures.push({
        title: test.specTitle,
        status,
        error: last?.error?.message?.split('\n')[0] ?? 'No error message recorded'
      });
    }
  }
  return { ...counts, total: tests.length, failureSignatures };
}

for (const feature of features) {
for (const browser of browsers) {
  const timestamp = new Date().toISOString();
  const reportFolder = path.join('reports', 'html', feature.slug, browser);
  const jsonPath = path.resolve('reports', 'json', feature.slug, `${browser}.json`);
  fs.mkdirSync(path.dirname(jsonPath), { recursive: true });
  const run = spawnSync(
    process.execPath,
    [playwrightCli, 'test', feature.spec, '--project', browser],
    {
      stdio: 'inherit',
      cwd: projectDirectory,
      env: {
        ...process.env,
        STUDENT_ID: studentId,
        REPORT_FEATURE: feature.name,
        REPORT_BROWSER: browser,
        REPORT_TIMESTAMP: timestamp,
        REPORT_FOLDER: reportFolder,
        REPORT_JSON: jsonPath
      }
    }
  );

  const indexPath = path.resolve(reportFolder, 'index.html');
  const reportExists = fs.existsSync(indexPath);
  const label = `Run by: ${studentId}`;
  const labelVerified = await verifyVisibleLabel(indexPath, label);
  const counts = readCounts(jsonPath);
  results.push({
    feature: feature.name,
    browser,
    startedAt: timestamp,
    exitCode: run.status ?? 1,
    report: path.relative(projectDirectory, indexPath),
    reportExists,
    jsonReport: path.relative(projectDirectory, jsonPath),
    counts,
    label,
    labelVerified
  });
}
}

const manifest = {
  studentId,
  startedAt,
  finishedAt: new Date().toISOString(),
  results
};
fs.mkdirSync(path.join('reports'), { recursive: true });
fs.writeFileSync(
  path.join('reports', 'run-manifest.json'),
  `${JSON.stringify(manifest, null, 2)}\n`
);

for (const result of results) {
  console.log(
    `${result.feature} | ${result.browser} | exit=${result.exitCode} | ` +
      `label=${result.labelVerified ? 'verified' : 'missing'} | ` +
      `counts=${JSON.stringify(result.counts)} | ${result.report}`
  );
}

process.exit(
  results.some(
    (result) => !result.reportExists || !result.labelVerified || result.counts === null
  )
    ? 1
    : 0
);
