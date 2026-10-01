---
id: itsm-fundamentals
title: ITSM & Quy trình Vận hành Dịch vụ CNTT
sidebar_label: ITSM Fundamentals
sidebar_position: 7
description: ITIL 4, vòng đời ticket (Incident/Problem/Change/Request), SLA, Jira Service Management và tích hợp ITSM-SOC trong quy trình ứng phó sự cố.
---

# ITSM & Quy trình Vận hành Dịch vụ CNTT

## 1. ITSM và ITIL 4 — Khung quản trị dịch vụ CNTT

**IT Service Management (ITSM)** thường bị hiểu nhầm là "hệ thống ticket" hay "bộ công cụ". Thực chất, ITSM là **triết lý quản trị** quy định cách tổ chức lập kế hoạch, cung cấp, vận hành và kiểm soát các dịch vụ CNTT để đáp ứng nhu cầu kinh doanh. Công cụ (Jira, ServiceNow, Freshservice) chỉ là phương tiện; ITSM là tư duy.

**ITIL 4** (IT Infrastructure Library, phiên bản 4 ra mắt 2019) là framework ITSM được áp dụng rộng rãi nhất toàn cầu. Khác với ITIL v3 tập trung vào "quy trình" (processes) cứng nhắc, ITIL 4 xây dựng trên **Service Value System (SVS)** — một hệ thống tổng thể gồm: Guiding Principles (7 nguyên tắc dẫn đường), Governance, Service Value Chain, Practices, và Continual Improvement. Các "processes" cũ được thay bằng **practices** — linh hoạt hơn và đặt con người vào trung tâm thay vì quy trình.

**Liên hệ thực tế với SOC:** Bộ phận SOC về bản chất là một **dịch vụ CNTT** — cung cấp dịch vụ "phát hiện và ứng phó sự cố bảo mật" cho toàn tổ chức. Từ lăng kính ITIL 4, mỗi security alert là một **event** đi vào value stream: từ Detection (phát hiện) → Triage (đánh giá) → Response (xử lý) → Resolution (giải quyết). Khi SOC hoạt động theo ITSM framework, hiệu quả cải thiện rõ rệt: SLA được định nghĩa và đo lường, priority được chuẩn hóa, và knowledge từ mỗi incident được lưu lại để cải thiện các incident tương lai — thay vì mỗi lần là "reinvent the wheel".

---

## 2. Phân biệt các khái niệm cốt lõi: Ticket / Incident / Problem / Change / Request

Trong ITSM, "ticket" chỉ là container chứa thông tin — điều quan trọng là **loại ticket** và **process** đằng sau nó. Nhầm lẫn giữa các loại ticket là một trong những nguyên nhân phổ biến nhất khiến quy trình SOC kém hiệu quả.

**Incident** (Sự cố): Là bất kỳ sự kiện nào gây ra hoặc có thể gây ra **gián đoạn dịch vụ không có kế hoạch** hoặc **giảm chất lượng dịch vụ**. Mục tiêu xử lý Incident là **khôi phục dịch vụ nhanh nhất có thể** — không nhất thiết phải tìm nguyên nhân gốc rễ. Ví dụ trong SOC: phát hiện ransomware đang chạy trên server là Incident — hành động ưu tiên là isolate server và ngăn chặn lan rộng, không phải ngồi điều tra ngay tại sao ransomware vào được.

**Problem** (Vấn đề): Là nguyên nhân gốc rễ (root cause) của một hoặc nhiều Incidents. Problem Management hướng đến **loại bỏ nguyên nhân** để Incident không tái diễn. Ví dụ: sau khi xử lý xong Incident ransomware (restore từ backup, reimaging), SOC và Security Engineering phối hợp mở Problem ticket để tìm hiểu tại sao phishing email qua được mail filter, tại sao endpoint EDR không block được malware. Problem ticket tồn tại lâu hơn Incident và thường được xử lý bởi L3/Security Engineer, không phải L1/L2 analyst.

**Change** (Thay đổi): Là hành động thêm, chỉnh sửa hoặc xóa bất kỳ thứ gì có thể ảnh hưởng đến dịch vụ CNTT. Change Management đảm bảo mọi thay đổi đều được **lập kế hoạch, phê duyệt và kiểm soát**. Ví dụ trong SOC: triển khai rule mới trên SIEM, cập nhật signature trên IPS, hay patch server sau khi phát hiện vulnerability — tất cả đều là Change.

