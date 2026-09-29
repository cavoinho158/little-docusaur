---
title: "Sound the Alarm: Detection and Response - Week 2(3)"
sidebar_position: 33
---

## Detection tools and techniques

### 🔐 Intrusion Detection System (IDS) là gì?

- Là công cụ giám sát hoạt động hệ thống và **phát hiện các hành vi xâm nhập**.
- Khi phát hiện bất thường, IDS sẽ **ghi log và gửi cảnh báo**.

### 🖥️ Các loại IDS

#### 1. **HIDS (Host-based IDS)**

![HIDS](<./img/course6-mod4(1).png>)

- Cài đặt trực tiếp trên **thiết bị đầu cuối (endpoint)** như máy tính, máy chủ.
- Giám sát hoạt động **nội bộ của từng thiết bị**, bao gồm:
  - Lưu lượng mạng
  - Hệ thống tệp
  - Tài nguyên hệ thống
  - Hoạt động của người dùng
- Ưu điểm: Phát hiện thay đổi hoặc hành vi bất thường ngay tại host.

#### 2. **NIDS (Network-based IDS)**

![NIDS](<./img/course6-mod4(2).png>)

- Cài đặt ở **các vị trí chiến lược trên mạng** (như router, switch, server).
- Giám sát lưu lượng mạng từ **nhiều thiết bị khác nhau**.
- Ưu điểm: Theo dõi toàn cảnh hoạt động mạng.

➡️ **Kết hợp HIDS và NIDS** mang lại khả năng giám sát **toàn diện** và **đa lớp**.

### 🔍 Kỹ thuật phát hiện của IDS

#### 1. Phân tích theo chữ ký (Signature-based Analysis)

- So sánh hoạt động hệ thống với **mẫu (chữ ký)** đã biết về hành vi tấn công.
- Ví dụ: So sánh mã độc với mẫu trong cơ sở dữ liệu.

**Ưu điểm:**

- **Ít cảnh báo sai (false positive)** vì chỉ phát hiện các mẫu đã biết.

**Nhược điểm:**

- **Không phát hiện được mối đe dọa mới (zero-day)**.
- Cần **cập nhật thường xuyên** chữ ký.
- Dễ bị **kẻ tấn công né tránh** nếu họ thay đổi mẫu hành vi.

#### 2. Phân tích bất thường (Anomaly-based Analysis)

- Phát hiện **hành vi bất thường** so với baseline (mức hoạt động bình thường).
- Gồm hai giai đoạn:
  - **Huấn luyện**: Tạo baseline từ dữ liệu thông thường.
  - **Phát hiện**: So sánh hành vi hiện tại với baseline.

**Ưu điểm:**

- Phát hiện **mối đe dọa mới và chưa biết**.

**Nhược điểm:**

- Dễ tạo ra **nhiều cảnh báo sai**.
- Nếu giai đoạn huấn luyện có sẵn mã độc thì **baseline sẽ sai lệch**.

### 📌 Key Takeaways

- **HIDS** giám sát thiết bị cá nhân, **NIDS** giám sát toàn bộ mạng.
- IDS giúp phát hiện các mối đe dọa bằng 2 kỹ thuật chính:
  - **Chữ ký**: hiệu quả với mối đe dọa đã biết.
  - **Bất thường**: phát hiện được mối đe dọa mới nhưng dễ sai.

---

Dưới đây là bản tóm tắt nội dung về **log sources và log ingestion**, cùng với các đường link tham khảo được giữ lại:

---

## 🛡️ Log Sources và Log Ingestion trong SIEM

### 1. **Tổng quan quy trình SIEM**

SIEM (Security Information and Event Management) hoạt động theo 3 bước chính:

1. **Thu thập và tổng hợp dữ liệu:** Thu thập log từ nhiều nguồn khác nhau.
2. **Chuẩn hóa dữ liệu:** Chuyển log sang định dạng chuẩn để dễ đọc và phân tích.
3. **Phân tích dữ liệu:** Phát hiện các hành vi bất thường bằng cách phân tích và liên kết các sự kiện.

Trong nội dung này, trọng tâm là **bước 1: thu thập và tổng hợp dữ liệu**.

### 2. Log Ingestion

- Là quá trình thu thập và nhập dữ liệu log vào công cụ SIEM.
- SIEM sẽ **sao chép log gốc** và lưu trữ bản sao để phục vụ phân tích mà không ảnh hưởng log gốc.
- Dữ liệu log có thể bao gồm: đăng nhập, hoạt động mạng, lỗi hệ thống, v.v.
- Tạo ra một nền tảng tập trung để analyst giám sát và phản ứng với các sự cố.

### 3. Log Forwarders

