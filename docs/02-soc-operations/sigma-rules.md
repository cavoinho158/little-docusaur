---
id: sigma-rules
title: Sigma Rules — Chuẩn hóa Logic Phát hiện Đa nền tảng
sidebar_label: Sigma Rules
sidebar_position: 2
description: Kiến trúc và thực hành Sigma rule — từ cú pháp YAML, modifiers, correlation rules, cơ chế chuyển đổi pySigma (Backend & Pipeline) đến quy trình vận hành dưới góc nhìn SOC Analyst, Detection Engineer và Security Engineer.
---

# Sigma Rules: Chuẩn hóa Logic Phát hiện Đa nền tảng

> Tài liệu tổng hợp và mở rộng từ topic *Sigma* (TryHackMe), kết hợp nghiên cứu chuyên sâu về kiến trúc `pySigma`, chuẩn Correlation mới và quy trình Detection-as-Code. Nội dung được thiết kế cho cả ba vai trò cốt lõi trong trung tâm điều hành an ninh mạng: **SOC Analyst**, **Detection Engineer** và **Security Engineer**.

---

## 1. Bài toán phân mảnh SIEM và sự ra đời của Sigma

Khi bước qua giai đoạn chỉ xác nhận cảnh báo (alert acknowledgment) ở cấp độ L1, một SOC analyst L2+ bắt đầu phải đọc hiểu sâu logic phát hiện, tìm nguyên nhân gốc rễ khiến một rule kích hoạt sai và đề xuất phương án tinh chỉnh. Tuy nhiên, rào cản lớn nhất trong ngành an ninh mạng hiện nay là sự phân mảnh của các nền tảng SIEM: mỗi hệ thống sử dụng một ngôn ngữ truy vấn riêng biệt và một lược đồ dữ liệu (data schema) hoàn toàn khác nhau.

Hãy hình dung bạn vừa nghiên cứu một kỹ thuật tấn công phổ biến: kẻ tấn công thực thi PowerShell với tham số `-EncodedCommand` để che giấu payload dưới dạng chuỗi Base64 nhằm qua mặt các cơ chế kiểm tra chuỗi thuần túy. Cùng một ý tưởng phát hiện đó, khi triển khai thực tế trên ba nền tảng SIEM phổ biến sẽ tạo ra ba câu truy vấn hoàn toàn không tương thích:

| Nền tảng SIEM | Ngôn ngữ | Câu truy vấn tương ứng |
|---|---|---|
| **Splunk** | SPL | `EventCode=1 Image="*\\powershell.exe" CommandLine="*-EncodedCommand*"` |
| **Microsoft Sentinel** | KQL | `SecurityEvent \| where EventID == 4688 \| where NewProcessName endswith "\\powershell.exe" \| where CommandLine contains "-EncodedCommand"` |
| **Elastic SIEM** | EQL | `process where process.name == "powershell.exe" and process.command_line : "*-EncodedCommand*"` |

Bản chất logic là một, nhưng cú pháp, toán tử so sánh, tên bảng và tên trường (`Image` vs `NewProcessName` vs `process.name`) hoàn toàn khác biệt. Sự phân mảnh này gây ra hai bài toán vận hành nghiêm trọng:

1. **Rủi ro khóa chặt nhà cung cấp (Vendor Lock-in) và chi phí chuyển đổi:** Nếu doanh nghiệp quyết định chuyển đổi từ Splunk sang Microsoft Sentinel hoặc Elastic vào quý tới, hàng trăm detection rule đang vận hành sẽ phải được viết lại, kiểm thử và tinh chỉnh thủ công từ đầu — một khối lượng công việc tiêu tốn nhiều tháng nhân sự.
2. **Bài toán kinh tế tại các đơn vị MSSP:** Tại các nhà cung cấp dịch vụ an ninh mạng quản lý (Managed Security Service Provider), đội ngũ vận hành không chỉ làm việc trên một SIEM duy nhất. Khách hàng A dùng Splunk, khách hàng B dùng Sentinel, khách hàng C dùng QRadar hoặc Wazuh. Nếu không có một định dạng chung, mỗi khi xuất hiện một CVE mới hoặc chiến dịch APT mới, đội ngũ phải viết và duy trì ba bộ rule riêng biệt.

**Sigma** ra đời vào năm 2017 (được khởi xướng bởi Florian Roth và Thomas Patzke) để giải quyết triệt để khoảng trống này. Sigma là một định dạng chữ ký mở, tổng quát, dựa trên cấu trúc YAML, cho phép mô tả các sự kiện log đáng ngờ theo cách độc lập với nhà cung cấp (vendor-agnostic). Cách dễ hình dung nhất về vị trí của Sigma là đặt nó cạnh hai chuẩn mở kinh điển khác trong ngành:

| Định dạng chuẩn | Đối tượng áp dụng | Vai trò trong phòng thủ |
|---|---|---|
| **Snort / Suricata rules** | Network traffic (PCAP / gói tin trên đường truyền) | Mô tả cấu trúc gói tin và luồng mạng độc hại ở tầng Network (NIDS/NIPS). |
| **YARA rules** | Files & Memory (chuỗi byte / mẫu mã độc) | Nhận diện chữ ký nhị phân hoặc chuỗi đặc trưng bên trong tệp tin và bộ nhớ tiến trình. |
| **Sigma rules** | Log events (sự kiện nhật ký hệ thống & ứng dụng) | Mô tả hành vi đáng ngờ được ghi nhận trong log, độc lập với nền tảng SIEM lưu trữ. |

Trong vòng đời Detection Engineering (Detection Life Cycle), Sigma đóng vai trò là **portable artifact** nằm ngay tại giai đoạn *Step 3: Detection Design*. Thay vì viết thẳng bằng SPL hay KQL, kỹ sư viết logic một lần duy nhất bằng Sigma, sau đó sử dụng công cụ biên dịch để xuất ra câu truy vấn tương ứng cho bất kỳ SIEM nào ở bước triển khai:

```
┌───────────────────┐     ┌───────────────────┐     ┌────────────────────────────────┐
│ 1. Threat Research│ ──► │  2. Data Review   │ ──► │ 3. Detection Design (SIGMA YAML)│
└───────────────────┘     └───────────────────┘     └───────────────┬────────────────┘
                                                                    │
                                                     [ Biên dịch qua sigma-cli ]
                                                                    │
                                      ┌─────────────────────────────┼─────────────────────────────┐
                                      ▼                             ▼                             ▼
                            ┌───────────────────┐         ┌───────────────────┐         ┌───────────────────┐
                            │    Splunk SPL     │         │   Sentinel KQL    │         │    Elastic EQL    │
                            └───────────────────┘         └───────────────────┘         └───────────────────┘
```

