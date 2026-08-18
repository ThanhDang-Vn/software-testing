# HW06 — API Contract Matrix

## 1. Nguồn và quy ước

Ma trận này chỉ áp dụng cho ba API đã chọn:

1. `POST /api/register`
2. `POST /api/apply-coupon`
3. `POST /api/products`

Nguồn đối chiếu:

- `hw/eshop-sut/README.md`: FR-01, FR-09, FR-12, FR-15 và SEC-01..SEC-07.
- `hw/eshop-sut/api_specification.md`: request/response API công khai.
- `hw/eshop-sut/backend/server.js`: implementation observation tại thời điểm phân tích.

Quy ước:

- **SPEC EXPECTATION** là oracle lấy từ requirement và API specification. Bug hiện tại không làm thay đổi expected result.
- **IMPLEMENTATION OBSERVATION** chỉ mô tả route hiện có; không được dùng để hợp thức hóa sai lệch.
- `200` success được API specification nêu rõ cho registration và được các response mẫu/luồng thành công thể hiện cho hai API còn lại.
- Với các failure mà tài liệu không gắn status cụ thể, ma trận ghi status HTTP phù hợp với semantics của requirement và đánh dấu là **contract expectation**, không khẳng định đó là status đã được tài liệu nêu nguyên văn.
- Chưa sinh test case trong tài liệu này.

## 2. Ma trận tổng quan

| Thuộc tính | Registration | Apply coupon | Create product |
| --- | --- | --- | --- |
| Feature/requirement | FR-01; SEC-01, SEC-05 | FR-09; SEC-02, SEC-05 | FR-12, FR-15; SEC-02, SEC-03, SEC-04, SEC-05 |
| Method/path | `POST /api/register` | `POST /api/apply-coupon` | `POST /api/products` |
| Authentication | Public | JWT hợp lệ | JWT hợp lệ |
| Role | Không yêu cầu role | User đã đăng nhập; không yêu cầu admin | Chỉ `admin` |
| Content type | `application/json` | `application/json` | `application/json` |
| Success status | `200 OK` | `200 OK` | `200 OK` |
| Side effect chính | Tạo user role mặc định | Tính coupon; usage chỉ được ghi ở bước checkout liên quan | Tạo product |

## 3. `POST /api/register`

### 3.1 Feature, path, authentication và headers

| Mục | SPEC EXPECTATION | IMPLEMENTATION OBSERVATION |
| --- | --- | --- |
| Feature | FR-01 — Đăng ký tài khoản | Route tại `server.js:20-30` |
| Method/path | `POST /api/register` | Khớp |
| Authentication | Public; người chưa có tài khoản phải gọi được | Không có `authenticateToken`, khớp |
| Role | Không yêu cầu role; user mới không được tự chọn role | Route chỉ lấy `name`, `email`, `password`; không nhận `role` |
| Request headers | `Content-Type: application/json`; `Accept: application/json` được khuyến nghị | `bodyParser.json()` parse JSON; không kiểm tra `Accept` |
| Authorization header | Không bắt buộc | Bị bỏ qua nếu client gửi |

### 3.2 Request fields

| Field | Data type | Required/optional | SPEC EXPECTATION / constraints | IMPLEMENTATION OBSERVATION |
| --- | --- | --- | --- | --- |
| `name` | JSON string | Required | Họ tên phải được cung cấp; tài liệu không nêu min/max cụ thể | Được destructure và insert trực tiếp; route không kiểm tra missing, empty hay type |
| `email` | JSON string | Required | Đúng định dạng `user@domain.com`; duy nhất trong hệ thống | Route không validate format hoặc uniqueness trước insert |
| `password` | JSON string | Required | Tối thiểu 8 ký tự; có chữ hoa, chữ thường, chữ số và một ký tự đặc biệt thuộc `@ $ ! % * ? &` | Route không validate strength; truyền nguyên giá trị vào câu lệnh insert |
| `confirm_password` | JSON string | Required theo FR-01; không xuất hiện trong body của `api_specification.md` | Phải khớp `password`. Đây là khoảng trống giữa requirement và API specification cần được làm rõ, nhưng expected nghiệp vụ vẫn là từ chối khi không khớp | Route không đọc hoặc so sánh trường xác nhận mật khẩu |

Unknown fields không được specification định nghĩa. Contract an toàn là không dùng chúng để gán thuộc tính nhạy cảm như `role`; implementation hiện chỉ destructure ba field đã nêu.

### 3.3 Business rules và preconditions

