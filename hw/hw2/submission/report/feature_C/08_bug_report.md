# STEP 7 — Bug Report: FR-14 Category Management (CRUD)

---

## A. Bug Report Table

| Bug ID | Title | Severity | Priority | Pre-condition | Steps to Reproduce | Actual Result | Expected Result | Related TC ID | Screenshot |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| BUG-C-001 | Tạo category với tên rỗng không bị reject | High | High | Admin authenticated | 1. `POST /api/categories` với body `{name: ""}` | 200 OK, category created với name="" | 400 Bad Request — "Tên danh mục là bắt buộc, không được để trống" (FR-14) | DT-C-007, BVA-C-001 | `screenshots/bug-clarify/BUG-C-001.png` · `screenshots/bug-test/rest-01.png` |
| BUG-C-002 | Tạo category không gửi field name không bị reject | High | High | Admin authenticated | 1. `POST /api/categories` với body `{}` | 200 OK, category created với name=null | 400 Bad Request — thiếu field bắt buộc | DT-C-008 | `screenshots/bug-clarify/BUG-C-002.png` · `screenshots/bug-test/rest-02.png` |
| BUG-C-003 | Tạo category với tên whitespace-only không bị reject | Medium | Medium | Admin authenticated | 1. `POST /api/categories` với body `{name: "   "}` | 200 OK, category created với name="   " | 400 Bad Request — whitespace-only coi như rỗng | DT-C-009 | `screenshots/bug-clarify/BUG-C-003.png` · `screenshots/bug-test/rest-03.png` |
| BUG-C-004 | XSS injection qua tên danh mục — script tag lưu nguyên trong DB | Critical | Critical | Admin authenticated | 1. `POST /api/categories` với body `{name: "<script>alert(1)</script>"}` 2. `GET /api/categories` kiểm tra | 200 OK, `<script>alert(1)</script>` lưu nguyên trong DB | 400 hoặc sanitize — không cho lưu HTML/script tag | DT-C-010 | `screenshots/bug-clarify/BUG-C-004.png` · `screenshots/bug-test/rest-04.png` |
| BUG-C-005 | Cho phép tạo category trùng tên | Medium | Medium | Admin authenticated, seed có "Điện thoại" | 1. `POST /api/categories` với body `{name: "Điện thoại"}` | 200 OK, tạo thêm 1 category cùng tên "Điện thoại" với id mới | 400/409 Conflict — tên đã tồn tại | DT-C-006, DT-C-026 | `screenshots/bug-clarify/BUG-C-005.png` · `screenshots/bug-test/rest-05.png` |
| BUG-C-006 | Update tên category thành rỗng không bị reject | High | High | Admin authenticated, category id=3 tồn tại | 1. `PUT /api/categories/3` với body `{name: ""}` | 200 OK, name set thành "" | 400 Bad Request — tên không được rỗng | DT-C-013, BVA-C-005 | `screenshots/bug-clarify/BUG-C-006.png` · `screenshots/bug-test/rest-06.png` |
| BUG-C-007 | Update category không gửi field name không bị reject | High | High | Admin authenticated, category id=3 tồn tại | 1. `PUT /api/categories/3` với body `{}` | 200 OK, name set thành null | 400 Bad Request — thiếu field bắt buộc | DT-C-014 | `screenshots/bug-clarify/BUG-C-007.png` · `screenshots/bug-test/rest-07.png` |
| BUG-C-008 | Update tên category trùng danh mục khác không bị reject | Medium | Medium | Admin authenticated, category id=3 tồn tại, seed có "Laptop" | 1. `PUT /api/categories/3` với body `{name: "Laptop"}` | 200 OK, tên cập nhật thành "Laptop" (trùng với danh mục id=2) | 400/409 Conflict — tên trùng | DT-C-012 | `screenshots/bug-clarify/BUG-C-008.png` · `screenshots/bug-test/rest-08.png` |
| BUG-C-009 | DELETE/PUT category với id không tồn tại trả 200 OK (silent no-op) | Medium | High | Admin authenticated | 1. `DELETE /api/categories/9999` | 200 OK, `{message: "Category deleted"}` dù không có category id=9999 | 404 Not Found | DT-C-016, DT-C-021, BVA-C-015 | `screenshots/bug-clarify/BUG-C-009.png` · `screenshots/bug-test/rest-09.png` |
| BUG-C-010 | DELETE/PUT category với id=0 trả 200 OK | Medium | Medium | Admin authenticated | 1. `DELETE /api/categories/0` | 200 OK, `{message: "Category deleted"}` | 400/404 — id=0 không hợp lệ (AUTOINCREMENT từ 1) | DT-C-017, BVA-C-009 | `screenshots/bug-clarify/BUG-C-010.png` · `screenshots/bug-test/rest-10.png` |
| BUG-C-011 | DELETE/PUT category với id âm trả 200 OK | Medium | Medium | Admin authenticated | 1. `DELETE /api/categories/-1` | 200 OK, `{message: "Category deleted"}` | 400/404 — id âm không hợp lệ | DT-C-018 | `screenshots/bug-clarify/BUG-C-011.png` · `screenshots/bug-test/rest-11.png` |
| BUG-C-012 | DELETE/PUT category với id non-numeric trả 200 OK | Medium | Medium | Admin authenticated | 1. `DELETE /api/categories/abc` | 200 OK, `{message: "Category deleted"}` | 400 Bad Request — id phải là số | DT-C-019 | `screenshots/bug-clarify/BUG-C-012.png` · `screenshots/bug-test/rest-12.png` |
| BUG-C-013 | Xóa category có products liên kết không bị chặn — orphan products | High | High | Category id=1 có products dùng category_id=1 | 1. `DELETE /api/categories/1` 2. `GET /api/products` | 200 OK, category xóa thành công. Products có category_id=1 trở thành orphan. | 400/409 Conflict — không cho xóa khi có products liên kết | DT-C-023 | `screenshots/bug-clarify/BUG-C-013.png` · `screenshots/bug-test/rest-13.png` |
| BUG-C-014 | Trường bắt buộc "Tên danh mục" không có ký hiệu `*` (FR-22) | Low | Medium | Admin logged in, tab Danh mục | 1. Quan sát form thêm danh mục | Không có `*` bên cạnh nhãn. Input không có attribute `required`. | Trường bắt buộc phải có `*` (FR-22) | UI-C-003 | `screenshots/bug-test/ui-c-003-required-field.png` |
| BUG-C-015 | Xóa danh mục không có dialog xác nhận (FR-24) | Medium | High | Admin logged in, tab Danh mục, có ít nhất 1 category | 1. Click nút "Xóa" bên cạnh 1 danh mục | Category bị xóa ngay lập tức mà không hỏi xác nhận. | Hiển thị confirm dialog trước khi xóa | UI-C-006 | `screenshots/bug-test/ui-c-006-delete-confirm.png` |
| BUG-C-016 | Trang danh mục rỗng không có empty state (FR-24) | Low | Low | Admin logged in, tab Danh mục, DB rỗng | 1. Xóa hết categories 2. Quan sát giao diện | Bảng trống, không có message/icon thân thiện. | Hiển thị empty state với icon + message (FR-24) | UI-C-007 | `screenshots/bug-test/ui-c-007-empty-state.png` |

