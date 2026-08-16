# P1.1. E2E Virtual-User Workflow Design

> Mình dùng **một** workflow duy nhất, **giữ nguyên không đổi** cho cả 3 test plan Load / Stress / Spike.
> 3 plan chỉ khác nhau ở **profile tải** (thread count, ramp-up, pattern), còn các bước với logic thì y hệt.
> Chưa sinh JMeter test plan ở đây; đây là bản thiết kế để P1.3 dựa theo mà dựng JMX.

## Business journey
```
[1] login  →  [2] search products  →  [3] product detail  →  [4] add-to-cart  →  [5] checkout
   (auth)          (read)                 (read)               (transactional)   (transactional)
```

## Biến dùng trong workflow
| Nguồn | Biến | Mô tả |
|---|---|---|
| CSV `users.csv` | `${email}`, `${password}` | credential hợp lệ, mỗi VU dùng 1 account |
| CSV `products.csv` | `${product_id}`, `${search_keyword}`, `${product_name}`, `${price}` | tham số sản phẩm |
| Extract (login) | `${authToken}` | JWT lấy từ response login, dùng lại cho bước 4,5 |
| Extract (search) | `${found_id}` | id sản phẩm đầu tiên trong kết quả search (correlation động), default = `${product_id}` |
| Extract (checkout) | `${orderId}` | id đơn hàng vừa tạo, coi như bằng chứng giao dịch thành công |
| Tính toán | `${qty}`, `${total_amount}` | qty ngẫu nhiên 1–3; total = price × qty |

---

## Chi tiết từng bước

### Bước 1. LOGIN  *(Auth-heavy)*
| Khía cạnh | Nội dung |
|---|---|
| **API request** | `POST /api/login` · body JSON `{"email":"${email}","password":"${password}"}` |
| **CSV input** | `${email}`, `${password}` (users.csv) |
| **Correlation/extract** | JSON Extractor: `${authToken}` từ `$.token` |
| **Assertion** | (a) Response Code = **200**; (b) JSON path `$.token` tồn tại và khác rỗng |
| **Think-time** | **2–5s** sau login (user nhìn trang chủ), dùng Gaussian/Uniform Random Timer |
| **Phụ thuộc** | Không (đây là bước đầu). **Cung cấp** `authToken` cho bước 4 và 5 |
| **Khi fail** | Nếu code khác 200 hoặc không có token thì mình **không** chạy các bước cần auth. Bọc bước 4–5 trong **If Controller** kiểm `${authToken}` không rỗng để tránh loạt 401 gây nhiễu. Sample bị đánh **fail** (tính vào error%). Không dừng thread (Thread Group: *on sample error = Continue*) |

> Ghi chú: login đúng credential thì SUT reset `login_attempts=0` nên **không kích hoạt lockout**. Đây là ý đồ để đo throughput thật.

### Bước 2. SEARCH PRODUCTS  *(Read-heavy)*
| Khía cạnh | Nội dung |
|---|---|
| **API request** | `GET /api/products?search=${search_keyword}` |
| **CSV input** | `${search_keyword}` (products.csv) |
| **Correlation/extract** | JSON Extractor: `${found_id}` từ `$[0].id` (id đầu tiên trong mảng), **Default = `${product_id}`** khi mảng rỗng |
| **Assertion** | (a) Code = **200**; (b) response bắt đầu bằng `[` (tức là mảng) |
| **Think-time** | **3–8s** (quét danh sách kết quả) |
| **Phụ thuộc** | Chạy sau login trong journey (API search vốn public, không bắt buộc token). **Cung cấp** `found_id` cho bước 3 |
| **Khi fail** | Extract thất bại thì `found_id` rơi về `${product_id}` (CSV), thành ra bước 3 vẫn chạy được. Sample đánh fail nhưng **tiếp tục** |

### Bước 3. PRODUCT DETAIL  *(Read-heavy)*
| Khía cạnh | Nội dung |
|---|---|
| **API request** | `GET /api/products/${found_id}` |
| **CSV input** | gián tiếp qua `${found_id}` (default `${product_id}`) |
| **Correlation/extract** | (tùy chọn) `$.name` để kiểm chứng; giá thì lấy `${price}` từ CSV để né bug price-string ở id chẵn |
| **Assertion** | (a) Code = **200**; (b) body **chứa `"name"`** và **khác `{}`** (chặn bug not-found trả `{}`+200). **Không** assert `price` (id chẵn trả string) |
| **Think-time** | **5–12s** (đọc mô tả/ảnh, đây là bước lâu nhất) |
| **Phụ thuộc** | `found_id` từ bước 2 |
| **Khi fail** | Đánh fail; vẫn có thể sang bước 4 bằng dữ liệu CSV. **Tiếp tục** |

### Bước 4. ADD-TO-CART  *(Transactional)*
| Khía cạnh | Nội dung |
|---|---|
| **API request** | `POST /api/cart` · Header `Authorization: Bearer ${authToken}` · body `{"id":${found_id},"name":"${product_name}","price":${price},"quantity":${qty}}` |
| **CSV input** | `${product_name}`, `${price}` (products.csv); `${qty}` = random 1–3 (`__Random`) |
| **Correlation/extract** | Không |
| **Assertion** | (a) Code = **200**; (b) body chứa **`Added to cart`** |
| **Think-time** | **2–5s** (quyết định thanh toán) |
| **Phụ thuộc** | `authToken` (b1), `found_id`/`product_name`/`price` (b2–3). **Bọc trong If Controller `${authToken}`≠rỗng** |
| **Khi fail** | Thiếu token thì 401 (đã chặn bằng If Controller). Đánh fail, **tiếp tục** |

