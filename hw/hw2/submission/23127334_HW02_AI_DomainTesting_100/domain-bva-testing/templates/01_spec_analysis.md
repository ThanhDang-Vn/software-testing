# 01 — Specification Analysis: feature_{{X}} ({{FR-ID}} — {{Feature Name}})

> **Scope:** Requirement/specification analysis only. No test cases. No BVA.

---

## 1. Functional Description

**Purpose:** {{1-2 sentences describing business purpose}}

### Main Business Flow

| Step | Actor | Action | System Response |
| --- | --- | --- | --- |
| 1 | {{actor}} | {{action}} | — |
| 2 | {{actor}} | {{action}} | {{response}} |
| 3 | System | {{action}} | {{response}} |
| 4 | Frontend | {{action}} | {{display}} |

### {{Sub-flow name}} (nếu có)

| Condition | Behavior | Expected Result |
| --- | --- | --- |
| {{condition}} | {{action}} | {{result}} |

---

## 2. Key Input Fields & State

### Implicit Inputs (affect behavior, not user-entered)

| Input | Type | Valid | Invalid |
| --- | --- | --- | --- |
| `{{field}}` | {{type}} | {{valid domain}} | {{invalid domain}} |

### State Variables (Server-side)

| Field | Type | Domain | Purpose |
| --- | --- | --- | --- |
| `{{field}}` | {{type}} | {{possible values}} | {{impact on behavior}} |

---

## 3. Critical Constraints (SPEC vs CODE)

| Constraint | SPEC | CODE | Match? |
| --- | --- | --- | --- |
| {{constraint}} | {{spec says}} | {{code does}} | {{✅/❌}} |

---

## 4. Core Dependencies

| Field A | → | Field B | Impact |
| --- | --- | --- | --- |
| `{{field}}` | → | `{{field}}` | {{business logic}} |
