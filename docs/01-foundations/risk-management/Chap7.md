---
title: Chương 7 - Quản lý Rủi ro theo FMEA (Failure Mode and Effects Analysis)
sidebar_position: 8
---

## 1. Khái quát chung

**FMEA** là một phương pháp hệ thống nhằm:

- Phát hiện sớm các **phương thức lỗi (Failure Modes)** trong quy trình, sản phẩm, hệ thống, dịch vụ...
- Đánh giá tác động, khả năng xảy ra, khả năng phát hiện của từng lỗi
- Từ đó, đề xuất biện pháp ứng phó và **giảm thiểu chi phí khắc phục**

FMEA có tác dụng:

- Cải thiện chất lượng sản phẩm/dịch vụ
- Ngăn ngừa rủi ro và sự cố từ trước
- Tăng tính tin cậy của hệ thống

---

## 2. Thuật ngữ chính trong FMEA

| Thuật ngữ                | Định nghĩa                                                                   |
| ------------------------ | ---------------------------------------------------------------------------- |
| **Failure Mode**         | Cách thức mà đối tượng có thể bị lỗi (một rủi ro chính là một failure mode)  |
| **Severity (S)**         | Mức độ nghiêm trọng khi lỗi xảy ra. Chấm theo thang 1-5 hoặc 1-10            |
| **Occurrence (O)**       | Xác suất lỗi xảy ra. Càng cao thì càng dễ bị. Thang 1-5 hoặc 1-10            |
| **Detectability (D)**    | Khả năng phát hiện lỗi trước khi đến người dùng. **Giá trị cao = dễ bỏ sót** |
| **RPN**                  | Risk Priority Number = S x O x D                                             |
| **Threshold RPN**        | Ngưỡng RPN cho phép. Trên ngưỡng phải có biện pháp ứng phó.                  |
| **Action Priority (AP)** | Đối chiếu theo độ nghiêm trọng trước, sau đó mới đến xác suất và phát hiện   |

---

## 3. Các bước triển khai FMEA

1. **Chọn quy trình, hệ thống, dịch vụ cần đánh giá**
2. **Tập hợp nhóm chuyên gia** (kỹ thuật, vận hành, ATTT...)
3. **Chuẩn bị biểu mẫu FMEA** (excel, phần mềm)
4. **Xác định phạm vi** đánh giá: input, output, ranh giới, mục tiêu
5. **Liệt kê các failure mode** (lỗi tiềm ẩn)
6. **Phân tích nguyên nhân, hậu quả, kiểm soát hiện hữu**
7. **Đánh giá S, O, D cho từng rủi ro**
8. **Tính toán RPN** = S x O x D
9. **So sánh RPN với ngưỡng (Threshold)**
10. **Lập kế hoạch hành động (AP - Action Plan)** cho rủi ro cao

:::warning

RPN > 80 (nếu thang 1-10) hoặc > 25 (nếu thang 1-5) => Cần xử lý ngay

:::

---

## 4. FMECA là gì?

**FMECA** = FMEA + Criticality Analysis

- Thêm yếu tố **Criticality** để xếp hạng rủi ro một cách định lượng
- Được dùng nhiều trong hàng không, quân đội, y tế
- Ngày nay do FMEA đã mở rộng nên FMECA ít cóng dụng hơn

---

## 5. Lập kế hoạch hành động sau khi đánh giá FMEA

- Tập trung vào các failure mode có RPN hoặc AP cao
- Xác định chiến lược QLRR tương ứng: Tránh, Giảm, Chuyển giao, Chấp nhận
- Thiết lập KRI theo dõi hiệu quả sau xử lý

> "Hãy phát hiện nguy cơ trước khi nguy cơ trở thành sự cố."
