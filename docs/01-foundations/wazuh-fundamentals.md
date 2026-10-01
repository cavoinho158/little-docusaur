---
id: wazuh-fundamentals
title: Wazuh — Kiến trúc & Năng lực Phát hiện
sidebar_label: Wazuh Fundamentals
sidebar_position: 4
description: Kiến trúc Wazuh Manager/Indexer/Dashboard, Data Pipeline từ Agent đến Alert, Custom Decoder/Rule, FIM, SCA và tích hợp SIEM.
---

# Wazuh — Kiến trúc & Năng lực Phát hiện

## 1. Tổng quan kiến trúc Wazuh 4.x

Wazuh 4.x được thiết kế theo mô hình phân tầng gồm ba thành phần chính, mỗi thành phần đảm nhiệm một vai trò riêng biệt nhưng phối hợp chặt chẽ với nhau. **Wazuh Manager** là bộ não xử lý trung tâm — nơi toàn bộ log thô từ các Agent được đổ về, đi qua pipeline bóc tách (Decoder) và so khớp (Rule) trước khi trở thành Alert có ngữ nghĩa. **Wazuh Indexer** là lớp lưu trữ, được xây dựng trên nền OpenSearch (một fork mã nguồn mở của Elasticsearch sau khi Elastic thay đổi license), chịu trách nhiệm index hóa và tìm kiếm alert theo thời gian thực. **Wazuh Dashboard** cung cấp giao diện trực quan dựa trên Kibana, nơi SOC Analyst tương tác hằng ngày để săn lùng mối đe dọa, xem báo cáo SCA, FIM và theo dõi trạng thái Agent.

Điều khiến Wazuh vượt xa định nghĩa HIDS (Host-based Intrusion Detection System) truyền thống chính là khả năng tổng hợp telemetry từ hàng nghìn host, chuẩn hóa log từ hàng chục nguồn khác nhau (syslog, Windows Event Log, JSON API, cloud audit log), và cung cấp khung phân tích rule-based theo thời gian thực. Đây là đặc trưng của một SIEM nhẹ phù hợp với thị trường mid-market — nơi ngân sách không đủ để triển khai Splunk Enterprise hay IBM QRadar, nhưng yêu cầu bảo mật vẫn ở mức nghiêm ngặt. So với Elastic SIEM, Wazuh tích hợp sẵn Agent với khả năng Active Response, FIM và SCA mà Elastic buộc phải ghép thêm các giải pháp bên ngoài hoặc dùng Elastic Defend (trả phí). Wazuh hoàn toàn mã nguồn mở và không giới hạn số lượng Agent, đây là lợi thế cạnh tranh quan trọng khi triển khai tại các tổ chức tại Việt Nam.

---

## 2. Wazuh Agent — Thông minh hơn Filebeat

Nhiều người nhầm lẫn Wazuh Agent với Filebeat — cả hai đều "đọc log và gửi về". Tuy nhiên, đây là sự so sánh thiếu chính xác. Filebeat là một log shipper đơn thuần: đọc, buffer, gửi. Wazuh Agent là một security sensor đa năng chạy trực tiếp trên endpoint, thực hiện đồng thời nhiều tác vụ bảo mật ngay tại chỗ trước khi dữ liệu rời khỏi máy.

Cụ thể, Agent thực hiện **localfile monitoring** — theo dõi bất kỳ file log nào được cấu hình trong `ossec.conf`. Ngoài ra, Agent chạy **rootkit detection** bằng cách quét syscall-level và so sánh với danh sách rootkit signature đã biết, một tính năng mà Filebeat hoàn toàn không có. **FIM (File Integrity Monitoring)** theo dõi thay đổi hash của file hệ thống quan trọng. **SCA (Security Configuration Assessment)** kiểm tra hardening baseline theo CIS Benchmark ngay trên máy chủ. **Active Response** cho phép Agent tự thực thi script phản ứng (block IP, disable user account...) ngay khi nhận lệnh từ Manager.

Về giao tiếp, khi một Agent mới được cài đặt, nó thực hiện **registration** với Manager qua **port 1515/TCP** — đây là kênh bootstrapping để trao đổi khóa xác thực. Sau khi đã đăng ký thành công, toàn bộ luồng telemetry ongoing được mã hóa và truyền qua **port 1514/UDP** (hoặc TCP tùy cấu hình). Kiến trúc này đảm bảo tính bảo mật của kênh truyền và cho phép Manager xác minh danh tính từng Agent một cách chắc chắn.

