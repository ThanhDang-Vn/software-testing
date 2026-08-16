import { expect, test, type APIRequestContext, type Page } from '@playwright/test';
import { LoginPage } from './support/login-page.js';
import {
  loadLoginLockoutCases,
  type CredentialProfile,
  type FieldName,
  type LoginLockoutCase,
  type PasswordProfile
} from './support/test-data.js';

const cases = loadLoginLockoutCases();
const backendUrl = process.env.API_BASE_URL ?? 'http://127.0.0.1:3000';
const runId = `${Date.now()}-${process.pid}`.replace(/\D/g, '');

const credentialEnvironment: Record<CredentialProfile, {
  email: string;
  password: string;
  userName: string;
}> = {
  customer: {
    email: 'FR02_CUSTOMER_EMAIL',
    password: 'FR02_CUSTOMER_PASSWORD',
    userName: 'FR02_CUSTOMER_NAME'
  },
  admin: {
    email: 'FR02_ADMIN_EMAIL',
    password: 'FR02_ADMIN_PASSWORD',
    userName: 'FR02_ADMIN_NAME'
  }
};

function requiredEnvironment(name: string, caseId: string): string {
  const value = process.env[name];
  if (value === undefined || value.length === 0) {
    throw new Error(`${caseId}: required environment variable ${name} is missing`);
  }
  return value;
}

function credentialValue(
  profile: CredentialProfile,
  key: 'email' | 'password' | 'userName',
  caseId: string
): string {
  return requiredEnvironment(credentialEnvironment[profile][key], caseId);
}

function validPassword(caseId: string): string {
  return requiredEnvironment('FR02_SYNTHETIC_VALID_PASSWORD', caseId);
}

function wrongPassword(caseId: string): string {
  return requiredEnvironment('FR02_SYNTHETIC_WRONG_PASSWORD', caseId);
}

function caseEmail(item: LoginLockoutCase): string {
  const profile = item.credentialProfile ?? item.emailProfile;
  const raw = profile
    ? credentialValue(profile, 'email', item.id)
    : item.emailTemplate?.replace('{run}', `${runId}-${item.id.toLowerCase()}`) ?? item.email;
  if (raw === undefined) throw new Error(`${item.id}: email or emailTemplate is required`);
  return item.emailDecoration === 'spaces' ? ` ${raw} ` : raw;
}

function casePassword(item: LoginLockoutCase): string {
  const profile: PasswordProfile | undefined = item.credentialProfile ?? item.passwordProfile;
  if (!profile) throw new Error(`${item.id}: credentialProfile or passwordProfile is required`);
  if (profile === 'customer' || profile === 'admin') {
    return credentialValue(profile, 'password', item.id);
  }
  if (profile === 'synthetic-valid') return validPassword(item.id);
  if (profile === 'synthetic-wrong') return wrongPassword(item.id);
  if (profile === 'case-changed') return validPassword(item.id).toLowerCase();
  return '';
}

function expectedUserName(item: LoginLockoutCase): string {
  if (!item.expectedUserProfile) {
    throw new Error(`${item.id}: expectedUserProfile is required`);
  }
  return credentialValue(item.expectedUserProfile, 'userName', item.id);
}

async function registerAccount(request: APIRequestContext, email: string): Promise<void> {
  const response = await request.post(`${backendUrl}/api/register`, {
    data: {
      name: requiredEnvironment('FR02_SYNTHETIC_USER_NAME', 'FR-02 setup'),
      email: email.trim(),
      password: validPassword('FR-02 setup')
    }
  });
  expect(response.ok(), `Unable to register isolated account ${email}`).toBe(true);
}

async function loginApi(
  request: APIRequestContext,
  email: string,
  password: string
): Promise<number> {
  const response = await request.post(`${backendUrl}/api/login`, {
    data: { email, password }
  });
  return response.status();
}

async function failLogin(page: Page, email: string, caseId: string): Promise<void> {
  const login = new LoginPage(page);
  await login.open();
  await login.submitCredentials(email, wrongPassword(caseId));
  await expect(login.errorMessage()).toBeVisible();
}

function target(page: LoginPage, field: FieldName) {
  return field === 'email' ? page.email : page.password;
}

