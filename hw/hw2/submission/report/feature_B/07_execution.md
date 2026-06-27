# 07 — Test Execution Report: feature_B (FR-11 — Xem Lịch sử Đơn hàng)

> **Environment:** Backend localhost:3000, Frontend localhost:5173, DB: SQLite
>
> **Date:** 2026-06-25

---

## A. Domain Tests (15 TC)

| TC ID | Description | Expected | Actual | Status |
| --- | --- | --- | --- | --- |
| DT-B-001 | Fetch orders with valid token | `200`, orders array | `200`, array with user's orders (3 orders returned) | **Pass** |
| DT-B-002 | Fetch without token | `401 Unauthorized` | `401 Unauthorized` | **Pass** |
| DT-B-003 | Fetch with expired token | `401 Unauthorized` | `401 Unauthorized` | **Pass** |
| DT-B-004 | Fetch with malformed token | `401 Unauthorized` | `401 Unauthorized` | **Pass** |
| DT-B-005 | Cancel non-existent order | `404 Order not found` | `404 Order not found` | **Pass** |
| DT-B-006 | Cancel different user's order | `404 Order not found` (isolation) | `404 Order not found` (isolation works) | **Pass** |
| DT-B-007 | Cancel with bad orderId format | `400` / `404` | `404` (treated as invalid ID) | **Pass** |
| DT-B-008 | Cancel order (pending status) | `200`, status → canceled | `200`, status updated to canceled | **Pass** |
| DT-B-009 | Cancel order (confirmed status) | `200`, status → canceled | `200`, status updated to canceled | **Pass** |
| DT-B-010 | Cancel order (delivered status) | `400 "Cannot cancel"` | `400 "Cannot cancel this order"` | **Pass** |
| DT-B-011 | Cancel order (canceled status) | `400 "Cannot cancel"` (idempotent) | `400 "Cannot cancel this order"` (idempotent ✓) | **Pass** |
| DT-B-012 | Cancel order (shipping status) | **SPEC:** `400` (deny). **CODE:** `200` (allow) | **ACTUAL:** `200`, status → canceled (**BUG**) | **Fail** |
| DT-B-013 | User isolation (fetch) | Each user sees only their orders | test user sees 3 orders, admin sees different orders | **Pass** |
| DT-B-014 | Fetch empty orders | `200`, empty array `[]` | `200`, `[]` (new user with no orders) | **Pass** |
| DT-B-015 | Fetch many orders | `200`, DESC order (newest first) | `200`, 10 orders in DESC by ID | **Pass** |

**Result: 14/15 Pass, 1/15 Fail**

---

## B. BVA Tests (4 TC)

| TC ID | Description | Pre-condition | Expected | Actual | Status |
| --- | --- | --- | --- | --- | --- |
| BVA-B-001 | Fetch list size = 0 (Empty) | New user with 0 orders | `200`, empty array `[]` | `200`, `[]` (no orders) | **Pass** |
| BVA-B-002 | Fetch list size = 1 (Min+1) | User with 1 order | `200`, array[1] | `200`, 1 order returned | **Pass** |
| BVA-B-003 | Fetch list size = 5 (Nominal) | User with 5 orders | `200`, 5 orders DESC by id | `200`, 5 orders in DESC order | **Pass** |
| BVA-B-004 | Fetch list size = 100+ (Large) | User with 100+ orders | `200`, all orders DESC order | `200`, 100+ orders in DESC order (perf OK) | **Pass** |

**Result: 4/4 Pass**

---

## Summary

| Category | Total | Pass | Fail |
| --- | --- | --- | --- |
| Domain | 15 | 14 | 1 |
| BVA | 4 | 4 | 0 |
| **Total** | **19** | **18** | **1** |

**Pass Rate: 94.7%**

---

## Observations & Known Issues

### OBS-01: Shipping Status Cancel Bug (DT-B-012)

- **Mô tả:** User có thể cancel order khi `status=shipping`, nhưng SPEC FR-10 cấm: "User không được phép tự hủy khi status=shipping (chỉ Admin)"
- **Phát hiện tại:** DT-B-012 — Cancel order (shipping status)
- **ACTUAL:** `200` OK, status updated to canceled
- **EXPECTED (per SPEC):** `400` "Cannot cancel this order"
- **Root cause:** Code line 329 (server.js): `if (order.status === "delivered" OR order.status === "canceled")` → allows shipping
- **Impact:** **High** — Security/Business logic violation. User can bypass shipping order cancellation restriction.
