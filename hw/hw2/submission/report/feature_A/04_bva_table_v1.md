# 04 — Boundary Value Analysis (BVA): feature_A (FR-02 — Login & Account Lockout)

> **Scope:** Xác định các điểm biên (boundaries) của các field có miền giá trị ordered/continuous. Áp dụng 3-value BVA cho mỗi đầu biên.

---

## BVA Overview

Boundary Value Analysis tập trung vào các giá trị ở **"cạnh"** của miền giá trị, vì đó là nơi code thường có lỗi (off-by-one, overflow, underflow).

---

## Field 1: `email` — Length Boundary

| Attribute | Value |
| --- | --- |
| **Field** | `email` |
| **Boundary Type** | String Length |
| **Min** | 0 (rỗng) |
| **Max** | 320 (giới hạn RFC 5321) |
| **Type** | Discrete length values |

**BVA Table:**

| Boundary | Value | Character Count | Description | Test Expectation |
| --- | --- | --- | --- | --- |
| **Min-1** | N/A | -1 | Không áp dụng (length không thể âm) | — |
| **Min** | `` (rỗng) | 0 | Email rỗng | Form chặn (required), hoặc `401` nếu bypass |
| **Min+1** | `a@b` | 3 | Format hợp lệ tối thiểu (local + @ + domain) | `401` (format hợp lệ nhưng user không tồn tại) |
| **Nominal** | `test@eshop.com` | 14 | Seed user (độ dài thông thường) | `200` hoặc `401` (tùy password) |
| **Max-1** | `aaa...@aaa...` | 319 | Ngay dưới giới hạn RFC | `401` (không tìm thấy, hoặc hợp lệ nếu có trong DB) |
| **Max** | `aaa...@aaa...` | 320 | Giới hạn RFC 5321 | `401` (không tìm thấy, hoặc hợp lệ nếu có trong DB) |
| **Max+1** | `aaa...@aaa...` | 321 | Vượt giới hạn RFC | `400` hoặc `401` (có thể bị truncate/reject) |

**Giải thích:**
- Email là string, độ dài có biên: min = 0 (rỗng), max = 320 (RFC).
- Min+1 chọn `a@b` vì đó là format email nhỏ nhất có thể hợp lệ (1 char local + @ + 1 char domain).
- Max-1 và Max là ngưỡng RFC.
- Max+1 kiểm tra xem hệ thống xử lý overflow thế nào (truncate hay reject).

> **Ghi chú:** Backend không enforce length limit. Các boundary trên là theoretical (RFC/practical), không phải behavioral boundary của hệ thống. Mục đích: test system resilience.

---

## Field 2: `password` — Length Boundary

| Attribute | Value |
| --- | --- |
| **Field** | `password` |
| **Boundary Type** | String Length |
| **Min** | 0 (rỗng) |
| **Max** | Unlimited (code không limit) |
| **Type** | Discrete length values |

**BVA Table:**

| Boundary | Value | Character Count | Description | Test Expectation |
| --- | --- | --- | --- | --- |
| **Min-1** | N/A | -1 | Không áp dụng | — |
| **Min** | `` (rỗng) | 0 | Password rỗng | `401`, counter → 2 |
| **Min+1** | `a` | 1 | Một ký tự duy nhất | `401` (không khớp), counter → 2 |
| **Nominal** | `Test1234!` | 9 | Độ dài seed password | `200` (nếu khớp), hoặc `401` |
| **Max-1** | `aaaa...` (999) | 999 | Giới hạn trên thực tế (test) | `401` (không khớp, counter → 2) |
| **Max** | `aaaa...` (1000) | 1000 | Password "lớn" tùy chọn | `401` (không khớp, counter → 2) |
| **Max+1** | `aaaa...` (1001) | 1001 | Vượt giới hạn tùy chọn | `401` (không khớp, counter → 2) |

**Giải thích:**
- Password không có max length constraint trong code → chọn giá trị lớn tùy ý (1000, 1001) để test system resilience.
- Min = 0 (rỗng), Min+1 = 1 char.
- Nominal = 9 (độ dài seed password).
- Kiểm tra xem input quá lớn gây lỗi DB/network hay chỉ đơn giản không khớp.

> **Ghi chú:** Backend không enforce length limit. Các boundary trên là theoretical (practical), không phải behavioral boundary của hệ thống. Mục đích: test system resilience.

---

## Field 3: `login_attempts` — Numeric Boundary

| Attribute | Value |
| --- | --- |
| **Field** | `login_attempts` |
| **Boundary Type** | Integer (numeric) |
| **Min** | 0 |
| **Threshold** | 3 (nơi kích hoạt lock) |
| **Max** | Unlimited (nhưng thực tế bị giới hạn bởi DB INT) |
| **Increment** | +2 mỗi lần fail |

**BVA Table:**

