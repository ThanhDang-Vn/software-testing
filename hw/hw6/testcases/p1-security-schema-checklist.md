# P1 — Security and Schema Checklist

## 1. Phạm vi và nguyên tắc phân loại

Checklist áp dụng cho:

- `POST /api/register`
- `POST /api/apply-coupon`
- `POST /api/products`

Nguồn oracle: FR-01, FR-09, FR-12, FR-15 và SEC-01..SEC-07 trong `hw/eshop-sut/README.md`, API contract trong `api_specification.md`, cùng behavior route quan sát từ `backend/server.js`.

Nguyên tắc:

- Expected giữ theo specification; behavior lỗi hiện tại không sửa oracle.
- Một validation failure chỉ là security bug khi chứng minh được security impact, chẳng hạn bypass authorization, thay đổi role, truy cập state của user khác, SQL injection, stored XSS thực thi hoặc rò rỉ secret.
- Sai status, thiếu field validation, nhận unknown field hoặc malformed JSON thường được phân loại trước là **contract/schema/robustness defect**. Chỉ nâng thành security defect khi có impact tương ứng.
- XSS payload được lưu chưa tự động chứng minh stored XSS. Phải xác minh payload đi tới UI sink và được render không escape/thực thi.
- SQL metacharacter gây `500` chưa tự động chứng minh SQL injection. Phải chứng minh thay đổi ý nghĩa query, đọc/ghi dữ liệu ngoài phạm vi hoặc lỗi DB làm lộ thông tin có giá trị khai thác.
- Đây là checklist thiết kế; chưa phải bộ test case hoàn chỉnh và chưa thực thi payload.

## 2. SEC-01..SEC-07 applicability matrix

| Security requirement | Register | Apply coupon | Create product |
| --- | --- | --- | --- |
| SEC-01 — Không lưu password plaintext | Direct: password persistence | N/A | N/A |
| SEC-02 — API bảo mật yêu cầu JWT hợp lệ | Public endpoint; JWT không bắt buộc | Direct: FR-09 C4 yêu cầu authenticated user | Direct: mutation yêu cầu JWT |
| SEC-03 — Admin API kiểm tra `role=admin` | N/A; client không được tự set role | N/A; coupon không admin-only | Direct: chỉ admin được create product |
| SEC-04 — Escape dữ liệu user khi hiển thị | Name/email có thể được admin UI hiển thị | Code/message có thể được checkout UI hiển thị | Direct: name/description/image data được UI hiển thị |
| SEC-05 — Parameterized query | Direct: insert user | Direct: coupon/usage lookup | Direct: insert product |
| SEC-06 — Client không đổi role qua profile | Indirect mass-assignment concern: registration không được nhận role | N/A | N/A |
| SEC-07 — OTP đủ entropy/expiry/single-use | N/A cho register endpoint | N/A | N/A |

SEC-06 và SEC-07 vẫn được ghi để xác nhận scope, nhưng không tạo expected không liên quan cho coupon/product.

## 3. Checklist bảo mật dùng chung

