# HW05 — Prompt Playbook (kịch bản drive AI từng bước)

> Cách dùng: copy từng khối prompt (theo thứ tự) dán vào chat để tôi làm đúng 1 phần.
> Mỗi prompt cố tình cụ thể, không "chung chung" — đúng tinh thần AI-First §6.
> Mỗi prompt bạn gửi sẽ được tôi log vào `hw5/ai-audit-log.md` (nguồn cho AI Audit Report §9).

---

## Bối cảnh cố định (đã xác minh — không cần lặp lại trong từng prompt)

- StudentID: `23127334` — Nguyễn Thành Dâng — repo `github.com/ThanhDang-Vn/software-testing`
- SUT: EShop backend, base URL `http://localhost:3000` (Node + SQLite `database.sqlite`)
- Công cụ: JMeter 5.6.3 (default), Java 17, Docker. Ngày làm: `20260811`.
- AI tool: Claude Opus 4.8 (khai trong audit report).
- **E2E workflow đã chốt (dùng chung cho Load/Stress/Spike):**
  `login → search products → product detail → add-to-cart → checkout`
- **Tên test plan:** `23127334_{Load|Stress|Spike}_20260811.jmx`
- **3 report view khác nhau:** Load → Summary Report · Stress → Aggregate Report · Spike → View Results Tree

### API thật (đọc từ `backend/server.js`) — nhúng sẵn để correlation/assertion chính xác

| Bước | Request | Response chính | Ghi chú quan trọng |
|---|---|---|---|
| login | `POST /api/login` `{email,password}` | 200 `{message:"Login successful", token, user}` / 401 invalid / 403 locked | **Lockout bug:** `login_attempts += 2` mỗi lần sai, khóa khi `>=3` → thực tế **khóa sau 2 lần sai**, khóa **180s (3 phút)** |
| search | `GET /api/products?search=<kw>` | 200 mảng sản phẩm | LIKE nối chuỗi thô → **SQLi** (bug) |
| detail | `GET /api/products/:id` | 200 object sản phẩm | **Bug:** không tồn tại vẫn trả `{}` + 200; id chẵn → `price` bị ép thành string |
| add-to-cart | `POST /api/cart` (Bearer) `{id,name,price,quantity}` | 200 `{message:"Added to cart"}` | cart lưu in-memory theo user |
| checkout | `POST /api/checkout` (Bearer) `{total_amount,shipping_address}` | 200 `{message:"Checkout successful", orderId}` | ghi bảng `orders` (SQLite write) |

---

## Phase 0 — Setup & smoke test

**P0.1 — Khởi động SUT + smoke test**
```
Khởi động backend EShop (seed database nếu cần) và smoke-test 5 endpoint trong workflow bằng curl:
login, products?search, products/:id, cart, checkout. In ra status code + body mẫu của từng cái
để tôi xác nhận contract. Cũng xác nhận cơ chế account-lockout thực tế (bao nhiêu lần sai thì khóa, khóa bao lâu).
Ghi kết quả vào hw5/docs/p0-smoke-test.md.
```

**P0.2 — Tạo dữ liệu CSV data-driven**
```
Tạo hw5/data/users.csv (nhiều account hợp lệ đã seed để tránh lockout, mỗi VU 1 account)
và hw5/data/products.csv (product id + search keyword). Giải thích cách JMeter CSV Data Set Config
sẽ đọc vòng lặp và vì sao cần đủ account cho số thread cao nhất (Stress/Spike).
```

---

## Phase 1 — Task 1: thiết kế & sinh test plan bằng AI

**P1.1 — Thiết kế workflow (KHÔNG sinh JMX)**  ← *(prompt bạn đang định gửi)*
```
Design one realistic end-to-end virtual-user workflow reused unchanged by Load/Stress/Spike,
theo journey: login → browse/search → product detail → add-to-cart → checkout.
Với mỗi bước nêu: API request, biến correlation/extract, biến CSV input, assertion,
think-time thực tế, phụ thuộc bước trước, hành vi khi request fail.
Giải thích workflow phủ auth-heavy / read-heavy / transactional thế nào. Chưa sinh JMeter test plan.
```

**P1.2 — Chọn tham số tải cho từng scenario**
```
Dựa trên workflow đã chốt, đề xuất tham số thực tế cho từng scenario và justify:
- Load: thread count, ramp-up, think-time, hold duration cho tải điển hình ổn định.
- Stress: cách tăng bậc thread vượt ngưỡng đến khi lỗi/độ trễ tăng vọt.
- Spike: tải nền thấp + cú bơm đột ngột rồi rút.
Trình bày bảng so sánh 3 scenario. Chưa sinh JMX.
```

**P1.3 — Sinh 3 file JMX**
```
Sinh 3 file JMeter test plan (.jmx) trong hw5/testplans/ theo tên
23127334_{Load|Stress|Spike}_20260811.jmx, cùng workflow đã thiết kế, khác cấu hình tải ở P1.2.
Dùng CSV Data Set Config (users.csv, products.csv), JSON extractor lấy token, assertion đúng,
và gán 3 listener khác nhau: Load=Summary, Stress=Aggregate, Spike=View Results Tree.
Mỗi plan vẫn cấu hình để xuất HTML dashboard riêng.
```

