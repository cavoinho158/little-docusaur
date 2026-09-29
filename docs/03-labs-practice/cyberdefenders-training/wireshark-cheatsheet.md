---
title: Wireshark Cheatsheet
sidebar_position: 5
---

## Những chức năng và kỹ năng Wireshark quan trọng cho SOC

### 🕵️ 1. **Follow Stream**

- **Chức năng**: Theo dõi toàn bộ nội dung của một phiên TCP, UDP, hoặc HTTP.
- **Cách dùng**: Chuột phải vào một gói tin → _Follow → TCP Stream / HTTP Stream / UDP Stream_.
- **Ứng dụng**:

  - Phân tích reverse shell, credential (username/password).
  - Theo dõi lệnh tấn công đã nhập.
  - Kiểm tra file hoặc shell script đã truyền.

### 🔍 2. **Filter chính xác**

- **Ví dụ các bộ lọc hữu ích**:

  - `http.request` — lọc tất cả yêu cầu HTTP.
  - `ip.addr == 10.0.0.5` — lọc mọi gói liên quan đến IP.
  - `tcp.port == 4444` — theo dõi reverse shell phổ biến.
  - `frame contains "cmd.exe"` — tìm shell command.
  - `dns.qry.name contains "malicious.com"` — tìm truy vấn DNS đáng ngờ.

### 🧠 3. **Protocol Hierarchy** (Thống kê theo giao thức)

- **Vị trí**: _Statistics → Protocol Hierarchy_
- **Tác dụng**: Cho bạn thấy lưu lượng bị chi phối bởi giao thức nào — HTTP, SMB, DNS, v.v.
- **Ứng dụng**: Nhanh chóng phát hiện hoạt động bất thường như DNS tunneling, HTTP lạ, nhiều gói SMB (worm nội bộ).

### 📊 4. **Endpoints và Conversations**

- **Vị trí**: _Statistics → Endpoints_ và _Statistics → Conversations_
- **Tác dụng**:

  - Liệt kê các IP tham gia kết nối.
  - Hiển thị chi tiết tổng số gói, byte, và thời gian.

- **Ứng dụng**: Xác định host bị nghi ngờ đang giao tiếp với IP ngoài đáng ngờ.

### ⏳ 5. **Flow Graph (biểu đồ dòng chảy)**

- **Vị trí**: _Statistics → Flow Graph_
- **Tác dụng**: Vẽ trình tự các kết nối (SYN, ACK, GET, POST...), cực kỳ hữu ích để:

  - Hiểu quá trình khai thác lỗ hổng.
  - Nhận diện C2 hoặc exfiltration.

### 🔐 6. **Export Objects (Files, HTTP...)**

- **Vị trí**: _File → Export Objects → HTTP_ hoặc _SMB_
- **Tác dụng**: Trích xuất file mà attacker tải về hoặc upload qua HTTP/SMB.

### ⚠️ 7. **Detection dấu hiệu tấn công phổ biến (IOCs)**

- Tìm:

  - `cmd.exe`, `powershell`, `wget`, `curl`, `nc`, `bash -i`
  - `.exe` hoặc `.dll` đáng ngờ
  - Truy vấn DNS liên tục hoặc IP không rõ nguồn gốc
  - Gói tin lớn ra ngoài (exfiltration)

### 🛠️ 8. **Custom coloring rules**

- Đặt màu cho các loại traffic (DNS, HTTP POST, TCP handshake...), giúp bạn:

  - Dễ nhận biết các hoạt động bất thường
  - Trực quan hóa phiên kết nối dài hoặc độc hại

### 🧩 9. **Inspect Certificate và TLS Handshake**

- Tìm hiểu chứng chỉ SSL giả mạo, self-signed hoặc expired.
- Kiểm tra attacker MITM (man-in-the-middle) trên HTTPS.

## Cheat Sheet Wireshark Filters

| **Loại**               | **Filter**                                             | **Mô tả**                                            |
| ---------------------- | ------------------------------------------------------ | ---------------------------------------------------- |
| **IP & Port cơ bản**   | `ip.addr == 10.0.0.5`                                  | Mọi gói chứa địa chỉ 10.0.0.5 (src hoặc dst)         |
|                        | `ip.src == 14.0.0.120`                                 | Gói chỉ từ source IP 14.0.0.120                      |
|                        | `ip.dst == 10.0.0.112`                                 | Gói chỉ đến destination IP 10.0.0.112                |
|                        | `tcp.port == 4444`                                     | Gói TCP trên cổng 4444                               |
|                        | `udp.port == 53`                                       | Gói UDP trên cổng 53 (DNS)                           |
| **Giao thức cụ thể**   | `http`                                                 | Mọi gói HTTP                                         |
|                        | `dns`                                                  | Mọi gói DNS                                          |
|                        | `ssh`                                                  | Mọi gói SSH                                          |
|                        | `smtp \|\| pop`                                        | Gói SMTP hoặc POP                                    |
| **Tìm nội dung**       | `frame contains "passwd"`                              | Gói chứa chuỗi “passwd”                              |
|                        | `http.request.uri contains "login"`                    | HTTP requests với URI chứa “login”                   |
|                        | `data.text contains "Authorization:"`                  | Gói chứa header HTTP Authorization                   |
| **TCP Flags & Flow**   | `tcp.flags.syn == 1 && tcp.flags.ack == 0`             | SYN packets (bắt đầu handshake)                      |
|                        | `tcp.flags.fin == 1`                                   | FIN packets (kết thúc kết nối)                       |
|                        | `tcp.analysis.retransmission`                          | Gói tái truyền TCP                                   |
| **Follow Stream**      | (filter bất kỳ) → **Click gói** → Follow → TCP Stream  | Xem toàn bộ nội dung phiên TCP                       |
|                        | (filter bất kỳ) → **Click gói** → Follow → HTTP Stream | Xem toàn bộ HTTP request/response                    |
| **Endpoints & Conv.**  | `Statistics → Endpoints`                               | Liệt kê các IP endpoints                             |
|                        | `Statistics → Conversations`                           | Liệt kê các kết nối giữa cặp endpoints               |
| **Protocol Hierarchy** | `Statistics → Protocol Hierarchy`                      | Thống kê lưu lượng theo từng giao thức               |
| **Flow Graph**         | `Statistics → Flow Graph`                              | Biểu đồ trình tự các gói/tương tác                   |
| **Export Objects**     | `File → Export Objects → HTTP`                         | Trích xuất file qua HTTP                             |
|                        | `File → Export Objects → SMB`                          | Trích xuất file qua SMB                              |
| **Mẹo tô màu**         | `View → Coloring Rules → Edit`                         | Đặt màu cho DNS, HTTP POST, TCP SYN… để dễ nhận diện |
