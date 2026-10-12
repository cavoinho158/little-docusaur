---
id: cloud-soc-detection-monitoring
title: AWS Cloud SOC — Giám sát, Phát hiện & Ứng phó Sự cố
sidebar_label: 3. Giám sát & Ứng phó Sự cố
sidebar_position: 3
description: Cẩm nang giám sát an ninh AWS — Kiến trúc log tập trung, phân tích cấu trúc CloudTrail & VPC Flow Logs, phát hiện đe dọa với GuardDuty, 10 use case kèm truy vấn SPL/KQL/Athena và runbook xử lý sự cố.
---

# AWS Cloud SOC: Giám sát, Phát hiện & Ứng phó Sự cố

> Tài liệu hướng dẫn xây dựng hệ thống giám sát an ninh, phát hiện mối đe dọa và quy trình ứng phó sự cố (incident response) trên môi trường AWS dành cho SOC analyst và detection engineer.

---

## 1. Kiến trúc lưu trữ và giám sát log tập trung

Trong môi trường doanh nghiệp có nhiều tài khoản AWS con thuộc cùng một organization, việc để log phân tán tại từng tài khoản tiềm ẩn rủi ro lớn: nếu kẻ tấn công chiếm được quyền quản trị của một tài khoản, chúng có thể xóa sạch log để xóa dấu vết.

Mô hình chuẩn là thiết lập một **Central Log Archive Account** (tài khoản lưu trữ log tập trung độc lập):

```
┌───────────────────────────┐    ┌───────────────────────────┐
│     Member Account 1      │    │     Member Account 2      │
│     (Production)          │    │     (Dev / Staging)       │
│  - Organization trail     │    │  - Organization trail     │
│  - VPC Flow Logs          │    │  - VPC Flow Logs          │
└─────────────┬─────────────┘    └─────────────┼─────────────┘
              │ (Đẩy tự động qua cross-account)│
              ▼                                ▼
┌────────────────────────────────────────────────────────────┐
│                Central Log Archive Account                 │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ S3 Log Bucket:                                       │  │
│  │  - Bật S3 Object Lock (chế độ WORM)                  │  │
│  │  - Mã hóa bằng KMS CMK riêng                         │  │
│  │  - SCP cấm mọi hành động DeleteObject/DeleteBucket   │  │
│  └──────────────────────────┬───────────────────────────┘  │
└─────────────────────────────┼──────────────────────────────┘
                              │
               ┌──────────────┴──────────────┐
               ▼                             ▼
    ┌──────────────────────┐      ┌──────────────────────┐
    │ SIEM / Data Platform │      │    AWS Athena /      │
    │  (Splunk / Sentinel) │      │  CloudWatch Insights │
    │   Cảnh báo realtime  │      │  Truy vấn điều tra   │
    └──────────────────────┘      └──────────────────────┘
```

Một số biện pháp bảo vệ nguồn log cần áp dụng:
- **S3 Object Lock:** Bật ở chế độ Compliance Mode để bảo đảm dữ liệu log không thể bị sửa đổi hoặc xóa trước thời hạn lưu trữ (ví dụ 365 ngày), kể cả bởi tài khoản root.
- **KMS Customer Managed Key (CMK) riêng:** Khóa mã hóa nằm ở tài khoản bảo mật riêng, chỉ cấp quyền mã hóa cho các tài khoản thành viên và hạn chế tối đa quyền giải mã.
- **Service Control Policy (SCP):** Chặn các API xóa hoặc tắt log như `cloudtrail:StopLogging`, `cloudtrail:DeleteTrail` và `s3:DeleteBucket*` trên toàn bộ tài khoản con.

---

## 2. Phân tích cấu trúc CloudTrail logs

CloudTrail ghi nhận mọi API call từ control plane và data plane. Đây là nguồn dữ liệu điều tra cốt lõi nhất trên AWS.

### 2.1 Ba loại sự kiện trong CloudTrail

- **Management events:** Ghi nhận các thao tác quản trị tài nguyên (như `RunInstances`, `CreateUser`, `AuthorizeSecurityGroupIngress`). Mặc định được ghi nhận miễn phí 90 ngày gần nhất trong mục Event history. Để lưu trữ dài hạn, cần tạo Trail ghi ra S3.
- **Data events:** Ghi nhận các thao tác mức dữ liệu (như `s3:GetObject`, `lambda:InvokeFunction`). Loại event này không bật mặc định vì sinh ra lượng log rất lớn và tốn chi phí; thường chỉ bật có chọn lọc trên các S3 bucket chứa dữ liệu nhạy cảm.
- **Insights events:** Sử dụng phân tích hành vi để phát hiện đột biến bất thường về tần suất gọi API (ví dụ số lượng lệnh ghi tăng vọt so với ngày thường).

---

