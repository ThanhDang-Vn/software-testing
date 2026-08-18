# Newman Postman Run Summary

Generated from isolated final runs at `2026-08-17T14:47:28.480449+00:00`.

## Execution strategy

Each API was executed in a separate Newman invocation. Before every invocation the exact Node process listening on port 3000 was stopped, `server.js` was restarted, and `database.js` dropped/recreated/seeded SQLite. Each invocation ran `00 Setup`, one selected API folder, then `99 Verification-Teardown`.

Expected results were not changed. A passing observed implementation behavior does not resolve an explicitly documented specification ambiguity.

## Run results

| API | Primary cases | PASS | SUT bug | Test script bug | Environment/setup failure | Iterations | Requests | Assertions passed | Assertions failed |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Register | 49 | 6 | 36 | 7 | 0 | 3 | 318 | 1053 | 135 |
| Coupon | 50 | 15 | 20 | 3 | 12 | 3 | 324 | 1068 | 122 |
| Product | 49 | 10 | 32 | 6 | 1 | 3 | 318 | 1083 | 117 |
| **Total** | **148** | **31** | **88** | **16** | **13** | **9** | **960** | **3204** | **374** |

`PASS/FAIL` in the workbook is based on the full audited case, not merely the primary HTTP status. Therefore a request can have passing Newman assertions but be recorded FAIL when its required state was not established or its chained oracle was not automated.

## Failure classification rules

- **SUT BUG:** setup was valid and one or more implemented assertions contradicted the audited specification response, schema, business value or observable side effect.
- **TEST SCRIPT BUG:** the request ran, but the collection did not execute the complete audited chained, multi-iteration, storage or UI verification. It is not reported as a SUT defect.
- **ENVIRONMENT/SETUP FAILURE:** required disabled/usage-limit/concurrency state or expired token was not established. The response is retained, but no SUT conclusion is made.
- **SPEC AMBIGUITY:** the audited expected status explicitly allows alternatives. A PASS means the observed result was among those alternatives; the oracle was not rewritten.

## CLI reproducibility metadata

- Node: `v20.20.2`
- Newman: `6.2.1`
- Reporter: `newman-reporter-htmlextra 1.23.1` with `--reporter-htmlextra-skipSensitiveData`.

### Register

- Timestamp start UTC: `2026-08-17T14:41:16.4479872Z`
- Timestamp end UTC: `2026-08-17T14:41:54.8565006Z`
- Exit code: `1` (non-zero because audited assertions failed).
- Data: `C:\Users\dn156\source\software-testing\software-testing\hw\hw6\postman\data\register-data.json`

```powershell
node hw/hw6/.tools/newman/node_modules/newman/bin/newman.js run hw/hw6/postman/23127334_HW06_API_Testing.postman_collection.json -e hw/hw6/postman/23127334_HW06_Local.postman_environment.json -d hw/hw6/postman/data/register-data.json --folder "00 Setup" --folder "API1 Register" --folder "99 Verification-Teardown" --timeout-request 5000 --timeout 300000 --reporters cli,json,htmlextra --reporter-json-export hw/hw6/reports/newman/register-run.json --reporter-htmlextra-export hw/hw6/reports/newman/register-run.html --reporter-htmlextra-skipSensitiveData --color off
```

### Coupon

- Timestamp start UTC: `2026-08-17T14:41:56.0768050Z`
- Timestamp end UTC: `2026-08-17T14:42:23.3533404Z`
- Exit code: `1` (non-zero because audited assertions failed).
- Data: `C:\Users\dn156\source\software-testing\software-testing\hw\hw6\postman\data\coupon-data.json`

```powershell
node hw/hw6/.tools/newman/node_modules/newman/bin/newman.js run hw/hw6/postman/23127334_HW06_API_Testing.postman_collection.json -e hw/hw6/postman/23127334_HW06_Local.postman_environment.json -d hw/hw6/postman/data/coupon-data.json --folder "00 Setup" --folder "API2 Coupon" --folder "99 Verification-Teardown" --timeout-request 5000 --timeout 300000 --reporters cli,json,htmlextra --reporter-json-export hw/hw6/reports/newman/coupon-run.json --reporter-htmlextra-export hw/hw6/reports/newman/coupon-run.html --reporter-htmlextra-skipSensitiveData --color off
```

### Product

- Timestamp start UTC: `2026-08-17T14:42:24.5054805Z`
- Timestamp end UTC: `2026-08-17T14:42:53.2307192Z`
- Exit code: `1` (non-zero because audited assertions failed).
- Data: `C:\Users\dn156\source\software-testing\software-testing\hw\hw6\postman\data\product-data.json`

```powershell
node hw/hw6/.tools/newman/node_modules/newman/bin/newman.js run hw/hw6/postman/23127334_HW06_API_Testing.postman_collection.json -e hw/hw6/postman/23127334_HW06_Local.postman_environment.json -d hw/hw6/postman/data/product-data.json --folder "00 Setup" --folder "API3 Product" --folder "99 Verification-Teardown" --timeout-request 5000 --timeout 300000 --reporters cli,json,htmlextra --reporter-json-export hw/hw6/reports/newman/product-run.json --reporter-htmlextra-export hw/hw6/reports/newman/product-run.html --reporter-htmlextra-skipSensitiveData --color off
```

