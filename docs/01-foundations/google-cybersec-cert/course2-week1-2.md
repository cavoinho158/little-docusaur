---
title: "Play It Safe: Manage Security Risks - Week 1 (2)"
sidebar_position: 7
---

> _"Oáp ~ Buồn ngủ quá đi (￣ ￣|||) hôm qua lỡ thức khuya cày phim quá ..."_ \

Xin chào mọi người nha, hôm nay tôi và cậu ấy học bù cho mấy hôm trước nghỉ và trễ tiến độ. Mọi người còn nhớ Security Frameworks, Controls & Compliance và Security Audits được nhắc đến trước đó không, ở bài [Course1-week2-2](./course1-week2-2) á. Hôm nay tôi và cậu ấy đã được tìm hiểu chi tiết hơn về nội dung này á, 2 chúng tôi cũng dần hiểu được sự liên kết của các thành phần bảo mật và quy trình bảo mật trong tổ chức rồi. Bài hôm nay hơi dài, mọi người cố gắng đọc hết nha.

> _"Cà phê nè" - Cậu ấy nói trong khi đưa tôi ly cà phê sữa nóng thơm phức_ \
> _"Thank you~ À mà có người mới cảm ơn mấy bài blog của tụi mình á! Họ nói những bài blog tạo động lực cho họ." - Tôi nhận ly cà phê và nói với giọng hớn hở_ \
> _"Hmmm... Thế thì tốt rồi, tiếp tục cố gắng thôi" - Cậu ấy cười mỉm, đắc chí_ \
> _"Okay!"_

## 🔐 Mối quan hệ giữa Frameworks và Controls trong An ninh Mạng

Frameworks và controls là hai yếu tố quan trọng giúp tổ chức bảo vệ dữ liệu và hệ thống trước các mối đe dọa an ninh. Việc áp dụng đúng framework và triển khai các controls phù hợp giúp giảm thiểu rủi ro và tuân thủ quy định bảo mật.

- **Frameworks** là các hướng dẫn được xây dựng để hỗ trợ tổ chức quản lý rủi ro và bảo vệ dữ liệu. Một số framework phổ biến:

  - **NIST RMF & CSF**: Cung cấp quy trình quản lý rủi ro và bảo mật.
  - **Cyber Threat Framework (CTF)**: Ngôn ngữ chung để mô tả và chia sẻ thông tin về mối đe dọa mạng.
  - **ISO/IEC 27001**: Tiêu chuẩn quốc tế giúp quản lý an ninh thông tin.

- **Security controls** là các biện pháp được triển khai để giảm rủi ro bảo mật. Controls có thể thuộc các nhóm sau:

  - **📌 Physical Controls:** Cổng, hàng rào, camera giám sát, thẻ truy cập.
  - **🖥️ Technical Controls:** Firewall, xác thực đa yếu tố (MFA), phần mềm diệt virus.
  - **📝 Administrative Controls:** Phân quyền, phân loại tài sản, kiểm soát truy cập.

📌 _Frameworks và controls kết hợp giúp tổ chức đạt được mục tiêu bảo mật và tuân thủ quy định._

---

### 🔐 Ứng dụng CIA Triad để bảo vệ dữ liệu

CIA Triad bao gồm **Confidentiality (Bảo mật), Integrity (Toàn vẹn) và Availability (Khả dụng)**. Đây là mô hình nền tảng giúp các tổ chức xây dựng hệ thống bảo mật hiệu quả.

| 🌐 **Thành Phần**   | 🔍 **Mô Tả**                                                                                           |
| ------------------- | ------------------------------------------------------------------------------------------------------ |
| **Confidentiality** | Chỉ cho phép người dùng có quyền truy cập dữ liệu. Ví dụ: sử dụng nguyên tắc _least privilege_.        |
| **Integrity**       | Đảm bảo dữ liệu chính xác và không bị chỉnh sửa trái phép. Ví dụ: sử dụng _mã hóa_ để bảo vệ dữ liệu.  |
| **Availability**    | Đảm bảo dữ liệu luôn có sẵn khi cần. Ví dụ: hỗ trợ nhân viên truy cập từ xa nhưng vẫn duy trì bảo mật. |

📌 _Việc áp dụng đúng CIA Triad giúp tổ chức xây dựng hệ thống an ninh vững chắc và đáng tin cậy._

---

### 🔐 Nguyên tắc bảo mật OWASP

OWASP (Open Worldwide Application Security Project) đưa ra các nguyên tắc giúp bảo vệ ứng dụng khỏi các rủi ro bảo mật. Một số nguyên tắc quan trọng:

- 📖 Nguyên Tắc Cơ Bản

  - **📉 Minimize Attack Surface Area:** Giảm thiểu số lượng điểm dễ bị tấn công.
  - **🔑 Principle of Least Privilege:** Hạn chế quyền truy cập ở mức tối thiểu.
  - **🛡️ Defense in Depth:** Áp dụng nhiều lớp bảo vệ để giảm thiểu rủi ro.
  - **⚖️ Separation of Duties:** Phân tách trách nhiệm để tránh lạm dụng quyền lực.
  - **🛠️ Fix Security Issues Correctly:** Khi sửa lỗi bảo mật, cần tìm hiểu nguyên nhân gốc rễ và đảm bảo lỗi không tái diễn.

- 📖 Nguyên Tắc Mở Rộng

  - **🔐 Establish Secure Defaults:** Cấu hình bảo mật phải là thiết lập mặc định.
  - **🚦 Fail Securely:** Khi hệ thống gặp lỗi, nó phải trở về trạng thái an toàn.
  - **❌ Don’t Trust Services:** Không nên mặc định tin tưởng dịch vụ bên thứ ba.
  - **🕵️‍♂️ Avoid Security by Obscurity:** Bảo mật không nên chỉ dựa vào việc che giấu thông tin.

