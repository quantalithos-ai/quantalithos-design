# Step 7. API / 接口骨架

## 1. Step 状态

- 状态：[x] 已重写
- 对应 SOP：`standards/document/概要设计讨论流程_SOP.md` Step 7
- 回填章节：`projects/L0-bus/02-概要设计.md` §7 API / 接口骨架

---

## 2. 本步输入

| 输入 | 内容 |
|---|---|
| Step 5 主要组成部分 | 发布材料接入与传递语义形成、订阅 delivery 推进、结果反馈与幂等留痕、失败恢复与重放准备、审计历史与只读输出、存储引用与后端适配边界 |
| Step 6 关键对象 | `PublicationMaterial`、`PublicationAcceptance`、`TransportSemantic`、`DeliveryRecord`、`DeliveryAttempt`、`FeedbackResult`、`IdempotencyAnchor`、`RetryPlan`、`DeadLetterEntry`、`ReplayPreparation`、`FailureMaterial`、`BusAuditEntry`、projection、backend capability 等 |
| 架构交互前提 | 外部写入通过 Command / Inbound Event Consumer 进入；外部读取通过 Query / read projection 输出；已提交事实通过 Outbound Event 传播；后台推进通过 Operations Job 执行 |
| 本步规范约束 | 只收稳 API / Event / Job 名称、输入骨架、输出骨架、读写性质和边界；不写 HTTP path、完整 JSON / proto schema、topic、错误码和鉴权实现 |

已确认结论：

```text
接口输入 / 输出骨架是 DTO / view / result skeleton。
它们不是 Step 6 的领域对象，也不应反向污染领域对象定义。
```

---

## 3. SOP 问题回答

### 3.1 哪些接口属于 Command，负责改写真相？

回答：

`AcceptPublication`、`RecordDeliveryFeedback`、`RequestRetry`、`MoveDeliveryToDeadLetter`、`PrepareReplay` 属于 Command API 或受控 operations command。它们会改写 `PublicationAcceptance`、`DeliveryRecord`、`FeedbackResult`、`RetryPlan`、`DeadLetterEntry`、`ReplayPreparation`、`BusAuditEntry` 或 projection 更新材料。

### 3.2 哪些接口属于 Query，只读取投影或只读视图？

回答：

`GetPublicationAcceptance`、`GetDeliveryStatus`、`ListDeliveryHistory`、`GetTransportView`、`GetFailureSummary`、`GetBusAuditTrail`、`GetBackendHealthView` 属于 Query API。它们只能读取 truth 派生视图、history、audit、projection 或 backend capability 运行状态，不得反写 bus truth。

### 3.3 哪些外部事实需要通过 Inbound Event Consumer 进入本仓？

回答：

`ConsumeCommittedOutboxFact` 消费 `L0-core` 已提交 outbox fact；`ConsumeBackendDeliverySignal` 消费后端投递结果信号；`ConsumeTimeoutSignal` 消费 timeout 信号。它们都必须携带 event id、source reference、envelope / signal reference 和幂等信息。

### 3.4 哪些已提交事实需要通过 Outbound Event 对外传播？

回答：

bus 可以传播 publication accepted / rejected、delivery state changed、feedback recorded、dead letter created、replay preparation ready、transport view updated、failure material available、backend capability changed 等已提交事实或派生只读材料。Outbound Event 不传播 payload body，也不传播后端私有响应正文。

### 3.5 哪些恢复、发布、重建、对账动作属于 Operations Job，而不是业务 command？

回答：

`RunOutboxRelay`、`RunDeliveryProgression`、`RunRetryCycle`、`RunReadOutputProjection`、`RebuildReadProjection`、`CheckBackendCapability` 属于 Operations Job。它们基于已持久化事实推进后台流程、生成只读输出或检查后端能力，不是用户直接提交业务事实的入口。

### 3.6 Command 输入骨架是否需要 `ActorContext`、`CommandMetadata`、`IdempotencyKey`？

回答：

需要。所有改写真相的 Command 必须显式接收 `ActorContext actor` 和 `CommandMetadata meta`。会被重复调用、重复投递或重复反馈影响的 Command 必须接收 `IdempotencyKey idempotency_key`，或能从输入中的 event / delivery / feedback reference 推导幂等锚点。

