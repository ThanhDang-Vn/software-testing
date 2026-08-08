# Kế hoạch hoàn thành HW04 – Automation Testing

## 1. Mục tiêu

Hoàn thành HW04 đúng yêu cầu của:

- `2026.HW04.Automation Testing_En.pdf`
- `___2026.Homework.Policies.pdf`

Chiến lược thực hiện:

1. Bắt đầu lịch sử Git bốn ngày càng sớm càng tốt.
2. Hoàn thiện ba feature theo thứ tự FR-02 → FR-11 → FR-14.
3. Chạy thật từng feature trên Chromium, Firefox và WebKit.
4. Sinh và kiểm tra tối thiểu chín HTML report.
5. Cập nhật tài liệu song song với quá trình làm.
6. Quay video sau khi có ít nhất một luồng chạy ổn định.
7. Audit toàn bộ submission trước khi ZIP và nộp Moodle.

## 2. Phạm vi feature

Ba feature hiện tại:

| Pool | Feature | Nội dung |
|---|---|---|
| A | FR-02 | Login and account lockout |
| B | FR-11 | Order history view |
| C | FR-14 | Category management CRUD |

Yêu cầu tối thiểu:

- 12 test case cho mỗi feature.
- Tổng cộng ít nhất 36 automated test cases.
- Mỗi feature chạy trên cả ba browser.
- Tối thiểu 9 feature/browser runs.
- Nếu cả 36 test chạy trên ba browser thì có ít nhất 108 test-browser executions.
- Test case có thể gồm positive, negative và edge cases.
- Feature không được trùng với feature của thành viên khác trong nhóm.

## 3. Ba browser sử dụng

Sử dụng ba Playwright projects:

1. Chromium — đại diện cho hệ sinh thái Chrome/Edge.
2. Firefox.
3. WebKit — engine gần với Safari.

Trong báo cáo phải ghi chính xác tên là Chromium, Firefox và WebKit; không gọi Chromium là Chrome hoặc WebKit là Safari thật.

Cấu hình dự kiến:

```ts
projects: [
  {
    name: 'chromium',
    use: { ...devices['Desktop Chrome'] },
  },
  {
    name: 'firefox',
    use: { ...devices['Desktop Firefox'] },
  },
  {
    name: 'webkit',
    use: { ...devices['Desktop Safari'] },
  },
],
```

Cài browser:

```powershell
npx playwright install chromium firefox webkit
```

Chạy cả ba:

```powershell
npx playwright test
```

Chạy riêng:

```powershell
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
```

## 4. Bước 1 — Audit hiện trạng và tạo baseline

### Công việc

1. Khởi động đầy đủ backend, frontend và admin của EShop.
2. Chạy từng spec hiện tại trên Chromium.
3. Kiểm kê số test case của FR-02, FR-11 và FR-14.
4. Kiểm tra JSON/CSV data tương ứng.
5. Kiểm tra các assertion pattern đang dùng.
6. Ghi lại test pass, fail, skipped và blocked.
7. Phân biệt lỗi test, lỗi môi trường và lỗi SUT.
8. Commit baseline trong ngày đầu.

### Prompt gợi ý cho Codex

```text
Audit toàn bộ hw/hw4 theo đề HW04 và homework policy. Không sửa file trước.
Lập bảng cho FR-02, FR-11 và FR-14 gồm số test, data file, assertion
patterns, browser coverage, report coverage, lỗi/blocker và deliverable
còn thiếu. Mọi kết luận phải có đường dẫn hoặc bằng chứng từ repository.
```

### Output mong đợi

- Bảng audit PASS/FAIL/BLOCKED.
- Danh sách yêu cầu còn thiếu.
- Danh sách lỗi cần xử lý theo mức ưu tiên.
- Baseline execution result.

## 5. Bước 2 — Đảm bảo yêu cầu Git

Yêu cầu bắt buộc:

- Public GitHub repository.
- Ít nhất 8 commit.
- Các commit phải trải trên ít nhất 4 ngày.
- Chỉ commit thay đổi test scripts như `.spec.ts`, `.spec.js` hoặc tương đương mới được tính.
- Commit chỉ sửa README, PDF hoặc tài liệu không được tính.
- Commit message phải rõ ràng và thể hiện bước thực hiện.
- Không backdate hoặc tạo lịch sử giả.

