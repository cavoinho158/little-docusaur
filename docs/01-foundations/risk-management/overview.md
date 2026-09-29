---
title: Tiêu chuẩn và biện pháp kiểm soát quan trọng trong Quản lý rủi ro & An toàn thông tin
sidebar_position: 1
---

Trong thời đại số hóa, an toàn thông tin đã trở thành một yếu tố không thể thiếu đối với mọi tổ chức. Việc tuân thủ các tiêu chuẩn và khuôn khổ quản lý không chỉ giúp tổ chức xây dựng một hệ thống bảo mật hiệu quả mà còn đảm bảo sự tuân thủ các quy định pháp lý và giảm thiểu rủi ro. Đối với các chuyên gia bảo mật, đặc biệt là SOC Analyst và Incident Responder, việc hiểu rõ và áp dụng các tiêu chuẩn như **ISO/IEC 27035, 27001, 27002, 27005, ISO 31000, NIST 800-61, NIST CSF, và MITRE ATT&CK** là vô cùng quan trọng. Bài viết này sẽ đi sâu vào từng tiêu chuẩn/khuôn khổ, cung cấp cái nhìn chi tiết và hướng dẫn cách áp dụng chúng trong thực tế.

Ehe, mọi người thấy mở bài vậy ok hong :b tôi và cậu ấy mới nhờ GPT viết thử, do lười và không có ý tưởng gì để viết, nghĩ chắc mọi người cũng chán cách mở bài bình thường rồi. Dù sao thì cám ơn mọi người đã theo dõi đến tận đây nha. Hi vọng bài viết này có ích cho mọi người.

---

## 1. ISO/IEC 27035 : Quản lý sự cố an toàn thông tin

### Tổng quan

ISO/IEC 27035 là tiêu chuẩn quốc tế cung cấp quy trình quản lý sự cố an toàn thông tin. Tiêu chuẩn này được chia thành ba phần chính:

1. **Nguyên tắc chung về quản lý sự cố**: Cung cấp tổng quan về quy trình xử lý sự cố, bao gồm các khái niệm cơ bản và mục tiêu của quản lý sự cố.
2. **Lập kế hoạch và chuẩn bị**: Hướng dẫn cách tổ chức xây dựng chính sách, quy trình và công cụ cần thiết để sẵn sàng ứng phó với sự cố.
3. **Ứng phó sự cố**: Chi tiết các bước xử lý sự cố từ khi phát hiện đến khi kết thúc, bao gồm cả việc hồi phục và học hỏi từ sự cố.

### Cách áp dụng

- **Xây dựng quy trình xử lý sự cố**: Tổ chức nên tuân theo mô hình **Chuẩn bị → Phát hiện → Ứng phó → Hồi phục → Học hỏi**. Mỗi giai đoạn cần được lập kế hoạch kỹ lưỡng và liên tục cải tiến.
- **Thiết lập chính sách và hướng dẫn**: Sử dụng ISO/IEC 27035 để xây dựng các chính sách và hướng dẫn xử lý sự cố trong SOC (Security Operations Center). Điều này bao gồm việc xác định vai trò và trách nhiệm của từng thành viên trong đội ứng phó sự cố.
- **Kết hợp với hệ thống SIEM**: Các hệ thống SIEM (Security Information and Event Management) có thể được tích hợp để phát hiện sự cố nhanh chóng và tự động hóa một phần quy trình ứng phó.

---

## 2. ISO/IEC 27001 & 27002 : Quản lý và kiểm soát an toàn thông tin

### ISO/IEC 27001 : Hệ thống quản lý an toàn thông tin (ISMS)