test.describe('FR-02 Login & Account Lockout', () => {
  for (const item of cases) {
    test(`${item.id} [${item.category}] ${item.description}`, async ({ page, request }) => {
      const login = new LoginPage(page);

      switch (item.action) {
        case 'login': {
          await login.open();
          await login.submitCredentials(caseEmail(item), casePassword(item));
          await expect(page).toHaveURL(new RegExp(`${item.expectedUrl}$`));
          await expect(page.getByText(`Chào, ${expectedUserName(item)}`)).toBeVisible();
          const token = await page.evaluate(() => localStorage.getItem('token'));
          expect(token).toEqual(expect.any(String));
          break;
        }

        case 'invalid-login': {
          const email = caseEmail(item);
          if (item.emailTemplate) await registerAccount(request, email);
          await login.open();
          await login.submitCredentials(email, casePassword(item));
          await expect(login.errorMessage()).toHaveText(item.expectedError ?? '');
          await expect(page).toHaveURL(/\/login$/);
          break;
        }

        case 'required-field': {
          if (!item.field) throw new Error(`${item.id}: field is required`);
          await login.open();
          await login.submitCredentials(caseEmail(item), casePassword(item));
          const field = target(login, item.field);
          await expect(field).toHaveAttribute('required', '');
          const validationMessage = await field.evaluate(
            (element: HTMLInputElement) => element.validationMessage
          );
          expect(Boolean(validationMessage)).toBe(item.expectedValidationMessage);
          await expect(page).toHaveURL(/\/login$/);
          break;
        }

        case 'input-contract': {
          if (!item.field) throw new Error(`${item.id}: field is required`);
          await login.open();
          const field = target(login, item.field);
          await expect(field).toHaveAttribute('type', item.expectedType ?? '');
          if (item.expectedRequired) await expect(field).toHaveAttribute('required', '');
          break;
        }

        case 'failures-then-success': {
          const email = caseEmail(item);
          await registerAccount(request, email);
          for (let attempt = 0; attempt < (item.failedAttempts ?? 0); attempt += 1) {
            await failLogin(page, email, item.id);
          }
          await login.open();
          await login.submitCredentials(email, validPassword(item.id));
          await expect(page).toHaveURL(new RegExp(`${item.expectedUrl}$`));
          break;
        }

        case 'lock-after-failures': {
          const email = caseEmail(item);
          await registerAccount(request, email);
          for (let attempt = 0; attempt < (item.failedAttempts ?? 0); attempt += 1) {
            expect(await loginApi(request, email, wrongPassword(item.id))).toBe(401);
          }
          expect(await loginApi(request, email, validPassword(item.id))).toBe(item.expectedStatus);
          break;
        }

        case 'locked-message': {
          const email = caseEmail(item);
          await registerAccount(request, email);
          for (let attempt = 0; attempt < (item.failedAttempts ?? 0); attempt += 1) {
            await loginApi(request, email, wrongPassword(item.id));
          }
          await login.open();
          await login.submitCredentials(email, validPassword(item.id));
          await expect(login.errorMessage()).toHaveText(item.expectedError ?? '');
          break;
        }

        case 'lock-expiry': {
          const email = caseEmail(item);
          await registerAccount(request, email);
          for (let attempt = 0; attempt < (item.failedAttempts ?? 0); attempt += 1) {
            await loginApi(request, email, wrongPassword(item.id));
          }
          const unlockDeadline = Date.now() + (item.waitMilliseconds ?? 31_000);
          // This is the FR-02 business lock window, not a UI synchronization delay.
          // Polling the clock keeps the reason explicit and avoids Playwright's discouraged fixed sleep.
          await expect.poll(() => Date.now(), {
            message: `${item.id}: wait for the configured account-lock window to expire`,
            timeout: (item.waitMilliseconds ?? 31_000) + 5_000,
            intervals: [1_000]
          }).toBeGreaterThanOrEqual(unlockDeadline);
          await login.open();
          await login.submitCredentials(email, validPassword(item.id));
          await expect(page).toHaveURL(new RegExp(`${item.expectedUrl}$`));
          break;
        }

        default: {
          const exhaustive: never = item.action;
          throw new Error(`Unsupported action: ${exhaustive}`);
        }
      }
    });
  }
});
