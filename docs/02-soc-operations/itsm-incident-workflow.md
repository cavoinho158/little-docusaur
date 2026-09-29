---
id: itsm-incident-workflow
title: ITSM, Jira Service Management & SOC Incident Workflow
sidebar_label: ITSM & SOC Workflow (Jira/Splunk)
sidebar_position: 2
description: Tài liệu lý thuyết và thực tiễn về hệ thống quản lý dịch vụ CNTT (ITSM), quy trình ITIL, Jira Service Management và mô hình tích hợp Splunk ES/ITSI trong SOC.
---

# ITSM, Jira Service Management & Splunk ITSI — Tài liệu lý thuyết

> Tài liệu này trình bày các khái niệm lý thuyết nền tảng về hệ thống quản lý dịch vụ CNTT (ITSM), quy trình ITIL, nền tảng Jira Service Management, Splunk ES/ITSI và mô hình tích hợp SOC. Nội dung ưu tiên diễn giải bằng đoạn văn thay vì liệt kê, nhằm xây dựng hiểu biết toàn diện và có chiều sâu.

---

## 1. Ticket System — Hệ thống phiếu hỗ trợ

Hệ thống ticket (ticket system) là nền tảng vận hành của mọi bộ phận hỗ trợ kỹ thuật và quản lý dịch vụ. Về bản chất, đây là cơ chế ghi nhận, theo dõi và giải quyết các yêu cầu hoặc sự cố một cách có tổ chức. Mỗi khi người dùng gặp vấn đề hay có nhu cầu, hệ thống tạo ra một đơn vị làm việc được gọi là ticket, từ đó toàn bộ vòng đời xử lý được quản lý xuyên suốt cho đến khi hoàn tất.

### 1.1 Ticket

Ticket là đơn vị công việc cơ bản trong hệ thống hỗ trợ. Mỗi ticket đại diện cho một yêu cầu, sự cố hoặc nhiệm vụ cụ thể được ghi nhận từ người dùng, hệ thống giám sát hoặc nội bộ đội ngũ kỹ thuật. Ticket chứa đầy đủ thông tin như mô tả vấn đề, người yêu cầu, thời gian tạo, trạng thái xử lý và lịch sử hoạt động. Mỗi ticket có một mã định danh duy nhất (ID) để dễ dàng tra cứu và tham chiếu trong suốt quá trình xử lý. Ticket không chỉ đơn thuần là bản ghi kỹ thuật mà còn là công cụ giao tiếp giữa người dùng và đội hỗ trợ, đảm bảo không có yêu cầu nào bị bỏ sót.

### 1.2 Incident

Incident (sự cố) là bất kỳ sự kiện nào gây ra hoặc có thể gây ra sự gián đoạn, giảm chất lượng dịch vụ so với mức cam kết trong SLA. Điểm mấu chốt của incident là nó tập trung vào việc khôi phục dịch vụ nhanh nhất có thể, không nhất thiết phải tìm ra nguyên nhân gốc rễ ngay lập tức. Ví dụ điển hình là máy chủ web bị sập, ứng dụng không phản hồi hay kết nối mạng bị gián đoạn. Mức độ nghiêm trọng của incident được đánh giá dựa trên phạm vi ảnh hưởng và mức tác động đến người dùng hoặc quy trình kinh doanh.

### 1.3 Request

Request (yêu cầu dịch vụ) khác biệt căn bản với incident ở chỗ nó không liên quan đến sự gián đoạn dịch vụ mà là nhu cầu chính đáng của người dùng muốn thay đổi hoặc bổ sung thứ gì đó. Các request phổ biến bao gồm yêu cầu cấp tài khoản mới, cài đặt phần mềm, thay đổi quyền truy cập hay đặt lại mật khẩu. Request thường được xử lý thông qua quy trình chuẩn hóa đã định sẵn (standard change) và không đòi hỏi phân tích kỹ thuật phức tạp như incident. Trong môi trường ITSM, request management là một luồng quy trình riêng biệt với incident management.

### 1.4 Task

Task (nhiệm vụ) là đơn vị công việc phụ, thường được tạo ra từ một ticket lớn hơn khi công việc đó cần được phân chia cho nhiều người hoặc nhiều bộ phận khác nhau cùng thực hiện. Trong bối cảnh quản lý sự cố phức tạp hoặc triển khai thay đổi lớn, một incident hoặc change có thể sinh ra nhiều task con tương ứng với từng bước thực hiện cụ thể. Task giúp điều phối công việc nhóm hiệu quả và cho phép theo dõi tiến độ từng phần riêng lẻ của một vấn đề lớn.

