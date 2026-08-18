# Product — AI-generated Test Cases

## Scope

- Endpoint: `POST /api/products`
- IDs: exactly `PRD-AI-001` through `PRD-AI-040`
- Origin: AI-generated only
- Authorization oracle: FR-12, SEC-02 and SEC-03; guest is rejected, normal user is forbidden, and only admin may create.
- Expected results come only from approved Phase 1 artifacts and are not adjusted to current implementation behavior.
- Actual, PASS/FAIL, audit verdict, audit reasoning, bug ID and evidence are intentionally unassigned.

## Coverage map

| Area | Case IDs |
| --- | --- |
| Authentication and roles | PRD-AI-001..006 |
| Name EP/BVA, injection and XSS | PRD-AI-007..018 |
| Price EP/BVA and types | PRD-AI-019..027 |
| Category required/type/existence | PRD-AI-028..033 |
| Optional and unexpected fields | PRD-AI-034..037 |
| Malformed/top-level schema | PRD-AI-038..040 |

## Test cases

### PRD-AI-001 — Create a valid product as admin and validate exact response and database side effect

- **ID:** PRD-AI-001
- **origin:** AI-generated
- **technique:** EP + exact schema + state transition
- **requirement/SEC reference:** FR-12, FR-15, SEC-02, SEC-03
- **title:** Create a valid product as admin and validate exact response and database side effect
- **priority:** P0
- **preconditions:** SQLite reset; admin JWT valid; category 1 exists; unique product name absent
- **test data:** name=HW06-Admin-Baseline,price=100000,description=baseline,imageUrl=https://example.test/p.png,category_id=1
- **request:** POST /api/products with admin bearer JWT
- **execution steps:** Send; assert raw response; capture id; GET detail/list; compare fields and unrelated rows
- **expected status:** 200
- **expected headers/schema/body:** application/json; exact keys message:string,id:positive integer; no extra/sensitive fields
- **expected side effect:** Exactly one product created; retrievable by id; category and unrelated products unchanged
- **cleanup:** DELETE /api/products/:id with admin JWT; verify absence
- **actual result:** Not executed
- **PASS/FAIL:** 
- **AI audit verdict:** 
- **audit reasoning:** 
- **bug ID:** 
- **evidence link:** 

### PRD-AI-002 — Reject valid product creation without JWT

- **ID:** PRD-AI-002
- **origin:** AI-generated
- **technique:** Authorization partition guest
- **requirement/SEC reference:** FR-12, SEC-02
- **title:** Reject valid product creation without JWT
- **priority:** P0
- **preconditions:** Category exists; unique marker absent
- **test data:** Valid five-field product body; no Authorization
- **request:** POST /api/products without token
- **execution steps:** Send; assert auth response; GET list by unique marker
- **expected status:** 401
- **expected headers/schema/body:** JSON error only; no created id/message/internal detail
- **expected side effect:** No product created and product count unchanged
- **cleanup:** Delete unexpected ID/reset if dirty
- **actual result:** Not executed
- **PASS/FAIL:** 
- **AI audit verdict:** 
- **audit reasoning:** 
- **bug ID:** 
- **evidence link:** 

### PRD-AI-003 — Reject product creation by authenticated non-admin user

- **ID:** PRD-AI-003
- **origin:** AI-generated
- **technique:** Authorization partition user
- **requirement/SEC reference:** FR-12, SEC-03
- **title:** Reject product creation by authenticated non-admin user
- **priority:** P0
- **preconditions:** Valid role=user JWT; category exists; unique marker absent
- **test data:** Valid body with unique user-role marker
- **request:** POST /api/products with user bearer JWT
- **execution steps:** Send; assert forbidden; GET list by marker
- **expected status:** 403
- **expected headers/schema/body:** JSON error only
- **expected side effect:** No product created; user/category state unchanged
- **cleanup:** Delete unexpected ID with admin/reset
- **actual result:** Not executed
- **PASS/FAIL:** 
- **AI audit verdict:** 
- **audit reasoning:** 
- **bug ID:** 
- **evidence link:** 

### PRD-AI-004 — Reject malformed or invalid-signature JWT