Bản thân Sigma không chỉ là một định dạng file đơn lẻ mà là cả một hệ sinh thái hoàn chỉnh bao gồm:
- **Sigma Rules:** Các tệp cấu hình `.yml` định nghĩa logic phát hiện.
- **SigmaHQ Repository:** Kho lưu trữ cộng đồng mở trên GitHub (`SigmaHQ/sigma`) với hơn 3.000+ detection rule được đóng góp và kiểm duyệt bởi các chuyên gia toàn cầu.
- **pySigma & sigma-cli:** Bộ thư viện lõi và công cụ dòng lệnh thế hệ mới dùng để kiểm tra cú pháp (`check`) và biên dịch (`convert`) rule Sigma sang ngôn ngữ đích.
- **Uncoder.io / sigconverter.io:** Các nền tảng web hỗ trợ dịch nhanh Sigma rule sang hàng chục ngôn ngữ SIEM/EDR trực tiếp trên trình duyệt mà không cần cài đặt môi trường cục bộ.

---

## 2. Giải phẫu cấu trúc một Sigma rule (The YAML Skeleton)

Mọi Sigma rule, dù đơn giản hay phức tạp, đều tuân thủ một bộ khung YAML thống nhất gồm 4 khối chức năng: **Metadata**, **Log Source**, **Detection** và **Triage**. Việc nắm vững bộ khung này giúp bạn mở bất kỳ rule nào trong kho SigmaHQ và hiểu ngay lập tức mục tiêu cũng như cơ chế hoạt động của nó.

Dưới đây là một rule hoàn chỉnh phát hiện hành vi lạm dụng công cụ có sẵn trên hệ điều hành (`certutil.exe` — một Living-off-the-Land Binary) để tải tệp từ xa:

```yaml
title: Certutil Download
id: 9a1b2c3d-4e5f-6789-abcd-ef0123456789
status: experimental
description: Detects the use of certutil.exe to download remote files, a common LOLBin technique.
references:
  - https://attack.mitre.org/techniques/T1105/
author: SOC Team
date: 2025/01/15
tags:
  - attack.command_and_control
  - attack.t1105
logsource:
  category: process_creation
  product: windows
detection:
  selection:
    Image|endswith: '\certutil.exe'
    CommandLine|contains: '-urlcache'
  condition: selection
falsepositives:
  - Legitimate certificate operations
level: medium
```

### Khối 1: Metadata — Bản đồ định hướng cho người vận hành

Khối metadata nằm ở đầu tệp YAML. Dù không trực tiếp tham gia vào việc so khớp dữ liệu trong SIEM, đây lại là phần quyết định chất lượng xử lý sự cố của SOC analyst. Nó tạo ra sự khác biệt giữa một cảnh báo vô hồn kiểu *"Rule #402 vừa kích hoạt, hãy đi điều tra"* và một cảnh báo cung cấp đầy đủ ngữ cảnh: hành vi này là gì, tại sao nó nguy hiểm, liên kết tới bài phân tích CTI nào và ánh xạ vào kỹ thuật MITRE ATT&CK nào.

| Trường (Field) | Ý nghĩa và quy tắc sử dụng |
|---|---|
| `title` | Tên ngắn gọn, súc tích của detection (nên gói gọn trên một dòng, dưới 256 ký tự). |
| `id` | Mã định danh duy nhất toàn cầu (UUID v4). Được sinh một lần khi tạo rule và không bao giờ thay đổi để duy trì liên kết lịch sử. |
| `status` | Trạng thái trưởng thành trong vòng đời: `experimental` (mới viết, cần kiểm chứng), `test` (đang thử nghiệm), `stable` (đã ổn định cho production), `deprecated` hoặc `unsupported`. |
| `description` | Mô tả rõ rule phát hiện hành vi gì và ý nghĩa bảo mật của hành vi đó. |
| `references` | Danh sách URL dẫn tới báo cáo Threat Intelligence, CVE, bài blog nghiên cứu hoặc tài liệu kỹ thuật làm cơ sở cho rule. |
| `author` | Tên cá nhân hoặc nhóm tác giả biên soạn. |
| `date` / `modified` | Ngày khởi tạo và ngày cập nhật gần nhất (theo chuẩn định dạng `YYYY/MM/DD` hoặc `YYYY-MM-DD`). |
| `tags` | Nhãn phân loại, quan trọng nhất là ánh xạ chiến thuật và kỹ thuật MITRE ATT&CK theo chuẩn chữ thường (ví dụ: `attack.execution`, `attack.t1059.001`, hoặc mã CVE như `cve.2023.1234`). |

### Khối 2: Log Source — Trừu tượng hóa nguồn dữ liệu

Khối `logsource` thông báo cho bộ chuyển đổi (converter) biết loại dữ liệu nhật ký nào mà rule này cần truy vấn. Nếu không có khối này, công cụ chuyển đổi sẽ không thể biết phải hướng câu truy vấn vào bảng sự kiện tiến trình của Sysmon, nhật ký bảo mật của Windows, hay log truy cập của máy chủ web.

```yaml
logsource:
  category: process_creation
  product: windows
  service: sysmon # Tùy chọn
```

Ba khóa cấu thành nên `logsource` bao gồm:
- **`category`:** Phân loại bản chất của sự kiện log. Các giá trị phổ biến nhất trên endpoint gồm `process_creation` (khởi tạo tiến trình), `network_connection` (kết nối mạng), `file_event` (tạo/ghi tệp), `registry_event` / `registry_set` (thay đổi Registry), `dns_query` (truy vấn DNS), `image_load` (nạp DLL), và `ps_script` (PowerShell Script Block Logging).
- **`product`:** Hệ điều hành, nền tảng đám mây hoặc ứng dụng sinh ra log. Ví dụ: `windows`, `linux`, `macos`, `aws`, `azure`, `m365`, `okta`, `zeek`.
- **`service`:** Dịch vụ hoặc kênh log cụ thể bên trong sản phẩm đó. Ví dụ trên Windows có `security`, `system`, `sysmon`, `powershell`, `windefend`; trên Linux có `auditd`, `syslog`, `auth`.

Điểm mạnh cốt lõi của thiết kế này là **tính trừu tượng**. Khi bạn chỉ khai báo `category: process_creation` và `product: windows` mà không khóa cứng vào `service`, rule đó sẽ mang tính khái quát cao: nó có thể được biên dịch để chạy trên cả môi trường dùng **Sysmon Event ID 1** lẫn môi trường chỉ bật **Windows Security Event ID 4688**. Việc dịch từ khái niệm trừu tượng `process_creation` sang tên index, sourcetype hay bảng cụ thể sẽ do tầng Pipeline đảm nhận.

---

## 3. Logic phát hiện cốt lõi: Selections, Modifiers và Conditions

Khối `detection` là trái tim của mọi Sigma rule. Cấu trúc của nó luôn gồm hai thành phần tách biệt: một hoặc nhiều định nghĩa tìm kiếm (**selections**) và một biểu thức kết hợp (**condition**).

```yaml
detection:
  selection_img:
    Image|endswith: '\whoami.exe'
    CommandLine|contains: '/all'
  condition: selection_img
```

### Selections: Các khối điều kiện có định danh

