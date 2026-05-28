# Step 7. API / 接口骨架

> 本版本承接 Step 6 已收敛的关键对象轮廓,将 `L0-core` 的正式入口收束为接口骨架。
> 本步只回答“哪些接口属于 Command / Query / Event / Job,它们各自的输入 / 输出骨架是什么,读写边界在哪里,哪些入口当前不纳入主线”,不展开完整协议、HTTP / RPC 细节、JSON / proto schema 或内部 service / port 实现契约。

## 1. Step 状态

- 状态: [x] 已确认
- 对应 SOP: `standards/document/概要设计讨论流程_SOP.md` Step 7
- 回填章节: `projects/L0-core/02-概要设计.md` §7 API / 接口骨架

---

## 2. 本步输入

| 输入 | 内容 | 本步使用方式 |
|---|---|---|
| Step 6 关键对象轮廓 | `ContractDefinition`、`ContractScope`、`ContractVersion`、`ContractLifecycle`、`ContractReleaseBaseline`、`ContractReleaseSnapshot`、`CompatibilityStatus`、`ContractFactRecord`、`ContractReadModel`、`ContractTraceProjection`、`ContractPackage`、`DownstreamConsumptionRef` 等对象已收稳 | 作为接口输入 / 输出骨架的对象来源 |
| Step 5 主要组成部分、职责与边界 | 契约变更承接、契约真相、兼容性门禁、快照派生、引用索引、后台校验六个业务部分和技术承载集合已收稳 | 作为接口归属到主要组成部分的依据 |
| 需求 Step 12 接口与依赖 | 能力级接口面已经收束为共享契约范围管理、跨仓契约语义表达、契约演进兼容与追溯、下游消费与派生基础、外围增强能力 | 作为接口分类和优先级依据 |
| 架构 Step 9 关键交互与通信方式 | 同步请求 / 响应、异步事实传播、后台延后承接三类边界已收稳 | 作为 Command / Query / Event / Job 的分类依据 |
| 架构 Step 10 关键技术选型 | 已确认本仓不是在线 API 服务、不是 bus 实现、不是 SDK 本体 | 作为“不写什么”的边界依据 |
| 当前对象线索 | `ContractChangeDraft`、`ContractDefinitionDraftSpec`、`ApprovedGateRef`、`LifecycleReason`、`ActorContext`、`CommandMetadata`、`IdempotencyKey`、`QueryMetadata`、`ContractChangeReceipt`、`ContractBaselineReceipt`、`ContractLifecycleReceipt`、`ContractDefinitionView`、`ContractReleaseBaselineView`、`ContractReleaseSnapshotView`、`ContractTraceView`、`CompatibilityTraceView`、`ContractPackageView`、`ContractGuideSampleView` | 作为接口骨架的候选命名 |

已确认结论:

```text
Step 7 必须独立输出接口分类说明,并按 Command / Query / Outbound Event / Operations Job 收口.
当前主线不纳入 Inbound Event Consumer;外部标准、草案、治理结论和下游反馈通过正式同步入口承接,不以事件消费者作为主路径.
写入型命令必须携带 ActorContext、CommandMetadata 和幂等信息;纯读取查询默认不带 ActorContext,仅在 trace / audit / guide 类查询中按需携带可选 ActorContext 或 QueryMetadata.
```

依赖的前序 Step:

```text
Step 5 已确认主要组成部分、职责与边界。
Step 6 已确认关键对象轮廓。
```

---

## 3. SOP 问题回答

### 3.1 哪些接口属于 Command,负责改写真相?

回答:

本仓需要显式收稳的 Command API 不是“对象方法列表”,而是面向可提交变更的正式入口。当前建议按以下五类收口:

