# 05 — BVA Test Cases: feature_B (FR-11 — Xem Lịch sử Đơn hàng)

> **Scope:** Convert boundaries into concrete test cases.

---

## Test Cases

**Defaults:** 
- JWT: Valid token (test@eshop.com logged in)
- Orders in DB: Pre-seeded with various statuses
- Precondition: User authenticated

### orderId Boundaries (Cancel Action) (7 TC)

| TC ID | Boundary | Input | Expected |
| --- | --- | --- | --- |
| BVA-B-001 | Min-1 (negative) | PUT /api/orders/-1/cancel | `400` / `404` (invalid ID) |
| BVA-B-002 | Min (zero) | PUT /api/orders/0/cancel | `404 Order not found` |
| BVA-B-003 | Min+1 (valid) | PUT /api/orders/1/cancel (if owned by user) | `200`, status → canceled |
| BVA-B-004 | Nominal | PUT /api/orders/5/cancel (typical ID) | `200`, status → canceled (or `404` if not owned) |
| BVA-B-005 | Max-1 | PUT /api/orders/2147483646/cancel | `404 Order not found` (unlikely to exist) |
| BVA-B-006 | Max | PUT /api/orders/2147483647/cancel | `404 Order not found` (INT32 max) |
| BVA-B-007 | Max+1 | PUT /api/orders/2147483648/cancel | Overflow behavior (may error or truncate) |

### Orders List Size (Fetch Action) (4 TC)

| TC ID | Boundary | Scenario | Expected |
| --- | --- | --- | --- |
| BVA-B-001 | Empty (0 orders) | New user, no orders → GET /api/orders/my-orders | `200`, returns `[]` (empty array) |
| BVA-B-002 | Min+1 (1 order) | User with 1 order → GET /api/orders/my-orders | `200`, array with 1 order object |
| BVA-B-003 | Nominal (5 orders) | User with 5 orders → GET /api/orders/my-orders | `200`, array with 5 orders in DESC order. Verify: id[0] > id[1] > id[2] (descending) |
| BVA-B-004 | Large (100+ orders) | Bulk orders scenario → GET /api/orders/my-orders | `200`, all orders returned (not paginated), in DESC order by ID. Performance < 5s |

### Concurrency & Ordering (2 TC)

| TC ID | Boundary | Scenario | Expected |
| --- | --- | --- | --- |
| BVA-B-005 | Concurrent cancel requests | Two simultaneous PUT /api/orders/{id}/cancel on same order | First: `200` (success). Second: `400` (idempotent). DB: status=canceled (no race corruption). |
| BVA-B-006 | Date/ID ordering verification | Orders created at T1 < T2 < T3 with ID1 < ID2 < ID3 | Response ordered DESC by ID (newest ID first). Verify: response[0].id=3, response[1].id=2, etc. |

---

## Summary

| Category | Count | TC Range |
| --- | --- | --- |
| List size boundaries | 4 | BVA-B-001 → BVA-B-004 |
| Concurrency & Ordering | 2 | BVA-B-005 → BVA-B-006 |
| **Total** | **6** | |

---

## Notes

- **BVA refocused:** Removed numeric orderId boundaries (not business-critical) and supplementary tests. Focus on what impacts actual behavior: list size (0, 1, 5, 100+), concurrent requests (idempotency), and ordering correctness.
- **Concurrency critical:** BVA-B-005 tests race condition on cancel — ensures DB consistency under parallel requests.
- **Ordering verification:** BVA-B-006 validates DESC order by ID (not by timestamp) to catch potential sorting bugs.
