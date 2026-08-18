# Verified bugs from Postman/Newman failures

## Scope and classification

Reviewed inputs:

- `reports/newman/postman-run-summary.md` and the three `*-run.cli.txt` files.
- Audited expectations in `testcases/`, `api-contracts/api-contract-matrix.md`, and `hw/eshop-sut/README.md`.
- SUT source was used only to guide independent requests; source inspection alone was not accepted as reproduction evidence.

Failure classification used:

| Classification | Decision rule | Disposition |
| --- | --- | --- |
| SUT defect | Valid setup and request contradict an unambiguous FR/SEC rule; independently reproducible after reset | Keep only if both verification trials reproduce |
| Test defect | Collection did not establish or assert the required chained/storage/UI oracle | Do not report as SUT bug |
| Environment defect | Required disabled/usage-limit/concurrency/expired-token state was not established | Inconclusive; do not report as SUT bug |
| Specification gap | Expected status/schema/rounding policy permits alternatives or is absent | Record as a gap, not a SUT bug, unless a separate unambiguous rule is violated |
| Expected behavior | Actual result is permitted by the audited contract | No bug |

The Newman audit classified 148 primary cases as 88 candidate SUT failures, 16 test defects, 13 environment/setup failures, and 31 passes. Those counts are triage inputs, not verified-bug counts. Examples retained outside the SUT bug list include incomplete storage/UI chains (test defect), missing expired-JWT or coupon-state fixtures (environment defect), alternative `400/409` or unknown-field policies (specification gap), and valid public reads/valid admin actions (expected behavior).

## Independent verification protocol

- Verification time: `2026-08-17T22:13:01Z` to `2026-08-17T22:13:06Z`.
- Base URL: `http://127.0.0.1:3000`.
- Before **each** trial, the exact listener on port 3000 was stopped and `server.js` was started again. Startup emitted `Database initialized and seeded (Phase 2).`, proving that `database.js` dropped, recreated, and seeded SQLite.
- Requests were sent outside Newman with Node's HTTP `fetch`; therefore collection variables/assertions could not cause the observed responses.
- Trial 1 and Trial 2 used different unique markers. DB queries verified the password value and unauthorized product side effect.
- The backend was stopped after each trial. No test process remains listening on port 3000.

## Verified SUT defects

| ID | Defect | Requirement oracle | Trial 1 | Trial 2 |
| --- | --- | --- | --- | --- |
| VB-01 | Registration stores password as plaintext | SEC-01 | Reproduced | Reproduced |
| VB-02 | Apply-coupon succeeds without Authorization | FR-09 C4, SEC-02 | Reproduced | Reproduced |
| VB-03 | Product creation succeeds and persists without admin Authorization | FR-12, SEC-02, SEC-03 | Reproduced | Reproduced |
| VB-04 | Coupon rejects `total_amount == min_order_amount` | FR-09 C3 (`>=`) | Reproduced | Reproduced |
| VB-05 | Percent coupon calculation uses the wrong formula | FR-09 percent formula | Reproduced | Reproduced |

---

## VB-01 — Registration stores password as plaintext

**Severity:** Critical  
**Expected:** Per SEC-01, the stored credential must be a salted, non-plaintext representation.  
**Actual:** Registration returns 200 and SQLite stores the exact submitted password string. Login compatibility does not make plaintext storage expected behavior.

**Student-supplied screenshot:** [registration request and HTTP 200 response](./screenshots/bug1.png). The screenshot establishes the API response; the controlled SQLite observations below establish plaintext persistence.

### Trial 1 raw evidence (after reset)

```http
POST /api/register HTTP/1.1
Host: 127.0.0.1:3000
Accept: application/json
Content-Type: application/json

{"name":"Verify Raw 1","email":"verify.raw.1@example.test","password":"VerifyRaw1!Secret","confirm_password":"VerifyRaw1!Secret"}
```

```http
HTTP/1.1 200 OK
access-control-allow-origin: *
content-length: 49
content-type: application/json; charset=utf-8
date: Mon, 17 Aug 2026 22:13:01 GMT
etag: W/"31-6Ci6+juThLYJE7fjTOwLWWX20Zs"
x-powered-by: Express

{"message":"User registered successfully","id":3}
```

Raw DB observation:

```json
[{"id":3,"email":"verify.raw.1@example.test","password":"VerifyRaw1!Secret"}]
```

### Trial 2 raw evidence (after a new reset)

```http
POST /api/register HTTP/1.1
Host: 127.0.0.1:3000
Accept: application/json
Content-Type: application/json

{"name":"Verify Raw 2","email":"verify.raw.2@example.test","password":"VerifyRaw2!Secret","confirm_password":"VerifyRaw2!Secret"}
```

