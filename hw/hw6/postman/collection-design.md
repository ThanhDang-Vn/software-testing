# 23127334_HW06_API_Testing — Postman Collection Design

## 1. Scope and design constraints

Collection name: `23127334_HW06_API_Testing`.

Selected APIs:

- `POST /api/register`
- `POST /api/apply-coupon`
- `POST /api/products`

This document is the design blueprint used to generate the Postman artifacts. The collection JSON and sanitized example environment now exist under `hw/hw6/postman/`. Expected results remain specification-based; observed backend defects are not copied into assertions as the expected contract.

Generated artifacts:

- `23127334_HW06_API_Testing.postman_collection.json` — public collection containing 148 uniquely named primary `TC_ID` requests.
- `23127334_HW06_Local.example.postman_environment.json` — public sanitized environment with blank credentials and tokens.
- `23127334_HW06_Local.postman_environment.json` — local environment; ignored by Git because it contains local seed credentials/current runtime values.
- `../agent-generator/generate_postman.py` — reproducible generator that reads the final audited workbook.

Setup, supporting verification and teardown requests are not counted as primary test cases. Each primary request name begins with exactly one approved test ID so Newman output can be traced back to the workbook.

## 2. Collection tree

```text
23127334_HW06_API_Testing
├── 00 Setup
│   ├── SETUP-01 Health check
│   ├── SETUP-02 Login seeded user
│   ├── SETUP-03 Login seeded admin
│   ├── SETUP-04 Resolve and validate category
│   └── SETUP-05 Initialize run-scoped data and cleanup stacks
├── API1 Register
│   ├── Domain
│   ├── State
│   ├── Security
│   └── Schema
├── API2 Coupon
│   ├── Domain
│   ├── State
│   ├── Security
│   └── Schema
├── API3 Product
│   ├── Domain
│   ├── State
│   ├── Security
│   └── Schema
└── 99 Verification-Teardown
    ├── VERIFY-01 Verify registered user by captured ID/email
    ├── VERIFY-02 Verify coupon and usage invariants
    ├── VERIFY-03 Verify product presence or absence
    ├── CLEAN-01 Delete captured products in reverse order
    ├── CLEAN-02 Delete captured users except seed identities
    ├── CLEAN-03 Verify cleanup
    └── CLEAN-04 Clear run secrets and temporary variables
```

The four API subfolders classify the primary purpose of a case:

| Subfolder | Purpose |
| --- | --- |
| `Domain` | Valid/invalid equivalence partitions, boundaries, calculations and field constraints |
| `State` | Absent/created/duplicate, usage-limit transitions, persistence and lifecycle chains |
| `Security` | Authentication, authorization, IDOR, role escalation, injection, XSS and mass assignment |
| `Schema` | Malformed JSON, content type, exact field/type assertions and unexpected fields |

If a case touches several concerns, it is stored once under its primary technique and references the other requirement/SEC IDs in its tests. This prevents duplicate execution and duplicate counting.

## 3. Environment design

Environment name recommendation: `23127334_HW06_Local`.

| Variable | Initial value | Current value/source | Sensitive | Lifecycle |
| --- | --- | --- | --- | --- |
| `baseUrl` | `http://localhost:3000` | Selected environment | No | Stable per environment |
| `studentId` | `23127334` | Selected environment | No | Stable |
| `userEmail` | `test@eshop.com` | Environment/secret input | No | Seed identity |
| `userPassword` | empty in exported environment | Local current value/CI secret | Yes | Never commit a real secret |
| `adminEmail` | `admin@eshop.com` | Environment/secret input | No | Seed identity |
| `adminPassword` | empty in exported environment | Local current value/CI secret | Yes | Never commit a real secret |
| `userToken` | empty | `POST /api/login` user response | Yes | Clear at teardown |
| `adminToken` | empty | `POST /api/login` admin response | Yes | Clear at teardown |
| `userId` | empty | Authenticated user response, expected seed `2` after reset | No | Validate, do not blindly assume |
| `categoryId` | empty | `GET /api/categories`, expected seed `1` after reset | No | Validate before Product tests |
| `createdProductId` | empty | Successful Product response | No | Push to cleanup stack and clear |
| `createdEmail` | empty | Run-scoped Register pre-request script | No | Clear after deleting user |

Required collection variables that support, but do not replace, the requested environment variables:

| Collection variable | Purpose |
| --- | --- |
| `runId` | One UUID/timestamp identity shared by the run |
| `createdUserId` | Most recently created registration ID |
| `createdUserIds` | JSON array cleanup stack for every created user |
| `createdProductIds` | JSON array cleanup stack for every created or unexpectedly created product |
| `productRunSuffix` | Unique suffix used to verify product presence/absence |
| `activeTestId` | Test ID currently being executed and reported |
| `environmentDirty` | Boolean flag set when mutation or cleanup outcome is uncertain |

Variable precedence must be intentional: iteration data supplies test input; local variables hold request-specific derived values; collection variables hold run state; environment variables hold endpoint, credentials, tokens and the specifically requested captured values. A request must not silently let an iteration `user_id` override the authenticated `userId` except in an explicit tampering test.

## 4. Common collection scripts

### 4.1 Collection-level pre-request

1. Require `baseUrl` and enforce `studentId=23127334`.
2. Create `runId` once using timestamp plus `{{$randomUUID}}`.
3. Initialize `createdUserIds=[]`, `createdProductIds=[]` and `environmentDirty=false` once.
4. Set `activeTestId` from the request-name prefix.
5. Do not automatically attach authorization. Each request chooses `guest`, `user` or `admin` explicitly so missing-token tests stay valid.

The collection-level pre-request script must start with the following block so every request has exactly one current student header and produces auditable console evidence:

```javascript
const EXPECTED_STUDENT_ID = '23127334';

// Keep the required value in the selected environment, not only in a local scope.
pm.environment.set('studentId', EXPECTED_STUDENT_ID);
const studentId = String(pm.environment.get('studentId') || '').trim();

pm.request.headers.upsert({
  key: 'X-Student-Id',
  value: studentId
});

const attachedHeader = pm.request.headers.get('X-Student-Id');
const timestamp = new Date().toISOString();
const resolvedUrl = pm.variables.replaceIn(pm.request.url.toString());

pm.test('Pre-request: X-Student-Id is attached and correct', function () {
  pm.expect(studentId, 'environment studentId').to.eql(EXPECTED_STUDENT_ID);
  pm.expect(attachedHeader, 'outgoing X-Student-Id header').to.eql(EXPECTED_STUDENT_ID);
});

console.log('[HW06 REQUEST EVIDENCE]', {
  timestamp,
  method: pm.request.method,
  url: resolvedUrl,
  'X-Student-Id': attachedHeader
});
```

`upsert` prevents duplicate `X-Student-Id` entries and overrides any stale request-level value. The assertion executes before the network send; if the environment/header value is wrong, it is reported as a pre-request test failure. The log records the effective header read back from `pm.request.headers`, not merely the intended constant.

### 4.2 Common post-response rules

- Record HTTP status, `Content-Type` and raw response before assertions.
- Parse JSON only when the response declares JSON and parsing succeeds.
- On successful Register, set `createdUserId`, `createdEmail` and append the returned ID to `createdUserIds`.
- On any Product response that exposes a created ID, set `createdProductId` and append it to `createdProductIds`, including unexpected creation in a negative test.
- Never capture token or ID from an error-shaped response without validating its schema first.
- A failed primary assertion must not stop cleanup. It sets `environmentDirty=true` and continues to `99 Verification-Teardown`.

## 5. Folder-level request design

### 5.1 `00 Setup`

| Request | Input | Output/assertion |
| --- | --- | --- |
| `SETUP-01 Health check` | `GET {{baseUrl}}/api/products` | Require reachable server and status `200`; setup failure is not a Product test failure |
| `SETUP-02 Login seeded user` | `userEmail`, `userPassword` | Validate login schema; save `userToken` and authenticated ID as `userId` |
| `SETUP-03 Login seeded admin` | `adminEmail`, `adminPassword` | Validate login schema and admin role; save `adminToken` |
| `SETUP-04 Resolve and validate category` | Admin/user token as supported | `GET /api/categories`; choose a known existing category and save `categoryId` |
| `SETUP-05 Initialize run data` | `studentId`, `runId` | Initialize unique names/emails and cleanup stacks; assert `userId` and `categoryId` are positive integers |

If setup IDs differ from the reset baseline, use the verified response values consistently. Stop the run if identity/role cannot be proven; do not substitute an arbitrary database row.

### 5.2 `API1 Register`

- `Domain`: name/email/password/confirmation EP and BVA cases.
- `State`: unique creation, duplicate attempt, concurrent/replay and identity lifecycle cases.
- `Security`: SEC-01 password storage/leakage, SEC-05 SQL-shaped values, XSS persistence and mass assignment.
- `Schema`: exact success/error objects, missing/null/wrong types, malformed JSON, duplicate keys and unsupported media type.

