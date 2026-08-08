## Feature / environment
FR-14 — Category management; local EShop API; Playwright 1.55; Chromium, Firefox and WebKit.

## Preconditions
Authenticate as an administrator and choose a category ID that does not exist.

## Steps
1. DELETE `/api/categories/<missing-id>`.
2. Inspect the HTTP status and response.

## Expected
HTTP 404 identifies that the category was not found.

## Actual
HTTP 200 with “Category deleted” is returned without checking affected rows.

## Impact
Severity: Medium. Priority: P1. Clients receive false success and cannot distinguish missing resources.

## Reproducibility and evidence
3/3 browsers. FR14-TC-009. Source: `hw/eshop-sut/backend/server.js:269-275`; reports: `hw/hw4/reports/html/fr14-category-crud/`.