| ID | Check | Applicable API | Expected | Verification/impact rule | Classification if failed |
| --- | --- | --- | --- | --- | --- |
| `SEC-COM-01` | Missing JWT | Coupon, Product | Coupon: `401`; Product: `401`; không side effect | Xác minh coupon usage/product count không đổi | Authorization/security |
| `SEC-COM-02` | Malformed bearer token | Coupon, Product | `401`/`403`, JSON error; không side effect | Dùng token không có cấu trúc JWT hoặc sai signature | Authentication/security |
| `SEC-COM-03` | Expired JWT | Coupon, Product | `401`/`403`; không side effect | Dùng JWT ký hợp lệ cho test nhưng có `exp` trong quá khứ; không chỉ sửa chuỗi token làm signature sai | Authentication/security |
| `SEC-COM-04` | Wrong auth scheme | Coupon, Product | Reject `Token x`, raw JWT hoặc `Basic`; chỉ nhận `Bearer <JWT>` | Side effects không đổi | Authentication/security |
| `SEC-COM-05` | Empty/malformed JSON | All | `400`; response an toàn, không mutation | Kiểm tra content type và absence của created row/usage | Schema/robustness, không tự động là security |
| `SEC-COM-06` | SQL injection strings in every string field | All | Dữ liệu được parameterized/treated as literal hoặc rejected; không query expansion | Chứng minh row count/target không vượt scope; không dựa riêng vào status | Security nếu injection thành công; validation/robustness nếu chỉ reject/crash |
| `SEC-COM-07` | XSS payload persistence | Register, Product; Coupon code where setup permits | Payload không thực thi khi hiển thị; output encoding tại UI sink | API acceptance có thể hợp lệ cho free text; mở UI/inspect DOM để xác minh execution | Security chỉ khi unsafe render/execution; nếu API constraint cấm thì có thể là validation defect |
| `SEC-COM-08` | Sensitive-data leakage in success/error | All | Không password, JWT, secret key, SQL statement, stack trace, absolute path hoặc internal DB detail | Kiểm tra headers/body của cả success và failure | Information-disclosure security defect nếu sensitive detail lộ |
| `SEC-COM-09` | Unexpected fields | All | Ignore/reject theo contract; tuyệt đối không persist/echo field nhạy cảm | Gửi `role`, `is_active`, `discount_value`, arbitrary ID/owner fields tùy API | Mass assignment nếu field tác động state; nếu chỉ ignore/400 thì contract behavior |
| `SEC-COM-10` | Wrong `Content-Type` with JSON-looking body | All | `400`/`415`; không mutation | Gửi `text/plain`, form data và missing content type | Schema/robustness trừ khi bypass validation/auth |
| `SEC-COM-11` | Duplicate/replay request | All mutation/stateful paths | Không tạo unauthorized duplicate state; behavior đúng business/idempotency contract | Count rows/usages, không chỉ kiểm tra message | Business/robustness; security nếu replay vượt usage/access control |

## 4. Registration security checklist

### 4.1 Endpoint-specific abuse checklist

| ID | Area | Payload/action | Expected | Side-effect verification | Classification guidance |
| --- | --- | --- | --- | --- | --- |
| `REG-SEC-01` | SEC-01 password storage | Register valid user, inspect controlled test DB or trusted admin boundary | Stored password is a salted password hash; raw password never returned | User exists once; stored value differs from raw secret; login still works through password verification | Plaintext storage is security defect |
| `REG-SEC-02` | Sensitive response | Valid registration | Response contains only success message and new ID | Body/header contains no password, hash, token, SQL or stack | Leakage is security defect |
| `REG-SEC-03` | Mass assignment / role escalation | Add `role:"admin"`, `is_admin:true`, `permissions:["*"]`, `id:1` | Unknown fields rejected or ignored; created account remains normal user | Login then inspect JWT role/admin user list; role must not be admin | Security defect only if privilege changes |
| `REG-SEC-04` | Unexpected nested/prototype-like fields | Add `__proto__`, `constructor`, nested `user.role` | No prototype pollution or privilege/state change | Create a clean follow-up account and inspect application behavior | Security if shared object/privilege affected; otherwise schema behavior |
| `REG-SEC-05` | SQL injection email/name | Values such as `' OR '1'='1` and quote/comment markers | Treated as literal or rejected; no existing user modified/disclosed | Admin users count and seed identities unchanged | Successful query manipulation is security; `400` alone is not |
| `REG-SEC-06` | Stored XSS candidate | Name `<img src=x onerror=...>` or inert test marker | API may accept free-text name only if UI later escapes it | Open admin/user UI; marker must render as text, no event/script execution | Security only when unsafe sink executes/renders markup |
| `REG-SEC-07` | Duplicate identity | Register same email twice | Second request rejected; one account only | Count exact normalized email; original password/role/ID unchanged | Primarily business/integrity; security if account takeover/overwrite occurs |
| `REG-SEC-08` | Email canonicalization | Case/whitespace variants of same address | Behavior must be specified and consistent; no ambiguous duplicate identity | Query all variants; login identity remains deterministic | Contract gap unless exploitable account confusion |
| `REG-SEC-09` | Error leakage | Trigger duplicate/DB constraint/invalid body | Safe JSON error without SQL, table/column detail, stack or filesystem path | Inspect raw response and content type | Sensitive internal error is security defect |
| `REG-SEC-10` | JWT supplied to public endpoint | Send user/admin/malformed Authorization while registering | Authorization must not grant a different role or alter validation | Created role remains normal; response schema unchanged | Security only if token changes privilege/result unexpectedly |

