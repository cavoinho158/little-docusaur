---
title: "Assets, Threats, and Vulnerabilities - Week 1 (3)"
sidebar_position: 26
---

## Bảo mật Pipeline CI/CD: Bảo vệ quy trình phát triển phần mềm 🛡️🚀

CI/CD (Continuous Integration, Continuous Delivery, và Continuous Deployment) là nền tảng của phát triển phần mềm hiện đại, giúp tự động hóa quy trình từ viết mã đến triển khai. Tuy nhiên, nếu không được bảo mật đúng cách, CI/CD có thể trở thành điểm yếu lớn trong hệ thống. Dưới đây là tóm tắt về các lỗ hổng phổ biến trong CI/CD và cách áp dụng các biện pháp bảo mật để bảo vệ quy trình này.

### CI/CD là gì và Tại sao nó quan trọng? 🌐

- **Continuous Integration (CI)**: Tích hợp liên tục mã từ các nhà phát triển khác nhau vào một kho lưu trữ chung, kích hoạt các quy trình tự động như build và test.
- **Continuous Delivery (CD)**: Đảm bảo mã luôn sẵn sàng để triển khai, thường yêu cầu sự chấp thuận thủ công trước khi đưa vào môi trường production.
- **Continuous Deployment (CD)**: Tự động triển khai mã vào môi trường production mà không cần sự can thiệp thủ công.

### Lợi ích bảo mật của CI/CD 🛡️

- **Tích hợp kiểm tra bảo mật tự động**: Bao gồm các công cụ như DAST (Dynamic Application Security Testing) và kiểm tra tuân thủ bảo mật.
- **Giảm rủi ro**: Các bản phát hành nhỏ và thường xuyên giúp dễ dàng phát hiện và sửa lỗi bảo mật.
- **Cải thiện chất lượng mã**: Kiểm tra bảo mật tự động giúp phát hiện lỗ hổng sớm trong quá trình phát triển.

### Các lỗ hổng phổ biến trong CI/CD ⚠️

1. **Phụ thuộc không an toàn (Insecure Dependencies)**:

   - **Mô tả**: Sử dụng các thư viện và thành phần bên thứ ba có lỗ hổng.
   - **Giải pháp**: Quét và cập nhật các phụ thuộc thường xuyên.

2. **Cấu hình quyền truy cập sai (Misconfigured Permissions)**:

   - **Mô tả**: Kiểm soát truy cập yếu cho phép kẻ tấn công thay đổi mã hoặc cấu hình pipeline.
   - **Giải pháp**: Áp dụng RBAC (Role-Based Access Control) và MFA (Multi-Factor Authentication).

3. **Thiếu kiểm tra bảo mật tự động (Lack of Automated Security Testing)**:

   - **Mô tả**: Không tích hợp các công cụ như SAST (Static Application Security Testing) và DAST.
   - **Giải pháp**: Đưa kiểm tra bảo mật tự động vào quy trình CI/CD.

4. **Lộ thông tin nhạy cảm (Exposed Secrets)**:

   - **Mô tả**: Mã hóa cứng các thông tin nhạy cảm như API keys và mật khẩu.
   - **Giải pháp**: Sử dụng các công cụ quản lý thông tin nhạy cảm như HashiCorp Vault.

5. **Môi trường build không an toàn (Unsecured Build Environments)**:
   - **Mô tả**: Môi trường CI/CD bị tấn công có thể dẫn đến việc thay đổi mã hoặc đánh cắp dữ liệu.
   - **Giải pháp**: Bảo mật môi trường build bằng cách sử dụng container hoặc máy ảo an toàn.

### Xây dựng Pipeline CI/CD an toàn 🛠️

1. **Tích hợp bảo mật từ đầu (DevSecOps)**: Đưa bảo mật vào mọi giai đoạn phát triển.
2. **Kiểm soát truy cập chặt chẽ**: Sử dụng RBAC và MFA để hạn chế quyền truy cập.
3. **Tự động hóa kiểm tra bảo mật**: Sử dụng SAST, DAST và SCA (Software Composition Analysis) để phát hiện lỗ hổng sớm.
4. **Cập nhật phụ thuộc thường xuyên**: Sử dụng các công cụ như Dependabot để quản lý và cập nhật các thư viện bên thứ ba.
5. **Quản lý thông tin nhạy cảm an toàn**: Không mã hóa cứng thông tin nhạy cảm, sử dụng các công cụ quản lý thông tin nhạy cảm.

### Kết luận 📌

- **Bảo mật CI/CD** là yếu tố không thể thiếu để đảm bảo quy trình phát triển phần mềm an toàn và hiệu quả.
- Bằng cách tích hợp các biện pháp bảo mật vào CI/CD, bạn có thể giảm thiểu rủi ro và tăng cường khả năng phục hồi của hệ thống.
- Các công cụ và phương pháp như SAST, DAST, RBAC, và quản lý thông tin nhạy cảm là chìa khóa để xây dựng một pipeline CI/CD an toàn.

