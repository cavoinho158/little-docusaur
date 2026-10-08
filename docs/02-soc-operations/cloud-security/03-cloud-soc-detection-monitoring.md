---
id: cloud-soc-detection-monitoring
title: AWS Cloud SOC — Detection Engineering, Log Analysis & Incident Response
sidebar_label: 3. Giám sát & Ứng phó Sự cố
sidebar_position: 3
description: Cẩm nang toàn diện về giám sát an ninh AWS — Kiến trúc Multi-Account Log Vault, giải phẫu CloudTrail & VPC Flow Logs, Threat Detection với GuardDuty, 10 Use Cases với bộ câu lệnh SPL/KQL/Athena và Runbook ứng phó sự cố thực chiến.
---

# AWS Cloud SOC — Detection Engineering, Log Analysis & Incident Response

> Hướng dẫn toàn diện và thực chiến dành cho SOC Analyst và Detection Engineer trong việc xây dựng hệ thống giám sát an ninh, phát hiện mối đe dọa và ứng phó sự cố (Incident Response) trên môi trường Amazon Web Services (AWS).

---

## 1. Kiến trúc Giám sát An ninh Cloud Tổng thể (Cloud SOC Architecture)

Trong các tổ chức quy mô doanh nghiệp, hạ tầng AWS thường bao gồm hàng chục hoặc hàng trăm tài khoản (AWS Accounts) độc lập thuộc cùng một **AWS Organization**. Mô hình lưu trữ log phân tán tại từng tài khoản đơn lẻ là một "tử huyệt" an ninh, vì nếu kẻ tấn công chiếm được quyền quản trị tại tài khoản đó, chúng có thể xóa sạch dấu vết.

Chuẩn mực kiến trúc doanh nghiệp đòi hỏi phải thiết lập một **Dedicated Centralized Log Archive Account** (Tài khoản lưu trữ nhật ký tập trung độc lập):

```
┌───────────────────────────┐    ┌───────────────────────────┐
│     MEMBER ACCOUNT 1      │    │     MEMBER ACCOUNT 2      │
│  (Workloads / Production) │    │      (Dev / Staging)      │
│   ┌───────────────────┐   │    │   ┌───────────────────┐   │
│   │ OrganizationTrail │   │    │   │ OrganizationTrail │   │
│   │   VPC Flow Logs   │   │    │   │   VPC Flow Logs   │   │
│   └─────────┬─────────┘   │    │   └─────────┬─────────┘   │
└─────────────┼─────────────┘    └─────────────┼─────────────┘
              │ (Cross-Account Push)           │
              ▼                                ▼
┌────────────────────────────────────────────────────────────┐
│          CENTRAL LOG ARCHIVE ACCOUNT (Bất khả xâm phạm)    │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ S3 Central Log Bucket                                │  │
│  │  - Khóa bằng S3 Object Lock (WORM: Write Once)       │  │
│  │  - Mã hóa bằng KMS CMK độc lập                       │  │
│  │  - SCP cấm mọi hành động DeleteObject / DeleteBucket │  │
│  └──────────────────────────┬───────────────────────────┘  │
└─────────────────────────────┼──────────────────────────────┘
                              │
               ┌──────────────┴──────────────┐
               ▼                             ▼
    ┌──────────────────────┐      ┌──────────────────────┐
    │ SIEM / Data Platform │      │    AWS Athena /      │
    │  (Splunk / Sentinel) │      │  CloudWatch Insights │
    │    Realtime Alert    │      │  Deep Hunting & IR   │
    └──────────────────────┘      └──────────────────────┘
```

### Các nguyên tắc cốt tử bảo vệ Log Vault:
1. **Kiến trúc Write-Once-Read-Many (WORM):** Bật tính năng **S3 Object Lock** ở chế độ `Compliance Mode`. Ngay cả tài khoản Root của tài khoản lưu trữ log cũng không thể sửa đổi hoặc xóa bất kỳ file log nào trước khi hết thời hạn retention quy định (ví dụ: 365 ngày).
2. **KMS Customer Managed Key (CMK) độc lập:** Khóa mã hóa log được lưu tại Security Account với Key Policy nghiêm ngặt: chỉ cho phép các Member Accounts quyền `kms:GenerateDataKey*` để mã hóa và ghi log, cấm tuyệt đối quyền giải mã đối với các tài khoản nghiệp vụ thông thường.
3. **Service Control Policy (SCP) bảo vệ Logging:** Gắn SCP từ tổ chức cấm mọi thao tác `cloudtrail:StopLogging`, `cloudtrail:DeleteTrail`, `cloudtrail:UpdateTrail`, và `s3:DeleteBucket*` trên toàn bộ các tài khoản con.