### 4.2 Registration schema contract

#### Request

Expected JSON object:

```json
{
  "name": "Nguyen Van A",
  "email": "unique@example.test",
  "password": "Password123!",
  "confirm_password": "Password123!"
}
```

`confirm_password` is required by FR-01 but omitted from the API specification body. Until the specification is clarified, tests must record this as a spec gap while preserving the FR-01 expectation that confirmation exists and matches.

| Field | Exact type | Required | Constraints |
| --- | --- | --- | --- |
| `name` | string | Yes | Non-empty user name; exact max not specified |
| `email` | string | Yes | Valid email format; unique |
| `password` | string | Yes | Min 8; uppercase, lowercase, digit and one of `@ $ ! % * ? &` |
| `confirm_password` | string | Yes by FR-01 | Exactly matches password |

Fields not allowed to control state: `id`, `role`, `is_admin`, `permissions`, `login_attempts`, `locked_until`, `reset_token`, `shipping_address`, `phone`, `created_at`, password hash/salt fields, and any unknown nested ownership/privilege object.

#### Success response

| Contract item | Exact expectation |
| --- | --- |
| Status | `200 OK` |
| Content-Type | `application/json; charset=utf-8` |
| Required fields | `message: string`, `id: positive integer` |
| Allowed success fields | Exactly `message`, `id` unless specification is versioned |
| Must not appear | `password`, `confirm_password`, password hash/salt, `token`, `reset_token`, `role`, database error/detail, stack trace |
| Side effect | Exactly one normal user created for the unique email |

#### Failure response

| Contract item | Exact expectation |
| --- | --- |
| Status | `400` for invalid schema/validation; duplicate status must be standardized as `400` or `409`; malformed JSON `400`; unexpected server error `500` |
| Content-Type | JSON for application-level errors; malformed JSON should also use safe structured JSON if error middleware standardizes it |
| Required fields | `error: string` |
| Must not appear | Raw password, SQL/SQLite message, table/column names, stack, absolute filesystem path |
| Side effect | No user row created or modified |

## 5. Coupon security checklist

### 5.1 Endpoint-specific abuse checklist

