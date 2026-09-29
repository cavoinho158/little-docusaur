---
title: Chương 2 - Mối đe dọa, Điểm yếu và Rủi ro trong ATTT
sidebar_position: 3
---

## 1. Mối đe dọa (Threat)

### 1.1 Định nghĩa

> Mối đe dọa là **nguyên nhân tiềm ẩn** của một sự cố không mong muốn, có thể dẫn đến tổn hại cho hệ thống hoặc doanh nghiệp (ISO 27000:2018).

Mối đe dọa có thể là:

- Hành động (action)
- Sự kiện (event)
- Hoàn cảnh độc hại (circumstance)

### 1.2 Sự cố (Incident)

> "Sự cố" là **rủi ro đã hiện hữu**, tức đã xảy ra thực tế.

- Sự cố ATTT: một hoặc nhiều sự kiện ATTT không mong muốn có nguy cơ gây tổn hại nghiêm trọng.

### 1.3 Ví dụ mối đe dọa ATTT

- **Nội bộ**: lạm dụng truy cập, nhân viên không tuân thủ, lấy cắp dữ liệu...
- **Bên ngoài**: virus, worm, ransomware, DDoS, SQL Injection, phishing, APT...

### 1.4 Nhận biết mối đe dọa

- Đào tạo, huấn luyện, threat modeling
- Quản lý danh mục tài sản CNTT
- ISO 27001 - Phụ lục A
- Cục ATTT, Bkav, bản tin cảnh báo
- Antivirus, IDS, SIEM, nhật ký hệ thống
- Phân loại mối đe dọa: theo nguồn gốc (nội bộ, bên ngoài, có cấu trúc, phi cấu trúc), theo STRIDE, PESTLE, OCTAVE.

### 1.5 Phân biệt Mối đe dọa và Rủi ro

| Mối đe dọa                               | Rủi ro                                     |
| ---------------------------------------- | ------------------------------------------ |
| Có thật, nhìn thấy, có bằng chứng        | Có thể từ sự kiện tiềm ẩn, chưa xảy ra     |
| Không kèm theo khả năng xảy ra + hậu quả | Có đủ 3 yếu tố: xảy ra + hậu quả + sự kiện |

---

## 2. Điểm yếu (Vulnerability)

### 2.1 Định nghĩa

> **Điểm yếu** là một điểm yếu trong tài sản hoặc kiểm soát, có thể bị mối đe dọa khai thác. (ISO 27000:2018)

- Thường là các lỗ hổng, sai sót, thiếu vắng biện pháp ATTT.

### 2.2 Ví dụ điểm yếu

- Thiếu/chưa có chính sách ATTT
- Sử dụng Telnet thay vì SSH
- Mật khẩu yếu, không đổi mật khẩu
- Chưa triển khai MFA cho admin
- Phần mềm hết hỗ trợ, OS lỗi thời
- Sự phụ thuộc vào bên thứ ba quá mức
- Hệ thống sao lưu, DR kém, DLP kém
- Đào tạo ATTT cho nhân viên thiếu nghiêm túc

### 2.3 Nhận biết điểm yếu

- Tra danh sách CVE, CVSS
- Dựa trên Phụ lục A ISO 27001:2013 (thiếu biện pháp kiểm soát)
- Sử dụng penetration testing, vulnerability scanning
- Bản tin Cục ATTT, vendor advisory (Cisco, Sophos...)

---

## 3. Kết hợp: Khai thác điểm yếu = Rủi ro

> Rủi ro ATTT = Mối đe dọa + Khai thác điểm yếu + Gây hậu quả.

**Ví dụ:**

- Mối đe dọa: hacker khai thác lỗ hổng zero-day
- Điểm yếu: firewall Sophos bỏ lỗi chưa có patch
- Rủi ro: hệ thống bị nhiễm malware, bị mất dữ liệu

**Nguồn:** DOJ Hoa Kỳ, Cục ATTT, ISO 27000:2018
