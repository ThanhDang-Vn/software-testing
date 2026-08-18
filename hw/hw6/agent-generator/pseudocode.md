# Pseudocode — AI-driven API Test Generator

## Execution labels

- `[D]`: deterministic code. The same validated input and configuration produce the same result.
- `[LLM]`: constrained LLM call. Output must match a versioned JSON schema and is never trusted without deterministic validation.
- `[H]`: explicit human decision. The pipeline cannot infer or auto-approve this decision.

## Canonical records

```text
SourceRef:
    source_file, section_id, line_or_anchor, source_hash

ContractItem:
    contract_id, endpoint, method, operation_id
    auth_rules, roles, parameters, request_schema
    response_schemas, status_codes, business_rules
    source_refs, confidence, unresolved_gap_ids

SpecGap:
    gap_id, category, description, affected_contract_ids
    conflicting_sources, proposed_interpretations
    risk, blocking, status, resolution, reviewer

TestCandidate:
    candidate_id, technique, title, endpoint, method
    related_requirements, source_refs, gap_refs
    preconditions, initial_state, request
    expected_status, expected_headers, expected_body
    schema_assertions, business_assertions, side_effect_assertions
    cleanup, test_data, risk, tags
    generation_origin, generation_version

ReviewDecision:
    candidate_id, decision, edits, rationale, reviewer, timestamp

AuditEvent:
    correlation_id, timestamp, stage, actor_type
    tool_or_model, model_parameters, prompt_template_hash
    input_hashes, output_hash, decision, rationale
    token_usage, validation_result, error_summary
```

Secrets, plaintext passwords, live tokens and complete Authorization values are excluded from all audit records.

## Main pipeline

