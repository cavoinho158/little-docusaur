---
id: ad-detection-logic
title: Active Directory Attack Detection Logic (Splunk)
sidebar_label: AD Attack Detection (Splunk)
sidebar_position: 1
description: Tóm tắt logic phát hiện và tuning detection rules trên Splunk cho các kỹ thuật tấn công Active Directory (Kerberoasting, AS-REP Roasting, DCSync, Pass-the-Hash, Golden Ticket).
---

# Tóm tắt Logic Phát hiện — Bộ Rule Splunk cho Attack Kỹ thuật AD

> Tổng hợp logic detection sau khi đã sửa bug, chuẩn hoá field, và xử lý vấn đề binning window cho từng kỹ thuật.

---

## 1. Kerberoasting

**Data source:** `index=windows EventCode=4769` (chính) + `index=suricata event_type=krb5` (bổ sung, network-level)

**Bản chất anomaly:** Burst — nhiều request TGS bất thường xảy ra trong khoảng thời gian ngắn. Không cần "nhớ" trạng thái qua nhiều giờ.

**Logic cốt lõi:**
- Loại bỏ noise: `ServiceName!="krbtgt*"` (không phải TGT), `ServiceName!="*$*"` (không phải computer/machine account service).
- Gom theo `(IpAddress, TargetUserName)` trong bin 5 phút, đếm `dc(ServiceName)` (số SPN khác nhau) và `count` (tổng request).
- **`TicketEncryptionType` dùng làm scoring, không phải filter cứng** — RC4 (0x17) tăng độ tin cậy nhưng không bắt buộc, vì attacker có thể dùng AES để né phát hiện.
- Loại whitelist qua `lab_whitelist` (role Scanner).

**Giữ binning (`bin span=5m`)** — vì đây là bài toán burst-detection đúng nghĩa, không phải bài toán "thiếu sự kiện trong quá khứ".

**Threshold:** cần tuning theo baseline thật của môi trường (không nên copy nguyên số từ lab), khuyến nghị dùng `risk_score` (High/Medium/Low) thay vì ngưỡng nhị phân.

---

## 2. AS-REP Roasting

**Data source:** `index=windows EventCode=4768`

**Bản chất anomaly:** Burst — TGT được cấp mà không qua Pre-Authentication.

**Logic cốt lõi:**
- `PreAuthType=0 OR PreAuthType="0x0"` — chỉ báo chính, độ tin cậy cao (Windows mặc định bắt buộc pre-auth, nên việc thiếu nó gần như luôn bất thường).
- Loại `TargetUserName!="*$"` (không phải machine account) và whitelist Scanner qua lookup.
- Gom theo `(IpAddress, host)` trong bin 5 phút để bắt trường hợp 1 nguồn roast nhiều username cùng lúc.

**Giữ binning** — cùng lý do với Kerberoasting.

**Cải tiến đề xuất (chưa bắt buộc):** correlate với Event 4738 (thay đổi `userAccountControl` bật cờ `DONT_REQ_PREAUTH`) để phân biệt tài khoản vốn đã cấu hình sai từ lâu với tài khoản vừa bị attacker tự sửa để tạo điều kiện roast — trường hợp sau có độ tin cậy cao hơn nhiều.

---

## 3. Pass-the-Hash (PtH)

**Data source:** `index=windows EventCode=4624`

**Bản chất anomaly:** Burst/chuỗi hành vi ngắn — dùng NTLM hash đánh cắp để logon nhiều nơi trong thời gian ngắn.

**Logic cốt lõi:**
- Base: `(LogonType=3 AND AuthenticationPackageName="NTLM" AND KeyLength=0) OR LogonType=9`.
- **Bài học quan trọng:** `AuthenticationPackageName` không đáng tin để phân biệt PtH, vì giao thức đàm phán cuối (Kerberos/NTLM) không phản ánh nguồn gốc credential — DCOM/WMI có thể log "Kerberos" dù session khởi tạo từ NTLM hash bị đánh cắp.
- **Field IP đúng là `src`/`dest`, không phải `IpAddress`** trong TA đang dùng — đây là lỗi thực tế đã gặp khiến rule không match dù attack có thật.
- Whitelist qua `lab_whitelist` (loại Scanner, DomainController).
- Tách riêng `TargetUserName="ANONYMOUS LOGON"` — đây là null-session enumeration, khác bản chất PtH, không nên gộp chung.