### Lịch commit đề xuất

| Ngày | Commit 1 | Commit 2 |
|---|---|---|
| Ngày 1 | Hoàn thiện test FR-02 | Cải thiện assertion/selector FR-02 |
| Ngày 2 | Hoàn thiện test FR-11 | Sửa wait và cross-browser cho FR-11 |
| Ngày 3 | Hoàn thiện test FR-14 | Bổ sung edge cases FR-14 |
| Ngày 4 | Khắc phục flaky tests | Hoàn thiện multi-browser regression |

### Commit message gợi ý

```text
test(fr02): add data-driven account lockout scenarios
test(fr02): replace fragile selectors and strengthen assertions
test(fr11): cover empty and populated order history states
test(fr11): stabilize order history waits across browsers
test(fr14): add category validation and duplicate-name cases
test(fr14): verify CRUD persistence with stronger assertions
test(e2e): resolve Firefox and WebKit compatibility issues
test(e2e): finalize multi-browser regression coverage
```

## 6. Bước 3 — Hoàn thiện từng feature

Thứ tự:

```text
FR-02 → FR-11 → FR-14
```

Không sửa cả ba feature cùng lúc. Với mỗi feature, thực hiện vòng lặp:

1. Đọc functional requirement và hành vi UI thực tế.
2. Kiểm kê tối thiểu 12 test case.
3. Phân loại positive, negative và edge cases.
4. Đưa toàn bộ test data vào JSON hoặc CSV riêng.
5. Không dùng inline array/object để thay thế data file.
6. Bảo đảm có ít nhất ba assertion patterns khác nhau.
7. Chạy trên Chromium.
8. Sửa selector, assertion, setup và waits dựa trên bằng chứng.
9. Chạy trên Firefox.
10. Chạy trên WebKit.
11. Phân loại mọi failure.
12. Sinh HTML report thật.
13. Ghi human review và gap analysis ngay sau khi feature hoàn thành.
14. Commit thay đổi test script với message rõ ràng.

### Prompt hoàn thiện một feature

```text
Hoàn thiện riêng FR-11 theo HW04. Trước tiên đọc spec, JSON data,
Playwright config và phần SUT liên quan. Kiểm tra tối thiểu 12 test case
data-driven, ít nhất 3 assertion patterns và không hardcode test data.
Sau đó chạy Chromium, chẩn đoán từng failure và chỉ sửa test/config khi
có bằng chứng. Không thay đổi hành vi SUT để làm test pass.
```

Sau khi Chromium ổn định:

```text
Tiếp tục FR-11 trên Firefox và WebKit. Phân biệt rõ incompatibility,
flaky test, test defect, environment issue và genuine SUT defect.
Không giảm hoặc xóa assertion chỉ để làm test pass.
```

## 7. Bước 4 — Data-driven testing và assertions

### Data files

Mỗi feature có một file dữ liệu riêng:

```text
test-data/
├── fr02-login-lockout.json
├── fr11-order-history.json
└── fr14-category-crud.json
```

Không chấp nhận:

- Hardcoded inline arrays thay cho data file.
- Copy cùng một dữ liệu lặp lại ở nhiều test.
- Dữ liệu nhạy cảm thật trong repository.

### Assertion patterns

Cần ít nhất ba dạng assertion khác nhau, ví dụ:

- Kiểm tra visibility: `toBeVisible()`.
- Kiểm tra text: `toHaveText()` hoặc `toContainText()`.
- Kiểm tra URL: `toHaveURL()`.
- Kiểm tra trạng thái control: `toBeEnabled()`, `toBeDisabled()`.
- Kiểm tra số lượng: `toHaveCount()`.
- Kiểm tra input value: `toHaveValue()`.
- Kiểm tra dữ liệu được persist sau reload hoặc navigation.

Assertion phải kiểm tra business outcome, không chỉ kiểm tra phần tử tồn tại.

## 8. Bước 5 — Execution matrix và HTML reports

### Matrix bắt buộc

| Feature | Chromium | Firefox | WebKit |
|---|---:|---:|---:|
| FR-02 | Report | Report | Report |
| FR-11 | Report | Report | Report |
| FR-14 | Report | Report | Report |

