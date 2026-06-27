# STEP 4 — BVA Table: FR-07 Mobile Shopping Cart (feature_D)

> **Nguyên tắc:** BVA chỉ áp dụng cho ordered domains (numeric). Categorical values (chuỗi rỗng, ký tự không phải số, object structure, UI label) KHÔNG phải BVA → đã cover ở Domain Testing (Step 3).

---

## BVA Boundaries

### Field 1: `quantity` (Product Detail — Add to Cart)

> **Boundary source:** `normalizeQuantity()` tại App.js:129–132 — `parseInt(value, 10)`: nếu > 0 → dùng; else → 1.
> Min = 1 (giá trị dương nhỏ nhất được chấp nhận). Max = không định nghĩa (SPEC + CODE không giới hạn).

| # | Boundary | Value | Expected Behavior | Rationale |
| --- | --- | --- | --- | --- |
| 1 | Min-1 | `0` | Fallback quantity = 1. Không hiển thị lỗi. | Dưới ngưỡng — normalizeQuantity reject → fallback 1 |
| 2 | Min | `1` | quantity = 1. Alert "Đã thêm vào giỏ hàng". | Biên dưới hợp lệ nhỏ nhất |
| 3 | Min+1 | `2` | quantity = 2. Alert thành công. | Trên biên dưới — hoạt động bình thường |
| 4 | Nominal | `5` | quantity = 5. Alert thành công. | Giá trị thông thường giữa domain |
| 5 | High (stress) | `100` | quantity = 100. Alert thành công. | Giá trị lớn thường gặp |
| 6 | Very high (stress) | `999` | quantity = 999. Alert thành công. | Stress — không có max giới hạn |
| 7 | Extreme (stress) | `9999` | quantity = 9999 hoặc lỗi UI overflow. | Cực đại thực tế — kiểm tra giới hạn render |

> **Lưu ý:** Không có Max boundary từ SPEC hay CODE. Các điểm 5–7 là stress test boundaries.

---

### Field 2: `quantity` (Cart Inline Edit)

> **Boundary source:** `onChangeText` tại App.js:617–621 — `parseInt(text, 10)`: nếu > 0 → **parsed + 1** (BUG); else → 1.
> Min hợp lệ để được xử lý = 1 (parsed > 0). Min-1 = 0 → theo SPEC đề xuất: xóa item khỏi giỏ.
> Max = không định nghĩa.

| # | Boundary | Value | Expected Behavior | Rationale |
| --- | --- | --- | --- | --- |
| 1 | Min-1 | `0` | Item bị xóa khỏi giỏ hàng (SPEC đề xuất). | Biên đặc biệt — quantity = 0 đồng nghĩa không mua |
| 2 | Min | `1` | quantity trong cart = 1. Tổng tiền cập nhật. | Biên dưới hợp lệ nhỏ nhất |
| 3 | Min+1 | `2` | quantity trong cart = 2. Tổng tiền cập nhật. | Trên biên dưới |
| 4 | Nominal | `5` | quantity trong cart = 5. Tổng tiền cập nhật. | Giá trị thông thường |
| 5 | High (stress) | `100` | quantity trong cart = 100. Tổng tiền cập nhật. | Giá trị lớn thường gặp |
| 6 | Very high (stress) | `999` | quantity trong cart = 999. Tổng tiền cập nhật. | Stress — không có max giới hạn |
| 7 | Extreme (stress) | `9999` | quantity = 9999 hoặc lỗi UI overflow. | Cực đại thực tế |

> **Lưu ý off-by-one BUG:** Với mọi giá trị > 0, CODE thực thi `parsed + 1`. Actual result sẽ luôn = input + 1. BVA vẫn dùng SPEC-based expected (không bù trừ bug vào expected).

---

## Supplementary (Non-BVA — Categorical)

> Các giá trị sau là categorical/format — không phải ordered boundary. Đã được cover ở Step 3 (DT).

| Field | Category | Value | Expected Behavior | TC đã cover |
| --- | --- | --- | --- | --- |
| quantity (Product Detail) | Chuỗi rỗng | `""` | Fallback 1 | DT-D-005 |
| quantity (Product Detail) | Số âm | `"-5"` | Fallback 1 | DT-D-007 |
| quantity (Product Detail) | Non-numeric | `"abc"` | Fallback 1 | DT-D-008 |
| quantity (Product Detail) | Thập phân | `"2.7"` | parseInt → 2 | DT-D-009 |
| quantity (Cart Inline Edit) | Chuỗi rỗng | `""` | Fallback 1 | DT-D-013 |
| quantity (Cart Inline Edit) | Số âm | `"-3"` | Fallback 1 | DT-D-015 |
| quantity (Cart Inline Edit) | Non-numeric | `"xyz"` | Fallback 1 | DT-D-016 |
| product (addToCart) | Object hợp lệ, đã có | id trùng | Tăng quantity | DT-D-018 |
| Cart state | Empty cart | 0 items | Empty state UI | DT-D-021 |

---

## Summary

| Field | BVA Points | Boundary Type |
| --- | --- | --- |
| quantity (Product Detail) | 7 | Code boundary (min=1 từ normalizeQuantity), stress max |
| quantity (Cart Inline Edit) | 7 | Code boundary (min=1, min-1=0→remove), stress max |
| **Total BVA points** | **14** | |
| Supplementary (non-BVA) | 9 | Categorical — đã cover ở Step 3 |
