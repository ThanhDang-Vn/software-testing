# 02 — Domain Testing (Equivalence Partitioning): feature_A (FR-02)

> **Phạm vi:** Phân hoạch miền giá trị của từng biến input thành các lớp tương đương (valid/invalid classes), sau đó sinh test case từ phân hoạch.

---

## Kỹ thuật Domain Testing — tóm tắt

**Mục đích:** Chia không gian đầu vào thành các **lớp tương đương** — mỗi lớp chứa các giá trị có **cùng hành vi** theo quan điểm hệ thống.

**Nguyên tắc:**
- Giá trị cùng lớp → hệ thống phản hồi giống nhau → chỉ cần test **1 đại diện** từ mỗi lớp.
- Ghi rõ: biến **rời rạc** (finite, discrete như email) hay **liên tục** (continuous như số thực); có **thứ tự** (ordered like numbers) hay không (unordered).
- Tách **Valid** (tuân thủ ràng buộc) và **Invalid** (vi phạm ràng buộc).

---

## a - Phân hoạch miền từng biến

### Biến 1: `email`

**Đặc điểm:**
- Kiểu: **Discrete** (danh sách hữu hạn email tồn tại) + **Unordered** (không có thứ tự tự nhiên).
- Nguồn ràng buộc: `[SPEC]` (yêu cầu format email, không trim) + `[CODE]` (so khớp phân biệt hoa/thường, không trim, không validate format ở backend).

**Phân hoạch (Level 1 — Input Domain):**

| **Lớp tương đương** | **Giá trị đại diện** | **Kiểu** | **Lý do phân lớp** |
| --- | --- | --- | --- |
| **Valid — Format email chuẩn** | `test@eshop.com`, `admin@eshop.com` | Valid | RFC-compliant format (có @, domain, local part) |
| **Invalid — Format email sai (thiếu @)** | `testeshop.com` | Invalid | Không có `@` → format invalid |
| **Invalid — Format email sai (thiếu domain)** | `test@` | Invalid | Không đầy đủ domain → format invalid |
| **Invalid — Format email sai (multiple @)** | `test@@eshop.com` | Invalid | Nhiều `@` → format invalid |
| **Invalid — Email chứa unicode** | `tést@eshop.com` | Invalid | Non-ASCII characters → format edge case; backend không validate → pass qua nhưng không match DB |
| **Invalid — Email rỗng** | `` (empty string) | Invalid | Không có dữ liệu → field required violation |
| **Invalid — Email null / undefined** | `null`, `undefined` (field không gửi) | Invalid | `req.body.email` = undefined → `SELECT WHERE email = undefined` → hành vi khác empty string |
| **Invalid — Email quá dài** | `aaa...@test.com` (1000+ chars) | Invalid | SQLite TEXT không có max length → đây là **robustness test**, không phải boundary thật (SPEC/CODE đều không quy định giới hạn) |

**Phân hoạch (Level 2 — Behavioral / System State — cho test case):**

Sau khi định dạng hợp lệ, hệ thống có thêm **behavioral partitions** dựa trên DB + string matching:

| **Behavioral Class** | **Ví dụ** | **Hành vi** | **Ghi chú** |
| --- | --- | --- | --- |
| Email tồn tại, case khớp exact | `test@eshop.com` | Tiếp tục kiểm tra mật khẩu | Happy path |
| Email tồn tại, case NOT match | `Test@eshop.com`, `TEST@ESHOP.COM` | `401` (user not found) | Case-sensitive mismatch (code behavior) |
| Email có whitespace | ` test@eshop.com `, `test @eshop.com` | `401` (user not found) | Exact string match fails |
| Email không tồn tại trong DB | `unknown@eshop.com` | `401`, **không tăng bộ đếm** | Email lạ → khác sai mật khẩu |

**Tóm tắt cho `email`:**

| **Hạng mục** | **Số lớp** | **Đại diện** |
| --- | --- | --- |
| Valid input domain | 1 | Format email chuẩn (`test@eshop.com`) |
| Invalid input domain | 7 | Sai format (3 loại), unicode, rỗng, null, quá dài |
| Behavioral subclasses | 4 | Tồn tại + case match, case mismatch, whitespace, không tồn tại |

---

### Biến 2: `password`

