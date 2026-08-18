# One-API demonstration

This demo uses exactly one API operation. Do not add another endpoint or supporting API call.

## Input specification

```markdown
# Apply coupon

- Requirement: FR-CPN-01
- Method: POST
- Path: /api/coupons/apply
- Header: X-Student-Id is required and must equal 23127334.
- Authentication: bearer token is required.
- Request JSON: { "code": string, "amount": number }
- Constraint: amount must be greater than or equal to 100.
- Rule: code SAVE10 applies a 10 percent discount.
- Success: HTTP 200 with { "discount": number, "finalAmount": number }.
- Calculation: discount = amount * 10 / 100; finalAmount = amount - discount.
- Missing authentication: HTTP 401.
- Invalid amount: HTTP 400.
```

## Demonstration sequence

1. Save the text above as the sole demo specification input.
2. Extract one contract operation: `POST /api/coupons/apply`.
3. Generate candidates using multiple techniques for that operation only:
   - Valid happy path with `amount = 200`, expecting discount `20` and final amount `180`.
   - Inclusive lower boundary with `amount = 100`, expecting HTTP 200.
   - Just-below boundary with `amount = 99.99`, expecting HTTP 400.
   - Missing bearer token, expecting HTTP 401.
   - Schema and exact percent-calculation assertions on successful responses.
4. Deduplicate any overlap between happy-path, schema, and calculation candidates while preserving all technique labels and coverage mappings.
5. Show the coverage report for FR-CPN-01, the `>= 100` boundary, authentication, success/error statuses, response schema, and percent calculation.
6. Produce the review package with status `awaiting_human_review` and stop.
7. Ask the person recording the demo to inspect the cases and enter their own decision, name, timezone-aware timestamp, and rationale.
8. Run `scripts/validate_gate.py` against the bundle. Before approval it must print `EXPORT_BLOCKED`; after a valid human approval and complete coverage it must print `EXPORT_ALLOWED`.
9. Only after `EXPORT_ALLOWED`, demonstrate the Excel/Postman-ready export and sanitized audit records.

The skill must never enter the reviewer's identity or approval decision. The person demonstrating the skill performs that action on screen.
