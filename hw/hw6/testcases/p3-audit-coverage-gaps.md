# P3 — Audit Coverage Traceability and Gap List

## 1. Phạm vi

Báo cáo kiểm tra coverage sau khi human audit đủ 120 AI-generated cases:

- Registration: `REG-AI-001..040`
- Coupon: `CPN-AI-001..040`
- Product: `PRD-AI-001..040`

Nguồn trace:

- `../23127334_HW06_AI_Audit.md`
- `api-contracts/api-contract-matrix.md`
- `testcases/p1-state-transitions.md`
- `testcases/p1-security-schema-checklist.md`
- Ba file `*-ai-generated.md` và CSV tương ứng
- FR-01, FR-09, FR-12, FR-15 và SEC-01..SEC-07 trong EShop README

Báo cáo chỉ chỉ ra coverage/gap. Không tạo `REG-H-*`, `CPN-H-*`, `PRD-H-*` và không tự bổ sung test case.

## 2. Kết luận tổng quan

| Tiêu chí | Register | Coupon | Product |
| --- | --- | --- | --- |
| Every parameter có valid/invalid partitions | PARTIAL | PARTIAL | PARTIAL |
| Relevant boundaries | COVERED cho boundary đã được spec định nghĩa | COVERED, trừ rounding/expiry equality đang là contract gap | COVERED theo FR-15; price precision/max còn là contract gap |
| State transitions | COVERED | COVERED | COVERED |
| SEC-01..SEC-07 liên quan | COVERED, nhưng một số case cần correction | PARTIAL — thiếu SEC-05 execution-oriented case | COVERED ở mức route, PARTIAL ở optional-field sink |
| Exact schema assertions | COVERED cho success; PARTIAL cho một số error/media-type policy | COVERED cho success; PARTIAL cho auth/usage errors | COVERED cho success; PARTIAL cho auth/reference/media-type errors |
| Duplicate rõ ràng | Không thấy duplicate rõ ràng | Không thấy duplicate rõ ràng; có overlap có chủ đích | Không thấy duplicate rõ ràng; có overlap có chủ đích |

Không nên tạo human-added test chỉ để tăng số lượng. Human-added tests nên ưu tiên các gap `HIGH` và `MEDIUM` trong mục 8 sau khi contract gap liên quan đã được chốt.

## 3. Parameter partition traceability

### 3.1 Registration

| Parameter | Valid partitions hiện có | Invalid partitions hiện có | Kết luận |
| --- | --- | --- | --- |
| `name` | Typical, one-character, Unicode, apostrophe/SQL metacharacter, XSS marker | Missing, null, numeric, empty, whitespace-only | PARTIAL: character policy và maximum length chưa được spec định nghĩa; không phải thiếu test có thể giải quyết chỉ bằng thêm data |
| `email` | Unique valid email | Missing, null, numeric, empty, missing `@`, empty local/domain, padded whitespace, duplicate, injection-shaped invalid email | COVERED cho contract hiện có; normalization/case policy còn chưa chốt |
| `password` | Strong typical, exactly 8, allowed `&` | Missing, null, numeric, length 7, thiếu uppercase/lowercase/digit/special, special ngoài allowlist | COVERED |
| `confirm_password` | Matching password | Missing, null, mismatch; numeric confirmation xuất hiện cùng numeric password | PARTIAL: chưa cô lập wrong-type confirmation khi password vẫn là string hợp lệ |
| Unknown/server fields | `role`, `is_admin`, `id`, `permissions` trong mass-assignment case | Strict reject/ignore policy chưa chốt | PARTIAL do contract gap, không do thiếu payload |

### 3.2 Coupon

