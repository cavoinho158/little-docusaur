---
id: splunk-fundamentals
title: Splunk — Kiến trúc & Nguyên lý Vận hành
sidebar_label: Splunk Fundamentals
sidebar_position: 3
description: Kiến trúc phân tán, luồng dữ liệu, SPL query types, CIM data model và vận hành Splunk trong môi trường SOC doanh nghiệp.
---

# Splunk — Kiến trúc & Nguyên lý Vận hành

## 1. Tổng quan kiến trúc Splunk

Một trong những nhận thức sai lầm phổ biến nhất khi lần đầu tiếp cận Splunk là coi nó đơn thuần là "một công cụ tìm kiếm log". Thực tế, Splunk là một **nền tảng phân tích dữ liệu hoạt động theo mô hình pipeline phân tán**, trong đó dữ liệu di chuyển qua nhiều tầng xử lý trước khi người dùng có thể query. Hiểu rõ triết lý kiến trúc này là điều kiện tiên quyết để viết SPL hiệu quả và thiết kế hệ thống đúng cách.

Kiến trúc Splunk xoay quanh ba thành phần cốt lõi: **Forwarder**, **Indexer** và **Search Head**. Forwarder chịu trách nhiệm thu thập dữ liệu từ nguồn và vận chuyển đến Indexer — đây là điểm đầu vào của toàn bộ pipeline. **Universal Forwarder (UF)** là loại nhẹ nhất: nó chỉ đọc file, forward raw data, và hầu như không tiêu tốn tài nguyên trên host (thường dưới 1% CPU, ~30MB RAM). Đây là lựa chọn mặc định cho hầu hết endpoint và server. **Heavy Forwarder (HF)** ngược lại là một Splunk instance đầy đủ chức năng — nó có thể thực hiện parsing, filtering, routing, và thậm chí index cục bộ trước khi gửi đi. HF thường được đặt tại các điểm tập trung (DMZ, network segment riêng) để xử lý dữ liệu từ các nguồn không hỗ trợ cài UF như firewall, switch, hoặc các hệ thống legacy gửi Syslog.

Ngoài ba thành phần cốt lõi, môi trường enterprise còn có thêm các vai trò quản lý chuyên biệt. **Deployment Server** quản lý việc phân phối cấu hình (apps, inputs.conf, outputs.conf) đến hàng trăm UF/HF — tương tự một configuration management server nhưng dành riêng cho hệ sinh thái Splunk. **License Manager** (cũ là License Master) là điểm kiểm soát dung lượng dữ liệu được phép index mỗi ngày theo license. **Cluster Manager** (trước đây gọi là Master Node) điều phối Indexer Cluster, quản lý replication và đảm bảo Search Factor / Replication Factor được duy trì. Toàn bộ kiến trúc này có thể scale horizontal: thêm Indexer để tăng throughput ingestion, thêm Search Head (qua Search Head Cluster) để tăng khả năng xử lý query đồng thời.

---

## 2. Luồng dữ liệu từ nguồn vào đến Indexer

Dữ liệu trong Splunk không đơn giản là "ghi vào ổ đĩa". Nó đi qua một pipeline gồm nhiều bước, và mỗi bước đều có tác động trực tiếp đến khả năng truy vấn sau này.

**Input** là bước đầu tiên: Splunk nhận dữ liệu qua file monitoring (`monitor://`), TCP/UDP, HTTP Event Collector (HEC), scripted inputs, hoặc modular inputs. Dữ liệu thô lúc này chưa có cấu trúc — chỉ là một dòng byte thuần túy.

