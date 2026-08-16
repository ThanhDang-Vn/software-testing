---
name: playwright-evidence-workflow
description: Review and execute data-driven Playwright feature suites with selector/wait hardening, three-browser evidence, strict report verification, failure classification, and explicit human-review gates. Use for Playwright homework or QA workflows that require traceable JSON/CSV cases, Chromium/Firefox/WebKit reports, run manifests, and evidence-based documentation.
---

# Playwright Evidence Workflow

## Inputs

Require the requirement document, feature IDs, test specs, external JSON/CSV data, Playwright
config, SUT start instructions, Student ID, and evidence/output roots. Treat missing identity,
credentials, services, or rubric interpretation as TODO/BLOCKED; never invent them.

## Workflow

1. Read requirements, policies, existing tests/data/support code, SUT source, and prior evidence.
2. Build a requirement-to-case matrix. Require at least 12 meaningful cases per selected feature
   only when the rubric requires it; do not create duplicate or out-of-scope behavior.
3. Keep case records in JSON/CSV with unique IDs and validate schema with clear errors. Put secrets
   in environment variables. Use synthetic unique data and safe cleanup.
4. Review selectors and waits. Prefer role, label, placeholder, stable text, or test ID. Remove
   positional selectors and fixed UI sleeps. Document any unavoidable business-duration wait.
5. Type-check, verify SUT health, then run each feature serially on Chromium, Firefox, and WebKit.
   Use zero retries during evidence collection.
6. Save an independent HTML and JSON report for every feature/browser run. Include `Run by:
   <StudentID>`, feature, browser, and ISO timestamp. Build the manifest only from actual JSON runs.
7. For every failure, inspect error, trace/screenshot/context, test oracle, requirement and SUT
   source. Assign exactly one: TEST_DEFECT, SUT_DEFECT, ENVIRONMENT, FLAKY, or BLOCKED.
8. Apply only evidence-supported test/config fixes. Rerun the affected case and feature. Repeat
   suspected flaky cases without retries and report every attempt.
9. Run a strict verifier that fails for missing/duplicate matrix entries, reports, metadata, JSON
   results, or inconsistent counts.
10. Update documentation with commands, counts, evidence paths, TODO/BLOCKED items and residual
    risks. Preserve original AI output; record later edits as human-review changes.

## Safety constraints

- Never change SUT behavior to make a test pass.
- Never delete assertions, inflate timeouts, enable retries, copy reports, fabricate results,
  backdate commits, publish issues, upload artifacts, or submit coursework without explicit approval.
- Do not write credentials or real personal data into test data or reports.
- Do not call a failing test a product bug until requirement, test, execution and SUT evidence agree.
- Do not delete cleanup targets until their resolved paths are proven inside the submission root and
  the student approves them.

## Expected output

Produce changed-file and command logs, a 9-row feature/browser table, verified manifest and report
paths, classification/evidence per failure, before/after diff summary, human-review decisions,
TODO/BLOCKED list, and submission readiness status.

## Mandatory human review

Pause for student review before accepting ambiguous requirements, publishing GitHub Issues,
committing, deleting submission files, selecting a self-assessed grade, creating the final ZIP, or
uploading/submitting anything. Mark AI-proposed changes PENDING until explicitly accepted.