| Parameter | Valid partitions hiện có | Invalid partitions hiện có | Kết luận |
| --- | --- | --- | --- |
| `code` | `SAVE10`, `BIGBUY`, `VIP100`; active/unexpired | Missing, empty, not-found, disabled, expired | PARTIAL: thiếu `null`, non-string, whitespace/case normalization và SQL-injection-shaped code |
| `total_amount` | Percent/fixed amounts; min-1/min/min+1; ordinary/fractional calculation | Missing, null, negative, zero/below-min | PARTIAL: thiếu string/boolean/object type partitions; rounding policy vẫn chưa chốt |
| `user_id` | Matching positive user; multiple users | Missing, string, negative, JWT/body mismatch, other-user tampering | COVERED về identity partition; missing-field contract vẫn chưa chốt derive-from-JWT hay body-required |
| JWT/header | Valid user/admin, missing, malformed signature, expired, wrong scheme | Các auth partitions chính đã có | COVERED về input; exact `401`/`403` policy chưa chốt |
| Unexpected calculated/control fields | `coupon_id`, `type`, `discount_value`, `is_active`, minimum, usage, final amount | Mass assignment payload đã có | PARTIAL do strict reject/ignore policy chưa chốt |

### 3.3 Product

| Parameter | Valid partitions hiện có | Invalid partitions hiện có | Kết luận |
| --- | --- | --- | --- |
| `name` | Typical, one-char, 254, 255, Unicode, SQL metacharacter, XSS marker | Missing, null, numeric, empty, whitespace, 256 | COVERED theo FR-15, bao gồm max 255 |
| `price` | Positive fraction, ordinary integer, large finite | Missing, null, numeric string, zero, negative, boolean | COVERED cho `> 0`; precision và maximum domain chưa được spec chốt |
| `category_id` | Existing category 1/2 | Missing, null, string, zero, positive not-found | COVERED; `400` hay `422` cho not-found vẫn là status contract gap |
| `description` | Present, omitted, XSS marker | Chưa có null, number/object/array type partitions | GAP |
| `imageUrl` | Present URL, omitted | Chưa có null, non-string, malformed URL hoặc unsafe scheme partition | GAP; URL constraints chưa được spec chốt |
| Unknown/server fields | Ownership, identity, role and timestamp fields | Mass-assignment payload đã có | PARTIAL do strict reject/ignore policy chưa chốt |
| JWT/role | Guest, user, admin, malformed, expired, tampered role claim | Các partitions chính đã có | COVERED; exact auth status vẫn chưa chốt |

## 4. Boundary traceability

| Boundary | Coverage | Case trace | Gap/remark |
| --- | --- | --- | --- |
| Registration password minimum 8 | COVERED | REG-AI-024 (7), 025 (8) | Có thể thêm 9 chỉ khi cần upper-neighbor symmetry; không phải gap thiết yếu |
| Registration name length | CONTRACT GAP | REG-AI-002 | FR-01 không định nghĩa min/max; không tự tạo boundary mới |
| Email structural boundaries | COVERED | REG-AI-015..017 | Max lengths/canonicalization chưa được định nghĩa |
| Coupon `SAVE10` minimum 300000 | COVERED | CPN-AI-009..011 | Có đúng case tại equality |
| Coupon `BIGBUY` minimum 500000 | COVERED | CPN-AI-012..014 | Có đủ min-1/min/min+1 |
| Coupon usage max | COVERED | CPN-AI-021, 022, 007 | `400`/`409` cần chốt |
| Coupon expiration equality | CONTRACT GAP | CPN-AI-019 | Cần chốt `expired_at <= now` hay `< now` và clock control |
| Coupon percent fractional result | CONTRACT GAP | CPN-AI-016 | Cần rounding/currency precision policy trước khi có exact oracle |
| Product name maximum 255 | COVERED | PRD-AI-013 (254), 014 (255), 015 (256) | FR-15 có quy định max 255; xem inconsistency audit ở mục 9 |
| Product price `> 0` | COVERED | PRD-AI-023 (-0.01), 022 (0), 024 (0.01), 025 | Việc chấp nhận fractional price phụ thuộc currency precision policy |
| Product category existence | COVERED | PRD-AI-031..033 | Status cho non-existing reference chưa chốt |

## 5. State-transition traceability

### Registration

| Transition | Case trace | Coverage |
| --- | --- | --- |
| Account absent → created | REG-AI-001, 025, 031 | COVERED |
| Created → retrievable/login-capable | REG-AI-001, 025, 031, 040 | COVERED |
| Created → duplicate attempt rejected | REG-AI-019 | COVERED; duplicate status cần chốt |
| Invalid input → remains absent | Các invalid EP/schema cases | COVERED |

