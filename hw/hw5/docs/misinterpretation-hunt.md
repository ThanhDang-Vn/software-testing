# P3.2, Misinterpretation Hunt (Human Review of AI Analysis)

## Bảng tổng, 6 chỗ AI đọc/hiểu sai

| # | AI nói (P3.1) | Giá trị ĐÚNG từ raw jtl | Loại lỗi |
|---|---|---|---|
| 1 | "Max capacity **557 req/s**" | Sustained **~276 req/s** (overall 288/s) | Lấy 1 bucket artifact làm năng lực |
| 2 | "Avg **10ms**, thừa mọi SLA, hệ thống rất khỏe" | Endurance avg **1001ms**, p95 **1741ms** | Dùng avg của tải nhẹ đại diện cho mọi tải |
| 3 | "Memory **leak nhẹ** 53 thành 107MB" | RAM dao động 41–117MB, **48 lần giảm** tức là không leak | Chỉ nhìn điểm đầu–cuối |
| 4 | "Spike **giảm 55% năng lực** (55 vs 125 req/s)" | Cả hai peak **300 threads**, 0% error; throughput thấp do concurrency TB thấp | Nhầm throughput với capacity |
| 5 | "Load dẫn tới **capacity ~10 req/s**" | Cùng server soak được **~276 req/s** | Throughput demand-limited ≠ trần server |
| 6 | "0% error dẫn tới không điểm nghẽn" | Endurance **54.4%** request >1000ms | Bỏ qua latency; nghẽn ẩn dưới 0% error |

---

## Chi tiết từng lỗi

### Lỗi 1, "Max capacity 557 req/s" (overstate từ artifact)
- **AI nói:** *"Đạt đỉnh throughput ~557 req/s dẫn tới đây là năng lực tối đa của phần cứng."*
- **Raw jtl (`endurance/Endurance.jtl`):**
  `awk -F',' 'NR>1{...}'` nên **overall = 288.4 req/s** trên 717s (206.816 samples). Plateau các phút 3–11 dao động **262–309 req/s**, median **~276 req/s**. Bucket phút 7–8 = 556.9/s **gấp đôi** hai bucket kề (275 & 294) và **avg latency bucket đó tụt còn 537ms** (so với ~1080ms) dẫn tới dấu hiệu **GC/flush xả hàng đợi dồn**, không phải năng lực bền vững.
- **Lỗi:** lấy **1 điểm cực trị nhất thời** làm "max capacity". Con số đúng là **max STABLE ~276 req/s**.

### Lỗi 2, "Avg 10ms, thừa SLA, hệ thống rất khỏe"
- **AI nói:** *"Trung bình phản hồi dưới tải chỉ 10ms, nằm thừa trong mọi SLA."*
- **Raw jtl:** 10.4ms là avg của **Stress** (tt_mult=0.3, chưa bão hoà). Khi thật sự bão hoà (**Endurance**): **avg = 1001ms**, **p50 = 1042ms**, **p95 = 1741ms**, **p99 = 2383ms**, **max = 4229ms** (`awk` trên `Endurance.jtl`).
- **Lỗi:** dùng avg của **một kịch bản nhẹ** để tuyên bố cho **mọi tải**. Ở ngưỡng, phản hồi chậm gấp **~100 lần**.

### Lỗi 3, "Có memory leak nhẹ (53 thành 107MB)"
- **AI nói:** *"RAM node tăng 53MB thành 107MB dẫn tới có dấu hiệu memory leak nhẹ."*
- **Raw (`endurance/node-mem.csv`, 132 mẫu, đơn vị ≈MB):** min **41**, max **117**, mean **100**, last **107**, **số lần giảm = 48**. Leak thật thì đồ thị **tăng đơn điệu** (≈0 lần giảm) và không ổn định. Ở đây RAM **lên nhanh lúc warmup rồi dao động quanh ~100MB** suốt 12 phút.
- **Lỗi:** chỉ so **điểm đầu vs điểm cuối**, bỏ qua chuỗi thời gian ở giữa. **Không có leak.**

### Lỗi 4, "Spike làm giảm 55% năng lực"
- **AI nói:** *"Throughput giảm còn 55 req/s so với Stress 125 dẫn tới spike làm suy giảm ~55% năng lực."*
- **Raw jtl:** `Stress.jtl` và `Spike.jtl` **đều đạt peak allThreads = 300** (cột 13), **cả hai 0% error**. Throughput Spike thấp vì **concurrency trung bình cả run thấp** (nền 10 VU phần lớn thời lượng 245s, chỉ bơm 300 VU trong ~60s) dẫn tới tổng request ít hơn, **không phải server yếu đi**. Trong đúng lúc burst, latency có tăng (p95 **106ms**, max **769ms**) nhưng vẫn 0 lỗi và hồi phục.
- **Lỗi:** nhầm **throughput (phụ thuộc tải phát ra)** với **capacity (khả năng phục vụ)**. Hai run khác profile tải nên không so throughput trực tiếp được.

