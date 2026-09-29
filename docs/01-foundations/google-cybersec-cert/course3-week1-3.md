---
title: "Connect and Protect: Networks and Network Security - Week 1 (3)"
sidebar_position: 12
---

Welcome back, it's good to see you again! **(\* ^ ω ^)** Chuyên gia An ninh Mạng thì không thể thiếu kiến thức về Mạng được đúng không nào. Hôm nay cùng xem qua các cuộc tấn công phổ biến diễn ra trên mạng và cách để phòng chống nhé :3 Module này còn có bài luyện tập phân tích và viết báo cáo về sự cố/cuộc tấn công nữa đó, nhưng mà tôi và cậu ấy vẫn chưa soạn xong, nên là khi nào xong sẽ cập nhật cho mọi người nha!

Link ở đây: [Bài thực hành 1](https://www.anphamtrthlittle.id.vn/docs/google-cybersec-cert/course3-mod3-Activity), [Bài thực hành 2](https://www.anphamtrthlittle.id.vn/docs/google-cybersec-cert/course3-mod3-Activity-2)

> _"Nè nè, sao cậu lại muốn trở thành SOC Analyst với Incident Respone vậy (°ε° )?" - Tôi thắc mắc_ \
> _"Nói ra thì dài, nhưng mà ngắn gọn thì có một câu nói thế này:"_

**"The same thing that has drawn me into incident response in tech is what originally drew me to medical response. I really love being there for people on their worst day". - Chris, Chief Information Security Officer for Google Fiber.**

> _"Tôi không đủ khả năng và quyết tâm để trở thành một bác sĩ cứu người. Nhưng tôi vẫn muốn giúp và tôi thích máy tính, kết hợp lại thì tôi muốn giúp đỡ các vấn đề về công nghệ kiểu như Computer & Network. - Cậu ấy trả lời, giọng chắc chắn"_ \
> _"Chà~ nghe ngầu thật đó nha ヽ(° 〇 °)ﾉ. Cố lên nhé!" - Tôi ngạc nhiên_\
> _"N-Ngầu gì chứ ..!? Là, tôi tự cao thôi!" - Cậu ấy ngại ngùng_

## Cách các cuộc tấn công xâm nhập hệ thống và ảnh hưởng đến tổ chức

Mạng máy tính luôn tồn tại những lỗ hổng bảo mật tiềm ẩn, tạo cơ hội cho kẻ tấn công khai thác. Các cuộc tấn công có thể xuất phát từ nhiều động cơ khác nhau, như lợi ích tài chính, chính trị, hay hành động phá hoại từ nội bộ tổ chức. Trong bài viết này, hãy cùng tìm hiểu về **các cuộc tấn công đánh chặn mạng (network interception attacks), tấn công cửa hậu (backdoor attacks)** và hậu quả nghiêm trọng mà chúng có thể gây ra.

### 🕵️ Tấn công đánh chặn mạng (Network Interception Attacks)

Các cuộc tấn công đánh chặn mạng cho phép kẻ tấn công **nghe lén, chỉnh sửa hoặc làm gián đoạn dữ liệu** khi nó đang được truyền tải. Một số kỹ thuật phổ biến bao gồm:

- **Packet Sniffing**: Kẻ tấn công sử dụng công cụ phần cứng hoặc phần mềm để chặn và phân tích các gói tin truyền qua mạng.
- **On-Path Attacks (Man-in-the-Middle - MITM)**: Kẻ tấn công chen vào luồng giao tiếp giữa hai thiết bị và thao túng dữ liệu truyền đi.
- **Replay Attacks**: Kẻ tấn công thu thập dữ liệu hợp lệ và phát lại nó để đánh lừa hệ thống xác thực.

📌 _Ví dụ: Một hacker có thể chặn giao dịch ngân hàng trực tuyến và thay đổi tài khoản nhận tiền thành tài khoản của họ._

### 🚪 Tấn công cửa hậu (Backdoor Attacks)

Tấn công cửa hậu khai thác các lỗ hổng hoặc **Backdoor** được để lại trong hệ thống nhằm bỏ qua các cơ chế kiểm soát truy cập thông thường. Có hai loại backdoor phổ biến:

🔹 **Backdoor hợp pháp**: Do lập trình viên hoặc quản trị viên hệ thống thiết lập để thực hiện bảo trì và khắc phục sự cố.  
🔹 **Backdoor độc hại**: Do hacker cài đặt sau khi xâm nhập vào hệ thống để duy trì quyền truy cập lâu dài.

- Hậu quả của tấn công Backdoor:
  - **Cài đặt malware**: Kẻ tấn công có thể phát tán mã độc vào hệ thống.
  - **Tấn công từ chối dịch vụ (DoS)**: Gây quá tải tài nguyên để làm hệ thống ngừng hoạt động.
  - **Rò rỉ dữ liệu nhạy cảm**: Đánh cắp thông tin cá nhân, tài chính và dữ liệu quan trọng.

### ⚠ Hậu quả của các cuộc tấn công mạng

Các cuộc tấn công có thể gây ra hậu quả nghiêm trọng đối với tổ chức, bao gồm:

1. 💰 Thiệt hại tài chính

   - Doanh nghiệp có thể mất hàng triệu đô la nếu hệ thống bị ngừng hoạt động do tấn công **DoS** hoặc **ransomware**.
   - Chi phí phục hồi hệ thống và thanh toán tiền chuộc (nếu có) có thể rất cao.
   - Công ty có thể đối mặt với kiện tụng từ khách hàng nếu dữ liệu cá nhân bị rò rỉ.

2. 📉 Ảnh hưởng danh tiếng

   - Nếu một công ty bị tấn công mạng, khách hàng có thể mất niềm tin và chuyển sang đối thủ cạnh tranh.
   - Truyền thông tiêu cực có thể làm giảm giá trị thương hiệu.

3. 🏛 Nguy cơ đối với an ninh xã hội

   - Các cuộc tấn công vào cơ sở hạ tầng quan trọng như **lưới điện, hệ thống cấp nước, hoặc hệ thống quân sự** có thể gây nguy hiểm đến tính mạng con người.
   - Các chính phủ đang đầu tư mạnh vào an ninh mạng để bảo vệ quốc gia khỏi các mối đe dọa từ **chiến tranh mạng (cyber warfare).**

### 🛡 Làm thế nào để bảo vệ hệ thống?

Các chuyên gia an ninh mạng cần luôn cảnh giác và thực hiện các biện pháp phòng thủ như:  
✅ **Mã hóa dữ liệu** để bảo vệ thông tin khi truyền qua mạng.  
✅ **Giám sát lưu lượng mạng** để phát hiện các hành vi đáng ngờ.  
✅ **Cập nhật hệ thống thường xuyên** để vá các lỗ hổng bảo mật.  
✅ **Áp dụng chính sách bảo mật nghiêm ngặt** để ngăn chặn truy cập trái phép.

> _An ninh mạng là một cuộc đua liên tục giữa kẻ tấn công và người phòng thủ. Hãy luôn cập nhật kiến thức và công nghệ mới để bảo vệ hệ thống của bạn!_

---

## Giám sát và phân tích lưu lượng mạng với tcpdump

### 📡 tcpdump là gì?

**tcpdump** là một công cụ phân tích lưu lượng mạng dựa trên dòng lệnh, cho phép người dùng **capture** (chụp) và kiểm tra các gói tin đang được truyền trong mạng. Nó phổ biến vì:

- **Nhẹ và hiệu quả**, sử dụng ít bộ nhớ và tài nguyên CPU.
- **Mã nguồn mở**, sử dụng thư viện libpcap để thu thập dữ liệu.
- **Hỗ trợ trên nhiều hệ điều hành**, bao gồm Linux, Unix và macOS.

### 🔍 Thông tin hiển thị trong tcpdump

![tcpdump](<./img/course3-mod3(1).png>)

Một bản ghi tcpdump bao gồm các thông tin sau:

- **Timestamp**: Dấu thời gian của gói tin.
- **Source IP & Source Port**: Địa chỉ IP và cổng nguồn của gói tin.
- **Destination IP & Destination Port**: Địa chỉ IP và cổng đích của gói tin.

### 🔥 Ứng dụng của tcpdump trong bảo mật mạng

Các chuyên gia an ninh mạng sử dụng tcpdump để:  
✅ Xây dựng **cơ sở dữ liệu lưu lượng mạng** để xác định mô hình hoạt động bình thường.  
✅ **Phát hiện tấn công mạng** như DDoS, MITM hoặc quét cổng trái phép.  
✅ **Tạo cảnh báo tùy chỉnh** khi phát hiện bất thường trong lưu lượng mạng.  
✅ **Xác định truy cập trái phép** từ IM hoặc điểm truy cập Wi-Fi không xác thực.

⚠️ _Tuy nhiên, hacker cũng có thể lợi dụng tcpdump để nghe lén dữ liệu, đánh cắp mật khẩu và thông tin nhạy cảm. Do đó, bảo vệ dữ liệu truyền tải là rất quan trọng!_

---

## 🛑 Cuộc tấn công DDoS thực tế năm 2016

[Một trong những cuộc tấn công DDoS lớn nhất lịch sử](https://en.wikipedia.org/wiki/DDoS_attacks_on_Dyn) đã diễn ra vào ngày **21/10/2016**, khi một nhà cung cấp dịch vụ DNS lớn bị nhắm mục tiêu.

### 📌 DNS và vai trò quan trọng của nó

**DNS (Domain Name System)** giúp chuyển đổi tên miền thành địa chỉ IP. Khi người dùng truy cập một trang web, trình duyệt gửi yêu cầu DNS để tìm IP của trang web đó.

### 💥 Cuộc tấn công diễn ra như thế nào?

1️⃣ **Trước cuộc tấn công**

- Một nhóm sinh viên đại học đã tạo ra **một botnet** để tấn công các máy chủ game.
- Chúng công khai mã nguồn botnet, khiến nó rơi vào tay hacker.

2️⃣ **Ngày xảy ra cuộc tấn công**

- Lúc **7:00 sáng**, botnet gửi **hàng chục triệu yêu cầu DNS** tới nhà cung cấp dịch vụ.
- Hệ thống bị quá tải và **sập hoàn toàn**.
- Nhiều trang web lớn tại **Bắc Mỹ và Châu Âu** bị gián đoạn truy cập.

3️⃣ **Hậu quả và biện pháp khắc phục**

- Hệ thống được khôi phục sau **2 giờ ngừng hoạt động**.
- Các đợt tấn công tiếp theo diễn ra nhưng nhà cung cấp dịch vụ đã có phương án bảo vệ.

### 🔒 Bài học rút ra

💡 **DDoS có thể gây tổn thất nghiêm trọng về tài chính và danh tiếng cho tổ chức**. Để bảo vệ hệ thống, các chuyên gia an ninh mạng cần:  
✅ **Xây dựng hạ tầng mạng có thể mở rộng linh hoạt**, tránh bị gián đoạn hoàn toàn.  
✅ **Cấu hình tường lửa và IDS/IPS** để phát hiện và ngăn chặn lưu lượng tấn công.  
✅ **Giám sát lưu lượng mạng với tcpdump và các công cụ phân tích khác** để nhận diện sớm cuộc tấn công.

---

## Tấn công chặn và sửa dữ liệu (sniffing - spoofing): Chiến thuật và cách phòng chống

### 🕵️‍♂️ Packet sniffing là gì?

**Packet sniffing** là kỹ thuật thu thập và phân tích các gói tin truyền qua mạng. Trong điều kiện bình thường, **Network Interface Card (NIC)** trên một thiết bị chỉ chấp nhận các gói tin có địa chỉ MAC khớp với thiết bị đó. Tuy nhiên, khi NIC được đặt ở chế độ **promiscuous mode**, nó sẽ ghi nhận toàn bộ lưu lượng mạng, bất kể địa chỉ MAC đích.

🔹 Kẻ tấn công có thể sử dụng các công cụ như **Wireshark** để thu thập dữ liệu và đánh cắp thông tin như **tên người dùng, mật khẩu, số thẻ tín dụng** hoặc thậm chí toàn bộ nội dung email.

🔐 _Cách phòng chống:_  
✅ Sử dụng **giao thức mã hóa TLS/SSL** để bảo vệ dữ liệu khi truyền qua mạng.  
✅ Cấu hình **switch layer 2** để ngăn chặn promiscuous mode trên NIC.  
✅ Sử dụng **VPN** để mã hóa toàn bộ kết nối mạng.

### 🎭 IP spoofing: Giả mạo địa chỉ IP

Sau khi thu thập được thông tin từ **packet sniffing**, kẻ tấn công có thể thực hiện **IP spoofing** bằng cách giả mạo địa chỉ IP và MAC của một thiết bị hợp lệ. Điều này giúp chúng **vượt qua tường lửa** hoặc giả mạo danh tính để thực hiện các hành vi tấn công.

### ⚔️ Các loại tấn công phổ biến sử dụng IP spoofing

#### 1. On-path attack (MITM)

**On-path attack**, hay còn gọi là **man-in-the-middle (MITM) attack**, xảy ra khi kẻ tấn công **chen vào giữa** cuộc giao tiếp giữa hai thiết bị đáng tin cậy.

Ví dụ, nếu một người dùng gửi yêu cầu **DNS lookup**, hacker có thể chặn và thay đổi phản hồi DNS để điều hướng nạn nhân đến một trang web giả mạo chứa mã độc.

🔐 _Cách phòng chống:_  
✅ Sử dụng **HTTPS** thay vì HTTP để bảo vệ dữ liệu.  
✅ Cấu hình **DNSSEC** để đảm bảo dữ liệu DNS không bị giả mạo.  
✅ Áp dụng **Xác thực nhiều lớp (MFA)** để ngăn chặn tấn công chiếm quyền tài khoản.

#### 2. Smurf attack

**Smurf attack** là một cuộc tấn công từ chối dịch vụ **(DoS - Denial of Service)**, trong đó hacker gửi **một lượng lớn yêu cầu ICMP** đến một địa chỉ IP giả mạo, khiến hệ thống phản hồi quá tải.

🚨 Hệ quả: Toàn bộ máy chủ trên mạng có thể bị đánh sập do quá tải bởi **ICMP echo response**.

🔐 _Cách phòng chống:_  
✅ Cấu hình **tường lửa thế hệ mới (NGFW)** để chặn lưu lượng ICMP bất thường.  
✅ Vô hiệu hóa **ICMP broadcast** trên router.  
✅ Áp dụng **Intrusion Detection System (IDS)** để phát hiện hoạt động đáng ngờ.

#### 3. DoS attack (Denial of Service)

Cuộc tấn công **DoS** ngăn chặn hệ thống hoạt động bình thường bằng cách gửi lượng lớn gói tin giả mạo **từ nhiều địa chỉ IP khác nhau**, khiến máy chủ bị quá tải và ngừng hoạt động.

🔐 _Cách phòng chống:_  
✅ **Triển khai CDN (Content Delivery Network)** để giảm tải.  
✅ Cấu hình **Rate Limiting** để giới hạn số lượng yêu cầu từ một IP trong thời gian ngắn.  
✅ Sử dụng **Cloud-based DDoS protection services** như Cloudflare hoặc AWS Shield.