---

## 2. Giải phẫu Chuyên sâu AWS CloudTrail Logs (CloudTrail Forensics)

CloudTrail là nguồn dữ liệu điều tra số (Digital Forensics) quan trọng nhất trên AWS, ghi nhận chi tiết **mọi lời gọi API từ Control Plane và Data Plane**.

### 2.1 Phân biệt 3 loại sự kiện trong CloudTrail

- **Management Events (Control Plane):** Ghi nhận các thao tác quản trị trên tài nguyên (ví dụ: tạo máy ảo `RunInstances`, chỉnh sửa Security Group `AuthorizeSecurityGroupIngress`, tạo IAM User `CreateUser`). Mặc định được ghi nhận miễn phí cho 90 ngày gần nhất trong *Event History*.
- **Data Events (Data Plane):** Ghi nhận các thao tác trực tiếp trên dữ liệu nằm bên trong tài nguyên (ví dụ: đọc tệp trên S3 `GetObject`, thực thi hàm `lambda:InvokeFunction`). **Không được bật mặc định** do lượng log sinh ra khổng lồ và chi phí lưu trữ cao. SOC cần tư vấn cho doanh nghiệp bật có chọn lọc trên các S3 bucket chứa dữ liệu nhạy cảm nhất.
- **CloudTrail Insights:** Sử dụng thuật toán Machine Learning để tự động phát hiện các đột biến bất thường về tần suất gọi API (ví dụ: số lượng API ghi tăng đột biến gấp 10 lần so với baseline ngày thường).

---

### 2.2 Giải phẫu chi tiết JSON Schema của một CloudTrail Event

Khi tiến hành điều tra sự cố (Incident Triage), SOC Analyst cần nhanh chóng bóc tách và liên kết các trường thông tin trọng yếu:

```json
{
  "eventVersion": "1.08",
  "userIdentity": {
    "type": "AssumedRole",
    "principalId": "AROA123456789EXAMPLE:ec2-prod-session",
    "arn": "arn:aws:sts::111122223333:assumed-role/EC2AppRole/i-0abcdef1234567890",
    "accountId": "111122223333",
    "accessKeyId": "ASIAVEXAMPLE12345678",
    "sessionContext": {
      "sessionIssuer": {
        "type": "Role",
        "principalId": "AROA123456789EXAMPLE",
        "arn": "arn:aws:iam::111122223333:role/EC2AppRole",
        "accountId": "111122223333",
        "userName": "EC2AppRole"
      },
      "attributes": {
        "creationDate": "2026-10-08T01:15:30Z",
        "mfaAuthenticated": "false"
      }
    }
  },
  "eventTime": "2026-10-08T02:45:12Z",
  "eventSource": "s3.amazonaws.com",
  "eventName": "PutBucketPolicy",
  "awsRegion": "ap-southeast-1",
  "sourceIPAddress": "198.51.100.45",
  "userAgent": "aws-cli/2.13.5 Python/3.11.4 Linux/5.15.0",
  "requestParameters": {
    "bucketName": "corporate-financial-records",
    "bucketPolicy": "{\"Version\":\"2012-10-17\",\"Statement\":[{\"Effect\":\"Allow\",\"Principal\":\"*\",\"Action\":\"s3:GetObject\",\"Resource\":\"arn:aws:s3:::corporate-financial-records/*\"}]}"
  },
  "responseElements": null,
  "requestID": "4E1EXAMPLE987654",
  "eventID": "8f123456-789a-bcde-f012-3456789abcde",
  "readOnly": false,
  "eventType": "AwsApiCall",
  "managementEvent": true,
  "recipientAccountId": "111122223333",
  "errorCode": null
}
```

### Các trường trọng tâm cần soi xét đầu tiên trong quá trình Triage:

1. **`userIdentity.type` & `arn`:** Xác định danh tính thực tế.
   - `Root`: Báo động đỏ ngay lập tức.
   - `IAMUser`: Người dùng thông thường hoặc service account dùng Access Key tĩnh (`AKIA...`).
   - `AssumedRole`: Danh tính mượn quyền tạm thời (`ASIA...`). Cần kiểm tra `sessionIssuer` để biết ai là người cấp quyền gốc, và `principalId` để xác định instance ID hoặc session name.
2. **`sourceIPAddress`:** Địa chỉ IP gửi yêu cầu.
   - Nếu là địa chỉ IP bên ngoài (Internet IP) nhưng `userIdentity` lại là Role của EC2 (`i-0abcdef...`), đây là bằng chứng thép của việc **Credentials bị đánh cắp qua SSRF và đang bị dùng trái phép từ bên ngoài**!
3. **`userAgent`:** Dấu hiệu công cụ của kẻ tấn công.
   - Tên công cụ như `Kali`, `Pacu`, `ScoutSuite`, `CloudFox`, `botocore`, `python-requests` xuất hiện ở các sự kiện nhạy cảm là tín hiệu nhận diện tấn công cực mạnh.
4. **`errorCode` & `errorMessage`:**
   - Nếu xuất hiện chuỗi lỗi `AccessDenied` hoặc `Client.UnauthorizedOperation` liên tiếp từ cùng một IP/User, đó là dấu hiệu của hành vi **Reconnaissance & Privilege Enumeration** (kẻ tấn công đang chạy script dò quét xem key này làm được những gì).

---

## 3. Các Nguồn Log Bổ trợ Quan trọng khác

### 3.1 Amazon VPC Flow Logs — Dấu vết Tầng Mạng

VPC Flow Logs ghi lại metadata của toàn bộ các gói tin IP đi vào và đi ra khỏi các giao diện mạng ảo (ENI) trong VPC.

**Schema Version 2 chuẩn:**
```
<version> <account-id> <interface-id> <srcaddr> <dstaddr> <srcport> <dstport> <protocol> <packets> <bytes> <start> <end> <action> <log-status>
```
*Ví dụ:*
```
2 111122223333 eni-0123456789abcdef0 203.0.113.10 10.0.1.50 49152 22 6 25 1250 1728345600 1728345660 ACCEPT OK
```

### Ứng dụng điều tra cho SOC:
- **Phát hiện Dò quét Mạng Nội bộ (Internal Port Scanning):** Một IP nội bộ liên tục gửi gói tin tới nhiều IP khác nhau trong cùng subnet trên các cổng 445, 135, 3389, 22.
- **Phát hiện C2 Beaconing:** Một máy chủ định kỳ gửi kết nối ra cùng một IP lạ bên ngoài Internet theo khoảng thời gian cố định (ví dụ mỗi 60 giây).
- **Phát hiện Rò rỉ Dữ liệu Tầng Mạng (Network Data Exfiltration):** Trường `bytes` đột biến lên hàng Gigabyte hướng ra một IP ngoại lục địa trong một khung giờ đêm.

---

### 3.2 Route 53 Resolver Query Logs — Giám sát DNS

Ghi nhận toàn bộ các truy vấn DNS xuất phát từ các máy ảo EC2 bên trong VPC:
- **Phát hiện DNS Tunneling:** Các truy vấn tới domain có subdomain dài bất thường chứa chuỗi mã hóa Base64/Hex (ví dụ: `dGhpcy1pcy1zZWNyZXQtZGF0YQo=.attacker-c2.com`).
- **Phát hiện DGA (Domain Generation Algorithms):** Máy tính bị nhiễm mã độc sinh ra hàng loạt truy vấn DNS vô nghĩa (`asdfg1234zx.biz`, `qwerty987po.info`) để tìm máy chủ điều khiển C2.

---

## 4. Các Dịch vụ Phát hiện Mối đe dọa Managed (Threat Detection)

### 4.1 Amazon GuardDuty — Trung tâm Trí tuệ Nhân tạo Phát hiện Đe dọa

