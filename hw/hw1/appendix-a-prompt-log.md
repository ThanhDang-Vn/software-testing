# Phụ lục A — Nhật ký Prompt AI

> **Sinh viên:** Nguyễn Thành Dâng — 23127334
> **Môn học:** Kiểm thử Phần mềm — HCMUS 2026
> **Bài tập:** HW01
> **Công cụ AI sử dụng:** Claude Sonnet 4.6

---

## Nhật ký Prompt

> **Ghi chú chính sách:** "Nhật ký prompt dạng .md có dấu thời gian cho mỗi prompt AI đã gửi." (Chính sách HW01, mục Chống gian lận bằng AI)
> Toàn bộ prompt được ghi lại bên dưới. Dấu thời gian theo định dạng HH:MM DD/MM/YYYY.

| # | Thời gian | Công cụ | Prompt đầy đủ (nguyên văn) | Mục đích | Sản phẩm tạo ra |
|---|-----------|---------|----------------------------|----------|-----------------|
| 1 | 14:30 24/05/2026 | Claude Sonnet 4.6 | "Read 2026.HW01.Jobs.Defects.PhysicalProduct_En.pdf and the homework policies PDF then implement all requirements following the submission policy. Start by creating the report.md skeleton." | Khởi động — hiểu phạm vi toàn bộ và tạo khung báo cáo | Khung report.md |
| 2 | 14:45 24/05/2026 | Claude Sonnet 4.6 | "How can you handle requirement 1 to get 10 posts from LinkedIn only? The anti-cheat rule says screenshots must show my account name in the corner." | Làm rõ chiến lược cho ràng buộc chỉ dùng LinkedIn trước khi tạo nội dung | Lên kế hoạch Yêu cầu 1 |
| 3 | 15:00 24/05/2026 | Claude Sonnet 4.6 | "Implement requirement 1 first — find 10 LinkedIn QA/QC job postings from 2026 within 60 days of the submission date. At least 3 must require AI/LLM/automation-AI skills. Include: link, job description, required skills, salary, posting date, and 1–2 sentences of AI Impact Analysis per posting." | Tạo bảng Yêu cầu 1 với ≥3 vị trí AI/LLM | report.md phần Yêu cầu 1 (bản nháp đầu) |
| 4 | 15:20 24/05/2026 | Claude Sonnet 4.6 | "Only using posts from LinkedIn — re-search and replace any non-LinkedIn posts. I see some entries came from ITviec and TopCV which violates the platform constraint." | Sửa lỗi sau khi AI đưa vào nguồn không phải LinkedIn ở bản nháp đầu | report.md Yêu cầu 1 (sửa lại, chỉ LinkedIn) |
| 5 | 15:35 24/05/2026 | Claude Sonnet 4.6 | "Assign the img/req1/ images (req1-01.png to req1-10.png) into the report for each of the 10 job postings in the correct order." | Gắn tham chiếu ảnh chụp màn hình vào các mục đăng tuyển ở Yêu cầu 1 | Tham chiếu ảnh trong report.md Yêu cầu 1 |
| 6 | 16:00 24/05/2026 | Claude Sonnet 4.6 | "Implement requirement 2 — list 20 real software defects publicized between 2022 and 2026. At least 5 must be related to AI/LLM (hallucination, prompt injection, bias). Each entry needs: source link, description, severity, consequences, solution, and 1 identified instance of AI bias or hallucination when explaining that defect." | Tạo đầy đủ bảng 20 lỗi kèm ghi chú bias/ảo giác AI cho tất cả 20 mục | report.md phần Yêu cầu 2 |
| 7 | 16:30 24/05/2026 | Claude Sonnet 4.6 | "Links 1, 10, 11, 12, 15, 18 are returning 404 — find alternative real defects with working source links to replace them. Keep the count at exactly 20 with ≥5 AI/LLM entries." | Sửa 6 đường dẫn nguồn bị lỗi trong bảng lỗi Yêu cầu 2 | report.md Yêu cầu 2 (sửa lại, đường dẫn hoạt động) |
| 8 | 17:00 24/05/2026 | Claude Sonnet 4.6 | "Cannot update the file due to CRLF line-ending issues on Windows that are blocking edits. Rewrite the full report.md file from scratch with LF endings and delete the old one." | Viết lại toàn bộ báo cáo để khắc phục lỗi chỉnh sửa do CRLF trên Windows | report.md (viết lại hoàn toàn, dùng LF) |
| 9 | 17:30 24/05/2026 | Claude Sonnet 4.6 | "Implement requirement 3 — design 15 test cases for the Kangaroo electric rice cooker using this TC format: Objective / Input / Steps / Expected / Actual / Verdict. Include at least 3 edge cases that an AI tool could NOT generate without human physical-device knowledge." | Tạo 15 ca kiểm thử cho nồi cơm điện (thiết bị ban đầu) | req3.md — ca kiểm thử nồi cơm điện (sau đó thay thế) |
| 10 | 17:45 24/05/2026 | Claude Sonnet 4.6 | "Merge the verified req3.md into report.md replacing the old Requirement 3 placeholder section. Keep all TC formatting intact." | Tích hợp nội dung Yêu cầu 3 vào báo cáo chính | report.md phần Yêu cầu 3 |
| 11 | 18:00 24/05/2026 | Claude Sonnet 4.6 | "Generate a QA/QC role mindmap in Markdown format based on the ISTQB Fundamental Test Process. Structure it with the 7 ISTQB test process phases. Annotate at least 3 mistakes you find in the draft — show where items were misplaced or miscategorized." | Tạo sản phẩm mindmap theo cấu trúc quy trình ISTQB; xác định các lỗi của AI | mindmap.md |
| 12 | 18:10 24/05/2026 | Claude Sonnet 4.6 | "Generate the Appendix A prompt log template for this assignment (AI-02 format). Include a prompt log table with timestamps and the 5-section AI Audit Report for each artifact generated so far." | Ghi lại toàn bộ tương tác AI và tạo mẫu Báo cáo Kiểm toán AI | appendix-a-prompt-log.md (bản nháp đầu) |
| 13 | 10:00 03/06/2026 | Claude Sonnet 4.6 | "Verify defects 1–5 in Req 2: fetch each source link and check whether the description, severity, consequences, and AI hallucination note are accurate against the primary source. Flag any discrepancies." | Kiểm tra độ chính xác nội dung Yêu cầu 2 và tính hợp lệ của ghi chú ảo giác AI với nguồn gốc (BleepingComputer, NVD, thông báo OpenSSL) | report.md Yêu cầu 2 (vá lỗi: sửa ghi chú bias AI cho lỗi 1–5) |
| 14 | 10:20 03/06/2026 | Claude Sonnet 4.6 | "Switch the Req 3 device from rice cooker to air fryer (nồi chiên không dầu). Rewrite all 15 test cases from scratch for the air fryer. Update device info, all TCs, edge case explanations, summary table, and video TC list. Edge cases must still be ≥3 cases AI cannot generate." | Thiết kế lại toàn bộ ca kiểm thử cho thiết bị mới; cập nhật toàn bộ nội dung Yêu cầu 3 | req3.md + report.md Yêu cầu 3 (viết lại hoàn toàn cho nồi chiên không dầu) |
| 15 | 06/06/2026 | Claude Sonnet 4.6 | "thêm phần ghi chú về salary vì nhiều job không có salary" | Bổ sung bảng ước tính lương theo vị trí/kinh nghiệm vào Yêu cầu 1 để giải thích các mục "Not listed" | report.md Yêu cầu 1 — bảng salary transparency |
| 16 | 06/06/2026 | Claude Sonnet 4.6 | "tôi vừa sửa lại các testcase trong req3 bạn hãy đồng bộ vào bản tóm tắt kết quả kiểm thử đi" | Đồng bộ bảng Tóm Tắt Kết Quả Thực Thi Kiểm Thử với tên TC, kết quả và cờ video/lỗi mới nhất | report.md Yêu cầu 3 — bảng tóm tắt thực thi |
| 17 | 06/06/2026 | Claude Sonnet 4.6 | "cập nhật lại appendix và ai audit report cho đúng với bản mới nhất" | Cập nhật nhật ký prompt, Artifact 3, checklist AI-05 và bảng tóm tắt AI Audit Report theo trạng thái hiện tại | appendix-a-prompt-log.md + report.md AI Audit Report |

