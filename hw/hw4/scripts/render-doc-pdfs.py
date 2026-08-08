from __future__ import annotations

import pathlib
import subprocess
import sys

import markdown


ROOT = pathlib.Path(__file__).resolve().parents[1]
CHROME = pathlib.Path(r"C:\Program Files\Google\Chrome\Application\chrome.exe")
DOCUMENTS = ("main-report", "ai-audit-report", "ai-critique", "bug-report")
STYLE = """
body { font-family: Arial, sans-serif; margin: 36px; line-height: 1.45; color: #202124; }
h1, h2, h3 { page-break-after: avoid; }
table { border-collapse: collapse; width: 100%; font-size: 11px; }
th, td { border: 1px solid #999; padding: 5px; vertical-align: top; }
pre, code { font-family: Consolas, monospace; white-space: pre-wrap; overflow-wrap: anywhere; }
a { color: #0759b8; }
"""


def main() -> int:
    if not CHROME.exists():
        raise FileNotFoundError(f"Chrome not found: {CHROME}")
    target = ROOT / "submission" / "documents"
    for name in DOCUMENTS:
        source = ROOT / "docs" / f"{name}.md"
        html_path = target / f".{name}.render.html"
        pdf_path = target / f"{name}.pdf"
        body = markdown.markdown(
            source.read_text(encoding="utf-8"), extensions=("tables", "fenced_code")
        )
        html_path.write_text(
            f"<!doctype html><meta charset='utf-8'><style>{STYLE}</style><body>{body}</body>",
            encoding="utf-8",
        )
        result = subprocess.run(
            [
                str(CHROME), "--headless=new", "--disable-gpu", "--no-pdf-header-footer",
                f"--print-to-pdf={pdf_path}", html_path.as_uri(),
            ],
            check=False,
        )
        html_path.unlink(missing_ok=True)
        if result.returncode != 0 or not pdf_path.exists() or pdf_path.stat().st_size == 0:
            print(f"PDF generation failed for {name}", file=sys.stderr)
            return 1
        print(f"{pdf_path} | {pdf_path.stat().st_size} bytes")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
