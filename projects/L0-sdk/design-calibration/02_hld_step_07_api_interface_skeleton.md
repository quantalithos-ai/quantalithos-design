## Step 7. API / 接口骨架

### 1. Step 状态

- 状态：[x] 已确认
- 对应 SOP：`standards/document/概要设计讨论流程_SOP.md` Step 7
- 回填章节：`projects/L0-sdk/02-概要设计.md` §7 API / 接口骨架

### 2. 本步输入

- Step 6 已收敛的关键对象轮廓：
  - `projects/L0-sdk/design-calibration/02_hld_step_06_key_objects.md` §7.1 ~ §7.24
- Step 5 已收敛的主要组成部分、职责与边界：
  - `projects/L0-sdk/design-calibration/02_hld_step_05_components_boundary.md` §7.1 ~ §7.13
- 架构设计已收稳的交互方式、依赖方向和横切边界：
  - `projects/L0-sdk/01-架构设计.md` §8 / §9 / §10 / §13
- 需求文档已收稳的对外能力接口：
  - `projects/L0-sdk/00-需求文档.md` §12

### 3. SOP 问题回答

1. 哪些接口属于 Command，负责改写真相？

   回答：`UpdateSdkSemanticBaseline`、`RefreshDerivedBindingView`、`InvokeServiceCapability`、`PublishBusEvent`、`RecordCompatibilityDecision`、`DeprecateSdkApi` 属于 Command API。其中 `UpdateSdkSemanticBaseline`、`RefreshDerivedBindingView`、`RecordCompatibilityDecision`、`DeprecateSdkApi` 改写 SDK 本地 truth 或状态；`InvokeServiceCapability` 和 `PublishBusEvent` 是 runtime client command,通过 formal API 或 `L0-bus` 边界改写外部服务或 bus truth,SDK 不拥有这些业务事实。

2. 哪些接口属于 Query，只读取投影或只读视图？

   回答：`GetSdkCapabilitySummary`、`GetUpstreamVersionRefs`、`GetSnapshotFreshness`、`GetServiceClientView`、`GetEventClientView`、`ReadServiceCapability`、`OpenEventSubscription`、`GetPackageCandidateStatus`、`GetVerificationEvidence`、`GetCompatibilityDecision`、`ListDeprecatedApis`、`GetMigrationGuideRef` 属于 Query API。它们只读取 SDK projection、view、reference、evidence 或通过 formal API / bus subscription 读取外部只读结果,不得改写 SDK truth。

3. 哪些外部事实需要通过 Inbound Event Consumer 进入本仓？

   回答：SDK 不作为独立线上服务常驻消费事件,但维护与验证流程需要接收上游版本变化和验证运行结果。`ConsumeCoreContractChanged`、`ConsumeBusSemanticChanged`、`ConsumeFormalApiChanged`、`ConsumeValidationRunFinished` 属于 Inbound Event Consumer 骨架。它们必须携带 event id、source ref、envelope ref 或 run ref、幂等键,并只转化为 freshness、candidate、evidence 或 compatibility 状态。

4. 哪些已提交事实需要通过 Outbound Event 对外传播？

   回答：SDK 可传播 `SdkSemanticBaselineChangedEvent`、`SdkSnapshotFreshnessChangedEvent`、`PackageCandidateGeneratedEvent`、`VerificationEvidenceRecordedEvent`、`CompatibilityDecisionRecordedEvent`、`DeprecatedApiRecordedEvent`。这些事件用于 automation、review、reports 或下游通知,不携带业务正文、请求响应正文、事件 payload 或凭据正文。

5. 哪些恢复、发布、重建、对账动作属于 Operations Job，而不是业务 command？

   回答：`CheckUpstreamFreshness`、`GeneratePackageCandidate`、`BuildLanguagePackages`、`RunCrossLanguageSmoke`、`ValidateDocsExamples`、`CheckCompatibility`、`VerifyBoundaryPolicies`、`RebuildSdkProjections` 属于 Operations Job。它们基于已持久化事实、上游引用或本地 candidate 执行验证、构建、对账和投影重建,不是调用方直接提交业务事实的入口。

