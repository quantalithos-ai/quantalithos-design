## Step 5. 主要组成部分、职责与边界

### 1. Step 状态

- 状态：[x] 已确认
- 对应 SOP：`standards/document/概要设计讨论流程_SOP.md` Step 5
- 回填章节：`projects/L0-bus/02-概要设计.md` §5 主要组成部分、职责与边界

### 2. 本步输入

- 上游文档：
  - `projects/L0-bus/00-需求文档.md`
  - `projects/L0-bus/01-架构设计.md`
  - `projects/L0-bus/design-calibration/02_hld_step_04_code_subject_framework.md`
- 已确认结论：
  - `L0-bus` 的概要设计主要组成部分必须围绕事件传递主线切分，而不是围绕代码目录、部署容器、外部系统或后端产品切分。
  - `Inbound / Operations`、`Application Services`、`Domain Model / Policies`、`Ports / Persistence / Projection / Adapters` 是实现分层，不是主要组成部分。
  - `Bus API`、`Delivery worker`、`Recovery worker`、`Read output worker` 是运行入口或触发形态，不能替代业务组成部分。
  - `MQ backend`、`durable bus store`、`L0-core`、publisher、subscriber、SDK、observability、governance 是外部上下文或外部能力，不进入本仓主要组成部分。
- 依赖的前序 Step：
  - Step 1：确认上游输入边界。
  - Step 2：明确本仓设计目标与当前范围。
  - Step 3：收稳约束条件。
  - Step 4：代码主体框架映射。

### 3. SOP 问题回答

1. 当前概要设计层面，本仓应被划分为哪些主要组成部分？

   回答：本仓主要组成部分划分为六个：发布材料接入与传递语义形成、订阅 delivery 推进、结果反馈与幂等留痕、失败恢复与重放准备、审计历史与只读输出、存储引用与后端适配边界。前五个是事件传递主线组成部分，第六个是承载持久化、引用、投影和后端适配的支撑边界。

2. 每个主要组成部分分别承担什么职责？

   回答：发布接入部分负责把合法发布材料和已提交 outbox fact 转成 bus 可推进的 publication acceptance 和 transport semantic；delivery 推进部分负责面向订阅方形成 delivery 并推进生命周期；反馈部分负责记录 ack / fail / timeout 和幂等锚点；恢复部分负责 retry、dead-letter 和 replay preparation；只读输出部分负责 audit、history、transport view、failure summary 和 tap material；支撑边界部分负责 bus store、外部引用、后端能力和基础端口隔离。

3. 每个主要组成部分明确不承担什么职责？

   回答：所有组成部分都不重新定义 `L0-core` 契约，不保存业务 payload 正文，不生成 governance decision，不承载 observability 长期日志产品，不把 SDK 客户端体验写入 bus truth。各组成部分还需要守住局部边界：发布接入不拥有业务 outbox truth；delivery 推进不处理订阅方业务副作用；反馈留痕不接管业务幂等；恢复准备不绕过 audit chain；只读输出不反写 truth；支撑边界不把具体后端产品语义泄漏成平台 transport semantic。

4. 每个主要组成部分包含哪些代码主体 / 模块？

   回答：本步只列出代码主体 / 模块名称、类型、作用和后续展开位置。对象字段、成员函数、工厂函数留给 Step 6；接口分类留给 Step 7；处理流留给 Step 8；状态机留给 Step 9。

5. 这些代码主体 / 模块在本部分中只需要说明到什么粒度？

   回答：只说明到“属于哪个组成部分、是什么类型、承担什么作用、后续在哪里展开”。不写 Rust 目录、crate、完整 trait、函数签名、DTO schema、数据库表、topic、HTTP path 或 worker 调度细节。

6. 哪些内容虽然相关，但必须由相邻部分或边界外能力承担？

   回答：共享契约由 `L0-core` 承担；业务 payload 和业务副作用由发布方 / 订阅方承担；SDK 开发者体验由 `L0-sdk` 承担；长期观测产品由 `L4-observability` 承担；治理决策由 `L1-governance` 承担；具体 MQ 产品部署和运维 runbook 由部署 / 运维层承担。

7. 哪些职责如果不写清，后续最容易让概要设计滑进实现层或让不同部分串线？

   回答：最容易串线的是 `Bus API` 和主要组成部分混用、delivery 幂等和业务幂等混用、failure material 和 governance decision 混用、transport view 和 SDK client 混用、backend adapter 和平台传递语义混用、read-only output 和 bus truth 混用。本步必须把这些边界写清。