### 3.7 Query 输入骨架是否需要 `ActorContext`？

回答：

需要。bus 不在本步实现认证和授权，但 Query 必须接收 `ActorContext actor` 或等价查询上下文，以便详细设计继续承接审计读取、只读输出裁剪和上游安全入口注入的上下文。

### 3.8 Event Consumer 输入骨架是否需要 event id、幂等键或 envelope？

回答：

需要。Inbound Event Consumer 必须接收 `EventId event_id`、`EventSourceRef source_ref`、`IdempotencyKey idempotency_key`，并按来源携带 `CoreEventEnvelopeRef envelope_ref`、`BackendDeliverySignal signal` 或 `DeliveryTimeoutSignal signal`。本仓只引用 `L0-core` 事件契约，不重新定义 core envelope 字段全集。

---

## 4. 当前文档问题诊断

| 位置 | 当前问题 | 影响 |
|---|---|---|
| 旧 Step 7 §7.2~§7.6 | 接口表没有从 Step 6 的正式对象逐项反推 | 接口与对象承接关系弱，详细设计仍会重新判断写入结果 |
| 旧 Step 7 §7.2 | `AcceptPublicationCommand` 等输入骨架没有说明“不是领域对象” | DTO 可能被误当成 Step 6 关键对象，污染对象边界 |
| 旧 Step 7 §7.7 | 在 API / 接口骨架章节画了接口边界图 | 与书写规范冲突；API 到内部处理流应在 Step 8 展开 |
| 旧 Step 7 | 缺少 interface candidate 筛选 | application service、repository、port、trigger 容易被混成外部 API |
| 旧 Step 7 | 缺少 Step 8 处理流承接清单 | 后续处理流可能继续合并关键接口，导致思考粒度不足 |

---

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 接口来源 | 基于旧接口清单直接罗列 | 从 Step 6 领域对象、Step 5 主要组成部分和架构交互边界共同反推 | 保证接口能够承接对象和后续处理流 |
| DTO 边界 | 输入 / 输出骨架与领域对象边界不够清楚 | 明确 DTO / result / view skeleton 不是 Step 6 领域对象 | 防止把协议对象误写成领域对象 |
| 接口分类 | 有分类，但缺少候选筛选 | 增加接口候选筛选表，区分 API、event、job、port、repository、service | 防止主语串层 |
| 图示 | 在 Step 7 画接口边界图 | Step 7 不画图，只把处理流图交给 Step 8 | 对齐概要设计书写规范 |
| Step 8 承接 | 未列出哪些接口必须画独立处理流 | 增加处理流承接清单 | 防止 Step 8 再次过度合并 |

---

## 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A：保留旧接口表，只微调字段 | 改动小 | 仍然无法解释 DTO、port、service 与领域对象的边界 | 不采用 |
| 方案 B：在概要设计写完整 HTTP / JSON / proto 契约 | 协议最清楚 | 下沉到详细设计层，且会提前固定实现细节 | 不采用 |
| 方案 C：按 Command / Query / Inbound Event / Outbound Event / Job 分类，写输入输出骨架、读写性质、对象承接和边界 | 粒度适中，可直接支撑 Step 8 和详细设计 | 仍需后续补完整协议和错误码 | 采用 |

---

## 7. 结构化中间产物

### 7.1 接口层边界说明

```text
Command API
  改写 bus truth,必须经过 application use case 和 domain object 规则。

Query API
  读取 truth 派生视图、history、audit 或 projection,不得反写 truth。

Inbound Event Consumer
  消费外部已提交事实或后端信号,转换成本地 accepted / delivery / feedback / recovery 事实。

Outbound Event
  传播本仓已提交事实或派生只读材料,不得携带 payload body 或后端私有响应正文。

Operations Job
  基于已持久化事实推进后台流程、投影、恢复或对账,不得绕过 command / domain 规则。
```

边界结论：