| Boundary | Value | Description | Behavior | Test Expectation |
| --- | --- | --- | --- | --- |
| **Min-1** | -1 | Dưới 0 (invalid state) | Counter không bao giờ âm trong normal flow | Không xảy ra (test data corruption) |
| **Min** | 0 | Tài khoản mới, chưa có lần fail | Account unlocked, có thể login | Password đúng → `200` |
| **Min+1** | 1 | Giá trị chỉ đạt được qua DB manipulation (code nhảy 0→2→4) | Nếu stored = 1, lần fail tiếp → newAttempts = 1+2 = 3 ≥ 3 → **LOCK** | `403` sau lần nhập sai tiếp theo |
| **Nominal** | 2 | Sau lần nhập sai đầu tiên (observable) | Account đang tiến gần threshold | Lần nhập sai tiếp → 4 → LOCK |
| **Threshold-1** | 2 | Ngay trước khi kích hoạt lock | Vẫn unlocked, lần fail tiếp sẽ trigger lock | Password đúng → `200`, sai → lock |
| **Threshold** | 3 | Threshold chính xác (theo SPEC) | **Code không bao giờ đạt 3** (increment +2) | Lý thuyết; thực tế: 0→2→4 |
| **Threshold+1** | 4 | Sau lần nhập sai thứ 2 (observable) | Account BỊ LOCK (locked_until được set) | Mọi lần login → `403` |
| **Max-1** | INT_MAX - 1 | Gần integer overflow | Locked (counter >= 3) | `403` |
| **Max** | INT_MAX | Integer overflow (giới hạn DB) | Locked hoặc error | `403` hoặc `500` |

**Giải thích:**
- `login_attempts` là INTEGER, ordered, numeric.
- Min = 0, Max = INT_MAX (giới hạn database, thường là 2,147,483,647 cho 32-bit int).
- **Critical boundary:** threshold = 3 (SPEC), nhưng code increment +2 → chuỗi thực tế: 0, 2, 4, 6...
- Giá trị threshold 3 không bao giờ đạt được trong code → anomaly cần ghi nhận.
- Min+1 = 1 (về lý thuyết nằm giữa 0 và 2, nhưng code nhảy 0→2).
- Nominal = 2 (trạng thái khác 0 đầu tiên observable sau khi fail).

> **Lưu ý:** Lock trigger check trên `newAttempts = stored + 2`. Boundary thực tế: `stored >= 1` → lần fail tiếp sẽ trigger lock (vì `1 + 2 = 3 >= 3`).

---

## Field 4: `locked_until` — Time Boundary

| Attribute | Value |
| --- | --- |
| **Field** | `locked_until` |
| **Boundary Type** | DATETIME (time-based ordered) |
| **Min** | NULL (chưa bị lock) |
| **Epoch** | Unix time 0 hoặc DB epoch |
| **Current Time** | now() — ranh giới giữa expired/locked |
| **Max** | Far future (giới hạn DB) |

**BVA Table:**

| Boundary | Value | Description | Lock Status | Test Expectation |
| --- | --- | --- | --- | --- |
| **Min (NULL)** | `NULL` | Chưa từng bị lock | Unlocked | Password đúng → `200` |
| **Past-1** | `1970-01-01T00:00:00` | Quá khứ xa | Expired | `200` (unlocked, counter không đổi) |
| **Past** | `2000-01-01T00:00:00` | Quá khứ gần | Expired | `200` |
| **Now-1** | `now() - 1 second` | Vừa hết hạn 1 giây trước | Expired (unlocked) — `now >= locked_until` | `200` |
| **Now** | `now()` | **Boundary:** expired nếu `now >= locked_until` | Edge case (phụ thuộc operator) | `403` hoặc `200` (phụ thuộc timing) |
| **Now+1** | `now() + 1 second` | Vừa bị lock | Locked | `403` |
| **Future** | `2099-12-31T23:59:59` | Tương lai xa | Locked | `403` |
| **Max** | DB DATETIME limit | Max lý thuyết (vd: năm 9999) | Locked | `403` |

**Giải thích:**
- `locked_until` là DATETIME, ordered (time-based).
- Min = `NULL` (chưa bị lock), Max = giới hạn DB.
- **Critical boundary:** `now()` phân chia giữa expired (quá khứ) và locked (tương lai).
- Code check: `if (now < locked_until)` → expired khi `now >= locked_until`.
- **Edge case:** chính xác tại `now()` — nhạy cảm với timing, có thể thay đổi theo millisecond precision.
- Cần test cả "ngay trước khi hết hạn" và "ngay sau khi hết hạn".

---

## Summary of BVA Boundaries

| Field | Boundary Count | Key BVAs | Justification |
| --- | --- | --- | --- |
| `email` | 4 (length) | 0, 3, 320, 321 | Min/Max length; Min+1 cho format hợp lệ tối thiểu |
| `password` | 3 (length) | 0, 1, 1000, 1001 | Min/Max; spec không có max, chọn practical bounds |
| `login_attempts` | 5 (numeric + threshold) | 0, 1, 2, 3, 4, INT_MAX | Threshold là critical; increment +2 là anomaly |
| `locked_until` | 5 (time) | NULL, past, now-1, now, now+1, future | Time boundary là critical divider |

---

## Missing / Deferred

- **Format boundaries** (các biến thể format email như `user+tag@domain`, `user@sub.domain`) — không phải numeric, đã xử lý trong domain testing.
- **Case-sensitivity boundaries** — qualitative, không phải quantitative.
- **Whitespace boundaries** — đã xử lý trong domain testing.
