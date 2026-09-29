---
title: "Tools of the Trade: Linux and SQL - Week 2 (2)"
sidebar_position: 21
---

Lâu rồi không gặp mọi người, hơn 1 tuần từ bài lần trước rồi nhỉ? Vừa đăng bài đấy xong thì đi học về tôi và cậu ấy không may bị tai nạn xe. Mặc dù không có ảnh hưởng gì nặng đến cơ thể và xe nhưng xui là laptop bị bể màn hình nên phải vắng mặt hết mấy ngày. Mới hôm trước tôi và cậu ấy cũng mới bắt đầu học lại được. Chuyện cũng qua rồi, giờ cùng cố gắng học nhé!

> _"Lưng cậu còn đau không?" - Tôi lo lắng_ \
> _"Còn hơi ê ê thôi, không sao hehe." - Cậu ấy cười_ \
> _"Nhớ uống thuốc đấy, công việc cứ để tôi, cậu nghỉ ngơi thêm đi." - Tôi nhẹ lòng_

## Điều hướng Linux và đọc nội dung file 📂🐧

### Filesystem Hierarchy Standard (FHS) 🌳

FHS là thành phần của Linux giúp tổ chức dữ liệu. Nó định nghĩa cách các thư mục, nội dung thư mục và các thiết bị lưu trữ khác được tổ chức trong hệ điều hành.

- **Root directory**: Là thư mục cao nhất trong Linux, được biểu diễn bằng dấu gạch chéo `/`. Tất cả các thư mục con đều được phân nhánh từ đây.
- **Standard FHS directories**: Một số thư mục tiêu chuẩn dưới root directory bao gồm:

  - `/home`: Mỗi người dùng trong hệ thống có một thư mục home riêng.
  - `/bin`: Chứa các file nhị phân và các file thực thi.
  - `/etc`: Lưu trữ các file cấu hình hệ thống.
  - `/tmp`: Chứa các file tạm thời, thường được sử dụng bởi các attacker.
  - `/mnt`: Dùng để mount các thiết bị lưu trữ như USB hoặc ổ cứng.

- **User-specific subdirectories**: Dưới thư mục `/home` là các thư mục con dành riêng cho từng người dùng. Ví dụ: `/home/analyst/projects`.

### Điều hướng hệ thống file 🧭

Các lệnh sau đây sẽ giúp bạn điều hướng hệ thống file một cách dễ dàng:

- **`pwd`**: In ra thư mục hiện tại bạn đang làm việc.
- **`ls`**: Liệt kê các file và thư mục trong thư mục hiện tại.
- **`cd`**: Di chuyển giữa các thư mục. Bạn có thể sử dụng đường dẫn tuyệt đối hoặc tương đối.

### Đọc nội dung file 📄

Để đọc nội dung file, bạn có thể sử dụng các lệnh sau:

- **`cat`**: Hiển thị toàn bộ nội dung của file.
- **`head`**: Hiển thị 10 dòng đầu tiên của file (có thể thay đổi số dòng bằng `-n`).
- **`tail`**: Hiển thị 10 dòng cuối cùng của file.
- **`less`**: Hiển thị nội dung file từng trang một, cho phép bạn di chuyển lên xuống dễ dàng.

### Kết luận 📌

Việc điều hướng và đọc nội dung file là kỹ năng quan trọng đối với các nhà phân tích bảo mật. Các lệnh như `pwd`, `ls`, `cd`, `cat`, `head`, `tail`, và `less` sẽ giúp bạn làm việc hiệu quả hơn trong môi trường Linux.

---

## Lọc nội dung trong Linux 🔍🐧

Trong phần này, chúng ta sẽ tiếp tục khám phá các lệnh Linux giúp bạn lọc thông tin cần thiết. Bạn sẽ học thêm một lệnh mới là `find`, giúp tìm kiếm file và thư mục dựa trên các tiêu chí cụ thể.

### Lọc thông tin 🎯

Lọc thông tin là kỹ năng quan trọng đối với các nhà phân tích bảo mật. Lọc giúp bạn chọn ra dữ liệu phù hợp với điều kiện nhất định. Ví dụ, nếu hệ thống của bạn bị nhiễm virus chỉ ảnh hưởng đến các file `.txt`, bạn có thể sử dụng lệnh lọc để nhanh chóng tìm ra các file này.

### Lệnh `grep` 🔎

Lệnh `grep` tìm kiếm một chuỗi cụ thể trong file và trả về tất cả các dòng chứa chuỗi đó. Ví dụ, lệnh `grep OS updates.txt` sẽ trả về tất cả các dòng chứa từ "OS" trong file `updates.txt`.

- **Cú pháp**: `grep <chuỗi_cần_tìm> <tên_file>`
- **Ví dụ**: `grep error time_logs.txt` sẽ tìm kiếm từ "error" trong file `time_logs.txt`.

### Lệnh `pipe` (|) 🚰

Lệnh `pipe` (ký hiệu `|`) được sử dụng để chuyển đầu ra của một lệnh làm đầu vào cho lệnh khác. Ví dụ, lệnh `ls /home/analyst/reports | grep users` sẽ liệt kê tất cả các file và thư mục trong thư mục `reports` có chứa từ "users".

