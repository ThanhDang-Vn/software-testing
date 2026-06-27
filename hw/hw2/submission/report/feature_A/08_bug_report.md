# 08 — Bug Report: feature_A (FR-02 — Login & Account Lockout)

> **Scope:** Ghi nhận các defect phát hiện từ 5 FAIL TC trong `07_execution.md` Section C (UI Validation).
>
> **Môi trường:**
> - Frontend: React @ `http://localhost:5173`
> - Backend: Node.js + Express @ `http://localhost:3000`
> - Browser: Chrome 130+
> - OS: Windows 11 Home 10.0.26200
> - Date: 2026-06-25

---

## A. Bug Report Table

| Bug ID | Title | Severity | Priority | Pre-condition | Steps to Reproduce | Actual Result | Expected Result | Related TC ID | Screenshot | GitHub Issue Link |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| **BUG-A-001** | Email input dùng `type="text"` thay vì `type="email"` | Medium | Medium | Frontend web chạy tại `:5173` | 1. Mở `http://localhost:5173/login` 2. Nhấn F12 mở DevTools 3. Inspect trường nhập Email 4. Kiểm tra attribute `type` | `type="text"` — không có HTML5 email validation (thiếu kiểm tra format `@`, `.`) | `type="email"` — browser tự validate format email trước khi submit | UI-A-001 | `screenshots/BUG-A-001.png` | |
| **BUG-A-002** | Password input dùng `type="text"` — hiển thị plaintext trên màn hình | Medium | High | Frontend web chạy | 1. Mở `http://localhost:5173/login` 2. Nhập password bất kỳ vào trường Mật khẩu 3. Quan sát ký tự trên màn hình | Password hiển thị dạng plaintext (rõ từng ký tự), `type="text"` | Password phải bị ẩn (dots/asterisks), `type="password"` | UI-A-002 | `screenshots/BUG-A-002.png` | |
| **BUG-A-003** | Label trường email ghi "Username" thay vì "Email" | Low | Low | Frontend web chạy | 1. Mở `http://localhost:5173/login` 2. Đọc label phía trên trường nhập đầu tiên | Label ghi "Username" | Label phải ghi "Email" (đúng với data type và backend field name) | UI-A-003 | `screenshots/BUG-A-003.png` | |
| **BUG-A-004** | Heading trang Login ghi "Đăng Ký" thay vì "Đăng nhập" | High | High | Frontend web chạy | 1. Mở `http://localhost:5173/login` 2. Đọc heading (h2) ở đầu form | Heading ghi "Đăng Ký" — gây nhầm lẫn với chức năng Register | Heading phải ghi "Đăng nhập" (đúng chức năng Login) | UI-A-004 | `screenshots/BUG-A-004.png` | |
| **BUG-A-005** | Frontend không hiển thị thông báo khóa tài khoản cụ thể (403 vs 401) | Medium | Medium | Frontend + Backend chạy. Set DB: `counter=4`, `locked_until=future` | 1. Mở `http://localhost:5173/login` 2. Nhập email `test@eshop.com` + password `Test1234!` (correct) 3. Bấm Sign In 4. Quan sát thông báo lỗi | Hiển thị "Đăng nhập thất bại. Vui lòng kiểm tra lại." (message chung cho cả 401 lẫn 403) | Hiển thị "Tài khoản đã bị khóa. Vui lòng thử lại sau." (message cụ thể từ API 403 response) | UI-A-006 | `screenshots/BUG-A-005.png` | |

---

## B. GitHub Issue Templates

> Paste nội dung bên dưới vào từng GitHub Issue. **Nhớ đính kèm screenshot tương ứng vào mỗi issue.**

---

### BUG-A-001

**Title:** `[BUG] Login — Email input dùng type="text" thay vì type="email"`

**Body:**

```markdown
## Mô tả
Trường nhập Email trên trang Login sử dụng `type="text"` thay vì `type="email"`, dẫn đến thiếu HTML5 email validation (browser không kiểm tra format `@`, `.` trước khi submit).

## Severity / Priority
- **Severity:** Medium
- **Priority:** Medium

## Môi trường
- Frontend: React @ `http://localhost:5173`
- Browser: Chrome 130+
- OS: Windows 11

## Steps to Reproduce
1. Mở `http://localhost:5173/login`
2. Nhấn F12 mở DevTools
3. Inspect trường nhập Email
4. Kiểm tra attribute `type`

## Expected Result
`type="email"` — browser tự validate format email trước khi submit.

## Actual Result
`type="text"` — không có HTML5 email format validation.

## Root Cause
`Login.jsx` line 30: `<input type="text" ...>` thay vì `<input type="email" ...>`.

## Related TC
UI-A-001

## Screenshot
<!-- Đính kèm screenshots/BUG-A-001.png -->
```

---

### BUG-A-002

**Title:** `[BUG] Login — Password hiển thị plaintext (type="text" thay vì type="password")`

**Body:**

```markdown
## Mô tả
Trường nhập Password trên trang Login sử dụng `type="text"`, khiến password hiển thị rõ trên màn hình thay vì bị ẩn bằng dots/asterisks. Đây là lỗi bảo mật UI nghiêm trọng — người xung quanh có thể nhìn thấy password (shoulder surfing).

