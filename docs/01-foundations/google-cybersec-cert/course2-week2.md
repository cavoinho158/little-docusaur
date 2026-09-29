---
title: "Play It Safe: Manage Security Risks - Week 2"
sidebar_position: 8
---

Xin chào mọi người, 2 ngày vừa rồi tôi và cậu ấy sốt và nhức đầu liên tục thành ra không học được gì. Nay tôi và cậu ấy vừa tiêm ngừa về, tranh thủ học nốt phần còn lại của Course 2. Mọi người còn nhớ về SIEM, SOAR được nhắc đến ở khóa học Let's Defend chứ? Hôm nay sẽ nhắc lại một chút nha.

Bắt đầu thôi.

## 🔍 Tương lai của công cụ SIEM

Công cụ **SIEM (Security Information and Event Management)** là một phần quan trọng trong quản lý bảo mật, giúp tổ chức giám sát và phân tích dữ liệu nhật ký để phát hiện các mối đe dọa an ninh. Khi công nghệ và kỹ thuật tấn công mạng ngày càng phát triển, SIEM cũng đang thay đổi để đáp ứng nhu cầu bảo vệ tổ chức và người dùng.

### 📊 Công cụ SIEM hiện tại

- **Chức năng chính**: Thu thập, phân tích và giám sát nhật ký bảo mật theo thời gian thực, tạo cảnh báo nếu phát hiện log đáng ngờ.
- **Cung cấp nhiều tùy chọn bảng điều khiển (dashboard)**: Giúp nhóm bảo mật theo dõi và quản lý dữ liệu dễ dàng.
- **Hạn chế hiện tại**: Hầu hết các công cụ SIEM hiện nay vẫn yêu cầu sự can thiệp của con người để phân tích sự kiện bảo mật.

### 🚀 Tương Lai Của SIEM

- ☁️ SIEM Đám Mây (Cloud SIEM)

  - **Cloud-hosted SIEM**: Được duy trì bởi nhà cung cấp, truy cập qua internet, giảm chi phí cơ sở hạ tầng.
  - **Cloud-native SIEM**: Tận dụng hoàn toàn lợi thế của điện toán đám mây, bao gồm **khả năng mở rộng, linh hoạt, và tính sẵn sàng cao**.

- 🌐 Internet of Things (IoT) & SIEM

  - Sự gia tăng các thiết bị **IoT** dẫn đến **mở rộng bề mặt tấn công**.
  - SIEM cần thích ứng để **xử lý lượng dữ liệu lớn hơn và các mối đe dọa mới**.

- 🤖 Trí tuệ nhân tạo (AI) và học máy (ML)

  - Cải thiện khả năng **phân tích dữ liệu**, nhận diện **thuật ngữ liên quan đến mối đe dọa**.
  - **Cải tiến giao diện dashboard**, giúp trực quan hóa dữ liệu tốt hơn.

- 🔄 Tự Động Hóa và SOAR
  - **Tích hợp với SOAR (Security Orchestration, Automation, and Response)** để tự động hóa phản hồi sự cố.
  - Giúp **tăng tốc độ xử lý sự cố**, giảm sự phụ thuộc vào can thiệp thủ công.

## 🎯 Kết luận

- **SIEM tiếp tục phát triển để đáp ứng các mối đe dọa an ninh ngày càng tinh vi.**
- **Điện toán đám mây, IoT, AI, và tự động hóa sẽ là những yếu tố thúc đẩy sự thay đổi của SIEM.**
- **Là một nhà phân tích bảo mật, cập nhật về xu hướng SIEM giúp bạn thích ứng và phát triển trong lĩnh vực an ninh mạng.**

---

## 🛠️ Các công cụ An ninh Mạng

Các công cụ an ninh mạng giúp phát hiện và xử lý các mối đe dọa, rủi ro và lỗ hổng bảo mật. Có hai loại công cụ chính: **công cụ mã nguồn mở (open-source)** và **công cụ độc quyền (proprietary)**. Mỗi loại có những ưu và nhược điểm riêng, phù hợp với các nhu cầu bảo mật khác nhau.

### 🔓 Công cụ mã nguồn mở (Open-Source Tools)

- **Miễn phí hoặc chi phí thấp**.
- **Cho phép tùy chỉnh**, phát triển dựa trên cộng đồng.
- **Mã nguồn công khai**, giúp dễ dàng kiểm tra và cải thiện bảo mật.

### 🐧 Ví dụ về công cụ mã nguồn mở

#### **Linux**

- Hệ điều hành mã nguồn mở phổ biến.
- Cho phép tùy chỉnh nhiều chức năng và sử dụng giao diện dòng lệnh.

#### **Suricata**

- Công cụ phân tích mạng và phát hiện mối đe dọa.
- Hỗ trợ giám sát lưu lượng mạng, phát hiện hành vi đáng ngờ.
- Được phát triển bởi **Open Information Security Foundation (OISF)**.

> _Linux và Suricata là hai công cụ quan trọng trong lĩnh vực an ninh mạng._

### 🔐 Công cụ độc quyền (Proprietary Tools)

