# STEP 8 — Bug Report: FR-07 Mobile Shopping Cart (feature_D) (v1)

---

## A. Bug Report Table

| Bug ID    | Title                                                                    | Severity | Priority | Pre-condition          | Steps to Reproduce                                                                         | Actual Result                                                   | Expected Result                                 | Related TC ID                                       | Screenshot |
| --------- | ------------------------------------------------------------------------ | -------- | -------- | ---------------------- | ------------------------------------------------------------------------------------------ | --------------------------------------------------------------- | ----------------------------------------------- | --------------------------------------------------- | ---------- |
| BUG-D-001 | Off-by-one trong cart inline edit — nhập N → quantity = N+1              | High     | High     | Cart có ít nhất 1 item | 1. Vào trang cart 2. Đổi ô quantity của item thành `"2"` 3. Quan sát quantity và tổng tiền | quantity = **3** (parsed+1). Tổng tiền tính sai theo.           | quantity = 2. Tổng tiền cập nhật đúng.          | DT-D-010, DT-D-011, DT-D-012, BVA-D-009→BVA-D-014 | `screenshots/BUG-D-001-before.png` · `screenshots/BUG-D-001.png` |
| BUG-D-002 | Cart inline edit qty=0 không xóa item — fallback về 1 thay vì remove     | Medium   | Medium   | Cart có ít nhất 1 item | 1. Vào trang cart 2. Đổi ô quantity thành `"0"`                                            | quantity fallback = 1. Item vẫn còn trong giỏ.                  | Item bị xóa khỏi giỏ hàng (qty=0 = không mua).  | DT-D-014, BVA-D-008                                | `screenshots/BUG-D-002.png` |
| BUG-D-003 | Xóa sản phẩm không có dialog xác nhận — vi phạm FR-07                    | Medium   | High     | Cart có ít nhất 1 item | 1. Vào trang cart 2. Bấm "Xóa" bên cạnh 1 sản phẩm                                         | Item bị xóa ngay lập tức, không hỏi xác nhận.                   | Hiển thị dialog xác nhận trước khi xóa (FR-07). | DT-D-023, DT-D-024                                 | `screenshots/BUG-D-003-before.png` · `screenshots/BUG-D-003.png` |
| BUG-D-004 | Không có nút +/- chỉnh quantity — dùng TextInput thay vì — vi phạm FR-07 | Medium   | Medium   | Cart có ít nhất 1 item | 1. Vào trang cart 2. Quan sát cách chỉnh số lượng                                          | Chỉ có TextInput để nhập số trực tiếp. Không có nút "+" và "−". | Có nút "+" và "−" bên cạnh số lượng (FR-07).    | DT-D-025                                           | `screenshots/BUG-D-004.png` |

---

## B. Bug Summary by Severity

| Severity  | Count | Bug IDs                         |
| --------- | ----- | ------------------------------- |
| High      | 1     | BUG-D-001 (off-by-one)          |
| Medium    | 3     | BUG-D-002, BUG-D-003, BUG-D-004 |
| **Total** | **4** |                                 |

---

## C. Root Cause Analysis

| Root Cause                            | Bug IDs              | Count | Description                                                                                     |
| ------------------------------------- | -------------------- | ----- | ----------------------------------------------------------------------------------------------- |
| **Logic bug trong inline edit**       | BUG-D-001, BUG-D-002 | 2     | App.js:620 dùng `parsed + 1` thay vì `parsed`. Và không implement business rule qty=0 → remove. |
| **Thiếu UX safety pattern**           | BUG-D-003            | 1     | `removeFromCart` gọi trực tiếp không qua Alert confirm. FR-07 yêu cầu confirm dialog.           |
| **UI implementation không đúng SPEC** | BUG-D-004            | 1     | Dev chọn TextInput thay nút +/- (FR-07).                                                        |

---

## D. GitHub Issue Templates

### BUG-D-001: Off-by-one trong cart inline edit

