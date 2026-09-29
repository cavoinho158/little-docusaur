---
title: "Put It to Work: Prepare for Cybersecurity Jobs - Week 1"
sidebar_position: 34
---

Chào mọi người, lâu rồi không gặp. Hình như cũng gần 1 tháng rồi nhỉ? Chúng tôi vừa xong đợt đồ án giữa kì nên đã quay lại rồi đây. Trước tiên thì cám ơn mọi người vì vẫn xem đến tận đây, mặc dù tôi biết chất lượng nội dung đã giảm đi nhiều. Tiếp theo thì đây là Course 8 - course cuối cùng, và Course 7 chúng tôi sẽ không đề cập đến vì đó chỉ là nhập môn lập trình với Python mà chắc chắn mọi người đều đã biết tới rồi, hoặc ít nhất mọi người có thể học chi tiết hơn, dành nhiều thời gian hơn ở khóa học khác.

Tổng quan nội dung thì Course 8 này sẽ gồm phân loại sự cố, sự leo thang và cách giao tiếp với các bên liên quan. Khóa học này kết thúc chương trình với các mẹo về cách tham gia với cộng đồng an ninh mạng và chuẩn bị cho việc tìm kiếm việc làm.

## Phân loại dữ liệu và tài sản (Data and Asset Classification)

### 🔐 Phân loại dữ liệu (Data Classification)

Mục tiêu: Giúp bảo vệ thông tin của tổ chức khỏi các rủi ro bảo mật và tấn công mạng bằng cách xác định mức độ nhạy cảm của dữ liệu.

| **Loại dữ liệu**           | **Mô tả**                                                                                 | **Ví dụ**                                                        |
| -------------------------- | ----------------------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| **Public (Công khai)**     | Dữ liệu công khai, ít rủi ro nếu bị chia sẻ. Tuy vậy, vẫn cần bảo vệ cơ bản.              | Thông cáo báo chí, mô tả công việc, tài liệu marketing           |
| **Private (Riêng tư)**     | Không công khai, nếu bị truy cập trái phép có thể gây hại nghiêm trọng cho tổ chức.       | Email công ty, mã nhân viên, dữ liệu nghiên cứu nội bộ           |
| **Sensitive (Nhạy cảm)**   | Cần được bảo vệ nghiêm ngặt, truy cập trái phép có thể gây thiệt hại tài chính và uy tín. | Số tài khoản ngân hàng, số CMND/CCCD, mật khẩu, dữ liệu y tế     |
| **Confidential (Tối mật)** | Rất quan trọng với hoạt động của tổ chức, chỉ có số ít người được quyền truy cập.         | Bí mật thương mại, báo cáo tài chính, dữ liệu chính phủ nhạy cảm |

### 🧱 Phân loại tài sản (Asset Classification)

Phân loại dựa trên **mức độ quan trọng và nhạy cảm** đối với tổ chức:

| **Mức độ tài sản**   | **Mô tả**                                                                               | **Ví dụ**                                               |
| -------------------- | --------------------------------------------------------------------------------------- | ------------------------------------------------------- |
| **Low-level asset**  | Ít quan trọng, nếu bị lộ sẽ không ảnh hưởng nhiều.                                      | Địa chỉ trang web, thông tin tuyển dụng                 |
| **High-level asset** | Rất quan trọng, rò rỉ có thể ảnh hưởng nặng nề đến danh tiếng, tài chính và sự tin cậy. | Email nội bộ chứa bí mật kinh doanh, dữ liệu khách hàng |

### ✅ Key Takeaways

- Mỗi tổ chức có chính sách phân loại dữ liệu riêng.
- Hiểu rõ các loại dữ liệu và tài sản giúp bạn:
  - **Ưu tiên bảo vệ thông tin quan trọng nhất**
  - **Áp dụng biện pháp bảo mật phù hợp cho từng loại tài sản**

---

## Disaster Recovery và Business Continuity

### 🔒 Mục tiêu chung

- Bảo vệ tổ chức khỏi các rủi ro và giảm thiểu hậu quả nếu sự cố bảo mật xảy ra.
- **Disaster Recovery (Khôi phục sau thảm họa)** và **Business Continuity (Duy trì hoạt động kinh doanh)** là **bộ đôi kế hoạch quan trọng** giúp tổ chức phục hồi sau sự cố.

### 🔄 Quy trình 4 bước đảm bảo an toàn cho tổ chức

1. **Xác định tài sản quan trọng** cần được bảo vệ.
2. **Xác định các mối đe dọa** có thể ảnh hưởng đến tài sản đó.
3. **Triển khai công cụ và quy trình phát hiện** mối đe dọa.
4. **Xây dựng kế hoạch Business Continuity và Disaster Recovery.**

### 📘 **Business Continuity Plan (BCP)** – Kế hoạch duy trì hoạt động

Mục tiêu: Đảm bảo hoạt động của tổ chức **tiếp tục diễn ra bình thường hoặc sớm khôi phục** sau gián đoạn.

**4 bước chính trong BCP:**

- **Phân tích tác động kinh doanh (Business Impact Analysis):** Đánh giá tổn thất nếu gián đoạn xảy ra.
- **Xây dựng các bước phục hồi:** Hành động cụ thể để khôi phục chức năng kinh doanh quan trọng.
- **Tổ chức đội phản ứng:** Gồm thành viên từ các bộ phận như IT, bảo mật, nhân sự, truyền thông...
- **Huấn luyện đội phản ứng:** Tập luyện các tình huống giả lập để phản ứng nhanh khi sự cố thật xảy ra.

### 💻 **Disaster Recovery Plan (DRP)** – Kế hoạch khôi phục sau thảm họa

Mục tiêu: **Khắc phục hậu quả sau sự cố bảo mật**, ví dụ như tấn công ransomware.

**3 bước chính trong DRP:**

- **Khôi phục phần mềm:** Đảm bảo phần mềm hoạt động trở lại.
- **Khôi phục phần cứng:** Khắc phục hỏng hóc thiết bị vật lý.
- **Xác định ứng dụng và dữ liệu bị ảnh hưởng:** Để ưu tiên khôi phục và kiểm soát thiệt hại.
