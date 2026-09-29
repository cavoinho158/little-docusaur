---
title: Elastic Stack Overview
sidebar-position: 3
---

## Giới thiệu về Elastic Stack

Elastic Stack (hay ELK Stack) là một bộ công cụ mã nguồn mở được sử dụng để **thu thập, lưu trữ, phân tích và trực quan hóa dữ liệu** theo thời gian thực. Với khả năng xử lý lượng lớn dữ liệu đa dạng (log, metrics, APM...), Elastic Stack trở thành "trợ thủ đắc lực" cho các doanh nghiệp trong lĩnh vực **IT Operations, Security Analytics, và Business Intelligence**.

## Các thành phần chính của Elastic Stack

### 1. Elasticsearch

- **Vai trò**: Công cụ tìm kiếm và phân tích dữ liệu dựa trên nền tảng phân tán (distributed), hỗ trợ RESTful API.
- **Đặc điểm nổi bật**:
  - Lưu trữ dữ liệu dưới dạng JSON.
  - Sử dụng **Inverted Index** để tối ưu tốc độ tìm kiếm.
  - Khả năng mở rộng ngang (horizontal scaling) với cơ chế **sharding** và **replication**.
- **Kiến trúc**:
  - **Cluster**: Nhóm các node làm việc cùng nhau.
  - **Node**: Máy chủ riêng lẻ trong cluster.
  - **Index**: Tập hợp các dữ liệu liên quan (tương tự database trong SQL).
  - **Document**: Đơn vị dữ liệu nhỏ nhất (tương tự bản ghi).

### 2. Logstash

- **Vai trò**: Xử lý dữ liệu từ nhiều nguồn (log files, hệ thống, ứng dụng) trước khi đẩy vào Elasticsearch.
- **Pipeline**:
  - **Input**: Thu thập dữ liệu (từ file, Kafka, Beats...).
  - **Filter**: Lọc, chuyển đổi dữ liệu (Grok, Mutate, Date parsing...).
  - **Output**: Gửi dữ liệu đến Elasticsearch hoặc dịch vụ khác.
- **Ví dụ cấu hình**:

  ```ruby
  input {
    file {
      path => "/var/log/nginx/access.log"
    }
  }
  filter {
    grok {
      match => { "message" => "%{COMBINEDAPACHELOG}" }
    }
  }
  output {
    elasticsearch {
      hosts => ["localhost:9200"]
    }
  }
  ```

### 3. Kibana

- **Vai trò**: Trực quan hóa dữ liệu thông qua dashboard, biểu đồ, bản đồ.
- **Tính năng chính**:
  - **Discover**: Khám phá dữ liệu thô.
  - **Visualize**: Tạo biểu đồ (bar, pie, line), bảng, heatmap.
  - **Dashboard**: Kết hợp nhiều visualization vào một màn hình.
  - **Dev Tools**: Giao diện tương tác với Elasticsearch API.

### 4. Beats

- **Vai trò**: Các agent nhẹ thu thập dữ liệu từ client và gửi đến Elasticsearch/Logstash.
- **Các loại Beats phổ biến**:
  - **Filebeat**: Thu thập log files.
  - **Metricbeat**: Giám sát metrics (CPU, memory, service metrics).
  - **Packetbeat**: Phân tích lưu lượng mạng.
  - **Auditbeat**: Theo dõi hoạt động hệ thống.

## Cách Elastic Stack hoạt động

