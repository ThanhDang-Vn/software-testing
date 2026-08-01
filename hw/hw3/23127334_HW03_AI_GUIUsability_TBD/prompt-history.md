# Prompt History

This file records the student's prompts for the HW03 working session in
chronological order. Prompts are preserved as written, including spelling and
capitalization. Assistant responses and human-review decisions are documented
separately in `reports/ai-audit-report.md`.

## Prompt 001

- Date: 2026-07-26
- Prompt:

> Thực hiện homework 3

## Prompt 002

- Date: 2026-07-26
- Prompt:

> dùng eshop-sut ddi

## Prompt 003

- Date: 2026-07-26
- Prompt:

> | A — Authentication | FR-02   | Login & Account Lockout    |
> | B — Shopping Cart  | FR-11   | Order History View (User)  | đây là 2 fr của tôi giúp tôi define screen và flow đi

## Prompt 004

- Date: 2026-07-26
- Prompt:

> tôi thấy oke, còn github thì phase nào cần thì mới cung cấp, dùng sus

## Prompt 005

- Date: 2026-07-26
- Prompt:

> KHông trùng và điểm thì chỉ khi tôi hoàn thành thì mới đánh giá được. Nên just do it

## Prompt 006

- Date: 2026-07-26
- Prompt:

> Trong checklist có yêu cầu cột source hả

## Prompt 007

- Date: 2026-07-26
- Prompt:

> Bạn phải tạo cho tôi 1 bảng v0 là bản agent gen hoàn toàn, và bản v1 là bản user sau khi review, bỏ cột source đi,

## Prompt 008

- Date: 2026-07-26
- Prompt:

> - on checklist, eliminate some cases related security, backend and business logic because in this assignment we just focus on GUI case
> - remove some case like GUI-O-017, GUI-O-001, GUI-L-022 because that we do not have any standard for that

## Prompt 009

- Date: 2026-07-26
- Prompt:

> những prompt của tôi cũng nên được cập nhật thưởng xuyên vào một file prompt-history.md nhé

## Prompt 010

- Date: 2026-07-26
- Prompt:

> Review the attached GUI checklist.
>
> Do not rewrite any test case yet.
>
> For every checklist item, classify its primary scope as exactly one of:
>
> - GUI / Visual
> - Accessibility
> - Usability
> - Functional
> - Security
> - Performance
> - Data integrity
>
> Produce a review table with these columns:
>
> - ID
> - Current category
> - Primary scope
> - Decision: Keep / Rewrite / Move outside GUI checklist
> - Reason
>
> Rules:
>
> 1. Keep accessibility and usability items inside the GUI checklist.
> 2. Mark backend authorization, account enumeration, token/session behavior,
>    API-data comparison, caching security, and authentication logic as
>    candidates to move outside the GUI checklist.
> 3. Do not remove an item only because it requires developer tools.
> 4. Do not change IDs or create replacement cases.
> 5. Be strict about cases that mix GUI assertions with backend assertions.
> 6. Do not fill Status, Actual Result, Notes, or Evidence.
> 7. Finish with:
>    - Number of items to Keep
>    - Number of items to Rewrite
>    - Number of items to Move
>    - Remaining GUI checklist count

## Prompt 011

- Date: 2026-07-26
- Prompt:

> Update the checklist column structure without changing the test-case content.
>
> Use this exact column order:
>
> ID
> Screen
> IA
> Category
> Check
> Requirement or Heuristic Source
> Preconditions
> Test Steps
> Expected Result
> Source
> Why AI Missed It
> Human Review or Modification
> Status
> Actual Result
> Notes
> Evidence
> Bug ID or GitHub Issue
>
> Rules:
>
> 1. Preserve every existing row and ID.
> 2. Rename "Test Action" to "Test Steps".
> 3. Keep all execution fields blank:
>    - Status
>    - Actual Result
>    - Notes
>    - Evidence
>    - Bug ID or GitHub Issue
> 4. Do not invent test results.
> 5. For AI Initial items:
>    - Leave "Why AI Missed It" blank.
> 6. For Human Added items:
>    - Do not invent the explanation yet.
>    - Insert "[TO BE COMPLETED BY STUDENT]".
> 7. For Refined items:
>    - Set Human Review or Modification to:
>      "AI-generated item revised during human review."
> 8. Return the updated CSV only.

## Prompt 012

- Date: 2026-07-26
- Prompt:

> Using the scope-review result, revise the checklist so that it contains only:
>
> - GUI testing
> - Accessibility testing
> - UI-related usability testing
> - Visible feedback and state testing
>
> For items classified as Functional, Security, Data integrity, or Performance:
>
> 1. Do not delete them permanently.
> 2. Move them into a separate section named:
>    "Non-GUI Supporting Tests".
> 3. Preserve their original IDs.
> 4. Add a column named "Recommended Test Suite":
>    - Functional
>    - Security
>    - Integration
>    - Performance
>
> For mixed items:
>
> 1. Keep the visible UI assertion in the GUI checklist.
> 2. Move the backend, network, security, or database assertion into a new
>    supporting test.
> 3. Use suffixes such as:
>    - GUI-L-011A
>    - GUI-L-011B
> 4. Preserve traceability to the original ID.
>
> Do not produce Pass or Fail results.
>
> Output:
>
> 1. Revised GUI checklist.
> 2. Non-GUI Supporting Tests.
> 3. A migration log containing:
>    - Original ID
>    - New ID
>    - What was moved
>    - Why it was moved

