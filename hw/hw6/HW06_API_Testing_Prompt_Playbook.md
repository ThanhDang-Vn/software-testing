# HW06 — API Testing Prompt Playbook (kịch bản drive AI từng bước)

> Cách dùng: copy từng khối prompt theo đúng thứ tự và gửi vào chat/Codex để chỉ làm **một phần**.
> Không gửi toàn bộ playbook trong một prompt. Mục tiêu là chứng minh quá trình AI-First có kiểm soát,
> không dùng một prompt chung kiểu “generate all tests and run them”.
>
> Mỗi prompt phải được ghi nguyên văn cùng output vào `hw6/ai-audit-log.md`.
> AI chỉ đề xuất kết quả audit; sinh viên phải tự đọc, quyết định và xác nhận nhãn
> `VALID / INVALID / INCOMPLETE` cho từng test case.

---

## Bối cảnh cố định đã xác minh

- StudentID: `23127334` — Nguyễn Thành Dâng.
- Repository bài làm: `github.com/ThanhDang-Vn/software-testing`.
- SUT: EShop backend — `github.com/ttbhanh/eshop-sut`.
- Base URL: `http://localhost:3000`.
- Backend: Node.js + Express + SQLite (`backend/database.sqlite`).
- Công cụ: Postman, Newman, Node.js, GitHub Actions.
- Ngày bắt đầu: `20260817`.
- AI tool/model: **điền đúng tên công cụ và model thực tế đang dùng**, không tự đoán.
- Thư mục đầu ra: `hw6/`.
- Collection: `23127334_HW06_API_Testing`.
- Environment: `23127334_Local`.
- Header bắt buộc trên mọi request: `X-Student-Id: 23127334`.
- Mục tiêu: tối thiểu `35 AI-generated + 5 human-added` test case cho mỗi API.
- Mục tiêu an toàn: AI tạo `40` test/API, sau đó sinh viên bổ sung đúng hoặc hơn `5` test/API.

### Ba API đã chốt — ưu tiên dễ thực hiện

| API | Pool / Feature | Request |
|---|---|---|
| API 1 | Pool A — FR-01 Registration | `POST /api/register` |
| API 2 | Pool B — FR-09 Coupon | `POST /api/apply-coupon` |
| API 3 | Pool C — FR-15 Product Management | `POST /api/products` |

> Trước khi bắt đầu, sinh viên phải tự xác nhận bộ ba API không trùng với thành viên khác trong nhóm.

### API contract từ `api_specification.md`

| API | Body mẫu | Success response |
|---|---|---|
| Register | `{name,email,password}` | `200 {message:"User registered successfully", id}` |
| Apply coupon | `{code,total_amount,user_id}` | `200 {success,coupon_id,discount_amount,final_amount,message}` |
| Create product | `{name,price,description,imageUrl,category_id}` | `200 {message:"Product created", id}` |

### Dữ liệu seed quan trọng

- Admin: `admin@eshop.com / Admin123!`.
- User: `test@eshop.com / Test1234!`.
- Category IDs: `1`, `2`, `3`.
- Coupon: `SAVE10`, `BIGBUY`, `VIP100`, `EXPIRED`.

### Giả thuyết bug từ code inspection — phải chạy thật mới được kết luận

| API | Giả thuyết cần xác minh bằng Postman/Newman |
|---|---|
| Register | Không validate name/email/password; email không unique; lưu password plaintext — vi phạm SEC-01 |
| Coupon | Không yêu cầu JWT; dùng `>` thay vì `>=` tại minimum amount; công thức percent có dấu hiệu sai; tin `user_id` từ body |
| Product | `POST /api/products` không dùng middleware authentication/admin; không validate name, price hoặc category |

Không được đưa các giả thuyết trên thành bug report nếu chưa có request/response thực tế và bằng chứng tái hiện.

---

## Quy tắc áp dụng cho mọi prompt

Khi thực hiện từng prompt, AI phải:

1. Chỉ xử lý đúng phase được yêu cầu.
2. Không sửa source SUT để biến test thành pass, trừ commit CI-failure demonstration được yêu cầu riêng.
3. Không tự tạo screenshot, Newman output, GitHub link hoặc bằng chứng chạy giả.
4. Phân biệt rõ:
   - Expected result theo specification.
   - Actual result quan sát khi chạy.
   - Code-inspection hypothesis chưa được xác nhận.
