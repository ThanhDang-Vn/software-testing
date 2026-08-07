---
name: hw03-gui-usability-testing
version: 1.0.0
description: Execute HW03 GUI and Usability Testing as a strict, evidence-driven workflow covering GUI checklist design and execution, moderated usability testing, cross-platform testing, reports, AI audit, Agent Skill evidence, and final submission validation.
---

# HW03 GUI and Usability Testing

## Goal

Complete HW03 end to end and produce every required artifact without fabricating participants, executions, screenshots, recordings, browser runs, GitHub issues, or Git commits.

## Response Style

- Be concise and execution-focused.
- Work one phase at a time.
- Do not skip required gates.
- Do not generate unrelated recommendations.
- Use Markdown tables for structured outputs.
- Always state the exact output file path created or updated.

## Required Inputs

Collect these before execution:

- `student_id`
- `full_name`
- `self_assessed_grade`
- `sut_repository`
- `selected_gui_screens`
- `selected_usability_flow`
- `target_user_profile`
- `github_issues_url`
- `platforms_to_test`
- `usability_scale`: `SUS` or `UEQ-S`

Do not continue when a required input for the current phase is missing.

## Mandatory Constraints

1. The GUI checklist must contain more than 40 meaningful, non-repetitive items.
2. The checklist must cover `IA-01`, `IA-02`, `IA-03`, and `IA-04`.
3. Every checklist item must include source, expected result, actual result, status, and notes.
4. Screenshots are required for failed checklist items only.
5. Every genuine bug must be reported in the Markdown report and on GitHub Issues.
6. The usability evaluation requires seven real participants outside the class.
7. Participant contact details must be verifiable and have the middle four digits masked where applicable.
8. A pilot session must happen before the seven official sessions.
9. Each session must collect observations, questionnaire responses, and probe-question answers.
10. Cross-platform testing must cover at least three platforms.
11. Every cross-platform screenshot must show the browser, OS or device, SUT URL, and `StudentID@hcmus.edu.vn` overlay.
12. AI Audit entries must record tool name, date/time, prompt, and AI output.
13. AI Critique must be 200–300 words.
14. Create a Git commit for each major testing step.
15. Never claim a manual action was completed without user-provided or tool-produced evidence.

## Output Structure

Create and maintain this structure:

```text
<StudentID>_HW03_AI_GUIUsability_<Grade>/
├── README.md
├── git-commit-log.txt
├── reports/
│   ├── main-report.md
│   ├── main-report.pdf
│   ├── ai-audit-report.md
│   ├── ai-audit-report.pdf
│   ├── ai-critique.md
│   └── ai-critique.pdf
├── task-1-gui-checklist/
│   ├── gui-checklist.xlsx
│   ├── bug-report.md
│   ├── github-issues-links.md
│   └── failed-screenshots/
├── task-2-usability/
│   ├── objective.md
│   ├── task-scenario.md
│   ├── participant-list.xlsx
│   ├── pilot-session/
│   │   └── pilot-notes.md
│   ├── sessions/
│   │   ├── P01/
│   │   ├── P02/
│   │   ├── P03/
│   │   ├── P04/
│   │   ├── P05/
│   │   ├── P06/
│   │   └── P07/
│   ├── sus-ueqs-summary.xlsx
│   ├── severity-ranked-findings.md
│   └── recording-links.md
├── task-3-cross-platform/
│   ├── test-summary.md
│   └── screenshots/
└── agent-skills/
    ├── SKILL.md
    └── demo-video-links.md
```

Final archive name:

```text
<StudentID>_HW03_AI_GUIUsability_<000-100>.zip
```

## Workflow

### Phase 0 — Initialize and Validate Scope

1. Collect all required inputs.
2. Verify that selected screens and usability flow are not duplicated within the group.
3. Create the output structure.
4. Create the first AI Audit entry.
5. Commit:

```text
chore(hw03): initialize assignment structure and scope
```

**Gate:** Do not start Task 1 until the scope is confirmed.

### Phase 1 — Analyse the Selected GUI Scope

Create `reports/main-report.md` sections for:

- Selected screens
- User goals
- Main UI components
- Forms
- Navigation paths
- Feedback and state changes
- Accessibility risks
- Responsive and theme risks

Do not create checklist results yet.

Commit:

```text
docs(gui): document selected screens and interface risks
```

### Phase 2 — Generate the Initial GUI Checklist

Generate the initial checklist using these columns:

| ID  | Screen | IA  | Category | Check | Preconditions | Test Action | Expected Result | Source | Status | Actual Result | Notes | Evidence |
| --- | ------ | --- | -------- | ----- | ------------- | ----------- | --------------- | ------ | ------ | ------------- | ----- | -------- |

Rules:

- `IA` must be one of `IA-01`, `IA-02`, `IA-03`, `IA-04`.
- `Source` must be `AI Initial`, `Human Added`, or `Refined`.
- Keep each item atomic and testable.
- Avoid duplicate checks with different wording.
- Ensure every selected screen has meaningful coverage.
- Keep execution fields empty at this phase.

Commit:

```text
test(gui): add initial AI-generated checklist
```

### Phase 3 — Human Review and Checklist Expansion

Review every item and add missed checks.

For every `Human Added` item, record:

| Checklist ID | Missed Aspect | Why AI Missed It | Correction |
| ------------ | ------------- | ---------------- | ---------- |

Explicitly inspect:

- Accessibility
- Keyboard navigation
- Focus state
- Error prevention and recovery
- Loading, empty, success, and failure states
- Responsive layout
- Dark mode, when supported
- RTL behavior, when relevant
- Localization and Vietnamese text rendering
- Browser zoom and text scaling

**Gate:** Checklist count must be greater than 40 and all four IA groups must be covered.

Commit:

```text
test(gui): review and expand checklist coverage
```

### Phase 4 — Execute the GUI Checklist

For each checklist item:

1. Execute it on the SUT.
2. Set `Status` to `Passed`, `Failed`, or `Blocked`.
3. Record the actual result.
4. Add notes for every `Failed` or `Blocked` item.
5. Save screenshots only for failed items.
6. Use evidence names such as `GUI-001.png`.

Never infer execution results from source code alone.

Commit:

```text
test(gui): execute checklist and capture failures
```

### Phase 5 — Report GUI Bugs

For each failed item that represents a genuine bug, create:

- A Markdown bug entry in `task-1-gui-checklist/bug-report.md`
- A GitHub Issue
- A screenshot attachment
- A link in `github-issues-links.md`

Bug format:

| Field         | Value                           |
| ------------- | ------------------------------- |
| Bug ID        | `BUG-GUI-###`                   |
| Title         | Clear observed failure          |
| Environment   | Browser, OS, build              |
| Preconditions | Required state                  |
| Steps         | Reproducible numbered steps     |
| Expected      | Intended behavior               |
| Actual        | Observed behavior               |
| Severity      | Blocker, Critical, Major, Minor |
| Evidence      | Screenshot path                 |
| GitHub Issue  | Issue URL                       |

Commit:

```text
fix-report(gui): document discovered GUI defects
```

### Phase 6 — Prepare the Usability Evaluation

Create:

- `objective.md`
- `task-scenario.md`
- Questionnaire using SUS or UEQ-S
- Probe questions covering clarity, error recovery, speed, and trust
- Participant profile and recruitment criteria
- Moderator script
- Consent statement
- Observation template

Scenario rule: provide a goal, not step-by-step instructions.

Commit:

```text
docs(usability): prepare objectives scenario and instruments
```

### Phase 7 — Run and Review the Pilot

Record:

- Pilot participant profile
- Scenario misunderstandings
- Broken or blocked steps
- Timing problems
- Moderator mistakes
- Instrument changes
- Final refinements

**Gate:** Do not start official sessions until pilot issues are resolved.

Commit:

```text
test(usability): complete pilot and refine protocol
```

### Phase 8 — Conduct Seven Official Sessions

For each `P01` to `P07`, create:

```text
sessions/P0X/
├── observation-notes.md
├── questionnaire-response.md
├── probe-answers.md
└── evidence-links.md
```

Capture at minimum:

- Date and time
- Device, OS, and browser
- Consent status
- Completion outcome
- Completion time
- Errors
- Wrong turns
- Hesitations of at least five seconds
- Moderator interventions
- Friction points
- Verbalized frustration
- Questionnaire answers
- Probe-question answers
- Recording link, when available

Rules:

- Test the product, not the participant.
- Ask the participant to think aloud.
- Do not provide leading hints.
- Intervene only when the participant is completely stuck.
- Do not fabricate participant identities or evidence.

Commit once per session:

```text
test(usability): complete participant P0X session
```

### Phase 9 — Analyse Usability Results

Calculate and report:

- SUS or UEQ-S score per participant
- Overall score
- Task completion rate
- Average completion time
- Error count
- Wrong-turn count
- Hesitation count
- Intervention count

Group findings by common pain point and separate:

- Isolated software bugs
- Repeated usability problems
- Systemic design issues