### Lỗi 5, "Load dẫn tới capacity ~10 req/s"
- **AI nói:** *"Hệ thống phục vụ khoảng 10 req/s ở chế độ điển hình" (đọc như trần).* 
- **Raw jtl:** Load = 50 VU **có think-time thật** nên throughput = 50×5 request / (~23s/iteration) ≈ **10 req/s** là **giới hạn bởi phía phát tải (closed model)**, không phải trần server. Bằng chứng: **cùng server** khi bỏ think-time soak được **~276 req/s** (`Endurance.jtl`).
- **Lỗi:** đọc **throughput đo được** thành **năng lực tối đa**. 10 req/s chỉ là *nhu cầu* ở Load, thấp hơn trần server **~27 lần**.

### Lỗi 6, "0% error dẫn tới không có điểm nghẽn"
- **AI nói:** *"0% error ở mọi kịch bản dẫn tới backend ổn định, không điểm gãy."*
- **Raw jtl:** đúng là error 0%, **nhưng** ở Endurance **54.4% request có elapsed > 1000ms** (112.532/206.816), p95 1741ms. Nghẽn **event-loop + ghi SQLite** biểu hiện bằng **độ trễ tăng vọt**, không bằng lỗi (Node **xếp hàng** thay vì reject).
- **Lỗi:** coi **0% error = khỏe**, bỏ qua **latency saturation**. Điểm nghẽn CÓ tồn tại, chỉ là ẩn dưới metric error.

---

## Threshold SỬA LẠI (sau human review)

| Metric | AI đề xuất (sai) | Sửa đúng (từ raw jtl) |
|---|---|---|
| Max **stable** throughput | 557 req/s | **~276 req/s** (plateau soak; overall 288/s) |
| Response time SLA | avg < 15ms | dùng **p95/p99**: Load p95 **19ms**, Stress p95 **32ms**/p99 **87ms**; cảnh báo khi **p95 > 200ms** |
| "Capacity" ở Load | 10 req/s | 10 req/s là **nhu cầu**, không phải trần; trần ~276/s |
| Memory alert | leak, >120MB | **không leak**; RAM ổn định ~100MB; chỉ alert nếu **tăng đơn điệu** nhiều phút |
| Đánh giá sức khoẻ | "rất khỏe" | Khỏe ở ≤125 req/s (p95<35ms); **bão hoà latency** khi ép tới ~276/s |
| Concurrent users an toàn | 300 VU | 300 VU **với think-time thật** OK (Stress p95 32ms); 300 VU **no-think** đã bão hoà |

**Kết luận review:** giữ tải mục tiêu **dưới ~276 req/s** và giám sát **p95/p99** (không phải avg) + **error%**. Không có memory leak. "0% error" ở đây **không** đồng nghĩa "không nghẽn", nghẽn nằm ở đuôi độ trễ.

---

# P3.3, Human review và quyết định cuối cùng của người làm bài

> Đây không phải phần “AI recommendation”. Tôi đóng vai người dùng/reviewer cuối, tự đối chiếu kết quả với test plan, raw JTL và kiến trúc thật của SUT. Các quyết định dưới đây do tôi chịu trách nhiệm; AI chỉ là công cụ tạo bản nháp và không có quyền quyết định pass/fail, capacity hay thay đổi hệ thống.

## Kiến trúc thật (cơ sở để phán xét)
- **Node.js + Express, 1 tiến trình, event-loop đơn luồng.**
- DB = **`sqlite3` (node-sqlite3), 1 file** `database.sqlite`, DB **nhúng**, không client-server, **1 handle** `new sqlite3.Database(...)`, writes **serialize khóa cả file**.
- **Không có index** ngoài PK (`database.js` chỉ CREATE TABLE, không CREATE INDEX).
- **Không set WAL** (journal mode mặc định = rollback/DELETE).
- Login: `SELECT * FROM users WHERE email=?` (**full scan**, không index email) + `jwt.sign`. Mật khẩu **so sánh plaintext** (`user.password === password`, `server.js:46`) dẫn tới **không tốn CPU hashing**.
- Search: `SELECT * FROM products WHERE name LIKE '%kw%'` (`server.js:144`) dẫn tới **leading wildcard, full scan**.
- Detail: `WHERE id=?` (PK index sẵn). Checkout: `INSERT INTO orders` (`server.js:301`) = **write path, điểm nghẽn chính**.
- Cart: object **in-memory** `userCarts` (không chạm DB).

## Các phương án do human reviewer tự đánh giá

