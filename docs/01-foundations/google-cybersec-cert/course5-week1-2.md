---
title: "Assets, Threats, and Vulnerabilities - Week 1 (2)"
sidebar_position: 25
---

## Mã hóa đối xứng và bất đối xứng 🔐

Mã hóa là quá trình chuyển đổi dữ liệu từ định dạng có thể đọc được sang định dạng được mã hóa để bảo vệ thông tin. Có hai loại mã hóa chính: **mã hóa đối xứng** và **mã hóa bất đối xứng**. Dưới đây là tóm tắt về hai phương pháp này cùng với các thuật toán phổ biến.

### Mã hóa đối xứng (Symmetric Encryption) 🔑

- **Định nghĩa**: Sử dụng một khóa bí mật duy nhất để mã hóa và giải mã dữ liệu.
- **Cách hoạt động**: Người gửi và người nhận phải biết khóa bí mật để mã hóa và giải mã thông tin.
- **Ưu điểm**: Tốc độ xử lý nhanh.
- **Nhược điểm**: Khóa bí mật phải được chia sẻ an toàn giữa các bên, điều này có thể trở thành điểm yếu nếu khóa bị lộ.

#### Các thuật toán phổ biến

1. **Triple DES (3DES)**:

   - **Mô tả**: Một phiên bản nâng cao của DES, sử dụng ba khóa 56-bit để tạo ra khóa hiệu quả 168-bit.
   - **Hạn chế**: Đang dần được thay thế do giới hạn về lượng dữ liệu có thể mã hóa.

2. **AES (Advanced Encryption Standard)**:
   - **Mô tả**: Một trong những thuật toán đối xứng an toàn nhất hiện nay, sử dụng khóa 128, 192, hoặc 256-bit.
   - **Ưu điểm**: Khả năng chống lại các cuộc tấn công brute force (vét cạn).

### Mã hóa bất đối xứng (Asymmetric Encryption) 🔓

- **Định nghĩa**: Sử dụng một cặp khóa gồm khóa công khai (public key) và khóa riêng tư (private key) để mã hóa và giải mã dữ liệu.
- **Cách hoạt động**: Khóa công khai được sử dụng để mã hóa dữ liệu, và chỉ khóa riêng tư mới có thể giải mã được.
- **Ưu điểm**: Không cần chia sẻ khóa riêng tư, giảm nguy cơ bị lộ khóa.
- **Nhược điểm**: Tốc độ xử lý chậm hơn so với mã hóa đối xứng.

#### Các thuật toán phổ biến

1. **RSA (Rivest Shamir Adleman)**:

   - **Mô tả**: Một trong những thuật toán bất đối xứng đầu tiên, tạo ra cặp khóa công khai và riêng tư với độ dài khóa 1,024, 2,048, hoặc 4,096-bit.
   - **Ứng dụng**: Bảo vệ dữ liệu nhạy cảm cao.

2. **DSA (Digital Signature Algorithm)**:
   - **Mô tả**: Một thuật toán bất đối xứng tiêu chuẩn, thường được sử dụng cùng với RSA trong cơ sở hạ tầng khóa công khai (PKI).

### Độ dài khóa và bảo mật 🔍

- **Độ dài khóa**: Khóa càng dài thì càng an toàn, nhưng cũng làm tăng thời gian xử lý.
- **Brute Force Attack**: Các cuộc tấn công vét cạn sẽ khó khăn hơn với khóa dài, nhưng cũng làm chậm quá trình mã hóa và giải mã.

### Công cụ tạo khóa 🛠️

- **OpenSSL**: Một công cụ dòng lệnh mã nguồn mở để tạo khóa công khai và riêng tư.
- **Lưu ý**: Luôn sử dụng phiên bản cập nhật của phần mềm để tránh các lỗ hổng bảo mật như **Heartbleed**.

### Nguyên tắc Kerckhoff 🔒

- **Nguyên tắc**: Một hệ thống mã hóa nên được thiết kế sao cho tất cả các chi tiết của thuật toán (trừ khóa riêng tư) có thể được công khai mà không làm giảm tính bảo mật.
- **Lưu ý**: Các hệ thống mã hóa tùy chỉnh thường dễ bị bẻ khóa nếu không được kiểm chứng kỹ lưỡng.

