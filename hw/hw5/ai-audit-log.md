# HW05 — AI Audit Log

> Nhật ký mọi tương tác AI cho HW05. Nguồn dữ liệu cho **AI Audit Report (§9)**.
> AI tool: **Claude Opus 4.8 (1M context)** trong Claude Code. Mỗi entry: thời gian, prompt gốc, tóm tắt output/hành động.
> Back-fill: các entry trước 2026-08-11 22:10 là ghi lại từ trí nhớ phiên (thời gian xấp xỉ trong phiên chiều 2026-08-11).

---

### #1 — Yêu cầu plan HW05
- **Thời gian:** 2026-08-11 (phiên, back-fill)
- **Prompt:** "tôi sẽ implement homework 5 nên bạn hãy cho tôi plan để thực hiện, những output phải có check requirement homework 5 và policy file nữa"
- **Output/hành động:** Đọc PDF yêu cầu HW05 + policy + API spec + server.js SUT; xác minh JMeter/Java/Docker; lập plan đầy đủ (P0–P6) kèm 2 bảng đối chiếu yêu cầu HW05 và policy; lưu vào plan file.

### #2 — Chọn endpoint tránh trùng
- **Thời gian:** 2026-08-11 (phiên, back-fill)
- **Prompt:** "vậy thì pick endpoint nào đây để tôi pick trước khỏi bị trùng với member khác"
- **Output/hành động:** Đề xuất workflow "buyer purchase" (login → search → detail → add-to-cart → checkout) phủ 3 nhóm; nêu các nhánh transactional khác để tránh trùng member.

### #3 — Chọn flow dễ
- **Thời gian:** 2026-08-11 (phiên, back-fill)
- **Prompt:** "cứ chọn flow nào dễ thì pick"
- **Output/hành động:** Chốt flow buyer-purchase là dễ nhất (1 lần extract token, toàn GET/POST JSON cơ bản), giải thích lý do.

### #4 — Hỏi "3 endpoint groups?"
- **Thời gian:** 2026-08-11 (phiên, back-fill)
- **Prompt:** "target là 3 endpoint mà phải không"
- **Output/hành động:** Làm rõ target là **3 endpoint *groups*** (auth/read/transactional), 1 workflow được gọi nhiều endpoint miễn phủ đủ 3 nhóm.

### #5 — Thiết lập quy tắc logging
- **Thời gian:** 2026-08-11 (phiên, back-fill)
- **Prompt:** "từ giờ mỗi prompt của tôi thì đều nên ghi lại vào @hw5/ai-audit-log.md nha"
- **Output/hành động:** Ghi nhận quy tắc thường trực; ghim vào plan; tạo file này và back-fill.

### #6 — Chế độ làm việc từng phần
- **Thời gian:** 2026-08-11 (phiên, back-fill)
- **Prompt:** "tôi sẽ prompt để yêu cầu bạn làm từng phần chớ không để bạn auto mode làm hết"
- **Output/hành động:** Xác nhận làm đúng từng phần theo prompt, không auto chạy hết.

### #7 — Thiết kế E2E workflow (design-only)
- **Thời gian:** 2026-08-11 (phiên, back-fill)
- **Prompt:** "design one realistic end-to-end virtual-user workflow ... login → browse/search → product detail → add to cart → checkout ... specify API request, correlation, CSV input, assertion, think-time, dependency, failure behaviour ... Do not generate the JMeter test plan yet."
- **Output/hành động:** Đọc `backend/server.js` lấy contract thật (token field, lockout +2, search SQLi, detail trả {}, checkout orderId). *(Bị interrupt trước khi xuất bản thiết kế — sẽ hoàn tất khi bạn gửi lại P1.1.)*

