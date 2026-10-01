---
id: access-control-labs
title: Broken Access Control — Labs PortSwigger
sidebar_label: Access Control (Week 11)
sidebar_position: 4
description: Writeup các lab Broken Access Control trên PortSwigger — Vertical privilege escalation, Horizontal privilege escalation, IDOR, Multi-step bypass. OWASP A01.
---

# Broken Access Control — Labs PortSwigger

## Lý thuyết tổng quan

**Broken Access Control** giữ vững vị trí **OWASP #1** trong cả bảng xếp hạng 2021 lẫn dự báo 2025 — không phải ngẫu nhiên mà đây là danh mục lỗ hổng được báo cáo nhiều nhất từ cộng đồng bảo mật. Access control là cơ chế đảm bảo người dùng chỉ có thể thực hiện những gì họ được phép, và khi cơ chế này bị phá vỡ, hậu quả có thể là lộ dữ liệu nhạy cảm, leo quyền, hoặc phá hoại toàn bộ hệ thống.

### Ba nhóm lỗ hổng chính

**Vertical privilege escalation** xảy ra khi người dùng thường truy cập được chức năng chỉ dành cho admin — ví dụ: panel quản trị không có authentication, tham số ẩn `role=admin` mà server tin tưởng từ client-side.

**Horizontal privilege escalation (IDOR — Insecure Direct Object Reference)** là khi user A truy cập dữ liệu của user B bằng cách thay đổi identifier trong URL hoặc request. Ví dụ điển hình: `/my-account?id=123` có thể bị thay thành `/my-account?id=124` để xem dữ liệu người khác khi server không kiểm tra quyền sở hữu.

**Business logic bypass** nhắm vào các workflow đa bước không nhất quán trong kiểm tra quyền: bước 1 check đầy đủ, bước 2 giả định bước 1 đã check và bỏ qua — attacker skip thẳng đến bước 2.

### Nguyên nhân gốc rễ

Hầu hết lỗ hổng access control bắt nguồn từ vài anti-pattern phổ biến: **enforce access control ở UI layer** (ẩn nút trong giao diện nhưng không check ở server), dùng **ID tuần tự, đoán được** (integer tăng dần thay vì UUID), **kiểm tra quyền không nhất quán** giữa các HTTP method (GET được check nhưng POST/PATCH bỏ qua), và tin tưởng hoàn toàn vào các header do client hoặc middleware gửi lên (`X-Original-URL`, `Referer`).

**Nguyên tắc phòng thủ:** Enforce access control ở server-side cho mọi request, mọi HTTP method, mọi bước trong workflow. Dùng UUID hoặc indirect reference thay vì sequential ID. Audit log mọi truy cập đến resource nhạy cảm. Áp dụng mô hình **deny-by-default** — từ chối tất cả, chỉ cho phép những gì được khai báo tường minh.

---

## Writeup Labs

### Lab 1: Vertical Escalation — Unprotected Admin Panel

**Logic:** Admin panel tồn tại tại một URL cụ thể nhưng không có bất kỳ cơ chế authentication hay authorization nào bảo vệ. URL này bị lộ qua file `robots.txt` — một tệp cấu hình dành cho search crawler, thường được để ở thư mục gốc và accessible công khai.

**Kỹ thuật:** Truy cập `https://site.com/robots.txt` — file liệt kê các path mà admin không muốn crawler index, trong đó có `/administrator-panel`. Truy cập trực tiếp URL này mà không cần credential nào, toàn bộ chức năng admin khả dụng.

```
GET /robots.txt
→ Disallow: /administrator-panel

GET /administrator-panel
→ 200 OK — Full admin access
```

**Lesson learned:** `robots.txt` không phải cơ chế bảo mật. Các path nhạy cảm phải được bảo vệ bằng authentication + authorization thực sự ở server-side.

---

### Lab 2: Vertical Escalation — Parameter-Based Access Control

