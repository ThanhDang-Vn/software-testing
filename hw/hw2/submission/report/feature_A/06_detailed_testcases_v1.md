# 06 — Detailed Test Cases (Domain + BVA): feature_A (FR-02)

> **Scope:** Gộp toàn bộ Domain Test Cases (DT-A) từ `03_domain_testcases_v1.md` và BVA Test Cases (BVA-A) từ `05_bva_testcases_v1.md` thành bảng chi tiết đầy đủ, sẵn sàng thực thi.
>
> **Nguyên tắc:** Mỗi TC trong file này trace về đúng 1 TC trong source file. Không thêm TC mới.

---

## A. Domain Test Cases — Chi tiết (18 TC)

> Source: `03_domain_testcases_v1.md` — DT-A-001 → DT-A-018

| Test Case ID | Description | Pre-condition | Steps | Test Data | Expected Result | Actual Result | Status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| **DT-A-001** | Happy path — login thành công (user) | Backend running. Tài khoản `test@eshop.com` tồn tại, counter=0, locked=NULL | 1. Mở trang Login 2. Nhập email 3. Nhập password 4. Bấm Sign In | Email: `test@eshop.com`, Password: `Test1234!` | `200`, JWT returned, counter reset=0, redirect Home | | |
| **DT-A-002** | Email case mismatch (EC-E2) | Backend running. Tài khoản `test@eshop.com` tồn tại | 1. Mở trang Login 2. Nhập email sai case 3. Nhập password valid 4. Bấm Sign In | Email: `Test@eshop.com`, Password: `Test1234!` | `401 "Invalid email or password"`, counter NOT incremented (case-sensitive lookup) | | |
| **DT-A-003** | Email format sai — thiếu @ (EC-E3) | Backend running | 1. Mở trang Login 2. Nhập email sai format 3. Nhập password valid 4. Bấm Sign In | Email: `testeshop.com`, Password: `Test1234!` | `401 "Invalid email or password"`, counter NOT incremented | | |
| **DT-A-004** | Email format sai — thiếu domain (EC-E4) | Backend running | 1. Mở trang Login 2. Nhập email thiếu domain 3. Nhập password valid 4. Bấm Sign In | Email: `test@`, Password: `Test1234!` | `401 "Invalid email or password"`, counter NOT incremented | | |
| **DT-A-005** | Email rỗng (EC-E5) | Backend running | 1. Mở trang Login 2. Để trống email 3. Nhập password valid 4. Bấm Sign In | Email: *(empty)*, Password: `Test1234!` | HTML5 `required` chặn submit; nếu bypass → `401` | | |
| **DT-A-006** | Email quá dài (EC-E6) | Backend running | 1. Mở trang Login 2. Nhập email 1000+ ký tự 3. Nhập password valid 4. Bấm Sign In | Email: `aaaa...@test.com` (1000+ chars), Password: `Test1234!` | `401` hoặc `500` (potential DB overflow), counter NOT incremented | | |
| **DT-A-007** | Email có whitespace (EC-E7) | Backend running. Tài khoản `test@eshop.com` tồn tại | 1. Mở trang Login 2. Nhập email có space đầu/cuối 3. Nhập password valid 4. Bấm Sign In | Email: ` test@eshop.com `, Password: `Test1234!` | `401` (exact match fails, no trim), counter NOT incremented | | |
| **DT-A-008** | Email không tồn tại trong DB (EC-E8) | Backend running | 1. Mở trang Login 2. Nhập email format valid nhưng không tồn tại 3. Nhập password 4. Bấm Sign In | Email: `unknown@eshop.com`, Password: `Test1234!` | `401`, counter NOT incremented (user not found) | | |
| **DT-A-009** | Password case mismatch (EC-P2) | Backend running. Counter=0, unlocked | 1. Mở trang Login 2. Nhập email valid 3. Nhập password sai case 4. Bấm Sign In | Email: `test@eshop.com`, Password: `test1234!` | `401`, counter 0 → 2 | | |
| **DT-A-010** | Password thiếu ký tự (EC-P3) | Backend running. Counter=0, unlocked | 1. Mở trang Login 2. Nhập email valid 3. Nhập password thiếu char 4. Bấm Sign In | Email: `test@eshop.com`, Password: `Test123!` (thiếu `4`) | `401`, counter 0 → 2 | | |
| **DT-A-011** | Password có trailing space (EC-P4) | Backend running. Counter=0, unlocked | 1. Mở trang Login 2. Nhập email valid 3. Nhập password có space cuối 4. Bấm Sign In | Email: `test@eshop.com`, Password: `Test1234! ` | `401`, counter → 2 (no trim) | | |
| **DT-A-012** | Password rỗng (EC-P5) | Backend running. Counter=0 | 1. Mở trang Login 2. Nhập email valid 3. Để trống password 4. Bấm Sign In | Email: `test@eshop.com`, Password: *(empty)* | HTML5 blocks; nếu bypass → `401`, counter → 2 | | |
| **DT-A-013** | Account locked + correct password (EC-S2) | Backend running. Set DB: counter=4, locked_until=future | 1. Mở trang Login 2. Nhập email + password đúng 3. Bấm Sign In | Email: `test@eshop.com`, Password: `Test1234!` | `403 "Tài khoản đã bị khóa"`, login blocked dù password đúng | | |
| **DT-A-014** | Lock expired + correct password (EC-S3) | Backend running. Set DB: counter=4, locked_until=past (expired) | 1. Mở trang Login 2. Nhập email + password đúng 3. Bấm Sign In | Email: `test@eshop.com`, Password: `Test1234!` | `200`, JWT returned, counter reset → 0, locked_until cleared | | |
| **DT-A-015** | First failure — counter 0→2 (EC-S1 + EC-P3) | Backend running. Counter=0, locked=NULL | 1. Mở trang Login 2. Nhập email đúng + password sai 3. Bấm Sign In | Email: `test@eshop.com`, Password: `WrongPass!` | `401`, counter 0 → 2 (approaching threshold) | | |
| **DT-A-016** | Cross threshold — counter 2→4, LOCK (EC-S1 + EC-P3) | Backend running. Set DB: counter=2, locked=NULL | 1. Mở trang Login 2. Nhập email đúng + password sai 3. Bấm Sign In 4. Verify counter + locked_until | Email: `test@eshop.com`, Password: `WrongPass!` | `401`, counter 2 → 4 (≥3), account LOCKED, locked_until set | | |
| **DT-A-017** | Happy path — login thành công (admin) (EC-E1) | Backend running. Tài khoản `admin@eshop.com` tồn tại, counter=0, unlocked | 1. Mở trang Login 2. Nhập email 3. Nhập password 4. Bấm Sign In | Email: `admin@eshop.com`, Password: `Admin123!` | `200`, JWT với `role: admin`, redirect Home | | |
| **DT-A-018** | Account locked + wrong password (EC-S2) | Backend running. Set DB: counter=4, locked_until=future | 1. Mở trang Login 2. Nhập email đúng + password sai 3. Bấm Sign In | Email: `test@eshop.com`, Password: `WrongPass!` | `403 "Tài khoản đã bị khóa"`, counter stays 4, lock persists | | |

