---
title: "MITRE ATT&CK"
sidebar_position: 7
---

## Tổng quan

MITRE ATT&CK là một khung (framework) kiến thức toàn diện về **tactics** (chiến thuật) và **techniques** (kỹ thuật) mà kẻ tấn công sử dụng trong các giai đoạn khác nhau của một cuộc tấn công mạng ([ATT&CK](https://en.wikipedia.org/wiki/ATT%26CK)). Tactics mô tả “tại sao” (why) – các mục tiêu chiến lược như truy cập ban đầu, duy trì tồn tại, hay điều khiển từ xa – trong khi techniques là “làm thế nào” (how) kẻ tấn công thực hiện các mục tiêu đó ([ATT&CK](https://en.wikipedia.org/wiki/ATT%26CK)). Hiện tại khung Enterprise ATT&CK gồm 14 tactics chính, với hơn 300 techniques và hàng trăm sub-techniques, được minh hoạ dưới dạng ma trận để hỗ trợ phân tích, phát hiện và ứng phó ([ATT&CK](https://en.wikipedia.org/wiki/ATT%26CK)).

## Các chiến thuật (Tactics)

1. **Reconnaissance (Thu thập thông tin)** – Kẻ tấn công thu thập thông tin về mục tiêu qua quét mạng, OSINT, social engineering… để chuẩn bị cho giai đoạn sau ([ATT&CK](https://en.wikipedia.org/wiki/ATT%26CK)).
2. **Resource Development (Chuẩn bị công cụ)** – Xác định và thu thập các công cụ, hạ tầng hoặc dịch vụ cần thiết cho cuộc tấn công (domain, hosting, mã độc…) ([ATT&CK](https://en.wikipedia.org/wiki/ATT%26CK)).
3. **Initial Access (Xâm nhập ban đầu)** – Tiếp cận hệ thống mục tiêu qua phishing, lỗ hổng web, valid accounts, trojan, v.v. ([ATT&CK](https://en.wikipedia.org/wiki/ATT%26CK)).
4. **Execution (Thực thi mã độc)** – Chạy mã độc trên hệ thống mục tiêu, ví dụ PowerShell, WMI, scheduled task, v.v. ([ATT&CK](https://en.wikipedia.org/wiki/ATT%26CK)).
5. **Persistence (Duy trì tồn tại)** – Đảm bảo quyền truy cập vẫn hoạt động sau khi khởi động lại, dùng hook, dịch vụ, backdoor… ([ATT&CK](https://en.wikipedia.org/wiki/ATT%26CK)).
6. **Privilege Escalation (Leo thang đặc quyền)** – Tăng quyền từ user thường lên admin/system qua lỗ hổng, credential access… ([ATT&CK](https://en.wikipedia.org/wiki/ATT%26CK)).
7. **Defense Evasion (Tránh né bảo vệ)** – Vô hiệu hoá hoặc lẩn tránh antivirus, EDR, xóa dấu vết log, packing, obfuscation… ([ATT&CK](https://en.wikipedia.org/wiki/ATT%26CK)).
8. **Credential Access (Chiếm quyền đăng nhập)** – Thu thập mật khẩu, token, hash qua keylogging, credential dumping… ([ATT&CK](https://en.wikipedia.org/wiki/ATT%26CK)).
9. **Discovery (Khảo sát mạng nội bộ)** – Khám phá hệ thống, dịch vụ, tài nguyên nội bộ bằng netstat, LDAP, enumeration… ([ATT&CK](https://en.wikipedia.org/wiki/ATT%26CK)).
10. **Lateral Movement (Di chuyển bên trong)** – Sử dụng RDP, SMB, WMI, remote services để lan rộng tấn công ([ATT&CK](https://en.wikipedia.org/wiki/ATT%26CK)).
11. **Collection (Thu thập dữ liệu)** – Lấy dữ liệu nhạy cảm từ máy nạn nhân như file, clipboard, screenshot… ([ATT&CK](https://en.wikipedia.org/wiki/ATT%26CK)).
12. **Command and Control (Liên lạc điều khiển)** – Thiết lập kênh C2 qua HTTP/HTTPS, DNS, WebSocket, custom protocol… ([ATT&CK](https://en.wikipedia.org/wiki/ATT%26CK)).
13. **Exfiltration (Rò rỉ dữ liệu)** – Chuyển dữ liệu ra ngoài qua FTP, HTTP, email, cloud storage… ([ATT&CK](https://en.wikipedia.org/wiki/ATT%26CK)).
14. **Impact (Gây ảnh hưởng)** – Hoàn thành mục tiêu cuối cùng: mã hoá (ransomware), làm hỏng, chiếm đoạt tài nguyên, v.v. ([ATT&CK](https://en.wikipedia.org/wiki/ATT%26CK)).

| **Cyber Kill Chain (CKC)**      | **MITRE ATT&CK - Tactics liên quan**                                          |
| ------------------------------- | ----------------------------------------------------------------------------- |
| 1. **Reconnaissance**           | - Reconnaissance                                                              |
| 2. **Weaponization**            | - No direct tactic (handled outside MITRE scope)                              |
| 3. **Delivery**                 | - Initial Access                                                              |
| 4. **Exploitation**             | - Execution <br /> - Privilege Escalation <br /> - Defense Evasion            |
| 5. **Installation**             | - Persistence                                                                 |
| 6. **Command and Control (C2)** | - Command and Control                                                         |
| 7. **Actions on Objectives**    | - Credential Access <br /> - Collection <br /> - Exfiltration <br /> - Impact |

## Các kỹ thuật (Techniques)

Techniques là những phương pháp cụ thể để đạt được mục tiêu của từng tactic. Dưới đây là một số ví dụ đại diện:

- **Active Scanning (T1595)** – Quét chủ động mạng mục tiêu để thu thập thông tin về các thiết bị và dịch vụ ([Reconnaissance, Tactic TA0043 - Enterprise | MITRE ATT&CK®](https://attack.mitre.org/tactics/TA0043/)).
- **Phishing for Information (T1598)** – Gửi email, link, hoặc voice phishing để lừa người dùng tiết lộ thông tin nhạy cảm ([Reconnaissance, Tactic TA0043 - Enterprise | MITRE ATT&CK®](https://attack.mitre.org/tactics/TA0043/)).
- **Spearphishing Attachment (T1566.001)** – Đính kèm tập tin độc hại vào email giả mạo đối tượng cụ thể ([Phishing, Technique T1566 - Enterprise - MITRE ATT&CK®](https://attack.mitre.org/techniques/T1566/)).
- **Exploitation for Initial Access (T1664)** – Khai thác lỗ hổng phần mềm để chiếm quyền truy cập ban đầu ([Exploitation for Initial Access, Technique T1664 - MITRE ATT&CK®](https://attack.mitre.org/techniques/T1664/)).
- **Brute Force (T1110)** – Dò mật khẩu hoặc token bằng công cụ tự động trên nhiều tài khoản hoặc dịch vụ ([Brute Force, Technique T1110 - Enterprise - MITRE ATT&CK®](https://attack.mitre.org/techniques/T1110/)).
- **Acquire Infrastructure (T1583)** – Mua hoặc thuê hạ tầng (server, domain) làm C2 hoặc dịch vụ trung gian ([Acquire Access, Technique T1650 - Enterprise - MITRE ATT&CK®](https://attack.mitre.org/techniques/T1650/)).
- **Scheduled Task/Jobs (T1053)** – Tạo task lập lịch Windows/Linux để tự động thực thi mã độc ([ATT&CK](https://en.wikipedia.org/wiki/ATT%26CK)).
- **Credential Dumping (T1003)** – Trích xuất hash hoặc plain-text password từ bộ nhớ hoặc registry ([ATT&CK](https://en.wikipedia.org/wiki/ATT%26CK)).
- **Remote File Copy (T1105)** – Chuyển mã độc hoặc công cụ thu thập dữ liệu giữa các máy qua SMB, FTP ([ATT&CK](https://en.wikipedia.org/wiki/ATT%26CK)).
- **Data Staged (T1074)** – Lưu trữ tạm dữ liệu trước khi exfiltration để tối ưu băng thông hoặc tránh bị giám sát ([ATT&CK](https://en.wikipedia.org/wiki/ATT%26CK)).

> Ngoài ra, mỗi technique còn có nhiều **sub-techniques** (ví dụ T1566.x cho phishing) để mô tả chi tiết hơn các biến thể ([Phishing, Technique T1566 - Enterprise - MITRE ATT&CK®](https://attack.mitre.org/techniques/T1566/)).

---

## Sử dụng MITRE ATT&CK trong OSSEC

### Bảng mapping OSSEC ↔ MITRE ATT&CK Tactics

| Tactic                                                 | Độ phát hiện | Giải thích ngắn gọn                                                                                                                                                                                                                                                                                                             |
| ------------------------------------------------------ | ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Reconnaissance** (Trinh sát)                         | **Hạn chế**  | OSSEC là HIDS dựa trên log và FIM, không giám sát trực tiếp lưu lượng mạng. Do đó khó phát hiện được các hành động quét mạng hoặc thu thập thông tin từ xa.                                                                                                                                                                     |
| **Resource Development** (Phát triển tài nguyên)       | **Hạn chế**  | OSSEC không theo dõi giai đoạn chuẩn bị công cụ/địa điểm (ví dụ tải phần mềm độc hại) vì đây là hoạt động bên ngoài hệ thống bị bảo vệ.                                                                                                                                                                                         |
| **Initial Access** (Truy cập ban đầu)                  | **Tốt**      | OSSEC giám sát log đăng nhập và sự xuất hiện file mới. Nhờ vậy, có thể phát hiện tấn công dạng brute-force, mã độc đính kèm trong email (file lạ) được mở bởi người dùng. Ví dụ rule nhận diện 3 lần login thất bại.                                                                                                            |
| **Execution** (Thực thi mã)                            | **Tốt**      | OSSEC phân tích log và hệ thống (HIDS), vì vậy nó dễ phát hiện các hành vi thực thi đáng ngờ như chạy script, thực thi lệnh bất thường. Ví dụ, audit logs từ hệ thống cho phép OSSEC cảnh báo khi tiến trình lạ xuất hiện.                                                                                                      |
| **Persistence** (Duy trì bền bỉ)                       | **Tốt**      | OSSEC có module FIM và giám sát registry, do đó phát hiện tốt khi kẻ tấn công thiết lập persistence (thêm service khởi động, sửa file template Office, sửa registry liên quan đến Autostart). FIM sẽ báo động khi những cấu hình này bị thay đổi.                                                                               |
| **Privilege Escalation** (Tăng đặc quyền)              | **Khá**      | OSSEC có thể phát hiện thay đổi trong cấu hình hệ thống hay registry (ví dụ thêm user vào nhóm admin, sửa sudoers) nhờ giám sát file/registry. Tuy nhiên, nhiều kỹ thuật tăng đặc quyền tinh vi (hacker nâng quyền trên bộ nhớ) thì OSSEC khó phát hiện trực tiếp.                                                              |
| **Defense Evasion** (Trốn tránh)                       | **Khá**      | OSSEC có cơ chế phát hiện rootkit và giám sát integrity hệ thống, vì vậy nó có thể phát hiện một số kỹ thuật tránh né (ví dụ phần mềm ác tính che giấu tiến trình). Tuy nhiên, nhiều kỹ thuật phòng tránh hiện đại (xóa log, obfuscate mã độc) có thể thoát khỏi tầm nhìn log.                                                  |
| **Credential Access** (Chiếm đoạt thông tin đăng nhập) | **Hạn chế**  | OSSEC phát hiện được các hoạt động đoán mật khẩu (brute-force) trong log, nhưng không thể trực tiếp phát hiện lấy cắp credential từ bộ nhớ hay mạng. Việc ngăn chặn credential leakage không thuộc phạm vi HIDS.                                                                                                                |
| **Discovery** (Khảo sát hệ thống)                      | **Hạn chế**  | OSSEC không giám sát mạng hay lệnh quét cục bộ, nên rất khó phát hiện các hoạt động khám phá hệ thống (như dùng `netstat`, `arp`). Trừ khi các lệnh đó ghi log và OSSEC có rule nhận biết, phần lớn hành vi discovery sẽ qua mắt HIDS.                                                                                          |
| **Lateral Movement** (Di chuyển ngang)                 | **Khá**      | OSSEC giám sát log đăng nhập từ xa (SSH, RDP, VPN, v.v.), nên có thể phát hiện khi có người dùng hoặc tiến trình bất thường đăng nhập từ host khác. Ví dụ, nhiều cảnh báo SSH thất bại liên tiếp hay login thành công từ IP lạ có thể bật cảnh báo. Khả năng này dựa trên việc OSSEC phân tích log authentication (OSSEC LIDS). |
| **Collection** (Thu thập dữ liệu)                      | **Hạn chế**  | OSSEC chủ yếu giám sát hệ thống và log, không theo dõi trực tiếp quá trình thu thập thông tin. Kẻ tấn công sao chép file nhạy cảm có thể chỉ tạo log filesystem thông thường, khó bị nhận diện nếu không có rule cụ thể về hành vi đó.                                                                                          |
| **Exfiltration** (Đưa dữ liệu ra ngoài)                | **Hạn chế**  | OSSEC không phải NIDS/NIPS nên không phân tích lưu lượng mạng ra. Việc kẻ tấn công chuyển dữ liệu ra ngoài qua network thường không để lại dấu ấn rõ ràng trong log hệ thống tiêu chuẩn, nên OSSEC khó phát hiện trừ khi có sự kiện file nghi vấn trên host.                                                                    |
| **Command and Control** (Điều khiển từ xa)             | **Hạn chế**  | OSSEC không giám sát liên lạc mạng với máy chủ điều khiển từ xa. Các kết nối C&C tinh vi (HTTP beacon, DNS tunneling…) thường không được phát hiện qua log hệ thống bình thường. (Chỉ trừ khi C&C khởi tạo tiến trình lạ được ghi log).                                                                                         |
| **Impact** (Hư hại hệ thống)                           | **Tốt**      | OSSEC FIM giám sát mọi thay đổi file (bao gồm mã hóa, xóa file) theo thời gian thực. Vì vậy, các hoạt động phá hoại cuối cùng như mã hóa ransomware, xóa dữ liệu sẽ được cảnh báo. Ngoài ra, Active Response có thể dừng dịch vụ hoặc kill tiến trình khi phát hiện tác nhân gây hại.                                           |

**Chú thích:** Bảng trên đánh giá khả năng của OSSEC chủ yếu dựa trên đặc tính HIDS (phân tích log, giám sát file, registry và rootkit ([OSSEC - Open Source HIDS - FIM, Rootkit Detection, Malware Detection](https://www.ossec.net/about/#:~:text=OSSEC%20has%20a%20powerful%20correlation,OpenBSD%2C%20FreeBSD%2C%20MacOS%2C%20Solaris%20and)). Tactics liên quan đến việc theo dõi mạng hoặc exfil (C2, Exfiltration, Reconnaissance, Resource Development) thường "**hạn chế**" vì OSSEC không phân tích lưu lượng mạng, trong khi những tactics liên quan đến thay đổi file/tiến trình, đăng nhập người dùng (Initial Access, Execution, Persistence, Impact…) OSSEC có thể phát hiện tốt hơn nhờ phân tích log/FIM.

### Ví dụ Rule OSSEC (XML) phát hiện file Excel (.xlsx) có macro

Ví dụ dưới đây sử dụng module **syscheck** (file integrity) để phát hiện thay đổi file Excel với macro khả nghi. Rule này đánh dấu các file `.xlsm` hoặc `.xlsx` mới/có chứa macro bất thường, và gắn nhãn kỹ thuật MITRE liên quan như **T1137.001** (Office Template Macros) và **T1204.002** (User Execution: Malicious File) ([Office Application Startup: Office Template Macros, Sub-technique T1137.001 - Enterprise | MITRE ATT&CK®](https://attack.mitre.org/techniques/T1137/001/#:~:text=Office%20Visual%20Basic%20for%20Applications,4%5D%20Shared%20templates%20may%20also)) ([User Execution: Malicious File, Sub-technique T1204.002 - Enterprise | MITRE ATT&CK®](https://attack.mitre.org/techniques/T1204/002/#:~:text=An%20adversary%20may%20rely%20upon,reg)). Cú pháp rule tham khảo ví dụ syscheck trong tài liệu Wazuh/OSSEC ([Creating custom FIM rules - File integrity monitoring](https://documentation.wazuh.com/current/user-manual/capabilities/file-integrity/creating-custom-fim-rules.html#:~:text=%3Cgroup%20name%3D,id)).

```xml
<group name="syscheck,file_integrity">
  <rule id="100100" level="12">
    <if_sid>550</if_sid> <!-- syscheck file change -->
    <field name="file">\.(xlsm|xlsx)$</field>
    <description>Phát hiện file Excel mới/có macro khả nghi</description>
    <mitre>
      <id>T1137.001</id>  <!-- Office VBA Macro -->
      <id>T1204.002</id>  <!-- User Execution: Malicious File -->
    </mitre>
  </rule>
</group>
```

Trong ví dụ trên, khi syscheck phát hiện một file Excel (`.xlsm` hoặc `.xlsx`) được tạo mới hoặc thay đổi, rule sẽ báo động ở cấp độ cao. MITRE IDs gắn kèm phản ánh kỹ thuật tấn công có liên quan (mã độc thực thi qua file Office). Rule có thể bổ sung thêm `match` hoặc `regex` để rà soát nội dung file nếu cần (ví dụ tìm chuỗi VBA nhạy cảm), nhưng về cấu trúc rule cơ bản như trên đã hiển thị tính năng phát hiện file dạng này (tham khảo ví dụ rule giám sát thay đổi file trong tài liệu).

---