8. 本步应如何给 Step 6 提供对象发现入口？

   回答：本步不展开字段和函数，但必须在每个主要组成部分内标出 truth、state、policy、projection、reference、audit / history 等对象发现线索，并明确哪些候选对象必须在 Step 6 独立成节。否则 Step 6 容易只按流程段归组对象，而不是把每个未来可能成为 struct、enum、value object、projection、policy、audit record 或 history record 的对象定义成稳定代码主体骨架。

### 4. 当前文档问题诊断

| 位置 | 当前问题 | 影响 |
|---|---|---|
| 旧 `02-概要设计.md` §5 | 主要组成部分仍带有旧 envelope / routing / transport / retry 口径 | 与新版需求中的 publication、delivery、feedback、recovery、read-only output 主线不一致 |
| 旧 §5 / §6 | 主要组成部分、代码模块、部署容器和外部能力混在一起 | 后续详细设计难以判断哪些是业务组成部分、哪些只是实现分层或外部依赖 |
| 旧全文 | 存储、投影、后端适配和只读输出边界没有稳定归位 | 容易让 tap / view / failure material 反写真相或泄漏外部正文 |
| 旧全文 | 没有清晰说明每个组成部分不承担什么 | 后续实现容易把 SDK、observability、governance、业务 payload 职责吸入 bus |

### 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 切分依据 | 旧 envelope / routing / transport / retry / audit 主题 | 按发布接入、delivery 推进、反馈留痕、失败恢复、只读输出、支撑边界切分 | 对齐新版核心闭环 |
| 组成部分类型 | 混合业务能力、运行容器和技术实现 | 主要组成部分只表达概要设计层业务结构主语 | 避免架构和详细设计边界混淆 |
| 支撑能力 | store、adapter、projection 边界分散 | 单独收束为“存储、引用与后端适配边界” | 避免支撑能力污染核心传递语义 |
| 非职责 | 边界多以散文提示出现 | 每个组成部分都写明不承担什么 | 降低后续实现膨胀风险 |
| 后续展开 | 对象、接口、状态和流程缺少承接关系 | 每个代码主体标注 Step 6~9 的展开位置 | 支撑详细设计逐步承接 |
| 对象发现入口 | 只列代码主体名称，缺少 truth / state / policy / projection / reference 维度 | 为每个组成部分补对象发现线索和 Step 6 必须展开对象 | 避免 Step 6 把正式对象压缩成对象组 |

### 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A：按运行容器切分为 Bus API、Delivery worker、Recovery worker、Read output worker、Bus store | 接近部署形态，容易让实现者理解运行入口 | 会把容器当成业务组成部分，概要设计滑向部署和实现 | 不采用 |
| 方案 B：按实现分层切分为 inbound、application、domain、ports、infra | 符合代码组织思维 | 只能说明代码如何安放，不能说明事件传递主线由哪些能力构成 | 不采用 |
| 方案 C：按事件传递主线切分主要组成部分，再在每部分内列代码主体和接缝 | 同时表达业务结构和后续实现落点 | 需要在文档中反复说明主要组成部分与实现分层不同 | 采用 |

### 7. 结构化中间产物

#### 7.1 组成部分总表

