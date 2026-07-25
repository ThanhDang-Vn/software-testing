# AI Audit Report

**Declaration:** I use AI tools for the following tasks.

---

## Tools Used

| Tool | Purpose |
| --- | --- |
| Claude Code (Claude) | Domain testing, BVA, test case design, test execution, bug reporting |

---

## Interaction Log

> **Ghi chú:** Feature A được thực hiện từng bước với prompt riêng cho mỗi phase (spec → domain → BVA → detailed → execution → bug report). Sau mỗi bước, tôi review output và gửi prompt sửa lỗi nếu phát hiện mistake → tạo ra các phiên bản v1, v2. Các feature B/C/D áp dụng skill tự động hóa (domain-bva-testing) dựa trên quy trình đã chuẩn hóa từ feature A, nên mỗi feature chỉ cần 1 prompt init + prompt review/sửa.

### Feature A — FR-02 Login & Account Lockout (step-by-step prompts)

| # | Date & Time | Tool | Prompt (summary) | Output (summary) |
| --- | --- | --- | --- | --- |
| 1 | 2026-06-23 11:25 | Claude Code (Opus 4.6) | **Prompt 1 — Spec Analysis:** "You are a software testing analyst. Perform ONLY SPECIFICATION ANALYSIS for feature_A (FR-02). Phân tích functional description, input fields (bảng Field Name / Data Type / Required / Validation Rules / Valid Domain / Invalid Domain / Source), field dependencies. DO NOT generate test cases." | `01_spec_analysis.md`: business flow login 5 bước, bảng 4 input fields (email, password, login_attempts, locked_until), 3 field dependencies, constraints phân biệt Spec vs Code. |
| 2 | 2026-06-23 11:25 | Claude Code (Opus 4.6) | **Prompt 2 — Domain Table:** "Áp dụng DOMAIN TESTING cho feature_A. STEP 1: Identify Input Fields. STEP 2: Domain Table — với MỖI field lập bảng Valid/Invalid Domain, EC IDs. KHÔNG đưa boundary vào. Dừng chờ review." | `02_domain_table.md`: bảng input fields + domain table với 21 ECs (valid + invalid), EC IDs (EC-E1, EC-P1, EC-LA-V1...). |
| 3 | 2026-06-23 11:25 | Claude Code (Opus 4.6) | **Prompt 3 — Domain Test Cases:** "STEP 3: thiết kế DOMAIN TEST CASES dựa trên ECs ở STEP 2. Phủ TẤT CẢ EC, áp dụng 'một biến sai tại một thời điểm', ID dạng DT-A-001. Dừng chờ review." | `03_domain_testcases.md` (v0): 18 domain TCs (DT-A-001→018), mỗi TC map về EC ID. |
| 4 | 2026-06-23 21:02 | Claude Code (Opus 4.6) | **Prompt 4 — BVA Table:** "STEP 4: Boundary Value Analysis — với MỖI field có miền ordered, lập bảng 7 điểm biên (Min-1/Min/Min+1/Nominal/Max-1/Max/Max+1). Field không áp dụng BVA ghi lý do. Dừng chờ review." | `04_bva_table.md` (v0): 4 fields (email length, password length, login_attempts, locked_until), 20+ boundary points. |
| 5 | 2026-06-23 21:02 | Claude Code (Opus 4.6) | **Prompt 5 — BVA Test Cases:** "STEP 5: chuyển bảng biên thành BVA TEST CASES. Mỗi điểm biên = 1 TC, ID dạng BVA-A-001. Bổ sung biên đặc biệt (chuỗi rỗng, max+1, số 0, số âm, Unicode). Dừng chờ review." | `05_bva_testcases.md` (v0): 28 BVA TCs (BVA-A-001→028) + 3 supplementary. |
| 6 | 2026-06-23 21:03 | Claude Code (Opus 4.6) | **Review v0→v1 (Prompt sửa 1):** "Sửa 03_domain_testcases: gộp 4 TC positive trùng → 1, sửa DT-A-016 logic error (Negative nhưng expect 200), đạt 100% EC coverage 16/16, renumber DT-A-001→018." | `03_domain_testcases_v1.md`: 18→16 ECs redesigned, 18 TCs renumbered, coverage 16/16. |
| 7 | 2026-06-23 21:03 | Claude Code (Opus 4.6) | **Review v0→v1 (Prompt sửa 2):** "Sửa 04_bva_table: locked_until Now-1 expected sai (phải là 200 unlocked, không phải 403), login_attempts Min+1=1 behavior sai (1+2=3 → LOCK), thêm disclaimer email/password không enforce length." | `04_bva_table_v1.md`: sửa 5 lỗi (logic error, inconsistency, ambiguity). |
| 8 | 2026-06-23 21:03 | Claude Code (Opus 4.6) | **Review v0→v1 (Prompt sửa 3):** "Sửa 05_bva_testcases: BVA-A-022 now()-1s → expected 200, tách BVA-A-013 thành 2 scenario (correct/wrong pw), gộp 4 nominal trùng → 1, đổi Special Cases → Supplementary Tests (non-BVA)." | `05_bva_testcases_v1.md`: tách/gộp TC, 28→27 TCs. `changes.md` ghi đầy đủ review issues → changes. |
| 8b | 2026-06-28 | Claude Code (Opus 4.6) | **Review cleanup (Prompt sửa 2b):** "Đồng bộ tiếng Việt 04_bva_table_v1 — terminology testing giữ tiếng Anh (Boundary, Threshold, Lock, Edge case...), phần diễn giải/mô tả viết tiếng Việt." | `04_bva_table_v1.md`: đồng bộ ngôn ngữ nhất quán (VN mô tả + EN terminology). |
| 9 | 2026-06-26 05:02 | Claude Code (Opus 4.6) | **Review v1→v2 (Prompt sửa 4):** "Bỏ toàn bộ email/password length BVA — backend không enforce constraint nào nên không có behavioral boundary. Thu gọn BVA còn 6 TC: counter threshold (stored=2,3,4) + locked_until (now-1, now, now+1)." | `04_bva_table_v2.md`: 4→2 fields, 6 boundary points. `05_bva_testcases_v2.md`: 27→6 TCs. Domain TCs v2 confirmed 11 TCs. |
| 10 | 2026-06-26 05:03 | Claude Code (Opus 4.6) | **Prompt 6 — Detailed Test Cases:** "STEP 6: Gộp toàn bộ Domain + BVA thành bảng chi tiết (ID / Description / Pre-condition / Steps / Test Data / Expected Result / Actual Result / Status). Sync từ source 03_v1 + 05_v1, không tự sáng tạo TC." | `06_detailed_testcases.md` (v0): 18 DT + 27 BVA = 45 TC, mỗi TC trace về source file. |
| 11 | 2026-06-26 05:03 | Claude Code (Opus 4.6) | **Review v0→v1 (Prompt sửa 5):** "Sửa 06_detailed_testcases: sync đúng 18 DT từ 03_v1, sửa 401→403 cho locked account, thêm BVA-A-012/013 bị thiếu, sửa BVA-A-016 counter boundary, thêm UI validation TCs (UI-A-001→008) cover FR-22." | `06_detailed_testcases_v1.md`: 45→53 TC (18 DT + 27 BVA + 8 UI). |
| 12 | 2026-06-26 05:03 | Claude Code (Opus 4.6) | **Prompt 7 — Test Execution:** "Thực thi test cho feature_A. Chạy EShop local, với mỗi TC ghi Actual Result + Status (Pass/Fail/Blocked)." | `07_execution.md`: kết quả pass/fail từng TC. Test scripts trong `test_scripts/`. |
| 13 | 2026-06-26 05:03 | Claude Code (Opus 4.6) | **Prompt 8 — Bug Report & Gap Analysis:** "Từ các test FAIL, viết BUG REPORT chuẩn (Bug ID / Title / Severity / Steps to Reproduce / Actual vs Expected / Related TC ID / Screenshot). Phân tích gap coverage." | `08_bug_report.md`: danh sách bugs (BUG-A-xxx). `09_gap_analysis.md`: coverage gaps và recommendations. |

