# Self-recording and narration guide

**Published student recording:** [YouTube — HW06 Agent Skill demonstration](https://youtu.be/OpEuJcmNQPU)

For a timed, scene-by-scene script with exact terminal commands and narration, use [`video-script.md`](./video-script.md).

## Before recording

- Use the single operation in `demo-one-api.md`; do not introduce another API.
- Prepare the specification file, skill folder, terminal, generated review package, and output directory.
- Remove or mask passwords, tokens, cookies, personal notifications, unrelated tabs, and repository secrets.
- Use your real GitHub/YouTube account only when you choose to upload. This guide contains no fabricated video or URL evidence.

## Recording sequence

1. Show the skill folder and briefly state its purpose: specification to audited API test cases.
2. Show that the demo input contains only `POST /api/coupons/apply`.
3. Run or explain source validation and contract extraction. Point out deterministic parsing versus constrained LLM semantic extraction.
4. Show the generated happy-path, `>= 100` boundary, missing-authentication, schema, and percent-calculation candidates.
5. Show deduplication and traceability/coverage results.
6. Show the review package in `awaiting_human_review` state.
7. Run the validator and show `EXPORT_BLOCKED` before approval.
8. Review the cases yourself. On screen, enter your real reviewer name, current timezone-aware timestamp, decision, and rationale.
9. Run the validator again and show `EXPORT_ALLOWED` only if every gate condition passes.
10. Show the exported Excel/Postman-ready artifacts, manifest hashes, and sanitized AI audit events.
11. Close by stating the limitations: one-operation demo, LLM proposals require deterministic checks, and human approval cannot be automated.

## Suggested narration

Explain that deterministic code owns file/schema validation, boundaries, stable IDs, coverage, approval enforcement, exports, hashes, and secret scans. Explain that the LLM only proposes semantic extraction, gaps, or additional candidates with citations. Emphasize that an unresolved gap or absent human approval blocks export.

## Recording and upload checklist

- Record locally with your preferred screen recorder and microphone.
- Verify text is readable and terminal output does not expose secrets.
- Trim only dead time; do not edit the recording to imply a gate passed when it did not.
- Watch the final file once from start to finish.
- Upload it yourself through YouTube Studio and select the visibility required by your course.
- Copy the real YouTube URL only after upload completes and playback works.
- Save the real URL and any required evidence in the course-designated report yourself. Record no URL before a successful upload, and do not ask the agent to invent one.
