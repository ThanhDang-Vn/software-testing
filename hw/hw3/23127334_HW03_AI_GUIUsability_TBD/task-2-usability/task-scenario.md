# Task Scenario

> Bạn đã từng mua hàng trên EShop và muốn kiểm tra lại một đơn hàng gần đây.
> Hãy đăng nhập bằng tài khoản được cung cấp, tìm nơi chứa các đơn hàng trước
> đây, rồi cho biết mã đơn, ngày đặt, tổng tiền và trạng thái hiện tại của đơn
> hàng gần nhất. Khi tin rằng đã tìm đủ thông tin, hãy báo cho người điều phối.

Do not mention `/profile`, “Lịch sử đơn hàng,” or step-by-step navigation to the
participant.

## Standard start state

- Browser is on the EShop Home page.
- Participant is logged out.
- No EShop tab other than the start page is open.
- The supplied session account is unlocked and contains at least two orders.
- The moderator has verified expected latest-order data but does not reveal it.

## Completion criteria

`SUCCESS_UNASSISTED`: participant signs in, finds history, and correctly reports
all four fields without intervention.

`SUCCESS_ASSISTED`: participant completes after a necessary moderator
intervention.

`FAIL`: participant cannot report all four fields within eight minutes.

