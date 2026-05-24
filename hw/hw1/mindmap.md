# QA/QC Role Mindmap — ISTQB Testing Process

> **Purpose:** Visual breakdown of the QA/QC role aligned with the ISTQB Fundamental Test Process.
> **Annotation:** ⚠️ marks the 3 mistakes found in the AI-generated first draft.

---

## Central Node: QA/QC Engineer Role

```
QA/QC Engineer
│
├── 1. TEST PLANNING
│   ├── Define test scope and objectives
│   ├── Identify test levels (Unit → System → Acceptance)
│   ├── Choose test techniques (Black-box, White-box, Experience-based)
│   ├── Estimate effort and schedule
│   ├── Assign roles and responsibilities
│   └── ⚠️ MISTAKE-1 (AI draft): AI placed "Write test scripts" here
│       → CORRECTION: Test script writing belongs in TEST DESIGN/IMPLEMENTATION,
│         not planning. Planning only defines strategy, not implementation steps.
│
├── 2. TEST MONITORING & CONTROL
│   ├── Track test progress vs. plan (metrics: defect density, test coverage %)
│   ├── Report test status to stakeholders
│   ├── Re-plan when deviations occur
│   └── Generate test progress reports
│
├── 3. TEST ANALYSIS
│   ├── Review test basis (requirements, specs, user stories)
│   ├── Identify testable features
│   ├── Define test conditions (what to test)
│   └── Analyze risks (product risk, project risk)
│
├── 4. TEST DESIGN
│   ├── Design test cases from test conditions
│   ├── Apply techniques:
│   │   ├── Equivalence Partitioning (EP)
│   │   ├── Boundary Value Analysis (BVA)
│   │   ├── Decision Table Testing
│   │   ├── State Transition Testing
│   │   └── Exploratory Testing
│   ├── Design test data
│   ├── Define test environment requirements
│   └── ⚠️ MISTAKE-2 (AI draft): AI listed "CI/CD pipeline setup" under Test Design
│       → CORRECTION: CI/CD pipeline setup is a DevOps/Infrastructure task,
│         not a QA test design responsibility. QA uses CI/CD outputs (artifacts,
│         build reports) but does not own pipeline configuration.
│
├── 5. TEST IMPLEMENTATION
│   ├── Create test scripts / test procedures
│   ├── Prepare and manage test data
│   ├── Configure test environment
│   ├── Set up test tools (Selenium, JUnit, Postman, etc.)
│   └── Organize test suites and regression packs
│
├── 6. TEST EXECUTION
│   ├── Run test cases (manual and automated)
│   ├── Compare actual vs. expected results
│   ├── Log defects in defect tracker (GitHub Issues, Jira, etc.)
│   ├── Re-test after defect fixes (confirmation testing)
│   ├── Perform regression testing after changes
│   └── ⚠️ MISTAKE-3 (AI draft): AI merged "Test Closure" activities here
│       → CORRECTION: Test closure is a distinct final phase. During execution,
│         the tester runs and logs — they do NOT write final summary reports,
│         archive test ware, or produce lessons learned (those are closure tasks).
│
└── 7. TEST CLOSURE
    ├── Confirm all planned tests are complete or deferred with reason
    ├── Evaluate exit criteria (coverage targets met, critical defects fixed)
    ├── Write test summary report
    ├── Archive test artifacts (cases, data, scripts, reports)
    ├── Analyze defect root causes (lessons learned)
    └── Handover to operations / release decision
```

---

## Supporting Competencies of the QA/QC Role

```
QA/QC Competencies
│
├── Technical Skills
│   ├── Test automation (Selenium, Cypress, Playwright, Appium)
│   ├── API testing (Postman, RestAssured)
│   ├── Performance testing (JMeter, k6)
│   ├── Version control (Git)
│   └── SQL / database validation
│
├── Domain Knowledge
│   ├── SDLC models (Waterfall, Agile/Scrum, DevOps)
│   ├── ISTQB terminology and process
│   ├── Industry-specific knowledge (finance, healthcare, e-commerce)
│   └── Regulatory requirements (GDPR, PCI-DSS, ISO 25010)
│
├── AI/LLM Testing Skills (Emerging — 2024+)
│   ├── Prompt injection test design
│   ├── Hallucination detection and evaluation
│   ├── AI output consistency testing
│   ├── Bias and fairness evaluation
│   └── LLM regression testing (model version drift)
│
└── Soft Skills
    ├── Critical thinking and exploratory mindset
    ├── Clear defect reporting and communication
    ├── Collaboration with developers and product owners
    └── Continuous learning (tools evolve rapidly)
```

---

## Key ISTQB Principles Referenced

| # | Principle | Why It Matters |
|---|-----------|---------------|
| 1 | Testing shows presence of defects, not their absence | Prevents false confidence from passing tests |
| 2 | Exhaustive testing is impossible | Prioritize by risk; use EP and BVA |
| 3 | Early testing saves time and money | Shift-left: involve QA at requirements stage |
| 4 | Defects cluster together (Pareto) | Focus regression effort on defect-dense modules |
| 5 | Beware of the Pesticide Paradox | Rotate and update test cases to find new bugs |
| 6 | Testing is context-dependent | Safety-critical (medical) ≠ e-commerce testing |
| 7 | Absence-of-errors fallacy | 100% pass rate on wrong requirements = wrong product |

---

## AI Impact on QA/QC Role (2024–2026)

```
AI Transforming QA
│
├── AI ASSISTS QA (Current)
│   ├── Auto-generate test cases from user stories (Copilot, ChatGPT)
│   ├── Self-healing test scripts (Testim, Mabl)
│   ├── Visual regression testing (Percy, Applitools)
│   └── Defect prediction from code metrics (ML models)
│
├── NEW QA RESPONSIBILITIES (Emerging)
│   ├── Testing AI systems (LLM outputs, RAG pipelines, agents)
│   ├── Validating AI model behavior across edge cases
│   ├── Monitoring AI system drift in production
│   └── Designing adversarial test inputs (prompt injection, data poisoning)
│
└── SKILLS QA MUST DEVELOP
    ├── Understand AI/ML model lifecycle (train → deploy → monitor)
    ├── Evaluate non-deterministic outputs (no single "expected result")
    ├── Use statistical testing approaches for AI validation
    └── Collaborate with ML engineers on data quality
```

---

*Mindmap generated with assistance from Claude (claude-sonnet-4-6). Three mistakes in the AI-generated first draft were identified and corrected (marked ⚠️ above). Final version reviewed and approved by student.*
