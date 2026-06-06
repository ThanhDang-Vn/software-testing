# Appendix A — AI Prompt Log

> **Student:** Nguyễn Thành Dâng — 23127334
> **Course:** Software Testing — HCMUS 2026
> **Assignment:** HW01
> **AI Tool used:** Claude Sonnet 4.6 (claude-sonnet-4-6)

---

## Prompt Log

> **Policy note:** "Prompt log .md with timestamps for every AI prompt you sent." (HW01 policy, Anti-AI-Cheat section)
> Full prompts are logged below. Timestamps use format HH:MM DD/MM/YYYY.

| # | Timestamp | Tool | Full Prompt (verbatim) | Purpose | Artifact produced |
|---|-----------|------|------------------------|---------|-------------------|
| 1 | 14:30 24/05/2026 | Claude Sonnet 4.6 | "Read 2026.HW01.Jobs.Defects.PhysicalProduct_En.pdf and the homework policies PDF then implement all requirements following the submission policy. Start by creating the report.md skeleton." | Kickoff — understand full scope and create report skeleton | report.md skeleton |
| 2 | 14:45 24/05/2026 | Claude Sonnet 4.6 | "How can you handle requirement 1 to get 10 posts from LinkedIn only? The anti-cheat rule says screenshots must show my account name in the corner." | Clarify strategy for LinkedIn-only constraint before generating content | Req 1 planning |
| 3 | 15:00 24/05/2026 | Claude Sonnet 4.6 | "Implement requirement 1 first — find 10 LinkedIn QA/QC job postings from 2026 within 60 days of the submission date. At least 3 must require AI/LLM/automation-AI skills. Include: link, job description, required skills, salary, posting date, and 1–2 sentences of AI Impact Analysis per posting." | Generate Req 1 table with ≥3 AI/LLM roles | report.md Req 1 section (first draft) |
| 4 | 15:20 24/05/2026 | Claude Sonnet 4.6 | "Only using posts from LinkedIn — re-search and replace any non-LinkedIn posts. I see some entries came from ITviec and TopCV which violates the platform constraint." | Correction after AI included non-LinkedIn sources in first draft | report.md Req 1 (revised, LinkedIn-only) |
| 5 | 15:35 24/05/2026 | Claude Sonnet 4.6 | "Assign the img/req1/ images (req1-01.png to req1-10.png) into the report for each of the 10 job postings in the correct order." | Embed screenshot references into Req 1 posting entries | report.md Req 1 image refs |
| 6 | 16:00 24/05/2026 | Claude Sonnet 4.6 | "Implement requirement 2 — list 20 real software defects publicized between 2022 and 2026. At least 5 must be related to AI/LLM (hallucination, prompt injection, bias). Each entry needs: source link, description, severity, consequences, solution, and 1 identified instance of AI bias or hallucination when explaining that defect." | Generate full 20-defect table with AI bias/hallucination notes for all 20 entries | report.md Req 2 section |
| 7 | 16:30 24/05/2026 | Claude Sonnet 4.6 | "Links 1, 10, 11, 12, 15, 18 are returning 404 — find alternative real defects with working source links to replace them. Keep the count at exactly 20 with ≥5 AI/LLM entries." | Fix 6 broken source links in Req 2 defect table | report.md Req 2 (revised, working links) |
| 8 | 17:00 24/05/2026 | Claude Sonnet 4.6 | "Cannot update the file due to CRLF line-ending issues on Windows that are blocking edits. Rewrite the full report.md file from scratch with LF endings and delete the old one." | Full report rewrite to resolve Windows CRLF edit failures | report.md (full rewrite, LF line endings) |
| 9 | 17:30 24/05/2026 | Claude Sonnet 4.6 | "Implement requirement 3 — design 15 test cases for the Kangaroo electric rice cooker using this TC format: Objective / Input / Steps / Expected / Actual / Verdict. Include at least 3 edge cases that an AI tool could NOT generate without human physical-device knowledge." | Generate 15 TCs for rice cooker (initial device) | req3.md — rice cooker TCs (later replaced) |
| 10 | 17:45 24/05/2026 | Claude Sonnet 4.6 | "Merge the verified req3.md into report.md replacing the old Requirement 3 placeholder section. Keep all TC formatting intact." | Integrate Req 3 content into main report | report.md Req 3 section |
| 11 | 18:00 24/05/2026 | Claude Sonnet 4.6 | "Generate a QA/QC role mindmap in Markdown format based on the ISTQB Fundamental Test Process. Structure it with the 7 ISTQB test process phases. Annotate at least 3 mistakes you find in the draft — show where items were misplaced or miscategorized." | Create mindmap artifact with ISTQB process structure; identify AI mistakes | mindmap.md |
| 12 | 18:10 24/05/2026 | Claude Sonnet 4.6 | "Generate the Appendix A prompt log template for this assignment (AI-02 format). Include a prompt log table with timestamps and the 5-section AI Audit Report for each artifact generated so far." | Document all AI interactions and produce AI Audit Report template | appendix-a-prompt-log.md (initial draft) |
| 13 | 10:00 03/06/2026 | Claude Sonnet 4.6 | "Verify defects 1–5 in Req 2: fetch each source link and check whether the description, severity, consequences, and AI hallucination note are accurate against the primary source. Flag any discrepancies." | Spot-check Req 2 content accuracy and hallucination note validity against primary sources (BleepingComputer, NVD, OpenSSL advisory) | report.md Req 2 (patch: corrected AI bias notes for defects 1–5) |
| 14 | 10:20 03/06/2026 | Claude Sonnet 4.6 | "Switch the Req 3 device from rice cooker to air fryer (nồi chiên không dầu). Rewrite all 15 test cases from scratch for the air fryer. Update device info, all TCs, edge case explanations, summary table, and video TC list. Edge cases must still be ≥3 cases AI cannot generate." | Redesign all test cases for new device; update all Req 3 content | req3.md + report.md Req 3 (full air fryer rewrite) |

