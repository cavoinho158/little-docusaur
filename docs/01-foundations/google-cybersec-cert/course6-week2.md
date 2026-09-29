---
title: "Sound the Alarm: Detection and Response - Week 2"
sidebar_position: 31
---

Đoán xem ai trở lại sau cả gần 2 tuần vắng bóng đây :v à thì tất nhiên là tôi và cậu ấy rồi, hoặc một hacker nào đó đang ẩn trong trang web này `(⊙_⊙)?` Ehe, tuần rồi đồ án gặp trục trặc với bài tập khó quá nên thành ra không viết blog được. Tuần này chúng tôi xong Course 6 rồi đó, còn 2 Course nữa là xong khóa học này, hi vọng là sẽ kịp trước 15/5 để mà còn ghi vào CV. `(●ˇ∀ˇ●)`

Mọi người thấy course này nội dung có thú vị không? Tôi và cậu ấy khá thích vì có nhiều Activity để thử làm việc thực tế của SOC, ngoài ra còn được giới thiệu và thử nghiệm hệ thống Splunk của Google nữa. Hi vọng là mọi người sẽ luôn tìm được hứng thú trong việc học của mình để không ngừng cố gắng nhé.

## 🔍 Cybersecurity incident detection methods

Các nhà phân tích bảo mật sử dụng nhiều phương pháp để phát hiện các mối đe dọa trong giai đoạn **Detection and Analysis** của chu trình phản ứng sự cố.

### 1. Công cụ phát hiện

- **IDS (Intrusion Detection System)**: Phát hiện xâm nhập và gửi cảnh báo.
- **SIEM (Security Information and Event Management)**: Thu thập, phân tích dữ liệu bảo mật.

> ⚠️ Thách thức: Nếu công cụ không được cấu hình đúng, có thể bỏ sót các hành vi đáng ngờ.

### 2. Threat Hunting (Săn lùng mối đe dọa)

- Phát hiện chủ động các mối đe dọa tiềm ẩn chưa bị công cụ tự động phát hiện.
- Phù hợp với các mối đe dọa phức tạp như **fileless malware** – phần mềm độc hại không lưu trên ổ đĩa mà hoạt động trong bộ nhớ.

> 🔎 Người thực hiện được gọi là **threat hunters**, họ kết hợp kiến thức, chỉ báo tấn công (IOC/IOA), trí tuệ nhân tạo và machine learning.

### 3. Threat Intelligence (Tình báo mối đe dọa)

- Cung cấp thông tin về các mối đe dọa mới và hiện tại.
- Nguồn thông tin:
  - **Báo cáo ngành** (tactics, techniques, procedures – TTP)
  - **Cảnh báo từ chính phủ**
  - **Threat data feeds**: Các chỉ báo như địa chỉ IP, domain, file hash, đặc biệt hữu ích với **APT (Advanced Persistent Threats)**

> 🔧 Có thể dùng **Threat Intelligence Platform (TIP)** để tập trung và phân tích dữ liệu threat intelligence.

### 4. Cyber Deception (Lừa dối mạng)

- **Honeypots**: Hệ thống mồi nhử được thiết kế để hấp dẫn hacker và ghi lại hành vi của họ.
  - Ví dụ: Tập tin giả “Client Credit Card Information - 2022” để dụ kẻ tấn công truy cập, từ đó cảnh báo hệ thống.

### 5. Kết luận

Kết hợp nhiều phương pháp phát hiện (công cụ, phân tích con người, tình báo, lừa dối) giúp tổ chức phát hiện mối đe dọa hiệu quả hơn trong bối cảnh mối đe dọa liên tục tiến hóa.

### 🔗 Tài nguyên tham khảo

