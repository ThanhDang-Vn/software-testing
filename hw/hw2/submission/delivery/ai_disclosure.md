# AI Use Disclosure Form

**Đơn vị áp dụng:** Khoa Công nghệ Thông tin (FIT) – Trường Đại học Khoa học Tự nhiên TP.HCM (HCMUS)
**Môn học:** CS423 / CSC13003 – Kiểm thử Phần mềm (Software Testing)
**Tên tài liệu:** Biểu mẫu Khai báo Sử dụng AI (AI Use Disclosure Form)
**Mục đích:** Yêu cầu đính kèm vào các bài tập có sử dụng AI trong phạm vi được cho phép.

---

## 1. Course & Student Info

| Trường | Nội dung |
|---|---|
| **Course** | CS423 / CSC13003 – Software Testing |
| **Assignment ID** | HW02 |
| **Assignment Title** | Domain Testing & Boundary Value Analysis |
| **AI Use Category (1–5)** | 5 |
| **Date** | 2026-06-28 |
| **Student name** | Nguyễn Thành Dâng |
| **Student ID** | 23127334 |

---

## 2. Disclosure Questions

### 2.1. AI tool(s) used — Các công cụ AI đã dùng

- Claude (Anthropic) — thông qua Claude Code CLI

### 2.2. Stage(s) of the assignment where AI was used — Các giai đoạn sử dụng AI

- [x] Brainstorming (lên ý tưởng)
- [x] Outlining (lập dàn ý)
- [x] Drafting (viết nháp)
- [x] Feedback (lấy ý kiến phản hồi)
- [x] Revision (chỉnh sửa)
- [x] Coding (viết mã)
- [x] Data analysis (phân tích dữ liệu)
- [ ] Visual design (thiết kế trực quan)
- [ ] Other (khác)

### 2.3. Main prompts or tasks given to the AI — Các câu lệnh/nhiệm vụ chính giao cho AI

> Toàn bộ lịch sử prompt được đính kèm tại Phụ lục A (`prompt_log.md`).

**Prompt 1:**
Phân tích feature theo FR mapping, xác định các biến đầu vào (input variables), miền giá trị (domain), và điều kiện biên (boundary) để xây dựng Domain Test Matrix.

**Prompt 2:**
Sinh test case theo kỹ thuật Domain Testing và BVA dựa trên đặc tả yêu cầu, sau đó format theo template Markdown chuẩn của bài tập.

**Prompt 3:**
Thực thi test script trên ứng dụng eShop, ghi nhận kết quả Pass/Fail, chụp screenshot cho các bug phát hiện được, và viết bug report theo chuẩn.

### 2.4. Specific parts of the work AI contributed to — Các phần cụ thể có sự đóng góp của AI

- AI đã hỗ trợ sinh các test case cho Feature A, B, C, D dựa trên phân tích domain và BVA.
- AI đã hỗ trợ viết test script (Playwright) để thực thi tự động các test case.
- AI đã hỗ trợ tổng hợp bug report và gap analysis.
- AI đã hỗ trợ format và cấu trúc các file báo cáo Markdown.
- Sinh viên tự review, chỉnh sửa lại các test case, xác nhận kết quả thực thi, và đánh giá AI.

### 2.5. How I reviewed, revised, or verified the AI output — Cách kiểm tra, chỉnh sửa hoặc xác minh kết quả từ AI

- Chạy thực tế toàn bộ test script trên ứng dụng eShop để xác nhận kết quả Pass/Fail.
- Đối chiếu test case với đặc tả yêu cầu (FR) để đảm bảo coverage.
- Review từng bug report, chụp screenshot minh chứng.
- Viết bài AI Critique (`ai_critique.md`) đánh giá điểm mạnh/yếu của AI trong quá trình hỗ trợ.
- Đối chiếu với slide/giáo trình môn học về kỹ thuật Domain Testing và BVA.

### 2.6. Citation — Trích dẫn

[1] Anthropic, "Claude," AI assistant, ver. Claude Code CLI (Opus 4.6), 2026. [Online]. Available: https://claude.ai

---

## 3. Statement of Honesty — Tuyên bố Trung thực

Tôi xác nhận rằng những lời khai báo trên là chính xác và đầy đủ. Tôi hiểu rằng việc không khai báo hoặc khai báo sai lệch về việc sử dụng AI sẽ bị xử lý như một hành vi vi phạm kỷ luật học thuật (academic misconduct), có thể dẫn đến điểm 0 cho bài tập và bị chuyển lên hội đồng kỷ luật.

| Trường | Nội dung |
|---|---|
| **Tên sinh viên** | Nguyễn Thành Dâng |
| **Mã số sinh viên** | 23127334 |
| **Lớp / Khóa** | |
| **Môn học** | CS423 / CSC13003 – Software Testing |
| **Tên giảng viên** | |
| **Ngày** | 2026-06-28 |
| **Chữ ký** | *(ký tên)* |

---

## References — Tài liệu tham khảo

1. M. Kharbach, "AI in Education: Best Practices for Disclosure," 2024.
2. ISTQB, "Certified Tester Foundation Level Syllabus," v4.0, 2023.
3. Anthropic, "Claude Documentation," 2026. [Online]. Available: https://docs.anthropic.com
