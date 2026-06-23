# 02 — Domain Testing (Equivalence Partitioning): feature_A (FR-02)

> **Phạm vi:** Phân hoạch miền giá trị của từng biến input thành các lớp tương đương (valid/invalid classes). Chưa sinh test case.

---

## Kỹ thuật Domain Testing — tóm tắt

**Mục đích:** Chia không gian đầu vào thành các **lớp tương đương** — mỗi lớp chứa các giá trị có **cùng hành vi** theo quan điểm hệ thống.

**Nguyên tắc:**
- Giá trị cùng lớp → hệ thống phản hồi giống nhau → chỉ cần test **1 đại diện** từ mỗi lớp.
- Ghi rõ: biến **rời rạc** (finite, discrete như email) hay **liên tục** (continuous như số thực); có **thứ tự** (ordered like numbers) hay không (unordered).
- Tách **Valid** (tuân thủ ràng buộc) và **Invalid** (vi phạm ràng buộc).

---

## BƯỚC 2a — Phân hoạch miền từng biến

### Biến 1: `email`

**Đặc điểm:**
- Kiểu: **Discrete** (danh sách hữu hạn email tồn tại) + **Unordered** (không có thứ tự tự nhiên).
- Nguồn ràng buộc: `[SPEC]` (yêu cầu format email, không trim) + `[CODE]` (so khớp phân biệt hoa/thường, không trim, không validate format ở backend).

**Phân hoạch:**

| **Lớp tương đương** | **Giá trị đại diện** | **Kiểu** | **Lý do phân lớp** |
| --- | --- | --- | --- |
| **Valid — Email tồn tại, format đúng, case khớp** | `test@eshop.com` | Valid | Seed user, format RFC email, case khớp → đăng nhập thành công |
| | `admin@eshop.com` | Valid | Seed admin user, format đúng, case khớp → đăng nhập thành công |
| **Valid — Email tồn tại nhưng case KHÁC** | `Test@eshop.com` | Invalid | Email phân biệt hoa/thường (code); case khác → không tìm thấy → 401 |
| | `TEST@ESHOP.COM` | Invalid | Case sai toàn bộ → 401 |
| **Valid — Email tồn tại nhưng có KHOẢNG TRẮNG thừa** | ` test@eshop.com ` (space đầu/cuối) | Invalid | Không trim ở backend; so khớp exact → email lạ (không tìm thấy) → 401 |
| | `test @eshop.com` (space giữa) | Invalid | So khớp exact → email lạ → 401 |
| **Invalid — Email không tồn tại** | `unknown@eshop.com` | Invalid | Không có trong DB → `401 "Invalid email or password"` (không tăng bộ đếm) |
| | `user123@domain.com` | Invalid | Format có vẻ hợp lệ nhưng không tồn tại → 401 |
| **Invalid — Email format sai (thiếu @)** | `testeshop.com` | Invalid | Không có `@` → format sai (theo SPEC, từ chối) → 400 hay 401 |
| **Invalid — Email format sai (thiếu domain)** | `test@` | Invalid | Không có domain → format sai → 400 hay 401 |
| **Invalid — Email rỗng** | `` (chuỗi rỗng) | Invalid | HTML5 yêu cầu `required` → form chặn trước khi gửi; nếu bypass gửi → backend không validate → `401 "Invalid..."` |
| | `null` | Invalid | Không gửi field → `null` ở backend → `SELECT WHERE email = NULL` trả `null` → 401 |
| **Invalid — Email chứa ký tự đặc biệt/unicode** | `tëst@ëshop.com` | Invalid | UTF-8 không chuẩn email → format sai → code không validate ở backend → có thể truyền qua nhưng không tìm thấy user → 401 |
| | `test@eshop.com;DELETE--` | Invalid | Tiêm SQL? Code dùng parameterized query → an toàn → email lạ → 401 (không có impact security) |

**Tóm tắt Lớp Valid & Invalid cho `email`:**

