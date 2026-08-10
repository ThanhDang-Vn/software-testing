# Mini API Testing — GET `/api/products`

- Sinh viên: **23127334**
- API: `GET /api/products`
- Base URL: `http://localhost:3000`
- Query tùy chọn: `search` (chuỗi)
- Provider được đối chiếu: `hw/eshop-sut/backend/server.js`, ngày 10/08/2026

## 1. Contract và giả định đã kiểm chứng

Không truyền `search`, provider trả toàn bộ 5 sản phẩm seed. Có `search`, provider dùng SQLite `LIKE '%<search>%'`; tìm kiếm không phân biệt hoa/thường với ký tự ASCII. Response thành công có status `200`, `Content-Type: application/json` và body là mảng. Mỗi phần tử hiện có các field: `id` (integer), `name` (string), `price` (integer), `description` (string), `imageUrl` (string), `category_id` (integer). Không tìm thấy trả mảng rỗng `[]`, vẫn là `200`.

## 2. Prompt đã dùng ở bước Generate with AI

> Bạn là kỹ sư kiểm thử API. Hãy thiết kế từng bước ít nhất 12 test case cho `GET http://localhost:3000/api/products`, query tùy chọn `search`. Happy response là HTTP 200, JSON array; mỗi product bắt buộc có `id` integer, `name` string, `price` integer, `description` string, `imageUrl` string, `category_id` integer. Không tìm thấy trả `[]` với HTTP 200. Hãy lần lượt bao phủ: (1) equivalence partitions của search: bỏ qua, khớp, không khớp, rỗng; (2) boundary/Unicode/ký tự đặc biệt; (3) schema và Content-Type; (4) performance; (5) security với SQL injection/XSS và header auth không cần thiết. Đây chỉ là môi trường local, dùng payload không phá hoại. Không suy đoán pagination hoặc authentication. Trước tiên liệt kê giả định. Sau đó trả bảng đúng các cột `tc_id`, `input`, `expected status`, `expected fields`, `rationale`; mỗi case chỉ có một mục tiêu chính.

## 3. AI output rút gọn

Giả định AI nêu: `search` được URL-encode; endpoint public; không có pagination; chuỗi rỗng tương đương không truyền query; phép tìm kiếm không phân biệt hoa/thường; input nguy hiểm phải được xử lý an toàn và không gây lỗi 500.

| tc_id | input | expected status | expected fields | rationale |
|---|---|---:|---|---|
| AI-01 | Không có `search` | 200 | Array; mọi item đủ 6 field đúng kiểu | Happy path và contract cơ bản |
| AI-02 | `search=iPhone` | 200 | 1 item, `name` chứa `iPhone` | Partition khớp chính xác một sản phẩm |
| AI-03 | `search=Pro` | 200 | Mọi `name` chứa `Pro` | Partition khớp nhiều sản phẩm |
| AI-04 | `search=iphone` | 200 | 1 item iPhone | Kiểm tra không phân biệt hoa/thường |
| AI-05 | `search=__NO_SUCH_PRODUCT__` | 200 | Mảng rỗng | Partition không khớp |
| AI-06 | `search=` | 200 | Toàn bộ sản phẩm | Boundary chuỗi rỗng |
| AI-07 | `search=%20` | 200 | Mảng rỗng | Phân biệt whitespace với empty |
| AI-08 | `search=é` | 200 | JSON array, không lỗi | Unicode phải được xử lý an toàn |
| AI-09 | `search=%25` (`%`) | 200 | Mảng chỉ chứa tên có `%` | Ký tự `%` nên được hiểu literal |
| AI-10 | `search=' OR '1'='1` | 200 hoặc 400 | Không leak toàn bộ data; JSON error/array an toàn | Phát hiện SQL injection |
| AI-11 | `search=<script>alert(1)</script>` | 200 hoặc 400 | Không echo HTML thực thi; không 500 | XSS/sanitization |
| AI-12 | Không có `Authorization` | 200 | Array sản phẩm | Endpoint public không được yêu cầu token |
| AI-13 | Không có `search` | 200 | `Content-Type` chứa `application/json` | Contract header |
| AI-14 | Không có `search` | 200 | Response time dưới 1000 ms | Ngưỡng hiệu năng local |

## 4. Audit của con người