### Tài nguyên tham khảo 📚

- [DevSecOps Using GitHub Actions](https://medium.com/@rahulsharan512/devsecops-using-github-actions-building-secure-ci-cd-pipelines-5b6d59acab32)
- [6 Steps for CI/CD Security Hardening](https://spectralops.io/blog/ci-cd-security-hardening/)
- [GitLab CI/CD - Hands-On Lab](https://handbook.gitlab.com/handbook/customer-success/professional-services-engineering/education-services/gitlabcicdhandsonlab9/)

---

## OWASP Top 10: Các lỗ hổng bảo mật Phổ biến trong ứng dụng Web 🛡️🌐

OWASP (Open Worldwide Application Security Project) là một tổ chức phi lợi nhuận tập trung vào việc cải thiện bảo mật phần mềm. Một trong những tài nguyên quan trọng nhất của OWASP là **OWASP Top 10**, một danh sách các lỗ hổng bảo mật phổ biến nhất trong ứng dụng web. Dưới đây là tóm tắt về OWASP Top 10 và các lỗ hổng chính mà các tổ chức cần lưu ý.

### OWASP Top 10 là gì? 📜

- **Mục đích**: OWASP Top 10 là danh sách các lỗ hổng bảo mật phổ biến nhất trong ứng dụng web, được cập nhật định kỳ để phản ánh các xu hướng và rủi ro mới.
- **Đối tượng**: Áp dụng chủ yếu cho phần mềm mới hoặc tùy chỉnh, giúp các tổ chức tập trung nỗ lực vào các lỗ hổng phổ biến nhất.
- **Cập nhật**: Danh sách được cập nhật vài năm một lần dựa trên tần suất phát hiện và mức độ rủi ro của các lỗ hổng.

### Các lỗ hổng phổ biến trong OWASP Top 10 ⚠️

1. **Kiểm soát truy cập bị hỏng (Broken Access Control)**:

   - **Mô tả**: Lỗ hổng xảy ra khi các cơ chế kiểm soát truy cập không hoạt động đúng cách, cho phép người dùng truy cập trái phép vào dữ liệu hoặc chức năng.
   - **Ví dụ**: Người dùng có thể xóa bài viết mà họ không có quyền.

2. **Lỗi mã hóa (Cryptographic Failures)**:

   - **Mô tả**: Dữ liệu nhạy cảm không được mã hóa đúng cách, dẫn đến nguy cơ rò rỉ thông tin.
   - **Ví dụ**: Sử dụng thuật toán băm yếu như MD5.

3. **Tấn công Injection**:

   - **Mô tả**: Kẻ tấn công chèn mã độc vào ứng dụng để thực thi các lệnh không mong muốn.
   - **Ví dụ**: SQL Injection trong form đăng nhập.

4. **Thiết kế không an toàn (Insecure Design)**:

   - **Mô tả**: Ứng dụng được thiết kế mà không tích hợp các biện pháp bảo mật cần thiết.
   - **Ví dụ**: Thiếu kiểm soát truy cập hoặc xác thực yếu.

5. **Cấu hình bảo mật sai (Security Misconfiguration)**:

   - **Mô tả**: Các cài đặt bảo mật không được thiết lập hoặc duy trì đúng cách.
   - **Ví dụ**: Sử dụng cài đặt mặc định trên máy chủ.

6. **Thành phần lỗi thời và dễ bị tấn công (Vulnerable and Outdated Components)**:

   - **Mô tả**: Sử dụng các thư viện hoặc thành phần phần mềm lỗi thời, dễ bị khai thác.
   - **Ví dụ**: Sử dụng phiên bản cũ của thư viện mã nguồn mở.

7. **Lỗi xác thực và nhận dạng (Identification and Authentication Failures)**:

   - **Mô tả**: Ứng dụng không xác thực người dùng một cách chính xác, dẫn đến truy cập trái phép.
   - **Ví dụ**: Form đăng nhập không kiểm tra mật khẩu yếu.

8. **Lỗi toàn vẹn phần mềm và dữ liệu (Software and Data Integrity Failures)**:

   - **Mô tả**: Các bản cập nhật hoặc bản vá không được kiểm tra kỹ lưỡng trước khi triển khai.
   - **Ví dụ**: Tấn công chuỗi cung ứng (Supply Chain Attack) như vụ SolarWinds.

9. **Lỗi ghi nhật ký và giám sát bảo mật (Security Logging and Monitoring Failures)**:

   - **Mô tả**: Không ghi lại hoặc giám sát đầy đủ các sự kiện bảo mật.
   - **Ví dụ**: Không phát hiện được các đăng nhập bất thường.

10. **Tấn công giả mạo yêu cầu phía máy chủ (Server-Side Request Forgery - SSRF)**:
    - **Mô tả**: Kẻ tấn công lợi dụng ứng dụng để gửi yêu cầu trái phép đến máy chủ.
    - **Ví dụ**: Đọc hoặc cập nhật dữ liệu nhạy cảm trên máy chủ.

### Kết luận 📌

- **OWASP Top 10** là một tài nguyên quan trọng giúp các tổ chức hiểu và phòng chống các lỗ hổng bảo mật phổ biến trong ứng dụng web.
- Bằng cách tập trung vào các lỗ hổng này, các tổ chức có thể cải thiện đáng kể tư thế bảo mật của họ.
- Các chuyên gia bảo mật nên thường xuyên cập nhật kiến thức về OWASP Top 10 để đối phó với các rủi ro mới nhất.

### Tài nguyên tham khảo 📚

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [SolarWinds Cyber Attack (2020)](https://www.cisa.gov/solarwinds)

---

## **Tình báo mã nguồn mở (OSINT) trong An ninh Mạng 🔍**

### **1. OSINT là gì?**

Tình báo mã nguồn mở (**OSINT - Open Source Intelligence**) là quá trình thu thập và phân tích thông tin từ các nguồn công khai để tạo ra tri thức có giá trị. Trong lĩnh vực an ninh mạng, OSINT giúp xác định **các mối đe dọa**, **lỗ hổng bảo mật**, và **các nguy cơ tiềm ẩn** đối với hệ thống.

### **2. Thông tin vs. Tình báo 📊**

- **Thông tin (Information)**: Dữ liệu thô được thu thập từ nhiều nguồn khác nhau (blog, diễn đàn, mạng xã hội, báo cáo bảo mật...).
- **Tình báo (Intelligence)**: Thông tin sau khi được phân tích, tổng hợp và đưa vào ngữ cảnh cụ thể để hỗ trợ ra quyết định.

Ví dụ: Khi một bản cập nhật hệ điều hành mới xuất hiện, nếu chỉ thu thập danh sách các lỗi bảo mật, đó là thông tin. Nhưng khi phân tích các rủi ro tiềm tàng và đề xuất chiến lược cập nhật an toàn, đó là tình báo.

### **3. Ứng dụng OSINT trong An ninh Mạng 🔐**

OSINT đóng vai trò quan trọng trong **quản lý lỗ hổng bảo mật (Vulnerability Management)** và **bảo vệ hệ thống trước các cuộc tấn công mạng**. Một số ứng dụng chính bao gồm:

- **Giám sát các cuộc tấn công mạng**: Theo dõi diễn đàn hacker, darknet để phát hiện các mối đe dọa mới.
- **Phát hiện rò rỉ dữ liệu**: Kiểm tra xem thông tin nhạy cảm của tổ chức có bị lộ trên internet không.
- **Đánh giá hệ thống phòng thủ**: Xác định điểm yếu trong bảo mật và đề xuất biện pháp khắc phục.
- **Tìm kiếm lỗ hổng chưa được vá**: Phát hiện các CVE hoặc khai thác zero-day có thể ảnh hưởng đến hệ thống.

### **4. Công cụ OSINT phổ biến 🛠️**

Dưới đây là một số công cụ OSINT giúp thu thập thông tin về an ninh mạng:

- **[VirusTotal](https://www.virustotal.com/)**: Phân tích file, URL, IP để phát hiện mã độc.
- **[MITRE ATT&CK](https://attack.mitre.org/)**: Cơ sở dữ liệu về chiến thuật, kỹ thuật tấn công mạng.
- **[OSINT Framework](https://osintframework.com/)**: Danh sách các công cụ OSINT phục vụ cho nhiều mục đích khác nhau.
- **[Have I Been Pwned](https://haveibeenpwned.com/)**: Kiểm tra xem email/tài khoản có bị lộ trong các vụ vi phạm dữ liệu không.

Ngoài ra, còn có nhiều công cụ khác như **Shodan**, **Maltego**, **Recon-ng**, **theHarvester**, giúp thu thập dữ liệu từ nhiều nguồn trên internet.

### **5. Kết luận 📌**

OSINT là một phương pháp quan trọng giúp các chuyên gia an ninh mạng phát hiện lỗ hổng, theo dõi mối đe dọa, và bảo vệ hệ thống trước các cuộc tấn công. Việc hiểu rõ cách sử dụng OSINT sẽ giúp bạn chủ động hơn trong việc phòng chống rủi ro và bảo vệ thông tin quan trọng của tổ chức.
