# 04 — BVA Boundary Table: feature_B (FR-11 — Xem Lịch sử Đơn hàng)

> **Scope:** Boundary values for ordered domains only.

---

## Boundaries

### `orderId` — Numeric (for cancel action)

| Boundary | Value | Behavior |
| --- | --- | --- |
| Min-1 | -1 | Negative ID → `400` / `404` (invalid) |
| Min | 0 | Zero ID → `404` (not found) |
| Min+1 | 1 | Smallest valid ID → Cancel allowed if owned by user |
| Nominal | 123 | Typical order ID from DB | 
| Max-1 | 2147483646 | Near INT32 max → May not exist, returns `404` |
| Max | 2147483647 | INT32 max → May not exist, returns `404` |
| Max+1 | 2147483648 | Overflow (INT64) → DB may truncate or error |

### `orders array` — List Size (fetch action)

| Boundary | Count | Behavior |
| --- | --- | --- |
| Empty | 0 | User has no orders → `200` with `[]` (empty array) |
| Min+1 | 1 | Single order → Display 1 row |
| Nominal | 5 | Typical user with multiple orders → Display ordered list |
| Large | 100+ | Many orders → Test rendering/performance |

### `created_at` — Timestamp Ordering

| Boundary | Scenario | Behavior |
| --- | --- | --- |
| Sort order | Multiple orders | `ORDER BY id DESC` → Newest first |
| Boundary check | Created at `now()` vs past | Verify correct date display |

---

## Notes

- **orderId boundaries:** Code parses as Integer; boundaries test edge values
- **List size:** Tests query result size; no explicit limit in code
- **Timestamp:** Ordered DESC by ID (not by timestamp); verify display format
