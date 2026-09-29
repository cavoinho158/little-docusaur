---
title: "Tools of the Trade: Linux and SQL - Week 2 (3)"
sidebar_position: 22
---

## Quản lý quyền trong Linux 🔐🐧

Trong phần này, chúng ta sẽ tìm hiểu về cách quản lý quyền truy cập file và thư mục trong Linux, cùng với các lệnh giúp bạn hiển thị và thay đổi các quyền này. Đặc biệt, chúng ta sẽ xem xét một ví dụ về cách áp dụng **nguyên tắc đặc quyền tối thiểu** (principle of least privilege) trong thực tế.

### Hiểu về quyền truy cập 🔍

Trong Linux, quyền truy cập được biểu diễn bằng một chuỗi 10 ký tự. Các quyền bao gồm:

- **read (r)**: Cho phép đọc nội dung file hoặc liệt kê nội dung thư mục.
- **write (w)**: Cho phép chỉnh sửa nội dung file hoặc tạo file mới trong thư mục.
- **execute (x)**: Cho phép thực thi file (nếu là file chương trình) hoặc truy cập vào thư mục.

Các quyền này được áp dụng cho ba loại người dùng:

- **user (u)**: Chủ sở hữu của file.
- **group (g)**: Nhóm người dùng mà chủ sở hữu thuộc về.
- **other (o)**: Tất cả người dùng khác trên hệ thống.

### Kiểm tra quyền hiện có 🕵️

Bạn có thể sử dụng lệnh `ls` để kiểm tra quyền truy cập của các file và thư mục. Một số tùy chọn hữu ích của `ls` bao gồm:

- **`ls -a`**: Hiển thị các file ẩn (bắt đầu bằng dấu `.`).
- **`ls -l`**: Hiển thị chi tiết quyền truy cập, tên chủ sở hữu, nhóm, kích thước file và thời gian chỉnh sửa.
- **`ls -la`**: Kết hợp cả hai tùy chọn trên, hiển thị quyền truy cập và cả file ẩn.

### Thay đổi quyền với `chmod` 🔧

Nguyên tắc đặc quyền tối thiểu yêu cầu chỉ cấp quyền truy cập tối thiểu cần thiết để thực hiện công việc. Lệnh `chmod` giúp bạn thay đổi quyền truy cập trên file và thư mục.

- **Cú pháp**: `chmod <cách_thay_đổi> <tên_file_hoặc_thư_mục>`

  Ví dụ:

  - Thêm quyền đọc, ghi và thực thi cho tất cả người dùng:  
    `chmod u+rwx,g+rwx,o+rwx login_sessions.txt`
  - Xóa tất cả quyền:  
    `chmod u-rwx,g-rwx,o-rwx login_sessions.txt`
  - Gán quyền chỉ đọc cho tất cả người dùng:  
    `chmod u=r,g=r,o=r login_sessions.txt`

#### Các ký tự trong `chmod`

| Ký tự | Mô tả                                      |
| ----- | ------------------------------------------ |
| u     | Thay đổi quyền cho chủ sở hữu (user)       |
| g     | Thay đổi quyền cho nhóm (group)            |
| o     | Thay đổi quyền cho người dùng khác (other) |
| +     | Thêm quyền                                 |
| -     | Xóa quyền                                  |
| =     | Gán quyền chính xác như được chỉ định      |

### Ví dụ thực tế: Áp dụng nguyên tắc đặc quyền tối thiểu 🛡️

Giả sử bạn có file `bonuses.txt` trong thư mục `compensation`. Chủ sở hữu file là `hrrep1` thuộc nhóm `hr`. Bạn cần đảm bảo chỉ `hrrep1` có quyền truy cập file này, trong khi các thành viên khác trong nhóm `hr` không cần quyền này.

- **Bước 1**: Kiểm tra quyền hiện tại bằng `ls -l`.  
  Kết quả: `-rw-rw----` (nhóm `hr` có quyền đọc và ghi).

