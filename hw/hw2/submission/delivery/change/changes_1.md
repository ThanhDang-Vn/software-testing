# Changes Log — feature_A (FR-02)

> Template: mỗi file có 1 section. Mỗi version ghi **review issues → changes applied**.

---

## 03_domain_testcases: v1 → v2

### Review Issues (from v1)

| # | Issue | Severity | Type |
|---|---|---|---|
| 1 | DT-A-002 (case mismatch) và DT-A-008 (email not in DB): cùng code path, cùng outcome → `401`, no counter | High | Redundancy |
| 2 | DT-A-003 (no @) và DT-A-004 (no domain): cùng invalid format behavior, cùng outcome → `401`, no counter | High | Redundancy |
| 3 | DT-A-006 (email too long): expected `401` hoặc `500` — không xác định; không có behavioral boundary → không phải domain TC | Medium | Misclassification |
| 4 | DT-A-009, DT-A-010, DT-A-011: cả 3 đều là wrong password → `401`, counter +2. Chỉ cần 1 representative | High | Redundancy |
| 5 | DT-A-015 (counter 0→2): subsumed bởi DT-A-016 (counter 2→4, LOCK). Không thêm hành vi mới | Medium | Redundancy |
| 6 | DT-A-018 (locked + wrong pw): cùng behavior với DT-A-013 (locked + correct pw → 403). Lock check xảy ra trước password check | High | Redundancy |

### Changes Applied (v2)

| # | Change | Addresses |
|---|---|---|
| 1 | Gộp DT-A-002 vào DT-A-008 (same user-not-found behavior) | Issue #1 |
| 2 | Gộp DT-A-004 vào DT-A-003 (same invalid format behavior) | Issue #2 |
| 3 | Reclassify DT-A-006 sang robustness testing, bỏ khỏi domain TCs | Issue #3 |
| 4 | Gộp DT-A-009, DT-A-011 vào DT-A-010 (1 representative cho wrong password) | Issue #4 |
| 5 | Bỏ DT-A-015 — threshold crossing DT-A-016 đã bao gồm counter increment | Issue #5 |
| 6 | Gộp DT-A-018 vào DT-A-013 (locked → 403 bất kể password) | Issue #6 |
| 7 | Giữ nguyên TC IDs của các TCs còn lại để traceability | Cleanup |
| 8 | Tổng: 18 TC → **11 TC**. Coverage: 15/15 active ECs | Result |

---

## 06_detailed_testcases: v1 → v2

### Review Issues (from v1)

| # | Issue | Severity | Type |
|---|---|---|---|
| 1 | BVA section gồm 27 TC nhưng phần lớn test email/password length — không có behavioral boundary trong code | High | Spec Misinterpretation |
| 2 | Các TC BVA-A-001→010 (email/password length) không có expected behavior khác nhau → không phải BVA đúng nghĩa | High | Spec Misinterpretation |
| 3 | Nhiều TC BVA thừa: INT_MAX, -1 corruption, far past, far future → thuộc stress/edge testing, không BVA | Medium | Overgeneralization |

### Changes Applied (v2)

| # | Change | Addresses |
|---|---|---|
| 1 | Bỏ toàn bộ BVA email length (BVA-A-001→006) và password length (BVA-A-007→010) | Issue #1, #2 |
| 2 | Giữ lại chỉ `login_attempts` threshold (2, 3, 4) và `locked_until` time (now-1, now, now+1) | Issue #3 |
| 3 | BVA section: 27 TC → 6 TC | Cleanup |
| 4 | Tổng: 53 TC → **32 TC** (18 DT + 6 BVA + 8 UI) | Cleanup |

---

## 05_bva_testcases: v1 → v2

### Review Issues (from v1)

| # | Issue | Severity | Type |
|---|---|---|---|
| 1 | 10 TC đầu test độ dài email/password — backend không enforce constraint nào nên không có behavioral boundary | High | Spec Misinterpretation |
| 2 | 5 TC supplementary (non-BVA) đặt trong file BVA — không thuộc phạm vi BVA | Medium | Spec Misinterpretation |
| 3 | Các TC counter: INT_MAX, -1 corruption không có ý nghĩa BVA thực tế | Medium | Overgeneralization |

### Changes Applied (v2)

| # | Change | Addresses |
|---|---|---|
| 1 | Bỏ toàn bộ email/password length TCs (BVA-A-001→010) | Issue #1 |
| 2 | Bỏ supplementary non-BVA TCs (BVA-A-025→027) | Issue #2 |
| 3 | Bỏ các TC counter extreme (INT_MAX, -1) và locked_until extreme (far past, far future) | Issue #3 |
| 4 | Giữ lại 6 TC: counter (stored=2, 3, 4) + locked_until (now-1, now, now+1) | Core |
| 5 | Renumber: BVA-A-001 → BVA-A-006 | Cleanup |

---

## 04_bva_table: v1 → v2

### Review Issues (from v1)

| # | Issue | Severity | Type |
|---|---|---|---|
| 1 | Field 1 (email length) và Field 2 (password length) không có behavioral boundary trong code — backend không enforce bất kỳ length constraint nào | High | Spec Misinterpretation |
| 2 | Field 3 (login_attempts) có quá nhiều điểm (0, 1, 2, 3, 4, INT_MAX, -1) — chỉ cần 3 điểm quanh threshold | Medium | Overgeneralization |
| 3 | Field 4 (locked_until) có quá nhiều điểm (NULL, past, now-1, now, now+1, future, DB max) — chỉ cần 3 điểm quanh now | Medium | Overgeneralization |

