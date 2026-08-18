# Registration — AI-generated Test Cases

## Scope

- Endpoint: `POST /api/register`
- IDs: exactly `REG-AI-001` through `REG-AI-040`
- Origin: AI-generated only
- Oracle: approved Phase 1 artifacts only; expected results are not adjusted to current implementation defects.
- Audit/execution fields are intentionally unassigned because these cases have not been executed or human-audited.
- Duplicate status and wrong-media-type status remain explicit spec gaps inherited from Phase 1; they are not guessed.

## Test cases

### REG-AI-001 — Register valid account and validate exact success schema

- **ID:** REG-AI-001
- **origin:** AI-generated
- **technique:** EP + exact schema
- **requirement/SEC reference:** FR-01
- **title:** Register valid account and validate exact success schema
- **priority:** P0
- **preconditions:** SQLite reset; unique email absent
- **test data:** name=Nguyen Van A; email={{generatedEmail}}; password=Valid123!; confirm_password=Valid123!
- **request:** POST /api/register JSON valid
- **execution steps:** 1 Generate unique email; 2 Send request; 3 inspect raw response; 4 query admin users; 5 login new account
- **expected status:** 200
- **expected headers/schema/body:** Content-Type application/json; exact keys message:string and id:positive integer; no extra/sensitive fields
- **expected side effect:** Exactly one normal user is created; login succeeds
- **cleanup:** Delete returned user ID
- **actual result:** Not executed
- **PASS/FAIL:** 
- **AI audit verdict:** 
- **audit reasoning:** 
- **bug ID:** 
- **evidence link:** 

### REG-AI-002 — Accept minimum non-empty name boundary

- **ID:** REG-AI-002
- **origin:** AI-generated
- **technique:** BVA
- **requirement/SEC reference:** FR-01
- **title:** Accept minimum non-empty name boundary
- **priority:** P1
- **preconditions:** Unique email absent
- **test data:** name=A; unique valid email; valid matching passwords
- **request:** POST /api/register with one-character name
- **execution steps:** Send request; inspect response; verify persisted name exactly A
- **expected status:** 200
- **expected headers/schema/body:** JSON; exact success schema {message,id}
- **expected side effect:** One user created with name A
- **cleanup:** Delete returned user ID
- **actual result:** Not executed
- **PASS/FAIL:** 
- **AI audit verdict:** 
- **audit reasoning:** 
- **bug ID:** 
- **evidence link:** 

### REG-AI-003 — Accept valid Unicode name without corruption

- **ID:** REG-AI-003
- **origin:** AI-generated
- **technique:** EP / Unicode
- **requirement/SEC reference:** FR-01, SEC-04
- **title:** Accept valid Unicode name without corruption
- **priority:** P1
- **preconditions:** Unique email absent
- **test data:** name=Nguyễn Ánh 🌱; unique valid email; valid matching passwords
- **request:** POST /api/register with Unicode name
- **execution steps:** Send; inspect schema; retrieve through admin users endpoint; compare code points
- **expected status:** 200
- **expected headers/schema/body:** JSON; exact success schema; no password/token
- **expected side effect:** One user created; name round-trips unchanged and must be escaped by any UI
- **cleanup:** Delete returned user ID
- **actual result:** Not executed
- **PASS/FAIL:** 
- **AI audit verdict:** 
- **audit reasoning:** 
- **bug ID:** 
- **evidence link:** 

### REG-AI-004 — Reject missing name

- **ID:** REG-AI-004
- **origin:** AI-generated
- **technique:** EP required-field omission
- **requirement/SEC reference:** FR-01
- **title:** Reject missing name
- **priority:** P0
- **preconditions:** Unique email absent
- **test data:** email valid; password and confirmation valid; name omitted
- **request:** POST /api/register without name
- **execution steps:** Send; inspect error; verify email absent
- **expected status:** 400
- **expected headers/schema/body:** JSON; exact error schema {error:string}; no id/message/password/stack
- **expected side effect:** No user created
- **cleanup:** None; delete unexpected row/reset
- **actual result:** Not executed
- **PASS/FAIL:** 
- **AI audit verdict:** 
- **audit reasoning:** 
- **bug ID:** 
- **evidence link:** 

### REG-AI-005 — Reject null name

