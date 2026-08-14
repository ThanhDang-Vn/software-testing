# P1.2 - Tham số tải cho Load / Stress / Spike

> Cả 3 plan dùng chung **một workflow** (P1.1), chỉ khác nhau ở **profile tải**. Mình chưa sinh JMX.
> Mấy con số bên dưới là **điểm khởi đầu có căn cứ**; mình sẽ **hiệu chỉnh sau lần Load baseline** (P2) khi đã biết RPS/latency thật của phần cứng, theo đúng tinh thần "tìm ngưỡng bằng thực nghiệm".

## Đặc tính SUT quyết định con số
- **Node.js đơn tiến trình** (event-loop 1 luồng) cộng với **SQLite 1 file** (checkout `INSERT` khóa ghi toàn DB), chạy trên **laptop của sinh viên**.
- Mình dự đoán bottleneck xuất hiện theo thứ tự: (1) ghi `orders` khi checkout, (2) search `LIKE '%kw%'` full-scan, (3) event-loop khi số kết nối đồng thời lên cao.
- Mình chỉ có **300 account**, nên **peak 300 VU** (mỗi VU ứng với 1 account). Muốn đông hơn thì phải regenerate accounts.

## Phép tính RPS kỳ vọng (để hiểu vì sao chọn think-time theo scenario)
Mỗi iteration gồm 5 request. RPS ≈ `VU × 5 / (thời-gian-1-iteration)`.

| Think-time/iteration | 50 VU | 300 VU |
|---|---|---|
| **Thực tế 13–33s** (≈23s) | ~11 req/s | ~65 req/s |
| **Nén ~3s** | ~80 req/s | ~450 req/s |

Với think-time **thực tế**, 300 VU chỉ ra ~65 req/s, nhiều khả năng **chưa đủ đẩy SUT tới ngưỡng gãy**. Thành ra mình để **think-time làm knob theo scenario** (parameter hoá bằng JMeter property `${__P(tt_mult,1)}`): **workflow (chuỗi request, correlation, assertion) mình GIỮ NGUYÊN không đụng vào**, chỉ có hệ số think-time là thay đổi. Đây là cách làm chuẩn để "stress đến gãy" trên phần cứng hạn chế.

---

## LOAD - `23127334_Load_20260811`  (tải điển hình ổn định)

| Tham số | Giá trị | Justify |
|---|---|---|
| Thread (VU) | **50** | Mô phỏng chừng 50 khách mua cùng lúc trong "giờ bận" của một shop nhỏ, mức điển hình chứ không cực đoan. |
| Ramp-up | **60s** (~0.83 VU/s) | Tăng dần cho khỏi sốc lúc khởi động; tầm 1 phút là đủ 50 VU vào ổn định. |
| Think-time | **Thực tế 100%** (Gaussian, tổng ~13–33s/iter) | Bám đúng nhịp duyệt web thật, đo hiệu năng ở tải "đời thường". |
| Hold duration | **300s (5 phút)** | Đủ dài để đạt steady-state ổn định cho **Summary Report** (trung bình/percentile hội tụ). |
| Loop | Forever + scheduler dừng theo duration | |
| Kỳ vọng | error% ≈ 0, p95 thấp và phẳng, RPS ~10–15 | Đây là **baseline** để đem so với Stress/Spike. |
| Listener | **Summary Report** (+ HTML dashboard) | |

## STRESS - `23127334_Stress_20260811`  (tăng bậc đến khi gãy)

