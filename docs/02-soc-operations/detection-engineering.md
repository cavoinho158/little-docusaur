---
id: detection-engineering
title: Detection Engineering — Xây dựng Hệ thống Phát hiện Mối đe dọa
sidebar_label: Detection Engineering
sidebar_position: 1
description: Tổng quan về Detection Engineering — vai trò trong SOC, vòng đời phát triển detection, tư duy phân tích mối đe dọa, cân bằng precision/recall và cách xử lý các thách thức thực tế khi vận hành hệ thống phát hiện.
---

# Detection Engineering: Xây dựng Hệ thống Phát hiện Mối đe dọa

> Tài liệu tổng hợp và mở rộng từ topic *Detection Engineering* (TryHackMe), bổ sung thêm nghiên cứu thực tiễn từ kinh nghiệm vận hành SOC. Nội dung hướng tới SOC analyst L2+ muốn hiểu sâu hơn về cách detection được xây dựng, vì sao nó fail và làm thế nào để cải thiện.

---

## 1. Detection Engineering là gì và tại sao cần quan tâm

Hãy thử hình dung: SIEM đang ingest hàng triệu event mỗi ngày, 100 alert đang firing mỗi giờ, và analyst không thể theo kịp. Phần lớn alert là noise — nhưng ẩn trong đó, một kẻ tấn công thực sự đã dwell trong mạng suốt ba tuần mà không ai nhận ra. Kịch bản này không phải giả thuyết, nó xảy ra ở các SOC thực tế mỗi ngày.

Câu hỏi đặt ra là: những alert đó đến từ đâu? Ai quyết định cần detect cái gì, detect như thế nào, và bỏ qua cái gì? Câu trả lời là **detection engineer** — và đây là lý do vì sao mọi analyst ở cấp L2 trở lên cần hiểu discipline này.

Detection Engineering là **quá trình có hệ thống** để thiết kế, xây dựng, kiểm thử và duy trì các detection rule phục vụ hoạt động của SOC. Nó nằm ở giao điểm giữa ba lĩnh vực: threat intelligence (nghiên cứu kẻ tấn công), data engineering (hiểu luồng dữ liệu và log), và security analysis (phân tích hành vi). Công việc cốt lõi là chuyển đổi kiến thức về kỹ thuật tấn công thành logic phát hiện có thể triển khai được trên SIEM hoặc EDR.

Khác với SOC analyst phản ứng với những gì tooling hiển thị, detection engineer làm việc **chủ động**: nghiên cứu TTP (Tactics, Techniques, Procedures) của kẻ tấn công và xây dựng detection trước khi mối đe dọa vật chất hóa. Đây là lý do vì sao analyst L2 hiểu discipline này sẽ đặt câu hỏi chất lượng hơn khi nhận alert, đóng góp được vào quá trình tuning, và giao tiếp hiệu quả hơn với team detection khi cần.

---

## 2. Vị trí của Detection Engineering trong SOC

Không có một mô hình tổ chức chuẩn duy nhất. Vị trí của detection engineering team biến động đáng kể tuỳ theo quy mô ngân sách và mức độ trưởng thành của tổ chức:

- **Mô hình tích hợp:** Không có dedicated team. Analyst L2/L3 kiêm luôn việc xây dựng và tuning detection trong thời gian rảnh giữa các ca điều tra. Phổ biến ở các tổ chức nhỏ hoặc SOC đang trong giai đoạn bootstrapping.
- **Mô hình embedded:** Có một vài detection engineer nằm trong SOC team, làm việc song song với analyst. Phối hợp chặt chẽ hơn, nhưng vẫn dễ bị kéo vào công việc triage hàng ngày.
- **Mô hình độc lập:** Detection Engineering là một team riêng biệt, có roadmap và KPI riêng. SOC team và DE team giao tiếp qua quy trình chính thức (ticket, review meeting). Phổ biến ở doanh nghiệp lớn, MSSP quy mô cao.

Bất kể mô hình nào, bộ công cụ mà detection engineer dựa vào đều tương đồng:

| Công cụ | Ví dụ | Mục đích |
|---|---|---|
| SIEM | Splunk, Microsoft Sentinel, Elastic | Viết và deploy detection rule trên log đã ingest. |
| EDR | CrowdStrike, SentinelOne, Microsoft Defender | Viết và deploy detection rule trên host-level telemetry. |
| Threat Intelligence | MISP, OpenCTI, The DFIR Report | Nghiên cứu TTP của attacker và xác định cơ hội phát hiện. |
| Automation | Python, SOAR platform | Tự động hoá detection testing, alert enrichment và deployment pipeline. |
| Version Control | Git, GitHub | Theo dõi thay đổi trong detection logic và quản lý review workflow. |
| Lab / Test Environment | Atomic Red Team, custom VM, BAS | Mô phỏng kỹ thuật tấn công để validate detection trước khi deploy. |

---

## 3. Ba trụ cột của Detection Engineering

Detection Engineering team xoay quanh ba trụ cột chính, và điều quan trọng là cả ba cần được đầu tư đồng đều — nhiều team bỏ quên trụ cột thứ ba và gánh hậu quả sau vài năm vận hành:

**Detection Creation:** Nghiên cứu một kỹ thuật tấn công cụ thể, dịch nó thành logic phát hiện, rồi deploy lên SIEM hoặc EDR. Đây là phần dễ nhìn thấy nhất nhưng không phải phần quan trọng nhất.

**Detection Tuning:** Tinh chỉnh detection logic đã có để giảm false positive mà không tạo ra blind spot mới. Đây là công việc tốn thời gian nhất và đòi hỏi sự hiểu biết sâu cả về môi trường lẫn về kỹ thuật tấn công. Một rule quá rộng sẽ tạo ra alert fatigue; một rule quá hẹp sẽ bỏ sót tấn công thực sự.

**Detection Management:** Theo dõi, tài liệu hoá, version control và deprecate detection để duy trì sức khoẻ của toàn bộ detection library theo thời gian. Đây thường là trụ cột bị bỏ qua nhất — và chính điều đó dẫn đến detection library decay sau 2-3 năm vận hành.

Ngoài ba trụ cột này, detection engineering team thường cũng đảm nhận automation, threat intelligence research và threat hunting. Phạm vi cụ thể phụ thuộc vào từng tổ chức vì hiện tại chưa có tiêu chuẩn ngành được áp dụng rộng rãi.

---

## 4. Tư duy của một detection engineer

Kỹ năng viết query SIEM hay SPL có thể học được. Tooling có thể thành thạo sau vài tháng thực hành. Nhưng tư duy (mindset) là điều phân biệt những người chỉ viết rule và những người xây dựng được hệ thống phát hiện thực sự hiệu quả.

Từ khoá trong ngữ cảnh này là **Engineering**. Trong software engineering, không ai chỉ viết code và ship luôn. Có design, có build, có test, có review, có deploy, có monitor, và có iterate. Có một quy trình có cấu trúc với vòng đời rõ ràng, đó là thứ phân biệt một codebase đáng tin cậy với một đống script tạm bợ.

Detection Engineering không khác. Viết một SIEM query bắt được hành vi xấu đã biết không phải là engineering. Engineering là thứ đảm bảo query đó được xây dựng trên solid threat research, được validate kỹ lưỡng, được deploy đúng quy trình, được theo dõi hiệu suất và được cập nhật khi TTP của attacker thay đổi.

---

## 5. Vòng đời phát triển Detection (Detection Life Cycle)

Hầu hết detection engineering team đều vận hành theo một vòng đời chung, dù tên gọi các bước có thể khác nhau giữa các tổ chức và framework:

```
┌─────────────────────────────────────────────────────────────┐
│                    DETECTION LIFE CYCLE                     │
│                                                             │
│  1. Threat Research                                         │
│     │ Nghiên cứu TTP, threat reports, CVE mới              │
│     ▼                                                       │
│  2. Data Review                                             │
│     │ Xác định log source cần thiết, kiểm tra availability  │
│     ▼                                                       │
│  3. Detection Design                                        │
│     │ Dịch TTP thành logic phát hiện, viết query/rule       │
│     ▼                                                       │
│  4. Testing & Validation ◄──────────────── (fail → quay lại design)
│     │ Chạy simulation, kiểm tra true/false positive rate    │
│     ▼                                                       │
│  5. Deployment                                              │
│     │ Deploy lên SIEM/EDR, thiết lập alerting threshold     │
│     ▼                                                       │
│  6. Maintenance ◄───────────────────────── (TTP thay đổi → quay lại research)
│     Theo dõi hiệu suất, tuning, deprecate khi cần           │
└─────────────────────────────────────────────────────────────┘
```

