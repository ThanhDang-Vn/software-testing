# HW04 Automation Testing — Main Report

**Student:** Nguyễn Thành Dâng (23127334)  
**Repository:** https://github.com/ThanhDang-Vn/software-testing  
**SUT:** EShop  
**Features:** FR-02 (Pool A), FR-11 (Pool B), FR-14 (Pool C)

## Environment and AI-first process

Tests use TypeScript, `@playwright/test` 1.55, Node 20, and real Chromium, Firefox and WebKit.
The process reviewed the HW04 requirement/policy, existing tests, JSON data, support objects and SUT
source; human review then corrected or rejected AI proposals before execution. AI interactions and
later changes are recorded in `docs/ai-audit-report.md`.

## Design and data-driven approach

There are 44 logical cases: FR-02 15, FR-11 13 and FR-14 16. Case metadata is external JSON;
credentials remain in environment variables. Loaders reject missing IDs, duplicate/invalid schemas
and forbidden credential fields. Synthetic users/categories use run IDs. FR-14 UI mutations clean
up in `finally`; FR-11 UI presentation uses deterministic fixtures while real API cases cover auth
and cross-user ownership.

Assertion patterns include web-first URL/visibility/text/attribute/class/count checks, primitive
status equality, arrays/object shape and asymmetric containment. Selectors prefer role,
placeholder, stable text and exact table cells. No XPath, `nth`, `waitForTimeout`, raw click
evaluation or arbitrary UI delay remains. See `docs/selector-wait-review.md`.

## Verified matrix results

| Feature | Chromium | Firefox | WebKit |
| --- | --- | --- | --- |
| FR-02 | 9 pass / 6 fail | 9 / 6 | 9 / 6 |
| FR-11 | 12 / 1 | 12 / 1 | 12 / 1 |
| FR-14 | 10 / 6 | 9 / 7 | 10 / 6 |

Totals: 132 executions, 92 passed, 40 failed, 0 skipped. The Firefox-only extra failure was a
browser-context teardown event; FR14-TC-008 then passed 3/3 targeted repetitions and is classified
FLAKY. The other failure signatures are repeated and supported by SUT source. Evidence:
`reports/run-manifest.json`, `reports/html/`, and `docs/execution-and-stability-review.md`.

## Human review, gaps and defects

Human review corrected FR-11's shipping cancellation oracle, downgraded FR-14 confirmation to an
exploratory observation, added ownership/admin-role and successful create/view/delete coverage,
externalized test data and removed brittle waits/selectors. Confirmed defect groups cover FR-02
input contracts and lock algorithm; FR-11 shipping cancellation; FR-14 validation, missing-delete
semantics, required UI and role authorization. Eight reviewed GitHub Issues (#33–#40) are linked
in `docs/bug-report.md` and labeled `hw4`.

Update behavior for FR-14 remains a human-review ambiguity because the reviewed explicit bullets
specify create/view/delete although the title says CRUD. Confirmation usability and broad visual
quality remain exploratory/manual. The student must record the 5–7 minute demo, add a real URL,
publish approved issues and review all AI changes.

## Self-assessment and conclusion

Self-assessed grade: 100/100, explicitly selected by the student. Current P0 blockers are the missing demo and
zero valid HW04 commits: the parent `.gitignore` excludes `hw/hw4/`. Evidence quality is strong for
the nine browser runs, but the submission is NOT READY until those authentic student actions and
document/PDF synchronization are completed.
