---
id: wazuh-siem-pipeline
title: Wazuh & Elastic SIEM Data Pipeline
sidebar_label: Wazuh & Elastic Pipeline
sidebar_position: 3
description: Hướng dẫn cấu hình thủ công và phân tích luồng dữ liệu (Data Pipeline) của hệ thống SIEM với Wazuh, Filebeat, Winlogbeat và Elasticsearch.
---

# Giai đoạn 3: Thực hành Cấu hình Thủ công & Deep Dive (SOC)

Giai đoạn này đánh dấu sự chuyển đổi từ việc "chạy tool/ansible cho xong" sang việc thực sự hiểu luồng dữ liệu (Data Pipeline) của một hệ thống SIEM. Dưới đây là các cấu hình đề xuất và giải thích "Vì sao" cho từng mục tiêu của bạn.

---

## 1 & 2. Filebeat/Winlogbeat gửi log về Elasticsearch

**❓ Vì sao cần bước này?**
Elasticsearch (hoặc OpenSearch) chỉ là một Database lưu trữ. Nó không tự đi lấy log được. Chúng ta cần các "Shipper" (như Filebeat/Winlogbeat) nằm ở các máy trạm (Endpoint) để đọc file log và đẩy qua mạng về Database.
*   **Filebeat:** Chuyên đọc text file (như `/var/log/syslog`, `/var/log/nginx/access.log`).
*   **Winlogbeat:** Chuyên móc vào Windows Event Viewer (Windows Event Log API) để đọc log hệ thống Windows.

**Cấu hình đề xuất (Filebeat - `filebeat.yml`):**
```yaml
filebeat.inputs:
- type: filestream
  id: my-nginx-logs
  enabled: true
  paths:
    - /var/log/nginx/access.log
  # Vì sao cần tags? Để lên Elasticsearch ta biết log này từ đâu ra, dễ bề filter.
  tags: ["web-tier", "nginx"]

output.elasticsearch:
  hosts: ["https://192.168.158.134:9200"]
  username: "admin"
  password: "YOUR_PASSWORD"
  ssl.verification_mode: none # Ở môi trường Lab chưa có CA chuẩn thì tắt verify
```

**💡 Lưu ý khi cài đặt:**
*   Khi start Filebeat, hãy dùng lệnh `filebeat test config` và `filebeat test output` để check kết nối đến ES trước.
*   Bạn sẽ thấy một Index mới tự động sinh ra trên Elasticsearch (VD: `filebeat-7.10.2-2026.09.18`).

---

## 3. Viết Logstash Pipeline Filter (Grok)

**❓ Vì sao cần Logstash & Grok?**
Log sinh ra từ Nginx hay Syslog là **log thô (Unstructured Text)** (Ví dụ: `192.168.1.1 - - [18/Sep/2026] "GET / HTTP/1.1" 200`). Elasticsearch không thể tìm kiếm theo field "IP" hay "Status Code" nếu ta không cắt cái chuỗi đó ra.
**Logstash** là trạm trung chuyển (ETL). **Grok** là bộ filter dùng Regex để "nhai" chuỗi thô đó và nhả ra JSON có cấu trúc.

**Cấu hình đề xuất (`/etc/logstash/conf.d/pipeline.conf`):**
```logstash
input {
  beats {
    port => 5044 # Mở port 5044 để Filebeat đẩy log vào đây thay vì đẩy thẳng lên ES
  }
}

filter {
  # Giả sử ta đang parse một dòng log tự chế: "SSH_FAIL from 10.0.0.5 user root"
  grok {
    match => { "message" => "%{WORD:action} from %{IP:attacker_ip} user %{USER:target_user}" }
  }
}

output {
  elasticsearch {
    hosts => ["https://192.168.158.134:9200"]
    index => "my-parsed-logs-%{+YYYY.MM.dd}"
    user => "admin"
    password => "YOUR_PASSWORD"
    ssl_certificate_verification => false
  }
  # Vì sao có stdout? Để in ra màn hình terminal xem Grok cắt đúng không khi debug (rất quan trọng)
  stdout { codec => rubydebug } 
}
```

---

## 4. Cài Wazuh Agent (Linux & Windows)