### Ứng dụng thực tế 🌐

- **Kết hợp mã hóa**: Các trang web thường sử dụng mã hóa bất đối xứng để bảo vệ thông tin đăng nhập, sau đó chuyển sang mã hóa đối xứng để tăng tốc độ xử lý.
- **Tuân thủ quy định**: Các quy định như **FIPS 140-3** và **GDPR** yêu cầu sử dụng mã hóa để bảo vệ dữ liệu khách hàng.

### Kết luận 📌

- **Mã hóa đối xứng** và **bất đối xứng** đều có vai trò quan trọng trong việc bảo vệ dữ liệu trực tuyến.
- Hiểu biết về các thuật toán mã hóa và cách chúng hoạt động giúp bạn trở thành một chuyên gia bảo mật hiệu quả, đáp ứng các yêu cầu tuân thủ và bảo vệ thông tin nhạy cảm.

---

## Sự Phát triển của hàm Băm (Hash Functions) 🔐

Hàm băm là một công cụ quan trọng trong chiến lược bảo mật của mọi công ty, được sử dụng rộng rãi để xác thực và đảm bảo tính **không thể từ chối** (non-repudiation). Dưới đây là tóm tắt về nguồn gốc và sự phát triển của các hàm băm, cùng với các phương pháp bảo mật liên quan.

### Nguồn gốc của hàm Băm 🕰️

- **Mục đích ban đầu**: Hàm băm được tạo ra để tìm kiếm dữ liệu nhanh chóng và hiệu quả.
- **MD5 (Message Digest 5)**: Được phát triển bởi Giáo sư Ronald Rivest vào những năm 1990, MD5 chuyển đổi dữ liệu thành giá trị băm 128-bit.
- **Hạn chế của MD5**: Giá trị băm 128-bit dễ bị **va chạm băm (hash collision)**, khiến nó dễ bị tấn công.

### Va chạm Băm (Hash Collision) ⚠️

- **Định nghĩa**: Va chạm băm xảy ra khi hai đầu vào khác nhau tạo ra cùng một giá trị băm.
- **Vấn đề**: Điều này có thể dẫn đến việc kẻ tấn công giả mạo dữ liệu hợp lệ bằng cách tạo ra các giá trị băm trùng khớp.

### Thế hệ hàm Băm mới: SHA (Secure Hashing Algorithms) 🛡️

- **SHA-1**: Tạo giá trị băm 160-bit, nhưng vẫn có nguy cơ bị tấn công.
- **SHA-2**: Bao gồm các phiên bản như SHA-224, SHA-256, SHA-384, và SHA-512, tạo ra các giá trị băm dài hơn và an toàn hơn.
- **SHA-3**: Là phiên bản mới nhất, được thiết kế để chống lại các cuộc tấn công tiên tiến.

### Lưu trữ mật khẩu an toàn 🔒

- **Hashing trong lưu trữ mật khẩu**: Mật khẩu được lưu trữ dưới dạng giá trị băm thay vì văn bản gốc, giúp ngăn chặn việc đánh cắp thông tin đăng nhập.
- **Rainbow Tables**: Là các bảng chứa các giá trị băm phổ biến và văn bản gốc tương ứng, được sử dụng để tấn công các cơ sở dữ liệu mật khẩu.

### Thêm "muối" (Salting) để tăng cường bảo mật 🧂

- **Định nghĩa**: Muối là một chuỗi ký tự ngẫu nhiên được thêm vào dữ liệu trước khi băm.
- **Lợi ích**: Muối làm cho giá trị băm trở nên độc nhất, ngay cả khi các mật khẩu giống nhau, giúp chống lại các cuộc tấn công rainbow table.
- **Ví dụ**: Mật khẩu "password" sẽ có các giá trị băm khác nhau nếu được thêm muối ngẫu nhiên.

### Kết luận 📌

