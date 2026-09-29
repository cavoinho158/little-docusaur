---
title: "Connect and Protect: Networks and Network Security - Week 1"
sidebar_position: 10
---

Hello mọi người sau gần 1 tuần lặn mất tiêu :b từ tuần rồi tới giờ tôi và cậu ấy chuẩn bị cho việc vào học kỳ mới nên phải đi mua đồ này kia, khám bệnh bla bla... thành ra tới hôm qua mới bắt đầu học lại. Nhưng mà bài này dài quá nên tới nay mới học xong, và giờ này tôi và cậu ấy mới soạn xong để lên bài, ehe :3 Bài này dài nên mọi người tham khảo nội dung trước, xem cái nào biết rồi thì bỏ qua để đỡ tốn thời gian nha.

## 🌐 Thành phần mạng, thiết bị và sơ đồ mạng

### 🔗 Thiết bị mạng

Các thiết bị mạng chịu trách nhiệm duy trì thông tin và dịch vụ cho người dùng. Chúng kết nối thông qua mạng có dây hoặc không dây và trao đổi dữ liệu qua **gói tin (packet)**.

#### 💻 **Thiết bị người dùng**

- Máy tính để bàn, laptop, điện thoại di động, máy tính bảng...
- Mỗi thiết bị có một địa chỉ **MAC** và **IP** duy nhất để nhận diện trên mạng.
- Kết nối thông qua mạng có dây hoặc Wi-Fi.

#### 🔥 **Tường lửa (Firewall)**

- Bảo vệ mạng bằng cách **giám sát và kiểm soát lưu lượng** vào/ra.
- Cấu hình theo **quy tắc bảo mật** của tổ chức.
- Thường được đặt giữa mạng nội bộ và internet.

#### 🖥 **Máy chủ (Servers)**

- Cung cấp thông tin và dịch vụ cho thiết bị khách (**client-server model**).
- Các loại máy chủ phổ biến:
  - **DNS Server:** Chuyển đổi tên miền thành địa chỉ IP.
  - **File Server:** Lưu trữ và quản lý dữ liệu.
  - **Mail Server:** Xử lý email nội bộ.

#### 🔄 **Hubs và Switches**

| 🔧 **Thiết bị** | 📌 **Chức năng**                                                                                      |
| --------------- | ----------------------------------------------------------------------------------------------------- |
| **Hub**         | Kết nối nhiều thiết bị trong mạng nội bộ, nhưng gửi dữ liệu đến tất cả các thiết bị, gây kém bảo mật. |
| **Switch**      | Phân phối gói tin đến đúng thiết bị dựa vào địa chỉ MAC, cải thiện hiệu suất và bảo mật.              |

#### 🚦 **Router và Modem**

| 📌 **Thiết bị** | 🔍 **Chức năng**                                                    |
| --------------- | ------------------------------------------------------------------- |
| **Router**      | Kết nối các mạng khác nhau, định hướng gói tin dựa trên địa chỉ IP. |
| **Modem**       | Kết nối mạng nội bộ với nhà cung cấp dịch vụ internet (ISP).        |

![image 1](<./img/course3-mod1(2).png>)

#### 📡 **Điểm truy cập không dây (Wireless Access Point)**

- Tạo mạng không dây (Wi-Fi) bằng sóng vô tuyến.
- Cho phép các thiết bị kết nối mạng mà không cần dây cáp.

![image 2](<./img/course3-mod1(3).png>)

### 🗺 Sử dụng sơ đồ mạng trong An ninh Mạng

Sơ đồ mạng là **bản đồ** mô tả cách các thiết bị mạng kết nối với nhau. Chúng giúp **quản trị viên mạng** và **chuyên gia bảo mật** hiểu và tối ưu hóa thiết kế mạng.

- 📌 **Hình dung kiến trúc mạng nội bộ.**
- 🚨 **Xác định điểm yếu bảo mật tiềm ẩn.**
- 🔍 **Cải thiện chiến lược bảo vệ hệ thống.**

![imgae 3](<./img/course3-mod1(4).png>)

---

## ☁️ Cloud computing và mạng định nghĩa bằng phần mềm

### 💻 Cloud computing là gì?