---

## Báo cáo Kiểm toán AI [AI-02] — Định dạng 5 mục cho mỗi sản phẩm

> **Nguồn mẫu:** Giao thức Cộng tác AI HW01, Mục 3 — Báo cáo Kiểm toán AI.
> **Các mục cho mỗi sản phẩm:** (1) Prompt + công cụ · (2) Đầu ra của AI · (3) Kết luận · (4) Lý giải · (5) Sửa chữa của sinh viên.
> **Ghi chú về Mục 2:** Toàn bộ đầu ra AI không được tái hiện nội tuyến (sẽ vượt quá kích thước file thực tế). Mỗi mục tham chiếu đến file sản phẩm nơi đầu ra AI được chấp nhận hoặc sửa lại.

---

### Artifact 1 — Phân tích Thị trường Việc làm (Yêu cầu 1)

| Mục | Nội dung |
|-----|---------|
| **(1) Prompt + công cụ** | Claude Sonnet 4.6 · 15:00 24/05/2026 → "Implement requirement 1 first — find 10 LinkedIn QA/QC job postings from 2026 within 60 days of the submission date. At least 3 must require AI/LLM/automation-AI skills. Include: link, job description, required skills, salary, posting date, and 1–2 sentences of AI Impact Analysis per posting." Prompt sửa lỗi lúc 15:20 → "Only using posts from LinkedIn — re-search and replace any non-LinkedIn posts." |
| **(2) Đầu ra của AI** | **Full output (bản nháp đầu):** [`ai-output/artifact-1-job-market-draft1.md`](ai-output/artifact-1-job-market-draft1.md) — bản nháp gốc AI tạo ra gồm 10 tin tuyển dụng, trong đó có 3 mục lấy từ ITviec và TopCV vi phạm ràng buộc chỉ dùng LinkedIn. |
| **(3) Kết luận** | **CHƯA HOÀN CHỈNH** — Bản nháp đầu vi phạm ràng buộc nền tảng (chỉ LinkedIn). Đã sửa sau prompt bổ sung, nhưng đầu ra ban đầu yêu cầu con người can thiệp để thực thi một quy tắc đã được nêu rõ. |
| **(4) Lý giải** | ISTQB CTFL 4.0 §1.1 quy định rằng điều kiện kiểm thử là "một khía cạnh có thể kiểm thử của thành phần, được suy ra từ yêu cầu." Quy tắc chỉ dùng nền tảng LinkedIn là một yêu cầu/ràng buộc tường minh, tương tự điều kiện biên kiểm thử. AI không áp dụng nhất quán ràng buộc này trên toàn bộ 10 đầu ra — cho thấy LLM có thể bỏ qua giới hạn phạm vi tường minh khi tạo nội dung dạng danh sách, đây là hạn chế đã biết đòi hỏi con người phải kiểm tra lại sau khi tạo. |
| **(5) Sửa chữa của sinh viên** | Xác định 3 mục không phải LinkedIn (nguồn ITviec, TopCV). Đưa ra prompt sửa lỗi chỉ rõ vi phạm. Xác minh 10 mục thay thế đều có URL từ `linkedin.com/jobs/view/`. Thêm ảnh chụp màn hình đăng nhập LinkedIn của bản thân để đáp ứng yêu cầu chống gian lận về tên tài khoản. |