## Prompt 013

- Date: 2026-07-26
- Prompt:

> • 1. hw3/23127334_HW03_AI_GUIUsability_TBD/task-1-gui-checklist/revised-gui-checklist.csv
>   2. hw3/23127334_HW03_AI_GUIUsability_TBD/task-1-gui-checklist/non-gui-supporting-tests.csv
>   3. hw3/23127334_HW03_AI_GUIUsability_TBD/task-1-gui-checklist/migration-log.csv 3 file này là gì

## Prompt 014

- Date: 2026-07-26
- Prompt:

> bạn nộp là bản nào vậy v1 hả tôi mong muốn mỗi lần tôi review thì chỉ sửa 1 file nộp thôi chớ nhiều file csv quá rất khó giám sát

## Prompt 015

- Date: 2026-07-26
- Prompt:

> không hợp nhất mà vẫn giữ lại v1 v0 nhé với v0 là bản đầu tiên không review

## Prompt 016

- Date: 2026-07-26
- Prompt:

> Review and revise the attached Login and Order History GUI checklist using WCAG 2.2, WAI Forms, ARIA APG, GOV.UK, and Nielsen heuristics, with source URLs.
> Keep GUI, accessibility, usability, and visible UI-state tests; move functional, security, API, session, and data-integrity checks into a separate supporting-test table.
> Rewrite each item to have one objective, executable steps, and an observable Pass/Fail expected result; split mixed cases while preserving IDs with A/B suffixes.
> Remove subjective or unsupported requirements, add missing relevant standards, mark RTL/dark mode as Exploratory, and leave Status, Actual Result, Notes, Evidence, and Bug ID blank.
> Output the revised checklist, supporting tests, change log, source references, duplicate report, coverage summary, and final CSV with more than 40 items covering IA-01 to IA-04.

## Prompt 017

- Date: 2026-07-26
- Prompt:

> cập nhật prompt thường xuyên nhé

## Prompt 018

- Date: 2026-07-26
- Prompt:

> Bỏ các cột source và why ai misssed it, human review

## Prompt 019

- Date: 2026-07-26
- Prompt:

> Dựa trên những gì agent thiếu bằng cách compare v0 với v1 hãy viết "Critically review the AI-generated items and add to your checklist any items the AI missed. For
> each item you add, explain why the AI missed it — for example, due to the quality of your input
> prompt, the limitations of the AI model, or the particular characteristics of the interface you
> chose to test. Items the AI tends to overlook include accessibility, right-to-left (RTL) layout, and
> dark mode, but these are only examples; you are free to add any aspects the AI missed." phần này

## Prompt 020

- Date: 2026-07-26
- Prompt:

> - execute testing using playwright to assessment
> - write bug report

## Prompt 021

- Date: 2026-07-26
- Prompt:

> scope-review là gì vậy

## Prompt 022

- Date: 2026-07-26
- Prompt:

> Tạo các commit cho task 1 trươcs đi theo thứ tự sau, v0, v1 + human-review, bug-report

## Prompt 023

- Date: 2026-07-26
- Prompt:

> Tạo git issue trên repo này luôn đi [no label nhé]

## Prompt 024

- Date: 2026-07-26
- Prompt:

> tôi thấy bạn đã tạo git issue rồi và khá ổn, nếu được thì tạo thêm 1 label để là homework3 nhé

## Prompt 025

- Date: 2026-07-26
- Prompt:

> ủa task 3 phải làm gì, thực hiện task 3 đi

## Prompt 026

- Date: 2026-07-26
- Prompt:

> localhost chạy không được

## Prompt 027

- Date: 2026-07-26
- Prompt:

> ý là localhost sẽ không thể được kết nối trên browserstack

## Prompt 028

- Date: 2026-07-26
- Prompt:

> có thể host bằng cloudflare hay ngrok

## Prompt 029

- Date: 2026-07-26
- Prompt:

> Blocked request. This host ("pdt-elder-interpretation-mini.trycloudflare.com") is not allowed.
> To allow this host, add "pdt-elder-interpretation-mini.trycloudflare.com" to `server.allowedHosts` in vite.config.js.

## Prompt 030

- Date: 2026-07-26
- Prompt:

> https://rent-proxy-lifestyle-person.trycloudflare.com đây là url của be hãy gán giúp toi

## Prompt 031

- Date: 2026-07-26
- Prompt:

> check lại task3 toi vừa thêm vào

