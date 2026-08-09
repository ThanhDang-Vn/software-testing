# Kịch bản quay video HW04 — 6 đến 7 phút

**Sinh viên:** Nguyễn Thành Dâng — **MSSV:** 23127334  
**Feature:** FR-02, FR-11, FR-14  
**Ngôn ngữ thuyết minh:** Tiếng Việt, giọng thật của sinh viên  
**Hình thức chứng minh tác giả:** face-cam hoặc `whoami` + `hostname`

## Chuẩn bị trước khi bấm quay

1. Đóng email, token, mật khẩu cá nhân và thông báo có dữ liệu riêng tư.
2. Mở sẵn folder `23127334_HW04_AI_Automation_100` trong VS Code.
3. Khởi động backend, frontend web và frontend admin trong ba terminal riêng.
4. Chạy request Cleanup BUG-08 trong `automation/rest/fr14-bug-evidence.rest`; category evidence ID
   `100` vẫn còn tại thời điểm soạn kịch bản và không nên để lại trong SUT khi quay.
5. Mở sẵn các file/tab:
   - `README.md`;
   - `automation/test-data/fr14-category-crud.json`;
   - `automation/tests/fr14-category-crud.spec.ts`;
   - `documents/test-design-review.md`;
   - `reports/run-manifest.json`;
   - một HTML report Chromium và một report Firefox/WebKit;
   - `documents/bug-report.md`;
   - `automation/playwright-evidence-workflow/SKILL.md`;
   - `documents/ai-audit-report.md`;
   - `documents/git-commit-log.txt`.
6. Đặt zoom editor khoảng 90–110% để chữ và kết quả đọc được trong video.
7. Không quay lại toàn bộ matrix 132 executions. Dùng lệnh demo an toàn bên dưới để chạy một case
   GET-only trên cả ba browser; dùng manifest/report có sẵn để chứng minh matrix đầy đủ.

## Lệnh demo multi-browser an toàn

Chạy từ workspace `hw\hw4`, không chạy từ folder ZIP:

```powershell
$env:REPORT_FEATURE = 'FR-14 Category Management CRUD'
$env:REPORT_BROWSER = 'demo-multi-browser'
$env:REPORT_FOLDER = 'reports/demo/fr14-multi-browser'
Remove-Item Env:REPORT_JSON -ErrorAction SilentlyContinue
npx playwright test tests/fr14-category-crud.spec.ts --grep "FR14-TC-001" --project=chromium --project=firefox --project=webkit
```

Case này chỉ đọc danh sách category nên không tạo dữ liệu và không cần cleanup. Kết quả mong đợi của
demo là ba execution được liệt kê riêng cho Chromium, Firefox và WebKit.

## Timeline và lời dẫn

