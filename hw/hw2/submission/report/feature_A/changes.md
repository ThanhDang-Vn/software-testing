# Changes Log — feature_A (FR-02 Domain Testing)

## Feedback Refactor — 02_domain_testing.md

### Thay đổi chính

- **Tách rõ Input Domain vs Behavioral Partition:**
  - Input domain: Đặc điểm dữ liệu (format, length, null/empty)
  - Behavioral partition: Cách hệ thống xử lý (case-sensitive match, DB lookup, string comparison)
  - Lợi ích: Dễ hiểu flow & ít lẫn lộn khi thiết kế test case

- **Gộp Email case-sensitive cases:**
  - Cũ: `Test@eshop.com`, `TEST@ESHOP.COM` → 2 class riêng
  - Mới: "Email format valid, case NOT match" → 1 behavioral class
  - Lý do: Tất cả đều → 401 (user not found)

- **Gộp Whitespace cases:**
  - Cũ: space đầu/cuối, space giữa → 2+ class
  - Mới: "Email có whitespace" → 1 behavioral class
  - Lý do: Tất cả đều exact string không match → 401

- **Bỏ SQL Injection case:**
  - `test@eshop.com;DELETE--` → xóa
  - Lý do: SQL injection ∉ Domain Testing; nằm trong Security Test Suite

- **Thêm boundary:** Email quá dài (1000+ chars)
  - Potential: truncate, overflow, DB constraint
  - Cần test ở BVA (boundary value)

- **Gộp Password sai-khác thành 1 Invalid class:**
  - Cũ: case sai, ký tự sai, space, rỗng, unicode → 7+ class
  - Mới: "NOT exact match" → 1 invalid class + 3 behavioral notes (case-sensitive, whitespace-sensitive, empty)
  - Lý do: Tất cả đều → 401 + tăng counter

- **Cụ thể hóa Behavioral subclasses:**
  - Password: case-sensitive, whitespace-sensitive, empty/null
  - Email: case-sensitive match, whitespace-sensitive, format validation, DB lookup

- **Bảng Điều kiện kết hợp chuẩn hóa:**
  - Cũ: 7 rows, mix input domain + behavioral
  - Mới: 8 rows, rõ behavioral intention (Happy path, Priority, Trigger, Threshold, Validation, Not found, Case mismatch, Whitespace)
  - Thêm cột "Mục đích" để rõ lý do test

- **Đơn giản tóm tắt:**
  - Cũ: Liệt kê số lớp chi tiết
  - Mới: Input domain (số class) + Behavioral (ghi chú special case)
  - Tập trung: Mục đích test & chiến lược

### Lợi ích cải thiện

- **Chính xác Domain Testing chuẩn ISTQB:** Rõ biệt input domain vs system behavior
- **Giảm partition:** Từ 10+ class → ~5 class input domain + behavioral notes
- **Dễ thiết kế test case:** Mỗi class → rõ giá trị đại diện + hành vi kỳ vọng
- **Dễ bảo trì:** Ít overlap, logic rõ ràng
