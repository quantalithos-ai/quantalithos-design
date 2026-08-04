# L4-observability 03-详细设计 Step 06 - R06.6-A application operation / context / idempotency 对象契约

> 主控文件: `design-calibration/03_ddd_step_06_object_contracts.md`
> 上游输入: `design-calibration/03_ddd_step_06_application_input_boundary.md`
> 对应 SOP: `standards/document/详细设计讨论流程_SOP.md` Step 06
> 当前模式: full-restart 定向粒度修复
> 当前子批次: `R06.6-A`
> 专项完成状态: `R06.6-A_done_confirmed_historical_checkpoint`
> 当前整体恢复点: `R06.6-F1-W3_done_waiting_user_before_F2`
> 当前下一动作: wait_user_confirmation_before_R06.6-F2

## 1. 子批次状态与写入门禁

| 项 | 当前裁定 |
|---|---|
| 当前正式文档 | `projects/L4-observability/03-详细设计.md` |
| 当前 Step | Step 06 `逐模块定义对象实现契约` |
| 当前模块 | `application::operations`、`application::context`、`application::idempotency` |
| 上游停审点 | `R06.6_input_boundary_done_waiting_user`；本批开始前已获用户明确确认 |
| 本批覆盖 | operation namespace、inbound event identity、operation context、idempotency scope、reservation、durable state、incoming reserve outcome |
| 本批不覆盖 | stored result / replay bytes、outbox、external effect、job plan / claim、report、service façade、protocol DTO、repository trait、flow、Step 07 及正式 `03` |
| 正式回填 | blocked；A~E与F1已完成design-only，仍必须等待F2、R06.7、R06.8与Step 19重装配 |
| 历史 gate_status | `R06.6-A_done_waiting_user`；该门禁已由用户确认解除 |
| 当前整体恢复点 | `R06.6-F1-W3_done_waiting_user_before_F2`；F1 current对象卡与停审见`03_ddd_step_06_application_digest_canonicalizer.md` §§7.24~7.33，未经用户确认不得进入F2 |
| 外部上游 blocker | `none` |
| 内部 blocker | `03-RPR-S06-GRANULARITY=open`；`R06.6-DISPOSITION-LAYER=resolved_in_E_design_only`；`R06.6-APP-EXT-OWNER=resolved_in_C`；`R06.6-JOB-CONFIG-OWNER=resolved_in_D4`；`R06.6-APP-ERROR-OWNER=resolved_in_E_design_only`；`R06.6-DIGEST-CANONICALIZER=resolved_in_F1_design_only`；`R06-F-AFFECT-UOW-01=open_controlled` |
| 是否修改正式 `03` | 否 |
| 是否需要提交 | 不需要；本批只修改设计仓中间产物和台账，未提交 commit |

### 1.1 写入前检查

| 检查项 | 结论 |
|---|---|
| 项目级门禁 | 允许在 `03 / Step 06 / R06.6` 内写入 A 批；不允许跨 Step 或跨正式文档 |
| 文档级门禁 | `03_ddd_calibration_flow.md` 仍冻结 Step 07~19 与 formal assembly |
| Step / 模块门禁 | 输入边界已完成；本文件只闭口三个 application logical module |
| 逐对象要求 | 11 个对象均独立成卡；不以 family 表替代字段、factory、member、状态和测试红线 |
| 正式正文污染 | `no`；A 批未回填 `03-详细设计.md` |
| 历史冲突处理 | `ObservationVisibilityDecision` 标记 `HX`；canonical `ReadVisibilityDecision` 只由 `domain::read` 拥有 |
| 层级冲突处理 | consumer/job disposition 不在 A 批猜测 enum，登记 `R06.6-DISPOSITION-LAYER` |

## 2. 本批输入与权威顺序

| 输入 | 读取范围 | 本批用途 | 权威限制 |
|---|---|---|---|
| `03_ddd_step_06_application_input_boundary.md` | §§2~11 | capability 边界、inventory、批次顺序、H12 兼容和冲突登记 | A 批只消费 operation/context/idempotency 组 |
| `03_ddd_step_06_object_contracts.md` | §§6.1、6.6、6.14、§7.7 | owner registry、历史草稿、R06.5-G 摘要 | §7.7 仅为 historical repair input，不直接恢复旧 schema |
| `03_ddd_step_06_contracts_carriers.md` | operation / context / typed ref owner 表 | shared carrier 和 public ref 的唯一 owner | 不把 contracts carrier变成 application truth |
| `03_ddd_step_06_policy_guard_records.md` | §§71、73 | H12 accepted item-result 的 reservation-only 边界 | 不定义 job、plan、item、claim、run、report |
| `03_ddd_step_06_boundary_read_maintenance.md` | §9.6.1、§24 affected-definition | canonical `ReadVisibilityDecision` 和 Query no-write | 不创建第二个 visibility authority |
| `03_ddd_step_06_domain_truth_signal_audit.md` | §24 affected-definition | domain transition / post-state 只作为 application 输入 | application 不拥有 domain truth |
| `02-概要设计.md` | application、outbox、stored result、job、report use-site | 确认 capability 与非目标 | 不替代 Step 06 实现契约 |
| `03_ddd_step_08_protocol_contracts.md` | 16 Command、14 Query、9 Consumer、9 Job catalog | 确认 operation variant 全集和 static mapping | 协议文件是冻结 use-site，不夺取 A 批 owner |
| `03_ddd_step_09_function_flows.md` | reserve / replay / conflict / in-flight flow | 反查调用前置与 zero-write 分支 | 不在 A 批写逐接口 flow |
| `03_ddd_step_11_persistence_transaction_consistency.md` | reservation store 和 result-before-complete 约束 | 确认 durable 字段与 CAS 边界 | 不在 A 批写 logical store / DDL |
| `03_ddd_step_13_concurrency_idempotency.md` | §§12、18、25 相关内容 | 确认 key、digest、secondary event identity 和并发结果 | 不把 Step 13 反向当作唯一 definition source |
| L1-governance / L1-artifact Step 06 / 07 | application object card 粒度 | 参考对象卡深度 | 不复制相邻域 truth |

### 2.1 权威冲突处理

| 冲突 | 当前处理 |
|---|---|
| 历史 application 草稿声明 `ObservationVisibilityDecision` | `HX historical exclusion`；当前只借用 R06.4 canonical `ReadVisibilityDecision`，application 不声明同名或别名 authority |
| public `ObservationConsumerOutcome` / `ObservationJobOutcome` 与候选 disposition | 分层未闭合；A 批不定义 `ObservationConsumerDisposition` 或 `ObservationJobDisposition`，转 `R06.6-E` 并登记 `R06.6-DISPOSITION-LAYER` |
| durable `JobReportState` 与 entry `EntryDisposition` | 两者状态主语不同；A 批不触碰，后续分别回指 report / entry owner |
| `ApplicationError` 在 Step 06 / 07 / 12 交叉 | A 批只声明成员返回的 error family 需由 E 批唯一化，不发明平行错误 enum |
| public name wrapper 与 finite operation | wrapper 只属于 protocol；A 批拥有 typed operation，必须由 total static map无损映射 |

## 3. SOP 问题回答

### 3.1 application 本批需要完成哪些 capability

