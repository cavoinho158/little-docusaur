---
id: aws-cloud-foundations
title: AWS Cloud Foundations — Nền tảng Điện toán Đám mây cho SOC
sidebar_label: 1. Nền tảng Cloud (AWS)
sidebar_position: 1
description: Kiến trúc điện toán đám mây AWS dưới góc nhìn SOC Analyst — Shared Responsibility Model chuyên sâu, bề mặt tấn công các dịch vụ cốt lõi, chiến lược giám sát địa lý (Geo-baselining) và dấu vết API.
---

# AWS Cloud Foundations — Nền tảng Điện toán Đám mây cho SOC

> Tài liệu nghiên cứu chuyên sâu về nền tảng điện toán đám mây Amazon Web Services (AWS) dành riêng cho SOC Analyst và Detection Engineer. Bài viết tái định hình các khái niệm Cloud cơ bản dưới góc nhìn giám sát an ninh, phân tích bề mặt tấn công (attack surface) và xây dựng nền móng vững chắc cho công tác điều tra số (Cloud Forensics).

---

## 1. Chuyển dịch Tư duy: On-Premises sang Cloud trong Mắt SOC Analyst

Trong môi trường truyền thống (On-Premises), tư duy an ninh thông tin xoay quanh khái niệm **"Lâu đài và Hào nước" (Castle-and-Moat)**: hệ thống được bao bọc bởi tường lửa biên (Perimeter Firewall), thiết bị IDS/IPS vật lý và phân vùng mạng VLAN. Một cuộc tấn công thường diễn ra qua các bước quét cổng mạng, khai thác dịch vụ lộ ra ngoài Internet, sau đó chiếm quyền shell máy chủ rồi di chuyển ngang (Lateral Movement) qua subnet nội bộ.

Khi bước sang môi trường Cloud, toàn bộ mô hình này bị phá vỡ hoàn toàn bởi khái niệm **Software-Defined Infrastructure (Hạ tầng định nghĩa bằng phần mềm)**.

```
MÔ HÌNH ON-PREMISES (Castle-and-Moat):
[ Internet ] ──► [ Firewall Biên / IDS ] ──► [ DMZ ] ──► [ Core Network ] ──► [ Servers ]
                   (Kiểm soát chủ yếu bằng IP / Port / Packet Inspection)

MÔ HÌNH CLOUD (Identity & API-Driven Plane):
[ User / Attacker / Service ]
            │
            ▼ (HTTPS API Call: AWS CLI, SDK, Console)
    ┌────────────────────────────────────────────────────────┐
    │              AWS CONTROL PLANE (API Gateway)           │
    │         Kiểm tra Authentication & Authorization        │
    │               (IAM Policy, SCP, STS Token)             │
    └───────┬────────────────────────┬───────────────────────┘
            ▼                        ▼                       ▼
       [ EC2 Virtual ]          [ S3 Buckets ]         [ Lambda Code ]
    (Tạo/Xóa bằng API)       (Dữ liệu qua API)       (Gọi qua API)
```

### Các đặc trưng căn bản mà SOC Analyst bắt buộc phải nắm:

1. **Mọi tài nguyên đều được quản trị qua API (Control Plane):** Một máy chủ ảo EC2, một ổ đĩa EBS, hay một cụm cơ sở dữ liệu RDS không cần kỹ sư đến cắm dây hay bật nút nguồn. Chúng được sinh ra chỉ bằng một dòng lệnh API call (ví dụ `ec2:RunInstances`). Do đó, một kẻ tấn công sở hữu **Access Key bị lộ** có thể tạo ra hàng trăm máy chủ đào coin hoặc xóa sạch toàn bộ cơ sở dữ liệu của doanh nghiệp mà **không cần bước chân vào mạng nội bộ hay gửi một gói tin shellcode nào**.
2. **Hạ tầng ngắn hạn (Ephemeral Infrastructure):** Máy chủ trong Cloud có thể được khởi tạo, hoàn thành tác vụ tính toán và bị hủy chỉ trong vài phút (Auto-scaling, Serverless). Nếu SOC phụ thuộc vào việc "SSH vào máy trích xuất RAM/ổ đĩa" theo kiểu Digital Forensics truyền thống, dữ liệu bằng chứng sẽ bốc hơi ngay khi instance bị terminate. Điều tra Cloud bắt buộc phải dựa vào **log tập trung được thu thập theo thời gian thực**.
3. **Mất đi ranh giới mạng vật lý:** Một S3 bucket lưu trữ dữ liệu tài chính không nằm sau một switch cố định nào; nó được cấp phát endpoint công cộng trên toàn cầu. Ranh giới duy nhất ngăn cách dữ liệu đó với thế giới là **chính sách phân quyền IAM và cấu hình Bucket Policy**.

---

## 2. Định nghĩa NIST và Hệ quả An ninh đối với SOC

Theo Viện Tiêu chuẩn và Kỹ thuật Quốc gia Hoa Kỳ (NIST SP 800-145), Cloud Computing được định nghĩa thông qua 5 đặc tính cốt lõi. Mỗi đặc tính này đều kéo theo những thách thức an ninh và tín hiệu cảnh báo đặc trưng cho đội ngũ SOC:

| Đặc tính NIST | Bản chất vận hành | Hệ quả an ninh & Điểm nhìn SOC |
|---|---|---|
| **On-demand Self-service** | Người dùng tự cấp phát tài nguyên qua giao diện/API mà không cần can thiệp con người. | **Nguy cơ Shadow IT & Cấu hình sai:** Bất kỳ lập trình viên nào có quyền IAM đều có thể vô tình mở một cổng dữ liệu ra Internet. SOC cần giám sát các sự kiện tạo tài nguyên mới (`Create*`, `Run*`). |
| **Broad Network Access** | Truy cập tài nguyên qua mạng thông qua các giao thức tiêu chuẩn từ mọi loại thiết bị. | **Mất ranh giới địa lý:** Kẻ tấn công có thể tương tác với hệ thống từ bất kỳ đâu qua Internet. Yêu cầu SOC phải xây dựng **Geo-baseline** và giám sát kỹ các phiên đăng nhập từ IP bất thường hoặc VPN/Tor. |
| **Resource Pooling** | Hạ tầng vật lý dùng chung (Multi-tenancy) được cấp phát logic cho nhiều khách hàng. | **Ảo hóa làm ranh giới:** Dù lỗ hổng Hypervisor Escape cực kỳ hiếm, SOC cần lưu ý nguy cơ lộ dữ liệu giữa các tenant qua cấu hình IAM Trust Policy sai hoặc chia sẻ Snapshot nhầm lẫn. |
| **Rapid Elasticity** | Co giãn tài nguyên gần như vô hạn theo nhu cầu tải. | **Hiểm họa Denial of Wallet (DoW) & Cryptomining:** Kẻ tấn công chiếm được quyền sẽ lập tức kích hoạt tối đa hạn mức vCPU/GPU để đào tiền mã hóa, gây thiệt hại tài chính khổng lồ chỉ trong vài giờ. |
| **Measured Service** | Hệ thống tự động đo đếm và tính phí theo tài nguyên thực tế tiêu thụ. | **Tín hiệu cảnh báo sớm từ Billing:** Sự gia tăng đột biến trong hóa đơn sử dụng tài nguyên (AWS Cost Anomaly Detection) thường là chỉ dấu đầu tiên của một cuộc xâm nhập mà log chưa kịp phát hiện. |

---

## 3. Phân định Mô hình Dịch vụ: IaaS, PaaS, SaaS

Việc xác định mô hình dịch vụ quyết định trực tiếp **phạm vi điều tra** và **nguồn dữ liệu log khả dụng** của SOC Analyst khi xảy ra sự cố.

