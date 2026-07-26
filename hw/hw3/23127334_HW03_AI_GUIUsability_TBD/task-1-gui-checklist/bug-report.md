# GUI Bug Report — Login and Order History

## Execution environment

| Field | Value |
| --- | --- |
| Date | 2026-07-26 |
| Automation | Playwright 1.55.0, Chromium headless |
| OS | Windows |
| Frontend | `http://127.0.0.1:5173` |
| Backend | `http://127.0.0.1:3000` |
| Main viewport | 1280×800 |
| Additional coverage | 320×640, 200% scale, portrait/landscape, RTL and dark preference |

GitHub Issue URLs remain pending until the student provides the target
repository. Each bug below is grounded in an executed Failed checklist item.

## BUG-GUI-001 — Login screen is mislabeled and mixes Vietnamese with English

| Field | Value |
| --- | --- |
| Checklist IDs | GUI-L-001, GUI-L-002 |
| Environment | Chromium, Windows, `/login` |
| Preconditions | User is logged out |
| Steps | 1. Open `/login`. 2. Inspect heading, labels, and submit button. |
| Expected | One `h1` identifies “Đăng nhập”; visible UI uses consistent Vietnamese. |
| Actual | No `h1`; heading is “Đăng Ký”; “Username” and “Sign In” remain English. |
| Severity | Major |
| Evidence | `failed-screenshots/GUI-L-001.png`, `GUI-L-002.png` |
| GitHub Issue | Pending |

## BUG-GUI-002 — Login text contrast and pointer targets fail accessibility thresholds

| Field | Value |
| --- | --- |
| Checklist IDs | GUI-L-005, GUI-L-006 |
| Environment | Chromium, Windows, `/login` |
| Preconditions | Login page open |
| Steps | 1. Measure visible text contrast. 2. Measure interactive target boxes. |
| Expected | Normal text ≥4.5:1; primary targets at least 44×44 CSS px or equivalent. |
| Actual | Blue text links fall below 4.5:1; several navigation/form links and controls are below 44 px high. |
| Severity | Major |
| Evidence | `failed-screenshots/GUI-L-005.png`, `GUI-L-006.png` |
| GitHub Issue | Pending |

## BUG-GUI-003 — Login inputs expose incorrect semantics

| Field | Value |
| --- | --- |
| Checklist IDs | GUI-L-007, GUI-L-008, GUI-L-020 |
| Environment | Chromium, Windows, `/login` |
| Preconditions | Login page open |
| Steps | 1. Inspect input types/autocomplete. 2. Type a password. |
| Expected | Email uses `type=email`; password uses `type=password`; autocomplete is `email` and `current-password`. |
| Actual | Both inputs use `type=text`; password is visible; autocomplete tokens are absent. |
| Severity | Critical |
| Evidence | `failed-screenshots/GUI-L-007.png`, `GUI-L-008.png`, `GUI-L-020.png` |
| GitHub Issue | Pending |

## BUG-GUI-004 — Required-field labels and errors are not accessible

| Field | Value |
| --- | --- |
| Checklist IDs | GUI-L-009, GUI-L-010, GUI-L-011A, GUI-L-025, GUI-L-026 |
| Environment | Chromium, Windows, `/login` |
| Preconditions | Login form empty or invalid credentials supplied |
| Steps | 1. Inspect labels. 2. Submit empty form. 3. Submit wrong credentials. 4. Inspect error semantics. |
| Expected | Required markers, label associations, field-specific errors, and live error announcement semantics exist. |
| Actual | No required markers or label `for/id`; no two-field inline errors; credential error has no alert/live-region semantics. |
| Severity | Major |
| Evidence | `failed-screenshots/GUI-L-009.png`, `GUI-L-010.png`, `GUI-L-011A.png`, `GUI-L-025.png`, `GUI-L-026.png` |
| GitHub Issue | Pending |

## BUG-GUI-005 — Positive tabindex breaks Login focus order

| Field | Value |
| --- | --- |
| Checklist IDs | GUI-L-013 |
| Environment | Chromium, Windows, keyboard-only |
| Preconditions | Login page open |
| Steps | Press Tab repeatedly from the initial page state. |
| Expected | Email → Password → Forgot password → Submit → Register. |
| Actual | Submit receives focus before the normal document-order controls. |
| Severity | Major |
| Evidence | `failed-screenshots/GUI-L-013.png` |
| GitHub Issue | Pending |

## BUG-GUI-006 — Login submit provides no pending state

