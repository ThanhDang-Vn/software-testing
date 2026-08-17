# Register — Human Audit Summary

## 1. Phạm vi và nguồn quyết định

- Test cases: `REG-AI-001..040` cho `POST /api/register`.
- AI-generated source: `register-ai-generated.md` và sheet `Register` trong `23127334_HW06_API_TestCases.xlsx`.
- Human decision source: `../23127334_HW06_AI_Audit.md` do người làm bài cung cấp.
- Đây là audit chất lượng thiết kế test case, không phải kết quả execution.
- Không case nào được đổi origin thành human-added. Các correction vẫn thuộc quá trình human audit của case AI-generated gốc.

## 2. Kết quả tổng hợp

| Verdict | Số lượng | Tỷ lệ |
| --- | ---: | ---: |
| VALID | 32 | 80% |
| INVALID | 0 | 0% |
| INCOMPLETE | 8 | 20% |
| **Tổng** | **40** | **100%** |

Các case cần correction: `REG-AI-002`, `REG-AI-003`, `REG-AI-009`, `REG-AI-010`, `REG-AI-018`, `REG-AI-019`, `REG-AI-038`, `REG-AI-039`.

## 3. Human decisions

| ID | Verdict | Human audit reasoning |
| --- | --- | --- |
| REG-AI-001 | VALID | Happy path có setup, schema thành công, side effect và cleanup rõ; đủ để quyết định pass/fail. |
| REG-AI-002 | INCOMPLETE | Mốc một ký tự được gọi là minimum nhưng chưa có rule chứng minh name cho phép độ dài 1; cần dẫn FR/schema. |
| REG-AI-003 | INCOMPLETE | Kiểm Unicode có giá trị nhưng oracle 200 cho cả emoji chưa được ràng buộc bởi chính sách ký tự của name. |
| REG-AI-004 | VALID | Thiếu trường bắt buộc, kỳ vọng 400 và không tạo user là oracle đầy đủ. |
| REG-AI-005 | VALID | Null cho trường bắt buộc được tách riêng; status, error schema và side effect nhất quán. |
| REG-AI-006 | VALID | Kiểm strict type cho name với oracle 400 và không coercion/persist là rõ ràng. |
| REG-AI-007 | VALID | Boundary chuỗi rỗng có input, status và kiểm tra không tạo user đầy đủ. |
| REG-AI-008 | VALID | Whitespace-only được kiểm tra cùng no-persistence; oracle đủ rõ nếu name bắt buộc có nội dung sau trim. |
| REG-AI-009 | INCOMPLETE | Mục tiêu chống SQL injection đúng nhưng không nhất thiết phải chấp nhận payload với 200; cần cho phép safe reject hoặc viện dẫn policy ký tự. |
| REG-AI-010 | INCOMPLETE | Trộn API persistence với UI XSS execution và ép status 200; cần tách API case với UI security case, đồng thời chốt accept/reject policy. |
| REG-AI-011 | VALID | Thiếu email bắt buộc, 400 và user count không đổi tạo oracle xác định. |
| REG-AI-012 | VALID | Null email được cô lập và kiểm tra cả response lẫn persistence. |
| REG-AI-013 | VALID | Numeric email kiểm tra type validation và cấm coercion, đủ tiêu chí chấp nhận. |
| REG-AI-014 | VALID | Empty email có oracle 400 và không tạo user rõ ràng. |
| REG-AI-015 | VALID | Email thiếu ký tự @ là partition invalid rõ; status và side effect phù hợp. |
| REG-AI-016 | VALID | Empty local part là email sai định dạng; oracle xác định. |
| REG-AI-017 | VALID | Empty domain là email sai định dạng; oracle xác định. |
| REG-AI-018 | INCOMPLETE | Reject whitespace padding là một lựa chọn contract; hệ thống cũng có thể trim hợp lệ. Cần chốt normalization policy trước. |
| REG-AI-019 | INCOMPLETE | Expected status ghi “400 or 409”, nên chưa có một oracle duy nhất; cần chọn status theo API contract. |
| REG-AI-020 | VALID | Payload đồng thời là email invalid nên 400, không thay đổi dữ liệu và không leak SQL detail là oracle hợp lệ. |
| REG-AI-021 | VALID | Thiếu password bắt buộc được kiểm tra với 400 và không persist. |
| REG-AI-022 | VALID | Null password/confirmation có oracle lỗi và cấm lộ raw password đầy đủ. |
| REG-AI-023 | VALID | Numeric password kiểm tra strict type và không coercion; pass/fail xác định. |
| REG-AI-024 | VALID | Boundary 7 ký tự phù hợp với minimum 8 được dùng nhất quán trong nhóm password. |
| REG-AI-025 | VALID | Boundary đúng 8 ký tự có success schema, persistence và login verification. |
| REG-AI-026 | VALID | Thiếu uppercase được cô lập và oracle 400 rõ. |
| REG-AI-027 | VALID | Thiếu lowercase được cô lập và oracle 400 rõ. |
| REG-AI-028 | VALID | Thiếu digit được cô lập và oracle 400 rõ. |
| REG-AI-029 | VALID | Thiếu special character được cô lập và oracle 400 rõ. |
| REG-AI-030 | VALID | Kiểm allowed special-character set với một biến thay đổi; oracle rõ trong nhóm password policy. |
| REG-AI-031 | VALID | Positive partition cho ký tự `&` có cả registration và login oracle. |
| REG-AI-032 | VALID | Thiếu confirmation có status, schema và no-persistence rõ. |
| REG-AI-033 | VALID | Null confirmation được tách riêng và có oracle xác định. |
| REG-AI-034 | VALID | Relational validation password mismatch có response, no-persistence và login-negative check. |
| REG-AI-035 | VALID | Empty body kiểm tra 400, safe error schema và user count không đổi. |
| REG-AI-036 | VALID | Malformed JSON có oracle an toàn và availability check sau lỗi, đủ để đánh giá. |
| REG-AI-037 | VALID | Top-level array sai schema; 400 và no-persistence tạo oracle rõ. |
| REG-AI-038 | INCOMPLETE | “400 or 415” chưa xác định; cần chốt media-type policy và một expected status/schema. |
| REG-AI-039 | INCOMPLETE | Security invariant hợp lý nhưng status 200/400 và unknown-field policy chưa chốt; cần chọn contract rồi viết một oracle cụ thể. |
| REG-AI-040 | VALID | Kiểm không lưu plaintext, không lộ credential và vẫn login được là security oracle đầy đủ. |

