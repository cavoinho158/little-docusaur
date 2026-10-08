---
id: microsoft365-soc
title: Microsoft 365 cho SOC — Cấu hình, Baseline & Detection
sidebar_label: Microsoft 365 for SOC
sidebar_position: 2
description: Cấu hình thu thập logs M365, baseline hoạt động bình thường theo từng workload, phân tích cấu trúc log và detection rules (KQL + SPL) cho các kịch bản tấn công phổ biến.
---

# Microsoft 365 cho SOC: Cấu hình, Baseline & Detection

> Tài liệu ôn tập sau topic *Microsoft 365 for SOC* (TryHackMe), theo hướng thực hành: bật log đúng cách, xây dựng baseline hành vi bình thường, thu thập về SIEM, hiểu cấu trúc log và tương quan nhiều nguồn để phát hiện tấn công. Các mốc retention và license có thể thay đổi, hãy xác nhận lại trên tài liệu Microsoft hiện hành trước khi triển khai.

---

## 1. Tổng quan các nguồn log của Microsoft 365

Microsoft 365 không có một nguồn log duy nhất. Mỗi dịch vụ ghi log ở một nơi, với schema khác nhau, nên SOC cần hiểu rõ nguồn nào trả lời câu hỏi nào.

| Nguồn log | Nội dung chính | Dùng để phát hiện |
| --- | --- | --- |
| Entra ID Sign-in logs | Mọi lần đăng nhập: interactive, non-interactive, service principal, managed identity | Brute force, password spray, MFA fatigue, impossible travel, đăng nhập từ legacy protocol |
| Entra ID Audit logs | Thay đổi trong directory: user, group, role, app, Conditional Access | Leo thang đặc quyền, persistence, OAuth consent phishing |
| Unified Audit Log (Purview) | Hoạt động của Exchange, SharePoint, OneDrive, Teams, Power Platform... | BEC, rò rỉ dữ liệu, thao tác file hàng loạt |
| Exchange Online (mailbox audit, message trace) | Thao tác hộp thư, luồng email vào/ra | Inbox rule độc hại, forward trái phép, phishing |
| Entra ID Protection | Risk detections, risky users, risky sign-ins | Leaked credentials, anonymous IP, token anomaly |
| Microsoft Defender XDR | Alerts và bảng hunting (EmailEvents, CloudAppEvents, IdentityLogonEvents...) | Tương quan email, endpoint, identity và cloud app |

Lưu ý quan trọng: Unified Audit Log (UAL) chứa cả các sự kiện của Entra ID (workload AzureActiveDirectory), nhưng Sign-in logs đầy đủ chi tiết (ví dụ Conditional Access, device, risk) chỉ có ở Entra ID Sign-in logs. Khi điều tra cần đối chiếu cả hai.

---

## 2. Cấu hình bật logging

### 2.1 Quyền và license cần chuẩn bị

- Xem và bật audit: vai trò *Audit Logs* hoặc *View-Only Audit Logs* trong Exchange Online/Purview, hoặc Global Administrator.
- Đọc Entra logs: *Reports Reader*, *Security Reader*, *Global Reader* hoặc *Security Administrator*.
- Export Entra logs qua Diagnostic Settings: *Security Administrator* hoặc *Global Administrator*, cộng quyền ghi trên đích (Log Analytics workspace, Event Hub, Storage).
- Một số sự kiện nâng cao (ví dụ MailItemsAccessed, retention dài) phụ thuộc license Audit (Premium) hoặc E5. Kiểm tra license của tenant trước.

### 2.2 Bật Unified Audit Log

Tenant mới thường đã bật sẵn, nhưng vẫn phải kiểm tra:

```powershell
Connect-ExchangeOnline
Get-AdminAuditLogConfig | Format-List UnifiedAuditLogIngestionEnabled
Set-AdminAuditLogConfig -UnifiedAuditLogIngestionEnabled $true
```

Sau khi bật có thể mất một khoảng thời gian trước khi log xuất hiện. Có thể tìm kiếm qua Microsoft Purview (Audit search) hoặc PowerShell (mục 3).

### 2.3 Mailbox auditing

Mailbox auditing mặc định bật cho mọi mailbox, nhưng cần xác nhận không bị tắt ở mức tổ chức hoặc từng mailbox:

```powershell
Get-OrganizationConfig | Format-List AuditDisabled
Get-Mailbox -ResultSize Unlimited | Select-Object UserPrincipalName,AuditEnabled,AuditOwner
Set-OrganizationConfig -AuditDisabled $false
```

Các hành động được ghi theo logon type: Owner, Delegate, Admin. Với tài khoản giá trị cao (lãnh đạo, tài chính), nên bổ sung các action như MailItemsAccessed (nếu license hỗ trợ) để biết kẻ tấn công đã đọc những email nào.

### 2.4 Entra ID: Diagnostic Settings

Trong Entra admin center: *Monitoring and health* > *Diagnostic settings* > *Add diagnostic setting*. Chọn các category cần export:

- SignInLogs, NonInteractiveUserSignInLogs, ServicePrincipalSignInLogs, ManagedIdentitySignInLogs
- AuditLogs
- RiskyUsers, UserRiskEvents (cần P2)
- ProvisioningLogs, ADFSSignInLogs (nếu dùng)

Đích gửi: Log Analytics workspace (cho Microsoft Sentinel), Event Hub (cho Splunk, QRadar, Elastic) hoặc Storage Account (lưu trữ dài hạn). Đừng bỏ sót NonInteractiveUserSignInLogs vì nhiều cuộc tấn công dùng token (AiTM, token replay) chỉ để lại dấu vết ở đây.

### 2.5 Thời gian lưu trữ (retention) cần nắm

| Nguồn | Mức thường gặp |
| --- | --- |
| Entra Sign-in và Audit logs | 7 ngày (Free), 30 ngày (P1/P2) |
| Unified Audit Log | 180 ngày (Standard), 1 năm (Audit Premium/E5), có thể mua thêm lên đến 10 năm |
| Defender XDR Advanced Hunting | 30 ngày |
| Message trace | 90 ngày (lịch sử), 10 ngày cho truy vấn nhanh |

Vì retention gốc ngắn so với dwell time của kẻ tấn công, nên export về SIEM hoặc storage riêng để lưu lâu hơn.

### 2.6 Checklist cấu hình

- UAL đã bật và có kết nối thu thập về SIEM.
- Mailbox auditing không bị tắt (AuditDisabled là False).
- Entra Diagnostic Settings export đủ cả interactive và non-interactive sign-in.
- Có license/cấu hình cho Entra ID Protection và Defender for Office 365 nếu tổ chức cần.
- Đồng bộ thời gian: toàn bộ log M365 dùng UTC, SIEM và analyst cần quy đổi nhất quán.
- Có tài khoản break-glass được cảnh báo riêng khi đăng nhập.

