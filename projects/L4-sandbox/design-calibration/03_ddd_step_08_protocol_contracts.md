# Step 8. 定义 API / Command / Query / Event / Job 协议契约

> 对应 SOP: `standards/document/详细设计讨论流程_SOP.md` Step 8
> 回填章节: `03-详细设计.md` §7 API / Command / Query / Event / Job 协议契约;§6 全局对象 / Trait / API 索引
> 生成日期: 2026-07-09
> 状态: completed_wait_user_review
> 所属流程: `03_ddd_calibration_flow.md`
> 本 Step 口径: 在 Step 6 对象契约和 Step 7 trait / port / adapter 契约基础上,按协议族闭口 public request / response / event / receipt / report schema、字段来源、错误映射、幂等、审计和 DTO 到对象构造关系。本步不写真实 HTTP path、真实 topic、DDL、配置 key、测试结果、run_id、验收 evidence 或实施 commit boundary。

---

## 1. Step 开工确认

| 检查项 | 结论 |
|---|---|
| 用户是否已确认进入 Step 8 | 是。Step 7 审查点后用户已回复“同意”,允许进入 Step 8。 |
| 项目级台账是否允许进入 Step 8 | 是。`project_execution_ledger.md` 原恢复点为 Step 7 `pass_wait_review`,用户确认后可进入 Step 8。 |
| 文档级 flow 是否允许进入 Step 8 | 是。`03_ddd_calibration_flow.md` 原记录 Step 8 `blocked_by_step_7_review`,用户确认后门禁满足。 |
| 是否已读取 Step 7 port 契约 | 是。Step 7 已闭口 `SandboxCommandService`、`SandboxQueryService`、`SandboxConsumerService`、`SandboxJobService`、repository、resolver、backend、handoff、publisher、idempotency、stored result 和 entry adapter callable surface。 |
| 是否已读取详细设计 SOP Step 8 | 是。本步必须输出协议总表、按协议族批次表、每协议独立小节、schema、字段来源、构造闭环、错误映射、幂等审计、协议族停审和跨协议 public surface 审计。 |
| 是否已读取详细设计书写规范 §5.7 | 是。本步必须为 Command / Query / Event / Job 写 request / response / event schema,Query 必须写 view / page / marker surface。 |
| 是否已读取真相源闭环标准 | 是。当前重点覆盖 public DTO 二级类型、stored result / receipt / job report typed replay、page helper 映射、query degraded / empty / not visible surface 和 actor/source authority。 |
| 是否发现阻塞 Step 8 的上游 blocker | 否。`04` / `07` 缺失、backend 产品、真实 route/topic、配置 key、DDL、测试结果和实施 boundary 均为后续文档或后续 Step 内容,不阻塞本步协议契约。 |

---

## 2. 本步目标

本步把概要接口骨架和 Step 7 application facade 转成 public-facing 协议契约。重点是让后续 Step 9 可以逐接口写函数级处理流,无需再猜 DTO 字段、二级类型、page DTO、receipt / report、actor authority、duplicate replay 或错误 surface。

本步必须闭口:

- 10 个 Command request / result DTO。
- 13 个 Query request / response view / page / marker DTO。
- 9 个 Inbound Event Consumer envelope / typed payload / receipt DTO。
- 13 个 Outbound Event envelope / typed payload DTO。
- 10 个 Operations Job input / report / stored replay DTO。
- `Page<T>` application-local helper 到 public page DTO 的映射。
- Command result、consumer receipt、job report、outbound event payload 中所有二级 public type 的 schema 和 owner。
- DTO / Event / Job 到 Step 6 domain object、Step 7 port、Step 9 flow 的闭环。
- actor authority、scope membership、trusted source 例外和不可绕过 gate。
- duplicate replay 的 stored result / receipt / report save/get surface,不允许重跑 mutation / consumer / job。

本步不处理:

- 真实 HTTP path、RPC 服务名、真实 topic、schema registry 名称或部署配置。
- repository DDL、migration、索引、storage key 物理 shape。
- Step 9 的逐调用顺序、事务 save order、状态迁移矩阵和 rollback 语义。
- Step 12 的完整错误 taxonomy 和恢复策略。
- Step 14 的配置 key / 默认值 / env var。
- Step 16 的测试用例全集和真实执行结果。

---

## 3. 本步输入

| 输入 | 状态 | 用途 |
|---|---|---|
| `project_execution_ledger.md` | 已读取 | 确认当前 full-restart 恢复点和进入 Step 8 的门禁。 |
| `03_ddd_calibration_flow.md` | 已读取 | 确认 Step 1~7 已完成、正式 `03` 仍不得修改。 |
| `03_ddd_step_06_object_contracts.md` | 已读取 | 提供 contracts shared carrier、domain truth object、application result / receipt / report、infra outcome 和 entry shell。 |
| `03_ddd_step_07_trait_port_adapter_contracts.md` | 已读取 | 提供 application facade、repository、external port、idempotency、stored result、entry adapter 和 fake parity。 |
| `02_hld_step_07_api_interface_skeleton.md` | 已读取 | 提供 Command、Query、Inbound Event Consumer、Outbound Event、Operations Job 名称和概要输入输出骨架。 |
| `02_hld_step_12_detailed_design_handoff.md` | 已读取 | 提供 `03` 必须继续展开的对象、接口、flow、状态、配置和测试承接方向。 |
| 正式 `00-需求文档.md` | 已读取 | 提供 C-SBX-1~5、数据归属、接口依赖、NFR 和零容忍红线。 |
| 正式 `01-架构设计.md` | 已读取 | 提供通信方式、依赖裁剪、一致性分层、fail-closed、handoff no-rollback、cleanup / redline 底线。 |
| 正式 `02-概要设计.md` | 已读取 | 提供六个组成部分、关键对象、接口骨架、处理流、状态机和异常边界。 |

---

## 4. Step 内计划

| 顺序 | 动作 | 状态 | 产物 / 门禁 |
|---:|---|---|---|
| 1 | 读取恢复点、Step 6 / 7、概要接口骨架、Step 8 SOP、书写规范和真相源标准。 | done | 用户确认 Step 7 后允许进入 Step 8。 |
| 2 | 先闭口 shared public protocol carrier、page DTO、error DTO、actor/source authority、stored replay 类型。 | done | 防止每个协议私造二级类型。 |
| 3 | 按 Command 协议族定义 request / result、对象构造、错误、幂等与审计。 | done | 10 个 command 均可回指 Step 6 truth 和 Step 7 command service。 |
| 4 | 按 Query 协议族定义 request / response view / page / marker 和 no-write surface。 | done | 13 个 query 均有 empty / not visible / stale / degraded / failed / rebuilding / disabled / missing projection surface。 |
| 5 | 按 Inbound Event Consumer 协议族定义 envelope、typed payload、receipt、duplicate / delayed / quarantine。 | done | payload 不重复 envelope 字段;consumer 不写核心 success。 |
| 6 | 按 Outbound Event 协议族定义 canonical envelope / payload 和 source cursor。 | done | 13 个 outbound event 只来自 committed truth / maintenance state;publish failure 不回滚 truth。 |
| 7 | 按 Operations Job 协议族定义 input / report / stored replay 和 item refs。 | done | 10 个 job 都有 public report schema;duplicate replay 不重跑 job。 |
| 8 | 输出字段来源、构造闭环、协议族停审、跨协议审计、回填草稿和进入下一步条件。 | done | Step 9 可逐接口展开 flow。 |
| 9 | 更新 `03_ddd_calibration_flow.md` 和项目级台账。 | pending | 停在 Step 8 审查点,不创建 Step 9。 |

---

## 5. SOP 问题回答

| SOP 问题 | 本步回答 |
|---|---|
| 本轮需要定义哪些协议 | 定义 10 个 Command、13 个 Query、9 个 Inbound Event Consumer、13 个 Outbound Event、10 个 Operations Job。 |
| 协议如何分批 | 按 Command、Query、Inbound Event Consumer、Outbound Event、Operations Job 五个协议族分批;每个协议族单独停审。 |
| 每个协议调用方 / 处理方 / 传输方式是什么 | 使用逻辑传输名称:sync command、sync query、inbound event、outbound relay event、operations job invocation。真实 HTTP path / topic 后移。 |
| 外部接口是否写真实路由 / topic | 不写真实部署细节;本步写稳定逻辑协议名,例如 `Command/OpenControlledExecutionContext`、`Event/SandboxRunChanged`。 |
| 请求 / 响应 / event / job schema 是什么 | §10 定义 shared carrier;§11~§15 对每个协议给出 request / payload / result / receipt / report 字段。 |
| 输入契约构造或影响哪些 Domain 对象 | §16 总表逐族映射到 Step 6 domain object 和 Step 7 port。 |
| 必填字段是否全部有来源 | 是。字段来源分为 request/envelope、metadata、resolver / repository lookup、id generator、clock、adapter outcome、committed truth cursor。缺失处理在各协议小节和 §17 说明。 |
| 相近字段不得混同 | 明确区分 `context_ref`、`environment_identity_ref`、`boundary_ref`、`handle_ref`、`relay_record_ref`、`payload_ref`、`event_envelope_ref`、`stored_result_ref`、`source_cursor`、`page_cursor`、`repository_version`。 |
| 字段缺失时如何处理 | Command 多数 reject / fail-closed / pending;Query 返回 not visible / degraded / missing projection / unavailable;Consumer delayed / quarantined / rejected;Outbound 不创建 relay record;Job skipped / partial failed / degraded。 |
| DTO / Event / Job 是否回指 Step 6 / Step 7 / Step 9 | 是。每个协议小节写目标对象和依赖 port;§16 汇总 protocol-to-object-to-port-to-flow。 |
| Query view / page / marker 是否有字段 schema | 是。§10.3~§10.5 定义通用 response / page / marker;§12 每个 query 定义 view DTO 字段。 |
| Query empty / not visible / stale / failed / rebuilding / disabled / missing projection surface | 是。统一由 `SandboxQuerySurfaceStatus` 与 `SandboxProjectionMarkerDto` 表达,每个 query 写适用映射。 |
| page helper 如何映射 | Step 7 `Page<T>` / `SandboxRepositoryPage` 是 application-local;本步映射为 `SandboxPageRequestDto` / `SandboxPageInfoDto`,不暴露 repository cursor 类型。 |
| command result / event payload / receipt / report 二级类型是否闭口 | 是。§10 定义 result、receipt、report、envelope、error、authority、metadata、ref-set、status owner。 |
| Inbound consumer envelope / payload 是否分离 | 是。公共 `SandboxInboundEventEnvelopeDto<TPayload>` 承载 event id/source/schema/dedup/trace;typed payload 不重复 envelope 字段。 |
| actor / source authority 是否明确 | 是。§10.1 直接承接 core `ActorKind::{Human,AiMember,System,Integration}`，不创建 Sandbox 私有 authority enum；Command / Query 使用合法 core actor 并继续执行 authorization / visibility gate；Consumer 的 trusted source 由 `source_ref` 与 envelope / source gate 证明，不能绕过 digest、forbidden body、idempotency 或 state gate。 |
| 协议失败映射 | 每个小节写 primary error;§17 统一映射公共错误。 |
| 幂等和审计 | Command、Consumer、Job 必须用 idempotency / dedup / stored result;Query 不使用 idempotency 且 no-write;Outbound relay 由 relay record + source cursor 去重。 |
| 跨协议 public surface 是否闭环 | §19 完成审计,当前无 unresolved protocol blocker。 |

---

## 6. 当前文档问题诊断

| 风险来源 | 问题 | 本步处理 |
|---|---|---|
| Step 7 `Page<T>` 是 application-local | 若 Step 8 不定义 public page DTO,API / query 会直接暴露 repository helper。 | 定义 `SandboxPageRequestDto` / `SandboxPageInfoDto`,仅做 cursor 字符串透传,不暴露 repository version / truth cursor。 |
| Step 7 service facade 只给 `SandboxServiceOutcome` | 若不拆 command result,实现者会用裸 bool 或单 ref。 | 定义 `SandboxCommandResultDto` 和每个 command 的 result detail fields。 |
| Consumer duplicate replay | 若没有 typed receipt stored surface,duplicate 可能重跑 consumer。 | 定义 consumer envelope / receipt / stored result mapping;duplicate 返回 stored receipt。 |
| Job report accumulator | 若 report item refs 不进入 public report schema,duplicate replay 无法返回完整 job report。 | 定义 `SandboxJobReportDto` 和 `SandboxJobReportItemDto`,所有 job 小节列明 item refs。 |
| Query read surface | 若只写 view 类型名,empty / stale / degraded / missing projection 会由实现猜测。 | 每个 query 写 request、view DTO、surface statuses 和 marker 来源。 |
| Outbound event payload | 若只写 event kind,relay record 无法证明 payload 来源。 | 每个 outbound event 写 canonical payload fields、source truth / cursor、forbidden body 规则。 |

---

## 7. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| API 骨架 | Step 02/07 只有接口名和输入输出骨架。 | 本步为每个协议定义 request / response / payload / report surface。 | 支撑 Step 9 flow 和实现 DTO。 |
| Query | 只有 query 名称和 read source。 | 每个 query 有 request、view、page、projection marker、degraded / empty surface。 | 防止 query 反写 truth 或临时拼 marker。 |
| Event | 只有 inbound / outbound 名称。 | inbound 有 envelope + payload + receipt;outbound 有 envelope + payload + source cursor。 | 支撑 relay、feedback、dedup 和 no-rollback。 |
| Job | 只有 job 名称。 | 每个 job 有 input spec、report item refs、stored replay surface。 | 防止 job 变成业务 command 或 duplicate 重跑。 |
| Public DTO | Step 6 只收敛 shared carrier。 | 本步定义 public protocol DTO owner、字段、缺失处理和 domain 映射。 | 避免 public DTO 直接依赖 domain-only type。 |

---

## 8. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| A. 本步只写逻辑协议名,不写真实 route/topic | 不伪造部署细节,仍能稳定映射 handler / event kind。 | 04/实现阶段仍需绑定真实协议。 | 采用。 |
| B. 本步写完整 HTTP path / topic | 实现者可直接接入 transport。 | 当前缺产品/部署输入,会伪造事实。 | 不采用。 |
| C. 所有 command 共用一个无 detail result | 简短。 | duplicate replay、UI/query 和审计无法知道 primary / side effect refs。 | 不采用。 |
| D. Query 直接返回 domain object | 实现简单。 | 泄露 domain-only type,破坏 contracts/domain 依赖方向。 | 不采用。 |
| E. Consumer payload 重复 envelope 字段 | 单 payload 自包含。 | 容易出现 event id / source / trace 双承载漂移。 | 不采用。 |
| F. Job report 只保存在 accumulator 内部 | 实现轻。 | duplicate replay 和审计缺字段,违反 public job surface 闭环。 | 不采用。 |

---

## 9. 结构化中间产物

### 9.1 Step 8 写入批次状态表

| 批次 | 覆盖范围 | 写入状态 | 是否内容完整 | 停审状态 | 后续批次 |
|---|---|---|---|---|---|
| `8.0` | 开工确认、目标、输入、计划、SOP 回答、诊断、取舍 | 已写入 | 是 | 已自检 | `8.1` |
| `8.1` | shared public protocol carrier、page/error/authority/stored replay schema | 已写入 | 是 | 已自检 | `8.2` |
| `8.2` | Command 协议族 | 已写入 | 是 | 已自检 | `8.3` |
| `8.3` | Query 协议族 | 已写入 | 是 | 已自检 | `8.4` |
| `8.4` | Inbound Event Consumer 协议族 | 已写入 | 是 | 已自检 | `8.5` |
| `8.5` | Outbound Event 协议族 | 已写入 | 是 | 已自检 | `8.6` |
| `8.6` | Operations Job 协议族 | 已写入 | 是 | 已自检 | `8.7` |
| `8.7` | 构造闭环、错误映射、停审、跨协议审计、回填草稿、自检 | 已写入 | 是 | 待用户审查 | 无 |

### 9.2 协议总表

