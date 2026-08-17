# Postman Features Actually Used

## Evidence rule

This inventory records only features supported by a repository artifact, actual Postman screenshot or executed Newman report. A design mention alone is not evidence that a feature was run.

## Used features

| Feature | How it was used | Purpose | Evidence |
| --- | --- | --- | --- |
| Postman workspace | Requests were created and sent in `My Workspace` with environment `HW06 Local` selected | Organize and manually inspect HW06 requests against the local backend | Student-provided Postman screenshot stored at [`evidence/postman/23127334-x-student-id-console-20260817-140106Z.png`](../evidence/postman/23127334-x-student-id-console-20260817-140106Z.png) visibly shows `My Workspace`, the selected environment and a real `POST /api/register` response |
| Collection | Collection `23127334_HW06_API_Testing` contains the exported executable test design | Keep setup, 148 `TC_ID` primary requests, assertions and teardown in one portable artifact | [`postman/23127334_HW06_API_Testing.postman_collection.json`](../postman/23127334_HW06_API_Testing.postman_collection.json); all three Newman JSON reports identify this collection name |
| Folders and subfolders | Used `00 Setup`, `API1 Register`, `API2 Coupon`, `API3 Product`, `99 Verification-Teardown`; every API contains `Domain`, `State`, `Security`, `Schema` | Select isolated API runs while preserving setup and teardown; group cases by primary technique | Collection JSON structure; exact `--folder` selections are recorded in [`reports/newman/postman-run-summary.md`](newman/postman-run-summary.md) and each CLI header |
| Collection variables | `runId`, cleanup ID stacks and `activeTestId` store run-level state | Produce run-scoped identities, link requests to `TC_ID` and retain cleanup state without publishing it in the environment | Collection `variable` array and scripts in the exported collection; CLI `[TC_ACTUAL_B64]` entries show the associated `TC_ID` executions |
| Environment variables | `baseUrl`, `studentId`, credentials, tokens, IDs and captured values are resolved from `23127334_HW06_Local` | Separate endpoint/runtime identity from collection logic; obtain JWTs during setup rather than hard-code them | Ignored local environment used by the exact CLI commands; sanitized public template [`postman/23127334_HW06_Local.example.postman_environment.json`](../postman/23127334_HW06_Local.example.postman_environment.json); setup login requests pass in CLI evidence |
| Local/request variables | `pm.variables` stores `caseEmail`, `caseProductName`, coupon code, data-row fields and request-specific suffixes | Keep per-request/per-iteration derived data from leaking into later cases | Request-level pre-request scripts in the collection; unique `i0`, `i1`, `i2` suffixes are generated for data iterations |
| Collection-level pre-request script | Upserts `X-Student-Id: 23127334`, asserts it before send, logs URL/header/timestamp and initializes run state | Enforce student traceability on every request and provide console evidence | Collection-level `prerequest` event; screenshot shows URL, timestamp and `X-Student-Id`; every CLI request logs `Pre-request: X-Student-Id is attached and correct` |
| Request pre-request scripts | Set `TC_ID`, unique email/product marker, default fixture values and matching iteration-data values | Prepare each partition deterministically and map applicable `data_id` rows | Every primary item has a `prerequest` event in the collection; data mapping is also documented in [`postman/collection-design.md`](../postman/collection-design.md) |
| Test scripts | Assert expected status, JSON content type, exact schema, business calculation/message, sensitive-field absence and observable side effects | Compare real responses with audited specification expectations without changing the oracle | Every primary request has a test event; Newman totals and assertion failures appear in the CLI/JSON/HTML reports; workbook rows contain actual assertion outcomes |
| Data-driven execution | Newman used `-d register-data.json`, `-d coupon-data.json` and `-d product-data.json`; each file supplied three iterations | Exercise mapped valid/boundary/auth partitions from repeatable external data | Exact commands in [`reports/newman/postman-run-summary.md`](newman/postman-run-summary.md); each CLI header records `DATA_FILE`; Newman JSON stats report three iterations per API |
| Newman CLI | Newman 6.2.1 ran Setup + one API folder + Teardown after a clean backend reset for each API | Execute the exported collection reproducibly outside the Postman GUI | [`register-run.cli.txt`](newman/register-run.cli.txt), [`coupon-run.cli.txt`](newman/coupon-run.cli.txt), [`product-run.cli.txt`](newman/product-run.cli.txt), HTML reports and reset logs |
| Newman reporters | Used `cli`, `json` and `htmlextra`; HTML was generated with `--reporter-htmlextra-skipSensitiveData` | Preserve human-readable terminal evidence, machine-readable processing data and reviewable HTML dashboards without exposing headers/bodies publicly | Public `*-run.cli.txt` and `*-run.html` files under [`reports/newman/`](newman/); machine JSON containing resolved runtime auth data is retained only under Git-ignored `.tools/newman-results/` |
| Postman Console | Displayed collection-script evidence and actual network request | Visually confirm resolved URL, timestamp and student header during a real manual send | Student screenshot and [`evidence/postman/README.md`](../evidence/postman/README.md) |
| Environment export | Exported a sanitized example while keeping the runnable local file Git-ignored | Make the submission importable without publishing credentials or tokens | Public example environment, `.gitignore` rule for `23127334_HW06_Local.postman_environment.json`, and CLI setup results proving the local environment was usable |
| Collection export | Exported valid Postman Collection v2.1 JSON | Allow import into Postman and execution through Newman | Collection JSON parses successfully; its schema URL is `https://schema.getpostman.com/json/collection/v2.1.0/collection.json` |

## Not counted as used

### Postman GUI Collection Runner

No retained screenshot or Postman GUI run result demonstrates that the Collection Runner UI was used. The equivalent folder/data executions were performed through Newman CLI, so Collection Runner is not counted as an actually used feature in this report.

## Traceability notes

- The manual Postman screenshot proves one real GUI request and Console use; it does not prove that all collection folders were executed in the GUI.
- Newman CLI reports are the authoritative evidence for automated folder/data execution.
- HTML files are direct reporter output. They were generated with sensitive data omitted by reporter configuration and were not manually edited.
- Actual statuses/bodies and evidence references were propagated to `testcases/23127334_HW06_API_TestCases.xlsx` after the final data-driven runs.
