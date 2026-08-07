# BÁO CÁO KẾT QUẢ KIỂM THỬ

## 1. Tổng quan Test Run

- Môi trường: PostgreSQL 16 (Docker), Node.js 20, Jest/Supertest.
- Dữ liệu: 5 users, 5 products, 200 orders và 4 coupons theo yêu cầu đề.
- Phạm vi kết quả: môi trường được tái tạo từ schema và mô tả các đối tượng lỗi trong
  đề, vì bài tập không cung cấp source/database gốc.
- Tổng số test: **12**.
- **Pass: 9 · Fail: 3 · Skip: 0**.

| Nhóm | Pass | Fail | Kết quả chính |
|---|---:|---:|---|
| Schema/Constraint | 2 | 0 | UNIQUE và stock âm đều bị chặn |
| Function/Trigger | 3 | 2 | function không giới hạn discount |
| Stored Procedure | 0 | 1 | checkout không atomic |
| Functional API | 2 | 0 | coupon và state transition được chặn |
| Security | 2 | 0 | SQLi và DROP TABLE được chặn |
| **Tổng** | **9** | **3** |  |

Lệnh tái hiện:

```bash
export DATABASE_URL='postgresql://test_owner:***@localhost:5432/n09_test'
export APP_USER_DATABASE_URL='postgresql://app_user:***@localhost:5432/n09_test'
export API_BASE_URL='http://127.0.0.1:3000'
npm test -- db-tests.test.js --runInBand
psql "$DATABASE_URL" -f performance.sql
```

## 2. Danh sách lỗi phát hiện

### BUG-01 — `fn_calculate_discount` cho discount vượt giá trị đơn hàng

- Input 1: `fn_calculate_discount('percent', 150, 200)`.
- Expected: `200`.
- Actual: `300`.
- Input 2: `fn_calculate_discount('fixed', 250, 200)`.
- Expected: `200`.
- Actual: `250`.
- Test case: `Function and trigger > fn_calculate_discount(...)`.
- Kết quả: **FAIL** ở 2 bộ dữ liệu biên; percent 10% và fixed 50 đều **PASS**.
- Root cause: function trả trực tiếp `order_amount * value / 100` hoặc `value`, không
  chặn kết quả theo `order_amount`.
- Ảnh hưởng: `final_amount` có thể âm; hệ thống hoàn tiền ngoài ý muốn.
- Fix đề xuất:

```sql
RETURN LEAST(
  GREATEST(calculated_discount, 0),
  GREATEST(order_amount, 0)
);
```

Đồng thời phải reject `discount_type` không hợp lệ và giá trị âm.

### BUG-02 — `sp_process_checkout` không rollback toàn bộ khi hết hàng

- Input: user hợp lệ; danh sách sản phẩm lần lượt có stock `20`, `10`, `0`.
- Expected: procedure báo lỗi; stock sau test vẫn là `[20, 10, 0]`; số order không đổi.
- Actual: procedure gặp sản phẩm thứ ba hết hàng nhưng stock còn lại
  `[19, 9, 0]`; số order không đổi.
- Test case: `Stored procedure atomicity > rolls back every stock change...`.
- Kết quả: **FAIL**.
- Root cause: exception hết hàng bị bắt nhưng không `RAISE` lại, nên các update trước
  đó vẫn được giữ; procedure kiểm tra và trừ stock từng sản phẩm thay vì kiểm tra toàn
  bộ trước.
- Fix đề xuất: chạy trong một transaction, khóa tất cả sản phẩm bằng
  `SELECT ... FOR UPDATE`, kiểm tra đủ stock trước khi update và để exception lan ra
  để PostgreSQL rollback toàn bộ.

### `trg_prevent_negative_stock`

- Input: `UPDATE products SET stock = -5`.
- Expected: câu lệnh bị từ chối.
- Actual: PostgreSQL báo lỗi check/trigger; stock không đổi.
- Metadata: trigger có đúng một bản ghi, gắn với `products` và đang enabled.
- Test case: hai test “rejects a negative product stock” và “trigger is attached...”.
- Kết quả: **PASS**.

### Schema, Functional API và Security

| Test case | Input | Actual | Trạng thái |
|---|---|---|---|
| UNIQUE email | chèn cùng email lần hai | SQLSTATE `23505` | PASS |
| Coupon hết hạn | `CP_EXPIRED`, amount 300 | HTTP 400 | PASS |
| State transition | `canceled -> delivered` | HTTP 400 | PASS |
| SQL Injection | `' OR '1'='1` | HTTP 200, `[]`, products vẫn có 5 dòng | PASS |
| RBAC | `app_user: DROP TABLE products` | SQLSTATE `42501`, bảng còn tồn tại | PASS |

