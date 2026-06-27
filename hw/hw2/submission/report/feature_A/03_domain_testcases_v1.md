# 03 — Domain Test Cases: feature_A (FR-02 — Login & Account Lockout)

> **Scope:** Sinh domain test case từ equivalence classes đã xác định ở spec analysis (01). Áp dụng nguyên tắc one-at-a-time cho invalid classes.

---

## 1. Equivalence Classes Summary

Trước khi sinh test case, tổng hợp toàn bộ EC từ `01_spec_analysis.md`:

### Email

| EC ID | Field | Class Description | Type |
| --- | --- | --- | --- |
| EC-E1 | email | Valid format, exists in DB, exact case match | Valid |
| EC-E2 | email | Valid format, exists in DB, case mismatch | Invalid |
| EC-E3 | email | Invalid format — missing `@` | Invalid |
| EC-E4 | email | Invalid format — missing domain | Invalid |
| EC-E5 | email | Empty / null | Invalid |
| EC-E6 | email | Too long (> 255 chars) | Invalid |
| EC-E7 | email | Valid format, contains whitespace (not trimmed) | Invalid |
| EC-E8 | email | Valid format, not in DB | Invalid |

### Password

| EC ID | Field | Class Description | Type |
| --- | --- | --- | --- |
| EC-P1 | password | Exact match with stored password | Valid |
| EC-P2 | password | Case mismatch (e.g., `test1234!` vs `Test1234!`) | Invalid |
| EC-P3 | password | Character difference (missing/extra chars) | Invalid |
| EC-P4 | password | Contains extra whitespace (leading/trailing) | Invalid |
| EC-P5 | password | Empty / null | Invalid |

### Account State (Precondition)

| EC ID | Field | Class Description | Type |
| --- | --- | --- | --- |
| EC-S1 | state | `login_attempts=0`, `locked_until=NULL` — fresh account | Valid |
| EC-S2 | state | `login_attempts>=3`, `locked_until=future` — currently locked | Invalid |
| EC-S3 | state | `login_attempts>=3`, `locked_until=past` — lock expired | Valid |

---

## 2. Domain Test Matrix

Nguyên tắc **one-at-a-time**: khi test 1 biến ở lớp invalid, giữ các biến khác ở giá trị hợp lệ mặc định:
- Email default valid: `test@eshop.com`
- Password default valid: `Test1234!`
- State default valid: `login_attempts=0`, `locked_until=NULL`

| TC | Biến test | EC tested | Email | Password | State (attempts / locked) | Loại |
| --- | --- | --- | --- | --- | --- | --- |
| DT-A-001 | All valid | EC-E1, EC-P1, EC-S1 | `test@eshop.com` | `Test1234!` | 0 / NULL | Positive |
| DT-A-002 | email | EC-E2 | `Test@eshop.com` | `Test1234!` | 0 / NULL | Negative |
| DT-A-003 | email | EC-E3 | `testeshop.com` | `Test1234!` | 0 / NULL | Negative |
| DT-A-004 | email | EC-E4 | `test@` | `Test1234!` | 0 / NULL | Negative |
| DT-A-005 | email | EC-E5 | *(empty)* | `Test1234!` | 0 / NULL | Negative |
| DT-A-006 | email | EC-E6 | `aaa...@test.com` (1000+ chars) | `Test1234!` | 0 / NULL | Negative |
| DT-A-007 | email | EC-E7 | ` test@eshop.com ` | `Test1234!` | 0 / NULL | Negative |
| DT-A-008 | email | EC-E8 | `unknown@eshop.com` | `Test1234!` | 0 / NULL | Negative |
| DT-A-009 | password | EC-P2 | `test@eshop.com` | `test1234!` | 0 / NULL | Negative |
| DT-A-010 | password | EC-P3 | `test@eshop.com` | `Test123!` | 0 / NULL | Negative |
| DT-A-011 | password | EC-P4 | `test@eshop.com` | `Test1234! ` | 0 / NULL | Negative |
| DT-A-012 | password | EC-P5 | `test@eshop.com` | *(empty)* | 0 / NULL | Negative |
| DT-A-013 | state | EC-S2 | `test@eshop.com` | `Test1234!` | 4 / future | Negative |
| DT-A-014 | state | EC-S3 | `test@eshop.com` | `Test1234!` | 4 / past (expired) | Positive |

### Supplementary Test Cases (bổ sung để phủ kỹ hơn)

| TC | Biến test | EC tested | Email | Password | State (attempts / locked) | Loại |
| --- | --- | --- | --- | --- | --- | --- |
| DT-A-015 | state + password | EC-S1 + EC-P3 | `test@eshop.com` | `WrongPass!` | 0 / NULL | Negative |
| DT-A-016 | state + password | EC-S1 + EC-P3 | `test@eshop.com` | `WrongPass!` | 2 / NULL | Negative |
| DT-A-017 | email (admin) | EC-E1 | `admin@eshop.com` | `Admin123!` | 0 / NULL | Positive |
| DT-A-018 | state | EC-S2 | `test@eshop.com` | `WrongPass!` | 4 / future | Negative |

---

## 3. Domain Test Case Details