- **Hàm băm** là công cụ quan trọng để xác thực và đảm bảo tính toàn vẹn của dữ liệu.
- **MD5** đã lỗi thời do các lỗ hổng bảo mật, trong khi các hàm băm mới như **SHA-2** và **SHA-3** cung cấp mức độ bảo mật cao hơn.
- **Muối** là một phương pháp hiệu quả để tăng cường bảo mật khi lưu trữ mật khẩu và dữ liệu nhạy cảm.
- Hiểu biết về các hàm băm và phương pháp bảo mật liên quan giúp bạn đưa ra các khuyến nghị bảo mật hiệu quả trong công việc.

---

## Sự Phát triển của SSO và MFA trong xác thực 🔐

**Single Sign-On (SSO)** và **Multi-Factor Authentication (MFA)** là hai công nghệ xác thực phổ biến giúp tăng cường bảo mật trong khi vẫn đảm bảo trải nghiệm người dùng. Dưới đây là tóm tắt về cách hoạt động và lợi ích của SSO và MFA.

### Single Sign-On (SSO) 🌐

- **Định nghĩa**: SSO cho phép người dùng đăng nhập một lần để truy cập nhiều dịch vụ khác nhau mà không cần nhập lại thông tin đăng nhập.
- **Lợi ích**:

  1. **Cải thiện trải nghiệm người dùng**: Giảm số lượng tên đăng nhập và mật khẩu cần nhớ.
  2. **Giảm chi phí**: Đơn giản hóa việc quản lý các dịch vụ kết nối.
  3. **Tăng cường bảo mật**: Giảm số điểm truy cập mà kẻ tấn công có thể nhắm đến.

- **Cách hoạt động**: SSO sử dụng các **token truy cập** được mã hóa để thiết lập niềm tin giữa người dùng và nhà cung cấp dịch vụ. Các giao thức phổ biến bao gồm:

  - **LDAP (Lightweight Directory Access Protocol)**: Chủ yếu được sử dụng trong môi trường on-premises.
  - **SAML (Security Assertion Markup Language)**: Thường được sử dụng trong môi trường đám mây.

- **Hạn chế**: SSO chỉ sử dụng một hình thức xác thực (thường là mật khẩu), điều này có thể trở thành điểm yếu nếu mật khẩu bị đánh cắp.

### Multi-Factor Authentication (MFA) 🔒

- **Định nghĩa**: MFA yêu cầu người dùng xác minh danh tính của họ bằng hai hoặc nhiều yếu tố khác nhau trước khi được truy cập vào hệ thống.
- **Các yếu tố xác thực**:

  1. **Điều người dùng biết**: Tên đăng nhập và mật khẩu.
  2. **Điều người dùng có**: Mã OTP (One-Time Password) gửi qua SMS hoặc ứng dụng xác thực.
  3. **Điều người dùng là**: Đặc điểm sinh trắc học như vân tay hoặc nhận diện khuôn mặt.

- **Lợi ích**:
  - **Tăng cường bảo mật**: Yêu cầu nhiều yếu tố xác thực giúp giảm nguy cơ bị tấn công brute force hoặc giả mạo.
  - **Phù hợp với môi trường đám mây**: Đảm bảo rằng người dùng từ xa là người dùng hợp pháp.

### Kết hợp SSO và MFA 🚀

- **SSO + MFA**: Kết hợp SSO và MFA mang lại trải nghiệm người dùng mượt mà đồng thời tăng cường bảo mật.
  - **SSO** giảm số lượng điểm truy cập và đơn giản hóa quá trình đăng nhập.
  - **MFA** đảm bảo rằng chỉ người dùng hợp pháp mới có thể truy cập vào hệ thống.

### Kết luận 📌

- **SSO** và **MFA** là hai công nghệ quan trọng giúp cải thiện bảo mật mà không làm giảm trải nghiệm người dùng.
- **SSO** giúp giảm số lượng mật khẩu cần nhớ và điểm truy cập, trong khi **MFA** tăng cường bảo mật bằng cách yêu cầu nhiều yếu tố xác thực.
- Kết hợp cả hai công nghệ này là một cách hiệu quả để bảo vệ thông tin quan trọng và ngăn chặn truy cập trái phép.

---

## Quản lý danh tính và truy cập (IAM) 🛡️🔐

