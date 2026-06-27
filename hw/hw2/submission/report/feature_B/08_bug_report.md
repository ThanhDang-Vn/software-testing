# 08 — Bug Report: feature_B (FR-11 — Xem Lịch sử Đơn hàng)

---

### BUG-B-001 — User cancel được order khi status=shipping (vi phạm SPEC FR-10)

**Severity:** High
**Priority:** High

**Steps to reproduce**

1. Login as `test@eshop.com`
2. Tạo/có order với `status=shipping`
3. Vào Profile → Lịch sử đơn hàng
4. Bấm "Hủy đơn" trên order đang giao

**Actual**
`200 OK`, order status cập nhật thành `canceled`

**Expected**
`400 "Cannot cancel this order"` — SPEC FR-10: User không được phép hủy khi đang giao (chỉ Admin)

**Notes**
Root cause: `server.js` line 329 — condition chỉ block `delivered` và `canceled`, thiếu `shipping`. Ảnh hưởng business logic: user bypass được quyền Admin. Related TC: DT-B-012

**Screenshot**
![BUG-B-001_before](screenshots/BUG-B-001_before.png)
![BUG-B-001_after](screenshots/BUG-B-001_after.png)

---

## Thống kê

| Severity | Count | Bug IDs |
| --- | --- | --- |
| High | 1 | BUG-B-001 |
| **Tổng** | **1** | |
