# Changes Log — Feature C (FR-14 Category CRUD)

---

## 02_domain_table: v0 → v1

### Review Issues
1. **Bỏ JWT Token (Field 4) và User Role (Field 5)** — làm test case phức tạp không cần thiết cho scope domain testing FR-14.

### Changes Applied
- Xóa Field 4 (JWT Token): 4 ECs (EC-T-V1, EC-T-V2, EC-T-I1, EC-T-I2)
- Xóa Field 5 (User Role): 2 ECs (EC-R-V1, EC-R-I1)
- Cập nhật EC Summary: 31 → **25 ECs** (13 Valid + 12 Invalid)
- Đánh lại số Field: Behavioral Partitions từ Field 6 → Field 4

---

## 05_bva_testcases: v0 → v1

### Review Issues
1. **Bỏ Supplementary (BVA-C-020 → BVA-C-026)** — categorical tests (whitespace, XSS, duplicate, null, non-numeric) không thuộc BVA (không phải ordered domain).
2. **Bỏ stress test boundaries (BVA-C-005→007 cũ)** — 255/1000/10000 chars không phải 7-point BVA; SPEC/CODE không định nghĩa Max → không có Max-1, Max, Max+1 cho name length.
3. **Bỏ các TC ngoài 7-point BVA cho id** — Negative (-1), Far out (9999), Non-numeric ("abc") không nằm trong Min-1/Min/Min+1/Nominal/Max-1/Max/Max+1.

### Changes Applied
- Xóa Supplementary section: 7 TCs (BVA-C-020 → BVA-C-026)
- name Create: 7 → **4 TCs** (giữ Min-1, Min, Min+1, Nominal)
- name Update: giữ nguyên **4 TCs**
- id URL param: 8 → **7 TCs** (đúng 7-point BVA: Min-1=0, Min=1, Min+1=2, Nominal=2, Max-1=2, Max=3, Max+1=4)
- Đánh lại TC ID: BVA-C-001 → BVA-C-015
- Tổng: 26 → **15 TCs**

---

## 06_detailed_testcases: v0 → v1

### Review Issues
1. **Trùng tên phải là lỗi** — DT-C-006 (Create duplicate), DT-C-012 (Update duplicate), DT-C-026→033 (behavioral duplicate) expected phải là reject (400/409), không phải accept.
2. **id invalid chỉ có DELETE, thiếu PUT** — id=0, id âm, id text, id rỗng, id script tag cần test cho cả DELETE và PUT.
3. **Expected Result phải dựa trên SPEC** — không đọc CODE rồi ghi vào Expected. CODE behavior ghi vào Actual Result ở Step 7.

### Changes Applied
- DT-C-006: Expected 200 OK → **400/409 Conflict** (trùng tên)
- DT-C-012: Expected 200 OK → **400/409 Conflict** (update trùng tên)
- DT-C-033 (cũ DT-C-026): Expected cả 2 lần 200 OK → **lần 2: 400/409** (duplicate)
- Tách section A3 (Delete id) và A4 (Update id) riêng biệt
- Thêm 7 TC mới cho PUT id invalid: DT-C-022→DT-C-028 (id=9999, 0, -1, "abc", "", script tag, valid)
- Thêm DT-C-021 (DELETE id script tag)
- Đánh lại TC ID: Behavioral từ DT-C-022→026 → DT-C-029→033
- Sửa tất cả Expected Result theo SPEC (bỏ ghi chú CODE behavior)
- Tổng: 48 → **54 TCs** (33 Domain + 15 BVA + 7 UI → nhưng không đổi BVA/UI, chỉ Domain 26→33)
