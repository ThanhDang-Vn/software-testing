# 05 — BVA Test Cases: feature_C (FR-14 — Quản lý Danh mục)

> **Scope:** Convert boundaries into concrete test cases.

---

## Test Cases

**Defaults:**
- JWT: Valid admin token (`admin@eshop.com`)
- DB: Seed data (3 categories: id=1 Điện thoại, id=2 Laptop, id=3 Phụ kiện)
- Precondition: Admin authenticated

### name Length — Create (7 TC)

| TC ID | Boundary | Input | Expected |
| --- | --- | --- | --- |
| BVA-C-001 | Min-1 (empty) | POST `{name: ""}` | **SPEC:** 400 — tên không được rỗng. **CODE:** 200 OK, category created với name="" (**BUG**) |
| BVA-C-002 | Min (1 char) | POST `{name: "A"}` | 200 OK, `{message: "Category created", id: N}` |
| BVA-C-003 | Min+1 (2 chars) | POST `{name: "AB"}` | 200 OK, category created |
| BVA-C-004 | Nominal (7 chars) | POST `{name: "Điện tử"}` | 200 OK, category created |
| BVA-C-005 | Long (255 chars) | POST `{name: "A"×255}` | 200 OK, category created (SQLite TEXT unlimited) |
| BVA-C-006 | Very long (1000 chars) | POST `{name: "A"×1000}` | 200 OK, category created — stress test |
| BVA-C-007 | Extremely long (10000 chars) | POST `{name: "A"×10000}` | 200 OK hoặc timeout/error — extreme stress |

### name Length — Update (4 TC)

| TC ID | Boundary | Input | Expected |
| --- | --- | --- | --- |
| BVA-C-008 | Min-1 (empty) | PUT `/api/categories/3` `{name: ""}` | **SPEC:** 400. **CODE:** 200 OK, name="" (**BUG**) |
| BVA-C-009 | Min (1 char) | PUT `/api/categories/3` `{name: "X"}` | 200 OK, `{message: "Category updated"}` |
| BVA-C-010 | Min+1 (2 chars) | PUT `/api/categories/3` `{name: "XY"}` | 200 OK, category updated |
| BVA-C-011 | Nominal (11 chars) | PUT `/api/categories/3` `{name: "Phụ kiện mới"}` | 200 OK, category updated |

### id (URL Parameter — Delete/Update) (8 TC)

| TC ID | Boundary | Input | Expected |
| --- | --- | --- | --- |
| BVA-C-012 | Negative | DELETE `/api/categories/-1` | **Expected:** 400/404. **CODE:** 200 OK — silent no-op (**BUG**) |
| BVA-C-013 | Zero (Min-1) | DELETE `/api/categories/0` | **Expected:** 404. **CODE:** 200 OK — silent no-op (**BUG**) |
| BVA-C-014 | Min (first valid) | DELETE `/api/categories/1` | 200 OK, `{message: "Category deleted"}` — category đầu tiên bị xóa |
| BVA-C-015 | Min+1 | DELETE `/api/categories/2` | 200 OK, category deleted |
| BVA-C-016 | Max (last existing) | DELETE `/api/categories/3` | 200 OK, category deleted — ID lớn nhất trong seed |
| BVA-C-017 | Max+1 (non-existent) | DELETE `/api/categories/4` | **Expected:** 404. **CODE:** 200 OK — silent no-op (**BUG**) |
| BVA-C-018 | Far out of range | DELETE `/api/categories/9999` | **Expected:** 404. **CODE:** 200 OK — silent no-op |
| BVA-C-019 | Non-numeric | DELETE `/api/categories/abc` | **Expected:** 400. **CODE:** 200 OK — SQLite WHERE id="abc" matches 0 rows |

### Supplementary (Non-BVA — Categorical) (7 TC)

| TC ID | Category | Input | Expected |
| --- | --- | --- | --- |
| BVA-C-020 | Whitespace-only | POST `{name: "   "}` | **SPEC:** 400 — coi như rỗng. **CODE:** 200 OK (**BUG**) |
| BVA-C-021 | Special chars | POST `{name: "Đồ điện & gia dụng"}` | 200 OK, ký tự đặc biệt lưu đúng |
| BVA-C-022 | HTML/XSS | POST `{name: "<script>alert(1)</script>"}` | **SPEC:** 400/sanitize. **CODE:** 200 OK — XSS risk |
| BVA-C-023 | Duplicate name | POST `{name: "Điện thoại"}` (đã tồn tại) | 200 OK — CODE không có UNIQUE constraint |
| BVA-C-024 | null/missing field | POST `{}` (không có name) | **SPEC:** 400. **CODE:** 200 OK, name=null (**BUG**) |
| BVA-C-025 | Non-numeric id | PUT `/api/categories/abc` `{name: "Test"}` | **Expected:** 400. **CODE:** 200 OK — silent no-op |
| BVA-C-026 | Missing id param | DELETE `/api/categories/` | Có thể match `GET /api/categories` route → trả danh sách |

---

## Summary

| Category | Count | TC Range |
| --- | --- | --- |
| name length (Create) | 7 | BVA-C-001 → BVA-C-007 |
| name length (Update) | 4 | BVA-C-008 → BVA-C-011 |
| id (URL param) | 8 | BVA-C-012 → BVA-C-019 |
| Supplementary (non-BVA) | 7 | BVA-C-020 → BVA-C-026 |
| **Total** | **26** | |

---

## Notes

- **BVA focus:** name length (ordered — char count) và id (ordered — integer). Các categorical values (whitespace, XSS, duplicate) đặt ở Supplementary vì không phải ordered domain.
- **Nhiều SPEC-CODE mismatch:** Code không validate name (empty/null/whitespace accepted), không check id tồn tại (silent no-op), không check admin role.
- **Stress test boundaries (BVA-C-005→007):** SQLite TEXT không có giới hạn, nhưng test ở 255/1000/10000 để tìm implementation limits.
