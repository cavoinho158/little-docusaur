---
title: "Course3 - Module4 Activity: Apply OS hardening techniques"
sidebar_position: 16
---

## Tổng quan hoạt động

Bạn là một nhà phân tích bảo mật cho trang web **yummyrecipesforme.com**, một trang web bán công thức nấu ăn và sách dạy nấu ăn. Một nhân viên cũ đã thực hiện một cuộc tấn công **brute force** để chiếm quyền truy cập vào máy chủ web, thay đổi mã nguồn và chèn mã độc vào trang web. Nhiệm vụ của bạn là điều tra, xác định, ghi chép và đề xuất giải pháp cho sự cố này.

---

## Kịch bản

- **Sự cố**: Một nhân viên cũ đã thực hiện tấn công brute force để đoán mật khẩu quản trị viên. Sau khi đăng nhập, họ đã chèn mã JavaScript vào mã nguồn, yêu cầu người dùng tải xuống một tệp thực thi chứa mã độc. Khi người dùng tải và chạy tệp, họ bị chuyển hướng đến trang web giả mạo **greatrecipesforme.com**.
- **Hậu quả**: Nhiều khách hàng phản ánh rằng trang web yêu cầu họ tải xuống tệp và sau đó máy tính của họ chạy chậm hơn.
- **Nhiệm vụ của bạn**: Điều tra sự cố, ghi chép chi tiết và đề xuất một biện pháp bảo mật để ngăn chặn các cuộc tấn công brute force trong tương lai.

---

## Hướng dẫn từng bước

### Bước 1: Truy cập mẫu báo cáo

- Sử dụng mẫu báo cáo sự cố bảo mật: [Mẫu báo cáo sự cố](https://docs.google.com/document/d/1bmTZQGiYdJSgwQ08IpXWEUWhnKMVbJ2KZxsheZhzMMs/template/preview?usp=sharing).

### Bước 2: Xác định giao thức mạng

- Phân tích nhật ký **tcpdump** để xác định giao thức mạng liên quan đến sự cố. Các giao thức chính cần xem xét là **DNS** và **HTTP**.
- Tài liệu hỗ trợ: [Nhật ký tcpdump](https://docs.google.com/document/d/1HDAQTLSK5CyPLPHeLI0s75kNE-kA2kG0NFJoZlz0xCc/template/preview?resourcekey=0-vDSHnW4qKxOOQtsZeGRUeQ).

### Bước 3: Ghi chép sự cố

- Tóm tắt sự cố trong báo cáo, bao gồm:
  - Cách sự cố xảy ra (tấn công brute force, chèn mã độc).
  - Hậu quả (chuyển hướng người dùng đến trang web giả mạo).
  - Nguồn thông tin và bằng chứng (nhật ký tcpdump, phân tích mã nguồn).

### Bước 4: Đề xuất biện pháp bảo mật

- Đề xuất một biện pháp để ngăn chặn tấn công brute force trong tương lai. Các biện pháp có thể bao gồm:
  - Yêu cầu mật khẩu mạnh.
  - Áp dụng xác thực hai yếu tố (2FA).
  - Giới hạn số lần đăng nhập sai.

---

## Mẫu cáo cáo hoàn chỉnh

Bạn có thể tham khảo mẫu báo cáo hoàn chỉnh tại đây: [Mẫu báo cáo hoàn chỉnh](https://docs.google.com/document/d/1RddhtXPPCqYn1W3ScfMxP6IR5E3WErgJG6lndJQQFD4/template/preview).

---

## Những điểm cần lưu ý

- **Giao thức mạng**: Xác định giao thức DNS và HTTP trong nhật ký tcpdump.
- **Ghi chép sự cố**: Cung cấp thông tin chi tiết và chính xác về sự cố.
- **Đề xuất biện pháp**: Chọn một biện pháp bảo mật hiệu quả và giải thích lý do.

---

## Bài học rút ra

- Phân tích giao thức mạng giúp xác định nguyên nhân sự cố.
- Ghi chép chi tiết và chính xác là chìa khóa để giải quyết và ngăn chặn các sự cố trong tương lai.
- Áp dụng các biện pháp bảo mật như 2FA và giới hạn đăng nhập giúp tăng cường an ninh mạng.