| Tham số | Giá trị | Justify |
|---|---|---|
| Pattern | **Stepping**: 50 tới 300 VU, **+50 mỗi 60s** (6 bậc), mỗi bậc ramp ~10s rồi giữ 60s | Tăng theo bậc để **định vị "knee"**: xem bậc nào RPS ngừng tăng, p95 leo dốc, error% vọt lên. |
| Think-time | **Nén (tt_mult ≈ 0.3, ~3–7s/iter)** | Tăng cường độ trên mỗi VU để chạm ngưỡng mà khỏi cần tới hàng nghìn thread (coi bảng RPS). Workflow vẫn nguyên. |
| Hold mỗi bậc | 60s | Đủ để từng mức tải đạt trạng thái tạm ổn rồi mới đọc số. |
| Ramp-down | 60s về 0 | Xem hệ thống phục hồi ra sao. |
| Tổng thời lượng | ~7–8 phút | |
| Kỳ vọng | Tới một bậc nào đó: RPS bão hoà, p95 và error% tăng vọt, tức là **ngưỡng phần cứng**. | |
| Listener | **Aggregate Report** (+ HTML) | percentile 90/95/99 theo từng sampler, nhìn ra điểm gãy rõ ràng. |
| Tool | Stepping Thread Group / Concurrency Thread Group (jpgc), *fallback stock:* Thread Group ramp 300 threads/300s (tăng liên tục thay vì theo bậc). |

## SPIKE - `23127334_Spike_20260811`  (nền thấp + bơm đột ngột rồi rút)

| Pha | Cấu hình | Justify |
|---|---|---|
| Nền (baseline) | **10 VU**, giữ 60s | Trạng thái bình thường, tải nhẹ. |
| **Spike** | Bơm lên **300 VU trong ~5s**, giữ 60s | Mô phỏng flash-sale hay đợt truy cập đột biến, kiểm tra sức chịu tải tức thời cùng lỗi/kết nối bị từ chối. |
| Recover | Rút về **10 VU**, giữ 120s | Đo **phục hồi**: p95/error% có về lại baseline không, có rò rỉ hay đơ kéo dài không. |
| (tuỳ chọn) | Lặp spike lần 2 | Kiểm tra tính lặp lại. |
| Think-time | **Nén (tt_mult ≈ 0.3)** | Cho cú bơm đủ "gắt". |
| Tổng thời lượng | ~4–5 phút | |
| Listener | **View Results Tree** (+ HTML) | Coi từng request lúc spike (mã lỗi, response bị từ chối). Lưu ý VRT khá nặng, nên cấu hình **"Log/Display Only: Errors"** hoặc ghi ra file, còn số tổng hợp thì dựa vào HTML. |
| Tool | Ultimate Thread Group (jpgc) hoặc 2 Thread Group (baseline chạy suốt + spike có scheduler delay). |

---

## Bảng so sánh 3 scenario

| Thuộc tính | **Load** | **Stress** | **Spike** |
|---|---|---|---|
| Mục tiêu | tải điển hình ổn định (baseline) | tìm ngưỡng gãy | chịu và phục hồi sau đột biến |
| VU pattern | 50 phẳng | 50 tới 300 bậc +50/60s | 10 tới 300 (5s) rồi về 10 |
| Ramp-up | 60s | ~10s/bậc | 5s (cú bơm) |
| Think-time | thực tế 100% | nén ~0.3× | nén ~0.3× |
| Thời lượng | 5 phút | ~7–8 phút | ~4–5 phút |
| Peak VU | 50 | 300 | 300 |
| RPS kỳ vọng | ~10–15 | tăng đến bão hoà | dao động mạnh |
| Kỳ vọng error% | ~0 | tăng vọt tại knee | tăng lúc spike, giảm khi recover |
| Listener (khác nhau) | **Summary Report** | **Aggregate Report** | **View Results Tree** |
| Điều **giữ nguyên** | chuỗi 5 request, correlation, assertion, CSV, cấu trúc (workflow §P1.1) | | |
| Điều **thay đổi** | thread count, ramp, pattern, hệ số think-time, thời lượng | | |

## Điểm hiệu chỉnh sau Load baseline (P2)
1. Chạy Load 50 VU rồi đo RPS và p95 thật.
2. Nếu ở 300 VU (think nén) mà vẫn chưa gãy thì tăng peak VU (regenerate accounts) hoặc nén think tiếp.
3. Nếu gãy quá sớm (<100 VU) thì nới think-time hoặc giảm bước nhảy cho định vị knee mịn hơn.
4. Chốt con số cuối rồi mới sinh JMX (P1.3).

## Chưa làm
- Chưa sinh `.jmx`, để dành cho **P1.3**.