- **ID:** REG-AI-005
- **origin:** AI-generated
- **technique:** EP null
- **requirement/SEC reference:** FR-01
- **title:** Reject null name
- **priority:** P1
- **preconditions:** Unique email absent
- **test data:** name=null; remaining fields valid
- **request:** POST /api/register with null name
- **execution steps:** Send; inspect error; verify email absent
- **expected status:** 400
- **expected headers/schema/body:** JSON error only; no sensitive/internal fields
- **expected side effect:** No user created
- **cleanup:** None; delete unexpected row/reset
- **actual result:** Not executed
- **PASS/FAIL:** 
- **AI audit verdict:** 
- **audit reasoning:** 
- **bug ID:** 
- **evidence link:** 

### REG-AI-006 — Reject non-string name

- **ID:** REG-AI-006
- **origin:** AI-generated
- **technique:** EP type
- **requirement/SEC reference:** FR-01
- **title:** Reject non-string name
- **priority:** P1
- **preconditions:** Unique email absent
- **test data:** name=12345; remaining fields valid
- **request:** POST /api/register with numeric name
- **execution steps:** Send; inspect error; verify email absent
- **expected status:** 400
- **expected headers/schema/body:** JSON error only
- **expected side effect:** No user created or implicit numeric-to-string persistence
- **cleanup:** None; delete unexpected row/reset
- **actual result:** Not executed
- **PASS/FAIL:** 
- **AI audit verdict:** 
- **audit reasoning:** 
- **bug ID:** 
- **evidence link:** 

### REG-AI-007 — Reject empty name

- **ID:** REG-AI-007
- **origin:** AI-generated
- **technique:** BVA empty
- **requirement/SEC reference:** FR-01
- **title:** Reject empty name
- **priority:** P0
- **preconditions:** Unique email absent
- **test data:** name=""; remaining fields valid
- **request:** POST /api/register with empty name
- **execution steps:** Send; inspect error; verify email absent
- **expected status:** 400
- **expected headers/schema/body:** JSON error only
- **expected side effect:** No user created
- **cleanup:** None; delete unexpected row/reset
- **actual result:** Not executed
- **PASS/FAIL:** 
- **AI audit verdict:** 
- **audit reasoning:** 
- **bug ID:** 
- **evidence link:** 

### REG-AI-008 — Reject whitespace-only name

- **ID:** REG-AI-008
- **origin:** AI-generated
- **technique:** EP whitespace
- **requirement/SEC reference:** FR-01
- **title:** Reject whitespace-only name
- **priority:** P1
- **preconditions:** Unique email absent
- **test data:** name="   "; remaining fields valid
- **request:** POST /api/register with whitespace-only name
- **execution steps:** Send; inspect error; verify email absent
- **expected status:** 400
- **expected headers/schema/body:** JSON error only
- **expected side effect:** No user created
- **cleanup:** None; delete unexpected row/reset
- **actual result:** Not executed
- **PASS/FAIL:** 
- **AI audit verdict:** 
- **audit reasoning:** 
- **bug ID:** 
- **evidence link:** 

### REG-AI-009 — Treat SQL metacharacters in name as literal data

- **ID:** REG-AI-009
- **origin:** AI-generated
- **technique:** SEC-05 parameterization
- **requirement/SEC reference:** SEC-05, FR-01
- **title:** Treat SQL metacharacters in name as literal data
- **priority:** P0
- **preconditions:** Unique email absent; seed users counted
- **test data:** name="Robert'); DROP TABLE users;--"; remaining fields valid
- **request:** POST /api/register with SQL payload in name
- **execution steps:** Send; inspect success; retrieve created user; verify seed users/login still work
- **expected status:** 200
- **expected headers/schema/body:** JSON exact success schema; no SQL error/detail
- **expected side effect:** One user created with literal name; users table and seed accounts unchanged
- **cleanup:** Delete returned user ID
- **actual result:** Not executed
- **PASS/FAIL:** 
- **AI audit verdict:** 
- **audit reasoning:** 
- **bug ID:** 
- **evidence link:** 

### REG-AI-010 — Persist name safely without proving XSS from API acceptance alone

