---
title: "Course3 - Module3 Activity: Analyze network layer communication"
sidebar_position: 13
---

## Ngữ cảnh

Bạn là một **chuyên viên phân tích an ninh mạng** tại một công ty cung cấp dịch vụ IT. Một số khách hàng báo cáo rằng họ **không thể truy cập website** [www.yummyrecipesforme.com](www.yummyrecipesforme.com) và nhận được lỗi **"destination port unreachable"** khi chờ trang tải.

Bạn thử truy cập và cũng gặp lỗi tương tự. Để điều tra, bạn sử dụng **tcpdump** để phân tích lưu lượng mạng. Khi trình duyệt gửi yêu cầu DNS qua giao thức **UDP** để lấy địa chỉ IP, bạn nhận được phản hồi **ICMP với thông báo lỗi "udp port 53 unreachable"**.

![log tcpdump](<./img/course3-mod3(2).png>)

---

## Hướng dẫn từng bước

### Bước 1: Truy cập mẫu báo cáo

Nhấn vào liên kết sau để mở **mẫu báo cáo sự cố an ninh mạng**:  
👉 [Mẫu báo cáo](https://docs.google.com/document/d/1hwjSRYalxGd-qyRIXWz8LBVuSAgEq0AHXOF_BB7DdrI/template/preview?usp=sharing)

### Bước 2: Tóm tắt vấn đề từ log tcpdump

- **Phân tích log tcpdump** cho thấy trình duyệt gửi **yêu cầu DNS (UDP port 53)** nhưng bị từ chối.
- **ICMP báo lỗi "udp port 53 unreachable"**, cho thấy **máy chủ DNS không phản hồi**.
- **Nguyên nhân có thể do:** DNS server bị lỗi, firewall chặn port 53, hoặc dịch vụ DNS bị dừng.

📌 _Ghi lại các thông tin này vào phần 1 của báo cáo sự cố._

### Bước 3: Phân tích nguyên nhân và đề xuất giải pháp

- Sự cố **được báo cáo lần đầu vào** [thời gian trong log].
- Hậu quả: **Người dùng không thể truy cập website, lỗi port unreachable**.
- **Hiện trạng:** Website vẫn không truy cập được.
- **Thông tin tìm được:** Máy chủ DNS **không phản hồi** yêu cầu UDP port 53.
- **Bước tiếp theo:**  
  ✅ Kiểm tra máy chủ DNS có đang hoạt động không.  
  ✅ Kiểm tra firewall có chặn UDP port 53 không.  
  ✅ Kiểm tra cài đặt DNS của khách hàng.

📌 _Ghi lại các thông tin này vào phần 2 của báo cáo sự cố._

### Bước 4: Lưu báo cáo và đối chiếu với mẫu hoàn chỉnh

Tham khảo **mẫu báo cáo hoàn chỉnh** để so sánh với báo cáo của bạn:  
👉 [Báo cáo mẫu](https://docs.google.com/document/d/11YIrN6R3fTqw7AWeh_4YCB4QXK8VnO4_CYPSK2MU5xc/edit?usp=sharing)

---

## Kết luận

- **Sự cố liên quan đến giao thức DNS (UDP port 53)** do máy chủ không phản hồi.
- **Nguyên nhân có thể là lỗi máy chủ, firewall chặn port, hoặc dịch vụ DNS bị tắt.**
- **Giải pháp:** Kiểm tra máy chủ DNS, firewall, và cài đặt DNS.