| 组成部分 | 核心职责 | 主要代码主体 | 不承担什么 |
|---|---|---|---|
| 发布材料接入与传递语义形成 | 承接合法发布材料、已提交 outbox fact，并形成 bus 平台级传递语义 | `BusCommandApi`、`OutboxRelayTrigger`、`PublicationAcceptanceService`、`TransportSemanticService`、`PublicationMaterial`、`PublicationAcceptance`、`TransportSemantic` | 不定义 core 契约，不拥有业务 outbox truth，不保存 payload 正文，不暴露裸后端参数 |
| 订阅 delivery 推进 | 根据传递语义和订阅范围形成 delivery，并推进 delivery 生命周期 | `DeliveryWorkerTrigger`、`DeliveryProgressionService`、`DeliveryRecord`、`DeliveryAttempt`、`DeliveryLifecycle`、`TransportBackendPort` | 不处理订阅方业务副作用，不保证全局 exactly-once，不把后端差异泄漏给订阅方 |
| 结果反馈与幂等留痕 | 接收 ack / fail / timeout / duplicate feedback，记录结果、幂等锚点和历史 | `DeliveryFeedbackApi`、`FeedbackRecordingService`、`FeedbackResult`、`IdempotencyAnchor`、`DeliveryHistoryEntry` | 不判断业务处理是否正确，不接管订阅方业务幂等，不生成治理决策 |
| 失败恢复与重放准备 | 基于 delivery history、dead-letter 和 audit chain 推进 retry、DLQ 和 replay preparation | `RecoveryOperationsApi`、`RecoveryOrchestrationService`、`ReplayPreparationService`、`RetryPlan`、`DeadLetterEntry`、`ReplayPreparation`、`FailureMaterial`、`RecoveryEligibilityPolicy` | 不绕过审计链 replay，不直接执行治理审批，不提供 DLQ Console UI |
| 审计、历史与只读输出 | 形成 bus audit、delivery history、transport view、failure summary、tap material 等只读输出 | `BusQueryApi`、`ReadOutputWorkerTrigger`、`ReadOutputService`、`BusAuditEntry`、`TransportViewProjection`、`FailureSummaryProjection`、`ReadOnlyOutputPolicy` | 不反写 bus truth，不做 observability 长期存储，不封装 SDK client 体验 |
| 存储、引用与后端适配边界 | 隔离 durable store、外部引用、投影仓储、后端能力和基础端口 | `BusStorePort`、`PublicationRepository`、`DeliveryRepository`、`IdempotencyRepository`、`DeadLetterRepository`、`AuditTrailRepository`、`ReadProjectionRepository`、`OutboxFactSourcePort`、`BackendCapabilityRef`、`ClockPort`、`IdGeneratorPort`、`UnitOfWork` | 不成为业务组成部分的替代命名，不定义具体数据库 / MQ 产品，不解释外部正文 |

##### 7.1.1 对象发现维度总表

| 组成部分 | Truth / State | Policy / Invariant | Projection / Read model | Reference / Boundary | Audit / History | Step 6 必须独立展开 |
|---|---|---|---|---|---|---|
| 发布材料接入与传递语义形成 | `PublicationAcceptance`、`PublicationAcceptanceStatus` | `PayloadBoundaryGuard` | - | `PublicationMaterial`、`CoreEventRef`、`PayloadRef`、`OutboxFactRef` | 发布接入审计 | `PublicationMaterial`、`PublicationAcceptance`、`TransportSemantic`、`PayloadBoundaryGuard` |
| 订阅 delivery 推进 | `DeliveryRecord`、`DeliveryAttempt`、`DeliveryStatus` | `DeliveryLifecycle` | - | `TransportBackendPort`、`BackendDeliveryRef` | delivery 状态历史 | `DeliveryRecord`、`DeliveryAttempt`、`DeliveryLifecycle` |
| 结果反馈与幂等留痕 | `FeedbackResult`、`FeedbackStatus`、`IdempotencyAnchor` | delivery / feedback 幂等规则 | - | `IdempotencyKey`、`RecordRef` | `DeliveryHistoryEntry` | `FeedbackResult`、`IdempotencyAnchor`、`DeliveryHistoryEntry` |
| 失败恢复与重放准备 | `RetryPlan`、`DeadLetterEntry`、`ReplayPreparation`、`FailureMaterial` | `RecoveryEligibilityPolicy` | failure material 输出形态 | `RetryPolicyRef`、`AuditChainRef`、`ReplayApprovalRef` | recovery / replay 审计 | `RetryPlan`、`DeadLetterEntry`、`ReplayPreparation`、`FailureMaterial`、`RecoveryEligibilityPolicy` |
| 审计、历史与只读输出 | `BusAuditEntry`、projection status | `ReadOnlyOutputPolicy` | `TransportViewProjection`、`FailureSummaryProjection` | query filter / source audit reference | `BusAuditEntry`、`DeliveryHistoryEntry` | `BusAuditEntry`、`TransportViewProjection`、`FailureSummaryProjection`、`ReadOnlyOutputPolicy` |
| 存储、引用与后端适配边界 | repository 保存的 bus truth | `BackendCapabilityPolicy` | projection repository 边界 | `BackendCapabilityRef`、`ClockPort`、`IdGeneratorPort`、`UnitOfWork` | repository 写入审计接缝 | `BackendCapabilityRef`、`BackendCapabilityPolicy`；端口接口留给 Step 7 / 详细设计 |

关键说明：