**❓ Vì sao dùng Wazuh Agent thay vì Filebeat?**
Filebeat chỉ làm đúng 1 việc: Đọc file và gửi đi.
Wazuh Agent thông minh hơn rất nhiều. Nó không chỉ đọc file (localfile) mà còn quét Rootkit, kiểm tra toàn vẹn file (FIM), đánh giá bảo mật OS (SCA) và nhận lệnh phản ứng từ Manager (Active Response).

**Cấu hình đề xuất (Linux - `/var/ossec/etc/ossec.conf`):**
```xml
<client>
  <server>
    <address>192.168.158.134</address>
    <!-- Vì sao port 1514? Đây là port giao tiếp mã hóa độc quyền của giao thức Wazuh -->
    <port>1514</port>
    <protocol>tcp</protocol>
  </server>
</client>
```

**💡 Lưu ý khi cài đặt:**
*   Agent sau khi cài xong **KHÔNG THỂ** gửi log ngay. Nó phải trải qua quá trình **Registration** (cầm chứng chỉ chứng thực từ Manager qua port `1515`). Khi cài thủ công, đừng quên bước enroll (dùng biến môi trường `WAZUH_MANAGER="192.168.158.134"` khi chạy lệnh cài đặt).

---

## 5. Viết Custom Rule/Decoder (SSH Failed Login)

**❓ Vì sao cần Custom Decoder & Rule?**
Wazuh đã có sẵn hàng ngàn rule. Tuy nhiên, nếu công ty bạn code ra một phần mềm riêng (in ra log theo chuẩn riêng của công ty), Wazuh mặc định sẽ không hiểu log đó. Bạn phải dạy cho nó cách đọc (Decoder) và khi nào thì báo động (Rule).

**Bước 1: Viết Decoder (Dạy Wazuh cách bóc tách log)** - `/var/ossec/etc/decoders/local_decoder.xml`
```xml
<!-- Log mẫu: "APP_ERROR: User admin failed to login from 10.0.0.2" -->
<decoder name="custom_app_auth">
  <prematch>^APP_ERROR:</prematch>
</decoder>

<decoder name="custom_app_auth_fields">
  <parent>custom_app_auth</parent>
  <!-- Vì sao dùng regex? Để trích xuất chữ "admin" thành field srcuser, "10.0.0.2" thành srcip -->
  <regex>User (\S+) failed to login from (\S+)</regex>
  <order>srcuser, srcip</order>
</decoder>
```

**Bước 2: Viết Rule (Dạy Wazuh khi nào cần báo động)** - `/var/ossec/etc/rules/local_rules.xml`
```xml
<group name="custom_app,">
  <rule id="100050" level="8">
    <decoded_as>custom_app_auth</decoded_as>
    <description>Custom App: Cảnh báo đăng nhập thất bại từ $(srcuser)</description>
  </rule>
</group>
```

---

## 6. Bật Module FIM và SCA

**❓ Vì sao FIM và SCA lại là "vũ khí tối thượng" của SOC?**
*   **FIM (File Integrity Monitoring):** Hacker tấn công xong thường sẽ sửa file cấu hình, chèn backdoor vào `/etc/passwd` hoặc sửa source code web. FIM tính mã băm (MD5/SHA) liên tục. Bất kỳ ai sửa file, SOC sẽ biết ngay.
*   **SCA (Security Configuration Assessment):** Hệ thống sẽ chấm điểm cấu hình OS của bạn dựa trên tiêu chuẩn quốc tế (như CIS Benchmark). Nó sẽ báo: "Server của bạn quên chưa tắt đăng nhập SSH bằng root kìa!".

**Cấu hình đề xuất (Sửa trực tiếp trên `ossec.conf` của Agent hoặc qua Centralized Config):**

**Bật FIM:**
```xml
<syscheck>
  <disabled>no</disabled>
  <frequency>43200</frequency> <!-- Quét 12 tiếng / lần -->
  <!-- Vì sao cần thuộc tính report_changes="yes"? Để Wazuh hiển thị luôn DÒNG CODE NÀO bị thêm/xóa trong file -->
  <directories check_all="yes" report_changes="yes">/etc/nginx,/var/www/html</directories>
</syscheck>
```

**Bật SCA:**
```xml
<sca>
  <enabled>yes</enabled>
  <scan_on_start>yes</scan_on_start>
  <interval>12h</interval>
  <skip_nfs>yes</skip_nfs>
  <!-- Các file policy (*.yml) nằm sẵn trong thư mục ruleset/sca của agent -->
</sca>
```