#### SPEC EXPECTATION

- Email đúng format và chưa tồn tại.
- Password đạt toàn bộ quy tắc strong password.
- Password và confirmation khớp nhau.
- Password phải được lưu an toàn, không plaintext theo SEC-01.
- User mới được tạo với role người dùng mặc định; client không điều khiển role.
- Sau đăng ký UI chuyển tới trang login. Redirect UI không phải response contract trực tiếp của API.

Precondition: backend/database sẵn sàng; email mục tiêu chưa tồn tại đối với happy path.

#### IMPLEMENTATION OBSERVATION

- Route thực hiện một parameterized `INSERT INTO users (name, email, password)`.
- Không có validation trong route cho required, format email, uniqueness, password strength hoặc confirmation.
- `password` được đưa trực tiếp vào cột `password`; không thấy bước hash trong route.
- Lỗi insert bất kỳ được trả `500` với `err.message`, thay vì phân loại validation/duplicate.

### 3.4 Expected status codes và response schema

| Scenario | SPEC EXPECTATION | IMPLEMENTATION OBSERVATION |
| --- | --- | --- |
| Dữ liệu hợp lệ, email unique | `200 OK` | `200` qua `res.json(...)` |
| Thiếu field bắt buộc | `400 Bad Request` — contract expectation | Không validate ở route; kết quả phụ thuộc SQLite/schema |
| Email sai format | `400 Bad Request` — contract expectation | Không validate ở route |
| Password yếu hoặc confirmation không khớp | `400 Bad Request` — contract expectation | Không validate ở route |
| Email đã tồn tại | `409 Conflict` hoặc `400 Bad Request`; specification cần chốt một status | Không kiểm tra trước insert; mọi DB error nếu có được map thành `500` |
| JSON malformed | `400 Bad Request` | JSON middleware xử lý trước route |
| Lỗi server/database không dự kiến | `500 Internal Server Error` | `500 {error: err.message}` |

Success response:

```json
{
  "message": "User registered successfully",
  "id": 3
}
```

Schema:

| Field | Type | Required | Meaning |
| --- | --- | --- | --- |
| `message` | string | Yes | Thông báo đăng ký thành công |
| `id` | positive integer | Yes | ID user mới |

Expected error schema thống nhất:

```json
{
  "error": "Human-readable error message"
}
```

Specification chưa định nghĩa chi tiết error schema; implementation dùng object `error` khi database báo lỗi.

### 3.5 Side effects và supporting endpoints

Side effects expected:

- Tạo đúng một user mới.
- Không tạo user khi validation thất bại.
- Không trả password trong response.

Supporting endpoints:

| Endpoint | Mục đích |
| --- | --- |
| `POST /api/login` | Xác minh identity mới đăng nhập được sau registration |
| `GET /api/admin/users` | Admin xác minh đúng một user/email đã được tạo |
| `DELETE /api/admin/users/:id` | Teardown user vừa tạo |

### 3.6 Security mapping

| Security ID | Mức liên quan | Contract implication / observation |
| --- | --- | --- |
| SEC-01 | Trực tiếp | Password phải hash; route hiện truyền plaintext vào insert |
| SEC-02 | Không áp dụng cho quyền gọi | Registration phải public |
| SEC-03 | Không áp dụng | Không phải API admin |
| SEC-04 | Liên quan downstream | `name`/`email` phải được escape khi UI hiển thị; API không nên tạo trust boundary giả |
| SEC-05 | Trực tiếp | Insert phải parameterized; implementation dùng placeholders `?` |
| SEC-06 | Gián tiếp | Client không được set role; route hiện không nhận role |
| SEC-07 | Không áp dụng | Không phải OTP/reset-password |

## 4. `POST /api/apply-coupon`

### 4.1 Feature, path, authentication và headers

| Mục | SPEC EXPECTATION | IMPLEMENTATION OBSERVATION |
| --- | --- | --- |
| Feature | FR-09 — Mã giảm giá tại checkout | Route tại `server.js:363-441` |
| Method/path | `POST /api/apply-coupon` | Khớp |
| Authentication | JWT hợp lệ, vì C4 yêu cầu user đã đăng nhập | Route không gắn `authenticateToken` |
| Role | User authenticated; admin role không phải điều kiện của coupon | Route không đọc role |
| Request headers | `Content-Type: application/json`, `Accept: application/json`, `Authorization: Bearer <JWT>` | JSON được parse; Authorization không được route kiểm tra |
| Identity source | User ID phải lấy từ JWT/session, không tin giá trị client cho authorization | Route nhận `user_id` từ body và không ràng buộc với JWT identity |

