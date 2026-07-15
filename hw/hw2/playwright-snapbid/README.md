# Playwright – SnapBid

Bộ kiểm thử tự động (E2E) cho ứng dụng đấu giá **SnapBid**
(<https://snapbid-online-auction.vercel.app/>), dùng cho seminar *Automation for Web*.

## Cấu trúc thư mục

```
playwright-snapbid/
├── package.json            # scripts & dependency
├── playwright.config.ts    # cấu hình (baseURL, trace, 3 trình duyệt…)
├── tests/
│   └── bid.spec.ts         # kịch bản: đăng nhập → đấu giá → đặt giá
├── .gitignore
└── README.md
```

## Cài đặt

Yêu cầu: Node.js 18+.

```bash
cd playwright-snapbid
npm install               # cài @playwright/test
npx playwright install    # tải trình duyệt Chromium/Firefox/WebKit
```

## Chạy test

```bash
npm test                  # chạy tất cả (headless, cả 3 trình duyệt)
npm run test:headed       # chạy có mở giao diện trình duyệt
npm run test:ui           # chế độ UI mode (xem/chạy từng test)
npm run report            # mở báo cáo HTML sau khi chạy
```

Chạy trên một trình duyệt hoặc một test:

```bash
npx playwright test --project=chromium
npx playwright test tests/bid.spec.ts -g "Dat gia"
```

## Tài khoản demo

Test đọc tài khoản từ biến môi trường (có giá trị mặc định để chạy thử):

```bash
# Windows PowerShell
$env:SNAPBID_USER="email@cua-ban"; $env:SNAPBID_PASS="matkhau"; npm test
# macOS/Linux
SNAPBID_USER="email@cua-ban" SNAPBID_PASS="matkhau" npm test
```

## Quan trọng – chỉnh selector cho khớp DOM thật

SnapBid là SPA (React) nên các selector trong `bid.spec.ts` **mang tính minh hoạ**
theo luồng chuẩn. Trước khi chạy thật, hãy sinh lại selector đúng bằng:

```bash
npm run codegen
```

Codegen mở trình duyệt, bạn thao tác tay và Playwright tự sinh code + gợi ý
locator chính xác. Nên ưu tiên `getByRole` / `getByLabel` / `getByText` để test
bền với thay đổi giao diện.

## Gỡ lỗi

- `npx playwright test --debug` – chạy từng bước (Inspector).
- Khi test rớt: xem ảnh/video trong `test-results/`, hoặc mở trace bằng
  `npx playwright show-trace test-results/.../trace.zip`.