6. Command 输入骨架是否需要 `ActorContext`、`CommandMetadata`、`IdempotencyKey`？

   回答：会改写 SDK 本地 truth 的 Command 必须接收 `ActorContext actor`、`CommandMetadata meta` 和 `IdempotencyKey idempotency_key`。runtime client command 必须接收 `ClientCallContext context` 和 `CommandMetadata meta`;如果所代理的 formal API 或 bus operation 支持幂等,必须显式接收或派生 `IdempotencyKey idempotency_key`。SDK 只携带 actor / context,不执行认证、授权或治理裁决。

7. Query 输入骨架是否需要 `ActorContext`？

   回答：读取 SDK 本地能力、版本、证据和兼容信息的 Query 需要 `ActorContext actor` 或等价 `QueryContext context`,用于审计、裁剪和上游安全入口注入。runtime read / subscription query 使用 `ClientCallContext context`,SDK 不执行鉴权,只传递上下文和 trace。

8. Event Consumer 输入骨架是否需要 event id、幂等键或 envelope？

   回答：需要。所有 Inbound Event Consumer 必须显式包含 `EventId event_id`、`EventSourceRef source_ref`、`IdempotencyKey idempotency_key`,并按来源携带 `CoreContractChangeEnvelopeRef envelope_ref`、`BusSemanticChangeEnvelopeRef envelope_ref`、`FormalApiChangeEnvelopeRef envelope_ref` 或 `ValidationRunRef run_ref`。

### 4. 当前文档问题诊断

| 位置 | 当前问题 | 影响 |
|---|---|---|
| 旧 `02-概要设计.md` | 以 binding、wrapper、docs、release 旧主题罗列接口 | 不能承接新版对象、candidate、compatibility 和横切默认主线 |
| 旧接口表达 | runtime client call、维护 command、operations job 混在一起 | 详细设计无法判断哪些改写 SDK truth,哪些只代理外部 formal API |
| 旧边界表达 | 没有说明 SDK 不执行 auth / governance | 容易把 `ActorContext` 误解为 SDK 自己做身份校验 |
| 旧事件表达 | event client 与 bus runtime / event consumer 边界不清 | 可能把 SDK 写成 `L0-bus` runtime 的替代实现 |
| 旧验证表达 | package candidate、smoke、docs validation、evidence 没有正式接口骨架 | 后续实施计划难以形成验证入口和证据链 |

### 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 接口来源 | 从旧 SDK wrapper / binding 主题抽取 | 从 Step 6 关键对象和 §12 对外能力接口反推 | 保证接口能承接对象、流程和状态机 |
| Command 分类 | 没区分本地 truth command 和 runtime client command | 明确 SDK 本地 command 与 formal API / bus 代理 command 的写入归属 | 防止 SDK 吸收服务端业务事实 |
| Query 分类 | 只读能力、文档、证据和运行期 read 混合 | 按本地 projection / view 和外部 read boundary 写清读取来源 | 防止 query 反写真相 |
| Event 分类 | 事件封装容易被理解成 bus runtime | 入站只接收上游变化和验证结果,出站只传播 SDK 已提交维护事实 | 保护 `L0-bus` truth |
| Job 分类 | package / smoke / docs / compatibility 不成体系 | 作为 Operations Job 统一收稳 | 让 Step 8 能逐条展开处理流 |

### 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A：只列 public SDK client API | 更贴近调用方体验 | 会遗漏维护 command、candidate、evidence 和 compatibility,无法支撑详细设计 |
| 方案 B：把 application service、port、repository 全部写成接口 | 看起来完整 | 会把内部代码接缝和外部 API 混在一起,也会提前进入详细设计 |
| 方案 C：按 Command / Query / Inbound Event / Outbound Event / Operations Job 分类,并单独摘要 port / repository 边界 | 粒度符合概要设计,能区分本地 truth、外部 formal API、bus 语义和验证任务 | 需要在 Step 8 继续补关键处理流 | 采用 |

### 7. 结构化中间产物

#### 7.1 接口层边界说明

```text
Command API
  改写 SDK 本地 truth,或通过 formal API / L0-bus 边界触发外部事实变化。

Query API
  读取 SDK projection / view / evidence / reference,或通过 formal API / bus subscription 读取外部只读结果。

Inbound Event Consumer
  消费上游契约变化、bus 语义变化、formal API 变化或验证运行结果,转成本地 freshness / evidence / compatibility 状态。

Outbound Event
  传播 SDK 已提交维护事实或验证事实,不传播业务正文、请求响应正文、事件 payload 或凭据正文。

Operations Job
  基于已持久化事实、上游引用或 candidate 执行构建、验证、对账、投影重建和兼容检查。
```