本批只闭口四个共享能力：

1. 将 Command、Query、Inbound Consumer、Operations Job 约束到有限的 route-neutral operation namespace。
2. 将可信 actor、trace、canonical request digest、idempotency key 和 Consumer source-event identity 组合为不可绕过的 operation context。
3. 将 logical idempotency scope 固定为 operation + effective actor + key，避免不同 family、actor 或 route 共享错误结果。
4. 将 durable reservation lifecycle 与 incoming replay / conflict / in-flight classification 分离，保证只有一个 `Acquired` writer，且 Query 永不进入 reservation writer lane。

本批不承载业务 truth、source truth、external truth、raw body、credential、locator、provider response、final verdict、signoff、真实 run identity 或 evidence alias。

### 3.2 是否需要先收敛 shared vocabulary / typed ref / state

需要，但只复用已经收稳的类型：`ActorSafeRef`、`TraceCorrelationRef`、`SourceEventRef`、`RequestDigest`、`ObservationProducerFamily`、`IdempotencyKey`、`IdempotencyRef` 和 `StoredObservationResultRef`。A 批不复制这些 contracts / core 类型。

本批新定义的状态只有 `IdempotencyReservationState`，其主语是 durable reservation row。`Replay`、`Conflict`、`InFlight` 明确是 incoming outcome，不是状态；不能为“统一管理”新增全局幂等状态机。

### 3.3 哪些输入必须由 application trusted boundary 产生

| 输入 | trusted source | application 约束 |
|---|---|---|
| operation | protocol family + static route/body map | 不接受 handler/path/topic/cron 字符串 |
| actor | authenticated actor 或稳定 system/operator principal | 不使用 process、pod、peer 或 display name |
| request digest | validated typed input 的本地 canonicalizer | transport digest只能做等价校验，不能成为唯一来源 |
| idempotency key | Command / Consumer / Job metadata | Query 必须 absence；不得从时间、payload ref 或随机 attempt 派生 |
| event identity | Consumer operation + static producer family + source event ref | 不从 payload body、dedup key 单独猜出 |

### 3.4 A 批对象如何 1:1 落码

每张对象卡必须给出：Rust-facing 类型或 enum、每个字段的类型/来源/缺失处理、工厂前置条件、成员函数签名及副作用、状态/不变量、rehydrate / repository 交接边界、禁止项和 planned test cuts。由于 `ApplicationError` 的唯一 owner 尚待 E 批裁定，A 批只固定 error **语义类别**，不创建第二个 error enum。

## 4. 当前文档问题诊断

| 位置 | 旧问题 | A 批修复 |
|---|---|---|
| 主控 §6.6.1 | 四类 operation 与 context 以合并代码块出现 | 拆成 5 个 operation 对象卡、event identity 卡和 context 卡 |
| 历史 §7.7 | `ObservationVisibilityDecision` 被误放在 application 草稿 | 标为 `HX`，引用 `ReadVisibilityDecision` 的 domain owner，不复制 authority |
| 幂等草稿 | `attach_result`、state transition、repository CAS边界未分开 | 明确 reserve -> save result -> attach pointer -> CAS complete 的顺序 |
| Query use-site | 共享 context 容易被误读为可 reserve | 固定 Query key/event 均为 `None`，scope factory 拒绝 Query |
| Consumer use-site | dedup key 与 source-event identity 可能漂移 | 增加 `(consumer, producer_family, source_event_ref)` secondary unique 约束 |
| disposition use-site | public、durable、entry 四层混用 | A 批不定义 disposition；登记 `R06.6-DISPOSITION-LAYER`，后续逐层闭口 |

## 5. 设计取舍

| 方案 | 取舍理由 | 当前结论 |
|---|---|---|
| 用一个自由字符串 operation name | 短，但无法保证 family/body/digest 唯一映射 | 禁止 |
| 让每个协议文件定义自己的 operation enum | 便于局部实现，但会形成 48 个 variant 的重复 owner | 禁止；A 批唯一拥有 finite enum |
| 让 Query 也创建 reservation 以“统一幂等” | 会把只读读取误变成 durable replay writer | 禁止；Query 只构造 context |
| 只用 dedup key 识别 Consumer event | key 漂移即可创建第二个 writer | 禁止；必须保留 source-event secondary identity |
| 把 Replay / Conflict / InFlight 存成 reservation 状态 | 会污染 durable lifecycle，并让恢复端误判执行状态 | 禁止；只作为 atomic incoming outcome |
| 公开 struct literal / serde constructor | 可绕过 family-specific required/forbidden field 矩阵 | 禁止；使用 validated factory / rehydrate |
| application 新建 visibility decision | 会与 R06.4 domain P11 形成第二 authority | 禁止；`ReadVisibilityDecision` 只读借用 |

## 6. operation namespace 总览

### 6.1 `ObservationOperationFamily`

```rust
/// Finite family discriminator for application operation identities.
pub(crate) enum ObservationOperationFamily {
    /// A truth, marker, history, or preparation write requested as a command.
    Command,
    /// A read-only query that never enters the reservation writer lane.
    Query,
    /// An inbound event consumer with a secondary source-event identity.
    InboundConsumer,
    /// An observation-side maintenance or publication job.
    Job,
}
```

| variant | stable family code | allowed operation variants | reservation lane | public protocol exposure |
|---|---:|---|---|---|
| `Command` | `0x01` | 16 `ObservationCommandOperation` variants | eligible | mapped from Command name, never serialized as free text |
| `Query` | `0x02` | 14 `ObservationQueryOperation` variants | forbidden | mapped from Query name, never serialized as free text |
| `InboundConsumer` | `0x03` | 9 `ObservationInboundConsumerOperation` variants | eligible | mapped from Consumer name, producer table required |
| `Job` | `0x04` | 9 `ObservationJobOperation` variants | eligible | mapped from Job name, distinct from Command family |

| member | exact signature | invariant |
|---|---|---|
| `code` | `pub(crate) fn code(&self) -> u8` | returns the explicit stable code above; it is not derived from Rust enum ordinal |
| `requires_idempotency` | `pub(crate) fn requires_idempotency(&self) -> bool` | only `Query` returns `false` |
| `allows_inbound_event_identity` | `pub(crate) fn allows_inbound_event_identity(&self) -> bool` | only `InboundConsumer` returns `true` |
| `from_code` | `pub(crate) fn from_code(code: u8) -> Result<Self, ApplicationError>` | unknown code is a consistency error; no fallback family |

The family enum is application-private vocabulary used by the operation identity and digest canonicalizer. It is not a configuration catalog, transport field, authorization decision, or business truth. A future code change requires an explicit digest/schema migration review; silently renumbering variants is forbidden.

### 6.2 `ObservationOperationName`

```rust
/// Route-neutral finite operation identity shared by context, digest, and idempotency.
pub enum ObservationOperationName {
    /// A truth, marker, history, or preparation write requested as a command.
    Command(ObservationCommandOperation),
    /// A read-only operation that never creates an idempotency reservation.
    Query(ObservationQueryOperation),
    /// An inbound event consumer operation with a secondary source-event identity.
    InboundConsumer(ObservationInboundConsumerOperation),
    /// An observation-side maintenance or publication job.
    Job(ObservationJobOperation),
}
```

