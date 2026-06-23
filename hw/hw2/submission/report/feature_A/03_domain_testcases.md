# 03 — Domain Test Cases: feature_A (FR-02 — Login & Account Lockout)

> **Scope:** Sinh domain test case từ equivalence classes ở `02_domain_table.md`. Áp dụng one-at-a-time cho invalid classes.

---

## Test Case Matrix

Nguyên tắc **one-at-a-time**: mỗi TC test 1 biến invalid, giữ các biến khác valid (default).

**Default values (valid):**
- Email: `test@eshop.com`
- Password: `Test1234!`
- `login_attempts`: `0`
- `locked_until`: `NULL`

---

## Domain Test Cases

| Test Case ID | Field | EC ID | Type | Input Value | Expected Result |
| --- | --- | --- | --- | --- | --- |
| **DT-A-001** | email | EC-E-V1 | Positive | Email: `test@eshop.com`, Password: `Test1234!`, Counter: 0, Locked: NULL | `200 OK`, JWT returned, counter reset to 0, redirect to Home |
| **DT-A-002** | email | EC-E-V2 | Positive | Email: `admin@eshop.com`, Password: `Admin123!`, Counter: 0, Locked: NULL | `200 OK`, JWT returned, admin role in token |
| **DT-A-003** | email | EC-E-I1 | Negative | Email: `testeshop.com` (no @), Password: `Test1234!` | `401 "Invalid email or password"`, counter NOT incremented |
| **DT-A-004** | email | EC-E-I2 | Negative | Email: `test@` (no domain), Password: `Test1234!` | `401`, counter NOT incremented |
| **DT-A-005** | email | EC-E-I4 | Negative | Email: *(empty)*, Password: `Test1234!` | HTML5 form blocks submit; if bypassed → `401`, counter NOT incremented |
| **DT-A-006** | email | EC-E-I6 | Negative | Email: ` test@eshop.com ` (whitespace), Password: `Test1234!` | `401 "Invalid email or password"`, counter NOT incremented (exact match fails) |
| **DT-A-007** | email | EC-E-I7 | Negative | Email: `unknown@eshop.com` (not in DB), Password: `Test1234!` | `401`, counter NOT incremented (user lookup returns null) |
| **DT-A-008** | email | EC-E-I8 | Negative | Email: `Test@eshop.com` (case mismatch), Password: `Test1234!` | `401`, counter NOT incremented (case-sensitive lookup) |
| **DT-A-009** | password | EC-P-V1 | Positive | Email: `test@eshop.com`, Password: `Test1234!` (exact match) | `200 OK`, JWT returned |
| **DT-A-010** | password | EC-P-I1 | Negative | Email: `test@eshop.com`, Password: `WrongPass!` (completely different) | `401`, counter increments 0 → 2 |
| **DT-A-011** | password | EC-P-I2 | Negative | Email: `test@eshop.com`, Password: `test1234!` (case mismatch) | `401 "Invalid email or password"`, counter → 2 |
| **DT-A-012** | password | EC-P-I3 | Negative | Email: `test@eshop.com`, Password: `Test1234! ` (trailing space) | `401`, counter → 2 (no trim) |
| **DT-A-013** | password | EC-P-I4 | Negative | Email: `test@eshop.com`, Password: *(empty)* | HTML5 blocks or `401`, counter → 2 |
| **DT-A-014** | state | EC-LA-V1 | Positive | Email: `test@eshop.com`, Password: `Test1234!`, Counter: 0, Locked: NULL | `200 OK`, JWT, counter remains 0 |
| **DT-A-015** | state | EC-LA-V2 | Positive | Email: `test@eshop.com`, Password: `Test1234!`, Counter: 2, Locked: NULL | `200 OK`, JWT, counter reset to 0 |
| **DT-A-016** | state | EC-LA-I1 | Negative | Email: `test@eshop.com`, Password: `Test1234!`, Counter: 4, Locked: NULL | `200 OK`, counter reset to 0, account unlocked |
| **DT-A-017** | state | EC-LU-V1 | Positive | Email: `test@eshop.com`, Password: `Test1234!`, Counter: 0, Locked: NULL | `200 OK`, JWT returned |
| **DT-A-018** | state | EC-LU-V2 | Positive | Email: `test@eshop.com`, Password: `Test1234!`, Counter: 4, Locked: `2020-01-01` (expired) | `200 OK`, JWT, counter reset, lock cleared |
| **DT-A-019** | state | EC-LU-I1 | Negative | Email: `test@eshop.com`, Password: `Test1234!` (correct), Counter: 4, Locked: future | `403 "Tài khoản đã bị khóa"`, even with correct password |
| **DT-A-020** | state | EC-LU-I1 | Negative | Email: `test@eshop.com`, Password: `WrongPass!`, Counter: 4, Locked: future | `403` (lock takes priority over password check) |
| **DT-A-021** | state (combined) | EC-LA-V1 + EC-P-I1 | Negative | Email: `test@eshop.com`, Password: `WrongPass!`, Counter: 0, Locked: NULL | `401`, counter → 2 (first failure) |
| **DT-A-022** | state (combined) | EC-LA-V2 + EC-P-I1 | Negative | Email: `test@eshop.com`, Password: `WrongPass!`, Counter: 2, Locked: NULL | `401`, counter → 4, account LOCKED with 180s expiry |

---

## EC Coverage Summary

| EC ID | Covered by TC | Status | Notes |
| --- | --- | --- | --- |
| EC-E-V1 | DT-A-001 | ✓ | Happy path |
| EC-E-V2 | DT-A-002 | ✓ | Admin login |
| EC-E-I1 | DT-A-003 | ✓ | Format invalid (no @) |
| EC-E-I2 | DT-A-004 | ✓ | Format invalid (no domain) |
| EC-E-I4 | DT-A-005 | ✓ | Empty email |
| EC-E-I6 | DT-A-006 | ✓ | Whitespace |
| EC-E-I7 | DT-A-007 | ✓ | Not in DB |
| EC-E-I8 | DT-A-008 | ✓ | Case mismatch |
| EC-P-V1 | DT-A-009 | ✓ | Correct password |
| EC-P-I1 | DT-A-010 | ✓ | Wrong password |
| EC-P-I2 | DT-A-011 | ✓ | Case mismatch |
| EC-P-I3 | DT-A-012 | ✓ | Whitespace |
| EC-P-I4 | DT-A-013 | ✓ | Empty password |
| EC-LA-V1 | DT-A-014 | ✓ | Counter = 0 |
| EC-LA-V2 | DT-A-015 | ✓ | Counter = 2 (approaching threshold) |
| EC-LA-I1 | DT-A-016 | ✓ | Counter >= 3 (crossed threshold) |
| EC-LU-V1 | DT-A-017 | ✓ | No lock |
| EC-LU-V2 | DT-A-018 | ✓ | Lock expired |
| EC-LU-I1 | DT-A-019, DT-A-020 | ✓ | Currently locked (priority) |

**Coverage:** 19/21 EC phủ. Missing: EC-E-I3 (no local part), EC-E-I5 (quá dài).