- `AcceptPublicationCommand`、`DeliveryStatusView`、`PublicationAcceptedPayload` 等是接口 DTO / view / event payload skeleton，不是 Step 6 领域对象。
- `BusCommandApi`、`BusQueryApi`、`OutboxRelayTrigger`、`TransportBackendPort` 是入口或端口主语，不作为领域对象展开。
- application service 内部函数可以在 Step 8 处理流中点名，但本步不把它们写成外部 API。

### 7.2 接口候选筛选表

| 候选名称 | 来源 | 筛选结论 | 原因 |
|---|---|---|---|
| `AcceptPublication` | 发布材料接入 | Command API | 会创建或拒绝 `PublicationAcceptance`，并产生 audit / delivery 准备材料 |
| `RecordDeliveryFeedback` | 结果反馈 | Command API | 会写入 `FeedbackResult`、`IdempotencyAnchor`、history 和 audit |
| `RequestRetry` | 失败恢复 | Command API | 会创建或更新 `RetryPlan` |
| `MoveDeliveryToDeadLetter` | 失败恢复 | Command API | 会写入 `DeadLetterEntry` 和 `FailureMaterial` |
| `PrepareReplay` | 重放准备 | Command API | 会写入 `ReplayPreparation` |
| `GetPublicationAcceptance` | 接入查询 | Query API | 读取接入结果和拒绝原因 |
| `GetDeliveryStatus` | delivery 查询 | Query API | 读取 delivery 状态或 transport projection |
| `ListDeliveryHistory` | history 查询 | Query API | 读取 `DeliveryHistoryEntry` / audit |
| `GetTransportView` | 只读输出 | Query API | 读取 `TransportViewProjection` |
| `GetFailureSummary` | 失败摘要 | Query API | 读取 `FailureSummaryProjection` |
| `GetBusAuditTrail` | 审计查询 | Query API | 读取 `BusAuditEntry` |
| `GetBackendHealthView` | 后端能力查询 | Query API | 读取 backend capability projection / adapter status |
| `ConsumeCommittedOutboxFact` | 外部事实 | Inbound Event Consumer | 消费 `L0-core` 已提交 outbox fact |
| `ConsumeBackendDeliverySignal` | 后端信号 | Inbound Event Consumer | 消费后端 delivery result 并归一化 |
| `ConsumeTimeoutSignal` | 系统信号 | Inbound Event Consumer | 消费 timeout 信号并形成 bus 级反馈 |
| `PublicationAcceptedEvent` 等 | 已提交事实 | Outbound Event | 向下游传播 bus 事实或只读材料 |
| `RunOutboxRelay` 等 | 后台推进 | Operations Job | 扫描已持久化事实并推进工作 |
| repository / port / unit of work | 实现边界 | 留给详细设计 | 属于持久化或后端适配端口，不是外部接口 |

### 7.3 Command API 骨架表

| API | 输入骨架 | 输出骨架 | 主要处理 | 写入结果 |
|---|---|---|---|---|
| `AcceptPublication` | `AcceptPublicationCommand command`、`ActorContext actor`、`CommandMetadata meta`、`IdempotencyKey idempotency_key` | `PublicationAcceptanceResult result` | 校验发布材料引用、禁止正文边界和传递语义 | `PublicationAcceptance`、`TransportSemantic`、`BusAuditEntry`，可选 delivery schedule 材料 |
| `RecordDeliveryFeedback` | `RecordDeliveryFeedbackCommand command`、`ActorContext actor`、`CommandMetadata meta`、`IdempotencyKey idempotency_key` | `FeedbackRecordResult result` | 归一化 ack / fail / timeout / duplicate，执行幂等判断 | `FeedbackResult`、`IdempotencyAnchor`、`DeliveryHistoryEntry`、`BusAuditEntry` |
| `RequestRetry` | `RequestRetryCommand command`、`ActorContext actor`、`CommandMetadata meta` | `RetryPlanResult result` | 判断恢复允许性并创建或更新 retry plan | `RetryPlan`、`DeliveryHistoryEntry`、`BusAuditEntry` |
| `MoveDeliveryToDeadLetter` | `MoveDeliveryToDeadLetterCommand command`、`ActorContext actor`、`CommandMetadata meta` | `DeadLetterResult result` | 根据失败材料和恢复策略进入 DLQ | `DeadLetterEntry`、`FailureMaterial`、`DeliveryHistoryEntry`、`BusAuditEntry` |
| `PrepareReplay` | `PrepareReplayCommand command`、`ActorContext actor`、`CommandMetadata meta` | `ReplayPreparationResult result` | 校验 replay 前置条件、审批引用、死信材料和审计链 | `ReplayPreparation`、`BusAuditEntry` |