| Command API | 主要责任 | 典型输入骨架 | 典型输出骨架 |
|---|---|---|---|
| `CreateContractDraft` | 创建共享契约草稿 | `ContractDefinitionDraftSpec spec, ActorContext actor, CommandMetadata metadata, IdempotencyKey idempotency_key` | `ContractChangeReceipt` |
| `UpdateContractDraft` | 更新草稿正文和元信息 | `ContractDefinitionId definition_id, ContractDefinitionDraftSpec spec, ActorContext actor, CommandMetadata metadata, IdempotencyKey idempotency_key` | `ContractChangeReceipt` |
| `SubmitContractForReview` | 将草稿送入评审或门禁路径 | `ContractDefinitionId definition_id, ActorContext actor, CommandMetadata metadata, IdempotencyKey idempotency_key` | `ContractReviewReceipt` |
| `PublishContractBaseline` | 在门禁通过后正式发布基线 | `ContractDefinitionId definition_id, ApprovedGateRef gate_ref, ActorContext actor, CommandMetadata metadata, IdempotencyKey idempotency_key` | `ContractBaselineReceipt` |
| `UpdateContractLifecycle` | 执行弃用、退役或 supersede 等生命周期迁移 | `ContractDefinitionId definition_id, ContractLifecycle target, LifecycleReason reason, ActorContext actor, CommandMetadata metadata, IdempotencyKey idempotency_key` | `ContractLifecycleReceipt` |

### 3.2 哪些接口属于 Query,只读取投影或只读视图?

回答:

Query API 只读取权威真相、只读视图、追溯投影或派生包视图,不改写真相。纯读取查询默认不需要 `ActorContext`;只有审计、追溯、接入说明一类接口才按需携带 `ActorContext` 作为元信息,不作为鉴权机制。

| Query API | 主要责任 | 典型输入骨架 | 典型输出骨架 | 读取来源 |
|---|---|---|---|---|
| `GetContractDefinition` | 获取单个契约定义详情 | `ContractDefinitionId definition_id, QueryMetadata metadata` | `ContractDefinitionView` | `ContractReadModel` / `ContractDefinition` |
| `ListContractDefinitions` | 列出契约定义 | `ContractDefinitionQuery query, QueryMetadata metadata` | `ContractDefinitionListView` | `ContractReadModel` |
| `GetContractReleaseBaseline` | 获取发布基线 | `ContractReleaseBaselineId baseline_id, QueryMetadata metadata` | `ContractReleaseBaselineView` | `ContractReleaseBaseline` |
| `GetContractReleaseSnapshot` | 获取发布快照 | `ContractReleaseSnapshotId snapshot_id, QueryMetadata metadata` | `ContractReleaseSnapshotView` | `ContractReleaseSnapshot` |
| `TraceContractEvolution` | 查看契约演进轨迹 | `ContractTraceQuery query, QueryMetadata metadata, ActorContext actor(可选)` | `ContractTraceView` | `ContractTraceProjection` / `ContractFactRecord` |
| `GetCompatibilityTrace` | 查看兼容性追溯 | `ContractDefinitionId definition_id, QueryMetadata metadata, ActorContext actor(可选)` | `CompatibilityTraceView` | `CompatibilityTraceIndex` |
| `GetContractPackage` | 获取面向消费域的契约包 | `ContractDomain consumer_domain, QueryMetadata metadata` | `ContractPackageView` | `IdentityContractPackage` / 其他 `ContractPackage` |
| `GetContractGuideSample` | 获取接入说明与示例 | `ContractDomain consumer_domain, QueryMetadata metadata, ActorContext actor(可选)` | `ContractGuideSampleView` | `ContractPackage` / `ExternalReference` |

### 3.3 哪些外部事实需要通过 Inbound Event Consumer 进入本仓?

回答:

当前主线不纳入必须存在的 Inbound Event Consumer。

原因:

- 外部标准、草案、治理结论和下游反馈已经被架构步骤收束为正式同步入口或正式引用边界,不需要再额外伪装成事件消费链路。
- 本仓的关键交互重点是“谁提供契约真相、谁消费契约真相”,不是“谁在运行时投递事件”。
- 若未来真的要引入外部异步事实输入,必须先回到 Step 1 / Step 9 重新确认边界,不能直接把消费者塞进接口章。

### 3.4 哪些已提交事实需要通过 Outbound Event 对外传播?

回答:

`L0-core` 需要把已经提交、已经成立、已经可以被下游感知的事实作为 Outbound Event 输出,但不承担 bus 投递实现。建议按以下几类收口:

| Outbound Event | 产生来源 | 主要消费者 | 说明 |
|---|---|---|---|
| `ContractDraftChanged` | `CreateContractDraft` / `UpdateContractDraft` | `L0-bus`、追溯投影刷新者、下游契约读面 | 表达草稿状态或内容已发生正式变化 |
| `ContractReviewSubmitted` | `SubmitContractForReview` | `L0-bus`、门禁 / 审查协作方 | 表达草稿已进入评审或门禁路径 |
| `ContractBaselinePublished` | `PublishContractBaseline` | `L0-bus`、下游共享契约消费者、只读快照刷新者 | 表达某版契约已正式收口 |
| `ContractLifecycleChanged` | `UpdateContractLifecycle` | `L0-bus`、追溯 / 审计消费者 | 表达弃用、退役或 supersede 已成立 |
| `ContractCompatibilityStatusChanged` | `ValidateContractChangeJob` / 发布门禁结果 | `L0-bus`、审查视图、追溯视图 | 表达兼容性结论已经变化 |
| `ContractSnapshotReady` | `DeriveReleaseSnapshotJob` | `L0-bus`、下游快照消费者 | 表达发布快照可供只读消费 |
| `ContractFactPublished` | `PublishContractFactJob` | `L0-bus`、审计和事实消费边界 | 表达契约变化可感知事实已输出 |

### 3.5 哪些恢复、发布、重建、对账动作属于 Operations Job,而不是业务 command?

回答:

这些动作不应伪装成业务 command,而应作为基于已持久化事实的 Operations Job 独立存在。

| Job | 输入来源 | 输出结果 | 边界 |
|---|---|---|---|
| `ValidateContractChangeJob` | `ContractChangeDraft`、`ContractDefinition`、`CompatibilityStatus` | `ValidationReport`、`CompatibilityStatus` | 只做校验和门禁辅助,不直接发布真相 |
| `DeriveReleaseSnapshotJob` | `ContractReleaseBaseline` | `ContractReleaseSnapshot`、`DownstreamConsumptionRef` | 只做只读快照派生,不反写真相 |
| `RebuildContractIndexJob` | `ContractDefinition`、`ContractTraceProjection`、`CompatibilityTraceIndex` | `ContractReadModel`、`ContractTraceProjection` | 只做索引重建,不改写真相 |
| `RecalculateFingerprintJob` | `ContractDefinition` | `ContractFingerprint`、`ContractEvolutionRecord` | 只做指纹复算和追溯辅助 |
| `PublishContractFactJob` | `ContractFactRecord`、Outbox 记录 | `FactOutboxEvent`、delivery state | 只负责事实输出,不承担 bus 实现 |

### 3.6 Command 输入骨架是否需要 `ActorContext`、`CommandMetadata`、`IdempotencyKey`?

回答:

需要。

理由:

- `ActorContext` 记录谁发起了变更,用于追溯和审计。
- `CommandMetadata` 提供请求级别的元信息,例如 request id、trace id、source hint。
- `IdempotencyKey` 保护提交、发布、生命周期迁移等写入口在重试时不重复生效。

### 3.7 Query 输入骨架是否需要 `ActorContext`?

回答:

默认不需要。

理由:

- 纯读取接口是只读视图入口,不应被写入口语义污染。
- 只有 trace / audit / guide 一类查询需要在日志或输出中保留调用者线索时,才可携带 `ActorContext` 作为可选元信息。

### 3.8 Event Consumer 输入骨架是否需要 event id、幂等键或 envelope?

回答:

当前主线不纳入 Inbound Event Consumer,因此本步不收 event consumer 输入骨架。
若未来确实要接入异步外部事实输入,则必须先补 `event id`、幂等键、envelope 和来源边界,再重新进入接口章。

---

## 4. 当前文档问题诊断

