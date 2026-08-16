/**
 * analyze-jtl.js — tính metric hiệu năng từ một hay nhiều file JMeter .jtl.
 * Dùng lại được cho bất kỳ nhóm endpoint nào (không hardcode label).
 *
 * Cách chạy:
 *   node analyze-jtl.js <file1.jtl> [file2.jtl ...]
 * In ra cho mỗi file: bảng per-label + dòng ALL (samples, error%, avg,
 * p50/p90/p95/p99, max, throughput req/s).
 *
 * Bài học đọc số (xem SKILL.md bước 6): nhìn p95/p99 chứ không chỉ avg;
 * throughput ở đây là số đo được, chưa chắc là trần server.
 */
const fs = require("fs");

function pct(sorted, p) {
  if (!sorted.length) return 0;
  const i = Math.ceil((p / 100) * sorted.length) - 1;
  return sorted[Math.max(0, Math.min(i, sorted.length - 1))];
}

function stats(rows) {
  const el = rows.map((r) => r.el).sort((a, b) => a - b);
  const errs = rows.filter((r) => !r.ok).length;
  let tmin = Infinity, tmax = -Infinity;
  for (const r of rows) { if (r.ts < tmin) tmin = r.ts; if (r.ts + r.el > tmax) tmax = r.ts + r.el; }
  const dur = (tmax - tmin) / 1000 || 1;
  const sum = el.reduce((a, b) => a + b, 0);
  return {
    n: rows.length,
    err: ((errs / rows.length) * 100).toFixed(2),
    avg: Math.round(sum / rows.length),
    p50: pct(el, 50), p90: pct(el, 90), p95: pct(el, 95), p99: pct(el, 99),
    max: el[el.length - 1],
    tput: (rows.length / dur).toFixed(1),
  };
}

function row(name, s) {
  return `| ${name} | ${s.n} | ${s.err}% | ${s.avg} | ${s.p50} | ${s.p90} | ${s.p95} | ${s.p99} | ${s.max} | ${s.tput} |`;
}

const files = process.argv.slice(2);
if (!files.length) { console.error("Usage: node analyze-jtl.js <file.jtl> [...]"); process.exit(1); }

for (const f of files) {
  const lines = fs.readFileSync(f, "utf8").trim().split(/\r?\n/);
  const h = lines.shift().split(",");
  const iTs = h.indexOf("timeStamp"), iEl = h.indexOf("elapsed"), iLb = h.indexOf("label"), iOk = h.indexOf("success");
  const rows = lines.map((l) => { const c = l.split(","); return { ts: +c[iTs], el: +c[iEl], label: c[iLb], ok: c[iOk] === "true" }; });

  console.log(`\n## ${f}`);
  console.log("| Scope | Samples | Err% | Avg | p50 | p90 | p95 | p99 | Max | RPS |");
  console.log("|---|--:|--:|--:|--:|--:|--:|--:|--:|--:|");
  console.log(row("ALL", stats(rows)));
  for (const lb of [...new Set(rows.map((r) => r.label))].sort()) {
    console.log(row(lb, stats(rows.filter((r) => r.label === lb))));
  }
}
