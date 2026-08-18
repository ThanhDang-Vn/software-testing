# HW06 API CI/CD Pipeline Configuration

## Workflow

Pipeline file: [`.github/workflows/hw06-api-tests.yml`](../../../../.github/workflows/hw06-api-tests.yml)

The workflow runs on relevant pushes, pull requests, and manual `workflow_dispatch`. It uses a read-only repository token and cancels an older run for the same branch/ref when a newer commit arrives.

## Pipeline stages

1. **Checkout and Node setup**
   - Checks out the repository without recursively initializing every gitlink.
   - Initializes only `hw/eshop-sut` from the committed `.gitmodules` URL. This path-scoped command is intentional: the parent repository also contains a legacy gitlink at `hw/hw2/group05_eshop` with no `.gitmodules` URL, so a recursive all-submodule checkout fails before tests start.
   - Installs Node.js `20.20.2` and enables the npm cache using the backend lockfile.
   - Uses current official action runtimes (`checkout`, `setup-node`, and `upload-artifact` v6) so the actions themselves do not depend on the deprecated Node 20 action runtime. The SUT test process still uses the explicitly selected Node.js `20.20.2` toolchain.

2. **Install EShop and Newman**
   - Runs `npm ci` in `hw/eshop-sut/backend`; the committed lockfile controls backend dependency versions.
   - Installs Newman `6.2.1` and `newman-reporter-htmlextra` `1.23.1` under `RUNNER_TEMP`. CI does not modify the repository package manifest.

3. **Generate runtime-only credentials**
   - Generates separate user/admin passwords using OpenSSL during the job.
   - Masks both values with GitHub Actions `add-mask` and exposes them only through job environment variables.
   - Builds a temporary Postman environment under `RUNNER_TEMP`; it is never committed or uploaded.
   - Tokens start blank and are obtained by collection setup/login requests at runtime.
   - If the pipeline is later changed to use stable credentials, they must be stored as GitHub Secrets, not placed in YAML, the collection, reports, or repository files.

4. **Enforce `X-Student-Id`**
   - A preflight guard checks that the collection-level pre-request script upserts `X-Student-Id` and asserts the exact value `23127334` before every ordinary collection request.
   - It also scans every supporting `pm.sendRequest` call and fails if that request does not explicitly attach `X-Student-Id` from the controlled `studentId` environment value.
   - The pipeline readiness request also sends `X-Student-Id: 23127334`.
   - Therefore setup, primary, verification, teardown, supporting, and readiness HTTP requests all carry the student ID.

5. **Reset, seed, start, and wait for readiness**
   - Each API suite gets a separate backend process and clean database.
   - Starting `server.js` loads `database.js`, which drops, recreates, and seeds SQLite.
   - CI polls `GET /api/products` with the student header for up to 15 seconds and also checks that the backend process remains alive.
   - After readiness, CI replaces the public seed passwords with the generated/masked runtime passwords. This retains seeded identities/roles without publishing CI credentials.

6. **Run the isolated expected-working gate**
   - Register, Coupon, and Product each contribute one independently audited path that the current SUT is expected to satisfy: `REG-AI-001`, fixed-discount `CPN-AI-017`, and admin happy-path `PRD-AI-001`.
   - Every invocation selects `00 Setup`, exactly one TC item, and `99 Verification-Teardown`, using the single deterministic `postman/data/ci-expected-working.json` row.
   - Resetting before each invocation prevents one API suite's state from contaminating another suite.
   - Request and total execution timeouts prevent a hung SUT from consuming the runner indefinitely.
   - The complete 148-case collection and the defect-revealing tests are retained unchanged for audit/diagnostic runs. Known verified-defect assertions are not weakened; they are simply outside this expected-working merge gate.

7. **Preserve failure semantics and upload evidence**
   - The shell uses `pipefail` and reads `PIPESTATUS[0]`, so piping Newman output through `tee` cannot hide Newman's exit code.
   - All three suites run to produce complete evidence; their results are aggregated. If any Newman assertion fails, the test step and workflow job fail.
   - Artifact upload uses `if: always()`, so CLI logs, JUnit XML, HTML reports, and backend logs remain available even for a failed test run.
   - Upload is skipped unless at least one file exists under the Newman report directory; this avoids a misleading secondary “no files found” artifact error after an earlier checkout/install/shell failure. If Newman produces reports and then fails assertions, those reports and backend logs are still uploaded.
   - HTML uses `--reporter-htmlextra-skipSensitiveData`. The workflow intentionally does not upload the runtime Postman environment or Newman JSON reporter output because those can retain resolved credentials/tokens/Authorization headers.

## Generated artifacts

Artifact name:

```text
hw06-api-reports-<github.run_id>-<github.run_attempt>
```

Uploaded contents:

```text
hw/hw6/reports/cicd/
├── newman/
│   ├── register.cli.txt
│   ├── register.xml
│   ├── register.html
│   ├── coupon.cli.txt
│   ├── coupon.xml
│   ├── coupon.html
│   ├── product.cli.txt
│   ├── product.xml
│   └── product.html
└── sut-logs/
    ├── register-backend.log
    ├── coupon-backend.log
    └── product-backend.log
```

Retention is 14 days. Published bug records and their evidence dispositions are maintained in `bugs/github-issues.md`; CI run and artifact URLs must only be added when a real bug-specific remote run exists.

## Expected result

All expected-working gate assertions must pass. Any selected test, setup, verification, teardown, readiness, or header-guard failure makes the workflow fail. The workflow does not use `continue-on-error`, `--suppress-exit-code`, or an unconditional zero exit.

The known defect-revealing cases documented in `bugs/verified-bugs.md` are intentionally kept for full diagnostic execution and must not be reclassified as passing behavior merely to obtain a green merge gate.

## Local-equivalent execution

The authoritative commands are in the workflow. A local reproduction needs Node.js 20, backend dependencies, Newman/reporters, a sanitized runtime environment populated from local secrets, and the same reset/readiness sequence. Never commit the generated environment, JWTs, or passwords.
