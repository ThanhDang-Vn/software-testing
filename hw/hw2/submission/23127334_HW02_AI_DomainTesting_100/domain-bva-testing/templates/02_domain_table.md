# 02 — Domain Table: feature_{{X}} ({{FR-ID}})

> **Scope:** Input fields + Equivalence Classes. KHÔNG BVA, KHÔNG test cases.

---

## Input Fields

| # | Field | Type | Required | Source |
| --- | --- | --- | --- | --- |
| 1 | `{{field}}` | {{type}} | {{Yes/No}} | {{FR-xx}} |

---

## Equivalence Classes

### `{{field_name}}`

| EC ID | Type | Description | Example | Rationale |
| --- | --- | --- | --- | --- |
| EC-{{F}}-V1 | Valid | {{description}} | `{{value}}` | {{why separate}} |
| EC-{{F}}-I1 | Invalid | {{description}} | `{{value}}` | {{why separate}} |

---

## Coverage Summary

| Field | Valid | Invalid | Total |
| --- | --- | --- | --- |
| `{{field}}` | {{V}} | {{I}} | {{V+I}} |
| **Tổng** | **{{N}}** | **{{M}}** | **{{N+M}}** |