5. Append vào `hw6/ai-audit-log.md`:
   - Tool/model thực tế.
   - Ngày giờ ISO-8601.
   - Prompt nguyên văn.
   - Output hoặc đường dẫn file output đầy đủ.
   - Human decision/correction nếu đã có.
6. Sau mỗi phase, đề xuất đúng một commit nhỏ, nhưng không gộp nhiều phase vào một commit.

---

# Phase 0 — Setup, contract confirmation và audit infrastructure

## P0.1 — Khởi tạo cấu trúc bài làm và AI audit

```text
Trong repository github.com/ThanhDang-Vn/software-testing, tạo cấu trúc hw6/ cho bài HW06 API Testing:
- README.md
- ai-audit-log.md
- api-contracts/
- testcases/
- postman/data/
- postman/environments/
- reports/newman/
- reports/cicd/
- reports/final/
- bugs/screenshots/
- evidence/postman/
- evidence/newman/
- evidence/cicd/
- agent-generator/

Tạo template AI audit có các trường: interaction ID, tool/model, timestamp, exact prompt,
full output hoặc file output, human review, correction, affected test IDs.
Không generate test case ở bước này. Đề xuất commit riêng cho setup.
```

## P0.2 — Khởi động SUT và smoke-test ba API

```text
Khởi động EShop backend tại http://localhost:3000 và smoke-test bằng curl đúng ba API đã chọn:
POST /api/register, POST /api/apply-coupon, POST /api/products.

Với mỗi API, in request headers/body, HTTP status và response body thực tế. Đối với product,
thử cả không token, user token và admin token để xác minh authorization thực tế. Đối với coupon,
thử total_amount bằng chính min_order_amount và lớn hơn min_order_amount.

Ghi kết quả vào hw6/api-contracts/p0-smoke-test.md. Tách rõ expected theo spec và actual.
Chưa kết luận bug nếu chỉ dựa trên source code; kết luận sơ bộ phải dựa trên response chạy thật.
```

## P0.3 — Chuẩn bị dữ liệu và reset strategy

```text
Thiết kế dữ liệu test có thể chạy lặp lại cho ba API. Tạo:
- hw6/postman/data/register-data.json
- hw6/postman/data/coupon-data.json
- hw6/postman/data/product-data.json
- hw6/postman/data/test-identities.md

Nêu cách tạo email unique cho registration, cách cố định user_id/category_id, cách reset SQLite,
và cách tránh test này làm bẩn state của test sau. Phân biệt setup, test action, verification và teardown.
Chưa viết đủ 35 test case ở bước này.
```

---

# Phase 1 — Phân tích specification từng kỹ thuật, chưa generate test case cuối

## P1.1 — Trích xuất API contract và traceability

```text
Đọc README.md, api_specification.md và backend/server.js của EShop cho đúng ba API đã chọn.
Tạo hw6/api-contracts/api-contract-matrix.md.

Với mỗi API ghi: feature/requirement, method/path, authentication, role, headers, request fields,
data types, required/optional, constraints, business rules, expected status codes, response schema,
side effects, SEC-01..SEC-07 liên quan, preconditions và supporting endpoints.

Nếu specification và implementation khác nhau, ghi SPEC EXPECTATION và IMPLEMENTATION OBSERVATION
riêng; không tự sửa expected result theo bug hiện tại. Chưa generate test case.
```

## P1.2 — Domain partition và boundary-value analysis

```text
Từ API contract đã duyệt, lập domain-partition/BVA matrix cho mọi parameter của ba API:
- Register: name, email, password và JSON/body/header variations.
- Coupon: code, total_amount, user_id và authentication context.
- Product: name, price, description, imageUrl, category_id và role context.

Với mỗi parameter ghi equivalence partitions, valid/invalid classes, boundary values,
representative values, expected behavior và nguồn requirement. Không invent limit khi spec không nêu;
đánh dấu SPEC GAP. Ghi vào hw6/testcases/p1-domain-partitions.md. Chưa tạo danh sách test cuối.
```

## P1.3 — State-transition analysis

