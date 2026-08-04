# L4-observability 03-详细设计 Step 07 - Trait / Port / Adapter 契约

> 对应 SOP: `standards/document/详细设计讨论流程_SOP.md` Step 07
> 回填位置: `03-详细设计.md` §5 各模块的 Trait / Port / Adapter 契约、§6 全局索引
> 当前模式: full-restart / affected-only rebuild
> 恢复辅助: `design-calibration/03_ddd_step_07_affected_inventory.md`
> 当前边界: 本文件完成后停审；不自动进入 Step 08，不修改正式 `03-详细设计.md`

## 1. Step 状态

| 项 | 当前值 |
|---|---|
| 当前正式文档 | `projects/L4-observability/03-详细设计.md` |
| 当前 Step | Step 07 `逐模块定义 Trait / Port / Adapter 契约` |
| 上游门禁 | Step 06 R06.8-B 已完成 design-only，用户已明确确认进入 Step 07 |
| 本步输出 | 本文件 + `03_ddd_step_07_affected_inventory.md` |
| 当前写入批次 | S07-F `cross-module closure / Step 08 handoff`，已完成 design-only 闭环和静态审查 |
| Step 状态 | `affected_rebuild_S07-F_complete_waiting_user_before_Step08` |
| 正式回填 | frozen；等待 Step 19 统一重装配 |
| 下一 Step | Step 08 frozen；必须等待用户明确确认后才可读取 Step 08 SOP / 书写规范和 current handoff |
| 实现 / 测试 | 未实现；所有实现验证均为 `planned/not_run` |
| 提交 | 不需要；用户未要求提交 |

本文件取代旧 Step 07 的 current 地位。旧 Step 07 中五 façade、裸 context factory、worker publication loop、aggregate runtime、旧 idempotency/UoW/Job/outbox 接缝均为 historical material；只有经过本文件逐模块重新定义的契约才可进入后续 Step 或正式装配。

## 2. 输入、权威顺序与范围

### 2.1 必读输入消费记录

| 输入 | 本步实际消费 | 权威限制 |
|---|---|---|
| `详细设计讨论流程_SOP.md` Step 07 | 按模块先列 capability / 接缝，再写 trait、Rust 签名、调用方/实现方和模块停审，最后做跨模块审计 | 不允许先堆全仓 port 总表后补 owner |
| `详细设计书写规范.md` 5.5 / 5.6 | trait 表、Rustdoc、参数/返回/error、实现方/调用方、正式回填与索引格式 | 索引不得新增正文未定义判断 |
| `设计文档讨论中间产物规范.md` | full-restart、historical material、逐 Step 门禁、台账恢复 | 本 Step 不越过 Step 08 |
| `设计真相源闭环与可落码性标准.md` | 唯一 owner、definition/use 闭环、落码级签名和禁止伪证据 | 不用抽象“调用数据库/外部服务”替代 port |
| current `00/01/02` | observation-owned truth、no-write、redaction、body-free、product-neutral、七模块依赖方向 | 外部业务 truth 只读，不反写 |
| Step 05 current module contract | `contracts/domain/application/infra/api/worker/jobs` 七模块主轴 | worker publication 描述已被 R06.8-B 标为 affected use |
| Step 06 current owner set | 对象、字段、状态、result/error、runtime/entry carrier、48 input、四 façade、Job/outbox/external effect/UoW | Step 07 只定义接缝，不重复定义对象 schema |
| R06.8-A / R06.8-B | 三个 assembler facet、48 exact methods、single publication Job、三个 finite runtime/activation、十项 handoff | 优先于冻结 Step 07 的所有冲突片段 |
| L1-governance / L1-artifact Step 07 | 只参考模块停审、version/UoW/read surface、fake parity和粒度 | 不复制相邻域名称或 truth |

精确 Step 06 owner 与章节入口已登记在 `03_ddd_step_07_affected_inventory.md` §2，后续每个 trait 小节都必须回指其 owner，不得从旧 Step 07 猜测类型或字段。

### 2.2 本步范围

本步定义：

- `application` 的三个 input assembler trait、四个 entry-callable service façade。
- `application` 的 UoW、clock、typed ID、repository、projection、idempotency、stored result、outbox、Job coordination、resolver、publisher、handoff/export port。
- `infra` 对 application port 的实现责任、fake/durable semantic parity、runtime builder、registrar和 process-local activation 接缝。
- `api`、`worker`、`jobs` 对 matching assignment 的 least-authority 消费边界。
- 每个模块的 capability / 接缝清单、实现方/调用方、停审和最终跨模块闭环审计。

本步不定义：

- 新 public DTO、event、receipt、job schema或 response mapping；这些属于 Step 08。
- 逐接口算法、事务伪代码、状态迁移矩阵、DDL、错误恢复矩阵或配置值；这些分别属于 Step 09~14。
- source/business truth writer、raw body fetcher、验收签署、真实 evidence alias、external acceptance truth或跨进程联合 activation。
- 实现依赖、commit、run id、测试结果或真实 evidence。

## 3. 全局设计裁定

### 3.1 Port owner 与依赖方向

| 接缝类别 | 定义 owner | 直接调用方 | 实现方 | 边界结论 |
|---|---|---|---|---|
| input assembler | `application::input_assembly` | matching entry module | `application::input_assembly::ObservationInputAssemblerImpl` | 同步、无 I/O；entry只见 matching facet |
| service façade | `application::services` | `api` / `worker` / `jobs` | `application` concrete service | entry唯一业务调用面 |
| persistence / projection / UoW | `application::ports` | application service/helper | `infra` | version、transaction、read surface由application契约控制 |
| resolver / external effect | `application::ports` | application service/internal collaborator | `infra` | body-free、stable token、finite result；无source write |
| runtime builder | `infra::runtime_builder` | selected process startup | `infra` | 三个 profile-specific build method；无aggregate runtime |
| registrar / registered handle | `infra::entry_registration` | `worker` / `jobs` process-local activation | `infra` | technical seam，不是application business port |
| activation seam | selected `api` / `worker` / `jobs` entry root | selected process startup | matching entry module | 消费一个 matching runtime；不声明跨进程原子性 |

依赖方向固定为：

```text
contracts <- domain <- application <- infra <- api / worker / jobs
```

箭头表示外层可依赖内层。`infra` 实现 `application` port，但 application 不导入 infra；entry 模块不得互相依赖，也不得绕过 façade 调用 repository/adapter。

### 3.2 Sync / async 与 object-safe lowering

Assembler 只做 typed validation、canonical digest/context/input assembly，无 I/O，所有方法为同步 `fn`。

Service、repository、resolver、publisher、registrar和runtime activation可能等待 I/O，语义均为 asynchronous。Runtime assignment 持有 `Arc<dyn ...>` / `Box<dyn ...>`，因此本 Step 选择显式 boxed future 作为可落码的 object-safe lowering，不锁定 `async_trait` 或其他第三方宏：

```rust
use std::future::Future;
use std::pin::Pin;

/// Object-safe asynchronous result returned by application service traits.
pub type ApplicationServiceFuture<'a, T> = Pin<
    Box<dyn Future<Output = Result<T, ApplicationError>> + Send + 'a>,
>;

/// Object-safe asynchronous result returned by application port traits.
pub type ApplicationPortFuture<'a, T> = Pin<
    Box<dyn Future<Output = Result<T, ApplicationError>> + Send + 'a>,
>;
```

Step 06 中的 `async fn method(...) -> Result<T, ApplicationError>` 是语义签名；本文件的 `fn method<'a>(&'a self, ...) -> Application*Future<'a, T>` 保持同一参数、结果、错误与生命周期语义，并明确动态分派形式。实现仓若在 reality check 后采用行为等价的原生 async trait lowering，必须证明 object safety、Send 和 fake/durable parity，不能改变 public capability。

### 3.3 错误 owner

| 层 | 唯一 error owner | 本步规则 |
|---|---|---|
| protocol | `contracts::errors::ProtocolError` | assembler前的wire/schema错误；不得进入repository |
| domain | `domain::errors::DomainError` | 由唯一 `ApplicationError::Domain` 映射；port不解析message |
| application | `application::errors::ApplicationError` | 所有application trait只返回该类型；本步不重复enum |
| runtime assembly | Step 06 C-15 `RuntimeAssemblyError` | builder/registrar/activation startup失败；不是business invocation error |
| entry invocation | existing `ApiError` / `WorkerError` / `JobError` | mapping留Step 12；不得接收raw provider error |

Provider/driver错误必须由 infra adapter 在边界映射为现有 finite application/runtime分类。禁止字符串解析、generic `retryable: bool`、raw SQL/endpoint/provider response、stack或credential进入上层错误。

## 4. Historical material 与 affected 结论

| 旧形状 | current处置 | 原因 |
|---|---|---|
| public `ObservationOperationContextFactory` trait / entry getter | 删除；只保留application-private concrete helper | R06.8-A固定entry只能取得三个assembler facet |
| `ObservationMaintenanceService` | 删除且无alias；由`ObservationOperationsJobService`统一九Job | publication也是Operations Job，不存在双入口authority |
| entry-visible `ObservationPublicationService` trait | 删除；同名只保留crate-private claimed-item collaborator struct | 不允许worker loop或第五façade |
| `reserve_or_load(context)` | 删除 | 无法原子接收logical scope、secondary event identity和完整digest candidates |
| record-before-cursor / consuming save | 删除 | 违反F2 three-phase closure和borrowed post-state |
| generic history ID / generic append | 删除 | H1~H6/H8~H13有12个family owner，H7不存在 |
| `JobExecutionRef` / naked fence / plan-local key | 删除 | D-2~D-6固定local execution/plan/claim/global typed work-key和exact tuple |
| worker eligible outbox scan | 删除 | candidates只在`PublishObservationOutbox` Job start冻结为immutable plan item |
| payload rebuild / raw publisher result | 删除 | publisher只消费stable token + immutable stored snapshot并返回finite carrier |
| aggregate `BuiltObservabilityRuntime` | 删除且无generic replacement | C-13固定三个互斥profile-specific runtime |
| registrar partial handle / schedule synthesis | 删除 | registration all-or-nothing；scheduler必须传完整existing Job request |

完整旧章节处置见 inventory §5。本文件后续出现 historical 名称时，只能位于明确的禁止/迁移表，不能作为可实现接口。

## 5. `contracts` 模块

### 5.1 Port capability / 接缝清单

| capability / 对象能力 | 是否需要本模块port | 调用方 | 实现方 | 后续承接 |
|---|---|---|---|---|
| typed ref / metadata / public request / response / event / job carrier | 否 | entry/application按依赖方向读取 | 不适用 | Step 08逐协议定义 |
| public page/cursor/view/receipt/error surface | 否 | application response assembler、entry mapper | 不适用 | Step 08 / 09 |
| repository、resolver、publisher、runtime | 禁止 | 不适用 | 不适用 | 归application/infra |

`contracts` 不定义 repository、gateway、adapter、UoW、runtime、registrar或service trait。公共 carrier 不能因某个 port 参数需要而临时补造；若 Step 07 发现缺失 public type，必须登记 Step 08 blocker，而不是在本模块越权定义。

### 5.2 模块停审

| 审查项 | 结论 | 修正 / 证据 |
|---|---|---|
| 是否出现反向依赖 | pass | 所有port owner均在application/infra |
| 是否提前新增协议 | pass | 本文件只引用Step 06已存在carrier和冻结Step 08名称 |
| 是否承载业务truth | pass | carrier只传递body-free public surface |
| 模块结论 | `pass_no_port_required` | Step 08必须逐协议闭合schema和mapping |

## 6. `domain` 模块

### 6.1 Port capability / 接缝清单

| capability / 对象能力 | 是否需要本模块port | 调用方 | 实现方 | 后续承接 |
|---|---|---|---|---|
| aggregate/entity/value/state/policy transition | 否 | application直接调用domain方法 | domain concrete object | Step 09 flow / Step 10 matrix |
| H1~H6/H8~H13 record factory | 否 | application record assembler | domain concrete factory | 本文件application repository append接缝 |
| repository/external read/time/id | 禁止 | 不适用 | 不适用 | application port注入 |

Domain object只接收typed value与显式policy input。它不访问clock、repository、UoW、resolver、config、bus、external client或entry context；domain factory拒绝返回`DomainError`，不返回provider/transaction error。

### 6.2 模块停审

| 审查项 | 结论 | 修正 / 证据 |
|---|---|---|
| domain是否定义port | pass | 无；I/O接缝全部外移application |
| application是否反向进入domain | pass | domain不导入application类型 |
| record是否被写成generic repository object | pass | 12个family保持typed owner；H7明确不存在 |
| 模块结论 | `pass_no_port_required` | 后续trait只引用domain对象，不改写其不变量 |

## 7. `application` 模块

### 7.1 Port capability / 接缝清单

| capability / 对象能力 | 接缝 | 直接调用方 | 实现方 | 后续承接 |
|---|---|---|---|---|
| public carrier -> complete concrete input | 3个input assembler facet | matching entry | application concrete assembler | Step 08 mapping / Step 09 admission |
| 16 Command、14 Query、9 Consumer、9 Job编排 | 4个service façade | entry | application service impl | Step 09逐flow |
| local atomic mutation与one-cursor commit | UoW manager/UoW、clock、typed ID | service/record assembler | infra | Step 11/13 |
| observation truth/state/read model persistence | typed repository/projection port | service | infra | Step 09/11 |
| duplicate/replay/stored result | idempotency/result repository | writer service | infra | Step 11/13 |
| immutable outbound publication | outbox repository + event publisher/probe | Job/internal collaborator | infra | Step 11/13/14 |
| Job plan/item/claim/report | coordination repositories | unified Job service | infra | Step 09/11/13 |
| body-free external lookup | finite resolver ports | service | infra | Step 09/14 |
| handoff/export external effect | intent/result repositories + delivery/probe ports | unified Job service | infra | Step 09/11/13/14 |

### 7.2 Trait / Port / Adapter 索引

本表是application模块内导航，不替代后续具体签名。

| 名称族 | 类型 | 定义位置 | 作用 | 关键边界 |
|---|---|---|---|---|
| `Observation*InputAssembler` 3 traits | input boundary | `application::input_assembly` | 48个exact public carrier到private input的同步assembly | 无I/O、无裸factory |
| 4 `Observation*Service` traits | service façade | `application::services` | entry唯一business callable | exact input by value；async object-safe |
| `ObservationUnitOfWork*` | transaction port | `application::unit_of_work` | local atomic staged write、one cursor、commit guard | external call禁止跨UoW |
| `ClockPort` / `IdGeneratorPort` | technical port | `application::ports` | trusted local time和typed new identity | 无generic ref mint |
| domain-family repositories | persistence port | `application::ports::repositories` | versioned read、borrowed stage、typed record append | expected version必须来自read |
| projection/source planner | read/write port | `application::ports::projection` | query read、stale marker、replacement/read fence | Query只读subset |
| idempotency/result/outbox | persistence port | `application::ports` | atomic admission、immutable replay、outbox CAS | no payload rebuild |
| Job execution/report | coordination port | `application::ports::jobs` | immutable plan、item CAS、exact claim tuple、lossless report | no public run aslocal identity |
| resolvers | external read port | `application::ports::resolvers` | body-free summary/visibility/freshness | no source write/body |
| publisher/delivery/probe | external effect port | `application::ports::external_effects` | stable token + immutable material + finite result | call outside DB UoW |

### 7.3 Shared call conventions

所有 application port 遵守以下共同规则：

1. Point mutation先通过matching `get_*_with_version`取得`Versioned<T>`；`expected_version`只能来自该结果，不从cursor、timestamp、digest或caller构造。
2. UoW内write方法接收`&dyn ObservationUnitOfWork`，对象以借用或专用staged snapshot传入；禁止为了后续record factory而`Clone` aggregate或commit后reload。
3. Append-only record/intent/result使用typed append，重复identity是whole-UoW conflict，不允许update/upsert/delete。
4. Page读取使用opaque repository cursor；public page cursor只在application mapper中转换，二者不能互换。
5. Query service只调用明示read-only方法；它不取得UoW manager、idempotency、outbox、external delivery或任何`mark_*`方法。
6. Adapter不得根据provider状态选择domain transition；application完成policy/transition，infra只持久化或调用有限external capability。
7. 所有collection返回前保持owner定义的canonical order/uniqueness；repository不能悄悄截断、补默认项或把missing改为空success。
8. `ApplicationError`是唯一上层error；infra-private cause只用于redacted issue mapping，不进入result、log payload、evidence或public surface。

### 7.4 Input assembler capability 与 visibility

```text
contracts typed request / envelope / metadata
                 |
                 v
application::input_assembly
  exact family/body validation
  -> exact typed material
  -> digest or digest candidates
  -> optional supplied-digest equivalence check
  -> private context factory
  -> one concrete application input
                 |
                 v
matching application service method
```

| Facet | 方法总数 | 可见调用方 | concrete implementation | 禁止能力 |
|---|---:|---|---|---|
| `ObservationApiInputAssembler` | 30 = 16 Command + 14 Query | API assignment only | shared `ObservationInputAssemblerImpl` | Consumer/Job assembly、repository、raw hash |
| `ObservationInboundInputAssembler` | 9 Consumer | worker assignment only | shared `ObservationInputAssemblerImpl` | ack/dead-letter、source fetch、Job assembly |
| `ObservationJobInputAssembler` | 9 Operations Job | jobs assignment only | shared `ObservationInputAssemblerImpl` | scheduler request synthesis、candidate list、claim mint |

`ObservationInputAssemblerImpl`、`ObservationDigestCanonicalizer`和`ObservationOperationContextFactory`均为 `pub(crate)` concrete helper。Runtime builder可以让三个 trait object共享同一个immutable implementation，但每个assignment只获得matching facet；不存在concrete getter、facet conversion、`Any`、downcast、generic `assemble`、generic `digest`或context/canonicalizer accessor。

### 7.5 三个 input assembler trait

下列签名逐项消费R06.8-A；request/envelope/job wrapper由`contracts`拥有，concrete `*Input`由`application::inputs`拥有。本节不重复定义任何字段。

```rust
/// Synchronous input assembly available only to the API entry assignment.
pub trait ObservationApiInputAssembler: Send + Sync {
    /// Assemble SubmitObservationMaterial after exact command validation.
    fn submit_observation_material(&self, request: ObservationCommandRequest<SubmitObservationMaterialRequest>) -> Result<SubmitObservationMaterialInput, ApplicationError>;
    /// Assemble RecordSafetyDisposition after exact command validation.
    fn record_safety_disposition(&self, request: ObservationCommandRequest<RecordSafetyDispositionRequest>) -> Result<RecordSafetyDispositionInput, ApplicationError>;
    /// Assemble BindCorrelationContext after exact command validation.
    fn bind_correlation_context(&self, request: ObservationCommandRequest<BindCorrelationContextRequest>) -> Result<BindCorrelationContextInput, ApplicationError>;
    /// Assemble RecordSafeSignal after exact command validation.
    fn record_safe_signal(&self, request: ObservationCommandRequest<RecordSafeSignalRequest>) -> Result<RecordSafeSignalInput, ApplicationError>;
    /// Assemble AppendAuditProjection after exact command validation.
    fn append_audit_projection(&self, request: ObservationCommandRequest<AppendAuditProjectionRequest>) -> Result<AppendAuditProjectionInput, ApplicationError>;
    /// Assemble LinkBodyFreeEvidence after exact command validation.
    fn link_body_free_evidence(&self, request: ObservationCommandRequest<LinkBodyFreeEvidenceRequest>) -> Result<LinkBodyFreeEvidenceInput, ApplicationError>;
    /// Assemble PrepareReportHandoff after exact command validation.
    fn prepare_report_handoff(&self, request: ObservationCommandRequest<PrepareReportHandoffRequest>) -> Result<PrepareReportHandoffInput, ApplicationError>;
    /// Assemble EvaluateAuthenticityHint after exact command validation.
    fn evaluate_authenticity_hint(&self, request: ObservationCommandRequest<EvaluateAuthenticityHintRequest>) -> Result<EvaluateAuthenticityHintInput, ApplicationError>;
    /// Assemble SetRetentionMarker after exact command validation.
    fn set_retention_marker(&self, request: ObservationCommandRequest<SetRetentionMarkerRequest>) -> Result<SetRetentionMarkerInput, ApplicationError>;
    /// Assemble ProtectActiveReference after exact command validation.
    fn protect_active_reference(&self, request: ObservationCommandRequest<ProtectActiveReferenceRequest>) -> Result<ProtectActiveReferenceInput, ApplicationError>;
    /// Assemble DefineReplayScope without manufacturing an H13 transition.
    fn define_replay_scope(&self, request: ObservationCommandRequest<DefineReplayScopeRequest>) -> Result<DefineReplayScopeInput, ApplicationError>;
    /// Assemble RecordNoWriteViolation after exact command validation.
    fn record_no_write_violation(&self, request: ObservationCommandRequest<RecordNoWriteViolationRequest>) -> Result<RecordNoWriteViolationInput, ApplicationError>;
    /// Assemble RecordGapState after exact command validation.
    fn record_gap_state(&self, request: ObservationCommandRequest<RecordGapStateRequest>) -> Result<RecordGapStateInput, ApplicationError>;
    /// Assemble PrepareExternalAuditExport without resolving an external binding.
    fn prepare_external_audit_export(&self, request: ObservationCommandRequest<PrepareExternalAuditExportRequest>) -> Result<PrepareExternalAuditExportInput, ApplicationError>;
    /// Assemble RegisterReferenceSnapshot after exact command validation.
    fn register_reference_snapshot(&self, request: ObservationCommandRequest<RegisterReferenceSnapshotRequest>) -> Result<RegisterReferenceSnapshotInput, ApplicationError>;
    /// Assemble UpdateReferenceSnapshotState after exact command validation.
    fn update_reference_snapshot_state(&self, request: ObservationCommandRequest<UpdateReferenceSnapshotStateRequest>) -> Result<UpdateReferenceSnapshotStateInput, ApplicationError>;

    /// Assemble the read-only GetObservationReceipt input.
    fn get_observation_receipt(&self, request: ObservationQueryRequest<GetObservationReceiptRequest>) -> Result<GetObservationReceiptInput, ApplicationError>;
    /// Assemble the read-only GetIntakeStatus input.
    fn get_intake_status(&self, request: ObservationQueryRequest<GetIntakeStatusRequest>) -> Result<GetIntakeStatusInput, ApplicationError>;
    /// Assemble the read-only GetSafeSignal input.
    fn get_safe_signal(&self, request: ObservationQueryRequest<GetSafeSignalRequest>) -> Result<GetSafeSignalInput, ApplicationError>;
    /// Assemble the read-only GetSignalRollup input.
    fn get_signal_rollup(&self, request: ObservationQueryRequest<GetSignalRollupRequest>) -> Result<GetSignalRollupInput, ApplicationError>;
    /// Assemble the read-only GetAuditTimeline input.
    fn get_audit_timeline(&self, request: ObservationQueryRequest<GetAuditTimelineRequest>) -> Result<GetAuditTimelineInput, ApplicationError>;
    /// Assemble the read-only GetEvidenceIndexInput input.
    fn get_evidence_index_input(&self, request: ObservationQueryRequest<GetEvidenceIndexInputRequest>) -> Result<GetEvidenceIndexInputInput, ApplicationError>;
    /// Assemble the read-only GetReportHandoff input.
    fn get_report_handoff(&self, request: ObservationQueryRequest<GetReportHandoffRequest>) -> Result<GetReportHandoffInput, ApplicationError>;
    /// Assemble the read-only GetRetentionProtection input.
    fn get_retention_protection(&self, request: ObservationQueryRequest<GetRetentionProtectionRequest>) -> Result<GetRetentionProtectionInput, ApplicationError>;
    /// Assemble the read-only GetObservationReadModel input.
    fn get_observation_read_model(&self, request: ObservationQueryRequest<GetObservationReadModelRequest>) -> Result<GetObservationReadModelInput, ApplicationError>;
    /// Assemble the read-only GetDiagnosticView input.
    fn get_diagnostic_view(&self, request: ObservationQueryRequest<GetDiagnosticViewRequest>) -> Result<GetDiagnosticViewInput, ApplicationError>;
    /// Assemble the read-only GetGapStatus input.
    fn get_gap_status(&self, request: ObservationQueryRequest<GetGapStatusRequest>) -> Result<GetGapStatusInput, ApplicationError>;
    /// Assemble the read-only GetPeripheralExportView input.
    fn get_peripheral_export_view(&self, request: ObservationQueryRequest<GetPeripheralExportViewRequest>) -> Result<GetPeripheralExportViewInput, ApplicationError>;
    /// Assemble the read-only GetReferenceSnapshotView input.
    fn get_reference_snapshot_view(&self, request: ObservationQueryRequest<GetReferenceSnapshotViewRequest>) -> Result<GetReferenceSnapshotViewInput, ApplicationError>;
    /// Assemble the read-only GetRebuildProgress input.
    fn get_rebuild_progress(&self, request: ObservationQueryRequest<GetRebuildProgressRequest>) -> Result<GetRebuildProgressInput, ApplicationError>;
}
```

```rust
/// Synchronous input assembly available only to the worker entry assignment.
pub trait ObservationInboundInputAssembler: Send + Sync {
    /// Assemble a validated bus observation delivery.
    fn consume_bus_observation_material(&self, actor_ref: ActorSafeRef, envelope: ObservationInboundEventEnvelope<BusObservationMaterialPayload>) -> Result<ConsumeBusObservationMaterialInput, ApplicationError>;
    /// Assemble a validated source-audit delivery.
    fn consume_source_audit_material(&self, actor_ref: ActorSafeRef, envelope: ObservationInboundEventEnvelope<SourceAuditMaterialPayload>) -> Result<ConsumeSourceAuditMaterialInput, ApplicationError>;
    /// Assemble a validated identity observation delivery.
    fn consume_identity_observation_context(&self, actor_ref: ActorSafeRef, envelope: ObservationInboundEventEnvelope<IdentityObservationContextPayload>) -> Result<ConsumeIdentityObservationContextInput, ApplicationError>;
    /// Assemble a validated governance audit delivery.
    fn consume_governance_audit_context(&self, actor_ref: ActorSafeRef, envelope: ObservationInboundEventEnvelope<GovernanceAuditContextPayload>) -> Result<ConsumeGovernanceAuditContextInput, ApplicationError>;
    /// Assemble a validated artifact evidence delivery.
    fn consume_artifact_evidence_context(&self, actor_ref: ActorSafeRef, envelope: ObservationInboundEventEnvelope<ArtifactEvidenceContextPayload>) -> Result<ConsumeArtifactEvidenceContextInput, ApplicationError>;
    /// Assemble a validated runtime signal summary delivery.
    fn consume_runtime_signal_summary(&self, actor_ref: ActorSafeRef, envelope: ObservationInboundEventEnvelope<RuntimeSignalSummaryPayload>) -> Result<ConsumeRuntimeSignalSummaryInput, ApplicationError>;
    /// Assemble a validated sandbox signal summary delivery.
    fn consume_sandbox_signal_summary(&self, actor_ref: ActorSafeRef, envelope: ObservationInboundEventEnvelope<SandboxSignalSummaryPayload>) -> Result<ConsumeSandboxSignalSummaryInput, ApplicationError>;
    /// Assemble a validated archive handoff feedback delivery.
    fn consume_archive_handoff_feedback(&self, actor_ref: ActorSafeRef, envelope: ObservationInboundEventEnvelope<ArchiveHandoffFeedbackPayload>) -> Result<ConsumeArchiveHandoffFeedbackInput, ApplicationError>;
    /// Assemble a validated report-consumer feedback delivery.
    fn consume_report_consumer_feedback(&self, actor_ref: ActorSafeRef, envelope: ObservationInboundEventEnvelope<ReportConsumerFeedbackPayload>) -> Result<ConsumeReportConsumerFeedbackInput, ApplicationError>;
}
```

```rust
/// Synchronous input assembly available only to the jobs entry assignment.
pub trait ObservationJobInputAssembler: Send + Sync {
    /// Assemble the PublishObservationOutbox Operations Job input.
    fn publish_observation_outbox(&self, request: ObservationJobRequest<PublishObservationOutboxJobInput>) -> Result<PublishObservationOutboxInput, ApplicationError>;
    /// Assemble the RebuildObservationReadModels Operations Job input.
    fn rebuild_observation_read_models(&self, request: ObservationJobRequest<RebuildObservationReadModelsJobInput>) -> Result<RebuildObservationReadModelsInput, ApplicationError>;
    /// Assemble the RebuildSignalRollups Operations Job input.
    fn rebuild_signal_rollups(&self, request: ObservationJobRequest<RebuildSignalRollupsJobInput>) -> Result<RebuildSignalRollupsInput, ApplicationError>;
    /// Assemble the RefreshReferenceSnapshots Operations Job input.
    fn refresh_reference_snapshots(&self, request: ObservationJobRequest<RefreshReferenceSnapshotsJobInput>) -> Result<RefreshReferenceSnapshotsInput, ApplicationError>;
    /// Assemble the ScanObservationGaps Operations Job input.
    fn scan_observation_gaps(&self, request: ObservationJobRequest<ScanObservationGapsJobInput>) -> Result<ScanObservationGapsInput, ApplicationError>;
    /// Assemble the CoordinateObservationReplay Operations Job input.
    fn coordinate_observation_replay(&self, request: ObservationJobRequest<CoordinateObservationReplayJobInput>) -> Result<CoordinateObservationReplayInput, ApplicationError>;
    /// Assemble the PrepareReportHandoffDelivery Operations Job input.
    fn prepare_report_handoff_delivery(&self, request: ObservationJobRequest<PrepareReportHandoffDeliveryJobInput>) -> Result<PrepareReportHandoffDeliveryInput, ApplicationError>;
    /// Assemble the PrepareExternalAuditExportDelivery Operations Job input.
    fn prepare_external_audit_export_delivery(&self, request: ObservationJobRequest<PrepareExternalAuditExportJobInput>) -> Result<PrepareExternalAuditExportDeliveryInput, ApplicationError>;
    /// Assemble the RebuildPeripheralViews Operations Job input.
    fn rebuild_peripheral_views(&self, request: ObservationJobRequest<RebuildPeripheralViewsJobInput>) -> Result<RebuildPeripheralViewsInput, ApplicationError>;
}
```

Assembler在返回前完成R06.8-A规定的exact route/body、nested type、canonical ordering、digest profile和family/context矩阵校验。失败时无partial input、service call、repository/resolver/UoW/external call；错误中不携带raw bytes、expected/actual digest、idempotency key、locator、credential、provider detail或stack。

### 7.6 四个 service façade

| Façade | 方法总数 | entry调用方 | 返回carrier | 明确禁止 |
|---|---:|---|---|---|
| `ObservationTruthWriteService` | 16 | API Command handlers | `ObservationCommandResult` | direct external call、Job coordination、source write |
| `ObservationReadService` | 14 | API Query handlers | `ObservationQueryResult<T>` | UoW、reservation、refresh/rebuild/write |
| `ObservationInboundEventService` | 9 | worker Consumer handlers | `ObservationConsumerResult` | transport ack/dead-letter、raw archive、source write |
| `ObservationOperationsJobService` | 9 | jobs runners/handlers | `ObservationJobResult` | current-config resume、source repair、fifth publication façade |

每个方法按值消费matching concrete input；没有额外 `ObservationOperationContext` 参数，因为context已由assembler嵌入private input。Service不能接受public request/envelope/job wrapper、generic input enum、raw bytes或free-text operation。

```rust
/// Entry-callable application service for sixteen truth-writing commands.
pub trait ObservationTruthWriteService: Send + Sync {
    /// Execute SubmitObservationMaterial with its complete typed input.
    fn submit_observation_material<'a>(&'a self, input: SubmitObservationMaterialInput) -> ApplicationServiceFuture<'a, ObservationCommandResult>;
    /// Execute RecordSafetyDisposition with its complete typed input.
    fn record_safety_disposition<'a>(&'a self, input: RecordSafetyDispositionInput) -> ApplicationServiceFuture<'a, ObservationCommandResult>;
    /// Execute BindCorrelationContext with its complete typed input.
    fn bind_correlation_context<'a>(&'a self, input: BindCorrelationContextInput) -> ApplicationServiceFuture<'a, ObservationCommandResult>;
    /// Execute RecordSafeSignal with its complete typed input.
    fn record_safe_signal<'a>(&'a self, input: RecordSafeSignalInput) -> ApplicationServiceFuture<'a, ObservationCommandResult>;
    /// Execute AppendAuditProjection with its complete typed input.
    fn append_audit_projection<'a>(&'a self, input: AppendAuditProjectionInput) -> ApplicationServiceFuture<'a, ObservationCommandResult>;
    /// Execute LinkBodyFreeEvidence with its complete typed input.
    fn link_body_free_evidence<'a>(&'a self, input: LinkBodyFreeEvidenceInput) -> ApplicationServiceFuture<'a, ObservationCommandResult>;
    /// Execute PrepareReportHandoff without producing a final verdict.
    fn prepare_report_handoff<'a>(&'a self, input: PrepareReportHandoffInput) -> ApplicationServiceFuture<'a, ObservationCommandResult>;
    /// Execute EvaluateAuthenticityHint without owning authenticity truth.
    fn evaluate_authenticity_hint<'a>(&'a self, input: EvaluateAuthenticityHintInput) -> ApplicationServiceFuture<'a, ObservationCommandResult>;
    /// Execute SetRetentionMarker without deleting retained material.
    fn set_retention_marker<'a>(&'a self, input: SetRetentionMarkerInput) -> ApplicationServiceFuture<'a, ObservationCommandResult>;
    /// Execute ProtectActiveReference without mutating the referenced source.
    fn protect_active_reference<'a>(&'a self, input: ProtectActiveReferenceInput) -> ApplicationServiceFuture<'a, ObservationCommandResult>;
    /// Execute DefineReplayScope without creating an H13 record.
    fn define_replay_scope<'a>(&'a self, input: DefineReplayScopeInput) -> ApplicationServiceFuture<'a, ObservationCommandResult>;
    /// Execute RecordNoWriteViolation while keeping the forbidden write blocked.
    fn record_no_write_violation<'a>(&'a self, input: RecordNoWriteViolationInput) -> ApplicationServiceFuture<'a, ObservationCommandResult>;
    /// Execute RecordGapState without repairing source truth.
    fn record_gap_state<'a>(&'a self, input: RecordGapStateInput) -> ApplicationServiceFuture<'a, ObservationCommandResult>;
    /// Execute local external-audit export preparation only.
    fn prepare_external_audit_export<'a>(&'a self, input: PrepareExternalAuditExportInput) -> ApplicationServiceFuture<'a, ObservationCommandResult>;
    /// Execute RegisterReferenceSnapshot with body-free material.
    fn register_reference_snapshot<'a>(&'a self, input: RegisterReferenceSnapshotInput) -> ApplicationServiceFuture<'a, ObservationCommandResult>;
    /// Execute UpdateReferenceSnapshotState with body-free material.
    fn update_reference_snapshot_state<'a>(&'a self, input: UpdateReferenceSnapshotStateInput) -> ApplicationServiceFuture<'a, ObservationCommandResult>;
}
```

```rust
/// Entry-callable application service for fourteen read-only queries.
pub trait ObservationReadService: Send + Sync {
    /// Read one observation receipt surface.
    fn get_observation_receipt<'a>(&'a self, input: GetObservationReceiptInput) -> ApplicationServiceFuture<'a, ObservationQueryResult<ObservationReceiptView>>;
    /// Read an intake status surface.
    fn get_intake_status<'a>(&'a self, input: GetIntakeStatusInput) -> ApplicationServiceFuture<'a, ObservationQueryResult<IntakeStatusView>>;
    /// Read a safe signal projection surface.
    fn get_safe_signal<'a>(&'a self, input: GetSafeSignalInput) -> ApplicationServiceFuture<'a, ObservationQueryResult<SafeSignalProjectionView>>;
    /// Read a signal rollup surface.
    fn get_signal_rollup<'a>(&'a self, input: GetSignalRollupInput) -> ApplicationServiceFuture<'a, ObservationQueryResult<SignalRollupView>>;
    /// Read a body-free audit timeline surface.
    fn get_audit_timeline<'a>(&'a self, input: GetAuditTimelineInput) -> ApplicationServiceFuture<'a, ObservationQueryResult<AuditTimelineView>>;
    /// Read an evidence-index input surface.
    fn get_evidence_index_input<'a>(&'a self, input: GetEvidenceIndexInputInput) -> ApplicationServiceFuture<'a, ObservationQueryResult<EvidenceIndexInputView>>;
    /// Read one report handoff surface.
    fn get_report_handoff<'a>(&'a self, input: GetReportHandoffInput) -> ApplicationServiceFuture<'a, ObservationQueryResult<ReportHandoffView>>;
    /// Read retention and active-protection surfaces.
    fn get_retention_protection<'a>(&'a self, input: GetRetentionProtectionInput) -> ApplicationServiceFuture<'a, ObservationQueryResult<RetentionProtectionView>>;
    /// Read an observation read-model surface.
    fn get_observation_read_model<'a>(&'a self, input: GetObservationReadModelInput) -> ApplicationServiceFuture<'a, ObservationQueryResult<ObservationReadModel>>;
    /// Read a diagnostic surface without triggering repair.
    fn get_diagnostic_view<'a>(&'a self, input: GetDiagnosticViewInput) -> ApplicationServiceFuture<'a, ObservationQueryResult<DiagnosticView>>;
    /// Read a gap status surface without opening or closing a gap.
    fn get_gap_status<'a>(&'a self, input: GetGapStatusInput) -> ApplicationServiceFuture<'a, ObservationQueryResult<GapStatusView>>;
    /// Read a peripheral export view without delivery.
    fn get_peripheral_export_view<'a>(&'a self, input: GetPeripheralExportViewInput) -> ApplicationServiceFuture<'a, ObservationQueryResult<DashboardAlertExportView>>;
    /// Read a reference snapshot surface without refresh.
    fn get_reference_snapshot_view<'a>(&'a self, input: GetReferenceSnapshotViewInput) -> ApplicationServiceFuture<'a, ObservationQueryResult<ReferenceSnapshotView>>;
    /// Read rebuild progress without starting or resuming a rebuild.
    fn get_rebuild_progress<'a>(&'a self, input: GetRebuildProgressInput) -> ApplicationServiceFuture<'a, ObservationQueryResult<RebuildProgressView>>;
}
```

```rust
/// Entry-callable application service for nine inbound event consumers.
pub trait ObservationInboundEventService: Send + Sync {
    /// Consume one validated bus observation input.
    fn consume_bus_observation_material<'a>(&'a self, input: ConsumeBusObservationMaterialInput) -> ApplicationServiceFuture<'a, ObservationConsumerResult>;
    /// Consume one validated source-audit input.
    fn consume_source_audit_material<'a>(&'a self, input: ConsumeSourceAuditMaterialInput) -> ApplicationServiceFuture<'a, ObservationConsumerResult>;
    /// Consume one validated identity observation input.
    fn consume_identity_observation_context<'a>(&'a self, input: ConsumeIdentityObservationContextInput) -> ApplicationServiceFuture<'a, ObservationConsumerResult>;
    /// Consume one validated governance audit input.
    fn consume_governance_audit_context<'a>(&'a self, input: ConsumeGovernanceAuditContextInput) -> ApplicationServiceFuture<'a, ObservationConsumerResult>;
    /// Consume one validated artifact evidence input.
    fn consume_artifact_evidence_context<'a>(&'a self, input: ConsumeArtifactEvidenceContextInput) -> ApplicationServiceFuture<'a, ObservationConsumerResult>;
    /// Consume one validated runtime signal summary input.
    fn consume_runtime_signal_summary<'a>(&'a self, input: ConsumeRuntimeSignalSummaryInput) -> ApplicationServiceFuture<'a, ObservationConsumerResult>;
    /// Consume one validated sandbox signal summary input.
    fn consume_sandbox_signal_summary<'a>(&'a self, input: ConsumeSandboxSignalSummaryInput) -> ApplicationServiceFuture<'a, ObservationConsumerResult>;
    /// Consume one validated archive handoff feedback input.
    fn consume_archive_handoff_feedback<'a>(&'a self, input: ConsumeArchiveHandoffFeedbackInput) -> ApplicationServiceFuture<'a, ObservationConsumerResult>;
    /// Consume one validated report-consumer feedback input.
    fn consume_report_consumer_feedback<'a>(&'a self, input: ConsumeReportConsumerFeedbackInput) -> ApplicationServiceFuture<'a, ObservationConsumerResult>;
}
```

```rust
/// Entry-callable application service for all nine observation Operations Jobs.
pub trait ObservationOperationsJobService: Send + Sync {
    /// Execute publication as a planned, claimed Operations Job.
    fn publish_observation_outbox<'a>(&'a self, input: PublishObservationOutboxInput) -> ApplicationServiceFuture<'a, ObservationJobResult>;
    /// Execute read-model rebuild as a bounded Operations Job.
    fn rebuild_observation_read_models<'a>(&'a self, input: RebuildObservationReadModelsInput) -> ApplicationServiceFuture<'a, ObservationJobResult>;
    /// Execute signal-rollup rebuild as a bounded Operations Job.
    fn rebuild_signal_rollups<'a>(&'a self, input: RebuildSignalRollupsInput) -> ApplicationServiceFuture<'a, ObservationJobResult>;
    /// Execute reference-snapshot refresh as a bounded Operations Job.
    fn refresh_reference_snapshots<'a>(&'a self, input: RefreshReferenceSnapshotsInput) -> ApplicationServiceFuture<'a, ObservationJobResult>;
    /// Execute gap scanning as a bounded Operations Job.
    fn scan_observation_gaps<'a>(&'a self, input: ScanObservationGapsInput) -> ApplicationServiceFuture<'a, ObservationJobResult>;
    /// Execute target-bound replay coordination without source repair.
    fn coordinate_observation_replay<'a>(&'a self, input: CoordinateObservationReplayInput) -> ApplicationServiceFuture<'a, ObservationJobResult>;
    /// Execute report-handoff delivery preparation and local finalization.
    fn prepare_report_handoff_delivery<'a>(&'a self, input: PrepareReportHandoffDeliveryInput) -> ApplicationServiceFuture<'a, ObservationJobResult>;
    /// Execute external-audit export delivery preparation and local finalization.
    fn prepare_external_audit_export_delivery<'a>(&'a self, input: PrepareExternalAuditExportDeliveryInput) -> ApplicationServiceFuture<'a, ObservationJobResult>;
    /// Execute peripheral-view rebuild as a bounded Operations Job.
    fn rebuild_peripheral_views<'a>(&'a self, input: RebuildPeripheralViewsInput) -> ApplicationServiceFuture<'a, ObservationJobResult>;
}
```

### 7.7 Façade durable sequence 与 authority

| Façade | Current sequence | 只允许的外部/entry副作用 | 禁止解释 |
|---|---|---|---|
| TruthWrite | assemble完成 -> atomic reserve -> load/version/policy -> stage primary -> record/outbox/result -> complete reservation -> commit | committed outbox稍后由Job传播 | local commit不是external acceptance |
| Read | assemble完成 -> read-only repository/projection/resolver -> visibility/result assembly | 无 | stale/missing不得触发repair |
| InboundEvent | assemble完成 -> atomic logical+event reserve -> local transition/quarantine/gap -> result/outbox -> complete -> commit | worker在得到formal receipt后选择transport completion | ack不是application method，transport失败不回滚local commit |
| OperationsJob | assemble完成 -> reserve -> freeze candidates/material/config/plan/report -> commit start -> exact claims/short UoWs/external cuts -> lossless fold -> terminal result | external call只经stable token port且在DB UoW外 | claim expiry不证明rollback；report不拥有verdict |

`ObservationPublicationService`只允许是`pub(crate) struct` collaborator，由`ObservationOperationsJobService` implementation对一个`ClaimedObservationPublicationItem<'_>`调用。它不是trait、runtime assignment、worker façade、scheduler target或candidate lister，不能创建plan/claim/report/result或complete idempotency。

### 7.8 Input / façade totality 与模块内停审

| 检查项 | 预期 | 本节结论 |
|---|---:|---|
| API assembler Command methods | 16 | pass_design_only |
| API assembler Query methods | 14 | pass_design_only |
| inbound assembler methods | 9 | pass_design_only |
| Job assembler methods | 9 | pass_design_only |
| TruthWrite façade methods | 16 | pass_design_only |
| Read façade methods | 14 | pass_design_only |
| InboundEvent façade methods | 9 | pass_design_only |
| OperationsJob façade methods | 9 | pass_design_only |
| entry-callable façade count | 4 | pass_design_only |
| naked context factory / canonicalizer exposure | 0 | pass_design_only |
| maintenance/publication compatibility alias | 0 | pass_design_only |

本停审只关闭 application input/façade 接缝。Repository、UoW、Job coordination、external effect与runtime/entry接缝尚须在后续小节完成，当前不能把整个application模块或Step 07标为完成。

### 7.9 Persistence support carrier

`ObservationRepositoryVersion`、`ObservationCursor`、`ReferenceCursor`、`ObservationCommittedCursor`及所有truth/state/record/result对象已经由Step 06拥有。本节只定义port调用需要、且未成为业务对象的application-local技术carrier：

```rust
/// Opaque identity of one process-visible local transaction handle.
pub struct ObservationTransactionRef(BodyFreeRef);

/// A committed object paired with the optimistic version of the same row.
pub struct Versioned<T> {
    /// Rehydrated current object.
    pub value: T,
    /// Exact row version required by the next update CAS.
    pub version: ObservationRepositoryVersion,
}

/// Exact method, selector, and ordering identity for one repository page call.
pub struct ObservationRepositoryCursorBinding {
    method: ObservationRepositoryPageMethod,
    selector_fingerprint: [u8; 32],
    order_revision: NonZeroU16,
}

enum ObservationRepositoryPageMethod {
    ReceiptsByStatusScope,
    SignalsByContext,
    RollupsByScope,
    ProjectionsBySubject,
    LinkagesByEvidenceScope,
    AuditTimeline,
    ActiveProtectionsByProtectedRef,
    GapsBySource,
    SnapshotsByScope,
    MaintenanceByScope,
    RollupRebuildsByWindow,
    ObservationReadModels,
    AffectedViews,
    ItemsByPlan,
}

/// Opaque continuation for one exact application repository page binding.
pub struct ObservationRepositoryCursor {
    opaque_token: String,
    binding: ObservationRepositoryCursorBinding,
    repository_position: Vec<u8>,
}

/// Bounded page request used only inside application repository ports.
pub struct ObservationRepositoryPage {
    /// Continuation returned by the same repository method and ordering.
    cursor: Option<ObservationRepositoryCursor>,
    /// Positive limit already bounded by the application hard ceiling.
    limit: PositiveLimit,
    /// Exact method/selector/order against which a continuation is checked.
    binding: ObservationRepositoryCursorBinding,
}

/// One stable repository page and its opaque continuation.
pub struct ObservationRepositoryPageResult<T> {
    /// Canonically ordered items returned by the repository.
    items: Vec<T>,
    /// Continuation for the same method, selector, and ordering only.
    next_cursor: Option<ObservationRepositoryCursor>,
}
```

`ObservationRepositoryPageMethod` is an application-private finite enum. It has exactly fourteen variants matching the fourteen paged callables in §§7.14~7.25 and is never accepted as a caller-supplied generic discriminator. `ObservationRepositoryCursorBinding` can only be created through the following exact public factories so a separate infra crate can implement the application-owned repository traits without gaining a generic selector encoder:

```rust
impl ObservationRepositoryCursorBinding {
    pub fn for_receipts_by_status_scope(scope: &IntakeStatusScope) -> Result<Self, ApplicationError>;
    pub fn for_signals_by_context(context_ref: &CorrelationContextRef) -> Result<Self, ApplicationError>;
    pub fn for_rollups_by_scope(scope: &SignalRollupScope) -> Result<Self, ApplicationError>;
    pub fn for_projections_by_subject(subject_ref: &AuditSubjectRef) -> Result<Self, ApplicationError>;
    pub fn for_linkages_by_evidence_scope(scope_ref: &EvidenceIndexScopeRef) -> Result<Self, ApplicationError>;
    pub fn for_audit_timeline(subject_ref: &AuditSubjectRef) -> Result<Self, ApplicationError>;
    pub fn for_active_protections(protected_ref: &ProtectedObservationRef) -> Result<Self, ApplicationError>;
    pub fn for_gaps_by_source(source_ref: &GapSourceRef) -> Result<Self, ApplicationError>;
    pub fn for_snapshots_by_scope(scope: &ObservationReferenceRefreshScope) -> Result<Self, ApplicationError>;
    pub fn for_maintenance_by_scope(scope: &ObservationProjectionScope) -> Result<Self, ApplicationError>;
    pub fn for_rollup_rebuilds_by_window(window_ref: &SignalRollupWindowRef) -> Result<Self, ApplicationError>;
    pub fn for_observation_read_models(scope: &ObservationProjectionScope) -> Result<Self, ApplicationError>;
    pub fn for_affected_views(source_refs: &ProjectionSourceRefSet) -> Result<Self, ApplicationError>;
    pub fn for_items_by_plan(plan_ref: &ObservationJobExecutionPlanRef) -> Result<Self, ApplicationError>;
}

impl ObservationTransactionRef {
    /// Validate a fresh adapter-generated value before exposing the UoW handle.
    pub fn try_from_generated(value: String) -> Result<Self, ApplicationError>;

    /// Revalidate an adapter-local value when rebuilding an in-process handle.
    pub fn try_rehydrate(value: String) -> Result<Self, ApplicationError>;

    /// Inspect only the validated body-free transaction identity.
    pub fn as_body_free_ref(&self) -> &BodyFreeRef;
}

impl ObservationRepositoryCursor {
    /// Decode a caller-returned opaque token and require the exact expected binding.
    pub fn try_rehydrate(
        opaque_token: String,
        expected: &ObservationRepositoryCursorBinding,
    ) -> Result<Self, ApplicationError>;

    /// Encode one validated adapter position under the exact request binding.
    pub fn try_from_repository_position(
        binding: &ObservationRepositoryCursorBinding,
        repository_position: Vec<u8>,
    ) -> Result<Self, ApplicationError>;

    /// Return the opaque application token for later public-page mapping.
    pub fn opaque_token(&self) -> &str;

    /// Return the private repository position only after binding equality is rechecked.
    pub fn repository_position<'a>(
        &'a self,
        expected: &ObservationRepositoryCursorBinding,
    ) -> Result<&'a [u8], ApplicationError>;
}

impl ObservationRepositoryPage {
    /// Validate an optional opaque cursor and bind a bounded request to one exact call.
    pub fn try_new(
        opaque_cursor: Option<String>,
        limit: PositiveLimit,
        binding: ObservationRepositoryCursorBinding,
    ) -> Result<Self, ApplicationError>;

    pub fn cursor(&self) -> Option<&ObservationRepositoryCursor>;
    pub fn limit(&self) -> &PositiveLimit;
    pub fn binding(&self) -> &ObservationRepositoryCursorBinding;
}

impl<T> ObservationRepositoryPageResult<T> {
    /// Validate adapter output and create a same-binding continuation when present.
    pub fn try_from_repository(
        items: Vec<T>,
        next_repository_position: Option<Vec<u8>>,
        request: &ObservationRepositoryPage,
    ) -> Result<Self, ApplicationError>;

    pub fn items(&self) -> &[T];
    pub fn into_parts(self) -> (Vec<T>, Option<ObservationRepositoryCursor>);
}
```

The binding factory first writes the complete typed selector, excluding page cursor and limit, through a sealed `repository_page_binding_v1` canonical encoder. `application::ports` does not own or implement SHA-256: it delegates to the exact crate-private `application::digest::repository_page_binding_fingerprint_v1` helper, preserving Step 06's single hashing owner. That helper computes a fixed 32-byte fingerprint over the binary frame `u16_be(domain_len) || "quantalithos.observability.repository-page-binding.v1" || u16_be(method_tag_len) || method_tag_ascii || u16_be(order_revision) || u32_be(selector_len) || selector_bytes`. It accepts only the sealed method/tag/revision/selector representation, has no raw-request or public byte entry, and is not added to the twelve `DigestMaterialKind` registry. This technical fingerprint is not `RequestDigest`/`DigestSummary`, is not persisted as business truth, and must not enter telemetry, reports or evidence.

The cursor is one strict binary envelope encoded once with unpadded base64url; its fields are not separately base64-encoded or delimiter-joined:

```text
opaque_token = BASE64URL_NOPAD(cursor_envelope)
cursor_envelope =
    b"orpc1"
    || u16_be(method_tag_len) || method_tag_ascii
    || u16_be(order_revision)
    || selector_fingerprint_32
    || u32_be(repository_position_len) || repository_position
```

Decode must consume the complete envelope, reject trailing bytes, and re-encode to exactly the caller token so padded, noncanonical or alternate base64url forms cannot pass. The method tag must be one exact table tag, `order_revision` must be `1`, the fingerprint must equal the freshly constructed expected binding, and the repository position must be non-empty and at most 1024 bytes; the entire token is at most 4096 ASCII bytes. Malformed framing, unknown tag, wrong method/fingerprint/order, wrong length, or a noncanonical token returns `ApplicationError::InvalidPageCursor` before opening a UoW.

Repository positions use one finite key-component grammar rather than an adapter codec. `P(c1, ..., cn) = u8(component_count) || each(u16_be(component_len) || component_bytes)` with `1 <= n <= 2`; `K_REF(type_tag, ref) = u16_be(type_tag_len) || type_tag_ascii || u16_be(value_len) || ref.as_body_free_ref().canonical_bytes()`; `K_TIME(value)` is the owner's exact 27-byte canonical `ObservedAt`; and `K_OWNED(value)` is the exact owner-defined canonical byte sequence named in the table. Length overflow, zero components, the wrong component count/type, noncanonical time/ref/work-key/affected-ref bytes, or trailing position bytes is invalid. The position is always the last returned item's complete key, not a serialized row, selector, version, offset or provider cursor.

| binding factory | exact method tag | canonical selector input | fixed keyset order and position, revision 1 |
|---|---|---|---|
| `for_receipts_by_status_scope` | `receipts_by_status_scope` | complete `IntakeStatusScope` fields | `(received_at, receipt_ref)` ascending; `P(K_TIME(received_at), K_REF("observation_receipt_ref", receipt_ref))` |
| `for_signals_by_context` | `signals_by_context` | `CorrelationContextRef` | `signal_ref` ascending; `P(K_REF("safe_signal_ref", signal_ref))` |
| `for_rollups_by_scope` | `rollups_by_scope` | complete `SignalRollupScope` fields | `window_ref` ascending; `P(K_REF("signal_rollup_window_ref", window_ref))` |
| `for_projections_by_subject` | `projections_by_subject` | `AuditSubjectRef` | `projection_ref` ascending; `P(K_REF("audit_projection_ref", projection_ref))` |
| `for_linkages_by_evidence_scope` | `linkages_by_evidence_scope` | `EvidenceIndexScopeRef` | `linkage_ref` ascending; `P(K_REF("evidence_linkage_ref", linkage_ref))` |
| `for_audit_timeline` | `audit_timeline` | `AuditSubjectRef` | `(appended_at, append_record_ref)` ascending; `P(K_TIME(appended_at), K_REF("audit_append_record_ref", append_record_ref))` |
| `for_active_protections` | `active_protections_by_protected_ref` | `ProtectedObservationRef` | `protection_ref` ascending; `P(K_REF("active_reference_protection_ref", protection_ref))` |
| `for_gaps_by_source` | `gaps_by_source` | `GapSourceRef` | `gap_ref` ascending; `P(K_REF("gap_state_ref", gap_ref))` |
| `for_snapshots_by_scope` | `snapshots_by_scope` | complete `ObservationReferenceRefreshScope` fields | `snapshot_ref` ascending; `P(K_REF("reference_snapshot_state_ref", snapshot_ref))` |
| `for_maintenance_by_scope` | `maintenance_by_scope` | complete `ObservationProjectionScope` fields | `maintenance_ref` ascending; `P(K_REF("projection_maintenance_ref", maintenance_ref))` |
| `for_rollup_rebuilds_by_window` | `rollup_rebuilds_by_window` | `SignalRollupWindowRef` | `(updated_at, rebuild_ref)` ascending; `P(K_TIME(updated_at), K_REF("rollup_rebuild_ref", rebuild_ref))` |
| `for_observation_read_models` | `observation_read_models` | complete `ObservationProjectionScope` fields | `read_model_ref` ascending; `P(K_REF("observation_read_model_ref", read_model_ref))` |
| `for_affected_views` | `affected_views` | complete canonical `ProjectionSourceRefSet` | `AffectedProjectionRef::canonical_bytes()` ascending; `P(K_OWNED(affected_ref))` |
| `for_items_by_plan` | `items_by_plan` | `ObservationJobExecutionPlanRef` | `ObservationJobWorkKey::canonical_bytes()` ascending; `P(K_OWNED(work_key))` |

Every repository implementation must use keyset comparison over the listed complete order, not offset, row version, provider-native cursor or adapter-selected order. Timestamp is forbidden as an inferred/default order; only receipts, audit timeline entries and rollup rebuild attempts use the explicit owner fields shown above. The adapter verifies that an incoming position decodes to the exact listed key shape and that an outgoing position equals the last returned complete key and strictly advances the incoming key. `try_from_repository` rejects item counts above `request.limit`, `Some(next)` for an empty page, malformed positions, and a next cursor bound to anything other than `request.binding`; adapter-created defects map to `PersistenceInvariantViolation`, while caller-returned token defects map to `InvalidPageCursor`. This framing provides bounded type/binding integrity checks, not secrecy, cryptographic authenticity, authorization, global ordering or evidence. A fabricated but syntactically valid position can only change the starting key inside the separately supplied and authorized selector; filtering and visibility never derive from the token. The in-memory fake must run the same binding, encoding, ordering, bounds and error rules.

`ObservationTransactionRef::try_from_generated` and `try_rehydrate` both delegate to the current `BodyFreeRef::from_generated` / `BodyFreeRef::parse` validation and map malformed adapter-local values to `PersistenceInvariantViolation`, never `InvalidRequest`. They do not prove commit, durability, fencing, or uniqueness. `ObservationUnitOfWorkManager::begin` remains responsible for fresh process-local uniqueness and returns no handle when construction fails. The type is not serialized as a durable row, public DTO, external transaction locator, run identity, or evidence reference.

| carrier | owner / visibility | construction rule | forbidden use |
|---|---|---|---|
| `ObservationTransactionRef` | `application::unit_of_work`;public opaque surface to application/infra, safe-detail only | UoW implementation calls `try_from_generated` at `begin`; process-local reconstruction calls `try_rehydrate`; application reads only `as_body_free_ref` | commit proof、durable row、cursor、run/evidence identity、external transaction locator |
| `Versioned<T>` | `application::ports`;public to infra/application | repository creates only after object rehydrate and row-version validation both succeed | public DTO、object field、cross-row version reuse |
| `ObservationRepositoryCursorBinding` | `application::ports`;private fields, exact public factories | application selects one factory from the statically known repository method and complete typed selector | generic method tag、raw body/request serializer、page cursor/limit in selector、public truth |
| `ObservationRepositoryCursor` | `application::ports`;private fields with validated codec/selectors | application rehydrates caller token against expected binding;matching infra adapter creates next token from the last complete key | cross-method/selector/order reuse、row/source/outbox cursor、global ordering |
| `ObservationRepositoryPage` | `application::ports`;private fields with read-only selectors | application maps a validated bounded request through `try_new`;repository receives exact binding | unbounded scan、adapter-selected default/order、binding replacement |
| `ObservationRepositoryPageResult<T>` | `application::ports`;private fields with validated constructor | repository returns bounded canonical items and same-binding continuation atomically | partial/truncated success hidden as complete page、foreign cursor |
| `RequestDigestCandidates` | `application::digest`; public opaque type with private fields/construction | application canonicalizer constructs; separate infra crate may only call `write_profile` / `write_digest` / `for_profile` while implementing atomic admission | protocol/serde/persistence/telemetry exposure、adapter synthesis、replacement carrier |

`Versioned<T>.version` belongs only to the returned row. A list/page item carries its own version; there is no page-wide version. `expected_version=None` means create-if-absent, not “skip CAS”; existing-row update always uses `Some(version)` from the matching read.

### 7.10 Unit of Work port

```rust
/// Local staged-write boundary used by observation application repositories.
pub trait ObservationUnitOfWork: Send + Sync {
    /// Return the body-free identity of this local transaction handle.
    fn transaction_ref(&self) -> &ObservationTransactionRef;

    /// Assign the only observation-namespace cursor for this UoW.
    fn assign_observation_cursor(&self) -> Result<ObservationCursor, ApplicationError>;

    /// Assign the only reference-namespace cursor for this UoW.
    fn assign_reference_cursor(&self) -> Result<ReferenceCursor, ApplicationError>;
}

/// Creates and consumes local observation Unit of Work handles.
pub trait ObservationUnitOfWorkManager: Send + Sync {
    /// Begin an isolated staged-write boundary with no visible writes.
    fn begin<'a>(&'a self) -> ApplicationPortFuture<'a, Box<dyn ObservationUnitOfWork>>;

    /// Atomically publish every staged write after all registered guards pass.
    fn commit<'a>(&'a self, uow: Box<dyn ObservationUnitOfWork>) -> ApplicationPortFuture<'a, ()>;

    /// Discard every staged write without claiming the operation succeeded.
    fn rollback<'a>(&'a self, uow: Box<dyn ObservationUnitOfWork>) -> ApplicationPortFuture<'a, ()>;
}
```

Cursor allocation is intentionally synchronous at the UoW trait surface because Step 06 `ObservationRecordAssemblyPlan::assign_and_prepare` owns the exact call point and must copy one returned tagged value through the remaining in-memory assembly. An infra implementation may internally prepare transaction-local allocator capability at `begin`, but it cannot allocate either cursor before the corresponding method is called.

UoW invariants:

1. `begin` returns one fresh handle or an error with zero durable effect; entry modules never call it.
2. One handle permits exactly one successful allocator call total. The implementation enforces this atomically even if two application futures race on the shared handle. A second call to the same or other namespace returns `RecordAssemblyInvariantViolation(IncompatibleWriteFamily)` or `CursorAllocationFailed` according to the failure source; it never returns/reuses a value.
3. `ObservationCommitClass` is derived from accepted primary writes before allocation. Caller/config/adapter cannot select a namespace.
4. Repositories stage only into the supplied handle. Reads without UoW return committed rows; designated same-UoW planners may inspect staged relations through their explicit port methods.
5. Job claim authority is registered by `ObservationJobExecutionRepository::register_claim_guard`; UoW stores the exact guard privately and commit revalidates it. UoW exposes no naked fence/token setter.
6. `commit` and `rollback` consume the handle. Known commit failure must roll back or report `CommitFailed`; ambiguous provider outcome maps to `CommitOutcomeUnknown`, never known rollback/success.
7. A rolled-back allocated cursor may leave an invisible monotonic gap but is never reused and cannot appear in a visible row.
8. External network calls are forbidden while a DB UoW is held. Intent commit、external call和local finalize use separate short boundaries.

`R07-UOW-SEND-SYNC-01` requires both `Send` and `Sync`: every object-safe `ApplicationPortFuture` is `Send` and may hold `&dyn ObservationUnitOfWork` across an await point, so the borrowed trait object must be shareable across threads. This is a thread-safety requirement on the transaction handle implementation, not permission to execute repository writes concurrently or to relax the one-cursor and ordered-stage contract.

### 7.11 Clock and typed identity ports

```rust
/// Supplies trusted application time for local facts, records, claims, and reports.
pub trait ClockPort: Send + Sync {
    /// Return one validated current observation timestamp.
    fn now(&self) -> ObservedAt;
}
```

One accepted operation captures the required `ObservedAt` values explicitly and passes them to factories. Repository/database defaults、source occurrence time、adapter response time、claim deadline或cursor不能替代`ClockPort.now()`。A Job may capture separate times for start/item/external result/finalize phases, but each persisted field must identify which capture supplied it; a factory cannot silently call the clock again.

`IdGeneratorPort` is a typed allowlist. Every method validates its generated `BodyFreeRef` through the matching Step 06 owner and returns `ApplicationError` on malformed output. There is no generic `new_ref(kind)`、`new_body_free_ref`、`new_history_record_ref`、string prefix、hash/path/time conversion或cross-wrapper `From`.

```rust
/// Generates only observation-owned typed identities through explicit methods.
pub trait IdGeneratorPort: Send + Sync {
    // Observation-owned truth and state identities.
    fn new_observation_receipt_ref(&self) -> Result<ObservationReceiptRef, ApplicationError>;
    fn new_safety_disposition_ref(&self) -> Result<SafetyDispositionRef, ApplicationError>;
    fn new_correlation_context_ref(&self) -> Result<CorrelationContextRef, ApplicationError>;
    fn new_safe_signal_ref(&self) -> Result<SafeSignalRef, ApplicationError>;
    fn new_signal_rollup_window_ref(&self) -> Result<SignalRollupWindowRef, ApplicationError>;
    fn new_audit_projection_ref(&self) -> Result<AuditProjectionRef, ApplicationError>;
    fn new_evidence_linkage_ref(&self) -> Result<EvidenceLinkageRef, ApplicationError>;
    fn new_evidence_index_input_view_ref(&self) -> Result<EvidenceIndexInputViewRef, ApplicationError>;
    fn new_report_handoff_record_ref(&self) -> Result<ReportHandoffRecordRef, ApplicationError>;
    fn new_authenticity_hint_ref(&self) -> Result<AuthenticityHintRef, ApplicationError>;
    fn new_retention_marker_ref(&self) -> Result<RetentionMarkerRef, ApplicationError>;
    fn new_active_reference_protection_ref(&self) -> Result<ActiveReferenceProtectionRef, ApplicationError>;
    fn new_replay_scope_ref(&self) -> Result<ReplayScopeRef, ApplicationError>;
    fn new_no_write_violation_ref(&self) -> Result<NoWriteViolationRef, ApplicationError>;
    fn new_gap_state_ref(&self) -> Result<GapStateRef, ApplicationError>;
    fn new_degraded_output_ref(&self) -> Result<DegradedOutputRef, ApplicationError>;
    fn new_peripheral_delivery_ref(&self) -> Result<PeripheralDeliveryRef, ApplicationError>;
    fn new_external_audit_export_preparation_ref(&self) -> Result<ExternalAuditExportPreparationRef, ApplicationError>;
    fn new_reference_snapshot_state_ref(&self) -> Result<ReferenceSnapshotStateRef, ApplicationError>;
    fn new_projection_maintenance_ref(&self) -> Result<ProjectionMaintenanceRef, ApplicationError>;
    fn new_replay_coordination_ref(&self) -> Result<ReplayCoordinationRef, ApplicationError>;
    fn new_rollup_rebuild_ref(&self) -> Result<RollupRebuildRef, ApplicationError>;

    // Derived projection and immutable result identities.
    fn new_read_visibility_ref(&self) -> Result<ReadVisibilityRef, ApplicationError>;
    fn new_diagnostic_summary_ref(&self) -> Result<DiagnosticSummaryRef, ApplicationError>;
    fn new_diagnostic_scope_ref(&self) -> Result<DiagnosticScopeRef, ApplicationError>;
    fn new_observation_read_model_ref(&self) -> Result<ObservationReadModelRef, ApplicationError>;
    fn new_diagnostic_view_ref(&self) -> Result<DiagnosticViewRef, ApplicationError>;
    fn new_dashboard_alert_export_view_ref(&self) -> Result<DashboardAlertExportViewRef, ApplicationError>;
    fn new_rebuild_progress_view_ref(&self) -> Result<RebuildProgressViewRef, ApplicationError>;
    fn new_projection_freshness_marker_ref(&self) -> Result<ProjectionFreshnessMarkerRef, ApplicationError>;
    fn new_idempotency_ref(&self) -> Result<IdempotencyRef, ApplicationError>;
    fn new_stored_observation_result_ref(&self) -> Result<StoredObservationResultRef, ApplicationError>;

    // Outbox and terminal isolation identities.
    fn new_outbox_record_ref(&self) -> Result<OutboxRecordRef, ApplicationError>;
    fn new_outbox_payload_snapshot_ref(&self) -> Result<OutboxPayloadSnapshotRef, ApplicationError>;
    fn new_outbound_event_ref(&self) -> Result<OutboundEventRef, ApplicationError>;
    fn new_dead_letter_ref(&self) -> Result<DeadLetterRef, ApplicationError>;

    // H1-H6 and H8-H13 record identities. H7 has no mint method.
    fn new_intake_decision_record_ref(&self) -> Result<IntakeDecisionRecordRef, ApplicationError>;
    fn new_correlation_link_record_ref(&self) -> Result<CorrelationLinkRecordRef, ApplicationError>;
    fn new_audit_append_record_ref(&self) -> Result<AuditAppendRecordRef, ApplicationError>;
    fn new_handoff_lifecycle_record_ref(&self) -> Result<HandoffLifecycleRecordRef, ApplicationError>;
    fn new_retention_change_record_ref(&self) -> Result<RetentionChangeRecordRef, ApplicationError>;
    fn new_no_write_violation_record_ref(&self) -> Result<NoWriteViolationRecordRef, ApplicationError>;
    fn new_gap_transition_record_ref(&self) -> Result<GapTransitionRecordRef, ApplicationError>;
    fn new_peripheral_delivery_record_ref(&self) -> Result<PeripheralDeliveryRecordRef, ApplicationError>;
    fn new_reference_refresh_record_ref(&self) -> Result<ReferenceRefreshRecordRef, ApplicationError>;
    fn new_projection_maintenance_record_ref(&self) -> Result<ProjectionMaintenanceRecordRef, ApplicationError>;
    fn new_gap_scan_record_ref(&self) -> Result<GapScanRecordRef, ApplicationError>;
    fn new_replay_execution_record_ref(&self) -> Result<ReplayExecutionRecordRef, ApplicationError>;

    // Operations Job and claim identities.
    fn new_job_execution_ref(&self) -> Result<ObservationJobExecutionRef, ApplicationError>;
    fn new_job_execution_plan_ref(&self) -> Result<ObservationJobExecutionPlanRef, ApplicationError>;
    fn new_job_report_ref(&self) -> Result<JobReportRef, ApplicationError>;
    fn new_execution_claim_ref(&self) -> Result<ObservationExecutionClaimRef, ApplicationError>;
    fn new_claim_owner_ref(&self) -> Result<ObservationClaimOwnerRef, ApplicationError>;

    // External-effect local identities.
    fn new_external_effect_intent_ref(&self) -> Result<ExternalEffectIntentRef, ApplicationError>;
    fn new_handoff_delivery_preparation_ref(&self) -> Result<HandoffDeliveryPreparationRef, ApplicationError>;
}
```

| identity category | creation point | not generated here |
|---|---|---|
| truth/state/projection | only explicit create flow after policy and uniqueness checks | source、producer、consumer、actor、maintenance target refs |
| idempotency/result | only eligible writer admission/result assembly | caller key、request digest、public result ref |
| records | before a validated nonempty F2 obligation plan; unused local values may be dropped | H7/read-access record;generic record identity |
| Job execution/plan/report | only after idempotency `Acquired` in start materialization | public `JobRunId`、external/runtime run id |
| claim/owner | each fresh durable acquire epoch | host/pod/thread/actor/attempt identity |
| external effect | each handoff/export phase intent; optional local preparation ref path | binding ref、provider receipt/run、publication intent ref |

`HandoffDeliveryPreparationRef` may alternatively come from a validated positive adapter result/probe as allowed by its Step 06 owner. The local generator method is only for adapter families whose validated capability contract requires application-supplied identity; it never authorizes application to fabricate a successful preparation.

#### 7.11.1 Identity owner totality and exclusions

The allowlist was checked against the Step 06 owner inventory, first-create rules, Job identity cards, record families and external-effect cards. A generated value is only an uncommitted candidate until the owning factory and repository uniqueness/CAS rules accept it. Rehydrate, duplicate replay, Query and existing-row update paths never mint a replacement identity.

| owner group | generated methods covered | exact mint gate | excluded supplied / resolved identities |
|---|---|---|---|
| observation-owned truth/state | receipt、safety、correlation、safe signal、rollup、audit、linkage、handoff、hint、retention、protection、replay scope、violation、gap、immutable degraded revision、delivery、export preparation、reference snapshot、maintenance / coordination / rebuild refs | matching first-create branch after policy/uniqueness prerequisites; existing update preserves the loaded ref；every durable degraded replacement receives a fresh ref before `DegradedOutputState::replace_from_decision` | source / source-version、producer、consumer、actor、subject、maintenance target、visibility scope |
| derived read/projection | visibility、diagnostic summary/scope、read model、diagnostic/peripheral/progress view、freshness marker、evidence-index input view | first create only, or new immutable diagnostic summary replacement where its Step 06 owner requires a fresh ref; lookup-bound view/scope/marker refs remain stable on replacement | `DiagnosticRequestContextRef` from Query input; public page cursor; projection scope; resolver identity |
| admission/result/outbox | idempotency、stored result、outbox record/snapshot、outbound event、dead letter | eligible writer branch inside the owning UoW; append identity is never regenerated on replay | caller idempotency key、request/digest values、public result ref supplied by another owner、transport delivery identity |
| H-family records | exactly H1-H6 and H8-H13 methods | only after a nonempty validated record obligation exists; unused rollback-local values are never reused | H7/read access;generic history ref;record identity decoded during rehydrate |
| Operations Job | execution、plan、report、claim、owner refs | execution/plan/report only after idempotency `Acquired`; claim/owner once per fresh durable acquire epoch | public `JobRunId`、host/pod/thread/process、attempt、external/runtime run id、fencing token |
| external effect | intent and optional application-supplied handoff preparation refs | one planned handoff/export phase; preparation ref only where capability requires application supply | effect binding、provider receipt/run、publication token identity、evidence alias、signoff |

The scan initially exposed one real omission: every durable `DegradedOutputState` revision is immutable and requires an application-generated `DegradedOutputRef`, but the allowlist had no matching method. `R07-ID-DEGRADED-01` adds the explicit method above; it does not allow an in-place degraded revision update or derive identity from a gap, affected object, decision digest or visibility scope.

The completed scan excludes `RuntimeAssemblyIssueRef` because startup infra owns its allocator; binding refs because validated configuration derives them; `PolicyBasisRef` because the policy registry resolves it; `ArchiveEligibilityRef` because retention/archive policy or resolver output supplies it; and `DiagnosticRequestContextRef`, source、consumer、actor、maintenance target、scope and resolver-returned identities because their authority is trusted request metadata, configuration, envelope or resolver output. `ReferenceSnapshotStateRef` is generated only for a new local snapshot-state row; it never replaces or aliases an upstream reference. `SignalRollupWindowRef` and `ReplayScopeRef` may also arrive through already validated Job input/lookup, so those paths preserve the supplied owned identity and do not call the generator.

| static totality check | expected | current result |
|---|---:|---|
| H-family generator methods | 12; H7 absent | `pass_design_only` |
| Operations Job identity methods | 5 independent methods | `pass_design_only` |
| generic ID/history method | 0 | `pass_design_only` |
| supplied/resolver identity accidentally minted | 0 | `pass_design_only` |
| unchecked direct-return method | 0; every method returns `Result<_, ApplicationError>` | `pass_design_only` |
| durable owned identity omissions | 0 after `R07-ID-DEGRADED-01` | `pass_design_only` |

### 7.12 Atomic idempotency and stored-result ports

```rust
/// Atomically admits one eligible Command, Consumer, or Operations Job writer.
pub trait ObservationIdempotencyRepository: Send + Sync {
    /// Insert or classify one logical scope and optional Consumer event identity atomically.
    fn reserve<'a>(
        &'a self,
        new_ref: IdempotencyRef,
        scope: ObservationIdempotencyScope,
        inbound_event_identity: Option<ObservationInboundEventIdentity>,
        digest_candidates: RequestDigestCandidates,
        uow: &'a dyn ObservationUnitOfWork,
    ) -> ApplicationPortFuture<'a, ObservationIdempotencyReserveOutcome>;

    /// Load one committed reservation by its complete logical scope.
    fn load_by_scope<'a>(
        &'a self,
        scope: &'a ObservationIdempotencyScope,
    ) -> ApplicationPortFuture<'a, Option<ObservationIdempotencyReservation>>;

    /// Load the original committed reservation by the exact Consumer event identity.
    fn load_by_inbound_event<'a>(
        &'a self,
        identity: &'a ObservationInboundEventIdentity,
    ) -> ApplicationPortFuture<'a, Option<ObservationIdempotencyReservation>>;

    /// Stage terminal completion only after the exact stored result is staged.
    fn mark_completed<'a>(
        &'a self,
        reservation: &'a ObservationIdempotencyReservation,
        result_ref: &'a StoredObservationResultRef,
        uow: &'a dyn ObservationUnitOfWork,
    ) -> ApplicationPortFuture<'a, ()>;
}

/// Persists immutable, body-free replay surfaces for accepted operations.
pub trait ObservationStoredResultRepository: Send + Sync {
    /// Append one immutable result in the same UoW that completes its reservation.
    fn save_result<'a>(
        &'a self,
        result: &'a StoredObservationResult,
        uow: &'a dyn ObservationUnitOfWork,
    ) -> ApplicationPortFuture<'a, ()>;

    /// Load one exact immutable result without reconstructing it from current truth.
    fn get_result<'a>(
        &'a self,
        result_ref: &'a StoredObservationResultRef,
    ) -> ApplicationPortFuture<'a, Option<StoredObservationResult>>;
}
```

Atomic reserve input is deliberately decomposed instead of receiving `ObservationOperationContext`: the service derives the complete `ObservationIdempotencyScope`, passes optional event identity only for Consumer, and transfers the full `RequestDigestCandidates`. The repository then performs one atomic decision:

`RequestDigestCandidates` must be nameable by the separate infra crate that implements this public trait. Therefore its Rust visibility is `pub` while all fields, construction and canonical generation remain private to `application::digest`; only the three read-only selectors defined by the Step 06 owner are public. This is the `R07-VIS-DIGEST-CANDIDATES-01` correction, not a protocol/export visibility expansion and not permission for infra to fabricate candidates.

| durable collision | exact classification | write permission |
|---|---|---|
| neither logical scope nor event identity exists | insert `Reserved` using write-profile digest; return `Acquired` | sole writer |
| existing `Reserved`, same scope/event and retained-profile candidate matches | `InFlight` | none; incoming UoW rolls back |
| existing `Completed`, same scope/event, retained-profile candidate matches and result pointer valid | `Replay` | none; incoming UoW rolls back then reads original result |
| retained-profile candidate differs or logical/event identities conflict | `Conflict` | none |
| existing row profile has no supplied readable candidate | `PersistedDigestProfileUnreadable` | none; not Conflict/fallback |

The logical unique key and Consumer secondary unique key are established in the same operation. The adapter cannot insert a logical row first and attach an event alias later, use only the current write digest, overwrite a retained profile, or expose stored/incoming digest values in errors.

`mark_completed` accepts a reservation already transitioned in memory by the Step 06 owner. It verifies the same reservation/result relation and stages the CAS after `save_result`; no committed `Reserved + result_ref` intermediate is visible. A completed reservation with missing/wrong result is a consistency defect and never triggers result reconstruction or operation rerun.

### 7.13 Domain-family repository conventions

The seven repository traits below are organized by Step 06 ownership families, not by physical table or adapter product. Every method without a UoW reads committed state only. Every mutable `stage_*` method receives a borrowed post-state plus an expected version from the matching `Versioned<T>` read; `None` is create-if-absent and never disables conflict detection.

Repository indexes are typed capabilities. A `find_*` or `page_*` method returns only rows reachable through the named formal relation and stable order. It cannot parse refs, inspect object bodies in another owner, issue a global scan, create a missing row, or hide a malformed relation as `None`/empty. The application reruns object rehydrate and relation validation before using every result.

### 7.14 Intake and safety repository

```rust
/// Persists observation receipts, safety dispositions, and H1 records.
pub trait ObservationIntakeRepository: Send + Sync {
    /// Load one committed receipt and its exact row version.
    fn get_receipt_with_version<'a>(
        &'a self,
        receipt_ref: &'a ObservationReceiptRef,
    ) -> ApplicationPortFuture<'a, Option<Versioned<ObservationReceipt>>>;

    /// Resolve the current receipt for the complete source-purpose unique key.
    fn find_receipt_by_source_and_purpose<'a>(
        &'a self,
        source_ref: &'a ObservationSourceRef,
        purpose: SubmissionPurpose,
    ) -> ApplicationPortFuture<'a, Option<Versioned<ObservationReceipt>>>;

    /// Page committed receipts in the exact bounded intake-status scope.
    fn page_receipts_by_status_scope<'a>(
        &'a self,
        scope: &'a IntakeStatusScope,
        page: ObservationRepositoryPage,
    ) -> ApplicationPortFuture<'a, ObservationRepositoryPageResult<Versioned<ObservationReceipt>>>;

    /// Load one committed safety disposition and its exact row version.
    fn get_disposition_with_version<'a>(
        &'a self,
        disposition_ref: &'a SafetyDispositionRef,
    ) -> ApplicationPortFuture<'a, Option<Versioned<SafetyDisposition>>>;

    /// Resolve the sole current disposition associated with one receipt.
    fn find_disposition_by_receipt<'a>(
        &'a self,
        receipt_ref: &'a ObservationReceiptRef,
    ) -> ApplicationPortFuture<'a, Option<Versioned<SafetyDisposition>>>;

    /// Stage a create-or-CAS receipt post-state while preserving the caller borrow.
    fn stage_receipt<'a>(
        &'a self,
        receipt: &'a ObservationReceipt,
        expected_version: Option<ObservationRepositoryVersion>,
        uow: &'a dyn ObservationUnitOfWork,
    ) -> ApplicationPortFuture<'a, ()>;

    /// Stage a create-or-CAS disposition post-state in the same UoW as its receipt relation.
    fn stage_disposition<'a>(
        &'a self,
        disposition: &'a SafetyDisposition,
        expected_version: Option<ObservationRepositoryVersion>,
        uow: &'a dyn ObservationUnitOfWork,
    ) -> ApplicationPortFuture<'a, ()>;

    /// Append one immutable H1 record after the batch cursor has been assigned.
    fn append_intake_decision<'a>(
        &'a self,
        record: &'a IntakeDecisionRecord,
        uow: &'a dyn ObservationUnitOfWork,
    ) -> ApplicationPortFuture<'a, ()>;
}
```

| callable group | exact authority / invariant | forbidden shortcut |
|---|---|---|
| receipt unique lookup | exact `(ObservationSourceRef canonical identity, SubmissionPurpose)` from Step 06 | source display/debug/hash、event id、latest-by-time |
| disposition lookup | unique current `receipt_ref`; dangling or duplicate relation is consistency failure | return arbitrary first row、manufacture Pending |
| status page | stable `(received_at, receipt_ref canonical bytes)` order inside `IntakeStatusScope` | unbounded/global scan、page cursor as version |
| receipt/disposition stage | all logical unique and relation checks occur in the supplied UoW; both objects remain borrowable for H1/follower formation | consuming aggregate、upsert overwrite、re-read staged row |
| H1 append | immutable typed identity; staged only after exact `ObservationCommittedCursor` exists | generic history bytes、record-before-cursor、duplicate no-op |

### 7.15 Correlation, signal, and rollup repository

```rust
/// Persists correlation contexts, safe signals, rollups, and H2 records.
pub trait CorrelationSignalRepository: Send + Sync {
    /// Load one committed correlation context and exact row version.
    fn get_context_with_version<'a>(
        &'a self,
        context_ref: &'a CorrelationContextRef,
    ) -> ApplicationPortFuture<'a, Option<Versioned<CorrelationContext>>>;

    /// Resolve the sole current context anchored to one receipt.
    fn find_context_by_receipt<'a>(
        &'a self,
        receipt_ref: &'a ObservationReceiptRef,
    ) -> ApplicationPortFuture<'a, Option<Versioned<CorrelationContext>>>;

    /// Load one committed safe signal and exact row version.
    fn get_signal_with_version<'a>(
        &'a self,
        signal_ref: &'a SafeSignalRef,
    ) -> ApplicationPortFuture<'a, Option<Versioned<SafeSignal>>>;

    /// Page signals for one exact correlation context in canonical ref order.
    fn page_signals_by_context<'a>(
        &'a self,
        context_ref: &'a CorrelationContextRef,
        page: ObservationRepositoryPage,
    ) -> ApplicationPortFuture<'a, ObservationRepositoryPageResult<Versioned<SafeSignal>>>;

    /// Load one committed rollup window and exact row version.
    fn get_rollup_with_version<'a>(
        &'a self,
        window_ref: &'a SignalRollupWindowRef,
    ) -> ApplicationPortFuture<'a, Option<Versioned<SignalRollupWindow>>>;

    /// Resolve the unique rollup identified by its complete scope and window kind.
    fn find_rollup_by_scope_and_kind<'a>(
        &'a self,
        scope: &'a SignalRollupScope,
        window_kind: RollupWindowKind,
    ) -> ApplicationPortFuture<'a, Option<Versioned<SignalRollupWindow>>>;

    /// Page committed rollups in one exact scope and stable window-ref order.
    fn page_rollups_by_scope<'a>(
        &'a self,
        scope: &'a SignalRollupScope,
        page: ObservationRepositoryPage,
    ) -> ApplicationPortFuture<'a, ObservationRepositoryPageResult<Versioned<SignalRollupWindow>>>;

    /// Stage a create-or-CAS correlation context without consuming the post-state.
    fn stage_context<'a>(
        &'a self,
        context: &'a CorrelationContext,
        expected_version: Option<ObservationRepositoryVersion>,
        uow: &'a dyn ObservationUnitOfWork,
    ) -> ApplicationPortFuture<'a, ()>;

    /// Stage a create-or-CAS safe signal without consuming the post-state.
    fn stage_signal<'a>(
        &'a self,
        signal: &'a SafeSignal,
        expected_version: Option<ObservationRepositoryVersion>,
        uow: &'a dyn ObservationUnitOfWork,
    ) -> ApplicationPortFuture<'a, ()>;

    /// Stage a create-or-CAS rollup while its cursor-bound transition remains borrowable.
    fn stage_rollup<'a>(
        &'a self,
        rollup: &'a SignalRollupWindow,
        expected_version: Option<ObservationRepositoryVersion>,
        uow: &'a dyn ObservationUnitOfWork,
    ) -> ApplicationPortFuture<'a, ()>;

    /// Append one immutable H2 record after the batch cursor has been assigned.
    fn append_correlation_record<'a>(
        &'a self,
        record: &'a CorrelationLinkRecord,
        uow: &'a dyn ObservationUnitOfWork,
    ) -> ApplicationPortFuture<'a, ()>;
}
```

`stage_rollup` is the affected correction required by Step 06 F2: it borrows `&SignalRollupWindow` after `accept_signal(..., ObservationCursor)` and while the exact H11 transition material is still available. The adapter may copy validated persistence fields into its staged row representation, but it cannot consume/clone the aggregate or reload another version to construct H11.

| relation | exact repository rule | failure semantics |
|---|---|---|
| receipt -> current context | at most one current context; source relation must equal the loaded receipt | duplicate/dangling/mismatched relation is consistency failure |
| context -> signals | typed context index; canonical signal-ref order; each row rehydrates independently | missing context is not an empty successful owner relation |
| `(scope, window_kind)` -> rollup | unique complete typed pair; no scope serialization-to-ref conversion | duplicate pair or mismatched returned scope is conflict/consistency failure |
| rollup cursor | accepted cursor never decreases and is not a row version | regression rolls back the entire UoW |
| H2 append | exactly one typed family method; no H11 alias | duplicate identity or relation mismatch rolls back the entire UoW |

### 7.16 Audit and evidence repository

```rust
/// Persists local audit projections, body-free evidence linkages, and H3 records.
pub trait AuditEvidenceRepository: Send + Sync {
    /// Load one committed audit projection and exact row version.
    fn get_projection_with_version<'a>(
        &'a self,
        projection_ref: &'a AuditProjectionRef,
    ) -> ApplicationPortFuture<'a, Option<Versioned<AuditProjection>>>;

    /// Page projections for one body-free audit subject in canonical ref order.
    fn page_projections_by_subject<'a>(
        &'a self,
        subject_ref: &'a AuditSubjectRef,
        page: ObservationRepositoryPage,
    ) -> ApplicationPortFuture<'a, ObservationRepositoryPageResult<Versioned<AuditProjection>>>;

    /// Load one committed evidence linkage and exact row version.
    fn get_linkage_with_version<'a>(
        &'a self,
        linkage_ref: &'a EvidenceLinkageRef,
    ) -> ApplicationPortFuture<'a, Option<Versioned<EvidenceLinkage>>>;

    /// Resolve the sole current linkage for its complete semantic relation.
    fn find_linkage_by_relation<'a>(
        &'a self,
        projection_ref: &'a AuditProjectionRef,
        boundary_ref: &'a GovernanceArtifactEvidenceReference,
        purpose: EvidenceConsumerPurpose,
        consumer_scope: &'a EvidenceConsumerScope,
    ) -> ApplicationPortFuture<'a, Option<Versioned<EvidenceLinkage>>>;

    /// Page committed linkages selected by one formal evidence-index scope.
    fn page_linkages_by_evidence_scope<'a>(
        &'a self,
        scope_ref: &'a EvidenceIndexScopeRef,
        page: ObservationRepositoryPage,
    ) -> ApplicationPortFuture<'a, ObservationRepositoryPageResult<Versioned<EvidenceLinkage>>>;

    /// Page body-free audit timeline entries in committed append order.
    fn page_audit_timeline<'a>(
        &'a self,
        subject_ref: &'a AuditSubjectRef,
        page: ObservationRepositoryPage,
    ) -> ApplicationPortFuture<'a, ObservationRepositoryPageResult<AuditTimelineEntryView>>;

    /// Stage a create-or-CAS projection post-state while preserving its borrow.
    fn stage_projection<'a>(
        &'a self,
        projection: &'a AuditProjection,
        expected_version: Option<ObservationRepositoryVersion>,
        uow: &'a dyn ObservationUnitOfWork,
    ) -> ApplicationPortFuture<'a, ()>;

    /// Stage a create-or-CAS linkage post-state while preserving its borrow.
    fn stage_linkage<'a>(
        &'a self,
        linkage: &'a EvidenceLinkage,
        expected_version: Option<ObservationRepositoryVersion>,
        uow: &'a dyn ObservationUnitOfWork,
    ) -> ApplicationPortFuture<'a, ()>;

    /// Append one immutable H3 record after the batch cursor has been assigned.
    fn append_audit_record<'a>(
        &'a self,
        record: &'a AuditAppendRecord,
        uow: &'a dyn ObservationUnitOfWork,
    ) -> ApplicationPortFuture<'a, ()>;
}
```

`find_linkage_by_relation` keys on the boundary's stable typed identity/family/external-ref portion, not on its mutable resolution state or digest snapshot. The returned linkage must still match the complete loaded relation; a duplicate current row or identity drift is a consistency failure. `page_linkages_by_evidence_scope` uses a persisted formal scope index and cannot derive membership from ref prefixes, provider names or body inspection.

`page_audit_timeline` is a read-model capability over committed H3 records plus their validated local projection/linkage relations. Its stable order is `(appended_at ASC, append_record_ref canonical bytes ASC)`. It may return only body-free `AuditTimelineEntryView` values valid under the Step 06 state/visibility matrix; missing owner rows, duplicate record refs with different fields, or a dangling linkage/gap relation are errors rather than omitted entries.

### 7.17 Report handoff repository

```rust
/// Persists immutable evidence inputs, handoff state, hints, and H4 records.
pub trait ReportHandoffRepository: Send + Sync {
    /// Load one exact immutable evidence-index input snapshot.
    fn get_evidence_index_input<'a>(
        &'a self,
        input_ref: &'a EvidenceIndexInputViewRef,
    ) -> ApplicationPortFuture<'a, Option<EvidenceIndexInputView>>;

    /// Append one committable evidence-index input; Query previews never call this method.
    fn append_evidence_index_input<'a>(
        &'a self,
        input: &'a EvidenceIndexInputView,
        uow: &'a dyn ObservationUnitOfWork,
    ) -> ApplicationPortFuture<'a, ()>;

    /// Load one committed report handoff and exact row version.
    fn get_handoff_with_version<'a>(
        &'a self,
        handoff_ref: &'a ReportHandoffRecordRef,
    ) -> ApplicationPortFuture<'a, Option<Versioned<ReportHandoffRecord>>>;

    /// Guard one unchanged handoff revision before an external phase authorization.
    fn register_handoff_read_guard(
        &self,
        handoff: &Versioned<ReportHandoffRecord>,
        item_claim: &Versioned<ObservationExecutionClaim>,
        uow: &dyn ObservationUnitOfWork,
    ) -> Result<(), ApplicationError>;

    /// Guard one terminal local Delivered result for no-call plan reuse.
    fn register_delivered_handoff_read_guard(
        &self,
        handoff: &Versioned<ReportHandoffRecord>,
        item_claim: &Versioned<ObservationExecutionClaim>,
        uow: &dyn ObservationUnitOfWork,
    ) -> Result<(), ApplicationError>;

    /// Load one committed authenticity hint and exact row version.
    fn get_authenticity_hint_with_version<'a>(
        &'a self,
        hint_ref: &'a AuthenticityHintRef,
    ) -> ApplicationPortFuture<'a, Option<Versioned<AuthenticityHint>>>;

    /// Resolve the sole current authenticity hint belonging to one handoff.
    fn find_authenticity_hint_by_handoff<'a>(
        &'a self,
        handoff_ref: &'a ReportHandoffRecordRef,
    ) -> ApplicationPortFuture<'a, Option<Versioned<AuthenticityHint>>>;

    /// Stage a create-or-CAS handoff after its immutable input relation is available.
    fn stage_handoff<'a>(
        &'a self,
        handoff: &'a ReportHandoffRecord,
        expected_version: Option<ObservationRepositoryVersion>,
        uow: &'a dyn ObservationUnitOfWork,
    ) -> ApplicationPortFuture<'a, ()>;

    /// Stage a create-or-CAS authenticity hint while preserving its relation borrow.
    fn stage_authenticity_hint<'a>(
        &'a self,
        hint: &'a AuthenticityHint,
        expected_version: Option<ObservationRepositoryVersion>,
        uow: &'a dyn ObservationUnitOfWork,
    ) -> ApplicationPortFuture<'a, ()>;

    /// Append one immutable H4 record after the batch cursor has been assigned.
    fn append_lifecycle_record<'a>(
        &'a self,
        record: &'a HandoffLifecycleRecord,
        uow: &'a dyn ObservationUnitOfWork,
    ) -> ApplicationPortFuture<'a, ()>;
}
```

An evidence input is append-once by `input_ref`; exact duplicate bytes and relation may be classified as idempotent only inside the already acquired logical operation, while the same ref with different content is a whole-UoW conflict. The repository never rebuilds an immutable input from current projections/linkages/gaps. `stage_handoff` verifies that its input row exists committed or is already staged in the same UoW and that scope/consumer/input identities match. Hint lookup returns at most one current row; it cannot upgrade a terminal placeholder/insufficient hint or infer authenticity from a digest.

`register_handoff_read_guard` accepts only a `ReportHandoff` item claim for the exact handoff ref and the Prepared state required by a pre-call/preparation sidecar path. `register_delivered_handoff_read_guard` accepts the same claim relation only when state is terminal `Delivered`, `delivery_result == Some(HandoffDeliveryResult::Delivered)`, block reason is absent and the caller has already supplied the matching successful HandoffDelivery accounting/receipt proof. Both stage no mutation and commit-time re-read the exact row version. The Delivered guard is only for no-call terminal classification under a later plan; it cannot authorize preparation/delivery or replace the receipt proof. A post-call UoW that stages `stage_handoff(..., Some(version), ...)` uses that CAS instead of either unchanged-owner guard.

### 7.18 Peripheral preparation and delivery repository

```rust
/// Persists product-neutral export preparation, local delivery state, and H9 records.
pub trait PeripheralDeliveryRepository: Send + Sync {
    /// Load one committed external-audit export preparation and exact row version.
    fn get_export_preparation_with_version<'a>(
        &'a self,
        preparation_ref: &'a ExternalAuditExportPreparationRef,
    ) -> ApplicationPortFuture<'a, Option<Versioned<ExternalAuditExportPreparation>>>;

    /// Load one committed peripheral delivery state and exact row version.
    fn get_delivery_with_version<'a>(
        &'a self,
        delivery_ref: &'a PeripheralDeliveryRef,
    ) -> ApplicationPortFuture<'a, Option<Versioned<PeripheralDeliveryState>>>;

    /// Resolve the sole current delivery state associated with one preparation.
    fn find_delivery_by_preparation<'a>(
        &'a self,
        preparation_ref: &'a ExternalAuditExportPreparationRef,
    ) -> ApplicationPortFuture<'a, Option<Versioned<PeripheralDeliveryState>>>;

    /// Guard one unchanged prepared export revision before package preparation.
    fn register_export_preparation_read_guard(
        &self,
        preparation: &Versioned<ExternalAuditExportPreparation>,
        item_claim: &Versioned<ObservationExecutionClaim>,
        uow: &dyn ObservationUnitOfWork,
    ) -> Result<(), ApplicationError>;

    /// Guard the exact export preparation and delivery rows before delivery.
    fn register_export_delivery_read_guard(
        &self,
        preparation: &Versioned<ExternalAuditExportPreparation>,
        delivery: &Versioned<PeripheralDeliveryState>,
        item_claim: &Versioned<ObservationExecutionClaim>,
        uow: &dyn ObservationUnitOfWork,
    ) -> Result<(), ApplicationError>;

    /// Guard one terminal Delivered owner pair for no-call plan reuse.
    fn register_delivered_export_read_guard(
        &self,
        preparation: &Versioned<ExternalAuditExportPreparation>,
        delivery: &Versioned<PeripheralDeliveryState>,
        success_proof: &ExternalEffectExportDeliverySuccessProof,
        item_claim: &Versioned<ObservationExecutionClaim>,
        uow: &dyn ObservationUnitOfWork,
    ) -> Result<(), ApplicationError>;

    /// Stage a create-or-CAS export preparation after validating its immutable input/view relation.
    fn stage_export_preparation<'a>(
        &'a self,
        preparation: &'a ExternalAuditExportPreparation,
        expected_version: Option<ObservationRepositoryVersion>,
        uow: &'a dyn ObservationUnitOfWork,
    ) -> ApplicationPortFuture<'a, ()>;

    /// Stage a create-or-CAS local delivery post-state; no adapter call occurs here.
    fn stage_delivery<'a>(
        &'a self,
        delivery: &'a PeripheralDeliveryState,
        expected_version: Option<ObservationRepositoryVersion>,
        uow: &'a dyn ObservationUnitOfWork,
    ) -> ApplicationPortFuture<'a, ()>;

    /// Append one immutable H9 record after the batch cursor has been assigned.
    fn append_delivery_record<'a>(
        &'a self,
        record: &'a PeripheralDeliveryRecord,
        uow: &'a dyn ObservationUnitOfWork,
    ) -> ApplicationPortFuture<'a, ()>;
}
```

Preparation and delivery are separate CAS owners. `find_delivery_by_preparation` uses the unique current preparation relation and rejects competing current rows. A delivery adapter result is first validated by the external-effect owner and applied to the in-memory object; this repository only stages that finite local post-state. It never invokes an endpoint, stores provider body/credential/receipt, treats `Delivered` as external acceptance, or rewrites the referenced consumer/view/evidence truth.

The Prepared read-guard methods accept only an `ExternalExport` item claim for the exact preparation. Package preparation requires a current local `Prepared` export row. Delivery additionally requires the unique matching `Prepared` delivery row and exact preparation/consumer/view relation. `register_delivered_export_read_guard` is separate: both owners must be terminal `Delivered` with `PeripheralDeliveryResult::Delivered`, no failure/block fields, exact preparation/consumer/view relation, and row versions/refs equal the supplied Step 06 success proof. It is legal only for no-call terminal classification under a semantic-equal successful delivery intent and does not authorize an adapter call. All guards stage no mutation and commit-time revalidate every supplied row/version. A post-call CAS on one owner does not silently guard the other: export delivery finalization stages both required owner CAS values or registers the unchanged companion row explicitly as required by the owning transition.

| family | immutable / mutable order inside one local UoW | typed append |
|---|---|---|
| audit/evidence | stage projection/linkage borrow -> assign cursor -> append H3 -> followers | `append_audit_record` |
| report handoff | append input if new -> stage handoff/hint borrow -> assign cursor -> append H4 -> followers | `append_lifecycle_record` |
| peripheral | stage preparation/delivery borrow -> assign cursor -> append H9 -> followers | `append_delivery_record` |

### 7.19 Retention, no-write, gap, and replay repository

```rust
/// Persists observation-owned retention guards, replay scopes, gaps, degraded
/// revisions, and the H5/H6/H8/H12/H13 append-only families.
pub trait RetentionGuardRepository: Send + Sync {
    /// Load one committed retention marker and its exact row version.
    fn get_retention_with_version<'a>(
        &'a self,
        marker_ref: &'a RetentionMarkerRef,
    ) -> ApplicationPortFuture<'a, Option<Versioned<RetentionMarker>>>;

    /// Resolve the sole current marker for one complete protected-object identity.
    fn find_retention_by_protected_ref<'a>(
        &'a self,
        protected_ref: &'a ProtectedObservationRef,
    ) -> ApplicationPortFuture<'a, Option<Versioned<RetentionMarker>>>;

    /// Load one committed active-protection row and its exact version.
    fn get_active_protection_with_version<'a>(
        &'a self,
        protection_ref: &'a ActiveReferenceProtectionRef,
    ) -> ApplicationPortFuture<'a, Option<Versioned<ActiveReferenceProtection>>>;

    /// Page the complete protection lifecycle for one protected object.
    fn page_active_protections_by_protected_ref<'a>(
        &'a self,
        protected_ref: &'a ProtectedObservationRef,
        page: ObservationRepositoryPage,
    ) -> ApplicationPortFuture<
        'a,
        ObservationRepositoryPageResult<Versioned<ActiveReferenceProtection>>,
    >;

    /// Load one committed replay scope and its exact row version.
    fn get_replay_scope_with_version<'a>(
        &'a self,
        scope_ref: &'a ReplayScopeRef,
    ) -> ApplicationPortFuture<'a, Option<Versioned<ReplayScope>>>;

    /// Load one committed no-write violation and its exact row version.
    fn get_no_write_violation_with_version<'a>(
        &'a self,
        violation_ref: &'a NoWriteViolationRef,
    ) -> ApplicationPortFuture<'a, Option<Versioned<NoWriteViolation>>>;

    /// Load one committed gap and its exact row version.
    fn get_gap_with_version<'a>(
        &'a self,
        gap_ref: &'a GapStateRef,
    ) -> ApplicationPortFuture<'a, Option<Versioned<GapState>>>;

    /// Resolve the sole nonterminal current gap for one typed source.
    fn find_current_gap_by_source<'a>(
        &'a self,
        source_ref: &'a GapSourceRef,
    ) -> ApplicationPortFuture<'a, Option<Versioned<GapState>>>;

    /// Page the complete gap lifecycle for one typed source.
    fn page_gaps_by_source<'a>(
        &'a self,
        source_ref: &'a GapSourceRef,
        page: ObservationRepositoryPage,
    ) -> ApplicationPortFuture<'a, ObservationRepositoryPageResult<Versioned<GapState>>>;

    /// Load one immutable degraded-output revision and its storage version.
    fn get_degraded_output_with_version<'a>(
        &'a self,
        degraded_ref: &'a DegradedOutputRef,
    ) -> ApplicationPortFuture<'a, Option<Versioned<DegradedOutputState>>>;

    /// Stage a create-or-CAS retention post-state without consuming it.
    fn stage_retention<'a>(
        &'a self,
        marker: &'a RetentionMarker,
        expected_version: Option<ObservationRepositoryVersion>,
        uow: &'a dyn ObservationUnitOfWork,
    ) -> ApplicationPortFuture<'a, ()>;

    /// Stage a create-or-CAS protection post-state without consuming it.
    fn stage_active_protection<'a>(
        &'a self,
        protection: &'a ActiveReferenceProtection,
        expected_version: Option<ObservationRepositoryVersion>,
        uow: &'a dyn ObservationUnitOfWork,
    ) -> ApplicationPortFuture<'a, ()>;

    /// Stage a create-or-CAS replay-scope post-state without executing replay.
    fn stage_replay_scope<'a>(
        &'a self,
        scope: &'a ReplayScope,
        expected_version: Option<ObservationRepositoryVersion>,
        uow: &'a dyn ObservationUnitOfWork,
    ) -> ApplicationPortFuture<'a, ()>;

    /// Stage a violation post-state before cursor-bound H6 construction.
    fn stage_no_write_violation<'a>(
        &'a self,
        violation: &'a NoWriteViolation,
        expected_version: Option<ObservationRepositoryVersion>,
        uow: &'a dyn ObservationUnitOfWork,
    ) -> ApplicationPortFuture<'a, ()>;

    /// Stage a create-or-CAS gap post-state without consuming it.
    fn stage_gap<'a>(
        &'a self,
        gap: &'a GapState,
        expected_version: Option<ObservationRepositoryVersion>,
        uow: &'a dyn ObservationUnitOfWork,
    ) -> ApplicationPortFuture<'a, ()>;

    /// Append one new immutable revision; an existing identity is always conflict.
    fn stage_new_degraded_output_revision<'a>(
        &'a self,
        degraded: &'a DegradedOutputState,
        uow: &'a dyn ObservationUnitOfWork,
    ) -> ApplicationPortFuture<'a, ()>;

    /// Append one immutable H5 record after the batch cursor is assigned.
    fn append_retention_record<'a>(
        &'a self,
        record: &'a RetentionChangeRecord,
        uow: &'a dyn ObservationUnitOfWork,
    ) -> ApplicationPortFuture<'a, ()>;

    /// Append one immutable H6 record separately from violation staging.
    fn append_no_write_violation_record<'a>(
        &'a self,
        record: &'a NoWriteViolationRecord,
        uow: &'a dyn ObservationUnitOfWork,
    ) -> ApplicationPortFuture<'a, ()>;

    /// Append one immutable H8 record after the batch cursor is assigned.
    fn append_gap_record<'a>(
        &'a self,
        record: &'a GapTransitionRecord,
        uow: &'a dyn ObservationUnitOfWork,
    ) -> ApplicationPortFuture<'a, ()>;

    /// Append one immutable H12 scan record from the borrowed scan post-state.
    fn append_gap_scan_record<'a>(
        &'a self,
        record: &'a GapScanRecord,
        uow: &'a dyn ObservationUnitOfWork,
    ) -> ApplicationPortFuture<'a, ()>;

    /// Append one per-target H13 coordination record; scope definition cannot call it.
    fn append_replay_execution_record<'a>(
        &'a self,
        record: &'a ReplayExecutionRecord,
        uow: &'a dyn ObservationUnitOfWork,
    ) -> ApplicationPortFuture<'a, ()>;
}
```

| capability | exact relation / ordering | failure and no-authority rule |
|---|---|---|
| retention singular lookup | one current marker for the complete typed `ProtectedObservationRef`; returned marker must carry the same target | duplicate current rows、target mismatch or dangling protection relation is consistency failure; absence does not authorize cleanup |
| protection page | stable `(protection_ref canonical bytes)` order for one exact protected ref; each item has its own version | page cursor is not a version; Expired/Released rows are not silently filtered when the caller requests the complete relation |
| replay scope read/stage | exact owned scope identity and canonical target set; allowed effect remains observation-derived and no-write | repository does not approve replay、expand targets or execute an effect |
| gap singular/page | `find_current_gap_by_source` returns at most one nonterminal current gap; page returns the complete lifecycle in stable `(opened_at, gap_ref)` order | not-visible is not missing; duplicate current gap or malformed source relation is not collapsed to the first row |
| degraded revision | every accepted create/replacement uses `new_degraded_output_ref`; old revision remains immutable | no update/upsert/delete, no identity derived from gap/scope/digest, and no normal-success synthesis |
| H5/H6/H8/H12/H13 | exact family identity, same UoW and post-cursor append | duplicate record identity or family/relation mismatch rolls back the entire UoW |

`stage_no_write_violation` and `append_no_write_violation_record` are deliberately separate. The former runs before cursor assignment and preserves the borrowed H6 post-state; the latter runs only after the F2 append batch exists. Initial `Detected` creation may stage a violation without H6 because it has no accepted lifecycle transition. The historical composite `save_no_write_violation(violation, record, ...)` is forbidden.

H13 remains controlled by `R06.6-F2-H13-UPSTREAM`. `DefineReplayScope` may create or transition `ReplayScope`, but it cannot call `append_replay_execution_record`. Only a per-target `CoordinateObservationReplay` item with an accepted `ReplayCoordinationTransition` may construct and append H13. The repository does not infer a target, synthesize a coordination transition, append one scope-wide record or treat a Job report as H13.

### 7.20 Reference snapshot and maintenance repository

`MaintenanceTargetScopeBinding` is an application persistence carrier, not a public protocol object:

```rust
/// Immutable canonical member scopes bound to one maintenance target.
pub struct MaintenanceTargetScopeBinding {
    /// Complete typed maintenance target owning this immutable binding.
    target_ref: MaintenanceTargetRef,
    /// Non-empty canonical ordinary scopes; aggregate target scopes are forbidden.
    member_scopes: Vec<ObservationProjectionScope>,
    /// Complete namespace dependencies derived from validated typed roles.
    dependency_namespaces: MaintenanceDependencyNamespaceSet,
    /// Local binding time used only as audit metadata.
    bound_at: ObservedAt,
}
```

`pub fn try_new(target_ref, member_scopes, dependency_namespaces, bound_at) -> Result<Self, ApplicationError>` requires a non-empty bounded canonical sorted/unique member list, rejects `ByMaintenanceTarget` as a member, and validates target kind/effect/scope compatibility plus the complete non-empty namespace set. Read-only accessors are `target_ref() -> &MaintenanceTargetRef`、`member_scopes() -> &[ObservationProjectionScope]`、`dependency_namespaces() -> &MaintenanceDependencyNamespaceSet` and `bound_at() -> ObservedAt`. The carrier contains no aggregate cursor or reusable fence; target dual positions and revision are projection-store technical state.

```rust
/// Persists body-free reference snapshots and local maintenance coordination.
pub trait ReferenceMaintenanceRepository: Send + Sync {
    /// Load one committed reference snapshot and its exact row version.
    fn get_snapshot_with_version<'a>(
        &'a self,
        snapshot_ref: &'a ReferenceSnapshotStateRef,
    ) -> ApplicationPortFuture<'a, Option<Versioned<ReferenceSnapshotState>>>;

    /// Resolve the sole current usable snapshot for one typed subject.
    fn find_current_snapshot_by_subject<'a>(
        &'a self,
        subject_ref: &'a ReferenceSubjectRef,
    ) -> ApplicationPortFuture<'a, Option<Versioned<ReferenceSnapshotState>>>;

    /// Page tracked snapshots through one formal public refresh scope.
    fn page_snapshots_by_scope<'a>(
        &'a self,
        scope: &'a ObservationReferenceRefreshScope,
        page: ObservationRepositoryPage,
    ) -> ApplicationPortFuture<
        'a,
        ObservationRepositoryPageResult<Versioned<ReferenceSnapshotState>>,
    >;

    /// Load one committed projection-maintenance state and its exact version.
    fn get_maintenance_with_version<'a>(
        &'a self,
        maintenance_ref: &'a ProjectionMaintenanceRef,
    ) -> ApplicationPortFuture<'a, Option<Versioned<ProjectionMaintenanceState>>>;

    /// Resolve the sole current maintenance state for one complete target.
    fn find_maintenance_by_target<'a>(
        &'a self,
        target_ref: &'a MaintenanceTargetRef,
    ) -> ApplicationPortFuture<'a, Option<Versioned<ProjectionMaintenanceState>>>;

    /// Page committed maintenance states related to one canonical scope.
    fn page_maintenance_by_scope<'a>(
        &'a self,
        scope: &'a ObservationProjectionScope,
        page: ObservationRepositoryPage,
    ) -> ApplicationPortFuture<
        'a,
        ObservationRepositoryPageResult<Versioned<ProjectionMaintenanceState>>,
    >;

    /// Load the exact immutable member binding for one maintenance target.
    fn get_maintenance_target_scope_binding<'a>(
        &'a self,
        target_ref: &'a MaintenanceTargetRef,
    ) -> ApplicationPortFuture<'a, Option<MaintenanceTargetScopeBinding>>;

    /// Load one committed per-target replay coordination and its exact version.
    fn get_replay_coordination_with_version<'a>(
        &'a self,
        coordination_ref: &'a ReplayCoordinationRef,
    ) -> ApplicationPortFuture<'a, Option<Versioned<ReplayCoordinationState>>>;

    /// Resolve one coordination by its complete approved-scope/target relation.
    fn find_replay_coordination_by_scope_and_target<'a>(
        &'a self,
        scope_ref: &'a ReplayScopeRef,
        target_ref: &'a MaintenanceTargetRef,
    ) -> ApplicationPortFuture<'a, Option<Versioned<ReplayCoordinationState>>>;

    /// Load one committed rollup-rebuild attempt and its exact version.
    fn get_rollup_rebuild_with_version<'a>(
        &'a self,
        rebuild_ref: &'a RollupRebuildRef,
    ) -> ApplicationPortFuture<'a, Option<Versioned<RollupRebuildState>>>;

    /// Page all rebuild attempts for one rollup window in stable order.
    fn page_rollup_rebuilds_by_window<'a>(
        &'a self,
        window_ref: &'a SignalRollupWindowRef,
        page: ObservationRepositoryPage,
    ) -> ApplicationPortFuture<'a, ObservationRepositoryPageResult<Versioned<RollupRebuildState>>>;

    /// Stage a create-or-CAS snapshot post-state without consuming it.
    fn stage_snapshot<'a>(
        &'a self,
        snapshot: &'a ReferenceSnapshotState,
        expected_version: Option<ObservationRepositoryVersion>,
        uow: &'a dyn ObservationUnitOfWork,
    ) -> ApplicationPortFuture<'a, ()>;

    /// Stage a create-or-CAS maintenance post-state without consuming it.
    fn stage_maintenance<'a>(
        &'a self,
        maintenance: &'a ProjectionMaintenanceState,
        expected_version: Option<ObservationRepositoryVersion>,
        uow: &'a dyn ObservationUnitOfWork,
    ) -> ApplicationPortFuture<'a, ()>;

    /// First-bind scopes and initialize the aggregate target position atomically.
    fn bind_maintenance_target_scopes<'a>(
        &'a self,
        binding: &'a MaintenanceTargetScopeBinding,
        uow: &'a dyn ObservationUnitOfWork,
    ) -> ApplicationPortFuture<'a, ()>;

    /// Stage a create-or-CAS per-target replay coordination post-state.
    fn stage_replay_coordination<'a>(
        &'a self,
        coordination: &'a ReplayCoordinationState,
        expected_version: Option<ObservationRepositoryVersion>,
        uow: &'a dyn ObservationUnitOfWork,
    ) -> ApplicationPortFuture<'a, ()>;

    /// Stage a create-or-CAS rollup-rebuild post-state without consuming it.
    fn stage_rollup_rebuild<'a>(
        &'a self,
        rebuild: &'a RollupRebuildState,
        expected_version: Option<ObservationRepositoryVersion>,
        uow: &'a dyn ObservationUnitOfWork,
    ) -> ApplicationPortFuture<'a, ()>;

    /// Append one immutable H10 reference-refresh record using the batch cursor tag.
    fn append_refresh_record<'a>(
        &'a self,
        record: &'a ReferenceRefreshRecord,
        uow: &'a dyn ObservationUnitOfWork,
    ) -> ApplicationPortFuture<'a, ()>;

    /// Append one immutable H11 maintenance record after cursor assignment.
    fn append_projection_maintenance_record<'a>(
        &'a self,
        record: &'a ProjectionMaintenanceRecord,
        uow: &'a dyn ObservationUnitOfWork,
    ) -> ApplicationPortFuture<'a, ()>;
}
```

| relation | exact contract | forbidden shortcut |
|---|---|---|
| snapshot subject | at most one current usable snapshot per typed subject; invalid replacement keeps the old revision and creates a new identity when Step 06 requires it | overwrite an immutable invalid revision、store resolver body、treat resolver availability as external truth |
| refresh scope page | `ExplicitRefs`、`BySourceFamily`、`UnhealthyOnly` and `ByMaintenanceTarget` resolve only through the formal reference-scope index | raw-body scan、ref-prefix parsing、global fallback、auto-create missing snapshot |
| target maintenance | one current state per complete `MaintenanceTargetRef`; target lookup and PK lookup must agree | choose newest timestamp、infer target from progress ref、return arbitrary duplicate |
| immutable binding | first bind writes the exact non-empty member set and initializes the target aggregate position/revision in the same start UoW; exact retry is no-op, different set is conflict | expand/shrink on resume、default aggregate to zero、commit binding before initialization |
| replay coordination | exact `(approved scope, target)` relation for one execution identity | scope-wide implicit iteration、source write、reuse failed execution identity for retry |
| rollup rebuild | page by exact window in stable `(updated_at, rebuild_ref)` order; each attempt retains its source cursor | current-signal relist on resume、cursor regression、mutation of source signal truth |
| H10/H11 append | H10 accepts the batch's single Reference or Observation cursor tag; H11 includes projection/replay/rollup maintenance subjects | generic maintenance bytes、second cursor allocation、record before borrowed post-state is available |

`bind_maintenance_target_scopes` is the sole persistence entry for the immutable target-member relation. `ObservationProjectionSourceReader.capture(ByMaintenanceTarget(target), same_uow)` must see a staged first binding and the initialized aggregate through read-your-writes. If a durable adapter cannot provide that visibility, start fails and rolls back; it cannot commit the binding and capture in a later transaction.

### 7.21 Projection technical carriers and ports

The following types are public only across the application/infra crate boundary and are owned by `application::ports::projection`. They have no serde/wire implementation, are not public DTOs, and cannot be stored as opaque blobs. Constructors validate the finite variant/ref relation, canonical order, bounds and namespace rules before an adapter can persist or return them.

```rust
/// Finite role of one tracked source inside a projection membership.
pub enum ProjectionDependencyRole {
    /// Observation receipt dependency.
    Observation,
    /// Safety-disposition dependency.
    Safety,
    /// Correlation-context dependency.
    Correlation,
    /// Safe-signal dependency.
    Signal,
    /// Local audit-projection dependency.
    Audit,
    /// Body-free evidence-linkage dependency.
    Evidence,
    /// Report-handoff dependency.
    Handoff,
    /// Authenticity-hint dependency.
    Authenticity,
    /// Retention-marker dependency.
    Retention,
    /// Active-reference-protection dependency.
    Protection,
    /// No-write-violation dependency.
    NoWrite,
    /// Explicit gap dependency.
    Gap,
    /// Immutable degraded-output dependency.
    Degraded,
    /// Body-free reference-snapshot dependency.
    Reference,
}

/// Typed identity of one current projection source row.
pub enum ProjectionSourceRef {
    /// Identity of an observation receipt source.
    Receipt(ObservationReceiptRef),
    /// Identity of a safety-disposition source.
    SafetyDisposition(SafetyDispositionRef),
    /// Identity of a correlation-context source.
    CorrelationContext(CorrelationContextRef),
    /// Identity of a safe-signal source.
    SafeSignal(SafeSignalRef),
    /// Identity of a local audit-projection source.
    AuditProjection(AuditProjectionRef),
    /// Identity of a body-free evidence-linkage source.
    EvidenceLinkage(EvidenceLinkageRef),
    /// Identity of a report-handoff source.
    ReportHandoff(ReportHandoffRecordRef),
    /// Identity of an authenticity-hint source.
    AuthenticityHint(AuthenticityHintRef),
    /// Identity of a retention-marker source.
    RetentionMarker(RetentionMarkerRef),
    /// Identity of an active-protection source.
    ActiveProtection(ActiveReferenceProtectionRef),
    /// Identity of a no-write-violation source.
    NoWriteViolation(NoWriteViolationRef),
    /// Identity of an explicit gap source.
    Gap(GapStateRef),
    /// Identity of an immutable degraded-output revision.
    DegradedOutput(DegradedOutputRef),
    /// Identity of a body-free reference-snapshot source.
    ReferenceSnapshot(ReferenceSnapshotStateRef),
}

/// Borrowed post-state supplied to the membership planner without cloning it.
pub enum ProjectionSourceFact<'a> {
    /// Borrowed receipt post-state.
    Receipt(&'a ObservationReceipt),
    /// Borrowed safety-disposition post-state.
    SafetyDisposition(&'a SafetyDisposition),
    /// Borrowed correlation-context post-state.
    CorrelationContext(&'a CorrelationContext),
    /// Borrowed safe-signal post-state.
    SafeSignal(&'a SafeSignal),
    /// Borrowed local audit-projection post-state.
    AuditProjection(&'a AuditProjection),
    /// Borrowed body-free evidence-linkage post-state.
    EvidenceLinkage(&'a EvidenceLinkage),
    /// Borrowed report-handoff post-state.
    ReportHandoff(&'a ReportHandoffRecord),
    /// Borrowed authenticity-hint post-state.
    AuthenticityHint(&'a AuthenticityHint),
    /// Borrowed retention-marker post-state.
    RetentionMarker(&'a RetentionMarker),
    /// Borrowed active-protection post-state.
    ActiveProtection(&'a ActiveReferenceProtection),
    /// Borrowed no-write-violation post-state.
    NoWriteViolation(&'a NoWriteViolation),
    /// Borrowed gap post-state.
    Gap(&'a GapState),
    /// Borrowed immutable degraded-output revision.
    DegradedOutput(&'a DegradedOutputState),
    /// Borrowed body-free reference-snapshot post-state.
    ReferenceSnapshot(&'a ReferenceSnapshotState),
}

/// Owned rehydrated current source value returned by a bounded capture.
pub enum ProjectionSourceItem {
    /// Rehydrated receipt source.
    Receipt(ObservationReceipt),
    /// Rehydrated safety-disposition source.
    SafetyDisposition(SafetyDisposition),
    /// Rehydrated correlation-context source.
    CorrelationContext(CorrelationContext),
    /// Rehydrated safe-signal source.
    SafeSignal(SafeSignal),
    /// Rehydrated local audit-projection source.
    AuditProjection(AuditProjection),
    /// Rehydrated body-free evidence-linkage source.
    EvidenceLinkage(EvidenceLinkage),
    /// Rehydrated report-handoff source.
    ReportHandoff(ReportHandoffRecord),
    /// Rehydrated authenticity-hint source.
    AuthenticityHint(AuthenticityHint),
    /// Rehydrated retention-marker source.
    RetentionMarker(RetentionMarker),
    /// Rehydrated active-protection source.
    ActiveProtection(ActiveReferenceProtection),
    /// Rehydrated no-write-violation source.
    NoWriteViolation(NoWriteViolation),
    /// Rehydrated gap source.
    Gap(GapState),
    /// Rehydrated immutable degraded-output revision.
    DegradedOutput(DegradedOutputState),
    /// Rehydrated body-free reference-snapshot source.
    ReferenceSnapshot(ReferenceSnapshotState),
}

/// One exact ordinary-scope membership; aggregate target scopes are forbidden.
pub struct ProjectionMembership {
    /// Exact ordinary canonical scope containing the source.
    scope: ObservationProjectionScope,
    /// Finite relation role played by the source in this scope.
    role: ProjectionDependencyRole,
}

/// Typed root whose before/after relation may change an indirect membership.
pub enum ProjectionRelationAnchor {
    /// Receipt root used for observation-scope closure.
    Observation(ObservationReceiptRef),
    /// Correlation root used for receipt/signal/audit closure.
    Correlation(CorrelationContextRef),
    /// Audit-subject root used for subject closure.
    AuditSubject(AuditSubjectRef),
    /// Handoff root used for immutable-input closure.
    ReportHandoff(ReportHandoffRecordRef),
    /// Protected-object root used for retention/protection closure.
    ProtectedObservation(ProtectedObservationRef),
    /// Gap-source root used for gap/degraded closure.
    GapSource(GapSourceRef),
    /// Reference-subject root used for body-free snapshot closure.
    ReferenceSubject(ReferenceSubjectRef),
}

/// Complete no-cursor input to the membership planner for one accepted UoW.
pub struct ProjectionSourceChangeSet<'a> {
    /// Borrowed direct post-states changed by this accepted UoW.
    changed_items: Vec<ProjectionSourceFact<'a>>,
    /// Complete before/after typed roots whose relation closure may change.
    affected_relation_anchors: Vec<ProjectionRelationAnchor>,
    /// Operation-scoped first-index time for previously untracked sources.
    first_index_observed_at: ObservedAt,
}

/// Exact replacement of one source row and all of its current memberships.
pub struct ProjectionSourceIndexUpdate {
    /// Exact typed source whose current metadata and memberships are replaced.
    source_ref: ProjectionSourceRef,
    /// Stable first-index time retained across withdrawal and re-entry.
    source_observed_at: ObservedAt,
    /// Complete current ordinary-scope membership set; empty means withdrawal.
    memberships: Vec<ProjectionMembership>,
}

/// Canonical non-empty set returned by the membership planner.
pub struct ProjectionSourceIndexUpdateSet(Vec<ProjectionSourceIndexUpdate>);

/// One current source row returned by a bounded capture.
pub struct ProjectionSourceRecord {
    /// Exact typed identity of this captured source.
    source_ref: ProjectionSourceRef,
    /// Rehydrated current source value matching the identity variant.
    item: ProjectionSourceItem,
    /// Stable local source time used for diagnostic windows.
    source_observed_at: ObservedAt,
    /// Tagged cursor of the last accepted source or membership change.
    last_changed_cursor: ObservationCommittedCursor,
    /// Exact selected ordinary-scope and role pairs retained by capture.
    memberships: Vec<ProjectionMembership>,
}

/// Monotonic revision of one ordinary or aggregate projection scope position.
pub struct ProjectionScopeRevision(NonZeroU64);

/// Transaction-local proof that capture and replacement use one scope snapshot.
pub struct ProjectionReadFence {
    /// Exact transaction in which the complete source set was captured.
    transaction_ref: ObservationTransactionRef,
    /// Canonical ordinary or aggregate scope protected by this fence.
    scope: ObservationProjectionScope,
    /// Scope revision that commit must revalidate.
    scope_revision: ProjectionScopeRevision,
}

/// Dual namespace position and exact same-UoW read fence for one capture.
pub struct ProjectionSourcePosition {
    /// Captured observation upper position when required by the dependency set.
    observation_cursor: Option<ObservationCursor>,
    /// Captured reference upper position when required by the dependency set.
    reference_cursor: Option<ReferenceCursor>,
    /// Complete non-empty namespace declaration for this capture.
    dependency_namespaces: MaintenanceDependencyNamespaceSet,
    /// Same-UoW membership and position proof.
    read_fence: ProjectionReadFence,
}

/// Complete bounded source material used to assemble one replacement.
pub struct ProjectionSourceSnapshot {
    /// Exact canonical scope used for this complete capture.
    scope: ObservationProjectionScope,
    /// Complete bounded current source set in canonical order.
    items: Vec<ProjectionSourceRecord>,
    /// Canonical non-empty affected objects derived from the source set.
    target_refs: AffectedObservationObjectRefSet,
    /// Finite diagnostic time bounds derived only from local source times.
    diagnostic_time_window: DiagnosticTimeWindow,
    /// Dual positions and same-UoW read fence for all replacements.
    source_position: ProjectionSourcePosition,
}

/// One projection identity selected from the dependency index for stale marking.
pub enum AffectedProjectionRef {
    /// Existing observation read-model identity.
    ObservationReadModel(ObservationReadModelRef),
    /// Existing diagnostic-view identity.
    DiagnosticView(DiagnosticViewRef),
    /// Existing gap-status identity, which is the gap identity itself.
    GapStatus(GapStateRef),
    /// Existing product-neutral peripheral-view identity.
    PeripheralExport(DashboardAlertExportViewRef),
    /// Existing reference-view identity, which is the snapshot identity itself.
    ReferenceSnapshot(ReferenceSnapshotStateRef),
    /// Existing target rebuild-progress identity.
    RebuildProgress(RebuildProgressViewRef),
}

/// Canonical bounded set of existing projections selected for stale marking.
pub struct AffectedProjectionSet(Vec<AffectedProjectionRef>);

/// Canonical bounded set of typed source identities used for dependency lookup.
pub struct ProjectionSourceRefSet(Vec<ProjectionSourceRef>);

/// Full committed diagnostic composite covered by one repository version.
pub struct DiagnosticProjectionSnapshot {
    /// Stable public diagnostic view body.
    view: DiagnosticView,
    /// Stable diagnostic scope body.
    scope: DiagnosticScope,
    /// Immutable current diagnostic-summary snapshot.
    summary: DiagnosticSummary,
}

/// Atomic replacement of the stable diagnostic body and immutable new summary.
pub struct DiagnosticProjectionReplacement {
    /// Replacement public view preserving stable view and marker identities.
    view: DiagnosticView,
    /// Replacement scope preserving its stable scope identity.
    scope: DiagnosticScope,
    /// New immutable summary with a freshly generated identity.
    summary: DiagnosticSummary,
}
```

`ProjectionSourceRef` and `AffectedProjectionRef` use application-owned technical canonical bytes only for projection-index persistence, ordering and repository cursor positions. They are not wire DTOs and do not enter the Step 06 digest material registry. Their common frame is `u16_be(tag_len) || tag_ascii || u16_be(ref_len) || typed_ref.as_body_free_ref().canonical_bytes()`. The tag, including its `.v1` suffix, is part of identity; comparison is unsigned lexicographic comparison over the complete frame.

| `ProjectionSourceRef` variant | exact canonical / storage tag |
|---|---|
| `Receipt` | `projection_source.receipt.v1` |
| `SafetyDisposition` | `projection_source.safety_disposition.v1` |
| `CorrelationContext` | `projection_source.correlation_context.v1` |
| `SafeSignal` | `projection_source.safe_signal.v1` |
| `AuditProjection` | `projection_source.audit_projection.v1` |
| `EvidenceLinkage` | `projection_source.evidence_linkage.v1` |
| `ReportHandoff` | `projection_source.report_handoff.v1` |
| `AuthenticityHint` | `projection_source.authenticity_hint.v1` |
| `RetentionMarker` | `projection_source.retention_marker.v1` |
| `ActiveProtection` | `projection_source.active_protection.v1` |
| `NoWriteViolation` | `projection_source.no_write_violation.v1` |
| `Gap` | `projection_source.gap.v1` |
| `DegradedOutput` | `projection_source.degraded_output.v1` |
| `ReferenceSnapshot` | `projection_source.reference_snapshot.v1` |

| `AffectedProjectionRef` variant | exact canonical / storage tag |
|---|---|
| `ObservationReadModel` | `affected_projection.observation_read_model.v1` |
| `DiagnosticView` | `affected_projection.diagnostic_view.v1` |
| `GapStatus` | `affected_projection.gap_status.v1` |
| `PeripheralExport` | `affected_projection.peripheral_export.v1` |
| `ReferenceSnapshot` | `affected_projection.reference_snapshot.v1` |
| `RebuildProgress` | `affected_projection.rebuild_progress.v1` |

The validated cross-crate surface is finite rather than a generic `(String, String)` constructor:

```rust
impl ProjectionSourceRef {
    pub fn try_rehydrate_receipt(value: String) -> Result<Self, ApplicationError>;
    pub fn try_rehydrate_safety_disposition(value: String) -> Result<Self, ApplicationError>;
    pub fn try_rehydrate_correlation_context(value: String) -> Result<Self, ApplicationError>;
    pub fn try_rehydrate_safe_signal(value: String) -> Result<Self, ApplicationError>;
    pub fn try_rehydrate_audit_projection(value: String) -> Result<Self, ApplicationError>;
    pub fn try_rehydrate_evidence_linkage(value: String) -> Result<Self, ApplicationError>;
    pub fn try_rehydrate_report_handoff(value: String) -> Result<Self, ApplicationError>;
    pub fn try_rehydrate_authenticity_hint(value: String) -> Result<Self, ApplicationError>;
    pub fn try_rehydrate_retention_marker(value: String) -> Result<Self, ApplicationError>;
    pub fn try_rehydrate_active_protection(value: String) -> Result<Self, ApplicationError>;
    pub fn try_rehydrate_no_write_violation(value: String) -> Result<Self, ApplicationError>;
    pub fn try_rehydrate_gap(value: String) -> Result<Self, ApplicationError>;
    pub fn try_rehydrate_degraded_output(value: String) -> Result<Self, ApplicationError>;
    pub fn try_rehydrate_reference_snapshot(value: String) -> Result<Self, ApplicationError>;

    pub fn as_body_free_ref(&self) -> &BodyFreeRef;
    pub fn canonical_bytes(&self) -> Vec<u8>;
}

impl AffectedProjectionRef {
    pub fn try_rehydrate_observation_read_model(value: String) -> Result<Self, ApplicationError>;
    pub fn try_rehydrate_diagnostic_view(value: String) -> Result<Self, ApplicationError>;
    pub fn try_rehydrate_gap_status(value: String) -> Result<Self, ApplicationError>;
    pub fn try_rehydrate_peripheral_export(value: String) -> Result<Self, ApplicationError>;
    pub fn try_rehydrate_reference_snapshot(value: String) -> Result<Self, ApplicationError>;
    pub fn try_rehydrate_rebuild_progress(value: String) -> Result<Self, ApplicationError>;

    pub fn as_body_free_ref(&self) -> &BodyFreeRef;
    pub fn canonical_bytes(&self) -> Vec<u8>;
}

impl AffectedProjectionSet {
    pub fn try_new(
        items: Vec<AffectedProjectionRef>,
        relation_closure_limit: &PositiveLimit,
    ) -> Result<Self, ApplicationError>;

    pub fn as_slice(&self) -> &[AffectedProjectionRef];
    pub fn is_empty(&self) -> bool;
    pub fn len(&self) -> usize;
}

impl ProjectionSourceRefSet {
    pub fn try_new(
        items: Vec<ProjectionSourceRef>,
        relation_closure_limit: &PositiveLimit,
    ) -> Result<Self, ApplicationError>;

    pub fn as_slice(&self) -> &[ProjectionSourceRef];
    pub fn len(&self) -> usize;
    pub fn canonical_bytes(&self) -> Vec<u8>;
}
```

Every exact rehydrate factory first calls `BodyFreeRef::parse`, wraps it in the matching contracts-owned typed ref, and selects only the named enum variant. A durable adapter must map the exact stored tag through a finite `match`; unknown tags, malformed refs, tag/ref-column mismatch or noncanonical persisted order map to `ApplicationError::PersistenceInvariantViolation`. There is no fallback variant, cross-wrapper `From`, ref-prefix inference or generic raw-tag factory. New local refs are still generated only by the existing typed owner; rehydrate never mints an identity or proves that the target exists.

Both set factories check the raw count against the supplied validated `relation_closure_limit` before allocating additional capacity, compute each member's complete canonical frame, sort by unsigned bytes and fold exact duplicate frames. A canonical-key collision with unequal variants/refs is a persistence invariant failure. `ProjectionSourceRefSet` rejects empty input with `ProjectionAssemblyFailed`, because an empty selector must omit `resolve_affected_views` instead of becoming a global scan. `AffectedProjectionSet` permits canonical empty to represent a fully exhausted dependency lookup with no affected projection; the follower planner must omit that empty set and must not call `mark_views_stale`. For the selector fingerprint, `ProjectionSourceRefSet::canonical_bytes()` is `u32_be(member_count) || each(u32_be(member_len) || member_canonical_bytes)` in already canonical order; page cursor and page limit remain excluded.

Carrier constructor invariants are exact:

1. `ProjectionSourceFact::source_ref()` validates the borrowed enum/object identity match and returns only the matching `ProjectionSourceRef`; no generic `BodyFreeRef` extractor is accepted for persistence keys. `ProjectionSourceItem::source_ref()` repeats the same validation on capture rehydrate.
2. `ProjectionSourceChangeSet::try_new(changed_items, affected_relation_anchors, first_index_observed_at)` requires non-empty canonical changed facts or non-empty before/after anchors, rejects duplicate typed roots and preserves the operation-scoped first-index time. The facts borrow already staged/current post-state, so planner invocation requires neither aggregate `Clone` nor reload. It carries no cursor.
3. `ProjectionSourceIndexUpdateSet::try_new` is canonical unique by `ProjectionSourceRef`; each update validates source identity, stable observed time and membership-role compatibility against the planner's borrowed fact/current owner. It does not persist a duplicate domain object body. An empty `memberships` vector is a valid full withdrawal; an empty update set is not a write intent.
4. `ProjectionMembership::try_new` rejects `ByMaintenanceTarget`, because aggregate targets are bindings over ordinary member scopes and never source-membership rows.
5. `ProjectionSourceSnapshot::try_new` requires a complete non-empty bounded set, canonical records/membership pairs/targets, finite diagnostic time bounds and source cursors no greater than the matching captured positions. For `ByMaintenanceTarget`, one source reached through multiple member scopes remains one record with every distinct `(member_scope, role)` pair retained; conflicting item/time/cursor values are corruption.
6. `ProjectionSourcePosition::try_new(observation_cursor, reference_cursor, dependency_namespaces, read_fence)` requires `Some` for every declared dependency namespace and `None` only for a formally absent dependency. Its fence transaction and scope must match the later replacement UoW exactly; the dependency set is retained rather than collapsed to two caller-supplied booleans.
7. `AffectedProjectionSet` and `ProjectionSourceRefSet` use the exact factory, bound, canonical frame and empty rules above. An empty affected result means no stale follower; an empty source selector is rejected. Neither case can become a global scan.
8. `DiagnosticProjectionSnapshot` and replacement require one scope across view/scope/summary, stable view/scope/freshness identities, a fresh immutable summary identity on replacement and exact summary member relations.

The validated construction and inspection surface is fixed as follows; no `Default`、public field mutation、unchecked `From` or serde constructor exists:

| carrier | validated factory / rehydrate | read-only inspection |
|---|---|---|
| `ProjectionMembership` | `try_new(scope, role) -> Result<Self, ApplicationError>` | `scope() -> &ObservationProjectionScope`;`role() -> &ProjectionDependencyRole` |
| `ProjectionSourceChangeSet<'a>` | `try_new(Vec<ProjectionSourceFact<'a>>, Vec<ProjectionRelationAnchor>, ObservedAt) -> Result<Self, ApplicationError>` | `changed_items()`;`affected_relation_anchors()`;`first_index_observed_at()` |
| `ProjectionSourceIndexUpdate` | `try_new(source_ref, source_observed_at, memberships) -> Result<Self, ApplicationError>` | `source_ref()`;`source_observed_at()`;`memberships()` |
| `ProjectionSourceIndexUpdateSet` | `try_new(Vec<ProjectionSourceIndexUpdate>) -> Result<Self, ApplicationError>` | `iter()`;`len()` |
| `ProjectionSourceRecord` | `try_rehydrate(source_ref, item, source_observed_at, last_changed_cursor, memberships) -> Result<Self, ApplicationError>` | `source_ref()`;`item()`;`source_observed_at()`;`last_changed_cursor()`;`memberships()` |
| `ProjectionScopeRevision` | `try_from_u64(value) -> Result<Self, ApplicationError>` | `value() -> u64` |
| `ProjectionReadFence` | `try_new(transaction_ref, scope, scope_revision) -> Result<Self, ApplicationError>` | `transaction_ref()`;`scope()`;`scope_revision()` |
| `ProjectionSourcePosition` | `try_new(observation_cursor, reference_cursor, dependency_namespaces, read_fence) -> Result<Self, ApplicationError>` | namespace cursor selectors、`dependency_namespaces()`、`read_fence()` |
| `ProjectionSourceSnapshot` | `try_new(scope, items, target_refs, diagnostic_time_window, source_position) -> Result<Self, ApplicationError>` | `scope()`;`items()`;`target_refs()`;`diagnostic_time_window()`;`source_position()` |
| `ProjectionSourceRef` / `AffectedProjectionRef` | exact per-variant `try_rehydrate_*`; direct current construction uses the matching public enum variant with an already validated typed ref | `as_body_free_ref()`;`canonical_bytes()` |
| `AffectedProjectionSet` | `try_new(Vec<AffectedProjectionRef>, &PositiveLimit)`; canonical empty allowed only as no-follower result | `as_slice()`;`is_empty()`;`len()` |
| `ProjectionSourceRefSet` | `try_new(Vec<ProjectionSourceRef>, &PositiveLimit)`; empty rejected | `as_slice()`;`len()`;`canonical_bytes()` |
| `DiagnosticProjectionSnapshot` | `try_rehydrate(view, scope, summary) -> Result<Self, ApplicationError>` | `view()`;`scope()`;`summary()` |
| `DiagnosticProjectionReplacement` | `try_new(view, scope, summary) -> Result<Self, ApplicationError>` | `view()`;`scope()`;`summary()` |

```rust
/// Captures one complete projection source snapshot inside the replacement UoW.
pub trait ObservationProjectionSourceReader: Send + Sync {
    /// Capture one complete bounded source set and same-UoW scope fence.
    fn capture<'a>(
        &'a self,
        scope: &'a ObservationProjectionScope,
        uow: &'a dyn ObservationUnitOfWork,
    ) -> ApplicationPortFuture<'a, ProjectionSourceSnapshot>;
}

/// Expands direct and relation changes into complete no-cursor membership updates.
pub trait ObservationProjectionMembershipPlanner: Send + Sync {
    /// Expand direct and indirect changes into complete no-cursor source updates.
    fn plan_updates<'a>(
        &'a self,
        changes: &'a ProjectionSourceChangeSet<'a>,
        uow: &'a dyn ObservationUnitOfWork,
    ) -> ApplicationPortFuture<'a, ProjectionSourceIndexUpdateSet>;
}

/// Least-authority committed projection facet injected into Query services.
pub trait ObservationProjectionQueryStore: Send + Sync {
    /// Read one public read model by canonical scope without exposing its CAS version.
    fn get_observation_read_model<'a>(
        &'a self,
        scope: &'a ObservationProjectionScope,
    ) -> ApplicationPortFuture<'a, Option<ObservationReadModel>>;

    /// Page public read models in stable repository order without row versions.
    fn page_observation_read_models<'a>(
        &'a self,
        scope: &'a ObservationProjectionScope,
        page: ObservationRepositoryPage,
    ) -> ApplicationPortFuture<'a, ObservationRepositoryPageResult<ObservationReadModel>>;

    /// Read one public diagnostic body by its canonical scope.
    fn get_diagnostic_view<'a>(
        &'a self,
        scope: &'a ObservationProjectionScope,
    ) -> ApplicationPortFuture<'a, Option<DiagnosticView>>;

    /// Read one public gap-status projection; missing does not create or close a gap.
    fn get_gap_status<'a>(
        &'a self,
        gap_ref: &'a GapStateRef,
    ) -> ApplicationPortFuture<'a, Option<GapStatusView>>;

    /// Read the public peripheral view for one exact consumer/scope pair.
    fn get_peripheral_export_view<'a>(
        &'a self,
        consumer_ref: &'a PeripheralConsumerRef,
        scope: &'a ObservationProjectionScope,
    ) -> ApplicationPortFuture<'a, Option<DashboardAlertExportView>>;

    /// Read a public reference view by its local snapshot identity.
    fn get_reference_snapshot_view<'a>(
        &'a self,
        snapshot_ref: &'a ReferenceSnapshotStateRef,
    ) -> ApplicationPortFuture<'a, Option<ReferenceSnapshotView>>;

    /// Read the current public rebuild progress selected by exact target.
    fn get_rebuild_progress<'a>(
        &'a self,
        target_ref: &'a MaintenanceTargetRef,
    ) -> ApplicationPortFuture<'a, Option<RebuildProgressView>>;

    /// Resolve the exact progress identity named by a persisted Rebuilding surface.
    fn get_rebuild_progress_by_ref<'a>(
        &'a self,
        progress_ref: &'a RebuildProgressViewRef,
    ) -> ApplicationPortFuture<'a, Option<RebuildProgressView>>;
}

/// Full projection persistence port; Query services never receive this trait object.
pub trait ObservationProjectionStore: ObservationProjectionQueryStore {
    /// Load one read model and the exact composite row version for replacement.
    fn get_observation_read_model_with_version<'a>(
        &'a self,
        scope: &'a ObservationProjectionScope,
    ) -> ApplicationPortFuture<'a, Option<Versioned<ObservationReadModel>>>;

    /// Load and validate the complete diagnostic composite under one row version.
    fn get_diagnostic_projection_with_version<'a>(
        &'a self,
        scope: &'a ObservationProjectionScope,
    ) -> ApplicationPortFuture<'a, Option<Versioned<DiagnosticProjectionSnapshot>>>;

    /// Load one gap projection and its exact row version for replacement.
    fn get_gap_status_with_version<'a>(
        &'a self,
        gap_ref: &'a GapStateRef,
    ) -> ApplicationPortFuture<'a, Option<Versioned<GapStatusView>>>;

    /// Load a peripheral view by generated identity for Command/Job validation.
    fn get_peripheral_export_view_by_ref<'a>(
        &'a self,
        view_ref: &'a DashboardAlertExportViewRef,
    ) -> ApplicationPortFuture<'a, Option<Versioned<DashboardAlertExportView>>>;

    /// Load one peripheral view and version by its exact consumer/scope key.
    fn get_peripheral_export_view_with_version<'a>(
        &'a self,
        consumer_ref: &'a PeripheralConsumerRef,
        scope: &'a ObservationProjectionScope,
    ) -> ApplicationPortFuture<'a, Option<Versioned<DashboardAlertExportView>>>;

    /// Load one reference view and its exact row version for replacement.
    fn get_reference_snapshot_view_with_version<'a>(
        &'a self,
        snapshot_ref: &'a ReferenceSnapshotStateRef,
    ) -> ApplicationPortFuture<'a, Option<Versioned<ReferenceSnapshotView>>>;

    /// Load target progress and its exact row version for maintenance replacement.
    fn get_rebuild_progress_with_version<'a>(
        &'a self,
        target_ref: &'a MaintenanceTargetRef,
    ) -> ApplicationPortFuture<'a, Option<Versioned<RebuildProgressView>>>;

    /// Stage complete source-record and membership replacements after cursor assignment.
    fn record_committed_sources<'a>(
        &'a self,
        updates: &'a ProjectionSourceIndexUpdateSet,
        committed_cursor: &'a ObservationCommittedCursor,
        uow: &'a dyn ObservationUnitOfWork,
    ) -> ApplicationPortFuture<'a, ()>;

    /// Page dependency-index hits; callers must exhaust all pages before stale marking.
    fn resolve_affected_views<'a>(
        &'a self,
        source_refs: &'a ProjectionSourceRefSet,
        page: ObservationRepositoryPage,
    ) -> ApplicationPortFuture<'a, ObservationRepositoryPageResult<AffectedProjectionRef>>;

    /// Advance matching namespace stale watermarks for one complete affected set.
    fn mark_views_stale<'a>(
        &'a self,
        affected: &'a AffectedProjectionSet,
        committed_cursor: &'a ObservationCommittedCursor,
        uow: &'a dyn ObservationUnitOfWork,
    ) -> ApplicationPortFuture<'a, ()>;

    /// Atomically replace one read model, lookup, dependencies, and freshness marker.
    fn replace_observation_read_model<'a>(
        &'a self,
        view: &'a ObservationReadModel,
        source_position: &'a ProjectionSourcePosition,
        expected_version: Option<ObservationRepositoryVersion>,
        uow: &'a dyn ObservationUnitOfWork,
    ) -> ApplicationPortFuture<'a, ()>;

    /// Atomically insert a summary and replace the complete diagnostic composite.
    fn replace_diagnostic_view<'a>(
        &'a self,
        replacement: &'a DiagnosticProjectionReplacement,
        source_position: &'a ProjectionSourcePosition,
        expected_version: Option<ObservationRepositoryVersion>,
        uow: &'a dyn ObservationUnitOfWork,
    ) -> ApplicationPortFuture<'a, ()>;

    /// Atomically replace one gap view and its dependency/freshness rows.
    fn replace_gap_status<'a>(
        &'a self,
        view: &'a GapStatusView,
        source_position: &'a ProjectionSourcePosition,
        expected_version: Option<ObservationRepositoryVersion>,
        uow: &'a dyn ObservationUnitOfWork,
    ) -> ApplicationPortFuture<'a, ()>;

    /// Atomically replace one consumer/scope peripheral view and lookup rows.
    fn replace_peripheral_export_view<'a>(
        &'a self,
        view: &'a DashboardAlertExportView,
        source_position: &'a ProjectionSourcePosition,
        expected_version: Option<ObservationRepositoryVersion>,
        uow: &'a dyn ObservationUnitOfWork,
    ) -> ApplicationPortFuture<'a, ()>;

    /// Atomically replace one reference view and its dependency/freshness rows.
    fn replace_reference_snapshot_view<'a>(
        &'a self,
        view: &'a ReferenceSnapshotView,
        source_position: &'a ProjectionSourcePosition,
        expected_version: Option<ObservationRepositoryVersion>,
        uow: &'a dyn ObservationUnitOfWork,
    ) -> ApplicationPortFuture<'a, ()>;

    /// Replace target progress only with a matching aggregate-target read fence.
    fn replace_rebuild_progress<'a>(
        &'a self,
        view: &'a RebuildProgressView,
        source_position: &'a ProjectionSourcePosition,
        expected_version: Option<ObservationRepositoryVersion>,
        uow: &'a dyn ObservationUnitOfWork,
    ) -> ApplicationPortFuture<'a, ()>;
}
```

`capture` is one complete bounded read, not ordinary pagination. It resolves only formal typed membership predicates, joins each source row to its current repository owner, canonical-deduplicates overlaps, computes `DiagnosticTimeWindow` from persisted local source times and captures dual upper positions plus a transaction-local scope revision. `ByMaintenanceTarget` first reads the immutable binding and unions its ordinary member scopes; in a first-bind start UoW this read must include staged binding and initialized aggregate position.

Every replacement validates all of the following inside the adapter: replacement scope equals snapshot/fence scope; fence transaction equals `uow.transaction_ref()`; scope revision is unchanged at commit; all declared namespace positions are present and non-regressing; the complete source set remains within its bound; lookup/dependency/freshness rows match the body. Diagnostic replacement inserts the immutable new summary and replaces stable scope body、current summary pointer、dependencies、lookups and dual-watermark freshness under one composite version. No partial member may commit.

`record_committed_sources` receives the UoW's single already-assigned tagged cursor. It upserts each current typed source row, replaces its entire ordinary-scope membership set, preserves the original `source_observed_at` across withdrawal/re-entry, advances added/retained/removed ordinary positions and advances every affected bound-target aggregate position/revision. It cannot allocate another cursor or derive membership. `mark_views_stale` advances only the matching namespace watermark and never clears a higher concurrent watermark.

The Query service is constructed with `Arc<dyn ObservationProjectionQueryStore>`, not the full store, source reader or membership planner. Its methods read committed public bodies only and do not expose row versions、diagnostic composites or generated-identity lookup used by Command/Job validation. It cannot begin a UoW, capture for replacement, resolve-and-mark stale, rebuild a missing view, repair an index or advance freshness. A `Rebuilding` diagnostic ref still requires the exact progress -> target maintenance -> immutable binding integrity chain; missing/mismatched links are consistency errors rather than repair triggers.

### 7.22 S07-C closure audit and stop review

#### 7.22.1 Repository and append-family totality

| repository family | mutable / immutable owners | exact append methods | result |
|---|---|---|---|
| `ObservationIntakeRepository` | receipt、safety disposition | H1 `append_intake_decision` | pass |
| `CorrelationSignalRepository` | context、signal、rollup | H2 `append_correlation_record` | pass |
| `AuditEvidenceRepository` | audit projection、evidence linkage | H3 `append_audit_record` | pass |
| `ReportHandoffRepository` | immutable evidence input、handoff、hint | H4 `append_lifecycle_record` | pass |
| `PeripheralDeliveryRepository` | export preparation、delivery | H9 `append_delivery_record` | pass |
| `RetentionGuardRepository` | retention、protection、replay scope、violation、gap、degraded revision | H5/H6/H8/H12/H13 five typed methods | pass |
| `ReferenceMaintenanceRepository` | snapshot、maintenance、coordination、rollup rebuild、immutable target binding | H10/H11 two typed methods | pass |

There are exactly seven domain-family repository traits and exactly 12 current append methods for H1-H6/H8-H13. H7 has zero repository writer and zero ID mint method. Projection, idempotency, stored result and UoW are technical stores, not hidden eighth domain-family repositories. No generic append/upsert/delete method exists.

#### 7.22.2 Read, version, UoW, and fake/durable parity

| audit item | required closure | S07-C result |
|---|---|---|
| committed reads | every method without UoW reads only committed state; singular/index mismatch is error, not missing | pass_design_only |
| version source | every existing mutable update receives `Some(version)` from the matching `Versioned<T>`; `None` is create-if-absent only | pass_design_only |
| borrowed post-state | every domain stage/replace receives `&T`; rollup、H6、H12 factory material remains usable after staging | pass_design_only |
| one cursor | repositories never allocate cursor; record/source/stale followers receive the UoW's one tagged value after allocation | pass_design_only |
| append-only | records、evidence input、degraded revisions have typed create/append surfaces and no update/delete | pass_design_only |
| read-your-writes | membership planner and target capture are the only explicit staged-relation readers; ordinary no-UoW reads remain committed | pass_design_only |
| projection fence | capture and replace share UoW/scope/revision; commit validates membership and dual positions | pass_design_only |
| Query authority | projection read facet has no writer/UoW method; Query does not receive source/planner/full store | pass_design_only |
| no business truth write | all repositories persist observation-owned state/projection only; no source/external writer exists | pass_design_only |

Every durable adapter and in-memory fake must implement the same uniqueness、CAS、stable page order、append conflict、rollback visibility、target binding、scope closure、dual watermark and commit-fence semantics. A fake cannot use direct mutable references to bypass version checks, expose staged rows through committed reads, ignore cursor namespace, truncate capture, accept duplicate set members or mark a view Fresh without a valid fence. These are planned parity tests for Step 16, not executed evidence.

#### 7.22.3 Affected and blocker disposition

| affected / blocker | S07-C disposition | remaining state |
|---|---|---|
| `R07-VIS-DIGEST-CANDIDATES-01` | opaque public Rust visibility and three read-only selectors are sufficient for separate infra implementation | closed_at_S07-C_design_only |
| `R07-ID-DEGRADED-01` | added explicit degraded-revision generator and repeated owner scan | closed_at_S07-C_design_only |
| `R07-UOW-SEND-SYNC-01` | UoW now satisfies the `Send` boxed-future borrow requirement and atomically enforces one allocator success | closed_at_S07-C_design_only |
| `R06-F-AFFECT-UOW-01` Step 07 portion | borrow-stage、one cursor、H6 split、H12 append、typed dispatch and projection followers are fixed | Step07 portion closed; Step09/11/13/16 propagation remains controlled downstream |
| `R06.6-F2-H13-UPSTREAM` | repository permits H13 only for per-target coordination; DefineReplayScope is explicitly zero-H13 | remains `open_controlled` until upstream/formal reconciliation |
| `03-RPR-S08-PER-PROTOCOL` | no protocol generated in this batch | remains `open_controlled` |
| `03-RPR-S09-PER-FLOW` | callable persistence seams now exist; frozen flow text is not treated as current proof | remains `open` |

No new external upstream blocker was found. S07-C is complete at design-only depth. The next allowed work is S07-D `Job plan/item/claim/report and outbox/external effect`, but only after explicit user confirmation. Step 08、formal `03`、all `04` material and implementation code remain frozen; no implementation test, commit, run id, evidence alias, signoff or acceptance result is claimed.

### 7.23 S07-D input diagnosis and current boundary

S07-D consumes the Step 06 Job D-2~D-6 owner, outbox B owner, external-effect C owner, report/error E owner and F2 follower order. Frozen Step 07/09/11/13 names are repair inputs only. The following historical shapes are explicitly rejected:

| historical shape | current correction | reason |
|---|---|---|
| `save_plan(..., fencing_token, uow)` | `stage_new_plan(..., uow)` with no claim; start is protected by reservation + create-if-absent relations | a claim does not exist until after the immutable plan commits |
| one `acquire_claim(execution, Option<work_key>)` | separate execution/item acquire methods | nullable subject cannot enforce global typed work-key uniqueness |
| claim renew/release by object only | expected claim row version + exact identity/owner/token + authority time | naked object/token cannot prove current durable authority |
| preflight fence boolean | `register_claim_guard(versioned_claim, fresh_authority_now, uow)` once, then commit revalidation | stale authority must invalidate the complete staged write set |
| plan item update hidden inside `save_plan` | typed `stage_item_classification` with item version and the already registered exact claim | immutable plan/work-set and mutable item CAS have different responsibilities |
| generic `save_report` | separate create, item-fold and terminal stage methods | each report mutation has a different claim/UoW relation |
| worker `list_pending` / resident publication service | start-only bounded selector consumed by `PublishObservationOutbox` Job | accepted start freezes candidates once; resume never relists |
| `Failed -> Pending` | eligibility classification with state remaining `Failed` | claim/retry coordination is not outbox lifecycle truth |
| publisher receives record and guesses route/result | stable token + exact stored snapshot + finite receipt/failure/probe | no current-binding fallback or provider-text classification |
| mutable external intent state | append-once tagged intent and immutable positive result carriers | lifecycle stays in outbox/handoff/export/delivery/job owners |
| external call inside UoW | pre-call intent/local commit -> call/probe without UoW -> post-call short finalize UoW | no database transaction spans a network effect |

The Step 06 cross-crate scan also exposed `pub(crate)` rehydrate/selectors that a separate infra crate could not call. The current owner corrections are Step 06 Job §48、outbox §30、external-effect §29 and report §25. Those addenda change Rust integration visibility only; they do not expose public protocol fields or grant infra mutation/claim authority.

S07-D owns exactly these port groups:

1. Job plan/item/claim persistence and guard registration;
2. report create/fold/terminal persistence;
3. outbox append, start-only structural scan, application-owned eligibility and fenced marker CAS;
4. append-only external-effect intent/phase-link/result/attempt persistence;
5. publication, handoff and export call/probe adapters;
6. cross-port UoW order, uniqueness and fake/durable parity.

It does not define Step 08 DTOs, per-Job Step 09 algorithms, Step 11 DDL, Step 12 recovery policy, Step 13 retry count/backoff, Step 14 adapter binding resolution or Step 15 telemetry. It does not enter S07-E runtime/resolver/entry contracts.

### 7.24 S07-D technical carriers and construction rules

The domain/application objects remain owned by Step 06. S07-D adds only port call carriers that bind exact rows and prove which phase a method may execute.

```rust
/// Validated authority time and frozen lease used for a fresh claim acquire.
pub struct ObservationClaimAcquireInput {
    /// Fresh application-generated claim-row identity.
    claim_ref: ObservationExecutionClaimRef,
    /// Fresh application-generated owner epoch.
    owner_ref: ObservationClaimOwnerRef,
    /// Trusted durable-authority observation time for this acquire.
    authority_now: ObservedAt,
    /// Lease parameters copied from the immutable Job config snapshot.
    lease: ClaimLeaseConfig,
}

/// Exact current ownership tuple used for renew or release.
pub struct ObservationClaimMutationInput<'a> {
    /// Exact current claim-row identity.
    claim_ref: &'a ObservationExecutionClaimRef,
    /// Exact owner epoch retained by this claim row.
    owner_ref: &'a ObservationClaimOwnerRef,
    /// Same-subject fencing token retained by this claim row.
    fencing_token: &'a ObservationFencingToken,
    /// Version returned with the current claim-row read.
    expected_version: ObservationRepositoryVersion,
    /// Fresh observation from the claim store's durable authority time source.
    authority_now: ObservedAt,
}

/// Durable-authority request to classify one current Active claim as Expired.
pub struct ObservationClaimExpiryInput<'a> {
    /// Exact current claim-row identity.
    claim_ref: &'a ObservationExecutionClaimRef,
    /// Version returned with the current claim-row read.
    expected_version: ObservationRepositoryVersion,
    /// Fresh observation from the claim store's durable authority time source.
    authority_now: ObservedAt,
}

/// Exact immutable outbox pair, marker version and durable attempt accounting.
pub struct ObservationOutboxPlanningCandidate {
    /// Current nonterminal marker validated against its immutable snapshot.
    record: ObservationOutboxRecord,
    /// Exact stored bytes, binding, schema and digest used by every attempt.
    payload_snapshot: ObservationOutboxPayloadSnapshot,
    /// Current marker-row version observed by this planning scan.
    record_version: ObservationRepositoryVersion,
    /// Complete validated append-only attempt fold for this marker.
    attempt_accounting: PublicationAttemptAccounting,
}

/// Structural marker classes that a start-only planning scan may return.
pub enum ObservationOutboxScanClass {
    /// Initial marker with no completed publication result.
    Pending,
    /// Failed marker returned for application-owned policy evaluation.
    Failed,
}

/// Stable structural scan page used only to materialize a new publication plan.
pub struct ObservationOutboxPlanningScanPage {
    /// Canonical validated marker/snapshot/accounting candidates in scan order.
    items: Vec<ObservationOutboxPlanningCandidate>,
    /// Continuation bound to the exact structural scan, or None at exhaustion.
    next_cursor: Option<OutboxCursor>,
}
```

Construction/access contract:

| carrier | validated factory / selectors | forbidden shape |
|---|---|---|
| `ObservationClaimAcquireInput` | application `try_new(fresh claim_ref, fresh owner_ref, authority_now, frozen lease)`; borrowed selectors | worker/process identity, current config reload, caller fence |
| `ObservationClaimMutationInput` | `try_from_versioned_claim(claim, authority_now)` copies exact ref/owner/token/version | partial tuple, stale cached version, `JobRunId` |
| `ObservationClaimExpiryInput` | durable claim authority constructs from a current versioned row and authority time | local heartbeat miss or process clock takeover |
| `ObservationOutboxPlanningCandidate` | repository validates pair, Pending/Failed state, complete attempt history and row version; read-only selectors | policy decision in repository, payload pointer without bytes, current route, page-wide version |
| `ObservationOutboxScanClass` | exact Pending/Failed structural classes only | naming a Failed row policy-eligible without frozen policy/accounting evaluation |
| `ObservationOutboxPlanningScanPage` | canonical stable order and selector-bound cursor; duplicate refs reject; read-only item/cursor selectors | hidden truncation, adapter default limit, reuse on resume |
| `PublicationAttemptAuthorization` | Step 06 factory copies the exact marker version plus plan/execution and claim ref/owner/fence/row-version tuple | partial claim tuple, scheduler attempt, current route or authorization created after a call |
| `PublicationAttemptCompletion` | Step 06 typed factory binds one prior ordinal to Published/NotPublished plus the exact invocation-or-probe basis | generic failure, changed failure kind, completion without authorization or Unknown/Unsupported as a negative |
| `ExternalEffectPhaseLink` | Step 06 factory validates plan/execution/work-key/phase/intent and immutable token material | link by owner ref alone, Publication phase, current-route token or a different intent inside the same plan/work/phase |
| `ExternalEffectPhaseOwnerGuard` | exact handoff version, export-preparation version, or export-preparation + delivery versions loaded before authorization | nullable owner bag, latest-row lookup, version omitted for an existing owner |
| `ExternalEffectAttemptAuthorization` | Step 06 factory copies link, owner guard, item row version and complete item-claim tuple | scheduler/Job count, naked fence, intent without link or authorization after adapter call |
| `ExternalEffectAttemptCompletion` | phase-total success/known-negative plus exact invocation-or-probe basis for one prior ordinal | Unknown/Unsupported as failure, generic application error, completion without authorization |
| `ExternalEffectExportDeliverySuccessProof` | application builds from the committed ExportDelivery intent/package plus exact loaded Delivered export-preparation and peripheral-delivery rows/versions | durable receipt row, one owner only, Prepared/Failed owner, provider acceptance or cached proof |
| `ExternalEffectSucceededPhaseProof<'a>` | crate-integration-public, non-serde tagged borrow; repository supplies stored carriers for the first three phases and application supplies export-delivery owner proof | protocol exposure, untagged positive bag, sidecar-only success or proof for a failed/unresolved history |

These carriers use private fields plus public validated constructors and read-only selectors across the application/infra crate boundary. They are not public contracts. No carrier derives `Default`, accepts a struct literal from entry code, exposes mutable references, or implements cross-wrapper `From`.

#### 7.24.1 Plan version assignment

`stage_new_plan` must return its assigned row version because the initial report fold uses `JobReportItemSnapshotProof::PlanMaterialized { plan_row_version }`. The adapter allocates/validates the create version while staging and makes no plan row visible before commit. Application calls `ObservationJobReportDraft::try_new_for_staged_plan(report_ref, plan, plan_version, reservation, job_run_id, now)` and then `stage_initial_report` in the same UoW; the report repository independently returns the initial report row version. A durable adapter may reserve row-version values before commit; rollback leaves no visible row and the values need not be reused.

The start order is therefore:

```text
reservation acquired in the open start UoW
  -> complete bounded candidate/config/item materialization in memory
  -> stage immutable plan and receive its assigned version
  -> materialize complete Planned report fold with that exact plan version
  -> stage initial Draft report and receive its assigned version
  -> save start stored-result/linkage material as required
  -> commit
  -> only after success may any execution/item claim be acquired
```

There is no naked fence, provisional claim, external call or partial plan. If initial report materialization/staging fails, the plan and reservation remain invisible after rollback.

### 7.25 Operations Job execution, item, claim and guard port

```rust
/// Persists immutable Job plans, mutable item classifications and durable claims.
pub trait ObservationJobExecutionRepository: Send + Sync {
    /// Observe the claim store's durable authority time for claim operations.
    fn observe_claim_authority_time<'a>(
        &'a self,
    ) -> ApplicationPortFuture<'a, ObservedAt>;

    /// Load one committed plan and its plan-row version.
    fn get_plan_with_version<'a>(
        &'a self,
        plan_ref: &'a ObservationJobExecutionPlanRef,
    ) -> ApplicationPortFuture<'a, Option<Versioned<ObservationJobExecutionPlan>>>;

    /// Resolve the one immutable plan for an accepted local execution lineage.
    fn find_plan_by_execution<'a>(
        &'a self,
        execution_ref: &'a ObservationJobExecutionRef,
    ) -> ApplicationPortFuture<'a, Option<Versioned<ObservationJobExecutionPlan>>>;

    /// Stage one new immutable plan and return its assigned row version.
    fn stage_new_plan<'a>(
        &'a self,
        plan: &'a ObservationJobExecutionPlan,
        uow: &'a dyn ObservationUnitOfWork,
    ) -> ApplicationPortFuture<'a, ObservationRepositoryVersion>;

    /// Load one exact plan item and its independent mutable row version.
    fn get_item_with_version<'a>(
        &'a self,
        plan_ref: &'a ObservationJobExecutionPlanRef,
        work_key: &'a ObservationJobWorkKey,
    ) -> ApplicationPortFuture<'a, Option<Versioned<ObservationJobPlanItem>>>;

    /// Page current item classifications in immutable plan-key order.
    fn page_items_by_plan<'a>(
        &'a self,
        plan_ref: &'a ObservationJobExecutionPlanRef,
        page: ObservationRepositoryPage,
    ) -> ApplicationPortFuture<'a, ObservationRepositoryPageResult<Versioned<ObservationJobPlanItem>>>;

    /// Stage one already classified item under the current registered item claim.
    fn stage_item_classification<'a>(
        &'a self,
        item: &'a ObservationJobPlanItem,
        expected_version: ObservationRepositoryVersion,
        claim: &'a Versioned<ObservationExecutionClaim>,
        uow: &'a dyn ObservationUnitOfWork,
    ) -> ApplicationPortFuture<'a, ()>;

    /// Guard one unchanged current item row for a phase sidecar-only commit.
    fn register_item_read_guard(
        &self,
        item: &Versioned<ObservationJobPlanItem>,
        claim: &Versioned<ObservationExecutionClaim>,
        uow: &dyn ObservationUnitOfWork,
    ) -> Result<(), ApplicationError>;

    /// Acquire execution-level authority after validating the committed plan relation.
    fn acquire_execution_claim<'a>(
        &'a self,
        plan_ref: &'a ObservationJobExecutionPlanRef,
        execution_ref: &'a ObservationJobExecutionRef,
        input: ObservationClaimAcquireInput,
    ) -> ApplicationPortFuture<'a, Versioned<ObservationExecutionClaim>>;

    /// Acquire globally unique item authority for one exact plan member.
    fn acquire_item_claim<'a>(
        &'a self,
        plan_ref: &'a ObservationJobExecutionPlanRef,
        execution_ref: &'a ObservationJobExecutionRef,
        work_key: &'a ObservationJobWorkKey,
        input: ObservationClaimAcquireInput,
    ) -> ApplicationPortFuture<'a, Versioned<ObservationExecutionClaim>>;

    /// Load a claim by its ownership-epoch identity for resume/probe.
    fn get_claim_with_version<'a>(
        &'a self,
        claim_ref: &'a ObservationExecutionClaimRef,
    ) -> ApplicationPortFuture<'a, Option<Versioned<ObservationExecutionClaim>>>;

    /// Resolve the current execution-subject claim, including its terminal history row.
    fn find_latest_execution_claim<'a>(
        &'a self,
        execution_ref: &'a ObservationJobExecutionRef,
    ) -> ApplicationPortFuture<'a, Option<Versioned<ObservationExecutionClaim>>>;

    /// Resolve the current item-subject claim by global typed work key.
    fn find_latest_item_claim<'a>(
        &'a self,
        work_key: &'a ObservationJobWorkKey,
    ) -> ApplicationPortFuture<'a, Option<Versioned<ObservationExecutionClaim>>>;

    /// Renew one current Active claim without changing identity, owner or fence.
    fn renew_claim<'a>(
        &'a self,
        input: ObservationClaimMutationInput<'a>,
        lease: &'a ClaimLeaseConfig,
    ) -> ApplicationPortFuture<'a, Versioned<ObservationExecutionClaim>>;

    /// Explicitly release one current Active owner epoch.
    fn release_claim<'a>(
        &'a self,
        input: ObservationClaimMutationInput<'a>,
    ) -> ApplicationPortFuture<'a, Versioned<ObservationExecutionClaim>>;

    /// Classify expiry only from durable-authority time and exact row CAS.
    fn expire_claim<'a>(
        &'a self,
        input: ObservationClaimExpiryInput<'a>,
    ) -> ApplicationPortFuture<'a, Versioned<ObservationExecutionClaim>>;

    /// Register the complete current claim row as the sole Job guard for this UoW.
    fn register_claim_guard(
        &self,
        claim: &Versioned<ObservationExecutionClaim>,
        authority_now: ObservedAt,
        uow: &dyn ObservationUnitOfWork,
    ) -> Result<(), ApplicationError>;
}
```

#### 7.25.1 Plan and item persistence semantics

| method | uniqueness / version | mandatory validation | zero-write cases |
|---|---|---|---|
| `stage_new_plan` | one plan ref; one plan per execution; create-if-absent only | reservation/execution/idempotency relation, canonical nonempty item set, config and plan digest, every item plan ref | duplicate/mismatch, partial material, claim supplied before commit |
| `get_item_with_version` | exact `(plan_ref, work_key)` | plan membership and decoded item key/material compatibility | dangling item or plan mismatch is consistency error, not missing-plan repair |
| `page_items_by_plan` | immutable plan key order | all pages share plan and ordering; caller exhausts pages before finalize | hidden truncation/duplicate/missing key causes failure |
| `stage_item_classification` | item expected version independent from plan/report/claim versions | item plan/key equals claim item subject; exact registered guard equals supplied claim/version; state/outcome/material valid | stale claim/version, execution claim, another work key, terminal rewrite |
| `register_item_read_guard` | exact current item version only; no item mutation | item is the supplied claim subject, belongs to its plan/execution and is `Running` with no current outcome | using a terminal/Planned item, second item key or pretending guard registration is a CAS |

`stage_item_classification` receives the same `Versioned<ObservationExecutionClaim>` already registered with the UoW. It does not register a second guard and does not update the claim. Returning `Ok` means the item row is staged, not committed. The immutable plan body/work-set is never rewritten when an item changes; a physical schema may normalize item rows, but its logical port behavior must preserve that separation.

`register_item_read_guard` is used when a phase authorization or preparation completion must commit while the two-phase Job item remains `Running`. It copies the exact item identity/version into the UoW guard set and performs no write. Commit revalidates that row together with the already registered claim guard. A UoW either stages one item CAS or registers the exact unchanged item guard for that work key; doing both, registering a second item guard or omitting both when appending an external phase sidecar is an invariant violation.

An external-attempt authorization retains the claim tuple that opened its call cut. Recovery may register a fresh item claim for the same authorization plan/execution/work key. If its fence equals the retained fence, claim ref、owner and row version must also equal; if it is a replacement epoch, the same-subject fence must be strictly newer. Cross-plan claims and older/equal-but-different epochs cannot append observations/completions. This lets a crashed owner be fenced out without making an unresolved external effect unrecoverable.

#### 7.25.2 Claim acquire and uniqueness semantics

`observe_claim_authority_time` is a read-only claim-store capability, not `ClockPort.now()` and not provider/source/request time. Application obtains it immediately before constructing acquire/mutation/expiry inputs or registering a guard. A fake exposes a controlled authority clock through the same method; a durable adapter binds it to the same authority source used by claim-row transitions and commit validation.

The acquire methods are atomic durable-authority operations outside a business-write UoW. Each successful acquire performs all of the following as one claim-store mutation:

1. load and validate the committed immutable plan and execution relation;
2. for item acquire, prove the global work key occurs exactly once and is not terminal;
3. inspect the current subject row under the active unique index;
4. reject an unexpired Active owner without adopting it;
5. if durable authority proves expiry, terminalize the prior row before new insertion;
6. verify input claim/owner refs are fresh and unused;
7. allocate a positive fence strictly newer for the same exact subject;
8. construct and persist one new Active claim with authority timestamps;
9. return that row with its exact repository version.

Execution uniqueness is by `execution_ref`. Item uniqueness is by `ObservationJobWorkKey.canonical_bytes()` globally across executions; `execution_ref` remains a relation check and is not appended to the unique key. Token monotonicity is only meaningful within the same exact subject. A global sequence is permitted as an implementation detail, but cross-subject numeric comparison has no authority meaning.

`renew_claim` preserves claim ref, plan, subject, owner and fence, advances heartbeat/deadline using the supplied frozen lease and durable authority time, and performs exact CAS. `release_claim` transitions only the same current Active owner to Released. `expire_claim` accepts no owner or worker token because only the durable authority can prove `authority_now >= lease_expires_at`; it still requires exact row CAS. Terminal rows are never reopened.

#### 7.25.3 Guard registration and commit semantics

`register_claim_guard` is synchronous because it only validates the supplied fresh durable-authority observation and copies the exact claim tuple/version into the local UoW guard set; it performs no I/O and no durable state mutation. It rejects:

- a non-Active claim;
- a claim whose decoded subject is malformed;
- a claim row version absent/invalid for the returned row;
- a second Job guard registration, even if equal;
- a claim already expired at the supplied `authority_now` by its stored authority boundary;
- registration after the UoW entered committing/consumed state.

The supplied `authority_now` must come from the immediately preceding `observe_claim_authority_time` result; it is an early-rejection input and never extends the lease. At commit, the UoW adapter obtains a fresh authority time inside the transaction, re-reads/locks the exact claim row and validates claim ref, plan ref, subject, owner ref, fencing token, Active state, authority window and repository version. Any mismatch returns `ExecutionFenceConflict` and publishes zero staged writes. The guard is independent from each item/report/outbox/domain CAS, projection read fence, no-write/retention guard and external stable token. Passing one never bypasses another.

### 7.26 Operations Job report repository

```rust
/// Persists one complete lossless report lineage per accepted local execution.
pub trait ObservationJobReportRepository: Send + Sync {
    /// Load one report and its independent row version by report identity.
    fn get_report_with_version<'a>(
        &'a self,
        report_ref: &'a JobReportRef,
    ) -> ApplicationPortFuture<'a, Option<Versioned<ObservationJobReportDraft>>>;

    /// Resolve the one report lineage for an accepted local execution.
    fn find_report_by_execution<'a>(
        &'a self,
        execution_ref: &'a ObservationJobExecutionRef,
    ) -> ApplicationPortFuture<'a, Option<Versioned<ObservationJobReportDraft>>>;

    /// Stage the initial Draft with complete Planned fold during Job start.
    fn stage_initial_report<'a>(
        &'a self,
        report: &'a ObservationJobReportDraft,
        plan_version: ObservationRepositoryVersion,
        uow: &'a dyn ObservationUnitOfWork,
    ) -> ApplicationPortFuture<'a, ObservationRepositoryVersion>;

    /// Stage one already folded Draft report under the matching item claim.
    fn stage_item_fold<'a>(
        &'a self,
        report: &'a ObservationJobReportDraft,
        expected_version: ObservationRepositoryVersion,
        item_claim: &'a Versioned<ObservationExecutionClaim>,
        uow: &'a dyn ObservationUnitOfWork,
    ) -> ApplicationPortFuture<'a, ()>;

    /// Guard an unchanged Draft report for a phase sidecar-only commit.
    fn register_draft_read_guard(
        &self,
        report: &Versioned<ObservationJobReportDraft>,
        item_claim: &Versioned<ObservationExecutionClaim>,
        uow: &dyn ObservationUnitOfWork,
    ) -> Result<(), ApplicationError>;

    /// Stage a terminal report under the execution claim used for finalization.
    fn stage_terminal_report<'a>(
        &'a self,
        report: &'a ObservationJobReportDraft,
        expected_version: ObservationRepositoryVersion,
        execution_claim: &'a Versioned<ObservationExecutionClaim>,
        uow: &'a dyn ObservationUnitOfWork,
    ) -> ApplicationPortFuture<'a, ()>;
}
```

Report method semantics:

| method | accepted state/proof | co-write rule | forbidden fallback |
|---|---|---|---|
| `stage_initial_report` | Draft; complete Planned fold; every proof has the returned plan version; no accepted claim | same start UoW after plan stage | report without plan, execution claim before plan commit, incomplete counters-only fold |
| `stage_item_fold` | Draft; exactly one matching fold/scope change; `ItemCas` proof equals supplied item claim and item version | after `stage_item_classification` in the same UoW and under the same once-registered item guard | report-only commit, execution claim, second guard, derive fold from report summary |
| `register_draft_read_guard` | exact current Draft report version; no fold mutation | report execution/plan and pending Running work key equal supplied item claim | terminal report, another item, report version omitted or treating a read guard as progress |
| `stage_terminal_report` | non-Draft terminal state; lossless fold/plan digest; execution-subject proof equals supplied claim | same final UoW as stored result and idempotency completion | item claim, missing/pending plan key where terminal state disallows it, duplicate terminal rewrite |

There is one report per `ObservationJobExecutionRef` and one immutable report ref for that lineage. Public `JobRunId` is only a stored correlation and cannot be a unique lookup key. Report version is independent from plan, item and claim versions. The repository cannot choose a latest report by timestamp, reconstruct missing entries from current truth, repair a fold from counters or silently discard scope rows.

An item/accounting UoW invokes `stage_item_classification` first and `stage_item_fold` second after all record/follower material is already valid. Both remain invisible until the same commit. A failure in either stage or the commit guard rolls back both plus all prior primary/record/outbox/projection followers. Terminal finalize instead uses an execution claim and cannot rewrite any plan item.

For a two-phase handoff/export item, a preparation completion or a delivery authorization may leave the item and report logically unchanged as `Running` / `Draft`. In that case application registers `register_item_read_guard` and `register_draft_read_guard` instead of fabricating an item/fold transition. Commit revalidates both independent row versions under the same item claim. A later delivery result uses the ordinary item CAS then Draft-fold stage. Sidecar-only commits never increment report counters or replace a fold proof without an item CAS.

### 7.27 Outbox planning and fenced marker repository

One additional technical carrier represents a point-loaded pair in any lifecycle state; it is distinct from a structural start-planning candidate:

```rust
/// One exact outbox marker, immutable payload snapshot and marker row version.
pub struct VersionedObservationOutboxPair {
    /// Validated publication marker in its current local lifecycle state.
    record: ObservationOutboxRecord,
    /// Exact immutable bytes, binding, schema and digest paired with the marker.
    payload_snapshot: ObservationOutboxPayloadSnapshot,
    /// Marker-row version used by later guarded staging calls.
    record_version: ObservationRepositoryVersion,
}
```

`VersionedObservationOutboxPair::try_new` runs snapshot integrity and record/pair validation before returning. It exposes read-only `record()`、`payload_snapshot()` and `record_version()` selectors. It has no constructor from separate optional rows and no page-wide version.

```rust
/// Persists exact immutable outbox pairs and fenced publication-marker changes.
pub trait ObservationOutboxRepository: Send + Sync {
    /// Append one new Pending marker and immutable payload in the accepted owner UoW.
    fn append<'a>(
        &'a self,
        record: &'a ObservationOutboxRecord,
        payload_snapshot: &'a ObservationOutboxPayloadSnapshot,
        uow: &'a dyn ObservationUnitOfWork,
    ) -> ApplicationPortFuture<'a, ()>;

    /// Load and validate one marker/payload pair in any lifecycle state.
    fn get_with_payload<'a>(
        &'a self,
        outbox_ref: &'a OutboxRecordRef,
    ) -> ApplicationPortFuture<'a, Option<VersionedObservationOutboxPair>>;

    /// Scan one structural page only while materializing a new publication Job plan.
    fn scan_plan_candidates<'a>(
        &'a self,
        classes: &'a [ObservationOutboxScanClass],
        cursor: Option<&'a OutboxCursor>,
        event_filter: &'a [ObservationOutboundEventName],
        limit: &'a PositiveLimit,
    ) -> ApplicationPortFuture<'a, ObservationOutboxPlanningScanPage>;

    /// Load and validate the complete append-only attempt fold for one marker.
    fn get_attempt_accounting<'a>(
        &'a self,
        outbox_ref: &'a OutboxRecordRef,
    ) -> ApplicationPortFuture<'a, PublicationAttemptAccounting>;

    /// Append the next contiguous call authorization before the external cut.
    fn append_attempt_authorization<'a>(
        &'a self,
        authorization: &'a PublicationAttemptAuthorization,
        item_claim: &'a Versioned<ObservationExecutionClaim>,
        uow: &'a dyn ObservationUnitOfWork,
    ) -> ApplicationPortFuture<'a, ()>;

    /// Append one ordinal-bound timeout/unknown result without resolving it.
    fn append_attempt_indeterminate_observation<'a>(
        &'a self,
        authorization: &'a PublicationAttemptAuthorization,
        observation: &'a PublicationAttemptIndeterminateObservation,
        expected_record_version: ObservationRepositoryVersion,
        item_claim: &'a Versioned<ObservationExecutionClaim>,
        uow: &'a dyn ObservationUnitOfWork,
    ) -> ApplicationPortFuture<'a, ()>;

    /// Append one resolved completion in the marker-finalization UoW.
    fn append_attempt_completion<'a>(
        &'a self,
        authorization: &'a PublicationAttemptAuthorization,
        completion: &'a PublicationAttemptCompletion,
        expected_record_version: ObservationRepositoryVersion,
        item_claim: &'a Versioned<ObservationExecutionClaim>,
        uow: &'a dyn ObservationUnitOfWork,
    ) -> ApplicationPortFuture<'a, ()>;

    /// Stage a snapshot-compatible Published post-state under its item claim.
    fn stage_published<'a>(
        &'a self,
        record: &'a ObservationOutboxRecord,
        payload_snapshot: &'a ObservationOutboxPayloadSnapshot,
        expected_version: ObservationRepositoryVersion,
        item_claim: &'a Versioned<ObservationExecutionClaim>,
        uow: &'a dyn ObservationUnitOfWork,
    ) -> ApplicationPortFuture<'a, ()>;

    /// Stage a finite snapshot-compatible Failed post-state under its item claim.
    fn stage_failed<'a>(
        &'a self,
        record: &'a ObservationOutboxRecord,
        payload_snapshot: &'a ObservationOutboxPayloadSnapshot,
        expected_version: ObservationRepositoryVersion,
        item_claim: &'a Versioned<ObservationExecutionClaim>,
        uow: &'a dyn ObservationUnitOfWork,
    ) -> ApplicationPortFuture<'a, ()>;

    /// Stage a terminal DeadLettered post-state under its item claim.
    fn stage_dead_lettered<'a>(
        &'a self,
        record: &'a ObservationOutboxRecord,
        payload_snapshot: &'a ObservationOutboxPayloadSnapshot,
        expected_version: ObservationRepositoryVersion,
        item_claim: &'a Versioned<ObservationExecutionClaim>,
        uow: &'a dyn ObservationUnitOfWork,
    ) -> ApplicationPortFuture<'a, ()>;
}
```

#### 7.27.1 Pair append and point-read semantics

`append` accepts only a validated `Pending` record whose event、subject、snapshot ref、tagged cursor and committed time equal the supplied immutable snapshot. Record ref, event ref and snapshot ref are independently unique; one snapshot belongs to exactly one marker. Duplicate identity, different bytes under the same snapshot ref, reused event ref, a non-Pending initial record or an unresolvable effect binding fails the complete owner UoW. The repository has no payload update/delete/re-encode method.

`get_with_payload` never returns a marker without its snapshot or a snapshot without the marker. Missing either physical row, digest/framing mismatch, relation mismatch or a duplicate pair is `OutboxPayloadMissing` / `OutboxPayloadCorrupt` / `OutboxInvariantViolation`, not `None`. `None` means the exact marker identity does not exist. No read reconstructs bytes from current owner truth, event schema, projection or binding catalog.

#### 7.27.2 Start-only structural scan and application eligibility

`scan_plan_candidates` is callable only after the new `PublishObservationOutbox` logical reservation is Acquired and before the immutable plan is staged. It reads committed rows and returns complete validated pairs, individual record versions and complete attempt accounting. Its stable order is `(committed_at ASC, outbox_ref canonical bytes ASC)`. The opaque `OutboxCursor` binds method version, exact structural class set, canonical event filter and the last order tuple; any mismatch or malformed cursor returns `InvalidOutboxCursor`.

The repository performs structural classification only:

| stored marker / accounting | scan result |
|---|---|
| `Pending` + zero completed attempt + no unresolved authorization | returned only when `Pending` is requested |
| `Failed` + exact last completion/failure compatibility + no unresolved authorization | returned only when `Failed` is requested, regardless of later budget decision |
| nonterminal marker + unresolved authorization | never returned for a new call plan; recovery uses point-read, same token and probe |
| malformed/gapped accounting or marker/completion mismatch | consistency error; never skipped as ineligible |
| `Published` / `DeadLettered` | never returned |

Application is the sole eligibility owner. For each structural candidate it uses the exact finite failure/recovery class, `PublicationAttemptAccounting.completed_additional_attempts()`, the newly frozen `PublicationRetry` policy and the later formal backoff gate. It may freeze a Pending call item, a same-token retry item, or an exhausted/permanent no-call dead-letter classification item only when the matching Step 09/12/13 rule permits. The repository cannot inspect current config, call `RetryPolicyConfig`, compare wall clock, parse a failure message or label a row “policy eligible.”

The repository consumes an already validated `PositiveLimit`; it never chooses a default, raises the limit or hides truncation. Event filters are canonical sorted/unique; empty means the owner-defined all-event set, not an adapter-specific default. The returned next cursor is an input continuation for a later new invocation only. Application freezes only the validated policy-selected subset into the accepted execution; a scan page is not itself a plan. Resume, item execution and finalize use `get_with_payload`、`get_attempt_accounting` and the stored plan and never call `scan_plan_candidates` again.

Concurrent start flows may freeze the same marker. That does not weaken completeness or permit duplicate publication: item acquisition is globally unique by `ObservationJobWorkKey::Outbox(outbox_ref)`, and every item reloads the current pair/version before probe/call/finalize. The captured version is an observation guard, not authority to overwrite a newer marker.

#### 7.27.3 Marker transition staging

Before any new publication call, `append_attempt_authorization` requires the exact item claim already registered on the pre-call UoW, a fresh `get_with_payload` marker version, a complete accounting fold with no unresolved authorization, and the next contiguous ordinal. The authorization's copied marker version and claim ref / owner / fence / row-version tuple must equal those same inputs. The repository validates the plan/execution/`Outbox(outbox_ref)` relation and stages a read guard on that marker version. Application also stages the item's `Planned|FailedRetryable -> Running` CAS and matching Draft fold in this UoW. Commit happens before `publish`; rollback or unknown commit means no call is permitted until local authorization existence is probed. Exact duplicate authorization bytes may be recognized only while reconciling an ambiguous pre-call commit; a different authorization at the same ordinal is a consistency conflict.

After an ambiguous call result, `append_attempt_indeterminate_observation` requires the exact committed authorization, current marker version, current item claim/guard and an ordinal-identical `TransportTimeout` or `OutcomeUnknown` observation. It commits only with a same-kind Failed marker while retaining the item and Draft fold as `Running`; it cannot coexist with a completion for that ordinal. A repeated exact observation is only a reconciliation no-op, while a different kind/time/ordinal is a consistency conflict.

After a call or conclusive probe, `append_attempt_completion` requires the exact committed authorization, current marker version, exact item claim/guard and one finite compatible completion. It stages the immutable completion in the same UoW as the marker, item classification and Draft fold. The completion ordinal/outbox ref must equal the authorization, and the authorization's plan/execution/work-key lineage must equal the current item claim even when recovery uses a fresh claim epoch. `ProbeAfterIndeterminateObservation` must match the existing ordinal-bound observation; `ProbeWithoutDurableInvocationOutcome` requires that no such observation exists; `InvocationResult` cannot consume one. A no-call dead-letter classification may use already completed accounting and appends no authorization or fabricated completion.

Completion and unresolved-result behavior is total:

| external observation | attempt sidecar | marker / item / report in the same guarded UoW |
|---|---|---|
| call proves Published | append `Published { InvocationResult }` completion for the current authorization | compatible `Published` marker + terminal item classification + Draft fold |
| call returns a non-probe failure kind | append `NotPublished { exact kind, InvocationResult }` completion | exact `Failed` marker, or compatible direct DeadLettered marker, plus terminal item/fold |
| call returns `TransportTimeout` or `OutcomeUnknown` | append exact ordinal-bound indeterminate observation but no completion | persist the same-kind Failed marker; already committed item and Draft fold remain unchanged as `Running`; no terminal report finalize |
| probe returns Published | append `Published` with `ProbeAfterIndeterminateObservation` or `ProbeWithoutDurableInvocationOutcome`, selected solely by durable observation presence | compatible Published marker + terminal item/fold; retain prior observation/failure history |
| probe returns NotPublished after a durable timeout/unknown observation | append `NotPublished { retained exact kind, ProbeAfterIndeterminateObservation }` for the same ordinal | retain the exact Failed classification or terminally isolate it; classify item/fold without changing the failure kind |
| probe returns NotPublished and no invocation-result observation survived | append `NotPublished { OutcomeUnknown, ProbeWithoutDurableInvocationOutcome }` for the same ordinal | stage the canonical OutcomeUnknown Failed marker and compatible item/fold; do not invent a transport cause |
| probe returns Unknown or Unsupported | append nothing; authorization remains unresolved | no marker completion, no new ordinal and no external call |

An unresolved authorization is never a planning candidate for a new execution. Recovery point-loads it and probes the same stable token. A formal NotPublished result completes that ordinal first; any later retry requires the next ordinal, a current claim, a newly committed pre-call authorization and the same token. Published/NotPublished probe observations never erase the original authorization or turn a Job invocation count into attempt accounting.

Each stage method validates all of these conditions before writing to the UoW staging set:

1. the supplied post-state and snapshot are a valid exact pair;
2. the target state matches the method name;
3. the expected version came from the same `get_with_payload` record;
4. the supplied claim is Active, item-subject, belongs to the current plan and has global work key `Outbox(record.outbox_ref())`;
5. that exact versioned claim was already registered once on the same UoW;
6. Published has one compatible receipt; Failed has one finite compatible failure; DeadLettered has reason/ref co-presence;
7. the immutable event/snapshot/binding/schema/digest/cursor fields are unchanged;
8. terminal states are never rewritten and no transition creates `Pending`.

`stage_published` may consume either Pending or application-authorized Failed; when it consumes Failed, the existing compatible latest failure remains auditable as required by the object owner. `stage_failed` consumes Pending or application-authorized Failed and never increments a hidden counter; only a resolved paired completion contributes to retry-budget accounting. An unresolved timeout/unknown marker may therefore coexist with one unresolved authorization, but it cannot be scanned or authorize another call. Its observation UoW leaves the already committed Running item/Draft fold untouched; the current item claim guard still protects the marker and sidecar write. `stage_dead_lettered` consumes Pending or Failed only after application policy constructs the exact reason/ref, either with the current resolved failure completion or from already completed exhausted/permanent accounting. Returning `Ok` means staged only. Resolved completion paths stage item classification and Draft fold in the same UoW; any failure or stale guard leaves marker, sidecar, item and report unchanged.

### 7.28 External-effect immutable persistence and attempt repository

```rust
/// Persists stable phase intents, their plan links, exact results, and append-only attempts.
pub trait ObservationExternalEffectRepository: Send + Sync {
    /// Append one of the four tagged handoff/export intents before any provider call.
    fn append_intent<'a>(
        &'a self,
        intent: &'a ExternalEffectIntent,
        uow: &'a dyn ObservationUnitOfWork,
    ) -> ApplicationPortFuture<'a, ()>;

    /// Load one committed tagged intent by its stable local identity.
    fn get_intent<'a>(
        &'a self,
        intent_ref: &'a ExternalEffectIntentRef,
    ) -> ApplicationPortFuture<'a, Option<ExternalEffectIntent>>;

    /// Recover a prior intent only when its complete semantic material matches.
    fn find_intent_by_semantic_effect<'a>(
        &'a self,
        candidate: &'a ExternalEffectIntent,
    ) -> ApplicationPortFuture<'a, Option<ExternalEffectIntent>>;

    /// Append the current plan lineage's exact work/phase -> intent relation.
    fn append_phase_link<'a>(
        &'a self,
        link: &'a ExternalEffectPhaseLink,
        intent: &'a ExternalEffectIntent,
        uow: &'a dyn ObservationUnitOfWork,
    ) -> ApplicationPortFuture<'a, ()>;

    /// Load one exact committed plan/work/phase relation.
    fn get_phase_link<'a>(
        &'a self,
        plan_ref: &'a ObservationJobExecutionPlanRef,
        work_key: &'a ObservationJobWorkKey,
        phase: ExternalEffectPhase,
    ) -> ApplicationPortFuture<'a, Option<ExternalEffectPhaseLink>>;

    /// Locate the sole unresolved authorization competing for one work/phase.
    fn find_unresolved_authorization_by_work_phase<'a>(
        &'a self,
        work_key: &'a ObservationJobWorkKey,
        phase: ExternalEffectPhase,
    ) -> ApplicationPortFuture<'a, Option<ExternalEffectAttemptAuthorization>>;

    /// Load a complete attempt fold whose success is proved by a stored carrier.
    fn get_carrier_backed_attempt_accounting<'a>(
        &'a self,
        intent_ref: &'a ExternalEffectIntentRef,
    ) -> ApplicationPortFuture<'a, ExternalEffectAttemptAccounting>;

    /// Load an ExportDelivery fold using the exact local Delivered owner proof.
    fn get_export_delivery_attempt_accounting<'a>(
        &'a self,
        intent_ref: &'a ExternalEffectIntentRef,
        success_proof: Option<&'a ExternalEffectExportDeliverySuccessProof>,
    ) -> ApplicationPortFuture<'a, ExternalEffectAttemptAccounting>;

    /// Append the next contiguous phase-call authorization before the external cut.
    fn append_attempt_authorization<'a>(
        &'a self,
        authorization: &'a ExternalEffectAttemptAuthorization,
        link: &'a ExternalEffectPhaseLink,
        intent: &'a ExternalEffectIntent,
        item: &'a Versioned<ObservationJobPlanItem>,
        item_claim: &'a Versioned<ObservationExecutionClaim>,
        uow: &'a dyn ObservationUnitOfWork,
    ) -> ApplicationPortFuture<'a, ()>;

    /// Append one ordinal-bound timeout/unknown observation without resolving it.
    fn append_attempt_indeterminate_observation<'a>(
        &'a self,
        authorization: &'a ExternalEffectAttemptAuthorization,
        observation: &'a ExternalEffectAttemptIndeterminateObservation,
        item: &'a Versioned<ObservationJobPlanItem>,
        item_claim: &'a Versioned<ObservationExecutionClaim>,
        uow: &'a dyn ObservationUnitOfWork,
    ) -> ApplicationPortFuture<'a, ()>;

    /// Append one resolved completion in the compatible owner/item/report UoW.
    fn append_attempt_completion<'a>(
        &'a self,
        authorization: &'a ExternalEffectAttemptAuthorization,
        completion: &'a ExternalEffectAttemptCompletion,
        item: &'a Versioned<ObservationJobPlanItem>,
        item_claim: &'a Versioned<ObservationExecutionClaim>,
        uow: &'a dyn ObservationUnitOfWork,
    ) -> ApplicationPortFuture<'a, ()>;

    /// Append one exact positive handoff-preparation result before local finalize.
    fn append_handoff_preparation<'a>(
        &'a self,
        value: &'a HandoffDeliveryPreparation,
        uow: &'a dyn ObservationUnitOfWork,
    ) -> ApplicationPortFuture<'a, ()>;

    /// Load the unique handoff preparation produced by one preparation intent.
    fn get_handoff_preparation_by_intent<'a>(
        &'a self,
        intent_ref: &'a ExternalEffectIntentRef,
    ) -> ApplicationPortFuture<'a, Option<HandoffDeliveryPreparation>>;

    /// Load one handoff preparation by its body-free preparation identity.
    fn get_handoff_preparation_by_ref<'a>(
        &'a self,
        preparation_ref: &'a HandoffDeliveryPreparationRef,
    ) -> ApplicationPortFuture<'a, Option<HandoffDeliveryPreparation>>;

    /// Append one exact positive handoff-delivery receipt before local finalize.
    fn append_handoff_receipt<'a>(
        &'a self,
        value: &'a HandoffDeliveryReceipt,
        uow: &'a dyn ObservationUnitOfWork,
    ) -> ApplicationPortFuture<'a, ()>;

    /// Load the unique handoff receipt produced by one delivery intent.
    fn get_handoff_receipt_by_intent<'a>(
        &'a self,
        intent_ref: &'a ExternalEffectIntentRef,
    ) -> ApplicationPortFuture<'a, Option<HandoffDeliveryReceipt>>;

    /// Append one exact positive export-package result before local finalize.
    fn append_export_package<'a>(
        &'a self,
        value: &'a PeripheralExportPackage,
        uow: &'a dyn ObservationUnitOfWork,
    ) -> ApplicationPortFuture<'a, ()>;

    /// Load the unique export package produced by one preparation intent.
    fn get_export_package_by_intent<'a>(
        &'a self,
        intent_ref: &'a ExternalEffectIntentRef,
    ) -> ApplicationPortFuture<'a, Option<PeripheralExportPackage>>;
}
```

The repository is intentionally not named `ExternalEffectStateRepository`: every row is an immutable fact. It has no intent/attempt `save`、`upsert`、`mark_called`、`mark_failed`、counter update、`latest`、reset、delete or generic payload method.

#### 7.28.1 Intent and phase-link reachability

One intent ref maps to one tagged token forever. The adapter also enforces semantic uniqueness over every token field except the ref. `find_intent_by_semantic_effect` receives an already validated candidate token material and compares every field except its fresh candidate ref. Zero rows returns `None`; exactly one semantic match returns that committed intent; multiple refs for the same semantic effect are a consistency error. It is not a work-key/latest/current-route lookup.

`find_unresolved_authorization_by_work_phase` is the only global work/phase locator. It returns zero or one authorization whose ordinal has no completion, regardless of intent or plan. Multiple unresolved rows are a consistency error, not an arbitrary latest choice. It exposes no provider state and does not select an intent for normal reuse. `append_attempt_authorization` atomically rechecks the same key while staging, so a concurrent new/changed-material intent cannot pass after the read. Durable adapters serialize the key or provide an equivalent transactional anti-join/constraint; fakes enforce the same rule in their private staged maps. Completion makes a later authorization eligible without deleting/updating the old row.

`append_phase_link` validates the exact current plan/execution/item relation and the Step 06 phase/work/token matrix. Its key `(plan_ref, work_key, phase)` is create-once. The intent must be committed or staged in the same UoW. New intent, current plan link and ordinal-one authorization are committed together. A later plan may reuse a semantic-equal intent only after its history is fully resolved: it appends its own link plus the next authorization after an eligible resolved failure, while prior success appends no authorization and drives guarded finalize/phase advance from the exact positive proof. An unresolved intent remains bound to the original authorization plan/work/item-claim lineage; another plan appends no link and performs no probe/call until that lineage resolves it. Changed material uses a distinct intent only under a new plan. A link is never stored in a mutable plan item or inferred from current owner state.

Before `append_attempt_authorization`, application has already registered exactly one current item claim guard and has called the owning item、report and handoff/export repositories to stage their CAS/read guards. The external-effect repository itself validates only the relations visible in its signature and store: authorization/link/intent equality, copied item and claim tuples, current complete accounting, next ordinal, absence of prior success/per-intent unresolved history, and absence of any other unresolved authorization for the global work-key/phase. The item/report/domain repositories independently validate their supplied rows and the same `item_claim` against the same UoW handle. Application service owns the fixed call order; UoW commit atomically publishes every staged write only after all registered guards pass. No repository is allowed to infer another owner's staged mutation from a transaction id alone or become a cross-owner truth store. Only a known successful commit opens the adapter call gate. An ambiguous commit requires `get_phase_link` / `get_intent` and the phase-exact accounting read reconciliation; it never permits a speculative call.

#### 7.28.2 Attempt completion and retry accounting

Authorizations are contiguous per intent. `append_attempt_indeterminate_observation` accepts only the committed current authorization and its exact `TransportTimeout` / `OutcomeUnknown` observation. It requires the item/report to remain guarded `Running` / `Draft`, appends no completion and permits no next ordinal.

`get_carrier_backed_attempt_accounting` accepts only HandoffPreparation、HandoffDelivery or ExportPreparation intents. The adapter loads the complete link/authorization/observation/completion prefix and zero-or-one canonical positive carrier for that exact intent, rejects duplicate/mismatched carrier rows, constructs the matching borrowed `ExternalEffectSucceededPhaseProof`, and calls the Step 06 factory. It rejects ExportDelivery rather than silently treating absence of a receipt as no success.

`get_export_delivery_attempt_accounting` accepts only an ExportDelivery intent. Before calling it, application resolves the current plan's ExportPreparation phase link, loads the exact committed package and both delivery owner rows, and supplies `Some(proof)` only when the Step 06 proof factory accepts their current Delivered relation. Prepared/Failed owners supply `None`; one-Delivered/one-non-Delivered, missing package after a committed delivery intent, or a proof incompatible with the token is a consistency error rather than `None`. The repository loads the complete sidecar prefix and passes that optional proof to the Step 06 accounting factory. It cannot query domain repositories itself, infer success from a completion row, or persist the proof.

`append_attempt_completion` validates the authorization/completion/item/claim fields in its signature, reloads the current external-effect history, and stages only the completion row. The application service must first call every mandatory owner/carrier/item/report method in the order below using the same UoW handle; each owning repository validates its own before/after relation and exact row version. The external-effect repository does not inspect or recreate those foreign objects. Commit atomicity comes from the shared UoW, while post-commit accounting rejects a successful completion whose required carrier or local Delivered proof is absent/mismatched. Such a malformed committed history is a consistency/manual stop, never a successful finalize or retry basis.

| completion | mandatory staged relation | item/report result |
|---|---|---|
| preparation succeeded | exact handoff preparation or export package carrier plus exact unchanged Prepared owner guard | item stays Running and report stays Draft under read guards |
| delivery succeeded | handoff receipt when applicable, or export-delivery local success relation, plus exact handoff/peripheral owner transition | terminal success/equivalent item CAS and matching Draft fold |
| direct known failure | exact finite phase failure; local owner CAS when the domain exposes that transition, otherwise exact unchanged owner guard | retryable/permanent item CAS and matching Draft fold |
| preflight zero-call failure | finite preflight reason and exact unchanged owner guards | typed retryable/permanent/manual item classification; ordinal is consumed |
| conclusive positive probe | matching positive carrier and finalize-only owner relation | same result as positive invocation, without another call |
| conclusive formal negative probe | exact prior indeterminate kind, or canonical OutcomeUnknown when no invocation observation survived | old ordinal resolves first; any later retry is separate |

The application-owned call sequence for a resolved completion UoW is total:

1. reload authorization、phase-exact accounting、item、Draft report and every phase-local owner with independent versions;
2. observe durable claim-authority time and register the item claim guard once;
3. stage the owner CAS or unchanged owner read guard, including H4/H9 record/followers when a transition exists;
4. append/validate the positive carrier when the successful phase has one;
5. stage item CAS plus Draft fold, or register both unchanged Running/Draft read guards;
6. append the phase-total completion last;
7. commit the one UoW; any earlier call error rolls back the handle and leaves zero visible rows.

Ordering completion last is an application composition rule, not permission for earlier stages to become visible. A fake and durable adapter both keep every stage private until commit. No generic `ExternalEffectCompletionContext` combines foreign truth owners, and no completion method accepts nullable owner/report bags.

An exact duplicate append is recognized only while reconciling an ambiguous local commit and only when all bytes and staged relations match. A different observation/completion at the same ordinal is a consistency failure. Completed additional attempts are derived from the full prefix and are evaluated independently for each phase with the frozen `HandoffRetry` / `ExportRetry`; Job execution count, claim epochs, item reentries, timestamps and current domain failure are not counters.

#### 7.28.3 Positive-result cardinality

Each positive result method validates `value.matches_intent(committed_intent)` and enforces:

| result | unique relation | forbidden collision |
|---|---|---|
| handoff preparation | one per HandoffPreparation intent; preparation ref globally unique | another ref/token for the same intent or adoption by another intent |
| handoff receipt | one per HandoffDelivery intent | multiple receipt refs selected by time/latest |
| export package | one per ExportPreparation intent | package rewrite, another package ref/digest for the same intent |

The positive carrier, matching successful completion and required local owner/item/report relation commit in one post-call short UoW. A known failure produces no positive row. A repeated positive/probe response first loads and compares the existing carrier; exact equality drives finalize-only, while mismatch is a consistency/manual stop. Export delivery has no provider-body receipt carrier: its successful completion must share the UoW with both exact local `Delivered` transitions. After commit, accounting reconstruction reloads those rows and builds the process-local `ExternalEffectExportDeliverySuccessProof`; it never creates a fourth carrier family. No row stores provider body, locator, endpoint, credential, real run identity, evidence alias, signoff or external acceptance.

### 7.29 External adapter call outcomes

The port must return enough finite information for application to select the owning transition without parsing `ApplicationError`, provider text or a fake-private value. These carriers are process-local application port results; they are neither durable lifecycle objects nor public DTOs.

```rust
/// Finite result of one publication call using an exact stable token.
pub enum ObservationPublicationCallOutcome {
    /// The adapter returned one body-free receipt identity for this token.
    Published {
        external_receipt_ref: BodyFreeRef,
    },
    /// The adapter mapped a known non-success to the canonical finite kind.
    Failed(PublicationFailureKind),
}

/// Finite read-only observation returned by an exact-token publication probe.
pub enum ObservationPublicationProbeObservation {
    /// The target proves the effect exists and returns its body-free receipt ref.
    Published {
        /// Opaque target receipt identity; application supplies local observation time.
        external_receipt_ref: BodyFreeRef,
    },
    /// The target formally proves this exact token was not published.
    NotPublished,
    /// The target cannot establish either positive or formal negative.
    Unknown,
    /// The binding does not support an exact stable-token probe.
    Unsupported,
}

/// Total handoff-delivery result plus its positive receipt when delivered.
pub struct ReportHandoffDeliveryOutcome {
    /// Finite delivery result owned by the handoff domain contract.
    result: HandoffDeliveryResult,
    /// Exact token-compatible receipt, present only for Delivered.
    receipt: Option<HandoffDeliveryReceipt>,
}

/// Known outcome of one report-handoff preparation invocation.
pub enum ReportHandoffPreparationOutcome {
    /// Exact token-compatible body-free preparation returned by the adapter.
    Prepared(HandoffDeliveryPreparation),
    /// Finite formal non-preparation result for the exact invocation.
    Failed(HandoffPreparationFailureReason),
}

/// Known outcome of product-neutral export-package preparation.
pub enum PeripheralExportPreparationOutcome {
    /// Exact token-compatible body-free package prepared by the adapter.
    Prepared(PeripheralExportPackage),
    /// Finite known preparation failure; ambiguous outcomes are errors instead.
    Failed(ExportFailureReason),
}

/// Total export-delivery result and its required finite failure reason.
pub struct PeripheralExportDeliveryOutcome {
    /// Finite delivery result owned by the peripheral delivery contract.
    result: PeripheralDeliveryResult,
    /// Required for every non-delivered result and absent for Delivered.
    failure_reason: Option<ExportFailureReason>,
}

/// Total classification returned after one authorized non-publication call cut.
pub enum ExternalEffectInvocationOutcome<T> {
    /// The invocation returned a finite positive or known-negative phase result.
    Completed(T),
    /// Adapter preflight proves that no provider invocation began.
    PreflightFailed(ExternalEffectAttemptPreflightFailure),
    /// The provider boundary may have been crossed and an exact-token probe is required.
    Indeterminate(ExternalEffectAttemptIndeterminateKind),
}
```

| carrier | validated construction | exact matrix |
|---|---|---|
| `ObservationPublicationCallOutcome` | infra maps a known provider result to one exact variant; Published ref must be body-free | Published has ref; Failed has one of seven current finite kinds; no generic message |
| `ObservationPublicationProbeObservation` | infra maps exact-token probe result; positive branch carries only a validated body-free external ref | four variants remain distinct; no adapter/provider timestamp or prebuilt `PublicationReceipt` |
| `ReportHandoffPreparationOutcome` | Prepared carrier validates exact source token; Failed uses finite `HandoffPreparationFailureReason` | timeout/unknown/preflight is not a preparation result |
| `ReportHandoffDeliveryOutcome` | `try_new(result, receipt)` and borrowed selectors | Delivered iff receipt is Some and token-compatible; all three non-delivered results require None |
| `PeripheralExportPreparationOutcome` | Prepared package validates source token; Failed reason is current six-variant `ExportFailureReason` | an unknown/ambiguous call is not Failed and must use the outer invocation classification |
| `PeripheralExportDeliveryOutcome` | `try_new(result, failure_reason)` and borrowed selectors | Delivered iff reason None; every non-delivered result iff reason Some; retryability must agree |
| `ExternalEffectInvocationOutcome<T>` | exactly one of Completed, proven zero-call PreflightFailed, or Indeterminate(timeout/unknown) | no provider text, generic unavailable, `ApplicationError` retry inference or Not* mapping |

For publication, application captures `ClockPort.now()` after a call or probe returns. A positive call/probe supplies only `external_receipt_ref`; application builds `PublicationReceipt` and then `PublicationProbeOutcome::Published` from the exact snapshot and its local captured time. A known call failure similarly becomes `PublicationFailure`. The adapter cannot choose `observed_at`, marker state or dead-letter policy. `PublicationFailureKind::OutcomeUnknown` is a durable finite local failure that requires probe before resend; returning it is not a formal negative.

For handoff preparation, a formal token-specific known negative returns `Completed(Failed(HandoffPreparationFailureReason))` and can complete the authorization. A deterministic zero-provider-call failure returns `PreflightFailed`; timeout/unknown returns `Indeterminate` and appends an indeterminate observation. For handoff delivery, the adapter constructs a token-compatible `HandoffDeliveryReceipt` only for `Delivered`. Application passes the nested completed result to `ReportHandoffRecord::deliver`; receipt persistence, attempt completion and local transition share the same post-call UoW. Application never parses error text or infers call outcome from an `ApplicationError`.

For export preparation, a retryable nested `Failed(reason)` may drive the existing `ExternalAuditExportPreparation::fail_retryable` member; a non-retryable reason remains an item/report failure because the domain owner has no fabricated permanent preparation-result transition. For export delivery, application passes both exact completed fields to `record_delivery`. A port must not return `RetryableFailure` with a non-retryable reason or `PermanentFailure/Rejected` with a retryable reason.

All four call methods still return `ApplicationPortFuture`, preserving the unique `ApplicationError` owner. Once a committed authorization has been supplied, an adapter must classify every expected dependency/provider result through `ExternalEffectInvocationOutcome`; timeout, malformed/ambiguous response or post-send codec uncertainty cannot escape as `ApplicationError`. The outer error is reserved for a contract/programming defect detected before the provider boundary and must be equivalent to a proven zero-call stop; application reconciles the authorization before any later action and never treats that error as retry proof.

### 7.30 Publication, handoff and export ports

```rust
/// Publishes one immutable stored event through its retained binding revision.
pub trait ObservationEventPublisher: Send + Sync {
    /// Call the target once with the exact stable token and stored snapshot.
    fn publish<'a>(
        &'a self,
        token: &'a ObservationPublicationToken,
        payload_snapshot: &'a ObservationOutboxPayloadSnapshot,
    ) -> ApplicationPortFuture<'a, ObservationPublicationCallOutcome>;

    /// Probe the exact token without publishing or mutating local state.
    fn probe_publication<'a>(
        &'a self,
        token: &'a ObservationPublicationToken,
    ) -> ApplicationPortFuture<'a, ObservationPublicationProbeObservation>;
}

/// Prepares and delivers one report handoff through exact committed phase tokens.
pub trait ReportHandoffDeliveryPort: Send + Sync {
    /// Prepare one exact handoff input after its preparation intent committed.
    fn prepare_handoff<'a>(
        &'a self,
        token: &'a HandoffPreparationToken,
        handoff: &'a ReportHandoffRecord,
        input: &'a EvidenceIndexInputView,
    ) -> ApplicationPortFuture<'a, ExternalEffectInvocationOutcome<ReportHandoffPreparationOutcome>>;

    /// Probe one exact preparation token without preparing again.
    fn probe_handoff_preparation<'a>(
        &'a self,
        token: &'a HandoffPreparationToken,
    ) -> ApplicationPortFuture<'a, ExternalPreparationProbe<HandoffDeliveryPreparation>>;

    /// Deliver one committed preparation through its separate delivery token.
    fn deliver_handoff<'a>(
        &'a self,
        token: &'a HandoffDeliveryToken,
        preparation: &'a HandoffDeliveryPreparation,
    ) -> ApplicationPortFuture<'a, ExternalEffectInvocationOutcome<ReportHandoffDeliveryOutcome>>;

    /// Probe one exact delivery token without delivering again.
    fn probe_handoff_delivery<'a>(
        &'a self,
        token: &'a HandoffDeliveryToken,
    ) -> ApplicationPortFuture<'a, ExternalDeliveryProbe<HandoffDeliveryReceipt>>;
}

/// Prepares and delivers one product-neutral export through retained bindings.
pub trait PeripheralExportDeliveryPort: Send + Sync {
    /// Prepare a body-free package after its export-preparation intent committed.
    fn prepare_export<'a>(
        &'a self,
        token: &'a ExportPreparationToken,
        preparation: &'a ExternalAuditExportPreparation,
        view: &'a DashboardAlertExportView,
    ) -> ApplicationPortFuture<'a, ExternalEffectInvocationOutcome<PeripheralExportPreparationOutcome>>;

    /// Probe the exact export-preparation token without preparing again.
    fn probe_export_preparation<'a>(
        &'a self,
        token: &'a ExportPreparationToken,
    ) -> ApplicationPortFuture<'a, ExternalPreparationProbe<PeripheralExportPackage>>;

    /// Deliver one committed package through its separate delivery token.
    fn deliver_export<'a>(
        &'a self,
        token: &'a ExportDeliveryToken,
        package: &'a PeripheralExportPackage,
    ) -> ApplicationPortFuture<'a, ExternalEffectInvocationOutcome<PeripheralExportDeliveryOutcome>>;

    /// Probe the exact export-delivery token without delivering again.
    fn probe_export_delivery<'a>(
        &'a self,
        token: &'a ExportDeliveryToken,
    ) -> ApplicationPortFuture<'a, ExternalDeliveryProbe<PeripheralDeliveryResult>>;
}
```

#### 7.30.1 Shared adapter preconditions

Every call/probe adapter performs the same fail-closed preflight before any provider operation:

1. validate token shape and phase;
2. resolve the exact historical `effect_binding_ref` named by the token;
3. verify the resolved adapter declares the matching phase and stable-token capability;
4. for calls, verify exact immutable material compatibility and body-free bounds;
5. for probes, verify declared probe capability or return the exact `Unsupported` variant;
6. reject missing/mismatched retained binding rather than selecting current/default routing;
7. keep endpoint/topic/credential/provider body inside infra-private configuration/client state.

These traits have no UoW parameter. Application must not hold a local database UoW while awaiting them. They do not receive claim objects because claim controls local writer competition, not external idempotency. The service proves current claim/policy before committing the intent and again before local finalize; the stable token controls external effect identity across that cut.

#### 7.30.2 Publication mapping contract

| adapter observation | required port result | forbidden mapping |
|---|---|---|
| matching success/existing effect with body-free receipt ref | `Published { external_receipt_ref }` | return success without a ref; claim downstream consumption |
| transport unavailable | `Failed(TransportUnavailable)` | raw client error / `PublisherUnavailable` after a known mapped call result |
| timeout with no formal negative | `Failed(TransportTimeout)` or `Failed(OutcomeUnknown)` according to adapter certainty | `NotPublished`, automatic retry |
| formal target rejection | `Failed(RemoteRejected)` | business verdict, provider body |
| unsupported publish capability | `Failed(UnsupportedCapability)` or pre-call `AdapterDisabled` when the binding cannot call at all | disabled success/no-op |
| local stored framing/digest/schema mismatch discovered before provider call | `Failed(InvalidPayload)` or consistency error; zero provider call | reserialize current truth |
| historical binding cannot resolve | `Failed(BindingUnavailable)` or dependency error; zero provider call | current binding fallback |
| provider response cannot prove success/failure | `Failed(OutcomeUnknown)` | retryable negative |

`probe_publication` returns `Published { external_receipt_ref }` only when the positive ref is body-free and belongs to the exact token observation. Application supplies `ClockPort.now()` and constructs/validates the Step 06 `PublicationReceipt` against the stored snapshot; infra never supplies provider time as local `observed_at`. `NotPublished` requires a formal token-specific negative. Timeout、not found without contract、empty provider response or local row absence maps to Unknown, never NotPublished. Unsupported remains distinct.

#### 7.30.3 Handoff/export mapping contract

| port method | `Completed(...)` | `PreflightFailed(...)` | `Indeterminate(...)` |
|---|---|---|---|
| `prepare_handoff` | exact preparation carrier or finite `HandoffPreparationFailureReason` | adapter/binding/capability/material proves zero provider call | timeout or outcome unknown after the provider boundary may have been crossed |
| `deliver_handoff` | `Delivered + receipt` or one of three non-delivered `HandoffDeliveryResult` values | same finite zero-call classification | same two indeterminate kinds; never `RetryableFailure` by guess |
| `prepare_export` | exact package or one finite `ExportFailureReason` | same finite zero-call classification | same two indeterminate kinds; `DeliveryTimeout` is completed only with formal non-effect proof |
| `deliver_export` | exact `PeripheralDeliveryResult` + compatible optional reason | same finite zero-call classification | same two indeterminate kinds; no synthetic failure reason |

Known adapter/provider results must be mapped inside infra to the finite nested result. Expected deterministic preflight failures and ambiguous post-boundary results must be mapped to the two outer invocation variants. Application, fake and Job report code cannot inspect provider exception class, status code, error string, endpoint or response body. A positive result is validated against the committed intent before it crosses the port boundary. Mismatch is a consistency error and never authorizes another external call.

An outer `Err(ApplicationError)` after an authorization committed means the adapter contract itself could not produce its required total invocation classification. Application records no invented completion, leaves that ordinal unresolved and enters exact-token probe/manual reconciliation. It cannot map the error to `PreflightFailed`, assume zero call or consume retry budget from the error variant.

Probe rules are identical across handoff/export: Prepared/Delivered carry one exact compatible positive value; NotPrepared/NotDelivered require formal token-specific negatives; Unknown/Unsupported stop automatic repetition. A formal negative is necessary but not sufficient to call again: the flow still needs known local abort, unchanged committed intent/material, current claim/fence and retry policy.

### 7.31 S07-D authoritative phase order

#### 7.31.1 Job start and local-only item

| phase | required order | prohibited shortcut |
|---|---|---|
| accepted start | reserve -> select/materialize bounded exact set -> freeze config/items/digests -> stage plan -> build/stage Draft report -> result/linkage -> commit | select before Acquired, partial plan, claim before commit, current config on resume |
| local-only item | load stored plan/item -> acquire item claim -> calculate complete in-memory accepted material -> begin short UoW -> register guard once -> stage primary/records/followers -> item -> Draft fold -> commit | relist, naked fence, item/report partial success |
| terminal finalize | acquire execution claim -> load plan/items/report/result relation -> begin UoW -> register guard once -> validate lossless terminal fold -> stage report/result/completion -> commit | use item claim, derive missing item from report, rerun completed work |

Start candidate pagination does not permit a multi-page partial execution. If an operation requires exhausting a selector to form its complete bounded set, application exhausts and validates all required pages before staging the plan; exceeding the operation hard bound fails start. For `PublishObservationOutbox`, the public cursor/limit deliberately defines one bounded page as the complete requested work-set, so the returned page is complete for that invocation and its next cursor is only a future invocation continuation.

#### 7.31.2 Publication item

Fresh-call path:

```text
load exact stored plan item and outbox pair
  -> acquire global Outbox(outbox_ref) item claim
  -> validate current pair/version, complete attempt accounting, plan material,
     retained binding and frozen retry/backoff rule
  -> require no unresolved authorization and derive the next ordinal
  -> construct the same ObservationPublicationToken from the committed pair

pre-call short UoW:
  reload pair/accounting/item/report and their independent versions
  -> observe fresh durable claim-authority time
  -> register the item claim guard once
  -> construct and append authorization with exact marker version,
     plan/execution and claim ref/owner/fence/row-version tuple
  -> stage Planned|FailedRetryable -> Running item CAS and matching Draft fold
  -> commit; only a known successful commit opens the external call gate

external cut:
  reload the committed authorization and exact immutable snapshot
  -> publish once outside every UoW with the same token

post-call short UoW:
  classify the finite call result and capture ClockPort time
  -> reload pair/accounting/item/report and versions
  -> observe fresh durable claim-authority time
  -> register the current item claim guard once
  -> when the call proves Published or NotPublished, append a resolved completion
     and stage the compatible marker, terminal item classification and Draft fold
  -> for timeout/outcome-unknown, append the ordinal-bound indeterminate observation,
     stage only the same-kind Failed marker and leave item/fold Running
  -> commit atomically; release claim only after a known commit
```

Recovery path for an existing unresolved authorization:

```text
point-load pair + complete accounting + stored plan item
  -> acquire or validate current global Outbox(outbox_ref) item claim
  -> require exactly one unresolved authorization and the same stable token material
  -> probe that token outside every UoW; do not append a new authorization

if Published or formal NotPublished:
  begin one post-probe short UoW
  -> reload pair/accounting/item/report and versions
  -> observe fresh durable claim-authority time and register current item guard
  -> append completion for the old authorization ordinal
  -> stage compatible marker/item/Draft-fold classification
  -> commit atomically

if Unknown or Unsupported:
  append nothing, make no external call and stop indeterminate/manual
```

A formal NotPublished recovery completes the old ordinal before application may reevaluate budget/backoff. If another call is permitted, it starts a separate fresh-call path with the next ordinal and a separate committed pre-call UoW. The completion UoW and next authorization UoW cannot be fused: a crash between them must leave a resolved prior attempt and no permission for another call.

There is no publication intent row because the outbox pair already commits the exact token material before call; the append-only authorization is accounting/coordination, not a second external-effect identity. Failed never moves to Pending. A success with local finalize rollback is probed by the same token and becomes finalize-only when Published. Unknown/Unsupported stops; no new event/outbox/snapshot/token/binding is generated. Claim renewal, release or expiry never completes an authorization and never proves whether the external cut ran.

#### 7.31.3 Handoff/export local prerequisite and phase matrix

The local policy preparation precedes every external preparation intent. For handoff, a complete P7 decision and H4-producing local UoW first move `ReportHandoffRecord` to `Prepared`. For export, a complete P14 export-preparation decision and H9-producing local UoW first move `ExternalAuditExportPreparation` to `Prepared`. The external preparation carrier never creates either local Prepared state.

| phase | global work key | required committed local material before authorization | positive carrier | positive local owner result | item result |
|---|---|---|---|---|---|
| `HandoffPreparation` | `ReportHandoff(handoff_ref)` | handoff `Prepared`; exact evidence input/consumer/binding from plan | `HandoffDeliveryPreparation` | handoff remains the same Prepared revision | remain `Running`; delivery phase follows |
| `HandoffDelivery` | same handoff key | matching preparation carrier; handoff still `Prepared` | `HandoffDeliveryReceipt` | `ReportHandoffRecord::deliver(Delivered)` + H4/followers | terminal success/equivalent |
| `ExportPreparation` | `ExternalExport(preparation_ref)` | export preparation `Prepared`; exact view/consumer/binding from plan | `PeripheralExportPackage` | export preparation remains the same Prepared revision | remain `Running`; delivery phase follows |
| `ExportDelivery` | same export key | matching package; export preparation and unique peripheral delivery both `Prepared` | no separate receipt; nested result is `Delivered` | both compatible local delivery-result owners are staged consistently with H9/followers | terminal success/equivalent |

Handoff preparation and delivery use different intent refs/tokens. Export preparation and delivery likewise use different phase tokens, and delivery copies the original retained binding through the committed preparation/package relation. A preparation/package/receipt is not a policy decision, external acceptance, signoff, verdict, evidence authenticity or real execution result.

The first external-preparation call uses two commits separated by a mandatory reload:

```text
acquire/validate the exact global item claim
  -> locate unresolved authorization for this work-key + preparation phase
  -> same-lineage unresolved routes to §7.31.6 without policy mutation
  -> another-lineage unresolved causes zero-write release/stop
  -> only when absent, load immutable plan/item, Draft report and complete P7/P14 inputs
  -> evaluate one fresh target-bound decision

local prerequisite UoW:
  reload every decision input and independent owner/item/report version
  -> observe fresh claim-authority time and register the item claim guard once
  -> apply the exact P7/P14 decision to the owning object
  -> stage the Prepared owner transition, H4/H9 record and mandatory followers
  -> stage Planned -> Running item CAS and matching Draft fold
  -> commit with zero intent, phase link or attempt authorization

after known commit:
  reload Running item, Draft report and exact Prepared owner revision
  -> only then enter the phase-authorization UoW
```

If the owner is already committed in an exact plan-compatible Prepared state, the prerequisite UoW registers its read guard and stages only `Planned -> Running` plus the Draft fold; it does not replay P7/P14 or emit a duplicate transition/record. Expected Pending/Blocked/non-Prepared policy outcomes may be classified locally as the later flow requires, but create no intent/link/authorization and open no adapter call gate. Stale decisions and construction/persistence errors roll back with zero visible writes.

The exception is a semantic-equal delivery intent whose successful completion and exact positive proof are already committed and whose local owner(s) are terminal `Delivered`. Application does not force those owners back to Prepared. It acquires the current plan item claim, reloads the Delivered owner versions and proof, then commits only the current plan phase link plus terminal item/Draft-fold classification under their exact guards. No external call or duplicate owner transition occurs.

After ExportPreparation succeeds and its package commits, ExportDelivery has another local prerequisite. Application loads or creates the unique `PeripheralDeliveryState` for that preparation, evaluates a fresh complete P14 `PeripheralDeliveryDecision`, then commits `prepare(...) -> Prepared` plus H9/followers while guarding the still-Prepared export preparation and leaving item/report `Running` / `Draft`. The ExportDelivery intent/link/authorization is appended only after reloading the committed package and both Prepared owner rows in a later UoW. HandoffDelivery needs no equivalent second policy transition because its same handoff owner remains Prepared after HandoffPreparation success.

#### 7.31.4 Fresh phase authorization

```text
load exact immutable plan/Running-or-FailedRetryable item, Draft report and phase-local owner/material
  -> acquire or validate the current global item claim
  -> reject Planned because its local prerequisite has not committed
  -> locate any unresolved authorization for the global work-key + phase before
     selecting/reusing an intent
  -> same-plan/same-work unresolved routes to recovery; another lineage or intent
     causes zero-write stop and releases a newly acquired competing claim
  -> if this plan already has a phase link, load its exact intent
  -> otherwise construct candidate token material, find a semantic-equal prior intent,
     or retain the fresh candidate when none exists
  -> load complete accounting through the phase-exact repository method
  -> route prior success to guarded no-call finalize/phase advance
  -> if unresolved authorization belongs to this same plan/work lineage, route to
     exact-token probe recovery; otherwise stop with no link/probe/call
  -> for a later attempt, validate the last exact completion, frozen phase retry budget
     and backoff; never use Job/claim/current-state counts

pre-call short UoW:
  reload plan item, Draft report, phase-local owner rows and independent versions
  -> observe fresh claim-authority time and register the item claim guard once
  -> register exact handoff or export owner read guard(s)
  -> when item is FailedRetryable and every owner is already exact Prepared, stage
     its transition to Running and matching Draft fold
  -> when item is already Running, register item/report read guards
  -> append intent if new and append this plan's phase link if absent
  -> append the next contiguous authorization with owner/item/claim versions
  -> commit; only known success permits exactly one matching adapter invocation
```

Intent, link and ordinal-one authorization are one atomic pre-call landing. A known rollback leaves none visible and permits reconstruction of the same semantic cut. An ambiguous commit requires point-reading the plan link and complete accounting. The application cannot call when the exact authorization is absent, and cannot append a different intent or ordinal while commit outcome is unknown.

For a later compatible plan, semantic lookup may reuse an earlier intent only when every token field except the candidate ref is equal and its complete history has no unresolved authorization. Changed binding, input, package, consumer, delivery identity or material digest uses a different intent under the new plan; it never mutates an existing link/token. Attempts for each selected intent retain their own contiguous history. A reused successful intent appends only the current plan's missing link together with the compatible local/item/report finalize or in-item phase advance and never enters the pre-call block. A semantic-equal unresolved intent blocks the later plan with no link/probe/call; §7.31.6 remains callable only from the authorization's original plan/work lineage under a fresh claim for that same item subject.

If the later plan acquired the global work-key claim before discovering the unresolved history, it performs zero UoW writes and calls `release_claim` with a fresh durable-authority observation. It must not renew/hold that claim while waiting. Recovery scheduling or surfaced blocking then points to the original authorization plan lineage; the exact public/error mapping remains Step 09/12 work.

A retryable local delivery failure is not an already-Prepared retry. HandoffDelivery first consumes a fresh complete P7 decision and commits `Failed -> Prepared`; ExportPreparation consumes a fresh P14 export-preparation decision; ExportDelivery consumes fresh P14 decisions for every failed export-preparation/peripheral-delivery owner and commits a compatible Prepared pair. Those reprepare UoWs also stage `FailedRetryable -> Running` and the Draft fold, but append no next authorization. The later authorization UoW reloads and guards the resulting Running/Draft/Prepared rows. If re-evaluation changes any token- or plan-covered material, or returns Pending/Blocked/non-Prepared, current plan execution stops; it cannot retain the old link with a rotated token or create a second intent under the same `(plan, work, phase)` key.

#### 7.31.5 Invocation and post-call completion

The adapter call runs with no DB UoW and receives only the committed token plus exact immutable phase material. Application captures one `ClockPort` time after the finite result returns, then opens a fresh guarded UoW.

| invocation classification | attempt sidecar | owner writes/guards | item/report |
|---|---|---|---|
| preparation `Completed(Prepared(carrier/package))` | append positive carrier + `Succeeded(InvocationResult)` completion | exact Prepared owner read guard; no second Prepared mutation | unchanged `Running` / `Draft` read guards |
| delivery `Completed(Delivered(...))` | append receipt where applicable + `Succeeded(InvocationResult)` completion | stage exact handoff or both export/delivery owner transitions and required records/followers | terminal success CAS + Draft fold |
| `Completed(known failure)` | append phase-total `NotCompleted(InvocationResult)` completion | stage compatible domain failure transition when one exists; otherwise exact owner read guard | typed retryable/permanent CAS + Draft fold |
| `PreflightFailed(reason)` | append `NotCompleted(Preflight(reason), InvocationResult)` completion; ordinal is consumed | exact unchanged owner guard(s) | typed retryable/permanent/manual CAS + Draft fold |
| `Indeterminate(kind)` | append ordinal-bound indeterminate observation; no completion | exact unchanged owner guard(s) | unchanged `Running` / `Draft` read guards |
| outer `Err(ApplicationError)` | append nothing; authorization remains unresolved | append/stage nothing | unchanged; probe/manual only |

Every post-call UoW reloads item/report/owner/accounting, obtains fresh claim-authority time, registers the current item claim once and proves that the authorization is still the sole unresolved ordinal. Positive carriers, completion, owner transition/guard, item CAS/read guard and report fold/read guard are atomic. A known local commit rollback preserves the committed authorization and possible external effect; recovery probes the same token. An ambiguous local commit first probes all local rows and never resends.

Known failure mapping is phase-exact:

| phase | direct finite failure owner | local lifecycle treatment |
|---|---|---|
| handoff preparation | `HandoffPreparationFailureReason` | handoff remains Prepared; item/report carry exact attempt association |
| handoff delivery | non-Delivered `HandoffDeliveryResult` | `ReportHandoffRecord::deliver(result)` where domain-compatible |
| export preparation | `ExportFailureReason` | retryable reason may use `fail_retryable`; otherwise owner remains Prepared and item/report retain exact completion |
| export delivery | compatible non-Delivered result + reason | stage both delivery-result owners consistently; retryability matrix must match |

#### 7.31.6 Unresolved authorization recovery

```text
point-load plan phase link + intent + complete accounting + positive carrier(s)
  -> require exactly one unresolved authorization
  -> require caller plan/work equal that authorization lineage
  -> load its current plan item, Draft report, local owner(s) and current item claim
  -> allow an equal exact claim epoch or a strictly newer same-subject claim epoch
  -> prove token/material/binding equality
  -> call only the phase-specific exact-token probe outside every UoW

Prepared / Delivered:
  open one post-probe guarded UoW
  -> append/validate the phase's positive carrier, except ExportDelivery
  -> for ExportDelivery, stage both exact Delivered owner transitions; after commit,
     accounting rebuilds the process-local success proof from those owner rows
  -> append Succeeded completion with ProbeAfterIndeterminateObservation or
     ProbeWithoutDurableInvocationOutcome according only to durable history
  -> apply the same owner/item/report result as a positive invocation
  -> commit atomically

formal NotPrepared / NotDelivered:
  open one post-probe guarded UoW
  -> append NotCompleted completion for the old ordinal with the exact retained
     indeterminate kind, or canonical OutcomeUnknown when no observation survived
  -> retain owners unchanged and classify item/report under current recovery policy
  -> commit; do not append the next authorization in this UoW

Unknown / Unsupported:
  append nothing, make no provider invocation and remain unresolved/manual
```

A formal negative is not a retry authorization. Only after its completion commits may application reevaluate the same intent's completed count, frozen phase budget, backoff, current local state and current claim. If the owning result path left a retryable Failed owner, fresh P7/P14 reprepare must commit before authorization; if every owner remained exact Prepared, the separate next-ordinal UoW may combine item Running reentry with authorization. A prior successful completion prohibits every later ordinal for that intent.

#### 7.31.7 Cross-cut failure table

| cut | known failure | ambiguous outcome |
|---|---|---|
| publication/external pre-call UoW | known rollback means zero call and no durable authorization | point-load exact authorization/link/item/report; no call until existence is known |
| provider invocation | finite completed/preflight result resolves the current ordinal in a fresh guarded UoW | timeout/outcome unknown appends observation only; outer contract error leaves unresolved |
| exact-token probe | positive/formal negative resolves only the old ordinal | Unknown/Unsupported appends nothing and permits no call/new ordinal |
| positive-result/local finalize UoW | known rollback retains authorization and possible external result; probe then finalize-only | probe local carrier/owner/item/report first, then target token |
| item/report/owner commit | all staged relations commit or none | inconsistent partial observations are persistence/manual failure, never retry proof |
| terminal Job finalize | committed item outcomes are inputs to finalize-only recovery | probe report/result/reservation triple; never rerun items |

Claim expiry/release, a cursor gap, missing row, local memory, current owner state, adapter timeout, Job invocation count or report count is not proof of rollback or external non-effect.

### 7.32 S07-D adapter and fake/durable parity

| semantic surface | in-memory fake requirement | durable adapter requirement | parity assertion |
|---|---|---|---|
| Job plan start | stage plan/report privately; assign independent versions; atomic publish | transactionally create plan/items/report with unique execution relation | no visible partial plan/report; exact plan version in initial fold |
| item CAS | separate item row version, immutable planned material | item CAS independent from plan/report row | stale item has zero visible follower writes |
| active claim uniqueness | execution index + global typed work-key index | equivalent unique constraints/locking | exactly one Active owner; no `(execution,key)` weakening |
| fence monotonicity | per-subject last-token state; terminal rows retained | durable allocator/history supports strictly newer same-subject token | renew preserves token; fresh acquire never revives old identity |
| guard commit check | registered full row/version checked at fake commit | same exact predicate inside transaction commit | stale owner/version/lease causes whole-UoW zero-write |
| owner/item/report read guards | stage immutable expected versions in the fake UoW without mutation | lock/revalidate exact handoff/export/item/report versions at commit | sidecar-only commit cannot survive any owner, item or report change |
| report fold | complete canonical entries and scope rows | lossless normalized/blob representation with full validation | no counters-only repair; item/fold atomic |
| outbox pair | one immutable byte-exact pair; all unique keys | record/snapshot constraints and digest/framing validation | missing/corrupt pair never reconstructed |
| structural planning scan | same Pending/Failed classes, order/filter/cursor namespace and complete accounting | stable indexed query and selector-bound opaque cursor; no policy query | same structural page/cursor/errors; application alone applies frozen retry/backoff policy |
| publication attempt sidecar | contiguous authorization/observation/completion maps staged privately | append-only ordinal rows with exact uniqueness and same-UoW marker relation | no gap/duplicate mismatch; unresolved excludes scan/new ordinal; attempt count is identical |
| marker CAS | staged post-state and pair check | row CAS under registered item guard | terminal rewrite/Failed->Pending rejected |
| intent uniqueness | PK + variant semantic-key map; no mutation | append-only row + variant-specific semantic unique key | duplicate semantic effect under new ref conflicts |
| phase-link uniqueness | staged `(plan, work, phase) -> intent` map plus complete semantic comparison | create-once functional dependency and semantic-key lookup | same plan key cannot rotate intent; cross-plan reuse requires complete semantic equality |
| external attempt sidecar | contiguous authorization/observation/completion maps staged privately | append-only ordinal rows and exact foreign/unique relations | same full fold, unresolved exclusion, phase-local attempt count and completion basis |
| unresolved work/phase gate | one unresolved authorization across all intents in private maps | atomic work-key/phase serialization plus completion anti-join/equivalent constraint | changed material/new plan cannot overlap an unresolved old token; resolved intents remain non-unique over lifetime |
| positive result | at-most-one compatible stored carrier; ExportDelivery uses exact local Delivered owner proof | three unique carrier families plus versioned local Delivered relation | exact duplicate comparison; no sidecar-only success and no fabricated fourth receipt |
| local prerequisite split | Prepared transition/followers commit before intent stage becomes visible | separate transactions with reload between policy and authorization cuts | Planned/non-Prepared owner never obtains an external authorization |
| external call script | token-keyed finite call/probe outcomes | provider adapter maps to identical finite carriers/errors | no raw-message branch, current-binding fallback or Unknown->Not* |
| failure injection | every plan/report/item/outbox/intent/result stage and call/probe/finalize cut | equivalent transactional and adapter harness cuts | known failure/unknown outcome follows the same recovery class |

A fake is non-conforming if it directly mutates global maps before commit, fabricates row versions, uses a process mutex instead of global work-key semantics, compares only fence numbers, drops terminal claim history, returns default probe negatives, stores mutable intent state, accepts a second positive carrier, rebuilds payload/package material or treats release/expiry as rollback evidence.

All parity checks are planned Step 16 obligations. This document does not claim a fake, durable store, external adapter, test run or evidence exists.

### 7.33 S07-D affected closure and stop review

#### 7.33.1 Surface totality

| family | current S07-D trait / carrier closure | result |
|---|---|---|
| Job plan/item/claim | `ObservationJobExecutionRepository`; start/item/read/claim/guard surfaces; full tuple and global key | pass_design_only |
| report | `ObservationJobReportRepository`; initial/item/terminal methods with distinct authority | pass_design_only |
| outbox | `ObservationOutboxRepository`; exact pair append/read, structural planning scan, authorization/indeterminate/completion sidecar and three fenced post-state stages | pass_design_only |
| external immutable persistence | `ObservationExternalEffectRepository`; four-variant intent, plan phase links, attempt sidecars, three durable positive carrier families and local ExportDelivery success proof | pass_design_only |
| publication adapter | `ObservationEventPublisher`; stable token + stored snapshot + finite call/probe outcomes | pass_design_only |
| handoff adapter | `ReportHandoffDeliveryPort`; prepare/deliver and two four-way probes | pass_design_only |
| export adapter | `PeripheralExportDeliveryPort`; prepare/deliver typed outcomes and two four-way probes | pass_design_only |
| external call transaction cut | no external trait method has a UoW/claim parameter | pass_design_only |
| business truth boundary | all state/result is observation-side coordination/projection only | pass_design_only |

#### 7.33.2 Affected-definition disposition

| affected ID / owner | S07-D disposition | remaining state |
|---|---|---|
| `A07-CLAIM-ID-MINT` | five typed Job identity methods already present in IdGeneratorPort | closed_at_S07-C/S07-D design-only |
| `A07-PLAN-SAVE-AUTHORITY` | plan create has no fence; assigned plan version feeds initial report | closed_at_S07-D design-only |
| `A07-CLAIM-PORT-SURFACE` | split subject methods, lease/time/version/probe/renew/release/expire/full guard all explicit | closed_at_S07-D design-only |
| `A07-REPORT-RELATION` | report lookup uses local execution; initial/item/terminal mutation split and plan/fold relation required | closed_at_S07-D design-only |
| `R06-F2-AFFECT-07-JOB-ITEM` | typed item stage has item version + exact versioned claim and one existing guard | closed_at_S07-D design-only |
| `R06-C-AFFECT-07-01` | publisher/delivery signatures import Step 06 token/probe/result owners and finite outcomes | closed_at_S07-D design-only |
| `R06-C-AFFECT-07-02` | append/get intents and exact positive results; no intent update/delete/latest | closed_at_S07-D design-only |
| `R07-JOB-CROSS-CRATE-VIS-01` | Job owner §48 supplies validated infra-visible rehydrate/selectors | closed_at_S07-D design-only |
| `R07-OUTBOX-CROSS-CRATE-VIS-01` | outbox owner §30 supplies exact byte/record/result codec surface | closed_at_S07-D design-only |
| `R07-EXTERNAL-EFFECT-CROSS-CRATE-VIS-01` | external owner §29 supplies token/result/probe validation surface | closed_at_S07-D design-only |
| `R07-REPORT-CROSS-CRATE-VIS-01` | report owner §25 supplies complete validated codec surface | closed_at_S07-D design-only |
| `R07-REPORT-CLAIM-SUBJECT-01` | item fold uses item claim; terminal seal uses execution claim | closed_at_S07-D design-only |
| `R07-OUTBOX-RETRY-ACCOUNTING-01` Step 06/07 portion | append-only ordinal authorization/observation/completion owner, exact claim tuple, pre-call commit and application budget input are explicit | Step 06/07 closed design-only; Step 09/11/13/14/16 propagation remains open_controlled |
| `R07-EXTERNAL-PHASE-LINK-01` Step 06/07 portion | create-once `(plan, work, phase) -> intent` link plus full semantic-equal cross-plan reuse and changed-material stop are explicit | Step 06/07 closed design-only; Step 09/11/13/16 propagation remains open_controlled |
| `R07-EXTERNAL-PHASE-RETRY-ACCOUNTING-01` Step 06/07 portion | phase-local contiguous sidecars, typed success proof, independent retry budgets, local prerequisite/reprepare and pre-call commit are explicit | Step 06/07 closed design-only; Step 09/11/12/13/14/16 propagation remains open_controlled |
| `A13-OUTBOX-STRUCTURAL-SCAN-01` | current repository returns Pending/Failed structure plus complete accounting; it does not return `RetryableFailed` | frozen Step 13 §19.1 replacement remains pending |
| `A09-A11-A12-PUBLICATION-ATTEMPT-ORDER-01` | fresh-call and unresolved-recovery UoW/external cuts are explicit and total | frozen Step 09/11/12 flow/store/recovery propagation remains pending |
| `R06-F-AFFECT-UOW-01` Step 07 portion | S07-C + S07-D now cover one cursor, borrowed stage, records/followers, item/report/outbox guard order | Step 07 portion closed; Step 09/11/13/16 propagation remains open_controlled |

No new external upstream blocker was found. The pre-existing `R06.6-F2-H13-UPSTREAM=open_controlled`、`03-RPR-S08-PER-PROTOCOL=open_controlled` and `03-RPR-S09-PER-FLOW=open` remain unchanged. S07-D closes only the current Step 07 port definitions; it does not claim the frozen downstream documents already consume them.

S07-D is complete at design-only depth and must now stop for user review. The next allowed batch is S07-E `resolver / infra runtime builder / registrar / adapter implementation matrix`, only after explicit user confirmation. S07-E must not be inferred from this stop review. Step 08~19、formal `03`、all `04` material and implementation code remain frozen. No implementation test, commit, run id, evidence alias, signoff or acceptance result is claimed, and no commit is currently required.

### 7.34 S07-E input diagnosis and resolver boundary

S07-E has been explicitly authorized after the S07-D stop review. Its application-side scope is limited to four body-free resolver ports and one availability probe. The Step 06 owner scan produced the following disposition before any trait was written:

| Input or historical shape | Current disposition | Consequence in S07-E |
|---|---|---|
| four resolver names in Step 05/06 | current capability owner | define four `application::ports::resolvers` traits; infra implements them |
| historical one-line `SafeResolution<T>` | incomplete affected material | define its five finite branches, typed payloads, constructors and error split here |
| historical safe-summary structs | incomplete affected material | define four non-persistent call carriers with exact typed fields; do not create domain objects |
| `SafeLabelAssessment` owner | current `domain::signal` type | source and runtime/sandbox resolved summaries must carry it; caller cannot submit it |
| `EvidenceOriginResolution` owner | current `contracts::metadata` type | only a resolved `EvidenceSafeSummary` carries it; caller/config cannot assert it |
| `ReferenceRefreshResult` | current `contracts::metadata` maintenance result | remains a separate application mapping input; no generic conversion from resolver output |
| `AdapterAvailabilityScope/Kind/State` | current `application::ports::runtime` objects | Step 07 defines only the probe callable; it does not shadow or mutate those objects |
| provider text/status/body and raw locator | historical/forbidden material | never appears in a resolver result, error, debug surface or persisted resolution |

The four safe summaries below are Step 07 call carriers, not new durable truth. Their definition owner is `application::ports::resolvers` because they describe what an application-owned port may return; `infra` may construct them only after a trusted product-neutral mapper has discarded all source body and provider-private material. They are not public DTOs, repository rows, reference lifecycle objects, evidence, acceptance results or external truth.

The resolver call boundary is deliberately read-only:

```text
application service
  -> pass one existing typed body-free reference
  -> infra resolves the matching private binding
  -> adapter maps raw response inside the trust boundary
  -> return one SafeResolution branch
  -> application validates policy/subject/version relation
  -> optional later local snapshot mutation in an application-owned UoW
```

The resolver never receives a UoW, repository, write token, operation context, actor credential, endpoint, config body or caller-provided origin/label assessment. A lookup cannot write local reference state, mint a diagnostic/evidence/run identity, call an external-effect port, or repair source/business truth.

### 7.35 Safe resolver call carriers

#### 7.35.1 `SafeResolution<T>` outer result

```rust
/// Finite body-free outcome of one safe-summary lookup.
pub enum SafeResolution<T> {
    /// A complete family-specific safe summary was mapped for the exact subject.
    Resolved(T),

    /// The subject exists at the boundary but is not visible in this lookup context.
    NotVisible {
        /// Opaque policy constraint that blocked visibility; never a policy body.
        constraint_ref: VisibilityConstraintRef,
        /// Boundary-clock time at which the classification was made.
        observed_at: ObservedAt,
    },

    /// The boundary can classify the currently known summary as stale.
    Stale {
        /// Canonical typed reason; never inferred from provider text.
        reason: ReferenceStaleReason,
        /// Boundary-clock time at which staleness was observed.
        observed_at: ObservedAt,
    },

    /// No safe result can currently be established for the exact subject.
    Unresolved {
        /// Canonical finite resolution reason.
        reason: ReferenceResolutionReason,
        /// Boundary-clock time at which the unresolved outcome was observed.
        observed_at: ObservedAt,
    },

    /// The selected resolver capability is not currently usable.
    Unavailable {
        /// Canonical finite resolution reason, without adapter-private cause.
        reason: ReferenceResolutionReason,
        /// Boundary-clock time at which unavailability was observed.
        observed_at: ObservedAt,
    },
}
```

| member | Exact signature | Contract |
|---|---|---|
| resolved factory | `pub fn resolved(summary: T) -> Self` | wraps one already validated family-specific summary; no I/O or inference |
| not-visible factory | `pub fn not_visible(constraint_ref: VisibilityConstraintRef, observed_at: ObservedAt) -> Self` | requires an existing body-free constraint ref; does not create policy truth |
| stale factory | `pub fn stale(reason: ReferenceStaleReason, observed_at: ObservedAt) -> Self` | preserves the exact canonical reason |
| unresolved factory | `pub fn unresolved(reason: ReferenceResolutionReason, observed_at: ObservedAt) -> Self` | does not manufacture a placeholder summary |
| unavailable factory | `pub fn unavailable(reason: ReferenceResolutionReason, observed_at: ObservedAt) -> Self` | does not fallback to fake/current/default binding |
| resolved borrow | `pub fn as_resolved(&self) -> Option<&T>` | only `Resolved` yields `Some`; no default object |
| classification predicates | `is_resolved/is_not_visible/is_stale/is_unresolved/is_unavailable(&self) -> bool` | exhaustive pure match; no policy authorization or state mutation |
`SafeResolution<T>` has no generic `observed_at()` constraint: callers pattern-match the finite branch and use the exact summary accessor. This avoids an open helper trait that external callers could implement with unrelated types. The outer enum has no `Default`, no `Other/Unknown`, no `map_err` from provider strings and no generic conversion to a public outcome or durable state.

The outer result and `ApplicationError` are distinct authorities:

| Situation | Port return | Persistence implication |
|---|---|---|
| trusted mapper formed a complete safe result | `Ok(Resolved(summary))` | application may continue to relation/policy validation; no write is implied |
| visibility explicitly blocked | `Ok(NotVisible { .. })` | application may preserve the typed limitation; no missing/default body |
| canonical stale/unresolved/unavailable classification exists | corresponding `Ok` branch | application may map it through the exact flow; classification is not yet durable state |
| input relation invalid or adapter failure cannot be mapped safely | `Err(ApplicationError::<exact existing variant>)` | no resolution branch may be inferred or persisted from the error |
| provider timeout/text/status with no canonical mapping | exact `ApplicationError` | string parsing cannot synthesize `Unavailable`, `Unresolved` or a reason |

There is intentionally no outer `Invalid` branch. An invalid reference shape/owner/family is rejected before or at the port boundary with the existing typed application error. The maintenance flow may independently form `ReferenceRefreshResult::Invalid` from its validated reference policy input; it cannot pretend the resolver returned that branch.

#### 7.35.2 Four resolved summary carriers

```rust
/// Body-free safe summary returned for one exact observation source reference.
pub struct ObservationSourceSafeSummary {
    source_ref_id: ObservationSourceRefId,
    source_family: SourceFamilyKind,
    source_object_ref: ExternalObjectRef,
    safe_summary_ref: SafeExternalSummaryRef,
    source_version: ObservationSourceVersionRef,
    label_assessment: SafeLabelAssessment,
    observed_at: ObservedAt,
}

/// Body-free safe summary returned for one exact runtime or sandbox signal reference.
pub struct RuntimeSandboxSafeSummary {
    runtime_signal_ref_id: RuntimeSandboxSignalRefId,
    runtime_scope_ref: RuntimeScopeRef,
    sandbox_scope_ref: Option<SandboxScopeRef>,
    execution_truth_boundary: ExecutionTruthBoundaryMarker,
    safe_summary_ref: SafeSignalSummaryRef,
    source_version: ObservationSourceVersionRef,
    label_assessment: SafeLabelAssessment,
    observed_at: ObservedAt,
}

/// Body-free safe summary returned for one governance/artifact/evidence reference.
pub struct EvidenceSafeSummary {
    boundary_ref_id: GovernanceArtifactEvidenceReferenceId,
    reference_family: GovernanceArtifactEvidenceFamily,
    external_safe_ref: ExternalObjectRef,
    safe_summary_ref: SafeExternalSummaryRef,
    digest_summary: Option<DigestSummary>,
    source_version: ObservationSourceVersionRef,
    origin_resolution: EvidenceOriginResolution,
    observed_at: ObservedAt,
}

/// Identity-safe summary returned for one exact subject observation reference.
pub struct SubjectObservationSafeSummary {
    subject_reference_id: SubjectObservationReferenceId,
    subject_kind: ObservationSubjectKind,
    subject_safe_ref: SubjectSafeRef,
    identity_boundary_marker: IdentityBoundaryMarker,
    safe_summary_ref: SafeExternalSummaryRef,
    source_version: ObservationSourceVersionRef,
    observed_at: ObservedAt,
}
```

All fields are private. None of the four carriers implements `Default`, public serde, `Any`, downcast, mutable setters, conversion from a public request, or conversion into the corresponding structured reference. A contract fake uses the same factories and must supply explicit fixture refs/version/reasons; it cannot make every lookup `Resolved`.

| Carrier | Trusted factory | Complete identity/relation check | Explicit forbidden material |
|---|---|---|---|
| `ObservationSourceSafeSummary` | `pub fn try_from_trusted_mapper(subject: &ObservationSourceRef, safe_summary_ref: SafeExternalSummaryRef, source_version: ObservationSourceVersionRef, label_assessment: SafeLabelAssessment, observed_at: ObservedAt) -> Result<Self, ApplicationError>` | copies exact `(source_ref_id, source_family, source_object_ref)`; validates snapshot is structurally usable and summary/version are typed values | source body, event payload, label key/value/count, provider metadata |
| `RuntimeSandboxSafeSummary` | `pub fn try_from_trusted_mapper(subject: &RuntimeSandboxSignalRef, safe_summary_ref: SafeSignalSummaryRef, source_version: ObservationSourceVersionRef, label_assessment: SafeLabelAssessment, observed_at: ObservedAt) -> Result<Self, ApplicationError>` | copies exact `(runtime_signal_ref_id, runtime_scope_ref, sandbox_scope_ref, execution_truth_boundary)`; boundary marker must remain external | log line, metric value/series, span, tool output, execution verdict |
| `EvidenceSafeSummary` | `pub fn try_from_trusted_mapper(subject: &GovernanceArtifactEvidenceReference, safe_summary_ref: SafeExternalSummaryRef, digest_summary: Option<DigestSummary>, source_version: ObservationSourceVersionRef, origin_resolution: EvidenceOriginResolution, observed_at: ObservedAt) -> Result<Self, ApplicationError>` | copies exact `(boundary_ref_id, reference_family, external_safe_ref)`; optional digest is only an upstream body-free digest; origin is mandatory even when `Insufficient` or `Placeholder` | governance decision body, artifact/evidence content, raw hash, evidence alias, signoff/verdict |
| `SubjectObservationSafeSummary` | `pub fn try_from_trusted_mapper(subject: &SubjectObservationReference, safe_summary_ref: SafeExternalSummaryRef, source_version: ObservationSourceVersionRef, observed_at: ObservedAt) -> Result<Self, ApplicationError>` | copies exact `(subject_reference_id, subject_kind, subject_safe_ref, identity_boundary_marker)`; boundary marker must remain external | profile, roles, PII, credential, identity lifecycle truth |

Each carrier exposes read-only accessors for every listed field using `&T` unless its canonical wrapper is explicitly `Copy`. Each exposes `matches_subject(&ExactReference) -> bool`, which compares every copied immutable tuple field listed above. Mutable local resolution/snapshot state and the newly returned summary are deliberately outside that identity tuple. The method does not call a resolver, compare current config or authorize a domain transition.

The two label assessments are mandatory. `NoLabels`, `Bounded`, `UnsafeCardinality` and `ForbiddenMaterialDiscarded` remain the only current values; an adapter cannot omit the field, pass a label map, or treat discarded forbidden material as `Bounded`. `EvidenceSafeSummary.origin_resolution` is also mandatory. `Resolved(EvidenceSafeSummary { origin_resolution: Insufficient(..), .. })` and `Resolved(...Placeholder(..)...)` are valid safe-boundary classifications but do not authorize authenticity, linkage, handoff or acceptance.

#### 7.35.3 Resolver result versus reference maintenance

`SafeResolution<T>` describes one non-mutating lookup. `ReferenceRefreshResult` describes the finite input accepted by the reference-maintenance policy/state path. They are intentionally not aliases:

| Resolver branch | Required application work before a refresh result exists | Forbidden shortcut |
|---|---|---|
| `Resolved(summary)` | verify exact subject, trusted adapter family, summary/version stream, P16 output, current snapshot relation and P10/P15 gates | generic `From`, direct snapshot update, mark Fresh from wall clock |
| `NotVisible` | evaluate visibility and gap behavior for the exact flow | map to missing, fabricate summary, erase constraint |
| `Stale` | preserve typed reason and compare current usable pair/version | clear current summary or overwrite newer version |
| `Unresolved` | preserve typed reason and exact subject | create placeholder body or infer Invalid |
| `Unavailable` | preserve typed reason and availability context | fallback fake/current route or convert to resolved empty summary |
| `Err(ApplicationError)` | follow exact error/recovery mapping; no branch exists | infer any persisted refresh state from error kind/message |

No resolver trait returns `ReferenceRefreshResult`, mutates `ReferenceSnapshotState`, appends a `ReferenceRefreshRecord`, allocates a snapshot identity, or receives a maintenance authorization. Those actions remain application/domain responsibilities in later flow/UoW steps.

### 7.36 Four resolver traits

```rust
/// Object-safe asynchronous result returned by a body-free resolver port.
pub type SafeResolverFuture<'a, T> = ApplicationPortFuture<'a, SafeResolution<T>>;

/// Resolves one observation source into a body-free, label-assessed summary.
pub trait ObservationSourceSummaryResolver: Send + Sync {
    /// Resolve only the exact typed source; never fetch or return source body.
    fn resolve_observation_source<'a>(
        &'a self,
        source: &'a ObservationSourceRef,
    ) -> SafeResolverFuture<'a, ObservationSourceSafeSummary>;
}

/// Resolves one runtime or sandbox signal boundary without execution truth.
pub trait RuntimeSandboxSummaryResolver: Send + Sync {
    /// Resolve the complete typed boundary; runtime/sandbox scopes remain immutable.
    fn resolve_runtime_sandbox_summary<'a>(
        &'a self,
        signal: &'a RuntimeSandboxSignalRef,
    ) -> SafeResolverFuture<'a, RuntimeSandboxSafeSummary>;
}

/// Resolves governance/artifact/evidence material to a body-free origin assessment.
pub trait GovernanceArtifactEvidenceResolver: Send + Sync {
    /// Resolve the exact reference without returning evidence or source content.
    fn resolve_governance_artifact_evidence<'a>(
        &'a self,
        evidence: &'a GovernanceArtifactEvidenceReference,
    ) -> SafeResolverFuture<'a, EvidenceSafeSummary>;
}

/// Resolves an identity-safe subject observation without owning identity truth.
pub trait SubjectObservationResolver: Send + Sync {
    /// Resolve the exact typed subject reference without profile, role or PII body.
    fn resolve_subject_observation<'a>(
        &'a self,
        subject: &'a SubjectObservationReference,
    ) -> SafeResolverFuture<'a, SubjectObservationSafeSummary>;
}
```

The combined runtime/sandbox method is one exact capability because `RuntimeSandboxSignalRef` already owns the complete runtime scope, optional sandbox scope, boundary marker and safe-signal relation. The frozen Step 09 shorthand `resolve_runtime_signal/resolve_sandbox_signal` is affected historical wording; later per-flow repair must call `resolve_runtime_sandbox_summary` and validate the concrete input's producer family before the call. S07-E does not edit Step 09.

| Resolver | Allowed implementation dependency | Required output checks | Explicitly prohibited |
|---|---|---|---|
| observation source | authenticated source-boundary client + private mapper | exact source family/object/revision; body-free summary; finite label assessment | source write/repair, raw material archive, payload hash of discarded body |
| runtime/sandbox | runtime/sandbox read boundary + private mapper | exact scopes/boundary marker; safe signal ref/version; finite label assessment | execution success/failure truth, log/metric/span/tool body |
| governance/artifact/evidence | authenticated boundary client + private mapper | exact family/reference/digest relation; mandatory origin resolution | decision/artifact/evidence body, caller origin, evidence/signoff mint |
| subject observation | identity-safe read boundary + private mapper | exact subject kind/safe ref/snapshot/version | profile/role/PII, identity mutation or lifecycle assertion |

All four traits are application-owned external-read ports implemented by infra. No entry crate receives them. A service implementation receives only the operation-specific subset; a missing required resolver fails runtime assembly rather than being replaced by a generic registry, service locator, no-op or cross-family resolver.

### 7.37 Adapter availability probe

```rust
/// Product-neutral availability classification for one typed adapter scope.
pub trait AdapterAvailabilityProbe: Send + Sync {
    /// Probe one family or exact external-effect scope without authorizing an operation.
    fn probe<'a>(
        &'a self,
        scope: AdapterAvailabilityScope,
    ) -> ApplicationPortFuture<'a, AdapterAvailabilityState>;
}
```

The probe consumes an already validated `AdapterAvailabilityScope`; it does not accept `AdapterFamily` plus loose optionals, a raw family token, binding locator, credential, endpoint, config object or operation request. Its implementation obtains `ObservedAt` through the runtime's application-owned clock capability and constructs only the canonical `AdapterAvailabilityState::try_new` object.

| Scope/result case | Required behavior | Forbidden behavior |
|---|---|---|
| non-effect family scope | classify that family only | use result to authorize a specific target |
| event/handoff/export family aggregate | report aggregate availability for diagnostics/readiness | treat aggregate `Available` as exact effect authorization |
| exact external-effect scope | resolve the immutable historical binding identity and classify it | fallback to current/default binding or a semantically similar target |
| `Available` | only says an attempt may be made after all operation guards | claim publication/delivery success |
| `Degraded` | application flow must apply explicit operation/read policy | generic unrestricted call |
| `Unavailable` | return canonical state or an exact error if no safe classification exists | enable fake/no-op, write diagnostic truth, fabricate normal result |
| `Misconfigured` | fail startup/operation according to existing mapping | reload or repair config inside probe |

Probe execution may perform a bounded product-neutral health/capability read. It never receives or opens an observation UoW; writes no repository, projection, reference, outbox, report, diagnostic, evidence linkage or domain object; mints no `DiagnosticSummaryRef`; and does not call publisher/delivery business methods. Provider-private response/status/cause remains inside infra and is discarded after finite mapping.

The availability probe and the four resolvers are independent capabilities. Resolver `Unavailable` describes one lookup outcome; `AdapterAvailabilityState::Unavailable` describes one typed runtime scope snapshot. Neither can be derived from the other by a generic conversion, and neither authorizes a source/business truth write.

## 8. `infra` module

### 8.1 Capability and implementation boundary

`infra` implements application-owned ports and owns only the technical composition seams required to build a process. It may depend on `application/domain/contracts/core-contracts`; it must not import `api`, `worker` or `jobs`. The entry crates may implement infra-owned handler/activation traits, so the dependency remains one-way.

| Capability | Application or technical seam | Implementation owner | State/effect allowed in infra | Forbidden ownership |
|---|---|---|---|---|
| atomic local persistence | UoW and repository ports in §§7.9~7.28 | store adapters | exact staged/commit/rollback/CAS/append/fence behavior | domain transition or application policy |
| body-free lookup | four resolver ports in §7.36 | `source_resolvers.rs` | private read/client call and finite safe mapping | external/source truth lifecycle |
| availability | `AdapterAvailabilityProbe` | runtime adapter registry/probe | process-local classification only | operation authorization or diagnostic truth |
| publication/delivery | three external-effect ports in §7.30 | publisher/handoff/export adapters | stable-token call/probe and finite result mapping | outbox/handoff/export lifecycle truth |
| entry transport/scheduler | two registrar traits below | private transport/scheduler adapters | prepare/arm/revoke process-local callbacks | Consumer/Job business semantics |
| runtime assembly | three builder methods and three built wrappers | `runtime_builder.rs` | complete-or-error wiring | use-case execution, cross-process transaction or durable runtime state |

Infra-private errors may retain provider/driver causes only inside a bounded implementation scope. Before an application port returns, those causes must be mapped to the existing `ApplicationError` or a formal call/probe outcome. Before a runtime/registration surface returns, they must be mapped to C-15 `RuntimeAssemblyError`. `InfraError` is not added to any application, handler, registrar, assignment or activation signature.

### 8.2 Adapter implementation matrix

The matrix is an implementation obligation, not permission to select products or add configuration keys in Step 07. The physical file names follow current Step 04; exact DDL, config source, mode/profile compatibility and retry budgets remain Step 11/14 owners.

| Port group | Infra file / implementation family | Required conformance | Fake/in-memory parity | Prohibited adapter shortcut |
|---|---|---|---|---|
| `ObservationUnitOfWorkManager` / `ObservationUnitOfWork` | `observation_repositories.rs` transaction root | one atomic local transaction, one tagged cursor, staged invisibility, complete rollback, commit-time guards | in-memory transaction stages privately and publishes only on commit | sequential best-effort writes, process lock as durable authority, second cursor |
| intake/signal/audit/handoff/peripheral/retention/reference repositories | `observation_repositories.rs`, `audit_stores.rs`, `reference_stores.rs` | versioned reads, exact expected version, borrowed stage, typed append-only rows, canonical page order | fake enforces the same uniqueness/version/relation checks | adapter-run domain transition, upsert append row, return default object for missing |
| projection source/membership/store | `projection_stores.rs` | one read fence, complete bounded capture, exact membership, atomic composite replacement, stale/progress indexes | in-memory capture checks completeness and fence equality | truncate then mark Fresh, query-triggered repair, derive from uncommitted state |
| idempotency/stored result | `idempotency_store.rs` | atomic logical + optional Consumer event uniqueness, all digest candidates, immutable result-before-complete | fake does insert/classify/result relation in one private transaction | process cache as replay authority, current digest only, replay by rerunning flow |
| Job execution/claim/report | `observation_repositories.rs` or a later Step 04 affected split under `infra` | immutable plan, item CAS, global typed work uniqueness, monotonic fence, commit guard, lossless report fold | fake uses global-key semantics and exact versions, not a local mutex approximation | nullable claim subject, plan-local uniqueness, naked token, report reconstruction |
| outbox / external-effect persistence | `outbox_store.rs` | immutable record/snapshot pair, start-only structural scan, attempt sidecars, append-once intent/phase links/results, global unresolved gate | fake preserves exact ordinal/semantic-key/positive-result cardinality | payload rebuild, mutable intent, retry reset, sidecar-only success |
| four safe-summary resolvers | `source_resolvers.rs` | exact typed subject, trusted body-free mapper, five-way `SafeResolution`, mandatory assessment fields | explicit fixture/controlled fake covers all branches and errors | default Resolved, cross-family fallback, raw body/provider text in result |
| availability probe | `runtime_builder.rs` private registry plus adapter-specific probe | typed scope, canonical state factory, exact binding preservation, no write | controlled probe returns explicit four-way state/error | family aggregate authorizes target, current binding fallback, diagnostic mint |
| event publisher | `publishers.rs` | same stable token/snapshot/binding, finite publish/probe outcomes, no UoW argument | fake/controlled adapter models known/unknown/unsupported branches | new token, payload reconstruction, HTTP/status-string classification |
| report handoff | `handoff_adapters.rs` | preparation/delivery token and material equality, phase-specific probe, finite receipt/failure | controlled mode models four phases independently | target fallback, receipt as signoff/verdict, package body persistence |
| peripheral export | `external_export_adapters.rs` | preparation/delivery equality, local Delivered proof boundary, phase-specific probe | controlled mode models each phase and ambiguous outcome | external audit truth, evidence alias/real run mint, delivered no-op |
| clock and typed IDs | `clock_id.rs` | application-owned time boundary and exact typed mint methods | deterministic implementation obeys identical type/monotonic constraints | DB/provider default time, generic ref mint, source/run-derived identity |

The current store modes are `StoreAdapterMode::{InMemory, Durable}` and the current external modes are `ExternalAdapterMode::{Fake, Controlled, Endpoint, Disabled}`. S07-E consumes those Step 14-owned names without redefining their config schema:

| Mode | Port contract obligation | Additional redline |
|---|---|---|
| `InMemory` | pass the same repository/UoW/unique/CAS/fence/claim/result conformance suite as durable storage | never expose private maps as truth or skip transaction staging |
| `Durable` | enforce the same semantics with durable schema/transaction constraints | driver/DDL behavior cannot weaken application port guarantees |
| `Fake` | use explicit body-free fixture binding and return formal finite outcomes | no default success, no raw fixture body, no production claim |
| `Controlled` | deterministically exercise success/limited/failure/unknown/unsupported cuts | no panic/string/provider code as a semantic result |
| `Endpoint` | keep endpoint/credential/provider payload private and map losslessly | no raw detail in error/result/log/report |
| `Disabled` | return canonical unavailable/disabled behavior only where the selected profile permits absence | no success no-op, fake fallback, receipt/summary fabrication |

A builder must reject mode/profile/capability mismatch before a façade or registrar escapes. It cannot install `InMemory` for a missing durable store, `Fake` for a missing endpoint, `Disabled` for a startup-required capability, or a generic adapter that claims multiple incompatible families.

### 8.3 Technical callback futures and handlers

The callback traits live under `infra::entry_registration`, not `application::ports`. They consume only C-03~C-10 current carriers and remain object-safe:

```rust
/// Object-safe completion of one inbound Consumer handler invocation.
pub type InboundConsumerHandlerFuture<'a> = Pin<
    Box<dyn Future<Output = InboundConsumerCompletion> + Send + 'a>,
>;

/// Exact worker-owned callback invoked by the infra Consumer registrar.
pub trait InboundConsumerHandler: Send + Sync {
    /// Finite operation implemented by this handler instance.
    fn operation(&self) -> ObservationInboundConsumerOperation;

    /// Consume one bounded delivery and return one explicitly selected transport action.
    fn handle<'a>(
        &'a self,
        delivery: InboundConsumerDelivery,
    ) -> InboundConsumerHandlerFuture<'a>;
}

/// Object-safe completion of one Operations Job handler invocation.
pub type ObservationJobHandlerFuture<'a> = Pin<
    Box<
        dyn Future<
                Output = Result<
                    ObservationJobInvocationResult,
                    ObservationJobInvocationFailure,
                >,
            > + Send
            + 'a,
    >,
>;

/// Exact jobs-owned callback invoked by a schedule or one-shot dispatcher.
pub trait ObservationJobHandler: Send + Sync {
    /// Finite internal operation implemented by this handler instance.
    fn operation(&self) -> ObservationJobOperation;

    /// Consume one complete existing Job invocation without synthesizing request fields.
    fn handle<'a>(
        &'a self,
        invocation: ObservationJobInvocation,
    ) -> ObservationJobHandlerFuture<'a>;
}
```

| Handler boundary | Exact output owner | Error behavior | Forbidden alternative |
|---|---|---|---|
| Consumer decode/application/mapping | C-05 `InboundConsumerCompletion` | worker exact mapper must choose `Acknowledge/Retry/DeadLetter`; application/protocol failures are resolved into that explicit per-flow action before completion | `Result<_, WorkerError>` in infra trait, wildcard/default action, error-string retry |
| Consumer transport action execution | private registrar/worker runtime collaboration after C-05 | ack/dead-letter execution failure maps at worker entry to existing `WorkerError::AckFailed/DeadLetterFailed`; committed receipt remains | make C-05 durable, rollback application truth, add generic registrar invocation error |
| Job request/dispatch | C-07 invocation | incomplete request maps to C-09 `Protocol`; no handler call when registrar cannot form C-07 | schedule metadata to request synthesis, `JobError` in infra trait |
| Job application/response | C-08 success or C-09 failure | complete formal failure response remains C-08; only failure before complete response is C-09 | return both, mint report/result, collapse to bool/string/generic error |

`operation()` is a static finite declaration used for catalog totality. It does not authorize a call, select a config binding or replace the operation encoded by C-03/C-07. Registrar rejects any slot/handler/delivery mismatch before callback exposure.

### 8.4 Registrar and opaque registered handles

```rust
/// Object-safe startup completion for one all-or-nothing registration group.
pub type RegistrationFuture<'a, T> = Pin<
    Box<dyn Future<Output = Result<T, RuntimeAssemblyError>> + Send + 'a>,
>;

/// Prebuilt registrar owning private Consumer transport and actor-policy slots.
pub trait InboundConsumerRegistrar: Send + Sync {
    /// Locator-free canonical registrations from the same builder invocation.
    fn registrations(&self) -> &[ValidatedInboundConsumerRegistration];

    /// Register the exact finite handler catalog or expose no active callback.
    fn register_all<'a>(
        &'a self,
        handlers: InboundConsumerHandlerCatalog,
    ) -> RegistrationFuture<'a, Box<dyn RegisteredInboundConsumerSet>>;
}

/// Prebuilt registrar owning private scheduler trigger slots.
pub trait JobScheduleRegistrar: Send + Sync {
    /// Locator-free scheduled subset from the same builder invocation.
    fn registrations(&self) -> &[ValidatedJobScheduleRegistration];

    /// Register the scheduled subset from a complete enabled handler catalog.
    fn register_all<'a>(
        &'a self,
        handlers: ObservationJobHandlerCatalog,
    ) -> RegistrationFuture<'a, Box<dyn RegisteredJobScheduleSet>>;
}

/// Opaque process-local ownership of one successfully armed Consumer group.
pub trait RegisteredInboundConsumerSet: Send + Sync {}

/// Opaque process-local ownership of one successfully armed Job schedule group.
pub trait RegisteredJobScheduleSet: Send + Sync {}
```

The two `registrations()` methods expose only C-01/C-02 safe metadata. They do not expose transport/schedule locators, private slots, callbacks, adapter clients, actor mappers, credentials or mutable registration state. Entry uses the slice only for finite catalog construction/totality; it cannot look up or invoke a private transport.

Each `register_all` performs one process-local registration transaction:

```text
prepare_all
  -> pair each safe item with one private slot and one exact handler
  -> allocate disabled/non-running framework registrations
totality_check
  -> enabled/disabled/scheduled set equality
  -> operation/producer/schema/private-slot/config identity equality
arm_all
  -> make every prepared callback eligible as one group
return_opaque_handle
  -> transfer ownership only after the complete group is armed
```

If any prepare, totality or arm action fails, the registrar must disable/revoke every item prepared by this call and await/join all registration tasks before returning `RuntimeAssemblyError::EntryBindingIncomplete`. It returns no warning tuple, partial count, active subset or recovery handle. No callback may begin before `register_all` resolves `Ok`; an implementation that cannot enforce that ordering is `RequiredCapabilityMissing` at builder stage 8.

For jobs, the catalog must be complete for all enabled Jobs, while registration takes only the scheduled subset. Enabled-but-unscheduled handlers remain in the jobs root's one-shot finite registry. The registrar cannot silently schedule them, consume the only handler instance, or synthesize a request when a trigger fires.

The two opaque handle traits intentionally have no methods. In particular they have no `lookup`, `invoke`, `registrations`, `health`, `adapter`, `into_parts`, `downcast`, `serialize`, `business_result`, `run_id`, `evidence` or `signoff` surface. Drop retains only framework-defined process cleanup semantics. Explicit shutdown/drain timeout, durable lifecycle and rollout coordination remain later configuration/operations concerns; S07-E does not invent them.

### 8.5 Runtime builder futures and exact methods

```rust
/// Object-safe startup result for one selected runtime profile.
pub type RuntimeBuildFuture<'a, T> = Pin<
    Box<dyn Future<Output = Result<T, RuntimeAssemblyError>> + Send + 'a>,
>;

/// Builds exactly one selected process runtime from one validated immutable root.
pub trait ObservabilityRuntimeBuilder: Send + Sync {
    /// Build only the API assignment and its complete wiring.
    fn build_api<'a>(
        &'a self,
        config: ValidatedObservabilityConfig,
    ) -> RuntimeBuildFuture<'a, BuiltApiObservabilityRuntime>;

    /// Build only the inbound Consumer assignment and its complete wiring.
    fn build_worker<'a>(
        &'a self,
        config: ValidatedObservabilityConfig,
    ) -> RuntimeBuildFuture<'a, BuiltWorkerObservabilityRuntime>;

    /// Build only the unified Operations Job assignment and its complete wiring.
    fn build_jobs<'a>(
        &'a self,
        config: ValidatedObservabilityConfig,
    ) -> RuntimeBuildFuture<'a, BuiltJobsObservabilityRuntime>;
}
```

Stages 1~4 remain `infra::config` activation and produce `ValidatedObservabilityConfig`. Each method above consumes that root and executes selected-profile stages 5~12: private reference resolution, store capability checks, adapter/probe construction, four application façade implementation assembly, exact assembler facet selection, selected entry totality and named runtime construction. It returns exactly one named runtime or one C-15 error.

The three assignments are declared only in `infra::runtime_builder`. Their complete Rust-facing field and construction contract is:

```rust
/// Complete one-shot API projection produced by one builder invocation.
pub struct ObservationApiAssignment {
    api_entry: ValidatedApiEntryConfig,
    truth_write: Arc<dyn ObservationTruthWriteService>,
    read: Arc<dyn ObservationReadService>,
    inputs: Arc<dyn ObservationApiInputAssembler>,
}

impl ObservationApiAssignment {
    pub(crate) fn new(
        api_entry: ValidatedApiEntryConfig,
        truth_write: Arc<dyn ObservationTruthWriteService>,
        read: Arc<dyn ObservationReadService>,
        inputs: Arc<dyn ObservationApiInputAssembler>,
    ) -> Self {
        Self {
            api_entry,
            truth_write,
            read,
            inputs,
        }
    }
}

/// Complete one-shot inbound Consumer projection produced by one builder invocation.
pub struct ObservationWorkerAssignment {
    worker_entry: ValidatedWorkerEntryConfig,
    inbound: Arc<dyn ObservationInboundEventService>,
    inputs: Arc<dyn ObservationInboundInputAssembler>,
    registrar: Arc<dyn InboundConsumerRegistrar>,
}

impl ObservationWorkerAssignment {
    pub(crate) fn new(
        worker_entry: ValidatedWorkerEntryConfig,
        inbound: Arc<dyn ObservationInboundEventService>,
        inputs: Arc<dyn ObservationInboundInputAssembler>,
        registrar: Arc<dyn InboundConsumerRegistrar>,
    ) -> Self {
        Self {
            worker_entry,
            inbound,
            inputs,
            registrar,
        }
    }
}

/// Complete one-shot Operations Job projection produced by one builder invocation.
pub struct ObservationJobsAssignment {
    jobs_entry: ValidatedJobsEntryConfig,
    operations_jobs: Arc<dyn ObservationOperationsJobService>,
    inputs: Arc<dyn ObservationJobInputAssembler>,
    registrar: Arc<dyn JobScheduleRegistrar>,
}

impl ObservationJobsAssignment {
    pub(crate) fn new(
        jobs_entry: ValidatedJobsEntryConfig,
        operations_jobs: Arc<dyn ObservationOperationsJobService>,
        inputs: Arc<dyn ObservationJobInputAssembler>,
        registrar: Arc<dyn JobScheduleRegistrar>,
    ) -> Self {
        Self {
            jobs_entry,
            operations_jobs,
            inputs,
            registrar,
        }
    }
}
```

| Builder method | Stage-11 exact assignment | Required absences |
|---|---|---|
| `build_api` | `ObservationApiAssignment { api_entry, truth_write, read, inputs }` | inbound/Job façade, registrars, repository/UoW/resolver/adapter/raw config/context factory/canonicalizer |
| `build_worker` | `ObservationWorkerAssignment { worker_entry, inbound, inputs, registrar }` | truth-write/read/Job façade, Job registrar, publication loop/cadence/limit, repository/UoW/resolver/adapter |
| `build_jobs` | `ObservationJobsAssignment { jobs_entry, operations_jobs, inputs, registrar }` | Command/Query/inbound façade, direct publication collaborator, repository/publisher/delivery/raw config/context factory/canonicalizer |

Each `new` call is made only by the matching builder path after the selected profile's stage-11 totality check succeeds. All arguments come from that same builder invocation; no parameter may be loaded from an older runtime, another selected profile or an entry-supplied handle. The fields remain private even though the type names cross the internal wrapper declaration. An assignment has no public constructor/getter, `Clone`, `Default`, serde, `Any`, downcast, `into_parts`, field replacement, cross-assignment conversion or reconstruction from entry-provided values.

### 8.6 Three named runtimes and consuming activation

```rust
/// Complete wiring for exactly one API process projection.
pub struct BuiltApiObservabilityRuntime {
    assignment: ObservationApiAssignment,
}

/// Complete wiring for exactly one worker process projection.
pub struct BuiltWorkerObservabilityRuntime {
    assignment: ObservationWorkerAssignment,
}

/// Complete wiring for exactly one jobs process projection.
pub struct BuiltJobsObservabilityRuntime {
    assignment: ObservationJobsAssignment,
}

/// Object-safe result of one entry-local consuming activation.
pub type RuntimeActivationFuture<T> = Pin<
    Box<dyn Future<Output = Result<T, RuntimeAssemblyError>> + Send + 'static>,
>;

pub trait ObservationApiRootActivation: Send {
    type ActivatedRoot: Send + Sync + 'static;

    fn activate(
        self: Box<Self>,
        api_entry: ValidatedApiEntryConfig,
        truth_write: Arc<dyn ObservationTruthWriteService>,
        read: Arc<dyn ObservationReadService>,
        inputs: Arc<dyn ObservationApiInputAssembler>,
    ) -> RuntimeActivationFuture<Self::ActivatedRoot>;
}

pub trait ObservationWorkerRootActivation: Send {
    type ActivatedRoot: Send + Sync + 'static;

    fn activate(
        self: Box<Self>,
        worker_entry: ValidatedWorkerEntryConfig,
        inbound: Arc<dyn ObservationInboundEventService>,
        inputs: Arc<dyn ObservationInboundInputAssembler>,
        registrar: Arc<dyn InboundConsumerRegistrar>,
    ) -> RuntimeActivationFuture<Self::ActivatedRoot>;
}

pub trait ObservationJobsRootActivation: Send {
    type ActivatedRoot: Send + Sync + 'static;

    fn activate(
        self: Box<Self>,
        jobs_entry: ValidatedJobsEntryConfig,
        operations_jobs: Arc<dyn ObservationOperationsJobService>,
        inputs: Arc<dyn ObservationJobInputAssembler>,
        registrar: Arc<dyn JobScheduleRegistrar>,
    ) -> RuntimeActivationFuture<Self::ActivatedRoot>;
}

impl BuiltApiObservabilityRuntime {
    pub(crate) fn new(assignment: ObservationApiAssignment) -> Self {
        Self { assignment }
    }

    pub fn activate_with<A>(self, activation: A) -> RuntimeActivationFuture<A::ActivatedRoot>
    where
        A: ObservationApiRootActivation + 'static,
    {
        let ObservationApiAssignment {
            api_entry,
            truth_write,
            read,
            inputs,
        } = self.assignment;

        Box::new(activation).activate(api_entry, truth_write, read, inputs)
    }
}

impl BuiltWorkerObservabilityRuntime {
    pub(crate) fn new(assignment: ObservationWorkerAssignment) -> Self {
        Self { assignment }
    }

    pub fn activate_with<A>(self, activation: A) -> RuntimeActivationFuture<A::ActivatedRoot>
    where
        A: ObservationWorkerRootActivation + 'static,
    {
        let ObservationWorkerAssignment {
            worker_entry,
            inbound,
            inputs,
            registrar,
        } = self.assignment;

        Box::new(activation).activate(worker_entry, inbound, inputs, registrar)
    }
}

impl BuiltJobsObservabilityRuntime {
    pub(crate) fn new(assignment: ObservationJobsAssignment) -> Self {
        Self { assignment }
    }

    pub fn activate_with<A>(self, activation: A) -> RuntimeActivationFuture<A::ActivatedRoot>
    where
        A: ObservationJobsRootActivation + 'static,
    {
        let ObservationJobsAssignment {
            jobs_entry,
            operations_jobs,
            inputs,
            registrar,
        } = self.assignment;

        Box::new(activation).activate(jobs_entry, operations_jobs, inputs, registrar)
    }
}
```

The boxed consuming receiver keeps the activation traits object-safe while guaranteeing that one activation value and one named runtime are consumed once. The async result is required because worker/jobs stage 13 must await `register_all`, including revoke/join cleanup, before a root can be returned. This is the Step 07 executable lowering of the Step 06 semantic activation signature; it does not change the exact field sets or error owner.

Each built wrapper has one `pub(crate)` constructor for the matching assignment and only one public operation: its matching `activate_with`. The constructor is called directly by the matching `build_*` path and is never callable by an entry crate. `activate_with` destructures the private assignment and moves every field into one boxed entry-local activation value; no field is borrowed into the returned `'static` future. It never exposes an assignment, tuple or getter. There is no current `BuiltObservabilityRuntime`, generic built-runtime family, aggregate entry assignment, seal, activation permit, service locator, cross-family method or public wrapper constructor.

Stage 13 has three independent process-local atomic boundaries:

| Runtime | Activation transaction | Success root owns | Failure cleanup |
|---|---|---|---|
| API | prepare complete enabled Command/Query route table -> totality -> publish all | one finite route root | publish zero route; drop all prepared route state |
| worker | build exact nine-slot Consumer catalog -> registrar prepare/totality/arm | one opaque registered Consumer set plus immutable entry handles | registrar revoke/join all; expose zero callback/root |
| jobs | build complete enabled Job handlers/one-shot registry -> register scheduled subset -> expose root | one-shot finite registry plus opaque schedule set | registrar revoke/join schedules; expose zero callback/root |

An API activation failure makes no claim about a worker/jobs process; a worker activation failure does not roll back an already active API/jobs process. A shared `ConfigBindingRef` proves recipe identity only, not a distributed transaction. Deployment rollout/drain is not observation truth, evidence or acceptance.

### 8.7 Infra module stop review

| Review item | S07-E result |
|---|---|
| every application port group has an infra implementation family and parity obligation | pass_design_only |
| resolver output remains body-free and five-way total | pass_design_only |
| technical handler signatures preserve C-05 and C-08/C-09 owners | pass_design_only |
| infra trait surface contains no `WorkerError`/`JobError` or entry-crate type | pass_design_only |
| registrar is prepare-all/totality/arm-all/revoke-join and callback-before-Ok is forbidden | pass_design_only |
| registered handles expose zero business/private lookup methods | pass_design_only |
| builder has exactly three selected-profile methods and no aggregate build | pass_design_only |
| runtime activation can await registration and consumes exact assignment once | pass_design_only |
| assembly/activation does not write business/observation truth or mint evidence/run/signoff | pass_design_only |

## 9. `api` module

### 9.1 Least-authority activation contract

`api` implements only `ObservationApiRootActivation` for a crate-local activation value. In its one consuming call it receives exactly `ValidatedApiEntryConfig`, `Arc<dyn ObservationTruthWriteService>`, `Arc<dyn ObservationReadService>` and `Arc<dyn ObservationApiInputAssembler>`.

It prepares all enabled 16 Command and 14 Query routes, proves route/operation/body/assembler/service totality, then publishes the complete route root. Any failure returns C-15 startup error and exposes no route/root. Per-call values remain local: typed request, digest candidates, operation context hidden behind assembler, concrete input, application result and public response/error.

| API may receive/call | API must not receive/call |
|---|---|
| API-safe bounds/enabled sets; 30-method assembler; truth-write/read façades | inbound/Job façade, repository, UoW, resolver, publisher/delivery, availability probe, concrete adapter |
| exact static Command/Query handlers and Step 08 response mapper | raw config/binding/private registry, context factory, canonicalizer, generic route/service locator |
| per-call `ApiError` mapping | source/business truth write outside façade, query repair/rebuild, previous-call result state |

No `ObservationCommandHandlerState` or `ObservationQueryHandlerState` canonical object is created. A framework-private root wrapper may hold only the exact assignment handles and finite routes; it is not serialized, persisted, downcast, exposed as a public API or used as runtime/evidence identity.

### 9.2 API module stop review

| Review item | Result |
|---|---|
| 16 Command + 14 Query route totality is the only stage-13 API surface | pass_design_only |
| Query has no write/UoW/repair capability | pass_design_only |
| API cannot construct application context/digest/input outside assembler | pass_design_only |
| no repository/resolver/adapter/raw binding reaches API | pass_design_only |
| activation failure exposes zero route/root in this process | pass_design_only |

## 10. `worker` module

### 10.1 Least-authority Consumer contract

`worker` implements only `ObservationWorkerRootActivation`. It receives `ValidatedWorkerEntryConfig` in its R06.8-B Consumer-only shape, the inbound façade, the 9-method inbound assembler and one prebuilt `InboundConsumerRegistrar`. It constructs exactly nine finite optional handler slots from the validated enabled set and calls `register_all` once.

Each handler consumes one C-03 delivery, validates header/body variant before payload decoding, invokes the matching assembler and inbound façade, maps the exact typed result/error through the later per-Consumer action matrix, and returns one C-05 completion. The registrar executes that selected action without reclassification. Ack/dead-letter failure maps to existing worker errors after local result commit and never rolls back observation truth.

| Worker may receive/call | Worker must not receive/call |
|---|---|
| locator-free Consumer registrations; inbound façade; inbound assembler; Consumer registrar | truth-write/read/Job façade, Job registrar, repository/UoW/resolver/publisher/delivery |
| C-03 delivery, C-05 completion and opaque registered set | transport/actor-policy locator, credential, private slot/registry, raw config/current route |
| exact per-Consumer protocol/result/action mapping | wildcard/default ack/retry/dead-letter, raw body archive, source truth repair |

There is no resident publication or projection loop. `PublishObservationOutbox` is only the unified Operations Job owned by jobs; worker has no cadence/candidate-limit field, publication façade, outbox scan, publisher handle or fallback poller. `OutboxPublisherLoopState`, `ProjectionWorkerLoopState` and generic `EntryDisposition` remain deleted/HX/DX material.

### 10.2 Worker module stop review

| Review item | Result |
|---|---|
| exactly nine finite Consumer slots match safe registrations/private slots | pass_design_only |
| callback receives bounded move-only frame and safe actor only | pass_design_only |
| C-05 action is explicit and registrar cannot reclassify it | pass_design_only |
| worker error remains entry-owned and absent from infra trait signatures | pass_design_only |
| no resident publication/projection authority remains | pass_design_only |
| activation failure revokes/joins all and exposes zero callback/root | pass_design_only |

## 11. `jobs` module

### 11.1 Least-authority Operations Job contract

`jobs` implements only `ObservationJobsRootActivation`. It receives `ValidatedJobsEntryConfig`, the single nine-method `ObservationOperationsJobService`, the nine-method Job input assembler and one prebuilt `JobScheduleRegistrar`. It constructs one immutable handler for every enabled Job, retains the finite one-shot registry, and passes matching `Arc` slots to the registrar for scheduled-subset registration.

Both operator and scheduled paths must supply a complete existing C-07 invocation. A trigger cannot derive actor, idempotency key, `JobRunId`, trace, target, cursor, consumer, input, plan/claim/report identity or config snapshot. Each exact handler invokes the matching assembler/service and returns either a complete C-08 response wrapper or C-09 Protocol/Application failure.

| Jobs may receive/call | Jobs must not receive/call |
|---|---|
| enabled/scheduled safe sets and invocation budget; unified Job façade; Job assembler; schedule registrar | Command/Query/inbound façade, repository/UoW/resolver, direct publisher/handoff/export collaborator |
| C-07/C-08/C-09, finite one-shot registry and opaque schedule set | schedule locator/trigger handle, raw config/current target, context factory/canonicalizer |
| exact response/error/exit mapping | request synthesis, new plan on resume, real run/evidence/signoff/acceptance generation |

`PublishObservationOutbox` is one of the same nine handlers and follows the same C-07 -> assembler -> unified façade -> C-08/C-09 path. It is not a special worker service, resident loop, direct repository/publisher pair or fifth application façade.

### 11.2 Jobs module stop review

| Review item | Result |
|---|---|
| enabled set requires one exact handler; scheduled set is a validated subset | pass_design_only |
| enabled-but-unscheduled Job remains one-shot callable | pass_design_only |
| complete C-07 request is never synthesized from schedule metadata | pass_design_only |
| all nine Jobs use one façade and one assembler facet | pass_design_only |
| C-08 complete response and C-09 incomplete failure remain mutually exclusive | pass_design_only |
| jobs cannot directly access repository/resolver/external adapter | pass_design_only |

## 12. S07-E closure and stop review

### 12.1 Surface and owner closure

| S07-E surface | Current owner/use | Design-only result |
|---|---|---|
| `SafeResolution<T>` and four safe summaries | application resolver call carriers; infra trusted mapper constructs | complete five-way/body-free/typed-assessment surface |
| four resolver traits | application ports; infra implements; services consume exact subset | exact object-safe signatures; no source write/body |
| `AdapterAvailabilityProbe` | application runtime port; infra implements | typed scope/state; no target authorization/diagnostic mint |
| adapter implementation matrix | infra implementations of §§7.9~7.37 | store/external mode parity and redlines enumerated |
| two handlers/future aliases | infra technical seam; worker/jobs implement | C-05 and C-08/C-09 output owners preserved |
| two registrars/future alias | infra technical seam; worker/jobs activation consume | all-or-nothing registration and startup error owner fixed |
| two registered handles | infra opaque process-local ownership | zero method/business/persistence surface |
| builder | infra runtime owner | exactly `build_api/build_worker/build_jobs` |
| three assignments/runtimes/activations | infra wrapper + matching entry implementation | exact least-authority fields and independent stage-13 transactions |
| API/worker/jobs entry restrictions | matching entry crate | no repository/UoW/resolver/adapter/raw binding escape |

### 12.2 Historical and dependency audit

| Forbidden/historical shape | S07-E disposition |
|---|---|
| aggregate/generic `BuiltObservabilityRuntime` | absent from current declarations; historical references remain labeled only |
| public assignment getter, `Clone`, `into_parts`, reconstruction or cross-family conversion | forbidden |
| generic registration map/free-text callback/default handler | forbidden; two nine-slot finite catalogs remain Step 06 owners |
| registrar returning partial handles/warnings or callbacks before `Ok` | forbidden; revoke/join complete attempt |
| `infra -> worker/jobs/api` dependency | absent; entry implements infra traits |
| `WorkerError`/`JobError` in infra trait surface | absent; C-05 and C-09 preserve owner split |
| generic resolver registry/raw body/provider string | absent; four exact typed ports and finite outputs |
| `ReferenceRefreshResult` merged into lookup result | forbidden; explicit mapping/policy gate remains |
| family availability authorizing exact target | forbidden |
| resident worker publication/projection loop | absent; publication is one Operations Job |
| generic `EntryDisposition` or canonical handler/runner state | absent; existing result/completion/callback owners suffice |

### 12.3 Verification status and stop gate

S07-E static review completed with the following design-only results:

| Static gate | Result |
|---|---|
| assembler method totality | pass：`30 / 9 / 9` exact methods |
| service façade method totality | pass：`16 / 14 / 9 / 9` exact methods；no fifth façade |
| resolver / availability totality | pass：four exact resolver traits and one exact availability probe, one method each |
| handler / registrar / builder / activation totality | pass：two 2-method handlers、two 2-method registrars、three builder methods、three 1-method activation traits |
| assignment field totality | pass：API/worker/jobs each has exactly the four R06.8-B fields and one crate-private all-fields constructor |
| future and ownership lowering | pass_design_only：borrowed handler/port futures retain `'a`; consuming activation moves all fields into a `'static` future |
| dependency direction | pass：infra declarations contain no entry-crate type or `WorkerError` / `JobError`; entry crates implement only matching infra traits |
| historical aggregate isolation | pass：no current Rust block declares aggregate/generic `BuiltObservabilityRuntime` or superseded assignment/seal/permit types |
| Markdown structure | pass：all fences close and adjacent table column counts are consistent |

This is a static document review, not a Rust compile or runtime result. Repository conformance, adapter parity, registration failure injection, compile checks, runtime activation, external probes and all other implementation tests remain `planned/not_run`.

No new external upstream blocker was found while defining S07-E. The existing `R06.6-F2-H13-UPSTREAM=open_controlled`, downstream `R06-F-AFFECT-UOW-01`, `03-RPR-S08-PER-PROTOCOL`, `03-RPR-S09-PER-FLOW` and the two S07-D external-effect propagation items remain unchanged. S07-E closes only current Step 07 resolver/runtime/entry definition/use; it does not claim frozen downstream propagation is complete.

> Historical checkpoint: S07-E completed its resolver/infra/runtime/entry batch at design-only depth. Its original stop statement and recovery point are retained here for audit history only. The current Step 07 state is defined by §13 and the synchronized control files; do not use this checkpoint as the active recovery point.

## 13. S07-F 跨模块闭环与 Step 08 handoff

### 13.1 S07-F 输入复核与新增内部缺口处置

S07-F 已按门禁重新读取 Step 07 SOP 的十一问、书写规范 5.5/5.6、truth-source 可落码标准、Step 05 七模块 owner、R06.8-B §15 十项 handoff、Step 06 UoW / Job / outbox / external effect / resolver / runtime / entry owner，以及冻结 Step 08 的 affected use。冻结 Step 08 只用于识别待替换 use-site，没有反向成为本步 authority。

最终 definition/use 复核发现三个 Step 07 内部 technical carrier 缺口，并已分别在 §7.9 和 §7.21 关闭：

| 缺口 ID | 原缺口 | S07-F 修正 | 关闭证明 |
|---|---|---|---|
| `R07-TRANSACTION-REF-CROSS-CRATE-01` | `ObservationTransactionRef(BodyFreeRef)` 字段私有，独立 infra crate 无 validated construction / rehydrate / selector | 增加 `try_from_generated`、process-local `try_rehydrate` 和 `as_body_free_ref`；失败映射到既有 persistence error | infra 可合法创建 UoW handle；type 仍不是 durable/public/external identity |
| `R07-REPOSITORY-CURSOR-BINDING-01` | repository cursor 只有私有 `String`，method/selector/order 绑定和 `InvalidPageCursor` 没有 callable surface | 增加十四个 exact binding factory、一次性 `BASE64URL_NOPAD(binary envelope)`、十四组有限 position codec、validated cursor/page/result codec、private fields和固定 keyset order；binding fingerprint只委托唯一 `application::digest::repository_page_binding_fingerprint_v1` owner | 十四个 page callable一一对应；receipt按`(received_at, receipt_ref)`、rollup rebuild按`(updated_at, rebuild_ref)`，其余按列明完整key排序；cross-method/selector/order replay在UoW前拒绝；fake/durable执行同一codec/order规则 |
| `R07-AFFECTED-PROJECTION-CODEC-01` | affected/source projection ref 缺有限 persisted tag、cross-crate rehydrate、canonical ordering，以及set bound/empty contract | §7.21固定`ProjectionSourceRef`十四个和`AffectedProjectionRef`六个variant/tag，逐variant `try_rehydrate_*`、body-free canonical frame、set排序/去重/bound和selector encoding | durable adapter只能有限`match` exact tag；source selector非空，affected result可为空但必须省略stale follower并禁止调用`mark_views_stale`；未知tag、错配或非canonical持久化值按invariant failure拒绝 |

这三个缺口均为本步内部可修复项，不是新的外部上游 blocker。修正没有把 transaction locator、repository position、projection technical ref、public page cursor 或 provider cursor升级为业务 truth，也没有新增协议 DTO、第二个digest owner或业务truth owner。

### 13.2 Step 07 SOP 十一问最终回答

| # | SOP 问题 | Current answer | 证据 / 结论 |
|---:|---|---|---|
| 1 | 哪些模块需要定义 trait / port | `application` 定义 assembler、service façade 和全部业务所需 inward/outward port；`infra` 仅定义 handler、registrar、builder、activation 等技术装配 seam | §§3、7、8；`contracts/domain/api/worker/jobs` 不拥有 business port |
| 2 | 哪些模块负责实现 | application concrete assembler/service 实现 façade；infra 实现 UoW/repository/resolver/external adapter；matching entry crate 实现自己的 handler/root activation；infra 实现 registrar/builder | §§3.1、8~11；dependency 保持单向 |
| 3 | 哪些 capability 需要接缝 | 48 input assembly、48 service calls、atomic admission、versioned persistence、12 typed history append、projection capture/replace、Job coordination、outbox/external phase、body-free lookup、availability 和 process-local activation均有具名接缝 | §§7.4~7.37、8.2~8.7；没有“调用数据库/外部服务”占位语句 |
| 4 | 每个接缝承接哪个 Step 06 能力/来源 | 每组 trait 都回指 Step 06 input/object/state/result owner；repository 只保存已完成 domain/application transition，resolver只提供 safe mapping，external port只消费 committed intent/token | §§7.7、7.13、7.21、7.25~7.31、7.35~7.37 |
| 5 | repository/outbox/projection/client 签名是什么 | 所有 callable 有 object-safe Rust 参数、返回、future lifetime 和 error owner；paged method 另有 exact cursor binding | §§3.2、7.9~7.37 |
| 6 | 参数、返回、错误是否完整 | application callable 统一返回 `ApplicationError`；runtime/registration返回 C-15；entry invocation错误保持各自 owner；provider error 不穿透 | §§3.3、7.3、8.1、8.4 |
| 7 | 读取面是否覆盖后续 DTO/flow/state/stale | point read、unique lookup、versioned read、bounded page、projection read facet、complete accounting、phase link/probe均具名；missing/corrupt不折叠为默认对象 | §§7.13~7.21、7.25~7.30；§13.4 capability audit |
| 8 | version/UoW/idempotency/append/sidecar 是否闭合 | write 由 matching `Versioned<T>` 提供 expected version；create-only使用明确 `None`；所有 durable mutation接收同一 borrowed UoW；append与sidecar有typed relation和commit guard | §§7.9~7.12、7.22、7.31~7.33 |
| 9 | 哪些依赖只能经 trait 访问 | application不得导入 infra；entry不得取得 repository/UoW/resolver/adapter/raw binding；source/business external truth只可经四个 read-only resolver访问 | §§3.1、7.34~7.37、8~11 |
| 10 | 每个模块是否停审 | 七模块均完成最终 stop review；无 module-local unresolved trait gap | §13.3 |
| 11 | 是否有重复 port、反向依赖、缺失读取/version 面 | 未发现 current duplicate/reverse dependency；projection query facet 是 deliberate least-authority subtrait，不是 duplicate store；transaction/cursor缺口在§7.9、projection technical carrier缺口在§7.21均已修复 | §§13.4~13.6；Step 07 result=`pass_design_only` |

### 13.3 七模块最终停审

| 模块 | Current callable / capability | 调用方与实现方 | 最终停审结论 |
|---|---|---|---|
| `contracts` | 只拥有 public typed carrier；本步不定义 repository/runtime/schema | application/entry读取；无 adapter implementation | `pass_no_port_required`；public DTO/page schema留 Step 08 |
| `domain` | pure transition、policy、factory、12 typed history families；无 I/O trait | application调用 concrete domain methods | `pass_no_port_required`；无 clock/repository/application反向依赖 |
| `application` | `30/9/9` assembler、`16/14/9/9`四 façade、UoW/repository/projection/Job/outbox/external/resolver ports | entry只调matching façade；infra实现 outbound ports | `pass_design_only`；参数/结果/error/version/UoW/read面闭合 |
| `infra` | application port adapter、四 resolver、availability、两个 handler/registrar、三个 builder/runtime seam | application定义业务契约；matching entry实现 activation/handler | `pass_design_only`；fake/durable parity和provider error mapping明确，无 business truth owner |
| `api` | exact 16 Command + 14 Query routes，只消费 API assignment | API activation实现；每次调用经 assembler和matching façade | `pass_design_only`；无 repository/UoW/context factory/canonicalizer/raw binding |
| `worker` | exact 9 Consumer catalog、C-05 completion、all-or-nothing registration | worker activation实现；infra registrar执行已分类 action | `pass_design_only`；无 publication/projection resident loop，无 Job/repository capability |
| `jobs` | exact 9 Operations Job handlers、一体化 façade、one-shot + scheduled subset | jobs activation实现；infra registrar只接完整 C-07 invocation | `pass_design_only`；publication与其余八 Job同一 lifecycle，无 direct adapter |

`contracts` 和 `domain` 的 no-port 结论是显式设计，不是遗漏。`api/worker/jobs` 也不重新定义 application port；它们只实现 infra-owned technical seam 并消费 matching least-authority assignment。

### 13.4 Query 只读 capability 证明与读取面审计

不新增七组 repository reader trait。这样做不会削弱只读边界，原因是 capability 集合已经在 construction 和 signature 两层闭合：

1. `BuiltApiObservabilityRuntime` 只向 API 移交 `truth_write/read/inputs/api_entry`，API Query handler只能选择 `read`。
2. `ObservationReadService` concrete composition不得接收 `ObservationUnitOfWorkManager`、`ObservationIdempotencyRepository`、`ObservationStoredResultRepository`、`ObservationOutboxRepository`、`ObservationExternalEffectRepository`、IdGenerator或external-effect adapter。
3. Domain-family repository mutation全部要求调用方持有 `&dyn ObservationUnitOfWork`；Query composition没有 manager，无法取得可提交的 handle。读取方法本身不接收 UoW，不读取 staged state。
4. Projection 已有独立 `ObservationProjectionQueryStore`，Query不接收其可写 supertrait `ObservationProjectionStore`。
5. Query response assembly只能消费 committed object/view、visibility/freshness/degraded surface和 opaque page token；missing、not-visible、stale、failed、rebuilding、disabled不能触发 repair。
6. Planned compile-time dependency tests必须构造只读 service fixture并证明上述 write capability无法注入；不得复用冻结 Step 06 中已标 historical 的 dependency bundle。

| Read need | Exact current surface | Complete because | Forbidden fallback |
|---|---|---|---|
| point/current relation | `get_*`、`find_*` with typed complete selector | distinguishes missing from malformed/corrupt and returns exact owner | global scan、latest-by-time、default object |
| mutation source version | `get_*_with_version -> Versioned<T>` | same row's version travels to matching `stage_*` | caller version、page-wide version、skip CAS |
| public bounded collection | fourteen `page_*`/affected-view callables + §7.9 binding | exact method/selector/order/limit and same-binding continuation | offset/provider cursor、cross-query replay |
| projection Query | `ObservationProjectionQueryStore` | excludes replacement, stale marking, source indexing and UoW | Query rebuild/repair-on-read |
| projection mutation | full `ObservationProjectionStore` + source reader/planner/fence | captures complete source set and replaces atomically | partial member update、Query store downcast |
| Job resume | execution/plan/item/report point/page reads + claim probe | reloads frozen plan and exact claim/report relation | relist candidates、public `JobRunId` lookup authority |
| publication/external recovery | outbox accounting、phase link、intent/result reads and exact probes | distinguishes known success/negative/unknown without repeating call | raw adapter result、current binding fallback |

### 13.5 Version、UoW、page helper 与跨模块接缝闭环

| 审计项 | Current closure | 结论 |
|---|---|---|
| duplicate business façade | entry-callable façade只有 TruthWrite/Read/InboundEvent/OperationsJob 四个；maintenance/publication aliases不存在 | pass |
| duplicate persistence port | 七个 domain-family repository按owner family划分；Job/report/outbox/external/projection分别拥有不同 durable relation | pass；没有同一 row 的双 writer |
| projection facet overlap | `ObservationProjectionQueryStore` 是 writable store 的 least-authority supertrait边界 | pass；不是第二 truth store |
| dependency direction | `contracts <- domain <- application <- infra <- entry`；infra trait不引用 entry error/type | pass |
| expected version source | update从matching point/versioned read取得；independent item/report/claim/owner rows各自持有版本 | pass；禁止cross-row/version bag |
| create semantics | `expected_version=None`只表示create-if-absent；append/new plan有独立 uniqueness/relation guard | pass |
| transaction boundary | primary/follower/record/stored/outbox在一个 local UoW；external call永远在UoW外，前后各有known commit gate | pass |
| UoW identity | §7.9 validated process-local transaction ref；只用于fence equality/safe detail | pass；不升级为durable/external truth |
| page helper | public page request由 application映射为`ObservationRepositoryPage`；result映射回public page/info；cursor只输出opaque token | pass；Step 08须定义public schema并执行exact mapping |
| cursor binding | 十四 exact factories绑定 method + complete selector + order revision；一次性binary envelope、唯一digest owner、有限position codec和fake/durable同规则 | pass；receipt/rollup复合序唯一，wrong binding=`InvalidPageCursor` |
| projection technical ref codec | 十四个source ref与六个affected ref使用有限tag/rehydrate/canonical frame；source set非空，affected set允许空结果 | pass；空affected set省略stale follower，未知tag/错配/非canonical值拒绝 |
| resolver boundary | 四个 exact body-free resolver + one typed availability probe | pass；无generic registry/body fetch/source writer |
| external effect boundary | stable token、immutable material、append-only attempt accounting、finite call/probe | pass；不宣称external acceptance/exactly-once |
| report handoff | local evidence-index input、handoff/preparation/delivery state和external result分层 | pass；handoff不成为业务truth或验收签署 |
| runtime/entry | three named runtime + three four-field assignment + matching consuming activation | pass；无aggregate/generic/cross-process transaction |
| error ownership | protocol/domain/application/runtime/entry finite owner各一；infra raw cause在边界内终止 | pass |

跨模块审计没有发现需要新增通用 gateway、reader repository、service locator、generic runtime 或 public technical carrier 的理由。所有 external/source read 只能通过 application-owned typed trait；所有 local write只能通过 application service orchestration和UoW；entry不能绕过这两条边界。

### 13.6 R06.8-B 十项 exact handoff 核销

| order | handoff subject | Step 07 current landing | Step 07 状态 | 下游状态 |
|---:|---|---|---|---|
| 1 | application input assembly traits | §§7.4~7.5 三个 exact facet，方法数=`30/9/9` | `closed_at_S07-F_design_only` | Step 08/09 mapping pending |
| 2 | service façade traits | §§7.6~7.8 四 façade，方法数=`16/14/9/9` | `closed_at_S07-F_design_only` | Step 05/08/09 affected use pending |
| 3 | input/service signatures | 48 concrete Step 06 inputs按值进入matching service；本步不重复 schema | `closed_at_S07-F_design_only` | per-protocol/flow audit pending |
| 4 | idempotency repository | §7.12 atomic scope + optional event identity + full digest candidates reserve | `closed_at_S07-F_design_only` | Step 09/11/13 propagation pending |
| 5 | UoW/cursor contract | §§7.9~7.10、7.13~7.22 one cursor、borrow-stage、typed records/followers、validated page cursor | `closed_at_S07-F_design_only` | `R06-F-AFFECT-UOW-01` downstream remains open |
| 6 | Job identity/plan/claim/report | §§7.24~7.26 local execution/plan/work key/exact claim tuple/independent report fold | `closed_at_S07-F_design_only` | Step 08/09/11/12/13 pending |
| 7 | publication ports | §§7.27~7.31 immutable outbox snapshot + stable token + finite call/probe + fenced local marker | `closed_at_S07-F_design_only` | external/retry downstream propagation pending |
| 8 | entry runtime/activation | §§8.3~8.7 three builders、assignments、named runtimes、matching consuming activations | `closed_at_S07-F_design_only` | Step 14 propagation pending |
| 9 | registrar lifecycle | §§8.4~8.7 finite catalog、prepare/totality/arm、failure revoke/join | `closed_at_S07-F_design_only` | Step 14/16 propagation pending |
| 10 | error owners | §§3.3、8.1 and each adapter boundary use existing finite owners | `closed_at_S07-F_design_only` | Step 12 mapping audit pending |

十项均已在 Step 07 definition/use 深度关闭。`closed_at_S07-F_design_only` 不表示实现存在，也不表示冻结下游已传播；各行最后一列继续作为后续 Step 的受控输入。

### 13.7 冻结 Step 08 affected-use 交接

冻结 Step 08 当前 inventory 为 16 Command、14 Query、9 Inbound Event Consumer、12 Outbound Event、9 Operations Job，共 60 个协议。S07-F 只固定它们下一步必须消费的 callable owner和替换项，不修改任何协议 schema。

| 协议族 | 数量 | Step 08 必须绑定的 current surface | Step 08 逐协议门禁 |
|---|---:|---|---|
| Command | 16 | matching `ObservationApiInputAssembler` method -> `ObservationTruthWriteService` method | typed metadata/body -> candidates/context/input；写对象、H family、stored result/outbox和error mapping逐协议闭合 |
| Query | 14 | matching API assembler -> `ObservationReadService`；paged Query再映射§7.9 page/result | request与response/view/page均独立定义；证明只读、visibility/freshness/empty/degraded和cursor mapping |
| Inbound Event Consumer | 9 | matching `ObservationInboundInputAssembler` -> `ObservationInboundEventService` -> exact C-05 completion | envelope/payload分离；source/version/idempotency/action/dead-letter association逐协议闭合 |
| Outbound Event | 12 | accepted UoW typed encoder -> immutable payload snapshot/outbox pair；publication只经 Operations Job | producer object/H record、schema/version、subscriber和stored bytes逐事件闭合；不得调用旧 publication façade |
| Operations Job | 9 | matching `ObservationJobInputAssembler` -> unified `ObservationOperationsJobService` -> C-08/C-09 | `JobRunId`只作correlation；local execution/plan/claim/report/work key和resume mapping逐Job闭合 |

| Frozen Step 08 affected use | Required replacement in Step 08 | Current disposition |
|---|---|---|
| direct `ObservationOperationContextFactory` call | route-specific assembler is the only context/digest/input entry | `pending_affected_review` |
| `ObservationMaintenanceService` | all nine methods map to `ObservationOperationsJobService` | `pending_affected_review` |
| entry-visible `ObservationPublicationService` | no protocol-visible service；publication is `publish_observation_outbox` Job lifecycle | `pending_affected_review` |
| publication listed as worker scheduler surface | jobs handler/schedule registrar owns complete C-07 invocation；worker has no loop | `pending_affected_review` |
| public `JobExecutionRef` | public metadata uses `JobRunId`; local identity is `ObservationJobExecutionRef` and never public alias | `pending_affected_review` |
| `ReferenceSnapshotRef` | use canonical `ReferenceSnapshotStateRef` in request/event/job/output | `pending_affected_review` |
| `PeripheralConsumerScopeRef` | use structured `PeripheralConsumerRef` plus `ObservationProjectionScope` | `pending_affected_review` |
| historical `PageInfo` / `Page<T>` repository helper | define public page request/info/page DTO and map to/from §7.9 application-local helpers | `pending_affected_review` |
| Outbound Event through old publication façade | same accepted UoW appends typed immutable outbox pair；later Job publishes stored snapshot | `pending_affected_review` |
| nine Jobs split across maintenance/publication owners | all nine map one-to-one to unified Job assembler/façade and exact C-08/C-09 | `pending_affected_review` |

`03-RPR-S08-PER-PROTOCOL` remains `open_controlled`: the existing schema text is historical repair input until all 60 protocols are independently reviewed for authority、field source、error、idempotency、audit、flow and binding. `R06.8-AFFECT-05-ENTRY=pending_affected_review` also remains open because the frozen Step 05 worker publication/projection loop wording has not been propagated; S07-F does not claim that text was repaired.

### 13.8 保留 blocker 与 downstream propagation

| ID | State after S07-F | Exact remaining work |
|---|---|---|
| `R06.6-F2-H13-UPSTREAM` | `open_controlled` | formal `02` 的 `DefineReplayScope -> H13` 与 current per-target H13不一致；裁定前scope-only command明确零H13 |
| `R06-F-AFFECT-UOW-01` | `step07_port_surface_closed_downstream_open` | Step 09/11/13/16传播one-cursor、borrow-stage、typed records/followers和guard order |
| `03-RPR-S08-PER-PROTOCOL` | `open_controlled` | 下一获准 Step 逐个重建60协议；不能沿用旧pass状态 |
| `03-RPR-S09-PER-FLOW` | `open` | Step 08稳定后逐接口重建flow |
| `R07-EXTERNAL-PHASE-LINK-01` | Step 06/07 closed；downstream open | Step 09/11/13/16传播create-once phase link、semantic-equal reuse和changed-material stop |
| `R07-EXTERNAL-PHASE-RETRY-ACCOUNTING-01` | Step 06/07 closed；downstream open | Step 09/11/12/13/14/16传播phase-local accounting、typed success proof和pre-call commit |

`R07-OUTBOX-RETRY-ACCOUNTING-01` 的 Step 06/07 port portion同样已闭合，其 Step 09/11/13/14/16 use propagation继续由 downstream register管理。除以上受控项外，S07-F 未发现新的外部上游 blocker。

### 13.9 正式回填来源与全局索引 handoff

本节只形成 Step 19 的回填来源，不修改正式 `03-详细设计.md`：

| Formal target | Current source to consume later | Assembly restriction |
|---|---|---|
| §5 `contracts/domain` Trait/Port | §§5~6、§13.3 | 明确 no-port，不补造 protocol schema |
| §5 `application` Trait/Port | §§7.1~7.37、§13.4~13.6 | 保留 exact signatures、owner、version/UoW/page/external boundaries；不得压缩成repository摘要 |
| §5 `infra` Adapter/runtime | §§8.1~8.7、§13.3/13.5 | 保留 adapter parity、registrar lifecycle和three-runtime topology |
| §5 `api/worker/jobs` entry | §§9~11、§13.3 | 只写matching least-authority assignment/activation；无generic entry layer |
| §6 Trait/Port/Adapter index | §7.2 and all current declarations after S07-F | 索引只引用已定义 surface，不新增判断或historical alias |
| §7 protocol chapter input | §13.7 | 仅在 Step 08完成后采用其逐协议 current output；本hand-off不是 protocol schema |

### 13.10 S07-F verification 与 stop gate

| Static design gate | S07-F result |
|---|---|
| seven-module stop review | pass_design_only；7/7模块有final结论 |
| SOP eleven questions | pass_design_only；11/11有current answer和定位 |
| R06.8-B exact handoff | pass_design_only；10/10在Step 07 definition/use关闭 |
| assembler / façade method totality | pass；`30/9/9 + 16/14/9/9`，无第五 façade |
| repository page callable/binding totality | pass；14/14 exact callable和binding factory |
| projection ref codec totality | pass；`ProjectionSourceRef=14/14`、`AffectedProjectionRef=6/6`，finite tag/rehydrate/canonical/set empty规则闭合 |
| Query no-write capability | pass_design_only；无manager/idempotency/stored/outbox/external capability，projection使用read facet |
| version/UoW/append/external cut | pass_design_only；matching version、one local UoW、typed append、call outside UoW |
| duplicate port / reverse dependency | pass；无 unresolved duplicate writer或entry-to-persistence bypass |
| historical affected isolation | pass；旧 façade/type/page/runtime只在明确historical/affected表出现 |
| Step 08 handoff | pass inventory；`16/14/9/12/9=60`，协议正文仍frozen |
| formal/implementation boundary | pass；formal `03`、Step 08~19、`04`、implementation ledger/skeleton/code均未修改 |

上述是静态文档审查，不是 Rust compile、repository conformance、adapter parity、registration failure injection、runtime activation、external probe或任何业务测试结果。所有实现验证继续为 `planned/not_run`；没有创建或声称 commit、run id、evidence alias、signoff、acceptance或external success。

Step 07 已在 design-only 深度完成，恢复点为 `Step07_S07-F_complete_waiting_user_before_Step08`。现在必须停审。只有用户明确确认后，才可读取 Step 08 对应 SOP、书写规范、current Step 06/07 handoff和冻结 Step 08 inventory并进入 Step 08；不得自动写 Step 08、formal `03` 或任何 `04` 文件。当前不需要提交。
