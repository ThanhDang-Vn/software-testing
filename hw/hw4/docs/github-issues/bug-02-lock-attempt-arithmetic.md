## Feature / environment
FR-02 — Login and account lockout; local EShop backend; Playwright 1.55; Chromium, Firefox and WebKit.

## Preconditions
Register a fresh synthetic customer.

## Steps
1. Submit one invalid password.
2. Submit a second invalid password.
3. Attempt the correct password before the third failure.
4. Repeat with exactly three invalid attempts on another fresh account.

## Expected
Each failure increments the counter by one; two failures remain below threshold; the third locks the account.

## Actual
The backend increments by two (`newAttempts = user.login_attempts + 2`), causing premature lock behavior and incorrect third-attempt status.

## Impact
Severity: High. Priority: P0. Legitimate users can be locked before the required threshold.

## Reproducibility and evidence
3/3 browsers. FR02-TC-012/013. Source: `hw/eshop-sut/backend/server.js:54-61`; reports: `hw/hw4/reports/html/fr02-login-lockout/`.

