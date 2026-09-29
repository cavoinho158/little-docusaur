---
title: "Tools of the Trade: Linux and SQL - Week 2"
sidebar_position: 20
---

Konbanwa~ `(´｡• ᵕ •｡)`, tôi và cậu ấy đã hoàn thành module 2 của course 4 rồi đây. Hôm nay chủ yếu là lý thuyết cơ bản về Linux, phần này sẽ có các bài tập thực hành để hiểu cách sử dụng các lệnh linux cơ bản, do là chỉ copy paste theo hướng dẫn và lệnh thì rất phổ biến nên hai chúng tôi sẽ không note lại.

> _"Dạo này bận nghiên cứu đồ án nên hong có thời gian soạn mấy bài blog này, hic. `(・・;)ゞ`" - Tôi than vãn_ \
> _"Chắc là học hết một lượt rồi soạn bài sau?" - Cậu ấy nói_ \
> _"Vậy cũng được... hmmmm `(￣ヘ￣)`" - Tôi suy nghĩ_

## Kiến trúc Linux và các bản phân phối phổ biến 🐧🔧

Linux được xây dựng từ các thành phần chính sau:

### 1. Người dùng (User) 👤

- Linux là hệ thống **đa người dùng**, cho phép nhiều người dùng truy cập tài nguyên cùng lúc.

### 2. Ứng dụng (Applications) 📱

- Thực hiện các tác vụ cụ thể (ví dụ: trình duyệt, máy tính).
- **Package manager**: Công cụ quản lý cài đặt/gỡ bỏ ứng dụng (ví dụ: `apt` trên Debian).

### 3. Shell 🐚

- Giao diện dòng lệnh, dịch lệnh từ người dùng sang kernel.
- Ví dụ: Bash, Zsh.

### 4. Tiêu chuẩn phân cấp hệ thống tệp (FHS) 📂

- Quy định cách tổ chức thư mục và tệp trong Linux.
- Ví dụ: `/home` chứa dữ liệu người dùng, `/etc` chứa cấu hình hệ thống.

### 5. Kernel (Nhân Linux) 💡

- Quản lý tiến trình, bộ nhớ, và giao tiếp giữa phần cứng và ứng dụng.
- Điều phối tài nguyên để tối ưu hiệu suất.

### 6. Phần cứng (Hardware) 💾

- **Phần cứng ngoại vi**: Màn hình, bàn phím, chuột (có thể tháo rời).
- **Phần cứng nội bộ**:
  - **CPU**: Xử lý lệnh từ chương trình.
  - **RAM**: Bộ nhớ ngắn hạn, lưu dữ liệu tạm thời.
  - **Ổ cứng**: Lưu trữ dữ liệu lâu dài.

---

## Các bản phân phối Linux phổ biến 🌐

### 1. Kali Linux 🕵️♂️

- **Mục đích**: Penetration testing, forensics.
- **Đặc điểm**:
  - Debian-based, mã nguồn mở.
  - Có sẵn 600+ công cụ bảo mật (như Nmap, Wireshark).
  - (Kali Linux là thương hiệu của OffSec).

### 2. Ubuntu 🐧

- **Mục đích**: Đa dụng, thân thiện với người dùng.
- **Đặc điểm**:
  - Debian-based, hỗ trợ cả GUI và CLI.
  - Phổ biến trong điện toán đám mây.
  - Cộng đồng hỗ trợ lớn.

### 3. Parrot 🦜

- **Mục đích**: Bảo mật, pentesting.
- **Đặc điểm**:
  - Debian-based, GUI dễ sử dụng.
  - Có sẵn công cụ như Kali Linux.

### 4. Red Hat Enterprise Linux (RHEL) 🔴

- **Mục đích**: Doanh nghiệp.
- **Đặc điểm**:
  - Trả phí, hỗ trợ kỹ thuật 24/7.
  - Tương thích với CentOS cũ.

### 5. AlmaLinux 🌟

- **Mục đích**: Thay thế CentOS.
- **Đặc điểm**:
  - Mã nguồn mở, miễn phí.
  - Tương thích với RHEL và CentOS.

Tham khảo thêm:

- [Kali Linux Tools](https://www.kali.org/tools/)
- [Ubuntu Packages](https://packages.ubuntu.com/)
- [Red Hat Documentation](https://access.redhat.com/documentation/)

---

## Quản lý package và công cụ quản lý package trong Linux 📦🔧

### Giới thiệu về quản lý package 📚

- **Gói (Package)**: Phần mềm chứa các tệp cần thiết để cài đặt ứng dụng, bao gồm cả **dependencies** (các tệp bổ sung cần thiết để chạy ứng dụng).
- **Package manager**: Công cụ giúp cài đặt, quản lý và gỡ bỏ các gói hoặc ứng dụng.
- **Lưu ý**: Luôn sử dụng phiên bản gói mới nhất để đảm bảo các bản vá bảo mật và sửa lỗi mới nhất.

### Các loại package managers 🛠️

- **Debian-based distributions** (ví dụ: Kali Linux, Ubuntu, Parrot):

  - **dpkg**: Quản lý pakage với định dạng `.deb` (ví dụ: `Package_Version-Release_Architecture.deb`).
  - **APT (Advanced Package Tool)**: Công cụ quản lý pakage qua CLI, hỗ trợ tìm kiếm, cài đặt và quản lý pakage dễ dàng.

- **Red Hat-based distributions** (ví dụ: CentOS, RHEL):
  - **RPM (Red Hat Package Manager)**: Quản lý pakage với định dạng `.rpm` (ví dụ: `Package-Version-Release_Architecture.rpm`).
  - **YUM (Yellowdog Updater Modified)**: Công cụ quản lý pakage qua CLI, tương thích với `.rpm`.

### Công cụ quản lý package phổ biến ⚙️

1. APT (Advanced Package Tool) 🐧

   - **Phân phối hỗ trợ**: Debian, Ubuntu, Kali Linux, Parrot.
   - **Các lệnh phổ biến**:
     - Cập nhật danh sách gói: `sudo apt update`.
     - Cài đặt gói: `sudo apt install <tên_gói>`.
     - Gỡ bỏ gói: `sudo apt remove <tên_gói>`.

2. YUM (Yellowdog Updater Modified) 🔴

   - **Phân phối hỗ trợ**: CentOS, RHEL, AlmaLinux.
   - **Các lệnh phổ biến**:
     - Cài đặt gói: `sudo yum install <tên_gói>`.
     - Cập nhật gói: `sudo yum update`.
     - Gỡ bỏ gói: `sudo yum remove <tên_gói>`.

Tham khảo thêm:

- [APT Cheat Sheet](https://itsfoss.com/apt-command-guide/)
- [YUM Cheat Sheet](https://access.redhat.com/articles/yum-cheat-sheet)

---

## Shell trong Linux: Cầu nối giữa người dùng và hệ thống 🐚💻

- **Shell** là trình thông dịch dòng lệnh, hoạt động như một "phiên dịch viên" giữa người dùng và hệ thống.
- Khi bạn nhập lệnh vào shell, nó sẽ:
  - Diễn giải lệnh.
  - Gửi lệnh đến kernel (nhân hệ điều hành).
  - Trả về kết quả cho người dùng.

### Các loại shell phổ biến 🛠️

1. Bourne-Again Shell (Bash) 🐧

   - **Đặc điểm**:
     - Shell mặc định trên hầu hết các bản phân phối Linux.
     - Sử dụng ký hiệu `$` để nhập lệnh.
     - Thân thiện với người dùng, phù hợp cho cả lệnh cơ bản và dự án phức tạp.
   - **Ứng dụng**: Được sử dụng rộng rãi trong lĩnh vực bảo mật.

2. C Shell (csh) 🐚

   - **Đặc điểm**:
     - Cú pháp tương tự ngôn ngữ lập trình C.
     - Phù hợp cho người dùng quen thuộc với C.

3. Korn Shell (ksh) 🐚

   - **Đặc điểm**:
     - Kết hợp tính năng của Bash và C Shell.
     - Sử dụng ký hiệu `$` để nhập lệnh.

4. Enhanced C Shell (tcsh) 🐚

   - **Đặc điểm**:
     - Phiên bản nâng cao của C Shell.
     - Hỗ trợ tự động hoàn thành lệnh và lịch sử lệnh.

5. Z Shell (zsh) 🐚

   - **Đặc điểm**:
     - Sử dụng ký hiệu `%` để nhập lệnh.
     - Hỗ trợ nhiều tính năng mở rộng và tùy chỉnh.

### Tại sao Bash được ưa chuộng? 🚀

- **Phổ biến**: Là shell mặc định trên nhiều bản phân phối Linux.
- **Dễ sử dụng**: Giao diện thân thiện, phù hợp cho cả người mới và chuyên gia.
- **Tính linh hoạt**: Hỗ trợ nhiều lệnh và script phức tạp.

### Kết luận 📌

- **Shell** là công cụ quan trọng để tương tác với hệ thống Linux.
- **Bash** là shell phổ biến nhất, được sử dụng rộng rãi trong bảo mật và là shell mặc định trong khóa học này.
- Các shell khác như **csh**, **ksh**, **tcsh**, và **zsh** cũng có những ưu điểm riêng tùy vào nhu cầu sử dụng.
