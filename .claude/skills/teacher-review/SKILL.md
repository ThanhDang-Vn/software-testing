# QA/QC Pitfalls - Lỗi Thường Gặp Trong Bài Tập Môn Testing

Khi chấm bài QA/QC, Software Testing, hoặc các môn liên quan đến kiểm thử phần mềm, KIỂM TRA các điểm sau theo chuẩn ISTQB Foundation Level và IEEE 829.

---

## 1. Severity vs Priority (Cực Kỳ Hay Sai)

**Định nghĩa chuẩn (ISTQB):**
- **Severity** = mức độ nghiêm trọng kỹ thuật của lỗi (ảnh hưởng đến hệ thống)
- **Priority** = mức độ cấp bách cần sửa (ảnh hưởng đến business)

**Lỗi sinh viên hay mắc:**
- ❌ Gán Severity = HIGH cho lỗi UI/cosmetic (logo mờ, màu sai)
- ❌ Severity và Priority luôn bằng nhau (không hiểu hai khái niệm khác nhau)
- ❌ Không có scale rõ ràng (mỗi defect dùng scale khác nhau: Critical/Major/Minor lẫn S1/S2/S3)
- ❌ Crash hệ thống nhưng ghi Severity = LOW

**Cần kiểm tra:**
- Có sử dụng scale nhất quán không? (S1-S4 hoặc Critical/High/Medium/Low)
- Logic Severity vs Priority có hợp lý không? Ví dụ:
  - Severity=Critical + Priority=Low: hợp lý (lỗi crash nhưng ở feature ít dùng)
  - Severity=Low + Priority=High: hợp lý (lỗi typo nhưng ở logo trang chủ trước event lớn)

---

## 2. Test Case Format (IEEE 829)

**Mỗi test case PHẢI có:**
- Test Case ID (unique, có pattern: TC_<Module>_<Number>)
- Title / Objective
- Precondition
- Test Steps (đánh số rõ ràng)
- Test Data (nếu cần)
- Expected Result
- Actual Result (sau khi chạy)
- Status (Pass/Fail/Blocked)
- Priority
- Tester / Date

**Lỗi sinh viên hay mắc:**
- ❌ Thiếu Precondition
- ❌ Steps viết kiểu "Test login functionality" — không phải step!
- ❌ Expected Result chung chung: "Login successful" — phải cụ thể "Redirect to /dashboard, display username at header"
- ❌ Không có Actual Result (bài đáng lẽ phải execute)
- ❌ Status PASS nhưng Expected ≠ Actual

---

## 3. Defect Report Format

**Mỗi bug report PHẢI có:**
- Bug ID
- Title (mô tả ngắn gọn vấn đề)
- Steps to Reproduce (đánh số)
- Expected Behavior
- Actual Behavior
- Severity
- Priority
- Environment (OS, browser, device, version)
- Screenshot / Video / Log
- Reporter, Date
- Status (New/Assigned/Fixed/Verified/Closed/Reopened)

**Lỗi sinh viên hay mắc:**
- ❌ Title kiểu "Bug" hoặc "Lỗi" — phải cụ thể
- ❌ Steps không reproduce được
- ❌ Không có Environment → không thể debug
- ❌ Mô tả Expected = "It should work" — vô nghĩa
- ❌ Thiếu screenshot cho lỗi UI

---

## 4. Test Coverage và Test Design Techniques

**Các kỹ thuật ISTQB yêu cầu hiểu:**
- Equivalence Partitioning (EP)
- Boundary Value Analysis (BVA)
- Decision Table Testing
- State Transition Testing
- Use Case Testing
- Pairwise / Combinatorial Testing

**Lỗi sinh viên hay mắc:**
- ❌ Nói "đã áp dụng EP" nhưng không chỉ ra partitions
- ❌ BVA mà không test giá trị biên (min-1, min, min+1, max-1, max, max+1)
- ❌ Không phân biệt black-box vs white-box techniques

---

## 5. Test Plan Components (IEEE 829)

Test plan đầy đủ phải có:
1. Test Plan Identifier
2. Introduction
3. Test Items
4. Features to be Tested
5. Features NOT to be Tested
6. Approach
7. Item Pass/Fail Criteria
8. Suspension Criteria and Resumption Requirements
9. Test Deliverables
10. Testing Tasks
11. Environmental Needs
12. Responsibilities
13. Staffing and Training Needs
14. Schedule
15. Risks and Contingencies
16. Approvals

