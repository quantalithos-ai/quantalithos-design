## Step 4. 代码主体框架映射

### 1. Step 状态

- 状态：[x] 已确认
- 对应 SOP：`standards/document/概要设计讨论流程_SOP.md` Step 4
- 回填章节：`projects/L0-bus/02-概要设计.md` §4 代码主体框架总览

### 2. 本步输入

- 上游文档：
  - `projects/L0-bus/00-需求文档.md`
  - `projects/L0-bus/01-架构设计.md`
  - `projects/L0-bus/design-calibration/02_hld_step_02_scope.md`
  - `projects/L0-bus/design-calibration/02_hld_step_03_constraints.md`
  - `standards/document/子项目目录与代码文件组织规范.md`
- 已确认结论：
  - `L0-bus` 的 P0 主线是基于 `L0-core` 契约的 publication acceptance、transport semantic、delivery、feedback、recovery、audit 和 read-only output。
  - `L0-bus` 内部必须采用 ports and adapters,隔离入口、应用编排、领域语义、持久化、投影和后端适配。
  - `L0-bus` 不把 MQ backend、store 产品、业务仓、SDK、observability 或 governance 正文模型当成本仓内部领域对象。
  - 本步只做代码主体框架映射,不写 crate / module / file tree,不写完整 trait、struct、字段、函数签名或协议 schema。
- 依赖的前序 Step：
  - Step 1：确认上游输入边界。
  - Step 2：明确本仓设计目标与当前范围。
  - Step 3：收稳约束条件。

### 3. SOP 问题回答

1. 架构层已经收稳的模块，分别应落到哪些代码主体骨架上？

   回答：架构层的传递语义核心、发布材料承接、订阅 delivery 推进、失败恢复、只读输出、后端适配和本地引用 / 投影,应分别转译为 publish、delivery、feedback、recovery、read output、adapter / store、reference / projection 等代码主体骨架。容器层的 Bus API、Delivery worker、Outbox relay、Recovery worker、Read output worker、Bus store 和 MQ backend,应分别落到 inbound / operations、application service、domain object、port、repository、projection 和 adapter 主语上。

2. 哪些主体属于 Inbound / Operations，哪些属于 Application Services？

   回答：Inbound / Operations 包括 `BusCommandApi`、`DeliveryFeedbackApi`、`RecoveryOperationsApi`、`BusQueryApi`、`OutboxRelayTrigger`、`DeliveryWorkerTrigger`、`ReadOutputWorkerTrigger`。Application Services 包括 `PublicationAcceptanceService`、`TransportSemanticService`、`DeliveryProgressionService`、`FeedbackRecordingService`、`RecoveryOrchestrationService`、`ReplayPreparationService`、`ReadOutputService`、`BusOperationsService`。入口只做协议转换、上下文传递和错误映射,应用服务负责编排用例、事务边界和端口调用。

3. 哪些主体属于 Domain Model，哪些属于 Ports / Persistence / Projection / Outbox？

   回答：Domain Model 包括 `PublicationMaterial`、`PublicationAcceptance`、`TransportSemantic`、`DeliveryRecord`、`DeliveryAttempt`、`DeliveryLifecycle`、`FeedbackResult`、`IdempotencyAnchor`、`RetryPlan`、`DeadLetterEntry`、`ReplayPreparation`、`BusAuditEntry`、`DeliveryHistoryEntry`、`FailureMaterial`。Ports / Persistence / Projection 包括 `PublicationRepository`、`DeliveryRepository`、`IdempotencyRepository`、`DeadLetterRepository`、`AuditTrailRepository`、`BusStorePort`、`TransportBackendPort`、`OutboxFactSourcePort`、`ReadProjectionRepository`、`TransportViewProjection`、`FailureSummaryProjection`、`BackendCapabilityRef`、`UnitOfWork`、`ClockPort`、`IdGeneratorPort`。