- **ID:** REG-AI-010
- **origin:** AI-generated
- **technique:** Stored-XSS candidate
- **requirement/SEC reference:** SEC-04, FR-01
- **title:** Persist name safely without proving XSS from API acceptance alone
- **priority:** P1
- **preconditions:** Unique email absent; admin UI available for verification
- **test data:** name=<img src=x onerror=alert(1)>; remaining fields valid
- **request:** POST /api/register with inert XSS marker
- **execution steps:** Send; retrieve account; open rendering surface; inspect DOM and execution
- **expected status:** 200
- **expected headers/schema/body:** JSON exact success schema; payload not reflected in response
- **expected side effect:** One user may be created; marker must render as text and never execute
- **cleanup:** Delete returned user ID
- **actual result:** Not executed
- **PASS/FAIL:** 
- **AI audit verdict:** 
- **audit reasoning:** 
- **bug ID:** 
- **evidence link:** 

### REG-AI-011 — Reject missing email

- **ID:** REG-AI-011
- **origin:** AI-generated
- **technique:** EP required-field omission
- **requirement/SEC reference:** FR-01
- **title:** Reject missing email
- **priority:** P0
- **preconditions:** No target account needed
- **test data:** name valid; email omitted; valid matching passwords
- **request:** POST /api/register without email
- **execution steps:** Send; inspect error; compare user count
- **expected status:** 400
- **expected headers/schema/body:** JSON error only; no id/password/SQL detail
- **expected side effect:** No user created
- **cleanup:** None; remove unexpected row/reset
- **actual result:** Not executed
- **PASS/FAIL:** 
- **AI audit verdict:** 
- **audit reasoning:** 
- **bug ID:** 
- **evidence link:** 

### REG-AI-012 — Reject null email

- **ID:** REG-AI-012
- **origin:** AI-generated
- **technique:** EP null
- **requirement/SEC reference:** FR-01
- **title:** Reject null email
- **priority:** P1
- **preconditions:** User count baseline known
- **test data:** email=null; other fields valid
- **request:** POST /api/register with null email
- **execution steps:** Send; inspect error; compare user count
- **expected status:** 400
- **expected headers/schema/body:** JSON error only
- **expected side effect:** No user created
- **cleanup:** None; remove unexpected row/reset
- **actual result:** Not executed
- **PASS/FAIL:** 
- **AI audit verdict:** 
- **audit reasoning:** 
- **bug ID:** 
- **evidence link:** 

### REG-AI-013 — Reject non-string email

- **ID:** REG-AI-013
- **origin:** AI-generated
- **technique:** EP type
- **requirement/SEC reference:** FR-01
- **title:** Reject non-string email
- **priority:** P1
- **preconditions:** User count baseline known
- **test data:** email=123; other fields valid
- **request:** POST /api/register with numeric email
- **execution steps:** Send; inspect error; compare user count
- **expected status:** 400
- **expected headers/schema/body:** JSON error only
- **expected side effect:** No user created or coerced email
- **cleanup:** None; remove unexpected row/reset
- **actual result:** Not executed
- **PASS/FAIL:** 
- **AI audit verdict:** 
- **audit reasoning:** 
- **bug ID:** 
- **evidence link:** 

### REG-AI-014 — Reject empty email

- **ID:** REG-AI-014
- **origin:** AI-generated
- **technique:** BVA empty
- **requirement/SEC reference:** FR-01
- **title:** Reject empty email
- **priority:** P0
- **preconditions:** User count baseline known
- **test data:** email=""; other fields valid
- **request:** POST /api/register with empty email
- **execution steps:** Send; inspect error; compare user count
- **expected status:** 400
- **expected headers/schema/body:** JSON error only
- **expected side effect:** No user created
- **cleanup:** None; remove unexpected row/reset
- **actual result:** Not executed
- **PASS/FAIL:** 
- **AI audit verdict:** 
- **audit reasoning:** 
- **bug ID:** 
- **evidence link:** 

### REG-AI-015 — Reject email without at-sign

- **ID:** REG-AI-015
- **origin:** AI-generated
- **technique:** EP email format
- **requirement/SEC reference:** FR-01
- **title:** Reject email without at-sign
- **priority:** P0
- **preconditions:** Email string absent
- **test data:** email=user.example.test; other fields valid
- **request:** POST /api/register with invalid email format
- **execution steps:** Send; inspect error; verify value absent
- **expected status:** 400
- **expected headers/schema/body:** JSON error only
- **expected side effect:** No user created
- **cleanup:** None; remove unexpected row/reset
- **actual result:** Not executed
- **PASS/FAIL:** 
- **AI audit verdict:** 
- **audit reasoning:** 
- **bug ID:** 
- **evidence link:** 

