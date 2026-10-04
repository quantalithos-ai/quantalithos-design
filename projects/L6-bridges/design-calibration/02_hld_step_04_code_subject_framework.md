# L6-bridges 02 Step 4：代码主体框架

## 1. Step 状态与内计划

done / pass；full-restart / single-agent-serial；回填正式§4。开工：三层门禁已核；通用规范与当前SOP/书写规范已读取；Step2/3；01§6~11；SOP4/规范4.4已核对；前序思考/结构/自检pass。未来Step未创建。

| 计划项 | 状态 |
|---|---|
| 前序读取 | done |
| 问题/诊断/取舍 | done |
| 结构化/复杂度 | done |
| 草稿/自检 | done / pass |

## 2. 本步输入

Step2/3；01§6~11；SOP4/规范4.4；前序校准文件的回答/诊断/取舍/待确认；项目/flow；通则/中间产物/真相源适用纪律。历史02/README后置扫描。

## 3. SOP 问题回答

1. U1落到BindingApplication、MappingRepository与局部relation；U2落到InboundApplication/ConversationHandoffPort；U3落到PresentationApplication/DeliveryApplication/PlatformAdapter；U4落到CallbackApplication/OwnerActionPort；U5落到ContinuityApplication/RecoveryJob；U6落到SafeReadApplication/SafeHandoffApplication。
2. 管理、平台入口和consumer只做协议入口；可靠性job是Operations入口。资格重核和事务编排属于Application，不在HTTP/SDK中裁决。
3. relation/effect/cursor/局部记录及guard属于Domain；repository/transaction、owner/平台/secret port是反向依赖边界，实际adapter和persistence实现属于外层。SafeView是局部只读模型。
4. 必须先点名六业务部分、四PlatformAdapter、资格/secret/continuity/安全交接port；它们的产品装配尚未选，不点名Bus/KMS/ORM框架。
5. 目录、crate、部署进程、完整类型定义、DDL、HTTP path与DI框架全部留03/04；六单元不拆六服务。

## 4. 当前文档问题诊断

若将“Ports/Persistence”画成Domain依赖驱动实现，会反转01依赖方向。分层图要同时说明运行调用和静态依赖：应用调用抽象port，外层实现port；不得以图的上下位置宣称Domain依赖DB/平台SDK。

## 5. 改动前后对比

| 01输入 | 本Step转译 | 保留不展开 |
|---|---|---|
| 六语义单元 | 六Application主轴及局部对象线索 | 对象字段到Step6 |
| typed adapter | 四平台adapter实现同一有限语义port | SDK、版本、序列化到03/04 |
| body-free / no-write | private material/secret port与独立SafeRead入口 | 无正文inbox、无query repair |

## 6. 设计取舍

选择业务轴与实现层两图并列，不采用每单元一个微服务或按Slack等平台复制业务域。平台私有差异封在adapter，Domain不认识平台响应正文；局部安全handoff需要唯一producer来源，但未获canonical payload的变更不一律造outbox。思考done，结构写入门禁pass。

## 7. 结构化中间产物

### 7.1 业务到代码主体

#### 架构模块到代码主体映射图: Bridges代码主体

```text
L6-bridges / External Protocol Adaptation BC
|
+-- U1 Authorized binding / mapping
|   +-- BindingApplication / MappingApplication
|   +-- Installation / Binding / Identity-Location-Message mappings
|
+-- U2 Inbound handoff
|   +-- InboundApplication / InboundHandoffRecord
|   +-- ConversationHandoffPort
|
+-- U3 Safe presentation / delivery
|   +-- PresentationApplication / DeliveryApplication
|   +-- PresentationPlan / Intent / Attempt / Receipt
|
+-- U4 Callback responsibility
|   +-- CallbackApplication / ActionBinding / CallbackHandoffRecord
|   +-- OwnerActionPort
|
+-- U5 Continuity / recovery
|   +-- ContinuityApplication / RecoveryJob
|   +-- Dedup / Cursor / Gap / Lane / RecoveryRecord
|
+-- U6 Safe read / traceability
    +-- SafeReadApplication / SafeHandoffApplication
    +-- SafeAuditRecord / SafeHandoffRecord / BridgeLocalView
```

关键说明：

- U1~U6为01已确认业务主语，Application名称是后续03的编排入口，不是六服务。
- 对象名称在Step5进入候选池，Step6逐一筛选；映射图不预先证明每个候选均为聚合。
- 图不表达目录、实现语言、DB表或完整接口。

### 7.2 实现层与边界

#### 实现分层视图: 抽象port与外层adapter

```text
management / platform input / owner event / operations / query
                               |
                               v
               +-------------------------------+
               | Inbound / Consumer / Job      |
               | protocol ACK != owner result  |
               +---------------+---------------+
                               v
               +-------------------------------+
               | Application                   |
               | scope -> basis -> local UoW   |
               +----------+--------------------+
                          | calls              | calls
                          v                    v
              +--------------------+   +-----------------------+
              | Domain model       |   | Abstract ports        |
              | local guards/state |   | owner / platform /    |
              +--------------------+   | secret / repository   |
                                       +-----------^-----------+
                                                   | implements
              +------------------------------------+-----------+
              | Outer adapters / persistence / private seams   |
              | Slack / Mattermost / Telegram / Discord        |
              +------------------------------------------------+
```

关键说明：

- 向下箭头是编排调用；`implements`表示外层依赖抽象，不是Domain依赖平台SDK/数据库。
- 四PlatformAdapter的局部能力与private secret/material读取由抽象port约束，不穿透Domain。
- query经过独立SafeRead入口，只读已有局部视图；不运行修复或写审计。
- Repository/UoW产品与secret provider未选，本图不是部署拓扑。

### 7.3 关系与shared边界

| 项 | 说明 |
|---|---|
| 业务主要组成部分 | U1授权关系、U2入站、U3外显、U4回调、U5连续性、U6安全读取/追溯说明“做什么”。 |
| 实现分层 | Entry/Application/Domain/抽象Ports/外层Adapter/Persistence说明“主体如何安放”。 |
| 关系 | 每个U可跨多实现层；同层入口不合并业务状态，同U不必独立进程。 |
| shared vocabulary | installation namespace、typed actor/target、operation/effect、generation、safe basis/ref、bounded reason；authority各有所属，不另造共享truth。 |
| shared metadata | CommandMetadata/QueryMetadata/正式event metadata沿SDK和producer来源；不重复顶层key或trace，不以technical dedup证明exactly-once。 |
| 横切guard | 当前basis、来源标记、no-body、effect不可变、gap保守、query no-write由应用编排与局部Domain共同约束。 |

关键判断：Presentation/Delivery/Callback不是内部Turn或Decision服务；SafeAudit不是Observability evidence；PlatformReceipt不是平台实体副本。Step5~9必须沿同一U轴展开，完整schema/DI/文件布局留03。复杂度两图和一表足够，后续重对象才拆附录。

## 8. 回填草稿

正式§4采用§7两图及关系表；平台差异细化在§7接口而非在框架图塞字段。正文保留判断，不携入本Step诊断过程。

## 9. 待确认事项

BR-UP-001~009=open；010=reference_only；不关闭上游。

## 10. 进入下一步条件

映射/分层两图及说明齐全；六U同01，静态依赖未反转；未选产品/目录/DDL/完整类型均未混入；query/no-body/shared metadata与Step3一致。自检pass；gate_status=pass；gate_reason=framework_closed；next_allowed_action=step_05_components；formal_backfill_allowed=after_step14；commit_required=false。