边界结论：

- `UpdateSdkSemanticBaselineCommand`、`ServiceCapabilityCall`、`PublishBusEventCommand`、`CandidateJobResult`、`SdkCapabilitySummaryView` 等是接口 DTO / result / view skeleton,不是 Step 6 领域对象。
- `SdkClientEntry`、`ServiceClientEntry`、`EventClientEntry`、`CapabilityQueryEntry`、`GenerateCandidateTrigger`、`RunSmokeTrigger` 是入口或触发主语,不作为 Step 6 领域对象展开。
- `CoreContractSourcePort`、`BusSemanticSourcePort`、`FormalApiBoundaryPort`、repository、runner 和 generator 是详细设计继续展开的端口 / adapter 接缝,不是本步外部 API。
- SDK 传递 `ActorContext`、`ClientCallContext`、trace 和 metadata,但不执行身份认证、权限裁决或治理审批。

#### 7.2 接口候选筛选表

| 候选名称 | 来源 | 筛选结论 | 原因 |
|---|---|---|---|
| `UpdateSdkSemanticBaseline` | 官方客户端语义核心 | Command API | 会改写 `SdkSemanticBaseline` 和 `ClientCapabilityModel` |
| `RefreshDerivedBindingView` | 上游契约消费与派生视图 | Command API | 会改写 `DerivedBindingView`、`LanguageBindingView` 和 `SnapshotFreshnessState` |
| `InvokeServiceCapability` | 平台能力访问与正式边界适配 | Command API | 通过 formal API / fake boundary 调用服务能力,SDK 不拥有服务端 truth |
| `PublishBusEvent` | 事件客户端视图 | Command API | 通过 `L0-bus` 语义发布事件,SDK 不拥有 bus runtime truth |
| `RecordCompatibilityDecision` | 文档、兼容与演进 | Command API | 会写入 `CompatibilityDecision` |
| `DeprecateSdkApi` | 文档、兼容与演进 | Command API | 会写入 `DeprecatedApiRecord` 和 `MigrationGuideRef` 引用 |
| `GetSdkCapabilitySummary` | 官方客户端语义核心 | Query API | 读取 SDK 能力、语言、版本和 unsupported 说明 |
| `GetUpstreamVersionRefs` | 上游契约消费与派生视图 | Query API | 读取上游版本引用 |
| `GetSnapshotFreshness` | 上游契约消费与派生视图 | Query API | 读取 freshness 状态 |
| `GetServiceClientView` | 平台能力访问与正式边界适配 | Query API | 读取服务 client 视图 |
| `GetEventClientView` | 事件客户端视图 | Query API | 读取事件 client 视图 |
| `ReadServiceCapability` | 平台能力访问与正式边界适配 | Query API | 通过 formal API 读取外部服务结果,不写 SDK truth |
| `OpenEventSubscription` | 事件客户端视图 | Query API | 通过 bus subscription 提供事件读取视图,不实现 bus runtime |
| `GetPackageCandidateStatus` | package candidate 与验证证据 | Query API | 读取 candidate 状态 |
| `GetVerificationEvidence` | package candidate 与验证证据 | Query API | 读取验证证据引用和结果 |
| `GetCompatibilityDecision` | 文档、兼容与演进 | Query API | 读取兼容判断 |
| `ListDeprecatedApis` | 文档、兼容与演进 | Query API | 读取 deprecated 记录 |
| `GetMigrationGuideRef` | 文档、兼容与演进 | Query API | 读取迁移说明引用 |
| `ConsumeCoreContractChanged` | 上游契约变化 | Inbound Event Consumer | 触发 freshness 和派生视图更新判断 |
| `ConsumeBusSemanticChanged` | bus 语义变化 | Inbound Event Consumer | 触发 event client view stale / pending 判断 |
| `ConsumeFormalApiChanged` | formal API 变化 | Inbound Event Consumer | 触发 service client view 和 compatibility 判断 |
| `ConsumeValidationRunFinished` | 验证运行结果 | Inbound Event Consumer | 转化为 `VerificationEvidence` 或 candidate 状态 |
| `SdkSemanticBaselineChangedEvent` 等 | SDK 已提交事实 | Outbound Event | 通知 automation、review、reports 或下游消费方 |
| `GeneratePackageCandidate` 等 | 维护 / 验证任务 | Operations Job | 承接 package、smoke、docs、compatibility、projection 和 boundary 验证 |
| application service | 内部用例编排 | 留给 Step 8 / 详细设计 | 本步不把内部 service 函数误写成外部 API |
| repository / port / runner / generator | 实现边界 | 留给详细设计 | 属于依赖倒置、持久化、runner 或 adapter 契约 |