| **Hạng mục** | **Lớp** | **Hành vi kỳ vọng** | **Số lớp** |
| --- | --- | --- | --- |
| **Valid** | Email tồn tại, format đúng, case khớp | Tiếp tục kiểm tra mật khẩu | 2 |
| **Invalid** | Case sai / space thừa / format sai / không tồn tại | `401` hoặc không tăng bộ đếm (email lạ vs sai mật khẩu) | 8+ |

---

### Biến 2: `password`

**Đặc điểm:**
- Kiểu: **Discrete** (danh sách hữu hạn mật khẩu hợp lệ trên DB) + **Unordered** (mật khẩu không có thứ tự).
- Nguồn ràng buộc: `[CODE]` (so sánh plaintext exact `user.password === password`, không trim, phân biệt hoa/thường).
- Lưu ý: Email phải **hợp lệ & tồn tại** trước để có mật khẩu để so sánh. Nếu email lạ → vẫn `401` nhưng **không tăng bộ đếm**.

**Phân hoạch — giả định Email hợp lệ (ví dụ `test@eshop.com`):**

| **Lớp tương đương** | **Giá trị đại diện** | **Kiểu** | **Lý do phân lớp** |
| --- | --- | --- | --- |
| **Valid — Mật khẩu ĐÚNG cho email** | `Test1234!` (cho `test@eshop.com`) | Valid | So khớp exact ✓ → reset attempts, cấp JWT, 200 |
| | `Admin123!` (cho `admin@eshop.com`) | Valid | So khớp exact ✓ → 200 |
| **Invalid — Mật khẩu SAI (case sai)** | `test1234!` (lowercase `t`) | Invalid | Phân biệt hoa/thường → ✗ → tăng bộ đếm, 401 |
| | `TEST1234!` (uppercase) | Invalid | Case sai → ✗ → tăng bộ đếm, 401 |
| **Invalid — Mật khẩu SAI (thiếu/thừa ký tự)** | `Test123!` (thiếu `4`) | Invalid | Ký tự khác → ✗ → 401 |
| | `Test12345!` (thừa `5`) | Invalid | Ký tự khác → ✗ → 401 |
| **Invalid — Mật khẩu SAI (có KHOẢNG TRẮNG thừa)** | `Test1234! ` (space cuối) | Invalid | Không trim ⇒ ✗ → 401 |
| | ` Test1234!` (space đầu) | Invalid | Không trim ⇒ ✗ → 401 |
| **Invalid — Mật khẩu RỖNG** | `` (empty string) | Invalid | So khớp `"" === "Test1234!"` → false → 401 |
| | `null` / undefined | Invalid | Không gửi field → `null` ⇒ ✗ → 401 |
| **Invalid — Mật khẩu GHI ĐỨC từ USER KHÁC** | `Admin123!` (cho `test@eshop.com`) | Invalid | Sai password của user này → ✗ → 401 (tăng bộ đếm của `test` user) |
| **Invalid — Mật khẩu chứa ký tự UNICODE** | `Tëst1234!` (ë thay e) | Invalid | Ký tự unicode khác → so khớp sẽ ✗ → 401 |

**Tóm tắt Lớp Valid & Invalid cho `password`:**

| **Hạng mục** | **Lớp** | **Hành vi kỳ vọng** | **Số lớp** |
| --- | --- | --- | --- |
| **Valid** | Mật khẩu chính xác cho email | Kiểm tra trạng thái khóa → cấp JWT / reset attempts | 2 |
| **Invalid** | Sai case / sai ký tự / rỗng / có space / unicode | Tăng bộ đếm, 401 (nếu email tồn tại) | 7+ |

---

## BƯỚC 2b — Kết hợp biến & điều kiện phụ thuộc

Luồng login không độc lập — **thứ tự kiểm tra** ảnh hưởng đến test case nào có thể + có ý nghĩa:

```
1. Email tồn tại?
   ├─ NO (email lạ)       → 401, không tăng bộ đếm         [combination: invalid email × any password]
   └─ YES (email hợp lệ)  → tiếp
       2. Đang khóa?
       ├─ YES              → 403 "Tài khoản đã bị khóa"      [combination: valid email × any password × locked]
       └─ NO               → tiếp
           3. Mật khẩu đúng?
           ├─ YES           → reset attempts, cấp JWT, 200   [combination: valid email × valid password]
           └─ NO            → tăng attempts +=2, kiểm tra khóa, 401  [combination: valid email × invalid password]
```

**Điều kiện kết hợp quan trọng:**

| **Kết hợp** | **Email** | **Password** | **Trạng thái** | **Hành vi kỳ vọng** | **Test case cần?** |
| --- | --- | --- | --- | --- | --- |
| 1 | Valid, tồn tại | Valid ✓ | `attempts=0, unlocked` | `200`, JWT | ✓ Happy path |
| 2 | Valid, tồn tại | Valid ✓ | `attempts=4, locked` | `403` (khóa có ưu tiên) | ✓ Priority |
| 3 | Valid, tồn tại | Invalid ✗ | `attempts=0, unlocked` | `401`, `attempts→2` | ✓ Trigger khóa |
| 4 | Valid, tồn tại | Invalid ✗ | `attempts=2, unlocked` | `401`, `attempts→4` | ✓ Vượt ngưỡng |
| 5 | Invalid, lạ | Any | Any | `401`, bộ đếm **không** tăng | ✓ Email lạ |
| 6 | Valid, tồn tại (case khác) | Any | Any | Tương tự invalid email → `401` | ✓ Case mismatch |
| 7 | Valid (có space thừa) | Any | Any | Tương tự invalid email → `401` | ✓ Whitespace |


## BƯỚC 2b — Domain Test Matrix & Test Case Generation

### Domain Test Matrix

Ma trận dưới đây hiển thị từng biến, lớp tương đương, và giá trị đại diện để test. Nguyên tắc **one-at-a-time**: khi test 1 biến ở lớp invalid, các biến khác giữ ở mức valid (by default).

| # | **Biến** | **Lớp** | **Giá trị Đại diện** | **Email** | **Password** | **Counter** | **Locked** | **TC ID** |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | Happy path | Valid + Valid | — | `test@eshop.com` | `Test1234!` | 0 | NULL | DT-A-001 |
| 2 | Email | Format valid, match DB | — | `test@eshop.com` | `Test1234!` | 0 | NULL | DT-A-001 |
| 3 | Email | Format valid, **case mismatch** | `Test@eshop.com` | `Test@eshop.com` | `Test1234!` | 0 | NULL | DT-A-002 |
| 4 | Email | Format **invalid (no @)** | `testeshop.com` | `testeshop.com` | `Test1234!` | 0 | NULL | DT-A-003 |
| 5 | Email | Format **invalid (no domain)** | `test@` | `test@` | `Test1234!` | 0 | NULL | DT-A-004 |
| 6 | Email | **Empty / null** | `` | `` | `Test1234!` | 0 | NULL | DT-A-005 |
| 7 | Email | **Too long** (1000+ chars) | `aaaa...@test.com` | `aaaa...@test.com` | `Test1234!` | 0 | NULL | DT-A-006 |
| 8 | Email | **Whitespace** | ` test@eshop.com ` | ` test@eshop.com ` | `Test1234!` | 0 | NULL | DT-A-007 |
| 9 | Email | **Not in DB** | `unknown@eshop.com` | `unknown@eshop.com` | `Test1234!` | 0 | NULL | DT-A-008 |
| 10 | Password | Valid (exact match) | — | `test@eshop.com` | `Test1234!` | 0 | NULL | DT-A-009 |
| 11 | Password | **Case mismatch** | `test1234!` | `test@eshop.com` | `test1234!` | 0 | NULL | DT-A-010 |
| 12 | Password | **Char difference** | `Test123!` | `test@eshop.com` | `Test123!` | 0 | NULL | DT-A-011 |
| 13 | Password | **Whitespace** | `Test1234! ` | `test@eshop.com` | `Test1234! ` | 0 | NULL | DT-A-012 |
| 14 | Password | **Empty / null** | `` | `test@eshop.com` | `` | 0 | NULL | DT-A-013 |
| 15 | State | **Locked (priority)** | — | `test@eshop.com` | `Test1234!` | 4 | 2026-06-22 10:05 | DT-A-014 |
| 16 | State | **Trigger lockout** (attempts→2) | — | `test@eshop.com` | `Test1234!` (sai) | 0 | NULL | DT-A-015 |
| 17 | State | **Cross threshold** (attempts→4, locked) | — | `test@eshop.com` | `Test1234!` (sai) | 2 | NULL | DT-A-016 |
| 18 | State | **Lockout expired** | — | `test@eshop.com` | `Test1234!` | 4 | 2020-01-01 (expired) | DT-A-017 |

