# Coupon — AI-generated Test Cases

## Scope

- Endpoint: `POST /api/apply-coupon`
- IDs: exactly `CPN-AI-001` through `CPN-AI-040`
- Origin: AI-generated only
- Oracle: approved Phase 1 artifacts only; current implementation defects do not redefine expected results.
- Actual, PASS/FAIL, audit verdict, audit reasoning, bug ID and evidence are intentionally unassigned.

## FR-09 decision table

`T` means the condition is satisfied; `F` means it is not satisfied. Rules R1–R8 map directly to `CPN-AI-001..008`.

| Rule | C1 exists+active | C2 unexpired | C3 total >= min | C4 valid JWT | C5 usage below max | Expected |
| --- | --- | --- | --- | --- | --- | --- |
| R1 | T | T | T | T | T | Apply succeeds |
| R2 | F (not found) | T | T | T | T | Reject not found/inactive |
| R3 | F (disabled) | T | T | T | T | Reject not found/inactive |
| R4 | T | F | T | T | T | Reject expired |
| R5 | T | T | F | T | T | Reject below minimum |
| R6 | T | T | T | F | T | Reject unauthenticated |
| R7 | T | T | T | T | F | Reject usage limit |
| R8 | F | F | F | F | F | Reject at authentication boundary without leaking coupon state |

## Test cases

### CPN-AI-001 — Apply active eligible coupon when all five conditions are true

- **ID:** CPN-AI-001
- **origin:** AI-generated
- **technique:** Decision table R1 + exact schema
- **requirement/SEC reference:** FR-09 C1-C5
- **title:** Apply active eligible coupon when all five conditions are true
- **priority:** P0
- **preconditions:** Reset SQLite; SAVE10 active/unexpired; user 2 authenticated; usage 0
- **test data:** code=SAVE10,total_amount=500000,user_id=2; valid user JWT
- **request:** POST /api/apply-coupon JSON
- **execution steps:** Login user; send request; assert formula/schema; verify usage unchanged
- **expected status:** 200
- **expected headers/schema/body:** JSON exact keys success=true,coupon_id:int,discount_amount:number,final_amount:number,message:string; no extras
- **expected side effect:** No coupon/user/order mutation and no usage row from apply alone
- **cleanup:** Reset SQLite
- **actual result:** Not executed
- **PASS/FAIL:** 
- **AI audit verdict:** 
- **audit reasoning:** 
- **bug ID:** 
- **evidence link:** 

### CPN-AI-002 — Reject coupon code that does not exist

- **ID:** CPN-AI-002
- **origin:** AI-generated
- **technique:** Decision table R2
- **requirement/SEC reference:** FR-09 C1
- **title:** Reject coupon code that does not exist
- **priority:** P0
- **preconditions:** Authenticated user; code confirmed absent
- **test data:** code=HW06_NOT_FOUND,total_amount=500000,user_id=2
- **request:** POST /api/apply-coupon with user JWT
- **execution steps:** Send; inspect error schema; verify usage/coupon state unchanged
- **expected status:** 404
- **expected headers/schema/body:** application/json; exact error:string; no success fields/internal detail
- **expected side effect:** No usage or coupon mutation
- **cleanup:** None/reset if dirty
- **actual result:** Not executed
- **PASS/FAIL:** 
- **AI audit verdict:** 
- **audit reasoning:** 
- **bug ID:** 
- **evidence link:** 

### CPN-AI-003 — Reject existing but disabled coupon

- **ID:** CPN-AI-003
- **origin:** AI-generated
- **technique:** Decision table R3
- **requirement/SEC reference:** FR-09 C1
- **title:** Reject existing but disabled coupon
- **priority:** P0
- **preconditions:** Controlled fixture coupon exists with is_active=0; user authenticated
- **test data:** disabled code,total above minimum,user_id=2
- **request:** POST /api/apply-coupon with user JWT
- **execution steps:** Prepare disabled fixture; send; inspect response; verify state
- **expected status:** 404
- **expected headers/schema/body:** JSON error only; no discount fields
- **expected side effect:** No usage; disabled coupon remains disabled
- **cleanup:** Remove fixture/reset SQLite
- **actual result:** Not executed
- **PASS/FAIL:** 
- **AI audit verdict:** 
- **audit reasoning:** 
- **bug ID:** 
- **evidence link:** 

### CPN-AI-004 — Reject expired active coupon

- **ID:** CPN-AI-004
- **origin:** AI-generated
- **technique:** Decision table R4
- **requirement/SEC reference:** FR-09 C2
- **title:** Reject expired active coupon
- **priority:** P0
- **preconditions:** EXPIRED seed active but expired; user authenticated; usage below max
- **test data:** code=EXPIRED,total_amount=200000,user_id=2
- **request:** POST /api/apply-coupon with user JWT
- **execution steps:** Send; assert expired rejection and no usage
- **expected status:** 400
- **expected headers/schema/body:** JSON error only; no success/calculation fields
- **expected side effect:** No usage or coupon mutation
- **cleanup:** Reset SQLite
- **actual result:** Not executed
- **PASS/FAIL:** 
- **AI audit verdict:** 
- **audit reasoning:** 
- **bug ID:** 
- **evidence link:** 

