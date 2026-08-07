# Task 3 Screenshot Evidence

Real BrowserStack Live runs against the local EShop SUT exposed via Cloudflare
tunnel (`https://spy-layers-watershed-basics.trycloudflare.com`). Flow:
**Login → Hồ sơ → Lịch sử đơn hàng** (FR-11). Identity account
`23127334@hcmus.edu.vn` / full name **Nguyễn Thành Dâng**.

| File | Platform (BrowserStack) | OS / device | Screen | Identity shown |
| --- | --- | --- | --- | --- |
| `chrome1.png` | Google Chrome 147.0 | macOS desktop | Login | `23127334@hcmus.edu.vn` in Username |
| `chrome2.png` | Google Chrome 147.0 | macOS desktop | Order History | email + name "Nguyễn Thành Dâng" + 5 orders (+ Notepad email) |
| `firefox1.png` | Firefox 144.0 | Windows 11 desktop | Login | `23127334@hcmus.edu.vn` in Username |
| `firefox2.png` | Firefox 145.0 | Windows 11 desktop | Order History | email + name + 5 orders (+ Notepad email) |
| `safari1.png` | Safari | iPhone 17 / iOS 26.4 | Login | `23127334@hcmus.edu.vn` in Username |
| `safari2.png` | Safari | iPhone 16 / iOS 27.0 | Order History (table) | order table (scrolled); SUT URL visible |
| `safari3.png` | Safari | iPhone 16 / iOS 27.0 | Profile + Order History | email + name + orders |

`safari*.png` are genuine Safari-on-iOS runs (not WebKit on Windows), so they count
as valid Safari coverage. Each platform (Chrome / Firefox / Safari) has at least one
Order-History screenshot showing both the student ID (email) and full name.
