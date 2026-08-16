# FR-02 Execution and Human Review

**Run:** 2026-07-26  
**Student ID:** 23127334  
**Feature:** Login & Account Lockout  
**Logical cases:** 15  
**Browser executions:** 45

## Results

| Browser | Passed | Failed | HTML report label |
| --- | ---: | ---: | --- |
| Chromium | 9 | 6 | Verified |
| Firefox | 9 | 6 | Verified |
| WebKit | 9 | 6 | Verified |
| **Total** | **27** | **18** | **3/3 verified** |

Each browser run produced an independent report. A failed test still produced
its HTML report, screenshot, video, trace, and error context.

## Failing cases and classification

| Case | Observed failure | Classification |
| --- | --- | --- |
| FR02-TC-009 | Email input is `type="text"` instead of `type="email"` | Product defect — FR-02/FR-22 |
| FR02-TC-010 | Password input is `type="text"` instead of `type="password"` | Product/security defect — FR-22 |
| FR02-TC-012 | Correct login is blocked after only two failures | Product defect — counter increases by 2 |
| FR02-TC-013 | Account is already locked before the third failed attempt completes | Same counter/threshold defect |
| FR02-TC-014 | UI replaces the lock-specific response with a generic failure message | Product feedback defect |
| FR02-TC-015 | Account remains locked after the specified 30 seconds | Product defect — implementation uses 180 seconds |

The same six cases failed on every browser, which is evidence of
browser-independent product behavior rather than a browser compatibility issue.

## Human review corrections

1. Kept Login and Account Lockout as one feature because the official selection
   defines both as FR-02.
2. Replaced shared seeded accounts with unique accounts for state-changing
   cases so browser runs do not depend on order or previous lock state.
3. Scoped positional input locators inside the login form only because the SUT
   labels have no `for` association. This selector should be replaced with
   `getByLabel` after the accessibility defect is fixed.
4. Preserved SRS expectations for +1 attempt, threshold 3, and 30-second expiry.
   Assertions were not changed to mirror the defective implementation.
5. Repaired report verification: searching raw HTML was invalid because
   Playwright embeds compressed report data. Reports are now opened in a
   browser and checked through their visible title/body.

## Report evidence

- `reports/html/fr02-login-lockout/chromium/index.html`
- `reports/html/fr02-login-lockout/firefox/index.html`
- `reports/html/fr02-login-lockout/webkit/index.html`
- `reports/run-manifest.json`

The manifest records the nonzero test exit codes honestly while independently
confirming `labelVerified: true` for every report.