**Parsing** là giai đoạn quan trọng nhất. Splunk thực hiện *line breaking* để phân tách các event (dựa trên `LINE_BREAKER` trong `props.conf`), sau đó thực hiện *timestamp extraction* để gán `_time` cho từng event. Đây là nơi phát sinh một trong những hiểu lầm nguy hiểm nhất trong SOC: sự khác biệt giữa `_time` và `_indextime`. `_time` là timestamp được trích xuất từ nội dung log gốc — thời điểm sự kiện thực sự xảy ra trên hệ thống nguồn. `_indextime` là thời điểm Splunk ghi event đó vào index. Trong điều kiện bình thường, hai giá trị này gần nhau, nhưng khi có sự cố network, forwarder bị tắt, hoặc dữ liệu được ingest hàng loạt (bulk import từ SIEM cũ), khoảng cách giữa `_time` và `_indextime` có thể lên đến hàng giờ, thậm chí hàng ngày. Đối với SOC Analyst, điều này có nghĩa là: khi forensic một sự cố xảy ra lúc 2:00 AM, bạn phải đảm bảo rằng mình đang tìm kiếm theo `_time`, không phải theo thời gian bạn thực hiện query; ngược lại, khi muốn kiểm tra "dữ liệu từ nguồn X có đang được gửi về không", bạn cần dùng `_indextime` để biết Splunk nhận dữ liệu gần đây nhất vào lúc nào.

Sau parsing, Splunk thực hiện **Indexing**: dữ liệu được nén và lưu dưới dạng *rawdata* (file `.gz`), đồng thời xây dựng *TSIDX* (Time-Series Index) — một cấu trúc dữ liệu tương tự inverted index của search engine, ánh xạ từng term đến danh sách các event chứa term đó. Chính TSIDX là lý do tại sao search theo keyword trong Splunk rất nhanh, nhưng cũng là lý do tại sao `NOT field=*` hoặc wildcard ở đầu term (`*error`) lại cực kỳ chậm — nó buộc Splunk phải scan toàn bộ rawdata thay vì lookup TSIDX.

---

## 3. Sáu loại lệnh SPL và tối ưu hiệu năng

SPL (Search Processing Language) không phải là một tập lệnh đồng nhất — các lệnh được phân loại theo cơ chế thực thi, và hiểu điều này là chìa khóa để viết query hiệu quả.

**Distributable Streaming commands** (như `eval`, `search`, `rex`, `rename`, `where`) có thể chạy song song trên tất cả Indexer mà không cần tập trung dữ liệu về Search Head. Mỗi Indexer xử lý phần dữ liệu của mình và trả về kết quả. Đây là nhóm "rẻ" nhất về mặt tài nguyên và nên được ưu tiên đặt đầu pipeline.

**Centralized Streaming commands** (như `streamstats`, `head`, `tail`) yêu cầu dữ liệu từ tất cả Indexer phải được stream về Search Head theo thứ tự thời gian trước khi xử lý. `streamstats` chẳng hạn cần "thấy" từng event theo thứ tự để tính running count/average, do đó không thể phân tán.

**Transforming commands** (như `stats`, `timechart`, `chart`, `top`, `rare`) là nhóm tạo ra bảng thống kê. Chúng yêu cầu toàn bộ tập dữ liệu phải được tập hợp trước khi thực hiện phép toán aggregation. Đây là nhóm thường tốn nhiều bộ nhớ nhất trên Search Head.

**Generating commands** (như `tstats`, `datamodel`, `makeresults`, `inputlookup`) tự tạo ra kết quả mà không cần đọc raw events. `tstats` đặc biệt quan trọng: nó query trực tiếp TSIDX metadata thay vì đọc rawdata, nhanh hơn `stats` thông thường từ 10 đến 100 lần trên large dataset.

**Orchestrating commands** (như `localop`) ép một lệnh thực thi chỉ trên Search Head, hữu ích khi lệnh đó không thể phân tán hoặc khi dữ liệu đã được thu thập về.

**Dataset Processing commands** (như `sort`, `dedup`, `eventstats`) yêu cầu toàn bộ dataset phải sẵn có trong bộ nhớ. `sort` trên một dataset lớn mà không có `head`/`limit` trước đó là một trong những sai lầm phổ biến nhất dẫn đến query timeout.