**Lỗi sinh viên hay mắc:**
- ❌ Thiếu "Features NOT to be Tested" (cực kỳ hay quên)
- ❌ Không có Risk Analysis
- ❌ Không có pass/fail criteria rõ ràng

---

## 6. AI Audit Report (Bài Tập Có Yêu Cầu AI)

Khi bài tập yêu cầu AI Audit Report kèm artifact:

**Mỗi entry PHẢI có đủ 5 mục:**
1. Prompt + Tool (có timestamp HH:MM dd/mm/yyyy)
2. AI Output (nguyên văn, KHÔNG paraphrase)
3. Verdict (VALID/INVALID/INCOMPLETE)
4. Reasoning (thường yêu cầu số câu cụ thể, ví dụ 2-5 câu)
5. Student Fix (highlight chỗ sửa)

**Lỗi sinh viên hay mắc:**
- ❌ Thiếu timestamp
- ❌ Paraphrase AI output thay vì paste nguyên (vi phạm trực tiếp đề bài)
- ❌ Reasoning không đủ số câu yêu cầu
- ❌ Verdict không có lý do dựa trên ISTQB/slide
- ❌ Student Fix không highlight được thay đổi
- ❌ Đếm 1 prompt = nhiều entry (đề bảo 1 prompt = 1 entry dù output bao nhiêu items)
- ❌ Thiếu summary tỷ lệ VALID/INVALID/INCOMPLETE cuối báo cáo
- ❌ Thiếu kết luận "WHEN to use / not use AI"

---

## 7. Job Market Analysis (Bài Tập LinkedIn)

Khi bài tập yêu cầu khảo sát thị trường QA:

**Cần kiểm tra:**
- Đủ số lượng jobs yêu cầu (đếm chính xác)
- Mỗi job có screenshot hiển thị tên tài khoản LinkedIn của sinh viên (anti-cheat)
- Ngày đăng nằm trong khoảng cho phép (thường 60 ngày trước nộp)
- URL LinkedIn hợp lệ (format `linkedin.com/jobs/view/<numeric_id>`)
- Có analysis về AI impact (không chỉ list jobs)
- Salary research nếu yêu cầu

**Red flags hay gặp:**
- 🚨 Số jobs trong bảng tổng kết ≠ số jobs chi tiết
- 🚨 URL LinkedIn giả/không hợp lệ
- 🚨 Tất cả jobs đều ở USA hoặc đều ở VN (đề thường yêu cầu mix)
- 🚨 Job description quá chung chung — dấu hiệu bịa hoặc generate bằng AI

---

## 8. Test Physical Product (HW01 Specific)

Khi đề yêu cầu test sản phẩm vật lý:

**Phải có:**
- Mô tả sản phẩm cụ thể (brand, model, version)
- Đủ số defects yêu cầu (thường 20)
- Mỗi defect có ảnh chụp THỰC TẾ của sản phẩm
- Severity + Priority theo chuẩn
- Reproduction steps có thể làm theo được
- Mix các loại defects (functional, UI, performance, usability...)

**Lỗi hay gặp:**
- ❌ "Defect" thực ra là feature suggestion
- ❌ Ảnh là ảnh stock từ internet, không phải sản phẩm sinh viên test
- ❌ Tất cả 20 defects đều cùng loại (toàn UI hoặc toàn functional)
- ❌ Severity gán random không theo logic
- ❌ Không nói rõ test methodology / approach

---

## Kiểm Tra Cuối Cùng (Final Checklist)

Trước khi cho điểm cuối, đảm bảo đã kiểm tra:

- [ ] Đã đếm chính xác số lượng items so với yêu cầu?
- [ ] Đã đối chiếu mỗi defect/test case với chuẩn ISTQB/IEEE 829?
- [ ] Đã kiểm tra tính nhất quán giữa bảng tổng kết và chi tiết?
- [ ] Đã kiểm tra anti-cheat requirements (screenshots, dates, URLs)?
- [ ] Đã phát hiện được dấu hiệu AI generated chưa sửa?
- [ ] Đã tham chiếu yêu cầu gốc trong mỗi điểm trừ?
- [ ] Đã có cách sửa cụ thể cho mỗi vấn đề?