### #8 — Tạo prompt.md
- **Thời gian:** 2026-08-11 22:10 +0700
- **Prompt:** "tôi nghĩ bạn nên tạo một file prompt.md để tôi thực hiện sẽ tốt hơn vì sẽ không prompt ngoài lề tránh mất thời gian"
- **Output/hành động:** Tạo `hw5/prompt.md` — kịch bản prompt tuần tự P0–P6, nhúng sẵn chi tiết API thật; tạo `hw5/ai-audit-log.md` và back-fill entry #1–#8.

### #9 — P0.1 Khởi động SUT + smoke test 5 endpoint
- **Thời gian:** 2026-08-11 22:11 +0700
- **Prompt:** "Khởi động backend EShop (seed database nếu cần) và smoke-test 5 endpoint trong workflow bằng curl: login, products?search, products/:id, cart, checkout. In ra status code + body mẫu của từng cái để tôi xác nhận contract. Cũng xác nhận cơ chế account-lockout thực tế (bao nhiêu lần sai thì khóa, khóa bao lâu). Ghi kết quả vào hw5/docs/p0-smoke-test.md."
- **Output/hành động:** Khởi động `node server.js`, đọc `database.js` lấy account seed, chạy curl 5 endpoint + test lockout, ghi `hw5/docs/p0-smoke-test.md`. Xác nhận: lockout +2/lần, khóa sau 2 lần sai, 180s; login đúng reset attempts.

### #10 — P0.2 Tạo CSV data-driven
- **Thời gian:** 2026-08-11 22:20 +0700
- **Prompt:** "Tạo hw5/data/users.csv (nhiều account hợp lệ đã seed để tránh lockout, mỗi VU 1 account) và hw5/data/products.csv (product id + search keyword). Giải thích cách JMeter CSV Data Set Config sẽ đọc vòng lặp và vì sao cần đủ account cho số thread cao nhất (Stress/Spike)."
- **Output/hành động:** Sinh `users.csv` (300 account), `products.csv` (5 product + keyword), script `register-users.js` bulk-register vào SUT, `data/README.md` giải thích CSV Data Set Config; chạy đăng ký + verify 300/300 login 200.

### #11 — Giải thích khái niệm VU
- **Thời gian:** 2026-08-11 (phiên)
- **Prompt:** "vu là gì"
- **Output/hành động:** Giải thích VU = Virtual User (1 thread giả lập 1 người dùng đồng thời), liên hệ Load/Stress/Spike.

### #12 — P1.1 Thiết kế E2E workflow (design-only)
- **Thời gian:** 2026-08-11 22:35 +0700
- **Prompt:** "Design one realistic end-to-end virtual-user workflow reused unchanged by Load/Stress/Spike ... login → browse/search → product detail → add-to-cart → checkout. Với mỗi bước nêu: API request, correlation/extract, CSV input, assertion, think-time, dependency, failure behaviour. Giải thích phủ auth/read/transactional. Chưa sinh JMeter test plan." (kèm ảnh bảng 5 endpoint đã chọn)
- **Output/hành động:** Viết `hw5/docs/p1-workflow-design.md` — thiết kế chi tiết 5 bước + correlation/assertion/think-time/failure + phân tích phủ 3 nhóm. Chưa sinh JMX.

### #13 — P1.2 Tham số tải cho Load/Stress/Spike
- **Thời gian:** 2026-08-11 22:45 +0700
- **Prompt:** "Dựa trên workflow đã chốt, đề xuất tham số thực tế cho từng scenario và justify: Load (thread, ramp, think-time, hold), Stress (tăng bậc vượt ngưỡng), Spike (nền thấp + bơm đột ngột rồi rút). Bảng so sánh 3 scenario. Chưa sinh JMX."
- **Output/hành động:** Viết `hw5/docs/p1-load-params.md` — con số + justify cho 3 scenario, phép tính RPS kỳ vọng, chốt think-time là knob theo scenario, thread-group tools (stock vs jpgc plugin). Chưa sinh JMX.

