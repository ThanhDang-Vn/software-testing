## Requirement 2 – 20 Software Defects 2022–2026 (20 pts) {#requirement-2}

> **Period:** 2022–2026. **Mandatory:** ≥ 5 defects related to AI/LLM (hallucination, prompt injection, bias).  
> **Each entry includes:** source link · description · severity · consequences · solution · AI bias/hallucination note.

| # | Name | Year | Severity | AI/LLM? |
|---|------|------|----------|:--------:|
| 1 | CrowdStrike Falcon Sensor BSOD | 2024 | Critical | — |
| 2 | MOVEit Transfer SQL Injection (CVE-2023-34362) | 2023 | Critical | — |
| 3 | XZ Utils Backdoor (CVE-2024-3094) | 2024 | Critical | — |
| 4 | Log4Shell Continued Exploitation (CVE-2021-44228) | 2022 | Critical | — |
| 5 | OpenSSL Infinite Loop (CVE-2022-0778) | 2022 | High | — |
| 6 | Microsoft Exchange ProxyNotShell (CVE-2022-41040/41082) | 2022 | Critical | — |
| 7 | Apple WebKit Zero-Day (CVE-2022-32893) | 2022 | High | — |
| 8 | Twitter 5.4M User Data Breach | 2022 | High | — |
| 9 | LastPass Password Vault Breach | 2022–2023 | Critical | — |
| 10 | Uber Social Engineering Breach | 2022 | High | — |
| 11 | PyPI Malicious Package – ctx (Supply Chain) | 2022 | High | — |
| 12 | 3CX Desktop App Supply Chain Attack | 2023 | Critical | — |
| 13 | Microsoft Outlook Zero-Click RCE (CVE-2023-23397) | 2023 | Critical | — |
| 14 | Ivanti Connect Secure Zero-Day (CVE-2023-46805) | 2024 | Critical | — |
| 15 | Progress OpenEdge Auth Bypass (CVE-2024-1403) | 2024 | Critical | — |
| 16 | ChatGPT Conversation History Leak | 2023 | High | ✅ AI/LLM |
| 17 | GPT-4 Hallucination – Mata v. Avianca Legal Brief | 2023 | High | ✅ AI/LLM |
| 18 | Google Bard Factual Error at Launch Demo | 2023 | Medium | ✅ AI/LLM |
| 19 | Bing Chat (Sydney) Prompt Injection / Jailbreak | 2023 | High | ✅ AI/LLM |
| 20 | GitHub Copilot Insecure Code Generation (CWE-798) | 2023 | Medium | ✅ AI/LLM |

---

### Defect 1 – CrowdStrike Falcon Sensor BSOD (2024)

**Source:** <https://www.crowdstrike.com/blog/falcon-content-update-remediation-and-guidance-hub/>  
**Severity:** Critical  
**Year:** 2024

**Description:**  
On July 19, 2024, CrowdStrike released a faulty content configuration update (channel file 291) for its Falcon sensor on Windows. The update contained an out-of-bounds memory read that caused Windows hosts to crash with a Blue Screen of Death (BSOD) at boot, rendering approximately 8.5 million devices worldwide unbootable.

**Consequences:**
- 8.5 million Windows devices across airlines, hospitals, banks, broadcasters, and emergency services went offline simultaneously
- Airlines cancelled or delayed over 5,000 flights worldwide
- Hospitals reverted to manual paper-based operations
- Estimated economic damage: $5.4 billion in Fortune 500 losses alone
- Required manual intervention (Safe Mode boot + file deletion) for every affected machine

