---
title: "Connect and Protect: Networks and Network Security - Week 1 (2)"
sidebar_position: 11
---

Chào buổi tối mọi người, bài hôm trước dài quá mọi người có đọc hết chưa? Có chán hay buồn ngủ không? Nếu cảm giác mệt hoặc chán nản thì cứ nghỉ ngơi và thay đổi hoạt động khác nha, tôi và cậu ấy dạo này chạy bộ và tập thể dục đều đặn nên tâm trạng cũng phấn chấn hơn, mặc dù lúc đầu cơ thể hơi ê ẩm. Bài hôm nay và bài tiếp theo cũng sẽ khá là dài, mọi người cùng cố gắng với 2 chúng tôi nha.

## Các giao thức mạng phổ biến và vai trò trong An ninh Mạng

### 🌐 Giao thức mạng là gì?

Giao thức mạng là tập hợp các quy tắc cho phép các thiết bị trên mạng giao tiếp với nhau. Các giao thức này quy định cách **truyền dữ liệu, cấu trúc gói tin, và cách xử lý thông tin** khi nhận dữ liệu.

📌 **3 nhóm chính của giao thức mạng:**

1. **Giao thức truyền thông** (Communication Protocols) – Điều khiển việc gửi và nhận dữ liệu.
2. **Giao thức quản lý** (Management Protocols) – Theo dõi và tối ưu hóa hiệu suất mạng.
3. **Giao thức bảo mật** (Security Protocols) – Bảo vệ dữ liệu khỏi các cuộc tấn công.

### 📡 Nhóm 1: Giao thức truyền thông

Giao thức truyền thông xác định cách dữ liệu được truyền qua mạng. Dưới đây là một số giao thức quan trọng:

| **Giao thức**                           | **Chức năng**                                                                                   | **Tầng TCP/IP** |
| --------------------------------------- | ----------------------------------------------------------------------------------------------- | --------------- |
| **TCP (Transmission Control Protocol)** | Đảm bảo dữ liệu được truyền chính xác giữa hai thiết bị thông qua quá trình **bắt tay 3 bước**. | Transport       |
| **UDP (User Datagram Protocol)**        | Không thiết lập kết nối trước khi gửi dữ liệu, nhanh hơn nhưng ít tin cậy hơn TCP.              | Transport       |
| **HTTP (Hypertext Transfer Protocol)**  | Giao thức cho web, truyền tải dữ liệu trang web.                                                | Application     |
| **DNS (Domain Name System)**            | Chuyển đổi tên miền thành địa chỉ IP để truy cập website.                                       | Application     |

🔹 _Lưu ý_: **HTTP không mã hóa dữ liệu**, nên các trang web hiện đại thường sử dụng **HTTPS** để bảo mật.

### 🛠 Nhóm 2: Giao thức quản lý

Giao thức quản lý được sử dụng để **giám sát, điều chỉnh và chẩn đoán** hoạt động của mạng.

| **Giao thức**                                 | **Chức năng**                                                            | **Tầng TCP/IP** |
| --------------------------------------------- | ------------------------------------------------------------------------ | --------------- |
| **SNMP (Simple Network Management Protocol)** | Quản lý thiết bị mạng, có thể thay đổi cấu hình và giám sát hiệu suất.   | Application     |
| **ICMP (Internet Control Message Protocol)**  | Chẩn đoán lỗi mạng, thường dùng trong lệnh **ping** để kiểm tra kết nối. | Internet        |

🔹 _Ví dụ_: Khi một thiết bị không thể kết nối internet, ta có thể sử dụng **ping** để kiểm tra xem vấn đề nằm ở thiết bị hay mạng.

### 🔐 Nhóm 3: Giao thức bảo mật

Giao thức bảo mật giúp bảo vệ **tính bảo mật, toàn vẹn và tính khả dụng** của dữ liệu trên mạng.