```http
HTTP/1.1 200 OK
access-control-allow-origin: *
content-length: 49
content-type: application/json; charset=utf-8
date: Mon, 17 Aug 2026 22:13:06 GMT
etag: W/"31-6Ci6+juThLYJE7fjTOwLWWX20Zs"
x-powered-by: Express

{"message":"User registered successfully","id":3}
```

Raw DB observation:

```json
[{"id":3,"email":"verify.raw.2@example.test","password":"VerifyRaw2!Secret"}]
```

---

## VB-02 — Apply-coupon succeeds without Authorization

**Severity:** High  
**Expected:** FR-09 C4 and SEC-02 require an authenticated user/JWT; a request with no `Authorization` header must be rejected before coupon calculation.  
**Actual:** The unauthenticated request returns 200 and coupon data/calculation. This is not the separate status-code specification gap (`401` versus `403`): either permitted auth-failure status is contradicted by 200.

**Student-supplied screenshot:** [request without Authorization and HTTP 200 response](./screenshots/bug2.png).

### Trial 1 raw request/response (after reset)

```http
POST /api/apply-coupon HTTP/1.1
Host: 127.0.0.1:3000
Accept: application/json
Content-Type: application/json

{"code":"SAVE10","total_amount":500000,"user_id":2}
```

```http
HTTP/1.1 200 OK
access-control-allow-origin: *
content-length: 128
content-type: application/json; charset=utf-8
date: Mon, 17 Aug 2026 22:13:01 GMT
etag: W/"80-eEcQQFYR6VLLw3p0alA98mMsV0s"
x-powered-by: Express

{"success":true,"coupon_id":1,"discount_amount":-4500000,"final_amount":5000000,"message":"Áp dụng thành công! Giảm 10%"}
```

### Trial 2 raw request/response (after a new reset)

```http
POST /api/apply-coupon HTTP/1.1
Host: 127.0.0.1:3000
Accept: application/json
Content-Type: application/json

{"code":"SAVE10","total_amount":500000,"user_id":2}
```

```http
HTTP/1.1 200 OK
access-control-allow-origin: *
content-length: 128
content-type: application/json; charset=utf-8
date: Mon, 17 Aug 2026 22:13:06 GMT
etag: W/"80-eEcQQFYR6VLLw3p0alA98mMsV0s"
x-powered-by: Express

{"success":true,"coupon_id":1,"discount_amount":-4500000,"final_amount":5000000,"message":"Áp dụng thành công! Giảm 10%"}
```

---

## VB-03 — Product creation succeeds and persists without admin Authorization

**Severity:** Critical  
**Expected:** Product mutation is admin-only. Missing JWT must be rejected and no product may be created.  
**Actual:** A request with no `Authorization` header returns 200 and creates a row. The raw DB observation confirms a real side effect, rather than only an incorrect status.

**Student-supplied screenshot:** [request without Authorization and HTTP 200 creation response](./screenshots/bug3.png). The screenshot establishes the unauthorized response; the controlled database observations below establish persistence.

### Trial 1 raw evidence (after reset)

```http
POST /api/products HTTP/1.1
Host: 127.0.0.1:3000
Accept: application/json
Content-Type: application/json

{"name":"VERIFY-NOAUTH-1","price":123456,"description":"raw verification","imageUrl":"https://example.test/raw.png","category_id":1}
```

```http
HTTP/1.1 200 OK
access-control-allow-origin: *
content-length: 36
content-type: application/json; charset=utf-8
date: Mon, 17 Aug 2026 22:13:01 GMT
etag: W/"24-Or//WejXiXYD0aBuLhIMI/7KI9Y"
x-powered-by: Express

{"message":"Product created","id":6}
```

Raw DB observation:

```json
[{"id":6,"name":"VERIFY-NOAUTH-1","price":123456,"category_id":1}]
```

### Trial 2 raw evidence (after a new reset)

```http
POST /api/products HTTP/1.1
Host: 127.0.0.1:3000
Accept: application/json
Content-Type: application/json

{"name":"VERIFY-NOAUTH-2","price":123456,"description":"raw verification","imageUrl":"https://example.test/raw.png","category_id":1}
```

```http
HTTP/1.1 200 OK
access-control-allow-origin: *
content-length: 36
content-type: application/json; charset=utf-8
date: Mon, 17 Aug 2026 22:13:06 GMT
etag: W/"24-Or//WejXiXYD0aBuLhIMI/7KI9Y"
x-powered-by: Express

{"message":"Product created","id":6}
```

Raw DB observation:

```json
[{"id":6,"name":"VERIFY-NOAUTH-2","price":123456,"category_id":1}]
```

---

## VB-04 — Coupon rejects the inclusive minimum boundary

**Severity:** High  
**Expected:** FR-09 C3 explicitly says `total_amount >= min_order_amount`. Seeded `SAVE10` has minimum 300000, so equality must succeed.  
**Actual:** Equality returns 400 with an insufficient-value error in both clean trials. The deliberately non-secret bearer marker prevents this request from being confused with the missing-header hypothesis; VB-02 independently proves that this endpoint ignores auth.

