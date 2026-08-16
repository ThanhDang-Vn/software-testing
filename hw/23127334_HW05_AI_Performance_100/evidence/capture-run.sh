#!/bin/bash
# Re-run ONE scenario so you can screenshot JMeter + Task Manager in the same frame.
# Usage:  bash evidence/capture-run.sh Load|Stress|Spike
# Screenshots are the manual part; this just drives a fresh, reset run.
set -u
S="${1:-Load}"
HW="C:/Users/dn156/source/software-testing/software-testing/hw/hw5"
BE="C:/Users/dn156/source/software-testing/software-testing/hw/eshop-sut/backend"
cd "$HW"
mkdir -p results/jtl results/html
echo "[reset] restart server (reseed) + register 300 accounts"
taskkill //F //IM node.exe >/dev/null 2>&1; sleep 1
( cd "$BE" && node server.js > /tmp/eshop_capture.log 2>&1 & )
for i in $(seq 1 15); do [ "$(curl -s -o /dev/null -w '%{http_code}' http://localhost:3000/api/products 2>/dev/null)" = "200" ] && break; sleep 1; done
node data/register-users.js | tail -1
rm -f "results/jtl/${S}_capture.jtl"; rm -rf "results/html/${S}_capture"
echo "[run] $S starting NOW — open Task Manager (Details tab, node.exe) beside this terminal and screenshot."
echo "      Load: capture anytime (steady). Stress: capture ~5-6 min in (peak 300 VU)."
echo "      Spike: capture 60-125s in (during the burst)."
jmeter -n -t "testplans/23127334_${S}_20260811.jmx" \
  -l "results/jtl/${S}_capture.jtl" -e -o "results/html/${S}_capture" 2>&1 | grep -E "summary ="
taskkill //F //IM node.exe >/dev/null 2>&1
echo "[done] $S capture run finished (official metrics remain in results/jtl/$S.jtl)."