#### 7.3 Command API 骨架表

| API | 输入骨架 | 输出骨架 | 主要处理 | 写入结果 |
|---|---|---|---|---|
| `UpdateSdkSemanticBaseline` | `UpdateSdkSemanticBaselineCommand command`、`ActorContext actor`、`CommandMetadata meta`、`IdempotencyKey idempotency_key` | `SdkSemanticBaselineResult result` | 校验上游引用、语言集合、能力模型和概念映射变更 | `SdkSemanticBaseline`、`ClientCapabilityModel`、`CrossLanguageConceptMap` |
| `RefreshDerivedBindingView` | `RefreshDerivedBindingViewCommand command`、`ActorContext actor`、`CommandMetadata meta`、`IdempotencyKey idempotency_key` | `DerivedBindingRefreshResult result` | 消费 core / bus / formal API 快照,更新派生视图和 freshness | `DerivedBindingView`、`LanguageBindingView`、`SnapshotFreshnessState`、`UpstreamVersionRef` |
| `InvokeServiceCapability` | `ServiceCapabilityCall command`、`ClientCallContext context`、`CommandMetadata meta`、`IdempotencyKey idempotency_key` | `ServiceCapabilityCallResult result` | 解析 `ServiceCapabilityRef`,应用横切策略,经 formal API 或 fake boundary 调用服务能力 | 不写 SDK truth;外部服务 truth 归 formal API 背后的服务仓 |
| `PublishBusEvent` | `PublishBusEventCommand command`、`ClientCallContext context`、`CommandMetadata meta`、`IdempotencyKey idempotency_key` | `BusEventPublishResult result` | 解析 `EventSemanticMapping`,应用 trace / redaction / credential 策略,经 `L0-bus` 语义发布 | 不写 SDK truth;publication / delivery truth 归 `L0-bus` |
| `RecordCompatibilityDecision` | `RecordCompatibilityDecisionCommand command`、`ActorContext actor`、`CommandMetadata meta`、`IdempotencyKey idempotency_key` | `CompatibilityDecisionResult result` | 基于 candidate、上游引用和验证证据记录兼容判断 | `CompatibilityDecision`、`VerificationEvidenceRefSet` |
| `DeprecateSdkApi` | `DeprecateSdkApiCommand command`、`ActorContext actor`、`CommandMetadata meta`、`IdempotencyKey idempotency_key` | `DeprecatedApiResult result` | 标记 SDK API deprecated,绑定迁移说明和计划移除信息 | `DeprecatedApiRecord`、`MigrationGuideRef` |

Command 边界说明：

- `InvokeServiceCapability` 和 `PublishBusEvent` 是 SDK runtime client command,不是 SDK 本地领域 command。
- 本地 truth command 必须携带 `ActorContext actor`;runtime client command 使用 `ClientCallContext context`,其中可以承接调用方或 gateway 注入的 actor、trace 和 credential reference。
- SDK 不执行认证、授权或治理审批;`ActorContext` 和 `ClientCallContext` 只作为上下文和审计材料传递。
- Command 输入 / 输出骨架是 DTO / result skeleton,不得反向污染 Step 6 领域对象。

#### 7.4 Query API 骨架表

