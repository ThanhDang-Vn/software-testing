## Feature / environment
FR-02 — Login and account lockout; local EShop; Playwright 1.55; Node 20; Chromium, Firefox and WebKit.

## Preconditions
Open the customer login page.

## Steps
1. Inspect the Username input.
2. Inspect the Mật khẩu input.
3. Compare their native `type` attributes with the FR-02 input contract.

## Expected
Username/email uses `type="email"`; password uses `type="password"`.

## Actual
Both inputs use `type="text"`.

## Impact
Severity: Medium. Priority: P1. Native email validation is unavailable and the password is not masked.

## Reproducibility and evidence
3/3 browsers. Cases FR02-TC-009 and FR02-TC-010. Reports: `hw/hw4/reports/html/fr02-login-lockout/<browser>/index.html`; failure artifacts: `hw/hw4/test-results/<browser>/`.

