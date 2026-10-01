---
id: iam-fundamentals
title: IAM — Quản lý Danh tính & Quyền truy cập
sidebar_label: IAM Fundamentals
sidebar_position: 5
description: Nền tảng lý thuyết và thực tiễn về Identity & Access Management — Authentication, Authorization, RBAC/ABAC, Active Directory, SSO, MFA và tích hợp SOC.
---

# IAM — Quản lý Danh tính & Quyền truy cập

## 1. IAM là gì và tại sao quan trọng với SOC

Identity and Access Management (IAM) không chỉ là một tập hợp công nghệ — đây là triết lý quản trị bảo đảm rằng **đúng người, đúng thời điểm, đúng quyền hạn** được truy cập **đúng tài nguyên**. Từ góc nhìn vận hành, IAM là lớp kiểm soát đầu tiên và quan trọng nhất trong mọi hệ thống bảo mật doanh nghiệp.

Với SOC Analyst, lý do IAM trở thành trung tâm của mọi cuộc điều tra nằm ở một thực tế đơn giản: **identity chính là "vũ khí mới" của kẻ tấn công**. Theo CrowdStrike 2024 Global Threat Report, hơn 80% các vụ breach bắt đầu từ compromised credentials — không phải từ exploit zero-day hay malware tinh vi, mà từ việc kẻ tấn công đơn giản là **đăng nhập bằng thông tin hợp lệ bị đánh cắp**. Điều này có nghĩa là nếu không giám sát chặt chẽ lớp identity, mọi đầu tư vào firewall, EDR hay IDS đều có thể trở nên vô nghĩa.

Trong thực tế vận hành SOC, IAM cung cấp nguồn telemetry phong phú nhất: mọi hành động của người dùng đều để lại dấu vết xác thực và ủy quyền có thể tương quan trong SIEM. Đây là lý do tại sao hiểu sâu về IAM là kỹ năng không thể thiếu của bất kỳ analyst nào.

---

## 2. Authentication vs Authorization vs Accounting (AAA)

Ba khái niệm trong mô hình AAA thường bị nhầm lẫn nhưng có vai trò hoàn toàn khác nhau, đặc biệt khi phân tích event log trong SIEM:

**Authentication** (Xác thực) là quá trình xác minh danh tính: "Bạn có thực sự là người bạn tự nhận không?" — Trong Windows, sự kiện thất bại authentication được ghi nhận qua **Event ID 4625** (An account failed to log on). Analyst cần chú ý trường `SubStatus` để phân biệt nguyên nhân: `0xC000006A` là sai mật khẩu, `0xC0000234` là tài khoản bị khóa, `0xC0000064` là username không tồn tại.

**Authorization** (Phân quyền) xảy ra sau khi xác thực thành công: "Bạn có được phép làm điều này không?" — Trong Windows, **Event ID 4624** (Successful logon) kết hợp với các sự kiện Object Access (4663, 4664) cho thấy tài khoản đã xác thực thành công nhưng bị từ chối quyền truy cập tài nguyên cụ thể. Đây là dấu hiệu quan trọng của cả misconfiguration lẫn privilege escalation attempt.

**Accounting** (Kiểm toán) ghi lại những gì đã xảy ra sau khi truy cập được cấp phép — **Event ID 4672** (Special privileges assigned to new logon) là một trong những event quan trọng nhất với SOC, đánh dấu thời điểm một tài khoản được gán quyền đặc biệt như `SeDebugPrivilege`, `SeImpersonatePrivilege` hay `SeTcbPrivilege`. Bất kỳ account nào không phải built-in admin nhận được 4672 đều cần điều tra ngay.

Sự phân biệt này có giá trị thực tiễn cao: một alert về authentication failure hàng loạt (brute force) cần phản ứng khác hoàn toàn so với alert về authorization denied trên tài nguyên nhạy cảm (có thể là insider threat hoặc lateral movement).

---

## 3. RBAC, ABAC và Principle of Least Privilege

**Role-Based Access Control (RBAC)** là mô hình phổ biến nhất trong doanh nghiệp: quyền được gán cho role (vai trò), và người dùng được gán vào role thay vì nhận quyền trực tiếp. Ưu điểm: dễ quản lý ở quy mô lớn. Nhược điểm: thiếu linh hoạt khi cần kiểm soát dựa trên context (ví dụ: người dùng chỉ được truy cập dữ liệu của khách hàng thuộc region mình phụ trách).

**Attribute-Based Access Control (ABAC)** giải quyết hạn chế đó bằng cách đánh giá policy dựa trên thuộc tính (attributes) của user, tài nguyên, và môi trường: "Cho phép truy cập nếu user.department == resource.owner_department VÀ environment.time WITHIN business_hours". ABAC mạnh mẽ hơn nhưng phức tạp hơn nhiều trong triển khai và debug.