## 4. Corrected versions cho case INCOMPLETE

| ID | Corrected version |
| --- | --- |
| REG-AI-002 | Đổi technique thành `EP — valid non-empty string`, không gọi là BVA. Đổi title thành “Accept one-character name under the current no-minimum-length contract”. Giữ expected `200` và side-effect verification. |
| REG-AI-003 | Bỏ emoji để không phụ thuộc character policy chưa có. Dùng `name="Nguyễn Ánh"`; giữ kiểm tra UTF-8 round-trip và UI escaping. |
| REG-AI-009 | Dùng tên hợp lệ có dấu nháy đơn như `O'Connor` thay payload mang hình thức phá hoại. Giữ mục tiêu SEC-05: expected `200`, persist literal, seed users/table không đổi. |
| REG-AI-010 | Tách phạm vi. Giữ ID này làm API persistence/schema check nhưng chưa gán acceptance status cuối cho đến khi name character policy được chốt. Chuyển DOM execution/browser verification sang một human-added UI security case riêng. |
| REG-AI-018 | Chốt contract API là reject leading/trailing whitespace thay vì silent trim. Giữ expected `400`; xác minh không tạo cả padded lẫn trimmed identity. |
| REG-AI-019 | Chốt duplicate registration là `409 Conflict`; body JSON `{error:string}`; account gốc vẫn là row duy nhất và không đổi. |
| REG-AI-038 | Chốt `415 Unsupported Media Type` cho JSON-looking body gửi với `text/plain`; body JSON `{error:string}` và không tạo user. |
| REG-AI-039 | Chọn strict-schema policy cho privilege-bearing unknown fields: expected `400`, JSON `{error:string}`, không tạo account và không persist role/id/permission input. |

## 5. Trạng thái workbook

Sheet `Register` đã được cập nhật:

- `AI audit verdict`: lấy nguyên quyết định human audit cho cả 40 case.
- `audit reasoning`: lấy nguyên reasoning tương ứng.
- `corrected version`: correction ở bảng trên; case VALID ghi giữ nguyên AI-generated version.
- `actual result`, `PASS/FAIL`, `bug ID` và `evidence link` vẫn giữ trạng thái chưa execution.

Sheet `Coupon`, `Product` và các test-case fields gốc không được audit hoặc sửa trong bước cập nhật Register này.