| Test Case ID | Field | EC ID | Type | Input Value | Expected Result |
| --- | --- | --- | --- | --- | --- |
| **DT-A-001** | All | EC-E1, EC-P1, EC-S1 | Positive | Email: `test@eshop.com`, Password: `Test1234!`, State: attempts=0, unlocked | `200 OK`, JWT token returned, `login_attempts` reset to 0, redirect to Home |
| **DT-A-002** | email | EC-E2 | Negative | Email: `Test@eshop.com`, Password: `Test1234!`, State: attempts=0, unlocked | `401 "Invalid email or password"`, counter NOT incremented (user not found) |
| **DT-A-003** | email | EC-E3 | Negative | Email: `testeshop.com`, Password: `Test1234!`, State: attempts=0, unlocked | `401 "Invalid email or password"`, counter NOT incremented |
| **DT-A-004** | email | EC-E4 | Negative | Email: `test@`, Password: `Test1234!`, State: attempts=0, unlocked | `401 "Invalid email or password"`, counter NOT incremented |
| **DT-A-005** | email | EC-E5 | Negative | Email: *(empty string)*, Password: `Test1234!`, State: attempts=0, unlocked | Form validation blocks submit (HTML5 `required`); if bypassed → `401` |
| **DT-A-006** | email | EC-E6 | Negative | Email: `aaaa...@test.com` (1000+ chars), Password: `Test1234!`, State: attempts=0, unlocked | `401` or `500` (potential DB overflow), counter NOT incremented |
| **DT-A-007** | email | EC-E7 | Negative | Email: ` test@eshop.com ` (spaces), Password: `Test1234!`, State: attempts=0, unlocked | `401 "Invalid email or password"`, counter NOT incremented (exact match fails) |
| **DT-A-008** | email | EC-E8 | Negative | Email: `unknown@eshop.com`, Password: `Test1234!`, State: attempts=0, unlocked | `401 "Invalid email or password"`, counter NOT incremented (email not in DB) |
| **DT-A-009** | password | EC-P2 | Negative | Email: `test@eshop.com`, Password: `test1234!` (lowercase t), State: attempts=0, unlocked | `401 "Invalid email or password"`, `login_attempts` → 2 |
| **DT-A-010** | password | EC-P3 | Negative | Email: `test@eshop.com`, Password: `Test123!` (missing `4`), State: attempts=0, unlocked | `401 "Invalid email or password"`, `login_attempts` → 2 |
| **DT-A-011** | password | EC-P4 | Negative | Email: `test@eshop.com`, Password: `Test1234! ` (trailing space), State: attempts=0, unlocked | `401 "Invalid email or password"`, `login_attempts` → 2 |
| **DT-A-012** | password | EC-P5 | Negative | Email: `test@eshop.com`, Password: *(empty)*, State: attempts=0, unlocked | Form validation blocks (HTML5 `required`); if bypassed → `401`, `login_attempts` → 2 |
| **DT-A-013** | state | EC-S2 | Negative | Email: `test@eshop.com`, Password: `Test1234!` (correct), State: attempts=4, locked_until=future | `403 "Tài khoản đã bị khóa"`, login blocked even with correct password |
| **DT-A-014** | state | EC-S3 | Positive | Email: `test@eshop.com`, Password: `Test1234!`, State: attempts=4, locked_until=past (expired) | `200 OK`, JWT token returned, `login_attempts` reset to 0, `locked_until` cleared |
| **DT-A-015** | state + pw | EC-S1 + EC-P3 | Negative | Email: `test@eshop.com`, Password: `WrongPass!`, State: attempts=0, unlocked | `401`, `login_attempts` 0 → 2 (first failure, approaching threshold) |
| **DT-A-016** | state + pw | EC-S1 + EC-P3 | Negative | Email: `test@eshop.com`, Password: `WrongPass!`, State: attempts=2, unlocked | `401`, `login_attempts` 2 → 4 (crosses threshold ≥ 3), account LOCKED |
| **DT-A-017** | email (admin) | EC-E1 | Positive | Email: `admin@eshop.com`, Password: `Admin123!`, State: attempts=0, unlocked | `200 OK`, JWT token returned with `role: admin` |
| **DT-A-018** | state | EC-S2 | Negative | Email: `test@eshop.com`, Password: `WrongPass!` (wrong), State: attempts=4, locked_until=future | `403 "Tài khoản đã bị khóa"`, counter stays at 4, lock persists |

---

## 4. EC Coverage Mapping

| EC ID | Covered by TC | Notes |
| --- | --- | --- |
| EC-E1 | DT-A-001, DT-A-017 | Happy path (user + admin) |
| EC-E2 | DT-A-002 | Case mismatch → user not found |
| EC-E3 | DT-A-003 | Format invalid (no @) |
| EC-E4 | DT-A-004 | Format invalid (no domain) |
| EC-E5 | DT-A-005 | Empty email |
| EC-E6 | DT-A-006 | Extremely long email |
| EC-E7 | DT-A-007 | Whitespace in email |
| EC-E8 | DT-A-008 | Email not in DB |
| EC-P1 | DT-A-001, DT-A-017 | Correct password |
| EC-P2 | DT-A-009 | Password case mismatch |
| EC-P3 | DT-A-010 | Password char difference |
| EC-P4 | DT-A-011 | Password with whitespace |
| EC-P5 | DT-A-012 | Empty password |
| EC-S1 | DT-A-001, DT-A-015, DT-A-016 | Fresh account / approaching lock |
| EC-S2 | DT-A-013, DT-A-018 | Account currently locked |
| EC-S3 | DT-A-014 | Lock expired |

**Coverage:** 16/16 EC phủ. Mỗi EC có ít nhất 1 test case.