### Feature B — FR-11 Order History (skill-based pipeline + review)

| # | Date & Time | Tool | Prompt (summary) | Output (summary) |
| --- | --- | --- | --- | --- |
| 14 | 2026-06-26 05:03 | Claude Code (Opus 4.6) | **Init pipeline:** Áp dụng skill domain-bva-testing cho feature_B (FR-11 Xem lịch sử đơn hàng). Chạy full pipeline: spec analysis → domain table → domain TCs → BVA table → BVA TCs. | `01_spec_analysis.md` → `05_bva_testcases.md`: flow xem đơn hàng, 13 ECs, 15 DT TCs, 15 BVA TCs. |
| 15 | 2026-06-26 05:03 | Claude Code (Opus 4.6) | **Review & enhance:** Sửa DT-B-008/009 expected result (returns message, not object), thêm 9 UI-B tests (FR-22), thêm DT-B-016→019 (DB error, unauthorized, NULL fields), thêm BVA-B-005/006, bỏ DT-B-014 trùng BVA-B-001. | `06_detailed_testcases.md`: 19→35 TC (20 DT + 6 BVA + 9 UI). `changes.md` ghi 9 critical issues fixed. |
| 15b | 2026-06-28 | Claude Code (Opus 4.6) | **Review round 2 — 03_domain_testcases:** "Thêm DB updated / response body / idempotency vào Expected (ghi trong cùng cột, không thêm cột mới). Group lại: Cancelable states → Non-cancelable states → Spec mismatch (shipping). Gộp DT-B-005 vào DT-B-008." → viết v1 thay vì sửa v0. | `03_domain_testcases.md` giữ nguyên (v0). Chưa tạo v1 (user muốn viết riêng). `changes.md` tạo mới: 6 review issues + 6 changes. |
| 15c | 2026-06-28 | Claude Code (Opus 4.6) | **BVA Scope Decision:** "orderId và createdAt có BVA là không hợp lý — identifier + render timestamp không phải ordered/continuous boundary ảnh hưởng logic." | `changes.md`: thêm section "BVA Scope Decision — feature_B", giải thích tại sao không cần BVA. |
| 15d | 2026-06-28 | Claude Code (Opus 4.6) | **Review round 2 — 06_detailed_testcases sync:** "Bỏ testcase đã xác nhận là bỏ. Đồng bộ với source reports. Chỉ lấy BVA có trong 05_bva_testcases_v1." | `06_detailed_testcases.md`: bỏ 15 BVA rejected + 8 UI. Giữ 15 DT + 4 BVA (từ 05_v1). Total: 35→**19 TC**. |
| 16 | 2026-06-26 05:04 | Claude Code (Opus 4.6) | **Execution + Bug Report:** Chạy test, ghi kết quả, viết bug report và gap analysis. | `07_execution.md`, `08_bug_report.md`, `09_gap_analysis.md`. |

