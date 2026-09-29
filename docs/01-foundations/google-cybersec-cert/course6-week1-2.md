---
title: "Sound the Alarm: Detection and Response - Week 1 (2)"
sidebar_position: 30
---

## Duy trì nhận thức với giám sát mạng 🛡️🌐

Giám sát mạng là quá trình thu thập và phân tích lưu lượng mạng để phát hiện các hoạt động đáng ngờ. Để bảo vệ mạng hiệu quả, bạn cần hiểu rõ các thành phần mạng và cách thức giám sát chúng. Dưới đây là tóm tắt về tầm quan trọng của giám sát mạng, các phương pháp giám sát, và các công cụ hỗ trợ.

### Hiểu rõ mạng của bạn 🧠

- **Lưu lượng mạng (Network traffic)**: Là lượng dữ liệu di chuyển qua mạng, bao gồm cả loại dữ liệu được truyền (ví dụ: HTTP).
- **Dữ liệu mạng (Network data)**: Là dữ liệu được truyền giữa các thiết bị trên mạng.
- **Baseline (Đường cơ sở)**: Là điểm tham chiếu để so sánh và xác định hành vi bình thường của mạng. Ví dụ: lưu lượng mạng cao nhất thường xảy ra từ 9 giờ sáng đến 5 giờ chiều.

![baseline](<./img/course6-mod2(1).png>)

### Giám sát mạng của bạn 🔍

Giám sát mạng giúp phát hiện các hoạt động bất thường so với baseline. Các thành phần mạng cần giám sát bao gồm:

1. **Phân tích luồng (Flow analysis)**:

   - **Luồng (Flow)**: Là sự di chuyển của các giao tiếp mạng, bao gồm thông tin về gói tin, giao thức và cổng.
   - **Ví dụ**: Cổng 443 thường được sử dụng bởi HTTPS, nhưng kẻ tấn công có thể sử dụng cổng 8088 để duy trì kết nối với hệ thống bị xâm nhập.

2. **Thông tin tải trọng gói tin (Packet payload information)**:

   - **Tải trọng (Payload)**: Là dữ liệu thực tế được truyền trong gói tin.
   - **Ví dụ**: Giám sát tải trọng giúp phát hiện các hoạt động bất thường như rò rỉ dữ liệu nhạy cảm ra khỏi mạng.

3. **Mẫu thời gian (Temporal patterns)**:
   - **Thông tin thời gian**: Giúp xác định các mẫu thời gian bình thường của lưu lượng mạng.
   - **Ví dụ**: Lưu lượng mạng cao bất thường ngoài giờ làm việc có thể là dấu hiệu của một cuộc tấn công.

### Bảo vệ mạng của bạn 🛡️

- **SOC (Security Operations Center)**: Tập trung vào phát hiện và phản hồi các mối đe dọa bảo mật.
- **NOC (Network Operations Center)**: Tập trung vào duy trì hiệu suất và khả năng hoạt động của mạng.
- **Các công cụ giám sát mạng**:
  - **Hệ thống phát hiện xâm nhập (IDS)**: Giám sát hoạt động hệ thống và cảnh báo về các xâm nhập tiềm ẩn.
  - **Phân tích giao thức mạng (Network protocol analyzers)**: Công cụ như **tcpdump** và **Wireshark** giúp ghi lại và phân tích giao tiếp mạng thông qua việc bắt gói tin (packet capture).

### Kết luận 📌

- **Giám sát mạng** là nhiệm vụ quan trọng để phát hiện và ngăn chặn các cuộc tấn công mạng.
- **Baseline** giúp xác định hành vi bình thường của mạng, từ đó phát hiện các hoạt động bất thường.
- Các công cụ như **IDS** và **Wireshark** hỗ trợ hiệu quả trong việc giám sát và phân tích lưu lượng mạng.

### Tài nguyên tham khảo 📚

