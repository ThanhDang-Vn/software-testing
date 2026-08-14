# EXAMPLE — chạy skill trọn một nhóm endpoint (EShop buyer)

Đây là ví dụ chạy skill `perf-test-jmeter` từ đầu tới cuối trên nhóm endpoint mua hàng của EShop: login, search, product detail, add-to-cart, checkout. Nhóm này phủ cả ba loại auth-heavy, read-heavy, transactional.

Chạy ở thư mục `hw5/`. Backend EShop ở `../eshop-sut/backend`, base URL `http://localhost:3000`.

## Bước 1 — smoke contract
```bash
curl -s -X POST http://localhost:3000/api/login -H "Content-Type: application/json" \
  -d '{"email":"test@eshop.com","password":"Test1234!"}'
```
Xem body có field `token` không, status có 200 không. Làm tương tự cho search/detail/cart/checkout để chốt path và field. (Chi tiết đã ghi ở `docs/p0-smoke-test.md`.)

## Bước 2 — dữ liệu
`data/users.csv` (300 account) và `data/products.csv` đã có sẵn. Vì backend reseed DB mỗi lần khởi động nên nạp lại account trước khi chạy:
```bash
node data/register-users.js
```

## Bước 3 — sinh 3 test plan
Workflow của nhóm này nằm ở `testplans/_workflow-fragment.xml`. Sinh plan:
```bash
node testplans/generate-plans.js
# ra: 23127334_Load_20260811.jmx, 23127334_Stress_20260811.jmx, 23127334_Spike_20260811.jmx
```
Muốn dùng lại skill cho nhóm endpoint khác thì viết workflow mới vào `skill/templates/workflow-fragment.template.xml`, sửa CONFIG trong `skill/scripts/gen-from-fragment.js` rồi chạy `node skill/scripts/gen-from-fragment.js`.

## Bước 4 — chạy có reset giữa các lần
Chạy cả ba bằng script sẵn có:
```bash
bash results/run-all.sh
```
Hoặc chạy từng scenario bằng script generic của skill:
```bash
PLAN=testplans/23127334_Load_20260811.jmx OUT=results/jtl \
  BACKEND_DIR=../eshop-sut/backend REGISTER_CMD="node data/register-users.js" \
  bash skill/scripts/run-scenario.sh Load
```

## Bước 5 — phân tích log
```bash
node skill/scripts/analyze-jtl.js results/jtl/Load.jtl results/jtl/Stress.jtl results/jtl/Spike.jtl
```
In bảng p95/throughput/error theo từng bước và dòng ALL. Với endurance thì lấy thêm mẫu RAM node theo thời gian để ra memory ceiling (xem `results/endurance/`).

## Bước 6 — review lại
Đối chiếu bảng vừa in với raw `.jtl` theo checklist ở `SKILL.md` bước 6. Kết quả review của nhóm buyer này nằm ở `docs/misinterpretation-hunt.md` (đã bắt được 6 chỗ AI đọc sai). Phân tích thô của AI để riêng ở `docs/p3-ai-analysis.md`.

## Kết quả một vòng chạy
- 3 file `.jmx` đúng tên quy ước.
- `results/jtl/{Load,Stress,Spike}.jtl` + `results/html/{Load,Stress,Spike}/`.
- Bảng số liệu + kết luận ngưỡng ở `results/run-summary.md` và `results/endurance/endurance-summary.md`.

## Video demo cần quay
Xem mục "Demo video mình cần tự quay" trong `SKILL.md`. Tóm tắt: quay màn hình đi qua bước 1 tới bước 6 ở trên, có JMeter và Task Manager trong cùng khung khi chạy, tự thuyết minh tiếng Việt, rồi dán link YouTube unlisted vào `README.md` của bài nộp.