### Feature C — FR-14 Category CRUD (skill-based pipeline + review)

| # | Date & Time | Tool | Prompt (summary) | Output (summary) |
| --- | --- | --- | --- | --- |
| 17 | 2026-06-27 10:11 | Claude Code (Opus 4.6) | **Init pipeline:** Áp dụng skill domain-bva-testing cho feature_C (FR-14 Category CRUD). Chạy full pipeline: spec analysis → domain table → domain TCs → BVA table → BVA TCs → detailed TCs. | `01_spec_analysis.md`: CRUD flow (Create/Read/Update/Delete), 5 input fields. `02_domain_table.md` (v0): 31 ECs (bao gồm JWT Token, User Role). `03_domain_testcases.md`: 26 Domain TCs. `04_bva_table.md`: name length + id boundaries. `05_bva_testcases.md` (v0): 26 BVA TCs + 7 Supplementary. `06_detailed_testcases.md` (v0): 48 TCs tổng hợp. |
| 18 | 2026-06-27 10:11 | Claude Code (Opus 4.6) | **Review round 1 — 02_domain_table v0→v1:** "Bỏ JWT Token (Field 4) và User Role (Field 5) — ngoài scope domain testing FR-14. Các test authentication/authorization thuộc FR-12 Access Control." | `02_domain_table_v1.md`: xóa 6 ECs (EC-T-V1, EC-T-V2, EC-T-I1, EC-T-I2, EC-R-V1, EC-R-I1). Tổng: 31→**25 ECs** (13 Valid + 12 Invalid). Đánh lại số Field. |
| 19 | 2026-06-27 10:11 | Claude Code (Opus 4.6) | **Review round 1 — 05_bva_testcases v0→v1:** "Bỏ Supplementary (BVA-C-020→026) — categorical tests (whitespace, XSS, duplicate, null, non-numeric) không thuộc BVA. Bỏ stress test boundaries (255/1000/10000 chars) — SPEC/CODE không định nghĩa Max cho name length. Bỏ TC ngoài 7-point BVA cho id (negative, far out, non-numeric)." | `05_bva_testcases_v1.md`: name Create 7→4 TCs (Min-1, Min, Min+1, Nominal). name Update giữ 4 TCs. id URL param 8→7 TCs (7-point BVA chuẩn). Tổng: 26→**15 TCs**. |
| 20 | 2026-06-27 10:11 | Claude Code (Opus 4.6) | **Review round 1 — 06_detailed_testcases v0→v1:** "DT-C-006 (trùng tên) và DT-C-012 (update trùng) expected phải là 400/409 Conflict, không phải 200 OK. id invalid chỉ test DELETE mà thiếu PUT — thêm 7 TC cho PUT id validation (DT-C-022→028). Expected Result phải dựa trên SPEC, không đọc CODE." | `06_detailed_testcases_v1.md`: sửa 3 expected results (duplicate → reject). Thêm 7 DT cho PUT id + 1 DT cho DELETE script tag. Domain 26→33 TCs. Tổng: 48→**54 TCs** (33 DT + 15 BVA + 7 UI). |


