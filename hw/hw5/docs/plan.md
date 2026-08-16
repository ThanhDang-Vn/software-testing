 HW05 — Performance Testing (JMeter + AI) — Implementation Plan

 Context

 HW05 yêu cầu làm Performance Testing trên SUT EShop (backend REST API, Node + SQLite, base URL http://localhost:3000) theo chiến lược AI-First: dùng AI để thiết
 kế/generate 3 test plan (Load / Stress / Spike) trên cùng một E2E workflow phủ 3 nhóm endpoint (auth-heavy, read-heavy, transactional), tự review-sửa, chạy thật có
 bằng chứng tài nguyên, dùng AI phân tích log rồi "săn" chỗ AI hiểu sai, và đề xuất pipeline continuous performance testing.

 Bối cảnh môi trường đã xác minh:
 - StudentID: 23127334 — Nguyễn Thành Dâng — repo https://github.com/ThanhDang-Vn/software-testing
 - Công cụ: JMeter 5.6.3 (đã cài), Java 17, Docker đều sẵn. k6 KHÔNG có → dùng JMeter (default).
 - SUT chạy: cd eshop-sut/backend && npm install && node database.js && node server.js → http://localhost:3000. DB là SQLite file đơn (database.sqlite) → sẽ thắt cổ
 chai sớm (tốt để tìm endurance threshold).
 - Admin mặc định: admin@eshop.com / admin123.
 - Ngày làm bài: 2026-08-11 → YYYYMMDD = 20260811.

 Endpoint map (từ api_specification.md) cho E2E workflow duy nhất:
 - Auth-heavy: POST /api/login (kèm xử lý account-lockout sau 3 lần sai — FR-02).
 - Read-heavy: GET /api/products?search=, GET /api/products/:id, GET /api/categories.
 - Transactional: POST /api/cart, POST /api/apply-coupon, POST /api/checkout (cần JWT từ login).

 E2E workflow: login → search products → view product detail → add-to-cart → (apply coupon) → checkout. Một luồng phủ cả 3 nhóm; 3 test plan chỉ khác tải
 (thread/ramp/duration/pattern).

 ---
 Điểm số & trọng số (mục 15 HW05)

 ┌───────┬─────────────────────────────────────────────────────────────────────────────┬──────┐
 │   #   │                                  Tiêu chí                                   │ Điểm │
 ├───────┼─────────────────────────────────────────────────────────────────────────────┼──────┤
 │ 1     │ Task 1 — Load testing                                                       │   20 │
 ├───────┼─────────────────────────────────────────────────────────────────────────────┼──────┤
 │ 2     │ Task 1 — Stress testing                                                     │   20 │
 ├───────┼─────────────────────────────────────────────────────────────────────────────┼──────┤
 │ 3     │ Task 1 — Spike testing                                                      │   20 │
 ├───────┼─────────────────────────────────────────────────────────────────────────────┼──────┤
 │ 4     │ Task 2 — AI analysis + misinterpretation hunt (kèm giá trị đúng từ raw log) │   10 │
 ├───────┼─────────────────────────────────────────────────────────────────────────────┼──────┤
 │ 5     │ Task 3 — Continuous Performance Testing proposal (G9.6)                     │   10 │
 ├───────┼─────────────────────────────────────────────────────────────────────────────┼──────┤
 │ 6     │ Agent Skill                                                                 │   10 │
 ├───────┼─────────────────────────────────────────────────────────────────────────────┼──────┤
 │ Total │                                                                             │  100 │
 └───────┴─────────────────────────────────────────────────────────────────────────────┴──────┘

 ---
 Cấu trúc thư mục submission (theo chuẩn HW04)

 software-testing/hw/hw5/23127334_HW05_AI_Performance_<grade>/
 ├── README.md                      # self-assessment table + test summary + video link
 ├── report/
 │   ├── main-report.md / .pdf       # perf report + AI-analysis critique
 │   ├── ai-audit-report.md / .pdf
 │   └── ai-critique.md / .pdf        # 200–300 từ
 ├── testplans/
 │   ├── 23127334_Load_20260811.jmx
 │   ├── 23127334_Stress_20260811.jmx
 │   └── 23127334_Spike_20260811.jmx
 ├── data/
 │   ├── users.csv                    # credentials (data-driven)
 │   └── products.csv                 # product IDs / search terms
 ├── results/
 │   ├── jtl/    (3 raw .jtl đầy đủ)
 │   ├── html/   (3 HTML report folders)
 │   └── endurance/ (jtl + html soak test)
 ├── evidence/
 │   ├── resource-monitor/  (screenshot Task Manager + JMeter cùng khung hình)
 │   └── hardware/          (dxdiag + bảng spec; hostname khớp HW04)
 ├── docs/
 │   ├── misinterpretation-hunt.md
 │   ├── continuous-perf-proposal.md  (+ flow chart)
 │   ├── bug-report.md
 │   └── git-commit-log.txt
 └── skill/  (Agent Skill + link demo video)

 ---
 Kế hoạch theo phase

 Phase 0 — Setup & baseline (branch homework5)

 1. Tạo branch git homework5, tạo skeleton thư mục trên.
 2. Khởi động backend SUT (node database.js seed, node server.js), smoke-test bằng curl 3 nhóm endpoint để lấy body/response mẫu + xác nhận cơ chế lockout 3-fail.
 3. Chuẩn bị users.csv (nhiều account đã seed/đăng ký sẵn để tránh lockout) và products.csv (id + search term).

 Phase 1 — Task 1: Thiết kế test plan bằng AI (có audit log)

 1. Drive AI từng bước (ghi lại toàn bộ prompt/output vào AI Audit Report): (a) chọn workflow & mapping 3 nhóm endpoint; (b) chọn tham số thực tế (think-time, ramp-up,
 thread/VU) cho từng scenario; (c) sinh JMX.
 2. Xây 3 file .jmx — cùng E2E workflow, khác cấu hình tải:
   - Load (23127334_Load_20260811.jmx): tải ổn định điển hình (vd ~50 VU, ramp 30s, think-time 1–3s, giữ ~5 phút).
   - Stress (23127334_Stress_20260811.jmx): tăng dần vượt ngưỡng (vd 50→300 VU theo bậc) đến khi lỗi/độ trễ tăng vọt.
   - Spike (23127334_Spike_20260811.jmx): tải nền thấp rồi bơm đột ngột (vd 10→300 VU tức thời) rồi rút.
 3. Data-driven: CSV Data Set Config đọc users.csv, products.csv.
 4. 3 report view KHÁC nhau (không lặp): Load → Summary Report, Stress → Aggregate Report, Spike → View Results Tree (mỗi plan vẫn xuất HTML dashboard riêng).
 5. Assertions đúng: Response Code + JSON assertion (vd login trả token, checkout trả order id).
 6. Human review: viết mục "AI got wrong/missed" — ví dụ ramp-up phi thực tế, thiếu think-time, thiếu xử lý lockout, assertion yếu — và giải thích vì sao AI bỏ sót
 (prompt/model/đặc tính endpoint).

 Phase 2 — Thực thi & bằng chứng (mỗi run = 1 raw .jtl + 1 HTML folder)

 1. Chạy headless từng scenario:
 jmeter -n -t testplans/<plan>.jmx -l results/jtl/<scenario>.jtl -e -o results/html/<scenario>/
 2. [THỦ CÔNG] Chụp screenshot JMeter + Task Manager (tiến trình node) trong cùng khung hình cho mỗi run.
 3. [THỦ CÔNG] Hardware report: dxdiag + bảng spec; hostname phải khớp HW04 (anti-cheat mục 11).
 4. Xử lý lockout 3-fail giữa Stress/Spike: ghi lại các bước reset (seed lại / reset account) vào report.
 5. Endurance/soak test 10–15 phút tải ổn định → tìm ngưỡng phần cứng với số cụ thể (max stable RPS, memory ceiling) → lưu vào results/endurance/.
 6. [THỦ CÔNG] Quay demo video ≥6 phút (JMeter + resource monitor cùng khung, thuyết minh tiếng Việt), upload YouTube unlisted.

 Phase 3 — Task 2: AI analysis + misinterpretation hunt

 1. Đưa raw .jtl cho AI phân tích + đề xuất performance threshold (ghi prompt/output vào audit).
 2. Human review: đối chiếu số AI nói vs giá trị đúng đọc trực tiếp từ .jtl (avg/p95/error%/throughput), chỉ ra từng chỗ AI đọc sai + trích số đúng.
 3. Human review cuối: người làm bài tự đối chiếu code Node+SQLite, raw JTL và profile tải; tự đánh giá phương án kỹ thuật, chốt threshold/giới hạn và chịu trách nhiệm cho quyết định cuối. Không dùng mục "AI recommendations".
 4. Ghi docs/misinterpretation-hunt.md.

 Phase 4 — Task 3: Continuous Performance Testing proposal (Disrupt, G9.6)

 - Viết docs/continuous-perf-proposal.md: mô hình watch commits → quyết định chạy perf test → gắn cờ p95 regression; kèm flow chart (Mermaid, có thể dựng bằng skill
 excalidraw nếu muốn ảnh) + thảo luận trade-off (cost, false alarm).

 Phase 5 — Agent Skill

 - Xây skill tái sử dụng cho workflow perf-testing + log-analysis (đặt trong skill/), kèm mô tả cách chạy trên 1 endpoint group hoàn chỉnh. [THỦ CÔNG] quay demo video
 skill (YouTube).

 Phase 6 — Docs, AI audit, git, đóng gói

 1. Main report (MD): mô tả toàn bộ quy trình + kết quả 3 scenario + endurance threshold + AI-analysis critique.
 2. AI Audit Report (mục 9): mỗi tương tác gồm tên tool AI / thời gian / prompt / output. Nếu không dùng AI phải khai rõ (ta có dùng → khai đầy đủ).
 3. AI Critique 200–300 từ (mục 10).
 4. Bug report + draft GitHub Issues (kèm screenshot). [THỦ CÔNG] post issue lên GitHub.
 5. Git commit theo từng step (mỗi test plan, AI analysis, proposal...) → export git log ra docs/git-commit-log.txt.
 6. README.md: self-assessment table + test summary (scenarios run, endpoint groups, endurance threshold có số, số bug/perf issue, link video).
 7. Save-As-PDF cho các file MD (policy bắt buộc bản PDF kèm MD).
 8. Đóng gói zip 23127334_HW05_AI_Performance_<grade>.zip — ≤20 file, mỗi file ≤20MB (split-zip nếu HTML/jtl lớn).

 ---
 ✅ Bảng đối chiếu YÊU CẦU HW05 (requirement check)

 ┌───────────────────────┬────────────────────────────────────────────────────────────────────────┬──────────────────────────────────────────┬─────────────────────┐
 │       Mục HW05        │                                Yêu cầu                                 │          Deliverable trong plan          │       Ai làm        │
 ├───────────────────────┼────────────────────────────────────────────────────────────────────────┼──────────────────────────────────────────┼─────────────────────┤
 │ §5 Scope              │ 3 nhóm endpoint (auth/read/transactional), không trùng thành viên      │ E2E workflow phủ cả 3                    │ AI+tôi              │
 ├───────────────────────┼────────────────────────────────────────────────────────────────────────┼──────────────────────────────────────────┼─────────────────────┤
 │ §6 T1 Design w/ AI    │ Drive AI từng bước, 3 plan Load/Stress/Spike cùng workflow, tham số    │ 3 JMX + audit log + justify              │ AI+tôi              │
 │                       │ thực tế + justify                                                      │                                          │                     │
 ├───────────────────────┼────────────────────────────────────────────────────────────────────────┼──────────────────────────────────────────┼─────────────────────┤
 │ §6 T1 Data-driven     │ CSV parameterize                                                       │ users.csv, products.csv + CSV Data Set   │ tôi                 │
 │                       │                                                                        │ Config                                   │                     │
 ├───────────────────────┼────────────────────────────────────────────────────────────────────────┼──────────────────────────────────────────┼─────────────────────┤
 │ §6 T1 3 report views  │ 3 listener khác nhau                                                   │ Summary / Aggregate / View Results Tree  │ tôi                 │
 ├───────────────────────┼────────────────────────────────────────────────────────────────────────┼──────────────────────────────────────────┼─────────────────────┤
 │ §6 T1 Naming          │ {StudentID}_{ScenarioType}_{YYYYMMDD}                                  │ 23127334_Load_20260811.jmx...            │ tôi                 │
 ├───────────────────────┼────────────────────────────────────────────────────────────────────────┼──────────────────────────────────────────┼─────────────────────┤
 │ §6 T1 Human review    │ Nêu lỗi/thiếu sót của AI + lý do                                       │ mục trong main report                    │ tôi                 │
 ├───────────────────────┼────────────────────────────────────────────────────────────────────────┼──────────────────────────────────────────┼─────────────────────┤
 │ §6 T1 Run + evidence  │ 3 run + screenshot tool & resource + hardware report; reset lockout    │ jtl + HTML + screenshots + dxdiag        │ THỦ CÔNG chụp       │
 ├───────────────────────┼────────────────────────────────────────────────────────────────────────┼──────────────────────────────────────────┼─────────────────────┤
 │ §6 T1 Endurance       │ soak 10–15’, số cụ thể (RPS, mem)                                      │ results/endurance/ + số                  │ tôi                 │
 ├───────────────────────┼────────────────────────────────────────────────────────────────────────┼──────────────────────────────────────────┼─────────────────────┤
 │ §6 T1 Demo video      │ YouTube unlisted ≥6’, tool+monitor cùng khung, tiếng Việt              │ link video                               │ THỦ CÔNG quay       │
 ├───────────────────────┼────────────────────────────────────────────────────────────────────────┼──────────────────────────────────────────┼─────────────────────┤
 │ §6 T1 Report issues   │ GitHub Issues + screenshot                                             │ bug-report.md + issues                   │ tôi draft / THỦ     │
 │                       │                                                                        │                                          │ CÔNG post           │
 ├───────────────────────┼────────────────────────────────────────────────────────────────────────┼──────────────────────────────────────────┼─────────────────────┤
 │ §6 T2 Analyse w/ AI   │ AI phân tích jtl + đề xuất threshold                                   │ audit + analysis                         │ AI+tôi              │
 ├───────────────────────┼────────────────────────────────────────────────────────────────────────┼──────────────────────────────────────────┼─────────────────────┤
 │ §6 T2                 │ Trích giá trị đúng từ raw jtl                                          │ misinterpretation-hunt.md                │ tôi                 │
 │ Misinterpretation     │                                                                        │                                          │                     │
 ├───────────────────────┼────────────────────────────────────────────────────────────────────────┼──────────────────────────────────────────┼─────────────────────┤
 │ §6 T2 Judge recs      │ feasible vs hallucinated                                               │ mục trong report                         │ tôi                 │
 ├───────────────────────┼────────────────────────────────────────────────────────────────────────┼──────────────────────────────────────────┼─────────────────────┤
 │ §6 T3 Continuous PT   │ mô hình + flow chart + trade-off                                       │ continuous-perf-proposal.md              │ tôi                 │
 ├───────────────────────┼────────────────────────────────────────────────────────────────────────┼──────────────────────────────────────────┼─────────────────────┤
 │ §7 Agent Skill        │ skill tái sử dụng + demo video                                         │ skill/ + link                            │ tôi / THỦ CÔNG quay │
 ├───────────────────────┼────────────────────────────────────────────────────────────────────────┼──────────────────────────────────────────┼─────────────────────┤
 │ §9 AI Audit Report    │ tool/time/prompt/output mỗi tương tác                                  │ ai-audit-report.md(+PDF)                 │ tôi                 │
 ├───────────────────────┼────────────────────────────────────────────────────────────────────────┼──────────────────────────────────────────┼─────────────────────┤
 │ §10 AI Critique       │ 200–300 từ                                                             │ ai-critique.md(+PDF)                     │ tôi                 │
 ├───────────────────────┼────────────────────────────────────────────────────────────────────────┼──────────────────────────────────────────┼─────────────────────┤
 │ §11 Anti-cheat        │ filename, raw jtl đầy đủ, video thật, hostname khớp                    │ tuân thủ                                 │ tôi + THỦ CÔNG      │
 ├───────────────────────┼────────────────────────────────────────────────────────────────────────┼──────────────────────────────────────────┼─────────────────────┤
 │ §12 Git commit log    │ commit từng step + log text                                            │ git-commit-log.txt                       │ tôi                 │
 ├───────────────────────┼────────────────────────────────────────────────────────────────────────┼──────────────────────────────────────────┼─────────────────────┤
 │ §14 Zip contents      │ đủ mọi mục                                                             │ cấu trúc thư mục ở trên                  │ tôi                 │
 └───────────────────────┴────────────────────────────────────────────────────────────────────────┴──────────────────────────────────────────┴─────────────────────┘

 ✅ Bảng đối chiếu POLICY file (2026 Homework Policies)

 ┌───────────────────────┬───────────────────────────────────────────────────────────┬────────────────────────────────────────────────────┐
 │        Policy         │                          Yêu cầu                          │                    Cách đáp ứng                    │
 ├───────────────────────┼───────────────────────────────────────────────────────────┼────────────────────────────────────────────────────┤
 │ Individual Work       │ bài cá nhân                                               │ tự làm, khai AI                                    │
 ├───────────────────────┼───────────────────────────────────────────────────────────┼────────────────────────────────────────────────────┤
 │ AI Disclosure         │ khai theo AI Usage Guideline                              │ AI Audit Report + Critique                         │
 ├───────────────────────┼───────────────────────────────────────────────────────────┼────────────────────────────────────────────────────┤
 │ Text-based / Markdown │ mọi bài viết bằng MD                                      │ tất cả docs là .md                                 │
 ├───────────────────────┼───────────────────────────────────────────────────────────┼────────────────────────────────────────────────────┤
 │ PDF Copies            │ kèm bản Save-As-PDF                                       │ export PDF cho main report, AI audit, critique     │
 ├───────────────────────┼───────────────────────────────────────────────────────────┼────────────────────────────────────────────────────┤
 │ Git usage             │ dùng Git + commit mỗi step                                │ branch homework5 + commit log                      │
 ├───────────────────────┼───────────────────────────────────────────────────────────┼────────────────────────────────────────────────────┤
 │ Self-Assessment       │ tự chấm theo rubric                                       │ bảng trong README + report                         │
 ├───────────────────────┼───────────────────────────────────────────────────────────┼────────────────────────────────────────────────────┤
 │ File Naming (zip)     │ StudentID_ExerciseID_SelfAssessedGrade.zip, grade 000–100 │ 23127334_HW05_AI_Performance_<grade>.zip           │
 ├───────────────────────┼───────────────────────────────────────────────────────────┼────────────────────────────────────────────────────┤
 │ File Restrictions     │ ≤20 file, ≤20MB/file                                      │ split-and-zip nếu cần                              │
 ├───────────────────────┼───────────────────────────────────────────────────────────┼────────────────────────────────────────────────────┤
 │ Online Links Policy   │ không lạm dụng link                                       │ chỉ link video demo + repo, nội dung nằm trong zip │
 ├───────────────────────┼───────────────────────────────────────────────────────────┼────────────────────────────────────────────────────┤
 │ Late/Moodle           │ nộp Moodle, không trễ                                     │ THỦ CÔNG nộp                                       │
 └───────────────────────┴───────────────────────────────────────────────────────────┴────────────────────────────────────────────────────┘

 ---
 Các việc BẮT BUỘC bạn (người) tự làm — AI/tôi không thay được

 1. Chụp screenshot JMeter + Task Manager cùng khung hình mỗi run.
 2. Chạy dxdiag xuất hardware report (hostname khớp HW04).
 3. Quay + thuyết minh tiếng Việt + upload YouTube unlisted (demo chính ≥6’ và demo skill).
 4. Post GitHub Issues cho bug (tôi soạn sẵn nội dung + ảnh chèn).
 5. Nộp Moodle đúng hạn.

 ---
 Verification (kiểm chứng cuối)

 - Backend chạy OK: curl http://localhost:3000/api/products trả JSON.
 - Mỗi JMX chạy headless không lỗi cấu hình; sinh đúng .jtl + folder HTML mở được index.html.
 - Assertion pass ở tải nhẹ; error% tăng đúng kỳ vọng ở Stress/Spike.
 - Endurance test cho ra con số threshold cụ thể.
 - Đối chiếu số trong report == số đọc từ raw .jtl.
 - Đủ 100% dòng trong 2 bảng đối chiếu ở trên; zip đúng tên + ≤20 file/≤20MB.

 Câu hỏi cần bạn quyết trước khi build (nếu có)

 - Self-assessed grade để đặt tên zip (có thể để tạm 090, chỉnh cuối).
 - Có cần dựng flow chart Task 3 bằng ảnh (skill excalidraw) hay Mermaid text là đủ.