**Service Request** (Yêu cầu dịch vụ): Yêu cầu thông thường không phải sự cố — onboarding user mới, cấp quyền truy cập, cài phần mềm theo yêu cầu. Với SOC, Service Request thường đến dưới dạng "cần phân tích log của hệ thống X" hoặc "cần tạo rule detect behavior Y".

**Vai trò phân chia trong SOC theo loại ticket:**

| Loại ticket | Ai xử lý? | Mục tiêu |
|------------|-----------|---------|
| Incident | SOC L1, L2 | Khôi phục dịch vụ, contain threat |
| Problem | L3, Security Engineer | Tìm root cause, loại bỏ nguyên nhân |
| Change | Security Engineer + CAB | Cải tiến an toàn, không gây downtime mới |
| Request | L1 hoặc tự động | Cung cấp dịch vụ theo yêu cầu |

---

## 3. SLA, Priority và Severity — Bộ ba quyết định thứ tự ưu tiên

Khi có nhiều ticket cùng lúc — điều xảy ra hàng ngày trong SOC — analyst cần biết **cái nào xử lý trước**. Đây là lúc ba khái niệm SLA, Priority và Severity phát huy tác dụng, nhưng chúng thường bị dùng lẫn lộn gây ra phán quyết sai.

**Severity** (Độ nghiêm trọng kỹ thuật): Đây là thước đo **tác động kỹ thuật** của sự cố — hệ thống bị ảnh hưởng ở mức độ nào? Severity là quan điểm của IT/Security team, không phải business. Ví dụ: một server bị compromise hoàn toàn (attacker có shell) là Severity Critical về mặt kỹ thuật.

**Priority** (Mức độ ưu tiên xử lý): Đây là quyết định **bao giờ cần xử lý** và được tính theo công thức: `Priority = f(Urgency × Impact)`. **Urgency** (cấp bách) là mức độ nhanh cần giải quyết trước khi situation tệ hơn. **Impact** (tác động) là mức độ ảnh hưởng đến business. Một server bị compromise (Severity Critical) nhưng là server dev/test ít người dùng có Priority thấp hơn một web server công cộng bị deface dù deface có Severity thấp hơn về kỹ thuật.

Sự khác biệt này có ý nghĩa thực tiễn lớn: **Priority là thứ quyết định SLA**, không phải Severity. SOC phải học cách đánh giá business impact thay vì chỉ nhìn vào dấu hiệu kỹ thuật.

**SLA (Service Level Agreement)** định nghĩa **cam kết thời gian** cho từng mức Priority. Trong SOC, SLA thường được định nghĩa theo:

| Priority | Response Time | Update Interval | Resolution Target |
|----------|--------------|-----------------|-------------------|
| **P1 — Critical** | 15 phút | Mỗi 30 phút | 4 giờ |
| **P2 — High** | 1 giờ | Mỗi 2 giờ | 8 giờ |
| **P3 — Medium** | 4 giờ | Mỗi ngày | 3 ngày làm việc |
| **P4 — Low** | 1 ngày làm việc | Mỗi tuần | 2 tuần |

**Response Time** là thời gian từ khi ticket được tạo đến khi SOC analyst bắt đầu làm việc (acknowledge và assign). **Resolution Target** là thời gian mục tiêu để close ticket. Vượt SLA cần được escalate và documented lý do.

---

## 4. Jira Service Management trong môi trường SOC

**Jira Service Management (JSM)** là ITSM platform phổ biến, đặc biệt trong tổ chức đã dùng Jira Software cho software development. JSM cung cấp các tính năng ITSM đầy đủ với khả năng customize cao và integration mạnh với Atlassian ecosystem.

**Cấu trúc chính trong JSM cho SOC:**

**Queues** (Hàng đợi): JSM cho phép định nghĩa nhiều queue khác nhau để phân loại ticket — ví dụ: "Unassigned P1/P2", "Assigned to me", "Awaiting L2 Escalation", "Pending Customer". SOC thường cấu hình queue theo shift và tier để đảm bảo không có ticket nào bị bỏ sót.

**SLA Rules**: JSM tự động tính và track SLA cho mỗi ticket dựa trên Priority. Khi ticket sắp vượt SLA, JSM có thể tự động gửi notification, re-assign, hoặc escalate. SLA clock có thể được pause khi đang chờ thông tin từ user (Pending Customer status).