| 成员函数 | 签名 | 语义 / 不变量 |
|---|---|---|
| `family` | `pub(crate) fn family(&self) -> ObservationOperationFamily` | 按 enum family 静态映射返回；不得从 display string 推导 |
| `requires_idempotency` | `pub(crate) fn requires_idempotency(&self) -> bool` | Command / Consumer / Job 为 `true`，Query 为 `false` |
| `allows_inbound_event_identity` | `pub(crate) fn allows_inbound_event_identity(&self) -> bool` | 仅 Consumer 为 `true` |
| `canonical_discriminator` | `pub(crate) fn canonical_discriminator(&self) -> u16` | 返回下方48条静态表中的`family_code << 8`与`variant_code`按位或结果；不得使用enum display文本或ordinal自动漂移 |
| `as_operation_ref` | `pub(crate) fn as_operation_ref(&self) -> ObservationOperationName` | 返回复制的 typed identity；不得降级为 `String` |

`ObservationOperationName` 的 family 与 discriminator 只能由本节的 application owner 实现。protocol、config、entry 和 Step 13 只能复用该结果，不得定义 local alias、字符串 tag 或平行 enum。

### 6.2.1 48 个 operation 的 canonical discriminator 表

`canonical_discriminator` 使用 `family_code << 8 | variant_code`。variant code 是显式协议表的一部分，保留空位和重新编号都必须经过 affected review。

| family | variant | public name / static route | discriminator |
|---|---|---|---:|
| Command | `SubmitObservationMaterial` | `SubmitObservationMaterial` | `0x0101` |
| Command | `RecordSafetyDisposition` | `RecordSafetyDisposition` | `0x0102` |
| Command | `BindCorrelationContext` | `BindCorrelationContext` | `0x0103` |
| Command | `RecordSafeSignal` | `RecordSafeSignal` | `0x0104` |
| Command | `AppendAuditProjection` | `AppendAuditProjection` | `0x0105` |
| Command | `LinkBodyFreeEvidence` | `LinkBodyFreeEvidence` | `0x0106` |
| Command | `PrepareReportHandoff` | `PrepareReportHandoff` | `0x0107` |
| Command | `EvaluateAuthenticityHint` | `EvaluateAuthenticityHint` | `0x0108` |
| Command | `SetRetentionMarker` | `SetRetentionMarker` | `0x0109` |
| Command | `ProtectActiveReference` | `ProtectActiveReference` | `0x010A` |
| Command | `DefineReplayScope` | `DefineReplayScope` | `0x010B` |
| Command | `RecordNoWriteViolation` | `RecordNoWriteViolation` | `0x010C` |
| Command | `RecordGapState` | `RecordGapState` | `0x010D` |
| Command | `PrepareExternalAuditExport` | `PrepareExternalAuditExport` | `0x010E` |
| Command | `RegisterReferenceSnapshot` | `RegisterReferenceSnapshot` | `0x010F` |
| Command | `UpdateReferenceSnapshotState` | `UpdateReferenceSnapshotState` | `0x0110` |
| Query | `GetObservationReceipt` | `GetObservationReceipt` | `0x0201` |
| Query | `GetIntakeStatus` | `GetIntakeStatus` | `0x0202` |
| Query | `GetSafeSignal` | `GetSafeSignal` | `0x0203` |
| Query | `GetSignalRollup` | `GetSignalRollup` | `0x0204` |
| Query | `GetAuditTimeline` | `GetAuditTimeline` | `0x0205` |
| Query | `GetEvidenceIndexInput` | `GetEvidenceIndexInput` | `0x0206` |
| Query | `GetReportHandoff` | `GetReportHandoff` | `0x0207` |
| Query | `GetRetentionProtection` | `GetRetentionProtection` | `0x0208` |
| Query | `GetObservationReadModel` | `GetObservationReadModel` | `0x0209` |
| Query | `GetDiagnosticView` | `GetDiagnosticView` | `0x020A` |
| Query | `GetGapStatus` | `GetGapStatus` | `0x020B` |
| Query | `GetPeripheralExportView` | `GetPeripheralExportView` | `0x020C` |
| Query | `GetReferenceSnapshotView` | `GetReferenceSnapshotView` | `0x020D` |
| Query | `GetRebuildProgress` | `GetRebuildProgress` | `0x020E` |
| InboundConsumer | `ConsumeBusObservationMaterial` | `ConsumeBusObservationMaterial` | `0x0301` |
| InboundConsumer | `ConsumeSourceAuditMaterial` | `ConsumeSourceAuditMaterial` | `0x0302` |
| InboundConsumer | `ConsumeIdentityObservationContext` | `ConsumeIdentityObservationContext` | `0x0303` |
| InboundConsumer | `ConsumeGovernanceAuditContext` | `ConsumeGovernanceAuditContext` | `0x0304` |
| InboundConsumer | `ConsumeArtifactEvidenceContext` | `ConsumeArtifactEvidenceContext` | `0x0305` |
| InboundConsumer | `ConsumeRuntimeSignalSummary` | `ConsumeRuntimeSignalSummary` | `0x0306` |
| InboundConsumer | `ConsumeSandboxSignalSummary` | `ConsumeSandboxSignalSummary` | `0x0307` |
| InboundConsumer | `ConsumeArchiveHandoffFeedback` | `ConsumeArchiveHandoffFeedback` | `0x0308` |
| InboundConsumer | `ConsumeReportConsumerFeedback` | `ConsumeReportConsumerFeedback` | `0x0309` |
| Job | `PublishObservationOutbox` | `PublishObservationOutbox` | `0x0401` |
| Job | `RebuildObservationReadModels` | `RebuildObservationReadModels` | `0x0402` |
| Job | `RebuildSignalRollups` | `RebuildSignalRollups` | `0x0403` |
| Job | `RefreshReferenceSnapshots` | `RefreshReferenceSnapshots` | `0x0404` |
| Job | `ScanObservationGaps` | `ScanObservationGaps` | `0x0405` |
| Job | `CoordinateObservationReplay` | `CoordinateObservationReplay` | `0x0406` |
| Job | `PrepareReportHandoffDelivery` | `PrepareReportHandoffDelivery` | `0x0407` |
| Job | `PrepareExternalAuditExportDelivery` | public `PrepareExternalAuditExport` Job route | `0x0408` |
| Job | `RebuildPeripheralViews` | `RebuildPeripheralViews` | `0x0409` |

### 6.2 `ObservationCommandOperation`

```rust
/// Finite application command namespace. Each variant has one static protocol/body mapping.
pub enum ObservationCommandOperation {
    /// Admit a body-free observation material submission.
    SubmitObservationMaterial,
    /// Record the local safety and redaction disposition of an observation.
    RecordSafetyDisposition,
    /// Bind an observation to a body-free correlation context.
    BindCorrelationContext,
    /// Record a validated safe signal summary.
    RecordSafeSignal,
    /// Append an observation-side audit projection.
    AppendAuditProjection,
    /// Link body-free evidence metadata without copying evidence content.
    LinkBodyFreeEvidence,
    /// Prepare a report handoff input snapshot.
    PrepareReportHandoff,
    /// Evaluate an observation-side authenticity hint.
    EvaluateAuthenticityHint,
    /// Set or reconcile an observation retention marker.
    SetRetentionMarker,
    /// Protect an active reference used by a local consumer.
    ProtectActiveReference,
    /// Define an observation-only replay scope.
    DefineReplayScope,
    /// Record a blocked forbidden-write attempt.
    RecordNoWriteViolation,
    /// Record an observation-side gap state.
    RecordGapState,
    /// Prepare a body-free external audit export marker.
    PrepareExternalAuditExport,
    /// Register a body-free reference snapshot.
    RegisterReferenceSnapshot,
    /// Update a validated reference snapshot state.
    UpdateReferenceSnapshotState,
}
```

