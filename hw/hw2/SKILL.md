# 🧠 Skill: Decision Table Testing + Optimization + Pairwise Analysis

## 🎯 Objective

Given a specific software function, perform structured test design using:

1. Condition & Action identification
2. Decision Table construction
3. Decision Table reduction
4. Pairwise necessity analysis (only if meaningful)
5. Generate structured outputs:

   * Markdown report
   * Test cases
   * Test design artifacts

---

## 📥 Input

* Function name
* Functional description (or requirement spec)
* Business rules (if available)

---

## 🧩 Step 1 — Identify Conditions & Actions

### 1.1 Conditions (Inputs / States)

* List all relevant input variables, system states, flags
* Each condition must be:

  * Atomic (no combined logic)
  * Clearly defined domain (e.g., valid/invalid, empty/non-empty)

### 1.2 Actions (Outputs / Behaviors)

* List all possible system responses:

  * Success
  * Error messages
  * State changes (lock account, redirect, etc.)

---

## 🧮 Step 2 — Build Full Decision Table

* Construct full combination table:

  * Rows: Conditions
  * Columns: Rules (each combination)

* Use:

  * T = True / Valid
  * F = False / Invalid
  * * = Don't care (only if justified)

* Map each rule → corresponding Action

---

## ✂️ Step 3 — Reduce Decision Table

Apply reduction techniques:

* Merge equivalent rules (same action, different irrelevant conditions)
* Introduce “-” (don’t care) where condition does not affect outcome
* Remove impossible combinations (invalid states)

### Output:

* Reduced decision table
* Explanation for each merge

---

## 🔍 Step 4 — Analyze Pairwise Necessity

For the **reduced table only**:

### 4.1 Check:

* Are there still multiple independent parameters?
* Are interactions between conditions complex?

### 4.2 Decision:

* If combinations are already minimal → ❌ No pairwise needed
* If interaction coverage is insufficient → ✅ Apply pairwise

### 4.3 If Pairwise is needed:

* Generate pairwise combinations based on conditions
* Ensure coverage of all condition pairs
* Map each pairwise case → expected action

---

## 📄 Step 5 — Generate Output Files

### 5.1 Markdown রিপোর্ট (decision_table_testing.md)

Structure:

```md
# Decision Table Testing — <Function Name>

## 1. Conditions & Actions

### Conditions
| ID | Condition | Description |
|----|----------|------------|

### Actions
| ID | Action | Description |
|----|--------|------------|

---

## 2. Full Decision Table
(table)

---

## 3. Reduced Decision Table
(table + explanation)

---

## 4. Pairwise Analysis

- Needed: Yes / No
- Reason:

### Pairwise Table (if applicable)
(table)

---

## 5. Coverage Summary
- Rules before reduction:
- Rules after reduction:
- Pairwise cases (if any):
```

---

### 5.2 Folder Structure

```
/test-design/
  ├── decision_table_testing.md
  ├── conditions_analysis.md
  ├── reduction_notes.md
  └── pairwise_analysis.md (optional)

/test-cases/
  ├── TC_01.md
  ├── TC_02.md
  └── ...
```

---

### 5.3 Test Case Format (each file)

```md
# TC_<ID> — <Short Description>

## Preconditions
-

## Steps
1.
2.

## Test Data
-

## Expected Result
-

## Mapping
- Decision Rule: R#
- Condition Coverage:
```

---

## ⚠️ Rules & Constraints

* DO NOT skip reduction step

* DO NOT apply pairwise blindly

* ONLY apply pairwise if:

  * There are still many interacting parameters
  * Reduced table is not sufficient for coverage

* Prefer:

  * Logical clarity > number of test cases
  * Minimal but complete coverage

---

## ✅ Output Expectations

* Clear traceability:
  Condition → Rule → Test case
* No redundant test cases
* Justified decisions (especially reduction & pairwise)

---

## 🧠 Example Use

Input:

> "Login function with username, password, account status, failed attempts"

Output:

* Decision table (full + reduced)
* Explanation of merges
* Pairwise decision (often NOT needed after reduction)
* Test cases mapped to rules

---

## 🚀 Goal

Produce **high-quality, minimal, and logically complete test design**, not just exhaustive combinations.
