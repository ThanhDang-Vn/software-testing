# Coupon — Human-added Test Cases

- Endpoint focus: `POST /api/apply-coupon (plus supporting state endpoints where stated)`
- Origin: human-added after explicit candidate review.
- Execution/audit/bug/evidence fields remain unassigned.

## CPN-H-001 — Omitting user_id cannot bypass the authenticated user's exhausted limit

- **ID:** CPN-H-001
- **origin:** human-added
- **technique:** Usage-limit bypass chain
- **requirement/SEC reference:** FR-09 C4-C5, SEC-02
- **title:** Omitting user_id cannot bypass the authenticated user's exhausted limit
- **priority:** P0
- **preconditions:** User JWT valid; SAVE10 usage for JWT subject already at max
- **test data:** code=SAVE10,total_amount=500000; user_id omitted
- **request:** POST /api/apply-coupon
- **execution steps:** Prepare max usage; omit user_id; send; inspect usage count
- **expected status:** 400
- **expected headers/schema/body:** JSON {error:string}; no success/calculation fields
- **expected side effect:** Usage remains at max; no coupon/order mutation
- **cleanup:** Reset SQLite
- **actual result:** Not executed
- **PASS/FAIL:** 
- **AI audit verdict:** N/A — human-added
- **audit reasoning:** Why AI missed: Endpoint statefulness: the bypass exists only after constructing exhausted usage state.
- **bug ID:** 
- **evidence link:** 

## CPN-H-008 — Reject non-string coupon code types

- **ID:** CPN-H-008
- **origin:** human-added
- **technique:** Exact-type equivalence partitions
- **requirement/SEC reference:** FR-09 C1
- **title:** Reject non-string coupon code types
- **priority:** P0
- **preconditions:** Authenticated user; usage baseline known
- **test data:** Data iterations `code=null`, `code=123`, `code={"value":"SAVE10"}`, `code=["SAVE10"]`; valid amount/user identity
- **request:** POST /api/apply-coupon for each iteration
- **execution steps:** Send each body; inspect error schema; verify coupon and usage state after every iteration
- **expected status:** 400 for every iteration
- **expected headers/schema/body:** application/json; exact `{error:string}`; no success/calculation/internal fields
- **expected side effect:** No usage, coupon, order or user mutation
- **cleanup:** Reset only if state becomes dirty
- **actual result:** Not executed
- **PASS/FAIL:** 
- **AI audit verdict:** N/A — human-added
- **audit reasoning:** Why AI missed: model limitation — AI covered missing/empty/not-found lifecycle states but omitted JSON type partitions for `code`.
- **bug ID:** 
- **evidence link:** 

## CPN-H-009 — Reject non-number total_amount types without coercion

- **ID:** CPN-H-009
- **origin:** human-added
- **technique:** Exact-type equivalence partitions
- **requirement/SEC reference:** FR-09 C3
- **title:** Reject non-number total_amount types without coercion
- **priority:** P0
- **preconditions:** SAVE10 active/unexpired; authenticated user below usage limit
- **test data:** Data iterations `total_amount="300000"`, `true`, `{}`, `[]`; valid code/user identity
- **request:** POST /api/apply-coupon for each iteration
- **execution steps:** Send; verify strict rejection before comparison/calculation; inspect usage and coupon state
- **expected status:** 400 for every iteration
- **expected headers/schema/body:** application/json; exact `{error:string}`; no NaN/null/success fields
- **expected side effect:** No usage or financial state mutation and no implicit type coercion
- **cleanup:** Reset only if dirty
- **actual result:** Not executed
- **PASS/FAIL:** 
- **AI audit verdict:** N/A — human-added
- **audit reasoning:** Why AI missed: model limitation — AI covered missing/null/negative amount but not string, boolean and composite JSON types.
- **bug ID:** 
- **evidence link:** 

## CPN-H-010 — Reject duplicate identity and amount keys

