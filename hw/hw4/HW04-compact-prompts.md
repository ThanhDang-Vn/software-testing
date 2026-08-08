# HW04 — Compact Prompt Workflow

Bộ prompt này gộp Prompt 7–30 thành 9 prompt theo từng checkpoint. Chạy theo
thứ tự. Thay các placeholder như `<StudentID>`, `<FullName>` và `<GitHubURL>`
bằng dữ liệu thật khi có.

StudentID: 23127334
Fullname: Nguyễn Thành Dâng
Github url: https://github.com/ThanhDang-Vn/software-testing

## Global Rules — Áp dụng cho mọi prompt

```text
Áp dụng các quy tắc sau cho toàn bộ công việc HW04:

1. Đọc requirement, repository và evidence liên quan trước khi thay đổi.
2. Chỉ kết luận dựa trên evidence thật từ test execution, trace, screenshot,
   report, run-manifest, Git hoặc source code.
3. Không bịa test result, timestamp, URL, bug, AI interaction, human action
   hoặc evidence. Thông tin chưa có phải ghi TODO hoặc BLOCKED.
4. Không sửa behavior của SUT chỉ để test pass. Chỉ sửa test, test data,
   support code hoặc config khi có evidence phù hợp.
5. Không xóa hoặc giảm assertion, dùng retry, timeout lớn hay wait cố định để
   che failure. Timeout cố định chỉ được dùng khi có lý do kỹ thuật ghi rõ.
6. Failure phải được phân loại thành đúng một loại: TEST_DEFECT, SUT_DEFECT,
   ENVIRONMENT, FLAKY hoặc BLOCKED.
7. Giữ test độc lập, data-driven, có setup/cleanup an toàn và không phụ thuộc
   dữ liệu tình cờ trong database.
8. Không upload, publish, nộp Moodle, tạo GitHub Issue, sửa Git history hoặc
   xóa file nếu tôi chưa yêu cầu rõ.
9. Không tự điền Student ID, họ tên, URL, video, điểm hoặc số liệu còn thiếu.
10. Sau mỗi task, báo: file thay đổi, lệnh đã chạy, kết quả, evidence path,
    TODO/BLOCKED và rủi ro còn lại.
```

## Prompt 1 — Hoàn thiện và review ba feature

```text
Hoàn thiện lần lượt FR-02 Login and account lockout, FR-11 Order history view
và FR-14 Category management CRUD theo HW04.

Với mỗi feature:

1. Đọc requirement, spec, JSON/CSV data, authentication/setup,
   page/support objects và source SUT liên quan.
2. Review selector và wait theo Playwright best practices:
   - tìm CSS/XPath dễ vỡ, nth index, waitForTimeout, timeout cố định,
     race condition và dependency giữa test;
   - ưu tiên locator theo role, label, placeholder, text ổn định hoặc test id;
   - không sửa SUT chỉ để tạo locator thuận tiện.
3. Đảm bảo ít nhất 12 test case data-driven, có positive, negative, boundary
   và edge coverage phù hợp requirement; ít nhất 3 assertion patterns;
   không có inline test-case arrays hoặc flaky wait.
4. Giữ nguyên mức độ kiểm tra hiện có và bổ sung coverage riêng:
   - FR-02: login success, invalid credentials, client/server validation,
     lock threshold, locked behavior và lock expiry nếu requirement hỗ trợ;
   - FR-11: không có order/có order, dữ liệu order, access control, session
     state và sorting/filtering/pagination/detail/navigation nếu có requirement;
   - FR-14: create, read/list, update, delete, validation, duplicate, boundary,
     invalid data, admin access và persistence sau reload/navigation nếu có.
5. Với FR-02, reset account/data state an toàn giữa test.
6. Với FR-11, không phụ thuộc order tồn tại tình cờ trong database.
7. Với FR-14, dùng tên dữ liệu unique và cleanup phải chạy an toàn kể cả khi
   test fail.
8. Không thêm behavior không tồn tại trong requirement chỉ để đủ 12 test case.

Sau khi sửa từng feature, chạy trên Chromium. Phân loại mọi failure bằng
evidence. Xuất summary riêng cho từng feature, diff chính, test không thể
automation cùng lý do và các điểm cần human review.
```

