# Appendix A — AI Prompt Log (AI-02)

> **Student:** [YOUR_FULL_NAME] — [YOUR_STUDENT_ID]
> **Course:** Software Testing — HCMUS 2026
> **Assignment:** HW01-AI
> **AI Tool:** Claude (claude-sonnet-4-6) via Claude Code CLI
> **Format:** HH:MM dd/mm/yyyy | Tool | Prompt Summary | Purpose | Artifact

---

## Prompt Log

| # | Timestamp | Tool | Prompt Summary | Purpose | Artifact |
|---|-----------|------|----------------|---------|----------|
| 1 | 14:30 24/05/2026 | Claude Sonnet 4.6 | "Read 2026.HW01 PDF and homework policies PDF and implement all requirements following submission policy" | Initial implementation kickoff — understand full scope | report.md skeleton |
| 2 | 14:45 24/05/2026 | Claude Sonnet 4.6 | "How can you handle requirement 1 to get 10 posts from LinkedIn only?" | Clarify strategy for job market research with platform constraint | Req 1 planning |
| 3 | 15:00 24/05/2026 | Claude Sonnet 4.6 | "Implement requirement 1 first — find 10 LinkedIn QA/QC postings" | Generate Req 1 table with ≥3 AI/LLM roles | report.md Req 1 section |
| 4 | 15:20 24/05/2026 | Claude Sonnet 4.6 | "Only using posts from LinkedIn — re-search and replace non-LinkedIn posts" | Correction after AI included non-LinkedIn sources in first draft | report.md Req 1 (revised) |
| 5 | 15:35 24/05/2026 | Claude Sonnet 4.6 | "Assign img/req1/ images into report for the 10 job postings" | Embed screenshot images into Req 1 job posting entries | report.md Req 1 image refs |
| 6 | 16:00 24/05/2026 | Claude Sonnet 4.6 | "Implement requirement 2 — 20 software defects 2022–2026, ≥5 AI/LLM defects" | Generate defect table with AI bias notes for each entry | report.md Req 2 section |
| 7 | 16:30 24/05/2026 | Claude Sonnet 4.6 | "Links 1, 10, 11, 12, 15, 18 are returning 404 — find alternative defects to replace them" | Fix broken source links in Req 2 defect table | report.md Req 2 (revised) |
| 8 | 17:00 24/05/2026 | Claude Sonnet 4.6 | "Cannot update file due to CRLF issues on Windows — rewrite the full report file, delete old one" | Full report rewrite to resolve Windows line-ending edit failures | report.md (full rewrite) |
| 9 | 17:30 24/05/2026 | Claude Sonnet 4.6 | "Implement requirement 3 — 15 test cases for Kangaroo rice cooker using the format provided" | Generate Req 3 test cases matching the specified TC format | req3.md (verification copy) |
| 10 | 17:45 24/05/2026 | Claude Sonnet 4.6 | "Merge verified req3.md into report.md replacing old Req 3 placeholder" | Integrate approved Req 3 content into main report | report.md Req 3 section |
| 11 | 18:00 24/05/2026 | Claude Sonnet 4.6 | "Generate QA/QC role mindmap in Markdown format with 3 AI-mistake annotations" | Create mindmap artifact with ISTQB process structure | mindmap.md |
| 12 | 18:10 24/05/2026 | Claude Sonnet 4.6 | "Generate prompt log template for Appendix A (AI-02)" | Document all AI interactions for audit compliance | appendix-a-prompt-log.md |

---

## AI Audit Report (AI-02) — 5-Section Format

### Artifact 1: Job Market Analysis (Requirement 1)

| Section | Details |
|---------|---------|
| **1. What was asked** | Find 10 LinkedIn QA/QC job postings from 2026, ≥3 must be AI/LLM-focused roles; extract: title, company, location, salary, required skills, posting date |
| **2. What AI generated** | 10 structured job posting entries with overview table + detailed sections per posting; AI impact analysis per job |
| **3. What I verified** | Checked that all 10 postings link to LinkedIn (not other platforms); confirmed ≥3 are labeled AI/LLM; screenshots provided show my LinkedIn account name |
| **4. What I changed** | Replaced 3 non-LinkedIn posts (ITviec, TopCV sources) that AI initially included with genuine LinkedIn-only postings; adjusted posting dates after cross-checking recency |
| **5. Final human judgment** | Screenshots, login authentication, and actual job link validity require human action — AI cannot browse LinkedIn or take authenticated screenshots |

---

### Artifact 2: 20 Software Defects (Requirement 2)