**Logic:** Server quyết định quyền admin dựa trên giá trị của một cookie hoặc hidden field mà client gửi lên — thay vì kiểm tra session role trong database. Đây là anti-pattern nguy hiểm: server tin tưởng hoàn toàn dữ liệu do client kiểm soát.

**Kỹ thuật:** Dùng Burp Suite để intercept request sau khi đăng nhập. Quan sát cookie có dạng `Admin=false` hoặc hidden field trong HTML form. Thay đổi giá trị:

```http
Cookie: session=abc123; Admin=true
```

Hoặc trong POST body:
```
role=admin&username=wiener
```

Server accept giá trị này và cấp quyền admin. Không có server-side validation nào so sánh role với database.

---

### Lab 3: Horizontal IDOR — User Data

**Logic:** Trang thông tin cá nhân của người dùng được truy cập qua URL chứa user ID dạng sequential integer: `/my-account?id=wiener`. Server không kiểm tra xem session của người đang request có quyền truy cập ID đó không — bất kỳ authenticated user nào cũng có thể xem dữ liệu của user khác bằng cách thay đổi tham số.

**Kỹ thuật:** Sau khi đăng nhập vào account wiener, quan sát URL `/my-account?id=wiener`. Thay `id=wiener` thành `id=carlos`:

```
GET /my-account?id=carlos
→ 200 OK — Hiển thị thông tin và API key của carlos
```

Server response trả về đầy đủ thông tin của carlos bao gồm API key nhạy cảm. Đây là IDOR dạng username, không phải integer ID nhưng logic lỗ hổng giống nhau.

---

### Lab 4: Horizontal → Vertical Privilege Escalation

**Logic:** Lab này kết hợp 2 lỗ hổng theo chuỗi (chaining). Trước tiên, khai thác IDOR để truy cập account của carlos. Trong trang account của carlos, tìm được thông tin đặc quyền (API key, temporary password, hoặc admin credential). Sử dụng thông tin này để leo quyền lên admin — chuyển từ horizontal escalation thành vertical.

**Kỹ thuật:**
1. IDOR: `GET /my-account?id=carlos` → thu thập thông tin từ account carlos
2. Phân tích response — tìm trường nhạy cảm như `apiKey`, `adminPassword`, hoặc link đến admin function
3. Dùng thông tin thu được để thực hiện hành động admin (xóa user, thay đổi role)

```
Step 1: GET /my-account?id=carlos → { "apiKey": "X7kP2mN9..." }
Step 2: GET /admin/deleteUser?apiKey=X7kP2mN9...&username=carlos
→ 200 OK — Admin action executed
```

---

### Lab 5: Multi-Step Process Bypass

**Logic:** Chức năng nâng quyền user được thiết kế gồm 2 bước: bước 1 là "confirm intent" (hiển thị form xác nhận, có check quyền admin), bước 2 là "execute" (thực hiện hành động, **không check lại quyền** vì giả định bước 1 đã làm). Attacker có thể skip thẳng đến bước 2 mà không qua bước 1.

**Kỹ thuật:** Quan sát request hợp lệ của admin khi thực hiện nâng quyền. Bước 2 thường là POST request với hidden field xác định action:

```http
POST /admin/upgrade-user HTTP/1.1
Cookie: session=USER_SESSION_NOT_ADMIN

action=upgrade&username=wiener&confirmed=true
```

Server xử lý bước 2 mà không verify người gửi request có quyền admin hay không — chỉ kiểm tra session hợp lệ (đúng) nhưng không kiểm tra role (sai).

---

### Lab 6: URL-Based Access Control Bypass via X-Original-URL

**Logic:** Một middleware hoặc WAF (Web Application Firewall) phía trước backend kiểm tra path trong URL thông thường và block các request đến `/admin`. Tuy nhiên, backend framework hỗ trợ header `X-Original-URL` hoặc `X-Rewrite-URL` — cho phép override path thực sự được xử lý. WAF không inspect header này, chỉ check URL gốc.

**Kỹ thuật:**
```http
GET / HTTP/1.1
Host: vulnerable-site.com
X-Original-URL: /admin/deleteUser?username=carlos
```