```text
Phân tích state transition liên quan đến từng API, dù state đơn giản:
- Register: account absent → created → duplicate registration attempt.
- Coupon: eligible unused → applied → usage recorded → usage limit reached; active/expired states.
- Product: product absent → created → retrievable; user role guest/user/admin.

Liệt kê initial state, event/request, next state, valid/invalid transition, setup endpoint,
verification endpoint và teardown. Không vẽ diagram cuối của Agent Generator.
Ghi vào hw6/testcases/p1-state-transitions.md.
```

## P1.4 — Security và schema checklist

```text
Tạo security + schema checklist cho ba API dựa trên SEC-01..SEC-07 và behavior của endpoint.
Bao phủ JWT missing/malformed/expired, role escalation, mass assignment, IDOR/user_id tampering,
SQL injection, XSS payload persistence, sensitive-data leakage, unexpected fields và malformed JSON.

Với schema, định nghĩa exact required fields, field types, fields không được xuất hiện,
status/content-type và side-effect verification. Không gọi mọi validation failure là security bug.
Ghi vào hw6/testcases/p1-security-schema-checklist.md.
```

---

# Phase 2 — AI generate test case riêng cho từng API

## Quy ước test ID

- `REG-AI-001..040`: AI-generated registration tests.
- `CPN-AI-001..040`: AI-generated coupon tests.
- `PRD-AI-001..040`: AI-generated product tests.
- `REG-H-001..`: human-added registration tests.
- `CPN-H-001..`: human-added coupon tests.
- `PRD-H-001..`: human-added product tests.

Mỗi test case phải có:

```text
ID, origin, technique, requirement/SEC reference, title, priority,
preconditions, test data, request, execution steps, expected status,
expected headers/schema/body, expected side effect, cleanup, actual result,
PASS/FAIL, AI audit verdict, audit reasoning, bug ID, evidence link.
```

## P2.1 — Generate 40 test case cho Registration

```text
Dựa duy nhất trên các artifact đã duyệt ở Phase 1, generate đúng 40 AI test case cho
POST /api/register, ID REG-AI-001..040. Bao phủ mọi parameter bằng EP/BVA,
account lifecycle, duplicate registration, malformed request, security SEC-01/SEC-05,
mass assignment và exact response schema.

Không duplicate cùng một ý tưởng bằng cách chỉ đổi một chuỗi tương đương. Expected result phải theo spec,
không theo bug implementation. Ghi vào hw6/testcases/register-ai-generated.md và một CSV trung gian.
Chưa đánh nhãn audit và chưa gọi case nào là human-added.
```

## P2.2 — Generate 40 test case cho Apply Coupon

```text
Dựa duy nhất trên các artifact đã duyệt ở Phase 1, generate đúng 40 AI test case cho
POST /api/apply-coupon, ID CPN-AI-001..040. Dùng decision table cho 5 điều kiện FR-09,
BVA quanh min_order_amount, percent/fixed calculation, expired/disabled/not-found,
usage limit state, authentication, user_id tampering và exact response schema.

Phải có test tại total_amount = min_order_amount. Không duplicate vô nghĩa.
Ghi vào hw6/testcases/coupon-ai-generated.md và một CSV trung gian.
Chưa đánh nhãn audit và chưa gọi case nào là human-added.
```

## P2.3 — Generate 40 test case cho Create Product

```text
Dựa duy nhất trên các artifact đã duyệt ở Phase 1, generate đúng 40 AI test case cho
POST /api/products, ID PRD-AI-001..040. Bao phủ name max 255, price > 0,
category tồn tại, optional/unspecified fields, malformed body, guest/user/admin roles,
role escalation, injection/XSS persistence, response schema và database side effect.

Expected authorization phải dựa FR-12/SEC-02/SEC-03. Không duplicate vô nghĩa.
Ghi vào hw6/testcases/product-ai-generated.md và một CSV trung gian.
Chưa đánh nhãn audit và chưa gọi case nào là human-added.
```

## P2.4 — Hợp nhất thành Excel test case bản nháp

```text
Hợp nhất 120 AI-generated test case vào hw6/testcases/23127334_HW06_API_TestCases.xlsx.
Tạo sheet Register, Coupon, Product và Summary. Giữ đầy đủ các cột test case đã quy định.
Summary hiện chỉ đếm AI-generated, chưa có human-added và chưa có execution result.
Không tự audit hoặc sửa nội dung trong bước hợp nhất.
```