---

## 3. Data Pipeline: Raw Log → Decoder → Rule → Alert

Đây là chuỗi xử lý cốt lõi của Wazuh — việc nắm vững pipeline này là điều kiện tiên quyết để SOC Analyst có thể viết custom rule hiệu quả.

Quá trình bắt đầu khi Agent đọc một dòng log mới từ file hoặc từ Windows Event Log, sau đó gửi về Manager qua encrypted channel. Tại Manager, dòng log thô đi vào **Decoder pipeline** — Wazuh duyệt tuần tự danh sách decoder theo thứ tự ưu tiên. Mỗi decoder dùng `prematch` (regex nhanh để loại sớm) và `regex` (bóc tách field) để xác định xem nó có "hiểu" được log này không. Khi một decoder phù hợp khớp thành công, các field được trích xuất ra (ví dụ: `srcip`, `dstip`, `user`, `url`) và gắn vào event object.

Event đã được decode tiếp tục vào **Rule engine**. Wazuh duyệt rule tree — các rule được tổ chức phân cấp, có parent rule và child rule. Một composite rule có thể yêu cầu điều kiện: "trong vòng 60 giây, cùng `srcip` này phải trigger rule X ít nhất 10 lần" — đây chính là cơ chế phát hiện brute force bằng `frequency` và `timeframe`. Khi một rule khớp, Wazuh sinh **Alert** có đầy đủ metadata và gán level từ 1 đến 15.

Hệ thống phân cấp level mang ý nghĩa thực tiễn quan trọng: **Level 0–4** là informational — thường là log audit thông thường, không cần phản ứng. **Level 5–7** là low — đáng lưu tâm nhưng chưa cấp bách. **Level 8–11** là medium — cần xem xét trong ca trực, có thể là dấu hiệu tấn công đang diễn ra. **Level 12–15** là high/critical — cần escalate ngay, thường liên quan đến rootkit, privilege escalation hoặc ransomware activity. SOC Analyst nên đặt ngưỡng paging alert từ level 10 trở lên để tránh alert fatigue trong khi vẫn bắt được sự kiện nghiêm trọng.

Sau khi được tạo, Alert được đẩy xuống **Wazuh Indexer** để index hóa và có thể query ngay lập tức trên **Dashboard**, đồng thời có thể forward sang SIEM hoặc SOAR platform bên ngoài qua syslog hoặc REST API.

---

## 4. Custom Decoder & Rule — Dạy Wazuh Đọc Log Riêng

Wazuh đi kèm hàng nghìn decoder và rule mặc định, nhưng trong thực tế SOC, bạn sẽ luôn gặp log từ các ứng dụng nội bộ, thiết bị mạng đặc thù, hoặc sản phẩm security niche mà Wazuh chưa có sẵn decoder. Đây là lúc cần viết custom decoder và rule.

**Decoder** được viết bằng XML với cấu trúc cốt lõi gồm ba phần: `prematch` dùng regex đơn giản để kiểm tra nhanh xem log có thuộc loại này không (tránh chạy regex nặng không cần thiết); `regex` là biểu thức chính quy đầy đủ để bóc tách field; và `order` liệt kê tên các field theo thứ tự nhóm capture của regex. Quan hệ **parent decoder vs child decoder** rất quan trọng: parent decoder nhận diện log từ một source nhất định (ví dụ: `sshd`), còn child decoder chuyên biệt hóa thêm theo từng loại event (login failed, login success, invalid user...). Child decoder thừa kế context từ parent, giúp tránh viết lại regex phức tạp và giảm false positive.

**Rule** cũng là XML và tham chiếu đến decoder qua `decoded_as`. Một rule phát hiện brute force SSH điển hình sẽ có `frequency="10"`, `timeframe="60"` và `same_source_ip` — nghĩa là "cùng IP gửi 10 event SSH failure trong 60 giây thì coi là brute force". Rule còn có thể dùng `match` để kiểm tra nội dung cụ thể trong field, hoặc `if_sid` để chain với rule trước đó. Thứ tự decoder ảnh hưởng trực tiếp đến kết quả — decoder nào được load trước sẽ được thử trước, do đó custom decoder nên có `order` cao hơn để không bị override bởi rule mặc định.

Công cụ không thể thiếu khi phát triển decoder/rule là **`wazuh-logtest`** — cho phép paste một dòng log thô vào terminal và xem ngay kết quả decode, rule match, alert level mà không cần restart service hay chờ log thật xuất hiện.