```text
PROCEDURE GENERATE_API_TESTS(
    specification_path = "api_specification.md",
    output_directory,
    generation_config,
    reviewer_identity
):
    [D] correlation_id <- CREATE_UUID()
    [D] audit <- INITIALIZE_APPEND_ONLY_AUDIT(correlation_id)
    [D] RECORD_AUDIT(audit, "PIPELINE_STARTED", HASH(generation_config))

    TRY:
        source <- LOAD_AND_VALIDATE_SOURCE(specification_path, audit)
        sections <- PARSE_MARKDOWN_DETERMINISTICALLY(source, audit)
        contract, gaps <- EXTRACT_CONTRACT(sections, audit)

        validation_result <- VALIDATE_CONTRACT(contract, source)
        [D] RECORD_AUDIT(audit, "CONTRACT_VALIDATION", HASH(validation_result))

        IF validation_result.has_structural_errors:
            [D] WRITE_VALIDATION_REPORT(validation_result, output_directory)
            [D] RECORD_AUDIT(audit, "PIPELINE_BLOCKED_INVALID_SPEC")
            RETURN BLOCKED("Input specification is structurally invalid")

        gaps <- MERGE_GAPS(gaps, validation_result.semantic_gaps)
        gap_result <- HANDLE_SPEC_GAPS(gaps, contract, reviewer_identity, audit)

        IF gap_result.has_unresolved_blocking_gaps:
            [D] WRITE_GAP_REPORT(gap_result, output_directory)
            [D] RECORD_AUDIT(audit, "PIPELINE_BLOCKED_SPEC_GAPS")
            RETURN BLOCKED("Blocking specification gaps require human resolution")

        [D] resolved_contract <- APPLY_APPROVED_GAP_RESOLUTIONS(
            contract,
            gap_result.approved_resolutions
        )
        [D] ASSERT_CONTRACT_INVARIANTS(resolved_contract)

        candidates <- GENERATE_WITH_MULTIPLE_TECHNIQUES(
            resolved_contract,
            gap_result.nonblocking_assumptions,
            generation_config,
            audit
        )

        candidates <- VALIDATE_AND_REPAIR_CANDIDATES(
            candidates,
            resolved_contract,
            audit
        )

        unique_candidates, duplicate_report <- DEDUPLICATE(
            candidates,
            resolved_contract,
            audit
        )

        traceability <- BUILD_TRACEABILITY_MATRIX(
            resolved_contract,
            unique_candidates
        )
        coverage_result <- EVALUATE_COVERAGE_GATE(
            resolved_contract,
            unique_candidates,
            traceability,
            generation_config.coverage_policy,
            audit
        )

        WHILE coverage_result.status = "REGENERATE":
            targeted_candidates <- TARGETED_GAP_GENERATION(
                resolved_contract,
                coverage_result.uncovered_targets,
                audit
            )
            targeted_candidates <- VALIDATE_AND_REPAIR_CANDIDATES(
                targeted_candidates,
                resolved_contract,
                audit
            )
            [D] unique_candidates <- DEDUPLICATE(
                unique_candidates + targeted_candidates,
                resolved_contract,
                audit
            ).unique_candidates
            [D] traceability <- BUILD_TRACEABILITY_MATRIX(
                resolved_contract,
                unique_candidates
            )
            coverage_result <- EVALUATE_COVERAGE_GATE(
                resolved_contract,
                unique_candidates,
                traceability,
                generation_config.coverage_policy,
                audit
            )

        IF coverage_result.status = "BLOCKED":
            [D] WRITE_COVERAGE_REPORT(coverage_result, output_directory)
            [D] RECORD_AUDIT(audit, "PIPELINE_BLOCKED_COVERAGE")
            RETURN BLOCKED("Coverage policy not satisfied")

        review_result <- HUMAN_REVIEW_GATE(
            unique_candidates,
            traceability,
            gap_result,
            coverage_result,
            reviewer_identity,
            audit
        )

        IF review_result.status != "APPROVED":
            [D] WRITE_REVIEW_REPORT(review_result, output_directory)
            [D] RECORD_AUDIT(audit, "PIPELINE_NOT_APPROVED")
            RETURN BLOCKED("Human approval is required before export")

        [D] approved_cases <- APPLY_REVIEWER_EDITS_AND_REVALIDATE(
            review_result,
            resolved_contract
        )
        [D] final_traceability <- BUILD_TRACEABILITY_MATRIX(
            resolved_contract,
            approved_cases
        )
        [D] ASSERT_FINAL_COVERAGE_NOT_REDUCED_BELOW_GATE(
            final_traceability,
            generation_config.coverage_policy
        )

        export_result <- EXPORT_APPROVED_CASES(
            approved_cases,
            final_traceability,
            output_directory,
            generation_config.export_policy,
            audit
        )
        [D] VERIFY_EXPORTED_OUTPUTS(export_result, approved_cases)
        [D] FINALIZE_AUDIT(audit, export_result.output_hashes, "SUCCESS")

        RETURN SUCCESS(export_result)

    CATCH error:
        [D] RECORD_SANITIZED_ERROR(audit, error)
        [D] FINALIZE_AUDIT(audit, empty, "FAILED")
        RAISE error
```

## Input loading and validation

```text
FUNCTION LOAD_AND_VALIDATE_SOURCE(path, audit):
    [D] REQUIRE path exists and is a regular file
    [D] REQUIRE extension = ".md"
    [D] REQUIRE file size is within configured limit
    [D] bytes <- READ_BYTES(path)
    [D] REQUIRE bytes are valid UTF-8
    [D] REQUIRE bytes do not contain prohibited binary/control content
    [D] text <- NORMALIZE_LINE_ENDINGS(bytes)
    [D] REQUIRE text is not blank
    [D] source_hash <- SHA256(bytes)
    [D] RECORD_AUDIT(audit, "SOURCE_LOADED", path, source_hash)
    [D] RETURN SourceDocument(path, text, source_hash)

FUNCTION PARSE_MARKDOWN_DETERMINISTICALLY(source, audit):
    [D] ast <- MARKDOWN_PARSER(source.text)
    [D] sections <- INDEX_HEADINGS_TABLES_LISTS_CODE_BLOCKS(ast)
    [D] ASSIGN_STABLE_SOURCE_ANCHORS(sections, source.hash)
    [D] malformed <- FIND_MALFORMED_TABLES_AND_DUPLICATE_IDS(sections)
    [D] IF malformed is not empty: RAISE StructuralSpecError(malformed)
    [D] RECORD_AUDIT(audit, "MARKDOWN_PARSED", HASH(sections))
    [D] RETURN sections
```

## Contract extraction and spec-gap handling