- 该表不是 Step 6 的对象定义表，只是 Step 6 的对象发现入口。
- 只要候选对象未来可能成为 struct、enum、value object、projection、policy、audit record 或 history record，就不能在 Step 6 中被合并为一行泛化说明。
- `Repository`、`Port`、`API`、`Trigger` 主要进入 Step 7 / 详细设计；只有 `BackendCapabilityRef` 这类引用对象进入 Step 6。
- 状态枚举可以在 Step 6 对象内先点名，完整状态流转仍由 Step 9 收口。

#### 7.2 各部分交互总图

```text
+---------------------------------------------------------------+
| 1. 发布材料接入与传递语义形成                                |
|    publication acceptance / transport semantic                |
+-------------------------------+-------------------------------+
                                |
                                v
+-------------------------------+-------------------------------+
| 2. 订阅 delivery 推进                                         |
|    delivery record / attempt / lifecycle                      |
+-------------------------------+-------------------------------+
                                |
                                v
+-------------------------------+-------------------------------+
| 3. 结果反馈与幂等留痕                                        |
|    feedback result / idempotency / history                    |
+---------------+---------------+---------------+---------------+
                |                               |
                v                               v
+---------------+---------------+   +-----------+---------------+
| 4. 失败恢复与重放准备        |   | 5. 审计、历史与只读输出    |
|    retry / DLQ / replay prep  |   |    audit / views / outputs |
+---------------+---------------+   +-----------+---------------+
                |                               ^
                v                               |
+---------------+-------------------------------+---------------+
| 6. 存储、引用与后端适配边界                                  |
|    store / repositories / projections / backend ports          |
+---------------------------------------------------------------+
```

关键说明：

- 该图表达主要组成部分之间的概要级协作关系，不表达协议字段、函数调用链、worker 调度顺序或数据库事务。
- 组成部分 `1~5` 构成事件传递主线，组成部分 `6` 为它们提供持久化、引用、投影和后端适配支撑。
- 结果反馈既可能结束 delivery，也可能触发失败恢复；两条路径都必须进入审计、历史和只读输出。
- 只读输出只能从 bus truth、history、failure material 和 projection 派生，不允许反写前序组成部分的真相。

#### 7.3 发布材料接入与传递语义形成

##### 本部分职责

- 接收发布方提交的发布材料，或由 outbox relay 推进的已提交 outbox fact。
- 校验材料是否具备 `L0-core` 契约引用、payload reference、metadata 和 actor / trace 上下文。
- 形成 `PublicationAcceptance`，说明材料是否被 bus 接受进入传递链。
- 形成平台级 `TransportSemantic`，隔离后端产品差异。

##### 本部分包含的代码主体 / 模块

| 代码主体 / 模块 | 类型 | 作用 | 后续展开位置 |
|---|---|---|---|
| `BusCommandApi` | inbound API | 承接发布材料同步入口 | Step 7 / Step 8 |
| `OutboxRelayTrigger` | operations trigger | 从已提交 outbox fact 推进到发布接入 | Step 7 / Step 8 |
| `PublicationAcceptanceService` | application service | 编排发布接入用例、事务和端口调用 | Step 8 / 详细设计 |
| `TransportSemanticService` | application service | 编排传递语义形成 | Step 8 / 详细设计 |
| `PublicationMaterial` | domain value object | 表达发布材料引用和必要上下文 | Step 6 |
| `PublicationAcceptance` | domain record | 表达 bus 接受发布材料的事实 | Step 6 / Step 9 |
| `TransportSemantic` | domain value object | 表达平台级传递语义 | Step 6 |

##### 对象发现线索

| 维度 | 候选对象 | Step 6 展开要求 |
|---|---|---|
| 发布材料引用 | `PublicationMaterial` | 独立成节，说明 core event、payload、outbox fact、actor、trace 等引用边界 |
| 接入真相 | `PublicationAcceptance` | 独立成节，说明 accepted / rejected 状态和审计要求 |
| 传递语义 | `TransportSemantic` | 独立成节，说明平台语义与后端能力引用的关系 |
| payload 边界策略 | `PayloadBoundaryGuard` | 独立成节或策略对象表，说明禁止正文进入 bus 的判断 |

##### 本部分不承担什么

- 不重新定义 `L0-core` 的 Event、Error、TraceContext、Metadata 或 ActorRef。
- 不保存业务 payload 正文。
- 不拥有发布方业务 outbox truth。
- 不把 NATS / Redis / Kafka 等后端裸参数作为平台传递语义。

##### 与其他部分的接缝

- 向“订阅 delivery 推进”输出已接受发布事实和传递语义。
- 通过“存储、引用与后端适配边界”保存 acceptance、引用 core contract / payload / outbox fact。
- 向“审计、历史与只读输出”提供可审计的发布接入事实。

