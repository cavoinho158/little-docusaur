---
id: pam-fundamentals
title: PAM — Quản lý Tài khoản Đặc quyền
sidebar_label: PAM Fundamentals
sidebar_position: 6
description: Kiến trúc PAM (CyberArk, BeyondTrust, Delinea, Microsoft Entra PIM), Privileged Session Management, Just-in-Time Access và telemetry PAM trong SOC.
---

# PAM — Quản lý Tài khoản Đặc quyền

## 1. Tại sao PAM là mảnh ghép không thể thiếu của Zero Trust

Nếu IAM kiểm soát danh tính của mọi người dùng trong tổ chức, thì **Privileged Access Management (PAM)** tập trung vào một tập con nhỏ nhưng cực kỳ nguy hiểm: **tài khoản đặc quyền**. Domain Administrator, Local Administrator, root trên Linux, `sa` trên SQL Server, service account chạy ứng dụng critical — đây là những tài khoản mà nếu kẻ tấn công chiếm được, hậu quả có thể là thảm họa toàn tổ chức.

Lý do tài khoản đặc quyền là mục tiêu ưu tiên số một của attacker rất đơn giản: chúng có quyền làm mọi thứ. Một local admin account bị compromise có thể trở thành bàn đạp cho **credential dumping** (Mimikatz, LSASS dump). Một domain admin bị compromise cho phép **DCSync attack** — attacker giả vờ là Domain Controller để yêu cầu replication và lấy toàn bộ password hash của mọi tài khoản trong domain. Từ đó, **Golden Ticket** có thể được forge bằng hash của `krbtgt`, cho phép attacker duy trì persistence gần như vô thời hạn, ngay cả sau khi password bị đổi, bởi vì Golden Ticket không cần liên lạc với DC để validate.

Nếu không có PAM, những tài khoản đặc quyền này thường tồn tại với mật khẩu cố định, không rotate, không ghi lại session, và được chia sẻ giữa nhiều người. Lateral movement và privilege escalation trong trường hợp đó gần như hoàn toàn vô hình với SOC.

PAM giải quyết vấn đề này thông qua **bốn trụ cột kiến trúc**:

- **Vault** (Kho lưu trữ): Lưu credential trong kho mã hóa mạnh (AES-256), không ai có thể xem plaintext password trực tiếp
- **Rotation** (Tự động xoay vòng): Mật khẩu được tự động thay đổi sau mỗi lần sử dụng hoặc theo lịch định kỳ, vô hiệu hóa Pass-the-Hash và credential reuse
- **Session Recording** (Ghi lại phiên làm việc): Mọi hành động trên session đặc quyền đều được record, cho phép forensic investigation chi tiết
- **Just-in-Time Access (JIT)**: Quyền đặc quyền chỉ được cấp phát khi có yêu cầu cụ thể, tồn tại trong thời gian giới hạn, rồi tự động thu hồi — không ai có standing privilege khi không cần

Ba trụ cột đầu giảm radius của blast khi có compromise; trụ cột thứ tư, JIT, giảm xác suất compromise ngay từ đầu. Đây là lý do PAM được coi là nền tảng của Zero Trust Architecture: không tin tưởng bất kỳ ai, kể cả admin, cho đến khi được verify và chỉ cấp quyền tối thiểu cần thiết.

---

## 2. CyberArk — Kiến trúc doanh nghiệp chuẩn mực

CyberArk là market leader trong PAM enterprise và được gần như mọi tổ chức Fortune 500 triển khai. Hiểu kiến trúc CyberArk giúp SOC Analyst nắm được luồng telemetry và biết phải tìm gì khi điều tra incident liên quan đến privileged access.

CyberArk bao gồm 5 thành phần cốt lõi:

**1. Digital Vault** — Trái tim của CyberArk: kho lưu trữ credential được mã hóa AES-256, chạy trên dedicated hardened server (thường là Windows Server stripped down, không join domain). Vault không expose API trực tiếp; mọi truy cập đều phải qua các component khác. Điều này có nghĩa là ngay cả khi attacker compromise toàn bộ infrastructure, Vault vẫn được bảo vệ bởi lớp hardening và encryption riêng.