### 2.2 Các trường quan trọng trong JSON schema của CloudTrail

Ví dụ một bản ghi sự kiện đổi bucket policy sang public:

```json
{
  "eventVersion": "1.08",
  "userIdentity": {
    "type": "AssumedRole",
    "principalId": "AROA123456789EXAMPLE:session-name",
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
    "bucketName": "company-data-vault",
    "bucketPolicy": "{\"Version\":\"2012-10-17\",\"Statement\":[{\"Effect\":\"Allow\",\"Principal\":\"*\",\"Action\":\"s3:GetObject\",\"Resource\":\"arn:aws:s3:::company-data-vault/*\"}]}"
  },
  "errorCode": null
}
```

Các trường cần kiểm tra đầu tiên khi triage:

- **`userIdentity`:** Ai thực hiện hành động. Xem `type` (Root, IAMUser hay AssumedRole), `arn` và trường `sessionContext` để biết role gốc và trạng thái MFA.
- **`sourceIPAddress`:** IP nguồn thực hiện lệnh. Cần đối chiếu xem IP này có phải IP văn phòng, IP nội bộ AWS hay IP lạ từ Internet.
- **`userAgent`:** Công cụ gửi request (trình duyệt, AWS CLI, Boto3 SDK hay công cụ dò quét tự động).
- **`errorCode`:** Nếu xuất hiện liên tiếp các lỗi `AccessDenied` từ cùng một user hoặc IP, đây là dấu hiệu của hành vi dò quét quyền.
- **`requestParameters`:** Chi tiết tham số gửi lên (như nội dung policy mới, user nào được cấp key, bucket nào bị tác động).

---

## 3. Các nguồn log bổ trợ: VPC Flow và DNS

### 3.1 VPC Flow Logs

VPC Flow Logs ghi lại metadata của các gói tin mạng đi qua giao diện mạng ảo (ENI). Định dạng bản ghi mặc định gồm các trường chính:

```
<version> <account-id> <interface-id> <srcaddr> <dstaddr> <srcport> <dstport> <protocol> <packets> <bytes> <start> <end> <action> <log-status>
```

Ứng dụng trong điều tra:
- **Dò quét nội bộ:** Một máy chủ nội bộ liên tục gửi gói tin tới nhiều IP khác trong subnet trên các cổng 22, 445, 3389.
- **C2 beaconing:** Máy chủ định kỳ gửi kết nối ra một IP cố định ngoài Internet theo chu kỳ đều đặn.
- **Thất thoát dữ liệu qua mạng:** Trường `bytes` tăng đột biến ra một IP lạ ngoài nước trong khung giờ đêm.

### 3.2 Route 53 Resolver query logs

Ghi nhận toàn bộ các truy vấn DNS gửi từ các máy chủ trong VPC. Nguồn này giúp phát hiện:
- **DNS tunneling:** Tên miền phụ có độ dài bất thường chứa chuỗi mã hóa base64 nhằm truyền dữ liệu lén ra ngoài.
- **DGA domain:** Các tên miền được sinh ngẫu nhiên từ mã độc để tìm máy chủ điều khiển C2.

---

## 4. Dịch vụ phát hiện đe dọa với GuardDuty

### 4.1 Cơ chế hoạt động của Amazon GuardDuty

Amazon GuardDuty là dịch vụ phát hiện mối đe dọa tự động chạy ngầm ở tầng hạ tầng AWS:
- Không cần cài agent lên máy ảo.
- Tự động phân tích CloudTrail management events, S3 data events, VPC Flow Logs, DNS query logs, EKS audit logs và RDS login activity.
- Sử dụng machine learning kết hợp với threat intelligence từ AWS, CrowdStrike và Proofpoint.

Các nhóm finding quan trọng cần chú ý:

| Finding | Mức độ | Ý nghĩa |
|---|---|---|
| `UnauthorizedAccess:IAMUser/InstanceCredentialExfiltration.OutsideAWS` | High | Token tạm thời của EC2 instance profile bị lấy cắp và đang được sử dụng từ một IP nằm ngoài dải IP của AWS. |
| `Stealth:IAMUser/CloudTrailLoggingDisabled` | High | Có hành động tắt hoặc xóa trail trong CloudTrail (`StopLogging`, `DeleteTrail`). |
| `CryptoCurrency:EC2/BitcoinTool.B!DNS` | High | Máy ảo EC2 gửi truy vấn DNS tới mining pool đào tiền mã hóa. |
| `Trojan:EC2/DNSDataExfiltration` | High | Máy ảo EC2 có dấu hiệu truyền dữ liệu ra ngoài qua DNS tunneling. |
| `Policy:S3/BucketPublicAccessGranted` | High | S3 bucket bị chuyển sang trạng thái cho phép truy cập công khai. |
| `PenTest:IAMUser/KaliLinux` | Medium | Lệnh API được gửi từ máy tính chạy hệ điều hành Kali Linux. |

