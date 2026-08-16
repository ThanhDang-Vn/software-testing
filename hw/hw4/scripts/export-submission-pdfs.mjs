import { chromium } from '@playwright/test';
import { readFile, mkdir } from 'node:fs/promises';
import path from 'node:path';

const jobs = [
  ['submission/documents/main-report.md', 'submission/documents/main-report.pdf'],
  ['submission/documents/ai-audit-report.md', 'submission/documents/ai-audit-report.pdf'],
  ['submission/documents/ai-critique.md', 'submission/documents/ai-critique.pdf'],
];

const escapeHtml = (value) => value
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;');

const browser = await chromium.launch({ headless: true });
try {
  for (const [input, output] of jobs) {
    const markdown = await readFile(input, 'utf8');
    await mkdir(path.dirname(output), { recursive: true });
    const page = await browser.newPage();
    await page.setContent(`<!doctype html>
      <html><head><meta charset="utf-8"><style>
        @page { size: A4; margin: 18mm; }
        body { color: #1f2937; font: 11pt/1.5 Arial, sans-serif; }
        pre { font: 10pt/1.5 "Cascadia Mono", Consolas, monospace;
              white-space: pre-wrap; overflow-wrap: anywhere; }
      </style></head><body><pre>${escapeHtml(markdown)}</pre></body></html>`);
    await page.pdf({ path: output, format: 'A4', printBackground: true });
    await page.close();
    console.log(`Exported ${output}`);
  }
} finally {
  await browser.close();
}