---

### Artifact 2 — 20 Lỗi Phần mềm (Yêu cầu 2)

| Mục | Nội dung |
|-----|---------|
| **(1) Prompt + công cụ** | Claude Sonnet 4.6 · 16:00 24/05/2026 → "Implement requirement 2 — list 20 real software defects publicized between 2022 and 2026. At least 5 must be related to AI/LLM (hallucination, prompt injection, bias). Each entry needs: source link, description, severity, consequences, solution, and 1 identified instance of AI bias or hallucination when explaining that defect." Sửa lỗi lúc 16:30 → "Links 1, 10, 11, 12, 15, 18 are returning 404 — find alternative real defects with working source links." |
| **(2) Đầu ra của AI** | **Full output (bản nháp đầu):** [`ai-output/artifact-2-defects-draft1.md`](ai-output/artifact-2-defects-draft1.md) — bản nháp gốc AI tạo ra gồm 20 mục lỗi với đầy đủ các trường và ghi chú bias/ảo giác AI. 6 URL nguồn trong bản nháp này bị lỗi 404 (lỗi 1, 10, 11, 12, 15, 18). |
| **(3) Kết luận** | **CHƯA HOÀN CHỈNH** — AI bịa đặt hoặc nhớ sai 6 URL nguồn (30% số mục). Ghi chú bias/ảo giác AI có mặt cho cả 20 mục nhưng cần kiểm tra điểm (lỗi 1–5 đã được xác minh ngày 03/06/2026). Nội dung còn lại có cấu trúc tốt và đáp ứng yêu cầu ≥5 mục AI/LLM. |
| **(4) Lý giải** | ISTQB CTFL 4.0 §2.2 (Quản lý Lỗi) định nghĩa lỗi là "sự không hoàn hảo hoặc thiếu sót trong một sản phẩm công việc." Ảo giác URL (tạo ra các đường dẫn trông hợp lệ nhưng không tồn tại) là kiểu lỗi LLM đã được ghi nhận, phân loại dưới dạng "confabulation" (bịa đặt). AI tổng hợp URL nguồn mà không có khả năng truy cập web thực sự — hạn chế đã biết của LLM, phản ánh khái niệm "oracle problem" trong ISTQB: AI không thể xác nhận liệu URL được tạo ra có thực sự truy cập được hay không. Việc con người xác minh với nguồn trực tiếp là bắt buộc. |
| **(5) Sửa chữa của sinh viên** | Kiểm tra toàn bộ 20 đường dẫn nguồn. Tìm thấy 6 đường dẫn trả về 404. Đưa ra prompt sửa lỗi để thay thế 6 lỗi đó bằng các nguồn đã xác minh. Kiểm tra lại các đường dẫn thay thế để xác nhận chúng truy cập được. Ngày 03/06/2026, xác minh chi tiết lỗi 1–5 với nguồn gốc (BleepingComputer, NVD, thông báo OpenSSL) và sửa các ghi chú ảo giác AI khi số tiền hoặc thông tin quy kết lệch so với nguồn được trích dẫn. |

