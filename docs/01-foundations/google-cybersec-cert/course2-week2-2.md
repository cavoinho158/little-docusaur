---
title: "Play It Safe: Manage Security Risks - Week 2 (2)"
sidebar_position: 9
---

Thật vui khi mọi người đã đọc đến tận đây, mọi người và tất nhiên là cả 2 chúng tôi nữa, đã làm rất tốt đấy! Cùng cố gắng duy trì nỗ lực này nhé. **(\*＾ ω ＾)人(＾ ω ＾\*)** Bài này chủ yếu là về Playbook và tóm tắt nội dung khóa học, phần thuật ngữ thì tôi và cậu ấy nhận ra là có link của google sẵn :v nên để tránh bài viết quá dài sẽ chỉ để link thôi nha.

À mà, tuần sau tôi và cậu ấy đi học lại rồi, sẽ có ít thời gian rãnh hơn nên các khóa học này chắc chỉ có 1 bài/tuần thôi. **(T ヘ T)** Mọi người thông cảm nha.

> _"Hi vọng là sẽ hoàn thành tất cả khóa học trước tháng 7." - Tôi lẩm bẩm_ \
> _"Chắc không kịp đâu, cùng lắm là 1 khóa học thôi." - Cậu ấy nói_ \
> _"Hay là viết về nội dung học trên trường nhỉ?" - Tôi hỏi cậu ấy_ \
> _"Cũng là một ý tưởng." - Cậu ấy đồng ý_

## 📖 Playbook trong An Ninh Mạng

**Playbook** là một tài liệu hướng dẫn chi tiết các bước thực hiện khi phản hồi một sự cố bảo mật. Nó giúp các chuyên gia an ninh mạng xác định và xử lý các mối đe dọa theo cách có hệ thống, đảm bảo tuân thủ quy trình và tiêu chuẩn bảo mật.

### 📜 Tổng quan về Playbook

- **Chứa danh sách các bước xử lý sự cố được cập nhật thường xuyên.**
- **Xác định vai trò và trách nhiệm của các thành viên trong nhóm bảo mật.**
- **Được xem như tài liệu sống**, cập nhật liên tục theo thay đổi trong tiêu chuẩn ngành, luật pháp và kỹ thuật tấn công.
- **Cập nhật playbook khi:**
  - Phát hiện lỗi trong quy trình.
  - Có thay đổi trong quy định và tiêu chuẩn tuân thủ.
  - Xuất hiện kỹ thuật tấn công mới.

### Incident & Vulnerability Response Playbooks

- Dùng để phản hồi các sự cố như **ransomware, vishing, BEC**.
- Được xây dựng dựa trên **Business Continuity Plan (BCP)**.
- Giúp giảm thiểu sai sót và đảm bảo thực hiện các hành động quan trọng trong khung thời gian cụ thể.

### Các bước xử lý sự cố trong Playbook

| **Giai Đoạn**            | **Mô Tả**                                                    |
| ------------------------ | ------------------------------------------------------------ |
| **Preparation**          | Chuẩn bị kế hoạch, hệ thống và đội ngũ để phản ứng kịp thời. |
| **Detection**            | Xác định sự cố bảo mật qua giám sát hệ thống.                |
| **Analysis**             | Phân tích tác động và mức độ rủi ro của sự cố.               |
| **Containment**          | Kiểm soát và cô lập hệ thống bị ảnh hưởng.                   |
| **Eradication**          | Loại bỏ nguyên nhân gây ra sự cố.                            |
| **Recovery**             | Khôi phục hệ thống về trạng thái hoạt động bình thường.      |
| **Post-Incident Review** | Đánh giá lại sự cố và cải thiện quy trình phản hồi.          |

📌 _Tuân theo các bước này giúp tránh sai sót và đảm bảo dữ liệu điều tra không bị mất/hỏng._

### 🌍 Tài Liệu Tham Khảo

Nếu bạn muốn làm việc trong lĩnh vực an ninh mạng ở các quốc gia khác nhau, hãy tham khảo các tài nguyên sau:

- [United Kingdom, National Cyber Security Center (NCSC) - Incident Management](https://www.ncsc.gov.uk/section/about-ncsc/incident-management)
- [Australian Government - Cyber Incident Response Plan](https://www.cyber.gov.au/sites/default/files/2023-03/ACSC%20Cyber%20Incident%20Response%20Plan%20Guidance_A4.pdf)
- [Japan Computer Emergency Response Team Coordination Center (JPCERT/CC) - Vulnerability Handling and related guidelines](https://www.jpcert.or.jp/english/vh/guidelines.html)
- [Government of Canada - Ransomware Playbook](https://cyber.gc.ca/en/guidance/ransomware-playbook-itsm00099)
- [Scottish Government - Playbook Templates](https://www.gov.scot/publications/cyber-resilience-incident-management/)

### 🎯 Kết Luận

- **Playbook giúp chuẩn hóa quy trình phản hồi sự cố bảo mật.**
- **Cập nhật playbook thường xuyên để đối phó với các mối đe dọa mới.**
- **Các tổ chức nên có nhiều loại playbook để xử lý từng loại sự cố khác nhau.**

---

## 📖 Playbooks, SIEM Tools và SOAR Tools

Trong an ninh mạng, **playbooks**, **SIEM tools**, và **SOAR tools** giúp các nhóm bảo mật phản ứng với các mối đe dọa, rủi ro, lỗ hổng và sự cố một cách hiệu quả. Chúng đảm bảo rằng các quy trình xử lý sự cố được thực hiện nhất quán và chính xác.

### 📜 Playbooks và SIEM Tools

- **Playbooks** cung cấp hướng dẫn chi tiết về cách xử lý sự cố bảo mật.
- **SIEM (Security Information and Event Management)** hỗ trợ giám sát và phát hiện hoạt động đáng ngờ.
- Khi **SIEM phát hiện hành vi bất thường**, playbooks hướng dẫn các chuyên gia bảo mật cách phân tích và phản ứng.
- **Ví dụ:** Nếu SIEM gắn cờ hoạt động đăng nhập bất thường, playbook sẽ chỉ định bước tiếp theo để điều tra.

### 🔄 SIEM và SOAR Tools

- **SOAR (Security Orchestration, Automation, and Response)** giúp tự động hóa các tác vụ lặp lại.
- **SOAR hoạt động với SIEM** để tự động phản ứng với các mối đe dọa.
- **Ví dụ:** Nếu người dùng nhập sai mật khẩu quá nhiều lần, SOAR có thể tự động khóa tài khoản, và playbook sẽ hướng dẫn cách mở lại.

### 🎯 Kết Luận

- **Playbooks giúp bảo đảm phản ứng nhanh chóng và có tổ chức khi xảy ra sự cố bảo mật.**
- **SIEM hỗ trợ phát hiện sớm các hành vi đáng ngờ.**
- **SOAR giúp tự động hóa quy trình bảo mật để giảm thiểu rủi ro.**

---

## Thuật ngữ Course 2: [Link](https://docs.google.com/document/d/1wvEvTZeN2iOg_Cil52pe9WRsLZyhK9U0gKcztftrzRE/template/preview?usp=sharing&resourcekey=0-BPIcdyJSYeqNxaQ3l1qAAA)

---

## Course 2 - Wrap up

**1. Các lĩnh vực bảo mật của CISSP:**

- CISSP (Certified Information Systems Security Professional) xác định tám lĩnh vực quan trọng giúp tổ chức quản lý bảo mật hiệu quả.
  ![CISSP's domain](./img/Security-domains.png)

**2. Quản lý rủi ro, mối đe dọa và lỗ hổng:**

- **Tài sản (Asset)** là bất kỳ thứ gì có giá trị đối với tổ chức, bao gồm tài sản kỹ thuật số và vật lý.
- **Các chiến lược quản lý rủi ro** bao gồm chấp nhận, tránh né, chuyển giao và giảm thiểu.
- **Các mối đe dọa phổ biến** bao gồm mối đe dọa từ bên trong (insider threats), tấn công APT (advanced persistent threats).
- **Các loại rủi ro** bao gồm rủi ro bên ngoài, rủi ro nội bộ, hệ thống cũ, rủi ro từ bên thứ ba và sự tuân thủ phần mềm.
- **Các lỗ hổng bảo mật** như ProxyLogon, ZeroLogon, Log4Shell, PetitPotam và SSRF.

**3. Frameworks và Controls:**

- **Frameworks** là các hướng dẫn để quản lý rủi ro và bảo vệ dữ liệu. Một số frameworks phổ biến bao gồm NIST RMF & CSF, Cyber Threat Framework (CTF) và ISO/IEC 27001.
- **Security controls** là các biện pháp để giảm rủi ro, có thể là physical, technical và administrative controls.
- Frameworks và controls kết hợp giúp tổ chức đạt được mục tiêu bảo mật và tuân thủ quy định.

**4. Ứng dụng CIA Triad để bảo vệ dữ liệu:**

- CIA Triad bao gồm **Confidentiality (Bảo mật), Integrity (Toàn vẹn) và Availability (Khả dụng)**, là nền tảng để xây dựng hệ thống bảo mật hiệu quả.
- Các nguyên tắc như least privilege, mã hóa và đảm bảo khả dụng giúp bảo vệ dữ liệu.

**5. Nguyên tắc bảo mật OWASP:**

- OWASP đưa ra các nguyên tắc giúp bảo vệ ứng dụng, bao gồm giảm thiểu bề mặt tấn công, least privilege, defense in depth, separation of duties, và fix security issues correctly.
- Các nguyên tắc mở rộng bao gồm thiết lập cấu hình bảo mật mặc định, fail securely, không tin tưởng dịch vụ bên thứ ba và tránh bảo mật bằng cách che giấu thông tin.

**6. Kiểm toán bảo mật (Security Audits):**

- Kiểm toán bảo mật là quy trình đánh giá các biện pháp kiểm soát an ninh, chính sách và quy trình.
- Mục tiêu là đảm bảo tuân thủ quy định, xác định điểm yếu, cải thiện khả năng ứng phó và duy trì an ninh.
- Các yếu tố ảnh hưởng đến kiểm toán bao gồm loại hình doanh nghiệp, quy mô, yêu cầu pháp lý, vị trí địa lý và mức độ cam kết bảo mật.
- Frameworks và controls đóng vai trò quan trọng trong kiểm toán.
- Checklist kiểm toán bao gồm xác định phạm vi, đánh giá rủi ro, tiến hành kiểm toán, lập kế hoạch giảm thiểu rủi ro và báo cáo.

**7. Playbooks trong An ninh Mạng:**

- **Playbook** là tài liệu hướng dẫn chi tiết các bước thực hiện khi phản hồi sự cố bảo mật.
- Nó bao gồm các bước như chuẩn bị, phát hiện, phân tích, ngăn chặn, loại bỏ, phục hồi và đánh giá sau sự cố.
- Playbooks cần được cập nhật thường xuyên.
- Playbooks, SIEM tools và SOAR tools giúp các nhóm bảo mật phản ứng hiệu quả với các mối đe dọa.

**8. Công cụ SIEM (Security Information and Event Management):**

- SIEM giúp tổ chức giám sát và phân tích dữ liệu nhật ký để phát hiện các mối đe dọa.
- SIEM hiện tại có nhiều tùy chọn dashboard nhưng vẫn yêu cầu sự can thiệp của con người để phân tích sự kiện bảo mật.
- Tương lai của SIEM bao gồm SIEM đám mây, tích hợp IoT, AI, học máy và SOAR.
- Các công cụ SIEM phổ biến bao gồm Splunk và Chronicle.

**9. Các Công cụ An ninh Mạng:**

- Có hai loại công cụ chính: mã nguồn mở và độc quyền.
- **Công cụ mã nguồn mở** miễn phí, cho phép tùy chỉnh, ví dụ như Linux và Suricata.
- **Công cụ độc quyền** yêu cầu phí sử dụng, ví dụ như Splunk® và Chronicle SIEM.
- Việc lựa chọn công cụ phụ thuộc vào nhu cầu bảo mật và ngân sách của tổ chức.

**10. Ứng dụng SIEM để bảo vệ tổ chức:**

- Các dashboard SIEM quan trọng bao gồm Security Posture, Executive Summary, Incident Review, và Risk Analysis (Splunk).
- Các dashboard của Chronicle SIEM bao gồm Enterprise Insights, Data Ingestion & Health, IOC Matches, Main Dashboard, Rule Detections và User Sign-In Overview.
- SIEM giúp tổ chức giám sát, phân tích dữ liệu bảo mật, phát hiện sớm các rủi ro và xử lý các mối đe dọa.