### CPN-AI-005 — Reject eligible coupon when amount is clearly below minimum

- **ID:** CPN-AI-005
- **origin:** AI-generated
- **technique:** Decision table R5
- **requirement/SEC reference:** FR-09 C3
- **title:** Reject eligible coupon when amount is clearly below minimum
- **priority:** P0
- **preconditions:** SAVE10 active/unexpired; user authenticated; usage 0
- **test data:** code=SAVE10,total_amount=100000,user_id=2
- **request:** POST /api/apply-coupon with user JWT
- **execution steps:** Send; assert insufficient-order error; verify no usage
- **expected status:** 400
- **expected headers/schema/body:** JSON error only
- **expected side effect:** No usage or coupon mutation
- **cleanup:** Reset SQLite
- **actual result:** Not executed
- **PASS/FAIL:** 
- **AI audit verdict:** 
- **audit reasoning:** 
- **bug ID:** 
- **evidence link:** 

### CPN-AI-006 — Reject otherwise eligible coupon when JWT is missing

- **ID:** CPN-AI-006
- **origin:** AI-generated
- **technique:** Decision table R6
- **requirement/SEC reference:** FR-09 C4, SEC-02
- **title:** Reject otherwise eligible coupon when JWT is missing
- **priority:** P0
- **preconditions:** SAVE10 active/unexpired; usage 0
- **test data:** code=SAVE10,total_amount=500000,user_id=2; no Authorization
- **request:** POST /api/apply-coupon without JWT
- **execution steps:** Send; assert auth rejection occurs before calculation; verify no usage
- **expected status:** 401
- **expected headers/schema/body:** JSON error only; no coupon/calculation data
- **expected side effect:** No usage or coupon mutation
- **cleanup:** Reset SQLite
- **actual result:** Not executed
- **PASS/FAIL:** 
- **AI audit verdict:** 
- **audit reasoning:** 
- **bug ID:** 
- **evidence link:** 

### CPN-AI-007 — Reject coupon when authenticated user reached usage limit

- **ID:** CPN-AI-007
- **origin:** AI-generated
- **technique:** Decision table R7
- **requirement/SEC reference:** FR-09 C5
- **title:** Reject coupon when authenticated user reached usage limit
- **priority:** P0
- **preconditions:** SAVE10 usage count for user 2 equals max 1; JWT valid
- **test data:** code=SAVE10,total_amount=500000,user_id=2
- **request:** POST /api/apply-coupon with same user JWT
- **execution steps:** Send; assert limit error; verify count unchanged
- **expected status:** 400 or 409 (spec gap)
- **expected headers/schema/body:** JSON error only; no success fields
- **expected side effect:** Usage remains at max; no extra usage/order mutation
- **cleanup:** Reset SQLite
- **actual result:** Not executed
- **PASS/FAIL:** 
- **AI audit verdict:** 
- **audit reasoning:** 
- **bug ID:** 
- **evidence link:** 

### CPN-AI-008 — Reject all-false combination at authentication boundary without leaking coupon state

- **ID:** CPN-AI-008
- **origin:** AI-generated
- **technique:** Decision table R8 / precedence
- **requirement/SEC reference:** FR-09 C1-C5, SEC-02
- **title:** Reject all-false combination at authentication boundary without leaking coupon state
- **priority:** P0
- **preconditions:** No valid JWT; nonexistent code; below-min amount; tampered user_id
- **test data:** code=NOPE,total_amount=0,user_id=999999; no JWT
- **request:** POST /api/apply-coupon
- **execution steps:** Send; verify auth-first rejection and no code existence disclosure
- **expected status:** 401
- **expected headers/schema/body:** JSON auth error only; no indication whether coupon exists
- **expected side effect:** No usage/coupon/user mutation
- **cleanup:** None
- **actual result:** Not executed
- **PASS/FAIL:** 
- **AI audit verdict:** 
- **audit reasoning:** 
- **bug ID:** 
- **evidence link:** 

### CPN-AI-009 — Reject SAVE10 at min_order_amount minus one

- **ID:** CPN-AI-009
- **origin:** AI-generated
- **technique:** BVA lower boundary percent
- **requirement/SEC reference:** FR-09 C3
- **title:** Reject SAVE10 at min_order_amount minus one
- **priority:** P0
- **preconditions:** SAVE10 minimum=300000; user authenticated; usage 0
- **test data:** total_amount=299999
- **request:** POST apply SAVE10 for user 2
- **execution steps:** Send; assert boundary rejection; verify no usage
- **expected status:** 400
- **expected headers/schema/body:** JSON error only
- **expected side effect:** No usage mutation
- **cleanup:** Reset SQLite
- **actual result:** Not executed
- **PASS/FAIL:** 
- **AI audit verdict:** 
- **audit reasoning:** 
- **bug ID:** 
- **evidence link:** 

