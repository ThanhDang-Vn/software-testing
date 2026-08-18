# Kịch bản video — Audited API Test Generator

**Video thật đã upload:** [YouTube — HW06 Agent Skill demonstration](https://youtu.be/OpEuJcmNQPU)

Thời lượng mục tiêu: 5–7 phút. Quay một demo liên tục chỉ sử dụng `POST /api/coupons/apply`. Không hiển thị secret, làm giả output hoặc để agent nhập quyết định human review.

## Chuẩn bị

Mở repository trong VS Code và hiển thị Explorer, editor cùng terminal. Tăng cỡ chữ terminal, đóng các tab không liên quan và thông báo cá nhân. Từ thư mục gốc repository, tạo một bản review tạm thời:

```powershell
Copy-Item hw/hw6/agent-generator/skill/audited-api-test-generator/references/demo-bundle.awaiting-review.json hw/hw6/agent-generator/skill/audited-api-test-generator/references/demo-bundle.approved.local.json
```

Không commit `demo-bundle.approved.local.json`. File này chỉ chứa quyết định review dùng trong lúc quay.

## Kịch bản theo từng cảnh

### 1. Giới thiệu — 0:00–0:30

**Hiển thị:** `SKILL.md` và thư mục skill.

**Thuyết minh:**

> Xin chào, đây là video demo HW06 của tôi về reusable Agent Skill Audited API Test Generator. Skill này chuyển đổi một API specification thành các API test case có thể truy vết. AI có thể đề xuất cách hiểu về ngữ nghĩa, nhưng validation deterministic và human-review gate bắt buộc sẽ quyết định output có được phép export hay không. Skill không bao giờ tự phê duyệt output của chính nó.

### 2. Input gồm một API — 0:30–1:00

**Hiển thị:** `references/demo-api-specification.md`. Đánh dấu method, path, student header, authentication, `amount >= 100`, response schema và công thức SAVE10.

**Thuyết minh:**

> Demo giới hạn này chỉ chứa đúng một operation là POST `/api/coupons/apply`. Specification yêu cầu header `X-Student-Id` có giá trị 23127334, bearer authentication, amount tối thiểu bằng 100 theo điều kiện bao gồm biên, và công thức giảm 10 phần trăm của SAVE10. Mọi expected result được sinh ra đều phải trích dẫn specification này.

### 3. Pipeline và phạm vi của AI — 1:00–1:40

**Hiển thị:** phần workflow trong `SKILL.md`, sau đó mở `references/contracts.md`.

**Thuyết minh:**

> Phần deterministic chịu trách nhiệm validation input, tạo identifier ổn định, xác định boundary value, kiểm tra schema, deduplication, coverage, thực thi approval gate, quyết định export, tạo hash và quét secret. LLM chỉ được đề xuất cách diễn giải contract, specification gap và test idea bổ sung kèm nguồn trích dẫn. Output của LLM chưa được tin cậy cho đến khi vượt qua các kiểm tra deterministic và được con người review.

### 4. Các test candidate được sinh — 1:40–2:30

**Hiển thị:** `demo-bundle.awaiting-review.json`, tập trung vào `test_cases` và `coverage`.

**Thuyết minh:**

> Bundle chứa ba test case sau khi deduplicate. CPN-DEMO-001 kiểm tra inclusive boundary tại 100, đồng thời kết hợp assertion về boundary, response schema và phép tính phần trăm chính xác. CPN-DEMO-002 kiểm tra giá trị 99.99 ngay dưới biên và mong đợi status 400. CPN-DEMO-003 loại bỏ bearer authentication và mong đợi status 401. Các nhãn test technique vẫn được giữ lại khi những candidate trùng lặp được gộp. Phần coverage ánh xạ mỗi target bắt buộc tới ít nhất một test case.

Chỉ rõ mọi request đều chứa `X-Student-Id: 23127334`; các case cần token sử dụng `<runtime-secret>` thay vì credential thật.

### 5. Minh họa export bị chặn — 2:30–3:10

**Chạy lệnh:**

```powershell
python hw/hw6/agent-generator/skill/audited-api-test-generator/scripts/validate_gate.py hw/hw6/agent-generator/skill/audited-api-test-generator/references/demo-bundle.awaiting-review.json
```

**Output thật cần xuất hiện:** `EXPORT_BLOCKED`, tiếp theo là các trường human review còn thiếu và SHA-256 của bundle.

**Thuyết minh:**

> Coverage đã đầy đủ nhưng export vẫn bị chặn vì review status đang là awaiting human review, đồng thời chưa có reviewer identity, timestamp và rationale. Kết quả fail có chủ đích này là bằng chứng cho thấy skill không thể tự phê duyệt.

Không che exit status khác 0 hoặc chỉnh sửa video khiến người xem hiểu nhầm bước kiểm tra này đã pass.

### 6. Thực hiện human review — 3:10–4:10

**Hiển thị:** `demo-bundle.approved.local.json`. Kiểm tra ba case trên màn hình rồi tự cập nhật duy nhất object `review`:

```json
{
  "status": "approved",
  "reviewer": "TÊN THẬT CỦA BẠN",
  "timestamp": "THỜI GIAN ISO-8601 HIỆN TẠI CÓ TIMEZONE",
  "rationale": "Đã đối chiếu ba test case với FR-CPN-01; inclusive boundary, below-boundary rejection, authentication, schema và phép tính SAVE10 chính xác đều có thể truy vết và đầy đủ cho demo một operation này."
}
```

Trong lúc quay, thay hai hướng dẫn viết hoa bằng giá trị thật của bạn. Timestamp hợp lệ tại Việt Nam có dạng `2026-08-18T21:30:00+07:00`; hãy dùng thời điểm quay thật, không dùng lại giá trị ví dụ này.

**Thuyết minh:**

> Bây giờ tôi thực hiện vai trò human reviewer. Tôi đã đối chiếu từng expected result với contract được trích dẫn. Chính tôi, không phải AI agent, sẽ nhập danh tính, timestamp hiện tại có timezone, quyết định approval và lý do review.

### 7. Minh họa export được cho phép — 4:10–4:45

**Chạy lệnh:**

```powershell
python hw/hw6/agent-generator/skill/audited-api-test-generator/scripts/validate_gate.py hw/hw6/agent-generator/skill/audited-api-test-generator/references/demo-bundle.approved.local.json
```

Chỉ tiếp tục nếu output thật là `EXPORT_ALLOWED`. Nếu vẫn bị chặn, hãy hiển thị và sửa validation error thật thay vì làm giả kết quả thành công.

**Thuyết minh:**

> Cùng một deterministic validator bây giờ cho phép export vì coverage vẫn đầy đủ, các trường approval hợp lệ và không có secret thật nào trong bundle. Giá trị SHA-256 đang hiển thị ràng buộc quyết định này với đúng phiên bản bundle vừa được review.

### 8. Giải thích export và audit — 4:45–5:30

**Hiển thị:** contract về export và audit trong `references/contracts.md`, cùng các record `audit` trong bundle. Nếu demo chưa thực sự sinh file Excel hoặc Postman đã được phê duyệt, chỉ giải thích output contract đủ điều kiện; không tuyên bố file đó tồn tại.

**Thuyết minh:**

> Sau khi có trạng thái `EXPORT_ALLOWED`, exporter có thể tạo artifact sẵn sàng cho Excel và Postman, bao gồm TC ID ổn định, request, assertion, requirement link, test technique và review metadata. Audit event cho biết một hành động được thực hiện bởi deterministic code, có LLM hỗ trợ hay bởi con người; đồng thời lưu hash đã được làm sạch và validation outcome. Runtime token tuyệt đối không được export.

### 9. Hạn chế và kết thúc — 5:30–6:00

**Thuyết minh:**

> Demo này chỉ bao phủ một operation và ba test case đại diện; nó không chứng minh coverage đầy đủ cho toàn bộ EShop API. Đề xuất của LLM vẫn có thể thiếu hoặc sai, vì vậy source citation, deterministic gate và đánh giá của con người vẫn cần thiết. Skill không thể tự động hóa hoặc giả mạo human approval. Cảm ơn thầy cô và các bạn đã theo dõi.

## Checklist quay video

- [ ] Chỉ hiển thị đúng một API operation.
- [ ] Kết quả thật `EXPORT_BLOCKED` xuất hiện trước approval.
- [ ] Sinh viên tự nhập dữ liệu review thật.
- [ ] Kết quả thật `EXPORT_ALLOWED` chỉ xuất hiện sau approval hợp lệ.
- [ ] `X-Student-Id: 23127334` hiển thị trong các request được sinh.
- [ ] Không hiển thị token, password, cookie, local environment file hoặc thông báo cá nhân.
- [ ] Không tuyên bố có export, URL hoặc evidence nếu chúng chưa thực sự tồn tại.
- [ ] Xem lại toàn bộ video một lần trước khi upload.
- [ ] Sinh viên tự upload bằng YouTube Studio và chỉ ghi URL thật sau khi video phát được.

## Metadata YouTube đề xuất

**Tiêu đề:** `23127334 HW06 — Demo Audited API Test Generator`

**Mô tả:**

> Demo reusable Agent Skill chuyển đổi specification thành audited API test case với một Coupon API. Video trình bày deterministic validation, sinh test bằng nhiều technique, traceability, trạng thái export bị chặn trước human review, thao tác phê duyệt thủ công và export gate cuối cùng.

Không thêm URL repository, run hoặc artifact nếu URL đó không có thật hoặc reviewer không thể truy cập.
