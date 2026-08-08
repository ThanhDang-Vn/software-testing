# Confirmed SUT Defects and Published GitHub Issues

Environment for all entries: local EShop, Playwright 1.55, Node 20, Chromium/Firefox/WebKit.
Published after explicit student approval on 2026-08-08. All issues carry labels `bug` and `hw4`.

- BUG-01: https://github.com/ThanhDang-Vn/software-testing/issues/33
- BUG-02: https://github.com/ThanhDang-Vn/software-testing/issues/34
- BUG-03: https://github.com/ThanhDang-Vn/software-testing/issues/35
- BUG-04: https://github.com/ThanhDang-Vn/software-testing/issues/36
- BUG-05: https://github.com/ThanhDang-Vn/software-testing/issues/37
- BUG-06: https://github.com/ThanhDang-Vn/software-testing/issues/38
- BUG-07: https://github.com/ThanhDang-Vn/software-testing/issues/39
- BUG-08: https://github.com/ThanhDang-Vn/software-testing/issues/40

| Draft | Feature / cases | Expected | Actual | Priority | Evidence |
| --- | --- | --- | --- | --- | --- |
| BUG-01 Login inputs use wrong native types | FR-02 TC-009/010 | email/password types | both text | P1 accessibility/security UX | three FR-02 reports and traces |
| BUG-02 Lock attempt arithmetic | FR-02 TC-012/013 | +1; lock on third | +2; premature lock | P0 core security rule | `server.js:54-61`; reports |
| BUG-03 Lock duration/feedback | FR-02 TC-014/015 | specific feedback; 30 s | generic UI; 180 s | P0 account availability | `server.js:40-57`; reports |
| BUG-04 Shipping order cancellable | FR-11 TC-012 | no cancel at shipping | third cancel action shown/accepted | P0 order integrity | `server.js:321-337`; reports |
| BUG-05 Invalid category names accepted | FR-14 TC-005/006/007 | HTTP 400 | HTTP 200 | P1 data integrity | `server.js:249-253`; reports |
| BUG-06 Unknown delete reports success | FR-14 TC-009 | HTTP 404 | HTTP 200 | P1 API correctness | `server.js:269-275`; reports |
| BUG-07 Category field lacks required contract | FR-14 TC-011 | native/visible required | neither present | P1 validation UX | three reports/traces |
| BUG-08 Customer can create category | FR-14 TC-016 | HTTP 403 | HTTP 200 | P0 authorization | `server.js:249`; reports |

The Firefox TC-008 protocol teardown is excluded because it is classified FLAKY and passed 3/3
repetitions. FR14-TC-012 confirmation is excluded because it is exploratory, not an FR-14 requirement.
