## Feature / environment
FR-11 — Order history view; local EShop; Playwright 1.55; Chromium, Firefox and WebKit.

## Preconditions
An authenticated customer owns orders in pending, confirmed, shipping, delivered and canceled states.

## Steps
1. Open order history.
2. Inspect cancellation actions for each state.
3. Attempt to cancel a shipping order through the customer endpoint.

## Expected
Cancellation is available only before shipping; a shipping order cannot be canceled.

## Actual
The UI exposes three cancel actions instead of two and the backend rejects only delivered/canceled states, allowing shipping cancellation.

## Impact
Severity: High. Priority: P0. Invalid order-state transition can corrupt fulfillment state.

## Reproducibility and evidence
3/3 browsers. FR11-TC-012. Source: `hw/eshop-sut/backend/server.js:321-337`; reports: `hw/hw4/reports/html/fr11-order-history/`.