| 名称 | 类别 | 调用方 / 发布方 | 处理方 / 订阅方 | 逻辑传输方式 | 是否需要 Step 9 flow |
|---|---|---|---|---|---|
| `OpenControlledExecutionContext` | Command | caller / sync entry | `SandboxCommandService` | `Command/OpenControlledExecutionContext` | 是 |
| `EstablishExecutionBoundary` | Command | caller / system entry | `SandboxCommandService` | `Command/EstablishExecutionBoundary` | 是 |
| `EvaluatePolicyExecution` | Command | caller / system entry | `SandboxCommandService` | `Command/EvaluatePolicyExecution` | 是 |
| `StartControlledExecutionRun` | Command | fulfillment entry | `SandboxCommandService` | `Command/StartControlledExecutionRun` | 是 |
| `RecordCaptureResult` | Command | fulfillment entry | `SandboxCommandService` | `Command/RecordCaptureResult` | 是 |
| `OpenMaterialHandoff` | Command | caller / fulfillment entry | `SandboxCommandService` | `Command/OpenMaterialHandoff` | 是 |
| `SubmitSandboxControl` | Command | caller / worker control | `SandboxCommandService` | `Command/SubmitSandboxControl` | 是 |
| `ClassifySandboxFailure` | Command | system / maintenance | `SandboxCommandService` | `Command/ClassifySandboxFailure` | 是 |
| `EvaluateCleanupReadiness` | Command | system / maintenance | `SandboxCommandService` | `Command/EvaluateCleanupReadiness` | 是 |
| `RecordRedlineContainment` | Command | system / security entry | `SandboxCommandService` | `Command/RecordRedlineContainment` | 是 |
| `GetSandboxExecutionStatus` | Query | caller / sync entry | `SandboxQueryService` | `Query/GetSandboxExecutionStatus` | 是 |
| `GetBoundaryStatus` | Query | caller / sync entry | `SandboxQueryService` | `Query/GetBoundaryStatus` | 是 |
| `GetPolicyDecisionSummary` | Query | caller / sync entry | `SandboxQueryService` | `Query/GetPolicyDecisionSummary` | 是 |
| `GetCaptureSummary` | Query | caller / sync entry | `SandboxQueryService` | `Query/GetCaptureSummary` | 是 |
| `GetMaterialHandoffStatus` | Query | caller / sync entry | `SandboxQueryService` | `Query/GetMaterialHandoffStatus` | 是 |
| `GetFailureControlStatus` | Query | caller / sync entry | `SandboxQueryService` | `Query/GetFailureControlStatus` | 是 |
| `GetCleanupReadiness` | Query | caller / sync entry | `SandboxQueryService` | `Query/GetCleanupReadiness` | 是 |
| `GetRedlineContainmentStatus` | Query | caller / sync entry | `SandboxQueryService` | `Query/GetRedlineContainmentStatus` | 是 |
| `GetSandboxReadProjection` | Query | caller / sync entry | `SandboxQueryService` | `Query/GetSandboxReadProjection` | 是 |
| `GetDerivedInspectPreviewTrend` | Query | caller / sync entry | `SandboxQueryService` | `Query/GetDerivedInspectPreviewTrend` | 是 |
| `GetBackendCapabilityComparison` | Query | caller / sync entry | `SandboxQueryService` | `Query/GetBackendCapabilityComparison` | 是 |
| `GetSandboxReconciliationReport` | Query | caller / sync entry | `SandboxQueryService` | `Query/GetSandboxReconciliationReport` | 是 |
| `GetSandboxAuditTrace` | Query | caller / sync entry | `SandboxQueryService` | `Query/GetSandboxAuditTrace` | 是 |
| `ConsumeCallerContextReferenceChanged` | Inbound Event Consumer | identity/work/tool/runtime source | `SandboxConsumerService` | `InboundEvent/CallerContextReferenceChanged` | 是 |
| `ConsumePolicySummaryChanged` | Inbound Event Consumer | policy / authorization source | `SandboxConsumerService` | `InboundEvent/PolicySummaryChanged` | 是 |
| `ConsumeBackendCapabilitySummaryChanged` | Inbound Event Consumer | backend capability source | `SandboxConsumerService` | `InboundEvent/BackendCapabilitySummaryChanged` | 是 |
| `ConsumeIsolationBackendLifecycleSignal` | Inbound Event Consumer | isolation backend source | `SandboxConsumerService` | `InboundEvent/IsolationBackendLifecycleSignal` | 是 |
| `ConsumeMaterialHandoffStatusChanged` | Inbound Event Consumer | material handoff target | `SandboxConsumerService` | `InboundEvent/MaterialHandoffStatusChanged` | 是 |
| `ConsumeObservabilityHandoffStatusChanged` | Inbound Event Consumer | observability handoff target | `SandboxConsumerService` | `InboundEvent/ObservabilityHandoffStatusChanged` | 是 |
| `ConsumeSandboxControlRequested` | Inbound Event Consumer | runtime / operator source | `SandboxConsumerService` | `InboundEvent/SandboxControlRequested` | 是 |
| `ConsumeInvestigationHandoffStatusChanged` | Inbound Event Consumer | investigation source | `SandboxConsumerService` | `InboundEvent/InvestigationHandoffStatusChanged` | 是 |
| `ConsumeSandboxTruthRelayFeedback` | Inbound Event Consumer | event bus / relay feedback | `SandboxConsumerService` | `InboundEvent/SandboxTruthRelayFeedback` | 是 |
| `SandboxExecutionContextChanged` | Outbound Event | sandbox relay | downstream subscribers | `OutboundEvent/SandboxExecutionContextChanged` | 是 |
| `SandboxBoundaryChanged` | Outbound Event | sandbox relay | downstream subscribers | `OutboundEvent/SandboxBoundaryChanged` | 是 |
| `SandboxPolicyDecisionChanged` | Outbound Event | sandbox relay | downstream subscribers | `OutboundEvent/SandboxPolicyDecisionChanged` | 是 |
| `SandboxRunChanged` | Outbound Event | sandbox relay | downstream subscribers | `OutboundEvent/SandboxRunChanged` | 是 |
| `SandboxCaptureChanged` | Outbound Event | sandbox relay | downstream subscribers | `OutboundEvent/SandboxCaptureChanged` | 是 |
| `SandboxMaterialHandoffChanged` | Outbound Event | sandbox relay | downstream subscribers | `OutboundEvent/SandboxMaterialHandoffChanged` | 是 |
| `SandboxFailureChanged` | Outbound Event | sandbox relay | downstream subscribers | `OutboundEvent/SandboxFailureChanged` | 是 |
| `SandboxControlChanged` | Outbound Event | sandbox relay | downstream subscribers | `OutboundEvent/SandboxControlChanged` | 是 |
| `SandboxCleanupChanged` | Outbound Event | sandbox relay | downstream subscribers | `OutboundEvent/SandboxCleanupChanged` | 是 |
| `SandboxRedlineContainmentChanged` | Outbound Event | sandbox relay | downstream subscribers | `OutboundEvent/SandboxRedlineContainmentChanged` | 是 |
| `SandboxProjectionChanged` | Outbound Event | sandbox relay | downstream subscribers | `OutboundEvent/SandboxProjectionChanged` | 是 |
| `SandboxDerivedViewChanged` | Outbound Event | sandbox relay | downstream subscribers | `OutboundEvent/SandboxDerivedViewChanged` | 是 |
| `SandboxReconciliationFindingAvailable` | Outbound Event | sandbox relay | downstream subscribers | `OutboundEvent/SandboxReconciliationFindingAvailable` | 是 |
| `PublishSandboxEventRelay` | Operations Job | job runner | `SandboxJobService` | `Job/PublishSandboxEventRelay` | 是 |
| `RefreshSandboxReferenceStates` | Operations Job | job runner | `SandboxJobService` | `Job/RefreshSandboxReferenceStates` | 是 |
| `RefreshBackendCapabilitySummaries` | Operations Job | job runner | `SandboxJobService` | `Job/RefreshBackendCapabilitySummaries` | 是 |
| `RetryPendingMaterialHandoffs` | Operations Job | job runner | `SandboxJobService` | `Job/RetryPendingMaterialHandoffs` | 是 |
| `RunLeaseOrphanReaper` | Operations Job | job runner | `SandboxJobService` | `Job/RunLeaseOrphanReaper` | 是 |
| `EvaluatePendingCleanupGuards` | Operations Job | job runner | `SandboxJobService` | `Job/EvaluatePendingCleanupGuards` | 是 |
| `MaintainRedlineContainmentHandoffs` | Operations Job | job runner | `SandboxJobService` | `Job/MaintainRedlineContainmentHandoffs` | 是 |
| `RebuildSandboxReadProjections` | Operations Job | job runner | `SandboxJobService` | `Job/RebuildSandboxReadProjections` | 是 |
| `MaintainDerivedInspectPreviewTrend` | Operations Job | job runner | `SandboxJobService` | `Job/MaintainDerivedInspectPreviewTrend` | 是 |
| `RunSandboxReconciliation` | Operations Job | job runner | `SandboxJobService` | `Job/RunSandboxReconciliation` | 是 |

---

## 10. Shared public protocol carrier / 二级类型闭口

本节类型归属 `crates/contracts/src/protocol.rs`、`metadata.rs`、`query.rs`、`events.rs`、`jobs.rs` 或现有 `refs.rs` / `status.rs`。它们是 public DTO surface,不得直接依赖 `domain` crate 类型。domain-only enum 若要进入 protocol,必须在 Step 6 已上提到 `contracts` shared status / kind,或在本步显式定义 mapping。

### 10.1 metadata / authority / trace schema

| DTO / enum | owner | 字段 / variant | 来源 | 禁止替代 |
|---|---|---|---|---|
| `SandboxProtocolMetadataDto` | `contracts` | `protocol_ref`;`schema_version`;`trace_context`;`requested_at`;`request_digest` | entry metadata、clock、canonical DTO digest | 不得从 route、topic、timestamp 或 raw body 拼 digest。 |
| `SandboxActorContextDto` | `contracts` | `actor_ref: ActorRef`;`actor_kind: ActorKind`;`scope_refs`;`source_ref: Option<ExternalSourceRef>` | API auth / trusted entry binding；`ActorKind`只允许 core `Human / AiMember / System / Integration` | 不拥有 actor/member lifecycle；trusted source 由 `source_ref` 和 envelope / source gate 证明，不新增 `TrustedSource` 或 `Maintenance` actor kind。 |
| `SandboxCommandMetadataDto` | `contracts` | `protocol_metadata`;`actor_context`;`idempotency_key_ref`;`expected_version: Option<SandboxOpaqueRef>` | command request metadata | expected_version 只用于 caller-known optimistic guard,不替代 repository version。 |
| `SandboxQueryMetadataDto` | `contracts` | `protocol_metadata`;`actor_context`;`consistency_hint`;`page_request: Option<SandboxPageRequestDto>` | query request metadata | Query 不带 idempotency key,不得打开 write UoW。 |
| `SandboxTraceContext` | `contracts` | `trace_ref`;`parent_trace_ref`;`span_ref` | Step 6 carrier | 不保存 request body、event body 或 raw adapter diagnostics。 |

### 10.2 public page DTO 映射

| DTO | owner | 字段 | application-local source | 缺失 / 错误处理 |
|---|---|---|---|---|
| `SandboxPageRequestDto` | `contracts` | `cursor: Option<SandboxOpaqueRef>`;`limit: u32` | entry maps to Step 7 `SandboxRepositoryPage` | invalid cursor / limit => `Validation`。 |
| `SandboxPageInfoDto` | `contracts` | `next_cursor: Option<SandboxOpaqueRef>`;`returned_count: u32`;`has_more: bool` | Step 7 `Page<T>.next_cursor` + returned item count | cursor 只代表 page 位置,不得当 truth cursor / repository version。 |
| `SandboxPagedResponseDto<T>` | `contracts` | `items: Vec<T>`;`page_info`;`surface` | query service / repository page | empty page 仍必须携带 page-level visibility / surface marker。 |

映射规则:

| application helper | public DTO | 允许方向 | 禁止事项 |
|---|---|---|---|
| `SandboxRepositoryPage.cursor` | `SandboxPageRequestDto.cursor` | API / job input -> repository list | 不得写入 event source cursor、truth cursor、reference marker cursor。 |
| `SandboxRepositoryPage.limit` | `SandboxPageRequestDto.limit` | API / job input -> repository list | 不得由 config 或 fake 默认无限制扩展。 |
| `Page<T>.items` | `SandboxPagedResponseDto.items` | repository -> query / job report | 不得返回 domain-only object;必须映射到 view / item DTO。 |
| `Page<T>.next_cursor` | `SandboxPageInfoDto.next_cursor` | repository -> public cursor | 不得当 optimistic version 或 duplicate key。 |

### 10.3 query surface / projection marker schema

| DTO / enum | owner | 字段 / variant | 来源 | 缺失处理 |
|---|---|---|---|---|
| `SandboxQuerySurfaceStatus` | `contracts` | `Visible`;`Empty`;`NotVisible`;`Restricted`;`Stale`;`Degraded`;`Failed`;`Rebuilding`;`Disabled`;`MissingProjection`;`Unavailable` | query visibility / projection / repository / config adapter decision | 不得用 bool 或 `Result<(), Error>` 临时拼状态。 |
| `SandboxProjectionMarkerDto` | `contracts` | `projection_ref: Option<SandboxReadProjectionRef>`;`projection_status`;`freshness_status`;`source_cursor: Option<SandboxOpaqueRef>`;`degraded_markers` | `SandboxProjectionRepository`、`SandboxTruthSnapshotRepository`、projection rebuild snapshot | missing projection => `MissingProjection`,不创建 view ref。 |
| `SandboxQueryResponseDto<T>` | `contracts` | `surface_status`;`view: Option<T>`;`page_info: Option<SandboxPageInfoDto>`;`projection_marker`;`visibility_marker_ref: Option<SandboxOpaqueRef>`;`error: Option<SandboxPublicErrorDto>` | query service assembly | `NotVisible` / `Restricted` 时 view 必须 `None` 或 redacted view。 |

### 10.4 command result / stored result schema

| DTO / enum | owner | 字段 / variant | 来源 | replay 规则 |
|---|---|---|---|---|
| `SandboxCommandResultDto` | `contracts` | `operation_ref`;`command_kind`;`status`;`primary_ref`;`affected_refs`;`audit_trace_ref`;`relay_record_refs`;`stored_result_ref`;`error` | `SandboxCommandService` accepted / rejected path | accepted / rejected / failed path 均保存完整 public result。 |
| `SandboxCommandResultStatus` | `contracts` | `Accepted`;`Rejected`;`Pending`;`Degraded`;`Failed`;`DuplicateReplayed` | service outcome + stored result | duplicate 必须返回 stored result,不得重跑 mutation。 |
| `SandboxStoredOperationResultDto` | `contracts` | `stored_result_ref`;`result_kind`;`command_result?`;`consumer_receipt?`;`job_report?`;`created_at`;`request_digest` | Step 7 `SandboxStoredOperationResult` public projection | `DuplicateMissingResult` 不得重新执行。 |
| `SandboxAffectedRefSetDto` | `contracts` | `context_ref?`;`boundary_ref?`;`policy_ref?`;`run_ref?`;`capture_ref?`;`handoff_ref?`;`failure_ref?`;`cleanup_ref?`;`redline_ref?`;`projection_refs`;`relay_record_refs` | command / job side effect summary | 不得包含 raw external body ref。 |

### 10.5 event envelope / consumer receipt schema

| DTO / enum | owner | 字段 / variant | 来源 | 缺失处理 |
|---|---|---|---|---|
| `SandboxInboundEventEnvelopeDto<TPayload>` | `contracts` | `event_envelope_ref`;`source_event_ref`;`source_kind`;`source_ref`;`schema_version`;`dedup_key_ref`;`occurred_at`;`observed_at`;`trace_context`;`source_authority`;`payload_digest`;`forbidden_body_markers`;`payload` | worker entry adapter | 缺 event id/source/schema/dedup/digest => `Rejected` 或 `Quarantined`。 |
| `SandboxConsumerReceiptDto` | `contracts` | `receipt_ref`;`receipt_status`;`operation_ref`;`stored_result_ref`;`trace_record_ref: Option<SandboxOpaqueRef>`;`affected_reference_state_refs`;`affected_projection_refs`;`quarantine_marker_ref`;`delayed_until`;`error` | consumer service | reference-only accepted consumer 可 `trace_record_ref=None`,不得伪造 trace subject。 |
| `SandboxConsumerReceiptStatus` | `contracts` | `Accepted`;`Duplicate`;`Delayed`;`Rejected`;`Failed`;`Quarantined`;`NoOp` | consumer flow | duplicate 返回 stored receipt;delayed 不写核心 success。 |
| `SandboxOutboundEventEnvelopeDto<TPayload>` | `contracts` | `event_ref`;`event_kind`;`schema_version`;`source_truth_ref`;`source_cursor`;`payload_ref`;`occurred_at`;`trace_context`;`audit_trace_ref`;`producer_ref`;`payload` | relay record builder | source_cursor 来自 committed truth / reference marker cursor,不得用 page cursor / timestamp。 |

### 10.6 job input / report schema

