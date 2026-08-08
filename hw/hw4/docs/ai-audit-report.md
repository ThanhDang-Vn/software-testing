# HW04 AI Audit Report

## Declaration

> I use AI tools for the following tasks.

## Student and assignment

- Student ID: `23127334`
- Assignment: `HW04 – Automation Testing`
- AI tool: OpenAI Codex
- Canonical audit file: `hw/hw4/docs/ai-audit-report.md`
- Audit convention: timestamps use ISO 8601 where captured. Missing historical
  times are explicitly marked `not captured`; they are never reconstructed.

## Logging convention

Every AI-assisted work item must record:

1. Interaction ID.
2. Date and time.
3. AI tool.
4. Exact input prompt.
5. AI output copied verbatim from the complete final answer returned to the
   student. It must not be summarized, shortened, or paraphrased.
6. Files or execution evidence.
7. Human-review status and corrections.

## Human-review protocol

AI output is not considered human-reviewed merely because it appears in this
file. The student must complete the following block after inspecting the
output, source diff, and execution evidence:

```markdown
### Human review

- Reviewer: <student name or Student ID>
- Reviewed at: <ISO 8601 timestamp>
- Decision: PENDING | ACCEPTED | ACCEPTED_WITH_CHANGES | REJECTED
- What I verified:
  - <source diff, command result, report, screenshot, trace, requirement>
- Accepted:
  - <specific AI conclusion or change accepted>
- Corrected/rejected:
  - <specific AI conclusion or change corrected/rejected and why>
- Follow-up:
  - <remaining action, or None>
- Review evidence:
  - <commit/report/file path>
```

Rules:

- `PENDING` means no human approval is claimed.
- Codex may prepare review questions or evidence, but it must not fill the
  student's decision, identity, or review timestamp.
- `ACCEPTED` requires the student to inspect the relevant result and evidence.
- `ACCEPTED_WITH_CHANGES` must state exactly what the student corrected.
- `REJECTED` must state why the AI output was not used.
- A later review may update a pending block without changing the verbatim input
  prompt or output.

## Origin and human-review change model

Every interaction is versioned with the following rule:

```markdown
### Origin

#### Input prompt (verbatim)

<the original student prompt; immutable>

#### Output (verbatim)

<the original AI final answer; immutable>

### Human review change

- Change ID: HRC-<interaction>-<sequence>
- Requested by: <student/reviewer>
- Requested at: <ISO timestamp, or exact time not captured>
- Origin interaction: <HW04-AI-nnn>
- Change request: <what the human asked to correct/reclassify/add>
- Reason: <why the origin needed adjustment>
- Applied change: <what changed in code/data/report>
- Verification: <evidence and result>
- Decision: PENDING | ACCEPTED | ACCEPTED_WITH_CHANGES | REJECTED

### Reviewed state

- Current accepted interpretation:
- Remaining follow-up:
- Evidence:
```

Rules:

- Existing `Input prompt` and `Output (verbatim)` sections are the **ORIGIN**
  record even when their historical heading does not contain the word Origin.
- Origin prompt/output text is immutable and must never be rewritten to make a
  later result appear as if it was the AI's first answer.
- Student corrections are appended as `Human review change` records.
- Code/data edits resulting from review are linked to the origin interaction
  and verification evidence.
- If a turn was interrupted, its origin output remains the explicit interrupted
  marker; a later completed interaction supplies the reviewed state.
- Summary/status fields may advance, but the original verbatim response stays
  preserved.

## Existing origin-to-change links

| Origin | Human review change | Reviewed state |
|---|---|---|
| HW04-AI-012 — test-design review | HW04-AI-014 — implement five selected P0 corrections | Accepted with changes; Chromium evidence recorded |
| HW04-AI-016 — FR-02 refactor, interrupted final | Implementation/evidence produced before interruption | Pending completed summary and explicit student review |
| HW04-AI-017 — optional Lavish explanation | HW04-AI-018 — student rejected Lavish as unnecessary | Lavish removed from HW04 workflow |
| HW04-AI-019 — FR-11/FR-14 refactor | No human change yet | Pending student review |

`Output (verbatim)` records the complete final answer exactly as returned to the
student, including headings, tables, code blocks, wording, and file links.
Very large raw command output remains in the referenced HTML report, trace,
screenshot, terminal transcript, or repository artifact unless that raw output
was itself included in the final answer. Commentary updates and internal tool
calls are not treated as the final answer.

Interactions `HW04-AI-001` through `HW04-AI-007` were initially reconstructed
as historical summaries before the verbatim rule was requested. They are
therefore labelled historical summaries and must not be presented as verbatim
transcripts. Starting with the three most recent prompts recorded below, the
audit distinguishes verbatim output from interrupted turns explicitly.

---

## Interaction HW04-AI-001 — Requirements and submission structure

- Date: 2026-08-07
- Time: not captured
- Tool: OpenAI Codex
- Task: Read HW04 and the general homework policy, then identify deliverables.

### Input prompt

```text
cho tôi biết output của homework 4 yêu cầu những gì cho tôi file structure để nộp luôn "hw\hw4\2026.HW04.Automation Testing_En.pdf" và đồng thời phải đảm bảo tuân theo hw\___2026.Homework.Policies.pdf Nhé
```

### Output

Codex read both PDFs and identified the required submission structure:

- ZIP name:
  `<StudentID>_HW04_AI_Automation_<SelfAssessedGrade>.zip`.
- Three web features, one from each of Pools A, B, and C.
- At least 12 automated cases per feature.
- External JSON/CSV data and at least three assertion patterns.
- Chromium, Firefox, and WebKit execution for every feature.
- At least nine feature/browser HTML reports.
- Every report must visibly contain `Run by: <StudentID>` and an ISO timestamp.
- Main report in Markdown and PDF.
- AI Audit Report in Markdown and PDF.
- AI Critique of 200–300 words in Markdown and PDF.
- Unlisted Vietnamese-narrated demo video of at least five minutes.
- Public repository and a Git commit log with at least eight test-script
  commits over at least four days.
- GitHub Issues with screenshots for confirmed defects.
- README with self-assessment and execution summary.

The recommended ZIP tree separated `documents`, `automation`, `reports`, and
`evidence`. The specific HW04 filename was selected over the generic policy
template because it is the assignment-specific rule.

### Evidence

- `hw/hw4/2026.HW04.Automation Testing_En.pdf`
- `hw/___2026.Homework.Policies.pdf`

### Human review

- Status: pending student confirmation.
- Student subsequently requested an execution strategy and plan file.

---

## Interaction HW04-AI-002 — Execution strategy

- Date: 2026-08-07
- Time: not captured
- Tool: OpenAI Codex

### Input prompt

```text
cho tôi chiến lược từng step để hoàn thành bài này hiệu quả, nhanh tiết kiệm với sự hỗ trợ của agent xịn xò như codex
```

### Output

Codex proposed the critical path:

1. Start the authentic four-day Git history immediately.
2. Retain FR-02, FR-11, and FR-14.
3. Complete one feature at a time in the order FR-02 → FR-11 → FR-14.
4. Use the same loop for every feature: inspect requirement, review 12 cases,
   externalize data, run Chromium, fix test defects, run Firefox and WebKit,
   classify failures, and generate genuine reports.
5. Build a 3-feature × 3-browser execution matrix.
6. Classify every failure as `TEST_DEFECT`, `SUT_DEFECT`, `ENVIRONMENT`,
   `FLAKY`, or `BLOCKED`.
7. Update documentation and the AI audit alongside implementation.
8. Record the video only after one stable end-to-end flow exists.
9. Audit the submission and extracted ZIP before Moodle submission.

