---
id: aws-cloud-foundations
title: AWS Cloud Foundations — Nền tảng cho SOC
sidebar_label: 1. Nền tảng Cloud (AWS)
sidebar_position: 1
description: Kiến trúc AWS dưới góc nhìn SOC — Shared Responsibility Model, bề mặt tấn công các dịch vụ cốt lõi, rủi ro từ region lạ và dấu vết API trong log.
---

# AWS Cloud Foundations: Nền tảng cho SOC

> Tài liệu tổng hợp kiến thức nền tảng về Amazon Web Services (AWS) dành cho SOC analyst, tập trung vào cách cloud vận hành, bề mặt tấn công của các dịch vụ cốt lõi và các dấu vết API phục vụ điều tra.

---

## 1. Tư duy cloud cho SOC: từ perimeter sang identity và API

Trong môi trường on-premises truyền thống, bảo mật thường xoay quanh mô hình phòng thủ theo chu vi (perimeter defense): tường lửa biên, IDS/IPS vật lý và phân vùng mạng nội bộ. Kẻ tấn công thường phải quét cổng, khai thác dịch vụ mạng, chiếm shell máy chủ rồi mới tìm cách di chuyển ngang qua subnet.

Khi chuyển sang cloud, toàn bộ hạ tầng được định nghĩa bằng phần mềm (software-defined infrastructure). Tài nguyên máy chủ ảo, ổ đĩa hay cơ sở dữ liệu không cần cắm dây vật lý mà được cấp phát trực tiếp qua các lệnh gọi API tới control plane của AWS.

```
Mô hình on-premises:
[ Internet ] ──► [ Tường lửa biên / IDS ] ──► [ DMZ ] ──► [ Core Network ] ──► [ Máy chủ ]
                   (Kiểm soát chủ yếu theo IP, port và traffic mạng)

Mô hình cloud:
[ User / Attacker / Service ]
            │
            ▼ (HTTPS API: AWS CLI, SDK, Console)
    ┌────────────────────────────────────────────────────────┐
    │                   AWS Control Plane                    │
    │         Kiểm tra authentication và authorization       │
    │               (IAM policy, SCP, STS token)             │
    └───────┬────────────────────────┬───────────────────────┘
            ▼                        ▼                       ▼
         [ EC2 ]                  [ S3 ]                 [ Lambda ]
    (Tạo/xóa qua API)        (Dữ liệu qua API)       (Kích hoạt qua API)
```

Một số thay đổi căn bản mà analyst cần lưu ý:

- **Mọi thay đổi hạ tầng đều là API call:** Một instance EC2 hay cơ sở dữ liệu RDS có thể được tạo ra chỉ bằng một API call (như `RunInstances` hay `CreateDBInstance`). Kẻ tấn công có access key bị lộ có thể tạo máy chủ đào coin hoặc xóa bucket dữ liệu mà không cần gửi bất kỳ gói tin exploit mạng nào.
- **Tài nguyên ngắn hạn (ephemeral):** Máy ảo trong cloud có thể được sinh ra, xử lý tác vụ rồi bị hủy trong vòng vài chục phút qua auto-scaling. SOC không thể chỉ trông đợi vào việc SSH vào máy trích xuất RAM hay ổ cứng theo cách điều tra máy vật lý truyền thống, mà phải dựa vào luồng log được đẩy tập trung về SIEM theo thời gian thực.
- **Ranh giới mạng bị xóa nhòa:** Một S3 bucket lưu dữ liệu khách hàng có public endpoint toàn cầu. Ranh giới duy nhất ngăn cách dữ liệu đó với bên ngoài là cấu hình phân quyền IAM và bucket policy, chứ không phải một firewall vật lý nào.

---

## 2. Đặc tính NIST dưới góc nhìn rủi ro SOC

Theo NIST SP 800-145, điện toán đám mây có 5 đặc tính cốt lõi. Mỗi đặc tính đều mang lại sự tiện lợi trong vận hành nhưng cũng tạo ra các rủi ro cụ thể:

| Đặc tính NIST | Ý nghĩa vận hành | Rủi ro và điểm cần giám sát |
|---|---|---|
| **On-demand self-service** | Người dùng tự tạo tài nguyên qua console hoặc API mà không cần phê duyệt thủ công. | Dễ phát sinh shadow IT và cấu hình sai. Người dùng có quyền có thể vô tình mở tài nguyên ra Internet. Cần giám sát các event tạo tài nguyên mới (`Create*`, `Run*`). |
| **Broad network access** | Truy cập dịch vụ qua mạng từ nhiều vị trí và thiết bị khác nhau. | Kẻ tấn công có thể tương tác với hệ thống từ bất kỳ đâu qua Internet. Cần xây dựng baseline địa lý và cảnh báo khi có đăng nhập từ IP, quốc gia hoặc ASN bất thường. |
| **Resource pooling** | Hạ tầng vật lý dùng chung cho nhiều khách hàng (multi-tenant). | Ranh giới giữa các tenant được phân tách bằng logic ảo hóa. Cần chú ý rủi ro rò rỉ dữ liệu qua trust policy quá rộng hoặc chia sẻ snapshot nhầm sang tài khoản ngoài. |
| **Rapid elasticity** | Tài nguyên có thể co giãn tự động và nhanh chóng theo nhu cầu tải. | Rủi ro bị lạm dụng tài nguyên để đào coin (cryptomining) hoặc denial of wallet. Kẻ tấn công có thể tạo hàng loạt instance đắt tiền làm chi phí tăng vọt. |
| **Measured service** | Đo lường và tính phí chính xác theo lượng tài nguyên thực tế sử dụng. | Đột biến chi phí bất thường (AWS Cost Anomaly) thường là một trong những chỉ báo sớm cho thấy tài khoản đang bị lạm dụng tài nguyên tính toán. |

---

## 3. Phân định mô hình dịch vụ: IaaS, PaaS và SaaS

Mô hình dịch vụ quyết định phạm vi trách nhiệm kỹ thuật và các nguồn log mà SOC có thể tiếp cận khi điều tra sự cố:

| Mô hình | Trách nhiệm của AWS | Trách nhiệm của khách hàng | Nguồn log khả dụng cho SOC |
|---|---|---|---|
| **IaaS** (EC2, EBS, VPC) | Phần cứng vật lý, mạng nền tảng, hypervisor ảo hóa. | Hệ điều hành, bản vá lỗ hổng (patching), phần mềm, cấu hình firewall mạng (security group), dữ liệu. | CloudTrail, VPC Flow Logs, log hệ điều hành (Sysmon, Windows Event Logs, auditd, auth.log) và EDR agent. |
| **PaaS** (RDS, DynamoDB, Lambda) | Phần cứng, OS máy chủ ngầm, runtime, cập nhật bản vá nền tảng. | Cấu hình dịch vụ, code ứng dụng, quản lý tài khoản database, phân quyền dữ liệu. | CloudTrail, log do dịch vụ xuất ra (RDS database engine log, CloudWatch Logs từ Lambda execution). Không thể cài EDR lên host ngầm. |
| **SaaS** (Microsoft 365, Salesforce) | Toàn bộ hạ tầng, phần cứng, hệ điều hành và ứng dụng. | Cấu hình bảo mật tenant, quản lý tài khoản người dùng, phân quyền truy cập dữ liệu. | Sign-in logs, audit logs, unified audit log. Không quản lý bất kỳ phần cứng hay mạng ngầm nào. |

---

## 4. Shared Responsibility Model chuyên sâu

Mô hình trách nhiệm chung phân định rõ ranh giới giữa hai bên:
- **Security OF the Cloud:** Trách nhiệm của AWS. Bao gồm an toàn vật lý của các datacenter, máy chủ, đường truyền mạng và tầng ảo hóa Nitro Hypervisor.
- **Security IN the Cloud:** Trách nhiệm của khách hàng. Bao gồm quản lý người dùng và quyền truy cập (IAM), cấu hình tường lửa (security group), mã hóa dữ liệu, cập nhật bản vá cho máy ảo và kiểm soát dữ liệu.

