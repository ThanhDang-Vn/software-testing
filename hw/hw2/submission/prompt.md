# Prompt 1:  

You are a software testing analyst. Your task is to perform ONLY SPECIFICATION ANALYSIS for the given feature. DO NOT generate any test cases.

## CONTEXT

I selected 4 features from different pools:

- Pool A: FR-02 Login and account lockout
- Pool B: FR-11 Order history view (user)
- Pool C: FR-14 Category management (CRUD)
- Pool D: D5 Mobile – Shopping cart

Now start with feature_A.

## STRICT RULES

* DO NOT generate test cases
* DO NOT perform Boundary Value Analysis yet
* Focus ONLY on requirement/specification analysis
* Use structured Markdown tables (no free-text dump)
* Clearly distinguish:

  * Constraints from specification
  * Constraints inferred from source code (if needed)

## TASKS

### 1. Functional Description

* Describe what the feature does
* Main business flow (step-by-step)

### 2. Input Field Analysis

List ALL input fields in a table:

| Field Name | Data Type | Required | Validation Rules | Valid Domain | Invalid Domain | Source (Spec/Code) |

For each field, include:

* Data type (string, int, email, etc.)
* Required / Optional
* Length constraints (min/max)
* Format (regex if applicable)
* Allowed characters
* Business rules (e.g., unique email)
* Explicit VALID and INVALID domains

### 3. Field Dependencies

* Identify relationships between fields
* Use table:

| Field A | Field B | Dependency Type | Condition | Description |

Examples:

* password vs confirm password
* coupon code vs expiration date


## OUTPUT FORMAT

* Use Markdown
* Clear section headings:

  * 1. Functional Description
  * 2. Input Fields
  * 3. Dependencies
* Tables are mandatory where applicable

## OUTPUT FILE

Write the result as content for:
report/feature_A/01_spec_analysis.md

# Promp 2: 

Áp dụng DOMAIN TESTING cho feature_A theo đúng quy trình đã học. Làm 2 bước con
rồi dừng.

STEP 1 — Identify Input Fields. Lập bảng:

| # | Field Name | Required? | Source of Constraint (Spec/Code) | Related FR |

STEP 2 — Domain Table. Với MỖI field, lập bảng:

| Field Name | Data Type | Valid Domain | Valid EC ID | Invalid Domain | Invalid EC ID | Edge Constraints (null/length/format/special) | Notes |

Yêu cầu:
- Định nghĩa rõ valid và invalid domain.
- Xác định equivalence class cho cả valid lẫn invalid, đánh ID (VD: EC-V1, EC-I1).
- KHÔNG đưa giá trị biên (boundary) vào bảng này — để dành cho STEP 4 (BVA).
- Giải thích vì sao phân lớp như vậy.

Ghi vào: report/feature_A/02_domain_table.md
Chưa sinh test case. Dừng chờ review.

# Prompt 3: 

Tiếp tục Domain Testing — STEP 3: thiết kế DOMAIN TEST CASES cho feature_A dựa
trên các equivalence class ở STEP 2.

Bảng:

| Test Case ID | Field | EC ID | Type (Positive/Negative) | Input Value | Expected Result |

Yêu cầu:
- Phủ TẤT CẢ equivalence class (cả valid và invalid).
- Áp dụng nguyên tắc "một biến sai tại một thời điểm" cho lớp invalid: biến đang
  test lấy giá trị invalid, các biến còn lại giữ giá trị hợp lệ.
- Bao gồm cả positive và negative case.
- ID dạng DT-A-001.
- Giải thích ngắn gọn mỗi test case map về EC ID nào.
- Bổ sung test case nếu cần để phủ kỹ (đề khuyến khích).

Ghi vào: report/feature_A/03_domain_testcases.md
Dừng chờ review.

# Prompt 4: 
Chuyển sang BOUNDARY VALUE ANALYSIS cho feature_A — STEP 4: xác định biên.

