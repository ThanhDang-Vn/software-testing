# Critical Review of the AI-Generated GUI Checklist

## Phương pháp đối chiếu

Bản `gui-checklist-v0-agent.xlsx` gồm 32 mục do AI tạo trước khi có human
review. Bản `gui-checklist-v1-reviewed.xlsx` gồm 45 mục sau review dựa trên
WCAG 2.2, WAI Forms, ARIA APG, GOV.UK Design System và Nielsen heuristics.

Việc đối chiếu được thực hiện theo ID và mục tiêu kiểm thử. Các mục chỉ kiểm tra
authentication, authorization, API, session, security hoặc data integrity được
chuyển sang sheet `Non-GUI Supporting Tests`, không được dùng để tăng số lượng
GUI checklist. Các mục mixed được tách hậu tố `A/B`: phần `A` giữ assertion
hiển thị trong GUI checklist; phần `B` nằm ngoài GUI checklist.

## Nhận xét phê bình chung

V0 bao phủ được cấu trúc hiển thị cơ bản, responsive, contrast, form controls,
keyboard navigation và một số trạng thái của Login và Order History. Tuy nhiên,
AI ban đầu thiên về kiểm tra giao diện bằng mắt và happy path. Prompt ban đầu
chưa nêu rõ mức WCAG, công nghệ hỗ trợ, kích thước viewport, text-spacing,
orientation hoặc quy tắc focus của modal. Vì vậy AI bỏ sót nhiều assertion chỉ
phát hiện được bằng screen reader, accessibility tree hoặc các thiết lập hiển
thị đặc biệt.

AI cũng trộn một số assertion GUI với kiểm tra network, authentication và dữ
liệu backend. Ví dụ, một case vừa yêu cầu hiển thị validation vừa yêu cầu không
gửi API request; một case khác vừa kiểm tra dữ liệu nhìn thấy vừa so sánh với
API. Các case như vậy không có một oracle duy nhất và không phù hợp với phạm vi
GUI. Human review đã tách chúng để mỗi case chỉ có một mục tiêu quan sát được.

## Các mục được thêm hoặc sửa sau khi review