| DTO / enum | owner | 字段 / variant | 来源 | replay 规则 |
|---|---|---|---|---|
| `SandboxJobInputDto<TSpec>` | `contracts` | `job_run_ref`;`job_kind`;`metadata`;`idempotency_key_ref`;`scope_ref`;`page_request`;`spec` | job entry adapter | duplicate digest 包含 job kind + scope + spec + page cursor。 |
| `SandboxJobReportDto` | `contracts` | `job_report_ref`;`job_kind`;`status`;`started_at`;`finished_at`;`processed_count`;`succeeded_refs`;`failed_refs`;`skipped_refs`;`degraded_refs`;`next_cursor`;`audit_trace_refs`;`stored_result_ref`;`error` | job report accumulator + stored result | duplicate 返回完整 stored report,不得重跑 job。 |
| `SandboxJobReportItemDto` | `contracts` | `target_ref`;`target_kind`;`item_status`;`result_ref`;`reason`;`trace_ref` | per-target job result | refs 必须来自 repository / port outcome,不得由 accumulator 私造。 |
| `SandboxJobReportStatus` | `contracts` | `Succeeded`;`PartialFailed`;`Failed`;`Skipped`;`Degraded`;`DuplicateReplayed` | job service | skipped / failed 也必须保存 report。 |

### 10.7 error schema

| DTO / enum | owner | 字段 / variant | 来源 | public 行为 |
|---|---|---|---|---|
| `SandboxPublicErrorDto` | `contracts` | `error_kind`;`safe_reason`;`retryable`;`source_ref: Option<SandboxOpaqueRef>`;`trace_ref`;`redaction_marker` | application error mapper | 不暴露 raw SQL / IO / HTTP / SDK body / panic / fake-only error。 |
| `SandboxPublicErrorKind` | `contracts` | `Validation`;`ReferenceUnresolved`;`ForbiddenExternalBody`;`NotAuthorized`;`NotVisible`;`VersionConflict`;`IdempotencyConflict`;`DuplicateMissingResult`;`BoundaryRejected`;`PolicyFailClosed`;`AdapterUnavailable`;`UnsupportedVersion`;`Quarantined`;`Disabled`;`NoWriteViolation`;`Internal` | Step 6 public error family + Step 7 application error | Step 12 可继续细分,但不得改名破坏 protocol。 |

---

## 11. Command 协议族

### 11.1 Command 定义批次表

| 协议 | 所属模块 | 目标对象 / result | 依赖 port | 后续 flow | 停审状态 |
|---|---|---|---|---|---|
| `OpenControlledExecutionContext` | `api` -> `application` | context / identity / resolution result | resolver、truth repo、id generator、stored result | intake flow | pass |
| `EstablishExecutionBoundary` | `api` -> `application` | boundary / decision / handle result | backend capability、isolation backend、truth repo、stored result | boundary flow | pass |
| `EvaluatePolicyExecution` | `api` -> `application` | policy snapshot / decision result | policy summary、truth repo、stored result | policy flow | pass |
| `StartControlledExecutionRun` | `worker` / `api` -> `application` | run result | isolation backend、truth repo、stored result | run flow | pass |
| `RecordCaptureResult` | `worker` -> `application` | capture / material result | capture port、truth repo、stored result | capture flow | pass |
| `OpenMaterialHandoff` | `api` / `worker` -> `application` | handoff / relay result | handoff / observability port、relay repo、stored result | handoff flow | pass |
| `SubmitSandboxControl` | `api` / `worker` -> `application` | control fact result | truth repo、idempotency、stored result | control flow | pass |
| `ClassifySandboxFailure` | `worker` / `jobs` -> `application` | failure classification result | truth repo、backend inspect、stored result | failure flow | pass |
| `EvaluateCleanupReadiness` | `jobs` / `api` -> `application` | cleanup guard result | truth repo、investigation handoff、stored result | cleanup flow | pass |
| `RecordRedlineContainment` | `worker` / `api` -> `application` | redline containment result | investigation handoff、truth repo、stored result | redline flow | pass |

### 11.2 `OpenControlledExecutionContext`

| 项 | 内容 |
|---|---|
| 函数签名 | `open_controlled_execution_context(OpenControlledExecutionContextRequestDto) -> ApplicationResult<SandboxCommandResultDto>` |
| 逻辑协议名 | `Command/OpenControlledExecutionContext` |
| 调用方 | sync entry、受控执行发起方、system intake |
| 处理方 | `SandboxCommandService::open_controlled_execution_context` |

| request 字段 | 类型 | 目标对象字段 | 字段来源 | 缺失处理 |
|---|---|---|---|---|
| `metadata` | `SandboxCommandMetadataDto` | operation / actor / idempotency | entry metadata | 缺 actor/scope/idempotency => `Validation`。 |
| `execution_source_refs` | `ExternalSourceRefSet` | `ControlledExecutionContext.source_refs`;`ContextReferenceResolution.source_refs` | caller body-free refs | 空或含 forbidden body => `ReferenceUnresolved` / `ForbiddenExternalBody`。 |
| `responsibility_context` | `ExecutionResponsibilityContext` | `ExecutionEnvironmentIdentity.responsibility_anchor` | caller / core-contracts actor/work refs | actor 不在 scope => `NotAuthorized`。 |
| `context_ref_summary_set` | `SafeSummaryRefSet` | `ExecutionContextResolution.safe_summary_refs` | caller / resolver output | 缺失可进入 `PendingResolution`;不得默认 accepted。 |
| `intake_guard_ref` | `SandboxOpaqueRef` | `ControlledExecutionIntakeGuard` 输入 | upstream gate summary | 缺失 => `Rejected` 或 `PendingResolution`。 |

| result 字段 | 类型 | 来源 |
|---|---|---|
| `primary_ref` | `ControlledExecutionContextRef` | id generator + saved context。 |
| `affected_refs.environment_identity_ref` | `ExecutionEnvironmentIdentityRef` | id generator + saved identity。 |
| `affected_refs.resolution_ref` | `ExecutionContextResolutionRef` | resolver / reference state。 |
| `status` | `Accepted` / `Rejected` / `Pending` / `Failed` | `ControlledExecutionIntakeStatus` 映射。 |
| `audit_trace_ref` | `SandboxOpaqueRef` | `SandboxAuditTraceRepository.append`。 |

构造闭环: 能构造 `ControlledExecutionContext`、`ExecutionEnvironmentIdentity`、`ExecutionContextResolution`;id、time、truth cursor 来自 Step 7 `SandboxIdGeneratorPort`、`SandboxClockPort`、UoW。duplicate replay 从 stored result 返回完整 result,不得重跑 resolver。

### 11.3 `EstablishExecutionBoundary`

| 项 | 内容 |
|---|---|
| 函数签名 | `establish_execution_boundary(EstablishExecutionBoundaryRequestDto) -> ApplicationResult<SandboxCommandResultDto>` |
| 逻辑协议名 | `Command/EstablishExecutionBoundary` |
| 调用方 | sync entry、system boundary coordinator |
| 处理方 | `SandboxCommandService::establish_execution_boundary` |

| request 字段 | 类型 | 目标对象字段 | 字段来源 | 缺失处理 |
|---|---|---|---|---|
| `metadata` | `SandboxCommandMetadataDto` | command context / idempotency | entry metadata | 缺失 => `Validation`。 |
| `context_ref` | `ControlledExecutionContextRef` | boundary parent context | prior command result / caller | missing truth => `ReferenceUnresolved`。 |
| `environment_identity_ref` | `ExecutionEnvironmentIdentityRef` | boundary identity binding | prior command result | mismatch => `BoundaryRejected`。 |
| `boundary_requirements` | `BoundaryRequirementSetDto` | resource / filesystem / network / process / workspace fields | caller explicit request constrained by validated boundary profile | missing / invalid dimension => `BoundaryRejected`。 |
| `backend_capability_summary_ref` | `BackendCapabilitySummaryRef` | `BoundaryEstablishmentDecision.backend_summary_ref` | capability port / request | stale / unsupported => pending or rejected, never allow。 |

| result 字段 | 类型 | 来源 |
|---|---|---|
| `primary_ref` | `CoherentBoundaryRef` | saved `CoherentBoundary` when established。 |
| `affected_refs.boundary_decision_ref` | `BoundaryEstablishmentDecisionRef` | domain decision factory。 |
| `affected_refs.handle_ref` | `IsolationEnvironmentHandleRef` | `IsolationBackendPort.establish_environment` outcome。 |
| `affected_refs.lease_ref` | `LeaseRecordRef` | lease seed if handle exists。 |
| `status` | `Accepted` / `Rejected` / `Pending` / `Failed` | `BoundaryDecisionStatus` 映射。 |

构造闭环: public request提供accepted context ref、matching identity ref、显式四维requirements和capability summary ref;application从runtime builder注入`BoundaryEstablishmentService`的`SandboxBoundaryProfileConfig`与`runtime_generation_ref`取得profile / template / LD-24 generation。上述输入能构造 `BoundaryRequirementSet`、`BoundaryEstablishmentDecision`、`CoherentBoundary`、`IsolationEnvironmentHandle`、`LeaseRecord`。Boundary request不含policy snapshot / decision、generation或caller-selected config ref;adapter outcome只能来自Step 7 `IsolationBackendAdapterOutcome`,不得解析raw SDK error。

### 11.4 `EvaluatePolicyExecution`

| 项 | 内容 |
|---|---|
| 函数签名 | `evaluate_policy_execution(EvaluatePolicyExecutionRequestDto) -> ApplicationResult<SandboxCommandResultDto>` |
| 逻辑协议名 | `Command/EvaluatePolicyExecution` |
| 调用方 | sync entry、system policy coordinator |
| 处理方 | `SandboxCommandService::evaluate_policy_execution` |

| request 字段 | 类型 | 目标对象字段 | 字段来源 | 缺失处理 |
|---|---|---|---|---|
| `metadata` | `SandboxCommandMetadataDto` | operation / actor / idempotency | entry metadata | 缺失 => `Validation`。 |
| `context_ref` | `ControlledExecutionContextRef` | policy parent context | prior context result | missing / not accepted => `PolicyFailClosed`。 |
| `boundary_requirement_ref` | `BoundaryRequirementSetRef` | policy scope input | boundary command / repository | missing => fail-closed。 |
| `policy_source_refs` | `ExternalSourceRefSet` | `PolicyApplicabilitySnapshot.policy_source_refs` | caller / policy summary port | empty => fail-closed or pending。 |
| `authorization_summary` | `SafeSummaryRefSet` | snapshot / decision source | upstream body-free summary | unsafe/missing => fail-closed。 |
| `high_risk_action_markers` | `Vec<HighRiskActionMarker>` | `HighRiskActionDecision` | policy / boundary classifier | unknown => blocked / pending。 |

| result 字段 | 类型 | 来源 |
|---|---|---|
| `primary_ref` | `PolicyExecutionDecisionRef` | saved `PolicyExecutionDecision`。 |
| `affected_refs.policy_snapshot_ref` | `PolicyApplicabilitySnapshotRef` | `PolicySummaryPort.load_policy_applicability`。 |
| `affected_refs.high_risk_action_refs` | `Vec<HighRiskActionDecisionRef>` | high-risk decision factory。 |
| `status` | `Accepted` / `Rejected` / `Pending` / `Failed` | `PolicyExecutionDecisionStatus` 映射;`FailClosed` maps rejected。 |

构造闭环: policy DTO 不保存 policy definition / approval body,只保存 refs / summaries。缺 policy summary 不得默认 allow。

### 11.5 `StartControlledExecutionRun`

| 项 | 内容 |
|---|---|
| 函数签名 | `start_controlled_execution_run(StartControlledExecutionRunRequestDto) -> ApplicationResult<SandboxCommandResultDto>` |
| 逻辑协议名 | `Command/StartControlledExecutionRun` |
| 调用方 | fulfillment entry、system run coordinator |
| 处理方 | `SandboxCommandService::start_controlled_execution_run` |

| request 字段 | 类型 | 目标对象字段 | 字段来源 | 缺失处理 |
|---|---|---|---|---|
| `metadata` | `SandboxCommandMetadataDto` | operation / actor / idempotency | entry metadata | 缺失 => `Validation`。 |
| `context_ref` | `ControlledExecutionContextRef` | `ControlledExecutionRun.context_ref` | prior context | non-accepted => `BoundaryRejected` or `PolicyFailClosed` mapping。 |
| `coherent_boundary_ref` | `CoherentBoundaryRef` | run boundary | boundary command result | missing/not established => `BoundaryRejected`。 |
| `handle_ref` | `IsolationEnvironmentHandleRef` | backend handle binding | boundary result;必须等于coherent boundary的handle ref | missing/mismatch/released/orphan或其persisted lease非Active /已过期 => backend call 0并映射`BoundaryRejected` / `AdapterUnavailable`。 |
| `policy_decision_ref` | `PolicyExecutionDecisionRef` | policy gate | policy command result | non-accepted => `PolicyFailClosed`。 |
| `launch_request_summary` | `SafeSummaryRefSet` | launch summary refs | runtime/tool safe summary | forbidden body => `ForbiddenExternalBody`。 |

| result 字段 | 类型 | 来源 |
|---|---|---|
| `primary_ref` | `ControlledExecutionRunRef` | id generator + saved run。 |
| `status` | `Accepted` / `Rejected` / `Failed` | `ControlledExecutionRunStatus` + backend outcome。 |
| `affected_refs.relay_record_refs` | `Vec<SandboxEventRelayRecordRef>` | run changed relay record if source truth committed。 |

构造闭环: application按coherent boundary -> exact handle -> exact persisted lease读取前序group,校验handle Active、lease Active且未过期,再结合Accepted policy构造run。Command 4不接收lease profile / window,不从current config重算lease;只承接launch intent,不执行tools semantic execution,不进入runtime agent loop。backend failure分类后进入failure flow,不伪装success。

### 11.6 `RecordCaptureResult`

| 项 | 内容 |
|---|---|
| 函数签名 | `record_capture_result(RecordCaptureResultRequestDto) -> ApplicationResult<SandboxCommandResultDto>` |
| 逻辑协议名 | `Command/RecordCaptureResult` |
| 调用方 | fulfillment entry、capture adapter coordinator |
| 处理方 | `SandboxCommandService::record_capture_result` |

| request 字段 | 类型 | 目标对象字段 | 字段来源 | 缺失处理 |
|---|---|---|---|---|
| `metadata` | `SandboxCommandMetadataDto` | operation / actor / idempotency | worker metadata | 缺失 => `Validation`。 |
| `run_ref` | `ControlledExecutionRunRef` | `CaptureFact.run_ref` | run truth | missing / not terminal-enough => `ReferenceUnresolved`。 |
| `execution_output_summary` | `SafeSummaryRefSet` | `CaptureFact.output_summary_refs` | capture adapter body-free output | raw body marker => `ForbiddenExternalBody`。 |
| `captured_material_refs` | `Vec<CapturedMaterialRefDto>` | `CapturedMaterialRef` | capture adapter | empty with complete status => `Validation`。 |
| `observability_material` | `ObservabilityMaterialDto` | `ObservabilityMaterial` | observability material port | missing may degrade but not erase capture fact。 |
| `capture_failure_reason` | `Option<SandboxReason>` | `CaptureFact.failure_reason` | capture adapter outcome | raw error string not allowed。 |

| result 字段 | 类型 | 来源 |
|---|---|---|
| `primary_ref` | `CaptureFactRef` | saved `CaptureFact`。 |
| `affected_refs.material_refs` | `Vec<CapturedMaterialRef>` | saved captured material refs。 |
| `affected_refs.observability_material_ref` | `Option<ObservabilityMaterialRef>` | observability handoff source。 |
| `status` | `Accepted` / `Degraded` / `Failed` | `CaptureStatus` 映射。 |

构造闭环: capture 不等于 artifact truth;partial / failed / unavailable 不能伪装 complete;handoff failure 不回滚 capture。

### 11.7 `OpenMaterialHandoff`

| 项 | 内容 |
|---|---|
| 函数签名 | `open_material_handoff(OpenMaterialHandoffRequestDto) -> ApplicationResult<SandboxCommandResultDto>` |
| 逻辑协议名 | `Command/OpenMaterialHandoff` |
| 调用方 | sync entry、fulfillment entry |
| 处理方 | `SandboxCommandService::open_material_handoff` |

| request 字段 | 类型 | 目标对象字段 | 字段来源 | 缺失处理 |
|---|---|---|---|---|
| `metadata` | `SandboxCommandMetadataDto` | operation / actor / idempotency | entry metadata | 缺失 => `Validation`。 |
| `capture_fact_ref` | `CaptureFactRef` | `HandoffFact.capture_ref` | capture result | missing / failed capture => rejected or degraded。 |
| `captured_material_refs` | `Vec<CapturedMaterialRef>` | `HandoffFact.material_refs` | capture fact | empty => `Validation` unless observability-only target。 |
| `observability_material_ref` | `Option<ObservabilityMaterialRef>` | observability handoff input | capture result | missing => skip observability handoff,not fake ref。 |
| `handoff_target_refs` | `Vec<HandoffTargetRefDto>` | `HandoffFact.target_refs` | caller / policy-safe summary | unknown target => rejected / pending,not default artifact。 |