### 1.5 Priority

Priority (ưu tiên) xác định thứ tự xử lý của các ticket trong hàng đợi. Mức độ ưu tiên thường được tính toán bằng cách kết hợp hai yếu tố: mức độ nghiêm trọng (severity) của vấn đề và mức độ tác động (impact) đến hoạt động kinh doanh. Priority thường được chia thành bốn cấp: Critical (khẩn cấp tuyệt đối), High (cao), Medium (trung bình) và Low (thấp). Việc phân loại đúng priority giúp đội kỹ thuật tập trung nguồn lực có hạn vào những vấn đề quan trọng nhất trước, tránh tình trạng xử lý tràn lan thiếu định hướng.

### 1.6 Severity

Severity (mức độ nghiêm trọng) là thước đo phản ánh mức độ kỹ thuật của vấn đề — cụ thể là vấn đề đó nghiêm trọng đến đâu xét từ góc độ hệ thống. Trong khi priority nhìn từ góc độ kinh doanh (cần xử lý gấp đến đâu), severity nhìn từ góc độ kỹ thuật (hệ thống bị ảnh hưởng nặng nề đến đâu). Một sự cố có severity cao (hệ thống hoàn toàn không hoạt động) chưa chắc đã có priority cao nếu hệ thống đó không quan trọng với hoạt động kinh doanh. Ngược lại, một sự cố severity thấp nhưng xảy ra trên hệ thống cốt lõi có thể được ưu tiên cao hơn. Sự phân biệt này giúp tối ưu quyết định phân bổ nguồn lực.

### 1.7 Status

Status (trạng thái) theo dõi vị trí hiện tại của ticket trong vòng đời xử lý. Các trạng thái phổ biến bao gồm: **New/Open** (mới tạo, chưa có người nhận), **In Progress** (đang được xử lý), **Pending** (tạm dừng chờ phản hồi từ người dùng hoặc bên thứ ba), **Resolved** (đã giải quyết xong về mặt kỹ thuật) và **Closed** (đã đóng sau khi người dùng xác nhận). Workflow của status được thiết kế theo quy trình tổ chức, và mỗi chuyển đổi trạng thái thường kéo theo các hành động tự động như thông báo email, cập nhật SLA hoặc ghi nhận lịch sử.

### 1.8 Assignment

Assignment (phân công) là cơ chế gán ticket cho một cá nhân hoặc một nhóm (team/queue) chịu trách nhiệm xử lý. Trong các tổ chức lớn, assignment thường diễn ra qua nhiều tầng: ticket mới vào hàng đợi chung (L1), sau đó được phân loại và chuyển tiếp (escalate) lên L2 hay L3 nếu vượt quá khả năng xử lý của tuyến đầu. Hệ thống hiện đại hỗ trợ auto-assignment dựa trên các quy tắc như loại sự cố, từ khóa, nhóm người dùng hay thời gian nhận ticket. Assignment rõ ràng và kịp thời là yếu tố then chốt đảm bảo SLA được tuân thủ.

### 1.9 SLA (Service Level Agreement)

SLA trong ngữ cảnh ticket system là tập hợp cam kết về thời gian phản hồi (response time) và thời gian giải quyết (resolution time) dựa trên priority của ticket. Ví dụ, một ticket Critical có thể yêu cầu phản hồi trong vòng 15 phút và giải quyết trong 4 giờ, trong khi ticket Low có thể chấp nhận phản hồi trong 24 giờ và giải quyết trong 5 ngày làm việc. Hệ thống sẽ đếm ngược thời gian từ lúc ticket được tạo và cảnh báo khi sắp vi phạm SLA. Vi phạm SLA không chỉ ảnh hưởng đến chất lượng dịch vụ mà còn có thể kéo theo hình phạt hợp đồng hoặc tổn hại uy tín tổ chức.

---

## 2. ITSM / ITIL — Quản lý dịch vụ CNTT

ITSM (IT Service Management) là tập hợp các chính sách, quy trình và thực hành nhằm thiết kế, cung cấp, quản lý và cải tiến dịch vụ CNTT một cách có hệ thống. ITIL (Information Technology Infrastructure Library) là bộ khung thực hành tốt nhất (best practices framework) được sử dụng rộng rãi nhất để triển khai ITSM. ITIL 4 — phiên bản mới nhất — tổ chức các thực hành xoay quanh Hệ thống Giá trị Dịch vụ (Service Value System) với bốn chiều quản lý và nhiều thực hành chuyên biệt. Các thực hành cốt lõi dưới đây hình thành xương sống của mọi tổ chức vận hành dịch vụ CNTT chuyên nghiệp.

