---
title: Foundations of Cybersecurity - Week2 (3)
sidebar_position: 5
---

Xin chào mọi người, đây là bài học cuối cùng trong Course Foundations of Cybersecurity rồi. Mọi người cùng tôi và cậu ấy tìm hiểu thêm về các công cụ sẽ được dùng trong CyberSec nhé, những công cụ này sẽ được luyện tập chi tiết hơn trong các Course sau. Giờ thì bắt đầu bài học nào.

- [📌 Các công cụ quan trọng trong An ninh Mạng](#-các-công-cụ-quan-trọng-trong-an-ninh-mạng)
- [🔹 Giới thiệu](#-giới-thiệu)
- [🔹 Các công cụ cơ bản trong bộ công cụ của Security Analyst](#-các-công-cụ-cơ-bản-trong-bộ-công-cụ-của-security-analyst)
- [🔹 Các loại Playbooks quan trọng](#-các-loại-playbooks-quan-trọng)
- [🔹 Tầm quan trọng Của Playbooks trong điều tra số](#-tầm-quan-trọng-của-playbooks-trong-điều-tra-số)
- [🔹 Tổng kết](#-tổng-kết)
- [🔹 Tham Khảo Thêm](#-tham-khảo-thêm)
- [🛠️ Công cụ bảo vệ hoạt động doanh nghiệp trong An ninh Mạng](#️-công-cụ-bảo-vệ-hoạt-động-doanh-nghiệp-trong-an-ninh-mạng)
  - [💻 Lập trình (Programming)](#-lập-trình-programming)
  - [🖥️ Hệ điều hành (Operating Systems)](#️-hệ-điều-hành-operating-systems)
  - [🌐 Lỗ hổng Web (Web Vulnerability)](#-lỗ-hổng-web-web-vulnerability)
  - [🦠 Phần mềm diệt Virus (Antivirus Software)](#-phần-mềm-diệt-virus-antivirus-software)
  - [🔍 Hệ thống phát hiện xâm nhập (IDS - Intrusion Detection System)](#-hệ-thống-phát-hiện-xâm-nhập-ids---intrusion-detection-system)
  - [🔐 Mã hóa dữ liệu (Encryption)](#-mã-hóa-dữ-liệu-encryption)
  - [🎯 Kiểm thử xâm nhập (Penetration Testing)](#-kiểm-thử-xâm-nhập-penetration-testing)
- [🔹Tổng kết](#tổng-kết)
- [Course1 - Wrap up](#course1---wrap-up)
- [🛡️ Week 1: Giới thiệu về An ninh Mạng](#️-week-1-giới-thiệu-về-an-ninh-mạng)
  - [🔹 Các khái niệm quan trọng](#-các-khái-niệm-quan-trọng)
  - [🔹 Các kỹ năng cần thiết](#-các-kỹ-năng-cần-thiết)
- [🔥 Week 2: Tấn công mạng \& mối đe dọa](#-week-2-tấn-công-mạng--mối-đe-dọa)
  - [🔹 Các loại tấn công phổ niến](#-các-loại-tấn-công-phổ-niến)
  - [🔹 Các tác nhân đe dọa (Threat Actors)](#-các-tác-nhân-đe-dọa-threat-actors)
- [🏛️ Week 2 (2): Controls, Frameworks \& Compliance](#️-week-2-2-controls-frameworks--compliance)
  - [🔹 Mối quan hệ giữa Controls, Frameworks \& Compliance](#-mối-quan-hệ-giữa-controls-frameworks--compliance)
  - [🔹 Nguyên tắc đạo đức trong An ninh Mạng](#-nguyên-tắc-đạo-đức-trong-an-ninh-mạng)
- [🛠️ Week 2 (3): Công cụ An ninh Mạng](#️-week-2-3-công-cụ-an-ninh-mạng)
  - [🔹 Công cụ quan trọng](#-công-cụ-quan-trọng)
  - [🔹 Hệ điều hành \& công cụ hỗ trợ](#-hệ-điều-hành--công-cụ-hỗ-trợ)

## 📌 Các công cụ quan trọng trong An ninh Mạng

## 🔹 Giới thiệu

Trong vai trò một **security analyst**, việc sử dụng các công cụ bảo mật là điều không thể thiếu để giảm thiểu rủi ro và bảo vệ hệ thống của tổ chức. Bài viết này sẽ giúp bạn hiểu về một số công cụ phổ biến cũng như cách chúng hỗ trợ trong hoạt động bảo mật.

## 🔹 Các công cụ cơ bản trong bộ công cụ của Security Analyst

| **Công cụ**                                          | **Mô tả**                                                                                                 |
| ---------------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| **SIEM (Security Information and Event Management)** | Thu thập và phân tích log để giám sát hoạt động trong tổ chức, giúp phát hiện sớm các mối đe dọa.         |
| **Network Protocol Analyzer (Packet Sniffer)**       | Ghi lại và phân tích lưu lượng mạng để xác định các bất thường hoặc mối đe dọa bảo mật.                   |
| **Playbooks**                                        | Các hướng dẫn quy trình giúp chuyên viên bảo mật thực hiện đúng quy trình khi phản ứng với sự cố bảo mật. |

## 🔹 Các loại Playbooks quan trọng

| **Playbook**                                    | **Mô tả**                                                                                  |
| ----------------------------------------------- | ------------------------------------------------------------------------------------------ |
| **Chain of Custody Playbook**                   | Hướng dẫn quá trình ghi nhận và bảo vệ bằng chứng trong suốt quá trình điều tra.           |
| **Protecting and Preserving Evidence Playbook** | Quy trình bảo vệ và lưu trữ bằng chứng số, đảm bảo dữ liệu không bị thay đổi hoặc mất mát. |

## 🔹 Tầm quan trọng Của Playbooks trong điều tra số

- **Chain of custody** giúp theo dõi chính xác ai đã tiếp cận bằng chứng, đảm bảo tính toàn vẹn của dữ liệu.
- **Protecting and preserving evidence** giúp ưu tiên dữ liệu dễ mất (volatile data) trước khi thực hiện các phân tích sâu hơn.

## 🔹 Tổng kết

- Các công cụ bảo mật như **SIEM, Packet Sniffer, và Playbooks** đóng vai trò quan trọng trong việc giám sát, phân tích và phản ứng với sự cố.
- Các **playbooks** giúp đảm bảo quy trình điều tra pháp y được thực hiện chính xác và tuân theo chuẩn mực bảo mật.
- Nếu bạn quan tâm đến lĩnh vực điều tra số (forensic investigation), có thể tìm hiểu thêm các công cụ pháp y để bổ sung vào bộ kỹ năng của mình.

## 🔹 Tham Khảo Thêm

- 📄 [Google Cybersecurity Action Team - Threat Horizon Report](https://services.google.com/fh/files/blogs/gcat_threathorizons_full_sept2022.pdf)
- 🔍 [CISA - Free Cybersecurity Services and Tools](https://www.cisa.gov/free-cybersecurity-services-and-tools)

---

## 🛠️ Công cụ bảo vệ hoạt động doanh nghiệp trong An ninh Mạng

### 💻 Lập trình (Programming)

| **Ngôn ngữ** | **Mục đích**                                                |
| ------------ | ----------------------------------------------------------- |
| **Python**   | Hỗ trợ tự động hóa tác vụ bảo mật để giảm lỗi do con người. |
| **SQL**      | Truy vấn, tương tác và quản lý cơ sở dữ liệu.               |

### 🖥️ Hệ điều hành (Operating Systems)

| **Hệ điều hành** | **Đặc điểm**                                                   |
| ---------------- | -------------------------------------------------------------- |
| **Linux**        | Mã nguồn mở, hỗ trợ bảo mật và quản lý hệ thống qua dòng lệnh. |
| **Windows**      | Phổ biến, dễ sử dụng, nhiều công cụ bảo mật tích hợp.          |
| **macOS**        | Tích hợp nhiều tính năng bảo mật nâng cao.                     |

### 🌐 Lỗ hổng Web (Web Vulnerability)

- Lỗ hổng web là điểm yếu trong ứng dụng web có thể bị khai thác để truy cập trái phép, đánh cắp dữ liệu hoặc triển khai mã độc.
- **Xem thêm:** [OWASP Top 10](https://owasp.org/www-project-top-ten/) để cập nhật các rủi ro nghiêm trọng nhất đối với ứng dụng web.

### 🦠 Phần mềm diệt Virus (Antivirus Software)

- Phát hiện, ngăn chặn và loại bỏ phần mềm độc hại.
- Một số phần mềm có thể quét bộ nhớ để tìm dấu hiệu mã độc.

### 🔍 Hệ thống phát hiện xâm nhập (IDS - Intrusion Detection System)

- Giám sát hoạt động hệ thống và cảnh báo khi có dấu hiệu xâm nhập.
- Phân tích các gói dữ liệu trong mạng để xác định các mối đe dọa tiềm tàng.

### 🔐 Mã hóa dữ liệu (Encryption)

- Chuyển đổi dữ liệu từ dạng có thể đọc thành dạng được mã hóa để bảo vệ tính bảo mật.
- **Lưu ý:** Mã hóa và mã hóa ký tự (encoding) có mục đích khác nhau:
  - **Mã hóa (Encryption)**: Bảo mật dữ liệu.
  - **Mã hóa ký tự (Encoding)**: Chuyển đổi dữ liệu để tương thích giữa các hệ thống.

### 🎯 Kiểm thử xâm nhập (Penetration Testing)

- Kiểm tra hệ thống, mạng và ứng dụng bằng cách thực hiện các cuộc tấn công mô phỏng.
- Giúp xác định các lỗ hổng và đề xuất biện pháp khắc phục.

## 🔹Tổng kết

- Các công cụ như **SIEM, IDS, Antivirus, Encryption và Pen Testing** giúp các chuyên viên bảo mật thực hiện công việc hiệu quả hơn.
- Việc nắm vững nhiều công cụ sẽ giúp bạn trở thành **một chuyên viên bảo mật có giá trị** trong tổ chức.
- Hãy tiếp tục tìm hiểu về các công cụ mới để nâng cao kỹ năng và bảo vệ hệ thống tốt hơn.

---

## Course1 - Wrap up

## 🛡️ Week 1: Giới thiệu về An ninh Mạng

### 🔹 Các khái niệm quan trọng

- **Compliance**: Tuân thủ các tiêu chuẩn nội bộ và quy định bên ngoài.
- **Security Frameworks**: Hướng dẫn xây dựng kế hoạch bảo mật.
- **Security Controls**: Biện pháp bảo mật giúp giảm thiểu rủi ro.
- **Security Posture**: Khả năng bảo vệ tài sản và dữ liệu của tổ chức.

### 🔹 Các kỹ năng cần thiết

- **Kỹ năng chuyển đổi**: Giao tiếp, giải quyết vấn đề, quản lý thời gian.
- **Kỹ năng kỹ thuật**: Lập trình, SIEM, IDS, quản lý rủi ro và phản hồi sự cố.
- **Chứng chỉ CompTIA Security+**: Một chứng chỉ quan trọng trong ngành an ninh mạng.

---

## 🔥 Week 2: Tấn công mạng & mối đe dọa

### 🔹 Các loại tấn công phổ niến

- **Phishing**: Giả mạo email, tin nhắn để đánh cắp thông tin.
- **Malware**: Virus, worms, ransomware, spyware.
- **Social Engineering**: Lợi dụng tâm lý con người để thu thập thông tin.
- **Password Attacks**: Brute force, rainbow table.
- **Supply Chain Attacks**: Nhắm vào chuỗi cung ứng để cài đặt mã độc.
- **Cryptographic Attacks**: Tấn công vào các hệ thống mã hóa.

### 🔹 Các tác nhân đe dọa (Threat Actors)

- **APTs (Advanced Persistent Threats)**: Nhóm hacker có tổ chức.
- **Insider Threats**: Nguy cơ đến từ nội bộ.
- **Hacktivists**: Tấn công vì lý do chính trị, xã hội.

---

## 🏛️ Week 2 (2): Controls, Frameworks & Compliance

### 🔹 Mối quan hệ giữa Controls, Frameworks & Compliance

- **CIA Triad**: Confidentiality - Integrity - Availability.
- **NIST, ISO, PCI DSS, HIPAA, GDPR**: Các tiêu chuẩn bảo mật quan trọng.

### 🔹 Nguyên tắc đạo đức trong An ninh Mạng

- **Bảo mật (Confidentiality)**: Giữ thông tin an toàn.
- **Bảo vệ quyền riêng tư (Privacy Protection)**: Bảo vệ dữ liệu cá nhân.
- **Tuân thủ pháp luật (Compliance with Laws)**: Làm việc theo các quy định bảo mật.

---

## 🛠️ Week 2 (3): Công cụ An ninh Mạng

### 🔹 Công cụ quan trọng

| **Công Cụ**        | **Mô Tả**                                          |
| ------------------ | -------------------------------------------------- |
| **SIEM**           | Thu thập và phân tích log để phát hiện mối đe dọa. |
| **Packet Sniffer** | Ghi lại và phân tích lưu lượng mạng.               |
| **Playbooks**      | Hướng dẫn quy trình xử lý sự cố bảo mật.           |

### 🔹 Hệ điều hành & công cụ hỗ trợ

| **Loại**                | **Chi Tiết**                                 |
| ----------------------- | -------------------------------------------- |
| **Hệ điều hành**        | Linux, Windows, macOS.                       |
| **Lập trình**           | Python (tự động hóa), SQL (quản lý dữ liệu). |
| **Mã hóa**              | Bảo vệ thông tin nhạy cảm.                   |
| **Antivirus**           | Phát hiện và ngăn chặn mã độc.               |
| **Penetration Testing** | Đánh giá lỗ hổng bảo mật.                    |