Lưu ý hai feedback loop quan trọng: nếu detection không pass testing, nó quay về bước Design, không được deploy với hy vọng sẽ hoạt động. Và khi TTP của attacker thay đổi đáng kể, vòng đời bắt đầu lại từ bước Threat Research, không phải từ bước tuning nhỏ.

---

## 6. Detection life cycle frameworks

Cộng đồng detection engineering đã phát triển một số framework để đưa cấu trúc vào quá trình xây dựng detection. Bạn không cần thuộc lòng từng framework, nhưng biết chúng tồn tại sẽ giúp khi tham chiếu tài liệu hoặc trao đổi với team:

**CREDO (Creation, Review, Evaluation, Deployment, Operations):** Chia vòng đời detection thành 5 phase tường minh, nhấn mạnh rằng công việc không kết thúc ở deployment. CREDO đẩy team vào tư duy "detection là sản phẩm sống" cần được đánh giá và vận hành liên tục.

**ADS (Alerting and Detection Strategy):** Cung cấp template nhất quán mỗi khi xây dựng một detection mới. ADS bao gồm mục tiêu của detection, ATT&CK technique mà nó target, data source cần thiết, query logic, và cách đánh giá hiệu suất. Dùng ADS giúp giảm documentation debt và tạo ra detection library có thể tra cứu được.

**MITRE ATT&CK:** Không phải framework detection thuần tuý, nhưng là ngôn ngữ chung để map detection với kỹ thuật tấn công. Mỗi detection lý tưởng nên có annotation ATT&CK technique ID tương ứng.

Tất cả các framework này đều chia sẻ một tiền đề chung: detection tốt được engineering, không phải improvise. Framework cụ thể bạn dùng ít quan trọng hơn việc có một quy trình có cấu trúc và nhất quán.

---

## 7. Detection gap và tại sao không thể phát hiện mọi thứ

Có một sự thật không thoải mái ở trung tâm của detection engineering: bạn luôn đang chạy sau. Attacker di chuyển trước. Họ nghiên cứu, phát triển và triển khai kỹ thuật mới, và chỉ sau khi kỹ thuật đó được quan sát và phân tích bởi defender thì mới có thể có detection đối phó.

Khoảng cách giữa đường cong evasion capability của attacker và detection curve của defender không bao giờ hoàn toàn thu hẹp lại. Công việc của detection engineer không phải là xoá bỏ khoảng cách đó — mà là giữ nó càng hẹp càng tốt theo thời gian.

### Tại sao không cần detect mọi thứ

Kẻ tấn công không thực hiện một kỹ thuật đơn lẻ rồi dừng lại. Họ thực thi một chuỗi kỹ thuật trong attack chain của mình. Điều này tạo ra cơ hội: attacker cần thành công ở mọi bước trong kill chain, nhưng defender chỉ cần phát hiện được **một bước bất kỳ** để có thể can thiệp.

```
Attack Chain (ví dụ):
Initial Access → Execution → Persistence → Discovery → Lateral Movement → Exfiltration

Detection Coverage:
[Không detect]    [DETECT]   [Không detect]  [DETECT]   [Không detect]   [DETECT]
                     ▲                          ▲                            ▲
              Vẫn đủ để                  Phát hiện sớm               Phát hiện muộn
              can thiệp                  hành vi kẻ tấn              nhưng vẫn kịp
```

Ngay cả với các kỹ thuật đã biết, attacker vẫn có thể bypass detection bằng cách thay đổi cách triển khai (masquerading, living-off-the-land, tool substitution). Điều này có nghĩa là **durable detection** — những detection tồn tại được theo thời gian — phải được xây dựng dựa trên những gì attacker **bắt buộc phải làm**, không phải cách họ làm.

Ví dụ: phát hiện LSASS dump bằng cách match tên tool cụ thể như `mimikatz.exe` sẽ bị bypass trivially bằng cách đổi tên file. Nhưng phát hiện dựa trên hành vi bắt buộc — như một process không phải lsass.exe đang đọc memory của lsass process — khó bypass hơn nhiều vì đó là fundamental action của kỹ thuật này.

