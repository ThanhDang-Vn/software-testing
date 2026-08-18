import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PLAYBOOK = ROOT / "HW06_API_Testing_Prompt_Playbook.md"
OUTPUT = ROOT / "ai-audit-log.md"

PHASES = [
    "P0.1", "P0.2", "P0.3",
    "P1.1", "P1.2", "P1.3", "P1.4",
    "P2.1", "P2.2", "P2.3", "P2.4",
    "P3.1", "P3.2", "P3.3", "P3.4",
    "P4.1", "P4.2",
    "P5.1", "P5.2", "P5.3", "P5.4", "P5.5", "P5.6",
    "P6.1", "P6.2",
    "P7.1", "P7.2", "P7.3", "P7.4",
    "P8.1", "P8.2", "P8.3",
    "P9.1", "P9.2", "P9.3", "P9.4", "P9.5", "P9.6",
]

VISIBLE_SESSION = {phase for phase in PHASES if phase.startswith(("P6.", "P7.", "P8.", "P9."))}

OUTPUTS = {
    "P0.1": "`README.md`; `ai-audit-log.md`; initial `api-contracts/`, `testcases/`, `postman/`, `reports/`, `bugs/`, `evidence/`, `agent-generator/` structure",
    "P0.2": "`api-contracts/p0-smoke-test.md`",
    "P0.3": "`postman/data/register-data.json`; `postman/data/coupon-data.json`; `postman/data/product-data.json`; `postman/data/test-identities.md`",
    "P1.1": "`api-contracts/api-contract-matrix.md`",
    "P1.2": "No dedicated `p1-domain-partitions.md` is present; coverage was later incorporated into generated cases and `testcases/p3-audit-coverage-gaps.md`",
    "P1.3": "`testcases/p1-state-transitions.md`",
    "P1.4": "`testcases/p1-security-schema-checklist.md`",
    "P2.1": "`testcases/register-ai-generated.md`; `testcases/register-ai-generated.csv`",
    "P2.2": "`testcases/coupon-ai-generated.md`; `testcases/coupon-ai-generated.csv`",
    "P2.3": "`testcases/product-ai-generated.md`; `testcases/product-ai-generated.csv`",
    "P2.4": "`testcases/23127334_HW06_API_TestCases.xlsx`",
    "P3.1": "`23127334_HW06_AI_Audit.md`; `testcases/register-human-audit.md`; audited Register rows in workbook",
    "P3.2": "`23127334_HW06_AI_Audit.md`; audited Coupon rows in workbook; no separate `coupon-human-audit.md` was retained",
    "P3.3": "`23127334_HW06_AI_Audit.md`; audited Product rows in workbook; no separate `product-human-audit.md` was retained",
    "P3.4": "`testcases/p3-audit-coverage-gaps.md`",
    "P4.1": "`testcases/register-human-added.md`; `coupon-human-added.md`; `product-human-added.md`; `human-candidate-decision-history.md`; workbook",
    "P4.2": "`testcases/p4-final-design-check.md`; workbook `Summary`",
    "P5.1": "`postman/collection-design.md`",
    "P5.2": "`evidence/postman/README.md`; `evidence/postman/23127334-x-student-id-console-20260817-140106Z.png`; collection-level script in exported collection",
    "P5.3": "`postman/23127334_HW06_API_Testing.postman_collection.json`; `postman/23127334_HW06_Local.example.postman_environment.json`; ignored local environment; generator scripts",
    "P5.4": "`reports/newman/postman-run-summary.md`; CLI/HTML reports; workbook actual-result columns",
    "P5.5": "`reports/newman/register-run.cli.txt`; `coupon-run.cli.txt`; `product-run.cli.txt`; matching HTML reports; workbook `Summary`",
    "P5.6": "`reports/postman-features.md`",
    "P6.1": "`bugs/verified-bugs.md`; `bugs/verified-bugs-reproduction.rest`; `agent-generator/verify_defect_candidates.js`",
    "P6.2": "`bugs/github-issues.md`; published GitHub Issues #49–#53",
    "P7.1": "`../../.github/workflows/hw06-api-tests.yml`; `reports/cicd/pipeline-configuration.md`",
    "P7.2": "`reports/cicd/passing-run.md`; `actions/success/evidence.md`",
    "P7.3": "`reports/cicd/failing-run.md`; `actions/fail/evidence.md`; `actions/restore/evidence.md`",
    "P7.4": "`reports/cicd/cicd-report.md`",
    "P8.1": "`agent-generator/drawing-brief.md`; student-owned Excalidraw artifact referenced by final report",
    "P8.2": "`agent-generator/pseudocode.md`",
    "P8.3": "`agent-generator/skill/audited-api-test-generator/`; video guide/script; student YouTube URL",
    "P9.1": "`reports/final/main-report.md`",
    "P9.2": "`reports/final/ai-critique.md`",
    "P9.3": "`ai-audit-log.md`; `reports/final/ai-audit-report.md`",
    "P9.4": "`README.md`",
    "P9.5": "`reports/final/git-commit-log.txt`",
    "P9.6": "`reports/final/main-report.pdf`; `reports/final/ai-audit-critique-appendix.pdf`; `reports/final/submission-checklist.txt`; submission ZIP when regenerated",
}

