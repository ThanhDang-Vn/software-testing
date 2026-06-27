# Prompt 1:  

You are a software testing analyst. Your task is to perform ONLY SPECIFICATION ANALYSIS for the given feature. DO NOT generate any test cases.

## CONTEXT

I selected 4 features from different pools:

- Pool A: FR-02 Login and account lockout
- Pool B: FR-11 Order history view (user)
- Pool C: FR-14 Category management (CRUD)
- Pool D: D5 Mobile – Shopping cart

Now start with feature_A.

## STRICT RULES

* DO NOT generate test cases
* DO NOT perform Boundary Value Analysis yet
* Focus ONLY on requirement/specification analysis
* Use structured Markdown tables (no free-text dump)
* Clearly distinguish:

  * Constraints from specification
  * Constraints inferred from source code (if needed)

## TASKS

### 1. Functional Description

* Describe what the feature does
* Main business flow (step-by-step)

### 2. Input Field Analysis

List ALL input fields in a table:

| Field Name | Data Type | Required | Validation Rules | Valid Domain | Invalid Domain | Source (Spec/Code) |

For each field, include:

* Data type (string, int, email, etc.)
* Required / Optional
* Length constraints (min/max)
* Format (regex if applicable)
* Allowed characters
* Business rules (e.g., unique email)
* Explicit VALID and INVALID domains

### 3. Field Dependencies

* Identify relationships between fields
* Use table:

| Field A | Field B | Dependency Type | Condition | Description |

Examples:

* password vs confirm password
* coupon code vs expiration date


## OUTPUT FORMAT

* Use Markdown
* Clear section headings:

  * 1. Functional Description
  * 2. Input Fields
  * 3. Dependencies
* Tables are mandatory where applicable

## OUTPUT FILE

Write the result as content for:
report/feature_A/01_spec_analysis.md
