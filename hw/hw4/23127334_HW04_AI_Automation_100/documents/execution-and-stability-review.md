# HW04 Execution and Stability Review

Evidence source: `reports/run-manifest.json`, verified at `2026-08-08T01:48:00.391Z`.
All runs used `workers=1`, `retries=0`, and real Chromium/Firefox/WebKit engines.

| Feature | Browser | Passed | Failed | Skipped | Test duration | Classification summary |
| --- | --- | ---: | ---: | ---: | ---: | --- |
| FR-02 | Chromium | 9 | 6 | 0 | 78.198 s | 6 SUT_DEFECT |
| FR-02 | Firefox | 9 | 6 | 0 | 86.432 s | same 6 SUT_DEFECT signatures |
| FR-02 | WebKit | 9 | 6 | 0 | 83.272 s | same 6 SUT_DEFECT signatures |
| FR-11 | Chromium | 12 | 1 | 0 | 11.386 s | 1 SUT_DEFECT |
| FR-11 | Firefox | 12 | 1 | 0 | 22.144 s | same SUT_DEFECT |
| FR-11 | WebKit | 12 | 1 | 0 | 20.821 s | same SUT_DEFECT |
| FR-14 | Chromium | 10 | 6 | 0 | 13.474 s | 6 SUT_DEFECT |
| FR-14 | Firefox | 9 | 7 | 0 | 38.895 s | 6 SUT_DEFECT + 1 FLAKY teardown |
| FR-14 | WebKit | 10 | 6 | 0 | 23.651 s | same 6 SUT_DEFECT |

Commands: `npm.cmd run test:matrix` and `npm.cmd run report:verify` with the documented
synthetic credential environment variables. Matrix wall time was 469.5 seconds. The verifier
passed all nine entries for report existence, Student ID, feature/browser, ISO timestamp, and counts.

## Failure analysis

- FR02-TC-009/010 — SUT_DEFECT: both login controls render `type="text"`.
- FR02-TC-012..015 — SUT_DEFECT: backend increments attempts by 2 and locks for 180000 ms,
  contradicting the threshold/30-second requirement. Source evidence:
  `../eshop-sut/backend/server.js:54-61`.
- FR11-TC-012 — SUT_DEFECT: UI/backend allow cancel while shipping; source evidence:
  `../eshop-sut/backend/server.js:321-337` and the profile action rendering.
- FR14-TC-005/006/007 — SUT_DEFECT: category create inserts unvalidated names.
- FR14-TC-009 — SUT_DEFECT: delete always returns 200 without checking affected rows.
- FR14-TC-011 — SUT_DEFECT: category input lacks native `required` and a visible required marker.
- FR14-TC-016 — SUT_DEFECT: authenticated customer can mutate categories because the route checks
  authentication but not admin role. Source evidence: `../eshop-sut/backend/server.js:249-275`.
- FR14-TC-008 Firefox matrix failure — FLAKY: browser-context teardown protocol error. A targeted
  `--repeat-each=3` run passed 3/3 in 10.3 seconds at
  `reports/stability/fr14/firefox-tc008-repeat/index.html`.

No failure was classified ENVIRONMENT or BLOCKED. No retry was enabled. The identical stable
failure sets across Chromium and WebKit, plus source evidence, support the SUT classifications.

## Human review points

- PENDING: confirm whether the rubric treats the word “CRUD” as requiring update; the explicit
  FR-14 bullets reviewed so far require create/view/delete, so no update oracle was invented.
- PENDING: accept the Firefox teardown event as FLAKY rather than a product bug.
- PENDING: approve bug drafts before any GitHub Issue is published.