- [Network traffic - MITRE ATT&CK®](https://attack.mitre.org/datasources/DS0029/)
- [Data exfiltration techniques - MITRE ATT&CK®](https://attack.mitre.org/tactics/TA0010/)

---

## Bắt gói tin (Packet Captures)

### Gói tin (Packets)

Mọi dữ liệu truyền qua mạng đều được chia nhỏ thành **gói tin** (packets). Trong bảo mật mạng, phân tích gói tin giúp phát hiện các hoạt động bất thường.

📌 **Cấu trúc gói tin:**

- **Header:** Chứa thông tin như địa chỉ IP nguồn/đích, độ dài gói tin, giao thức…
- **Payload:** Chứa dữ liệu thực sự (ví dụ: nội dung email, hình ảnh).
- **Footer:** (hoặc Trailer) thường dùng để kiểm tra lỗi trong giao thức Ethernet.

![packet structure](<./img/course6-mod2(2).png>)

### Công cụ phân tích giao thức mạng (Network Protocol Analyzers)

Các công cụ như **tcpdump, Wireshark, TShark** được dùng để **bắt và phân tích gói tin**, hỗ trợ:  
✔️ **Giám sát mạng** và phát hiện xâm nhập.  
✔️ **Thu thập số liệu mạng** như băng thông, tốc độ truyền tải.  
✔️ **Khắc phục sự cố** hiệu suất mạng.

🚨 **Lưu ý:** Hacker có thể dùng các công cụ này để **đánh cắp dữ liệu nhạy cảm** như tài khoản đăng nhập.

🔗 **Tham khảo:** [Packet Crafting](https://resources.infosecinstitute.com/topic/packet-crafting-a-serious-crime/)

### Cách hoạt động của công cụ phân tích gói tin

- Dữ liệu được thu thập từ **Network Interface Card (NIC)**.
- NIC phải ở chế độ **promiscuous mode** hoặc **monitor mode** để bắt được tất cả các gói tin.
- Dữ liệu thu được ở dạng **nhị phân (0s và 1s)**, sau đó được công cụ chuyển đổi thành định dạng dễ đọc.

⚠️ **Cảnh báo:** Bật **promiscuous mode** có thể khiến thiết bị dễ bị tấn công!

### Bắt gói tin (Packet Capturing)

Bắt gói tin (packet sniffing) là quá trình thu thập dữ liệu mạng để phân tích. File **p-cap** chứa dữ liệu gói tin có thể mở bằng Wireshark để kiểm tra thông tin.

📌 **Các định dạng p-cap phổ biến:**

- **Libpcap** (Linux, macOS) – Dùng trong tcpdump.
- **WinPcap** (Windows) – Định dạng cũ, ít dùng.
- **Npcap** (Windows) – Dùng cho Nmap.
- **PCAPng** – Định dạng mới, có thể lưu dữ liệu song song với bắt gói tin.

🛠 **Pro Tip:** Bạn có thể thực hành phân tích gói tin bằng cách kiểm tra mạng nội bộ tại nhà.

### Kết luận

Công cụ phân tích gói tin là **công cụ quan trọng** giúp bảo mật mạng và phát hiện tấn công. Là một nhà phân tích bảo mật, bạn sẽ sử dụng các công cụ này để **kiểm tra gói tin, phân tích luồng dữ liệu và bảo vệ hệ thống khỏi các xâm nhập trái phép**. 🚀

---

## Giao thức Internet (IP) 🌐

Gói tin (packet) là nền tảng của việc trao đổi dữ liệu qua mạng. Giao thức Internet (IP) bao gồm một tập hợp các tiêu chuẩn để định tuyến và định địa chỉ các gói tin khi chúng di chuyển giữa các thiết bị trong mạng. IP hoạt động như nền tảng cho tất cả các giao tiếp qua internet.

### IPv4 🖥️

IPv4 là phiên bản IP được sử dụng phổ biến nhất. Header của IPv4 bao gồm 13 trường:

- **Version**: Chỉ định phiên bản IP (IPv4).
- **Internet Header Length (IHL)**: Độ dài của header IPv4.
- **Type of Service (ToS)**: Thông tin về độ ưu tiên của gói tin.
- **Total Length**: Tổng độ dài của gói tin.
- **Identification**: Định danh duy nhất cho các phân mảnh của gói tin.
- **Flags**: Thông tin về việc phân mảnh gói tin.
- **Fragment Offset**: Xác định thứ tự của các phân mảnh.
- **Time to Live (TTL)**: Giới hạn thời gian gói tin có thể lưu thông trong mạng.
- **Protocol**: Giao thức được sử dụng cho phần dữ liệu của gói tin.
- **Header Checksum**: Giá trị checksum để kiểm tra lỗi header.
- **Source Address**: Địa chỉ nguồn của gói tin.
- **Destination Address**: Địa chỉ đích của gói tin.
- **Options**: Các tùy chọn bảo mật (không bắt buộc).

![Một header IPv4 với 13 trường.](<./img/course6-mod2(3).png>)

### IPv6 🖥️

IPv6 ngày càng được sử dụng rộng rãi nhờ không gian địa chỉ lớn. Header của IPv6 bao gồm 8 trường:

- **Version**: Chỉ định phiên bản IP (IPv6).
- **Traffic Class**: Thông tin về độ ưu tiên của gói tin.
- **Flow Label**: Định danh các gói tin trong một luồng.
- **Payload Length**: Độ dài của phần dữ liệu.
- **Next Header**: Loại header tiếp theo sau IPv6.
- **Hop Limit**: Giới hạn số lần gói tin có thể được chuyển tiếp.
- **Source Address**: Địa chỉ nguồn của gói tin.
- **Destination Address**: Địa chỉ đích của gói tin.

![Một header IPv6 với 8 trường.](<./img/course6-mod2(4).png>)

## Wireshark: Công cụ phân tích gói tin 🛠️

Wireshark là một công cụ phân tích giao thức mạng mã nguồn mở. Nó sử dụng giao diện đồ họa (GUI) giúp việc phân tích gói tin trở nên trực quan hơn.

### Bộ lọc hiển thị (Display Filters) 🔍

Wireshark cho phép bạn áp dụng các bộ lọc để tìm kiếm thông tin cụ thể trong các file bắt gói tin. Bạn có thể lọc gói tin dựa trên giao thức, địa chỉ IP, cổng, và nhiều thuộc tính khác.

#### Các toán tử so sánh 🧮

Bạn có thể sử dụng các toán tử so sánh để tìm kiếm các trường và giá trị cụ thể trong header. Ví dụ:

- **ip.src == 8.8.8.8** hoặc **ip.src eq 8.8.8.8** để lọc các gói tin có địa chỉ nguồn là 8.8.8.8.

Các toán tử so sánh phổ biến:

| Toán tử           | Ký hiệu | Viết tắt |
| :---------------- | :------ | :------- |
| Bằng              | `==`    | eq       |
| Không bằng        | `!=`    | ne       |
| Lớn hơn           | `>`     | gt       |
| Nhỏ hơn           | `<`     | lt       |
| Lớn hơn hoặc bằng | `>=`    | ge       |
| Nhỏ hơn hoặc bằng | `<=`    | le       |

#### Toán tử "contains" và "matches" 🔎

- **contains**: Lọc các gói tin chứa chuỗi văn bản cụ thể. Ví dụ: **http contains "moved"**.
- **matches**: Lọc các gói tin dựa trên biểu thức chính quy (regex).

### Lọc theo giao thức, địa chỉ IP, và cổng 🌐

- **Lọc theo giao thức**: Nhập tên giao thức vào thanh lọc. Ví dụ: **dns**, **http**, **ftp**.
- **Lọc theo địa chỉ IP**: Sử dụng **ip.addr**, **ip.src**, hoặc **ip.dst**. Ví dụ: **ip.addr == 172.21.224.2**.
- **Lọc theo địa chỉ MAC**: Sử dụng **eth.addr**. Ví dụ: **eth.addr == 00:70:f4:23:18:c4**.
- **Lọc theo cổng**: Sử dụng **udp.port** hoặc **tcp.port**. Ví dụ: **udp.port == 53**.

### Theo dõi luồng (Follow Streams) 🔄

Wireshark cho phép bạn theo dõi các luồng dữ liệu giữa các thiết bị sử dụng một giao thức cụ thể. Ví dụ, bạn có thể xem chi tiết cuộc trò chuyện HTTP để hiểu rõ hơn về các yêu cầu và phản hồi.

![Hộp thoại Follow Stream trong Wireshark hiển thị nội dung của một cuộc trò chuyện HTTP.](<./img/course6-mod2(5).png>)

## Tóm tắt 📌

- **IPv4 và IPv6** là hai phiên bản IP phổ biến, mỗi phiên bản có cấu trúc header riêng.
- **Wireshark** là công cụ mạnh mẽ để phân tích gói tin, với các tính năng lọc và theo dõi luồng dữ liệu.
- **Bộ lọc hiển thị** giúp bạn tìm kiếm thông tin cụ thể trong các file bắt gói tin.

Tham khảo thêm:

- [Hướng dẫn sử dụng Wireshark chính thức](https://www.wireshark.org/docs/wsug_html/)

---

## Overview of tcpdump - Network Protocol Analyzer

## Tcpdump là gì? 🛠️

**Tcpdump** là một công cụ phân tích giao thức mạng dựa trên dòng lệnh, được sử dụng để bắt và xem các giao tiếp mạng. Công cụ này thường được cài đặt sẵn trên nhiều bản phân phối Linux và có thể được cài đặt trên các hệ điều hành Unix khác như macOS®.

- **Packet Capture (p-cap)**: Tcpdump có thể lưu lưu lượng mạng vào một file p-cap, giúp bạn phân tích hoặc chia sẻ dữ liệu sau này.
- **Mục đích sử dụng**: Từ khắc phục sự cố mạng đến phát hiện hoạt động độc hại, tcpdump là công cụ đa năng cho các nhà phân tích bảo mật.

### Lưu ý

- Lưu lượng mạng thường được mã hóa, vì vậy việc giải mã dữ liệu có thể cần thiết để phân tích chi tiết.

## Bắt gói tin với tcpdump 📦

Để sử dụng tcpdump, bạn cần có quyền quản trị viên (root hoặc sử dụng `sudo`). Cú pháp cơ bản để bắt gói tin với tcpdump như sau:

```bash
sudo tcpdump [-i interface] [option(s)] [expression(s)]
```

- **-i**: Chỉ định giao diện mạng để bắt gói tin. Ví dụ: `-i any` để bắt lưu lượng từ tất cả các giao diện mạng.
- **option(s)**: Các tùy chọn để thay đổi cách thực thi lệnh.
- **expression(s)**: Biểu thức lọc để cách ly lưu lượng mạng cụ thể.

### Các tùy chọn phổ biến 🛠️

1. **-w**: Lưu gói tin bắt được vào file p-cap. Ví dụ:

   ```bash
   sudo tcpdump -i any -w packetcapture.pcap
   ```

2. **-r**: Đọc file p-cap đã lưu. Ví dụ:

   ```bash
   sudo tcpdump -r packetcapture.pcap
   ```

3. **-v**: Hiển thị thông tin chi tiết về gói tin. Có ba mức độ chi tiết: `-v`, `-vv`, và `-vvv`. Ví dụ:

   ```bash
   sudo tcpdump -r packetcapture.pcap -v
   ```

4. **-c**: Giới hạn số lượng gói tin bắt được. Ví dụ:

   ```bash
   sudo tcpdump -i any -c 3
   ```

5. **-n**: Tắt chức năng phân giải tên (name resolution) để tránh hiển thị sai thông tin. Ví dụ:

   ```bash
   sudo tcpdump -r packetcapture.pcap -v -n
   ```

### Biểu thức lọc (Filter Expressions) 🔍

Bạn có thể sử dụng các biểu thức lọc để cách ly các gói tin cụ thể. Ví dụ:

- **Lọc theo giao thức**: `ip6` để lọc lưu lượng IPv6.
- **Kết hợp các biểu thức**: Sử dụng các toán tử boolean như `and`, `or`, `not`. Ví dụ:

  ```bash
  sudo tcpdump -r packetcapture.pcap -n 'ip and port 80'
  ```

### Giải thích đầu ra 📄

Khi chạy lệnh tcpdump, đầu ra sẽ hiển thị thông tin về các gói tin bắt được. Mỗi dòng bắt đầu bằng **timestamp**, sau đó là thông tin về địa chỉ IP nguồn, cổng nguồn, địa chỉ IP đích, và cổng đích.

Ví dụ:

```bash
sudo tcpdump -i any -v -c 1
```

Đầu ra sẽ hiển thị:

- **Timestamp**: Thời gian bắt gói tin.
- **Source IP**: Địa chỉ IP nguồn.
- **Source Port**: Cổng nguồn.
- **Destination IP**: Địa chỉ IP đích.
- **Destination Port**: Cổng đích.

## Tóm tắt 📌

- **Tcpdump** là công cụ mạnh mẽ để bắt và phân tích lưu lượng mạng từ dòng lệnh.
- Các tùy chọn như `-w`, `-r`, `-v`, `-c`, và `-n` giúp bạn kiểm soát cách bắt và hiển thị gói tin.
- **Biểu thức lọc** cho phép bạn cách ly các gói tin cụ thể dựa trên giao thức, địa chỉ IP, cổng, và nhiều tiêu chí khác.

Tham khảo thêm:

- [Hướng dẫn sử dụng tcpdump](https://www.tcpdump.org/)
- [Tutorial về tcpdump của Daniel Miessler](https://danielmiessler.com/p/tcpdump/)