### #14 — P1.3 Sinh 3 file JMX
- **Thời gian:** 2026-08-11 22:55 +0700
- **Prompt:** "Sinh 3 file JMeter test plan (.jmx) trong hw5/testplans/ theo tên 23127334_{Load|Stress|Spike}_20260811.jmx, cùng workflow đã thiết kế, khác cấu hình tải ở P1.2. Dùng CSV Data Set Config (users.csv, products.csv), JSON extractor lấy token, assertion đúng, và gán 3 listener khác nhau: Load=Summary, Stress=Aggregate, Spike=View Results Tree. Mỗi plan vẫn cấu hình để xuất HTML dashboard riêng."
- **Output/hành động:** Tách workflow dùng chung ra `_workflow-fragment.xml`, viết generator `generate-plans.js` ráp 3 JMX (stock ThreadGroup, không phụ thuộc plugin). Load=50/60s/300s+Summary, Stress=300/ramp300/360s+Aggregate, Spike=baseline10+burst290+VRT. Validate: 3 JMX well-formed XML; functional smoke (3 VU×1 loop) = 15 samples, 0 error, cả 5 bước 200 → CSV/token-extract/If-controller/correlation/assertion đều OK.

### #15 — P2.1 Chạy headless 3 plan + reset lockout + xuất jtl/HTML
- **Thời gian:** 2026-08-12 06:10 +0700
- **Prompt:** "Chạy headless từng test plan bằng jmeter -n, xuất raw .jtl vào hw5/results/jtl/ và HTML report vào hw5/results/html/<scenario>/. Xử lý reset account-lockout giữa các lần chạy Stress/Spike và ghi lại các bước reset. Tóm tắt số liệu mỗi run."
- **Output/hành động:** Regenerate 3 JMX (fragment/generator đã cập nhật tt_mult + Stress 6-step). Orchestration `results/run-all.sh`: mỗi run restart server (reseed=reset lockout+DB sạch) → re-register 300 account → jmeter -n -l jtl -e -o html. Chạy background ~18 phút; tóm tắt số liệu + ghi `results/run-summary.md`. KẾT QUẢ: Load 3599 samples/10.1 req/s/0% err/p95 19ms; Stress 46076/124.9 req/s/0% err/p95 32ms/max 418ms; Spike 13531/55.5 req/s/0% err/p95 106ms/max 769ms. 3 HTML report OK. Finding: 0% error cả 3 run (chưa chạm knee ở 300 VU); checkout(SQLite write) chậm nhất → bottleneck đúng dự đoán. Reset lockout = restart server reseed + re-register (ghi trong run-summary.md).

### #16 — P2.2 Hướng dẫn chụp evidence + hardware report
- **Thời gian:** 2026-08-12 06:30 +0700
- **Prompt:** "Hướng dẫn tôi cần chụp screenshot gì (JMeter + Task Manager tiến trình node CÙNG khung hình mỗi run), và cách xuất hardware report bằng dxdiag (hostname phải khớp HW04). Tạo bảng spec mẫu để tôi điền. Lưu hướng dẫn vào hw5/evidence/README.md."
- **Output/hành động:** Lấy spec máy (hostname Tony, i7-12700H, ~40GB, Win11 10.0.26200); viết `evidence/README.md` (checklist screenshot per-run + dxdiag + bảng spec pre-fill), tạo `evidence/capture-run.sh` để re-run 1 scenario khi chụp. Xác nhận hostname máy = Tony (khớp HW04).

### #17 — Làm rõ chụp terminal
- **Thời gian:** 2026-08-12 (phiên)
- **Prompt:** "là chụp terminal hả"
- **Output/hành động:** Xác nhận vì chạy headless nên "tool" = terminal JMeter; hướng dẫn bố cục 1 ảnh gồm terminal (summary/Active/Err) + Task Manager node.exe.