**Đặc điểm:**
- Kiểu: **Discrete** (danh sách hữu hạn mật khẩu hợp lệ trên DB) + **Unordered** (mật khẩu không có thứ tự).
- Nguồn ràng buộc: `[CODE]` (so sánh plaintext exact `user.password === password`, không trim, phân biệt hoa/thường).
- Lưu ý: Phân hoạch **giả định email hợp lệ & tồn tại**. Nếu email lạ → bộ đếm **không tăng**.

**Phân hoạch (Level 1 — Input Domain):**

| **Lớp tương đương** | **Giá trị đại diện** | **Kiểu** | **Lý do phân lớp** |
| --- | --- | --- | --- |
| **Valid — Mật khẩu exact match** | `Test1234!` (cho `test@eshop.com`), `Admin123!` (cho `admin@eshop.com`) | Valid | So khớp chuỗi tuyệt đối ✓ |
| **Invalid — Mật khẩu NOT exact match (bất kỳ sai khác)** | `test1234!` (case sai), `Test123!` (ký tự sai), `Test1234! ` (space), `` (rỗng), sai password từ user khác | Invalid | Tất cả khác exact string → không match |

**Phân hoạch (Level 2 — Behavioral — ghi chú special cases):**

Vì code **case-sensitive** + **không trim**, cần note các special cases:

| **Special Case** | **Ví dụ** | **Hành vi** | **Ý nghĩa** |
| --- | --- | --- | --- |
| Case-sensitive mismatch | `test1234!` (vs `Test1234!`) | Tăng bộ đếm, 401 | Code phân biệt hoa/thường |
| Whitespace-sensitive | `Test1234! ` (space cuối) | Tăng bộ đếm, 401 | Code không trim |
| Rỗng (empty string) | `` | Tăng bộ đếm, 401 | `"" === "Test1234!"` → false |
| Null / undefined | field không gửi | Tăng bộ đếm, 401 | `undefined === "Test1234!"` → false (hành vi khác empty) |
| Very long (1000+ chars) | `aaaa...` (1000+ chars) | Tăng bộ đếm, 401 | Robustness test — `===` so sánh O(n), không overflow |
| Unicode | `Tëst1234!` (ë thay e) | Tăng bộ đếm, 401 | Encoding edge case — `===` so sánh byte-level |

**Tóm tắt cho `password`:**

| **Hạng mục** | **Số lớp** | **Đại diện** |
| --- | --- | --- |
| Valid input domain | 1 | Exact match: `Test1234!` |
| Invalid input domain | 1 | NOT exact match (bao gồm tất cả sai khác) |
| Behavioral notes | 6 | Case-sensitive, whitespace-sensitive, empty, null, very long, unicode |

---

## B - Kết hợp biến & điều kiện phụ thuộc

Luồng login không độc lập — **thứ tự kiểm tra** ảnh hưởng đến test case:

```
1. Email tồn tại (format valid + match DB)?
   ├─ NO  → 401 "Invalid email or password", counter không tăng
   └─ YES → tiếp
       2. Đang khóa? (locked_until trong hiệu lực?)
       ├─ YES → 403 "Tài khoản đã bị khóa"
       └─ NO → tiếp
           3. Mật khẩu đúng?
           ├─ YES → reset counter=0, locked_until=NULL, cấp JWT, 200
           └─ NO → counter += 2, kiểm tra khóa (nếu >= 3 thì set locked), 401
```

**Điều kiện kết hợp trong test design:**

| **#** | **Email** | **Password** | **Trạng thái Counter/Locked** | **HTTP** | **Behavioral** | **Mục đích** |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | Valid + match DB | Valid ✓ | counter=0, unlocked | 200 | Happy path | Reset counter, cấp JWT |
| 2 | Valid + match DB | Valid ✓ | counter=4, locked | 403 | Priority check: khóa trước | Khóa có ưu tiên hơn mật khẩu |
| 3 | Valid + match DB | Invalid ✗ | counter=0, unlocked | 401 | Trigger khóa | counter → 2 (gần ngưỡng) |
| 4 | Valid + match DB | Invalid ✗ | counter=2, unlocked | 401 | Vượt ngưỡng | counter → 4 (vượt), bị khóa |
| 5 | Valid + match DB | Invalid ✗ | counter=3 (set qua DB) | 401 | Boundary ngưỡng | counter → 5 (≥3), bị khóa — test giá trị ngưỡng chính xác |
| 6 | Invalid (format sai) | Any | Any | 401 | Format validation | Email sai format → reject |
| 7 | Valid format, NOT in DB | Any | Any | 401, no increment | Email not found | Không tăng counter (điểm nóng) |
| 8 | Valid format, case mismatch | Any | Any | 401, no increment | Case-sensitive behavior | `Test@` ≠ `test@` |
| 9 | Valid format, has whitespace | Any | Any | 401, no increment | String match failure | ` test@` ≠ `test@` |