**Principle of Least Privilege (PoLP)** là nền tảng của cả RBAC lẫn ABAC, và là trụ cột không thể thiếu của Zero Trust: mỗi entity (người dùng, ứng dụng, service) chỉ nhận đúng và đủ quyền cần thiết để hoàn thành nhiệm vụ của mình — không hơn, không kém. Trong thực tế SOC, vi phạm PoLP là nguồn gốc của đa số vụ privilege escalation thành công.

Để đánh giá mức độ trưởng thành của tổ chức về identity, có thể dùng mô hình **Identity Maturity**:

| Giai đoạn | Đặc điểm | Rủi ro SOC |
|-----------|-----------|------------|
| **Shared accounts** | Nhiều người dùng chung một account | Không thể attribution, audit vô nghĩa |
| **Individual accounts** | Mỗi người một tài khoản riêng | Tốt hơn nhưng thiếu MFA, password yếu |
| **MFA enforced** | Xác thực đa yếu tố bắt buộc | Giảm risk đáng kể, nhưng MFA có thể bypass |
| **JIT Access** | Quyền chỉ tồn tại khi cần, tự expire | Gần Zero Trust thực sự |

---

## 4. Active Directory — Trung tâm Identity doanh nghiệp

Active Directory Domain Services (AD DS) vẫn là hệ thống identity trung tâm của tuyệt đại đa số doanh nghiệp trên toàn cầu, bất chấp làn sóng cloud. Hiểu AD là kỹ năng bắt buộc với mọi SOC Analyst.

**Kerberos authentication flow** — Giao thức xác thực chính của AD — hoạt động theo 3 bước:

1. **AS-REQ / TGT**: Client gửi yêu cầu xác thực đến Authentication Service (KDC). Nếu thành công, KDC cấp một Ticket Granting Ticket (TGT) được mã hóa bằng hash của mật khẩu tài khoản `krbtgt`. → **Event ID 4768** (Kerberos authentication ticket requested)

2. **TGS-REQ / TGS**: Client dùng TGT để yêu cầu Service Ticket từ Ticket Granting Service. TGS được mã hóa bằng hash của service account. → **Event ID 4769** (Kerberos service ticket requested)

3. **AP-REQ**: Client trình Service Ticket cho target service để truy cập tài nguyên.

Việc nắm Kerberos flow giúp analyst hiểu ngay các kỹ thuật tấn công phổ biến nhất: **Kerberoasting** (yêu cầu TGS cho service accounts rồi brute-force offline — dấu hiệu: nhiều Event 4769 bất thường từ một account), **Pass-the-Ticket** (inject stolen TGT — dấu hiệu: Event 4768 với Ticket Encryption Type RC4 từ account không thường dùng RC4), **Golden Ticket** (forge TGT bằng `krbtgt` hash — dấu hiệu: TGT với lifetime bất thường dài).

**Bảng Event ID quan trọng cho SOC:**

| Event ID | Mô tả | Ý nghĩa bảo mật |
|----------|--------|-----------------|
| **4624** | Account logon success | Baseline; cần tương quan với nguồn, giờ, location |
| **4625** | Account logon failed | Brute force, credential stuffing, spray attack |
| **4648** | Logon with explicit credentials | Lateral movement, RunAs, Pass-the-Hash indicator |
| **4768** | Kerberos TGT requested | Baseline Kerberos; RC4 encryption = suspicious |
| **4769** | Kerberos TGS requested | Kerberoasting nếu nhiều TGS từ 1 account |
| **4776** | NTLM authentication | NTLM vẫn dùng = legacy risk; PtH indicator |
| **4720** | User account created | Rogue account creation, persistence |
| **4728** | Member added to security group | Privilege escalation, persistence |
| **4672** | Special privileges assigned | Admin-level access, cần investigate ngay |

---

## 5. SSO và Federation (SAML, OAuth 2.0, OIDC)

Khi doanh nghiệp mở rộng sang cloud và SaaS, mô hình identity không còn giới hạn trong AD on-premises. **Single Sign-On (SSO)** và các giao thức federation trở thành cầu nối, nhưng cũng tạo ra bề mặt tấn công mới mà SOC cần hiểu.

**SAML 2.0** (Security Assertion Markup Language) là tiêu chuẩn enterprise truyền thống, sử dụng XML-based assertion giữa Identity Provider (IdP — ví dụ: AD FS, Entra ID) và Service Provider (SP — ứng dụng doanh nghiệp). SAML phù hợp cho browser-based SSO trong môi trường enterprise tập trung. Tấn công đáng chú ý: **Golden SAML** — tương tự Golden Ticket nhưng ở layer SAML, attacker forge SAML assertion bằng private key của IdP.

**OAuth 2.0** không phải giao thức authentication mà là **authorization framework**: cho phép một ứng dụng truy cập tài nguyên thay mặt người dùng mà không cần biết password. Đây là nền tảng của "Sign in with Google/Microsoft" và API authorization. Token-based (Access Token, Refresh Token). Điểm yếu: Refresh Token bị stolen có thể dùng lâu dài mà không cần MFA lại.

