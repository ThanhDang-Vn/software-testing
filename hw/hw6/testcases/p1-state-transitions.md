# P1 — State Transition Analysis

## 1. Phạm vi và quy ước

Tài liệu phân tích state transition cho ba API HW06:

- Registration: `POST /api/register`
- Coupon: `POST /api/apply-coupon`, cùng bước ghi usage qua `POST /api/coupon-usage`
- Product: `POST /api/products`

Oracle lấy từ `hw/eshop-sut/README.md` và `hw/eshop-sut/api_specification.md`. Behavior khác biệt trong implementation chỉ được ghi là observation, không thay đổi transition expected.

Quy ước:

- **Valid transition**: event được phép ở initial state và đưa resource sang next state expected.
- **Invalid transition**: event phải bị từ chối; business state phải giữ nguyên.
- Setup và teardown là thao tác chuẩn bị/dọn state, không phải request mục tiêu đang được đánh giá.
- Verification ưu tiên endpoint đọc hoặc kiểm tra state độc lập với response của test action.
- Đây là phân tích state, chưa phải bộ test case đầy đủ và không phải diagram cuối của Agent Generator.

## 2. Registration state transitions

### 2.1 State model

| State ID | State | Invariant |
| --- | --- | --- |
| `REG-S0` | Account absent | Không có user nào mang email mục tiêu |
| `REG-S1` | Account created | Có đúng một user mang email mục tiêu; user có ID và role mặc định |
| `REG-S2` | Duplicate attempt rejected | Account ban đầu vẫn tồn tại; không sinh user thứ hai cùng email |
| `REG-SX` | Invalid registration rejected | Account vẫn absent vì dữ liệu không hợp lệ không được persist |

`REG-S2` là outcome quan sát của event duplicate, không phải một account state mới trong database. Business state của account vẫn là `REG-S1`.

### 2.2 Transition matrix

| Transition | Initial state | Event/request | Expected response | Next state | Valid/invalid | Setup endpoint/action | Verification endpoint | Teardown |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `REG-T01` | `REG-S0` account absent | `POST /api/register` với name, unique email, strong password và confirmation khớp | `200`, success message, positive user ID | `REG-S1` account created | Valid | Reset SQLite; tạo email run-unique; có thể dùng `GET /api/admin/users` để xác nhận email chưa tồn tại | `GET /api/admin/users`; tùy chọn `POST /api/login` bằng identity vừa tạo | `DELETE /api/admin/users/:id` bằng admin token; fallback reset SQLite |
| `REG-T02` | `REG-S1` account đã tồn tại | Gửi lại `POST /api/register` với cùng email | Client error phù hợp (`409` hoặc `400`, specification cần chốt); không tạo row mới | `REG-S2`, business state vẫn là `REG-S1` | Invalid transition | Thực hiện thành công `REG-T01` hoặc dùng email seed `test@eshop.com` | `GET /api/admin/users`: count của email vẫn bằng 1; login cũ vẫn hoạt động | Xóa user do suite tạo; không xóa seed identity; reset SQLite nếu dùng seed |
| `REG-T03` | `REG-S0` | `POST /api/register` thiếu field, email sai format, password yếu hoặc confirmation không khớp | `400`; không tạo account | `REG-SX`, business state vẫn `REG-S0` | Invalid transition | Tạo email run-unique chưa tồn tại | `GET /api/admin/users`: không có email mục tiêu; login phải thất bại | Không có row thì không cần xóa; nếu SUT tạo ngoài expected, capture ID và xóa/reset |
| `REG-T04` | `REG-S2` sau duplicate rejection | `POST /api/login` bằng credential của account gốc | Login thành công; duplicate attempt không làm hỏng account gốc | `REG-S1` | Valid supporting transition | Hoàn tất `REG-T01` rồi `REG-T02` | Chính response login và `GET /api/admin/users` | Xóa user gốc của run |

### 2.3 Transition invariants

- Chỉ transition hợp lệ từ absent sang created được tăng số user lên một.
- Duplicate hoặc invalid registration không được tạo side effect một phần.
- Duplicate attempt không được thay password, role hay ID của account đã tồn tại.
- Password persisted phải tuân SEC-01; verification không được yêu cầu API trả password.
- Teardown luôn dùng ID capture từ create response, không xóa theo “user cuối cùng”.

### 2.4 Implementation observation cần giữ tách biệt

Route hiện không validate required/email/password/confirmation và đưa password trực tiếp vào insert. Mọi insert error được map thành `500`. Các observation này là mục tiêu để kiểm chứng; chúng không biến `500`, duplicate acceptance hoặc weak-password acceptance thành transition hợp lệ.

