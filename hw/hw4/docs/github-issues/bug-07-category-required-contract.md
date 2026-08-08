## Feature / environment
FR-14 — Category management UI; local EShop admin; Playwright 1.55; Chromium, Firefox and WebKit.

## Preconditions
Authenticate as an administrator and open the Category tab.

## Steps
1. Inspect the new-category input.
2. Inspect its label/required indicator.

## Expected
The input has native `required` validation and the UI visibly identifies the field as required.

## Actual
The input has no `required` attribute and no visible required marker.

## Impact
Severity: Medium. Priority: P1. Invalid submissions are not blocked client-side and the form contract is unclear.

## Reproducibility and evidence
3/3 browsers. FR14-TC-011. Reports and traces: `hw/hw4/reports/html/fr14-category-crud/` and `hw/hw4/test-results/<browser>/`.

