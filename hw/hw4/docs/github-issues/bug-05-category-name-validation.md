## Feature / environment
FR-14 — Category management; local EShop API; Playwright 1.55; Chromium, Firefox and WebKit.

## Preconditions
Authenticate as an administrator.

## Steps
1. POST a category with an empty name.
2. POST a category with the name omitted.
3. POST a whitespace-only name.

## Expected
Each invalid request returns HTTP 400 and does not persist a category.

## Actual
Each request returns HTTP 200 because the route inserts `name` without validation.

## Impact
Severity: Medium. Priority: P1. Invalid category data can be stored and displayed.

## Reproducibility and evidence
3/3 browsers. FR14-TC-005/006/007. Source: `hw/eshop-sut/backend/server.js:249-253`; reports: `hw/hw4/reports/html/fr14-category-crud/`.

