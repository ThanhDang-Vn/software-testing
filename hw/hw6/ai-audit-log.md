# HW06 — AI Audit Log

## Audit basis and timestamp declaration

This log indexes all **38 planned meaningful interactions (`P0.1`–`P9.6`)**. Short steering messages with no standalone output, such as `OKE`, `continue`, or retry/status chatter, are intentionally excluded. Short messages that materially changed the result—such as removing `PRD-C04`, authorizing missing-case supplementation, supplying the Postman screenshot, or accepting its risk—are preserved in the relevant human-review/correction field.

The retained session does not expose original per-message timestamps. Every timestamp field below is marked **UNAVAILABLE — ORIGINAL SYSTEM METADATA NOT EXPOSED**. File modification times and invented schedules are not used as substitutes.

Tool/model for all records: **OpenAI Codex; exact historical deployment/model version not exposed by retained session metadata**.

Prompt provenance: 15 interactions (`P6.1`–`P9.6`) are recoverable from the visible session context. The 23 P0–P5 records use exact planned prompt text from the committed playbook plus artifact mappings because their standalone chat messages are not visible; they are explicitly marked `PLAYBOOK/ARTIFACT-RECONSTRUCTED` and are not claimed as original chat records.

---

## `HW06-AI-P0.1` — Khởi tạo cấu trúc bài làm và AI audit

- **Interaction ID:** `HW06-AI-P0.1`
- **Tool/model:** OpenAI Codex — exact historical model/version unavailable
- **Timestamp:** **UNAVAILABLE — ORIGINAL SYSTEM METADATA NOT EXPOSED**
- **Prompt provenance:** PLAYBOOK/ARTIFACT-RECONSTRUCTED — standalone chat message unavailable
- **Exact prompt / reconstructed planned prompt:**

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

- **Full output or file output:** `README.md`; `ai-audit-log.md`; initial `api-contracts/`, `testcases/`, `postman/`, `reports/`, `bugs/`, `evidence/`, `agent-generator/` structure
- **Human review:** Structure accepted; later paths were normalized to the repository's actual `hw/hw6/` location.
- **Correction:** See human-review statement above; no unrecorded correction is asserted.
- **Affected test IDs:** None/direct test IDs not applicable

## `HW06-AI-P0.2` — Khởi động SUT và smoke-test ba API

- **Interaction ID:** `HW06-AI-P0.2`
- **Tool/model:** OpenAI Codex — exact historical model/version unavailable
- **Timestamp:** **UNAVAILABLE — ORIGINAL SYSTEM METADATA NOT EXPOSED**
- **Prompt provenance:** PLAYBOOK/ARTIFACT-RECONSTRUCTED — standalone chat message unavailable
- **Exact prompt / reconstructed planned prompt:**

  ```text
  Khởi động EShop backend tại http://localhost:3000 và smoke-test bằng curl đúng ba API đã chọn:
  POST /api/register, POST /api/apply-coupon, POST /api/products.

  Với mỗi API, in request headers/body, HTTP status và response body thực tế. Đối với product,
  thử cả không token, user token và admin token để xác minh authorization thực tế. Đối với coupon,
  thử total_amount bằng chính min_order_amount và lớn hơn min_order_amount.

  Ghi kết quả vào hw6/api-contracts/p0-smoke-test.md. Tách rõ expected theo spec và actual.
  Chưa kết luận bug nếu chỉ dựa trên source code; kết luận sơ bộ phải dựa trên response chạy thật.
  ```

- **Full output or file output:** `api-contracts/p0-smoke-test.md`
- **Human review:** Smoke conclusions were based on live responses rather than source inspection alone.
- **Correction:** See human-review statement above; no unrecorded correction is asserted.
- **Affected test IDs:** None/direct test IDs not applicable

## `HW06-AI-P0.3` — Chuẩn bị dữ liệu và reset strategy

- **Interaction ID:** `HW06-AI-P0.3`
- **Tool/model:** OpenAI Codex — exact historical model/version unavailable
- **Timestamp:** **UNAVAILABLE — ORIGINAL SYSTEM METADATA NOT EXPOSED**
- **Prompt provenance:** PLAYBOOK/ARTIFACT-RECONSTRUCTED — standalone chat message unavailable
- **Exact prompt / reconstructed planned prompt:**

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

- **Full output or file output:** `postman/data/register-data.json`; `postman/data/coupon-data.json`; `postman/data/product-data.json`; `postman/data/test-identities.md`
- **Human review:** Seed IDs were treated as valid only after reset/login/category verification.
- **Correction:** See human-review statement above; no unrecorded correction is asserted.
- **Affected test IDs:** None/direct test IDs not applicable

## `HW06-AI-P1.1` — Trích xuất API contract và traceability

- **Interaction ID:** `HW06-AI-P1.1`
- **Tool/model:** OpenAI Codex — exact historical model/version unavailable
- **Timestamp:** **UNAVAILABLE — ORIGINAL SYSTEM METADATA NOT EXPOSED**
- **Prompt provenance:** PLAYBOOK/ARTIFACT-RECONSTRUCTED — standalone chat message unavailable
- **Exact prompt / reconstructed planned prompt:**

  ```text
  Đọc README.md, api_specification.md và backend/server.js của EShop cho đúng ba API đã chọn.
  Tạo hw6/api-contracts/api-contract-matrix.md.

  Với mỗi API ghi: feature/requirement, method/path, authentication, role, headers, request fields,
  data types, required/optional, constraints, business rules, expected status codes, response schema,
  side effects, SEC-01..SEC-07 liên quan, preconditions và supporting endpoints.

  Nếu specification và implementation khác nhau, ghi SPEC EXPECTATION và IMPLEMENTATION OBSERVATION
  riêng; không tự sửa expected result theo bug hiện tại. Chưa generate test case.
  ```

- **Full output or file output:** `api-contracts/api-contract-matrix.md`
- **Human review:** SPEC EXPECTATION and IMPLEMENTATION OBSERVATION remained separate.
- **Correction:** See human-review statement above; no unrecorded correction is asserted.
- **Affected test IDs:** None/direct test IDs not applicable

## `HW06-AI-P1.2` — Domain partition và boundary-value analysis

