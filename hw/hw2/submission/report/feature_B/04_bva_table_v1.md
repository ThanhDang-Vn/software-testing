# 04 — BVA Boundary Table: feature_B (FR-11 — Xem Lịch sử Đơn hàng)


## Boundaries

### `orders array` — List Size (fetch action)

| Boundary | Count | Behavior                                                 |
| -------- | ----- | -------------------------------------------------------- |
| Empty    | 0     | User has no orders → `200` with `[]` (empty array)       |
| Min+1    | 1     | Single order → Display 1 row                             |
| Nominal  | 5     | Typical user with multiple orders → Display ordered list |
| Large    | 100+  | Many orders → Test rendering/performance                 |