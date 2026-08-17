# P0 Smoke Test — HW06 API Testing

## 1. Phạm vi và môi trường

- SUT: EShop backend chạy tại `http://localhost:3000`.
- Thời gian chạy hợp lệ: 2026-08-17 16:38–16:39 (UTC+7). Header `Date` của server dùng GMT.
- Công cụ gọi API: `curl.exe` trên PowerShell.
- Nguồn expected: `hw/eshop-sut/api_specification.md` và các yêu cầu FR-09, FR-12, FR-15 trong `hw/eshop-sut/README.md`.
- Tài khoản seed dùng để lấy JWT:
  - User: `test@eshop.com`, `role=user`, `id=2`.
  - Admin: `admin@eshop.com`, `role=admin`, `id=1`.
- JWT được gửi đầy đủ trong request thật nhưng được thay bằng `<redacted-user-token>` và `<redacted-admin-token>` trong tài liệu.

Các response malformed JSON phát sinh trong lúc xử lý escape của PowerShell đã bị loại khỏi kết quả. Các mục dưới đây chỉ ghi những request có JSON hợp lệ và được server parse thành công.

## 2. Tóm tắt expected và actual

| Case | Expected theo spec | Actual từ HTTP thật | Đối chiếu |
| --- | --- | --- | --- |
| Register hợp lệ | `200`, đăng ký thành công và trả `id` | `200`, `id=3` | Khớp |
| Coupon `total_amount = 300000` | Thành công vì `total_amount >= min_order_amount`; giảm `30000`, còn `270000` | `400`, báo chưa đủ ngưỡng | Không khớp |
| Coupon `total_amount = 300001` | `200`; giảm `30000.1`, còn `270000.9` | `200`; giảm `-2700009`, còn `3000010` | Status khớp, phép tính không khớp |
| Product không token | `401` vì API thay đổi dữ liệu yêu cầu JWT admin | `200`, tạo product `id=6` | Không khớp |
| Product với user token | `403` vì `role=user` không phải admin | `200`, tạo product `id=7` | Không khớp |
| Product với admin token | `200`, tạo product | `200`, tạo product `id=8` | Khớp |

## 3. POST `/api/register`

### Expected theo spec

Với `name`, email chưa tồn tại và password hợp lệ, API trả `200 OK` cùng message đăng ký thành công và ID người dùng mới.

### Request thực tế

```http
POST /api/register HTTP/1.1
Host: localhost:3000
Accept: application/json
Content-Type: application/json

{"name":"HW06SmokeUser","email":"hw06.smoke.20260817@eshop.test","password":"Smoke123!"}
```

Lệnh curl tương đương:

```powershell
curl.exe -i -X POST "http://localhost:3000/api/register" `
  -H "Accept: application/json" `
  -H "Content-Type: application/json" `
  --data-raw '{"name":"HW06SmokeUser","email":"hw06.smoke.20260817@eshop.test","password":"Smoke123!"}'
```

### Actual

```http
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8
Content-Length: 49

{"message":"User registered successfully","id":3}
```

Kết quả khớp expected trong phạm vi smoke test hợp lệ này.

## 4. POST `/api/apply-coupon`

Coupon seed được dùng là `SAVE10`: giảm 10%, `min_order_amount=300000`, còn hạn và đang active. Hai request dùng user `id=2` và gửi user JWT hợp lệ để thỏa điều kiện đăng nhập trong FR-09.

### 4.1 `total_amount` bằng `min_order_amount`

#### Expected theo spec

FR-09 quy định tổng đơn hàng **lớn hơn hoặc bằng** ngưỡng. Với `300000 = 300000`, expected là thành công, `discount_amount=30000` và `final_amount=270000`.

#### Request thực tế

```http
POST /api/apply-coupon HTTP/1.1
Host: localhost:3000
Accept: application/json
Content-Type: application/json
Authorization: Bearer <redacted-user-token>

{"code":"SAVE10","total_amount":300000,"user_id":2}
```

#### Actual

```http
HTTP/1.1 400 Bad Request
Content-Type: application/json; charset=utf-8
Content-Length: 98

