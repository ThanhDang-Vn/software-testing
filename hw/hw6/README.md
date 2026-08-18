# HW06 — AI-assisted API Testing

Student ID: `23127334`

Selected branch: `feature/23127334-hw6`

## Repository and SUT

- Submission repository: [ThanhDang-Vn/software-testing](https://github.com/ThanhDang-Vn/software-testing)
- EShop SUT repository: [ttbhanh/eshop-sut](https://github.com/ttbhanh/eshop-sut)
- Local SUT submodule: [`hw/eshop-sut`](../eshop-sut)
- Selected APIs: `POST /api/register`, `POST /api/apply-coupon`, and `POST /api/products`

## Local setup

Requirements: Git, Node.js `20.20.2`, npm, Python 3 with openpyxl for workbook tooling, and Postman or Newman `6.2.1`.

Clone the parent repository and initialize only the valid EShop submodule. A recursive all-submodule update is not used because the repository contains a legacy gitlink without a matching `.gitmodules` URL.

```powershell
git clone https://github.com/ThanhDang-Vn/software-testing.git
Set-Location software-testing
git submodule update --init --depth 1 -- hw/eshop-sut
Set-Location hw/eshop-sut/backend
npm ci
node server.js
```

The backend listens at `http://localhost:3000`. Starting `server.js` loads the database initializer, which recreates and seeds SQLite. Do not commit runtime databases, passwords, JWTs, or the local Postman environment.

## Run in Postman

1. Import [`23127334_HW06_API_Testing.postman_collection.json`](postman/23127334_HW06_API_Testing.postman_collection.json).
2. Create a local environment from [`23127334_HW06_Local.example.postman_environment.json`](postman/23127334_HW06_Local.example.postman_environment.json).
3. Enter local user/admin passwords, leave tokens blank, and select the environment.
4. Confirm `baseUrl=http://localhost:3000` and `studentId=23127334`.
5. For a full manual sequence, run `00 Setup`, one selected API folder, and `99 Verification-Teardown` against a freshly seeded backend.
6. Use the matching data file under [`postman/data/`](postman/data/) for data-driven execution.

Every ordinary and supporting request must carry `X-Student-Id: 23127334`. A real Postman Console capture is retained at [`23127334-x-student-id-console-20260817-140106Z.png`](evidence/postman/23127334-x-student-id-console-20260817-140106Z.png).

## Run with Newman

Install the pinned tools locally from the repository root:

```powershell
npm install --prefix hw/hw6/.tools/newman newman@6.2.1 newman-reporter-htmlextra@1.23.1
```

With the backend freshly restarted and the ignored local environment populated, run each API separately:

```powershell
node hw/hw6/.tools/newman/node_modules/newman/bin/newman.js run hw/hw6/postman/23127334_HW06_API_Testing.postman_collection.json -e hw/hw6/postman/23127334_HW06_Local.postman_environment.json -d hw/hw6/postman/data/register-data.json --folder "00 Setup" --folder "API1 Register" --folder "99 Verification-Teardown" --timeout-request 5000 --timeout 300000 --reporters cli,htmlextra --reporter-htmlextra-export hw/hw6/reports/newman/register-run.html --reporter-htmlextra-skipSensitiveData --color off

node hw/hw6/.tools/newman/node_modules/newman/bin/newman.js run hw/hw6/postman/23127334_HW06_API_Testing.postman_collection.json -e hw/hw6/postman/23127334_HW06_Local.postman_environment.json -d hw/hw6/postman/data/coupon-data.json --folder "00 Setup" --folder "API2 Coupon" --folder "99 Verification-Teardown" --timeout-request 5000 --timeout 300000 --reporters cli,htmlextra --reporter-htmlextra-export hw/hw6/reports/newman/coupon-run.html --reporter-htmlextra-skipSensitiveData --color off

node hw/hw6/.tools/newman/node_modules/newman/bin/newman.js run hw/hw6/postman/23127334_HW06_API_Testing.postman_collection.json -e hw/hw6/postman/23127334_HW06_Local.postman_environment.json -d hw/hw6/postman/data/product-data.json --folder "00 Setup" --folder "API3 Product" --folder "99 Verification-Teardown" --timeout-request 5000 --timeout 300000 --reporters cli,htmlextra --reporter-htmlextra-export hw/hw6/reports/newman/product-run.html --reporter-htmlextra-skipSensitiveData --color off
```

The authoritative retained commands, timestamps, exit codes, totals, and evidence links are in [`postman-run-summary.md`](reports/newman/postman-run-summary.md). The full diagnostic suite is expected to exit non-zero because verified SUT defects and incomplete automation are retained rather than suppressed.

## Postman features used

Evidence supports actual use of:

- Postman workspace and one real manual request/Console capture.
- Collection v2.1, folders/subfolders, collection variables, environment variables, and request/local variables.
- Collection-level and request-level pre-request scripts.
- Test scripts for status, content type, exact schema, business values, sensitive-field absence, side effects, and cleanup.
- External JSON data files and data-driven runs.
- Newman CLI with CLI, JSON, and htmlextra reporters.
- Sanitized environment and collection export.

The Postman GUI Collection Runner, monitors, and mock servers are not claimed because no retained evidence proves their use. See [`postman-features.md`](reports/postman-features.md).

## Test summary

These counts are read from the workbook Summary and final Newman classification, not estimated:

| API | AI-generated | Human-added | Executed | Passed | Failed | Verified bugs |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| API1 Register | 40 | 9 | 49 | 6 | 43 | 1 |
| API2 Coupon | 40 | 10 | 50 | 15 | 35 | 3 |
| API3 Product | 40 | 9 | 49 | 10 | 39 | 1 |
| **Total** | **120** | **28** | **148** | **31** | **117** | **5** |

`Failed` includes candidate SUT failures, test-script defects, and environment/setup failures. Only the five defects reproduced in 2/2 independent reset trials are counted as verified bugs.

## Verified bug links

- [VB-01 — Registration stores password as plaintext](bugs/verified-bugs.md#vb-01--registration-stores-password-as-plaintext)
- [VB-02 — Apply-coupon succeeds without Authorization](bugs/verified-bugs.md#vb-02--apply-coupon-succeeds-without-authorization)
- [VB-03 — Product creation persists without admin Authorization](bugs/verified-bugs.md#vb-03--product-creation-succeeds-and-persists-without-admin-authorization)
- [VB-04 — Coupon rejects the inclusive minimum boundary](bugs/verified-bugs.md#vb-04--coupon-rejects-the-inclusive-minimum-boundary)
- [VB-05 — Percent coupon calculation uses the wrong formula](bugs/verified-bugs.md#vb-05--percent-coupon-calculation-uses-the-wrong-formula)
- [Published GitHub issue records](bugs/github-issues.md)
- Published issues: [#49 — plaintext password](https://github.com/ThanhDang-Vn/software-testing/issues/49), [#50 — missing coupon authorization](https://github.com/ThanhDang-Vn/software-testing/issues/50), [#51 — missing product authorization](https://github.com/ThanhDang-Vn/software-testing/issues/51), [#52 — inclusive boundary](https://github.com/ThanhDang-Vn/software-testing/issues/52), [#53 — percent calculation](https://github.com/ThanhDang-Vn/software-testing/issues/53)
- [Independent reproduction requests](bugs/verified-bugs-reproduction.rest)
- [Real REST evidence screenshots](bugs/screenshots/)

## CI/CD evidence

- Passing baseline: [run 32076713839, job 95531370911](https://github.com/ThanhDang-Vn/software-testing/actions/runs/32076713839/job/95531370911), [artifact 9303692181](https://github.com/ThanhDang-Vn/software-testing/actions/runs/32076713839/artifacts/9303692181), commit `805c5959dd0a19b3a93035c7829dce595ecf8d40`.
- Intentional one-assertion failure: [run 32078644821](https://github.com/ThanhDang-Vn/software-testing/actions/runs/32078644821), [artifact 9304316399](https://github.com/ThanhDang-Vn/software-testing/actions/runs/32078644821/artifacts/9304316399), commit `8f7786b96b85233c81e788ac028e5f2c5596f2ef`.
- Restored passing assertion set: [run 32079401638, job 95539251820](https://github.com/ThanhDang-Vn/software-testing/actions/runs/32079401638/job/95539251820), [artifact 9304578117](https://github.com/ThanhDang-Vn/software-testing/actions/runs/32079401638/artifacts/9304578117), commit `5c3074e38c89c99932b80a02cb69df788dce76b3`.
- Pipeline explanation and real evidence: [`cicd-report.md`](reports/cicd/cicd-report.md), [`passing-run.md`](reports/cicd/passing-run.md), and [`failing-run.md`](reports/cicd/failing-run.md).

## Optional Agent Skill video

The real student-recorded Agent Skill demonstration is available on YouTube: [23127334 HW06 — Agent Skill demonstration](https://youtu.be/OpEuJcmNQPU). The recording follows the one-API workflow documented in the concise [`video-guide.md`](agent-generator/skill/audited-api-test-generator/references/video-guide.md) and timed Vietnamese [`video-script.md`](agent-generator/skill/audited-api-test-generator/references/video-script.md).

## Self-assessment

| Criterion | Maximum | Self-assessed | Evidence basis |
| --- | ---: | ---: | --- |
| API1 — full Register pipeline | 30 | 30 | Contract, 49 workbook cases, audit/extension, Newman evidence, and VB-01 verification |
| API2 — full Coupon pipeline | 30 | 30 | Contract, 50 workbook cases, audit/extension, Newman evidence, and VB-02/VB-04/VB-05 verification |
| API3 — full Product pipeline | 30 | 30 | Contract, 49 workbook cases, audit/extension, Newman evidence, and VB-03 verification |
| Agent Generator | 10 | 10 | Drawing brief/self-drawn Excalidraw file, pseudocode, reusable validated skill, and one-API blocked-review demo |
| **Total** | **100** | **100** | Evidence links above; AI audit completeness limitation remains disclosed below |

This self-assessment reflects deliverable presence and the three full pipelines, not a claim that the SUT passed. The AI audit indexes all 38 planned phases, but only 15 P6–P9 prompts are visible in retained session context; 23 P0–P5 records are explicitly playbook/artifact-reconstructed. Original timestamps and exact historical model metadata remain unavailable. The optional Agent Skill video is supplied through the real YouTube link above. Final grading remains the instructor's decision.

## Submission inventory

| Deliverable | Status | Location |
| --- | --- | --- |
| Main report Markdown | Present | [`main-report.md`](reports/final/main-report.md) |
| Main report PDF | Present; render-checked | [`main-report.pdf`](reports/final/main-report.pdf) |
| AI audit and critique appendix PDF | Present; render-checked | [`ai-audit-critique-appendix.pdf`](reports/final/ai-audit-critique-appendix.pdf) |
| AI critique | Present | [`ai-critique.md`](reports/final/ai-critique.md) |
| AI audit report | Present, but source interaction log is incomplete | [`ai-audit-report.md`](reports/final/ai-audit-report.md) |
| AI audit log | 38/38 phases indexed; 15 visible-session and 23 playbook/artifact-reconstructed records; original timestamps and exact historical model unavailable | [`ai-audit-log.md`](ai-audit-log.md) |
| Test workbook | Present | [`23127334_HW06_API_TestCases.xlsx`](testcases/23127334_HW06_API_TestCases.xlsx) |
| Postman collection | Present | [`23127334_HW06_API_Testing.postman_collection.json`](postman/23127334_HW06_API_Testing.postman_collection.json) |
| Sanitized environment and data files | Present | [`postman/`](postman/) |
| Newman CLI/HTML and reset evidence | Present | [`reports/newman/`](reports/newman/) |
| Verified bugs and published issue records | Present | [`bugs/`](bugs/) |
| CI/CD workflow, links, artifacts, and images | Present | [`reports/cicd/`](reports/cicd/) and [`actions/`](actions/) |
| Self-drawn generator diagram source | Present | [`hw06-architecture.excalidraw`](agent-generator/hw06-architecture.excalidraw) |
| Generator pseudocode | Present | [`pseudocode.md`](agent-generator/pseudocode.md) |
| Reusable Agent Skill | Present and validator-tested | [`audited-api-test-generator/`](agent-generator/skill/audited-api-test-generator/) |
| Optional YouTube video | Provided by the student | [Watch the real video](https://youtu.be/OpEuJcmNQPU) |
| Git commit log export | Present | [`git-commit-log.txt`](reports/final/git-commit-log.txt) |
| Submission checklist | Present; issue evidence is complete, but readiness remains FAIL because original P0–P9 audit metadata/history is incomplete | [`submission-checklist.txt`](reports/final/submission-checklist.txt) |
| Submission ZIP | Review package only; not submission-ready until original audit evidence is completed and the package is regenerated | `23127334_HW06_AI_API_100.zip` |
