# CI Restore Evidence

- Workflow: `HW06 API Tests`
- Job: `Newman API contract tests`
- Branch: `feature/23127334-hw6`
- Restore commit SHA: `5c3074e38c89c99932b80a02cb69df788dce76b3`
- Conclusion: `success` (verified from all Newman reports in the supplied artifact)
- Run ID: `32079401638`
- Run attempt: `1`
- GitHub Actions job/run URL: https://github.com/ThanhDang-Vn/software-testing/actions/runs/32079401638/job/95539251820
- Artifact URL: https://github.com/ThanhDang-Vn/software-testing/actions/runs/32079401638/artifacts/9304578117
- Artifact file: `hw06-api-reports-32079401638-1.zip`
- Artifact SHA-256: `A7A75CF8E864017D04B81C98753FAE81C9DE0E4C2C2F9E2C31B3BA229E5FEA52`

## Verified result

- Register: 1 iteration, 10 requests, 26 assertions, 0 failed.
- Coupon: 1 iteration, 10 requests, 26 assertions, 0 failed.
- Product: 1 iteration, 10 requests, 26 assertions, 0 failed.
- `CI DEMO FAILURE` occurrences across the complete artifact: 0.
- Artifact contents: 3 CLI, 3 JUnit XML, 3 HTML, and 3 backend logs (12 files total).
- Each backend log confirms database initialization/seed, server start, and database connection.
- Sensitive-data scan: no runtime environment, password/token variable, Authorization/Bearer value, JWT-shaped value, or Newman JSON export detected.

## Real images

- `img/restore-runs.png`: workflow list showing the green restore run for commit `5c3074e` after the red demonstration run.
- `img/restore-summary.png`: successful restore summary, commit, duration, artifact, digest prefix, and warning annotation.
- `img/restore-steps.png`: restored job with all execution, header enforcement, Newman gate, and artifact-upload steps completed.

These are user-supplied images from the real GitHub run. They were not generated or reconstructed.