- **Cú pháp**: `<lệnh_1> | <lệnh_2>`
- **Ví dụ**: `ls | grep log` sẽ liệt kê các file và thư mục có chứa từ "log".

### Lệnh `find` 🔍

Lệnh `find` giúp tìm kiếm file và thư mục dựa trên các tiêu chí cụ thể như tên, kích thước, hoặc thời gian chỉnh sửa.

- **Cú pháp cơ bản**: `find <thư_mục_bắt_đầu_tìm> <tiêu_chí>`

#### Tìm kiếm theo tên

- **`-name`**: Tìm kiếm tên file hoặc thư mục (phân biệt chữ hoa chữ thường).
- **`-iname`**: Tìm kiếm tên file hoặc thư mục (không phân biệt chữ hoa chữ thường).

  **Ví dụ**: `find /home/analyst/projects -name "*log*"` sẽ tìm tất cả các file trong thư mục `projects` có chứa từ "log" trong tên.

#### Tìm kiếm theo thời gian chỉnh sửa

- **`-mtime`**: Tìm kiếm file hoặc thư mục được chỉnh sửa trong khoảng thời gian nhất định (tính bằng ngày).

  **Ví dụ**: `find /home/analyst/projects -mtime -3` sẽ tìm tất cả các file và thư mục trong thư mục `projects` được chỉnh sửa trong vòng 3 ngày qua.

### Kết luận 📌

Lọc thông tin bằng các lệnh Linux như `grep`, `pipe`, và `find` là kỹ năng quan trọng giúp các nhà phân tích bảo mật tùy chỉnh dữ liệu theo nhu cầu của họ. Những lệnh này giúp bạn tìm kiếm và lọc thông tin một cách hiệu quả trong hệ thống file.

---

## Quản lý thư mục và file trong Linux 📂🐧

Trong phần này, chúng ta sẽ cùng nhau tìm hiểu cách quản lý hệ thống file bằng các lệnh Linux. Các lệnh được giới thiệu bao gồm: `mkdir`, `rmdir`, `touch`, `rm`, `mv`, `cp`, và cách sử dụng trình soạn thảo `nano`. Ngoài ra, bạn cũng sẽ học cách ghi nội dung vào file bằng các toán tử `>` và `>>`.

### Tạo và chỉnh sửa thư mục 🗂️

- **`mkdir`**: Tạo một thư mục mới. Ví dụ: `mkdir /home/analyst/logs/network` tạo thư mục `network` trong thư mục `logs`.
- **`rmdir`**: Xóa một thư mục rỗng. Ví dụ: `rmdir /home/analyst/logs/network` xóa thư mục `network`.

  **Lưu ý**: `rmdir` không thể xóa thư mục có chứa file hoặc thư mục con.

### Tạo và chỉnh sửa file 📄

- **`touch`**: Tạo một file mới không có nội dung. Ví dụ: `touch permissions.txt` tạo file `permissions.txt`.
- **`rm`**: Xóa một file. Ví dụ: `rm permissions.txt` xóa file `permissions.txt`.

- **`mv`**: Di chuyển hoặc đổi tên file/thư mục. Ví dụ: `mv permissions.txt /home/analyst/logs` di chuyển file `permissions.txt` vào thư mục `logs`. Để đổi tên file, sử dụng `mv permissions.txt perm.txt`.

- **`cp`**: Sao chép file hoặc thư mục. Ví dụ: `cp permissions.txt /home/analyst/logs` sao chép file `permissions.txt` vào thư mục `logs`.

### Trình soạn thảo `nano` ✍️

`nano` là một trình soạn thảo file dòng lệnh phổ biến và dễ sử dụng. Bạn có thể sử dụng `nano` để tạo và chỉnh sửa file.

- **Mở file**: `nano permissions.txt` mở file `permissions.txt` để chỉnh sửa.
- **Tạo file mới**: `nano authorized_users.txt` tạo và mở file `authorized_users.txt`.
- **Lưu file**: Nhấn `Ctrl + O` để lưu file.
- **Thoát**: Nhấn `Ctrl + X` để thoát khỏi `nano`.

### Ghi nội dung vào file với `>` và `>>` 📝

- **`>`**: Ghi đè nội dung vào file. Ví dụ: `echo "time" > permissions.txt` ghi đè nội dung của file `permissions.txt` bằng chuỗi "time".
- **`>>`**: Thêm nội dung vào cuối file. Ví dụ: `echo "last updated date" >> permissions.txt` thêm chuỗi "last updated date" vào cuối file `permissions.txt`.

  **Lưu ý**: Cả `>` và `>>` đều sẽ tạo file mới nếu file không tồn tại.

### Kết luận 📌

Quản lý hệ thống file là kỹ năng quan trọng đối với các nhà phân tích bảo mật. Các lệnh như `mkdir`, `rmdir`, `touch`, `rm`, `mv`, và `cp` giúp bạn tạo, xóa, di chuyển và sao chép file và thư mục. Ngoài ra, bạn có thể sử dụng `nano` để chỉnh sửa file hoặc các toán tử `>` và `>>` để ghi nội dung vào file.