```markdown
**Title:** [BUG][FR-07] Cart inline edit — nhập quantity N → set N+1 (off-by-one)

**Severity:** High
**Priority:** High

**Description:**
Khi user chỉnh số lượng sản phẩm trong giỏ hàng bằng TextInput, quantity bị set thành `input + 1` thay vì `input`. Lỗi tại App.js:620: `parsed + 1`.

**Steps to Reproduce:**
1. Thêm sản phẩm vào giỏ hàng
2. Vào màn hình Cart
3. Xóa số trong ô quantity và nhập "2"
4. Quan sát quantity hiển thị

**Expected:** quantity = 2
**Actual:** quantity = 3

**Code location:** `frontend-mobile/App.js:620`

```javascript
// BUG: parsed + 1 nên là parsed
newCart[index].quantity = Number.isFinite(parsed) && parsed > 0 ? parsed + 1 : 1;
```

**Related TC:** DT-D-010, DT-D-011, DT-D-012, BVA-D-009→BVA-D-014
**Screenshot:** `screenshots/BUG-D-001-before.png` · `screenshots/BUG-D-001.png`
```

### BUG-D-002: qty=0 không xóa item khỏi giỏ

```markdown
**Title:** [BUG][FR-07] Nhập quantity=0 trong cart không xóa item — fallback về 1

**Severity:** Medium
**Priority:** Medium

**Description:**
Theo business rule, khi user nhập quantity=0 đồng nghĩa không muốn mua sản phẩm đó nữa → item nên bị xóa. Nhưng CODE fallback về 1 thay vì xóa.

**Steps to Reproduce:**
1. Thêm sản phẩm vào giỏ
2. Vào màn hình Cart
3. Xóa number trong ô quantity và nhập "0"

**Expected:** Item bị xóa khỏi giỏ hàng
**Actual:** quantity = 1 (fallback)

**Code location:** `frontend-mobile/App.js:617-621`

**Related TC:** DT-D-014, BVA-D-008
**Screenshot:** `screenshots/BUG-D-002.png`
```

### BUG-D-003: Không có confirm dialog khi xóa sản phẩm

```markdown
**Title:** [BUG][FR-07] Xóa sản phẩm khỏi giỏ không hiển thị dialog xác nhận

**Severity:** Medium
**Priority:** High

**Description:**
FR-07 yêu cầu "Nút Xóa sản phẩm phải có dialog xác nhận trước khi thực hiện". Nhưng code hiện tại xóa trực tiếp ngay khi bấm nút.

**Steps to Reproduce:**
1. Thêm ít nhất 1 sản phẩm vào giỏ
2. Vào màn hình Cart
3. Bấm "Xóa" bên cạnh sản phẩm

**Expected:** Hiển thị Alert "Bạn có chắc muốn xóa?" với nút Xác nhận / Hủy
**Actual:** Item bị xóa ngay lập tức

**Code location:** `frontend-mobile/App.js:630`

```javascript
// Thiếu Alert.alert confirm
<TouchableOpacity onPress={() => removeFromCart(index)}>
```

**Related TC:** DT-D-023, DT-D-024
**Screenshot:** `screenshots/BUG-D-003-before.png` · `screenshots/BUG-D-003.png`
```

### BUG-D-004: Không có nút +/- chỉnh quantity

```markdown
**Title:** [BUG][FR-07] Cart không có nút +/- để chỉnh số lượng — dùng TextInput thay vì stepper

**Severity:** Medium
**Priority:** Medium

**Description:**
FR-07 yêu cầu "Có nút + và − bên cạnh số lượng để tăng/giảm". Nhưng implementation dùng TextInput với keyboardType='numeric' — user phải nhập số thủ công, không có nút stepper.

**Steps to Reproduce:**
1. Thêm sản phẩm vào giỏ
2. Vào màn hình Cart
3. Quan sát khu vực hiển thị số lượng sản phẩm

**Expected:** Nút "+" và "−" bên cạnh số lượng
**Actual:** Chỉ có TextInput để nhập số trực tiếp. Không có nút + và −.

**Code location:** `frontend-mobile/App.js:611`

```javascript
// TextInput thay vì nút +/-
<TextInput keyboardType='numeric' value={...} onChangeText={...} />
```

**Related TC:** DT-D-025
**Screenshot:** `screenshots/BUG-D-004.png`
```