> **Ghi chú counter=3:** Code tăng +2 mỗi lần → chuỗi thực tế: 0→2→4→6... Giá trị counter=3 **không xảy ra tự nhiên** (chỉ set qua DB trực tiếp), nhưng là **boundary hợp lệ** vì ngưỡng khóa là `newAttempts >= 3`. Test này kiểm tra logic so sánh tại đúng biên.

---

## BƯỚC 2b — Domain Test Matrix & Test Case Generation

### Domain Test Matrix

Ma trận dưới đây hiển thị từng biến, lớp tương đương, và giá trị đại diện để test. Nguyên tắc **one-at-a-time**: khi test 1 biến ở lớp invalid, các biến khác giữ ở mức valid (by default).

| # | **Biến** | **Lớp** | **Giá trị Đại diện** | **Email** | **Password** | **Counter** | **Locked** | **TC ID** |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | Happy path | Valid + Valid | — | `test@eshop.com` | `Test1234!` | 0 | NULL | DT-A-001 |
| 2 | Email | Format valid, **case mismatch** | `Test@eshop.com` | `Test@eshop.com` | `Test1234!` | 0 | NULL | DT-A-002 |
| 3 | Email | Format **invalid (no @)** | `testeshop.com` | `testeshop.com` | `Test1234!` | 0 | NULL | DT-A-003 |
| 4 | Email | Format **invalid (no domain)** | `test@` | `test@` | `Test1234!` | 0 | NULL | DT-A-004 |
| 5 | Email | **Empty** | `` | `` | `Test1234!` | 0 | NULL | DT-A-005 |
| 6 | Email | **Null / undefined** | (field không gửi) | (missing) | `Test1234!` | 0 | NULL | DT-A-006 |
| 7 | Email | **Too long** (1000+ chars) | `aaaa...@test.com` | `aaaa...@test.com` | `Test1234!` | 0 | NULL | DT-A-007 |
| 8 | Email | **Whitespace** | ` test@eshop.com ` | ` test@eshop.com ` | `Test1234!` | 0 | NULL | DT-A-008 |
| 9 | Email | **Not in DB** | `unknown@eshop.com` | `unknown@eshop.com` | `Test1234!` | 0 | NULL | DT-A-009 |
| 10 | Email | **Multiple @** | `test@@eshop.com` | `test@@eshop.com` | `Test1234!` | 0 | NULL | DT-A-010 |
| 11 | Email | **Unicode** | `tést@eshop.com` | `tést@eshop.com` | `Test1234!` | 0 | NULL | DT-A-011 |
| 12 | Password | **Case mismatch** | `test1234!` | `test@eshop.com` | `test1234!` | 0 | NULL | DT-A-012 |
| 13 | Password | **Char difference** | `Test123!` | `test@eshop.com` | `Test123!` | 0 | NULL | DT-A-013 |
| 14 | Password | **Whitespace** | `Test1234! ` | `test@eshop.com` | `Test1234! ` | 0 | NULL | DT-A-014 |
| 15 | Password | **Empty** | `` | `test@eshop.com` | `` | 0 | NULL | DT-A-015 |
| 16 | Password | **Null / undefined** | (field không gửi) | `test@eshop.com` | (missing) | 0 | NULL | DT-A-016 |
| 17 | Password | **Very long** (1000+ chars) | `aaaa...` | `test@eshop.com` | `aaaa...` (1000+ chars) | 0 | NULL | DT-A-017 |
| 18 | Password | **Unicode** | `Tëst1234!` | `test@eshop.com` | `Tëst1234!` | 0 | NULL | DT-A-018 |
| 19 | State | **Locked (priority)** | — | `test@eshop.com` | `Test1234!` | 4 | 2026-06-22 10:05 | DT-A-019 |
| 20 | State | **Trigger lockout** (attempts 0→2) | — | `test@eshop.com` | `WrongPass123!` | 0 | NULL | DT-A-020 |
| 21 | State | **Cross threshold** (attempts 2→4, locked) | — | `test@eshop.com` | `WrongPass123!` | 2 | NULL | DT-A-021 |
| 22 | State | **Boundary threshold** (counter=3, set qua DB) | — | `test@eshop.com` | `WrongPass123!` | 3 | NULL | DT-A-022 |
| 23 | State | **Lockout expired** | — | `test@eshop.com` | `Test1234!` | 4 | 2020-01-01 (expired) | DT-A-023 |