---

## 5. Use case và truy vấn detection mẫu

Dưới đây là 10 use case phổ biến kèm câu lệnh mẫu trên các nền tảng SIEM và công cụ truy vấn log.

---

### Use Case 1: Sử dụng tài khoản Root
- **Mục tiêu:** Cảnh báo khi có bất kỳ hành vi đăng nhập hoặc gọi API nào bằng tài khoản root.
- **MITRE ATT&CK:** `T1078.004` (Valid Accounts: Cloud Accounts).

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

### Use Case 2: Tắt hoặc xóa nhật ký CloudTrail
- **Mục tiêu:** Phát hiện hành vi vô hiệu hóa việc ghi log để che giấu dấu vết.
- **MITRE ATT&CK:** `T1562.008` (Impair Defenses: Disable Cloud Logs).

#### Splunk (SPL):
```spl
index=aws sourcetype="aws:cloudtrail" 
eventName IN ("StopLogging", "DeleteTrail", "UpdateTrail", "DeleteDetector")
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

### Use Case 3: Đăng nhập Console không bật MFA
- **Mục tiêu:** Phát hiện các phiên đăng nhập web console thành công mà không qua bước xác thực đa yếu tố.
- **MITRE ATT&CK:** `T1078.004` (Valid Accounts: Cloud Accounts).

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

### Use Case 4: Tạo credential mới hoặc gán quyền admin
- **Mục tiêu:** Phát hiện hành vi duy trì quyền truy cập hoặc tự nâng quyền sau khi xâm nhập.
- **MITRE ATT&CK:** `T1098.001` (Account Manipulation: Additional Cloud Credentials), `T1548`.

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

### Use Case 5: S3 bucket bị gỡ Block Public Access hoặc mở public policy
- **Mục tiêu:** Cảnh báo khi cấu hình bảo vệ S3 bị thay đổi làm dữ liệu có nguy cơ lộ ra ngoài.
- **MITRE ATT&CK:** `T1530` (Data from Cloud Storage Object), `T1537`.

#### Splunk (SPL):
```spl
index=aws sourcetype="aws:cloudtrail" eventSource="s3.amazonaws.com"
eventName IN ("PutBucketPolicy", "PutBucketAcl", "DeletePublicAccessBlock", "PutAccountPublicAccessBlock")
errorCode=null
| table _time, userIdentity.arn, eventName, requestParameters.bucketName, sourceIPAddress, requestParameters
```

---

### Use Case 6: Credential của EC2 instance profile bị dùng ngoài dải IP AWS
- **Mục tiêu:** Phát hiện trường hợp token tạm thời của máy ảo bị đánh cắp (qua SSRF) và mang ra ngoài Internet sử dụng.
- **MITRE ATT&CK:** `T1552.005` (Unsecured Credentials: Cloud Instance Metadata API).

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

### Use Case 7: Dò quét quyền hạn (chuỗi AccessDenied liên tiếp)
- **Mục tiêu:** Phát hiện khi một identity gọi hàng loạt API và liên tục nhận lỗi từ chối quyền.
- **MITRE ATT&CK:** `T1526` (Cloud Service Discovery).

#### Splunk (SPL):
```spl
index=aws sourcetype="aws:cloudtrail" errorCode IN ("AccessDenied", "Client.UnauthorizedOperation") earliest=-1h
| eval actor=coalesce('userIdentity.arn', 'sourceIPAddress')
| stats count as failure_count, values(eventName) as failed_events, values(eventSource) as target_services by actor, sourceIPAddress
| where failure_count > 15
| sort - failure_count
```

---

### Use Case 8: Mở cổng quản trị (22, 3389) ra toàn Internet (0.0.0.0/0)
- **Mục tiêu:** Cảnh báo khi có rule security group mới cho phép kết nối từ mọi IP vào cổng quản lý.
- **MITRE ATT&CK:** `T1133` (External Remote Services).

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

### Use Case 9: Khởi tạo máy ảo cấu hình cao ở region lạ
- **Mục tiêu:** Phát hiện hành vi đào coin bằng cách bật máy chủ tại các region không nằm trong danh sách thường dùng.
- **MITRE ATT&CK:** `T1496` (Resource Hijacking).

#### Splunk (SPL):
```spl
index=aws sourcetype="aws:cloudtrail" eventName="RunInstances" errorCode=null
| where NOT (awsRegion IN ("ap-southeast-1", "ap-east-1"))
| eval instance_type=mvindex('requestParameters.instanceType', 0)
| stats count, values(instance_type) as Types, values(requestParameters.instancesSet.items{}.instanceId) as InstanceIDs by _time, userIdentity.arn, awsRegion, sourceIPAddress
| sort - count
```

---

### Use Case 10: Chia sẻ snapshot EBS hoặc RDS ra tài khoản ngoài
- **Mục tiêu:** Phát hiện hành vi chia sẻ bản sao lưu ổ đĩa hoặc cơ sở dữ liệu sang tài khoản bên ngoài.
- **MITRE ATT&CK:** `T1537` (Transfer Data to Cloud Account).

#### Amazon Athena (SQL):
```sql
SELECT eventtime, eventname, useridentity.arn, sourceipaddress, requestparameters
FROM cloudtrail_logs
WHERE eventname IN ('ModifySnapshotAttribute', 'ModifyDBSnapshotAttribute')
  AND (requestparameters LIKE '%all%' OR requestparameters LIKE '%createVolumePermission%')