Cloud computing là việc sử dụng **máy chủ, ứng dụng và dịch vụ mạng từ xa** thay vì phải duy trì cơ sở hạ tầng tại chỗ. Các công ty có thể thuê tài nguyên từ **nhà cung cấp dịch vụ đám mây (CSP - Cloud Service Provider)** và truy cập chúng qua internet.

- 🔹 Các loại dịch vụ đám mây

| Dịch vụ                                | Mô tả                                                                    |
| -------------------------------------- | ------------------------------------------------------------------------ |
| **SaaS (Software as a Service)**       | Phần mềm được cung cấp qua internet mà không cần cài đặt.                |
| **IaaS (Infrastructure as a Service)** | Cung cấp cơ sở hạ tầng ảo như máy chủ, lưu trữ, mạng.                    |
| **PaaS (Platform as a Service)**       | Công cụ cho lập trình viên để phát triển ứng dụng trên nền tảng đám mây. |

![image 4](<./img/course3-mod1(5).png>)

📌 _Ví dụ:_ Google Drive là một dịch vụ SaaS, còn Google Cloud cung cấp IaaS và PaaS.

### 🌍 Môi trường đám mây lai (Hybrid cloud environments)

- **Hybrid cloud:** Kết hợp giữa tài nguyên tại chỗ và dịch vụ từ CSP.
- **Multi-cloud:** Sử dụng nhiều CSP cùng lúc để tăng tính linh hoạt.
- **Lợi ích:** Giảm chi phí, tăng cường kiểm soát tài nguyên mạng.

### 🔧 Mạng định nghĩa bằng phần mềm (SDN)

SDN sử dụng **các thiết bị mạng ảo**, giúp quản lý linh hoạt hơn. CSP cung cấp các công cụ SDN như **switch ảo, router ảo, firewall ảo**, giúp cải thiện **hiệu suất và bảo mật mạng**.

- 🔹 Lợi ích của SDN
  - **Quản lý linh hoạt**: Cấu hình mạng dễ dàng mà không cần thay đổi phần cứng.
  - **Tối ưu hóa bảo mật**: Có thể nhanh chóng triển khai tường lửa (WAF, IDS/IPS).
  - **Tăng cường giám sát**: Cung cấp khả năng giám sát và điều chỉnh lưu lượng theo thời gian thực.

### 🎯 Lợi ích của cloud computing và SDN

| Lợi ích                            | Mô tả                                              |
| ---------------------------------- | -------------------------------------------------- |
| **Độ tin cậy (Reliability)**       | Dịch vụ luôn sẵn sàng với ít gián đoạn.            |
| **Giảm chi phí (Cost)**            | Không cần đầu tư lớn vào cơ sở hạ tầng vật lý.     |
| **Khả năng mở rộng (Scalability)** | Dễ dàng tăng/giảm tài nguyên theo nhu cầu thực tế. |

📌 _Ví dụ:_ Doanh nghiệp có thể nhanh chóng mở rộng máy chủ khi lưu lượng truy cập tăng đột biến mà không cần mua thêm phần cứng.

### 🔗 Thông tin tham khảo

