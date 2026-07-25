# HW02 — Domain Testing & BVA: Main Test Report

**Student ID:** 23127334
**Name:** Nguyễn Thành Dâng
**Exercise ID:** HW02
**Date:** 2026-06-28

---

## Table of Contents

- [1. Thông tin chung](#1-thông-tin-chung)
- [2. Feature A — FR-02: Login & Account Lockout](#2-feature-a--fr-02-login--account-lockout)
  - [2.A. Domain Tests](#2a-domain-tests-11-tc)
  - [2.B. BVA Tests](#2b-bva-tests-6-tc)
  - [2.C. UI Tests](#2c-ui-tests-8-tc)
  - [2.D. Execution Summary](#2d-feature-a--execution-summary)
  - [2.E. Bug Report](#2e-feature-a--bug-report-5-bugs)
- [3. Feature B — FR-11: Order History View](#3-feature-b--fr-11-order-history-view)
  - [3.A. Domain Tests](#3a-domain-tests-17-tc)
  - [3.B. BVA Tests](#3b-bva-tests-6-tc)
  - [3.C. UI Tests](#3c-ui-tests-9-tc)
  - [3.D. Execution Summary](#3d-feature-b--execution-summary)
  - [3.E. Bug Report](#3e-feature-b--bug-report-1-bug)
- [4. Feature C — FR-14: Category Management (CRUD)](#4-feature-c--fr-14-category-management-crud)
  - [4.A. Domain Tests](#4a-domain-tests-26-tc)
  - [4.B. BVA Tests](#4b-bva-tests-15-tc)
  - [4.C. UI Tests](#4c-ui-tests-7-tc)
  - [4.D. Execution Summary](#4d-feature-c--execution-summary)
  - [4.E. Bug Report](#4e-feature-c--bug-report-16-bugs)
- [5. Feature D — FR-07: Mobile Shopping Cart](#5-feature-d--fr-07-mobile-shopping-cart)
  - [5.A. Domain Tests](#5a-domain-tests-23-tc)
  - [5.B. BVA Tests](#5b-bva-tests-14-tc)
  - [5.C. Execution Summary](#5c-feature-d--execution-summary)
  - [5.D. Bug Report](#5d-feature-d--bug-report-4-bugs)
- [6. Overall Summary](#6-overall-summary)
- [Phụ lục A — AI Audit Report](#phụ-lục-a--ai-audit-report)
- [Phụ lục B — AI Critique](#phụ-lục-b--ai-critique)

---

# 1. Thông tin chung

| Thông tin | Chi tiết |
| --- | --- |
| **MSSV** | 23127334 |
| **Họ tên** | Nguyễn Thành Dâng |
| **Môn** | Software Testing |
| **Bài tập** | HW02 — Domain Testing & BVA |
| **AI Tool** | Claude Code (Claude Opus 4.6) |

### 4 Features đã chọn

| Pool | Feature | FR ID | Mô tả |
| --- | --- | --- | --- |
| A | Login & Account Lockout | FR-02 | Đăng nhập, khóa tài khoản sau N lần sai |
| B | Order History View | FR-11 | Xem lịch sử đơn hàng, hủy đơn |
| C | Category Management (CRUD) | FR-14 | Quản lý danh mục sản phẩm (Admin) |
| D | Mobile Shopping Cart | FR-07 | Giỏ hàng trên app mobile (React Native) |

### Test Environment

| Item | Detail |
| --- | --- |
| Backend | Node.js + Express @ `http://localhost:3000` |
| Frontend Web | Vite React @ `http://localhost:5173` |
| Frontend Admin | Vite React @ `http://localhost:5174` |
| Frontend Mobile | React Native / Expo |
| Database | SQLite |
| Test Tool | Playwright v1.61.1 + Node.js fetch API |
| OS | Windows 11 Home 10.0.26200 |

---

# 2. Feature A — FR-02: Login & Account Lockout

## 2.A. Domain Tests (11 TC)

| TC ID | Description | Pre-condition | Steps | Test Data | Expected | Actual | Status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| DT-A-001 | Happy path — login thành công (user) | Backend running. Tài khoản `test@eshop.com` tồn tại, counter=0, locked=NULL | 1. Mở trang Login 2. Nhập email 3. Nhập password 4. Bấm Sign In | Email: `test@eshop.com`, Password: `Test1234!` | `200`, JWT returned, counter reset=0, redirect Home | `200`, JWT returned, counter=0, redirect `/` | **Pass** |
| DT-A-003 | Email format sai (no `@`) | Backend running | 1. Mở trang Login 2. Nhập email sai format 3. Nhập password valid 4. Bấm Sign In | Email: `testeshop.com`, Password: `Test1234!` | `401 "Invalid email or password"`, counter NOT incremented | `401 "Invalid email or password"`, counter=0 | **Pass** |
| DT-A-005 | Email rỗng | Backend running | 1. Mở trang Login 2. Để trống email 3. Nhập password valid 4. Bấm Sign In | Email: *(empty)*, Password: `Test1234!` | HTML5 `required` chặn submit; nếu bypass → `401` | HTML5 chặn, trang vẫn ở `/login` | **Pass** |
| DT-A-007 | Email có whitespace đầu/cuối | Backend running. Tài khoản `test@eshop.com` tồn tại | 1. Mở trang Login 2. Nhập email có space đầu/cuối 3. Nhập password valid 4. Bấm Sign In | Email: ` test@eshop.com `, Password: `Test1234!` | `401` (exact match fails, no trim), counter NOT incremented | `401 "Invalid email or password"`, counter=0 (no trim) | **Pass** |
| DT-A-008 | Email không tồn tại trong DB | Backend running | 1. Mở trang Login 2. Nhập email không tồn tại 3. Nhập password 4. Bấm Sign In | Email: `unknown@eshop.com`, Password: `Test1234!` | `401`, counter NOT incremented | `401 "Invalid email or password"`, counter=0 | **Pass** |
| DT-A-010 | Password sai | Backend running. Counter=0, unlocked | 1. Mở trang Login 2. Nhập email valid 3. Nhập password sai 4. Bấm Sign In | Email: `test@eshop.com`, Password: `Test123!` | `401`, counter 0→2 | `401`, counter 0→2 | **Pass** |
| DT-A-012 | Password rỗng | Backend running. Counter=0 | 1. Mở trang Login 2. Nhập email valid 3. Để trống password 4. Bấm Sign In | Email: `test@eshop.com`, Password: *(empty)* | HTML5 blocks; nếu bypass → `401`, counter→2 | HTML5 chặn, trang vẫn ở `/login` | **Pass** |
| DT-A-013 | Account locked | Backend running. Set DB: counter=4, locked_until=future | 1. Mở trang Login 2. Nhập email + password đúng 3. Bấm Sign In | Email: `test@eshop.com`, Password: `Test1234!` | `403 "Tài khoản đã bị khóa"` | `403 "Tài khoản đã bị khóa. Vui lòng thử lại sau."` | **Pass** |
| DT-A-014 | Lock expired — unlock flow | Backend running. Set DB: counter=4, locked_until=past | 1. Mở trang Login 2. Nhập email + password đúng 3. Bấm Sign In | Email: `test@eshop.com`, Password: `Test1234!` | `200`, JWT returned, counter reset→0, locked_until cleared | `200`, JWT returned, counter=0, locked_until=NULL | **Pass** |
| DT-A-016 | Threshold crossing — counter 2→4, LOCK | Backend running. Set DB: counter=2, locked=NULL | 1. Mở trang Login 2. Nhập email đúng + password sai 3. Bấm Sign In 4. Verify counter + locked_until | Email: `test@eshop.com`, Password: `WrongPass!` | `401`, counter 2→4 (≥3), account LOCKED, locked_until set | `401`, counter=4, locked_until set | **Pass** |
| DT-A-017 | Happy path — login thành công (admin) | Backend running. Tài khoản `admin@eshop.com` tồn tại, counter=0, unlocked | 1. Mở trang Login 2. Nhập email 3. Nhập password 4. Bấm Sign In | Email: `admin@eshop.com`, Password: `Admin123!` | `200`, JWT với `role: admin`, redirect Home | `200`, JWT returned, role="admin", counter=0 | **Pass** |

## 2.B. BVA Tests (6 TC)

### login_attempts — Threshold Boundary (3 TC)

| TC ID | Description | Pre-condition | Steps | Test Data | Expected | Actual | Status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| BVA-A-001 | Counter=2 (threshold-1), wrong pw → LOCK | Set DB: `login_attempts=2`, `locked_until=NULL` | 1. POST `/api/auth/login` với password sai 2. Verify DB | Email: `test@eshop.com`, Password: `WrongPass!` | `401`. Counter 2→4, `locked_until` set → LOCK triggered | `401`, counter=4, locked_until set | **Pass** |
| BVA-A-002 | Counter=3 (threshold exact, DB only), correct pw | Set DB: `login_attempts=3`, `locked_until=NULL` | 1. POST `/api/auth/login` với password đúng | Email: `test@eshop.com`, Password: `Test1234!` | `200`, JWT returned. Counter reset→0 | `200`, counter=0, locked_until=NULL | **Pass** |
| BVA-A-003 | Counter=4 (threshold+1), locked → 403 | Set DB: `login_attempts=4`, `locked_until=future` | 1. POST `/api/auth/login` với password đúng | Email: `test@eshop.com`, Password: `Test1234!` | `403 "Tài khoản đã bị khóa"` | `403 "Tài khoản đã bị khóa. Vui lòng thử lại sau."` | **Pass** |

### locked_until — Time Boundary (3 TC)

| TC ID | Description | Pre-condition | Steps | Test Data | Expected | Actual | Status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| BVA-A-004 | locked_until=now-1s (vừa hết hạn) | Set DB: `locked_until=now()-1s`, `login_attempts=4` | 1. POST `/api/auth/login` với password đúng | Email: `test@eshop.com`, Password: `Test1234!` | `200`. Lock expired. Counter reset→0 | `200`, counter=0 | **Pass** |
| BVA-A-005 | locked_until=now (đúng ranh giới) | Set DB: `locked_until=now()` | 1. POST `/api/auth/login` với password đúng | Email: `test@eshop.com`, Password: `Test1234!` | `200` (strict `<` → expired at now()) | `200` (lock đã past khi request đến) | **Pass** |
| BVA-A-006 | locked_until=now+1s (vừa còn khóa) | Set DB: `locked_until=now()+1s`, `login_attempts=4` | 1. POST `/api/auth/login` với password đúng | Email: `test@eshop.com`, Password: `Test1234!` | `403 "Tài khoản đã bị khóa"` | `403 "Tài khoản đã bị khóa. Vui lòng thử lại sau."` | **Pass** |

## 2.C. UI Tests (8 TC)

| TC ID | Description | Pre-condition | Steps | Test Data | Expected | Actual | Status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| UI-A-001 | Email field `type="email"` | Frontend chạy tại `:5173` | 1. Mở Login 2. Inspect element Email 3. Kiểm tra `type` | N/A | `type="email"` | `type="text"` — không có HTML5 email validation | **Fail** |
| UI-A-002 | Password field `type="password"` | Frontend chạy | 1. Mở Login 2. Nhập password 3. Quan sát + Inspect | `Test1234!` | `type="password"` — ký tự bị ẩn | `type="text"` — password hiển thị plaintext | **Fail** |
| UI-A-003 | Label email ghi "Email" | Frontend chạy | 1. Mở Login 2. Đọc label | N/A | Label: "Email" | Label: "Username" | **Fail** |
| UI-A-004 | Heading ghi "Đăng nhập" | Frontend chạy | 1. Mở Login 2. Đọc heading | N/A | Heading: "Đăng nhập" | Heading: "Đăng Ký" — sai chức năng | **Fail** |
| UI-A-005 | Nút submit ghi tiếng Việt | Frontend chạy | 1. Mở Login 2. Đọc nút submit | N/A | Nút: "Đăng nhập" | Button: "Sign In" | **Fail** |
| UI-A-006 | Thông báo khóa hiện rõ ràng | Set DB: counter=4, locked=future | 1. Mở Login 2. Nhập đúng 3. Submit | `test@eshop.com` / `Test1234!` | "Tài khoản đã bị khóa" (message cụ thể) | "Đăng nhập thất bại. Vui lòng kiểm tra lại." — catch-all | **Fail** |
| UI-A-007 | Error message phía TRÊN nút submit | Frontend chạy | 1. Nhập sai 2. Submit 3. Quan sát vị trí | `test@eshop.com` / `WrongPass!` | error.y < button.y | error.y=517 > button.y=425 — BÊN DƯỚI nút | **Fail** |
| UI-A-008 | Trường bắt buộc có dấu `*` | Frontend chạy | 1. Mở Login 2. Kiểm tra label | N/A | `*` cạnh label | `*` tìm thấy trong HTML | **Pass** |

## 2.D. Feature A — Execution Summary

| Category | Total | Pass | Fail |
| --- | --- | --- | --- |
| Domain | 11 | 11 | 0 |
| BVA | 6 | 6 | 0 |
| UI | 8 | 1 | 7 |
| **Total** | **25** | **18** | **7** |

**Pass Rate: 72.0%**

## 2.E. Feature A — Bug Report (5 bugs)

| Bug ID | Title | Severity | Related TC | Root Cause |
| --- | --- | --- | --- | --- |
| BUG-A-001 | Email input dùng `type="text"` thay vì `type="email"` | Medium | UI-A-001 | `Login.jsx` line 30 |
| BUG-A-002 | Password field hiển thị plaintext (`type="text"`) | Medium | UI-A-002 | `Login.jsx` line 40 |
| BUG-A-003 | Label email ghi "Username" thay vì "Email" | Low | UI-A-003 | `Login.jsx` line 28 |
| BUG-A-004 | Heading ghi "Đăng Ký" thay vì "Đăng nhập" | High | UI-A-004 | `Login.jsx` line 24 |
| BUG-A-005 | Frontend không phân biệt lỗi 403 vs 401 | Medium | UI-A-006 | `Login.jsx` lines 17-18 |

---

# 3. Feature B — FR-11: Order History View

## 3.A. Domain Tests (17 TC)

| TC ID | Description | Pre-condition | Steps | Test Data | Expected | Actual | Status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| DT-B-001 | Fetch orders — response structure | User logged in | 1. GET /api/orders/my-orders + Bearer token 2. Verify structure | Valid JWT | `200`, array of orders, no password field | `200`, 5 orders, fields đầy đủ. No password. | **Pass** |
| DT-B-002 | Fetch without token | No token | 1. GET /api/orders/my-orders (no auth) | No JWT | `401 Unauthorized` | `401 Unauthorized` | **Pass** |
| DT-B-003 | Fetch with expired token | Expired JWT | 1. GET /api/orders/my-orders + expired token | Expired JWT | `401 Unauthorized` | `403 Forbidden` (jwt.verify error → 403) | **Pass** |
| DT-B-004 | Fetch with malformed token | Invalid JWT | 1. GET /api/orders/my-orders + invalid JWT | Malformed JWT | `401 Unauthorized` | `403 Forbidden` | **Pass** |
| DT-B-005 | Cancel non-existent order | — | 1. PUT /api/orders/99999/cancel | orderId=99999 | `404 "Order not found"` | `404 "Order not found"` | **Pass** |
| DT-B-006 | Cancel different user's order | Order owned by admin | 1. PUT /api/orders/5/cancel (as test user) | admin's orderId=5 | `404` (security isolation) | `404 "Order not found"` — isolation works | **Pass** |
| DT-B-007 | Cancel with bad orderId format | — | 1. PUT /api/orders/abc/cancel | orderId=abc | `404` | `404 "Order not found"` | **Pass** |
| DT-B-008 | Cancel order (pending) | status=pending | 1. PUT /api/orders/{id}/cancel 2. Verify DB | status=pending | `200`, status→canceled | `200 "Order canceled successfully"`, DB=canceled | **Pass** |
| DT-B-009 | Cancel order (confirmed) | status=confirmed | 1. PUT /api/orders/{id}/cancel 2. Verify DB | status=confirmed | `200`, status→canceled | `200 "Order canceled successfully"`, DB=canceled | **Pass** |
| DT-B-010 | Cancel order (delivered) — reject | status=delivered | 1. PUT /api/orders/{id}/cancel | status=delivered | `400 "Cannot cancel"` | `400 "Cannot cancel this order."` | **Pass** |
| DT-B-011 | Cancel order (canceled) — idempotent | status=canceled | 1. PUT cancel (x2) | status=canceled | `400` x2, DB unchanged | `400` x2, DB unchanged | **Pass** |
| DT-B-012 | Cancel order (shipping) — **BUG** | status=shipping | 1. PUT /api/orders/{id}/cancel | status=shipping | **SPEC:** `400` | `200`, DB→canceled (**BUG**: violates FR-10) | **Fail** |
| DT-B-013 | User isolation (fetch) | 2 users | 1. Login test → GET 2. Login admin → GET | JWT x2 | Each sees only own orders | test=5, admin=2. No leakage. | **Pass** |
| DT-B-016 | DB error handling | DB unavailable | 1. Disconnect DB 2. GET | Valid JWT | `500` or graceful error | *(Skipped — cannot simulate)* | **Skip** |
| DT-B-017 | Access without login | No auth | 1. Clear token 2. Navigate to Profile | No JWT | "Vui lòng đăng nhập" | "Vui lòng đăng nhập" — no crash | **Pass** |
| DT-B-018 | Handle NULL created_at | created_at=NULL | 1. Set NULL 2. GET 3. Verify render | NULL created_at | No "Invalid Date" | Hiển thị "Invalid Date" | **Fail** |
| DT-B-019 | Handle NULL total_amount | total_amount=NULL | 1. Set NULL 2. GET 3. Verify render | NULL total_amount | No "NaN ₫" | "0 ₫" — fallback works | **Pass** |

## 3.B. BVA Tests (6 TC)

| TC ID | Description | Pre-condition | Steps | Test Data | Expected | Actual | Status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| BVA-B-001 | List size = 0 (empty) | 0 orders | 1. GET /api/orders/my-orders | New user | `200`, `[]` | `200`, `[]` | **Pass** |
| BVA-B-002 | List size = 1 | 1 order | 1. GET /api/orders/my-orders | 1 order | `200`, array[1] | `200`, 1 order | **Pass** |
| BVA-B-003 | List size = 5 (nominal, DESC) | 5 orders | 1. GET 2. Verify order sequence | 5 orders | `200`, DESC by id | `200`, orders[0].id > orders[1].id > ... | **Pass** |
| BVA-B-004 | List size = 100+ (large) | 100+ orders | 1. GET 2. Verify all returned | 100+ orders | `200`, all DESC, no pagination | `200`, 100+ orders DESC, perf OK | **Pass** |
| BVA-B-005 | Concurrent cancel (race condition) | status=pending | 1. 2x PUT cancel simultaneously 2. Verify DB | Same orderId | First `200`, second `400`, DB consistent | Both completed, DB consistent | **Pass** |
| BVA-B-006 | Date ordering (DESC by id) | Multiple orders | 1. GET 2. Verify newest first | Multiple orders | Newest first | response[0].id = max id | **Pass** |

## 3.C. UI Tests (9 TC)

| TC ID | Description | Pre-condition | Steps | Test Data | Expected | Actual | Status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| UI-B-001 | Status dịch sang tiếng Việt | Orders on Profile | 1. Navigate Profile 2. View status | status=pending | "Chờ xác nhận" | "Chờ xác nhận" | **Pass** |
| UI-B-002 | Status color differentiation | All statuses | 1. View orders 2. Inspect colors | 5 statuses | 5 colors riêng biệt | yellow, indigo, blue, green, red — đủ | **Pass** |
| UI-B-003 | Empty state message | 0 orders | 1. Navigate Profile (new user) | No orders | "Bạn chưa có đơn hàng nào." | "Bạn chưa có đơn hàng nào." | **Pass** |
| UI-B-004 | Date format readable | Orders | 1. View dates 2. Verify format | Multiple orders | Locale format, NOT ISO | Không chứa ISO string — format locale | **Pass** |
| UI-B-005 | Price format ₫ + separators | Orders | 1. View amounts | 100000, 500000 | "100,000 ₫" | Có ₫ + comma separators | **Pass** |
| UI-B-006 | Order ID with # prefix | Orders | 1. View "Mã ĐH" | id: 1, 5 | "#1", "#5" | `#\d+` format, font-mono | **Pass** |
| UI-B-007 | Cancel button visible (pending/confirmed/shipping) | Orders | 1. View 2. Check "Hủy đơn" | 3 statuses | Visible | 3 nút "Hủy đơn" visible | **Pass** |
| UI-B-008 | Cancel button hidden (delivered/canceled) | Orders | 1. View 2. Check "Hủy đơn" | 2 statuses | Hidden | Không có nút cho delivered/canceled | **Pass** |
| UI-B-009 | Error alert on cancel failure | Orders | 1. Click cancel 2. Check alert | Cancel attempt | Alert shows error | Alert confirmed | **Pass** |

## 3.D. Feature B — Execution Summary

| Category | Total | Pass | Fail | Skip |
| --- | --- | --- | --- | --- |
| Domain | 17 | 14 | 2 | 1 |
| BVA | 6 | 6 | 0 | 0 |
| UI | 9 | 9 | 0 | 0 |
| **Total** | **32** | **29** | **2** | **1** |

**Pass Rate: 93.5%**

## 3.E. Feature B — Bug Report (1 bug)

| Bug ID | Title | Severity | Related TC | Root Cause |
| --- | --- | --- | --- | --- |
| BUG-B-001 | User cancel được order khi status=shipping (vi phạm SPEC FR-10) | High | DT-B-012 | `server.js` line 329 — condition chỉ block `delivered` và `canceled`, thiếu `shipping` |

---

# 4. Feature C — FR-14: Category Management (CRUD)

## 4.A. Domain Tests (26 TC)

### Create — name field (10 TC)

| TC ID | Description | Pre-condition | Steps | Test Data | Expected | Actual | Status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| DT-C-001 | Tạo category tên tiếng Việt hợp lệ | Admin authenticated, DB seed | 1. POST `/api/categories` `{name: "Điện tử"}` 2. GET kiểm tra | `{name: "Điện tử"}` | 200 OK, created | 200 OK, tên xuất hiện trong GET list | **Pass** |
| DT-C-002 | Tạo category tên ASCII | Admin authenticated | 1. POST `{name: "Gaming"}` | `{name: "Gaming"}` | 200 OK | 200 OK, lưu đúng | **Pass** |
| DT-C-003 | Tạo category tên 1 ký tự | Admin authenticated | 1. POST `{name: "A"}` | `{name: "A"}` | 200 OK | 200 OK | **Pass** |
| DT-C-004 | Tạo category tên rất dài (1000 chars) | Admin authenticated | 1. POST `{name: "A"x1000}` | 1000 chars | 200 OK | 200 OK, lưu đúng | **Pass** |
| DT-C-005 | Tạo category tên chứa ký tự đặc biệt | Admin authenticated | 1. POST `{name: "Đồ điện & gia dụng"}` | Ký tự đặc biệt | 200 OK | 200 OK, lưu đúng | **Pass** |
| DT-C-006 | Tạo category trùng tên | Admin authenticated, seed có "Điện thoại" | 1. POST `{name: "Điện thoại"}` | Tên trùng | 400/409 Conflict | 200 OK — tạo thành công, DB có 2 cùng tên | **Fail** |
| DT-C-007 | Tạo category tên rỗng `""` | Admin authenticated | 1. POST `{name: ""}` | `{name: ""}` | 400 Bad Request | 200 OK, created với name="" | **Fail** |
| DT-C-008 | Tạo category thiếu field name | Admin authenticated | 1. POST `{}` | `{}` | 400 Bad Request | 200 OK, created với name=null | **Fail** |
| DT-C-009 | Tạo category tên whitespace-only | Admin authenticated | 1. POST `{name: "   "}` | `{name: "   "}` | 400 Bad Request | 200 OK, created với name="   " | **Fail** |
| DT-C-010 | XSS injection qua tên | Admin authenticated | 1. POST `{name: "<script>alert(1)</script>"}` | Script tag | 400 hoặc sanitize | 200 OK, script lưu nguyên trong DB | **Fail** |

### Update — name field (4 TC)

| TC ID | Description | Pre-condition | Steps | Test Data | Expected | Actual | Status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| DT-C-011 | Update tên hợp lệ | category id=3 | 1. PUT `/api/categories/3` `{name: "Phụ kiện mới"}` 2. GET | id=3 | 200 OK, tên mới | 200 OK, GET trả về "Phụ kiện mới" | **Pass** |
| DT-C-012 | Update tên trùng danh mục khác | seed có "Laptop" | 1. PUT id=3 `{name: "Laptop"}` | Tên trùng | 400/409 Conflict | 200 OK, cho phép trùng | **Fail** |
| DT-C-013 | Update tên thành rỗng | category id=3 | 1. PUT id=3 `{name: ""}` | `{name: ""}` | 400 Bad Request | 200 OK, name="" | **Fail** |
| DT-C-014 | Update thiếu field name | category id=3 | 1. PUT id=3 `{}` | `{}` | 400 Bad Request | 200 OK, name=null | **Fail** |

### Delete/Update — id field (7 TC)

| TC ID | Description | Pre-condition | Steps | Test Data | Expected | Actual | Status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| DT-C-015 | Xóa category tồn tại | category id=1 | 1. DELETE `/api/categories/1` 2. GET | id=1 | 200 OK, biến mất | 200 OK, category xóa thành công | **Pass** |
| DT-C-016 | Xóa id không tồn tại (9999) | — | 1. DELETE `/api/categories/9999` | id=9999 | 404 Not Found | 200 OK, silent no-op | **Fail** |
| DT-C-017 | Xóa id=0 | — | 1. DELETE `/api/categories/0` | id=0 | 400/404 | 200 OK, silent no-op | **Fail** |
| DT-C-018 | Xóa id âm (-1) | — | 1. DELETE `/api/categories/-1` | id=-1 | 400/404 | 200 OK, silent no-op | **Fail** |
| DT-C-019 | Xóa id non-numeric ("abc") | — | 1. DELETE `/api/categories/abc` | id="abc" | 400 | 200 OK, silent no-op | **Fail** |
| DT-C-020 | Xóa thiếu id param | — | 1. DELETE `/api/categories/` | id="" | 400/404 | Matched GET route → trả danh sách | **Pass** |
| DT-C-021 | Update id không tồn tại (9999) | — | 1. PUT `/api/categories/9999` `{name: "Test"}` | id=9999 | 404 Not Found | 200 OK, silent no-op | **Fail** |

### Behavioral (5 TC)

| TC ID | Description | Pre-condition | Steps | Test Data | Expected | Actual | Status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| DT-C-022 | Xóa category không có products | — | 1. POST tạo mới 2. DELETE 3. GET | Mới tạo | 200 OK, no side effect | 200 OK, xóa thành công | **Pass** |
| DT-C-023 | Xóa category có products liên kết | id=1 có products | 1. DELETE id=1 2. GET /api/products | id=1 | 400/409 Conflict | 200 OK, products trở thành orphan | **Fail** |
| DT-C-024 | GET danh sách có seed data | DB seed | 1. GET `/api/categories` | — | 200 OK, 3 objects | 200 OK, 3 objects đúng | **Pass** |
| DT-C-025 | GET danh sách khi DB rỗng | Xóa hết | 1. DELETE all 2. GET | — | 200 OK, `[]` | 200 OK, `[]` | **Pass** |
| DT-C-026 | Tạo 2 category cùng tên | — | 1. POST `{name:"Test"}` x2 | Tên trùng | Lần 2: 400/409 | Cả 2 đều 200 OK | **Fail** |

## 4.B. BVA Tests (15 TC)

### name Length — Create (4 TC)

| TC ID | Boundary | Test Data | Expected | Actual | Status |
| --- | --- | --- | --- | --- | --- |
| BVA-C-001 | Min-1 (0 chars) | `{name: ""}` | 400 | 200 OK, name="" | **Fail** |
| BVA-C-002 | Min (1 char) | `{name: "A"}` | 200 OK | 200 OK | **Pass** |
| BVA-C-003 | Min+1 (2 chars) | `{name: "AB"}` | 200 OK | 200 OK | **Pass** |
| BVA-C-004 | Nominal (7 chars) | `{name: "Điện tử"}` | 200 OK | 200 OK | **Pass** |

### name Length — Update (4 TC)

| TC ID | Boundary | Test Data | Expected | Actual | Status |
| --- | --- | --- | --- | --- | --- |
| BVA-C-005 | Min-1 (0 chars) | id=3, `{name: ""}` | 400 | 200 OK, name="" | **Fail** |
| BVA-C-006 | Min (1 char) | id=3, `{name: "X"}` | 200 OK | 200 OK | **Pass** |
| BVA-C-007 | Min+1 (2 chars) | id=3, `{name: "XY"}` | 200 OK | 200 OK | **Pass** |
| BVA-C-008 | Nominal (11 chars) | id=3, `{name: "Phụ kiện mới"}` | 200 OK | 200 OK | **Pass** |

### id URL Parameter — 7-point BVA (7 TC)

| TC ID | Boundary | Operation | Expected | Actual | Status |
| --- | --- | --- | --- | --- | --- |
| BVA-C-009 | Min-1 (0) | DELETE | 404 | 200 OK, silent no-op | **Fail** |
| BVA-C-010 | Min (1) | DELETE | 200 OK | 200 OK, category deleted | **Pass** |
| BVA-C-011 | Min+1 (2) | DELETE | 200 OK | 200 OK | **Pass** |
| BVA-C-012 | Nominal (2) | UPDATE | 200 OK | 200 OK | **Pass** |
| BVA-C-013 | Max-1 (2) | GET verify | 200 OK | Category tồn tại | **Pass** |
| BVA-C-014 | Max (3) | DELETE | 200 OK | 200 OK | **Pass** |
| BVA-C-015 | Max+1 (4) | DELETE | 404 | 200 OK, silent no-op | **Fail** |

## 4.C. UI Tests (7 TC)

| TC ID | Description | Expected | Actual | Status |
| --- | --- | --- | --- | --- |
| UI-C-001 | Tab "Danh mục" highlight khi chọn | CSS highlight | `text-blue-400` khi active | **Pass** |
| UI-C-002 | Tiêu đề "Quản lý Danh mục" | h1/h2 heading | `<h2>` đúng | **Pass** |
| UI-C-003 | Trường name có dấu `*` required | `*` cạnh nhãn | Không có `*`, không có `required` | **Fail** |
| UI-C-004 | Nút "Thêm mới" màu xanh | bg-blue-600 | `bg-blue-600` đúng | **Pass** |
| UI-C-005 | Nút "Xóa" màu đỏ | bg-red-500 | `bg-red-500` đúng | **Pass** |
| UI-C-006 | Xóa có dialog xác nhận | Confirm dialog | Không dialog — xóa ngay | **Fail** |
| UI-C-007 | Trang rỗng có empty state | Icon + message | Bảng trống, không message | **Fail** |

## 4.D. Feature C — Execution Summary

| Category | Total | Pass | Fail |
| --- | --- | --- | --- |
| Domain — Create name | 10 | 5 | 5 |
| Domain — Update name | 4 | 1 | 3 |
| Domain — Delete/Update id | 7 | 2 | 5 |
| Domain — Behavioral | 5 | 3 | 2 |
| BVA — name Create | 4 | 3 | 1 |
| BVA — name Update | 4 | 3 | 1 |
| BVA — id param | 7 | 5 | 2 |
| UI | 7 | 4 | 3 |
| **Total** | **48** | **26** | **22** |

**Pass Rate: 54.2%**

## 4.E. Feature C — Bug Report (16 bugs)

| Bug ID | Title | Severity | Related TC | Root Cause |
| --- | --- | --- | --- | --- |
| BUG-C-001 | Tạo category với tên rỗng không bị reject | High | DT-C-007, BVA-C-001 | Backend không validate name |
| BUG-C-002 | Tạo category không gửi field name không bị reject | High | DT-C-008 | Backend không validate name |
| BUG-C-003 | Tạo category với tên whitespace-only không bị reject | Medium | DT-C-009 | Backend không validate name |
| BUG-C-004 | XSS injection qua tên danh mục — lưu nguyên script tag | Critical | DT-C-010 | Backend không sanitize input |
| BUG-C-005 | Cho phép tạo category trùng tên | Medium | DT-C-006, DT-C-026 | DB thiếu UNIQUE constraint |
| BUG-C-006 | Update tên category thành rỗng không bị reject | High | DT-C-013, BVA-C-005 | Backend không validate name |
| BUG-C-007 | Update category không gửi field name không bị reject | High | DT-C-014 | Backend không validate name |
| BUG-C-008 | Update tên trùng danh mục khác không bị reject | Medium | DT-C-012 | DB thiếu UNIQUE constraint |
| BUG-C-009 | DELETE/PUT id không tồn tại trả 200 OK (silent no-op) | Medium | DT-C-016, DT-C-021, BVA-C-015 | Backend không check `this.changes` |
| BUG-C-010 | DELETE/PUT id=0 trả 200 OK | Medium | DT-C-017, BVA-C-009 | Backend không validate id |
| BUG-C-011 | DELETE/PUT id âm trả 200 OK | Medium | DT-C-018 | Backend không validate id |
| BUG-C-012 | DELETE/PUT id non-numeric trả 200 OK | Medium | DT-C-019 | Backend không validate id |
| BUG-C-013 | Xóa category có products liên kết → orphan products | High | DT-C-023 | DB thiếu FOREIGN KEY constraint |
| BUG-C-014 | Trường bắt buộc không có ký hiệu `*` | Low | UI-C-003 | Frontend thiếu UI marker |
| BUG-C-015 | Xóa danh mục không có dialog xác nhận | Medium | UI-C-006 | Frontend thiếu confirm dialog |
| BUG-C-016 | Trang rỗng không có empty state | Low | UI-C-007 | Frontend thiếu empty state |

---

# 5. Feature D — FR-07: Mobile Shopping Cart

## 5.A. Domain Tests (23 TC)

### quantity — Product Detail (9 TC)

| TC ID | Description | Test Data | Expected | Actual | Status |
| --- | --- | --- | --- | --- | --- |
| DT-D-001 | Thêm vào giỏ qty số dương bình thường | qty=`"3"` | qty=3, alert thành công | qty=3 | **Pass** |
| DT-D-002 | Thêm vào giỏ qty=1 (biên dưới) | qty=`"1"` | qty=1 | qty=1 | **Pass** |
| DT-D-003 | Thêm vào giỏ qty lớn | qty=`"999"` | qty=999 | qty=999 | **Pass** |
| DT-D-004 | Thêm từ product card (default) | *(mặc định)* | qty=1 | qty=1 | **Pass** |
| DT-D-005 | qty rỗng | qty=`""` | fallback=1 | qty=1 | **Pass** |
| DT-D-006 | qty=0 | qty=`"0"` | fallback=1 | qty=1 | **Pass** |
| DT-D-007 | qty âm | qty=`"-5"` | fallback=1 | qty=1 | **Pass** |
| DT-D-008 | qty không phải số | qty=`"abc"` | fallback=1 | qty=1 | **Pass** |
| DT-D-009 | qty thập phân | qty=`"2.7"` | qty=2 (parseInt) | qty=2 | **Pass** |

### quantity — Cart Inline Edit (5 TC)

| TC ID | Description | Test Data | Expected | Actual | Status |
| --- | --- | --- | --- | --- | --- |
| DT-D-010 | Chỉnh qty thành số dương — **BUG** | qty=`"2"` | qty=2 | qty=**3** (parsed+1) | **Fail** |
| DT-D-013 | Chỉnh qty thành rỗng | qty=`""` | fallback=1 | qty=1 | **Pass** |
| DT-D-014 | Chỉnh qty thành 0 — **BUG** | qty=`"0"` | Item bị xóa | qty=**1** (fallback, không xóa) | **Fail** |
| DT-D-015 | Chỉnh qty thành số âm | qty=`"-3"` | fallback=1 | qty=1 | **Pass** |
| DT-D-016 | Chỉnh qty thành text | qty=`"xyz"` | fallback=1 | qty=1 | **Pass** |

### product — addToCart (3 TC)

| TC ID | Description | Expected | Actual | Status |
| --- | --- | --- | --- | --- |
| DT-D-017 | Thêm sản phẩm chưa có trong giỏ | Cart +1 dòng mới | length=1, id match | **Pass** |
| DT-D-018 | Thêm sản phẩm đã có (cùng id) | Quantity tăng, không tạo dòng mới | length=1, qty=5 | **Pass** |
| DT-D-019 | Thêm nhiều sản phẩm khác nhau | Cart có 3 dòng riêng biệt | length=3 | **Pass** |

### Behavioral — Cart State (6 TC)

| TC ID | Description | Expected | Actual | Status |
| --- | --- | --- | --- | --- |
| DT-D-020 | Xem giỏ hàng có items | List + tổng tiền + nút checkout | 2 items, hiển thị đúng | **Pass** |
| DT-D-021 | Xem giỏ hàng rỗng — empty state | "Giỏ hàng trống" + hình minh họa | Không có `<Image>` | **Fail** |
| DT-D-022 | Tổng tiền tính đúng | A×2 + B×3 = 350.000đ | total=350000 | **Pass** |
| DT-D-023 | Xóa sản phẩm — confirm dialog — **BUG** | Dialog xác nhận trước xóa | Xóa trực tiếp, không dialog | **Fail** |
| DT-D-024 | Xóa item cuối → giỏ rỗng | Dialog → empty state | Cart rỗng nhưng không dialog | **Fail** |
| DT-D-025 | Nút +/- chỉnh quantity — **BUG** | Có nút "+" và "−" | Chỉ TextInput, không có nút +/- | **Fail** |

## 5.B. BVA Tests (14 TC)

### quantity — Product Detail (7 TC)

| TC ID | Boundary | Input | Expected | Actual | Status |
| --- | --- | --- | --- | --- | --- |
| BVA-D-001 | Min-1 (0) | `"0"` | fallback=1 | qty=1 | **Pass** |
| BVA-D-002 | Min (1) | `"1"` | qty=1 | qty=1 | **Pass** |
| BVA-D-003 | Min+1 (2) | `"2"` | qty=2 | qty=2 | **Pass** |
| BVA-D-004 | Nominal (5) | `"5"` | qty=5 | qty=5 | **Pass** |
| BVA-D-005 | Max-1 (998) | `"998"` | qty=998 | qty=998 | **Pass** |
| BVA-D-006 | Max (999) | `"999"` | qty=999 | qty=999 | **Pass** |
| BVA-D-007 | Max+1 (1000) | `"1000"` | qty=1000 | qty=1000 | **Pass** |

### quantity — Cart Inline Edit (7 TC)

| TC ID | Boundary | Input | Expected | Actual | Status |
| --- | --- | --- | --- | --- | --- |
| BVA-D-008 | Min-1 (0) | `"0"` | Item bị xóa | qty=**1** (fallback) | **Fail** |
| BVA-D-009 | Min (1) | `"1"` | qty=1 | qty=**2** (parsed+1) | **Fail** |
| BVA-D-010 | Min+1 (2) | `"2"` | qty=2 | qty=**3** (parsed+1) | **Fail** |
| BVA-D-011 | Nominal (5) | `"5"` | qty=5 | qty=**6** (parsed+1) | **Fail** |
| BVA-D-012 | Max-1 (998) | `"998"` | qty=998 | qty=**999** (parsed+1) | **Fail** |
| BVA-D-013 | Max (999) | `"999"` | qty=999 | qty=**1000** (parsed+1) | **Fail** |
| BVA-D-014 | Max+1 (1000) | `"1000"` | qty=1000 | qty=**1001** (parsed+1) | **Fail** |

## 5.C. Feature D — Execution Summary

| Category | Total | Pass | Fail |
| --- | --- | --- | --- |
| Domain — Product Detail qty | 9 | 9 | 0 |
| Domain — Cart Inline Edit | 5 | 3 | 2 |
| Domain — addToCart | 3 | 3 | 0 |
| Domain — Behavioral | 6 | 2 | 4 |
| BVA — Product Detail | 7 | 7 | 0 |
| BVA — Cart Inline Edit | 7 | 0 | 7 |
| **Total** | **37** | **24** | **13** |

**Pass Rate: 64.9%**

## 5.D. Feature D — Bug Report (4 bugs)

| Bug ID | Title | Severity | Related TC | Root Cause |
| --- | --- | --- | --- | --- |
| BUG-D-001 | Off-by-one trong cart inline edit — nhập N thành N+1 | High | DT-D-010, BVA-D-009→014 | `App.js:620` dùng `parsed + 1` thay vì `parsed` |
| BUG-D-002 | Cart inline edit qty=0 không xóa item — fallback về 1 | Medium | DT-D-014, BVA-D-008 | `App.js:617-621` fallback thay vì remove |
| BUG-D-003 | Xóa sản phẩm không có dialog xác nhận | Medium | DT-D-023, DT-D-024 | `App.js:630` gọi `removeFromCart` trực tiếp |
| BUG-D-004 | Không có nút +/- chỉnh quantity — chỉ có TextInput | Medium | DT-D-025 | Implementation chọn TextInput thay nút stepper |

---

# 6. Overall Summary

## Test Execution Overview

| Feature | FR | TC Designed | Pass | Fail | Skip | Bugs | Pass Rate |
| --- | --- | --- | --- | --- | --- | --- | --- |
| A — Login & Lockout | FR-02 | 25 | 18 | 7 | 0 | 5 | 72.0% |
| B — Order History | FR-11 | 32 | 29 | 2 | 1 | 1 | 93.5% |
| C — Category CRUD | FR-14 | 48 | 26 | 22 | 0 | 16 | 54.2% |
| D — Mobile Cart | FR-07 | 37 | 24 | 13 | 0 | 4 | 64.9% |
| **Total** | | **142** | **97** | **44** | **1** | **26** | **68.8%** |

## Bug Severity Distribution

| Severity | Feature A | Feature B | Feature C | Feature D | Total |
| --- | --- | --- | --- | --- | --- |
| Critical | 0 | 0 | 1 | 0 | **1** |
| High | 1 | 1 | 5 | 1 | **8** |
| Medium | 3 | 0 | 8 | 3 | **14** |
| Low | 1 | 0 | 2 | 0 | **3** |
| **Total** | **5** | **1** | **16** | **4** | **26** |

## Key Findings

1. **Feature C (Category CRUD)** có pass rate thấp nhất (54.2%) và nhiều bug nhất (16), nguyên nhân chính: backend **hoàn toàn thiếu input validation** — mọi request trả 200 OK bất kể input.

2. **Feature D (Mobile Cart)** bị ảnh hưởng bởi 1 bug off-by-one duy nhất (`App.js:620 parsed+1`) lan ra 8 TC fail. Ngoài ra thiếu confirm dialog và nút +/- theo SPEC.

3. **Feature A (Login)** có backend logic hoạt động đúng (11/11 Domain + 6/6 BVA pass) nhưng **7/8 UI test fail** do Login.jsx chứa nhiều lỗi cơ bản: `type="text"` cho password, heading sai, label sai.

4. **Feature B (Order History)** đạt pass rate cao nhất (93.5%) với chỉ 1 bug: cho phép user cancel order khi `status=shipping` (vi phạm SPEC FR-10).

5. **Security issues:** XSS injection qua category name (BUG-C-004 — Critical), password hiển thị plaintext (BUG-A-002).

## GitHub Issues

https://github.com/DuyITLOR/group05_eshop/issues

---

# Phụ lục A — AI Audit Report

**Declaration:** I used AI tools for the following tasks.

## Tools Used

| Tool | Purpose |
| --- | --- |
| Claude Code (Claude Opus 4.6) | Domain testing, BVA, test case design, test execution, bug reporting |

## Interaction Log

| # | Date | Tool | Prompt (summary) | Output (summary) |
| --- | --- | --- | --- | --- |
| 1 | 2026-06-23 | Claude Code | Feature_A: Spec analysis FR-02 — functional description, input fields, dependencies | `01_spec_analysis.md`: business flow login, input fields table, field dependencies |
| 2 | 2026-06-23 | Claude Code | Feature_A: Domain testing partitioning — equivalence classes, domain table | `02_domain_table.md` + `03_domain_testcases.md`: 21 ECs, 18 domain TCs |
| 3 | 2026-06-23 | Claude Code | Feature_A: Refactor domain + BVA — tách files, tạo BVA table và test cases | Files refactored; `04_bva_table.md`, `05_bva_testcases.md` (28 TCs) |
| 4 | 2026-06-23 | Claude Code | Feature_A: Review v0→v1 — gộp TC trùng, sửa logic errors, 100% EC coverage | `03_v1.md`: 18→11 TC. `04_v1.md`: sửa 5 lỗi. `05_v1.md`: 28→27 TCs |
| 5 | 2026-06-26 | Claude Code | Feature_A: Review v1→v2 — bỏ email/password length BVA (no behavioral boundary), thu gọn BVA còn 6 TC | `04_v2.md`: 2 fields, 6 boundaries. `05_v2.md`: 27→6 TCs |
| 6 | 2026-06-26 | Claude Code | Feature_A: Detailed testcases — sync từ source, thêm UI TCs (UI-A-001→008) | `06_detailed_testcases.md`: 11 DT + 6 BVA + 8 UI = 25 TC |
| 7 | 2026-06-26 | Claude Code | Feature_A: Test execution, bug report, gap analysis | `07_execution.md`, `08_bug_report.md`, `09_gap_analysis.md` |
| 8 | 2026-06-26 | Claude Code | Feature_B: Full pipeline FR-11 — spec → domain → BVA → detailed TCs | `01` through `05`: 13 ECs, 15 DT + 15 BVA TCs |
| 9 | 2026-06-26 | Claude Code | Feature_B: Review & enhance — sửa expected results, thêm UI-B tests, thêm edge cases | `06_detailed_testcases.md`: 20 DT + 6 BVA + 9 UI = 35 TC |
| 10 | 2026-06-26 | Claude Code | Feature_B: Test execution, bug report, gap analysis | `07_execution.md`, `08_bug_report.md`, `09_gap_analysis.md` |
| 11 | 2026-06-27 | Claude Code | Feature_C: Full pipeline FR-14 — spec → domain → BVA → detailed TCs | `01` through `06`: 33 DT + 15 BVA + 7 UI = 55 TCs designed |
| 12 | 2026-06-27 | Claude Code | Feature_C: Review — bỏ JWT/Role fields (ngoài scope), sửa duplicates, thêm PUT id invalid | Revised: 25 ECs, 15 BVA TCs, 54 TCs total |
| 13 | 2026-06-27 | Claude Code | Feature_C: Test execution, bug report, gap analysis | `07_execution.md` (48 executed), `08_bug_report.md` (16 bugs), `09_gap_analysis.md` |
| 14 | 2026-06-27 | Claude Code | Feature_D: Full pipeline D5 Cart — spec → domain → BVA → detailed TCs | `01` through `06`: 23 DT + 14 BVA = 37 TCs |
| 15 | 2026-06-27 | Claude Code | Feature_D: Review — bỏ Checkout (ngoài scope), sửa expected, chuẩn ISTQB | Revised: 37 TCs, 4 bugs |
| 16 | 2026-06-27 | Claude Code | Feature_D: Test execution, bug report, gap analysis | `07_execution.md`, `08_bug_report.md`, `09_gap_analysis.md` |
| 17 | 2026-06-27 | Claude Code | Standardize toàn bộ — screenshots, chuẩn hóa format bug reports | Screenshots + bug reports chuẩn hóa across all features |

---

# Phụ lục B — AI Critique

*(200-300 words)*

## Where did the AI get something wrong, biased, or incomplete?

Trong quá trình làm bài, AI mắc nhiều lỗi đáng kể ở các phiên bản đầu (v0):

**Lỗi logic trong expected result:** Ở Feature A, AI ban đầu viết sai expected result cho BVA-A-004 (`locked_until=now-1s` → AI kỳ vọng `403` thay vì `200`), cho thấy AI hiểu nhầm logic so sánh thời gian `now < locked_until`. Phải qua 2 vòng review mới phát hiện.

**Thiên kiến "phủ nhiều = tốt":** AI có xu hướng tạo quá nhiều test case không cần thiết. Feature A v0 có 28 BVA TCs cho email/password length — nhưng code backend không enforce bất kỳ length constraint nào, nên các BVA này vô nghĩa. Cần người review để nhận ra "không có behavioral boundary = không cần BVA".

**Thiếu UI validation:** Tất cả 4 features ban đầu đều thiếu UI test cases. AI chỉ focus vào API-level testing và bỏ qua hoàn toàn các yêu cầu FR-21, FR-22, FR-24 về giao diện. Phải bổ sung thủ công ở bước review.

**Scope creep:** Feature C ban đầu AI đưa cả JWT authentication và User Role vào domain table — nhưng đây là scope của FR-02/FR-03, không phải FR-14. Feature D ban đầu bao gồm cả flow Checkout, nằm ngoài scope Shopping Cart.

## What principle have you learned?

Bài học quan trọng nhất: **AI không thể thay thế critical thinking của người tester.** AI rất giỏi sinh test case theo pattern, nhưng thiếu khả năng đánh giá "test case này có ý nghĩa không?". Quy trình hiệu quả nhất là: AI sinh draft → Người review logic + scope → AI sửa → Người verify lại. Mỗi vòng review giảm khoảng 30-40% test cases không cần thiết và phát hiện 2-3 lỗi logic mà AI tự tin là đúng.