### 2.1 Incident Management

Incident Management (quản lý sự cố) là thực hành nhằm khôi phục hoạt động dịch vụ bình thường càng nhanh càng tốt sau khi xảy ra gián đoạn, đồng thời giảm thiểu tác động tiêu cực đến hoạt động kinh doanh. Quy trình này bắt đầu từ ghi nhận và phân loại sự cố, tiếp đến là phân công và điều tra, rồi giải quyết và đóng ticket. Điểm quan trọng là incident management không yêu cầu phân tích nguyên nhân gốc rễ — mục tiêu duy nhất là khôi phục dịch vụ nhanh nhất có thể. Khi sự cố nghiêm trọng (major incident) xảy ra, cần kích hoạt quy trình escalation đặc biệt với communication bridge và người phụ trách điều phối chuyên biệt (incident commander).

### 2.2 Problem Management

Problem Management (quản lý vấn đề) hoạt động ở tầng sâu hơn incident management, với mục tiêu tìm và loại bỏ nguyên nhân gốc rễ (root cause) gây ra các sự cố tái diễn. Thực hành này gồm hai hướng: **reactive** (phân tích sau khi sự cố đã xảy ra) và **proactive** (xác định rủi ro tiềm ẩn trước khi sự cố xảy ra). Kết quả của problem management thường là một known error — tức là một lỗi đã được nhận dạng chưa có giải pháp triệt để — kèm theo workaround tạm thời. Khi giải pháp triệt để được tìm ra, nó sẽ được triển khai thông qua quy trình change management. Problem management giúp giảm tổng khối lượng incident theo thời gian.

### 2.3 Change Management

Change Management (quản lý thay đổi) kiểm soát vòng đời của mọi thay đổi đối với hạ tầng hoặc dịch vụ CNTT nhằm giảm thiểu rủi ro gián đoạn. ITIL phân loại change thành ba loại chính. **Standard change** là thay đổi được chuẩn hóa trước, rủi ro thấp, có thể thực hiện không cần phê duyệt từng lần (ví dụ: đặt lại mật khẩu). **Normal change** yêu cầu đánh giá rủi ro đầy đủ và phê duyệt từ Change Advisory Board (CAB) trước khi thực hiện. **Emergency change** được áp dụng khi cần xử lý khẩn cấp để khắc phục major incident, quy trình phê duyệt được rút gọn nhưng vẫn phải ghi nhận đầy đủ sau đó. Change management là cầu nối giữa problem management và việc thực sự cải thiện ổn định hệ thống.

### 2.4 Request Management

Request Management (quản lý yêu cầu dịch vụ) xử lý tất cả các service request từ người dùng — những yêu cầu không phải sự cố mà là nhu cầu sử dụng dịch vụ thông thường. Thực hành này bao gồm việc xây dựng service catalog (danh mục dịch vụ) rõ ràng để người dùng biết mình có thể yêu cầu những gì, quy trình phê duyệt khi cần thiết (ví dụ cấp phần mềm bản quyền cần approval của quản lý), và fulfillment workflow tự động hóa các bước xử lý lặp lại. Request management tốt giúp giảm tải cho đội hỗ trợ bằng cách chuẩn hóa và tự động hóa các yêu cầu phổ biến, đồng thời cải thiện trải nghiệm người dùng cuối.

### 2.5 Asset Management

Asset Management (quản lý tài sản CNTT) theo dõi toàn bộ vòng đời của các tài sản CNTT từ lúc mua sắm, triển khai, sử dụng cho đến khi thanh lý. Trong ITIL, đây thường được gọi là IT Asset Management (ITAM) và liên kết chặt chẽ với Configuration Management Database (CMDB). CMDB lưu trữ thông tin về các Configuration Items (CI) — không chỉ là phần cứng và phần mềm mà còn cả các mối quan hệ phụ thuộc giữa chúng. Ví dụ, CMDB biết rằng server A chạy database B, phục vụ ứng dụng C, được sử dụng bởi bộ phận D — thông tin này cực kỳ quý giá khi phân tích tác động của sự cố hay thay đổi.

### 2.6 Knowledge Management