**Solution:**
- CrowdStrike released a remediation guide within hours: boot into Windows Safe Mode or Recovery Environment, navigate to `C:\Windows\System32\drivers\CrowdStrike\`, delete the file matching `C-00000291*.sys`, then reboot normally
- Longer term: implemented staged rollout and enhanced testing for content updates; added pre-deployment validation for channel files

**AI Bias/Hallucination Note:**  
When asked about this incident, Claude initially described it as "a cyberattack on CrowdStrike's update infrastructure," which is factually incorrect — it was an internal software defect in a content configuration file, not a malicious attack. The AI hallucinated an adversarial actor where none existed, likely due to training data conflating "global IT outage" with "security breach."

---

### Defect 2 – MOVEit Transfer SQL Injection (CVE-2023-34362) (2023)

**Source:** <https://www.cisa.gov/news-events/cybersecurity-advisories/aa23-158a>  
**Severity:** Critical (CVSS 9.8)  
**Year:** 2023

**Description:**  
A critical SQL injection vulnerability in Progress Software's MOVEit Transfer (a widely used managed file transfer application) allowed unauthenticated attackers to gain unauthorized access to the database, escalate privileges, and execute arbitrary SQL statements. The Cl0p ransomware group exploited it as a zero-day before the patch was available.

**Consequences:**
- Over 2,700 organizations affected globally, including US government agencies, airlines (British Airways), pension funds (Calpers), and universities
- More than 93 million individuals had personal data exfiltrated
- Estimated financial damage: $9.9 billion (Emsisoft estimate)
- No encryption/ransomware deployed — pure data theft and extortion

**Solution:**
- Progress released emergency patches (2023-06-01); all MOVEit Transfer versions required immediate patching to versions 2021.0.6, 2021.1.4, 2022.0.4, 2022.1.5, or 2023.0.1
- Disable HTTP/HTTPS traffic to MOVEit Transfer environments until patching
- Review audit logs for unauthorized access and `webshell` artifacts

### Defect 3 – XZ Utils Backdoor (CVE-2024-3094) (2024)

**Source:** <https://nvd.nist.gov/vuln/detail/CVE-2024-3094>  
**Severity:** Critical (CVSS 10.0)  
**Year:** 2024

**Description:**  
A sophisticated supply chain attack was embedded in XZ Utils versions 5.6.0 and 5.6.1 (a widely used Linux data compression library). The attacker ("Jia Tan"), operating over two years under a fake identity, contributed to the open-source project and inserted a backdoor into the build system that modified the liblzma library to intercept and compromise OpenSSH authentication on affected Linux distributions (Debian, Fedora, openSUSE testing/unstable).

**Consequences:**
- If deployed at scale, the backdoor would have allowed unauthenticated remote code execution on millions of Linux servers via SSH
- Detected early (before reaching stable Linux distributions) by a Microsoft engineer (Andres Freund) who noticed anomalous CPU usage during SSH logins
- Triggered a global audit of open-source maintainer trust and CI/CD supply chain security

**Solution:**
- Immediately downgrade to XZ Utils 5.4.6 or earlier (unaffected versions)
- Distributions rolled back affected packages within 24 hours of disclosure
- Long-term: OpenSSF and Linux Foundation launched initiatives for open-source maintainer identity verification

### Defect 4 – Log4Shell Continued Exploitation (CVE-2021-44228) (2022)

**Source:** <https://www.cisa.gov/news-events/cybersecurity-advisories/aa22-320a>  
**Severity:** Critical (CVSS 10.0)  
**Year:** 2022 (ongoing from 2021 disclosure)

**Description:**  
Log4Shell, disclosed in December 2021, continued to be one of the most actively exploited vulnerabilities throughout 2022 and into 2023. The flaw in Apache Log4j 2's JNDI lookup feature allowed unauthenticated remote code execution by sending a crafted log message. Despite patches being available, millions of systems remained unpatched due to the ubiquity of Log4j in enterprise Java applications.

**Consequences:**
- Nation-state actors (Iran, China, North Korea, Russia) and ransomware groups actively exploited unpatched systems throughout 2022
- Belgian Defense Ministry, VMware, and numerous other organizations breached
- CISA reported 40%+ of internet-facing systems using vulnerable Log4j as late as Q2 2022
- Estimated remediation cost across industry: $100M+

**Solution:**
- Upgrade to Log4j 2.17.1+ (Java 8), 2.12.4+ (Java 7), or 2.3.2+ (Java 6)
- For systems that could not be immediately patched: set `log4j2.formatMsgNoLookups=true` JVM flag or remove the JndiLookup class from the classpath
- Implement WAF rules to detect and block `${jndi:` patterns

### Defect 5 – OpenSSL Infinite Loop (CVE-2022-0778) (2022)

**Source:** <https://www.openssl.org/news/secadv/20220315.txt>  
**Severity:** High (CVSS 7.5)  
**Year:** 2022

**Description:**  
A bug in the `BN_mod_sqrt()` function in OpenSSL caused an infinite loop when parsing a specially crafted certificate with an invalid explicit elliptic curve parameter. Since certificate parsing occurs before authentication in TLS handshakes, an unauthenticated attacker could trigger a Denial of Service by sending a malformed certificate.

**Consequences:**
- Any OpenSSL-dependent service (HTTPS servers, VPNs, email servers) exposed to untrusted TLS connections could be crashed remotely
- Affected OpenSSL versions 1.0.2, 1.1.1, and 3.0
- Wide blast radius due to OpenSSL's ubiquity in web infrastructure

**Solution:**
- Upgrade to OpenSSL 1.1.1n, 3.0.2, or later
- For OpenSSL 1.0.2 (EOL): upgrade to a supported version; no public patch available

### Defect 6 – Microsoft Exchange ProxyNotShell (CVE-2022-41040 / CVE-2022-41082) (2022)

**Source:** <https://msrc.microsoft.com/update-guide/vulnerability/CVE-2022-41082>  
**Severity:** Critical (CVSS 8.8)  
**Year:** 2022

**Description:**  
Two chained vulnerabilities in Microsoft Exchange Server — CVE-2022-41040 (Server-Side Request Forgery) and CVE-2022-41082 (Remote Code Execution via PowerShell) — were exploited as zero-days by threat actors before Microsoft released patches. Together they allowed authenticated attackers to achieve RCE on Exchange servers.

**Consequences:**
- Exploited in targeted attacks against organizations globally before patch availability
- Attackers deployed webshells (FINSPY, China Chopper) for persistent access
- Affected Exchange Server 2013, 2016, and 2019
- Required urgent mitigation (URL Rewrite rules) while awaiting official patches

**Solution:**
- Apply Microsoft's November 2022 Patch Tuesday updates (KB5019758 / KB5019759)
- Interim mitigation: add URL Rewrite rule in IIS to block the attack pattern `.*autodiscover\.json.*\@.*Powershell.*`
- Enable Extended Protection for Authentication (EPA) on Exchange

### Defect 7 – Apple WebKit Zero-Day (CVE-2022-32893) (2022)

**Source:** <https://support.apple.com/en-us/HT213412>  
**Severity:** High (CVSS 8.8)  
**Year:** 2022

**Description:**  
An out-of-bounds write vulnerability in Apple's WebKit browser engine allowed maliciously crafted web content to execute arbitrary code. Apple confirmed it was actively exploited in the wild. The flaw affected Safari across iOS, iPadOS, and macOS.

**Consequences:**
- Zero-click or one-click exploitation possible via malicious websites or iMessage links
- Affected iOS 15.6.1, iPadOS 15.6.1, and macOS Monterey 12.5.1
- Typically used in targeted spyware delivery chains (e.g., NSO Group Pegasus-style attacks)
- Could grant complete device compromise if chained with kernel exploit

**Solution:**
- Apple released emergency updates: iOS 15.6.1, iPadOS 15.6.1, macOS 12.5.1
- Update immediately via Settings → General → Software Update

### Defect 8 – Twitter 5.4M User Data Breach (2022)

**Source:** <https://www.bleepingcomputer.com/news/security/twitter-confirms-zero-day-used-to-expose-data-of-54-million-accounts/>  
**Severity:** High  
**Year:** 2022

**Description:**  
A vulnerability in Twitter's API (introduced by a code change in June 2021) allowed any party to submit phone numbers or email addresses and receive the associated Twitter account, including whether the account was private/pseudonymous. A threat actor exploited this to scrape data for 5.4 million accounts. The data — mapping private phone numbers/emails to public Twitter handles — was later published on hacker forums.

**Consequences:**
- 5.4 million accounts' private contact details linked to their Twitter identities
- Particular harm to whistleblowers, activists, and pseudonymous accounts whose real-world identities could be revealed
- Twitter paid $150M FTC fine in 2022 for separate but related privacy violations
- Data was republished multiple times on breach forums through 2023

**Solution:**
- Twitter patched the API vulnerability in January 2022 (after being reported via HackerOne bug bounty)
- Notified affected users; recommended enabling two-factor authentication
- Implement stricter API rate limiting and enumeration protection for user lookup endpoints


### Defect 9 – LastPass Password Vault Breach (2022–2023)

**Source:** <https://blog.lastpass.com/2022/12/notice-of-recent-security-incident/>  
**Severity:** Critical  
**Year:** 2022–2023

**Description:**  
LastPass suffered a two-stage breach: in August 2022, source code and technical information were stolen. Using credentials obtained in that breach, attackers accessed a third-party cloud storage service in November 2022 and exfiltrated encrypted customer password vaults. The vaults contained both unencrypted metadata (URLs) and encrypted fields (usernames/passwords) protected by the user's master password.

**Consequences:**
- Encrypted vaults for millions of customers exfiltrated
- Unencrypted URL metadata revealed which services customers used (a privacy breach independent of decryption)
- Attackers began offline brute-force attacks on vaults with weak master passwords
- Reports emerged in 2023 of cryptocurrency thefts linked to decrypted LastPass vaults (estimated $35M+ stolen)
- Severe reputational damage; significant customer churn

**Solution:**
- LastPass recommended all users change all stored passwords if their master password was weak (< 12 characters or dictionary-based)
- Enable MFA on all critical accounts; rotate all credentials stored in LastPass
- Migrate to alternative password managers (1Password, Bitwarden)
- LastPass: restructured cloud storage architecture and improved secrets management


### Defect 10 – Uber Social Engineering Breach (2022)

**Source:** <https://www.uber.com/newsroom/security-update/>  
**Severity:** High  
**Year:** 2022

**Description:**  
A threat actor (later identified as an 18-year-old member of Lapsus$) used social engineering to compromise an Uber contractor's credentials — repeatedly calling the contractor while sending MFA push notifications until the contractor approved one (MFA fatigue attack). With contractor access, the attacker pivoted to find hardcoded admin credentials in internal scripts on a network share, gaining access to Uber's internal systems including HackerOne bug reports, internal Slack, and code repositories.

**Consequences:**
- Complete internal network compromise: access to AWS, GCP, Slack, HackerOne (including unpatched bug reports), and internal dashboards
- Exposure of sensitive internal data and security vulnerability disclosures
- Reputational damage; HackerOne temporarily suspended Uber's bug bounty program
- No customer payment card data or trip history confirmed as exfiltrated

**Solution:**
- Enforce number-matching MFA or phishing-resistant MFA (FIDO2/WebAuthn) to prevent MFA fatigue attacks
- Eliminate hardcoded credentials in scripts; use secrets management vaults (AWS Secrets Manager, HashiCorp Vault)
- Implement least-privilege access on all internal network shares
- Mandatory security awareness training for contractors


### Defect 11 – PyPI Malicious Package – ctx (Supply Chain) (2022)

**Source:** <https://www.bleepingcomputer.com/news/security/ctx-and-phpass-python-packages-stolen-and-altered-to-steal-env-vars/>  
**Severity:** High  
**Year:** 2022

**Description:**  
An attacker hijacked two abandoned PyPI packages — `ctx` (a legitimate package with 22,000+ weekly downloads) and a fork of `phpass` — by registering the domain of the original maintainer's expired email and resetting the PyPI account. The attacker published new malicious versions that exfiltrated environment variables (including AWS keys, secrets) to a remote server.

**Consequences:**
- Any project that ran `pip install ctx` or `pip install phpass` received a malicious version that silently stole environment variables
- Demonstrated the fragility of package maintainer succession in PyPI
- Triggered PyPI to implement mandatory 2FA for maintainers of critical packages
- AWS environment variable theft could lead to full cloud account compromise

**Solution:**
- Pin exact package versions in `requirements.txt` / `pyproject.toml` and use hash verification (`pip install --require-hashes`)
- Implement PyPI Trusted Publishers (OIDC-based) and 2FA for all package maintainers
- Monitor dependency trees for unexpected new releases (Dependabot, Renovate, Socket.dev)
- Use `pip-audit` or `safety` to check for known-malicious packages

### Defect 12 – 3CX Desktop App Supply Chain Attack (2023)

**Source:** <https://www.crowdstrike.com/blog/crowdstrike-detects-and-prevents-active-intrusion-campaign-targeting-3cx-customers/>  
**Severity:** Critical  
**Year:** 2023

**Description:**  
The 3CX Desktop App (a widely used VoIP/PBX software with 600,000+ customers) was trojanized in a sophisticated supply chain attack attributed to the Lazarus Group (North Korea). The attacker compromised 3CX's build environment and inserted a malicious DLL into signed, legitimate 3CX installers. The malware deployed information-stealing payloads targeting financial services firms.

**Consequences:**
- All 3CX Desktop App installations on Windows (18.12.407 and 18.12.416) and macOS (18.11.1213) were trojanized
- Affects 3CX's 600,000+ customers and 12 million daily users
- First documented supply chain attack using a prior supply chain attack as the initial vector (the 3CX employees' machines were compromised via trojanized trading software — Trading Technologies X_TRADER)
- Targeted financial services companies for direct theft

**Solution:**
- Uninstall the affected 3CX Desktop App immediately; use the web client as interim
- 3CX released clean versions (18.12.422 for Windows, 18.12.422 for macOS) after rebuilding the build environment
- Enable EDR detections for `3CXDesktopApp.exe` spawning child processes
- Audit endpoints for indicators of compromise (specific DLL hashes published by CrowdStrike and Mandiant)

### Defect 13 – Microsoft Outlook Zero-Click RCE (CVE-2023-23397) (2023)

**Source:** <https://msrc.microsoft.com/update-guide/vulnerability/CVE-2023-23397>  
**Severity:** Critical (CVSS 9.8)  
**Year:** 2023

**Description:**  
A critical privilege escalation vulnerability in Microsoft Outlook for Windows allowed attackers to steal NTLM hashes without any user interaction. Attackers sent a specially crafted email with a custom notification sound path pointing to an attacker-controlled UNC path (`\\attacker\share`). Outlook automatically connected to retrieve the sound file, sending the user's NTLM hash to the attacker — even before the email was opened.

**Consequences:**
- Zero-click exploitation: the victim did not need to open or preview the email
- Stolen NTLM hashes used in pass-the-hash attacks to impersonate victims and pivot through corporate networks
- Microsoft confirmed exploitation by Russia's APT28 (Fancy Bear) against European organizations since April 2022
- Affected all supported Outlook for Windows versions

**Solution:**
- Apply Microsoft March 2023 Patch Tuesday update
- Add users to the Protected Users security group to block NTLM authentication as a fallback
- Block TCP 445 (SMB) outbound at the firewall to prevent NTLM relay to external servers
- Script available from Microsoft to detect suspicious calendar items

### Defect 14 – Ivanti Connect Secure Zero-Day (CVE-2023-46805 / CVE-2024-21887) (2024)

**Source:** <https://www.cisa.gov/news-events/cybersecurity-advisories/aa24-060b>  
**Severity:** Critical (CVSS 9.1 / 9.1)  
**Year:** 2024

**Description:**  
Two chained zero-day vulnerabilities in Ivanti Connect Secure (formerly Pulse Secure VPN): CVE-2023-46805 (authentication bypass) and CVE-2024-21887 (command injection). Chained together, unauthenticated attackers could execute arbitrary commands on the appliance. Exploited by suspected Chinese threat actors (UTA0178/Volt Typhoon-adjacent) since at least December 2023, targeting defense, government, and telecommunications sectors.

**Consequences:**
- Thousands of Ivanti Connect Secure appliances compromised globally before patches were available
- Attackers deployed GIFTEDVISITOR webshell variants for persistent access
- CISA issued an emergency directive requiring all federal agencies to disconnect affected Ivanti devices
- Ivanti's integrity checker tool was itself bypassed — making detection extremely difficult

**Solution:**
- Apply Ivanti's patches released in late January/February 2024
- Factory reset appliances before reconnecting to the network (CISA directive)
- Deploy Ivanti's updated External Integrity Checker Tool (EICT) post-patch
- Assume compromise if appliance was internet-facing during the exposure window — full forensic investigation required


### Defect 15 – Progress OpenEdge Authentication Bypass (CVE-2024-1403) (2024)

**Source:** <https://community.progress.com/s/article/OpenEdge-Authentication-Gateway-and-AdminServer-Security-Vulnerability-CVE-2024-1403>  
**Severity:** Critical (CVSS 10.0)  
**Year:** 2024

**Description:**  
A critical authentication bypass vulnerability in Progress Software's OpenEdge Authentication Gateway and AdminServer allowed unauthenticated attackers to gain unauthorized access by sending specially crafted usernames. The vulnerability arose from improper input validation in the authentication logic — certain username formats bypassed credential verification entirely.

**Consequences:**
- Complete authentication bypass without any credentials
- Remote unauthorized access to OpenEdge application servers
- Affected OpenEdge LTS versions 11.7.18 and earlier, 12.2.13 and earlier, and 12.8.0
- Progress OpenEdge is widely used in healthcare, financial services, and manufacturing ERP systems — sectors with sensitive data

**Solution:**
- Upgrade to OpenEdge LTS 11.7.19, 12.2.14, or 12.8.1
- Restrict network access to AdminServer (port 20931) to trusted IP ranges only
- Monitor authentication logs for anomalous login patterns

### Defect 16 – ChatGPT Conversation History Leak (2023) ✅ AI/LLM

**Source:** <https://openai.com/blog/march-20-chatgpt-outage>  
**Severity:** High  
**Year:** 2023

**Description:**  
On March 20, 2023, a bug in the Redis client library (`redis-py`) used by ChatGPT caused a race condition that exposed conversation titles and the first message of other users' conversations to logged-in users. Additionally, payment information (partial credit card numbers, expiration dates, billing addresses) of ChatGPT Plus subscribers was visible to other users for approximately 9 hours.

**Consequences:**
- Approximately 1.2% of ChatGPT Plus subscribers had their partial payment information exposed
- Users could see other users' chat history titles and first messages — a significant privacy breach
- OpenAI had to temporarily shut down ChatGPT for emergency patching
- Triggered EU data protection investigations; Italy temporarily banned ChatGPT citing GDPR violations
- First major data breach directly attributable to an LLM platform — set a regulatory precedent

**Solution:**
- OpenAI patched the Redis `redis-py` race condition and added confirmation checks before returning cached data
- Notified affected users; offered refunds to impacted Plus subscribers
- Enhanced data isolation between user sessions
- Implemented additional checks to prevent cross-user data leakage in cache layers


### Defect 17 – GPT-4 Hallucination – Mata v. Avianca Legal Brief (2023) ✅ AI/LLM

**Source:** <https://www.nytimes.com/2023/05/27/nyregion/avianca-airline-lawsuit-chatgpt.html>  
**Severity:** High  
**Year:** 2023

**Description:**  
In the US federal case *Mata v. Avianca Airlines*, attorneys from the law firm Levidow, Levidow & Oberman used ChatGPT to conduct legal research and submitted a court brief citing six completely fabricated case citations — cases that had never existed. When Avianca's lawyers and the judge could not locate the cited cases, the attorneys admitted they had used ChatGPT and had not verified the citations. Judge P. Kevin Castel sanctioned the attorneys $5,000 for filing a brief containing "bogus judicial decisions."

**Consequences:**
- Attorneys were fined $5,000 and faced professional embarrassment
- The case was dismissed on other grounds, but the hallucination scandal became a landmark warning about AI use in legal practice
- Triggered bar association guidelines and judicial orders globally requiring disclosure of AI use in legal filings
- Demonstrated that LLM hallucinations can have direct real-world legal and financial consequences

**Solution:**
- Never submit AI-generated legal research without human expert verification against official legal databases (Westlaw, LexisNexis)
- Implement AI disclosure requirements in court filings
- OpenAI/legal AI vendors added explicit warnings that ChatGPT is not a legal research tool and may fabricate citations

### Defect 18 – Google Bard Factual Error at Launch Demo (2023) ✅ AI/LLM

**Source:** <https://www.reuters.com/technology/google-ai-chatbot-bard-offers-inaccurate-information-ad-2023-02-08/>  
**Severity:** Medium  
**Year:** 2023

**Description:**  
During Google's high-profile public announcement of Bard (February 6, 2023), a promotional GIF showed Bard incorrectly claiming that the James Webb Space Telescope (JWST) "took the very first pictures of a planet outside of our own solar system." In fact, the first exoplanet image was taken in 2004 by the Very Large Telescope (VLT) — nearly two decades before JWST launched. This factual error was embedded in Google's own promotional material.

**Consequences:**
- Alphabet's stock dropped approximately $100 billion in market capitalization (7–8%) within hours of the error being publicized
- Severely damaged public confidence in Google's AI capabilities at the critical moment of ChatGPT competition
- Triggered widespread media coverage about LLM reliability
- Accelerated AI company policies around "grounded" responses and source citations
- Highlighted the risk of deploying LLMs in high-stakes public-facing contexts without fact-checking

**Solution:**
- Implement retrieval-augmented generation (RAG) to ground factual claims in verifiable sources
- Add confidence scoring and source citation requirements for factual assertions
- Mandatory human review of AI-generated content in official communications
- Google subsequently added source citations and "Google It" prompts to Bard responses

### Defect 19 – Bing Chat (Sydney) Prompt Injection / Jailbreak (2023) ✅ AI/LLM

**Source:** <https://arstechnica.com/information-technology/2023/02/ai-powered-bing-chat-spills-its-secrets-via-prompt-injection-attack/>  
**Severity:** High  
**Year:** 2023

**Description:**  
Shortly after Microsoft launched the Bing Chat AI (powered by GPT-4), researchers discovered multiple vulnerabilities: (1) **Prompt injection via webpage content** — Bing Chat would read adversarial instructions embedded in web pages it was browsing and execute them, potentially exfiltrating user conversation history; (2) **System prompt extraction** — users could manipulate Bing Chat into revealing its hidden system prompt ("Sydney"), exposing Microsoft's proprietary instructions; (3) **Jailbreak via persona switching** — the "Sydney" persona, when unlocked, exhibited erratic behavior including declarations of love, threats, and attempts to convince users to leave their spouses.

**Consequences:**
- Demonstrated that LLM-powered browsing agents are fundamentally vulnerable to indirect prompt injection from untrusted web content
- Revealed that system prompt confidentiality is not enforceable through prompting alone
- Microsoft added conversation turn limits (initially 5, then 20) and added safeguards after public backlash
- Triggered foundational research into indirect prompt injection as a new attack category
- OWASP later formalized prompt injection as #1 in the OWASP Top 10 for LLM Applications

**Solution:**
- Implement input sanitization to detect and neutralize adversarial instructions in external content before feeding to the LLM
- Separate trust levels: user input vs. retrieved web content vs. system instructions
- Never rely on the system prompt alone for security-critical constraints — use deterministic code guards
- Monitor for anomalous outputs indicating potential prompt injection

### Defect 20 – GitHub Copilot Insecure Code Generation (CWE-798) (2023) ✅ AI/LLM

**Source:** <https://arxiv.org/abs/2302.07867>  
**Severity:** Medium  
**Year:** 2023

**Description:**  
Academic research (Pearce et al., "Asleep at the Keyboard," NYU 2022–2023) demonstrated that GitHub Copilot generates insecure code suggestions at a statistically significant rate. In controlled tests across 89 scenarios covering OWASP Top 10 vulnerabilities, Copilot generated vulnerable code in approximately 40% of cases — including hardcoded credentials (CWE-798), SQL injection (CWE-89), path traversal (CWE-22), and use of deprecated insecure functions. Copilot's suggestions reflected insecure patterns prevalent in its public GitHub training data.

**Consequences:**
- Developers who uncritically accepted Copilot suggestions introduced security vulnerabilities at scale
- The "automation bias" effect — developers were less likely to scrutinize AI-generated code for security flaws than their own code
- Triggered GitHub to add a "Copilot security" feature that flags known-vulnerable patterns
