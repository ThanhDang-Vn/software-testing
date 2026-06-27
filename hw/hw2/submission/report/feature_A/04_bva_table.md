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
| **Min** | 0 (empty) |
| **Max** | 320 (RFC 5321 limit) |
| **Type** | Discrete length values |

**BVA Table:**

| Boundary | Value | Character Count | Description | Test Expectation |
| --- | --- | --- | --- | --- |
| **Min-1** | N/A | -1 | Không áp dụng (length không thể âm) | — |
| **Min** | `` (empty) | 0 | Email rỗng | Form blocks (required), or `401` if bypassed |
| **Min+1** | `a@b` | 3 | Minimal valid format (local + @ + domain) | `401` (format hợp lệ nhưng user not found) |
| **Nominal** | `test@eshop.com` | 14 | Seed user (typical length) | `200` or `401` (depends on password) |
| **Max-1** | `aaa...@aaa...` | 319 | Just under RFC limit | `401` (not found, or valid if in DB) |
| **Max** | `aaa...@aaa...` | 320 | RFC 5321 limit | `401` (not found, or valid if in DB) |
| **Max+1** | `aaa...@aaa...` | 321 | Over RFC limit | `400` or `401` (potential truncate/reject) |

**Giải thích:**
- Email là string, độ dài có biên: min = 0 (rỗng), max = 320 (RFC).
- Min+1 chọn `a@b` vì đó là format email nhỏ nhất có thể hợp lệ (1 char local + @ + 1 char domain).
- Max-1 và Max là ngưỡng RFC.
- Max+1 test xem hệ thống handle overflow (truncate hay reject).

---

## Field 2: `password` — Length Boundary

| Attribute | Value |
| --- | --- |
| **Field** | `password` |
| **Boundary Type** | String Length |
| **Min** | 0 (empty) |
| **Max** | Unlimited (code không limit) |
| **Type** | Discrete length values |

**BVA Table:**

| Boundary | Value | Character Count | Description | Test Expectation |
| --- | --- | --- | --- | --- |
| **Min-1** | N/A | -1 | Không áp dụng | — |
| **Min** | `` (empty) | 0 | Password rỗng | `401`, counter → 2 |
| **Min+1** | `a` | 1 | Single character | `401` (not match), counter → 2 |
| **Nominal** | `Test1234!` | 9 | Seed password length | `200` (if matches), or `401` |
| **Max-1** | `aaaa...` (999) | 999 | Practical upper limit (test) | `401` (not match, counter → 2) |
| **Max** | `aaaa...` (1000) | 1000 | Arbitrary "large" password | `401` (not match, counter → 2) |
| **Max+1** | `aaaa...` (1001) | 1001 | Over arbitrary limit | `401` (not match, counter → 2) |

**Giải thích:**
- Password không có max length constraint trong code → chọn arbitrary large values (1000, 1001) để test system resilience.
- Min = 0 (rỗng), Min+1 = 1 char.
- Nominal = 9 (seed password length).
- Test whether oversized input causes DB/network error hay just simple mismatch.

---

## Field 3: `login_attempts` — Numeric Boundary

| Attribute | Value |
| --- | --- |
| **Field** | `login_attempts` |
| **Boundary Type** | Integer (numeric) |
| **Min** | 0 |
| **Threshold** | 3 (where lock is triggered) |
| **Max** | Unlimited (but practically bounded by DB INT) |
| **Increment** | +2 per failure |

**BVA Table:**