---

## 3. Cách thu thập logs

### 3.1 Tổng hợp các phương thức

| Phương thức | Phù hợp khi | Ghi chú |
| --- | --- | --- |
| Portal (Purview Audit search, Entra Sign-in logs) | Điều tra nhanh, một vài user | Giới hạn số kết quả, khó tự động |
| PowerShell (Search-UnifiedAuditLog, Microsoft Graph) | Điều tra sự cố, script thu thập | Cần phân trang, giới hạn khoảng thời gian |
| Office 365 Management Activity API | Đẩy log liên tục về SIEM tự xây | Theo mô hình subscription, độ trễ nhiều phút |
| Diagnostic Settings | Entra logs về Sentinel, Event Hub, Storage | Gần thời gian thực, cấu hình một lần |
| Connector có sẵn (Sentinel, Splunk Add-on, Elastic integration) | Vận hành SOC lâu dài | Đã map sẵn schema và bảng |

### 3.2 PowerShell: tìm UAL và Sign-in logs

```powershell
# Unified Audit Log: tìm thao tác inbox rule trong 7 ngày
Search-UnifiedAuditLog -StartDate (Get-Date).AddDays(-7) -EndDate (Get-Date) -Operations New-InboxRule,Set-InboxRule -ResultSize 5000 | Select-Object CreationDate,UserIds,Operations,AuditData

# Entra Sign-in logs qua Microsoft Graph
Connect-MgGraph -Scopes 'AuditLog.Read.All'
Get-MgAuditLogSignIn -Top 100 | Select-Object CreatedDateTime,UserPrincipalName,IpAddress,AppDisplayName,ClientAppUsed
```

Lưu ý: kết quả của Search-UnifiedAuditLog tối đa 5000 bản ghi mỗi lần, cần chia nhỏ khoảng thời gian hoặc dùng SessionId và SessionCommand ReturnLargeSet để phân trang.

### 3.3 Office 365 Management Activity API

Luồng làm việc gồm 3 bước: bật subscription cho từng content type, liệt kê các content blob mới, rồi tải nội dung từng blob.

- Content types: Audit.AzureActiveDirectory, Audit.Exchange, Audit.SharePoint, Audit.General, DLP.All.
- Cần đăng ký ứng dụng trong Entra ID với quyền ActivityFeed.Read trên API Office 365 Management APIs.
- Log có thể đến trễ từ vài phút đến vài giờ. Detection cần tính đến độ trễ này để tránh bỏ sót khi truy vấn theo cửa sổ thời gian ngắn.

### 3.4 Ánh xạ sang Microsoft Sentinel

| Dữ liệu | Bảng trong Sentinel |
| --- | --- |
| Entra Sign-in (interactive) | SigninLogs |
| Entra Sign-in (non-interactive, service principal, managed identity) | AADNonInteractiveUserSignInLogs, AADServicePrincipalSignInLogs, AADManagedIdentitySignInLogs |
| Entra Audit | AuditLogs |
| Exchange, SharePoint, OneDrive, Teams (UAL) | OfficeActivity |
| Hoạt động cloud app (Defender for Cloud Apps) | CloudAppEvents |
| Email (Defender for Office 365) | EmailEvents, EmailUrlInfo, EmailAttachmentInfo, UrlClickEvents |
| Risk của Entra ID Protection | AADUserRiskEvents, AADRiskyUsers |

---

## 4. Baseline hoạt động bình thường

:::important

Một detection rule hiệu quả không chỉ dựa trên "hành vi xấu trông như thế nào" mà còn phải biết "hành vi bình thường của tổ chức này trông như thế nào". Phần này mô tả những gì SOC cần thu thập và đo lường để thiết lập baseline — nền tảng để giảm false positive và phát hiện anomaly thực sự.

:::

### 4.1 Tại sao baseline quan trọng

Nếu không có baseline, mọi ngưỡng trong detection rule đều là phỏng đoán. Một tổ chức có 5000 nhân viên remote toàn cầu sẽ có hàng trăm lần đăng nhập "từ quốc gia lạ" mỗi ngày — điều đó bình thường với họ nhưng nghi ngờ với tổ chức 50 người chỉ làm việc tại một văn phòng. Baseline không phải là danh sách tĩnh mà là **phân phối thống kê** của hành vi theo thời gian: trung bình, độ lệch chuẩn, giờ cao điểm, địa lý thông thường, ứng dụng được dùng nhiều nhất.

Baseline cũng thay đổi theo thời gian: khai trương văn phòng mới, nhân viên đi công tác, triển khai hệ thống mới đều tạo ra "anomaly tạm thời" cần được ghi nhận và loại trừ. SOC cần có quy trình cập nhật baseline định kỳ, không chỉ xây một lần rồi để đó.

### 4.2 Baseline đăng nhập (Sign-in Baseline)

Đây là tầng baseline quan trọng nhất vì sign-in là cửa ngõ đầu tiên của mọi cuộc tấn công.

**Địa lý và múi giờ:** Xác định các quốc gia và khu vực mà user của tổ chức thường đăng nhập từ đó. Với mỗi user hoặc nhóm user (theo phòng ban, chức năng), ghi nhận phân phối quốc gia trong 30–90 ngày. Sau đó mọi đăng nhập từ quốc gia không có trong lịch sử đều là tín hiệu cần xem xét — không nhất thiết là alert ngay, nhưng nên được ghi nhận và tương quan với các yếu tố khác.

**Giờ đăng nhập:** Hầu hết user đăng nhập trong khung giờ làm việc (8h–20h giờ địa phương). Đăng nhập lúc 2h–4h sáng theo múi giờ của user là bất thường. Xây dựng histogram theo giờ trong tuần (weekday vs weekend) cho từng nhóm user, đặc biệt là admin và tài khoản có đặc quyền cao.

**Ứng dụng và giao thức:** Mỗi user thường chỉ dùng một tập ứng dụng cố định: Outlook Web App, Microsoft Teams, SharePoint, OneDrive, đôi khi Power BI hay Dynamics. Đăng nhập vào ứng dụng chưa bao giờ dùng (đặc biệt là Graph API explorer, Azure Portal, PowerShell) là dấu hiệu cần điều tra. Legacy authentication protocols (IMAP, POP3, SMTP Auth, Exchange ActiveSync khi không phải từ thiết bị di động đã đăng ký) phải được giám sát riêng — trong nhiều tổ chức, legacy auth nên được chặn hoàn toàn bằng Conditional Access.

