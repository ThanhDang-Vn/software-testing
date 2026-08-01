# Main Report — HW03 GUI and Usability Testing

## 1. Scope and environment

The SUT is the local `eshop-sut` repository. The web frontend runs at
`http://localhost:5173` and the API at `http://localhost:3000`.

| Scope | Route | Requirements |
| --- | --- | --- |
| Login | `/login` | FR-02, FR-21–FR-24 |
| Order History (inside Profile) | `/profile` | FR-11, FR-21–FR-24 |

The selected usability flow is: sign in with a supplied account, independently
locate the order history, then identify the latest order's ID, date, total, and
current status. The student confirmed that this scope does not duplicate another
group member's primary screen or flow.

## 2. Interface analysis

### User goals

- Sign in safely and understand whether authentication succeeded or failed.
- Recover from a typing or credential error without exposing account details.
- Locate personal order history after authentication.
- Identify the newest order and understand its date, total, and state.

### Main UI components and forms

Login contains an email field, password field, forgot-password link, submit
button, registration link, and error feedback. Order History shares the Profile
page with the profile-edit form and renders either an empty message or a table
containing order ID, date, total, status, and an action.

### Navigation paths

`Header → Đăng nhập → /login → successful login → Home → profile link →
/profile → Lịch sử đơn hàng`. Direct access and expired-session behavior must
also be checked.

### Feedback and state changes

Important states are initial, invalid native form input, wrong credentials,
temporary lock, successful login, order loading, empty history, populated
history, API failure, and session expiration. Results must be observed at
runtime; source inspection is used only to design checks.

### Risks

- Accessibility: semantic labels, focus order, error announcement, table
  structure, color-independent status, keyboard access, zoom and text scaling.
- Responsive design: the five-column order table may overflow narrow screens.
- Language: mixed Vietnamese and English labels may reduce clarity.
- Error recovery: authentication feedback must be timely, non-revealing, and
  positioned before submit according to FR-22.
- State ambiguity: an empty array may represent either no orders or an API
  failure unless distinct states are rendered.
- Localization: dates and VND amounts must use deterministic Vietnamese format.
- Theme and direction: dark mode and RTL are exploratory risks where supported.

## 3. GUI checklist design

The reviewed checklist contains 45 atomic GUI-focused items across both screens and all four
interface aspects. Initial AI items are separated from human-added and refined
items through separate versions. Security, backend authorization, and order
business-rule checks were removed because they are outside this GUI assignment.
Execution columns intentionally remain blank until the SUT is run.

The two-version audit trail is:

- `gui-checklist-v0-agent.xlsx`: the unreviewed agent-generated baseline.
- `gui-checklist-v1-reviewed.xlsx`: 45 GUI items after standards-based human review.

Neither submitted workbook contains a `Source` column. The differences and
reasons for human additions are documented separately in `human-review.md`.

### Critical review of AI-generated items

The detailed V0-to-V1 comparison, explanation for every added item, scope
migration, and lessons learned are documented in
`task-1-gui-checklist/human-review.md`.

## 4. Checklist execution summary

The 45-item V1 checklist was executed with Playwright 1.55.0 on Chromium
against the running local frontend and backend. Test setup created five orders
through authenticated APIs so all five visible order-status labels could be
assessed.

| Result | Count |
| --- | ---: |
| Passed | 15 |
| Failed | 28 |
| Blocked | 2 |
| Total | 45 |

Failed items contain an actual result, note, screenshot, and consolidated Bug
ID. The two Blocked items require a real screen reader to verify reading order
or live status announcement; no result was inferred from source code.

## 5. GUI bugs

The 28 Failed items were consolidated by root cause into 12 GUI bugs. Major
findings include exposed password text, inaccessible form semantics, missing
cancel confirmation, absent loading/error states, and page-wide overflow of
the order table. See `task-1-gui-checklist/bug-report.md`.

All 12 bugs were reported on GitHub as issues #18–#29 with the `homework3`
label. Links are recorded in the checklist and `github-issues-links.md`.

## 6. Usability plan

The moderated evaluation uses SUS with seven real participants outside HW03.
The participant receives a goal rather than UI instructions. A pilot must be
completed and reviewed before official sessions begin.

## 7. Pilot and seven-session results

Pending real sessions and evidence.

## 8. Usability analysis

Pending seven completed session datasets.

## 9. Cross-platform results

The three required platforms were tested on **BrowserStack Live**, running the
Task-2 flow **Login → Hồ sơ → Lịch sử đơn hàng (FR-11)** against the local SUT
exposed through Cloudflare tunnels (frontend + backend). Seven screenshots were
captured; each shows the OS / browser / device in the BrowserStack toolbar, the SUT
tunnel URL, and the student identity `23127334@hcmus.edu.vn` (typed into Username on
login; shown as the Profile email plus the greeting "Chào, Nguyễn Thành Dâng" and
"Họ Tên" field on the Order-History screens).

| Platform | OS / device | Screens | Screenshots | Result |
| --- | --- | --- | --- | --- |
| Google Chrome 147 | macOS desktop | Login; Order History | `chrome1.png`; `chrome2.png` | Rendered correctly |
| Mozilla Firefox 144–145 | Windows 11 desktop | Login; Order History | `firefox1.png`; `firefox2.png` | Rendered correctly |
| Safari (iOS) | iPhone 17 / iOS 26.4; iPhone 16 / iOS 27.0 | Login; Order History | `safari1.png`; `safari2.png`; `safari3.png` | Rendered correctly (mobile reflow) |

The Safari coverage is a genuine Safari-on-iOS run, satisfying the strict "Chrome,
Firefox, and Safari" requirement without a WebKit-on-Windows substitute. The flow
rendered consistently on all three platforms; no platform-specific layout break,
overflow, or missing control was found. The US-style date (`7/31/2026`) and comma-
grouped currency (`62,000,000 đ`) appear identically on every platform, confirming
they are the application-level locale defects already logged in Task 1. Full detail
and the comparison are in `task-3-cross-platform/test-summary.md`.

## 10. Limitations

At this stage, the work is a design and preparation package. Runtime GUI
results, human-participant evidence, GitHub issues, recordings, PDF exports, and
self-assessment remain pending.