#### 7.4 订阅 delivery 推进

##### 本部分职责

- 根据 `TransportSemantic` 和订阅范围形成 `DeliveryRecord`。
- 推进 `DeliveryAttempt`，把平台语义交给后端适配端口。
- 维护 `DeliveryLifecycle` 的状态推进规则。
- 在后端不可用、订阅方不可达或投递失败时生成可进入反馈 / 恢复链的状态材料。

##### 本部分包含的代码主体 / 模块

| 代码主体 / 模块 | 类型 | 作用 | 后续展开位置 |
|---|---|---|---|
| `DeliveryWorkerTrigger` | operations trigger | 触发后台 delivery 推进 | Step 7 / Step 8 |
| `DeliveryProgressionService` | application service | 编排 delivery 形成、尝试和推进 | Step 8 / 详细设计 |
| `DeliveryRecord` | domain aggregate / record | 保存 bus 拥有的 delivery 真相 | Step 6 / Step 9 |
| `DeliveryAttempt` | domain record | 表示单次投递尝试 | Step 6 |
| `DeliveryLifecycle` | domain policy / state rule | 约束 delivery 状态转移 | Step 6 / Step 9 |
| `TransportBackendPort` | outbound port | 抽象后端传输能力 | Step 7 / 详细设计 |

##### 对象发现线索

| 维度 | 候选对象 | Step 6 展开要求 |
|---|---|---|
| delivery 真相 | `DeliveryRecord` | 独立成节，说明 delivery id、subscriber、status、attempt、idempotency 等关键字段 |
| 单次投递尝试 | `DeliveryAttempt` | 独立成节，不能只作为 `DeliveryRecord` 的一行说明 |
| 生命周期规则 | `DeliveryLifecycle` | 独立成节或策略对象表，说明允许 / 禁止状态迁移判断 |
| 后端传递引用 | `BackendDeliveryRef` | 可作为字段类型或引用对象说明，不展开具体后端响应正文 |

##### 本部分不承担什么

- 不执行订阅方业务逻辑。
- 不保证订阅方业务副作用 exactly-once。
- 不把后端产品状态直接暴露为 bus 语义。
- 不决定业务事件是否应该被消费；它只推进已成立的传递语义。

##### 与其他部分的接缝

- 消费“发布材料接入与传递语义形成”的 accepted publication 和 transport semantic。
- 向“结果反馈与幂等留痕”输出 delivery 结果等待点、timeout 或后端失败信号。
- 通过“存储、引用与后端适配边界”读取 / 写入 delivery record，并调用 backend port。

#### 7.5 结果反馈与幂等留痕

##### 本部分职责

- 接收订阅方 ack / fail，也接收 timeout 和重复反馈判定结果。
- 基于 `IdempotencyAnchor` 判断重复 delivery 或重复 feedback。
- 形成 `FeedbackResult` 和 `DeliveryHistoryEntry`。
- 把失败结果交给失败恢复链，把成功结果交给审计和只读输出。

##### 本部分包含的代码主体 / 模块

| 代码主体 / 模块 | 类型 | 作用 | 后续展开位置 |
|---|---|---|---|
| `DeliveryFeedbackApi` | inbound API | 接收订阅方结果反馈 | Step 7 / Step 8 |
| `FeedbackRecordingService` | application service | 编排反馈记录、幂等判断和历史写入 | Step 8 / 详细设计 |
| `FeedbackResult` | domain value object / record | 表达 ack / fail / timeout / duplicate 的 bus 级结果 | Step 6 / Step 9 |
| `IdempotencyAnchor` | domain value object / record | 表达 delivery / feedback 的幂等锚点 | Step 6 |
| `DeliveryHistoryEntry` | domain event record | 记录 delivery 生命周期变化历史 | Step 6 |

##### 对象发现线索

| 维度 | 候选对象 | Step 6 展开要求 |
|---|---|---|
| 反馈结果 | `FeedbackResult` | 独立成节，说明 ack / fail / timeout / duplicate 状态，不得合并进反馈对象组 |
| 幂等锚点 | `IdempotencyAnchor` | 独立成节，说明 scope、key、bound record 和重复判断 |
| 历史条目 | `DeliveryHistoryEntry` | 独立成节，说明 from status、to status、reason、occurred at |
| 幂等键 | `IdempotencyKey` | 可作为字段类型说明，完整生成规则留给详细设计 |