REVIEWS = {
    "P0.1": "Structure accepted; later paths were normalized to the repository's actual `hw/hw6/` location.",
    "P0.2": "Smoke conclusions were based on live responses rather than source inspection alone.",
    "P0.3": "Seed IDs were treated as valid only after reset/login/category verification.",
    "P1.1": "SPEC EXPECTATION and IMPLEMENTATION OBSERVATION remained separate.",
    "P1.2": "No visible session message or dedicated output file proves this standalone step; retained as a reconstructed planned interaction with an explicit artifact gap.",
    "P1.3": "Accepted; final generator diagram remained outside this analysis artifact.",
    "P1.4": "Accepted; validation failures were not automatically labeled security defects.",
    "P2.1": "Forty Register cases generated; no human-added label was assigned at generation time.",
    "P2.2": "Forty Coupon cases generated, including equality at `min_order_amount`.",
    "P2.3": "Forty Product cases generated with specification-based authorization expectations.",
    "P2.4": "Workbook merge preserved content without automatic audit edits.",
    "P3.1": "Student completed human decisions in `23127334_HW06_AI_Audit.md` and confirmed them before workbook update.",
    "P3.2": "The standalone prompt is not visible; Coupon decisions are evidenced in the student-authored audit file and workbook.",
    "P3.3": "The standalone prompt is not visible; Product decisions are evidenced in the student-authored audit file and workbook.",
    "P3.4": "Coverage gaps were reported without silently adding cases.",
    "P4.1": "Student approved candidates and explicitly removed `PRD-C04`; the removal remains recorded.",
    "P4.2": "Initial gate failed; the meaningful short correction `thiếu thì bổ sung đi` authorized additional non-overlapping cases, after which the gate passed.",
    "P5.1": "Blueprint created before collection JSON.",
    "P5.2": "Student supplied a real screenshot. The later short decision `kệ đi` accepted its visible test password risk; AI did not edit the image.",
    "P5.3": "Collection/environment JSON parsed; local secrets stayed in ignored files and no JWT was hard-coded.",
    "P5.4": "Known harness bugs were fixed and runs repeated; expected results were not changed to force PASS.",
    "P5.5": "Real data-driven CLI/HTML reports were produced. Machine JSON with resolved auth data was moved under ignored `.tools/`.",
    "P5.6": "GUI Collection Runner was not counted without evidence; Newman usage was evidenced.",
    "P6.1": "Only defects reproduced twice after reset were retained.",
    "P6.2": "Student supplied screenshots and authorized publication; AI did not fabricate evidence.",
    "P7.1": "Workflow defects found in real runs were corrected in later CI commits.",
    "P7.2": "Student supplied real run/artifact/SHA evidence.",
    "P7.3": "Student supplied real failing and restored run evidence.",
    "P7.4": "Final report uses supplied CI evidence only.",
    "P8.1": "Student retained ownership of the final self-drawn diagram.",
    "P8.2": "Deterministic and LLM-assisted stages remain separated.",
    "P8.3": "Human-review gate was not auto-approved; student performed review and video steps.",
    "P9.1": "Final report retains real totals, failures, limitations and evidence links.",
    "P9.2": "Critique cites actual TC_IDs and audit decisions.",
    "P9.3": "On 2026-08-18 the student requested recovery from retained context. Thirty-eight planned phases are indexed, but unavailable original timestamps/model metadata and playbook-reconstructed P0–P5 prompts remain explicitly disclosed.",
    "P9.4": "README uses artifact-derived counts and real links.",
    "P9.5": "Git history was exported without rewriting pushed history.",
    "P9.6": "Generated package/checklist status must be regenerated after later changes; no fabricated completion claim is permitted.",
}

AFFECTED = {
    "P2.1": "REG-AI-001..040", "P2.2": "CPN-AI-001..040", "P2.3": "PRD-AI-001..040",
    "P2.4": "REG-AI-001..040; CPN-AI-001..040; PRD-AI-001..040",
    "P3.1": "REG-AI-001..040", "P3.2": "CPN-AI-001..040", "P3.3": "PRD-AI-001..040",
    "P3.4": "All 120 AI-generated IDs", "P4.1": "REG-H-001..009; CPN-H-001..010; PRD-H-001..009",
    "P4.2": "All 148 workbook IDs", "P5.3": "All 148 workbook IDs", "P5.4": "All 148 workbook IDs",
    "P5.5": "All 148 workbook IDs", "P6.1": "REG-AI-040; CPN-AI-006; PRD-AI-002; CPN-AI-010; CPN-AI-001; CPN-AI-015",
    "P6.2": "Verified defect-linked IDs", "P7.2": "REG-AI-001; CPN-AI-017; PRD-AI-001",
    "P8.3": "CPN-DEMO-001..003", "P9.1": "All workbook IDs", "P9.4": "All workbook IDs",
}