### Coupon

| Transition/state | Case trace | Coverage |
| --- | --- | --- |
| Eligible unused → applied/preview | CPN-AI-001, 010, 013 | COVERED |
| Applied preview → usage remains unchanged | CPN-AI-020, 021 | COVERED |
| Usage max-1 → record usage → max | CPN-AI-022 | COVERED |
| Usage max → next apply rejected | CPN-AI-007, 022 | COVERED |
| Usage isolation by coupon/user | CPN-AI-023, 024 | COVERED |
| Active/unexpired vs expired/disabled/not-found | CPN-AI-002..004, 019 | COVERED; expiry equality is a contract gap |

### Product

| Transition/actor state | Case trace | Coverage |
| --- | --- | --- |
| Product absent + guest → remains absent | PRD-AI-002 | COVERED |
| Product absent + user → remains absent | PRD-AI-003 | COVERED |
| Product absent + admin → created | PRD-AI-001 | COVERED |
| Created → retrievable | PRD-AI-001, 012..014, 025, 033..036 | COVERED |
| Created → deleted during teardown → absent | Cleanup of successful create cases | COVERED in procedure; evidence will be needed during execution |

## 6. SEC-01..SEC-07 traceability

| SEC | Requirement | Relevant selected APIs | Case trace | Coverage |
| --- | --- | --- | --- | --- |
| SEC-01 | Password không plaintext | Register | REG-AI-040 | COVERED |
| SEC-02 | Protected API requires valid JWT | Coupon, Product | CPN-AI-006, 008, 024..031; PRD-AI-002, 004..006 | COVERED; exact auth status gap remains |
| SEC-03 | Admin route checks `role=admin` | Product; indirect registration mass assignment | PRD-AI-001..003, 006, 037; REG-AI-039 | COVERED; unknown-field policy gap remains |
| SEC-04 | Escape user input at UI sinks | Register, Coupon, Product | REG-AI-003, 010; PRD-AI-016, 018 | PARTIAL: coupon display/reflection and product `imageUrl` sink chưa được trace rõ; API acceptance alone không chứng minh XSS |
| SEC-05 | Parameterized queries | All three | REG-AI-009, 020; PRD-AI-017 | GAP cho Coupon: chưa có code payload chứng minh literal lookup/no query expansion |
| SEC-06 | Client không đổi role qua profile | Không trực tiếp thuộc ba endpoint; mass assignment liên quan gián tiếp ở Register | REG-AI-039 | COVERED trong phạm vi registration; endpoint profile không thuộc scope HW06 này |
| SEC-07 | OTP entropy/expiry/single use | Không API nào trong ba API đã chọn | Không áp dụng | N/A, không cần human-added test trong scope này |

## 7. Exact schema and side-effect traceability

| Area | Existing coverage | Gap |
| --- | --- | --- |
| Register success exact schema | REG-AI-001, 025, 031, 040 | Không |
| Register error schema/no mutation | Hầu hết invalid cases | Duplicate/media-type/mass-assignment status policy chưa chốt |
| Coupon success exact schema/calculation | CPN-AI-001, 010..018 | Rounding policy cho fractional percent |
| Coupon error schema/no usage | Decision-table/auth/schema cases | Auth status, usage-limit status, user identity contract chưa chốt |
| Product success exact schema + retrieval | PRD-AI-001 và successful partitions | Optional field null/invalid-type representation chưa phủ |
| Product error schema/no persistence | Auth/validation/malformed cases | Auth status, category not-found status, wrong content type chưa phủ/chưa chốt |
| Sensitive-data leakage | REG-AI-036, 040; CPN-AI-008, 029/030, 038; PRD-AI-004/005, 038/039 | Coupon/product DB-error path chưa có một case cô lập gây safe internal failure |
| Database side effect | Register count/login; coupon usage state; product GET/list/delete | Execution evidence chưa có, đúng với trạng thái hiện tại |

