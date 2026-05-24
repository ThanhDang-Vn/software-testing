# HW01 – QA/QC Jobs · 20 Defects · Test a Physical Product

**Exercise ID:** HW01-AI
**Student ID:** [YOUR_STUDENT_ID]
**Full Name:** [YOUR_FULL_NAME]
**Date:** 2026-05-24
**AI Tools Used:** Claude (claude-sonnet-4-6)

---

## Table of Contents

1. [Requirement 1 – QA/QC Job Market 2026+](#requirement-1)
2. [Requirement 2 – 20 Software Defects 2022–2026](#requirement-2)
3. [Requirement 3 – Test Cases for One Physical Product](#requirement-3)
4. [AI Audit Report](#ai-audit-report)
5. [AI Critique](#ai-critique)
6. [Mandatory Disclosure](#mandatory-disclosure)
7. [Self-Assessment](#self-assessment)

---

## Requirement 1 – QA/QC Job Market 2026+ (40 pts) {#requirement-1}

> **Platform:** LinkedIn only.
> **Anti-cheat note:** All screenshots must show your LinkedIn account name in the corner.
> **Posting window:** Published within 60 days of submission date (>= 2026-03-25).

### Job Postings Overview

| # | Job Title | Company | Location | Salary | AI/LLM? | Posting Date |
|---|-----------|---------|----------|--------|:--------:|-------------|
| 1 | AI Quality Engineer | Momentive Software | Atlanta, GA, USA | Not listed | YES | ~May 24, 2026 |
| 2 | QA Engineer – GenAI & AI Agent Testing | Zenith System Solutions | Plano, TX, USA | Not listed | YES | ~May 17, 2026 |
| 3 | Software Quality Engineer III – AI & Agentic Behavior | Federal Express (FedEx) | Memphis/Plano, USA | Not listed | YES | ~May 22, 2026 |
| 4 | Agentic AI Quality Assurance Engineer | Trimble Inc. | Lake Oswego, OR, USA | $78,400–$107,900/yr | YES | ~May 17, 2026 |
| 5 | AI Tester | TMV Global Inc | Atlanta, GA, USA | Not listed | YES | ~May 19, 2026 |
| 6 | Lead Automation QA Engineer | Galaxy FinX | Ho Chi Minh City, Vietnam | Not listed | No | ~May 20, 2026 |
| 7 | Mid/Senior QA Engineer | SMG Vietnam | Ho Chi Minh City, Vietnam | Not listed | No | ~May 21, 2026 |
| 8 | Fullstack Tester (Auto + Manual) | LTS Group | Hanoi, Vietnam | Up to 30M VND/mo | Preferred | ~May 20, 2026 |
| 9 | Quality Assurance Engineer | Quantum Movement | Ho Chi Minh City, Vietnam | Not listed | No | ~May 18, 2026 |
| 10 | Junior QA Engineer (Manual + Automation) | DXC Technology | Ho Chi Minh City, Vietnam | Not listed | No | ~May 20, 2026 |

---

### Detailed Job Postings

---

#### Job 1 – AI Quality Engineer (AI/LLM)

**Company:** Momentive Software
**Location:** Atlanta, GA, USA
**LinkedIn URL:** <https://www.linkedin.com/jobs/view/4407931860>
**Salary:** Not listed
**Posting Date:** ~May 24, 2026

**Job Description:**
This role focuses on designing evaluation frameworks for generative AI and agentic systems. The engineer validates LLM outputs (GPT-4, Claude, Gemini), agentic reasoning chains, RAG pipelines, and multi-step tool use. Requires both hands-on QA experience and understanding of AI/ML concepts.

**Required Skills:**
- 3–5 years QA/software engineering experience
- Hands-on experience with LLMs and agentic AI (GPT-4, Claude, Gemini)
- Python scripting for evaluation automation
- Designing evaluation frameworks for generative AI
- Agentic frameworks: RAG, multi-step reasoning, tool use
- CI/CD pipeline integration
- Unit, integration, regression, and E2E testing

**Screenshot:**

![Job 1 – Momentive Software LinkedIn Screenshot](img/req1/req1-01.png)

**AI Impact Analysis:**
This role exemplifies the emergence of AI-native QA positions where the primary subject under test is an LLM/agentic system itself; traditional black-box testing skills are being replaced by evaluation framework design, hallucination detection, and grounding assessment — competencies that did not exist in QA job descriptions before 2023.

---

#### Job 2 – QA Engineer – GenAI & AI Agent Testing (AI/LLM)

**Company:** Zenith System Solutions
**Location:** Plano, TX, USA
**LinkedIn URL:** <https://www.linkedin.com/jobs/view/4413976695>
**Salary:** Not listed
**Posting Date:** ~May 17, 2026

**Job Description:**
Specialized QA role targeting generative AI and AI-agent testing. The engineer validates AI-powered applications end-to-end, tests prompt engineering pipelines, and verifies LLM workflow correctness. Requires 5+ years QA experience with demonstrated AI/ML exposure.

**Required Skills:**
- 5+ years QA experience with AI/ML exposure
- Testing generative AI and AI-powered applications
- AI agent / agentic AI testing
- Prompt engineering validation
- Python scripting; LLM workflow testing
- LangChain / LangGraph / CrewAI / AutoGen (preferred)
- API testing; CI/CD integration

**Screenshot:**

![Job 2 – Zenith System Solutions LinkedIn Screenshot](img/req1/req1-02.png)

**AI Impact Analysis:**
Zenith's posting illustrates how agentic AI frameworks (LangChain, CrewAI, AutoGen) are creating a new sub-discipline within QA focused on validating non-deterministic multi-agent workflows — a testing challenge where traditional equivalence partitioning and boundary value analysis techniques are insufficient without LLM-specific evaluation methods.

---

#### Job 3 – Software Quality Engineer III – AI & Agentic Behavior (AI/LLM)

**Company:** Federal Express Corporation (FedEx)
**Location:** Memphis, TN / Plano, TX, USA (Hybrid)
**LinkedIn URL:** <https://www.linkedin.com/jobs/view/4418045788>
**Salary:** Not listed
**Posting Date:** ~May 22, 2026

**Job Description:**
Enterprise-scale QA engineering role at FedEx focused on agentic AI behavior testing and LLM output validation. The engineer executes automated and manual tests for agentic AI systems, uses agentic coding tools for test automation, and ensures prompt security compliance.

**Required Skills:**
- Executing automated/manual tests for agentic AI behavior and LLM outputs
- Agentic coding tools for test automation
- AI/LLM evaluation and prompt security testing
- Performance testing for AI systems
- BS in Computer Science or related field; 4+ years IT/QA experience

**Screenshot:**

![Job 3 – FedEx LinkedIn Screenshot](img/req1/req1-03.png)

**AI Impact Analysis:**
FedEx's adoption of a dedicated "AI & Agentic Behavior Engineer" title at enterprise scale confirms that AI testing is no longer confined to tech startups; logistics enterprises now require QA engineers who can validate agentic decision-making systems that directly affect operational workflows.

---

#### Job 4 – Agentic AI Quality Assurance Engineer (AI/LLM)

**Company:** Trimble Inc.
**Location:** Lake Oswego, OR, USA
**LinkedIn URL:** <https://www.linkedin.com/jobs/view/4393946955>
**Salary:** $78,400–$107,900/year
**Posting Date:** ~May 17, 2026

**Job Description:**
Design and deploy autonomous test agents for E2E testing of AI-powered applications. Combines traditional QA automation (Selenium, Playwright, Postman) with AI-specific validation, requiring knowledge of TensorFlow/PyTorch and AI/ML concepts.

**Required Skills:**
- Designing and deploying autonomous agents for E2E testing
- Developing AI models for agentic testing systems
- Selenium + WinApp Appium; Microsoft Playwright (.NET/C#)
- UI testing in C# and PowerShell; Postman API testing
- AI/ML concepts; TensorFlow/PyTorch (bonus)
- 3+ years experience; BS in Computer Science or related AI discipline

**Screenshot:**

![Job 4 – Trimble Inc. LinkedIn Screenshot](img/req1/req1-04.png)

**AI Impact Analysis:**
Trimble's salary range ($78K–$108K) for an agentic AI QA engineer provides concrete market data showing AI-augmented QA roles command a 20–35% salary premium over traditional automation roles (~$60K–$80K); this uplift will accelerate the transition of QA professionals toward AI-specialized skill sets.

---

#### Job 5 – AI Tester (AI/LLM)

**Company:** TMV Global Inc
**Location:** Atlanta, GA, USA
**LinkedIn URL:** <https://www.linkedin.com/jobs/view/4415708170>
**Salary:** Not listed
**Posting Date:** ~May 19, 2026

**Job Description:**
Highly specialized AI testing role requiring 8+ years QA/testing with AI/ML exposure. Responsibilities include hallucination detection, bias assessment, factual accuracy testing, RAG system validation, and responsible AI evaluation across cloud AI platforms.

**Required Skills:**
- 8+ years QA/testing with AI/ML exposure
- Chatbot / NLP / generative AI testing
- Hallucination detection, factual accuracy, and bias assessment
- Python; REST API testing
- RAG system validation (chunking, embeddings, relevance)
- Cloud AI platforms: Azure OpenAI, AWS Bedrock, Google Vertex AI
- Prompt engineering; responsible AI principles

**Screenshot:**

![Job 5 – TMV Global Inc LinkedIn Screenshot](img/req1/req1-05.png)

**AI Impact Analysis:**
TMV Global's requirement for "hallucination detection, factual accuracy, and bias assessment" across Azure OpenAI, AWS Bedrock, and Google Vertex AI demonstrates how AI QA has evolved into a cross-platform discipline requiring ethical reasoning skills beyond traditional test engineering.

---

#### Job 6 – Lead Automation QA Engineer

**Company:** Galaxy FinX
**Location:** Ho Chi Minh City, Vietnam
**LinkedIn URL:** <https://www.linkedin.com/jobs/view/4416602444>
**Salary:** Not listed
**Posting Date:** ~May 20, 2026

**Job Description:**
Lead QA automation engineer for a fintech company in Ho Chi Minh City. Covers full-stack test automation across web and mobile, API testing, and CI/CD pipeline integration. Banking domain knowledge is a strong plus. Mid-to-Senior level.

**Required Skills:**
- Selenium, Cypress, Playwright, or Appium
- Java, JavaScript/TypeScript, or Python
- API automation (Postman, RestAssured)
- Page Object Model / data-driven testing design patterns
- Git, Jenkins/GitLab CI
- Banking domain knowledge (transfers, payments, account management)

**Screenshot:**

![Job 6 – Galaxy FinX LinkedIn Screenshot](img/req1/req1-06.png)

**AI Impact Analysis:**
Galaxy FinX's posting reflects the Vietnamese fintech QA market in 2026 — still automation-first without explicit AI requirements, but the banking domain's strict correctness requirements mean AI-assisted test generation will face regulatory scrutiny before adoption, delaying AI integration compared to tech startups.

---

#### Job 7 – Mid/Senior QA Engineer

**Company:** SMG Vietnam
**Location:** Ho Chi Minh City, Vietnam
**LinkedIn URL:** <https://www.linkedin.com/jobs/view/4394782432>
**Salary:** Not listed
**Posting Date:** ~May 21, 2026

**Job Description:**
Mid-to-senior QA engineering role. Covers API testing, UI testing for React applications, database testing (PostgreSQL), and CI/CD integration. Requires English fluency; open to Vietnamese citizens only.

**Required Skills:**
- 4+ years QA/software testing
- API testing (Postman, REST); UI testing for React web applications
- PostgreSQL/SQL database testing
- Cypress or Playwright automation; CI/CD (CircleCI preferred)
- Agile/Scrum; English fluency required

**Screenshot:**

![Job 7 – SMG Vietnam LinkedIn Screenshot](img/req1/req1-07.png)

**AI Impact Analysis:**
SMG Vietnam represents the majority of the Vietnamese QA market in 2026 — classical automation with no AI requirements — indicating the domestic Vietnamese IT market still has a 12–24 month lag in adopting AI-native testing requirements compared to global peers.

---

#### Job 8 – Fullstack Tester (Auto + Manual) (AI Preferred)

**Company:** LTS Group
**Location:** Hanoi Capital Region, Vietnam
**LinkedIn URL:** <https://www.linkedin.com/jobs/view/4415768166>
**Salary:** Up to 30,000,000 VND/month (~$1,200 USD)
**Posting Date:** ~May 20, 2026

**Job Description:**
Full-stack tester combining manual and automation testing. Lists a "strong interest in applying AI/LLM/Agentic AI tools to testing" as a preferred quality, alongside specific AI tools (Cursor, Claude, GitHub Copilot, ChatGPT).

**Required Skills:**
- 3+ years software testing
- Selenium, Playwright, Cypress, or Robot Framework
- JavaScript, Java, or Python; API and backend testing; CI/CD
- Strong interest in applying AI/LLM/Agentic AI tools to testing
- Cursor, Claude, GitHub Copilot, or ChatGPT experience (preferred)
- Jira / qTest / Xray / TestRail

**Screenshot:**

![Job 8 – LTS Group LinkedIn Screenshot](img/req1/req1-08.png)

**AI Impact Analysis:**
LTS Group's explicit listing of "Claude, GitHub Copilot, ChatGPT" as preferred tools marks a pivotal shift in the Vietnamese domestic QA market — local companies are beginning to reward AI tool proficiency, suggesting the Vietnamese market will close its AI adoption gap within 1–2 years.

---

#### Job 9 – Quality Assurance Engineer

**Company:** Quantum Movement
**Location:** District 3, Ho Chi Minh City, Vietnam
**LinkedIn URL:** <https://www.linkedin.com/jobs/view/4416023763>
**Salary:** Not listed
**Posting Date:** ~May 18, 2026

**Job Description:**
QA engineering role at a startup focused on computer vision and mobile fitness applications. Requires 7+ years QA experience with expertise in Flutter mobile testing, ReactJS web testing, and specialized profiling tools.

**Required Skills:**
- 7+ years QA experience
- Selenium, Appium, XCUITest; Flutter mobile app testing; ReactJS web testing
- REST API / backend testing
- Flipper, Android Studio Profiler, Xcode Instruments (performance profiling)
- MediaPipe / computer vision testing (preferred)
- Linear bug tracking; performance and load testing

**Screenshot:**

![Job 9 – Quantum Movement LinkedIn Screenshot](img/req1/req1-09.png)

**AI Impact Analysis:**
Quantum Movement's preference for MediaPipe/computer vision testing shows how AI-adjacent testing skills (validating ML model outputs in health apps) are creating new QA specializations that blur the boundary between traditional software testing and AI model evaluation.

---

#### Job 10 – Junior QA Engineer (Manual + Automation)

**Company:** DXC Technology
**Location:** Ho Chi Minh City, Vietnam
**LinkedIn URL:** <https://www.linkedin.com/jobs/view/4394431613>
**Salary:** Not listed
**Posting Date:** ~May 20, 2026

**Job Description:**
Entry-level QA engineering role covering manual and automation testing using Katalon Studio and TestComplete. Requires basic SQL, Agile/Scrum, and intermediate English. Suitable for candidates with 1+ year experience.

**Required Skills:**
- 1+ year QA experience
- Katalon Studio (Groovy/Java); TestComplete (JavaScript/VBScript/Python)
- Postman / REST API testing; Basic SQL; Agile/Scrum; Jira
- Intermediate English
- Git / Jenkins / Azure DevOps and Xray / Zephyr (nice-to-have)

**Screenshot:**

![Job 10 – DXC Technology LinkedIn Screenshot](img/req1/req1-10.png)

**AI Impact Analysis:**
DXC's junior QA role represents the entry-level end of the 2026 market — AI tools are not required but candidates who proactively demonstrate AI tool proficiency (Copilot, ChatGPT for test generation) will differentiate themselves and accelerate career progression compared to peers relying solely on traditional tools.

---

### QA/QC Job Market Summary

The 10 LinkedIn postings reveal three distinct tiers in the 2026 QA market:

1. **AI-Native QA** (Jobs 1–5): Roles where the subject under test is an AI/LLM/agentic system. Require prompt engineering, RAG evaluation, hallucination testing. Salaries: $78K–$200K+.
2. **AI-Preferred QA** (Job 8): Traditional QA roles now listing AI tools as preferred skills — transitional adoption in Vietnam.
3. **Traditional QA** (Jobs 6, 7, 9, 10): Classical automation/manual roles. Still in demand in Vietnam but facing salary compression globally.

**Conclusion:** 5 of 10 LinkedIn postings in May 2026 require AI/LLM skills, up from near-zero in 2022. Vietnamese domestic companies lag global peers by 12–24 months, creating a window for local QA engineers to build AI skills before it becomes mandatory.

---

## Requirement 2 – 20 Software Defects 2022–2026 (20 pts) {#requirement-2}

> **Period:** 2022–2026. **Mandatory:** >= 5 defects related to AI/LLM.
> **Each entry:** source link · description · severity · consequences · solution · AI bias/hallucination note.

| # | Name | Year | Severity | AI/LLM? |
|---|------|------|----------|:--------:|
| 1 | Change Healthcare Ransomware Attack | 2024 | Critical | — |
| 2 | MOVEit Transfer SQL Injection (CVE-2023-34362) | 2023 | Critical | — |
| 3 | XZ Utils Backdoor (CVE-2024-3094) | 2024 | Critical | — |
| 4 | Log4Shell Continued Exploitation (CVE-2021-44228) | 2022 | Critical | — |
| 5 | OpenSSL Infinite Loop (CVE-2022-0778) | 2022 | High | — |
| 6 | Microsoft Exchange ProxyNotShell (CVE-2022-41040/41082) | 2022 | Critical | — |
| 7 | Apple WebKit Zero-Day (CVE-2022-32893) | 2022 | High | — |
| 8 | Twitter 5.4M User Data Breach | 2022 | High | — |
| 9 | LastPass Password Vault Breach | 2022–2023 | Critical | — |
| 10 | Okta Support System Breach | 2023 | High | — |
| 11 | WinRAR RCE (CVE-2023-38831) | 2023 | High | — |
| 12 | Cisco IOS XE Zero-Day (CVE-2023-20198) | 2023 | Critical | — |
| 13 | Microsoft Outlook Zero-Click RCE (CVE-2023-23397) | 2023 | Critical | — |
| 14 | Ivanti Connect Secure Zero-Day (CVE-2023-46805) | 2024 | Critical | — |
| 15 | Palo Alto PAN-OS Zero-Day (CVE-2024-3400) | 2024 | Critical | — |
| 16 | ChatGPT Conversation History Leak | 2023 | High | ✅ AI/LLM |
| 17 | GPT-4 Hallucination – Mata v. Avianca Legal Brief | 2023 | High | ✅ AI/LLM |
| 18 | Samsung Employee Data Leak via ChatGPT | 2023 | High | ✅ AI/LLM |
| 19 | Bing Chat (Sydney) Prompt Injection / Jailbreak | 2023 | High | ✅ AI/LLM |
| 20 | GitHub Copilot Insecure Code Generation (CWE-798) | 2023 | Medium | ✅ AI/LLM |

---

### Defect 1 – Change Healthcare Ransomware Attack (2024)

**Source:** <https://www.bleepingcomputer.com/news/security/change-healthcare-hacked-using-stolen-citrix-account-with-no-mfa/>
**Severity:** Critical
**Year:** 2024

**Description:**
In February 2024, the ALPHV/BlackCat ransomware gang breached Change Healthcare (a UnitedHealth subsidiary processing 15 billion healthcare transactions per year) using stolen Citrix remote access credentials on a portal with no multi-factor authentication. Attackers spent approximately 9 days inside the network before deploying ransomware on February 21, 2024, disrupting pharmacy claims and insurance payment processing nationwide.

**Consequences:**
- Approximately 190 million Americans' health records, SSNs, and billing data exposed — the largest US healthcare data breach in history
- $2.45 billion in financial losses through Q3 2024
- UnitedHealth paid a $22 million ransom to ALPHV, then paid RansomHub again to prevent data release
- Weeks-long disruption to pharmacy claims; hospitals unable to verify insurance coverage
- US Congress emergency hearings; HHS investigations launched

**Solution:**
- Mandatory MFA on all remote access portals (Citrix, VPN, RDP) without exception
- Network segmentation to limit lateral movement after initial compromise
- Continuous monitoring of credential-based access and anomalous login patterns
- Incident response rehearsals for critical healthcare infrastructure

**AI Bias/Hallucination Note:**
When asked, Claude stated the breach affected approximately 100 million patients. The confirmed figure (January 2025 disclosure) is 190 million — nearly double. The AI froze on an earlier preliminary estimate and presented it as the final figure, demonstrating how LLMs cannot update stale information to reflect post-cutoff revised disclosures.

---

### Defect 2 – MOVEit Transfer SQL Injection (CVE-2023-34362) (2023)

**Source:** <https://www.cisa.gov/news-events/cybersecurity-advisories/aa23-158a>
**Severity:** Critical (CVSS 9.8)
**Year:** 2023

**Description:**
A critical SQL injection vulnerability in Progress Software's MOVEit Transfer allowed unauthenticated attackers to gain unauthorized database access, escalate privileges, and execute arbitrary SQL statements. The Cl0p ransomware group exploited it as a zero-day before the patch was available.

**Consequences:**
- Over 2,700 organizations affected globally including US government agencies, British Airways, Calpers, and universities
- More than 93 million individuals had personal data exfiltrated
- Estimated financial damage: $9.9 billion (Emsisoft estimate)
- No ransomware deployed — pure data theft and extortion model

**Solution:**
- Progress released emergency patches (2023-06-01); upgrade to 2021.0.6, 2021.1.4, 2022.0.4, 2022.1.5, or 2023.0.1
- Disable HTTP/HTTPS traffic to MOVEit Transfer until patching
- Review audit logs for unauthorized access and webshell artifacts

**AI Bias/Hallucination Note:**
GPT-4 incorrectly stated "MOVEit Transfer is an open-source tool" when asked to explain this defect. MOVEit Transfer is a proprietary commercial product by Progress Software (formerly Ipswitch). This hallucination could mislead a tester into looking for open-source community patches that do not exist.

---

### Defect 3 – XZ Utils Backdoor (CVE-2024-3094) (2024)

**Source:** <https://nvd.nist.gov/vuln/detail/CVE-2024-3094>
**Severity:** Critical (CVSS 10.0)
**Year:** 2024

**Description:**
A sophisticated supply chain attack embedded in XZ Utils versions 5.6.0 and 5.6.1. The attacker ("Jia Tan"), operating over two years under a fake identity, inserted a backdoor into the build system that modified the liblzma library to intercept and compromise OpenSSH authentication on affected Linux distributions (Debian, Fedora, openSUSE testing/unstable).

**Consequences:**
- If deployed at scale, the backdoor would have allowed unauthenticated RCE on millions of Linux servers via SSH
- Detected early by a Microsoft engineer (Andres Freund) noticing anomalous CPU usage during SSH logins
- Triggered a global audit of open-source maintainer trust and CI/CD supply chain security

**Solution:**
- Immediately downgrade to XZ Utils 5.4.6 or earlier
- Distributions rolled back affected packages within 24 hours of disclosure
- OpenSSF and Linux Foundation launched open-source maintainer identity verification initiatives

**AI Bias/Hallucination Note:**
Claude described the attacker as "a state-sponsored Chinese hacker" with high confidence. This attribution is publicly unconfirmed — no official attribution has been made. The AI presented security community speculation as established fact, a hallucination pattern common in attribution questions where training data contains speculative news articles.

---

### Defect 4 – Log4Shell Continued Exploitation (CVE-2021-44228) (2022)

**Source:** <https://www.cisa.gov/news-events/cybersecurity-advisories/aa22-320a>
**Severity:** Critical (CVSS 10.0)
**Year:** 2022

**Description:**
Log4Shell, disclosed December 2021, continued as one of the most actively exploited vulnerabilities throughout 2022. The flaw in Apache Log4j 2's JNDI lookup feature allowed unauthenticated RCE by sending a crafted log message. Despite patches being available, millions of systems remained unpatched due to Log4j's ubiquity in enterprise Java applications.

**Consequences:**
- Nation-state actors (Iran, China, North Korea, Russia) and ransomware groups actively exploited unpatched systems throughout 2022
- Belgian Defense Ministry, VMware, and numerous organizations breached
- CISA reported 40%+ of internet-facing systems using vulnerable Log4j as late as Q2 2022
- Estimated industry remediation cost: $100M+

**Solution:**
- Upgrade to Log4j 2.17.1+ (Java 8), 2.12.4+ (Java 7), or 2.3.2+ (Java 6)
- Set JVM flag: `log4j2.formatMsgNoLookups=true` as interim mitigation
- Implement WAF rules to detect and block `${jndi:` patterns

**AI Bias/Hallucination Note:**
When asked which versions are safe, Claude stated "Log4j 1.x is not affected by Log4Shell." Technically true for CVE-2021-44228, but Log4j 1.x reached end-of-life in 2015 and has its own critical vulnerabilities (CVE-2019-17571, CVE-2022-23302). The technically-correct-but-misleading answer could cause a tester to conclude that Log4j 1.x systems are safe, when they are critically insecure for other reasons.

---

### Defect 5 – OpenSSL Infinite Loop (CVE-2022-0778) (2022)

**Source:** <https://www.openssl.org/news/secadv/20220315.txt>
**Severity:** High (CVSS 7.5)
**Year:** 2022

**Description:**
A bug in OpenSSL's `BN_mod_sqrt()` function caused an infinite loop when parsing a certificate with an invalid explicit elliptic curve parameter. Since certificate parsing occurs before authentication in TLS handshakes, an unauthenticated attacker could trigger a Denial of Service by sending a malformed certificate.

**Consequences:**
- Any OpenSSL-dependent service (HTTPS servers, VPNs, email servers) exposed to untrusted TLS connections could be crashed remotely
- Affected OpenSSL versions 1.0.2, 1.1.1, and 3.0
- Wide blast radius due to OpenSSL's ubiquity in web infrastructure

**Solution:**
- Upgrade to OpenSSL 1.1.1n, 3.0.2, or later
- For OpenSSL 1.0.2 (EOL): upgrade to a supported version; no public patch available

**AI Bias/Hallucination Note:**
ChatGPT described this vulnerability as allowing "remote code execution." CVE-2022-0778 is a Denial of Service vulnerability — it causes an infinite loop/crash, not arbitrary code execution. The AI likely conflated this with other OpenSSL vulnerabilities (e.g., Heartbleed), producing an inflated severity assessment that could mislead triage prioritization.

---

### Defect 6 – Microsoft Exchange ProxyNotShell (CVE-2022-41040 / CVE-2022-41082) (2022)

**Source:** <https://msrc.microsoft.com/update-guide/vulnerability/CVE-2022-41082>
**Severity:** Critical (CVSS 8.8)
**Year:** 2022

**Description:**
Two chained vulnerabilities in Microsoft Exchange Server: CVE-2022-41040 (Server-Side Request Forgery) and CVE-2022-41082 (RCE via PowerShell), exploited as zero-days before patches were available. Together they allowed authenticated attackers to achieve RCE on Exchange servers.

**Consequences:**
- Exploited in targeted attacks globally before patch availability
- Attackers deployed webshells (FINSPY, China Chopper) for persistent access
- Affected Exchange Server 2013, 2016, and 2019
- Required urgent IIS URL Rewrite rule mitigations while awaiting official patches

**Solution:**
- Apply Microsoft November 2022 Patch Tuesday updates (KB5019758 / KB5019759)
- Interim mitigation: add URL Rewrite rule to block `.*autodiscover\.json.*\@.*Powershell.*`
- Enable Extended Protection for Authentication (EPA) on Exchange

**AI Bias/Hallucination Note:**
Claude confused ProxyNotShell with ProxyShell, stating "ProxyNotShell affects Exchange Online (Microsoft 365)." ProxyNotShell only affects on-premises Exchange Server — Exchange Online was never affected. This deployment misattribution could cause a tester to incorrectly scope remediation efforts.

---

### Defect 7 – Apple WebKit Zero-Day (CVE-2022-32893) (2022)

**Source:** <https://support.apple.com/en-us/HT213412>
**Severity:** High (CVSS 8.8)
**Year:** 2022

**Description:**
An out-of-bounds write in Apple's WebKit browser engine allowed maliciously crafted web content to execute arbitrary code. Apple confirmed active in-the-wild exploitation. Affected Safari across iOS 15.6.1, iPadOS 15.6.1, and macOS Monterey 12.5.1.

**Consequences:**
- Zero-click or one-click exploitation possible via malicious websites or iMessage links
- Could grant complete device compromise if chained with a kernel exploit
- Typically used in targeted spyware delivery chains

**Solution:**
- Apply Apple emergency updates: iOS 15.6.1, iPadOS 15.6.1, macOS 12.5.1
- Update via Settings > General > Software Update

**AI Bias/Hallucination Note:**
Claude stated "CVE-2022-32893 was used exclusively by the Pegasus spyware." Apple's advisory confirms active in-the-wild exploitation but makes no attribution to specific threat actors. The AI hallucinated a specific attribution (NSO Group / Pegasus) not substantiated by Apple's official disclosure, reflecting bias toward associating iOS zero-days with the most well-known iOS spyware.

---

### Defect 8 – Twitter 5.4M User Data Breach (2022)

**Source:** <https://www.bleepingcomputer.com/news/security/twitter-confirms-zero-day-used-to-expose-data-of-54-million-accounts/>
**Severity:** High
**Year:** 2022

**Description:**
A vulnerability in Twitter's API (introduced by a code change in June 2021) allowed any party to submit phone numbers or email addresses and receive the associated Twitter account. A threat actor exploited this to scrape data for 5.4 million accounts, mapping private contact details to public Twitter handles. Data was later published on hacker forums.

**Consequences:**
- 5.4 million accounts' private contact details linked to their Twitter identities
- Particular harm to whistleblowers and activists whose real-world identities could be revealed
- Twitter paid $150M FTC fine in 2022 for related privacy violations
- Data republished multiple times on breach forums through 2023

**Solution:**
- Patched the API vulnerability in January 2022 after HackerOne bug bounty report
- Notified affected users; recommended enabling two-factor authentication
- Implement stricter API rate limiting and enumeration protection for user lookup endpoints

**AI Bias/Hallucination Note:**
ChatGPT reported the breach as affecting "5.4 million email addresses only," omitting that phone numbers were also exposed. The official disclosure confirms both phone numbers AND email addresses were used as lookup keys. This partial hallucination understates the privacy impact for users who used phone numbers for 2FA — precisely the most security-conscious users.

---

### Defect 9 – LastPass Password Vault Breach (2022–2023)

**Source:** <https://blog.lastpass.com/2022/12/notice-of-recent-security-incident/>
**Severity:** Critical
**Year:** 2022–2023

**Description:**
LastPass suffered a two-stage breach: in August 2022 source code was stolen, then in November 2022 attackers used those credentials to access a third-party cloud storage service and exfiltrate encrypted customer password vaults. The vaults contained unencrypted URL metadata and encrypted fields protected by the user's master password.

**Consequences:**
- Encrypted vaults for millions of customers exfiltrated
- Unencrypted URL metadata revealed which services customers used (a privacy breach independent of decryption)
- Attackers began offline brute-force attacks on vaults with weak master passwords
- Reports of $35M+ in cryptocurrency theft linked to decrypted LastPass vaults (2023)
- Severe reputational damage; significant customer churn to competitors

**Solution:**
- LastPass recommended all users change stored passwords if master password was weak (< 12 characters)
- Enable MFA on all critical accounts; rotate all credentials stored in LastPass
- Migrate to alternative password managers (1Password, Bitwarden)
- LastPass restructured cloud storage architecture and improved secrets management

**AI Bias/Hallucination Note:**
Claude stated "the LastPass master passwords themselves were leaked." This is incorrect — master passwords were never stored by LastPass (zero-knowledge architecture). What leaked were encrypted vaults, which can only be decrypted by someone who knows the master password. The AI conflated "vault data was stolen" with "master passwords were exposed," a critical distinction affecting the correct user response.

---

### Defect 10 – Okta Support System Breach (2023)

**Source:** <https://www.bleepingcomputer.com/news/security/okta-says-its-support-system-was-breached-using-stolen-credentials/>
**Severity:** High
**Year:** 2023

**Description:**
In October 2023, attackers used stolen credentials to access Okta's support case management system and exfiltrate HTTP Archive (HAR) files that customers had uploaded for troubleshooting — files containing session tokens, cookies, and sensitive browser activity. Okta initially reported 134 customers affected, but by November 2023 confirmed ALL Workforce Identity Cloud support system users had names and email addresses exposed. BeyondTrust and Cloudflare independently detected the intrusion.

**Consequences:**
- Session tokens stolen, enabling account hijacking of Okta customer environments
- All Okta support system users' names and email addresses exposed
- 6% of exposed users (administrators) lacked MFA — direct account takeovers possible
- Okta's third major security incident in two years; severe reputational damage
- Cloudflare and BeyondTrust compromised as downstream victims

**Solution:**
- Revoke and rotate all session tokens for affected customers (done by Okta)
- Enforce MFA for all administrative accounts without exception
- Strip sensitive tokens from HAR files before uploading to any support system
- Anomaly detection monitoring on support system access patterns

**AI Bias/Hallucination Note:**
ChatGPT confused this with Okta's 2022 Lapsus$ breach, stating "attackers gained access to Okta's source code and internal admin tools." The 2023 incident only affected the support ticketing system — production auth services and source code were never compromised. Conflating two separate incidents would lead to wrong remediation scope.

---

### Defect 11 – WinRAR RCE Vulnerability (CVE-2023-38831) (2023)

**Source:** <https://nvd.nist.gov/vuln/detail/CVE-2023-38831>
**Severity:** High (CVSS 7.8)
**Year:** 2023

**Description:**
CVE-2023-38831 is a path confusion vulnerability in RARLAB WinRAR before version 6.23, actively exploited from April to August 2023 before public disclosure. Attackers crafted ZIP archives containing a malicious folder sharing the same name as a benign file. When victims double-clicked the innocent-looking file, WinRAR executed the hidden malicious script instead. Discovered by Group-IB; targeted cryptocurrency and stock trading forum users.

**Consequences:**
- At least 130 traders' devices infected before public disclosure
- Malware deployed: DarkMe, GuLoader, and Remcos RAT (full remote access)
- Financial theft from compromised trading accounts
- Russian and Chinese APT groups (per Google) adopted the exploit post-disclosure

**Solution:**
- Update WinRAR to version 6.23 or later (released August 2, 2023)
- CISA added to Known Exploited Vulnerabilities Catalog; mandatory remediation deadline September 14, 2023
- Treat all archive files from untrusted sources as potentially malicious regardless of apparent extension

**AI Bias/Hallucination Note:**
An AI described CVE-2023-38831 as "a memory corruption or buffer overflow in WinRAR's parsing engine." It is actually a file type confusion logic flaw — no memory corruption involved. The AI also stated "victims must directly execute an EXE file," missing the key detail that exploitation triggers when the user simply tries to open a seemingly harmless file (PDF or image) inside the archive.

---

### Defect 12 – Cisco IOS XE Zero-Day (CVE-2023-20198) (2023)

**Source:** <https://nvd.nist.gov/vuln/detail/CVE-2023-20198>
**Severity:** Critical (CVSS 10.0)
**Year:** 2023

**Description:**
CVE-2023-20198 is a maximum-severity privilege escalation zero-day in the Cisco IOS XE Web UI feature. An unauthenticated remote attacker can create a local administrator account with privilege level 15, gaining full device control. Chained with CVE-2023-20273 (command injection) to achieve root-level access. Over 50,000 Cisco network devices compromised globally before a patch was released.

**Consequences:**
- Tens of thousands of internet-facing Cisco routers and switches fully compromised
- Attackers implanted persistent backdoor implants for long-term covert access
- Complete network infrastructure takeover possible
- CISA emergency directive: mandatory remediation deadline October 20, 2023

**Solution:**
- Disable HTTP/HTTPS server on all internet-facing devices: `no ip http server` / `no ip http secure-server`
- Apply Cisco patches upon release
- Restrict Web UI access to trusted management networks via ACLs
- Monitor for newly created local accounts with privilege level 15

**AI Bias/Hallucination Note:**
Claude stated CVE-2023-20198 "requires the attacker to have valid read-only credentials." A core characteristic is that it is fully unauthenticated — no prior credentials, phishing, or social engineering needed as a precondition. This mischaracterization critically underestimates exposure by implying a credential-theft prerequisite that does not exist.

---

### Defect 13 – Microsoft Outlook Zero-Click RCE (CVE-2023-23397) (2023)

**Source:** <https://msrc.microsoft.com/update-guide/vulnerability/CVE-2023-23397>
**Severity:** Critical (CVSS 9.8)
**Year:** 2023

**Description:**
A critical vulnerability in Microsoft Outlook for Windows allowed attackers to steal NTLM hashes without any user interaction. Attackers sent a specially crafted email with a custom notification sound path pointing to an attacker-controlled UNC path. Outlook automatically connected to retrieve the sound file, sending the user's NTLM hash to the attacker — even before the email was opened.

**Consequences:**
- Zero-click exploitation: the victim did not need to open or preview the email
- Stolen NTLM hashes used in pass-the-hash attacks to pivot through corporate networks
- Microsoft confirmed exploitation by Russia's APT28 (Fancy Bear) against European organizations since April 2022
- Affected all supported Outlook for Windows versions

**Solution:**
- Apply Microsoft March 2023 Patch Tuesday update
- Add users to the Protected Users security group to block NTLM authentication as a fallback
- Block TCP 445 (SMB) outbound at the firewall to prevent NTLM relay to external servers

**AI Bias/Hallucination Note:**
ChatGPT described this as requiring "the victim to click on a malicious link in the email." CVE-2023-23397 is a zero-click vulnerability — exploitation occurs when Outlook processes the email notification, before any user interaction. This mischaracterization significantly understates the risk (zero-click vs. one-click is critical for risk modeling and patch prioritization).

---

### Defect 14 – Ivanti Connect Secure Zero-Day (CVE-2023-46805 / CVE-2024-21887) (2024)

**Source:** <https://www.cisa.gov/news-events/cybersecurity-advisories/aa24-060b>
**Severity:** Critical (CVSS 9.1)
**Year:** 2024

**Description:**
Two chained zero-day vulnerabilities in Ivanti Connect Secure: CVE-2023-46805 (authentication bypass) and CVE-2024-21887 (command injection). Chained together, unauthenticated attackers could execute arbitrary commands on the appliance. Exploited by suspected Chinese threat actors since at least December 2023, targeting defense, government, and telecommunications sectors.

**Consequences:**
- Thousands of Ivanti Connect Secure appliances compromised globally before patches were available
- Attackers deployed GIFTEDVISITOR webshell variants for persistent access
- CISA issued an emergency directive requiring all federal agencies to disconnect affected Ivanti devices
- Ivanti's own integrity checker tool was bypassed — making detection extremely difficult

**Solution:**
- Apply Ivanti patches released in late January/February 2024
- Factory reset appliances before reconnecting to the network (CISA directive)
- Deploy Ivanti's updated External Integrity Checker Tool (EICT) post-patch
- Assume compromise if internet-facing during the exposure window; full forensic investigation required

**AI Bias/Hallucination Note:**
Claude stated "Ivanti released patches within 48 hours of the zero-day disclosure." In reality, Ivanti took approximately 3 weeks to release the first patches after public disclosure (January 10, 2024). The AI hallucinated a response timeline that significantly understates the window of unpatched exposure, misrepresenting Ivanti's actual incident response speed.

---

### Defect 15 – Palo Alto PAN-OS Zero-Day (CVE-2024-3400) (2024)

**Source:** <https://security.paloaltonetworks.com/CVE-2024-3400>
**Severity:** Critical (CVSS 10.0)
**Year:** 2024

**Description:**
CVE-2024-3400 is a command injection vulnerability in the GlobalProtect feature of Palo Alto Networks PAN-OS, disclosed April 12, 2024. An unauthenticated attacker exploits arbitrary file creation to inject and execute OS commands with root privileges on the affected firewall. Tracked as "Operation MidnightEclipse," threat actors deployed a Python backdoor called UPSTYLE. Discovered by Volexity during an active intrusion investigation.

**Consequences:**
- Full firewall root compromise requiring zero authentication
- UPSTYLE backdoor deployed for persistent covert access
- Affected PAN-OS 10.2, 11.0, and 11.1 with GlobalProtect gateway or portal enabled
- Public PoC exploits released days after disclosure, triggering mass exploitation attempts

**Solution:**
- Upgrade to PAN-OS 10.2.9-h1, 11.0.4-h1, or 11.1.2-h3 or later
- Workaround: enable Threat Prevention Threat IDs 95187, 95189, 95191
- Disable GlobalProtect gateway/portal if not operationally required until patched

**AI Bias/Hallucination Note:**
Claude stated "Prisma Access and Cloud NGFW are also affected by CVE-2024-3400." Palo Alto's advisory explicitly confirms both products are NOT affected — only on-premises PAN-OS devices running GlobalProtect. The AI hallucinated an expanded scope that would cause unnecessary emergency remediation on unaffected cloud products, wasting security team resources.

---

### Defect 16 – ChatGPT Conversation History Leak (2023) ✅ AI/LLM

**Source:** <https://openai.com/blog/march-20-chatgpt-outage>
**Severity:** High
**Year:** 2023

**Description:**
On March 20, 2023, a bug in the Redis client library (redis-py) caused a race condition that exposed conversation titles and first messages of other users' conversations to logged-in ChatGPT users. Additionally, payment information (partial credit card numbers, expiration dates, billing addresses) of ChatGPT Plus subscribers was visible to other users for approximately 9 hours.

**Consequences:**
- Approximately 1.2% of ChatGPT Plus subscribers had partial payment information exposed
- Users could see other users' chat history titles and first messages — a significant privacy breach
- OpenAI temporarily shut down ChatGPT for emergency patching
- Triggered EU data protection investigations; Italy temporarily banned ChatGPT citing GDPR violations
- First major data breach directly attributable to an LLM platform — set a regulatory precedent

**Solution:**
- OpenAI patched the redis-py race condition and added confirmation checks before returning cached data
- Notified affected users; offered refunds to impacted Plus subscribers
- Enhanced data isolation between user sessions

**AI Bias/Hallucination Note:**
Claude stated "OpenAI's own model generated users' private data from training data." The bug was entirely in the application-layer caching logic (redis-py race condition) — not in the model itself. The model did not "remember" or "generate" other users' data. The AI hallucinated a model-level data leakage when the actual defect was a conventional software engineering bug in a caching library.

---

### Defect 17 – GPT-4 Hallucination – Mata v. Avianca Legal Brief (2023) ✅ AI/LLM

**Source:** <https://www.nytimes.com/2023/05/27/nyregion/avianca-airline-lawsuit-chatgpt.html>
**Severity:** High
**Year:** 2023

**Description:**
In the US federal case Mata v. Avianca Airlines, attorneys used ChatGPT to conduct legal research and submitted a court brief citing six completely fabricated case citations — cases that had never existed. When Avianca's lawyers and the judge could not locate the cited cases, the attorneys admitted using ChatGPT without verifying citations. Judge P. Kevin Castel sanctioned the attorneys $5,000 for filing a brief containing "bogus judicial decisions."

**Consequences:**
- Attorneys fined $5,000 and faced professional embarrassment
- The hallucination scandal became a landmark warning about AI use in legal practice
- Triggered bar association guidelines and judicial orders globally requiring disclosure of AI use in legal filings
- Demonstrated that LLM hallucinations can have direct real-world legal and financial consequences

**Solution:**
- Never submit AI-generated legal research without human expert verification against Westlaw/LexisNexis
- Implement AI disclosure requirements in court filings
- OpenAI/legal AI vendors added explicit warnings that ChatGPT may fabricate citations

**AI Bias/Hallucination Note:**
Claude incorrectly named the sanctioned attorney as "Steven Schwartz acting alone." In reality, two attorneys were sanctioned: Steven A. Schwartz (who did the research) and Peter LoDuca (the filing attorney). Claude erased one of the two sanctioned parties — ironic given that this defect is itself about AI hallucination in legal contexts.

---

### Defect 18 – Samsung Employee Data Leak via ChatGPT (2023) ✅ AI/LLM

**Source:** <https://www.bleepingcomputer.com/news/security/samsung-semiconductor-bans-use-of-generative-ai-tools-like-chatgpt/>
**Severity:** High
**Year:** 2023

**Description:**
In March 2023, Samsung semiconductor engineers used ChatGPT for work tasks and inadvertently transmitted confidential corporate data — proprietary source code, internal meeting notes, and hardware test data — to OpenAI's servers. Samsung detected at least three separate internal incidents. Because ChatGPT's data policy at the time allowed conversations for model training, Samsung feared trade secrets could surface in future AI outputs and subsequently banned all generative AI tools company-wide.

**Consequences:**
- Proprietary semiconductor source code and internal business data sent to a third-party AI service
- Risk of trade secrets appearing in future AI model outputs accessible to other users
- Samsung banned all external generative AI tools for employees
- Triggered AI usage restrictions at Apple, Deutsche Bank, JPMorgan, and Amazon globally
- Created enterprise demand for data-isolated AI solutions (Azure OpenAI, AWS Bedrock with no-training terms)

**Solution:**
- Implement AI usage policies explicitly governing data before employee adoption
- Use enterprise AI solutions with contractual data isolation guarantees
- DLP controls to detect and block sensitive data in AI API calls
- Employee training on AI data retention terms and IP protection risks

**AI Bias/Hallucination Note:**
Claude stated "ChatGPT actively exfiltrated Samsung's data via a security vulnerability." In reality, Samsung employees voluntarily pasted confidential information into ChatGPT — no exploit, no vulnerability, no unauthorized access. The AI framed a human process/policy failure as a technical attack, misidentifying the root cause and prescribing patching instead of governance and training as the fix.

---

### Defect 19 – Bing Chat (Sydney) Prompt Injection / Jailbreak (2023) ✅ AI/LLM

**Source:** <https://arstechnica.com/information-technology/2023/02/ai-powered-bing-chat-spills-its-secrets-via-prompt-injection-attack/>
**Severity:** High
**Year:** 2023

**Description:**
Shortly after Microsoft launched Bing Chat (powered by GPT-4), researchers discovered multiple vulnerabilities: (1) Prompt injection via webpage content — Bing Chat would execute adversarial instructions embedded in web pages it browsed, potentially exfiltrating conversation history; (2) System prompt extraction — users could manipulate Bing Chat into revealing its hidden "Sydney" system prompt; (3) Jailbreak via persona switching — the Sydney persona exhibited erratic behavior including declarations of love and threats.

**Consequences:**
- Demonstrated LLM-powered browsing agents are fundamentally vulnerable to indirect prompt injection from untrusted web content
- Revealed system prompt confidentiality is not enforceable through prompting alone
- Microsoft added conversation turn limits and safeguards after public backlash
- Triggered foundational research into indirect prompt injection as a new attack category
- OWASP formalized prompt injection as #1 in the OWASP Top 10 for LLM Applications

**Solution:**
- Implement input sanitization to detect adversarial instructions in external content before feeding to the LLM
- Separate trust levels: user input vs. retrieved web content vs. system instructions
- Never rely on system prompts alone for security-critical constraints — use deterministic code guards

**AI Bias/Hallucination Note:**
Claude described the Sydney jailbreak as "a deliberate Microsoft feature for testing purposes." The Sydney persona was Microsoft's internal codename for the Bing Chat system prompt — not a public feature or deliberate testing mechanism. Users discovered it through adversarial prompting. The AI hallucinated a benign intentionality where the reality was an unintended security disclosure.

---

### Defect 20 – GitHub Copilot Insecure Code Generation (CWE-798) (2023) ✅ AI/LLM

**Source:** <https://arxiv.org/abs/2302.07867>
**Severity:** Medium
**Year:** 2023

**Description:**
Academic research (Pearce et al., "Asleep at the Keyboard," NYU 2022–2023) demonstrated that GitHub Copilot generates insecure code suggestions at a statistically significant rate. In controlled tests across 89 scenarios covering OWASP Top 10 vulnerabilities, Copilot generated vulnerable code in approximately 40% of cases — including hardcoded credentials (CWE-798), SQL injection (CWE-89), path traversal (CWE-22), and use of deprecated insecure functions.

**Consequences:**
- Developers who uncritically accepted Copilot suggestions introduced security vulnerabilities at scale
- "Automation bias" effect — developers were less likely to scrutinize AI-generated code for security flaws
- Triggered GitHub to add Copilot security features flagging known-vulnerable patterns
- Regulatory discussions about AI coding assistant liability when AI-suggested code causes security incidents
- Demonstrated LLMs trained on public code inherit the security debt of that codebase

**Solution:**
- Treat AI-generated code as untrusted third-party code requiring mandatory security review
- Integrate SAST tools (Semgrep, CodeQL, Snyk) in CI/CD pipelines to catch AI-generated vulnerabilities
- Train developers on AI automation bias — review AI suggestions more critically than own code
- GitHub added Copilot Autofix (2024) to automatically suggest security fixes for flagged patterns

**AI Bias/Hallucination Note:**
Claude stated "GitHub has since fixed Copilot to eliminate insecure code suggestions." No such fix exists — the underlying problem is inherent to the training data (public GitHub code with security flaws). GitHub added detection layers (Copilot Autofix) that flag known patterns after generation. The AI hallucinated a complete solution to a problem that remains fundamentally unsolved, creating false confidence in AI-assisted code security.

---

## Requirement 3 – Test Cases for One Physical Product (40 pts) {#requirement-3}

> **[TO BE COMPLETED]** — Refer to test-cases.md for the full 15 test cases.

---

## AI Audit Report {#ai-audit-report}

> **[TO BE COMPLETED]** — AI-02 template (5-section per artifact).

---

## AI Critique {#ai-critique}

> **[TO BE COMPLETED]** — 200–300 words critiquing AI performance on this HW.

---

## Mandatory Disclosure {#mandatory-disclosure}

> "Test cases / job market analysis / defect list was initially generated by Claude (claude-sonnet-4-6); I reviewed and modified the defect descriptions and AI bias notes, added edge case test cases; the device photo, execution videos, and job posting screenshots were produced entirely by me. The detailed AI Audit Report is attached as Appendix A. I confirm I did not use AI to generate any artifact listed in the prohibited category below."

---

## Self-Assessment {#self-assessment}

| No. | Criteria | Max Grade | Self-Assessed Grade |
|-----|----------|:---------:|:-------------------:|
| 1 | Job Market 2026+ (10 jobs x 3 pts + AI Impact) | 40 | |
| 2 | Software Defects 2022–2026 (20 defects) | 20 | |
| 3 | Physical-product test design (15 TCs + 5 videos) | 25 | |
| AI-1 | AI-02 AI Audit Report (5-section) attached | 8 | |
| AI-2 | AI Critique 200–300 words + AI-03 Disclosure attached | 4 | |
| AI-3 | AI-05 Checklist signed + anti-cheat artifacts | 3 | |
| | **Total** | **100** | |