| API | 输入骨架 | 输出骨架 | 读取来源 | 边界 |
|---|---|---|---|---|
| `GetSdkCapabilitySummary` | `GetSdkCapabilitySummaryQuery query`、`ActorContext actor` | `SdkCapabilitySummaryView view` | `SdkSemanticBaseline`、`ClientCapabilityModel`、capability projection | 只读能力、语言和 unsupported 说明 |
| `GetUpstreamVersionRefs` | `GetUpstreamVersionRefsQuery query`、`ActorContext actor` | `UpstreamVersionRefsView view` | `UpstreamVersionRef` repository / projection | 只读版本引用,不刷新上游 |
| `GetSnapshotFreshness` | `GetSnapshotFreshnessQuery query`、`ActorContext actor` | `SnapshotFreshnessView view` | `SnapshotFreshnessState` projection | 只读 freshness,不触发 refresh |
| `GetServiceClientView` | `GetServiceClientViewQuery query`、`ActorContext actor` | `ServiceClientView view` | `ServiceClientView` projection | 只读 SDK 服务 client 视图,不调用服务能力 |
| `GetEventClientView` | `GetEventClientViewQuery query`、`ActorContext actor` | `BusEventClientView view` | `BusEventClientView` projection | 只读事件 client 视图,不订阅 bus |
| `ReadServiceCapability` | `ServiceCapabilityReadQuery query`、`ClientCallContext context` | `ServiceCapabilityReadResult result` | formal API read boundary / fake boundary | 读取外部服务只读结果,SDK 不拥有服务端业务 truth |
| `OpenEventSubscription` | `OpenEventSubscriptionQuery query`、`ClientCallContext context` | `EventSubscriptionView view` | `L0-bus` subscription boundary | 提供事件读取视图,不保存事件 payload 或实现 bus runtime |
| `GetPackageCandidateStatus` | `GetPackageCandidateStatusQuery query`、`ActorContext actor` | `PackageCandidateStatusView view` | `PackageCandidate` repository / projection | 只读 candidate 状态和版本 |
| `GetVerificationEvidence` | `GetVerificationEvidenceQuery query`、`ActorContext actor` | `VerificationEvidenceView view` | `VerificationEvidence` repository / evidence projection | 只读证据引用和脱敏结果,不输出正文 |
| `GetCompatibilityDecision` | `GetCompatibilityDecisionQuery query`、`ActorContext actor` | `CompatibilityDecisionView view` | `CompatibilityDecision` repository / projection | 只读兼容结论,不重新计算 |
| `ListDeprecatedApis` | `ListDeprecatedApisQuery query`、`ActorContext actor`、`PageRequest page` | `DeprecatedApiPage page` | `DeprecatedApiRecord` repository / projection | 只读 deprecated 列表和迁移引用 |
| `GetMigrationGuideRef` | `GetMigrationGuideRefQuery query`、`ActorContext actor` | `MigrationGuideRefView view` | `MigrationGuideRef` repository / document reference | 只读迁移说明引用,不复制迁移正文 |

Query 边界说明：

- SDK 本地 query 读取 projection、reference、evidence 或 view,不得改写 `SdkSemanticBaseline`、`DerivedBindingView`、`PackageCandidate`、`CompatibilityDecision` 等 truth。
- runtime read / subscription query 只封装 formal API 或 `L0-bus` read boundary,不拥有外部业务事实或 bus runtime 状态。
- Query 需要 `ActorContext actor` 或 `ClientCallContext context`,但 SDK 不在本步实现鉴权。
- Query 输出骨架是 view / result skeleton,不写完整 JSON、proto、event payload 或 stream callback 参数。

#### 7.5 Inbound Event Consumer 骨架表

| Consumer | 来源 | 输入骨架 | 本地结果 | 边界 |
|---|---|---|---|---|
| `ConsumeCoreContractChanged` | `L0-core` contract release / change notice | `CoreContractChangedEvent event`、`EventId event_id`、`EventSourceRef source_ref`、`CoreContractChangeEnvelopeRef envelope_ref`、`IdempotencyKey idempotency_key` | `CoreContractChangeResult result` | 只记录上游版本变化和 freshness 影响,不复制 core 契约正文 |
| `ConsumeBusSemanticChanged` | `L0-bus` semantic release / change notice | `BusSemanticChangedEvent event`、`EventId event_id`、`EventSourceRef source_ref`、`BusSemanticChangeEnvelopeRef envelope_ref`、`IdempotencyKey idempotency_key` | `BusSemanticChangeResult result` | 只影响 `BusEventClientView` 与 `EventSemanticMapping` freshness,不重新定义 bus truth |
| `ConsumeFormalApiChanged` | L1/L2/L3/L4 formal API change notice | `FormalApiChangedEvent event`、`EventId event_id`、`EventSourceRef source_ref`、`FormalApiChangeEnvelopeRef envelope_ref`、`IdempotencyKey idempotency_key` | `FormalApiChangeResult result` | 只影响 `ServiceClientView`、`ServiceCapabilityRef` 和 compatibility 判断 |
| `ConsumeValidationRunFinished` | validation runner / CI / local verification runner | `ValidationRunFinishedEvent event`、`EventId event_id`、`EventSourceRef source_ref`、`ValidationRunRef run_ref`、`IdempotencyKey idempotency_key` | `VerificationEvidenceRecordResult result` | 转化为 `VerificationEvidence`,不保存测试日志正文、请求响应正文或 secret |