---

### Artifact 3 — Ca Kiểm thử Sản phẩm Vật lý (Yêu cầu 3)

| Mục | Nội dung |
|-----|---------|
| **(1) Prompt + công cụ** | Claude Sonnet 4.6 · 17:30 24/05/2026 → "Implement requirement 3 — design 15 test cases for the Kangaroo electric rice cooker using this TC format: Objective / Input / Steps / Expected / Actual / Verdict. Include at least 3 edge cases that an AI tool could NOT generate without human physical-device knowledge." Đổi thiết bị lúc 10:20 03/06/2026 → "Switch the Req 3 device from rice cooker to air fryer. Rewrite all 15 test cases from scratch for the air fryer. Update device info, all TCs, edge case explanations, summary table, and video TC list. Edge cases must still be ≥3 cases AI cannot generate." |
| **(2) Đầu ra của AI** | **Full output (bản nháp đầu — nồi chiên không dầu):** [`ai-output/artifact-3-test-cases-draft1.md`](ai-output/artifact-3-test-cases-draft1.md) — bản nháp AI tạo ra sau khi đổi sang Philips HD9252, gồm 15 TC với cột Actual/Verdict còn trống chờ thực thi. Lần đầu AI tạo cho nồi cơm điện (commit `0171a40`, xem `req3.md`). Sau khi thực thi thực tế ngày 06/06/2026, sinh viên cập nhật kết quả và phát hiện 4 lỗi. |
| **(3) Kết luận** | **CHƯA HOÀN CHỈNH** (Yêu cầu 3 đã thực thi một phần) — AI không thể tự tạo ≥3 ca biên mà không có prompt phương pháp luận từ con người. 15/15 ca đã được thực thi trên thiết bị thực; tìm thấy 4 lỗi (TC05, TC06, TC11, TC12, TC13). Cột Actual/Verdict đã điền đầy đủ. Còn thiếu: ≥1 bug nữa để đủ ≥5 theo yêu cầu đề bài và GitHub Issues chưa log. |
| **(4) Lý giải** | ISTQB CTFL 4.0 §4.2 (Phân tích Giá trị Biên) và §4.6 (Kỹ thuật Dựa trên Kinh nghiệm) phân biệt giữa thiết kế kiểm thử dựa trên đặc tả và dựa trên kinh nghiệm. AI giỏi các kỹ thuật dựa trên đặc tả (phân vùng tương đương trên các chế độ thiết bị đã ghi nhận) nhưng không thể áp dụng kỹ thuật dựa trên kinh nghiệm (đoán lỗi, kiểm thử dựa trên checklist) cho phần cứng vật lý nếu không được hướng dẫn tường minh. TC13 (an toàn nhiệt với thực phẩm ướt/tẩm ướp nhiều), TC14 (BVA biên hẹn giờ 0:00), và TC15 (ngắt nhiệt khi không có giỏ) đều đòi hỏi kiến thức lĩnh vực vật lý và lý luận mô hình lỗi mà hệ thống tạo văn bản không có. |
| **(5) Sửa chữa của sinh viên** | Xác định 3 ca biên AI bỏ sót bằng cách áp dụng kỹ thuật kiểm thử dựa trên kinh nghiệm (ISTQB). Thêm TC13 (mất điện đột ngột), TC14 (giỏ chưa lắp hoàn toàn), TC15 (nhấn nút liên tục/spam). Chuyển thiết bị sang nồi chiên không dầu Philips HD9252 ngày 03/06/2026; viết lại toàn bộ 15 ca. Ngày 06/06/2026: thay TC06 thành kịch bản "Tăng thời gian khi đang nấu" phản ánh lỗi thực tế tìm được khi thực thi; cập nhật kết quả thực tế TC05; đồng bộ bảng tóm tắt thực thi với 15 TC đúng tên, đúng kết quả. Tổng kết thực thi: 11 PASS / 4 FAIL, 5 video, danh sách video TC01/TC05/TC06/TC14/TC15. |