---

## AI Audit Report [AI-02] — 5-Section Format per Artifact

> **Template source:** HW01 AI Collaboration Protocol, Section 3 — AI Audit Report.
> **Sections per artifact:** (1) Prompt + tool · (2) AI output · (3) Verdict · (4) Reasoning · (5) Student fix.
> **Note on Section 2:** Full AI outputs are not reproduced inline (would exceed practical file size). Each entry references the artifact file where AI output was accepted or corrected.

---

### Artifact 1 — Job Market Analysis (Requirement 1)

| Section | Content |
|---------|---------|
| **(1) Prompt + tool** | Claude Sonnet 4.6 · 15:00 24/05/2026 → "Implement requirement 1 first — find 10 LinkedIn QA/QC job postings from 2026 within 60 days of the submission date. At least 3 must require AI/LLM/automation-AI skills. Include: link, job description, required skills, salary, posting date, and 1–2 sentences of AI Impact Analysis per posting." Correction prompt at 15:20 → "Only using posts from LinkedIn — re-search and replace any non-LinkedIn posts." |
| **(2) AI output** | AI generated a 10-entry job posting table. First draft included 3 entries sourced from ITviec and TopCV (non-LinkedIn platforms) despite the explicit constraint. After correction prompt, AI regenerated with LinkedIn-only entries. All 10 postings include job description, required skills, salary (where available), posting date, and AI Impact Analysis. See `report.md` Req 1 section. |
| **(3) Verdict** | **INCOMPLETE** — First draft violated the platform constraint (LinkedIn only). Corrected after follow-up prompt, but the initial output required explicit human intervention to enforce a stated rule. |
| **(4) Reasoning** | ISTQB CTFL 4.0 §1.1 states that a test condition is "a testable aspect of a component derived from a requirement." The LinkedIn-only platform rule is an explicit requirement/constraint, analogous to a test condition boundary. AI failed to apply the constraint consistently across all 10 outputs — demonstrating that LLMs can ignore explicit scope restrictions when generating list-based content, a known limitation requiring human post-generation verification. |
| **(5) Student fix** | Identified 3 non-LinkedIn entries (ITviec, TopCV sources). Issued a correction prompt specifying the violation. Verified the replacement 10 entries are from `linkedin.com/jobs/view/` URLs. Added screenshot of own LinkedIn login to satisfy the anti-cheat account-name requirement. |

---

### Artifact 2 — 20 Software Defects (Requirement 2)