```
┌──────────────────────────┐  ┌──────────────────────────┐  ┌──────────────────────────┐
│        IaaS (EC2)        │  │        PaaS (RDS)        │  │       SaaS (M365)        │
├──────────────────────────┤  ├──────────────────────────┤  ├──────────────────────────┤
│ Khách: Dữ liệu           │  │ Khách: Dữ liệu           │  │ Khách: Dữ liệu           │
│ Khách: Ứng dụng          │  │ Khách: Ứng dụng          │  │ Khách: Quyền & Danh tính │
│ Khách: OS & Patching     │  │ CSP: OS & Runtime        │  │ CSP: Mọi thứ còn lại     │
│ Khách: Mạng ảo (SG/VPC)  │  │ CSP: Patching phần cứng  │  │                          │
│ CSP: Phần cứng & Hypervis│  │ CSP: Hạ tầng vật lý      │  │                          │
└──────────────────────────┘  └──────────────────────────┘  └──────────────────────────┘
```

- **IaaS (Infrastructure as a Service — ví dụ: Amazon EC2, EBS):**
  - *Phạm vi của SOC:* Rộng nhất. SOC phải giám sát cả tầng hạ tầng ảo (Security Group, IAM, CloudTrail) lẫn tầng hệ điều hành bên trong (Sysmon, Windows Event Logs, Linux `auditd`, SSH auth log, EDR agent).
  - *Trách nhiệm bảo mật:* Bạn tự chịu trách nhiệm cài đặt bản vá hệ điều hành, chống malware, và cấu hình tường lửa cục bộ.
- **PaaS (Platform as a Service — ví dụ: Amazon RDS, Elastic Beanstalk, DynamoDB):**
  - *Phạm vi của SOC:* Thu hẹp lại ở tầng ứng dụng và cấu hình phân quyền. Bạn **không thể** cài đặt agent EDR lên máy chủ chạy ngầm của Amazon RDS, cũng không thể SSH vào để xem `syslog`.
  - *Nguồn dữ liệu:* Phụ thuộc hoàn toàn vào CloudTrail (quản trị DB), RDS Database Engine Logs (General log, Slow query, Error log) được đẩy về CloudWatch.
- **SaaS (Software as a Service — ví dụ: Microsoft 365, Salesforce):**
  - *Phạm vi của SOC:* Giám sát hành vi danh tính và luồng dữ liệu (Sign-in logs, Audit logs, Data sharing). Toàn bộ hạ tầng ngầm do nhà cung cấp bảo vệ.

---

## 4. Shared Responsibility Model (Mô hình Trách nhiệm Chung) Chuyên sâu

> [!WARNING]
> Theo báo cáo Cloud Security của Gartner, hơn **95% các vụ rò rỉ dữ liệu trên môi trường Cloud xuất phát từ lỗi cấu hình và sai sót của khách hàng**, chứ không phải do nhà cung cấp đám mây bị tin tặc tấn công.

Mô hình trách nhiệm chung thường được tóm tắt bằng câu châm ngôn kinh điển của AWS:
- **Security OF the Cloud (Bảo mật CỦA đám mây):** Thuộc về **AWS**. Bao gồm an ninh vật lý của các Data Center, hệ thống máy chủ vật lý, cáp mạng ngầm, máy phát điện dự phòng, và tầng phần mềm ảo hóa (Nitro Hypervisor). AWS cam kết đạt các chứng chỉ khắt khe như SOC 1/2/3, ISO 27001, PCI-DSS.
- **Security IN the Cloud (Bảo mật TRONG đám mây):** Thuộc về **Khách hàng**. Bao gồm cấu hình phân quyền IAM, mã hóa dữ liệu lưu trữ và truyền tải, cấu hình tường lửa Security Group/NACL, quản lý vòng đời tài khoản và vá lỗi hệ điều hành trên các máy ảo.