**Về binning:** giữ được ở mức chấp nhận (5-15 phút) cho lateral movement burst thật; có thể nâng cấp bằng `streamstats time_window` nếu muốn bắt cả kịch bản "rải chậm để né threshold" — đây là đánh đổi recall/cost, không bắt buộc như nhóm dưới.

**Threshold khuyến nghị:** `targeted_servers >= 2` (1 nguồn NTLM chạm ≥2 server khác nhau trong thời gian ngắn là tín hiệu mạnh).

---

## 4. Pass-the-Ticket (PtT)

**Data source:** `index=windows EventCode=4768` (TGT) + `EventCode=4624 LogonType=3 AuthenticationPackageName=Kerberos` (sử dụng ticket)

**Bản chất anomaly:** Thiếu vắng sự kiện tiền đề trong một phiên sống dài (TGT sống tới 10h) — **bắt buộc bỏ binning cố định**, vì mọi phiên hợp lệ dài hơn 1 bin sẽ tự động false positive.

**Logic cốt lõi:**
- `streamstats current=f window=0` carry-forward `lastTGTtime`/`lastTGTip` theo từng `User`, xuyên suốt thời gian (không giới hạn bin).
- Flag khi: (a) có Kerberos logon nhưng **chưa từng** thấy TGT request cho user đó, hoặc (b) IP logon khác IP đã xin TGT, hoặc (c) khoảng cách thời gian vượt ticket lifetime tối đa (10h).
- Chuẩn hoá IP: gộp các dạng loopback/link-local (`::1`, `127.0.0.1`, `fe80::...`) về `host` để tránh so sánh nhầm giữa traffic nội bộ với traffic thật khác nguồn.
- Loại trừ traffic giữa các DC (`is_domain_controller!="true"`) vì đây là replication hợp lệ.

**Vấn đề performance:** `sort 0 | streamstats window=0` tốn tài nguyên nếu scan toàn lịch sử. Giải pháp production: tách thành 2 saved search — (1) baseline builder ghi `lastTGTtime`/`lastTGTip` vào accumulating lookup mỗi 5 phút (luôn dedupe bằng `stats latest(...) by User` trước khi `outputlookup`, không dùng `append=true` thô vì sẽ phình file và tạo multivalue sai), (2) detection rule chỉ quét 5 phút mới nhất + `lookup` O(1) vào baseline đó.

---

## 5. Overpass-the-Hash

**Data source:** `index=windows EventCode=4624 LogonType=9` (NewCredentials) + `EventCode=4768` (TGT xin bằng hash/AES key)

**Bản chất anomaly:** Giống PtT — cần theo dõi chuỗi hành vi qua thời gian, không phải burst đơn thuần. **Bỏ binning cố định.**

**Logic cốt lõi:**
- ⚠️ Bug đã sửa: rule gốc dùng sai `sourcetype=WinEventLog:Security` (field kiểu cũ `Logon_Type`/`Account_Name`) trong khi toàn bộ pipeline dùng `XmlWinEventLog` (field `LogonType`/`TargetUserName`) — khiến rule cũ luôn trả về rỗng. Đã chuẩn hoá lại đúng sourcetype/field.
- ⚠️ Bug đã sửa: `transaction` + `search EventCode=4768` phía sau không hoạt động vì base search ban đầu chỉ pull `EventCode=4624`, không có 4768 nào để `search` lọc ra. Sửa bằng cách pull cả 2 EventCode ngay từ đầu.
- Logic mới: `streamstats` gom theo `(User, IPv4)`, flag khi có cả `NewCred_Logons` (LogonType=9) và `TGT_Requests` (4768) xảy ra gần nhau — dấu hiệu hash/AES key được dùng để xin TGT hợp lệ ngay sau khi tạo phiên NewCredentials.
- Lưu ý: kỹ thuật Rubeus `asktgt` gọi trực tiếp AS-REQ tới KDC **không** luôn tạo LogonType=9 cục bộ — nên rule này chỉ bắt được nhánh đi qua `LogonUser`/`runas /netonly`, cần bổ sung nhánh riêng nếu muốn cover cả trường hợp AS-REQ trực tiếp.