| result 字段 | 类型 | 来源 |
|---|---|---|
| `primary_ref` | `HandoffFactRef` | saved `HandoffFact`。 |
| `affected_refs.relay_record_refs` | `Vec<SandboxEventRelayRecordRef>` | event relay records。 |
| `status` | `Accepted` / `Pending` / `Degraded` / `Failed` | `HandoffStatus` / adapter outcome。 |

构造闭环: handoff payload 只包含 material refs / targets / status,不宣布 artifact truth、runtime truth 或 observability store truth。

### 11.8 `SubmitSandboxControl`

| 项 | 内容 |
|---|---|
| 函数签名 | `submit_sandbox_control(SubmitSandboxControlRequestDto) -> ApplicationResult<SandboxCommandResultDto>` |
| 逻辑协议名 | `Command/SubmitSandboxControl` |
| 调用方 | sync entry、worker control consumer |
| 处理方 | `SandboxCommandService::submit_sandbox_control` |

| request 字段 | 类型 | 目标对象字段 | 字段来源 | 缺失处理 |
|---|---|---|---|---|
| `metadata` | `SandboxCommandMetadataDto` | operation / actor / idempotency | entry metadata | 缺失 => `Validation`。 |
| `context_ref` | `ControlledExecutionContextRef` | `ControlFact.context_ref` | caller / control event | missing => delayed/rejected。 |
| `control_kind` | `SandboxControlKind` | `ControlFact.control_kind` | request / event payload | unknown => rejected,not ignored。 |
| `control_source_context` | `ControlSourceContext` | `ControlFact.source_context` | caller / event source | raw reason body forbidden。 |
| `control_conflict_guard_ref` | `SandboxOpaqueRef` | conflict guard input | caller / system guard | missing => conflict / rejected。 |

| result 字段 | 类型 | 来源 |
|---|---|---|
| `primary_ref` | `ControlFactRef` | saved `ControlFact`。 |
| `affected_refs.failure_ref` | `Option<FailureClassificationRef>` | optional failure classification seed。 |
| `status` | `Accepted` / `Rejected` / `Failed` / `DuplicateReplayed` | `ControlFactStatus` 映射。 |

构造闭环: control 不执行业务 replay、不直接 runtime recover、不绕过 cleanup/redline guard。

### 11.9 `ClassifySandboxFailure`

| 项 | 内容 |
|---|---|
| 函数签名 | `classify_sandbox_failure(ClassifySandboxFailureRequestDto) -> ApplicationResult<SandboxCommandResultDto>` |
| 逻辑协议名 | `Command/ClassifySandboxFailure` |
| 调用方 | worker lifecycle consumer、maintenance job |
| 处理方 | `SandboxCommandService::classify_sandbox_failure` |

| request 字段 | 类型 | 目标对象字段 | 字段来源 | 缺失处理 |
|---|---|---|---|---|
| `metadata` | `SandboxCommandMetadataDto` | operation / actor / idempotency | worker / job metadata | 缺失 => `Validation`。 |
| `context_ref` | `ControlledExecutionContextRef` | `FailureClassification.context_ref` | truth / event | missing => delayed / rejected。 |
| `run_ref` | `Option<ControlledExecutionRunRef>` | run relation | lifecycle / truth | optional but mismatch => rejected。 |
| `failure_source_markers` | `Vec<SandboxOpaqueRef>` | failure source markers | policy/backend/capture/handoff/control | empty => pending input,not success。 |
| `policy_decision_ref` | `Option<PolicyExecutionDecisionRef>` | policy failure source | policy truth | non-accepted maps failure kind。 |
| `capture_fact_ref` | `Option<CaptureFactRef>` | capture failure source | capture truth | mismatch => rejected。 |

| result 字段 | 类型 | 来源 |
|---|---|---|
| `primary_ref` | `FailureClassificationRef` | saved `FailureClassification`。 |
| `status` | `Accepted` / `Pending` / `Failed` | `FailureClassificationStatus` 映射。 |
| `affected_refs.relay_record_refs` | `Vec<SandboxEventRelayRecordRef>` | failure changed relay record。 |

构造闭环: failure kind 使用 `SandboxFailureKind`;unknown 只能 pending/classified later,不得 success。

### 11.10 `EvaluateCleanupReadiness`

| 项 | 内容 |
|---|---|
| 函数签名 | `evaluate_cleanup_readiness(EvaluateCleanupReadinessRequestDto) -> ApplicationResult<SandboxCommandResultDto>` |
| 逻辑协议名 | `Command/EvaluateCleanupReadiness` |
| 调用方 | maintenance job、sync entry |
| 处理方 | `SandboxCommandService::evaluate_cleanup_readiness` |

| request 字段 | 类型 | 目标对象字段 | 字段来源 | 缺失处理 |
|---|---|---|---|---|
| `metadata` | `SandboxCommandMetadataDto` | operation / actor / idempotency | entry / job metadata | 缺失 => `Validation`。 |
| `context_ref` | `ControlledExecutionContextRef` | `CleanupGuard.context_ref` | truth | missing => rejected / degraded。 |
| `capture_fact_ref` | `CaptureFactRef` | cleanup evidence input | capture truth | missing => `PendingEvidence`。 |
| `handoff_fact_ref` | `HandoffFactRef` | handoff safety input | handoff truth | not delivered/dead-letter => blocked / pending。 |
| `investigation_handoff_summary` | `InvestigationHandoffSummary` | investigation gate | investigation handoff port / event | missing when required => pending investigation。 |
| `cleanup_safety_guard_ref` | `SandboxOpaqueRef` | guard source | system guard | missing => blocked。 |

| result 字段 | 类型 | 来源 |
|---|---|---|
| `primary_ref` | `CleanupGuardRef` | saved `CleanupGuard`。 |
| `status` | `Accepted` / `Pending` / `Rejected` | `CleanupGuardStatus` 映射。 |
| `affected_refs.projection_refs` | `Vec<SandboxReadProjectionRef>` | stale projection enumeration if guard changed。 |

构造闭环: cleanup allowed 不等于 backend release;Step 9/10 继续定义 release order。non-Allowed 不得 cleanup。

### 11.11 `RecordRedlineContainment`

| 项 | 内容 |
|---|---|
| 函数签名 | `record_redline_containment(RecordRedlineContainmentRequestDto) -> ApplicationResult<SandboxCommandResultDto>` |
| 逻辑协议名 | `Command/RecordRedlineContainment` |
| 调用方 | security entry、worker lifecycle consumer |
| 处理方 | `SandboxCommandService::record_redline_containment` |

| request 字段 | 类型 | 目标对象字段 | 字段来源 | 缺失处理 |
|---|---|---|---|---|
| `metadata` | `SandboxCommandMetadataDto` | operation / actor / idempotency | entry metadata | 缺失 => `Validation`。 |
| `context_ref` | `ControlledExecutionContextRef` | `RedlineContainment.context_ref` | truth / event | missing => quarantined / rejected。 |
| `coherent_boundary_ref` | `CoherentBoundaryRef` | boundary relation | boundary truth | mismatch => rejected。 |
| `redline_kind` | `RedlineKind` | `RedlineContainment.redline_kind` | detector / policy guard | `Other` requires safe reason。 |
| `redline_containment_guard_ref` | `SandboxOpaqueRef` | containment guard | detector / system gate | missing => `Detected` / handoff pending,not released。 |
| `investigation_handoff_summary` | `Option<InvestigationHandoffSummary>` | investigation handoff | investigation port / event | missing => handoff pending when required。 |

| result 字段 | 类型 | 来源 |
|---|---|---|
| `primary_ref` | `RedlineContainmentRef` | saved `RedlineContainment`。 |
| `status` | `Accepted` / `Pending` / `Failed` | `RedlineContainmentStatus` 映射。 |
| `affected_refs.failure_ref` | `Option<FailureClassificationRef>` | redline failure classification seed。 |

构造闭环: redline 不 advisory-only;release 必须经过 cleanup / investigation guard,不能由 query 或 config 解除。

### 11.12 Command 协议族停审记录

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| 每个 Command 是否有独立 request / result schema | 通过 | 无 unresolved。 |
| DTO 是否能构造或影响目标 Domain 对象 | 通过 | 具体 transition 顺序留给 Step 9/10。 |
| idempotency / stored result 是否闭合 | 通过 | Step 13 继续定义并发窗口和 digest canonicalization。 |
| actor / scope / trusted source 是否闭合 | 通过 | Command / Query 使用经校验的合法 core actor 并执行各自 authorization / visibility gate；worker/job P0 只接受 runtime 提供的非空 `ActorKind::System`；trusted source 只通过 consumer 的 `source_ref` 与 envelope / source gate 建立。 |
| 错误 / audit / relay refs 是否有来源 | 通过 | Step 12/15 继续细化 error taxonomy 和 observability。 |

---

## 12. Query 协议族

### 12.1 Query 定义批次表

| 协议 | 所属模块 | 目标 view / page | 依赖 port | 后续 flow | 停审状态 |
|---|---|---|---|---|---|
| `GetSandboxExecutionStatus` | `api` -> `application` | `SandboxExecutionStatusViewDto` | truth snapshot、projection repo | query flow | pass |
| `GetBoundaryStatus` | `api` -> `application` | `BoundaryStatusViewDto` | truth snapshot、projection repo | query flow | pass |
| `GetPolicyDecisionSummary` | `api` -> `application` | `PolicyDecisionSummaryViewDto` | truth snapshot | query flow | pass |
| `GetCaptureSummary` | `api` -> `application` | `CaptureSummaryViewDto` | truth snapshot、projection repo | query flow | pass |
| `GetMaterialHandoffStatus` | `api` -> `application` | `MaterialHandoffStatusViewDto` | truth snapshot、relay repo | query flow | pass |
| `GetFailureControlStatus` | `api` -> `application` | `FailureControlStatusViewDto` | truth snapshot | query flow | pass |
| `GetCleanupReadiness` | `api` -> `application` | `CleanupReadinessViewDto` | truth snapshot、projection repo | query flow | pass |
| `GetRedlineContainmentStatus` | `api` -> `application` | `RedlineContainmentViewDto` | truth snapshot | query flow | pass |
| `GetSandboxReadProjection` | `api` -> `application` | `SandboxReadProjectionDto` | projection repo | query flow | pass |
| `GetDerivedInspectPreviewTrend` | `api` -> `application` | `DerivedInspectPreviewTrendViewDto` | derived repo | query flow | pass |
| `GetBackendCapabilityComparison` | `api` -> `application` | `BackendCapabilityComparisonViewDto` | derived repo、capability port snapshot | query flow | pass |
| `GetSandboxReconciliationReport` | `api` -> `application` | `SandboxReconciliationReportDto` | derived repo | query flow | pass |
| `GetSandboxAuditTrace` | `api` -> `application` | `SandboxAuditTraceItemDto` page | audit repo | query flow | pass |

Query 通用规则:

| 规则 | 结论 |
|---|---|
| request 通用字段 | `metadata: SandboxQueryMetadataDto` + typed selector refs;pagination 只放 `metadata.page_request`。 |
| response 通用字段 | `SandboxQueryResponseDto<T>` 或 `SandboxPagedResponseDto<T>`。 |
| no-write | Query service 不调用 write UoW、不刷新 refs、不重建 projection、不触发 handoff/cleanup/redline。 |
| visibility | `NotVisible` / `Restricted` 来源于 actor scope + resolver / policy-safe summary,不得由 query 从 ref 字符串推导。 |
| empty | empty 仍返回 `surface_status=Empty` 和 page-level visibility marker。 |
| stale / rebuilding / missing | 由 projection / derived status marker 给出,不得创建临时 projection ref。 |

### 12.2 `GetSandboxExecutionStatus`

| 项 | 内容 |
|---|---|
| 函数签名 | `get_sandbox_execution_status(GetSandboxExecutionStatusRequestDto) -> ApplicationResult<SandboxQueryResponseDto<SandboxExecutionStatusViewDto>>` |
| 逻辑协议名 | `Query/GetSandboxExecutionStatus` |
| 调用方 | sync entry |
| 处理方 | `SandboxQueryService::get_status` |

| request 字段 | 类型 | 来源 | 缺失处理 |
|---|---|---|---|
| `metadata` | `SandboxQueryMetadataDto` | entry metadata | `Validation`。 |
| `context_ref` | `ControlledExecutionContextRef` | command result / caller | missing => `MissingProjection` or `Unavailable` after lookup。 |

| view 字段 | 类型 | 字段来源 | empty / not visible / degraded 口径 |
|---|---|---|---|
| `view_ref` | `SandboxOpaqueRef` | projection store or query assembly | missing projection => `MissingProjection`。 |
| `context_ref` | `ControlledExecutionContextRef` | truth snapshot / projection | not visible => redacted / none。 |
| `intake_status` | `ControlledExecutionIntakeStatus` | `ControlledExecutionContext` | stale marker if projection stale。 |
| `environment_identity_ref` | `Option<ExecutionEnvironmentIdentityRef>` | identity truth | missing => `Degraded`。 |
| `boundary_status` | `Option<BoundaryDecisionStatus>` | boundary decision | not started => `None`,not degraded。 |
| `policy_status` | `Option<PolicyExecutionDecisionStatus>` | policy decision | not started => `None`。 |
| `run_status` | `Option<ControlledExecutionRunStatus>` | run truth | missing with run ref => `Degraded`。 |
| `cleanup_status` | `Option<CleanupGuardStatus>` | cleanup guard | missing allowed。 |
| `redline_status` | `Option<RedlineContainmentStatus>` | redline truth | missing allowed。 |

### 12.3 `GetBoundaryStatus`

| 项 | 内容 |
|---|---|
| 函数签名 | `get_boundary_status(GetBoundaryStatusRequestDto) -> ApplicationResult<SandboxQueryResponseDto<BoundaryStatusViewDto>>` |
| 逻辑协议名 | `Query/GetBoundaryStatus` |
| 调用方 | sync entry |
| 处理方 | `SandboxQueryService::get_status` |

| request 字段 | 类型 | 来源 | 缺失处理 |
|---|---|---|---|
| `metadata` | `SandboxQueryMetadataDto` | entry metadata | `Validation`。 |
| `context_ref` | `Option<ControlledExecutionContextRef>` | caller | one selector required。 |
| `boundary_ref` | `Option<CoherentBoundaryRef>` | caller / command result | one selector required。 |

| view 字段 | 类型 | 字段来源 | surface |
|---|---|---|---|
| `boundary_ref` | `Option<CoherentBoundaryRef>` | boundary truth | missing => `MissingProjection` / `Empty` by selector。 |
| `decision_ref` | `Option<BoundaryEstablishmentDecisionRef>` | decision truth | absent if not evaluated。 |
| `requirement_set_ref` | `Option<BoundaryRequirementSetRef>` | boundary requirement truth | absent => `Degraded` only when decision exists。 |
| `decision_status` | `Option<BoundaryDecisionStatus>` | decision truth | `PendingCapability` may surface stale。 |
| `backend_capability_summary_ref` | `Option<BackendCapabilitySummaryRef>` | capability snapshot | stale => `Stale`。 |
| `handle_ref` | `Option<IsolationEnvironmentHandleRef>` | backend outcome truth | missing with established => `Degraded`。 |
| `lease_ref` | `Option<LeaseRecordRef>` | lease truth | missing with handle => `Degraded`。 |

### 12.4 `GetPolicyDecisionSummary`

| 项 | 内容 |
|---|---|
| 函数签名 | `get_policy_decision_summary(GetPolicyDecisionSummaryRequestDto) -> ApplicationResult<SandboxQueryResponseDto<PolicyDecisionSummaryViewDto>>` |
| 逻辑协议名 | `Query/GetPolicyDecisionSummary` |
| 调用方 | sync entry |
| 处理方 | `SandboxQueryService::get_status` |

| request 字段 | 类型 | 来源 | 缺失处理 |
|---|---|---|---|
| `metadata` | `SandboxQueryMetadataDto` | entry metadata | `Validation`。 |
| `context_ref` | `Option<ControlledExecutionContextRef>` | caller | one selector required。 |
| `policy_decision_ref` | `Option<PolicyExecutionDecisionRef>` | command result | one selector required。 |

| view 字段 | 类型 | 字段来源 | surface |
|---|---|---|---|
| `policy_decision_ref` | `Option<PolicyExecutionDecisionRef>` | policy truth | missing => `Empty` / `MissingProjection`。 |
| `policy_snapshot_ref` | `Option<PolicyApplicabilitySnapshotRef>` | snapshot truth | missing with decision => `Degraded`。 |
| `decision_status` | `PolicyExecutionDecisionStatus` | decision truth | fail-closed visible as rejected。 |
| `high_risk_action_refs` | `Vec<HighRiskActionDecisionRef>` | high-risk truth | empty allowed。 |
| `fail_closed_marker_ref` | `Option<SandboxOpaqueRef>` | fail-closed guard | absent unless fail-closed。 |

### 12.5 `GetCaptureSummary`