- **Interaction ID:** `HW06-AI-P1.2`
- **Tool/model:** OpenAI Codex — exact historical model/version unavailable
- **Timestamp:** **UNAVAILABLE — ORIGINAL SYSTEM METADATA NOT EXPOSED**
- **Prompt provenance:** PLAYBOOK/ARTIFACT-RECONSTRUCTED — standalone chat message unavailable
- **Exact prompt / reconstructed planned prompt:**

  ```text
  Từ API contract đã duyệt, lập domain-partition/BVA matrix cho mọi parameter của ba API:
  - Register: name, email, password và JSON/body/header variations.
  - Coupon: code, total_amount, user_id và authentication context.
  - Product: name, price, description, imageUrl, category_id và role context.

  Với mỗi parameter ghi equivalence partitions, valid/invalid classes, boundary values,
  representative values, expected behavior và nguồn requirement. Không invent limit khi spec không nêu;
  đánh dấu SPEC GAP. Ghi vào hw6/testcases/p1-domain-partitions.md. Chưa tạo danh sách test cuối.
  ```

- **Full output or file output:** No dedicated `p1-domain-partitions.md` is present; coverage was later incorporated into generated cases and `testcases/p3-audit-coverage-gaps.md`
- **Human review:** No visible session message or dedicated output file proves this standalone step; retained as a reconstructed planned interaction with an explicit artifact gap.
- **Correction:** See human-review statement above; no unrecorded correction is asserted.
- **Affected test IDs:** None/direct test IDs not applicable

## `HW06-AI-P1.3` — State-transition analysis

- **Interaction ID:** `HW06-AI-P1.3`
- **Tool/model:** OpenAI Codex — exact historical model/version unavailable
- **Timestamp:** **UNAVAILABLE — ORIGINAL SYSTEM METADATA NOT EXPOSED**
- **Prompt provenance:** PLAYBOOK/ARTIFACT-RECONSTRUCTED — standalone chat message unavailable
- **Exact prompt / reconstructed planned prompt:**

  ```text
  Phân tích state transition liên quan đến từng API, dù state đơn giản:
  - Register: account absent → created → duplicate registration attempt.
  - Coupon: eligible unused → applied → usage recorded → usage limit reached; active/expired states.
  - Product: product absent → created → retrievable; user role guest/user/admin.

  Liệt kê initial state, event/request, next state, valid/invalid transition, setup endpoint,
  verification endpoint và teardown. Không vẽ diagram cuối của Agent Generator.
  Ghi vào hw6/testcases/p1-state-transitions.md.
  ```

- **Full output or file output:** `testcases/p1-state-transitions.md`
- **Human review:** Accepted; final generator diagram remained outside this analysis artifact.
- **Correction:** See human-review statement above; no unrecorded correction is asserted.
- **Affected test IDs:** None/direct test IDs not applicable

## `HW06-AI-P1.4` — Security và schema checklist

- **Interaction ID:** `HW06-AI-P1.4`
- **Tool/model:** OpenAI Codex — exact historical model/version unavailable
- **Timestamp:** **UNAVAILABLE — ORIGINAL SYSTEM METADATA NOT EXPOSED**
- **Prompt provenance:** PLAYBOOK/ARTIFACT-RECONSTRUCTED — standalone chat message unavailable
- **Exact prompt / reconstructed planned prompt:**

  ```text
  Tạo security + schema checklist cho ba API dựa trên SEC-01..SEC-07 và behavior của endpoint.
  Bao phủ JWT missing/malformed/expired, role escalation, mass assignment, IDOR/user_id tampering,
  SQL injection, XSS payload persistence, sensitive-data leakage, unexpected fields và malformed JSON.

  Với schema, định nghĩa exact required fields, field types, fields không được xuất hiện,
  status/content-type và side-effect verification. Không gọi mọi validation failure là security bug.
  Ghi vào hw6/testcases/p1-security-schema-checklist.md.
  ```

- **Full output or file output:** `testcases/p1-security-schema-checklist.md`
- **Human review:** Accepted; validation failures were not automatically labeled security defects.
- **Correction:** See human-review statement above; no unrecorded correction is asserted.
- **Affected test IDs:** None/direct test IDs not applicable

## `HW06-AI-P2.1` — Generate 40 test case cho Registration

- **Interaction ID:** `HW06-AI-P2.1`
- **Tool/model:** OpenAI Codex — exact historical model/version unavailable
- **Timestamp:** **UNAVAILABLE — ORIGINAL SYSTEM METADATA NOT EXPOSED**
- **Prompt provenance:** PLAYBOOK/ARTIFACT-RECONSTRUCTED — standalone chat message unavailable
- **Exact prompt / reconstructed planned prompt:**

  ```text
  Dựa duy nhất trên các artifact đã duyệt ở Phase 1, generate đúng 40 AI test case cho
  POST /api/register, ID REG-AI-001..040. Bao phủ mọi parameter bằng EP/BVA,
  account lifecycle, duplicate registration, malformed request, security SEC-01/SEC-05,
  mass assignment và exact response schema.

  Không duplicate cùng một ý tưởng bằng cách chỉ đổi một chuỗi tương đương. Expected result phải theo spec,
  không theo bug implementation. Ghi vào hw6/testcases/register-ai-generated.md và một CSV trung gian.
  Chưa đánh nhãn audit và chưa gọi case nào là human-added.
  ```

- **Full output or file output:** `testcases/register-ai-generated.md`; `testcases/register-ai-generated.csv`
- **Human review:** Forty Register cases generated; no human-added label was assigned at generation time.
- **Correction:** See human-review statement above; no unrecorded correction is asserted.
- **Affected test IDs:** REG-AI-001..040

## `HW06-AI-P2.2` — Generate 40 test case cho Apply Coupon

- **Interaction ID:** `HW06-AI-P2.2`
- **Tool/model:** OpenAI Codex — exact historical model/version unavailable
- **Timestamp:** **UNAVAILABLE — ORIGINAL SYSTEM METADATA NOT EXPOSED**
- **Prompt provenance:** PLAYBOOK/ARTIFACT-RECONSTRUCTED — standalone chat message unavailable
- **Exact prompt / reconstructed planned prompt:**

  ```text
  Dựa duy nhất trên các artifact đã duyệt ở Phase 1, generate đúng 40 AI test case cho
  POST /api/apply-coupon, ID CPN-AI-001..040. Dùng decision table cho 5 điều kiện FR-09,
  BVA quanh min_order_amount, percent/fixed calculation, expired/disabled/not-found,
  usage limit state, authentication, user_id tampering và exact response schema.

  Phải có test tại total_amount = min_order_amount. Không duplicate vô nghĩa.
  Ghi vào hw6/testcases/coupon-ai-generated.md và một CSV trung gian.
  Chưa đánh nhãn audit và chưa gọi case nào là human-added.
  ```

