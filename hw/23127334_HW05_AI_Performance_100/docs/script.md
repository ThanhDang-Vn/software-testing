# Kịch bản quay video HW05 (demo chính + demo skill)

**Sinh viên:** Nguyễn Thành Dâng · **MSSV:** 23127334
**Bài:** HW05 Performance Testing (JMeter) · **SUT:** EShop backend (Node + SQLite) `http://localhost:3000`
**Máy chạy:** hostname `Tony`, i7-12700H, RAM ~40GB, Windows 11 · **Công cụ:** JMeter 5.6.3, Java 17, Node v20.20.2
**Ngôn ngữ thuyết minh:** tiếng Việt, giọng thật của sinh viên
**Chứng minh tác giả:** face-cam, hoặc mở terminal chạy `whoami` và `hostname` (ra `Tony`)

File này có hai kịch bản: mục A là video demo chính (tối thiểu 6 phút), mục B là video demo Agent Skill (vài phút). Quay hai video riêng, upload YouTube ở chế độ Unlisted, rồi dán link vào `README.md` mục 5.

---

## Chuẩn bị chung trước khi bấm quay

1. Đóng email, token, mật khẩu cá nhân, ẩn mọi thông báo có dữ liệu riêng tư.
2. Mở folder `hw5/` trong VS Code, đặt zoom editor 90 tới 110% cho chữ đọc được.
3. Backend EShop chạy sẵn ở `http://localhost:3000`. Nếu chưa reseed thì chạy lại `node server.js` rồi `node data/register-users.js` để có đủ 300 account.
4. Mở sẵn các file/tab sẽ chỉ trong video:
   - `README.md`
   - `docs/p1-workflow-design.md` và `docs/p1-load-params.md`
   - `testplans/23127334_Load_20260811.jmx` (và tên ba plan còn lại)
   - `results/run-summary.md`
   - một HTML dashboard bất kỳ trong `results/html/`
   - `results/endurance/endurance-summary.md`
   - `docs/misinterpretation-hunt.md`
   - `docs/continuous-perf-proposal.md`
   - `docs/bug-report.md`
   - `skill/SKILL.md`
   - `report/ai-audit-report.md`
5. Không quay lại toàn bộ ba run thật vì mỗi run mất nhiều phút và tạo hàng chục nghìn sample. Số liệu chính lấy từ `run-summary.md` và HTML dashboard có sẵn. Nếu muốn có cảnh chạy live thì dùng lệnh demo ngắn ở mục A6.

---

## A. Video demo chính (>= 6 phút)

### Lệnh demo live an toàn (tùy chọn, cho cảnh chạy ở A6)

Chạy một scenario Load ngắn để quay cảnh JMeter headless cùng Task Manager trong một khung hình. Load nhẹ, 0% error, không làm hỏng dữ liệu chính. Kết quả chính vẫn dùng bảng đã lưu.

```bash
# từ thư mục hw5/
jmeter -n -t testplans/23127334_Load_20260811.jmx -l results/img/demo-load.jtl -e -o results/img/demo-load-html
```

### Timeline và lời dẫn

