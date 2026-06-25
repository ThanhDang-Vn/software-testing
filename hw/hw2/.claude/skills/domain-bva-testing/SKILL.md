# Skill: Domain Testing & BVA Pipeline

## Metadata

- **Name:** domain-bva-testing
- **Description:** Quy trình hoàn chỉnh Domain Testing + Boundary Value Analysis theo ISTQB, từ spec analysis đến gap analysis. Xuất Markdown artifacts sẵn cho báo cáo.
- **Trigger:** Khi user yêu cầu thực hiện domain testing / BVA / phân tích miền cho một feature cụ thể. Ví dụ: "chạy domain testing cho feature_B", "phân tích FR-11", "áp dụng skill domain-bva lên feature_C".
- **Input:** Tên feature (`feature_X`), FR ID (ví dụ `FR-11`), đường dẫn source code liên quan.
- **Output:** 8 file Markdown trong `submission/report/feature_X/` + `changes.md`.

---

## Quy trình 8 bước

> **Nguyên tắc bắt buộc:**
> - Mỗi step tạo ĐÚNG 1 file → dừng → chờ user review.
> - KHÔNG chạy step tiếp khi chưa được user approve.
> - Sau mỗi review, user có thể yêu cầu sửa → tạo file `_v1` (bản sửa lỗi).
> - Mọi thay đổi v0 → v1 ghi vào `changes.md`.
> - Expected result viết theo **CODE behavior** (actual implementation), ghi rõ khi khác SPEC.

---

### STEP 1 — Spec Analysis (`01_spec_analysis.md`)

**Mục tiêu:** Đọc spec (SRS) + đọc code → phân tích đặc tả chi tiết. KHÔNG sinh test case.

**Cách làm:**
1. Đọc requirement trong `README.md` (FR-xx liên quan).
2. Đọc source code backend (endpoint, DB schema, business logic).
3. Đọc source code frontend (form, validation, UI elements).
4. Tạo file với 3 sections:

**Section 1 — Functional Description:**

```markdown
## 1. Functional Description

### Main Business Flow

| Step | Actor | Action | System Response |
| --- | --- | --- | --- |
| 1 | ... | ... | ... |
```

- Liệt kê từng bước flow chính + sub-flow (nếu có).
- Ghi rõ `[CODE-BE]`, `[CODE-FE]`, `[SPEC]` cho mỗi behavior.

**Section 2 — Input Fields:**

```markdown
## 2. Input Fields

### 2.1 Direct Input Fields

| Field Name | Data Type | Required | Validation Rules | Valid Domain | Invalid Domain | Source |
| --- | --- | --- | --- | --- | --- | --- |

### 2.2 State Variables

| Field Name | Data Type | Default | Domain | Description | Source |
| --- | --- | --- | --- | --- | --- |

### 2.3 Implicit Constraints

| Constraint | Description | SPEC | CODE | Match? |
| --- | --- | --- | --- | --- |
```

- Direct inputs = user nhập trực tiếp.
- State variables = server-side, ảnh hưởng behavior nhưng user không nhập.
- Implicit constraints = so sánh SPEC vs CODE, đánh dấu Match/Mismatch.

**Section 3 — Field Dependencies:**

```markdown
## 3. Field Dependencies

| Field A | Field B | Dependency Type | Condition | Description |
| --- | --- | --- | --- | --- |
```

- Các loại: Sequential, Lookup, Threshold, Priority, Reset, Calculation.

**Output:** `submission/report/feature_X/01_spec_analysis.md`

---

### STEP 2 — Domain Table (`02_domain_table.md`)

**Mục tiêu:** Xác định input fields + phân hoạch miền giá trị thành Equivalence Classes (EC). KHÔNG có BVA, KHÔNG có test case.

**Cách làm:**
1. Từ 01_spec_analysis, liệt kê tất cả input fields (direct + state).
2. Cho mỗi field, tạo bảng EC:

```markdown
## STEP 1 — Identify Input Fields

| # | Field Name | Required? | Source of Constraint | Related FR |
| --- | --- | --- | --- | --- |

## STEP 2 — Domain Table

### Field 1: `field_name`

| Attribute | Detail |
| --- | --- |
| **Data Type** | ... |
| **Required** | ... |
| ... | ... |

**Equivalence Classes:**

| EC ID | Type | Domain Description | Representative Value | Rationale |
| --- | --- | --- | --- | --- |
| EC-XX-V1 | Valid | ... | ... | ... |
| EC-XX-I1 | Invalid | ... | ... | ... |
```

**Quy tắc EC ID:**
- Format: `EC-{Field abbreviation}-{V/I}{number}`
- Ví dụ: `EC-E-V1` (Email Valid 1), `EC-P-I3` (Password Invalid 3)

**Phân biệt rõ:**
- **Input domain partition** = đặc điểm data (format, length, empty, type)
- **Behavioral partition** = phản hồi hệ thống (case-sensitive, DB lookup, trim)
- Mỗi EC phải có Rationale giải thích tại sao tách riêng.

**Output:** `submission/report/feature_X/02_domain_table.md`

---

### STEP 3 — Domain Test Cases (`03_domain_testcases.md`)

**Mục tiêu:** Sinh test case từ EC. Mỗi EC ít nhất 1 TC. Áp dụng one-at-a-time cho invalid.

**Cách làm:**

```markdown
## 1. Equivalence Classes Summary

(Tổng hợp lại EC từ 02, dùng EC ID đơn giản: EC-E1, EC-P2, EC-S3...)

## 2. Domain Test Matrix

| TC | Biến test | EC tested | Field1 | Field2 | ... | Loại |
| --- | --- | --- | --- | --- | --- | --- |

## 3. Domain Test Case Details

| Test Case ID | Field | EC ID | Type | Input Value | Expected Result |
| --- | --- | --- | --- | --- | --- |

## 4. EC Coverage Mapping

| EC ID | Covered by TC | Notes |
| --- | --- | --- |
```

**Quy tắc:**
- TC ID format: `DT-{feature letter}-{3 digits}` (ví dụ: `DT-B-001`)
- One-at-a-time: khi test 1 biến invalid, giữ các biến khác ở valid default.
- Supplementary TCs (kết hợp nhiều biến) đặt riêng section, ghi rõ violates one-at-a-time.
- Cross-check: đếm EC coverage phải = 100%.
- **QUAN TRỌNG:** Khi renumber EC, cross-check KHÔNG được drop bất kỳ EC nào.

**Output:** `submission/report/feature_X/03_domain_testcases.md`

---

### STEP 4 — BVA Table (`04_bva_table.md`)

**Mục tiêu:** Xác định boundary values cho các field có ordered domain. KHÔNG sinh test case.

**Cách làm:**

```markdown
## BVA Boundaries

### Field: `field_name`

| # | Boundary | Value | Expected Behavior | Rationale |
| --- | --- | --- | --- | --- |
| 1 | Min-1 | ... | ... | ... |
| 2 | Min | ... | ... | ... |
| 3 | Min+1 | ... | ... | ... |
| 4 | Nominal | ... | ... | ... |
| 5 | Max-1 | ... | ... | ... |
| 6 | Max | ... | ... | ... |
| 7 | Max+1 | ... | ... | ... |
```

**Quy tắc:**
- Chỉ áp dụng cho ordered domains (numeric, length, time).
- Categorical values (format, encoding) KHÔNG phải BVA → để ở Supplementary.
- Ghi rõ boundary là "spec boundary" hay "implementation boundary" (code enforce hay không).
- 3-value BVA: Min-1, Min, Min+1, Max-1, Max, Max+1 + Nominal.

**Output:** `submission/report/feature_X/04_bva_table.md`

---

### STEP 5 — BVA Test Cases (`05_bva_testcases.md`)

**Mục tiêu:** Chuyển boundary values thành concrete test cases.

**Cách làm:**