### 7.4 Query API 骨架表

| API | 输入骨架 | 输出骨架 | 读取来源 | 边界 |
|---|---|---|---|---|
| `GetPublicationAcceptance` | `GetPublicationAcceptanceQuery query`、`ActorContext actor` | `PublicationAcceptanceView view` | acceptance repository / audit projection | 只读接入结果，不重新触发 delivery |
| `GetDeliveryStatus` | `GetDeliveryStatusQuery query`、`ActorContext actor` | `DeliveryStatusView view` | delivery repository / transport projection | 只读 delivery 状态，不修改 lifecycle |
| `ListDeliveryHistory` | `ListDeliveryHistoryQuery query`、`ActorContext actor`、`PageRequest page` | `DeliveryHistoryPage page` | history store / audit repository | 只读历史，不覆盖当前状态 |
| `GetTransportView` | `GetTransportViewQuery query`、`ActorContext actor` | `TransportView view` | `TransportViewProjection` | 面向 SDK / consumer 的只读视图 |
| `GetFailureSummary` | `GetFailureSummaryQuery query`、`ActorContext actor` | `FailureSummaryView view` | `FailureSummaryProjection` | failure material 不是治理决策 |
| `GetBusAuditTrail` | `GetBusAuditTrailQuery query`、`ActorContext actor`、`PageRequest page` | `BusAuditTrailView view` | audit repository | 不输出 payload body 或后端私有响应正文 |
| `GetBackendHealthView` | `GetBackendHealthViewQuery query`、`ActorContext actor` | `BackendHealthView view` | backend capability projection / adapter status | 只输出能力状态，不暴露 secret |

### 7.5 Inbound Event Consumer 骨架表

| Consumer | 来源 | 输入骨架 | 本地结果 | 边界 |
|---|---|---|---|---|
| `ConsumeCommittedOutboxFact` | `L0-core` outbox | `CommittedOutboxFact fact`、`EventId event_id`、`EventSourceRef source_ref`、`CoreEventEnvelopeRef envelope_ref`、`IdempotencyKey idempotency_key` | `OutboxRelayResult result` | 只承接已提交 outbox fact，不读取 payload body |
| `ConsumeBackendDeliverySignal` | transport backend adapter | `BackendDeliverySignal signal`、`EventId event_id`、`EventSourceRef source_ref`、`BackendCapabilityRef capability_ref`、`IdempotencyKey idempotency_key` | `BackendSignalResult result` | 后端状态先归一化，再影响 delivery / feedback |
| `ConsumeTimeoutSignal` | scheduler / clock source | `DeliveryTimeoutSignal signal`、`EventId event_id`、`EventSourceRef source_ref`、`IdempotencyKey idempotency_key` | `TimeoutRecordResult result` | timeout 是 bus 级反馈，不代表业务失败正文 |

### 7.6 Outbound Event 骨架表

| Event | 产生来源 | 主要消费者 | 说明 |
|---|---|---|---|
| `PublicationAcceptedEvent` | `PublicationAcceptance.status=accepted` | delivery worker、read output、observability | 表示发布材料已被 bus 接受，不含 payload body |
| `PublicationRejectedEvent` | `PublicationAcceptance.status=rejected` | publisher、observability、operator | 表示发布材料被拒绝，只输出拒绝原因引用 |
| `DeliveryStateChangedEvent` | `DeliveryHistoryEntry` committed | read output、observability、operator | 传播 delivery 状态变化事实 |
| `FeedbackRecordedEvent` | `FeedbackResult` committed | recovery worker、read output、observability | 传播 bus 级反馈结果 |
| `DeadLetterCreatedEvent` | `DeadLetterEntry` committed | governance、operator、observability | 表示 delivery 已进入 DLQ |
| `ReplayPreparationReadyEvent` | `ReplayPreparation.status=ready` | operator、governance、replay executor | 表示 replay 前置材料已准备好，不代表 replay 已执行 |
| `TransportViewUpdatedEvent` | `TransportViewProjection` updated | SDK、consumer、observability | 只读视图更新通知 |
| `FailureMaterialAvailableEvent` | `FailureMaterial` available | governance、operator、observability | 暴露失败材料引用，不形成治理决策 |
| `BackendCapabilityChangedEvent` | backend capability check result | operator、observability | 表示后端能力视图变化，不暴露 secret |