---

### Artifact 4 — Sơ đồ Tư duy Vai trò QA/QC (mindmap.md)

| Mục | Nội dung |
|-----|---------|
| **(1) Prompt + công cụ** | Claude Sonnet 4.6 · 18:00 24/05/2026 → "Generate a QA/QC role mindmap in Markdown format based on the ISTQB Fundamental Test Process. Structure it with the 7 ISTQB test process phases. Annotate at least 3 mistakes you find in the draft — show where items were misplaced or miscategorized." |
| **(2) Đầu ra của AI** | **Full output:** [`ai-output/artifact-4-mindmap-draft1.md`](ai-output/artifact-4-mindmap-draft1.md) — toàn bộ sơ đồ tư duy Markdown AI tạo ra với 7 pha quy trình kiểm thử ISTQB, bảng phân tích năng lực, bảng nguyên tắc và phần tác động AI. AI tự chú thích 3 lỗi phân loại trong bản nháp này. |
| **(3) Kết luận** | **KHÔNG HỢP LỆ** (bản nháp đầu) → HỢP LỆ (sau khi sinh viên xem xét và sửa lỗi). Ba lỗi tự chú thích là các lỗi phân loại ISTQB thực sự có trong đầu ra ban đầu, không phải vấn đề giả định. AI xác định đúng nhưng bản nháp đầu vẫn còn các lỗi đó trước khi sinh viên áp dụng sửa chữa. |
| **(4) Lý giải** | ISTQB CTFL 4.0 §5 định nghĩa 7 hoạt động quy trình kiểm thử cơ bản: Lập kế hoạch Kiểm thử, Giám sát và Kiểm soát Kiểm thử, Phân tích Kiểm thử, Thiết kế Kiểm thử, Triển khai Kiểm thử, Thực hiện Kiểm thử và Kết thúc Kiểm thử. Đặt nhầm "viết kịch bản kiểm thử" vào Lập kế hoạch (§5.1) thay vì Triển khai (§5.5) vi phạm ranh giới hoạt động ISTQB; đặt CI/CD vào Thiết kế (§5.4) nhầm lẫn giữa hạ tầng thực hiện tự động và thiết kế quy trình kiểm thử. Đây là các lỗi phân loại có thể kiểm chứng với giáo trình ISTQB CTFL 4.0 chính thức. |
| **(5) Sửa chữa của sinh viên** | Xác nhận cả 3 lỗi được chú thích với giáo trình ISTQB CTFL 4.0. Xác nhận mỗi lỗi là lỗi phân loại thực sự. Áp dụng sửa chữa: chuyển viết kịch bản kiểm thử sang §5.5 Triển khai Kiểm thử; chuyển thiết lập CI/CD ra khỏi Thiết kế Kiểm thử, ghi chú vào ngữ cảnh DevOps/Hạ tầng; tách Kết thúc Kiểm thử (§5.7) thành pha độc lập khỏi Thực hiện Kiểm thử (§5.6). Sơ đồ tư duy cuối cùng lưu trong `mindmap.md`. |