Từ đây, thứ tự tối ưu cho một SPL điển hình trong SOC trở nên rõ ràng: bắt đầu bằng `tstats` (hoặc `search` với time filter và index/sourcetype để thu hẹp dataset tại lớp TSIDX), sau đó dùng `eval`/`rex` để xử lý field (distributable, chạy trên Indexer), rồi mới dùng `stats` để aggregate (centralized, trên Search Head), và cuối cùng `sort`/`head` để giới hạn kết quả output. Đảo ngược thứ tự này — ví dụ `stats` trước `eval` — không thay đổi kết quả logic nhưng có thể làm tăng bộ nhớ cần thiết lên nhiều lần.

---

## 4. Dense, Sparse, Super-sparse và Rare Search Types

Splunk phân loại search theo mật độ kết quả so với tổng số event được scan. Đây không phải khái niệm hàn lâm — nó ảnh hưởng trực tiếp đến cách thiết kế Saved Search và Correlation Rule trong môi trường có hàng TB log mỗi ngày.

**Dense search** là khi hầu hết event trong time range đều match điều kiện — ví dụ `index=network_traffic` không có điều kiện lọc thêm. Loại này thường nhanh vì TSIDX lookup đơn giản, nhưng trả về lượng data khổng lồ. **Sparse search** là khi chỉ một phần nhỏ event match — ví dụ `EventCode=4625` (failed logon). Đây là loại phổ biến nhất trong SOC queries. **Super-sparse search** match rất ít event (có thể đếm được) trên toàn bộ index — ví dụ tìm kiếm một hash cụ thể của malware đã biết. Đối với super-sparse search, `tstats` không giúp ích nhiều vì overhead của việc mở TSIDX file vượt qua lợi ích; thay vào đó, Bloom filter trên các bucket sẽ loại nhanh các bucket không chứa term đó. **Rare search** là trường hợp đặc biệt: tìm kiếm thứ *không* xuất hiện (anomaly detection kiểu "account nào chưa từng login trong 30 ngày"). Loại này về cơ bản buộc Splunk phải scan toàn bộ dataset để xác định sự vắng mặt — không có tối ưu nào ở cấp TSIDX giúp được — và phải dựa vào lookup/join với baseline precomputed.

Hiểu phân loại này giúp SOC Analyst quyết định: alert nào nên chạy real-time (dense/sparse, thường là threshold alert đơn giản), alert nào nên chạy scheduled mỗi 15 phút/1 giờ (super-sparse, correlation phức tạp), và alert nào nên được tính toán offline thành summary index (rare, anomaly detection).

---

## 5. Common Information Model (CIM) và Technology Add-ons (TA)

Một môi trường SOC thực tế nhận dữ liệu từ hàng chục nguồn khác nhau: Windows Security Event Log, Linux audit log, Nginx/Apache access log, Palo Alto firewall, CrowdStrike EDR, Active Directory, và nhiều hơn nữa. Không có CIM, mỗi nguồn có field name và cấu trúc riêng — để tìm tất cả authentication failure, bạn phải viết: `(source=WinEventLog EventCode=4625) OR (source=linux_audit type=USER_AUTH res=failed) OR (source=nginx "401 Unauthorized") OR ...`. Đây là ác mộng về maintainability và là lý do tại sao CIM ra đời.

**Technology Add-on (TA)** là Splunk app thực hiện hai việc: field extraction (dùng regex trong `transforms.conf`/`props.conf` để biến raw log thành structured fields) và CIM tagging (gán `tag` phù hợp cho event). Ví dụ, TA for Windows sẽ parse Windows EventCode=4624 và gán `tag=authentication action=success user=<AccountName>`. TA for Linux sẽ parse `pam_unix: session opened for user root` và cũng gán `tag=authentication action=success user=root`. Kết quả: cả hai đều có thể được query bằng `tag=authentication action=success` — không cần biết sourcetype gốc là gì.