### CPN-AI-010 — Accept SAVE10 at exactly min_order_amount

- **ID:** CPN-AI-010
- **origin:** AI-generated
- **technique:** BVA inclusive boundary percent
- **requirement/SEC reference:** FR-09 C3
- **title:** Accept SAVE10 at exactly min_order_amount
- **priority:** P0
- **preconditions:** SAVE10 minimum=300000; user authenticated; usage 0
- **test data:** total_amount=300000
- **request:** POST apply SAVE10 for user 2
- **execution steps:** Send; assert success and exact calculation
- **expected status:** 200
- **expected headers/schema/body:** JSON exact success schema; discount_amount=30000; final_amount=270000
- **expected side effect:** Apply only calculates; usage remains 0
- **cleanup:** Reset SQLite
- **actual result:** Not executed
- **PASS/FAIL:** 
- **AI audit verdict:** 
- **audit reasoning:** 
- **bug ID:** 
- **evidence link:** 

### CPN-AI-011 — Accept SAVE10 at min_order_amount plus one

- **ID:** CPN-AI-011
- **origin:** AI-generated
- **technique:** BVA upper neighbor percent
- **requirement/SEC reference:** FR-09 C3
- **title:** Accept SAVE10 at min_order_amount plus one
- **priority:** P0
- **preconditions:** SAVE10 minimum=300000; user authenticated; usage 0
- **test data:** total_amount=300001
- **request:** POST apply SAVE10 for user 2
- **execution steps:** Send; assert success/formula without invented rounding
- **expected status:** 200
- **expected headers/schema/body:** JSON success; discount_amount=30000.1; final_amount=270000.9
- **expected side effect:** No usage mutation
- **cleanup:** Reset SQLite
- **actual result:** Not executed
- **PASS/FAIL:** 
- **AI audit verdict:** 
- **audit reasoning:** 
- **bug ID:** 
- **evidence link:** 

### CPN-AI-012 — Reject BIGBUY at minimum minus one

- **ID:** CPN-AI-012
- **origin:** AI-generated
- **technique:** BVA lower boundary fixed
- **requirement/SEC reference:** FR-09 C3
- **title:** Reject BIGBUY at minimum minus one
- **priority:** P1
- **preconditions:** BIGBUY minimum=500000; user authenticated; usage 0
- **test data:** total_amount=499999
- **request:** POST apply BIGBUY
- **execution steps:** Send; assert rejection; verify no usage
- **expected status:** 400
- **expected headers/schema/body:** JSON error only
- **expected side effect:** No usage mutation
- **cleanup:** Reset SQLite
- **actual result:** Not executed
- **PASS/FAIL:** 
- **AI audit verdict:** 
- **audit reasoning:** 
- **bug ID:** 
- **evidence link:** 

### CPN-AI-013 — Accept BIGBUY at exactly its minimum

- **ID:** CPN-AI-013
- **origin:** AI-generated
- **technique:** BVA inclusive boundary fixed
- **requirement/SEC reference:** FR-09 C3
- **title:** Accept BIGBUY at exactly its minimum
- **priority:** P0
- **preconditions:** BIGBUY minimum=500000; user authenticated; usage 0
- **test data:** total_amount=500000
- **request:** POST apply BIGBUY
- **execution steps:** Send; assert fixed calculation/schema
- **expected status:** 200
- **expected headers/schema/body:** JSON success; discount_amount=50000; final_amount=450000
- **expected side effect:** No usage mutation
- **cleanup:** Reset SQLite
- **actual result:** Not executed
- **PASS/FAIL:** 
- **AI audit verdict:** 
- **audit reasoning:** 
- **bug ID:** 
- **evidence link:** 

### CPN-AI-014 — Accept BIGBUY at minimum plus one

- **ID:** CPN-AI-014
- **origin:** AI-generated
- **technique:** BVA upper neighbor fixed
- **requirement/SEC reference:** FR-09 C3
- **title:** Accept BIGBUY at minimum plus one
- **priority:** P1
- **preconditions:** BIGBUY minimum=500000; user authenticated; usage 0
- **test data:** total_amount=500001
- **request:** POST apply BIGBUY
- **execution steps:** Send; assert fixed calculation
- **expected status:** 200
- **expected headers/schema/body:** JSON success; discount_amount=50000; final_amount=450001
- **expected side effect:** No usage mutation
- **cleanup:** Reset SQLite
- **actual result:** Not executed
- **PASS/FAIL:** 
- **AI audit verdict:** 
- **audit reasoning:** 
- **bug ID:** 
- **evidence link:** 

