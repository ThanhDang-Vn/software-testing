# Registration — Human-added Test Cases

- Endpoint focus: `POST /api/register`
- Origin: human-added after explicit candidate review.
- Execution/audit/bug/evidence fields remain unassigned.

## REG-H-001 — Concurrent registration with the same unique email creates only one account

- **ID:** REG-H-001
- **origin:** human-added
- **technique:** Concurrency / state transition
- **requirement/SEC reference:** FR-01
- **title:** Concurrent registration with the same unique email creates only one account
- **priority:** P0
- **preconditions:** SQLite reset; generated email absent; two independent clients ready
- **test data:** Same valid name/email/password/confirmation in both requests
- **request:** Two concurrent POST /api/register requests
- **execution steps:** Release both requests together; collect both responses; count matching users; login surviving account
- **expected status:** One 200 and one 409
- **expected headers/schema/body:** Both JSON; success has exact {message,id}; conflict has exact {error}; no sensitive fields
- **expected side effect:** Exactly one account/email exists; no partial second row
- **cleanup:** Delete surviving user ID or reset SQLite
- **actual result:** Not executed
- **PASS/FAIL:** 
- **AI audit verdict:** N/A — human-added
- **audit reasoning:** Why AI missed: Endpoint statefulness: sequential duplicate coverage does not expose a uniqueness race.
- **bug ID:** 
- **evidence link:** 

## REG-H-008 — Reject duplicate JSON keys in registration object

- **ID:** REG-H-008
- **origin:** human-added
- **technique:** Parser differential / strict schema
- **requirement/SEC reference:** FR-01, SEC-05
- **title:** Reject duplicate JSON keys in registration object
- **priority:** P0
- **preconditions:** Unique candidate emails absent; raw-body client available
- **test data:** Raw JSON contains two `email` keys with different values and two `password` keys with different values
- **request:** POST /api/register with duplicate JSON keys
- **execution steps:** Send raw bytes without client-side reserialization; inspect response; query both candidate emails; verify seed accounts
- **expected status:** 400
- **expected headers/schema/body:** application/json; exact `{error:string}`; no indication which duplicate value was selected; no parser/DB internals
- **expected side effect:** Neither candidate identity is created and no existing account changes
- **cleanup:** Delete unexpected rows/reset SQLite
- **actual result:** Not executed
- **PASS/FAIL:** 
- **AI audit verdict:** N/A — human-added
- **audit reasoning:** Why AI missed: model limitation — generated schema cases covered top-level type and malformed syntax but not parser ambiguity from duplicate keys.
- **bug ID:** 
- **evidence link:** 

## REG-H-009 — Reject prototype-pollution-shaped unexpected fields

- **ID:** REG-H-009
- **origin:** human-added
- **technique:** Mass assignment / prototype pollution
- **requirement/SEC reference:** FR-01, SEC-06
- **title:** Reject prototype-pollution-shaped unexpected fields
- **priority:** P0
- **preconditions:** Unique email absent; a clean follow-up registration identity prepared
- **test data:** Valid required fields plus `__proto__`, `constructor.prototype.role`, nested `user.role=admin`
- **request:** POST /api/register
- **execution steps:** Send pollution-shaped object; inspect error and user state; perform a clean follow-up registration; inspect its role and shared application behavior
- **expected status:** 400
- **expected headers/schema/body:** application/json; exact `{error:string}`; no privilege/internal fields
- **expected side effect:** No attacker account, shared-object mutation or role pollution; clean follow-up user remains normal
- **cleanup:** Delete unexpected/follow-up user IDs or reset SQLite
- **actual result:** Not executed
- **PASS/FAIL:** 
- **AI audit verdict:** N/A — human-added
- **audit reasoning:** Why AI missed: prompt quality — mass assignment focused on flat role/id fields and did not request nested object pollution behavior.
- **bug ID:** 
- **evidence link:** 

## REG-H-002 — Enforce email uniqueness across case variants

- **ID:** REG-H-002
- **origin:** human-added
- **technique:** Identity normalization chain
- **requirement/SEC reference:** FR-01
- **title:** Enforce email uniqueness across case variants
- **priority:** P0
- **preconditions:** Reset; both email variants absent
- **test data:** first=Case.User@example.test; second=case.user@example.test; otherwise valid
- **request:** POST /api/register twice using case variants
- **execution steps:** Register first; register second; count normalized identity; login with documented canonical form
- **expected status:** First 200; second 409
- **expected headers/schema/body:** JSON exact success then conflict schemas
- **expected side effect:** Exactly one logical account; second request does not create or overwrite identity
- **cleanup:** Delete created user/reset
- **actual result:** Not executed
- **PASS/FAIL:** 
- **AI audit verdict:** N/A — human-added
- **audit reasoning:** Why AI missed: Spec fragmentation: FR-01 says unique but does not define email case canonicalization.
- **bug ID:** 
- **evidence link:** 

## REG-H-003 — Reject padded email while allowing the explicit trimmed identity later