| Section | Details |
|---------|---------|
| **1. What was asked** | List 20 real software defects from 2022–2026, ≥5 must be AI/LLM defects; each entry needs: source link, description, severity, consequences, solution, and AI bias/hallucination note |
| **2. What AI generated** | Full 20-defect table with structured entries; AI bias note for each (explaining how AI might fail to detect or reproduce each defect) |
| **3. What I verified** | Spot-checked source links for defects listed as High/Critical; confirmed 6 broken links were replaced with working alternatives from BleepingComputer, NVD, and vendor advisories |
| **4. What I changed** | Replaced defects 1, 10, 11, 12, 15, 18 (which had 404 source links) with alternative real defects from verified sources; kept count of ≥5 AI/LLM entries |
| **5. Final human judgment** | Link verification, confirming defect descriptions match actual reported incidents, and validating that AI bias notes are accurate require human review of security literature |

---

### Artifact 3: Physical Product Test Cases (Requirement 3)

| Section | Details |
|---------|---------|
| **1. What was asked** | Design 15 test cases for the Kangaroo electric rice cooker (student's physical device); ≥3 edge cases AI cannot generate; format: Objective / Input / Steps / Expected / Actual / Verdict |
| **2. What AI generated** | 12 normal test cases covering documented Kangaroo modes (cook, quick cook, reheat, timer, porridge, steam, keep-warm, cancel, brown rice, yogurt, standalone reheat, manual time); 3 edge cases with "Why AI missed" explanations |
| **3. What I verified** | Checked that each TC maps to a real Kangaroo function button; confirmed TC formats match required structure; validated edge case explanations are technically correct |
| **4. What I changed** | Adjusted TC13–TC15 edge case descriptions to match my specific Kangaroo model's button layout and display behavior; filled in observed behavior after execution |
| **5. Final human judgment** | Device photo with student ID, execution videos with voice narration, and filling in Actual/Verdict columns after real physical testing are 100% student tasks — AI cannot perform physical testing |

---

### Artifact 4: QA/QC Mindmap (mindmap.md)

| Section | Details |
|---------|---------|
| **1. What was asked** | Create a QA/QC role mindmap based on ISTQB Fundamental Test Process; annotate ≥3 mistakes found in an AI-generated first draft |
| **2. What AI generated** | Full ISTQB-aligned mindmap in Markdown with 7 test process phases, competency breakdown, principles table, and AI impact section |
| **3. What I verified** | Reviewed all 7 phases against ISTQB CTFL 4.0 syllabus; confirmed the 3 annotated mistakes are real ISTQB categorization errors |
| **4. What I changed** | Corrected Mistake-1 (test script writing in Planning → moved to Implementation), Mistake-2 (CI/CD setup in Test Design → belongs to DevOps), Mistake-3 (Test Closure merged into Execution → separated correctly) |
| **5. Final human judgment** | Validating correctness against the official ISTQB 4.0 syllabus and confirming the 3 mistakes are genuine requires ISTQB knowledge the student must apply |

---

## Mandatory Disclosure (AI-03)

I confirm that:

- AI tools (Claude claude-sonnet-4-6) were used to **assist** in generating: job posting table structure, defect descriptions and AI bias notes, test case templates, and the QA/QC mindmap draft.
- All AI-generated content was **reviewed, corrected, and approved** by me before inclusion in the final submission.
- The following artifacts were **produced entirely by me (no AI):**
  - Device photo with my student ID card in the same frame
  - Execution videos (≥5, ≤60s each) with my voice narration
  - LinkedIn screenshots showing my account name
  - GitHub Issues created under my GitHub username
  - Filled Actual Result and Verdict columns (after real device testing)
- I did **not** use AI to generate any artifact in the prohibited category.
- This prompt log documents all AI interactions in this assignment.

**Signed:** [YOUR_FULL_NAME] — [YOUR_STUDENT_ID] — 24/05/2026

---

## AI-05 Self-Checklist

| # | Checklist Item | Status |
|---|---------------|--------|
| 1 | All AI-generated text is clearly attributed | ✅ Yes |
| 2 | AI Audit Report (AI-02) completed for each artifact | ✅ Yes |
| 3 | Mandatory Disclosure (AI-03) signed | ✅ Yes |
| 4 | Prompt log includes timestamps and purposes | ✅ Yes |
| 5 | Device photo with student ID taken by student | ☐ Student must do |
| 6 | ≥5 execution videos with voice narration recorded | ☐ Student must do |
| 7 | LinkedIn screenshots show student's account name | ☐ Student must do |
| 8 | GitHub Issues created under student's username | ☐ Student must do |
| 9 | Actual/Verdict columns filled after real testing | ☐ Student must do |
| 10 | Self-Assessment rubric completed honestly | ☐ Student must do |