**Thiết bị:** User thường đăng nhập từ một tập thiết bị nhỏ (1–3 thiết bị chính). Thiết bị mới, unmanaged (không join domain, không compliant) xuất hiện lần đầu là tín hiệu. Đặc biệt chú ý khi thiết bị lạ được dùng cùng IP với đăng nhập thành công ngay sau chuỗi thất bại.

**Tần suất và số lần thất bại:** Ghi nhận trung bình số lần đăng nhập thành công và thất bại theo ngày, theo user. Password spray thường tạo ra pattern: nhiều user khác nhau bị thất bại (ResultType 50126) từ cùng một IP trong cửa sổ thời gian ngắn, trong khi brute force vào một account cụ thể tạo pattern ngược lại.

**KQL — Xây baseline sign-in theo quốc gia và giờ (Sentinel):**

```kql
// Thu thập phân phối sign-in bình thường 30 ngày qua
SigninLogs
| where TimeGenerated between (ago(30d) .. ago(1d))
| where ResultType == '0'
| summarize LoginCount=count()
    by UserPrincipalName,
       CountryOrRegion=tostring(LocationDetails.countryOrRegion),
       HourOfDay=datetime_part('hour', TimeGenerated),
       DayOfWeek=dayofweek(TimeGenerated),
       AppDisplayName
| order by UserPrincipalName asc, LoginCount desc
```

**SPL — Baseline sign-in theo giờ và IP range (Splunk):**

```spl
index=azure sourcetype="azure:monitor:aad" category=SignInLogs
    properties.resultType="0" earliest=-30d latest=-1d
| eval user=lower('properties.userPrincipalName'),
       country='properties.location.countryOrRegion',
       hour=strftime(_time,"%H"),
       app='properties.appDisplayName'
| stats count as logins by user country hour app
| sort - logins
```

### 4.3 Baseline Exchange & Email

Exchange là workload tạo ra lượng log lớn nhất và cũng là nơi kẻ tấn công thao tác nhiều nhất sau khi chiếm được tài khoản.

**Volume email gửi đi:** Mỗi user có một "tốc độ gửi email bình thường" — trung bình số email gửi mỗi giờ, mỗi ngày. User bình thường hiếm khi gửi quá 50–100 email trong một giờ. Spike bất thường (hàng trăm email trong vài phút) là dấu hiệu của spam campaign, exfiltration qua email, hoặc tài khoản bị chiếm dùng để phishing nội bộ.

**Inbox rules:** Người dùng thông thường có rất ít inbox rule (thường là 0–5 rule), được tạo không thường xuyên và trong giờ làm việc. Rule mới được tạo ngoài giờ, đặc biệt là rule có action DeleteMessage, MoveToFolder (thư mục ẩn), hoặc ForwardTo (địa chỉ bên ngoài) là bất thường.

**Delegation và shared mailbox access:** Ghi nhận ai có quyền truy cập vào mailbox của ai (FullAccess, SendAs, SendOnBehalf). Việc cấp quyền mới hoặc tài khoản bắt đầu truy cập vào mailbox của người khác mà không có trong danh sách được phép là bất thường.

**External forwarding:** Tổ chức nên có baseline là "không ai cấu hình forward ra ngoài" (trừ một số trường hợp được phê duyệt). Phát hiện Set-Mailbox với ForwardingSmtpAddress không phải domain nội bộ cần được alert ngay lập tức.

**Message trace — external domain thường giao tiếp:** Ghi nhận các external domain mà tổ chức thường xuyên gửi/nhận email. Email đến từ domain mới (chưa bao giờ giao tiếp trước đó) với attachment hoặc link là tín hiệu phishing cần tương quan với click-through.

**KQL — Baseline số email gửi đi theo user (Sentinel):**

```kql
// Phân phối lượng email gửi bình thường theo giờ
EmailEvents
| where TimeGenerated > ago(30d)
| where EmailDirection == 'Outbound'
| summarize EmailsSent=count()
    by SenderFromAddress, bin(TimeGenerated, 1h)
| summarize
    AvgPerHour=avg(EmailsSent),
    StdDev=stdev(EmailsSent),
    MaxPerHour=max(EmailsSent),
    P95=percentile(EmailsSent, 95)
    by SenderFromAddress
| order by AvgPerHour desc
```

### 4.4 Baseline SharePoint & OneDrive

**Download volume:** Đây là chỉ số quan trọng nhất để phát hiện data exfiltration. Ghi nhận số file download trung bình mỗi ngày của từng user. User bình thường thường download không quá 20–50 file/ngày trong điều kiện làm việc bình thường. Các đợt download hàng trăm file trong một giờ, đặc biệt là trước ngày user nghỉ việc hoặc từ nhiều site khác nhau cùng lúc, là tín hiệu mạnh.

**Sharing pattern:** Ghi nhận tần suất tạo sharing link, loại link (internal vs external, view-only vs edit), và domain nhận link. Anonymous link (anyone with the link) cần được giám sát đặc biệt — baseline của tổ chức thường không có hoặc rất ít anonymous link. Sharing với domain chưa bao giờ giao tiếp trước đó cần được review.

**Truy cập từ thiết bị lạ:** FileSyncDownloadedFull từ thiết bị không được quản lý (unmanaged device) là bất thường. Cần so sánh DeviceType và UserAgent với lịch sử của user.

**Thư mục và loại file nhạy cảm:** Xác định các site collection và thư mục chứa dữ liệu quan trọng (HR, Finance, Legal, M&A). Bất kỳ ai ngoài nhóm được phép truy cập vào những nơi đó đều cần được ghi nhận.

**KQL — Phân phối download theo user (Sentinel):**

```kql
OfficeActivity
| where TimeGenerated > ago(30d)
| where OfficeWorkload in ('SharePoint', 'OneDrive')
| where Operation in ('FileDownloaded', 'FileSyncDownloadedFull')
| summarize Downloads=count(), Sites=dcount(Site_Url)
    by UserId, bin(TimeGenerated, 1d)
| summarize
    AvgDailyDownloads=avg(Downloads),
    MaxDailyDownloads=max(Downloads),
    P95Downloads=percentile(Downloads, 95),
    AvgSitesPerDay=avg(Sites)
    by UserId
| order by AvgDailyDownloads desc
```

### 4.5 Baseline Teams

**Nhắn tin và cuộc họp:** Teams tạo ra lượng log rất lớn và hầu hết là benign. Baseline cần tập trung vào các hành vi bất thường hơn là giám sát nội dung: thêm member vào team đột ngột, tạo team hoặc channel mới với visibility settings lạ, gửi file (attachment) qua chat đến nhiều người chưa từng tương tác trước đó.

**External user và guest:** Ghi nhận số lượng guest user hiện tại và tốc độ thêm guest mới. Guest user được thêm ngoài giờ hành chính hoặc không thông qua quy trình phê duyệt là bất thường.

