# AI Audit Report

Declaration: I use AI tools for the following tasks.

## Interaction 1

- Tool: OpenAI Codex
- Date and time: 2026-07-26 (Asia/Saigon)
- Purpose: Inspect the HW03 assignment, existing artifacts, and SUT scope.
- Prompt: “Thực hiện homework 3.”
- AI output: Identified the official constraints, detected that existing
  Lumiere artifacts do not belong to the EShop SUT, and refused to treat them
  as valid participant or platform evidence.
- Human review and corrections: Student clarified that `eshop-sut` must be
  used.
- Output files affected: None.

## Interaction 2

- Tool: OpenAI Codex
- Date and time: 2026-07-26 (Asia/Saigon)
- Purpose: Define suitable screens and a usability flow.
- Prompt: Student selected `FR-02 Login & Account Lockout` and `FR-11 Order
  History View (User)` and requested screen/flow definition.
- AI output: Proposed Login and Order History screens and the flow “sign in,
  locate order history, inspect latest order.”
- Human review and corrections: Student approved the scope, confirmed no group
  duplication, chose SUS, and deferred GitHub URL and final grade.
- Output files affected: Scope documents in the working package.

## Interaction 3

- Tool: OpenAI Codex
- Date and time: 2026-07-26 (Asia/Saigon)
- Purpose: Prepare evidence-safe HW03 artifacts.
- Prompt: “just do it”
- AI output: Analysed `Login.jsx`, `Profile.jsx`, `App.jsx`,
  `AuthContext.jsx`, backend login/order endpoints, and created a working
  package without fabricating execution results.
- Human review and corrections: Pending.
- Output files affected: README, main report, GUI checklist, usability
  protocol/templates, AI audit, and validation files under
  `23127334_HW03_AI_GUIUsability_TBD/`.

## Interaction 4

- Tool: OpenAI Codex
- Date and time: 2026-07-26 (Asia/Saigon)
- Purpose: Refine checklist versioning and scope after human review.
- Prompt: The student requested separate agent-generated v0 and human-reviewed
  v1 workbooks, removal of the Source column, and removal of cases outside GUI
  scope or without an applicable standard.
- AI output: Produced v0 and v1 workbooks without Source, reduced v1 to 41
  GUI-focused items, and retained the review rationale separately.
- Human review and corrections: Student selected the cases to remove and asked
  for a continuously maintained prompt history.
- Output files affected: GUI checklist workbooks, human-review log, README,
  main report, final validation, and `prompt-history.md`.

## Interaction 5

- Tool: OpenAI Codex with Playwright 1.55.0
- Date and time: 2026-07-26 (Asia/Saigon)
- Purpose: Execute the V1 GUI checklist and report confirmed failures.
- Prompt: “execute testing using playwright to assessment; write bug report”
- AI output: Executed 45 cases in Chromium, recorded 15 Passed, 28 Failed, and
  2 Blocked results, captured one screenshot for every Failed item, and
  consolidated failures into 12 GUI bug reports.
- Human review and corrections: Corrected the contrast oracle to use the
  actual foreground/background pair and classified browser-default US date
  formatting as a localization failure.
- Output files affected: V1 XLSX/CSV, execution-results JSON, failed
  screenshots, bug report, README, and main report.

## Interaction 6

- Tool: OpenAI Codex with Playwright 1.55.0
- Date and time: 2026-07-26 (Asia/Saigon)
- Purpose: Execute Task 3 cross-browser coverage.
- Prompt: “ủa task 3 phải làm gì, thực hiện task 3 đi”
- AI output: Executed Login → Order History in Google Chrome, Firefox, and
  WebKit; captured three screenshots with browser/version, OS, URL, and student
  identity overlay.
- Human review and corrections: WebKit on Windows is explicitly reported as an
  engine run, not Safari evidence. A real Safari or Android Chrome run remains.
- Output files affected: Task 3 execution JSON, screenshots, test summary,
  README, and main report.

## Interaction 7

- Tool: Claude Code (Claude Opus 4.8)
- Date and time: 2026-08-01 (Asia/Saigon)
- Purpose: Complete the remaining Task 2 usability deliverables from the
  student's real participant data.
- Prompt: “tôi vừa fill các file như observation và probe-answer … bạn hãy từ đó
  fill hết những file còn lại trong task 2” and follow-ups adding P05–P07,
  re-evaluating SUS, and editing the participant list.
- AI output: From the student's real observation notes, probe answers, and
  YouTube recording links for P01–P07, generated the remaining per-participant
  evidence (SUS scoring sync, `evidence-links.md` with real recording links and
  consent), reconciled header/event-log contradictions using the header as the
  source of truth, recomputed `sus-summary.csv` (mean SUS 66.4, mean time
  287.3 s), synthesised `severity-ranked-findings.md`, wrote the pilot notes,
  reconstructed P06's event log from its header, and regenerated
  `participant-list.xlsx` and `sus-ueqs-summary.xlsx` via
  `generate_usability_xlsx.py`. Refused to fabricate missing data (SUS values,
  masked contacts) and surfaced the simulated-vs-real conflict instead.
- Human review and corrections: Student confirmed the SUS values are real,
  resolved the P05 recording conflict, directed that P01–P07 be marked as real
  people, chose “header is the source of truth”, removed two participant-list
  columns, and re-evaluated P06's SUS.
- Output files affected: `task-2-usability/` session files (P01–P07),
  `sus-summary.csv`, `participant-list.csv/.xlsx`, `sus-ueqs-summary.xlsx`,
  `severity-ranked-findings.md`, `pilot-session/pilot-notes.md`.

## Interaction 8

- Tool: Claude Code (Claude Opus 4.8)
- Date and time: 2026-08-01 (Asia/Saigon)
- Purpose: Host the local SUT for BrowserStack and prepare/​document the Task 3
  cross-platform evidence.
- Prompt: “host lại cloudflare để tôi chạy trên browser stack … cụ thể bạn cần
  bao nhiêu ảnh” and follow-ups supplying the full name and the captured images.
- AI output: Started the backend (`:3000`) and frontend (`:5173`), published both
  through Cloudflare quick tunnels, pointed the frontend at the backend tunnel via
  `VITE_API_BASE_URL`, seeded an identity account
  (`23127334@hcmus.edu.vn` / Nguyễn Thành Dâng) with five orders through a
  temporary script, and end-to-end tested login + order retrieval through the
  tunnels. Specified the screenshot plan (2 screens × 3 platforms). After the
  student captured the screenshots, reviewed each image and rewrote the Task 3
  documentation to match the seven real files.
- Human review and corrections: **The cross-platform screenshots were captured by
  the student on real BrowserStack devices (Chrome/macOS, Firefox/Windows 11,
  genuine Safari/iOS) — AI only prepared the environment and data and wrote the
  documentation; the screenshots themselves are not AI-generated.** The student
  supplied their full name and confirmed completion.
- Output files affected: `task-3-cross-platform/test-summary.md`,
  `screenshots/README.md`, `execution-results.json` (removed the orphaned
  `execution-results-local.json`), `reports/main-report.md`, `FINAL-VALIDATION.md`,
  and the top-level `README.md`; temporary `eshop-sut/backend/_prep_task3.cjs`.