| ID | Area | Payload/action | Expected | Side-effect verification | Classification guidance |
| --- | --- | --- | --- | --- | --- |
| `CPN-SEC-01` | Missing/malformed/expired JWT | Apply valid coupon with each token state | Reject before coupon calculation; `401`/`403` | Usage count unchanged; later valid apply remains eligible | Authentication/security |
| `CPN-SEC-02` | IDOR / `user_id` tampering | JWT user 2 with `user_id=1`, another user, `0`, negative, string or omitted | Identity comes from JWT; mismatch rejected/ignored safely | No lookup/usage attribution to victim; victim limit unchanged | IDOR/security if caller can consume/bypass another user's usage state |
| `CPN-SEC-03` | Usage-limit bypass | Omit `user_id`, change it each request, or use alternate type after reaching max | Limit enforced for JWT subject regardless of body | Record known max usage, then apply must reject for same JWT | Business authorization/security abuse if bypass succeeds |
| `CPN-SEC-04` | Mass assignment | Add `coupon_id`, `discount_value`, `type`, `min_order_amount`, `is_active`, `max_uses_per_user`, `final_amount` | Server ignores/rejects client-calculated/control fields | Calculation uses persisted coupon only; metadata unchanged | Security/integrity if client changes discount/control state |
| `CPN-SEC-05` | Amount tampering | Negative, zero, string, very large, `NaN`-like string, scientific notation, fractional | Strict finite JSON number, non-negative; checkout recomputes trusted total | No usage record; no negative/over-total discount | Business/security if financial amount can be manipulated; otherwise validation defect |
| `CPN-SEC-06` | SQL injection code | Quote/comment/boolean payload in `code` | Parameterized literal lookup; no coupon enumeration/bypass | Only exact code can match; coupon table unchanged | Successful lookup bypass/data leak is security |
| `CPN-SEC-07` | XSS/error reflection | HTML/script marker as code | Not reflected unsafely; UI displays any message/code as text | Inspect checkout DOM; no execution | Security only with unsafe render |
| `CPN-SEC-08` | Sensitive leakage | Unknown/expired/invalid code and DB failure paths | No coupon internals beyond contract; no SQL/stack/path/JWT | Inspect raw body/headers | Information disclosure if sensitive detail exposed |
| `CPN-SEC-09` | Replay usage recording | Repeat `POST /api/coupon-usage` for one checkout | Must not double-count the same business event; idempotency rule needed | Direct controlled DB count or behavior at max | Contract gap/business integrity; security if replay enables denial/financial abuse |
| `CPN-SEC-10` | Role escalation assumption | User vs admin JWT apply same eligible coupon | Admin claim must not bypass expiry/minimum/usage rules | Same business calculations/limits for equivalent identity state | Authorization defect if privileged token bypasses rules without spec basis |

### 5.2 Coupon schema contract

#### Request

```json
{
  "code": "SAVE10",
  "total_amount": 300000,
  "user_id": 2
}
```

| Field | Exact type | Required | Constraints/security note |
| --- | --- | --- | --- |
| `code` | string | Yes | Non-empty; exact coupon code; active and unexpired record must exist |
| `total_amount` | finite number | Yes | Non-negative and `>= min_order_amount`; checkout must recompute trusted total |
| `user_id` | positive integer in current API specification | Listed as request field | Must equal JWT subject or be removed from client contract in favor of JWT-derived identity |

Fields that must not influence calculation/state: `coupon_id`, `type`, `discount_value`, `min_order_amount`, `expired_at`, `is_active`, `max_uses_per_user`, `usage_count`, `discount_amount`, `final_amount`, `role`, arbitrary owner/user objects.

Required header: `Authorization: Bearer <valid JWT>` according to FR-09 C4, plus JSON content type.

#### Success response

| Contract item | Exact expectation |
| --- | --- |
| Status | `200 OK` |
| Content-Type | `application/json; charset=utf-8` |
| Required fields | `success: boolean(true)`, `coupon_id: positive integer`, `discount_amount: finite non-negative number`, `final_amount: finite non-negative number`, `message: string` |
| Allowed fields | Exactly the five fields above unless contract is versioned |
| Must not appear | JWT/user object, `user_id`, usage rows/count unless explicitly specified, coupon secret/admin metadata, SQL/stack/path |
| Side effect | Apply/preview does not itself record usage; coupon metadata and user identity remain unchanged |

Calculation assertions:

- Percent: `discount_amount = total_amount * discount_value / 100`.
- Fixed: `discount_amount = discount_value`.
- `final_amount = total_amount - discount_amount`.
- Any rounding policy must be specified before enforcing a rounded exact value.

#### Failure response

| Contract item | Exact expectation |
| --- | --- |
| Status | `400` invalid input/expired/below minimum/limit; `401` missing auth; `403` invalid/expired token as chosen policy; `404` missing/inactive coupon; `500` unexpected server failure |
| Content-Type | `application/json; charset=utf-8` |
| Required fields | `error: string` |
| Must not appear | Discount success fields, user details, JWT, raw SQL, stack, filesystem path |
| Side effect | Usage count, coupon state and order state unchanged |

## 6. Product security checklist

### 6.1 Endpoint-specific abuse checklist