**2. CPM (Credential Provider Manager)** — Đây là component tự động hóa việc rotation. CPM kết nối trực tiếp đến target systems (Windows, Linux, databases, network devices) và thay đổi password theo policy đã định nghĩa — sau mỗi checkout, theo lịch định kỳ, hoặc khi có nghi ngờ compromise. CPM failure là một trong những alert quan trọng nhất với SOC: nếu CPM không thể rotate credential, rất có thể password đã bị thay đổi bên ngoài PAM (indicator của compromised account).

**3. PSM (Privileged Session Manager)** — Đây là điểm khác biệt lớn nhất của PAM so với giải pháp credential management thông thường. PSM hoạt động như **session proxy**: user kết nối đến PSM, PSM inject credential vào session mà không bao giờ expose plaintext password cho user. User không bao giờ biết password thực sự là gì. Mọi keystroke, command, và screen activity đều được record. PSM cũng cho phép session isolation — khi suspicious activity được phát hiện, session có thể bị terminate tức thì.

**4. PVWA (Password Vault Web Access)** — Web portal cho người dùng tương tác với PAM: yêu cầu checkout credential, khởi tạo session, xem recorded sessions, quản lý safes và policy. PVWA cũng là nơi thực hiện approval workflow cho privileged access requests.

**5. PTA (Privileged Threat Analytics)** — Module analytics tích hợp, phân tích behavior của privileged sessions để phát hiện anomaly: lệnh nguy hiểm bất thường (ví dụ: `net user /add` trong session database admin), truy cập file nhạy cảm, thay đổi configuration bất thường. PTA có thể tự động terminate session và gửi alert đến SIEM khi phát hiện suspicious activity.

**Luồng vận hành đầy đủ:**

```
User → PVWA (authenticate + MFA)
     → Policy engine check (có quyền checkout account này không?)
     → Digital Vault trả credential (encrypted)
     → PSM tạo session proxy đến target server
     → Target server (user làm việc, không biết password)
     → Session recording lưu toàn bộ activity
     → Sau session: CPM tự động rotate credential
```

Mỗi bước trong luồng này đều sinh ra event có thể được forward đến SIEM, tạo thành audit trail hoàn chỉnh từ đầu đến cuối.

---

## 3. BeyondTrust — Mạnh về Endpoint và Third-party Remote

BeyondTrust có cách tiếp cận khác biệt so với CyberArk, đặc biệt mạnh trong hai lĩnh vực: **endpoint privilege management** và **third-party vendor access**.

**Password Safe** là module core của BeyondTrust: credential vault kết hợp session management, tương tự CyberArk PSM nhưng với interface hiện đại hơn và khả năng triển khai SaaS nhanh hơn. Password Safe tích hợp chặt chẽ với cloud platforms (AWS, Azure, GCP), cho phép quản lý cloud IAM credentials và secrets bên cạnh traditional server credentials.

**Privileged Remote Access (PRA)** giải quyết bài toán mà nhiều tổ chức đau đầu: làm thế nào để vendor, contractor, hoặc third-party support có thể truy cập hệ thống mà không cần cấp VPN access? BeyondTrust PRA cung cấp browser-based access portal — vendor đăng nhập vào web portal, thực hiện session trong browser, không cần cài thêm phần mềm, không cần VPN, và toàn bộ session được record. Với SOC, đây là improvement đáng kể: trước đây, third-party access qua VPN gần như không thể audit; với PRA, có full session recording và activity log.

**Endpoint Privilege Management (EPM)** là điểm mạnh độc đáo của BeyondTrust: thay vì cấp local admin cho toàn bộ endpoint (rủi ro cao), EPM cho phép **just-in-time elevation** tại endpoint — user yêu cầu quyền admin để cài một phần mềm cụ thể, EPM cấp quyền tạm thời cho đúng ứng dụng đó, ghi lại mọi hành động, rồi thu hồi quyền. Điều này trực tiếp giảm attack surface từ malware cần local admin để execute (ví dụ: nhiều ransomware cần elevation).

Với SOC, lợi thế của BeyondTrust là **cloud-native deployment** nhanh hơn, phù hợp cho mid-market và tổ chức đang trong quá trình cloud migration, trong khi CyberArk vẫn là lựa chọn tốt hơn cho môi trường on-premises quy mô lớn và phức tạp.

