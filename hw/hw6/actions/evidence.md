# GitHub Actions Evidence

- Workflow: `HW06 API Tests`
- Job: `Newman API contract tests`
- Branch: `feature/23127334-hw6`
- Commit SHA: `805c5959dd0a19b3a93035c7829dce595ecf8d40`
- Conclusion: `success`
- Run attempt: `1`
- GitHub Actions job/run URL: https://github.com/ThanhDang-Vn/software-testing/actions/runs/32076713839/job/95531370911
- Artifact name: `hw06-api-reports-32076713839-1`
- Artifact link: https://github.com/ThanhDang-Vn/software-testing/actions/runs/32076713839/artifacts/9303692181
- Downloaded artifact: `hw06-api-reports-32076713839-1.zip`
- Artifact SHA-256: `C8663684B4AF893F25492D703A32B61B120AF0C6FF9CAEFC2FF206A3E1A52432`

## Screenshots

- `img/Screenshot 2026-08-18 053707.png`: Actions run list, successful workflow, branch, and short commit SHA.
- `img/Screenshot 2026-08-18 053748.png`: successful summary, duration, job, artifact name/size, and warning annotation.
- `img/Screenshot 2026-08-18 053846.png`: successful job-step list including header enforcement, Newman gate, and artifact upload.

## Artifact inspection

- Contents: 3 CLI reports, 3 JUnit XML reports, 3 HTML reports, and 3 backend logs (12 files total).
- Register: 1 iteration, 10 requests, 26 assertions, 0 failed.
- Coupon: 1 iteration, 10 requests, 26 assertions, 0 failed.
- Product: 1 iteration, 10 requests, 26 assertions, 0 failed.
- Each backend log confirms database initialization/seed, server readiness, and database connection.
- Full-archive scan found no runtime Postman environment, password/token variable names, `Authorization`, `Bearer`, JWT-shaped value, or Newman JSON export.
- The local ZIP SHA-256 matches the digest prefix displayed by GitHub in the supplied artifact screenshot.