### 7.7 Operations Job 骨架表

| Job | 输入来源 | 输出结果 | 边界 |
|---|---|---|---|
| `RunOutboxRelay` | 已提交 outbox fact cursor、`ActorContext actor`、`JobMetadata meta` | `OutboxRelayJobResult result` | 扫描并消费 core outbox，不绕过 `AcceptPublication` 规则 |
| `RunDeliveryProgression` | scheduled / retryable delivery cursor、`ActorContext actor`、`JobMetadata meta` | `DeliveryProgressionResult result` | 推进 delivery 和 attempt，不直接暴露后端私有响应 |
| `RunRetryCycle` | due retry plan cursor、`ActorContext actor`、`JobMetadata meta` | `RetryCycleResult result` | 按 `RetryPlan` 和恢复策略触发新尝试 |
| `RunReadOutputProjection` | committed bus truth / event cursor、`ActorContext actor`、`JobMetadata meta` | `ProjectionJobResult result` | 写只读投影，不反写真相 |
| `RebuildReadProjection` | rebuild request、truth snapshot cursor、`ActorContext actor`、`JobMetadata meta` | `ProjectionRebuildResult result` | 受控重建 projection，不修改 delivery / feedback truth |
| `CheckBackendCapability` | backend capability source、`ActorContext actor`、`JobMetadata meta` | `BackendCapabilityCheckResult result` | 检查能力引用和运行状态，不保存 secret |

### 7.8 Port / Repository 边界摘要

| 边界主语 | 类型 | 本步处理方式 | 详细设计承接方向 |
|---|---|---|---|
| `PublicationRepository` | persistence port | 不作为外部 API | 详细设计定义 get / save / optimistic locking |
| `DeliveryRepository` | persistence port | 不作为外部 API | 详细设计定义 delivery / attempt / history 持久化 |
| `FeedbackRepository` | persistence port | 不作为外部 API | 详细设计定义 feedback 与幂等记录读写 |
| `RecoveryRepository` | persistence port | 不作为外部 API | 详细设计定义 retry / DLQ / replay 材料读写 |
| `AuditRepository` | persistence port | 不作为外部 API | 详细设计定义 append-only audit 约束 |
| `ProjectionRepository` | persistence port | 不作为外部 API | 详细设计定义 transport view / failure summary 写入和查询 |
| `TransportBackendPort` | outbound port | 不作为 Command API | 详细设计定义后端投递抽象和结果归一化 |
| `OutboxPublisherPort` | outbound port | 不作为业务 API | 详细设计定义 outbound event 写入 / 发布边界 |
| `ClockPort` / `IdGeneratorPort` / `UnitOfWork` | technical port | 不作为 API | 详细设计定义事务、时间和 id 生成接缝 |

### 7.9 Step 8 处理流承接清单