Knowledge Management (quản lý tri thức) xây dựng và duy trì kho tri thức (knowledge base) nhằm tái sử dụng thông tin đã có để giải quyết vấn đề nhanh hơn. Khi một incident hay problem được giải quyết, solution cùng với context chi tiết nên được ghi lại thành knowledge article để đội hỗ trợ tham khảo trong tương lai. Thực hành này theo triết lý Knowledge-Centered Service (KCS), trong đó tri thức được tạo ra song song với quá trình giải quyết vấn đề thay vì là bước phụ sau đó. Knowledge management tốt giúp rút ngắn thời gian giải quyết incident, tăng tỷ lệ first-contact resolution và hỗ trợ self-service hiệu quả cho người dùng cuối.

---

## 3. Jira Service Management

Jira Service Management (JSM) — trước đây là Jira Service Desk — là nền tảng ITSM của Atlassian được xây dựng trên lõi Jira. JSM kết hợp khả năng quản lý dịch vụ toàn diện với hệ sinh thái Atlassian phong phú, cho phép tổ chức triển khai ITSM mà vẫn duy trì kết nối liền mạch với quy trình phát triển phần mềm (Jira Software) và tài liệu (Confluence). Đây là một trong những lựa chọn phổ biến nhất trên thị trường cho cả doanh nghiệp vừa và lớn.

### 3.1 Project

Trong Jira Service Management, Project là đơn vị tổ chức cấp cao nhất, đóng vai trò container chứa toàn bộ cấu hình, workflow, SLA và dữ liệu của một bộ phận hoặc một nhóm dịch vụ cụ thể. Mỗi project JSM thường tương ứng với một team hỗ trợ như IT Helpdesk, HR Services hay Security Operations. Project có cấu hình độc lập, cho phép các team khác nhau tùy chỉnh quy trình riêng mà không ảnh hưởng lẫn nhau. JSM hỗ trợ hai loại project chính: **company-managed** (quản trị viên cấu hình toàn diện) và **team-managed** (linh hoạt, đơn giản hơn cho team nhỏ).

### 3.2 Service Desk

Service Desk trong JSM là cổng giao tiếp giữa người dùng cuối (customer) và đội hỗ trợ. Đây là giao diện web mà người dùng truy cập để gửi yêu cầu, theo dõi trạng thái ticket và đọc knowledge base. Khái niệm service desk trong JSM tích hợp trực tiếp với customer portal — nơi người dùng chọn loại yêu cầu phù hợp từ danh mục dịch vụ được thiết kế sẵn. Từ góc độ vận hành, service desk còn là khái niệm đề cập đến đội ngũ L1 tiếp nhận và xử lý ban đầu, là điểm liên lạc đơn nhất (Single Point of Contact - SPOC) giữa CNTT và người dùng.

### 3.3 Request Type

Request Type (loại yêu cầu) là các mẫu yêu cầu được thiết kế sẵn trên customer portal, mỗi loại có form nhập liệu riêng phù hợp với nhu cầu cụ thể. Ví dụ, "Yêu cầu cài phần mềm" sẽ có trường nhập tên phần mềm và lý do; "Báo cáo sự cố máy tính" sẽ có trường mô tả triệu chứng và thông tin thiết bị. Request type giúp thu thập đủ thông tin cần thiết ngay từ đầu, tránh mất thời gian hỏi thêm. Mỗi request type ánh xạ tới một issue type nội bộ của Jira (Incident, Service Request, v.v.) và có thể gắn với SLA, workflow và automation rules riêng.

### 3.4 Queue

Queue (hàng đợi) là chế độ xem được lọc và sắp xếp của các ticket, dành cho đội hỗ trợ làm việc hàng ngày. Mỗi queue hiển thị một tập con ticket theo điều kiện nhất định — ví dụ "Tất cả ticket chưa được phân công", "Ticket sắp vi phạm SLA" hay "Incident Critical đang mở". Queue không lưu trữ ticket mà chỉ là lens (góc nhìn) lọc dữ liệu theo JQL (Jira Query Language). Đội trưởng có thể tạo nhiều queue khác nhau để giúp thành viên tập trung vào đúng công việc ưu tiên, đồng thời queue còn hiển thị số lượng ticket và cảnh báo trực quan khi có vi phạm SLA.

### 3.5 Workflow

Workflow trong JSM định nghĩa toàn bộ vòng đời của một ticket — từ khi được tạo đến khi đóng lại — thông qua chuỗi trạng thái (status) và các chuyển đổi (transition) được phép. Mỗi transition có thể gắn với điều kiện (conditions), trình xác nhận (validators) và hậu xử lý (post-functions). Ví dụ, transition "Resolve" có thể yêu cầu điều kiện là người thực hiện phải là thành viên của nhóm kỹ thuật, validator đảm bảo trường resolution được điền, và post-function tự động gửi email thông báo cho người yêu cầu. Workflow là trái tim của JSM, quyết định cách ticket di chuyển qua quy trình và trigger các hành động tự động.