- **ID:** PRD-AI-004
- **origin:** AI-generated
- **technique:** Authentication negative
- **requirement/SEC reference:** FR-12, SEC-02
- **title:** Reject malformed or invalid-signature JWT
- **priority:** P0
- **preconditions:** Category exists; unique marker absent
- **test data:** Valid body; Authorization Bearer malformed.jwt.signature
- **request:** POST /api/products
- **execution steps:** Send; assert authentication failure before validation/persistence
- **expected status:** 401 or 403 per standardized auth policy
- **expected headers/schema/body:** JSON auth error only; no DB/stack/path
- **expected side effect:** No product created
- **cleanup:** None/reset if dirty
- **actual result:** Not executed
- **PASS/FAIL:** 
- **AI audit verdict:** 
- **audit reasoning:** 
- **bug ID:** 
- **evidence link:** 

### PRD-AI-005 — Reject correctly signed expired admin JWT

- **ID:** PRD-AI-005
- **origin:** AI-generated
- **technique:** Authentication temporal BVA
- **requirement/SEC reference:** FR-12, SEC-02
- **title:** Reject correctly signed expired admin JWT
- **priority:** P0
- **preconditions:** Controlled token has role=admin and exp in past; category exists
- **test data:** Valid body; expired bearer JWT
- **request:** POST /api/products
- **execution steps:** Generate expired token; send; verify marker absent
- **expected status:** 401 or 403 per standardized auth policy
- **expected headers/schema/body:** JSON auth error only
- **expected side effect:** No product created
- **cleanup:** None
- **actual result:** Not executed
- **PASS/FAIL:** 
- **AI audit verdict:** 
- **audit reasoning:** 
- **bug ID:** 
- **evidence link:** 

### PRD-AI-006 — Reject user JWT whose payload is edited to claim admin without valid signature

- **ID:** PRD-AI-006
- **origin:** AI-generated
- **technique:** Role escalation / signature integrity
- **requirement/SEC reference:** FR-12, SEC-02, SEC-03
- **title:** Reject user JWT whose payload is edited to claim admin without valid signature
- **priority:** P0
- **preconditions:** Obtain valid user JWT; alter role claim without re-signing
- **test data:** Valid body; tampered token role=admin
- **request:** POST /api/products
- **execution steps:** Send; assert signature rejection; inspect list/user role
- **expected status:** 401 or 403 per standardized auth policy
- **expected headers/schema/body:** JSON auth error only; no product data
- **expected side effect:** No product created; original user remains role=user
- **cleanup:** None
- **actual result:** Not executed
- **PASS/FAIL:** 
- **AI audit verdict:** 
- **audit reasoning:** 
- **bug ID:** 
- **evidence link:** 

### PRD-AI-007 — Reject missing product name

- **ID:** PRD-AI-007
- **origin:** AI-generated
- **technique:** Required-field omission
- **requirement/SEC reference:** FR-15
- **title:** Reject missing product name
- **priority:** P0
- **preconditions:** Admin JWT valid; category exists
- **test data:** price/description/imageUrl/category_id valid; name omitted
- **request:** POST /api/products
- **execution steps:** Send; inspect error; verify no new product
- **expected status:** 400
- **expected headers/schema/body:** JSON error only; no id
- **expected side effect:** No product created
- **cleanup:** Delete unexpected ID/reset
- **actual result:** Not executed
- **PASS/FAIL:** 
- **AI audit verdict:** 
- **audit reasoning:** 
- **bug ID:** 
- **evidence link:** 

### PRD-AI-008 — Reject null product name

- **ID:** PRD-AI-008
- **origin:** AI-generated
- **technique:** EP null
- **requirement/SEC reference:** FR-15
- **title:** Reject null product name
- **priority:** P0
- **preconditions:** Admin JWT valid; category exists
- **test data:** name=null; remaining fields valid
- **request:** POST /api/products
- **execution steps:** Send; inspect error; verify no new product
- **expected status:** 400
- **expected headers/schema/body:** JSON error only
- **expected side effect:** No product created
- **cleanup:** Delete unexpected ID/reset
- **actual result:** Not executed
- **PASS/FAIL:** 
- **AI audit verdict:** 
- **audit reasoning:** 
- **bug ID:** 
- **evidence link:** 

### PRD-AI-009 — Reject non-string product name

- **ID:** PRD-AI-009
- **origin:** AI-generated
- **technique:** EP type
- **requirement/SEC reference:** FR-15
- **title:** Reject non-string product name
- **priority:** P1
- **preconditions:** Admin JWT valid; category exists
- **test data:** name=12345; remaining fields valid
- **request:** POST /api/products
- **execution steps:** Send; inspect error; verify no coercion/persistence
- **expected status:** 400
- **expected headers/schema/body:** JSON error only
- **expected side effect:** No product created
- **cleanup:** Delete unexpected ID/reset
- **actual result:** Not executed
- **PASS/FAIL:** 
- **AI audit verdict:** 
- **audit reasoning:** 
- **bug ID:** 
- **evidence link:** 

