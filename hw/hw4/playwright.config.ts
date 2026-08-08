import { defineConfig, devices, type ReporterDescription } from '@playwright/test';
import path from 'node:path';

const studentId = process.env.STUDENT_ID ?? '23127334';
const featureName = process.env.REPORT_FEATURE ?? 'FR-02 Login & Account Lockout';
const browserName = process.env.REPORT_BROWSER ?? 'all-browsers';
const runTimestamp = process.env.REPORT_TIMESTAMP ?? new Date().toISOString();
const reportFolder =
  process.env.REPORT_FOLDER ??
  path.join('reports', 'html', 'fr02-login-lockout', browserName);
const selectedBaseUrl =
  featureName.startsWith('FR-14')
    ? (process.env.ADMIN_BASE_URL ?? 'http://127.0.0.1:5174')
    : (process.env.WEB_BASE_URL ?? 'http://127.0.0.1:5173');
const reporters: ReporterDescription[] = [
  ['list'],
  ['html', {
    open: 'never',
    outputFolder: reportFolder,
    title: `Run by: ${studentId} | ${featureName} | ${browserName} | ${runTimestamp}`
  }]
];
if (process.env.REPORT_JSON) {
  reporters.push(['json', { outputFile: process.env.REPORT_JSON }]);
}

export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  workers: 1,
  retries: 0,
  timeout: 45_000,
  expect: { timeout: 5_000 },
  outputDir: path.join('test-results', browserName),
  reporter: reporters,
  use: {
    baseURL: selectedBaseUrl,
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
    video: 'retain-on-failure'
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } }
  ]
});