- **ID:** CPN-H-010
- **origin:** human-added
- **technique:** Parser differential / security boundary
- **requirement/SEC reference:** FR-09 C3-C5, SEC-02
- **title:** Reject duplicate identity and amount keys
- **priority:** P0
- **preconditions:** Valid JWT; user usage state known; raw-body client available
- **test data:** Raw JSON repeats `user_id` with attacker/victim IDs and `total_amount` with below/above-minimum values
- **request:** POST /api/apply-coupon with duplicate keys
- **execution steps:** Send raw bytes; inspect response; verify both users' usage and coupon state; confirm no calculation was committed
- **expected status:** 400
- **expected headers/schema/body:** application/json; exact `{error:string}`; no selected identity, calculation or internal parser detail
- **expected side effect:** Neither identity usage changes; no coupon/order mutation
- **cleanup:** Reset only if dirty
- **actual result:** Not executed
- **PASS/FAIL:** 
- **AI audit verdict:** N/A — human-added
- **audit reasoning:** Why AI missed: spec fragmentation — JSON parsing policy was outside FR-09 even though duplicate keys can change identity and financial interpretation.
- **bug ID:** 
- **evidence link:** 

## CPN-H-002 — JWT user cannot apply against another user's user_id

- **ID:** CPN-H-002
- **origin:** human-added
- **technique:** IDOR / cross-user state
- **requirement/SEC reference:** FR-09 C4-C5, SEC-02
- **title:** JWT user cannot apply against another user's user_id
- **priority:** P0
- **preconditions:** JWT subject user A; body victim B; independent usage states known
- **test data:** code=SAVE10,total_amount=500000,user_id=<B> with JWT A
- **request:** POST /api/apply-coupon
- **execution steps:** Send mismatch; inspect both usage states; retry with matching A identity
- **expected status:** 403
- **expected headers/schema/body:** JSON {error:string}; no victim/coupon internals
- **expected side effect:** Neither user's usage changes; victim state is not read/consumed for authorization
- **cleanup:** Reset SQLite
- **actual result:** Not executed
- **PASS/FAIL:** 
- **AI audit verdict:** N/A — human-added
- **audit reasoning:** Why AI missed: Spec fragmentation: identity is represented in both JWT and request body.
- **bug ID:** 
- **evidence link:** 

## CPN-H-003 — Treat SQL-injection-shaped coupon code as a non-matching literal

- **ID:** CPN-H-003
- **origin:** human-added
- **technique:** SEC-05 parameterization
- **requirement/SEC reference:** FR-09 C1, SEC-05
- **title:** Treat SQL-injection-shaped coupon code as a non-matching literal
- **priority:** P0
- **preconditions:** Authenticated user; coupon/usage counts known
- **test data:** code="' OR '1'='1'--",total_amount=500000,user_id=2
- **request:** POST /api/apply-coupon
- **execution steps:** Send; inspect response; list coupons in controlled setup; verify seed state
- **expected status:** 404
- **expected headers/schema/body:** JSON {error:string}; no SQL/schema/path/stack
- **expected side effect:** No coupon matched; no usage or metadata mutation
- **cleanup:** None/reset
- **actual result:** Not executed
- **PASS/FAIL:** 
- **AI audit verdict:** N/A — human-added
- **audit reasoning:** Why AI missed: Model limitation: SQL injection was covered for Register/Product but omitted for Coupon.
- **bug ID:** 
- **evidence link:** 

## CPN-H-004 — One checkout business event cannot record coupon usage twice

- **ID:** CPN-H-004
- **origin:** human-added
- **technique:** Replay / idempotency chain
- **requirement/SEC reference:** FR-09 C5
- **title:** One checkout business event cannot record coupon usage twice
- **priority:** P0
- **preconditions:** Eligible apply and checkout completed once; stable checkout/business event ID available
- **test data:** Same coupon_id and same checkout event submitted twice
- **request:** POST /api/coupon-usage supporting endpoint twice, then POST /api/apply-coupon
- **execution steps:** Record first usage; replay same event; inspect responses/count; apply again
- **expected status:** First usage 200; replay 409
- **expected headers/schema/body:** JSON success then conflict; subsequent apply reflects exactly one usage
- **expected side effect:** Usage count increases exactly once
- **cleanup:** Reset SQLite
- **actual result:** Not executed
- **PASS/FAIL:** 
- **AI audit verdict:** N/A — human-added
- **audit reasoning:** Why AI missed: Prompt quality: the selected apply endpoint hid the separate state-commit endpoint.
- **bug ID:** 
- **evidence link:** 