Middleware thấy `GET /` — cho qua (không phải path bị block). Backend đọc `X-Original-URL: /admin/deleteUser` và xử lý request như thể path là `/admin/deleteUser`. Kết quả: bypass hoàn toàn WAF/proxy-level access control.

---

### Lab 7: Method-Based Access Control Bypass

**Logic:** Access control được cấu hình dựa trên HTTP method — `POST /admin/upgrade-user` bị restrict chỉ admin mới được dùng. Nhưng khi thử với method khác (ví dụ `POSTX`, `GET` với body, hoặc method không chuẩn), server hoặc framework xử lý request theo code path khác, không qua middleware kiểm tra quyền.

**Kỹ thuật:** Intercept request và đổi method:

```http
# Original (blocked):
POST /admin/upgrade-user
→ 401 Unauthorized

# Bypass:
POSTX /admin/upgrade-user
username=wiener
→ 200 OK — Action executed
```

Một số framework PHP, Java Spring, hoặc Express.js có behavior khác nhau với unknown HTTP methods. Cần test các variant: `GET` (với body), `HEAD`, `PATCH`, method tùy ý như `POSTX`, `FOOBAR`.

---

### Lab 8: Referer-Based Access Control

**Logic:** Server kiểm tra `Referer` header để xác định request đến `/admin/deleteUser` có xuất phát từ trang `/admin` hay không. Đây là cơ chế access control không đáng tin — Referer header hoàn toàn do client kiểm soát và có thể bị forge.

**Kỹ thuật:** Khi truy cập `/admin/deleteUser` trực tiếp (không qua /admin), server trả về 403. Thêm header:

```http
GET /admin/deleteUser?username=carlos HTTP/1.1
Host: vulnerable-site.com
Referer: https://vulnerable-site.com/admin
Cookie: session=USER_SESSION
```

Server check `Referer` → match pattern `/admin` → cho qua. Không có bất kỳ server-side session check nào xác nhận user đã thực sự navigate từ trang đó.

---

## Góc nhìn Blue Team — Detection & Monitoring

Broken Access Control để lại dấu vết đặc trưng trong access log nếu được phân tích đúng cách. Thách thức là volume log lớn và pattern tấn công trông giống behavior bình thường của người dùng.

**Pattern detection cho IDOR:** Tìm cùng một account thực hiện nhiều request đến `/my-account` với các ID khác nhau trong thời gian ngắn. Trong Splunk:

```spl
index=web sourcetype=access_combined uri="/my-account*"
| rex field=uri "id=(?<accessed_id>[^&]+)"
| stats dc(accessed_id) as unique_ids by user, src_ip
| where unique_ids > 5
| eval alert="Possible IDOR enumeration"
```

**Pattern detection cho admin path access:** Monitor mọi request đến `/admin*` từ account không phải admin role. Alert ngay lập tức khi phát hiện — đây không phải behavior bình thường.

```spl
index=web uri="/admin*" NOT user=admin NOT user=administrator
| table _time, src_ip, user, uri, status
| eval severity="HIGH"
```

**Header manipulation detection:** Monitor các request chứa header bất thường như `X-Original-URL`, `X-Rewrite-URL`, `X-Forwarded-For` (kết hợp với admin path), hoặc Referer trỏ về trang admin trong khi session không phải admin.

**HTTP method anomaly:** Alert khi xuất hiện HTTP method không chuẩn (không phải GET/POST/PUT/DELETE/PATCH/HEAD/OPTIONS) — đặc biệt khi nhắm vào path nhạy cảm.

**Remediation checklist:**
- Implement server-side RBAC (Role-Based Access Control) cho mọi endpoint
- Không bao giờ dùng Referer, client-side cookie, hoặc hidden field làm cơ sở quyết định phân quyền
- Dùng UUID thay vì sequential integer cho object ID
- Log tất cả access denied events và review định kỳ
- Penetration test access control theo OWASP Testing Guide (WSTG-ATHZ-*)
- Áp dụng principle of least privilege — mặc định từ chối, tường minh cho phép