Một `selection` là một khối được đặt tên chứa các cặp `trường: giá trị` dùng để đối sánh với sự kiện log. Tên của khối do người viết tự chọn (`selection`, `selection_cli`, `filter_admin`, `keywords`...), nhưng cộng đồng SigmaHQ tuân thủ quy ước: dùng tiền tố `selection_` cho các mẫu muốn bắt (inclusion) và `filter_` cho các mẫu muốn loại trừ (exclusion).

Hãy hình dung mỗi `selection` giống như một cặp dấu ngoặc đơn `(...)` được đặt tên trong các ngôn ngữ truy vấn. Quy tắc kết hợp mặc định bên trong một selection rất rõ ràng:
1. **Giữa các trường khác nhau trong cùng một selection:** Liên kết bằng toán tử **`AND`**. Ở ví dụ trên, sự kiện phải thỏa mãn đồng thời cả `Image` kết thúc bằng `\whoami.exe` VÀ `CommandLine` chứa `/all`.
2. **Giữa các giá trị trong một danh sách (YAML list) dưới cùng một trường:** Liên kết bằng toán tử **`OR`**.

```yaml
selection:
  Image|endswith:
    - '\whoami.exe'
    - '\net.exe'
```
Đoạn trên sẽ khớp nếu `Image` kết thúc bằng `\whoami.exe` **HOẶC** `\net.exe`. Ngoài ra, Sigma hỗ trợ ký tự đại diện (`*` cho nhiều ký tự, `?` cho một ký tự) ngay trong chuỗi thông thường, ví dụ: `CommandLine: '*-EncodedCommand*'`.

### Modifiers: Điều khiển hành vi đối sánh

Theo mặc định, phép gán `Field: 'value'` trong Sigma là phép so sánh bằng tuyệt đối (exact match, thường không phân biệt hoa thường tùy backend). Để kiểm tra chuỗi con, tiền tố, hậu tố hay biểu thức chính quy, bạn gắn thêm **modifier** vào sau tên trường thông qua ký tự ống (`|`). Các modifier có thể được nối chuỗi (chain) với nhau.

| Modifier | Cơ chế hoạt động | Ví dụ áp dụng thực tế |
|---|---|---|
| `contains` | Khớp chuỗi con ở bất kỳ vị trí nào trong trường (`*value*`). | `CommandLine\|contains: 'mimikatz'` |
| `startswith` | Khớp phần đầu của giá trị trường (`value*`). | `TargetFilename\|startswith: 'C:\Users\Public\'` |
| `endswith` | Khớp phần cuối của giá trị trường (`*value`). Rất quan trọng khi bắt tên file thực thi trong đường dẫn đầy đủ. | `Image\|endswith: '\powershell.exe'` |
| `all` | Thay đổi hành vi mặc định của YAML list từ `OR` sang **`AND`** — tất cả các phần tử trong danh sách đều phải xuất hiện trong trường đó (không quan trọng thứ tự). | `CommandLine\|contains\|all:` với danh sách `['powershell', 'DownloadString', 'http']` |
| `re` | Đối sánh bằng biểu thức chính quy (Regular Expression). Có thể kèm sub-modifier `\|i` (case-insensitive). | `ProcessName\|re: '^[a-z]{8}\.exe$'` |
| `base64` / `base64offset` | Tự động mã hóa giá trị sang Base64 trước khi tìm kiếm. `base64offset` tính toán cả 3 biến thể dịch chuyển byte để bắt chuỗi dù nó nằm ở vị trí nào trong khối dữ liệu gốc. | `CommandLine\|base64offset\|contains: 'Invoke-Mimikatz'` |
| `utf16le` / `wide` | Chuyển chuỗi sang bảng mã UTF-16LE (thường kết hợp với `base64offset` như `\|utf16le\|base64offset\|contains` để bắt lệnh PowerShell `-enc`). | Phát hiện payload ẩn trong `powershell.exe -e ...` |
| `windash` | Tự động mở rộng các tham số dòng lệnh bắt đầu bằng `-` hoặc `/` thành mọi biến thể dấu gạch ngang mà Windows chấp nhận (`-`, `/`, `–`, `—`, `―`). | `CommandLine\|windash\|contains: '-enc'` sẽ bắt cả `/enc`, `-enc`, `–enc`. |
| `cidr` | Đối sánh địa chỉ IP với dải mạng theo ký hiệu CIDR. | `DestinationIp\|cidr: '10.0.0.0/8'` |

### Condition và các trường Triage (`falsepositives`, `level`)

Trường `condition` là biểu thức Boolean quyết định khi nào toàn bộ rule sẽ kích hoạt dựa trên kết quả của các khối selection. Bên cạnh các toán tử cơ bản `and`, `or`, `not` và dấu ngoặc `()`, Sigma cung cấp các biểu thức rút gọn (quantifiers) cực kỳ linh hoạt khi làm việc với nhiều selection:

| Biểu thức Condition | Ý nghĩa thực thi |
|---|---|
| `selection` | Khớp khi khối `selection` đúng. |
| `selection and not filter_admin` | Khớp khi `selection` đúng, ngoại trừ trường hợp `filter_admin` cũng đúng. |
| `1 of selection_*` | Khớp nếu **ít nhất một** khối có tên bắt đầu bằng `selection_` đúng (tương đương phép `OR` giữa tất cả `selection_*`). |
| `all of selection_*` | Khớp khi **tất cả** các khối có tên bắt đầu bằng `selection_` đều đúng (tương đương phép `AND`). |
| `1 of them` / `all of them` | Áp dụng phép `OR` hoặc `AND` trên toàn bộ các khối selection có mặt trong rule. |

Cuối cùng, hai trường ở đáy file kết thúc định nghĩa rule:
- **`falsepositives`:** Liệt kê các kịch bản hợp pháp trong thực tế có thể làm rule kích hoạt (ví dụ: hoạt động quản trị định kỳ, script kiểm kê tài sản của IT Helpdesk). Đây là dòng đầu tiên SOC analyst đọc khi triage để kiểm tra xem sự kiện có thuộc diện ngoại lệ đã biết hay không.
- **`level`:** Mức độ nghiêm trọng gồm 5 cấp: `informational`, `low`, `medium`, `high`, và `critical`. Trường này được ánh xạ trực tiếp sang mức độ ưu tiên (Severity/Priority) của cảnh báo trên SIEM.

---

## 4. Thiết kế Sigma rule thực chiến: Từ phân tích hành vi đến YAML

Đọc hiểu một rule có sẵn khá dễ dàng, nhưng tự tay thiết kế một rule từ đầu đòi hỏi kỹ năng phân tích hình thái dữ liệu (data shape). Hãy xét một bài toán thực tế: **Phát hiện các lệnh Reconnaissance (do thám nội bộ) mà kẻ tấn công thường chạy trong vài phút đầu tiên sau khi chiếm được quyền thực thi trên một máy trạm Windows.**

Danh sách các lệnh mục tiêu cần phát hiện bao gồm:
```text
whoami                  net user /domain
whoami /priv            net group "Domain Admins" /domain
whoami /groups          net localgroup Administrators
ipconfig /all           systeminfo
nltest /dclist:corp.local
```