### Test Case List

| **TC ID** | **Mục tiêu** | **Biến được test** | **Lớp (Valid/Invalid)** | **Input cụ thể** | **Expected Result** | **Loại** | **Ghi chú** |
| --- | --- | --- | --- | --- | --- | --- | --- |
| **DT-A-001** | Happy path — đăng nhập thành công | Email + Password | Valid + Valid | Email: `test@eshop.com`, Password: `Test1234!`, Counter: 0, Locked: NULL | HTTP 200, JWT returned, counter reset to 0 | Positive | Email format valid + match DB + exact password match |
| **DT-A-002** | Email case-sensitive mismatch | Email | Invalid (behavioral) | Email: `Test@eshop.com`, Password: `Test1234!`, Counter: 0, Locked: NULL | HTTP 401 "Invalid email or password", counter NOT incremented | Negative | Email format valid nhưng case ≠ DB (case-sensitive code behavior) |
| **DT-A-003** | Email format invalid (missing @) | Email | Invalid (input domain) | Email: `testeshop.com`, Password: `Test1234!`, Counter: 0, Locked: NULL | HTTP 401 "Invalid email or password", counter NOT incremented | Negative | Backend không validate format → SELECT không tìm thấy → 401 |
| **DT-A-004** | Email format invalid (missing domain) | Email | Invalid (input domain) | Email: `test@`, Password: `Test1234!`, Counter: 0, Locked: NULL | HTTP 401 "Invalid email or password", counter NOT incremented | Negative | Email format không đầy đủ |
| **DT-A-005** | Email empty (required field) | Email | Invalid (input domain) | Email: `` (empty), Password: `Test1234!`, Counter: 0, Locked: NULL | HTTP 401, counter NOT incremented | Negative | Empty string → `SELECT WHERE email = ""` → no match → 401 |
| **DT-A-006** | Email null / undefined (field missing) | Email | Invalid (input domain) | Email: (field không gửi), Password: `Test1234!`, Counter: 0, Locked: NULL | HTTP 401, counter NOT incremented | Negative | `req.body.email` = undefined → `SELECT WHERE email = undefined` → hành vi khác empty string |
| **DT-A-007** | Email too long (robustness) | Email | Invalid (input domain) | Email: `aaa...@test.com` (1000+ chars), Password: `Test1234!`, Counter: 0, Locked: NULL | HTTP 401 (no match in DB) | Negative | Robustness test — SPEC/CODE không quy định max length (SQLite TEXT không giới hạn) |
| **DT-A-008** | Email with whitespace (string mismatch) | Email | Invalid (behavioral) | Email: ` test@eshop.com ` (space), Password: `Test1234!`, Counter: 0, Locked: NULL | HTTP 401 "Invalid email or password", counter NOT incremented | Negative | Code không trim — exact string match fails |
| **DT-A-009** | Email not in DB | Email | Invalid (behavioral) | Email: `unknown@eshop.com`, Password: `Test1234!`, Counter: 0, Locked: NULL | HTTP 401 "Invalid email or password", **counter NOT incremented** (điểm nóng) | Negative | Email không tồn tại → khác sai mật khẩu (không tăng counter) |
| **DT-A-010** | Email format invalid (multiple @) | Email | Invalid (input domain) | Email: `test@@eshop.com`, Password: `Test1234!`, Counter: 0, Locked: NULL | HTTP 401, counter NOT incremented | Negative | Backend không validate → pass qua nhưng không match DB |
| **DT-A-011** | Email with unicode chars | Email | Invalid (input domain) | Email: `tést@eshop.com`, Password: `Test1234!`, Counter: 0, Locked: NULL | HTTP 401, counter NOT incremented | Negative | Non-ASCII email → không match DB (encoding edge case) |
| **DT-A-012** | Password case-sensitive mismatch | Password | Invalid (behavioral) | Email: `test@eshop.com`, Password: `test1234!` (lowercase), Counter: 0, Locked: NULL | HTTP 401 "Invalid email or password", counter → 2 | Negative | Code phân biệt hoa/thường |
| **DT-A-013** | Password character difference | Password | Invalid (input domain) | Email: `test@eshop.com`, Password: `Test123!` (missing `4`), Counter: 0, Locked: NULL | HTTP 401 "Invalid email or password", counter → 2 | Negative | Password ≠ exact match |
| **DT-A-014** | Password with trailing whitespace | Password | Invalid (behavioral) | Email: `test@eshop.com`, Password: `Test1234! ` (space), Counter: 0, Locked: NULL | HTTP 401 "Invalid email or password", counter → 2 | Negative | Code không trim password |
| **DT-A-015** | Password empty | Password | Invalid (input domain) | Email: `test@eshop.com`, Password: `` (empty), Counter: 0, Locked: NULL | HTTP 401 "Invalid email or password", counter → 2 | Negative | `"" === "Test1234!"` → false |
| **DT-A-016** | Password null / undefined (field missing) | Password | Invalid (input domain) | Email: `test@eshop.com`, Password: (field không gửi), Counter: 0, Locked: NULL | HTTP 401, counter → 2 | Negative | `undefined === "Test1234!"` → false (hành vi khác empty) |
| **DT-A-017** | Password very long (robustness) | Password | Invalid (input domain) | Email: `test@eshop.com`, Password: `aaaa...` (1000+ chars), Counter: 0, Locked: NULL | HTTP 401, counter → 2 | Negative | `===` so sánh O(n), kiểm tra hệ thống không crash |
| **DT-A-018** | Password with unicode chars | Password | Invalid (behavioral) | Email: `test@eshop.com`, Password: `Tëst1234!` (ë thay e), Counter: 0, Locked: NULL | HTTP 401, counter → 2 | Negative | Encoding edge case — `===` so sánh byte-level |
| **DT-A-019** | Lockout priority (lock checked before password) | State (locked) | Valid Email + Valid Password + **Locked** | Email: `test@eshop.com`, Password: `Test1234!`, Counter: 4, Locked: 2026-06-22 10:05 | HTTP 403 "Tài khoản đã bị khóa" (ngay cả mật khẩu đúng) | Negative | **Priority check**: locked_until check TRƯỚC password check |
| **DT-A-020** | Trigger lockout (attempts 0→2) | State (counter trigger) | Valid Email + Invalid Password + **attempts=0** | Email: `test@eshop.com`, Password: `WrongPass123!`, Counter: 0, Locked: NULL | HTTP 401, counter → 2 (gần ngưỡng khóa ≥3) | Negative | Một lần sai đầu tiên → tăng +2 |
| **DT-A-021** | Cross threshold & lockout (attempts 2→4, then lock) | State (counter threshold) | Valid Email + Invalid Password + **attempts=2** | Email: `test@eshop.com`, Password: `WrongPass123!`, Counter: 2, Locked: NULL | HTTP 401, counter → 4 (≥3), account LOCKED (locked_until set) | Negative | Vượt ngưỡng 3 → bị khóa 180s |
| **DT-A-022** | Boundary threshold (counter=3 set via DB) | State (counter boundary) | Valid Email + Invalid Password + **attempts=3** | Email: `test@eshop.com`, Password: `WrongPass123!`, Counter: 3 (set trực tiếp qua DB), Locked: NULL | HTTP 401, counter → 5 (≥3), account LOCKED | Negative | counter=3 không xảy ra tự nhiên (code +2: 0→2→4), nhưng là **boundary test** tại ngưỡng `>=3` |
| **DT-A-023** | Lockout expired (can re-login after unlock) | State (locked expired) | Valid Email + Valid Password + **locked_until expired** | Email: `test@eshop.com`, Password: `Test1234!`, Counter: 4, Locked: 2020-01-01 (expired) | HTTP 200 (khóa hết hạn), JWT returned, counter reset to 0 | Positive | Hết hạn khóa → có thể login lại (nhưng counter vẫn cao trước reset, **điểm nóng**) |