- **Full output or file output:** `testcases/coupon-ai-generated.md`; `testcases/coupon-ai-generated.csv`
- **Human review:** Forty Coupon cases generated, including equality at `min_order_amount`.
- **Correction:** See human-review statement above; no unrecorded correction is asserted.
- **Affected test IDs:** CPN-AI-001..040

## `HW06-AI-P2.3` — Generate 40 test case cho Create Product

- **Interaction ID:** `HW06-AI-P2.3`
- **Tool/model:** OpenAI Codex — exact historical model/version unavailable
- **Timestamp:** **UNAVAILABLE — ORIGINAL SYSTEM METADATA NOT EXPOSED**
- **Prompt provenance:** PLAYBOOK/ARTIFACT-RECONSTRUCTED — standalone chat message unavailable
- **Exact prompt / reconstructed planned prompt:**

  ```text
  Dựa duy nhất trên các artifact đã duyệt ở Phase 1, generate đúng 40 AI test case cho
  POST /api/products, ID PRD-AI-001..040. Bao phủ name max 255, price > 0,
  category tồn tại, optional/unspecified fields, malformed body, guest/user/admin roles,
  role escalation, injection/XSS persistence, response schema và database side effect.

  Expected authorization phải dựa FR-12/SEC-02/SEC-03. Không duplicate vô nghĩa.
  Ghi vào hw6/testcases/product-ai-generated.md và một CSV trung gian.
  Chưa đánh nhãn audit và chưa gọi case nào là human-added.
  ```

- **Full output or file output:** `testcases/product-ai-generated.md`; `testcases/product-ai-generated.csv`
- **Human review:** Forty Product cases generated with specification-based authorization expectations.
- **Correction:** See human-review statement above; no unrecorded correction is asserted.
- **Affected test IDs:** PRD-AI-001..040

## `HW06-AI-P2.4` — Hợp nhất thành Excel test case bản nháp

- **Interaction ID:** `HW06-AI-P2.4`
- **Tool/model:** OpenAI Codex — exact historical model/version unavailable
- **Timestamp:** **UNAVAILABLE — ORIGINAL SYSTEM METADATA NOT EXPOSED**
- **Prompt provenance:** PLAYBOOK/ARTIFACT-RECONSTRUCTED — standalone chat message unavailable
- **Exact prompt / reconstructed planned prompt:**

  ```text
  Hợp nhất 120 AI-generated test case vào hw6/testcases/23127334_HW06_API_TestCases.xlsx.
  Tạo sheet Register, Coupon, Product và Summary. Giữ đầy đủ các cột test case đã quy định.
  Summary hiện chỉ đếm AI-generated, chưa có human-added và chưa có execution result.
  Không tự audit hoặc sửa nội dung trong bước hợp nhất.
  ```

- **Full output or file output:** `testcases/23127334_HW06_API_TestCases.xlsx`
- **Human review:** Workbook merge preserved content without automatic audit edits.
- **Correction:** See human-review statement above; no unrecorded correction is asserted.
- **Affected test IDs:** REG-AI-001..040; CPN-AI-001..040; PRD-AI-001..040

## `HW06-AI-P3.1` — Audit có xác nhận từng nhóm Registration

- **Interaction ID:** `HW06-AI-P3.1`
- **Tool/model:** OpenAI Codex — exact historical model/version unavailable
- **Timestamp:** **UNAVAILABLE — ORIGINAL SYSTEM METADATA NOT EXPOSED**
- **Prompt provenance:** PLAYBOOK/ARTIFACT-RECONSTRUCTED — standalone chat message unavailable
- **Exact prompt / reconstructed planned prompt:**

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

- **Full output or file output:** `23127334_HW06_AI_Audit.md`; `testcases/register-human-audit.md`; audited Register rows in workbook
- **Human review:** Student completed human decisions in `23127334_HW06_AI_Audit.md` and confirmed them before workbook update.
- **Correction:** See human-review statement above; no unrecorded correction is asserted.
- **Affected test IDs:** REG-AI-001..040

## `HW06-AI-P3.2` — Audit có xác nhận từng nhóm Coupon

- **Interaction ID:** `HW06-AI-P3.2`
- **Tool/model:** OpenAI Codex — exact historical model/version unavailable
- **Timestamp:** **UNAVAILABLE — ORIGINAL SYSTEM METADATA NOT EXPOSED**
- **Prompt provenance:** PLAYBOOK/ARTIFACT-RECONSTRUCTED — standalone chat message unavailable
- **Exact prompt / reconstructed planned prompt:**

  ```text
  Hỗ trợ tôi audit CPN-AI-001..040 theo batch tối đa 10 case, dùng quy trình giống P3.1.
  Đặc biệt kiểm tra decision-table coverage, boundary >=, công thức percent/fixed,
  usage-state precondition và việc AI có tự đoán status code hay không.
  Dừng chờ tôi xác nhận từng batch trước khi cập nhật workbook.
  Ghi tổng kết vào hw6/testcases/coupon-human-audit.md.
  ```

- **Full output or file output:** `23127334_HW06_AI_Audit.md`; audited Coupon rows in workbook; no separate `coupon-human-audit.md` was retained
- **Human review:** The standalone prompt is not visible; Coupon decisions are evidenced in the student-authored audit file and workbook.
- **Correction:** See human-review statement above; no unrecorded correction is asserted.
- **Affected test IDs:** CPN-AI-001..040

## `HW06-AI-P3.3` — Audit có xác nhận từng nhóm Product