Tối thiểu chín report độc lập.

### Metadata bắt buộc

Mỗi report phải hiển thị:

```text
Run by: <StudentID>
Timestamp: <ISO timestamp>
```

Ví dụ:

```text
Run by: 25127001
Timestamp: 2026-08-07T14:30:00+07:00
```

Thông tin có thể nằm trong title, header, footer hoặc report metadata.

HTML report phải được sinh từ execution thật, không được AI tạo hoặc chỉnh sửa để giả lập kết quả.

### Run manifest

Nên ghi vào `run-manifest.json`:

- Feature.
- Browser.
- Student ID.
- Start timestamp.
- End timestamp.
- Passed.
- Failed.
- Skipped.
- Exit code.
- Report path.

### Prompt kiểm tra report pipeline

```text
Review run-matrix.mjs, verify-reports.mjs và playwright.config.ts.
Đảm bảo pipeline tạo đủ 9 HTML reports độc lập, mỗi report hiển thị
Run by: <StudentID> và ISO timestamp. Thêm bước xác minh tự động và
fail nếu thiếu report hoặc metadata. Không tạo hoặc giả lập report.
```

## 9. Bước 6 — Phân loại failure và bug

Mọi failure phải được gán một trong các loại:

| Loại | Ý nghĩa |
|---|---|
| `TEST_DEFECT` | Selector, assertion, setup hoặc logic test sai |
| `SUT_DEFECT` | Ứng dụng sai yêu cầu hoặc hành vi mong đợi |
| `ENVIRONMENT` | Service, database, browser hoặc dependency gặp vấn đề |
| `FLAKY` | Kết quả không ổn định giữa các lần chạy |
| `BLOCKED` | Thiếu prerequisite, dữ liệu hoặc quyền truy cập |

### Quy trình xác nhận SUT defect

1. Reproduce lại ít nhất một lần.
2. Đối chiếu với functional requirement.
3. Ghi expected result.
4. Ghi actual result.
5. Lưu screenshot.
6. Lưu trace và HTML report.
7. Tạo GitHub Issue trong public repository.
8. Đính kèm screenshot vào issue.
9. Liên kết issue trong `bug-report.md`.

### Prompt phân tích failure

```text
Phân tích failure này dựa trên trace, screenshot, error context,
test code và source SUT. Không mặc định đây là bug. Kết luận một trong
năm loại TEST_DEFECT, SUT_DEFECT, ENVIRONMENT, FLAKY hoặc BLOCKED;
đưa bằng chứng và bước xác minh tiếp theo.
```

Không sửa SUT chỉ để automation test pass, trừ khi việc sửa SUT được quản lý riêng và được giải thích rõ.

## 10. Bước 7 — Human review và gap analysis

Với từng feature, báo cáo:

- AI ban đầu đề xuất gì.
- Selector nào không phù hợp.
- Assertion nào yếu hoặc thiếu.
- Wait nào dễ flaky.
- Edge case nào AI bỏ sót.
- Data nào AI hardcode hoặc thiết kế chưa tốt.
- Thay đổi nào được chấp nhận.
- Thay đổi nào bị từ chối.
- Bạn đã sửa gì.
- Vì sao AI mắc lỗi.
- Kết quả trước và sau khi sửa.
- Test case nào chưa tự động hóa được và lý do.

Nguyên nhân có thể gồm:

- Prompt chưa đủ context.
- AI không biết trạng thái runtime thực tế.
- Model đoán sai DOM hoặc business rule.
- Feature phụ thuộc dữ liệu hoặc thứ tự chạy.
- Hành vi khác nhau giữa browser.
- AI ưu tiên happy path và bỏ qua edge cases.

## 11. Bước 8 — Tài liệu bắt buộc

### Main report

Cần cả hai file:

```text
documents/main-report.md
documents/main-report.pdf
```

Nội dung:

1. Thông tin sinh viên.
2. Public GitHub repository URL.
3. Ba feature và mapping Pool A/B/C.
4. Công cụ và môi trường.
5. Quy trình dùng AI từng bước.
6. Test design của mỗi feature.
7. Data-driven testing.
8. Assertion patterns.
9. Kết quả ba browser.
10. Bảng pass/fail/skipped/blocked.
11. Human review.
12. Gap analysis.
13. Test chưa automation được.
14. Bug và GitHub Issues.
15. Demo video URL.
16. Kết luận.
17. Self-assessment.

### AI Audit Report

Cần:

```text
documents/ai-audit-report.md
documents/ai-audit-report.pdf
```

Declaration:

```text
I use AI tools for the following tasks:
```

Mỗi interaction ghi:

```markdown
## Interaction N

- Tool:
- Date/time:
- Goal:
- Prompt:
- AI output:
- Human review:
- Accepted changes:
- Rejected/corrected changes:
- Evidence/commit:
```

Phải ghi tên AI, ngày giờ, prompt và AI output. Không được bỏ phần human review.

### AI Critique

Cần:

```text
documents/ai-critique.md
documents/ai-critique.pdf
```

Yêu cầu:

- 200–300 từ.
- AI sai, thiên lệch hoặc chưa đầy đủ ở đâu.
- Vì sao AI không phát hiện vấn đề.
- Bài học về cộng tác với AI.

### Bug report

Cần:

```text
documents/bug-report.md
```

Nếu không tìm thấy defect thật, vẫn nên giữ file và ghi:

```text
No confirmed SUT defects were identified.
```

### Git commit log

Cần:

```text
documents/git-commit-log.txt
```

Log phải thể hiện tối thiểu tám commit test-script trong ít nhất bốn ngày.

## 12. Bước 9 — README và links

`README.md` phải chứa:

- Họ tên.
- Student ID.
- Public GitHub repository URL.
- Self-assessment table.
- Số feature.
- Số test case automated.
- Số test case executed.
- Số passed.
- Số failed.
- Số skipped/blocked nếu có.
- Số browser runs.
- Số bug.
- Demo video URL.

Rubric:

| Hạng mục | Điểm tối đa | Tự đánh giá |
|---|---:|---:|
| Task 1 – Feature A | 25 | |
| Task 1 – Feature B | 25 | |
| Task 1 – Feature C | 25 | |
| Task 2 – Demo video | 15 | |
| Agent Skill | 10 | |
| Tổng | 100 | |

`links.md` nên chứa tập trung:

- Public GitHub repository.
- Demo video.
- Agent Skill demo video nếu có.
- GitHub Issues.

Không chỉ để link online thay cho deliverable bắt buộc trong ZIP.

## 13. Bước 10 — Demo video

Yêu cầu:

- YouTube unlisted.
- Ít nhất 5 phút.
- Thuyết minh bằng tiếng Việt.
- Demo một automation script chạy end-to-end.
- Thể hiện multi-browser run.
- Mở và trình bày HTML report.
- Giải thích ít nhất một fix đối với script do AI tạo.
- Chứng minh tác giả bằng face-cam hoặc chạy `whoami` và `hostname`.

### Kịch bản 5–7 phút

1. Chạy `whoami` và `hostname`: 20–30 giây.
2. Giới thiệu feature và mục tiêu: 30–40 giây.
3. Cho xem JSON data-driven: 30–40 giây.
4. Cho xem ba assertion patterns: 30–40 giây.
5. Chạy multi-browser: 1–2 phút.
6. Mở HTML report: khoảng 1 phút.
7. Giải thích một lỗi AI và cách sửa: khoảng 1 phút.
8. Tóm tắt kết quả, GitHub và bug: 30 giây.

Ưu tiên chọn feature ổn định nhất để demo, dự kiến FR-02 hoặc FR-14.

Không dùng AI narration và không tạo video giả.

## 14. Bước 11 — Agent Skill

Agent Skill được đề mô tả là khuyến khích, nhưng chiếm 10 điểm trong rubric.

Nếu nhắm điểm cao:

1. Tạo skill tái sử dụng workflow automation.
2. Skill hướng dẫn data-driven generation.
3. Skill kiểm tra ít nhất ba assertions.
4. Skill chạy multi-browser.
5. Skill kiểm tra report metadata.
6. Skill hỗ trợ review và phân loại failure.
7. Nộp skill cùng bài.
8. Có YouTube link demo cách dùng skill end-to-end trên một feature hoàn chỉnh.

