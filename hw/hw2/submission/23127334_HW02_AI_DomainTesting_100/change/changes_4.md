# Changes Log — feature_D

---

## 06_detailed_testcases: v0 → v1

**File:** `06_detailed_testcases.md` → `06_detailed_testcases_v1.md`

**Reason:** v0 tổng hợp từ domain TCs (27) + BVA (14) = 41 TC. Sau khi execution cho thấy DT-D-011 và DT-D-012 chỉ lặp lại cùng một bug với DT-D-010, và DT-D-026/DT-D-027 đã bị loại ở các bước trước, file này cần đồng bộ để phản ánh suite 37 TC thực tế được thực thi.

**Changes:**
- **Removed DT-D-011, DT-D-012** (A2): lặp lại bug `parsed+1`, BVA B2 đã cover đủ các boundary
- **Removed DT-D-026** (A4): nhãn "Tổng cộng" — bug đã loại khỏi report v1
- **Removed DT-D-027** (A4): empty state duplicate — trùng DT-D-021
- **Updated** source note: 27 TCs → 23 TCs
- **Updated** Summary table: 41 → 37 TC tổng; A2 count 7→5, A4 count 8→6

---

## 07_execution: v0 → v1

**File:** `07_execution.md` → `07_execution_v1.md`

**Reason:** v0 có nhiều domain TC cùng kiểm tra một bug duy nhất (off-by-one `parsed+1`) và hai TC trùng lặp về UI — DT-D-026 (nhãn) đã bị loại khỏi bug report v1, DT-D-027 (empty state) trùng với DT-D-021. Lược bỏ để suite gọn hơn, không redundant, mỗi bug chỉ cần một TC đại diện.

**Changes:**
- **Removed DT-D-011, DT-D-012** (A2): cùng bug `parsed+1` với DT-D-010 — BVA B2 đã cover đủ các boundary cho bug này
- **Removed DT-D-026** (A4): nhãn "Tổng tạm tính" — tương ứng BUG-D-005 đã loại khỏi bug report v1
- **Removed DT-D-027** (A4): empty state duplicate — nội dung trùng DT-D-021
- **Updated** Summary: Domain 27→23 TC, Fail 10→6, Total 41→37, Pass Rate 58.5%→64.9%
- **Updated** OBS-D-01: scope 9→7 TCs (bỏ DT-D-011, DT-D-012)
- **Updated** OBS-D-04: scope 4→2 TCs (bỏ DT-D-026, DT-D-027)

---

## 08_bug_report: v0 → v1

**File:** `08_bug_report.md` → `08_bug_report_v1.md`

**Reason:** BUG-D-005 (nhãn sai) và BUG-D-006 (empty state thiếu hình) chỉ là lỗi cosmetic mức Low — không ảnh hưởng đến logic hay data của giỏ hàng. Loại bỏ để report tập trung vào các bugs có impact thực sự đến user experience và tính đúng đắn của dữ liệu.

**Changes:**
- **Removed BUG-D-005** (nhãn "Tổng tạm tính" thay vì "Tổng cộng") — Low severity, cosmetic
- **Removed BUG-D-006** (empty state thiếu hình minh họa) — Low severity, cosmetic
- **Updated** Bug Summary: 6 → 4 bugs, bỏ row Low
- **Updated** Root Cause Analysis: "UI implementation không đúng SPEC" từ 3 bugs → 1 bug (chỉ còn BUG-D-004)

---

## 04_bva_table: v0 → v1

**File:** `04_bva_table.md` → `04_bva_table_v1.md`

**Reason:** v0 dùng tên tự đặt "High (stress)", "Very high (stress)", "Extreme (stress)" cho 3 điểm cuối — không đúng thuật ngữ 7-point BVA chuẩn (ISTQB). Sửa lại thành Max-1 / Max / Max+1 với Max đại diện = 999 vì SPEC và CODE không định nghĩa giới hạn trên. Đồng thời bỏ phần Supplementary vì các categorical values đã cover ở Step 3, không cần liệt kê lại.

**Changes:**
- **Updated Field 1 & 2:** Boundary #5 "High (stress)" → `Max-1` (value=998), #6 "Very high (stress)" → `Max` (value=999), #7 "Extreme (stress)" → `Max+1` (value=1000)
- **Removed:** Toàn bộ section Supplementary (Non-BVA — Categorical)

---

## 03_domain_testcases: v0 → v1

**File:** `03_domain_testcases.md` → `03_domain_testcases_v1.md`

**Reason:** v0 định nghĩa expected result của DT-D-014 (cart inline edit qty=0) là "fallback về 1" — nhưng theo business rule thực tế (tương tự Shopee, Lazada), nhập 0 có nghĩa user không muốn mua nữa nên item phải bị xóa. Expected result cần phản ánh đúng hành vi mong đợi theo spec, không phải theo code hiện tại.

**Changes:**
- **Updated DT-D-014** (EC-QE-I2): Expected result đổi từ "quantity fallback = 1" → "Item bị xóa khỏi giỏ hàng"

---

## 01_spec_analysis: v0 → v1

**File:** `01_spec_analysis.md` → `01_spec_analysis_v1.md`

**Reason:** v0 bao gồm cả sub-flow Thanh toán (Checkout) nhưng feature_D chỉ tập trung vào các thao tác giỏ hàng (thêm, xem, chỉnh, xóa). Checkout liên quan đến FR-08 và backend API riêng — nếu giữ lại sẽ làm scope bị phình ra ngoài phạm vi được giao.

**Changes:**
- **Removed:** Sub-flow 1.6 — Thanh toán (Checkout) cùng toàn bộ state, constraint, dependency và discrepancy liên quan
- **Updated:** Đánh số lại discrepancy table từ 7 mục xuống còn 5 mục
- **Scope sau v1:** 4 sub-flow — Thêm vào giỏ (1.1, 1.2), Xem giỏ (1.3), Chỉnh số lượng (1.4), Xóa (1.5)