| 位置 | 当前问题 | 影响 |
|---|---|---|
| 旧版 Step 7 缺位 | 原 `02` 仅写到了总述和部分对象,没有把 Command / Query / Event / Job 按正式类别收口 | 详细设计会重新发明接口主语 |
| 旧版输出 | 容易把 service / port / job 混写进接口章 | 会把接口骨架写成实现分层清单 |
| 旧版交互口径 | 外部事实输入、同步读写边界、异步事实传播边界不清 | 容易把 bus、事件目录或 CI 任务误写成接口本体 |
| 旧版读写边界 | 查询、写入和后台承接混在一起 | 详细设计阶段难以继续按类别展开 |
| 旧版命名 | API 名、Query 名、Job 名未先固定 | 后续对象、处理流和状态机会反复改名 |

---

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 接口分类 | 混写在 service / 交互说明 / 任务脚本中 | Command / Query / Outbound Event / Operations Job 四类收口 | 保证概要设计继续可下钻 |
| 写入口语义 | 只说“能变更” | 明确写入口需携带 `ActorContext`、`CommandMetadata`、`IdempotencyKey` | 让详细设计能直接进入命令契约 |
| 读入口语义 | 与写入口混用 | 纯读默认不带 `ActorContext`, trace / guide 类查询按需带可选 `ActorContext` | 保持读写边界清晰 |
| 事实传播 | 容易写成 bus 实现 | 明确为 Outbound Event, 只表达可感知事实 | 保护 `L0-core` 与 `L0-bus` 边界 |
| 后台处理 | 容易写成同步接口内部步骤 | 作为 Operations Job 独立收口 | 避免伪同步完成 |
| Inbound Event Consumer | 容易被误塞进接口章 | 当前不纳入主线,需要时再单独评估 | 与架构边界一致 |

---

## 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A: 按 service / port / job 混写接口 | 贴近实现直觉 | 会让概要设计退化成实现草图 | 不采用 |
| 方案 B: 按 Command / Query / Event / Job 四类接口收口 | 边界清晰,便于详细设计继续展开协议和错误码 | 需要提前固定骨架命名 | 采用 |
| 方案 C: 增加 Inbound Event Consumer 主线 | 看起来完整 | 与当前架构边界不符,容易误把外部输入写成运行时消费 | 不采用 |
| 方案 D: 所有 Query 都强制携带 `ActorContext` | 容易统一 | 会把只读接口写成带身份语义的读入口 | 不采用;仅在审计 / 追溯型查询中按需携带 |

---

## 7. 结构化中间产物

### 7.1 接口分类说明

```text
Command API
  改写真相,必须显式调用,并携带变更人和幂等信息

Query API
  读取投影或只读视图,不得改写真相

Inbound Event Consumer
  当前主线不纳入;外部标准、草案和治理结论走正式同步入口,不走事件消费者主路径

Outbound Event
  传播已提交事实,不承担 bus 投递实现

Operations Job
  基于已持久化事实做校验、派生、重建、复算和事实输出
```

### 7.2 Command API 骨架表

| API | 输入骨架 | 输出骨架 | 主要处理 | 写入结果 |
|---|---|---|---|---|
| `CreateContractDraft` | `ContractDefinitionDraftSpec spec, ActorContext actor, CommandMetadata metadata, IdempotencyKey idempotency_key` | `ContractChangeReceipt` | 创建草稿,初始化生命周期锚点,记录演进起点 | `ContractDefinition`、`ContractEvolutionRecord` |
| `UpdateContractDraft` | `ContractDefinitionId definition_id, ContractDefinitionDraftSpec spec, ActorContext actor, CommandMetadata metadata, IdempotencyKey idempotency_key` | `ContractChangeReceipt` | 更新草稿正文和元信息,保留演进轨迹 | `ContractDefinition`、`ContractEvolutionRecord` |
| `SubmitContractForReview` | `ContractDefinitionId definition_id, ActorContext actor, CommandMetadata metadata, IdempotencyKey idempotency_key` | `ContractReviewReceipt` | 将草稿送入评审或门禁路径 | `ContractLifecycle`、`ContractEvolutionRecord` |
| `PublishContractBaseline` | `ContractDefinitionId definition_id, ApprovedGateRef gate_ref, ActorContext actor, CommandMetadata metadata, IdempotencyKey idempotency_key` | `ContractBaselineReceipt` | 在门禁通过后正式收口并安排快照派生 | `ContractReleaseBaseline`、`CompatibilityStatus` |
| `UpdateContractLifecycle` | `ContractDefinitionId definition_id, ContractLifecycle target, LifecycleReason reason, ActorContext actor, CommandMetadata metadata, IdempotencyKey idempotency_key` | `ContractLifecycleReceipt` | 执行弃用、退役或 supersede 等生命周期迁移 | `ContractLifecycle`、`ContractEvolutionRecord` |

