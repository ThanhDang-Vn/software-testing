# HW06 AI Audit Report

## Declaration

**I use AI tools for the following tasks:** contract extraction and comparison; EP/BVA, state, security, and schema test ideation; generation and critique of draft test cases; Postman/Newman automation support; failure triage and bug-draft preparation; CI/CD configuration support; agent-generator architecture, pseudocode, reusable-skill authoring; and final-report drafting.

The evidenced AI tool is **OpenAI Codex**. The exact historical deployment/model version is not exposed by retained session metadata and is not invented. Postman, Newman 6.2.1, Node.js 20.20.2, GitHub Actions, Excel/openpyxl, PowerShell, and Git are execution/development tools rather than AI tools.

## Source-log result

Source reviewed: [`hw6/ai-audit-log.md`](../../ai-audit-log.md).

The log indexes **38/38 planned phases (`P0.1`–`P9.6`)** and supplies each structural field, while preserving whether the underlying interaction was actually visible. An indexed reconstructed phase is not treated as an original chat record.

Provenance is not uniform:

- **15/38** records (`P6.1`–`P9.6`) are recoverable from visible session context.
- **23/38** records (`P0.1`–`P5.6`) use exact planned text and artifact mappings because their standalone retained chat messages are unavailable.
- **0/38** original per-message system timestamps are exposed.
- **0/38** exact historical model versions are exposed.

No timestamp schedule is reconstructed. All 38 timestamp fields are marked **UNAVAILABLE — ORIGINAL SYSTEM METADATA NOT EXPOSED**; file modification times are not substituted.

## P0–P9 structural completeness

| Phase | Planned | Indexed | Visible session | Playbook/artifact reconstructed | Evidence status |
| --- | ---: | ---: | ---: | ---: | --- |
| P0 | 3 | 3 | 0 | 3 | RECONSTRUCTED |
| P1 | 4 | 4 | 0 | 4 | RECONSTRUCTED |
| P2 | 4 | 4 | 0 | 4 | RECONSTRUCTED |
| P3 | 4 | 4 | 0 | 4 | RECONSTRUCTED |
| P4 | 2 | 2 | 0 | 2 | RECONSTRUCTED |
| P5 | 6 | 6 | 0 | 6 | RECONSTRUCTED |
| P6 | 2 | 2 | 2 | 0 | PARTIAL METADATA |
| P7 | 4 | 4 | 4 | 0 | PARTIAL METADATA |
| P8 | 3 | 3 | 3 | 0 | PARTIAL METADATA |
| P9 | 6 | 6 | 6 | 0 | PARTIAL METADATA |
| **Total** | **38** | **38** | **15** | **23** | **INCOMPLETE ORIGINAL EVIDENCE** |

## Short-message handling

Messages such as `OKE`, `continue`, status questions, and retry chatter were excluded because they produced no standalone artifact. Short decisions with material effect were retained inside the relevant interaction's human-review/correction field, including removal of `PRD-C04`, authorization to supplement missing cases, delivery of the real Postman screenshot, and acceptance of its visible-password limitation.

## Compliance boundary

The audit file is complete only as a transparent **phase index**. It is not a fully compliant original interaction log: P0–P5 prompts are playbook/artifact reconstructions, and no original per-message timestamp or exact historical model version is available. A genuine platform export is required to close those gaps.