| Field | Value |
| --- | --- |
| Checklist IDs | GUI-L-024A |
| Environment | Chromium, Windows, `/login` |
| Preconditions | Credentials entered |
| Steps | Double-click submit and press Enter repeatedly while request is pending. |
| Expected | Button becomes disabled/busy and displays pending feedback. |
| Actual | Button remains enabled and unchanged. |
| Severity | Major |
| Evidence | `failed-screenshots/GUI-L-024A.png` |
| GitHub Issue | Pending |

## BUG-GUI-007 — Order currency and date formats are not localized for Vietnamese users

| Field | Value |
| --- | --- |
| Checklist IDs | GUI-O-005, GUI-O-006 |
| Environment | Chromium, Windows, `/profile` |
| Preconditions | Logged-in user has orders |
| Steps | Open Order History and inspect Total and Date values. |
| Expected | Vietnamese grouping such as `550.000 ₫`; unambiguous Vietnamese day/month/year date. |
| Actual | Values use browser-default comma grouping such as `550,000 ₫`; dates use US ordering such as `7/26/2026`. |
| Severity | Minor |
| Evidence | `failed-screenshots/GUI-O-005.png`, `GUI-O-006.png` |
| GitHub Issue | Pending |

## BUG-GUI-008 — Cancel order executes without a confirmation dialog

| Field | Value |
| --- | --- |
| Checklist IDs | GUI-O-010, GUI-O-011, GUI-O-027 |
| Environment | Chromium, Windows, `/profile` |
| Preconditions | A cancelable order exists |
| Steps | Activate “Hủy đơn” using pointer and keyboard. |
| Expected | Accessible modal confirms the consequence and manages focus. |
| Actual | Cancellation executes immediately; only a result alert appears. No modal or dialog focus behavior exists. |
| Severity | Critical |
| Evidence | `failed-screenshots/GUI-O-010.png`, `GUI-O-011.png`, `GUI-O-027.png` |
| GitHub Issue | Pending |

## BUG-GUI-009 — Order History is difficult to discover and current navigation is not indicated

| Field | Value |
| --- | --- |
| Checklist IDs | GUI-O-012, GUI-O-013 |
| Environment | Chromium, Windows |
| Preconditions | User is logged in |
| Steps | 1. Inspect navigation from Home. 2. Open Profile. 3. Inspect active state. |
| Expected | A clear Order History destination and current-page indication. |
| Actual | Only “Chào, Test User” links to Profile/History; no `aria-current` or selected/active state is exposed. |
| Severity | Major |
| Evidence | `failed-screenshots/GUI-O-012.png`, `GUI-O-013.png` |
| GitHub Issue | Pending |

## BUG-GUI-010 — Order History has no loading or recoverable error state

| Field | Value |
| --- | --- |
| Checklist IDs | GUI-O-016, GUI-O-022 |
| Environment | Chromium, Windows, delayed/aborted order request |
| Preconditions | Authenticated user opens Profile |
| Steps | 1. Delay the orders request by 1.2 seconds. 2. Repeat with the request aborted. |
| Expected | Loading indicator while pending; distinct error with recovery action on failure. |
| Actual | No loading indicator; failed request has no explicit error or retry action. |
| Severity | Major |
| Evidence | `failed-screenshots/GUI-O-016.png`, `GUI-O-022.png` |
| GitHub Issue | Pending |

## BUG-GUI-011 — Order table has no accessible caption

| Field | Value |
| --- | --- |
| Checklist IDs | GUI-O-019, GUI-O-025 |
| Environment | Chromium, Windows, `/profile` |
| Preconditions | Order History populated |
| Steps | Inspect native table structure and accessible name. |
| Expected | Column headers plus a concise programmatic table caption/name. |
| Actual | Five column headers exist, but no `<caption>` or dedicated accessible table name exists. |
| Severity | Major |
| Evidence | `failed-screenshots/GUI-O-019.png`, `GUI-O-025.png` |
| GitHub Issue | Pending |

## BUG-GUI-012 — Order table causes page-wide horizontal overflow

| Field | Value |
| --- | --- |
| Checklist IDs | GUI-O-020, GUI-O-021, GUI-O-028 |
| Environment | Chromium, 320×640 and 200% scale |
| Preconditions | Order History populated |
| Steps | 1. Set viewport to 320 px. 2. Inspect horizontal overflow. 3. Repeat at 200% scale. |
| Expected | Page reflows; any horizontal scroll is confined to the table region. |
| Actual | The page clips/scrolls horizontally and the table has no localized scroll container. |
| Severity | Major |
| Evidence | `failed-screenshots/GUI-O-020.png`, `GUI-O-021.png`, `GUI-O-028.png` |
| GitHub Issue | Pending |

## Summary

| Metric | Count |
| --- | ---: |
| Checklist items executed | 45 |
| Passed | 15 |
| Failed | 28 |
| Blocked | 2 |
| Consolidated GUI bugs | 12 |