4. 哪些名称必须在概要设计层先点名，否则详细设计会重新发明主语？

   回答：必须先点名事件传递主线中的服务、领域对象、策略、端口、投影和 worker 主语。特别是 `PublicationAcceptanceService`、`DeliveryProgressionService`、`FeedbackRecordingService`、`RecoveryOrchestrationService`、`DeliveryRecord`、`IdempotencyAnchor`、`DeadLetterEntry`、`ReplayPreparation`、`TransportBackendPort`、`BusStorePort`、`TransportViewProjection` 等。如果不在概要设计层先固定,详细设计会重新发明 publish、delivery、ack / fail、DLQ、replay、tap 和 store 的主语。

5. 哪些内容已经是代码目录、文件路径或框架实现，不应在本步展开？

   回答：Rust workspace / single crate 选择、crate member、module path、文件名、HTTP path、topic name、DTO schema、trait 函数签名、struct 字段全集、数据库表、索引、事务伪代码、adapter 产品实现、部署拓扑和资源配额都不进入本步。这些内容应由详细设计、配置设计、测试方案或实施计划继续展开。

### 4. 当前文档问题诊断

| 位置 | 当前问题 | 影响 |
|---|---|---|
| 旧 `02-概要设计.md` §4 | 系统上下文图重复架构设计,没有转译为代码主体框架 | 后续详细设计无法从概要设计直接找到服务、对象、端口和 worker 主语 |
| 旧 §5 / §6 | 主要组成部分仍围绕 envelope、routing、retry、audit 等旧契约主语 | 与当前 `L0-core` 负责共享契约、`L0-bus` 负责传递运行主干的边界不一致 |
| 旧全文 | Bus API、worker、store、backend 和 read output 没有清晰分层 | 容易把运行容器、业务组成部分和基础设施适配混成同一级 |
| 旧全文 | 未体现 in-memory default path、durable bus store、read-only output 不反写等新约束 | 后续对象和接口可能继续按旧 MQ 产品或 topic 口径展开 |

### 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 主体来源 | 按 envelope / routing / topic / retry 等旧契约词组织 | 按 publication、delivery、feedback、recovery、read output、adapter / store 主线组织 | 对齐新版需求和架构闭环 |
| 架构到代码映射 | 只有系统上下文,缺少代码主体 | 明确入口、应用服务、领域对象、策略、端口、投影、worker | 支撑 03 继续展开 |
| 运行容器 | Bus API / worker / store / backend 没有分层落点 | 分别映射到 inbound、application、domain、port、repository、adapter | 避免运行单元和业务主要组成部分混用 |
| 技术支撑 | MQ backend 和 store 容易被当成核心业务主语 | 明确为 port / adapter / persistence 边界 | 避免后端产品污染 transport semantic |
| 只读输出 | tap / audit / view 边界不清 | 明确为 read-only projection 和 query 边界,不反写 truth | 对齐数据所有权约束 |

### 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A：继续按 envelope / routing / retry / audit 旧主题建框架 | 能复用旧文档内容 | 会把 bus 拉回共享契约仓口径,与 `L0-core` 边界冲突 | 不采用 |
| 方案 B：完全按 Bus API / Worker / Store / Adapter 运行容器建框架 | 接近部署和实现 | 会把概要设计写成容器清单,丢失传递语义主线 | 不采用 |
| 方案 C：按事件传递主线建代码主体框架,再用实现分层视图安放入口、服务、领域、端口和适配 | 同时保留业务主线和实现落点 | 需要维护两张图和一组主语 | 采用 |

### 7. 结构化中间产物

#### 7.1 架构模块到代码主体映射图