Register requests are public and must not depend on either token. A success captures both the response ID and the exact generated email. Verification may log in as the created user and query the admin users endpoint, but those are supporting requests rather than additional Register cases.

### 5.3 `API2 Coupon`

- `Domain`: FR-09 decision table, minimum boundaries, percent/fixed calculations and field types.
- `State`: active/expired/disabled, max-1 to max usage, per-user/per-coupon isolation and preview-versus-commit behavior.
- `Security`: missing/malformed/expired JWT, JWT/body identity mismatch, IDOR and unexpected control fields.
- `Schema`: exact success/error fields, malformed JSON, duplicate keys, top-level type and absence of internal data.

The token subject is the trusted identity. Normal requests derive `user_id` from `userId`; only explicit tampering cases send another/missing/invalid value. Apply-coupon is treated as validation/preview unless the specification explicitly couples it to a successful checkout. Usage setup and usage verification are dependencies, not extra apply-coupon cases.

### 5.4 `API3 Product`

- `Domain`: name length boundaries, positive price partitions, category reference and optional fields.
- `State`: absent to created to retrievable, plus cleanup verification.
- `Security`: guest/user/admin authorization, malformed/expired JWT, role escalation, SQL/XSS and mass assignment.
- `Schema`: exact response, malformed body, content type, duplicate keys and wrong JSON types.

Every Product case creates a unique marker even when creation is expected to fail. Guest requests explicitly use `No Auth`; user cases use `Bearer {{userToken}}`; admin cases use `Bearer {{adminToken}}`. Verification searches by captured ID and unique marker so an authorization defect that unexpectedly inserts a product can still be detected and cleaned.

## 6. Data-driven mapping

### 6.1 Execution convention

The three JSON files are baseline fixture sources, not a complete 120-case execution manifest. Each row is selected by its immutable `data_id`. The corresponding Postman request declares a `requiredDataId`; when the current iteration does not match, the runner skips that request without recording a test result. Newman runs each API file separately so fields with the same name cannot leak between APIs.

Recommended commands for the generated collection:

```text
newman run postman/23127334_HW06_API_Testing.postman_collection.json -e postman/23127334_HW06_Local.postman_environment.json -d postman/data/register-data.json --folder "API1 Register"
newman run postman/23127334_HW06_API_Testing.postman_collection.json -e postman/23127334_HW06_Local.postman_environment.json -d postman/data/coupon-data.json --folder "API2 Coupon"
newman run postman/23127334_HW06_API_Testing.postman_collection.json -e postman/23127334_HW06_Local.postman_environment.json -d postman/data/product-data.json --folder "API3 Product"
```

One fixture may support several IDs only when each request applies the documented field override and retains its own oracle. It must not generate several PASS results from one identical request/response.

### 6.2 Registration mapping

| `data_id` | Direct test IDs | Derived/override use | Notes |
| --- | --- | --- | --- |
| `REG-DATA-VALID-UNIQUE` | `REG-AI-001` | Baseline for `REG-AI-002`, `003`, `009`, `010`, `025`, `031`, `040` and selected `REG-H-*`; only the field named by that case is overridden | Pre-request creates `createdEmail`; success ID enters user cleanup stack |
| `REG-DATA-DUPLICATE-SEED` | `REG-AI-019` | Duplicate-related human verification may reuse the seed identity without creating it | Never delete seeded user ID `2` |
| `REG-DATA-REPLAY-CONTROL` | `REG-AI-019` state-chain variant | Supports first-create/second-duplicate workflow and concurrency preparation | Both actions reuse one generated email; only the first returned ID is cleaned |

Cases for omitted fields, null/wrong types, password boundaries, malformed raw JSON, content type, duplicate keys and mass assignment require request-specific body construction. They reference the valid baseline for unaffected fields but cannot be represented by the current JSON row alone.

### 6.3 Coupon mapping

| `data_id` | Direct test IDs | Derived/override use | Notes |
| --- | --- | --- | --- |
| `CPN-DATA-SAVE10-EQUAL-MIN` | `CPN-AI-010` | Baseline for `CPN-AI-001`, `006`, `007`, `025`–`032`, `039` and relevant `CPN-H-*` after explicit auth/identity/state override | Expected inclusive boundary comes from FR-09, not current implementation |
| `CPN-DATA-SAVE10-ABOVE-MIN` | `CPN-AI-011`, `CPN-AI-016` | Baseline for valid percent calculation and type/security mutations | Preserve decimal expectation; do not invent rounding |
| `CPN-DATA-BIGBUY-FIXED` | `CPN-AI-017` | Amount overrides support `CPN-AI-012`, `013`, `014`; state/auth overrides support related cases | Fixed discount remains independent of amount once eligible |