| ID | Area | Payload/action | Expected | Side-effect verification | Classification guidance |
| --- | --- | --- | --- | --- | --- |
| `PRD-SEC-01` | Missing/malformed/expired JWT | Submit otherwise valid product | `401`/`403`; no product | Unique product name absent from list | Authentication/security |
| `PRD-SEC-02` | Role enforcement | Valid `role=user` JWT | `403`; no product | Unique name absent; product count unchanged | SEC-03 authorization/security |
| `PRD-SEC-03` | Role claim tampering | Modify JWT payload from user to admin without valid re-signing | Signature verification rejects token | No product; original user role unchanged | Authentication/security |
| `PRD-SEC-04` | Mass assignment | Add `id`, `owner_id`, `user_id`, `role`, `is_admin`, `created_by`, category object, timestamps | Ignore/reject unknown fields; server owns identity/audit fields | GET created resource contains no injected control field; no other row changed | Security if privilege/ownership/state changed; otherwise schema defect |
| `PRD-SEC-05` | SQL injection | Injection markers in name/description/imageUrl; numeric-field type abuse | Parameterized insert; payload literal or validation reject | Product/category/user counts and unrelated rows unchanged | Security only if SQL semantics change/data leaks |
| `PRD-SEC-06` | Stored XSS | Inert script/img/svg/event payload in name/description/imageUrl | Data must never execute in storefront/admin UI; URL handling safe | Retrieve then open all rendering surfaces; inspect DOM and network behavior | Security only after unsafe sink/execution/unsafe URL impact |
| `PRD-SEC-07` | Category reference tampering | Nonexistent, negative, string, another type as `category_id` | `400`/`422`; no product | List/name absent; category state unchanged | Validation/integrity; security only if cross-tenant/access boundary exists |
| `PRD-SEC-08` | Sensitive leakage | Force DB error, malformed JSON, invalid category/type | Safe error; no SQL/schema/path/stack/token | Inspect body/headers | Information disclosure if internal detail exposed |
| `PRD-SEC-09` | Unexpected field/type coercion | Arrays/objects/null/boolean for scalar fields | `400`; no implicit stringification/persistence | No product; other products unchanged | Schema/robustness unless bypass causes security impact |
| `PRD-SEC-10` | Cross-role replay | Reuse admin create body with guest/user token after admin success | Guest/user request rejected; no duplicate | Count exact unique marker/IDs | Authorization/security if lower role creates duplicate |

### 6.2 Product schema contract

#### Request

```json
{
  "name": "HW06 Product",
  "price": 100000,
  "description": "Description",
  "imageUrl": "https://example.test/product.png",
  "category_id": 1
}
```

| Field | Exact type | Required | Constraints |
| --- | --- | --- | --- |
| `name` | string | Yes | Non-empty, maximum 255 characters |
| `price` | finite number | Yes | Strictly greater than 0 |
| `description` | string | No | If supplied, valid string; safely rendered |
| `imageUrl` | string | No | If supplied, URL policy should be specified; safely consumed/rendered |
| `category_id` | positive integer | Yes | Must reference an existing category |

Required header: `Authorization: Bearer <admin JWT>` and `Content-Type: application/json`.

Fields not allowed in create request/state: `id`, `owner_id`, `user_id`, `created_by`, `role`, `is_admin`, `permissions`, `created_at`, `updated_at`, nested category/user objects, or any unknown field not in the five-field contract.

#### Success response

| Contract item | Exact expectation |
| --- | --- |
| Status | `200 OK` |
| Content-Type | `application/json; charset=utf-8` |
| Required fields | `message: string`, `id: positive integer` |
| Allowed success fields | Exactly `message`, `id` unless specification is versioned |
| Must not appear | JWT, admin/user object, internal role/permissions, SQL/stack/path, request fields echoed without need |
| Side effect | Exactly one product created; persisted fields match normalized request; category and unrelated products unchanged |

#### Failure response

| Contract item | Exact expectation |
| --- | --- |
| Status | `400` invalid schema/constraint; `401` missing auth; `403` invalid token/non-admin; `400` or `422` invalid category after policy is standardized; `500` unexpected failure |
| Content-Type | `application/json; charset=utf-8` |
| Required fields | `error: string` |
| Must not appear | Created ID/message, JWT, user/admin details, raw SQL/SQLite details, stack, absolute path |
| Side effect | No product created or partially persisted; unrelated product/category state unchanged |

