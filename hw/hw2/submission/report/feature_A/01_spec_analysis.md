# 01 — Phân tích Đặc tả: feature_A (FR-02 — Login & Account Lockout)

> **Phạm vi bước này:** Chỉ phân tích đặc tả + suy ràng buộc thực tế từ code. **Chưa** thiết kế test case (sẽ làm ở `02_domain_testing.md` và `03_bva.md`).

---

## 0. Cách tiếp cận (kỹ thuật phân tích đặc tả)

Trước khi áp dụng Domain Testing / BVA, ta phải hiểu **không gian đầu vào** của chức năng. Quy trình:

1. **Đọc đặc tả nghiệp vụ** (SRS) để biết hệ thống *phải* làm gì → đây là "oracle" (kết quả mong đợi).
2. **Đọc source code thật của SUT** để biết hệ thống *thực sự* làm gì → suy ra ràng buộc triển khai (kiểu dữ liệu, thứ tự kiểm tra, ngưỡng...).
3. Với mỗi ràng buộc, **ghi rõ nguồn**: `[SPEC]` (lấy từ SRS) hay `[CODE]` (suy từ code). Khi `[SPEC]` ≠ `[CODE]` → đó là **điểm nóng** dễ phát sinh defect, sẽ được kiểm thử kỹ ở các bước sau.
4. Tách **biến đầu vào trực tiếp** (người dùng nhập) khỏi **biến trạng thái phụ thuộc** (server lưu, chi phối hành vi) — vì miền giá trị và cách phân hoạch của hai loại này khác nhau.

## Nguồn tham chiếu

| Nhãn | Nguồn | Vị trí |
| --- | --- | --- |
| `[SPEC]` | SRS — FR-02 (Login & Lockout), FR-22 (Form), SEC-01/02 | `group05_eshop/README.md` |
| `[CODE-BE]` | Endpoint đăng nhập | `group05_eshop/backend/server.js:32–66` |
| `[CODE-DB]` | Schema bảng `users` + seed | `group05_eshop/backend/database.js:50–94` |
| `[CODE-FE]` | Form đăng nhập (web) | `group05_eshop/frontend-web/src/pages/Login.jsx` |
| `[CODE-CTX]` | Gửi request & lưu token | `group05_eshop/frontend-web/src/context/AuthContext.jsx` |

---

## 1. Mô tả chức năng & luồng nghiệp vụ chính

**Mục đích:** Xác thực người dùng bằng Email + Mật khẩu; cấp JWT cho phiên đăng nhập; chống dò mật khẩu bằng cơ chế khóa tài khoản tạm thời sau nhiều lần sai liên tiếp.

**Luồng chính (happy path)** — `[SPEC]` FR-02 + `[CODE-BE]`:
1. Người dùng nhập **Email** và **Mật khẩu**, bấm đăng nhập.
2. Frontend gửi `POST /api/login` với body `{ email, password }` `[CODE-CTX]`.
3. Backend tra cứu user theo email (`SELECT * FROM users WHERE email = ?`, parameterized) `[CODE-BE]`.
4. Nếu user **đang bị khóa** (`locked_until` còn hiệu lực) → trả `403` "Tài khoản đã bị khóa..." (kiểm tra này chạy **trước** khi so mật khẩu).
5. Nếu **mật khẩu đúng** → reset `login_attempts = 0`, `locked_until = NULL`, ký JWT `{ id, role }`, trả `200` kèm `token` + `user`.
6. Frontend lưu token vào `localStorage`, đặt header `Authorization: Bearer <token>`, chuyển về trang Home `[CODE-CTX]`/`[CODE-FE]`.

**Luồng lỗi & khóa tài khoản (lockout)** — `[SPEC]` FR-02 + `[CODE-BE]`:
- Email không tồn tại → `401` "Invalid email or password" (không tăng bộ đếm) `[CODE-BE]`.
- Mật khẩu sai → tăng bộ đếm `login_attempts`; nếu đạt ngưỡng → đặt `locked_until`; trả `401` cùng thông báo chung (không lộ nguyên nhân) `[SPEC]`/`[CODE-BE]`.

---

## 2. Biến đầu vào trực tiếp (Input Variables / Fields)

### Biến 1 — `email`