| TC | Nhãn | Nhận xét hoặc chỉnh sửa |
|---|---|---|
| AI-01 | VALID | Khớp code và dữ liệu seed; schema đã được xác nhận trực tiếp từ bảng `products`. |
| AI-02 | VALID | Seed có đúng một `iPhone 15 Pro Max`, nên expected count 1 là xác định. |
| AI-03 | VALID | Seed có ba tên chứa `Pro`: iPhone, MacBook Pro và AirPods Pro; bổ sung expected count = 3. |
| AI-04 | VALID | SQLite `LIKE` mặc định không phân biệt hoa/thường đối với ASCII, phù hợp dữ liệu này. |
| AI-05 | VALID | Provider gọi `res.json(rows)` và SQLite trả mảng rỗng khi không khớp. |
| AI-06 | VALID | Trong Express, `req.query.search` là chuỗi rỗng (falsy), nên nhánh trả toàn bộ sản phẩm được dùng. |
| AI-07 | VALID | Một dấu cách là truthy và hiện không tên seed nào chứa dấu cách đơn lẻ như một truy vấn độc lập; kết quả thực tế vẫn có thể khớp vì tên có khoảng trắng, do đó sửa expected thành “mảng có thể chứa sản phẩm có khoảng trắng”, không dùng trong execution. |
| AI-08 | VALID | Unicode được truyền qua query parser; mục tiêu hợp lý là không crash và trả JSON array. |
| AI-09 | INVALID | Code ghép trực tiếp vào `LIKE`; `%` là wildcard, không phải literal, nên thực tế trả toàn bộ sản phẩm. Case gốc giả định escaping không tồn tại; sửa expected thành 5 item và ghi nhận defect sanitization. |
| AI-10 | VALID | Đây là test security quan trọng: code nối chuỗi SQL trực tiếp nên có khả năng trả sai phạm vi dữ liệu; không đưa vào 5 iteration pass mà ghi nhận lỗ hổng cần sửa bằng parameterized query. |
| AI-11 | VALID | Payload benign; endpoint không echo query, vì vậy mong đợi `[]` hoặc 400 và tuyệt đối không 500 là hợp lý. |
| AI-12 | VALID | Route không có middleware `authenticateToken`, do đó public access phải trả 200. |
| AI-13 | VALID | `res.json` của Express đặt Content-Type JSON; đây là assertion tự viết bắt buộc. |
| AI-14 | INCOMPLETE | Ngưỡng 1000 ms hợp lý cho local/CI nhưng có thể flaky trên runner lạnh; vẫn giữ theo guide và tách riêng assertion performance. |

Chỉnh sửa tối thiểu đã thực hiện: AI-09 được đổi từ kỳ vọng `%` là literal sang hành vi thật (wildcard, 5 item), đồng thời kết luận đây là khoảng trống input sanitization. AI-07 cũng được làm rõ vì tên sản phẩm chứa khoảng trắng.

## 5. Extend — test case tự bổ sung

| tc_id | Input | Expected | Vì sao AI bỏ sót |
|---|---|---|---|
| EXT-01 | Header `X-Student-Id: 23127334`, không có search | 200 và request thực sự mang đúng header | Header định danh là quy ước riêng của bài tập, không thuộc contract API được mô tả trong prompt. |
| EXT-02 | `search` dài 4096 ký tự `A` | Không 500, response vẫn là JSON; chấp nhận 200 `[]` hoặc 4xx có kiểm soát | Model ưu tiên các partition thường gặp và không biết provider không giới hạn chiều dài query. |

## 6. Năm iteration được thực thi

`mini-products.data.json` dùng EXEC-01 đến EXEC-05: toàn bộ danh sách, tìm đúng `iPhone`, kiểm tra case-insensitive, khớp nhiều `Pro`, và không tìm thấy. Mỗi iteration kiểm tra status, header request `X-Student-Id`, Content-Type, response time, số phần tử, schema của từng phần tử và điều kiện lọc tên.

## 7. Postman features

| Feature | Đã dùng? | Ghi chú |
|---|---|---|
| Collections | Có | Collection chứa request data-driven cho API products. |
| Environment variables | Có | `baseUrl` và `studentId` nằm trong environment local. |
| Collection variables | Có | `apiPath=/api/products` được tái sử dụng trong URL. |
| Pre-request scripts | Có | Script upsert header `X-Student-Id` và log MSSV. |
| Test scripts (assertions) | Có | Assert status, header, thời gian, count, filter và JSON Schema. |
| Data-driven runs | Có | 5 object trong file iteration JSON được đọc bằng `pm.iterationData`. |
| Newman CLI | Có | Chạy CLI và xuất reporter JSON. |
| Monitors | Không | Không cần lịch chạy cloud cho bài local/CI này. |
| Mock servers | Không | Provider thật chạy cục bộ nên không dùng mock. |
| Workspaces | Có | Các artifact được tổ chức trong workspace/repository của bài. |

Tổng số feature đã dùng: **8/10**, đạt yêu cầu tối thiểu 6.

## 8. Lệnh tái lập

Terminal 1, tại `hw/eshop-sut/backend`:

```powershell
node server.js
```

Terminal 2, tại thư mục bài nộp:

```powershell
newman run mini-products.postman_collection.json `
  --environment mini-local.postman_environment.json `
  --iteration-data mini-products.data.json `
  --reporters cli,json `
  --reporter-json-export mini-newman-report.json
```

## 9. CI pass/fail có chủ đích

Workflow thật nằm ở `.github/workflows/newman-api-test.yml`; bản sao để nộp nằm trong thư mục này. Để tạo bằng chứng fail, đổi tạm `EXEC-01.expected_status` từ `200` thành `999`, commit/push và chụp Actions thành `ci-fail.png`. Sau đó khôi phục `200`, commit/push, đợi workflow xanh và chụp `ci-pass.png`. Hai ảnh phải là ảnh chụp GitHub Actions thật, không được tạo giả từ local.
