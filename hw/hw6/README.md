# HW06 — API Testing

Thư mục làm việc cho bài HW06 API Testing.

## Cấu trúc

```text
hw6/
├── README.md
├── ai-audit-log.md
├── api-contracts/
├── testcases/
├── postman/
│   ├── data/
│   └── environments/
├── reports/
│   ├── newman/
│   ├── cicd/
│   └── final/
├── bugs/
│   └── screenshots/
├── evidence/
│   ├── postman/
│   ├── newman/
│   └── cicd/
└── agent-generator/
```

## Quy ước nội dung

- `api-contracts/`: đặc tả và tài liệu hợp đồng API.
- `testcases/`: test case API. Thư mục hiện chỉ là placeholder; chưa có test case nào được sinh.
- `postman/data/`: dữ liệu chạy collection.
- `postman/environments/`: Postman environment.
- `reports/newman/`: báo cáo chạy Newman.
- `reports/cicd/`: báo cáo từ pipeline CI/CD.
- `reports/final/`: báo cáo tổng kết.
- `bugs/screenshots/`: ảnh minh chứng cho bug.
- `evidence/`: bằng chứng chạy bằng Postman, Newman và CI/CD.
- `agent-generator/`: tài liệu hoặc mã nguồn của agent sinh test trong các bước sau.
- `ai-audit-log.md`: nhật ký đầy đủ các tương tác AI phục vụ bài làm.

## Trạng thái setup

Scaffold ban đầu đã được tạo. Chưa tạo API contract, test case, Postman collection, dữ liệu kiểm thử hay báo cáo.