### 4.2 Request fields

| Field | Data type | Required/optional | SPEC EXPECTATION / constraints | IMPLEMENTATION OBSERVATION |
| --- | --- | --- | --- | --- |
| `code` | JSON string | Required | Coupon tồn tại, `is_active=1`, còn hạn; so khớp code theo dữ liệu hệ thống | Chỉ kiểm tra truthy; query parameterized theo `code` và `is_active=1` |
| `total_amount` | JSON number | Required | Tổng tiền không âm; phải `>= min_order_amount`; phải phản ánh tổng checkout đáng tin cậy | Không validate type/range; dùng điều kiện `>` thay vì `>=` |
| `user_id` | JSON integer | API specification liệt kê trong body; về security identity phải đến từ JWT | Positive ID của chính user đang đăng nhập; dùng để kiểm tra usage limit | Optional theo nhánh code; falsy thì bỏ qua usage-limit lookup; không bind JWT |

FR-08 còn nói backend phải tự tính tổng checkout và không tin `total_amount` do client gửi. `api_specification.md` lại đưa `total_amount` vào request của apply-coupon. Đây là trust-boundary ambiguity: API có thể nhận amount để preview, nhưng quyết định giảm giá khi checkout phải dựa trên tổng do backend tính lại.

### 4.3 Business rules và preconditions

#### SPEC EXPECTATION

Tất cả năm điều kiện FR-09 phải cùng đúng:

1. Coupon tồn tại và active.
2. Thời điểm hiện tại trước `expired_at`.
3. `total_amount >= min_order_amount`.
4. User có JWT hợp lệ.
5. Usage count của chính user nhỏ hơn `max_uses_per_user`.

Phép tính:

- Percent: `discount_amount = total_amount × discount_value / 100`.
- Fixed: `discount_amount = discount_value`.
- `final_amount = total_amount - discount_amount`.

Preconditions: coupon seed/tương ứng tồn tại; user tồn tại và đăng nhập; tổng đơn hàng đã được backend xác định hoặc được kiểm tra lại; usage state sạch/đã biết.

#### IMPLEMENTATION OBSERVATION

- Không authenticate request.
- `user_id` có thể bỏ qua; khi bỏ qua, route vẫn tính coupon mà không kiểm tra usage count.
- Minimum dùng `total_amount > min_order_amount`, nên đúng tại biên bằng bị từ chối.
- Percent dùng `Math.floor(total_amount * (1 - coupon.discount_value))`, khác công thức percent trong FR-09.
- Usage count được đọc nếu body có `user_id`, nhưng apply-coupon không tự ghi usage. Việc ghi được tách sang `POST /api/coupon-usage`.
- Coupon lookup và usage lookup đều dùng parameterized queries.

### 4.4 Expected status codes và response schema

| Scenario | SPEC EXPECTATION | IMPLEMENTATION OBSERVATION |
| --- | --- | --- |
| Thỏa cả C1–C5 | `200 OK` | `200` |
| Thiếu/invalid JWT | `401 Unauthorized` | Route không kiểm tra token |
| JWT invalid/expired | `401` hoặc `403`; specification cần chốt | Route không kiểm tra token |
| Thiếu `code` hoặc body invalid | `400 Bad Request` | Thiếu/falsy code trả `400` |
| Coupon không tồn tại/inactive | `404 Not Found` | Trả `404` |
| Coupon expired | `400 Bad Request` | Trả `400` |
| Tổng dưới minimum | `400 Bad Request` | Trả `400`; implementation cũng từ chối trường hợp bằng minimum |
| Đạt usage limit | `400` hoặc `409`; specification cần chốt | Trả `400` khi có `user_id` và count đạt giới hạn |
| Lỗi database | `500 Internal Server Error` | Một số callback không xử lý `err` riêng; response behavior chưa nhất quán |

Success response schema:

```json
{
  "success": true,
  "coupon_id": 1,
  "discount_amount": 30000,
  "final_amount": 270000,
  "message": "Áp dụng thành công! Giảm 10%"
}
```

| Field | Type | Required | Constraint |
| --- | --- | --- | --- |
| `success` | boolean | Yes | `true` khi được áp dụng |
| `coupon_id` | positive integer | Yes | ID coupon được áp dụng |
| `discount_amount` | number | Yes | Không âm; đúng công thức; không lớn bất hợp lý so với total |
| `final_amount` | number | Yes | `total_amount - discount_amount`; không âm theo rule hợp lệ |
| `message` | string | Yes | Mô tả thành công |