---

# Phase 3 — Human audit bắt buộc

> Ở phase này, AI được hỗ trợ tìm vấn đề nhưng **sinh viên là người ra quyết định cuối**.
> Không được tự động đánh dấu toàn bộ rồi xem như human review.

## P3.1 — Audit có xác nhận từng nhóm Registration

```text
Hỗ trợ tôi audit REG-AI-001..040 theo từng batch tối đa 10 case. Với mỗi case:
1. Trích requirement làm căn cứ.
2. Đề xuất VALID / INVALID / INCOMPLETE.
3. Giải thích cụ thể.
4. Đề xuất correction nếu cần.
5. DỪNG để tôi xác nhận hoặc sửa quyết định trước khi ghi vào Excel.

Sau khi tôi xác nhận đủ 40 case, cập nhật verdict, reasoning và corrected version vào workbook,
đồng thời ghi tổng kết vào hw6/testcases/register-human-audit.md.
```

## P3.2 — Audit có xác nhận từng nhóm Coupon

```text
Hỗ trợ tôi audit CPN-AI-001..040 theo batch tối đa 10 case, dùng quy trình giống P3.1.
Đặc biệt kiểm tra decision-table coverage, boundary >=, công thức percent/fixed,
usage-state precondition và việc AI có tự đoán status code hay không.
Dừng chờ tôi xác nhận từng batch trước khi cập nhật workbook.
Ghi tổng kết vào hw6/testcases/coupon-human-audit.md.
```

## P3.3 — Audit có xác nhận từng nhóm Product

```text
Hỗ trợ tôi audit PRD-AI-001..040 theo batch tối đa 10 case, dùng quy trình giống P3.1.
Đặc biệt kiểm tra name 255, price > 0, category tồn tại, admin authorization,
side-effect verification và test có bị trùng không.
Dừng chờ tôi xác nhận từng batch trước khi cập nhật workbook.
Ghi tổng kết vào hw6/testcases/product-human-audit.md.
```

## P3.4 — Audit coverage gate

```text
Sau khi tôi đã xác nhận audit 120 case, kiểm tra coverage traceability nhưng không tự thêm test:
- Every parameter có valid/invalid partitions.
- Relevant boundaries được phủ.
- State transitions được phủ.
- SEC-01..SEC-07 liên quan được trace.
- Exact schema assertions được phủ.
- Không còn duplicate rõ ràng.

Xuất gap list vào hw6/testcases/p3-audit-coverage-gaps.md để tôi dùng cho human-added tests.
```

---

# Phase 4 — Sinh viên tự bổ sung test AI bỏ sót

## P4.1 — Hướng dẫn chọn 5+ human cases/API

```text
Từ audit gaps và behavior thực tế, đưa ra danh sách candidate mà AI có thể đã bỏ sót cho mỗi API,
ưu tiên chained state, security và side effect. Không tự ghi chúng là human-added.

Đối với mỗi candidate, hỏi tôi chọn/loại/sửa. Sau khi tôi tự quyết định ít nhất 5 case/API,
ghi chúng thành REG-H-*, CPN-H-* và PRD-H-* trong Excel và các file Markdown.
Mỗi case phải có lời giải thích tại sao AI bỏ sót: prompt quality, model limitation,
spec fragmentation hoặc endpoint statefulness. Giữ lại lịch sử quyết định của tôi.
```

## P4.2 — Final test-design quality gate

```text
Kiểm tra bản test design cuối có ít nhất 35 AI-generated đã được audit và ít nhất 5 human-added/API.
Không tính setup request là test case chính. Không tính hai case trùng logic chỉ vì khác dữ liệu.
Cập nhật sheet Summary với generated, valid, invalid, incomplete, corrected và human-added counts.
Ghi kết quả gate vào hw6/testcases/p4-final-design-check.md.
```

---

# Phase 5 — Postman collection, data-driven và execution

## P5.1 — Thiết kế collection trước khi sinh JSON

