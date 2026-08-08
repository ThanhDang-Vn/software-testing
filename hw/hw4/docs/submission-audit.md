# Submission Audit — 2026-08-08

Status: **NOT READY**. This audit did not delete or synchronize submission files.

## P0

| Status | Finding | Evidence |
| --- | --- | --- |
| FAIL | Only three top-level feature/browser reports exist; nine required | `submission/reports/` contains FR-02 only; workspace has verified 9-run matrix |
| FAIL | Submission manifest contains only three FR-02 entries and no counts | `submission/reports/run-manifest.json` |
| FAIL | HW04 has 0 valid commits over 0 days | `docs/git-commit-log.txt`; parent `.gitignore:7` ignores `hw/hw4/` |
| BLOCKED | Demo URL missing | `submission/README.md`, `submission/links.md` |
| BLOCKED | Final ZIP grade cannot be selected | self-assessment is intentionally TODO pending student review |

## P1

| Status | Finding | Evidence |
| --- | --- | --- |
| FAIL | Submission automation/docs are stale versus current 44-case workspace | submission specs/data and `documents/main-report.md` |
| FAIL | Changed Markdown/PDF pairs are not synchronized | main/audit/critique PDFs predate current workspace changes; bug report has no PDF |
| FAIL | AI audit submission copy lacks the current interaction/workflow | `submission/documents/ai-audit-report.md` |
| FAIL | Bug evidence/drafts are stale; no published Issue URLs | `submission/documents/bug-report.md`, `submission/links.md` |
| PASS | AI critique length is in range | 281 words in submission copy |
| PASS | At least 36 logical cases exist in workspace | 44 cases discovered: 15 + 13 + 16 |
| PASS | New Agent Skill package validates | `submission/automation/playwright-evidence-workflow/`; validator PASS |

## P2

- Submission contains 233 files and 33,344,016 bytes including an older ZIP.
- No individual file exceeds 20 MB.
- Raw `test-results` evidence is large and should be curated, not blindly removed.
- Existing report `all-browsers` is not one of the required nine independent cells.

## Targets that should not be inside the final ZIP

All resolved targets below are inside
`C:\Users\dn156\source\software-testing\software-testing\hw\hw4\submission`.
No target was deleted.

| Absolute target | Inside submission | Estimated saving | Reason |
| --- | --- | ---: | --- |
| `C:\Users\dn156\source\software-testing\software-testing\hw\hw4\submission\23127334_HW04_AI_Automation_073.zip` | yes | 10,473,495 B | old ZIP must not be nested in final ZIP |
| `C:\Users\dn156\source\software-testing\software-testing\hw\hw4\submission\reports\html\fr02-login-lockout\all-browsers` | yes | TODO exact size | obsolete/duplicate report cell |
| `C:\Users\dn156\source\software-testing\software-testing\hw\hw4\submission\evidence\test-results` | yes | up to 8,289,268 B | raw duplicate artifacts; retain only evidence referenced by confirmed bugs |

`node_modules`, runtime `.log` and temp files were not found inside submission. Trace subdirectories
inside required HTML report bundles are assets, not standalone duplicate reports, and must not be
deleted individually.

## Required next decision

The student must explicitly approve exact cleanup targets, decide whether to synchronize current
workspace artifacts into submission, provide/confirm the demo and Issue URLs, resolve authentic Git
history, and choose a three-digit self-assessed grade before ZIP creation.