Stealth là mục tiêu chính của attacker. Mọi quyết định của họ, từ cách execute code đến cách lateral movement, đều được tối ưu để tránh bị phát hiện. Detection engineer cần internalize điều này để hiểu rằng mình đang trong cuộc chiến của hai tư duy: kẻ tấn công tìm cách ẩn mình, defender tìm cách nhìn thấy những thứ không thể ẩn.

---

## 8. Precision và Recall: thước đo chất lượng detection

Viết một detection rule fire được là việc dễ. Viết một rule fire đúng — bắt được mối đe dọa thực sự một cách đáng tin cậy mà không chôn vùi analyst trong noise — là thứ mà nhiều team vật lộn mãi không giải quyết được.

Detection engineer mượn hai khái niệm từ statistics để lý luận về challenge này:

**Precision** (hay positive predictive value): Trong tổng số alert mà detection này fire, có bao nhiêu là mối đe dọa thực sự? Precision thấp nghĩa là analyst đang chết đuối trong false positive.

**Recall** (hay sensitivity): Trong tổng số cuộc tấn công thực sự xảy ra, có bao nhiêu cái detection này bắt được? Recall thấp nghĩa là mối đe dọa đang slip qua im lặng.

```
                        Thực tế là mối đe dọa    Thực tế là bình thường
                       ┌────────────────────────┬────────────────────────┐
Detection fire         │   True Positive (TP)   │   False Positive (FP)  │
                       │                        │   ← Precision đo tỉ lệ │
                       │                        │     TP / (TP + FP)     │
                       ├────────────────────────┼────────────────────────┤
Detection không fire   │   False Negative (FN)  │   True Negative (TN)   │
                       │   (nguy hiểm nhất)     │                        │
                       └────────────────────────┴────────────────────────┘

Recall = TP / (TP + FN)
```

False negative là kết quả nguy hiểm nhất vì nó không tạo ra bất kỳ alert nào. Không có noise, không có khiếu nại — chỉ là một khoảng trống im lặng mà kẻ tấn công có thể đi qua mà không ai hay biết.

Tension tự nhiên tồn tại giữa hai chỉ số: tăng recall (bắt nhiều hơn) thường kéo giảm precision (nhiều false positive hơn) và ngược lại. Đây không phải là bài toán có lời giải dứt khoát — đó là bài toán cân bằng liên tục mà context và môi trường cụ thể sẽ quyết định điểm cân bằng phù hợp.

Nguyên tắc chung: thà fire nhiều hơn với một lộ trình triage rõ ràng, hơn là miss detection quan trọng. Nhưng nếu alert volume quá cao tới mức analyst không thể xử lý được, cần ưu tiên tuning trước. Tracking precision và recall theo thời gian qua kết quả thực của SOC — không phải cảm tính — là cách duy nhất để biết hệ thống detection đang đi theo hướng nào.

> "Càng research và test kỹ một detection, precision và recall values của bạn càng tốt."

---

## 9. Thách thức thực tế trong vận hành Detection Engineering

Detection Engineering trông gọn gàng trên diagram nhưng phức tạp nhanh chóng trong thực tế. Phần lớn thách thức không nằm ở việc viết detection logic — mà ở tất cả thứ bao quanh nó.

| Thách thức | Mô tả | Giai đoạn bị ảnh hưởng |
|---|---|---|
| **Missing log sources** | Log source mà detection phụ thuộc vào có thể không được thu thập hoặc không được forward về SIEM. Rule chạy nhưng không bao giờ fire — im lặng. | Data Review |
| **Parsing problems** | Ngay cả khi data đến nơi, tên field sai, timestamp bị lỗi, hoặc event bị split có thể phá vỡ detection logic một cách âm thầm. | Detection Design |
| **Data volume decisions** | Không phải mọi log đều nên ingest. Source volume cao, signal thấp thổi phồng chi phí và làm chậm query, buộc phải liên tục đánh đổi về những gì cần giữ. | Data Review |
| **Không có test environment** | Không có lab thực tế, detection đến production chưa qua validation, biến mỗi deployment thành live experiment. | Testing & Validation |
| **Detection library decay** | Rule được viết cho environment cũ, tool deprecated hoặc lỗ hổng đã được patch vẫn tiếp tục chạy và tạo noise mà không ai điều tra. | Maintenance |
| **Alert fatigue** | Quá nhiều alert chất lượng thấp train analyst dismiss mọi thứ — kể cả mối đe dọa thực sự bị chôn vùi trong noise. | Testing & Validation |
| **TTP drift** | Kỹ thuật của attacker tiến hoá. Detection chính xác quý trước có thể mù với variant của quý này nếu không có continuous updates. | Threat Research |
| **Adjacent responsibilities** | Documentation, metric tracking và automation kéo detection engineer ra khỏi công việc detection core, cạnh tranh cùng nguồn thời gian giới hạn. | Mọi giai đoạn |