Amazon GuardDuty là dịch vụ phát hiện mối đe dọa độc lập được quản lý hoàn toàn bởi AWS. Điểm ưu việt tuyệt đối của GuardDuty là **hoạt động hoàn toàn ngầm ở tầng hạ tầng của AWS**:
- Không cần cài đặt bất kỳ agent nào lên máy chủ.
- Tự động phân tích luồng dữ liệu khổng lồ từ: CloudTrail Management Events, CloudTrail S3 Data Events, VPC Flow Logs, DNS Query Logs, EKS Audit Logs, RDS Login Activity, và Lambda Execution Logs.
- Ứng dụng các mô hình Machine Learning, phát hiện bất thường hành vi (Anomaly Detection), và tích hợp các nguồn Threat Intelligence hàng đầu thế giới (AWS Security, CrowdStrike, Proofpoint).

```
   ┌────────────────────────────────────────────────────────┐
   │                  CÁC NGUỒN DỮ LIỆU ĐẦU VÀO             │
   │  CloudTrail  │  VPC Flow  │  DNS Logs  │  S3 / EKS / DB│
   └──────────────────────────┬─────────────────────────────┘
                              │ (Phân tích ngầm, không tốn compute)
                              ▼
   ┌────────────────────────────────────────────────────────┐
   │                   AMAZON GUARDDUTY                     │
   │   - Machine Learning Anomaly Detection                 │
   │   - Threat Intelligence Matching (CrowdStrike / AWS)   │
   │   - Phân tích chuỗi hành vi người dùng                 │
   └──────────────────────────┬─────────────────────────────┘
                              │
                              ▼ (Findings định dạng JSON)
   ┌────────────────────────────────────────────────────────┐
   │             AMAZON EVENTBRIDGE / SECURITY HUB          │
   │     - Gửi Alert về SIEM (Splunk, Microsoft Sentinel)   │
   │     - Kích hoạt Lambda tự động ứng phó (SOAR)          │
   └────────────────────────────────────────────────────────┘
```

### Danh mục Findings cốt lõi mà SOC Tier 1/2 bắt buộc phải nắm:

| Tên GuardDuty Finding | Mức độ nghiêm trọng | Ý nghĩa hành vi tấn công |
|---|---|---|
| `UnauthorizedAccess:IAMUser/InstanceCredentialExfiltration.OutsideAWS` | **CRITICAL** (8.0–8.9) | Temporary credentials của EC2 Instance Profile bị kẻ tấn công trích xuất (thường qua SSRF) và **đang được sử dụng từ một địa chỉ IP nằm ngoài hạ tầng AWS**. |
| `Stealth:IAMUser/CloudTrailLoggingDisabled` | **HIGH** (7.0–8.9) | Một người dùng vừa thực hiện tắt hoặc xóa đường dẫn ghi log CloudTrail (`StopLogging`, `DeleteTrail`) nhằm che giấu hành vi. |
| `CryptoCurrency:EC2/BitcoinTool.B!DNS` | **HIGH** (7.0–8.9) | Máy chủ EC2 vừa thực hiện truy vấn DNS tới một Mining Pool chuyên đào tiền mã hóa Bitcoin/Monero. |
| `Trojan:EC2/DNSDataExfiltration` | **HIGH** (7.0–8.9) | Máy chủ EC2 đang thực hiện kỹ thuật truyền dữ liệu nhạy cảm ra ngoài thông qua giao thức DNS (DNS Tunneling). |
| `Policy:S3/BucketPublicAccessGranted` | **HIGH** (7.0–8.9) | Cấu hình S3 Block Public Access của bucket bị gỡ bỏ hoặc Bucket Policy bị sửa đổi sang trạng thái cho phép cả thế giới truy cập. |
| `PenTest:IAMUser/KaliLinux` | **MEDIUM** (4.0–6.9) | Một API call được thực hiện từ máy tính chạy hệ điều hành Kali Linux (nhận diện qua User-Agent signature). |
| `Discovery:IAMUser/AnomalousBehavior` | **LOW / MEDIUM** | Người dùng thực hiện các lệnh liệt kê danh sách tài nguyên (`List*`, `Describe*`) với tần suất và hành vi hoàn toàn khác biệt so với lịch sử thường ngày. |

---

## 5. Bộ 10 Use Case Detection Engineering Thực chiến

Dưới đây là bộ luật phát hiện cốt lõi dành cho Detection Engineer và SOC Analyst. Các truy vấn được cung cấp đồng thời bằng **SPL (Splunk)**, **KQL (Microsoft Sentinel)**, **SQL (Amazon Athena)** và **CloudWatch Logs Insights**.

---

