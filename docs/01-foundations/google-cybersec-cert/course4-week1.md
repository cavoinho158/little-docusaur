---
title: "Tools of the Trade: Linux and SQL - Week 1"
sidebar_position: 19
---

Hi mọi người, hôm nay cùng tôi và cậu ấy học nhanh nội dung Course 4 - module 1 nhé `(´｡• ᵕ •｡)`. Lần này khóa học sẽ tập trung vào hệ điều hành Linux và ở cuối sẽ là về SQL, mọi người đã biết đến những kiến thức này chưa nhỉ?

> _"Đến bây giờ đã đi được nữa chặng đường rồi, thời gian trôi nhanh quá đi `(・・;)ゞ`."- Tôi trầm ngâm_ /
> _"Vì thời gian không chờ ai nên chúng ta mới phải liên tục cố gắng đó." - Cậu ấy nói_

## So sánh các hệ điều hành phổ biến 💻

### Windows và macOS 🪟🍎

- **Windows**: Ra mắt năm 1985, là hệ điều hành **đóng mã nguồn** (closed-source).
- **macOS**: Ra mắt năm 1984, là hệ điều hành **một phần mã nguồn mở** (partially open-source), với một số thành phần như kernel được mở.

### Linux 🐧

- Ra mắt năm 1991, Linux là hệ điều hành **hoàn toàn mã nguồn mở** (open-source), cho phép cộng đồng phát triển cùng cộng tác.
- Linux rất quan trọng trong ngành bảo mật, với nhiều bản phân phối (distributions) được thiết kế riêng cho bảo mật.

### ChromeOS 🌐

- Ra mắt năm 2011, ChromeOS là hệ điều hành **một phần mã nguồn mở**, dựa trên Chromium OS (hoàn toàn mã nguồn mở).
- Thường được sử dụng trong lĩnh vực giáo dục.

### Android và iOS 📱

- **Android**: Ra mắt năm 2008, là hệ điều hành **mã nguồn mở**.
- **iOS**: Ra mắt năm 2007, là hệ điều hành **một phần mã nguồn mở**.
- Cả hai đều được sử dụng chủ yếu trên thiết bị di động như điện thoại, máy tính bảng, và đồng hồ thông minh.

## Hệ điều hành và lỗ hổng bảo mật 🛡️

### Hệ điều hành cũ (Legacy OS) ⚠️

- **Legacy OS** là hệ điều hành đã lỗi thời nhưng vẫn được sử dụng.
- **Rủi ro**: Không còn được hỗ trợ hoặc cập nhật, dễ bị tấn công bởi các mối đe dọa mới.
- **Nguyên nhân**: Một số tổ chức vẫn sử dụng vì phần mềm của họ không tương thích với hệ điều hành mới hơn.

### Các lỗ hổng khác 🕳️