- **Log forwarder** là phần mềm tự động thu thập và gửi log đến SIEM.
- Một số hệ điều hành có sẵn log forwarder tích hợp.
- Với hệ thống không có sẵn, bạn có thể cài **log forwarder bên thứ ba** và cấu hình nơi gửi log (thường là SIEM).
- SIEM sau đó sẽ xử lý, chuẩn hóa và cho phép tìm kiếm, phân tích dữ liệu dễ dàng.

🔸 Một số SIEM sử dụng **log forwarder riêng** hoặc tích hợp với công cụ mã nguồn mở. Lựa chọn tool phù hợp phụ thuộc vào:

- Môi trường hệ thống
- Tính tương thích
- Nhu cầu giám sát cụ thể

### 🎯 Key Takeaways

- SIEM hiệu quả khi có đủ dữ liệu log đầu vào.
- Analyst cần hiểu quy trình log ingestion để xác định được **nguồn gốc** của sự cố bảo mật.
- Có thể được giao cấu hình SIEM để thu thập log đúng cách.

### 🔗 Tham khảo thêm

- [Hướng dẫn đưa dữ liệu vào Splunk](https://docs.splunk.com/Documentation/SplunkCloud/9.0.2303/Data/Howdoyouwanttoadddata)
- [Quy trình ingest dữ liệu vào Google Chronicle (Security Operations)](https://cloud.google.com/chronicle/docs/data-ingestion-flow)
- [Hướng dẫn đăng ký Splunk trên Coursera](https://www.coursera.org/learn/detection-and-response/supplement/Wg478/follow-along-guide-for-splunk-sign-up)

---

## Search methods with SIEM tools

### 🔍 Tìm kiếm sự kiện với SIEM tools

SIEM (Security Information and Event Management) giúp thu thập và phân tích log để giám sát các hoạt động quan trọng trong tổ chức. Các công cụ như **Splunk** và **Google SecOps (Chronicle)** cung cấp các phương pháp tìm kiếm khác nhau để hỗ trợ phân tích sự kiện bảo mật.

### ✅ Splunk Searches

![Splunk](<./img/course6-mod4(3).png>)

- **Ngôn ngữ tìm kiếm SPL (Search Processing Language)**: Dùng để truy vấn dữ liệu từ các chỉ mục (index).
- **Ví dụ cơ bản**:  
  `index=main fail` – Truy xuất các sự kiện có từ “fail” trong index tên “main”.

- **Pipe (`|`)**: Kết hợp nhiều lệnh lại với nhau.  
  Ví dụ:  
  `index=main fail | chart count by host` – Hiển thị biểu đồ số lần thất bại theo từng host.

- **Wildcard (`*`)**: Mở rộng tìm kiếm bằng ký tự đại diện.  
  `fail*` sẽ tìm các biến thể như “failed”, “failure”, v.v.

- **Dùng dấu ngoặc kép**: `"login failure"` – tìm kiếm chính xác cụm từ.

🔗 Tham khảo thêm về SPL:  
[Splunk's Search Reference](https://docs.splunk.com/Documentation/Splunk/9.0.2/SearchReference/UnderstandingSPLsyntax)

### ✅ Google SecOps (Chronicle) Searches

Có hai cách tìm kiếm chính:

#### 1. UDM (Unified Data Model) Search

- Là cách tìm kiếm mặc định, sử dụng dữ liệu đã được chuẩn hóa.
- Tìm kiếm nhanh hơn vì dữ liệu đã được phân tích và lập chỉ mục.
- Truy vấn dựa trên các trường như:
  - `metadata.event_type = “USER_LOGIN”` – Tìm sự kiện đăng nhập.

🔗 Tham khảo thêm về UDM field:  
[Google Security Operations UDM field list](https://cloud.google.com/chronicle/docs/reference/udm-field-list)

#### 2. Raw Log Search

- Dùng khi không tìm thấy thông tin trong dữ liệu chuẩn hóa.
- Tìm kiếm toàn bộ log thô, chậm hơn.
- Hỗ trợ **regular expressions** để lọc nâng cao.

🔗 Hướng dẫn Chronicle:  
[Google Security Operations quickstart guide](https://cloud.google.com/chronicle/docs/review-security-alert)

### 📌 Key takeaways

- Hiểu các phương pháp tìm kiếm trong SIEM sẽ giúp bạn truy xuất dữ liệu nhanh chóng và hiệu quả để hỗ trợ điều tra và ứng phó sự cố.
- Việc thành thạo SPL hoặc UDM Search sẽ giúp phân tích log chính xác và tiết kiệm thời gian.

🔗 Hướng dẫn SPL cơ bản:  
[Splunk’s Search Manual](https://docs.splunk.com/Documentation/Splunk/9.0.1/Search/GetstartedwithSearch)
