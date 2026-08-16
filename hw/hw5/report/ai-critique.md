# AI Critique (§10)

Trong bài này mình dùng AI để dựng test plan và phân tích log. Chỗ AI sai rõ nhất là lúc đọc kết quả. Nó nhìn thấy 0% error ở cả bốn lần chạy rồi kết luận hệ thống rất khỏe, không có điểm nghẽn. Đối chiếu raw log thì ngược lại: ở bài soak, hơn một nửa số request mất trên một giây, avg lên tới 1.001ms, p95 1.741ms. Server không hề khỏe, nó chỉ xếp hàng request thay vì trả lỗi, nên cái đuối lộ ra ở độ trễ chứ không ở error. AI còn lấy một phút throughput vọt lên 557 req/s làm năng lực tối đa, trong khi đó chỉ là nhiễu do GC; gọi RAM tăng từ 53 lên 107MB là rò rỉ dù dữ liệu dao động lên xuống 48 lần; và đọc con số throughput như thể nó là trần server, dù throughput đó bị giới hạn bởi số người dùng ảo và think-time.

Vì sao AI trượt mấy chỗ này? Nó bám vào giá trị dễ thấy như trung bình và đỉnh, chọn cách đọc lạc quan, và suy theo mẫu chung của một web service thay vì soi kiến trúc thật là Node đơn tiến trình với SQLite khóa ghi toàn file. Nó không tự mở raw log ra kiểm phân phối, nên bỏ qua phần đuôi.

Điều mình rút ra khi làm việc với AI: coi mọi kết luận của nó là bản nháp cần kiểm, và luôn quay lại số gốc. Trung bình che mất đuôi, throughput không phải capacity, và 0% error không có nghĩa là ổn. Mình giữ vai người quyết định, AI chỉ là công cụ dựng nháp và gợi ý.