### Xử lý thực tế

Những thách thức này không phải đặc thù của bạn — mọi detection engineering practitioner đều đối mặt với chúng. Sự khác biệt nằm ở mức đầu tư mà team có để giải quyết chúng.

**Với missing log sources:** Bắt đầu bằng cách xây dựng một *data inventory* — tài liệu sống mapping mọi detection với log source cần thiết và đánh dấu các gap. Team invest vào việc này sớm sẽ tránh được tình trạng discover sau khi sự cố đã xảy ra rằng coverage không tồn tại.

**Với detection library decay:** Bắt đầu bằng ownership. Gán cho mỗi detection một owner rõ ràng và một review date ngăn orphaned rule. Team mature hơn còn đi xa hơn — theo dõi detection performance metric như fire rate, TP rate và analyst feedback theo thời gian. Detection không còn fire nữa hoặc detection có TP rate về 0% cần được điều tra và potentially deprecate.

Càng team grow và mature, các thách thức này dần chuyển từ tình huống "chữa cháy" sang "managed process" — đó là dấu hiệu của một detection engineering function đang trưởng thành.

---

## 10. Từ lý thuyết đến thực hành: điều analyst nên làm

Hiểu Detection Engineering không có nghĩa là mọi analyst đều phải trở thành detection engineer. Nhưng kiến thức này thay đổi cách bạn làm công việc hàng ngày:

- **Khi nhận alert:** Thay vì chỉ triage, hỏi thêm: "Detection này được viết để target gì? Log source nào nó phụ thuộc vào? TTP nào theo MITRE ATT&CK nó map tới?" Câu trả lời thường nằm trong documentation của detection, nếu documentation tồn tại.
- **Khi phát hiện false positive lặp lại:** Ghi lại pattern cụ thể và escalate lên detection team kèm theo context, không chỉ đóng ticket. Feedback từ analyst là input quan trọng nhất để tuning detection.
- **Khi nghi ngờ có false negative:** Nếu bạn điều tra một sự cố và nhận thấy một hành vi nào đó không có alert tương ứng, đó là thông tin giá trị cho detection team. Ghi lại: technique gì, log source gì, event gì, và tại sao bạn nghĩ nó đáng được detect.
- **Khi học về threat intel mới:** Bất kỳ khi nào đọc threat report hoặc write-up sự cố, hỏi: "Chúng ta có detection cho TTP này không? Nếu không, chúng ta cần gì để có nó?" Đây là bước đầu của threat-informed detection.

Góc nhìn này biến analyst thành người tham gia chủ động vào việc cải thiện coverage, thay vì chỉ là người tiêu thụ những gì detection library cung cấp.

---

## Nguồn tham khảo

- TryHackMe: *Detection Engineering* — [tryhackme.com](https://tryhackme.com)
- MITRE ATT&CK — [attack.mitre.org](https://attack.mitre.org)
- Alerting & Detection Strategy Framework (ADS) — Palantir: [github.com/palantir/alerting-detection-strategy-framework](https://github.com/palantir/alerting-detection-strategy-framework)
- CREDO Framework — [github.com/SecurityBrewery/credo](https://github.com/SecurityBrewery/credo)
- The DFIR Report (threat intelligence use cases) — [thedfirreport.com](https://thedfirreport.com)
- Atomic Red Team (testing environment) — [github.com/redcanaryco/atomic-red-team](https://github.com/redcanaryco/atomic-red-team)
