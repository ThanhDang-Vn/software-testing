# HW04 AI Automation Submission

**Full name:** Nguyễn Thành Dâng  
**Student ID:** 23127334  
**Repository:** https://github.com/ThanhDang-Vn/software-testing  
**Demo video (skill + E2E flow):** https://youtu.be/e-_aoQkVflk

## Verified test summary

Source: `reports/run-manifest.json`, independently verified at
`2026-08-08T01:48:00.391Z`.

| Metric | Verified value |
| --- | ---: |
| Features | 3 |
| Logical cases | 44 (15 + 13 + 16) |
| Browser runs | 9 |
| Individual executions | 132 |
| Passed | 92 |
| Failed | 40 |
| Skipped | 0 |
| Blocked executions | 0 |
| Confirmed SUT defect groups | 8 |
| Flaky events | 1 |

The Firefox FR14-TC-008 teardown event did not reproduce in a 3/3 repeat run.
All nine HTML reports have verified Student ID, feature, browser and ISO timestamp metadata.

## Self-assessment

| Criterion | Maximum | Self-assessed |
| --- | ---: | ---: |
| FR-02 | 25 | 25 |
| FR-11 | 25 | 25 |
| FR-14 | 25 | 25 |
| Demo video | 15 | 15 |
| Agent Skill | 10 | 10 |
| **Total** | **100** | **100** |

Grade 100 was explicitly selected by the student. The missing video and incomplete Git-history
requirement remain readiness blockers and must not be hidden by the self-assessment.

## Contents and blockers

- `documents/`: synchronized Markdown reports and AI records; PDF export is pending student action.
- `automation/`: specs/data/config plus the validated `playwright-evidence-workflow` skill.
- `reports/`: verified nine HTML reports, JSON results and portable run manifest.
- `evidence/`: genuine traces/screenshots and Git audit.
- P0: branch `homework4` is pushed, but only 3 commits currently change test specs and all were
  created on 2026-08-08; the required 8 valid test-script commits across 4 real days is not met.
- Eight reviewed GitHub Issues (#33–#40) are published with labels `bug` and `hw4`.
- P0: Issue #35 still needs its screenshot attached on GitHub; the local bug report already embeds it.
- P0: required PDFs must be exported after the Markdown files are finalized.