---

## 5. FIM — File Integrity Monitoring

FIM là một trong những năng lực phát hiện tấn công mạnh nhất của Wazuh vì nó trả lời câu hỏi trực tiếp: *"File quan trọng này có bị sửa đổi không?"* Wazuh Agent tính toán hash SHA-256 (và tùy chọn MD5) của file, lưu baseline vào database local, và so sánh định kỳ hoặc theo thời gian thực.

Chế độ **scheduled** chạy quét theo lịch (mặc định mỗi 12 giờ), phù hợp với file ít thay đổi và môi trường có I/O hạn chế. Chế độ **realtime** dùng `inotify` trên Linux (kernel-level file system notification) hoặc Windows USN Journal, phát hiện thay đổi gần như ngay lập tức với độ trễ chỉ vài giây. Khi bật `report_changes="yes"`, Wazuh không chỉ báo rằng file thay đổi mà còn hiển thị **diff từng dòng** bị thêm/xóa/sửa — cực kỳ hữu ích khi điều tra webshell injection vào file PHP hoặc thay đổi trái phép `/etc/sudoers`.

Các thư mục SOC nên monitor trên Linux bao gồm `/etc/` (config hệ thống), `/var/www/` (web root), `/bin/`, `/sbin/`, `/usr/bin/` (binary thường bị trojanize), và `/root/.ssh/` (SSH key của root). Trên Windows, các Registry hive quan trọng như `HKLM\System\CurrentControlSet\Services` (nơi persistence thường được cài qua service) và `HKLM\Software\Microsoft\Windows\CurrentVersion\Run` cần được đưa vào danh sách theo dõi. FIM alert xuất hiện dưới rule group `syscheck` và thường ở level 7–11 tùy mức độ nghiêm trọng của file bị thay đổi.

---

## 6. SCA — Security Configuration Assessment

SCA là module đánh giá hardening của Wazuh, kiểm tra cấu hình hệ thống so với các policy benchmark được chuẩn hóa như **CIS Benchmark**, **PCI DSS**, hay **NIST 800-53**. Mỗi policy được định nghĩa bằng file YAML chứa hàng chục đến hàng trăm "check" — mỗi check kiểm tra một điều kiện cụ thể: "SSH root login có bị disable không?", "Password complexity policy có đủ mạnh không?", "Firewall có đang chạy không?".

Kết quả của mỗi check trả về trạng thái **PASS**, **FAIL**, hoặc **Not Applicable**, kèm theo điểm số tổng hợp (SCA score) từ 0% đến 100%. SCA score có ý nghĩa thực tiễn trong hardening workflow: score thấp là chỉ báo đỏ cần remediation ngay, trong khi score theo thời gian nên được theo dõi dạng trend — nếu score của một server đột ngột giảm sau một đêm mà không có change ticket, đó là dấu hiệu đáng ngờ cần điều tra. SCA chạy định kỳ theo lịch và không làm chậm hệ thống do hoàn toàn là read-only inspection.

---

## 7. Active Response — Phản ứng Tự động

Active Response là tính năng cho phép Wazuh không chỉ phát hiện mà còn **phản ứng** với mối đe dọa một cách tự động. Khi một rule được trigger (ví dụ: brute force SSH phát hiện 10 lần trong 60 giây), Manager có thể gửi lệnh xuống Agent để thực thi một script được định nghĩa sẵn. Script phổ biến nhất là block IP nguồn tấn công bằng `iptables` trên Linux hoặc Windows Firewall.

Cấu hình Active Response chia làm hai file: `command.xml` định nghĩa script nào sẽ được thực thi và với tham số nào, còn `active-response.xml` mapping command đó với rule group hoặc rule ID cụ thể, đồng thời chỉ định `timeout` (thời gian tự động unblock sau bao nhiêu giây). Mô hình này khá linh hoạt — bạn có thể định nghĩa response tùy chỉnh như: disable user account, collect forensic dump, hoặc gọi webhook SOAR.

Tuy nhiên, cần hết sức thận trọng khi bật Active Response trong môi trường production. Rủi ro lớn nhất là **false positive block** — nếu một IP của khách hàng quan trọng hoặc IP của chính monitoring system bị nhận diện nhầm là attacker, hệ thống sẽ tự động cắt kết nối mà không có can thiệp của con người. Khuyến nghị là luôn test kỹ rule trong môi trường staging, đặt whitelist IP cho các hệ thống quan trọng, và bắt đầu với `timeout` ngắn (ví dụ: 300 giây) thay vì block vĩnh viễn.