| Thuộc tính | Nội dung | Nguồn |
| --- | --- | --- |
| Kiểu dữ liệu | Chuỗi (TEXT). Cột `users.email TEXT`, không `UNIQUE`, không `NOT NULL` | `[CODE-DB]` |
| Vai trò | Khóa tra cứu tài khoản; so khớp **chính xác chuỗi** qua `WHERE email = ?` | `[CODE-BE]` |
| Ràng buộc định dạng (mong đợi) | Phải đúng định dạng email `user@domain.com`; field web phải dùng `type="email"` (validate HTML5) | `[SPEC]` FR-02, FR-22 |
| Ràng buộc định dạng (thực tế) | **Không** validate định dạng ở backend; form web dùng `type="text"`, label ghi "Username", chỉ có `required` (HTML5 chặn rỗng) | `[CODE-BE]`, `[CODE-FE]` |
| Phân biệt hoa/thường | So khớp `=` trên TEXT trong SQLite **phân biệt hoa thường** mặc định ⇒ `Test@eshop.com` ≠ `test@eshop.com` | `[CODE-BE/DB]` |
| Khoảng trắng | Không trim ở backend ⇒ ` test@eshop.com ` không khớp | `[CODE-BE]` |
| Độ dài min/max | Không quy định | — (thiếu) |
| Giá trị **hợp lệ** nghiệp vụ | Email đã đăng ký, đúng case: `test@eshop.com`, `admin@eshop.com` | `[CODE-DB]` seed |
| Giá trị **không hợp lệ** nghiệp vụ | Sai định dạng (`abc`, `a@b`), email chưa đăng ký, rỗng, sai case, có khoảng trắng thừa | suy luận |

### Biến 2 — `password`

| Thuộc tính | Nội dung | Nguồn |
| --- | --- | --- |
| Kiểu dữ liệu | Chuỗi (TEXT). Cột `users.password TEXT` lưu **plaintext** (vi phạm SEC-01) | `[CODE-DB]` |
| Vai trò | So khớp xác thực: `user.password === password` (so sánh chuỗi tuyệt đối) | `[CODE-BE]` |
| Ràng buộc (mong đợi) | Field web phải dùng `type="password"` (ẩn ký tự) | `[SPEC]` FR-22 |
| Ràng buộc (thực tế) | Form web dùng `type="text"` ⇒ hiển thị rõ mật khẩu; chỉ có `required` | `[CODE-FE]` |
| Phân biệt hoa/thường | Có (so sánh `===`) ⇒ `test1234!` ≠ `Test1234!` | `[CODE-BE]` |
| Khoảng trắng | Không trim ⇒ `Test1234! ` (có space cuối) ≠ `Test1234!` | `[CODE-BE]` |
| Độ dài / chính sách | Khi **đăng nhập** không kiểm tra độ mạnh (chính sách mật khẩu mạnh thuộc FR-01 — đăng ký) | `[SPEC]` |
| Giá trị **hợp lệ** | Đúng tuyệt đối mật khẩu đã lưu: `Test1234!`, `Admin123!` | `[CODE-DB]` seed |
| Giá trị **không hợp lệ** | Bất kỳ chuỗi không khớp, rỗng, sai case, thừa/thiếu ký tự, thừa khoảng trắng | suy luận |

---

## 3. Biến phụ thuộc & điều kiện kết hợp (State variables)

Hành vi đăng nhập không chỉ phụ thuộc 2 input trực tiếp mà còn vào **trạng thái tài khoản** lưu ở server. Đây là input gián tiếp, rất quan trọng cho phần BVA (ngưỡng khóa).

| Biến trạng thái | Kiểu | Ý nghĩa | Nguồn |
| --- | --- | --- | --- |
| `login_attempts` | INTEGER, default `0` | Số lần sai tích lũy của tài khoản | `[CODE-DB]` |
| `locked_until` | DATETIME, nullable | Mốc thời gian hết khóa; còn hiệu lực nếu `now < locked_until` | `[CODE-DB]` |

**Thứ tự kiểm tra (logic kết hợp)** `[CODE-BE]`:
```
1. email tồn tại?           --(không)--> 401, KHÔNG tăng bộ đếm
2. đang khóa? (now<locked)  --(có)----> 403 "Tài khoản đã bị khóa"  (kể cả khi mật khẩu đúng)
3. mật khẩu đúng?           --(đúng)--> reset attempts=0, locked_until=NULL, cấp JWT, 200
                            --(sai)---> attempts mới = attempts + 2; nếu >=3 thì khóa; 401
```

**Ngưỡng & hằng số khóa — đối chiếu SPEC vs CODE (điểm nóng):**