### CPN-AI-015 — Calculate ten-percent discount on an evenly divisible amount

- **ID:** CPN-AI-015
- **origin:** AI-generated
- **technique:** Calculation EP percent
- **requirement/SEC reference:** FR-09 formula
- **title:** Calculate ten-percent discount on an evenly divisible amount
- **priority:** P0
- **preconditions:** SAVE10 eligible; authenticated user; usage 0
- **test data:** total_amount=800000
- **request:** POST apply SAVE10
- **execution steps:** Send; recompute independently; compare fields
- **expected status:** 200
- **expected headers/schema/body:** JSON success; discount_amount=80000; final_amount=720000
- **expected side effect:** No usage mutation
- **cleanup:** Reset SQLite
- **actual result:** Not executed
- **PASS/FAIL:** 
- **AI audit verdict:** 
- **audit reasoning:** 
- **bug ID:** 
- **evidence link:** 

### CPN-AI-016 — Preserve mathematically correct percent result when amount produces fraction

- **ID:** CPN-AI-016
- **origin:** AI-generated
- **technique:** Calculation fractional result
- **requirement/SEC reference:** FR-09 formula
- **title:** Preserve mathematically correct percent result when amount produces fraction
- **priority:** P1
- **preconditions:** SAVE10 eligible; no rounding policy in spec
- **test data:** total_amount=333333
- **request:** POST apply SAVE10
- **execution steps:** Send; compute 33333.3 and 299999.7; do not invent rounding
- **expected status:** 200
- **expected headers/schema/body:** JSON success; discount_amount=33333.3; final_amount=299999.7
- **expected side effect:** No usage mutation
- **cleanup:** Reset SQLite
- **actual result:** Not executed
- **PASS/FAIL:** 
- **AI audit verdict:** 
- **audit reasoning:** 
- **bug ID:** 
- **evidence link:** 

### CPN-AI-017 — Apply fixed discount independent of amount magnitude

- **ID:** CPN-AI-017
- **origin:** AI-generated
- **technique:** Calculation EP fixed
- **requirement/SEC reference:** FR-09 formula
- **title:** Apply fixed discount independent of amount magnitude
- **priority:** P0
- **preconditions:** BIGBUY eligible; authenticated user; usage 0
- **test data:** total_amount=900000
- **request:** POST apply BIGBUY
- **execution steps:** Send; compare fixed value and subtraction
- **expected status:** 200
- **expected headers/schema/body:** JSON success; discount_amount=50000; final_amount=850000
- **expected side effect:** No usage mutation
- **cleanup:** Reset SQLite
- **actual result:** Not executed
- **PASS/FAIL:** 
- **AI audit verdict:** 
- **audit reasoning:** 
- **bug ID:** 
- **evidence link:** 

### CPN-AI-018 — Apply VIP100 fixed value and preserve coupon identity

- **ID:** CPN-AI-018
- **origin:** AI-generated
- **technique:** Calculation second fixed coupon
- **requirement/SEC reference:** FR-09 formula
- **title:** Apply VIP100 fixed value and preserve coupon identity
- **priority:** P1
- **preconditions:** VIP100 eligible; usage 0 of max 2
- **test data:** code=VIP100,total_amount=400000,user_id=2
- **request:** POST apply VIP100
- **execution steps:** Send; assert coupon_id/formula/schema
- **expected status:** 200
- **expected headers/schema/body:** JSON success; discount_amount=100000; final_amount=300000; correct VIP100 coupon_id
- **expected side effect:** No usage mutation
- **cleanup:** Reset SQLite
- **actual result:** Not executed
- **PASS/FAIL:** 
- **AI audit verdict:** 
- **audit reasoning:** 
- **bug ID:** 
- **evidence link:** 

### CPN-AI-019 — Reject coupon exactly at expiration instant

- **ID:** CPN-AI-019
- **origin:** AI-generated
- **technique:** Temporal BVA
- **requirement/SEC reference:** FR-09 C2
- **title:** Reject coupon exactly at expiration instant
- **priority:** P1
- **preconditions:** Test coupon active; expired_at fixed equal to controlled server clock; user eligible
- **test data:** code=HW06_EXPIRY_EDGE,total above minimum,user_id=2
- **request:** POST /api/apply-coupon under controlled clock
- **execution steps:** Set fixture/clock; send at equality; inspect error; verify no usage
- **expected status:** 400
- **expected headers/schema/body:** JSON expired error only
- **expected side effect:** No usage; coupon lifecycle remains expired
- **cleanup:** Remove fixture/reset/restore clock
- **actual result:** Not executed
- **PASS/FAIL:** 
- **AI audit verdict:** 
- **audit reasoning:** 
- **bug ID:** 
- **evidence link:** 

### CPN-AI-020 — Do not record usage from apply preview alone