```text
FUNCTION EXTRACT_CONTRACT(sections, audit):
    [D] explicit_contract <- EXTRACT_STRUCTURED_TABLES_AND_CODE_BLOCKS(sections)

    [LLM] inferred_result <- CALL_LLM_WITH_JSON_SCHEMA(
        task = "Extract only API contract and business rules supported by cited text",
        input = REDACT_SECRETS(sections),
        required_output = {
            contract_items[], gaps[], each_claim.source_refs[], confidence
        },
        constraints = {
            no invented endpoint,
            every claim requires SourceRef,
            uncertainty becomes SpecGap,
            temperature = 0 or lowest supported
        }
    )
    [D] RECORD_LLM_AUDIT(audit, inferred_result.metadata)
    [D] VALIDATE_JSON_SCHEMA(inferred_result)
    [D] REJECT_UNCITED_LLM_CLAIMS(inferred_result, sections)
    [D] contract <- MERGE_EXPLICIT_AND_INFERRED_ITEMS(
        explicit_contract,
        inferred_result.contract_items,
        precedence = "explicit source wins"
    )
    [D] gaps <- DETECT_CONFLICTS_MISSING_FIELDS_AND_LOW_CONFIDENCE(
        contract,
        inferred_result.gaps
    )
    [D] RETURN contract, gaps

FUNCTION VALIDATE_CONTRACT(contract, source):
    [D] CHECK every operation has endpoint and HTTP method
    [D] CHECK path parameters appear in the path
    [D] CHECK status codes are valid HTTP status codes
    [D] CHECK schemas have consistent required fields and types
    [D] CHECK min <= max and inclusive/exclusive flags are coherent
    [D] CHECK enum values match declared types
    [D] CHECK auth and role rules do not contradict each other silently
    [D] CHECK every extracted rule has a valid SourceRef into source
    [D] CLASSIFY findings as structural_error, blocking_gap or warning
    [D] RETURN ValidationResult(findings)

FUNCTION HANDLE_SPEC_GAPS(gaps, contract, reviewer, audit):
    FOR EACH gap IN SORT_BY_STABLE_GAP_ID(gaps):
        [D] gap.risk <- SCORE_GAP_RISK_BY_RULES(gap)
        [D] gap.blocking <- IS_EXPECTED_RESULT_AMBIGUOUS(gap)

        [LLM] IF gap.proposed_interpretations is empty:
            proposals <- CALL_LLM_WITH_JSON_SCHEMA(
                task = "Propose interpretations without selecting one",
                input = gap plus cited surrounding text,
                required_output = interpretations with evidence and consequences
            )
            [D] VALIDATE_AND_ATTACH_PROPOSALS(gap, proposals)
            [D] RECORD_LLM_AUDIT(audit, proposals.metadata)

        IF gap.blocking:
            [H] decision <- REQUEST_HUMAN_GAP_RESOLUTION(
                gap.description,
                gap.conflicting_sources,
                gap.proposed_interpretations,
                affected_tests = PREVIEW_IMPACT(gap, contract)
            )
            [D] REQUIRE decision has reviewer, rationale and selected resolution
            [D] gap.status <- decision.status
            [D] gap.resolution <- decision.resolution
            [D] RECORD_AUDIT(audit, "GAP_REVIEWED", HASH(decision))
        ELSE:
            [D] MARK_AS_EXPLICIT_NONBLOCKING_ASSUMPTION(gap)

    [D] RETURN GapResult(gaps)
```

No blocking gap is converted silently into an expected result. A candidate depending on a nonblocking assumption retains `gap_refs` and an assumption tag.

## Multi-technique generation

