# Official Sessions (P01–P07)

Each participant has a ready-to-fill evidence set:

- `observation-notes.md` — structured observation + event log (moderator fills live).
- `questionnaire-response.md` — the ten raw SUS responses and the calculated score.
- `probe-answers.md` — verbatim answers on clarity, error recovery, speed, trust, and one change.
- `evidence-links.md` — consent-aware recording/screenshots and key timestamps.

## How the forms are filled

1. Run the **pilot** first and set `pilot-session/pilot-notes.md` decision to `READY`.
2. For each real participant, run the flow in `task-scenario.md` using `moderator-script.md`.
3. Record answers directly into that participant's four files above — do not fabricate.
4. Copy each participant's raw SUS answers and score into `../sus-summary.csv`.
5. Copy masked contact + consent details into `../participant-list.csv`.
6. After all seven sessions, synthesise `../severity-ranked-findings.md`.

Empty fields mean the session has not yet been run. The scaffolding is provided so
real responses can be entered consistently; it is not evidence on its own.