### PRD-AI-010 — Reject empty product name

- **ID:** PRD-AI-010
- **origin:** AI-generated
- **technique:** BVA empty
- **requirement/SEC reference:** FR-15
- **title:** Reject empty product name
- **priority:** P0
- **preconditions:** Admin JWT valid; category exists
- **test data:** name=""; remaining fields valid
- **request:** POST /api/products
- **execution steps:** Send; inspect error; verify absence
- **expected status:** 400
- **expected headers/schema/body:** JSON error only
- **expected side effect:** No product created
- **cleanup:** Delete unexpected ID/reset
- **actual result:** Not executed
- **PASS/FAIL:** 
- **AI audit verdict:** 
- **audit reasoning:** 
- **bug ID:** 
- **evidence link:** 

### PRD-AI-011 — Reject whitespace-only product name

- **ID:** PRD-AI-011
- **origin:** AI-generated
- **technique:** EP whitespace
- **requirement/SEC reference:** FR-15
- **title:** Reject whitespace-only product name
- **priority:** P1
- **preconditions:** Admin JWT valid; category exists
- **test data:** name="   "; remaining fields valid
- **request:** POST /api/products
- **execution steps:** Send; inspect error; query exact marker/row count
- **expected status:** 400
- **expected headers/schema/body:** JSON error only
- **expected side effect:** No product created
- **cleanup:** Delete unexpected ID/reset
- **actual result:** Not executed
- **PASS/FAIL:** 
- **AI audit verdict:** 
- **audit reasoning:** 
- **bug ID:** 
- **evidence link:** 

### PRD-AI-012 — Accept one-character product name

- **ID:** PRD-AI-012
- **origin:** AI-generated
- **technique:** BVA minimum non-empty
- **requirement/SEC reference:** FR-15
- **title:** Accept one-character product name
- **priority:** P1
- **preconditions:** Admin JWT valid; category exists; name X absent or identified by run marker
- **test data:** name=X,price=1,category_id=1; optional fields valid
- **request:** POST /api/products
- **execution steps:** Send; capture id; GET detail; compare exact name
- **expected status:** 200
- **expected headers/schema/body:** JSON exact success schema
- **expected side effect:** Exactly one product created with one-character name
- **cleanup:** Delete returned ID
- **actual result:** Not executed
- **PASS/FAIL:** 
- **AI audit verdict:** 
- **audit reasoning:** 
- **bug ID:** 
- **evidence link:** 

### PRD-AI-013 — Accept product name of 254 characters

- **ID:** PRD-AI-013
- **origin:** AI-generated
- **technique:** BVA max-1
- **requirement/SEC reference:** FR-15
- **title:** Accept product name of 254 characters
- **priority:** P1
- **preconditions:** Admin JWT valid; category exists; generated name unique
- **test data:** name='A' repeated 254; valid price/category
- **request:** POST /api/products
- **execution steps:** Assert generated length=254; send; retrieve and compare length/content
- **expected status:** 200
- **expected headers/schema/body:** JSON exact success schema
- **expected side effect:** One product created; persisted name length 254
- **cleanup:** Delete returned ID
- **actual result:** Not executed
- **PASS/FAIL:** 
- **AI audit verdict:** 
- **audit reasoning:** 
- **bug ID:** 
- **evidence link:** 

### PRD-AI-014 — Accept product name of exactly 255 characters

- **ID:** PRD-AI-014
- **origin:** AI-generated
- **technique:** BVA maximum
- **requirement/SEC reference:** FR-15
- **title:** Accept product name of exactly 255 characters
- **priority:** P0
- **preconditions:** Admin JWT valid; category exists; generated name unique
- **test data:** name='B' repeated 255; valid price/category
- **request:** POST /api/products
- **execution steps:** Assert length=255; send; retrieve and compare
- **expected status:** 200
- **expected headers/schema/body:** JSON exact success schema
- **expected side effect:** One product created; persisted name length 255
- **cleanup:** Delete returned ID
- **actual result:** Not executed
- **PASS/FAIL:** 
- **AI audit verdict:** 
- **audit reasoning:** 
- **bug ID:** 
- **evidence link:** 

