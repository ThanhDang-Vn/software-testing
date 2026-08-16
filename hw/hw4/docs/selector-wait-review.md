# Selector and Wait Review

## Traceability summary

| Feature | Before | Human-reviewed change | Remaining limitation |
| --- | --- | --- | --- |
| FR-02 | form input `nth(0/1)`, CSS error class, `waitForTimeout(31000)` | fields anchored to stable label text and native input; error uses stable text; business window uses `expect.poll` | SUT labels lack `for/id`, so `getByLabel` is unavailable |
| FR-11 | table `first()/nth()`, `tbody` CSS, row indexes | rows anchored by exact order-ID cells; status locators use exact text; route fulfillment awaited | UI fixture is mocked by design; API ownership case covers real isolation |
| FR-14 | partial-text rows, raw evaluate click, 300 ms sleep | rows anchored by exact category-name cells; native click; state polling; category tab uses role + stable ASCII prefix | SUT renders mojibake Vietnamese text |

No XPath remains. No `nth()`, `waitForTimeout`, click-through-`evaluate`, or arbitrary fixed UI
delay remains in the three feature specs/support object. FR-02 retains a 31-second data value only
as the requirement's business lock duration; it is not used as a Playwright fixed sleep.

The first FR-14 role locator used normalized Vietnamese and caused a TEST_DEFECT because the SUT
actually renders mojibake. Trace evidence led to a role-based listitem locator filtered by the
stable ASCII prefix `^Danh`, avoiding dependence on corrupt suffix bytes without changing SUT.

Tests are serial (`workers=1`) and use synthetic run IDs. FR-14 cleanup runs in `finally` for UI
mutation cases. FR-11 rows no longer depend on presentation order for action assertions.