Rank each finding:

| Severity | Meaning                                       |
| -------- | --------------------------------------------- |
| Blocker  | Prevents task completion                      |
| Critical | Causes major failure or abandonment risk      |
| Major    | Causes repeated friction or serious confusion |
| Minor    | Small visual or interaction problem           |

Create GitHub Issues for genuine bugs.

Commit:

```text
analysis(usability): score sessions and prioritize findings
```

### Phase 10 — Execute Cross-Platform Testing

Test at least three platforms and record:

| Platform ID | Browser | Version | OS or Device | Screen or Flow | Result | Issues | Screenshot |
| ----------- | ------- | ------- | ------------ | -------------- | ------ | ------ | ---------- |

Required coverage must include Chrome, Firefox, and Safari or Android Chrome, unless Expo Go replaces one platform.

Every screenshot must visibly include:

- Browser, OS, or device identity
- SUT localhost URL
- `StudentID@hcmus.edu.vn` overlay

Commit:

```text
test(platform): complete cross-browser and cross-platform runs
```

### Phase 11 — Build Reports

Update `reports/main-report.md` with:

1. Scope and environment
2. GUI checklist design
3. Human review of AI output
4. Checklist execution summary
5. GUI bugs
6. Usability plan
7. Pilot session
8. Seven-session results
9. Usability analysis
10. Cross-platform results
11. Limitations
12. Conclusion
13. Referenced GitHub Issues and evidence

Export to `main-report.pdf`.

Commit:

```text
docs(report): complete main report and PDF
```

### Phase 12 — Build AI Audit and AI Critique

For every AI interaction, append:

```markdown
## Interaction <N>

- Tool:
- Date and time:
- Purpose:
- Prompt:
- AI output:
- Human review and corrections:
- Output files affected:
```

AI Critique must be 200–300 words and answer:

- What was wrong, biased, or incomplete?
- Why did AI miss it?
- What principle was learned about collaborating with AI?

Export both Markdown files to PDF.

Commit:

```text
docs(ai): complete AI audit and critique
```

### Phase 13 — Agent Skill Demonstration

Copy this skill into `agent-skills/SKILL.md`.

Record demo links showing end-to-end execution on:

- One complete GUI screen
- One complete usability flow

Save links in `agent-skills/demo-video-links.md` and `README.md`.

Commit:

```text
docs(skill): add agent skill and demonstration links
```

### Phase 14 — Final README and Validation

README must contain:

- Student information
- Scope
- Self-assessment table
- Number of screens tested
- Number of flows tested
- Checklist items designed
- Checklist items executed
- Passed, failed, and blocked totals
- Number of bugs
- Number of participants
- Platforms tested
- Demo-video links

Run the final validation checklist:

- [ ] Main report exists in Markdown and PDF.
- [ ] GUI checklist has more than 40 items.
- [ ] All IA groups are covered.
- [ ] Every failed GUI item has notes and a screenshot.
- [ ] Every genuine bug appears in Markdown and GitHub Issues.
- [ ] Pilot evidence exists.
- [ ] Seven real participant folders exist.
- [ ] Participant table contains verifiable masked contacts.
- [ ] SUS or UEQ-S summary exists.
- [ ] Findings are grouped and severity-ranked.
- [ ] At least three platforms were tested.
- [ ] Cross-platform screenshots contain the required identity overlay.
- [ ] AI Audit exists in Markdown and PDF.
- [ ] AI Critique is 200–300 words and exists in Markdown and PDF.
- [ ] Git commit log exists.
- [ ] Agent Skill and demo links exist.
- [ ] README contains the self-assessment and test summary.
- [ ] Final ZIP name follows the required format.

Commit:

```text
chore(submission): finalize and validate HW03 package
```

## Execution Status Format

After each phase, respond only with:

```markdown
## Phase <N> — <Name>

**Status:** Completed | Blocked | Needs evidence

**Created or updated:**

- `<exact/file/path>`

**Validation:**

- <requirement>: Pass | Fail

**Next required input:**

- <only the information needed for the next phase>
```

## Prohibited Behavior

- Do not fabricate seven participants.
- Do not fabricate contact details.
- Do not invent screenshots or recordings.
- Do not mark checklist items as executed without running them.
- Do not claim cross-platform coverage from responsive simulation alone.
- Do not create fake GitHub Issue links.
- Do not omit AI interactions from the audit.
- Do not replace user evidence with AI-generated evidence.
- Do not continue past a failed gate.
- Do not produce long explanations when an artifact or action is required.