Inbound Event 边界说明：

- SDK 当前不是独立线上服务,这些 Consumer 是维护 / automation 边界的事件消费骨架。
- 所有 Consumer 都必须幂等,重复事件不得重复推进 candidate、freshness 或 compatibility 状态。
- Consumer 不直接调用 runtime service command,只更新 SDK 本地 freshness、evidence、candidate 或 compatibility 相关状态。

#### 7.6 Outbound Event 骨架表

| Event | 产生来源 | 主要消费者 | 说明 |
|---|---|---|---|
| `SdkSemanticBaselineChangedEvent` | `SdkSemanticBaseline` committed | automation、docs validation、compatibility checker | 表示 SDK 共同语义基线变化 |
| `SdkSnapshotFreshnessChangedEvent` | `SnapshotFreshnessState` changed | candidate generator、maintainer、reports | 表示上游快照新鲜度变化 |
| `PackageCandidateGeneratedEvent` | `PackageCandidate.status=Draft` | smoke runner、docs runner、review automation | 表示本地 candidate 已生成 |
| `VerificationEvidenceRecordedEvent` | `VerificationEvidence` committed | candidate validator、compatibility checker、reports | 表示验证证据已记录,不包含正文 |
| `CompatibilityDecisionRecordedEvent` | `CompatibilityDecision` committed | release review、docs、downstream consumers | 表示兼容判断已形成 |
| `DeprecatedApiRecordedEvent` | `DeprecatedApiRecord` committed | docs、migration guide maintainer、downstream consumers | 表示 SDK API 已进入 deprecated / migration 路径 |

Outbound Event 边界说明：

- Outbound Event 传播 SDK 已提交维护事实,不传播外部服务业务事实。
- 事件 payload 只包含 id、状态、版本引用、证据引用和迁移引用等骨架信息;完整 schema 后移详细设计。
- 任何事件都不得携带业务正文、事件 payload、生产请求 / 响应正文、观测正文或凭据正文。

#### 7.7 Operations Job 骨架表

| Job | 输入来源 | 输出结果 | 边界 |
|---|---|---|---|
| `CheckUpstreamFreshness` | `UpstreamVersionRef` repository、latest upstream index、`ActorContext actor`、`JobMetadata meta` | `FreshnessCheckResult result` | 只判断 freshness,不直接重写上游 truth |
| `GeneratePackageCandidate` | `SdkSemanticBaseline`、`DerivedBindingView`、`ServiceClientView`、`BusEventClientView`、`ActorContext actor`、`JobMetadata meta` | `PackageCandidateJobResult result` | 生成本地 candidate,不等同公共 registry 发布 |
| `BuildLanguagePackages` | `PackageCandidate`、`LanguageBindingViewSet`、`ActorContext actor`、`JobMetadata meta` | `LanguagePackageBuildResult result` | 构建语言 package artifact,不修改语义基线 |
| `RunCrossLanguageSmoke` | `PackageCandidate`、`ClientCapabilityModel`、fake / formal target refs、`ActorContext actor`、`JobMetadata meta` | `CrossLanguageSmokeResult result` | 生成 smoke evidence,不得保存请求响应正文或 secret |
| `ValidateDocsExamples` | `PackageCandidate`、docs example refs、fake / fixture refs、`ActorContext actor`、`JobMetadata meta` | `DocsExampleValidationResult result` | 验证 quickstart / docstring / examples 与 candidate 一致 |
| `CheckCompatibility` | `PackageCandidate`、`SdkSemanticBaseline`、`UpstreamVersionRefSet`、`VerificationEvidenceRefSet`、`ActorContext actor`、`JobMetadata meta` | `CompatibilityCheckResult result` | 生成或更新兼容判断,breaking change 不得静默通过 |
| `VerifyBoundaryPolicies` | `BoundaryGuard`、`RedactionPolicy`、`CredentialProtectionPolicy`、candidate refs、`ActorContext actor`、`JobMetadata meta` | `BoundaryPolicyVerificationResult result` | 验证 forbidden body、redaction、credential 和 fake success 边界 |
| `RebuildSdkProjections` | committed SDK truth snapshot、projection target、`ActorContext actor`、`JobMetadata meta` | `ProjectionRebuildResult result` | 重建 capability / evidence / compatibility projection,不改写本地 truth |

