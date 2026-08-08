# HW04 Data-Driven Refactor Review

## Scope

- Date: 2026-08-08
- Features: FR-02, FR-11, FR-14
- Goal: remove inline/raw test data and credentials while preserving business
  coverage and requirement-based assertions.
- SUT source was not changed.

## Before/after summary

| Feature | Hardcoded before | Refactor result |
|---|---|---|
| FR-02 | Seeded emails/passwords/names in JSON; valid/wrong passwords and registration name in spec | JSON uses symbolic credential/password/name profiles; actual values are required environment variables; action-specific loader validation rejects raw credentials |
| FR-11 | Seeded login values, inline five-order array, IDs/date/amount/status labels/counts in spec; ownership passwords in JSON | Order fixtures and expected values moved to `fr11-order-fixtures.json`; cases reference `fixtureProfile`; credentials are required environment variables |
| FR-14 | Admin/customer credentials, customer name, missing ID, successful-create status in spec/JSON | Credentials/names are required environment variables; missing ID and expected statuses are explicit JSON fields |

## Schema and validation

- Every case retains a unique `FRxx-TC-nnn` ID.
- FR-02 rejects raw `password` and `expectedUserName` fields and validates
  required fields per action.
- FR-11/FR-14 reject `email`, `password`, `otherPassword`, and `userName` in
  case JSON.
- FR-11 validates fixture profiles, order IDs, totals, statuses, dates, labels,
  class count, button count, and non-cancellable indexes.
- FR-14 validates required names, statuses, and missing IDs by action.
- Missing environment variables fail with the relevant case/setup ID and exact
  variable name.

## Verification

| Check | Result |
|---|---|
| TypeScript `tsc --noEmit` | PASS |
| FR-02 Chromium | 9 passed, 6 failed, 0 skipped |
| FR-11 Chromium | 12 passed, 1 failed, 0 skipped |
| FR-14 Chromium | 10 passed, 6 failed, 0 skipped |

The failure sets stayed requirement-based:

- FR-02 retained the same six known SUT failures.
- FR-11 retained only FR11-TC-012: expected two cancel buttons, received three
  because the UI still allows shipping cancellation.
- FR-14 retained empty/missing/whitespace validation, missing-delete status,
  required UI constraint, and customer-role authorization failures.

No assertion was weakened and no case was removed to produce a passing run.

## Evidence

- `reports/verification/fr02-data-refactor/chromium/index.html`
- `reports/verification/fr11-data-refactor/chromium/index.html`
- `reports/verification/fr14-data-refactor/chromium/index.html`
- Corresponding folders under `test-results/`.

