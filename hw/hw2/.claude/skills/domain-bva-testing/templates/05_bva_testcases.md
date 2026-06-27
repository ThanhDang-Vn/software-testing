# 05 — BVA Test Cases: feature_{{X}} ({{FR-ID}})

> **Scope:** Convert boundaries into concrete test cases.

---

## Test Cases

**Defaults:** {{list default values for each field}}

### {{Category}} ({{N}} TC)

| TC ID | Boundary | Input | Expected |
| --- | --- | --- | --- |
| BVA-{{X}}-001 | Min | {{input}} | {{expected}} |
| BVA-{{X}}-002 | Min+1 | {{input}} | {{expected}} |
| BVA-{{X}}-003 | Nominal | {{input}} | {{expected}} |
| BVA-{{X}}-004 | Max-1 | {{input}} | {{expected}} |
| BVA-{{X}}-005 | Max | {{input}} | {{expected}} |
| BVA-{{X}}-006 | Max+1 | {{input}} | {{expected}} |

### Supplementary (non-BVA)

| TC ID | Category | Input | Expected |
| --- | --- | --- | --- |
| BVA-{{X}}-007 | {{categorical}} | {{input}} | {{expected}} |

---

## Summary

| Category | Count | TC Range |
| --- | --- | --- |
| {{dimension}} | {{N}} | BVA-{{X}}-001 → BVA-{{X}}-NNN |
| **Total** | **{{N}}** | |