---

## B. Bug Summary by Severity

| Severity | Count | Bug IDs |
| --- | --- | --- |
| Critical | 1 | BUG-C-004 (XSS) |
| High | 5 | BUG-C-001, BUG-C-002, BUG-C-006, BUG-C-007, BUG-C-013 |
| Medium | 8 | BUG-C-003, BUG-C-005, BUG-C-008, BUG-C-009, BUG-C-010, BUG-C-011, BUG-C-012, BUG-C-015 |
| Low | 2 | BUG-C-014, BUG-C-016 |
| **Total** | **16** | |

---

## C. Root Cause Analysis

| Root Cause | Bug IDs | Count | Description |
| --- | --- | --- | --- |
| **Không validate input `name`** | BUG-C-001→004, BUG-C-006→008 | 7 | Backend không kiểm tra name rỗng, null, whitespace, XSS, trùng lặp |
| **Không validate `id` param** | BUG-C-009→012 | 4 | Backend không kiểm tra id tồn tại, kiểu dữ liệu, giá trị hợp lệ. SQLite silent no-op. |
| **Không có referential integrity** | BUG-C-005, BUG-C-008, BUG-C-013 | 3 | DB schema thiếu UNIQUE constraint trên `name`, thiếu FOREIGN KEY/ON DELETE cho products |
| **Frontend thiếu UI requirements** | BUG-C-014→016 | 3 | Không implement FR-22 (required `*`), FR-24 (confirm dialog, empty state) |

