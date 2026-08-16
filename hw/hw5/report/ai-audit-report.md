# AI Audit Report (HW05, §9)

> **Khai báo (§9):** Em có sử dụng công cụ AI cho bài này (I use AI tools for the following tasks). Nhật ký thô đầy đủ từng tương tác nằm ở `../ai-audit-log.md` (34 entry), mỗi entry ghi đủ 4 trường bắt buộc: tên công cụ AI, ngày giờ, prompt gốc, và output/hành động của AI. File này là bản tóm tắt: dùng công cụ gì, AI làm gì ở mỗi phase, chỗ nào AI sai và mình sửa, và ranh giới quyết định giữa AI với người làm bài.

- **Công cụ AI:** Claude Opus 4.8 (1M context) chạy trong Claude Code.
- **Phạm vi dùng:** lập kế hoạch, sinh test plan JMeter, chạy headless, phân tích log, soạn tài liệu, và một Agent Skill tái dùng.
- **Người chịu trách nhiệm cuối:** Nguyễn Thành Dâng, MSSV 23127334. AI chỉ tạo bản nháp và chạy lệnh theo prompt; mọi quyết định pass/fail, capacity, threshold và diễn giải là của mình.
- **Ghi chú minh bạch:** các entry log trước 2026-08-11 22:10 là back-fill từ trí nhớ phiên nên thời gian xấp xỉ. Từ entry #8 trở đi có timestamp thật. Mình ghi rõ điều này thay vì giả vờ log liền mạch.

## 1. AI được dùng vào việc gì, theo phase

| Phase | AI làm | Quyết định của mình |
|---|---|---|
| P0 lập kế hoạch | Đọc đề, policy, API spec, `server.js`; dựng plan P0-P6 và bảng đối chiếu yêu cầu | Chọn workflow buyer-purchase để phủ 3 nhóm endpoint và tránh trùng nhóm khác |
| P0 smoke | Chạy curl 5 endpoint, xác nhận contract thật và cơ chế lockout | Chốt lấy số thật từ SUT làm chuẩn, không tin suông tài liệu |
| P1 thiết kế | Viết thiết kế workflow E2E, tham số tải 3 scenario, sinh 3 file JMX từ một fragment dùng chung | Duyệt con số tải, đặt think-time làm knob theo scenario, chốt naming và listener |
| P2 chạy + evidence | Orchestrate chạy headless, reset lockout giữa các run, xuất jtl/HTML, soak 12 phút | Tự chụp 9 ảnh JMeter cùng Task Manager, tự xuất dxdiag |
| P3 phân tích | Viết bản phân tích thô giọng AI analyst (cố ý chưa review), rồi soi lại đối chiếu raw jtl | Đóng vai reviewer cuối, bác số AI đọc sai, chốt threshold và giới hạn |
| P4 continuous perf | Viết đề xuất mô hình CI perf kèm Mermaid và trade-off | Hạ các con số tự đặt xuống mức "giá trị khởi đầu cần chỉnh" |
| P5 skill | Dựng Agent Skill `perf-test-jmeter` (6 bước) + scripts + EXAMPLE | Chốt phạm vi skill và phần video tự quay |
| P6 báo cáo | Soạn main report, critique, bug report, README, git log | Tự post 5 GitHub Issue, tự quay video, tự chấm điểm |

Chi tiết từng prompt và output ở `../ai-audit-log.md`.

## 2. Chỗ AI làm sai và mình sửa (phần quan trọng nhất)

Đây là điểm chính của bài: AI đọc log rất dễ sai, nên mình tách hẳn bản phân tích thô của AI (`docs/p3-ai-analysis.md`) khỏi phần review của mình (`docs/misinterpretation-hunt.md`) để trace được đâu là AI, đâu là người.

Sáu chỗ AI đọc sai mà mình bắt được, số đúng lấy trực tiếp từ raw `.jtl`:

1. AI nói max capacity 557 req/s. Đó chỉ là một bucket bất thường do GC xả hàng đợi. Số đúng là max stable khoảng 276 req/s.
2. AI nói avg 10ms nên hệ thống rất khỏe. 10ms là của tải nhẹ. Khi bão hòa, endurance avg là 1001ms, p95 1741ms.
3. AI báo memory leak nhẹ (53 lên 107MB). Chuỗi RAM có 48 lần giảm nên không phải leak, chỉ dao động quanh 100MB.
4. AI nói spike làm giảm 55% năng lực. Thật ra Stress và Spike cùng peak 300 threads, throughput khác nhau do concurrency trung bình khác, không phải server yếu đi.
5. AI đọc throughput Load 10 req/s thành trần server. Đó là nhu cầu bị giới hạn bởi think-time, cùng server soak được khoảng 276 req/s.
6. AI coi 0% error là không có điểm nghẽn. Ở endurance có 54.4% request vượt 1 giây, nghẽn ẩn dưới độ trễ chứ không hiện ra lỗi.

Ngoài ra, khi viết script phân tích endurance, AI mắc hai lỗi lập trình mà mình phải sửa: dùng spread `Math.min` trên mảng 206 nghìn phần tử (tràn), và lấy một điểm max outlier làm ngưỡng thay vì trung vị các cửa sổ thời gian. Mình đổi sang lấy median plateau.

## 3. AI không được quyết định cái gì

- Pass/fail của run và phân loại bug do mình chốt, đối chiếu response thật với `server.js`.
- Capacity và threshold cuối (dưới ~276 req/s, giám sát p95/p99 thay vì avg) do mình quyết sau review, không lấy theo đề xuất đầu của AI.
- Các phương án tối ưu SUT (WAL, index, cache) mình tự đánh giá theo kiến trúc thật và ghi rõ là không tự triển khai nếu chưa có A/B run.
- Bản phân tích thô ở `p3-ai-analysis.md` đã gỡ hết mục "AI recommendation" để không ai nhầm đề xuất của AI thành kết luận.

## 4. Minh bạch và giới hạn

- Không dùng AI narration cho video, không dùng video tạo sinh, không bịa số liệu. Mọi con số trong báo cáo lấy từ raw `.jtl` do JMeter sinh.
- Có nhờ AI viết lại văn phong nhiều tài liệu để bớt dấu hiệu máy, nhưng nội dung kỹ thuật, endpoint và số liệu giữ nguyên (xem entry #25, #26 trong log).
- Việc thủ công mình tự làm: chụp 9 ảnh evidence, xuất dxdiag, quay hai video, post 5 GitHub Issue #43-#47 và gán label.
- Giới hạn kết luận: 300 VU chỉ an toàn trong profile có think-time đã chạy; soak mới 12 phút; load generator chạy chung máy với SUT. Những chỗ chưa test mình ghi là giới hạn, không trình bày như đã chứng minh.