| 项 | 内容 |
|---|---|
| 函数签名 | `get_capture_summary(GetCaptureSummaryRequestDto) -> ApplicationResult<SandboxQueryResponseDto<CaptureSummaryViewDto>>` |
| 逻辑协议名 | `Query/GetCaptureSummary` |
| 调用方 | sync entry |
| 处理方 | `SandboxQueryService::get_status` |

| request 字段 | 类型 | 来源 | 缺失处理 |
|---|---|---|---|
| `metadata` | `SandboxQueryMetadataDto` | entry metadata | `Validation`。 |
| `run_ref` | `Option<ControlledExecutionRunRef>` | caller | one selector required。 |
| `capture_fact_ref` | `Option<CaptureFactRef>` | command result | one selector required。 |

| view 字段 | 类型 | 字段来源 | surface |
|---|---|---|---|
| `capture_fact_ref` | `Option<CaptureFactRef>` | capture truth | absent => `Empty` if run has no capture。 |
| `run_ref` | `ControlledExecutionRunRef` | capture / selector | mismatch => `Degraded`。 |
| `capture_status` | `CaptureStatus` | capture truth | partial/failed/unavailable as visible status。 |
| `material_refs` | `Vec<CapturedMaterialRef>` | capture truth | body-free only;no artifact body。 |
| `observability_material_ref` | `Option<ObservabilityMaterialRef>` | capture truth | missing can be `Degraded` if expected。 |
| `capture_failure_reason` | `Option<SandboxReason>` | safe reason | raw adapter error forbidden。 |

### 12.6 `GetMaterialHandoffStatus`

| 项 | 内容 |
|---|---|
| 函数签名 | `get_material_handoff_status(GetMaterialHandoffStatusRequestDto) -> ApplicationResult<SandboxQueryResponseDto<MaterialHandoffStatusViewDto>>` |
| 逻辑协议名 | `Query/GetMaterialHandoffStatus` |
| 调用方 | sync entry |
| 处理方 | `SandboxQueryService::get_status` |

| request 字段 | 类型 | 来源 | 缺失处理 |
|---|---|---|---|
| `metadata` | `SandboxQueryMetadataDto` | entry metadata | `Validation`。 |
| `context_ref` | `Option<ControlledExecutionContextRef>` | caller | selector。 |
| `handoff_fact_ref` | `Option<HandoffFactRef>` | command result | selector。 |

| view 字段 | 类型 | 字段来源 | surface |
|---|---|---|---|
| `handoff_fact_ref` | `Option<HandoffFactRef>` | handoff truth | absent => `Empty`。 |
| `capture_fact_ref` | `Option<CaptureFactRef>` | handoff truth | missing relation => `Degraded`。 |
| `target_refs` | `Vec<HandoffTargetRefDto>` | handoff truth | body-free target refs only。 |
| `handoff_status` | `HandoffStatus` | handoff truth / feedback | delivered/retryable/failed visible。 |
| `relay_record_refs` | `Vec<SandboxEventRelayRecordRef>` | relay repository | stale relay => `Stale`。 |

### 12.7 `GetFailureControlStatus`

| 项 | 内容 |
|---|---|
| 函数签名 | `get_failure_control_status(GetFailureControlStatusRequestDto) -> ApplicationResult<SandboxQueryResponseDto<FailureControlStatusViewDto>>` |
| 逻辑协议名 | `Query/GetFailureControlStatus` |
| 调用方 | sync entry |
| 处理方 | `SandboxQueryService::get_status` |

| request 字段 | 类型 | 来源 | 缺失处理 |
|---|---|---|---|
| `metadata` | `SandboxQueryMetadataDto` | entry metadata | `Validation`。 |
| `context_ref` | `Option<ControlledExecutionContextRef>` | caller | selector。 |
| `failure_ref` | `Option<FailureClassificationRef>` | command result | selector。 |

| view 字段 | 类型 | 字段来源 | surface |
|---|---|---|---|
| `failure_ref` | `Option<FailureClassificationRef>` | failure truth | absent => `Empty`。 |
| `failure_kind` | `Option<SandboxFailureKind>` | failure truth | unknown => visible unknown,not success。 |
| `failure_status` | `Option<FailureClassificationStatus>` | failure truth | pending visible。 |
| `control_fact_refs` | `Vec<ControlFactRef>` | control truth list | empty allowed。 |
| `latest_control_status` | `Option<ControlFactStatus>` | latest control truth | conflict visible。 |
| `lease_status` | `Option<LeaseStatus>` | lease truth | orphan suspected visible。 |

### 12.8 `GetCleanupReadiness`

| 项 | 内容 |
|---|---|
| 函数签名 | `get_cleanup_readiness(GetCleanupReadinessRequestDto) -> ApplicationResult<SandboxQueryResponseDto<CleanupReadinessViewDto>>` |
| 逻辑协议名 | `Query/GetCleanupReadiness` |
| 调用方 | sync entry |
| 处理方 | `SandboxQueryService::get_status` |

| request 字段 | 类型 | 来源 | 缺失处理 |
|---|---|---|---|
| `metadata` | `SandboxQueryMetadataDto` | entry metadata | `Validation`。 |
| `context_ref` | `Option<ControlledExecutionContextRef>` | caller | selector。 |
| `cleanup_guard_ref` | `Option<CleanupGuardRef>` | command result | selector。 |

| view 字段 | 类型 | 字段来源 | surface |
|---|---|---|---|
| `cleanup_guard_ref` | `Option<CleanupGuardRef>` | cleanup truth | absent => `Empty`。 |
| `cleanup_status` | `CleanupGuardStatus` | cleanup truth | pending/block/allowed visible。 |
| `blocking_reason_refs` | `Vec<SandboxOpaqueRef>` | cleanup guard / handoff / investigation | no raw reason body。 |
| `capture_fact_ref` | `Option<CaptureFactRef>` | cleanup input | missing evidence => `Stale` or pending。 |
| `handoff_fact_ref` | `Option<HandoffFactRef>` | cleanup input | pending handoff visible。 |
| `investigation_handoff_ref` | `Option<SandboxOpaqueRef>` | investigation summary | missing required => pending investigation。 |

### 12.9 `GetRedlineContainmentStatus`

| 项 | 内容 |
|---|---|
| 函数签名 | `get_redline_containment_status(GetRedlineContainmentStatusRequestDto) -> ApplicationResult<SandboxQueryResponseDto<RedlineContainmentViewDto>>` |
| 逻辑协议名 | `Query/GetRedlineContainmentStatus` |
| 调用方 | sync entry |
| 处理方 | `SandboxQueryService::get_status` |

| request 字段 | 类型 | 来源 | 缺失处理 |
|---|---|---|---|
| `metadata` | `SandboxQueryMetadataDto` | entry metadata | `Validation`。 |
| `context_ref` | `Option<ControlledExecutionContextRef>` | caller | selector。 |
| `redline_containment_ref` | `Option<RedlineContainmentRef>` | command result | selector。 |

| view 字段 | 类型 | 字段来源 | surface |
|---|---|---|---|
| `redline_containment_ref` | `Option<RedlineContainmentRef>` | redline truth | absent => `Empty` only if no redline。 |
| `redline_kind` | `Option<RedlineKind>` | redline truth | other requires safe reason。 |
| `containment_status` | `RedlineContainmentStatus` | redline truth | detected/contained/handoff pending/released/terminal visible。 |
| `boundary_ref` | `Option<CoherentBoundaryRef>` | redline truth | mismatch => `Degraded`。 |
| `investigation_handoff_summary` | `Option<InvestigationHandoffSummary>` | investigation port/event | missing when required => `Degraded`。 |

### 12.10 `GetSandboxReadProjection`

| 项 | 内容 |
|---|---|
| 函数签名 | `get_sandbox_read_projection(GetSandboxReadProjectionRequestDto) -> ApplicationResult<SandboxQueryResponseDto<SandboxReadProjectionDto>>` |
| 逻辑协议名 | `Query/GetSandboxReadProjection` |
| 调用方 | sync entry |
| 处理方 | `SandboxQueryService::get_read_projection` |

| request 字段 | 类型 | 来源 | 缺失处理 |
|---|---|---|---|
| `metadata` | `SandboxQueryMetadataDto` | entry metadata | `Validation`。 |
| `projection_ref` | `Option<SandboxReadProjectionRef>` | caller / previous response | selector。 |
| `context_ref` | `Option<ControlledExecutionContextRef>` | caller | index lookup source;missing lookup => `MissingProjection`。 |

| view 字段 | 类型 | 字段来源 | surface |
|---|---|---|---|
| `projection_ref` | `SandboxReadProjectionRef` | projection repository | missing => `MissingProjection`。 |
| `context_ref` | `ControlledExecutionContextRef` | projection body-free input | mismatch => `Degraded`。 |
| `projection_status` | `SandboxProjectionStatus` | projection repository | stale/rebuilding/degraded/unavailable visible。 |
| `execution_status` | `SandboxExecutionStatusViewDto` | projection view fields | not direct domain object。 |
| `source_cursor` | `Option<SandboxOpaqueRef>` | committed truth cursor | not page cursor。 |

### 12.11 `GetDerivedInspectPreviewTrend`

| 项 | 内容 |
|---|---|
| 函数签名 | `get_derived_inspect_preview_trend(GetDerivedInspectPreviewTrendRequestDto) -> ApplicationResult<SandboxQueryResponseDto<DerivedInspectPreviewTrendViewDto>>` |
| 逻辑协议名 | `Query/GetDerivedInspectPreviewTrend` |
| 调用方 | sync entry |
| 处理方 | `SandboxQueryService::get_read_projection` |

| request 字段 | 类型 | 来源 | 缺失处理 |
|---|---|---|---|
| `metadata` | `SandboxQueryMetadataDto` | entry metadata | `Validation`。 |
| `scope_ref` | `SandboxOpaqueRef` | caller / projection scope | missing => `Validation`。 |
| `source_refs` | `DerivedSourceRefSet` | caller optional filter | invalid/mismatch => `Validation`。 |

| view 字段 | 类型 | 字段来源 | surface |
|---|---|---|---|
| `derived_state_ref` | `Option<DerivedInspectPreviewTrendStateRef>` | derived repository | missing => `Empty` or `MissingProjection`。 |
| `freshness_status` | `DerivedFreshnessStatus` | derived state | stale/rebuilding/failed/unavailable visible。 |
| `derived_kind` | `DerivedMaterialKind` | derived state | inspect/preview/trend only。 |
| `source_refs` | `DerivedSourceRefSet` | derived state | no body。 |
| `failure_summary` | `Option<DerivedFailureSummary>` | derived state | safe reason only。 |

### 12.12 `GetBackendCapabilityComparison`

| 项 | 内容 |
|---|---|
| 函数签名 | `get_backend_capability_comparison(GetBackendCapabilityComparisonRequestDto) -> ApplicationResult<SandboxQueryResponseDto<BackendCapabilityComparisonViewDto>>` |
| 逻辑协议名 | `Query/GetBackendCapabilityComparison` |
| 调用方 | sync entry |
| 处理方 | `SandboxQueryService::get_read_projection` |

| request 字段 | 类型 | 来源 | 缺失处理 |
|---|---|---|---|
| `metadata` | `SandboxQueryMetadataDto` | entry metadata | `Validation`。 |
| `scope_ref` | `SandboxOpaqueRef` | caller / backend summary scope | missing => `Validation`。 |
| `backend_profile_refs` | `Vec<SandboxOpaqueRef>` | caller / config summary refs | empty => `Empty`,not default all backends unless configured by selector。 |

| view 字段 | 类型 | 字段来源 | surface |
|---|---|---|---|
| `comparison_ref` | `SandboxOpaqueRef` | derived repository | missing => `MissingProjection`。 |
| `backend_capability_summary_refs` | `Vec<BackendCapabilitySummaryRef>` | capability snapshots | stale => `Stale`。 |
| `unsupported_limit_kinds` | `Vec<BoundaryLimitKind>` | capability comparison builder | no backend product details。 |
| `comparison_status` | `DerivedFreshnessStatus` | derived state | failed/degraded visible。 |

### 12.13 `GetSandboxReconciliationReport`

| 项 | 内容 |
|---|---|
| 函数签名 | `get_sandbox_reconciliation_report(GetSandboxReconciliationReportRequestDto) -> ApplicationResult<SandboxQueryResponseDto<SandboxReconciliationReportDto>>` |
| 逻辑协议名 | `Query/GetSandboxReconciliationReport` |
| 调用方 | sync entry |
| 处理方 | `SandboxQueryService::get_read_projection` |

| request 字段 | 类型 | 来源 | 缺失处理 |
|---|---|---|---|
| `metadata` | `SandboxQueryMetadataDto` | entry metadata | `Validation`。 |
| `report_ref` | `Option<SandboxOpaqueRef>` | previous job report | selector。 |
| `scope_ref` | `Option<SandboxOpaqueRef>` | caller | selector。 |

| view 字段 | 类型 | 字段来源 | surface |
|---|---|---|---|
| `report_ref` | `SandboxOpaqueRef` | derived repository | missing => `Empty` / `MissingProjection`。 |
| `scope_ref` | `SandboxOpaqueRef` | report truth | mismatch => `Degraded`。 |
| `report_status` | `ReconciliationReportStatus` | report object | clean/issues/degraded/failed visible。 |
| `finding_refs` | `Vec<SandboxOpaqueRef>` | report object | refs only,not finding bodies。 |
| `generated_at` | `SandboxInstant` | job clock | missing => `Degraded`。 |

### 12.14 `GetSandboxAuditTrace`

| 项 | 内容 |
|---|---|
| 函数签名 | `get_sandbox_audit_trace(GetSandboxAuditTraceRequestDto) -> ApplicationResult<SandboxPagedResponseDto<SandboxAuditTraceItemDto>>` |
| 逻辑协议名 | `Query/GetSandboxAuditTrace` |
| 调用方 | sync entry |
| 处理方 | `SandboxQueryService::get_audit_trace` |

| request 字段 | 类型 | 来源 | 缺失处理 |
|---|---|---|---|
| `metadata` | `SandboxQueryMetadataDto` | entry metadata incl. page request | `Validation`。 |
| `subject_ref` | `SandboxOpaqueRef` | caller / previous result | missing => `Validation`。 |
| `trace_kind_filter` | `Option<SandboxTraceKind>` | caller | unknown => `Validation`。 |

| item 字段 | 类型 | 字段来源 | surface |
|---|---|---|---|
| `trace_ref` | `SandboxOpaqueRef` | audit repository | empty page => `Empty` with page_info。 |
| `trace_kind` | `SandboxTraceKind` | audit record | no raw body。 |
| `subject_ref` | `SandboxOpaqueRef` | audit subject mapper | not from string parsing in query。 |
| `operation_ref` | `SandboxOpaqueRef` | command / consumer / job operation | missing => `Degraded` item marker。 |
| `occurred_at` | `SandboxInstant` | clock at append | stable sorting source。 |
| `source_cursor` | `Option<SandboxOpaqueRef>` | truth/reference cursor | not page cursor。 |

### 12.15 Query 协议族停审记录

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| 每个 Query 是否有 request DTO | 通过 | 无 unresolved。 |
| 每个 Query 是否有 response view / page / marker schema | 通过 | `GetSandboxAuditTrace` 使用 paged item DTO;其余使用 `SandboxQueryResponseDto<T>`。 |
| empty / not visible / stale / failed / rebuilding / disabled / missing projection 是否可测试 | 通过 | Step 16 写测试切口。 |
| public view 是否直接依赖 domain-only type | 未发现 | 状态 / kind / ref 均来自 Step 6 contracts shared carrier。 |
| Query 是否保持 no-write | 通过 | Step 9 必须验证不 begin write UoW。 |

---

## 13. Inbound Event Consumer 协议族

### 13.1 Inbound Event Consumer 定义批次表

| 协议 | 所属模块 | typed payload | 依赖 port | 后续 flow | 停审状态 |
|---|---|---|---|---|---|
| `ConsumeCallerContextReferenceChanged` | `worker` -> `application` | `CallerContextReferenceChangedPayloadDto` | resolver、reference state repo、projection repo | reference flow | pass |
| `ConsumePolicySummaryChanged` | `worker` -> `application` | `PolicySummaryChangedPayloadDto` | policy summary port、reference state repo | policy reference flow | pass |
| `ConsumeBackendCapabilitySummaryChanged` | `worker` -> `application` | `BackendCapabilitySummaryChangedPayloadDto` | backend capability port、reference state repo | capability flow | pass |
| `ConsumeIsolationBackendLifecycleSignal` | `worker` -> `application` | `IsolationBackendLifecycleSignalPayloadDto` | lifecycle inspect、truth repo | lifecycle flow | pass |
| `ConsumeMaterialHandoffStatusChanged` | `worker` -> `application` | `MaterialHandoffStatusChangedPayloadDto` | handoff repo / truth repo | handoff feedback flow | pass |
| `ConsumeObservabilityHandoffStatusChanged` | `worker` -> `application` | `ObservabilityHandoffStatusChangedPayloadDto` | observability handoff port / truth repo | observability feedback flow | pass |
| `ConsumeSandboxControlRequested` | `worker` -> `application` | `SandboxControlRequestedPayloadDto` | truth repo、stored result | control flow | pass |
| `ConsumeInvestigationHandoffStatusChanged` | `worker` -> `application` | `InvestigationHandoffStatusChangedPayloadDto` | investigation handoff port / truth repo | investigation flow | pass |
| `ConsumeSandboxTruthRelayFeedback` | `worker` -> `application` | `SandboxTruthRelayFeedbackPayloadDto` | relay repo、publisher feedback | relay feedback flow | pass |