- **Mục tiêu**: ISO/IEC 27001 xác định các yêu cầu để thiết lập, triển khai, duy trì và liên tục cải tiến hệ thống quản lý an toàn thông tin (ISMS). Tiêu chuẩn này yêu cầu tổ chức đánh giá rủi ro và chọn các biện pháp kiểm soát phù hợp để giảm thiểu rủi ro.
- **Quy trình PDCA**: ISO/IEC 27001 dựa trên mô hình PDCA (Plan-Do-Check-Act) để đảm bảo hệ thống ISMS được liên tục cải tiến.
- Một trong những tổ chức cung cấp chứng nhận tại Việt Nam: [KNA CERT](https://knacert.com.vn/)

_Xem thêm tại: [Youtube](https://www.youtube.com/watch?v=jPA6gbsT2IQ)_

### ISO/IEC 27002 : Hướng dẫn thực hành kiểm soát an toàn thông tin

- **Danh sách biện pháp kiểm soát**: ISO/IEC 27002 cung cấp danh sách 93 biện pháp kiểm soát bảo mật, được chia thành 4 nhóm chính:
  - **Kiểm soát tổ chức (Organizational Controls)**: Bao gồm các chính sách, quy trình và cấu trúc quản lý.
  - **Kiểm soát con người (People Controls)**: Tập trung vào đào tạo, nhận thức và quản lý nhân sự.
  - **Kiểm soát công nghệ (Technological Controls)**: Bao gồm các biện pháp kỹ thuật như mã hóa, tường lửa, và hệ thống phát hiện xâm nhập.
  - **Kiểm soát vật lý (Physical Controls)**: Đảm bảo an toàn vật lý cho các tài sản như máy chủ, phòng dữ liệu.

_Xem thêm tại: [Youtube](https://www.youtube.com/watch?v=A7oeQYcfJz0)_

### Điểm khác biệt trong bản cập nhật 2022

Dưới đây là tóm tắt những thay đổi chính của **ISO/IEC 27001:2022** và **ISO/IEC 27002:2022** so với phiên bản 2013:

1. Cấu trúc và phạm vi thay đổi

   - **ISO/IEC 27001:2022**: Cập nhật một số điều khoản (4-10) để làm rõ yêu cầu và bổ sung quy định về lập kế hoạch thay đổi ISMS.
   - **ISO/IEC 27002:2022**: Thay đổi lớn về cách tổ chức biện pháp kiểm soát an toàn thông tin.

2. Giảm số lượng và tái cấu trúc biện pháp kiểm soát

   - **Biện pháp kiểm soát giảm từ 114 còn 93**, tái nhóm thành **4 nhóm chính** (thay vì 14 nhóm trước đây):
     - **Kiểm soát tổ chức (37)**
     - **Kiểm soát con người (8)**
     - **Kiểm soát vật lý (14)**
     - **Kiểm soát công nghệ (34)**

3. Biện pháp kiểm soát mới (11 biện pháp)

   - Bổ sung các kiểm soát để phù hợp với xu hướng bảo mật hiện đại, bao gồm:

     - **An toàn thông tin cho dịch vụ đám mây**
     - **Thông tin về mối đe dọa**
     - **Sẵn sàng CNTT cho kinh doanh liên tục**
     - **Quản lý cấu hình**
     - **Giám sát an ninh vật lý**
     - **Xóa thông tin an toàn**
     - **Che giấu dữ liệu**
     - **Ngăn chặn rò rỉ dữ liệu**
     - **Giám sát hoạt động**
     - **Lọc web**
     - **Lập trình an toàn**

4. Hợp nhất và cải tiến biện pháp kiểm soát cũ

   - **24 biện pháp được tạo ra từ 56 biện pháp cũ** (loại bỏ trùng lặp).
   - **58 biện pháp kiểm soát được cập nhật** để phù hợp với bối cảnh an ninh thông tin hiện tại.

5. Giới thiệu các thuộc tính cho biện pháp kiểm soát

- Các biện pháp kiểm soát mới được gán thêm thuộc tính giúp quản lý linh hoạt hơn, như:
  - **Loại kiểm soát**: Phòng ngừa, phát hiện, khắc phục
  - **Thuộc tính an toàn thông tin**: Bảo mật, toàn vẹn, sẵn sàng
  - **Khung an ninh mạng**: Xác định, bảo vệ, phát hiện, phản hồi, phục hồi
  - **Khả năng vận hành và Miền bảo mật**

_Xem chi tiết tại: [VNPT Cyber Immunity](https://sec.vnpt.vn/2023/04/nhung-thay-doi-cua-iso-iec-270012022/), [isosig](https://www.isosig.com/tieu-chuan-iso-270012013-so-voi-270012022-da-co-gi-thay-doi/), [KNA Cert](https://knacert.com.vn/blogs/tin-tuc/nhung-dieu-can-biet-ve-ban-cap-nhat-isoiec-270012022)_

### Cách áp dụng

- **Triển khai ISO 27001**: Tổ chức cần triển khai ISO 27001 để đảm bảo hệ thống bảo mật tuân thủ các tiêu chuẩn quốc tế. Điều này bao gồm việc đánh giá rủi ro và chọn lọc các biện pháp kiểm soát phù hợp.
- **Sử dụng ISO 27002**: ISO 27002 được sử dụng để chọn lọc và triển khai các biện pháp kiểm soát cụ thể. SOC có thể dùng tiêu chuẩn này để thiết lập các chính sách bảo mật dữ liệu và quản lý truy cập.
- **Đánh giá và cải tiến liên tục**: Tổ chức cần thường xuyên đánh giá hiệu quả của các biện pháp kiểm soát và cải tiến hệ thống ISMS dựa trên kết quả đánh giá.

---

## 3. ISO/IEC 27005 : Quản lý rủi ro an toàn thông tin

### Tổng quan

- **Mục tiêu**: ISO/IEC 27005 cung cấp hướng dẫn chi tiết về đánh giá và quản lý rủi ro an toàn thông tin. Tiêu chuẩn này kết hợp tốt với ISO 31000 để đưa ra chiến lược giảm thiểu rủi ro hiệu quả.
- **Quy trình quản lý rủi ro**: Bao gồm các bước như xác định tài sản, đánh giá mối đe dọa, đánh giá rủi ro và lựa chọn biện pháp kiểm soát.

_Xem thêm tại: [Youtube](https://www.youtube.com/watch?v=_bSPApZ-hQc)_

### Cách áp dụng

- **Xác định tài sản quan trọng**: Tổ chức cần xác định các tài sản thông tin quan trọng và các mối đe dọa có thể ảnh hưởng đến chúng.
- **Đánh giá rủi ro**: Sử dụng các phương pháp đánh giá rủi ro để xác định mức độ rủi ro và ưu tiên các biện pháp kiểm soát.
- **Kết hợp với MITRE ATT&CK**: Tổ chức có thể sử dụng MITRE ATT&CK để đánh giá các kỹ thuật tấn công của kẻ địch và điều chỉnh chiến lược quản lý rủi ro phù hợp.

---

## 4. ISO 31000 : Quản lý rủi ro tổng quát

### Tổng quan

- **Mục tiêu**: ISO 31000 định nghĩa quy trình quản lý rủi ro tổng quát, không chỉ giới hạn trong an toàn thông tin mà còn áp dụng cho các lĩnh vực khác như tài chính, vận hành và quản lý dự án.
- **Nguyên tắc quản lý rủi ro**: Bao gồm việc xác định, đánh giá, xử lý và giám sát rủi ro.

### Cách áp dụng

- **Kết hợp với ISO/IEC 27005**: Tổ chức có thể kết hợp ISO 31000 với ISO/IEC 27005 để xây dựng chiến lược giảm thiểu rủi ro trong an toàn thông tin.
- **Tích hợp vào chiến lược kinh doanh**: Quản lý rủi ro cần được tích hợp vào chiến lược kinh doanh tổng thể của tổ chức để đảm bảo sự đồng bộ và hiệu quả.

---

## 5. NIST 800-61 : Hướng dẫn xử lý sự cố an toàn thông tin

### Tổng quan

- **Mô hình phản ứng sự cố**: NIST 800-61 cung cấp hướng dẫn chi tiết về quy trình xử lý sự cố an toàn thông tin với 4 giai đoạn chính:
  1. **Chuẩn bị**: Xây dựng quy trình và công cụ phát hiện sự cố.
  2. **Phát hiện & phân tích**: Sử dụng các công cụ như SIEM, IDS/IPS để nhận diện sự cố.
  3. **Ứng phó**: Điều tra, cô lập và xử lý sự cố.
  4. **Hậu sự cố**: Báo cáo, đánh giá và cải thiện quy trình.

### Cách áp dụng

- **Xây dựng quy trình chuẩn hóa**: Tổ chức nên xây dựng quy trình phản ứng sự cố chuẩn hóa theo hướng dẫn của NIST 800-61.
- **Kết hợp với ISO/IEC 27035**: Kết hợp NIST 800-61 với ISO/IEC 27035 để có chiến lược ứng phó toàn diện hơn.

---

## 6. NIST Cybersecurity Framework (NIST CSF)

### Tổng quan

- Là một khung quản lý an toàn thông tin giúp tổ chức đánh giá, cải thiện khả năng bảo mật và quản lý rủi ro. CSF bao gồm 5 chức năng chính:

  - **Identify** (Xác định)
  - **Protect** (Bảo vệ)
  - **Detect** (Phát hiện)
  - **Respond** (Phản hồi)
  - **Recover** (Khôi phục)

- **Mục tiêu**: Giúp tổ chức xây dựng và đánh giá chiến lược bảo mật một cách toàn diện.

### Cách áp dụng

- **Đánh giá và cải thiện**: SOC có thể sử dụng NIST CSF để đánh giá và cải thiện mức độ bảo mật của tổ chức.
- **Kết hợp với CIS Controls**: Kết hợp NIST CSF với CIS Controls để đảm bảo tổ chức tuân thủ các thực hành tốt nhất về an ninh mạng.

---

## 7. MITRE ATT&CK : Ma trận kỹ thuật tấn công

### Tổng quan

- **Cơ sở dữ liệu kỹ thuật tấn công**: MITRE ATT&CK là cơ sở dữ liệu các kỹ thuật tấn công được sử dụng trong thực tế, chia thành nhiều giai đoạn từ **Initial Access** đến **Exfiltration**.
- **Mục tiêu**: Giúp tổ chức hiểu rõ các kỹ thuật tấn công và xây dựng chiến lược phòng thủ phù hợp.

### Cách áp dụng

- **Phát hiện và điều tra**: SOC Analyst có thể sử dụng MITRE ATT&CK để phát hiện và điều tra các cuộc tấn công.
- **Tích hợp với SIEM**: Tích hợp MITRE ATT&CK với các hệ thống SIEM để giám sát hành vi bất thường dựa trên các **kỹ thuật tấn công đã biết**.

---

## **Kết luận**

Mỗi tiêu chuẩn và khuôn khổ đều có vai trò riêng trong việc xây dựng và duy trì hệ thống an toàn thông tin. Tuy nhiên, việc kết hợp chúng một cách hợp lý sẽ giúp tổ chức tạo ra một hệ thống bảo mật vững chắc và toàn diện:

- **ISO/IEC 27035 + NIST 800-61** → Xây dựng quy trình xử lý sự cố hiệu quả.
- **ISO/IEC 27001 + 27002 + 27005 + ISO 31000** → Quản lý an toàn thông tin và rủi ro một cách hệ thống.
- **NIST CSF + MITRE ATT&CK** → Phát hiện và phòng chống các mối đe dọa một cách chủ động.

Việc áp dụng các tiêu chuẩn này không chỉ giúp tổ chức tuân thủ các quy định pháp lý mà còn nâng cao khả năng phòng thủ trước các mối đe dọa ngày càng tinh vi. 🚀