| 约束 | exact contract |
|---|---|
| 总量 | 16 个 variant，与 Step 08 §7.3.1 逐项相等 |
| key | 每个 Command context 必须有 validated `IdempotencyKey` |
| event identity | 必须为 `None` |
| static route | public `ObservationCommandName` + concrete body 只能 total map 到一个 variant |
| collision | `PrepareExternalAuditExport` 只属于 Command variant；不能映射到 Job delivery variant |
| side effect | operation identity 本身不写 truth；具体写入由后续 service / flow 决定 |

### 6.3 `ObservationQueryOperation`

```rust
/// Finite application query namespace. Query context is never a reservation writer.
pub enum ObservationQueryOperation {
    /// Read one observation receipt surface.
    GetObservationReceipt,
    /// Read intake status surfaces.
    GetIntakeStatus,
    /// Read one safe signal surface.
    GetSafeSignal,
    /// Read a signal rollup surface.
    GetSignalRollup,
    /// Read an observation-side audit timeline.
    GetAuditTimeline,
    /// Read body-free evidence index input.
    GetEvidenceIndexInput,
    /// Read a report handoff surface.
    GetReportHandoff,
    /// Read retention and active-reference protection surfaces.
    GetRetentionProtection,
    /// Read a derived observation read model.
    GetObservationReadModel,
    /// Read a diagnostic composite view.
    GetDiagnosticView,
    /// Read gap and degraded status.
    GetGapStatus,
    /// Read a peripheral export view.
    GetPeripheralExportView,
    /// Read a reference snapshot view.
    GetReferenceSnapshotView,
    /// Read maintenance rebuild progress.
    GetRebuildProgress,
}
```

| 约束 | exact contract |
|---|---|
| 总量 | 14 个 variant，与 Step 08 §7.3.2 逐项相等 |
| key | context 中必须为 `None`；不得从 query cursor、request ref 或 timestamp生成 |
| event identity | 必须为 `None` |
| reservation | `ObservationIdempotencyRepository` 必须拒绝 Query context；Query 不保存 result / history / outbox |
| visibility | Query 借用 domain-owned `ReadVisibilityDecision`，不创建 application visibility authority |
| static route | `ObservationQueryName` 与 concrete query body 必须 total map 到一个 variant |

### 6.4 `ObservationInboundConsumerOperation`

```rust
/// Finite inbound consumer namespace. Every variant has one required producer family.
pub enum ObservationInboundConsumerOperation {
    /// Consume a bus observation material event.
    ConsumeBusObservationMaterial,
    /// Consume a source-owner audit material event.
    ConsumeSourceAuditMaterial,
    /// Consume an identity observation context event.
    ConsumeIdentityObservationContext,
    /// Consume a governance audit context event.
    ConsumeGovernanceAuditContext,
    /// Consume an artifact evidence context event.
    ConsumeArtifactEvidenceContext,
    /// Consume a runtime signal summary event.
    ConsumeRuntimeSignalSummary,
    /// Consume a sandbox signal summary event.
    ConsumeSandboxSignalSummary,
    /// Consume archive handoff feedback.
    ConsumeArchiveHandoffFeedback,
    /// Consume report consumer feedback.
    ConsumeReportConsumerFeedback,
}
```

| 约束 | exact contract |
|---|---|
| 总量 | 9 个 variant，与 Step 08 §7.7.1 逐项相等 |
| key | 必须有 stable system-consumer `IdempotencyKey`；不得用 delivery attempt 代替 |
| event identity | 必须为 `Some(ObservationInboundEventIdentity)` |
| producer map | variant 到 `ObservationProducerFamily` 的映射必须是 total static table；配置不能改写 family |
| payload | operation identity 不携带 payload；raw body、credential、provider response 永不进入 context |
| duplicate | secondary source-event identity 与 logical scope 必须指向同一 reservation；不得创建 alias reservation |

### 6.5 `ObservationJobOperation`

```rust
/// Finite observation-side operations job namespace.
pub enum ObservationJobOperation {
    /// Publish immutable outbox payload snapshots.
    PublishObservationOutbox,
    /// Rebuild observation read models from committed local facts.
    RebuildObservationReadModels,
    /// Rebuild signal rollups from stored safe signals.
    RebuildSignalRollups,
    /// Refresh body-free reference snapshots from formal resolver outcomes.
    RefreshReferenceSnapshots,
    /// Scan a fixed observation-side scope for gaps.
    ScanObservationGaps,
    /// Coordinate observation-only replay under retention and no-write guards.
    CoordinateObservationReplay,
    /// Prepare report handoff delivery from a frozen handoff input.
    PrepareReportHandoffDelivery,
    /// Prepare external audit export delivery from a frozen preparation.
    PrepareExternalAuditExportDelivery,
    /// Rebuild product-neutral peripheral views.
    RebuildPeripheralViews,
}
```

| 约束 | exact contract |
|---|---|
| 总量 | 9 个 variant，与 Step 08 §7.9 逐项相等 |
| key | 必须有 operator/system-scoped `IdempotencyKey` |
| event identity | 必须为 `None`；job input 的 source refs不是 inbound event identity |
| execution identity | job operation 不拥有真实 external `run_id`；local execution ref在 R06.6-D 独立定义 |
| collision | public Job `PrepareExternalAuditExport` 必须静态映射到 `PrepareExternalAuditExportDelivery`，不能复用 Command variant |
| side effect | operation identity 不授权 source truth repair、external acceptance、signoff 或 verdict |

## 7. `ObservationInboundEventIdentity` 对象卡

### 7.1 对象职责与边界

`ObservationInboundEventIdentity` 是 Consumer 的 secondary dedup identity。它表达“哪个固定 consumer、代表哪个 authenticated producer family、消费哪个 source event ref”，不表达 payload 内容、delivery attempt、外部业务事实或本地处理结果。

唯一 owner 为 `application::context`。`ObservationProducerFamily` 与 `SourceEventRef` 复用 contracts owner；application 只组合并验证它们的关系。

### 7.2 Rust-facing schema

```rust
/// Stable source-event identity used as a secondary consumer idempotency key.
pub struct ObservationInboundEventIdentity {
    /// Exact inbound consumer operation selected by the static route table.
    consumer: ObservationInboundConsumerOperation,

    /// Authenticated producer family required by the consumer operation.
    producer_family: ObservationProducerFamily,

    /// Body-free source event reference supplied by the validated envelope.
    source_event_ref: SourceEventRef,
}
```

字段不可由 public struct literal 任意组合；跨模块只能通过 typed accessors 或 application factory 读取。

