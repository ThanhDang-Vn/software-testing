# HW06 Passing CI Run

This record uses the real GitHub Actions URLs and screenshots supplied under `hw/hw6/actions`. No link, result, or screenshot is fabricated.

## Verified identifiers

- Commit SHA: [`805c5959dd0a19b3a93035c7829dce595ecf8d40`](https://github.com/ThanhDang-Vn/software-testing/commit/805c5959dd0a19b3a93035c7829dce595ecf8d40)
- GitHub Actions job/run URL: [run 32076713839, job 95531370911](https://github.com/ThanhDang-Vn/software-testing/actions/runs/32076713839/job/95531370911)
- Artifact: [`hw06-api-reports-32076713839-1`](https://github.com/ThanhDang-Vn/software-testing/actions/runs/32076713839/artifacts/9303692181)
- Run attempt: `1` (supported by artifact suffix `-1`)
- Branch: `feature/23127334-hw6`
- Workflow: `HW06 API Tests`
- Job: `Newman API contract tests`
- Conclusion: `success`
- Duration shown on summary: `29s` total; job `25s`

## Real screenshots

### Actions run list and commit

![Successful HW06 workflow entry for commit 805c595](../../actions/img/Screenshot%202026-08-18%20053707.png)

### Successful run summary and artifact

![Successful run summary with artifact hw06-api-reports-32076713839-1](../../actions/img/Screenshot%202026-08-18%20053748.png)

### Successful job steps

![Newman API contract tests job with all execution steps completed](../../actions/img/Screenshot%202026-08-18%20053846.png)

These are user-captured GitHub screenshots. They were inspected as supplied and were not generated or altered for this report.

## Artifact verification checklist

- [x] The `Newman API contract tests` job is green.
- [x] The `Run expected-working Newman gate` step completed successfully. By the committed workflow definition, this step runs Register, Coupon, and Product serially and exits non-zero if any selected suite fails.
- [x] The `Enforce X-Student-Id on every collection request` guard step completed successfully.
- [x] GitHub shows one artifact named `hw06-api-reports-32076713839-1` with size `40.6 KB`.
- [x] The downloaded artifact contains 12 expected files: three CLI logs, three JUnit XML files, three HTML reports, and three backend logs.
- [x] All three CLI reports record `1` iteration, `10` requests, `26` assertions, and `0` failures. JUnit suites contain no reported failure/error values.
- [x] All three backend logs contain `Database initialized and seeded (Phase 2).`, the server listening message, and successful database connection evidence.
- [x] The complete archive was scanned and contains no runtime Postman environment, password/token variable names, `Authorization`, `Bearer`, JWT-shaped value, or Newman JSON export.
- [x] The successful run shows commit `805c595`, matching the recorded full SHA `805c5959dd0a19b3a93035c7829dce595ecf8d40`.

Downloaded artifact retained at [`hw/hw6/actions/hw06-api-reports-32076713839-1.zip`](../../actions/hw06-api-reports-32076713839-1.zip). Its SHA-256 is:

```text
C8663684B4AF893F25492D703A32B61B120AF0C6FF9CAEFC2FF206A3E1A52432
```

This matches the digest prefix visible in the real GitHub artifact screenshot.

## Observed warning

The successful run summary shows one annotation: ``The process `/usr/bin/git` failed with exit code 128``. All main job steps, including the path-scoped EShop submodule initialization, Newman gate, and artifact upload, are green. This warning is consistent with post-job Git cleanup encountering the repository's separate legacy gitlink that has no `.gitmodules` URL; it did not change the job conclusion. It should not be presented as an assertion failure.

## Local pre-push verification

- Status: `PASS — register=0, coupon=0, product=0; each suite reported 26 assertions executed and 0 failed`
- Timestamp: `2026-08-17T22:22:02Z–2026-08-17T22:22:10Z` (UTC timestamps emitted by the real Newman run)
- Notes: The workflow-equivalent local execution used a fresh backend/database per suite, the committed single-row CI data file, exact workflow folder selections, and `X-Student-Id: 23127334`. The successful GitHub run above is the authoritative remote CI evidence.

## Evidence completeness

The successful run identifiers, screenshots, downloaded artifact, artifact contents, report results, reset logs, and sensitive-data checks are complete. No evidence placeholder remains for this passing run.