##### 本部分不承担什么

- 不判断订阅方业务逻辑是否正确。
- 不替订阅方实现业务副作用幂等。
- 不直接生成 retry / dead-letter / replay preparation 的最终处置结果。
- 不把 failure material 等同 governance decision。

##### 与其他部分的接缝

- 从“订阅 delivery 推进”接收 delivery waiting、timeout、backend failure 等反馈入口。
- 向“失败恢复与重放准备”输出失败反馈和可恢复材料。
- 向“审计、历史与只读输出”输出反馈结果和历史条目。
- 通过“存储、引用与后端适配边界”维护幂等锚点和 history。

#### 7.6 失败恢复与重放准备

##### 本部分职责

- 根据失败 delivery、retry policy、dead-letter material 和 audit chain 形成恢复路径。
- 推进 retry、dead-letter 和 replay preparation。
- 判断 replay 是否具备完整 history、DLQ 和 audit chain。
- 形成面向 operator / governance 的 failure material，但不做治理决策。

##### 本部分包含的代码主体 / 模块

| 代码主体 / 模块 | 类型 | 作用 | 后续展开位置 |
|---|---|---|---|
| `RecoveryOperationsApi` | operations API | 承接 retry / DLQ / replay preparation 控制入口 | Step 7 / Step 8 |
| `RecoveryOrchestrationService` | application service | 编排失败恢复路径 | Step 8 / 详细设计 |
| `ReplayPreparationService` | application service | 编排 replay preparation | Step 8 / 详细设计 |
| `RetryPlan` | domain value object | 表达重试计划和下一步恢复方向 | Step 6 / Step 9 |
| `DeadLetterEntry` | domain record | 表达进入死信的失败材料 | Step 6 / Step 9 |
| `ReplayPreparation` | domain record | 表达重放准备材料和状态 | Step 6 / Step 9 |
| `FailureMaterial` | domain / read material | 表达可输出给治理或运维的失败事实 | Step 6 |
| `RecoveryEligibilityPolicy` | domain policy | 判断 retry / DLQ / replay 是否允许 | Step 6 / Step 9 |

##### 对象发现线索

| 维度 | 候选对象 | Step 6 展开要求 |
|---|---|---|
| 重试计划 | `RetryPlan` | 独立成节，说明 scheduled / exhausted / cancelled 等状态 |
| 死信材料 | `DeadLetterEntry` | 独立成节，说明 failure reason、history、audit chain |
| 重放准备 | `ReplayPreparation` | 独立成节，说明 draft / ready / rejected / superseded 状态 |
| 失败事实材料 | `FailureMaterial` | 独立成节，说明它不是 governance decision |
| 恢复允许性 | `RecoveryEligibilityPolicy` | 独立成节或策略对象表，说明 retry / DLQ / replay 前置条件 |

##### 本部分不承担什么

- 不在缺少 dead-letter、delivery history 和 audit chain 时允许 replay。
- 不生成 governance decision。
- 不提供 DLQ Console UI。
- 不把 operator 控制动作变成普通业务 command。

##### 与其他部分的接缝

- 从“结果反馈与幂等留痕”接收失败反馈和 history。
- 通过“存储、引用与后端适配边界”读取 dead-letter、audit、delivery 记录。
- 向“审计、历史与只读输出”输出 retry、DLQ、replay preparation 和 failure material。
- 必要时重新交给“订阅 delivery 推进”发起受控 retry。

#### 7.7 审计、历史与只读输出

##### 本部分职责

- 为发布接入、delivery、反馈、恢复和重放准备形成 bus audit entry。
- 派生 transport view、failure summary、tap output、运行状态材料。
- 为 SDK、observability、governance、operator 提供只读消费边界。
- 保证只读输出可重建、可追溯，不反写真相。

##### 本部分包含的代码主体 / 模块

| 代码主体 / 模块 | 类型 | 作用 | 后续展开位置 |
|---|---|---|---|
| `BusQueryApi` | query API | 提供只读查询入口 | Step 7 / Step 8 |
| `ReadOutputWorkerTrigger` | operations trigger | 触发只读投影和输出派生 | Step 7 / Step 8 |
| `ReadOutputService` | application service | 编排只读投影更新和输出材料生成 | Step 8 / 详细设计 |
| `BusAuditEntry` | domain event record / audit record | 记录总线级审计事实 | Step 6 |
| `TransportViewProjection` | projection | 面向 SDK / consumer 的传递视图 | Step 6 |
| `FailureSummaryProjection` | projection | 面向 governance / operator 的失败摘要 | Step 6 |
| `ReadOnlyOutputPolicy` | domain policy | 约束只读输出不反写真相 | Step 6 / Step 10 |