| 字段 | 类型 | 来源 | 缺失 / 非法处理 | 禁止承载 |
|---|---|---|---|---|
| `consumer` | `ObservationInboundConsumerOperation` | protocol static route | 未知 route/body mismatch 在 UoW 前拒绝 | topic、handler、cron、自由字符串 |
| `producer_family` | `ObservationProducerFamily` | envelope header + static compatibility table | mismatch 进入 typed protocol/binding error，不降级为 generic producer | producer display name、credential、payload |
| `source_event_ref` | `SourceEventRef` | validated envelope | missing / empty / body-bearing ref 在解析 payload 前拒绝 | event body、delivery attempt、external receipt |

### 7.3 工厂与成员函数

| kind | exact signature | 作用 / 前置条件 | 副作用 |
|---|---|---|---|
| factory | `pub(crate) fn try_new(consumer: ObservationInboundConsumerOperation, producer_family: ObservationProducerFamily, source_event_ref: SourceEventRef) -> Result<Self, ApplicationError>` | 校验 consumer 的 static producer map、ref 非空且 body-free | 无持久化、无 resolver、无 ack |
| consumer accessor | `pub fn consumer(&self) -> ObservationInboundConsumerOperation` | 返回 typed consumer | 无 |
| producer accessor | `pub fn producer_family(&self) -> ObservationProducerFamily` | 返回 authenticated producer family | 无 |
| source accessor | `pub fn source_event_ref(&self) -> &SourceEventRef` | 返回 opaque ref 借用 | 不解码 ref、不读取外部事件 |
| equality | `pub fn same_source_event(&self, other: &Self) -> bool` | 比较 consumer + producer + source ref 的完整 tuple | 不比较 dedup key 或时间替代 identity |
| rehydrate | `pub(crate) fn try_rehydrate(consumer: ObservationInboundConsumerOperation, producer_family: ObservationProducerFamily, source_event_ref: SourceEventRef) -> Result<Self, ApplicationError>` | persistence mapper 复用完整校验 | 不重新授权、不调用 source adapter |

`ApplicationError` 的具体 variant 由 `R06.6-E` 唯一化；本卡只要求至少能区分 invalid operation-family binding、missing/invalid source event ref 和 persistence invariant failure。

### 7.4 不变量与下游承接

1. `consumer` 必须等于 `ObservationOperationContext.operation_name` 中的 Consumer variant。
2. `producer_family` 必须等于当前 consumer 的 total static compatibility table 结果；不能从 payload 自由改写。
3. 一个 source event identity 只能绑定一个原始 idempotency reservation；改变 dedup key 不得创建第二 reservation。
4. identity 不包含 `occurred_at`、schema version、trace、actor、payload digest；这些属于 envelope/context 的其他字段。
5. identity 不证明 event 已 accepted；`Acquired`、`Replay`、`Conflict`、`InFlight` 由 reservation outcome 表达。

| 下游 | 承接 |
|---|---|
| Step 08 | envelope header 验证后构造 identity，不把 identity 放进 payload |
| Step 09 | Consumer flow 在 reserve 前构造，duplicate 分支只读取原结果 |
| Step 11 | secondary unique index 指向原始 `IdempotencyRef` |
| Step 13 | source-event dedup race、key drift 和 producer mismatch 测试 |
| H12 | 不使用本对象定义 job/item；H12 只承接 accepted item-result |

## 8. `ObservationOperationContext` 对象卡

### 8.1 Rust-facing schema

```rust
/// Trusted application context shared by command, query, consumer, and job services.
pub struct ObservationOperationContext {
    /// Exact finite operation selected by the protocol-family route table.
    operation_name: ObservationOperationName,

    /// Effective actor or stable system/operator principal.
    actor_ref: ActorSafeRef,

    /// Optional body-free trace correlation reference.
    trace_ref: Option<TraceCorrelationRef>,

    /// Required for Command, Consumer, and Job; absent for Query.
    idempotency_key: Option<IdempotencyKey>,

    /// Digest computed from validated typed input by the local canonicalizer.
    request_digest: RequestDigest,

    /// Required only for Inbound Consumer operations.
    inbound_event_identity: Option<ObservationInboundEventIdentity>,
}
```

### 8.2 Family field matrix

| operation family | actor | trace | key | request digest | event identity | reservation lane |
|---|---|---|---|---|---|---|
| Command | required | optional | required | required | `None` | eligible |
| Query | required | optional | `None` | required | `None` | forbidden |
| Inbound Consumer | stable system principal | optional | required | required | required | eligible |
| Job | operator/system principal | optional | required | required | `None` | eligible |

任何 factory 都必须一次性建立完整矩阵。不能先构造 Query context 再 attach key，也不能先构造 Command context 再 attach event identity。

### 8.3 字段来源与校验

| 字段 | exact source | validation / redline |
|---|---|---|
| `operation_name` | typed enum from total static route/body map | unknown name、family/body mismatch、Command/Job collision 在 UoW 前拒绝 |
| `actor_ref` | authenticated API actor 或 stable Consumer/Job principal | 不从 transport peer、process、pod、display name推导 |
| `trace_ref` | validated metadata / envelope / job metadata | 缺失允许；不得从 span parent、route、time 伪造 |
| `idempotency_key` | trusted Command/Consumer/Job metadata | Query 必须 absence；不得使用 attempt、cursor、run id 替代 |
| `request_digest` | normalized typed input + operation family + operation variant + metadata fields defined by canonicalizer | context只保存结果；算法和字段全集由 Step 13/08 affected audit闭合 |
| `inbound_event_identity` | validated Consumer envelope | 仅 Consumer；其 consumer 必须与 operation variant一致 |

### 8.4 工厂与成员函数（factory surface 已被 R06.8-A supersede）

本节原先把以下四个 factory 交给 Step 07 public
`ObservationOperationContextFactory` trait。该 owner 裁定现为
`historical_material_superseded`，不能作为 current trait 或 entry 注入面。
Current 唯一 owner 是 `03_ddd_step_06_application_input_assembly_r06_8a.md`
§4：`ObservationOperationContextFactory` 是 `application::context` 的
`pub(crate)` concrete helper，只由 `ObservationInputAssemblerImpl` 调用；
Step 07 只能暴露三个 finite input-assembler facets。

下表前四行仅保留当时的输入矩阵快照。Current exact callable 还要求返回
`Result<ObservationOperationContext, ApplicationError>`；Command、Consumer、
Job 接收已验证 `RequestDigestCandidates.write_digest()` 的借用，Query 接收
唯一 current digest。实现和后续设计不得从下表恢复 public factory trait、
trait object、entry bundle/accessor或不返回错误的 constructor。