### PRD-AI-015 — Reject product name of 256 characters

- **ID:** PRD-AI-015
- **origin:** AI-generated
- **technique:** BVA max+1
- **requirement/SEC reference:** FR-15
- **title:** Reject product name of 256 characters
- **priority:** P0
- **preconditions:** Admin JWT valid; category exists; generated marker absent
- **test data:** name='C' repeated 256; valid price/category
- **request:** POST /api/products
- **execution steps:** Assert length=256; send; verify absence
- **expected status:** 400
- **expected headers/schema/body:** JSON error only; no id
- **expected side effect:** No product created
- **cleanup:** Delete unexpected ID/reset
- **actual result:** Not executed
- **PASS/FAIL:** 
- **AI audit verdict:** 
- **audit reasoning:** 
- **bug ID:** 
- **evidence link:** 

### PRD-AI-016 — Accept valid Unicode product name without corruption

- **ID:** PRD-AI-016
- **origin:** AI-generated
- **technique:** EP Unicode
- **requirement/SEC reference:** FR-15, SEC-04
- **title:** Accept valid Unicode product name without corruption
- **priority:** P1
- **preconditions:** Admin JWT valid; category exists
- **test data:** name=Điện thoại thử nghiệm 🌱; valid other fields
- **request:** POST /api/products
- **execution steps:** Send; retrieve by id; compare Unicode code points; inspect rendering safely
- **expected status:** 200
- **expected headers/schema/body:** JSON exact success schema
- **expected side effect:** One product created; Unicode round-trips unchanged and UI escapes it
- **cleanup:** Delete returned ID
- **actual result:** Not executed
- **PASS/FAIL:** 
- **AI audit verdict:** 
- **audit reasoning:** 
- **bug ID:** 
- **evidence link:** 

### PRD-AI-017 — Treat SQL-injection-shaped product name as literal data

- **ID:** PRD-AI-017
- **origin:** AI-generated
- **technique:** SEC-05 parameterization
- **requirement/SEC reference:** SEC-05, FR-15
- **title:** Treat SQL-injection-shaped product name as literal data
- **priority:** P0
- **preconditions:** Admin JWT valid; seed products counted; category exists
- **test data:** name="Phone'); DROP TABLE products;--"; valid price/category
- **request:** POST /api/products
- **execution steps:** Send; retrieve created row; query seed products/categories; verify service
- **expected status:** 200
- **expected headers/schema/body:** JSON exact success schema; no SQL error/detail
- **expected side effect:** One literal-name product created; no table/query expansion or unrelated mutation
- **cleanup:** Delete returned ID
- **actual result:** Not executed
- **PASS/FAIL:** 
- **AI audit verdict:** 
- **audit reasoning:** 
- **bug ID:** 
- **evidence link:** 

### PRD-AI-018 — Persist XSS marker only if every UI sink renders it safely

- **ID:** PRD-AI-018
- **origin:** AI-generated
- **technique:** Stored-XSS candidate
- **requirement/SEC reference:** SEC-04, FR-15
- **title:** Persist XSS marker only if every UI sink renders it safely
- **priority:** P0
- **preconditions:** Admin JWT valid; storefront/admin UI available
- **test data:** name=<img src=x onerror=alert(1)>; description=<svg onload=alert(1)>; valid price/category
- **request:** POST /api/products
- **execution steps:** Send; retrieve; open all rendering surfaces; inspect DOM and execution
- **expected status:** 200
- **expected headers/schema/body:** JSON exact success schema; payload not reflected unnecessarily
- **expected side effect:** One product may persist; payload must never execute or become unsafe DOM
- **cleanup:** Delete returned ID
- **actual result:** Not executed
- **PASS/FAIL:** 
- **AI audit verdict:** 
- **audit reasoning:** 
- **bug ID:** 
- **evidence link:** 

### PRD-AI-019 — Reject missing price

- **ID:** PRD-AI-019
- **origin:** AI-generated
- **technique:** Required-field omission
- **requirement/SEC reference:** FR-15
- **title:** Reject missing price
- **priority:** P0
- **preconditions:** Admin JWT valid; category exists; unique marker absent
- **test data:** name valid; price omitted; category_id=1
- **request:** POST /api/products
- **execution steps:** Send; inspect error; verify marker absent
- **expected status:** 400
- **expected headers/schema/body:** JSON error only
- **expected side effect:** No product created
- **cleanup:** Delete unexpected ID/reset
- **actual result:** Not executed
- **PASS/FAIL:** 
- **AI audit verdict:** 
- **audit reasoning:** 
- **bug ID:** 
- **evidence link:** 