---

## 4. Delinea (Thycotic + Centrify) — Cloud-ready PAM

Delinea ra đời từ merger của Thycotic và Centrify năm 2021, mang lại giải pháp PAM hybrid-cloud ở phân khúc giá thấp hơn CyberArk nhưng vẫn đủ mạnh cho tổ chức vừa và lớn.

**Secret Server** là sản phẩm flagship: credential vault với giao diện web thân thiện, workflow approval linh hoạt (ai cần approve khi ai checkout credential gì), và API-first architecture cho phép tích hợp dễ dàng với CI/CD pipeline — một điểm mạnh quan trọng khi DevOps team cần secrets management cho automation. Secret Server hỗ trợ cả on-premises và SaaS, và có khả năng discovery tự động để tìm unmanaged privileged accounts trong environment.

**Privilege Manager** là module EPM của Delinea, tương tự BeyondTrust EPM: kiểm soát application execution và just-in-time elevation trên endpoints. Đặc biệt phù hợp cho tổ chức cần compliance với CIS Benchmarks hoặc NIST frameworks về endpoint hardening.

**Connection Manager** là session proxy của Delinea, cung cấp chức năng tương tự CyberArk PSM nhưng với deployment model nhẹ hơn. Cho phép RDP và SSH sessions được proxied qua Delinea platform, với session recording và real-time monitoring.

Từ góc độ SOC, Delinea gửi event tương tự CyberArk qua Syslog/CEF, và có sẵn integration với major SIEM platforms. Điểm cần lưu ý: log format của Delinea khác CyberArk, nên khi onboard khách hàng mới cần kiểm tra parsing rules trong SIEM để đảm bảo correlation hoạt động đúng.

---

## 5. Microsoft Entra PIM — Just-in-Time trong Cloud

Với tổ chức dùng Microsoft 365 và Azure, **Privileged Identity Management (PIM)** là tính năng có sẵn trong Entra ID (Azure AD Premium P2) để implement JIT access cho cloud resources mà không cần đầu tư thêm giải pháp PAM riêng biệt.

**Khái niệm cốt lõi — Eligible vs Active role:**

- **Eligible role**: User được phép yêu cầu kích hoạt role này, nhưng chưa có quyền ngay. Đây là trạng thái "bình thường" — user không có standing privilege.
- **Active role**: Role đang được kích hoạt và user đang có quyền thực sự. Role này có thời hạn (thường từ 1-8 giờ) và sẽ tự động expire.

**Luồng JIT với Entra PIM:**

```
User nhận Eligible role (được cấu hình bởi admin)
  ↓
User cần làm gì đó cần quyền cao
  ↓
User vào PIM portal → Request activation
  ↓
Nhập Justification (lý do cần quyền)
  ↓
Hoàn thành MFA challenge
  ↓
Gửi đến Approver (nếu policy yêu cầu approval)
  ↓
Approver approve (hoặc auto-approve nếu policy cho phép)
  ↓
Role trở thành Active trong n giờ
  ↓
Tự động expire — user trở về Eligible, không còn quyền
```

**Telemetry quan trọng trong Entra ID Audit Logs cho SOC:**

| Event | Ý nghĩa | Alert condition |
|-------|---------|-----------------|
| `Add member to role completed (PIM)` | Role activation thành công | Ngoài business hours, user lần đầu dùng PIM |
| `Role activation requested` | User yêu cầu kích hoạt role | Tần suất cao bất thường |
| `Role activation denied` | Request bị từ chối | Nhiều denied liên tiếp từ cùng user |
| `Add eligible member to role` | Ai đó được gán eligible role | Ai gán? Có authorized không? |

**Detection patterns với PIM:** Nhiều activation requests trong thời gian ngắn từ cùng một account có thể là dấu hiệu account bị compromise và attacker đang thử escalate privileges. Activation từ location hoặc IP không thường thấy, kết hợp với activation ngoài giờ làm việc, là combination đáng ngờ cao. Đặc biệt cần chú ý khi account không có lịch sử dùng PIM đột nhiên activate Global Administrator role.

---

