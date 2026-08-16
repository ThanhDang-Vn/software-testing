# HW04 — Automation Testing — Main Report

**Student:** Nguyễn Thành Dâng (23127334)
**Repository:** https://github.com/ThanhDang-Vn/software-testing
**Demo video (Agent Skill + end-to-end flow):** https://youtu.be/e-_aoQkVflk
**System under test:** EShop (React web frontend + Node/Express + SQLite backend)
**Features under test:** FR-02 Login & Account Lockout (Pool A), FR-11 Order History (Pool B), FR-14 Category Management CRUD (Pool C)

---

## 1. Overview

This report documents an AI-assisted, human-reviewed automation suite for three EShop features, one
from each required pool. The suite is data-driven, runs on three real browser engines, and is
executed end to end to produce multi-browser HTML reports. Where a failing assertion exposed a
genuine product defect, the defect is reported here and published as a GitHub Issue with evidence.

The work follows an *AI-first, human-verified* model: an AI tool proposed the initial scripts and
data; the student then reviewed each proposal against the requirement, the SUT source, and the
execution evidence, correcting or rejecting anything that was fragile, incomplete, or wrong. Every
AI interaction and the corrections applied to it are recorded in `documents/ai-audit-report.md`.

## 2. Tools and environment

| Area | Choice |
| --- | --- |
| Language | TypeScript (ESM) |
| Test runner | `@playwright/test` 1.55 |
| Runtime | Node.js 20 |
| Browser engines | Chromium, Firefox, WebKit (three Playwright projects) |
| Reporter | Playwright HTML reporter (+ JSON for the run manifest) |
| Data format | External JSON case files; credentials injected via environment variables |
| AI tool | Declared in the AI Audit Report |

Every HTML report title embeds `Run by: 23127334` together with an ISO 8601 timestamp so the run is
attributable, as required by the anti-cheat constraints.

## 3. Test design and data-driven approach

The suite contains **44 logical cases** across the three features:

| Feature | Cases | Composition |
| --- | ---: | --- |
| FR-02 Login & Lockout | 15 | positive login, negative auth, field validation, UI contract, lockout state/boundary/edge |
| FR-11 Order History | 13 | 7 UI presentation + 6 backend API (authorization / cross-user ownership) |
| FR-14 Category CRUD | 16 | 6 UI + 10 backend API (create / view / delete, validation, role authorization) |

**Data-driven design.** Case metadata (IDs, categories, expected outcomes) lives in external JSON
under `automation/test-data/`, decoupled from the spec logic. A typed loader validates the data on
read: it rejects missing or duplicate IDs, unknown action types, invalid schemas, and any raw
credential embedded in the data file. Credentials are supplied only through environment variables,
and synthetic users/categories are generated per run with a unique run ID so parallel or repeated
executions never collide.

**Isolation and cleanup.** FR-14 UI mutations remove the records they create in a `finally` block.
FR-11 UI-presentation cases use deterministic mocked fixtures so rendering assertions are stable,
while the authorization and ownership cases exercise the real backend.

**Assertion patterns.** The suite uses at least three distinct patterns:

1. Web-first UI assertions — URL, visibility, text, attribute, CSS class, and element count.
2. Primitive equality on HTTP status codes for the API cases.
3. Structural assertions on arrays/objects, including asymmetric containment on response shapes.

**Selector and wait strategy.** Selectors prefer accessible roles, placeholders, stable visible text
and exact table cells. There is no XPath, positional `nth`, `waitForTimeout`, raw click-via-evaluate,
or arbitrary UI delay. Waits are web-first (auto-retrying) except for the single FR-02 lock-expiry
case, where the wait is an explicit business window (the account-lock duration), not a UI sync hack.
Details in `documents/selector-wait-review.md`.

## 4. Execution results

Each feature ran on all three engines — **9 feature/browser runs**, **132 test-browser executions**.

| Feature | Chromium | Firefox | WebKit |
| --- | --- | --- | --- |
| FR-02 | 9 pass / 6 fail | 9 / 6 | 9 / 6 |
| FR-11 | 12 / 1 | 12 / 1 | 12 / 1 |
| FR-14 | 10 / 6 | 9 / 7 | 10 / 6 |

**Totals:** 132 executions — **92 passed, 40 failed, 0 skipped.**

The 40 failures are not test errors: they are **repeatable assertion failures that map to confirmed
SUT defects** (Section 5), each corroborated by the backend source code and by report/trace
artifacts. The single Firefox-only extra failure (FR14-TC-008) was a browser-context teardown event;
the case then passed 3/3 in targeted repetition and is classified **FLAKY**, not a product defect.