Error response schema observed/expected:

```json
{
  "error": "Reason coupon was rejected"
}
```

### 4.5 Side effects và supporting endpoints

Side effects expected:

- Apply-coupon tính/validate discount; không tạo product/user/order.
- Usage chỉ được ghi khi nghiệp vụ checkout thành công, không phải chỉ vì preview coupon.
- Không tăng usage khi apply thất bại.

Implementation hiện không ghi usage trong route apply-coupon; supporting endpoint riêng chịu trách nhiệm ghi.

| Endpoint | Mục đích |
| --- | --- |
| `POST /api/login` | Lấy user JWT và identity |
| `GET /api/coupons` | Xác minh coupon setup; yêu cầu token theo API specification |
| `POST /api/coupon-usage` | Ghi usage sau checkout thành công |
| `POST /api/admin/coupons` | Setup coupon riêng cho test |
| `DELETE /api/admin/coupons/:id` | Teardown coupon test |
| `POST /api/checkout` | Supporting business flow tạo điều kiện ghi usage |

### 4.6 Security mapping

| Security ID | Mức liên quan | Contract implication / observation |
| --- | --- | --- |
| SEC-01 | Không trực tiếp | Không xử lý password |
| SEC-02 | Trực tiếp | FR-09 C4 yêu cầu JWT; route hiện không dùng middleware auth |
| SEC-03 | Không áp dụng | Apply coupon không phải admin-only |
| SEC-04 | Liên quan | Code/error/message khi hiển thị trên UI phải escape |
| SEC-05 | Trực tiếp | Coupon và usage lookup phải parameterized; implementation dùng placeholders |
| SEC-06 | Không áp dụng | Không cập nhật profile/role |
| SEC-07 | Không áp dụng | Không xử lý OTP |

## 5. `POST /api/products`

### 5.1 Feature, path, authentication và headers

| Mục | SPEC EXPECTATION | IMPLEMENTATION OBSERVATION |
| --- | --- | --- |
| Feature | FR-15 Product CRUD, chịu access control FR-12 | Route tại `server.js:167-177` |
| Method/path | `POST /api/products` | Khớp |
| Authentication | JWT hợp lệ | Route không gắn `authenticateToken` |
| Role | Chỉ `role=admin` | Route không kiểm tra role |
| Request headers | `Content-Type: application/json`, `Accept: application/json`, `Authorization: Bearer <admin JWT>` | JSON được parse; Authorization bị bỏ qua |

### 5.2 Request fields

| Field | Data type | Required/optional | SPEC EXPECTATION / constraints | IMPLEMENTATION OBSERVATION |
| --- | --- | --- | --- | --- |
| `name` | JSON string | Required | Không rỗng; tối đa 255 ký tự | Không validate required, type, empty hay max length |
| `price` | JSON number | Required | Số dương `> 0` | Không validate required, type hoặc range |
| `description` | JSON string | Optional theo requirement vì FR-15 không gọi là bắt buộc | Nội dung do user nhập phải được hiển thị an toàn | Insert trực tiếp qua parameter; có thể undefined/null |
| `imageUrl` | JSON string | Optional theo requirement | Nếu có, nên là URL hợp lệ; specification chỉ đưa ví dụ, không nêu constraint URL | Không validate |
| `category_id` | JSON integer | Required | Positive integer và phải tham chiếu category đang tồn tại | Không kiểm tra category tồn tại hoặc type |

Unknown fields không thuộc contract và không được tác động tới các thuộc tính ngoài năm field trên. Route hiện destructure đúng năm field.

### 5.3 Business rules và preconditions

#### SPEC EXPECTATION

- Request có JWT hợp lệ và claim `role=admin`.
- `name` required, non-empty, dài không quá 255 ký tự.
- `price` required và `> 0`.
- `category_id` required, trỏ tới category tồn tại.
- Tạo đúng một product; các product khác không đổi.
- Dữ liệu text khi render phải được escape theo SEC-04.

Preconditions: admin identity tồn tại và login thành công; category mục tiêu tồn tại; tên/marker test đủ unique để verification và teardown không nhầm bản ghi.

#### IMPLEMENTATION OBSERVATION

- Không có authentication hoặc role middleware.
- Không có validation field/range/category existence.
- Insert dùng parameterized query với năm giá trị request.
- Mọi lỗi insert được map thành `500`; success trả `200` và ID mới.