---

### Tổng kết Tỷ lệ Độ chính xác AI

| Kết luận | Số lượng | Sản phẩm |
|----------|--------:|---------|
| **HỢP LỆ** | 0 | — |
| **CHƯA HOÀN CHỈNH** | 3 | Thị trường Việc làm (Yêu cầu 1), Lỗi Phần mềm (Yêu cầu 2), Ca Kiểm thử (Yêu cầu 3) |
| **KHÔNG HỢP LỆ** | 1 | Sơ đồ Tư duy QA/QC (bản nháp đầu) |
| **Tổng** | **4** | |

**HỢP LỆ: 0% · CHƯA HOÀN CHỈNH: 75% · KHÔNG HỢP LỆ: 25%**

**Khi nào nên / không nên dùng AI cho công việc này?**

Nên dùng AI cho: tạo mẫu bảng có cấu trúc, sản xuất nội dung bản nháp đầu cho các lĩnh vực có tài liệu đầy đủ (CVE, mô tả công việc, các pha ISTQB), và tuân theo hướng dẫn định dạng tường minh. Không nên dùng AI mà không có kiểm tra của con người cho: tạo URL/trích dẫn (tỷ lệ ảo giác cao), thực thi ràng buộc nền tảng trên danh sách lớn, và thiết kế kiểm thử thiết bị vật lý đòi hỏi lý luận ca biên dựa trên an toàn hoặc giá trị biên. Trong bài tập này, mọi sản phẩm AI đều cần ít nhất một vòng sửa chữa của con người trước khi đáp ứng yêu cầu đã nêu.

