## Feature / environment
FR-02 — Login and account lockout; local EShop; Playwright 1.55; Chromium, Firefox and WebKit.

## Preconditions
Register and lock a fresh synthetic account using the specified threshold.

## Steps
1. Attempt valid login while locked.
2. Observe the UI message.
3. Wait beyond the required 30-second window.
4. Attempt valid login again.

## Expected
A lock-specific non-revealing message is shown and the account becomes usable after 30 seconds.

## Actual
The UI shows a generic login failure and the backend configures 180000 ms, so login still fails after 31 seconds.

## Impact
Severity: High. Priority: P0. Incorrect lock duration affects account availability and feedback.

## Reproducibility and evidence
3/3 browsers. FR02-TC-014/015. Source: `hw/eshop-sut/backend/server.js:40-57`; reports/traces: `hw/hw4/reports/html/fr02-login-lockout/` and `hw/hw4/test-results/<browser>/`.

