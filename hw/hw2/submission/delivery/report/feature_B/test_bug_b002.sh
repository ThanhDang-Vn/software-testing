#!/bin/bash
# Test DT-B-003 & DT-B-004: JWT verify trả 403 thay vì 401
# Chạy khi backend đang chạy tại localhost:3000
# Mở DevTools Network tab trước khi chạy để chụp screenshot

BASE_URL="http://localhost:3000"

echo "=== DT-B-003: Expired JWT Token ==="
echo "Expected: 401 Unauthorized"
echo ""
curl -s -o /dev/null -w "Status: %{http_code}\n" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoyLCJyb2xlIjoidXNlciIsImlhdCI6MTYwMDAwMDAwMCwiZXhwIjoxNjAwMDAwMDAxfQ.invalid_sig" \
  "$BASE_URL/api/orders/my-orders"

echo ""
echo "=== DT-B-004: Malformed JWT Token ==="
echo "Expected: 401 Unauthorized"
echo ""
curl -s -o /dev/null -w "Status: %{http_code}\n" \
  -H "Authorization: Bearer not-a-valid-jwt-token-at-all" \
  "$BASE_URL/api/orders/my-orders"

echo ""
echo "=== DT-B-002: No Token (baseline) ==="
echo "Expected: 401 Unauthorized"
echo ""
curl -s -o /dev/null -w "Status: %{http_code}\n" \
  "$BASE_URL/api/orders/my-orders"

echo ""
echo "Chụp screenshot kết quả terminal này → BUG-B-002.png"
