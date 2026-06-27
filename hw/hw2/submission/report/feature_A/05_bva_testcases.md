# 05 — Boundary Value Analysis Test Cases: feature_A (FR-02)

> **Scope:** Chuyển các boundary values từ `04_bva_table.md` thành concrete test cases. Mỗi boundary = 1 TC.

---

## BVA Test Cases

**Default values (valid):**
- Email: `test@eshop.com`
- Password: `Test1234!`
- Counter: 0
- Locked: NULL

---

### Email Length Boundaries

| Test Case ID | Boundary Type | Input Value | Length | Expected Result |
| --- | --- | --- | --- | --- |
| **BVA-A-001** | Min (empty) | Email: `` (empty) | 0 | HTML5 form blocks `required`, or `401` if bypassed |
| **BVA-A-002** | Min+1 (minimal) | Email: `a@b` | 3 | `401 "Invalid email..."` (format valid but user not found) |
| **BVA-A-003** | Nominal | Email: `test@eshop.com` | 14 | `200` (happy path, correct password) |
| **BVA-A-004** | Max-1 (RFC limit -1) | Email: `aaaa...@aaa...` | 319 | `401` (format valid but not in DB) |
| **BVA-A-005** | Max (RFC limit) | Email: `aaaa...@aaa...` | 320 | `401` (format valid but not in DB) |
| **BVA-A-006** | Max+1 (overflow) | Email: `aaaa...@aaa...` | 321 | `400` or `401` (potential truncate) |

### Password Length Boundaries

| Test Case ID | Boundary Type | Input Value | Length | Expected Result |
| --- | --- | --- | --- | --- |
| **BVA-A-007** | Min (empty) | Email: `test@eshop.com`, Password: `` | 0 | `401`, counter → 2 |
| **BVA-A-008** | Min+1 | Email: `test@eshop.com`, Password: `a` | 1 | `401`, counter → 2 |
| **BVA-A-009** | Nominal | Email: `test@eshop.com`, Password: `Test1234!` | 9 | `200` (happy path) |
| **BVA-A-010** | Large value | Email: `test@eshop.com`, Password: `aaaa...` | 1000 | `401`, counter → 2 |
| **BVA-A-011** | Max+1 (overflow) | Email: `test@eshop.com`, Password: `aaaa...` | 1001 | `401`, counter → 2 (or `500` if buffer overflow) |

### Login Attempts Numeric Boundaries

| Test Case ID | Boundary Type | Counter Value | Locked | Expected Result |
| --- | --- | --- | --- | --- |
| **BVA-A-012** | Min (0) | Counter: 0, Locked: NULL | No | Correct password → `200` |
| **BVA-A-013** | Min+1 (approaching) | Counter: 1, Locked: NULL | No | Correct password → `200` |
| **BVA-A-014** | Threshold-1 (code: 2) | Counter: 2, Locked: NULL | No | Correct password → `200`, wrong password → lock |
| **BVA-A-015** | Threshold (SPEC: 3, CODE: never reached) | Counter: 3, Locked: NULL | No | Correct password → `200` (anomaly: code jumps 0→2→4) |
| **BVA-A-016** | Threshold+1 (code: 4) | Counter: 4, Locked: future | Yes | `403 "Tài khoản đã bị khóa"` |
| **BVA-A-017** | Large value | Counter: 10, Locked: future | Yes | `403` |
| **BVA-A-018** | Negative (corruption) | Counter: -1, Locked: NULL | No | Correct password → `200` (invalid state, should not occur) |

### Locked_Until Time Boundaries

| Test Case ID | Boundary Type | Locked_Until Value | Expected Result |
| --- | --- | --- | --- |
| **BVA-A-019** | Min (NULL) | Locked_until: NULL | Correct password → `200` |
| **BVA-A-020** | Far past | Locked_until: `1970-01-01T00:00:00` | `200` (lock expired) |
| **BVA-A-021** | Recent past | Locked_until: `2020-01-01T00:00:00` | `200` (lock expired) |
| **BVA-A-022** | Just before expiry | Locked_until: `now() - 1 second` | `403` (technically still locked, `now < locked_until`) |
| **BVA-A-023** | Boundary (now) | Locked_until: `now()` | `403` or `200` (timing-dependent, edge case) |
| **BVA-A-024** | Just after expiry | Locked_until: `now() + 1 second` | `403` (locked, `now < locked_until`) |
| **BVA-A-025** | Far future | Locked_until: `2099-12-31T23:59:59` | `403` (locked) |

### Special Cases (Supplementary)

| Test Case ID | Category | Input Value | Expected Result |
| --- | --- | --- | --- |
| **BVA-A-026** | Unicode (Vietnamese) | Email: `user@tëst.com` (ë char) | `401` (not in DB, or format issue) |
| **BVA-A-027** | Special chars (email) | Email: `user+tag@test.com` (+ sign) | `401` (not in DB, format may be valid) |
| **BVA-A-028** | Special chars (password) | Email: `test@eshop.com`, Password: `Test@#$%^&!` | `401`, counter → 2 (special chars don't match) |

---

## Coverage Summary

| Boundary Category | BVA Cases | Total |
| --- | --- | --- |
| Email length | BVA-A-001 to BVA-A-006 | 6 |
| Password length | BVA-A-007 to BVA-A-011 | 5 |
| Counter numeric | BVA-A-012 to BVA-A-018 | 7 |
| Locked_until time | BVA-A-019 to BVA-A-025 | 7 |
| Special cases | BVA-A-026 to BVA-A-028 | 3 |
| **Total** | | **28 cases** |

---

## Gaps & Assumptions

- **Timing precision:** BVA-A-023 (`now()` boundary) assumes millisecond precision, but actual comparison may vary.
- **Unicode test:** BVA-A-026 only tests ë; should test more Vietnamese characters (à, ă, etc.) for thorough coverage.
- **Integration:** No test combines 2+ boundaries (e.g., max email length + max password length simultaneously).
- **Counter negative:** BVA-A-018 tests corruption (counter = -1), but unclear how system would reach this state.
