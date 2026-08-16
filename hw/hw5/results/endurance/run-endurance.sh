#!/bin/bash
# P2.3 - Endurance/soak: 300 VU no-think for 12 min. Samples backend node.exe
# memory every 5s (memory ceiling) while JMeter drives the load.
set -u
HW="C:/Users/dn156/source/software-testing/software-testing/hw/hw5"
BE="C:/Users/dn156/source/software-testing/software-testing/hw/eshop-sut/backend"
ED="$HW/results/endurance"
cd "$HW"
mkdir -p "$ED"

echo "[reset] restart server + register 300 accounts"
taskkill //F //IM node.exe >/dev/null 2>&1; sleep 1
( cd "$BE" && node server.js > /tmp/eshop_endurance.log 2>&1 & )
for i in $(seq 1 15); do [ "$(curl -s -o /dev/null -w '%{http_code}' http://localhost:3000/api/products 2>/dev/null)" = "200" ] && break; sleep 1; done
node data/register-users.js | tail -1

# Find the Windows PID listening on :3000 (the backend node process)
SRVPID=$(netstat -ano | grep -E ':3000\b' | grep -i LISTENING | awk '{print $NF}' | head -1)
echo "[monitor] backend node PID on :3000 = $SRVPID"

# Background memory sampler: epoch_ms,rss_kb every 5s
echo "epoch_ms,rss_kb" > "$ED/node-mem.csv"
(
  while true; do
    LINE=$(tasklist //FI "PID eq $SRVPID" //FO CSV //NH 2>/dev/null | tr -d '"')
    MEM=$(echo "$LINE" | awk -F',' '{print $5}' | tr -d ' K' | tr -d ',')
    [ -n "$MEM" ] && echo "$(date +%s000),$MEM" >> "$ED/node-mem.csv"
    sleep 5
  done
) &
SAMPLER=$!

rm -f "$ED/Endurance.jtl" "$ED/Endurance.log"; rm -rf "$ED/html"
echo "[run] endurance 300 VU / 12 min starting..."
cd testplans
jmeter -n -t 23127334_Endurance_20260811.jmx \
  -l "$ED/Endurance.jtl" -e -o "$ED/html" -j "$ED/Endurance.log" 2>&1 | grep -E "summary =" | tail -1

kill "$SAMPLER" 2>/dev/null
taskkill //F //IM node.exe >/dev/null 2>&1
echo "[done] endurance -> $ED/Endurance.jtl + node-mem.csv + html/"
