import { defineConfig, devices } from '@playwright/test';

/**
 * Cau hinh Playwright cho SnapBid.
 * Tai lieu: https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './tests',
  // Chay song song cac file test
  fullyParallel: true,
  // Cam .only khi chay tren CI
  forbidOnly: !!process.env.CI,
  // So lan chay lai khi that bai (CI retry 2 lan)
  retries: process.env.CI ? 2 : 0,
  // So worker (CI gioi han 1 de on dinh)
  workers: process.env.CI ? 1 : undefined,

  // Bao cao HTML: xem bang `npx playwright show-report`
  reporter: [['html', { open: 'never' }], ['list']],

  use: {
    // URL goc cua ung dung duoi kiem thu -> page.goto('/') se mo trang nay
    baseURL: 'https://snapbid-online-auction.vercel.app',
    // Luu trace o lan chay lai dau tien de go loi (mo bang trace viewer)
    trace: 'on-first-retry',
    // Chup anh khi test that bai
    screenshot: 'only-on-failure',
    // Quay video khi test that bai
    video: 'retain-on-failure',
    // Thoi gian cho mac dinh cho cac action
    actionTimeout: 15_000,
    navigationTimeout: 30_000,
  },

  // Chay tren nhieu trinh duyet (cross-browser)
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox',  use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit',   use: { ...devices['Desktop Safari'] } },
  ],
});
