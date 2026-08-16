#!/bin/bash
# run-scenario.sh — reset SUT rồi chạy 1 test plan headless, xuất jtl + HTML.
#
# Cách dùng:
#   PLAN=path/to/plan.jmx OUT=path/to/outdir [BACKEND_DIR=...] [REGISTER_CMD=...] \
#     bash run-scenario.sh <ScenarioName>
#
# Env:
#   PLAN         (bắt buộc) đường dẫn file .jmx
#   OUT          (bắt buộc) thư mục xuất, sẽ tạo OUT/<Scenario>.jtl và OUT/<Scenario>/ (html)
#   BACKEND_DIR  (tuỳ) thư mục backend để restart trước khi chạy (reset khóa tài khoản + DB sạch)
#   START_CMD    (tuỳ) lệnh khởi động backend, mặc định "node server.js"
#   HEALTH_URL   (tuỳ) URL kiểm SUT đã lên, mặc định http://localhost:3000/api/products
#   REGISTER_CMD (tuỳ) lệnh nạp lại tài khoản sau khi restart, ví dụ "node data/register-users.js"
set -u
S="${1:?Thiếu tên scenario}"
: "${PLAN:?Thiếu PLAN}"; : "${OUT:?Thiếu OUT}"
START_CMD="${START_CMD:-node server.js}"
HEALTH_URL="${HEALTH_URL:-http://localhost:3000/api/products}"
mkdir -p "$OUT"

if [ -n "${BACKEND_DIR:-}" ]; then
  echo "[reset] restart backend"
  taskkill //F //IM node.exe >/dev/null 2>&1 || pkill -f "$START_CMD" 2>/dev/null
  sleep 1
  ( cd "$BACKEND_DIR" && $START_CMD > /tmp/sut_run.log 2>&1 & )
  for i in $(seq 1 15); do
    [ "$(curl -s -o /dev/null -w '%{http_code}' "$HEALTH_URL" 2>/dev/null)" = "200" ] && { echo "  SUT up"; break; }
    sleep 1
  done
fi

if [ -n "${REGISTER_CMD:-}" ]; then
  echo "[reset] register accounts"
  $REGISTER_CMD | tail -1
fi

rm -f "$OUT/$S.jtl" "$OUT/$S.log"; rm -rf "$OUT/$S"
echo "[run] $S"
jmeter -n -t "$PLAN" -l "$OUT/$S.jtl" -e -o "$OUT/$S" -j "$OUT/$S.log" 2>&1 | grep -E "summary =" | tail -1
echo "[done] $OUT/$S.jtl + $OUT/$S/index.html"