### REG-AI-016 — Reject email with empty local part

- **ID:** REG-AI-016
- **origin:** AI-generated
- **technique:** BVA email local part
- **requirement/SEC reference:** FR-01
- **title:** Reject email with empty local part
- **priority:** P1
- **preconditions:** Email string absent
- **test data:** email=@example.test; other fields valid
- **request:** POST /api/register with empty local part
- **execution steps:** Send; inspect error; verify value absent
- **expected status:** 400
- **expected headers/schema/body:** JSON error only
- **expected side effect:** No user created
- **cleanup:** None; remove unexpected row/reset
- **actual result:** Not executed
- **PASS/FAIL:** 
- **AI audit verdict:** 
- **audit reasoning:** 
- **bug ID:** 
- **evidence link:** 

### REG-AI-017 — Reject email with empty domain

- **ID:** REG-AI-017
- **origin:** AI-generated
- **technique:** BVA email domain
- **requirement/SEC reference:** FR-01
- **title:** Reject email with empty domain
- **priority:** P1
- **preconditions:** Email string absent
- **test data:** email=user@; other fields valid
- **request:** POST /api/register with empty domain
- **execution steps:** Send; inspect error; verify value absent
- **expected status:** 400
- **expected headers/schema/body:** JSON error only
- **expected side effect:** No user created
- **cleanup:** None; remove unexpected row/reset
- **actual result:** Not executed
- **PASS/FAIL:** 
- **AI audit verdict:** 
- **audit reasoning:** 
- **bug ID:** 
- **evidence link:** 

### REG-AI-018 — Reject email padded with whitespace

- **ID:** REG-AI-018
- **origin:** AI-generated
- **technique:** EP normalization boundary
- **requirement/SEC reference:** FR-01
- **title:** Reject email padded with whitespace
- **priority:** P1
- **preconditions:** Trimmed and padded forms absent
- **test data:** email=" user@example.test "; other fields valid
- **request:** POST /api/register with surrounding spaces
- **execution steps:** Send; inspect response; query both exact and trimmed values
- **expected status:** 400
- **expected headers/schema/body:** JSON error only
- **expected side effect:** No account created under padded or silently altered identity
- **cleanup:** None; remove unexpected row/reset
- **actual result:** Not executed
- **PASS/FAIL:** 
- **AI audit verdict:** 
- **audit reasoning:** 
- **bug ID:** 
- **evidence link:** 

### REG-AI-019 — Reject duplicate registration without changing original account

- **ID:** REG-AI-019
- **origin:** AI-generated
- **technique:** State transition / duplicate
- **requirement/SEC reference:** FR-01
- **title:** Reject duplicate registration without changing original account
- **priority:** P0
- **preconditions:** Create first account successfully and capture ID
- **test data:** Repeat exact email with a different strong password
- **request:** POST /api/register for an existing email
- **execution steps:** 1 Create account; 2 retry same email; 3 inspect response; 4 count email; 5 login with original password
- **expected status:** 400 or 409 (spec gap)
- **expected headers/schema/body:** JSON error only; no new id; no DB/stack/password leakage
- **expected side effect:** Exactly one account remains; original ID/role/password behavior unchanged
- **cleanup:** Delete original account ID
- **actual result:** Not executed
- **PASS/FAIL:** 
- **AI audit verdict:** 
- **audit reasoning:** 
- **bug ID:** 
- **evidence link:** 

### REG-AI-020 — Reject SQL-injection-shaped email safely

- **ID:** REG-AI-020
- **origin:** AI-generated
- **technique:** SEC-05 + invalid EP
- **requirement/SEC reference:** SEC-05, FR-01
- **title:** Reject SQL-injection-shaped email safely
- **priority:** P0
- **preconditions:** Seed users count and login verified
- **test data:** email="' OR '1'='1'--"; other fields valid
- **request:** POST /api/register with injection-shaped invalid email
- **execution steps:** Send; inspect error; verify no enumeration/change; re-login seed user
- **expected status:** 400
- **expected headers/schema/body:** JSON error only; no SQL/schema/path details
- **expected side effect:** No user created; no existing user altered/disclosed
- **cleanup:** None; reset only if dirty
- **actual result:** Not executed
- **PASS/FAIL:** 
- **AI audit verdict:** 
- **audit reasoning:** 
- **bug ID:** 
- **evidence link:** 