### 7.3 Query API 骨架表

| API | 输入骨架 | 输出骨架 | 读取来源 | 边界 |
|---|---|---|---|---|
| `GetContractDefinition` | `ContractDefinitionId definition_id, QueryMetadata metadata` | `ContractDefinitionView` | `ContractReadModel` / `ContractDefinition` | 只读,不改写真相 |
| `ListContractDefinitions` | `ContractDefinitionQuery query, QueryMetadata metadata` | `ContractDefinitionListView` | `ContractReadModel` | 只读列表查询 |
| `GetContractReleaseBaseline` | `ContractReleaseBaselineId baseline_id, QueryMetadata metadata` | `ContractReleaseBaselineView` | `ContractReleaseBaseline` | 只读基线查询 |
| `GetContractReleaseSnapshot` | `ContractReleaseSnapshotId snapshot_id, QueryMetadata metadata` | `ContractReleaseSnapshotView` | `ContractReleaseSnapshot` | 只读快照查询 |
| `TraceContractEvolution` | `ContractTraceQuery query, QueryMetadata metadata, ActorContext actor(可选)` | `ContractTraceView` | `ContractTraceProjection` / `ContractFactRecord` | 审计 / 追溯查询 |
| `GetCompatibilityTrace` | `ContractDefinitionId definition_id, QueryMetadata metadata, ActorContext actor(可选)` | `CompatibilityTraceView` | `CompatibilityTraceIndex` | 兼容性追溯查询 |
| `GetContractPackage` | `ContractDomain consumer_domain, QueryMetadata metadata` | `ContractPackageView` | `IdentityContractPackage` / 其他 `ContractPackage` | 只读包查询 |
| `GetContractGuideSample` | `ContractDomain consumer_domain, QueryMetadata metadata, ActorContext actor(可选)` | `ContractGuideSampleView` | `ContractPackage` / `ExternalReference` | 接入说明和示例查询 |

### 7.4 Inbound Event Consumer 骨架表

当前主线不纳入必须存在的 Inbound Event Consumer,因此本步不生成骨架表。

关键说明:

- 外部标准、草案、治理结论和下游反馈通过正式同步入口承接,不以事件消费链路作为主路径。
- 如果未来需要引入外部异步事实输入,必须先回到 Step 1 / Step 9 重新确认边界,再决定是否新增 consumer。

### 7.5 Outbound Event 骨架表

| Event | 产生来源 | 主要消费者 | 说明 |
|---|---|---|---|
| `ContractDraftChanged` | `CreateContractDraft` / `UpdateContractDraft` | `L0-bus`、追溯投影刷新者、下游契约读面 | 表达草稿状态或内容已经正式变化 |
| `ContractReviewSubmitted` | `SubmitContractForReview` | `L0-bus`、门禁 / 审查协作方 | 表达草稿已经进入评审路径 |
| `ContractBaselinePublished` | `PublishContractBaseline` | `L0-bus`、下游共享契约消费者、只读快照刷新者 | 表达某版契约已经正式收口 |
| `ContractLifecycleChanged` | `UpdateContractLifecycle` | `L0-bus`、追溯 / 审计消费者 | 表达弃用、退役或 supersede 已成立 |
| `ContractCompatibilityStatusChanged` | `ValidateContractChangeJob` / 发布门禁结果 | `L0-bus`、审查视图、追溯视图 | 表达兼容性结论已经变化 |
| `ContractSnapshotReady` | `DeriveReleaseSnapshotJob` | `L0-bus`、下游快照消费者 | 表达发布快照可供只读消费 |
| `ContractFactPublished` | `PublishContractFactJob` | `L0-bus`、审计和事实消费边界 | 表达契约变化可感知事实已经输出 |