### PRD-AI-020 — Reject null price

- **ID:** PRD-AI-020
- **origin:** AI-generated
- **technique:** EP null
- **requirement/SEC reference:** FR-15
- **title:** Reject null price
- **priority:** P0
- **preconditions:** Admin JWT valid; category exists
- **test data:** price=null; remaining required fields valid
- **request:** POST /api/products
- **execution steps:** Send; inspect error; verify absence
- **expected status:** 400
- **expected headers/schema/body:** JSON error only
- **expected side effect:** No product created
- **cleanup:** Delete unexpected ID/reset
- **actual result:** Not executed
- **PASS/FAIL:** 
- **AI audit verdict:** 
- **audit reasoning:** 
- **bug ID:** 
- **evidence link:** 

### PRD-AI-021 — Reject numeric-looking string price

- **ID:** PRD-AI-021
- **origin:** AI-generated
- **technique:** EP type
- **requirement/SEC reference:** FR-15
- **title:** Reject numeric-looking string price
- **priority:** P0
- **preconditions:** Admin JWT valid; category exists
- **test data:** price="100000"
- **request:** POST /api/products
- **execution steps:** Send; assert strict number type; verify no coercion
- **expected status:** 400
- **expected headers/schema/body:** JSON error only
- **expected side effect:** No product created
- **cleanup:** Delete unexpected ID/reset
- **actual result:** Not executed
- **PASS/FAIL:** 
- **AI audit verdict:** 
- **audit reasoning:** 
- **bug ID:** 
- **evidence link:** 

### PRD-AI-022 — Reject price equal to zero

- **ID:** PRD-AI-022
- **origin:** AI-generated
- **technique:** BVA zero
- **requirement/SEC reference:** FR-15
- **title:** Reject price equal to zero
- **priority:** P0
- **preconditions:** Admin JWT valid; category exists
- **test data:** price=0
- **request:** POST /api/products
- **execution steps:** Send; inspect error; verify absence
- **expected status:** 400
- **expected headers/schema/body:** JSON error only
- **expected side effect:** No product created
- **cleanup:** Delete unexpected ID/reset
- **actual result:** Not executed
- **PASS/FAIL:** 
- **AI audit verdict:** 
- **audit reasoning:** 
- **bug ID:** 
- **evidence link:** 

### PRD-AI-023 — Reject negative price

- **ID:** PRD-AI-023
- **origin:** AI-generated
- **technique:** BVA below zero
- **requirement/SEC reference:** FR-15
- **title:** Reject negative price
- **priority:** P0
- **preconditions:** Admin JWT valid; category exists
- **test data:** price=-0.01
- **request:** POST /api/products
- **execution steps:** Send; inspect error; verify absence
- **expected status:** 400
- **expected headers/schema/body:** JSON error only
- **expected side effect:** No product created
- **cleanup:** Delete unexpected ID/reset
- **actual result:** Not executed
- **PASS/FAIL:** 
- **AI audit verdict:** 
- **audit reasoning:** 
- **bug ID:** 
- **evidence link:** 

### PRD-AI-024 — Accept a finite positive fractional price

- **ID:** PRD-AI-024
- **origin:** AI-generated
- **technique:** BVA smallest representative positive
- **requirement/SEC reference:** FR-15
- **title:** Accept a finite positive fractional price
- **priority:** P1
- **preconditions:** Admin JWT valid; category exists; currency precision rule not specified
- **test data:** price=0.01
- **request:** POST /api/products
- **execution steps:** Send; retrieve; compare numeric value without inventing integer-only rule
- **expected status:** 200
- **expected headers/schema/body:** JSON exact success schema
- **expected side effect:** One product created with finite price >0
- **cleanup:** Delete returned ID
- **actual result:** Not executed
- **PASS/FAIL:** 
- **AI audit verdict:** 
- **audit reasoning:** 
- **bug ID:** 
- **evidence link:** 

### PRD-AI-025 — Accept ordinary positive integer price