| # | Phương án được xem xét | Quyết định của reviewer | Lý do (dựa code thật) |
|---|---|---|---|
| 1 | **Bật SQLite WAL** (`PRAGMA journal_mode=WAL`) | **Feasible (giá trị cao)** | Nghẽn là **ghi orders khi checkout**. WAL cho **reader không chặn writer** + commit rẻ hơn (kèm `synchronous=NORMAL`), giảm khóa toàn-file. Đúng bệnh, thêm 1 dòng. |
| 2 | **Index cho cột truy vấn** | **Feasible (có điều kiện)** | `CREATE INDEX idx_users_email ON users(email)` giúp login (đang full scan). **Chỉ đúng cho so khớp bằng/`=`**; xem #6. |
| 3 | **In-memory cache cho read** (detail/categories) | **Feasible** | Read-heavy (2/5 request), sản phẩm ít đổi nên cache detail theo id / categories cắt phần lớn SELECT. HTTP cache-header cũng được. |
| 4 | **Đổi sang `better-sqlite3`** | **Feasible (nuance)** | Nhanh hơn cho workload này (bỏ overhead async). Đồng bộ dẫn tới **chặn event-loop** nếu query lâu; hợp vì query ở đây ngắn. |
| 5 | **Prepared statements tái dùng** | **Feasible (nhỏ)** | Query đã parameterized; cache prepared stmt giảm chi phí parse. Lợi ích khiêm tốn. |
| 6 | **Index để tăng tốc `search`** | **Loại bỏ** | Search dùng `LIKE '%kw%'` **leading wildcard** dẫn tới **B-tree index không dùng được**. Nếu cần cải thiện phải thử FTS5 và đo lại, không suy đoán. |
| 7 | **Connection pool (vd size 100)** | **Loại bỏ** | SQLite là **DB nhúng dạng file**, không có kết nối mạng như Postgres/MySQL để pool. Mở nhiều handle vẫn serialize ghi và có thể tăng tranh chấp khóa. |
| 8 | **Horizontal scale nhiều instance dùng chung file** | **Loại bỏ** | Nhiều tiến trình ghi chung một file SQLite không giải quyết khóa ghi. Muốn scale ngang phải đổi kiến trúc lưu trữ trước và có test riêng chứng minh. |

### Phụ: đề xuất "biên giới"
| Đề xuất | Phân loại | Lý do |
|---|---|---|
| **Node cluster / worker_threads** | **Partial** | Giúp song song event-loop + CPU cho read, nhưng **ghi vẫn serialize** qua 1 file SQLite nên không gỡ được nghẽn checkout. |
| **Thêm Redis** | **Feasible nhưng over-engineering** | Đúng về kỹ thuật cho cache, nhưng thừa với SUT demo; #3 (in-memory) đủ. |

## Quyết định cuối cùng và trách nhiệm
- **Nên làm ngay (đúng bệnh nghẽn ghi + read-heavy):** ① WAL, ③ cache read, ② index `users.email`.
- **Cân nhắc:** ④ better-sqlite3, ⑤ prepared stmt, cluster (chỉ cho phần read).
- **Loại bỏ:** ⑦ connection pool, ⑧ scale chung file, ⑥ B-tree index cho `LIKE '%..%'`.
- **Không tự động triển khai bất kỳ phương án nào chỉ từ báo cáo này.** Mỗi thay đổi phải có baseline và A/B performance run cùng dữ liệu, phần cứng và profile tải.
- **Ngưỡng báo cáo cuối:** tải vận hành phải thấp hơn plateau khoảng **276 req/s**; theo dõi p95/p99 và error%, không dùng đỉnh 557 req/s hay average 10ms làm capacity/SLA.
- **Giới hạn kết luận:** 300 VU chỉ an toàn trong profile có think-time đã chạy; không được khái quát thành 300 VU an toàn cho no-think hoặc production khác phần cứng.
- **Trách nhiệm:** tôi chịu trách nhiệm cuối cùng về ba test plan, dữ liệu đầu vào, tiêu chí pass/fail và cách diễn giải. Các điểm chưa được test (soak dài hơn 12 phút, production traffic mix, load generator tách máy) được ghi là giới hạn, không được trình bày như sự thật đã chứng minh.

**Vì sao AI bỏ sót:** prompt phân tích ban đầu không bắt buộc phân đoạn theo pha, không yêu cầu p95/p99 hay kiểm tra chuỗi memory theo thời gian; model vì thế chọn metric tổng hợp dễ đọc và áp dụng mẫu suy luận chung. Closed-workload, think-time và cơ chế Node xếp hàng khiến endpoint vẫn trả 200 khi latency đã bão hòa, nên chỉ nhìn error rate/average rất dễ kết luận sai.