| **Giao thức**                                  | **Chức năng**                                                            | **Tầng TCP/IP** |
| ---------------------------------------------- | ------------------------------------------------------------------------ | --------------- |
| **HTTPS (Hypertext Transfer Protocol Secure)** | Phiên bản bảo mật của HTTP, mã hóa dữ liệu bằng **SSL/TLS**.             | Application     |
| **SFTP (Secure File Transfer Protocol)**       | Chuyển file an toàn bằng **SSH**, thường dùng trong **lưu trữ đám mây**. | Application     |

🔹 _Lưu ý_: **HTTPS và SFTP không ẩn địa chỉ IP của người gửi hoặc nhận**, nên tin tặc vẫn có thể theo dõi thông tin cơ bản về luồng dữ liệu.

---

## Các giao thức mạng bổ sung và vai trò trong an ninh mạng

### 🌐 Network Address Translation (NAT)

NAT là quá trình chuyển đổi **địa chỉ IP private** của các thiết bị trong mạng nội bộ thành **địa chỉ IP public** để có thể giao tiếp với internet. NAT giúp tiết kiệm số lượng IP public và tăng cường bảo mật.

📌 **So sánh địa chỉ IP private và public:**

| **Đặc điểm**    | **Địa chỉ IP private**                    | **Địa chỉ IP public**               |
| --------------- | ----------------------------------------- | ----------------------------------- |
| Được gán bởi    | Router nội bộ                             | Nhà cung cấp dịch vụ internet (ISP) |
| Phạm vi sử dụng | Nội bộ, không truy cập trực tiếp internet | Dùng trên internet                  |
| Chi phí sử dụng | Miễn phí                                  | Có thể mất phí thuê IP              |
| Ví dụ           | 192.168.0.1, 10.0.0.1                     | 8.8.8.8, 142.250.190.14             |

- Dãy địa chỉ IP private:
  - 10.0.0.0-10.255.255.255
  - 172.16.0.0-172.31.255.255
  - 192.168.0.0-192.168.255.255
- Dãy địa chỉ IP public:
  - 1.0.0.0-9.255.255.255
  - 11.0.0.0-126.255.255.255
  - 128.0.0.0-172.15.255.255
  - 172.32.0.0-192.167.255.255
  - 192.169.0.0-233.255.255.255

### 🛠 Dynamic Host Configuration Protocol (DHCP)

DHCP là giao thức quản lý **tự động gán địa chỉ IP** cho các thiết bị trong mạng. DHCP giúp giảm công sức quản lý IP thủ công.

📌 **Cổng mạng:**

- **UDP port 67**: Dành cho DHCP server
- **UDP port 68**: Dành cho DHCP client

### 🔄 Address Resolution Protocol (ARP)

ARP là giao thức giúp **chuyển đổi địa chỉ IP thành địa chỉ MAC**, giúp các thiết bị trong cùng mạng nội bộ có thể giao tiếp với nhau.

📌 **Đặc điểm:**

- Không sử dụng số cổng vì ARP hoạt động ở **tầng liên kết dữ liệu** (Data Link Layer - Layer 2).
- Giữ thông tin trong bộ nhớ đệm ARP cache để tăng tốc độ truy cập.

### 📡 Telnet và Secure Shell (SSH)

#### 📌 **Telnet**

- Giao thức kết nối từ xa **không mã hóa**, dễ bị tấn công nghe lén.
- **Cổng mạng:** TCP **port 23**

#### 🔐 **Secure Shell (SSH)**

- Cung cấp kết nối từ xa **an toàn**, sử dụng mã hóa bảo mật.
- **Cổng mạng:** TCP **port 22**

🛑 _Lưu ý:_ **Telnet không an toàn**, nên luôn ưu tiên sử dụng **SSH** thay thế.

### 📧 Giao thức email

Các giao thức email giúp gửi, nhận và quản lý thư điện tử trên internet.

| **Giao thức** | **Chức năng**                                     | **Cổng (Unencrypted)** | **Cổng (Encrypted)** |
| ------------- | ------------------------------------------------- | ---------------------- | -------------------- |
| **POP3**      | Tải email xuống thiết bị và lưu cục bộ            | TCP/UDP **110**        | TCP/UDP **995**      |
| **IMAP**      | Lưu trữ email trên server, đồng bộ nhiều thiết bị | TCP **143**            | TCP **993**          |
| **SMTP**      | Gửi email từ client đến server                    | TCP/UDP **25**         | TCP/UDP **587**      |

