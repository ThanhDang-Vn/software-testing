# Published GitHub Issues — HW06 Verified API Bugs

> Issues #49–#53 were published manually through the authenticated GitHub CLI. The screenshots below are real REST Client captures supplied by the student and will be attached to the corresponding issues by the student. Independent verification was run locally, so no bug-specific remote run/artifact URL is claimed.

Common verification environment for all issues:

- OS: Windows, local development environment
- SUT: EShop backend at `http://127.0.0.1:3000`
- Runtime: Node.js `v20.20.2`
- Newman source run: Newman `6.2.1`
- Database: local SQLite, dropped/recreated/seeded before each independent trial
- Independent verification: `2026-08-17T22:13:01Z`–`2026-08-17T22:13:06Z`
- Reproducibility: `2/2` independent trials after fresh state reset

---

## Issue 1 — Registration stores passwords in plaintext

**Published issue:** [#49](https://github.com/ThanhDang-Vn/software-testing/issues/49) — screenshot will be attached manually by the student.

### Title

`[SECURITY][Register] Password is stored in plaintext in SQLite`

### Environment

- Windows local environment
- EShop Node.js backend, Node.js `v20.20.2`
- SQLite `database.sqlite`
- Endpoint: `POST /api/register`
- State reset before each trial; reproduced `2/2`

### Related FR/SEC

- `SEC-01`: Passwords must not be stored as plaintext.
- `FR-01`: User registration and credential persistence.

### Preconditions

1. Stop the backend process currently listening on port 3000.
2. Start `hw/eshop-sut/backend/server.js` so `database.js` drops, recreates, and seeds SQLite.
3. Confirm the test email does not exist.
4. Have controlled, local read access to SQLite for security verification.

### Steps to reproduce

1. Send the registration request below with a unique email and distinctive password.
2. Confirm registration returns `200 OK`.
3. Query the created row by email:
   `SELECT id, email, password FROM users WHERE email = ?`.
4. Compare the stored `password` value with the submitted raw password.
5. Reset the database and repeat with a different email/password marker.

### Request

```http
POST /api/register HTTP/1.1
Host: 127.0.0.1:3000
Accept: application/json
Content-Type: application/json

{"name":"Verify Raw 1","email":"verify.raw.1@example.test","password":"VerifyRaw1!Secret","confirm_password":"VerifyRaw1!Secret"}
```

### Expected result

- Registration may return `200 OK` for valid input.
- The stored credential must be a salted, non-plaintext password representation.
- The raw password must not be recoverable by directly reading the user row.

### Actual result

- Response: `200 OK`, `{"message":"User registered successfully","id":3}`.
- DB row: `[{"id":3,"email":"verify.raw.1@example.test","password":"VerifyRaw1!Secret"}]`.
- The stored value exactly equals the submitted password. The same behavior occurred after the second independent reset with `VerifyRaw2!Secret`.

### Severity

`Critical`

### Impact

A database read, backup leak, injection vulnerability, or unauthorized administrator can immediately recover every user's reusable password. This can lead to account takeover in EShop and credential-stuffing attacks against other services.

### TC_ID

- `REG-AI-040`
- Verified defect ID: `VB-01`

### Evidence

- Full two-trial raw HTTP and DB evidence: [`verified-bugs.md` — VB-01](./verified-bugs.md#vb-01--registration-stores-password-as-plaintext)
- Newman register evidence: [`../reports/newman/register-run.cli.txt`](../reports/newman/register-run.cli.txt)
- Reproduction harness: [`../agent-generator/verify_defect_candidates.js`](../agent-generator/verify_defect_candidates.js)
- Real screenshot: [registration request and HTTP 200 response](./screenshots/bug1.png). This capture does not show the SQLite query; plaintext persistence is established by the two controlled DB observations in `verified-bugs.md` above.

### Commit/run link

- Evidence commit: [`8f555d779775045fdf8289367a5fae219e9466c1`](https://github.com/ThanhDang-Vn/software-testing/commit/8f555d779775045fdf8289367a5fae219e9466c1)
- Verification run/CI artifact: N/A — the two independent reset-state verification trials were executed locally; their raw HTTP and DB evidence is retained in `verified-bugs.md`.

---

## Issue 2 — Apply-coupon accepts requests without Authorization

**Published issue:** [#50](https://github.com/ThanhDang-Vn/software-testing/issues/50) — screenshot will be attached manually by the student.

### Title

`[SECURITY][Coupon] POST /api/apply-coupon succeeds without a JWT`

### Environment

- Windows local environment
- EShop Node.js backend, Node.js `v20.20.2`
- Endpoint: `POST /api/apply-coupon`
- Seed coupon: `SAVE10`, active, unexpired, minimum `300000`
- SQLite reset/reseed before each trial; reproduced `2/2`

### Related FR/SEC

- `FR-09 C4`: The user must be logged in.
- `SEC-02`: Protected APIs must require a valid JWT.

### Preconditions

1. Restart the backend to reset/reseed SQLite.
2. Confirm `SAVE10` is active and unexpired.
3. Do not obtain or send a JWT.
4. Use an otherwise eligible amount so authentication is the isolated missing condition.

### Steps to reproduce

1. Send the request below with no `Authorization` header.
2. Record the status and response body.
3. Reset/reseed SQLite and restart the backend.
4. Send the same request again.

### Request

```http
POST /api/apply-coupon HTTP/1.1
Host: 127.0.0.1:3000
Accept: application/json
Content-Type: application/json

{"code":"SAVE10","total_amount":500000,"user_id":2}
```

### Expected result

- Reject the request before coupon lookup/calculation with the standardized authentication failure (`401` or `403`, pending the status-code specification decision).
- Do not expose coupon calculation or user-specific usage information.

### Actual result

- Both trials returned `200 OK`.
- Response body:
  `{"success":true,"coupon_id":1,"discount_amount":-4500000,"final_amount":5000000,"message":"Áp dụng thành công! Giảm 10%"}`.
- The lack of a precise `401` versus `403` policy does not explain a successful `200` response.

### Severity

`High`

### Impact

Unauthenticated clients can invoke protected coupon logic while supplying an arbitrary `user_id`. This bypasses the authentication boundary, exposes coupon data, and creates a path for identity/usage-limit manipulation when the endpoint is integrated into checkout.

### TC_ID

- `CPN-AI-006`
- Verified defect ID: `VB-02`

### Evidence

- Full two-trial raw HTTP evidence: [`verified-bugs.md` — VB-02](./verified-bugs.md#vb-02--apply-coupon-succeeds-without-authorization)
- Newman coupon evidence: [`../reports/newman/coupon-run.cli.txt`](../reports/newman/coupon-run.cli.txt)
- Reproduction harness: [`../agent-generator/verify_defect_candidates.js`](../agent-generator/verify_defect_candidates.js)
- Real screenshot: [request without Authorization and HTTP 200 response](./screenshots/bug2.png).

### Commit/run link

- Evidence commit: [`8f555d779775045fdf8289367a5fae219e9466c1`](https://github.com/ThanhDang-Vn/software-testing/commit/8f555d779775045fdf8289367a5fae219e9466c1)
- Verification run/CI artifact: N/A — the two independent reset-state verification trials were executed locally; their raw HTTP evidence is retained in `verified-bugs.md`.

---

## Issue 3 — Product creation bypasses admin authorization

**Published issue:** [#51](https://github.com/ThanhDang-Vn/software-testing/issues/51) — screenshot will be attached manually by the student.

### Title

`[SECURITY][Products] Unauthenticated client can create and persist products`

### Environment

- Windows local environment
- EShop Node.js backend, Node.js `v20.20.2`
- SQLite `database.sqlite`
- Endpoint: `POST /api/products`
- State reset before each trial; reproduced `2/2`

### Related FR/SEC

- `FR-12`: Product create/update/delete operations are admin operations.
- `SEC-02`: Protected APIs require a valid JWT.
- `SEC-03`: Admin APIs must verify `role=admin` from the token.

### Preconditions

1. Restart the backend to drop/recreate/reseed SQLite.
2. Confirm category ID `1` exists.
3. Confirm the unique product marker is absent.
4. Do not send an `Authorization` header.

### Steps to reproduce

1. Send the valid product request below without a JWT.
2. Record the response status, body, and returned ID.
3. Query the product by its unique name or retrieve the returned ID.
4. Verify that the row was persisted.
5. Reset/reseed and repeat using a different marker.

### Request

```http
POST /api/products HTTP/1.1
Host: 127.0.0.1:3000
Accept: application/json
Content-Type: application/json

{"name":"VERIFY-NOAUTH-1","price":123456,"description":"raw verification","imageUrl":"https://example.test/raw.png","category_id":1}
```

### Expected result

- Return `401` for missing authentication.
- Do not create a product, consume a business ID, or change product state.

### Actual result

- Response: `200 OK`, `{"message":"Product created","id":6}`.
- DB row: `[{"id":6,"name":"VERIFY-NOAUTH-1","price":123456,"category_id":1}]`.
- The second clean trial also returned 200 and persisted `VERIFY-NOAUTH-2`.

### Severity

`Critical`

### Impact

Any unauthenticated attacker can modify the storefront catalog, create fraudulent or malicious listings, pollute inventory data, and potentially inject content that reaches customer/admin rendering surfaces. This is a direct privilege-boundary bypass with persistent effects.

### TC_ID

- `PRD-AI-002`
- Verified defect ID: `VB-03`

### Evidence

- Full two-trial raw HTTP and DB evidence: [`verified-bugs.md` — VB-03](./verified-bugs.md#vb-03--product-creation-succeeds-and-persists-without-admin-authorization)
- Newman product evidence: [`../reports/newman/product-run.cli.txt`](../reports/newman/product-run.cli.txt)
- Reproduction harness: [`../agent-generator/verify_defect_candidates.js`](../agent-generator/verify_defect_candidates.js)
- Real screenshot: [request without Authorization and HTTP 200 creation response](./screenshots/bug3.png). This capture does not show the database retrieval; persistence is established by the two controlled DB observations in `verified-bugs.md` above.

### Commit/run link

- Evidence commit: [`8f555d779775045fdf8289367a5fae219e9466c1`](https://github.com/ThanhDang-Vn/software-testing/commit/8f555d779775045fdf8289367a5fae219e9466c1)
- Verification run/CI artifact: N/A — the two independent reset-state verification trials were executed locally; their raw HTTP and DB evidence is retained in `verified-bugs.md`.

---

## Issue 4 — Coupon rejects equality at the inclusive minimum boundary

**Published issue:** [#52](https://github.com/ThanhDang-Vn/software-testing/issues/52) — screenshot will be attached manually by the student.

### Title

`[Coupon][Boundary] SAVE10 is rejected when total_amount equals min_order_amount`

### Environment

- Windows local environment
- EShop Node.js backend, Node.js `v20.20.2`
- Endpoint: `POST /api/apply-coupon`
- Seed coupon: `SAVE10`, `min_order_amount=300000`, active and unexpired
- State reset before each trial; reproduced `2/2`

### Related FR/SEC

- `FR-09 C3`: `total_amount >= min_order_amount` is eligible.
- Related TC boundary oracle: inclusive equality must succeed.

### Preconditions

1. Restart the backend to reset/reseed SQLite.
2. Confirm `SAVE10.min_order_amount` is exactly `300000` and the coupon is active/unexpired.
3. Use user ID `2` with usage below its limit.
4. Include the authentication context required by the test environment. The independent harness used a non-secret bearer marker because VB-02 separately proves this route does not validate it; this issue isolates the amount boundary.

### Steps to reproduce

1. Set `total_amount` to exactly `300000`.
2. Send the request below.
3. Record the status and error body.
4. Reset/reseed SQLite and repeat.

### Request

```http
POST /api/apply-coupon HTTP/1.1
Host: 127.0.0.1:3000
Accept: application/json
Content-Type: application/json
Authorization: Bearer intentionally-present-but-unchecked

{"code":"SAVE10","total_amount":300000,"user_id":2}
```

### Expected result

- `200 OK` because `300000 >= 300000`.
- For `SAVE10` at 10%, return `discount_amount=30000` and `final_amount=270000`.

### Actual result

- Both independent trials returned `400 Bad Request`.
- Response body: `{"error":"Đơn hàng chưa đủ giá trị tối thiểu 300,000 ₫ để áp dụng mã này"}`.
- The SUT reports that an amount equal to the minimum is insufficient.

### Severity

`High`

### Impact

Eligible customers are incorrectly denied coupons at the exact advertised minimum. This causes inconsistent checkout behavior, customer complaints, and loss of trust or conversion at a common boundary value.

### TC_ID

- `CPN-AI-010`
- Verified defect ID: `VB-04`

### Evidence

- Full two-trial raw HTTP evidence: [`verified-bugs.md` — VB-04](./verified-bugs.md#vb-04--coupon-rejects-the-inclusive-minimum-boundary)
- Newman coupon evidence: [`../reports/newman/coupon-run.cli.txt`](../reports/newman/coupon-run.cli.txt)
- Reproduction harness: [`../agent-generator/verify_defect_candidates.js`](../agent-generator/verify_defect_candidates.js)
- Real screenshot: [equality-boundary request and HTTP 400 response](./screenshots/bug4.png). The seeded `SAVE10` minimum (`300000`) is recorded in the raw verification evidence.

### Commit/run link

- Evidence commit: [`8f555d779775045fdf8289367a5fae219e9466c1`](https://github.com/ThanhDang-Vn/software-testing/commit/8f555d779775045fdf8289367a5fae219e9466c1)
- Verification run/CI artifact: N/A — the two independent reset-state verification trials were executed locally; their raw HTTP evidence is retained in `verified-bugs.md`.

---

## Issue 5 — Percent coupon returns a negative discount and inflated final amount

**Published issue:** [#53](https://github.com/ThanhDang-Vn/software-testing/issues/53) — screenshot will be attached manually by the student.

### Title

`[Coupon][Calculation] Percent discount formula returns negative discount and inflated final amount`

### Environment

- Windows local environment
- EShop Node.js backend, Node.js `v20.20.2`
- Endpoint: `POST /api/apply-coupon`
- Seed coupon: `SAVE10`, type `percent`, `discount_value=10`
- State reset before each trial; reproduced `2/2`

### Related FR/SEC

- `FR-09`: For percent coupons, `discount_amount = total × discount_value / 100`.
- `FR-09`: `final_amount = total - discount_amount`.

### Preconditions

1. Restart the backend to reset/reseed SQLite.
2. Confirm `SAVE10` is active, unexpired, type `percent`, and has `discount_value=10`.
3. Use `total_amount=500000`, which is above the minimum and produces an exact integer result; no rounding policy is involved.
4. Use user ID `2` below its usage limit.

### Steps to reproduce

1. Send the request below.
2. Record `discount_amount` and `final_amount`.
3. Independently calculate `500000 × 10 / 100 = 50000` and `500000 - 50000 = 450000`.
4. Compare the response with those values.
5. Reset/reseed SQLite and repeat.

### Request

```http
POST /api/apply-coupon HTTP/1.1
Host: 127.0.0.1:3000
Accept: application/json
Content-Type: application/json
Authorization: Bearer intentionally-present-but-unchecked

{"code":"SAVE10","total_amount":500000,"user_id":2}
```

### Expected result

```json
{
  "success": true,
  "coupon_id": 1,
  "discount_amount": 50000,
  "final_amount": 450000
}
```

Additional message fields may be present if allowed by the response contract, but the monetary values must follow FR-09.

### Actual result

Both clean trials returned:

```json
{
  "success": true,
  "coupon_id": 1,
  "discount_amount": -4500000,
  "final_amount": 5000000,
  "message": "Áp dụng thành công! Giảm 10%"
}
```

The discount is negative and the final amount is ten times the original total. Because the chosen values produce exact integers, the missing fractional-rounding specification cannot explain this result.

### Severity

`Critical`

### Impact

The checkout calculation can charge or display a grossly incorrect amount and corrupt any downstream order, payment, accounting, reporting, or customer-support data that trusts this response. This is a direct financial-integrity defect.

### TC_ID

- `CPN-AI-001` — baseline eligible coupon and exact schema/calculation
- `CPN-AI-015` — independently recompute an evenly divisible percent discount
- Verified defect ID: `VB-05`

### Evidence

- Full two-trial raw HTTP evidence: [`verified-bugs.md` — VB-05](./verified-bugs.md#vb-05--percent-coupon-calculation-uses-the-wrong-formula)
- Newman coupon evidence: [`../reports/newman/coupon-run.cli.txt`](../reports/newman/coupon-run.cli.txt)
- Reproduction harness: [`../agent-generator/verify_defect_candidates.js`](../agent-generator/verify_defect_candidates.js)
- Real screenshot: [500000 request and incorrect returned monetary fields](./screenshots/bug5.png).

### Commit/run link

- Evidence commit: [`8f555d779775045fdf8289367a5fae219e9466c1`](https://github.com/ThanhDang-Vn/software-testing/commit/8f555d779775045fdf8289367a5fae219e9466c1)
- Verification run/CI artifact: N/A — the two independent reset-state verification trials were executed locally; their raw HTTP evidence is retained in `verified-bugs.md`.

---

## Pre-post checklist

- [x] Replace every evidence commit placeholder with an immutable GitHub commit permalink.
- [x] Replace every run placeholder with a real CI/Newman artifact link, or explicitly state why no remote run exists.
- [x] Capture and attach a real screenshot for each issue; verify the visible request and response belong to the same run.
- [ ] Redact real JWTs, credentials, cookies, and local personal paths before attaching evidence. Do not alter response values relevant to the defect.
- [ ] Confirm the screenshot is not generated, composited, or reconstructed from this draft.
- [ ] Post each issue manually only after reviewing title, labels, repository, and evidence links.