## Severity / Priority
- **Severity:** Medium
- **Priority:** High

## Môi trường
- Frontend: React @ `http://localhost:5173`
- Browser: Chrome 130+
- OS: Windows 11

## Steps to Reproduce
1. Mở `http://localhost:5173/login`
2. Nhập password bất kỳ vào trường Mật khẩu (ví dụ: `Test1234!`)
3. Quan sát ký tự hiển thị trên màn hình

## Expected Result
Password bị ẩn (hiển thị dạng `•••••••••`), `type="password"`.

## Actual Result
Password hiển thị plaintext rõ từng ký tự, `type="text"`.

## Root Cause
`Login.jsx` line 40: `<input type="text" ...>` thay vì `<input type="password" ...>`.

## Related TC
UI-A-002

## Screenshot
<!-- Đính kèm screenshots/BUG-A-002.png -->
```

---

### BUG-A-003

**Title:** `[BUG] Login — Label ghi "Username" thay vì "Email"`

**Body:**

```markdown
## Mô tả
Label trường nhập email trên trang Login ghi "Username" nhưng backend và logic thực tế yêu cầu nhập email address. Gây nhầm lẫn cho user.

## Severity / Priority
- **Severity:** Low
- **Priority:** Low

## Môi trường
- Frontend: React @ `http://localhost:5173`
- Browser: Chrome 130+
- OS: Windows 11

## Steps to Reproduce
1. Mở `http://localhost:5173/login`
2. Đọc label phía trên trường nhập đầu tiên

## Expected Result
Label ghi "Email".

## Actual Result
Label ghi "Username".

## Root Cause
`Login.jsx` line 28: `<label>Username</label>` thay vì `<label>Email</label>`.

## Related TC
UI-A-003

## Screenshot
<!-- Đính kèm screenshots/BUG-A-003.png -->
```

---

### BUG-A-004

**Title:** `[BUG] Login — Heading ghi "Đăng Ký" thay vì "Đăng nhập"`

**Body:**

```markdown
## Mô tả
Heading (h2) trang Login ghi "Đăng Ký" — đây là text dành cho trang Register, không phải Login. Gây nhầm lẫn nghiêm trọng: user tưởng đang ở trang đăng ký thay vì đăng nhập.

## Severity / Priority
- **Severity:** High
- **Priority:** High

## Môi trường
- Frontend: React @ `http://localhost:5173`
- Browser: Chrome 130+
- OS: Windows 11

## Steps to Reproduce
1. Mở `http://localhost:5173/login`
2. Đọc heading (h2) ở đầu form

## Expected Result
Heading ghi "Đăng nhập".

## Actual Result
Heading ghi "Đăng Ký".

## Root Cause
`Login.jsx` line 24: `<h2>Đăng Ký</h2>` thay vì `<h2>Đăng nhập</h2>`.

## Related TC
UI-A-004

## Screenshot
<!-- Đính kèm screenshots/BUG-A-004.png -->
```

---

### BUG-A-005

**Title:** `[BUG] Login — Frontend không phân biệt lỗi khóa tài khoản (403) vs sai mật khẩu (401)`

**Body:**

```markdown
## Mô tả
Khi tài khoản bị khóa (API trả 403 với message "Tài khoản đã bị khóa"), frontend hiển thị thông báo chung "Đăng nhập thất bại. Vui lòng kiểm tra lại." — giống hệt khi sai mật khẩu (401). User bị khóa không biết lý do và không biết cần chờ bao lâu.

## Severity / Priority
- **Severity:** Medium
- **Priority:** Medium

## Môi trường
- Frontend: React @ `http://localhost:5173`
- Backend: Node.js + Express @ `http://localhost:3000`
- Browser: Chrome 130+
- OS: Windows 11

## Pre-condition
Set DB: `UPDATE users SET login_attempts=4, locked_until='2099-12-31T23:59:59.000Z' WHERE email='test@eshop.com';`

## Steps to Reproduce
1. Mở `http://localhost:5173/login`
2. Nhập email `test@eshop.com`
3. Nhập password `Test1234!` (correct password)
4. Bấm Sign In
5. Quan sát thông báo lỗi hiển thị

## Expected Result
Hiển thị "Tài khoản đã bị khóa. Vui lòng thử lại sau." (message cụ thể từ API 403).

## Actual Result
Hiển thị "Đăng nhập thất bại. Vui lòng kiểm tra lại." (message chung, không phân biệt 401 vs 403).

## Root Cause
`Login.jsx` line 17-18: `catch (err) { setError('Đăng nhập thất bại...') }` — catch chung, không đọc `err.response.status` hay `err.response.data.error` để hiển thị message cụ thể.

## Related TC
UI-A-006

## Screenshot
<!-- Đính kèm screenshots/BUG-A-005.png -->
```

---

## Thống kê Bug

| Severity | Count | Bug IDs |
| --- | --- | --- |
| High | 1 | BUG-A-004 |
| Medium | 3 | BUG-A-001, BUG-A-002, BUG-A-005 |
| Low | 1 | BUG-A-003 |
| **Tổng** | **5** | |