```text
FUNCTION GENERATE_WITH_MULTIPLE_TECHNIQUES(contract, assumptions, config, audit):
    [D] candidates <- empty list

    FOR EACH operation IN SORT_BY_METHOD_AND_PATH(contract.operations):
        [D] candidates += GENERATE_EXAMPLE_AND_HAPPY_PATH_CASES(operation)
        [D] candidates += GENERATE_REQUIRED_OPTIONAL_FIELD_CASES(operation)
        [D] candidates += GENERATE_EQUIVALENCE_PARTITIONS(operation)
        [D] candidates += GENERATE_BOUNDARY_VALUES(operation)
            # numeric/string/list boundaries: min-1, min, min+1,
            # max-1, max, max+1 where representable
            # honor inclusive/exclusive boundary semantics
        [D] candidates += GENERATE_ENUM_FORMAT_TYPE_NULL_CASES(operation)
        [D] candidates += GENERATE_STATUS_AND_SCHEMA_CASES(operation)
        [D] candidates += GENERATE_AUTHENTICATION_CASES(operation)
            # missing, malformed, expired and valid credential where specified
        [D] candidates += GENERATE_AUTHORIZATION_MATRIX(operation)
            # unauthenticated, wrong role, non-owner, owner, admin
        [D] candidates += GENERATE_STATE_TRANSITION_CASES(operation, contract.state_rules)
        [D] candidates += GENERATE_IDEMPOTENCY_AND_REPEAT_CASES(operation)
            # only if semantics are stated or safely verifiable
        [D] candidates += GENERATE_BUSINESS_CALCULATION_CASES(operation)
            # exact formula examples, zero, rounding and percent/fixed cases

        [LLM] semantic_candidates <- CALL_LLM_WITH_JSON_SCHEMA(
            task = "Generate additional domain/state/security scenarios",
            input = operation plus cited rules plus deterministic coverage summary,
            required_output = TestCandidate[],
            constraints = {
                every expected value cites a contract rule,
                no unsupported expected behavior,
                label technique and uncertainty,
                do not include secrets
            }
        )
        [D] RECORD_LLM_AUDIT(audit, semantic_candidates.metadata)
        [D] candidates += ACCEPT_ONLY_SCHEMA_VALID_CITED_CANDIDATES(
            semantic_candidates,
            contract
        )

    [D] ASSIGN_STABLE_CANDIDATE_IDS(candidates)
    [D] ATTACH_ASSUMPTIONS_AND_PROVENANCE(candidates, assumptions)
    [D] RECORD_AUDIT(audit, "MULTI_TECHNIQUE_GENERATION", HASH(candidates))
    [D] RETURN candidates
```

## Candidate validation and controlled LLM repair

```text
FUNCTION VALIDATE_AND_REPAIR_CANDIDATES(candidates, contract, audit):
    [D] accepted <- empty list

    FOR EACH candidate IN candidates:
        [D] errors <- VALIDATE_CANDIDATE(candidate, contract)
            # endpoint/method exists
            # request fields and types are representable
            # expected status/schema is cited
            # preconditions and cleanup are executable
            # auth case has the intended credential condition
            # assertion is observable and not tautological
            # TC_ID and SourceRef are valid

        IF errors is empty:
            [D] accepted += candidate
            CONTINUE

        IF errors are mechanically repairable:
            [D] repaired <- APPLY_DETERMINISTIC_REPAIR(candidate, errors)
        ELSE:
            [LLM] proposed_repair <- CALL_LLM_WITH_JSON_SCHEMA(
                task = "Repair candidate using only supplied contract evidence",
                input = candidate, errors, relevant contract items,
                required_output = repaired candidate plus change rationale
            )
            [D] RECORD_LLM_AUDIT(audit, proposed_repair.metadata)
            [D] repaired <- proposed_repair.candidate

        [D] remaining_errors <- VALIDATE_CANDIDATE(repaired, contract)
        IF remaining_errors is empty:
            [D] accepted += repaired
        ELSE:
            [D] QUARANTINE(candidate, remaining_errors)
            [D] RECORD_AUDIT(audit, "CANDIDATE_REJECTED", HASH(remaining_errors))

    [D] RETURN accepted
```

## Deduplication

