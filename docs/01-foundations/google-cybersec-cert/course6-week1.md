---
title: "Sound the Alarm: Detection and Response - Week 1"
sidebar_position: 29
---

Chào mừng mọi người đến với Course 6 nhé! Tôi đã trở lại rồi đây ~ `(～￣▽￣)～`

Cả tuần rồi chỉ có mỗi cậu ấy làm việc nên thành ra hiệu suất giảm đi phân nửa luôn, hic `X﹏X)`. Trên trường thì cũng bắt đầu giao đồ án môn học rồi, những ngày tiếp theo sẽ bận rộn lắm đây. Mọi người sắp xếp thời gian thế nào để đảm bảo tiến độ đồ án đồng đều vậy, có thể chia sẻ cho chúng tôi không?

> _"Thời gian để hoàn thành khóa học của Google này sắp bị thay thành đồ án môn học rồi." - Cậu ấy thở dài_ \
> _"Ừm, tiếc là có nhiều vấn đề xảy ra quá nên không đảm bảo tiến độ được." - Tôi nói_ \
> _"Chắc giảm bớt thời gian nấu ăn và giải trí của cậu thôi nhỉ?" - Cậu ấy đề xuất_ \
> _"Nhưng như vậy thì cậu cũng quá tải đó." - Tôi nhắc nhở_

## Các vai trò trong phản ứng sự cố 🛡️👥

Phản ứng sự cố là một quá trình phức tạp đòi hỏi sự phối hợp chặt chẽ giữa các thành viên trong nhóm. Dưới đây là tóm tắt về các vai trò chính trong **Computer Security Incident Response Team (CSIRT)** và **Security Operations Center (SOC)**, giúp bạn hiểu rõ hơn về cách các tổ chức quản lý và phản ứng với các sự cố bảo mật.

### CSIRT: Nhóm phản ứng sự cố bảo mật máy tính 🚨

CSIRT là một nhóm chuyên gia bảo mật được đào tạo để quản lý và phản ứng với các sự cố. Các vai trò chính trong CSIRT bao gồm:

1. **Security analyst (Chuyên viên phân tích bảo mật)**:

   - **Nhiệm vụ**: Giám sát môi trường, phân tích và phân loại cảnh báo, điều tra nguyên nhân gốc rễ, và giải quyết hoặc chuyển tiếp cảnh báo.
   - **Ví dụ**: Phát hiện và báo cáo các mối đe dọa nghiêm trọng.

2. **Technical lead (Trưởng nhóm kỹ thuật)**:

   - **Nhiệm vụ**: Quản lý các khía cạnh kỹ thuật của quá trình phản ứng sự cố, bao gồm xác định nguyên nhân, tạo chiến lược ngăn chặn, loại bỏ và phục hồi.
   - **Ví dụ**: Áp dụng các bản vá phần mềm hoặc cập nhật hệ thống.

3. **Incident coordinator (Điều phối viên sự cố)**:
   - **Nhiệm vụ**: Phối hợp với các phòng ban khác để đảm bảo thông tin được truyền đạt rõ ràng và mọi người đều biết tình trạng sự cố.
   - **Ví dụ**: Làm việc với bộ phận nhân sự hoặc pháp lý để xử lý các vấn đề liên quan.

### SOC: Trung tâm điều hành bảo mật 🖥️

SOC là đơn vị chuyên trách giám sát mạng, hệ thống và thiết bị để phát hiện các mối đe dọa bảo mật. Các vai trò trong SOC bao gồm:

1. **Tier 1 SOC analyst (Chuyên viên phân tích SOC cấp 1)**:

   - **Nhiệm vụ**: Giám sát, xem xét và ưu tiên các cảnh báo dựa trên mức độ nghiêm trọng, tạo và đóng các ticket cảnh báo.
   - **Ví dụ**: Chuyển tiếp các cảnh báo quan trọng đến cấp 2.

2. **Tier 2 SOC analyst (Chuyên viên phân tích SOC cấp 2)**:

   - **Nhiệm vụ**: Điều tra sâu hơn các ticket được chuyển tiếp từ cấp 1, cấu hình và tinh chỉnh các công cụ bảo mật.
   - **Ví dụ**: Phân tích các cuộc tấn công phức tạp hơn.