- [The ThreatHunting Project – Thư viện thông tin về threat hunting](https://www.threathunting.net/)
- [Threat Analysis Group – Nghiên cứu hacker do nhà nước hậu thuẫn](https://blog.google/threat-analysis-group/)

---

## **Giám sát liên tục CI/CD** và **phát hiện mối đe dọa tự động**

### Mục tiêu chính

Giám sát liên tục CI/CD giúp bảo vệ chuỗi cung ứng phần mềm khỏi các mối đe dọa bằng cách tự động phát hiện hoạt động bất thường và **Indicator of Compromise (IoC)** – chỉ dấu cho thấy có thể đã bị tấn công.

### Tự động phát hiện mối đe dọa

CI/CD giúp phát hành phần mềm nhanh hơn nhưng cũng dễ bị tấn công. Do đó, việc giám sát liên tục và tự động là cực kỳ quan trọng để phát hiện hành vi bất thường trong quá trình build, code, hoặc triển khai.

### Các loại IoC phổ biến trong CI/CD

- **Thay đổi mã trái phép**: từ người không có quyền, vào thời điểm bất thường hoặc với nội dung đáng ngờ.
- **Triển khai đáng ngờ**: vào thời gian lạ, hệ thống không được phê duyệt, hoặc từ tài khoản không hợp lệ.
- **Phụ thuộc bị tấn công**: thêm thư viện bất ngờ, CVE chưa được vá, tải về từ nguồn không uy tín.
- **Thực thi pipeline bất thường**: pipeline thất bại bất thường, thời gian chạy dài, thay đổi thứ tự các bước.
- **Cố gắng truy cập secrets**: lộ secrets trong mã, hoặc truy cập trái phép trong pipeline.

### Phương pháp giám sát hiệu quả

- **Ghi log và kiểm toán chi tiết**: bao gồm logs của pipeline, commit, truy cập, và triển khai.
- **Tích hợp SIEM**: dùng công nghệ machine learning để phát hiện bất thường ở quy mô lớn và cảnh báo theo quy tắc đã định.
- **Cảnh báo thời gian thực**: báo ngay khi có sự cố bất thường (code đáng ngờ, thất bại liên tục, truy cập secrets, traffic bất thường).
- **Giám sát hiệu năng**: phát hiện gián tiếp các IoC từ dấu hiệu tấn công (IoA) như hệ thống chậm bất thường.
- **Quét lỗ hổng liên tục**: phát hiện và vá các lỗ hổng trong công cụ CI/CD, plugin hoặc container.

### Lợi ích

- Phát hiện sớm và phản hồi nhanh với sự cố.
- Giảm thiểu thiệt hại và ngăn chặn truy cập lâu dài của kẻ tấn công.
- Cải thiện hiểu biết về kỹ thuật tấn công, phục vụ công tác threat hunting.

### Tài nguyên tham khảo

- [Optimizing logs for a more effective CI/CD pipeline](https://coralogix.com/blog/optimizing-logs-for-a-more-effective-ci-cd-pipeline/)
- [Streamline Your CI/CD: Hands-on Anomaly Detection with AI](https://www.latesttechinsights.com/2024/04/streamline-your-cicd-hands-on-anomaly.html)
- [What is CI/CD? - Continuous Integration, Delivery, and Deployment](https://www.threatintelligence.com/blog/continuous-integration-continuous-delivery)
- [CI/CD & DevOps Pipelines: An Introduction](https://www.splunk.com/en_us/blog/learn/ci-cd-devops-pipeline.html)

---

## 🔍 Indicators of Compromise (IoCs) và Indicators of Attack (IoAs)

- **IoCs** là những bằng chứng quan sát được cho thấy có thể đã xảy ra sự cố an ninh, ví dụ như tên file độc hại hoặc địa chỉ IP đáng ngờ.
- **IoAs** là chuỗi các hành vi cho thấy một cuộc tấn công đang diễn ra hoặc có khả năng xảy ra, tập trung vào hành vi, phương pháp và ý đồ của kẻ tấn công.

**So sánh:**

- 🔸 IoC → xác định _ai_ và _cái gì_ đã xảy ra (sự kiện quá khứ).
- 🔸 IoA → xác định _tại sao_ và _bằng cách nào_ một cuộc tấn công đang diễn ra (sự kiện hiện tại).

⚠️ Lưu ý: Một IoC không phải lúc nào cũng đồng nghĩa với một sự cố bảo mật – đôi khi đó chỉ là lỗi người dùng hoặc hệ thống.

### 🔺 Pyramid of Pain – Kim tự tháp nỗi đau của hacker

![pyramid of pain](<./img/course6-mod3(1).png>)

**Pyramid of Pain** là mô hình do chuyên gia David J. Bianco đề xuất nhằm phân loại các IoCs theo mức độ gây khó khăn (đau đớn) cho kẻ tấn công khi bị chặn:

🔽 **Càng lên cao – Càng đau đớn và khó thay thế:**

| Mức độ    | Loại IoC                                   | Mô tả                                                                                        |
| --------- | ------------------------------------------ | -------------------------------------------------------------------------------------------- |
| Cao nhất  | **TTPs** (Tactics, Techniques, Procedures) | Hành vi chiến thuật, kỹ thuật, quy trình – khó phát hiện, nhưng cực kỳ hiệu quả nếu bị chặn. |
|           | **Tools**                                  | Công cụ tấn công như John the Ripper. Hacker phải thay đổi phương pháp nếu bị phát hiện.     |
|           | **Host Artifacts**                         | Bằng chứng trên thiết bị như tên file do malware tạo ra.                                     |
|           | **Network Artifacts**                      | Dấu hiệu trên mạng như User-Agent bất thường.                                                |
|           | **Domain Names**                           | Ví dụ: domain độc hại do hacker kiểm soát.                                                   |
|           | **IP Addresses**                           | Có thể thay đổi dễ dàng – chặn ít gây khó khăn cho hacker.                                   |
| Thấp nhất | **Hash Values**                            | Mã hash file độc hại – dễ bị thay thế.                                                       |

🔗 **Nguồn tham khảo**:  
[Pyramid of Pain – David J. Bianco](http://detect-respond.blogspot.com/2013/03/the-pyramid-of-pain.html)

### ✅ Tóm lại

- **IoCs và IoAs** giúp phát hiện và phản ứng nhanh với sự cố an ninh.
- **Pyramid of Pain** cung cấp góc nhìn chiến lược để ưu tiên loại IoC cần tập trung phát hiện và chặn đứng – càng gần đỉnh kim tự tháp, tác động phòng thủ càng mạnh.

---

## Phân tích IoC với công cụ điều tra

### Thêm ngữ cảnh cho cuộc điều tra

- **IoC** là bằng chứng cho thấy có thể đã xảy ra sự cố bảo mật.
- Chỉ tập trung vào một IoC (như một địa chỉ IP) giống như chỉ nhìn một phần của bức tranh và có thể bỏ lỡ toàn cảnh.
- **Threat intelligence** cung cấp thông tin ngữ cảnh giúp xây dựng cái nhìn toàn diện và hỗ trợ phản ứng hiệu quả hơn.

[Một phụ nữ chỉ quan sát một phần của bức tranh](<./img/course6-mod3(2).png>)
[Một phụ nữ quan sát toàn bộ bức tranh con voi](<./img/course6-mod3(3).png>)

### Sức mạnh của crowdsourcing (nguồn lực cộng đồng)

- Trước đây, phản ứng với sự cố thường là cô lập, nhưng giờ đây có thể **chia sẻ thông tin mối đe dọa** với cộng đồng.
- **Crowdsourcing** giúp nhiều tổ chức cùng nhau chống lại các mối đe dọa bằng cách chia sẻ dữ liệu như file độc hại, địa chỉ IP, URL,...
- Các tổ chức tiêu biểu:
  - **ISACs (Information Sharing and Analysis Centers)**: chia sẻ dữ liệu mối đe dọa theo ngành nghề (y tế, năng lượng,…)
  - **OSINT (Open-source intelligence)**: thu thập dữ liệu từ nguồn công khai

[Hacker tấn công thành công 5 tổ chức](<./img/course6-mod3(4).png>)
[Nhờ crowdsourcing, hacker bị chặn](<./img/course6-mod3(5).png>)

### VirusTotal

[VirusTotal website](https://www.virustotal.com/gui/home)

- Phân tích file, URL, domain, địa chỉ IP đáng ngờ.
- Tạo báo cáo cung cấp ngữ cảnh và liên kết giữa các IoC.

[Giao diện trang chủ VirusTotal](<./img/course6-mod3(6).png>)
[Giao diện báo cáo tổng quan](<./img/course6-mod3(7).png>)

**Các tab trong báo cáo:**

- **Detection**: Các nhà cung cấp bảo mật đánh giá IoC.
- **Details**: Thông tin tĩnh như hash, loại file, thời gian tạo,...
- **Relations**: Các IoC liên quan như domain, IP, URL,...
- **Behavior**: Hoạt động khi thực thi trong môi trường sandbox.
- **Community**: Nhận xét của cộng đồng VirusTotal.

**Chú ý:** Dữ liệu tải lên VirusTotal sẽ **công khai** – không nên tải dữ liệu cá nhân.

### Các công cụ điều tra khác

- 🔗 [Jotti’s malware scan](https://virusscan.jotti.org/): Quét file bằng nhiều phần mềm chống virus.
- 🔗 [Urlscan.io](https://urlscan.io/): Phân tích chi tiết URL.
- 🔗 [MalwareBazaar](https://bazaar.abuse.ch/browse/): Kho lưu trữ mẫu malware phục vụ nghiên cứu.

### ✅ Tóm tắt

- Phân tích IoC không chỉ dừng ở việc phát hiện, mà cần mở rộng ngữ cảnh để phản ứng hiệu quả hơn.
- Crowdsourcing và threat intelligence giúp tăng cường năng lực phòng thủ tập thể.
- Công cụ như VirusTotal và các nền tảng OSINT là tài nguyên quý báu để phân tích, điều tra và chia sẻ dữ liệu IoC.
