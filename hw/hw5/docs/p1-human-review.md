# P1.4. Human review độc lập ba test plan AI sinh

## Phạm vi và cách review

Tôi review trực tiếp ba file `23127334_{Load|Stress|Spike}_20260811.jmx`, không mặc định rằng mô tả trong P1.1/P1.2 đã được generator triển khai đúng. Tôi đối chiếu bốn lớp: profile tải, workflow/correlation, oracle (assertion), và khả năng vận hành an toàn với endpoint thật. Kết luận ban đầu: XML hợp lệ và smoke test nhỏ có thể chạy xanh, nhưng **chưa đủ để chứng minh ba kịch bản đo đúng mục tiêu**.

## Các lỗi chung của cả ba plan

| Mức độ | AI làm sai/thiếu | Hậu quả đo lường | Sửa đã thực hiện |
|---|---|---|---|
| Cao | Tài liệu nói Stress/Spike dùng think-time `0.3×`, nhưng JMX ghi cứng cùng timer như Load. | Stress/Spike tạo ít RPS hơn dự kiến; có thể kết luận nhầm rằng SUT chịu được 300 VU. | Parameter hóa toàn bộ timer bằng biến `tt_mult`; Load=`1.0`, Stress/Spike=`0.3`. Workflow vẫn cùng cấu trúc. |
| Cao | Checkout chỉ được chặn bởi `authToken`; add-to-cart lỗi vẫn tiếp tục checkout. | Sinh giao dịch không hợp lệ về nghiệp vụ, làm tăng write load và che lỗi ở cart. | Sau cart ghi `cartOk = prev.isSuccessful()` và bọc checkout bằng `If cart succeeded`. |
| Cao | Assertion nội dung chủ yếu là phép “contains”: `token`, `Added to cart`, `Checkout successful`, `name`. | Body lỗi như `{"error":"token missing"}` vẫn có thể qua assertion chứa chữ `token`; không kiểm tra kiểu/giá trị JSON. | Giữ code=200 và correlation hiện có, đồng thời yêu cầu oracle khi chạy chính thức: parse JSON, token/orderId phải tồn tại và khác rỗng; message phải bằng chính xác contract; detail phải có `id` khớp `${found_id}`. Đây là tiêu chí bắt buộc trước P2, không dùng riêng substring để kết luận pass. |
| Trung bình | Search extractor có default `${product_id}`. Khi search rỗng/sai, flow vẫn gọi detail và có thể hoàn tất mua hàng. | Correlation lỗi bị che; report chỉ đỏ search nhưng các bước sau tạo tải từ dữ liệu fallback, không còn là một E2E journey hợp lệ. | Tách mục đích: không dùng fallback trong run đo E2E chính; nếu `found_id` rỗng thì đánh fail và bỏ cart/checkout của iteration. Fallback chỉ phù hợp diagnostic run riêng. |
| Trung bình | CSV `shareMode.all + recycle=true` không bảo đảm “mỗi VU một account” trong suốt test; nó cấp dòng theo lượt đọc toàn cục và đổi account ở vòng sau. | Khó truy dấu một VU/account; hai Thread Group Spike cùng tranh cursor. | Sửa mô tả: 300 dòng bảo đảm đủ credential hợp lệ cho 300 lượt đọc đồng thời đầu tiên, không bảo đảm affinity. Nếu cần affinity, nạp dữ liệu theo `__threadNum`/setup script hoặc chia CSV theo Thread Group. |
| Trung bình | Không có SLA assertion (ví dụ latency tối đa). | Functional error%=0 nhưng p95 có thể đã không chấp nhận được. | Không thêm duration assertion cứng vào raw plan vì mục tiêu Stress là vượt ngưỡng; thay vào đó chấm SLA khi phân tích theo scenario/phase: Load p95 theo baseline đã chốt, Stress xác định knee, Spike so recovery với pre-spike. |
| Thấp | Timer là con của sampler nên JMeter áp dụng **trước** sampler, dù tên ghi “post-…”. | Tên hiển thị gây hiểu sai timeline; lần login đầu cũng bị delay pacing. | Giữ vị trí vì khoảng nghỉ giữa hai request vẫn đúng về thời gian, nhưng diễn giải timer là “think trước request kế tiếp”; lần chạy đo cần warm-up và loại khỏi cửa sổ steady-state. |

## Review riêng từng test plan

### 1. Load

**Sai:** `50 VU, ramp=60s, duration=300s` nghĩa là scheduler kết thúc sau tổng cộng 300 giây; do đó chỉ có khoảng **240 giây ở đủ 50 VU**, không phải “ramp 60s + hold 300s” như P1.2. Trung bình toàn run vì thế trộn warm-up với steady-state và có ít dữ liệu ổn định hơn tuyên bố.

