---
title: "Assets, Threats, and Vulnerabilities - Week 1 (4)"
sidebar_position: 27
---

## **Các phương pháp quét lỗ hổng bảo mật**

### **Quét lỗ hổng là gì?**

Quét lỗ hổng bảo mật là quá trình tự động so sánh các lỗ hổng đã biết với các công nghệ trên mạng của tổ chức. Công cụ này giúp phát hiện **lỗi cấu hình sai** hoặc **lỗ hổng phần mềm**, từ đó hỗ trợ các nhóm bảo mật đưa ra chiến lược khắc phục phù hợp.

Các công cụ quét có thể phân tích **năm lớp bề mặt tấn công** trong mô hình phòng thủ nhiều lớp:

- **Lớp vành đai**: Hệ thống xác thực người dùng, tường lửa
- **Lớp mạng**: Các công nghệ bảo vệ mạng nội bộ
- **Lớp thiết bị đầu cuối**: Laptop, máy tính, máy chủ
- **Lớp ứng dụng**: Phần mềm người dùng tương tác
- **Lớp dữ liệu**: Dữ liệu đang lưu trữ, truyền tải hoặc sử dụng

Sau khi quét, công cụ so sánh kết quả với cơ sở dữ liệu lỗ hổng và cập nhật danh sách rủi ro.

### **Các loại quét lỗ hổng bảo mật**

#### **Quét bên ngoài vs. Quét bên trong**

- **Quét bên ngoài**: Kiểm tra hệ thống hướng ra ngoài như website, tường lửa để tìm cổng mạng hoặc máy chủ dễ bị tấn công.
- **Quét bên trong**: Kiểm tra các hệ thống nội bộ như phần mềm ứng dụng để phát hiện lỗi xử lý dữ liệu người dùng.

#### **Quét có xác thực vs. Không xác thực**

- **Quét có xác thực**: Sử dụng tài khoản người dùng (hoặc quản trị viên) để kiểm tra lỗi kiểm soát truy cập.
- **Quét không xác thực**: Mô phỏng kẻ tấn công bên ngoài, kiểm tra xem hệ thống có bị truy cập trái phép không.

#### **Quét giới hạn vs. Quét toàn diện**

- **Quét giới hạn**: Chỉ kiểm tra một số thiết bị cụ thể (ví dụ: kiểm tra tường lửa).
- **Quét toàn diện**: Quét tất cả thiết bị trong mạng, bao gồm hệ điều hành, cơ sở dữ liệu người dùng.

💡 **Mẹo**: Trước khi quét giới hạn hoặc toàn diện, nên thực hiện **quét khám phá (discovery scan)** để xác định danh sách thiết bị và cổng mạng trên hệ thống.

### **Kết luận**

Quét lỗ hổng là bước quan trọng trong đánh giá bảo mật của tổ chức. Kết quả quét giúp cải thiện **tuân thủ bảo mật**, **cập nhật hệ thống**, và **điều chỉnh quy trình vận hành**. Hiểu rõ cách thức hoạt động của từng loại quét sẽ giúp bạn tham gia hiệu quả vào các hoạt động bảo mật chủ động. 🚀

---

## **Tầm quan trọng của cập nhật phần mềm**

### **Bản vá bảo mật và cập nhật**

Một hệ thống không cập nhật giống như một ngôi nhà với cửa chưa khóa—kẻ tấn công có thể lợi dụng lỗ hổng để xâm nhập. **Cập nhật phần mềm** là cách để đóng các lỗ hổng này và bảo vệ hệ thống.

- **Bản vá (patch update)**: Cập nhật phần mềm hoặc hệ điều hành nhằm sửa lỗi bảo mật và khắc phục các lỗ hổng đã biết.
- **Lỗ hổng zero-day**: Lỗ hổng chưa được phát hiện trước đó và bị khai thác trước khi có bản vá.

### **Các chiến lược cập nhật phổ biến**

#### **Cập nhật thủ công**

- **Ưu điểm**: Người dùng hoặc bộ phận IT có toàn quyền kiểm soát, tránh cài đặt bản cập nhật chưa được kiểm thử kỹ.
- **Nhược điểm**: Có thể quên hoặc bỏ qua các bản cập nhật quan trọng.

#### **Cập nhật tự động**

- **Ưu điểm**: Đơn giản hóa quá trình cập nhật, đảm bảo hệ thống luôn được bảo vệ.
- **Nhược điểm**: Nếu bản cập nhật chưa được kiểm thử kỹ, có thể gây lỗi hiệu suất.  
  💡 **Mẹo**: CISA khuyến nghị nên bật cập nhật tự động khi có thể.