| Thời gian | Thao tác màn hình | Lời dẫn gợi ý |
| --- | --- | --- |
| 00:00–00:25 | Bật face-cam hoặc mở terminal chạy `whoami` và `hostname`; sau đó mở folder nộp | “Xin chào, tôi là Nguyễn Thành Dâng, MSSV 23127334. Đây là máy và repository tôi dùng để thực hiện Homework 4 Automation Testing.” |
| 00:25–01:05 | Mở `README.md`, chỉ tên sinh viên, ba feature và bảng summary | “Tôi chọn FR-02 Login and Lockout thuộc Pool A, FR-11 Order History thuộc Pool B và FR-14 Category Management thuộc Pool C. Tổng cộng có 44 test case logic: 15, 13 và 16 case. Matrix thực tế có 132 executions trên ba browser, gồm 92 pass, 40 fail và không có skipped.” |
| 01:05–01:45 | Mở JSON FR-14 cạnh spec; chỉ các ID, loader và vòng lặp tạo test | “Test được thiết kế data-driven. ID, loại case, input và expected status nằm trong JSON riêng; spec đọc dữ liệu qua loader có kiểm tra schema và ID trùng. Credential thật không nằm trong JSON. Dữ liệu tạo mới dùng tên synthetic và có cleanup.” |
| 01:45–02:25 | Mở `test-design-review.md`, phần Human review/gap; chỉ FR11-TC-012, FR14-TC-012 và các case mới | “AI ban đầu có oracle sai khi cho shipping hủy đơn và biến confirmation thành requirement bắt buộc. Sau human review, tôi sửa FR11-TC-012 để shipping không có quyền hủy, hạ FR14-TC-012 thành exploratory, đồng thời bổ sung cross-user ownership, create-view-delete thành công và customer-token authorization. Tôi không giảm assertion chỉ để test pass.” |
| 02:25–03:05 | Mở terminal và chạy lệnh demo multi-browser ở trên; chỉ ba project trong output | “Đây là một lần chạy live cùng FR14-TC-001 trên Chromium, Firefox và WebKit. Case chỉ gọi GET category nên không làm thay đổi dữ liệu. Cấu hình dùng retries bằng không để kết quả không bị che bởi retry.” |
| 03:05–03:50 | Mở `reports/run-manifest.json`, thu gọn để thấy 9 entries; mở một HTML report và chỉ title | “Matrix đầy đủ gồm ba feature nhân ba browser, tức chín report độc lập. Manifest lưu counts và đường dẫn thật của từng run. Title report hiển thị Run by 23127334, feature, browser và ISO timestamp; verifier đã xác nhận đủ metadata.” |
| 03:50–04:45 | Mở `documents/bug-report.md`; cuộn qua ảnh BUG-04, BUG-05, BUG-06 và BUG-08 | “Fail không được đổi thành pass. Ví dụ BUG-04 cho thấy đơn đang giao vẫn có nút Hủy đơn. Các ảnh REST cho thấy tên category rỗng trả 200 thay vì 400, xóa ID không tồn tại trả 200 thay vì 404, và customer token vẫn tạo category thay vì bị 403. Đây là response thật; ảnh không bị chỉnh sửa.” |
| 04:45–05:25 | Mở một report failure/trace hoặc JSON result; sau đó mở `selector-wait-review.md` | “Tôi đối chiếu assertion, trace, screenshot và source SUT trước khi phân loại defect. Human review cũng loại selector `nth`, XPath/CSS dễ vỡ và timeout cố định không cần thiết; test ưu tiên role, label, placeholder và web-first assertion.” |
| 05:25–05:55 | Mở `automation/playwright-evidence-workflow/SKILL.md`; chỉ phần Inputs, Workflow và Output | “Agent Skill của tôi chuẩn hóa quy trình: kiểm tra service, validate data, chạy feature-browser, thu report, xác minh Student ID và timestamp, rồi phân loại SUT defect, test defect, flaky hoặc blocked. Skill không tạo kết quả giả.” |
| 05:55–06:25 | Mở `documents/ai-audit-report.md`, chỉ một Origin và Human review | “AI audit lưu nguyên văn input prompt và full output. Bản origin không bị sửa; các quyết định sau đó nằm trong Human review, nhờ vậy có thể trace đề xuất AI nào được chấp nhận, sửa hoặc từ chối.” |
| 06:25–06:50 | Mở GitHub branch `homework4`, Issues #33–#40 và `documents/git-commit-log.txt` | “Branch homework4 và tám issue có label hw4 đã được publish. Tôi ghi trung thực rằng hiện chỉ có ba commit thay đổi spec trong một ngày, nên yêu cầu tám test-script commit trên bốn ngày chưa đạt. Tôi không backdate hoặc tạo lịch sử giả.” |
| 06:50–07:00 | Quay lại `README.md` hoặc slide kết thúc | “Đó là phần demo HW04 của tôi. Sau khi upload video unlisted, tôi sẽ dán URL thật vào README và links trước khi nộp. Cảm ơn thầy cô đã xem.” |

## Checklist ngay sau khi quay

- [ ] Video dài ít nhất 5 phút và không quá khoảng 7 phút.
- [ ] Có giọng nói tiếng Việt của sinh viên.
- [ ] Có face-cam hoặc kết quả `whoami` và `hostname`.
- [ ] Nhìn rõ một lần chạy trên Chromium, Firefox và WebKit.
- [ ] Nhìn rõ ít nhất một HTML report có `Run by: 23127334` và ISO timestamp.
- [ ] Đã giải thích ít nhất một thay đổi sau human review đối với output AI.
- [ ] Đã demo Agent Skill hoặc giải thích workflow của skill.
- [ ] Không lộ token, credential cá nhân, email riêng hoặc dữ liệu nhạy cảm.
- [ ] Upload YouTube ở chế độ **Unlisted**, không để Private.
- [x] URL video thật đã được thêm vào `README.md` và `links.md`: https://youtu.be/e-_aoQkVflk.
- [ ] Xuất lại các PDF đã thay đổi rồi mới tạo ZIP cuối.

Không dùng AI narration, video tạo sinh hoặc kết quả test giả. Khi một test fail do defect thật, trình
bày đúng trạng thái fail và evidence thay vì gọi đó là pass.