---

## 8. Wazuh Cluster — Loại bỏ Single Point of Failure

Khi số lượng Agent vượt qua ngưỡng mà một Manager đơn lẻ không còn đủ khả năng xử lý (thường là vài nghìn Agent), Wazuh hỗ trợ triển khai theo mô hình **Manager Cluster** gồm một **Master Node** và nhiều **Worker Node**.

Master Node nắm giữ toàn bộ cấu hình tập trung: `ossec.conf`, toàn bộ custom rule và decoder, agent registration database. Master đồng bộ cấu hình này xuống tất cả Worker theo cơ chế push, đảm bảo tính nhất quán. Worker Node là nơi Agent thực sự kết nối vào — chúng nhận log từ Agent, chạy Decoder và Rule pipeline độc lập, rồi gửi alert trực tiếp lên Wazuh Indexer. Thiết kế này phân tán tải xử lý hiệu quả và loại bỏ Single Point of Failure ở lớp Manager. Nếu một Worker Node down, Agent được redirect sang Worker khác, và Master vẫn tiếp tục phục vụ management plane. Mô hình này đặc biệt phù hợp khi VNCS Global cần giám sát đồng thời nhiều khách hàng với số lượng endpoint lớn.

---

## 9. Wazuh Indexer Standalone vs Tích hợp Elastic Stack

Wazuh cho phép lựa chọn giữa hai mô hình lưu trữ và phân tích. Mô hình **standalone** sử dụng Wazuh Indexer (OpenSearch) là lựa chọn đơn giản hơn, được Wazuh hỗ trợ đầy đủ out-of-the-box, và phù hợp với hầu hết triển khai vừa và nhỏ. Toàn bộ stack từ Manager, Indexer đến Dashboard đều do Wazuh quản lý vòng đời, giảm operational overhead đáng kể.

Tuy nhiên, khi tổ chức đã có sẵn **Elastic Stack** (Elasticsearch + Kibana) và muốn tích hợp Wazuh vào ecosystem đó, hoặc khi cần enrichment pipeline phức tạp (normalize, deduplicate, enrich với threat intel từ MISP...), **Logstash** đóng vai trò trung gian: nhận alert từ Wazuh Manager qua syslog/file, apply Logstash filter pipeline để transform và enrich, rồi gửi sang Elasticsearch. Mô hình này linh hoạt hơn nhưng thêm một component cần vận hành và troubleshoot. Quyết định nên dựa trên năng lực đội ngũ và mức độ phức tạp của enrichment yêu cầu, chứ không phải theo trào lưu kỹ thuật.

---

## 10. Telemetry Quan Trọng cho SOC từ Wazuh

Trong thực tế vận hành SOC, không phải tất cả alert đều có giá trị như nhau. Một số **rule group** cần được ưu tiên theo dõi vì chúng bao phủ các vector tấn công phổ biến nhất.

**`authentication_failed`** bao gồm các event đăng nhập thất bại từ SSH, RDP, web application — đây là nguồn tín hiệu sớm cho brute force và credential stuffing. **`web_attack`** phát hiện các pattern tấn công web như SQL Injection, XSS, path traversal dựa trên phân tích HTTP log. **`rootcheck`** cảnh báo khi Agent phát hiện dấu hiệu rootkit hoặc file ẩn đáng ngờ ở kernel level. **`syscheck`** là FIM alert — thay đổi file hệ thống quan trọng. **`policy_changed`** theo dõi thay đổi cấu hình OS và firewall, đặc biệt nguy hiểm khi xảy ra ngoài maintenance window. **`firewall`** tổng hợp log từ firewall/iptables, cho phép phát hiện port scan và lateral movement.

Trên Dashboard, SOC Analyst nên làm quen với việc filter alert kết hợp theo `rule.level >= 10` và `rule.groups` để tập trung vào những gì thực sự cần hành động, thay vì bị ngập trong volume alert level thấp. Tạo saved search và dashboard theo từng use-case (brute force detection, FIM changes, SCA regression) là thực hành tốt giúp tăng tốc độ phản ứng trong giờ trực.

---

> **Ghi chú thực chiến:** Khi deploy Wazuh trong môi trường VNCS Global, hãy đảm bảo custom decoder và rule được version-control trong Git riêng biệt với Wazuh package. Điều này giúp rollback nhanh khi một rule viết sai gây ra alert storm, và cho phép peer review trước khi push lên production Manager.