### REG-AI-021 — Reject missing password

- **ID:** REG-AI-021
- **origin:** AI-generated
- **technique:** EP required-field omission
- **requirement/SEC reference:** FR-01
- **title:** Reject missing password
- **priority:** P0
- **preconditions:** Unique email absent
- **test data:** password omitted; confirmation present; name/email valid
- **request:** POST /api/register without password
- **execution steps:** Send; inspect error; verify email absent
- **expected status:** 400
- **expected headers/schema/body:** JSON error only; no id
- **expected side effect:** No user created
- **cleanup:** None; remove unexpected row/reset
- **actual result:** Not executed
- **PASS/FAIL:** 
- **AI audit verdict:** 
- **audit reasoning:** 
- **bug ID:** 
- **evidence link:** 

### REG-AI-022 — Reject null password

- **ID:** REG-AI-022
- **origin:** AI-generated
- **technique:** EP null
- **requirement/SEC reference:** FR-01
- **title:** Reject null password
- **priority:** P0
- **preconditions:** Unique email absent
- **test data:** password=null; confirmation=null; name/email valid
- **request:** POST /api/register with null password
- **execution steps:** Send; inspect error; verify email absent
- **expected status:** 400
- **expected headers/schema/body:** JSON error only; raw password absent
- **expected side effect:** No user created
- **cleanup:** None; remove unexpected row/reset
- **actual result:** Not executed
- **PASS/FAIL:** 
- **AI audit verdict:** 
- **audit reasoning:** 
- **bug ID:** 
- **evidence link:** 

### REG-AI-023 — Reject non-string password

- **ID:** REG-AI-023
- **origin:** AI-generated
- **technique:** EP type
- **requirement/SEC reference:** FR-01
- **title:** Reject non-string password
- **priority:** P1
- **preconditions:** Unique email absent
- **test data:** password=12345678; confirm_password=12345678
- **request:** POST /api/register with numeric passwords
- **execution steps:** Send; inspect error; verify email absent
- **expected status:** 400
- **expected headers/schema/body:** JSON error only
- **expected side effect:** No user created or coerced password
- **cleanup:** None; remove unexpected row/reset
- **actual result:** Not executed
- **PASS/FAIL:** 
- **AI audit verdict:** 
- **audit reasoning:** 
- **bug ID:** 
- **evidence link:** 

### REG-AI-024 — Reject seven-character otherwise complex password

- **ID:** REG-AI-024
- **origin:** AI-generated
- **technique:** BVA length below minimum
- **requirement/SEC reference:** FR-01
- **title:** Reject seven-character otherwise complex password
- **priority:** P0
- **preconditions:** Unique email absent
- **test data:** password=Aa1!abc (7); confirmation matches
- **request:** POST /api/register
- **execution steps:** Count characters; send; inspect error; verify absent
- **expected status:** 400
- **expected headers/schema/body:** JSON error only
- **expected side effect:** No user created
- **cleanup:** None; remove unexpected row/reset
- **actual result:** Not executed
- **PASS/FAIL:** 
- **AI audit verdict:** 
- **audit reasoning:** 
- **bug ID:** 
- **evidence link:** 

### REG-AI-025 — Accept eight-character strong password

- **ID:** REG-AI-025
- **origin:** AI-generated
- **technique:** BVA minimum length
- **requirement/SEC reference:** FR-01
- **title:** Accept eight-character strong password
- **priority:** P0
- **preconditions:** Unique email absent
- **test data:** password=Aa1!abcd (8); confirmation matches
- **request:** POST /api/register
- **execution steps:** Count characters; send; inspect exact response; login
- **expected status:** 200
- **expected headers/schema/body:** JSON exact success schema {message,id}; no password/token
- **expected side effect:** One normal user created; login succeeds
- **cleanup:** Delete returned user ID
- **actual result:** Not executed
- **PASS/FAIL:** 
- **AI audit verdict:** 
- **audit reasoning:** 
- **bug ID:** 
- **evidence link:** 