- **Interaction ID:** `HW06-AI-P3.3`
- **Tool/model:** OpenAI Codex — exact historical model/version unavailable
- **Timestamp:** **UNAVAILABLE — ORIGINAL SYSTEM METADATA NOT EXPOSED**
- **Prompt provenance:** PLAYBOOK/ARTIFACT-RECONSTRUCTED — standalone chat message unavailable
- **Exact prompt / reconstructed planned prompt:**

  ```text
  Hỗ trợ tôi audit PRD-AI-001..040 theo batch tối đa 10 case, dùng quy trình giống P3.1.
  Đặc biệt kiểm tra name 255, price > 0, category tồn tại, admin authorization,
  side-effect verification và test có bị trùng không.
  Dừng chờ tôi xác nhận từng batch trước khi cập nhật workbook.
  Ghi tổng kết vào hw6/testcases/product-human-audit.md.
  ```

- **Full output or file output:** `23127334_HW06_AI_Audit.md`; audited Product rows in workbook; no separate `product-human-audit.md` was retained
- **Human review:** The standalone prompt is not visible; Product decisions are evidenced in the student-authored audit file and workbook.
- **Correction:** See human-review statement above; no unrecorded correction is asserted.
- **Affected test IDs:** PRD-AI-001..040

## `HW06-AI-P3.4` — Audit coverage gate

- **Interaction ID:** `HW06-AI-P3.4`
- **Tool/model:** OpenAI Codex — exact historical model/version unavailable
- **Timestamp:** **UNAVAILABLE — ORIGINAL SYSTEM METADATA NOT EXPOSED**
- **Prompt provenance:** PLAYBOOK/ARTIFACT-RECONSTRUCTED — standalone chat message unavailable
- **Exact prompt / reconstructed planned prompt:**

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

- **Full output or file output:** `testcases/p3-audit-coverage-gaps.md`
- **Human review:** Coverage gaps were reported without silently adding cases.
- **Correction:** See human-review statement above; no unrecorded correction is asserted.
- **Affected test IDs:** All 120 AI-generated IDs

## `HW06-AI-P4.1` — Hướng dẫn chọn 5+ human cases/API

- **Interaction ID:** `HW06-AI-P4.1`
- **Tool/model:** OpenAI Codex — exact historical model/version unavailable
- **Timestamp:** **UNAVAILABLE — ORIGINAL SYSTEM METADATA NOT EXPOSED**
- **Prompt provenance:** PLAYBOOK/ARTIFACT-RECONSTRUCTED — standalone chat message unavailable
- **Exact prompt / reconstructed planned prompt:**

  ```text
  Từ audit gaps và behavior thực tế, đưa ra danh sách candidate mà AI có thể đã bỏ sót cho mỗi API,
  ưu tiên chained state, security và side effect. Không tự ghi chúng là human-added.

  Đối với mỗi candidate, hỏi tôi chọn/loại/sửa. Sau khi tôi tự quyết định ít nhất 5 case/API,
  ghi chúng thành REG-H-*, CPN-H-* và PRD-H-* trong Excel và các file Markdown.
  Mỗi case phải có lời giải thích tại sao AI bỏ sót: prompt quality, model limitation,
  spec fragmentation hoặc endpoint statefulness. Giữ lại lịch sử quyết định của tôi.
  ```

- **Full output or file output:** `testcases/register-human-added.md`; `coupon-human-added.md`; `product-human-added.md`; `human-candidate-decision-history.md`; workbook
- **Human review:** Student approved candidates and explicitly removed `PRD-C04`; the removal remains recorded.
- **Correction:** See human-review statement above; no unrecorded correction is asserted.
- **Affected test IDs:** REG-H-001..009; CPN-H-001..010; PRD-H-001..009

## `HW06-AI-P4.2` — Final test-design quality gate

- **Interaction ID:** `HW06-AI-P4.2`
- **Tool/model:** OpenAI Codex — exact historical model/version unavailable
- **Timestamp:** **UNAVAILABLE — ORIGINAL SYSTEM METADATA NOT EXPOSED**
- **Prompt provenance:** PLAYBOOK/ARTIFACT-RECONSTRUCTED — standalone chat message unavailable
- **Exact prompt / reconstructed planned prompt:**

  ```text
  Kiểm tra bản test design cuối có ít nhất 35 AI-generated đã được audit và ít nhất 5 human-added/API.
  Không tính setup request là test case chính. Không tính hai case trùng logic chỉ vì khác dữ liệu.
  Cập nhật sheet Summary với generated, valid, invalid, incomplete, corrected và human-added counts.
  Ghi kết quả gate vào hw6/testcases/p4-final-design-check.md.
  ```

- **Full output or file output:** `testcases/p4-final-design-check.md`; workbook `Summary`
- **Human review:** Initial gate failed; the meaningful short correction `thiếu thì bổ sung đi` authorized additional non-overlapping cases, after which the gate passed.
- **Correction:** See human-review statement above; no unrecorded correction is asserted.
- **Affected test IDs:** All 148 workbook IDs

## `HW06-AI-P5.1` — Thiết kế collection trước khi sinh JSON

- **Interaction ID:** `HW06-AI-P5.1`
- **Tool/model:** OpenAI Codex — exact historical model/version unavailable
- **Timestamp:** **UNAVAILABLE — ORIGINAL SYSTEM METADATA NOT EXPOSED**
- **Prompt provenance:** PLAYBOOK/ARTIFACT-RECONSTRUCTED — standalone chat message unavailable
- **Exact prompt / reconstructed planned prompt:**

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

- **Full output or file output:** `postman/collection-design.md`
- **Human review:** Blueprint created before collection JSON.
- **Correction:** See human-review statement above; no unrecorded correction is asserted.
- **Affected test IDs:** None/direct test IDs not applicable

## `HW06-AI-P5.2` — Header bắt buộc và Postman Console evidence

- **Interaction ID:** `HW06-AI-P5.2`
- **Tool/model:** OpenAI Codex — exact historical model/version unavailable
- **Timestamp:** **UNAVAILABLE — ORIGINAL SYSTEM METADATA NOT EXPOSED**
- **Prompt provenance:** PLAYBOOK/ARTIFACT-RECONSTRUCTED — standalone chat message unavailable
- **Exact prompt / reconstructed planned prompt:**

  ```text
  Thêm collection-level pre-request script để upsert header X-Student-Id từ environment
  và console.log giá trị thực tế trên mọi request. studentId phải là 23127334.
  Thêm assertion xác nhận header đã được gắn trước khi gửi.

  Hướng dẫn tôi mở Postman Console và chụp screenshot thật có request URL,
  X-Student-Id và timestamp. AI không tạo hoặc chỉnh screenshot.
  Ghi hướng dẫn vào hw6/evidence/postman/README.md.
  ```

