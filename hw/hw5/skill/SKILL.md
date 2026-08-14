---
name: perf-test-jmeter
description: Thiết kế, chạy và phân tích JMeter Load/Stress/Spike + endurance cho một nhóm endpoint REST, rồi báo cáo p95/throughput/error kèm bước review lại phân tích của AI. Dùng khi cần đo hiệu năng một workflow API từ đầu tới cuối và tìm ngưỡng phần cứng.
---

# perf-test-jmeter

Skill này gói lại cách mình làm HW05 để lần sau đo một nhóm endpoint khác chỉ việc lặp lại, không phải dựng từ đầu. Nó lo từ thiết kế workflow, sinh test plan, chạy headless, tới đọc log và tự soi lại chỗ AI hay đọc sai.

## Khi nào dùng
Khi có một REST API và muốn biết nó chịu được bao nhiêu, chậm ở đâu, ngưỡng nằm chỗ nào. Hợp cho một nhóm endpoint đi liền thành một luồng nghiệp vụ (ví dụ mua hàng: login rồi search rồi checkout).

## Cần chuẩn bị trước
- JMeter (bản 5.6.x), Java 17, Node.js. Kiểm bằng `jmeter --version`, `java -version`, `node -v`.
- Base URL của SUT và tài liệu API (path, body, field trả về).
- Nếu endpoint cần đăng nhập: biết cách tạo tài khoản hợp lệ.

## Quy trình 6 bước

### 1. Chốt workflow của nhóm endpoint
Liệt kê các bước theo đúng thứ tự người dùng thật đi qua. Mỗi bước ghi: method, path, body, biến cần trích từ response (correlation), biến lấy từ CSV, assertion, think-time. Smoke thử từng bước bằng `curl` để xác nhận contract thật (status code, field name, cơ chế khóa tài khoản nếu có) trước khi tin tài liệu.

### 2. Chuẩn bị dữ liệu
Tạo CSV cho phần tham số hoá (tài khoản, id sản phẩm, từ khoá...). Quy tắc số tài khoản: phải bằng hoặc nhiều hơn số VU đỉnh, để mỗi VU một tài khoản riêng, tránh khóa tài khoản và tránh tranh chấp giả trên server. Nếu tài khoản không có sẵn trong seed thì viết script đăng ký hàng loạt và chạy lại sau mỗi lần restart SUT.

### 3. Sinh 3 test plan từ một workflow dùng chung
Viết workflow một lần vào `templates/workflow-fragment.template.xml` rồi để `scripts/gen-from-fragment.js` ráp thành ba plan Load/Stress/Spike. Ba plan chung y hệt workflow, chỉ khác profile tải và listener. Đặt tên theo `{StudentID}_{ScenarioType}_{YYYYMMDD}.jmx`. Dùng ba listener khác nhau (Summary, Aggregate, View Results Tree). Tham số hoá think-time bằng property `tt_mult` để nén think khi cần đẩy tải mà không phải sửa workflow.

### 4. Chạy headless, có reset giữa các lần
`scripts/run-scenario.sh` làm tuần tự cho mỗi scenario: dừng SUT, khởi động lại (nếu SUT reseed khi boot thì đây cũng là cách reset khóa tài khoản và làm sạch DB), nạp lại tài khoản, rồi `jmeter -n -t plan.jmx -l out.jtl -e -o html/`. Mỗi lần chạy ra một raw `.jtl` và một thư mục HTML.

### 5. Phân tích log
`scripts/analyze-jtl.js` đọc raw `.jtl` và tính theo từng label: samples, error%, avg, p50/p90/p95/p99, max, throughput. Chạy được trên một hay nhiều file. Với soak thì thêm bước lấy mẫu RAM tiến trình backend theo thời gian để tìm memory ceiling.

### 6. Review lại phân tích (bước quan trọng nhất)
AI dễ đọc sai log. Trước khi tin bất cứ kết luận nào, đối chiếu với raw `.jtl` theo checklist:

- Đừng để avg che đuôi. avg thấp không có nghĩa nhanh; nhìn p95/p99/max.
- throughput không phải capacity. RPS đo được có thể bị giới hạn bởi số VU và think-time, không phải trần server. Muốn biết trần thì bỏ think-time chạy soak.
- 0% error không có nghĩa là khỏe. Server quá tải có thể xếp hàng thay vì trả lỗi; dấu hiệu nằm ở độ trễ tăng.
- Đừng gọi tăng RAM là leak nếu chỉ nhìn điểm đầu và cuối. Phải xem cả chuỗi; leak thật thì tăng đơn điệu, không tụt.
- Một đỉnh throughput nhất thời (do GC xả hàng đợi) không phải năng lực bền vững. Lấy trung vị các cửa sổ thời gian.

Ghi phân tích thô của AI ra một file, phần review và số đúng ra một file khác, để tách rõ đâu là AI đâu là người.

## Kết quả skill tạo ra
- 3 (hoặc 4 với endurance) file `.jmx` đúng quy ước tên.
- raw `.jtl` + thư mục HTML report cho mỗi scenario.
- Bảng số liệu p95/throughput/error theo scenario và theo endpoint.
- Kết luận ngưỡng (max stable RPS, memory ceiling) + threshold đề xuất đã qua review.

## File trong skill
- `scripts/gen-from-fragment.js` ráp fragment thành plan Load/Stress/Spike.
- `scripts/run-scenario.sh` reset + chạy một scenario, xuất jtl + html.
- `scripts/analyze-jtl.js` tính metric per-label từ jtl.
- `templates/workflow-fragment.template.xml` khung workflow, thay endpoint của bạn vào.
- `EXAMPLE.md` chạy thử end-to-end trên nhóm endpoint buyer của EShop.

## Demo video mình cần tự quay
Skill này nộp kèm một video YouTube (unlisted) cho thấy dùng nó chạy trọn một nhóm endpoint. Nội dung nên có, tự quay và tự thuyết minh tiếng Việt:

1. Mở `EXAMPLE.md`, nói qua nhóm endpoint sẽ đo.
2. Chạy smoke `curl` cho thấy contract, rồi chạy `gen-from-fragment.js` sinh ra 3 file `.jmx`.
3. Chạy `run-scenario.sh` cho ít nhất một scenario, quay màn hình terminal JMeter cùng Task Manager (tiến trình node) trong một khung hình.
4. Chạy `analyze-jtl.js`, đọc bảng p95/throughput/error.
5. Nói qua bước review: chỉ một chỗ AI dễ đọc sai và số đúng lấy từ raw `.jtl`.

Độ dài đủ để thấy trọn một vòng (tầm vài phút). Dán link vào `README.md` của bài nộp.