3. **Tier 3 SOC lead (Trưởng nhóm SOC cấp 3)**:

   - **Nhiệm vụ**: Quản lý hoạt động của nhóm, thực hiện các kỹ thuật phát hiện tiên tiến như phân tích mã độc và điều tra pháp y.
   - **Ví dụ**: Báo cáo kết quả điều tra cho quản lý SOC.

4. **SOC manager (Quản lý SOC)**:
   - **Nhiệm vụ**: Tuyển dụng, đào tạo và đánh giá thành viên SOC, tạo các chỉ số hiệu suất và phát triển báo cáo liên quan đến sự cố.
   - **Ví dụ**: Truyền đạt các phát hiện cho ban lãnh đạo.

### Các vai trò khác 🔍

- **Forensic investigators (Điều tra viên pháp y)**: Thu thập, bảo quản và phân tích bằng chứng kỹ thuật số liên quan đến sự cố.
- **Threat hunters (Thợ săn mối đe dọa)**: Phát hiện, phân tích và phòng thủ trước các mối đe dọa bảo mật mới và tiên tiến.

### Kết luận 📌

- **CSIRT** và **SOC** là hai nhóm quan trọng trong việc phản ứng và quản lý sự cố bảo mật.
- Hiểu rõ vai trò và trách nhiệm của từng thành viên giúp tăng cường hiệu quả phản ứng sự cố.
- Các công cụ và quy trình được sử dụng trong SOC và CSIRT giúp đảm bảo an ninh mạng và giảm thiểu thiệt hại từ các cuộc tấn công.

### Tài nguyên tham khảo 📚