- **Full output or file output:** `evidence/postman/README.md`; `evidence/postman/23127334-x-student-id-console-20260817-140106Z.png`; collection-level script in exported collection
- **Human review:** Student supplied a real screenshot. The later short decision `kệ đi` accepted its visible test password risk; AI did not edit the image.
- **Correction:** See human-review statement above; no unrecorded correction is asserted.
- **Affected test IDs:** None/direct test IDs not applicable

## `HW06-AI-P5.3` — Sinh Postman collection và environment

- **Interaction ID:** `HW06-AI-P5.3`
- **Tool/model:** OpenAI Codex — exact historical model/version unavailable
- **Timestamp:** **UNAVAILABLE — ORIGINAL SYSTEM METADATA NOT EXPOSED**
- **Prompt provenance:** PLAYBOOK/ARTIFACT-RECONSTRUCTED — standalone chat message unavailable
- **Exact prompt / reconstructed planned prompt:**

  ```text
  Từ test case cuối đã audit, sinh collection JSON và local environment JSON trong hw6/postman/.
  Implement test scripts kiểm tra status, content-type, exact schema, business values và side effects.
  Liên kết test name với TC_ID. Dùng data-driven files cho các partitions phù hợp.

  Không hard-code JWT. Không để secret thật trong file public; tạo local ignored environment
  và sanitized example environment. Validate collection JSON parse được.
  ```

- **Full output or file output:** `postman/23127334_HW06_API_Testing.postman_collection.json`; `postman/23127334_HW06_Local.example.postman_environment.json`; ignored local environment; generator scripts
- **Human review:** Collection/environment JSON parsed; local secrets stayed in ignored files and no JWT was hard-coded.
- **Correction:** See human-review statement above; no unrecorded correction is asserted.
- **Affected test IDs:** All 148 workbook IDs

## `HW06-AI-P5.4` — Chạy từng API trong Postman và cập nhật actual result

- **Interaction ID:** `HW06-AI-P5.4`
- **Tool/model:** OpenAI Codex — exact historical model/version unavailable
- **Timestamp:** **UNAVAILABLE — ORIGINAL SYSTEM METADATA NOT EXPOSED**
- **Prompt provenance:** PLAYBOOK/ARTIFACT-RECONSTRUCTED — standalone chat message unavailable
- **Exact prompt / reconstructed planned prompt:**

  ```text
  Chạy riêng từng folder Register, Coupon và Product. Trước mỗi run reset/seed state theo strategy.
  Ghi status/body thực tế, PASS/FAIL và evidence reference vào workbook.
  Phân biệt test fail do SUT bug, test script bug, environment/setup failure và spec ambiguity.

  Không sửa expected result chỉ để biến test thành pass. Lưu run summary vào
  hw6/reports/newman/postman-run-summary.md.
  ```

- **Full output or file output:** `reports/newman/postman-run-summary.md`; CLI/HTML reports; workbook actual-result columns
- **Human review:** Known harness bugs were fixed and runs repeated; expected results were not changed to force PASS.
- **Correction:** See human-review statement above; no unrecorded correction is asserted.
- **Affected test IDs:** All 148 workbook IDs

## `HW06-AI-P5.5` — Newman + HTML report

- **Interaction ID:** `HW06-AI-P5.5`
- **Tool/model:** OpenAI Codex — exact historical model/version unavailable
- **Timestamp:** **UNAVAILABLE — ORIGINAL SYSTEM METADATA NOT EXPOSED**
- **Prompt provenance:** PLAYBOOK/ARTIFACT-RECONSTRUCTED — standalone chat message unavailable
- **Exact prompt / reconstructed planned prompt:**

  ```text
  Export collection/environment đã kiểm tra và chạy Newman ở CLI với data files cần thiết.
  Xuất CLI output và HTML report vào hw6/reports/newman/. Hostname trong output phải là
  localhost/127.0.0.1 hoặc deployment thật.

  Lưu command chính xác, Node/Newman version, timestamp, totals, assertions, passed, failed.
  Hướng dẫn tôi chụp terminal output thật; không fabricate hoặc chỉnh output.
  Sau run, cập nhật workbook actual result và Summary.
  ```

- **Full output or file output:** `reports/newman/register-run.cli.txt`; `coupon-run.cli.txt`; `product-run.cli.txt`; matching HTML reports; workbook `Summary`
- **Human review:** Real data-driven CLI/HTML reports were produced. Machine JSON with resolved auth data was moved under ignored `.tools/`.
- **Correction:** See human-review statement above; no unrecorded correction is asserted.
- **Affected test IDs:** All 148 workbook IDs

## `HW06-AI-P5.6` — Postman feature inventory

- **Interaction ID:** `HW06-AI-P5.6`
- **Tool/model:** OpenAI Codex — exact historical model/version unavailable
- **Timestamp:** **UNAVAILABLE — ORIGINAL SYSTEM METADATA NOT EXPOSED**
- **Prompt provenance:** PLAYBOOK/ARTIFACT-RECONSTRUCTED — standalone chat message unavailable
- **Exact prompt / reconstructed planned prompt:**

  ```text
  Lập danh sách Postman features thực tế đã sử dụng: workspace, collection, folders,
  collection/environment/local variables, pre-request script, test script, data-driven run,
  Collection Runner, Newman và report. Chỉ ghi monitor/mock server nếu tôi thật sự đã tạo và chạy.
  Ghi mục đích và bằng chứng của từng feature vào hw6/reports/postman-features.md.
  ```

- **Full output or file output:** `reports/postman-features.md`
- **Human review:** GUI Collection Runner was not counted without evidence; Newman usage was evidenced.
- **Correction:** See human-review statement above; no unrecorded correction is asserted.
- **Affected test IDs:** None/direct test IDs not applicable

## `HW06-AI-P6.1` — Phân loại failure và verify bug