```markdown
## BVA Test Cases

### {Category} Boundaries

| Test Case ID | Boundary Type | Input Value | Length/Value | Expected Result |
| --- | --- | --- | --- | --- |
| BVA-X-001 | Min (empty) | ... | 0 | ... |

### Supplementary Tests (non-BVA)

> Các TC dưới đây test categorical values, không phải boundary values.

| Test Case ID | Category | Input Value | Expected Result |
| --- | --- | --- | --- |
```

**Quy tắc:**
- TC ID format: `BVA-{feature letter}-{3 digits}` (ví dụ: `BVA-B-001`)
- Nominal case gộp: 1 TC cover nominal cho nhiều fields (giảm trùng lặp).
- Non-BVA categorical tests đặt cuối, ghi disclaimer rõ ràng.
- Ghi Gaps & Assumptions ở cuối file.

**Output:** `submission/report/feature_X/05_bva_testcases.md`

---

### STEP 6 — Detailed Test Cases (`06_detailed_testcases.md`)

**Mục tiêu:** Gộp Domain + BVA + UI test cases thành bảng chi tiết đầy đủ, sẵn sàng thực thi.

**Cách làm:**

```markdown
## A. Domain Test Cases — Chi tiết (N TC)

| Test Case ID | Description | Pre-condition | Steps | Test Data | Expected Result | Actual Result | Status |
| --- | --- | --- | --- | --- | --- | --- | --- |

## B. BVA Test Cases — Chi tiết (N TC)

(Chia sub-sections theo boundary category)

| Test Case ID | Description | Pre-condition | Steps | Test Data | Expected Result | Actual Result | Status |
| --- | --- | --- | --- | --- | --- | --- | --- |

## C. UI Validation Test Cases (nếu có FR liên quan UI)

| Test Case ID | Description | Pre-condition | Steps | Test Data | Expected Result | Actual Result | Status |
| --- | --- | --- | --- | --- | --- | --- | --- |

## Thống kê

| Nhóm | Số TC | ID Range | Source |
| --- | --- | --- | --- |
```

**Quy tắc:**
- UI TC ID format: `UI-{feature letter}-{3 digits}` (ví dụ: `UI-B-001`)
- Actual Result và Status để trống (điền ở STEP 7).
- Kiểm tra UI requirements (FR-21, FR-22, FR-24...) từ spec → tạo UI TCs.
- Trace mỗi TC về source file gốc (03 hoặc 05).

**Output:** `submission/report/feature_X/06_detailed_testcases.md`

---

### STEP 7 — Test Execution & Bug Report (`07_execution.md`, `08_bug_report.md`)

**Mục tiêu:** Thực thi toàn bộ TC, ghi kết quả, viết bug report cho FAIL TCs.

**07_execution.md:**

```markdown
## A. Domain Test Cases — Execution (N TC)

| TC ID | Description | Expected | Actual Result | Status |
| --- | --- | --- | --- | --- |

## B. BVA Test Cases — Execution (N TC)

(Sub-sections theo category)

## C. UI Validation — Execution (N TC)

## D. Execution Summary

| Category | Total | Pass | Fail | Blocked | Not Executed |
| --- | --- | --- | --- | --- | --- |

## E. Observations & Known Issues

### OBS-01: ...
```

**08_bug_report.md:**

```markdown
## A. Bug Report Table

| Bug ID | Title | Severity | Priority | Pre-condition | Steps to Reproduce | Actual Result | Expected Result | Related TC ID | Screenshot | GitHub Issue Link |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |

## B. GitHub Issue Templates

(Mỗi bug 1 block markdown sẵn sàng paste)
```

**Quy tắc:**
- Bug ID format: `BUG-{feature letter}-{3 digits}`
- API tests dùng `curl` (bypass frontend validation).
- UI tests dùng browser + DevTools inspect.
- Pass Rate KHÔNG nên 100% — nếu tất cả pass, kiểm tra lại expected results.
- Observations ghi các phát hiện ngoài scope test case (security, performance...).

**Output:** `07_execution.md` + `08_bug_report.md`

---

### STEP 8 — Gap Analysis (`09_gap_analysis.md`)

**Mục tiêu:** Tự đánh giá AI bỏ sót gì, phân loại nguyên nhân, bổ sung TC.

