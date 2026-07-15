# HW02 — Domain Testing on EShop

**Student ID:** 23127334
**Exercise ID:** HW02-AI
**Submission format:** `23127334_HW02_AI_DomainTesting_<Grade>.zip`

---

## 1. Feature Selection

| Pool               | Feature | Description                |
| ------------------ | ------- | -------------------------- |
| A — Authentication | FR-02   | Login & Account Lockout    |
| B — Shopping Cart  | FR-11   | Order History View (User)  |
| C — Web Admin      | FR-14   | Category Management (CRUD) |
| D — Mobile App     | FR-07   | Mobile Shopping Cart       |

---

## 2. Test Summary Report

### 2.1. Overview

| Metric                    | Value |
| ------------------------- | ----- |
| Features tested           | 4     |
| Total test cases designed | 142   |
| Total test cases executed | 141   |
| Total passed              | 95    |
| Total failed              | 46    |
| Total skipped             | 1     |
| Total bugs found          | 29    |

### 2.2. Per-Feature Breakdown

| Feature                   | TC Designed | Executed | Passed | Failed | Skipped | Bugs   | Pass Rate |
| ------------------------- | ----------- | -------- | ------ | ------ | ------- | ------ | --------- |
| A — FR-02 Login & Lockout | 25          | 25       | 18     | 7      | 0       | 6      | 72.0%     |
| B — FR-11 Order History   | 32          | 31       | 27     | 4      | 1       | 3      | 87.1%     |
| C — FR-14 Category CRUD   | 48          | 48       | 26     | 22     | 0       | 16     | 54.2%     |
| D — FR-07 Mobile Cart     | 37          | 37       | 24     | 13     | 0       | 4      | 64.9%     |
| **Total**                 | **142**     | **141**  | **95** | **46** | **1**   | **29** | **67.9%** |

### 2.3. Bug Summary

| Feature   | Bug IDs               | Count  |
| --------- | --------------------- | ------ |
| A         | BUG-A-001 → BUG-A-006 | 6      |
| B         | BUG-B-001 → BUG-B-003 | 3      |
| C         | BUG-C-001 → BUG-C-016 | 16     |
| D         | BUG-D-001 → BUG-D-004 | 4      |
| **Total** |                       | **29** |

GitHub Issues: https://github.com/DuyITLOR/group05_eshop/issues

---

## 3. Deliverables Checklist

| #   | Deliverable                                               | Status                     |
| --- | --------------------------------------------------------- | -------------------------- |
| 1   | Main report (Markdown) — Domain Testing + BVA per feature | See `main_report.md`       |
| 2   | Feature reports (9 files × 4 features + screenshots)      | See `report/feature_*/`    |
| 3   | Bug report summary + per-feature bug reports               | See `bug_report_summary.md`|
| 4   | AI Critique (200-300 words)                               | See `ai_critique.md`       |
| 5   | AI Audit Report                                           | See `ai_audit_report.md`   |
| 6   | AI Disclosure                                             | See `ai_disclosure.md`     |
| 7   | Git commit log                                            | See `git_commit_log.txt`   |
| 8   | Agent skill (Domain-BVA Testing)                          | See `domain-bva-testing/`  |
| 9   | Human review changes                                      | See `change/`              |
| 10  | Demo video                                                | See `youtube_link.txt`     |

---

## 4. Demo Videos: 

Video skill demo: (https://youtu.be/EG2EbVmYVbA)



## 5. Self-Assessment

| No. | Criteria                              | Grade   | Self-Assessed Grade |
| --- | ------------------------------------- | ------- | ------------------- |
| 1   | Feature A (Domain + Boundary)         | 25      | 25                  |
| 2   | Feature B (Domain + Boundary)         | 25      | 25                  |
| 3   | Feature C (Domain + Boundary)         | 25      | 25                  |
| 4   | Feature D (Mobile, Domain + Boundary) | 15      | 15                  |
| 5   | Agent Skills                          | 10      | 10                  |
|     | **Total**                             | **100** | 100                 |

---

## 6. File Structure

```
23127334_HW02_AI_DomainTesting_100/
├── README.md                    # This file
├── main_report.md/.pdf          # Main report
├── bug_report_summary.md/.pdf   # Bug report summary
├── ai_critique.md/.pdf          # AI Critique (200-300 words)
├── ai_audit_report.md/.pdf      # AI Audit Report
├── ai_disclosure.md/.pdf        # AI Disclosure
├── git_commit_log.txt           # Git commit log
├── youtube_link.txt             # Demo video link
├── report/
│   ├── feature_A/               # FR-02 Login & Account Lockout
│   │   ├── 01_spec_analysis.md
│   │   ├── 02_domain_table.md
│   │   ├── 03_domain_testcases.md
│   │   ├── 04_bva_table.md
│   │   ├── 05_bva_testcases.md
│   │   ├── 06_detailed_testcases.md
│   │   ├── 07_execution.md
│   │   ├── 08_bug_report.md
│   │   ├── 09_gap_analysis.md
│   │   └── screenshots/
│   ├── feature_B/               # FR-11 Order History (same structure)
│   ├── feature_C/               # FR-14 Category CRUD (same structure)
│   └── feature_D/               # FR-07 Mobile Cart (same structure)
├── domain-bva-testing/          # Agent skill + templates
│   ├── SKILL.md
│   └── templates/               # 9 template files
└── change/                      # Changes made after human review of AI output
    ├── changes_1.md
    ├── changes_2.md
    ├── changes_3.md
    └── changes_4.md
```

---

## 7. Human Review Changes

Folder `change/` chứa các thay đổi được thực hiện sau khi review kết quả của AI, bao gồm:

- Chỉnh sửa, bổ sung test cases mà AI bỏ sót hoặc thiết kế chưa chính xác
- Cập nhật bug report sau khi xác minh lại trên SUT thực tế
- Sửa lỗi trong domain table / BVA table do AI phân tích sai boundary
- Bổ sung screenshots và evidence mà AI không thể tự tạo

> Mỗi file trong `change/` ghi rõ: nội dung gốc của AI → nội dung sau khi human review → lý do thay đổi.