### 3.6 SLA

JSM cung cấp công cụ SLA mạnh mẽ với khả năng tùy chỉnh cao. Mỗi SLA được cấu hình với: điều kiện áp dụng (ví dụ: chỉ áp dụng cho ticket priority = Critical), mục tiêu thời gian (ví dụ: 4 giờ để giải quyết), điều kiện bắt đầu đếm giờ (khi ticket được tạo), điều kiện tạm dừng (khi đang chờ phản hồi từ khách hàng) và điều kiện dừng (khi ticket được resolve). JSM tự động hiển thị màu sắc cảnh báo (xanh/vàng/đỏ) theo tiến độ SLA và cho phép báo cáo SLA compliance theo thời gian. Tính năng tạm dừng SLA khi chờ customer response là điểm đặc biệt quan trọng để đảm bảo đội hỗ trợ không bị phạt SLA vì lý do nằm ngoài tầm kiểm soát của họ.

### 3.7 Automation

Automation trong JSM cho phép tự động hóa các hành động lặp lại dựa trên trigger, condition và action. Trigger có thể là sự kiện (ticket được tạo, comment được thêm, trạng thái thay đổi) hoặc lịch thời gian. Condition là điều kiện lọc để chỉ automation chạy đúng với các ticket phù hợp. Action là việc thực hiện (gán ticket, thay đổi priority, gửi thông báo, tạo sub-task, gọi webhook). Ví dụ automation phổ biến: "Khi ticket được tạo với từ khóa 'virus' trong tiêu đề → tự động gán cho Security team và đặt priority = High". Automation giúp loại bỏ các bước thủ công tẻ nhạt và đảm bảo tính nhất quán trong quy trình.

### 3.8 Approval

Approval (phê duyệt) trong JSM cho phép chèn bước xét duyệt vào workflow, yêu cầu một hoặc nhiều người có thẩm quyền phê duyệt trước khi ticket tiến sang bước tiếp theo. Cơ chế này đặc biệt quan trọng trong request management (ví dụ: cấp quyền truy cập cần IT manager phê duyệt) và change management (mọi normal change cần CAB xem xét). JSM cho phép cấu hình approval linh hoạt: phê duyệt đa cấp, chỉ cần một người trong nhóm phê duyệt hay yêu cầu toàn bộ thành viên đồng ý. Người phê duyệt nhận thông báo và có thể phê duyệt hoặc từ chối trực tiếp qua email hay giao diện JSM, kèm theo lý do giải thích.

### 3.9 Asset

JSM Assets (trước đây là Insight) là module quản lý tài sản và CMDB tích hợp ngay trong nền tảng. Assets sử dụng mô hình schema linh hoạt với Object Types (loại đối tượng như Server, Laptop, Software License) và Attributes (thuộc tính như IP address, serial number, owner). Mỗi asset object có thể liên kết trực tiếp với ticket, giúp đội kỹ thuật thấy ngay tài sản nào đang bị ảnh hưởng khi xem một incident. Tính năng dependency mapping trong Assets cho phép vẽ sơ đồ mối quan hệ giữa các CI — khi một server bị lỗi, hệ thống có thể chỉ ra ngay những ứng dụng và người dùng nào bị ảnh hưởng theo, hỗ trợ đánh giá tác động sự cố nhanh chóng.

---

## 4. Splunk ES / ITSI

Splunk là nền tảng phân tích dữ liệu máy móc (machine data) hàng đầu, được mở rộng bởi hai sản phẩm cao cấp phục vụ bảo mật và quản lý dịch vụ: **Enterprise Security (ES)** tập trung vào phát hiện và điều tra mối đe dọa bảo mật, trong khi **IT Service Intelligence (ITSI)** tập trung vào giám sát sức khỏe dịch vụ CNTT dựa trên KPI và machine learning. Cả hai chia sẻ nhiều khái niệm nền tảng và thường được triển khai song hành trong môi trường SOC/NOC của doanh nghiệp lớn.

### 4.1 Alert

Alert trong Splunk là cơ chế thông báo được kích hoạt khi một saved search trả về kết quả thỏa mãn điều kiện nhất định — ví dụ: "khi số lượng failed login vượt quá 100 trong 5 phút". Alert có thể được lên lịch chạy theo tần suất cố định (scheduled alert) hoặc chạy liên tục theo thời gian thực (real-time alert). Khi điều kiện được thỏa, alert trigger một hoặc nhiều action: gửi email, gọi webhook, tạo ticket trên ITSM hay tạo notable event trong Splunk ES. Alert là bước đầu tiên trong chuỗi phát hiện — chuyển đổi dữ liệu thô thành tín hiệu cảnh báo có ý nghĩa cho đội vận hành.