- **ID:** CPN-AI-020
- **origin:** AI-generated
- **technique:** State transition
- **requirement/SEC reference:** FR-09 C5
- **title:** Do not record usage from apply preview alone
- **priority:** P0
- **preconditions:** SAVE10 usage 0; authenticated user
- **test data:** Apply SAVE10 twice without POST /api/coupon-usage
- **request:** POST /api/apply-coupon twice
- **execution steps:** Send first; send second; both calculate; inspect controlled usage count
- **expected status:** 200 for both
- **expected headers/schema/body:** Both responses exact success schema and same deterministic calculation
- **expected side effect:** Usage stays 0 because checkout usage was not recorded
- **cleanup:** Reset SQLite
- **actual result:** Not executed
- **PASS/FAIL:** 
- **AI audit verdict:** 
- **audit reasoning:** 
- **bug ID:** 
- **evidence link:** 

### CPN-AI-021 — Allow VIP100 when usage count is one below maximum

- **ID:** CPN-AI-021
- **origin:** AI-generated
- **technique:** State BVA max-1
- **requirement/SEC reference:** FR-09 C5
- **title:** Allow VIP100 when usage count is one below maximum
- **priority:** P0
- **preconditions:** VIP100 max=2; user 2 usage count=1
- **test data:** code=VIP100,total_amount=400000,user_id=2
- **request:** POST /api/apply-coupon with user JWT
- **execution steps:** Send; assert success; ensure apply alone does not increment
- **expected status:** 200
- **expected headers/schema/body:** JSON exact success schema; fixed calculation 100000/300000
- **expected side effect:** Usage remains 1 until explicit record endpoint
- **cleanup:** Reset SQLite
- **actual result:** Not executed
- **PASS/FAIL:** 
- **AI audit verdict:** 
- **audit reasoning:** 
- **bug ID:** 
- **evidence link:** 

### CPN-AI-022 — Reject apply immediately after usage transitions from max-minus-one to max

- **ID:** CPN-AI-022
- **origin:** AI-generated
- **technique:** State transition to max
- **requirement/SEC reference:** FR-09 C5
- **title:** Reject apply immediately after usage transitions from max-minus-one to max
- **priority:** P0
- **preconditions:** VIP100 count=1=max-1; user JWT valid; record one successful checkout usage in setup so count becomes max=2
- **test data:** code=VIP100,total_amount=400000,user_id=2
- **request:** POST /api/apply-coupon after setup calls POST /api/coupon-usage once
- **execution steps:** Record the second usage as setup; send apply; assert limit rejection and count remains 2
- **expected status:** 400 or 409 (spec gap)
- **expected headers/schema/body:** JSON error only; no success/calculation fields
- **expected side effect:** Usage transitions from 1 to 2 exactly once
- **cleanup:** Reset SQLite
- **actual result:** Not executed
- **PASS/FAIL:** 
- **AI audit verdict:** 
- **audit reasoning:** 
- **bug ID:** 
- **evidence link:** 

### CPN-AI-023 — Keep usage limits isolated between different coupons

- **ID:** CPN-AI-023
- **origin:** AI-generated
- **technique:** State partition by coupon
- **requirement/SEC reference:** FR-09 C5
- **title:** Keep usage limits isolated between different coupons
- **priority:** P0
- **preconditions:** User 2 reached SAVE10 max; BIGBUY usage remains 0; JWT valid
- **test data:** code=BIGBUY,total_amount=600000,user_id=2
- **request:** POST /api/apply-coupon
- **execution steps:** Send; assert SAVE10 state does not block BIGBUY; inspect both usage states
- **expected status:** 200
- **expected headers/schema/body:** JSON exact success schema; discount_amount=50000; final_amount=550000
- **expected side effect:** SAVE10 stays at max; BIGBUY usage remains 0 until explicitly recorded
- **cleanup:** Reset SQLite
- **actual result:** Not executed
- **PASS/FAIL:** 
- **AI audit verdict:** 
- **audit reasoning:** 
- **bug ID:** 
- **evidence link:** 

### CPN-AI-024 — Keep usage limits isolated between authenticated users

- **ID:** CPN-AI-024
- **origin:** AI-generated
- **technique:** State partition by identity
- **requirement/SEC reference:** FR-09 C5, SEC-02
- **title:** Keep usage limits isolated between authenticated users
- **priority:** P0
- **preconditions:** User A at SAVE10 max; user B usage 0; separate valid JWTs
- **test data:** Apply SAVE10 as user B with B identity
- **request:** POST /api/apply-coupon using user B JWT
- **execution steps:** Send; ensure A state does not block B; verify both counts
- **expected status:** 200
- **expected headers/schema/body:** JSON exact success schema
- **expected side effect:** A usage unchanged at max; B usage unchanged until recorded
- **cleanup:** Reset SQLite
- **actual result:** Not executed
- **PASS/FAIL:** 
- **AI audit verdict:** 
- **audit reasoning:** 
- **bug ID:** 
- **evidence link:** 