### Ranh giới trách nhiệm trên các dịch vụ cụ thể:

| Dịch vụ AWS | AWS chịu trách nhiệm | Khách hàng (SOC & Cloud Engineer) chịu trách nhiệm |
|---|---|---|
| **Amazon EC2** | Phần cứng, Hypervisor, mạng vật lý. | Patch lỗ hổng OS (Windows/Linux), cài đặt EDR/Antivirus, cấu hình Security Group, quản lý SSH Key Pair, chống bruteforce. |
| **Amazon S3** | Ổ đĩa vật lý, tính toàn vẹn phần cứng, độ sẵn sàng (99.999999999% durability). | Phân quyền Bucket Policy, bật S3 Block Public Access, bật SSE mã hóa, bật Versioning & MFA Delete, giám sát Data Events. |
| **Amazon RDS** | Bảo trì OS của máy chủ DB, sao lưu tự động phần cứng, cập nhật minor version của DBMS. | Cấu hình tham số DB, quản lý tài khoản DB (master password, user grants), mã hóa TDE, cấu hình subnet nhóm (không đặt ở Public Subnet). |
| **AWS Lambda** | Môi trường runtime (Python/Nodejs container), cấp phát compute khi có request. | Kiểm tra code an toàn (chống SQLi, SSRF), phân quyền tối thiểu cho **Execution Role**, quản lý biến môi trường nhạy cảm (Environment Secrets). |
| **Amazon EKS** | Control Plane của Kubernetes (Kube-apiserver, etcd, controller manager). | Bảo mật Worker Nodes, container image vulnerabilities, Network Policies, RBAC nội bộ của Kubernetes, Service Account tokens. |

---

## 5. Hạ tầng Toàn cầu của AWS & Chiến lược Giám sát Địa lý (Geo-baselining)

Hạ tầng toàn cầu của AWS được tổ chức thành 3 cấp độ:
1. **Region (Khu vực địa lý):** Một vùng địa lý độc lập chứa nhiều Availability Zone (ví dụ: `ap-southeast-1` tại Singapore, `us-east-1` tại N. Virginia).
2. **Availability Zone (AZ):** Một hoặc nhiều trung tâm dữ liệu riêng biệt về nguồn điện, làm mát và mạng trong cùng một Region, kết nối với nhau bằng mạng cáp quang băng thông cực cao với độ trễ cực thấp.
3. **Edge Location (Điểm biên):** Mạng lưới toàn cầu phục vụ dịch vụ phân phối nội dung (CloudFront) và định tuyến DNS (Route 53).

```
   ┌────────────────────────────────────────────────────────┐
   │             AWS REGION (vd: ap-southeast-1)            │
   │                                                        │
   │  ┌──────────────────┐            ┌──────────────────┐  │
   │  │       AZ-1a      │   Cáp quang│       AZ-1b      │  │
   │  │  (Data Center 1) │◄──────────►│  (Data Center 2) │  │
   │  └──────────────────┘  Độ trễ thấp└──────────────────┘  │
   │           ▲                               ▲            │
   │           └──────────────┬────────────────┘            │
   │                          ▼                             │
   │                 ┌──────────────────┐                   │
   │                 │       AZ-1c      │                   │
   │                 │  (Data Center 3) │                   │
   │                 └──────────────────┘                   │
   └────────────────────────────────────────────────────────┘
```

### Điểm nhìn SOC: Hiểm họa từ "Region lạ" (Unapproved Regions)

Doanh nghiệp Việt Nam thông thường chỉ triển khai hạ tầng ở 1 đến 2 Region lân cận (phổ biến nhất là `ap-southeast-1` Singapore hoặc `ap-east-1` Hong Kong). Tuy nhiên, tài khoản AWS theo mặc định **cho phép khởi tạo tài nguyên ở hầu hết các Region trên toàn cầu**.