**Cách làm:**

```markdown
## A. Gap Analysis Table

| Gap ID | Missed Item | Cause Type | Detailed Explanation | Added TC ID |
| --- | --- | --- | --- | --- |

## B. Assumptions AI Made

| # | Assumption | Confidence | Risk if Wrong |
| --- | --- | --- | --- |

## C. Cause Type Distribution

| Cause Type | Count | Gap IDs | Pattern |
| --- | --- | --- | --- |

## D. Test Cases Bổ Sung

(Bảng TC mới, ghi rõ thêm vào file 03 hay 05)

## E. Summary

| Metric | Value |
| --- | --- |
```

**3 Cause Types:**
- **Prompt Quality** — prompt không rõ ràng / thiếu scope → AI tự giới hạn.
- **AI Limitation** — AI thiếu khả năng cross-check, bỏ sót edge case, giả định sai.
- **Feature Complexity** — logic phức tạp vượt ngoài domain testing truyền thống.

**Quy tắc:**
- Nghiêm khắc — tìm điểm yếu, không tự khen.
- Rà lại spec + code lần cuối để tìm TC bị thiếu.
- TC bổ sung thêm vào file 03 hoặc 05 tương ứng.

**Output:** `submission/report/feature_X/09_gap_analysis.md`

---

## Quy trình chạy end-to-end (Hướng dẫn demo)

### Chuẩn bị

```
User: Chạy skill domain-bva-testing cho feature_B (FR-11 Order History)
       Source: group05_eshop/backend/server.js (order endpoints)
```

### Chạy

```
Step 1: AI đọc spec + code → tạo 01_spec_analysis.md → DỪNG
User:   Review → approve hoặc yêu cầu sửa → AI tạo v1 + ghi changes.md

Step 2: AI tạo 02_domain_table.md → DỪNG
User:   Review → approve

Step 3: AI tạo 03_domain_testcases.md → DỪNG
User:   Review → approve

Step 4: AI tạo 04_bva_table.md → DỪNG
User:   Review → approve

Step 5: AI tạo 05_bva_testcases.md → DỪNG
User:   Review → approve

Step 6: AI tạo 06_detailed_testcases.md → DỪNG
User:   Review → approve

Step 7: AI thực thi test → tạo 07_execution.md + 08_bug_report.md → DỪNG
User:   Review → approve

Step 8: AI tạo 09_gap_analysis.md → DỪNG → FEATURE HOÀN TẤT
```

### Kết quả

```
submission/report/feature_B/
├── 01_spec_analysis.md
├── 02_domain_table.md
├── 03_domain_testcases.md      (+ _v1 nếu có review sửa)
├── 04_bva_table.md
├── 05_bva_testcases.md
├── 06_detailed_testcases.md
├── 07_execution.md
├── 08_bug_report.md
├── 09_gap_analysis.md
└── changes.md
```

### Ví dụ lệnh chạy

```
# Bắt đầu feature mới
User: "Áp dụng skill domain-bva-testing cho feature_C (FR-14 Category CRUD).
       Backend: server.js dòng XX-YY. Frontend: admin/CategoryPage.jsx."

# AI tự động bắt đầu STEP 1, đọc code, tạo spec analysis, dừng chờ review.

# Tiếp tục sau review
User: "approved, tiếp step 2"

# Nếu cần sửa
User: "EC-C-I3 sai rationale, sửa lại" → AI sửa, tạo v1, ghi changes.md
```

---

## Lưu ý quan trọng

1. **Không bao giờ chạy 2 steps liên tiếp** mà không có user review ở giữa.
2. **Cross-check EC coverage** sau mỗi step 3 — đếm lại, không được drop EC.
3. **Expected result theo CODE**, ghi chú `(SPEC: ...)` khi khác.
4. **UI test cases** kiểm tra FR-21/FR-22/FR-24 nếu feature có UI component.
5. **changes.md** cập nhật mỗi lần có v0 → v1, format: Review Issues → Changes Applied.
6. **Không tự khen** trong gap analysis — mục tiêu là tìm điểm yếu.
