# Task 3 — Cross-Browser / Cross-Platform Test Summary

## Scope and method

- SUT: EShop web frontend (`eshop-sut/frontend-web`), served from the student's
  machine at `http://localhost:5173`, with the backend API at
  `http://localhost:3000`.
- Cloud platform: **BrowserStack Live** (trial). Each run's OS / browser / version
  is visible in the BrowserStack dashboard URL and left toolbar of every screenshot.
- Localhost exposure: because BrowserStack's remote devices cannot reach the
  student's `localhost`, **both** local servers were published through Cloudflare
  quick tunnels:
  - Frontend (opened on BrowserStack): `https://spy-layers-watershed-basics.trycloudflare.com`
  - Backend API (consumed by the frontend via `VITE_API_BASE_URL`): a second
    Cloudflare tunnel to `localhost:3000`.
- Flow exercised: the same end-to-end flow selected in Task 2 —
  **Login → Hồ sơ (Profile) → Lịch sử đơn hàng (Order History, FR-11)**.
- Identity account (seeded for this task): `23127334@hcmus.edu.vn`, full name
  **Nguyễn Thành Dâng**, with five orders covering every status.
- Date: 2026-08-01.

## Identity overlay

Every screenshot is attributable to the student in the required form
`23127334@hcmus.edu.vn`:

- **Login screens** — the student email is typed into the visible **Username** field.
- **Order-History screens** — the Profile panel shows the email in the
  "Email (Không đổi)" field and the full name in "Họ Tên", and the header greets
  "Chào, Nguyễn Thành Dâng". Desktop captures additionally overlay the email in a
  Notepad window.

## Platforms covered (≥ 3, including genuine Safari)

| Platform ID | Browser / version | OS / device | Screens | Screenshots | Result |
| --- | --- | --- | --- | --- | --- |
| CP-01 | Google Chrome 147.0 | macOS (desktop, 1528×794) | Login; Order History | `screenshots/chrome1.png`; `screenshots/chrome2.png` | Rendered correctly |
| CP-02 | Mozilla Firefox 144–145 | Windows 11 (desktop) | Login; Order History | `screenshots/firefox1.png`; `screenshots/firefox2.png` | Rendered correctly |
| CP-03 | **Safari (iOS)** | iPhone 17 / iOS 26.4 (login); iPhone 16 / iOS 27.0 (order history) | Login; Order History | `screenshots/safari1.png`; `screenshots/safari3.png` (+ `safari2.png` order table) | Rendered correctly (mobile reflow) |

CP-03 is a **real Safari run on real iOS device profiles** in BrowserStack, so the
requirement "Chrome, Firefox, and Safari (or Android Chrome)" is met by genuine
Safari coverage — no WebKit-on-Windows substitution.

## Cross-platform comparison

- The selected flow rendered **consistently across all three platforms**. The
  Order-History screen showed the same two-column Profile / Lịch sử đơn hàng layout,
  the five headers (Mã ĐH, Ngày đặt, Tổng tiền, Trạng thái, Thao tác), the five
  seeded order rows (#10–#6), the status badges (Chờ xác nhận, Đã xác nhận, Đang
  giao, Đã giao, Đã hủy), and the red "Hủy đơn" button on non-delivered / non-
  canceled rows.
- On the iPhone / Safari runs the layout reflowed to the narrow viewport (the
  Profile form stacks above the order table) and the on-screen keyboard raised over
  the lower part of the card during login, as expected for mobile Safari; the flow
  remained usable.
- **No platform-specific** layout break, overflow, missing control, or broken text
  was observed.

## Consistency findings (already logged in Task 1, confirmed cross-platform)

- US-style date formatting (`7/31/2026`) and comma-grouped currency
  (`62,000,000 đ`) appear **identically on every platform** — confirming these are
  application-level locale defects (already reported in Task 1), not cross-platform-
  specific breakage.
- The `/login` route renders the heading **"Đăng Ký"** (Register) on all three
  platforms even though it is the sign-in form — a consistent label defect, not a
  platform-specific one.

## Cross-platform test cases (CP-T01–CP-T15)

Fifteen atomic checks over the Login and Order-History screens across the three
platforms. Because the flow renders almost identically on every browser, several
checks are verified from the **same** screenshot — the screenshot is shared
evidence, not duplicated per case. Result: **14 Passed / 1 Failed**.

| ID | Screen / check | Platform | Expected | Evidence | Result |
| --- | --- | --- | --- | --- | --- |
| CP-T01 | Blue EShop header + centered auth card render | Chrome / macOS | Header and card visible, centered | `chrome1.png` | Pass |
| CP-T02 | Auth card (title, Username, Mật khẩu, Sign In) renders | Firefox / Win 11 | All controls present | `firefox1.png` | Pass |
| CP-T03 | Login layout reflows to narrow viewport | Safari / iOS | Card fits mobile width | `safari1.png` | Pass |
| CP-T04 | Username field accepts and displays the identity email | Chrome / macOS | `23127334@hcmus.edu.vn` shown | `chrome1.png` | Pass |
| CP-T05 | "Đăng ký ngay" link + Sign In button present | Firefox / Win 11 | Both visible | `firefox1.png` | Pass |
| CP-T06 | Login heading label consistent across platforms | Chrome/Firefox/Safari | Same label on all | `chrome1.png`, `firefox1.png`, `safari1.png` | Pass* |
| CP-T07 | Profile two-column layout (form + Lịch sử đơn hàng) | Chrome / macOS | Two columns render | `chrome2.png` | Pass |
| CP-T08 | Profile reflows to stacked layout on mobile | Safari / iOS | Form stacks above table | `safari3.png` | Pass |
| CP-T09 | Order table shows 5 headers (Mã ĐH/Ngày đặt/Tổng tiền/Trạng thái/Thao tác) | Chrome / macOS | All 5 headers | `chrome2.png` | Pass |
| CP-T10 | Order table renders 5 rows with correct data | Firefox / Win 11 | Rows #10–#6 correct | `firefox2.png` | Pass |
| CP-T11 | Status badges render for all 5 states with color | Chrome / macOS | 5 badges styled | `chrome2.png` | Pass |
| CP-T12 | "Hủy đơn" button on non-delivered / non-canceled rows | Firefox / Win 11 | Button present where valid | `firefox2.png` | Pass |
| CP-T13 | Identity email shown in "Email (Không đổi)" | Safari / iOS | Email visible in profile | `safari3.png` | Pass |
| CP-T14 | Header greeting shows full name | Chrome / macOS | "Chào, Nguyễn Thành Dâng" | `chrome2.png` | Pass |
| CP-T15 | Order table horizontal overflow on narrow mobile | Safari / iOS | Should stay within viewport | `safari2.png` | **Fail** |

\* CP-T06 passes as a *consistency* check (the label is identical on all platforms)
but the label itself ("Đăng Ký" on the sign-in page) is the Task-1 defect.
CP-T15 fails: on the narrow mobile viewport the order table forces horizontal
page scrolling — the responsive defect already noted, confirmed as consistent
mobile behaviour rather than a one-platform break.