| factory | exact signature | 输出约束 |
|---|---|---|
| Command | `fn for_command(&self, operation: ObservationCommandOperation, actor_ref: ActorSafeRef, idempotency_key: IdempotencyKey, request_digest: RequestDigest, trace_ref: Option<TraceCorrelationRef>) -> ObservationOperationContext` | operation 包成 `Command`；key Some；event None |
| Query | `fn for_query(&self, operation: ObservationQueryOperation, actor_ref: ActorSafeRef, request_digest: RequestDigest, trace_ref: Option<TraceCorrelationRef>) -> ObservationOperationContext` | operation 包成 `Query`；key None；event None |
| Consumer | `fn for_inbound_event(&self, event_identity: ObservationInboundEventIdentity, actor_ref: ActorSafeRef, dedup_key: IdempotencyKey, request_digest: RequestDigest, trace_ref: Option<TraceCorrelationRef>) -> ObservationOperationContext` | operation 从 identity.consumer 派生；key Some；event Some |
| Job | `fn for_job(&self, operation: ObservationJobOperation, actor_ref: ActorSafeRef, idempotency_key: IdempotencyKey, request_digest: RequestDigest, trace_ref: Option<TraceCorrelationRef>) -> ObservationOperationContext` | operation 包成 `Job`；key Some；event None |

| accessor / helper | exact signature | 语义 |
|---|---|---|
| operation | `pub fn operation_name(&self) -> &ObservationOperationName` | 返回完整 typed operation，不返回 route string |
| actor | `pub fn actor_ref(&self) -> &ActorSafeRef` | 只读借用 effective actor |
| trace | `pub fn trace_ref(&self) -> Option<&TraceCorrelationRef>` | 只读借用 optional trace |
| key | `pub fn idempotency_key(&self) -> Option<&IdempotencyKey>` | Query 返回 None |
| digest | `pub fn request_digest(&self) -> &RequestDigest` | 返回 canonical digest |
| event | `pub fn inbound_event_identity(&self) -> Option<&ObservationInboundEventIdentity>` | 仅 Consumer 为 Some |
| required key | `pub fn require_idempotency_key(&self) -> Result<&IdempotencyKey, ApplicationError>` | service 进入 reserve 前使用；Query 返回 typed invalid-lane error |
| scope eligibility | `pub fn reservation_scope(&self) -> Result<ObservationIdempotencyScope, ApplicationError>` | 只允许 Command/Consumer/Job；Query 不创建 scope |

### 8.5 Context 不变量与禁止事项

- context 一旦传入 application service 即不可改写 operation、actor、digest、key 或 event identity；需要新输入必须创建新 context。
- `request_digest` 不是外部签名、业务 truth、evidence proof 或安全授权；它只绑定 normalized input 的 duplicate/conflict 判定。
- `trace_ref` 只作为 observability correlation，不可替代 actor、causation、source event 或 idempotency identity。
- context 不保存 raw request/event body、endpoint、topic、credential、provider payload、SQL、path 或 process-local worker state。
- entry 不得直接用 public name wrapper 构造 context；必须经过 static map 和 family/body validation。

## 9. `ObservationIdempotencyScope` 对象卡

### 9.1 Rust-facing schema

```rust
/// Canonical logical idempotency key under one operation and effective actor.
pub struct ObservationIdempotencyScope {
    /// Full finite operation discriminator, including family and variant.
    operation_name: ObservationOperationName,

    /// Effective actor or stable system principal scope.
    actor_ref: ActorSafeRef,

    /// Caller-supplied idempotency key after boundary validation.
    idempotency_key: IdempotencyKey,
}
```

### 9.2 工厂、成员与 canonical identity

| 函数 | exact signature | 约束 |
|---|---|---|
| context factory | `pub(crate) fn try_from_context(context: &ObservationOperationContext) -> Result<Self, ApplicationError>` | 只接受 Command/Consumer/Job；要求 key Some、event identity与 family一致 |
| explicit factory | `pub(crate) fn new(operation_name: ObservationOperationName, actor_ref: ActorSafeRef, idempotency_key: IdempotencyKey) -> Result<Self, ApplicationError>` | Query operation、空/未校验 key 失败 |
| operation | `pub fn operation_name(&self) -> &ObservationOperationName` | 保留 family + variant |
| actor | `pub fn actor_ref(&self) -> &ActorSafeRef` | 不暴露 profile |
| key | `pub fn idempotency_key(&self) -> &IdempotencyKey` | 不返回裸 normalized string |
| equality | `pub fn same_logical_scope(&self, other: &Self) -> bool` | 比较完整 triple；不同 family/actor不得折叠 |
| canonical parts | `pub(crate) fn canonical_parts(&self) -> (&ObservationOperationName, &ActorSafeRef, &IdempotencyKey)` | repository 建立唯一键；不拼自由字符串 |

逻辑唯一键固定为：

```text
(operation family discriminator, operation variant discriminator,
 effective actor ref, idempotency key)
```

同一个 raw key 在不同 operation 或 actor 下可以合法重复；同一 operation/actor 下不同 key 也必须是不同 scope。不能使用 request digest、source event ref、job execution ref 或 timestamp 代替 scope key。

### 9.3 与 Consumer secondary identity 的关系

Consumer 同时拥有 logical scope 和 event identity：

```text
logical unique: (InboundConsumer variant, system actor, dedup key)
secondary unique: (consumer, producer family, source event ref)
both -> original IdempotencyRef
```

secondary identity 首次建立必须与 reservation acquire 同一原子边界完成。若 event identity 已存在：

| 原 reservation | incoming candidate / scope | outcome |
|---|---|---|
| Reserved | 从`RequestDigestCandidates`按原row profile选出的candidate与row digest相等，且scope/event identity相同 | `InFlight` |
| Completed + compatible result | same-profile candidate与row digest相等，且scope/event identity相同 | `Replay` |
| any existing row | same-profile candidate存在但值不同，或operation、producer、actor、event identity不同 | `Conflict` / typed consistency error |
| any existing row | 原row profile没有readable candidate | `PersistedDigestProfileUnreadable`；不是Conflict |

不得先创建新的 logical reservation，再把 event identity 作为 alias 指回旧行。

### 9.4 `ObservationIdempotencyReservation` 对象卡

`ObservationIdempotencyReservation` 是 application-owned durable reservation row 的内存契约。它只记录一次 eligible Command、Inbound Consumer 或 Job operation 的 logical scope、canonical input digest、可选 Consumer secondary identity 和 exact stored-result pointer；它不保存 result body，也不负责执行业务 truth mutation。

#### 9.4.1 Rust-facing schema

```rust
/// Durable reservation owned by one eligible application operation.
pub struct ObservationIdempotencyReservation {
    /// System-generated identity of the reservation row.
    idempotency_ref: IdempotencyRef,

    /// Complete operation, actor, and caller-key identity.
    scope: ObservationIdempotencyScope,

    /// Canonical digest of the validated operation input.
    request_digest: RequestDigest,

    /// Secondary identity used only by an inbound Consumer reservation.
    inbound_event_identity: Option<ObservationInboundEventIdentity>,

    /// Durable lifecycle of this reservation row.
    state: IdempotencyReservationState,

    /// Exact stored result pointer after result persistence succeeds.
    stored_result_ref: Option<StoredObservationResultRef>,
}
```

