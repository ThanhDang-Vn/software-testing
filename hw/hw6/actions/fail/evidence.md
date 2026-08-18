# CI Demo Failure Evidence

- Workflow: `HW06 API Tests`
- Job: `Newman API contract tests`
- Branch: `feature/23127334-hw6`
- Commit SHA: `8f7786b96b85233c81e788ac028e5f2c5596f2ef`
- Conclusion: `failure`
- Run ID shown by retained artifact name: `32078644821`
- Run attempt: `1`
- GitHub Actions run URL: https://github.com/ThanhDang-Vn/software-testing/actions/runs/32078644821
- Artifact URL: https://github.com/ThanhDang-Vn/software-testing/actions/runs/32078644821/artifacts/9304316399
- Artifact file: `hw06-api-reports-32078644821-1.zip`
- Artifact SHA-256: `4299F0DB299EBB157DB97A46AF5FF1D853219892ED4217CA4CA75A7BE5166126`

## Verified result

- Register: 1 iteration, 10 requests, 26 assertions, 0 failed.
- Coupon: 1 iteration, 10 requests, 27 assertions, exactly 1 failed.
- Failed assertion: `CI DEMO FAILURE | intentional single assertion failure` inside `CPN-AI-017`.
- Product: 1 iteration, 10 requests, 26 assertions, 0 failed.
- Artifact: 3 CLI, 3 JUnit XML, 3 HTML, and 3 backend logs.
- Sensitive-data scan: no runtime environment, password/token variable, Authorization/Bearer value, JWT-shaped value, or Newman JSON export detected.
- Image digest prefix and downloaded ZIP SHA-256 agree.

## Real images

- `img/failure-runs.png`: failed workflow entry for commit `8f7786b` and passing earlier runs.
- `img/failure-summary.png`: failed summary, commit, artifact name/size/digest prefix, and exit code 1.
- `img/failure-assertion.png`: exact 27/1 assertion summary and `CI DEMO FAILURE` detail in `CPN-AI-017`.
- `img/failure-steps.png`: failed job step list showing prior setup/header steps succeeded.

These are user-supplied images and the downloaded real artifact. They were not generated or reconstructed.