- Ngay cả khi hệ điều hành được cập nhật, chúng vẫn có thể bị tấn công.
- **Các nguồn tham khảo về lỗ hổng**:
  - [Microsoft Security Response Center (MSRC)](https://msrc.microsoft.com/update-guide/vulnerability): Các lỗ hổng đã biết ảnh hưởng đến sản phẩm và dịch vụ của Microsoft.
  - [Apple Security Updates](https://support.apple.com/en-us/HT201222): Cập nhật bảo mật cho macOS, iOS và các sản phẩm khác của Apple.
  - [CVE Report for Ubuntu](https://ubuntu.com/security/cves): Các lỗ hổng đã biết ảnh hưởng đến Ubuntu (một bản phân phối của Linux).
  - [Google Cloud Security Bulletin](https://cloud.google.com/support/bulletins): Các lỗ hổng đã biết ảnh hưởng đến sản phẩm và dịch vụ của Google Cloud.

### Kết luận 📌

- **Windows**, **macOS**, **Linux**, **ChromeOS**, **Android**, và **iOS** là các hệ điều hành phổ biến.
- Các nhà phân tích bảo mật cần hiểu rõ về các lỗ hổng ảnh hưởng đến hệ điều hành.
- Đặc biệt chú ý đến **hệ điều hành cũ** (legacy OS) vì chúng tiềm ẩn nhiều rủi ro bảo mật.

---

## Hệ điều hành: Cầu nối giữa người dùng và phần cứng 🌐💻

### Quá trình khởi động máy tính 🔌

- Khi bạn bật máy tính, một trong hai vi mạch sẽ được kích hoạt: **BIOS** hoặc **UEFI**.
  - **BIOS** (Basic Input/Output System): Phổ biến trên các hệ thống cũ.
  - **UEFI** (Unified Extensible Firmware Interface): Thay thế BIOS trên các hệ thống hiện đại, cung cấp tính năng bảo mật nâng cao.
- Cả hai vi mạch đều thực hiện các lệnh khởi động, bao gồm kiểm tra phần cứng và kích hoạt **bootloader** (chương trình khởi động hệ điều hành).
- Sau khi hệ điều hành khởi động xong, máy tính sẵn sàng sử dụng.

### Quy trình hoàn thành một tác vụ 🛠️

![process](<./img/course4-mod1(1).png>)

Quá trình hoàn thành một tác vụ trên máy tính bao gồm 4 bước chính:

1. 👤 Người dùng bắt đầu quá trình bằng cách thực hiện một yêu cầu, ví dụ: mở tài liệu, tính toán, hoặc tải xuống tệp.

2. 📱 Ứng dụng là phần mềm mà người dùng tương tác để thực hiện tác vụ. Ví dụ: trình duyệt web, phần mềm soạn thảo văn bản, hoặc máy tính.

3. 🖥️ Hệ điều hành nhận yêu cầu từ ứng dụng, diễn giải yêu cầu và chuyển nó đến các thành phần phần cứng phù hợp.

4. 💾 Phần cứng xử lý yêu cầu và trả kết quả về hệ điều hành. Ví dụ:

- **CPU**: Xử lý tính toán.
- **Ổ cứng**: Lưu trữ dữ liệu.
- Kết quả được gửi lại ứng dụng và hiển thị cho người dùng.

### "Phía sau cánh gà" 🎭

- Hệ điều hành giống như **nhà bếp trong nhà hàng**: Bạn không nhìn thấy quá trình chế biến, nhưng nó rất quan trọng để bạn nhận được món ăn đúng yêu cầu.
- Tương tự, hệ điều hành làm việc "ẩn" phía sau để kết nối ứng dụng và phần cứng, giúp người dùng hoàn thành tác vụ.

### Ví dụ: Tải xuống tệp từ trình duyệt 🌐📥

1. **Người dùng**: Nhấp vào nút tải xuống tệp trên trình duyệt.
2. **Ứng dụng**: Trình duyệt gửi yêu cầu tải xuống đến hệ điều hành.
3. **Hệ điều hành**: Chuyển yêu cầu đến phần cứng phù hợp (ví dụ: card mạng).
4. **Phần cứng**: Bắt đầu tải xuống tệp và gửi thông tin về hệ điều hành.
5. **Kết quả**: Trình duyệt thông báo cho người dùng khi tệp đã tải xuống xong.

### Kết luận 📌

- Hệ điều hành là thành phần **thiết yếu** trong việc kết nối ứng dụng và phần cứng, giúp người dùng hoàn thành tác vụ.
- Mặc dù hoạt động "ẩn" phía sau, hệ điều hành đóng vai trò quan trọng trong mọi hoạt động của máy tính.

---

## Công nghệ ảo hóa và máy ảo 🖥️🌐

### Máy ảo (Virtual Machine - VM) là gì? 🤔

![virtual machine](<./img/course4-mod1(2).jpg>)

- **Máy ảo** là một phiên bản ảo của máy tính vật lý, được tạo ra bằng phần mềm.
- **Ảo hóa (Virtualization)**: Quá trình sử dụng phần mềm để tạo ra các phiên bản ảo của các máy vật lý.
- Máy ảo không sử dụng phần cứng vật lý chuyên dụng mà sử dụng phần cứng ảo (virtual CPU, virtual storage, v.v.).
- Một máy tính vật lý có thể chạy nhiều máy ảo cùng lúc bằng cách chia sẻ tài nguyên (ví dụ: RAM, CPU).

### Lợi ích của máy ảo 🚀

1. Bảo mật 🔒

   - Máy ảo cung cấp một môi trường **cô lập** (sandbox) trên máy chủ vật lý.
   - Các máy ảo được cách ly với máy chủ và các máy ảo khác, giúp tăng cường bảo mật.
   - Ví dụ: Nếu một máy ảo bị nhiễm mã độc, nó có thể được xử lý mà không ảnh hưởng đến các máy khác.
   - **Lưu ý**: Mã độc vẫn có thể thoát khỏi môi trường ảo hóa và truy cập máy chủ vật lý, vì vậy không nên hoàn toàn tin tưởng vào hệ thống ảo hóa.

2. Hiệu quả ⚡

   - Máy ảo giúp tăng hiệu quả và tiện lợi trong các tác vụ bảo mật.
   - Bạn có thể mở nhiều máy ảo cùng lúc và chuyển đổi dễ dàng giữa chúng.
   - **Ví dụ**: Giống như một chiếc xe buýt chở nhiều người cùng lúc, một máy vật lý có thể chạy nhiều máy ảo, tiết kiệm tài nguyên so với việc sử dụng nhiều máy vật lý riêng lẻ.

### Quản lý máy ảo 🛠️

- **Hypervisor**: Phần mềm quản lý máy ảo, kết nối phần cứng ảo và vật lý, đồng thời phân bổ tài nguyên máy chủ cho các máy ảo.
- **KVM (Kernel-based Virtual Machine)**: Một hypervisor mã nguồn mở, được tích hợp sẵn trong nhân Linux, cho phép tạo máy ảo trên bất kỳ máy tính nào chạy hệ điều hành Linux.

### Các hình thức ảo hóa khác 🌐

- Ngoài máy ảo, còn có các hình thức ảo hóa khác:
  - **Máy chủ ảo (Virtual Servers)**: Tạo nhiều máy chủ ảo từ một máy chủ vật lý.
  - **Mạng ảo (Virtual Networks)**: Sử dụng hiệu quả phần cứng mạng vật lý.

### Kết luận 📌

- Máy ảo là phiên bản ảo của máy tính vật lý và là một phần quan trọng của công nghệ ảo hóa.
- **Lợi ích**: Cô lập mã độc, tăng hiệu quả và tiện lợi trong các tác vụ bảo mật.
- **Rủi ro**: Mã độc có thể thoát khỏi môi trường ảo hóa, vì vậy cần thận trọng khi sử dụng.

---

## Giao diện dòng lệnh (CLI) vs. Giao diện đồ họa (GUI) 🖥️💻

![GUI_CLI](<./img/course4-mod1(3).png>)

- Khái niệm cơ bản 📚
  - **GUI (Graphical User Interface)**: Giao diện người dùng đồ họa, sử dụng biểu tượng và hình ảnh để tương tác với máy tính.
  - **CLI (Command-Line Interface)**: Giao diện dòng lệnh, sử dụng các lệnh văn bản để tương tác với máy tính.

### So sánh GUI và CLI 🔄

| **Tiêu chí**  | **GUI (Giao diện đồ họa)** 🖼️                          | **CLI (Giao diện dòng lệnh)** ⚙️                               |
| ------------- | ------------------------------------------------------ | -------------------------------------------------------------- |
| **Hiển thị**  | Hiển thị đồ họa, biểu tượng, và các nút bấm trực quan. | Chỉ hiển thị văn bản, giống như các dòng mã.                   |
| **Chức năng** | Chỉ cho phép thực hiện một yêu cầu tại một thời điểm.  | Cho phép thực hiện nhiều yêu cầu cùng lúc, giúp tăng hiệu quả. |

### Lợi ích của CLI trong bảo mật 🔒

1. Hiệu quả cao ⚡

   - CLI nhanh hơn khi bạn đã quen thuộc với các lệnh.
   - Ví dụ: Tạo nhiều tệp cùng lúc trong CLI nhanh hơn so với việc lặp lại các bước trong GUI.

2. Tệp lịch sử (History File) 📜

   - CLI lưu lại lịch sử các lệnh đã thực thi, giúp:
     - Kiểm tra lại các bước đã thực hiện khi xử lý sự cố.
     - Theo dõi hành động của kẻ tấn công nếu hệ thống bị xâm nhập.

### Kết luận 📌

- **GUI** phù hợp với người dùng mới vì dễ sử dụng và trực quan.
- **CLI** được ưa chuộng trong lĩnh vực bảo mật vì:
  - Xử lý nhiều tác vụ cùng lúc.
  - Có tệp lịch sử giúp kiểm tra và theo dõi hành động.
- Các nhà phân tích bảo mật cần thành thạo cả hai giao diện để linh hoạt trong công việc.
