---
title: Set up Kali virtual machine for labs
sidebar_postion: 1
---

Hello mọi người :3 đoán xem là tôi hay cậu ấy đang viết bài nào? ehehe, tất nhiên là tôi rồi **(.❛ ᴗ ❛.)**.

Lý thuyết mãi thì cũng không tốt, phải đi đôi với thực hành nữa. Thật ra thì thực hành từ tuần trước rồi nhưng mà hôm nay hai chúng tôi mới set up lại các thứ rồi lên bài chia sẻ với mọi người.

Mọi người lưu ý là cái này tham khảo thôi nha, không đảm bảo an toàn 100% đâu, nên có gì tôi hong cóa chịu trách nhiệm đâu à nha! **Σ(°△°|||)**. Cũng vì vậy nên là tôi và cậu ấy sẽ rất vui nếu mọi người có thể chia sẻ thêm cách để cấu hình môi trường thực hành an toàn và thuận tiện nhất **⸜( ´ ꒳ ` )⸝**.

**Hãy bắt đầu từ [phần này](#kali-vmware-sandbox) trước để biết mục tiêu cấu hình nha.**

> _"Để tôi viết cho bài viết đỡ khô khan và nhàm chán nhé :3, cậu mà viết thì mọi người buồn ngủ lắm." - Tôi đùa_ /
> _"... Thích làm gì đó thì làm, đồ nói nhiều." - Cậu ấy quay mặt đi_ /

## Kali Linux on VMware

Do là quên chụp hình lại lúc cài đặt nên tôi và cậu ấy quyết định để link video cho mọi người xem nha, bước này cũng khá đơn giản vì bây giờ VMware và Kali Linux hỗ trợ rất nhiều trong việc cài đặt rồi, không cần phải tùy chỉnh nhiều.

Mọi người có thể dùng phần mềm khác để chạy máy ảo thay vì VMware như chúng tôi. Và khuyến khích mọi người nên cài đặt VMware trên một ổ đĩa vật lý riêng để tránh ảnh hưởng tới ổ đĩa chính trên máy.

Link tải Kali Linux: [kali.org](https://www.kali.org/get-kali/#kali-virtual-machines)

[![Install Kali on VMware thumbnail](./img/How%20to%20Install%20Kali%20Linux%202024%20in%20VMWare%20_%20Kali%20linux%202024.2.jpeg)](https://youtu.be/dQ3eQdcntqA?si=I_FA2a3NPcday64D)

## Pfsense on VMware

Cái này thì do lúc trước học thực hành trên lớp có cài đặt rồi nên chúng tôi giữ nguyên luôn :v mọi người có thể xem hướng dẫn cài đặt ở đây nha.

Pfsense thì mọi người muốn tải về phải tạo tài khoản trước, rồi thêm file vào giỏ hàng, chọn thanh toán rồi điền thông tin thì mới tải được nha, **không có tính phí đâu**:3.

Link tải Pfsense: [pfsense.org](https://pfsense.org/download/)

[![Install Pfsense on VMware thumbnail](<./img/(29)%20How%20to%20Install%20Kali%20Linux%202024%20in%20VMWare%20_%20Kali%20linux%202024.2.jpeg>)](https://youtu.be/Ayr_av2EX_U?si=a4npr-jUEWWl2kce)

## Sandbox - A secure, isolated environment

### 🔹 Giới thiệu

**Sandbox** là một môi trường ảo được cách ly khỏi hệ thống chính, cho phép kiểm tra mã độc và phân tích các hành vi đáng ngờ mà không ảnh hưởng đến hệ thống thực tế. Đây là một công cụ quan trọng trong lĩnh vực an ninh mạng, giúp các chuyên gia phân tích, phát hiện và ngăn chặn các mối đe dọa bảo mật.

### 🔹 Phân loại

| **Loại Sandbox**                         | **Mô Tả**                                                                              |
| ---------------------------------------- | -------------------------------------------------------------------------------------- |
| **Sandbox Phần Mềm (Software Sandbox)**  | Cung cấp môi trường ảo hóa để kiểm tra ứng dụng mà không ảnh hưởng đến hệ thống chính. |
| **Sandbox Phần Cứng (Hardware Sandbox)** | Cách ly phần cứng để chạy và phân tích mã độc mà không ảnh hưởng đến hệ thống chính.   |
| **Sandbox Dựa Trên Cloud**               | Mô phỏng môi trường thực tế trong cloud để phân tích mã độc từ xa.                     |

### 🔹 Các sandbox phổ biến

| **Tên Sandbox**              | **Mô Tả**                                                                                         |
| ---------------------------- | ------------------------------------------------------------------------------------------------- |
| **Cuckoo Sandbox**           | Nền tảng mã nguồn mở chuyên dùng để phân tích phần mềm độc hại.                                   |
| **FireEye Malware Analysis** | Giải pháp phân tích mã độc nâng cao, tích hợp trí tuệ nhân tạo.                                   |
| **VMRay Analyzer**           | Công cụ mạnh mẽ sử dụng công nghệ giám sát hypervisor để phát hiện mã độc.                        |
| **Any.Run**                  | Sandbox tương tác cho phép người dùng quan sát hành vi của phần mềm độc hại trong thời gian thực. |

### 🔹 Tầm quan trọng của Sandbox trong Cybersecurity

- **Phát hiện mã độc**: Kiểm tra và phân tích các tập tin, ứng dụng có hành vi đáng ngờ.
- **Bảo vệ hệ thống**: Hạn chế nguy cơ lây nhiễm phần mềm độc hại.
- **Phân tích tấn công**: Hỗ trợ các chuyên gia bảo mật trong việc nghiên cứu kỹ thuật tấn công.
- **Kiểm tra phần mềm**: Đánh giá ứng dụng trước khi triển khai trên hệ thống thật.

## Kali VMware sandbox

Mọi người đã cài đặt xong máy ảo Kali và Pfsense rồi cũng như đã được giới thiệu về sandbox rồi, vậy thì giờ tiến hành "cách ly" máy ảo này thôi nào. Sẽ có một số việc cần làm bao gồm:

1. Cài đặt VMware và các VM (Virtual Machine - máy ảo) trên ổ đĩa vật lý riêng, như SSD di động nếu có thể.
2. Bật Windows Defender, cài đặt Controlled Folder Access hoặc sử dụng ShadowDefender/DeepFreeze để tránh việc malware lây lan và truy cập vào ổ đĩa chính. ![windows security](./img/Screenshot%202025-02-07%20224013.png)
3. Tắt Shared Folders và Clipboard giữa VM và host.
4. Dùng Mạng Host-Only và Pfsense để ngăn VM kết nối Internet trực tiếp, ngăn chặn kết nối của malware.
5. Thường xuyên lưu lại Snapshot sau khi cấu hình thành công và trước khi thử nghiệm để có thể khôi phục nhanh chóng.

Trong các việc trên thì cái số 4 là hơi khó nhai xíu, mọi người lưu ý là cấu hình máy ảo sao cho card mạng của máy Kali với interface LAN của Pfsense giống nhau là được (chọn Custom network -> VMnet1) và tắt DHCP của VMnet1 trong Virtual Network Editor nha. Sau đó truy cập vào trang quản lý của Pfsense để cài đặt các rules và kiểm tra rules.

Tôi ban đầu muốn hướng dẫn mọi người chi tiết cơ, nhưng mà cậu ấy cứ bảo rằng để mọi người tự làm cho nhớ và những việc này rất đơn giản. :v Tôi khá chắc là cậu ấy đang lười biếng thôi. Thôi thì mọi người thử sức mình xem sao nha? Hẹn gặp lại mọi người trong các bài Labs tiếp theo ~