### Use Case 1: Phát hiện Sử dụng Tài khoản Root (Root Account Usage)
- **Mô tả:** Tài khoản Root chỉ dùng khi thiết lập ban đầu. Bất kỳ hành vi đăng nhập Console hoặc gọi API nào từ Root đều là chỉ dấu bất thường hoặc vi phạm chính sách nghiêm trọng.
- **MITRE ATT&CK:** `T1078.004` (Valid Accounts: Cloud Accounts).
- **Mức độ ưu tiên:** **CRITICAL**.

#### Splunk (SPL):
```spl
index=aws sourcetype="aws:cloudtrail" userIdentity.type="Root"
| eval src_ip=coalesce(sourceIPAddress, "Unknown")
| stats count, values(eventName) as Actions, values(awsRegion) as Regions by _time, userIdentity.arn, src_ip, userAgent
| sort - _time
```

#### Microsoft Sentinel (KQL):
```kql
AWSCloudTrail
| where TimeGenerated > ago(24h)
| where UserIdentityType =~ "Root"
| project TimeGenerated, EventName, SourceIPAddress, UserAgent, AWSRegion, RequestParameters
| order by TimeGenerated desc
```

#### Amazon Athena (SQL):
```sql
SELECT eventtime, eventname, useridentity.arn, sourceipaddress, awsregion, useragent
FROM cloudtrail_logs
WHERE useridentity.type = 'Root'
  AND eventname != 'CreateServiceLinkedRole'
ORDER BY eventtime DESC
LIMIT 100;
```

---

### Use Case 2: Tắt hoặc Phá hoại Cơ chế Ghi Log (Defense Evasion)
- **Mô tả:** Kẻ tấn công tìm cách vô hiệu hóa CloudTrail hoặc xóa bộ dò quét GuardDuty để tránh bị phát hiện.
- **MITRE ATT&CK:** `T1562.008` (Impair Defenses: Disable Cloud Logs).
- **Mức độ ưu tiên:** **HIGH**.

#### Splunk (SPL):
```spl
index=aws sourcetype="aws:cloudtrail" 
eventName IN ("StopLogging", "DeleteTrail", "UpdateTrail", "DeleteDetector", "DisassociateFromMasterAccount")
| table _time, userIdentity.arn, eventSource, eventName, sourceIPAddress, awsRegion, errorCode
```

#### CloudWatch Logs Insights:
```
fields @timestamp, eventName, userIdentity.arn, sourceIPAddress, awsRegion
| filter eventName in ["StopLogging", "DeleteTrail", "UpdateTrail", "DeleteDetector"]
| sort @timestamp desc
| limit 50
```

---

### Use Case 3: Đăng nhập Console Thành công nhưng Không bật MFA
- **Mô tả:** Đăng nhập thành công vào giao diện web AWS Management Console mà không thông qua xác thực đa yếu tố.
- **MITRE ATT&CK:** `T1078.004` (Valid Accounts: Cloud Accounts).
- **Mức độ ưu tiên:** **HIGH**.

#### Splunk (SPL):
```spl
index=aws sourcetype="aws:cloudtrail" eventName="ConsoleLogin" 
responseElements.ConsoleLogin="Success" additionalEventData.MFAUsed="No"
| table _time, userIdentity.arn, sourceIPAddress, userAgent, additionalEventData.MFAUsed
```

#### Microsoft Sentinel (KQL):
```kql
AWSCloudTrail
| where TimeGenerated > ago(1d)
| where EventName =~ "ConsoleLogin"
| extend LoginResult = tostring(parse_json(ResponseElements).ConsoleLogin)
| extend MFAUsed = tostring(parse_json(AdditionalEventData).MFAUsed)
| where LoginResult =~ "Success" and MFAUsed =~ "No"
| project TimeGenerated, UserIdentityArn, SourceIPAddress, UserAgent, AWSRegion
```

---

### Use Case 4: Kỹ thuật Leo thang Đặc quyền & Duy trì Truy cập (IAM Persistence & PrivEsc)
- **Mô tả:** Tạo Access Key mới cho user khác, gán policy Administrator, hoặc tạo phiên bản policy mới có quyền `*`.
- **MITRE ATT&CK:** `T1098.001` (Account Manipulation: Additional Cloud Credentials), `T1548` (Abuse Elevation Control Mechanism).
- **Mức độ ưu tiên:** **HIGH**.