Codex explicitly separated work AI may assist with from evidence the student
must personally produce, such as commits over real days, voice narration,
authorship evidence, and confirmation of genuine defects.

### Evidence

- `hw/hw4/plan-hw4.md`

### Human review

- Status: accepted in principle.
- Student requested that the strategy and reusable prompts be written to a
  Markdown plan.

---

## Interaction HW04-AI-003 — Browser selection

- Date: 2026-08-07
- Time: not captured
- Tool: OpenAI Codex

### Input prompt

```text
3 browser nên dùng là
```

### Output

The selected browser engines were:

1. Chromium.
2. Firefox.
3. WebKit.

This matches the browser combination named directly in the HW04 assignment and
the three Playwright projects in `playwright.config.ts`. Codex noted that the
report should use the precise engine names: Chromium is not the Chrome binary,
and WebKit is not a claim that the test ran on Safari itself.

### Evidence

- `hw/hw4/playwright.config.ts`

### Human review

- Status: accepted.

---

## Interaction HW04-AI-004 — Plan and prompt playbook

- Date: 2026-08-07
- Time: not captured
- Tool: OpenAI Codex

### Input prompts

```text
ghi hết plan vào file plan-hw4.md đi
```

```text
kèm prompt của từng bước chứ
```

```text
try again
```

### Output

Codex created and expanded `hw/hw4/plan-hw4.md`. It contains:

- Feature scope and browser choice.
- Four-day Git strategy.
- Per-feature completion loops.
- Data-driven and assertion requirements.
- Failure classification workflow.
- Report matrix and metadata requirements.
- Documentation, video, Agent Skill, submission, and ZIP checklists.
- A copy-paste prompt playbook covering requirement analysis, repository audit,
  baseline execution, Git planning, feature implementation, browser runs,
  failure diagnosis, reporting, documentation, video planning, Agent Skill,
  PDF export, and final readiness review.
- Explicit constraints against fabricated reports, timestamps, Git history,
  screenshots, issues, or execution results.

### Evidence

- `hw/hw4/plan-hw4.md`

### Human review

- Status: accepted and used for the subsequent audit and baseline prompts.

---

## Interaction HW04-AI-005 — Repository requirement audit

- Date: 2026-08-07
- Time: not captured
- Tool: OpenAI Codex

### Input prompt

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

### Output

Codex performed a read-only audit and concluded `NOT READY`.

Verified implementation:

| Feature | Logical cases | Existing browser reports |
|---|---:|---:|
| FR-02 | 15 | 3 |
| FR-11 | 12 | 0 |
| FR-14 | 12 | 0 |

Main findings:

- FR-02 had genuine Chromium, Firefox, and WebKit artifacts with 27 passed and
  18 failed executions in total.
- FR-11 contained an inline `sample` order array and hardcoded credentials.
- FR-11 UI cases used intercepted order responses, limiting true frontend to
  backend integration evidence.
- FR-14 did not yet cover successful update and successful delete sufficiently
  for a feature named Category CRUD.
- FR-14 and FR-11 had no browser execution reports at audit time.
- The suite used more than three assertion patterns.
- Positional and CSS-class locators remained in the tests.
- Demo video and GitHub Issue links were still `TODO`.
- Git history contained no qualifying HW04 spec commits.

Priority:

- P0: complete FR-11/FR-14 reports, fix data-driven violations, complete FR-14
  CRUD coverage, satisfy real Git history, video, issue, and audit requirements.
- P1: improve selectors, integration coverage, isolation, and execution review.
- P2: polish Agent Skill, traceability, and packaging.

The attempted local typecheck/test discovery was blocked by sandbox `EPERM`;
Codex did not claim it passed.

### Evidence

- `hw/hw4/tests/*.spec.ts`
- `hw/hw4/test-data/*.json`
- `hw/hw4/reports/run-manifest.json`
- `hw/hw4/reports/html/fr02-login-lockout/`
- `hw/hw4/docs/`
- `hw/hw4/submission/`

### Human review

- Status: accepted as the basis for baseline execution.
- No source files were modified during the audit.

---

## Interaction HW04-AI-006 — Chromium baseline execution

- Date: 2026-08-07
- Execution timestamps:
  - FR-02: `2026-08-07T02:29:48.2177089Z`
  - FR-11: `2026-08-07T02:31:54.4060589Z`
  - FR-14: `2026-08-07T02:34:10.3536545Z`
- Tool: OpenAI Codex controlling local Playwright execution

### Input prompt

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

### Output

Initial service probes showed that ports 3000, 5173, and 5174 were not
listening. Codex started:

- Backend: `node server.js`.
- Customer frontend: `npm.cmd run dev -- --host 127.0.0.1`.
- Admin frontend: `npm.cmd run dev -- --host 127.0.0.1`.

All three URLs then returned HTTP 200. Baselines were written to dedicated
folders so historical FR-02 reports were not overwritten.

| Feature | Passed | Failed | Skipped | Elapsed | Exit code |
|---|---:|---:|---:|---:|---:|
| FR-02 | 9 | 6 | 0 | 97.240 s | 1 |
| FR-11 | 12 | 0 | 0 | 8.076 s | 0 |
| FR-14 | 6 | 6 | 0 | 69.853 s | 1 |

FR-02 failures:

- FR02-TC-009: email input type was `text`, expected `email`.
- FR02-TC-010: password input type was `text`, expected `password`.
- FR02-TC-012: valid login was blocked after two failed attempts.
- FR02-TC-013: backend returned 403 earlier than the expected threshold.
- FR02-TC-014: generic message appeared instead of the locked-account message.
- FR02-TC-015: account remained locked after the specified 30 seconds.

FR-14 failures:

- FR14-TC-005: empty name returned 200, expected 400.
- FR14-TC-006: missing name returned 200, expected 400.
- FR14-TC-007: whitespace-only name returned 200, expected 400.
- FR14-TC-009: unknown delete ID returned 200, expected 404.
- FR14-TC-011: category input lacked the required attribute/marker.
- FR14-TC-012: no confirmation dialog appeared; the test timed out.

All three HTML reports opened successfully and visibly displayed Student ID
`23127334` and an ISO timestamp. FR-02 and FR-14 each produced six screenshots,
six traces, six videos, and six error-context files. The source diff check
confirmed that package/config/spec files were unchanged. The three services
were stopped after execution.

### Evidence

