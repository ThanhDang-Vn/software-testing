---
name: audited-api-test-generator
description: Convert Markdown or OpenAPI API specifications into validated, traceable, deduplicated API test candidates with deterministic coverage checks, constrained LLM-assisted semantic analysis, an audit trail, a mandatory human-review gate, and approved Excel/Postman-ready exports. Use when generating or reviewing API test cases from specifications, checking specification gaps and coverage, preparing auditable test artifacts, or demonstrating a specification-to-test pipeline. Never use it to auto-approve human review.
---

# Audited API Test Generator

Turn an API specification into auditable test candidates. Treat LLM output as untrusted proposals; keep validation, coverage, approval enforcement, and export eligibility deterministic.

## Non-negotiable controls

- Never approve, impersonate, infer, or fabricate a human-review decision.
- Stop before export unless a human supplies `decision: approved`, reviewer identity, timestamp, and rationale.
- Never resolve a blocking specification gap by guessing. Present options and wait for a human resolution.
- Never weaken expected results or coverage thresholds to make the gate pass.
- Never place plaintext secrets, live tokens, Authorization values, or passwords in tests, exports, or audit logs.
- Preserve source citations, generation technique, transformations, reviewer actions, and output hashes.

## Workflow

1. Load the specification and compute its SHA-256 hash.
2. Parse explicit endpoints, methods, schemas, constraints, authentication, authorization, states, and business rules deterministically where structured syntax permits.
3. Use an LLM only for semantic extraction, ambiguity discovery, domain interpretation, or candidate expansion. Require structured output and a source citation for every claim.
4. Validate extracted contract items. Classify missing or conflicting expected behavior as a specification gap.
5. Stop for human resolution when a gap changes the expected status, response, authorization result, calculation, state transition, or security expectation.
6. Generate candidates with multiple techniques: happy path, equivalence partitioning, BVA, required/optional fields, type/format/enum/null, schema, state transition, authentication, authorization/ownership, and stated calculations.
7. Validate every candidate against the extracted contract. Reject uncited expected results and non-observable assertions.
8. Deduplicate exact cases deterministically. An LLM may propose semantic duplicates, but merge only when deterministic comparison confirms no distinct boundary, role, ownership, auth condition, state, status, or side effect.
9. Build traceability and run the deterministic coverage gate described in [contracts.md](references/contracts.md). Perform targeted generation for uncovered items, then re-run validation and deduplication.
10. Create a review package and stop. Ask a human to approve, edit, reject, or defer each exportable case.
11. After receiving a real human decision, save it in the canonical bundle and run:

    ```text
    python scripts/validate_gate.py <canonical-bundle.json>
    ```

12. Export only when the validator returns `EXPORT_ALLOWED`. Produce Excel/Postman-ready data, a secret-free environment template, traceability output, an export manifest, and an append-only sanitized audit log.

## Deterministic and LLM boundary

Deterministic operations:

- File/schema validation, hashes, stable IDs, structured parsing, contract invariants.
- Mechanical BVA and partitions, request/schema checks, exact deduplication.
- Traceability calculations, coverage thresholds, approval validation, secret scans.
- Excel/Postman mapping, output validation, manifest hashes, audit hash chain.

LLM-assisted operations:

- Interpret prose while citing exact source anchors.
- Propose alternative interpretations for gaps without selecting one.
- Suggest semantic domain, state, and security candidates.
- Propose candidate repairs and semantic duplicate classifications.

After every LLM call, validate its JSON shape, citations, contract consistency, and secret safety. Record model ID/version, prompt-template hash, input/output hashes, token usage when available, validation result, and correlation ID. Do not store hidden reasoning.

## Required outputs before review

- Canonical contract and source index.
- Specification-gap register with blocking status.
- Unique test candidates with stable TC_ID values.
- Traceability matrix and deterministic coverage report.
- Duplicate/merge report.
- Sanitized AI audit events.
- Human review package marked `awaiting_human_review`.

## Review and export protocol

Show the reviewer each candidate's request, expected result, technique, risk, source citations, assumptions, gap references, and coverage contribution. Accept only explicit reviewer input. Do not change `awaiting_human_review` to `approved` yourself.

Read [contracts.md](references/contracts.md) before creating the canonical bundle or exports. For the bounded demonstration, read [demo-one-api.md](references/demo-one-api.md). For recording and narration instructions, read [video-guide.md](references/video-guide.md).

Run `scripts/validate_gate.py` before export and again after reviewer edits. If it reports `EXPORT_BLOCKED`, retain the review package and explain the exact blocking reasons; do not export test cases as approved artifacts.