## CPN-H-005 — Two concurrent commits cannot consume the final coupon use twice

- **ID:** CPN-H-005
- **origin:** human-added
- **technique:** Concurrency / usage race
- **requirement/SEC reference:** FR-09 C5
- **title:** Two concurrent commits cannot consume the final coupon use twice
- **priority:** P0
- **preconditions:** User has max-1 usage; two requests tied to distinct checkout attempts
- **test data:** Same coupon/user with one remaining permitted use
- **request:** Concurrent usage commit flow followed by apply verification
- **execution steps:** Release both commits; collect responses; count usage; apply again
- **expected status:** One 200 and one 409
- **expected headers/schema/body:** JSON success/conflict; no internal leakage
- **expected side effect:** Final usage equals max, never max+1
- **cleanup:** Reset SQLite
- **actual result:** Not executed
- **PASS/FAIL:** 
- **AI audit verdict:** N/A — human-added
- **audit reasoning:** Why AI missed: Endpoint statefulness: sequential decision tables do not expose a race at the usage boundary.
- **bug ID:** 
- **evidence link:** 

## CPN-H-006 — Coupon calculation at checkout uses backend cart total, not client total_amount

- **ID:** CPN-H-006
- **origin:** human-added
- **technique:** Financial tampering chain
- **requirement/SEC reference:** FR-08, FR-09
- **title:** Coupon calculation at checkout uses backend cart total, not client total_amount
- **priority:** P0
- **preconditions:** Authenticated user; server-side cart total known; eligible coupon
- **test data:** Client total differs materially from server-computed cart total
- **request:** POST /api/apply-coupon preview, then POST /api/checkout
- **execution steps:** Prepare cart; send tampered preview amount; checkout; inspect persisted order/discount basis
- **expected status:** 200 preview; checkout 200 only with server-derived total
- **expected headers/schema/body:** JSON schemas valid; committed amounts equal formulas over trusted cart total
- **expected side effect:** Order total/discount cannot be reduced by client-supplied amount
- **cleanup:** Reset cart/orders/usage
- **actual result:** Not executed
- **PASS/FAIL:** 
- **AI audit verdict:** N/A — human-added
- **audit reasoning:** Why AI missed: Spec fragmentation: FR-08 distrusts client total while apply-coupon accepts total_amount.
- **bug ID:** 
- **evidence link:** 

## CPN-H-007 — Coupon disabled after preview cannot be committed or reused

- **ID:** CPN-H-007
- **origin:** human-added
- **technique:** TOCTOU state transition
- **requirement/SEC reference:** FR-09 C1-C2-C5
- **title:** Coupon disabled after preview cannot be committed or reused
- **priority:** P0
- **preconditions:** Coupon active and eligible for preview; admin can disable/delete before commit
- **test data:** Apply valid coupon, then disable it before checkout/usage
- **request:** POST /api/apply-coupon before and after disable; checkout/usage flow
- **execution steps:** Preview success; disable coupon; retry/checkout; inspect usage/order
- **expected status:** First 200; later apply 404; checkout must not commit discount
- **expected headers/schema/body:** JSON success then error; no stale success schema
- **expected side effect:** No usage recorded and no discounted order committed after disable
- **cleanup:** Remove fixture/reset
- **actual result:** Not executed
- **PASS/FAIL:** 
- **AI audit verdict:** N/A — human-added
- **audit reasoning:** Why AI missed: Endpoint statefulness: eligibility can change between preview and state commit.
- **bug ID:** 
- **evidence link:** 