## 3. Coupon state transitions

### 3.1 State dimensions

Coupon có ít nhất ba dimension độc lập:

1. Lifecycle: `active` hoặc `expired`; inactive cũng bị coi là không eligible.
2. Eligibility của request: đủ threshold, authenticated và chưa hết lượt.
3. Usage count theo cặp `(coupon_id, user_id)`.

| State ID | State | Invariant |
| --- | --- | --- |
| `CPN-S0` | Eligible, unused | Coupon active, còn hạn, total đạt minimum, user authenticated, usage count `0 < max` |
| `CPN-S1` | Applied/validated | Coupon đã được tính hợp lệ cho request hiện tại; usage chưa tự động tăng chỉ vì preview/apply |
| `CPN-S2` | Usage recorded | `coupon_usage` tăng một row cho authenticated user sau checkout thành công |
| `CPN-S3` | Usage still available | Usage count vẫn nhỏ hơn `max_uses_per_user` |
| `CPN-S4` | Usage limit reached | Usage count bằng hoặc lớn hơn maximum; lần apply tiếp theo phải bị từ chối |
| `CPN-SE` | Expired | `expired_at` ở quá khứ; không được apply dù các điều kiện khác đúng |
| `CPN-SI` | Inactive/not found | Coupon không tồn tại hoặc `is_active != 1`; không được apply |

### 3.2 Main transition matrix

| Transition | Initial state | Event/request | Expected response | Next state | Valid/invalid | Setup endpoint/action | Verification endpoint | Teardown |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `CPN-T01` | `CPN-S0` eligible, usage 0 | `POST /api/apply-coupon` với JWT user, matching user identity, total `>= min_order_amount` | `200`; discount/final đúng công thức | `CPN-S1` applied/validated; persistent usage vẫn 0 | Valid | Reset SQLite; `POST /api/login`; dùng coupon seed `SAVE10`, `BIGBUY` hoặc tạo qua `POST /api/admin/coupons` | Response calculation; `GET /api/coupons` xác minh metadata; chưa có usage-read endpoint công khai | Không ghi usage nếu chỉ preview; xóa coupon test hoặc reset SQLite |
| `CPN-T02` | `CPN-S1` apply thành công và checkout thành công | `POST /api/coupon-usage` với `{coupon_id}` và user JWT | `200`, usage recorded | `CPN-S2`; count tăng 1 | Valid supporting transition | Hoàn tất apply và business checkout; giữ cùng authenticated user | Apply lại coupon là indirect verification của limit; direct DB verification chỉ dùng trong controlled test environment | Reset SQLite; không để usage row sang independent run |
| `CPN-T03` | `CPN-S2`, count `1`, coupon `VIP100` max `2` | Apply lại `VIP100` với request eligible | `200` vì `1 < 2` | `CPN-S1`, rồi `CPN-S3` cho tới khi usage lần hai được ghi | Valid | Seed/reset; record một usage qua `POST /api/coupon-usage` | `POST /api/apply-coupon` và kiểm tra calculation | Ghi/xóa state theo workflow rồi reset SQLite |
| `CPN-T04` | `CPN-S2`, count `max-1` | Sau apply/checkout hợp lệ, gọi `POST /api/coupon-usage` | `200`; count đạt max | `CPN-S4` usage limit reached | Valid supporting transition | Dùng `VIP100` và chuẩn bị count 1, hoặc coupon riêng có max xác định | Lần apply kế tiếp phải bị từ chối do limit | Reset SQLite |
| `CPN-T05` | `CPN-S4` usage count đã đạt max | `POST /api/apply-coupon` với mọi điều kiện khác hợp lệ | Client error, expected `400`/`409`; không thay usage | Vẫn `CPN-S4` | Invalid transition | Ghi đủ usage rows cho cùng coupon và authenticated user | Apply response bị reject; count không tăng; direct DB verification nếu môi trường cho phép | Reset SQLite |
| `CPN-T06` | `CPN-SE` expired | `POST /api/apply-coupon` với `EXPIRED`, JWT hợp lệ và total đủ | `400`, expired error | Vẫn `CPN-SE` | Invalid transition | Reset SQLite dùng seed `EXPIRED`, hoặc tạo coupon có expiry quá khứ | Response; `GET /api/coupons` xác minh `expired_at` | Xóa coupon test hoặc reset |
| `CPN-T07` | Active coupon còn hạn nhưng total dưới minimum | `POST /api/apply-coupon` | `400`, insufficient order; usage không đổi | Vẫn active/unused | Invalid transition | Reset; login user; chọn coupon và total `< min_order_amount` | Response; apply lại với total hợp lệ để chứng minh coupon vẫn usable | Reset SQLite |
| `CPN-T08` | Active coupon, total đúng minimum | `POST /api/apply-coupon` với `total_amount = min_order_amount` | `200` theo rule `>=` | `CPN-S1` | Valid boundary transition | Reset; login user; lấy exact minimum từ coupon metadata | Response calculation và status | Reset SQLite |
| `CPN-T09` | `CPN-SI` inactive/not found | `POST /api/apply-coupon` | `404`; không usage side effect | Vẫn `CPN-SI` | Invalid transition | Dùng code không tồn tại hoặc tạo rồi disable coupon trong controlled setup | Response; `GET /api/coupons`/setup evidence | Xóa coupon setup hoặc reset |
| `CPN-T10` | Coupon active/eligible nhưng guest hoặc JWT invalid | `POST /api/apply-coupon` không có JWT hợp lệ | `401`/`403`; không tính hoặc ghi usage | State coupon/usage không đổi | Invalid transition | Reset; không login hoặc dùng invalid token | Response; apply bằng JWT hợp lệ sau đó để xác minh coupon vẫn usable | Reset SQLite |