---

## B. BVA Test Cases — Chi tiết (27 TC)

> Source: `05_bva_testcases_v1.md` — BVA-A-001 → BVA-A-027

### Email Length Boundaries (6 TC)

| Test Case ID | Description | Pre-condition | Steps | Test Data | Expected Result | Actual Result | Status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| **BVA-A-001** | Email length = 0 (Min, empty) | Backend running | 1. Mở Login 2. Để trống email 3. Nhập password valid 4. Submit | Email: `` (0 chars), Password: `Test1234!` | HTML5 blocks; bypass → `401` | | |
| **BVA-A-002** | Email length = 3 (Min+1, format hợp lệ tối thiểu) | Backend running | 1. Mở Login 2. Nhập email 3 ký tự 3. Password valid 4. Submit | Email: `a@b` (3 chars), Password: `Test1234!` | `401` (format valid nhưng user không tồn tại) | | |
| **BVA-A-003** | Nominal — covers email/password/counter/locked_until | Backend running. Tài khoản test tồn tại, counter=0, locked=NULL | 1. Mở Login 2. Nhập email valid 3. Password đúng 4. Submit | Email: `test@eshop.com` (14 chars), Password: `Test1234!`, Counter: 0, Locked: NULL | `200`, JWT returned. **Covers nominal/min boundaries cho email length, password length, counter, locked_until** | | |
| **BVA-A-004** | Email length = 319 (Max-1) | Backend running | 1. Mở Login 2. Nhập email 319 chars 3. Password valid 4. Submit | Email: `aaa...@aaa...` (319 chars), Password: `Test1234!` | `401` (format valid nhưng không có trong DB) | | |
| **BVA-A-005** | Email length = 320 (Max, RFC 5321 limit) | Backend running | 1. Mở Login 2. Nhập email 320 chars 3. Password valid 4. Submit | Email: `aaa...@aaa...` (320 chars), Password: `Test1234!` | `401` (format valid nhưng không có trong DB) | | |
| **BVA-A-006** | Email length = 321 (Max+1, overflow) | Backend running | 1. Mở Login 2. Nhập email 321 chars 3. Password valid 4. Submit | Email: `aaa...@aaa...` (321 chars), Password: `Test1234!` | `400` hoặc `401` (có thể bị truncate) | | |