### Feature D — D5 Shopping Cart (skill-based pipeline + review)

| # | Date & Time | Tool | Prompt (summary) | Output (summary) |
| --- | --- | --- | --- | --- |
| 22 | 2026-06-27 10:12 | Claude Code (Opus 4.6) | **Init pipeline:** Áp dụng skill domain-bva-testing cho feature_D (D5 Shopping Cart). Chạy full pipeline: spec analysis → domain table → domain TCs → BVA table → BVA TCs → detailed TCs. | `01_spec_analysis.md`: 5 sub-flows (thêm từ card, thêm từ detail, xem giỏ, chỉnh qty, xóa) + Checkout. `02_domain_table.md`: quantity (Product Detail + Cart Inline Edit) + product + cart state. `03_domain_testcases.md`: 27 Domain TCs. `04_bva_table.md` (v0): quantity 7-point BVA + stress boundaries. `05_bva_testcases.md`: 14 BVA TCs. `06_detailed_testcases.md` (v0): 41 TCs tổng hợp (27 DT + 14 BVA). |
| 23 | 2026-06-27 10:12 | Claude Code (Opus 4.6) | **Review round 1 — 01_spec_analysis v0→v1:** "Bỏ sub-flow Thanh toán (Checkout) — ngoài scope feature_D, thuộc FR-08 backend API riêng. Giữ 4 sub-flow: Thêm vào giỏ (card + detail), Xem giỏ, Chỉnh qty, Xóa." | `01_spec_analysis_v1.md`: xóa sub-flow 1.6 Checkout cùng state/constraint/dependency liên quan. Discrepancy table 7→5 mục. Scope: 5→4 sub-flows. |
| 24 | 2026-06-27 10:12 | Claude Code (Opus 4.6) | **Review round 1 — 03_domain_testcases v0→v1:** "DT-D-014 (cart inline edit qty=0) expected sai — fallback về 1 không đúng business rule. Theo Shopee/Lazada, qty=0 = user không muốn mua → item bị xóa." | `03_domain_testcases_v1.md`: DT-D-014 expected đổi từ "quantity fallback = 1" → "Item bị xóa khỏi giỏ hàng". |
| 25 | 2026-06-27 10:12 | Claude Code (Opus 4.6) | **Review round 1 — 04_bva_table v0→v1:** "Tên boundary tự đặt 'High (stress)', 'Very high (stress)', 'Extreme (stress)' không đúng thuật ngữ 7-point BVA chuẩn ISTQB. Sửa thành Max-1/Max/Max+1 với Max=999 (representative). Bỏ Supplementary — categorical values đã cover ở Domain TCs." | `04_bva_table_v1.md`: boundary #5→Max-1 (998), #6→Max (999), #7→Max+1 (1000). Xóa toàn bộ section Supplementary (Non-BVA). |
| 26 | 2026-06-27 10:12 | Claude Code (Opus 4.6) | **Review round 1 — 06_detailed_testcases v0→v1:** "Bỏ DT-D-011/012 (A2) — lặp lại cùng bug `parsed+1` với DT-D-010, BVA B2 đã cover đủ boundary. Bỏ DT-D-026 (nhãn cosmetic) và DT-D-027 (trùng DT-D-021 empty state)." | `06_detailed_testcases_v1.md`: Domain 27→23 TCs, A2 count 7→5, A4 count 8→6. Tổng: 41→**37 TCs**. |
