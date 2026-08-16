# P2.3 - Endurance / Soak Test - Threshold

- Plan: `23127334_Endurance_20260811.jmx`, cấu hình 300 VU, no think-time (tt_mult=0), ramp 60s, hold 720s.
- Kéo dài: 12 phút · Tổng samples: 206816 · Error: 0 (0.00%)
- Raw: `Endurance.jtl` · HTML: `html/index.html` · Memory: `node-mem.csv` (giá trị xấp xỉ MB, tính bằng phần nghìn của KB)

## KẾT LUẬN - Ngưỡng phần cứng (máy Tony, i7-12700H)

| Chỉ số | Giá trị |
|---|---|
| Max stable RPS (mức plateau giữ được lâu) | ~275.9 req/s (throughput trung bình cả 12′ = 288.4/s) |
| Đỉnh bucket bất thường (chỉ là artifact, không giữ được) | ~556.9 req/s (1 bucket, do GC/flush xả hàng đợi) |
| Memory ceiling (node.exe RSS đỉnh) | ~117 MB (lúc đầu ~53MB, cuối tầm ~107MB) |
| Error% suốt 12 phút | 0.00% |
| Hành vi tại ngưỡng | throughput chạm trần ~275.9/s, độ trễ phình to (avg ~1s, max ~4.2s) nhưng không reject request nào (node xếp hàng chờ) |

## Diễn tiến theo thời gian (bucket 60s)

| Phút | Samples | RPS | Err% | Avg (ms) | p95 (ms) |
|--:|--:|--:|--:|--:|--:|
| 0–1 | 12163 | 202.7 | 0.00% | 861 | 2308 |
| 1–2 | 13083 | 218.1 | 0.00% | 1368 | 2423 |
| 2–3 | 14082 | 234.7 | 0.00% | 1286 | 2416 |
| 3–4 | 16632 | 277.2 | 0.00% | 1076 | 1637 |
| 4–5 | 16554 | 275.9 | 0.00% | 1089 | 1507 |
| 5–6 | 16384 | 273.1 | 0.00% | 1097 | 1546 |
| 6–7 | 16516 | 275.3 | 0.00% | 1088 | 1576 |
| 7–8 | 33416 | 556.9 | 0.00% | 537 | 1015 |
| 8–9 | 17637 | 293.9 | 0.00% | 1021 | 1463 |
| 9–10 | 16046 | 267.4 | 0.00% | 1119 | 1637 |
| 10–11 | 18533 | 308.9 | 0.00% | 973 | 1485 |
| 11–12 | 15770 | 262.8 | 0.00% | 1066 | 1497 |

## Nhận định
- Hệ thống không hề "gãy cứng". Kể cả khi chạy no-think với 300 VU, error vẫn ~0% suốt 12 phút, tức là Node/Express xếp request vào hàng đợi chứ không trả lỗi. Ngưỡng phần cứng ở đây lộ ra qua độ trễ chứ không qua error.
- Mức throughput mình giữ được ổn định là ~275.9 req/s (plateau từ phút 3 tới 11). Vượt qua điểm này thì thêm VU chỉ khiến latency tăng chứ RPS không nhích lên, cho thấy event-loop đơn luồng cộng với việc ghi SQLite đã bão hoà. Bucket 556/s chỉ nhảy lên đúng một lần nên mình không tính đó là năng lực thật.
- Memory dao động quanh ~117MB và không bị rò. Con số nhảy trong khoảng ~53–117MB nhưng không tăng đều theo thời gian, nên mình kết luận không có memory leak trong 12 phút.
- So với Load 50 VU (p95 19ms) thì tại ngưỡng p95 lên tới ~1.5s, tức tăng khoảng 2 bậc độ lớn. Vì vậy nếu đặt SLA cho thực tế, mình nên giữ tải dưới ~275.9 req/s để độ trễ còn ở mức chấp nhận được.