### 4.2 Notable Event

Notable Event (sự kiện đáng chú ý) là khái niệm đặc trưng của Splunk ES. Đây là đơn vị làm việc cơ bản trong SOC — được tạo ra khi một correlation search (tìm kiếm tương quan) phát hiện pattern đáng ngờ hoặc bất thường trong dữ liệu log. Notable event chứa đầy đủ context: tên correlation rule kích hoạt nó, thời gian xảy ra, hệ thống liên quan, mức độ nghiêm trọng, và các field dữ liệu liên quan. Analyst sẽ xem xét notable event trong ES Incident Review dashboard, nơi các event được nhóm theo trạng thái xử lý và được assign cho từng analyst. Notable event đóng vai trò tương đương ticket trong hệ thống ITSM nhưng được tối ưu cho môi trường security operations.

### 4.3 Correlation

Correlation (tương quan) là kỹ thuật cốt lõi giúp Splunk ES phát hiện mối đe dọa phức tạp. Thay vì chỉ xét một sự kiện đơn lẻ, correlation search phân tích mối liên hệ giữa nhiều sự kiện theo không gian (cùng IP, cùng user, cùng thiết bị) và thời gian (chuỗi sự kiện xảy ra trong khoảng thời gian nhất định). Ví dụ điển hình: correlation rule phát hiện "brute force attack" khi có hơn 10 failed login từ cùng IP trong 1 phút, sau đó 1 successful login từ IP đó. Correlation giúp lọc bỏ noise và chỉ sinh notable event khi có đủ bằng chứng hội tụ, giảm false positive đáng kể so với alert đơn giản.

### 4.4 Episode

Episode là khái niệm thuộc Splunk ITSI, đại diện cho một nhóm các alert hoặc event có liên quan đến cùng một vấn đề dịch vụ được gom lại thành một đơn vị xử lý thống nhất. Thay vì đội vận hành phải đối mặt với hàng trăm alert riêng lẻ khi một hệ thống lớn gặp sự cố, ITSI tự động gom chúng vào một episode duy nhất thông qua episode management. Mỗi episode có trạng thái riêng, có thể được assign cho thành viên cụ thể và được theo dõi đến khi giải quyết. Episode giải quyết triệt để vấn đề "alert fatigue" — tình trạng đội vận hành bị choáng ngợp bởi quá nhiều cảnh báo đến mức bỏ sót alert quan trọng.

### 4.5 Service

Trong Splunk ITSI, Service (dịch vụ) là mô hình đại diện cho một dịch vụ kinh doanh hoặc kỹ thuật cụ thể mà tổ chức muốn giám sát. Mỗi service được định nghĩa bởi tập hợp các KPI đo lường sức khỏe của nó, và có thể phụ thuộc vào các service khác (service dependency). Ví dụ, service "E-commerce Website" phụ thuộc vào "Payment Gateway", "Product Database" và "CDN". Khi một service con bị ảnh hưởng, ITSI tự động truyền tác động lên service cha trong cây phụ thuộc. Mô hình service trong ITSI ánh xạ công nghệ với giá trị kinh doanh, giúp lãnh đạo hiểu ngay sự cố kỹ thuật ảnh hưởng đến điều gì.

### 4.6 KPI (Key Performance Indicator)

KPI trong ITSI là chỉ số đo lường một khía cạnh cụ thể của sức khỏe service, được tính toán từ dữ liệu Splunk theo tần suất nhất định. Mỗi KPI có ngưỡng (threshold) phân chia mức độ: Normal, Low, Medium, High và Critical. ITSI hỗ trợ hai loại ngưỡng: **static threshold** (ngưỡng cố định do người dùng đặt) và **adaptive threshold** (ngưỡng động do machine learning tự học từ dữ liệu lịch sử, tự điều chỉnh theo giờ trong ngày, ngày trong tuần). KPI là viên gạch cơ bản xây dựng nên toàn bộ năng lực giám sát của ITSI — sức khỏe của mỗi service được tính toán tổng hợp từ điểm số của tất cả KPI thành phần, có trọng số khác nhau tùy tầm quan trọng.

### 4.7 Service Health Score

