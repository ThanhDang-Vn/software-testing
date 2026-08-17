# HW06 Passing CI Run

This file is prepared for the first real passing GitHub Actions execution of `.github/workflows/hw06-api-tests.yml`. No URL, SHA, artifact reference, or screenshot is invented.

## Verified identifiers

- Commit SHA: `TODO — fill with the exact pushed commit SHA after push`
- GitHub Actions run URL: `TODO — paste the real successful HW06 API Tests run URL`
- Artifact link: `TODO — paste the real hw06-api-reports-<run_id>-<run_attempt> artifact URL`
- Run attempt: `TODO — copy from the real GitHub Actions run`
- Conclusion: `TODO — set to success only after GitHub displays a green completed run`

## Screenshot placeholder

> **TODO — attach a real screenshot of the GitHub Actions run summary after it completes successfully.** The screenshot must visibly show the workflow name, commit, job conclusion, and run timestamp. Do not generate, reconstruct, or fabricate this screenshot.

Suggested repository path after capturing the real image:

```text
hw/hw6/bugs/screenshots/hw06-passing-actions-summary.png
```

After attaching the real image, replace this line with a relative Markdown image link.

## Artifact verification checklist

- [ ] The `Newman API contract tests` job is green.
- [ ] Register, Coupon, and Product expected-working suites all executed.
- [ ] The log says the `X-Student-Id 23127334` guard passed.
- [ ] The artifact contains three CLI logs, three JUnit XML files, three HTML reports, and three backend logs.
- [ ] The artifact does not contain the runtime Postman environment, passwords, JWTs, or Newman JSON exports with resolved Authorization headers.
- [ ] The commit SHA shown by the run exactly matches the SHA recorded above.

## Local pre-push verification

- Status: `PASS — register=0, coupon=0, product=0; each suite reported 26 assertions executed and 0 failed`
- Timestamp: `2026-08-17T22:22:02Z–2026-08-17T22:22:10Z` (UTC timestamps emitted by the real Newman run)
- Notes: `Workflow-equivalent local execution used a fresh backend/database per suite, the committed single-row CI data file, exact workflow folder selections, and X-Student-Id 23127334. This local pass is not a GitHub Actions run and does not fill any remote URL/SHA/artifact placeholder.`