| Thời gian | Thao tác màn hình | Lời dẫn gợi ý |
| --- | --- | --- |
| 00:00-00:30 | Bật face-cam hoặc chạy `whoami` và `hostname`, sau đó mở folder `hw5/` | "Xin chào, em là Nguyễn Thành Dâng, MSSV 23127334. Đây là máy tên Tony và repository em dùng để làm HW05 Performance Testing. SUT là backend EShop chạy Node và SQLite ở localhost cổng 3000." |
| 00:30-01:15 | Mở `README.md`, chỉ mục 1 và mục 5 | "Bài này đo hiệu năng một workflow mua hàng: login, tìm sản phẩm, xem chi tiết, thêm giỏ, checkout. Em chạy ba kiểu tải Load, Stress, Spike, cộng một bài endurance để tìm ngưỡng. Cả ba run đều 0% lỗi, p95 tăng dần từ Load 19ms lên Stress 32ms rồi Spike 106ms." |
| 01:15-02:05 | Mở `p1-workflow-design.md`, rồi `p1-load-params.md` | "Một workflow năm bước phủ đủ ba nhóm endpoint: auth-heavy là login, read-heavy là search và product detail, transactional là add to cart và checkout. Ba test plan dùng chung workflow đó, chỉ khác profile tải. Load là 50 VU có think-time thật, Stress đẩy tới 300 VU, Spike bơm 300 VU trong khoảng 60 giây trên nền 10 VU." |
| 02:05-02:45 | Mở bốn file `.jmx` trong `testplans/`, chỉ tên và ba listener | "Tên plan theo quy ước MSSV, loại scenario, ngày: ví dụ `23127334_Load_20260811`. Ba report view khác nhau nằm trong plan là Summary Report, Aggregate Report và View Results Tree. Dữ liệu data-driven đọc từ CSV qua CSV Data Set Config, mỗi VU một account riêng lấy từ `users.csv` để không tự khóa nhau." |
| 02:45-03:35 | Mở `run-summary.md`, chỉ bảng so sánh ALL và dòng checkout mỗi scenario | "Đây là số liệu tính trực tiếp từ raw jtl bằng script. Stress giữ throughput ổn định khoảng 125 request mỗi giây, 46 nghìn sample, 0% lỗi. Checkout luôn là bước chậm nhất ở mọi run vì đó là bước ghi orders xuống SQLite, mà SQLite khóa ghi cả file. Đây đúng chỗ nghẽn em đoán từ đầu." |
| 03:35-04:10 | Mở một HTML dashboard trong `results/html/`, chỉ biểu đồ theo thời gian | "Report HTML của JMeter cho thấy đường độ trễ theo thời gian. Sau cú spike thì đuôi độ trễ cao, p99 login lên tới 500ms, nhưng hệ thống vẫn 0 lỗi và trở về baseline khi tải rút xuống. Nghĩa là chậm dần chứ chưa gãy." |
| 04:10-04:35 | (Tùy chọn) Mở terminal chạy lệnh demo Load ở trên, để JMeter và Task Manager cùng khung | "Đây là một lần chạy live scenario Load. Bên phải là Task Manager theo dõi tiến trình node. Case này tải nhẹ, không đổi dữ liệu chính, chỉ để cho thấy quy trình chạy headless thật." |
| 04:35-05:20 | Mở `endurance/endurance-summary.md`, chỉ ngưỡng và chuỗi memory | "Để tìm trần thật, em bỏ think-time và soak 12 phút. Max stable khoảng 276 request mỗi giây, trung bình cả run 288. RAM node dao động quanh 100MB, đỉnh 117, có 48 lần tụt nên không phải memory leak. Ở ngưỡng này 54.4% request vượt 1 giây trong khi vẫn 0% lỗi, tức server xếp hàng chứ không từ chối." |
| 05:20-06:05 | Mở `misinterpretation-hunt.md`, chỉ bảng 6 chỗ AI đọc sai | "Bước quan trọng nhất là soi lại phân tích của AI. AI nói max capacity 557 request mỗi giây, nhưng đó chỉ là một bucket bất thường do GC xả hàng đợi, số đúng là 276 stable. AI nói avg 10ms nên hệ thống rất khỏe, thật ra 10ms là của tải nhẹ, ở ngưỡng avg là 1001ms. AI báo memory leak, nhưng chuỗi RAM có 48 lần giảm nên không leak. Em tách phân tích thô của AI và số đúng ra hai file riêng để trace rõ." |
| 06:05-06:40 | Mở `bug-report.md`, cuộn qua bảng tổng hợp và một hai bug | "Trong lúc smoke test em ghi nhận 5 bug đối chiếu thẳng với số dòng trong `server.js`. Nặng nhất là SQL injection ở tham số search, dòng 144 nối chuỗi thẳng vào câu SQL. Rồi login trả về nguyên mật khẩu plaintext, khóa tài khoản sau 2 lần sai thay vì 3, sản phẩm không tồn tại trả rỗng kèm mã 200, và price đổi kiểu theo id chẵn lẻ. Cả 5 đã post GitHub Issues #43 tới #47." |
| 06:40-07:05 | Mở `continuous-perf-proposal.md` rồi `report/ai-audit-report.md` | "Task 3 là mô hình chạy perf liên tục trong CI. Còn AI audit report lưu nguyên văn prompt và output của AI, tách rõ phần nào là đề xuất của AI, phần nào là quyết định của em sau review. AI chỉ tạo bản nháp, em chịu trách nhiệm cuối về pass fail và cách diễn giải." |
| 07:05-07:20 | Quay lại `README.md` mục 5 | "Đó là phần demo chính HW05. Sau khi upload video Unlisted em sẽ dán link thật vào README. Cảm ơn thầy cô đã xem." |

---

## B. Video demo Agent Skill (perf-test-jmeter)