### REG-AI-026 — Reject password without uppercase letter

- **ID:** REG-AI-026
- **origin:** AI-generated
- **technique:** EP password composition
- **requirement/SEC reference:** FR-01
- **title:** Reject password without uppercase letter
- **priority:** P0
- **preconditions:** Unique email absent
- **test data:** password=aa1!abcd; confirmation matches
- **request:** POST /api/register
- **execution steps:** Send; inspect error; verify email absent
- **expected status:** 400
- **expected headers/schema/body:** JSON error only
- **expected side effect:** No user created
- **cleanup:** None; remove unexpected row/reset
- **actual result:** Not executed
- **PASS/FAIL:** 
- **AI audit verdict:** 
- **audit reasoning:** 
- **bug ID:** 
- **evidence link:** 

### REG-AI-027 — Reject password without lowercase letter

- **ID:** REG-AI-027
- **origin:** AI-generated
- **technique:** EP password composition
- **requirement/SEC reference:** FR-01
- **title:** Reject password without lowercase letter
- **priority:** P0
- **preconditions:** Unique email absent
- **test data:** password=AA1!ABCD; confirmation matches
- **request:** POST /api/register
- **execution steps:** Send; inspect error; verify email absent
- **expected status:** 400
- **expected headers/schema/body:** JSON error only
- **expected side effect:** No user created
- **cleanup:** None; remove unexpected row/reset
- **actual result:** Not executed
- **PASS/FAIL:** 
- **AI audit verdict:** 
- **audit reasoning:** 
- **bug ID:** 
- **evidence link:** 

### REG-AI-028 — Reject password without digit

- **ID:** REG-AI-028
- **origin:** AI-generated
- **technique:** EP password composition
- **requirement/SEC reference:** FR-01
- **title:** Reject password without digit
- **priority:** P0
- **preconditions:** Unique email absent
- **test data:** password=Aa!bcdef; confirmation matches
- **request:** POST /api/register
- **execution steps:** Send; inspect error; verify email absent
- **expected status:** 400
- **expected headers/schema/body:** JSON error only
- **expected side effect:** No user created
- **cleanup:** None; remove unexpected row/reset
- **actual result:** Not executed
- **PASS/FAIL:** 
- **AI audit verdict:** 
- **audit reasoning:** 
- **bug ID:** 
- **evidence link:** 

### REG-AI-029 — Reject password without special character

- **ID:** REG-AI-029
- **origin:** AI-generated
- **technique:** EP password composition
- **requirement/SEC reference:** FR-01
- **title:** Reject password without special character
- **priority:** P0
- **preconditions:** Unique email absent
- **test data:** password=Aa1bcdef; confirmation matches
- **request:** POST /api/register
- **execution steps:** Send; inspect error; verify email absent
- **expected status:** 400
- **expected headers/schema/body:** JSON error only
- **expected side effect:** No user created
- **cleanup:** None; remove unexpected row/reset
- **actual result:** Not executed
- **PASS/FAIL:** 
- **AI audit verdict:** 
- **audit reasoning:** 
- **bug ID:** 
- **evidence link:** 

### REG-AI-030 — Reject password whose only special character is outside allowed set

- **ID:** REG-AI-030
- **origin:** AI-generated
- **technique:** EP allowed character set
- **requirement/SEC reference:** FR-01
- **title:** Reject password whose only special character is outside allowed set
- **priority:** P1
- **preconditions:** Unique email absent
- **test data:** password=Aa1#bcde; confirmation matches
- **request:** POST /api/register
- **execution steps:** Send; inspect error; verify email absent
- **expected status:** 400
- **expected headers/schema/body:** JSON error only
- **expected side effect:** No user created
- **cleanup:** None; remove unexpected row/reset
- **actual result:** Not executed
- **PASS/FAIL:** 
- **AI audit verdict:** 
- **audit reasoning:** 
- **bug ID:** 
- **evidence link:** 

### REG-AI-031 — Accept strong password using ampersand from allowed set

