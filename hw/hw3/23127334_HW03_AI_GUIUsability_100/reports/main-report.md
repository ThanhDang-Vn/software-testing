# Main Report — HW03: GUI and Usability Testing

| Field | Value |
| --- | --- |
| Student | Nguyễn Thành Dâng |
| Student ID | 23127334 |
| Identity overlay | `23127334@hcmus.edu.vn` |
| SUT | EShop (`eshop-sut`) — Vietnamese e-commerce demo |
| Repository under test | https://github.com/ttbhanh/eshop-sut |
| GitHub Issues (bugs) | https://github.com/ThanhDang-Vn/software-testing/issues (#18–#29) |
| Usability scale | SUS (System Usability Scale) |
| AI policy | Open — AI used and fully declared (see `reports/ai-audit-report.md`, `reports/ai-critique.md`) |

This report documents the full process for the three required tasks — GUI
checklist design and execution, a moderated 7-participant usability evaluation,
and cross-browser / cross-platform testing — together with the agent skill and
the mandatory AI appendices. Every AI-produced artifact in this package was
reviewed against the running SUT and the actual requirements before it was kept.

---

## 1. Scope, environment, and selection

### 1.1 Selected screens and flow

Following §5 (Scope Selection), the work targets the SUT's **user interface**,
concentrating on two screens joined by one end-to-end flow so that the checklist
and the usability study reinforce each other.

| Scope | Route | Primary requirement | Role in this HW |
| --- | --- | --- | --- |
| **Login** | `/login` | FR-02 (Login & account lockout) | GUI checklist + entry point of the usability flow |
| **Order History** (inside Profile) | `/profile` | FR-11 (Order history view, user) | GUI checklist + goal screen of the usability flow |

**Selected usability flow (single end-to-end flow):** *sign in with a supplied
account → independently locate the personal order history → identify the latest
order's ID, date, total, and current status.* This same flow is the task
scenario used with the seven participants in Task 2 and the flow exercised on
every platform in Task 3, giving the three tasks a shared, comparable baseline.

The student confirms this primary screen and flow are **not duplicated** by any
other member of the group (per §5).

### 1.2 Environment

| Item | Value |
| --- | --- |
| Frontend | `http://localhost:5173` (Vite) |
| Backend API | `http://localhost:3000` |
| Checklist execution | Playwright 1.55.0, Chromium, Windows |
| Main viewport | 1280×800; plus 320×640, 200% zoom, portrait/landscape, RTL, dark preference |
| Cross-platform | BrowserStack Live (trial); local SUT exposed through Cloudflare quick tunnels |
| Test data | Five orders seeded through authenticated APIs so all five order-status labels are observable |

Results were observed **at runtime**. Source inspection (`Login.jsx`,
`Profile.jsx`, `App.jsx`, `AuthContext.jsx`, and the backend login/order
endpoints) was used only to *design* checks and to explain observed behaviour —
never to infer a pass/fail without running the SUT.

---

## 2. Interface analysis (basis for the checklist)

### 2.1 User goals

- Sign in safely and understand clearly whether authentication succeeded or failed.
- Recover from a typing or credential error without exposing account details.
- Locate personal order history after authentication, unaided.
- Identify the newest order and correctly read its ID, date, total, and state.

### 2.2 Main UI components and forms

- **Login** — email/username field, password field, "Quên mật khẩu?" link, submit
  button, registration link, and credential-error feedback.
- **Order History** — shares the Profile page with the profile-edit form; renders
  either an empty message or a five-column table (Mã ĐH, Ngày đặt, Tổng tiền,
  Trạng thái, Thao tác) with a per-row cancel action for eligible orders.

### 2.3 Navigation paths

`Header → Đăng nhập → /login → successful login → Home → account greeting →
/profile → Lịch sử đơn hàng`. Direct-URL access and expired-session behaviour are
also considered. A key observation feeding both tasks: **there is no explicitly
named "Order History" navigation entry** — the only route into history is the
account greeting, which does not read as a link.

### 2.4 Feedback and state

