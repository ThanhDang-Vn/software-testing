# 03 — Domain Test Cases: feature_{{X}} ({{FR-ID}})

> **Scope:** Domain test case từ equivalence classes. One-at-a-time cho invalid.

---

## Test Matrix

> Default values: {{list defaults}}

| TC ID | Test Field | EC | Type | Input | Expected |
| --- | --- | --- | --- | --- | --- |
| DT-{{X}}-001 | All valid | {{EC-list}} | Positive | {{inputs}} | {{expected}} |
| DT-{{X}}-002 | {{field}} | {{EC}} | Negative | {{inputs}} | {{expected}} |

---

## EC Coverage

| EC | Covered by | Notes |
| --- | --- | --- |
| EC-{{F}}-V1 | DT-{{X}}-001 | Valid path |
| EC-{{F}}-I1 | DT-{{X}}-002 | Invalid case |

**Total:** {{N}}/{{N}} EC covered