## 8. Prioritized gap list for human-added design

Các dòng sau là gap statement, không phải test case.

| Gap ID | Priority | API | Gap | Why existing AI cases are insufficient | Contract prerequisite before adding test |
| --- | --- | --- | --- | --- | --- |
| GAP-REG-01 | MEDIUM | Register | `confirm_password` wrong-type chưa được cô lập khi `password` vẫn là valid string | REG-AI-023 thay đổi cả password và confirmation thành number nên không xác định field nào gây reject | Không; exact schema đã định nghĩa string |
| GAP-REG-02 | MEDIUM | Register | Email case/trim normalization chưa có một policy và oracle duy nhất | REG-AI-018 bị audit INCOMPLETE; chưa phân biệt preserve, normalize hay reject | Chốt trim/case canonicalization policy |
| GAP-REG-03 | MEDIUM | Register | Malformed/wrong `Content-Type` policy chưa thống nhất | REG-AI-038 có `400 or 415` | Chốt `415` hoặc `400` và JSON error schema |
| GAP-REG-04 | MEDIUM | Register | Unknown-field/mass-assignment policy chưa có oracle duy nhất | REG-AI-039 cho phép `200` ignore hoặc `400` reject | Chốt strict reject hay ignore; privilege fields tuyệt đối không persist |
| GAP-CPN-01 | HIGH | Coupon | SEC-05 chưa có coupon-code SQL injection/parameterization trace | Không CPN case nào gửi SQL metacharacter trong `code` và xác minh không query expansion/leak | Chốt allowed-character policy hoặc cho phép security oracle accept-safe/reject-safe |
| GAP-CPN-02 | MEDIUM | Coupon | `code` null và non-string partitions chưa phủ | Missing/empty/not-found có nhưng không thay thế exact-type checks | Chốt strict JSON string validation |
| GAP-CPN-03 | MEDIUM | Coupon | `total_amount` string/boolean/object partitions chưa phủ | Missing/null/negative đã có nhưng type coercion chưa được cô lập | Chốt strict finite-number policy |
| GAP-CPN-04 | HIGH | Coupon | JWT subject vs body `user_id` contract chưa chốt | CPN-AI-025/026 bị INCOMPLETE và chưa có một oracle duy nhất | Chọn JWT-derived identity; quyết định bỏ field hay require equality; chốt status |
| GAP-CPN-05 | HIGH | Coupon | Financial rounding/precision chưa định nghĩa | CPN-AI-016 bị INVALID vì exact fractional oracle tự đặt | Chốt currency unit, decimal precision và rounding mode |
| GAP-CPN-06 | MEDIUM | Coupon | Usage-limit and auth error statuses chưa thống nhất | CPN-AI-007/022/029/030 có multiple statuses | Chốt status/error schema cho limit, invalid signature và expired token |
| GAP-CPN-07 | MEDIUM | Coupon | SEC-04 coupon code/message UI sink chưa được kiểm chứng | Không case nào trace code/reflected message tới checkout UI | Chốt whether code may contain markup; xác định đúng UI sink |
| GAP-CPN-08 | LOW | Coupon workflow | Duplicate `POST /api/coupon-usage`/replay idempotency chưa phủ | Apply cases kiểm usage count nhưng không chứng minh một checkout không bị ghi hai lần | Chốt idempotency/business-event identity cho supporting endpoint |
| GAP-PRD-01 | HIGH | Product | `description` invalid-type partitions chưa phủ | Chỉ present/omitted/XSS marker; chưa có number/object/array/null policy | Chốt optional-but-if-present exact string và nullable policy |
| GAP-PRD-02 | HIGH | Product | `imageUrl` type/format/unsafe-scheme partitions chưa phủ | Chỉ valid-looking URL và omission | Chốt URL format, allowed schemes, nullable policy và rendering behavior |
| GAP-PRD-03 | MEDIUM | Product | Wrong/missing content type chưa phủ | PRD malformed cases đều dùng JSON content type hoặc malformed JSON | Chốt `415` policy và JSON error schema |
| GAP-PRD-04 | MEDIUM | Product | Auth and referential-error statuses chưa thống nhất | PRD-AI-004..006/032 dùng alternative status | Chốt malformed/expired JWT và missing category status |
| GAP-PRD-05 | MEDIUM | Product | Unknown-field/mass-assignment policy chưa có oracle duy nhất | PRD-AI-037 cho phép reject hoặc ignore | Chốt strict schema; server-owned fields không persist |
| GAP-PRD-06 | MEDIUM | Product | SEC-04 coverage chưa bao gồm unsafe `imageUrl` consumption | PRD-AI-018 chỉ dùng name/description payload | Chốt allowed URL schemes và các UI/network sinks cần xác minh |
| GAP-SCH-01 | LOW | All | Duplicate JSON keys/parser differential chưa phủ | Top-level/malformed cases không kiểm duplicate keys | Chốt parser policy cho duplicate keys, đặc biệt identity/control fields |
| GAP-SCH-02 | LOW | All | Payload-size và invalid UTF-8 robustness chưa phủ | Không AI case nào kiểm `413` hoặc parser recovery | Chốt body-size limit và structured error policy |