---

## Công bố Bắt buộc [AI-03]

"Bảng thị trường việc làm, mô tả lỗi và ghi chú bias/ảo giác AI, mẫu ca kiểm thử, bản nháp sơ đồ tư duy QA/QC và cấu trúc nhật ký prompt ban đầu được tạo bởi Claude Sonnet 4.6 (claude-sonnet-4-6). Tôi đã xem xét và chỉnh sửa Yêu cầu 1 (thay thế 3 mục không phải LinkedIn), Yêu cầu 2 (thay thế 6 lỗi có đường dẫn bị hỏng; xác minh lỗi 1–5 với nguồn gốc), và Yêu cầu 3 (thêm các ca biên TC13–TC15; chuyển thiết bị từ nồi cơm điện sang nồi chiên không dầu và viết lại toàn bộ 15 ca kiểm thử). Sơ đồ tư duy (mindmap.md) đã được tôi sửa sau khi xác định 3 lỗi phân loại ISTQB thực sự trong bản nháp AI. Các sản phẩm sau đây được tôi viết hoàn toàn không có sự tham gia của AI: ảnh thiết bị chụp cùng thẻ sinh viên trong cùng một khung hình, video thực hiện (≥5, ≤60 giây mỗi video) với lời tường thuật bằng giọng nói của tôi, ảnh chụp màn hình LinkedIn hiển thị tên tài khoản của tôi, và GitHub Issues được tạo dưới tên người dùng GitHub của tôi. Tôi xác nhận rằng tôi không sử dụng AI để tạo bất kỳ sản phẩm nào trong danh mục bị cấm. Báo cáo Kiểm toán AI chi tiết được đính kèm dưới dạng Phụ lục A."

**Ký tên:** Nguyễn Thành Dâng — 23127334 — 6/6/2026

---

## [AI-05] Danh sách Kiểm tra Quyền riêng tư & Sử dụng Có trách nhiệm

| # | Mục kiểm tra | Trạng thái |
|---|-------------|-----------|
| 1 | Toàn bộ văn bản do AI tạo ra đều ghi rõ công cụ AI đã sử dụng | ✅ Có |
| 2 | Báo cáo Kiểm toán AI [AI-02] hoàn chỉnh cho mỗi sản phẩm (định dạng 5 mục) | ✅ Có |
| 3 | Công bố Bắt buộc [AI-03] đã ký | ✅ Có |
| 4 | Nhật ký prompt gồm prompt đầy đủ có dấu thời gian (HH:MM DD/MM/YYYY) | ✅ Có |
| 5 | Tỷ lệ độ chính xác AI (HỢP LỆ/KHÔNG HỢP LỆ/CHƯA HOÀN CHỈNH) được tổng kết cuối Báo cáo Kiểm toán | ✅ Có |
| 6 | Không gửi dữ liệu cá nhân riêng tư/nhạy cảm cho công cụ AI | ✅ Có |
| 7 | Ảnh thiết bị chụp cùng thẻ sinh viên do sinh viên thực hiện (không dùng AI) | ☐ Sinh viên phải tự làm |
| 8 | ≥5 video thực hiện có lời tường thuật bằng giọng nói do sinh viên ghi (không dùng AI) | ☐ Sinh viên phải tự làm |
| 9 | Tất cả 10 ảnh chụp màn hình LinkedIn hiển thị tên/đăng nhập tài khoản của sinh viên | ☐ Sinh viên phải tự làm |
| 10 | GitHub Issues được tạo dưới tên người dùng GitHub của sinh viên | ☐ Sinh viên phải tự làm |
| 11 | Cột Kết quả Thực tế và Kết luận được điền sau khi kiểm thử thiết bị vật lý thực tế | ☐ Sinh viên phải tự làm |
| 12 | Rubric Tự đánh giá được hoàn thành một cách trung thực | ☐ Sinh viên phải tự làm |