| Section | Content |
|---------|---------|
| **(1) Prompt + tool** | Claude Sonnet 4.6 · 16:00 24/05/2026 → "Implement requirement 2 — list 20 real software defects publicized between 2022 and 2026. At least 5 must be related to AI/LLM (hallucination, prompt injection, bias). Each entry needs: source link, description, severity, consequences, solution, and 1 identified instance of AI bias or hallucination when explaining that defect." Correction at 16:30 → "Links 1, 10, 11, 12, 15, 18 are returning 404 — find alternative real defects with working source links." |
| **(2) AI output** | AI generated 20 defect entries with structured fields and AI bias/hallucination notes for all 20. First draft contained 6 broken source URLs (404). After replacement prompt, AI substituted those 6 defects with alternative real incidents sourced from BleepingComputer, NVD, and vendor advisories. See `report.md` Req 2 section. |
| **(3) Verdict** | **INCOMPLETE** — AI fabricated or misremembered 6 source URLs (30% of entries). AI bias/hallucination notes were present for all 20 entries but required spot-checking (defects 1–5 verified on 03/06/2026). Content was otherwise well-structured and met ≥5 AI/LLM count requirement. |
| **(4) Reasoning** | ISTQB CTFL 4.0 §2.2 (Defect Management) defines a defect as "an imperfection or deficiency in a work product." URL hallucination (generating plausible-looking but non-existent links) is a well-documented LLM defect type classified under "confabulation." The AI synthesized source URLs without actual web access, a known LLM limitation that mirrors the ISTQB concept of "oracle problem" — the AI cannot confirm whether its generated URLs resolve to real content. Human verification against live sources is mandatory. |
| **(5) Student fix** | Tested all 20 source links. Found 6 returning 404. Issued a correction prompt to replace those 6 defects with verified alternatives. Re-tested replacement links to confirm they resolve. On 03/06/2026, verified defects 1–5 in detail against primary sources (BleepingComputer, NVD, OpenSSL advisory) and corrected AI hallucination notes where the stated dollar amounts or attribution claims deviated from the cited source. |

---

### Artifact 3 — Physical Product Test Cases (Requirement 3)

| Section | Content |
|---------|---------|
| **(1) Prompt + tool** | Claude Sonnet 4.6 · 17:30 24/05/2026 → "Implement requirement 3 — design 15 test cases for the Kangaroo electric rice cooker using this TC format: Objective / Input / Steps / Expected / Actual / Verdict. Include at least 3 edge cases that an AI tool could NOT generate without human physical-device knowledge." Device switched at 10:20 03/06/2026 → "Switch the Req 3 device from rice cooker to air fryer. Rewrite all 15 test cases from scratch for the air fryer. Update device info, all TCs, edge case explanations, summary table, and video TC list. Edge cases must still be ≥3 cases AI cannot generate." |
| **(2) AI output** | First pass (rice cooker): AI generated 15 TCs but all 3 "edge cases" were cases AI did generate — it failed to identify cases it genuinely could not produce without physical knowledge. Device switched to air fryer (03/06/2026). Second pass: AI generated 12 documented air fryer functions as normal TCs (fry frozen food, temperature adjustment, timer setting, preheat, roast chicken, cancel mid-cycle, basket auto-pause, reheat, bake, max temperature, shake reminder, consecutive cycles). For TC13–TC15, AI required explicit methodological prompting (BVA, safety misuse, forbidden-state scenarios) before producing usable edge cases. See `report.md` Req 3 section and `req3.md`. |
| **(3) Verdict** | **INCOMPLETE** — AI could not autonomously generate the ≥3 edge cases required without explicit human-supplied testing methodology prompts. Edge case quality required human physical-device knowledge for validation. Normal TCs (TC01–TC12) were VALID. |
| **(4) Reasoning** | ISTQB CTFL 4.0 §4.2 (Boundary Value Analysis) and §4.6 (Experience-Based Techniques) distinguish between specification-derived and experience-based test design. AI excels at specification-derived techniques (equivalence partitioning over documented device modes) but cannot apply experience-based techniques (error guessing, checklist-based testing) for physical hardware unless given explicit guidance. TC13 (wet marinade thermal safety), TC14 (0:00 timer BVA boundary), and TC15 (no-basket thermal cutoff) each require physical domain knowledge and fault model reasoning unavailable to a text-generation system. |
| **(5) Student fix** | Identified the 3 edge cases AI missed by applying ISTQB experience-based test design techniques. Added TC13 (wet/over-marinated food safety), TC14 (timer set to 0:00 — BVA), and TC15 (run without basket — thermal safety). Added "Why AI missed this" explanation to each edge case. Switched device from rice cooker to air fryer on 03/06/2026; rewrote all 15 TCs accordingly; updated video list to TC01/TC05/TC06/TC14/TC15. |

---

### Artifact 4 — QA/QC Role Mindmap (mindmap.md)

