---
id: owasp-top10
title: OWASP Top 10 — So sánh 2021 & 2025
sidebar_label: OWASP Top 10 (2021 vs 2025)
sidebar_position: 1
description: Phân tích chuyên sâu OWASP Top 10 phiên bản 2021 và 2025, thay đổi giữa hai phiên bản, ánh xạ tới các lab PortSwigger và góc nhìn SOC/Blue Team.
---

# OWASP Top 10 — So sánh 2021 & 2025

> OWASP (Open Worldwide Application Security Project) công bố danh sách Top 10 lỗ hổng web phổ biến nhất theo chu kỳ vài năm một lần, dựa trên dữ liệu thực tế từ hàng trăm tổ chức trên toàn thế giới. Danh sách này không phải là ranking các lỗ hổng nguy hiểm nhất theo lý thuyết, mà là phản ánh những gì **xuất hiện nhiều nhất trong thực tế** — vừa là kim chỉ nam cho developer lẫn là checklist cho tester và SOC analyst.

---

## So sánh Top 10: 2021 vs 2025

| Hạng | OWASP 2021 | OWASP 2025 | Thay đổi |
|:---:|---|---|:---:|
| 1 | Broken Access Control | Broken Access Control | ↔ Giữ nguyên |
| 2 | Cryptographic Failures | Injection | ↑ Tăng từ #3 |
| 3 | Injection | Insecure Design | ↑ Tăng từ #4 |
| 4 | Insecure Design | Security Misconfiguration | ↑ Tăng từ #5 |
| 5 | Security Misconfiguration | Vulnerable & Outdated Components | ↑ Tăng từ #6 |
| 6 | Vulnerable & Outdated Components | Identification & Authentication Failures | ↑ Tăng từ #7 |
| 7 | Identification & Authentication Failures | SSRF (Server-Side Request Forgery) | ↑ Tăng từ #10 |
| 8 | Software & Data Integrity Failures | Software & Data Integrity Failures | ↔ Giữ nguyên |
| 9 | Security Logging & Monitoring Failures | Security Logging & Monitoring Failures | ↔ Giữ nguyên |
| 10 | SSRF | Cryptographic Failures | ↓ Giảm từ #2 |

> [!NOTE]
> OWASP 2025 chưa được phát hành chính thức tại thời điểm viết tài liệu này — thứ tự trên dựa trên bản draft và dự đoán từ cộng đồng bảo mật dựa trên xu hướng thực tế. Phiên bản chính thức có thể thay đổi.

---

## Phân tích những thay đổi đáng chú ý

### Injection vẫn là nỗi ám ảnh không bao giờ cũ

Một trong những điều thú vị nhất trong OWASP 2025 là sự trở lại mạnh mẽ của **Injection** lên vị trí #2, trong khi ở phiên bản 2021 nó đã bị đẩy xuống #3. Lý do thực tế: SQL Injection, OS Command Injection, và ngày càng nhiều hơn là **Prompt Injection** (khi hệ thống AI/LLM xử lý input không được kiểm soát) tiếp tục xuất hiện trong các lần audit thực tế. Mặc dù cộng đồng developer đã ý thức hơn nhiều về parameterized queries, vẫn còn vô số codebase legacy sử dụng string concatenation trực tiếp, đặc biệt ở các ứng dụng nội bộ, back-office, và microservice không được kiểm tra kỹ.

### Cryptographic Failures — sự tụt hạng đáng suy ngẫm

Ngược lại, **Cryptographic Failures** rớt từ #2 xuống #10 trong 2025. Điều này không có nghĩa là lỗi mã hóa ít nguy hiểm hơn — mà là các framework hiện đại (HTTPS by default, TLS 1.3 enforced, Let's Encrypt miễn phí) đã giải quyết được một phần lớn của vấn đề này ở tầng infrastructure. Tuy nhiên, các lỗi mã hóa ở tầng ứng dụng (hardcoded keys, weak hashing như MD5/SHA1 cho password, insecure random number generation) vẫn tồn tại và thường xuyên bị phát hiện trong pentest.

### SSRF leo thang từ mới xuất hiện lên Top 7