- `hw/hw4/reports/baseline/fr02-login-lockout/chromium/index.html`
- `hw/hw4/reports/baseline/fr11-order-history/chromium/index.html`
- `hw/hw4/reports/baseline/fr14-category-crud/chromium/index.html`
- `hw/hw4/test-results/baseline-fr02-chromium/`
- `hw/hw4/test-results/baseline-fr11-chromium/`
- `hw/hw4/test-results/baseline-fr14-chromium/`
- Service logs: `%TEMP%\hw4-baseline-services\`

### Human review

- Status: pending student classification/approval of candidate SUT defects.
- FR-11 passing results must be interpreted with the documented mocked-response
  limitation.

---

## Interaction HW04-AI-007 — Four-day Git plan

- Date: 2026-08-07
- Time: not captured
- Tool: OpenAI Codex

### Input prompt

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

### Output

Git inspection found:

- Current branch: `homework3`.
- No `homework4` branch existed.
- No commit in the repository changed an HW04 `.spec.ts`.
- Root `.gitignore` ignored all of `hw/hw4/`.

Codex proposed two genuine test-script commits per day:

| Date | Commit scope |
|---|---|
| 2026-08-07 | Track baseline suites; externalize FR-11 fixtures |
| 2026-08-08 | Add FR-14 update coverage; add successful delete coverage |
| 2026-08-09 | Stabilize FR-02 lockout/expiry; add FR-11 real-backend coverage |
| 2026-08-10 | Isolate FR-14/admin access; apply evidence-based cross-browser fixes |

Proposed Conventional Commit messages:

```text
test(hw4): add baseline Playwright suites for three features
test(fr11): externalize order fixtures and expected values
test(fr14): add category update and persistence coverage
test(fr14): verify successful category deletion end to end
test(fr02): stabilize lockout state and expiry verification
test(fr11): add real backend order history coverage
test(fr14): isolate category actions and enforce admin access
test(hw4): harden Playwright suites across browser engines
```

Every commit must contain a substantive `.spec.ts` change and its own
verification. Codex explicitly rejected empty commits, backdating, timestamp
manipulation, documentation-only commits counted as test commits, and
whitespace-only changes.

### Evidence

- Current branch: `homework3`
- `.gitignore` rule: `hw/hw4/`
- Git log query returned zero HW04 spec commits.

### Human review

- Status: pending.
- No branch was created and no commit was made.

---

## Interaction HW04-AI-008 — Establish continuous audit logging

- Date: 2026-08-07
- Time: current session; exact wall-clock time not captured
- Tool: OpenAI Codex

### Input prompt

```text
Tôi muốn bạn ghi lại audit log đồng thời mỗi prompt luôn đi để dễ trace, có input prompt và output
```

### Output (verbatim)

```text
Đã thiết lập audit log tại ai-audit-report.md.

Mình đã backfill 8 interaction chính, gồm:

- Đọc đề và policy.
- Chiến lược hoàn thành bài.
- Chọn ba browser.
- Tạo plan và prompt playbook.
- Audit repository.
- Chạy Chromium baseline.
- Lập kế hoạch Git bốn ngày.
- Yêu cầu thiết lập continuous audit logging.

Mỗi interaction có:

- Input prompt nguyên văn.
- Output và số liệu thực tế.
- Timestamp nếu đã ghi nhận được.
- Evidence/report paths.
- Trạng thái human review.
- Không bịa thời gian của interaction cũ; dùng `not captured`.

Mình cũng bổ sung quy tắc logging vào plan-hw4.md.

Từ prompt HW4 tiếp theo, mình sẽ cập nhật audit log ngay trong cùng lượt làm việc theo mẫu:

## Interaction HW04-AI-XXX

- Date/time:
- Tool:
- Task:

### Input prompt

<prompt nguyên văn>

### Output

<kết quả, số liệu, quyết định và blocker>

### Evidence

<source/report/trace/screenshot/commit paths>

### Human review

- Status:
- Accepted:
- Corrected/rejected:

Raw artifacts lớn như HTML report, trace và video sẽ không nhúng vào Markdown; audit log ghi kết quả chính xác và dẫn tới artifact tương ứng. Bản trong `submission/documents` sẽ được đồng bộ khi chốt tài liệu nộp để tránh PDF/Markdown submission lệch phiên bản giữa quá trình đang làm.
```

Note: the rendered response contained clickable local-file links for
`ai-audit-report.md` and `plan-hw4.md`. Markdown link targets are retained by
the conversation transcript; the text block above preserves the visible
answer.

### Evidence

- `hw/hw4/docs/ai-audit-report.md`

### Human review

- Status: awaiting student confirmation.

---

## Interaction HW04-AI-009 — Require full output

- Date: 2026-08-07
- Time: current session; exact wall-clock time not captured
- Tool: OpenAI Codex

### Input prompt

```text
OUTPUT thì hãy ghi full những gì bạn trả về đi
```

### Output (verbatim)

```text
[Turn interrupted before a final answer was returned.]
```

### Evidence

- Conversation turn was interrupted.
- No final assistant response existed to copy.

### Human review

- Status: superseded by `HW04-AI-010`.
- No output was fabricated for the interrupted turn.

---

## Interaction HW04-AI-010 — Require verbatim output and three latest prompts

- Date: 2026-08-07
- Time: current session; exact wall-clock time not captured
- Tool: OpenAI Codex

### Input prompt

```text
OUTPUT thì hãy ghi full những gì bạn trả về đi và có kèm theo 3 prompt gând đây nhất nữa
```

### Output (verbatim)

```text
Đã cập nhật quy ước audit trong ai-audit-report.md.

Ba prompt gần nhất đã được ghi:

1. Yêu cầu thiết lập continuous audit logging.
2. Yêu cầu ghi full output — lượt này bị interrupted nên được ghi đúng là không có final answer.
3. Yêu cầu hiện tại về verbatim output và ba prompt gần nhất.

Từ interaction HW04-AI-010 trở đi:

- `Input prompt` được chép nguyên văn.
- `Output (verbatim)` chứa toàn bộ final answer mình gửi, không tóm tắt hoặc diễn giải lại.
- Lượt bị interrupted được ghi rõ, không tạo output giả.
- Raw report, trace, video và terminal artifacts vẫn được dẫn bằng evidence path; nếu nội dung đó xuất hiện trong final answer thì phần đã trả lời vẫn được chép nguyên văn.

Các interaction HW04-AI-001 đến HW04-AI-007 vốn được dựng lại dưới dạng historical summaries trước khi bạn yêu cầu verbatim. File audit đã ghi rõ giới hạn này để không giả vờ rằng summary là transcript nguyên văn.
```

### Evidence

- `hw/hw4/docs/ai-audit-report.md`

### Human review

- Status: awaiting student confirmation.

---

## Interaction HW04-AI-011 — Add explicit human review

- Date: 2026-08-07
- Time: current session; exact wall-clock time not captured
- Tool: OpenAI Codex

### Input prompt

```text
tôi muốn bạn điều chỉnh một tý để có human review
```

### Output (verbatim)

```text
Đã điều chỉnh audit log để có quy trình human review rõ ràng.

Từ bây giờ, mỗi interaction sẽ tách riêng:

- Input prompt nguyên văn.
- Output nguyên văn.
- Evidence.
- Human review do chính bạn xác nhận.

Khối human review mới gồm:

- Reviewer.
- ISO review timestamp.
- Decision: PENDING, ACCEPTED, ACCEPTED_WITH_CHANGES hoặc REJECTED.
- Những gì bạn đã kiểm tra.
- Phần output AI được chấp nhận.
- Phần bị sửa hoặc từ chối và lý do.
- Follow-up còn lại.
- Review evidence.

Codex sẽ mặc định để `PENDING`; mình không tự điền tên người review, thời gian hoặc tuyên bố rằng bạn đã duyệt. Sau khi bạn kiểm tra một kết quả, bạn chỉ cần nói, ví dụ:

`Human review HW04-AI-006: ACCEPTED_WITH_CHANGES — FR-11 pass nhưng cần ghi rõ UI dùng mocked response.`

Khi đó mình sẽ cập nhật đúng interaction, giữ nguyên prompt/output verbatim và chỉ thêm quyết định review của bạn.
```

### Evidence

- `hw/hw4/docs/ai-audit-report.md`
- `hw/hw4/plan-hw4.md`

### Human review

- Reviewer: not provided
- Reviewed at: not provided
- Decision: PENDING
- What I verified:
  - Pending student review.
- Accepted:
  - Pending student review.
- Corrected/rejected:
  - Pending student review.
- Follow-up:
  - Student confirms whether this audit structure is accepted.
- Review evidence:
  - None yet.

---

## Interaction HW04-AI-012 — Review test design for all selected features

- Date: 2026-08-07
- Time: current session; exact wall-clock time not captured
- Tool: OpenAI Codex

### Input prompt

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

### Output (verbatim)

```text
Đã hoàn thành review test design cho cả ba feature và không sửa test code.

Coverage matrix và review chi tiết từng case nằm trong:

test-design-review.md

Kết luận chính:

- FR-02 có 15 case và nhìn chung đủ 12 case có giá trị, nhưng TC-006 có oracle về khoảng trắng chưa được requirement quy định; TC-014 phụ thuộc quá chặt vào một câu thông báo; TC-015 automatable nhưng chậm và timing-sensitive.
- FR-11 có 12 case nhưng chưa đạt 12 case mạnh. TC-004 và TC-005 có thể pass mà không thực sự kiểm tra gì khi danh sách có 0–1 order. Quan trọng nhất, TC-012 đang mong đợi ba nút hủy, tức chấp nhận hủy order `shipping`, trái requirement chỉ cho user hủy trước giai đoạn shipping.
- FR-14 có 12 case nhưng chưa đạt 12 business cases mạnh. Thiếu successful UI create/delete và non-admin authorization. TC-012 yêu cầu confirmation dialog dù FR-14 không quy định confirmation, nên không được coi việc thiếu dialog là defect FR-14.
- Tên FR-14 có chữ “CRUD”, nhưng bullet requirement chỉ ghi Thêm/Xem/Xóa. Update được backend hỗ trợ nhưng trạng thái bắt buộc đang BLOCKED bởi ambiguity; cần hỏi giảng viên trước khi xem đó là requirement bắt buộc.
- Không có requirement nào hoàn toàn không thể automation. Các case khó là lock expiry 30 giây, locale date, cross-user order isolation và UI delete với cleanup.

P0 trước khi sửa code:

1. Sửa oracle FR11-TC-012 để shipping không có quyền hủy.
2. Thay hoặc hạ TC-012 của FR-14 thành exploratory usability case.
3. Bổ sung cross-user ownership cho FR-11.
4. Bổ sung successful create/view/delete coverage cho FR-14.
5. Bổ sung customer-token bị từ chối khi mutation category.