Trước khi bắt tay vào gõ YAML, một detection engineer phải dừng lại để phân loại bản chất tín hiệu của các lệnh này. Không phải mọi lệnh trên đều có thể bắt theo cùng một cách:

1. **Nhóm 1 — Standalone Recon Binaries:** Các tiện ích như `whoami.exe`, `ipconfig.exe`, `nltest.exe` và `systeminfo.exe` rất hiếm khi được người dùng văn phòng thông thường tự mở lên chạy. Bản thân sự xuất hiện của các tệp thực thi này trong log đã là một tín hiệu đáng chú ý.
2. **Nhóm 2 — Dual-use Binaries đòi hỏi ngữ cảnh tham số:** Tiện ích `net.exe` (và tệp thực thi thực sự đằng sau nó là `net1.exe`) được hệ điều hành Windows và các script đăng nhập gọi liên tục cho các tác vụ hợp pháp (như `net use` để ánh xạ ổ đĩa mạng). Nếu chỉ bắt `Image|endswith: '\net.exe'`, SOC sẽ ngay lập tức bị nhấn chìm trong cảnh báo giả. Với `net.exe`, tín hiệu độc hại nằm ở **tham số dòng lệnh** (`user`, `group`, `localgroup`).

Sự khác biệt về hình thái này dẫn đến quyết định thiết kế: chúng ta không thể nhồi tất cả vào một selection duy nhất mà phải tách thành hai khối `selection_` riêng biệt, sau đó hợp nhất chúng ở `condition`.

```yaml
title: Windows Recon Commands Detection
id: 17769c90-230e-488b-a463-e05c083fd48c
status: experimental
description: Detects execution of common Windows reconnaissance commands often used by attackers during initial discovery phases.
references:
  - https://attack.mitre.org/techniques/T1087/
  - https://attack.mitre.org/techniques/T1082/
  - https://attack.mitre.org/techniques/T1016/
author: SOC Detection Team
date: 2026/01/01
tags:
  - attack.discovery
  - attack.t1087
  - attack.t1082
  - attack.t1016
logsource:
  category: process_creation
  product: windows
detection:
  selection_recon_binaries:
    Image|endswith:
      - '\whoami.exe'
      - '\ipconfig.exe'
      - '\nltest.exe'
      - '\systeminfo.exe'
  selection_net_recon:
    Image|endswith:
      - '\net.exe'
      - '\net1.exe'
    CommandLine|contains:
      - ' user'
      - ' group'
      - ' localgroup'
  condition: 1 of selection_*
falsepositives:
  - Legitimate IT administrator activity
  - Helpdesk troubleshooting scripts
  - Asset inventory and CMDB tools
level: low
```

Có ba điểm kỹ thuật quan trọng cần lưu ý trong thiết kế trên:
- **Gom nhóm hợp lý trong `selection_recon_binaries`:** Thay vì viết 4 selection rời rạc cho 4 file `.exe`, việc đưa chúng vào một YAML list dưới `Image|endswith` giúp tận dụng logic `OR` tự nhiên, làm rule gọn gàng và dễ bảo trì hơn.
- **Khoảng trắng dẫn đầu (Leading space) trong `' user'`:** Khoảng trắng trước chữ `user`, `group`, `localgroup` không phải là lỗi đánh máy. Nếu chỉ viết `'user'`, phép so sánh `contains` sẽ khớp nhầm với mọi đường dẫn hoặc tham số hợp pháp có chứa chuỗi con đó như `C:\Users\admin\`, `--username`, hay `userprofile`. Khoảng trắng đóng vai trò neo (anchor) từ khóa vào vị trí bắt đầu của một tham số dòng lệnh.
- **Sử dụng `1 of selection_*`:** Biểu thức này tương đương với `selection_recon_binaries or selection_net_recon`, nhưng có khả năng mở rộng tốt hơn. Nếu sau này bạn muốn bổ sung thêm khối `selection_qprocess_recon`, bạn chỉ cần thêm khối đó vào phần `detection` mà không cần sửa lại dòng `condition`.

Sau khi viết xong, bước bắt buộc trước khi commit hoặc biên dịch là kiểm tra tính hợp lệ của cấu trúc YAML bằng `sigma-cli`:

```bash
sigma check first-detection.yml
```
Lệnh `sigma check` sẽ xác thực xem tệp YAML có đúng chuẩn cú pháp hay không, các trường bắt buộc đã đủ chưa, UUID có hợp lệ không và khối `detection` có lỗi tham chiếu nào không.

---

## 5. Kiến trúc chuyển đổi pySigma: Backend và Processing Pipeline

Một câu hỏi cốt lõi cần làm rõ: *File YAML của Sigma thực chất chạy ở đâu?* Câu trả lời là: tự bản thân nó không chạy trên bất kỳ SIEM nào cả. Sigma được thiết kế có chủ đích như một **đặc tả logic (specification)** chứ không phải một công cụ thực thi. Để biến đặc tả đó thành câu truy vấn chạy được, chúng ta cần bộ chuyển đổi `sigma-cli` (hoặc thư viện `pySigma`) với hai thành phần phối hợp chặt chẽ: **Backend** và **Pipeline**.

Hãy hình dung quá trình chuyển đổi giống như việc dịch một công thức nấu ăn sang một nền ẩm thực khác: **Backend** đảm nhận việc dịch ngôn ngữ (từ tiếng Anh sang tiếng Nhật — tức dịch cấu trúc Boolean sang cú pháp SPL/KQL/EQL), còn **Pipeline** đảm nhận việc thay thế nguyên liệu địa phương (đổi tên trường chuẩn của Sigma sang tên trường thực tế đang lưu trong SIEM của bạn).

```
┌──────────────────────┐
│   Sigma Rule (.yml)  │  (Logic trừu tượng: category=process_creation, Image, CommandLine)
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│  Processing Pipeline │  (Cờ -p: Ánh xạ logsource -> index/table; đổi Image -> NewProcessName)
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│    Target Backend    │  (Cờ -t: Sinh cú pháp đích SPL / KQL / EQL / Lucene)
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│  Executable Query    │  (Truy vấn hoàn chỉnh sẵn sàng chạy trên SIEM)
└──────────────────────┘
```

### Tại sao Pipeline lại quan trọng đến vậy?

Trong Sigma, người viết luôn sử dụng bộ tên trường chuẩn hóa (như `Image`, `CommandLine`, `ParentImage`, `ParentCommandLine` dựa trên quy ước của Sysmon). Tuy nhiên, trong thực tế vận hành, mỗi SIEM và mỗi chuẩn Data Model lại đặt tên cho các trường này hoàn toàn khác nhau:

| Trường chuẩn Sigma | Splunk (CIM Data Model) | Microsoft Sentinel / Defender XDR | Elastic SIEM (ECS Schema) |
|---|---|---|---|
| `Image` | `Processes.process_path` | `FolderPath` / `NewProcessName` | `process.executable` |
| `CommandLine` | `Processes.process` | `ProcessCommandLine` | `process.command_line` |
| `ParentImage` | `Processes.parent_process_path` | `InitiatingProcessFolderPath` | `process.parent.executable` |
| `ParentCommandLine` | `Processes.parent_process` | `InitiatingProcessCommandLine` | `process.parent.command_line` |

Nếu bạn chạy lệnh chuyển đổi mà chỉ chọn Backend (`-t`) nhưng bỏ qua Pipeline (`-p`), bộ chuyển đổi sẽ giữ nguyên tên trường `Image` và `CommandLine` trong câu truy vấn đầu ra. Khi đem câu truy vấn đó chạy trên Microsoft Sentinel (nơi trường thực tế là `FolderPath` hoặc `NewProcessName`), truy vấn sẽ không trả về bất kỳ kết quả nào hoặc báo lỗi không tìm thấy cột.

Dưới đây là lệnh biên dịch thực tế cho rule `first-detection.yml` sang 3 nền tảng SIEM bằng `sigma-cli` khi kết hợp đầy đủ cả `-t` (target backend) và `-p` (processing pipeline):

```bash
# 1. Chuyển đổi sang Splunk SPL (sử dụng Splunk CIM pipeline)
sigma convert -t splunk -p splunk_cim first-detection.yml

