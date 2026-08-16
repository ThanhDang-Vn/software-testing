# HW04 AI Automation Submission

**Full name:** Nguyễn Thành Dâng
**Student ID:** 23127334
**Repository:** https://github.com/ThanhDang-Vn/software-testing
**Demo video (Agent Skill + end-to-end flow):** https://youtu.be/e-_aoQkVflk

## Test summary report

Source of truth: `reports/run-manifest.json` (nine feature/browser runs).

| Item | Value |
| --- | ---: |
| Number of features | 3 (FR-02, FR-11, FR-14) |
| Number of test cases automated | 44 (FR-02: 15, FR-11: 13, FR-14: 16) |
| Number of test-case executions (44 × 3 browsers) | 132 |
| Executions passed | 92 |
| Executions failed | 40 |
| Executions skipped | 0 |
| Number of browser runs | 9 (Chromium, Firefox, WebKit per feature) |
| Number of confirmed bugs | 8 (GitHub Issues #33–#40) |
| Flaky events (non-defect) | 1 |
| Demo video | https://youtu.be/e-_aoQkVflk |

The 40 failed executions are repeatable assertion failures that map to the eight confirmed SUT
defects, not test errors. The single Firefox FR14-TC-008 teardown event did not reproduce in a 3/3
repeat run and is classified flaky. All nine HTML reports carry verified `Run by: 23127334`,
feature, browser and ISO 8601 timestamp metadata.

## Self-assessment

| Criterion | Maximum | Self-assessed |
| --- | ---: | ---: |
| Task 1 — FR-02 | 25 | 25 |
| Task 1 — FR-11 | 25 | 25 |
| Task 1 — FR-14 | 25 | 25 |
| Task 2 — Demo video | 15 | 15 |
| Agent Skill | 10 | 10 |
| **Total** | **100** | **100** |

Grade 100/100 was explicitly selected by the student, who remains responsible for the final scripts
and for reviewing every AI-proposed change.

## Submission contents

- `documents/` — Main report, Bug report, AI Audit Report and AI Critique in Markdown **and PDF**,
  plus review notes, the demo/video script, and the Git commit log (`git-commit-log.txt`).
- `automation/` — Test specs, external JSON data, Playwright config, helper scripts and the reusable
  Agent Skill. No `node_modules` is bundled.
- `reports/` — Nine HTML reports, nine JSON results and the portable `run-manifest.json`.
- `evidence/` — Eight original bug screenshots referenced by the bug report.
- Repository & issues — Branch `homework4` is pushed to GitHub; the full commit history is recorded
  in `documents/git-commit-log.txt`, and the eight confirmed defects are published as GitHub Issues
  #33–#40 with labels `bug` and `hw4`.