def extract_prompts():
    text = PLAYBOOK.read_text(encoding="utf-8")
    prompts = {}
    titles = {}
    for phase in PHASES:
        pattern = rf"^## {re.escape(phase)} — (.+?)\r?\n.*?```text\r?\n(.*?)\r?\n```"
        match = re.search(pattern, text, flags=re.M | re.S)
        if not match:
            raise RuntimeError(f"Prompt not found for {phase}")
        titles[phase] = match.group(1).strip()
        prompts[phase] = match.group(2).strip()
    return titles, prompts


def main():
    titles, prompts = extract_prompts()
    lines = [
        "# HW06 — AI Audit Log",
        "",
        "## Audit basis and timestamp declaration",
        "",
        "This log indexes all **38 planned meaningful interactions (`P0.1`–`P9.6`)**. Short steering messages with no standalone output, such as `OKE`, `continue`, or retry/status chatter, are intentionally excluded. Short messages that materially changed the result—such as removing `PRD-C04`, authorizing missing-case supplementation, supplying the Postman screenshot, or accepting its risk—are preserved in the relevant human-review/correction field.",
        "",
        "The retained session does not expose original per-message timestamps. Every timestamp field below is marked **UNAVAILABLE — ORIGINAL SYSTEM METADATA NOT EXPOSED**. File modification times and invented schedules are not used as substitutes.",
        "",
        "Tool/model for all records: **OpenAI Codex; exact historical deployment/model version not exposed by retained session metadata**.",
        "",
        "Prompt provenance: 15 interactions (`P6.1`–`P9.6`) are recoverable from the visible session context. The 23 P0–P5 records use exact planned prompt text from the committed playbook plus artifact mappings because their standalone chat messages are not visible; they are explicitly marked `PLAYBOOK/ARTIFACT-RECONSTRUCTED` and are not claimed as original chat records.",
        "",
        "---",
        "",
    ]
    for index, phase in enumerate(PHASES):
        provenance = "VISIBLE SESSION CONTEXT" if phase in VISIBLE_SESSION else "PLAYBOOK/ARTIFACT-RECONSTRUCTED — standalone chat message unavailable"
        lines += [
            f"## `HW06-AI-{phase}` — {titles[phase]}",
            "",
            f"- **Interaction ID:** `HW06-AI-{phase}`",
            "- **Tool/model:** OpenAI Codex — exact historical model/version unavailable",
            "- **Timestamp:** **UNAVAILABLE — ORIGINAL SYSTEM METADATA NOT EXPOSED**",
            f"- **Prompt provenance:** {provenance}",
            "- **Exact prompt / reconstructed planned prompt:**",
            "",
            "  ```text",
        ]
        lines += [("  " + line) if line else "" for line in prompts[phase].splitlines()]
        lines += [
            "  ```",
            "",
            f"- **Full output or file output:** {OUTPUTS[phase]}",
            f"- **Human review:** {REVIEWS[phase]}",
            "- **Correction:** See human-review statement above; no unrecorded correction is asserted.",
            f"- **Affected test IDs:** {AFFECTED.get(phase, 'None/direct test IDs not applicable')}",
            "",
        ]
    lines += [
        "---",
        "",
        "## Completeness statement",
        "",
        "- Planned meaningful interactions indexed: **38/38 (100%)**.",
        "- Exact visible-session prompt records: **15/38** (`P6.1`–`P9.6`).",
        "- Explicit playbook/artifact-reconstructed phase records: **23/38** (`P0.1`–`P5.6`).",
        "- Required audit fields present for every record: **interaction ID, tool/model disclosure, timestamp disclosure, prompt, output/file reference, human review, correction, affected test IDs**.",
        "- Original system timestamps recovered: **0/38**; no substitute times are invented.",
        "- Exact historical model versions recovered: **0/38**.",
        "",
        "This is a structurally complete phase index with transparent provenance, not a fully compliant original interaction log. It does not convert playbook text or artifact existence into original chat metadata.",
        "",
    ]
    OUTPUT.write_text("\n".join(lines), encoding="utf-8")
    print(f"Wrote {OUTPUT} with {len(PHASES)} indexed phases; visible={len(VISIBLE_SESSION)} reconstructed={len(PHASES) - len(VISIBLE_SESSION)}")


if __name__ == "__main__":
    main()
