---
title: OSSEC - Host-based IDS
sidebar-position: 2
---

## 1. OSSEC là gì?

OSSEC (Open Source Security) là một hệ thống phát hiện xâm nhập dựa trên host (HIDS) mã nguồn mở, được thiết kế để giám sát và phân tích các hoạt động trên hệ thống, phát hiện các hành vi bất thường và cảnh báo kịp thời, cung cấp các tính năng như:

- Giám sát log file.
- Phát hiện rootkit và mã độc.
- Cảnh báo về các thay đổi file hệ thống.
- Phân tích tính toàn vẹn của file.
- Tích hợp với các hệ thống SIEM và các công cụ quản lý sự cố.
- Chủ động phản ứng (Active respone) như chặn IP, xóa file độc hại.

OSSEC hỗ trợ đa nền tảng, bao gồm Linux, Windows, macOS, và các hệ điều hành khác.

## 2. Cách OSSEC hoạt động

### 2.1 Kiến trúc

OSSEC hoạt động theo mô hình client-server:

- **OSSEC Server**: Thu thập và phân tích log từ các agent.
- **OSSEC Agent**: Cài đặt trên các máy chủ cần giám sát, gửi log về server.

### 2.2 Quy trình xử lý log

1. **Thu thập log**: OSSEC thu thập log từ nhiều nguồn khác nhau như syslog, Windows Event Log, và các ứng dụng cụ thể.
2. **Phân tích log**: Sử dụng các **decoders** để phân tích cú pháp log và các **rules** để phát hiện các hoạt động đáng ngờ.
3. **Cảnh báo**: Khi phát hiện sự cố, OSSEC gửi cảnh báo qua email, Slack, hoặc tích hợp với các công cụ quản lý sự cố như PagerDuty.

### 2.3 Giao thức

- OSSEC sử dụng giao thức **TCP/UDP** để giao tiếp giữa server và agent.
- Dữ liệu được mã hóa để đảm bảo an toàn trong quá trình truyền tải.

## 3. Tính năng nổi bật của OSSEC

- **Giám sát log thời gian thực**: Phân tích log từ nhiều nguồn khác nhau.
- **Phát hiện xâm nhập**: Sử dụng các quy tắc (rules) để phát hiện các hoạt động đáng ngờ.
- **Tính toàn vẹn của file**: Sử dụng checksum để phát hiện các thay đổi bất thường trong file hệ thống.
- **Cảnh báo và phản ứng tự động**: Hỗ trợ gửi cảnh báo qua nhiều kênh khác nhau.
- **Khả năng mở rộng**: Người dùng có thể tùy chỉnh các quy tắc và decoders để phù hợp với nhu cầu cụ thể.

## 4. OSSEC và khả năng phản ứng chủ động (Active Response)

OSSEC không chỉ dừng lại ở việc giám sát và phát hiện các hoạt động đáng ngờ, mà còn có khả năng phản ứng chủ động (active response) để ngăn chặn các mối đe dọa ngay lập tức. Tính năng này cho phép OSSEC tự động thực hiện các hành động cụ thể khi phát hiện các sự kiện bảo mật nghiêm trọng, giúp giảm thiểu thiệt hại và ngăn chặn các cuộc tấn công tiếp theo.

### 4.1 Cách OSSEC thực hiện phản ứng chủ động

OSSEC thực hiện phản ứng chủ động thông qua các **active response scripts**. Các script này được kích hoạt khi một quy tắc (rule) cụ thể được kích hoạt. Các hành động phản ứng có thể bao gồm:

- **Chặn IP**: Tự động chặn các địa chỉ IP được xác định là nguồn gốc của các cuộc tấn công.
- **Khóa tài khoản người dùng**: Tạm thời khóa các tài khoản người dùng có hành vi đáng ngờ.
- **Xóa file độc hại**: Tự động xóa các file bị nghi ngờ là mã độc.
- **Khởi động lại dịch vụ**: Khởi động lại các dịch vụ bị ảnh hưởng bởi các cuộc tấn công.

### 4.2 Cấu hình phản ứng chủ động

Để cấu hình phản ứng chủ động trong OSSEC, bạn cần thực hiện các bước sau:

1. **Kích hoạt Active Response**: Trong file cấu hình `ossec.conf`, bạn cần thêm các mục `active-response` để kích hoạt tính năng này.

   ```xml
   <active-response>
       <command>firewall-drop</command>
       <location>local</location>
       <level>6</level>
       <timeout>600</timeout>
   </active-response>
   ```

   - `command`: Tên của script phản ứng chủ động.
   - `location`: Phạm vi áp dụng (local hoặc toàn bộ hệ thống).
   - `level`: Mức độ nghiêm trọng của sự kiện để kích hoạt phản ứng.
   - `timeout`: Thời gian (tính bằng giây) mà hành động phản ứng sẽ được duy trì.

2. **Tùy Chỉnh Script Phản Ứng**: OSSEC cung cấp sẵn một số script phản ứng chủ động, nhưng bạn cũng có thể tạo các script tùy chỉnh để phù hợp với nhu cầu cụ thể của mình. Các script này thường được đặt trong thư mục `/var/ossec/active-response/bin/`.

3. **Tích Hợp Với Các Công Cụ Khác**: OSSEC có thể tích hợp với các công cụ như **firewall** (iptables, pfSense), **IDS/IPS** (Snort, Suricata), và các hệ thống quản lý sự cố để tăng cường khả năng phản ứng chủ động.

### 4.3 Ví dụ về phản ứng chủ động

- **Chặn IP**: Khi OSSEC phát hiện một địa chỉ IP thực hiện quá nhiều lần đăng nhập thất bại, nó có thể tự động thêm IP đó vào danh sách chặn của firewall.

- **Khóa tài khoản**: Nếu một tài khoản người dùng cố gắng thực hiện các hành động đáng ngờ, OSSEC có thể tự động khóa tài khoản đó và gửi cảnh báo đến quản trị viên.

- **Xóa file độc hại**: Khi phát hiện một file có chứa mã độc, OSSEC có thể tự động xóa file đó và gửi thông báo đến quản trị viên.

## 5. Ưu điểm và nhược điểm của OSSEC

### 5.1 Ưu điểm

- **Mã nguồn mở và miễn phí**: Phù hợp với các tổ chức có ngân sách hạn chế.
- **Hỗ trợ đa nền tảng**: Có thể triển khai trên nhiều hệ điều hành khác nhau.
- **Tích hợp dễ dàng**: Có thể tích hợp với các hệ thống SIEM, email, và các công cụ quản lý sự cố.
- **Cộng đồng hỗ trợ lớn**: Tài liệu phong phú và cộng đồng tích cực.

### 5.2 Nhược điểm

- **Cần cấu hình thủ công**: Đòi hỏi kiến thức kỹ thuật để tối ưu hóa hiệu suất.
- **Không có giao diện đồ họa mặc định**: Cần sử dụng giao diện web của bên thứ ba như OSSEC Web UI.

## 6. Ứng dụng thực tế của OSSEC

- **Giám sát máy chủ**: OSSEC được sử dụng để giám sát các máy chủ web, cơ sở dữ liệu, và các hệ thống quan trọng khác.
- **Tuân thủ bảo mật**: Hỗ trợ các yêu cầu tuân thủ như PCI-DSS, HIPAA bằng cách cung cấp báo cáo và cảnh báo.
- **Phát hiện mã độc**: OSSEC có thể phát hiện các file bị nhiễm mã độc thông qua phân tích tính toàn vẹn của file.

## 7. Kết luận

OSSEC không chỉ là một công cụ giám sát và phát hiện xâm nhập mạnh mẽ, mà còn cung cấp khả năng cảnh báo tự động, phản ứng chủ động để ngăn chặn các mối đe dọa một cách hiệu quả. Với khả năng tích hợp linh hoạt và cộng đồng hỗ trợ tích cực, OSSEC là một lựa chọn hàng đầu cho các tổ chức cần một giải pháp bảo mật toàn diện và tiết kiệm chi phí.

---

### **Tài liệu tham khảo**

- Trang chủ OSSEC: [https://www.ossec.net/](https://www.ossec.net/)
- Tài liệu chính thức: [https://www.ossec.net/docs/](https://www.ossec.net/docs/)
- Cộng đồng OSSEC trên GitHub: [https://github.com/ossec/ossec-hids](https://github.com/ossec/ossec-hids)
