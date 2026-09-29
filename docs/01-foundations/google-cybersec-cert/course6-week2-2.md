---
title: "Sound the Alarm: Detection and Response - Week 2(2)"
sidebar_position: 32
---

## ✅ Lợi ích của tài liệu (Documentation Benefits)

1. **Minh bạch (Transparency)**

   - Góp phần tuân thủ quy định, hỗ trợ điều tra, đáp ứng yêu cầu bảo hiểm và pháp lý.
   - Ví dụ: **Chain of custody** – ghi lại quá trình kiểm soát bằng chứng trong suốt vòng đời sự cố.

2. **Tiêu chuẩn hóa (Standardization)**

   - Giúp cải tiến liên tục, đào tạo nhân viên mới, và đảm bảo sự nhất quán trong quy trình.
   - Ví dụ: **Incident response plan** – kế hoạch phản ứng sự cố được chuẩn hóa giúp xử lý sự cố theo quy trình định sẵn.

3. **Rõ ràng (Clarity)**
   - Giúp người đọc dễ hiểu, dễ hành động.
   - Ví dụ: Nêu rõ lý do xử lý alert – tại sao alert bị đóng hoặc được nâng cấp.

## 🛠️ Các nguyên tắc thực hành tốt nhất (Best Practices)

- **Hiểu đối tượng đọc (Know your audience):**

  - Viết tài liệu phù hợp với người nhận – người quản lý SOC có thể hiểu kỹ thuật, nhưng CEO thì không.

- **Ngắn gọn, súc tích (Be concise):**

  - Nêu rõ mục tiêu ngay từ đầu, ví dụ: **Executive summary** giúp nắm bắt nhanh kết quả chính trong báo cáo.

- **Cập nhật thường xuyên (Update regularly):**
  - Do mối đe dọa luôn thay đổi, tài liệu phải được rà soát và cập nhật định kỳ sau các sự cố để cải tiến quy trình.

### 📌 **Key takeaway:**

Là một nhà phân tích bảo mật, bạn cần thành thạo kỹ năng tạo và duy trì tài liệu hiệu quả để đảm bảo minh bạch, nhất quán và rõ ràng trong mọi quy trình bảo mật.

---

## Triage Process

### ✅ Triage là gì?

- Triage là quá trình đánh giá và **ưu tiên xử lý các cảnh báo bảo mật** dựa trên mức độ nghiêm trọng hoặc khẩn cấp.
- Mục tiêu là đảm bảo các sự cố nghiêm trọng nhất được xử lý trước để **giảm thiểu tác động tiêu cực** đến tổ chức.

### 🔄 3 bước của quá trình Triage

1. **Nhận và đánh giá cảnh báo (Receive and assess)**

   - Tiếp nhận cảnh báo từ hệ thống như IDS.
   - Xác minh cảnh báo có hợp lệ không:
     - Có phải là **false positive** không?
     - Cảnh báo này từng xảy ra chưa? Đã xử lý thế nào?
     - Có liên quan đến lỗ hổng đã biết không?
     - Mức độ nghiêm trọng của cảnh báo là gì?

2. **Ưu tiên xử lý (Assign priority)**

   - Phân loại mức độ ưu tiên dựa trên:
     - **Tác động chức năng (Functional impact):** Ví dụ như ransomware làm gián đoạn dịch vụ.
     - **Tác động thông tin (Information impact):** Ví dụ như đánh cắp dữ liệu nhạy cảm.
     - **Khả năng phục hồi (Recoverability):** Có thể khôi phục được không? Có đáng để đầu tư xử lý không?

3. **Thu thập và phân tích (Collect and analyze)**
   - Thu thập bằng chứng, phân tích sâu, tra cứu thêm nếu cần.
   - Tài liệu hóa quá trình điều tra.
   - Có thể **chuyển cấp** cho analyst cấp cao hơn nếu sự cố phức tạp.

### 🛡️ Lợi ích của Triage

- **Quản lý tài nguyên hiệu quả:** Tập trung vào cảnh báo quan trọng, tránh lãng phí thời gian vào các cảnh báo không đáng lo.
- **Tiếp cận chuẩn hóa:** Giúp xử lý sự cố theo quy trình thống nhất (playbook), đảm bảo mọi cảnh báo đều được đánh giá đúng cách.

### 📌 Key takeaway

Triage là kỹ năng cốt lõi của chuyên gia bảo mật giúp xử lý cảnh báo một cách hiệu quả, nhanh chóng, và đúng trọng tâm để giảm thiểu tác động đến tổ chức.

---

## Business continuity considerations

### ✅ Business Continuity Planning (BCP) là gì?

- Là kế hoạch duy trì hoạt động kinh doanh trong và sau khi xảy ra sự cố nghiêm trọng.
- Mục tiêu: **Đảm bảo các chức năng quan trọng của doanh nghiệp vẫn tiếp tục hoạt động** hoặc được khôi phục nhanh chóng sau sự cố.
- Khác với **Disaster Recovery Plan (DRP)** – tập trung vào khôi phục hệ thống CNTT sau thiên tai hoặc sự cố lớn.

### ⚠️ Vì sao BCP quan trọng?

- Các sự cố bảo mật như **ransomware** có thể:
  - Làm gián đoạn nghiêm trọng hệ thống và dịch vụ.
  - Gây tổn thất về **pháp lý, tài chính và uy tín**.
  - Ảnh hưởng đến an toàn công cộng nếu nhắm vào **hạ tầng quan trọng** (như y tế, năng lượng).

➡️ **BCP giúp giảm thiểu sự gián đoạn và duy trì các dịch vụ thiết yếu** ngay cả khi có sự cố lớn.

### 🔄 Chiến lược phục hồi (Recovery strategies)

#### 🔹 **Site Resilience – khả năng chống chịu hệ thống**

Tổ chức thiết kế hệ thống để có thể **tiếp tục cung cấp dịch vụ ngay cả khi bị gián đoạn**:

- **Hot site**: Bản sao hoàn chỉnh, sẵn sàng hoạt động **ngay lập tức**.
- **Warm site**: Có cấu hình sẵn nhưng **cần thời gian để khởi động**.
- **Cold site**: Chỉ có hạ tầng cơ bản, **chưa thể sử dụng ngay**, cần thiết lập thêm.

### 📌 Key takeaway

**BCP là công cụ chiến lược** giúp tổ chức **giảm thiểu tác động của sự cố bảo mật** và nhanh chóng **khôi phục hoạt động**. Dù nhân viên cấp thấp không trực tiếp xây dựng BCP, nhưng cần hiểu rõ vai trò và giá trị của nó trong bảo vệ liên tục hoạt động doanh nghiệp.