**Apps trong Teams:** Một số cuộc tấn công dùng Teams Apps (bot, connector) như C2 channel hoặc để exfiltrate data. Baseline danh sách app được install trong tenant và alert khi có app mới chưa được phê duyệt xuất hiện.

### 4.6 Baseline Entra ID — Thay đổi Directory

**Role assignment:** Trong tenant bình thường, việc cấp/thu hồi role đặc quyền diễn ra rất ít và có quy trình. Đặt baseline là "số lần Add member to role trong 30 ngày qua là N lần" — bất kỳ spike nào vượt trung bình cộng 2 lần độ lệch chuẩn đều đáng điều tra.

**App registration và consent:** Ghi nhận danh sách app đã được consent trong tenant. Consent mới đặc biệt là từ user thông thường (không phải admin) cần được review ngay. Các scope nguy hiểm cần watch: `Mail.Read`, `Mail.ReadWrite`, `Files.ReadWrite.All`, `offline_access`, `Directory.ReadWrite.All`.

**Password reset và MFA registration:** Bình thường user tự reset mật khẩu thỉnh thoảng, nhưng admin reset mật khẩu của người khác là sự kiện đáng chú ý. MFA method mới được đăng ký cần được verify với chính user đó — đây là dấu hiệu điển hình của tấn công Account Takeover (kẻ tấn công thêm MFA của chúng sau khi đổi mật khẩu).

**Conditional Access changes:** Policy CA không nên thay đổi thường xuyên. Bất kỳ thay đổi nào (Update, Delete) vào Conditional Access policy cần được cảnh báo ngay và review bởi security team.

**KQL — Phát hiện spike bất thường trong Audit Events (Sentinel):**

```kql
// So sánh volume audit events hôm nay với baseline 7 ngày trước
let baseline = AuditLogs
    | where TimeGenerated between (ago(8d) .. ago(1d))
    | summarize BaselineCount=count() by OperationName, DayOfWeek=dayofweek(TimeGenerated)
    | summarize AvgCount=avg(BaselineCount), StdCount=stdev(BaselineCount) by OperationName;
AuditLogs
| where TimeGenerated > ago(1d)
| summarize TodayCount=count() by OperationName
| join kind=inner baseline on OperationName
| extend ZScore=(TodayCount - AvgCount) / (StdCount + 1)
| where ZScore > 2
| project OperationName, TodayCount, AvgCount, ZScore
| order by ZScore desc
```

### 4.7 Baseline Service Principal & Application Activity

Service principal và managed identity là "user máy móc" — chúng đăng nhập liên tục theo lịch, không có người dùng thực đứng sau. Đây chính là lý do AADServicePrincipalSignInLogs và AADManagedIdentitySignInLogs thường bị bỏ qua nhưng lại quan trọng.

Với mỗi service principal, baseline cần ghi nhận: resource mà SP thường truy cập, tần suất đăng nhập, IP hoặc network location (thường là Azure datacenter IP), và credential type (certificate, client secret, federated identity). Bất kỳ thay đổi nào trong pattern này — SP đột ngột truy cập resource mới, đăng nhập từ IP không phải Azure, hoặc tần suất tăng đột ngột — là dấu hiệu credential của SP bị compromise hoặc SP bị dùng sai mục đích.

**KQL — Baseline service principal activity (Sentinel):**

```kql
// Phân phối resource và IP của từng service principal
AADServicePrincipalSignInLogs
| where TimeGenerated > ago(30d)
| where ResultType == '0'
| summarize
    LoginCount=count(),
    Resources=make_set(ResourceDisplayName),
    IPs=make_set(IPAddress),
    FirstSeen=min(TimeGenerated),
    LastSeen=max(TimeGenerated)
    by ServicePrincipalName, ServicePrincipalId
| order by LoginCount desc
```

### 4.8 Xây dựng watchlist và exclusion list

Baseline không chỉ là số liệu thống kê mà còn là danh sách các thực thể "đã biết là OK" cần được loại trừ khỏi alert. Một số loại watchlist cần có:

**Trusted IP ranges:** IP của văn phòng công ty, VPN corporate, NAT gateway của Azure/AWS nơi đặt workload. Đăng nhập từ IP này dù có pattern lạ về giờ giấc vẫn ít nghi ngờ hơn.

**Service accounts và automation:** Tài khoản dùng cho sync, backup, monitoring (ví dụ AADC sync account, MIM service account) tạo ra lượng lớn activity không phải từ người dùng thực. Cần tách ra khỏi user baseline và monitor riêng theo pattern của chúng.

**Approved external domains:** Danh sách domain đối tác, khách hàng, vendor thường xuyên nhận file chia sẻ từ SharePoint — loại trừ khỏi alert "sharing với external domain lạ".

**Break-glass accounts:** Tài khoản emergency admin không được dùng thường ngày. Bất kỳ đăng nhập nào từ tài khoản này đều phải alert với mức priority cao nhất, không có exclusion.

```kql
// Sentinel watchlist lookup — loại trừ IP tin cậy
let TrustedIPs = _GetWatchlist('TrustedIPRanges') | project SearchKey;
SigninLogs
| where TimeGenerated > ago(1d)
| where ResultType == '50126'
| where IPAddress !in (TrustedIPs)
| summarize Fails=count(), Users=dcount(UserPrincipalName) by IPAddress
| where Users > 5
```

---

## 5. Phân tích cấu trúc logs

### 5.1 Schema chung của Unified Audit Log

Mỗi bản ghi UAL có phần vỏ (wrapper) và phần AuditData dạng JSON chứa chi tiết. Các trường chung quan trọng:

| Trường | Ý nghĩa | Cách dùng khi điều tra |
| --- | --- | --- |
| CreationTime | Thời điểm sự kiện (UTC) | Dựng timeline |
| Id | ID duy nhất của bản ghi | Khử trùng lặp, trích dẫn bằng chứng |
| Operation | Hành động (ví dụ FileDownloaded, New-InboxRule, UserLoggedIn) | Lọc theo hành vi |
| RecordType | Loại bản ghi (số), xác định schema của AuditData | Biết nên đọc các trường nào |
| Workload | Dịch vụ: Exchange, SharePoint, OneDrive, MicrosoftTeams, AzureActiveDirectory | Phân nhóm nguồn |
| ResultStatus | Thành công hay thất bại | Phân biệt thử và thực hiện được |
| UserId | Tài khoản thực hiện (thường là UPN) | Khóa tương quan chính |
| UserType | Regular, Admin, DcAdmin, System, Application... | Phát hiện hành động từ ứng dụng hoặc admin |
| ClientIP | IP nguồn | Khóa tương quan, đối chiếu threat intel |
| ObjectId | Đối tượng bị tác động (file, mailbox, rule...) | Xác định phạm vi ảnh hưởng |

