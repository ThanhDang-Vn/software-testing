import fs from 'node:fs';
import path from 'node:path';

export type FieldName = 'email' | 'password';
export type CredentialProfile = 'customer' | 'admin';
export type PasswordProfile =
  | CredentialProfile
  | 'synthetic-valid'
  | 'synthetic-wrong'
  | 'case-changed'
  | 'empty';
export type ActionName =
  | 'login'
  | 'invalid-login'
  | 'required-field'
  | 'input-contract'
  | 'failures-then-success'
  | 'lock-after-failures'
  | 'locked-message'
  | 'lock-expiry';

export interface LoginLockoutCase {
  id: string;
  category: string;
  action: ActionName;
  description: string;
  email?: string;
  emailTemplate?: string;
  emailProfile?: CredentialProfile;
  emailDecoration?: 'spaces';
  credentialProfile?: CredentialProfile;
  passwordProfile?: PasswordProfile;
  expectedUserProfile?: CredentialProfile;
  field?: FieldName;
  expectedUrl?: string;
  expectedError?: string;
  expectedValidationMessage?: boolean;
  expectedType?: string;
  expectedRequired?: boolean;
  failedAttempts?: number;
  expectedStatus?: number;
  waitMilliseconds?: number;
}

const actions = new Set<ActionName>([
  'login',
  'invalid-login',
  'required-field',
  'input-contract',
  'failures-then-success',
  'lock-after-failures',
  'locked-message',
  'lock-expiry'
]);
const credentialProfiles = new Set<CredentialProfile>(['customer', 'admin']);
const passwordProfiles = new Set<PasswordProfile>([
  'customer',
  'admin',
  'synthetic-valid',
  'synthetic-wrong',
  'case-changed',
  'empty'
]);

function invalid(id: string, message: string): never {
  throw new Error(`FR-02 data ${id}: ${message}`);
}

function requireString(item: LoginLockoutCase, key: keyof LoginLockoutCase): void {
  if (typeof item[key] !== 'string' || String(item[key]).length === 0) {
    invalid(item.id, `${String(key)} must be a non-empty string for action ${item.action}`);
  }
}

function requireAttempts(item: LoginLockoutCase): void {
  if (!Number.isInteger(item.failedAttempts) || (item.failedAttempts ?? -1) < 0) {
    invalid(item.id, `failedAttempts must be a non-negative integer for action ${item.action}`);
  }
}

function validateActionFields(item: LoginLockoutCase): void {
  const hasEmailSource =
    item.email !== undefined || item.emailTemplate !== undefined || item.emailProfile !== undefined;

  switch (item.action) {
    case 'login':
      if (!item.credentialProfile) invalid(item.id, 'credentialProfile is required for login');
      if (!item.expectedUserProfile) invalid(item.id, 'expectedUserProfile is required for login');
      requireString(item, 'expectedUrl');
      break;
    case 'invalid-login':
      if (!hasEmailSource) invalid(item.id, 'an email, emailTemplate, or emailProfile is required');
      if (!item.passwordProfile) invalid(item.id, 'passwordProfile is required');
      requireString(item, 'expectedError');
      break;
    case 'required-field':
      if (!item.field) invalid(item.id, 'field is required');
      if (!hasEmailSource) invalid(item.id, 'an email, emailTemplate, or emailProfile is required');
      if (!item.passwordProfile) invalid(item.id, 'passwordProfile is required');
      if (typeof item.expectedValidationMessage !== 'boolean') {
        invalid(item.id, 'expectedValidationMessage must be boolean');
      }
      break;
    case 'input-contract':
      if (!item.field) invalid(item.id, 'field is required');
      requireString(item, 'expectedType');
      if (typeof item.expectedRequired !== 'boolean') {
        invalid(item.id, 'expectedRequired must be boolean');
      }
      break;
    case 'failures-then-success':
      requireString(item, 'emailTemplate');
      requireAttempts(item);
      requireString(item, 'expectedUrl');
      break;
    case 'lock-after-failures':
      requireString(item, 'emailTemplate');
      requireAttempts(item);
      if (!Number.isInteger(item.expectedStatus)) invalid(item.id, 'expectedStatus must be an integer');
      break;
    case 'locked-message':
      requireString(item, 'emailTemplate');
      requireAttempts(item);
      requireString(item, 'expectedError');
      break;
    case 'lock-expiry':
      requireString(item, 'emailTemplate');
      requireAttempts(item);
      requireString(item, 'expectedUrl');
      if (!Number.isInteger(item.waitMilliseconds) || (item.waitMilliseconds ?? 0) <= 0) {
        invalid(item.id, 'waitMilliseconds must be a positive integer');
      }
      break;
  }
}

export function loadLoginLockoutCases(): LoginLockoutCase[] {
  const dataPath = path.resolve('test-data/fr02-login-lockout.json');
  const parsed: unknown = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
  if (!Array.isArray(parsed)) throw new Error(`${dataPath} must contain a JSON array`);

  const cases = parsed as LoginLockoutCase[];
  if (cases.length < 12) throw new Error(`FR-02 requires at least 12 cases; found ${cases.length}`);

  const ids = new Set<string>();
  for (const item of cases) {
    if (!item.id || !item.description || !item.category || !actions.has(item.action)) {
      throw new Error(`Invalid FR-02 data record: ${JSON.stringify(item)}`);
    }
    if (ids.has(item.id)) throw new Error(`Duplicate test case ID: ${item.id}`);
    const raw = item as LoginLockoutCase & Record<string, unknown>;
    if (Object.hasOwn(raw, 'password') || Object.hasOwn(raw, 'expectedUserName')) {
      invalid(item.id, 'raw credentials/names are forbidden; use symbolic profiles');
    }
    if (item.credentialProfile && !credentialProfiles.has(item.credentialProfile)) {
      invalid(item.id, `unknown credentialProfile ${item.credentialProfile}`);
    }
    if (item.emailProfile && !credentialProfiles.has(item.emailProfile)) {
      invalid(item.id, `unknown emailProfile ${item.emailProfile}`);
    }
    if (item.expectedUserProfile && !credentialProfiles.has(item.expectedUserProfile)) {
      invalid(item.id, `unknown expectedUserProfile ${item.expectedUserProfile}`);
    }
    if (item.passwordProfile && !passwordProfiles.has(item.passwordProfile)) {
      invalid(item.id, `unknown passwordProfile ${item.passwordProfile}`);
    }
    if (item.emailTemplate && !item.emailTemplate.includes('{run}')) {
      invalid(item.id, 'emailTemplate must include the {run} isolation token');
    }
    validateActionFields(item);
    ids.add(item.id);
  }
  return cases;
}
