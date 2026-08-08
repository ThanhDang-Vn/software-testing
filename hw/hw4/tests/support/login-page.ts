import { expect, type Locator, type Page } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly form: Locator;
  readonly email: Locator;
  readonly password: Locator;
  readonly submit: Locator;

  constructor(page: Page) {
    this.page = page;
    // A form only receives the ARIA form role when it has an accessible name.
    // The SUT form has none, so the stable native element is the best available anchor.
    this.form = page.locator('form');
    // The SUT labels are not associated with their inputs, so semantic
    // getByLabel locators are impossible until the product defect is fixed.
    this.email = this.form.getByText('Username', { exact: true }).locator('..').locator('input');
    this.password = this.form.getByText('Mật khẩu', { exact: true }).locator('..').locator('input');
    this.submit = this.form.getByRole('button', { name: 'Sign In' });
  }

  async open(): Promise<void> {
    await this.page.goto('/login');
    await expect(this.form).toBeVisible();
  }

  async submitCredentials(email: string, password: string): Promise<void> {
    await this.email.fill(email);
    await this.password.fill(password);
    await this.submit.click();
  }

  errorMessage(): Locator {
    return this.page.getByText(/Đăng nhập thất bại|Tài khoản đã bị khóa/);
  }
}