Với MỖI field có miền giá trị ordered (số / độ dài chuỗi / ngày / số lượng),
lập bảng 6 điểm biên (3-value BVA cho mỗi đầu biên):

| Field | Boundary Type (Numeric/Length/Date) | Min-1 | Min | Min+1 | Nominal | Max-1 | Max | Max+1 | If N/A — Reason |

Yêu cầu:
- Định nghĩa rõ biên numeric hay length.
- Field nào không áp dụng BVA thì ghi lý do ở cột cuối.
- Lưu ý các biên ngầm: chuỗi rỗng, 0, độ dài tối đa, tràn số, đầu/cuối danh sách.
- Giải thích vì sao chọn các điểm biên đó.

Ghi vào: report/feature_A/04_bva_table.md
Chưa sinh test case. Dừng chờ review.

# Prompt 5: 
Tiếp tục BVA — STEP 5: chuyển bảng biên thành BVA TEST CASES cho feature_A.

Bảng:

| Test Case ID | Field | Value Type (Min-1/Min/Min+1/Max-1/Max/Max+1) | Input | Expected Result |

Yêu cầu:
- Mỗi điểm biên (Min-1, Min, Min+1, Max-1, Max, Max+1) là một test case; các biến
  khác giữ giá trị hợp lệ điển hình.
- ID dạng BVA-A-001.
- Bổ sung biên đặc biệt: chuỗi rỗng, độ dài max+1, số 0, số âm, ký tự đặc biệt /
  Unicode tiếng Việt, overflow.
- Giải thích kỳ vọng tại mỗi biên, đặc biệt chỗ ranh giới valid/invalid.

Ghi vào: report/feature_A/05_bva_testcases.md
Dừng chờ review.

# Prompt 6: 
STEP 6 — Gộp toàn bộ test case (Domain + BVA) của feature_A thành bảng chi tiết
đầy đủ để chuẩn bị thực thi:

| Test Case ID | Description | Pre-condition | Steps | Test Data | Expected Result | Actual Result | Status (Pass/Fail/Blocked/Not Executed) |

Yêu cầu:
- Mỗi test case có đủ pre-condition, các bước cụ thể, dữ liệu test.
- Cột Actual Result và Status để trống — sẽ điền khi thực thi ở bước sau.
- Giữ nguyên các Test Case ID đã đặt (DT-A-xxx, BVA-A-xxx).

Ghi vào: report/feature_A/06_detailed_testcases.md
Dừng chờ review.

# Prompt 7: 
Bây giờ THỰC THI test cho feature_A.

1. Hướng dẫn tôi chạy EShop local
2. Với mỗi test case ở bảng chi tiết hướng dẫn tôi:
   Actual Result + Status (Pass/Fail/Blocked/Not Executed) vào bảng STEP 6.

Cập nhật file: report/feature_A/07_execution.md (bảng execution có Actual + Status)
Dừng chờ review.

# Prompt 8: 

STEP 7 — Từ các test FAIL của feature_A, viết BUG REPORT chuẩn để (a) đưa vào báo
cáo và (b) tạo GitHub Issue.

Bảng:

| Bug ID | Title | Severity | Priority | Pre-condition | Steps to Reproduce | Actual Result | Expected Result | Related TC ID | Screenshot | GitHub Issue Link |

Yêu cầu:
- ID dạng BUG-A-001.
- Steps to Reproduce đánh số rõ ràng.
- Cột Screenshot ghi tên file ảnh trong screenshots/ (tôi sẽ đính kèm).
- Sau bảng, soạn sẵn nội dung text để tôi paste lên GitHub Issues cho từng bug
  (title + body markdown). Nhắc tôi đính kèm screenshot vào mỗi issue.

Ghi vào: report/feature_A/08_bug_report.md
Dừng chờ review.

# Prompt 9: 

Tạo commit giúp tôi 

# Prompt 10: 

Tạo file readme 
