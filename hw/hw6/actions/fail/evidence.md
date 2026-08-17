# CI Demo Failure Evidence

- Workflow: `HW06 API Tests`
- Job: `Newman API contract tests`
- Branch: `feature/23127334-hw6`
- Commit SHA: `8f7786b96b85233c81e788ac028e5f2c5596f2ef`
- Conclusion: `failure`
- Run ID shown by retained artifact name: `32078644821`
- Run attempt: `1`
- GitHub Actions run URL: `TODO — paste the exact URL copied from the real failed run page`
- Artifact URL: `TODO — paste the exact URL copied after opening the real artifact on GitHub`
- Artifact file: `hw06-api-reports-32078644821-1.zip`
- Artifact SHA-256: `4299F0DB299EBB157DB97A46AF5FF1D853219892ED4217CA4CA75A7BE5166126`

## Verified result

- Register: 1 iteration, 10 requests, 26 assertions, 0 failed.
- Coupon: 1 iteration, 10 requests, 27 assertions, exactly 1 failed.
- Failed assertion: `CI DEMO FAILURE | intentional single assertion failure` inside `CPN-AI-017`.
- Product: 1 iteration, 10 requests, 26 assertions, 0 failed.
- Artifact: 3 CLI, 3 JUnit XML, 3 HTML, and 3 backend logs.
- Sensitive-data scan: no runtime environment, password/token variable, Authorization/Bearer value, JWT-shaped value, or Newman JSON export detected.
- Screenshot digest prefix and downloaded ZIP SHA-256 agree.

## Real screenshots

- `img/Screenshot 2026-08-18 060208.png`: failed workflow entry for commit `8f7786b` and passing earlier runs.
- `img/Screenshot 2026-08-18 060220.png`: failed summary, commit, artifact name/size/digest prefix, and exit code 1.
- `img/Screenshot 2026-08-18 060259.png`: exact 27/1 assertion summary and `CI DEMO FAILURE` detail in `CPN-AI-017`.
- `img/Screenshot 2026-08-18 060317.png`: failed job step list showing prior setup/header steps succeeded.

These are user-supplied screenshots and the downloaded real artifact. They were not generated or reconstructed.