| Boundary | Value | Description | Behavior | Test Expectation |
| --- | --- | --- | --- | --- |
| **Min-1** | -1 | Below zero (invalid state) | Counter không bao giờ âm trong normal flow | Should not occur (data corruption test) |
| **Min** | 0 | Fresh account, no failures | Account unlocked, can login | Correct password → `200` |
| **Min+1** | 1 | **Note:** Code increments +2, so next state is 2 | After 1st wrong password (internal) | Counter becomes 2, still unlocked |
| **Nominal** | 2 | After 1st wrong password (observable) | Account approaching threshold | Next wrong password → 4 → LOCK |
| **Threshold-1** | 2 | Just before lock trigger | Still unlocked, next failure triggers lock | Correct password → `200`, wrong → lock |
| **Threshold** | 3 | Exact threshold (SPEC definition) | **Code never reaches 3** (increments by 2) | Theoretical; in practice: 0→2→4 |
| **Threshold+1** | 4 | After 2nd wrong password (observable) | Account LOCKED (locked_until set) | Any login attempt → `403` |
| **Max-1** | INT_MAX - 1 | Near integer overflow | Locked (counter >= 3) | `403` |
| **Max** | INT_MAX | Integer overflow (DB limit) | Locked or error | `403` or `500` |

**Giải thích:**
- `login_attempts` là INTEGER, ordered, numeric.
- Min = 0, Max = INT_MAX (database limit, typically 2,147,483,647 for 32-bit int).
- **Critical boundary:** threshold = 3 (SPEC), but code increments +2 → actual sequence: 0, 2, 4, 6...
- Threshold value 3 never actually reached in code → anomaly to flag.
- Min+1 = 1 (theoretically between 0 and 2, but code jumps 0→2).
- Nominal = 2 (first observable non-zero state after failure).

---

## Field 4: `locked_until` — Time Boundary

| Attribute | Value |
| --- | --- |
| **Field** | `locked_until` |
| **Boundary Type** | DATETIME (time-based ordered) |
| **Min** | NULL (no lock) |
| **Epoch** | Unix time 0 or DB epoch |
| **Current Time** | now() — dividing line between expired/locked |
| **Max** | Far future (DB limit) |

**BVA Table:**

| Boundary | Value | Description | Lock Status | Test Expectation |
| --- | --- | --- | --- | --- |
| **Min (NULL)** | `NULL` | Never locked | Unlocked | Correct password → `200` |
| **Past-1** | `1970-01-01T00:00:00` | Way in the past | Expired | `200` (unlocked, counter unchanged) |
| **Past** | `2000-01-01T00:00:00` | Recent past | Expired | `200` |
| **Now-1** | `now() - 1 second` | About to expire | Still locked (technically `now < locked_until`) | `403` |
| **Now** | `now()` | **Boundary:** expired if `now >= locked_until` | Edge case (depends on operator) | `403` or `200` (timing-dependent) |
| **Now+1** | `now() + 1 second` | Just locked | Locked | `403` |
| **Future** | `2099-12-31T23:59:59` | Far in future | Locked | `403` |
| **Max** | DB DATETIME limit | Theoretical max (e.g., year 9999) | Locked | `403` |

**Giải thích:**
- `locked_until` là DATETIME, ordered (time-based).
- Min = `NULL` (not locked), Max = DB limit.
- **Critical boundary:** `now()` divides expired (past) from locked (future).
- Code checks: `if (now < locked_until)` → expired khi `now >= locked_until`.
- **Edge case:** boundary exactly at `now()` — timing-sensitive, may vary by millisecond precision.
- Test both "just before expiry" và "just after expiry".

---

## Summary of BVA Boundaries

| Field | Boundary Count | Key BVAs | Justification |
| --- | --- | --- | --- |
| `email` | 3 (length) | 0, 3, 320, 321 | Min/Max length; Min+1 for minimal valid format |
| `password` | 3 (length) | 0, 1, 1000, 1001 | Min/Max; no spec max, choose practical bounds |
| `login_attempts` | 4 (numeric + threshold) | 0, 2, 3, 4, INT_MAX | Threshold is critical; code +2 increment is anomaly |
| `locked_until` | 5 (time) | NULL, past, now-1, now, now+1, future | Time boundary is critical divider |

---

## Missing / Deferred

- **format boundaries** (email format variations like `user+tag@domain`, `user@sub.domain`) — not numeric, covered in domain testing.
- **case-sensitivity boundaries** — qualitative, not quantitative.
- **whitespace boundaries** — covered in domain testing.

---

*Kết thúc STEP 4 — BVA Table. Chờ review trước khi sinh BVA test cases (STEP 5).*