Service Health Score (điểm sức khỏe dịch vụ) là chỉ số tổng hợp từ 0 đến 100 phản ánh trạng thái hiện tại của một service trong ITSI. Điểm số được tính từ điểm của từng KPI theo công thức có trọng số — KPI nào quan trọng hơn sẽ ảnh hưởng nhiều hơn đến điểm cuối cùng. ITSI cũng xét đến service phụ thuộc: nếu service con có điểm thấp, điểm của service cha cũng bị kéo xuống. Glass table — tính năng dashboard kéo-thả của ITSI — cho phép hiển thị health score của nhiều service trực quan theo topology thực tế của hệ thống. Điểm sức khỏe biến sự phức tạp kỹ thuật thành một con số dễ hiểu với bất kỳ stakeholder nào.

### 4.8 Incident (trong ITSI)

Trong ngữ cảnh Splunk ITSI, Incident được tạo ra tự động từ episode khi mức độ nghiêm trọng vượt quá ngưỡng nhất định, hoặc khi operator quyết định escalate episode lên thành incident chính thức. ITSI tích hợp với các ITSM platform (Jira, ServiceNow) thông qua connector để tự động tạo ticket khi episode đủ nghiêm trọng, kèm theo toàn bộ context: service bị ảnh hưởng, KPI vi phạm, thời gian bắt đầu, và các event liên quan. Sự liên kết này tạo ra luồng làm việc liền mạch: ITSI phát hiện sự cố → tự động tạo incident ticket trong JSM → đội kỹ thuật nhận được ticket đầy đủ thông tin và bắt đầu xử lý ngay.

---

## 5. SOC Integration — Tích hợp trong Trung tâm Vận hành Bảo mật

Trung tâm Vận hành Bảo mật (Security Operations Center - SOC) hiện đại không hoạt động như một hòn đảo biệt lập mà là một hệ sinh thái tích hợp chặt chẽ giữa nhiều nền tảng và nguồn dữ liệu. Mỗi thành phần trong kiến trúc SOC đảm nhiệm một vai trò chuyên biệt, và giá trị thực sự đến từ sự phối hợp nhịp nhàng giữa chúng thông qua tích hợp API, data sharing và workflow automation. Dưới đây là các thành phần cốt lõi và vai trò của chúng trong kiến trúc SOC tích hợp.

### 5.1 SIEM (Security Information and Event Management)

SIEM là trái tim của SOC — nơi thu thập, chuẩn hóa và phân tích log từ toàn bộ hệ thống của tổ chức. SIEM thực hiện hai chức năng cốt lõi: **Security Information Management (SIM)** — lưu trữ, tìm kiếm và báo cáo log dài hạn; và **Security Event Management (SEM)** — phân tích và tương quan sự kiện theo thời gian thực để phát hiện mối đe dọa. Splunk ES, IBM QRadar, Microsoft Sentinel là những ví dụ SIEM tiêu biểu. Trong kiến trúc SOC, SIEM nhận data feed từ hầu hết các thành phần khác (EDR, firewall, IDS/IPS, Active Directory) và là nguồn chính tạo ra notable event/alert để analyst điều tra.

### 5.2 ITSM (trong kiến trúc SOC)

ITSM trong bối cảnh SOC integration đóng vai trò hệ thống quản lý ticket — nơi các security incident được chính thức hóa, theo dõi và giải quyết theo quy trình có kiểm soát. Khi SIEM hoặc SOAR xác nhận một mối đe dọa đủ nghiêm trọng, hệ thống tự động tạo incident ticket trong ITSM (Jira, ServiceNow) với đầy đủ thông tin kỹ thuật. ITSM cung cấp audit trail hoàn chỉnh — ai làm gì, khi nào, quyết định như thế nào — phục vụ yêu cầu compliance và báo cáo. Tích hợp hai chiều giữa SIEM và ITSM cho phép: khi analyst cập nhật trạng thái ticket trong ITSM, notable event tương ứng trong SIEM cũng được tự động cập nhật và ngược lại.

### 5.3 SOAR (Security Orchestration, Automation and Response)

SOAR là lớp tự động hóa và điều phối nằm giữa các công cụ bảo mật, giúp tăng tốc và chuẩn hóa quy trình ứng phó sự cố. SOAR thực thi **playbook** — chuỗi hành động được lập trình sẵn ứng với từng loại mối đe dọa cụ thể. Ví dụ, khi SIEM phát hiện malware, SOAR tự động: truy vấn threat intelligence để xác minh IOC, cô lập máy bị nhiễm qua EDR, tạo ticket trong ITSM, gửi thông báo cho team lead và thu thập forensic evidence — tất cả trong vài giây thay vì nhiều giờ thủ công. SOAR không thay thế analyst mà khuếch đại năng lực của họ, cho phép mỗi analyst xử lý nhiều case hơn mà không giảm chất lượng điều tra.