### Bước 5. CHECKOUT  *(Transactional)*
| Khía cạnh | Nội dung |
|---|---|
| **API request** | `POST /api/checkout` · Header `Authorization: Bearer ${authToken}` · body `{"total_amount":${total_amount},"shipping_address":"123 Le Loi, Q1, TP.HCM"}` |
| **CSV input** | `${price}` để tính `${total_amount}` = price × qty |
| **Correlation/extract** | JSON Extractor: `${orderId}` từ `$.orderId` (bằng chứng ghi DB thành công) |
| **Assertion** | (a) Code = **200**; (b) body chứa **`Checkout successful`**; (c) `$.orderId` tồn tại |
| **Think-time** | **1–3s** (kết thúc journey; hoặc dùng làm pacing giữa các iteration) |
| **Phụ thuộc** | `authToken` (b1), cart đã add (b4). **Bọc trong If Controller `${authToken}`≠rỗng** |
| **Khi fail** | 401/500 thì đánh fail, kết thúc iteration; VU bước sang vòng lặp mới với account/product kế tiếp |

---

## Chiến lược think-time và pacing
- Mình đặt **timer con** (Gaussian Random Timer: constant + deviation, hoặc Uniform Random Timer) sau mỗi sampler.
- Tổng think-time mỗi iteration khoảng **13–33s**, phản ánh nhịp duyệt web thật, tránh chuyện "đập" server phi thực tế.
- Con số này ảnh hưởng trực tiếp tới throughput kỳ vọng: với N VU thì RPS xấp xỉ N × (5 request) / (thời-gian-1-iteration). P1.2 sẽ dựa vào đó để chọn thread count.

## Chiến lược xử lý lỗi (dùng chung cho cả 3 plan)
1. Thread Group: **On sample error = Continue** (1 sample fail không giết cả VU).
2. **If Controller** bọc bước 4 và 5 kiểm `${authToken}` ≠ rỗng, không bắn request auth vô nghĩa khi login lỗi (giữ error% phản ánh đúng lỗi thật).
3. **Assertion** làm sample chuyển đỏ, nhờ đó error% và report chính xác.
4. Extract có **default value** nên lỗi read không làm sập cả chuỗi (search fail vẫn còn product_id từ CSV).

---

## Workflow phủ 3 nhóm endpoint thế nào

| Nhóm | Bước phủ | Đặc tính tải tạo ra |
|---|---|---|
| **Auth-heavy** | [1] login | Mỗi iteration ký 1 JWT + SELECT users theo email + (có thể) UPDATE login_attempts, tức là **CPU + DB read**. Lặp liên tục thì tạo áp lực xác thực cao, đồng thời chạm vào logic account-lockout. |
| **Read-heavy** | [2] search + [3] detail | **2/5 request là GET đọc DB**: search `LIKE '%kw%'` (full-table scan, tốn hơn), detail SELECT theo id (index PK). Chiếm phần lớn request, giống thương mại điện tử thật (đọc nhiều). |
| **Transactional** | [4] add-to-cart + [5] checkout | Ghi trạng thái: cart in-memory + **checkout INSERT vào bảng `orders` (ghi SQLite)**. Đây là điểm nghẽn chính vì SQLite khóa ghi toàn DB. Cũng là chỗ Stress/Spike dễ lộ giới hạn nhất. |

**Vì sao 1 workflow là đủ:** mỗi vòng lặp của mỗi VU đều chạm **cả 3 nhóm** theo tỉ lệ thật (1 auth : 2 read : 2 write). Khi Load/Stress/Spike đổi **số VU và pattern**, cả 3 nhóm cùng bị nén tải theo, thành ra so 3 kịch bản là công bằng (cùng workflow, khác cường độ), khớp yêu cầu §6 "cả 3 test plan chạy chung một E2E workflow phủ cả 3 nhóm".

---

## Sơ đồ (một iteration của 1 VU)
```
 CSV(users) ─┐
             ├─►[1 POST /api/login]──extract authToken──┐
 CSV(users) ─┘         │ assert 200 + token             │
                       ▼ think 2–5s                     │
             [2 GET /api/products?search=kw]            │
 CSV(products)         │ extract found_id (def product_id)
                       │ assert 200 + is array          │
                       ▼ think 3–8s                     │
             [3 GET /api/products/found_id]             │
                       │ assert 200 + has "name"        │
                       ▼ think 5–12s                    │
   If authToken≠"" ──► [4 POST /api/cart  (Bearer)]  ◄──┤
                       │ assert 200 + "Added to cart"   │
                       ▼ think 2–5s                     │
   If authToken≠"" ──► [5 POST /api/checkout (Bearer)]◄─┘
                       │ extract orderId
                       │ assert 200 + "Checkout successful"
                       ▼ think 1–3s → next iteration
```

## Chưa làm ở bước này
- Chưa chọn con số tải cụ thể (thread/ramp/duration/pattern), phần đó để **P1.2**.
- Chưa sinh file `.jmx`, phần đó để **P1.3**.