Ví dụ rút gọn AuditData của một inbox rule đáng ngờ:

```json
{
  "CreationTime": "2026-10-03T08:15:42",
  "Operation": "New-InboxRule",
  "Workload": "Exchange",
  "ResultStatus": "True",
  "UserId": "alice@contoso.com",
  "ClientIP": "203.0.113.45",
  "Parameters": [
    {"Name": "DeleteMessage", "Value": "True"},
    {"Name": "SubjectContainsWords", "Value": "invoice;payment"}
  ]
}
```

Các điểm đáng ngờ ở ví dụ trên: rule tự xóa email, lọc theo từ khóa tài chính, và IP lạ. Đây là dấu hiệu điển hình của BEC nhằm che giấu phản hồi của nạn nhân.

### 5.2 Các operation đặc trưng theo workload

| Workload | Operation cần quan tâm | Ý nghĩa bảo mật |
| --- | --- | --- |
| Exchange | New-InboxRule, Set-InboxRule, Set-Mailbox (ForwardingSmtpAddress), Add-MailboxPermission, MailItemsAccessed, Send | Che giấu email, chuyển tiếp trái phép, truy cập hộp thư người khác |
| SharePoint/OneDrive | FileDownloaded, FileAccessed, FileSyncDownloadedFull, SharingSet, AnonymousLinkCreated | Đánh cắp dữ liệu, chia sẻ ra ngoài |
| Teams | MemberAdded, TeamsSessionStarted, chat/message events | Tiếp cận nội bộ, lan truyền phishing |
| Entra ID (trong UAL) | UserLoggedIn, UserLoginFailed, Add member to role | Đăng nhập và đổi đặc quyền |

### 5.3 Cấu trúc Entra ID Sign-in logs

Đây là nguồn giàu ngữ cảnh nhất để đánh giá đăng nhập:

| Trường | Ý nghĩa |
| --- | --- |
| UserPrincipalName, UserId | Định danh tài khoản |
| IPAddress, Location, NetworkLocationDetails | Nguồn đăng nhập và vị trí |
| AppDisplayName, AppId, ResourceDisplayName | Ứng dụng client và tài nguyên được truy cập |
| ClientAppUsed | Giao thức: Browser, Mobile Apps and Desktop clients, IMAP4, POP3, SMTP, Exchange ActiveSync... (legacy protocol thường bỏ qua MFA) |
| ResultType, ResultDescription | Mã kết quả (0 là thành công) |
| ConditionalAccessStatus, ConditionalAccessPolicies | Policy nào được áp dụng hoặc bị bypass |
| AuthenticationRequirement, AuthenticationDetails | Single-factor hay multi-factor, phương thức xác thực |
| RiskLevelDuringSignIn, RiskState, RiskEventTypes | Đánh giá rủi ro của Entra ID Protection |
| DeviceDetail | Hệ điều hành, trình duyệt, trạng thái compliant hoặc joined |
| CorrelationId, SessionId, UniqueTokenIdentifier | Liên kết các sự kiện trong cùng phiên hoặc token |

Các mã lỗi (ResultType) thường gặp:

| Mã | Ý nghĩa | Gợi ý phân tích |
| --- | --- | --- |
| 0 | Thành công | Xem các trường khác để đánh giá có hợp lệ không |
| 50126 | Sai mật khẩu | Brute force hoặc password spray khi xuất hiện hàng loạt |
| 50034 | Tài khoản không tồn tại | Dò quét tài khoản (enumeration) |
| 50053 | Tài khoản bị khóa | Hậu quả của brute force |
| 50057 | Tài khoản bị vô hiệu hóa | Kẻ tấn công dùng danh sách cũ |
| 50074, 50076 | Yêu cầu MFA | Nhiều lần liên tiếp có thể là MFA fatigue |
| 500121 | Xác thực MFA thất bại | Người dùng từ chối hoặc không phản hồi push |
| 53003 | Bị Conditional Access chặn | Policy phát huy tác dụng, ghi nhận nguồn bị chặn |

### 5.4 Cấu trúc Entra ID Audit logs

Các trường chính gồm OperationName, Category, Result, InitiatedBy (user hoặc app), TargetResources (đối tượng bị thay đổi, kèm modifiedProperties cũ và mới) và CorrelationId. Các OperationName quan trọng:

- **Add member to role, Add eligible member to role:** cấp đặc quyền.
- **Consent to application, Add app role assignment grant to user:** đồng ý cấp quyền cho ứng dụng (OAuth).
- **Add service principal credentials, Update application - Certificates and secrets management:** thêm bí mật cho ứng dụng để duy trì truy cập.
- **User registered security info, Reset password (by admin):** thay đổi phương thức xác thực hoặc mật khẩu.
- **Update conditional access policy, Delete conditional access policy:** làm suy yếu hàng rào bảo vệ.

---

## 6. Tương quan các nguồn log để detection

Một sự kiện đơn lẻ hiếm khi đủ để kết luận có tấn công. Sức mạnh của SOC nằm ở việc nối các mảnh rời rạc thành một chuỗi hành vi.

### 6.1 Các khóa tương quan

- **Định danh người dùng**: UserPrincipalName trong SigninLogs, UserId trong OfficeActivity, InitiatedBy trong AuditLogs. Chuẩn hóa về chữ thường trước khi join.
- **IP nguồn**: IPAddress (Sign-in), ClientIP (UAL). IP giống nhau giữa đăng nhập và hành động sau đó là bằng chứng mạnh.
- **Phiên và token**: CorrelationId, SessionId, UniqueTokenIdentifier giúp nối sự kiện trong cùng một phiên, kể cả khi IP thay đổi.
- **Ứng dụng**: AppId hoặc AppDisplayName để nối sign-in với consent và hoạt động của app.
- **Cửa sổ thời gian**: thường 15 phút đến 24 giờ tùy kịch bản, cộng thêm độ trễ đưa log về SIEM.

### 6.2 Ma trận tương quan theo kịch bản