Để tìm hiểu thêm về cloud computing, có thể tham khảo tại: [Google Cloud (GC)](https://cloud.google.com/)

🚀 _Cloud computing và SDN giúp doanh nghiệp cải thiện hiệu suất, giảm chi phí và tăng tính bảo mật!_ 🔐

---

## 🌐 Tìm hiểu về mô hình TCP/IP

### 🔍 Mô hình TCP/IP là gì?

![image 5](<./img/course3-mod1(6).png>)

Mô hình **TCP/IP** có bốn lớp chính:

1. **Network access layer (Lớp truy cập mạng)**
2. **Internet layer (Lớp Internet)**
3. **Transport layer (Lớp vận chuyển)**
4. **Application layer (Lớp ứng dụng)**

Mỗi lớp chịu trách nhiệm cho một phần của quá trình truyền dữ liệu và sử dụng các giao thức khác nhau.

### 🔹 Các lớp của mô hình TCP/IP

#### 1️⃣ Network access layer

Lớp này chịu trách nhiệm **tạo và truyền gói dữ liệu** qua mạng. Các thiết bị vật lý như **hub, modem, cáp mạng** hoạt động tại lớp này.

**Giao thức quan trọng:**

- **ARP (Address Resolution Protocol)**: Ánh xạ địa chỉ IP sang địa chỉ MAC để liên lạc trong mạng nội bộ.

#### 2️⃣ Internet layer

Lớp này đảm bảo **gửi dữ liệu đến đúng đích** bằng cách định tuyến gói dữ liệu.

**Giao thức quan trọng:**

- **IP (Internet Protocol)**: Chịu trách nhiệm định tuyến dữ liệu.
- **ICMP (Internet Control Message Protocol)**: Chia sẻ thông tin lỗi và trạng thái kết nối mạng.

#### 3️⃣ Transport layer

Lớp này chịu trách nhiệm **chuyển dữ liệu giữa hai hệ thống**.

**Giao thức quan trọng:**

- **TCP (Transmission Control Protocol)**: Đảm bảo dữ liệu được truyền **chính xác và đầy đủ**.
- **UDP (User Datagram Protocol)**: Truyền dữ liệu nhanh mà không cần xác nhận, thích hợp cho **streaming video, game online**.

#### 4️⃣ Application layer

Lớp này xác định cách ứng dụng mạng giao tiếp với nhau.

**Giao thức quan trọng:**

- **HTTP (Hypertext Transfer Protocol)**: Truy cập website.
- **SMTP (Simple Mail Transfer Protocol)**: Gửi email.
- **SSH (Secure Shell)**: Kết nối từ xa an toàn.
- **FTP (File Transfer Protocol)**: Truyền tệp tin.
- **DNS (Domain Name System)**: Phân giải tên miền thành địa chỉ IP.

### 🔄 So sánh TCP/IP và OSI

![image 6](<./img/course3-mod1(7).png>)

| **Tiêu chí**        | **Mô hình TCP/IP**                                     | **Mô hình OSI**                     |
| ------------------- | ------------------------------------------------------ | ----------------------------------- |
| **Số lớp**          | 4 lớp                                                  | 7 lớp                               |
| **Đơn giản hóa**    | Tổng hợp nhiều lớp OSI thành ít lớp hơn                | Chi tiết hơn về từng chức năng      |
| **Sử dụng thực tế** | Được sử dụng rộng rãi trong các hệ thống mạng hiện đại | Chủ yếu dùng để tham khảo lý thuyết |

📌 _Cả hai mô hình giúp chuyên gia mạng hiểu và chuẩn đoán sự cố hệ thống hiệu quả hơn._

---

## Mô hình OSI và vai trò trong mạng máy tính

![image 6](<./img/course3-mod1(8).png>)

### 🔍 7 tầng của mô hình OSI

#### 1️⃣ **Tầng vật lý (Physical Layer)**

- Quản lý **phần cứng mạng** như dây cáp, bộ hub, modem.
- Dữ liệu được mã hóa thành các **bit (0s và 1s)** để truyền đi.

#### 2️⃣ **Tầng liên kết dữ liệu (Data Link Layer)**

- Quản lý **giao tiếp trong cùng một mạng nội bộ**.
- Sử dụng địa chỉ **MAC** để truyền dữ liệu.
- Các thiết bị liên quan: **Switch, NIC (card mạng)**.

#### 3️⃣ **Tầng mạng (Network Layer)**

- Định tuyến gói tin giữa **các mạng khác nhau**.
- Sử dụng địa chỉ **IP** để xác định đích đến.
- Các giao thức phổ biến: **IP, ICMP**.

#### 4️⃣ **Tầng vận chuyển (Transport Layer)**

- Chia nhỏ dữ liệu thành các **segment** để truyền đi.
- Đảm bảo dữ liệu đến đúng đích và không bị lỗi.
- Hai giao thức quan trọng:
  - **TCP** (đảm bảo truyền dữ liệu đầy đủ, có kiểm tra lỗi).
  - **UDP** (truyền nhanh, không kiểm tra lỗi).

#### 5️⃣ **Tầng phiên (Session Layer)**

- Thiết lập, duy trì và kết thúc **phiên kết nối** giữa các thiết bị.
- Hỗ trợ phục hồi kết nối nếu bị gián đoạn.

#### 6️⃣ **Tầng trình bày (Presentation Layer)**

- **Mã hóa, nén, giải mã** dữ liệu.
- Các giao thức bảo mật như **SSL/TLS** hoạt động ở tầng này.

#### 7️⃣ **Tầng ứng dụng (Application Layer)**

- Là tầng giao tiếp giữa **người dùng và mạng**.
- Các giao thức phổ biến:
  - **HTTP/HTTPS** (truy cập web).
  - **SMTP** (gửi email).
  - **FTP** (truyền tải file).

### 🔑 Kết luận

- **Mô hình OSI giúp chuẩn hóa quá trình truyền dữ liệu**, giúp các chuyên gia mạng dễ dàng xác định lỗi.
- **Mô hình TCP/IP đơn giản hóa các tầng**, được sử dụng phổ biến trên Internet.
- **Bảo mật mạng** cần dựa trên cả hai mô hình để xác định lỗ hổng và bảo vệ dữ liệu.

---

## Tầng mạng trong mô hình OSI và giao tiếp IP

### 🌐 Tầng mạng trong mô hình OSI

Tầng mạng (**Layer 3**) chịu trách nhiệm tổ chức **xác định địa chỉ** và **gửi dữ liệu** đến đúng đích. Nó sử dụng địa chỉ **IP** để điều hướng các gói dữ liệu qua các bộ định tuyến (**routers**) cho đến khi đến được đích cuối cùng.

📌 **Quá trình gửi dữ liệu trên mạng:**

1. Gói dữ liệu được gán địa chỉ **IP đích**.
2. Router sử dụng bảng định tuyến (**routing tables**) để chuyển gói tin đến mạng đích.
3. Khi đến nơi, thiết bị nhận sẽ giải mã và xử lý dữ liệu.

### 📨 Cấu trúc của gói tin IPv4

![image 7](<./img/course3-mod1(10).png>)

Gói tin **IPv4** bao gồm hai phần chính:

- **Header** (chứa thông tin định tuyến).
- **Data** (chứa nội dung cần truyền).

📝 **Các trường quan trọng trong IPv4 Header:**

![image 8](<./img/course3-mod1(11).png>)

| **Trường**                 | **Mô tả**                                                          |
| -------------------------- | ------------------------------------------------------------------ |
| **Version (VER)**          | Xác định giao thức sử dụng (IPv4).                                 |
| **Source IP Address**      | Địa chỉ IP của thiết bị gửi.                                       |
| **Destination IP Address** | Địa chỉ IP của thiết bị nhận.                                      |
| **TTL (Time to Live)**     | Giới hạn số lần gói tin có thể đi qua router trước khi bị loại bỏ. |
| **Protocol**               | Xác định giao thức sử dụng (TCP, UDP, ICMP, v.v.).                 |
| **Header Checksum**        | Kiểm tra lỗi trong quá trình truyền.                               |

### 🔄 Sự khác biệt giữa **IPv4 và IPv6**

Do sự phát triển nhanh chóng của Internet, địa chỉ **IPv4** không còn đủ dùng (**IPv4 address exhaustion**). Để khắc phục điều này, **IPv6** ra đời với số lượng địa chỉ lớn hơn nhiều.

![image 9](<./img/course3-mod1(9).png>)

- **So sánh IPv4 vs IPv6**

| **Tiêu chí**            | **IPv4**                      | **IPv6**                             |
| ----------------------- | ----------------------------- | ------------------------------------ |
| **Độ dài địa chỉ**      | 32-bit (4 số, dấu chấm)       | 128-bit (8 nhóm số, dấu hai chấm)    |
| **Số địa chỉ khả dụng** | ~4.3 tỷ                       | ~340 undecillion (10^36)             |
| **Ví dụ địa chỉ**       | `192.168.1.1`                 | `2002:0db8::ff21:0023:1234`          |
| **Cấu trúc header**     | Phức tạp hơn, có nhiều trường | Đơn giản hơn, hỗ trợ bảo mật tốt hơn |

IPv6 cung cấp bảo mật tốt hơn do hỗ trợ **mã hóa end-to-end**, loại bỏ vấn đề **xung đột địa chỉ riêng tư** và tối ưu hóa **định tuyến dữ liệu**.

🔗 **Xem thêm về mô hình OSI tại**: [OSI model explained](https://www.coursera.org/learn/networks-and-network-security/supplement/YbKL0/the-osi-model-explained)