## Prompt 2 — Chạy đa trình duyệt, phân tích và ổn định test

```text
Thực hiện execution và stabilization cho <Feature> trên Chromium, Firefox và
WebKit. Không chạy song song nếu test data có thể xung đột.

Giai đoạn A — Baseline:
- Không sửa test trong lần chạy đầu tiên.
- Với mỗi browser, ghi command, thời gian chạy, passed/failed/skipped,
  failure signatures, report path và trace/screenshot/error-context path.
- Kiểm tra report có "Run by: <StudentID>" và ISO timestamp.
- So sánh khác biệt giữa ba browser.

Giai đoạn B — Failure analysis:
- Với mỗi failure, đọc Playwright error, trace, screenshot, error-context,
  test code, requirement và source SUT liên quan.
- Phân loại thành đúng một loại: TEST_DEFECT, SUT_DEFECT, ENVIRONMENT,
  FLAKY hoặc BLOCKED.
- Ghi evidence, root cause có khả năng cao nhất, điều chưa chắc chắn,
  bước reproduce/xác minh và expected/actual nếu là SUT_DEFECT.
- Không mặc định failure là bug.

Giai đoạn C — Minimal fix:
- Chỉ sửa test/config nếu classification cho phép.
- Giải thích file và logic thay đổi.
- Chạy lại test bị lỗi, sau đó regression toàn bộ <Feature> trên browser đó.
- Báo kết quả trước/sau và rủi ro còn lại.

Giai đoạn D — Flakiness verification:
- Chọn test vừa sửa hoặc từng fail không ổn định và chạy lặp lại số lần hợp lý.
- Không bật retries để che kết quả.
- Thống kê pass/fail từng lần, failure signature, state/data collision và
  timing/race evidence.
- Nếu flaky, sửa synchronization hoặc test isolation rồi chạy lặp lại để
  chứng minh cải thiện.
- Không tuyên bố test ổn định nếu chưa có execution evidence.
```

## Prompt 3 — Hoàn thiện và xác minh report matrix

```text
Review playwright.config.ts, run-matrix.mjs, verify-reports.mjs, cấu trúc
reports và run-manifest hiện tại.

Hoàn thiện pipeline cho matrix:
- FR-02 × Chromium/Firefox/WebKit;
- FR-11 × Chromium/Firefox/WebKit;
- FR-14 × Chromium/Firefox/WebKit.

Yêu cầu:
1. Mỗi run tạo một HTML report độc lập có "Run by: <StudentID>" và ISO
   timestamp.
2. Tạo/cập nhật run-manifest.json từ execution thật.
3. Verifier phải fail nếu thiếu report, metadata hoặc manifest entry.
4. Không copy report cũ để giả một browser run.
5. Chỉ chạy pipeline khi SUT sẵn sàng.

Sau khi tạo, audit cả 9 reports mà không sửa report:
- index.html và assets cần thiết tồn tại;
- report mở được sau khi giải nén độc lập;
- đúng feature và browser;
- có Student ID và ISO timestamp;
- pass/fail khớp run-manifest;
- không phải bản sao của report browser khác.

Xuất bảng 9 dòng gồm feature, browser, PASS/FAIL/BLOCKED, counts, metadata,
report path và evidence. Ghi rõ mọi inconsistency.
```

## Prompt 4 — Tạo tài liệu phân tích, audit, bug và critique