| Kịch bản | Nguồn 1 | Nguồn 2 | Nguồn 3 | Khóa nối |
| --- | --- | --- | --- | --- |
| Password spray rồi chiếm tài khoản | Sign-in: nhiều 50126 từ một IP | Sign-in: đăng nhập thành công cùng IP | UAL: hành động sau đăng nhập | IP, UPN |
| MFA fatigue | Sign-in: chuỗi 500121 hoặc 50074 | Sign-in: thành công sau chuỗi | Audit: User registered security info | UPN |
| BEC (Business Email Compromise) | Sign-in: rủi ro cao hoặc IP lạ | UAL Exchange: New-InboxRule, Set-Mailbox forward | EmailEvents: email gửi ra bất thường | UPN, IP |
| AiTM và đánh cắp token | Email: link phishing | Sign-in: MFA đạt nhưng IP và thiết bị lạ | Non-interactive sign-in: dùng token | UPN, SessionId |
| OAuth consent phishing | Email: URL độc hại | Audit: Consent to application | Cloud app: truy cập dữ liệu bằng app | AppId, UPN |
| Rò rỉ dữ liệu | Sign-in bất thường | UAL: FileDownloaded hàng loạt | UAL: SharingSet, AnonymousLinkCreated | UPN, IP |
| Leo thang đặc quyền | Sign-in bất thường | Audit: Add member to role | Audit: Update conditional access policy | Actor UPN |

### 6.3 Use case và truy vấn KQL mẫu (Microsoft Sentinel)

Các truy vấn dưới đây là khung tham khảo. Cần tinh chỉnh ngưỡng theo quy mô và **baseline** của tổ chức (xem mục 4).

**Use case 1: Password spray rồi đăng nhập thành công**

```kql
let spray = SigninLogs
| where TimeGenerated > ago(1d)
| where ResultType == '50126'
| summarize Fails=count(), Users=dcount(UserPrincipalName) by IPAddress
| where Users > 10;
SigninLogs
| where TimeGenerated > ago(1d)
| where ResultType == '0'
| join kind=inner spray on IPAddress
| project TimeGenerated, UserPrincipalName, IPAddress, AppDisplayName, ClientAppUsed, Fails, Users
```

**Use case 2: MFA fatigue (nhiều yêu cầu MFA rồi thành công)**

```kql
let fatigue = SigninLogs
| where TimeGenerated > ago(1h)
| where ResultType in ('500121','50074','50076')
| summarize MfaEvents=count(), LastFail=max(TimeGenerated) by UserPrincipalName
| where MfaEvents >= 5;
SigninLogs
| where TimeGenerated > ago(1h)
| where ResultType == '0'
| join kind=inner fatigue on UserPrincipalName
| where TimeGenerated > LastFail
| project TimeGenerated, UserPrincipalName, IPAddress, AppDisplayName, MfaEvents
```

**Use case 3: Sign-in rủi ro rồi tạo inbox rule (dấu hiệu BEC)**

```kql
let risky = SigninLogs
| where TimeGenerated > ago(1d)
| where RiskLevelDuringSignIn in ('medium','high') or RiskState == 'atRisk'
| project UserPrincipalName, SigninTime=TimeGenerated, SigninIP=IPAddress;
OfficeActivity
| where TimeGenerated > ago(1d)
| where Operation in ('New-InboxRule','Set-InboxRule','UpdateInboxRules')
| join kind=inner risky on $left.UserId == $right.UserPrincipalName
| where TimeGenerated between (SigninTime .. (SigninTime + 2h))
| project TimeGenerated, UserId, Operation, ClientIP, SigninIP, Parameters
```

**Use case 4: OAuth consent đáng ngờ**

```kql
AuditLogs
| where TimeGenerated > ago(1d)
| where OperationName == 'Consent to application'
| extend Actor = tostring(InitiatedBy.user.userPrincipalName), ActorIP = tostring(InitiatedBy.user.ipAddress), App = tostring(TargetResources[0].displayName)
| project TimeGenerated, Actor, ActorIP, App, Result, CorrelationId
```

Sau đó đối chiếu App với danh sách ứng dụng được phép, và xem quyền (scope) mà app xin có quá rộng (Mail.Read, Files.ReadWrite.All, offline\_access...) hay không.

**Use case 5: Tải file hàng loạt từ SharePoint/OneDrive**

```kql
// So sánh với baseline P95 từ mục 4.4
let Baseline = OfficeActivity
| where TimeGenerated between (ago(30d) .. ago(1d))
| where OfficeWorkload in ('SharePoint','OneDrive')
| where Operation in ('FileDownloaded','FileSyncDownloadedFull')
| summarize DailyFiles=count() by UserId, bin(TimeGenerated, 1d)
| summarize P95=percentile(DailyFiles, 95) by UserId;
OfficeActivity
| where TimeGenerated > ago(1d)
| where OfficeWorkload in ('SharePoint','OneDrive')
| where Operation in ('FileDownloaded','FileSyncDownloadedFull')
| summarize Files=count(), Sites=dcount(Site_Url) by UserId, ClientIP, bin(TimeGenerated, 1h)
| join kind=leftouter Baseline on UserId
| where Files > coalesce(P95, 100)
| project TimeGenerated, UserId, ClientIP, Files, Sites, P95Baseline=P95
```

**Use case 6: Thêm vào role đặc quyền sau đăng nhập rủi ro**

```kql
let risky = SigninLogs
| where TimeGenerated > ago(1d)
| where RiskLevelDuringSignIn in ('medium','high')
| project UserPrincipalName, SigninTime=TimeGenerated;
AuditLogs
| where TimeGenerated > ago(1d)
| where OperationName in ('Add member to role','Add eligible member to role')
| extend Actor = tostring(InitiatedBy.user.userPrincipalName), Target = tostring(TargetResources[0].displayName)
| join kind=inner risky on $left.Actor == $right.UserPrincipalName
| where TimeGenerated > SigninTime
| project TimeGenerated, Actor, Target, OperationName, SigninTime
```

---

## 7. Quy trình điều tra khi có cảnh báo tài khoản bị chiếm

1. **Xác định tài khoản và thời điểm nghi ngờ**: lấy UPN, IP, thời gian từ alert.
2. **Xem Sign-in logs của user** trong ít nhất 7 ngày: IP, quốc gia, AppDisplayName, ClientAppUsed, kết quả MFA, Conditional Access, thiết bị. Tìm đăng nhập đầu tiên bất thường (initial access).
3. **Kiểm tra non-interactive sign-in** để phát hiện dùng lại token.
4. **Xem Audit logs**: user có đăng ký phương thức MFA mới, đổi mật khẩu, consent ứng dụng, thêm credential cho app không.
5. **Xem UAL theo UPN và IP kẻ tấn công**: inbox rule, forward, MailItemsAccessed, FileDownloaded, SharingSet.
6. **Xem email**: email phishing ban đầu (EmailEvents, UrlClickEvents), email gửi ra từ tài khoản này, người nhận khác bị ảnh hưởng.
7. **Mở rộng phạm vi**: tìm các tài khoản khác truy cập từ cùng IP, cùng app, nhận cùng email phishing.
8. **Ứng phó**: revoke session và token, reset mật khẩu, xoá phương thức MFA lạ, gỡ inbox rule và forward, gỡ consent độc hại, chặn IP, thu hồi quyền đã bị thêm.
9. **Ghi nhận và cải thiện**: lập timeline, viết lại hoặc bổ sung detection cho điểm bị bỏ sót.