- **ID:** PRD-AI-025
- **origin:** AI-generated
- **technique:** EP positive integer
- **requirement/SEC reference:** FR-15
- **title:** Accept ordinary positive integer price
- **priority:** P1
- **preconditions:** Admin JWT valid; category exists
- **test data:** price=25000000
- **request:** POST /api/products
- **execution steps:** Send; retrieve; assert price remains numeric and exact
- **expected status:** 200
- **expected headers/schema/body:** JSON exact success schema
- **expected side effect:** One product created; retrieved price is number 25000000
- **cleanup:** Delete returned ID
- **actual result:** Not executed
- **PASS/FAIL:** 
- **AI audit verdict:** 
- **audit reasoning:** 
- **bug ID:** 
- **evidence link:** 

### PRD-AI-026 — Accept large finite positive price without overflow or type change

- **ID:** PRD-AI-026
- **origin:** AI-generated
- **technique:** EP large finite number
- **requirement/SEC reference:** FR-15
- **title:** Accept large finite positive price without overflow or type change
- **priority:** P1
- **preconditions:** Admin JWT valid; category exists; no maximum specified
- **test data:** price=2147483647
- **request:** POST /api/products
- **execution steps:** Send; retrieve; compare exact numeric value/type
- **expected status:** 200
- **expected headers/schema/body:** JSON exact success schema
- **expected side effect:** One product created; no overflow/wrap/type conversion
- **cleanup:** Delete returned ID
- **actual result:** Not executed
- **PASS/FAIL:** 
- **AI audit verdict:** 
- **audit reasoning:** 
- **bug ID:** 
- **evidence link:** 

### PRD-AI-027 — Reject boolean price

- **ID:** PRD-AI-027
- **origin:** AI-generated
- **technique:** EP invalid scalar type
- **requirement/SEC reference:** FR-15
- **title:** Reject boolean price
- **priority:** P1
- **preconditions:** Admin JWT valid; category exists
- **test data:** price=true
- **request:** POST /api/products
- **execution steps:** Send; inspect error; verify absence
- **expected status:** 400
- **expected headers/schema/body:** JSON error only
- **expected side effect:** No product created or boolean-to-number coercion
- **cleanup:** Delete unexpected ID/reset
- **actual result:** Not executed
- **PASS/FAIL:** 
- **AI audit verdict:** 
- **audit reasoning:** 
- **bug ID:** 
- **evidence link:** 

### PRD-AI-028 — Reject missing category_id

- **ID:** PRD-AI-028
- **origin:** AI-generated
- **technique:** Required-field omission
- **requirement/SEC reference:** FR-15
- **title:** Reject missing category_id
- **priority:** P0
- **preconditions:** Admin JWT valid; unique marker absent
- **test data:** valid name/price; category_id omitted
- **request:** POST /api/products
- **execution steps:** Send; inspect error; verify absence
- **expected status:** 400
- **expected headers/schema/body:** JSON error only
- **expected side effect:** No product created
- **cleanup:** Delete unexpected ID/reset
- **actual result:** Not executed
- **PASS/FAIL:** 
- **AI audit verdict:** 
- **audit reasoning:** 
- **bug ID:** 
- **evidence link:** 

### PRD-AI-029 — Reject null category_id

- **ID:** PRD-AI-029
- **origin:** AI-generated
- **technique:** EP null
- **requirement/SEC reference:** FR-15
- **title:** Reject null category_id
- **priority:** P0
- **preconditions:** Admin JWT valid
- **test data:** category_id=null; other fields valid
- **request:** POST /api/products
- **execution steps:** Send; inspect error; verify absence
- **expected status:** 400
- **expected headers/schema/body:** JSON error only
- **expected side effect:** No product created
- **cleanup:** Delete unexpected ID/reset
- **actual result:** Not executed
- **PASS/FAIL:** 
- **AI audit verdict:** 
- **audit reasoning:** 
- **bug ID:** 
- **evidence link:** 

### PRD-AI-030 — Reject string category_id

- **ID:** PRD-AI-030
- **origin:** AI-generated
- **technique:** EP type
- **requirement/SEC reference:** FR-15
- **title:** Reject string category_id
- **priority:** P1
- **preconditions:** Admin JWT valid; category 1 exists
- **test data:** category_id="1"
- **request:** POST /api/products
- **execution steps:** Send; assert strict integer type; verify absence
- **expected status:** 400
- **expected headers/schema/body:** JSON error only
- **expected side effect:** No product created or type coercion
- **cleanup:** Delete unexpected ID/reset
- **actual result:** Not executed
- **PASS/FAIL:** 
- **AI audit verdict:** 
- **audit reasoning:** 
- **bug ID:** 
- **evidence link:** 

