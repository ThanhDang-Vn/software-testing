#!/bin/bash
# P2.1 - Run all 3 performance scenarios headless with a clean reset before each.
# Reset procedure (also resets any account-lockout): restart server -> DB is
# DROP+reseeded on boot -> re-register the 300 perf accounts -> run JMeter.
set -u
HW="C:/Users/dn156/source/software-testing/software-testing/hw/hw5"
BE="C:/Users/dn156/source/software-testing/software-testing/hw/eshop-sut/backend"
cd "$HW"
mkdir -p results/jtl results/html

reset_server() {
  taskkill //F //IM node.exe >/dev/null 2>&1
  sleep 1
  ( cd "$BE" && node server.js > /tmp/eshop_run.log 2>&1 & )
  for i in $(seq 1 15); do
    [ "$(curl -s -o /dev/null -w '%{http_code}' http://localhost:3000/api/products 2>/dev/null)" = "200" ] && { echo "  server up"; return 0; }
    sleep 1
  done
  echo "  ERROR: server did not come up"; return 1
}

for S in Load Stress Spike; do
  echo "================ RESET + RUN: $S ================"
  echo "[reset] restarting server (reseed DB = clears lockout + orders)"
  reset_server || exit 1
  echo "[reset] re-registering 300 accounts"
  node data/register-users.js | tail -1
  rm -f "results/jtl/$S.jtl" "results/jtl/$S.log"
  rm -rf "results/html/$S"
  echo "[run] jmeter -n $S ..."
  jmeter -n -t "testplans/23127334_${S}_20260811.jmx" \
    -l "results/jtl/$S.jtl" -e -o "results/html/$S" \
    -j "results/jtl/$S.log" 2>&1 | grep -E "summary =|summary \+" | tail -1
  echo "[done] $S -> results/jtl/$S.jtl + results/html/$S/"
done

taskkill //F //IM node.exe >/dev/null 2>&1
echo "================ ALL RUNS COMPLETE ================"