- **Interaction ID:** `HW06-AI-P6.1`
- **Tool/model:** OpenAI Codex — exact historical model/version unavailable
- **Timestamp:** **UNAVAILABLE — ORIGINAL SYSTEM METADATA NOT EXPOSED**
- **Prompt provenance:** VISIBLE SESSION CONTEXT
- **Exact prompt / reconstructed planned prompt:**

  ```text
  Đọc Postman/Newman failures và phân loại: SUT defect, test defect, environment defect,
  specification gap hoặc expected behavior. Với candidate SUT defect, chạy lại request độc lập tối thiểu
  hai lần sau khi reset state và lưu request/response thô.

  Chỉ giữ bug tái hiện được. Đặc biệt xác minh các hypothesis về plaintext password,
  missing authorization, >= boundary và percent calculation. Ghi vào hw6/bugs/verified-bugs.md.
  ```

- **Full output or file output:** `bugs/verified-bugs.md`; `bugs/verified-bugs-reproduction.rest`; `agent-generator/verify_defect_candidates.js`
- **Human review:** Only defects reproduced twice after reset were retained.
- **Correction:** See human-review statement above; no unrecorded correction is asserted.
- **Affected test IDs:** REG-AI-040; CPN-AI-006; PRD-AI-002; CPN-AI-010; CPN-AI-001; CPN-AI-015

## `HW06-AI-P6.2` — Soạn GitHub Issues

- **Interaction ID:** `HW06-AI-P6.2`
- **Tool/model:** OpenAI Codex — exact historical model/version unavailable
- **Timestamp:** **UNAVAILABLE — ORIGINAL SYSTEM METADATA NOT EXPOSED**
- **Prompt provenance:** VISIBLE SESSION CONTEXT
- **Exact prompt / reconstructed planned prompt:**

  ```text
  Từ verified bugs, soạn từng GitHub Issue gồm title, environment, related FR/SEC,
  preconditions, steps, request, expected, actual, severity, impact, TC_ID, evidence và commit/run link.
  Tạo file hw6/bugs/github-issue-drafts.md. Không post issue thay tôi và không tạo screenshot giả.
  Để placeholder rõ ràng cho screenshot thật mà tôi sẽ attach.
  ```

- **Full output or file output:** `bugs/github-issues.md`; published GitHub Issues #49–#53
- **Human review:** Student supplied screenshots and authorized publication; AI did not fabricate evidence.
- **Correction:** See human-review statement above; no unrecorded correction is asserted.
- **Affected test IDs:** Verified defect-linked IDs

## `HW06-AI-P7.1` — Tạo GitHub Actions workflow

- **Interaction ID:** `HW06-AI-P7.1`
- **Tool/model:** OpenAI Codex — exact historical model/version unavailable
- **Timestamp:** **UNAVAILABLE — ORIGINAL SYSTEM METADATA NOT EXPOSED**
- **Prompt provenance:** VISIBLE SESSION CONTEXT
- **Exact prompt / reconstructed planned prompt:**

  ```text
  Tạo .github/workflows/hw06-api-tests.yml để checkout, setup Node, cài/start EShop,
  wait health/readiness, seed/reset database, cài Newman, chạy collection và upload reports/artifacts.
  Mọi request vẫn phải có X-Student-Id 23127334. Secrets phải dùng GitHub Secrets hoặc generated runtime data.

  Workflow phải fail khi assertion fail. Ghi giải thích pipeline vào hw6/reports/cicd/pipeline-configuration.md.
  ```

- **Full output or file output:** `../../.github/workflows/hw06-api-tests.yml`; `reports/cicd/pipeline-configuration.md`
- **Human review:** Workflow defects found in real runs were corrected in later CI commits.
- **Correction:** See human-review statement above; no unrecorded correction is asserted.
- **Affected test IDs:** None/direct test IDs not applicable

## `HW06-AI-P7.2` — Passing pipeline run

- **Interaction ID:** `HW06-AI-P7.2`
- **Tool/model:** OpenAI Codex — exact historical model/version unavailable
- **Timestamp:** **UNAVAILABLE — ORIGINAL SYSTEM METADATA NOT EXPOSED**
- **Prompt provenance:** VISIBLE SESSION CONTEXT
- **Exact prompt / reconstructed planned prompt:**

  ```text
  Chuẩn bị commit mà toàn bộ expected-working CI suite đều pass, push và hướng dẫn tôi kiểm tra run.
  Tôi sẽ tự lưu GitHub Actions run URL, commit SHA, screenshot summary và artifact link.
  Không bịa link hoặc screenshot. Cập nhật placeholder vào hw6/reports/cicd/passing-run.md.
  ```

- **Full output or file output:** `reports/cicd/passing-run.md`; `actions/success/evidence.md`
- **Human review:** Student supplied real run/artifact/SHA evidence.
- **Correction:** See human-review statement above; no unrecorded correction is asserted.
- **Affected test IDs:** REG-AI-001; CPN-AI-017; PRD-AI-001

## `HW06-AI-P7.3` — Controlled one-failure pipeline run

- **Interaction ID:** `HW06-AI-P7.3`
- **Tool/model:** OpenAI Codex — exact historical model/version unavailable
- **Timestamp:** **UNAVAILABLE — ORIGINAL SYSTEM METADATA NOT EXPOSED**
- **Prompt provenance:** VISIBLE SESSION CONTEXT
- **Exact prompt / reconstructed planned prompt:**

  ```text
  Tạo một commit demonstration riêng làm đúng một assertion có chủ đích bị fail,
  không thay đổi dữ liệu thật và không phá các test khác. Gắn nhãn rõ CI DEMO FAILURE.
  Sau khi tôi push và run thật, hướng dẫn tôi lưu URL/SHA/screenshot. Sau đó tạo commit restore assertion đúng.

  Ghi cả ba commit (passing, one-failure, restore) và lý do vào hw6/reports/cicd/failing-run.md.
  Không tự tạo GitHub run evidence.
  ```

- **Full output or file output:** `reports/cicd/failing-run.md`; `actions/fail/evidence.md`; `actions/restore/evidence.md`
- **Human review:** Student supplied real failing and restored run evidence.
- **Correction:** See human-review statement above; no unrecorded correction is asserted.
- **Affected test IDs:** None/direct test IDs not applicable

## `HW06-AI-P7.4` — CI/CD short report

