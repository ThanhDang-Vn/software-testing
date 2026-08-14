# P3.1 — AI Performance Analysis (RAW AI OUTPUT)

> ⚠️ **Đây là output thô do AI (Claude) tạo khi được yêu cầu "phân tích các .jtl như một analyst và đề xuất threshold".**
> Chưa qua human review. Bản này sẽ được soi lại ở **P3.2 (misinterpretation hunt)** — có thể chứa chỗ đọc/hiểu sai metric.
> Nguồn dữ liệu: `results/jtl/{Load,Stress,Spike}.jtl`, `results/endurance/Endurance.jtl`, `results/endurance/node-mem.csv`.

---

## 1. Tổng quan (AI reading)

Tôi đã phân tích 4 bộ log JMeter của workflow e-commerce (login → search → detail → add-to-cart → checkout) trên EShop backend. **Tin tốt: hệ thống rất khỏe — cả 4 kịch bản đều đạt 0% error, cho thấy backend ổn định và còn nhiều dư địa mở rộng.**

| Scenario | Samples | Avg (ms) | Throughput | Error% | Đánh giá nhanh |
|---|--:|--:|--:|--:|---|
| Load (50 VU) | 3.599 | 7 | 10 req/s | 0% | Xuất sắc, độ trễ rất thấp |
| Stress (→300 VU) | 46.076 | 10 | 125 req/s | 0% | Khỏe, gần như không đổi so với Load |
| Spike (10→300→10) | 13.531 | 28 | 55 req/s | 0% | Có tụt throughput → nhạy cảm với spike |
| Endurance (300 VU, 12′) | 206.816 | ~1000 | **557 req/s (đỉnh)** | 0% | Đạt đỉnh ~557 req/s |

**Nhận định tổng:** trung bình phản hồi dưới tải (Stress) chỉ **10ms**, nằm thừa trong mọi SLA hợp lý. Hệ thống **không có điểm gãy** trong dải đã test.

---

## 2. Phân tích từng scenario + threshold đề xuất

### 2.1 Load (50 VU) — baseline
- Avg 7ms, throughput 10 req/s, 0% error. Đây là hiệu năng "nghỉ ngơi" của hệ thống.
- **Capacity đọc được:** hệ thống phục vụ khoảng **10 req/s** ở chế độ điển hình.
- **Threshold đề xuất:** avg response < **10ms**, error < 1%. Vì Load rất nhẹ nên có thể coi 10 req/s là mức vận hành an toàn hằng ngày.

### 2.2 Stress (→300 VU) — tăng dần
- Avg 10ms, max 418ms, throughput 125 req/s, 0% error.
- Avg gần như không tăng so với Load (7→10ms) ⇒ **backend hầu như không bị ảnh hưởng khi lên 300 VU**.
- **Threshold đề xuất:** giữ avg < **15ms** và throughput mục tiêu ~**125 req/s**. Vì error 0% tới 300 VU, có thể tự tin phục vụ 300 người dùng đồng thời.

### 2.3 Spike (10→300→10) — đột biến
- Avg 28ms, throughput 55 req/s, 0% error.
- Throughput **giảm còn 55 req/s** so với Stress 125 req/s ⇒ **spike làm hệ thống suy giảm ~55% năng lực**; đây là điểm yếu trước tải đột biến.
- **Threshold đề xuất:** trong sự kiện spike, chấp nhận avg tăng tới ~**30ms**; cảnh báo nếu throughput rớt dưới 50 req/s.

### 2.4 Endurance (300 VU no-think, 12′) — soak
- **Đạt đỉnh throughput ~557 req/s** (bucket phút 7–8) ⇒ đây là **năng lực tối đa (max capacity)** của phần cứng.
- RAM node tăng từ **53MB → 107MB** trong 12 phút ⇒ **có dấu hiệu memory leak nhẹ**, nên theo dõi thêm trong các bài chạy dài hơn.
- 0% error ⇒ ổn định về mặt lỗi.
- **Threshold đề xuất:** đặt trần công suất ở **557 req/s**; cảnh báo memory nếu vượt 120MB.

---

## 3. Threshold tổng hợp (AI đề xuất)

| Metric | Ngưỡng đề xuất | Cơ sở |
|---|---|---|
| Avg response time | < 15 ms | avg Stress chỉ 10ms |
| Error rate | < 1% | mọi run đều 0% |
| Max sustainable throughput | **557 req/s** | đỉnh đo được ở endurance |
| Concurrent users an toàn | 300 VU | Stress 300 VU vẫn 0% error |
| Memory alert | > 120 MB | RAM chạm 107MB cuối soak |

---

## 4. Kết luận thô của AI

Hệ thống EShop backend **rất khỏe và không có điểm nghẽn**: trung bình phản hồi ~10ms dưới tải nặng, 0% lỗi ở mọi kịch bản, và đạt tối đa **~557 req/s**. Rủi ro duy nhất cần theo dõi là **khả năng rò rỉ bộ nhớ nhẹ** (53→107MB) và **sự suy giảm throughput khi gặp spike** (giảm còn 55 req/s). AI đề xuất đặt SLA ở avg < 15ms, error < 1% và cảnh báo memory >120MB.

> Phần “AI recommendations” đã được bỏ. File này chỉ giữ lại output phân tích thô để làm đối tượng kiểm chứng; mọi quyết định cuối cùng nằm trong human review ở `misinterpretation-hunt.md` và `p1-human-review.md`.
