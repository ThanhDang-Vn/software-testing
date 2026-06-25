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
| **BVA-A-001** | Min (empty) | Email: `` (empty) | 0 | HTML5 form chặn `required`, hoặc `401` nếu bypass |
| **BVA-A-002** | Min+1 (minimal) | Email: `a@b` | 3 | `401 "Invalid email..."` (format valid nhưng user không tồn tại) |
| **BVA-A-003** | Nominal | Email: `test@eshop.com`, Password: `Test1234!`, Counter: 0, Locked: NULL | 14 | `200` (happy path, correct password). **Covers nominal/min boundaries cho email length, password length, counter, locked_until** |
| **BVA-A-004** | Max-1 (RFC limit -1) | Email: `aaaa...@aaa...` | 319 | `401` (format valid nhưng không có trong DB) |
| **BVA-A-005** | Max (RFC limit) | Email: `aaaa...@aaa...` | 320 | `401` (format valid nhưng không có trong DB) |
| **BVA-A-006** | Max+1 (overflow) | Email: `aaaa...@aaa...` | 321 | `400` hoặc `401` (có thể bị truncate) |

### Password Length Boundaries

| Test Case ID | Boundary Type | Input Value | Length | Expected Result |
| --- | --- | --- | --- | --- |
| **BVA-A-007** | Min (empty) | Email: `test@eshop.com`, Password: `` | 0 | `401`, counter → 2 |
| **BVA-A-008** | Min+1 | Email: `test@eshop.com`, Password: `a` | 1 | `401`, counter → 2 |
| **BVA-A-009** | Large value | Email: `test@eshop.com`, Password: `aaaa...` | 1000 | `401`, counter → 2 |
| **BVA-A-010** | Max+1 (overflow) | Email: `test@eshop.com`, Password: `aaaa...` | 1001 | `401`, counter → 2 (hoặc `500` nếu buffer overflow) |

### Login Attempts Numeric Boundaries

| Test Case ID | Boundary Type | Precondition | Input | Expected Result |
| --- | --- | --- | --- | --- |
| **BVA-A-011** | Min+1 — correct pw | Counter: 1, Locked: NULL (chỉ đạt qua DB manipulation) | Password: `Test1234!` | `200`, counter reset → 0 |
| **BVA-A-012** | Min+1 — wrong pw | Counter: 1, Locked: NULL (chỉ đạt qua DB manipulation) | Password: `WrongPass!` | `401`, counter 1→3 (exact threshold), **LOCK triggered** |
| **BVA-A-013** | Threshold-1 — correct pw | Counter: 2, Locked: NULL | Password: `Test1234!` | `200`, counter reset → 0 |
| **BVA-A-014** | Threshold-1 — wrong pw | Counter: 2, Locked: NULL | Password: `WrongPass!` | `401`, counter 2→4, **LOCK triggered** |
| **BVA-A-015** | Threshold (SPEC: 3, CODE: không bao giờ đạt) | Counter: 3, Locked: NULL (chỉ đạt qua DB manipulation) | Password: `Test1234!` | `200` (anomaly: code nhảy 0→2→4, giá trị 3 không xuất hiện trong normal flow) |
| **BVA-A-016** | Threshold+1 — re-lock | Counter: 4, Locked: NULL | Password: `WrongPass!` | `401`, counter 4→6, **re-lock triggered** (test counter boundary, không bị lock che mất) |
| **BVA-A-017** | Large value | Counter: 10, Locked: future | — | `403 "Tài khoản đã bị khóa"` |
| **BVA-A-018** | Negative (corruption) | Counter: -1, Locked: NULL (chỉ đạt qua DB manipulation) | Password: `Test1234!` | `200` (invalid state, không xảy ra trong normal flow) |

### Locked_Until Time Boundaries

| Test Case ID | Boundary Type | Locked_Until Value | Expected Result |
| --- | --- | --- | --- |
| **BVA-A-019** | Far past | Locked_until: `1970-01-01T00:00:00` | `200` (lock expired) |
| **BVA-A-020** | Recent past | Locked_until: `2020-01-01T00:00:00` | `200` (lock expired) |
| **BVA-A-021** | Just after expiry (vừa hết hạn) | Locked_until: `now() - 1 second` | `200` (lock expired, `now > locked_until`) |
| **BVA-A-022** | Boundary (now) | Locked_until: `now()` | `403` hoặc `200` (timing-dependent, edge case) |
| **BVA-A-023** | Just before expiry | Locked_until: `now() + 1 second` | `403` (locked, `now < locked_until`) |
| **BVA-A-024** | Far future | Locked_until: `2099-12-31T23:59:59` | `403` (locked) |

### Supplementary Tests (non-BVA)

> Các TC dưới đây test categorical values, không phải boundary values. Đặt ở đây để tiện tham khảo.

| Test Case ID | Category | Input Value | Expected Result |
| --- | --- | --- | --- |
| **BVA-A-025** | Unicode (Vietnamese) | Email: `user@tëst.com` (ký tự ë) | `401` (không có trong DB, hoặc format issue) |
| **BVA-A-026** | Special chars (email) | Email: `user+tag@test.com` (dấu +) | `401` (không có trong DB, format có thể valid) |
| **BVA-A-027** | Special chars (password) | Email: `test@eshop.com`, Password: `Test@#$%^&!` | `401`, counter → 2 (special chars không khớp) |

---

## Coverage Summary

| Boundary Category | BVA Cases | Total |
| --- | --- | --- |
| Email length | BVA-A-001 → BVA-A-006 | 6 |
| Password length | BVA-A-007 → BVA-A-010 | 4 |
| Counter numeric | BVA-A-011 → BVA-A-018 | 8 |
| Locked_until time | BVA-A-019 → BVA-A-024 | 6 |
| Supplementary (non-BVA) | BVA-A-025 → BVA-A-027 | 3 |
| **Total** | | **27 cases** |

---

## Gaps & Assumptions

- **Timing precision:** BVA-A-022 (`now()` boundary) giả định millisecond precision, nhưng thực tế comparison có thể khác.
- **Unicode test:** BVA-A-025 chỉ test ë; nên test thêm ký tự tiếng Việt (à, ă, v.v.) để coverage kỹ hơn.
- **Integration:** Không có TC nào kết hợp 2+ boundaries (vd: max email length + max password length đồng thời).
- **Counter negative:** BVA-A-018 test corruption (counter = -1), nhưng không rõ hệ thống đạt trạng thái này bằng cách nào.
- **Nominal gộp:** BVA-A-003 đại diện cho nominal case của cả 4 field (email, password, counter, locked_until) — giảm trùng lặp.
- **DB manipulation:** BVA-A-011, BVA-A-012, BVA-A-015, BVA-A-018 yêu cầu set counter trực tiếp trong DB vì code không tạo ra các giá trị này trong normal flow.