---

## 6. Golden Ticket

**Data source:** `index=windows EventCode=4768` (TGT hợp lệ) + `EventCode=4769` (TGS request)

**Bản chất anomaly:** TGS được cấp mà **chưa từng** có TGT hợp lệ tương ứng — vì Golden Ticket được ký offline, không qua DC ở bước AS-REQ. **Bỏ binning cố định** vì lý do tương tự PtT.

**Logic cốt lõi:**
- ⚠️ Bug nghiêm trọng đã sửa: filter `ServiceName!="krbtgt*"` từng bị áp dụng ngay từ đầu pipeline, vô tình loại bỏ **toàn bộ** event 4768 (vì 4768 luôn có `ServiceName=krbtgt`) — khiến `TGT_Requests` luôn = 0, rule mất khả năng phân biệt và flag mọi TGS request. Đã sửa: chỉ áp filter đó cho nhánh 4769.
- `streamstats` carry-forward `lastTGTtime` theo `User`, flag khi có 4769 mà `lastTGTtime` null (chưa từng có TGT) hoặc vượt lifetime.
- **Enrichment mạnh nhất:** liên kết ngược với rule DCSync — vì Golden Ticket cần hash `krbtgt`, mà cách phổ biến nhất để lấy được là DCSync trước đó. Nếu tìm thấy `PriorDCSyncEvents > 0` cho cùng user/host trong 24h trước → gần như chắc chắn true positive.

---

## 7. Silver Ticket

**Data source:** `index=windows EventCode=4769` (TGS trên DC) + `EventCode=4624 LogonType=3 AuthenticationPackageName=Kerberos` (logon vào server đích)

**Bản chất anomaly:** DC "bị mù" — Silver Ticket giả mạo TGS offline nên logon vào server xảy ra mà DC không hề ghi nhận TGS tương ứng. Đã bỏ binning, dùng carry-forward.

**Logic cốt lõi:**
- ⚠️ Bug đã sửa: `lookup lab_whitelist ip as IP OUTPUT role as src_role` dùng sai tên field (`IP` thay vì `IPv4` đã eval trước đó) khiến lookup không match, filter DC vô hiệu.
- `streamstats` carry-forward `lastTGSTime`/`lastTGSService` theo `User`, flag logon vào server non-DC khi không có TGS gần đó (khoảng cách > 15 phút, ngưỡng heuristic cần tinh chỉnh theo baseline thật) hoặc chưa từng có TGS.
- Lưu ý: điều kiện `User!="*$"` sẽ bỏ sót Silver Ticket giả mạo cho **computer account** (ví dụ `DC-02$`) — đúng kịch bản lab đã mô phỏng; cần thêm nhánh riêng không loại `*$` nếu muốn cover trường hợp này.
- Nên dùng lookup `is_domain_controller` thay vì hardcode `host="DC-01*" OR host="DC-02*"` để dễ mở rộng khi có thêm DC.

---

## 8. DCSync

**Data source:** `index=windows EventCode=4662` (replication rights) + `EventCode=4624` (lịch sử logon)

**Bản chất anomaly:** Tài khoản thực hiện replication (DRSUAPI) nhưng chưa từng logon hợp lệ từ một DC — dấu hiệu replication bị lợi dụng từ máy không phải DC.

**Logic cốt lõi:**
- Lọc 4662 theo GUID quyền replication (`1131f6ad-...`, `19195a5b-...`, `89e95b76-...`, hoặc chuỗi `Replicating Directory Changes`).
- `join type=left` với lịch sử logon 4624 đã lookup `is_domain_controller` theo IP.
- ⚠️ Bug đã sửa: `mvfind(LogonFromDC,"true")==-1` sai — `mvfind()` trả về **NULL** khi không tìm thấy, không phải `-1` như convention JS. Sửa bằng `isnull(mvfind(...))`.
- Flag khi `LogonFromDC` không chứa `"true"` nào — tức tài khoản chưa từng đăng nhập hợp lệ từ IP thuộc DC trước khi thực hiện replication.

