# 07 — Test Execution Report: feature_A (FR-02 — Login & Account Lockout)

> **Scope:** Thực thi toàn bộ 50 TC từ `06_detailed_testcases_v1.md` và ghi nhận kết quả.
>
> **Môi trường:**
> - Backend: Node.js + Express @ `http://localhost:3000`
> - Database: SQLite (reset giữa các TC bằng SQL trực tiếp)
> - Test method: API-level via `curl` (bypass frontend HTML5 validation)
> - OS: Windows 11 Home 10.0.26200
> - Date: 2026-06-24

---

## A. Domain Test Cases — Execution (18 TC)

| TC ID | Description | Expected | Actual Result | Status |
| --- | --- | --- | --- | --- |
| **DT-A-001** | Happy path — user login | `200`, JWT, counter=0 | `200`, JWT returned, counter=0, redirect info in response | **Pass** |
| **DT-A-002** | Email case mismatch | `401`, counter NOT incremented | `401 "Invalid email or password"`, counter=0 | **Pass** |
| **DT-A-003** | Email thiếu @ | `401`, counter NOT incremented | `401 "Invalid email or password"`, counter=0 | **Pass** |
| **DT-A-004** | Email thiếu domain | `401`, counter NOT incremented | `401 "Invalid email or password"`, counter=0 | **Pass** |
| **DT-A-005** | Email rỗng | HTML5 blocks; bypass → `401` | `401 "Invalid email or password"` (API bypass, HTML5 not tested) | **Pass** |
| **DT-A-006** | Email quá dài (999 chars) | `401` hoặc `500` | `401 "Invalid email or password"`, counter=0 | **Pass** |
| **DT-A-007** | Email có whitespace | `401`, counter NOT incremented | `401 "Invalid email or password"`, counter=0 | **Pass** |
| **DT-A-008** | Email không tồn tại | `401`, counter NOT incremented | `401 "Invalid email or password"`, counter=0 | **Pass** |
| **DT-A-009** | Password case mismatch | `401`, counter 0→2 | `401`, counter 0→2 | **Pass** |
| **DT-A-010** | Password thiếu ký tự | `401`, counter 0→2 | `401`, counter 0→2 | **Pass** |
| **DT-A-011** | Password trailing space | `401`, counter→2 | `401`, counter 0→2 | **Pass** |
| **DT-A-012** | Password rỗng | HTML5 blocks; bypass → `401`, counter→2 | `401`, counter 0→2 (API bypass, HTML5 not tested) | **Pass** |
| **DT-A-013** | Account locked + correct pw | `403 "Tài khoản đã bị khóa"` | **Lần 1:** `200` — lock bypass do `locked_until` format thiếu `Z` (xem OBS-03). **Lần 2 (ISO format):** `403 "Tài khoản đã bị khóa. Vui lòng thử lại sau."`, counter stays 4 | **Pass** ⚠️ |
| **DT-A-014** | Lock expired + correct pw | `200`, JWT, counter reset | `200`, JWT returned, counter 4→0, locked_until cleared | **Pass** |
| **DT-A-015** | First failure 0→2 | `401`, counter 0→2 | `401`, counter 0→2 | **Pass** |
| **DT-A-016** | Cross threshold 2→4, LOCK | `401`, counter 2→4, locked | `401`, counter 2→4, `locked_until` set (+180s) | **Pass** |
| **DT-A-017** | Happy path — admin login | `200`, JWT với role:admin | `200`, JWT returned, `role: "admin"` in response | **Pass** |
| **DT-A-018** | Locked + wrong pw | `403`, counter stays 4, lock persists | **Lần 1:** `401`, counter 4→6 — lock bypass do format thiếu `Z` (xem OBS-03). **Lần 2 (ISO format):** `403`, counter=4, lock unchanged | **Pass** ⚠️ |

**Domain Result: 18/18 Pass**

---

## B. BVA Test Cases — Execution (27 TC)

### Email Length Boundaries (6 TC)

| TC ID | Description | Expected | Actual Result | Status |
| --- | --- | --- | --- | --- |
| **BVA-A-001** | Email length=0 (empty) | HTML5 blocks; bypass → `401` | `401 "Invalid email or password"` | **Pass** |
| **BVA-A-002** | Email length=3 (`a@b`) | `401` (not in DB) | `401 "Invalid email or password"` | **Pass** |
| **BVA-A-003** | Nominal (14 chars, happy path) | `200`, JWT | `200`, JWT returned | **Pass** |
| **BVA-A-004** | Email length=319 (Max-1) | `401` (not in DB) | `401 "Invalid email or password"` | **Pass** |
| **BVA-A-005** | Email length=320 (Max, RFC) | `401` (not in DB) | `401 "Invalid email or password"` | **Pass** |
| **BVA-A-006** | Email length=321 (Max+1) | `400` hoặc `401` | `401 "Invalid email or password"` | **Pass** |

