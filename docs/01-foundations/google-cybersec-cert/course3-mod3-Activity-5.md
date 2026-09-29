---
title: "Course3 - Module4 Portfolio Activity: Use the NIST Cybersecurity Framework to respond to a security incident"
sidebar_position: 18
---

## Tổng quan hoạt động

Trong bài thực hành này, bạn sẽ tạo một báo cáo sự cố bảo mật bằng cách sử dụng kiến thức về mạng và áp dụng **Khung Bảo mật An ninh Mạng (NIST CSF)** của Viện Tiêu chuẩn và Công nghệ Quốc gia Hoa Kỳ. NIST CSF là một khung tự nguyện bao gồm các tiêu chuẩn, hướng dẫn và thực tiễn tốt nhất để quản lý rủi ro an ninh mạng. Báo cáo này sẽ giúp bạn cải thiện kỹ năng phân tích và quản lý sự cố bảo mật, đồng thời có thể thêm vào hồ sơ nghề nghiệp của bạn.

---

## Kịch bản

Bạn là một nhà phân tích bảo mật làm việc cho một công ty đa phương tiện cung cấp dịch vụ thiết kế web, đồ họa và marketing trên mạng xã hội cho các doanh nghiệp nhỏ. Tổ chức của bạn vừa trải qua một cuộc tấn công **DDoS** (Từ chối Dịch vụ Phân tán), khiến mạng nội bộ ngừng hoạt động trong 2 giờ.

- **Nguyên nhân**: Kẻ tấn công đã gửi một lượng lớn gói tin **ICMP** vào mạng thông qua một tường lửa chưa được cấu hình đúng cách.
- **Hậu quả**: Mạng nội bộ bị quá tải, không thể truy cập tài nguyên mạng.
- **Phản ứng**: Nhóm quản lý sự cố đã chặn các gói tin ICMP, tạm dừng các dịch vụ không quan trọng và khôi phục các dịch vụ thiết yếu.

Sau sự cố, nhóm bảo mật đã thực hiện các biện pháp sau:

- Thêm quy tắc tường lửa để giới hạn tốc độ gói tin ICMP.
- Kiểm tra địa chỉ IP nguồn để phát hiện IP giả mạo.
- Triển khai phần mềm giám sát mạng để phát hiện lưu lượng bất thường.
- Cài đặt hệ thống **IDS/IPS** để lọc lưu lượng ICMP đáng ngờ.

---

## Hướng dẫn từng bước

### Bước 1: Truy cập mẫu báo cáo

- Sử dụng mẫu báo cáo phân tích sự cố: [Mẫu báo cáo](https://docs.google.com/document/d/1EnieOKYJyKGsVff5Gg-3-dVwrHrZ2m8Hig6tVpfKqyg/template/preview?usp=sharing&resourcekey=0-eb5t-d69zTPLEGthIpVlXw).

### Bước 2: Tóm tắt sự cố

- Cung cấp thông tin về sự cố, nguyên nhân, tác động và phản ứng. Bao gồm:
  - Hệ thống bị ảnh hưởng.
  - Nguồn tấn công.
  - Tác động ước tính.

### Bước 3: Xác định loại tấn công và hệ thống bị ảnh hưởng

- Xác định loại tấn công (DDoS) và các hệ thống bị ảnh hưởng. Ghi thông tin vào phần **"Identify"** của báo cáo.

### Bước 4: Bảo vệ tài sản của tổ chức

- Đề xuất các biện pháp để bảo vệ tài sản khỏi các sự cố tương tự. Ví dụ:
  - Cập nhật quy tắc tường lửa.
  - Kiểm tra cấu hình hệ thống định kỳ.
- Ghi câu trả lời vào phần **"Protect"**.

### Bước 5: Phát hiện sự cố trong tương lai

- Đề xuất các phương pháp giám sát mạng để phát hiện hoạt động đáng ngờ, chẳng hạn:
  - Theo dõi lưu lượng ICMP từ các IP không đáng tin cậy.
  - Phân biệt người dùng được ủy quyền và không được ủy quyền.
- Ghi câu trả lời vào phần **"Detect"**.

### Bước 6: Phản ứng với sự cố trong tương lai

- Tạo kế hoạch phản ứng cho các sự cố bảo mật trong tương lai. Xem xét:
  - Cách ngăn chặn và cách ly sự cố.
  - Thủ tục để vô hiệu hóa sự cố.
  - Dữ liệu cần thu thập để phân tích.
- Ghi câu trả lời vào phần **"Respond"**.

### Bước 7: Khôi phục sau sự cố

- Đề xuất các bước để khôi phục hệ thống sau sự cố. Xem xét:
  - Thông tin cần khôi phục ngay lập tức.
  - Quy trình khôi phục hiện có.
- Ghi câu trả lời vào phần **"Recover"**.

---

## Mẫu báo cáo hoàn chỉnh

Bạn có thể tham khảo mẫu báo cáo hoàn chỉnh tại đây: [Mẫu báo cáo hoàn chỉnh](https://docs.google.com/document/d/1iPlKsGAVw1usT8JiR_CgGbL6rut783h_RCH-J8PavuA/template/preview).

---

## Những điểm cần lưu ý

- **Tóm tắt sự cố**: Cung cấp thông tin chi tiết về sự cố, nguyên nhân và phản ứng.
- **Xác định loại tấn công**: Phân tích loại tấn công (DDoS) và hệ thống bị ảnh hưởng.
- **Bảo vệ tài sản**: Đề xuất các biện pháp bảo vệ như cập nhật tường lửa và kiểm tra cấu hình.
- **Phát hiện sự cố**: Đề xuất phương pháp giám sát mạng để phát hiện hoạt động đáng ngờ.
- **Phản ứng và khôi phục**: Tạo kế hoạch phản ứng và khôi phục chi tiết.

---

## Bài học rút ra

- Áp dụng NIST CSF giúp tổ chức quản lý rủi ro bảo mật một cách hệ thống.
- Báo cáo sự cố chi tiết và kế hoạch phản ứng hiệu quả giúp ngăn chặn các sự cố tương tự trong tương lai.
- Các biện pháp như giám sát mạng, cập nhật tường lửa và kiểm tra định kỳ là chìa khóa để bảo vệ hệ thống.