Mục tiêu là cho thấy chạy trọn một nhóm endpoint bằng skill, đúng như phần "Demo video mình cần tự quay" trong `skill/SKILL.md`. Độ dài vài phút là đủ.

### Timeline và lời dẫn

| Thời gian | Thao tác màn hình | Lời dẫn gợi ý |
| --- | --- | --- |
| 00:00-00:25 | Chạy `whoami` và `hostname`, mở `skill/SKILL.md` | "Em là Nguyễn Thành Dâng, 23127334. Đây là Agent Skill `perf-test-jmeter`, gói lại cách em đo một nhóm endpoint REST để lần sau chỉ việc lặp lại." |
| 00:25-01:00 | Mở `skill/EXAMPLE.md`, chỉ nhóm endpoint buyer | "Skill lo sáu bước: chốt workflow, chuẩn bị CSV, sinh ba test plan từ một fragment dùng chung, chạy headless có reset, phân tích log, và soi lại phân tích. Ví dụ ở đây là nhóm endpoint buyer của EShop." |
| 01:00-01:35 | Chạy vài lệnh `curl` smoke cho login và search | "Trước khi tin tài liệu, em smoke bằng curl để xác nhận contract thật: status code, tên field, và cơ chế khóa tài khoản. Ví dụ login sai sẽ thấy `login_attempts` nhảy và bị 403 khi bị khóa." |
| 01:35-02:15 | Chạy `scripts/gen-from-fragment.js`, mở ba file `.jmx` vừa sinh | "Workflow viết một lần trong `workflow-fragment.template.xml`, rồi script này ráp thành ba plan Load, Stress, Spike. Ba plan giống hệt workflow, chỉ khác profile tải và listener. Tên plan tự đặt theo quy ước MSSV và ngày." |
| 02:15-03:05 | Chạy `scripts/run-scenario.sh` cho một scenario, quay terminal JMeter cùng Task Manager | "Script này làm tuần tự: dừng backend, khởi động lại để reseed DB, và reseed cũng chính là cách reset khóa tài khoản và làm sạch bảng orders, rồi nạp lại account, rồi chạy JMeter headless xuất jtl và HTML. Bên phải là tiến trình node trong Task Manager." |
| 03:05-03:45 | Chạy `scripts/analyze-jtl.js`, đọc bảng kết quả | "Script phân tích đọc raw jtl và tính theo từng label: samples, error phần trăm, avg, p50 tới p99, max, throughput. Nhờ vậy có ngay bảng p95 và throughput theo scenario và theo endpoint." |
| 03:45-04:20 | Mở `misinterpretation-hunt.md`, chỉ một dòng | "Bước cuối là review, chỗ AI hay đọc sai nhất. Ví dụ đừng để avg thấp che đuôi độ trễ, và throughput đo được không phải trần server nếu tải bị giới hạn bởi think-time. Muốn biết trần thật thì bỏ think-time chạy soak. Em ghi phân tích thô của AI và số đúng ra hai file khác nhau." |
| 04:20-04:35 | Quay lại `SKILL.md` phần kết quả | "Skill này tạo ra ba tới bốn file jmx đúng tên, raw jtl và HTML cho mỗi scenario, bảng p95 throughput error, và kết luận ngưỡng đã qua review. Đó là toàn bộ demo skill. Cảm ơn thầy cô." |

---

## Checklist ngay sau khi quay

- [ ] Video demo chính dài ít nhất 6 phút.
- [ ] Có giọng nói tiếng Việt của sinh viên.
- [ ] Có face-cam hoặc kết quả `whoami` và `hostname` (ra `Tony`).
- [ ] Nhìn rõ số liệu ba scenario Load, Stress, Spike và ngưỡng endurance.
- [ ] Đã giải thích ít nhất một chỗ AI đọc sai log và số đúng lấy từ raw jtl.
- [ ] Đã nhắc 5 bug và Issues #43 tới #47.
- [ ] Video skill cho thấy trọn một vòng: sinh plan, chạy, phân tích, review.
- [ ] Không lộ token, credential cá nhân, email riêng hoặc dữ liệu nhạy cảm.
- [ ] Upload YouTube ở chế độ Unlisted, không để Private.
- [ ] Dán link thật vào `README.md` mục 5 và vào `skill/`.
- [ ] Xuất lại PDF các file report đã đổi trước khi tạo ZIP nộp.

Không dùng AI narration, video tạo sinh, hay số liệu giả. Khi một run cho thấy giới hạn năng lực thật (endurance bão hòa latency), trình bày đúng như vậy, không gọi đó là "rất khỏe".