### 5.4 EDR (Endpoint Detection and Response)

EDR là giải pháp giám sát và bảo vệ endpoint (máy tính đầu cuối, server, thiết bị di động) bằng cách theo dõi hành vi ở cấp độ process, file, registry và network connection. Khác với antivirus truyền thống dựa vào signature, EDR phát hiện mối đe dọa dựa trên hành vi bất thường và cho phép analyst thực hiện điều tra sâu (forensics) trực tiếp trên endpoint từ xa. Trong kiến trúc SOC, EDR gửi telemetry về SIEM để tương quan với các nguồn dữ liệu khác, và nhận lệnh từ SOAR để thực thi phản ứng tự động như cô lập thiết bị, kill process hay thu thập memory dump. CrowdStrike Falcon, Microsoft Defender for Endpoint, SentinelOne là những EDR phổ biến hiện nay.

### 5.5 Threat Intelligence

Threat Intelligence (tình báo mối đe dọa) là thông tin có ngữ cảnh về các mối đe dọa đang tồn tại — bao gồm Indicators of Compromise (IOC) như IP độc hại, domain, file hash; TTPs (Tactics, Techniques and Procedures) của các nhóm tấn công; và thông tin về các chiến dịch tấn công cụ thể. Threat Intelligence được phân loại theo cấp độ: **strategic** (xu hướng tấn công vĩ mô cho lãnh đạo), **operational** (thông tin về chiến dịch cụ thể cho SOC manager) và **tactical** (IOC cụ thể để cấu hình rule cho engineer). Trong kiến trúc SOC, Threat Intelligence feed được ingested vào SIEM và SOAR để làm giàu context cho alert — khi một IP trong log khớp với IOC trong threat intel, alert đó ngay lập tức có thêm context về nguồn gốc và mức độ nguy hiểm, giúp analyst ưu tiên xử lý chính xác hơn.

### 5.6 CMDB (Configuration Management Database)

CMDB trong kiến trúc SOC là nguồn sự thật duy nhất (single source of truth) về hạ tầng CNTT — máy chủ nào đang chạy, phần mềm nào đang cài, ai là chủ sở hữu và các hệ thống có mối quan hệ phụ thuộc như thế nào. Khi SIEM phát hiện hoạt động đáng ngờ từ một IP, CMDB cung cấp ngay thông tin: đó là máy chủ gì, thuộc bộ phận nào, có dữ liệu nhạy cảm không và ai chịu trách nhiệm. Thông tin này giúp analyst đánh giá tác động và ưu tiên ứng phó chính xác. SOAR sử dụng CMDB để tra cứu thông tin asset trong quá trình thực thi playbook, ví dụ: xác định xem máy bị nhiễm có phải là máy chủ production quan trọng hay chỉ là workstation thông thường trước khi quyết định cô lập. Ngoài ra, CMDB còn là nền tảng để vận hành Change Management hiệu quả — mọi thay đổi cần biết chính xác CI nào bị tác động.

---

## Tổng kết — Bức tranh tổng thể

Các khái niệm trong tài liệu này không tồn tại độc lập mà kết nối với nhau thành một hệ sinh thái vận hành hoàn chỉnh. Hệ thống ticket cung cấp cơ sở hạ tầng làm việc; ITIL cung cấp quy trình và triết lý; Jira Service Management hiện thực hóa các quy trình ITIL trên nền tảng kỹ thuật; Splunk ES/ITSI mang đến khả năng phát hiện và giám sát theo thời gian thực; và kiến trúc SOC Integration tích hợp tất cả lại để tạo ra năng lực phòng thủ toàn diện. Hiểu rõ từng thành phần và cách chúng tương tác là nền tảng để thiết kế và vận hành một SOC hiệu quả trong môi trường doanh nghiệp hiện đại.

```
Ticket System ──► ITSM / ITIL ──► Jira Service Management
                                          │
                                          ▼
SOC Integration ◄──── CMDB ────── Asset Management
      │
      ├── SIEM (Splunk ES) ──► Notable Event ──► Incident
      ├── SOAR ──► Playbook ──► Auto Response
      ├── EDR ──► Telemetry
      └── Threat Intel ──► IOC Enrichment
```

---

*Tài liệu được soạn thảo phục vụ mục đích học tập và nghiên cứu nội bộ.*
*Cập nhật lần cuối: 2026-09-26*