Không ưu tiên Agent Skill trước khi hoàn thành ba feature và chín reports.

## 15. Cấu trúc submission

Tên ZIP:

```text
<StudentID>_HW04_AI_Automation_<SelfAssessedGrade>.zip
```

Ví dụ:

```text
25127001_HW04_AI_Automation_090.zip
```

`SelfAssessedGrade` phải có ba chữ số trong khoảng `000`–`100`.

Cấu trúc đề xuất:

```text
<StudentID>_HW04_AI_Automation_<Grade>/
├── README.md
├── links.md
├── documents/
│   ├── main-report.md
│   ├── main-report.pdf
│   ├── ai-critique.md
│   ├── ai-critique.pdf
│   ├── ai-audit-report.md
│   ├── ai-audit-report.pdf
│   ├── bug-report.md
│   └── git-commit-log.txt
├── automation/
│   ├── package.json
│   ├── package-lock.json
│   ├── playwright.config.ts
│   ├── tsconfig.json
│   ├── tests/
│   │   ├── fr02-login-lockout.spec.ts
│   │   ├── fr11-order-history.spec.ts
│   │   ├── fr14-category-crud.spec.ts
│   │   └── support/
│   ├── test-data/
│   │   ├── fr02-login-lockout.json
│   │   ├── fr11-order-history.json
│   │   └── fr14-category-crud.json
│   └── agent-skill/
│       └── SKILL.md
├── reports/
│   ├── html/
│   │   ├── fr02-login-lockout/
│   │   │   ├── chromium/
│   │   │   ├── firefox/
│   │   │   └── webkit/
│   │   ├── fr11-order-history/
│   │   │   ├── chromium/
│   │   │   ├── firefox/
│   │   │   └── webkit/
│   │   └── fr14-category-crud/
│   │       ├── chromium/
│   │       ├── firefox/
│   │       └── webkit/
│   └── run-manifest.json
└── evidence/
    ├── bug-screenshots/
    └── other-supporting-evidence/
```

## 16. Bước 12 — Submission audit

### Prompt audit cuối

```text
Audit hw/hw4/submission như một TA khó tính. Kiểm tra filename,
Markdown/PDF pairs, tối thiểu 36 test cases, 9 browser reports,
report metadata, README summary, links, AI critique 200–300 words,
AI audit, Git log 8 commits/4 days, bug evidence và file lớn.
Không sửa nội dung trước; xuất danh sách PASS/FAIL/BLOCKED với
bằng chứng đường dẫn và đề xuất thứ tự khắc phục.
```

### Checklist cuối

- [ ] Đúng ba feature từ Pool A, B và C.
- [ ] Ít nhất 12 test case cho FR-02.
- [ ] Ít nhất 12 test case cho FR-11.
- [ ] Ít nhất 12 test case cho FR-14.
- [ ] Data nằm trong JSON/CSV riêng.
- [ ] Có ít nhất ba assertion patterns.
- [ ] FR-02 chạy Chromium.
- [ ] FR-02 chạy Firefox.
- [ ] FR-02 chạy WebKit.
- [ ] FR-11 chạy Chromium.
- [ ] FR-11 chạy Firefox.
- [ ] FR-11 chạy WebKit.
- [ ] FR-14 chạy Chromium.
- [ ] FR-14 chạy Firefox.
- [ ] FR-14 chạy WebKit.
- [ ] Có tối thiểu chín HTML reports.
- [ ] Mỗi report có `Run by: <StudentID>`.
- [ ] Mỗi report có ISO timestamp.
- [ ] Kết quả README khớp với report.
- [ ] Main report có Markdown và PDF.
- [ ] AI Audit Report có Markdown và PDF.
- [ ] AI Critique có Markdown và PDF.
- [ ] AI Critique dài 200–300 từ.
- [ ] Bug report tồn tại.
- [ ] Bug thật có GitHub Issue và screenshot.
- [ ] Git repository là public.
- [ ] Có ít nhất tám commit thay đổi test scripts.
- [ ] Các commit trải trên ít nhất bốn ngày.
- [ ] Có `git-commit-log.txt`.
- [ ] Video unlisted dài ít nhất năm phút.
- [ ] Video có giọng nói tiếng Việt.
- [ ] Video có `whoami`/`hostname` hoặc face-cam.
- [ ] Video cho thấy multi-browser run và HTML report.
- [ ] Video giải thích ít nhất một fix đối với output AI.
- [ ] README có self-assessment và test summary.
- [ ] Tên ZIP đúng mẫu.
- [ ] ZIP không chứa `node_modules`.
- [ ] ZIP không chứa runtime logs không cần thiết.
- [ ] Mỗi file Moodle không quá 20 MB.
- [ ] Tổng số file upload Moodle không quá 20.
- [ ] Đã giải nén thử ZIP và kiểm tra file mở được.
- [ ] Đã nộp trước deadline.