### 7.6 Operations Job 骨架表

| Job | 输入来源 | 输出结果 | 边界 |
|---|---|---|---|
| `ValidateContractChangeJob` | `ContractChangeDraft`、`ContractDefinition`、`CompatibilityStatus` | `ValidationReport`、`CompatibilityStatus` | 只做校验和门禁辅助,不直接发布真相 |
| `DeriveReleaseSnapshotJob` | `ContractReleaseBaseline` | `ContractReleaseSnapshot`、`DownstreamConsumptionRef` | 只做只读快照派生,不反写真相 |
| `RebuildContractIndexJob` | `ContractDefinition`、`ContractTraceProjection`、`CompatibilityTraceIndex` | `ContractReadModel`、`ContractTraceProjection` | 只做索引重建,不改写真相 |
| `RecalculateFingerprintJob` | `ContractDefinition` | `ContractFingerprint`、`ContractEvolutionRecord` | 只做指纹复算和追溯辅助 |
| `PublishContractFactJob` | `ContractFactRecord`、Outbox 记录 | `FactOutboxEvent`、delivery state | 只负责事实输出,不承担 bus 实现 |

### 7.7 不展开的内部支撑主语

本步只固定正式接口骨架,不展开内部 service / port / repository / job 的完整实现契约。下列主语留给后续详细设计继续承接:

```text
ContractChangeService
ContractReleaseService
ContractCompatibilityService
ContractSnapshotService
ContractTraceService
ContractFactService
ContractOperationsService
ContractDefinitionRepository
ContractBaselineRepository
SnapshotRepository
ReferenceRepository
AuditLogPort
OutboxPort
GateDecisionPort
ReferenceResolverPort
BlobRefPort
EventPublisherPort
ClockPort
IdGeneratorPort
UnitOfWork
```

---

## 8. 回填草稿

可直接回填到 `02-概要设计.md` 的起草结构:

```md
## 7. API / 接口骨架

> 校准来源:
> - `design-calibration/02_hld_step_07_api_interface_skeleton.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“接口分类说明”“Command API 骨架表”“Query API 骨架表”“Outbound Event 骨架表”和“Operations Job 骨架表”小节,了解本章接口骨架如何从能力级需求和架构交互边界收敛而来。

### 7.1 接口分类说明

```text
Command API
  改写真相,必须显式调用,并携带变更人和幂等信息

Query API
  读取投影或只读视图,不得改写真相

Inbound Event Consumer
  当前主线不纳入;外部标准、草案和治理结论走正式同步入口,不走事件消费者主路径

Outbound Event
  传播已提交事实,不承担 bus 投递实现

Operations Job
  基于已持久化事实做校验、派生、重建、复算和事实输出
```

### 7.2 Command API 骨架表

| API | 输入骨架 | 输出骨架 | 主要处理 | 写入结果 |
|---|---|---|---|---|
| `CreateContractDraft` | `ContractDefinitionDraftSpec spec, ActorContext actor, CommandMetadata metadata, IdempotencyKey idempotency_key` | `ContractChangeReceipt` | 创建草稿,初始化生命周期锚点,记录演进起点 | `ContractDefinition`、`ContractEvolutionRecord` |
| `UpdateContractDraft` | `ContractDefinitionId definition_id, ContractDefinitionDraftSpec spec, ActorContext actor, CommandMetadata metadata, IdempotencyKey idempotency_key` | `ContractChangeReceipt` | 更新草稿正文和元信息,保留演进轨迹 | `ContractDefinition`、`ContractEvolutionRecord` |
| `SubmitContractForReview` | `ContractDefinitionId definition_id, ActorContext actor, CommandMetadata metadata, IdempotencyKey idempotency_key` | `ContractReviewReceipt` | 将草稿送入评审或门禁路径 | `ContractLifecycle`、`ContractEvolutionRecord` |
| `PublishContractBaseline` | `ContractDefinitionId definition_id, ApprovedGateRef gate_ref, ActorContext actor, CommandMetadata metadata, IdempotencyKey idempotency_key` | `ContractBaselineReceipt` | 在门禁通过后正式收口并安排快照派生 | `ContractReleaseBaseline`、`CompatibilityStatus` |
| `UpdateContractLifecycle` | `ContractDefinitionId definition_id, ContractLifecycle target, LifecycleReason reason, ActorContext actor, CommandMetadata metadata, IdempotencyKey idempotency_key` | `ContractLifecycleReceipt` | 执行弃用、退役或 supersede 等生命周期迁移 | `ContractLifecycle`、`ContractEvolutionRecord` |