**Sửa:** đổi duration thành **360s**: ramp 60s rồi giữ đủ 50 VU khoảng 300s. Khi báo cáo phải lọc/đánh dấu cửa sổ steady-state, không lấy một average duy nhất cho toàn file.

**Điểm còn phải hiệu chỉnh bằng thực nghiệm:** con số 50 VU chỉ là giả thuyết “shop nhỏ”, chưa bắt nguồn từ production traffic, SLO hay baseline phần cứng. Sau một calibration run cần chốt arrival/RPS mục tiêu; VU không tự nó đại diện tải nếu think-time hoặc latency thay đổi.

### 2. Stress

**Sai nghiêm trọng:** tài liệu yêu cầu `50 tới 300`, tăng **+50 mỗi 60s**, nhưng JMX cũ chỉ có một Thread Group `300 threads / ramp 300s`. Đây là ramp tuyến tính khoảng 1 VU/s, không có plateau 60s. Vì không có cửa sổ giữ từng mức tải, không thể quy p95/error% cho từng bậc và khó xác định knee. Think-time cũng chưa được nén nên RPS kỳ vọng trong tài liệu không đúng với plan.

**Sửa:** dùng sáu stock Thread Group, mỗi nhóm thêm 50 VU, delay lần lượt `0/60/120/180/240/300s`, ramp 10s; tất cả kết thúc tại khoảng giây 370. Như vậy có các plateau gần 50, 100, 150, 200, 250 và 300 VU; bậc cuối có khoảng 60s sau ramp. Đặt `tt_mult=0.3`.

**Giới hạn đã ghi nhận:** stock Thread Group dừng đồng thời, chưa tạo ramp-down mềm 60s. Điều này chấp nhận được cho run tìm knee, nhưng nếu mục tiêu gồm đo phục hồi thì cần plugin Concurrency/Ultimate Thread Group hoặc thêm nhóm recovery riêng; không được tuyên bố plan hiện tại đã đo ramp-down 60s.

### 3. Spike

**Đúng một phần:** hai Thread Group tạo nền 10 VU và thêm 290 VU sau 60s, ramp 5s; tổng gần 300 VU rồi trở lại 10 VU. Đây là hình dạng spike hợp lý hơn Stress cũ.

**Thiếu/sai:** JMX cũ dùng think-time đầy đủ thay vì `0.3×`; View Results Tree bật ghi mọi sample (`error_logging=false`) có thể tiêu thụ heap/CPU của chính load generator, đặc biệt ở spike, làm kết quả bị observer effect. Ngoài ra report gộp hai Thread Group nhưng không tự phân đoạn baseline/spike/recovery, nên average toàn run không trả lời khả năng phục hồi.

**Sửa:** đặt `tt_mult=0.3`; khi chạy headless chỉ lưu JTL cần thiết và HTML dashboard, không mở GUI trong lúc bơm tải. View Results Tree chỉ dùng để điều tra lỗi ở một run nhỏ hoặc cấu hình chỉ lỗi. Phân tích theo timestamp: pre-spike (sau warm-up đến 60s), spike (60–120s), recovery (120–245s), rồi so p95/error% recovery với pre-spike.

## Xử lý account lockout

Plan dùng credential hợp lệ nên **không chủ động kiểm thử lockout**; đây là lựa chọn đúng cho performance journey vì sai password sẽ biến test thành security/negative test. Tuy nhiên thiếu phương án vận hành khi dữ liệu bẩn hoặc run trước đã khóa account:

1. Trước mỗi run, chạy preflight login cho tập account và xác nhận 200; account trả 403 phải được reset/chờ đủ **180 giây**, không đưa vào run.
2. Trong run, login 401/403 phải fail sample, xóa token của iteration và bỏ cart/checkout; tuyệt đối không retry password ngay vì implementation tăng `login_attempts` **2 mỗi lần sai** và thực tế khóa sau hai lần sai.
3. Báo cáo riêng số 401 và 403. Không gộp chúng vào “server error” 5xx và không dùng retry để làm đẹp error rate.
4. Không tái sử dụng file DB/trạng thái lockout giữa các scenario mà không ghi lại bước reset, vì thứ tự chạy có thể làm scenario sau bất lợi giả tạo.

## Vì sao AI bỏ sót

### Do prompt

Prompt P1.3 liệt kê thành phần cần có nhưng không yêu cầu một **traceability check** từ từng con số P1.2 sang thuộc tính JMX. Vì vậy model ưu tiên “sinh được ba XML hợp lệ” và listener đúng tên, nhưng không chứng minh semantics của scheduler. Prompt cũng nói workflow dùng chung “không đổi” trong khi P1.2 lại đổi think-time theo scenario; mâu thuẫn nhẹ này khiến generator chọn copy nguyên fragment và quên triển khai multiplier.