Inbound 通用规则:

| 规则 | 结论 |
|---|---|
| envelope | 必须使用 `SandboxInboundEventEnvelopeDto<TPayload>`。 |
| payload | 不重复 envelope 的 `event_envelope_ref/source_event_ref/source_ref/schema_version/dedup_key/occurred_at/trace_ref`。 |
| authority | 默认 `TrustedSource` 或 `Integration`;仍需 source kind allow、schema version、digest、forbidden body、dedup 和 state gate。 |
| receipt | 所有 consumer 返回 `SandboxConsumerReceiptDto`;accepted / duplicate / delayed / rejected / failed / quarantined / no-op 都保存 typed stored result。 |
| 核心 truth | reference / handoff / control / marker 可写;consumer 不得直接伪造 context accepted、policy accepted、artifact truth 或 observability stored。 |

### 13.2 `ConsumeCallerContextReferenceChanged`

| 项 | 内容 |
|---|---|
| 函数签名 | `consume_caller_context_reference_changed(SandboxInboundEventEnvelopeDto<CallerContextReferenceChangedPayloadDto>) -> ApplicationResult<SandboxConsumerReceiptDto>` |
| 逻辑协议名 | `InboundEvent/CallerContextReferenceChanged` |
| 发布方 | identity / work / tool / runtime reference source |
| 处理方 | `SandboxConsumerService::consume_reference_event` |

| payload 字段 | 类型 | 目标对象 / marker | 缺失处理 |
|---|---|---|---|
| `changed_external_refs` | `ExternalSourceRefSet` | `ReferenceResolutionState` bundle key | empty => `NoOp`。 |
| `change_kind_ref` | `SandboxOpaqueRef` | reference refresh reason | missing => `Delayed`。 |
| `safe_summary_refs` | `SafeSummaryRefSet` | body-free reference snapshot | forbidden body => `Quarantined`。 |
| `reference_version_ref` | `Option<SandboxOpaqueRef>` | reference state source version | missing allowed but marks stale。 |

receipt: accepted 写 reference state / stale projection markers;duplicate 返回 stored receipt;reference-only flow 若无正式 trace subject,`trace_record_ref=None`。

### 13.3 `ConsumePolicySummaryChanged`

| 项 | 内容 |
|---|---|
| 函数签名 | `consume_policy_summary_changed(SandboxInboundEventEnvelopeDto<PolicySummaryChangedPayloadDto>) -> ApplicationResult<SandboxConsumerReceiptDto>` |
| 逻辑协议名 | `InboundEvent/PolicySummaryChanged` |
| 发布方 | policy / authorization source |
| 处理方 | `SandboxConsumerService::consume_reference_event` |

| payload 字段 | 类型 | 目标对象 / marker | 缺失处理 |
|---|---|---|---|
| `policy_source_refs` | `ExternalSourceRefSet` | policy reference state | empty => `Rejected`。 |
| `affected_context_refs` | `Vec<ControlledExecutionContextRef>` | projection stale enumeration seed | empty => reference-only accepted。 |
| `applicability_status` | `PolicyApplicabilityStatus` | policy snapshot marker | missing / unsupported version => `Delayed`。 |
| `safe_summary_refs` | `SafeSummaryRefSet` | body-free policy summary | forbidden body => `Quarantined`。 |

receipt: stale markers use UoW reference marker cursor,not source version / dedup key;consumer cannot change existing policy decisions to accepted.

### 13.4 `ConsumeBackendCapabilitySummaryChanged`

| 项 | 内容 |
|---|---|
| 函数签名 | `consume_backend_capability_summary_changed(SandboxInboundEventEnvelopeDto<BackendCapabilitySummaryChangedPayloadDto>) -> ApplicationResult<SandboxConsumerReceiptDto>` |
| 逻辑协议名 | `InboundEvent/BackendCapabilitySummaryChanged` |
| 发布方 | backend capability source |
| 处理方 | `SandboxConsumerService::consume_reference_event` |

| payload 字段 | 类型 | 目标对象 / marker | 缺失处理 |
|---|---|---|---|
| `backend_profile_ref` | `SandboxOpaqueRef` | capability bundle key | missing => `Rejected`。 |
| `capability_summary_ref` | `BackendCapabilitySummaryRef` | capability reference state | missing => `Delayed`。 |
| `boundary_limit_kinds` | `Vec<BoundaryLimitKind>` | affected boundary dimensions | empty allowed。 |
| `capability_status_ref` | `SandboxOpaqueRef` | capability freshness marker | missing => stale。 |

receipt: may mark affected boundary projections stale;does not establish boundary or launch run.

### 13.5 `ConsumeIsolationBackendLifecycleSignal`

| 项 | 内容 |
|---|---|
| 函数签名 | `consume_isolation_backend_lifecycle_signal(SandboxInboundEventEnvelopeDto<IsolationBackendLifecycleSignalPayloadDto>) -> ApplicationResult<SandboxConsumerReceiptDto>` |
| 逻辑协议名 | `InboundEvent/IsolationBackendLifecycleSignal` |
| 发布方 | isolation backend source |
| 处理方 | `SandboxConsumerService::consume_lifecycle_event` |

| payload 字段 | 类型 | 目标对象 / marker | 缺失处理 |
|---|---|---|---|
| `handle_ref` | `IsolationEnvironmentHandleRef` | handle lifecycle relation | missing => `Rejected`。 |
| `backend_profile_ref` | `SandboxOpaqueRef` | backend lifecycle summary | missing => `Delayed`。 |
| `lifecycle_status_ref` | `SandboxOpaqueRef` | `BackendLifecycleSummary.lifecycle_status_ref` | missing => `Delayed`。 |
| `lease_ref` | `Option<LeaseRecordRef>` | lease / orphan relation | missing may trigger inspect。 |
| `safe_reason` | `Option<SandboxReason>` | failure / orphan reason | raw diagnostic forbidden。 |

receipt: may create lifecycle marker,orphan recovery marker,or failure classification input;does not directly release cleanup guard.

### 13.6 `ConsumeMaterialHandoffStatusChanged`

| 项 | 内容 |
|---|---|
| 函数签名 | `consume_material_handoff_status_changed(SandboxInboundEventEnvelopeDto<MaterialHandoffStatusChangedPayloadDto>) -> ApplicationResult<SandboxConsumerReceiptDto>` |
| 逻辑协议名 | `InboundEvent/MaterialHandoffStatusChanged` |
| 发布方 | material handoff target |
| 处理方 | `SandboxConsumerService::consume_handoff_event` |

| payload 字段 | 类型 | 目标对象 / marker | 缺失处理 |
|---|---|---|---|
| `handoff_fact_ref` | `HandoffFactRef` | handoff truth update | missing => `Rejected`。 |
| `target_refs` | `Vec<HandoffTargetRefDto>` | handoff target match | mismatch => `Quarantined`。 |
| `handoff_status` | `HandoffStatus` | handoff status transition | missing => `Delayed`。 |
| `delivery_marker_ref` | `Option<SandboxOpaqueRef>` | delivered / retry marker | missing allowed for failed。 |
| `safe_reason` | `Option<SandboxReason>` | failure reason | raw body forbidden。 |

receipt: delivered/retryable/failed updates handoff state only;failure does not rollback capture truth.

### 13.7 `ConsumeObservabilityHandoffStatusChanged`

| 项 | 内容 |
|---|---|
| 函数签名 | `consume_observability_handoff_status_changed(SandboxInboundEventEnvelopeDto<ObservabilityHandoffStatusChangedPayloadDto>) -> ApplicationResult<SandboxConsumerReceiptDto>` |
| 逻辑协议名 | `InboundEvent/ObservabilityHandoffStatusChanged` |
| 发布方 | observability handoff target |
| 处理方 | `SandboxConsumerService::consume_handoff_event` |

| payload 字段 | 类型 | 目标对象 / marker | 缺失处理 |
|---|---|---|---|
| `observability_material_ref` | `ObservabilityMaterialRef` | observability material relation | missing => `Rejected`。 |
| `handoff_fact_ref` | `Option<HandoffFactRef>` | associated handoff | mismatch => `Quarantined`。 |
| `handoff_status` | `HandoffStatus` | observability handoff status | missing => `Delayed`。 |
| `safe_reason` | `Option<SandboxReason>` | failure reason | raw body forbidden。 |

receipt: does not assert observability store truth;only records handoff status refs / markers.

### 13.8 `ConsumeSandboxControlRequested`

| 项 | 内容 |
|---|---|
| 函数签名 | `consume_sandbox_control_requested(SandboxInboundEventEnvelopeDto<SandboxControlRequestedPayloadDto>) -> ApplicationResult<SandboxConsumerReceiptDto>` |
| 逻辑协议名 | `InboundEvent/SandboxControlRequested` |
| 发布方 | runtime / operator / trusted integration |
| 处理方 | `SandboxConsumerService::consume_control_event` |

| payload 字段 | 类型 | 目标对象 / marker | 缺失处理 |
|---|---|---|---|
| `context_ref` | `ControlledExecutionContextRef` | `ControlFact.context_ref` | missing => `Rejected`。 |
| `control_kind` | `SandboxControlKind` | `ControlFact.control_kind` | unknown => `Rejected`。 |
| `control_source_context` | `ControlSourceContext` | `ControlFact.source_context` | missing reason for unsafe kind => `Delayed`。 |
| `expected_context_version_ref` | `Option<SandboxOpaqueRef>` | conflict guard input | mismatch => conflict receipt。 |

receipt: accepted may call command service path;duplicate uses stored receipt;consumer cannot bypass command idempotency / conflict guard.

### 13.9 `ConsumeInvestigationHandoffStatusChanged`

| 项 | 内容 |
|---|---|
| 函数签名 | `consume_investigation_handoff_status_changed(SandboxInboundEventEnvelopeDto<InvestigationHandoffStatusChangedPayloadDto>) -> ApplicationResult<SandboxConsumerReceiptDto>` |
| 逻辑协议名 | `InboundEvent/InvestigationHandoffStatusChanged` |
| 发布方 | investigation handoff source |
| 处理方 | `SandboxConsumerService::consume_handoff_event` |

| payload 字段 | 类型 | 目标对象 / marker | 缺失处理 |
|---|---|---|---|
| `redline_containment_ref` | `Option<RedlineContainmentRef>` | redline relation | one relation required。 |
| `cleanup_guard_ref` | `Option<CleanupGuardRef>` | cleanup relation | one relation required。 |
| `investigation_handoff_summary` | `InvestigationHandoffSummary` | investigation gate | missing => `Delayed`。 |
| `safe_reason` | `Option<SandboxReason>` | gate reason | raw investigation body forbidden。 |

receipt: may update handoff marker / cleanup/redline readiness;does not release containment by itself.

### 13.10 `ConsumeSandboxTruthRelayFeedback`

| 项 | 内容 |
|---|---|
| 函数签名 | `consume_sandbox_truth_relay_feedback(SandboxInboundEventEnvelopeDto<SandboxTruthRelayFeedbackPayloadDto>) -> ApplicationResult<SandboxConsumerReceiptDto>` |
| 逻辑协议名 | `InboundEvent/SandboxTruthRelayFeedback` |
| 发布方 | event bus / relay feedback source |
| 处理方 | `SandboxConsumerService::consume_relay_feedback` |

| payload 字段 | 类型 | 目标对象 / marker | 缺失处理 |
|---|---|---|---|
| `relay_record_ref` | `SandboxEventRelayRecordRef` | relay record status | missing => `Rejected`。 |
| `publisher_outcome_status` | `PublisherOutcomeStatus` | relay transition | missing => `Delayed`。 |
| `feedback_marker_ref` | `SandboxOpaqueRef` | relay feedback marker | missing => `Delayed`。 |
| `safe_reason` | `Option<SandboxReason>` | failure / dead-letter reason | raw bus body forbidden。 |

receipt: updates relay record only;publish failure / feedback failure never rolls back source truth.

### 13.11 Inbound Event Consumer 协议族停审记录

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| envelope 与 typed payload 是否分离 | 通过 | payload 不重复 envelope 字段。 |
| receipt 是否覆盖 accepted / duplicate / delayed / rejected / failed / quarantined / no-op | 通过 | 无 unresolved。 |
| trusted source 是否有不可绕过 gate | 通过 | schema/digest/source isolation/forbidden body/dedup/state gate 均不可绕过。 |
| consumer 是否伪造 core success | 未发现 | reference/handoff/control/relay marker 与 command path 分离。 |
| duplicate replay 是否 typed | 通过 | stored receipt 必须完整保存。 |

---

## 14. Outbound Event 协议族

### 14.1 Outbound Event 定义批次表

| 协议 | 所属模块 | payload | source truth / state | 后续 flow | 停审状态 |
|---|---|---|---|---|---|
| `SandboxExecutionContextChanged` | `application` relay | `SandboxExecutionContextChangedPayloadDto` | context / identity / resolution | relay flow | pass |
| `SandboxBoundaryChanged` | `application` relay | `SandboxBoundaryChangedPayloadDto` | boundary / decision / handle | relay flow | pass |
| `SandboxPolicyDecisionChanged` | `application` relay | `SandboxPolicyDecisionChangedPayloadDto` | policy decision / snapshot | relay flow | pass |
| `SandboxRunChanged` | `application` relay | `SandboxRunChangedPayloadDto` | controlled run | relay flow | pass |
| `SandboxCaptureChanged` | `application` relay | `SandboxCaptureChangedPayloadDto` | capture fact / material refs | relay flow | pass |
| `SandboxMaterialHandoffChanged` | `application` relay | `SandboxMaterialHandoffChangedPayloadDto` | handoff fact | relay flow | pass |
| `SandboxFailureChanged` | `application` relay | `SandboxFailureChangedPayloadDto` | failure classification | relay flow | pass |
| `SandboxControlChanged` | `application` relay | `SandboxControlChangedPayloadDto` | control fact | relay flow | pass |
| `SandboxCleanupChanged` | `application` relay | `SandboxCleanupChangedPayloadDto` | cleanup guard | relay flow | pass |
| `SandboxRedlineContainmentChanged` | `application` relay | `SandboxRedlineContainmentChangedPayloadDto` | redline containment | relay flow | pass |
| `SandboxProjectionChanged` | `application` relay | `SandboxProjectionChangedPayloadDto` | projection state | relay flow | pass |
| `SandboxDerivedViewChanged` | `application` relay | `SandboxDerivedViewChangedPayloadDto` | derived state | relay flow | pass |
| `SandboxReconciliationFindingAvailable` | `application` relay | `SandboxReconciliationFindingAvailablePayloadDto` | reconciliation report | relay flow | pass |

Outbound 通用规则:

| 规则 | 结论 |
|---|---|
| envelope | `SandboxOutboundEventEnvelopeDto<TPayload>`。 |
| source cursor | accepted truth path 使用 UoW / repository committed truth cursor;reference-only marker path 使用 reference marker cursor。 |
| payload | 只包含 committed truth refs、status、safe summary refs、reason refs;不包含 external body / raw SDK response。 |
| relay | event relay record append 不等于 publish success;publish failure 不回滚 source truth。 |

### 14.2 `SandboxExecutionContextChanged`

| payload 字段 | 类型 | 来源 | 缺失处理 |
|---|---|---|---|
| `context_ref` | `ControlledExecutionContextRef` | committed context truth | required;missing => no event record。 |
| `environment_identity_ref` | `Option<ExecutionEnvironmentIdentityRef>` | identity truth | absent allowed for rejected / unresolved。 |
| `resolution_ref` | `Option<ExecutionContextResolutionRef>` | resolution truth | absent => degraded marker in payload。 |
| `intake_status` | `ControlledExecutionIntakeStatus` | context truth | required。 |
| `audit_trace_ref` | `SandboxOpaqueRef` | audit append | required for accepted command path。 |

### 14.3 `SandboxBoundaryChanged`