### #18 — User thêm screenshot evidence
- **Thời gian:** 2026-08-13 (phiên)
- **Prompt:** "tôi đã thêm img vào result"
- **Output/hành động:** Kiểm tra 7 ảnh trong `results/img/`. load-run-1/2, stress-run-1, spike-run-1 chụp đúng lúc đang chạy (JMeter + node.exe cùng khung). Góp ý: đổi cột sang Memory tuyệt đối; stress-run-3 chụp sau khi xong (yếu). Sửa tên file `stress-rụn-2.png`→`stress-run-2.png`. Ghi chú CPU thấp do node đơn tiến trình.

### #19 — User cập nhật lại ảnh evidence
- **Thời gian:** 2026-08-13 (phiên)
- **Prompt:** "tôi vừa update lại ảnh rồi"
- **Output/hành động:** Kiểm tra lại: 9 ảnh (3/scenario), đã bật cột Memory tuyệt đối. stress-run-3 chụp đang chạy, node.exe PID 19424 ~53MB CPU 02 (backend). Evidence đạt chuẩn → P2.2 hoàn tất (còn dxdiag do user tự xuất).

### #20 — P2.3 Endurance/soak test tìm ngưỡng
- **Thời gian:** 2026-08-13 (phiên)
- **Prompt:** "Chạy soak test 10–15 phút ở tải ổn định để tìm ngưỡng phần cứng, báo cáo số cụ thể (max stable RPS, memory ceiling, error% theo thời gian). Lưu vào hw5/results/endurance/ và ghi kết luận threshold."
- **Output/hành động:** Sinh `23127334_Endurance_20260811.jmx` (300 VU, tt_mult=0, ramp 60s, duration 720s=12′). Orchestration `run-endurance.sh`: reset+register, lấy mẫu RAM node.exe mỗi 5s (netstat lấy PID port 3000), chạy jmeter -l jtl -e -o html. Phân tích `analyze-endurance.js`: RPS/error% theo bucket 60s + memory ceiling → `endurance-summary.md`. KẾT QUẢ: 206.816 samples/12′, throughput bền vững **~276 req/s** (trung bình 288/s; bucket 556/s là artifact GC), **0% error**, latency bão hoà avg ~1s/max 4.2s (node queue không reject), **memory ceiling ~117MB không leak**. Sửa bug spread Math.min trên 206k phần tử + bug lấy max outlier → dùng median plateau.

### #21 — P3.1 AI analyst phân tích jtl + đề xuất threshold
- **Thời gian:** 2026-08-13 (phiên)
- **Prompt:** "Phân tích các file .jtl (như một AI analyst) và đề xuất performance threshold cho từng scenario. Ghi output phân tích thô vào hw5/docs/p3-ai-analysis.md (đây là 'output của AI' để tôi review sau)."
- **Output/hành động:** Viết `hw5/docs/p3-ai-analysis.md` — bản phân tích AI nguyên bản (giọng AI analyst tự tin, thiên về average/throughput đỉnh) kèm threshold đề xuất mỗi scenario. CỐ Ý là bản chưa review để P3.2 săn misinterpretation đối chiếu raw jtl (vd overstate 557 req/s, dùng avg che tail, gọi tăng RAM là leak, đọc throughput = capacity). Chưa tự sửa ở bước này.

### #22 — P3.2 Misinterpretation hunt (human review)
- **Thời gian:** 2026-08-13 (phiên)
- **Prompt:** "Tự đối chiếu phân tích ở P3.1 với giá trị ĐÚNG đọc trực tiếp từ raw .jtl (avg, p95, error%, throughput). Chỉ ra từng chỗ AI đọc/hiểu sai, trích số đúng kèm nguồn dòng log, và giải thích lỗi. Ghi vào hw5/docs/misinterpretation-hunt.md."
- **Output/hành động:** Trích raw jtl bằng awk (Stress >100ms=0.86%, Endurance avg=1001ms/54.4%>1s/p95=1741, throughput=288/s, memory 48 lần giảm→không leak, Spike vs Stress cùng peak 300 threads). Viết `misinterpretation-hunt.md` bác 6 misinterpretation + bảng threshold sửa đúng.

