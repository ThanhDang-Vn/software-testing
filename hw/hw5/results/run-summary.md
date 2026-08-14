# P2.1 - Run Summary (metrics từ raw .jtl)

Nguồn: `results/jtl/{Load,Stress,Spike}.jtl` · elapsed = ms · throughput = req/s.
Trước mỗi run mình reset lại: restart server (reseed DB nên lockout và orders bị xoá) rồi re-register 300 account.

## Load

| Scope | Samples | Err% | Avg | Min | Max | p50 | p90 | p95 | p99 | Throughput |
|---|--:|--:|--:|--:|--:|--:|--:|--:|--:|--:|
| **ALL** | 3599 | 0.00% | 7 | 1 | 76 | 5 | 15 | 19 | 29 | 10.1 |
| 1 - Login (auth-heavy) | 743 | 0.00% | 7 | 2 | 76 | 6 | 12 | 16 | 42 | 2.1 |
| 2 - Search products (read-heavy) | 734 | 0.00% | 4 | 1 | 66 | 3 | 6 | 9 | 21 | 2.1 |
| 3 - Product detail (read-heavy) | 724 | 0.00% | 4 | 1 | 61 | 3 | 7 | 10 | 20 | 2.1 |
| 4 - Add to cart (transactional) | 701 | 0.00% | 6 | 1 | 36 | 5 | 9 | 12 | 21 | 2.0 |
| 5 - Checkout (transactional) | 697 | 0.00% | 14 | 5 | 67 | 12 | 22 | 26 | 39 | 2.0 |

HTML report: `results/html/Load/index.html`

## Stress

| Scope | Samples | Err% | Avg | Min | Max | p50 | p90 | p95 | p99 | Throughput |
|---|--:|--:|--:|--:|--:|--:|--:|--:|--:|--:|
| **ALL** | 46076 | 0.00% | 10 | 0 | 418 | 5 | 22 | 32 | 87 | 124.9 |
| 1 - Login (auth-heavy) | 9353 | 0.00% | 13 | 2 | 418 | 6 | 26 | 40 | 110 | 25.4 |
| 2 - Search products (read-heavy) | 9305 | 0.00% | 8 | 0 | 383 | 3 | 18 | 29 | 83 | 25.3 |
| 3 - Product detail (read-heavy) | 9223 | 0.00% | 9 | 0 | 410 | 3 | 19 | 30 | 101 | 25.2 |
| 4 - Add to cart (transactional) | 9116 | 0.00% | 5 | 1 | 200 | 3 | 9 | 13 | 34 | 25.0 |
| 5 - Checkout (transactional) | 9079 | 0.00% | 17 | 4 | 402 | 12 | 29 | 40 | 114 | 24.9 |

HTML report: `results/html/Stress/index.html`

## Spike

| Scope | Samples | Err% | Avg | Min | Max | p50 | p90 | p95 | p99 | Throughput |
|---|--:|--:|--:|--:|--:|--:|--:|--:|--:|--:|
| **ALL** | 13531 | 0.00% | 28 | 0 | 769 | 10 | 61 | 106 | 377 | 55.5 |
| 1 - Login (auth-heavy) | 2839 | 0.00% | 33 | 2 | 769 | 11 | 70 | 118 | 500 | 11.7 |
| 2 - Search products (read-heavy) | 2795 | 0.00% | 30 | 1 | 661 | 7 | 63 | 119 | 506 | 11.5 |
| 3 - Product detail (read-heavy) | 2727 | 0.00% | 25 | 0 | 643 | 8 | 61 | 102 | 184 | 11.4 |
| 4 - Add to cart (transactional) | 2611 | 0.00% | 14 | 1 | 411 | 5 | 28 | 49 | 235 | 10.9 |
| 5 - Checkout (transactional) | 2559 | 0.00% | 40 | 6 | 658 | 20 | 81 | 132 | 480 | 10.7 |

HTML report: `results/html/Spike/index.html`

## So sánh nhanh (ALL, mỗi scenario)

| Scenario | Samples | Err% | Avg | p95 | Max | Throughput |
|---|--:|--:|--:|--:|--:|--:|
| Load | 3599 | 0.00% | 7 | 19 | 76 | 10.1 |
| Stress | 46076 | 0.00% | 10 | 32 | 418 | 124.9 |
| Spike | 13531 | 0.00% | 28 | 106 | 769 | 55.5 |

> Lưu ý: bảng metrics ở trên do script `analyze-jtl.js` sinh ra, chạy lại script là nó ghi đè. Hai mục dưới đây mình tự viết tay, nên khi chạy lại script thì phải dán lại phần này.

---

## Quy trình reset account-lockout giữa các run (đã áp dụng)

Yêu cầu §6 là phải reset lockout giữa các lần chạy Stress/Spike. Script `results/run-all.sh` chạy các bước sau trước mỗi run:

1. `taskkill //F //IM node.exe` để dừng backend đang chạy.
2. `node server.js` để khởi động lại. `server.js` require `database.js`, mà file này lúc boot sẽ DROP rồi reseed lại toàn bộ bảng, nên cột `login_attempts` và `locked_until` của mọi user bị xoá sạch (tức lockout được reset), bảng `orders` cũng sạch chứ không tích luỹ dồn qua các run.
3. `node data/register-users.js` để nạp lại 300 account perf, vì reseed đã xoá mấy account đăng ký trước đó.
4. `jmeter -n -t <plan> -l jtl -e -o html`.

Ghi chú thêm: workflow xài credential hợp lệ lấy từ `users.csv` nên login luôn thành công, và mỗi lần đăng nhập thành công thì `login_attempts` lại về 0, vì vậy lockout không hề kích hoạt ở bất kỳ run nào (0% error cũng xác nhận điều đó). Việc reseed ở trên vừa là cách reset lockout để phòng hờ, vừa giữ cho mỗi run bắt đầu từ một DB sạch.

---

## Nhận định (interpretation) - chuyển sang P2.2/P2.3

1. Cả 3 run đều 0% error, kể cả Stress 300 VU lẫn Spike bơm 300 VU. Vậy là trên phần cứng này không gặp lỗi cứng, không crash, cũng không bị từ chối kết nối.
2. Độ trễ tăng thấy rõ khi tải nặng lên, đây là dấu hiệu hệ thống bắt đầu chậm dần chứ chưa gãy: p95 từ Load 19ms lên Stress 32ms rồi Spike 106ms; max từ 76 lên 418 rồi 769ms.
3. Checkout (bước ghi SQLite) luôn là bước chậm nhất ở mọi run (avg Load 14 / Stress 17 / Spike 40ms). Cái này đúng như mình đoán từ đầu: ghi `orders` xuống SQLite là chỗ nghẽn chính, do nó khóa ghi cả DB.
4. Throughput: Load khoảng 10/s, Stress giữ được ổn định khoảng 125/s, còn Spike khoảng 55/s và dao động khá mạnh vì cách bơm tải.
5. Ở mức 300 VU hệ thống chưa chạm tới "knee". Muốn tìm ngưỡng endurance thật (phần P2.3) thì mình cần đẩy concurrency lên cao hơn (trên 300 VU, khi đó phải regenerate account) hoặc giảm think-time thêm, rồi chạy soak chừng 10-15 phút. Đây là finding mình ghi lại đúng thực tế để mang sang P2.3.
6. Về khả năng hồi phục sau spike: sau cú bơm thì đuôi độ trễ cao (p99 login 500ms), nhưng vẫn 0 lỗi và hệ thống trở lại baseline khi tải rút xuống. Chi tiết xem biểu đồ theo thời gian trong `results/html/Spike/index.html`.