##### 对象发现线索

| 维度 | 候选对象 | Step 6 展开要求 |
|---|---|---|
| 审计事实 | `BusAuditEntry` | 独立成节，说明 subject、action、actor、occurred at |
| 传递视图 | `TransportViewProjection` | 独立成节，说明 projection status、source audit 和只读边界 |
| 失败摘要 | `FailureSummaryProjection` | 独立成节，说明 failure material 来源和非治理决策边界 |
| 只读策略 | `ReadOnlyOutputPolicy` | 独立成节或策略对象表，说明 projection write 只能影响只读视图 |

##### 本部分不承担什么

- 不作为 observability 长期存储和报表产品。
- 不封装 SDK client 体验。
- 不生成 governance decision。
- 不把 projection 写回 bus truth。

##### 与其他部分的接缝

- 从发布接入、delivery 推进、反馈留痕和失败恢复读取已提交 bus truth、history 和 audit。
- 通过“存储、引用与后端适配边界”读取 repository 和 projection。
- 向外部 SDK、observability、governance、operator 输出只读材料。

#### 7.8 存储、引用与后端适配边界

##### 本部分职责

- 提供 durable bus store 抽象、repository、projection repository、unit of work、时间和 ID 端口。
- 保存 bus truth、history、audit、dead-letter、replay preparation 和只读 projection。
- 保留 core contract、payload、outbox fact、backend capability 等外部引用。
- 用 backend port 隔离具体 MQ / in-memory / 后续后端差异。

##### 本部分包含的代码主体 / 模块

| 代码主体 / 模块 | 类型 | 作用 | 后续展开位置 |
|---|---|---|---|
| `BusStorePort` | persistence port | 抽象 bus 持久化能力 | Step 7 / 详细设计 |
| `PublicationRepository` | repository port | 保存发布接入事实 | Step 7 / 详细设计 |
| `DeliveryRepository` | repository port | 保存 delivery 真相和状态 | Step 7 / 详细设计 |
| `IdempotencyRepository` | repository port | 保存幂等锚点 | Step 7 / 详细设计 |
| `DeadLetterRepository` | repository port | 保存死信和 replay preparation 材料 | Step 7 / 详细设计 |
| `AuditTrailRepository` | repository port | 保存审计和历史材料 | Step 7 / 详细设计 |
| `ReadProjectionRepository` | repository port | 保存只读投影 | Step 7 / 详细设计 |
| `OutboxFactSourcePort` | inbound source port | 读取已提交 outbox fact 来源 | Step 7 / 详细设计 |
| `BackendCapabilityRef` | reference object | 表达后端能力引用 | Step 6 |
| `ClockPort` / `IdGeneratorPort` / `UnitOfWork` | infrastructure port | 提供时间、ID 和事务边界 | Step 7 / 详细设计 |

##### 对象发现线索

| 维度 | 候选对象 | Step 6 展开要求 |
|---|---|---|
| 后端能力引用 | `BackendCapabilityRef` | 独立成节，说明 backend kind、profile ref、capability version，不保存 secret |
| 后端映射策略 | `BackendCapabilityPolicy` | 独立成节或策略对象表，说明平台语义到后端能力的允许性判断 |
| 基础端口 | `ClockPort`、`IdGeneratorPort`、`UnitOfWork` | 不作为 Step 6 关键对象完整展开，进入 Step 7 / 详细设计 |
| repository port | `PublicationRepository` 等 | 不作为领域对象展开，进入 Step 7 / 详细设计 |

##### 本部分不承担什么

- 不替代业务主要组成部分。
- 不定义具体数据库、消息中间件或部署产品。
- 不保存业务 payload 正文、secret、治理决策正文或观测长期日志正文。
- 不把后端能力差异泄漏成上层 transport semantic。

##### 与其他部分的接缝

- 被前五个组成部分通过 repository、port、projection 和 unit of work 调用。
- 连接外部持久化能力、消息后端、outbox fact 来源和基础设施能力。
- 向只读输出部分提供 projection 存取能力。

#### 7.9 总体边界说明