### 7.3 Query API 骨架表

| API | 输入骨架 | 输出骨架 | 读取来源 | 边界 |
|---|---|---|---|---|
| `GetContractDefinition` | `ContractDefinitionId definition_id, QueryMetadata metadata` | `ContractDefinitionView` | `ContractReadModel` / `ContractDefinition` | 只读,不改写真相 |
| `ListContractDefinitions` | `ContractDefinitionQuery query, QueryMetadata metadata` | `ContractDefinitionListView` | `ContractReadModel` | 只读列表查询 |
| `GetContractReleaseBaseline` | `ContractReleaseBaselineId baseline_id, QueryMetadata metadata` | `ContractReleaseBaselineView` | `ContractReleaseBaseline` | 只读基线查询 |
| `GetContractReleaseSnapshot` | `ContractReleaseSnapshotId snapshot_id, QueryMetadata metadata` | `ContractReleaseSnapshotView` | `ContractReleaseSnapshot` | 只读快照查询 |
| `TraceContractEvolution` | `ContractTraceQuery query, QueryMetadata metadata, ActorContext actor(可选)` | `ContractTraceView` | `ContractTraceProjection` / `ContractFactRecord` | 审计 / 追溯查询 |
| `GetCompatibilityTrace` | `ContractDefinitionId definition_id, QueryMetadata metadata, ActorContext actor(可选)` | `CompatibilityTraceView` | `CompatibilityTraceIndex` | 兼容性追溯查询 |
| `GetContractPackage` | `ContractDomain consumer_domain, QueryMetadata metadata` | `ContractPackageView` | `IdentityContractPackage` / 其他 `ContractPackage` | 只读包查询 |
| `GetContractGuideSample` | `ContractDomain consumer_domain, QueryMetadata metadata, ActorContext actor(可选)` | `ContractGuideSampleView` | `ContractPackage` / `ExternalReference` | 接入说明和示例查询 |

### 7.4 Outbound Event 骨架表

| Event | 产生来源 | 主要消费者 | 说明 |
|---|---|---|---|
| `ContractDraftChanged` | `CreateContractDraft` / `UpdateContractDraft` | `L0-bus`、追溯投影刷新者、下游契约读面 | 表达草稿状态或内容已经正式变化 |
| `ContractReviewSubmitted` | `SubmitContractForReview` | `L0-bus`、门禁 / 审查协作方 | 表达草稿已经进入评审路径 |
| `ContractBaselinePublished` | `PublishContractBaseline` | `L0-bus`、下游共享契约消费者、只读快照刷新者 | 表达某版契约已经正式收口 |
| `ContractLifecycleChanged` | `UpdateContractLifecycle` | `L0-bus`、追溯 / 审计消费者 | 表达弃用、退役或 supersede 已成立 |
| `ContractCompatibilityStatusChanged` | `ValidateContractChangeJob` / 发布门禁结果 | `L0-bus`、审查视图、追溯视图 | 表达兼容性结论已经变化 |
| `ContractSnapshotReady` | `DeriveReleaseSnapshotJob` | `L0-bus`、下游快照消费者 | 表达发布快照可供只读消费 |
| `ContractFactPublished` | `PublishContractFactJob` | `L0-bus`、审计和事实消费边界 | 表达契约变化可感知事实已经输出 |