### Password Length Boundaries (4 TC)

| Test Case ID | Description | Pre-condition | Steps | Test Data | Expected Result | Actual Result | Status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| **BVA-A-007** | Password length = 0 (Min, empty) | Backend running. Counter=0 | 1. Mở Login 2. Email valid 3. Để trống password 4. Submit | Email: `test@eshop.com`, Password: `` | `401`, counter → 2 | | |
| **BVA-A-008** | Password length = 1 (Min+1) | Backend running. Counter=0 | 1. Mở Login 2. Email valid 3. Password 1 char 4. Submit | Email: `test@eshop.com`, Password: `a` | `401`, counter → 2 | | |
| **BVA-A-009** | Password length = 1000 (Large value) | Backend running. Counter=0 | 1. Mở Login 2. Email valid 3. Password 1000 chars 4. Submit | Email: `test@eshop.com`, Password: `aaaa...` (1000 chars) | `401`, counter → 2 | | |
| **BVA-A-010** | Password length = 1001 (Max+1, overflow) | Backend running. Counter=0 | 1. Mở Login 2. Email valid 3. Password 1001 chars 4. Submit | Email: `test@eshop.com`, Password: `aaaa...` (1001 chars) | `401`, counter → 2 (hoặc `500` nếu buffer overflow) | | |

### Login Attempts Numeric Boundaries (8 TC)

| Test Case ID | Description | Pre-condition | Steps | Test Data | Expected Result | Actual Result | Status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| **BVA-A-011** | Counter = 1 (Min+1) — correct pw | Backend running. Set DB: counter=1, locked=NULL (chỉ đạt qua DB manipulation) | 1. Login với password đúng | Email: `test@eshop.com`, Password: `Test1234!` | `200`, counter reset → 0 | | |
| **BVA-A-012** | Counter = 1 (Min+1) — wrong pw → exact threshold LOCK | Backend running. Set DB: counter=1, locked=NULL (chỉ đạt qua DB manipulation) | 1. Login với password sai 2. Verify counter + locked_until trong DB | Email: `test@eshop.com`, Password: `WrongPass!` | `401`, counter 1→3 (exact threshold), **LOCK triggered** | | |
| **BVA-A-013** | Counter = 2 (Threshold-1) — correct pw | Backend running. Set DB: counter=2, locked=NULL | 1. Login với password đúng | Email: `test@eshop.com`, Password: `Test1234!` | `200`, counter reset → 0 | | |
| **BVA-A-014** | Counter = 2 (Threshold-1) — wrong pw → LOCK | Backend running. Set DB: counter=2, locked=NULL | 1. Login với password sai 2. Verify counter + locked_until trong DB | Email: `test@eshop.com`, Password: `WrongPass!` | `401`, counter 2→4, **LOCK triggered** | | |
| **BVA-A-015** | Counter = 3 (Threshold exact, code không bao giờ đạt) | Backend running. Set DB: counter=3, locked=NULL (chỉ đạt qua DB manipulation) | 1. Login với password đúng | Email: `test@eshop.com`, Password: `Test1234!` | `200`, counter reset → 0 (anomaly: code nhảy 0→2→4, giá trị 3 không xuất hiện trong normal flow) | | |
| **BVA-A-016** | Counter = 4 (Threshold+1) — re-lock test | Backend running. Set DB: counter=4, locked=NULL | 1. Login với password sai 2. Verify counter + locked_until trong DB | Email: `test@eshop.com`, Password: `WrongPass!` | `401`, counter 4→6, **re-lock triggered** (test counter boundary, không bị lock che mất) | | |
| **BVA-A-017** | Counter = 10 (Large value, locked) | Backend running. Set DB: counter=10, locked=future | 1. Login bất kỳ | Email: `test@eshop.com`, Password: `Test1234!` | `403 "Tài khoản đã bị khóa"` | | |
| **BVA-A-018** | Counter = -1 (Negative, corruption) | Backend running. Set DB: counter=-1, locked=NULL (chỉ đạt qua DB manipulation) | 1. Login với password đúng | Email: `test@eshop.com`, Password: `Test1234!` | `200` (invalid state, không xảy ra trong normal flow) | | |