## 17. Những file không nên đưa vào ZIP

Không đưa các file/thư mục sau vào submission:

```text
node_modules/
backend.stdout.log
backend.stderr.log
frontend.stdout.log
frontend.stderr.log
admin.stdout.log
admin.stderr.log
matrix.stdout.log
matrix.stderr.log
```

Chỉ giữ trace, screenshot hoặc video test-result khi thực sự cần làm bằng chứng. HTML reports vẫn phải đầy đủ và có thể mở được sau khi giải nén.

## 18. Phân công giữa Codex và sinh viên

| Công việc | Codex | Sinh viên |
|---|---|---|
| Audit đề và repository | Thực hiện chính | Xác nhận |
| Thiết kế/refine test cases | Hỗ trợ mạnh | Review |
| Viết và sửa Playwright | Thực hiện kỹ thuật | Chịu trách nhiệm cuối |
| Chạy test và phân tích trace | Hỗ trợ | Xác nhận môi trường |
| Sinh HTML report thật | Chạy pipeline | Giám sát |
| Phân loại bug | Phân tích bằng chứng | Xác nhận defect |
| Main report và AI audit | Soạn từ evidence | Kiểm tra tính trung thực |
| Git commits | Chuẩn bị thay đổi | Tự commit đúng ngày |
| Video | Chuẩn bị kịch bản | Tự quay và thuyết minh |
| Self-assessment | Tính từ evidence | Quyết định điểm |

## 19. Thứ tự ưu tiên khi thiếu thời gian

1. Bắt đầu lịch Git bốn ngày ngay.
2. Đảm bảo đủ 12 test case cho mỗi feature.
3. Làm FR-02 chạy trên ba browser.
4. Làm FR-11 chạy trên ba browser.
5. Làm FR-14 chạy trên ba browser.
6. Xác minh đủ chín HTML reports và metadata.
7. Hoàn thiện main report và PDF.
8. Hoàn thiện AI Audit Report và PDF.
9. Hoàn thiện AI Critique 200–300 từ và PDF.
10. Quay video.
11. Hoàn thiện README, links và Git log.
12. Làm Agent Skill nếu nhắm điểm cao.
13. Audit, ZIP, giải nén thử và nộp Moodle.

Không dành thời gian trang trí báo cáo trước khi đủ ba feature × ba browser. Ba feature chiếm tổng cộng 75 điểm, và thiếu tài liệu bắt buộc có thể dẫn đến 0 điểm.

## 20. Prompt playbook cho từng bước

### Cách sử dụng

Trước khi bắt đầu, thay các placeholder sau:

- `<StudentID>`: MSSV của sinh viên.
- `<FullName>`: họ tên.
- `<GitHubURL>`: URL public repository.
- `<Feature>`: `FR-02`, `FR-11` hoặc `FR-14`.
- `<Browser>`: `chromium`, `firefox` hoặc `webkit`.

Nguyên tắc dùng prompt:

1. Mỗi prompt chỉ giải quyết một mục tiêu rõ ràng.
2. Yêu cầu Codex đọc file và bằng chứng hiện có trước khi sửa.
3. Sau mỗi thay đổi, phải chạy kiểm tra phù hợp.
4. Không yêu cầu AI tạo report, screenshot, timestamp, Git history hoặc kết quả giả.
5. Không cho AI sửa SUT chỉ để làm test pass.
6. Ghi prompt và output vào AI Audit Report.
7. Sinh viên phải review diff và chịu trách nhiệm cho thay đổi cuối cùng.

