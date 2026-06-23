Prompt 1: 

Tôi đã chọn 4 feature sau (mỗi pool 1 cái):
- Pool A: FR-02 Login and account lockout
- Pool B: FR-11 Order history view (user)
- Pool C: FR-14 Category management (CRUD)
- Pool D: D5 Mobile – Shopping cart

Với feature ĐẦU TIÊN (FR-02 Login and account lockout), hãy làm phần phân tích đặc tả (KHÔNG thiết kế test case ở bước này):

1. Mô tả chức năng: feature làm gì, luồng nghiệp vụ chính.
2. Liệt kê TẤT CẢ các biến đầu vào (input variables / fields). Với mỗi biến, ghi rõ:
   - Kiểu dữ liệu
   - Ràng buộc/quy tắc validation (độ dài, định dạng, min/max, required/optional, ký tự cho phép...)
   - Giá trị hợp lệ và không hợp lệ về mặt nghiệp vụ
3. Liệt kê các biến phụ thuộc lẫn nhau (nếu có) và các điều kiện kết hợp.
4. Chỉ rõ những chỗ đặc tả KHÔNG rõ ràng / thiếu thông tin — đó là nơi dễ phát sinh bug.

Nếu thông tin trong code/đặc tả không đủ, hãy đọc source code của feature trong repo để suy ra ràng buộc thực tế, và ghi rõ ràng buộc nào lấy từ đâu (đặc tả vs. suy từ code).

Prompt 2:

Bây giờ áp dụng kỹ thuật DOMAIN TESTING cho feature [FR-02 Login and account lockout], theo đúng quy trình đã học trên lớp. Làm tuần tự và giải thích từng bước:

BƯỚC 2a — Xác định biến và phân hoạch miền (domain/partitions):
1. Với mỗi biến đầu vào, xác định nó là biến rời rạc (discrete) hay liên tục (continuous), có thứ tự (ordered) hay không.
2. Phân chia miền giá trị của mỗi biến thành các lớp tương đương (equivalence classes): các lớp HỢP LỆ và KHÔNG HỢP LỆ.
3. Trình bày dưới dạng bảng Markdown: | Variable | Domain/Range | Valid classes | Invalid classes | Ghi chú |
4. Giải thích lý do phân lớp như vậy.

Chưa sinh test case. Chỉ phân vùng. Dừng lại chờ tôi review.

Prompt 3: 

Tốt. Tiếp tục DOMAIN TESTING — BƯỚC 2b:

1. Lập "Domain Test Matrix" cho feature [FR-02 Login and account lockout] theo phương pháp đã học:
   - Mỗi dòng là một biến.
   - Với mỗi lớp tương đương, chọn giá trị đại diện (representative value) để TEST (đánh dấu) và các giá trị khác giữ ở mức hợp lệ (đánh dấu là "valid/by default").
   - Áp dụng nguyên tắc "1 biến sai tại 1 thời điểm" cho các lớp invalid (one-at-a-time), giữ các biến còn lại ở giá trị hợp lệ.
2. Từ ma trận, sinh ra danh sách TEST CASE đầy đủ. Mỗi test case gồm các cột:
   | TC ID | Mục tiêu | Biến được test | Lớp (valid/invalid) | Input cụ thể (tất cả field) | Expected Result | Loại (Positive/Negative) |
3. Bổ sung thêm test case nếu cần để bao phủ kỹ (đề bài khuyến khích thêm).
4. Giải thích NGẮN GỌN vì sao mỗi test case tồn tại (mapping về lớp tương đương nào).

Trình bày toàn bộ dưới dạng bảng Markdown. Đánh số TC ID theo dạng DT-[feature]-001.