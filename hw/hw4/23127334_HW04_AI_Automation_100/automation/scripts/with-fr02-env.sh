#!/usr/bin/env bash
# Sets the FR-02 credential environment (matching the eShop SUT seed data in
# backend/database.js) and then runs whatever command is passed as arguments.
#
# Usage:
#   bash scripts/with-fr02-env.sh npm run test:fr02
#   bash scripts/with-fr02-env.sh npm run test:matrix:fr02
#   bash scripts/with-fr02-env.sh npx playwright test tests/fr02-login-lockout.spec.ts --project=chromium
#
# Prerequisite: the SUT must be running first
#   - backend  : http://127.0.0.1:3000   (node server.js)
#   - frontend : http://127.0.0.1:5173   (vite --host 127.0.0.1 --port 5173 --strictPort)
set -euo pipefail

# --- Seeded accounts (backend/database.js) ---
export FR02_CUSTOMER_EMAIL='test@eshop.com'
export FR02_CUSTOMER_PASSWORD='Test1234!'
export FR02_CUSTOMER_NAME='Test User'
export FR02_ADMIN_EMAIL='admin@eshop.com'
export FR02_ADMIN_PASSWORD='Admin123!'
export FR02_ADMIN_NAME='Admin User'

# --- Synthetic accounts created on the fly via /api/register ---
# The valid password intentionally contains an uppercase letter so the
# case-changed (lower-cased) variant is guaranteed to be wrong (TC-005).
export FR02_SYNTHETIC_USER_NAME='FR02 Synthetic'
export FR02_SYNTHETIC_VALID_PASSWORD='Synthetic123!'
export FR02_SYNTHETIC_WRONG_PASSWORD='Wrong9999!'

if [ "$#" -eq 0 ]; then
  echo "No command given. Example: bash scripts/with-fr02-env.sh npm run test:fr02" >&2
  exit 2
fi

exec "$@"