### 5.4 Expected status codes và response schema

| Scenario | SPEC EXPECTATION | IMPLEMENTATION OBSERVATION |
| --- | --- | --- |
| Admin + body hợp lệ | `200 OK` | `200` |
| Không token | `401 Unauthorized` | Route vẫn xử lý insert |
| Token invalid/expired | `401` hoặc `403`; specification cần chốt | Route vẫn xử lý insert |
| User token, role khác admin | `403 Forbidden` | Route vẫn xử lý insert |
| Thiếu required field | `400 Bad Request` | Không validate ở route |
| `name` empty hoặc >255 | `400 Bad Request` | Không validate ở route |
| `price <= 0` hoặc sai type | `400 Bad Request` | Không validate ở route |
| Category không tồn tại | `400 Bad Request` hoặc `422 Unprocessable Content`; specification cần chốt | Không lookup category ở route |
| JSON malformed | `400 Bad Request` | JSON middleware xử lý trước route |
| Database failure | `500 Internal Server Error` | `500 {error: err.message}` |

Success response schema:

```json
{
  "message": "Product created",
  "id": 6
}
```

| Field | Type | Required | Meaning |
| --- | --- | --- | --- |
| `message` | string | Yes | Xác nhận tạo product |
| `id` | positive integer | Yes | ID product mới |

Expected error schema:

```json
{
  "error": "Reason product was rejected"
}
```

API specification chưa định nghĩa error schema chi tiết; implementation dùng `error` cho database error.

### 5.5 Side effects và supporting endpoints

Side effects expected:

- Success tạo đúng một product với dữ liệu đã normalize/validate.
- Auth/validation failure không tạo product.
- Không thay đổi category hoặc product khác.

Supporting endpoints:

| Endpoint | Mục đích |
| --- | --- |
| `POST /api/login` | Lấy admin/user token để tạo các role partition |
| `GET /api/categories` | Chọn và xác minh `category_id` tồn tại |
| `GET /api/products` | Xác minh absence/presence theo unique name |
| `GET /api/products/:id` | Xác minh product vừa tạo và field persistence |
| `DELETE /api/products/:id` | Teardown product đã capture ID; theo spec phải dùng admin token |

### 5.6 Security mapping

| Security ID | Mức liên quan | Contract implication / observation |
| --- | --- | --- |
| SEC-01 | Không áp dụng | Không xử lý password |
| SEC-02 | Trực tiếp | Mutation phải yêu cầu JWT; route hiện không authenticate |
| SEC-03 | Trực tiếp | Phải kiểm tra `role=admin`; route hiện không kiểm tra token hoặc role |
| SEC-04 | Trực tiếp downstream | Name/description/image data phải được escape khi UI render |
| SEC-05 | Trực tiếp | Insert phải parameterized; implementation dùng placeholders |
| SEC-06 | Không áp dụng | Không cập nhật profile/role |
| SEC-07 | Không áp dụng | Không xử lý OTP |

## 6. Danh sách chênh lệch cần giữ nguyên khi thiết kế expected

| ID | API | SPEC EXPECTATION | IMPLEMENTATION OBSERVATION |
| --- | --- | --- | --- |
| GAP-REG-01 | Register | Validate required fields, email format/uniqueness, password strength và confirmation | Route không có các validation này |
| GAP-REG-02 | Register | SEC-01: password không lưu plaintext | Route đưa password nhận được trực tiếp vào insert |
| GAP-REG-03 | Register | Validation/duplicate trả client error phù hợp | Route map mọi insert error thành `500` |
| GAP-CPN-01 | Coupon | JWT hợp lệ, identity lấy từ token | Route public và tin `user_id` trong body |
| GAP-CPN-02 | Coupon | `total_amount >= min_order_amount` | Route dùng `>` |
| GAP-CPN-03 | Coupon | Percent = `total × discount_value / 100` | Route dùng `floor(total × (1 - discount_value))` |
| GAP-CPN-04 | Coupon | Usage limit gắn với user authenticated | Có thể bỏ `user_id` để bỏ qua lookup usage |
| GAP-PRD-01 | Product | JWT bắt buộc | Route public |
| GAP-PRD-02 | Product | Chỉ admin | Route không kiểm tra role |
| GAP-PRD-03 | Product | Validate name, price và category | Route insert không validation |

Các GAP trên là đầu vào cho human review và thiết kế test ở bước sau. Chúng không phải test case và không thay đổi oracle trong cột SPEC EXPECTATION.