## 6. Telemetry PAM cho SOC

Giá trị lớn nhất của PAM với SOC không chỉ là ngăn chặn tấn công — mà còn là **nguồn telemetry chất lượng cao** về privileged activity. Dưới đây là các event CyberArk forward qua Syslog/CEF đến SIEM:

**Credential Management Events:**
- `CPM Rotation Success` / `CPM Rotation Fail` — Rotation failure liên tục là indicator mạnh nhất: credential đã bị thay đổi bên ngoài PAM, nghĩa là ai đó (hoặc malware) đã access target system trực tiếp
- `Checkout` / `Checkin` — Ai checkout credential gì, lúc mấy giờ, từ đâu
- `Access Denied` — Ai cố access safe/account mà không có quyền

**Session Events:**
- `Session Connect` / `Session Disconnect` — Khi nào session bắt đầu và kết thúc, thời lượng
- `Suspicious Command` (từ PTA) — Lệnh nguy hiểm được thực thi trong session đặc quyền
- `Session Terminated by PTA` — Session bị cắt do anomaly detection

**Discovery Events:**
- `Unmanaged Account Detected` — PAM discovery phát hiện privileged account không nằm trong vault — đây là gap nghiêm trọng, attacker có thể đang dùng account này mà PAM không biết

**Ba alert PAM quan trọng nhất cần có rule trong SIEM:**

1. **Credential checkout ngoài business hours**: Privileged credential được checkout lúc 2 giờ sáng là bất thường. Kết hợp với session đến critical server là incident P1.

2. **Session đến critical server từ location bất thường**: PSM record session từ IP/location không quen thuộc với user đó. Có thể là attacker đã compromise account PAM của user.

3. **CPM rotation failure liên tiếp trên cùng một account**: Nếu CPM không thể rotation vì "wrong current password", credential đã bị thay đổi ngoài PAM — server đó có thể đã bị compromise và attacker đã tự đổi password để duy trì persistence.

---

## 7. Tích hợp PAM với SIEM và SOAR

Để PAM thực sự có giá trị với SOC, telemetry từ PAM phải được tích hợp vào SIEM và SOAR để correlation và automated response.

**Forward PAM events vào Splunk/Wazuh:**

CyberArk hỗ trợ forward events qua Syslog (UDP/TCP) theo CEF format. Trong Splunk, cần cài đặt CyberArk Add-on for Splunk để có parsing đúng. Với Wazuh, cần cấu hình custom decoder cho CyberArk CEF format và tạo rules tương ứng.

**Correlation Rule mẫu — PSM Bypass Detection:**

```
Điều kiện: 
  PAM Checkout event (user A checkout account X)
  NHƯNG KHÔNG có PAM Session Connect event trong 10 phút tiếp theo
  
Kết luận: User A checkout credential nhưng dùng credential đó 
trực tiếp (không qua PSM) → Bypass session recording

Alert: HIGH severity — Investigate ngay
```

Đây là một trong những detection quan trọng nhất vì nó có nghĩa là activity của user không được record, mất đi một phần audit trail quan trọng. Lý do có thể là user vô tình bypass (copy-paste credential vào RDP client thay vì dùng PSM launch button) hoặc cố ý bypass để che giấu hành động.

**SOAR Automated Response với PTA Alert:**

Khi PTA phát hiện suspicious command trong privileged session (ví dụ: `procdump lsass.exe`, `net localgroup administrators /add`, hoặc mass file deletion), quy trình automated response có thể được cấu hình trong SOAR:

```
PTA Alert → SOAR webhook
  → Terminate PSM session (CyberArk API)
  → Lock account trong PAM (không cho checkout thêm)
  → Tạo Incident ticket trong Jira/ServiceNow
  → Notify SOC L2 qua Slack/Teams
  → Thu thập session recording URL vào ticket
  → Tạo snapshot của target server (nếu là VM)
```

Toàn bộ quy trình trên có thể hoàn thành trong dưới 2 phút mà không cần human intervention, giảm đáng kể Mean Time to Contain (MTTC). Đây là ví dụ điển hình về cách PAM, SIEM, và SOAR kết hợp tạo thành security ecosystem có khả năng phản ứng nhanh với privileged access abuse.
