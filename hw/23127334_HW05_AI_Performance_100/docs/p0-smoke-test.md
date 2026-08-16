# P0. Smoke Test & Contract Confirmation

- **Ngày chạy:** 2026-08-11 22:18 +0700
- **SUT:** EShop backend `http://localhost:3000` (Node + SQLite)
- **Cách khởi động:** `cd eshop-sut/backend && node server.js`
- **Lưu ý quan trọng:** `server.js` require `database.js`, mà `database.js` **DROP + reseed toàn bộ bảng mỗi lần khởi động**, nên cứ start server là DB lại tươi (orders với user đăng ký thêm đều bị xoá). Mình không cần chạy `node database.js` riêng.
- **Công cụ:** `curl`.

## Seed data (dùng cho test plan)

| Loại | Giá trị |
|---|---|
| Admin | `admin@eshop.com` / `Admin123!` (role=admin), *lưu ý setup_guide ghi nhầm `admin123`* |
| User | `test@eshop.com` / `Test1234!` (role=user) |
| Products | id **1–5** (1 iPhone, 2 Samsung, 3 MacBook, 4 AirPods, 5 Keychron) |
| Categories | 1 Điện thoại, 2 Laptop, 3 Phụ kiện |
| Coupons | `SAVE10` (10%, min 300k), `BIGBUY` (fixed 50k, min 500k), `VIP100` (fixed 100k, max 2), `EXPIRED` (hết hạn) |

> Chỉ có **2 user** được seed sẵn, nên mình cần đăng ký/seed thêm account cho phần tải cao (xử lý ở P0.2).

---

## Kết quả 5 endpoint trong workflow

### 1. `POST /api/login`. Auth-heavy
| Case | Status | Body |
|---|---|---|
| Đúng mật khẩu | **200** | `{"message":"Login successful","token":"<JWT>","user":{...}}` |
| Sai mật khẩu | **401** | `{"error":"Invalid email or password"}` |
| Tài khoản bị khóa | **403** | `{"error":"Tài khoản đã bị khóa. Vui lòng thử lại sau."}` |

- **Token:** JWT payload `{id, role, iat}`, ký HS256. Về **correlation**, mình extract field `token` từ body.
- **Bug bảo mật:** response `user` **lộ cả field `password`** dạng plaintext.

### 2. `GET /api/products?search=iPhone`. Read-heavy
- **200**, trả về một **mảng** sản phẩm khớp: `[{"id":1,"name":"iPhone 15 Pro Max","price":30000000,...}]`
- **Bug:** query dùng `LIKE '%<search>%'` nối chuỗi thô, dẫn tới **SQL Injection**.

### 3. `GET /api/products/:id`. Read-heavy
| Case | Status | Body |
|---|---|---|
| id **lẻ** (`/1`) | 200 | `price` là **number** `30000000` |
| id **chẵn** (`/2`) | 200 | `price` bị ép thành **string** `"28000000"` (bug) |
| không tồn tại (`/9999`) | **200** | trả `{}` thay vì 404 (bug) |

Chỗ này **ảnh hưởng tới assertion**: JSON assertion trên `price` phải chấp nhận cả number lẫn string; đừng lấy detail của id chẵn để assert giá trị chặt.

### 4. `POST /api/cart`. Transactional (cần token)
| Case | Status | Body |
|---|---|---|
| Không có token | **401** | `{"error":"Unauthorized"}` |
| Có Bearer token | **200** | `{"message":"Added to cart"}` |
- Body gửi: `{"id","name","price","quantity"}`. Cart lưu **in-memory theo userId**, mất khi restart.

### 5. `POST /api/checkout`. Transactional (cần token)
- **200**, `{"message":"Checkout successful","orderId":1}`, ghi vào bảng `orders` (SQLite **write**).
- Body: `{"total_amount","shipping_address"}`. **orderId** tăng dần, cần thì extract được.

---

## Cơ chế account-lockout (xác nhận thực nghiệm)

Mình test trên account throwaway `lockout_test@eshop.com`:

| Hành động | login_attempts sau đó | Kết quả |
|---|---|---|
| Sai mật khẩu lần 1 | **2** | 401 (chưa khóa) |
| Sai mật khẩu lần 2 | **4** | 401 |
| Đăng nhập lại bằng **mật khẩu đúng** | 4 | **403, đã bị khóa** |

**Kết luận (lệch so với tài liệu, do bug trong code):**
- Mỗi lần sai, `login_attempts` **cộng +2** (đáng lẽ +1), xem `server.js:54`.
- Code khóa khi `login_attempts >= 3`, nên thực tế **bị khóa chỉ sau 2 lần sai** chứ không phải 3.
- Thời gian khóa = **180000 ms = 180 giây = 3 phút** (`server.js:57`), `locked_until` lưu theo **UTC** (`...Z`).
- Trong lúc bị khóa, gõ **mật khẩu đúng vẫn trả 403**.
- Đăng nhập **thành công thì reset** `login_attempts=0, locked_until=NULL` (`server.js:47-50`).

### Cách RESET lockout giữa các lần chạy (cho Stress/Spike)
1. **Chờ 3 phút** cho `locked_until` hết hạn để nó tự mở khóa, hoặc
2. **Restart server** (`node server.js`), DB reseed sạch (mất orders), hoặc
3. Update trực tiếp SQLite: `UPDATE users SET login_attempts=0, locked_until=NULL;`

### Hệ quả cho thiết kế test plan
- Workflow perf dùng **credential HỢP LỆ** lấy từ CSV, login thành công thì attempts luôn reset về 0, tức là **KHÔNG kích hoạt lockout**. Đây đúng là thứ mình muốn (đo throughput thật, không bị nhiễu 403).
- Nếu **nhiều VU dùng CHUNG 1 account** và có bất kỳ race/timing nào gây ra 1–2 lần lỗi thì có thể vô tình khóa nhau. Vì vậy P0.2 sẽ cấp **mỗi VU 1 account riêng** để tránh.
- Hiện `test@eshop.com` đang ở `login_attempts=2` (do bước smoke test gõ sai mật khẩu), chỉ cần sai thêm 1 lần nữa là khóa; cái này sẽ được reset khi restart server trước lúc chạy thật.

---

## Chốt lại contract cho Phase 1 (thiết kế workflow)
| Bước | Method + Path | Auth | Extract | Assertion đề xuất |
|---|---|---|---|---|
| login | `POST /api/login` | (không) | `token` (JSON extractor) | code 200 + tồn tại `token` |
| search | `GET /api/products?search=${kw}` | (không) | (tùy) 1 product id | code 200 + body là mảng `[` |
| detail | `GET /api/products/${id}` | (không) | (không) | code 200 + chứa `"name"` (tránh assert `price` chặt) |
| add-to-cart | `POST /api/cart` | Bearer | (không) | code 200 + `"Added to cart"` |
| checkout | `POST /api/checkout` | Bearer | `orderId` | code 200 + `"Checkout successful"` |