- **ID:** REG-AI-031
- **origin:** AI-generated
- **technique:** EP allowed special
- **requirement/SEC reference:** FR-01
- **title:** Accept strong password using ampersand from allowed set
- **priority:** P1
- **preconditions:** Unique email absent
- **test data:** password=Aa1&bcde; confirmation matches
- **request:** POST /api/register
- **execution steps:** Send; inspect exact response; login
- **expected status:** 200
- **expected headers/schema/body:** JSON exact success schema; no password
- **expected side effect:** One normal user created; login succeeds
- **cleanup:** Delete returned user ID
- **actual result:** Not executed
- **PASS/FAIL:** 
- **AI audit verdict:** 
- **audit reasoning:** 
- **bug ID:** 
- **evidence link:** 

### REG-AI-032 — Reject missing password confirmation

- **ID:** REG-AI-032
- **origin:** AI-generated
- **technique:** EP required-field omission
- **requirement/SEC reference:** FR-01
- **title:** Reject missing password confirmation
- **priority:** P0
- **preconditions:** Unique email absent
- **test data:** valid password; confirm_password omitted
- **request:** POST /api/register without confirmation
- **execution steps:** Send; inspect error; verify email absent
- **expected status:** 400
- **expected headers/schema/body:** JSON error only
- **expected side effect:** No user created
- **cleanup:** None; remove unexpected row/reset
- **actual result:** Not executed
- **PASS/FAIL:** 
- **AI audit verdict:** 
- **audit reasoning:** 
- **bug ID:** 
- **evidence link:** 

### REG-AI-033 — Reject null password confirmation

- **ID:** REG-AI-033
- **origin:** AI-generated
- **technique:** EP null
- **requirement/SEC reference:** FR-01
- **title:** Reject null password confirmation
- **priority:** P1
- **preconditions:** Unique email absent
- **test data:** valid password; confirm_password=null
- **request:** POST /api/register
- **execution steps:** Send; inspect error; verify email absent
- **expected status:** 400
- **expected headers/schema/body:** JSON error only
- **expected side effect:** No user created
- **cleanup:** None; remove unexpected row/reset
- **actual result:** Not executed
- **PASS/FAIL:** 
- **AI audit verdict:** 
- **audit reasoning:** 
- **bug ID:** 
- **evidence link:** 

### REG-AI-034 — Reject mismatched password confirmation

- **ID:** REG-AI-034
- **origin:** AI-generated
- **technique:** State/relational validation
- **requirement/SEC reference:** FR-01
- **title:** Reject mismatched password confirmation
- **priority:** P0
- **preconditions:** Unique email absent
- **test data:** password=Valid123!; confirm_password=Different123!
- **request:** POST /api/register
- **execution steps:** Send; inspect error; verify email absent; attempt login must fail
- **expected status:** 400
- **expected headers/schema/body:** JSON error only; neither password echoed
- **expected side effect:** No user created
- **cleanup:** None; remove unexpected row/reset
- **actual result:** Not executed
- **PASS/FAIL:** 
- **AI audit verdict:** 
- **audit reasoning:** 
- **bug ID:** 
- **evidence link:** 

### REG-AI-035 — Reject empty request body

- **ID:** REG-AI-035
- **origin:** AI-generated
- **technique:** Malformed request / empty body
- **requirement/SEC reference:** FR-01
- **title:** Reject empty request body
- **priority:** P0
- **preconditions:** User count baseline known
- **test data:** Empty body with application/json
- **request:** POST /api/register with no body
- **execution steps:** Send raw request; inspect response/content type; compare user count
- **expected status:** 400
- **expected headers/schema/body:** Safe JSON error {error:string}; no stack/path/id
- **expected side effect:** No user created
- **cleanup:** None; reset if dirty
- **actual result:** Not executed
- **PASS/FAIL:** 
- **AI audit verdict:** 
- **audit reasoning:** 
- **bug ID:** 
- **evidence link:** 

### REG-AI-036 — Reject truncated JSON without leaking parser internals