- **Phát triển và sở hữu bởi một công ty hoặc cá nhân**.
- **Yêu cầu phí sử dụng và đào tạo**.
- **Chỉ nhà phát triển có quyền truy cập và chỉnh sửa mã nguồn**.
- **Cập nhật phải chờ từ nhà cung cấp**.

### 💼 Ví dụ về công cụ độc quyền

- **Splunk®** – Công cụ SIEM giúp phân tích dữ liệu nhật ký.
- **Chronicle SIEM** – Hệ thống giám sát bảo mật dựa trên đám mây.

> _Các công cụ độc quyền thường đi kèm với hỗ trợ kỹ thuật chuyên nghiệp và tích hợp mạnh mẽ._

### ❗ Hiểu đúng về Open-Source vs. Proprietary

🔸 **Hiểu lầm phổ biến:** Open-source kém an toàn hơn proprietary.
🔹 **Sự thật:** Vì có mã nguồn công khai, cộng đồng có thể nhanh chóng phát hiện và sửa lỗi bảo mật.
🔸 **Công cụ mã nguồn mở đã trở thành tiêu chuẩn ngành** và được sử dụng rộng rãi trong nhiều tổ chức.

> _Sự lựa chọn giữa open-source và proprietary phụ thuộc vào nhu cầu bảo mật và ngân sách của tổ chức._

## 🎯 Kết luận

- **Công cụ mã nguồn mở và công cụ độc quyền đều có vai trò quan trọng trong an ninh mạng.**
- **Linux và Suricata là hai công cụ mã nguồn mở phổ biến.**
- **Splunk và Chronicle SIEM là ví dụ về công cụ độc quyền mạnh mẽ.**
- **Việc lựa chọn công cụ phù hợp giúp tăng cường bảo mật và quản lý rủi ro hiệu quả.**

---

## 🛡️ Sử dụng SIEM để bảo vệ tổ chức

### 📊 Các Bảng Điều Khiển SIEM Quan Trọng

#### 🔹 Splunk SIEM

Splunk cung cấp hai lựa chọn chính: **Splunk Enterprise** và **Splunk Cloud**. Cả hai đều hỗ trợ theo dõi dữ liệu tổ chức thông qua dashboard để quản lý cơ sở hạ tầng nội bộ.

| 📌 **Dashboard**      | 🔍 **Chức năng**                                                             |
| --------------------- | ---------------------------------------------------------------------------- |
| **Security Posture**  | Giám sát sự kiện bảo mật trong 24 giờ, giúp SOC theo dõi hoạt động đáng ngờ. |
| **Executive Summary** | Cung cấp cái nhìn tổng quan về tình trạng bảo mật của tổ chức.               |
| **Incident Review**   | Hiển thị dòng thời gian sự kiện để phân tích các sự cố bảo mật.              |
| **Risk Analysis**     | Theo dõi hành vi bất thường của người dùng, máy tính, IP để đánh giá rủi ro. |

#### 🔹 Chronicle SIEM (Google)

Chronicle là công cụ SIEM dựa trên **đám mây**, hỗ trợ tìm kiếm và phân tích dữ liệu nhật ký để phát hiện mối đe dọa.

| 📌 **Dashboard**            | 🔍 **Chức năng**                                                                                 |
| --------------------------- | ------------------------------------------------------------------------------------------------ |
| **Enterprise Insights**     | Xác định các cảnh báo và IoC (Indicators of Compromise - bằng chứng xâm nhập) với mức độ rủi ro. |
| **Data Ingestion & Health** | Theo dõi tình trạng dữ liệu nhật ký để đảm bảo thông tin không bị thiếu sót.                     |
| **IOC Matches**             | Hiển thị danh sách các mối đe dọa, giúp phân tích và ưu tiên xử lý.                              |
| **Main Dashboard**          | Tóm tắt các sự kiện bảo mật theo thời gian.                                                      |
| **Rule Detections**         | Theo dõi số lần phát hiện mối đe dọa dựa trên quy tắc bảo mật.                                   |
| **User Sign-In Overview**   | Giám sát hành vi đăng nhập của người dùng để phát hiện hoạt động bất thường.                     |

### 🚀 Tầm quan trọng của SIEM

- **🎯 Giúp tổ chức giám sát và phân tích dữ liệu bảo mật trong thời gian thực.**
- **🔎 Giúp phát hiện rủi ro sớm, xử lý các mối đe dọa trước khi gây hậu quả nghiêm trọng.**
- **🛡️ Hỗ trợ đánh giá rủi ro, phân tích sự cố và cải thiện chính sách bảo mật.**

### 🎯 Kết Luận

- **SIEM giúp tổ chức quản lý sự kiện bảo mật và xác định mối đe dọa kịp thời.**
- **Splunk và Chronicle là hai công cụ SIEM phổ biến với các bảng điều khiển hữu ích.**
- **Bảng điều khiển SIEM cung cấp dữ liệu trực quan giúp xử lý sự cố nhanh chóng và hiệu quả.**

> _Nắm vững SIEM là một kỹ năng quan trọng cho các chuyên gia an ninh mạng!_