### 3.3 Active and expired lifecycle transitions

`POST /api/apply-coupon` không phải endpoint thay đổi lifecycle. Nó chỉ được phép hoặc bị từ chối dựa trên lifecycle hiện tại.

| Initial state | Event | Next state | Valid/invalid | Note |
| --- | --- | --- | --- | --- |
| Active, before expiry | Thời gian vẫn trước `expired_at` và apply eligible | Active + applied result | Valid | Apply không đổi `expired_at`/`is_active` |
| Active, clock vượt `expired_at` | Passage of time | Expired | Valid lifecycle transition | Không cần API mutation; test phải cố định/ghi nhận clock |
| Expired | Apply request | Expired | Invalid business transition | Phải reject, không “reactivate” |
| Inactive | Apply request | Inactive | Invalid business transition | Phải reject |
| Active | Admin delete `DELETE /api/admin/coupons/:id` | Not found | Valid admin teardown | Không phải test action của apply-coupon |

### 3.4 Usage consistency rules

- Identity dùng kiểm tra usage phải đến từ JWT, không được tin `user_id` tùy ý trong body.
- Apply/preview thành công chưa đủ để tăng usage; usage chỉ được ghi sau checkout thành công.
- Apply thất bại, checkout thất bại hoặc retry response không được tăng usage.
- Việc gọi usage-record endpoint lặp lại cần idempotency hoặc ràng buộc business để tránh double count; specification hiện chưa định nghĩa idempotency key.
- Không dùng chung coupon/user usage state giữa các transition độc lập nếu không ghi rõ dependency.

### 3.5 Implementation observation cần giữ tách biệt

Implementation hiện để apply-coupon public, tin `user_id` trong body, có thể bỏ qua usage check khi thiếu `user_id`, dùng `>` thay vì `>=`, và dùng công thức percent khác requirement. Usage chỉ được thêm bởi endpoint riêng. Đây là các observation cần test; expected transition vẫn theo FR-09.

## 4. Product state transitions and role states

### 4.1 State model

| State ID | State | Invariant |
| --- | --- | --- |
| `PRD-S0` | Product absent | Không có product mang unique run marker/ID mục tiêu |
| `PRD-S1` | Product created | Có đúng một product mới với ID và dữ liệu hợp lệ |
| `PRD-S2` | Product retrievable | `GET /api/products/:id` trả đúng product persisted |
| `PRD-S3` | Product deleted | Product ID không còn retrievable; trạng thái teardown |
| `ROLE-GUEST` | Guest | Không có JWT |
| `ROLE-USER` | User | JWT hợp lệ, `role=user` |
| `ROLE-ADMIN` | Admin | JWT hợp lệ, `role=admin` |

Role là authorization state của actor, không phải lifecycle state của product. Cùng event `POST /api/products` có transition khác nhau tùy role.

### 4.2 Transition matrix

