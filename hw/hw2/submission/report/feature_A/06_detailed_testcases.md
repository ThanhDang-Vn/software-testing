# 06 — Detailed Test Cases (Domain + BVA): feature_A (FR-02)

> **Scope:** Gộp toàn bộ Domain Test Cases (DT-A) và BVA Test Cases (BVA-A) thành bảng chi tiết đầy đủ, sẵn sàng thực thi.

---

## A. Domain Test Cases — Chi tiết

| Test Case ID | Description | Pre-condition | Steps | Test Data | Expected Result | Actual Result | Status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| **DT-A-001** | Happy path — login thành công (user) | Backend running. Tài khoản `test@eshop.com` tồn tại, không bị khóa, counter=0 | 1. Mở trang Login 2. Nhập email 3. Nhập password 4. Bấm Sign In | Email: `test@eshop.com`, Password: `Test1234!` | `200`, JWT returned, counter reset=0, redirect Home | | |
| **DT-A-002** | Happy path — login thành công (admin) | Backend running. Tài khoản `admin@eshop.com` tồn tại, không bị khóa | 1. Mở trang Login 2. Nhập email 3. Nhập password 4. Bấm Sign In | Email: `admin@eshop.com`, Password: `Admin123!` | `200`, JWT với `role: admin`, redirect Home | | |
| **DT-A-003** | Email format sai — thiếu @ | Backend running | 1. Mở trang Login 2. Nhập email sai format 3. Nhập password valid 4. Bấm Sign In | Email: `testeshop.com`, Password: `Test1234!` | `401 "Invalid email or password"`, counter NOT incremented | | |
| **DT-A-004** | Email format sai — thiếu domain | Backend running | 1. Mở trang Login 2. Nhập email thiếu domain 3. Nhập password valid 4. Bấm Sign In | Email: `test@`, Password: `Test1234!` | `401`, counter NOT incremented | | |
| **DT-A-005** | Email rỗng | Backend running | 1. Mở trang Login 2. Để trống email 3. Nhập password valid 4. Bấm Sign In | Email: *(empty)*, Password: `Test1234!` | HTML5 `required` chặn submit; nếu bypass → `401` | | |
| **DT-A-006** | Email có whitespace | Backend running. Tài khoản `test@eshop.com` tồn tại | 1. Mở trang Login 2. Nhập email có space đầu/cuối 3. Nhập password valid 4. Bấm Sign In | Email: ` test@eshop.com `, Password: `Test1234!` | `401` (exact match fails, no trim), counter NOT incremented | | |
| **DT-A-007** | Email không tồn tại trong DB | Backend running | 1. Mở trang Login 2. Nhập email format valid nhưng không tồn tại 3. Nhập password 4. Bấm Sign In | Email: `unknown@eshop.com`, Password: `Test1234!` | `401`, counter NOT incremented (user not found) | | |
| **DT-A-008** | Email case mismatch | Backend running. Tài khoản `test@eshop.com` tồn tại | 1. Mở trang Login 2. Nhập email sai case 3. Nhập password valid 4. Bấm Sign In | Email: `Test@eshop.com`, Password: `Test1234!` | `401`, counter NOT incremented (case-sensitive lookup) | | |
| **DT-A-009** | Password đúng — exact match | Backend running. Tài khoản `test@eshop.com`, counter=0, unlocked | 1. Mở trang Login 2. Nhập email valid 3. Nhập password đúng 4. Bấm Sign In | Email: `test@eshop.com`, Password: `Test1234!` | `200`, JWT returned | | |
| **DT-A-010** | Password sai hoàn toàn | Backend running. Counter=0, unlocked | 1. Mở trang Login 2. Nhập email valid 3. Nhập password sai 4. Bấm Sign In | Email: `test@eshop.com`, Password: `WrongPass!` | `401`, counter 0 → 2 | | |
| **DT-A-011** | Password case mismatch | Backend running. Counter=0, unlocked | 1. Mở trang Login 2. Nhập email valid 3. Nhập password sai case 4. Bấm Sign In | Email: `test@eshop.com`, Password: `test1234!` | `401`, counter → 2 | | |
| **DT-A-012** | Password có trailing space | Backend running. Counter=0, unlocked | 1. Mở trang Login 2. Nhập email valid 3. Nhập password có space cuối 4. Bấm Sign In | Email: `test@eshop.com`, Password: `Test1234! ` | `401`, counter → 2 (no trim) | | |
| **DT-A-013** | Password rỗng | Backend running. Counter=0 | 1. Mở trang Login 2. Nhập email valid 3. Để trống password 4. Bấm Sign In | Email: `test@eshop.com`, Password: *(empty)* | HTML5 blocks; nếu bypass → `401`, counter → 2 | | |
| **DT-A-014** | State: counter=0, unlocked + đúng mật khẩu | Backend running. Reset DB: counter=0, locked=NULL | 1. Mở trang Login 2. Nhập email + password đúng 3. Bấm Sign In | Email: `test@eshop.com`, Password: `Test1234!` | `200`, counter remains 0 | | |
| **DT-A-015** | State: counter=2, approaching threshold + đúng mật khẩu | Backend running. Set DB: `login_attempts=2`, `locked_until=NULL` | 1. Mở trang Login 2. Nhập đúng 3. Bấm Sign In | Email: `test@eshop.com`, Password: `Test1234!` | `200`, counter reset 2 → 0 | | |
| **DT-A-016** | State: counter=4, crossed threshold + đúng mật khẩu | Backend running. Set DB: `login_attempts=4`, `locked_until=NULL` | 1. Mở trang Login 2. Nhập đúng 3. Bấm Sign In | Email: `test@eshop.com`, Password: `Test1234!` | `200`, counter reset 4 → 0 | | |
| **DT-A-017** | State: no lock (LU-V1) | Backend running. locked_until=NULL | 1. Login bình thường | Email: `test@eshop.com`, Password: `Test1234!` | `200` | | |
| **DT-A-018** | State: lock expired (LU-V2) | Backend running. Set DB: counter=4, `locked_until='2020-01-01'` | 1. Mở trang Login 2. Nhập đúng 3. Bấm Sign In | Email: `test@eshop.com`, Password: `Test1234!` | `200`, counter reset, lock cleared | | |
| **DT-A-019** | State: locked + correct password (priority) | Backend running. Set DB: counter=4, `locked_until=future` | 1. Mở trang Login 2. Nhập email + password đúng 3. Bấm Sign In | Email: `test@eshop.com`, Password: `Test1234!` | `403 "Tài khoản đã bị khóa"` (lock priority) | | |
| **DT-A-020** | State: locked + wrong password | Backend running. Set DB: counter=4, `locked_until=future` | 1. Mở trang Login 2. Nhập email đúng + password sai 3. Bấm Sign In | Email: `test@eshop.com`, Password: `WrongPass!` | `403` (lock checked before password) | | |
| **DT-A-021** | Lockout flow: first failure (0→2) | Backend running. Reset DB: counter=0, locked=NULL | 1. Mở trang Login 2. Nhập email đúng + password sai 3. Bấm Sign In 4. Verify counter in DB | Email: `test@eshop.com`, Password: `WrongPass!` | `401`, counter 0 → 2 | | |
| **DT-A-022** | Lockout flow: cross threshold (2→4, lock) | Backend running. Set DB: `login_attempts=2`, `locked_until=NULL` | 1. Mở trang Login 2. Nhập email đúng + password sai 3. Bấm Sign In 4. Verify counter + locked_until in DB | Email: `test@eshop.com`, Password: `WrongPass!` | `401`, counter 2 → 4 (≥3), `locked_until` set to now+180s | | |