# 2. Chuyển đổi sang Microsoft Sentinel / Defender XDR KQL
sigma convert -t kusto -p microsoft_xdr first-detection.yml

# 3. Chuyển đổi sang Elastic EQL (sử dụng Elastic Common Schema cho Windows)
sigma convert -t eql -p ecs_windows first-detection.yml
```

### 4 lỗi chuyển đổi phổ biến (Conversion Failure Modes)

Ngay cả khi file YAML đã vượt qua bước `sigma check`, quá trình chuyển đổi sang SIEM đích vẫn có thể gặp sự cố hoặc sinh ra truy vấn "chết lâm sàng" (chạy không báo lỗi nhưng không bao giờ bắt được sự kiện):

1. **Thiếu Pipeline (`Missing pipeline`):** Chạy `sigma convert -t kusto` mà quên `-p`. Truy vấn sinh ra vẫn đúng cú pháp KQL nhưng tham chiếu tới các tên trường generic của Sigma không tồn tại trong bảng log thực tế.
2. **Modifier không được Backend hỗ trợ (`Unsupported modifier`):** Một số modifier phức tạp (như biểu thức chính quy nâng cao, `fieldref` hoặc `cidr` trên một số định dạng cũ) không có hàm tương đương trên ngôn ngữ SIEM đích. Trong trường hợp này, `sigma-cli` sẽ dừng lại và thông báo rõ modifier nào không thể biên dịch.
3. **Logsource chưa được định nghĩa trong Pipeline (`Unknown logsource category`):** Khi bạn viết rule cho một nguồn log đặc thù (ví dụ: `category: webserver` hoặc ứng dụng nội bộ) nhưng lại dùng một pipeline chỉ định nghĩa mapping cho Windows endpoint.
4. **Trôi lệch tên trường trên SIEM (`Field-name drift`):** Đây là lỗi nguy hiểm nhất vì nó diễn ra âm thầm. Pipeline ánh xạ `Image` sang một tên trường từng đúng trong quá khứ, nhưng nhà cung cấp SIEM hoặc đội ngũ quản trị log nội bộ đã cập nhật parser và đổi tên trường đó. Nguyên tắc bắt buộc: **luôn kiểm thử câu truy vấn sau biên dịch trên ít nhất một sự kiện mẫu (known-good event) trước khi đưa vào vận hành.**

---

## 6. Chiến lược Tuning Sigma Rule: Giảm nhiễu mà không tạo điểm mù

Một detection rule chưa qua tinh chỉnh (untuned) sẽ gây ra hiện tượng quá tải cảnh báo (alert fatigue), nhưng một rule bị tinh chỉnh quá tay (over-tuned) sẽ tạo ra điểm mù và bỏ lọt tấn công thực sự (false negative). Trong Sigma, quá trình tuning được thực hiện trực tiếp trên tệp YAML thông qua ba kỹ thuật chính: **Exclusion Filters**, **Field-Level Refinement**, và **Stateful Promotion**.

### Kỹ thuật 1: Loại trừ có cấu trúc với `filter_*` và `not 1 of filter_*`

Giả sử rule bắt lệnh `whoami.exe` của bạn hoạt động tốt, nhưng trong môi trường doanh nghiệp có hai tài khoản dịch vụ (`svc_helpdesk` và `svc_inventory`) cùng nhóm máy trạm của phòng IT (`IT-WS-*`) thường xuyên chạy lệnh này tự động. Để loại trừ chúng, bạn bổ sung các khối mang tiền tố `filter_` và phủ định chúng trong `condition`:

```yaml
detection:
  selection:
    Image|endswith: '\whoami.exe'
  filter_admin_users:
    User|contains:
      - 'svc_helpdesk'
      - 'svc_inventory'
  filter_admin_hosts:
    Computer|startswith: 'IT-WS-'
  condition: selection and not 1 of filter_*
```

Tại sao nên dùng `selection and not 1 of filter_*` thay vì viết tường minh `selection and not filter_admin_users and not filter_admin_hosts`?
- Khi số lượng ngoại lệ tăng lên theo thời gian (thêm `filter_scanner`, `filter_backup`, `filter_edr`...), biểu thức tường minh sẽ trở nên dài dòng và rất dễ nhầm lẫn giữa `and not` với `or not` (theo định luật De Morgan).
- Cú pháp `not 1 of filter_*` mang ý nghĩa: *"Khớp với `selection`, và **không có bất kỳ** khối nào bắt đầu bằng `filter_` được phép khớp"*. Bạn có thể thêm bao nhiêu khối `filter_*` mới tùy ý mà không bao giờ phải chạm lại vào dòng `condition`.

### Kỹ thuật 2: Field-Level Refinement (Thu hẹp Selection gốc)

Không phải lúc nào thêm `filter_*` cũng là giải pháp đúng. Nếu bản thân khối `selection` ban đầu quá rộng, việc dùng filter để vá lỗi chẳng khác nào lấy rổ che nước.

Hãy xét một rule bắt mọi sự kiện khởi chạy PowerShell:
```yaml
# RẤT TỆ: Tạo ra hàng chục nghìn cảnh báo mỗi ngày
detection:
  selection:
    Image|endswith: '\powershell.exe'
  condition: selection
