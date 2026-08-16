# P2.2 - Hướng dẫn chụp Evidence & Hardware Report

> Đây là phần bắt buộc phải chụp tay (anti-cheat §11): TA sẽ soi lại ảnh thật.
> Các run mình đã chạy xong (`results/jtl` + `results/html`) rồi, nhưng ảnh phải bắt được lúc đang chạy,
> nên mình cần chạy lại từng scenario rồi chụp. Xài `evidence/capture-run.sh` để chạy lại một scenario.

Thư mục lưu ảnh:
- `evidence/resource-monitor/` là ảnh JMeter + Task Manager trong cùng một khung hình (mỗi scenario ít nhất 1 ảnh).
- `evidence/hardware/` là dxdiag (txt) + ảnh tab System.

---

## A. Screenshot tài nguyên mỗi run (JMeter + Task Manager CÙNG khung hình)

Yêu cầu §6: ảnh phải thấy cùng lúc công cụ JMeter và mức dùng tài nguyên của tiến trình backend `node.exe`.

### Chuẩn bị màn hình
1. Mở Task Manager, vào tab Details, tìm dòng `node.exe` (backend EShop). Nhớ bật cột CPU và Memory (private working set).
   - Hoặc dùng tab Performance (CPU + Memory tổng) nếu mình muốn thấy cả máy, nhưng Details/node.exe thì sát với yêu cầu "backend process" hơn.
2. Kéo cửa sổ Terminal đang chạy JMeter (chỗ hiện dòng `summary +/=`) sang cạnh Task Manager để cả hai cùng lọt vào một ảnh.

### Chạy lại + thời điểm chụp
Mở một terminal, chạy từng lệnh (mỗi lệnh tự reset + register + chạy một scenario):
```bash
bash evidence/capture-run.sh Load      # chụp bất kỳ lúc nào (tải ổn định)
bash evidence/capture-run.sh Stress    # chụp lúc ~5–6 phút (đỉnh 300 VU)
bash evidence/capture-run.sh Spike     # chụp lúc 60–125s (trong cú bơm 300 VU)
```
- Load: tải phẳng, chụp giữa run là được.
- Stress: VU tăng theo bậc, mình chụp gần cuối (peak 300 VU) để thấy CPU/RAM của node lên cao nhất.
- Spike: canh đúng lúc burst (khoảng giây 60–125) để thấy node.exe nhảy vọt.

### Lưu ảnh (đặt tên rõ)
```
evidence/resource-monitor/load-resource.png
evidence/resource-monitor/stress-resource.png
evidence/resource-monitor/spike-resource.png
```
> Mẹo: chụp bằng Win + Shift + S (Snipping) hoặc Win + PrtSc (ảnh tự vào Pictures/Screenshots).
> Trong ảnh nên thấy được: tên scenario/terminal, dòng `summary =`, và dòng `node.exe` kèm CPU/Mem.

---

## B. Hardware Report bằng dxdiag (hostname phải khớp HW04)

Hostname máy này là `Tony` (COMPUTERNAME=`TONY`), đúng cái máy mình đã dùng ở HW04. dxdiag phải hiện đúng tên này.

### Các bước
1. Nhấn Win + R, gõ `dxdiag`, rồi Enter.
2. Ở tab System, kiểm tra lại Machine name = Tony (hoặc TONY).
3. Bấm Save All Information..., lưu thành:
   ```
   evidence/hardware/dxdiag.txt
   ```
4. Chụp thêm một ảnh tab System (thấy Machine name + OS + CPU + RAM):
   ```
   evidence/hardware/dxdiag-system.png
   ```

> Lưu ý: nếu ở HW04 bạn dùng máy khác thì hostname phải khớp với máy đó, không phải `Tony`. Còn môi trường hiện tại thì đang là `Tony`.

---

## C. Bảng spec phần cứng (đã pre-fill từ máy `Tony`, bạn đối chiếu rồi điền nốt)

| Hạng mục | Giá trị |
|---|---|
| **Machine name (hostname)** | `Tony` |
| OS | Microsoft Windows 11 Home, build 10.0.26200, 64-bit |
| CPU | 12th Gen Intel Core i7-12700H, 14 cores / 20 threads |
| RAM | ~39.7 GB (≈ 40 GB) |
| GPU | Intel Iris Xe Graphics *(ghi thêm GPU rời nếu có, vd NVIDIA)* |
| Storage | *(điền: SSD/HDD, dung lượng, vd 512GB NVMe SSD)* |
| Java | OpenJDK 17.0.12 (2024-07-16 LTS) |
| JMeter | Apache JMeter 5.6.3 |
| Node.js (backend) | v20.20.2 |
| SUT | EShop backend `http://localhost:3000` (Node + SQLite) |
| Ngày đo | 2026-08-11 |

---

## Checklist nộp (Task 1 evidence)
- [ ] `resource-monitor/load-resource.png` (JMeter + node.exe cùng khung)
- [ ] `resource-monitor/stress-resource.png` (chụp ở peak 300 VU)
- [ ] `resource-monitor/spike-resource.png` (chụp trong burst)
- [ ] `hardware/dxdiag.txt` (Machine name = Tony)
- [ ] `hardware/dxdiag-system.png`
- [ ] Bảng spec ở trên đã điền đủ Storage/GPU rời
