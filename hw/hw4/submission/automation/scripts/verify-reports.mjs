import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { chromium } from '@playwright/test';

const studentId = process.env.STUDENT_ID ?? '23127334';
const label = `Run by: ${studentId}`;
const manifestPath = path.resolve('reports/run-manifest.json');
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
const browser = await chromium.launch();
const expectedFeatures = [
  'FR-02 Login & Account Lockout',
  'FR-11 Order History View',
  'FR-14 Category Management CRUD'
];
const expectedBrowsers = ['chromium', 'firefox', 'webkit'];
const expectedKeys = new Set(expectedFeatures.flatMap(feature =>
  expectedBrowsers.map(project => `${feature}|${project}`)
));
const actualKeys = new Set(manifest.results.map(result => `${result.feature}|${result.browser}`));
if (manifest.results.length !== 9 || expectedKeys.size !== actualKeys.size
    || [...expectedKeys].some(key => !actualKeys.has(key))) {
  throw new Error('Manifest must contain exactly one entry for each of the 9 feature/browser runs');
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

try {
  for (const result of manifest.results) {
    const resolvedJsonReport = path.resolve(result.jsonReport);
    const resolvedReport = path.resolve(result.report);
    result.counts = readCounts(resolvedJsonReport);
    result.reportExists = fs.existsSync(resolvedReport);
    if (!result.reportExists) {
      result.labelVerified = false;
      continue;
    }
    const page = await browser.newPage();
    await page.goto(pathToFileURL(resolvedReport).href);
    await page.waitForLoadState('domcontentloaded');
    const body = await page.locator('body').innerText();
    const title = await page.title();
    result.label = label;
    result.labelVerified = body.includes(label) || title.includes(label);
    result.visibleTitle = title;
    result.metadataVerified = title.includes(result.feature)
      && title.includes(result.browser)
      && title.includes(result.startedAt)
      && !Number.isNaN(Date.parse(result.startedAt));
    result.countsVerified = result.counts !== null
      && result.counts.total === result.counts.passed + result.counts.failed + result.counts.skipped
      && fs.existsSync(resolvedJsonReport);
    result.report = path.relative(process.cwd(), resolvedReport);
    result.jsonReport = path.relative(process.cwd(), resolvedJsonReport);
    await page.close();
  }
} finally {
  await browser.close();
}

manifest.reportVerificationAt = new Date().toISOString();
fs.writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);

for (const result of manifest.results) {
  console.log(
    `${result.feature} | ${result.browser}: label=${result.labelVerified ? 'verified' : 'missing'} | ` +
      `metadata=${result.metadataVerified ? 'verified' : 'invalid'} | ` +
      `counts=${result.countsVerified ? 'verified' : 'invalid'} | ` +
      `${result.visibleTitle ?? '(no title)'}`
  );
}

process.exit(manifest.results.every((result) =>
  result.reportExists && result.labelVerified && result.metadataVerified && result.countsVerified
) ? 0 : 1);