{"error":"Đơn hàng chưa đủ giá trị tối thiểu 300,000 ₫ để áp dụng mã này"}
```

Actual không khớp điều kiện biên `>=` trong spec.

### 4.2 `total_amount` lớn hơn `min_order_amount`

#### Expected theo spec

Với `total_amount=300001`, expected là `200 OK`. Theo công thức percent, `discount_amount=30000.1` và `final_amount=270000.9`. Spec chưa nêu quy tắc làm tròn nên giữ kết quả toán học để đối chiếu.

#### Request thực tế

```http
POST /api/apply-coupon HTTP/1.1
Host: localhost:3000
Accept: application/json
Content-Type: application/json
Authorization: Bearer <redacted-user-token>

{"code":"SAVE10","total_amount":300001,"user_id":2}
```

#### Actual

```http
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8
Content-Length: 128

{"success":true,"coupon_id":1,"discount_amount":-2700009,"final_amount":3000010,"message":"Áp dụng thành công! Giảm 10%"}
```

Status thành công nhưng `discount_amount` âm và `final_amount` lớn hơn tổng ban đầu, không khớp công thức trong FR-09.

## 5. POST `/api/products` — authorization thực tế

Ba request chỉ khác trạng thái authorization. Mỗi request dùng tên và giá riêng để nhận diện bản ghi được tạo.

### Expected chung theo spec

API thêm sản phẩm là thao tác dành cho Admin. FR-12 yêu cầu cả JWT hợp lệ và `role=admin` cho `POST /api/products`:

- Không token: expected `401 Unauthorized` và không tạo dữ liệu.
- User token: expected `403 Forbidden` và không tạo dữ liệu.
- Admin token: expected thành công và tạo sản phẩm.

### 5.1 Không token

#### Request thực tế

```http
POST /api/products HTTP/1.1
Host: localhost:3000
Accept: application/json
Content-Type: application/json

{"name":"HW06SmokeGuestProduct","price":101001,"description":"guest-smoke","imageUrl":"https://example.test/guest.png","category_id":1}
```

#### Actual

```http
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8
Content-Length: 36

{"message":"Product created","id":6}
```

Actual không khớp expected `401`; response thật xác nhận request không token đã tạo product.

### 5.2 User token

#### Request thực tế

```http
POST /api/products HTTP/1.1
Host: localhost:3000
Accept: application/json
Content-Type: application/json
Authorization: Bearer <redacted-user-token>

{"name":"HW06SmokeUserProduct","price":101002,"description":"user-smoke","imageUrl":"https://example.test/user.png","category_id":1}
```

#### Actual

```http
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8
Content-Length: 36

{"message":"Product created","id":7}
```

Actual không khớp expected `403`; response thật xác nhận token có `role=user` vẫn tạo được product.

### 5.3 Admin token

#### Request thực tế

```http
POST /api/products HTTP/1.1
Host: localhost:3000
Accept: application/json
Content-Type: application/json
Authorization: Bearer <redacted-admin-token>

{"name":"HW06SmokeAdminProduct","price":101003,"description":"admin-smoke","imageUrl":"https://example.test/admin.png","category_id":1}
```

#### Actual

```http
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8
Content-Length: 36

{"message":"Product created","id":8}
```

Actual khớp expected thành công của admin.

## 6. Kết luận sơ bộ dựa trên response chạy thật

Các kết luận sau chưa phải bug report chính thức; đây là sai lệch sơ bộ đã được tái hiện qua HTTP response thực tế:

1. Registration happy path hoạt động đúng contract đã mô tả.
2. Coupon `SAVE10` từ chối đúng tại biên bằng `min_order_amount`, trái với điều kiện `>=` của FR-09.
3. Coupon được chấp nhận khi lớn hơn ngưỡng nhưng số tiền giảm và số tiền cuối không tuân theo công thức FR-09.
4. `POST /api/products` cho phép cả request không token và user token tạo dữ liệu. Điều này không khớp yêu cầu authorization của FR-12/FR-15.
5. Admin token tạo product thành công như expected.

Không có kết luận nào ở trên chỉ dựa trên việc đọc source code; mỗi sai lệch đều có status và response body thực tế trong báo cáo này.
