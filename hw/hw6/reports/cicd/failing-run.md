# HW06 Intentional CI Failure Demonstration

This exercise demonstrates that one failed Newman assertion makes the workflow fail while all unrelated setup, requests, assertions, teardown, and artifact upload continue to run. The demonstration does not change SUT code, database seed data, request data, or expected behavior in any other test.

## Three-commit sequence

| Stage | Commit | Reason |
| --- | --- | --- |
| Passing baseline | [`805c5959dd0a19b3a93035c7829dce595ecf8d40`](https://github.com/ThanhDang-Vn/software-testing/commit/805c5959dd0a19b3a93035c7829dce595ecf8d40) | Real successful `HW06 API Tests` run: all three expected-working suites passed and reports were uploaded. |
| One-failure demonstration | `TODO — fill with the CI DEMO FAILURE commit SHA after this commit is created` | Adds exactly one deliberately false Postman assertion named `CI DEMO FAILURE | intentional single assertion failure` to selected case `CPN-AI-017`. No request, fixture, SUT, or other assertion changes. |
| Restore correct assertion set | `TODO — create only after the real failure run is captured` | Removes only the deliberate assertion, restoring the exact passing collection behavior. |

The later evidence-only commit `eacbea47e04f5977707c8b59050e6a1115a63609` records the already successful passing run screenshots/artifact review; it is not one of the three behavioral states above.

## Expected failure signature

- Register suite: pass unchanged.
- Coupon suite: request and legitimate assertions pass; exactly one assertion fails with label `CI DEMO FAILURE`.
- Product suite: pass unchanged because the workflow aggregates suite status and continues collecting evidence.
- Workflow/job conclusion: failure, because Newman returns non-zero and the shell preserves that status.
- Artifact upload: still runs and retains the real CLI/JUnit/HTML reports plus backend reset logs.

## Real failure evidence — not yet supplied

- GitHub Actions run URL: `TODO — paste only after the demonstration commit is pushed and a real run completes`
- Demonstration commit SHA: `TODO — copy the exact pushed SHA`
- Artifact URL: `TODO — paste the real failure-run artifact URL`
- Screenshot: `TODO — attach a real GitHub Actions summary/log screenshot showing the red job and CI DEMO FAILURE assertion`
- Run conclusion: `TODO — record the actual GitHub conclusion; expected failure is not evidence by itself`

No run URL, artifact URL, or screenshot is generated or inferred in this file.

## Restore procedure

After the real failure evidence is saved:

1. Remove only these three Postman script lines from `CPN-AI-017`:

   ```javascript
   pm.test('CI DEMO FAILURE | intentional single assertion failure', function () {
     pm.expect('expected-working').to.eql('intentional-demo-failure');
   });
   ```

2. Parse the collection JSON and run the expected-working gate locally.
3. Commit the removal as the restore commit.
4. Push and confirm the restored GitHub Actions run is green.
5. Record the real one-failure SHA, restore SHA, run URLs, artifact link, and real screenshot here. Because a commit cannot contain its own final SHA, the restore SHA is filled into this working report after the restore commit is created.