Kẻ tấn công sau khi đánh cắp được Access Key thường có hành vi tinh vi:
- **Tránh né tầm ngắm của SOC:** Chúng sẽ không tạo máy ảo tại Singapore (nơi kỹ sư và SOC đang theo dõi chặt chẽ), mà âm thầm chuyển sang các Region xa xôi ít ai để ý như `me-central-1` (Trung Đông), `af-south-1` (Nam Phi), hoặc `eu-north-1` (Stockholm).
- Tại đó, kẻ tấn công kích hoạt các dòng EC2 đắt tiền chuyên tính toán (như dòng `c5.24xlarge` hoặc GPU `g4dn.metal`) để tiến hành đào tiền mã hóa (Cryptomining) hoặc thực hiện quét mạng (Network Scanning).
- Đến cuối tháng, doanh nghiệp mới phát hiện khi nhận được hóa đơn hàng chục nghìn USD từ AWS.

### Biện pháp Kỹ thuật Phòng thủ & Giám sát:

1. **Thiết lập Service Control Policy (SCP) khóa cứng Region:** Áp dụng cho cấp tổ chức (AWS Organizations) để cấm hoàn toàn mọi API call ngoài danh sách Region được duyệt.

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "DenyAllOutsideApprovedRegions",
      "Effect": "Deny",
      "NotAction": [
        "iam:*",
        "organizations:*",
        "route53:*",
        "budgets:*",
        "waf:*",
        "cloudfront:*",
        "support:*"
      ],
      "Resource": "*",
      "Condition": {
        "StringNotEquals": {
          "aws:RequestedRegion": [
            "ap-southeast-1"
          ]
        }
      }
    }
  ]
}
```
*(Lưu ý: Các dịch vụ toàn cầu như IAM, Route 53, CloudFront bắt buộc phải đưa vào `NotAction` vì chúng hoạt động tại endpoint toàn cầu `us-east-1`).*

2. **Detection Rule phát hiện hoạt động ngoài Region:** Giám sát trường `awsRegion` trong CloudTrail log. Mọi request có `awsRegion != "ap-southeast-1"` và không thuộc dịch vụ Global phải kích hoạt cảnh báo High Severity cho SOC ngay lập tức.

---

## 6. Các Phương thức Tương tác với AWS và Dấu vết Kiểm toán

Dù người dùng sử dụng phương tiện nào, mọi tương tác với AWS đều được chuyển thành **HTTPS REST API Call** tới AWS Control Plane:

| Phương thức tương tác | Bản chất kỹ thuật | Giá trị trường `userAgent` trong CloudTrail | Dấu hiệu phân tích cho SOC |
|---|---|---|---|
| **AWS Management Console** | Giao diện web chạy qua trình duyệt, gọi API nội bộ bằng session cookie/token. | Chuỗi trình duyệt thực tế, ví dụ: `Mozilla/5.0 (Windows NT 10.0; Win64; x64)...` kèm `signin.amazonaws.com` | Thường có trường `sessionContext` thể hiện phiên đăng nhập console, có MFA status. |
| **AWS CLI** | Ứng dụng dòng lệnh viết bằng Python, sử dụng Access Key tĩnh hoặc STS temporary token. | Bắt đầu bằng `aws-cli/... Python/... Windows/... prompt/off` | Thường xuất hiện trong các tác vụ quản trị tự động hoặc hành vi của sysadmin/attacker. |
| **AWS SDK (Boto3, Go, Java...)** | Ứng dụng nghiệp vụ gọi API tự động qua thư viện lập trình. | `Boto3/1.26.x Python/3.9.x Linux/...` | Nếu một IAM User người thật lại xuất hiện userAgent là `Boto3` thực hiện xóa log thì đó là dấu hiệu bất thường. |
| **Công cụ Tấn công / Recon** | Các tool tự động của Red Team/Attacker (Pacu, ScoutSuite, CloudFox, Kali). | Thường để lộ header mặc định hoặc chỉnh sửa thô vụng (ví dụ `Kali`, `python-requests`, `curl`). | Kích hoạt ngay alert **PenTest:IAMUser/Tools** trong SIEM/GuardDuty. |

---

## 7. Bề mặt Tấn công của 7 Dịch vụ AWS Cốt lõi đối với SOC

Hiểu rõ kiến trúc và rủi ro an ninh của từng dịch vụ là tiền đề để SOC Analyst phán đoán mục đích của kẻ tấn công trong chuỗi hành vi (Kill Chain):

```
       BỀ MẶT TẤN CÔNG CLOUD CỐT LÕI (ATTACK SURFACES)
 ┌───────────────────────────────────────────────────────────────┐
 │ [IAM]: Chiếm quyền, tạo Backdoor Key, leo thang đặc quyền     │
 ├───────────────────────────────────────────────────────────────┤
 │ [EC2/EBS]: RCE Webapp, trộm token IMDS, lấy cắp Snapshot      │
 ├───────────────────────────────────────────────────────────────┤
 │ [S3]: Rò rỉ dữ liệu qua Public Bucket, mã hóa Ransomware      │
 ├───────────────────────────────────────────────────────────────┤
 │ [VPC]: Mở Security Group 0.0.0.0/0, bypass kiểm soát mạng     │
 ├───────────────────────────────────────────────────────────────┤
 │ [RDS]: Exfiltrate dữ liệu, tạo public snapshot cross-account  │
 ├───────────────────────────────────────────────────────────────┤
 │ [Lambda]: Chèn backdoor code, lạm dụng Execution Role         │
 ├───────────────────────────────────────────────────────────────┤
 │ [CloudWatch/CloudTrail]: Tắt logging, xóa Trail che dấu vết   │
 └───────────────────────────────────────────────────────────────┘