### Locked_Until Time Boundaries (6 TC)

| Test Case ID | Description | Pre-condition | Steps | Test Data | Expected Result | Actual Result | Status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| **BVA-A-019** | locked_until = far past (1970) | Backend running. Set DB: locked=`1970-01-01T00:00:00` | 1. Login với password đúng | Email: `test@eshop.com`, Password: `Test1234!` | `200` (lock expired) | | |
| **BVA-A-020** | locked_until = recent past (2020) | Backend running. Set DB: locked=`2020-01-01T00:00:00` | 1. Login với password đúng | Email: `test@eshop.com`, Password: `Test1234!` | `200` (lock expired) | | |
| **BVA-A-021** | locked_until = now()-1s (vừa hết hạn) | Backend running. Set DB: locked=`now()-1s` | 1. Login với password đúng (trong 1s) | Email: `test@eshop.com`, Password: `Test1234!` | `200` (lock expired, `now > locked_until`) | | |
| **BVA-A-022** | locked_until = now() (boundary) | Backend running. Set DB: locked=`now()` | 1. Login với password đúng | Email: `test@eshop.com`, Password: `Test1234!` | `403` hoặc `200` (timing-dependent, edge case) | | |
| **BVA-A-023** | locked_until = now()+1s (vừa bị lock) | Backend running. Set DB: locked=`now()+1s` | 1. Login với password đúng | Email: `test@eshop.com`, Password: `Test1234!` | `403` (locked, `now < locked_until`) | | |
| **BVA-A-024** | locked_until = far future (2099) | Backend running. Set DB: locked=`2099-12-31T23:59:59` | 1. Login với password đúng | Email: `test@eshop.com`, Password: `Test1234!` | `403` (locked) | | |

### Supplementary Tests — non-BVA (3 TC)

> Các TC dưới đây test categorical values, không phải boundary values. Đặt ở đây để tiện tham khảo.

| Test Case ID | Description | Pre-condition | Steps | Test Data | Expected Result | Actual Result | Status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| **BVA-A-025** | Email Unicode (ký tự Vietnamese) | Backend running | 1. Mở Login 2. Nhập email Unicode 3. Password valid 4. Submit | Email: `user@tëst.com` (ký tự ë), Password: `Test1234!` | `401` (không có trong DB, hoặc format issue) | | |
| **BVA-A-026** | Email special chars (dấu +) | Backend running | 1. Mở Login 2. Nhập email với dấu + 3. Password valid 4. Submit | Email: `user+tag@test.com`, Password: `Test1234!` | `401` (không có trong DB, format có thể valid) | | |
| **BVA-A-027** | Password special chars | Backend running. Counter=0 | 1. Mở Login 2. Email valid 3. Password special chars 4. Submit | Email: `test@eshop.com`, Password: `Test@#$%^&!` | `401`, counter → 2 (special chars không khớp) | | |