- [The security operations ecosystem](https://chronicle.security/blog/posts/soc-ecosystem-infographic/)
- [Cyber career pathways tool](https://niccs.cisa.gov/workforce-development/cyber-career-pathways-tool)
- [Detection and Response](https://www.youtube.com/watch?v=QZ0cpBocl3c) at Google: Episode 2 of the [Hacking Google](https://www.youtube.com/playlist?list=PL590L5WQmH8dsxxz7ooJAgmijwOz0lh2H) series of videos

---

## Tổng quan về công cụ phát hiện mối đe dọa

### Tại sao cần công cụ phát hiện?

Công cụ phát hiện hoạt động giống như hệ thống bảo vệ nhà ở, giúp **giám sát và cảnh báo** về các hoạt động đáng ngờ trong hệ thống mạng hoặc thiết bị. Khi phát hiện dấu hiệu xâm nhập, công cụ sẽ **tạo cảnh báo** để chuyên gia bảo mật điều tra và ngăn chặn.

## **So sánh IDS, IPS và EDR**

| **Tính năng**                   | **IDS** (Hệ thống phát hiện xâm nhập) | **IPS** (Hệ thống ngăn chặn xâm nhập) | **EDR** (Phát hiện & phản hồi đầu cuối) |
| ------------------------------- | ------------------------------------- | ------------------------------------- | --------------------------------------- |
| **Phát hiện hoạt động độc hại** | ✅                                    | ✅                                    | ✅                                      |
| **Ngăn chặn xâm nhập**          | ❌                                    | ✅                                    | ✅                                      |
| **Ghi log hoạt động**           | ✅                                    | ✅                                    | ✅                                      |
| **Tạo cảnh báo**                | ✅                                    | ✅                                    | ✅                                      |
| **Phân tích hành vi**           | ❌                                    | ❌                                    | ✅                                      |

### Hệ thống phát hiện xâm nhập (IDS)

📌 **Chức năng:**

- Giám sát và **phát hiện hoạt động bất thường**, gửi cảnh báo.
- **Không có khả năng ngăn chặn** cuộc tấn công, chỉ thông báo cho chuyên gia bảo mật.

📌 **Ví dụ:** Zeek, Suricata, Snort, Sagan.

📌 **Các loại cảnh báo:**  
✅ **True positive**: Cảnh báo đúng về một cuộc tấn công thật.  
✅ **True negative**: Không có mối đe dọa và cũng không có cảnh báo.  
❌ **False positive**: Cảnh báo sai (tốn thời gian điều tra).  
❌ **False negative**: Không phát hiện được cuộc tấn công (rất nguy hiểm).

### Hệ thống ngăn chặn xâm nhập (IPS)

📌 **Chức năng:**

- Giống IDS nhưng **có thể ngăn chặn tấn công** bằng cách chặn lưu lượng độc hại.
- Ví dụ: Chặn một IP đáng ngờ đang tấn công hệ thống.

📌 **Ví dụ:** Suricata, Snort, Sagan (có cả chức năng IDS và IPS).

### Công cụ phát hiện và phản hồi đầu cuối (EDR)

📌 **Chức năng:**

- **Giám sát và phân tích hành vi** trên thiết bị đầu cuối (laptop, điện thoại, server...).
- Tích hợp **trí tuệ nhân tạo (AI) & machine learning (ML)** để phát hiện và chặn tấn công.
- Có thể **tự động ngăn chặn** các tiến trình đáng ngờ mà không cần con người can thiệp.

📌 **Ví dụ:** Open EDR, Bitdefender EDR, FortiEDR.

## Kết luận

Công cụ phát hiện giúp tổ chức **nhận thức và kiểm soát** các mối đe dọa an ninh mạng. IDS chỉ **phát hiện**, IPS có thể **ngăn chặn**, còn EDR chuyên về **phát hiện và phản hồi trên thiết bị đầu cuối**. Hiểu rõ sự khác biệt giữa các công cụ này giúp chuyên gia bảo mật triển khai chiến lược bảo vệ hệ thống hiệu quả. 🚀

---

## Tổng quan về công nghệ SIEM

### SIEM là gì?

SIEM (Security Information and Event Management) là công cụ giúp **thu thập, phân tích và giám sát** dữ liệu log để phát hiện và phản hồi các sự kiện bảo mật trong tổ chức.

📌 **Lợi ích của SIEM:**  
✔️ **Truy cập dữ liệu sự kiện:** Thu thập thông tin từ nhiều nguồn như firewall, server, router...  
✔️ **Giám sát, phát hiện và cảnh báo:** Phát hiện hoạt động độc hại theo quy tắc đã thiết lập.  
✔️ **Lưu trữ log:** Lưu trữ dữ liệu lịch sử để phục vụ điều tra sau này.

![siem illu](<./img/course6-mod1(1).png>)

## Quy trình hoạt động của SIEM

🔹 **1. Thu thập & tổng hợp dữ liệu (Collect & Aggregate Data)**

- Nhận log từ nhiều nguồn khác nhau.
- Hợp nhất dữ liệu vào một nơi duy nhất, giúp dễ dàng phân tích.
- **Parsing**: Trích xuất và gán nhãn dữ liệu để dễ đọc hơn.

🔹 **2. Chuẩn hóa dữ liệu (Normalize Data)**

- Mỗi hệ thống ghi log theo một định dạng khác nhau.
- SIEM chuyển đổi dữ liệu về định dạng chung để có thể xử lý hiệu quả.

🔹 **3. Phân tích dữ liệu (Analyze Data)**

- Áp dụng quy tắc và điều kiện để phát hiện dấu hiệu tấn công.
- **Tương quan dữ liệu (Correlation):** So sánh nhiều sự kiện để tìm ra mẫu tấn công.
- Tạo cảnh báo nếu phát hiện hoạt động đáng ngờ.

## Các công cụ SIEM phổ biến

- **Splunk**
- **IBM QRadar**
- **AlienVault OSSIM**
- **Chronicle**
- **Elastic Security**
- **Exabeam**
- **LogRhythm**

## Kết luận

SIEM là công cụ mạnh mẽ giúp tổ chức **giám sát, phát hiện và phản hồi** các mối đe dọa an ninh mạng. Việc hiểu rõ quy trình hoạt động của SIEM sẽ giúp bạn **phân tích log, phát hiện mối đe dọa và hỗ trợ xử lý sự cố bảo mật hiệu quả**. 🚀