Phần lớn sự cố rò rỉ dữ liệu trên cloud không xuất phát từ việc hạ tầng AWS bị xâm nhập, mà đến từ **cấu hình sai phía khách hàng**: mở S3 bucket cho mọi người đọc, gán quyền IAM quá rộng, hoặc để lộ access key trên kho mã nguồn công khai.

### Ranh giới trách nhiệm trên các dịch vụ thường gặp:

- **Amazon EC2:** AWS chịu trách nhiệm về phần cứng và hypervisor. Khách hàng phải tự cấu hình security group, tự cập nhật bản vá cho Windows/Linux, quản lý SSH key pair và cài đặt giải pháp endpoint security (EDR/antivirus).
- **Amazon S3:** AWS đảm bảo độ bền của đĩa cứng và tính sẵn sàng của hạ tầng. Khách hàng chịu trách nhiệm cấu hình bucket policy, bật Block Public Access, bật mã hóa dữ liệu và kiểm soát ai có quyền truy cập.
- **Amazon RDS:** AWS lo việc bảo trì hệ điều hành máy chủ và backup phần cứng. Khách hàng chịu trách nhiệm đặt mật khẩu tài khoản DB, phân quyền database, không đặt database ở public subnet và cấu hình security group phù hợp.
- **AWS Lambda:** AWS lo môi trường runtime (container thực thi code) và mở rộng tài nguyên. Khách hàng chịu trách nhiệm bảo đảm code không có lỗ hổng (như command injection hay SSRF) và giới hạn quyền cho execution role ở mức tối thiểu.

---

## 5. Hạ tầng toàn cầu và rủi ro từ region lạ

Hạ tầng toàn cầu của AWS được chia thành:
- **Region:** Khu vực địa lý độc lập (như `ap-southeast-1` tại Singapore, `us-east-1` tại N. Virginia). Dữ liệu không tự động rời khỏi một region nếu khách hàng không cấu hình sao chép.
- **Availability Zone (AZ):** Một hoặc nhiều datacenter tách biệt về nguồn điện và mạng trong cùng một region, kết nối với nhau bằng đường truyền độ trễ cực thấp để triển khai giải pháp dự phòng (high availability).
- **Edge Location:** Điểm hiện diện biên phục vụ mạng phân phối nội dung (CloudFront) và dịch vụ DNS (Route 53).

### Rủi ro từ region lạ đối với SOC

Nhiều tổ chức tại Việt Nam chỉ triển khai hệ thống ở một hoặc hai region lân cận (thường là `ap-southeast-1` Singapore hoặc `ap-east-1` Hong Kong). Tuy nhiên, mặc định một tài khoản AWS vẫn cho phép khởi tạo tài nguyên ở hầu hết các region khác trên thế giới.

Kẻ tấn công sau khi lấy được credential thường không tạo máy chủ ở Singapore vì biết đội ngũ kỹ thuật đang theo dõi sát sao tại đó. Thay vào đó, chúng âm thầm chuyển sang các region xa xôi ít được để ý như `af-south-1` (Cape Town) hay `me-central-1` (UAE) để bật các dòng EC2 cấu hình cao phục vụ đào coin.

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "DenyUnapprovedRegions",
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

*Lưu ý: Các dịch vụ toàn cầu (global services) như IAM hay Route 53 cần được đưa vào danh sách ngoại lệ `NotAction` vì chúng hoạt động tại endpoint chung us-east-1.*

Về mặt giám sát, SOC cần theo dõi trường `awsRegion` trong CloudTrail. Mọi thao tác quản trị xuất hiện ở region nằm ngoài danh sách được duyệt cần được coi là bất thường và gửi cảnh báo để xác minh.

---

## 6. Các cách tương tác với AWS và dấu vết trong log

Dù người dùng sử dụng công cụ nào, mọi thao tác tương tác với AWS đều được chuyển đổi thành HTTPS REST API call tới control plane:

| Phương thức | Bản chất | User-Agent thường thấy trong log | Lưu ý cho SOC |
|---|---|---|---|
| **AWS Management Console** | Giao diện web qua trình duyệt, gọi API nội bộ bằng session cookie. | Chuỗi User-Agent của trình duyệt thông thường kèm `signin.amazonaws.com` | Thường có thông tin đăng nhập console, trạng thái MFA trong `sessionContext`. |
| **AWS CLI** | Dòng lệnh qua terminal, dùng access key tĩnh hoặc STS token. | `aws-cli/2.x ... Python/3.x ...` | Phổ biến trong tác vụ quản trị hàng ngày, CI/CD hoặc hành vi của attacker. |
| **AWS SDK** (Boto3, Go, Java...) | Thư viện lập trình gọi API từ code ứng dụng. | `Boto3/1.x ... Python/3.x ...` | Cần lưu ý nếu một IAM user thông thường đột ngột xuất hiện User-Agent là SDK gọi các API xóa tài nguyên. |
| **Công cụ pentest / scanning** | Các công cụ tự động (Pacu, ScoutSuite, CloudFox, Kali). | Chứa chuỗi nhận diện như `Kali`, `python-requests`, `curl` hoặc chuỗi bị sửa vụng | Dấu hiệu rõ ràng của hoạt động do thám hoặc pentest cần kiểm tra ngay. |

---

## 7. Bề mặt tấn công của 7 dịch vụ AWS cốt lõi

### 7.1 IAM (Identity and Access Management)
- **Root account:** Tài khoản có toàn quyền tuyệt đối trên tenant. Bất kỳ thao tác nào từ `userIdentity.type = "Root"` đều cần được cảnh báo mức độ cao.
- **Access key tĩnh vs credential tạm thời:** Access key tĩnh (`AKIA...`) tồn tại vĩnh viễn cho đến khi bị xóa, rất dễ bị lộ lọt qua commit mã nguồn. Credential tạm thời do STS sinh ra (`ASIA...`) có thời hạn ngắn hơn nên an toàn hơn.

### 7.2 Amazon EC2 và EBS
- **Security group:** Tường lửa cấp instance hoạt động theo cơ chế stateful (cho phép chiều vào thì tự động mở chiều ra tương ứng). Lỗi phổ biến nhất là mở cổng quản trị `0.0.0.0/0` cho SSH (port 22) hoặc RDP (port 3389).
- **EBS snapshot:** Bản sao lưu ổ đĩa. Kẻ tấn công có thể dùng `ModifySnapshotAttribute` để chia sẻ snapshot ổ đĩa sang tài khoản khác nhằm trích xuất dữ liệu mà không cần đụng vào máy chủ đang chạy.

### 7.3 Amazon S3
- **Quyền truy cập kết hợp:** S3 chịu sự kiểm soát đồng thời từ IAM policy, bucket policy và ACL.
- **Rủi ro rò rỉ dữ liệu:** Bucket policy cấp quyền đọc công khai cho mọi người (`Principal: "*"`).
- **Rủi ro phá hoại dữ liệu:** Kẻ tấn công gán policy deny toàn bộ quyền quản trị hoặc kích hoạt lifecycle rule để xóa nhanh các version dữ liệu cũ.

### 7.4 Amazon VPC
- **Public vs private subnet:** Public subnet có route trỏ ra Internet Gateway. Private subnet không nhận kết nối trực tiếp từ Internet mà phải đi ra ngoài qua NAT Gateway.
- **NACL:** Tường lửa cấp subnet hoạt động stateless (phải cấu hình riêng cả chiều vào và chiều ra). Thường dùng để chặn nhanh dải IP độc hại khi có sự cố.
- **VPC Peering:** Đường nối giữa 2 VPC. Nếu subnet dev kết nối peering sang subnet prod mà không kiểm soát chặt chẽ, kẻ tấn công có thể dùng làm bàn đạp di chuyển ngang.