| ID trong V1 | Khía cạnh AI bỏ sót hoặc trộn lẫn | Vì sao AI bỏ sót | Bổ sung/chỉnh sửa của người review |
| --- | --- | --- | --- |
| GUI-L-011A | Validation hiển thị khi bỏ trống trường | AI gộp UI validation với assertion “không gửi API request”, làm case chứa hai phạm vi. | Giữ riêng phần thông báo validation nhìn thấy; phần network chuyển thành GUI-L-011B trong supporting tests. |
| GUI-L-020 | Autocomplete và password-manager semantics | Prompt ban đầu chỉ nhắc input type, không yêu cầu kiểm tra input purpose hoặc công cụ hỗ trợ nhập liệu. | Thêm kiểm tra email/current-password được nhận diện và điền vào đúng trường. |
| GUI-L-021 | Reflow ở mức zoom 200% | AI chỉ kiểm tra viewport mobile, dễ xem responsive breakpoint là đủ và bỏ qua browser zoom. | Thêm kiểm tra form không mất nội dung hoặc chức năng ở 200% zoom. |
| GUI-L-023 | RTL | Giao diện tiếng Việt dùng LTR nên mô hình không tự xem RTL là rủi ro chính. | Thêm kiểm tra RTL và đánh dấu `Exploratory` vì SUT không có yêu cầu RTL rõ ràng. |
| GUI-L-024A | Pending state khi submit lặp | AI gộp phản hồi nút với số request được xử lý, vốn là performance/integration assertion. | Giữ phần trạng thái pending/khóa thao tác nhìn thấy; chuyển request-count thành GUI-L-024B. |
| GUI-O-002A | Sự hiện diện của bốn trường FR-11 | AI gộp kiểm tra hiển thị với việc so sánh dữ liệu API. | Chỉ giữ oracle GUI: mỗi hàng nhìn thấy ID, ngày, tổng tiền và trạng thái; API comparison chuyển thành GUI-O-002B. |
| GUI-O-006 | Định dạng ngày không mơ hồ | Prompt ban đầu tập trung vào việc trường ngày có xuất hiện, không nêu localization hoặc khác biệt locale trình duyệt. | Thêm kiểm tra định dạng ngày dễ hiểu và nhất quán cho người dùng Việt Nam. |
| GUI-O-018 | Trạng thái không phụ thuộc riêng vào màu | AI đề xuất badge màu nhưng không kiểm tra người không phân biệt được màu. | Yêu cầu trạng thái vẫn hiểu được bằng nhãn chữ khi bỏ thông tin màu. |
| GUI-O-019 | Quan hệ header–cell của bảng | AI đánh giá bảng chủ yếu bằng bố cục nhìn thấy, không kiểm tra accessibility tree. | Thêm kiểm tra header được liên kết đúng với data cells cho screen reader. |
| GUI-O-020 | Reflow của bảng ở 320 px | AI kiểm tra responsive cho Login nhưng không nhận ra bảng năm cột có rủi ro riêng trên mobile. | Thêm thao tác đọc đủ trường và dùng action tại viewport 320 px. |
| GUI-O-021 | Order History ở 200% text/zoom | AI không mở rộng kiểm tra zoom từ form sang bảng dữ liệu dày đặc. | Thêm kiểm tra label, tổng tiền, trạng thái và action vẫn đọc/thao tác được. |
| GUI-O-022 | Phân biệt lỗi tải với trạng thái không có đơn | AI thường xem mảng dữ liệu rỗng là một empty state duy nhất và bỏ qua sự khác biệt nhận thức của người dùng. | Thêm kiểm tra UI lỗi có thông báo và recovery riêng, không giả dạng empty state. |
| GUI-O-024A | Phản hồi nhìn thấy sau thao tác hủy | AI trộn feedback với việc trạng thái có được persist ở backend. | Giữ success/failure feedback trong GUI; chuyển persistence thành GUI-O-024B. |
| GUI-L-025 | Liên kết error với input | AI chỉ yêu cầu có thông báo lỗi mà không kiểm tra quan hệ programmatic. | Thêm kiểm tra error gọi đúng tên field và được liên kết với control tương ứng. |
| GUI-L-026 | Screen reader thông báo lỗi động | Prompt ban đầu không yêu cầu dùng screen reader hoặc live-region behavior. | Thêm kiểm tra lỗi động được announce và không làm focus nhảy bất ngờ. |
| GUI-L-027 | Focus không bị che khuất | AI kiểm tra “focus visible” nhưng không phân biệt focus indicator có thể tồn tại mà vẫn bị sticky/overlay che. | Thêm kiểm tra WCAG 2.2 Focus Not Obscured ở desktop và mobile. |
| GUI-L-028 | Text spacing override | Đây là thiết lập accessibility ít xuất hiện trong prompt GUI tổng quát và không được suy ra từ browser zoom. | Thêm các giá trị text-spacing WCAG cụ thể và oracle không clipping/overlap. |
| GUI-L-029 | Portrait và landscape | AI kiểm tra một kích thước mobile cố định nhưng không kiểm tra thay đổi orientation. | Thêm kiểm tra cùng nội dung và controls hoạt động ở cả hai hướng màn hình. |
| GUI-L-030 | Dark mode | SUT không khai báo theme nên AI không tự thêm vào checklist chuẩn. | Thêm dark mode dưới nhãn `Exploratory`, không coi đây là yêu cầu bắt buộc của SUT. |
| GUI-O-025 | Caption của bảng | AI cho rằng heading “Lịch sử đơn hàng” đủ về mặt hình ảnh và bỏ qua tên accessible của bảng. | Thêm kiểm tra caption mô tả được expose cho screen reader. |
| GUI-O-026 | Reading order khi bảng reflow | AI kiểm tra từng cell/header nhưng không kiểm tra thứ tự đọc sau responsive transformation. | Thêm kiểm tra screen reader đọc mỗi hàng theo thứ tự cột nhìn thấy ở desktop và mobile. |
| GUI-O-027 | Focus management trong confirmation dialog | AI chỉ kiểm tra nút hủy dùng được bằng keyboard, chưa kiểm tra focus trap và focus return của modal. | Thêm quy trình Tab/Shift+Tab và yêu cầu focus trở lại nút gọi dialog. |
| GUI-O-028 | Horizontal scroll chỉ nằm trong vùng bảng | “Không có horizontal scroll” là yêu cầu quá tuyệt đối đối với bảng rộng. | Thay bằng oracle standards-based: nếu cần scroll ngang thì chỉ vùng bảng scroll, phần trang còn lại phải reflow. |
| GUI-O-029 | Thông báo trạng thái đơn bằng assistive technology | AI chỉ kiểm tra badge/feedback nhìn thấy, không kiểm tra status message động. | Thêm kiểm tra thay đổi trạng thái được screen reader announce mà không cần chuyển focus. |

## Những mục V0 không còn nằm trong GUI checklist

| ID V0 | Xử lý sau review | Lý do |
| --- | --- | --- |
| GUI-L-012 | Chuyển supporting tests | Kiểm tra chuẩn hóa khoảng trắng là input-processing/data-integrity. |
| GUI-L-015 | Chuyển supporting tests | Việc route đích resolve đúng là functional navigation. |
| GUI-L-016 | Chuyển supporting tests | Việc route đăng ký resolve đúng là functional navigation. |
| GUI-L-017 | Chuyển supporting tests | Phụ thuộc authentication và authenticated state. |
| GUI-O-003 | Chuyển supporting tests | Ownership của đơn hàng là authorization/data-access. |
| GUI-O-009 | Chuyển supporting tests | Điều kiện trạng thái được phép hủy là business rule. |
| GUI-O-014 | Chuyển supporting tests | Truy cập khi chưa đăng nhập là authorization/session behavior. |
| GUI-O-001 | Loại sau review | Yêu cầu heading cụ thể bị đánh giá là trùng/không có standard áp dụng trong phạm vi đã chọn. |
| GUI-O-017 | Loại sau review | Yêu cầu illustrated empty state không có tiêu chuẩn bắt buộc phù hợp với phạm vi đã thống nhất. |

## Kết luận

Human review không chỉ tăng checklist từ 32 lên 45 mục mà còn làm rõ ranh giới
test suite. Phần bổ sung tập trung vào accessibility và trạng thái UI có thể
quan sát; phần backend/security được giữ để truy vết nhưng không tính vào GUI
coverage. Bài học chính là prompt “generate a GUI checklist” không đủ để tạo
coverage sâu: cần chỉ rõ tiêu chuẩn, công cụ quan sát, viewport và nguyên tắc
mỗi case chỉ có một objective và một oracle.