```text
L0-bus
|
+-- 1. 发布材料接入与传递语义形成
|   +-- BusCommandApi                         接收发布材料和传递意图
|   +-- OutboxRelayTrigger                    承接已提交 outbox fact
|   +-- PublicationAcceptanceService          编排发布材料接入
|   +-- TransportSemanticService              形成平台级传递语义
|   +-- PublicationMaterial                   发布材料引用对象
|   +-- PublicationAcceptance                 发布接入事实
|   +-- TransportSemantic                     总线传递语义对象
|
+-- 2. 订阅 delivery 推进
|   +-- DeliveryWorkerTrigger                 触发后台 delivery 推进
|   +-- DeliveryProgressionService            编排 delivery 生命周期推进
|   +-- DeliveryRecord                        delivery 真相记录
|   +-- DeliveryAttempt                       单次投递尝试
|   +-- DeliveryLifecycle                     delivery 状态规则
|   +-- TransportBackendPort                  后端传输能力端口
|
+-- 3. 结果反馈与幂等留痕
|   +-- DeliveryFeedbackApi                   接收 ack / fail / timeout 反馈
|   +-- FeedbackRecordingService              编排结果记录和幂等判断
|   +-- FeedbackResult                        总线级反馈结果
|   +-- IdempotencyAnchor                     delivery / feedback 幂等锚点
|   +-- DeliveryHistoryEntry                  delivery 历史记录
|
+-- 4. 失败恢复与重放准备
|   +-- RecoveryOperationsApi                 接收 retry / DLQ / replay 控制
|   +-- RecoveryOrchestrationService          编排失败恢复路径
|   +-- ReplayPreparationService              编排 replay preparation
|   +-- RetryPlan                             重试计划
|   +-- DeadLetterEntry                       死信材料
|   +-- ReplayPreparation                     重放准备材料
|   +-- FailureMaterial                       失败事实材料
|
+-- 5. 审计、历史与只读输出
|   +-- BusQueryApi                           接收只读查询
|   +-- ReadOutputWorkerTrigger               触发只读派生
|   +-- ReadOutputService                     编排只读输出和投影更新
|   +-- BusAuditEntry                         总线审计记录
|   +-- TransportViewProjection               transport view 投影
|   +-- FailureSummaryProjection              failure summary 投影
|
+-- 6. 存储、引用与后端适配边界
    +-- BusStorePort                          durable bus store 抽象端口
    +-- PublicationRepository                 发布接入事实存储
    +-- DeliveryRepository                    delivery 真相存储
    +-- IdempotencyRepository                 幂等锚点存储
    +-- DeadLetterRepository                  死信材料存储
    +-- AuditTrailRepository                  审计和历史存储
    +-- ReadProjectionRepository              只读投影存储
    +-- OutboxFactSourcePort                  已提交 outbox fact 来源端口
    +-- BackendCapabilityRef                  后端能力引用
    +-- UnitOfWork / ClockPort / IdGeneratorPort
```

关键说明：

- 该图表达架构模块如何落成概要设计层代码主体骨架,不是 Rust 目录树。
- `1~5` 是后续 Step 5 的业务主要组成部分候选,第 `6` 是技术承载和外部适配支撑集合。
- `BusCommandApi`、`DeliveryWorkerTrigger`、`RecoveryOperationsApi` 等是入口 / 触发主体,不是领域真相对象。
- `TransportBackendPort` 和 `BusStorePort` 表达边界,不代表具体 MQ 产品或具体数据库产品已经定案。

#### 7.2 实现分层视图

```text
外部调用 / 外部事件 / 运维任务
  - publisher repos / outbox relay actor
  - subscriber repos
  - operator / SRE
  - SDK / observability / governance read consumers
        |
        v
+--------------------------------------------------------------+
| Inbound / Operations                                         |
| - BusCommandApi                                              |
| - DeliveryFeedbackApi                                        |
| - RecoveryOperationsApi                                      |
| - BusQueryApi                                                |
| - OutboxRelayTrigger / DeliveryWorkerTrigger                 |
| - ReadOutputWorkerTrigger                                    |
+-----------------------------+--------------------------------+
                              |
                              v
+--------------------------------------------------------------+
| Application Services                                         |
| - PublicationAcceptanceService                               |
| - TransportSemanticService                                   |
| - DeliveryProgressionService                                 |
| - FeedbackRecordingService                                   |
| - RecoveryOrchestrationService                               |
| - ReplayPreparationService                                   |
| - ReadOutputService                                          |
| - BusOperationsService                                       |
+-----------------------------+--------------------------------+
                              |
                              v
+--------------------------------------------------------------+
| Domain Model / Policies                                      |
| - PublicationMaterial / PublicationAcceptance                |
| - TransportSemantic                                          |
| - DeliveryRecord / DeliveryAttempt / DeliveryLifecycle       |
| - FeedbackResult / IdempotencyAnchor                         |
| - RetryPlan / DeadLetterEntry / ReplayPreparation            |
| - BusAuditEntry / DeliveryHistoryEntry / FailureMaterial     |
| - PayloadBoundaryGuard / RecoveryEligibilityPolicy           |
| - ReadOnlyOutputPolicy / BackendCapabilityPolicy             |
+-----------------------------+--------------------------------+
                              |
                              v
+--------------------------------------------------------------+
| Ports / Persistence / Projection / Adapters                  |
| - BusStorePort / TransportBackendPort                        |
| - PublicationRepository / DeliveryRepository                 |
| - IdempotencyRepository / DeadLetterRepository               |
| - AuditTrailRepository / ReadProjectionRepository            |
| - OutboxFactSourcePort                                       |
| - TransportViewProjection / FailureSummaryProjection         |
| - UnitOfWork / ClockPort / IdGeneratorPort                   |
+--------------------------------------------------------------+
```