- **ID:** REG-H-003
- **origin:** human-added
- **technique:** Normalization / chained state
- **requirement/SEC reference:** FR-01
- **title:** Reject padded email while allowing the explicit trimmed identity later
- **priority:** P1
- **preconditions:** Reset; padded and trimmed identity absent
- **test data:** padded=' user@example.test '; trimmed='user@example.test'
- **request:** POST /api/register padded, then POST /api/register trimmed
- **execution steps:** Send padded request; verify no row; send trimmed request; verify one row/login
- **expected status:** Padded 400; trimmed 200
- **expected headers/schema/body:** JSON error then exact success schema
- **expected side effect:** No padded identity; exactly one trimmed account
- **cleanup:** Delete trimmed account/reset
- **actual result:** Not executed
- **PASS/FAIL:** 
- **AI audit verdict:** N/A — human-added
- **audit reasoning:** Why AI missed: Prompt quality: EP generation identified whitespace but did not define the subsequent identity state.
- **bug ID:** 
- **evidence link:** 

## REG-H-004 — Reject wrong-type confirmation while password remains valid

- **ID:** REG-H-004
- **origin:** human-added
- **technique:** Strict schema isolation
- **requirement/SEC reference:** FR-01
- **title:** Reject wrong-type confirmation while password remains valid
- **priority:** P0
- **preconditions:** Unique email absent
- **test data:** password='Valid123!'; confirm_password=12345678
- **request:** POST /api/register
- **execution steps:** Send; inspect error; verify email absent; attempt login
- **expected status:** 400
- **expected headers/schema/body:** application/json; exact {error:string}; no password/id/stack
- **expected side effect:** No user created
- **cleanup:** Delete unexpected row/reset
- **actual result:** Not executed
- **PASS/FAIL:** 
- **AI audit verdict:** N/A — human-added
- **audit reasoning:** Why AI missed: Model limitation: the AI case changed password and confirmation types together, masking field causality.
- **bug ID:** 
- **evidence link:** 

## REG-H-005 — Reject JSON-looking registration body sent as text/plain

- **ID:** REG-H-005
- **origin:** human-added
- **technique:** Media type / side effect
- **requirement/SEC reference:** FR-01
- **title:** Reject JSON-looking registration body sent as text/plain
- **priority:** P1
- **preconditions:** Unique email absent
- **test data:** Valid JSON bytes with Content-Type text/plain
- **request:** POST /api/register
- **execution steps:** Send raw request; inspect headers/body; query email; send a valid health request
- **expected status:** 415
- **expected headers/schema/body:** application/json; exact {error:string}; no parser stack/path
- **expected side effect:** No user created; service remains available
- **cleanup:** None/reset if dirty
- **actual result:** Not executed
- **PASS/FAIL:** 
- **AI audit verdict:** N/A — human-added
- **audit reasoning:** Why AI missed: Spec fragmentation: the original cases retained an unresolved 400-versus-415 oracle.
- **bug ID:** 
- **evidence link:** 

## REG-H-006 — Duplicate mass-assignment attempt cannot escalate an existing user

- **ID:** REG-H-006
- **origin:** human-added
- **technique:** Mass assignment / privilege chain
- **requirement/SEC reference:** FR-01, SEC-03, SEC-06
- **title:** Duplicate mass-assignment attempt cannot escalate an existing user
- **priority:** P0
- **preconditions:** Create normal run-scoped user first; admin endpoint available
- **test data:** Second registration uses same email plus role=admin,is_admin=true,permissions=['*']
- **request:** POST /api/register duplicate, then login original and call GET /api/admin/users
- **execution steps:** Create normal user; send escalation duplicate; login original; call admin endpoint; inspect role/count
- **expected status:** Duplicate 409; admin endpoint 403
- **expected headers/schema/body:** JSON conflict and forbidden schemas; no privilege fields leaked
- **expected side effect:** One original account remains role=user; no privilege change
- **cleanup:** Delete original user/reset
- **actual result:** Not executed
- **PASS/FAIL:** 
- **AI audit verdict:** N/A — human-added
- **audit reasoning:** Why AI missed: Endpoint statefulness: privilege impact appears only after chaining duplicate handling, login and protected access.
- **bug ID:** 
- **evidence link:** 

## REG-H-007 — Persist an HTML marker as text and verify one concrete admin UI sink escapes it

- **ID:** REG-H-007
- **origin:** human-added
- **technique:** Stored-XSS split verification
- **requirement/SEC reference:** FR-01, SEC-04
- **title:** Persist an HTML marker as text and verify one concrete admin UI sink escapes it
- **priority:** P0
- **preconditions:** Unique email absent; admin users UI identified
- **test data:** name='<img src=x onerror=window.__hw06_xss=1>'; valid remaining fields
- **request:** POST /api/register, then open admin user-list UI
- **execution steps:** Register; retrieve exact stored name; open user-list; inspect DOM and window marker
- **expected status:** 200
- **expected headers/schema/body:** JSON exact success schema; payload not reflected in response
- **expected side effect:** Exactly one user created; UI shows literal text; no img element/event execution
- **cleanup:** Delete user/reset
- **actual result:** Not executed
- **PASS/FAIL:** 
- **AI audit verdict:** N/A — human-added
- **audit reasoning:** Why AI missed: Prompt quality: the AI case combined API persistence with every possible UI sink instead of one bounded sink.
- **bug ID:** 
- **evidence link:** 