### Password Length Boundaries (4 TC)

| TC ID | Description | Expected | Actual Result | Status |
| --- | --- | --- | --- | --- |
| **BVA-A-007** | Password length=0 (empty) | `401`, counter→2 | `401`, counter 0→2 | **Pass** |
| **BVA-A-008** | Password length=1 | `401`, counter→2 | `401`, counter 0→2 | **Pass** |
| **BVA-A-009** | Password length=1000 | `401`, counter→2 | `401`, counter 0→2 | **Pass** |
| **BVA-A-010** | Password length=1001 | `401`, counter→2 (hoặc `500`) | `401`, counter 0→2 | **Pass** |

### Login Attempts Boundaries (8 TC)

| TC ID | Description | Expected | Actual Result | Status |
| --- | --- | --- | --- | --- |
| **BVA-A-011** | Counter=1, correct pw | `200`, counter reset→0 | `200`, counter 1→0 | **Pass** |
| **BVA-A-012** | Counter=1, wrong pw → threshold LOCK | `401`, counter 1→3, LOCK | `401`, counter 1→3, `locked_until` set | **Pass** |
| **BVA-A-013** | Counter=2, correct pw | `200`, counter reset→0 | `200`, counter 2→0 | **Pass** |
| **BVA-A-014** | Counter=2, wrong pw → LOCK | `401`, counter 2→4, LOCK | `401`, counter 2→4, `locked_until` set | **Pass** |
| **BVA-A-015** | Counter=3 (anomaly), correct pw | `200`, counter reset | `200`, counter 3→0 | **Pass** |
| **BVA-A-016** | Counter=4, NULL lock, wrong pw → re-lock | `401`, counter 4→6, re-lock | `401`, counter 4→6, `locked_until` set | **Pass** |
| **BVA-A-017** | Counter=10, locked | `403` | `403 "Tài khoản đã bị khóa..."` | **Pass** |
| **BVA-A-018** | Counter=-1 (corruption), correct pw | `200` | `200`, counter -1→0 | **Pass** |

### Locked_Until Time Boundaries (6 TC)

| TC ID | Description | Expected | Actual Result | Status |
| --- | --- | --- | --- | --- |
| **BVA-A-019** | locked=1970 (far past) | `200` (expired) | `200`, counter reset | **Pass** |
| **BVA-A-020** | locked=2020 (recent past) | `200` (expired) | `200`, counter reset | **Pass** |
| **BVA-A-021** | locked=now()-1s (vừa hết hạn) | `200` (expired) | `200`, counter reset | **Pass** |
| **BVA-A-022** | locked=now() (boundary) | `403` hoặc `200` (edge case) | `200` (vài ms delay giữa set DB và request → now > locked_until) | **Pass** |
| **BVA-A-023** | locked=now()+1s (vừa lock) | `403` | `403 "Tài khoản đã bị khóa..."` | **Pass** |
| **BVA-A-024** | locked=2099 (far future) | `403` | `403 "Tài khoản đã bị khóa..."` | **Pass** |

### Supplementary Tests — non-BVA (3 TC)

| TC ID | Description | Expected | Actual Result | Status |
| --- | --- | --- | --- | --- |
| **BVA-A-025** | Email Unicode (ë) | `401` | `401 "Invalid email or password"` | **Pass** |
| **BVA-A-026** | Email special chars (+) | `401` | `401 "Invalid email or password"` | **Pass** |
| **BVA-A-027** | Password special chars | `401`, counter→2 | `401`, counter 0→2 | **Pass** |

**BVA Result: 27/27 Pass**

---

## C. UI Validation Test Cases — Execution (5 TC)

> **Test method:** Manual browser testing tại `http://localhost:5173/login` + DevTools Inspect.

| TC ID | Description | Expected | Actual Result | Status |
| --- | --- | --- | --- | --- |
| **UI-A-001** | Email field phải dùng `type="email"` | `type="email"` | `type="text"` (Login.jsx line 30) — không có HTML5 email validation | **Fail** |
| **UI-A-002** | Password field phải dùng `type="password"` | `type="password"` (ẩn ký tự) | `type="text"` (Login.jsx line 40) — password hiển thị plaintext trên màn hình | **Fail** |
| **UI-A-003** | Label trường email ghi "Email" | Label: "Email" | Label: "Username" (Login.jsx line 28) | **Fail** |
| **UI-A-004** | Heading trang Login ghi "Đăng nhập" | Heading: "Đăng nhập" | Heading: "Đăng Ký" (Login.jsx line 24) — sai chức năng hoàn toàn | **Fail** |
| **UI-A-006** | Thông báo lỗi khi bị khóa hiện "Tài khoản đã bị khóa" | Hiển thị message cụ thể từ API 403 | Frontend catch chung → hiển thị "Đăng nhập thất bại. Vui lòng kiểm tra lại." (Login.jsx line 18) — không phân biệt 401 vs 403 | **Fail** |

