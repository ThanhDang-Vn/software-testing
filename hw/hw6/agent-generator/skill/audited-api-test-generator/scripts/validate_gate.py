#!/usr/bin/env python3
"""Deterministically validate coverage and human approval before export."""

from __future__ import annotations

import datetime as dt
import hashlib
import json
import re
import sys
from pathlib import Path
from typing import Any


SHA256_RE = re.compile(r"^[0-9a-f]{64}$")
SECRET_KEY_RE = re.compile(r"password|secret|authorization|token|cookie", re.I)
ALLOWED_REVIEW_STATUSES = {"awaiting_human_review", "approved", "rejected", "deferred"}


def load_bundle(path: Path) -> dict[str, Any]:
    raw = path.read_bytes()
    data = json.loads(raw.decode("utf-8"))
    if not isinstance(data, dict):
        raise ValueError("Bundle root must be a JSON object")
    return data


def is_timezone_aware_iso8601(value: str) -> bool:
    try:
        parsed = dt.datetime.fromisoformat(value.replace("Z", "+00:00"))
    except (TypeError, ValueError):
        return False
    return parsed.tzinfo is not None and parsed.utcoffset() is not None


def find_secret_fields(value: Any, location: str = "$") -> list[str]:
    findings: list[str] = []
    if isinstance(value, dict):
        for key, child in value.items():
            child_location = f"{location}.{key}"
            if SECRET_KEY_RE.search(str(key)) and child not in (None, "", "<runtime-secret>"):
                findings.append(child_location)
            findings.extend(find_secret_fields(child, child_location))
    elif isinstance(value, list):
        for index, child in enumerate(value):
            findings.extend(find_secret_fields(child, f"{location}[{index}]"))
    return findings


def validate(bundle: dict[str, Any]) -> list[str]:
    errors: list[str] = []
    if bundle.get("schema_version") != "1.0":
        errors.append("schema_version must equal 1.0")

    source = bundle.get("source", {})
    if not source.get("path"):
        errors.append("source.path is required")
    if not SHA256_RE.fullmatch(str(source.get("sha256", ""))):
        errors.append("source.sha256 must be 64 lowercase hexadecimal characters")

    operations = bundle.get("contract", {}).get("operations", [])
    if not isinstance(operations, list) or len(operations) != 1:
        errors.append("demo bundle must contain exactly one API operation")

    cases = bundle.get("test_cases", [])
    if not isinstance(cases, list) or not cases:
        errors.append("at least one test case is required")
        cases = []
    tc_ids = [case.get("tc_id") for case in cases if isinstance(case, dict)]
    if any(not tc_id for tc_id in tc_ids):
        errors.append("every test case requires tc_id")
    if len(tc_ids) != len(set(tc_ids)):
        errors.append("duplicate tc_id values are not allowed")
    for case in cases:
        if not isinstance(case, dict):
            errors.append("each test case must be an object")
            continue
        for field in ("contract_ids", "source_refs", "covered_targets"):
            if not case.get(field):
                errors.append(f"{case.get('tc_id', '<unknown>')} requires {field}")
        if case.get("expected_status") is None:
            errors.append(f"{case.get('tc_id', '<unknown>')} requires expected_status")

    for gap in bundle.get("spec_gaps", []):
        if gap.get("blocking") and gap.get("status") != "resolved":
            errors.append(f"blocking gap {gap.get('gap_id', '<unknown>')} is unresolved")
        if gap.get("blocking") and not gap.get("reviewer"):
            errors.append(f"blocking gap {gap.get('gap_id', '<unknown>')} lacks human reviewer")

    coverage = bundle.get("coverage", {})
    required = set(coverage.get("required_targets", []))
    covered = set(coverage.get("covered_targets", []))
    uncovered = sorted(required - covered)
    if uncovered:
        errors.append("uncovered targets: " + ", ".join(uncovered))

    review = bundle.get("review", {})
    status = review.get("status")
    if status not in ALLOWED_REVIEW_STATUSES:
        errors.append("review.status is invalid")
    if status != "approved":
        errors.append("human review status is not approved")
    if not str(review.get("reviewer", "")).strip():
        errors.append("human reviewer identity is required")
    if not is_timezone_aware_iso8601(review.get("timestamp", "")):
        errors.append("human review timestamp must be timezone-aware ISO-8601")
    if not str(review.get("rationale", "")).strip():
        errors.append("human review rationale is required")

    secret_fields = find_secret_fields(bundle)
    if secret_fields:
        errors.append("non-empty secret-like fields: " + ", ".join(secret_fields))
    return errors


def main() -> int:
    if len(sys.argv) != 2:
        print("Usage: validate_gate.py <canonical-bundle.json>", file=sys.stderr)
        return 2
    path = Path(sys.argv[1]).resolve()
    try:
        bundle = load_bundle(path)
        errors = validate(bundle)
    except (OSError, UnicodeError, json.JSONDecodeError, ValueError) as error:
        print(f"EXPORT_BLOCKED: {error}")
        return 1

    digest = hashlib.sha256(path.read_bytes()).hexdigest()
    if errors:
        print("EXPORT_BLOCKED")
        for error in errors:
            print(f"- {error}")
        print(f"bundle_sha256={digest}")
        return 1

    print("EXPORT_ALLOWED")
    print(f"bundle_sha256={digest}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