📌 **SMTP thường bị lạm dụng để gửi thư rác (spam),** do đó nhiều nhà cung cấp dịch vụ email chặn **port 25** và yêu cầu sử dụng **port 587** với TLS.

### Tóm tắt

- **NAT giúp tiết kiệm địa chỉ IP public** và tăng cường bảo mật.
- **DHCP tự động gán địa chỉ IP**, giảm công sức quản lý thủ công.
- **ARP giúp ánh xạ IP sang địa chỉ MAC**, hỗ trợ giao tiếp trong mạng nội bộ.
- **SSH an toàn hơn Telnet**, luôn ưu tiên sử dụng SSH khi kết nối từ xa.
- **POP3, IMAP và SMTP quản lý email**, với SMTP đóng vai trò chính trong gửi thư.

---

## Sự phát triển của các giao thức bảo mật Wi-Fi

### 📡 Giới thiệu về giao thức bảo mật Wi-Fi

Wi-Fi là một bộ tiêu chuẩn được xác định bởi **Viện Kỹ sư Điện và Điện tử (IEEE)** với tên gọi **IEEE 802.11**. Các giao thức bảo mật Wi-Fi đã trải qua nhiều cải tiến từ **WEP, WPA, WPA2 đến WPA3**, nhằm giải quyết các lỗ hổng bảo mật và nâng cao khả năng bảo vệ dữ liệu.

### 🔓 Wired Equivalent Privacy (WEP)

**WEP (1999)** là giao thức bảo mật Wi-Fi đầu tiên, được thiết kế nhằm cung cấp mức độ bảo mật tương đương với mạng có dây. Tuy nhiên, WEP có nhiều lỗ hổng bảo mật nghiêm trọng:

- Sử dụng **khóa mã hóa ngắn** và dễ bị giải mã bằng tấn công brute-force.
- Dễ bị **tấn công phát lại (replay attack)** do không có kiểm tra tính toàn vẹn.

📌 _Hiện nay, WEP đã lỗi thời và không nên sử dụng trong bất kỳ mạng Wi-Fi nào._

### 🔐 Wi-Fi Protected Access (WPA)

**WPA (2003)** ra đời để khắc phục các vấn đề của WEP, với các cải tiến như:

- **Temporal Key Integrity Protocol (TKIP):** Cung cấp mã hóa mạnh hơn.
- **Message Integrity Check (MIC):** Giúp phát hiện và ngăn chặn việc sửa đổi dữ liệu trái phép.

