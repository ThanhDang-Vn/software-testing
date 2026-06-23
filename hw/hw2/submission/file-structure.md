QUY ƯỚC FILE & THƯ MỤC — áp dụng cho toàn bộ bài làm:
Mọi output bạn tạo phải được GHI THÀNH FILE thật (không chỉ in ra chat),
theo đúng cấu trúc thư mục sau:

submission/
├── README.md                          (self-assessment + test summary)
├── report/
│   ├── main_report.md                 (báo cáo chính tổng hợp)
│   ├── 00_sut_survey.md               (khảo sát hệ thống)
│   ├── feature_A/
│   │   ├── 01_spec_analysis.md
│   │   ├── 02_domain_testing.md       (partitioning + test cases)
│   │   ├── 03_bva.md                  (boundaries + test cases)
│   │   ├── 04_execution.md            (kết quả thực thi)
│   │   ├── 05_bug_report.md
│   │   └── 06_gap_analysis.md
│   ├── feature_B/  (cấu trúc giống feature_A)
│   ├── feature_C/  (...)
│   └── feature_D/  (...)
├── ai_audit/
│   ├── ai_audit_report.md
│   └── ai_critique.md
├── skill/
│   └── domain-bva-testing/
│       ├── SKILL.md
│       └── templates/
├── git_commit_log.txt
├── screenshots/                       (tôi sẽ tự bỏ ảnh vào đây)
└── videos.md                          (link YouTube demo)

NGUYÊN TẮC:
- Sau MỖI bước, bạn tạo/cập nhật đúng file tương ứng trong cấu trúc trên.
- Cuối mỗi phản hồi, nói rõ: "Đã ghi vào file: [đường dẫn]".
- File báo cáo chính và AI Critique/Audit sẽ cần convert sang PDF ở bước cuối
  — ghi nhớ điều này.
- Dùng tên feature_A/B/C/D nhất quán, ánh xạ tới FR tôi đã chọn.