![Elastic Stack Workflow](https://www.elastic.co/guide/en/beats/libbeat/current/images/beats-platform.png)

1. **Thu thập dữ liệu**:
   - Beats/Logstash đọc dữ liệu từ nguồn (log, metrics, ứng dụng).
2. **Xử lý dữ liệu**:
   - Logstash lọc, chuyển đổi định dạng, làm giàu dữ liệu.
3. **Lưu trữ**:
   - Elasticsearch lập chỉ mục (indexing) và lưu trữ dữ liệu.
4. **Phân tích & Trực quan hóa**:
   - Kibana truy vấn Elasticsearch để hiển thị dashboard.

## Ưu điểm

- **Mã nguồn mở & linh hoạt**: Dễ dàng tùy chỉnh và tích hợp với các hệ thống khác.
- **Khả năng mở rộng**: Xử lý PB-level dữ liệu nhờ kiến trúc phân tán.
- **Tốc độ tìm kiếm**: Inverted Index và caching giúp truy vấn nhanh chóng.
- **Hệ sinh thái phong phú**: Hỗ trợ plugin (Logstash), module (Beats), và giải pháp như APM, SIEM.

## Nhược điểm

- **Độ phức tạp**: Cấu hình cluster Elasticsearch yêu cầu kiến thức chuyên sâu.
- **Tài nguyên phần cứng**: Cần nhiều RAM và CPU cho môi trường lớn.
- **Học tập tốn thời gian**: Ngôn ngữ truy vấn Elasticsearch (DSL) có độ phức tạp cao.
- **Chi phí**: Một số tính năng nâng cao (như machine learning) yêu cầu license trả phí.

## Ứng dụng thực tế

### 1. Giám sát hệ thống & log management

- **Ví dụ**: Công ty SaaS sử dụng Metricbeat và Filebeat để thu thập log server, kết hợp Kibana để cảnh báo lỗi thời gian thực.

### 2. Phân tích bảo mật (SIEM)

- **Ví dụ**: Tích hợp với OSSEC và ClamAV để phát hiện xâm nhập:
  - OSSEC gửi alert log đến Elasticsearch.
  - Kibana hiển thị dashboard theo dõi các mối đe dọa.

### 3. Phân tích kinh doanh

- **Ví dụ**: E-commerce sử dụng Elasticsearch để phân tích hành vi người dùng, tối ưu chiến dịch marketing. Ví dụ Netflix, dịch vụ truyền phát nội dung hàng đầu thế giới, sử dụng Elastic Stack để giám sát và phân tích các hoạt động dịch vụ khách hàng cũng như nhật ký liên quan đến bảo mật. Công ty cũng sử dụng ELK để sao chép tự động, sơ đồ linh hoạt và nhiều plugin, giúp đảm bảo trải nghiệm người dùng mượt mà và an toàn.

### 4. IoT & Real-time analytics

- **Ví dụ**: Trong lĩnh vực sản xuất công nghiệp, việc giám sát và phân tích dữ liệu từ các cảm biến IoT (Internet of Things) là vô cùng quan trọng. Cảm biến IoT gửi dữ liệu qua Logstash, Elasticsearch xử lý và Kibana hiển thị theo thời gian thực, giúp dự đoán và ngăn ngừa sự cố, tối ưu hóa quy trình sản xuất và giảm chi phí bảo trì. Ví dụ, việc sử dụng dữ liệu cảm biến để phân tích sức khỏe của thiết bị giúp phát hiện sớm các vấn đề tiềm ẩn, từ đó lập kế hoạch bảo trì dựa trên dữ liệu thực tế thay vì lịch trình cố định.

## Kết luận

Elastic Stack là giải pháp toàn diện cho bài toán quản lý dữ liệu với 4 trụ cột: **thu thập - xử lý - lưu trữ - trực quan hóa**. Dù có một số thách thức về kỹ thuật và tài nguyên, Elastic Stack vẫn là lựa chọn hàng đầu nhờ tính linh hoạt, hiệu suất cao và cộng đồng hỗ trợ mạnh mẽ. Từ DevOps đến Data Analyst, việc làm chủ Elastic Stack sẽ mở ra cánh cửa giải quyết bài toán dữ liệu ở mọi quy mô.

---

**Tài Liệu Tham Khảo**:

- [Elastic Official Documentation](https://www.elastic.co/guide/index.html)
- [ELK Stack for Beginners (Udemy Course)](https://www.udemy.com/course/elasticsearch-7-and-elastic-stack/)
- [Blog: How Netflix Uses Elasticsearch](https://netflixtechblog.com/)
- [Smart Industry](https://smartindustry.vn/technology/internet-of-things/ung-dung-phan-tich-iot-cong-nghiep-voi-elastic-stack/?utm_source=chatgpt.com)
- [AWS Amazon](https://aws.amazon.com/vi/what-is/elk-stack/?utm_source=chatgpt.com=)
