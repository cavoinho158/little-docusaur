---
title: "Connect and Protect: Networks and Network Security - Week 2"
sidebar_position: 15
---

Konichiwa ~ `＼(≧▽≦)／` Mọi người đoán xem tôi là ai nào? Đúng rồi, là tôi đó! Ehehe ~ `(/ />/ ▽ /</ /)`

Mấy nay bận học trên trường nên tôi và cậu ấy không học khóa học của Google cũng như thực hành trên CyberDefender được. (╥﹏╥) Ngoài ra thì, nội dung của Course 3 này dài quá đi mất, hic `( ; ω ; )`
Vì có nhìu hoạt động thực tế/thực hành để làm quen với công việc Incident Response và Cybersecurity Analyst nên cũng phải ráng hoi. Cũng như lần trước, tóm tắt các bài thực hành tôi và cậu ấy sẽ để bên dưới, mọi người nên xem qua để hiểu rõ hơn về quá trình làm việc thực tế nha. `(✿◕‿◕)`
Và cám ơn mọi người vì vẫn còn theo dõi những bài blog này. `(^^*)♡`

Link các bài thực hành: [Bài thực hành 1](https://www.anphamtrthlittle.id.vn/docs/google-cybersec-cert/course3-mod3-Activity-3), [bài thực hành 2](https://www.anphamtrthlittle.id.vn/docs/google-cybersec-cert/course3-mod3-Activity-4), [bài thực hành 3](https://www.anphamtrthlittle.id.vn/docs/google-cybersec-cert/course3-mod3-Activity-5)

## Brute Force Attacks và cách phòng chống

Brute Force Attack là một phương pháp tấn công mạng phổ biến, trong đó kẻ tấn công sử dụng phương pháp thử-sai để đoán mật khẩu hoặc thông tin đăng nhập. Bài viết này sẽ giúp bạn hiểu rõ hơn về các loại tấn công Brute Force, cách đánh giá lỗ hổng bảo mật, và các biện pháp phòng chống hiệu quả.

### Các loại Brute Force Attacks

1. **Simple Brute Force Attack**: Kẻ tấn công thử các tổ hợp username và password ngẫu nhiên cho đến khi tìm được thông tin đúng.
2. **Dictionary Attack**: Sử dụng danh sách các mật khẩu phổ biến hoặc đã bị rò rỉ từ các vụ vi phạm dữ liệu trước đó.

### Đánh giá lỗ hổng bảo mật

Trước khi xảy ra sự cố, các tổ chức có thể sử dụng **máy ảo (Virtual Machines - VMs)** và **môi trường sandbox** để kiểm tra các tệp đáng ngờ hoặc mô phỏng các tình huống tấn công.

- **Máy ảo (VMs)**: Là phiên bản phần mềm của máy tính vật lý, giúp cách ly mã độc khỏi hệ thống chính. Tuy nhiên, vẫn có rủi ro nhỏ là mã độc có thể thoát khỏi môi trường ảo hóa.
- **Sandbox**: Môi trường thử nghiệm tách biệt với mạng chính, thường được sử dụng để kiểm tra phần mềm, vá lỗi, hoặc phát hiện lỗ hổng bảo mật.

### Biện pháp phòng chống

1. **Salting và Hashing**:
   - **Hashing**: Chuyển đổi thông tin thành một giá trị duy nhất, không thể giải mã ngược.
   - **Salting**: Thêm các ký tự ngẫu nhiên vào mật khẩu đã băm, tăng độ phức tạp và bảo mật.
2. **Xác thực đa yếu tố (MFA) và Xác thực hai yếu tố (2FA)**:

   - Yêu cầu người dùng xác minh danh tính bằng nhiều phương thức như mật khẩu, vân tay, hoặc mã OTP.

3. **CAPTCHA và reCAPTCHA**:

   - Giúp phân biệt người dùng thật với phần mềm tự động, ngăn chặn các nỗ lực Brute Force.

4. **Chính sách mật khẩu**:
   - Quy định về độ phức tạp của mật khẩu, tần suất thay đổi, và giới hạn số lần đăng nhập sai.

### Kết luận

Brute Force Attack là một mối đe dọa nghiêm trọng, nhưng có thể được ngăn chặn hiệu quả thông qua các biện pháp như sử dụng máy ảo, sandbox, hashing, MFA, và CAPTCHA. Việc áp dụng các chính sách mật khẩu mạnh mẽ cũng là yếu tố quan trọng trong việc bảo vệ hệ thống.

---

## Các ứng dụng bảo mật mạng

Bảo mật mạng là một quá trình liên tục, trong đó các thiết bị, công cụ và chiến lược được triển khai để bảo vệ mạng khỏi các mối đe dọa. Phương pháp **Defense in Depth** (bảo vệ theo lớp) được sử dụng để tăng cường bảo mật bằng cách thêm nhiều lớp phòng thủ. Bài viết này sẽ giới thiệu về các thiết bị và công cụ quan trọng như **firewall**, **hệ thống phát hiện xâm nhập (IDS)**, **hệ thống ngăn chặn xâm nhập (IPS)**, và **công cụ quản lý sự kiện và thông tin bảo mật (SIEM)**.

### Các thiết bị và công cụ bảo mật

![fw-ids-ips](<./img/course3-mod4(1).png>)

1. **Firewall**

   - **Chức năng**: Firewall cho phép hoặc chặn lưu lượng truy cập dựa trên các quy tắc được thiết lập. Nó kiểm tra tiêu đề gói tin và quyết định dựa trên số cổng.
   - **Ưu điểm**:
     - Lớp phòng thủ đầu tiên, ngăn chặn lưu lượng không mong muốn.
     - **Next-Generation Firewalls (NGFW)** có thể kiểm tra cả nội dung gói tin.
   - **Nhược điểm**: Chỉ có thể lọc gói tin dựa trên thông tin trong tiêu đề.

2. **Hệ Thống Phát Hiện Xâm Nhập (IDS)**

   - **Chức năng**: IDS giám sát hoạt động mạng và cảnh báo khi phát hiện các dấu hiệu xâm nhập hoặc tấn công.
   - **Ưu điểm**:
     - Phát hiện các cuộc tấn công đã biết hoặc các bất thường trong lưu lượng mạng.
     - Đặt sau firewall để giảm thiểu cảnh báo sai (false positives).
   - **Nhược điểm**:
     - Chỉ phát hiện các cuộc tấn công đã biết hoặc bất thường rõ ràng.
     - Không tự động ngăn chặn lưu lượng xấu.

3. **Hệ Thống Ngăn Chặn Xâm Nhập (IPS)**

   - **Chức năng**: IPS không chỉ phát hiện mà còn tự động ngăn chặn các hoạt động xâm nhập.
   - **Ưu điểm**:
     - Ngăn chặn lưu lượng xấu trước khi nó đến các phần nhạy cảm của mạng.
     - Đặt sau firewall để tăng cường bảo mật.
   - **Nhược điểm**:
     - Nếu IPS bị lỗi, kết nối giữa mạng nội bộ và internet có thể bị gián đoạn.
     - Có thể gặp vấn đề với cảnh báo sai, chặn nhầm lưu lượng hợp lệ.

4. **Công Cụ Quản Lý Sự Kiện và Thông Tin Bảo Mật (SIEM)**

   - **Chức năng**: SIEM thu thập và phân tích dữ liệu nhật ký từ nhiều nguồn (IDS, IPS, firewall, VPN, v.v.) để giám sát hoạt động mạng.
   - **Ưu điểm**:
     - Tổng hợp dữ liệu bảo mật vào một bảng điều khiển trung tâm (single pane of glass).
     - Cung cấp thông tin thời gian thực về các sự kiện đáng ngờ.
   - **Nhược điểm**:
     - Chỉ báo cáo các sự kiện bảo mật, không tự động ngăn chặn.

### Ví dụ về các công cụ SIEM phổ biến

![splunk](<./img/course3-mod4(2).png>)

- [Google Chronicle](https://cloud.google.com/chronicle): Công cụ SIEM dựa trên đám mây, giúp lưu trữ, phân tích và tìm kiếm dữ liệu.
- [Splunk SIEM Tools](https://www.splunk.com/): Cung cấp cả phiên bản Splunk Enterprise và Splunk Cloud với bảng điều khiển chi tiết để phân tích dữ liệu.

### Kết luận

Việc kết hợp các thiết bị và công cụ bảo mật như **firewall**, **IDS**, **IPS**, và **SIEM** giúp tạo ra một hệ thống bảo mật mạng mạnh mẽ. Mỗi lớp phòng thủ đóng vai trò quan trọng trong việc ngăn chặn và phát hiện các mối đe dọa, đảm bảo an toàn cho hệ thống mạng.

---

## Bảo mật đám mây ☁️🔒

Điện toán đám mây (cloud computing) mang lại nhiều lợi ích như triển khai nhanh chóng, tiết kiệm chi phí và khả năng mở rộng. Tuy nhiên, bảo mật đám mây cũng đặt ra những thách thức riêng. Bài viết này sẽ giúp bạn hiểu rõ hơn về các vấn đề bảo mật đám mây, mô hình **trách nhiệm chia sẻ (shared responsibility model)**, và các biện pháp củng cố bảo mật đám mây.

### Các vấn đề bảo mật đám mây cần lưu ý 🛡️

1. Quản lý danh tính và truy cập (IAM - Identity and Access Management) 👤

   - **IAM** là tập hợp các quy trình và công nghệ giúp quản lý danh tính kỹ thuật số trong môi trường đám mây.
   - **Vấn đề**: Cấu hình sai vai trò người dùng có thể dẫn đến việc người dùng trái phép truy cập vào các tài nguyên quan trọng.
   - **Giải pháp**: Cấu hình chính xác vai trò và quyền truy cập để đảm bảo an toàn.

2. Cấu hình đám mây ⚙️

   - Mỗi dịch vụ đám mây cần được cấu hình chính xác để đảm bảo tuân thủ các tiêu chuẩn bảo mật.
   - **Thách thức**: Cấu hình sai là nguyên nhân phổ biến dẫn đến vi phạm bảo mật.
   - **Giải pháp**: Kiểm tra kỹ lưỡng trong quá trình di chuyển và quản lý dịch vụ đám mây.

3. Bề mặt tấn công (Attack surface) 🎯

   - Mỗi dịch vụ đám mây đều mang lại rủi ro và lỗ hổng riêng, làm tăng bề mặt tấn công.
   - **Giải pháp**: Thiết kế mạng đúng cách để giảm thiểu các điểm truy cập không cần thiết.

4. Tấn công zero-day 🕵️

   - **Zero-day attack** là các lỗ hổng chưa được biết đến trước đó.
   - **Lợi thế của CSP**: Các nhà cung cấp dịch vụ đám mây (CSP) thường phát hiện và vá lỗi nhanh hơn so với mạng truyền thống.

5. Khả năng hiển thị và theo dõi 👀
   - **Vấn đề**: Các tổ chức không có quyền truy cập đầy đủ vào lưu lượng mạng trên máy chủ của CSP.
   - **Giải pháp**: Sử dụng các công cụ như **flow logs** và **packet mirroring** để giám sát lưu lượng.

### Mô hình trách nhiệm chung (SRM - Shared Responsibility Model) 🤝

- **CSP** chịu trách nhiệm bảo mật cơ sở hạ tầng đám mây (data center, hypervisor, hệ điều hành máy chủ).
- **Tổ chức sử dụng** chịu trách nhiệm bảo mật tài sản và quy trình của họ trên đám mây.
- **Lưu ý**: Các tổ chức cần đảm bảo cấu hình dịch vụ đám mây đúng cách để tránh rủi ro.

### Các biện pháp củng cố bảo mật đám mây 🛠️

1. Quản lý truy cập danh tính (IAM) 👤

   - Quản lý chặt chẽ quyền truy cập của người dùng và tài nguyên đám mây.

2. Hypervisor 🖥️

   - **Hypervisor** là phần mềm quản lý máy ảo (VM). CSP thường sử dụng **Type 1 Hypervisor** (chạy trực tiếp trên phần cứng).
   - **Lưu ý**: Lỗ hổng trong hypervisor có thể dẫn đến **VM escape**, cho phép kẻ tấn công truy cập vào máy chủ chính.

3. Baselining 📊

   - Thiết lập **baseline** (điểm tham chiếu) để so sánh và theo dõi các thay đổi trong môi trường đám mây.
   - Ví dụ: Hạn chế truy cập cổng quản trị, bật mã hóa tệp, kích hoạt dịch vụ phát hiện mối đe dọa.

4. Mã hóa (Cryptography) 🔐

   - **Mã hóa** là quá trình biến thông tin thành dạng không thể đọc được (ciphertext) mà không có khóa giải mã.
   - **Lợi ích**: Bảo vệ dữ liệu nhạy cảm trong đám mây.

5. Xóa mã hóa (Cryptographic erasure) 🗑️

   - **Crypto-shredding**: Xóa khóa mã hóa để làm cho dữ liệu không thể giải mã được.
   - **Lưu ý**: Đảm bảo tất cả các bản sao của khóa đều bị hủy.

6. Quản lý khóa (Key management) 🔑

   - **Trusted Platform Module (TPM)**: Chip lưu trữ khóa mã hóa an toàn.
   - **Cloud Hardware Security Module (CloudHSM)**: Thiết bị lưu trữ khóa mã hóa và thực hiện các thao tác mã hóa.

### Tổng kết 🌟

Bảo mật đám mây đòi hỏi sự kết hợp giữa việc hiểu rõ **mô hình trách nhiệm chia sẻ** và áp dụng các biện pháp củng cố bảo mật như **IAM**, **baselining**, **mã hóa**, và **quản lý khóa**. Các tổ chức cần chủ động trong việc cấu hình và giám sát để đảm bảo an toàn cho dữ liệu và tài nguyên đám mây.

**Tham khảo thêm**:

- [Cloud Computing - Coursera](https://www.coursera.org/learn/networks-and-network-security/lecture/BGlnq/cloud-networks)
- [FEDRAMP CSP List](https://www.fedramp.gov/)
