import fs from 'node:fs';
import path from 'node:path';

export interface SuiteCase {
  id: string;
  action: string;
  description: string;
  name?: string;
  expectedStatus?: number;
  totalAmount?: number;
  shippingAddress?: string;
  fixtureProfile?: string;
  missingId?: number;
}

export interface OrderFixture {
  id: number;
  total_amount: number;
  status: string;
  created_at: string;
}

export interface OrderFixtureProfile {
  orders: OrderFixture[];
  expectedFirstOrderId: number;
  expectedRawDate: string;
  expectedTotalAmount: number;
  expectedStatusLabels: string[];
  expectedStatusClassCount: number;
  expectedCancelButtonCount: number;
  nonCancellableOrderIds: number[];
}

function invalid(feature: string, id: string, message: string): never {
  throw new Error(`${feature} data ${id}: ${message}`);
}

function requireStatus(feature: string, item: SuiteCase): void {
  if (!Number.isInteger(item.expectedStatus)) {
    invalid(feature, item.id, `expectedStatus must be an integer for action ${item.action}`);
  }
}

function requireName(feature: string, item: SuiteCase): void {
  if (typeof item.name !== 'string' || item.name.length === 0) {
    invalid(feature, item.id, `name must be a non-empty synthetic value for action ${item.action}`);
  }
}

function validateFr11(item: SuiteCase): void {
  if (item.action.startsWith('api-') && item.action !== 'api-ownership') requireStatus('FR-11', item);
  if (item.action.startsWith('ui-') && !item.fixtureProfile) {
    invalid('FR-11', item.id, `fixtureProfile is required for action ${item.action}`);
  }
  if (item.action === 'api-ownership') {
    requireStatus('FR-11', item);
    if (typeof item.totalAmount !== 'number' || item.totalAmount <= 0) {
      invalid('FR-11', item.id, 'totalAmount must be a positive number');
    }
    if (typeof item.shippingAddress !== 'string' || item.shippingAddress.length === 0) {
      invalid('FR-11', item.id, 'shippingAddress must be a non-empty synthetic value');
    }
  }
}

function validateFr14(item: SuiteCase): void {
  const actionsRequiringStatus = new Set([
    'api-list', 'api-create', 'api-empty', 'api-whitespace', 'api-no-token',
    'api-delete-missing', 'api-delete-success', 'api-customer-token'
  ]);
  const actionsRequiringName = new Set([
    'api-create', 'api-whitespace', 'api-no-token', 'api-delete-success',
    'api-customer-token', 'ui-delete-observation', 'ui-create-view', 'ui-delete-success'
  ]);
  if (actionsRequiringStatus.has(item.action)) requireStatus('FR-14', item);
  if (actionsRequiringName.has(item.action)) requireName('FR-14', item);
  if (item.action === 'api-delete-missing' && !Number.isInteger(item.missingId)) {
    invalid('FR-14', item.id, 'missingId must be an integer');
  }
}

export function loadSuiteCases(fileName: string, feature: string): SuiteCase[] {
  const filePath = path.resolve('test-data', fileName);
  const parsed: unknown = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  if (!Array.isArray(parsed)) throw new Error(`${filePath} must contain an array`);
  const cases = parsed as SuiteCase[];
  if (cases.length < 12) throw new Error(`${feature} requires at least 12 cases`);
  const ids = new Set<string>();
  for (const item of cases) {
    if (!item.id || !item.action || !item.description || ids.has(item.id)) {
      throw new Error(`Invalid or duplicate ${feature} record: ${JSON.stringify(item)}`);
    }
    const raw = item as SuiteCase & Record<string, unknown>;
    for (const forbidden of ['email', 'password', 'otherPassword', 'userName']) {
      if (Object.hasOwn(raw, forbidden)) {
        invalid(feature, item.id, `${forbidden} is forbidden in JSON; use environment variables`);
      }
    }
    if (feature === 'FR-11') validateFr11(item);
    if (feature === 'FR-14') validateFr14(item);
    ids.add(item.id);
  }
  return cases;
}

export function loadOrderFixture(profile: string): OrderFixtureProfile {
  const filePath = path.resolve('test-data/fr11-order-fixtures.json');
  const parsed = JSON.parse(fs.readFileSync(filePath, 'utf8')) as Record<string, OrderFixtureProfile>;
  const fixture = parsed[profile];
  if (!fixture) throw new Error(`FR-11 fixture profile ${profile} does not exist in ${filePath}`);
  if (!Array.isArray(fixture.orders) || fixture.orders.length === 0) {
    throw new Error(`FR-11 fixture ${profile}: orders must be a non-empty array`);
  }
  const ids = new Set<number>();
  for (const [index, order] of fixture.orders.entries()) {
    if (!Number.isInteger(order.id) || ids.has(order.id)) {
      throw new Error(`FR-11 fixture ${profile}: order ${index} has an invalid or duplicate id`);
    }
    if (typeof order.total_amount !== 'number' || order.total_amount < 0) {
      throw new Error(`FR-11 fixture ${profile}: order ${order.id} has invalid total_amount`);
    }
    if (!order.status || !order.created_at || Number.isNaN(Date.parse(order.created_at))) {
      throw new Error(`FR-11 fixture ${profile}: order ${order.id} has invalid status/created_at`);
    }
    ids.add(order.id);
  }
  if (!Array.isArray(fixture.expectedStatusLabels) || fixture.expectedStatusLabels.length === 0) {
    throw new Error(`FR-11 fixture ${profile}: expectedStatusLabels must be non-empty`);
  }
  if (!Array.isArray(fixture.nonCancellableOrderIds)
      || fixture.nonCancellableOrderIds.some(id => !ids.has(id))) {
    throw new Error(`FR-11 fixture ${profile}: nonCancellableOrderIds must reference fixture orders`);
  }
  return fixture;
}