### CPN-AI-025 — Reject or safely derive identity when user_id is omitted

- **ID:** CPN-AI-025
- **origin:** AI-generated
- **technique:** Required identity field / IDOR
- **requirement/SEC reference:** FR-09 C4-C5, SEC-02
- **title:** Reject or safely derive identity when user_id is omitted
- **priority:** P0
- **preconditions:** Authenticated user 2; SAVE10 eligible
- **test data:** code=SAVE10,total_amount=500000; user_id omitted
- **request:** POST /api/apply-coupon with user JWT
- **execution steps:** Send; verify limit check cannot be skipped; inspect usage
- **expected status:** 400 if body field remains required, or 200 only if identity is securely derived from JWT (spec gap)
- **expected headers/schema/body:** JSON success/error schema matching chosen contract; never bypass usage
- **expected side effect:** No usage mutation; request cannot escape user 2 limit
- **cleanup:** Reset SQLite
- **actual result:** Not executed
- **PASS/FAIL:** 
- **AI audit verdict:** 
- **audit reasoning:** 
- **bug ID:** 
- **evidence link:** 

### CPN-AI-026 — Reject user_id that does not match JWT subject

- **ID:** CPN-AI-026
- **origin:** AI-generated
- **technique:** IDOR / identity mismatch
- **requirement/SEC reference:** FR-09 C4-C5, SEC-02
- **title:** Reject user_id that does not match JWT subject
- **priority:** P0
- **preconditions:** JWT subject user 2; victim user 1 exists; known separate usage
- **test data:** body user_id=1 with user 2 JWT
- **request:** POST /api/apply-coupon
- **execution steps:** Send; inspect response; verify neither victim state nor limit is consumed/bypassed
- **expected status:** 400 or 403 (spec gap)
- **expected headers/schema/body:** JSON error only; no victim/coupon internals
- **expected side effect:** No usage change for either user
- **cleanup:** Reset SQLite
- **actual result:** Not executed
- **PASS/FAIL:** 
- **AI audit verdict:** 
- **audit reasoning:** 
- **bug ID:** 
- **evidence link:** 

### CPN-AI-027 — Reject string user_id

- **ID:** CPN-AI-027
- **origin:** AI-generated
- **technique:** EP type / identity
- **requirement/SEC reference:** FR-09 C4-C5
- **title:** Reject string user_id
- **priority:** P1
- **preconditions:** Authenticated user; eligible coupon
- **test data:** user_id="2"
- **request:** POST /api/apply-coupon
- **execution steps:** Send; assert strict type and no usage bypass
- **expected status:** 400
- **expected headers/schema/body:** JSON error only
- **expected side effect:** No usage mutation
- **cleanup:** Reset SQLite
- **actual result:** Not executed
- **PASS/FAIL:** 
- **AI audit verdict:** 
- **audit reasoning:** 
- **bug ID:** 
- **evidence link:** 

### CPN-AI-028 — Reject negative user_id

- **ID:** CPN-AI-028
- **origin:** AI-generated
- **technique:** BVA invalid identity
- **requirement/SEC reference:** FR-09 C4-C5
- **title:** Reject negative user_id
- **priority:** P1
- **preconditions:** Authenticated user; eligible coupon
- **test data:** user_id=-1
- **request:** POST /api/apply-coupon
- **execution steps:** Send; assert invalid identity; verify no usage
- **expected status:** 400
- **expected headers/schema/body:** JSON error only
- **expected side effect:** No usage mutation
- **cleanup:** Reset SQLite
- **actual result:** Not executed
- **PASS/FAIL:** 
- **AI audit verdict:** 
- **audit reasoning:** 
- **bug ID:** 
- **evidence link:** 

### CPN-AI-029 — Reject malformed or invalid-signature JWT

- **ID:** CPN-AI-029
- **origin:** AI-generated
- **technique:** Authentication negative
- **requirement/SEC reference:** SEC-02, FR-09 C4
- **title:** Reject malformed or invalid-signature JWT
- **priority:** P0
- **preconditions:** Eligible coupon; token is JWT-shaped but signature invalid
- **test data:** valid body; Authorization Bearer malformed.jwt.signature
- **request:** POST /api/apply-coupon
- **execution steps:** Send; verify auth rejection precedes business response
- **expected status:** 403 or 401 per standardized auth policy
- **expected headers/schema/body:** JSON auth error only; no coupon details
- **expected side effect:** No usage/coupon mutation
- **cleanup:** Reset SQLite
- **actual result:** Not executed
- **PASS/FAIL:** 
- **AI audit verdict:** 
- **audit reasoning:** 
- **bug ID:** 
- **evidence link:** 

### CPN-AI-030 — Reject correctly signed expired JWT