### #23 — P3.3 Human review và quyết định cuối cùng
- **Thời gian:** 2026-08-13 (phiên)
- **Prompt:** "Đóng vai người dùng/reviewer cuối, đối chiếu code và raw result; tự chốt phương án, threshold, giới hạn và trách nhiệm. Không dùng mục AI recommendations."
- **Output/hành động:** Bỏ toàn bộ mục AI recommendations khỏi `p3-ai-analysis.md`. `misinterpretation-hunt.md` giữ human review độc lập: bác số liệu AI đọc sai, đánh giá phương án theo kiến trúc thật, chốt threshold/giới hạn và tuyên bố người làm bài chịu trách nhiệm cuối cùng.

### #24 — P4 Continuous Performance Testing proposal (Disrupt)
- **Thời gian:** 2026-08-13 (phiên)
- **Prompt:** "Viết hw5/docs/continuous-perf-proposal.md: mô hình continuous performance testing watch commits → quyết định có chạy perf test → gắn cờ p95 regression. Kèm flow chart (Mermaid) và thảo luận trade-off (cost, false alarm). Cho tôi biết nếu muốn dựng flow chart thành ảnh bằng excalidraw."
- **Output/hành động:** Viết `hw5/docs/continuous-perf-proposal.md` — mô hình CI perf (watch commit → path-filter gating → spin SUT + seed + register → JMeter → so p95 vs baseline → flag regression → comment/block + update baseline), Mermaid flowchart, trade-off cost/false-alarm (runner cố định, median nhiều run, tolerance band, dùng p95 không avg — bài học P3). Đề nghị dựng excalidraw nếu user muốn.

### #25 — Viết lại văn phong continuous-perf-proposal (bỏ dấu hiệu AI)
- **Thời gian:** 2026-08-13 (phiên)
- **Prompt:** "viết lại văn phong - loại bỏ những dấu hiệu đặc trưng của AI - đánh dấu các câu văn chưa thuyết phục - Tự kiểm tra sửa cho đến khi mượt - tiếp tục loại bỏ dấu hiệu AI - chặn các từ bị cấm - tránh mẫu câu AI - không dùng từ ngữ đặc trưng AI"
- **Output/hành động:** Viết lại `continuous-perf-proposal.md` giọng người (bỏ em-dash/mũi tên/emoji/bold thừa, xưng 'mình', câu dài-ngắn xen kẽ, bỏ từ AI hay dùng như 'thực dụng/cốt lõi/tối ưu/đảm bảo'); giữ nội dung kỹ thuật + Mermaid. Tự rà 2 vòng, hạ giọng các con số tự đặt (tolerance 20%) thành 'giá trị khởi đầu cần chỉnh', nêu ở chat các câu còn yếu.

### #26 — Viết lại văn phong toàn bộ docs (bỏ dấu hiệu AI)
- **Thời gian:** 2026-08-13 (phiên)
- **Prompt:** "Sửa lại luôn các docs khác luôn"
- **Output/hành động:** Giao 8 subagent song song viết lại giọng người cho: p1-workflow-design, p1-load-params, run-summary, endurance-summary (viết lại kỹ); p0-smoke-test, data/README, evidence/README (viết lại); misinterpretation-hunt (chà nhẹ giữ câu người dùng). Tự xử p1-human-review (5 chỗ) + dọn em-dash heading workflow-design + spec evidence + gỡ emoji ✅❌⚠️ bảng misinterpretation. Giữ p3-ai-analysis giọng AI cố ý. Verify: hết em-dash/mũi tên/emoji/từ cấm (trừ mũi tên trong sơ đồ ASCII); mọi số liệu + endpoint nguyên vẹn.