Quản lý danh tính và truy cập (Identity and Access Management - IAM) là một tập hợp các quy trình và công nghệ giúp tổ chức quản lý danh tính kỹ thuật số và kiểm soát quyền truy cập vào tài nguyên. IAM đảm bảo rằng **đúng người dùng** được cấp quyền truy cập vào **đúng tài nguyên** vào **đúng thời điểm** và vì **đúng lý do**.

### Nguyên tắc cơ bản trong IAM 🧩

1. **Nguyên tắc Đặc quyền Tối thiểu (Least Privilege)**:

   - Người dùng chỉ được cấp mức truy cập và ủy quyền tối thiểu cần thiết để hoàn thành nhiệm vụ.
   - **Ví dụ**: Một nhân viên chỉ được phép truy cập vào dữ liệu của bộ phận mình, không phải toàn bộ hệ thống.

2. **Nguyên tắc Phân tách Nhiệm vụ (Separation of Duties)**:
   - Chia sẻ trách nhiệm giữa nhiều người để ngăn chặn việc một cá nhân có quá nhiều quyền kiểm soát.
   - **Ví dụ**: Người phê duyệt mua sắm không nên là người nhập dữ liệu mua sắm.

### Các Thành phần chính của IAM 🛠️

#### 1. **Xác thực người dùng (Authentication)**

- **Mục đích**: Đảm bảo người dùng là người họ tự nhận.
- **Các yếu tố xác thực**:
  1. **Điều người dùng biết**: Tên đăng nhập và mật khẩu.
  2. **Điều người dùng có**: Mã OTP (One-Time Password) hoặc thiết bị xác thực.
  3. **Điều người dùng là**: Đặc điểm sinh trắc học như vân tay hoặc nhận diện khuôn mặt.
- **Công nghệ hỗ trợ**: **SSO (Single Sign-On)** và **MFA (Multi-Factor Authentication)**.

#### 2. **Cấp phát người dùng (User Provisioning)**

- **Định nghĩa**: Quá trình tạo và duy trì danh tính kỹ thuật số của người dùng.
- **Ví dụ**: Tạo tài khoản mới cho nhân viên mới và cấp quyền truy cập phù hợp.
- **Deprovisioning**: Loại bỏ quyền truy cập khi người dùng không còn cần thiết.

#### 3. **Cấp quyền (Authorization)**

- **Mục đích**: Đảm bảo người dùng được cấp quyền truy cập vào đúng tài nguyên.
- **Các mô hình cấp quyền phổ biến**:
  1. **MAC (Mandatory Access Control)**: Quyền truy cập được cấp bởi quản trị viên trung tâm, dựa trên nguyên tắc "cần biết".
  2. **DAC (Discretionary Access Control)**: Quyền truy cập được quyết định bởi chủ sở hữu dữ liệu.
  3. **RBAC (Role-Based Access Control)**: Quyền truy cập được xác định dựa trên vai trò của người dùng trong tổ chức.

### Công nghệ kiểm soát truy cập 🖥️

- **Hệ thống IAM/AAA**: Bao gồm thư mục người dùng, công cụ quản lý dữ liệu, hệ thống ủy quyền và kiểm toán.
- **Tùy chỉnh hệ thống**: Một số tổ chức phát triển hệ thống IAM riêng để đáp ứng nhu cầu bảo mật cụ thể.
- **Giải pháp bên thứ ba**: Nhiều tổ chức sử dụng các giải pháp IAM từ bên thứ ba để tiết kiệm thời gian và tài nguyên.

### Kết luận 📌

- **IAM** và **AAA** là hai khung làm việc phổ biến để quản lý quyền truy cập và đảm bảo tuân thủ các nguyên tắc bảo mật như **đặc quyền tối thiểu** và **phân tách nhiệm vụ**.
- **Xác thực**, **cấp phát người dùng**, và **cấp quyền** là các thành phần chính của IAM, giúp đảm bảo rằng chỉ những người dùng hợp lệ mới có thể truy cập vào tài nguyên quan trọng.
- Hiểu biết về IAM và các công nghệ liên quan là kỹ năng quan trọng để hỗ trợ tổ chức đạt được mục tiêu bảo mật.