- **Interaction ID:** `HW06-AI-P7.4`
- **Tool/model:** OpenAI Codex — exact historical model/version unavailable
- **Timestamp:** **UNAVAILABLE — ORIGINAL SYSTEM METADATA NOT EXPOSED**
- **Prompt provenance:** VISIBLE SESSION CONTEXT
- **Exact prompt / reconstructed planned prompt:**

  ```text
  Sau khi tôi cung cấp link và screenshot thật của hai run, viết hw6/reports/cicd/cicd-report.md:
  trigger, jobs, setup, data strategy, Newman command, artifacts, pass/fail rule,
  passing-run evidence, one-failure-run evidence và limitation.
  Không dùng placeholder chưa điền trong bản final.
  ```

- **Full output or file output:** `reports/cicd/cicd-report.md`
- **Human review:** Final report uses supplied CI evidence only.
- **Correction:** See human-review statement above; no unrecorded correction is asserted.
- **Affected test IDs:** None/direct test IDs not applicable

## `HW06-AI-P8.1` — Đặc tả thiết kế để sinh viên tự vẽ diagram

- **Interaction ID:** `HW06-AI-P8.1`
- **Tool/model:** OpenAI Codex — exact historical model/version unavailable
- **Timestamp:** **UNAVAILABLE — ORIGINAL SYSTEM METADATA NOT EXPOSED**
- **Prompt provenance:** VISIBLE SESSION CONTEXT
- **Exact prompt / reconstructed planned prompt:**

  ```text
  Giúp tôi xác định các component và data flow của AI-driven API test generator:
  Spec Loader, Contract Extractor, Domain/BVA Generator, State Modeler, Security Mapper,
  Schema Assertion Generator, Deduplicator, Traceability Checker, Human Review Gate,
  Excel/Postman Exporter và Audit Logger.

  Chỉ cung cấp component list, responsibilities, inputs/outputs và connection list.
  KHÔNG tạo Mermaid, PlantUML, image hoặc diagram cuối. Tôi phải tự vẽ diagram theo anti-cheat constraint.
  Ghi drawing brief vào hw6/agent-generator/drawing-brief.md.
  ```

- **Full output or file output:** `agent-generator/drawing-brief.md`; student-owned Excalidraw artifact referenced by final report
- **Human review:** Student retained ownership of the final self-drawn diagram.
- **Correction:** See human-review statement above; no unrecorded correction is asserted.
- **Affected test IDs:** None/direct test IDs not applicable

## `HW06-AI-P8.2` — Pseudocode

- **Interaction ID:** `HW06-AI-P8.2`
- **Tool/model:** OpenAI Codex — exact historical model/version unavailable
- **Timestamp:** **UNAVAILABLE — ORIGINAL SYSTEM METADATA NOT EXPOSED**
- **Prompt provenance:** VISIBLE SESSION CONTEXT
- **Exact prompt / reconstructed planned prompt:**

  ```text
  Viết pseudocode chi tiết cho API test generator từ input api_specification.md đến output test cases.
  Phải có validation, spec-gap handling, multi-technique generation, deduplication,
  coverage gate, human approval, export và AI audit. Ghi vào hw6/agent-generator/pseudocode.md.
  Nêu rõ phần nào deterministic và phần nào gọi LLM.
  ```

- **Full output or file output:** `agent-generator/pseudocode.md`
- **Human review:** Deterministic and LLM-assisted stages remain separated.
- **Correction:** See human-review statement above; no unrecorded correction is asserted.
- **Affected test IDs:** None/direct test IDs not applicable

## `HW06-AI-P8.3` — Agent Skill tùy chọn

- **Interaction ID:** `HW06-AI-P8.3`
- **Tool/model:** OpenAI Codex — exact historical model/version unavailable
- **Timestamp:** **UNAVAILABLE — ORIGINAL SYSTEM METADATA NOT EXPOSED**
- **Prompt provenance:** VISIBLE SESSION CONTEXT
- **Exact prompt / reconstructed planned prompt:**

  ```text
  Dùng skill-creator để xây một reusable Agent Skill cho pipeline specification → audited API test cases
  trong hw6/agent-generator/skill/. Skill không được tự phê duyệt human-review gate.
  Demo bằng đúng một API và tạo hướng dẫn để tôi tự quay video, thuyết minh và upload YouTube.
  Không tạo video hoặc giả link video.
  ```

- **Full output or file output:** `agent-generator/skill/audited-api-test-generator/`; video guide/script; student YouTube URL
- **Human review:** Human-review gate was not auto-approved; student performed review and video steps.
- **Correction:** See human-review statement above; no unrecorded correction is asserted.
- **Affected test IDs:** CPN-DEMO-001..003

## `HW06-AI-P9.1` — Main report

- **Interaction ID:** `HW06-AI-P9.1`
- **Tool/model:** OpenAI Codex — exact historical model/version unavailable
- **Timestamp:** **UNAVAILABLE — ORIGINAL SYSTEM METADATA NOT EXPOSED**
- **Prompt provenance:** VISIBLE SESSION CONTEXT
- **Exact prompt / reconstructed planned prompt:**

  ```text
  Viết hw6/reports/final/main-report.md theo ba full pipelines:
  selection rationale, contract analysis, AI generation, human audit, human extension,
  Postman implementation, execution results, bugs, Postman features, CI/CD và limitations.

  Mọi con số phải lấy từ workbook/Newman thật. Mọi bug/run phải có evidence link.
  Không dùng câu chung chung và không che các INVALID/INCOMPLETE AI outputs.
  ```

- **Full output or file output:** `reports/final/main-report.md`
- **Human review:** Final report retains real totals, failures, limitations and evidence links.
- **Correction:** See human-review statement above; no unrecorded correction is asserted.
- **Affected test IDs:** All workbook IDs

## `HW06-AI-P9.2` — AI Critique 200–300 words

- **Interaction ID:** `HW06-AI-P9.2`
- **Tool/model:** OpenAI Codex — exact historical model/version unavailable
- **Timestamp:** **UNAVAILABLE — ORIGINAL SYSTEM METADATA NOT EXPOSED**
- **Prompt provenance:** VISIBLE SESSION CONTEXT
- **Exact prompt / reconstructed planned prompt:**

  ```text
  Từ audit decisions thật, viết AI Critique tiếng Anh 200–300 từ vào
  hw6/reports/final/ai-critique.md. Phải nêu ít nhất một lỗi/incomplete output cụ thể,
  vì sao AI bỏ sót, sinh viên đã sửa thế nào và nguyên tắc học được khi cộng tác với AI.
  Không invent ví dụ; dẫn TC_ID thật.
  ```

