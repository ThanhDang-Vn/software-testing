# Kịch bản video HW04 (5–7 phút)

> Sinh viên phải tự quay, tự đọc lời dẫn và thay mọi TODO bằng evidence thật. Không dùng video này
> để tuyên bố GitHub Issue/commit chưa tồn tại.

| Thời gian | Thao tác màn hình | Lời dẫn |
| --- | --- | --- |
| 00:00–00:30 | Bật face-cam hoặc chạy `whoami` và `hostname`; mở repo | “Tôi là Nguyễn Thành Dâng, MSSV 23127334. Đây là workspace và repository HW04 của tôi.” |
| 00:30–01:10 | Mở requirement matrix và ba JSON data files | “Tôi chọn FR-02, FR-11 và FR-14. Suite có 44 logical cases, dữ liệu case nằm ngoài spec trong JSON; credentials lấy từ environment.” |
| 01:10–02:00 | Mở một spec và support loader | “Loader kiểm schema/ID và cấm credential trong JSON. Dữ liệu mutation dùng run ID; FR-14 cleanup trong finally; FR-11 có ownership test trên backend thật.” |
| 02:00–02:50 | Chỉ ba assertion patterns | “Ví dụ thứ nhất là web-first visibility/URL; thứ hai là status equality; thứ ba là object/array containment. Assertion vẫn theo requirement khi SUT sai.” |
| 02:50–03:40 | Mở `selector-wait-review.md` và diff | “Human review bỏ nth, CSS class dễ vỡ, waitForTimeout và click evaluate. Một lỗi AI dùng Unicode chuẩn cho UI mojibake làm năm test timeout; trace giúp tôi sửa thành role listitem cộng prefix ổn định.” |
| 03:40–04:30 | Chạy hoặc mở log `npm run test:matrix`; mở manifest | “Matrix chạy tuần tự Chromium, Firefox, WebKit, retries bằng 0. Kết quả thật là 132 executions: 92 pass, 40 fail, 0 skip.” |
| 04:30–05:10 | Mở ba HTML report mẫu và title | “Mỗi feature/browser có report riêng với Run by 23127334 và ISO timestamp. Verifier kiểm đủ chín report và counts từ JSON.” |
| 05:10–05:50 | Mở trace/error-context FR11-TC-012 hoặc FR14-TC-016 và source line | “Ví dụ defect: shipping vẫn có quyền hủy, lặp trên cả ba browser và source backend chỉ chặn delivered/canceled. Vì oracle, execution và source khớp, tôi phân loại SUT_DEFECT.” |
| 05:50–06:20 | Mở Firefox repeat report | “Một protocol teardown ở FR14-TC-008 chỉ xảy ra một lần. Chạy lặp ba lần đều pass, nên tôi ghi FLAKY thay vì gọi là bug.” |
| 06:20–06:50 | Mở Git audit và GitHub repo | “TODO khi quay: hiển thị commit/Issue thật nếu đã có. Hiện audit workspace cho thấy HW04 bị gitignore và chưa có valid commit; tôi không tạo lịch sử giả.” |
| 06:50–07:00 | Mở checklist cuối | “TODO: thêm URL video thật, issue đã review và đồng bộ PDF trước khi nộp.” |