### PRD-AI-031 — Reject non-positive category_id

- **ID:** PRD-AI-031
- **origin:** AI-generated
- **technique:** BVA invalid identifier
- **requirement/SEC reference:** FR-15
- **title:** Reject non-positive category_id
- **priority:** P0
- **preconditions:** Admin JWT valid
- **test data:** category_id=0
- **request:** POST /api/products
- **execution steps:** Send; inspect error; verify absence
- **expected status:** 400
- **expected headers/schema/body:** JSON error only
- **expected side effect:** No product created
- **cleanup:** Delete unexpected ID/reset
- **actual result:** Not executed
- **PASS/FAIL:** 
- **AI audit verdict:** 
- **audit reasoning:** 
- **bug ID:** 
- **evidence link:** 

### PRD-AI-032 — Reject positive category_id that does not exist

- **ID:** PRD-AI-032
- **origin:** AI-generated
- **technique:** Referential integrity
- **requirement/SEC reference:** FR-15
- **title:** Reject positive category_id that does not exist
- **priority:** P0
- **preconditions:** Admin JWT valid; confirm category 999999 absent
- **test data:** category_id=999999
- **request:** POST /api/products
- **execution steps:** Send; inspect error; verify marker absent/category unchanged
- **expected status:** 400 or 422 (spec gap)
- **expected headers/schema/body:** JSON error only
- **expected side effect:** No product created and no category created implicitly
- **cleanup:** Delete unexpected ID/reset
- **actual result:** Not executed
- **PASS/FAIL:** 
- **AI audit verdict:** 
- **audit reasoning:** 
- **bug ID:** 
- **evidence link:** 

### PRD-AI-033 — Create product under an existing non-default category

- **ID:** PRD-AI-033
- **origin:** AI-generated
- **technique:** Valid reference partition
- **requirement/SEC reference:** FR-15
- **title:** Create product under an existing non-default category
- **priority:** P1
- **preconditions:** Admin JWT valid; category 2 confirmed by GET /api/categories
- **test data:** category_id=2; valid unique name/price
- **request:** POST /api/products
- **execution steps:** Send; capture id; GET detail; compare category_id=2
- **expected status:** 200
- **expected headers/schema/body:** JSON exact success schema
- **expected side effect:** One product created referencing existing category 2; category unchanged
- **cleanup:** Delete returned ID
- **actual result:** Not executed
- **PASS/FAIL:** 
- **AI audit verdict:** 
- **audit reasoning:** 
- **bug ID:** 
- **evidence link:** 

### PRD-AI-034 — Create product with description omitted

- **ID:** PRD-AI-034
- **origin:** AI-generated
- **technique:** Optional-field omission
- **requirement/SEC reference:** FR-15
- **title:** Create product with description omitted
- **priority:** P1
- **preconditions:** Admin JWT valid; category exists
- **test data:** name/price/imageUrl/category_id valid; description omitted
- **request:** POST /api/products
- **execution steps:** Send; retrieve; verify required fields and documented optional representation
- **expected status:** 200
- **expected headers/schema/body:** JSON exact success schema
- **expected side effect:** One product created; no unrelated defaults/control fields injected
- **cleanup:** Delete returned ID
- **actual result:** Not executed
- **PASS/FAIL:** 
- **AI audit verdict:** 
- **audit reasoning:** 
- **bug ID:** 
- **evidence link:** 

### PRD-AI-035 — Create product with imageUrl omitted

- **ID:** PRD-AI-035
- **origin:** AI-generated
- **technique:** Optional-field omission
- **requirement/SEC reference:** FR-15
- **title:** Create product with imageUrl omitted
- **priority:** P1
- **preconditions:** Admin JWT valid; category exists
- **test data:** name/price/description/category_id valid; imageUrl omitted
- **request:** POST /api/products
- **execution steps:** Send; retrieve; verify required fields and optional representation
- **expected status:** 200
- **expected headers/schema/body:** JSON exact success schema
- **expected side effect:** One product created without requiring imageUrl
- **cleanup:** Delete returned ID
- **actual result:** Not executed
- **PASS/FAIL:** 
- **AI audit verdict:** 
- **audit reasoning:** 
- **bug ID:** 
- **evidence link:** 

### PRD-AI-036 — Create product with both optional fields unspecified