**Automation**: Một trong những tính năng mạnh nhất của JSM. Có thể cấu hình:
- Tự động assign ticket cho analyst on-call dựa trên alert type hoặc keyword
- Tự động set Priority dựa trên fields trong ticket
- Tự động escalate khi ticket P1 chưa có response sau 10 phút
- Tự động tạo sub-tasks cho investigation checklist

**Integration với Splunk ES**: Notable Events trong Splunk ES có thể được cấu hình để tự động tạo Incident ticket trong JSM qua webhook hoặc Splunk Add-on. Thông tin quan trọng từ notable event (rule name, severity, affected hosts, raw event data) được populate vào ticket, giúp L1 analyst có đủ context ngay khi nhận ticket mà không cần phải login Splunk tìm kiếm thêm.

**Customer Portal vs Agent View:**
- **Customer Portal**: Giao diện đơn giản cho end-user gửi request hoặc báo cáo sự cố. Không cần Jira license.
- **Agent View**: Full interface cho SOC analyst làm việc với ticket — xem queue, update status, comment, link tickets, xem SLA countdown.

---

## 5. Vòng đời Incident Management trong SOC

Một incident từ lúc phát sinh đến lúc close đi qua nhiều giai đoạn rõ ràng. Hiểu và tuân thủ vòng đời này giúp SOC làm việc có hệ thống, không bỏ sót bước, và có tài liệu đầy đủ cho Post-Incident Review.

```
Detection → Triage → Escalation → Investigation → 
Containment → Eradication → Recovery → Post-Incident Review
```

**Detection**: Alert được sinh ra từ SIEM (Splunk ES notable event, Wazuh alert), EDR, email filter, hoặc báo cáo từ người dùng. Giai đoạn này kết thúc khi ticket được tạo.

**Triage** (SOC L1): L1 analyst đánh giá nhanh để xác định: đây có phải true positive hay false positive? Nếu true positive, Priority là gì? L1 dùng checklist và playbook để triage nhất quán, ghi lại các bước đã thực hiện vào ticket.

**Escalation**: Nếu incident vượt khả năng xử lý của L1 (cần deep forensics, malware analysis, hoặc impact quá lớn), ticket được escalate lên L2 với đầy đủ context. **Chất lượng escalation quyết định tốc độ điều tra của L2** — L1 phải ghi rõ những gì đã làm, những gì đã loại trừ, và lý do escalate.

**Investigation** (L2/L3): Thu thập evidence, xây dựng timeline, xác định scope (bao nhiêu máy bị ảnh hưởng, data gì bị compromise, attacker đã làm gì). Toàn bộ findings phải được document trong ticket — không để trong notebook cá nhân hay ghi nhớ.

**Containment**: Ngăn chặn lan rộng — isolate host, block IP/domain, disable account, revoke token. Containment phải nhanh nhưng có kiểm soát để không làm mất evidence và không gây downtime không cần thiết.

**Eradication**: Loại bỏ hoàn toàn threat — xóa malware, close persistence mechanism, patch vulnerability đã bị exploit. Eradication không thể thực hiện cho đến khi Investigation đã xác định đầy đủ scope.

**Recovery**: Khôi phục hệ thống về trạng thái normal — restore từ backup, reimage, verify integrity. Monitor chặt chẽ sau recovery để phát hiện reinfection.

**Post-Incident Review (PIR)**: Họp review sau khi close incident — điều gì đã làm tốt, điều gì cần cải thiện, detection có thể enhance như thế nào, playbook cần update không. **Ghi chép đầy đủ trong ticket trong suốt vòng đời là điều kiện để PIR có chất lượng**. Ticket trống hoặc thiếu context làm PIR gần như vô nghĩa.

---

## 6. Change Management và mối liên hệ với SOC

SOC không chỉ là consumer của Change Management (cần biết có change gì đang diễn ra để tránh false positive) mà còn là **initiator** và **participant** trong Change process khi cần cải thiện security posture.

**Ba loại Change:**

**Standard Change**: Change đã được pre-approved, có quy trình rõ ràng, risk thấp và thực hiện thường xuyên. Ví dụ: weekly signature update cho antivirus theo maintenance window đã định. SOC có thể thực hiện Standard Change mà không cần qua CAB mỗi lần.