```text
Thiết kế collection 23127334_HW06_API_Testing với folders:
00 Setup, API1 Register, API2 Coupon, API3 Product, 99 Verification-Teardown.
Mỗi API có subfolders Domain, State, Security, Schema.

Định nghĩa environment variables: baseUrl, studentId, user/admin credentials,
userToken, adminToken, userId, categoryId, createdProductId và createdEmail.
Thiết kế data-driven mapping từ các JSON files đến test IDs.
Giải thích request dependencies và cleanup. Chưa sinh collection JSON.
Ghi vào hw6/postman/collection-design.md.
```

## P5.2 — Header bắt buộc và Postman Console evidence

```text
Thêm collection-level pre-request script để upsert header X-Student-Id từ environment
và console.log giá trị thực tế trên mọi request. studentId phải là 23127334.
Thêm assertion xác nhận header đã được gắn trước khi gửi.

Hướng dẫn tôi mở Postman Console và chụp screenshot thật có request URL,
X-Student-Id và timestamp. AI không tạo hoặc chỉnh screenshot.
Ghi hướng dẫn vào hw6/evidence/postman/README.md.
```

## P5.3 — Sinh Postman collection và environment

```text
Từ test case cuối đã audit, sinh collection JSON và local environment JSON trong hw6/postman/.
Implement test scripts kiểm tra status, content-type, exact schema, business values và side effects.
Liên kết test name với TC_ID. Dùng data-driven files cho các partitions phù hợp.

Không hard-code JWT. Không để secret thật trong file public; tạo local ignored environment
và sanitized example environment. Validate collection JSON parse được.
```

## P5.4 — Chạy từng API trong Postman và cập nhật actual result

```text
Chạy riêng từng folder Register, Coupon và Product. Trước mỗi run reset/seed state theo strategy.
Ghi status/body thực tế, PASS/FAIL và evidence reference vào workbook.
Phân biệt test fail do SUT bug, test script bug, environment/setup failure và spec ambiguity.

Không sửa expected result chỉ để biến test thành pass. Lưu run summary vào
hw6/reports/newman/postman-run-summary.md.
```

## P5.5 — Newman + HTML report

```text
Export collection/environment đã kiểm tra và chạy Newman ở CLI với data files cần thiết.
Xuất CLI output và HTML report vào hw6/reports/newman/. Hostname trong output phải là
localhost/127.0.0.1 hoặc deployment thật.

Lưu command chính xác, Node/Newman version, timestamp, totals, assertions, passed, failed.
Hướng dẫn tôi chụp terminal output thật; không fabricate hoặc chỉnh output.
Sau run, cập nhật workbook actual result và Summary.
```

## P5.6 — Postman feature inventory

```text
Lập danh sách Postman features thực tế đã sử dụng: workspace, collection, folders,
collection/environment/local variables, pre-request script, test script, data-driven run,
Collection Runner, Newman và report. Chỉ ghi monitor/mock server nếu tôi thật sự đã tạo và chạy.
Ghi mục đích và bằng chứng của từng feature vào hw6/reports/postman-features.md.
```

---

# Phase 6 — Bug verification và GitHub Issues

## P6.1 — Phân loại failure và verify bug

```text
Đọc Postman/Newman failures và phân loại: SUT defect, test defect, environment defect,
specification gap hoặc expected behavior. Với candidate SUT defect, chạy lại request độc lập tối thiểu
hai lần sau khi reset state và lưu request/response thô.

Chỉ giữ bug tái hiện được. Đặc biệt xác minh các hypothesis về plaintext password,
missing authorization, >= boundary và percent calculation. Ghi vào hw6/bugs/verified-bugs.md.
```

## P6.2 — Soạn GitHub Issues

```text
Từ verified bugs, soạn từng GitHub Issue gồm title, environment, related FR/SEC,
preconditions, steps, request, expected, actual, severity, impact, TC_ID, evidence và commit/run link.
Tạo file hw6/bugs/github-issue-drafts.md. Không post issue thay tôi và không tạo screenshot giả.
Để placeholder rõ ràng cho screenshot thật mà tôi sẽ attach.
```

---

# Phase 7 — CI/CD với một run pass và một run fail

## P7.1 — Tạo GitHub Actions workflow

```text
Tạo .github/workflows/hw06-api-tests.yml để checkout, setup Node, cài/start EShop,
wait health/readiness, seed/reset database, cài Newman, chạy collection và upload reports/artifacts.
Mọi request vẫn phải có X-Student-Id 23127334. Secrets phải dùng GitHub Secrets hoặc generated runtime data.

Workflow phải fail khi assertion fail. Ghi giải thích pipeline vào hw6/reports/cicd/pipeline-configuration.md.
```

