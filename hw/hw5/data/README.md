# P0.2 - Dữ liệu data-driven cho JMeter

## Files

| File | Cột | Số dòng dữ liệu | Mục đích |
|---|---|---|---|
| `users.csv` | `email,password` | **300** | mỗi VU ở tải đỉnh có 1 account hợp lệ riêng |
| `products.csv` | `product_id,search_keyword,product_name,price` | 5 | tham số hoá cho các bước search / detail / cart / checkout |
| `register-users.js` | (không) | (không) | đăng ký hàng loạt 300 account vào SUT trước khi chạy test |

### `users.csv`

Danh sách chạy từ `perfuser001@eshop.com` tới `perfuser300@eshop.com`, mật khẩu dùng chung là `Perf12345!`.

Lưu ý là mấy account này không có sẵn trong seed của SUT. Seed chỉ dựng `admin@` với `test@` thôi. Mà `server.js` thì reseed lại DB mỗi lần khởi động, nên mình phải chạy `node data/register-users.js` một lần sau mỗi lần restart server để nạp lại đủ 300 account. Mình chạy và kiểm rồi: 300/300 account login đều trả `200`.

### `products.csv`

Mình chọn id 1, 3, 4, 5, cộng thêm 1 dòng lặp lại id 1 với keyword tiếng Việt (`Điện thoại`) cho query search đa dạng hơn. Dữ liệu này dùng cho: `?search=${search_keyword}`, rồi qua `products/${product_id}`, tiếp là cart `{id,name,price,quantity}`, cuối cùng checkout với `total_amount=${price}`.

Riêng id 2 thì mình tránh đưa vào assertion, tại detail của id chẵn trả về `price` kiểu string (bug này đã ghi ở P0). Vì vậy assertion phần detail bám theo `product_name` chứ không bám theo `price`.

---

## CSV Data Set Config đọc như thế nào

Component **CSV Data Set Config** của JMeter mở file đúng 1 lần rồi giữ 1 con trỏ dòng dùng chung. Mỗi khi có sampler hay thread cần biến, con trỏ nhảy xuống dòng kế tiếp và gán các cột vào biến tương ứng. Dưới đây là cấu hình mình đề xuất:

| Thuộc tính | Giá trị | Lý do |
|---|---|---|
| Filename | `../data/users.csv` (đường dẫn tương đối từ .jmx) | dễ mang đi khi nộp |
| Variable Names | `email,password` | (hoặc để trống nếu bật dòng header) |
| Ignore first line | `true` | bỏ dòng header |
| Delimiter | `,` | |
| **Sharing mode** | **All threads** | mọi VU rút account từ cùng 1 pool, không đụng nhau cùng lúc |
| **Recycle on EOF** | **true** | chạy dài (soak/stress) thì không lo hết dữ liệu |
| **Stop thread on EOF** | **false** | không dừng VU khi đọc hết file |

Với **`Recycle on EOF = true`**, khi con trỏ chạm cuối file (đọc hết 300 dòng) thì nó vòng lại dòng đầu, nghĩa là dữ liệu lặp lại không giới hạn. Cái này hợp với test kéo dài qua nhiều iteration.

Mình để **`users.csv` ở một CSV Data Set riêng, còn `products.csv` ở CSV Data Set thứ hai**. Như vậy mỗi iteration lấy 1 user và 1 product độc lập với nhau.

---

## Vì sao cần ĐỦ account cho số thread cao nhất (Stress/Spike)

Số dòng account (300) được chọn sao cho lớn hơn hoặc bằng số thread đỉnh của Stress/Spike (kế hoạch peak khoảng 300 VU ở P1.2). Có ba lý do:

1. **Tránh khóa tài khoản (lockout).** SUT khóa 1 account sau **2 lần login sai** trong 3 phút (bug +2, xem P0). Nếu nhiều VU xài chung 1 account rồi lỡ có lần login lỗi hay timeout dưới tải cao, account đó bị khóa ngay, kéo theo hàng loạt VU sau nhận **403** và số liệu throughput/error bị sai lệch. Cho mỗi VU 1 account riêng thì hết rủi ro này.
2. **Tránh contention giả tạo trên server.** Cart lưu **in-memory theo `userId`**, còn checkout thì **ghi bảng orders** theo user. Nhiều VU dùng chung 1 user sẽ dồn hết vào cùng 1 cart và cùng 1 luồng ghi, tạo ra tranh chấp *nhân tạo* không phản ánh đúng tải thật khi người dùng khác nhau.
3. **Realism.** Load/Stress/Spike vốn mô phỏng **nhiều người dùng khác nhau** đăng nhập cùng lúc. 1 account cho mỗi VU sát với hành vi production hơn.

> Nếu số account **ít hơn** số thread đỉnh mà lại bật Recycle, thì nhiều VU đang chạy cùng lúc sẽ **dùng trùng** account, dính đủ cả 3 vấn đề trên. Nên quy tắc ở đây là: **#account phải lớn hơn hoặc bằng max concurrent threads**. Khi cần tải cao hơn 300 VU, mình tăng `seq 1 N` ở bước sinh `users.csv` rồi chạy lại `register-users.js`.

## Quy trình dùng trước mỗi lần chạy test (P2)
```
1. node server.js                 # (restart -> DB reseed sạch)
2. node hw5/data/register-users.js  # nạp lại 300 account hợp lệ
3. jmeter -n -t <plan>.jmx ...      # chạy test
```