Operations Job 边界说明：

- Job 基于已持久化 SDK truth、上游引用或 candidate 执行,不能绕过 domain object 和 policy。
- Job 产生的结果通常是 `VerificationEvidence`、projection 更新、candidate 状态推进或 compatibility decision。
- Job 不是用户业务 command,也不是公共注册表发布流程。

#### 7.8 Port / Repository / Adapter 边界摘要

| 边界主语 | 类型 | 本步处理方式 | 详细设计承接方向 |
|---|---|---|---|
| `CoreContractSourcePort` | upstream source port | 不作为 API | 详细设计定义 core contract snapshot 读取和版本引用 |
| `BusSemanticSourcePort` | upstream source port | 不作为 API | 详细设计定义 bus semantic snapshot 读取和 freshness 判断 |
| `FormalApiBoundaryPort` | outbound runtime port | 不作为 Command API | 详细设计定义 formal API 调用抽象、错误映射和 trace 传递 |
| `FakeFixtureEndpointPort` | outbound test / validation port | 不作为 Command API | 详细设计定义 fake / fixture 边界和 fake success 防护 |
| `LanguageBindingGeneratorPort` | generator port | 不作为 API | 详细设计定义语言 binding 生成入口和产物引用 |
| `PackageBuilderPort` | build port | 不作为 API | 详细设计定义三语言 package build 入口和 artifact 结果 |
| `SmokeRunnerPort` | validation runner port | 不作为 API | 详细设计定义 cross-language smoke runner 契约 |
| `DocsExampleRunnerPort` | validation runner port | 不作为 API | 详细设计定义 docs example runner 契约 |
| `EvidenceRepository` | persistence port | 不作为 API | 详细设计定义 evidence append / read / redaction marker |
| `CandidateRepository` | persistence port | 不作为 API | 详细设计定义 candidate save / status update / optimistic locking |
| `VersionRefRepository` | persistence port | 不作为 API | 详细设计定义 upstream refs 保存和 freshness 查询 |
| `ProjectionRepository` | projection port | 不作为 API | 详细设计定义 capability、evidence、compatibility projection |
| `OutboxPublisherPort` | event publication port | 不作为业务 API | 详细设计定义 SDK outbound event 写入和发布边界 |
| `ClockPort` / `IdGeneratorPort` / `UnitOfWork` | technical port | 不作为 API | 详细设计定义事务、时间、ID 和幂等接缝 |

#### 7.9 Step 8 处理流承接清单

| 接口 / Job / Consumer | 是否需要独立处理流 | 原因 |
|---|---|---|
| `UpdateSdkSemanticBaseline` | 是 | 会改写 SDK 共同语义和能力模型,必须说明基线变更边界 |
| `RefreshDerivedBindingView` | 是 | 上游消费到派生视图和 freshness 的主写路径 |
| `InvokeServiceCapability` | 是 | formal API / fake boundary、错误映射、trace、redaction 和 credential 需要独立说明 |
| `PublishBusEvent` | 是 | SDK event client 到 `L0-bus` 的语义边界需要独立说明 |
| `RecordCompatibilityDecision` | 是 | 兼容判断影响 stable / breaking / migration 口径 |
| `DeprecateSdkApi` | 是 | deprecated lifecycle、migration guide 和兼容判断关联需要独立说明 |
| `ConsumeCoreContractChanged` | 可合并为上游变化消费流 | 与 bus / formal API 变化消费结构相近,但必须列来源差异 |
| `ConsumeBusSemanticChanged` | 可合并为上游变化消费流 | 与 core / formal API 变化消费结构相近,但影响 event client view |
| `ConsumeFormalApiChanged` | 可合并为上游变化消费流 | 与 core / bus 变化消费结构相近,但影响 service client view |
| `ConsumeValidationRunFinished` | 是 | 验证运行结果到 evidence / candidate 状态推进需要独立说明 |
| `GeneratePackageCandidate` | 是 | P0 candidate 的生成主路径 |
| `BuildLanguagePackages` | 可并入 candidate 生成流 | 是 candidate 生成的一段,可在独立分支说明 |
| `RunCrossLanguageSmoke` | 是 | 证明三语言一致、错误、trace、redaction 和能力接入 |
| `ValidateDocsExamples` | 是 | quickstart / docstring / example 与真实 client 行为一致性路径 |
| `CheckCompatibility` | 是 | 兼容结论和 migration / deprecated 的关键处理流 |
| `VerifyBoundaryPolicies` | 是 | forbidden body、credential、redaction、fake success 是横切底线 |
| `RebuildSdkProjections` | 可合并为 projection rebuild 流 | 不改写真相,但需要说明只读投影重建边界 |
| Query API | 可合并为通用只读处理流 | Query 不改写 SDK truth;Step 8 只需列读取来源差异 |
| Outbound Event | 可合并为事实发布处理流 | 多数事件由 committed SDK truth 统一发布,差异在 event kind |