| field | type | source | invariant / missing handling |
|---|---|---|---|
| `idempotency_ref` | `IdempotencyRef` | application identity mint at the sole acquired writer boundary | never derived from key, digest, timestamp or source event; missing persisted identity is a consistency error |
| `scope` | `ObservationIdempotencyScope` | validated `ObservationOperationContext` | Query operation is rejected; family, variant, actor and key remain lossless |
| `request_digest` | `RequestDigest` | local canonicalizer over validated typed input | 新acquired row只保存current write candidate；retained row永远保留其原profile/value；transport-provided digest只与write candidate做pre-mutation equivalence check |
| `inbound_event_identity` | `Option<ObservationInboundEventIdentity>` | validated Consumer envelope | `Some` only for Inbound Consumer and must match scope operation; Command/Query/Job require `None` |
| `state` | `IdempotencyReservationState` | reserve factory or validated state transition | persisted lifecycle is only `Reserved` or `Completed`; unknown token fails closed |
| `stored_result_ref` | `Option<StoredObservationResultRef>` | result repository after exact result persistence | `Completed` requires `Some`; a persisted `Reserved` row must have `None`; the pointer never contains result body |

#### 9.4.2 Factory, accessors and mutation boundary

| member | exact signature | contract / side effect |
|---|---|---|
| acquired factory | `pub(crate) fn reserve(idempotency_ref: IdempotencyRef, scope: ObservationIdempotencyScope, request_digest: RequestDigest, inbound_event_identity: Option<ObservationInboundEventIdentity>) -> Result<Self, ApplicationError>` | validates family/event compatibility, starts at `Reserved` with no result pointer; does not write a store |
| rehydrate factory | `pub(crate) fn try_rehydrate(idempotency_ref: IdempotencyRef, scope: ObservationIdempotencyScope, request_digest: RequestDigest, inbound_event_identity: Option<ObservationInboundEventIdentity>, state: IdempotencyReservationState, stored_result_ref: Option<StoredObservationResultRef>) -> Result<Self, ApplicationError>` | validates persisted shape and all cross-field relations; never reruns operation or reads current business truth |
| reservation ref | `pub fn idempotency_ref(&self) -> &IdempotencyRef` | returns stable row identity; no minting or normalization |
| scope | `pub fn scope(&self) -> &ObservationIdempotencyScope` | returns the complete logical key; no string flattening |
| digest | `pub fn request_digest(&self) -> &RequestDigest` | returns canonical input digest; does not expose raw input |
| event identity | `pub fn inbound_event_identity(&self) -> Option<&ObservationInboundEventIdentity>` | returns the secondary identity only when present |
| state | `pub fn state(&self) -> IdempotencyReservationState` | returns the durable state value |
| result pointer | `pub fn stored_result_ref(&self) -> Option<&StoredObservationResultRef>` | returns pointer only; does not load or decode result |
| incoming match | `pub(crate) fn matches_incoming(&self, scope: &ObservationIdempotencyScope, candidates: &RequestDigestCandidates, inbound_event_identity: Option<&ObservationInboundEventIdentity>) -> Result<bool, ApplicationError>` | 先比较完整scope与Consumer secondary identity，再只选择`candidates.for_profile(self.request_digest.profile())`比较；candidate缺失返回`PersistedDigestProfileUnreadable`，不得fallback到write profile；无mutation |
| attach result | `pub(crate) fn attach_result(&mut self, result_ref: StoredObservationResultRef) -> Result<(), ApplicationError>` | allowed once while local state is `Reserved`; pointer must be non-empty and is attached in the same UoW as result persistence |
| complete | `pub(crate) fn complete(&mut self) -> Result<(), ApplicationError>` | allowed only from `Reserved` with an attached result pointer; transitions to `Completed`; must not be committed separately from the result |

`attach_result` is a same-UoW staging operation, not an independently durable intermediate state. A repository mapper must never expose a committed `Reserved + Some(result_ref)` row. `complete` cannot infer or create a result pointer and cannot be called twice.

#### 9.4.3 Reservation lifecycle and forbidden behavior

```text
validated context -> derive logical scope -> atomic reserve lookup
  -> Acquired(Reserved, no result)
  -> domain/application mutation and exact result construction
  -> persist result -> attach result pointer -> CAS reservation Completed
```

- The reservation owns only idempotency truth; it does not own receipt, report, outbox payload, external intent, job plan, claim, source truth or evidence body.
- A duplicate or conflict path never calls `attach_result`, `complete`, domain mutation, outbox append, job start or external adapter.
- A completed reservation with a missing, corrupt or incompatible result is a consistency defect; the service must not rebuild a result from current truth or rerun the operation.
- `RequestDigestCandidates` 只在atomic admission调用栈中存在，不进入reservation字段、stored result、report或telemetry。`ObservationOperationContext.request_digest`与新reservation均保存write candidate；命中旧profile row时，旧row digest保持authoritative，current write digest不能覆盖它。
- Consumer secondary identity and logical scope are established in the same atomic reservation boundary; an alias row is forbidden.

### 9.5 `IdempotencyReservationState` 对象卡

`IdempotencyReservationState` 的状态主语是 durable reservation row。它不是 public Command / Consumer / Job outcome，也不是 stored result kind、report state 或 entry disposition。

```rust
/// Durable lifecycle state of one idempotency reservation row.
pub enum IdempotencyReservationState {
    /// The reservation owns the operation slot and awaits its exact result.
    Reserved,

    /// The exact result has been stored and the reservation is terminal.
    Completed,
}
```

| variant | stable token | entry condition | allowed transition | forbidden interpretation |
|---|---|---|---|---|
| `Reserved` | `reserved` | sole atomic `Acquired` writer | `Completed` only after result pointer is attached | not a retry permission, claim, job-running state or public delayed outcome |
| `Completed` | `completed` | result-before-complete CAS succeeds | none | not a `DuplicateReplayed` marker; duplicate is an incoming outcome |

| member | exact signature | contract |
|---|---|---|
| token | `pub(crate) fn as_token(&self) -> &'static str` | returns the explicit stable persistence token; never Rust ordinal or display text |
| parse | `pub(crate) fn from_token(token: &str) -> Result<Self, ApplicationError>` | accepts exactly `reserved` or `completed`; unknown, case-variant and alias tokens fail closed |
| terminal check | `pub fn is_terminal(&self) -> bool` | only `Completed` returns `true` |
| transition check | `pub(crate) fn can_transition_to(&self, next: Self) -> bool` | only `Reserved -> Completed` returns `true`; self-transition and reverse transition are false |
| transition | `pub(crate) fn transition(self, next: Self) -> Result<Self, ApplicationError>` | validates the matrix without persistence; caller must still enforce result-before-complete |

State transitions do not create an idempotency ref, result, record, outbox item, claim or audit event. `Replay`, `Conflict` and `InFlight` never enter this enum.

### 9.6 `ObservationIdempotencyReserveOutcome` 对象卡

`ObservationIdempotencyReserveOutcome` is the single atomic return from the idempotency repository boundary. It tells the service whether this incoming request is the one writer, an exact replay, a digest/identity conflict, or an operation already in flight. It is not persisted and is not a replacement for the reservation state.

```rust
/// Atomic classification of one incoming eligible operation.
pub enum ObservationIdempotencyReserveOutcome {
    /// This request acquired a new Reserved reservation and may enter the writer lane.
    Acquired(ObservationIdempotencyReservation),

    /// A compatible Completed reservation has an exact stored result to replay.
    Replay {
        /// Existing reservation identity.
        idempotency_ref: IdempotencyRef,
        /// Exact result pointer owned by that reservation.
        result_ref: StoredObservationResultRef,
    },

    /// An existing reservation or event identity conflicts with this request.
    Conflict {
        /// Existing reservation identity; no conflicting digest is exposed here.
        idempotency_ref: IdempotencyRef,
    },

    /// A same-material Reserved reservation is owned by another in-progress writer.
    InFlight {
        /// Existing reservation identity.
        idempotency_ref: IdempotencyRef,
    },
}
```

