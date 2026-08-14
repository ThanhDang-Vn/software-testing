# Bug Report (HW05)

Các bug dưới đây lộ ra trong lúc smoke test (P0) và đo hiệu năng SUT EShop. Mỗi bug được **đối chiếu trực tiếp với mã nguồn** `eshop-sut/backend/server.js` (có số dòng), kèm bước tái hiện chạy được và output thật lấy trực tiếp từ server.

- Base URL: `http://localhost:3000`
- Tài khoản seed: `test@eshop.com` / `Test1234!`
- File mã nguồn tham chiếu: `backend/server.js` (số dòng trích trong từng bug)
- Ngày kiểm thử: 2026-08-11
- GitHub Issues đã post: [#43](https://github.com/ThanhDang-Vn/software-testing/issues/43) (SQLi), [#44](https://github.com/ThanhDang-Vn/software-testing/issues/44) (login lộ password), [#45](https://github.com/ThanhDang-Vn/software-testing/issues/45) (lockout 2 lần), [#46](https://github.com/ThanhDang-Vn/software-testing/issues/46) (detail {}+200), [#47](https://github.com/ThanhDang-Vn/software-testing/issues/47) (price string)

## Bảng tổng hợp

| # | Bug | Mức độ | Endpoint | Loại | Vị trí code |
|---|---|---|---|---|---|
| 1 | SQL Injection ở tham số `search` | 🔴 Nghiêm trọng | `GET /api/products?search=` | Bảo mật | `server.js:144` |
| 2 | Response login lộ mật khẩu plaintext | 🟠 Cao | `POST /api/login` | Bảo mật | `server.js:46,52` |
| 3 | Khóa tài khoản sau 2 lần sai (spec là 3) | 🟡 Trung bình | `POST /api/login` | Logic xác thực | `server.js:54-57` |
| 4 | Sản phẩm không tồn tại trả `{}` kèm 200 | 🟡 Trung bình | `GET /api/products/:id` | Sai mã trạng thái | `server.js:161` |
| 5 | id chẵn trả `price` kiểu string | 🟢 Thấp | `GET /api/products/:id` | Sai kiểu dữ liệu | `server.js:162` |

> Ghi chú thang mức độ: 🔴 Nghiêm trọng = khai thác từ xa không cần auth, ảnh hưởng toàn bộ dữ liệu · 🟠 Cao = lộ thông tin nhạy cảm · 🟡 Trung bình = sai hành vi nghiệp vụ, ảnh hưởng UX/độ tin cậy · 🟢 Thấp = sai hợp đồng dữ liệu, dễ gây bug phía client.

Cuối tài liệu có: **(A)** quan sát hiệu năng, **(B)** phụ lục các bug khác phát hiện trong code (ngoài phạm vi perf-testing), **(C)** nội dung GitHub Issue sẵn để copy đi post.

---

## Bug 1 — SQL Injection ở tham số `search` 🔴

**Vị trí code:** `backend/server.js:141-157` (câu SQL ở dòng 144, rò rỉ lỗi ở dòng 146-149)

**Đoạn code lỗi:**
```js
// server.js:144
const query = `SELECT * FROM products WHERE name LIKE '%${searchQuery}%'`;
db.all(query, [], (err, rows) => {
  if (err)
    return res.status(500).send(`<h1>Database Error</h1><p>${err.message}</p>`); // rò rỉ lỗi engine
```

**Nguyên nhân gốc:** `searchQuery` được nối chuỗi thẳng vào câu SQL bằng template literal, **không dùng prepared statement / tham số hoá**. Ngoài ra nhánh lỗi trả nguyên `err.message` của SQLite ra client → lộ thông tin engine (information disclosure).

**Tái hiện A — chèn dấu nháy gây lỗi cú pháp, server trả nguyên lỗi SQLite:**
```bash
curl -s "http://localhost:3000/api/products?search='" -w "\n[HTTP %{http_code}]\n"
```
Output thật:
```
Database ErrorSQLITE_ERROR: unrecognized token: "'"
[HTTP 500]
```

**Tái hiện B — chèn điều kiện luôn đúng để bypass bộ lọc, lấy toàn bộ sản phẩm:**
```bash
curl -s "http://localhost:3000/api/products?search=%25'%20OR%20'1'='1"
```
Output thật: trả về cả 5 sản phẩm (đúng bằng số sản phẩm của `GET /api/products`) → bộ lọc bị vô hiệu.

| | |
|---|---|
| **Expected** | Truy vấn tham số hoá; từ khóa lạ trả mảng rỗng; lỗi nội bộ **không** lộ ra client (trả 500 với thông báo chung). |
| **Actual** | Chèn được SQL, bypass được bộ lọc, và nhánh lỗi lộ thông tin engine (SQLite). |

**Ảnh hưởng:** Kẻ tấn công không cần auth có thể đọc/dò cấu trúc DB qua thông báo lỗi, và với payload phức tạp hơn (UNION SELECT) có thể trích xuất dữ liệu bảng khác (kể cả `users` chứa mật khẩu plaintext — xem Bug 2). Đây là lỗ hổng khai thác từ xa, nên xếp **Nghiêm trọng**.

**Đề xuất sửa:**
```js
const query = "SELECT * FROM products WHERE name LIKE ?";
db.all(query, [`%${searchQuery}%`], (err, rows) => {
  if (err) return res.status(500).json({ error: "Internal server error" }); // không lộ err.message
  res.json(rows);
});
```

---

## Bug 2 — Response login lộ mật khẩu plaintext 🟠

**Vị trí code:** `backend/server.js:46` (so sánh) và `server.js:52` (trả về). Nguồn gốc: đăng ký lưu plaintext ở `server.js:22-24`.

**Đoạn code lỗi:**
```js
// server.js:46  — so sánh trực tiếp => mật khẩu đang lưu plaintext trong DB
if (user.password === password) {
  ...
  // server.js:52  — trả nguyên bản ghi user, gồm cả field password
  res.json({ message: "Login successful", token, user });
}
```

**Nguyên nhân gốc:** Hai lỗi cộng hưởng: (1) mật khẩu lưu **không băm** (`register` ở dòng 23 insert thẳng `password`), (2) response login trả nguyên object `user` từ DB nên field `password` lọt ra ngoài. Endpoint `GET /api/users/me` (dòng 112-116) cũng trả nguyên `user` → lộ tương tự.

**Tái hiện:**
```bash
curl -s -X POST http://localhost:3000/api/login -H "Content-Type: application/json" \
  -d '{"email":"test@eshop.com","password":"Test1234!"}'
```
Output thật (rút gọn): `{"message":"Login successful","token":"...","user":{...,"password":"Test1234!",...}}`

| | |
|---|---|
| **Expected** | Không bao giờ trả field `password` ra client; mật khẩu lưu ở dạng băm (bcrypt/argon2) và so sánh bằng `compare()`. |
| **Actual** | `user.password` = đúng mật khẩu người dùng gõ → vừa lưu plaintext vừa trả ra ngoài. |

**Ảnh hưởng:** Bất kỳ ai bắt được response (log, proxy, XSS) đọc được mật khẩu; nếu DB bị lộ (qua Bug 1) thì toàn bộ mật khẩu người dùng lộ ngay. Không đến mức Nghiêm trọng vì cần đã đăng nhập đúng để thấy password của chính mình, nhưng việc lưu plaintext là rủi ro hệ thống → **Cao**.

**Đề xuất sửa:** băm khi register (`bcrypt.hash`), so sánh bằng `bcrypt.compare`, và loại field khi trả về:
```js
const { password: _omit, ...safeUser } = user;
res.json({ message: "Login successful", token, user: safeUser });
```

---

## Bug 3 — Khóa tài khoản sau 2 lần sai (spec là 3) 🟡

**Vị trí code:** `backend/server.js:53-62`

**Đoạn code lỗi:**
```js
// server.js:54  — cộng 2 mỗi lần sai thay vì 1
const newAttempts = user.login_attempts + 2;
let lockedUntil = null;
if (newAttempts >= 3) {                                   // server.js:56
  lockedUntil = new Date(Date.now() + 180000).toISOString(); // server.js:57 — khóa 180s (3 phút)
}
```

**Nguyên nhân gốc:** Bước nhảy `login_attempts` là **+2** thay vì +1. Chuỗi giá trị đi 0 → 2 → 4; điều kiện khóa `>= 3` được thỏa ngay ở lần sai thứ **hai** (khi đạt 2... thực ra 0+2=2 chưa khóa, 2+2=4 ≥ 3 khóa), tức khóa **sau đúng 2 lần sai** thay vì 3 theo nghiệp vụ.

**Tái hiện** (đăng ký tài khoản throwaway rồi sai 2 lần, sau đó đăng nhập đúng):
```bash
curl -s -X POST http://localhost:3000/api/register -H "Content-Type: application/json" -d '{"name":"x","email":"lock1@eshop.com","password":"Good123!"}'
curl -s -X POST http://localhost:3000/api/login -H "Content-Type: application/json" -d '{"email":"lock1@eshop.com","password":"bad"}'   # attempts: 0 -> 2
curl -s -X POST http://localhost:3000/api/login -H "Content-Type: application/json" -d '{"email":"lock1@eshop.com","password":"bad"}'   # attempts: 2 -> 4  => khóa
curl -s -X POST http://localhost:3000/api/login -H "Content-Type: application/json" -d '{"email":"lock1@eshop.com","password":"Good123!"}' # đúng mật khẩu vẫn bị chặn
```
Output thật ở lần cuối (dù mật khẩu đúng): `{"error":"Tài khoản đã bị khóa. Vui lòng thử lại sau."}` kèm **HTTP 403**. Cột `login_attempts` đi 0, 2, 4 qua các lần.

| | |
|---|---|
| **Expected** | Khóa **sau 3 lần sai** theo mô tả nghiệp vụ (`login_attempts += 1`, khóa khi `>= 3`). |
| **Actual** | Khóa sau **2 lần sai**, giữ 180 giây. |

**Ảnh hưởng:** (1) UX — người dùng thật gõ sai 2 lần bị chặn 3 phút. (2) An ninh — dễ bị lạm dụng làm **DoS tài khoản** (attacker cố tình login sai 2 lần để khóa tài khoản nạn nhân). Ảnh hưởng nghiệp vụ rõ nhưng không lộ dữ liệu → **Trung bình**. *(Lưu ý test load: bug này còn buộc phải reset lockout giữa các lần chạy Stress/Spike — xem P2.1.)*

**Đề xuất sửa:** `const newAttempts = user.login_attempts + 1;` (giữ nguyên ngưỡng `>= 3`).

---

## Bug 4 — Sản phẩm không tồn tại trả `{}` kèm 200 🟡

**Vị trí code:** `backend/server.js:159-165` (dòng 161)

**Đoạn code lỗi:**
```js
// server.js:161
if (!row) return res.status(200).json({});   // đáng lẽ 404
```

**Nguyên nhân gốc:** Khi không tìm thấy bản ghi, code cố tình trả `200 {}` thay vì `404`. Sai hợp đồng REST: mã trạng thái không phản ánh việc tài nguyên không tồn tại.

**Tái hiện:**
```bash
curl -s "http://localhost:3000/api/products/9999" -w "  [HTTP %{http_code}]\n"
```
Output thật: `{}  [HTTP 200]`

| | |
|---|---|
| **Expected** | `HTTP 404` với body báo lỗi (ví dụ `{"error":"Product not found"}`). |
| **Actual** | `HTTP 200` với body `{}` rỗng. |

**Ảnh hưởng:** Client không phân biệt được "không tồn tại" với "sản phẩm rỗng"; assertion dựa trên status code sẽ **báo pass sai** trong test tự động; frontend có thể render trang sản phẩm trống thay vì trang 404. Ảnh hưởng độ tin cậy nhưng không phải lỗi bảo mật → **Trung bình**.

**Đề xuất sửa:** `if (!row) return res.status(404).json({ error: "Product not found" });`

---

## Bug 5 — id chẵn trả `price` kiểu string 🟢

**Vị trí code:** `backend/server.js:162`

**Đoạn code lỗi:**
```js
// server.js:162
if (row.id % 2 === 0) row.price = row.price.toString(); // ép price -> string khi id chẵn
```

**Nguyên nhân gốc:** Có nhánh cố tình ép `price` sang string khi `id` là số chẵn → kiểu dữ liệu của cùng một field **không ổn định**, phụ thuộc tính chẵn/lẻ của id.

**Tái hiện:**
```bash
curl -s http://localhost:3000/api/products/1   # id lẻ
curl -s http://localhost:3000/api/products/2   # id chẵn
```
Output thật: id 1 → `"price":30000000` (number), id 2 → `"price":"28000000"` (string).

| | |
|---|---|
| **Expected** | `price` luôn cùng kiểu (number) cho mọi sản phẩm. |
| **Actual** | Kiểu đổi theo tính chẵn/lẻ của id. |

**Ảnh hưởng:** Phía client làm phép tính (`price * quantity`, tính tổng giỏ hàng) có thể ra kết quả sai do JS ép kiểu ngầm (`"28000000" * 2` vẫn ra number nhưng `price + fee` khi cộng chuỗi sẽ nối chuỗi). Sai hợp đồng dữ liệu, dễ gây bug ẩn phía client → **Thấp**.

**Đề xuất sửa:** xóa dòng 162 (không ép kiểu); đảm bảo `price` luôn là number.

---

## (A) Quan sát hiệu năng (không phải lỗi chức năng)

Trong cả 4 lần chạy (Load/Stress/Spike/Endurance), **error% = 0**, không crash, không từ chối kết nối → **không có defect hiệu năng**. Có một điểm về **giới hạn năng lực** đáng ghi nhận (không phải bug):

- Khi ép tải (endurance 300 VU không think-time), throughput chạm trần **~276 req/s** còn độ trễ phình to: avg ~1.001s, p95 ~1.741s, **54.4% request vượt 1 giây**. Server **xếp hàng thay vì trả lỗi**.
- Nguyên nhân: giới hạn kiến trúc **Node đơn tiến trình + SQLite khóa ghi toàn file** ở bước checkout (`INSERT INTO orders`), không phải defect.
- Chi tiết & ngưỡng: `results/endurance/endurance-summary.md`.

---

## (B) Phụ lục — bug khác phát hiện trong code (ngoài phạm vi perf-testing)

Các lỗi sau **có thật trong `server.js`** nhưng nằm ngoài workflow perf-testing của HW05, ghi lại để tham khảo/không bỏ sót. Chưa chạy tái hiện đầy đủ nên **chưa** đưa vào bảng chính.

| Bug | Vị trí | Mô tả ngắn | Mức độ |
|---|---|---|---|
| Tự nâng quyền (privilege escalation) | `server.js:118-135` | `PUT /api/users/me` cho phép người dùng tự set `role` (kể cả `admin`) cho chính mình. | 🔴 Nghiêm trọng |
| SECRET_KEY hardcode trong source | `server.js:9` | Khóa ký JWT nằm cứng trong mã → ai đọc source đều giả mạo được token. | 🟠 Cao |
| JWT không có hạn (`expiresIn`) | `server.js:51` | `jwt.sign` không đặt hạn → token sống vĩnh viễn, không thu hồi được. | 🟠 Cao |
| Sai công thức giảm giá `percent` | `server.js:399-400` | `discount = total * (1 - discount_value)` — ngược logic; coupon 10% lại giảm 90% giá trị. | 🟠 Cao |
| Cho hủy đơn sai trạng thái | `server.js:328-331` | Chỉ chặn `delivered/canceled`; đơn `shipping` vẫn hủy được (comment trong code cũng thừa nhận). | 🟡 Trung bình |
| Chuyển trạng thái đơn phi lý | `server.js:550-551` | Cho phép `canceled → delivered` (đơn đã hủy vẫn đánh dấu giao thành công). | 🟡 Trung bình |

> Nếu cần, mình có thể viết bước tái hiện + output thật cho từng bug phụ lục và nâng lên bảng chính.

---

## (C) Nội dung GitHub Issue để post

Mỗi khối dưới đây là một issue: copy tiêu đề + phần thân đi post. Nhớ đính kèm ảnh chụp response/terminal khi post.

### Issue 1
- **Title:** `[Security] SQL Injection ở GET /api/products?search=`
- **Labels:** `bug`, `security`, `critical`
- **Body:**
```
Vị trí: backend/server.js:144
Tham số search nối thẳng vào SQL qua template literal:
  SELECT * FROM products WHERE name LIKE '%${searchQuery}%'
Không dùng prepared statement; nhánh lỗi (server.js:146-149) còn trả nguyên err.message ra client.

Tái hiện:
1) curl "http://localhost:3000/api/products?search='"   -> HTTP 500, body lộ "SQLITE_ERROR: unrecognized token".
2) curl "http://localhost:3000/api/products?search=%25' OR '1'='1"   -> trả toàn bộ sản phẩm (bypass filter).

Expected: truy vấn tham số hoá; từ khóa lạ trả mảng rỗng; không lộ lỗi engine ra client.
Actual: chèn được SQL, bypass filter, lộ thông tin DB.
Fix: dùng LIKE ? với tham số [`%${searchQuery}%`]; nhánh lỗi trả thông báo chung.
Mức độ: Nghiêm trọng.
```

### Issue 2
- **Title:** `[Security] Response login lộ mật khẩu plaintext`
- **Labels:** `bug`, `security`, `high`
- **Body:**
```
Vị trí: backend/server.js:46 (so sánh), server.js:52 (trả về); register lưu plaintext ở server.js:22-24.
POST /api/login khi thành công trả nguyên object user (gồm field password chưa băm).

Tái hiện:
curl -X POST http://localhost:3000/api/login -H "Content-Type: application/json" -d '{"email":"test@eshop.com","password":"Test1234!"}'
-> response.user.password = "Test1234!"

Expected: không trả field password; lưu mật khẩu dạng băm (bcrypt/argon2).
Actual: password trả plaintext, và so sánh user.password === password xác nhận đang lưu plaintext.
Fix: băm khi register, so sánh bằng bcrypt.compare, loại field password khỏi response.
Mức độ: Cao.
```

### Issue 3
- **Title:** `[Auth] Tài khoản bị khóa sau 2 lần sai thay vì 3`
- **Labels:** `bug`, `auth`, `medium`
- **Body:**
```
Vị trí: backend/server.js:54-57
login_attempts += 2 mỗi lần sai (thay vì +1), khóa khi >= 3 -> khóa ngay sau lần sai thứ hai, giữ 180s.

Tái hiện: đăng ký 1 tài khoản, login sai 2 lần, rồi login đúng -> vẫn HTTP 403 "Tài khoản đã bị khóa". login_attempts đi 0, 2, 4.

Expected: khóa sau 3 lần sai (+= 1, ngưỡng >= 3).
Actual: khóa sau 2 lần; có thể bị lạm dụng để khóa tài khoản người khác (DoS tài khoản).
Fix: const newAttempts = user.login_attempts + 1;
Mức độ: Trung bình.
```

### Issue 4
- **Title:** `[API] GET /api/products/:id không tồn tại trả {} kèm 200`
- **Labels:** `bug`, `api`, `medium`
- **Body:**
```
Vị trí: backend/server.js:161
if (!row) return res.status(200).json({});  // đáng lẽ 404

Tái hiện: curl "http://localhost:3000/api/products/9999" -> HTTP 200, body {}.
Expected: HTTP 404 với body báo lỗi.
Actual: 200 với body rỗng, client không phân biệt được "không tồn tại" với "rỗng"; assertion theo status dễ pass sai.
Fix: if (!row) return res.status(404).json({ error: "Product not found" });
Mức độ: Trung bình.
```

### Issue 5
- **Title:** `[API] GET /api/products/:id trả price kiểu string với id chẵn`
- **Labels:** `bug`, `api`, `low`
- **Body:**
```
Vị trí: backend/server.js:162
if (row.id % 2 === 0) row.price = row.price.toString();

Tái hiện:
curl http://localhost:3000/api/products/1 -> "price":30000000 (number)
curl http://localhost:3000/api/products/2 -> "price":"28000000" (string)

Expected: price luôn là number.
Actual: kiểu đổi theo tính chẵn/lẻ của id -> dễ làm hỏng phép tính phía client.
Fix: xóa dòng ép kiểu (server.js:162).
Mức độ: Thấp.
```