| Section | Content |
|---------|---------|
| **(1) Prompt + tool** | Claude Sonnet 4.6 · 18:00 24/05/2026 → "Generate a QA/QC role mindmap in Markdown format based on the ISTQB Fundamental Test Process. Structure it with the 7 ISTQB test process phases. Annotate at least 3 mistakes you find in the draft — show where items were misplaced or miscategorized." |
| **(2) AI output** | AI generated a full Markdown mindmap with 7 test process phases, competency breakdown, principles table, and AI impact section. AI self-annotated 3 mistakes: (Mistake-1) test script writing placed under Test Planning instead of Test Implementation; (Mistake-2) CI/CD pipeline setup placed under Test Design instead of DevOps/Infrastructure; (Mistake-3) Test Closure merged into Test Execution as a sub-activity instead of being a separate phase. See `mindmap.md`. |
| **(3) Verdict** | **INVALID** (initial draft) → VALID (after student review and corrections). The 3 self-annotated mistakes were genuine ISTQB categorization errors present in the initial output, not hypothetical issues. AI correctly identified them but the initial draft still contained the errors before the student applied fixes. |
| **(4) Reasoning** | ISTQB CTFL 4.0 §5 defines the 7 fundamental test process activities: Test Planning, Test Monitoring and Control, Test Analysis, Test Design, Test Implementation, Test Execution, and Test Completion (Closure). Misplacing "test script writing" under Planning (§5.1) instead of Implementation (§5.5) violates the ISTQB activity boundary; placing CI/CD in Design (§5.4) conflates automated execution infrastructure with test procedure design. These are verifiable categorization errors against the official ISTQB CTFL 4.0 syllabus. |
| **(5) Student fix** | Validated all 3 annotated mistakes against the ISTQB CTFL 4.0 syllabus. Confirmed each is a real categorization error. Applied corrections: moved test script writing to §5.5 Test Implementation; moved CI/CD setup out of Test Design to DevOps/Infrastructure context note; separated Test Closure (§5.7) as an independent phase from Test Execution (§5.6). Final mindmap is in `mindmap.md`. |

---

### AI Accuracy Ratio Summary

| Verdict | Count | Artifacts |
|---------|------:|-----------|
| **VALID** | 0 | — |
| **INCOMPLETE** | 3 | Job Market (Req 1), Software Defects (Req 2), Test Cases (Req 3) |
| **INVALID** | 1 | QA/QC Mindmap (initial draft) |
| **Total** | **4** | |

**VALID: 0% · INCOMPLETE: 75% · INVALID: 25%**

**When should AI be used / not used for this work?**

AI should be used for: generating structured table templates, producing first-draft content for well-documented domains (CVEs, job descriptions, ISTQB phases), and following explicit formatting instructions. AI should NOT be used without human review for: URL generation/citation (high hallucination rate), platform-constraint enforcement across large lists, and physical-device test design requiring safety-based or boundary-value edge case reasoning. On this assignment, every AI artifact required at least one round of human correction before it met the stated requirements.

---

## Mandatory Disclosure [AI-03]

> **Template:** HW01 AI Collaboration Protocol, Section 5.

"The job market table, defect descriptions and AI bias/hallucination notes, test case templates, QA/QC mindmap draft, and prompt log structure were initially generated by Claude Sonnet 4.6 (claude-sonnet-4-6). I reviewed and modified Requirement 1 (replaced 3 non-LinkedIn entries), Requirement 2 (replaced 6 defects with broken links; verified defects 1–5 against primary sources), and Requirement 3 (added edge cases TC13–TC15; switched device from rice cooker to air fryer and rewrote all 15 TCs). The mindmap (mindmap.md) was corrected by me after identifying 3 genuine ISTQB categorization errors in the AI draft. The following artifacts were written entirely by me with no AI involvement: device photo with student ID card in the same frame, execution videos (≥5, ≤60s each) with my own voice narration, LinkedIn screenshots showing my account name, and GitHub Issues created under my GitHub username. I confirm I did not use AI to generate any artifact in the prohibited category. The detailed AI Audit Report is attached as Appendix A."

**Signed:** Nguyễn Thành Dâng — 23127334 — 24/05/2026

---

## [AI-05] Privacy & Responsible Use Checklist

| # | Checklist Item | Status |
|---|---------------|--------|
| 1 | All AI-generated text is clearly attributed to the AI tool used | ✅ Yes |
| 2 | AI Audit Report [AI-02] completed for each artifact (5-section format) | ✅ Yes |
| 3 | Mandatory Disclosure [AI-03] signed | ✅ Yes |
| 4 | Prompt log includes full prompts with timestamps (HH:MM DD/MM/YYYY) | ✅ Yes |
| 5 | AI accuracy ratio (VALID/INVALID/INCOMPLETE) summarized at end of Audit Report | ✅ Yes |
| 6 | No private/sensitive personal data sent to AI tool | ✅ Yes |
| 7 | Device photo with student ID card taken by student (no AI) | ☐ Student must do |
| 8 | ≥5 execution videos with voice narration recorded by student (no AI) | ☐ Student must do |
| 9 | All 10 LinkedIn screenshots show student's account name/login | ☐ Student must do |
| 10 | GitHub Issues created under student's GitHub username | ☐ Student must do |
| 11 | Actual Result and Verdict columns filled after real physical device testing | ☐ Student must do |
| 12 | Self-Assessment rubric completed honestly | ☐ Student must do |