#### Splunk (SPL):
```spl
index=aws sourcetype="aws:cloudtrail"
eventName IN ("CreateAccessKey", "CreateLoginProfile", "AttachUserPolicy", "AttachRolePolicy", "PutUserPolicy", "PutRolePolicy", "CreatePolicyVersion")
errorCode=null
| eval actor=coalesce('userIdentity.arn', 'userIdentity.sessionContext.sessionIssuer.arn')
| eval target=coalesce('requestParameters.userName', 'requestParameters.roleName', 'requestParameters.policyArn')
| stats count, values(eventName) as Actions by actor, target, sourceIPAddress, userAgent
| sort - count
```

---

### Use Case 5: S3 Bucket bị Gỡ bỏ Block Public Access hoặc Mở Public Policy
- **Mô tả:** Thay đổi cấu hình bảo vệ S3 khiến dữ liệu có thể bị rò rỉ ra toàn cầu.
- **MITRE ATT&CK:** `T1537` (Transfer Data to Cloud Account), `T1530` (Data from Cloud Storage Object).
- **Mức độ ưu tiên:** **CRITICAL**.

#### Splunk (SPL):
```spl
index=aws sourcetype="aws:cloudtrail" eventSource="s3.amazonaws.com"
eventName IN ("PutBucketPolicy", "PutBucketAcl", "DeletePublicAccessBlock", "PutAccountPublicAccessBlock")
errorCode=null
| table _time, userIdentity.arn, eventName, requestParameters.bucketName, sourceIPAddress, requestParameters
```

---

### Use Case 6: Token Replay / Instance Credential Exfiltration Ngoài Dải IP AWS
- **Mô tả:** Temporary credential gắn với một máy ảo EC2 (`i-xxxx`) bị gọi từ một địa chỉ IP công cộng không thuộc dải IP hạ tầng của AWS.
- **MITRE ATT&CK:** `T1552.005` (Unsecured Credentials: Cloud Instance Metadata API).
- **Mức độ ưu tiên:** **CRITICAL**.

#### Splunk (SPL):
```spl
index=aws sourcetype="aws:cloudtrail" userIdentity.type="AssumedRole"
userIdentity.arn="*assumed-role/*i-*"
| eval caller_ip=sourceIPAddress
| lookup geoip clientip as caller_ip
| where NOT (cidrmatch("10.0.0.0/8", caller_ip) OR cidrmatch("172.16.0.0/12", caller_ip) OR cidrmatch("192.168.0.0/16", caller_ip) OR caller_ip="AWS Internal")
| table _time, userIdentity.arn, caller_ip, eventSource, eventName, userAgent
```

---

### Use Case 7: Do thám Quyền hạn (Access Denied Enumeration Spikes)
- **Mô tả:** Một identity gặp phải chuỗi lỗi `AccessDenied` liên tục trong thời gian ngắn (chỉ dấu công cụ quét tự động của attacker).
- **MITRE ATT&CK:** `T1526` (Cloud Service Discovery).
- **Mức độ ưu tiên:** **MEDIUM**.

#### Splunk (SPL):
```spl
index=aws sourcetype="aws:cloudtrail" errorCode IN ("AccessDenied", "Client.UnauthorizedOperation") earliest=-1h
| eval actor=coalesce('userIdentity.arn', 'sourceIPAddress')
| stats count as failure_count, values(eventName) as failed_events, values(eventSource) as target_services by actor, sourceIPAddress
| where failure_count > 15
| sort - failure_count
```

---

### Use Case 8: Mở Cổng Quản trị Nguy hiểm (22, 3389) Ra Toàn cầu (`0.0.0.0/0`)
- **Mô tả:** Luật Security Group mới được thêm vào cho phép truy cập từ mọi nơi trên Internet vào cổng SSH hoặc RDP.
- **MITRE ATT&CK:** `T1078` (Valid Accounts), `T1133` (External Remote Services).
- **Mức độ ưu tiên:** **HIGH**.