```text
Dựa duy nhất trên requirement, repository, AI interaction thật, Git diff/log,
test code, run-manifest, HTML reports và bug evidence hiện có, cập nhật các tài
liệu sau. Không bịa dữ liệu; dùng TODO khi thiếu evidence.

A. Human Review and Gap Analysis cho từng feature:
- AI ban đầu tạo/đề xuất gì;
- AI sai hoặc thiếu gì;
- vấn đề selector/assertion/wait/data/edge case;
- sinh viên sửa gì và vì sao;
- nguyên nhân AI bỏ sót;
- kết quả trước và sau sửa;
- test chưa automation được và lý do;
- rủi ro còn lại.

B. documents/ai-audit-report.md:
- mỗi interaction có AI tool, date/time, goal, prompt nguyên văn,
  AI output hoặc bản ghi audit được, human review, accepted changes,
  rejected/corrected changes và file/commit/report evidence;
- giữ declaration: "I use AI tools for the following tasks:".

C. documents/main-report.md:
- student/repository information;
- feature selection và Pool mapping;
- environment/tools;
- AI-first process;
- test design và data-driven approach;
- assertion patterns;
- kết quả ba browser cho từng feature;
- human review/gap analysis;
- unautomated cases;
- bug/GitHub Issues;
- demo video;
- conclusion và self-assessment;
- mọi số liệu phải truy vết được tới evidence.

D. AI Critique bằng tiếng Anh, 200–300 từ:
- AI sai, biased hoặc incomplete ở đâu;
- vì sao AI không bắt được vấn đề;
- sinh viên học được nguyên tắc gì khi cộng tác với AI;
- gắn nhận xét với FR-02, FR-11 hoặc FR-14;
- báo chính xác word count.

E. documents/bug-report.md:
- Chỉ với failure đã xác nhận là SUT_DEFECT, tạo bug entry và GitHub Issue
  draft gồm title, feature/browser/environment, preconditions, exact steps,
  expected, actual, severity/priority có lý do, evidence paths,
  reproducibility và requirement/test-case link.
- Không tạo hoặc publish GitHub Issue ở bước này.
- Nếu không có confirmed SUT_DEFECT, ghi:
  "No confirmed SUT defects were identified" và tóm tắt các failure thuộc
  TEST_DEFECT, ENVIRONMENT, FLAKY hoặc BLOCKED.

Cuối cùng đối chiếu chéo số liệu giữa tất cả tài liệu và evidence, rồi liệt kê
mọi TODO, conflict hoặc claim chưa truy vết được.
```

## Prompt 5 — Tạo Git commit log, README và self-assessment

```text
Đọc Git history, run-manifest, HTML reports, bug report và tài liệu thật để cập
nhật documents/git-commit-log.txt và submission/README.md.

A. Git commit log:
- đánh dấu commit được tính theo HW04 vì có thay đổi test scripts;
- tổng hợp tổng commit, số commit hợp lệ, số ngày khác nhau;
- ghi hash, date, message và files của từng commit;
- PASS/FAIL đối với yêu cầu 8 valid commits trong 4 days;
- không sửa history, không backdate và không tính commit chỉ sửa docs.

B. README:
- <FullName>, <StudentID>, <GitHubURL>;
- feature summary;
- automated/executed/passed/failed/skipped/blocked counts;
- browser runs;
- bug count;
- demo video URL;
- self-assessment table theo rubric 25/25/25/15/10;
- giải thích ngắn cho điểm bị trừ.

Đối chiếu mọi số liệu với run-manifest và HTML reports. Không tự điền identity,
link, video, grade hoặc count chưa có; dùng TODO. Xuất danh sách inconsistency
và thông tin sinh viên còn phải cung cấp.
```

## Prompt 6 — Chuẩn bị kịch bản video

```text
Dựa trên feature ổn định nhất, test code, AI Audit, Git và report thật, viết
kịch bản video HW04 bằng tiếng Việt dài 5–7 phút.

Kịch bản phải có timeline, lời dẫn và thao tác màn hình cho:
- whoami và hostname hoặc face-cam;
- giới thiệu feature;
- JSON/CSV data-driven testing;
- ít nhất 3 assertion patterns;
- multi-browser execution;
- mở HTML report;
- một lỗi có evidence trong output AI và cách sinh viên sửa;
- kết quả và GitHub evidence.

Không tạo narration giả hoặc tuyên bố kết quả chưa có. Đánh dấu TODO cho dữ
liệu thiếu và ghi rõ thao tác nào sinh viên phải tự thực hiện khi quay.
```