- **Bước 2**: Sử dụng `chmod` để xóa quyền đọc và ghi của nhóm:  
  `chmod g-rw bonuses.txt`

Kết quả: Chỉ `hrrep1` có quyền truy cập file, đảm bảo nguyên tắc đặc quyền tối thiểu.

### Kết luận 📌

Quản lý quyền truy cập là một phần quan trọng trong công việc của nhà phân tích bảo mật. Sử dụng `ls -l` và `ls -la` giúp bạn kiểm tra quyền truy cập, trong khi `chmod` cho phép bạn thay đổi quyền để đảm bảo chúng tuân thủ nguyên tắc đặc quyền tối thiểu.

---

## Sử dụng `sudo` một cách có trách nhiệm 🔐🐧

Trong phần này, chúng ta sẽ tiếp tục khám phá cách quản lý xác thực (authentication) và ủy quyền (authorization) trong Linux bằng các lệnh như `sudo`, `useradd`, `userdel`, `usermod`, và `chown`. Đặc biệt, chúng ta sẽ tìm hiểu cách sử dụng `sudo` một cách có trách nhiệm để tránh các rủi ro bảo mật.

### Tại sao nên sử dụng `sudo`? 🛡️

- **`sudo`** cho phép người dùng thực thi lệnh với quyền cao hơn mà không cần đăng nhập với tư cách **root user**.
- **Root user** có toàn quyền trên hệ thống, nhưng việc sử dụng tài khoản root có thể gây ra rủi ro bảo mật nếu bị tấn công. Ngoài ra, hệ thống không thể theo dõi ai đã thực thi lệnh khi sử dụng root.
- **`sudo`** giúp giảm thiểu rủi ro bằng cách chỉ cấp quyền cao hơn tạm thời và ghi lại lịch sử lệnh.

### Sử dụng `sudo` một cách an toàn 🚨

- **Chỉ cấp quyền `sudo` cho những người dùng thực sự cần thiết**: Giống như việc chỉ cấp chìa khóa tổng cho nhân viên cần thiết trong khách sạn, chỉ những người dùng cần thực hiện các tác vụ quản trị mới nên có quyền `sudo`.
- **Hạn chế sử dụng `sudo` với các lệnh không cần thiết**: Chỉ sử dụng `sudo` khi thực sự cần thiết để tránh các lỗi không mong muốn hoặc tạo ra lỗ hổng bảo mật.

### Quản lý người dùng và quyền sở hữu file 🛠️

1. **`useradd`**: Thêm người dùng mới

   - **Cú pháp cơ bản**: `sudo useradd <tên_người_dùng>`
   - **Tùy chọn**:
     - `-g`: Chỉ định nhóm chính (primary group) cho người dùng. Ví dụ: `sudo useradd -g security fgarcia`.
     - `-G`: Thêm người dùng vào các nhóm bổ sung (supplemental groups). Ví dụ: `sudo useradd -G finance,admin fgarcia`.

2. **`usermod`**: Chỉnh sửa thông tin người dùng

   - **Cú pháp cơ bản**: `sudo usermod <tùy_chọn> <tên_người_dùng>`
   - **Tùy chọn**:
     - `-g`: Thay đổi nhóm chính. Ví dụ: `sudo usermod -g executive fgarcia`.
     - `-G`: Thêm người dùng vào nhóm bổ sung (kết hợp với `-a` để không ghi đè nhóm hiện có). Ví dụ: `sudo usermod -a -G marketing fgarcia`.
     - `-d`: Thay đổi thư mục home của người dùng. Ví dụ: `sudo usermod -d /home/garcia_f fgarcia`.
     - `-L`: Khóa tài khoản người dùng, ngăn họ đăng nhập.

3. **`userdel`**: Xóa người dùng

   - **Cú pháp cơ bản**: `sudo userdel <tên_người_dùng>`
   - **Tùy chọn**:
     - `-r`: Xóa cả thư mục home của người dùng. Ví dụ: `sudo userdel -r fgarcia`.

