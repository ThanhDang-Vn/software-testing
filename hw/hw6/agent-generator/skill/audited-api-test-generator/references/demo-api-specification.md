# Apply coupon API

- Requirement: FR-CPN-01
- Method: POST
- Path: `/api/coupons/apply`
- Header: `X-Student-Id` is required and must equal `23127334`.
- Authentication: bearer token is required.
- Request JSON: `{ "code": string, "amount": number }`.
- Constraint: `amount` must be greater than or equal to `100`.
- Rule: code `SAVE10` applies a 10 percent discount.
- Success: HTTP 200 with `{ "discount": number, "finalAmount": number }`.
- Calculation: `discount = amount * 10 / 100`; `finalAmount = amount - discount`.
- Missing authentication: HTTP 401.
- Invalid amount: HTTP 400.
