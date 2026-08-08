## Feature / environment
FR-14 — Category management API; local EShop; Playwright 1.55; Chromium, Firefox and WebKit.

## Preconditions
Register and authenticate a normal customer, not an administrator.

## Steps
1. POST `/api/categories` using the customer bearer token and a unique category name.
2. Inspect the status and category list.

## Expected
HTTP 403; category mutation is restricted to administrators.

## Actual
HTTP 200 and the category is created because the route checks authentication but not the admin role.

## Impact
Severity: Critical. Priority: P0. Any authenticated customer can mutate administrative catalog data.

## Reproducibility and evidence
3/3 browsers. FR14-TC-016. Source: `hw/eshop-sut/backend/server.js:249`; reports: `hw/hw4/reports/html/fr14-category-crud/`.