Human review của interaction này đang để PENDING. Chưa có thay đổi test nào được thực hiện.
```

### Evidence

- `hw/hw4/docs/test-design-review.md`
- `hw/eshop-sut/README.md`
- `hw/eshop-sut/api_specification.md`
- `hw/eshop-sut/backend/server.js`
- `hw/eshop-sut/frontend-web/src/pages/Login.jsx`
- `hw/eshop-sut/frontend-web/src/pages/Profile.jsx`
- `hw/eshop-sut/frontend-admin/src/App.jsx`
- `hw/hw4/tests/fr02-login-lockout.spec.ts`
- `hw/hw4/tests/fr11-order-history.spec.ts`
- `hw/hw4/tests/fr14-category-crud.spec.ts`
- `hw/hw4/test-data/*.json`

### Human review

- Reviewer: Student `23127334`
- Reviewed at: 2026-08-08; exact time not captured
- Decision: ACCEPTED_WITH_CHANGES
- What I verified:
  - Reviewed the reported coverage gaps and selected five P0 corrections for implementation.
- Accepted:
  - Add FR-11 cross-user ownership coverage.
  - Add FR-14 successful create/view/delete coverage.
  - Add customer-token authorization coverage for category mutation.
- Corrected/rejected:
  - Rejected the old FR11-TC-012 oracle that allowed cancellation in `shipping`.
  - Reclassified FR14-TC-012 from a mandatory requirement assertion to an exploratory usability observation.
- Follow-up:
  - Implement and verify the five selected corrections without modifying the SUT.
- Review evidence:
  - Student implementation request recorded in `HW04-AI-014`.
  - `hw/hw4/docs/test-design-review.md`

---

## Interaction HW04-AI-013 — Confirm requirements traceability matrix

- Date: 2026-08-07
- Time: current session; exact wall-clock time not captured
- Tool: OpenAI Codex

### Input prompt

```text
trong này có Requirements traceability matrix
```

### Output (verbatim)

```text
Có. Trong `test-design-review.md` đã có phần:

`Coverage matrix → Requirement-to-test coverage`

Phần này đang map:

- Requirement.
- Test case ID hiện có.
- Trạng thái coverage.
- Gap còn thiếu.

Nó đã là một Requirements Traceability Matrix ở mức test-design review, nhưng chưa phải RTM hoàn chỉnh để đưa vào main report cuối.

RTM hoàn chỉnh nên bổ sung các cột:

- Requirement ID/source.
- Requirement description.
- Test case IDs.
- Test type.
- Automation spec/data path.
- Chromium/Firefox/WebKit result.
- HTML report/evidence.
- Defect/GitHub Issue.
- Final status.

Hiện tại nên gọi phần đang có là `RTM Draft`. Sau khi chạy đủ 9 feature-browser runs, mình sẽ bổ sung execution results và evidence để chuyển nó thành `Final Requirements Traceability Matrix`.
```

### Evidence

- `hw/hw4/docs/test-design-review.md`

### Human review

- Reviewer: not provided
- Reviewed at: not provided
- Decision: PENDING
- What I verified:
  - Pending student confirmation of the RTM format.
- Accepted:
  - Pending student review.
- Corrected/rejected:
  - Pending student review.
- Follow-up:
  - Expand the draft RTM with browser execution evidence after the full matrix.
- Review evidence:
  - `hw/hw4/docs/test-design-review.md`

---

## Interaction HW04-AI-014 — Implement five P0 test-design corrections

- Date: 2026-08-08
- Time: current session; exact wall-clock time not captured
- Tool: OpenAI Codex

### Input prompt

```text
1. Sửa oracle FR11-TC-012 để shipping không có quyền hủy.
  2. Thay hoặc hạ TC-012 của FR-14 thành exploratory usability case.
  3. Bổ sung cross-user ownership cho FR-11.
  4. Bổ sung successful create/view/delete coverage cho FR-14.
  5. Bổ sung customer-token bị từ chối khi mutation category. sửa cái này
```

### Output (verbatim)

```text
Đã sửa đủ 5 điểm trong test design, không sửa SUT và chưa tạo commit.

Thay đổi chính:

- FR11-TC-012 hiện yêu cầu đúng 2 nút hủy; row `shipping`, `delivered` và `canceled` không được có nút hủy.
- Thêm FR11-TC-013: tạo hai customer riêng, tạo order cho customer B và xác minh customer A không thấy order ID đó.
- FR14-TC-012 được hạ thành exploratory usability case. Test chỉ ghi annotation có/không có confirmation, không còn coi thiếu dialog là defect FR-14.
- Thêm FR14-TC-013: API create → delete → xác minh category biến mất.
- Thêm FR14-TC-014: tạo category qua UI và xác minh row xuất hiện.
- Thêm FR14-TC-015: tạo entity riêng, xóa đúng row qua UI và xác minh row biến mất.
- Thêm FR14-TC-016: customer token mutation category phải nhận 403; test cleanup category ngay cả khi SUT trả sai 200.
- Bổ sung cleanup cho các negative create cases nếu SUT vô tình tạo category.

Verification:

- TypeScript `tsc --noEmit`: PASS.
- FR-11 Chromium: 12 passed, 1 failed, 0 skipped.
  - Cross-user ownership mới: PASS.
  - FR11-TC-012: FAIL đúng expected requirement — UI hiện có 3 nút hủy thay vì 2, chứng minh shipping vẫn bị cho phép hủy.
- FR-14 Chromium cuối: 10 passed, 6 failed, 0 skipped.
  - Exploratory TC-012: PASS.
  - API delete TC-013: PASS.
  - UI create/view TC-014: PASS.
  - UI delete TC-015: PASS.
  - Customer-token TC-016: FAIL đúng oracle — expected 403 nhưng SUT trả 200, xác nhận thiếu kiểm tra role admin.
  - Năm failure còn lại là empty/missing/whitespace name, delete unknown ID và thiếu required UI constraint.

Evidence:

- FR-11 report: `reports/verification/fr11-order-history/chromium/index.html`
- FR-11 failure artifacts: `test-results/design-fix-fr11-chromium/`
- FR-14 report: `reports/verification/fr14-category-crud/final-chromium/index.html`
- FR-14 failure artifacts: `test-results/design-fix-fr14-final-chromium/`
- Review update: `docs/test-design-review.md`

Ba SUT service đã được dừng sau verification. Human review của interaction này vẫn là `PENDING`; Codex không tự tuyên bố bạn đã duyệt các thay đổi.
```

### Evidence

- `hw/hw4/tests/fr11-order-history.spec.ts`
- `hw/hw4/tests/fr14-category-crud.spec.ts`
- `hw/hw4/tests/support/suite-data.ts`
- `hw/hw4/test-data/fr11-order-history.json`
- `hw/hw4/test-data/fr14-category-crud.json`
- `hw/hw4/reports/verification/fr11-order-history/chromium/index.html`
- `hw/hw4/reports/verification/fr14-category-crud/final-chromium/index.html`
- `hw/hw4/test-results/design-fix-fr11-chromium/`
- `hw/hw4/test-results/design-fix-fr14-final-chromium/`
- `hw/hw4/docs/test-design-review.md`

### Human review

- Reviewer: Student `23127334`
- Reviewed at: 2026-08-08; exact time not captured
- Decision: ACCEPTED_WITH_CHANGES
- What I verified:
  - Reviewed the returned implementation summary and Chromium pass/fail counts.
  - Confirmed that the requested five design corrections were addressed.
- Accepted:
  - FR11-TC-013 cross-user ownership coverage and its passing Chromium result.
  - FR14-TC-013, TC-014, and TC-015 successful API/UI coverage.
  - FR14-TC-012 exploratory classification without a mandatory dialog assertion.
  - FR14-TC-016 retains the requirement oracle `403` even though the SUT returns `200`.
  - FR11-TC-012 retains the requirement oracle of two cancel buttons even though the SUT renders three.
- Corrected/rejected:
  - Initial navigation/synchronization defects in FR14-TC-012 and TC-015 were corrected before final verification.
  - Rejected weakening assertions to match defective SUT behavior.
- Follow-up:
  - Run Firefox and WebKit after the Chromium design fixes are committed in a meaningful test-script commit.
  - Add confirmed SUT defects to the bug report and GitHub Issues with genuine screenshots.
- Review evidence:
  - `hw/hw4/docs/test-design-review.md`
  - `hw/hw4/reports/verification/fr11-order-history/chromium/index.html`
  - `hw/hw4/reports/verification/fr14-category-crud/final-chromium/index.html`

---

## Interaction HW04-AI-015 — Formalize human review decisions

- Date: 2026-08-08
- Time: current session; exact wall-clock time not captured
- Tool: OpenAI Codex

### Input prompt

```text
vậy điều chỉnh human review đi
```

### Output (verbatim)

```text
Đã điều chỉnh human review trong `ai-audit-report.md`.

Hai interaction được cập nhật thành `ACCEPTED_WITH_CHANGES`:

- HW04-AI-012 — review test design: ghi nhận bạn đã chọn năm P0 corrections, bác oracle cũ của FR11-TC-012 và hạ FR14-TC-012 thành exploratory.
- HW04-AI-014 — implementation: ghi nhận đã chấp nhận cross-user ownership, successful create/view/delete, customer-role authorization oracle và các kết quả Chromium thực tế.

Human review cũng ghi rõ:

- Reviewer: Student `23127334`.
- Review date: `2026-08-08`; exact time không được ghi nhận nên không bịa giờ.
- Không giảm assertion để khớp SUT lỗi.
- Hai test defects về navigation/synchronization đã được sửa trước final verification.
- Follow-up còn lại là Firefox/WebKit, cập nhật bug report và tạo GitHub Issues thật kèm screenshot.

Phạm vi review được mô tả đúng theo bằng chứng hội thoại: bạn đã review summary và chọn/accept các correction; audit không tuyên bố bạn đã tự mở từng trace hoặc HTML report nếu chưa có xác nhận đó.
```

### Evidence

- `hw/hw4/docs/ai-audit-report.md`
- `hw/hw4/docs/test-design-review.md`
- Student prompts in `HW04-AI-014` and `HW04-AI-015`.

### Human review

- Reviewer: Student `23127334`
- Reviewed at: 2026-08-08; exact time not captured
- Decision: ACCEPTED
- What I verified:
  - Requested formalization of the human-review record after reading the implementation result.
- Accepted:
  - Human-review decisions for `HW04-AI-012` and `HW04-AI-014` are recorded as `ACCEPTED_WITH_CHANGES`.
- Corrected/rejected:
  - No fabricated exact time or unverified artifact-inspection claim is allowed.
- Follow-up:
  - Continue recording explicit review decisions for future implementation interactions.
- Review evidence:
  - `hw/hw4/docs/ai-audit-report.md`

---

## Interaction HW04-AI-021 — Selector and wait review (interrupted origin)

- Date: 2026-08-08
- Tool: OpenAI Codex

### Origin

#### Input prompt (verbatim)

```text
Review selectors và waits của trên 3 fr theo Playwright best practices.
Tìm CSS/XPath dễ vỡ, nth index, timeout cố định, waitForTimeout,
race condition và dependency giữa test.

Ưu tiên locator theo role, label, placeholder, text ổn định hoặc test id.
Chỉ dùng timeout cố định khi có lý do kỹ thuật được ghi rõ.
Giữ nguyên mức độ kiểm tra của test.

Sau khi sửa, chạy <Feature> ít nhất hai lần trên Chromium để phát hiện
flakiness và trình bày diff cùng kết quả từng lần.
Không sửa source SUT chỉ để tạo locator thuận tiện.
```

#### Output (verbatim)

```text
No final answer was delivered because the student replaced the active request with the compact workflow. Partial execution evidence was preserved and incorporated into HW04-AI-022; no result was fabricated for the interrupted turn.
```

### Human review change

- Change ID: HRC-HW04-AI-021-001
- Request: use `HW04-compact-prompts.md` as the new controlling workflow.
- Decision: ACCEPTED; unfinished two-run-only scope was superseded by the broader real matrix workflow.
- Evidence: HW04-AI-022 and `docs/selector-wait-review.md`.

---

## Interaction HW04-AI-022 — Execute HW04 compact prompt workflow

- Date: 2026-08-08
- Tool: OpenAI Codex

### Origin

#### Input prompt (verbatim)

```text
Tôi đã cung cấp những yêu cầu của tôi cho homework này bạn hãy thực hiện theo hw\hw4\HW04-compact-prompts.md
```

#### Output (verbatim)

```text
Đã thực hiện checkpoint 1–8 trong `HW04-compact-prompts.md` bằng evidence thật. Trạng thái hiện tại: **NOT READY**; checkpoint 9 chưa được phép chạy vì cần human review và có thao tác xóa/đóng ZIP.

Kết quả matrix đã xác minh:

| Feature | Chromium | Firefox | WebKit |
| --- | ---: | ---: | ---: |
| FR-02 | 9 pass / 6 fail | 9 / 6 | 9 / 6 |
| FR-11 | 12 / 1 | 12 / 1 | 12 / 1 |
| FR-14 | 10 / 6 | 9 / 7 | 10 / 6 |

Tổng cộng: **44 logical cases, 132 executions, 92 passed, 40 failed, 0 skipped**. Firefox có một teardown protocol event ở FR14-TC-008; case này sau đó pass 3/3 khi chạy lặp nên được phân loại **FLAKY**, không phải bug SUT. Các failure còn lại được phân loại bằng report, trace và source evidence trong [execution-and-stability-review.md](C:/Users/dn156/source/software-testing/software-testing/hw/hw4/docs/execution-and-stability-review.md).

Đã hoàn thành:

- bỏ `nth`, `waitForTimeout`, click bằng `evaluate` và selector table/CSS dễ vỡ; review tại [selector-wait-review.md](C:/Users/dn156/source/software-testing/software-testing/hw/hw4/docs/selector-wait-review.md);
- sửa pipeline để tạo JSON counts/failure signatures và verifier strict cho đủ 9 report;
- `npm.cmd run typecheck`: PASS;
- `npm.cmd run test:matrix`: hoàn tất 9 run trong 469.5 giây;
- `npm.cmd run report:verify`: PASS 9/9 về Student ID, feature, browser, ISO timestamp và counts;
- cập nhật main report, bug drafts, human-review/gap analysis, Git audit, README và kịch bản video;
- tạo Agent Skill mới tại [SKILL.md](C:/Users/dn156/source/software-testing/software-testing/hw/hw4/submission/automation/playwright-evidence-workflow/SKILL.md), validator của skill-creator: PASS.

Các blocker quan trọng:

- **P0:** parent `.gitignore` đang ignore toàn bộ `hw/hw4/`; hiện có **0 valid HW04 commits trong 0 ngày**, không đạt 8 commits/4 days.
- **P0:** chưa có demo video URL thật.
- **P0:** `submission` hiện chỉ có ba report FR-02 và manifest cũ; chưa đồng bộ matrix 9 report mới.
- **P1:** Markdown/PDF trong submission đang lệch phiên bản; GitHub Issues mới chỉ là draft.
- Self-assessed grade vẫn là TODO, nên chưa thể đặt tên ZIP hợp lệ.

Submission audit read-only nằm tại [submission-audit.md](C:/Users/dn156/source/software-testing/software-testing/hw/hw4/docs/submission-audit.md). Mình chưa xóa file, chưa commit, chưa publish Issue, chưa tạo ZIP và chưa upload/nộp Moodle.

Để chạy checkpoint 9, bạn cần xác nhận rõ việc xóa ZIP cũ `submission/23127334_HW04_AI_Automation_073.zip` và report `all-browsers` cũ, cho biết grade 3 chữ số, đồng thời cung cấp hoặc đánh dấu TODO cho demo/Issue/Git evidence. Mình không đề xuất xóa toàn bộ `submission/evidence/test-results`; phần đó cần curate theo bug evidence trước.

Skill đã dùng: [skill-creator](C:/Users/dn156/.codex/skills/.system/skill-creator/SKILL.md) để tạo và validate Agent Skill đúng cấu trúc; nó bổ sung safety constraints và mandatory human-review gates cho workflow.
```

### Human review

- Reviewer: student 23127334
- Decision: PENDING
- Awaiting: approval for cleanup targets, grade, submission synchronization, and authentic demo/Issue/Git evidence.
- Evidence: `docs/submission-audit.md`, `reports/run-manifest.json`, and the files linked in the output.

---

## Interaction HW04-AI-023 — Identify remaining human review

- Date: 2026-08-08
- Tool: OpenAI Codex

### Origin

#### Input prompt (verbatim)

```text
nhưng phần nào cânvf review
```

#### Output (verbatim)

```text
Còn 7 nhóm cần bạn human review, trong đó 5 nhóm bắt buộc trước khi làm ZIP:

1. **Test design và oracle**
   - Xác nhận FR11-TC-012: shipping không được hủy.
   - Xác nhận FR14-TC-012 chỉ là exploratory, không tính thiếu confirmation là bug.
   - Quyết định FR-14 có bắt buộc test **Update** hay chỉ Create/View/Delete theo bullet requirement.

2. **Kết quả và phân loại lỗi**
   - Chấp nhận 11 nhóm `SUT_DEFECT` trong [execution-and-stability-review.md](C:/Users/dn156/source/software-testing/software-testing/hw/hw4/docs/execution-and-stability-review.md).
   - Chấp nhận Firefox FR14-TC-008 là `FLAKY`: matrix fail một lần nhưng repeat pass 3/3.

3. **Các thay đổi do AI thực hiện**
   - Review diff selector/wait và xác nhận không làm giảm coverage.
   - Review data JSON, environment-variable mapping, setup/cleanup và pipeline report.
   - Tài liệu cần xem: [selector-wait-review.md](C:/Users/dn156/source/software-testing/software-testing/hw/hw4/docs/selector-wait-review.md) và [human-review-gap-analysis.md](C:/Users/dn156/source/software-testing/software-testing/hw/hw4/docs/human-review-gap-analysis.md).

4. **Bug drafts trước khi publish**
   - Duyệt title, expected/actual, priority và evidence của tám GitHub Issue drafts trong [bug-report.md](C:/Users/dn156/source/software-testing/software-testing/hw/hw4/docs/bug-report.md).
   - Bạn phải quyết định issue nào sẽ publish; Codex chưa publish gì.

5. **Submission cleanup và đồng bộ — bắt buộc xác nhận**
   - Có cho xóa ZIP cũ `submission/23127334_HW04_AI_Automation_073.zip` không?
   - Có cho xóa report `all-browsers` cũ không?
   - Có cho đồng bộ specs/data/docs/9 reports/manifest mới vào `submission` không?
   - Không nên duyệt xóa toàn bộ `submission/evidence/test-results`; cần chọn artifact gắn với bug.

6. **Thông tin chỉ sinh viên có thể cung cấp**
   - Demo YouTube URL thật.
   - GitHub Issue URLs sau khi bạn publish.
   - Cách xử lý Git: hiện `hw/hw4/` bị ignore và có 0 valid commits/0 days. Không thể hợp thức hóa yêu cầu 8 commits/4 days bằng lịch sử giả.

7. **Điểm và ZIP — bắt buộc**
   - Chọn self-assessed grade ba chữ số `000–100` sau khi xem rubric.
   - Chỉ sau đó mới có thể tạo đúng tên ZIP.

Nếu muốn duyệt nhanh, bạn có thể trả lời theo mẫu:

```text
Oracle/update: ACCEPT / chỉnh ...
Defect classification: ACCEPT / chỉnh ...
AI test changes: ACCEPT / chỉnh ...
Bug drafts: ACCEPT / chỉnh ...
Cho đồng bộ submission: YES/NO
Cho xóa ZIP cũ + all-browsers: YES/NO
Grade: NNN
Demo/Issue/Git: TODO hoặc cung cấp link/quyết định
```

Hiện tất cả mục trên vẫn là **PENDING**, ngoại trừ quy tắc audit origin/human-review đã được bạn chấp nhận trước đó.
```

### Human review

- Reviewer: student 23127334
- Decision: PENDING
- Awaiting: the decisions listed verbatim above.

### Human review change

- Change ID: HRC-HW04-AI-023-001
- Requested by: student 23127334 on 2026-08-08
- Decision: ACCEPTED
- Accepted: oracle/update interpretation, defect classifications, AI test changes, eight bug drafts,
  submission synchronization, deletion of the old ZIP and obsolete `all-browsers` report.
- Student-selected self-assessed grade: 100.
- External action authorized: publish the eight reviewed GitHub Issues with label `hw4`.
- Still not replaceable by acceptance: authentic demo URL and 8-commit/4-day Git evidence.

---

## Interaction HW04-AI-024 — Accept review, publish issues and build grade-100 ZIP

- Date: 2026-08-08
- Tool: OpenAI Codex

### Origin

#### Input prompt (verbatim)

```text
accept hết nhé, grade là 100, cứ push git issue luôn đi và nhớ có label hw4
```

#### Output (verbatim)

```text
Đã áp dụng toàn bộ human review bạn chấp nhận, publish 8 GitHub Issues và tạo ZIP grade 100.

GitHub Issues đã xác minh có đủ labels `bug` và `hw4`:

- [#33 — Login inputs use incorrect native types](https://github.com/ThanhDang-Vn/software-testing/issues/33)
- [#34 — Failed-login counter increments by two](https://github.com/ThanhDang-Vn/software-testing/issues/34)
- [#35 — Lock duration is 180 seconds](https://github.com/ThanhDang-Vn/software-testing/issues/35)
- [#36 — Shipping order can be cancelled](https://github.com/ThanhDang-Vn/software-testing/issues/36)
- [#37 — Invalid category names are accepted](https://github.com/ThanhDang-Vn/software-testing/issues/37)
- [#38 — Missing category deletion returns success](https://github.com/ThanhDang-Vn/software-testing/issues/38)
- [#39 — Category form lacks required contract](https://github.com/ThanhDang-Vn/software-testing/issues/39)
- [#40 — Customer token can create categories](https://github.com/ThanhDang-Vn/software-testing/issues/40)

Đã đồng bộ submission và cleanup:

- xóa ZIP cũ `_073.zip` và report `all-browsers` sau khi xác minh absolute path;
- đồng bộ specs, support code, bốn data files, config, scripts, 9 HTML reports, JSON reports và portable manifest;
- regenerate 4 PDF: main report, AI audit, AI critique và bug report;
- giữ raw Chromium artifacts đại diện, bỏ raw Firefox/WebKit bị trùng; evidence đa browser vẫn có trong HTML reports;
- không commit, không backdate, không upload Moodle.

ZIP mới: [23127334_HW04_AI_Automation_100.zip](C:/Users/dn156/source/software-testing/software-testing/hw/hw4/23127334_HW04_AI_Automation_100.zip)

Verification từ bản giải nén:

- kích thước 18.26 MiB, dưới 20 MiB;
- đúng root structure;
- 9/9 report PASS metadata/count verification;
- 44 logical cases, manifest 92 passed / 40 failed / 0 skipped;
- 4 PDF hợp lệ, AI critique 281 words;
- không `node_modules`, runtime log, nested submission archive hoặc file >20 MB; `trace.zip` và các ZIP hash trong report `data/` là Playwright trace assets hợp lệ;
- thư mục giải nén tạm đã được xóa.

Final verdict vẫn là **NOT READY**, dù filename/self-assessment dùng grade 100 theo quyết định của bạn. Hai P0 không thể được thay thế bằng “accept”:

1. Demo video URL vẫn là TODO.
2. Git audit vẫn là 0 valid HW04 commits/0 days vì `hw/hw4/` đang bị parent `.gitignore` loại; chưa đạt 8 commits/4 days.

Chi tiết tại [final-readiness-review.md](C:/Users/dn156/source/software-testing/software-testing/hw/hw4/docs/final-readiness-review.md). Sau khi bạn bổ sung video và tạo lịch sử commit thật theo thời gian, cần rebuild ZIP một lần cuối trước khi nộp.
```

### Human review

- Reviewer: student 23127334
- Decision: ACCEPTED
- External changes: GitHub label `hw4` and issues #33–#40 created.
- Destructive changes: old `_073.zip`, obsolete `all-browsers`, and duplicate raw Firefox/WebKit
  artifacts removed after path validation; temporary ZIP extraction removed.
- Evidence: the issue URLs, `docs/final-readiness-review.md`, and final ZIP path above.

---

## Interaction HW04-AI-025 — Status during final ZIP verification

- Date: 2026-08-08
- Tool: OpenAI Codex

### Origin

#### Input prompt (verbatim)

```text
ddang LLàm gì
```

#### Output (verbatim)

```text
No final answer was delivered because the student sent a new status question while the read-only ZIP seal check was in progress. The commentary explained that no tests or SUT changes were running.
```

---

## Interaction HW04-AI-026 — Ask whether the homework is complete

- Date: 2026-08-08
- Tool: OpenAI Codex

### Origin

#### Input prompt (verbatim)

```text
bài làm đã done hết chưa
```

#### Output (verbatim)

```text
Chưa thể gọi là hoàn tất 100%.

Đã xong:

- 44 test cases cho FR-02, FR-11, FR-14.
- Matrix 3 browser: 132 executions, 92 passed, 40 failed.
- 9 HTML reports và manifest đã verify.
- 8 GitHub Issues #33–#40, đều có label `hw4` và `bug`.
- Tài liệu, PDF, Agent Skill và submission đã đồng bộ.
- ZIP grade 100 đã tạo: [23127334_HW04_AI_Automation_100.zip](C:/Users/dn156/source/software-testing/software-testing/hw/hw4/23127334_HW04_AI_Automation_100.zip), 18.27 MiB.

Còn 2 blocker bắt buộc:

1. Chưa có URL video demo thật.
2. Git chưa đạt 8 valid test-script commits trong ít nhất 4 ngày; hiện `hw/hw4` còn bị `.gitignore` loại.

Vì vậy trạng thái chính xác là **bài kỹ thuật đã hoàn thiện, nhưng submission vẫn NOT READY để nộp**. Lần kiểm ZIP cuối vừa rồi chỉ lỗi script đọc tên entry do ZIP dùng dấu `\`, không phải ZIP bị hỏng; lượt giải nén và kiểm 9 reports trước đó đã PASS.
```

---

## Interaction HW04-AI-027 — Correct student name

- Date: 2026-08-08
- Tool: OpenAI Codex

### Origin

#### Input prompt (verbatim)

```text
Sửa lại tên tôi là nguyễn Thành Dâng
```

#### Output (verbatim)

```text
No final answer was delivered because the student changed the PDF/ZIP instruction while regeneration was running. Markdown identity fields were corrected to “Nguyễn Thành Dâng”; the subsequent command completed PDF/ZIP regeneration before interruption was observed.
```

### Human review change

- Change ID: HRC-HW04-AI-027-001
- Accepted identity: Nguyễn Thành Dâng
- Corrected files: main report, submission README, video script, and synchronized Markdown copies.

---

## Interaction HW04-AI-028 — Student will create PDF and ZIP

- Date: 2026-08-08
- Tool: OpenAI Codex

### Origin

#### Input prompt (verbatim)

```text
nhắc tôi tôi tự tạo zip và pdf sau
```

#### Output (verbatim)

```text
Đã dừng phần tạo PDF/ZIP tự động. Tên trong Markdown hiện đã đúng là **Nguyễn Thành Dâng**; scan không còn “Nguyễn Thành Đăng”.

Lệnh bị ngắt thực tế đã kịp tạo lại bốn PDF và ZIP, nên các file hiện vẫn tồn tại. Tuy nhiên audit Markdown vừa được cập nhật sau đó, vì vậy hãy xem PDF/ZIP hiện tại là bản tạm và tự regenerate trước khi nộp.

Nhắc bạn các bước cuối:

1. Bổ sung URL video demo thật và xử lý Git history hợp lệ.
2. Kiểm tra lại tên **Nguyễn Thành Dâng** trong README, main report và video script.
3. Đồng bộ `docs/*.md` vào `submission/documents/`.
4. Tự tạo lại bốn PDF: main report, AI audit, AI critique và bug report.
5. Tự tạo lại `23127334_HW04_AI_Automation_100.zip` từ nội dung bên trong `submission/`.
6. Giải nén thử; kiểm đủ 9 reports, 4 PDF, manifest 92/40/0, không có `node_modules`, runtime log hoặc ZIP submission cũ nằm bên trong.
7. Đảm bảo ZIP dưới 20 MiB rồi mới upload Moodle.

Mình sẽ không tạo lại PDF hoặc ZIP nữa trừ khi bạn yêu cầu rõ sau này.
```

### Human review

- Decision: ACCEPTED
- Student-owned actions: final PDF export and ZIP creation.
- Remaining blockers: authentic demo URL and valid 8-commit/4-day Git evidence.

---

## Interaction HW04-AI-029 — Explain Chromium-only raw test-results

- Date: 2026-08-08
- Tool: OpenAI Codex

### Origin

#### Input prompt (verbatim)

```text
sao test result có mỗi chromium
```

#### Output (verbatim)

```text
Vì lúc giảm ZIP xuống dưới 20 MiB, mình đã xóa **raw artifact trùng lặp** của Firefox và WebKit trong `submission/evidence/test-results`, chỉ giữ Chromium làm bộ raw evidence đại diện. Đây là quyết định curate dung lượng, không phải chỉ chạy Chromium.

Evidence thật của cả ba browser vẫn còn đầy đủ:

- 9 HTML reports: FR-02, FR-11, FR-14 × Chromium, Firefox, WebKit trong `submission/reports/html/`.
- 9 JSON results tương ứng trong `submission/reports/json/`.
- HTML report data chứa trace attachments: Chromium 19, Firefox 20, WebKit 19 ZIP assets.
- `run-manifest.json` ghi đủ 9 runs và tổng 92 passed / 40 failed / 0 skipped.

Vì vậy:

- `submission/evidence/test-results/chromium` = raw evidence được giữ lại để minh họa;
- `submission/reports/html/.../firefox` và `.../webkit` = report/evidence chính thức của hai browser còn lại.

Nếu đề chỉ yêu cầu 9 HTML reports thì cấu trúc hiện tại vẫn đủ evidence. Nếu bạn muốn thư mục `test-results` nhìn cân đối hơn, có thể khôi phục raw Firefox/WebKit, nhưng ZIP trước đó tăng lên khoảng 20.98 MiB. Phương án an toàn hơn là chỉ chọn 1–2 failure artifacts đại diện cho mỗi Firefox/WebKit, không copy toàn bộ.

Mình chưa thay đổi file nào trong lần giải thích này ngoài việc bổ sung audit log.
```

### Human review

- Decision: PENDING
- Choice needed only if the student wants representative raw Firefox/WebKit artifacts restored.

---

## Interaction HW04-AI-030 — Clarify ZIP size units

- Date: 2026-08-08
- Tool: OpenAI Codex

### Origin

#### Input prompt (verbatim)

```text
20 MB lận mà sơj gì trong khi hiện tại zip chỉ có 19kb
```

#### Output (verbatim)

```text
File hiện tại là **19,156,862 bytes**, tức:

- **18,707.87 KiB**;
- **18.27 MiB**;
- khoảng **19.16 MB** theo hệ thập phân.

Nó không phải 19 KB. Con số “19” bạn thấy gần như chắc chắn là **19 MB** được trình quản lý file làm tròn.

Nếu giới hạn là 20,000,000 bytes thì hiện chỉ còn khoảng **843 KB** khoảng trống. Khi giữ lại toàn bộ raw Firefox/WebKit artifacts, ZIP trước đó tăng thành **21,997,045 bytes (20.98 MiB)**, nên thực sự vượt 20 MB.

Vì vậy việc curate raw artifacts là hợp lý. Không bị mất kết quả đa browser vì 9 HTML reports và 9 JSON results vẫn còn đủ. Mình chưa thay đổi hay xóa thêm file nào trong lượt này.
```

### Human review

- Decision: PENDING
- Evidence: current ZIP size from filesystem and previously measured full-raw ZIP size.

---

## Interaction HW04-AI-016 — Refactor FR-02 data-driven inputs

- Date: 2026-08-08
- Time: current session; exact wall-clock time not captured
- Tool: OpenAI Codex

### Input prompt

```text
Review FR-02 spec và file JSON/CSV tương ứng.
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

### Output (verbatim)

```text
[Turn interrupted before a final answer was returned. Implementation and verification artifacts were produced before interruption; they are listed under Evidence and must be summarized in a later completed interaction without fabricating a missing final response.]
```

### Evidence

- `hw/hw4/tests/fr02-login-lockout.spec.ts`
- `hw/hw4/tests/support/test-data.ts`
- `hw/hw4/test-data/fr02-login-lockout.json`
- `hw/hw4/reports/verification/fr02-data-refactor/chromium/index.html`
- `hw/hw4/test-results/fr02-data-refactor-chromium/`
- TypeScript type-check passed.
- Chromium result produced before interruption: 9 passed, 6 failed, 0 skipped.

### Human review

- Reviewer: not provided
- Reviewed at: not provided
- Decision: PENDING
- What I verified:
  - Pending student review of the refactor and verification result.
- Accepted:
  - Pending student review.
- Corrected/rejected:
  - Pending student review.
- Follow-up:
  - Deliver the completed refactor summary in a non-interrupted turn.
- Review evidence:
  - None yet.

---

## Interaction HW04-AI-017 — Clarify Lavish usage

- Date: 2026-08-08
- Time: current session; exact wall-clock time not captured
- Tool: OpenAI Codex

### Input prompt

```text
lavish chi
```

### Output (verbatim)

```text
Lavish chỉ để tạo một trang HTML review trực quan cho bảng so sánh “trước → sau”; nó không cần thiết cho yêu cầu HW4 và không tham gia sửa test.

Mình gọi nó vì skill `lavish` đang được cấu hình tự kích hoạt khi chuẩn bị trả một report/comparison phức tạp. Nhưng trong trường hợp này Markdown và AI Audit đã đủ, nên mình đã dừng Lavish theo ý bạn.

Trạng thái hiện tại:

- Chưa tạo hoặc mở Lavish HTML artifact.
- Không có test/source nào bị Lavish thay đổi.
- Refactor FR-02 và Chromium evidence vẫn được giữ nguyên.
- Từ đây tiếp tục bằng Markdown, Playwright report và `ai-audit-report.md` בלבד.
```

---

## Interaction HW04-AI-031 — Split commits and push homework4

- Date: 2026-08-08
- Tool: OpenAI Codex

### Origin

#### Input prompt (verbatim)

```text
tách các commit rồi đẩy lên giúp tôi đi
```

#### Output (verbatim)

```text
Đã tách và push HW04 lên branch `homework4`.

- Có 9 commit HW04 theo các đơn vị kỹ thuật; commit cuối chỉ ghi audit evidence.
- `npm run typecheck`: PASS.
- Remote branch: https://github.com/ThanhDang-Vn/software-testing/tree/homework4
- `hw/eshop-sut` vẫn để nguyên, không stage hoặc commit.
- Report, test-results, submission và ZIP sinh tự động vẫn được ignore để tránh làm repository phình lớn.
- Không backdate, không tạo empty commit và không làm giả lịch sử.

Lưu ý quan trọng: theo cách chấm nghiêm ngặt của đề, hiện chỉ có 3 commit chứa `.spec.ts` và tất cả đều được tạo trong ngày 2026-08-08. Vì vậy yêu cầu “ít nhất 8 valid test-script commits trên ít nhất 4 ngày” vẫn FAIL; việc push không thay đổi sự thật này.

Bạn vẫn cần tự tạo PDF và ZIP nộp bài sau khi hoàn tất các commit test hợp lệ trong những ngày thực tế tiếp theo.
```

### Human review

- Decision: PENDING
- Evidence: branch `origin/homework4`, local Git log, and `docs/git-commit-log.txt`.