---

## 8. Lưu ý vận hành và tuning

- **Độ trễ ingest**: UAL và một số nguồn có thể trễ từ vài phút đến vài giờ. Dùng cửa sổ truy vấn gối đầu và so sánh theo TimeGenerated và thời gian sự kiện gốc.
- **False positive thường gặp**: VPN và proxy gây impossible travel, IP của văn phòng chung, service account, phần mềm đồng bộ file tạo lượng FileSyncDownloadedFull lớn. Nên có watchlist cho IP tin cậy và tài khoản dịch vụ.
- **Legacy authentication**: lọc ClientAppUsed ngoài Browser và Mobile/Desktop clients. Nên chặn legacy auth bằng Conditional Access và giám sát các lần bị chặn.
- **Tài khoản giá trị cao**: đặt ngưỡng thấp hơn cho admin, lãnh đạo, tài chính.
- **Baseline**: so sánh với hành vi bình thường của chính user (quốc gia, giờ làm việc, app thường dùng) thay vì chỉ đặt ngưỡng cố định. Xem chi tiết cách xây baseline tại mục 4.
- **Ánh xạ MITRE ATT&CK**: Valid Accounts (T1078), Brute Force: Password Spraying (T1110.003), MFA Request Generation (T1621), Email Hiding Rules (T1564.008), Email Forwarding Rule (T1114.003), Steal Application Access Token (T1528), Account Manipulation (T1098).

---

## 9. Gợi ý luyện tập và tài liệu tham khảo

- Tự đặt câu hỏi cho từng log trong lab: Đây là ai, từ đâu, dùng ứng dụng nào, có qua MFA không, sau đó làm gì — rồi đối chiếu với baseline đã biết của tổ chức.
- Thử viết lại 6 use case ở mục 6 sang SPL (Splunk) hoặc ES|QL/KQL của Elastic nếu SIEM bạn dùng không phải Sentinel.
- Tạo tenant dev M365 (nếu có thể) để tự tạo inbox rule, consent app, đăng nhập sai mật khẩu và quan sát log xuất hiện ở đâu, sau bao lâu.
- Tài liệu tham khảo: Microsoft Learn (Microsoft Purview Audit, Entra ID monitoring and health, Office 365 Management Activity API reference, Microsoft Sentinel data connectors), và MITRE ATT&CK cho Cloud/Office 365.

---

## 10. Phụ lục: Triển khai trên Splunk (SPL)

Phần này liệt kê các Add-on (TA) để thu thập và parse log M365 vào Splunk, rồi chuyển 6 use case ở mục 6 từ KQL sang SPL. Tên index (o365, azure) trong các truy vấn chỉ là ví dụ, hãy thay bằng index thực tế của bạn.

### 10.1 Các Add-on cần cài

| Add-on | Thu thập | Sourcetype | Link |
| --- | --- | --- | --- |
| Splunk Add-on for Microsoft Office 365 | Unified Audit Log qua Office 365 Management Activity API (AzureActiveDirectory, Exchange, SharePoint, OneDrive, DLP), cùng service status | o365:management:activity | https://splunkbase.splunk.com/app/4055 |
| Splunk Add-on for Microsoft Cloud Services | Entra ID diagnostic logs (SignInLogs, AuditLogs, UserRiskEvents, RiskyUsers...) đẩy qua Event Hub | azure:monitor:aad (một số cấu hình dùng thêm mscs:azure:eventhub) | https://splunkbase.splunk.com/app/3110 |
| Microsoft Azure Active Directory Reporting Add-on for Splunk | Sign-in và audit qua Microsoft Graph, là hướng thay thế nếu chưa dùng Event Hub (add-on của bên thứ ba, kiểm tra tình trạng bảo trì trước khi dùng) | Tùy phiên bản add-on | https://splunkbase.splunk.com/app/3757 |
| Splunk Common Information Model (CIM) | Chuẩn hóa field cho data model (Authentication, Change...) | Không áp dụng | https://splunkbase.splunk.com/app/1621 |
| Entra ID and Microsoft 365 Insights App | Dashboard dựng sẵn cho o365:management:activity và azure:monitor:aad (app của tác giả bên thứ ba) | Không áp dụng | https://splunkbase.splunk.com/app/9319 |

Detection dựng sẵn của Splunk cho các nguồn này: https://research.splunk.com và https://github.com/splunk/security\_content. Các detection ở đó dùng macro o365\_management\_activity và azure\_monitor\_aad, rất tiện để đối chiếu cách viết truy vấn.

Lưu ý: các bảng của Defender XDR (EmailEvents, UrlClickEvents, CloudAppEvents...) không nằm trong phạm vi hai add-on chính ở trên. Nếu muốn tương quan với email hoặc endpoint, cần thêm đường thu thập riêng cho Defender.

### 10.2 Cấu hình thu thập

**Office 365 (UAL):**

- Tạo App registration trong Entra ID, cấp quyền Application trên Office 365 Management APIs (ActivityFeed.Read, thêm ServiceHealth.Read nếu cần lấy service status), rồi admin consent.
- Trong add-on, thêm Tenant (tenant ID, client ID, client secret), tạo input Management Activity cho từng content type: Audit.AzureActiveDirectory, Audit.Exchange, Audit.SharePoint, Audit.General, DLP.All.
- Gán sourcetype o365:management:activity và index riêng (ví dụ o365).
- Microsoft có thể sinh sự kiện trùng lặp. Khi truy vấn, thêm dedup theo trường Id của bản ghi để tránh đếm trùng.

**Entra ID (Sign-in và Audit):**

- Entra admin center: Diagnostic Settings, chọn các category ở mục 2.4, gửi tới một Event Hub.
- Trong Splunk Add-on for Microsoft Cloud Services, cấu hình Azure App Account (service principal có quyền đọc Event Hub), rồi tạo input Azure Event Hub.
- Gán sourcetype azure:monitor:aad và index riêng (ví dụ azure).

### 10.3 Ánh xạ bảng Sentinel sang Splunk

| Sentinel | Splunk |
| --- | --- |
| SigninLogs | sourcetype=azure:monitor:aad category=SignInLogs |
| AADNonInteractiveUserSignInLogs | azure:monitor:aad category=NonInteractiveUserSignInLogs |
| AADServicePrincipalSignInLogs | azure:monitor:aad category=ServicePrincipalSignInLogs |
| AuditLogs | azure:monitor:aad category=AuditLogs |
| AADUserRiskEvents, AADRiskyUsers | azure:monitor:aad category=UserRiskEvents, RiskyUsers |
| OfficeActivity | sourcetype=o365:management:activity (lọc theo Workload và Operation) |

