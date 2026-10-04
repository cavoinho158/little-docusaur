---
id: intro
slug: /intro
sidebar_position: 1
title: Knowledge Base
---

# Knowledge Base

> **Kho tổng hợp kiến thức** — ghi chép cá nhân trong quá trình học và làm việc trong lĩnh vực Cybersecurity.

---

## Kiến thức Nền tảng (Foundations)

Bộ tài liệu ôn tập các công cụ và quy trình cốt lõi của SOC, được biên soạn từ kinh nghiệm thực tế tại VNCS Global.

| Chủ đề | Mô tả | Trạng thái |
|---|---|---|
| [Google Cybersecurity Certificate](./01-foundations/google-cybersec-cert/intro) | Ghi chú toàn bộ 8 course của chứng chỉ Google Cybersecurity Professional (Coursera) | ✅ Hoàn thành |
| [Risk Management](./01-foundations/risk-management/overview) | Tổng hợp kiến thức quản lý rủi ro bảo mật thông tin (ISO 27005, NIST) | ✅ Hoàn thành |
| [Splunk — Kiến trúc & SPL](./01-foundations/splunk-fundamentals) | Kiến trúc phân tán, 6 loại lệnh SPL, CIM/TA, Indexer Cluster, Risk-Based Alerting | ✅ Mới |
| [Wazuh — Kiến trúc & Phát hiện](./01-foundations/wazuh-fundamentals) | Manager/Indexer/Dashboard, Decoder/Rule, FIM, SCA, Active Response, Cluster | ✅ Mới |
| [IAM — Quản lý Danh tính & Quyền](./01-foundations/iam-fundamentals) | Authentication/Authorization, Active Directory, Kerberos, SSO/SAML, MFA & bypass techniques | ✅ Mới |
| [PAM — Tài khoản Đặc quyền](./01-foundations/pam-fundamentals) | CyberArk, BeyondTrust, Delinea, Microsoft Entra PIM, JIT Access, telemetry cho SOC | ✅ Mới |
| [ITSM & Quy trình Vận hành](./01-foundations/itsm-fundamentals) | ITIL 4, Incident/Problem/Change/Request, SLA, Jira Service Management, Splunk ITSI | ✅ Mới |

---

## SOC Operations

| Chủ đề | Mô tả | Trạng thái |
|---|---|---|
| [AD Attack Detection (Splunk)](./02-soc-operations/ad-detection-logic) | Logic phát hiện Kerberoasting, AS-REP Roasting, DCSync, Pass-the-Hash, Golden Ticket | ✅ Hoàn thành |
| [ITSM & SOC Workflow (Jira/Splunk)](./02-soc-operations/itsm-incident-workflow) | Kiến trúc ITSM/ITIL, Jira Service Management, tích hợp Splunk ES/ITSI trong SOC | ✅ Hoàn thành |
| [Wazuh & Elastic Pipeline](./02-soc-operations/wazuh-siem-pipeline) | Cấu hình Filebeat/Winlogbeat, Logstash Grok, Wazuh Agent, Custom Rule/Decoder | ✅ Hoàn thành |
| [Microsoft 365 for SOC](./02-soc-operations/microsoft365-soc) | Cấu hình log, baseline hành vi bình thường, phân tích cấu trúc log, KQL & SPL detection rules | ✅ Mới |

---

## Labs & Practice

### Blue Team Labs

| Chủ đề | Mô tả | Trạng thái |
|---|---|---|
| [CyberDefenders Training](./03-labs-practice/cyberdefenders-training/setting-lab) | Writeup & ghi chú từ các lab Blue Team trên CyberDefenders | 🔄 Đang cập nhật |
| [Endpoint Security](./03-labs-practice/endpoint-security/OSSEC) | Kiến thức về bảo mật endpoint, EDR, OSSEC/Wazuh | 🔄 Đang cập nhật |
| [Internship Report](./03-labs-practice/internship/CNSC_Intern) | Báo cáo thực tập — triển khai hệ thống monitoring & observability stack | ✅ Hoàn thành |

### PortSwigger Web Security Academy (Pentest)

Thực hành tấn công & phân tích từ góc độ Red Team, ánh xạ tới OWASP Top 10 và góc nhìn Blue Team/SOC.

| Chủ đề | OWASP Category | Tuần | Trạng thái |
|---|---|:---:|---|
| [OWASP Top 10 — So sánh 2021 vs 2025](./03-labs-practice/portswigger-labs/owasp-top10) | Tổng quan | — | ✅ Mới |
| [SQL Injection (15 labs)](./03-labs-practice/portswigger-labs/sqli-labs) | A03 Injection | W10 | ✅ Mới |
| [Authentication Failures (12 labs)](./03-labs-practice/portswigger-labs/authentication-labs) | A07 Auth Failures | W11 | ✅ Mới |
| [Broken Access Control (8 labs)](./03-labs-practice/portswigger-labs/access-control-labs) | A01 Access Control | W11 | ✅ Mới |
| [SSRF & Path Traversal (13 labs)](./03-labs-practice/portswigger-labs/ssrf-path-traversal-labs) | A10 SSRF / A01 | W12 | ✅ Mới |
| [OS Command Injection & File Upload (10 labs)](./03-labs-practice/portswigger-labs/command-injection-file-upload-labs) | A03 Injection | W13 | ✅ Mới |

---

## Cách sử dụng

Dùng **sidebar bên trái** để điều hướng giữa các chủ đề, hoặc click trực tiếp vào bảng trên.

Các ghi chú được viết bằng Markdown, hỗ trợ:
- Công thức toán học (KaTeX)
- Syntax highlighting cho code (Bash, Python, SPL, YAML, ...)
- Diagram (Mermaid)

---

:::tip
Nếu bạn muốn đóng góp hoặc có câu hỏi, hãy liên hệ qua [GitHub](https://github.com/cavoinho158) hoặc [LinkedIn](https://www.linkedin.com/in/an-pham-truong-thien).
:::