---

## B. BVA Test Cases — Chi tiết

| Test Case ID | Description | Pre-condition | Steps | Test Data | Expected Result | Actual Result | Status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| **BVA-A-001** | Email length = 0 (empty) | Backend running | 1. Mở Login 2. Để trống email 3. Nhập password valid 4. Submit | Email: `` (0 chars), Password: `Test1234!` | HTML5 blocks; bypass → `401` | | |
| **BVA-A-002** | Email length = 3 (minimal valid format) | Backend running | 1. Mở Login 2. Nhập email 3 ký tự 3. Password valid 4. Submit | Email: `a@b` (3 chars), Password: `Test1234!` | `401` (not in DB), counter NOT incremented | | |
| **BVA-A-003** | Email length = 14 (nominal) | Backend running. Tài khoản test tồn tại | 1. Mở Login 2. Nhập email valid 3. Password đúng 4. Submit | Email: `test@eshop.com` (14 chars), Password: `Test1234!` | `200`, JWT returned | | |
| **BVA-A-004** | Email length = 319 (Max-1) | Backend running | 1. Mở Login 2. Nhập email 319 chars 3. Password valid 4. Submit | Email: `aaa...@aaa...` (319 chars), Password: `Test1234!` | `401` (not in DB) | | |
| **BVA-A-005** | Email length = 320 (Max, RFC limit) | Backend running | 1. Mở Login 2. Nhập email 320 chars 3. Password valid 4. Submit | Email: `aaa...@aaa...` (320 chars), Password: `Test1234!` | `401` (not in DB) | | |
| **BVA-A-006** | Email length = 321 (Max+1, overflow) | Backend running | 1. Mở Login 2. Nhập email 321 chars 3. Password valid 4. Submit | Email: `aaa...@aaa...` (321 chars), Password: `Test1234!` | `400` or `401` (overflow/truncate) | | |
| **BVA-A-007** | Password length = 0 (empty) | Backend running. Counter=0 | 1. Mở Login 2. Email valid 3. Để trống password 4. Submit | Email: `test@eshop.com`, Password: `` | `401`, counter → 2 | | |
| **BVA-A-008** | Password length = 1 | Backend running. Counter=0 | 1. Mở Login 2. Email valid 3. Password 1 char 4. Submit | Email: `test@eshop.com`, Password: `a` | `401`, counter → 2 | | |
| **BVA-A-009** | Password length = 9 (nominal) | Backend running. Counter=0 | 1. Mở Login 2. Email valid 3. Password đúng 4. Submit | Email: `test@eshop.com`, Password: `Test1234!` | `200` | | |
| **BVA-A-010** | Password length = 1000 (large) | Backend running. Counter=0 | 1. Mở Login 2. Email valid 3. Password 1000 chars 4. Submit | Email: `test@eshop.com`, Password: `aaaa...` (1000 chars) | `401`, counter → 2 | | |
| **BVA-A-011** | Password length = 1001 (overflow) | Backend running. Counter=0 | 1. Mở Login 2. Email valid 3. Password 1001 chars 4. Submit | Email: `test@eshop.com`, Password: `aaaa...` (1001 chars) | `401` or `500` (potential overflow) | | |
| **BVA-A-012** | Counter = 0 (min) | Backend running. Set DB: counter=0, locked=NULL | 1. Login với đúng email + password | Email: `test@eshop.com`, Password: `Test1234!` | `200`, counter stays 0 | | |
| **BVA-A-013** | Counter = 1 (min+1, internal) | Backend running. Set DB: counter=1, locked=NULL | 1. Login đúng | Email: `test@eshop.com`, Password: `Test1234!` | `200`, counter reset → 0 | | |
| **BVA-A-014** | Counter = 2 (threshold-1) | Backend running. Set DB: counter=2, locked=NULL | 1. Login sai password 2. Check counter in DB | Email: `test@eshop.com`, Password: `WrongPass!` | `401`, counter 2 → 4 (≥3), account LOCKED | | |
| **BVA-A-015** | Counter = 3 (exact threshold, never reached by code) | Backend running. Set DB: counter=3, locked=NULL | 1. Login đúng | Email: `test@eshop.com`, Password: `Test1234!` | `200`, counter reset → 0 (anomaly: code jumps 0→2→4, never hits 3) | | |
| **BVA-A-016** | Counter = 4 (threshold+1, locked) | Backend running. Set DB: counter=4, locked=future | 1. Login đúng 2. Verify response | Email: `test@eshop.com`, Password: `Test1234!` | `403 "Tài khoản đã bị khóa"` | | |
| **BVA-A-017** | Counter = 10 (large) | Backend running. Set DB: counter=10, locked=future | 1. Login bất kỳ | Email: `test@eshop.com`, Password: `Test1234!` | `403` | | |
| **BVA-A-018** | Counter = -1 (negative, corruption) | Backend running. Set DB: counter=-1, locked=NULL | 1. Login đúng | Email: `test@eshop.com`, Password: `Test1234!` | `200` (invalid state) | | |
| **BVA-A-019** | locked_until = NULL | Backend running. locked=NULL | 1. Login đúng | Email: `test@eshop.com`, Password: `Test1234!` | `200` | | |
| **BVA-A-020** | locked_until = far past | Backend running. Set DB: locked=`1970-01-01` | 1. Login đúng | Email: `test@eshop.com`, Password: `Test1234!` | `200` (expired) | | |
| **BVA-A-021** | locked_until = recent past | Backend running. Set DB: locked=`2020-01-01` | 1. Login đúng | Email: `test@eshop.com`, Password: `Test1234!` | `200` (expired) | | |
| **BVA-A-022** | locked_until = now-1s (just expired) | Backend running. Set DB: locked=`now()-1s` | 1. Login đúng (within 1s) | Email: `test@eshop.com`, Password: `Test1234!` | `200` (just expired, `now >= locked_until`) | | |
| **BVA-A-023** | locked_until = now() (boundary) | Backend running. Set DB: locked=`now()` | 1. Login đúng | Email: `test@eshop.com`, Password: `Test1234!` | `200` or `403` (timing-dependent edge case) | | |
| **BVA-A-024** | locked_until = now+1s (just locked) | Backend running. Set DB: locked=`now()+1s` | 1. Login đúng | Email: `test@eshop.com`, Password: `Test1234!` | `403` (still locked) | | |
| **BVA-A-025** | locked_until = far future | Backend running. Set DB: locked=`2099-12-31` | 1. Login đúng | Email: `test@eshop.com`, Password: `Test1234!` | `403` | | |
| **BVA-A-026** | Email Unicode (Vietnamese char) | Backend running | 1. Mở Login 2. Nhập email Unicode 3. Password valid 4. Submit | Email: `user@tëst.com`, Password: `Test1234!` | `401` (not in DB) | | |
| **BVA-A-027** | Email special chars (+ sign) | Backend running | 1. Mở Login 2. Nhập email với + 3. Password valid 4. Submit | Email: `user+tag@test.com`, Password: `Test1234!` | `401` (not in DB) | | |
| **BVA-A-028** | Password special chars | Backend running. Counter=0 | 1. Mở Login 2. Email valid 3. Password special chars 4. Submit | Email: `test@eshop.com`, Password: `Test@#$%^&!` | `401`, counter → 2 | | |

---

## Thống kê

| Nhóm | Số TC | ID Range |
| --- | --- | --- |
| Domain Testing | 22 | DT-A-001 → DT-A-022 |
| BVA — Email length | 6 | BVA-A-001 → BVA-A-006 |
| BVA — Password length | 5 | BVA-A-007 → BVA-A-011 |
| BVA — Counter numeric | 7 | BVA-A-012 → BVA-A-018 |
| BVA — Locked_until time | 7 | BVA-A-019 → BVA-A-025 |
| BVA — Special cases | 3 | BVA-A-026 → BVA-A-028 |
| **Tổng** | **50** | |