📌 _Các nguyên tắc OWASP giúp tổ chức xây dựng và duy trì hệ thống an toàn, bảo vệ người dùng và dữ liệu._

---

### 🎯 Kết luận

- **Frameworks và controls kết hợp giúp tổ chức quản lý rủi ro và tuân thủ quy định bảo mật.**
- **CIA Triad đóng vai trò quan trọng trong việc xây dựng chiến lược bảo vệ dữ liệu.**
- **OWASP cung cấp các nguyên tắc bảo mật giúp tăng cường an ninh ứng dụng và hệ thống.**

---

## 🔍 Kiểm toán bảo mật (Security Audits)

### 📌 Giới thiệu

Kiểm toán bảo mật là một quy trình đánh giá các biện pháp kiểm soát an ninh, chính sách và quy trình của tổ chức để đảm bảo tuân thủ các tiêu chuẩn nội bộ và quy định bên ngoài. Đây là một công cụ quan trọng giúp xác định và khắc phục rủi ro bảo mật trước khi chúng trở thành mối đe dọa nghiêm trọng.

### 🎯 Mục tiêu của kiểm toán bảo mật

- **Đảm bảo tuân thủ quy định**: Xác minh rằng tổ chức đáp ứng các yêu cầu của các tiêu chuẩn như **ISO 27001**, **NIST CSF**, **HIPAA**, **GDPR**.
- **Xác định điểm yếu bảo mật**: Kiểm tra các chính sách, kiểm soát bảo mật hiện có và đề xuất cải tiến.
- **Cải thiện khả năng ứng phó sự cố**: Xây dựng quy trình khắc phục và tăng cường bảo mật.
- **Duy trì an ninh hệ thống**: Đảm bảo hệ thống hoạt động an toàn, bảo vệ dữ liệu và tài sản số.

### 🔑 Các yếu tố ảnh hưởng đến kiểm toán

Tùy theo tổ chức, việc thực hiện kiểm toán bảo mật sẽ bị ảnh hưởng bởi các yếu tố sau:

| 🏢 **Yếu Tố**              | 🔍 **Mô Tả**                                                          |
| -------------------------- | --------------------------------------------------------------------- |
| **Loại hình doanh nghiệp** | Ngành nghề hoạt động quyết định mức độ nghiêm ngặt của kiểm toán.     |
| **Quy mô tổ chức**         | Doanh nghiệp lớn có hệ thống phức tạp hơn, yêu cầu kiểm toán sâu hơn. |
| **Yêu cầu pháp lý**        | Các quy định như GDPR, HIPAA có ảnh hưởng lớn đến phạm vi kiểm toán.  |
| **Vị trí địa lý**          | Luật pháp từng quốc gia có thể quy định mức độ kiểm toán khác nhau.   |
| **Mức độ cam kết bảo mật** | Một số tổ chức tự nguyện áp dụng các tiêu chuẩn bảo mật cao hơn.      |

### 🛠️ Vai trò của Frameworks Và Controls trong kiểm toán

Frameworks và security controls đóng vai trò quan trọng trong việc đảm bảo tổ chức đáp ứng các yêu cầu bảo mật:

- **Frameworks phổ biến**:

  - **NIST CSF** – Hướng dẫn quản lý rủi ro và cải thiện bảo mật.
  - **ISO 27001** – Tiêu chuẩn quốc tế về quản lý an toàn thông tin.
  - **CIS Controls** – Bộ kiểm soát an ninh quan trọng giúp bảo vệ hệ thống.

- **Các loại security controls được kiểm tra**:
  - **📌 Administrative Controls:** Phân quyền, đào tạo nhân viên, chính sách bảo mật.
  - **🖥️ Technical Controls:** Firewall, mã hóa, xác thực đa yếu tố (MFA).
  - **🏢 Physical Controls:** Hệ thống camera giám sát, kiểm soát truy cập.

📌 _Kết hợp frameworks và controls giúp tổ chức chuẩn bị tốt hơn cho kiểm toán bảo mật._

### 📝 Checklist kiểm toán bảo mật

Trước khi thực hiện kiểm toán, cần xây dựng danh sách các hạng mục quan trọng:

1. **📍 Xác định phạm vi kiểm toán**
   - Xác định tài sản cần đánh giá (hệ thống mạng, cơ sở dữ liệu, thiết bị bảo mật).
   - Xác định mục tiêu kiểm toán (đáp ứng quy định, phát hiện rủi ro bảo mật, v.v.).
2. **⚖️ Đánh giá rủi ro**
   - Kiểm tra rủi ro về ngân sách, kiểm soát nội bộ, quy trình bảo mật.
   - So sánh với tiêu chuẩn bảo mật và quy định pháp lý hiện hành.
3. **🔍 Tiến hành kiểm toán**
   - Kiểm tra các tài sản theo phạm vi đã xác định.
   - Thực hiện đánh giá lỗ hổng và kiểm tra khả năng khắc phục.
4. **🛡️ Lập kế hoạch giảm thiểu rủi ro**
   - Đề xuất giải pháp khắc phục các điểm yếu bảo mật.
   - Xây dựng kế hoạch cải tiến bảo mật để giảm thiểu rủi ro.
5. **📢 Báo cáo và giao tiếp với stakeholders**
   - Cung cấp báo cáo chi tiết về các phát hiện.
   - Đưa ra khuyến nghị để cải thiện bảo mật và tuân thủ quy định.