| 边界 | 本仓内职责 | 边界外职责 |
|---|---|---|
| core / bus | bus 消费共享契约并承载传递运行主线 | `L0-core` 定义 Event、Error、TraceContext、Metadata、ActorRef 等共享契约 |
| bus / publisher | bus 接收合法发布材料和已提交 outbox fact 引用 | 发布方拥有业务事实、业务 outbox truth 和 payload 正文 |
| bus / subscriber | bus 形成 delivery 并接收反馈 | 订阅方执行业务处理和业务副作用幂等 |
| bus / SDK | bus 输出 transport view | `L0-sdk` 封装开发者体验和 client API |
| bus / observability | bus 输出 tap、audit material 和 trace 相关只读材料 | `L4-observability` 做长期存储、查询、报表和告警 |
| bus / governance | bus 输出 failure material 和 DLQ summary | `L1-governance` 做审批和治理决策 |
| bus / backend | bus 定义平台传递语义和 adapter port | MQ / in-memory / 后续后端提供具体传输能力 |

#### 7.10 后续展开一致性检查结论

| 后续 Step | 必须承接的内容 | 不得偏离的边界 |
|---|---|---|
| Step 6 关键对象 | 必须覆盖各组成部分中点名的关键 domain object、record、projection、policy、reference | 不把 repository / API 全部当成领域对象展开 |
| Step 7 API / 接口 | 必须按 Command、Query、Event Consumer、Outbound Event、Operations Job 分类 | 不写 HTTP path、完整 JSON / proto、鉴权实现 |
| Step 8 处理流 | 必须围绕 publish、outbox relay、delivery、feedback、recovery、read output 主线画关键流 | 不把所有内部 helper 都画成处理流 |
| Step 9 状态机 | 必须覆盖 publication acceptance、delivery、feedback / recovery、dead-letter、replay preparation、read output 的状态 | 不把外部业务状态或 MQ 产品状态写成本仓状态 |
| Step 10 异常边界 | 必须覆盖非法契约、payload 禁止正文、后端不可用、重复反馈、无审计 replay、只读反写等 | 不把业务处理失败正文和治理决策正文吸入 bus |

#### 7.11 Step 6 展开门禁

| 判断问题 | 通过标准 | 不通过时的处理 |
|---|---|---|
| 是否覆盖每个主要组成部分的 truth / state / policy / projection / reference / audit 线索 | Step 6 能从本文件找到对象来源 | 回到 Step 5 补对象发现线索 |
| 是否把未来可能成为 struct / enum / value object / projection / policy 的对象独立成节 | 每个对象都有自己的基本信息、字段、状态、函数或禁止事项 | 不允许合并成对象组 |
| 是否避免把 API / repository / port 当成领域对象 | Step 6 只展开对象、投影、策略、引用、审计和历史记录 | API / port 进入 Step 7 或详细设计 |
| 是否能反查 Step 8 / Step 9 用到的对象 | 处理流和状态机中出现的对象都能在 Step 6 找到定义 | Step 6 必须补对象骨架 |
| 是否守住 forbidden body 边界 | Step 6 对象字段不出现 payload body、raw secret、governance decision body、observability long-term log body | 回到 Step 6 修正字段骨架 |

### 8. 回填草稿

正式 `02-概要设计.md` §5 “主要组成部分、职责与边界”直接摘录并润色本文件：

- §7.1 “组成部分总表”
- §7.1.1 “对象发现维度总表”
- §7.2 “各部分交互总图”
- §7.3 ~ §7.8 每个主要组成部分的小节
- §7.9 “总体边界说明”
- §7.10 “后续展开一致性检查结论”
- §7.11 “Step 6 展开门禁”

不在本 Step 重复粘贴完整正式章节正文。Step 14 生成正式文档时,再统一补充校准来源、延伸阅读、正式文档语气和章节衔接。

### 9. 待确认事项

- 无阻塞进入 Step 6 的待确认事项。
- Step 6 需要基于本文件点名的代码主体,选择真正需要概要设计层独立展开的关键对象、投影、策略、引用对象和端口对象。

### 10. 进入下一步条件

- 已明确本仓由六个主要组成部分构成。
- 已说明每个组成部分承担什么、不承担什么。
- 已列出每个组成部分包含的代码主体 / 模块和后续展开位置。
- 已为每个组成部分补充 truth / state / policy / projection / reference / audit 等对象发现线索。
- 已明确 Step 6 必须独立成节的关键对象、投影、策略、引用、审计和历史记录。
- 已形成各部分交互总图和总体边界说明。
- 已避免展开对象字段、函数骨架、接口 schema、状态细节和实现目录。
- 已足以进入 Step 6 “关键对象轮廓”。