Evidence: `reports/run-manifest.json`, the nine reports under `reports/html/`, and
`documents/execution-and-stability-review.md`.

## 5. Confirmed defects

Eight distinct defect groups were confirmed and published as GitHub Issues **#33–#40** (labels `bug`,
`hw4`), each with a screenshot and, for API defects, a reproducible REST request.

| ID | Feature / cases | Expected | Actual | Severity |
| --- | --- | --- | --- | --- |
| BUG-01 | FR-02 TC-009/010 — login input types | `email` / `password` input types | both `text` (password not masked) | P1 |
| BUG-02 | FR-02 TC-012/013 — lock arithmetic | +1 per failure; lock on 3rd | +2 per failure; premature lock | P0 |
| BUG-03 | FR-02 TC-014/015 — lock duration & feedback | specific message; 30 s window | generic message; 180 s window | P0 |
| BUG-04 | FR-11 TC-012 — shipping order | no cancel while shipping | Cancel action shown and accepted | P0 |
| BUG-05 | FR-14 TC-005/006/007 — name validation | HTTP 400 on invalid name | HTTP 200, category created | P1 |
| BUG-06 | FR-14 TC-009 — delete unknown | HTTP 404 | HTTP 200, "deleted" | P1 |
| BUG-07 | FR-14 TC-011 — required contract | native/visible required field | neither present | P1 |
| BUG-08 | FR-14 TC-016 — authorization | HTTP 403 for customer token | HTTP 200, category created | P0 |

The most serious findings are security/integrity defects: a broken account-lock rule (BUG-02/03), an
order-integrity gap allowing cancellation of a shipping order (BUG-04), and a missing authorization
check that lets a customer token create categories (BUG-08). Full reproduction steps and screenshots
are in `documents/bug-report.md`; API cases are reproducible via `automation/rest/fr14-bug-evidence.rest`.

## 6. Human review and gap analysis

The AI-generated origin scripts were functional but had recurring weaknesses that human review
corrected before the results were trusted:

- **FR-02** — origin used positional inputs, a CSS error-class locator, inline credential
  assumptions, and a fixed sleep. Review moved data to JSON/environment profiles, added field
  validation, replaced fragile locators with accessible ones, and made the lock window explicit.
- **FR-11** — origin used row indexes and wrongly *accepted* cancellation during shipping. Review
  fixed the oracle (cancellation must be blocked), replaced indexes with exact order IDs, added
  cross-user ownership checks, validated fixtures, and awaited route fulfillment.
- **FR-14** — origin treated a confirmation dialog as a hard requirement and lacked successful
  create/view/delete and customer-role coverage. Review reclassified confirmation as exploratory,
  added the missing coverage plus unique-data cleanup, and removed arbitrary waits and
  click-via-evaluate. An initial role locator that mishandled corrupted UI text caused five timeouts
  and was corrected to a role + stable-prefix locator after trace review.

**Why the AI missed these:** the model optimized for a script that runs, not for oracle correctness
or requirement fidelity — so it accepted the SUT's behavior as the expected result (e.g. shipping
cancellation), leaned on positional/implementation-coupled locators, and under-covered negative and
authorization paths that the prose requirement implied but did not spell out.

**Work left to humans (documented, not automated):**

- FR-14 *Update* behavior is a requirement ambiguity: the reviewed acceptance criteria list
  create/view/delete while the title says "CRUD". This is recorded rather than silently assumed.
- Confirmation-dialog usability and broad visual quality are exploratory and not FR-14 pass/fail
  criteria.

## 7. Agent Skill

A reusable Agent Skill packages this workflow — data-driven, multi-browser script generation and
evidence capture — so it can be re-applied to new features. The skill and its end-to-end usage are
demonstrated in the linked demo video.

## 8. Self-assessment and conclusion

| Criterion | Max | Self-assessed |
| --- | ---: | ---: |
| Task 1 — FR-02 | 25 | 25 |
| Task 1 — FR-11 | 25 | 25 |
| Task 1 — FR-14 | 25 | 25 |
| Task 2 — Demo video | 15 | 15 |
| Agent Skill | 10 | 10 |
| **Total** | **100** | **100** |

The suite meets the core Task 1 requirements: three pooled features, 44 data-driven cases, three
assertion patterns, three-engine execution with attributable HTML reports, a human-reviewed script
set, and eight confirmed defects published with evidence. The failing assertions are genuine product
findings rather than test defects, which is the intended outcome of the exercise. The self-assessed
grade of 100/100 was selected by the student, who remains responsible for the final scripts and for
reviewing every AI-proposed change.
