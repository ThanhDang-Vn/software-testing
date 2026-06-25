# 08 — Bug Report: feature_B (FR-11 — Xem Lịch sử Đơn hàng)

---

## Bug Report Table

| Bug ID | Title | Severity | Pre-condition | Steps | Actual | Expected | TC ID | Screenshot |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| BUG-B-001 | User can cancel order when status=shipping (violates SPEC FR-10) | High | Order status=shipping, owned by user | 1. Login as test user 2. GET /api/orders/my-orders 3. PUT /api/orders/{id}/cancel (where status=shipping) | `200` OK, order status updated to canceled | `400 "Cannot cancel this order"` (SPEC: User cannot cancel shipping orders) | DT-B-012 | `screenshots/BUG-B-001.png` |

---

## GitHub Issue Template

**Title:** `[BUG] Order History — User can cancel order with status=shipping (violates SPEC FR-10)`

```markdown
## Description
When a user attempts to cancel an order with `status=shipping`, the system allows the cancel operation and returns `200 OK`. However, according to SPEC FR-10: "When an order has status=shipping, User is NOT permitted to cancel it (only Admin can)". This is a business logic violation.

## Severity
High

## Reproduce
1. Login as test@eshop.com
2. GET /api/orders/my-orders (retrieve order with status=shipping)
3. PUT /api/orders/{orderId}/cancel (use the shipping order's ID)
4. Observe response

## Expected
`400 "Cannot cancel this order"` or similar error message, order status remains unchanged.

## Actual
`200 OK`, order status is updated to `canceled`.

## Root Cause
`backend/server.js` line 329:
```javascript
if (order.status === "delivered" || order.status === "canceled") {
  return res.status(400).json({ error: "Cannot cancel this order." });
}
```

The condition only blocks `delivered` and `canceled` statuses. According to SPEC FR-10, it should also block `shipping`:
```javascript
if (order.status === "delivered" || order.status === "canceled" || order.status === "shipping") {
  // ...
}
```

## Related TC
DT-B-012

## Test Environment
- Backend: Node.js + Express @ localhost:3000
- Database: SQLite
- Date: 2026-06-25

## Impact
- **Business Logic:** Violates order state machine requirement (FR-10)
- **User Permission:** User can override Admin-only action (cancel shipping order)
- **Data Integrity:** Shipped order can be retroactively canceled without Admin approval

## Screenshot
[Attach screenshots/BUG-B-001.png showing:
1. Order list with order in "shipping" status
2. Response from PUT /api/orders/{id}/cancel with status=200
3. Updated order status showing "canceled"]
```

---

## Summary

| Severity | Count | Bug IDs |
| --- | --- | --- |
| High | 1 | BUG-B-001 |
| **Total** | **1** | |
