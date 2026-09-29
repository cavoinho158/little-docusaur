---
title: ClamAV - Open-source Anti-virus
sidebar-position: 1
---

Tuần mới vui vẻ nha mọi người. Hôm nay thì cậu ấy ngủ quên mất :v còn mỗi tôi thôi nên không có học khóa của Google mà là tìm hiểu về hệ thống bảo vệ cho thiết bị đầu cuối. Series này sẽ là nội dung quá trình chúng tôi tìm hiểu và thực hiện các phương pháp bảo mật thiết bị đầu cuối để làm đồ án chuyên ngành. Well, tôi không biết nói gì và nhiều cảm xúc như cậu ấy được, nhưng dù sao cũng cám ơn mọi người đã dành thời gian theo dõi.

## 1. Tổng quan về ClamAV

ClamAV được phát triển bởi Cisco Systems và sử dụng ngôn ngữ lập trình C/C++ với giấy phép GPL v2. Nó chủ yếu được triển khai trên các hệ thống Linux/Unix, nhưng cũng hỗ trợ Windows và macOS. ClamAV được biết đến nhờ:

- **Mã nguồn mở**: Dễ dàng tùy chỉnh và tích hợp.
- **Ứng dụng rộng rãi**: Sử dụng trong máy chủ email, hệ thống tường lửa và các giải pháp phát hiện mã độc tự động.

## 2. Các thành phần và cách hoạt động

ClamAV bao gồm 4 thành phần chính:

- **Clamscan**: Công cụ quét virus theo yêu cầu.
- **Clamd**: Dịch vụ quét virus chạy nền, cung cấp khả năng quét nhanh hơn.
- **Freshclam**: Công cụ cập nhật cơ sở dữ liệu chữ ký virus.
- **Libclamav**: Thư viện cho phép tích hợp chức năng quét vào các ứng dụng khác.

### 2.1. Phát hiện dựa trên Signature Database

ClamAV sử dụng các tập tin chữ ký (signature) (như `daily.cvd`, `main.cvd`, `bytecode.cvd`) để so sánh nội dung của file với các mẫu virus đã biết. Nếu một phần file trùng với một mẫu có sẵn, file đó được đánh dấu là độc hại. Cập nhật chữ ký được thực hiện thông qua `freshclam` mỗi 48h.

### 2.2. Phân tích dựa trên Heuristic Analysis

Heuristic Analysis giúp phát hiện các phần mềm độc hại chưa có trong cơ sở dữ liệu chữ ký bằng cách tìm kiếm các mẫu hành vi đáng ngờ. Một số kỹ thuật bao gồm:

- **Kiểm tra entropy**: Các file mã hóa hoặc bị nén quá mức thường là dấu hiệu của malware (đặc biệt là ransomware).
- **Phân tích mã thực thi**: Nếu một tệp thực thi (PE, ELF) chứa mã khả nghi như gọi API nguy hiểm (CreateRemoteThread, VirtualAlloc, WriteProcessMemory), ClamAV có thể gắn cờ cảnh báo.
- **Phát hiện macro độc hại**: Kiểm tra trong file tài liệu (Word, Excel) để tìm macro có khả năng thực thi mã độc.
- **Sandbox emulation (giới hạn)**: ClamAV có thể kiểm tra một số mẫu mã và giả lập hành vi để phát hiện nếu file cố gắng thực thi lệnh nguy hiểm.

<details>
<summary>Chú thích về Entropy</summary>

INFO
Entropy là một chỉ số quan trọng trong phân tích heuristic, đo lường mức độ ngẫu nhiên của dữ liệu trong file. Công thức Shannon entropy được sử dụng như sau:

$$
H(X) = - \sum_{i=1}^{n} P(x_i) \log_2 P(x_i)
$$

- **Ý nghĩa**:

  - Giá trị entropy thấp (gần 0) biểu thị dữ liệu có tính dự đoán cao (ví dụ: file văn bản thuần túy).
  - Giá trị entropy cao (gần 8 đối với file nhị phân 8-bit) thường cho thấy dữ liệu đã bị nén, mã hóa, hoặc được obfuscate—điều này thường xuất hiện ở các file malware đóng gói (packed malware).

- **Ứng dụng trong ClamAV**: Phân tích entropy giúp ClamAV nhận diện các file có cấu trúc bất thường, từ đó cảnh báo về khả năng là malware hoặc ransomware.

</details>

### 2.3. Phân tích PE và ELF file

ClamAV hỗ trợ kiểm tra file thực thi trên Windows (`.exe`, `.dll`), Linux (`.elf`), và macOS (`.mach-o`).
Một số yếu tố quan trọng:

- **Kiểm tra chữ ký file**: Nếu file PE bị chỉnh sửa hoặc có dấu hiệu packing (UPX, Themida), ClamAV có thể cảnh báo.
- **Kiểm tra Import Table**: Malware thường sử dụng API nguy hiểm như `LoadLibrary`, `GetProcAddress`.
- **Phân tích mã opcode**: Một số mã assembly có thể bị đánh dấu là nguy hiểm.

## 3. Ứng dụng và tích hợp

Ngoài việc quét các file theo yêu cầu, ClamAV còn được sử dụng trong các kịch bản tự động như:

- **Quét USB khi cắm vào máy**: Mặc định, ClamAV không quét tự động thiết bị USB, nhưng có thể được tích hợp với các công cụ tự động như `udev` trên Linux hoặc Task Scheduler trên Windows để thực hiện quét ngay khi USB được kết nối.
- **Quét Email Gateway** để phát hiện malware trong email trước khi gửi đến người dùng hoặc quét file được tải lên Web Server để tránh mã độc.
- **Tích hợp vào SIEM/SOC**: ClamAV có thể được kết hợp với các hệ thống giám sát bảo mật để phân tích và xử lý sự cố nhanh chóng.

## 4. Kết luận

ClamAV là một giải pháp antivirus mã nguồn mở với khả năng phát hiện malware thông qua nhiều cơ chế:

- **So sánh chữ ký virus** từ cơ sở dữ liệu được cập nhật thường xuyên.
- **Heuristic analysis** kết hợp với phân tích cấu trúc file và tính toán **entropy** để nhận diện các file có hành vi đáng ngờ.
- **Ứng dụng bảo vệ email gateway, Web server** giúp ngăn chặn mã độc từ các file đính kèm email hoặc mã độc ẩn trong file upload, bảo vệ người dùng và trang web khỏi các mối đe dọa tiềm ẩn.
- **Phát hiện mã độc trong USB**, nhưng Windows Defender tốt hơn với khả năng real-time và không cần cấu hình phức tạp.

Nhược điểm:

- Không mạnh bằng các AV thương mại trong phát hiện ransomware (tỉ lệ chính xác khoảng 75-80%).
- Quá trình quét chậm hơn một số AV khác.

---

## Tài Liệu Tham Khảo

- [Trang chủ ClamAV](https://www.clamav.net/)
- [Hướng dẫn và tài liệu ClamAV trên GitHub](https://github.com/Cisco-Talos/clamav)
- [Diễn đàn thảo luận về ClamAV](https://www.clamav.net/documents)