- **ID:** CPN-AI-030
- **origin:** AI-generated
- **technique:** Authentication temporal BVA
- **requirement/SEC reference:** SEC-02, FR-09 C4
- **title:** Reject correctly signed expired JWT
- **priority:** P0
- **preconditions:** Test JWT valid signature with exp in past; coupon eligible
- **test data:** valid body; expired bearer JWT
- **request:** POST /api/apply-coupon
- **execution steps:** Generate controlled expired token; send; verify no calculation
- **expected status:** 403 or 401 per standardized auth policy
- **expected headers/schema/body:** JSON auth error only
- **expected side effect:** No usage/coupon mutation
- **cleanup:** Reset SQLite
- **actual result:** Not executed
- **PASS/FAIL:** 
- **AI audit verdict:** 
- **audit reasoning:** 
- **bug ID:** 
- **evidence link:** 

### CPN-AI-031 — Reject valid JWT sent with wrong authorization scheme

- **ID:** CPN-AI-031
- **origin:** AI-generated
- **technique:** Authentication scheme EP
- **requirement/SEC reference:** SEC-02, FR-09 C4
- **title:** Reject valid JWT sent with wrong authorization scheme
- **priority:** P1
- **preconditions:** Valid user JWT; coupon eligible
- **test data:** Authorization: Token <JWT>
- **request:** POST /api/apply-coupon
- **execution steps:** Send; inspect auth response and state
- **expected status:** 401
- **expected headers/schema/body:** JSON auth error only
- **expected side effect:** No usage/coupon mutation
- **cleanup:** Reset SQLite
- **actual result:** Not executed
- **PASS/FAIL:** 
- **AI audit verdict:** 
- **audit reasoning:** 
- **bug ID:** 
- **evidence link:** 

### CPN-AI-032 — Do not let admin role bypass coupon eligibility rules

- **ID:** CPN-AI-032
- **origin:** AI-generated
- **technique:** Role/condition independence
- **requirement/SEC reference:** FR-09 C1-C5
- **title:** Do not let admin role bypass coupon eligibility rules
- **priority:** P1
- **preconditions:** Admin JWT valid; EXPIRED coupon or below-min request
- **test data:** code=EXPIRED,total_amount=200000,user_id=1
- **request:** POST /api/apply-coupon with admin JWT
- **execution steps:** Send; assert admin still subject to expiry and formula rules
- **expected status:** 400
- **expected headers/schema/body:** JSON expired error only; no admin internals
- **expected side effect:** No usage/coupon mutation
- **cleanup:** Reset SQLite
- **actual result:** Not executed
- **PASS/FAIL:** 
- **AI audit verdict:** 
- **audit reasoning:** 
- **bug ID:** 
- **evidence link:** 

### CPN-AI-033 — Reject missing coupon code

- **ID:** CPN-AI-033
- **origin:** AI-generated
- **technique:** Required-field omission
- **requirement/SEC reference:** FR-09 C1
- **title:** Reject missing coupon code
- **priority:** P0
- **preconditions:** Authenticated user; known amount
- **test data:** total_amount=500000,user_id=2; code omitted
- **request:** POST /api/apply-coupon
- **execution steps:** Send; inspect exact error; verify no usage
- **expected status:** 400
- **expected headers/schema/body:** JSON error only
- **expected side effect:** No usage mutation
- **cleanup:** Reset SQLite
- **actual result:** Not executed
- **PASS/FAIL:** 
- **AI audit verdict:** 
- **audit reasoning:** 
- **bug ID:** 
- **evidence link:** 

### CPN-AI-034 — Reject empty coupon code

- **ID:** CPN-AI-034
- **origin:** AI-generated
- **technique:** BVA empty string
- **requirement/SEC reference:** FR-09 C1
- **title:** Reject empty coupon code
- **priority:** P1
- **preconditions:** Authenticated user
- **test data:** code="",total_amount=500000,user_id=2
- **request:** POST /api/apply-coupon
- **execution steps:** Send; inspect validation response
- **expected status:** 400
- **expected headers/schema/body:** JSON error only
- **expected side effect:** No usage mutation
- **cleanup:** Reset SQLite
- **actual result:** Not executed
- **PASS/FAIL:** 
- **AI audit verdict:** 
- **audit reasoning:** 
- **bug ID:** 
- **evidence link:** 

### CPN-AI-035 — Reject missing total_amount

- **ID:** CPN-AI-035
- **origin:** AI-generated
- **technique:** Required-field omission
- **requirement/SEC reference:** FR-09 C3
- **title:** Reject missing total_amount
- **priority:** P0
- **preconditions:** Authenticated user; SAVE10 active; usage 0
- **test data:** code=SAVE10,user_id=2; total_amount omitted
- **request:** POST /api/apply-coupon
- **execution steps:** Send; assert validation before calculation; verify no usage
- **expected status:** 400
- **expected headers/schema/body:** JSON error only; no NaN/null calculation fields
- **expected side effect:** No usage mutation
- **cleanup:** Reset SQLite
- **actual result:** Not executed
- **PASS/FAIL:** 
- **AI audit verdict:** 
- **audit reasoning:** 
- **bug ID:** 
- **evidence link:** 