### 7.5 Operations Job 骨架表

| Job | 输入来源 | 输出结果 | 边界 |
|---|---|---|---|
| `ValidateContractChangeJob` | `ContractChangeDraft`、`ContractDefinition`、`CompatibilityStatus` | `ValidationReport`、`CompatibilityStatus` | 只做校验和门禁辅助,不直接发布真相 |
| `DeriveReleaseSnapshotJob` | `ContractReleaseBaseline` | `ContractReleaseSnapshot`、`DownstreamConsumptionRef` | 只做只读快照派生,不反写真相 |
| `RebuildContractIndexJob` | `ContractDefinition`、`ContractTraceProjection`、`CompatibilityTraceIndex` | `ContractReadModel`、`ContractTraceProjection` | 只做索引重建,不改写真相 |
| `RecalculateFingerprintJob` | `ContractDefinition` | `ContractFingerprint`、`ContractEvolutionRecord` | 只做指纹复算和追溯辅助 |
| `PublishContractFactJob` | `ContractFactRecord`、Outbox 记录 | `FactOutboxEvent`、delivery state | 只负责事实输出,不承担 bus 实现 |
```

### 9. 待确认事项

#### 9.1 待确认项处理建议

| 待确认项 | 备选方案 | 推荐方案 | 推荐理由 | 当前状态 |
|---|---|---|---|---|
| Query 输入是否默认带 `ActorContext` | A. 所有 Query 都带; B. 纯读取不带,trace / audit / guide 类按需带可选 `ActorContext`; C. 所有 Query 都不带 | B | 既保持纯读简洁,又保留审计和追溯的元信息入口 | 已确认采用 B |
| 是否保留 Inbound Event Consumer 主线 | A. 不保留; B. 先留空壳,以后再补; C. 直接新增异步输入 consumer | A | 当前架构边界要求外部输入走正式同步入口,不需要事件消费者主路径 | 已确认采用 A |
| Command 是否统一带 `IdempotencyKey` | A. 所有写命令统一携带; B. 只有发布类命令携带; C. 完全不带 | A | 草稿、发布和生命周期迁移都可能重试,统一幂等最稳妥 | 已确认采用 A |

#### 9.2 本 Step 未确认事项

无。

### 10. 进入下一步条件

- 已明确本仓正式接口按 Command / Query / Outbound Event / Operations Job 如何分类。
- 已明确写入口和读入口的输入骨架差异,以及纯读查询和追溯查询的元信息差异。
- 已明确当前主线不纳入 Inbound Event Consumer。
- 可以进入 Step 8 关键处理流 / 重要函数数据流。
```

---

## 9. 待确认事项

#### 9.1 待确认项处理建议

| 待确认项 | 备选方案 | 推荐方案 | 推荐理由 | 当前状态 |
|---|---|---|---|---|
| Query 输入是否默认带 `ActorContext` | A. 所有 Query 都带; B. 纯读取不带,trace / audit / guide 类按需带可选 `ActorContext`; C. 所有 Query 都不带 | B | 既保持纯读简洁,又保留审计和追溯的元信息入口 | 已确认采用 B |
| 是否保留 Inbound Event Consumer 主线 | A. 不保留; B. 先留空壳,以后再补; C. 直接新增异步输入 consumer | A | 当前架构边界要求外部输入走正式同步入口,不需要事件消费者主路径 | 已确认采用 A |
| Command 是否统一带 `IdempotencyKey` | A. 所有写命令统一携带; B. 只有发布类命令携带; C. 完全不带 | A | 草稿、发布和生命周期迁移都可能重试,统一幂等最稳妥 | 已确认采用 A |

#### 9.2 本 Step 未确认事项

无。

### 10. 进入下一步条件

- 已明确本仓正式接口按 Command / Query / Outbound Event / Operations Job 如何分类。
- 已明确写入口和读入口的输入骨架差异,以及纯读查询和追溯查询的元信息差异。
- 已明确当前主线不纳入 Inbound Event Consumer。
- 可以进入 Step 8 关键处理流 / 重要函数数据流。