```text
FUNCTION DEDUPLICATE(candidates, contract, audit):
    [D] normalized <- FOR EACH candidate:
        NORMALIZE {
            method, canonical_path, actor_role, auth_condition,
            initial_state, request_partition, boundary_position,
            expected_status, expected_schema_id, expected_state_change
        }

    [D] exact_groups <- GROUP_BY(SHA256(CANONICAL_JSON(normalized)))
    [D] exact_unique <- MERGE_GROUPS_PRESERVING_ALL_PROVENANCE(exact_groups)

    [D] possible_semantic_pairs <- FIND_PAIRS_BY_FIXED_SIMILARITY_RULES(
        exact_unique,
        same operation and compatible expected outcome
    )

    FOR EACH pair IN possible_semantic_pairs:
        [LLM] verdict <- CALL_LLM_WITH_JSON_SCHEMA(
            task = "Classify semantic duplicate; do not merge distinct boundaries, roles or states",
            input = pair plus relevant contract,
            required_output = {duplicate, rationale, differing_dimensions[]}
        )
        [D] RECORD_LLM_AUDIT(audit, verdict.metadata)

        [D] IF verdict.duplicate AND
               DIFFERING_COVERAGE_DIMENSIONS(pair) is empty AND
               EXPECTED_OUTCOMES_EQUAL(pair):
                MERGE pair while preserving techniques, SourceRefs and requirement IDs
            ELSE:
                KEEP both

    [D] ASSIGN_STABLE_TC_IDS_TO_FINAL_UNIQUE_SET()
    [D] RETURN unique_candidates, duplicate_report
```

The LLM may recommend a semantic merge, but deterministic guards prohibit merging cases that differ by boundary position, role, ownership, authentication condition, state transition, expected status or side effect.

## Traceability and coverage gate

```text
FUNCTION BUILD_TRACEABILITY_MATRIX(contract, candidates):
    [D] targets <- ENUMERATE_COVERAGE_TARGETS(contract):
        operations, requirements, security rules, status codes,
        request constraints, response schemas, roles, states, boundaries
    [D] matrix <- MAP each target to candidates citing that target
    [D] orphaned <- candidates with no valid target or SourceRef
    [D] RETURN TraceabilityMatrix(targets, matrix, orphaned)

FUNCTION EVALUATE_COVERAGE_GATE(contract, candidates, matrix, policy, audit):
    [D] metrics <- CALCULATE {
        operation coverage,
        requirement coverage,
        security-rule coverage,
        required-field positive/negative coverage,
        declared boundary coverage,
        response-schema coverage,
        state-transition coverage,
        orphan count,
        unresolved blocking-gap count
    }

    [D] uncovered <- FIND_REQUIRED_TARGETS_BELOW_POLICY(metrics, matrix, policy)
    [D] attempts <- READ_TARGETED_GENERATION_ATTEMPT_COUNT(audit)

    IF uncovered is empty AND matrix.orphaned is empty:
        status <- "PASS"
    ELSE IF attempts < policy.max_targeted_regeneration_attempts AND
            uncovered contains generatable targets:
        status <- "REGENERATE"
    ELSE:
        status <- "BLOCKED"

    [D] RECORD_AUDIT(audit, "COVERAGE_GATE", metrics, status)
    [D] RETURN CoverageResult(status, metrics, uncovered, matrix.orphaned)

FUNCTION TARGETED_GAP_GENERATION(contract, uncovered_targets, audit):
    [D] deterministic <- GENERATE_MISSING_RULE_BASED_CASES(uncovered_targets)

    [LLM] semantic <- CALL_LLM_WITH_JSON_SCHEMA(
        task = "Generate only cases for listed uncovered targets",
        input = uncovered_targets plus cited contract fragments,
        required_output = TestCandidate[],
        constraints = "No unrelated cases and no unsupported expected outcomes"
    )
    [D] RECORD_LLM_AUDIT(audit, semantic.metadata)
    [D] RETURN deterministic + ACCEPT_ONLY_SCHEMA_VALID_CITED_CANDIDATES(semantic)
```

## Human approval

```text
FUNCTION HUMAN_REVIEW_GATE(candidates, traceability, gaps, coverage, reviewer, audit):
    [D] review_package <- BUILD_REVIEW_PACKAGE(
        candidates sorted by risk and TC_ID,
        request and expected result,
        technique labels,
        SourceRefs and requirement links,
        assumptions and resolved gaps,
        duplicate report,
        coverage metrics and uncovered items,
        LLM-origin indicators
    )

    [H] decisions <- PRESENT_AND_COLLECT_DECISIONS(
        reviewer,
        allowed = APPROVE, EDIT, REJECT, DEFER
    )

    [D] REQUIRE reviewer identity and rationale for EDIT, REJECT and DEFER
    [D] REQUIRE every exportable candidate has APPROVE or valid EDIT decision
    [D] REQUIRE no unresolved blocking gap
    [D] REQUIRE reviewer cannot approve malformed or uncited expected results
    [D] RECORD_AUDIT(audit, "HUMAN_REVIEW", HASH(decisions))

    IF any required candidate is deferred OR coverage falls below policy:
        RETURN ReviewResult("NOT_APPROVED", decisions)
    ELSE:
        RETURN ReviewResult("APPROVED", decisions)
```