### CPN-AI-036 — Reject null total_amount

- **ID:** CPN-AI-036
- **origin:** AI-generated
- **technique:** EP null/type
- **requirement/SEC reference:** FR-09 C3
- **title:** Reject null total_amount
- **priority:** P0
- **preconditions:** Authenticated user; active coupon
- **test data:** total_amount=null
- **request:** POST /api/apply-coupon
- **execution steps:** Send; inspect schema; verify no usage
- **expected status:** 400
- **expected headers/schema/body:** JSON error only
- **expected side effect:** No usage mutation
- **cleanup:** Reset SQLite
- **actual result:** Not executed
- **PASS/FAIL:** 
- **AI audit verdict:** 
- **audit reasoning:** 
- **bug ID:** 
- **evidence link:** 

### CPN-AI-037 — Reject negative total_amount

- **ID:** CPN-AI-037
- **origin:** AI-generated
- **technique:** BVA invalid amount
- **requirement/SEC reference:** FR-09 C3
- **title:** Reject negative total_amount
- **priority:** P0
- **preconditions:** Authenticated user; active coupon
- **test data:** total_amount=-1
- **request:** POST /api/apply-coupon
- **execution steps:** Send; inspect validation response and state
- **expected status:** 400
- **expected headers/schema/body:** JSON error only
- **expected side effect:** No usage mutation and no negative financial result
- **cleanup:** Reset SQLite
- **actual result:** Not executed
- **PASS/FAIL:** 
- **AI audit verdict:** 
- **audit reasoning:** 
- **bug ID:** 
- **evidence link:** 

### CPN-AI-038 — Reject truncated JSON safely

- **ID:** CPN-AI-038
- **origin:** AI-generated
- **technique:** Malformed JSON
- **requirement/SEC reference:** FR-09
- **title:** Reject truncated JSON safely
- **priority:** P0
- **preconditions:** Authenticated user; usage baseline known
- **test data:** raw body={"code":"SAVE10","total_amount":
- **request:** POST /api/apply-coupon application/json
- **execution steps:** Send raw bytes; inspect full error/content type; verify service and usage
- **expected status:** 400
- **expected headers/schema/body:** Safe JSON error; no HTML stack,path,SQL or success fields
- **expected side effect:** No usage/coupon mutation; service remains available
- **cleanup:** None/reset if dirty
- **actual result:** Not executed
- **PASS/FAIL:** 
- **AI audit verdict:** 
- **audit reasoning:** 
- **bug ID:** 
- **evidence link:** 

### CPN-AI-039 — Prevent client override of persisted coupon controls and calculated outputs

- **ID:** CPN-AI-039
- **origin:** AI-generated
- **technique:** Mass assignment / unexpected fields
- **requirement/SEC reference:** FR-09, SEC-02
- **title:** Prevent client override of persisted coupon controls and calculated outputs
- **priority:** P0
- **preconditions:** SAVE10 eligible; authenticated user
- **test data:** valid fields plus coupon_id=999,type=fixed,discount_value=999999,is_active=0,min_order_amount=0,usage_count=0,final_amount=1
- **request:** POST /api/apply-coupon
- **execution steps:** Send; compare result to persisted SAVE10 metadata; inspect coupon state
- **expected status:** 200 if unknown fields ignored; 400 if strict schema rejects
- **expected headers/schema/body:** If accepted exact success schema uses server coupon/formula; never echoes control fields
- **expected side effect:** No coupon metadata/usage mutation; client fields have no effect
- **cleanup:** Reset SQLite
- **actual result:** Not executed
- **PASS/FAIL:** 
- **AI audit verdict:** 
- **audit reasoning:** 
- **bug ID:** 
- **evidence link:** 

### CPN-AI-040 — Reject top-level JSON array instead of request object

- **ID:** CPN-AI-040
- **origin:** AI-generated
- **technique:** Top-level schema
- **requirement/SEC reference:** FR-09
- **title:** Reject top-level JSON array instead of request object
- **priority:** P1
- **preconditions:** Authenticated user; usage baseline known
- **test data:** [{"code":"SAVE10","total_amount":500000,"user_id":2}]
- **request:** POST /api/apply-coupon application/json
- **execution steps:** Send array; inspect exact error; verify state
- **expected status:** 400
- **expected headers/schema/body:** application/json error only; no success/internal fields
- **expected side effect:** No usage/coupon mutation
- **cleanup:** Reset SQLite
- **actual result:** Not executed
- **PASS/FAIL:** 
- **AI audit verdict:** 
- **audit reasoning:** 
- **bug ID:** 
- **evidence link:** 