#### Microsoft Sentinel (KQL):
```kql
AWSCloudTrail
| where TimeGenerated > ago(1d)
| where EventName =~ "AuthorizeSecurityGroupIngress"
| where ErrorCode == ""
| extend IPPermissions = parse_json(RequestParameters).ipPermissions.items
| mv-expand IPPermissions
| extend FromPort = toint(IPPermissions.fromPort), ToPort = toint(IPPermissions.toPort)
| extend IPRanges = IPPermissions.ipRanges.items
| mv-expand IPRanges
| where IPRanges.cidrIp == "0.0.0.0/0" and (FromPort in (22, 3389, 445, 1433, 3306, 5432) or ToPort in (22, 3389, 445, 1433, 3306, 5432))
| project TimeGenerated, UserIdentityArn, SourceIPAddress, RequestParameters
```

---

### Use Case 9: Khởi tạo Máy chủ Compute Đột biến tại Region Lạ (Cryptomining Spike)
- **Mô tả:** Khởi tạo các dòng máy ảo cấu hình lớn tại Region không thuộc danh sách phê duyệt hoạt động của công ty.
- **MITRE ATT&CK:** `T1496` (Resource Hijacking).
- **Mức độ ưu tiên:** **HIGH**.

#### Splunk (SPL):
```spl
index=aws sourcetype="aws:cloudtrail" eventName="RunInstances" errorCode=null
| where NOT (awsRegion IN ("ap-southeast-1", "ap-east-1"))
| eval instance_type=mvindex('requestParameters.instanceType', 0)
| stats count, values(instance_type) as Types, values(requestParameters.instancesSet.items{}.instanceId) as InstanceIDs by _time, userIdentity.arn, awsRegion, sourceIPAddress
| sort - count
```

---

### Use Case 10: Chia sẻ Snapshot EBS / RDS Ra Ngoài Tài khoản Doanh nghiệp
- **Mô tả:** Sửa đổi quyền của bản sao lưu ổ cứng hoặc database để chia sẻ sang tài khoản AWS bên ngoài.
- **MITRE ATT&CK:** `T1537` (Transfer Data to Cloud Account).
- **Mức độ ưu tiên:** **CRITICAL**.

#### Amazon Athena (SQL):
```sql
SELECT eventtime, eventname, useridentity.arn, sourceipaddress, requestparameters
FROM cloudtrail_logs
WHERE eventname IN ('ModifySnapshotAttribute', 'ModifyDBSnapshotAttribute')
  AND (requestparameters LIKE '%all%' OR requestparameters LIKE '%createVolumePermission%')
ORDER BY eventtime DESC;
```

---

## 6. Quy trình Điều tra & Ứng phó Sự cố Thực chiến (IR Runbooks)

Khi xảy ra sự cố trên môi trường Cloud, thời gian phản ứng tính bằng phút. Dưới đây là hai quy trình tác chiến chuẩn (Standard Operating Procedures - SOP) dành cho SOC Analyst:

### 6.1 Runbook: Xử lý Sự cố Rò rỉ AWS Access Key (Compromised IAM Credentials)

```
SỰ CỐ: RÒ RỈ AWS ACCESS KEY (AKIA... / ASIA...)
 ┌──────────────────────────────────────────────────────────────┐
 │ BƯỚC 1: XÁC MINH & ĐỊNH DANH (IDENTIFICATION)                 │
 │ - Xác định AccessKeyId, User sở hữu, thời điểm dùng lần cuối:│
 │   aws iam get-access-key-last-used --access-key-id <KEY_ID>  │
 └──────────────────────────────┬───────────────────────────────┘
                                │
                                ▼
 ┌──────────────────────────────────────────────────────────────┐
 │ BƯỚC 2: CÔ LẬP KHẨN CẤP (CONTAINMENT)                        │
 │ 1. Vô hiệu hóa Key ngay lập tức:                             │
 │    aws iam update-access-key --access-key-id <KEY_ID>        │
 │        --status Inactive --user-name <USER_NAME>             │
 │ 2. Thu hồi toàn bộ Temporary STS Sessions (Revoke Sessions): │
 │    Gắn Inline Policy ép buộc từ chối token cấp trước giờ T   │
 └──────────────────────────────┬───────────────────────────────┘
                                │
                                ▼
 ┌──────────────────────────────────────────────────────────────┐
 │ BƯỚC 3: ĐIỀU TRA PHẠM VI ẢNH HƯỞNG (SCOPING & HUNTING)        │
 │ - Truy vấn CloudTrail lọc theo accessKeyId trong 7-30 ngày:  │
 │   Tìm mọi hành động Create*, Put*, Attach*, RunInstances     │
 └──────────────────────────────┬───────────────────────────────┘
                                │
                                ▼
 ┌──────────────────────────────────────────────────────────────┐
 │ BƯỚC 4: TIÊU DIỆT TẬN GỐC & KHÔI PHỤC (ERADICATION)          │
 │ - Xóa bỏ Backdoor (User/Key mới tạo, backdoor policy)        │
 │ - Terminate toàn bộ EC2 instance do kẻ tấn công tạo ra       │
 │ - Xóa vĩnh viễn Access Key bị lộ                             │
 └──────────────────────────────────────────────────────────────┘
```