**Normal Change**: Change mới, cần đánh giá risk và phê duyệt từ CAB (Change Advisory Board) trước khi thực hiện. Ví dụ: triển khai SIEM rule mới, thay đổi firewall policy. SOC cần submit Change Request đủ sớm trước implementation date để CAB có thời gian review.

**Emergency Change**: Change khẩn cấp cần thực hiện ngay để ngăn chặn hoặc phục hồi từ incident nghiêm trọng — patch ngay sau khi phát hiện active exploitation, block C2 domain đang hoạt động. Emergency Change có process rút gọn (retrospective approval sau khi implement), nhưng vẫn phải được document đầy đủ.

**CAB (Change Advisory Board)**: Nhóm bao gồm đại diện các bộ phận liên quan để review và approve Change. Trong security context, SOC Lead hoặc Security Manager thường là thành viên CAB để đảm bảo security implications của mọi change được xem xét.

**Tại sao SOC cần biết về scheduled changes:** Khi database server thực hiện maintenance định kỳ vào 2 giờ sáng thứ Bảy, hành vi khác thường của hệ thống trong giờ đó (tắt service, restart, traffic bất thường) là false positive nếu có Change ticket, nhưng là real incident nếu không có. SOC cần được notify về tất cả scheduled changes — tốt nhất là tự động qua integration giữa ITSM và SIEM, để SIEM có thể suppress alerts liên quan trong maintenance window.

---

## 7. ITSM + Splunk ITSI — Tích hợp Monitoring và Service Management

**Splunk IT Service Intelligence (ITSI)** là module của Splunk được thiết kế đặc biệt để bridge khoảng cách giữa raw telemetry monitoring và service management — một bài toán mà mọi SOC lớn đều phải đối mặt: SIEM báo hàng nghìn events, nhưng làm thế nào để biết event nào thực sự ảnh hưởng đến service quan trọng của business?

**Service và KPI trong ITSI:**

ITSI cho phép định nghĩa **Service** theo góc nhìn business — ví dụ: "Authentication Service" bao gồm các domain controllers, LDAP servers, và MFA gateways. Mỗi service được gán các **KPI (Key Performance Indicators)** — thước đo sức khỏe cụ thể:

- `Failed Authentication Rate` = (Event 4625 count / Event 4624 count) × 100 — nếu vượt 10% là threshold
- `Kerberos Authentication Latency` = thời gian trung bình từ AS-REQ đến TGT response
- `MFA Push Success Rate` = tỉ lệ MFA thành công — giảm đột ngột có thể là MFA fatigue attack

Mỗi KPI có ngưỡng (threshold) tương ứng với trạng thái sức khỏe: Normal, Low, Medium, High, Critical. ITSI liên tục tính toán health score dựa trên tất cả KPI, tổng hợp lên service level.

**Episode Management:**

Khi KPI của một service vi phạm ngưỡng, ITSI tự động tạo **Episode** — tương tự Incident nhưng được correlation với service context. Episode có thể tự động linked với Splunk ES Notable Events liên quan, giúp analyst thấy ngay: "KPI Failed Authentication Rate của Authentication Service đang ở Critical — có 15 Notable Events liên quan gồm Account Lockout, Brute Force Detection, và MFA Failure Storm".

So với alert từng Notable Event riêng lẻ, Episode cung cấp **service-level context** quý giá hơn nhiều: analyst không phải tự tổng hợp mà có ngay bức tranh toàn cảnh.

**Glass Table:**

Glass Table là dashboard visualization trong ITSI, cho phép hiển thị real-time health của toàn bộ service chain theo sơ đồ topology. Ví dụ có thể build Glass Table cho Security Service Chain: User Endpoint → Network → Authentication Service → Applications → Data. Khi có sự cố, Glass Table ngay lập tức highlight service nào đang unhealthy, giúp L1/L2 xác định nhanh blast radius mà không cần chạy nhiều query trong SIEM.

**Kết hợp ITSI + JSM:** Khi ITSI Episode được raise, Splunk SOAR (hoặc webhook tùy chỉnh) có thể tự động tạo Incident ticket trong Jira Service Management với đầy đủ thông tin: service bị ảnh hưởng, KPI vi phạm, danh sách Notable Events liên quan, và link đến Glass Table. L1 analyst nhận ticket với context đủ để bắt đầu triage ngay, không cần mất thêm thời gian thu thập thông tin ban đầu — đây là hiện thực hóa của triết lý ITIL 4: mọi thứ phục vụ tốc độ và chất lượng của service value stream.