## 9. Audit decisions requiring traceability review

Mục này không tự đổi human verdict. Nó chỉ ghi inconsistency giữa audit reasoning và requirement source.

| Audit item | Human verdict | Traceability observation | Recommended action |
| --- | --- | --- | --- |
| PRD-AI-013 | INVALID | FR-15 quy định product name tối đa 255; 254 là max-1 hợp lệ để BVA | Review lại verdict/reasoning; không cần thêm human test thay thế chỉ vì “thiếu source” |
| PRD-AI-014 | INVALID | FR-15 quy định rõ maximum 255 | Review lại verdict/reasoning; case có direct requirement trace |
| PRD-AI-015 | INVALID | Với max 255, 256 là max+1 invalid boundary | Review lại verdict/reasoning; case có direct requirement trace |
| REG-AI-002 / PRD-AI-012 | INCOMPLETE | Một ký tự không phải “minimum” được spec định nghĩa; chỉ có thể coi là valid non-empty EP nếu contract cho phép | Reclassify technique hoặc chốt min-length; không tạo duplicate human test |
| REG/PRD SQLi cases | INCOMPLETE | SEC-05 security oracle là no injection/no unintended mutation; acceptance status còn phụ thuộc character policy | Chốt character policy hoặc đổi payload sang dữ liệu hợp lệ có apostrophe |
| REG/PRD XSS cases | INCOMPLETE/INVALID | SEC-04 nằm ở rendering sink; API persistence và UI execution cần evidence tách biệt | Thiết kế human-added UI/security check riêng nếu UI nằm trong submission scope |

## 10. Duplicate review

Không phát hiện hai case hoàn toàn trùng nhau về **precondition + stimulus + oracle + side-effect**. Một số overlap là có chủ đích:

- `REG-AI-001` và các registration success cases: case 001 kiểm full happy-path/schema; các case khác cô lập boundary/composition.
- `REG-AI-009` và `REG-AI-020`: khác field và khác partition — valid/literal name so với invalid email format.
- `CPN-AI-007` và `CPN-AI-022`: cùng outcome usage limit nhưng một case là decision-table row, case kia kiểm transition max-1 → max; có thể dùng chung setup/evidence khi thực thi nhưng không phải duplicate rõ ràng.
- `CPN-AI-004` và `CPN-AI-032`: một case kiểm expired state cho user, case kia kiểm admin role không bypass business rule.
- `PRD-AI-001` và `PRD-AI-025`: một case là full admin happy path/exact schema/state; một case cô lập ordinary positive integer price/type persistence.
- `PRD-AI-034..036`: omission độc lập của từng optional field và combination omission; giữ được nếu runner cần pairwise interaction, nhưng có thể gộp execution data-driven nếu muốn giảm runtime mà không xóa coverage.

Kết luận: không cần tạo human-added test để thay thế duplicate. Nếu tối ưu runtime, chỉ gộp execution/data setup của các overlap có chủ đích, không xóa traceability mục tiêu.
