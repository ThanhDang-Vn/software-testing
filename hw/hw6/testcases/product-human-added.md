# Product — Human-added Test Cases

- Endpoint focus: `POST /api/products (plus supporting lifecycle endpoints where stated)`
- Origin: human-added after explicit candidate review.
- Execution/audit/bug/evidence fields remain unassigned.

## PRD-H-001 — Guest create attempt cannot become a retrievable product

- **ID:** PRD-H-001
- **origin:** human-added
- **technique:** Unauthorized side-effect chain
- **requirement/SEC reference:** FR-12, SEC-02
- **title:** Guest create attempt cannot become a retrievable product
- **priority:** P0
- **preconditions:** Unique product marker absent; category exists; no JWT
- **test data:** Valid product body with guest marker
- **request:** POST /api/products without JWT, then GET list/detail if an ID appears
- **execution steps:** Send; inspect response; search list; if unexpected ID exists retrieve and capture evidence
- **expected status:** 401
- **expected headers/schema/body:** JSON {error:string}; no created ID/message
- **expected side effect:** No product exists by marker or ID
- **cleanup:** Admin-delete unexpected product/reset
- **actual result:** Not executed
- **PASS/FAIL:** 
- **AI audit verdict:** N/A — human-added
- **audit reasoning:** Why AI missed: Endpoint statefulness: smoke behavior showed unauthorized persistence, while the AI case stopped at expected rejection.
- **bug ID:** 
- **evidence link:** 

## PRD-H-007 — Reject product JSON sent with unsupported media type

- **ID:** PRD-H-007
- **origin:** human-added
- **technique:** Media-type negative
- **requirement/SEC reference:** FR-12, FR-15
- **title:** Reject product JSON sent with unsupported media type
- **priority:** P1
- **preconditions:** Admin JWT valid; category exists; unique product marker absent
- **test data:** Valid product JSON bytes with `Content-Type: text/plain`
- **request:** POST /api/products with admin JWT and wrong media type
- **execution steps:** Send raw request; inspect response; search marker in product list; verify service remains available
- **expected status:** 415
- **expected headers/schema/body:** application/json; exact `{error:string}`; no created ID/parser internals
- **expected side effect:** No product created; unrelated catalog/category state unchanged
- **cleanup:** Delete unexpected product/reset
- **actual result:** Not executed
- **PASS/FAIL:** 
- **AI audit verdict:** N/A — human-added
- **audit reasoning:** Why AI missed: prompt quality — malformed-body coverage did not explicitly request wrong or missing Content-Type.
- **bug ID:** 
- **evidence link:** 

## PRD-H-008 — Reject duplicate product control keys

- **ID:** PRD-H-008
- **origin:** human-added
- **technique:** Parser differential / strict schema
- **requirement/SEC reference:** FR-12, FR-15, SEC-03
- **title:** Reject duplicate product control keys
- **priority:** P0
- **preconditions:** Admin JWT valid; categories 1 and 2 exist; raw-body client available
- **test data:** Raw JSON repeats `price` with valid/invalid values and `category_id` with IDs 1/2
- **request:** POST /api/products with duplicate JSON keys
- **execution steps:** Send raw bytes; inspect response; search marker; verify categories and unrelated products
- **expected status:** 400
- **expected headers/schema/body:** application/json; exact `{error:string}`; no created ID or indication of selected duplicate value
- **expected side effect:** No product created and no catalog/category mutation
- **cleanup:** Delete unexpected product/reset
- **actual result:** Not executed
- **PASS/FAIL:** 
- **AI audit verdict:** N/A — human-added
- **audit reasoning:** Why AI missed: model limitation — top-level and truncated JSON were covered, but valid JSON text with ambiguous duplicate keys was not.
- **bug ID:** 
- **evidence link:** 

## PRD-H-009 — Reject composite JSON types for price

- **ID:** PRD-H-009
- **origin:** human-added
- **technique:** Exact-type equivalence partitions
- **requirement/SEC reference:** FR-15
- **title:** Reject composite JSON types for price
- **priority:** P0
- **preconditions:** Admin JWT valid; category exists; unique marker per iteration
- **test data:** Data iterations `price={"value":100000}` and `price=[100000]`; other fields valid
- **request:** POST /api/products for each iteration
- **execution steps:** Send; inspect error; search each marker; verify no implicit serialization/coercion
- **expected status:** 400 for every iteration
- **expected headers/schema/body:** application/json; exact `{error:string}`; no created ID/internal detail
- **expected side effect:** No product created; unrelated product/category state unchanged
- **cleanup:** Delete unexpected products/reset
- **actual result:** Not executed
- **PASS/FAIL:** 
- **AI audit verdict:** N/A — human-added
- **audit reasoning:** Why AI missed: model limitation — AI checked null, string and boolean price but omitted object/array JSON type partitions.
- **bug ID:** 
- **evidence link:** 

## PRD-H-002 — Normal user create attempt cannot persist ownership-free catalog data