Prompt không yêu cầu negative-path table cho login/cart/checkout, không yêu cầu JSON schema/value assertion, và không bắt kiểm tra observer overhead. Các từ chung như “assertion đúng” cho model quá nhiều khoảng diễn giải; substring assertion là mẫu JMeter dễ sinh nhất nên được chọn.

### Do model/generation approach

Model chăm cho cấu trúc nhìn hợp lý và XML well-formed, nhưng dễ đánh đồng **cú pháp hợp lệ** với **mô hình tải đúng**. Việc generator tái dùng một fragment làm ba plan giảm duplication nhưng cũng nhân cùng một lỗi sang cả ba. Smoke `3 VU × 1 loop, 0 error` chỉ chứng minh happy-path contract/correlation ở tải nhỏ; nó không phát hiện ramp profile, timer multiplier, recovery window hay load-generator overhead.

### Do đặc tính endpoint/SUT

- `/api/login` có hành vi bất thường: mỗi password sai tăng attempts thêm 2 và khóa 180s. Một model dựa vào lockout phổ biến “3 lần sai” sẽ thiết kế retry nguy hiểm nếu không đọc code/smoke result.
- `/api/products/:id` trả `{}` với HTTP 200 khi không tìm thấy, nên chỉ assert status code là oracle yếu; endpoint buộc phải kiểm tra nội dung/identity.
- Giá của product id chẵn có thể là string, trong khi Groovy cũ dùng `Long.parseLong`; dữ liệu CSV hiện che khác biệt kiểu này thay vì test contract động từ detail response.
- `/api/cart` lưu in-memory nhưng `/api/checkout` ghi SQLite. Nếu vẫn checkout sau cart fail, test tạo write pressure không phản ánh journey và dễ quy nhầm bottleneck cho nghiệp vụ thật.
- SQLite và Node đơn tiến trình có knee phụ thuộc mạnh vào máy chạy. Không thể biết 50/300 VU “thực tế” chỉ từ endpoint contract; cần calibration và theo dõi cả SUT lẫn load generator.

## Kết luận review

Ba plan ban đầu **chưa sẵn sàng để dùng kết quả làm kết luận hiệu năng** dù XML và happy-path smoke đều pass. Các sửa trực tiếp đã áp dụng vào nguồn sinh/JMX gồm duration Load, Stress theo bậc, think-time multiplier và chặn checkout khi cart fail. Ở lần chạy P2 đã lưu, oracle vẫn chủ yếu là code + substring, correlation vẫn có fallback, và chưa có bằng chứng load generator chạy tách máy; vì vậy tôi không dùng 0% error để khẳng định nghiệp vụ hoàn toàn đúng hoặc hệ thống production-ready. Muốn nâng mức tin cậy phải sửa các điểm này rồi chạy lại, không được hồi tố coi kết quả cũ là kết quả của plan mới.

### Quyết định nghiệm thu của tôi

| Hạng mục | Quyết định cuối | Cơ sở/giới hạn |
|---|---|---|
| Load 50 VU | **Chấp nhận làm baseline**, không coi là capacity | Ramp 60s + steady window khoảng 300s; 50 VU là giả định lab, không phải traffic production. |
| Stress 50 tới 300 VU | **Chấp nhận để quan sát xu hướng**, chưa chứng minh knee chính xác | Có sáu bậc nhưng cửa sổ 60s ngắn và không có ramp-down mềm; kết quả hiện tại chưa chạm error knee. |
| Spike 10 tới 300 rồi về 10 | **Chấp nhận để đánh giá burst/recovery** | Phải phân đoạn theo timestamp; không so throughput toàn run trực tiếp với Stress. |
| Think-time | **Chấp nhận có điều kiện** | Load dùng nhịp người dùng; Stress/Spike nén 0.3× là tải kỹ thuật để tìm giới hạn, không được gọi là hành vi người dùng thật. |
| Assertions hiện có | **Chưa đạt oracle mạnh** | Code 200 + substring có thể false-positive; kết quả 0% error chỉ có giá trị trong contract đã quan sát, không chứng minh toàn bộ nghiệp vụ đúng. |
| Lockout | **Không đưa negative login vào workload chính** | Preflight/reset account và tách 401/403; không retry vì endpoint khóa thực tế sau hai lần sai. |

Tôi không chuyển trách nhiệm cho AI: tôi chịu trách nhiệm về cấu hình tải, dữ liệu, assertions, trạng thái account, metric được chọn và mọi kết luận từ ba plan. Những điểm chưa sửa hoặc chưa đo được được công khai là giới hạn; chúng không được dùng để tuyên bố production-ready.
