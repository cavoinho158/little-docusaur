---
title: "ClamAV Testing on Windows and Kali"
sidebar_position: 5
---

## Cài đặt và thử nghiệm ClamAV trên Windows

### Cài đặt ClamAV trên Windows

1. **Tải ClamAV**: Truy cập trang chính thức của [ClamAV](https://www.clamav.net/downloads) để tải phiên bản phù hợp cho Windows. Lưu ý, Windows Defender có thể cảnh báo về file tải xuống do phần mềm không được ký bởi Microsoft.
2. **Giải nén và cài đặt**: Giải nén file .zip hoặc chạy file .msi để tiến hành cài đặt ClamAV.
3. **Cấu hình**:
   - Di chuyển đến thư mục cài đặt ClamAV (thường là `C:\Program Files\ClamAV`).
   - Vào thư mục `conf_examples`, sao chép hai file cấu hình (`freshclam.conf.sample` và `clamd.conf.sample`) ra thư mục gốc của ClamAV.
   - Đổi tên hai file này bằng cách xóa phần đuôi `.sample`.
   - Mở hai file và xóa hoặc comment dòng "Example", sau đó lưu lại.
4. **Cập nhật cơ sở dữ liệu**: Mở Terminal với quyền Administrator, di chuyển đến thư mục cài đặt ClamAV và chạy lệnh `freshclam` để cập nhật cơ sở dữ liệu virus.

   ![freshclam windows](./img/Screenshot%202025-03-05%20141014.png)

### Thử nghiệm ClamAV trên Windows

Để kiểm tra hiệu quả của ClamAV, bạn có thể sử dụng file kiểm thử EICAR, một file giả lập virus được sử dụng rộng rãi trong việc kiểm tra các phần mềm diệt virus.

1. **Tải file EICAR**: Truy cập trang web chính thức của [EICAR](https://www.eicar.org/download-anti-malware-testfile/) để tải file kiểm thử.
2. **Quét file**:
   - Mở Terminal với quyền Administrator và di chuyển đến thư mục cài đặt ClamAV.
   - Chạy lệnh `clamscan [option] /path/to/eicar/file` để quét thư mục chứa file EICAR.
3. **Kiểm tra kết quả**: Nếu ClamAV hoạt động chính xác, nó sẽ phát hiện và thông báo về file EICAR như một mối đe dọa.

   ![Kết quả quét EICAR](./img/Screenshot%202025-03-05%20131258.png)

Để việc kiểm thử có hiệu quả, tôi sẽ tải một số mã độc thật đã được ghi nhận từ MalwareBazaar, như vậy việc thử nghiệm sẽ có nguồn dữ liệu phong phú và mang tính thực tế hơn. Sau khi tải về bạn có thể giải nén với password _infected_. Các file thử nghiệm bao gồm:

:::warning[CAUTION!]

You are about to download a malware sample. By clicking on "download", you declare that you have understood what you are doing and that MalwareBazaar can not to be held accountable for any damage caused by downloading this malware sample!

:::

- [`file_type:doc`](https://bazaar.abuse.ch/download/88ad296056a6be66969f1e5ce6694398944804a39d8465b42e0af73c5af12cb0/)
- [`file_type:pdf`](https://bazaar.abuse.ch/download/5e303fd9317236b55429aedd5c7aa133f3ea9dd2a50402930c50c5fbcc6e27e6/)
- [`file_type:sh`](https://bazaar.abuse.ch/download/bcefd8b11cd18d2e829285287e13ef29e50adbe986c737ebb5f69a01f616a9ba/)
- [`file_type:PE`](https://bazaar.abuse.ch/download/0c3b276a645b603ef249cb10dca8e6c20d446713464598e873f9613724cbdc90/)

![MalBazaar files on Windows](./img/Screenshot%202025-03-06%20161232.png)

![Result MalwareBazaar Windows](./img/Screenshot%202025-03-06%20161023.png)

### Kết luận

ClamAV dễ dàng phát hiện các file test của EICAR nhưng khi gặp các file độc hại thực tế từ MalwareBazaar thì ClamAV chỉ phát hiện được 2 file là .dll và .pdf. Có lẽ do database của ClamAV không có dữ liệu hoặc các file độc hại đó có thể bypass được ClamAV.

---

## Cài đặt và thử nghiệm ClamAV trên Kali

### Cài đặt ClamAV trên Kali

1. **Cập nhật package manager**: Mở Terminal, cập nhật `apt` với lệnh `sudo apt update`.
2. **Tải và cài đặt**:

   ```bash
   sudo apt install clamav-daemon
   clamscan --version #Thử xem cài đặt thành công hay không
   sudo apt install clamtk #Phiên bản GUI của ClamAV
   ```

3. **Cập nhật cơ sở dữ liệu**

   ```bash
   sudo systemctl stop clamav-freshclam
   sudo freshclam
   sudo systemctl start clamav-freshclam
   sudo systemctl status clamav-freshclam
   ```

![freshclam Kali](./img/Screenshot%20From%202025-03-05%2011-30-36.png)

### Thử nghiệm ClamAV trên Kali

Tương tự như Windows, chúng ta vẫn sẽ sử dụng EICAR test file và các file từ MalwareBazaar Database.

1. **Tải file EICAR**: Truy cập trang web chính thức của [EICAR](https://www.eicar.org/download-anti-malware-testfile/) để tải file kiểm thử.
2. **Kiểm thử**: Mở Terminal và gõ lệnh `clamscan [option] /path/to/eicar/file` để quét thư mục chứa file EICAR. Ở đây tôi đã thêm `--infected` để kết quả chỉ hiển thị những file xem là độc hại, `--remove` để xóa những file infected và `--recursive` để quét đệ quy thư mục.

3. **Kiểm tra kết quả**: ClamAV vẫn phát hiện được các file EICAR tương tự như trên Windows.
   ![Quét EICAR kali](./img/Screenshot%20From%202025-03-05%2011-43-51.png)

Để tránh trùng lặp các kết quả trước của MalwareBazaar, ở Kali tôi sẽ sử dụng những file khác để kiểm tra hiệu suất của ClamAV:

- [`file_type:doc`](https://bazaar.abuse.ch/download/baf263ee8dac244ac1fd201a83ba9ed2c3b21eed8b445e8928729d8ca2680889/)
- [`file_type:pdf`](https://bazaar.abuse.ch/download/23e20d630a8fd12600c2811d8f179f0e408dcb3e82600456db74cbf93a66e70f/)
- [`file_type:sh`](https://bazaar.abuse.ch/download/e6044c88efe786c5f75dc8e870723c6041c95626c509fb4bbde2311c03a3cb72/)
- [`file_type:ELF`](https://bazaar.abuse.ch/download/9d35531bac103531c80055dbebc3dd3f94799f7578db7676f4c2e9341fd2349c/)

![Malware Bazaar files](./img/Screenshot%202025-03-06%20154939.png)

![Result MalwareBazaar Kali](./img/Screenshot%202025-03-06%20154713.png)

### Kết luận

Với các file test EICAR thì ClamAV vẫn phát hiện tốt tương tự trên Windows, nhưng đối với các file từ MalwareBazaar thì lần này ClamAV chỉ phát hiện được các file .zip là đáng ngờ, còn các file sau khi giải nén chỉ phát hiện được file .elf.

- GUI với Clamtk: Bên cạnh đó thì ClamAV cũng có phiên GUI thân thiện và dễ sử dụng.
  ![img4](./img/Screenshot%202025-03-05%20235738.png)
  ![img5](./img/Screenshot%202025-03-05%20235935.png)
  ![img6](./img/Screenshot%202025-03-06%20000310.png)

> To be continued...
