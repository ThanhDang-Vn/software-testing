# Changes Log — feature_A (FR-02)

> Template: mỗi file có 1 section. Mỗi version ghi **review issues → changes applied**.

---

## 03_domain_testcases: v0 → v1

### Review Issues (from v0)

| # | Issue | Severity | Type |
|---|---|---|---|
| 1 | DT-A-016: EC-LA-I1 đánh "Negative" nhưng expected 200 OK (counter=4, locked=NULL, correct pw) | Critical | Logic Error |
| 2 | DT-A-001, 009, 014, 017: 4 TC positive trùng hoàn toàn (cùng input, cùng expected) | High | Inconsistency |
| 3 | DT-A-021, 022: vi phạm one-at-a-time (test 2 biến cùng lúc) | High | Logic Error |
| 4 | EC-E-I3, EC-E-I5: có trong domain table nhưng không có TC → 19/21 coverage | High | Missing Case |
| 5 | DT-A-020: không ghi rõ counter có tăng không khi account locked | Medium | Ambiguity |

### Changes Applied (v1)

| # | Change | Addresses |
|---|---|---|
| 1 | Cấu trúc lại: thêm EC Summary, Test Matrix, gộp state ECs (EC-S1/S2/S3) | Tổng thể |
| 2 | Gộp 4 TC positive trùng → 1 base TC (DT-A-001) cover EC-E1 + EC-P1 + EC-S1 | Issue #2 |
| 3 | Sửa DT-A-016 → test state transition (counter 2→4, trigger lock) với wrong pw | Issue #1 |
| 4 | Redesign 21 EC → 16 EC, tất cả có TC. Coverage 16/16 (100%) | Issue #4 |
| 5 | Tách DT-A-021/022 sang section Supplementary Test Cases | Issue #3 |
| 6 | Bổ sung expected result chi tiết (403, counter behavior khi locked) | Issue #5 |
| 7 | Renumber liên tục DT-A-001 → DT-A-018 | Cleanup |

---

## 04_bva_table: v0 → v1

### Review Issues (from v0)

| # | Issue | Severity | Type |
|---|---|---|---|
| 1 | `locked_until` Now-1 = `now()-1s` ghi "still locked" + expected 403, nhưng thực tế đã EXPIRED → phải là 200 | Critical | Logic Error |
| 2 | `login_attempts` Min+1 = 1 ghi "After 1st wrong password" — sai, value 1 unreachable; behavior mô tả sai (ghi "still unlocked" nhưng 1+2=3 → LOCK) | High | Inconsistency |
| 3 | `login_attempts` trộn lẫn stored value vs post-increment check value, không clarify | High | Ambiguity |
| 4 | Email/Password length BVA: backend không enforce → không có behavioral boundary thực tế | Medium | Overgeneralization |
| 5 | Summary table sai boundary count (email: 3→4, login_attempts: 4→5) | Low | Inconsistency |

### Changes Applied (v1)

| # | Change | Addresses |
|---|---|---|
| 1 | Now-1 → "Vừa hết hạn 1 giây trước", Lock Status = Expired (unlocked), Expected = `200` | Issue #1 |
| 2 | Min+1 = 1: sửa description "chỉ đạt được qua DB manipulation", behavior sửa thành "1+2=3 → LOCK" | Issue #2 |
| 3 | Thêm note: "Lock trigger check trên `newAttempts = stored + 2`. Boundary thực tế: `stored >= 1`" | Issue #3 |
| 4 | Thêm disclaimer cho email & password: "Backend không enforce length limit. Boundaries là theoretical." | Issue #4 |
| 5 | Sửa count: email 3→4, login_attempts 4→5 | Issue #5 |

---

## 05_bva_testcases: v0 → v1

### Review Issues (from v0)

| # | Issue | Severity | Type |
|---|---|---|---|
| 1 | BVA-A-022: kế thừa lỗi từ 04 — `now()-1s` expected 403 nhưng thực tế 200 (expired) | Critical | Logic Error |
| 2 | BVA-A-016: test counter=4 + locked=future → 403 do lock, không phải do counter. Không test được boundary counter | High | Logic Error |
| 3 | BVA-A-013 (counter=1): chỉ ghi correct pw → 200, thiếu wrong pw → 1+2=3 → LOCK (exact threshold) | High | Missing Case |
| 4 | BVA-A-003, 009, 012, 019: 4 TC nominal/min trùng hoàn toàn (happy path × 4) | Medium | Inconsistency |
| 5 | Special Cases (BVA-A-026~028): không phải BVA (categorical, không phải ordered boundary) | Medium | Spec Misinterpretation |
| 6 | BVA-A-014: gộp 2 scenario (correct pw + wrong pw) vào 1 TC, không executable | Medium | Ambiguity |

### Changes Applied (v1)

| # | Change | Addresses |
|---|---|---|
| 1 | BVA-A-021 (was 022): sửa `now()-1s` → expected `200` (expired), label "Just after expiry" | Issue #1 |
| 2 | BVA-A-016: đổi thành counter=4, locked=NULL, wrong pw → test re-lock qua counter boundary | Issue #2 |
| 3 | Tách BVA-A-013 (v0) → BVA-A-011 (counter=1, correct pw) + BVA-A-012 (counter=1, wrong pw → exact threshold LOCK) | Issue #3 |
| 4 | Gộp 4 TC nominal trùng → 1 base TC (BVA-A-003), note covers 4 field nominals | Issue #4 |
| 5 | Đổi "Special Cases" → "Supplementary Tests (non-BVA)" + disclaimer categorical | Issue #5 |
| 6 | Tách BVA-A-014 (v0) → BVA-A-013 (correct pw) + BVA-A-014 (wrong pw → lock) | Issue #6 |
| 7 | Xóa password nominal TC trùng, tổng từ 28 → 27 cases | Cleanup |
| 8 | Thêm note DB manipulation cho các TC unreachable in normal flow (011, 012, 015, 018) | Clarity |
