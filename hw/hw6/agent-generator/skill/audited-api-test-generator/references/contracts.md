# Canonical bundle and gate contract

## Canonical bundle

Use JSON with these top-level fields:

```json
{
  "schema_version": "1.0",
  "source": {
    "path": "api_specification.md",
    "sha256": "64 lowercase hexadecimal characters"
  },
  "contract": {
    "operations": []
  },
  "spec_gaps": [],
  "test_cases": [],
  "coverage": {
    "required_targets": [],
    "covered_targets": []
  },
  "review": {
    "status": "awaiting_human_review",
    "reviewer": "",
    "timestamp": "",
    "rationale": ""
  },
  "audit": []
}
```

Each operation requires a stable `contract_id`, HTTP `method`, `path`, source references, and declared expectations. Each test case requires:

- `tc_id`, `title`, `techniques`, `contract_ids`, and `source_refs`.
- Preconditions, request, expected status, assertions, cleanup, and covered target IDs.
- `generation_origin` set to `deterministic`, `llm_proposed`, or `human_edited`.
- No secrets or resolved Authorization values.

Each specification gap requires `gap_id`, description, affected contract IDs, blocking flag, status, and source references. A blocking gap is resolved only when a human records a resolution and reviewer identity.

## Coverage gate

Before human review, require all configured targets to be covered and no orphan case to remain. At minimum enumerate:

- Every operation and explicit functional/security requirement.
- Declared request constraints and supported response schemas/statuses.
- Required inclusive/exclusive boundaries.
- Applicable authentication, role, ownership, and state-transition rules.

The deterministic gate fails when:

- Any required target is uncovered.
- A case lacks a valid contract/source mapping.
- Duplicate TC_ID values exist.
- Any blocking gap is unresolved.
- Any expected result lacks specification support.
- Secret scanning detects credential material.

## Human-review gate

Export is allowed only if all conditions hold:

```text
review.status = "approved"
review.reviewer is non-empty
review.timestamp is a valid timezone-aware ISO-8601 timestamp
review.rationale is non-empty
all blocking gaps are resolved by a named human
coverage.required_targets is a subset of coverage.covered_targets
at least one valid test case exists
```

The agent must not populate approval fields on behalf of the reviewer. Rejection, deferral, missing fields, invalid timestamps, or an uncovered target blocks export.

## Audit events

Record event ID, correlation ID, UTC timestamp, stage, actor type, action, input/output hashes, validation outcome, and sanitized metadata. For LLM calls also record model/version and prompt-template hash. For human actions record only the supplied reviewer identity, decision, rationale, and timestamp. Never fabricate a GitHub, YouTube, run, artifact, reviewer, or evidence URL.

## Export contract

After approval, create:

- Excel-ready rows with TC_ID, related requirement/security IDs, preconditions, steps, request, expected result, test data, cleanup, technique, source references, and review state.
- Postman collection folders/requests/scripts preserving TC_ID and traceability.
- Secret-free environment template and non-secret iteration data.
- Traceability matrix and export manifest with SHA-256 hashes.
- Sanitized audit log.

Validate JSON/script syntax, TC_ID consistency, request headers required by the specification, output hashes, and absence of secrets before reporting success.