### Prompt 0 — Đọc đề và policy

```text
Đọc đầy đủ:
- hw/hw4/2026.HW04.Automation Testing_En.pdf
- hw/___2026.Homework.Policies.pdf

Sau đó lập bảng requirement traceability gồm:
- requirement;
- bắt buộc hay khuyến khích;
- deliverable/evidence cần có;
- vị trí dự kiến trong submission;
- trạng thái PASS/FAIL/BLOCKED;
- rủi ro bị 0 điểm.

Chỉ kết luận dựa trên nội dung hai PDF và repository hiện tại.
Không sửa file ở bước này. Nếu hai tài liệu có điểm khác nhau, nêu rõ
và ưu tiên quy định cụ thể của HW04 nhưng không được bỏ qua policy chung.
```

### Prompt 1 — Audit repository ban đầu

```text
Audit toàn bộ hw/hw4 theo requirement traceability của HW04.
Không sửa file trước.

Đối với FR-02, FR-11 và FR-14, hãy kiểm tra:
- số test case thực tế trong spec;
- positive, negative và edge coverage;
- data file JSON/CSV;
- dữ liệu còn hardcode trong test;
- assertion patterns;
- selector và wait dễ flaky;
- Chromium/Firefox/WebKit coverage;
- HTML report hiện có;
- Run by: <StudentID> và ISO timestamp;
- tài liệu và evidence liên quan.

Xuất bảng PASS/FAIL/BLOCKED, dẫn đường dẫn file làm bằng chứng,
và xếp việc còn thiếu theo P0/P1/P2. Không suy đoán kết quả chạy.
```

### Prompt 2 — Kiểm tra và tạo baseline execution

```text
Kiểm tra package.json, playwright.config.ts, các service URL và hướng dẫn
khởi động SUT trong hw/hw4. Xác định lệnh an toàn để chạy baseline trên
Chromium cho từng feature.

Sau đó chạy lần lượt FR-02, FR-11 và FR-14 trên Chromium. Với mỗi feature,
ghi:
- lệnh chạy;
- số passed/failed/skipped;
- thời gian;
- error chính;
- report/evidence path;
- blocker môi trường nếu có.
  
Không sửa test trong bước baseline và không tạo kết quả giả.
Nếu service chưa chạy, kiểm tra nguyên nhân và hướng dẫn cách khởi động.
```

### Prompt 3 — Lập kế hoạch Git bốn ngày

```text
Dựa trên git log hiện tại và các thay đổi test còn thiếu, lập kế hoạch
tối thiểu 8 commit hợp lệ trải trên ít nhất 4 ngày.

Chỉ commit thay đổi .spec.ts/.spec.js hoặc test-script tương đương mới
được tính theo đề. Chia thay đổi thành các đơn vị kỹ thuật có ý nghĩa,
mỗi commit có:
- mục tiêu;
- file test dự kiến thay đổi;
- verification;
- commit message Conventional Commits.

Không backdate, không tạo empty commit và không đề xuất giả lịch sử.
Không tự commit nếu tôi chưa yêu cầu.
```

### Prompt 4 — Review test design của một feature

Chạy prompt này riêng cho từng feature.

```text
Review test design của <Feature> dựa trên requirement, UI/SUT thực tế,
spec hiện có và data file tương ứng.

Yêu cầu:
- tối thiểu 12 test case có giá trị;
- cân bằng positive, negative và edge cases;
- mỗi test có ID, precondition, data, steps, expected result;
- không tạo nhiều test gần như trùng nhau chỉ để đủ số lượng;
- xác định test độc lập và test cần setup/cleanup;
- đánh dấu case khó hoặc không thể automation cùng lý do.

Xuất coverage matrix trước. Không sửa code cho đến khi chỉ ra rõ gap.
```

### Prompt 5 — Hoàn thiện data-driven testing