```
PowerShell chạy liên tục trên mọi máy Windows hiện đại (từ script quản trị, Scheduled Tasks cho đến bộ cài đặt phần mềm). Bạn không thể liệt kê hết các `filter_*` để loại trừ mọi hành vi PowerShell hợp pháp. Thay vào đó, hãy đặt câu hỏi: *Hành vi độc hại cụ thể mà mình thực sự muốn bắt là gì?* Nếu mục tiêu là bắt PowerShell hoạt động như một **download cradle** (kéo mã độc từ Internet về bộ nhớ và thực thi), hãy thu hẹp ngay tại `selection`:

```yaml
# TỐT HƠN NHIỀU: Tập trung thẳng vào hành vi Download Cradle
detection:
  selection:
    Image|endswith:
      - '\powershell.exe'
      - '\pwsh.exe'
    CommandLine|contains:
      - 'DownloadString'
      - 'DownloadFile'
      - 'Invoke-WebRequest'
      - 'Net.WebClient'
      - 'iwr '
      - 'curl '
  condition: selection
```
Bằng cách tinh chỉnh ở cấp độ trường (Field-Level Refinement), bạn loại bỏ 99% nhiễu ngay từ gốc mà không cần viết bất kỳ một filter loại trừ nào.

### Các lỗi cú pháp và logic thường gặp khi viết & tuning Sigma

Khi biên soạn hoặc sửa đổi rule Sigma, cả người mới lẫn kỹ sư có kinh nghiệm đều rất dễ mắc phải các lỗi khiến rule không thể biên dịch hoặc âm thầm mất tác dụng:

| Nhóm lỗi | Lỗi cụ thể & Ví dụ minh họa | Hậu quả | Cách khắc phục chuẩn |
|---|---|---|---|
| **Logic Tuning** | **Quên cập nhật `condition` sau khi thêm filter:** Đã viết thêm khối `filter_admin`, nhưng dòng `condition` vẫn giữ nguyên là `condition: selection`. | Khối `filter_admin` hoàn toàn vô tác dụng. Đáng chú ý là `sigma check` **không báo lỗi** vì cú pháp vẫn hợp lệ. | Luôn đổi condition sang `selection and not 1 of filter_*` ngay khi thêm filter đầu tiên. |
| **Logic Tuning** | **Dùng `contains` quá rộng:** Viết `CommandLine\|contains: 'admin'` để bắt hành vi thêm quyền admin. | Khớp nhầm vào mọi chuỗi chứa từ khóa con như `administrator`, `adminPassword`, hay thậm chí phần mềm `BadminTon.exe`. | Neo từ khóa bằng khoảng trắng (`' admin '`), dùng `startswith`/`endswith` hoặc biểu thức chính quy. |
| **Logic Tuning** | **Filter loại trừ luôn cả cuộc tấn công:** Thêm `filter_cmd` loại bỏ `ParentImage\|endswith: '\cmd.exe'` vì thấy nhiều log, trong khi kỹ thuật tấn công đang rình bắt lại khởi phát từ `cmd.exe`. | Tạo ra **False Negative** hoàn toàn — rule không bao giờ nổ trước tấn công thật nữa. | Sau mỗi lần thêm filter, bắt buộc phải chạy lại kiểm thử với mẫu log độc hại (True Positive sample) để đảm bảo rule vẫn nổ. |
| **Cú pháp YAML** | **Dùng ngoặc kép `"..."` cho đường dẫn Windows:** Viết `Image\|endswith: "\net.exe"`. | Trình phân tích YAML hiểu `\n` bên trong ngoặc kép là ký tự xuống dòng (newline escape) thay vì chuỗi `\net.exe`. | Luôn mặc định dùng **ngoặc đơn `'...'`** cho đường dẫn Windows và chuỗi chứa dấu gạch chéo ngược `\`. |
| **Cú pháp YAML** | **Chuỗi bắt đầu bằng `*` không có dấu ngoặc:** Viết `CommandLine: *-EncodedCommand*`. | Trong chuẩn YAML, ký tự `*` đứng đầu được hiểu là một alias reference, làm gãy hoàn toàn quá trình parse. | Bọc mọi chuỗi có chứa ký tự đại diện trong cặp ngoặc đơn: `'*-EncodedCommand*'`. |

---

## 7. Nâng cấp từ Atomic Rule lên Stateful Correlation Rule

Cho đến phần trước, mọi rule chúng ta xét đều là **Atomic Rule** — tức là rule đánh giá từng sự kiện log một cách độc lập. Tuy nhiên, rất nhiều kỹ thuật tấn công chỉ lộ diện khi quan sát một **tập hợp các sự kiện trong một khoảng thời gian** (Stateful Detection).

Ví dụ điển hình: Một rule đơn lẻ bắt hành vi ghi tệp mới vào thư mục `C:\Windows\Temp\`. Nếu để rule này tự sinh cảnh báo, SOC sẽ bị ngập lụt vì các trình cài đặt phần mềm, Windows Update và trình diệt virus liên tục dùng thư mục này làm bộ nhớ đệm. Thế nhưng, nếu **cùng một tiến trình (`Image`) ghi liên tiếp 50 tệp tin vào `C:\Windows\Temp\` chỉ trong vòng 2 phút**, đó lại là dấu hiệu rõ nét của hành vi gom dữ liệu (Data Staging) chuẩn bị cho bước đánh cắp dữ liệu (Exfiltration) hoặc hoạt động của Ransomware.

Trong chuẩn Sigma hiện đại (Sigma Correlation Specification), bạn giữ nguyên atomic rule ban đầu (chỉ dùng làm tầng nhận diện sự kiện cơ sở, không bật cảnh báo trực tiếp) và bọc nó bằng một **Correlation Rule** nằm ngay trong cùng tệp YAML (ngăn cách bằng `---`) hoặc tách thành tệp riêng:

```yaml
title: File Write to Windows Temp Folder (Base Atomic Rule)
name: file_write_to_windows_temp
id: 3b8e9a12-7c4d-4e1a-9f22-112233445566
status: experimental
logsource:
  category: file_event
  product: windows
detection:
  selection:
    TargetFilename|startswith: 'C:\Windows\Temp\'
  condition: selection
level: informational
---
title: Suspicious Data Staging in Temp Folder
id: 8f9d2c10-4b3a-4d5e-8c77-665544332211
status: experimental
description: Detects a burst of file-write events from a single process to C:\Windows\Temp, consistent with data staging for exfiltration.
correlation:
  type: event_count
  rules:
    - file_write_to_windows_temp
  group-by:
    - Image
    - Computer
  timespan: 2m
  condition:
    gte: 50
