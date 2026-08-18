# HW06 — Test Identities and Repeatable State

Tài liệu này định nghĩa dữ liệu nền và vòng đời state cho ba API của HW06. Ba file JSON chỉ là fixture khởi đầu cho thiết kế/chạy collection, chưa phải bộ 35 test case cho mỗi API.

## 1. Identity và ID chuẩn sau reset

Backend seed lại SQLite mỗi khi khởi động và tạo dữ liệu theo thứ tự cố định:

| Biến Postman | Giá trị sau reset | Cách xác minh trước test |
| --- | ---: | --- |
| `adminId` | `1` | Login `admin@eshop.com`, lấy `user.id` từ response |
| `userId` | `2` | Login `test@eshop.com`, lấy `user.id` từ response |
| `categoryId` | `1` | Gọi `GET /api/categories`, chọn category seed đầu tiên và lưu `id` |
| `userToken` | động | Login user ở setup và lấy `token` |
| `adminToken` | động | Login admin ở setup và lấy `token` |

Giá trị `user_id=2` và `category_id=1` trong data file chỉ được coi là cố định khi suite bắt đầu từ database vừa reset. Collection setup vẫn phải login/query để xác minh. Nếu ID thực tế khác, dừng run thay vì âm thầm dùng một bản ghi khác; hoặc ghi đè iteration value bằng ID vừa xác minh theo một quy ước duy nhất.

## 2. Email unique cho registration

Không hard-code một email mới rồi dùng lại qua nhiều run. Ở collection-level pre-request script, tạo `runId` đúng một lần và tạo email theo iteration:

```javascript
if (!pm.collectionVariables.get('runId')) {
  const uuid = pm.variables.replaceIn('{{$randomUUID}}');
  pm.collectionVariables.set('runId', `${Date.now()}-${uuid}`);
}

if (pm.iterationData.get('email_mode') === 'run_unique') {
  const prefix = pm.iterationData.get('email_local_prefix');
  const domain = pm.iterationData.get('email_domain');
  const runId = pm.collectionVariables.get('runId');
  pm.variables.set(
    'generatedEmail',
    `${prefix}.${runId}.${pm.info.iteration}@${domain}`
  );
}
```

Mẫu tạo ra có dạng:

```text
hw06.register.<epoch>-<uuid>.<iteration>@example.test
```

- `runId` giúp các lần chạy Newman/Postman không đụng nhau.
- `iteration` giúp các dòng trong cùng data file không trùng nhau.
- Case duplicate có chủ đích dùng email seed cố định hoặc lưu lại chính `generatedEmail`; không tạo email mới giữa action lần một và lần hai.
- Không ghi email sinh động trở lại file JSON. Giá trị chỉ tồn tại trong scope của run.

## 3. Bốn pha cho mỗi test

### Setup

1. Bắt đầu suite bằng SQLite seed sạch.
2. Login user và admin; lưu token cùng ID lấy từ response.
3. Gọi `GET /api/categories`; xác minh category đã chọn tồn tại.
4. Tạo `runId`, `generatedEmail` hoặc `productRunSuffix`.
5. Khởi tạo stack cleanup rỗng, ví dụ `createdUserIds` và `createdProductIds`.

Setup không được tính là response của test action. Nếu setup thất bại, đánh dấu run là setup failure và không diễn giải thành bug của API đang test.

### Test action

Chỉ gửi request mục tiêu của dòng dữ liệu:

- Registration: `POST /api/register`.
- Coupon: `POST /api/apply-coupon`.
- Product: `POST /api/products` với auth profile tương ứng.

Không reset database giữa action và verification vì như vậy sẽ xóa chính state cần kiểm tra.

### Verification

- Luôn kiểm tra HTTP status và schema/body trực tiếp.
- Registration thành công: lưu `id`, sau đó có thể xác minh email qua admin users API.
- Coupon: đối chiếu `discount_amount` và `final_amount` bằng công thức từ FR-09. Không tự đặt quy tắc làm tròn nếu spec chưa quy định.
- Product thành công: lưu `id`, gọi `GET /api/products/:id` và so sánh field. Product bị từ chối: xác minh danh sách không chứa tên unique vừa gửi.
- Verification là read-only; không dùng bước verification để sửa dữ liệu cho test pass.

### Teardown

1. Xóa product theo các ID đã capture, theo thứ tự ngược với lúc tạo.
2. Xóa user registration theo ID đã capture bằng admin API; không xóa hai identity seed.
3. Nếu API từ chối cleanup, test bị ngắt giữa chừng, hoặc coupon usage có thể ảnh hưởng run sau, thực hiện reset SQLite toàn bộ.
4. Xóa các collection variable nhạy cảm/tạm thời: `userToken`, `adminToken`, `generatedEmail`, `createdProductId`, các cleanup stack và `runId`.

Teardown failure phải được báo riêng; không ghi đè kết quả test action.

## 4. Reset SQLite

File database nằm tại:

```text
hw/eshop-sut/backend/database.sqlite
```

Trong SUT hiện tại, `database.js` chạy `initDatabase()` khi backend khởi động; hàm này drop, tạo lại bảng và seed dữ liệu. Quy trình reset ưu tiên:

1. Dừng đúng tiến trình Node đang giữ cổng 3000.
2. Khởi động lại `node server.js` trong `hw/eshop-sut/backend`.
3. Chờ health check `GET /api/products` trả `200`.
4. Login hai identity seed và query categories để xác minh ID nền.

Nếu cần reset vật lý, chỉ khi backend đã dừng: sao lưu evidence cần giữ, xóa đúng file `hw/eshop-sut/backend/database.sqlite`, rồi khởi động backend để file được tạo và seed lại. Không xóa bằng glob và không xóa cả thư mục backend.

Reset sẽ xóa toàn bộ user/product/coupon-usage/order phát sinh. Vì vậy không chạy quy trình này trên database dùng chung hoặc dữ liệu cần bảo tồn.

## 5. Tránh làm bẩn state của test sau

- Chạy collection trên một backend local riêng; không chạy song song nhiều collection cùng dùng `database.sqlite`.
- Reset một lần ở suite setup, cleanup theo ID sau từng mutation, rồi reset lần cuối ở suite teardown.
- Mọi tên product và email tạo mới đều gắn `runId`; không tìm/xóa theo tên chung.
- Capture ID ngay từ response tạo mới. Teardown xóa đúng ID, không xóa “bản ghi cuối cùng”.
- Case guest/user product vẫn phải chuẩn bị cleanup: smoke test cho thấy SUT có thể tạo dữ liệu dù expected là bị từ chối.
- Các coupon có `max_uses_per_user` không được dùng chung state giữa các case độc lập. Reset trước nhóm usage-limit hoặc cấp identity riêng cho nhóm đó.
- Không cho case phụ thuộc vào thứ tự trừ khi case đó chủ ý kiểm tra một workflow stateful và ghi rõ quan hệ first/second action.
- Khi một assertion fail, vẫn chạy cleanup trong collection/folder teardown; nếu cleanup không hoàn tất, đánh dấu môi trường dirty và reset trước run tiếp theo.

## 6. Phạm vi dữ liệu hiện tại

Các fixture hiện tại chỉ cung cấp baseline và các partition thiết yếu:

- Registration: unique, duplicate seed và replay control.
- Coupon: biên bằng/ngay trên minimum và một coupon fixed độc lập.
- Product: guest, user và admin authorization profiles.

Chưa mở rộng thành bộ test đầy đủ về EP/BVA, malformed body, security, toàn bộ validation hoặc đủ 35 test case cho từng API.