#### 7.10 本步图示说明

本步不画 ASCII 图。

原因：

- `standards/document/概要设计书写规范.md` §4.7 明确规定 API / 接口骨架章节禁止画流程图。
- API 到内部对象、application service 和 port 的流转图应放到 Step 8 “关键处理流 / 重要函数数据流”。
- HTTP path、RPC service、topic 命名、event schema、stream callback 和协议时序都属于详细设计或协议设计内容,不在本步展开。

### 8. 回填草稿

正式 `02-概要设计.md` §7 “API / 接口骨架”直接摘录并润色本文件：

- §7.1 “接口层边界说明”
- §7.2 “接口候选筛选表”
- §7.3 “Command API 骨架表”
- §7.4 “Query API 骨架表”
- §7.5 “Inbound Event Consumer 骨架表”
- §7.6 “Outbound Event 骨架表”
- §7.7 “Operations Job 骨架表”
- §7.8 “Port / Repository / Adapter 边界摘要”
- §7.9 “Step 8 处理流承接清单”

不在本 Step 重复粘贴完整正式章节正文。Step 14 生成正式文档时,再统一补充校准来源、延伸阅读、正式文档语气和交叉引用。

### 9. 待确认事项

| 待确认项 | 方案 | 建议 | 原因 |
|---|---|---|---|
| runtime client command 是否归入 Command API | A：归入 Command API,但注明不写 SDK truth;B：另开 Runtime API 类别 | 建议 A | SOP 要按 Command / Query 分类;通过写入归属说明即可避免边界混乱 |
| `OpenEventSubscription` 是否归 Query API | A：归入 Query API;B：另开 Stream API 类别 | 建议 A | 概要设计阶段先按只读 event view 处理,详细设计再展开 stream / callback 契约 |
| 上游变化 Consumer 是否需要三条独立 Step 8 流程 | A：独立三条;B：合并为一条上游变化消费流并列来源差异 | 建议 B | 三者结构相近,合并能避免重复;但必须列出 core / bus / formal API 影响对象差异 |
| public registry 发布是否进入 Operations Job | A：进入;B：不进入当前 P0 | 建议 B | 当前 P0 只要求本地 package candidate 和验证证据,公共发布后移 |

以上待确认项不阻塞进入 Step 8。除非后续讨论明确改变,后续 Step 按“建议方案”继续展开。

### 10. 进入下一步条件

- 已明确 Command、Query、Inbound Event Consumer、Outbound Event、Operations Job 的分类。
- 已明确 SDK 本地 truth command 与 runtime client command 的写入归属不同。
- 已明确接口 DTO / result / view skeleton 不是 Step 6 领域对象。
- 已明确主要接口的输入骨架、输出骨架、读写性质、对象承接和边界。
- 已显式处理 `ActorContext`、`ClientCallContext`、`CommandMetadata`、`IdempotencyKey`、event id、source ref、envelope ref 和 run ref。
- 已列出 Step 8 必须独立展开或可合并展开的处理流。
- 已避免写 HTTP path、完整 JSON / proto schema、topic、错误码全集、鉴权实现、stream callback 参数和函数实现代码。