| payload 字段 | 类型 | 来源 | 缺失处理 |
|---|---|---|---|
| `context_ref` | `ControlledExecutionContextRef` | boundary truth | required。 |
| `boundary_ref` | `Option<CoherentBoundaryRef>` | coherent boundary | absent for rejected / failed before boundary。 |
| `decision_ref` | `BoundaryEstablishmentDecisionRef` | decision truth | required。 |
| `decision_status` | `BoundaryDecisionStatus` | decision truth | required。 |
| `handle_ref` | `Option<IsolationEnvironmentHandleRef>` | backend outcome | absent unless established。 |
| `lease_ref` | `Option<LeaseRecordRef>` | lease truth | absent unless handle exists。 |

### 14.4 `SandboxPolicyDecisionChanged`

| payload 字段 | 类型 | 来源 | 缺失处理 |
|---|---|---|---|
| `context_ref` | `ControlledExecutionContextRef` | policy truth | required。 |
| `policy_decision_ref` | `PolicyExecutionDecisionRef` | decision truth | required。 |
| `policy_snapshot_ref` | `PolicyApplicabilitySnapshotRef` | snapshot truth | required unless fail-closed due missing summary;then safe marker required。 |
| `decision_status` | `PolicyExecutionDecisionStatus` | decision truth | required。 |
| `high_risk_action_refs` | `Vec<HighRiskActionDecisionRef>` | high-risk truth | empty allowed。 |
| `fail_closed_marker_ref` | `Option<SandboxOpaqueRef>` | fail-closed guard | required for fail-closed。 |

### 14.5 `SandboxRunChanged`

| payload 字段 | 类型 | 来源 | 缺失处理 |
|---|---|---|---|
| `context_ref` | `ControlledExecutionContextRef` | run truth | required。 |
| `run_ref` | `ControlledExecutionRunRef` | run truth | required。 |
| `handle_ref` | `IsolationEnvironmentHandleRef` | run binding | required。 |
| `run_status` | `ControlledExecutionRunStatus` | run transition | required。 |
| `lifecycle_marker_ref` | `Option<SandboxOpaqueRef>` | backend lifecycle signal | absent allowed。 |

### 14.6 `SandboxCaptureChanged`

| payload 字段 | 类型 | 来源 | 缺失处理 |
|---|---|---|---|
| `run_ref` | `ControlledExecutionRunRef` | capture truth | required。 |
| `capture_fact_ref` | `CaptureFactRef` | capture truth | required。 |
| `capture_status` | `CaptureStatus` | capture truth | required。 |
| `material_refs` | `Vec<CapturedMaterialRef>` | capture truth | empty allowed only for failed/unavailable。 |
| `observability_material_ref` | `Option<ObservabilityMaterialRef>` | capture truth | absent allowed。 |

### 14.7 `SandboxMaterialHandoffChanged`

| payload 字段 | 类型 | 来源 | 缺失处理 |
|---|---|---|---|
| `handoff_fact_ref` | `HandoffFactRef` | handoff truth | required。 |
| `capture_fact_ref` | `CaptureFactRef` | handoff truth | required。 |
| `target_refs` | `Vec<HandoffTargetRefDto>` | handoff truth | required non-empty。 |
| `handoff_status` | `HandoffStatus` | handoff truth / feedback | required。 |
| `relay_record_ref` | `Option<SandboxEventRelayRecordRef>` | relay repo | absent only before relay append。 |

### 14.8 `SandboxFailureChanged`

| payload 字段 | 类型 | 来源 | 缺失处理 |
|---|---|---|---|
| `context_ref` | `ControlledExecutionContextRef` | failure truth | required。 |
| `failure_ref` | `FailureClassificationRef` | failure truth | required。 |
| `failure_kind` | `SandboxFailureKind` | failure truth | required。 |
| `failure_status` | `FailureClassificationStatus` | failure truth | required。 |
| `source_marker_refs` | `Vec<SandboxOpaqueRef>` | failure source | empty only for pending input。 |

### 14.9 `SandboxControlChanged`

| payload 字段 | 类型 | 来源 | 缺失处理 |
|---|---|---|---|
| `context_ref` | `ControlledExecutionContextRef` | control truth | required。 |
| `control_fact_ref` | `ControlFactRef` | control truth | required。 |
| `control_kind` | `SandboxControlKind` | control truth | required。 |
| `control_status` | `ControlFactStatus` | control truth | required。 |
| `source_context_ref` | `Option<SandboxOpaqueRef>` | control source marker | absent allowed for system control。 |

### 14.10 `SandboxCleanupChanged`

| payload 字段 | 类型 | 来源 | 缺失处理 |
|---|---|---|---|
| `context_ref` | `ControlledExecutionContextRef` | cleanup truth | required。 |
| `cleanup_guard_ref` | `CleanupGuardRef` | cleanup truth | required。 |
| `cleanup_status` | `CleanupGuardStatus` | cleanup truth | required。 |
| `blocking_reason_refs` | `Vec<SandboxOpaqueRef>` | cleanup guard | empty only when allowed/completed。 |
| `handoff_fact_ref` | `Option<HandoffFactRef>` | cleanup input | absent => pending evidence marker。 |

### 14.11 `SandboxRedlineContainmentChanged`

| payload 字段 | 类型 | 来源 | 缺失处理 |
|---|---|---|---|
| `context_ref` | `ControlledExecutionContextRef` | redline truth | required。 |
| `redline_containment_ref` | `RedlineContainmentRef` | redline truth | required。 |
| `redline_kind` | `RedlineKind` | redline truth | required。 |
| `containment_status` | `RedlineContainmentStatus` | redline truth | required。 |
| `investigation_handoff_ref` | `Option<SandboxOpaqueRef>` | investigation summary | required when status `HandoffPending`。 |

### 14.12 `SandboxProjectionChanged`

| payload 字段 | 类型 | 来源 | 缺失处理 |
|---|---|---|---|
| `projection_ref` | `SandboxReadProjectionRef` | projection repository | required。 |
| `projection_status` | `SandboxProjectionStatus` | projection repository | required。 |
| `affected_truth_refs` | `Vec<SandboxOpaqueRef>` | projection stale source | required for stale/rebuild。 |
| `source_cursor` | `Option<SandboxOpaqueRef>` | truth/reference cursor | required for stale marker。 |

### 14.13 `SandboxDerivedViewChanged`

| payload 字段 | 类型 | 来源 | 缺失处理 |
|---|---|---|---|
| `derived_state_ref` | `DerivedInspectPreviewTrendStateRef` | derived repository | required。 |
| `derived_kind` | `DerivedMaterialKind` | derived state | required。 |
| `freshness_status` | `DerivedFreshnessStatus` | derived state | required。 |
| `source_refs` | `DerivedSourceRefSet` | derived state | required。 |
| `failure_summary` | `Option<DerivedFailureSummary>` | derived state | required when failed。 |

### 14.14 `SandboxReconciliationFindingAvailable`

| payload 字段 | 类型 | 来源 | 缺失处理 |
|---|---|---|---|
| `report_ref` | `SandboxOpaqueRef` | reconciliation report | required。 |
| `scope_ref` | `SandboxOpaqueRef` | reconciliation report | required。 |
| `report_status` | `ReconciliationReportStatus` | reconciliation report | required。 |
| `finding_refs` | `Vec<SandboxOpaqueRef>` | reconciliation report | required non-empty for finding event。 |

### 14.15 Outbound Event 协议族停审记录

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| 每个 outbound event 是否有 payload schema | 通过 | 无 unresolved。 |
| payload 是否只来自 committed truth / maintenance state | 通过 | source cursor 由 UoW / repository 给出。 |
| 是否存在 publish failure rollback truth | 未发现 | relay failure 只更新 relay/report surface。 |
| event payload 是否保存 raw external body / SDK response | 未发现 | 仅 refs、status、safe reason。 |

---

## 15. Operations Job 协议族

### 15.1 Operations Job 定义批次表

| 协议 | 所属模块 | input spec / report | 依赖 port | 后续 flow | 停审状态 |
|---|---|---|---|---|---|
| `PublishSandboxEventRelay` | `jobs` -> `application` | `PublishSandboxEventRelayJobSpecDto` / report | relay repo、publisher | relay job flow | pass |
| `RefreshSandboxReferenceStates` | `jobs` -> `application` | `RefreshSandboxReferenceStatesJobSpecDto` / report | resolver、reference repo、projection repo | reference job flow | pass |
| `RefreshBackendCapabilitySummaries` | `jobs` -> `application` | `RefreshBackendCapabilitySummariesJobSpecDto` / report | backend capability port、reference repo | capability job flow | pass |
| `RetryPendingMaterialHandoffs` | `jobs` -> `application` | `RetryPendingMaterialHandoffsJobSpecDto` / report | maintenance selection、handoff port | handoff retry flow | pass |
| `RunLeaseOrphanReaper` | `jobs` -> `application` | `RunLeaseOrphanReaperJobSpecDto` / report | maintenance selection、lifecycle inspect | reaper flow | pass |
| `EvaluatePendingCleanupGuards` | `jobs` -> `application` | `EvaluatePendingCleanupGuardsJobSpecDto` / report | maintenance selection、truth repo | cleanup job flow | pass |
| `MaintainRedlineContainmentHandoffs` | `jobs` -> `application` | `MaintainRedlineContainmentHandoffsJobSpecDto` / report | maintenance selection、investigation port | redline job flow | pass |
| `RebuildSandboxReadProjections` | `jobs` -> `application` | `RebuildSandboxReadProjectionsJobSpecDto` / report | truth snapshot、projection repo | projection rebuild flow | pass |
| `MaintainDerivedInspectPreviewTrend` | `jobs` -> `application` | `MaintainDerivedInspectPreviewTrendJobSpecDto` / report | derived repo | derived job flow | pass |
| `RunSandboxReconciliation` | `jobs` -> `application` | `RunSandboxReconciliationJobSpecDto` / report | truth snapshot、derived repo | reconciliation flow | pass |

Job 通用规则:

| 规则 | 结论 |
|---|---|
| input | `SandboxJobInputDto<TSpec>`;job kind、scope、spec、page cursor 进入 digest。 |
| report | `SandboxJobReportDto`;item refs 必须保存,duplicate replay 返回完整 report。 |
| authority | P0 只接受 runtime 提供且经校验的非空 core `ActorKind::System`；不得从 payload、配置字符串或 operator 身份提升权限，也不得用 job 绕过业务 command gate。 |
| no core repair | job 可维护 relay/reference/projection/derived/handoff/cleanup/redline marker,不得改写 core truth 成 success。 |

### 15.2 `PublishSandboxEventRelay`

| 项 | 内容 |
|---|---|
| 函数签名 | `run_job(SandboxJobInputDto<PublishSandboxEventRelayJobSpecDto>) -> ApplicationResult<SandboxJobReportDto>` |
| 逻辑协议名 | `Job/PublishSandboxEventRelay` |

| spec 字段 | 类型 | 目标 / 来源 | 缺失处理 |
|---|---|---|---|
| `relay_scope_ref` | `Option<SandboxOpaqueRef>` | relay selection scope | none => default eligible scope from repo,not config guess。 |
| `status_filter` | `Vec<EventRelayStatus>` | pending/retryable selection | empty => pending only。 |

report item refs: `delivered_relay_refs`、`retryable_relay_refs`、`dead_letter_relay_refs`、`failed_relay_refs`;publisher outcome must be `EventPublisherAdapterOutcome`;duplicate does not publish again。

### 15.3 `RefreshSandboxReferenceStates`

| 项 | 内容 |
|---|---|
| 函数签名 | `run_job(SandboxJobInputDto<RefreshSandboxReferenceStatesJobSpecDto>) -> ApplicationResult<SandboxJobReportDto>` |
| 逻辑协议名 | `Job/RefreshSandboxReferenceStates` |

| spec 字段 | 类型 | 目标 / 来源 | 缺失处理 |
|---|---|---|---|
| `refresh_scope` | `SandboxReferenceRefreshScopeDto` | maps to Step 7 `SandboxReferenceRefreshScope` | invalid branch => `Validation`。 |
| `source_kind_filter` | `Vec<ExternalSourceKind>` | reference selection | empty allowed。 |

report item refs: `refreshed_reference_state_refs`、`stale_projection_refs`、`failed_reference_refs`;reference marker cursor from UoW,not source version/dedup/page cursor。

### 15.4 `RefreshBackendCapabilitySummaries`

| 项 | 内容 |
|---|---|
| 函数签名 | `run_job(SandboxJobInputDto<RefreshBackendCapabilitySummariesJobSpecDto>) -> ApplicationResult<SandboxJobReportDto>` |
| 逻辑协议名 | `Job/RefreshBackendCapabilitySummaries` |

| spec 字段 | 类型 | 目标 / 来源 | 缺失处理 |
|---|---|---|---|
| `backend_profile_refs` | `Vec<SandboxOpaqueRef>` | backend capability selection | empty => repo selected stale/degraded profiles。 |
| `capability_scope_ref` | `Option<SandboxOpaqueRef>` | capability summary scope | missing allowed。 |

report item refs: `capability_summary_refs`、`affected_boundary_refs`、`failed_backend_profile_refs`;job cannot establish boundary。

### 15.5 `RetryPendingMaterialHandoffs`

| 项 | 内容 |
|---|---|
| 函数签名 | `run_job(SandboxJobInputDto<RetryPendingMaterialHandoffsJobSpecDto>) -> ApplicationResult<SandboxJobReportDto>` |
| 逻辑协议名 | `Job/RetryPendingMaterialHandoffs` |

| spec 字段 | 类型 | 目标 / 来源 | 缺失处理 |
|---|---|---|---|
| `handoff_scope_ref` | `Option<SandboxOpaqueRef>` | pending handoff selection | none => maintenance repo selection。 |
| `target_kind_filter` | `Vec<HandoffTargetKind>` | handoff target filter | empty allowed。 |

report item refs: `delivered_handoff_refs`、`retryable_handoff_refs`、`failed_handoff_refs`;handoff failure does not rollback capture truth。

### 15.6 `RunLeaseOrphanReaper`

| 项 | 内容 |
|---|---|
| 函数签名 | `run_job(SandboxJobInputDto<RunLeaseOrphanReaperJobSpecDto>) -> ApplicationResult<SandboxJobReportDto>` |
| 逻辑协议名 | `Job/RunLeaseOrphanReaper` |

| spec 字段 | 类型 | 目标 / 来源 | 缺失处理 |
|---|---|---|---|
| `lease_scope_ref` | `Option<SandboxOpaqueRef>` | expiring/expired lease selection | none => maintenance repo selection。 |
| `reaper_reason` | `Option<ReaperEligibilityMarker>` | safe reason | missing uses repo eligibility marker,not raw backend body。 |

report item refs: `orphan_suspected_refs`、`released_lease_refs`、`cleanup_guard_refs`、`failed_lease_refs`;reaper cannot bypass cleanup guard。

### 15.7 `EvaluatePendingCleanupGuards`

| 项 | 内容 |
|---|---|
| 函数签名 | `run_job(SandboxJobInputDto<EvaluatePendingCleanupGuardsJobSpecDto>) -> ApplicationResult<SandboxJobReportDto>` |
| 逻辑协议名 | `Job/EvaluatePendingCleanupGuards` |

| spec 字段 | 类型 | 目标 / 来源 | 缺失处理 |
|---|---|---|---|
| `cleanup_scope_ref` | `Option<SandboxOpaqueRef>` | pending cleanup guard selection | none => maintenance repo selection。 |
| `include_blocked` | `bool` | selection hint | false by DTO default only if default documented in config later;currently explicit required by entry。 |

report item refs: `allowed_cleanup_guard_refs`、`blocked_cleanup_guard_refs`、`pending_cleanup_guard_refs`、`failed_cleanup_guard_refs`;does not execute cleanup release。

### 15.8 `MaintainRedlineContainmentHandoffs`

| 项 | 内容 |
|---|---|
| 函数签名 | `run_job(SandboxJobInputDto<MaintainRedlineContainmentHandoffsJobSpecDto>) -> ApplicationResult<SandboxJobReportDto>` |
| 逻辑协议名 | `Job/MaintainRedlineContainmentHandoffs` |

| spec 字段 | 类型 | 目标 / 来源 | 缺失处理 |
|---|---|---|---|
| `redline_scope_ref` | `Option<SandboxOpaqueRef>` | redline selection | none => maintenance repo selection。 |
| `target_status_filter` | `Vec<RedlineContainmentStatus>` | containment selection | empty => detected/handoff pending。 |

report item refs: `handoff_opened_redline_refs`、`released_redline_refs`、`terminal_redline_refs`、`failed_redline_refs`;release must obey investigation / cleanup guard。

### 15.9 `RebuildSandboxReadProjections`

| 项 | 内容 |
|---|---|
| 函数签名 | `run_job(SandboxJobInputDto<RebuildSandboxReadProjectionsJobSpecDto>) -> ApplicationResult<SandboxJobReportDto>` |
| 逻辑协议名 | `Job/RebuildSandboxReadProjections` |