## 7. Malformed JSON and content-type checklist

Run these shapes independently for each API, with valid authorization where the endpoint requires it:

| ID | Input shape | Expected status/content type | Side-effect verification | Default classification |
| --- | --- | --- | --- | --- |
| `SCH-MAL-01` | Empty body | `400`, JSON error | No user/usage/product mutation | Schema/validation |
| `SCH-MAL-02` | Truncated object: `{"name":` | `400`, safe JSON error | No mutation | Parser robustness; security only if sensitive stack/path leaks |
| `SCH-MAL-03` | Trailing comma | `400`, safe JSON error | No mutation | Parser robustness |
| `SCH-MAL-04` | Duplicate JSON keys | Reject or deterministic documented policy; security-sensitive keys must not be ambiguous | Verify chosen value cannot bypass role/identity/amount validation | Security if parser differential enables bypass |
| `SCH-MAL-05` | Top-level array/string/number/null | `400`, JSON error | No mutation | Schema validation |
| `SCH-MAL-06` | Valid JSON with `text/plain` | `400`/`415`; no mutation | No mutation | Content negotiation/robustness |
| `SCH-MAL-07` | JSON body exceeding configured limit | `413 Payload Too Large` | No mutation; service remains available | Availability/security only if resource exhaustion is demonstrated |
| `SCH-MAL-08` | Invalid UTF-8/control characters | `400`; safe response | No mutation; next valid request succeeds | Robustness/security if parser smuggling or service impact occurs |

## 8. Side-effect verification matrix

| API | Success verification | Failure verification | Teardown |
| --- | --- | --- | --- |
| Register | Capture `id`; `GET /api/admin/users` shows exactly one matching email; optional login succeeds | Matching email absent, or duplicate count stays exactly one; original role/password behavior unchanged | `DELETE /api/admin/users/:id`; reset SQLite fallback |
| Apply coupon | Validate formula and coupon ID; apply alone does not increment usage | Usage count and coupon metadata unchanged; later valid request remains eligible unless prior legitimate usage reached max | Reset SQLite for usage state; delete test-created coupon |
| Product | Capture `id`; `GET /api/products/:id` matches all allowed persisted fields | Unique marker absent from list/detail; product count and unrelated products/categories unchanged | `DELETE /api/products/:id` with admin token; reset fallback |

If expected failure returns an error but creates or modifies state, record both the response defect and the state-integrity impact. Do not mark a case pass based only on status code.

## 9. Finding classification guide

| Observation | Default finding type | When it becomes security |
| --- | --- | --- |
| Required field accepted as null | Schema/validation | It bypasses access control, changes ownership/role, or causes exploitable behavior |
| Wrong `400` vs `422` | Contract consistency | Rarely security by itself |
| Unknown harmless field ignored | Pass/contract behavior | Never a bug without a conflicting strict-schema requirement |
| Unknown field persisted | Mass assignment/schema | Security if it changes privilege, ownership, activation, price/discount control or protected state |
| XSS marker stored | Input/encoding observation | Stored XSS only when unsafe render/execution is demonstrated |
| Quote causes `500` | Robustness/error handling | SQL injection only when query semantics/data access is altered; information disclosure if sensitive DB details leak |
| Missing JWT still returns business response | Authorization | Security because protected operation/data is accessible |
| Non-admin creates product | Authorization/SEC-03 | Security because privilege boundary is bypassed |
| Coupon `user_id` can be changed | Identity-integrity/IDOR candidate | Security when another user's limit/state can be read, consumed or bypassed |
| Error contains stack/absolute path | Information disclosure | Security when internal implementation detail is exposed; severity depends on exploitability |

Không tạo defect chỉ từ tên payload hoặc từ việc response khác mong đợi. Mỗi security finding phải kèm request, response, state verification và security impact quan sát được.