- **Full output or file output:** `reports/final/ai-critique.md`
- **Human review:** Critique cites actual TC_IDs and audit decisions.
- **Correction:** See human-review statement above; no unrecorded correction is asserted.
- **Affected test IDs:** None/direct test IDs not applicable

## `HW06-AI-P9.3` — AI Audit Report

- **Interaction ID:** `HW06-AI-P9.3`
- **Tool/model:** OpenAI Codex — exact historical model/version unavailable
- **Timestamp:** **UNAVAILABLE — ORIGINAL SYSTEM METADATA NOT EXPOSED**
- **Prompt provenance:** VISIBLE SESSION CONTEXT
- **Exact prompt / reconstructed planned prompt:**

  ```text
  Tổng hợp hw6/ai-audit-log.md thành hw6/reports/final/ai-audit-report.md.
  Mỗi interaction phải có tool/model, timestamp, exact prompt và full output/file reference.
  Thêm declaration: "I use AI tools for the following tasks" và liệt kê đúng công cụ thực tế.
  Kiểm tra không thiếu interaction từ P0 đến P9.
  ```

- **Full output or file output:** `ai-audit-log.md`; `reports/final/ai-audit-report.md`
- **Human review:** On 2026-08-18 the student requested recovery from retained context. Thirty-eight planned phases are indexed, but unavailable original timestamps/model metadata and playbook-reconstructed P0–P5 prompts remain explicitly disclosed.
- **Correction:** See human-review statement above; no unrecorded correction is asserted.
- **Affected test IDs:** None/direct test IDs not applicable

## `HW06-AI-P9.4` — README, self-assessment và test summary

- **Interaction ID:** `HW06-AI-P9.4`
- **Tool/model:** OpenAI Codex — exact historical model/version unavailable
- **Timestamp:** **UNAVAILABLE — ORIGINAL SYSTEM METADATA NOT EXPOSED**
- **Prompt provenance:** VISIBLE SESSION CONTEXT
- **Exact prompt / reconstructed planned prompt:**

  ```text
  Viết hw6/README.md gồm repository/SUT links, cách setup, cách chạy Postman/Newman,
  Postman features, CI links, bug links, optional video link và submission inventory.

  Tạo self-assessment table: API1/30, API2/30, API3/30, Agent Generator/10.
  Tạo test summary từ workbook: generated, human-added, executed, passed, failed và bugs/API.
  Không điền số ước lượng.
  ```

- **Full output or file output:** `README.md`
- **Human review:** README uses artifact-derived counts and real links.
- **Correction:** See human-review statement above; no unrecorded correction is asserted.
- **Affected test IDs:** All workbook IDs

## `HW06-AI-P9.5` — Git commit log

- **Interaction ID:** `HW06-AI-P9.5`
- **Tool/model:** OpenAI Codex — exact historical model/version unavailable
- **Timestamp:** **UNAVAILABLE — ORIGINAL SYSTEM METADATA NOT EXPOSED**
- **Prompt provenance:** VISIBLE SESSION CONTEXT
- **Exact prompt / reconstructed planned prompt:**

  ```text
  Kiểm tra lịch sử commit có commit riêng cho setup, generation, audit, extension,
  Postman implementation, execution, bugs, CI, generator design và final report.
  Không rewrite lịch sử nếu đã push mà chưa hỏi tôi.

  Export log text-based vào hw6/reports/final/git-commit-log.txt với hash, ISO date, author và subject.
  ```

- **Full output or file output:** `reports/final/git-commit-log.txt`
- **Human review:** Git history was exported without rewriting pushed history.
- **Correction:** See human-review statement above; no unrecorded correction is asserted.
- **Affected test IDs:** None/direct test IDs not applicable

## `HW06-AI-P9.6` — PDF và submission package

- **Interaction ID:** `HW06-AI-P9.6`
- **Tool/model:** OpenAI Codex — exact historical model/version unavailable
- **Timestamp:** **UNAVAILABLE — ORIGINAL SYSTEM METADATA NOT EXPOSED**
- **Prompt provenance:** VISIBLE SESSION CONTEXT
- **Exact prompt / reconstructed planned prompt:**

  ```text
  Export main report và AI audit/critique appendix thành PDF, kiểm tra render không vỡ bảng/code.
  Kiểm tra collection JSON, environment example, Excel, Newman HTML, CI report,
  self-drawn diagram, pseudocode, bug evidence, Git log và README đều tồn tại.

  Đóng gói thành 23127334_HW06_AI_API_<SelfAssessedGrade>.zip.
  Không đóng gói secrets, node_modules, database chứa dữ liệu nhạy cảm hoặc screenshot giả.
  In checklist file nào pass/fail; không tuyên bố hoàn tất nếu còn placeholder bắt buộc.
  ```

- **Full output or file output:** `reports/final/main-report.pdf`; `reports/final/ai-audit-critique-appendix.pdf`; `reports/final/submission-checklist.txt`; submission ZIP when regenerated
- **Human review:** Generated package/checklist status must be regenerated after later changes; no fabricated completion claim is permitted.
- **Correction:** See human-review statement above; no unrecorded correction is asserted.
- **Affected test IDs:** None/direct test IDs not applicable

---

## Completeness statement

- Planned meaningful interactions indexed: **38/38 (100%)**.
- Exact visible-session prompt records: **15/38** (`P6.1`–`P9.6`).
- Explicit playbook/artifact-reconstructed phase records: **23/38** (`P0.1`–`P5.6`).
- Required audit fields present for every record: **interaction ID, tool/model disclosure, timestamp disclosure, prompt, output/file reference, human review, correction, affected test IDs**.
- Original system timestamps recovered: **0/38**; no substitute times are invented.
- Exact historical model versions recovered: **0/38**.

This is a structurally complete phase index with transparent provenance, not a fully compliant original interaction log. It does not convert playbook text or artifact existence into original chat metadata.
