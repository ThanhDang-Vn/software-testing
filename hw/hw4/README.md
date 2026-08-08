# HW04 Playwright Automation

**Student ID:** 23127334  
**Features:** FR-02 Login & Lockout; FR-11 Order History; FR-14 Category CRUD  
**Logical cases:** 39 (15 + 12 + 12)  
**Browsers:** Chromium, Firefox, WebKit

## Status

| Metric | Result |
| --- | ---: |
| Implemented logical cases | 39 |
| Expected matrix executions | 117 |
| Required feature-browser runs | 9 |
| Previously executed FR-02 runs | 3 |
| Previously generated FR-02 reports | 3 |

FR-02 was genuinely executed: 27 passed and 18 failed across three browsers.
Its six logical failures reproduce product defects; see
`docs/fr02-execution-review.md`. FR-11 and FR-14 are implemented and discovered,
but must be executed against the running SUT to generate their reports.

## Setup and execution

Install dependencies in this directory and in the three SUT applications:

```powershell
npm install
npx playwright install
```

Start these in separate terminals:

```powershell
cd hw\eshop-sut\backend
node server.js
```

```powershell
cd hw\eshop-sut\frontend-web
npm run dev -- --host 127.0.0.1
```

```powershell
cd hw\eshop-sut\frontend-admin
npm run dev -- --host 127.0.0.1
```

Then, from `hw\hw4`:

```powershell
npm run typecheck
npm run test:list
npm run test:matrix
```

Each report is written to
`reports/html/<feature-slug>/<browser>/index.html`. Its visible title contains
`Run by: 23127334`, the feature, browser and an ISO timestamp.
`reports/run-manifest.json` records actual exit codes and label verification.

## Assertion patterns

- URL, visibility, text, attributes, class and count;
- primitive equality and boolean contracts;
- object shape, array containment and asymmetric matchers.

The wait in FR02-TC-015 verifies the specified 30-second business duration.

## Self-assessment

| Criterion | Maximum | Current |
| --- | ---: | ---: |
| Task 1 — FR-02 | 25 | 23 |
| Task 1 — FR-11 | 25 | 21 |
| Task 1 — FR-14 | 25 | 21 |
| Demo video | 15 | 0 |
| Agent skill | 10 | 8 |
| **Total before video** | **100** | **73** |

Before submission, the student must add the narrated YouTube link, run the full
matrix, publish real GitHub Issues with screenshots, export required PDFs, and
provide an authentic multi-day commit log.