### Test Case List 
| **TC ID** | **Mục tiêu** | **Biến được test** | **Lớp (Valid/Invalid)** | **Input cụ thể** | **Expected Result** | **Loại** | **Ghi chú** |
| --- | --- | --- | --- | --- | --- | --- | --- |
| **DT-A-001** | Happy path — đăng nhập thành công | Email + Password | Valid + Valid | Email: `test@eshop.com`, Password: `Test1234!`, Counter: 0, Locked: NULL | HTTP 200, JWT returned, counter reset to 0 | Positive | Email format valid + match DB + exact password match |
| **DT-A-002** | Email case-sensitive mismatch | Email | Invalid (behavioral) | Email: `Test@eshop.com`, Password: `Test1234!`, Counter: 0, Locked: NULL | HTTP 401 "Invalid email or password", counter NOT incremented | Negative | Email format valid nhưng case ≠ DB (case-sensitive code behavior) |
| **DT-A-003** | Email format invalid (missing @) | Email | Invalid (input domain) | Email: `testeshop.com`, Password: `Test1234!`, Counter: 0, Locked: NULL | HTTP 401 "Invalid email or password", counter NOT incremented | Negative | Email format sai (RFC requirement) |
| **DT-A-004** | Email format invalid (missing domain) | Email | Invalid (input domain) | Email: `test@`, Password: `Test1234!`, Counter: 0, Locked: NULL | HTTP 401 "Invalid email or password", counter NOT incremented | Negative | Email format không đầy đủ |
| **DT-A-005** | Email empty (required field) | Email | Invalid (input domain) | Email: `` (empty), Password: `Test1234!`, Counter: 0, Locked: NULL | HTTP 400 or 401, counter NOT incremented | Negative | Email field required (HTML5 + backend) |
| **DT-A-006** | Email too long (boundary) | Email | Invalid (input domain) | Email: `aaa...@test.com` (1000+ chars), Password: `Test1234!`, Counter: 0, Locked: NULL | HTTP 400 or 401 (DB truncate / overflow) | Negative | Boundary value — potential truncate/overflow |
| **DT-A-007** | Email with whitespace (string mismatch) | Email | Invalid (behavioral) | Email: ` test@eshop.com ` (space), Password: `Test1234!`, Counter: 0, Locked: NULL | HTTP 401 "Invalid email or password", counter NOT incremented | Negative | Code không trim — exact string match fails |
| **DT-A-008** | Email not in DB | Email | Invalid (behavioral) | Email: `unknown@eshop.com`, Password: `Test1234!`, Counter: 0, Locked: NULL | HTTP 401 "Invalid email or password", **counter NOT incremented** (điểm nóng) | Negative | Email không tồn tại → khác sai mật khẩu (không tăng counter) |
| **DT-A-009** | Password valid (exact match) | Password | Valid | Email: `test@eshop.com`, Password: `Test1234!`, Counter: 0, Locked: NULL | HTTP 200, JWT returned | Positive | Password exact match |
| **DT-A-010** | Password case-sensitive mismatch | Password | Invalid (behavioral) | Email: `test@eshop.com`, Password: `test1234!` (lowercase), Counter: 0, Locked: NULL | HTTP 401 "Invalid email or password", counter → 2 | Negative | Code phân biệt hoa/thường |
| **DT-A-011** | Password character difference | Password | Invalid (input domain) | Email: `test@eshop.com`, Password: `Test123!` (missing `4`), Counter: 0, Locked: NULL | HTTP 401 "Invalid email or password", counter → 2 | Negative | Password ≠ exact match |
| **DT-A-012** | Password with trailing whitespace | Password | Invalid (behavioral) | Email: `test@eshop.com`, Password: `Test1234! ` (space), Counter: 0, Locked: NULL | HTTP 401 "Invalid email or password", counter → 2 | Negative | Code không trim password |
| **DT-A-013** | Password empty (required field) | Password | Invalid (input domain) | Email: `test@eshop.com`, Password: `` (empty), Counter: 0, Locked: NULL | HTTP 401 "Invalid email or password", counter → 2 | Negative | Password field required |
| **DT-A-014** | Lockout priority (lock checked before password) | State (locked) | Valid Email + Valid Password + **Locked** | Email: `test@eshop.com`, Password: `Test1234!`, Counter: 4, Locked: 2026-06-22 10:05 | HTTP 403 "Tài khoản đã bị khóa" (ngay cả mật khẩu đúng) | Negative | **Priority check**: locked_until check TRƯỚC password check |
| **DT-A-015** | Trigger lockout (attempts 0→2) | State (counter trigger) | Valid Email + Invalid Password + **attempts=0** | Email: `test@eshop.com`, Password: `WrongPass123!`, Counter: 0, Locked: NULL | HTTP 401, counter → 2 (gần ngưỡng khóa >=3) | Negative | Một lần sai đầu tiên → tăng +2 |
| **DT-A-016** | Cross threshold & lockout (attempts 2→4, then lock) | State (counter threshold) | Valid Email + Invalid Password + **attempts=2** | Email: `test@eshop.com`, Password: `WrongPass123!`, Counter: 2, Locked: NULL | HTTP 401, counter → 4 (≥3), account LOCKED (locked_until set) | Negative | Vượt ngưỡng 3 → bị khóa 180s |
| **DT-A-017** | Lockout expired (can re-login after unlock) | State (locked expired) | Valid Email + Valid Password + **locked_until expired** | Email: `test@eshop.com`, Password: `Test1234!`, Counter: 4, Locked: 2020-01-01 (expired) | HTTP 200 (khóa hết hạn), JWT returned | Positive | Hết hạn khóa → có thể login lại (nhưng counter vẫn cao, **điểm nóng**) |


---

## Tóm tắt phân hoạch

**Biến `email`:**
- **Valid classes:** 2 (test, admin)
- **Invalid classes:** 8+ (case sai, space, format sai, không tồn tại)
- **Chiến lược:** Test 1 đại diện từ mỗi class, chú ý case-sensitive & whitespace (điểm nóng từ code)

**Biến `password`:**
- **Valid classes:** 2 (đúng cho test user, đúng cho admin user)
- **Invalid classes:** 7+ (case sai, ký tự sai, rỗng, space, unicode)
- **Chiến lược:** Test với email hợp lệ + password từ các class, chú ý bộ đếm tăng (điểm nóng)

**Biến trạng thái (precondition):**
- `login_attempts`: 0, 1, 2, 3+, 4, 6... (để test ngưỡng khóa)
- `locked_until`: NULL (chưa khóa), trong hiệu lực (đang khóa), quá hạn (hết khóa)
- Sẽ đặt qua API khác hoặc DB trực tiếp → **không** input trực tiếp từ form

---

*Kết thúc BƯỚC 2a — Phân hoạch miền. Bước kế tiếp (chờ xác nhận): BƯỚC 2b — Xác định test case từ phân hoạch + Boundary Value Analysis (BVA) ở `03_bva.md`.*