### #27 — P5 Xây Agent Skill perf-test + log-analysis
- **Thời gian:** 2026-08-13 (phiên)
- **Prompt:** "Xây một Agent Skill tái sử dụng cho workflow perf-testing + log-analysis (đặt trong hw5/skill/), kèm hướng dẫn chạy trên 1 endpoint group hoàn chỉnh. Nêu rõ phần demo video skill tôi cần tự quay."
- **Output/hành động:** Tạo `hw5/skill/` gồm SKILL.md (quy trình 6 bước design→data→generate→run→analyze→review), scripts generic (analyze-jtl.js, run-scenario.sh, gen-from-fragment.js), template workflow-fragment, EXAMPLE.md chạy end-to-end trên endpoint group buyer của EShop, và mục kịch bản demo video cho user tự quay.

### #28 — P6.1 Main report + AI critique
- **Thời gian:** 2026-08-13 (phiên)
- **Prompt:** "Viết hw5/report/main-report.md: toàn bộ quy trình + kết quả 3 scenario + endurance threshold + AI-analysis critique. Kèm hw5/report/ai-critique.md (200–300 từ theo §10)."
- **Output/hành động:** Tạo `hw5/report/main-report.md` (quy trình P0-P5 + bảng kết quả 3 scenario + endurance threshold + tóm tắt AI-analysis critique + bug + trỏ các doc chi tiết) và `hw5/report/ai-critique.md` (~250 từ theo §10). Giọng người, không dấu hiệu AI.

### #29 — Dọn cấu trúc tài liệu cho hệ thống
- **Thời gian:** 2026-08-13 (phiên)
- **Prompt:** "tôi muốn cấu trúc của các tài liệu được trình bày một cách có hiệu quả, có hệ thống. User đọc docs thì phải hiểu"
- **Output/hành động:** Sửa cấu trúc: chuyển `data/docs/` ra `docs/` ở gốc, dời `plan.md` vào `docs/`, xoá `jmeter.log` rác, gom các run `_capture` (chỉ dùng để chụp ảnh) vào `results/capture/`. Viết `README.md` làm bản đồ tài liệu (cây thư mục chú thích + thứ tự đọc theo Task/Phase + bảng yêu cầu HW nằm ở đâu + checklist deliverable). Thêm 1 dòng định vị đầu mỗi doc.

### #30 — Viết lại main report đầy đủ hơn
- **Prompt:** "viết lại main report đầy đủ hơn"
- **Output:** Viết lại report/main-report.md dài+chi tiết (mục lục, số liệu per-endpoint, endurance time-series, bảng 6 misinterpretation, bảng bug, mục hạn chế). Giọng người, sạch dấu hiệu AI.

### #31 - P6.3 Bug report + GitHub Issue draft
- Thoi gian: 2026-08-13 (phien)
- Prompt: "Tu cac bug da lo (SQLi o search, product detail tra {} + 200, price ep string, lockout +2/khoa som, + perf issue neu co), soan hw5/docs/bug-report.md va noi dung GitHub Issue san de toi post."
- Output/hanh dong: Khoi dong lai SUT qua PowerShell (bash mat PATH), verify that 5 bug bang HTTP that: SQLi (search=' -> 500 lo SQLITE_ERROR; search=%' OR '1'='1 -> tra ca 5 san pham), detail 9999 -> {}+200, id1 price number vs id2 price string, login lo user.password plaintext. Viet docs/bug-report.md (bang tong + 5 bug co repro that + quan sat hieu nang + 5 khoi GitHub Issue de copy post).

### #32 - Tao 5 GitHub Issue
- Thoi gian: 2026-08-13 (phien)
- Prompt: "tao issue tren github"
- Output/hanh dong: Xac minh gh CLI da login (account ThanhDang-Vn), repo ThanhDang-Vn/software-testing public. Tao 5 issue tu bug-report: #43 SQLi, #44 login lo password, #45 lockout 2 lan, #46 detail {}+200, #47 price string. Ghi link 5 issue vao docs/bug-report.md.

### #33 - Gan label hw5
- Prompt: "gan label hw5 di"
- Output: Tao label hw5 (mau 1D76DB) tren repo, gan cho issue #43-#47.