---

### **Rủi ro của phần mềm hết hạn hỗ trợ (EOL)**

- **Phần mềm hết hạn (End-of-life - EOL)**: Nhà phát triển ngừng cung cấp bản vá bảo mật, khiến hệ thống dễ bị tấn công.
- **Rủi ro bảo mật**: Tội phạm mạng có thể khai thác một thiết bị IoT hoặc hệ thống không được cập nhật để tấn công mạng.
- **Khuyến nghị**: **CISA khuyên không nên sử dụng phần mềm EOL**, nhưng nhiều tổ chức vẫn giữ lại do chi phí thay thế cao.

### **Kết luận**

Cập nhật phần mềm giúp ngăn chặn nhiều cuộc tấn công mạng nghiêm trọng. **Ví dụ**: **WannaCry (2017)** đã gây thiệt hại **4 tỷ USD** và lây nhiễm hơn **150 quốc gia**, trong khi lỗ hổng đó đã được vá trước đó vài tháng. Việc duy trì cập nhật hệ thống có thể mất thời gian nhưng mang lại lợi ích bảo mật lâu dài. 🚀

---

## **Kiểm thử xâm nhập (Penetration testing)**

### **Khái niệm về kiểm thử xâm nhập**

Kiểm thử xâm nhập (**Penetration testing - Pen test**) là một cuộc tấn công giả lập nhằm xác định lỗ hổng trong hệ thống, mạng, website hoặc ứng dụng. Không giống với **đánh giá lỗ hổng (vulnerability assessment)** chỉ tìm kiếm điểm yếu, **pen test khai thác trực tiếp** các điểm yếu đó để đánh giá hậu quả tiềm ẩn khi hệ thống bị tấn công.

Ví dụ: **Một ngân hàng thực hiện pen test** để kiểm tra xem ứng dụng ngân hàng trực tuyến có lỗ hổng cho phép kẻ tấn công đánh cắp dữ liệu hoặc chuyển tiền trái phép hay không.

💡 **Lưu ý**: Các tổ chức tuân theo **PCI DSS, HIPAA, GDPR** bắt buộc phải thực hiện kiểm thử xâm nhập định kỳ để duy trì tiêu chuẩn bảo mật.

### **Các phương pháp kiểm thử xâm nhập**

1. **Red team**: Mô phỏng tấn công nhằm tìm kiếm lỗ hổng bảo mật.
2. **Blue team**: Tập trung vào phòng thủ và phản ứng sự cố.
3. **Purple team**: Kết hợp giữa red team và blue team để cải thiện bảo mật tổng thể.

📌 **Red team testing thường do chuyên gia pen test bên ngoài thực hiện**, nhưng các tổ chức lớn có thể có nhóm pen test nội bộ.

### **Chiến lược kiểm thử xâm nhập**

1. **Open-box testing (White-box)**: Tester có quyền truy cập như nhân viên nội bộ (cấu trúc hệ thống, sơ đồ mạng).
2. **Closed-box testing (Black-box)**: Tester không có thông tin nội bộ, mô phỏng hacker tấn công từ bên ngoài.
3. **Partial knowledge testing (Gray-box)**: Tester có quyền hạn hạn chế, giống như nhân viên bình thường.

📌 **Black-box testing mô phỏng tấn công thực tế tốt nhất**, nhưng tất cả phương pháp đều cung cấp **thông tin quan trọng** về khả năng tấn công vào hệ thống.

### **Làm thế nào để trở thành Pen Tester?**

Pen testers là **các chuyên gia an ninh mạng được săn đón**, đòi hỏi kỹ năng về:

- **Bảo mật mạng và ứng dụng**
- **Hệ điều hành (Linux, Windows)**
- **Phân tích lỗ hổng, mô hình mối đe dọa**
- **Công cụ phát hiện & phản ứng sự cố**
- **Ngôn ngữ lập trình (Python, BASH)**
- **Kỹ năng giao tiếp & báo cáo**

📌 **Bug bounty** là một cách tuyệt vời để thực hành. Các chương trình như **HackerOne** cung cấp tiền thưởng cho các chuyên gia tìm ra lỗ hổng bảo mật.

### **Kết luận**

Tấn công mạng là **mối đe dọa lớn** đối với doanh nghiệp. **Kiểm thử xâm nhập giúp tổ chức đánh giá khả năng phòng thủ**, tìm ra lỗ hổng trước khi kẻ tấn công khai thác. Đây là một lĩnh vực **đầy tiềm năng**, với nhiều cơ hội cho chuyên gia bảo mật phát triển sự nghiệp trong **ethical hacking**. 🚀