4. **`chown`**: Thay đổi quyền sở hữu file/thư mục

   - **Cú pháp cơ bản**: `sudo chown <tên_người_dùng>:<tên_nhóm> <tên_file>`
   - **Ví dụ**:
     - Thay đổi chủ sở hữu file: `sudo chown fgarcia access.txt`.
     - Thay đổi nhóm sở hữu file: `sudo chown :security access.txt`.

### Kết luận 📌

- **Xác thực (authentication)** là quá trình xác minh danh tính người dùng, trong khi **ủy quyền (authorization)** là quá trình xác định quyền truy cập của họ.
- **`sudo`** là công cụ mạnh mẽ giúp bạn thực hiện các tác vụ quản trị mà không cần đăng nhập với tư cách root.
- Các lệnh như `useradd`, `usermod`, `userdel`, và `chown` giúp bạn quản lý người dùng và quyền sở hữu file một cách hiệu quả, đảm bảo tuân thủ nguyên tắc bảo mật.

---

## Tài nguyên hỗ trợ Linux 🌐🐧

### Cộng đồng Linux toàn cầu 🌍

- **Cộng đồng trực tuyến**: Linux có một cộng đồng người dùng lớn trên toàn cầu. Bạn có thể dễ dàng tìm kiếm câu trả lời cho các vấn đề của mình thông qua các diễn đàn, blog, và trang hỏi đáp.
- **Unix and Linux Stack Exchange**: Đây là một nguồn tài nguyên đáng tin cậy để khắc phục sự cố Linux. Các thành viên cộng đồng đặt câu hỏi và bình chọn cho các câu trả lời chất lượng cao. Đây là nơi lý tưởng để tìm kiếm giải pháp cho các vấn đề kỹ thuật phức tạp.

### Các lệnh hỗ trợ tích hợp trong Linux 🛠️

#### 1. **`man`**: Hiển thị hướng dẫn sử dụng lệnh

- **Cú pháp**: `man <tên_lệnh>`
- **Ví dụ**: `man chown` hiển thị thông tin chi tiết về lệnh `chown`, bao gồm các tùy chọn và cách sử dụng.
- **Man page**: Kết quả trả về từ lệnh `man` được gọi là "man page", cung cấp hướng dẫn chi tiết về lệnh.

#### 2. **`apropos`**: Tìm kiếm từ khóa trong mô tả của man page

- **Cú pháp**: `apropos <từ_khóa>`
- **Ví dụ**: `apropos graph` tìm kiếm các man page có chứa từ "graph" trong mô tả.
- **Tùy chọn `-a`**: Tìm kiếm nhiều từ khóa cùng lúc. Ví dụ: `apropos -a graph editor`.

#### 3. **`whatis`**: Hiển thị mô tả ngắn gọn về lệnh

- **Cú pháp**: `whatis <tên_lệnh>`
- **Ví dụ**: `whatis nano` hiển thị mô tả ngắn gọn về lệnh `nano`.
- **Công dụng**: Hữu ích khi bạn chỉ cần một mô tả ngắn gọn về lệnh, không cần thông tin chi tiết.

### Kết luận 📌

- **Cộng đồng Linux** là nguồn tài nguyên vô giá để học hỏi và giải quyết các vấn đề kỹ thuật. Các trang như **Unix and Linux Stack Exchange** là nơi lý tưởng để đặt câu hỏi và tìm kiếm câu trả lời.
- Các lệnh tích hợp như `man`, `apropos`, và `whatis` giúp bạn nhanh chóng tìm hiểu cách sử dụng các lệnh và giải quyết các vấn đề kỹ thuật.

### Tài nguyên tham khảo thêm 📚

- **Unix and Linux Stack Exchange**: [https://unix.stackexchange.com/](https://unix.stackexchange.com/)
- **Các diễn đàn và blog Linux**: Tìm kiếm trực tuyến để khám phá thêm nhiều nguồn tài nguyên hữu ích khác.