Disabled, expired, not-found, usage-limit and per-user isolation cases additionally require controlled setup state. The data row supplies the request baseline; a setup request or reset establishes the coupon/usage state before the primary test. Missing/malformed fields and raw duplicate-key cases use request-specific bodies.

### 6.4 Product mapping

| `data_id` | Direct test IDs | Derived/override use | Notes |
| --- | --- | --- | --- |
| `PRD-DATA-GUEST-VALID` | `PRD-AI-002` | Baseline for guest negative-auth verification | No Authorization header; capture and clean any unexpected product ID |
| `PRD-DATA-USER-VALID` | `PRD-AI-003` | Baseline for user-role and role-escalation cases | Use only `userToken`; body role fields never replace token role |
| `PRD-DATA-ADMIN-VALID` | `PRD-AI-001`, `PRD-AI-025` | Baseline for name BVA, price EP/BVA, category, optional fields, persistence and selected `PRD-H-*` through explicit overrides | Successful ID is verified, then added to cleanup stack |

Malformed JWT, expired JWT, raw malformed JSON, duplicate keys, wrong content type and top-level array cases require request-specific auth/body construction. Category tests replace the data-file literal with the verified `categoryId`, except explicit nonexistent/invalid-category cases.

## 7. Request dependencies

```text
Backend reset/seed
  -> health check
  -> user login -> userToken + userId
  -> admin login -> adminToken
  -> category lookup -> categoryId
  -> primary Register/Coupon/Product requests
  -> read-only and state verification
  -> reverse-order teardown
  -> final absence/invariant verification
```

Dependency rules:

1. Register happy-path depends only on server health and a unique email; it remains public.
2. Register storage/role verification depends on admin login, but admin login is a supporting dependency and not part of the primary action.
3. Coupon cases depend on `userToken`, `userId`, known coupon state and a known usage baseline. Stateful usage cases must run serially inside their own folder or start from a reset/isolated identity.
4. Product cases depend on `categoryId`; role partitions additionally depend on the matching token. Guest must not inherit collection authorization.
5. Verification requests consume captured IDs/markers. They must skip safely when no ID was created and still perform absence checks for negative cases.
6. No primary test depends on a previous unrelated primary test. Deliberate chains declare their first/second action under one test ID.

## 8. Verification and cleanup strategy

### 8.1 Verification

- Register success: exact `{message, id}` schema, then verify one account with `createdEmail`; failures verify no matching account.
- Coupon success: exact `{success, coupon_id, discount_amount, final_amount, message}` schema and formula; failures expose only the expected error schema. Compare usage before/after when state is relevant.
- Product success: exact `{message, id}` schema, retrieve `createdProductId` and compare persisted fields; rejected creation verifies both ID absence and unique-name absence.
- Schema assertions also reject password/token/internal SQL fields, unexpected server-owned fields and incorrect `Content-Type`.

### 8.2 Teardown order

1. Always enter teardown, even after a failed assertion.
2. Delete `createdProductIds` in reverse creation order using `adminToken`.
3. Delete `createdUserIds` in reverse order, refusing to delete known seed IDs.
4. Verify removed IDs and unique markers are absent.
5. Coupon usage/order state that lacks a safe targeted delete marks `environmentDirty=true` and requires a controlled SQLite reset before the next dependent run.
6. Clear `userToken`, `adminToken`, `createdProductId`, `createdEmail`, IDs, suffixes, cleanup stacks and `runId` from current values.

Cleanup failure is reported separately from the primary test result. If unexpected implementation behavior creates state during a negative test, the state is evidence first, then is cleaned by captured ID. Broad deletion by last row, shared name or wildcard is forbidden.

## 9. Run isolation and reporting

- Run against a dedicated local SQLite instance; do not execute stateful folders concurrently.
- Reset once before a clean suite and again whenever `environmentDirty=true` or coupon usage isolation cannot be restored safely.
- Use `activeTestId`, data-file name and `data_id` in Newman reporter metadata/evidence filenames.
- Setup/teardown failures use `SETUP-*`, `VERIFY-*` or `CLEAN-*` labels and never inflate API test counts.
- Exported environment files contain blank passwords/tokens; Newman receives credentials through local current values or CI secrets.
- A test result is attributable only when request name, `activeTestId`, iteration `data_id`, expected contract and response evidence agree.