---

## D. GitHub Issue Templates

### BUG-C-004: XSS injection qua tên danh mục

```markdown
**Title:** [BUG][FR-14] XSS injection — script tag lưu nguyên trong category name

**Severity:** Critical
**Priority:** Critical

**Description:**
POST `/api/categories` với `{name: "<script>alert(1)</script>"}` được chấp nhận và lưu nguyên trong DB. Khi frontend render tên danh mục, script có thể thực thi → XSS attack.

**Steps to Reproduce:**
1. Login as admin
2. `curl -X POST http://localhost:3000/api/categories -H "Content-Type: application/json" -H "Authorization: Bearer <token>" -d '{"name": "<script>alert(1)</script>"}'`
3. `curl http://localhost:3000/api/categories` → tên chứa script tag

**Expected:** 400 Bad Request hoặc sanitize HTML tags
**Actual:** 200 OK, script tag lưu nguyên

**Related TC:** DT-C-010
```

### BUG-C-001: Tạo category với tên rỗng

```markdown
**Title:** [BUG][FR-14] Category với name="" được tạo thành công — vi phạm SPEC

**Severity:** High
**Priority:** High

**Description:**
FR-14 SPEC: "Tên danh mục là bắt buộc, không được để trống". Nhưng POST `/api/categories` với `{name: ""}` trả 200 OK và tạo category rỗng.

**Steps to Reproduce:**
1. `curl -X POST http://localhost:3000/api/categories -H "Content-Type: application/json" -H "Authorization: Bearer <token>" -d '{"name": ""}'`

**Expected:** 400 Bad Request
**Actual:** 200 OK, `{message: "Category created", id: N}`

**Related TC:** DT-C-007, BVA-C-001
```

### BUG-C-013: Xóa category có products liên kết

```markdown
**Title:** [BUG][FR-14] Xóa category có products liên kết → orphan products

**Severity:** High
**Priority:** High

**Description:**
DELETE `/api/categories/:id` không kiểm tra có products nào dùng `category_id` đó. Sau khi xóa, products trở thành orphan — `category_id` trỏ đến category không tồn tại.

**Steps to Reproduce:**
1. Seed DB (category id=1 "Điện thoại" có products liên kết)
2. `curl -X DELETE http://localhost:3000/api/categories/1 -H "Authorization: Bearer <token>"`
3. `curl http://localhost:3000/api/products` → products vẫn có category_id=1

**Expected:** 400/409 Conflict — không cho xóa
**Actual:** 200 OK, category xóa, products thành orphan

**Related TC:** DT-C-023
```

### BUG-C-009: DELETE/PUT id không tồn tại trả 200 OK

```markdown
**Title:** [BUG][FR-14] DELETE/PUT category với id không tồn tại trả 200 OK — silent no-op

**Severity:** Medium
**Priority:** High

**Description:**
Backend không kiểm tra `this.changes` (số rows affected) sau DELETE/UPDATE. Khi id không tồn tại, SQLite trả 0 rows affected nhưng backend vẫn trả success.

**Steps to Reproduce:**
1. `curl -X DELETE http://localhost:3000/api/categories/9999 -H "Authorization: Bearer <token>"`
2. Response: `{message: "Category deleted"}` dù id=9999 không tồn tại

**Expected:** 404 Not Found
**Actual:** 200 OK

**Related TC:** DT-C-016, DT-C-021, BVA-C-015
```

### BUG-C-015: Xóa danh mục không có confirm dialog

```markdown
**Title:** [BUG][FR-24] Xóa danh mục không hiển thị dialog xác nhận

**Severity:** Medium
**Priority:** High

**Description:**
FR-24: "Khi xóa item phải có dialog xác nhận". Nhưng click nút "Xóa" → category bị xóa ngay lập tức mà không hỏi user.

**Steps to Reproduce:**
1. Login admin → tab "Danh mục"
2. Click nút "Xóa" (đỏ) bên cạnh 1 danh mục
3. Category biến mất ngay — không có confirm dialog

**Expected:** Hiển thị confirm dialog trước khi xóa
**Actual:** Xóa ngay lập tức

**Related TC:** UI-C-006
**Screenshot:** `screenshots/ui-c-006-delete-confirm.png`
```