## Prompt 7 — Tạo hoặc review Agent Skill

```text
Review automation workflow hiện có và đề xuất một Agent Skill tái sử dụng cho
data-driven Playwright testing, multi-browser execution, report verification
và human review.

Trước khi tạo, xác định:
- inputs;
- workflow;
- safety constraints;
- expected outputs;
- verification;
- phần bắt buộc sinh viên review.

Skill không được tạo evidence/report giả, tự khai báo pass, sửa SUT để ép test
pass hoặc xuất bản dữ liệu ra ngoài. Nếu tạo skill, tuân thủ đúng skill format
và tooling hiện có, sau đó kiểm tra bằng một feature hoàn chỉnh. Báo kết quả
validation và giới hạn còn lại.
```

## Prompt 8 — audit submission

Sau đó audit hw/hw4/submission như một TA khó tính, chưa sửa hoặc xóa file:
- README và links;
- Markdown/PDF pairs;
- automation scripts và data;
- tối thiểu 36 test cases;
- 9 HTML reports;
- "Run by: <StudentID>" và ISO timestamps;
- run-manifest consistency;
- AI Critique 200–300 words;
- AI Audit completeness;
- 8 valid Git commits trong 4 days;
- bug evidence;
- demo link;
- Agent Skill nếu được dùng trong self-assessment;
- file không cần thiết hoặc quá lớn.

Xuất PASS/FAIL/BLOCKED theo P0/P1/P2 với evidence paths. Không đánh dấu PASS
chỉ vì file tồn tại; phải kiểm tra nội dung.

Cuối cùng lập danh sách chính xác file/thư mục không nên nằm trong ZIP, như
node_modules, runtime logs, duplicate reports hoặc evidence không cần thiết.
Với mỗi target, in resolved absolute path, xác nhận nằm trong
hw/hw4/submission và ước lượng dung lượng tiết kiệm. Không xóa ở bước này.
```

## Prompt 9 — Dọn, đóng ZIP và final readiness review

```text
Dựa trên submission audit đã hoàn tất, chuẩn bị bản nộp cuối cùng.

Giai đoạn A — Cleanup:
- Chỉ xóa các target đã được audit và sau khi tôi xác nhận rõ.
- Mọi target phải có resolved absolute path nằm trong hw/hw4/submission.
- Không đụng source workspace hoặc evidence bắt buộc.
- Sau cleanup, chạy lại submission audit.

Giai đoạn B — Create ZIP:
- Tên ZIP: <StudentID>_HW04_AI_Automation_<SelfAssessedGrade>.zip.
- Grade phải đúng 3 chữ số từ 000–100.
- Trước khi tạo, bảo đảm không có node_modules/runtime logs và tính kích thước
  dự kiến.
- Không xóa submission source.

Giai đoạn C — ZIP verification:
- kiểm tra ZIP mở được và liệt kê root structure;
- giải nén thử vào thư mục tạm;
- kiểm tra Markdown, PDF và HTML reports quan trọng;
- xác nhận mỗi file không vượt 20 MB;
- nếu tổng ZIP vượt 20 MB, đề xuất cách split an toàn;
- không upload hoặc nộp Moodle.

Giai đoạn D — Final readiness review từ ZIP cuối cùng:
1. P0 blockers có thể dẫn đến 0 điểm;
2. requirement chưa đạt;
3. inconsistency giữa README, reports, manifest và Git log;
4. link hoặc PDF lỗi;
5. ước lượng rubric chỉ dựa trên evidence;
6. quyết định READY hoặc NOT READY.

Không sửa ZIP trong giai đoạn final review và không dựa vào claim trong README
nếu thiếu evidence.
``