Important states enumerated for the checklist: initial, invalid native form
input, wrong credentials, temporary lockout, successful login, order loading,
empty history, populated history, API failure, and session expiration.

### 2.5 Interface risks (the four IAs)

- **IA-01 General UI standards** — contrast, target size, responsive reflow, zoom,
  text spacing, orientation, colour-independent status, localization of date/VND.
- **IA-02 Forms** — input semantics (`type=email`/`password`), label association,
  required markers, autocomplete, keyboard order, focus visibility, error linkage.
- **IA-03 Navigation** — discoverability of order history and current-location
  indication.
- **IA-04 Feedback / state** — pending state on submit, loading indicator,
  distinct error-vs-empty state, cancel confirmation and result feedback, live
  announcement of dynamic errors / status changes.

Exploratory risks explicitly flagged (no explicit SUT requirement): **RTL layout**
and **dark mode**.

---

## 3. Task 1 — GUI checklist

### 3.1 Design method (AI-first, then human review)

The checklist was built in the disciplined, staged way §2 requires rather than by
a single generic prompt:

1. **AI baseline (`gui-checklist-v0-agent.xlsx`, 32 items).** An AI tool generated
   an initial checklist across the two screens.
2. **Standards-based human review (`gui-checklist-v1-reviewed.xlsx`, 45 items).**
   Every AI item was re-derived against **WCAG 2.2, WAI Forms, ARIA APG, the
   GOV.UK Design System, and Nielsen's heuristics**. Items the AI missed were
   added, each with a written reason; items that mixed a GUI oracle with a
   non-GUI (auth/API/session/security) assertion were split so each case has
   **exactly one observable objective and one oracle**.

The full V0→V1 comparison, the reason the AI missed each added item, the
scope-migration of non-GUI items, and the lessons learned are in
`task-1-gui-checklist/human-review.md`. Both workbooks are submitted so the raw
AI baseline stays visible as evidence; no `Source` column is kept in the
delivered workbooks (the provenance is documented separately in `human-review.md`).

**What the AI systematically missed** (representative, not exhaustive): password
manager / autocomplete purpose, 200% zoom reflow on the data table, RTL, submit
pending-state, colour-independent status, table header–cell association and
`<caption>`, screen-reader live-region announcement of dynamic errors and status
changes, WCAG *Focus Not Obscured*, text-spacing overrides, orientation, and
dark mode. The recurring cause: a generic "generate a GUI checklist" prompt does
not specify the WCAG level, the assistive tooling, the viewports, or the
one-objective-per-case rule, so the model defaulted to happy-path, by-eye checks.

### 3.2 Coverage

45 atomic items (> 40 minimum) spanning both screens and **all four IAs**:

| Interface aspect | Example item IDs | Covered |
| --- | --- | --- |
| IA-01 General UI standards | GUI-L-001/003/004/005/006/021/028/029/030, GUI-O-002A/004/005/006/007/008/018/019/020/021/025/028 | ✅ |
| IA-02 Forms | GUI-L-007/008/009/010/011A/013/014/020/025/027, GUI-O-010/011/027 | ✅ |
| IA-03 Navigation | GUI-O-012, GUI-O-013 | ✅ |
| IA-04 Feedback / state | GUI-L-024A/026, GUI-O-016/022/024A/029 | ✅ |

### 3.3 Execution

The 45-item V1 checklist was executed with Playwright 1.55.0 on Chromium against
the running local frontend and backend. Each item carries an **Expected result,
Actual result, Status, Notes, Evidence, and a consolidated Bug ID**.

| Result | Count |
| --- | ---: |
| Passed | 17 |
| Failed | 28 |
| Blocked | 0 |
| **Total** | **45** |

Every **Failed** item has an actual result, a note explaining *why* it failed, and
a screenshot under `task-1-gui-checklist/failed-screenshots/` (28 screenshots,
Failed items only, per §6). Two items that depend on assistive technology
(GUI-O-026 reading order, GUI-O-029 status announcement) were not inferred from
source code: they were executed with a **manual screen-reader run** and both
**passed**, so all 45 items now carry a Pass/Fail verdict with no items left
Blocked. A per-screen and per-IA breakdown is in
`task-1-gui-checklist/test-summary.md`.