ORDER BY eventtime DESC;
```

---

## 6. Quy trình điều tra và ứng phó sự cố (IR runbooks)

### 6.1 Runbook: Xử lý sự cố rò rỉ AWS access key

1. **Xác minh và xác định phạm vi:**
   - Kiểm tra user sở hữu key và thời điểm sử dụng gần nhất:
     ```bash
     aws iam get-access-key-last-used --access-key-id <ACCESS_KEY_ID>
     ```
2. **Cô lập nhanh (containment):**
   - Đặt trạng thái key sang `Inactive` ngay lập tức:
     ```bash
     aws iam update-access-key --access-key-id <ACCESS_KEY_ID> \
         --status Inactive --user-name <USER_NAME>
     ```
   - Nếu nghi ngờ liên quan tới role hoặc session token tạm thời, gán một inline policy để từ chối các session được cấp trước thời điểm phát hiện:
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
3. **Điều tra phạm vi ảnh hưởng (scoping):**
   - Truy vấn CloudTrail lọc theo `accessKeyId` trong vòng 7 đến 30 ngày để liệt kê toàn bộ các hành động đã thực hiện.
   - Tìm kiếm các event tạo user mới, tạo key mới, đổi policy hoặc tạo instance EC2 lạ.
4. **Xử lý triệt để và khôi phục:**
   - Xóa bỏ các tài nguyên backdoor do kẻ tấn công tạo ra.
   - Xóa vĩnh viễn access key bị lộ và cấp key mới nếu cần thiết.

---

### 6.2 Runbook: Xử lý máy chủ EC2 bị xâm nhập

1. **Cô lập máy chủ:**
   - Gán máy chủ vào một quarantine security group đã xóa toàn bộ inbound và outbound rules để cắt đứt kết nối C2 và ngăn lây lan mạng nội bộ.
2. **Thu thập bằng chứng số:**
   - Tạo snapshot ổ đĩa EBS của máy chủ để lưu giữ bằng chứng:
     ```bash
     aws ec2 create-snapshot --volume-id vol-0123456789abcdef0 \
         --description "Forensic-Snapshot-Incident-20261008"
     ```
   - Chuyển snapshot sang tài khoản forensics riêng để gắn vào máy phân tích sạch và kiểm tra malware, webshell.
3. **Gỡ bỏ instance profile:**
   - Tách IAM role ra khỏi instance để tránh việc tiếp tục sinh credential tạm thời:
     ```bash
     aws ec2 disassociate-iam-instance-profile \
         --association-id iip-assoc-0123456789abcdef0
     ```
4. **Khắc phục nguyên nhân gốc rễ:**
   - Kiểm tra cấu hình IMDS, bắt buộc chuyển sang IMDSv2 với hop limit = 1 nếu phát hiện dấu hiệu khai thác SSRF.

---

## 7. Tự động hóa ứng phó với EventBridge và Lambda

Để rút ngắn thời gian xử lý sự cố, tổ chức có thể kết hợp EventBridge và AWS Lambda để tự động thực thi các hành động ngăn chặn ban đầu:

```
[ GuardDuty phát hiện: InstanceCredentialExfiltration ]
                         │
                         ▼
┌────────────────────────────────────────────────────────┐
│ Amazon EventBridge: Lọc finding có mức High/Critical   │
└────────────────────────┬───────────────────────────────┘
                         ▼
┌────────────────────────────────────────────────────────┐
│ AWS Lambda (tự động ứng phó):                          │
│  - Trích xuất IAM role bị lộ                           │
│  - Gán policy Deny thu hồi session cũ                  │
│  - Gửi thông báo khẩn cấp vào kênh chat SOC            │
│  - Tự động tạo ticket sự cố trên Jira Service Mgmt     │
└────────────────────────────────────────────────────────┘
```

Mô hình này giúp ngăn chặn hành vi khai thác ngay khi hệ thống phát hiện đe dọa, giảm thiểu thiệt hại trước khi ca trực tiếp nhận và xử lý thủ công.
