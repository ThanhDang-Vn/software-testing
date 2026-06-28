# AI Critique

## 1. Where did the AI get something wrong, biased, or incomplete?

**Over-engineering ở các phiên bản đầu:** Xuyên suốt cả 4 features, lần init đầu tiên AI luôn tạo ra số lượng test case quá nhiều và không cần thiết. AI có xu hướng "thấy field thì sinh test case" theo pattern máy móc, không phân biệt đâu là equivalence class thực sự có ý nghĩa và đâu chỉ là variation không tạo ra behavior khác biệt. Nhiều test case bị trùng lặp về bản chất — cùng một equivalence class nhưng AI tách thành nhiều TC với input khác nhau mà expected result giống hệt nhau, vi phạm nguyên tắc cốt lõi của Domain Testing.

**Nhầm lẫn giữa Domain Testing và BVA:** AI thường xuyên đưa các giá trị biên vào bảng Domain Table hoặc ngược lại, đưa các equivalence class vào BVA table. Ranh giới giữa "phân lớp tương đương" và "phân tích giá trị biên" bị mờ nhạt trong output của AI, cần user chỉnh lại nhiều lần để tách bạch đúng kỹ thuật.

## 2. Why did it fail to catch the issue?

AI hoạt động theo pattern recognition: gặp input field → sinh equivalence class → sinh boundary → sinh test case. Nó thiếu khả năng đánh giá "test case này có thực sự cần thiết không?" và "kỹ thuật đang áp dụng có đúng không?". AI không tự phân biệt khi nào đang làm Domain Testing vs BVA, dẫn đến output bị trộn lẫn. Ngoài ra AI có thiên kiến "càng nhiều test case càng tốt" thay vì tập trung vào chất lượng và đúng phương pháp.

## 3. What principle have you learned?

**AI cần review nhiều vòng mới cho ra output đúng kỹ thuật.** Không thể tin tưởng kết quả lần đầu — mỗi feature đều cần 2-3 vòng review để loại bỏ test case thừa, sửa lỗi logic, và đảm bảo đúng bản chất của từng kỹ thuật testing. Quy trình hiệu quả: AI sinh draft → User review theo đúng lý thuyết → AI sửa → User verify lại. Vai trò của người tester không phải là "nhờ AI làm hộ" mà là "hướng dẫn và kiểm soát AI" để đảm bảo output đúng phương pháp luận.