### 3.4 Bugs (12), reported in Markdown and on GitHub Issues

The 28 Failed items were consolidated by root cause into **12 GUI bugs**, each
reported both in `task-1-gui-checklist/bug-report.md` and as a GitHub issue
(#18–#29, label `homework3`) with a screenshot attached.

| Bug | Screen | Summary | Severity | Issue |
| --- | --- | --- | --- | --- |
| BUG-GUI-001 | Login | No `h1`; heading reads "Đăng Ký"; "Username"/"Sign In" mix EN with VI | Major | #18 |
| BUG-GUI-002 | Login | Blue link below 4.5:1 contrast; several targets under 44×44 px | Major | #19 |
| BUG-GUI-003 | Login | Email/password use `type=text` (password visible); no autocomplete tokens | Critical | #20 |
| BUG-GUI-004 | Login | No required markers, no label `for/id`, no field-level or live error semantics | Major | #21 |
| BUG-GUI-005 | Login | Positive `tabindex` breaks keyboard focus order | Major | #22 |
| BUG-GUI-006 | Login | Submit shows no pending state; repeat activation not prevented | Major | #23 |
| BUG-GUI-007 | Order History | Non-Vietnamese currency grouping and US date order (`7/26/2026`) | Minor | #24 |
| BUG-GUI-008 | Order History | Cancel executes with no confirmation dialog / focus management | Critical | #25 |
| BUG-GUI-009 | Order History | Order history not discoverable; no current-location indicator | Major | #26 |
| BUG-GUI-010 | Order History | No loading state; API failure indistinguishable from empty history | Major | #27 |
| BUG-GUI-011 | Order History | Table has column headers but no `<caption>` / accessible name | Major | #28 |
| BUG-GUI-012 | Order History | Five-column table causes page-wide horizontal overflow at 320 px / 200% | Major | #29 |

---

## 4. Task 2 — Usability evaluation (7 participants)

### 4.1 Plan and objectives

**Objective (`objective.md`):** determine whether typical Vietnamese online
shoppers can sign in, *independently* discover their order history, and correctly
interpret the latest order's four FR-11 fields without moderator guidance.
Research questions cover login error recovery, discoverability, correct field
reporting, label/colour comprehension, and trust.

**Target user profile:** 18+, has used e-commerce at least once, **not enrolled in
this HW03 class**, preferably non-IT / non-tester, reads Vietnamese, consents.

**Task scenario (`task-scenario.md`) — goal, not steps:** *"Bạn đã từng mua hàng
trên EShop và muốn kiểm tra lại một đơn hàng gần đây. Hãy đăng nhập bằng tài
khoản được cung cấp, tìm nơi chứa các đơn hàng trước đây, rồi cho biết mã đơn,
ngày đặt, tổng tiền và trạng thái hiện tại của đơn hàng gần nhất."* The words
`/profile`, "Lịch sử đơn hàng", and any step-by-step navigation are deliberately
withheld from the participant.

**Instruments:** the 10-item **SUS** completed after every session
(`sus-questionnaire.md`), plus open probe questions covering, at minimum,
**clarity, error recovery, speed, and trust** (`sessions/P0x/probe-answers.md`).

**Completion coding:** `SUCCESS_UNASSISTED`, `SUCCESS_ASSISTED` (after a necessary
neutral intervention), or `FAIL` (cannot report all four fields within 8 minutes).

**Pilot:** a moderator dry-run was completed and marked READY before the official
sessions (`pilot-session/pilot-notes.md`), confirming the scenario wording, the
account state, and timing.

### 4.2 Conduct

Seven real participants (P01–P07), recruited **outside the HW03 class**, each
completed one moderated session. The moderator set the stage ("we test the
product, not you"; think-aloud), observed neutrally, stepped in only when a
participant was fully stuck, and closed with the SUS scale and probe questions.
Every session was **screen-recorded with consent** (unlisted YouTube links in
`recording-links.md`; consent tracked in `consent-statement.md`). A verifiable
**email contact** for each of the seven participants is listed in
`participant-list.csv` / `.xlsx` for TA verification (per §11).

### 4.3 Results (n = 7)

| Metric | Value |
| --- | --- |
| Completion | 7/7 (100%) |
| Unassisted completion | 5/7 (P01, P03, P04, P05, P07) |
| Assisted completion | 2/7 (P02, P06) |
| Mean completion time | 287.3 s (4:47) |
| **Mean SUS** | **66.4 / 100** |
| Errors / wrong turns / hesitations / interventions | 1 / 4 / 19 / 2 |

**Per-participant SUS (`sus-summary.csv`):**

| P01 | P02 | P03 | P04 | P05 | P06 | P07 | Mean |
| ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| 80.0 | 57.5 | 75.0 | 55.0 | 87.5 | 32.5 | 77.5 | **66.4** |

Mean SUS 66.4 sits just below the ~68 acceptability benchmark, which is
consistent with the discoverability friction observed on the flow.

### 4.4 Analysis — severity-ranked findings

Notes were synthesised, similar pain points grouped, and isolated bugs separated
from systemic design issues (`severity-ranked-findings.md`):

| Rank | ID | Severity | Freq | Finding | Recommendation |
| ---: | --- | --- | ---: | --- | --- |
| 1 | USAB-01 | Critical | 7/7 | Order-history entry point not discoverable; account greeting not read as a link | Add an explicit "Đơn hàng của tôi" nav entry; mark current page |
| 2 | USAB-07 | Major | 5/7 | History lacks per-order product detail and actions; no cancel confirmation | Order detail view; confirm-before-cancel; back-to-shop link |
| 3 | USAB-04 | Major | 4/7 | Password not masked on login; EN/VI label mix | Mask password (with show/hide); consistent Vietnamese labels |
| 4 | USAB-03 | Major | 4/7 | Ambiguous US date format; no time shown | Deterministic `31/07/2026`, `450.000 ₫`, include time |
| 5 | USAB-06 | Major | 3/7 | Table sort order not labelled | Label "Mới nhất trước"; sortable "Ngày đặt" header |
| 6 | USAB-05 | Minor | 1/7 | Unexpected keyboard focus order on login | Remove positive `tabindex` |
| 7 | USAB-08 | Minor | 2/7 | Red total reads as a warning; prominent exit; order code felt unnecessary | Neutral colour for totals; de-emphasise exit |

The dominant, **critical** finding (USAB-01) is the same discoverability defect
captured by BUG-GUI-009 in Task 1 and confirmed cross-platform in Task 3 —
triangulated evidence from three independent methods. The primary recommendation
is a clearly labelled order-history navigation entry, plus deterministic
Vietnamese date/currency formatting and a masked password field.

---

## 5. Task 3 — Cross-browser / cross-platform

The Task-2 flow (**Login → Hồ sơ → Lịch sử đơn hàng, FR-11**) was run on
**BrowserStack Live**, with the local SUT exposed through two Cloudflare quick
tunnels (frontend + backend). Seven screenshots were captured; each shows the
OS/browser/device in the BrowserStack toolbar, the SUT tunnel URL, and the
student identity `23127334@hcmus.edu.vn` (typed into Username at login; shown as
the Profile email and the greeting "Chào, Nguyễn Thành Dâng" plus the "Họ Tên"
field on the Order-History screens).

| Platform | OS / device | Screens | Screenshots | Result |
| --- | --- | --- | --- | --- |
| Google Chrome 147 | macOS desktop | Login; Order History | `chrome1.png`; `chrome2.png` | Rendered correctly |
| Mozilla Firefox 144–145 | Windows 11 desktop | Login; Order History | `firefox1.png`; `firefox2.png` | Rendered correctly |
| Safari (iOS) | iPhone 17 / iOS 26.4; iPhone 16 / iOS 27.0 | Login; Order History | `safari1.png`; `safari2.png`; `safari3.png` | Rendered correctly (mobile reflow) |

This is a **genuine Safari-on-iOS** run — it satisfies the strict "Chrome,
Firefox, and Safari" requirement without a WebKit-on-Windows substitute. Fifteen
atomic cross-platform checks (CP-T01–CP-T15) returned **14 Passed / 1 Failed**;
the single failure (CP-T15) is the order-table horizontal overflow on the narrow
mobile viewport — i.e. the Task-1 responsive defect (BUG-GUI-012), confirmed as a
**consistent application-level** issue rather than a one-platform break. The
US-style date (`7/31/2026`) and comma-grouped currency (`62,000,000 đ`) render
**identically on every platform**, confirming the locale defects (BUG-GUI-007)
are application-level, not browser-specific. Full detail is in
`task-3-cross-platform/test-summary.md`.

---

## 6. Agent skill

An agent skill (`agent-skills/hw03-gui-usability-testing.skill.md`) encodes the
GUI-checklist and usability-evaluation workflow — required inputs, mandatory
gates (>40 items, all four IAs, source/expected/actual/status/notes per item,
screenshots for failed items only), and the usability protocol — so it can be
reused on additional screens and flows. Demonstration video link(s) are recorded
in `agent-skills/demo-video-links.md`.

---

## 7. AI usage (summary)

AI was used and is fully declared. The complete, per-interaction log (tool, date,
prompt, output, human review) is in `reports/ai-audit-report.md`; the mandatory
200–300-word critique is in `reports/ai-critique.md`. In short: AI accelerated
scaffolding (checklist baseline, execution harness, document drafting, tunnel
setup) but repeatedly produced work that *looked* finished yet was wrong until
checked against the running SUT and the real requirements — most notably an
initial batch of *simulated* usability personas that had to be replaced with
genuine recorded sessions, and a WebKit-on-Windows run that had to be redone as
real Safari-on-iOS. Every such artifact was corrected or regenerated under human
review before inclusion.

---

## 8. Limitations

- The two assistive-technology items (GUI-O-026 reading order, GUI-O-029 live
  status announcement) were verified with a single manual screen-reader run;
  broader AT coverage across multiple screen readers was not performed.
- All usability sessions ran on **laptop/desktop**; mobile responsiveness was not
  evaluated with a real handset in a moderated session (Task 3 did exercise mobile
  Safari, but not with a participant).
- The sample (n = 7) follows the "discount usability" design: sufficient to expose
  repeated problems, not intended for quantitative generalisation.
- Participants are HCMUS students; recruitment ensured **none are enrolled in
  HW03** (a hard eligibility rule); non-IT / non-tester is a preference only.

---

## 9. Deliverables index

| Deliverable | Location |
| --- | --- |
| Main report (MD + PDF) | `reports/main-report.md`, `reports/main-report.pdf` |
| GUI checklist (Excel v0 + v1) + review | `task-1-gui-checklist/gui-checklist-v0-agent.xlsx`, `gui-checklist-v1-reviewed.xlsx`, `human-review.md` |
| Checklist execution + bugs | `task-1-gui-checklist/execution-results.json`, `bug-report.md`, `failed-screenshots/`, `github-issues-links.md` |
| Usability plan + sessions | `task-2-usability/` (objective, task-scenario, sus-questionnaire, moderator-script, consent-statement, pilot-session, sessions/P01–P07) |
| SUS + findings + participants | `task-2-usability/sus-summary.csv`, `sus-ueqs-summary.xlsx`, `severity-ranked-findings.md`, `participant-list.csv/.xlsx`, `recording-links.md` |
| Cross-platform | `task-3-cross-platform/test-summary.md`, `screenshots/` |
| Agent skill + demo | `agent-skills/hw03-gui-usability-testing.skill.md`, `demo-video-links.md` |
| AI appendices (MD + PDF) | `reports/ai-audit-report.md/.pdf`, `reports/ai-critique.md/.pdf` |
| Git commit log | `git-commit-log.txt` |
| README (self-assessment + summary) | `README.md` |
