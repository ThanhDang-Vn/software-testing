# Task 1 — GUI Checklist Test Summary

| Field | Value |
| --- | --- |
| Student | Nguyễn Thành Dâng (23127334) |
| SUT | EShop (`eshop-sut`) |
| Screens under test | Login (`/login`, FR-02); Order History in Profile (`/profile`, FR-11) |
| Checklist (v0 → v1) | `gui-checklist-v0-agent.xlsx` (32-item AI baseline) → `gui-checklist-v1-reviewed.xlsx` (45 items) |
| Execution tool | Playwright 1.55.0, Chromium, Windows (+ a manual screen-reader run for the two AT-only items) |
| Frontend / Backend | `http://localhost:5173` / `http://localhost:3000` |
| Viewports / modes | 1280×800; 320×640; 200% zoom; portrait/landscape; RTL; dark preference |
| Test data | 5 orders seeded via authenticated API (all 5 status labels observable) |
| Date | 2026-07-26 |

## 1. Overall result

| Metric | Value |
| --- | ---: |
| Checklist items designed | 45 |
| Items executed | 45 |
| **Passed** | **17** |
| **Failed** | **28** |
| **Blocked** | **0** |
| Pass rate | 17 / 45 = 37.8% |
| Consolidated GUI bugs | 12 |
| Bugs reported on GitHub Issues | #18–#29 (label `homework3`) |
| Failed-item screenshots | 28 (one per Failed item) |

> Minimum required: > 40 items across all four interface aspects — **met** (45 items, IA-01…IA-04, all 45 executed with a Pass/Fail verdict).

## 2. Breakdown by screen

| Screen | Items | Passed | Failed | Blocked |
| --- | ---: | ---: | ---: | ---: |
| Login (`/login`) | 23 | 9 | 14 | 0 |
| Order History (`/profile`) | 22 | 8 | 14 | 0 |
| **Total** | **45** | **17** | **28** | **0** |

## 3. Breakdown by interface aspect (IA)

| IA | Aspect | Items | Passed | Failed | Blocked |
| --- | --- | ---: | ---: | ---: | ---: |
| IA-01 | General UI standards | 24 | 13 | 11 | 0 |
| IA-02 | Forms | 13 | 2 | 11 | 0 |
| IA-03 | Navigation | 2 | 0 | 2 | 0 |
| IA-04 | Feedback / state | 6 | 2 | 4 | 0 |
| **Total** | | **45** | **17** | **28** | **0** |

All four interface aspects are covered; every item has a Pass/Fail verdict (no Blocked items remaining).

## 4. Screen-reader–dependent items

Two items required a real assistive-technology run rather than the automated
Chromium pass:

| ID | Screen | Check | Result |
| --- | --- | --- | --- |
| GUI-O-026 | Order History | Logical reading order at desktop and 320 px | Passed (manual screen-reader run) |
| GUI-O-029 | Order History | Order-state change announced to AT | Passed (manual screen-reader run) |

## 5. Consolidated bugs (28 Failed items → 12 bugs)

| Bug | Screen | Severity | Checklist IDs | Issue |
| --- | --- | --- | --- | --- |
| BUG-GUI-001 | Login | Major | GUI-L-001, L-002 | #18 |
| BUG-GUI-002 | Login | Major | GUI-L-005, L-006 | #19 |
| BUG-GUI-003 | Login | Critical | GUI-L-007, L-008, L-020 | #20 |
| BUG-GUI-004 | Login | Major | GUI-L-009, L-010, L-011A, L-025, L-026 | #21 |
| BUG-GUI-005 | Login | Major | GUI-L-013 | #22 |
| BUG-GUI-006 | Login | Major | GUI-L-024A | #23 |
| BUG-GUI-007 | Order History | Minor | GUI-O-005, O-006 | #24 |
| BUG-GUI-008 | Order History | Critical | GUI-O-010, O-011, O-027 | #25 |
| BUG-GUI-009 | Order History | Major | GUI-O-012, O-013 | #26 |
| BUG-GUI-010 | Order History | Major | GUI-O-016, O-022 | #27 |
| BUG-GUI-011 | Order History | Major | GUI-O-019, O-025 | #28 |
| BUG-GUI-012 | Order History | Major | GUI-O-020, O-021, O-028 | #29 |

Full per-item execution data: `execution-results.json` and `gui-checklist-v1-reviewed.xlsx`;
detailed bug write-ups with screenshots: `bug-report.md` and `failed-screenshots/`.