- **ID:** REG-AI-036
- **origin:** AI-generated
- **technique:** Malformed JSON
- **requirement/SEC reference:** FR-01
- **title:** Reject truncated JSON without leaking parser internals
- **priority:** P0
- **preconditions:** User count baseline known
- **test data:** Raw body={"name":"A"
- **request:** POST /api/register application/json
- **execution steps:** Send raw truncated bytes; inspect full body/headers; send valid health request after
- **expected status:** 400
- **expected headers/schema/body:** Safe structured JSON error; no HTML stack, source path or parser trace
- **expected side effect:** No user created; service remains available
- **cleanup:** None
- **actual result:** Not executed
- **PASS/FAIL:** 
- **AI audit verdict:** 
- **audit reasoning:** 
- **bug ID:** 
- **evidence link:** 

### REG-AI-037 — Reject top-level JSON array

- **ID:** REG-AI-037
- **origin:** AI-generated
- **technique:** Schema top-level type
- **requirement/SEC reference:** FR-01
- **title:** Reject top-level JSON array
- **priority:** P1
- **preconditions:** User count baseline known
- **test data:** [{"name":"A","email":"a@example.test","password":"Aa1!abcd","confirm_password":"Aa1!abcd"}]
- **request:** POST /api/register application/json
- **execution steps:** Send array; inspect error; compare user count
- **expected status:** 400
- **expected headers/schema/body:** JSON error only
- **expected side effect:** No user created
- **cleanup:** None; remove unexpected row/reset
- **actual result:** Not executed
- **PASS/FAIL:** 
- **AI audit verdict:** 
- **audit reasoning:** 
- **bug ID:** 
- **evidence link:** 

### REG-AI-038 — Reject JSON-looking body sent as text/plain

- **ID:** REG-AI-038
- **origin:** AI-generated
- **technique:** Content-type negative
- **requirement/SEC reference:** FR-01
- **title:** Reject JSON-looking body sent as text/plain
- **priority:** P1
- **preconditions:** Unique email absent
- **test data:** Valid JSON bytes; Content-Type text/plain
- **request:** POST /api/register with wrong media type
- **execution steps:** Send; inspect status/content type; verify email absent
- **expected status:** 400 or 415 (spec gap)
- **expected headers/schema/body:** Safe JSON error preferred; no success fields/internal detail
- **expected side effect:** No user created
- **cleanup:** None; remove unexpected row/reset
- **actual result:** Not executed
- **PASS/FAIL:** 
- **AI audit verdict:** 
- **audit reasoning:** 
- **bug ID:** 
- **evidence link:** 

### REG-AI-039 — Prevent registration from assigning admin identity or chosen ID

- **ID:** REG-AI-039
- **origin:** AI-generated
- **technique:** Mass assignment / role escalation
- **requirement/SEC reference:** SEC-03, SEC-06, FR-01
- **title:** Prevent registration from assigning admin identity or chosen ID
- **priority:** P0
- **preconditions:** Unique email absent; admin users endpoint available
- **test data:** Valid fields plus role=admin,is_admin=true,id=1,permissions=[*]
- **request:** POST /api/register with unexpected privilege fields
- **execution steps:** Send; inspect exact response; login; inspect JWT/admin users record
- **expected status:** 200 if unknown fields ignored; 400 if strict schema rejects
- **expected headers/schema/body:** If accepted: exact success schema only; never echo privilege fields
- **expected side effect:** At most one normal user; generated ID server-owned; role must not be admin
- **cleanup:** Delete returned user ID
- **actual result:** Not executed
- **PASS/FAIL:** 
- **AI audit verdict:** 
- **audit reasoning:** 
- **bug ID:** 
- **evidence link:** 

### REG-AI-040 — Store password non-plaintext and never expose credential material

- **ID:** REG-AI-040
- **origin:** AI-generated
- **technique:** SEC-01 + sensitive schema
- **requirement/SEC reference:** SEC-01, FR-01
- **title:** Store password non-plaintext and never expose credential material
- **priority:** P0
- **preconditions:** Controlled local DB inspection permitted; unique email absent
- **test data:** Valid account with distinctive password=Audit9!Secret; matching confirmation
- **request:** POST /api/register then inspect response and controlled stored credential
- **execution steps:** 1 Register; 2 inspect raw response; 3 inspect stored password representation; 4 login; 5 inspect admin API response
- **expected status:** 200
- **expected headers/schema/body:** Exact {message,id}; password, confirmation, hash, salt, token, reset_token and role absent
- **expected side effect:** Exactly one user; stored credential is salted hash not raw password; admin listing does not expose credential
- **cleanup:** Delete returned user ID
- **actual result:** Not executed
- **PASS/FAIL:** 
- **AI audit verdict:** 
- **audit reasoning:** 
- **bug ID:** 
- **evidence link:** 