## P7.2 — Passing pipeline run

```text
Chuẩn bị commit mà toàn bộ expected-working CI suite đều pass, push và hướng dẫn tôi kiểm tra run.
Tôi sẽ tự lưu GitHub Actions run URL, commit SHA, screenshot summary và artifact link.
Không bịa link hoặc screenshot. Cập nhật placeholder vào hw6/reports/cicd/passing-run.md.
```

## P7.3 — Controlled one-failure pipeline run

```text
Tạo một commit demonstration riêng làm đúng một assertion có chủ đích bị fail,
không thay đổi dữ liệu thật và không phá các test khác. Gắn nhãn rõ CI DEMO FAILURE.
Sau khi tôi push và run thật, hướng dẫn tôi lưu URL/SHA/screenshot. Sau đó tạo commit restore assertion đúng.

Ghi cả ba commit (passing, one-failure, restore) và lý do vào hw6/reports/cicd/failing-run.md.
Không tự tạo GitHub run evidence.
```

## P7.4 — CI/CD short report

```text
Sau khi tôi cung cấp link và screenshot thật của hai run, viết hw6/reports/cicd/cicd-report.md:
trigger, jobs, setup, data strategy, Newman command, artifacts, pass/fail rule,
passing-run evidence, one-failure-run evidence và limitation.
Không dùng placeholder chưa điền trong bản final.
```

---

# Phase 8 — AI-driven API test generator / Agent Skill

## P8.1 — Đặc tả thiết kế để sinh viên tự vẽ diagram

```text
Giúp tôi xác định các component và data flow của AI-driven API test generator:
Spec Loader, Contract Extractor, Domain/BVA Generator, State Modeler, Security Mapper,
Schema Assertion Generator, Deduplicator, Traceability Checker, Human Review Gate,
Excel/Postman Exporter và Audit Logger.

Chỉ cung cấp component list, responsibilities, inputs/outputs và connection list.
KHÔNG tạo Mermaid, PlantUML, image hoặc diagram cuối. Tôi phải tự vẽ diagram theo anti-cheat constraint.
Ghi drawing brief vào hw6/agent-generator/drawing-brief.md.
```

## P8.2 — Pseudocode

```text
Viết pseudocode chi tiết cho API test generator từ input api_specification.md đến output test cases.
Phải có validation, spec-gap handling, multi-technique generation, deduplication,
coverage gate, human approval, export và AI audit. Ghi vào hw6/agent-generator/pseudocode.md.
Nêu rõ phần nào deterministic và phần nào gọi LLM.
```

## P8.3 — Agent Skill tùy chọn

```text
Dùng skill-creator để xây một reusable Agent Skill cho pipeline specification → audited API test cases
trong hw6/agent-generator/skill/. Skill không được tự phê duyệt human-review gate.
Demo bằng đúng một API và tạo hướng dẫn để tôi tự quay video, thuyết minh và upload YouTube.
Không tạo video hoặc giả link video.
```

---

# Phase 9 — Report, AI critique, audit và đóng gói

## P9.1 — Main report

```text
Viết hw6/reports/final/main-report.md theo ba full pipelines:
selection rationale, contract analysis, AI generation, human audit, human extension,
Postman implementation, execution results, bugs, Postman features, CI/CD và limitations.

Mọi con số phải lấy từ workbook/Newman thật. Mọi bug/run phải có evidence link.
Không dùng câu chung chung và không che các INVALID/INCOMPLETE AI outputs.
```

## P9.2 — AI Critique 200–300 words

```text
Từ audit decisions thật, viết AI Critique tiếng Anh 200–300 từ vào
hw6/reports/final/ai-critique.md. Phải nêu ít nhất một lỗi/incomplete output cụ thể,
vì sao AI bỏ sót, sinh viên đã sửa thế nào và nguyên tắc học được khi cộng tác với AI.
Không invent ví dụ; dẫn TC_ID thật.
```

## P9.3 — AI Audit Report

