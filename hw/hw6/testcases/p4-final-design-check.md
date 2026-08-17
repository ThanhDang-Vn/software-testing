# P4 — Final Test Design Gate

## 1. Gate rules

Final design được kiểm tra theo các rule:

1. Mỗi API có ít nhất 35 AI-generated cases đã được human audit.
2. Mỗi API có ít nhất 5 human-added cases đủ điều kiện tính.
3. Request dùng cho setup không được tính là test case chính của endpoint được chọn.
4. Hai case có cùng primary objective, stimulus và oracle không được tính hai lần chỉ vì khác dữ liệu hoặc sâu hơn ở bước verification.
5. Không tự thêm test trong bước gate check này.

Ba endpoint mục tiêu:

- `POST /api/register`
- `POST /api/apply-coupon`
- `POST /api/products`

## 2. Raw inventory và audit counts (lần kiểm tra ban đầu)

| API | Generated | VALID | INVALID | INCOMPLETE | Corrected | Raw human-added |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| Register | 40 | 32 | 0 | 8 | 8 | 7 |
| Coupon | 40 | 31 | 1 | 8 | 0 | 7 |
| Product | 40 | 26 | 6 | 8 | 0 | 6 |
| **Total** | **120** | **89** | **7** | **24** | **8** | **20** |

`Corrected` được tính khi workbook có corrected version cụ thể sau audit. Hiện chỉ 8 Register cases có correction được ghi; không suy diễn Coupon/Product là corrected chỉ vì audit reasoning đã tồn tại.

## 3. AI-generated audited gate

Tất cả 120 AI-generated cases đều có verdict và reasoning trong human audit source. Gate này đếm “đã audit”, không yêu cầu verdict phải là VALID.

| API | Audited AI-generated | Required | Result |
| --- | ---: | ---: | --- |
| Register | 40 | 35 | PASS |
| Coupon | 40 | 35 | PASS |
| Product | 40 | 35 | PASS |

Lưu ý chất lượng: nếu submission rubric chỉ cho phép tính VALID + corrected cases thay vì mọi audited case, cần một rule riêng. Báo cáo hiện áp dụng đúng wording “AI-generated đã được audit”.

## 4. Logic-overlap exclusions

### 4.1 Register

| Human case | Existing AI case | Decision | Reason |
| --- | --- | --- | --- |
| REG-H-003 | REG-AI-018 | Exclude from gate count | Cùng padded email, reject/no-account oracle và kiểm cả padded/trimmed identity |
| REG-H-005 | REG-AI-038 | Exclude | Cùng wrong Content-Type JSON-looking body; human case chỉ chốt status `415` |
| REG-H-006 | REG-AI-039 | Exclude | Cùng mass-assignment role escalation, login/JWT/admin-access verification |
| REG-H-007 | REG-AI-010 | Exclude | Cùng registration XSS marker → persistence → UI non-execution logic |

Qualifying Register human cases:

- `REG-H-001`: concurrent same-email uniqueness race.
- `REG-H-002`: case-insensitive email identity chain.
- `REG-H-004`: isolated wrong-type confirmation.

Counted: **3/5 — FAIL**.

### 4.2 Coupon

| Human case | Existing AI case | Decision | Reason |
| --- | --- | --- | --- |
| CPN-H-001 | CPN-AI-025 + CPN-AI-007 | Exclude from logic count | AI coverage đã kết hợp missing `user_id` với invariant không được bypass current-user limit |
| CPN-H-002 | CPN-AI-026 | Exclude | Cùng JWT user A/body user B tampering và no cross-user state mutation |

Potentially distinct security/state candidates còn lại là CPN-H-003..007, nhưng endpoint-primary rule tiếp tục loại một số case ở mục 5.

### 4.3 Product

| Human case | Existing AI case | Decision | Reason |
| --- | --- | --- | --- |
| PRD-H-001 | PRD-AI-002 | Exclude from gate count | Cùng guest POST, expected `401`, marker/ID phải absent; thêm retrieval depth không đổi logic chính |
| PRD-H-002 | PRD-AI-003 | Exclude | Cùng normal-user POST, expected `403`, no product persistence |
| PRD-H-005 | PRD-AI-032 | Exclude | Cùng nonexistent category, reject và không tạo orphan/implicit category |

Distinct Product candidates trước endpoint-primary filtering:

- `PRD-H-003`: ID-dependent price schema drift.
- `PRD-H-004`: unsafe `imageUrl` scheme.
- `PRD-H-006`: create/read/delete/read lifecycle.

## 5. Setup/supporting-main exclusions

Rule này không loại supporting request khỏi steps; nó chỉ ngăn một test của endpoint khác được tính như test chính của selected POST endpoint.

| Case | Actual primary objective | Selected endpoint bucket | Decision |
| --- | --- | --- | --- |
| CPN-H-004 | Replay/idempotency của `POST /api/coupon-usage` | `POST /api/apply-coupon` | Không tính cho Coupon selected endpoint |
| CPN-H-005 | Concurrent commit tại coupon-usage endpoint | `POST /api/apply-coupon` | Không tính |
| CPN-H-006 | Checkout recomputes trusted cart total | `POST /api/apply-coupon` | Không tính; apply request là preview/setup cho checkout assertion |
| PRD-H-006 | DELETE lifecycle và final GET absence | `POST /api/products` | Không tính; create request là setup cho delete transition |

