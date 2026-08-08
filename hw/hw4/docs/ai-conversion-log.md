# AI Conversion Log — FR-02 Login & Account Lockout

**AI tool:** OpenAI Codex  
**Date:** 2026-07-26  
**Student ID:** 23127334  
**Source:** EShop SRS FR-02, FR-21, FR-22 and the inspected SUT implementation.

## Stage 1 — Analyze

**Prompt:** Analyze FR-02 Login & Account Lockout. Extract actors, inputs, business rules, state transitions, observable UI/API outputs, setup needs, and ambiguities. Do not generate scripts yet.

**Outcome:** Identified email/password login, JWT/client state, the consecutive-failure counter, threshold 3, 30-second lock, correct generic authentication errors, and HTML form contracts. Isolated accounts are required because lockout mutates persistent state.

## Stage 2 — Design

**Prompt:** Design at least 12 distinct Playwright cases for FR-02 using positive, negative, validation, boundary, and state coverage. Do not count browsers as additional cases and do not pad the count with cosmetic duplicates.

**Outcome:** Designed 15 cases: two successful roles, four invalid credential partitions, two required-field checks, two input-contract checks, and five lockout/state cases.

## Stage 3 — Review

**Prompt:** Review the 15 cases against the SRS and implementation. Remove semantic duplicates, identify unsupported expectations, and map each expected result to an observable oracle.

**Outcome:** Retained 15 cases because they exercise different rules or observable contracts. Expectations follow the SRS (+1 per failure, threshold 3, 30-second lock), even where implementation inspection predicts failures.

## Stage 4 — Model data

**Prompt:** Define a JSON schema that keeps all case IDs, categories, inputs, action parameters, and primitive expected values outside the Playwright spec. Add validation for malformed, duplicate, unknown, or insufficient records.

**Outcome:** Created `test-data/fr02-login-lockout.json` and a strict TypeScript loader. The spec contains no inline case array and rejects fewer than 12 records.

## Stage 5 — Map automation

**Prompt:** Map each action to stable setup, UI actions, API-assisted isolation, cleanup, and Playwright assertions. Prefer semantic locators and avoid arbitrary waits except the 30-second business-time boundary.

**Outcome:** Uses unique registered accounts for mutable state. Semantic form/button locators are used where possible. The SUT does not associate labels with inputs, so inputs temporarily use scoped positions; this is documented as a product accessibility defect.

## Stage 6 — Generate

**Prompt:** Generate the TypeScript Playwright configuration, external data, typed loader, page object, FR-02 spec, and deterministic Chromium/Firefox/WebKit runner. Each run must have a separate HTML report visibly titled with Student ID and ISO timestamp.

**Outcome:** Implemented 15 data-driven tests, three browser projects, failure artifacts, dynamic report titles/folders, and a JSON run manifest.

## Stage 7 — Verify and repair

**Prompt:** Run type checking and test discovery, then execute FR-02 independently on Chromium, Firefox, and WebKit. Inspect every HTML report for `Run by: 23127334`, classify failures, and repair automation defects without weakening valid expectations.

**Outcome:** TypeScript validation passed. Playwright discovered 45 executions
(`15 cases × 3 browsers`). The three independent runs completed with the same
result on every browser: 9 passed and 6 failed. All three HTML reports were then
opened in headless Chromium; their visible document titles contained
`Run by: 23127334`, the browser name, and an ISO timestamp. The failures were
classified as SUT defects and retained without weakening assertions. See
`docs/fr02-execution-review.md` and `reports/run-manifest.json`.

## Human-review notes

- The original merged HW2 cases were expanded only where HW4 needs independently automated, observable rules.
- The initial temptation to treat Login and Account Lockout as two HW4 features was rejected: the official pool defines both as FR-02.
- The suite intentionally preserves expectations that expose the known +2 counter, 180-second lock, incorrect input types, and generic locked-account UI message.
- Direct string search in the generated `index.html` was rejected as report
  validation because Playwright compresses report data. The validator was
  repaired to open each report in a real browser and inspect the visible
  document title/body instead.