---

## C. UI Validation Test Cases (FR-21, FR-22, FR-24)

> Các requirement giao diện quy định ràng buộc **presentation** cho form Login. Không phải data boundary nhưng là testable requirement cần phủ.

| Test Case ID | Description | Pre-condition | Steps | Test Data | Expected Result | Actual Result | Status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| **UI-A-001** | Email field phải dùng `type="email"` | Frontend web chạy tại `:5173` | 1. Mở trang Login 2. Inspect element trường Email 3. Kiểm tra attribute `type` | N/A (inspect DOM) | `type="email"` (HTML5 format validation) `[FR-22]` | | |
| **UI-A-002** | Password field phải dùng `type="password"` (ẩn ký tự) | Frontend web chạy | 1. Mở trang Login 2. Nhập password bất kỳ 3. Quan sát ký tự có bị ẩn không 4. Inspect attribute `type` | Password: `Test1234!` | Ký tự bị ẩn (dots/asterisks), `type="password"` `[FR-22]` | | |
| **UI-A-003** | Label trường email phải ghi "Email" | Frontend web chạy | 1. Mở trang Login 2. Đọc label của trường nhập email | N/A (visual) | Label ghi "Email" (không phải "Username") `[FR-22]` | | |
| **UI-A-004** | Heading trang Login phải ghi "Đăng nhập" | Frontend web chạy | 1. Mở trang Login 2. Đọc heading (h1 hoặc h2) | N/A (visual) | Heading ghi "Đăng nhập" (không phải "Đăng Ký") `[FR-21]` | | |
| **UI-A-005** | Nút submit phải ghi tiếng Việt | Frontend web chạy | 1. Mở trang Login 2. Đọc text nút submit | N/A (visual) | Nút ghi "Đăng nhập" (không phải "Sign In") `[FR-21]` | | |
| **UI-A-006** | Thông báo lỗi khi bị khóa phải hiện rõ | Frontend + Backend chạy. Set DB: counter=4, locked=future | 1. Mở Login 2. Nhập email + password đúng 3. Submit 4. Quan sát thông báo lỗi | Email: `test@eshop.com`, Password: `Test1234!` | Hiển thị "Tài khoản đã bị khóa" (không phải thông báo chung "Đăng nhập thất bại") `[FR-02]` | | |
| **UI-A-007** | Thông báo lỗi phải hiển thị **trên** nút submit | Frontend chạy | 1. Mở Login 2. Nhập sai email/password 3. Submit 4. Quan sát vị trí error message | Email: `test@eshop.com`, Password: `WrongPass!` | Error message xuất hiện **phía trên** nút submit (không phải bên dưới) `[FR-22]` | | |
| **UI-A-008** | Các trường bắt buộc phải có dấu `*` | Frontend chạy | 1. Mở trang Login 2. Kiểm tra label Email và Password có dấu `*` bên cạnh | N/A (visual) | Cả Email và Password có `*` cạnh label `[FR-22]` | | |

---

## Thống kê

| Nhóm | Số TC | ID Range | Source |
| --- | --- | --- | --- |
| Domain Testing | 18 | DT-A-001 → DT-A-018 | `03_domain_testcases_v1.md` |
| BVA — Email length | 6 | BVA-A-001 → BVA-A-006 | `05_bva_testcases_v1.md` |
| BVA — Password length | 4 | BVA-A-007 → BVA-A-010 | `05_bva_testcases_v1.md` |
| BVA — Counter numeric | 8 | BVA-A-011 → BVA-A-018 | `05_bva_testcases_v1.md` |
| BVA — Locked_until time | 6 | BVA-A-019 → BVA-A-024 | `05_bva_testcases_v1.md` |
| BVA — Supplementary (non-BVA) | 3 | BVA-A-025 → BVA-A-027 | `05_bva_testcases_v1.md` |
| UI Validation | 8 | UI-A-001 → UI-A-008 | FR-21, FR-22, FR-24 |
| **Tổng** | **53** | | |