Các case này vẫn được giữ trong design vì có giá trị workflow; chúng chỉ không được dùng để thỏa số lượng human-added của endpoint mục tiêu.

## 6. Final qualifying human-added counts

| API | Raw human-added | Logic overlap excluded | Supporting-main excluded | Counted human-added | Required | Result |
| --- | ---: | ---: | ---: | ---: | ---: | --- |
| Register | 7 | 4 | 0 | 3 | 5 | FAIL |
| Coupon | 7 | 2 | 3 | 2 | 5 | FAIL |
| Product | 6 | 3 | 1 | 2 | 5 | FAIL |
| **Total** | **20** | **9** | **4** | **7** | **15** | **FAIL** |

## 7. Initial gate result before supplementation

| Gate | Register | Coupon | Product | Overall |
| --- | --- | --- | --- | --- |
| At least 35 audited AI-generated | PASS | PASS | PASS | PASS |
| At least 5 qualifying human-added | FAIL (3) | FAIL (2) | FAIL (2) | FAIL |
| Setup requests not counted as primary | PASS | PASS after exclusions | PASS after exclusion | PASS |
| Obvious logic duplicates counted once | PASS after exclusions | PASS after exclusions | PASS after exclusions | PASS |
| **FINAL DESIGN GATE** | **FAIL** | **FAIL** | **FAIL** | **FAIL** |

Không có test mới nào được tạo để che gate failure. Cần một vòng human candidate selection mới với ít nhất:

- 2 logic mới cho Registration.
- 3 logic mới có primary endpoint là `POST /api/apply-coupon` cho Coupon.
- 3 logic mới có primary endpoint là `POST /api/products` cho Product.

Các con số trên là minimum nếu candidate mới không overlap với AI/human cases hiện có.

## 8. Workbook update

Sheet `Summary` trong `23127334_HW06_API_TestCases.xlsx` đã được cập nhật với:

- Generated
- Valid
- Invalid
- Incomplete
- Corrected
- Human-added raw count
- Logic-overlap exclusions
- Supporting-main exclusions
- Counted human-added
- Per-API AI gate, human gate và final gate

Không thay đổi nội dung test case và không tạo thêm human-added ID trong bước kiểm tra này.

## 9. Recheck after approved supplementation

Theo chỉ thị human review `"thiếu thì bổ sung đi"`, design được bổ sung các candidate mới có primary objective trực tiếp trên ba endpoint mục tiêu:

- Register: `REG-H-008`, `REG-H-009`.
- Coupon: `CPN-H-008`, `CPN-H-009`, `CPN-H-010`.
- Product: `PRD-H-007`, `PRD-H-008`, `PRD-H-009`.

Quyết định loại candidate `PRD-C04` trước đó vẫn được giữ nguyên; candidate này không được khôi phục hay tính vào gate.

### 9.1 Updated inventory

| API | Generated | VALID | INVALID | INCOMPLETE | Corrected | Raw human-added |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| Register | 40 | 32 | 0 | 8 | 8 | 9 |
| Coupon | 40 | 31 | 1 | 8 | 0 | 10 |
| Product | 40 | 26 | 6 | 8 | 0 | 9 |
| **Total** | **120** | **89** | **7** | **24** | **8** | **28** |

### 9.2 Updated qualifying human-added counts

Các exclusion đã xác định ở mục 4 và 5 không thay đổi. Tám case mới không trùng primary logic với AI/human case đã có và không dùng endpoint setup/supporting làm test objective chính.

| API | Raw human-added | Logic overlap excluded | Supporting-main excluded | Counted human-added | Required | Result |
| --- | ---: | ---: | ---: | ---: | ---: | --- |
| Register | 9 | 4 | 0 | 5 | 5 | PASS |
| Coupon | 10 | 2 | 3 | 5 | 5 | PASS |
| Product | 9 | 3 | 1 | 5 | 5 | PASS |
| **Total** | **28** | **9** | **4** | **15** | **15** | **PASS** |

### 9.3 Final gate after supplementation

| Gate | Register | Coupon | Product | Overall |
| --- | --- | --- | --- | --- |
| At least 35 audited AI-generated | PASS (40) | PASS (40) | PASS (40) | PASS |
| At least 5 qualifying human-added | PASS (5) | PASS (5) | PASS (5) | PASS |
| Setup requests not counted as primary | PASS | PASS | PASS | PASS |
| Obvious logic duplicates counted once | PASS | PASS | PASS | PASS |
| **FINAL DESIGN GATE** | **PASS** | **PASS** | **PASS** | **PASS** |

Kết quả mới nhất ở mục 9.3 thay thế trạng thái gate ban đầu ở mục 7. Sheet `Summary` trong workbook cũng đã được đồng bộ theo các số liệu recheck này.
