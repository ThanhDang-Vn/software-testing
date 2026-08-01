# Severity-ranked Findings

## Evidence base

Toàn bộ P01–P07 là người tham gia thật, được tuyển ngoài lớp, có ghi màn hình
(link trong `recording-links.md`). Không có phiên mô phỏng trong tập dữ liệu cuối.

## Summary (n = 7)

- Completion: 7/7 (100%)
- Unassisted completion: 5/7 (71.4%) — P01, P03, P04, P05, P07
- Assisted completion: 2/7 (28.6%) — P02, P06
- Mean completion time: 287.3 seconds (4:47)
- Mean SUS: 66.4/100 (dưới ngưỡng chấp nhận ~68 → "cận biên / cần cải thiện")
- Total observed errors / wrong turns / hesitations / interventions: 1 / 4 / 19 / 2

| Rank | Finding ID | Type | Evidence / participants | Frequency | Severity | Recommendation |
| ---: | --- | --- | --- | ---: | --- | --- |
| 1 | USAB-01 | Repeated usability problem | Không ai phát hiện ngay nơi chứa lịch sử đơn hàng; lời chào/tên tài khoản không được nhận ra là liên kết. P01, P02, P03, P04, P05, P06, P07 đều nêu; P02 và P06 cần một prompt trung lập. Xem các mã `WRONG_TURN`/`STUCK`/`DISCOVERY`. | 7/7 | Critical | Thêm mục điều hướng rõ ràng "Đơn hàng của tôi"/"Lịch sử đơn hàng" và nút vào trang lịch sử; phơi bày menu tài khoản và đánh dấu trang hiện tại. |
| 2 | USAB-07 | Repeated content/expectation problem | Lịch sử đơn hàng không cho biết đã mua sản phẩm nào và thiếu hành động. P02, P03, P04, P06, P07 đều muốn xem chi tiết sản phẩm trong đơn; P07 muốn có bước xác nhận trước khi hủy đơn; P06 muốn có nút quay lại trang mua sắm. | 5/7 | Major | Cho mở chi tiết mỗi đơn (danh sách sản phẩm, số lượng, trạng thái); thêm xác nhận trước khi hủy; thêm lối quay lại trang mua sắm. |
| 3 | USAB-04 | Repeated feedback/consistency & security problem | Ô mật khẩu không che ký tự khi đăng nhập (P04, P06, P07) — rủi ro riêng tư; chữ tiếng Anh ("Sign In") lẫn tiếng Việt (P04, P05). | 4/7 | Major | Che ký tự mật khẩu mặc định (có thể có nút hiện/ẩn); dịch nhất quán toàn bộ chữ ở màn đăng nhập sang tiếng Việt. |
| 4 | USAB-03 | Repeated usability problem | Định dạng ngày `7/31/2026` gây diễn giải chậm ("tháng hay ngày"): P01, P04, P07. P05 và P07 còn muốn có giờ:phút cụ thể. | 4/7 | Major | Dùng định dạng Việt xác định (`31/07/2026`, `450.000 ₫`) kèm giờ:phút; nêu rõ thứ tự sắp xếp ("Mới nhất trước"). |
| 5 | USAB-06 | Repeated trust/interpretation problem | Bảng sắp xếp giảm dần theo mã nhưng không ghi rõ; P02, P03, P05 phải tự suy luận hàng đầu là mới nhất. | 3/7 | Major | Ghi nhãn thứ tự đang áp dụng và cung cấp tiêu đề "Ngày đặt" sắp xếp được, mặc định mới nhất trước. |
| 6 | USAB-05 | Isolated accessibility/usability problem | P04 gặp thứ tự focus bàn phím bất thường ở form đăng nhập (Tab nhảy tới nút gửi trước trường mong đợi). | 1/7 | Minor | Bỏ giá trị `tabindex` dương; giữ thứ tự DOM/focus khớp thứ tự đọc trực quan. |
| 7 | USAB-08 | Isolated cosmetic/affordance problem | P06: tổng tiền màu đỏ gây cảm giác cảnh báo/nguy hiểm và chữ "thoát" quá nổi bật; P07: hiển thị mã đơn thấy không cần thiết. | 2/7 | Minor | Dùng màu trung tính cho số tiền; giảm độ nổi bật của hành động thoát; cân nhắc ẩn/bớt nhấn mã đơn nếu người dùng không cần. |

## Severity rationale

- **Critical:** cản trở đáng kể việc hoàn tất tác vụ độc lập cho nhiều người dùng.
- **Major:** gây chậm, tăng rủi ro lỗi/riêng tư, hoặc mất ngữ cảnh nhưng có cách vòng tránh.
- **Minor:** ma sát dễ nhận thấy nhưng ít ảnh hưởng đến việc hoàn tất thành công.

## Limitations

- Mẫu nhỏ (n = 7) theo thiết kế "discount usability": đủ để lộ các vấn đề lặp lại
  nhưng không nhằm suy rộng định lượng.
- Tất cả phiên chạy trên laptop/desktop; **chưa có phiên mobile thật** → chưa đánh
  giá được khả năng đáp ứng trên điện thoại.
- Người tham gia đều là sinh viên ĐH Khoa học Tự nhiên; cần bảo đảm **không ai đang
  học lớp HW03** (điều kiện bắt buộc); non-IT / non-tester chỉ là ưu tiên.