### 7.5 Amazon RDS
- **Publicly Accessible:** Cờ cấu hình nếu bật `Yes` sẽ cấp IP public cho database và cho phép kết nối trực tiếp từ Internet nếu security group mở cổng tương ứng.
- **Database snapshot:** Tương tự EBS, snapshot database có thể bị chia sẻ trái phép sang tài khoản ngoài.

### 7.6 AWS Lambda
- **Execution role:** Quyền hạn được gán cho hàm Lambda khi chạy. Nếu role này có quyền quản trị quá rộng, kẻ tấn công khai thác được code injection trong hàm sẽ chiếm luôn quyền của role đó trên tài khoản AWS.
- **Persistence:** Kẻ tấn công có thể sửa code của hàm Lambda hiện có hoặc tạo thêm trigger mới để duy trì quyền truy cập.

### 7.7 Amazon CloudWatch và CloudTrail
- **CloudTrail:** Ghi nhận toàn bộ API call. Kẻ tấn công thường tìm cách gọi `StopLogging` hoặc `DeleteTrail` đầu tiên để che giấu dấu vết.
- **CloudWatch Logs:** Nơi tập trung log ứng dụng và máy chủ. Lượng log đột ngột giảm mạnh có thể là dấu hiệu agent ghi log trên máy chủ đã bị tắt.

---

## 8. Khái niệm định danh và quản trị tài khoản

- **ARN (Amazon Resource Name):** Định danh duy nhất toàn cầu cho tài nguyên AWS theo cấu trúc chuẩn:
  ```
  arn:partition:service:region:account-id:resource-type/resource-id
  ```
  Ví dụ: `arn:aws:s3:::company-finance-bucket/reports.xlsx` hoặc `arn:aws:iam::123456789012:role/AppRole`
- **Account ID:** Dãy 12 chữ số đại diện cho một tài khoản AWS. Trong điều tra, SOC cần xác định một hành động đến từ tài khoản nội bộ hay từ một account lạ bên ngoài.
- **AWS Organizations:** Dịch vụ quản lý nhiều tài khoản theo mô hình cây thư mục, cho phép áp dụng Service Control Policy (SCP) từ trên xuống.
- **Tagging:** Gắn nhãn tài nguyên (`Environment: Prod`, `Owner: SecOps`). Tài nguyên lạ xuất hiện mà không có tag chuẩn thường là dấu hiệu nghi vấn.

---

## 9. Hướng dẫn dựng lab và bài tập thực hành

Các bước thực hành trên tài khoản AWS Free Tier cá nhân:

- [ ] **Bật MFA cho root:** Đăng nhập tài khoản root, bật MFA qua ứng dụng xác thực, không tạo access key tĩnh cho root.
- [ ] **Tạo IAM admin user và budget alert:** Tạo user riêng có quyền quản trị để làm việc, đặt budget alert ở mức $1 để nhận email ngay khi có chi phí phát sinh ngoài ý muốn.
- [ ] **Khám phá CloudTrail Event History:** Tạo một S3 bucket rồi xóa bucket đó. Mở CloudTrail console vào mục Event history, tìm sự kiện `CreateBucket` và `DeleteBucket`, xem định dạng JSON của các trường `sourceIPAddress`, `userIdentity` và `userAgent`.
- [ ] **Cài đặt AWS CLI:** Chạy lệnh `aws sts get-caller-identity` để xác nhận danh tính và account ID hiện tại.

---

## 10. Tự kiểm tra và câu hỏi tình huống

1. Khi một máy chủ web EC2 bị nghi ngờ có mã độc, tại sao một trong những bước đầu tiên của SOC là kiểm tra IAM role gắn trên instance đó thay vì chỉ quét file trên đĩa?
2. Nếu doanh nghiệp chỉ đặt hệ thống tại Singapore (`ap-southeast-1`), việc xuất hiện các lệnh `RunInstances` thành công tại `af-south-1` (Nam Phi) gợi ý nguy cơ gì và cần xử lý thế nào?
3. Tại sao khi điều tra sự cố trên Amazon RDS, SOC không thể SSH vào máy chủ để lấy memory dump như đối với EC2, và dữ liệu điều tra lúc này sẽ lấy từ đâu?
