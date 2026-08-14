# HW05: Performance Testing (MSSV 23127334)

Đây là điểm vào của cả bài. Nếu bạn mới mở thư mục này, đọc từ trên xuống: mục 1 nói bài làm gì, mục 2 là cây thư mục, mục 3 là thứ tự đọc, mục 4 chỉ chỗ từng yêu cầu của đề được trả lời, mục 5 là tóm tắt kết quả.

- Họ tên: Nguyễn Thành Dâng · SUT: EShop backend (Node + SQLite) `http://localhost:3000`
- Công cụ: JMeter 5.6.3, Java 17, Node v20.20.2 · AI hỗ trợ: Claude Opus 4.8
- Máy chạy: hostname `Tony`, i7-12700H, RAM ~40GB, Windows 11

## 1. Bài này làm gì

Đo hiệu năng một workflow mua hàng của EShop (login, search, xem chi tiết, thêm giỏ, checkout) qua ba kiểu tải Load, Stress, Spike, cộng một bài endurance để tìm ngưỡng phần cứng. Sau đó dùng AI phân tích log rồi tự soi lại chỗ AI đọc sai, và đề xuất mô hình kiểm thử hiệu năng liên tục.

## 2. Cây thư mục

```
hw5/
├── README.md                  bản đồ này (đọc trước)
├── report/                    BÁO CÁO NỘP
│   ├── main-report.md         báo cáo chính, gom toàn bộ
│   ├── ai-critique.md         critique AI, 200-300 từ (§10)
│   └── ai-audit-report.md     nhật ký dùng AI (§9)   [P6.2, đang làm]
├── docs/                      TÀI LIỆU QUÁ TRÌNH (theo phase)
│   ├── plan.md                kế hoạch tổng P0-P6
│   ├── p0-smoke-test.md       xác nhận contract API + cơ chế lockout
│   ├── p1-workflow-design.md  thiết kế workflow E2E dùng chung
│   ├── p1-load-params.md      tham số tải 3 scenario + lý do
│   ├── p1-human-review.md     review lại 3 test plan AI sinh
│   ├── p3-ai-analysis.md      phân tích thô của AI (để đem soi)
│   ├── misinterpretation-hunt.md  soi chỗ AI đọc sai + phán xét đề xuất
│   ├── continuous-perf-proposal.md  mô hình CI perf (Task 3)
│   └── bug-report.md          bug ghi nhận   [P6.3, đang làm]
├── testplans/                 test plan JMeter
│   ├── 23127334_Load|Stress|Spike|Endurance_20260811.jmx
│   ├── _workflow-fragment.xml workflow dùng chung
│   └── generate-plans.js, gen-endurance.js   script ráp plan
├── data/                      dữ liệu data-driven
│   ├── users.csv (300 account), products.csv
│   ├── register-users.js      nạp account vào SUT
│   └── README.md              cách CSV Data Set Config đọc
├── results/                   KẾT QUẢ CHẠY
│   ├── run-summary.md         bảng số liệu 3 scenario
│   ├── jtl/                   raw .jtl (Load/Stress/Spike)
│   ├── html/                  HTML dashboard mỗi scenario
│   ├── img/                   ảnh JMeter + Task Manager
│   ├── endurance/             soak 12 phút: jtl, node-mem, summary
│   ├── capture/              run phụ chỉ để chụp ảnh (không phải số chính thức)
│   ├── run-all.sh, analyze-jtl.js
├── evidence/                  bằng chứng phần cứng/tài nguyên
│   ├── README.md              hướng dẫn chụp + bảng spec
│   ├── resource-monitor/, hardware/
│   └── capture-run.sh
├── skill/                     AGENT SKILL tái dùng
│   ├── SKILL.md, EXAMPLE.md, scripts/, templates/
├── prompt.md                  kịch bản prompt drive AI từng bước
└── ai-audit-log.md            nhật ký mọi prompt (nguồn cho §9)
```

## 3. Thứ tự đọc

Muốn hiểu nhanh: đọc `report/main-report.md` là đủ, nó dẫn link tới mọi thứ. Muốn theo trình tự làm bài thì đi theo phase (tên file đã đánh số theo phase nên cứ theo thứ tự):

