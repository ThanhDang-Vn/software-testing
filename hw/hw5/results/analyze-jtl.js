/**
 * Compute per-scenario and per-label metrics from raw JMeter .jtl files.
 * Metrics: samples, error%, avg/min/max elapsed (ms), p50/p90/p95/p99, throughput (req/s).
 * Usage: node results/analyze-jtl.js  (writes results/run-summary.md)
 */
const fs = require("fs");
const path = require("path");

const DIR = __dirname;
const SCENARIOS = ["Load", "Stress", "Spike"];

function pct(sorted, p) {
  if (!sorted.length) return 0;
  const idx = Math.ceil((p / 100) * sorted.length) - 1;
  return sorted[Math.max(0, Math.min(idx, sorted.length - 1))];
}

function stats(rows) {
  const el = rows.map((r) => r.elapsed).sort((a, b) => a - b);
  const errs = rows.filter((r) => !r.ok).length;
  const tsMin = Math.min(...rows.map((r) => r.ts));
  const tsMax = Math.max(...rows.map((r) => r.ts + r.elapsed));
  const durSec = (tsMax - tsMin) / 1000 || 1;
  const sum = el.reduce((a, b) => a + b, 0);
  return {
    n: rows.length,
    errPct: ((errs / rows.length) * 100).toFixed(2),
    avg: Math.round(sum / rows.length),
    min: el[0],
    max: el[el.length - 1],
    p50: pct(el, 50),
    p90: pct(el, 90),
    p95: pct(el, 95),
    p99: pct(el, 99),
    tput: (rows.length / durSec).toFixed(1),
  };
}

function fmtRow(name, s) {
  return `| ${name} | ${s.n} | ${s.errPct}% | ${s.avg} | ${s.min} | ${s.max} | ${s.p50} | ${s.p90} | ${s.p95} | ${s.p99} | ${s.tput} |`;
}

let md = `# P2.1 — Run Summary (metrics từ raw .jtl)\n\n`;
md += `Nguồn: \`results/jtl/{Load,Stress,Spike}.jtl\` · elapsed = ms · throughput = req/s.\n`;
md += `Reset trước mỗi run: restart server (reseed DB ⇒ xoá lockout + orders) + re-register 300 account.\n\n`;

const overallRows = [];
for (const sc of SCENARIOS) {
  const file = path.join(DIR, "jtl", `${sc}.jtl`);
  const lines = fs.readFileSync(file, "utf8").trim().split(/\r?\n/);
  const header = lines.shift().split(",");
  const iTs = header.indexOf("timeStamp");
  const iEl = header.indexOf("elapsed");
  const iLb = header.indexOf("label");
  const iOk = header.indexOf("success");
  const rows = lines.map((l) => {
    const c = l.split(",");
    return { ts: +c[iTs], elapsed: +c[iEl], label: c[iLb], ok: c[iOk] === "true" };
  });

  const overall = stats(rows);
  overallRows.push({ sc, overall });

  md += `## ${sc}\n\n`;
  md += `| Scope | Samples | Err% | Avg | Min | Max | p50 | p90 | p95 | p99 | Throughput |\n`;
  md += `|---|--:|--:|--:|--:|--:|--:|--:|--:|--:|--:|\n`;
  md += fmtRow("**ALL**", overall) + "\n";
  const labels = [...new Set(rows.map((r) => r.label))].sort();
  for (const lb of labels) md += fmtRow(lb, stats(rows.filter((r) => r.label === lb))) + "\n";
  md += `\nHTML report: \`results/html/${sc}/index.html\`\n\n`;
}

md += `## So sánh nhanh (ALL, mỗi scenario)\n\n`;
md += `| Scenario | Samples | Err% | Avg | p95 | Max | Throughput |\n|---|--:|--:|--:|--:|--:|--:|\n`;
for (const { sc, overall: o } of overallRows) {
  md += `| ${sc} | ${o.n} | ${o.errPct}% | ${o.avg} | ${o.p95} | ${o.max} | ${o.tput} |\n`;
}

fs.writeFileSync(path.join(DIR, "run-summary.md"), md);
console.log(md);
