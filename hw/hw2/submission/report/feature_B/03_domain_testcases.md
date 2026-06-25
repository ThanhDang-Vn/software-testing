# 03 — Domain Test Cases: feature_B (FR-11 — Xem Lịch sử Đơn hàng)

> **Scope:** Domain test case từ equivalence classes. One-at-a-time cho invalid.

---

## Test Matrix

> **Default values:** 
> - JWT: Valid token (from logged-in user)
> - User: test@eshop.com
> - Orders in DB: Multiple orders with different statuses

| TC ID | Test Field | EC | Type | Input | Expected |
| --- | --- | --- | --- | --- | --- |
| DT-B-001 | JWT (valid) | EC-T-V1 | Positive | GET /api/orders/my-orders + valid token | `200`, orders array (may be empty) |
| DT-B-002 | JWT (missing) | EC-T-I1 | Negative | GET /api/orders/my-orders without token | `401 Unauthorized` |
| DT-B-003 | JWT (expired) | EC-T-I2 | Negative | GET /api/orders/my-orders + expired token | `401 Unauthorized` |
| DT-B-004 | JWT (malformed) | EC-T-I3 | Negative | GET /api/orders/my-orders + invalid token | `401 Unauthorized` |
| DT-B-005 | orderId (valid) | EC-O-V1 | Positive | PUT /api/orders/1/cancel (order belongs to user) | `200`, status → canceled |
| DT-B-006 | orderId (non-existent) | EC-O-I1 | Negative | PUT /api/orders/99999/cancel | `404 Order not found` |
| DT-B-007 | orderId (different user) | EC-O-I2 | Negative | PUT /api/orders/5/cancel (belongs to admin) | `404 Order not found` (security isolation) |
| DT-B-008 | orderId (invalid format) | EC-O-I3 | Negative | PUT /api/orders/abc/cancel | `400 Bad request` or `404` |
| DT-B-009 | status = pending | EC-S-V1 | Positive | Cancel order with status=pending | `200`, cancel allowed |
| DT-B-010 | status = confirmed | EC-S-V2 | Positive | Cancel order with status=confirmed | `200`, cancel allowed |
| DT-B-011 | status = shipping | EC-S-V3 | Negative (BUG case) | Cancel order with status=shipping | **ACTUAL:** `200` (cancel allowed). **EXPECTED per SPEC:** `400` (User cannot cancel) |
| DT-B-012 | status = delivered | EC-S-I1 | Negative | Cancel order with status=delivered | `400 "Cannot cancel this order"` |
| DT-B-013 | status = canceled | EC-S-I2 | Negative | Cancel order with status=canceled | `400 "Cannot cancel this order"` |
| DT-B-014 | User isolation (fetch) | EC-T-V1 + ownership | Positive | Login as test user → fetch orders | Only test user's orders returned (not admin's) |
| DT-B-015 | Empty orders | EC-T-V1 + no orders | Positive | New user with 0 orders → fetch | `200`, empty array `[]` |

---

## EC Coverage

| EC | Covered by | Notes |
| --- | --- | --- |
| EC-T-V1 | DT-B-001, DT-B-014, DT-B-015 | Valid token path |
| EC-T-I1 | DT-B-002 | No token |
| EC-T-I2 | DT-B-003 | Expired token |
| EC-T-I3 | DT-B-004 | Malformed token |
| EC-O-V1 | DT-B-005 | Valid order, owned by user |
| EC-O-I1 | DT-B-006 | Non-existent order |
| EC-O-I2 | DT-B-007 | Different user's order |
| EC-O-I3 | DT-B-008 | Invalid format |
| EC-S-V1 | DT-B-009 | pending status → cancel OK |
| EC-S-V2 | DT-B-010 | confirmed status → cancel OK |
| EC-S-V3 | DT-B-011 | **BUG:** shipping status → code allows but spec forbids |
| EC-S-I1 | DT-B-012 | delivered status → reject |
| EC-S-I2 | DT-B-013 | canceled status → reject |

**Total:** 15 TC, 13/13 EC covered (100%)
