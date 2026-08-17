# HW06 Intentional CI Failure Demonstration

This exercise demonstrates that one failed Newman assertion makes the workflow fail while all unrelated setup, requests, assertions, teardown, and artifact upload continue to run. The demonstration does not change SUT code, database seed data, request data, or expected behavior in any other test.

## Three-commit sequence

| Stage | Commit | Reason |
| --- | --- | --- |
| Passing baseline | [`805c5959dd0a19b3a93035c7829dce595ecf8d40`](https://github.com/ThanhDang-Vn/software-testing/commit/805c5959dd0a19b3a93035c7829dce595ecf8d40) | Real successful `HW06 API Tests` run: all three expected-working suites passed and reports were uploaded. |
| One-failure demonstration | [`8f7786b96b85233c81e788ac028e5f2c5596f2ef`](https://github.com/ThanhDang-Vn/software-testing/commit/8f7786b96b85233c81e788ac028e5f2c5596f2ef) | Places exactly one deliberately false Postman assertion named `CI DEMO FAILURE | intentional single assertion failure` in selected case `CPN-AI-017`. No request, fixture, SUT, or legitimate assertion changes. Local verification: Newman exit `1`, 27 assertions, exactly 1 failed. |
| Restore correct assertion set | `TODO — create only after the real failure run is captured` | Removes only the deliberate assertion, restoring the exact passing collection behavior. |

The later evidence-only commit `eacbea47e04f5977707c8b59050e6a1115a63609` records the already successful passing run screenshots/artifact review; it is not one of the three behavioral states above.

Commit `7b311dcebe54aa683d4a04c3923d4553c61e7d0f` attempted the demonstration but placed the assertion in non-selected case `CPN-AI-002`; its real run correctly stayed green. It is retained in history for audit transparency and is not counted as the one-failure behavioral commit.

## Expected failure signature

- Register suite: pass unchanged.
- Coupon suite: request and legitimate assertions pass; exactly one assertion fails with label `CI DEMO FAILURE`.
- Product suite: pass unchanged because the workflow aggregates suite status and continues collecting evidence.
- Workflow/job conclusion: failure, because Newman returns non-zero and the shell preserves that status.
- Artifact upload: still runs and retains the real CLI/JUnit/HTML reports plus backend reset logs.

## Real failure evidence

- GitHub Actions run URL: `TODO — paste the exact URL copied from the real failed run page`
- Demonstration commit SHA: `8f7786b96b85233c81e788ac028e5f2c5596f2ef`
- Artifact URL: `TODO — paste the exact URL copied after opening the real artifact on GitHub`
- Artifact file: [`hw06-api-reports-32078644821-1.zip`](../../actions/fail/hw06-api-reports-32078644821-1.zip)
- Artifact SHA-256: `4299F0DB299EBB157DB97A46AF5FF1D853219892ED4217CA4CA75A7BE5166126`
- Run conclusion: `failure`
- Observed result: Register `26/0`; Coupon `27/1` with only `CI DEMO FAILURE`; Product `26/0`.

### Real screenshots

![Failed workflow entry for corrected demo commit](../../actions/fail/img/Screenshot%202026-08-18%20060208.png)

![Failed run summary with uploaded artifact](../../actions/fail/img/Screenshot%202026-08-18%20060220.png)

![Exactly one CI DEMO FAILURE assertion](../../actions/fail/img/Screenshot%202026-08-18%20060259.png)

![Failed job steps after successful setup and header guard](../../actions/fail/img/Screenshot%202026-08-18%20060317.png)

The URL placeholders remain intentionally unfilled because no URL text was supplied in `actions/fail/evidence.md` or visible in the screenshots. No URL is inferred or fabricated.

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