| variant | exact precondition | writer permission | incoming side effect |
|---|---|---|---|
| `Acquired` | no compatible logical or secondary reservation exists | only `Acquired` may enter mutation / job start | current UoW may proceed; result must be stored before completion |
| `Replay` | existing `Completed`, same scope/identity，row-profile candidate相等且result pointer compatible | none | rollback incoming UoW, then read and validate exact stored surface；不改写旧profile |
| `Conflict` | same-profile candidate不同，或existing identity与scope/actor/family/producer/event identity冲突 | none | rollback; do not expose old result or create an alias；profile不同本身不是Conflict |
| `InFlight` | existing `Reserved` row与row-profile candidate及identity相容 | none | rollback; return delayed/in-flight mapping; do not start a second writer |

| member / constructor | exact signature | invariant |
|---|---|---|
| acquired | `pub(crate) fn acquired(reservation: ObservationIdempotencyReservation) -> Result<Self, ApplicationError>` | accepts only a `Reserved` reservation with no stored result pointer |
| replay | `pub(crate) fn replay(idempotency_ref: IdempotencyRef, result_ref: StoredObservationResultRef) -> Result<Self, ApplicationError>` | requires both non-empty typed refs; does not load result or change reservation |
| conflict | `pub(crate) fn conflict(idempotency_ref: IdempotencyRef) -> Result<Self, ApplicationError>` | identifies existing row only; does not expose incoming or stored digest |
| in-flight | `pub(crate) fn in_flight(idempotency_ref: IdempotencyRef) -> Result<Self, ApplicationError>` | identifies an existing Reserved row; does not authorize polling or retry loop |
| reservation ref | `pub fn idempotency_ref(&self) -> &IdempotencyRef` | returns the existing or acquired reservation identity for diagnostics and repository handoff |
| writer check | `pub fn is_acquired(&self) -> bool` | only `Acquired` returns `true` |
| rollback check | `pub fn requires_incoming_rollback(&self) -> bool` | `Replay`, `Conflict` and `InFlight` return `true`; `Acquired` returns `false` |
| replay pointer | `pub fn replay_result_ref(&self) -> Option<&StoredObservationResultRef>` | `Some` only for `Replay`; no result body or current-truth reconstruction |

The repository must classify logical-key and Consumer secondary-index collisions in one atomic operation and receive the complete `RequestDigestCandidates`. It must not first create a new reservation and later discover an event alias. It selects exactly the candidate matching an existing row's retained profile; absence maps to `PersistedDigestProfileUnreadable`, while a value difference maps to `Conflict`. A `Completed` row with a missing or incompatible result is an application/persistence error, not `Replay` and not permission to rerun.

## 10. A 批对象卡写入检查点

| 检查项 | 结论 |
|---|---|
| 48 个 finite operation variant 是否有唯一 owner | pass for A；Command 16、Query 14、Consumer 9、Job 9 |
| Query 是否明确排除 reservation | pass；context key/event 均为 None，scope factory拒绝 |
| Consumer producer map 是否保留 | pass；由既有 Step 08 total static map承接，identity factory必须校验 |
| actor / digest / key / event 字段来源是否闭合 | pass for A fields；canonical digest算法已由F1闭合，Step 13只保留affected audit |
| reservation / state / incoming outcome 是否逐对象闭口 | pass for A；reservation、two-state lifecycle 与 four-way atomic outcome 均有独立卡；result-before-complete 与 zero-write boundary 已固定 |
| raw body / external truth 是否进入对象 | no |
| visibility decision 是否产生第二 owner | no；历史名 `ObservationVisibilityDecision` 为 HX，canonical `ReadVisibilityDecision` 归 domain |
| disposition 层级是否已闭合 | A批当时未闭合；当前已由E批以`resolved_in_E_design_only`闭合，不影响A对象 |
| ApplicationError 是否已唯一化 | A批当时未闭合；当前唯一owner已由E批固定，F1只回灌五个digest variant |
| 正式 `03` 是否已修改 | no |

## 11. 待确认事项与下游承接

| ID | 状态 | A 批处理 |
|---|---|---|
| `R06.6-DISPOSITION-LAYER` | `historical_open_in_A; current=resolved_in_E_design_only` | A批不得合并public outcome、durable report state、one-shot application result与entry disposition；E批已固定五层边界 |
| `R06.6-APP-ERROR-OWNER` | `historical_open_in_A; current=resolved_in_E_design_only` | A对象成员只消费application error family；E批已闭合唯一owner与protocol/entry mapping边界 |
| `R06.6-DIGEST-CANONICALIZER` | `historical_open_in_A; current=resolved_in_F1_design_only` | A只固定digest承载位置；F1已闭合normalized typed encoding、profile和mismatch handling，Step13只待affected review |
| `R06.6-CONSUMER-PRODUCER-MAP` | `pass_input_consumed` | 复用 Step 08 9 条 total static mapping；若后续改动必须 affected review，不得 local override |
| `R06.6-QUERY-VISIBILITY-OWNER` | `resolved_historical_exclusion` | `ReadVisibilityDecision` 是 R06.4 domain owner；`ObservationVisibilityDecision` 不得恢复 |
| `R06.6-H12-ITEM-INPUT` | `pass_reservation_only` | H12 只接受最小 accepted item result；A 不定义 job/item/report |

## 12. 本批回填草稿与停止条件

本批不得回填正式 `03-详细设计.md`。未来正式 §5 application 章节只能引用本文件 §§6~10，并在 `R06.6-F` 完成 owner / field / state / affected-use audit 后装配。

进入 `R06.6-B` 前必须满足：

1. 用户确认本 A 批对象卡完成；
2. A 批 11 个对象名称、字段和 family matrix 在主控 inventory、contracts carrier owner registry、Step 08 static route map 中保持一致；
3. `R06.6-DISPOSITION-LAYER` 不得被 B 批隐式复用；
4. 正式 `03`、Step 07~19、`04` 和实现仓继续冻结。

### 12.1 A 批模块内停审结论

```text
application::operations
  finite operation namespace (48 variants)
        |
        v
application::context
  event identity + family-specific operation context
        |
        v
application::idempotency
  scope -> atomic reserve outcome -> Reserved / Completed
```

关键说明：

- 图表达对象 owner 和数据依赖方向，不表达 Step 09 调用时序。
- Query 在 context 层结束，不进入 reservation repository。
- Consumer identity 是 secondary dedup key，不是 consumer receipt 或 job item。
- reservation completion 依赖后续 stored result，但本批不定义 stored result schema。

历史停审结论：`R06.6-A_done_waiting_user`；该 checkpoint 已由用户确认并被 R06.6-B 消费。B/C/D-1~D-6/E/F1现已完成design-only，当前恢复点为`R06.6-F1-W3_done_waiting_user_before_F2`；未经用户确认不得读取或写入F2对象契约。