**SSRF (Server-Side Request Forgery)** là lỗ hổng mới nhất được đưa vào OWASP 2021 (hạng #10) và tiếp tục leo hạng trong 2025. Sự phổ biến của kiến trúc microservice và cloud (nơi mọi service đều có endpoint nội bộ), cùng với metadata endpoint của cloud provider (AWS 169.254.169.254, Azure 169.254.169.254/metadata) khiến SSRF ngày càng được khai thác nhiều hơn trong các tấn công thực tế. Một lỗ hổng SSRF trong môi trường AWS ECS/EKS có thể dẫn trực tiếp đến lấy được IAM credential tạm thời với quyền tương đương instance role — đó là privilege escalation hoàn chỉnh chỉ từ một HTTP request.

### Những hạng mục ổn định — và lý do tại sao

**Broken Access Control** giữ vững vị trí #1 qua cả hai phiên bản. Đây là bằng chứng cho thấy bài toán "ai được phép làm gì" vẫn là vấn đề khó giải quyết nhất về mặt kiến trúc. Không có framework nào tự động enforce access control — developer phải tự viết, và việc này liên tục bị bỏ sót, đặc biệt ở các function ít được sử dụng như admin API, export endpoint, hoặc các route chỉ cần thay đổi ID trong URL.

**Security Logging & Monitoring Failures** cũng giữ nguyên #9, nhắc nhở rằng dù có secure code đến đâu, nếu không có logging đủ tốt thì SOC sẽ không phát hiện được khi bị tấn công — và đó chính là lý do mọi nỗ lực xây dựng SIEM như Splunk/Wazuh đều quan trọng.

---

## Ánh xạ OWASP Top 10 với Labs đã thực hành

| OWASP Category | Lỗ hổng thực hành | Tuần | PortSwigger Topic |
|---|---|:---:|---|
| A03 — Injection | SQL Injection (15 labs) | W10 | SQL injection |
| A07 — Auth Failures | Broken Authentication (12 labs) | W11 | Authentication |
| A01 — Broken Access Control | Vertical/Horizontal privilege escalation | W11 | Access Control |
| A10/A07 — SSRF | Basic & Blind SSRF, Filter Bypass (7 labs) | W12 | SSRF |
| A01 — Broken Access Control | Path Traversal, Filter Bypass (6 labs) | W12 | Path Traversal |
| A03 — Injection | OS Command Injection (5 labs) | W13 | OS Command Injection |
| A03 — Injection | File Upload Vulnerabilities | W13 | File Upload |

---

## Góc nhìn SOC/Blue Team cho từng category

Hiểu OWASP Top 10 từ góc độ của một analyst là hiểu loại **telemetry** nào cần thu thập và loại **pattern** nào cần viết detection rule. Mỗi category trong OWASP không chỉ là một lỗ hổng — nó còn là một **attack surface** với signature riêng trong log.

**Injection** để lại dấu vết trong application log dưới dạng query syntax bất thường (dấu nháy đơn, comment SQL `--`, UNION keyword trong GET/POST parameter), hoặc trong WAF/IDS log dưới dạng blocked request với rule category "sql-injection". Splunk query cơ bản: tìm các request có `uri_query` chứa các ký tự đặc biệt như `'`, `--`, `UNION`, `SELECT` mà không qua WAF xử lý.

**Broken Access Control** khó phát hiện hơn vì về mặt kỹ thuật, đây là request HTTP hợp lệ từ user đã xác thực — chỉ là họ truy cập tài nguyên không thuộc quyền của họ. Dấu hiệu cần monitor: user thay đổi ID trong URL/body để truy cập object của người khác, truy cập endpoint `/admin` mà không thuộc nhóm admin, hoặc thay đổi role parameter trong request.

**Authentication Failures** tạo ra pattern rõ ràng nhất trong log: nhiều lần đăng nhập thất bại từ cùng IP (brute force), hoặc nhiều lần đăng nhập thất bại trên cùng account từ nhiều IP khác nhau (credential stuffing), hoặc thành công sau chuỗi dài thất bại (successful brute force).

**SSRF** thường xuất hiện trong server-side log dưới dạng request tới các IP nội bộ bất thường (192.168.x.x, 10.x.x.x, 169.254.x.x từ chính application server), hoặc trong DNS log dưới dạng query từ server tới domain lạ bên ngoài mà không khớp với traffic pattern bình thường.

---

*Xem chi tiết writeup từng lab tại các trang tiếp theo.*
