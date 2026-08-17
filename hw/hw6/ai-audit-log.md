# HW06 — AI Audit Log

Ghi một entry cho mỗi tương tác AI có ảnh hưởng đến bài làm. Giữ nguyên prompt và output để có thể truy vết; không thay nội dung gốc khi bổ sung phần review hoặc correction.

## Entry template

### Interaction ID: `HW06-AI-XXX`

- **Tool/model:** `<tên công cụ và model/version>`
- **Timestamp:** `<YYYY-MM-DDTHH:mm:ss+07:00>`
- **Exact prompt:**

  ```text
  <prompt nguyên văn, không tóm tắt hoặc diễn giải>
  ```

- **Full output hoặc file output:**

  Chọn một trong hai cách ghi sau:

  - Full output:

    ```text
    <toàn bộ output nguyên văn>
    ```

  - File output: `<đường dẫn tương đối tới file hoặc danh sách file do AI tạo/sửa>`

- **Human review:** `<người review, kết quả kiểm tra, quyết định chấp nhận/từ chối và lý do>`
- **Correction:** `<nội dung sửa sau review; ghi "Không có" nếu không cần sửa>`
- **Affected test IDs:** `<danh sách test ID, hoặc "Không có" nếu tương tác không ảnh hưởng test case>`

---

Sao chép toàn bộ khối template trên cho interaction tiếp theo và thay `XXX` bằng số thứ tự tăng dần.
