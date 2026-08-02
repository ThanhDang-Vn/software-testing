from pathlib import Path
import json
import re
import subprocess


root = Path(__file__).resolve().parents[1]
report_path = root / "task-1-gui-checklist" / "bug-report.md"
output_path = root / "task-1-gui-checklist" / "github-created-issues.json"
repo = "ThanhDang-Vn/software-testing"
branch = "homework3"
repo_evidence_root = (
    "hw/hw3/23127334_HW03_AI_GUIUsability_TBD/"
    "task-1-gui-checklist/failed-screenshots"
)

report = report_path.read_text(encoding="utf-8")
matches = list(
    re.finditer(
        r"^## (BUG-GUI-\d{3}) — (.+?)\n\n(.*?)(?=^## BUG-GUI-\d{3} — |^## Summary)",
        report,
        flags=re.MULTILINE | re.DOTALL,
    )
)
if len(matches) != 12:
    raise SystemExit(f"Expected 12 bug sections, found {len(matches)}")

existing_raw = subprocess.run(
    [
        "gh", "issue", "list", "--repo", repo, "--state", "all",
        "--limit", "200", "--json", "number,title,url",
    ],
    check=True,
    capture_output=True,
    text=True,
    encoding="utf-8",
).stdout
existing = json.loads(existing_raw)
by_bug_id = {}
for issue in existing:
    match = re.match(r"\[(BUG-GUI-\d{3})\]", issue["title"])
    if match:
        by_bug_id[match.group(1)] = issue

created = []
for match in matches:
    bug_id, summary, body = match.group(1), match.group(2).strip(), match.group(3).strip()
    if bug_id in by_bug_id:
        created.append({**by_bug_id[bug_id], "bug_id": bug_id, "created": False})
        continue

    filenames = sorted(set(re.findall(r"`(?:failed-screenshots/)?([^`]+\.png)`", body)))
    if filenames:
        evidence = ["", "### Evidence"]
        for filename in filenames:
            url = (
                f"https://github.com/{repo}/blob/{branch}/"
                f"{repo_evidence_root}/{filename}"
            )
            evidence.append(f"- [{filename}]({url})")
        body += "\n" + "\n".join(evidence)

    body += (
        "\n\n---\n"
        f"Source: HW03 Playwright execution on branch `{branch}`. "
        "No label requested."
    )
    title = f"[{bug_id}] {summary}"
    result = subprocess.run(
        ["gh", "issue", "create", "--repo", repo, "--title", title, "--body", body],
        check=True,
        capture_output=True,
        text=True,
        encoding="utf-8",
    )
    url = result.stdout.strip()
    created.append(
        {
            "bug_id": bug_id,
            "title": title,
            "url": url,
            "created": True,
        }
    )

output_path.write_text(
    json.dumps(created, ensure_ascii=False, indent=2),
    encoding="utf-8",
)
print(json.dumps(created, ensure_ascii=False))