### 10.4 Lưu ý về field khi viết SPL

- **o365:management:activity**: các field của AuditData thường được trích trực tiếp (Workload, Operation, UserId, ClientIP, ResultStatus, ObjectId, SiteUrl...). Với workload AzureActiveDirectory, nhiều Operation kết thúc bằng dấu chấm (ví dụ Add member to role.), còn workload Exchange thì không. Kiểm tra bằng truy vấn stats count by Operation trước khi đặt điều kiện, hoặc dùng wildcard.
- **azure:monitor:aad**: dữ liệu là JSON lồng nhau, field có dạng properties.userPrincipalName, properties.ipAddress, properties.appDisplayName... Tên operationName ở nguồn này thường không có dấu chấm cuối (ví dụ Add service principal). Trong eval phải bọc tên field có dấu chấm bằng dấu nháy đơn, ví dụ eval user=lower('properties.userPrincipalName').
- **Chuẩn hóa**: nên eval ra các field chung (user, src\_ip) ở đầu truy vấn để join hai nguồn dễ hơn.
- **Xác nhận field thực tế**: tên field có thể khác tùy cấu hình input và phiên bản add-on. Chạy fieldsummary trên một mẫu dữ liệu để đối chiếu trước khi đưa truy vấn vào alert.
- **Độ trễ ingest**: nếu dùng cửa sổ thời gian ngắn, cân nhắc dùng \_indextime thay cho \_time hoặc cho cửa sổ lùi lại để không bỏ sót sự kiện đến muộn.

### 10.5 SPL cho 6 use case

**Use case 1: Password spray rồi đăng nhập thành công**

```spl
index=azure sourcetype="azure:monitor:aad" category=SignInLogs earliest=-1d
| eval user=lower('properties.userPrincipalName'), src_ip='properties.ipAddress'
| eval fail_user=if(resultType="50126", user, null()), ok_user=if(resultType="0", user, null())
| stats count(fail_user) as fails dc(fail_user) as failed_users values(ok_user) as success_users by src_ip
| where failed_users>10 AND isnotnull(success_users)
```

**Use case 2: MFA fatigue**

```spl
index=azure sourcetype="azure:monitor:aad" category=SignInLogs earliest=-1h
| eval user=lower('properties.userPrincipalName'), src_ip='properties.ipAddress'
| eval mfa_time=if(in(resultType,"500121","50074","50076"), _time, null()), ok_time=if(resultType="0", _time, null())
| stats count(mfa_time) as mfa_events max(mfa_time) as last_mfa max(ok_time) as last_success values(src_ip) as src_ips by user
| where mfa_events>=5 AND last_success>last_mfa
| convert ctime(last_mfa) ctime(last_success)
```

**Use case 3: Sign-in rủi ro rồi tạo inbox rule (BEC)**

```spl
(index=azure sourcetype="azure:monitor:aad" category=SignInLogs (properties.riskLevelDuringSignIn=medium OR properties.riskLevelDuringSignIn=high))
OR (index=o365 sourcetype="o365:management:activity" Workload=Exchange (Operation="New-InboxRule" OR Operation="Set-InboxRule" OR Operation="UpdateInboxRules"))
| eval user=lower(coalesce('properties.userPrincipalName', UserId)), src_ip=coalesce('properties.ipAddress', ClientIP)
| eval risky_time=if(sourcetype="azure:monitor:aad", _time, null()), rule_time=if(sourcetype="o365:management:activity", _time, null()), rule_op=if(sourcetype="o365:management:activity", Operation, null())
| stats min(risky_time) as first_risky min(rule_time) as first_rule values(rule_op) as rule_ops values(src_ip) as ips by user
| where isnotnull(first_risky) AND isnotnull(first_rule) AND first_rule>=first_risky AND first_rule<=first_risky+7200
| convert ctime(first_risky) ctime(first_rule)
```

**Use case 4: OAuth consent đáng ngờ**

Từ UAL:

```spl
index=o365 sourcetype="o365:management:activity" Workload=AzureActiveDirectory Operation="Consent to application*" earliest=-1d
| dedup Id
| table _time UserId ClientIP ObjectId ResultStatus
```

Từ Entra Audit logs:

```spl
index=azure sourcetype="azure:monitor:aad" category=AuditLogs operationName="Consent to application" earliest=-1d
| eval actor='properties.initiatedBy.user.userPrincipalName', actor_ip='properties.initiatedBy.user.ipAddress', app=mvindex('properties.targetResources{}.displayName',0)
| table _time actor actor_ip app properties.result
```

**Use case 5: Tải file hàng loạt từ SharePoint/OneDrive (so với baseline)**

```spl
| tstats count as today_files
    where index=o365 sourcetype="o365:management:activity"
    (Operation=FileDownloaded OR Operation=FileSyncDownloadedFull)
    (Workload=SharePoint OR Workload=OneDrive)
    earliest=-1d
    by UserId ClientIP
| join type=left UserId
    [| tstats avg(count) as avg_files stdev(count) as std_files
        where index=o365 sourcetype="o365:management:activity"
        (Operation=FileDownloaded OR Operation=FileSyncDownloadedFull)
        (Workload=SharePoint OR Workload=OneDrive)
        earliest=-30d latest=-1d
        by UserId span=1d
     | stats avg(avg_files) as baseline_avg stdev(avg_files) as baseline_std by UserId]
| eval threshold=baseline_avg + (2 * coalesce(baseline_std, 50))
| where today_files > coalesce(threshold, 100)
| table UserId ClientIP today_files baseline_avg threshold
```

**Use case 6: Thêm vào role đặc quyền sau đăng nhập rủi ro**

```spl
index=azure sourcetype="azure:monitor:aad" earliest=-1d
((category=SignInLogs (properties.riskLevelDuringSignIn=medium OR properties.riskLevelDuringSignIn=high))
OR (category=AuditLogs (operationName="Add member to role" OR operationName="Add eligible member to role")))
| eval actor=lower(coalesce('properties.userPrincipalName', 'properties.initiatedBy.user.userPrincipalName'))
| eval risky_time=if(category="SignInLogs", _time, null()), role_time=if(category="AuditLogs", _time, null()), role_op=if(category="AuditLogs", operationName, null())
| stats min(risky_time) as first_risky min(role_time) as first_role_add values(role_op) as role_ops by actor
| where isnotnull(first_risky) AND isnotnull(first_role_add) AND first_role_add>first_risky
| convert ctime(first_risky) ctime(first_role_add)
```

Khi chuyển thành alert (saved search), nên lập lịch chạy mỗi 15 phút đến 1 giờ tùy use case, cộng thêm bước lọc watchlist cho IP tin cậy và service account như đã nói ở mục 8.