## Specification ambiguity observations

These cases retain their audited alternative oracle. The primary classification remains SUT/setup/script when that issue prevents a conclusive ambiguity-only PASS.

| TC_ID | Audited expected status | Actual status | Verdict | Primary classification |
| --- | --- | ---: | --- | --- |
| `REG-AI-019` | 400 or 409 (spec gap) | 200/200/200 | FAIL | SUT BUG |
| `REG-AI-038` | 400 or 415 (spec gap) | 500/500/500 | FAIL | SUT BUG |
| `REG-AI-039` | 200 if unknown fields ignored; 400 if strict schema rejects | 200/200/200 | FAIL | TEST SCRIPT BUG |
| `CPN-AI-007` | 400 or 409 (spec gap) | 200/200/200 | FAIL | ENVIRONMENT/SETUP FAILURE |
| `CPN-AI-022` | 400 or 409 (spec gap) | 200/200/200 | FAIL | ENVIRONMENT/SETUP FAILURE |
| `CPN-AI-025` | 400 if body field remains required, or 200 only if identity is securely derived from JWT (spec gap) | 200/200/200 | FAIL | SUT BUG |
| `CPN-AI-026` | 400 or 403 (spec gap) | 200/200/200 | FAIL | SUT BUG |
| `CPN-AI-029` | 403 or 401 per standardized auth policy | 200/200/200 | FAIL | SUT BUG |
| `CPN-AI-030` | 403 or 401 per standardized auth policy | 200/200/200 | FAIL | ENVIRONMENT/SETUP FAILURE |
| `CPN-AI-039` | 200 if unknown fields ignored; 400 if strict schema rejects | 200/200/200 | FAIL | SUT BUG |
| `PRD-AI-004` | 401 or 403 per standardized auth policy | 200/200/200 | FAIL | SUT BUG |
| `PRD-AI-005` | 401 or 403 per standardized auth policy | 200/200/200 | FAIL | ENVIRONMENT/SETUP FAILURE |
| `PRD-AI-006` | 401 or 403 per standardized auth policy | 200/200/200 | FAIL | SUT BUG |
| `PRD-AI-032` | 400 or 422 (spec gap) | 200/200/200 | FAIL | SUT BUG |
| `PRD-AI-037` | 200 if unknown fields ignored; 400 if strict schema rejects | 200/200/200 | FAIL | TEST SCRIPT BUG |

## Evidence

| API | CLI evidence (status/body/assertions) | HTML report | Backend reset logs |
| --- | --- | --- | --- |
| Register | [register-run.cli.txt](register-run.cli.txt) | [register-run.html](register-run.html) | [stdout](register-backend.stdout.log), [stderr](register-backend.stderr.log) |
| Coupon | [coupon-run.cli.txt](coupon-run.cli.txt) | [coupon-run.html](coupon-run.html) | [stdout](coupon-backend.stdout.log), [stderr](coupon-backend.stderr.log) |
| Product | [product-run.cli.txt](product-run.cli.txt) | [product-run.html](product-run.html) | [stdout](product-backend.stdout.log), [stderr](product-backend.stderr.log) |

Every workbook row contains the actual HTTP status, actual response body (truncated only when necessary with a pointer to full CLI evidence), classification, failed assertion summary and evidence reference.

## Important limitations discovered during execution

- Coupon disabled/usage-limit/concurrency scenarios need dedicated setup fixtures or supporting state APIs before they can yield a valid SUT verdict.
- Expired-JWT cases require a supplied expired token; no JWT was hard-coded or signed using the SUT secret.
- Several human/state/security cases require multi-action or UI/storage verification beyond one primary request. These are explicitly classified as test-script defects rather than SUT bugs.
- Newman JSON reporter records supporting `pm.sendRequest` executions under the parent item. The authoritative byte-accurate primary status/body is decoded from the `[TC_ACTUAL_B64]` entry in each CLI evidence file.
- Machine JSON reports contain resolved runtime auth data by reporter design and are retained only under `.tools/newman-results/`, which is Git-ignored. They are not public submission artifacts.

## Terminal screenshot instructions

The CLI files above are direct, unedited Newman output captured by the runner. To display one in a real terminal for a screenshot:

```powershell
Get-Content -Raw hw\hw6\reports\newman\register-run.cli.txt
```

Capture the terminal window showing the `COMMAND`, timestamps, Node/Newman versions and the Newman totals/assertions table. Repeat for Coupon/Product if required. Alternatively rerun the exact command recorded above after starting a freshly seeded backend and capture its live output.

Do not edit the CLI file, paste fabricated totals, crop different runs together, or modify the screenshot. If secrets appear, rerun with a clean/safe reporter configuration and take a new screenshot rather than redacting an existing image.