| 接口 / Job / Consumer | 是否需要独立处理流 | 原因 |
|---|---|---|
| `AcceptPublication` | 是 | 是发布材料进入 bus truth 的主写路径 |
| `ConsumeCommittedOutboxFact` | 是 | 是 core outbox 到 bus 接入的事件消费路径 |
| `RunDeliveryProgression` | 是 | 是 delivery / attempt 推进主路径 |
| `RecordDeliveryFeedback` | 是 | 是 feedback、幂等、history 和 recovery 候选的关键写路径 |
| `ConsumeBackendDeliverySignal` | 是 | 后端信号需要归一化后才能影响 delivery / feedback |
| `ConsumeTimeoutSignal` | 是 | timeout 会形成 bus 级 feedback 和 recovery 候选 |
| `RequestRetry` | 是 | retry plan 创建和恢复允许性判断需要独立说明 |
| `RunRetryCycle` | 是 | due retry 到新 delivery attempt 的后台推进需要独立说明 |
| `MoveDeliveryToDeadLetter` | 是 | DLQ、failure material 和 audit 边界不能与 retry 混写 |
| `PrepareReplay` | 是 | replay 前置材料、审批引用和审计链需要独立说明 |
| `RunReadOutputProjection` | 是 | truth 到 projection 的派生写路径必须明确不反写真相 |
| `RebuildReadProjection` | 是 | rebuild 与增量 projection 不同，需说明受控重建边界 |
| `CheckBackendCapability` | 是 | 后端能力检查涉及 secret 隔离和 capability view 边界 |
| Query API | 可合并为通用只读处理流 | Query 不改写真相，可在 Step 8 用统一读路径说明，并列例外 |
| Outbound Event | 可合并为事实发布处理流 | 多数事件通过 outbox publisher 传播，可用统一发布路径说明来源差异 |

### 7.10 本步图示说明

本步不画 ASCII 图。

原因：

- `standards/document/概要设计书写规范.md` §4.7 明确规定 API / 接口骨架章节禁止画流程图。
- 接口到内部对象和函数的流转图应放到 Step 8 “关键处理流 / 重要函数数据流”。
- topic 拓扑、HTTP 路由、RPC 协议和事件时序都属于详细设计或协议设计内容，不在本步展开。

---

## 8. 回填草稿

正式 `projects/L0-bus/02-概要设计.md` §7 “API / 接口骨架”应从本文件摘录并整理以下内容：

- §7.1 “接口层边界说明”
- §7.2 “接口候选筛选表”
- §7.3 “Command API 骨架表”
- §7.4 “Query API 骨架表”
- §7.5 “Inbound Event Consumer 骨架表”
- §7.6 “Outbound Event 骨架表”
- §7.7 “Operations Job 骨架表”
- §7.8 “Port / Repository 边界摘要”
- §7.9 “Step 8 处理流承接清单”

不在本 Step 重复粘贴正式文档完整正文。Step 14 生成正式文档时，应按本文件摘录并补充校准来源、延伸阅读、正式文档语气和章节衔接。

---

## 9. 待确认事项

| 待确认项 | 方案 | 建议 | 原因 |
|---|---|---|---|
| 是否保留 `GetPublicationAcceptance` | A：保留；B：只通过 `GetDeliveryStatus` 间接查看 | 建议 A | 接入结果是 `PublicationAcceptance` 的正式事实，独立查询更清楚 |
| `PublicationRejectedEvent` 是否需要对外传播 | A：传播；B：只记录 audit；C：只返回 command result | 建议 A | rejected 是接入事实，传播给 publisher / observability 更利于排障 |
| Query API 是否在 Step 8 逐个画独立流 | A：逐个画；B：画通用读路径并列差异 | 建议 B | Query 不改写真相，逐个画会重复；但必须列出读取来源差异 |
| `CheckBackendCapability` 是否需要独立处理流 | A：独立画；B：放入 operations job 通用流 | 建议 A | 它涉及 backend capability 和 secret 边界，独立说明更稳 |

以上待确认项不阻塞进入 Step 8。除非后续讨论明确改变，否则后续 Step 按“建议方案”继续展开。

---

## 10. 进入下一步条件

- 已明确 Command、Query、Inbound Event Consumer、Outbound Event、Operations Job 的分类。
- 已明确接口 DTO / result / view skeleton 不是 Step 6 领域对象。
- 已明确主要接口的输入骨架、输出骨架、读写性质、对象承接和边界。
- 已显式处理 `ActorContext`、`CommandMetadata`、`IdempotencyKey`、event id、source reference 和 envelope reference。
- 已列出 Step 8 必须独立展开的处理流，避免后续再次把 retry、DLQ、replay、projection、backend capability 合并成一个粗流程。
- 已避免写 HTTP path、完整 JSON / proto schema、topic、错误码全集、鉴权实现和函数实现代码。