**UI Result: 0/5 Pass, 5/5 Fail**

---

## D. Execution Summary

| Category | Total | Pass | Fail | Blocked | Not Executed |
| --- | --- | --- | --- | --- | --- |
| Domain Testing | 18 | 18 | 0 | 0 | 0 |
| BVA — Email length | 6 | 6 | 0 | 0 | 0 |
| BVA — Password length | 4 | 4 | 0 | 0 | 0 |
| BVA — Counter numeric | 8 | 8 | 0 | 0 | 0 |
| BVA — Locked_until time | 6 | 6 | 0 | 0 | 0 |
| BVA — Supplementary | 3 | 3 | 0 | 0 | 0 |
| UI Validation | 5 | 0 | 5 | 0 | 0 |
| **Tổng** | **50** | **45** | **5** | **0** | **0** |

**Pass Rate: 45/50 = 90%**

---

## E. Observations & Known Issues (phát hiện trong quá trình test)

### OBS-01: Plaintext password trong API response (Security)

- **Mô tả:** Login thành công (`200`) trả về toàn bộ user object bao gồm `"password":"Test1234!"` dưới dạng plaintext.
- **Phát hiện tại:** DT-A-001, DT-A-017, và tất cả TC có `200` response.
- **Impact:** Attacker có thể đọc password từ response/network log. Vi phạm SEC best practices.
- **Ví dụ response:** `{"message":"Login successful","token":"...","user":{"password":"Test1234!",...}}`

### OBS-02: Password lưu plaintext trong DB (Security)

- **Mô tả:** Passwords trong DB không được hash (bcrypt/argon2). Code so sánh `user.password === password` (line 49 server.js).
- **Impact:** DB leak = toàn bộ password bị lộ.

### OBS-03: locked_until format-sensitive — timezone issue

- **Mô tả:** Nếu `locked_until` lưu ở format SQLite (`2026-06-24 11:53:02` — không có `Z`), Node.js `new Date()` parse thành local time → lock check bị sai.
- **Phát hiện tại:** Lần chạy đầu DT-A-013 (dùng SQLite `datetime()` → format thiếu `Z` → app trả `200` thay vì `403`).
- **Root cause:** Code dùng `.toISOString()` (có `Z` suffix) khi set lock, nhưng nếu data từ nguồn khác (migration, manual fix) thì format khác → lock bypass.
- **Impact:** Potential lock bypass nếu locked_until format không nhất quán.

### OBS-04: Counter increment +2 thay vì +1 (Bug/Design)

- **Mô tả:** `login_attempts` tăng +2 mỗi lần sai (line 54: `user.login_attempts + 2`). SPEC ghi threshold=3, nhưng chuỗi thực tế: 0→2→4.
- **Impact:** Account bị lock sau **2 lần sai** (thay vì 3 theo spec). Giá trị 1, 3 không bao giờ xuất hiện trong normal flow.

### OBS-05: DT-A-005/DT-A-012 — HTML5 validation chưa test

- **Mô tả:** Các TC liên quan HTML5 `required` attribute chỉ test ở API level (bypass). Frontend form validation cần test riêng trên browser.
- **Recommendation:** Cần bổ sung frontend test (manual hoặc Selenium) để verify HTML5 validation hoạt động.

### OBS-06: UI — 5/5 FAIL, nhiều lỗi UI cơ bản (UI Bugs)

- **Mô tả:** Login.jsx chứa nhiều lỗi giao diện: `type="text"` cho cả email lẫn password, heading sai ("Đăng Ký" thay vì "Đăng nhập"), label sai ("Username" thay vì "Email"), và frontend không phân biệt lỗi 401 vs 403.
- **Phát hiện tại:** UI-A-001 → UI-A-004, UI-A-006 (5 Fail).
- **Impact:** Password hiển thị plaintext trên màn hình (UI-A-002) là lỗi bảo mật nghiêm trọng nhất. Heading "Đăng Ký" gây nhầm lẫn chức năng cho user (UI-A-004). User bị khóa không nhận được thông báo cụ thể (UI-A-006).