Tuy nhiên, WPA vẫn tồn tại lỗ hổng [**KRACK attack**](https://www.krackattacks.com/), cho phép hacker chặn và giải mã dữ liệu truyền qua mạng Wi-Fi. Vì vậy, WPA đã được thay thế bằng WPA2.

### 🔒 WPA2 – Tiêu chuẩn bảo mật Wi-Fi hiện tại

**WPA2 (2004)** mang đến những cải tiến quan trọng:

- **Sử dụng thuật toán mã hóa Advanced Encryption Standard (AES):** Bảo mật mạnh hơn TKIP.
- **Counter Mode Cipher Block Chain Message Authentication Code Protocol (CCMP):** Giúp bảo vệ dữ liệu khỏi các cuộc tấn công chỉnh sửa gói tin.

📌 Mặc dù mạnh hơn WPA, WPA2 vẫn dễ bị **KRACK attack**, điều này dẫn đến sự ra đời của **WPA3**.

### 🏠 WPA2 Personal vs. 🏢 WPA2 Enterprise

- **WPA2 Personal:** Phù hợp cho **mạng gia đình**, sử dụng **một mật khẩu chung** để kết nối tất cả các thiết bị.
- **WPA2 Enterprise:** Phù hợp cho **doanh nghiệp**, sử dụng hệ thống xác thực trung tâm giúp **quản lý người dùng tốt hơn** và **không để lộ khóa mã hóa cá nhân**.

### 🛡️ WPA3 – Chuẩn bảo mật Wi-Fi mới nhất

**WPA3 (2018)** mang đến các cải tiến mạnh mẽ:

- **Bảo vệ chống KRACK attack:** Loại bỏ lỗ hổng xác thực handshake.
- **Simultaneous Authentication of Equals (SAE):** Cải thiện bảo mật mật khẩu, giúp chống lại tấn công brute-force.
- **Mã hóa mạnh hơn:** Sử dụng **128-bit encryption** (Personal) và **192-bit encryption** (Enterprise).

📌 **WPA3** hiện đang dần được triển khai trên các thiết bị Wi-Fi mới, nhưng vẫn chưa được áp dụng rộng rãi.

---

## Subnetting và CIDR: Cách phân chia mạng hiệu quả

### 🌐 Subnetting là gì?

**Subnetting** là quá trình chia nhỏ một mạng thành các nhóm con, gọi là **subnets**. Điều này giúp:  
✅ **Tối ưu hiệu suất mạng** bằng cách giới hạn phạm vi truyền dữ liệu trong từng subnet.  
✅ **Tăng cường bảo mật** bằng cách tạo các khu vực mạng riêng biệt, như **demilitarized zone (DMZ)**, vùng mạng nội bộ và vùng mạng công cộng.  
✅ **Sử dụng địa chỉ IP hiệu quả hơn** thay vì cần yêu cầu thêm IP mới từ nhà cung cấp dịch vụ.

Ví dụ, trong một công ty, các bộ phận như **kế toán, nhân sự, IT** có thể được tách thành các subnet riêng biệt để bảo mật và tối ưu truyền tải dữ liệu.

### 🔢 CIDR: Hệ thống địa chỉ không phân lớp

**CIDR (Classless Inter-Domain Routing)** là phương pháp cấp phát địa chỉ IP giúp thay thế hệ thống địa chỉ IP theo lớp (Classful Addressing). CIDR giúp:

- **Mở rộng số lượng địa chỉ IPv4 khả dụng**, khắc phục tình trạng cạn kiệt địa chỉ.
- **Giảm kích thước bảng định tuyến (routing tables)**, giúp tối ưu việc định tuyến trên internet.
- **Cho phép phân chia mạng linh hoạt hơn**, không bị giới hạn bởi các lớp địa chỉ cố định như Class A, B, C.

### Cách biểu diễn CIDR

CIDR sử dụng địa chỉ IPv4 kèm theo **một số sau dấu "/"**, biểu thị số bit dành cho phần network. Ví dụ:

- **Địa chỉ IPv4 thông thường:** `198.51.100.0`
- **Địa chỉ CIDR:** `198.51.100.0/24`. Trong đó `/24` có nghĩa là **24 bit đầu dành cho phần network**, còn lại **8 bit dành cho host** → Subnet này chứa **256 địa chỉ IP** (`198.51.100.0` đến `198.51.100.255`).

Bạn có thể thử **chuyển đổi CIDR sang IPv4** và ngược lại bằng các công cụ trực tuyến như [IPAddressGuide](https://www.ipaddressguide.com/cidr).

### 🔐 Lợi ích bảo mật của subnetting

🔸 **Giảm thiểu rủi ro tấn công:** Hacker chỉ có thể tiếp cận subnet bị tấn công, không ảnh hưởng đến toàn bộ mạng.  
🔸 **Dễ dàng thiết lập firewall:** Mỗi subnet có thể có **cấu hình tường lửa riêng** để kiểm soát luồng dữ liệu.  
🔸 **Tối ưu quản lý truy cập:** Chỉ cho phép các thiết bị trong cùng subnet giao tiếp trực tiếp, hạn chế truy cập trái phép.

> _Subnetting là một phần quan trọng trong chiến lược bảo mật mạng, giúp tổ chức quản lý tài nguyên tốt hơn và bảo vệ dữ liệu hiệu quả hơn._

---

## Bảo mật mạng với VPN, Proxy, Firewall và SD-WAN

Trong thế giới ngày càng nhiều kết nối, bảo mật mạng là một yếu tố quan trọng để bảo vệ dữ liệu cá nhân và doanh nghiệp. Hãy cùng tìm hiểu về **VPN, Proxy, Firewall, SD-WAN** và cách chúng hoạt động để bảo vệ mạng của bạn khỏi các mối đe dọa tiềm ẩn.

### 🔥 Firewall – Hàng rào bảo vệ mạng

**Firewall** là lớp bảo vệ đầu tiên giúp kiểm soát lưu lượng truy cập vào mạng của bạn. Có hai loại firewall chính:

- **Stateless firewall**: Kiểm tra các gói tin dựa trên quy tắc cố định.
- **Stateful firewall**: Theo dõi trạng thái kết nối và chặn các luồng dữ liệu không mong muốn.

Ngoài ra, **Next-Generation Firewall (NGFWs)** là phiên bản firewall tiên tiến hơn, có khả năng **phân tích gói tin sâu (DPI)** và **ngăn chặn xâm nhập (IPS)**.

### 🛡 Proxy server – Lớp bảo vệ trung gian

**Proxy server** hoạt động như một "người gác cổng", giúp bảo vệ danh tính của người dùng khi truy cập internet. Có hai loại proxy chính:

- **Forward Proxy**: Ẩn địa chỉ IP của người dùng khi truy cập các trang web.
- **Reverse Proxy**: Chặn truy cập trái phép vào hệ thống nội bộ.

📌 _Proxy có thể được cấu hình để lọc nội dung và chặn các trang web độc hại, giúp tăng cường bảo mật._

### 🌍 VPN – Bảo vệ quyền riêng tư trực tuyến

**VPN (Virtual Private Network)** mã hóa dữ liệu và ẩn địa chỉ IP của người dùng khi truy cập internet. VPN sử dụng kỹ thuật **encapsulation** để bảo vệ thông tin khi truyền qua mạng công cộng.

- 🛠 Các loại VPN:
  - **Remote Access VPN**: Kết nối giữa thiết bị cá nhân và máy chủ VPN.
  - **Site-to-Site VPN**: Kết nối nhiều mạng nội bộ với nhau qua internet, thường sử dụng trong doanh nghiệp.

### ⚡ VPN Protocols: WireGuard vs. IPSec

Các giao thức VPN xác định cách dữ liệu được truyền qua đường hầm (tunnel) mã hóa. Hai giao thức phổ biến nhất là **WireGuard** và **IPSec**:

| Giao thức     | Đặc điểm                                                                             |
| ------------- | ------------------------------------------------------------------------------------ |
| **WireGuard** | Nhanh hơn, dễ cấu hình, mã nguồn mở, phù hợp cho truyền tải dữ liệu lớn.             |
| **IPSec**     | Độ bảo mật cao, được sử dụng rộng rãi trong doanh nghiệp, hỗ trợ nhiều hệ điều hành. |

📌 _WireGuard thường được ưu tiên cho cá nhân nhờ tốc độ cao, trong khi IPSec phù hợp với các mạng doanh nghiệp nhờ độ bảo mật mạnh mẽ._

### 🌐 SD-WAN – Tối ưu hóa bảo mật mạng doanh nghiệp

**SD-WAN (Software-Defined Wide Area Network)** là một dịch vụ mạng ảo giúp kết nối các văn phòng chi nhánh với nhau qua internet một cách an toàn và hiệu quả.

🔹 **Ưu điểm của SD-WAN:**  
✅ **Tối ưu hóa lưu lượng mạng** – Tự động điều chỉnh đường truyền để có hiệu suất tốt nhất.  
✅ **Tích hợp bảo mật cao** – Kết hợp với **VPN** để bảo vệ dữ liệu khi truyền qua internet.  
✅ **Giảm chi phí hạ tầng** – Không cần đầu tư quá nhiều vào phần cứng đắt đỏ.
