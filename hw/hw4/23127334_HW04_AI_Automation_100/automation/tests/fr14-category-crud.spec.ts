import { expect, test, type APIRequestContext, type Page } from '@playwright/test';
import { loadSuiteCases } from './support/suite-data.js';

const cases = loadSuiteCases('fr14-category-crud.json', 'FR-14');
const api = process.env.API_BASE_URL ?? 'http://127.0.0.1:3000';
const runId = `${Date.now()}-${process.pid}`;

function requiredEnvironment(name: string, caseId: string): string {
  const value = process.env[name];
  if (value === undefined || value.length === 0) {
    throw new Error(`${caseId}: required environment variable ${name} is missing`);
  }
  return value;
}

async function adminToken(request: APIRequestContext) {
  const response = await request.post(`${api}/api/login`, {
    data: {
      email: requiredEnvironment('FR14_ADMIN_EMAIL', 'FR-14 admin login'),
      password: requiredEnvironment('FR14_ADMIN_PASSWORD', 'FR-14 admin login')
    }
  });
  expect(response.ok()).toBe(true);
  return ((await response.json()) as { token: string }).token;
}

async function openAdmin(page: Page) {
  const token = await adminToken(page.request);
  await page.addInitScript(value => localStorage.setItem('adminToken', value), token);
  await page.goto('/');
  await categoryTab(page).click();
}

function categoryTab(page: Page) {
  // The checked-in SUT renders the Vietnamese suffix with mojibake. Anchor on
  // its semantic listitem role and stable ASCII prefix instead of corrupted bytes.
  return page.getByRole('listitem').filter({ hasText: /^Danh/ });
}

function categoryRow(page: Page, name: string) {
  return page.getByRole('row').filter({
    has: page.getByRole('cell', { name, exact: true })
  });
}

async function findCategoryId(request: APIRequestContext, name: string): Promise<number | undefined> {
  const response = await request.get(`${api}/api/categories`);
  const categories = (await response.json()) as Array<{ id: number; name: string }>;
  return categories.find(category => category.name === name)?.id;
}

