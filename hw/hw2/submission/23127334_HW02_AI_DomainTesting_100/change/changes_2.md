# Changes Log — feature_B (FR-11 — Xem Lịch sử Đơn hàng)

> Template: mỗi file có 1 section. Mỗi version ghi **review issues → changes applied**.

---

## Comprehensive Review & Enhancement (Initial → v1 Enhanced)

### Critical Issues Identified & Fixed

| # | Issue | Severity | Category | Fix |
|---|---|---|---|---|
| 1 | DT-B-008/009 wrong expected result (returns message, not order object) | Critical | Logic Error | Changed expected to: `{ message: "Order canceled successfully" }` + added DB verify step |
| 2 | DT-B-001 response structure validation missing | High | Missing Case | Added fields validation: id, user_id, total_amount, status, shipping_address, created_at; verify no password leakage |
| 3 | No UI test cases (8 FR-22 requirements uncovered) | Critical | Missing Case | Added 9 UI-B tests (Vietnamese labels, colors, formatting, button visibility) |
| 4 | DT-B-014 duplicates BVA-B-001 | Medium | Duplication | Removed, consolidated to BVA |
| 5 | DB error handling not tested | High | Missing Case | Added DT-B-016 (simulate DB failure, expect 500) |
| 6 | Unauthorized access (no login) not tested | High | Missing Case | Added DT-B-017 (no JWT, verify "Vui lòng đăng nhập") |
| 7 | NULL field handling not tested | High | Missing Case | Added DT-B-018/019 (NULL created_at, NULL total_amount) |
| 8 | Concurrent cancel requests not tested | Medium | Missing Case | Added BVA-B-005 (2 simultaneous cancel, verify idempotency) |
| 9 | DESC ordering not verified in assertions | Medium | Missing Case | Enhanced BVA-B-003/004 with order sequence verification |

### Changes by File

#### 02_domain_table.md
- Added 5 new EC: Response/Fields validation (3 invalid), Error Handling (1 valid, 1 invalid)
- Updated coverage: 13 → 19 EC total

#### 05_bva_testcases.md
- Refocused: kept list size (4 TC) + concurrency (1 TC) + ordering (1 TC)
- Removed: orderId numeric boundaries (not business-critical)
- Updated total: 15 → 6 BVA TC

#### 06_detailed_testcases.md
- **Domain:** 15 → 20 TC (added DT-B-016, 017, 018, 019 + enhanced existing)
- **BVA:** 4 → 6 TC (added BVA-B-005, 006 + enhanced existing)
- **UI:** 0 → 9 TC (new comprehensive UI coverage)
- **Total:** 19 → 35 TC

### Key Enhancements

✅ **Fixed Expected Results:** DT-B-008/009 now match actual CODE behavior (message response)
✅ **Response Validation:** DT-B-001 validates full response structure + fields
✅ **UI Coverage:** 9 new tests covering all FR-22 UI requirements
✅ **Error Handling:** DT-B-016/017 test error paths and unauthorized access
✅ **Robustness:** DT-B-018/019 test NULL field handling, BVA-B-005 tests concurrency
✅ **Ordering Verification:** BVA-B-003/004/006 validate DESC order by ID
✅ **Eliminated Duplicates:** Removed DT-B-014 (was duplicate of BVA-B-001)