| spec 字段 | 类型 | 目标 / 来源 | 缺失处理 |
|---|---|---|---|
| `projection_scope_ref` | `Option<SandboxOpaqueRef>` | projection selection | none => stale/degraded from projection repo。 |
| `projection_refs` | `Vec<SandboxReadProjectionRef>` | explicit targets | empty allowed only with scope。 |

report item refs: `rebuilt_projection_refs`、`still_stale_projection_refs`、`missing_snapshot_projection_refs`、`failed_projection_refs`;snapshot input comes from Step 7 `load_projection_rebuild_snapshot`,not existing view body。

### 15.10 `MaintainDerivedInspectPreviewTrend`

| 项 | 内容 |
|---|---|
| 函数签名 | `run_job(SandboxJobInputDto<MaintainDerivedInspectPreviewTrendJobSpecDto>) -> ApplicationResult<SandboxJobReportDto>` |
| 逻辑协议名 | `Job/MaintainDerivedInspectPreviewTrend` |

| spec 字段 | 类型 | 目标 / 来源 | 缺失处理 |
|---|---|---|---|
| `derived_scope_ref` | `SandboxOpaqueRef` | derived selection | missing => `Validation`。 |
| `derived_kind_filter` | `Vec<DerivedMaterialKind>` | inspect/preview/trend selection | empty => all supported derived kinds。 |

report item refs: `rebuilt_derived_state_refs`、`stale_derived_state_refs`、`failed_derived_state_refs`;derived failure does not create sandbox failure truth。

### 15.11 `RunSandboxReconciliation`

| 项 | 内容 |
|---|---|
| 函数签名 | `run_job(SandboxJobInputDto<RunSandboxReconciliationJobSpecDto>) -> ApplicationResult<SandboxJobReportDto>` |
| 逻辑协议名 | `Job/RunSandboxReconciliation` |

| spec 字段 | 类型 | 目标 / 来源 | 缺失处理 |
|---|---|---|---|
| `reconciliation_scope_ref` | `SandboxOpaqueRef` | reconciliation report scope | missing => `Validation`。 |
| `target_kinds` | `Vec<DerivedMaterialKind>` | report target kinds | empty => all supported reconciliation targets。 |

report item refs: `report_refs`、`finding_refs`、`degraded_target_refs`、`failed_target_refs`;report is read/diagnostic truth,never repairs core truth。

### 15.12 Operations Job 协议族停审记录

| 审查项 | 结论 | 缺口 / 修正 |
|---|---|---|
| 每个 Job 是否有 input spec / report schema | 通过 | 无 unresolved。 |
| report accumulator item refs 是否进入 public/stored schema | 通过 | `SandboxJobReportDto` + per-job refs 已列明。 |
| duplicate replay 是否会重跑 job | 不会 | stored report 完整返回。 |
| job 是否越界成为业务 command | 未发现 | job 只维护 relay/reference/projection/derived/handoff/cleanup/redline marker。 |

---

## 16. 字段来源与 DTO / Event / Job 构造闭环总表

| 协议族 | DTO / payload source | 构造 / 影响对象 | 依赖 Step 7 port | 后续 Step 9 flow | 闭环结论 |
|---|---|---|---|---|---|
| Command intake | request refs + metadata + resolver output + id generator | context、identity、resolution、audit、stored result | resolver、truth repo、id generator、audit repo、idempotency、stored result | intake command flow | 闭环 |
| Command boundary | request boundary requirements + capability summary + backend outcome | boundary requirement、decision、coherent boundary、handle、lease | backend capability、isolation backend、truth repo、audit repo | boundary flow | 闭环 |
| Command policy | policy refs + authorization summary + high-risk markers | policy snapshot、decision、high-risk decision | policy summary、truth repo | policy flow | 闭环 |
| Command run/capture/handoff | run refs + launch / capture / material / handoff summaries | run、capture、material refs、observability material、handoff、relay | isolation backend、capture、handoff、observability、relay repo | run/capture/handoff flow | 闭环 |
| Command safety | control/failure/cleanup/redline request + safe markers | control fact、failure classification、cleanup guard、redline containment | truth repo、lifecycle inspect、investigation handoff | failure/control/cleanup/redline flow | 闭环 |
| Query | query selector + metadata + projection/snapshot/repository output | public view / page / marker only | query service、truth snapshot、projection、derived、audit repo | query no-write flow | 闭环 |
| Inbound Consumer | envelope + typed payload + source authority | reference state、handoff state、control input、relay feedback、receipt | consumer service、reference repo、truth repo、relay repo、stored result | consumer flow | 闭环 |
| Outbound Event | committed truth / maintenance state + source cursor | outbound envelope / relay record | relay repo、publisher port | relay flow | 闭环 |
| Job | job metadata + spec + repository selection | maintenance state / report / markers | job service、maintenance repo、ports、stored result | job flow | 闭环 |

### 16.1 相近字段禁止混同表

| 字段 | 语义 | 不得替代 |
|---|---|---|
| `source_cursor` | committed truth/reference marker cursor | page cursor、repository version、timestamp、trace id、dedup key。 |
| `page_request.cursor` | list pagination cursor | truth cursor、source cursor、idempotency key。 |
| `expected_version` | caller-visible optimistic guard hint | repository `SandboxRepositoryVersion` unless loaded by repo。 |
| `event_envelope_ref` | inbound envelope identity | outbound event ref、payload ref、relay record ref。 |
| `payload_ref` | outbound canonical payload identity | source truth ref、event envelope ref。 |
| `relay_record_ref` | local relay persistence record | event ref、topic name、publisher receipt。 |
| `stored_result_ref` | replayable public result reference | operation ref、audit trace ref。 |
| `context_ref` | sandbox context truth | actor ref、work ref、runtime run id。 |
| `handle_ref` | isolation backend handle reference | backend profile ref、runtime id、coherent boundary ref。 |

---

## 17. 公共错误映射

| 内部来源 | public error kind | 协议族 | 调用方处理 |
|---|---|---|---|
| DTO schema invalid / missing selector | `Validation` | all | 修正请求;不重试同一 digest。 |
| required external/source ref unresolved | `ReferenceUnresolved` | Command / Query / Consumer / Job | 可刷新 refs 或等待上游。 |
| forbidden body marker present | `ForbiddenExternalBody` | Command / Consumer / Outbound | quarantine / reject;不得保存 body。 |
| actor not in scope | `NotAuthorized` / `NotVisible` | Command / Query | 不暴露 view;审计拒绝。 |
| repository optimistic conflict | `VersionConflict` | Command / Consumer / Job | 可重读后重试,不自动覆盖。 |
| duplicate with different digest | `IdempotencyConflict` | Command / Consumer / Job | reject/conflict。 |
| duplicate missing stored result | `DuplicateMissingResult` | Command / Consumer / Job | blocker / degraded,不得重跑。 |
| boundary unsupported / rejected | `BoundaryRejected` | Command / Query / Event | fail closed;不 silent degrade。 |
| policy missing/conflicted/unsafe | `PolicyFailClosed` | Command / Query / Event | reject / blocked,不 allow。 |
| adapter unavailable/disabled | `AdapterUnavailable` / `Disabled` | Command / Consumer / Job / Query | pending/degraded/skipped;不改核心 truth success。 |
| unsupported schema version | `UnsupportedVersion` | Consumer | delayed / quarantined。 |
| consumer unsafe source/body | `Quarantined` | Consumer | no core write。 |
| query attempted write path | `NoWriteViolation` | Query | implementation bug;fail and audit。 |
| unmapped internal error | `Internal` | all | safe reason only;raw error redacted。 |

---

## 18. 协议族停审记录

| 协议族 | DTO / Event / Job schema | 二级 public type schema | 错误 / 幂等 / 审计 | actor/source authority | 后续 flow 是否存在 | 停审 |
|---|---|---|---|---|---|---|
| Command | 完整 | 完整 | 完整 | validated core actor + authorization gate | Step 9 command flows | pass |
| Query | 完整 | 完整 | 完整 | validated core actor + visibility gate, no-write | Step 9 query flows | pass |
| Inbound Event Consumer | 完整 | 完整 | 完整 | validated core actor + `source_ref` / envelope gates | Step 9 consumer flows | pass |
| Outbound Event | 完整 | 完整 | 完整 | sandbox relay producer | Step 9 relay flows | pass |
| Operations Job | 完整 | 完整 | 完整 | runtime-provided core `ActorKind::System` only | Step 9 job flows | pass |

---

## 19. 跨协议 public surface 闭环审计表

| 审计项 | 结论 | 缺口 / 修正 |
|---|---|---|
| public DTO 是否直接依赖 domain-only type | 未发现 | Step 6 shared status / ref / kind 已承接 public type。 |
| Command result / Consumer receipt / Job report 是否都有 typed stored replay surface | 通过 | `SandboxStoredOperationResultDto` 携带三类完整 public surface。 |
| Inbound envelope / payload 是否有字段重复 | 未发现 | payload 不重复 envelope event/source/schema/dedup/trace 字段。 |
| Query page helper 是否映射到 public DTO | 通过 | `SandboxRepositoryPage` / `Page<T>` 映射到 `SandboxPageRequestDto` / `SandboxPageInfoDto`。 |
| Query empty / not visible / stale / failed / rebuilding / disabled / missing projection 是否可测试 | 通过 | `SandboxQuerySurfaceStatus` + `SandboxProjectionMarkerDto`。 |
| Outbound payload 是否有 canonical source cursor | 通过 | source cursor 只能来自 UoW / repository committed cursor。 |
| actor / trusted source 例外是否闭合 | 通过 | trusted source 不能绕过 schema、digest、source isolation、forbidden body、dedup、state gate。 |
| phase boundary 是否越界 | 未发现 | 未写 tools semantic execution、runtime agent loop、member lifecycle orchestration、artifact truth、observability store 或 policy definition。 |
| protocol-to-flow 覆盖 | 通过 | 55 个协议均标记需要 Step 9 flow 或 relay/job flow。 |
| unresolved blocker | 无 | 下游 `04/07` 缺失仍是 downstream gap,不阻塞 Step 8。 |

---

## 20. 回填草稿

正式 `03-详细设计.md` Step 19 装配时,§7 可按以下结构回填。本步不直接修改正式 `03`。

```md
## 7. API / Command / Query / Event / Job 协议契约

### 7.1 Public Protocol Shared Carrier

本项目 public protocol 由 `contracts` crate 承载。所有协议共用 `SandboxProtocolMetadataDto`、`SandboxActorContextDto`、`SandboxPageRequestDto`、`SandboxPageInfoDto`、`SandboxQueryResponseDto<T>`、`SandboxCommandResultDto`、`SandboxInboundEventEnvelopeDto<TPayload>`、`SandboxConsumerReceiptDto`、`SandboxOutboundEventEnvelopeDto<TPayload>`、`SandboxJobInputDto<TSpec>`、`SandboxJobReportDto` 和 `SandboxPublicErrorDto`。

### 7.2 Command Protocols

按 `OpenControlledExecutionContext`、`EstablishExecutionBoundary`、`EvaluatePolicyExecution`、`StartControlledExecutionRun`、`RecordCaptureResult`、`OpenMaterialHandoff`、`SubmitSandboxControl`、`ClassifySandboxFailure`、`EvaluateCleanupReadiness`、`RecordRedlineContainment` 展开 request / result / error / idempotency。

### 7.3 Query Protocols

按 13 个 query 展开 request、view、page、projection marker、empty / not visible / stale / degraded / failed / rebuilding / disabled / missing projection surface。

### 7.4 Event Protocols

Inbound event 使用统一 envelope + typed payload + receipt。Outbound event 使用统一 envelope + canonical payload + source cursor。

### 7.5 Operations Job Protocols

Operations job 使用 `SandboxJobInputDto<TSpec>` 和 `SandboxJobReportDto`;duplicate replay 返回 stored report,不重跑 job。
```

---

## 21. 待确认事项

| 事项 | 当前处理 | 是否阻塞 Step 8 |
|---|---|---|
| 真实 HTTP path / RPC method / topic 名称 | 后移到 transport / config / implementation binding;本步只写逻辑协议名。 | 否 |
| schema version 具体编码规则 | 本步要求 `schema_version`;具体 registry / versioning policy 后续配置/实现绑定。 | 否 |
| page limit 最大值 / retry window / job batch size | 后续 `04-配置设计.md` 定义;本步只要求字段和禁止无限默认。 | 否 |
| read visibility resolver exact policy | 当前以 actor scope + trusted source gate + query surface 约束;Step 9/12 继续细化。 | 否 |
| backend / bus / store 产品选型 | 不在 Step 8 范围。 | 否 |

---

## 22. 自检

| 检查项 | 结论 |
|---|---|
| 是否创建 Step 8 中间产物 | 通过。本文为 `03_ddd_step_08_protocol_contracts.md`。 |
| 是否修改正式 `03-详细设计.md` | 未修改。正式文档仍等 Step 19 装配。 |
| 是否提前创建 Step 9 | 未创建。 |
| 每个协议是否有独立小节 | 通过。Command / Query / Consumer / Outbound Event / Job 均逐协议小节列出。 |
| 是否按协议族分批并停审 | 通过。五个协议族均有定义批次表和停审记录。 |
| Query view / page / marker 是否闭口 | 通过。§10.2~§10.3 和 §12 完成。 |
| public 二级类型是否闭口 | 通过。result、receipt、report、envelope、error、authority、page 均定义 owner / fields / source。 |
| duplicate replay 是否闭口 | 通过。Command / Consumer / Job 均要求 typed stored result,不得重跑。 |
| 是否发现上游 blocker | 未发现阻塞 Step 8 的上游 blocker。`04/07` 缺失仍为 downstream gap。 |

---

## 23. 进入下一步条件

```text
当前 Step 8 已完成并停在用户审查点。

用户确认后,才能进入 Step 9 `逐接口定义函数级处理流`。
进入 Step 9 前必须读取:
1. `project_execution_ledger.md`
2. `03_ddd_calibration_flow.md`
3. `03_ddd_step_08_protocol_contracts.md`
4. 详细设计 SOP Step 9
5. 详细设计书写规范 §5.8
6. 设计真相源闭环与可落码性标准中 flow / transaction / side-effect inventory / accepted truth cursor / no-write 相关条目

Step 9 必须逐接口展开 application service 编排、repository / port 调用、UoW、stored result、relay / stale / audit side effect 和 no-rollback / no-write 顺序;不得在用户确认前创建 Step 9 文件。
```

---

## 24. 实施计划回查修复记录

| 回查 ID | 发现位置 | 原冲突 | 修复结果 | 协议数量影响 |
|---|---|---|---|---|
| `SBX-IMP-BOUNDARY-POLICY-CYCLE-001` | `07` Step 6 DTO构造复核 | `EstablishExecutionBoundaryRequestDto` 原要求后序 `policy_snapshot_ref`。 | 移除该字段;public request保留显式四维requirements和capability summary ref,profile / template / generation由builder注入boundary service;Policy request仍消费 `boundary_requirement_ref`。 | 无;仍为10 Command / 55协议。 |

---

## 25. Current actor authority regression override (`v7.9-closeout`)

本节覆盖本文前述 historical `SandboxActorAuthorityKind`、`Maintenance` actor 和 operator-scoped job authority。current
authority 直接承接 core `ActorKind`，其闭集只有 `Human / AiMember / System / Integration`；Sandbox 不创建私有 actor kind。

| entry family | current accepted authority | independent gate | forbidden elevation |
|---|---|---|---|
| API Command / Query | protocol metadata 中经校验的非空 core actor | command authorization / query visibility 仍逐 use case 执行 | display name、role hint、actor kind 本身直接视为业务 allow |
| Inbound Consumer | trusted entry 绑定的非空 core actor；`source_ref` 不从 event body 构造 | schema、source isolation、digest、dedup、forbidden-body 和 state gate | 仅凭 `ActorKind::Integration` 或 source label 绕过 trusted-source gate |
| Fulfillment / Relay Worker | runtime 提供且经 `validate_system_actor_ref` 校验的 `ActorKind::System` | 固定 worker allow-set 与业务 guard | payload actor、binary user、配置字符串扩权 |
| One-shot Operations Job | runtime 提供且经 context factory 校验的 `ActorKind::System` | runner 固定 job kind；不得替代业务 command authorization | operator 直接调用、`Maintenance` 字符串角色或 job 绕过 guard |

若未来需要 operator 触发 maintenance，必须 DesignReopen 并定义可信代理、delegation、审计来源与相应测试切口；不得把
`Human` 重解释为 operator authority。本修复只关闭 L4-sandbox 内部回归项，不改变 55 个协议、状态库存、测试库存或 planned
boundary 数量，也不表示 runtime actor 装配已经验证。

```text
actor_authority_regression = resolved_for_design_static_closeout
core_actor_kind = Human|AiMember|System|Integration
sandbox_private_actor_kind = none
p0_worker_job_actor = ActorKind::System
new_l1_l2_blocker = 0
implementation_verified = no
tests_executed = no
```