### Changes Applied (v2)

| # | Change | Addresses |
|---|---|---|
| 1 | Bỏ hoàn toàn Field 1 (email length) và Field 2 (password length) | Issue #1 |
| 2 | Field 3: thu gọn còn 3 điểm — threshold-1 (stored=2), threshold (stored=3), threshold+1 (stored=4) | Issue #2 |
| 3 | Field 4: thu gọn còn 3 điểm — now-1, now, now+1 | Issue #3 |
| 4 | Tổng: 4 fields → 2 fields, 20+ boundary points → 6 boundary points | Cleanup |

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

---

## 03_domain_testcases_v1: hotfix

### Changes Applied

| # | Change | Reason |
|---|---|---|
| 1 | DT-A-013: status code `401` → `403` cho locked account | Khớp với code: lock check trả về 403, không phải 401 |
| 2 | DT-A-018: status code `401` → `403` cho locked account | Tương tự #1 |

---

## 06_detailed_testcases: v0 → v1

### Review Issues (from v0)

| # | Issue | Severity | Type |
|---|---|---|---|
| 1 | Domain TCs tự thêm 4 TC không có trong source 03 (DT-A-009 trùng happy path, 014 trùng 001, 016/017 không map) | High | Inconsistency |
| 2 | DT-A-006 trong source 03 = email quá dài (EC-E6) nhưng 06 v0 map thành whitespace → thiếu EC-E6 | High | Missing Case |
| 3 | DT-A-013/018: dùng `401` cho locked account, phải là `403` | High | Logic Error |
| 4 | BVA thiếu BVA-A-012 (counter=1, wrong pw → exact threshold LOCK) | High | Missing Case |
| 5 | BVA thiếu BVA-A-013 (counter=2, correct pw → 200, reset) | High | Missing Case |
| 6 | BVA-A-016: test counter=4 + locked=future → bị lock che mất counter boundary | High | Logic Error |
| 7 | BVA-A-009 nominal + BVA-A-019 NULL: đã gộp vào BVA-A-003 ở 05_v1 nhưng 06 v0 vẫn giữ | Medium | Inconsistency |
| 8 | "Special Cases" section không phải BVA, cần đổi tên | Medium | Spec Misinterpretation |
| 9 | Thống kê sai: Domain 22 + BVA 28 = 50, thực tế phải là Domain 18 + BVA 27 = 45 | Medium | Inconsistency |

### Changes Applied (v1)

| # | Change | Addresses |
|---|---|---|
| 1 | Xóa 4 TC Domain trùng/không có trong source, sync đúng 18 TC từ `03_domain_testcases_v1.md` | Issue #1 |
| 2 | Thêm DT-A-006 = email quá dài (EC-E6), khớp với source 03_v1 | Issue #2 |
| 3 | DT-A-013, DT-A-018: sửa `401` → `403` cho locked account | Issue #3 |
| 4 | Thêm BVA-A-012 (counter=1, wrong pw → counter 1→3, exact threshold, LOCK triggered) | Issue #4 |
| 5 | Thêm BVA-A-013 (counter=2, correct pw → 200, counter reset → 0) | Issue #5 |
| 6 | BVA-A-016: đổi thành counter=4, locked=NULL, wrong pw → counter 4→6, re-lock triggered | Issue #6 |
| 7 | Xóa BVA-A-009 nominal + BVA-A-019 NULL (đã gộp vào BVA-A-003) | Issue #7 |
| 8 | Đổi "Special Cases" → "Supplementary Tests (non-BVA)" + disclaimer categorical values | Issue #8 |
| 9 | Cập nhật thống kê: Domain 18 + BVA 27 = **45 TC** tổng, thêm cột Source | Issue #9 |

---

## 06_detailed_testcases_v1: hotfix — UI Validation

### Review Issues

| # | Issue | Severity | Type |
|---|---|---|---|
| 1 | FR-22 UI requirements (input type, label, heading) identified in 01_spec_analysis nhưng không có TC nào cover | High | Missing Case |

### Changes Applied

| # | Change | Addresses |
|---|---|---|
| 1 | Thêm Section C: UI Validation Test Cases (UI-A-001 → UI-A-008) | Issue #1 |
| 2 | UI-A-001: input type="email" thay vì type="text" | FR-22 |
| 3 | UI-A-002: input type="password" thay vì type="text" | FR-22 |
| 4 | UI-A-003: label "Email" thay vì "Username" | FR-22 |
| 5 | UI-A-004: heading "Đăng nhập" thay vì "Đăng Ký" | FR-22 |
| 6 | UI-A-005: button text Vietnamese consistency | FR-22 |
| 7 | UI-A-006: lock error message visible khi bị khóa | FR-22 |
| 8 | UI-A-007: error message position above submit button | FR-22 |
| 9 | UI-A-008: required field asterisks | FR-22 |
| 10 | Cập nhật thống kê: 45 → **53 TC** (18 DT + 27 BVA + 8 UI) | Cleanup |