| Transition | Initial state | Actor state | Event/request | Expected response | Next state | Valid/invalid | Setup endpoint/action | Verification endpoint | Teardown |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `PRD-T01` | `PRD-S0` absent | `ROLE-GUEST` | `POST /api/products` body hợp lệ, không Authorization | `401`; không tạo product | Vẫn `PRD-S0` | Invalid transition | Reset; `GET /api/categories`; tạo unique product name; không login | `GET /api/products` không chứa unique name | Nếu SUT tạo ngoài expected, capture ID và admin-delete; reset fallback |
| `PRD-T02` | `PRD-S0` absent | `ROLE-USER` | `POST /api/products` body hợp lệ với user JWT | `403`; không tạo product | Vẫn `PRD-S0` | Invalid transition | `POST /api/login` bằng `test@eshop.com`; query category; tạo unique name | `GET /api/products` không chứa unique name | Nếu tạo ngoài expected, admin-delete theo captured ID; reset fallback |
| `PRD-T03` | `PRD-S0` absent | `ROLE-ADMIN` | `POST /api/products` body hợp lệ với admin JWT | `200`, message và positive ID | `PRD-S1` created | Valid | `POST /api/login` bằng admin; `GET /api/categories`; xác minh name absent | Create response; sau đó `GET /api/products/:id` | `DELETE /api/products/:id` với admin JWT; verify absence |
| `PRD-T04` | `PRD-S1` created | Public read actor | `GET /api/products/:id` | `200`, schema và field khớp request tạo | `PRD-S2` retrievable | Valid supporting transition | Hoàn tất `PRD-T03`, lưu `createdProductId` | Chính response detail; có thể cross-check `GET /api/products` | Admin-delete product |
| `PRD-T05` | `PRD-S1`/`PRD-S2` | `ROLE-ADMIN` | `DELETE /api/products/:id` | Success; product bị xóa | `PRD-S3` deleted | Valid teardown transition | Product do run hiện tại tạo, ID đã capture | `GET /api/products/:id` phải thể hiện not found theo contract đã chốt; list không chứa ID | Không còn cleanup; reset nếu delete thất bại |
| `PRD-T06` | `PRD-S0` absent | `ROLE-ADMIN` | `POST /api/products` với name/price/category invalid | `400`; không tạo product | Vẫn `PRD-S0` | Invalid transition | Login admin; chuẩn bị từng invalid partition; unique marker | `GET /api/products` không chứa marker | Nếu unexpected create, delete ID/reset |

### 4.3 Authorization transition truth table

| Product state before | Actor | Create permitted? | Product state after expected | Verification |
| --- | --- | --- | --- | --- |
| Absent | Guest | No | Absent | `401`; unique name absent |
| Absent | Authenticated user | No | Absent | `403`; unique name absent |
| Absent | Authenticated admin | Yes | Created, then retrievable | `200`; capture ID; GET detail matches |
| Created | Guest/user retry same create payload | No | Original remains; no second product | Reject response; count by unique name remains 1 |
| Created | Admin sends another create | Yes if business allows duplicate names | Hai resources có ID khác nhau; name uniqueness không được spec quy định | Verify by captured IDs, không suy đoán name unique |

### 4.4 Transition invariants

- Authorization failure không được tạo product hoặc consume ID như một business side effect.
- Successful create sinh đúng một positive ID.
- Created product phải retrievable với field values tương ứng; read schema không được đổi type theo ID.
- Product khác và category không bị thay đổi bởi create.
- Teardown xóa đúng `createdProductId`, không xóa theo name chung hoặc vị trí cuối danh sách.
- Input text được persist nhưng phải escape khi hiển thị theo SEC-04.

### 4.5 Implementation observation cần giữ tách biệt

Route create product hiện không có middleware authentication/role và không validate name, price hoặc category. Smoke response đã cho thấy guest/user/admin đều có thể đi từ absent sang created. Đây là implementation behavior sai khác; expected state model vẫn chỉ cho `ROLE-ADMIN` thực hiện transition hợp lệ.

## 5. Setup, verification và teardown chung

| Phase | Registration | Coupon | Product |
| --- | --- | --- | --- |
| Setup | Reset; admin login; unique email; verify absent | Reset; user/admin login; coupon metadata; known usage count | Reset; user/admin login; category exists; unique product marker |
| Test action | `POST /api/register` | `POST /api/apply-coupon` | `POST /api/products` |
| Verification | Admin users list; optional login | Response calculation; usage-limit behavior; controlled DB check nếu cần | Product list/detail by captured ID |
| Supporting state event | Login registered user | `POST /api/coupon-usage` after successful checkout | `GET /api/products/:id` |
| Teardown | Delete created user by ID | Delete test coupon/reset usage state | Delete created product by ID |

Khi teardown API thất bại hoặc SUT tạo state ngoài expected, đánh dấu môi trường dirty và reset SQLite trước transition tiếp theo. Không cho failure của transition trước làm thay đổi precondition của transition sau.