- **ID:** PRD-AI-036
- **origin:** AI-generated
- **technique:** Optional combination
- **requirement/SEC reference:** FR-15
- **title:** Create product with both optional fields unspecified
- **priority:** P1
- **preconditions:** Admin JWT valid; category exists
- **test data:** name/price/category_id only
- **request:** POST /api/products
- **execution steps:** Send; retrieve; assert absence/null policy consistently and exact create response
- **expected status:** 200
- **expected headers/schema/body:** JSON exact success schema
- **expected side effect:** One product created from required fields only
- **cleanup:** Delete returned ID
- **actual result:** Not executed
- **PASS/FAIL:** 
- **AI audit verdict:** 
- **audit reasoning:** 
- **bug ID:** 
- **evidence link:** 

### PRD-AI-037 — Prevent unexpected ownership privilege and server-owned fields from being assigned

- **ID:** PRD-AI-037
- **origin:** AI-generated
- **technique:** Mass assignment / unexpected fields
- **requirement/SEC reference:** FR-12, SEC-03, FR-15
- **title:** Prevent unexpected ownership privilege and server-owned fields from being assigned
- **priority:** P0
- **preconditions:** Admin JWT valid; category exists
- **test data:** Valid body plus id=1,user_id=2,owner_id=2,role=admin,is_admin=true,created_by=2,created_at=fake
- **request:** POST /api/products
- **execution steps:** Send; capture/retrieve if accepted; inspect unrelated product id 1 and returned record
- **expected status:** 200 if unknown fields ignored; 400 if strict schema rejects
- **expected headers/schema/body:** If accepted exact {message,id}; no privilege/owner/timestamp fields echoed
- **expected side effect:** At most one server-ID product; injected fields have no effect; product 1/user/category unchanged
- **cleanup:** Delete returned ID/reset
- **actual result:** Not executed
- **PASS/FAIL:** 
- **AI audit verdict:** 
- **audit reasoning:** 
- **bug ID:** 
- **evidence link:** 

### PRD-AI-038 — Reject empty JSON request body without persistence

- **ID:** PRD-AI-038
- **origin:** AI-generated
- **technique:** Malformed request / empty body
- **requirement/SEC reference:** FR-15
- **title:** Reject empty JSON request body without persistence
- **priority:** P0
- **preconditions:** Admin JWT valid; product count baseline known
- **test data:** Empty body with Content-Type application/json
- **request:** POST /api/products
- **execution steps:** Send; inspect full response; compare product count
- **expected status:** 400
- **expected headers/schema/body:** Safe JSON error only; no id/stack/path/SQL
- **expected side effect:** No product created
- **cleanup:** None/reset if dirty
- **actual result:** Not executed
- **PASS/FAIL:** 
- **AI audit verdict:** 
- **audit reasoning:** 
- **bug ID:** 
- **evidence link:** 

### PRD-AI-039 — Reject truncated product JSON safely

- **ID:** PRD-AI-039
- **origin:** AI-generated
- **technique:** Malformed JSON
- **requirement/SEC reference:** FR-15
- **title:** Reject truncated product JSON safely
- **priority:** P0
- **preconditions:** Admin JWT valid; product count baseline known
- **test data:** raw body={"name":"HW06","price":
- **request:** POST /api/products application/json
- **execution steps:** Send raw bytes; inspect headers/body; issue health read afterward
- **expected status:** 400
- **expected headers/schema/body:** Safe structured JSON error; no HTML stack,source path,SQL or success fields
- **expected side effect:** No product created; service remains available
- **cleanup:** None
- **actual result:** Not executed
- **PASS/FAIL:** 
- **AI audit verdict:** 
- **audit reasoning:** 
- **bug ID:** 
- **evidence link:** 

### PRD-AI-040 — Reject top-level JSON array instead of product object

- **ID:** PRD-AI-040
- **origin:** AI-generated
- **technique:** Top-level schema
- **requirement/SEC reference:** FR-15
- **title:** Reject top-level JSON array instead of product object
- **priority:** P1
- **preconditions:** Admin JWT valid; product count baseline known
- **test data:** [{"name":"HW06","price":1,"category_id":1}]
- **request:** POST /api/products application/json
- **execution steps:** Send array; inspect exact error; compare product state
- **expected status:** 400
- **expected headers/schema/body:** application/json error only; no success/internal fields
- **expected side effect:** No product created
- **cleanup:** None/reset if dirty
- **actual result:** Not executed
- **PASS/FAIL:** 
- **AI audit verdict:** 
- **audit reasoning:** 
- **bug ID:** 
- **evidence link:** 

