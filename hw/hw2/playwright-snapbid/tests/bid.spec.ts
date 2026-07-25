import { test, expect } from '@playwright/test';

/**
 * Kich ban: "Dat gia dau gia thanh cong" tren SnapBid.
 * Di qua nhieu man hinh: Login -> Auctions -> Auction Detail -> Place Bid.
 *
 * LUU Y VE SELECTOR:
 * SnapBid la ung dung SPA (React) nen selector duoi day mang tinh minh hoa
 * theo luong chuan. Hay xac nhan lai bang:
 *     npx playwright codegen https://snapbid-online-auction.vercel.app/
 * roi thay cac locator cho khop DOM that. Nen uu tien locator theo
 * vai tro / nhan / van ban (getByRole, getByLabel, getByText) de ben hon.
 */

// Tai khoan demo -- doi lai cho dung tai khoan that cua ban
const USER = process.env.SNAPBID_USER ?? 'buyer@example.com';
const PASS = process.env.SNAPBID_PASS ?? 'Test@1234';

test.describe('SnapBid - dau gia', () => {
  test('Dat gia dau gia thanh cong', async ({ page }) => {
    // 1. Mo trang chu (dung baseURL trong config)
    await page.goto('/');

    // 2. Dang nhap
    await page.getByRole('link', { name: /log in|sign in|dang nhap/i }).click();
    await page.getByLabel(/email/i).fill(USER);
    await page.getByLabel(/password|mat khau/i).fill(PASS);
    await page.getByRole('button', { name: /log in|sign in|dang nhap/i }).click();

    // 3. Duyet danh sach & mo chi tiet mot phien dau gia
    await page.getByRole('link', { name: /auctions|explore|browse/i }).click();
    await page.locator('[data-testid="auction-card"], .auction-card').first().click();

    // 4. Kiem tra dang o trang chi tiet (co gia hien tai)
    await expect(page.getByText(/current bid|gia hien tai/i)).toBeVisible();

    // 5. Dat gia cao hon gia hien tai
    await page.getByPlaceholder(/your bid|bid amount|nhap gia/i).fill('1500000');
    await page.getByRole('button', { name: /place bid|bid now|dat gia/i }).click();

    // 6. Assert: bao dat gia thanh cong
    await expect(
      page.getByText(/bid placed|success|dat gia thanh cong/i)
    ).toBeVisible();
  });

  test('Dang nhap sai mat khau bao loi', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: /log in|sign in|dang nhap/i }).click();
    await page.getByLabel(/email/i).fill(USER);
    await page.getByLabel(/password|mat khau/i).fill('wrong-password');
    await page.getByRole('button', { name: /log in|sign in|dang nhap/i }).click();

    // Ky vong hien thong bao loi (dieu chinh text cho khop ung dung)
    await expect(
      page.getByText(/invalid|incorrect|sai|khong dung/i)
    ).toBeVisible();
  });
});