**Không cần streamstats phức tạp** — vì đây là so sánh "tập hợp toàn bộ lịch sử logon của user" (dùng `values()` trong `stats`), không phải carry-forward theo mốc thời gian cụ thể.

---

## 9. DCShadow

**Data source:** `index=windows EventCode=4742` (SPN registration) — **thiếu** `EventCode=5137` (tạo object Configuration partition) do chưa cấu hình SACL.

**Bản chất anomaly:** Một máy không phải DC tự đăng ký làm rogue DC (SPN `GC/` hoặc GUID replication `E3514235-...`) rồi đẩy thay đổi qua cơ chế replication.

**Logic cốt lõi:**
- `ServicePrincipalNames="*GC/*" OR ServicePrincipalNames="*E3514235-4B06-11D1-AB04-00C04FC2DCD2*"` trên Computer object không thuộc danh sách DC.
- **Giới hạn hiện tại:** chỉ dựa vào 1 lớp tín hiệu (4742) — độ tin cậy thấp hơn thiết kế "multi-layer" mà chính report đề ra ban đầu (4742 + 5137 + RPC/DRS traffic + Kerberos auth tới DRS SPN).
- **Nguyên nhân thiếu 5137:** không phải bug SPL, mà do AD **không có SACL mặc định** trên `CN=Configuration` — cần chủ động thêm Audit Rule (`New-Object System.DirectoryServices.ActiveDirectoryAuditRule`) trên container này và bật `Audit Directory Service Changes = Success` trong GPO, việc này nên được ưu tiên xử lý ở tầng hạ tầng trước khi coi rule DCShadow là hoàn chỉnh.
- Query hiện tại chỉ nên coi là **detection tạm, độ tin cậy Medium**, không phải bản hoàn chỉnh.

---

## Bảng tổng hợp nhanh

| Kỹ thuật | Cần streamstats/bỏ binning? | Bug lớn đã sửa | Enrichment mạnh nhất |
|---|---|---|---|
| Kerberoasting | Không (giữ bin 5m) | Wildcard thiếu ở Suricata rule | RC4 scoring, tool exec (Rubeus) |
| AS-REP Roasting | Không (giữ bin 5m) | `where count>0` no-op | Correlate Event 4738 |
| Pass-the-Hash | Tuỳ chọn | Sai field IP (`src` thay vì `IpAddress`), sai giả định `AuthenticationPackageName` | LSASS access (Sysmon Event 10) |
| Pass-the-Ticket | **Bắt buộc** | — | LSASS access trên máy nguồn |
| Overpass-the-Hash | **Bắt buộc** | Sai sourcetype/field, `transaction` không lấy được dữ liệu | Process tạo TGT bất thường |
| Golden Ticket | **Bắt buộc** | Filter loại bỏ luôn cả baseline 4768 | **Liên kết ngược với DCSync** |
| Silver Ticket | **Bắt buộc** | Sai field trong `lookup` | Process/PsExec ngay sau logon |
| DCSync | Không cần (dùng `values()`) | `mvfind()` so `-1` thay vì `isnull()` | Tool exec (mimikatz/secretsdump) |
| DCShadow | N/A | Thiếu Event 5137 (cần SACL, không phải bug SPL) | Object Configuration partition |

**Nguyên tắc chung rút ra:** binning cố định chỉ đúng cho bài toán "phát hiện burst trong lúc xảy ra" (Kerberoasting, AS-REP Roasting); mọi bài toán dạng "kiểm tra có sự kiện tiền đề trong một phiên sống dài hay không" (PtT, Golden/Silver Ticket, Overpass-the-Hash) đều cần carry-forward logic, và nên tách baseline-building ra khỏi detection real-time khi đưa vào production để kiểm soát chi phí.