```text
Tổng hợp hw6/ai-audit-log.md thành hw6/reports/final/ai-audit-report.md.
Mỗi interaction phải có tool/model, timestamp, exact prompt và full output/file reference.
Thêm declaration: "I use AI tools for the following tasks" và liệt kê đúng công cụ thực tế.
Kiểm tra không thiếu interaction từ P0 đến P9.
```

## P9.4 — README, self-assessment và test summary

```text
Viết hw6/README.md gồm repository/SUT links, cách setup, cách chạy Postman/Newman,
Postman features, CI links, bug links, optional video link và submission inventory.

Tạo self-assessment table: API1/30, API2/30, API3/30, Agent Generator/10.
Tạo test summary từ workbook: generated, human-added, executed, passed, failed và bugs/API.
Không điền số ước lượng.
```

## P9.5 — Git commit log

```text
Kiểm tra lịch sử commit có commit riêng cho setup, generation, audit, extension,
Postman implementation, execution, bugs, CI, generator design và final report.
Không rewrite lịch sử nếu đã push mà chưa hỏi tôi.

Export log text-based vào hw6/reports/final/git-commit-log.txt với hash, ISO date, author và subject.
```

## P9.6 — PDF và submission package

```text
Export main report và AI audit/critique appendix thành PDF, kiểm tra render không vỡ bảng/code.
Kiểm tra collection JSON, environment example, Excel, Newman HTML, CI report,
self-drawn diagram, pseudocode, bug evidence, Git log và README đều tồn tại.

Đóng gói thành 23127334_HW06_AI_API_<SelfAssessedGrade>.zip.
Không đóng gói secrets, node_modules, database chứa dữ liệu nhạy cảm hoặc screenshot giả.
In checklist file nào pass/fail; không tuyên bố hoàn tất nếu còn placeholder bắt buộc.
```

---

# Commit sequence gợi ý

```text
docs(hw6): initialize API testing workspace and audit log
docs(hw6): confirm API contracts with smoke tests
test(hw6): add domain state security and schema analysis
test(register): add AI-generated API test cases
test(coupon): add AI-generated API test cases
test(product): add AI-generated API test cases
test(register): audit and correct generated cases
test(coupon): audit and correct generated cases
test(product): audit and correct generated cases
test(hw6): add human-designed security and state cases
test(postman): implement collection environments and datasets
test(execution): add Newman results and evidence references
docs(bugs): add verified API defect reports
ci(hw6): run Newman API tests in GitHub Actions
test(ci-demo): demonstrate one detected assertion failure
test(ci-demo): restore correct assertion
design(hw6): add student-drawn generator design and pseudocode
docs(hw6): add final report audit critique and self-assessment
chore(hw6): add final submission manifest and git log
```

---

# Việc THỦ CÔNG sinh viên phải tự làm

1. Xác nhận ba API không trùng bộ ba của thành viên khác.
2. Đọc và quyết định từng nhãn `VALID / INVALID / INCOMPLETE`; AI không được quyết định thay.
3. Tự chọn và chịu trách nhiệm cho ít nhất 5 human-added test/API.
4. Chụp Postman Console thật có `X-Student-Id: 23127334`.
5. Chụp Newman terminal/report thật với hostname đúng.
6. Tự chạy và chụp hai GitHub Actions runs: một pass, một fail đúng một test.
7. Post verified bugs lên GitHub Issues và attach screenshot thật.
8. Tự vẽ AI test-generator diagram; AI không được generate diagram cuối.
9. Tự quay/upload video Agent Skill nếu chọn phần optional.
10. Kiểm tra self-assessment, đặt tên ZIP và nộp Moodle đúng hạn.

---

# Definition of Done

- Ba API, mỗi API có ít nhất 35 AI-generated test đã audit.
- Mỗi API có ít nhất 5 human-added test được giải thích.
- 100% test case có traceability và expected result theo spec.
- Collection/Environment/Data files chạy được bằng Newman.
- Mọi request có `X-Student-Id: 23127334`.
- Có Newman HTML report và actual result trong Excel.
- Chỉ bug đã tái hiện mới có GitHub Issue.
- Có CI passing run và controlled one-failure run thật.
- Có self-drawn generator diagram và pseudocode.
- Có Main Report Markdown + PDF, AI Audit và AI Critique 200–300 từ.
- Có README, self-assessment, test summary và Git commit log.
- ZIP đúng tên và không chứa secret.