#### Mẫu chính sách Revoke Session STS khẩn cấp:
Nếu thông tin xác thực bị lộ là Temporary Credential của một IAM Role, việc xóa key là bất khả thi vì STS key có thời hạn. Cách duy nhất để vô hiệu hóa ngay lập tức là gán một chính sách **Explicit Deny** dựa trên mốc thời gian phát hiện sự cố:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "RevokeOlderSessions",
      "Effect": "Deny",
      "Action": "*",
      "Resource": "*",
      "Condition": {
        "DateLessThan": {
          "aws:TokenIssueTime": "2026-10-08T08:00:00Z"
        }
      }
    }
  ]
}
```

---

### 6.2 Runbook: Xử lý Máy chủ EC2 bị Chiếm quyền & Khai thác SSRF

1. **Cô lập Mạng Tức thời (Network Isolation via Quarantine Security Group):**
   - Thay thế toàn bộ Security Group hiện tại của máy chủ bằng một **Quarantine SG**.
   - Cấu hình Quarantine SG: Xóa sạch toàn bộ Inbound và Outbound rules (cấm hoàn toàn kết nối mạng ra Internet và mạng nội bộ, chặn C2 và chặn lateral movement).
2. **Thu thập Bằng chứng Số (Forensic Acquisition):**
   - **Tạo Snapshot ổ đĩa EBS ngay lập tức:**
     ```bash
     aws ec2 create-snapshot --volume-id vol-0123456789abcdef0 \
         --description "Forensic-Snapshot-Incident-20261008"
     ```
   - Chuyển snapshot sang Forensic Account chuyên dụng, mount vào máy phân tích sạch để kiểm tra malware, web shell, và artifact.
3. **Thu hồi Quyền Hạn của Instance Profile:**
   - Tháo gỡ IAM Role đang gắn trên máy ảo để ngăn chặn tiếp tục sinh ra credentials mới:
     ```bash
     aws ec2 disassociate-iam-instance-profile \
         --association-id iip-assoc-0123456789abcdef0
     ```
4. **Bắt buộc Kích hoạt IMDSv2 cho Toàn bộ Hạ tầng:**
   - Ngăn chặn triệt để nguy cơ tái diễn SSRF trên các máy chủ còn lại.

---

## 7. Tự động hóa Phản ứng với Amazon EventBridge & AWS Lambda (SOAR)

Để giảm thiểu thời gian phản ứng (Mean Time to Respond - MTTR), SOC hiện đại kết hợp **EventBridge Rules** để tự động kích hoạt **AWS Lambda** thực thi hành động ngăn chặn ngay khi GuardDuty sinh ra cảnh báo nghiêm trọng:

```
[ GuardDuty phát hiện: InstanceCredentialExfiltration ]
                         │
                         ▼
┌────────────────────────────────────────────────────────┐
│ Amazon EventBridge Rule: Match Finding Type & Severity │
└────────────────────────┬───────────────────────────────┘
                         ▼
┌────────────────────────────────────────────────────────┐
│ AWS Lambda Function (Auto-Remediation):                │
│  1. Đọc ARN của IAM Role bị rò rỉ token               │
│  2. Tự động gán chính sách Deny Revoke Token Sessions   │
│  3. Gửi cảnh báo khẩn cấp vào kênh SOC Discord/Slack   │
│  4. Tạo ticket sự cố tự động trên Jira Service Mgmt    │
└────────────────────────────────────────────────────────┘
```

Mô hình này giúp tổ chức chặn đứng kẻ tấn công chỉ trong vòng **vài giây** sau khi hành vi xâm nhập diễn ra, loại bỏ hoàn toàn độ trễ của con người trong các ca trực đêm.