**P1.4 — Human review test plan do AI sinh**
```
Tự review 3 test plan AI vừa sinh như một người review độc lập: chỉ ra chỗ AI làm sai/thiếu
(ví dụ ramp-up phi thực tế, thiếu think-time, thiếu xử lý lockout, assertion yếu, thiếu extract token),
sửa lại, và giải thích VÌ SAO AI bỏ sót (prompt/model/đặc tính endpoint).
Ghi vào hw5/docs/p1-human-review.md.
```

---

## Phase 2 — Thực thi & bằng chứng

**P2.1 — Chạy 3 scenario headless**
```
Chạy headless từng test plan bằng jmeter -n, xuất raw .jtl vào hw5/results/jtl/
và HTML report vào hw5/results/html/<scenario>/. Xử lý reset account-lockout giữa các lần chạy
Stress/Spike và ghi lại các bước reset. Tóm tắt số liệu mỗi run.
```

**P2.2 — [TÔI HƯỚNG DẪN, BẠN CHỤP] Evidence tài nguyên + phần cứng**
```
Hướng dẫn tôi cần chụp screenshot gì (JMeter + Task Manager tiến trình node CÙNG khung hình mỗi run),
và cách xuất hardware report bằng dxdiag (hostname phải khớp HW04). Tạo bảng spec mẫu để tôi điền.
Lưu hướng dẫn vào hw5/evidence/README.md.
```

**P2.3 — Endurance / soak test**
```
Chạy soak test 10–15 phút ở tải ổn định để tìm ngưỡng phần cứng, báo cáo số cụ thể
(max stable RPS, memory ceiling, error% theo thời gian). Lưu vào hw5/results/endurance/
và ghi kết luận threshold.
```

---

## Phase 3 — Task 2: AI analysis + misinterpretation hunt

**P3.1 — AI phân tích raw log**
```
Phân tích các file .jtl (như một AI analyst) và đề xuất performance threshold cho từng scenario.
Ghi output phân tích thô vào hw5/docs/p3-ai-analysis.md (đây là "output của AI" để tôi review sau).
```

**P3.2 — Misinterpretation hunt (human review)**
```
Tự đối chiếu phân tích ở P3.1 với giá trị ĐÚNG đọc trực tiếp từ raw .jtl
(avg, p95, error%, throughput). Chỉ ra từng chỗ AI đọc/hiểu sai, trích số đúng kèm nguồn dòng log,
và giải thích lỗi. Ghi vào hw5/docs/misinterpretation-hunt.md.
```

**P3.3 — Human review và quyết định cuối cùng**
```
Đóng vai người dùng/reviewer cuối: tự đánh giá các phương án kỹ thuật dựa trên code Node+SQLite thật,
loại các phương án không phù hợp, chốt ngưỡng và giới hạn kết luận. Không viết "AI recommendations".
Nêu rõ tôi chịu trách nhiệm cuối cùng cho test plan, pass/fail criteria và cách diễn giải. Ghi vào cùng file P3.2.
```

---

## Phase 4 — Task 3: Continuous Performance Testing proposal (Disrupt)

**P4.1**
```
Viết hw5/docs/continuous-perf-proposal.md: mô hình continuous performance testing watch commits →
quyết định có chạy perf test → gắn cờ p95 regression. Kèm flow chart (Mermaid) và thảo luận trade-off
(cost, false alarm). Cho tôi biết nếu muốn dựng flow chart thành ảnh bằng excalidraw.
```

---

## Phase 5 — Agent Skill

**P5.1**
```
Xây một Agent Skill tái sử dụng cho workflow perf-testing + log-analysis (đặt trong hw5/skill/),
kèm hướng dẫn chạy trên 1 endpoint group hoàn chỉnh. Nêu rõ phần demo video skill tôi cần tự quay.
```

---

## Phase 6 — Report, AI audit, git, đóng gói

**P6.1 — Main report + AI critique**
```
Viết hw5/report/main-report.md: toàn bộ quy trình + kết quả 3 scenario + endurance threshold
+ AI-analysis critique. Kèm hw5/report/ai-critique.md (200–300 từ theo §10).
```

**P6.2 — AI Audit Report**
```
Tổng hợp hw5/ai-audit-log.md thành hw5/report/ai-audit-report.md theo §9
(mỗi tương tác: tên tool AI, thời gian, prompt, output).
```

**P6.3 — Bug report + GitHub Issues draft**
```
Từ các bug đã lộ (SQLi ở search, product detail trả {} + 200, price ép string, lockout +2/khóa sớm,
+ perf issue nếu có), soạn hw5/docs/bug-report.md và nội dung GitHub Issue sẵn để tôi post.
```

**P6.4 — Git commit log + README + PDF + đóng gói**
```
Commit git theo từng step (đã làm dọc đường), export git log ra hw5/docs/git-commit-log.txt.
Viết hw5/README.md (self-assessment table + test summary + video link).
Export PDF cho main-report / ai-audit-report / ai-critique. Đóng gói zip
23127334_HW05_AI_Performance_<grade>.zip (≤20 file, ≤20MB/file, split nếu cần).
```

---

## Việc THỦ CÔNG bạn tự làm (AI không thay được)
1. Chụp screenshot JMeter + Task Manager cùng khung hình mỗi run (P2.2).
2. `dxdiag` hardware report (hostname khớp HW04).
3. Quay + thuyết minh tiếng Việt + upload YouTube unlisted (demo chính ≥6’ và demo skill).
4. Post GitHub Issues (tôi soạn sẵn nội dung).
5. Nộp Moodle đúng hạn.
