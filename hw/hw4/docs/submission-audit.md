# Submission Audit — 2026-08-09

Scope: `23127334_HW04_AI_Automation_100/` before student PDF/ZIP creation.

| Status | Requirement | Evidence / finding |
| --- | --- | --- |
| PASS | Three HW02 features from Pools A/B/C | FR-02, FR-11, FR-14 |
| PASS | At least 12 logical cases per feature | 15 + 13 + 16 = 44 |
| PASS | Separate data files and multiple assertion patterns | `automation/test-data/`; three specs and validated loaders |
| PASS | Three browsers per feature | 9 HTML reports and 9 JSON results |
| PASS | Student ID and ISO timestamp in reports | All manifest verification fields are true |
| PASS | Demo video link | https://youtu.be/e-_aoQkVflk |
| PASS | AI audit, critique, human review and reusable skill | Current Markdown and skill package are included |
| PASS | Local bug evidence | 8 bug entries and 8 linked screenshots |
| FAIL | Screenshot attached to every GitHub Issue | Issue #35 has no GitHub-hosted attachment; 7/8 pass |
| FAIL | At least 8 valid test-script commits over 4 days | 3 strict-valid commits over 1 real day |
| BLOCKED | Required Markdown/PDF pairs | 0 PDFs in final folder; student will export after content freeze |
| BLOCKED | Final ZIP checks | ZIP intentionally not created yet |

## Cleanup completed

- Excluded `automation/node_modules/`.
- Excluded temporary `automation/test-results/`.
- Excluded temporary `automation/reports/`, including the non-required `all-browsers` report.
- Preserved the nine verified reports under top-level `reports/` and all referenced bug evidence.

## Student finishing actions

1. Attach the BUG-03 screenshot to GitHub Issue #35.
2. Continue only genuine test-script work on real future days if the Git requirement can still be met.
3. Export the four required PDFs from the current Markdown files.
4. Create `23127334_HW04_AI_Automation_100.zip`, test extraction and confirm the Moodle size limit.
5. Submit manually before the deadline.
