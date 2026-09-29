---
title: Foundations of Cybersecurity - Week2
sidebar_position: 3
---

Xin chào mọi người, nội dung tuần trước thế nào, có khó hiểu hay sai sót gì không? Tuần trước tôi và cậu ấy đã tóm tắt lại kiến thức cơ bản về Cybersecutrity, mọi người có tìm được kỹ năng mình cần học/rèn luyện không? Hôm nay 2 chúng tôi sẽ tổng hợp lại lịch sử hình thành của Cybersecurity và có cái nhìn tổng quan về các loại mã độc, các tác nhân đe dọa và attackers, hi vọng sẽ giúp ích cho mọi người. Bắt đầu nhé?

- [🔥 Tổng quan về các cuộc tấn công mạng và hậu quả của chúng](#-tổng-quan-về-các-cuộc-tấn-công-mạng-và-hậu-quả-của-chúng)
- [🚨 Giới thiệu](#-giới-thiệu)
- [🎣 Phishing (Lừa đảo trực tuyến)](#-phishing-lừa-đảo-trực-tuyến)
  - [🔹 Các dạng phishing phổ biến](#-các-dạng-phishing-phổ-biến)
- [🦠 Malware (Phần mềm độc hại)](#-malware-phần-mềm-độc-hại)
  - [🔹 Các loại malware phổ biến](#-các-loại-malware-phổ-biến)
- [🎭 Social Engineering (Kỹ thuật lừa đảo xã hội)](#-social-engineering-kỹ-thuật-lừa-đảo-xã-hội)
  - [🔹 Các hình thức social engineering phổ biến](#-các-hình-thức-social-engineering-phổ-biến)
  - [🛠️ Các nguyên tắc của social engineering](#️-các-nguyên-tắc-của-social-engineering)
- [🔑 Các Loại Tấn Công Mạng Khác](#-các-loại-tấn-công-mạng-khác)
  - [🛠️ Password Attacks](#️-password-attacks)
  - [🏠 Physical Attacks](#-physical-attacks)
  - [🤖 Adversarial AI Attacks](#-adversarial-ai-attacks)
  - [🏗️ Supply Chain Attacks](#️-supply-chain-attacks)
  - [🔐 Cryptographic Attacks](#-cryptographic-attacks)
- [🕵️‍♂️ Hiểu về Threat Actors (Tác nhân đe dọa)](#️️-hiểu-về-threat-actors-tác-nhân-đe-dọa)
  - [🔹 Các loại threat actors phổ biến](#-các-loại-threat-actors-phổ-biến)
  - [🎭 Các loại hacker](#-các-loại-hacker)
- [🎯 Kết Luận](#-kết-luận)
- [📖 Tóm tắt thuật ngữ - Course 1, Module 2](#-tóm-tắt-thuật-ngữ---course-1-module-2)

## 🔥 Tổng quan về các cuộc tấn công mạng và hậu quả của chúng

## 🚨 Giới thiệu

Trong quá trình phát triển của ngành an ninh mạng, nhiều cuộc tấn công đã góp phần định hình ngành công nghiệp này. Những cuộc tấn công như **LoveLetter (ILOVEYOU virus)** và **Morris worm** đã dẫn đến sự ra đời của các **đội phản ứng sự cố bảo mật (CSIRTs)**. Bài viết này sẽ giúp bạn hiểu về các phương pháp tấn công phổ biến hiện nay.

Trước đó, hãy cùng điểm qua 8 lĩnh vực bảo mật của CISSP để làm bài luyện tập nhé:

- **Security and Risk Management**: Xác định mục tiêu bảo mật, giảm thiểu rủi ro, đảm bảo tuân thủ và lập kế hoạch duy trì hoạt động kinh doanh.
- **Asset Security**: Bảo vệ tài sản số và vật lý, bao gồm cách lưu trữ, duy trì và hủy dữ liệu an toàn.
- **Security Architecture and Engineering**: Xây dựng và triển khai các hệ thống và công cụ bảo mật để bảo vệ dữ liệu.
- **Communication and Network Security**: Đảm bảo an toàn cho các mạng vật lý và không dây để bảo vệ quá trình truyền dữ liệu.
- **Identity and Access Management (IAM)**: Kiểm soát ai có quyền truy cập vào tài nguyên và dữ liệu nào.
- **Security Assessment and Testing**: Thường xuyên đánh giá các biện pháp bảo mật để xác định và khắc phục lỗ hổng.
- **Security Operations**: Quản lý và giám sát hệ thống bảo mật, phản ứng với các sự cố an ninh.
- **Software Development Security**: Tích hợp bảo mật vào toàn bộ vòng đời phát triển phần mềm.

---

## 🎣 Phishing (Lừa đảo trực tuyến)

Phishing là việc sử dụng các phương tiện kỹ thuật số để đánh lừa người dùng tiết lộ thông tin nhạy cảm hoặc cài đặt phần mềm độc hại.

### 🔹 Các dạng phishing phổ biến

- **Business Email Compromise (BEC)**: Giả mạo email từ nguồn tin cậy để yêu cầu thông tin.
- **Spear phishing**: Nhắm vào một cá nhân hoặc nhóm cụ thể.
- **Whaling**: Nhắm vào giám đốc điều hành để đánh cắp dữ liệu nhạy cảm.
- **Vishing**: Lừa đảo qua điện thoại.
- **Smishing**: Lừa đảo qua tin nhắn SMS.

---

## 🦠 Malware (Phần mềm độc hại)

Malware là phần mềm được thiết kế để gây hại cho thiết bị hoặc mạng.

### 🔹 Các loại malware phổ biến

- **Viruses**: Cần sự can thiệp của người dùng để lây nhiễm hệ thống.
- **Worms**: Tự động lan truyền mà không cần hành động từ người dùng.
- **Ransomware**: Mã hóa dữ liệu và đòi tiền chuộc.
- **Spyware**: Thu thập dữ liệu cá nhân mà không có sự đồng ý của người dùng.

---

## 🎭 Social Engineering (Kỹ thuật lừa đảo xã hội)

Tấn công kỹ thuật xã hội khai thác sự tin tưởng của con người để thu thập thông tin nhạy cảm.

### 🔹 Các hình thức social engineering phổ biến

- **Social media phishing**: Thu thập thông tin cá nhân từ mạng xã hội.
- **Watering hole attack**: Tấn công vào các trang web thường xuyên được truy cập.
- **USB baiting**: Để lại USB chứa malware để dụ nạn nhân cắm vào hệ thống.
- **Physical social engineering**: Giả dạng nhân viên hoặc khách hàng để truy cập trái phép.

### 🛠️ Các nguyên tắc của social engineering

- **Authority**: Giả danh người có quyền lực.
- **Intimidation**: Sử dụng chiến thuật đe dọa.
- **Consensus/Social proof**: Dựa vào lòng tin của đám đông.
- **Scarcity**: Tạo cảm giác khan hiếm.
- **Familiarity**: Tạo sự kết nối giả.
- **Trust**: Xây dựng lòng tin để khai thác thông tin cá nhân.
- **Urgency**: Thúc giục nạn nhân hành động nhanh chóng mà không suy nghĩ.

---

## 🔑 Các Loại Tấn Công Mạng Khác

### 🛠️ Password Attacks

Tấn công mật khẩu nhằm truy cập vào hệ thống bảo mật.

- **Brute force**: Dò mật khẩu bằng cách thử tất cả các kết hợp.
- **Rainbow table**: Sử dụng bảng băm để tìm mật khẩu.

### 🏠 Physical Attacks

Tấn công vào môi trường vật lý.

- **Malicious USB cable**: Cáp USB chứa mã độc.
- **Card cloning**: Sao chép thông tin thẻ tín dụng.

### 🤖 Adversarial AI Attacks

Tấn công bằng cách [khai thác AI](https://www.nccoe.nist.gov/ai/adversarial-machine-learning) để thực hiện các cuộc tấn công tinh vi hơn.

### 🏗️ Supply Chain Attacks

Nhắm vào chuỗi cung ứng để cài đặt malware vào phần mềm hoặc phần cứng.

### 🔐 Cryptographic Attacks

Tấn công vào các hệ thống mã hóa dữ liệu.

- **Birthday attack**: Dựa trên xác suất va chạm trong hàm băm.
- **Collision attack**: Tìm hai đầu vào khác nhau có cùng giá trị băm.
- **Downgrade attack**: Ép buộc hệ thống sử dụng giao thức yếu hơn.

---

## 🕵️‍♂️ Hiểu về Threat Actors (Tác nhân đe dọa)

Các tác nhân đe dọa có nhiều động cơ và phương thức tấn công khác nhau.

### 🔹 Các loại threat actors phổ biến

- **Advanced Persistent Threats (APTs)**: Nhóm hacker có tổ chức, nhắm vào mục tiêu lớn như chính phủ hoặc tập đoàn.
- **Insider Threats**: Người trong tổ chức lạm dụng quyền hạn.
- **Hacktivists**: Tấn công vì lý do chính trị hoặc xã hội.

### 🎭 Các loại hacker

![Type of attackers](./img/Attackers.png)

- **Authorized hackers (Ethical hackers)**: Kiểm tra hệ thống hợp pháp để cải thiện bảo mật.
- **Semi-authorized hackers**: Tìm kiếm lỗ hổng nhưng không khai thác chúng.
- **Unauthorized hackers**: Tấn công vì lợi ích tài chính hoặc cá nhân.

---

## 🎯 Kết Luận

Hiểu rõ về các loại tấn công mạng và cách thức hoạt động của threat actors sẽ giúp bạn bảo vệ tổ chức và dữ liệu hiệu quả hơn. Tham khảo thêm qua [NIST glossary](https://csrc.nist.gov/glossary/term/nist) hoặc tìm kiếm với keyword **"cybersecurity birthday attack"**.

📌 **Hãy tiếp tục cập nhật kiến thức và thực hành để trở thành một chuyên gia bảo mật giỏi hơn!** 🔐🚀

## 📖 Tóm tắt thuật ngữ - Course 1, Module 2

| **Thuật ngữ**                                | **Định nghĩa**                                                                                                                                   |
| -------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Adversarial artificial intelligence (AI)** | Kỹ thuật thao túng trí tuệ nhân tạo (AI) và học máy (ML) để thực hiện các cuộc tấn công một cách hiệu quả hơn.                                   |
| **Business Email Compromise (BEC)**          | Một loại tấn công lừa đảo trong đó kẻ tấn công giả mạo một nguồn đáng tin cậy để thu lợi tài chính.                                              |
| **CISSP**                                    | Chứng chỉ Chuyên gia Bảo mật Hệ thống Thông tin (Certified Information Systems Security Professional) được công nhận toàn cầu và cấp bởi (ISC)². |
| **Computer virus**                           | Mã độc được viết nhằm can thiệp vào hoạt động của máy tính và gây hại cho dữ liệu hoặc phần mềm.                                                 |
| **Cryptographic attack**                     | Một cuộc tấn công nhằm vào các hình thức giao tiếp bảo mật giữa người gửi và người nhận.                                                         |
| **Hacker**                                   | Bất kỳ cá nhân nào sử dụng máy tính để truy cập vào hệ thống, mạng hoặc dữ liệu trái phép.                                                       |
| **Malware**                                  | Phần mềm được thiết kế để gây hại cho thiết bị hoặc mạng.                                                                                        |
| **Password attack**                          | Nỗ lực truy cập vào các thiết bị, hệ thống, mạng hoặc dữ liệu được bảo vệ bằng mật khẩu.                                                         |
| **Phishing**                                 | Sử dụng các phương thức giao tiếp kỹ thuật số để lừa người dùng tiết lộ thông tin nhạy cảm hoặc triển khai phần mềm độc hại.                     |
| **Physical attack**                          | Một sự cố bảo mật không chỉ ảnh hưởng đến môi trường số mà còn đến môi trường vật lý.                                                            |
| **Physical social engineering**              | Một cuộc tấn công trong đó kẻ tấn công giả mạo nhân viên, khách hàng hoặc nhà cung cấp để truy cập trái phép vào một địa điểm vật lý.            |
| **Social engineering**                       | Kỹ thuật thao túng tâm lý nhằm khai thác sai sót của con người để thu thập thông tin cá nhân, quyền truy cập hoặc tài sản.                       |
| **Social media phishing**                    | Một loại tấn công trong đó kẻ tấn công thu thập thông tin chi tiết về mục tiêu trên mạng xã hội trước khi thực hiện cuộc tấn công.               |
| **Spear phishing**                           | Một cuộc tấn công email độc hại nhắm đến một cá nhân hoặc nhóm cụ thể, giả mạo nguồn đáng tin cậy.                                               |
| **Supply-chain attack**                      | Một cuộc tấn công nhắm vào hệ thống, ứng dụng, phần cứng hoặc phần mềm để tìm kiếm lỗ hổng và triển khai phần mềm độc hại.                       |
| **USB baiting**                              | Một cuộc tấn công trong đó kẻ tấn công cố tình để lại USB chứa mã độc nhằm lừa nhân viên cắm vào máy tính, qua đó lây nhiễm mạng.                |
| **Virus**                                    | Xem "computer virus".                                                                                                                            |
| **Vishing**                                  | Lợi dụng liên lạc thoại điện tử để lấy thông tin nhạy cảm hoặc giả mạo nguồn đáng tin cậy.                                                       |
| **Watering hole attack**                     | Một cuộc tấn công trong đó kẻ tấn công xâm nhập vào một trang web thường xuyên được truy cập bởi một nhóm người dùng cụ thể.                     |
