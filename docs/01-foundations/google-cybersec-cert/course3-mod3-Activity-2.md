---
title: "Course3 - Module3 Activity: Analyze network attacks"
sidebar_position: 14
---

## Ngữ cảnh

Bạn là một **chuyên viên phân tích an ninh mạng** tại một công ty du lịch. Nhân viên thường xuyên truy cập **trang web nội bộ** để tìm kiếm các gói du lịch cho khách hàng.

Một buổi chiều, hệ thống giám sát gửi cảnh báo về sự cố với **máy chủ web**. Khi bạn thử truy cập, trình duyệt báo lỗi **"connection timeout"**.

Bạn sử dụng **Wireshark** để phân tích lưu lượng mạng và phát hiện **một lượng lớn TCP SYN requests** từ một địa chỉ IP không xác định. Máy chủ **bị quá tải** do số lượng lớn yêu cầu này và mất khả năng phản hồi.

Bạn **tạm thời ngắt kết nối máy chủ** để khôi phục và **cấu hình firewall để chặn IP tấn công**, nhưng nhận ra rằng hacker có thể **giả mạo IP khác** để vượt qua rào cản này. Bạn cần **báo cáo sự cố ngay cho cấp trên** để thảo luận biện pháp phòng chống lâu dài.

---

## Hướng dẫn từng bước

### Bước 1: Truy cập mẫu báo cáo

Sử dụng mẫu báo cáo sự cố an ninh mạng tại đây:  
👉 [Mẫu báo cáo](https://docs.google.com/document/d/1xEk_arFwlQOto7KEM6gN-sIYriXhP9-lY2ftpBXhS4M/template/preview?resourcekey=0-_ODneeo__mDgK7BTE1FkVA)

### Bước 2: Truy cập tài liệu hỗ trợ

- **Log Wireshark TCP/HTTP:** [Xem tại đây](https://docs.google.com/spreadsheets/d/1enpRzrIao3J2Lp2tOI0hmu1Cu7D7CjLGhFAiTiR9J64/edit?gid=218501934#gid=218501934)
- **Cách đọc log Wireshark:** [Xem tại đây](https://docs.google.com/document/d/1JYyUPhfm2gwDellGRIcgItA3cZ7kz29xdYpVr1L_o9c/template/preview?usp=sharing)

### Bước 3: Xác định loại tấn công

📌 **Phân tích log Wireshark** để xác định loại tấn công:

- **Lưu lượng bất thường:** Một số lượng lớn **TCP SYN requests** đến từ cùng một IP.
- **Kết quả:** Máy chủ bị quá tải và không thể xử lý yêu cầu hợp lệ từ nhân viên.
- **Loại tấn công:** Đây là một cuộc **SYN Flood Attack**, một dạng **DoS (Denial of Service)**.

📌 **Ghi lại các thông tin này vào phần 1 của báo cáo sự cố.**

### Bước 4: Phân tích tác động của cuộc tấn công

- **Mô tả cuộc tấn công:**  
  ✅ Hacker gửi liên tục **TCP SYN requests** nhưng không phản hồi **SYN-ACK**, làm cạn kiệt tài nguyên máy chủ.  
  ✅ Máy chủ bị quá tải, không thể phản hồi **yêu cầu hợp lệ** từ nhân viên.
- **Tác động đến tổ chức:**  
  ❌ Nhân viên **không thể truy cập website** để phục vụ khách hàng.  
  ❌ **Ảnh hưởng đến doanh thu** vì khách hàng không thể đặt tour.  
  ❌ **Rủi ro uy tín** nếu sự cố kéo dài.

📌 **Ghi lại các thông tin này vào phần 2 của báo cáo sự cố.**

### Bước 5: Đề xuất giải pháp phòng ngừa

✔ **Cấu hình firewall nâng cao** để chặn lưu lượng SYN bất thường.  
✔ **Kích hoạt SYN cookies** để xác minh các kết nối hợp lệ.  
✔ **Triển khai hệ thống phát hiện xâm nhập (IDS/IPS)** để phát hiện sớm tấn công.  
✔ **Giới hạn tốc độ kết nối** từ một IP để giảm nguy cơ quá tải.

📌 **Ghi lại đề xuất này trong báo cáo để cấp trên xem xét.**

---

## Kết luận

- **Loại tấn công:** **SYN Flood Attack**, một dạng **DoS attack**.
- **Hậu quả:** Máy chủ bị quá tải, nhân viên không thể truy cập website, tổn thất doanh thu.
- **Giải pháp:** Cấu hình firewall, sử dụng SYN cookies, IDS/IPS, và giới hạn kết nối để ngăn chặn tấn công tương tự trong tương lai.