1. `docs/plan.md`: kế hoạch và đối chiếu yêu cầu.
2. `docs/p0-smoke-test.md`: chốt contract API thật.
3. `docs/p1-workflow-design.md` rồi `docs/p1-load-params.md`: thiết kế workflow và tham số tải.
4. `docs/p1-human-review.md`: chỗ AI làm sai và mình sửa.
5. `results/run-summary.md` rồi `results/endurance/endurance-summary.md`: số liệu và ngưỡng.
6. `docs/p3-ai-analysis.md` rồi `docs/misinterpretation-hunt.md`: AI phân tích và mình soi lại.
7. `docs/continuous-perf-proposal.md`: đề xuất CI perf.
8. `skill/SKILL.md` + `skill/EXAMPLE.md`: skill tái dùng.

## 4. Yêu cầu của đề nằm ở đâu

| Yêu cầu HW05 | Trả lời tại |
|---|---|
| 3 nhóm endpoint trong 1 workflow | `docs/p1-workflow-design.md` |
| Thiết kế + sinh 3 plan bằng AI | `docs/p1-load-params.md`, `testplans/*.jmx` |
| Data-driven bằng CSV | `data/` |
| 3 report view khác nhau | Summary/Aggregate/View Results Tree trong 3 `.jmx` |
| Tên plan đúng quy ước | `23127334_{Load,Stress,Spike}_20260811.jmx` |
| Review test plan AI (human) | `docs/p1-human-review.md` |
| Chạy + evidence + reset lockout | `results/`, `evidence/`, `results/run-summary.md` |
| Endurance threshold | `results/endurance/endurance-summary.md` |
| Task 2: AI phân tích + soi sai + judge | `docs/p3-ai-analysis.md`, `docs/misinterpretation-hunt.md` |
| Task 3: continuous perf | `docs/continuous-perf-proposal.md` |
| Agent Skill | `skill/` |
| AI Audit Report (§9) + Critique (§10) | `report/ai-audit-report.md`, `report/ai-critique.md` |
| Bug report | `docs/bug-report.md` |

## 5. Tóm tắt kết quả (test summary)

| Mục | Giá trị |
|---|---|
| Scenario đã chạy | Load, Stress, Spike, Endurance |
| Nhóm endpoint phủ | auth-heavy, read-heavy, transactional (cả 3) |
| Kết quả 3 run | 0% error; p95 Load 19ms, Stress 32ms, Spike 106ms |
| Endurance threshold | max stable ~276 req/s (trung bình 288/s), memory ceiling ~117 MB không rò rỉ, 0% error suốt 12 phút |
| Số bug ghi nhận | 5, đã post GitHub Issues [#43-#47](https://github.com/ThanhDang-Vn/software-testing/issues) (xem `docs/bug-report.md`) |
| Số performance issue | 0 (không lỗi/crash; giới hạn năng lực mô tả ở phần endurance) |
| Video demo chính | [đang cập nhật link YouTube unlisted, >= 6 phút] |
| Video demo skill | [đang cập nhật link YouTube unlisted] |

## 6. Self-assessment (tạm)

| Tiêu chí | Điểm tối đa | Tự chấm |
|---|--:|--:|
| Task 1: Load | 20 | 20 |
| Task 1: Stress | 20 | 20 |
| Task 1: Spike | 20 | 20 |
| Task 2: AI analysis + misinterpretation | 10 | 10 |
| Task 3: Continuous perf proposal | 10 | 10 |
| Agent Skill | 10 | 10 |
| Tổng | 100 | 100 |

Điểm tự chấm chỉ chốt sau khi hoàn tất phần thủ công (video, dxdiag) ở mục 7.

## 7. Phần thủ công còn phải tự làm

- Chụp ảnh JMeter + Task Manager mỗi scenario (đã có trong `results/img/`), xuất `dxdiag` vào `evidence/hardware/`.
- Quay video demo chính (>= 6 phút) và video demo skill, dán link vào mục 5 và vào `skill/`.
- Đính ảnh vào 5 GitHub Issues #43-#47 đã post (response SQLi, login lộ password, màn 403 khóa tài khoản).
- Xuất PDF cho `report/main-report.md`, `report/ai-audit-report.md`, `report/ai-critique.md`.
- Đóng gói `23127334_HW05_AI_Performance_<grade>.zip` và nộp Moodle.