```text
Review <Feature> spec và file JSON/CSV tương ứng.
Refactor test data để đáp ứng data-driven testing của HW04:
- dữ liệu test nằm trong JSON hoặc CSV riêng;
- không dùng inline array/object làm nguồn test case;
- schema nhất quán và có test ID rõ ràng;
- không chứa credential hoặc dữ liệu cá nhân thật;
- test code validate dữ liệu đầu vào với lỗi dễ hiểu;
- giữ nguyên ý nghĩa business của từng test.

Trước khi sửa, liệt kê dữ liệu đang hardcode và kế hoạch di chuyển.
Sau khi sửa, chạy type-check và test <Feature> trên Chromium.
Không thay assertion hoặc giảm coverage chỉ để test pass.
```

### Prompt 6 — Cải thiện assertion

```text
Review assertions của <Feature>.
Đảm bảo suite có ít nhất 3 assertion patterns khác nhau và assertion
kiểm tra business outcome, không chỉ kiểm tra element tồn tại.

Tìm:
- assertion yếu;
- thiếu negative assertion;
- assertion phụ thuộc text không ổn định;
- assertion không kiểm tra persistence;
- test có hành động nhưng không có kết quả được xác nhận.

Đề xuất thay đổi kèm lý do trước, sau đó sửa tối thiểu cần thiết.
Chạy test <Feature> trên Chromium và báo kết quả thật.
Không xóa hoặc nới lỏng assertion chỉ để tạo trạng thái pass.
```



## 21. Prompt tiếp tục công việc mỗi ngày

### Quy tắc audit bắt buộc cho mọi prompt

Từ mỗi prompt công việc tiếp theo, cập nhật đồng thời:

```text
hw/hw4/docs/ai-audit-report.md
```

Mỗi entry phải có:

1. Interaction ID tăng tuần tự.
2. ISO date/time nếu hệ thống thực sự ghi nhận được.
3. Tên AI tool.
4. Input prompt nguyên văn.
5. Output nguyên văn toàn bộ final answer đã trả cho sinh viên, không tóm tắt,
   rút gọn hoặc diễn giải lại.
6. Đường dẫn source/report/trace/screenshot/commit làm evidence.
7. Human-review status, phần được chấp nhận và phần bị sửa/từ chối.

Human review không được xem là hoàn thành chỉ vì Codex đã tạo entry. Sau khi
kiểm tra output và evidence, sinh viên phải điền:

```markdown
### Human review

- Reviewer: <student name or Student ID>
- Reviewed at: <ISO 8601 timestamp>
- Decision: PENDING | ACCEPTED | ACCEPTED_WITH_CHANGES | REJECTED
- What I verified:
  - <evidence đã kiểm tra>
- Accepted:
  - <phần AI output được chấp nhận>
- Corrected/rejected:
  - <phần bị sửa/từ chối và lý do>
- Follow-up:
  - <việc còn lại hoặc None>
- Review evidence:
  - <commit/report/file path>
```

Codex phải để `PENDING` cho đến khi sinh viên xác nhận quyết định. Codex không
được tự điền danh tính reviewer, review timestamp hoặc tự tuyên bố output đã
được human review.

Không tự dựng lại giờ của interaction cũ. Nếu giờ không được ghi nhận, dùng:

```text
Time: not captured
```

Raw output quá lớn như Playwright trace, video hoặc generated HTML không dán
vào Markdown nếu nó không xuất hiện trong final answer. Audit log vẫn phải chép
nguyên văn toàn bộ final answer và dẫn đúng đường dẫn artifact. Lượt bị
interrupted phải ghi rõ không có final answer, không được dựng output thay thế.

### Đầu phiên

```text
Đọc plan-hw4.md, git status, git log gần nhất và submission audit hiện tại.
Cho tôi biết:
- hôm nay là ngày thứ mấy trong kế hoạch Git;
- commit test-script hợp lệ còn thiếu;
- P0 blocker hiện tại;
- feature/browser cần làm tiếp;
- mục tiêu có thể hoàn thành trong phiên này.

Không sửa file trước khi xác định trạng thái.
```

### Cuối phiên

```text
Tổng kết phiên HW04 dựa trên git diff và execution evidence:
- việc đã hoàn thành;
- test/report mới;
- failure còn lại;
- file đã thay đổi;
- verification đã chạy;
- prompt/output cần ghi AI Audit;
- commit test-script nên tạo;
- việc ưu tiên cho phiên tiếp theo.

Không tự tuyên bố hoàn thành nếu còn P0 blocker.
```
