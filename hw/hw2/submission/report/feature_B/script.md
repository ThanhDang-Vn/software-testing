# Test Scripts — feature_B (FR-11)

> Các script và hướng dẫn chạy test cho 26 API TC (20 DT + 6 BVA)

---

## Quick Start

```bash
# 1. Start backend
cd backend
node database.js
node server.js

# 2. Run automated tests
bash script_test.sh
```

---

## Group 1: Authentication Tests (Runnable)

```bash
# Get tokens
TEST_TOKEN=$(curl -s -X POST "http://localhost:3000/api/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"test@eshop.com","password":"Test1234!"}' | \
  grep -o '"token":"[^"]*' | cut -d'"' -f4)

# DT-B-002: No token
curl "http://localhost:3000/api/orders/my-orders"
# Expected: 401

# DT-B-003: Expired token
curl -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiZXhwIjoxNjAwMDAwMDAwfQ.fake" \
  "http://localhost:3000/api/orders/my-orders"
# Expected: 401 or 403

# DT-B-004: Malformed token
curl -H "Authorization: Bearer invalid.token" \
  "http://localhost:3000/api/orders/my-orders"
# Expected: 401 or 403
```

---

## Group 2: Fetch Orders (Runnable)

```bash
TEST_TOKEN="..."  # từ Get tokens ở trên

# DT-B-001: Fetch valid orders
curl -H "Authorization: Bearer $TEST_TOKEN" \
  "http://localhost:3000/api/orders/my-orders"
# Expected: 200, array of orders with: id, user_id, total_amount, status, shipping_address, created_at

# DT-B-013: User isolation
ADMIN_TOKEN=$(curl -s -X POST "http://localhost:3000/api/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@eshop.com","password":"Admin123!"}' | \
  grep -o '"token":"[^"]*' | cut -d'"' -f4)

echo "Test user orders:"
curl -H "Authorization: Bearer $TEST_TOKEN" "http://localhost:3000/api/orders/my-orders" | jq

echo "Admin orders:"
curl -H "Authorization: Bearer $ADMIN_TOKEN" "http://localhost:3000/api/orders/my-orders" | jq
# Expected: Different orders for each user
```

---

## Group 3: Cancel Non-existent (Runnable)

```bash
TEST_TOKEN="..."

# DT-B-005: Cancel ID 99999 (not exist)
curl -X PUT -H "Authorization: Bearer $TEST_TOKEN" \
  "http://localhost:3000/api/orders/99999/cancel"
# Expected: 404 { error: "Order not found" }

# DT-B-007: Cancel ID "abc" (invalid format)
curl -X PUT -H "Authorization: Bearer $TEST_TOKEN" \
  "http://localhost:3000/api/orders/abc/cancel"
# Expected: 404 { error: "Order not found" }
```

---

## Group 4: Cancel with Status Validation (Manual DB Setup)

```bash
# Step 1: Check current orders
sqlite3 database.sqlite "SELECT id, user_id, status FROM orders LIMIT 10;"

# Example output:
# 1|2|pending
# 2|2|confirmed
# 3|1|delivered
# 4|2|canceled

# Step 2: Update order status if needed
sqlite3 database.sqlite "UPDATE orders SET status='shipping' WHERE id=5;"

# Step 3: Test DT-B-012 (shipping order — should allow but is BUG)
TEST_TOKEN="..."
curl -X PUT -H "Authorization: Bearer $TEST_TOKEN" \
  "http://localhost:3000/api/orders/5/cancel"
# Expected per SPEC: 400
# Actual CODE: 200 (BUG!)

# Verify in DB
sqlite3 database.sqlite "SELECT status FROM orders WHERE id=5;"
# After cancel: status = canceled (confirms BUG)

# Reset for other tests
sqlite3 database.sqlite "UPDATE orders SET status='pending' WHERE id=5;"
```

---

## Group 5: Concurrency Test (BVA-B-005)

```bash
# Install parallel if needed:
# sudo apt-get install parallel  (Linux/WSL)
# brew install parallel           (macOS)

TEST_TOKEN="..."
ORDER_ID=2  # Use a pending order

# Send 2 cancel requests simultaneously
parallel -j 2 <<EOF
curl -X PUT -H "Authorization: Bearer $TEST_TOKEN" \
  "http://localhost:3000/api/orders/$ORDER_ID/cancel"
curl -X PUT -H "Authorization: Bearer $TEST_TOKEN" \
  "http://localhost:3000/api/orders/$ORDER_ID/cancel"
EOF

# Expected output:
# 1st: { message: "Order canceled successfully" }
# 2nd: { error: "Cannot cancel this order." }

# Verify DB consistency
sqlite3 database.sqlite "SELECT status FROM orders WHERE id=$ORDER_ID;"
# Should be: canceled (no race condition corruption)
```

---

## Group 6: NULL Field Handling (Manual DB + Browser)

```bash
# Set created_at to NULL
sqlite3 database.sqlite "UPDATE orders SET created_at=NULL WHERE id=6;"

# Test frontend: Open http://localhost:5173/profile
# Check if order 6 renders without "Invalid Date" error
# Should show blank date or default fallback

# Reset
sqlite3 database.sqlite "UPDATE orders SET created_at=datetime('now') WHERE id=6;"
```

---

## Group 7: UI Tests (Manual Browser)

```
1. Navigate to http://localhost:5173/profile
2. Login as test@eshop.com / Test1234!
3. Check:
   - Orders list displays correctly
   - Cancel button visible for pending/confirmed
   - Cancel button HIDDEN for delivered/canceled
   - Vietnamese labels: "Trạng thái" (Status), "Tổng tiền" (Total), "Ngày tạo" (Created)
   - Date format: DD/MM/YYYY or locale format
   - Price format: "30,000,000 ₫"
   - No "Invalid Date" or "NaN ₫" errors
```

---

## Running All Tests

### Option 1: Automated (13/26 TC)
```bash
bash script_test.sh
```

### Option 2: Full Manual (26/26 TC)
Follow groups 1-7 in sequence, running each script/SQL command.

---

## Expected Results Summary

| Group | TC Count | Automation | Status |
|---|---|---|---|
| 1-3 (Auth + Fetch + Non-existent) | 13 | ✅ Auto | RUNNABLE |
| 4 (Status validation) | 5 | ⚠️ Manual | Need SQL setup |
| 5 (Concurrency) | 1 | ⚠️ Manual | Need `parallel` tool |
| 6 (NULL fields) | 2 | ⚠️ Manual | Need SQL + browser |
| 7 (UI) | 9 | ❌ Manual | Browser only |
| **Total** | **26** | | |