**Student-supplied screenshot:** [equality-boundary request and HTTP 400 response](./screenshots/bug4.png).

### Trial 1 raw request/response (after reset)

```http
POST /api/apply-coupon HTTP/1.1
Host: 127.0.0.1:3000
Accept: application/json
Content-Type: application/json
Authorization: Bearer intentionally-present-but-unchecked

{"code":"SAVE10","total_amount":300000,"user_id":2}
```

```http
HTTP/1.1 400 Bad Request
access-control-allow-origin: *
content-length: 98
content-type: application/json; charset=utf-8
date: Mon, 17 Aug 2026 22:13:02 GMT
etag: W/"62-zdDGIVV8U4NM1Wd7cz+6q0pgXVo"
x-powered-by: Express

{"error":"Đơn hàng chưa đủ giá trị tối thiểu 300,000 ₫ để áp dụng mã này"}
```

### Trial 2 raw request/response (after a new reset)

```http
POST /api/apply-coupon HTTP/1.1
Host: 127.0.0.1:3000
Accept: application/json
Content-Type: application/json
Authorization: Bearer intentionally-present-but-unchecked

{"code":"SAVE10","total_amount":300000,"user_id":2}
```

```http
HTTP/1.1 400 Bad Request
access-control-allow-origin: *
content-length: 98
content-type: application/json; charset=utf-8
date: Mon, 17 Aug 2026 22:13:06 GMT
etag: W/"62-zdDGIVV8U4NM1Wd7cz+6q0pgXVo"
x-powered-by: Express

{"error":"Đơn hàng chưa đủ giá trị tối thiểu 300,000 ₫ để áp dụng mã này"}
```

---

## VB-05 — Percent coupon calculation uses the wrong formula

**Severity:** Critical  
**Expected:** FR-09 defines `discount_amount = total × discount_value / 100` and `final_amount = total - discount_amount`. For `SAVE10` and 500000, expected values are 50000 and 450000. No rounding ambiguity exists for this input.  
**Actual:** Both trials return `discount_amount=-4500000` and `final_amount=5000000`. The response is arithmetically and financially invalid.

**Student-supplied screenshot:** [500000 request and incorrect monetary response](./screenshots/bug5.png).

### Trial 1 raw request/response (after reset)

```http
POST /api/apply-coupon HTTP/1.1
Host: 127.0.0.1:3000
Accept: application/json
Content-Type: application/json
Authorization: Bearer intentionally-present-but-unchecked

{"code":"SAVE10","total_amount":500000,"user_id":2}
```

```http
HTTP/1.1 200 OK
access-control-allow-origin: *
content-length: 128
content-type: application/json; charset=utf-8
date: Mon, 17 Aug 2026 22:13:02 GMT
etag: W/"80-eEcQQFYR6VLLw3p0alA98mMsV0s"
x-powered-by: Express

{"success":true,"coupon_id":1,"discount_amount":-4500000,"final_amount":5000000,"message":"Áp dụng thành công! Giảm 10%"}
```

### Trial 2 raw request/response (after a new reset)

```http
POST /api/apply-coupon HTTP/1.1
Host: 127.0.0.1:3000
Accept: application/json
Content-Type: application/json
Authorization: Bearer intentionally-present-but-unchecked

{"code":"SAVE10","total_amount":500000,"user_id":2}
```

```http
HTTP/1.1 200 OK
access-control-allow-origin: *
content-length: 128
content-type: application/json; charset=utf-8
date: Mon, 17 Aug 2026 22:13:06 GMT
etag: W/"80-eEcQQFYR6VLLw3p0alA98mMsV0s"
x-powered-by: Express

{"success":true,"coupon_id":1,"discount_amount":-4500000,"final_amount":5000000,"message":"Áp dụng thành công! Giảm 10%"}
```

## Excluded hypotheses and non-bugs

- Fractional percent rounding remains a **specification gap** because no currency precision/rounding rule is stated. VB-05 uses 500000, whose correct 10% result is exact, so that gap cannot explain the failure.
- `401` versus `403`, `400` versus `409`, and strict-versus-ignore behavior for unknown fields remain **specification gaps** where the contract explicitly permits alternatives.
- Disabled coupon, usage-limit, concurrency, and expired-token failures without a proven fixture are **environment/setup defects**, not verified SUT defects.
- Missing chained DB/UI/storage checks in Newman are **test defects**. VB-01 and VB-03 were retained only after direct DB verification supplied the missing oracle.
- Public product reads and correctly authorized admin actions are **expected behavior** and are not bugs.

## Reproduction result

All five retained bugs reproduced in **2/2 independent trials**, with a full database reset and a fresh backend process before each trial. No other Newman candidate is promoted to a verified SUT bug in this report.