- **ID:** PRD-H-002
- **origin:** human-added
- **technique:** Authorization / persistence chain
- **requirement/SEC reference:** FR-12, SEC-03
- **title:** Normal user create attempt cannot persist ownership-free catalog data
- **priority:** P0
- **preconditions:** Valid role=user JWT; unique marker absent; category exists
- **test data:** Valid product body with user marker
- **request:** POST /api/products with user JWT, then GET list/detail
- **execution steps:** Send; verify forbidden; inspect list/detail and user/category state
- **expected status:** 403
- **expected headers/schema/body:** JSON {error:string}; no created ID
- **expected side effect:** No product or implicit ownership record created
- **cleanup:** Admin-delete unexpected product/reset
- **actual result:** Not executed
- **PASS/FAIL:** 
- **AI audit verdict:** N/A — human-added
- **audit reasoning:** Why AI missed: Endpoint statefulness: authorization impact must be verified in persistent catalog state.
- **bug ID:** 
- **evidence link:** 

## PRD-H-003 — Product price type remains numeric across consecutive odd/even IDs

- **ID:** PRD-H-003
- **origin:** human-added
- **technique:** Schema drift chained state
- **requirement/SEC reference:** FR-15
- **title:** Product price type remains numeric across consecutive odd/even IDs
- **priority:** P0
- **preconditions:** Admin JWT; category exists; next two IDs known only after create
- **test data:** Two valid products with distinct prices/markers
- **request:** POST /api/products twice, then GET /api/products/:id for both
- **execution steps:** Create two; capture IDs; retrieve both; compare exact schema and price types
- **expected status:** Create 200; both GET 200
- **expected headers/schema/body:** Both detail responses use identical schema; price is JSON number for both IDs
- **expected side effect:** Two products created, then removed; no ID-dependent type mutation
- **cleanup:** Delete both IDs
- **actual result:** Not executed
- **PASS/FAIL:** 
- **AI audit verdict:** N/A — human-added
- **audit reasoning:** Why AI missed: Model limitation: isolated create/retrieve cases may miss implementation behavior conditional on row-ID parity.
- **bug ID:** 
- **evidence link:** 

## PRD-H-004 — Reject unsafe or malformed imageUrl schemes without persistence

- **ID:** PRD-H-004
- **origin:** human-added
- **technique:** Unsafe URL / SEC-04
- **requirement/SEC reference:** FR-15, SEC-04
- **title:** Reject unsafe or malformed imageUrl schemes without persistence
- **priority:** P0
- **preconditions:** Admin JWT; category exists; marker absent
- **test data:** Data iterations: javascript:alert(1), data:text/html,<script>, malformed URL
- **request:** POST /api/products for each unsafe imageUrl
- **execution steps:** Send each iteration; inspect error; verify list absence and no browser/network sink
- **expected status:** 400 for each
- **expected headers/schema/body:** JSON {error:string}; no created ID/internal detail
- **expected side effect:** No product created and no unsafe URL rendered/requested
- **cleanup:** Delete unexpected products/reset
- **actual result:** Not executed
- **PASS/FAIL:** 
- **AI audit verdict:** N/A — human-added
- **audit reasoning:** Why AI missed: Spec fragmentation: imageUrl is used by UI but allowed schemes and validation were not defined in the API prompt.
- **bug ID:** 
- **evidence link:** 

## PRD-H-005 — Nonexistent category cannot produce a retrievable orphan product

- **ID:** PRD-H-005
- **origin:** human-added
- **technique:** Referential-integrity chain
- **requirement/SEC reference:** FR-15
- **title:** Nonexistent category cannot produce a retrievable orphan product
- **priority:** P0
- **preconditions:** Admin JWT; category 999999 confirmed absent; unique marker absent
- **test data:** Valid name/price with category_id=999999
- **request:** POST /api/products, then GET product/list/categories
- **execution steps:** Send; inspect response; search marker; verify category still absent
- **expected status:** 422
- **expected headers/schema/body:** JSON {error:string}; no created ID
- **expected side effect:** No orphan product and no implicit category creation
- **cleanup:** Delete unexpected product/reset
- **actual result:** Not executed
- **PASS/FAIL:** 
- **AI audit verdict:** N/A — human-added
- **audit reasoning:** Why AI missed: Endpoint statefulness: a response-only invalid-category check can miss a persisted orphan row.
- **bug ID:** 
- **evidence link:** 

## PRD-H-006 — Admin-created product becomes absent after authorized deletion

- **ID:** PRD-H-006
- **origin:** human-added
- **technique:** Full lifecycle / teardown oracle
- **requirement/SEC reference:** FR-12, FR-15
- **title:** Admin-created product becomes absent after authorized deletion
- **priority:** P1
- **preconditions:** Admin JWT; category exists; unique marker absent
- **test data:** Valid product body
- **request:** POST /api/products; GET detail; DELETE /api/products/:id; GET detail/list
- **execution steps:** Create; retrieve/compare; delete; retrieve again; search list
- **expected status:** Create 200; first GET 200; DELETE 200; final GET 404
- **expected headers/schema/body:** Exact create/detail/delete schemas; final JSON {error:string}
- **expected side effect:** Absent → created → retrievable → deleted/absent; unrelated products unchanged
- **cleanup:** Reset only if lifecycle fails
- **actual result:** Not executed
- **PASS/FAIL:** 
- **AI audit verdict:** N/A — human-added
- **audit reasoning:** Why AI missed: Prompt quality: deletion was treated as cleanup rather than a verified transition with its own oracle.
- **bug ID:** 
- **evidence link:** 