| Tham số | `[SPEC]` FR-02 | `[CODE-BE]` | Chênh lệch |
| --- | --- | --- | --- |
| Mức tăng mỗi lần sai | **+1** | **+2** (`login_attempts + 2`) | ❗ Code tăng gấp đôi ⇒ chuỗi 0→2→4, khóa kích hoạt sau **2 lần sai** thay vì 3 |
| Ngưỡng khóa | `>= 3` lần sai liên tiếp | `newAttempts >= 3` | Ngưỡng số giống nhau, nhưng do bước +2 nên đạt sớm hơn |
| Thời gian khóa | **30 giây** (demo) | **180000 ms = 180 giây (3 phút)** | ❗ Lệch 6× |
| Phạm vi bộ đếm | "liên tiếp" của tài khoản | Theo tài khoản; reset khi đăng nhập đúng | Code không reset khi hết hạn khóa |

**Điều kiện kết hợp đáng chú ý cho thiết kế test sau này:**
- (Mật khẩu đúng) × (đang khóa) ⇒ vẫn bị chặn `403` → cần test "đăng nhập đúng trong lúc đang khóa".
- (Email không tồn tại) × (sai nhiều lần) ⇒ bộ đếm **không** tăng → không khóa với email lạ.
- (Hết hạn khóa) × (`login_attempts` vẫn cao, ví dụ 4) ⇒ 1 lần sai kế tiếp → 6 → khóa lại ngay → cần test hành vi sau khi hết khóa.

---

## 4. Điểm đặc tả KHÔNG rõ ràng / thiếu thông tin (nơi dễ phát sinh bug)

> Phần này gom (a) chỗ SRS **không định nghĩa** (mơ hồ) và (b) chỗ CODE **đã làm khác** SRS. Cả hai đều là vùng cần kiểm thử trọng điểm. Bug cụ thể sẽ được xác nhận qua thực thi (bước `04`) và lập báo cáo (bước `05`).

**A. Đặc tả mơ hồ / thiếu (ambiguity):**
1. **Phân biệt hoa/thường của email**: SRS không nói email có case-insensitive không. Code phân biệt ⇒ rủi ro UX.
2. **Trim khoảng trắng**: SRS không quy định cắt space đầu/cuối cho email & mật khẩu.
3. **Email không tồn tại có tính vào bộ đếm khóa không?** SRS chỉ nói "đăng nhập sai"; không rõ "sai" gồm cả email lạ hay chỉ sai mật khẩu. Code: chỉ sai-mật-khẩu mới tính.
4. **Bộ đếm sau khi hết hạn khóa**: SRS không nói có reset `login_attempts` về 0 khi khóa hết hạn hay không.
5. **Độ dài tối đa** của email/mật khẩu: không quy định ⇒ chưa rõ giá trị biên trên.
6. **Hết hạn (expiry) của JWT**: SRS không nêu; code ký token **không có `expiresIn`** ⇒ token sống vĩnh viễn.
7. **"Liên tiếp" (consecutive)**: SRS dùng từ "liên tiếp" nhưng code chỉ reset khi đăng nhập đúng — chưa rõ định nghĩa chính xác chuỗi "liên tiếp".

**B. Triển khai khác đặc tả (chênh SPEC vs CODE — điểm nóng):**
1. ❗ **Bộ đếm +2 thay vì +1** (`server.js:54`) ⇒ khóa sau ~2 lần sai (FR-02 yêu cầu +1, khóa từ lần thứ 3).
2. ❗ **Thời gian khóa 180s thay vì 30s** (`server.js:57`).
3. ❗ **Form web sai loại input**: email dùng `type="text"` (không phải `type="email"`), mật khẩu dùng `type="text"` (không ẩn) — vi phạm FR-22; label ghi "Username", tiêu đề trang ghi "Đăng Ký", nút "Sign In" (lẫn ngôn ngữ).
4. ❗ **Lộ dữ liệu nhạy cảm**: phản hồi đăng nhập trả nguyên `user` (gồm cả cột `password` plaintext) — liên quan SEC-01.
5. ❗ **Thông báo khóa không tới người dùng (web)**: `Login.jsx` bắt lỗi và hiển thị thông báo chung "Đăng nhập thất bại...", che mất message `403` "Tài khoản đã bị khóa" của backend ⇒ người dùng không biết đang bị khóa.

---

*Kết thúc Bước 1 — Phân tích đặc tả feature_A. Bước kế tiếp (chờ xác nhận): phân hoạch miền (Domain Testing) trong `02_domain_testing.md`.*