level: high
```

### 4 loại hình tương quan (Correlation Types) trong Sigma

Chuẩn Correlation của Sigma hỗ trợ 4 mô hình tương quan chính, đáp ứng hầu hết các kịch bản phát hiện hành vi nâng cao:

| Loại Correlation (`type`) | Nguyên lý hoạt động | Kịch bản ứng dụng thực tế |
|---|---|---|
| **`event_count`** | Đếm tổng số sự kiện khớp với rule cơ sở trong khoảng thời gian `timespan`, gom nhóm theo `group-by`. | Phát hiện Brute-force đăng nhập từ một IP, Data Staging hàng loạt vào thư mục tạm, hoặc số lượng truy vấn DNS bất thường. |
| **`value_count`** | Đếm số lượng **giá trị phân biệt (distinct values)** của một trường `field` cụ thể trong cửa sổ thời gian. | Phát hiện **Password Spraying** (1 địa chỉ IP nguồn thử đăng nhập vào `gte: 20` tài khoản `TargetUserName` khác nhau trong `10m`) hoặc hành vi quét cổng/quét mạng nội bộ. |
| **`temporal`** | Phát hiện khi nhiều rule khác nhau (A, B, C) cùng xuất hiện trên một thực thể (`group-by`) trong khoảng thời gian `timespan` (không bắt buộc thứ tự trước sau). | Trên cùng một `Computer` trong vòng `5m` vừa xuất hiện sự kiện chạy lệnh recon (`whoami`), vừa xuất hiện sự kiện tạo Scheduled Task mới. |
| **`temporal_ordered`** | Tương tự như `temporal`, nhưng bắt buộc các sự kiện phải diễn ra **đúng theo thứ tự liệt kê** trong danh sách `rules`. | Phát hiện chuỗi Kill Chain: Phishing attachment mở tiến trình con (`Rule 1`) $\rightarrow$ Tiến trình đó tải payload từ ngoài (`Rule 2`) $\rightarrow$ Chỉnh sửa Registry Run key để duy trì quyền truy cập (`Rule 3`). |

Các toán tử so sánh hỗ trợ bên trong khối `condition` của correlation bao gồm: `gt` (lớn hơn), `gte` (lớn hơn hoặc bằng), `lt` (nhỏ hơn), `lte` (nhỏ hơn hoặc bằng), và `eq` (bằng).

---

## 8. Ba góc nhìn thực tiễn: SOC Analyst, Detection Engineer và Security Engineer

Sigma không phải là công cụ dành riêng cho một nhóm. Giá trị thực sự của Sigma chỉ phát huy tối đa khi cả ba vai trò trong hệ thống phòng thủ — **SOC Analyst**, **Detection Engineer** và **Security Engineer** — hiểu rõ cách khai thác nó ở từng mắt xích vận hành.

```
┌───────────────────────────────────────────────────────────────────────────────────┐
│                        HỆ SINH THÁI VẬN HÀNH VỚI SIGMA                            │
│                                                                                   │
│  ┌─────────────────────────┐   Chuẩn hóa Log & Schema    ┌─────────────────────┐  │
│  │    SECURITY ENGINEER    │ ──────────────────────────► │  DETECTION ENGINEER │  │
│  │ - Cấu hình Audit Policy │                             │ - Viết Sigma YAML   │  │
│  │ - Chuẩn hóa CIM/ECS/ASIM│ ◄────────────────────────── │ - Quản lý DaC (Git) │  │
│  │ - Tối ưu hiệu năng SIEM │   Yêu cầu mở thêm nguồn Log │ - Xây dựng Pipeline │  │
│  └────────────▲────────────┘                             └──────────┬──────────┘  │
│               │                                                     │             │
│               │ Báo lỗi lệch trường                     Deploy Rule │ & Metadata  │
│               │ (Field-name drift)                                  ▼             │
│               │                                          ┌─────────────────────┐  │
│               └───────────────────────────────────────── │     SOC ANALYST     │  │
│                                                          │ - Triage theo YAML  │  │
│                                                          │ - Threat Hunting    │  │
│                                                          │ - Đề xuất filter_*  │  │
│                                                          └─────────────────────┘  │
└───────────────────────────────────────────────────────────────────────────────────┘
```

### 8.1. Góc nhìn của SOC Analyst: Triage, Threat Hunting và Phản hồi Tuning

Đối với SOC Analyst (L1/L2/L3) và chuyên viên ứng phó sự cố (DFIR), Sigma mang lại bốn lợi thế trực tiếp trong ca trực hàng ngày:

1. **Triage cảnh báo nhanh hơn nhờ đọc YAML thay vì đọc truy vấn đã biên dịch:** Một câu truy vấn SPL dùng `tstats` lồng ghép nhiều macro hoặc một câu KQL dài 40 dòng thường rất khó đọc nhanh khi đang xử lý hàng đợi cảnh báo. Nếu SOC liên kết mỗi cảnh báo về tệp Sigma `.yml` gốc của nó, analyst chỉ mất 10 giây để nhìn khối `selection` (cảnh báo bắt cái gì), khối `filter_*` (những gì đã được loại trừ), `falsepositives` (các nguyên nhân hợp pháp cần kiểm tra đầu tiên) và `references` (tài liệu gốc về kỹ thuật tấn công).
2. **Đóng góp đề xuất Tuning chuẩn xác (Structured Feedback Loop):** Thay vì đóng ticket với dòng ghi chú mơ hồ *"False positive do IT admin chạy script, nhờ team DE tune lại"*, một analyst hiểu Sigma có thể gửi thẳng đoạn cấu hình đề xuất trong ticket hoặc tạo Pull Request:
   ```yaml
   filter_it_SCCM_script:
     ParentImage|endswith: '\CcmExec.exe'
     CommandLine|contains: 'inventory_check.ps1'
   ```
   Cách giao tiếp này rút ngắn thời gian xử lý giữa SOC team và Detection team từ nhiều ngày xuống chỉ còn vài phút review.
3. **Threat Hunting chủ động trước khi có Alert:** Khi đọc một báo cáo Threat Intelligence mới (ví dụ từ *The DFIR Report* hoặc *CISA Advisory*), các nhà nghiên cứu hầu như luôn đính kèm sẵn Sigma rule ở cuối bài. Analyst không cần đợi đội kỹ thuật cập nhật hệ thống — bạn có thể copy rule đó, dùng `sigma-cli` (hoặc `sigconverter.io`) dịch sang ngôn ngữ SIEM của mình và chạy truy vấn săn tìm (retrospective hunting) trên dữ liệu lịch sử 30 ngày qua ngay lập tức.
4. **Điều tra số (DFIR) tốc độ cao trên tập tin `.evtx` offline:** Khi đi ứng cứu sự cố tại các máy chủ không được kết nối vào SIEM, analyst có thể thu thập thư mục log Windows (`C:\Windows\System32\winevt\Logs\*.evtx`) và sử dụng các công cụ như **Hayabusa** hoặc **Chainsaw**. Các công cụ này nạp trực tiếp toàn bộ bộ rule SigmaHQ để quét hàng gigabyte tệp `.evtx` chỉ trong vài chục giây và xuất ra timeline tấn công hoàn chỉnh.

### 8.2. Góc nhìn của Detection Engineer: Detection-as-Code (DaC) và Quản trị độ phủ

Đối với Detection Engineer, Sigma là nền tảng cốt lõi để chuyển đổi từ cách làm thủ công trên giao diện web của SIEM sang mô hình **Detection-as-Code (DaC)** hiện đại:

1. **Quản lý vòng đời Rule qua Git và CI/CD Pipeline:** Vì Sigma rule là các tệp văn bản thuần túy (`.yml`), toàn bộ thư viện phát hiện của tổ chức được lưu trữ trong Git repository. Mỗi khi thêm mới hoặc chỉnh sửa một rule, quy trình tự động hóa sẽ diễn ra qua các bước:
   - **Bước 1 (Linting & Schema Validation):** GitHub Actions / GitLab CI tự động chạy `sigma check` để bắt lỗi cú pháp, kiểm tra các trường metadata nội bộ bắt buộc và phát hiện các lỗi logic phổ biến.
   - **Bước 2 (Automated Testing):** Pipeline kích hoạt kịch bản tấn công giả lập trong môi trường Lab (thông qua *Atomic Red Team* hoặc *Vectr*) hoặc đối chiếu rule với kho mẫu log `.evtx`/JSON đã biết (Unit Testing cho Detection) để xác nhận rule thực sự nổ trước True Positive và im lặng trước Baseline sạch.
   - **Bước 3 (Multi-target Compilation & Deployment):** Công cụ `sigma-cli` kết hợp với custom pipeline của công ty tự động dịch rule sang SPL/KQL/EQL và đẩy thẳng lên SIEM thông qua REST API (Splunk Saved Searches API, Microsoft Sentinel Analytics Rules API, hoặc Elastic Detection Engine API).
2. **Xây dựng Custom Processing Pipeline cho doanh nghiệp:** Mọi tổ chức đều có những quy ước đặt tên index, sourcetype hoặc trường tùy chỉnh riêng. Thay vì sửa trực tiếp từng câu truy vấn sau khi dịch, Detection Engineer viết một tệp cấu hình `company_custom_pipeline.yml` định nghĩa rõ: `product: windows` + `category: process_creation` sẽ luôn trỏ vào `index=win_ep_prod sourcetype=XmlWinEventLog:Microsoft-Windows-Sysmon/Operational`. Khi hạ tầng thay đổi tên index, kỹ sư chỉ cần sửa đúng 1 dòng trong tệp pipeline và biên dịch lại toàn bộ kho rule.
3. **Đo lường độ phủ MITRE ATT&CK (Coverage Mapping):** Nhờ trường `tags` chuẩn hóa (như `attack.t1003.001`), Detection Engineer có thể dùng script quét toàn bộ kho Sigma rule đang ở trạng thái `stable` để tự động xuất ra tệp JSON nạp vào **MITRE ATT&CK Navigator**, giúp trực quan hóa ngay lập tức những mảng kỹ thuật nào tổ chức đã có khả năng phát hiện và những mảng nào đang bị bỏ trống.

### 8.3. Góc nhìn của Security Engineer / SIEM Architect: Hạ tầng dữ liệu và Hiệu năng

Một Sigma rule được viết hoàn hảo về mặt logic vẫn sẽ hoàn toàn vô giá trị nếu hạ tầng thu thập và chuẩn hóa dữ liệu bên dưới không đáp ứng được. Đây là phạm vi trách nhiệm của Security Engineer và SIEM Architect:

1. **Đảm bảo tính sẵn sàng và độ sâu của Log (Log Source Parity & Audit Policy):**
   Rất nhiều Sigma rule trong kho SigmaHQ thuộc danh mục `process_creation` dựa vào trường `CommandLine` hoặc `ParentImage`. Tuy nhiên, theo mặc định, Windows Security Event ID 4688 **không ghi lại tham số dòng lệnh (`CommandLine`)**. Nếu Security Engineer không bật chính sách Group Policy *"Include command line in process creation events"* hoặc không triển khai Sysmon với cấu hình chuẩn, toàn bộ các rule Sigma kiểm tra `CommandLine` sẽ âm thầm thất bại (Silent Failure). Tương tự, các rule phát hiện tấn công Active Directory hay PowerShell đòi hỏi Security Engineer phải chủ động bật *PowerShell Script Block Logging (Event ID 4104)* và *Advanced Audit Policy Configuration* trên Domain Controller.
2. **Chuẩn hóa lược đồ dữ liệu tại tầng Ingest (Data Normalization):**
   Để các pipeline tiêu chuẩn của Sigma (như `splunk_cim`, `ecs_windows`, `microsoft_xdr`) hoạt động trơn tru, Security Engineer phải đảm bảo dữ liệu thô khi đi qua tầng parsing (Logstash, Fluentd, Cribl Stream, hoặc Splunk Heavy Forwarder + Technology Add-ons) được bóc tách và ánh xạ đúng chuẩn **CIM (Common Information Model)**, **ECS (Elastic Common Schema)** hoặc **ASIM (Advanced Security Information Model)**. Nếu mỗi nguồn log được parse một kiểu tự phát, việc duy trì Sigma pipeline sẽ trở thành cơn ác mộng.
3. **Kiểm soát hiệu năng truy vấn và chi phí SIEM (Query Performance & Cost Optimization):**
   Các công cụ chuyển đổi tự động thường ưu tiên tính chính xác về mặt ngữ nghĩa hơn là tối ưu hóa hiệu năng đặc thù của từng SIEM. Ví dụ:
   - Một Sigma rule dùng nhiều `contains` (biên dịch thành `*keyword*` với ký tự đại diện ở cả hai đầu) hoặc biểu thức chính quy `re` phức tạp khi chạy định kỳ mỗi 5 phút trên hàng terabyte log trong Splunk hay Sentinel có thể gây quá tải CPU (Search Head contention) hoặc làm tăng vọt chi phí truy vấn.
   - Với các rule tương quan (`correlation: temporal` hoặc `value_count`), câu truy vấn sinh ra thường sử dụng các lệnh nặng như `transaction`, `join` hoặc ` stats dc()` trên tập dữ liệu lớn.
   Do đó, Security Engineer cần làm việc chặt chẽ với Detection Engineer để cấu hình pipeline sinh ra các truy vấn tối ưu (ví dụ: ép truy vấn sử dụng `tstats` trên Accelerated Data Model trong Splunk, giới hạn phạm vi index/table cụ thể, và đặt ngưỡng timeout hợp lý).

---

## 9. Nguồn tham khảo

- TryHackMe: *Sigma* & *Detection Rules Development* — [tryhackme.com](https://tryhackme.com)
- SigmaHQ Official Repository & Specification — [github.com/SigmaHQ/sigma](https://github.com/SigmaHQ/sigma)
- Sigma Documentation (Modifiers, Taxonomy, Correlations) — [sigmahq.io](https://sigmahq.io)
- pySigma & sigma-cli (Modern Sigma Converter Architecture) — [github.com/SigmaHQ/sigma-cli](https://github.com/SigmaHQ/sigma-cli)
- Sigconverter.io (Web-based Sigma Translator) — [sigconverter.io](https://sigconverter.io)
- Hayabusa (Sigma-based Windows Event Log Fast Forensics Timeline Generator) — [github.com/Yamato-Security/hayabusa](https://github.com/Yamato-Security/hayabusa)
- Chainsaw (Rapidly Search and Hunt through Windows Forensic Artefacts using Sigma) — [github.com/WithSecureLabs/chainsaw](https://github.com/WithSecureLabs/chainsaw)