**CIM Data Model** là tầng trừu tượng hóa phía trên TA. Mỗi Data Model định nghĩa một schema cho một domain sự kiện (Authentication, Network Traffic, Endpoint, Malware, Web, v.v.) bao gồm các field bắt buộc và tùy chọn. Data Model có thể được *accelerate* — Splunk pre-computes và lưu trữ aggregated data trong các file summary đặc biệt — cho phép `tstats` và `pivot` chạy cực nhanh trên dữ liệu đã normalized. Luồng đầy đủ là: **Raw log → TA (field extraction + tagging) → CIM Data Model (schema validation + acceleration) → Pivot/tstats query**. Với luồng này, một Correlation Search trong Enterprise Security có thể chạy trên hàng TB dữ liệu trong vài giây thay vì hàng phút.

---

## 6. Splunk Indexer Cluster Architecture

Trong môi trường production SOC, một single Indexer là điểm thất bại duy nhất (SPOF) không thể chấp nhận. **Indexer Cluster** giải quyết vấn đề này thông qua replication dữ liệu giữa các Indexer peers.

Hai tham số quan trọng nhất của một Indexer Cluster là **Replication Factor (RF)** và **Search Factor (SF)**. RF là số bản sao của mỗi bucket được duy trì trong cluster — RF=3 có nghĩa là mỗi bucket tồn tại trên 3 Indexer khác nhau, cluster có thể mất 2 node mà không mất dữ liệu. SF là số bản sao *searchable* (có đầy đủ TSIDX) cần tồn tại — SF=2 đảm bảo dù một node chết, tất cả dữ liệu vẫn có thể search được ngay lập tức mà không cần rebuild TSIDX. SF ≤ RF là điều kiện bắt buộc. **Cluster Manager** (tên cũ: Master Node) giám sát trạng thái của tất cả peer, điều phối replication khi có node fail hoặc recover, và là nơi Search Head biết phải liên hệ với Indexer nào để thực hiện query.

**Search Affinity** là tính năng tối ưu hóa: khi một Search Head thuộc về một site cụ thể (trong multi-site cluster), nó ưu tiên gửi query đến các Indexer cùng site, tránh network latency cross-datacenter. Điều này quan trọng khi cluster trải rộng nhiều data center.

**SmartStore** là kiến trúc lưu trữ phân tầng cho phép Splunk lưu warm/cold bucket lên object storage như AWS S3 hoặc Azure Blob Storage thay vì local disk. Khi query cần đọc old data, Splunk download bucket về local cache on-demand. SmartStore giảm chi phí lưu trữ đáng kể trong môi trường retention dài (1-2 năm) nhưng đánh đổi bằng latency cao hơn cho historical query. Đây là lý do tại sao các Saved Search cho compliance audit (look-back 90-365 ngày) thường chạy lâu hơn đáng kể so với real-time alert query.

---

## 7. Splunk trong SOC: Alert, Notable Events và Enterprise Security

**Splunk Enterprise Security (ES)** là premium app xây dựng trên nền tảng Splunk core, được thiết kế đặc biệt cho SOC workflow. Thành phần trung tâm của ES là **Correlation Search** — về bản chất là một Saved Search với SPL phức tạp chạy theo lịch — khi điều kiện match, nó sinh ra **Notable Event** trong index `notable`. Notable Event không phải là alert thông thường: nó là một "case" có lifecycle (New → In Progress → Resolved/Closed), có thể được assign cho analyst, comment, và theo dõi.

Tuy nhiên, Notable Event truyền thống (threshold-based) có nhược điểm nghiêm trọng trong môi trường lớn: mỗi event "đáng ngờ" riêng lẻ đều sinh ra một notable, dẫn đến **alert fatigue** — analyst bị nhấn chìm bởi hàng trăm, hàng nghìn notable mỗi ngày, phần lớn là false positive hoặc low-fidelity. Đây là vấn đề mà **Risk-Based Alerting (RBA)** ra đời để giải quyết.