## Export

```text
FUNCTION EXPORT_APPROVED_CASES(cases, traceability, output_dir, policy, audit):
    [D] REQUIRE output_dir is inside configured workspace
    [D] REQUIRE no duplicate TC_ID
    [D] REQUIRE every case has approved review evidence

    [D] excel_rows <- MAP_TO_EXCEL_COLUMNS(cases):
        TC_ID, title, related FR/SEC, technique, priority,
        preconditions, steps, request, expected result,
        test data, cleanup, SourceRefs, review status

    [D] postman_collection <- MAP_TO_POSTMAN(cases):
        folders, requests, prerequest setup, assertions, teardown,
        X-Student-Id guard, stable TC_ID metadata

    [D] environment_template <- CREATE_SECRET_FREE_ENVIRONMENT_TEMPLATE()
    [D] iteration_data <- CREATE_NON_SECRET_ITERATION_DATA(cases)

    [D] VALIDATE_EXCEL_SCHEMA(excel_rows)
    [D] VALIDATE_POSTMAN_COLLECTION_SCHEMA(postman_collection)
    [D] PARSE_EVERY_GENERATED_SCRIPT(postman_collection)
    [D] ASSERT_ALL_REQUESTS_ENFORCE_STUDENT_HEADER(postman_collection, "23127334")
    [D] SCAN_OUTPUTS_FOR_SECRETS_AND_LIVE_TOKENS()

    [D] ATOMIC_WRITE(output_dir / "test-cases.xlsx", excel_rows)
    [D] ATOMIC_WRITE(output_dir / "api-tests.postman_collection.json", postman_collection)
    [D] ATOMIC_WRITE(output_dir / "api-tests.example.postman_environment.json", environment_template)
    [D] ATOMIC_WRITE(output_dir / "test-data.json", iteration_data)
    [D] ATOMIC_WRITE(output_dir / "traceability.csv", traceability)

    [D] manifest <- CREATE_MANIFEST_WITH_SHA256_AND_COUNTS(all outputs)
    [D] ATOMIC_WRITE(output_dir / "export-manifest.json", manifest)
    [D] RECORD_AUDIT(audit, "EXPORT_COMPLETED", HASH(manifest))
    [D] RETURN ExportResult(paths, hashes, counts)
```

## AI audit

```text
FUNCTION CALL_LLM_WITH_JSON_SCHEMA(task, input, required_output, constraints):
    [D] sanitized_input <- REDACT_SECRETS(input)
    [D] input_hash <- SHA256(CANONICAL_JSON(sanitized_input))
    [D] prompt <- BUILD_VERSIONED_PROMPT(task, constraints)
    [LLM] raw_response, metadata <- MODEL_CALL(
        prompt,
        sanitized_input,
        response_schema = required_output
    )
    [D] VALIDATE_JSON_SCHEMA(raw_response, required_output)
    [D] output_hash <- SHA256(CANONICAL_JSON(raw_response))
    [D] RETURN raw_response plus {
        model_id, model_version, prompt_template_hash,
        input_hash, output_hash, token_usage, correlation_id
    }

FUNCTION RECORD_LLM_AUDIT(audit, metadata):
    [D] REQUIRE metadata contains model ID/version, prompt hash,
        input hash, output hash, timestamp and correlation ID
    [D] REQUIRE metadata contains no secret or live token
    [D] APPEND_IMMUTABLE_EVENT(audit, metadata)

FUNCTION FINALIZE_AUDIT(audit, output_hashes, status):
    [D] APPEND event containing final status, output hashes and event count
    [D] COMPUTE_HASH_CHAIN_OVER_ALL_AUDIT_EVENTS()
    [D] WRITE sanitized audit log and audit manifest
    [D] MARK audit immutable according to storage policy
```

LLM output is advisory until it passes deterministic schema, citation, contract, safety, deduplication and coverage checks. LLM calls cannot approve tests, resolve blocking specification gaps, lower the coverage threshold or authorize export.