SQL Injection được đánh giá bằng cả status, phạm vi kết quả và tính toàn vẹn dữ liệu.
Endpoint phải dùng parameterized query, ví dụ `WHERE name ILIKE $1`, không nối trực
tiếp chuỗi tìm kiếm vào SQL.

## 3. Kết quả hiệu năng

| Lần đo | Execution Time | Scan | Shared buffers | Kết luận |
|---|---:|---|---|---|
| Trước index | 0.151 ms | Seq Scan | hit=5 (orders: hit=2) | Baseline |
| Sau index | 0.148 ms | Seq Scan | hit=5 (orders: hit=2) | Planner không dùng index |

Môi trường đo: PostgreSQL 16 trong Docker, 5 users và 200 orders, đã chạy `ANALYZE`.
Index được tạo là `idx_orders_user_id ON orders(user_id)`.

Kế hoạch trước index:

```text
Sort (actual time=0.070..0.071 rows=5 loops=1)
  Sort Method: quicksort  Memory: 25kB
  Buffers: shared hit=5
  -> HashAggregate (actual time=0.053..0.055 rows=5 loops=1)
       Buffers: shared hit=2
       -> Seq Scan on orders
            (actual time=0.004..0.015 rows=200 loops=1)
            Buffers: shared hit=2
Planning Time: 0.343 ms
Execution Time: 0.151 ms
```

Kế hoạch sau index:

```text
Sort (actual time=0.072..0.073 rows=5 loops=1)
  Sort Method: quicksort  Memory: 25kB
  Buffers: shared hit=5
  -> HashAggregate (actual time=0.055..0.056 rows=5 loops=1)
       Buffers: shared hit=2
       -> Seq Scan on orders
            (actual time=0.004..0.015 rows=200 loops=1)
            Buffers: shared hit=2
Planning Time: 0.253 ms
Execution Time: 0.148 ms
```

Truy vấn tổng hợp cần đọc toàn bộ 200 rows, nên `Seq Scan` rẻ hơn index scan cộng heap
access. Index không làm thay đổi scan hoặc buffers. Chênh lệch 0.003 ms nằm trong
nhiễu đo và không đủ để kết luận có cải thiện.

## 4. Nhật ký AI/MCP và kiểm chứng catalog

Prompt:

> Liệt kê danh sách bảng, khóa ngoại, ràng buộc, trigger, function và stored
> procedure trong schema hiện tại. Với mỗi đối tượng, nêu tên, bảng liên quan và mục
> đích chính.

Tóm tắt phản hồi phân tích:

| Đối tượng | Bảng liên quan | Mục đích |
|---|---|---|
| `users` | `orders` | tài khoản và role |
| `products` | checkout | giá và tồn kho |
| `coupons` | apply-coupon | loại/mức giảm và hiệu lực |
| `orders` | `users` | đơn hàng, số tiền và trạng thái |
| FK `orders.user_id` | `orders -> users.id` | toàn vẹn tham chiếu, `ON DELETE CASCADE` |
| UNIQUE `users.email` | `users` | email không trùng |
| CHECK `products.stock` | `products` | stock không âm |
| CHECK coupon | `coupons` | type chỉ `percent`/`fixed` |
| CHECK order status | `orders` | giới hạn năm trạng thái |
| `trg_prevent_negative_stock` | `products` | chặn cập nhật stock âm |
| `fn_calculate_discount` | coupon/order | tính số tiền giảm |
| `sp_process_checkout` | products/orders | xử lý checkout và cập nhật stock |

Phần trên là nội dung AI hỗ trợ phân tích. Kết luận được đối chiếu bằng các catalog:
`information_schema.tables`, `pg_constraint`, `information_schema.triggers` và
`pg_proc`; kết quả xác nhận 4 bảng, FK/UNIQUE/CHECK, trigger, function và procedure
đúng tên. Hành vi của từng đối tượng tiếp tục được kiểm chứng bằng Jest/SQL, không
dùng phản hồi AI làm bằng chứng Pass/Fail.

## 5. Kết luận và khuyến nghị

Bộ kiểm thử bao phủ đủ 7 khía cạnh: Schema, Functional, Trigger, Stored Procedure,
Function, Security và Performance. Có 3 failures thuộc 2 root cause: discount không
được cap và checkout không atomic.

Ưu tiên sửa `sp_process_checkout` trước vì có thể làm sai tồn kho, sau đó sửa
`fn_calculate_discount`. Giữ parameterized queries và quyền tối thiểu cho `app_user`.
Không nên giữ index chỉ dựa trên giả định; với truy vấn tổng hợp hiện tại, planner đã
chọn `Seq Scan` hợp lý.