**OpenID Connect (OIDC)** là lớp identity được thêm lên trên OAuth 2.0: bổ sung ID Token (JWT chứa thông tin identity của user) để OAuth flow có thể dùng cho authentication. OIDC là giao thức phổ biến nhất hiện nay cho web/mobile authentication.

**Implication cho SOC**: Khi tổ chức dùng hybrid identity (AD on-prem + Entra ID), cần giám sát song song hai nguồn log:
- **On-premises AD**: Event ID 4624/4625/4768/4769 từ Domain Controller
- **Entra ID Sign-in Logs**: Interactive/Non-interactive signins, Service Principal signins — đặc biệt quan trọng khi phát hiện impossible travel, unfamiliar sign-in properties, hoặc token theft (signin from IP khác với token issuance IP).

---

## 6. Multi-Factor Authentication (MFA) và điểm mù

MFA (Multi-Factor Authentication) là biện pháp phòng thủ có hiệu quả cao — Microsoft báo cáo MFA chặn 99.9% account compromise attacks. Tuy nhiên, MFA **không phải silver bullet**, và SOC cần nắm rõ các kỹ thuật bypass để phát hiện kịp thời.

**MFA Fatigue (Push Bombing)**: Attacker liên tục gửi MFA push notification đến điện thoại của nạn nhân, với hy vọng nạn nhân vô tình hoặc bực bội mà bấm "Approve". Không để lại dấu vết rõ ràng trong event log, nhưng có thể phát hiện qua: nhiều MFA push requests trong thời gian ngắn từ IP lạ, kết hợp với logon success sau chuỗi failed MFA.

**SIM Swapping**: Attacker thuyết phục nhà mạng chuyển số điện thoại của nạn nhân sang SIM của chúng, chiếm OTP SMS. Indicator: thay đổi số điện thoại đăng ký MFA trong Entra ID audit logs.

**Adversary-in-the-Middle (AiTM) Phishing**: Đây là kỹ thuật nguy hiểm nhất. Công cụ như **EvilGinx** hoạt động như reverse proxy: nạn nhân thực sự đăng nhập qua proxy của attacker, attacker capture cả credentials lẫn session cookie đã được MFA xác thực. Kết quả: attacker có session token hợp lệ, bypass hoàn toàn MFA. Indicator trong Entra ID: signin thành công nhưng từ IP proxy/VPS, sau đó ngay lập tức có activity từ IP khác (session token replay).

**Event ID phân tích MFA failure:**

| SubStatus Code | Ý nghĩa | Hành động SOC |
|---------------|---------|---------------|
| `0xC000006A` | Wrong password | Monitor frequency — brute force nếu >5 lần/phút |
| `0xC0000234` | Account locked out | Triage ngay — brute force thành công hoặc DoS |
| `0xC000006D` | Bad username/password (generic) | Credential stuffing pattern |
| `0xC0000072` | Account disabled | Attacker thử disabled account |

---

## 7. Identity từ góc độ SIEM/SOC

Tổng hợp lại, dưới đây là các detection pattern cốt lõi mà mọi SOC Analyst cần thuộc lòng khi làm việc với identity telemetry:

**Impossible Travel**: User xác thực thành công từ Hà Nội lúc 9:00 AM, rồi lại xác thực thành công từ London lúc 9:15 AM — không thể di chuyển trong 15 phút. Đây là chỉ báo mạnh của account compromise hoặc VPN/proxy abuse. Entra ID tích hợp sẵn detection này; với on-prem AD cần build rule trong SIEM.

**Credential Stuffing**: Nhiều failed login attempts đến cùng một account từ nhiều IP khác nhau trong thời gian ngắn — hoặc ngược lại, một IP thử nhiều usernames khác nhau (password spray). Pattern: Event 4625 với nhiều unique Source IPs, cùng SubStatus `0xC000006A`.

**Lateral Movement via Identity**: Một account đột ngột xuất hiện authentication trên nhiều máy khác nhau trong thời gian ngắn — đặc biệt khi kết hợp với Event 4648 (explicit credential use) hoặc NTLM authentication (4776) thay vì Kerberos. Dấu hiệu của Pass-the-Hash, Pass-the-Ticket, hoặc credential-based lateral movement.

**Privilege Escalation**: Account không thuộc nhóm admin đột nhiên xuất hiện trong Event 4728 (added to privileged group) hoặc nhận Event 4672 (special privileges). Đặc biệt nghiêm trọng nếu xảy ra ngoài business hours hoặc không có Change ticket tương ứng trong ITSM.

Khi kết hợp các pattern trên với threat intelligence (known bad IPs, leaked credential lists) và business context (giờ làm việc, địa lý, role của user), SOC có thể xây dựng detections có độ chính xác cao, giảm false positive và tăng tốc độ phát hiện thực sự khi có breach.