关键说明：

- 分层图表达代码职责如何安放,不表达部署拓扑、crate 目录或完整调用链。
- Inbound / Operations 负责把外部请求、后台触发和只读查询带入应用层,不直接改写领域真相。
- Application Services 负责用例编排、事务边界和端口调用,不承载业务不变量本身。
- Domain Model / Policies 承载 bus 传递语义、不变量和状态规则,不依赖具体 MQ 或 store 实现。
- Ports / Persistence / Projection / Adapters 承接持久化、后端传输、只读投影和基础能力边界。

#### 7.3 业务主要组成部分与实现分层关系说明

| 项 | 说明 |
|---|---|
| 业务主要组成部分 | 从架构主线转译而来的功能结构主语,回答 `L0-bus` 在传递主干中“做什么”。 |
| 实现分层 | Inbound / Operations、Application Services、Domain Model / Policies、Ports / Persistence / Projection / Adapters,回答代码如何安放这些主体。 |
| 二者关系 | 一个业务主要组成部分通常跨多个实现层。例如“失败恢复与重放准备”会同时包含 operations API、application service、domain object、policy、repository 和 projection。 |
| 不应混用 | `BusCommandApi`、`DeliveryWorkerTrigger`、`PublicationAcceptanceService` 是代码主体;“发布材料接入与传递语义形成”才是概要设计层的业务主要组成部分。 |

#### 7.4 关键判断

- `发布材料接入与传递语义形成`、`订阅 delivery 推进`、`结果反馈与幂等留痕`、`失败恢复与重放准备`、`审计、历史与只读输出` 是业务主要组成部分候选。
- `Inbound / Operations`、`Application Services`、`Domain Model / Policies`、`Ports / Persistence / Projection / Adapters` 是实现分层,不是业务主要组成部分。
- `Bus API`、`Delivery worker`、`Recovery worker`、`Read output worker` 是运行入口或触发形态,在概要设计中要落为代码主体,但不能替代业务组成部分。
- `MQ backend`、`durable bus store`、`L0-core`、publisher、subscriber、SDK、observability、governance 都是外部上下文或外部能力,不能被当成本仓领域对象。
- `TransportBackendPort`、`BusStorePort`、`OutboxFactSourcePort` 只表达边界和适配点,不表达具体产品已定案。

### 8. 回填草稿

正式 `02-概要设计.md` §4 “代码主体框架总览”直接摘录并润色本文件：

- §7.1 “架构模块到代码主体映射图”
- §7.2 “实现分层视图”
- §7.3 “业务主要组成部分与实现分层关系说明”
- §7.4 “关键判断”

不在本 Step 重复粘贴完整正式章节正文。Step 14 生成正式文档时,再统一补充校准来源、延伸阅读、正式文档语气和章节衔接。

### 9. 待确认事项

- 无阻塞进入 Step 5 的待确认事项。
- Step 5 需要基于本文件 §7.1 和 §7.4,正式收敛哪些是“主要组成部分”,哪些只是技术支撑或实现分层。

### 10. 进入下一步条件

- 已形成架构模块到代码主体映射图。
- 已形成实现分层视图。
- 已明确业务主要组成部分与实现分层不能混用。
- 已避免展开 crate / module / file tree、完整 trait、struct、schema、DDL、HTTP path 和 topic。
- 已足以进入 Step 5 “主要组成部分、职责与边界”。
