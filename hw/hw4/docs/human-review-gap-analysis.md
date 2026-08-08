# Human Review and Gap Analysis

## FR-02

The origin tests covered login, validation, threshold, lock behavior and expiry, but used positional
inputs, a CSS error class, inline credential assumptions and a fixed Playwright sleep. Human review
moved case data to JSON/environment profiles, added input validation, replaced positional/error
locators, and made the required business window explicit. Before and after the selector change the
valid matrix result is consistently 9 passed/6 failed per browser. Risk: the SUT has inaccessible
labels and the lock-expiry case necessarily costs at least 30 seconds.

## FR-11

The origin design used row indexes and originally accepted cancellation during shipping. Human
review corrected the oracle, replaced indexes with exact order IDs, added cross-user ownership,
validated fixtures, and awaited route fulfillment. Result is 12 passed/1 failed on every browser;
the remaining failure is the confirmed shipping-cancel defect. UI rendering cases use deterministic
mock data; authorization/ownership uses the real backend. No pagination/filter/detail behavior was
added because it was not established by the reviewed FR-11 requirement.

## FR-14

The origin design treated a confirmation dialog as required and lacked successful UI create/delete
and customer-role mutation coverage. Human review downgraded confirmation to exploratory evidence,
added create/view/delete and customer-token cases, added unique data/cleanup, and removed arbitrary
wait/evaluate clicks. A first role locator normalized corrupt UI text and caused five timeouts; trace
review corrected it to role plus stable ASCII prefix. Final Chromium/WebKit are 10 passed/6 failed.
Firefox adds one non-reproduced teardown failure. Update remains a human-review ambiguity because
the explicit requirement evidence reviewed so far lists create/view/delete despite the CRUD title.

## Unautomated or human-only work

- Exploratory confirmation usability is recorded but is not a FR-14 pass/fail requirement.
- Visual quality beyond semantic/text/class contracts needs human review.
- Publishing GitHub Issues, recording the demo, confirming rubric interpretation, accepting AI
  changes and submitting to Moodle must be performed by the student.