Trong RBA, Correlation Search không sinh ra Notable Event ngay lập tức. Thay vào đó, khi phát hiện hành vi đáng ngờ, nó ghi một **Risk Event** vào `risk` index, gán một điểm **Risk Score** cho một `risk_object` (ví dụ: user `john.doe`, host `WS-001`, IP `192.168.1.50`). Mỗi hành vi đáng ngờ cộng thêm điểm: failed logon +10, lateral movement +30, privilege escalation +50, obfuscated PowerShell +40, v.v. Chỉ khi tổng Risk Score của một `risk_object` vượt ngưỡng cấu hình (ví dụ 100 điểm trong 24 giờ), một Notable Event tổng hợp mới được sinh ra — kèm theo toàn bộ context về các hành vi cụ thể đã đóng góp vào điểm số đó. Kết quả là: thay vì 200 notable rời rạc về các login fail, analyst nhận được 1 notable cho user `john.doe` với Risk Score 180, kèm danh sách đầy đủ 15 hành vi đáng ngờ đã xảy ra — đủ context để ra quyết định nhanh hơn và chính xác hơn.

---

## 8. Tổng kết: Checklist SPL tối ưu cho SOC Analyst

Sau khi nắm rõ kiến trúc và nguyên lý, điều quan trọng là chuyển hóa lý thuyết thành thói quen thực hành. Kinh nghiệm thực tế trong môi trường SOC enterprise cho thấy một số nguyên tắc sau nên được internalize:

Dùng `tstats` thay vì `search` bất cứ khi nào có thể — điều kiện là sourcetype/index đó phải có CIM Data Model acceleration được bật. Nếu chưa có acceleration, `tstats` có thể chậm hơn `search` vì nó vẫn phải scan TSIDX nhưng không có pre-computed summary. Trước khi viết một SPL phức tạp với nhiều `stats` và `join`, hãy kiểm tra xem Data Model tương ứng có đang được accelerate không bằng `| datamodel <model_name> search`.

Dùng `pivot` thay vì raw SPL khi bạn cần ad-hoc reporting trên CIM-normalized data — Pivot tự động tận dụng Data Model acceleration mà không cần bạn nhớ tên field chính xác của từng sourcetype. Khi cần tái sử dụng logic (tạo Correlation Search), chuyển từ Pivot sang `tstats` SPL tương đương.

Hai lỗi timezone/timestamp phổ biến nhất mà SOC Analyst mắc phải: thứ nhất, không chú ý rằng một số log source gửi timestamp dạng UTC trong khi Splunk instance được cấu hình timezone local — dẫn đến `_time` lệch 7 tiếng so với thực tế (Việt Nam UTC+7). Giải pháp là cấu hình `TZ = UTC` trong `props.conf` cho sourcetype đó. Thứ hai, log source không có năm trong timestamp (ví dụ `Dec 31 23:59:59` mà không có `2024`) — Splunk sẽ tự đoán năm dựa trên thời điểm ingest, có thể gây lỗi vào thời điểm cuối/đầu năm khi log từ ngày 31/12 được index vào ngày 1/1 năm sau.

Cuối cùng, luôn bắt đầu query với `earliest` và `latest` tường minh trong Saved Search và Correlation Rule — đừng dựa vào time picker của UI vì khi search chạy automated, UI time picker không có giá trị. Và khi debug một Correlation Search chạy chậm, `| search_activity` hoặc Job Inspector là công cụ đầu tiên cần mở, không phải thêm `| head 100` vào giữa pipeline.

---

:::tip Tài nguyên tham khảo
- [Splunk Docs: CIM Reference](https://docs.splunk.com/Documentation/CIM)
- [Splunk Docs: SPL Command Types](https://docs.splunk.com/Documentation/Splunk/latest/SearchReference/Commandsbytype)
- [Splunk ES: Risk-Based Alerting](https://docs.splunk.com/Documentation/ES/latest/Admin/Configureriskscoring)
- [Splunk Architecture Best Practices](https://docs.splunk.com/Documentation/Splunk/latest/Deploy/Distributedoverview)
:::
