# HW06 Postman Artifacts

## Files

- `23127334_HW06_API_Testing.postman_collection.json`: generated collection with 148 primary requests linked to unique `TC_ID` values.
- `23127334_HW06_Local.example.postman_environment.json`: safe public template; password and token values are blank.
- `23127334_HW06_Local.postman_environment.json`: runnable local environment; intentionally ignored by Git.
- `data/register-data.json`, `data/coupon-data.json`, `data/product-data.json`: iteration data for mapped partitions.
- `../agent-generator/generate_postman.py`: generator using the final audited workbook as its source.

## Import and local setup

1. Import the collection JSON into Postman.
2. Import the local environment JSON on your own machine. Do not publish it.
3. Select environment `23127334_HW06_Local`.
4. Confirm `baseUrl=http://localhost:3000` and `studentId=23127334`.
5. Keep `userToken` and `adminToken` empty before the run. `00 Setup` obtains them from login responses.
6. If recreating the local file from the sanitized example, enter passwords only as local/current secret values.

The collection does not contain a JWT or account password. Authentication headers reference `{{userToken}}`, `{{adminToken}}` or `{{expiredToken}}`.

## Execution order

Run folders in collection order:

1. `00 Setup`
2. `API1 Register`
3. `API2 Coupon`
4. `API3 Product`
5. `99 Verification-Teardown`

Each primary request name starts with its workbook `TC_ID`. Supporting requests use `SETUP-*`, `VERIFY-*` or `CLEAN-*` and are not primary test cases.

## Data-driven runs

Run from `hw/hw6` or adjust paths accordingly:

```text
newman run postman/23127334_HW06_API_Testing.postman_collection.json -e postman/23127334_HW06_Local.postman_environment.json -d postman/data/register-data.json --folder "API1 Register"
newman run postman/23127334_HW06_API_Testing.postman_collection.json -e postman/23127334_HW06_Local.postman_environment.json -d postman/data/coupon-data.json --folder "API2 Coupon"
newman run postman/23127334_HW06_API_Testing.postman_collection.json -e postman/23127334_HW06_Local.postman_environment.json -d postman/data/product-data.json --folder "API3 Product"
```

Mapped requests consume iteration fields only when `data_id` matches their declared mapping. Other partitions use request-specific bodies generated from the audited test data. For isolated evidence, select the applicable request/subfolder and matching fixture row rather than interpreting setup requests as test results.

Stateful coupon usage, concurrency and multi-action lifecycle cases require their documented preconditions and must run serially against a clean/isolated SQLite state. A fixture row does not create those states automatically.

## Assertions implemented

Every primary request includes tests for:

- specification-based expected status;
- JSON `Content-Type` and parseability;
- exact success or error key set;
- response field types and sensitive-field absence;
- registration/product success message or coupon calculation;
- supporting side-effect verification through users, coupons or products endpoints where observable.

Successful created IDs are captured for cleanup. Negative Product/Register tests perform marker-based absence checks when the supporting endpoint and admin token are available.

## Regeneration and validation

From repository root:

```text
python -X utf8 hw/hw6/agent-generator/generate_postman.py
```

Optional secret inputs for creating a new local environment without putting secrets in the generator:

```text
HW06_USER_PASSWORD
HW06_ADMIN_PASSWORD
```

The generator preserves existing ignored local password values when these environment variables are absent. The public example always emits blank credentials and tokens.

Validation completed after generation:

- all three JSON files parse successfully;
- 148 primary requests and 148 unique `TC_ID` prefixes;
- Register 49, Coupon 50 and Product 49;
- all primary requests have test scripts;
- all 305 Postman JavaScript scripts pass syntax compilation;
- no JWT-shaped literal exists in the collection;
- sanitized example credentials/tokens are blank;
- local environment is matched by `.gitignore`.