```

### 7.1 IAM (Identity and Access Management) — Bề mặt Rủi ro Tối thượng
- **Root Account:** Tài khoản tối cao của tenant. Không có cơ chế nào giới hạn được Root (kể cả SCP hay Permission Boundary). Nếu Root bị lộ mật khẩu và không có MFA, toàn bộ doanh nghiệp rơi vào tay kẻ tấn công. SOC phải đặt alert mức **CRITICAL** cho bất kỳ hành động nào từ `userIdentity.type == "Root"`.
- **Permanent Access Keys vs Temporary Credentials:** Access Key tĩnh (`AKIA...`) tồn tại vĩnh viễn cho đến khi bị xóa, thường bị dev commit nhầm lên GitHub. Trong khi đó, Temporary Credentials (`ASIA...`) do AWS STS sinh ra chỉ có hạn từ 15 phút đến 12 giờ.

### 7.2 Amazon EC2 & EBS — Máy chủ ảo và Ổ đĩa lưu trữ
- **Security Groups (SG):** Tường lửa ảo cấp độ instance, hoạt động **stateful** (cho phép chiều vào thì tự động mở chiều ra tương ứng). Lỗi phổ biến nhất: Mở cổng quản trị `0.0.0.0/0` cho TCP 22 (SSH) hoặc TCP 3389 (RDP).
- **EBS Snapshots:** Bản sao lưu dữ liệu ổ cứng. Attacker có thể gọi API `ModifySnapshotAttribute` để chia sẻ snapshot ổ đĩa nhạy cảm sang một tài khoản AWS khác của chúng, từ đó dump database ngoại tuyến mà không cần chạm vào máy chủ.

### 7.3 Amazon S3 — Lưu trữ Đối tượng
- **Cơ chế phân quyền phức hợp:** Quyền truy cập S3 được kiểm soát đồng thời bởi: IAM Policy (cấp cho user), Bucket Policy (gắn trên bucket), và Object ACL (gắn trên từng file).
- **Rủi ro rò rỉ dữ liệu:** Cấu hình sai Bucket Policy với `Principal: "*"` và `Action: "s3:GetObject"`.
- **S3 Ransomware:** Kẻ tấn công gọi `PutBucketPolicy` với chính sách từ chối toàn bộ (`Deny`) quyền của người quản trị, hoặc kích hoạt S3 Lifecycle Rule để xóa vĩnh viễn toàn bộ object version.

### 7.4 Amazon VPC — Mạng Đám mây Riêng ảo
- **Subnet công khai vs Subnet riêng (Public vs Private Subnet):** Public subnet có route trỏ ra Internet Gateway (`igw-xxxx`). Private subnet phải đi ra ngoài Internet thông qua NAT Gateway (`nat-xxxx`) và không thể nhận kết nối trực tiếp từ Internet.
- **NACL (Network Access Control List):** Tường lửa cấp độ subnet, hoạt động **stateless** (phải cấu hình tường minh cả chiều vào lẫn chiều ra).
- **VPC Peering:** Đường kết nối trực tiếp giữa 2 VPC. Nếu một VPC môi trường Dev bị chiếm quyền và có kết nối Peering tới VPC Prod mà không có kiểm soát chặt chẽ, attacker có thể di chuyển ngang vào hệ thống lõi.

### 7.5 Amazon RDS — Cơ sở dữ liệu Quản lý
- **Publicly Accessible:** Cờ cấu hình nguy hiểm nhất trên RDS. Nếu bị tick chọn `Yes`, instance DB sẽ được cấp phát Public IP và chấp nhận kết nối trực tiếp từ Internet nếu Security Group mở cổng 3306/5432.
- **Database Snapshots:** Tương tự EBS, RDS snapshot có thể bị share cross-account hoặc chuyển thành public snapshot.

### 7.6 AWS Lambda — Điện toán Không máy chủ (Serverless)
- **Execution Role:** Mỗi hàm Lambda được gán một IAM Role để tương tác với các dịch vụ khác (ví dụ đọc S3, ghi DynamoDB). Nếu Role này được cấp quyền quá rộng (như `AdministratorAccess`), attacker chỉ cần tìm ra lỗ hổng Code Injection / Command Injection trong code Lambda là sẽ có toàn quyền trên AWS account.
- **Persistence:** Attacker có thể chèn backdoor vào source code của Lambda hoặc tạo một Lambda trigger mới để tự động cấp lại quyền khi bị xóa.

### 7.7 Amazon CloudWatch & CloudTrail — Trụ cột Giám sát
- **CloudTrail:** Ghi lại **toàn bộ API calls**. Kẻ tấn công luôn tìm cách vô hiệu hóa dịch vụ này (`StopLogging`, `DeleteTrail`) đầu tiên để xóa dấu vết (Defense Evasion).
- **CloudWatch Logs:** Nơi tập hợp log hệ điều hành, log ứng dụng và metrics. Nếu dung lượng đẩy về đột ngột giảm về 0, đó có thể là dấu hiệu agent ghi log trên máy chủ đã bị attacker gỡ bỏ.

---

## 8. Khái niệm Định danh & Quản trị Doanh nghiệp

- **Amazon Resource Name (ARN):** Chuỗi định danh duy nhất trên toàn cầu cho mọi tài nguyên AWS. Cấu trúc chuẩn:
  ```
  arn:partition:service:region:account-id:resource-type/resource-id
  ```
  *Ví dụ:* `arn:aws:s3:::financial-reports-2026/q3-audit.xlsx` hoặc `arn:aws:iam::123456789012:role/DevOpsAdminRole`
- **Account ID:** Dãy 12 chữ số đại diện cho một tài khoản AWS độc lập. Trong điều tra, SOC cần xác định xem một API call xuất phát từ nội bộ Account ID của doanh nghiệp hay từ một External Account lạ.
- **AWS Organizations:** Dịch vụ quản lý nhiều tài khoản theo cấu trúc cây thư mục (Organizational Units - OUs), cho phép áp dụng Service Control Policies (SCPs) từ trên đỉnh xuống.
- **Tagging Strategy cho SecOps:** Mọi tài nguyên chuẩn mực đều phải được gắn thẻ (Tags) như `Environment: Production`, `DataClassification: Confidential`, `Owner: SecurityTeam`. Khi phát hiện một EC2 lạ không có tag hoặc có tag bất thường, khả năng cao đó là tài nguyên do kẻ tấn công tự ý tạo dựng.

---

## 9. Hướng dẫn Dựng Lab Cá nhân & Bài tập Tự luyện cho SOC

Để nắm vững các khái niệm trên, bạn nên tự tay thực hiện các bước sau trên một tài khoản AWS Free Tier cá nhân:

- [ ] **Bước 1: Thiết lập An toàn Tuyệt đối cho Root Account:**
  - Đăng nhập tài khoản Root, kích hoạt ngay **Hardware MFA hoặc Authenticator App MFA**.
  - Khóa và xóa bỏ hoàn toàn Root Access Keys (nếu có).
  - Không bao giờ dùng Root để thao tác hàng ngày.
- [ ] **Bước 2: Tạo IAM Admin User & Cấu hình Budget Alert:**
  - Tạo IAM User riêng có gắn quyền quản trị, bật MFA.
  - Cấu hình AWS Budgets: Đặt ngưỡng cảnh báo $1 USD để nhận email ngay khi có phát sinh chi phí bất thường.
- [ ] **Bước 3: Khám phá CloudTrail Event History:**
  - Khởi tạo một S3 bucket, sau đó xóa bucket đó.
  - Truy cập **CloudTrail Console -> Event history**, tìm kiếm theo `Event name`: `CreateBucket` và `DeleteBucket`.
  - Mở chi tiết định dạng JSON, xác định các trường: `sourceIPAddress`, `userIdentity`, `userAgent`.
- [ ] **Bước 4: Cài đặt và Xác thực AWS CLI:**
  - Cài đặt công cụ AWS CLI trên máy cá nhân.
  - Chạy lệnh kiểm tra định danh:
    ```bash
    aws sts get-caller-identity
    ```
  - Đối chiếu kết quả trả về (`UserId`, `Account`, `Arn`) với IAM User vừa tạo.

---

## 10. Bộ Câu hỏi Ôn tập Thực chiến dành cho SOC Analyst

1. **Tình huống 1:** Một alert từ hệ thống cảnh báo rằng máy chủ web EC2 của công ty vừa bị hacker khai thác lỗ hổng Web Application. Vì sao việc đầu tiên SOC làm không phải là mở port SSH vào máy để kiểm tra, mà là kiểm tra IAM Role đang gắn trên instance đó?
   *(Gợi ý: Lỗ hổng SSRF có thể giúp kẻ tấn công trích xuất temporary credentials của instance profile từ metadata service 169.254.169.254).*

2. **Tình huống 2:** Công ty của bạn chỉ hoạt động tại thị trường Việt Nam và đặt máy chủ tại Singapore (`ap-southeast-1`). Trong ca trực đêm, bạn phát hiện một loạt sự kiện `RunInstances` thành công tại Region `sa-east-1` (São Paulo, Brazil). Mức độ nghiêm trọng của sự cố này là gì và dấu hiệu tấn công đặc trưng là gì?
   *(Gợi ý: Khả năng cao Access Key đã bị rò rỉ và kẻ tấn công đang tiến hành Cryptomining ở Region ngoài tầm giám sát).*

3. **Tình huống 3:** Phân biệt sự khác biệt về mặt bằng chứng pháp lý (Forensic Evidence) giữa việc điều tra sự cố mã độc trên Amazon EC2 so với Amazon RDS?
   *(Gợi ý: EC2 cho phép trích xuất Disk Snapshot và Memory Dump; RDS là PaaS nên chỉ có thể dựa vào CloudTrail và Database Engine Audit Logs).*