async function cleanupCategory(request: APIRequestContext, name: string): Promise<void> {
  const id = await findCategoryId(request, name);
  if (id === undefined) return;
  const token = await adminToken(request);
  await request.delete(`${api}/api/categories/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
}

test.describe('FR-14 Category Management CRUD', () => {
  for (const item of cases) {
    test(`${item.id} ${item.description}`, async ({ page, request }) => {
      if (item.action === 'api-list') {
        const response = await request.get(`${api}/api/categories`);
        expect(response.status()).toBe(item.expectedStatus);
        expect(Array.isArray(await response.json())).toBe(true);
        return;
      }
      if (item.action === 'api-customer-token') {
        const email = `fr14-customer-${runId}-${item.id.toLowerCase()}@eshop.com`;
        const password = requiredEnvironment('FR14_CUSTOMER_PASSWORD', item.id);
        const registration = await request.post(`${api}/api/register`, {
          data: {
            name: requiredEnvironment('FR14_SYNTHETIC_USER_NAME', item.id),
            email,
            password
          }
        });
        expect(registration.ok()).toBe(true);
        const authentication = await request.post(`${api}/api/login`, {
          data: { email, password }
        });
        expect(authentication.ok()).toBe(true);
        const customerToken = ((await authentication.json()) as { token: string }).token;
        const uniqueName = `${item.name}-${runId}-${item.id}`;
        const response = await request.post(`${api}/api/categories`, {
          headers: { Authorization: `Bearer ${customerToken}` },
          data: { name: uniqueName }
        });
        await cleanupCategory(request, uniqueName);
        expect(response.status()).toBe(item.expectedStatus);
        return;
      }
      if (item.action === 'api-delete-success') {
        const token = await adminToken(request);
        const headers = { Authorization: `Bearer ${token}` };
        const uniqueName = `${item.name}-${runId}-${item.id}`;
        const creation = await request.post(`${api}/api/categories`, {
          headers,
          data: { name: uniqueName }
        });
        expect(creation.ok()).toBe(true);
        const { id } = (await creation.json()) as { id: number };
        const deletion = await request.delete(`${api}/api/categories/${id}`, { headers });
        expect(deletion.status()).toBe(item.expectedStatus);
        const list = await request.get(`${api}/api/categories`);
        expect(await list.json()).not.toEqual(
          expect.arrayContaining([expect.objectContaining({ id })])
        );
        return;
      }
      if (item.action === 'api-update') {
        const token = await adminToken(request);
        const headers = { Authorization: `Bearer ${token}` };
        const originalName = `${item.name}-${runId}-${item.id}`;
        const updatedName = `${item.name}Renamed-${runId}-${item.id}`;
        const creation = await request.post(`${api}/api/categories`, {
          headers,
          data: { name: originalName }
        });
        expect(creation.ok()).toBe(true);
        const { id } = (await creation.json()) as { id: number };
        try {
          const update = await request.put(`${api}/api/categories/${id}`, {
            headers,
            data: { name: updatedName }
          });
          expect(update.status()).toBe(item.expectedStatus);
          const categories = (await (await request.get(`${api}/api/categories`)).json()) as Array<{ id: number; name: string }>;
          expect(categories).toEqual(
            expect.arrayContaining([expect.objectContaining({ id, name: updatedName })])
          );
          expect(categories.find(category => category.id === id)?.name).not.toBe(originalName);
        } finally {
          await request.delete(`${api}/api/categories/${id}`, { headers });
        }
        return;
      }
      if (item.action.startsWith('api-')) {
        const headers: Record<string, string> = {};
        if (item.action !== 'api-no-token') headers.Authorization = `Bearer ${await adminToken(request)}`;
        const uniqueName = item.name === undefined ? undefined : `${item.name}${item.name ? `-${Date.now()}-${item.id}` : ''}`;
        const endpoint = item.action === 'api-delete-missing'
          ? `${api}/api/categories/${item.missingId}`
          : `${api}/api/categories`;
        const response = item.action === 'api-delete-missing'
          ? await request.delete(endpoint, { headers })
          : await request.post(endpoint, { headers, data: uniqueName === undefined ? {} : { name: uniqueName } });
        if (item.action === 'api-create') {
          expect(response.status()).toBe(item.expectedStatus);
          const created = (await response.json()) as { id: number };
          const list = await request.get(`${api}/api/categories`);
          expect(await list.json()).toEqual(expect.arrayContaining([expect.objectContaining({ id: created.id, name: uniqueName })]));
          await request.delete(`${api}/api/categories/${created.id}`, { headers });
        } else {
          if (response.ok() && item.action !== 'api-delete-missing') {
            const created = (await response.json()) as { id?: number };
            if (created.id !== undefined) {
              await request.delete(`${api}/api/categories/${created.id}`, { headers });
            }
          }
          expect(response.status()).toBe(item.expectedStatus);
        }
        return;
      }

      const uniqueName = item.name === undefined ? undefined : `${item.name}-${runId}-${item.id}`;
      await openAdmin(page);
      if (item.action === 'ui-heading') {
        await expect(page.getByRole('heading', { name: 'Quản lý Danh mục' })).toBeVisible();
        await expect(categoryTab(page)).toHaveClass(/text-blue-400/);
      }
      if (item.action === 'ui-required') {
        const input = page.getByPlaceholder('Tên danh mục mới');
        await expect(input).toHaveAttribute('required', '');
        await expect(page.getByText(/Tên danh mục mới.*\*/)).toBeVisible();
      }
      if (item.action === 'ui-create-view' && uniqueName) {
        try {
          await page.getByPlaceholder('Tên danh mục mới').fill(uniqueName);
          await page.getByRole('button', { name: 'Thêm mới' }).click();
          await expect(categoryRow(page, uniqueName)).toBeVisible();
        } finally {
          await cleanupCategory(request, uniqueName);
        }
      }
      if (item.action === 'ui-delete-success' && uniqueName) {
        const token = await adminToken(request);
        const creation = await request.post(`${api}/api/categories`, {
          headers: { Authorization: `Bearer ${token}` },
          data: { name: uniqueName }
        });
        expect(creation.ok()).toBe(true);
        await page.reload();
        await categoryTab(page).click();
        try {
          const row = categoryRow(page, uniqueName);
          await expect(row).toBeVisible();
          page.once('dialog', dialog => dialog.accept());
          await row.getByRole('button', { name: 'Xóa' }).click();
          await expect(row).toHaveCount(0);
        } finally {
          await cleanupCategory(request, uniqueName);
        }
      }
      if (item.action === 'ui-delete-observation' && uniqueName) {
        test.info().annotations.push({
          type: 'exploratory',
          description: 'Confirmation is observed for usability only; FR-14 does not require it.'
        });
        const token = await adminToken(request);
        const creation = await request.post(`${api}/api/categories`, {
          headers: { Authorization: `Bearer ${token}` },
          data: { name: uniqueName }
        });
        expect(creation.ok()).toBe(true);
        await page.reload();
        await categoryTab(page).click();
        let dialogObserved = false;
        page.once('dialog', async dialog => {
          dialogObserved = true;
          await dialog.dismiss();
        });
        try {
          const row = categoryRow(page, uniqueName);
          await expect(row).toBeVisible();
          await row.getByRole('button', { name: 'Xóa' }).click();
          await expect.poll(async () => dialogObserved || await row.count() === 0, {
            message: `${item.id}: wait for either a confirmation dialog or the delete result`,
            timeout: 5_000,
            intervals: [100]
          }).toBe(true);
          test.info().annotations.push({
            type: 'observation',
            description: `Delete confirmation observed: ${dialogObserved}`
          });
        } finally {
          await cleanupCategory(request, uniqueName);
        }
      }
    });
  }
});
