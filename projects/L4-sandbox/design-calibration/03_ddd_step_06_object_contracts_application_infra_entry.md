# Step 6 regression `6R-05` application / infra / entry object contracts

> 对应 SOP: `standards/document/详细设计讨论流程_SOP.md` Step 6
> 对应书写规范: `standards/document/详细设计书写规范.md` §5.4、§5.6、§5.7
> 所属流程: `03_ddd_calibration_flow.md`
> 上游: `6R-04` batch 7 closure、`03_ddd_step_06_object_contracts_shared_types.md`、Step 4 file layout、Step 5 module contracts、正式 `00/01/02`、已审查 `05/06`
> 当前状态: `6r_05_all_batches_review_confirmed_passed_to_6r_06`
> 正式文档边界: 本文件是 Step 6 中间产物；不得直接替代或修改正式 `03-详细设计.md`

---

## 1. 开工确认与当前恢复点

| 检查项 | 结论 |
|---|---|
| 用户确认 | application batch 1、infra batch 2与entry batch 3均已获用户确认；本文件当前作为`6R-06`直接输入。 |
| `6R-04` 上游 | batch 7 closure 已完成用户审查并消费，静态 inventory 差集为 0；本文件只引用其 current canonical object，不复制 schema。 |
| 当前 Step | Step 6 regression / `6R-05`。 |
| 当前对象组 | API envelope / disposition、worker context / receipt / loop result、jobs context / accumulator / exit disposition，以及 application-owned maintenance outcome 与三类 entry error。 |
| 正式 `03` | 仍为 `historical_reviewed_invalidated_by_design_reopen`，本批次不得修改。 |
| Step 7~10 | 继续冻结；本文件不定义 trait、protocol DTO、逐接口 flow 或 state matrix。 |
| implementation | `CB-SBX-01A blocked / wait_design`；未创建实现仓、代码或运行实例。 |
| commit | 不需要；用户未要求提交。 |

## 2. 本批次目标与禁止越界

本批次要把非 domain 模块中唯一拥有稳定身份、调用语境、幂等 reservation、stored replay 和入口处置的对象收敛为可落码契约。对象必须能够被后续 Step 7 的 callable、Step 8 的协议映射、Step 9 的 flow 和 Step 10 的状态触发直接引用。

本批次明确不做以下工作：

- 不定义 repository / port / adapter trait；这些属于 Step 7。
- 不定义 public request / response / event / job DTO；这些属于 Step 8。
- 不定义完整事务顺序、commit / rollback flow；这些属于 Step 9、Step 11。
- 不定义新的 persisted state machine；shared status owner 只在 `shared_types` 固定，逐状态迁移由 Step 10 重审。
- 不把 tools semantic execution、runtime agent loop、member lifecycle orchestration、artifact 正文、observability store 或 policy truth 放进本模块。

## 3. Canonical inventory 与唯一 owner

`6R-05` 只拥有下表中的 current 类型。表外名称只能作为 historical material 或 Step 8/Step 7 的 reserved consumer，不能由实现者补造。

| Registry ID | canonical type | module | category | canonical section | downstream consumer |
|---|---|---|---|---|---|
| `S6T-05-001A` | `SandboxServiceCallContext` | `application` | call context | §9.2 | Step 7 service input、Step 9 flow |
| `S6T-05-001B` | `SandboxOperationChannel` | `application` | finite channel | §9.2 | context factory、entry mapping |
| `S6T-05-002A` | `SandboxIdempotencyRecord`;`SandboxIdempotencyObservation` | `application` | persisted reservation / operation observation | §9.3 | Step 7 idempotency port、Step 9 reserve/complete |
| `S6T-05-002B` | `SandboxStoredOperationResult` | `application` | persisted replay carrier | §9.4 | Step 7 stored-result port、Step 8 duplicate mapping |
| `S6T-05-002C` | `SandboxStoredResultKind`;`SandboxStoredResultSurfaceRef` | `application` | stored surface descriptor | §9.4 | Step 7 result store、Step 8 surface mapping |
| `S6T-05-003A` | `SandboxApplicationError`;`ApplicationErrorKind`;`ApplicationErrorDetail` | `application` | application error object | §9.5 | module mappers、Step 12 |
| `S6T-05-003B` | `SandboxServiceOutcome`;`ServiceOutcomeStatus`;`SandboxSideEffectRef`;`SandboxSideEffectKind`;`SandboxSideEffectRefSet`;`IsolationEnvironmentEstablishmentResult`;`IsolationEnvironmentEstablishmentDisposition` | `application` | service / backend-port result carrier | §9.6、§9.10 | entry mappers、Step 7~9 |
| `S6T-05-003C` | `SandboxQueryAccessDecision`;`SandboxQueryAccessStatus`;`SandboxReasonSet` | `application` | no-write read decision | §9.7 | query service、Step 8/9 |
| `S6T-05-004A` | `SandboxRuntimeConfigSummary`;`SandboxRuntimeProfileRef`;`SandboxInfraConfigRef`;`SandboxAdapterBindingMarkerRef`;`SandboxAdapterKind`;`SandboxAdapterActivationKind`;`SandboxAdapterBindingSummary`;`SandboxAdapterBindingSummarySet` | `infra` | validated config / binding carrier | §10.2~§10.4 | runtime builder、Step 14 |
| `S6T-05-004B` | `AdapterAvailabilityState`;`AdapterAvailabilityStateSet` | `infra` | technical adapter state | §10.5 | runtime builder / entry startup |
| `S6T-05-005A` | `IsolationBackendEstablishmentCorrelation`;`IsolationBackendAdapterOutcome`;`IsolationBackendOutcomeStatus` | `infra` | transient backend mapper outcome | §10.6 | concrete isolation adapter内部mapper |
| `S6T-05-005B` | `MaterialHandoffAdapterOutcome`;`HandoffAdapterOutcomeStatus` | `infra` | transient handoff mapper outcome | §10.7 | concrete handoff adapter内部mapper |
| `S6T-05-005C` | `EventPublisherAdapterOutcome`;`PublisherOutcomeStatus` | `infra` | transient publisher mapper outcome | §10.8 | concrete publisher adapter内部mapper |
| `S6T-05-003D` | `SandboxMaintenanceTargetRef`;`SandboxMaintenanceResultRef`;`SandboxMaintenanceResultRefSet`;`SandboxMaintenanceItemStatus`;`SandboxMaintenanceItemOutcome`;`SandboxMaintenanceBatchOutcome` | `application` | maintenance item / batch outcome | §11.13 | Step 7 maintenance facade、worker/jobs entry |
| `S6T-05-006A` | `SandboxApiCommandEnvelope` | `api` | command entry shell | §11.4 | command handler, Step 8 |
| `S6T-05-006B` | `SandboxApiQueryEnvelope` | `api` | query entry shell | §11.5 | query handler, Step 8 |
| `S6T-05-006C` | `SandboxApiDisposition` | `api` | non-persisted entry mapping | §11.6 | API response mapper |
| `S6T-05-007A` | `SandboxConsumerReceipt` | `worker` | consumer receipt carrier | §11.10 | Step 8/9 consumer |
| `S6T-05-007B` | `SandboxWorkerKind`;`SandboxWorkerRunContext` | `worker` | worker kind / invocation context | §11.8~§11.9 | worker runner |
| `S6T-05-007C` | `SandboxFulfillmentLoopResult` | `worker` | loop result carrier | §11.11 | fulfillment runner |
| `S6T-05-007D` | `SandboxRelayLoopResult` | `worker` | relay result carrier | §11.11 | relay runner |
| `S6T-05-008A` | `SandboxJobRunContext` | `jobs` | job invocation context | §11.15 | job runner |
| `S6T-05-008B` | `SandboxJobReportAccumulator` | `jobs` | report assembly helper | §11.16 | operations job |
| `S6T-05-008C` | `SandboxJobExitDisposition` | `jobs` | non-persisted job exit mapping | §11.17 | job binary |
| `S6T-05-011A` | `ApplicationError` | `application` | module result alias / owner | §9.5 | all application callables |
| `S6T-05-011B` | `InfraError`;`InfraConfigIdentityKind` | `infra` | module error / finite error role owner | §10.9 | infra adapters / builder |
| `S6T-05-011C` | `ApiError` | `api` | module result alias / owner | §11.7 | API entry |
| `S6T-05-011D` | `WorkerError` | `worker` | module result alias / owner | §11.12 | worker entry |
| `S6T-05-011E` | `JobsError` | `jobs` | module result alias / owner | §11.18 | job entry |

### 3.1 Shared registry consumption rule

下列类型只从 `03_ddd_step_06_object_contracts_shared_types.md` 引用，不在本文件重复定义：

| shared type family | current owner | 本批次用法 |
|---|---|---|
| `ActorRef`、`RequestMetadata`、`RequestId`、`TraceId`、`Timestamp`、`IdempotencyKey`、`OperationName`、`RequestPayloadFingerprint`、`JobRunId`、`Version` | `core-contracts` | 作为字段和 factory 输入；不创建本地 wrapper。 |
| `SandboxReason`、`SandboxTraceContext`、`SandboxObjectRef` | shared types | 作为安全 carrier；不接受 raw string / opaque free-form replacement。 |
| `SandboxIdempotencyRecordRef`、`SandboxStoredOperationResultRef` | shared types §10.6 | persisted identity；不得改回 `SandboxOpaqueRef`。 |
| `SandboxIdempotencyRecordStatus`、`SandboxStoredOperationResultStatus`、`RuntimeConfigStatus`、`AdapterAvailabilityStatus`、`SandboxQuerySurfaceStatus`、`SandboxCommandResultStatus`、`SandboxConsumerReceiptStatus`、`SandboxJobReportStatus` | shared types §12.8 | 只引用 canonical lifecycle / public status；infra-private transient outcome enum不计入39个status owner。 |
| `SandboxPublicErrorKind`、`ContractError` | shared types §13 | 只按 owner 映射；不以 `_ => Internal` 兜底。`ApplicationErrorKind` / `ApplicationErrorDetail` 由本文件 §9.5 唯一拥有。 |

### 3.2 Historical invalidation recorded for this batch

| historical material | current decision | reason |
|---|---|---|
| `SandboxOpaqueRef` 作为 idempotency / result / trace / public result 通用字段 | invalidated | 无法证明 object kind、wrong-kind rejection 和 repository identity。 |
| `IdempotencyRecordStatus`、`StoredResultStatus`、`QueryAccessStatus`、无前缀 receipt/report status | invalidated | 与 shared canonical owner 重复或名称不完整；禁止 alias。 |
| `SandboxConsumerApplicationReceipt`、`SandboxJobApplicationReport` | reserved historical name | 当前稳定 public receipt/report 由 worker/jobs carrier 与 Step 8 DTO 分层承接，不新增第二套 application public object。 |
| `SandboxServiceOutcome.domain_refs: Vec<SandboxOpaqueRef>` | invalidated | domain truth ref 必须是 closed `SandboxTruthRefSet` 或由具体 downstream result carrier承接，不能用通用集合隐藏 owner。 |
| `SandboxResultKind` / `SandboxPublicResultRef` | historical unresolved | 由本批次的 `SandboxStoredResultKind` / `SandboxStoredResultSurfaceRef` 替代；Step 8 只定义其指向的 public DTO surface。 |
| `SandboxRuntimeConfigSummary`复制full adapter/profile ref、endpoint、topic或40组/101项配置 | invalidated | summary只保存typed runtime/profile identity与registry生成的redacted binding marker；完整配置仍由正式`04`的infra-private validated snapshot拥有。 |
| LD-17 summary直接携带最终`Valid/Degraded/StartupBlocked`并被当成已发布generation | invalidated | LD-17只形成`Valid + disposition_evaluated_at=None`；LD-21完成exact availability coverage后，LD-22才派生最终status；LD-24仍须独立原子发布完整generation。 |
| `IsolationBackendAdapterOutcome`同时承接environment establish、run launch和release | invalidated | 本对象只承接environment establishment；run launch返回`ControlledRunLifecycleObservation`，release返回`IsolationEnvironmentLifecycleObservation`。 |
| application port trait直接返回`infra::IsolationBackendAdapterOutcome` / `MaterialHandoffAdapterOutcome` / `EventPublisherAdapterOutcome` | invalidated_dependency_direction | `application`不得依赖`infra`；三个carrier只在concrete adapter内部完成provider结果分类，再转成application/domain已有typed result或`ApplicationError`。 |
| outcome提供`to_boundary_decision_status` / `to_handoff_status` / `to_relay_status` | invalidated | adapter success不等于domain accepted；status transition只由exact domain factory / observation application决定。 |
| `PublisherOutcomeStatus::Delivered`或generic `Failed` | invalidated | publisher闭集使用`Published/Retryable/DeadLetter`；无法安全分类的结果返回`InfraError::AdapterOutcomeUnclassifiable`并进入recovery/integrity路径，不伪造relay lifecycle。 |

## 4. SOP 问题回答

| SOP 问题 | 当前回答 |
|---|---|
| application capability 需要哪些稳定对象 | 调用语境、幂等 reservation、stored replay、application error、service outcome、query no-write decision。 |
| infra capability 需要哪些稳定对象 | sanitized validated config summary、complete binding / availability coverage、三个body-free exact-correlated transient outcome以及穷尽`InfraError`。 |
| entry 模块是否拥有业务 truth | 否。entry 只拥有 mapping shell、调用上下文和本次处置；truth/status 由 application/domain 或 Step 8 public schema owner 提供。 |
| 哪些字段可以持久化 | 只有 `SandboxIdempotencyRecord` 和 `SandboxStoredOperationResult` 的定义字段；context、outcome、decision、envelope、loop result、disposition 不作为 domain truth 持久化。 |
| duplicate 如何闭合 | duplicate identity 固定为 `operation_name + request_digest + idempotency_key`；channel 只做入口合法性校验，不进入已持久化 identity。命中后只读取 typed stored result；缺失返回 `DuplicateMissingResult`，绝不重算。 |
| query 如何保证 no-write | `SandboxQueryAccessDecision` 只能表达 read disposition；不得携带 writer、id generator、UoW 或 side-effect factory。 |

## 5. 当前文档问题诊断

| 诊断 ID | 旧材料问题 | 本批修正 |
|---|---|---|
| `SBX-DDD-6R05-001` | application 对象字段仍使用 `SandboxOpaqueRef`，无法证明 identity kind。 | 所有 persisted identity 使用 named typed ref；trace / public result 使用其 canonical owner。 |
| `SBX-DDD-6R05-002` | application `*Input`、public DTO、entry envelope 混为一层。 | 本文件只定义内部 stable carrier；DTO 到 carrier 的字段映射留 Step 8，callable 留 Step 7。 |
| `SBX-DDD-6R05-003` | `SandboxServiceOutcome` 用 `bool` / 通用 ref 列表表达副作用。 | outcome 使用 closed status 和明确的 optional typed result / side-effect summary boundary；不让 caller 猜测。 |
| `SBX-DDD-6R05-004` | infra adapter availability 可能被误读为 business allow。 | 明确技术状态只能触发 call blocking / degraded read；domain guard 仍由 domain/application owner决定。 |
| `SBX-DDD-6R05-005` | entry shell 直接保存 request body 或访问 repository 的空间未被禁止。 | 所有 entry carrier body-free、无 repository handle、只通过 application facade。 |
| `SBX-DDD-6R05-006` | application/infra/entry error owner 只有别名，没有 variant mapping。 | application error已在§9.5闭合detail/kind/public mapping；infra/API/worker/jobs error由后续批次各自闭合，禁止只留别名。 |
| `SBX-DDD-6R05-007` | 历史 Step 10 把 duplicate / conflict / unavailable 写成 persisted state，且 Step 13 把 channel 写入 duplicate identity。 | 持久状态收敛为 record `Reserved/Completed/Failed`、stored result `Completed/Rejected/Failed`；operation observation 独立，duplicate identity 不含 channel。 |
| `SBX-DDD-6R05-008` | 历史runtime summary混合validated config与已发布generation，无法区分LD-17和LD-22/24。 | 增加`disposition_evaluated_at`并固定两阶段factory；summary不拥有generation identity或publication state。 |
| `SBX-DDD-6R05-009` | 旧adapter kind只列10项，无法机械覆盖derived/reference/relay/replay/capture/release/clock/id slot。 | 本批固定18项logical runtime slot；truth/audit保持同一UoW slot，telemetry/diagnostic/entry binding不伪造adapter kind。 |
| `SBX-DDD-6R05-010` | availability只有单项状态，没有与activation plan的1:1 coverage。 | 增加binding summary/set与availability set；LD-22必须校验same-order、same-marker、complete coverage。 |
| `SBX-DDD-6R05-011` | 三类outcome缺exact attempt / generation / target correlation，receipt可被错配。 | backend绑定完整establishment correlation；handoff绑定fact/target/attempt/generation；publisher复制persisted relay attempt。 |
| `SBX-DDD-6R05-012` | infra outcome被application trait直接引用，违反`application !-> infra`。 | outcome限定为concrete adapter内部mapper carrier；Step 7重写port return owner。 |
| `SBX-DDD-6R05-013` | `InfraError`只有四个泛化名称，无法区分shape、correlation、commit-unknown或forbidden body。 | §10.9固定18个exact variant、public/application mapping和retry边界。 |

## 6. Historical application draft: call context

> 效力: `historical_material_invalidated_by_6r05_batch_1`。本节只保留缺口审计，不能作为实现输入；唯一 current contract 见 §9。

### 6.1 Canonical shape

```rust
/// application service 调用的规范化语境；不保存请求正文或协议 DTO。
pub struct SandboxServiceCallContext {
    /// core-owned operation name，来自 closed selector 的显式映射。
    pub operation_name: OperationName,
    /// 调用通道；由 entry module 固定，不由请求字符串推断。
    pub channel: SandboxOperationChannel,
    /// 可选 actor identity；匿名 command 由 factory 按 policy 返回错误。
    pub actor_ref: Option<ActorRef>,
    /// 已通过 entry 校验的 trace context。
    pub trace_context: SandboxTraceContext,
    /// 已冻结的 request payload fingerprint。
    pub request_digest: RequestPayloadFingerprint,
    /// command / consumer / job 必须存在的 core idempotency key；query 为 `None`。
    pub idempotency_key: Option<IdempotencyKey>,
}

/// application 可接受的调用来源闭集。
pub enum SandboxOperationChannel {
    /// 同步 API command。
    ApiCommand,
    /// 同步 API query，只读。
    ApiQuery,
    /// inbound event consumer。
    Consumer,
    /// 长驻 worker fulfillment / relay 调用。
    Worker,
    /// one-shot operations job。
    Job,
}
```

`OperationName`、`RequestPayloadFingerprint`、`IdempotencyKey` 等 core 类型的序列化和非空约束由 core owner 提供；Sandbox factory 仍必须拒绝与 channel 不相容的组合。`SandboxOperationChannel` 是 application 内部 finite enum，不是 public protocol selector，也不是业务状态。

### 6.2 字段与来源闭环

| 字段 | exact type | 来源 | 缺失 / 冲突行为 | 禁止替代 |
|---|---|---|---|---|
| `operation_name` | `OperationName` | `SandboxCommandKind` / `SandboxQueryKind` / `SandboxConsumerKind` / `SandboxJobKind` 的显式 mapping | mapping 缺失为 `ApplicationError::InvalidOperationMapping` | route、topic、binary name、`Debug` 文本 |
| `channel` | `SandboxOperationChannel` | api / worker / jobs entry 固定值 | selector 与 channel 不匹配为 `ChannelMismatch` | caller bool、header string |
| `actor_ref` | `Option<ActorRef>` | core `RequestMetadata` 或受信任 system-job context | command 缺失为 validation；system job按 job policy明确允许 | request body、用户名字符串 |
| `trace_context` | `SandboxTraceContext` | entry 已验证 metadata | 缺失 / 非法为 `TraceContextInvalid` | 当前时间、request id 单独拼装 |
| `request_digest` | `RequestPayloadFingerprint` | entry canonicalization | 缺失或与 body不匹配为 `RequestDigestInvalid` | application重新序列化、raw body hash |
| `idempotency_key` | `Option<IdempotencyKey>` | command / consumer / job metadata | required channel缺失为 `IdempotencyKeyMissing`；query带 key为 `ChannelMismatch` | request id、trace id、retry count |

### 6.3 Factory / member contract

```rust
impl SandboxServiceCallContext {
    /// 从已验证 command metadata 构造调用语境。
    pub fn from_command(
        operation_name: OperationName,
        actor_ref: Option<ActorRef>,
        trace_context: SandboxTraceContext,
        request_digest: RequestPayloadFingerprint,
        idempotency_key: IdempotencyKey,
    ) -> Result<Self, ApplicationError>;

    /// 从已验证 query metadata 构造只读调用语境。
    pub fn from_query(
        operation_name: OperationName,
        actor_ref: Option<ActorRef>,
        trace_context: SandboxTraceContext,
        request_digest: RequestPayloadFingerprint,
    ) -> Result<Self, ApplicationError>;

    /// 从已验证 inbound consumer metadata 构造调用语境。
    pub fn from_consumer(
        operation_name: OperationName,
        actor_ref: Option<ActorRef>,
        trace_context: SandboxTraceContext,
        request_digest: RequestPayloadFingerprint,
        idempotency_key: IdempotencyKey,
    ) -> Result<Self, ApplicationError>;

    /// 从已验证 operations job metadata 构造调用语境。
    pub fn from_job(
        operation_name: OperationName,
        actor_ref: Option<ActorRef>,
        trace_context: SandboxTraceContext,
        request_digest: RequestPayloadFingerprint,
        idempotency_key: IdempotencyKey,
    ) -> Result<Self, ApplicationError>;

    /// 判断当前 channel 是否必须执行 idempotency reservation。
    pub fn requires_idempotency(&self) -> bool;

    /// 比较两个调用是否具有相同 operation、channel、digest 和 key。
    pub fn matches_duplicate(&self, other: &Self) -> bool;

    /// 返回只读 trace context；不生成新 identity。
    pub fn trace_context(&self) -> &SandboxTraceContext;
}
```

| callable | 正常结果 | 必须拒绝 |
|---|---|---|
| `from_command` | `ApiCommand` + non-empty key | query channel、缺 actor、缺 key、invalid digest |
| `from_query` | `ApiQuery` + `None` key | key present、command-only operation、invalid trace |
| `from_consumer` | `Consumer` + non-empty key | body-free proof缺失、key缺失、event operation mapping缺失 |
| `from_job` | `Job` + non-empty key | job kind 未映射、run identity缺失、key缺失 |
| `requires_idempotency` | command / consumer / worker / job 为 `true`；query 为 `false` | 不允许按 caller 参数覆盖 |
| `matches_duplicate` | 四个 identity 维度完全相等 | 任一维度不同都不是 duplicate |

### 6.4 Invariants and downstream joins

- `SandboxServiceCallContext` 不拥有 domain truth，不持有 repository / adapter / UoW。
- `Worker` channel 只允许由已固定的 worker runner context 派生；它不能被 API request 伪造。
- `request_digest` 与 `idempotency_key` 是不同 identity；不得互换。
- Step 7 必须为四个 factory 的 `ApplicationError` 分支提供 exact callable mapping；Step 8 必须把每个 DTO 字段映射到本节字段；Step 9 不得重新排序或重造 context。

## 7. Historical application draft: idempotency / stored replay

> 效力: `historical_material_invalidated_by_6r05_batch_1`。本节错误地混合 persisted status 与 operation observation；唯一 current contract 见 §9.3~§9.4。

### 7.1 `SandboxIdempotencyRecord` canonical shape

```rust
/// 记录一次 application operation 的幂等 reservation 与 replay linkage。
pub struct SandboxIdempotencyRecord {
    /// 该 reservation 的 typed identity。
    pub idempotency_ref: SandboxIdempotencyRecordRef,
    /// 与 reservation 绑定的 core operation name。
    pub operation_name: OperationName,
    /// 首次受理时冻结的 request fingerprint。
    pub request_digest: RequestPayloadFingerprint,
    /// 当前幂等记录状态；使用 shared canonical owner。
    pub record_status: SandboxIdempotencyRecordStatus,
    /// 完成后唯一指向 stored operation result。
    pub stored_result_ref: Option<SandboxStoredOperationResultRef>,
    /// 首次 reservation 的 core idempotency key。
    pub idempotency_key: IdempotencyKey,
}
```

字段 `idempotency_ref`、`stored_result_ref` 与 `idempotency_key` 不是可互换的三个 ref。`record_status` 的 variant 解释和允许迁移只引用 shared status registry；Step 10 负责逐状态机重验，当前不新增迁移。

### 7.2 `SandboxStoredOperationResult` canonical shape

```rust
/// 保存可被 duplicate 请求读取的 public result identity，不保存结果正文。
pub struct SandboxStoredOperationResult {
    /// stored result 的 typed identity。
    pub stored_result_ref: SandboxStoredOperationResultRef,
    /// 与结果绑定的 core operation name。
    pub operation_name: OperationName,
    /// stored surface 的封闭类别。
    pub result_kind: SandboxStoredResultKind,
    /// command result、consumer receipt 或 job report 的 body-free surface identity。
    pub surface_ref: SandboxStoredResultSurfaceRef,
    /// stored result 生命周期状态。
    pub result_status: SandboxStoredOperationResultStatus,
    /// 创建或最终化时的 core `Timestamp`。
    pub recorded_at: Timestamp,
}

/// stored operation result 可指向的协议 surface 闭集；query 不进入 stored replay。
pub enum SandboxStoredResultKind {
    /// 已冻结的 command result surface。
    CommandResult,
    /// 已冻结的 consumer receipt surface。
    ConsumerReceipt,
    /// 已冻结的 operations job report surface。
    JobReport,
}

/// 指向已冻结 public result surface 的 application-owned body-free reference。
pub struct SandboxStoredResultSurfaceRef {
    /// surface 的封闭类别；必须与 stored result 的 `result_kind` 完全相等。
    kind: SandboxStoredResultKind,
    /// result store 返回的 core-owned opaque resource identity。
    resource_ref: ResourceRef,
}
```

`SandboxStoredResultSurfaceRef` 的 `resource_ref` 必须由 result store 在冻结完整 surface 后返回，不能由 operation、job run、trace、truth ref 或时间派生。它不是 domain truth ref、不是 protocol DTO，也不能转换为 `SandboxObjectRef`。若 Step 8 最终决定三类 surface 使用不同 typed wrapper，`SandboxStoredResultKind` 必须与 wrapper 一一匹配，并完成 exhaustive mapping。

```rust
impl SandboxStoredResultSurfaceRef {
    /// 从 result-store identity 和 closed result kind 构造 body-free surface ref。
    pub fn try_new(
        kind: SandboxStoredResultKind,
        resource_ref: ResourceRef,
    ) -> Result<Self, ApplicationError>;

    /// 返回 surface kind；不读取或反序列化 surface body。
    pub fn kind(&self) -> SandboxStoredResultKind;

    /// 返回 result-store resource identity。
    pub fn resource_ref(&self) -> &ResourceRef;
}
```

### 7.3 Factories and member functions

```rust
impl SandboxIdempotencyRecord {
    /// 由 application id generator 与已验证 call context 构造 reservation。
    pub fn reserve(
        idempotency_ref: SandboxIdempotencyRecordRef,
        context: &SandboxServiceCallContext,
    ) -> Result<Self, ApplicationError>;

    /// 判断请求是否与 reservation 的 operation、digest 和 key 完全一致。
    pub fn matches_request(&self, context: &SandboxServiceCallContext) -> bool;

    /// 判断当前记录是否有可读取的 stored result linkage。
    pub fn can_replay(&self) -> bool;

    /// 将 Reserved 记录绑定到已持久化的 stored result。
    pub fn mark_completed(
        &mut self,
        stored_result_ref: SandboxStoredOperationResultRef,
    ) -> Result<(), ApplicationError>;

    /// 记录执行失败；不得伪造 stored result linkage。
    pub fn mark_failed(&mut self) -> Result<(), ApplicationError>;
}

impl SandboxStoredOperationResult {
    /// 从已完成 service outcome 构造 body-free replay carrier。
    pub fn from_service_outcome(
        stored_result_ref: SandboxStoredOperationResultRef,
        operation_name: OperationName,
        result_kind: SandboxStoredResultKind,
        surface_ref: SandboxStoredResultSurfaceRef,
        result_status: SandboxStoredOperationResultStatus,
        recorded_at: Timestamp,
    ) -> Result<Self, ApplicationError>;

    /// 判断该 stored result 是否允许 duplicate replay。
    pub fn is_replayable(&self) -> bool;

    /// 判断 stored result 是否属于指定 operation。
    pub fn matches_operation(&self, operation_name: &OperationName) -> bool;
}
```

### 7.4 Idempotency transition rules

| current status | callable | precondition | next status | failure |
|---|---|---|---|---|
| `Reserved` | `mark_completed` | stored result 已在同一 UoW形成且 ref exactly-one | `Completed` | `StoredResultLinkMissing` / `InvalidStatusTransition` |
| `Reserved` | `mark_failed` | 本次 execution 已被安全分类且未发布 success result | `Failed` | `InvalidStatusTransition` |
| `Completed` | `matches_request` / `can_replay` | exact operation/digest/key | unchanged | mismatch 走 duplicate/conflict mapper |
| `Conflict` / `Failed` | replay mutation | never allowed | unchanged | `IdempotencyConflict` / `StoredResultUnavailable` |
| any | `reserve` | repository 已确认 no current record | new `Reserved` | duplicate/conflict由 repository/application outcome 返回，不由 factory 猜测 |

### 7.5 Duplicate safety contract

1. 命中相同 operation、digest、key 且 record 指向可 replay stored result 时，application 只读取并返回该 result。
2. record 指向不存在、不可见或类型不匹配的 stored result 时，返回 `DuplicateMissingResult` 或 integrity-owned `ApplicationError`；不得重新执行 domain mutation。
3. 相同 key 但 operation 或 digest 不同，返回 `IdempotencyConflict`；不得覆盖旧 record、生成第二个 current binding 或修改 stored result。
4. `SandboxIdempotencyRecord` 与 `SandboxStoredOperationResult` 的 durable/fake parity、reserve/complete transaction 和 race handling 留 Step 7/11/13；本节只固定对象 shape、factory 和禁止语义。

## 8. Historical application draft: result / read decision

> 效力: `historical_material_invalidated_by_6r05_batch_1`。本节存在悬空 error enum、开放式 side-effect kind 和 access/surface 混层；唯一 current contract 见 §9.5~§9.7。

### 8.1 `SandboxApplicationError`

```rust
/// application 在进入 public protocol mapper 前使用的 body-free 错误对象。
pub struct SandboxApplicationError {
    /// application-owned finite error category。
    pub error_kind: ApplicationErrorKind,
    /// caller-safe、非空且不含 raw cause 的理由。
    pub reason: SandboxReason,
    /// 是否允许当前 protocol family 进行重试；由 application owner 决定。
    pub retryable: bool,
    /// 可选的 core trace context，用于内部诊断和 public-safe trace mapping。
    pub trace_context: Option<SandboxTraceContext>,
}

/// application module 的结果错误别名；不创建第二种 error shape。
pub type ApplicationError = SandboxApplicationError;
```

### 8.2 Application error categories

`ApplicationErrorKind` 必须与 shared registry §13 的 public mapping 责任一致。当前 `6R-05` 只允许下列闭集；若后续发现新的 domain/application distinction，先回写本节和 shared registry，不得添加 wildcard。

| variant | 来源 | `retryable` 默认倾向 | public mapping | 禁止携带 |
|---|---|---|---|---|
| `Validation` | context factory、selector mapping、carrier shape | `false` | `Validation` | raw field value、body |
| `Domain` | object-owned domain error 已安全映射 | 由 exact domain error决定 | `Internal` / 对应 domain-safe kind | domain body、stack |
| `PortUnavailable` | application port 返回 typed unavailable | `true` 或 query degraded | `AdapterUnavailable` | adapter response |
| `IdempotencyConflict` | same key + different operation/digest | `false` | `IdempotencyConflict` | old/new digest |
| `DuplicateMissingResult` | record linkage缺失、wrong kind或不可见 | `false` | `DuplicateMissingResult` | key、storage key |
| `NoWriteViolation` | query path或entry wiring发生写入 | `false` | `NoWriteViolation` | SQL、repository details |
| `Internal` | 已批准的不可分类内部技术失败 | 由调用面固定 | `Internal` | raw cause、path、secret |

### 8.3 Error factories and mapping

```rust
impl SandboxApplicationError {
    /// 从 object-owned domain error 构造 body-free application error。
    pub fn from_domain(
        error: DomainError,
        trace_context: Option<SandboxTraceContext>,
    ) -> Self;

    /// 从已分类 port failure 构造 application error；不解析 Display 文本。
    pub fn from_port_unavailable(
        reason: SandboxReason,
        trace_context: Option<SandboxTraceContext>,
    ) -> Self;

    /// 构造 idempotency conflict，不携带任一 digest 或 key。
    pub fn idempotency_conflict(
        reason: SandboxReason,
        trace_context: Option<SandboxTraceContext>,
    ) -> Self;

    /// 构造 duplicate stored-result 缺口错误。
    pub fn duplicate_missing_result(
        reason: SandboxReason,
        trace_context: Option<SandboxTraceContext>,
    ) -> Self;

    /// 映射到 shared caller-safe category。
    pub fn to_public_error_kind(&self) -> SandboxPublicErrorKind;

    /// 返回由 finite error kind 固定的重试属性。
    pub fn is_retryable(&self) -> bool;
}
```

`from_domain` 必须由 domain error 的显式 variant mapper调用；它不能接收 `String`、`Box<dyn Error>` 或 raw adapter error。`to_public_error_kind` 必须 exhaustive match `ApplicationErrorKind`；新 variant 未加入 mapping 时应使实现无法通过编译/审计，而不是静默变成 `Internal`。

### 8.4 `SandboxServiceOutcome`

```rust
/// application service 在 protocol mapping 前返回的稳定结果 carrier。
pub struct SandboxServiceOutcome {
    /// application result identity；不作为 domain truth identity。
    pub outcome_ref: ResourceRef,
    /// service outcome finite status；不替代 domain object status。
    pub outcome_status: ServiceOutcomeStatus,
    /// 已提交或已观察的 Sandbox truth refs；顺序稳定且不得为空集合伪造 success。
    pub truth_refs: SandboxTruthRefSet,
    /// 若已写入 replay surface，则指向 typed stored result。
    pub stored_result_ref: Option<SandboxStoredOperationResultRef>,
    /// 已提交的 append / handoff / projection marker / audit refs 的有限摘要。
    pub side_effect_refs: SandboxSideEffectRefSet,
}

/// application service result 的有限状态；不作为 persisted domain state。
pub enum ServiceOutcomeStatus {
    /// 已完成规定的 application/domain 写入或只读结果组装。
    Accepted,
    /// 请求被明确拒绝且未伪造 success。
    Rejected,
    /// 结果诚实地包含缺口，但没有把缺口升级为核心 truth failure。
    Degraded,
    /// 该调用明确为 no-write read surface。
    NoWrite,
    /// 调用失败且未形成可发布 success。
    Failed,
}

/// application side-effect ref 的 ordered unique closed set。
pub struct SandboxSideEffectRefSet(Vec<SandboxObjectRef>);
```

`SandboxTruthRefSet`、`SandboxObjectRef` 的成员 kind 必须由具体 service factory 验证；`SandboxSideEffectRefSet` 只允许 relay、handoff、audit、projection marker 和 stored result relation 的 approved kinds，不允许工具、runtime、member 或 artifact body kind。两种 set 都不得由 application 临时 `Vec` 去重或丢弃重复。

```rust
impl SandboxServiceOutcome {
    /// 构造 accepted outcome；truth / side-effect set 必须来自同一 application result assembly。
    pub fn accepted(
        outcome_ref: ResourceRef,
        truth_refs: SandboxTruthRefSet,
        stored_result_ref: Option<SandboxStoredOperationResultRef>,
        side_effect_refs: SandboxSideEffectRefSet,
    ) -> Result<Self, ApplicationError>;

    /// 构造 rejected outcome；不得携带已提交 truth refs。
    pub fn rejected(
        outcome_ref: ResourceRef,
        side_effect_refs: SandboxSideEffectRefSet,
    ) -> Result<Self, ApplicationError>;

    /// 构造 query / read-only outcome；不得携带 stored result 或 mutation ref。
    pub fn no_write(
        outcome_ref: ResourceRef,
        side_effect_refs: SandboxSideEffectRefSet,
    ) -> Result<Self, ApplicationError>;

    /// 判断该 outcome 是否要求写 UoW；不执行 commit。
    pub fn requires_commit(&self) -> bool;

    /// 判断该 outcome 是否必须形成 stored replay surface。
    pub fn requires_stored_result(&self) -> bool;
}
```

### 8.5 `SandboxQueryAccessDecision`

```rust
/// query 在任何 exact read 前形成的 access-first/no-write decision。
pub struct SandboxQueryAccessDecision {
    /// application decision identity，不是 query result ref。
    pub decision_ref: ResourceRef,
    /// closed query selector。
    pub query_kind: SandboxQueryKind,
    /// query public surface status；只表达 visibility/readability。
    pub surface_status: SandboxQuerySurfaceStatus,
    /// 明确的 body-free degraded / unavailable markers。
    pub markers: SandboxReasonSet,
}

/// ordered unique query decision marker set。
pub struct SandboxReasonSet(Vec<SandboxReason>);
```

```rust
impl SandboxQueryAccessDecision {
    /// 构造可读取 decision；不触发 repository read/write。
    pub fn visible(
        decision_ref: ResourceRef,
        query_kind: SandboxQueryKind,
    ) -> Result<Self, ApplicationError>;

    /// 构造明确不可见 decision；不得先查目标存在性。
    pub fn not_visible(
        decision_ref: ResourceRef,
        query_kind: SandboxQueryKind,
    ) -> Result<Self, ApplicationError>;

    /// 构造可返回但有明确缺口的 read decision。
    pub fn degraded(
        decision_ref: ResourceRef,
        query_kind: SandboxQueryKind,
        markers: SandboxReasonSet,
    ) -> Result<Self, ApplicationError>;

    /// 判断是否允许进入 exact lookup。
    pub fn permits_read(&self) -> bool;

    /// 固定返回 query no-write 约束。
    pub fn requires_no_write(&self) -> bool;
}
```

| surface status | 是否可 exact read | 是否可写 | 说明 |
|---|---:|---:|---|
| `Visible` / `Empty` / `Stale` / `Degraded` | 按 query contract | 否 | 具体 view / page / marker 由 Step 8 定义。 |
| `NotVisible` / `Restricted` | 否 | 否 | 在任何 binding/index read 前返回。 |
| `MissingProjection` / `Rebuilding` / `Unavailable` | 按 query contract | 否 | 不触发 query repair、refresh 或 rebuild。 |
| `Failed` / `Disabled` | 否 | 否 | 映射 caller-safe error 或明确 disabled surface。 |

### 8.6 Application object closure

| object | fields exact | factories | member methods | state/status owner | prohibited |
|---|---:|---:|---:|---|---|
| `SandboxServiceCallContext` | 6 | 4 | 3 | `SandboxOperationChannel` | body、repo、UoW |
| `SandboxIdempotencyRecord` | 6 | 1 | 5 | shared `SandboxIdempotencyRecordStatus` | recompute duplicate |
| `SandboxStoredOperationResult` | 6 | 1 | 3 | shared `SandboxStoredOperationResultStatus` | raw/opaque result ref |
| `SandboxStoredResultSurfaceRef` | 2 private | 1 | 2 | `SandboxStoredResultKind` | DTO body、domain ref conversion |
| `SandboxApplicationError` | 4 | 4 | 2 | `ApplicationErrorKind` | raw cause/public body |
| `SandboxServiceOutcome` | 5 | 3 | 2 | `ServiceOutcomeStatus` | caller bool、implicit side effect |
| `SandboxQueryAccessDecision` | 4 | 3 | 2 | `SandboxQuerySurfaceStatus` | query-triggered write |

### 8.7 Application capability mapping

| capability | input | stable object | output | state / side effect | boundary |
|---|---|---|---|---|---|
| normalize service call | entry metadata、closed selector、digest | `SandboxServiceCallContext` | application call context | no persistence、no domain transition | entry may not bypass factory |
| reserve and replay | core idempotency key、operation、fingerprint | `SandboxIdempotencyRecord`;`SandboxStoredOperationResult` | reserved / duplicate / conflict surface | only write-capable channels reserve;duplicate is read-only | no recompute、no overwrite |
| map application failure | domain error、typed port outcome、carrier validation | `SandboxApplicationError` | caller-safe category | no raw cause propagation | public mapping belongs Step 8/12 |
| assemble service result | domain transition result、typed refs、side-effect markers | `SandboxServiceOutcome` | finite outcome + refs | UoW/relay details remain downstream | caller cannot infer missing refs |
| establish read access | actor/scope decision、projection/reference availability | `SandboxQueryAccessDecision` | exact lookup permission/surface | query write set is zero | access first, then lookup |

### 8.8 Application set carriers

The two local set carriers below are current application value objects, not generic collection aliases. They must reject duplicate entries during construction and use private storage so callers cannot append an unvalidated ref or reason.

```rust
/// application outcome 允许向下游携带的副作用引用集合。
pub struct SandboxSideEffectRefSet(Vec<SandboxObjectRef>);

/// query decision 使用的有序、去重、body-free reason 集合。
pub struct SandboxReasonSet(Vec<SandboxReason>);

impl SandboxSideEffectRefSet {
    /// 从已排序的副作用 refs 构造集合；重复或未批准 kind 必须失败。
    pub fn try_new(refs: Vec<SandboxObjectRef>) -> Result<Self, ApplicationError>;

    /// 返回稳定迭代顺序；不允许修改集合。
    pub fn as_slice(&self) -> &[SandboxObjectRef];

    /// 判断集合是否为空；不推断 outcome success。
    pub fn is_empty(&self) -> bool;
}

impl SandboxReasonSet {
    /// 从非空或允许为空的 reason 列表构造有序去重集合。
    pub fn try_new(reasons: Vec<SandboxReason>) -> Result<Self, ApplicationError>;

    /// 返回只读 reason 列表；不暴露内部可变容器。
    pub fn as_slice(&self) -> &[SandboxReason];
}
```

| carrier | accepted members | duplicate rule | empty rule | forbidden use |
|---|---|---|---|---|
| `SandboxSideEffectRefSet` | `SandboxEventRelayRecordRef`、`HandoffFactRef`、`SandboxAuditTraceRef`、`SandboxReadProjectionRef`、approved marker refs | exact generic kind + resource identity duplicate reject | accepted outcome may be empty only when no side effect is required | no artifact/tool/runtime/member refs;no string refs |
| `SandboxReasonSet` | validated `SandboxReason` values | exact reason identity duplicate reject | visible decision must be empty; degraded/unavailable must be non-empty | no raw adapter message;no request/body content |

### 8.9 Application module stop review

| review item | result | evidence in this file | unresolved consequence |
|---|---|---|---|
| every application capability has an object | pass_for_6R05_application_design | §8.7 | none |
| persisted identity uses named/core type | pass_for_6R05_application_design | §6.2、§7.1~§7.2 | Step 7 must preserve exact types |
| duplicate replay has missing-result branch | pass_for_6R05_application_design | §7.4~§7.5 | no recomputation allowed |
| query access is access-first and no-write | pass_for_6R05_application_design | §8.5 | Step 9 must assert write set `= 0` |
| public DTO schema is defined here | deferred_to_step8 | §2、§7.2、§8.3 | Step 8 must provide surface mapping before protocol implementation |
| repository / port signature is defined here | deferred_to_step7 | §2 | Step 7 must consume, not redefine, object fields |

## 9. Current canonical application contract: batch 1

本节覆盖 §6~§8 的 historical draft，是 `6R-05` application batch 1 唯一 current truth。
§9.2~§9.7声明的 Rust owner只允许位于Step 4已规划的
`crates/application/src/idempotency.rs`、`crates/application/src/services.rs`、
`crates/application/src/query_service.rs`和`crates/application/src/errors.rs`；§9.10因infra回查
新增的application port result只允许位于既有`crates/application/src/ports.rs`。不得新增
`common.rs`、`status.rs`、`types.rs`，也不得在`infra/api/worker/jobs`复制同名类型。

### 9.1 Current owner / dependency / serialization rule

| family | canonical Rust owner | serialize / persist | allowed dependencies | forbidden dependency |
|---|---|---|---|---|
| context / operation mapping | `application::services` | transient；不实现 protocol `Deserialize` | `contracts`;`core-contracts` | DTO body、route、topic、binary name、repo/UoW |
| idempotency / stored replay | `application::idempotency` | record / stored result持久化；observation transient | `contracts`;`core-contracts` | infra store type、SQL/SDK response、channel-based identity |
| service outcome | `application::services` | transient；stored surface由独立 result store持久化 | `domain`;`contracts`;`core-contracts` | protocol DTO、infra outcome、generic string ref |
| environment establishment port result | `application::ports` | transient；不持久化、不进入public DTO | `domain`;`contracts`;`core-contracts` | `infra::IsolationBackendAdapterOutcome`、provider response、直接状态转换 |
| query access decision | `application::query_service` | transient、no-write | `contracts`;`core-contracts` | writer、UoW、id generator、repair/rebuild adapter |
| application error | `application::errors` | transient；只能显式映射到 public kind | `domain`;`contracts`;`core-contracts` | `infra::InfraError`、raw cause、HTTP/SDK/SQL type |

`application` 不依赖 `infra`。infra-owned outcome 必须由实现 Step 7 的 adapter mapper穷尽映射为
application-owned port outcome或 `ApplicationErrorDetail`；raw adapter response不能出现在本节任何
field、factory或 public callable。

### 9.2 `SandboxServiceCallContext` and operation mapping

```rust
/// application service 使用的 body-free、已规范化调用语境。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct SandboxServiceCallContext {
    /// 从 closed selector 唯一映射出的 core operation name。
    operation_name: OperationName,
    /// 受信任 entry 固定的调用通道；不进入 duplicate identity。
    channel: SandboxOperationChannel,
    /// 已验证的有效 actor；正式受控执行不允许匿名语境。
    actor_ref: ActorRef,
    /// 已验证的 trace / request identity组合。
    trace_context: SandboxTraceContext,
    /// entry 对 canonical request/payload 计算并冻结的 fingerprint。
    request_digest: RequestPayloadFingerprint,
    /// write-capable channel 必填；query唯一允许 `None`。
    idempotency_key: Option<IdempotencyKey>,
}

/// application 当前接受的调用通道闭集。
#[derive(Clone, Copy, Debug, Eq, Hash, Ord, PartialEq, PartialOrd)]
pub enum SandboxOperationChannel {
    /// 同步 API command。
    ApiCommand,
    /// 同步 API query；始终 no-write。
    ApiQuery,
    /// 受信任 inbound consumer。
    Consumer,
    /// 长驻 fulfillment worker触发的 command-like use case。
    Worker,
    /// one-shot operations job。
    Job,
}
```

六个 checked factory 消费 closed selector，而不是 caller 提供的 `OperationName`。selector 与
channel 由函数签名固定，因此普通构造路径不存在 caller-selected mismatch：

```rust
impl SandboxServiceCallContext {
    /// 校验runtime提供的是non-empty core System actor；worker/job entry复用同一规则。
    pub fn validate_system_actor_ref(
        system_actor_ref: &ActorRef,
    ) -> Result<(), ApplicationError>;

    /// 从已验证 command selector和metadata构造同步写调用语境。
    pub fn from_command(
        command_kind: SandboxCommandKind,
        actor_ref: ActorRef,
        trace_context: SandboxTraceContext,
        request_digest: RequestPayloadFingerprint,
        idempotency_key: IdempotencyKey,
    ) -> Result<Self, ApplicationError>;

    /// 从已验证 query selector和metadata构造同步只读调用语境。
    pub fn from_query(
        query_kind: SandboxQueryKind,
        actor_ref: ActorRef,
        trace_context: SandboxTraceContext,
        request_digest: RequestPayloadFingerprint,
    ) -> Result<Self, ApplicationError>;

    /// 从已验证 consumer selector和dedup metadata构造异步调用语境。
    pub fn from_consumer(
        consumer_kind: SandboxConsumerKind,
        actor_ref: ActorRef,
        trace_context: SandboxTraceContext,
        request_digest: RequestPayloadFingerprint,
        idempotency_key: IdempotencyKey,
    ) -> Result<Self, ApplicationError>;

    /// 从受信任 fulfillment worker为一个 command selector构造调用语境。
    pub fn from_worker(
        command_kind: SandboxCommandKind,
        system_actor_ref: ActorRef,
        trace_context: SandboxTraceContext,
        request_digest: RequestPayloadFingerprint,
        idempotency_key: IdempotencyKey,
    ) -> Result<Self, ApplicationError>;

    /// 从受信任常驻worker为既有operations-job selector构造Worker-channel调用语境。
    pub fn from_worker_job(
        job_kind: SandboxJobKind,
        system_actor_ref: ActorRef,
        trace_context: SandboxTraceContext,
        request_digest: RequestPayloadFingerprint,
        idempotency_key: IdempotencyKey,
    ) -> Result<Self, ApplicationError>;

    /// 从已验证 operations job selector和run metadata构造调用语境。
    pub fn from_job(
        job_kind: SandboxJobKind,
        system_actor_ref: ActorRef,
        trace_context: SandboxTraceContext,
        request_digest: RequestPayloadFingerprint,
        idempotency_key: IdempotencyKey,
    ) -> Result<Self, ApplicationError>;

    /// 返回当前调用是否必须进行幂等 reservation；只有 query 为 false。
    pub fn requires_idempotency(&self) -> bool;

    /// 比较 persisted duplicate identity：operation、digest和key；故意排除channel。
    pub fn matches_duplicate_identity(&self, other: &Self) -> bool;

    /// 返回规范化 operation name。
    pub fn operation_name(&self) -> &OperationName;

    /// 返回受信任 entry channel；只用于合法性和路由审计。
    pub fn channel(&self) -> SandboxOperationChannel;

    /// 返回已验证 actor。
    pub fn actor_ref(&self) -> &ActorRef;

    /// 返回 trace context，不生成新 identity。
    pub fn trace_context(&self) -> &SandboxTraceContext;

    /// 返回已冻结 request fingerprint。
    pub fn request_digest(&self) -> &RequestPayloadFingerprint;

    /// 返回 write-capable channel的幂等 key。
    pub fn idempotency_key(&self) -> Option<&IdempotencyKey>;
}
```

factory 校验顺序固定为：selector exhaustive mapping -> channel allow-set校验 ->
`validate_system_actor_ref`或普通actor non-empty校验 -> trace checked carrier -> digest trim非空 ->
key trim非空。`from_command/from_query/from_consumer` 不要求 actor kind 为 System，但都拒绝空 actor id；
任何 factory 都不能从 display name、request body或字符串角色构造 actor。
`validate_system_actor_ref`先检查`actor_id.as_str().trim()`非空，再检查`ActorRef::is_system()`；分别返回
`ActorIdentityInvalid`与`SystemActorRequired`。它不读取role hints、display name或config，也不把System
kind当成业务授权；只确认该runtime principal可进入worker/job factory。

closed selector 到 `OperationName` 的 42 项映射固定如下；值是 application-internal stable key，
不是 HTTP route、topic或 binary name：

| selector family | selector -> exact operation name |
|---|---|
| Command | `OpenControlledExecutionContext -> sandbox.open_controlled_execution_context`;`EstablishExecutionBoundary -> sandbox.establish_execution_boundary`;`EvaluatePolicyExecution -> sandbox.evaluate_policy_execution`;`StartControlledExecutionRun -> sandbox.start_controlled_execution_run`;`RecordCaptureResult -> sandbox.record_capture_result`;`OpenMaterialHandoff -> sandbox.open_material_handoff`;`SubmitSandboxControl -> sandbox.submit_sandbox_control`;`ClassifySandboxFailure -> sandbox.classify_sandbox_failure`;`EvaluateCleanupReadiness -> sandbox.evaluate_cleanup_readiness`;`RecordRedlineContainment -> sandbox.record_redline_containment` |
| Query | `GetSandboxExecutionStatus -> sandbox.get_execution_status`;`GetBoundaryStatus -> sandbox.get_boundary_status`;`GetPolicyDecisionSummary -> sandbox.get_policy_decision_summary`;`GetCaptureSummary -> sandbox.get_capture_summary`;`GetMaterialHandoffStatus -> sandbox.get_material_handoff_status`;`GetFailureControlStatus -> sandbox.get_failure_control_status`;`GetCleanupReadiness -> sandbox.get_cleanup_readiness`;`GetRedlineContainmentStatus -> sandbox.get_redline_containment_status`;`GetSandboxReadProjection -> sandbox.get_read_projection`;`GetDerivedInspectPreviewTrend -> sandbox.get_derived_inspect_preview_trend`;`GetBackendCapabilityComparison -> sandbox.get_backend_capability_comparison`;`GetSandboxReconciliationReport -> sandbox.get_reconciliation_report`;`GetSandboxAuditTrace -> sandbox.get_audit_trace` |
| Consumer | `ConsumeCallerContextReferenceChanged -> sandbox.consume_caller_context_reference_changed`;`ConsumePolicySummaryChanged -> sandbox.consume_policy_summary_changed`;`ConsumeBackendCapabilitySummaryChanged -> sandbox.consume_backend_capability_summary_changed`;`ConsumeIsolationBackendLifecycleSignal -> sandbox.consume_isolation_backend_lifecycle_signal`;`ConsumeMaterialHandoffStatusChanged -> sandbox.consume_material_handoff_status_changed`;`ConsumeObservabilityHandoffStatusChanged -> sandbox.consume_observability_handoff_status_changed`;`ConsumeSandboxControlRequested -> sandbox.consume_control_requested`;`ConsumeInvestigationHandoffStatusChanged -> sandbox.consume_investigation_handoff_status_changed`;`ConsumeSandboxTruthRelayFeedback -> sandbox.consume_truth_relay_feedback` |
| Job | `PublishSandboxEventRelay -> sandbox.publish_event_relay`;`RefreshSandboxReferenceStates -> sandbox.refresh_reference_states`;`RefreshBackendCapabilitySummaries -> sandbox.refresh_backend_capability_summaries`;`RetryPendingMaterialHandoffs -> sandbox.retry_pending_material_handoffs`;`RunLeaseOrphanReaper -> sandbox.run_lease_orphan_reaper`;`EvaluatePendingCleanupGuards -> sandbox.evaluate_pending_cleanup_guards`;`MaintainRedlineContainmentHandoffs -> sandbox.maintain_redline_containment_handoffs`;`RebuildSandboxReadProjections -> sandbox.rebuild_read_projections`;`MaintainDerivedInspectPreviewTrend -> sandbox.maintain_derived_inspect_preview_trend`;`RunSandboxReconciliation -> sandbox.run_reconciliation` |

`Worker` 不拥有独立 selector family。当前allow-set严格为
`from_worker(StartControlledExecutionRun | RecordCaptureResult | OpenMaterialHandoff | ClassifySandboxFailure)`
与`from_worker_job(PublishSandboxEventRelay)`：前四项只承接Sandbox-owned launch boundary、body-free
capture、material handoff和failure classification application调用，不承接tools semantic execution或
runtime agent loop，也不允许worker自行决定四项调用顺序；后者
只复用relay maintenance use case，不赋予worker调用其他九类one-shot job的权限。传入其他selector返回
`ApplicationErrorDetail::ChannelMismatch`，不得由配置扩大allow-set。两条路径的channel都固定为
`Worker`。`matches_duplicate_identity` 只比较 `operation_name + request_digest + idempotency_key`；
channel不同但三者相同仍命中同一 persisted identity。channel mismatch 由 entry/factory在 reservation
前拒绝，不得通过把 channel写进 unique key建立第二个可执行 record。

### 9.3 `SandboxIdempotencyRecord` and operation observation

```rust
/// 一次 operation 的持久幂等 reservation及其唯一 replay linkage。
#[derive(Clone, Debug, Eq, PartialEq, Serialize)]
pub struct SandboxIdempotencyRecord {
    /// record 的 named repository identity。
    idempotency_ref: SandboxIdempotencyRecordRef,
    /// duplicate identity维度一：规范 operation name。
    operation_name: OperationName,
    /// duplicate identity维度二：首次受理时冻结的 request fingerprint。
    request_digest: RequestPayloadFingerprint,
    /// duplicate identity维度三：首次受理的 idempotency key。
    idempotency_key: IdempotencyKey,
    /// persisted lifecycle；只允许 Reserved、Completed、Failed。
    record_status: SandboxIdempotencyRecordStatus,
    /// Completed 时 exactly-one，其余状态必须 None。
    stored_result_ref: Option<SandboxStoredOperationResultRef>,
    /// reservation 使用的正式 clock 时间。
    reserved_at: Timestamp,
    /// Completed/Failed 的正式 terminal 时间；Reserved 必须 None且不得早于reserved_at。
    terminal_at: Option<Timestamp>,
}

/// reservation/read 对既有 record 的瞬时观察；不是 persisted state。
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum SandboxIdempotencyObservation {
    /// 当前调用获得唯一 mutation ownership。
    Reserved(SandboxIdempotencyRecord),
    /// 相同 identity命中 completed record及其完整 stored result。
    Duplicate(SandboxStoredOperationResult),
    /// 相同 identity仍由首个调用执行；当前调用不得重入。
    InFlight(SandboxIdempotencyRecordRef),
    /// 同一 operation/key命中不同 digest，或恢复检查发现identity冲突。
    Conflict(SandboxApplicationError),
    /// 相同 identity命中 terminal failed record；必须使用新key或人工恢复。
    FailedTerminal(SandboxIdempotencyRecordRef),
}

#[derive(Deserialize)]
#[serde(deny_unknown_fields)]
struct SandboxIdempotencyRecordWire {
    idempotency_ref: SandboxIdempotencyRecordRef,
    operation_name: OperationName,
    request_digest: RequestPayloadFingerprint,
    idempotency_key: IdempotencyKey,
    record_status: SandboxIdempotencyRecordStatus,
    stored_result_ref: Option<SandboxStoredOperationResultRef>,
    reserved_at: Timestamp,
    terminal_at: Option<Timestamp>,
}

impl<'de> Deserialize<'de> for SandboxIdempotencyRecord {
    fn deserialize<D>(deserializer: D) -> Result<Self, D::Error>
    where
        D: serde::Deserializer<'de>,
    {
        let wire = SandboxIdempotencyRecordWire::deserialize(deserializer)?;
        let record = Self {
            idempotency_ref: wire.idempotency_ref,
            operation_name: wire.operation_name,
            request_digest: wire.request_digest,
            idempotency_key: wire.idempotency_key,
            record_status: wire.record_status,
            stored_result_ref: wire.stored_result_ref,
            reserved_at: wire.reserved_at,
            terminal_at: wire.terminal_at,
        };
        record
            .validate_state_shape()
            .map_err(|_| serde::de::Error::custom("invalid sandbox idempotency record"))?;
        Ok(record)
    }
}
```

`SandboxIdempotencyRecordWire` 只负责字段解码，不是第二个domain/application object。
`deny_unknown_fields`拒绝未纳入当前schema的持久化字段；反序列化必须调用同一
`validate_state_shape`，且固定错误文本不得回显key、digest、ref或时间值。durable adapter不得
直接写private fields。exact callable：

```rust
impl SandboxIdempotencyRecord {
    /// 从 write-capable context和正式 clock建立 Reserved record。
    pub fn reserve(
        idempotency_ref: SandboxIdempotencyRecordRef,
        context: &SandboxServiceCallContext,
        reserved_at: Timestamp,
    ) -> Result<Self, ApplicationError>;

    /// 校验 persisted duplicate identity；不比较channel、actor、trace或时间。
    pub fn matches_request(&self, context: &SandboxServiceCallContext) -> bool;

    /// 仅从 Reserved 链接已持久化 stored result并进入 Completed。
    pub fn mark_completed(
        &mut self,
        stored_result: &SandboxStoredOperationResult,
        terminal_at: Timestamp,
    ) -> Result<(), ApplicationError>;

    /// 仅从 Reserved 进入 Failed；不得保留stored result linkage。
    pub fn mark_failed(&mut self, terminal_at: Timestamp) -> Result<(), ApplicationError>;

    /// 验证状态、linkage和时间shape，供constructor与deserialize共用。
    pub fn validate_state_shape(&self) -> Result<(), ApplicationError>;

    /// 返回当前 record能否沿exact stored ref进入replay lookup。
    pub fn can_lookup_replay(&self) -> bool;
}
```

| persisted status | stored result | terminal time | allowed operation | forbidden observation-as-state |
|---|---|---|---|---|
| `Reserved` | `None` | `None` | `mark_completed` / `mark_failed` | 不写 `Duplicate` / `InFlight` |
| `Completed` | `Some(exact)` | `Some(>= reserved_at)` | read-only replay lookup | 不改写为 `Duplicate` / `Conflict` |
| `Failed` | `None` | `Some(>= reserved_at)` | read-only terminal observation | 不改写为 `Completed` 或复用key |

`mark_completed` 必须校验 stored result 的 operation与record一致；stored result必须已经在同一
UoW staged/saved，具体顺序由 Step 7/11重验。`reserve` 对 query返回
`ApplicationErrorDetail::IdempotencyKeyForbidden`；对 write-capable context缺key返回
`IdempotencyKeyMissing`。repository reserve 的 unique identity和冲突读取面必须在 Step 7/11/13
按本节重验，不能继续使用 historical `(operation_name, channel, key)`。

### 9.4 `SandboxStoredOperationResult` and surface reference

```rust
/// stored result 指向的完整 public surface闭集；query不参与幂等回放。
#[derive(Clone, Copy, Debug, Eq, Hash, Ord, PartialEq, PartialOrd, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum SandboxStoredResultKind {
    /// 完整 command result surface。
    CommandResult,
    /// 完整 consumer receipt surface。
    ConsumerReceipt,
    /// 完整 operations job report surface。
    JobReport,
}

/// application result store生成的 non-empty typed surface identity。
#[derive(Clone, Debug, Eq, Hash, Ord, PartialEq, PartialOrd, Serialize)]
pub struct SandboxStoredResultSurfaceRef {
    /// surface类别；与stored result `result_kind`必须一致。
    kind: SandboxStoredResultKind,
    /// result store生成的opaque non-empty identity。
    resource_ref: ResourceRef,
}

/// immutable replay carrier；只保存完整surface identity，不保存DTO body。
#[derive(Clone, Debug, Eq, PartialEq, Serialize)]
pub struct SandboxStoredOperationResult {
    /// stored carrier的named repository identity。
    stored_result_ref: SandboxStoredOperationResultRef,
    /// 与idempotency record一致的规范operation name。
    operation_name: OperationName,
    /// surface闭集类别。
    result_kind: SandboxStoredResultKind,
    /// 与result_kind一致的完整surface identity。
    surface_ref: SandboxStoredResultSurfaceRef,
    /// 只允许Completed、Rejected、Failed；三者均可完整replay。
    result_status: SandboxStoredOperationResultStatus,
    /// result surface被冻结的正式clock时间。
    recorded_at: Timestamp,
}

#[derive(Deserialize)]
#[serde(deny_unknown_fields)]
struct SandboxStoredResultSurfaceRefWire {
    kind: SandboxStoredResultKind,
    resource_ref: ResourceRef,
}

impl<'de> Deserialize<'de> for SandboxStoredResultSurfaceRef {
    fn deserialize<D>(deserializer: D) -> Result<Self, D::Error>
    where
        D: serde::Deserializer<'de>,
    {
        let wire = SandboxStoredResultSurfaceRefWire::deserialize(deserializer)?;
        Self::try_new(wire.kind, wire.resource_ref).map_err(|_| {
            serde::de::Error::custom("invalid sandbox stored result surface ref")
        })
    }
}

#[derive(Deserialize)]
#[serde(deny_unknown_fields)]
struct SandboxStoredOperationResultWire {
    stored_result_ref: SandboxStoredOperationResultRef,
    operation_name: OperationName,
    result_kind: SandboxStoredResultKind,
    surface_ref: SandboxStoredResultSurfaceRef,
    result_status: SandboxStoredOperationResultStatus,
    recorded_at: Timestamp,
}

impl<'de> Deserialize<'de> for SandboxStoredOperationResult {
    fn deserialize<D>(deserializer: D) -> Result<Self, D::Error>
    where
        D: serde::Deserializer<'de>,
    {
        let wire = SandboxStoredOperationResultWire::deserialize(deserializer)?;
        Self::try_new(
            wire.stored_result_ref,
            wire.operation_name,
            wire.result_kind,
            wire.surface_ref,
            wire.result_status,
            wire.recorded_at,
        )
        .map_err(|_| serde::de::Error::custom("invalid sandbox stored operation result"))
    }
}
```

两个persisted类型都必须自定义checked `Deserialize`；surface ref也必须通过checked newtype
反序列化。两个private `*Wire`只解码字段，拒绝unknown field，并分别回到`try_new`执行同一
不变量校验；固定serde错误不得回显surface identity、operation或adapter内容。
`SandboxStoredResultSurfaceRef::try_new` 拒绝
`resource_ref.as_str().trim().is_empty()`，错误detail为 `StoredResultSurfaceRefEmpty`；不实现
`From<ResourceRef>`，不转为 `SandboxObjectRef`，不从 operation/trace/time/ref文本推导kind。

```rust
impl SandboxStoredResultSurfaceRef {
    /// 从result store生成的non-empty identity构造typed surface ref。
    pub fn try_new(
        kind: SandboxStoredResultKind,
        resource_ref: ResourceRef,
    ) -> Result<Self, ApplicationError>;

    /// 返回surface kind。
    pub fn kind(&self) -> SandboxStoredResultKind;

    /// 返回opaque result-store identity；不得解析其文本。
    pub fn resource_ref(&self) -> &ResourceRef;
}

impl SandboxStoredOperationResult {
    /// 从已冻结的完整surface构造immutable replay carrier。
    pub fn try_new(
        stored_result_ref: SandboxStoredOperationResultRef,
        operation_name: OperationName,
        result_kind: SandboxStoredResultKind,
        surface_ref: SandboxStoredResultSurfaceRef,
        result_status: SandboxStoredOperationResultStatus,
        recorded_at: Timestamp,
    ) -> Result<Self, ApplicationError>;

    /// 校验operation、kind、surface和status shape，供constructor/deserialize共用。
    pub fn validate_state_shape(&self) -> Result<(), ApplicationError>;

    /// 判断该surface是否可作为duplicate replay；合法实例恒为true。
    pub fn is_replayable(&self) -> bool;

    /// 校验该stored result是否服务指定operation。
    pub fn matches_operation(&self, operation_name: &OperationName) -> bool;

    /// 返回与idempotency record一致的规范operation name。
    pub fn operation_name(&self) -> &OperationName;

    /// 返回stored carrier自身的named repository identity。
    pub fn stored_result_ref(&self) -> &SandboxStoredOperationResultRef;

    /// 返回完整stored surface的closed kind。
    pub fn result_kind(&self) -> SandboxStoredResultKind;

    /// 返回persisted stored-result status。
    pub fn result_status(&self) -> SandboxStoredOperationResultStatus;

    /// 返回surface被冻结的正式clock时间。
    pub fn recorded_at(&self) -> &Timestamp;

    /// 返回唯一public surface identity。
    pub fn surface_ref(&self) -> &SandboxStoredResultSurfaceRef;

    /// 校验该carrier是指定command的完整surface；kind或operation不一致均拒绝。
    pub fn validate_for_command(
        &self,
        command_kind: SandboxCommandKind,
    ) -> Result<(), ApplicationError>;

    /// 校验该carrier是指定consumer的完整receipt surface。
    pub fn validate_for_consumer(
        &self,
        consumer_kind: SandboxConsumerKind,
    ) -> Result<(), ApplicationError>;

    /// 校验该carrier是指定operations job的完整report surface。
    pub fn validate_for_job(
        &self,
        job_kind: SandboxJobKind,
    ) -> Result<(), ApplicationError>;
}
```

| invariant | exact rule | failure detail |
|---|---|---|
| non-empty surface | `resource_ref.trim()`非空 | `StoredResultSurfaceRefEmpty` |
| kind relation | `surface_ref.kind == result_kind` | `StoredResultKindMismatch` |
| replay status | status仅`Completed/Rejected/Failed`且surface始终存在 | `StoredResultStatusSurfaceMismatch` |
| operation relation | completion record与stored result operation exact equal | `StoredResultOperationMismatch` |
| lookup missing/wrong/invisible | 不构造 `Unavailable` row；返回错误且不重算 | `StoredResultUnavailable` -> public `DuplicateMissingResult` |

三个`validate_for_*`先检查固定surface kind，再复用§9.2唯一selector-to-operation mapping比较
`operation_name`。kind不一致返回`StoredResultKindMismatch`，同kind但selector operation不一致返回
`StoredResultOperationMismatch`；禁止在API、worker或jobs复制operation字符串表。它们不读取surface
正文、repository或current truth，也不把stored status映射为public status。

Step 8 可为三种 public surface定义不同 DTO/newtype，但必须提供
`DTO typed ref -> SandboxStoredResultSurfaceRef` 的穷尽 checked mapping；不得把本类型改回
`ResourceRef`或在duplicate path读取current truth重建旧结果。

### 9.5 `SandboxApplicationError` hierarchy

application error 使用三层封闭结构：`ApplicationErrorDetail` 保存 exact branch，
`ApplicationErrorKind` 保存稳定内部类别，`SandboxPublicErrorKind` 是跨协议 caller-safe 映射。
error object 不保存 raw cause，也不保存可与其他字段矛盾的 caller-supplied kind / retryable bool。

```rust
/// application 内部稳定错误类别；每项均有唯一 public mapping。
#[derive(Clone, Copy, Debug, Eq, Hash, Ord, PartialEq, PartialOrd)]
pub enum ApplicationErrorKind {
    /// 输入、调用语境或内部carrier shape无效。
    Validation,
    /// 必需external/reference/projection当前不可解析。
    ReferenceUnresolved,
    /// 检测到禁止进入Sandbox的外部正文。
    ForbiddenExternalBody,
    /// actor无权执行当前操作。
    NotAuthorized,
    /// query不得暴露目标存在性。
    NotVisible,
    /// optimistic version或in-flight ownership冲突。
    VersionConflict,
    /// idempotency key绑定了不同request identity。
    IdempotencyConflict,
    /// completed duplicate缺少完整stored result。
    DuplicateMissingResult,
    /// coherent boundary不满足或不受支持。
    BoundaryRejected,
    /// policy/authorization必须fail closed。
    PolicyFailClosed,
    /// 必需application port当前不可用。
    PortUnavailable,
    /// inbound schema或persisted compatibility version不支持。
    UnsupportedVersion,
    /// inbound source/material必须隔离处置。
    Quarantined,
    /// 当前surface/adapter被validated config禁用。
    Disabled,
    /// read-only path试图写入或触发repair。
    NoWriteViolation,
    /// 已脱敏但无法安全降为业务类别的内部不变量失败。
    Internal,
}

/// application exact error branch；variant不得携带raw value、body或adapter response。
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum ApplicationErrorDetail {
    /// closed selector与稳定operation-name表不一致。
    InvalidOperationMapping,
    /// entry channel与被调用surface不一致。
    ChannelMismatch,
    /// actor identity为空或不满足当前entry要求。
    ActorIdentityInvalid,
    /// worker/job factory没有收到system-owned actor。
    SystemActorRequired,
    /// trace/request identity carrier不合法。
    TraceContextInvalid,
    /// request fingerprint为空或与entry冻结值不一致。
    RequestDigestInvalid,
    /// write-capable调用缺少idempotency key。
    IdempotencyKeyMissing,
    /// query携带了不允许的idempotency key。
    IdempotencyKeyForbidden,
    /// same operation/key绑定了不同request fingerprint。
    IdempotencyConflict,
    /// same identity仍由首个reservation执行。
    IdempotencyInFlight,
    /// same identity命中terminal failed record。
    IdempotencyFailedTerminal,
    /// Completed record没有exact stored-result linkage。
    StoredResultLinkMissing,
    /// result-store surface identity为空。
    StoredResultSurfaceRefEmpty,
    /// stored result kind与surface ref kind不一致。
    StoredResultKindMismatch,
    /// stored status与mandatory surface shape不一致。
    StoredResultStatusSurfaceMismatch,
    /// record与stored result的operation不一致。
    StoredResultOperationMismatch,
    /// duplicate lookup缺失、wrong-kind、不可见或损坏。
    StoredResultUnavailable,
    /// application object收到不允许的状态迁移。
    InvalidStatusTransition,
    /// truth ref set违反closed-union、duplicate或identity规则。
    TruthRefSetInvalid,
    /// side-effect set违反kind、顺序、duplicate或identity规则。
    SideEffectRefSetInvalid,
    /// reason set为空、重复或与状态约束不一致。
    ReasonSetInvalid,
    /// application service outcome或port result字段与其finite分支矩阵不一致。
    OutcomeShapeInvalid,
    /// maintenance result set违反typed duplicate或cross-variant identity规则。
    MaintenanceResultSetInvalid,
    /// maintenance job kind与target union关系不一致。
    MaintenanceTargetKindMismatch,
    /// maintenance item status、result refs与reason shape不一致。
    MaintenanceItemShapeInvalid,
    /// maintenance batch的job kind、page token、item顺序或continuation shape不一致。
    MaintenanceBatchShapeInvalid,
    /// access status、reason或call-context binding不一致。
    QueryAccessShapeInvalid,
    /// required external/source/reference当前不可解析。
    ReferenceUnresolved,
    /// external body越过body-free边界。
    ForbiddenExternalBody,
    /// actor/scope/authority不允许当前操作。
    NotAuthorized,
    /// query不得暴露目标存在性。
    NotVisible,
    /// repository expected version不匹配。
    VersionConflict,
    /// access通过后必需projection仍不存在；优先形成query surface而非错误。
    ProjectionMissing,
    /// coherent boundary被拒绝、不支持或无法验证。
    BoundaryRejected,
    /// policy/authorization缺失、过期、冲突或拒绝。
    PolicyFailClosed,
    /// typed application port报告当前不可用。
    PortUnavailable,
    /// validated config禁用了所需port/surface。
    PortDisabled,
    /// schema或compatibility version不受支持。
    UnsupportedVersion,
    /// source/schema/material要求隔离。
    Quarantined,
    /// query/read-only wiring试图写入、refresh、repair或rebuild。
    NoWriteViolation,
    /// 内部不变量失败且没有更窄安全类别。
    InternalInvariantViolation,
}

/// application 在进入protocol/entry mapper前使用的body-free error对象。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct SandboxApplicationError {
    /// 唯一 exact branch；kind和retryable均从此穷尽派生。
    detail: ApplicationErrorDetail,
    /// 已脱敏、非空且不含raw cause的稳定理由。
    reason: SandboxReason,
    /// 可选trace identity；不保存span/log正文。
    trace_context: Option<SandboxTraceContext>,
}

/// application module唯一result error类型。
pub type ApplicationError = SandboxApplicationError;
```

```rust
impl SandboxApplicationError {
    /// 从exact detail和safe reason构造错误；不得传入raw cause Display。
    pub fn from_detail(
        detail: ApplicationErrorDetail,
        reason: SandboxReason,
        trace_context: Option<SandboxTraceContext>,
    ) -> Self;

    /// 返回exact application branch。
    pub fn detail(&self) -> &ApplicationErrorDetail;

    /// 从detail穷尽派生稳定internal kind。
    pub fn kind(&self) -> ApplicationErrorKind;

    /// 将internal kind穷尽映射为caller-safe public kind。
    pub fn to_public_error_kind(&self) -> SandboxPublicErrorKind;

    /// 从detail派生是否允许在条件变化后重试。
    pub fn is_retryable(&self) -> bool;

    /// 返回safe reason。
    pub fn reason(&self) -> &SandboxReason;

    /// 返回可选trace，不生成新trace。
    pub fn trace_context(&self) -> Option<&SandboxTraceContext>;
}
```

detail到kind/public/retry的穷尽分组如下；实现必须逐variant match，不能写 `_` arm：

| details | application kind | public kind | retryable |
|---|---|---|---:|
| `ActorIdentityInvalid`;`TraceContextInvalid`;`RequestDigestInvalid`;`IdempotencyKeyMissing`;`IdempotencyKeyForbidden` | `Validation` | `Validation` | false |
| `InvalidOperationMapping`;`StoredResultSurfaceRefEmpty`;`StoredResultKindMismatch`;`StoredResultStatusSurfaceMismatch`;`StoredResultOperationMismatch`;`TruthRefSetInvalid`;`SideEffectRefSetInvalid`;`ReasonSetInvalid`;`OutcomeShapeInvalid`;`MaintenanceResultSetInvalid`;`MaintenanceTargetKindMismatch`;`MaintenanceItemShapeInvalid`;`MaintenanceBatchShapeInvalid`;`QueryAccessShapeInvalid` | `Internal` | `Internal` | false |
| `InvalidStatusTransition` | `Validation` | `Validation` | false |
| `ChannelMismatch` | `Validation` | `Validation` | false |
| `SystemActorRequired` | `NotAuthorized` | `NotAuthorized` | false |
| `ReferenceUnresolved`;`ProjectionMissing` | `ReferenceUnresolved` | `ReferenceUnresolved` | true |
| `ForbiddenExternalBody` | `ForbiddenExternalBody` | `ForbiddenExternalBody` | false |
| `NotAuthorized` | `NotAuthorized` | `NotAuthorized` | false |
| `NotVisible` | `NotVisible` | `NotVisible` | false |
| `VersionConflict`;`IdempotencyInFlight` | `VersionConflict` | `VersionConflict` | true |
| `IdempotencyConflict`;`IdempotencyFailedTerminal` | `IdempotencyConflict` | `IdempotencyConflict` | false |
| `StoredResultLinkMissing`;`StoredResultUnavailable` | `DuplicateMissingResult` | `DuplicateMissingResult` | false |
| `BoundaryRejected` | `BoundaryRejected` | `BoundaryRejected` | false |
| `PolicyFailClosed` | `PolicyFailClosed` | `PolicyFailClosed` | false |
| `PortUnavailable` | `PortUnavailable` | `AdapterUnavailable` | true |
| `UnsupportedVersion` | `UnsupportedVersion` | `UnsupportedVersion` | false |
| `Quarantined` | `Quarantined` | `Quarantined` | false |
| `PortDisabled` | `Disabled` | `Disabled` | false |
| `NoWriteViolation` | `NoWriteViolation` | `NoWriteViolation` | false |
| `InternalInvariantViolation` | `Internal` | `Internal` | false |

本批不定义不存在的泛化 `DomainError` union，也不允许 `from_domain(Box<dyn Error>)`。Step 7
必须对每个实际被service callable消费的 object-owned error enum提供独立、穷尽的 mapper，例如
`map_control_fact_error(ControlFactError)`；每个 mapper只能构造本节已有detail，不能解析
`Display`、reason文本或写wildcard arm。该 source-to-detail coverage由 `6R-06` 对 Step 7
consumer inventory做差集审计。infra到application的映射由后续`6R-05` infra batch定义，且同样
只能构造本节已有detail。

### 9.6 `SandboxServiceOutcome` and closed side-effect set

```rust
/// application service outcome闭集；不是persisted domain state。
#[derive(Clone, Copy, Debug, Eq, Hash, Ord, PartialEq, PartialOrd)]
pub enum ServiceOutcomeStatus {
    /// write-capable use case已在当前UoW staged规定truth和完整stored result并要求commit。
    Accepted,
    /// 请求被明示拒绝，未提交success truth，但拒绝surface可replay。
    Rejected,
    /// 结果诚实保留缺口，完整degraded surface可replay。
    Degraded,
    /// 调用被完整处理且surface可replay，但没有形成新的Sandbox truth。
    NoChange,
    /// query/read-only调用没有任何写副作用。
    NoWrite,
    /// caller-safe failed surface已形成，但没有success truth。
    Failed,
    /// duplicate只引用既有stored result，不产生新业务副作用。
    DuplicateReplayed,
}

/// application outcome允许携带的side-effect family顺序。
#[derive(Clone, Copy, Debug, Eq, Hash, Ord, PartialEq, PartialOrd)]
pub enum SandboxSideEffectKind {
    /// 显式material handoff fact。
    MaterialHandoff,
    /// append-only audit trace。
    AuditTrace,
    /// append-only outbound relay record。
    EventRelay,
    /// 已创建或标记stale的read projection identity。
    Projection,
}

/// application outcome可携带的typed side-effect identity闭集。
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum SandboxSideEffectRef {
    /// handoff side effect；不表示downstream accepted。
    MaterialHandoff(HandoffFactRef),
    /// audit side effect。
    AuditTrace(SandboxAuditTraceRef),
    /// event relay side effect；不表示published。
    EventRelay(SandboxEventRelayRecordRef),
    /// projection side effect；不表示fresh。
    Projection(SandboxReadProjectionRef),
}

impl SandboxSideEffectRef {
    /// 返回closed family kind。
    pub fn kind(&self) -> SandboxSideEffectKind;

    /// 仅用于set identity collision检查；不得用于generic repository read。
    pub fn as_object_ref(&self) -> SandboxObjectRef;
}

/// 按canonical family顺序保存的ordered-unique side-effect set。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct SandboxSideEffectRefSet(Vec<SandboxSideEffectRef>);

impl SandboxSideEffectRefSet {
    /// 构造空side-effect set。
    pub fn empty() -> Self;

    /// 校验closed kind、canonical family order、duplicate和cross-kind identity collision。
    pub fn try_new(refs: Vec<SandboxSideEffectRef>) -> Result<Self, ApplicationError>;

    /// 返回稳定顺序；caller不能修改集合。
    pub fn as_slice(&self) -> &[SandboxSideEffectRef];

    /// 判断集合为空。
    pub fn is_empty(&self) -> bool;

    /// 判断是否只包含audit refs；用于Rejected/Failed shape校验。
    pub fn contains_only_audit(&self) -> bool;
}

/// application service在entry/protocol mapping前返回的稳定结果carrier。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct SandboxServiceOutcome {
    /// transient finite status。
    outcome_status: ServiceOutcomeStatus,
    /// 已在当前UoW staged、等待commit的Sandbox truth；不含projection/audit/relay/stored-result identity。
    truth_refs: SandboxTruthRefSet,
    /// write-capable/replay outcome的完整body-free stored carrier；NoWrite必须None。
    stored_result: Option<SandboxStoredOperationResult>,
    /// 本次调用新形成的closed side effects；duplicate/no-write必须空。
    side_effect_refs: SandboxSideEffectRefSet,
    /// degraded/rejected/failed的non-empty safe reasons；success/replay必须空。
    reasons: SandboxReasonSet,
}
```

side-effect canonical family order固定为
`MaterialHandoff < AuditTrace < EventRelay < Projection`。constructor不排序、不去重：family
逆序返回 `SideEffectRefSetInvalid`；同variant duplicate或不同variant复用同一底层
`ResourceRef`也返回该detail。同family内保留service assembly提供的因果顺序。不存在
`approved marker refs`、`String`、generic `SandboxObjectRef`或artifact/tool/runtime/member variant。

```rust
impl SandboxServiceOutcome {
    /// 构造已提交truth和完整stored result的accepted outcome。
    pub fn accepted(
        truth_refs: SandboxTruthRefSet,
        stored_result: SandboxStoredOperationResult,
        side_effect_refs: SandboxSideEffectRefSet,
    ) -> Result<Self, ApplicationError>;

    /// 构造无success truth、但完整拒绝surface可replay的outcome。
    pub fn rejected(
        stored_result: SandboxStoredOperationResult,
        side_effect_refs: SandboxSideEffectRefSet,
        reasons: SandboxReasonSet,
    ) -> Result<Self, ApplicationError>;

    /// 构造诚实保留缺口且完整surface可replay的outcome。
    pub fn degraded(
        truth_refs: SandboxTruthRefSet,
        stored_result: SandboxStoredOperationResult,
        side_effect_refs: SandboxSideEffectRefSet,
        reasons: SandboxReasonSet,
    ) -> Result<Self, ApplicationError>;

    /// 构造无新Sandbox truth/side-effect但完整surface可replay的outcome。
    pub fn no_change(
        stored_result: SandboxStoredOperationResult,
        side_effect_refs: SandboxSideEffectRefSet,
        reasons: SandboxReasonSet,
    ) -> Result<Self, ApplicationError>;

    /// 构造严格no-write outcome；所有ref/reason set均由factory置空。
    pub fn no_write() -> Self;

    /// 构造无success truth、但完整failed surface可replay的outcome。
    pub fn failed(
        stored_result: SandboxStoredOperationResult,
        side_effect_refs: SandboxSideEffectRefSet,
        reasons: SandboxReasonSet,
    ) -> Result<Self, ApplicationError>;

    /// 从既有stored result构造纯replay outcome；不复制旧truth或side effects。
    pub fn duplicate_replayed(stored_result: SandboxStoredOperationResult) -> Self;

    /// 按下表验证全部字段，供factory和内部mapper共用。
    pub fn validate_shape(&self) -> Result<(), ApplicationError>;

    /// 判断本outcome是否要求提交当前UoW。
    pub fn requires_commit(&self) -> bool;

    /// 判断本outcome是否要求创建新的stored result。
    pub fn requires_new_stored_result(&self) -> bool;

    /// 判断本outcome是否只允许读取既有stored result。
    pub fn is_replay_only(&self) -> bool;

    /// 返回完整body-free stored carrier，供entry mapper读取kind/surface/status。
    pub fn stored_result(&self) -> Option<&SandboxStoredOperationResult>;

    /// 返回本次application调用的finite outcome status。
    pub fn outcome_status(&self) -> ServiceOutcomeStatus;

    /// 返回已staged并随当前UoW提交的完整truth ref set。
    pub fn truth_refs(&self) -> &SandboxTruthRefSet;

    /// 返回本次调用形成的完整side-effect ref set。
    pub fn side_effect_refs(&self) -> &SandboxSideEffectRefSet;

    /// 返回与outcome shape一致的safe reason set。
    pub fn reasons(&self) -> &SandboxReasonSet;

    /// 将全部字段移交给同层entry mapper，不丢失任何集合或stored carrier。
    pub fn into_parts(
        self,
    ) -> (
        ServiceOutcomeStatus,
        SandboxTruthRefSet,
        Option<SandboxStoredOperationResult>,
        SandboxSideEffectRefSet,
        SandboxReasonSet,
    );
}
```

| status | truth refs | stored result | side effects | reasons | commit/new stored |
|---|---|---|---|---|---|
| `Accepted` | non-empty | exactly one；status=`Completed` | closed set；可空仅当Step 9该flow明示无side effect | empty | true / true |
| `Rejected` | empty | exactly one；status=`Rejected` | empty或audit-only | non-empty | true / true |
| `Degraded` | empty或non-empty，不能据空推导无truth | exactly one；status=`Completed` | closed set | non-empty | true / true |
| `NoChange` | empty | exactly one；status=`Completed` | empty或audit-only | 可空；有guard/no-op原因时non-empty | true / true |
| `NoWrite` | empty | none | empty | empty | false / false |
| `Failed` | empty | exactly one；status=`Failed` | empty或audit-only | non-empty | true / true |
| `DuplicateReplayed` | empty | exactly one existing ref | empty | empty | false / false |

`Accepted` 的flow-specific required audit/relay/projection集合仍由回归 Step 9逐flow验证；本对象只允许
闭集且禁止伪造。known domain failure若已形成正式 failure truth，应返回 `Accepted/Degraded`并把
failure ref放入truth set；`Failed` 只表示没有success truth但可重放的caller-safe失败surface。
technical failure在完整surface形成前返回 `Err(ApplicationError)`，不能构造缺stored result的
`Failed`。

`NoChange`专门闭合“已处理但当前finalization没有新Sandbox truth”的可重放结果：consumer `NoOp`、
operations job report-only completion / `Skipped`以及由guard决定不推进的command `Pending`可映射到该分支。它仍需提交完整stored surface
与idempotency completion，因此不同于query-only `NoWrite`；它不得携带projection、relay或handoff
side effect，audit-only仅在Step 9对应flow明确要求时允许。report-only completion允许empty reasons；
guard/no-op/skip若有业务原因必须原样保留，factory不生成占位reason。

### 9.7 `SandboxQueryAccessDecision` and reason set

```rust
/// exact target lookup之前的access-first decision闭集。
#[derive(Clone, Copy, Debug, Eq, Hash, Ord, PartialEq, PartialOrd)]
pub enum SandboxQueryAccessStatus {
    /// 允许按Step 7 exact reader读取完整安全surface。
    Permitted,
    /// 只允许读取已授权的redacted/restricted projection。
    Restricted,
    /// 不允许读取，也不得探测目标是否存在。
    NotVisible,
    /// access authority/dependency不可用；不得降级为allow。
    Unavailable,
}

/// 按mapper因果顺序保存的ordered-unique safe reason集合。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct SandboxReasonSet(Vec<SandboxReason>);

impl SandboxReasonSet {
    /// 构造明确空集合；只允许success/not-visible等factory按矩阵使用。
    pub fn empty() -> Self;

    /// 构造non-empty集合；exact duplicate必须拒绝且不自动排序/去重。
    pub fn try_non_empty(reasons: Vec<SandboxReason>) -> Result<Self, ApplicationError>;

    /// 返回mapper提供的稳定因果顺序。
    pub fn as_slice(&self) -> &[SandboxReason];

    /// 判断集合为空。
    pub fn is_empty(&self) -> bool;
}

/// 绑定actor、query selector和request digest的no-write access decision。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct SandboxQueryAccessDecision {
    /// closed query selector。
    query_kind: SandboxQueryKind,
    /// 作出decision时的有效actor；不得从display name恢复。
    actor_ref: ActorRef,
    /// 与当前query input绑定的frozen fingerprint。
    request_digest: RequestPayloadFingerprint,
    /// access-only status；不表达Empty/Stale/Degraded等最终surface状态。
    access_status: SandboxQueryAccessStatus,
    /// Restricted/Unavailable的non-empty safe reasons；Permitted/NotVisible为空。
    reasons: SandboxReasonSet,
}
```

```rust
impl SandboxQueryAccessDecision {
    /// 构造允许完整exact read的decision。
    pub fn permitted(
        query_kind: SandboxQueryKind,
        context: &SandboxServiceCallContext,
    ) -> Result<Self, ApplicationError>;

    /// 构造只允许restricted projection read的decision。
    pub fn restricted(
        query_kind: SandboxQueryKind,
        context: &SandboxServiceCallContext,
        reasons: SandboxReasonSet,
    ) -> Result<Self, ApplicationError>;

    /// 构造不暴露存在性的decision；reason固定为空。
    pub fn not_visible(
        query_kind: SandboxQueryKind,
        context: &SandboxServiceCallContext,
    ) -> Result<Self, ApplicationError>;

    /// 构造access dependency不可用的fail-closed decision。
    pub fn unavailable(
        query_kind: SandboxQueryKind,
        context: &SandboxServiceCallContext,
        reasons: SandboxReasonSet,
    ) -> Result<Self, ApplicationError>;

    /// 校验context必须为ApiQuery、operation映射一致且actor/digest exact match。
    pub fn matches_context(&self, context: &SandboxServiceCallContext) -> bool;

    /// 仅Permitted允许完整exact read。
    pub fn permits_full_read(&self) -> bool;

    /// Permitted/Restricted允许各自已授权reader；其余返回false。
    pub fn permits_authorized_read(&self) -> bool;

    /// 固定返回true；decision不能授予任何write能力。
    pub fn requires_no_write(&self) -> bool;
}
```

| access status | reason rule | repository call | allowed final `SandboxQuerySurfaceStatus` |
|---|---|---|---|
| `Permitted` | empty | exact full reader only | `Visible`;`Empty`;`Stale`;`Degraded`;`Rebuilding`;`MissingProjection`;`Unavailable`;`Failed`;`Disabled` |
| `Restricted` | non-empty | restricted/redacted projection reader only | `Restricted`;若dependency失败可`Unavailable/Failed/Disabled`，不得返回full `Visible` |
| `NotVisible` | empty，避免泄露目标/规则 | zero target/index/body read | `NotVisible` only |
| `Unavailable` | non-empty safe dependency reason | zero target/index/body read | `Unavailable` only |

`Empty`、`Stale`、`Degraded`、`Rebuilding`、`MissingProjection`、`Failed`和`Disabled` 都是
access decision之后的最终query surface，不是access status；不得为它们增加access factory。
`NotVisible/Unavailable` 必须在任何目标存在性、binding、index或body read之前返回。query path
不得创建UoW、id、stale marker、refresh、rebuild、handoff、cleanup或release action；违反时返回
`NoWriteViolation`并阻断结果。

### 9.8 Application batch 1 static closure audit

| audit ID | current check | result | design evidence / downstream obligation |
|---|---|---|---|
| `6R05-AUD-APP-001` | canonical application type owner唯一 | pass_for_design | §9.1与§9.10；5个已规划source file，未新增module |
| `6R05-AUD-APP-002` | context factory与channel闭合 | pass_for_design | batch 1当时5/5 factory；batch 3新增`from_worker_job`后current为6/6；42/42 selector mapping明确 |
| `6R05-AUD-APP-003` | duplicate identity字段 | pass_for_design | operation + digest + key；channel/actor/trace/time均排除 |
| `6R05-AUD-APP-004` | persisted status与operation observation分离 | pass_for_design | record 3-state；stored result 3-state；observation 5-branch transient |
| `6R05-AUD-APP-005` | stored replay surface完整性 | pass_for_design | 3/3 checked `Deserialize`骨架；unknown field拒绝；non-empty ref、kind/status/operation relation、missing不重算 |
| `6R05-AUD-APP-006` | application error owner / mapping | pass_for_design | batch 1 historical为37/37；batch 3新增4项maintenance detail后current为41/41 exact once；detail -> kind -> public kind exhaustive |
| `6R05-AUD-APP-007` | service outcome shape | pass_for_design | current 7 status-specific factories + exact field matrix；无第二outcome identity；完整stored carrier规则明确 |
| `6R05-AUD-APP-008` | side-effect / reason set闭集 | pass_for_design | 4 typed side-effect variants；无approved-marker/open generic ref；empty/non-empty和顺序明确 |
| `6R05-AUD-APP-009` | query access/final surface分层 | pass_for_design | 4 access status；11 final surface status不反写access；actor/digest binding |
| `6R05-AUD-APP-010` | dependency direction | pass_for_design | application只依赖domain/contracts/core；`InfraError`/SDK response public field为0 |

以下是已识别的 downstream revalidation，不在本批跨步修改：

| historical consumer | conflict | required revalidation |
|---|---|---|
| Step 7 idempotency repository | `SandboxOpaqueRef`、`SandboxOperationName`、channel-based key、旧reservation enum | 使用named refs、core operation/key、§9.3 observation；unique identity不含channel |
| Step 7 id generator | `next_service_outcome_ref -> SandboxOpaqueRef` | 删除该第二身份；result/public-surface identity只由`SandboxStoredResultSurfaceRef`拥有，query access不调用id generator |
| Step 8 stored result DTO | `created_at/request_digest`与current carrier字段不对称 | 逐字段重验；surface kind一选一且完整，不得从current truth重建 |
| Step 9 duplicate pseudo-code | 旧error factory接收conflict error对象、旧`from_stored_result`签名 | 消费`SandboxIdempotencyObservation`和`duplicate_replayed` exact factory |
| Step 9 query pseudo-code | `visible(ctx.actor_context())`缺decision ref/query kind/digest binding | 改用§9.7 factory；access first、write set zero |
| Step 10 state matrix | 持久化`Duplicate/Conflict/Unavailable`、generic `Domain/Validation/Internal`占位 | 只保留3+3 persisted state；observation不入状态机；绑定exact error detail |
| Step 11 persistence | unique `(operation,channel,key)`、record缺时间、stored result字段不对称 | unique identity按§9.3；增加reserved/terminal时间；immutable surface按§9.4 |
| Step 13 idempotency | channel被定义为key维度 | 改为入口合法性；duplicate identity固定operation/digest/key |

本批未执行Rust编译、lint、测试、数据库迁移或运行验证；上表的 `pass_for_design` 只表示当前
设计文本字段、factory、closed enum和mapping差集为0。未发现新的L1/L2上游blocker；
`BLK-SBX-CANONICAL-001`、`BLK-SBX-VERSION-001` 仍是既有implementation gate。

### 9.9 Batch gate and next action

```text
current_document = 03-详细设计.md
current_step = Step 6 regression / 6R-05
current_batch = 6R-05 batch 1 application context / replay
current_module = application
batch_status = completed_wait_user_review
gate_status = completed_wait_user_review
next_allowed_action = wait_user_review_before_6R_05_batch_2_infra
formal_03_status = historical_reviewed_invalidated_by_design_reopen
implementation = CB-SBX-01A blocked / wait_design
real_test_execution = not_started
real_evidence_created = no
commit_required = no
```

---

## Historical-Position Foundation: `7R-06C-2` JobsError 16-variant activation

> 本节完整定义C-2 JobsError 16项foundation。由于同批activation继续追加到物理EOF，本节不单独充当current authority；
> 恢复时以本文最后一个`EOF Current Owner Amendment`对本节的明确采纳为准。

### 11.29 Current `JobsError` shape

```rust
/// Jobs crate在one-shot input、fresh accumulator和report source边界使用的body-free有限错误。
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum JobsError {
    /// application checked factory、maintenance callable或finalizer返回的稳定错误。
    Application(ApplicationError),
    /// public job input在application调用前不满足最小结构要求。
    InvalidJobInput {
        /// jobs boundary形成的安全理由。
        reason: SandboxReason,
        /// metadata已验证时继承的trace。
        trace_context: Option<SandboxTraceContext>,
    },
    /// public job schema或version不受支持。
    UnsupportedVersion {
        /// 不含raw input或version body的安全理由。
        reason: SandboxReason,
        /// metadata已验证时继承的trace。
        trace_context: Option<SandboxTraceContext>,
    },
    /// validated runtime明确禁用当前one-shot job entry。
    DisabledJob {
        /// 被禁用的closed job selector。
        job_kind: SandboxJobKind,
        /// validated config mapper提供且不含raw config的安全理由。
        reason: SandboxReason,
        /// metadata已验证时继承的trace。
        trace_context: Option<SandboxTraceContext>,
    },
    /// job input试图携带Sandbox禁止保存的外部正文。
    ForbiddenExternalBody {
        /// body-exclusion guard形成的安全理由。
        reason: SandboxReason,
        /// metadata已验证时继承的trace。
        trace_context: Option<SandboxTraceContext>,
    },
    /// runner文件固定kind与public job input kind不一致。
    RunnerJobKindMismatch {
        /// runner文件编译期固定kind。
        expected: SandboxJobKind,
        /// public input声明的kind。
        actual: SandboxJobKind,
    },
    /// fresh accumulator与application batch的job kind不一致。
    AccumulatorJobKindMismatch {
        /// accumulator固定kind。
        expected: SandboxJobKind,
        /// batch实际kind。
        actual: SandboxJobKind,
    },
    /// application batch input token不等于fresh accumulator期望token。
    AccumulatorPageTokenMismatch {
        /// 当前closed job selector；不保存token原文。
        job_kind: SandboxJobKind,
    },
    /// 同一exact target identity跨fresh batch重复出现。
    AccumulatorDuplicateTarget {
        /// 当前closed job selector；不保存target ref文本。
        job_kind: SandboxJobKind,
    },
    /// selection已耗尽后仍试图记录新fresh batch。
    AccumulatorAlreadyExhausted {
        /// 当前closed job selector。
        job_kind: SandboxJobKind,
    },
    /// 完整fresh batch序列的item数量无法安全表示为public report计数。
    ItemCountOverflow {
        /// 当前closed job selector。
        job_kind: SandboxJobKind,
    },
    /// fresh report finalization发生在selection明确耗尽之前。
    AccumulatorNotExhausted {
        /// 当前closed job selector。
        job_kind: SandboxJobKind,
    },
    /// fresh或duplicate report source缺少required stored job report relation。
    StoredResultMissing {
        /// application返回的finite outcome status。
        outcome_status: ServiceOutcomeStatus,
    },
    /// report source的stored surface不是JobReport。
    StoredResultKindMismatch {
        /// 实际closed stored surface kind。
        actual: SandboxStoredResultKind,
    },
    /// report source、public report status、outcome与stored status关系不一致。
    ReportStatusRelationMismatch {
        /// requested public report status。
        report_status: SandboxJobReportStatus,
        /// application finite outcome status。
        outcome_status: ServiceOutcomeStatus,
        /// persisted stored-result status。
        stored_status: SandboxStoredOperationResultStatus,
    },
    /// application finalized或stored report time早于同一report的run start time。
    CompletionTimeBeforeStart {
        /// 当前closed job selector。
        job_kind: SandboxJobKind,
    },
}

impl JobsError {
    /// 穷尽映射caller-safe public error kind；不得使用wildcard arm。
    pub fn to_public_error_kind(&self) -> SandboxPublicErrorKind;

    /// 返回条件变化后是否允许由外层job scheduler重新调度。
    pub fn is_retryable(&self) -> bool;

    /// 返回body-free safe reason；relation缺陷使用固定ASCII template。
    pub fn safe_reason(&self) -> SandboxReason;

    /// 返回已验证trace；没有可信trace的jobs-local缺陷返回None。
    pub fn trace_context(&self) -> Option<&SandboxTraceContext>;

    /// 穷尽派生一次one-shot job entry处置；不返回process exit code。
    pub fn entry_disposition(&self) -> EntryDisposition;
}

impl From<ApplicationError> for JobsError {
    /// 只移动并包装application error，不重分类、解析reason或保存Display文本。
    fn from(error: ApplicationError) -> Self;
}
```

### 11.30 Current 16/16 accessor and disposition matrix

| # | `JobsError` variant | public kind | retryable | safe reason source | entry disposition |
|---:|---|---|---:|---|---|
| 1 | `Application(error)` | delegate | delegate | checked clone of `error.reason()` | 逐16个`ApplicationErrorKind`映射 |
| 2 | `InvalidJobInput` | `Validation` | false | variant reason | `Rejected` |
| 3 | `UnsupportedVersion` | `UnsupportedVersion` | false | variant reason | `Rejected` |
| 4 | `DisabledJob` | `Disabled` | false | variant reason | `Skipped` |
| 5 | `ForbiddenExternalBody` | `ForbiddenExternalBody` | false | variant reason | `Rejected` |
| 6 | `RunnerJobKindMismatch` | `Validation` | false | fixed runner-kind template | `Rejected` |
| 7 | `AccumulatorJobKindMismatch` | `Internal` | false | fixed accumulator-kind template | `Failed` |
| 8 | `AccumulatorPageTokenMismatch` | `Internal` | false | fixed continuation template | `Failed` |
| 9 | `AccumulatorDuplicateTarget` | `Internal` | false | fixed duplicate-target template | `Failed` |
| 10 | `AccumulatorAlreadyExhausted` | `Internal` | false | fixed exhausted template | `Failed` |
| 11 | `ItemCountOverflow` | `Internal` | false | fixed count-overflow template | `Failed` |
| 12 | `AccumulatorNotExhausted` | `Internal` | false | fixed not-exhausted template | `Failed` |
| 13 | `StoredResultMissing` | `Internal` | false | fixed stored-result template | `Failed` |
| 14 | `StoredResultKindMismatch` | `Internal` | false | fixed stored-kind template | `Failed` |
| 15 | `ReportStatusRelationMismatch` | `Internal` | false | fixed report-relation template | `Failed` |
| 16 | `CompletionTimeBeforeStart` | `Internal` | false | fixed report-time template | `Failed` |

`Application(error)`的Jobs处置必须对16个kind显式匹配：九个明确拒绝kind映射`Rejected`，`Disabled`映射`Skipped`，
`ReferenceUnresolved | VersionConflict | PortUnavailable`映射`Delayed`，三个完整性kind映射`Failed`。不能按
`is_retryable()`、public kind、report status或process code反推。

### 11.31 Reason, trace and source boundaries

| boundary | current rule |
|---|---|
| trace-bearing branches | `Application`委托原error；四个input/config variant可继承已验证trace |
| no-trace local branches | `RunnerJobKindMismatch`及十个relation/accumulator variant固定返回None，不临时生成trace |
| local retry | 15个local variant全部false；只有`Application`可能委托出true |
| report time | `CompletionTimeBeforeStart`只检查application finalized/stored report time与report run start；不读取post-result entry clock |
| duplicate | duplicate不构造accumulator；缺surface或关系错误复用stored/report variant，不恢复replay-only error |
| safe reason | fixed template不得插值token、target、ref、path、raw config、body、process output或stack |
| conversion | 只允许`From<ApplicationError>`；禁止`From<InfraError/WorkerError/Box<dyn Error>>` |
| process policy | exit code、scheduler retry/backoff和telemetry action继续由Step 9/12消费typed error后定义 |

```text
current_document = 03-详细设计.md
current_step = Step 7 regression / 7R-06
current_sub_batch = 7R-06C-2 JobsError current 16 owner activated
artifact = 03_ddd_step_06_object_contracts_application_infra_entry.md
artifact_content_status = completed
artifact_review_status = consumed_by_entry_16_mapping_static_audit_pending
current_authority = physical_eof_7r_06c_2_jobs_error_16_owner_amendment
jobs_error_variant_count = 16
removed_variant = AccumulatorReplayOnly
local_retryable_variants = 0/15
local_trace_bearing_variants = 4/15
process_exit_code = undefined_deferred
new_public_dto = 0
new_error_variant = 0
new_l1_l2_blocker = 0
next_allowed_action = run_c2_forward_reverse_and_mechanical_audit
formal_03_writeback = forbidden
implementation = not_started
real_test_execution = not_started
real_evidence_created = no
acceptance_signoff = no
commit_required = no
```

---

## Historical-Position Foundation: `7R-06C-1C-R` Jobs finalization ownership repair

> 本节因历史状态锚点命中文件中段，只保留owner契约foundation；它本身不改变current authority。只有物理EOF的同批
> activation显式采纳后，下列Step 6 Jobs/Worker契约才生效。前部
> §§11.16~11.17的`Clone`、`fresh_report_status()`、自由`report_status/outcome/finished_at`参数，以及
> `7R-06C-1B-R`中Worker复制status后调用`finish`的口径，在冲突处降为`historical_material`。本节不改变正式
> `03-详细设计.md`，也不创建实现、测试或运行事实。

### 11.20 本批输入、诊断与取舍

| SOP项目 | current回答 |
|---|---|
| 上游输入 | Step 6 §§11.15~11.17；Step 7 §§20.2~20.3、40.5~40.7；C-1C entry ownership proof。 |
| 精确问题 | 唯一`Vec<SandboxMaintenanceBatchOutcome>`不能同时按值进入application report draft，又保留在Jobs accumulator供exit/report mapper读取。 |
| 禁止修复 | clone完整chain、从counter/cursor/current truth重建、把Jobs accumulator传入application、让entry自由传status/time、增加第二public DTO。 |
| 选择 | application finalizer借用caller唯一batch slice并返回application-only typed completion witness；borrow结束后Jobs/Worker消费witness，Jobs再move原accumulator。 |
| 未选择 | finalizer消费后返还chain。该方案会新增更重的owned handoff，并迫使application暂时拥有Jobs仍需持有的chain。 |

`FinalizeSandboxJobReportInput<'a>`与store的borrowed write source只在一次await future内借用slice。service trait method的future
生命周期绑定到`'a`，不得要求input为`'static`、不得spawn/detach该future、不得把borrow保存进application state或UoW外逃。
若具体async trait宏不能表达该lifetime，implementation必须使用等价的显式`BoxFuture<'a, ...>`签名；不得因此恢复owned
`Vec`或clone。

### 11.21 `SandboxJobReportAccumulator` current shape

```rust
/// Jobs entry内唯一拥有完整application batch chain的线性accumulator。
#[derive(Debug, Eq, PartialEq)]
pub struct SandboxJobReportAccumulator {
    job_kind: SandboxJobKind,
    job_run_id: JobRunId,
    started_at: Timestamp,
    batches: Vec<SandboxMaintenanceBatchOutcome>,
    replay_only: bool,
    exhausted: bool,
}

impl SandboxJobReportAccumulator {
    fn from_run_context(run_context: &SandboxJobRunContext) -> Self;
    fn for_duplicate_replay(run_context: &SandboxJobRunContext) -> Self;

    pub fn record_batch(
        &mut self,
        batch: SandboxMaintenanceBatchOutcome,
    ) -> Result<(), JobsError>;

    pub fn job_kind(&self) -> SandboxJobKind;
    pub fn job_run_id(&self) -> &JobRunId;
    pub fn started_at(&self) -> &Timestamp;
    pub fn batches(&self) -> &[SandboxMaintenanceBatchOutcome];
    pub fn expected_page_token(&self) -> Option<&PageToken>;
    pub fn item_count(&self) -> Result<u64, JobsError>;
    pub fn is_exhausted(&self) -> bool;
    pub fn is_replay_only(&self) -> bool;
}
```

current delta固定为：

1. 不实现`Clone`；完整batch chain的owned instance始终恰为一个。
2. 删除`fresh_report_status()`；status唯一由application `FinalizeSandboxJobReportInput::try_new`派生。
3. `batches()`只允许借用给finalizer或在finalizer完成后供Step 8 mapper读取，不提供`to_vec/into_batches/replace_batches`。
4. `item_count()`只作entry/report mapper的checked机械字段，不参与status/outcome推导。
5. duplicate仍使用replay-only空accumulator；它不进入borrowed finalizer。

### 11.22 Application-only fresh completion witness

```rust
/// application在report surface、generic carrier和idempotency completion同一UoW提交后返回的fresh证明。
///
/// 字段私有；只有application finalizer能构造。本类型不进入contracts、wire、repository或持久化schema。
#[derive(Debug)]
pub struct SandboxFinalizedJobReport {
    job_kind: SandboxJobKind,
    original_job_run_id: JobRunId,
    report_status: SandboxJobReportStatus,
    outcome: SandboxServiceOutcome,
    report_recorded_at: Timestamp,
}

impl SandboxFinalizedJobReport {
    pub fn job_kind(&self) -> SandboxJobKind;
    pub fn original_job_run_id(&self) -> &JobRunId;
    pub fn report_status(&self) -> SandboxJobReportStatus;
    pub fn outcome(&self) -> &SandboxServiceOutcome;
    /// application UoW中同时作为report finished/recorded和idempotency terminal time的唯一值。
    pub fn report_recorded_at(&self) -> &Timestamp;

    pub fn into_parts(
        self,
    ) -> (
        SandboxJobKind,
        JobRunId,
        SandboxJobReportStatus,
        SandboxServiceOutcome,
        Timestamp,
    );
}
```

该witness不是第43个callable output DTO，也不是第二report truth。它只携带已提交stored surface的typed provenance，使entry
不能将一个caller选择的`SandboxJobReportStatus`与任意`SandboxServiceOutcome`拼接。constructor为application module-private，
固定校验job kind/run id与finalizer input一致、status为五个fresh variant、outcome/stored kind/status/operation矩阵一致，且
`report_recorded_at >= permit.started_at`。`DuplicateReplayed`不构造该witness，仍走exact stored replay分支。

### 11.23 Jobs与Worker current completion constructors

```rust
impl SandboxJobExitDisposition {
    /// 消费唯一accumulator与application fresh completion witness。
    pub fn finish_fresh(
        accumulator: SandboxJobReportAccumulator,
        completion: SandboxFinalizedJobReport,
        entry_completed_at: Timestamp,
    ) -> Result<Self, JobsError>;

    /// duplicate只消费exact stored replay outcome，不伪造fresh witness。
    pub fn duplicate_replayed(
        run_context: &SandboxJobRunContext,
        final_outcome: SandboxServiceOutcome,
        entry_completed_at: Timestamp,
    ) -> Result<Self, JobsError>;
}

impl SandboxRelayLoopResult {
    /// Worker relay fresh路径消费同一个application fresh completion witness。
    pub fn finish_fresh(
        run_context: SandboxWorkerRunContext,
        completion: SandboxFinalizedJobReport,
        entry_completed_at: Timestamp,
    ) -> Result<Self, WorkerError>;

    /// Worker relay duplicate路径固定使用DuplicateReplayed，不接收caller status。
    pub fn duplicate_replayed(
        run_context: SandboxWorkerRunContext,
        final_outcome: SandboxServiceOutcome,
        entry_completed_at: Timestamp,
    ) -> Result<Self, WorkerError>;
}
```

`finish_fresh`先验证accumulator/Worker expected kind与witness kind，再验证Jobs的run id、accumulator exhausted且非replay-only、
`entry_completed_at >= completion.report_recorded_at >= started_at`，最后从witness整体move `report_status/outcome`。它不重新遍历
items派生status；Jobs只允许按status穷尽映射`EntryDisposition`。Worker的expected kind固定为
`PublishSandboxEventRelay`，并校验outcome stored report；它不依赖Jobs crate。

`SandboxJobExitDisposition`与`SandboxRelayLoopResult`字段中的原`finished_at`重命名为`entry_completed_at`，accessor同步为
`entry_completed_at()`。该时间只表示finalizer返回后entry完成组装的时间，不进入public/stored JobReport，不覆盖application
UoW持有的`report_recorded_at`。Step 8 fresh report mapper的report `finished_at/recorded_at`只读witness/outcome对应的stored
surface；duplicate mapper只读原stored surface。process exit code继续未定义。

### 11.24 Ownership与authority证明

```text
Jobs accumulator owns one Vec<Batch>
  -> FinalizeSandboxJobReportInput<'a> borrows accumulator.batches()
  -> application validates and stages complete report by borrowed iteration
  -> application commits typed surface + carrier + idempotency completion
  -> returns SandboxFinalizedJobReport; future and borrow end
  -> Jobs moves original accumulator + witness into SandboxJobExitDisposition
```

| audit | current result |
|---|---:|
| owned complete batch chains during fresh finalization | `1` |
| complete-chain clone/rebuild | `0 / 0` |
| Jobs status derivation callable | `0` |
| caller-supplied fresh status/outcome/time tuple | `0` |
| application report/status constructor owner | `1` |
| new public DTO / route / job kind / logical callable | `0 / 0 / 0 / 0` |
| Worker -> Jobs dependency | `0` |
| process exit code definition | `0`，继续后移Step 9/12 |
| new L1/L2 blocker | `0` |

```text
current_document = 03-详细设计.md
current_step = Step 7 regression / 7R-06
current_sub_batch = 7R-06C-1C-R Step 6 Jobs/Worker owner contract foundation drafted
artifact = 03_ddd_step_06_object_contracts_application_infra_entry.md
artifact_content_status = drafted_pending_eof_activation
artifact_review_status = not_current_until_eof_activation
jobs_batch_owner_count = 1
jobs_fresh_status_deriver_count = 0
application_completion_witness_count = 1
new_public_dto = 0
new_application_callable = 0
new_l1_l2_blocker = 0
next_allowed_action = update_step7_finalizer_and_typed_store_borrowed_write_contract
formal_03_writeback = forbidden
implementation = not_started
real_test_execution = not_started
real_evidence_created = no
acceptance_signoff = no
commit_required = no
```

用户确认本批后，下一批只读取本节、shared types §8.6/§12.8/§13、Step 4/5 infra owner、
historical Step 7/9/10 infra consumers和正式 `04` 的validated config binding，随后闭合
`SandboxRuntimeConfigSummary`、`AdapterAvailabilityState`、三个adapter outcome及`InfraError`。
不得在同一确认中自动进入API/worker/jobs或`6R-06`。

上述§9.9代码块与下一批说明保留application batch 1完成时的历史停点，不再表示current recovery；
该说明是进入infra batch 2时的历史override；current批次和下一动作只以§11.19.8为准。

### 9.10 Infra batch discovery: application-owned establishment port result

infra outcome回查暴露出一个必须在Step 6闭合的依赖缺口：historical Step 7让application-owned
`IsolationBackendPort`直接返回`infra::IsolationBackendAdapterOutcome`，违反
`application !-> infra`；若只改成`Result<IsolationEnvironmentDescriptor, ApplicationError>`，又会
丢失backend明确unsupported/unavailable以及failed-with-partial-environment的cleanup obligation。

本节只回开这一项application owner，不改§9.2~§9.7已确认契约。result是一次port call的transient
carrier，不持久化、不进入public DTO、不增加shared lifecycle status，也不直接生成boundary status。

```rust
/// application port可消费的isolation environment establishment有限结果类别。
#[derive(Clone, Copy, Debug, Eq, PartialEq)]
pub enum IsolationEnvironmentEstablishmentDisposition {
    /// backend已返回可验证descriptor与lease window。
    Established,
    /// backend明确报告当前要求不受支持；不等于domain capability decision。
    BackendUnsupported,
    /// backend建立失败，可能留下必须cleanup的partial environment。
    Failed,
    /// backend在确认没有已建立environment的前提下当前不可用。
    Unavailable,
}

/// isolation backend port返回的body-free、exact-correlated application carrier。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct IsolationEnvironmentEstablishmentResult {
    /// result唯一对应的accepted context。
    context_ref: ControlledExecutionContextRef,
    /// result唯一对应的active environment identity。
    environment_identity_ref: ExecutionEnvironmentIdentityRef,
    /// 本attempt预生成的coherent boundary identity。
    boundary_ref: CoherentBoundaryRef,
    /// backend必须落实的immutable requirement set。
    requirement_ref: BoundaryRequirementSetRef,
    /// call前已通过guard的capability snapshot。
    capability_ref: BackendCapabilitySummaryRef,
    /// requirement、capability、descriptor共用的runtime generation。
    generation_ref: ResourceRef,
    /// transient finite result status。
    disposition: IsolationEnvironmentEstablishmentDisposition,
    /// Established必填；Failed仅在provider留下stable partial environment时存在。
    environment_descriptor: Option<IsolationEnvironmentDescriptor>,
    /// 与descriptor成对出现的validated lease window。
    lease_window: Option<LeaseWindow>,
    /// 非Established必填的caller-safe reason。
    reason: Option<SandboxReason>,
    /// concrete adapter完成typed mapping的application clock time。
    observed_at: Timestamp,
}
```

```rust
impl IsolationEnvironmentEstablishmentResult {
    /// concrete adapter从已闭合infra outcome映射Established result。
    pub fn established_from_port(
        context_ref: ControlledExecutionContextRef,
        environment_identity_ref: ExecutionEnvironmentIdentityRef,
        boundary_ref: CoherentBoundaryRef,
        requirement_ref: BoundaryRequirementSetRef,
        capability_ref: BackendCapabilitySummaryRef,
        generation_ref: ResourceRef,
        environment_descriptor: IsolationEnvironmentDescriptor,
        lease_window: LeaseWindow,
        observed_at: Timestamp,
    ) -> Result<Self, ApplicationError>;

    /// concrete adapter映射backend的explicit unsupported observation。
    pub fn backend_unsupported_from_port(
        context_ref: ControlledExecutionContextRef,
        environment_identity_ref: ExecutionEnvironmentIdentityRef,
        boundary_ref: CoherentBoundaryRef,
        requirement_ref: BoundaryRequirementSetRef,
        capability_ref: BackendCapabilitySummaryRef,
        generation_ref: ResourceRef,
        reason: SandboxReason,
        observed_at: Timestamp,
    ) -> Result<Self, ApplicationError>;

    /// concrete adapter映射failed result；partial descriptor/window必须both-or-neither。
    pub fn failed_from_port(
        context_ref: ControlledExecutionContextRef,
        environment_identity_ref: ExecutionEnvironmentIdentityRef,
        boundary_ref: CoherentBoundaryRef,
        requirement_ref: BoundaryRequirementSetRef,
        capability_ref: BackendCapabilitySummaryRef,
        generation_ref: ResourceRef,
        partial_environment_descriptor: Option<IsolationEnvironmentDescriptor>,
        partial_lease_window: Option<LeaseWindow>,
        reason: SandboxReason,
        observed_at: Timestamp,
    ) -> Result<Self, ApplicationError>;

    /// concrete adapter仅在typed provider result证明未建立environment时映射Unavailable。
    pub fn unavailable_from_port(
        context_ref: ControlledExecutionContextRef,
        environment_identity_ref: ExecutionEnvironmentIdentityRef,
        boundary_ref: CoherentBoundaryRef,
        requirement_ref: BoundaryRequirementSetRef,
        capability_ref: BackendCapabilitySummaryRef,
        generation_ref: ResourceRef,
        reason: SandboxReason,
        observed_at: Timestamp,
    ) -> Result<Self, ApplicationError>;

    /// 重验result与本次loaded objects和预生成boundary ref完全匹配。
    pub fn matches_attempt(
        &self,
        context: &ControlledExecutionContext,
        identity: &ExecutionEnvironmentIdentity,
        boundary_ref: &CoherentBoundaryRef,
        requirements: &BoundaryRequirementSet,
        capability: &BackendCapabilitySummary,
    ) -> bool;

    /// 返回finite result status；caller仍须按完整字段矩阵分支。
    pub fn disposition(&self) -> IsolationEnvironmentEstablishmentDisposition;
    /// 返回body-free descriptor或partial descriptor。
    pub fn environment_descriptor(&self) -> Option<&IsolationEnvironmentDescriptor>;
    /// 返回与descriptor成对的lease window。
    pub fn lease_window(&self) -> Option<&LeaseWindow>;
    /// 返回non-established safe reason。
    pub fn reason(&self) -> Option<&SandboxReason>;
    /// 返回本attempt runtime generation。
    pub fn generation_ref(&self) -> &ResourceRef;
    /// 返回typed mapping observation time。
    pub fn observed_at(&self) -> &Timestamp;
}
```

result matrix固定如下：

| disposition | descriptor / lease | reason | application后续动作 |
|---|---|---|---|
| `Established` | both `Some` | `None` | 先重验correlation，再创建`Created` handle；domain factory决定能否Established |
| `BackendUnsupported` | both `None` | `Some` | 记录capability contradiction并走failed/refresh路径；不得直接伪造domain `Unsupported` |
| `Failed` | both `Some`或both `None` | `Some` | 有partial时创建`Created` cleanup handle；均形成failed decision，不得launch |
| `Unavailable` | both `None` | `Some` | 形成failed/unavailable application surface；不得创建handle或弱backend fallback |

`matches_attempt`逐项比较context、identity、boundary、requirement、capability与generation；descriptor存在
时还要求其generation相等。factory拒绝descriptor/window半对、空reason、Established带reason、其他
status带environment以及无效observed time。它没有`to_boundary_status`方法；domain
`BoundaryEstablishmentDecision`和`IsolationEnvironmentHandle`仍是唯一状态裁定者。

该delta使Step 7可以将port返回类型改为
`ApplicationResult<IsolationEnvironmentEstablishmentResult>`，而concrete infra adapter内部继续先用
§10.6 outcome分类provider结果。run launch和release仍分别返回既有
`ControlledRunLifecycleObservation`与`IsolationEnvironmentLifecycleObservation`，不得复用本result。

---

## 10. Current canonical infra contract: batch 2

### 10.1 Owner、依赖方向与生命周期边界

本节是 `crates/infra` 对象的唯一 current contract。所有类型均为 infra-local technical carrier，
不进入 public DTO，不成为 Sandbox domain truth，也不允许 `application` trait 在签名中引用。

```text
infra/config.rs
  -> validated snapshot identity + redacted activation binding summaries
  -> SandboxRuntimeConfigSummary::from_validated_snapshot(...)       [LD-17]

infra/runtime_builder.rs
  -> exact 18-slot binding set
  -> exact 18-slot availability set                                  [LD-21]
  -> SandboxRuntimeConfigSummary::evaluate_disposition(...)          [LD-22]
  -> complete unpublished service / entry set                        [LD-23]
  -> atomic generation publication                                   [LD-24]

concrete adapter mapper
  -> infra-private typed outcome
  -> existing domain observation factory
  -> application/domain owner validates relation and changes state
```

四个阶段不得折叠：LD-17 只证明 ordinary config 已验证并建立 builder-local summary；LD-21 只
证明 activation plan 中 18 个逻辑 slot 均有 matching availability；LD-22 才把 summary 从
`Valid`裁定为`Valid | Degraded | StartupBlocked`；LD-24 再独立校验 complete same-generation set并
原子发布。`RuntimeConfigStatus::Valid`不表示 generation 已发布，`Degraded`也不允许缺 required slot。

依赖规则固定如下：

| producer / consumer | 允许依赖 | 禁止依赖 |
|---|---|---|
| config loader / validator | core `ResourceRef`、`Timestamp`、shared status/reason；infra-local types | domain object、application service、raw config向下泄漏 |
| runtime builder | validated snapshot、binding / availability set、concrete adapter | 从 endpoint/topic/path文本推导slot；partial generation publication |
| concrete adapter mapper | provider result、exact call correlation、infra outcome | public DTO、application trait返回infra type、持久化domain status |
| application/domain consumer | existing typed observation / object-owned error | `infra::*Outcome`、raw SDK/SQL/IO error、provider code/string parser |

`SandboxAdapterKind`只表达 logical runtime slot，不表达 telemetry sink、audit hook、diagnostic
surface、entry binding、service或业务 guard。truth store和audit repository共享同一 truth-UoW slot；
业务 policy decision、cleanup guard、redline containment始终由既有domain owner负责。

### 10.2 Typed config identity 与 redacted binding marker

三个 ref 是 infra-local checked identity。它们不加入 shared named object registry，不转换为
`SandboxObjectRef`，也不提供从裸字符串或任意 `ResourceRef` 的 unchecked `From`。

```rust
use core_contracts::metadata::{ResourceRef, Timestamp};
use serde::{Deserialize, Serialize};

/// 标识已通过 V01~V07 的 runtime profile，不包含profile正文或配置值。
#[derive(Clone, Debug, Eq, Hash, Ord, PartialEq, PartialOrd, Serialize)]
#[serde(transparent)]
pub struct SandboxRuntimeProfileRef(ResourceRef);

/// 标识 FZ-02 validated ordinary snapshot，不是已发布generation identity。
#[derive(Clone, Debug, Eq, Hash, Ord, PartialEq, PartialOrd, Serialize)]
#[serde(transparent)]
pub struct SandboxInfraConfigRef(ResourceRef);

/// 标识registry为一个logical slot生成的redacted binding identity。
#[derive(Clone, Debug, Eq, Hash, Ord, PartialEq, PartialOrd, Serialize)]
#[serde(transparent)]
pub struct SandboxAdapterBindingMarkerRef(ResourceRef);

impl SandboxRuntimeProfileRef {
    /// 从validated profile registry输出构造non-empty typed identity。
    pub fn try_from_validated_registry(value: ResourceRef) -> Result<Self, InfraError>;
    /// 返回opaque identity；不得解析profile名称或级别。
    pub fn as_resource_ref(&self) -> &ResourceRef;
}

impl SandboxInfraConfigRef {
    /// 从LD-16生成的redacted config identity构造typed FZ-02 identity。
    pub fn try_from_validated_snapshot(value: ResourceRef) -> Result<Self, InfraError>;
    /// 返回opaque identity；不得据此查回raw candidate。
    pub fn as_resource_ref(&self) -> &ResourceRef;
}

impl SandboxAdapterBindingMarkerRef {
    /// 从validated registry输出构造body-free binding marker。
    pub fn try_from_validated_registry(value: ResourceRef) -> Result<Self, InfraError>;
    /// 返回opaque marker；不得将其当endpoint、topic、path或credential locator。
    pub fn as_resource_ref(&self) -> &ResourceRef;
}
```

三者必须实现 checked `Deserialize`：private wire 只解码 `ResourceRef`，再调用同一 constructor；
固定 serde 错误只能分别为 `invalid sandbox runtime profile reference`、
`invalid sandbox infra config reference`、`invalid sandbox adapter binding marker reference`，不得回显
实际值。任一 `ResourceRef::as_str().trim()` 为空时返回 `InfraError::ConfigIdentityInvalid` 或
`InfraError::BindingMarkerInvalid`，不得生成默认 ref。

### 10.3 Adapter kind、activation 与 binding summary set

```rust
/// runtime builder必须机械覆盖的18个logical slot。
#[derive(Clone, Copy, Debug, Eq, Hash, Ord, PartialEq, PartialOrd, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum SandboxAdapterKind {
    /// truth repository、append-only audit与同一UoW。
    TruthStore,
    /// read projection repository。
    ProjectionStore,
    /// derived / reconciliation repository。
    DerivedStore,
    /// body-free reference state repository。
    ReferenceStore,
    /// outbound relay record与payload snapshot repository。
    RelayStore,
    /// idempotency、stored result、receipt与report repository。
    ReplayStore,
    /// caller context body-free resolver。
    ContextResolver,
    /// external policy summary resolver；不拥有policy truth。
    PolicySummary,
    /// backend capability summary adapter。
    BackendCapability,
    /// isolation environment establish/run/release backend。
    IsolationBackend,
    /// controlled execution capture adapter。
    ExecutionCapture,
    /// artifact/runtime/runner material handoff adapter family。
    MaterialHandoff,
    /// observability material handoff adapter。
    ObservabilityHandoff,
    /// investigation / containment handoff adapter。
    InvestigationHandoff,
    /// frozen outbound relay payload publisher。
    EventPublisher,
    /// cleanup-authorized backend release capability。
    BackendRelease,
    /// canonical application clock。
    Clock,
    /// typed identity generator。
    IdGenerator,
}

/// validated activation plan对一个logical slot的唯一处置。
#[derive(Clone, Copy, Debug, Eq, Hash, Ord, PartialEq, PartialOrd)]
pub enum SandboxAdapterActivationKind {
    /// generation完整性所必需；不可用必须阻断发布。
    Required,
    /// validated plan显式禁用；不得构造或调用provider。
    Disabled,
}

/// 一个logical slot的redacted、generation前binding摘要。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct SandboxAdapterBindingSummary {
    /// logical slot闭集。
    adapter_kind: SandboxAdapterKind,
    /// activation plan的required/disabled裁定。
    activation_kind: SandboxAdapterActivationKind,
    /// registry生成的opaque redacted marker。
    binding_marker_ref: SandboxAdapterBindingMarkerRef,
}

/// 保持canonical kind顺序且恰好覆盖18个slot的binding set。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct SandboxAdapterBindingSummarySet(Vec<SandboxAdapterBindingSummary>);
```

```rust
impl SandboxAdapterBindingSummary {
    /// 从validated activation plan与registry marker构造一个slot摘要。
    pub fn try_from_activation_plan(
        adapter_kind: SandboxAdapterKind,
        activation_kind: SandboxAdapterActivationKind,
        binding_marker_ref: SandboxAdapterBindingMarkerRef,
    ) -> Result<Self, InfraError>;

    /// 返回logical slot。
    pub fn adapter_kind(&self) -> SandboxAdapterKind;
    /// 返回validated activation disposition。
    pub fn activation_kind(&self) -> SandboxAdapterActivationKind;
    /// 返回redacted binding marker。
    pub fn binding_marker_ref(&self) -> &SandboxAdapterBindingMarkerRef;
}

impl SandboxAdapterBindingSummarySet {
    /// 构造same-order、无重复、18/18完整slot集合。
    pub fn try_complete(
        items: Vec<SandboxAdapterBindingSummary>,
    ) -> Result<Self, InfraError>;

    /// 返回canonical 18-slot只读切片。
    pub fn as_slice(&self) -> &[SandboxAdapterBindingSummary];
    /// 按closed kind exact读取；合法集合恒返回Some。
    pub fn get(&self, kind: SandboxAdapterKind) -> Option<&SandboxAdapterBindingSummary>;
    /// 返回固定覆盖数；合法集合恒为18。
    pub fn len(&self) -> usize;
}
```

canonical 顺序就是 enum 声明顺序。`try_complete` 必须先检查数量恰为18，再逐索引检查 expected kind，
因此 duplicate、missing、extra和wrong-order均不能被排序或去重掩盖。每项 marker必须non-empty，且
18项 marker两两不同；即使多个logical slot最终共享一个concrete component，也必须由registry生成
slot-specific marker，防止availability错绑。`Disabled`仍保留marker，只标识禁用的logical binding，
不得包含provider locator。

activation不是任意三选一。LD-15必须按下表产生closed disposition；`try_from_activation_plan`和set
constructor再次校验，防止config把hard dependency伪装成optional：

| adapter kind | allowed activation | exact rule |
|---|---|---|
| `TruthStore` | `Required` only | truth/audit/UoW不可禁用或降级 |
| `ProjectionStore` | `Required` only | selected store构造失败必须startup fail-fast；发布后不可用才允许query返回degraded/unavailable，且不允许query写修复 |
| `DerivedStore` | `Required` only | selected store构造失败必须startup fail-fast；发布后不可用只影响derived/reconciliation maintenance，不修core truth |
| `ReferenceStore` | `Required` only | selected store构造失败必须startup blocked；发布后不可用使相关read/maintenance受限，并让依赖它的mutation fail closed |
| `RelayStore` | `Required | Disabled` | outbound disabled时Disabled；enabled时必须required且no source rollback |
| `ReplayStore` | `Required` only | idempotency/stored replay不可降级或禁用 |
| `ContextResolver` | `Required` only | unavailable时阻断generation，不能默认resolved |
| `PolicySummary` | `Required` only | unavailable不得降级为policy allow |
| `BackendCapability` | `Required` only | unavailable不得跳过10/10 capability proof |
| `IsolationBackend` | `Required` only | 无弱backend/fake/host fallback |
| `ExecutionCapture` | `Required` only | run不得因capture adapter缺失而伪造complete |
| `MaterialHandoff` | `Required | Disabled` | target set为空时Disabled；非空时required |
| `ObservabilityHandoff` | `Required | Disabled` | I048关闭时Disabled；启用时required且不替代formal audit |
| `InvestigationHandoff` | `Required | Disabled` |对应安全handoff关闭时Disabled；启用时required且receipt不解除containment |
| `EventPublisher` | `Required | Disabled` | outbound disabled时Disabled；enabled时required |
| `BackendRelease` | `Required` only | cleanup-authorized release与inspect能力不可降级 |
| `Clock` | `Required` only | 禁止wall-clock偷读或missing timestamp |
| `IdGenerator` | `Required` only | 禁止字符串拼接、timestamp/hash替代typed identity |

18个slot的activation闭集只有`Required | Disabled`。`ProjectionStore`、`DerivedStore`和
`ReferenceStore`的运行期degraded资格不等于startup可选装配；LD-19 constructor或LD-21 startup
availability失败仍必须阻断generation。external telemetry degradation不在本enum，按§10.4的
infra-private输入处理。任何slot携带表外activation、或enabled slot被标为`Disabled`，均返回
`AdapterActivationMismatch`；配置不得通过activation plan把required startup assembly降为optional。

### 10.4 `SandboxRuntimeConfigSummary`

```rust
/// FZ-02 validated config与LD-22 disposition的body-free builder-local摘要。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct SandboxRuntimeConfigSummary {
    /// LD-16生成的validated snapshot identity。
    config_ref: SandboxInfraConfigRef,
    /// validated runtime profile identity。
    runtime_profile_ref: SandboxRuntimeProfileRef,
    /// exact 18-slot activation / binding摘要。
    adapter_bindings: SandboxAdapterBindingSummarySet,
    /// LD-17时为Valid；LD-22后为最终builder disposition。
    config_status: RuntimeConfigStatus,
    /// V01~V07全部通过、FZ-02形成的canonical time。
    validated_at: Timestamp,
    /// LD-22完成时的canonical time；LD-17 summary必须为None。
    disposition_evaluated_at: Option<Timestamp>,
    /// LD-22 Degraded/StartupBlocked时非空；Valid时为空；保持slot检查顺序。
    disposition_reasons: Vec<SandboxReason>,
}

impl SandboxRuntimeConfigSummary {
    /// LD-17只从validated snapshot和complete activation binding set建立Valid summary。
    pub fn from_validated_snapshot(
        config_ref: SandboxInfraConfigRef,
        runtime_profile_ref: SandboxRuntimeProfileRef,
        adapter_bindings: SandboxAdapterBindingSummarySet,
        validated_at: Timestamp,
    ) -> Result<Self, InfraError>;

    /// LD-22消费exact matching availability set，形成新的final builder disposition。
    pub fn evaluate_disposition(
        &self,
        availability: &AdapterAvailabilityStateSet,
        optional_telemetry_degradation_reasons: Vec<SandboxReason>,
        evaluated_at: Timestamp,
    ) -> Result<Self, InfraError>;

    /// 返回validated snapshot identity。
    pub fn config_ref(&self) -> &SandboxInfraConfigRef;
    /// 返回runtime profile identity。
    pub fn runtime_profile_ref(&self) -> &SandboxRuntimeProfileRef;
    /// 返回complete binding set。
    pub fn adapter_bindings(&self) -> &SandboxAdapterBindingSummarySet;
    /// 返回当前builder-local config disposition。
    pub fn config_status(&self) -> RuntimeConfigStatus;
    /// 判断LD-22是否已执行；不能据此声称LD-24已发布。
    pub fn has_final_disposition(&self) -> bool;
    /// 返回safe disposition reason set。
    pub fn disposition_reasons(&self) -> &[SandboxReason];
}
```

字段关系固定如下：

| phase | status | evaluated time | reasons | generation/publication语义 |
|---|---|---|---|---|
| LD-17 | `Valid` | `None` | empty | 仅builder bootstrap；未做availability disposition |
| LD-22 all enabled required slot healthy且optional telemetry healthy | `Valid` | `Some(>= validated_at)` | empty | complete disposition；仍未发布 |
| LD-22 only permitted infra-private optional telemetry degraded | `Degraded` | `Some(>= validated_at)` | non-empty | 只限制external telemetry；仍须LD-23/24且formal audit / local diagnostic完整 |
| LD-22 any enabled required slot failure / illegal disabled state | `StartupBlocked` | `Some(>= validated_at)` | non-empty | LD-23不得暴露service，LD-24发布0 handles |

本对象不保存 generation ref、material lease、endpoint、topic、path、credential、provider name、40组/
101项配置、完整 adapter/profile ref列表或service handles。`evaluate_disposition`是pure replacement
factory，不原地修改LD-17 summary；同一实例不得二次evaluate，也不得从`StartupBlocked`改回
`Valid`。修复配置或availability必须重建新的FZ-02/generation candidate。

`disposition_reasons`是private infra-local list，不复用application-owned `SandboxReasonSet`，避免把
query/outcome reason-set语义带入runtime builder。只有`evaluate_disposition`可按18-slot检查顺序填充；
它不提供mutable getter，不允许raw config issue、provider cause或caller文本进入列表。

`optional_telemetry_degradation_reasons`同样是infra-private builder输入，不新增第19个adapter kind或
availability state。只有I086~I090已通过validation、safe local diagnostic仍可用、formal audit独立可用且
redaction floor保持时，external log/metric sink failure才能提供non-empty safe reasons并参与
`Degraded`；任一安全前提不成立必须`StartupBlocked`。该列表不能承接entry、audit、diagnostic、policy、
boundary、cleanup或redline failure，也不能抵消18-slot required blocker。

### 10.5 `AdapterAvailabilityState` 与 exact coverage set

```rust
/// 一个logical slot针对exact binding marker的技术可用观察。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct AdapterAvailabilityState {
    /// logical slot。
    adapter_kind: SandboxAdapterKind,
    /// 与activation binding逐项相等的redacted marker。
    binding_marker_ref: SandboxAdapterBindingMarkerRef,
    /// Available/Degraded/Unavailable/Disabled技术状态。
    availability_status: AdapterAvailabilityStatus,
    /// 仅Degraded/Unavailable必填的safe原因。
    reason: Option<SandboxReason>,
    /// availability checker使用application clock记录的时间。
    checked_at: Timestamp,
}

/// 保持binding set顺序、恰好18项且marker逐项相等的availability coverage。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct AdapterAvailabilityStateSet(Vec<AdapterAvailabilityState>);

impl AdapterAvailabilityState {
    /// 从一个validated binding和typed checker result构造状态。
    pub fn try_for_binding(
        binding: &SandboxAdapterBindingSummary,
        availability_status: AdapterAvailabilityStatus,
        reason: Option<SandboxReason>,
        checked_at: Timestamp,
    ) -> Result<Self, InfraError>;

    /// 返回logical slot。
    pub fn adapter_kind(&self) -> SandboxAdapterKind;
    /// 返回exact binding marker。
    pub fn binding_marker_ref(&self) -> &SandboxAdapterBindingMarkerRef;
    /// 返回技术状态；不等于business allow。
    pub fn availability_status(&self) -> AdapterAvailabilityStatus;
    /// 返回caller-safe technical reason。
    pub fn reason(&self) -> Option<&SandboxReason>;
    /// 返回checker时间。
    pub fn checked_at(&self) -> &Timestamp;
    /// 只判断当前slot是否完全Available；不表达degraded call或business allow。
    pub fn is_fully_available(&self) -> bool;
}

impl AdapterAvailabilityStateSet {
    /// LD-21按binding set原顺序构造18/18 coverage并逐项校验marker。
    pub fn try_complete_for_bindings(
        bindings: &SandboxAdapterBindingSummarySet,
        items: Vec<AdapterAvailabilityState>,
    ) -> Result<Self, InfraError>;

    /// 返回canonical只读切片。
    pub fn as_slice(&self) -> &[AdapterAvailabilityState];
    /// exact kind读取；合法集合恒返回Some。
    pub fn get(&self, kind: SandboxAdapterKind) -> Option<&AdapterAvailabilityState>;
    /// 判断是否存在任何required generation blocker。
    pub fn has_required_blocker(
        &self,
        bindings: &SandboxAdapterBindingSummarySet,
    ) -> bool;
}
```

`try_for_binding` 的 closed relation。下表的LD-22 effect只适用于startup candidate；LD-24发布后可为
同一binding重新构造runtime availability observation，但不得再次调用本summary的
`evaluate_disposition`去改写已发布generation：

| activation | allowed availability | reason | LD-22 effect |
|---|---|---|---|
| `Required` | `Available` | `None` | healthy |
| `Required` | `Degraded | Unavailable` | `Some` | `StartupBlocked` |
| `Required` | `Disabled` | forbidden | shape error / `StartupBlocked` |
| `Disabled` | `Disabled` | `None` | intentionally absent |
| `Disabled` | any other | forbidden | provider was illegally constructed/probed |

`Available | Disabled`不得携带reason；`Degraded | Unavailable`必须携带non-empty safe reason。
`is_fully_available()`只对`Available`返回true。startup时，任一enabled `Required` slot的
`Degraded | Unavailable`都使LD-22得到`StartupBlocked`；只有external telemetry的infra-private原因可形成
startup `RuntimeConfigStatus::Degraded`。LD-24发布后，runtime registry可对同一18-slot binding重新生成
availability set；此时projection/reference/derived等read/maintenance是否可返回显式degraded surface，
由application的operation-specific policy判断，不能用generic can-call bool放行，也不能反向把activation
改成optional。set constructor逐索引比较kind和marker，检查数量18、无重复和`checked_at`合法；不得排序、
按kind覆盖或接受missing disabled项。

### 10.6 Isolation environment establishment outcome

本对象只承接 isolation environment establishment。run launch必须返回
`ControlledRunLifecycleObservation`，inspect/release必须返回
`IsolationEnvironmentLifecycleObservation`；三者不能复用一个泛化backend outcome。

```rust
/// 固定一次environment establishment call的完整Sandbox correlation。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct IsolationBackendEstablishmentCorrelation {
    /// accepted context identity。
    context_ref: ControlledExecutionContextRef,
    /// matching active environment identity。
    environment_identity_ref: ExecutionEnvironmentIdentityRef,
    /// application为本attempt预生成的coherent boundary identity。
    boundary_ref: CoherentBoundaryRef,
    /// backend必须落实的immutable requirement identity。
    requirement_ref: BoundaryRequirementSetRef,
    /// call前已通过guard的fresh capability snapshot identity。
    capability_ref: BackendCapabilitySummaryRef,
    /// requirement、capability、binding与provider call共用的generation。
    generation_ref: ResourceRef,
}

/// concrete isolation adapter可产生的environment establishment有限分类。
#[derive(Clone, Copy, Debug, Eq, PartialEq)]
pub enum IsolationBackendOutcomeStatus {
    /// provider返回stable body-free descriptor与validated lease window。
    Established,
    /// provider明确表示不支持当前要求；与pre-call supported capability矛盾。
    Unsupported,
    /// provider建立失败；可能留下stable partial environment。
    Failed,
    /// provider明确证明没有建立environment且当前不可调用。
    Unavailable,
}

/// concrete adapter内部从provider结果映射出的transient establishment carrier。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct IsolationBackendAdapterOutcome {
    /// exact call correlation；不得由provider response回填。
    correlation: IsolationBackendEstablishmentCorrelation,
    /// finite provider classification。
    outcome_status: IsolationBackendOutcomeStatus,
    /// Established必填；Failed仅在存在stable partial environment时可填。
    environment_descriptor: Option<IsolationEnvironmentDescriptor>,
    /// 与descriptor严格成对的validated lease window。
    lease_window: Option<LeaseWindow>,
    /// 非Established必填的caller-safe reason。
    reason: Option<SandboxReason>,
    /// typed mapper完成分类的application clock time。
    observed_at: Timestamp,
}
```

```rust
impl IsolationBackendEstablishmentCorrelation {
    /// 从本次loaded objects和预生成boundary ref冻结exact call correlation。
    pub fn try_for_attempt(
        context: &ControlledExecutionContext,
        identity: &ExecutionEnvironmentIdentity,
        boundary_ref: CoherentBoundaryRef,
        requirements: &BoundaryRequirementSet,
        capability: &BackendCapabilitySummary,
    ) -> Result<Self, InfraError>;

    /// 返回accepted context ref。
    pub fn context_ref(&self) -> &ControlledExecutionContextRef;
    /// 返回matching environment identity ref。
    pub fn environment_identity_ref(&self) -> &ExecutionEnvironmentIdentityRef;
    /// 返回本attempt预生成boundary ref。
    pub fn boundary_ref(&self) -> &CoherentBoundaryRef;
    /// 返回immutable requirement ref。
    pub fn requirement_ref(&self) -> &BoundaryRequirementSetRef;
    /// 返回pre-call capability ref。
    pub fn capability_ref(&self) -> &BackendCapabilitySummaryRef;
    /// 返回runtime generation ref。
    pub fn generation_ref(&self) -> &ResourceRef;
}

impl IsolationBackendAdapterOutcome {
    /// 映射provider明确建立成功的body-free结果。
    pub fn established(
        correlation: IsolationBackendEstablishmentCorrelation,
        requirements: &BoundaryRequirementSet,
        environment_descriptor: IsolationEnvironmentDescriptor,
        lease_window: LeaseWindow,
        observed_at: Timestamp,
    ) -> Result<Self, InfraError>;

    /// 映射provider明确unsupported；不得用错误字符串或产品code推断。
    pub fn unsupported(
        correlation: IsolationBackendEstablishmentCorrelation,
        reason: SandboxReason,
        observed_at: Timestamp,
    ) -> Result<Self, InfraError>;

    /// 映射provider明确failed；partial descriptor/window必须both-or-neither。
    pub fn failed(
        correlation: IsolationBackendEstablishmentCorrelation,
        requirements: &BoundaryRequirementSet,
        partial_environment_descriptor: Option<IsolationEnvironmentDescriptor>,
        partial_lease_window: Option<LeaseWindow>,
        reason: SandboxReason,
        observed_at: Timestamp,
    ) -> Result<Self, InfraError>;

    /// 仅在typed provider contract证明没有environment side effect时映射Unavailable。
    pub fn unavailable(
        correlation: IsolationBackendEstablishmentCorrelation,
        reason: SandboxReason,
        observed_at: Timestamp,
    ) -> Result<Self, InfraError>;

    /// 转成application-owned port result，避免application trait依赖infra type。
    pub fn into_port_result(
        self,
    ) -> Result<IsolationEnvironmentEstablishmentResult, InfraError>;

    /// 返回finite outcome status。
    pub fn outcome_status(&self) -> IsolationBackendOutcomeStatus;
    /// 返回exact correlation。
    pub fn correlation(&self) -> &IsolationBackendEstablishmentCorrelation;
    /// 返回success或partial environment descriptor。
    pub fn environment_descriptor(&self) -> Option<&IsolationEnvironmentDescriptor>;
    /// 返回与descriptor成对的lease window。
    pub fn lease_window(&self) -> Option<&LeaseWindow>;
    /// 返回non-established safe reason。
    pub fn reason(&self) -> Option<&SandboxReason>;
    /// 判断当前failed result是否产生cleanup obligation。
    pub fn requires_cleanup_obligation(&self) -> bool;
}
```

`try_for_attempt`必须验证：context为Accepted；identity对该context为Active；requirement的context、
identity与generation相等；capability评估同一requirement且generation相等；boundary ref为本attempt输入，
不得从provider handle或字符串生成。它不重复执行capability guard，也不读取policy。

outcome field matrix：

| status | descriptor/window | reason | conversion |
|---|---|---|---|
| `Established` | both `Some` | `None` | `IsolationEnvironmentEstablishmentResult::established_from_port` |
| `Unsupported` | both `None` | `Some` | `backend_unsupported_from_port`；application必须处理capability contradiction |
| `Failed` | both `Some`或both `None` | `Some` | `failed_from_port`；partial pair形成cleanup obligation |
| `Unavailable` | both `None` | `Some` | `unavailable_from_port`；只允许明确no-side-effect结果 |

descriptor存在时，其backend handle与summary source kind必须是`IsolationBackend`，source version与
descriptor generation必须等于correlation generation；lease window必须通过当前requirements的
lifecycle requirement校验。`observed_at`不得早于参与attempt的validated snapshots。provider timeout、
connection reset或进程中断若无法证明environment absent，必须返回
`InfraError::ExternalSideEffectCommitUnknown`，不能伪造`Unavailable`或无partial的`Failed`。

`into_port_result`逐branch调用§9.10 factory；任何factory关系失败映射为
`InfraError::AdapterOutcomeCorrelationMismatch`。本对象没有`to_boundary_decision_status`、
`to_handle_status`或`requires_retry`：只有application加载相同对象后调用domain factory，才能形成
decision、handle或cleanup obligation。

### 10.7 Material handoff adapter outcome

`MaterialHandoffAdapterOutcome`服务所有`HandoffTarget`允许的target kind，但每个实例只对应一个
已持久化target attempt。adapter call前，application必须先通过
`HandoffFact::begin_target_attempt`提交`Attempting` progress；不得先调用外部target、成功后再补
attempt identity。

```rust
use std::num::{NonZeroU32, NonZeroU64};

/// material handoff provider对一个exact target attempt的有限分类。
#[derive(Clone, Copy, Debug, Eq, PartialEq)]
pub enum HandoffAdapterOutcomeStatus {
    /// downstream确认接收exact selection并返回matching body-free receipt。
    Delivered,
    /// 本attempt明确失败但允许在non-zero not-before age后新开attempt。
    Retryable,
    /// 本attempt明确terminal failed，不能由job自动重试。
    Failed,
}

/// concrete handoff adapter内部的body-free transient provider-mapping carrier。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct MaterialHandoffAdapterOutcome {
    /// owning handoff batch identity。
    handoff_ref: HandoffFactRef,
    /// immutable plan中的closed target kind。
    target_kind: HandoffTargetKind,
    /// immutable plan中的exact external target identity。
    target_ref: ExternalSourceRef,
    /// call前已持久化的Attempting identity。
    attempt_ref: HandoffDeliveryAttemptRef,
    /// attempt开始时间，必须复制current progress。
    attempt_started_at: Timestamp,
    /// owning handoff与target binding共用的runtime generation。
    generation_ref: ResourceRef,
    /// finite provider classification。
    outcome_status: HandoffAdapterOutcomeStatus,
    /// Delivered唯一允许的matching body-free receipt relation。
    receipt_ref: Option<HandoffReceiptRef>,
    /// Retryable唯一允许的non-zero not-before age。
    retry_not_before_age_millis: Option<NonZeroU64>,
    /// Retryable/Failed必填的caller-safe reason。
    reason: Option<SandboxReason>,
    /// provider mapping完成或trusted inspect确认的application clock time。
    observed_at: Timestamp,
}
```

```rust
impl MaterialHandoffAdapterOutcome {
    /// 从matching Attempting progress和typed downstream acknowledgement映射Delivered。
    pub fn delivered(
        handoff: &HandoffFact,
        target: &HandoffTarget,
        progress: &HandoffTargetProgress,
        receipt_ref: HandoffReceiptRef,
        observed_at: Timestamp,
    ) -> Result<Self, InfraError>;

    /// 从typed temporary failure映射Retryable；不解析status code或message。
    pub fn retryable(
        handoff: &HandoffFact,
        target: &HandoffTarget,
        progress: &HandoffTargetProgress,
        reason: SandboxReason,
        retry_not_before_age_millis: NonZeroU64,
        observed_at: Timestamp,
    ) -> Result<Self, InfraError>;

    /// 从typed terminal failure映射Failed；不得由retry policy exhaustion伪造provider结果。
    pub fn failed(
        handoff: &HandoffFact,
        target: &HandoffTarget,
        progress: &HandoffTargetProgress,
        reason: SandboxReason,
        observed_at: Timestamp,
    ) -> Result<Self, InfraError>;

    /// 重验owning handoff/current attempt后构造domain-owned delivery observation。
    pub fn into_delivery_observation(
        self,
        handoff: &HandoffFact,
    ) -> Result<HandoffTargetDeliveryObservation, InfraError>;

    /// 返回owning handoff identity。
    pub fn handoff_ref(&self) -> &HandoffFactRef;
    /// 返回closed target kind。
    pub fn target_kind(&self) -> HandoffTargetKind;
    /// 返回exact target ref。
    pub fn target_ref(&self) -> &ExternalSourceRef;
    /// 返回exact persisted attempt ref。
    pub fn attempt_ref(&self) -> &HandoffDeliveryAttemptRef;
    /// 返回runtime generation。
    pub fn generation_ref(&self) -> &ResourceRef;
    /// 返回finite outcome status。
    pub fn outcome_status(&self) -> HandoffAdapterOutcomeStatus;
    /// 返回Delivered receipt relation。
    pub fn receipt_ref(&self) -> Option<&HandoffReceiptRef>;
    /// 返回Retryable not-before age。
    pub fn retry_not_before_age_millis(&self) -> Option<NonZeroU64>;
    /// 返回Retryable/Failed safe reason。
    pub fn reason(&self) -> Option<&SandboxReason>;
}
```

三个factory共享以下校验顺序：

1. `handoff.target_plan().get(target.target_ref())`必须存在且与target完全相等；handoff generation必须
   non-empty。
2. `progress.handoff_ref/target_kind/target_ref`必须与handoff/target相等，status必须为`Attempting`，
   `attempt_ref`和`attempt_started_at`必须为Some；不得接受Pending/Retryable旧snapshot。
3. carrier的handoff、target、attempt、start time和generation只能从上述对象复制，factory不接受同名
   caller参数。
4. `observed_at >= attempt_started_at`；不能用repository timestamp纠正provider时间关系。
5. Delivered receipt的target kind/ref必须与target完全一致；receipt source identity不得等于target、
   handoff、attempt或任一selected material identity。

outcome field matrix：

| status | receipt | retry age | reason |
|---|---|---|---|
| `Delivered` | `Some(exact target)` | `None` | `None` |
| `Retryable` | `None` | `Some(non-zero)` | `Some` |
| `Failed` | `None` | `None` | `Some` |

`into_delivery_observation`重新从current handoff读取target与progress，要求generation、attempt和start time
仍等于carrier；再穷尽构造`HandoffTargetDeliveryOutcome`并调用
`HandoffTargetDeliveryObservation::try_from_adapter`。domain factory失败统一转
`InfraError::AdapterOutcomeCorrelationMismatch`，不能丢弃后重试新attempt。

provider在side effect后timeout、连接中断或返回无法分类的ack时，adapter返回
`ExternalSideEffectCommitUnknown`或`AdapterOutcomeUnclassifiable`，保留progress为`Attempting`并按
exact tuple `(handoff_ref,target_ref,attempt_ref,generation_ref)`进入inspect/recovery。禁止把unknown
猜成Retryable、切换target、回滚capture/handoff source truth或生成新attempt。

即使`into_delivery_observation`成功，domain也尚未接受该结果。application仍须对同一Version snapshot
调用`HandoffFact::apply_target_observation`并原子保存fact、material lifecycle、audit、relay/projection
marker与stored result；本对象没有`to_handoff_status`、`blocks_cleanup`或material status helper。

### 10.8 Event publisher adapter outcome

publisher只能发送`SandboxRelayAttempt`已冻结的payload snapshot与target binding。outcome不接收
current truth或让publisher重建payload，也不把subscriber处理结果、bus offset、HTTP response、topic或
provider message body保存进carrier。

```rust
/// concrete publisher对一个exact persisted attempt的正常finite分类。
#[derive(Clone, Copy, Debug, Eq, PartialEq)]
pub enum PublisherOutcomeStatus {
    /// publisher确认接收exact frozen payload。
    Published,
    /// current attempt明确未成功且可按typed not-before age重试。
    Retryable,
    /// publisher明确给出不可自动恢复的terminal classification。
    DeadLetter,
}

/// concrete publisher内部的body-free transient provider-mapping carrier。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct EventPublisherAdapterOutcome {
    /// 从persisted attempt复制的owning relay identity。
    relay_record_ref: SandboxEventRelayRecordRef,
    /// 从persisted attempt复制的exact attempt identity。
    attempt_ref: SandboxRelayAttemptRef,
    /// 从persisted attempt复制的non-zero ordinal。
    attempt_ordinal: NonZeroU32,
    /// 从persisted attempt复制的start time。
    attempt_started_at: Timestamp,
    /// 从persisted attempt复制的frozen payload identity。
    payload_identity: SandboxRelayPayloadIdentity,
    /// 从persisted attempt复制的publisher/route/generation binding。
    target_binding: SandboxRelayTargetBinding,
    /// Published/Retryable/DeadLetter有限分类。
    outcome_status: PublisherOutcomeStatus,
    /// Published唯一允许的body-free receipt summary。
    published_receipt: Option<SandboxRelayReceiptSummary>,
    /// Retryable唯一允许的finite failure summary。
    retryable_failure: Option<SandboxRelayFailureSummary>,
    /// Retryable唯一允许的non-zero not-before age。
    retry_not_before_age_millis: Option<NonZeroU64>,
    /// DeadLetter唯一允许的publisher-terminal summary。
    dead_letter: Option<SandboxRelayDeadLetterSummary>,
    /// provider mapping或exact attempt inspect完成的application clock time。
    observed_at: Timestamp,
}
```

```rust
impl EventPublisherAdapterOutcome {
    /// 从persisted attempt和typed acknowledgement映射Published。
    pub fn published(
        attempt: &SandboxRelayAttempt,
        receipt: SandboxRelayReceiptSummary,
        observed_at: Timestamp,
    ) -> Result<Self, InfraError>;

    /// 从persisted attempt和typed temporary failure映射Retryable。
    pub fn retryable(
        attempt: &SandboxRelayAttempt,
        failure: SandboxRelayFailureSummary,
        retry_not_before_age_millis: NonZeroU64,
        observed_at: Timestamp,
    ) -> Result<Self, InfraError>;

    /// 从persisted attempt和typed publisher-terminal classification映射DeadLetter。
    pub fn dead_letter(
        attempt: &SandboxRelayAttempt,
        dead_letter: SandboxRelayDeadLetterSummary,
        observed_at: Timestamp,
    ) -> Result<Self, InfraError>;

    /// 转成同步publisher call的domain-owned exact attempt observation。
    pub fn into_publisher_call_observation(
        self,
        attempt: &SandboxRelayAttempt,
    ) -> Result<SandboxRelayDeliveryObservation, InfraError>;

    /// 转成对同一persisted attempt执行typed inspect后的domain observation。
    pub fn into_attempt_inspection_observation(
        self,
        attempt: &SandboxRelayAttempt,
    ) -> Result<SandboxRelayDeliveryObservation, InfraError>;

    /// 返回owning relay identity。
    pub fn relay_record_ref(&self) -> &SandboxEventRelayRecordRef;
    /// 返回exact persisted attempt identity。
    pub fn attempt_ref(&self) -> &SandboxRelayAttemptRef;
    /// 返回attempt ordinal。
    pub fn attempt_ordinal(&self) -> NonZeroU32;
    /// 返回frozen payload identity。
    pub fn payload_identity(&self) -> &SandboxRelayPayloadIdentity;
    /// 返回publisher/route/generation binding。
    pub fn target_binding(&self) -> &SandboxRelayTargetBinding;
    /// 返回finite publisher outcome status。
    pub fn outcome_status(&self) -> PublisherOutcomeStatus;
    /// 返回provider mapping observation time。
    pub fn observed_at(&self) -> &Timestamp;
}
```

factory必须调用attempt getter逐字段复制，不允许caller分别传relay、attempt、ordinal、payload、target或
generation。`observed_at >= attempt.started_at`；target binding的bound event kind、publisher marker、
route marker和generation保持immutable。field matrix：

| status | receipt | retry failure / age | dead letter |
|---|---|---|---|
| `Published` | `Some`且ack payload exact match | both `None` | `None` |
| `Retryable` | `None` | failure `Some` + age `Some(non-zero)` | `None` |
| `DeadLetter` | `None` | both `None` | `Some(PublisherTerminal)` |

`DeadLetter` factory必须拒绝`SandboxRelayDeadLetterBasis::RetryExhausted`；retry exhaustion只能由domain
record的`SandboxRelayRetryDecision`形成，不能冒充publisher response。没有`PublisherOutcomeStatus::Failed`
或`Delivered`：normal provider result无法分类时返回`AdapterOutcomeUnclassifiable`，attempt side effect
未知时返回`ExternalSideEffectCommitUnknown`，之后按exact attempt inspect；domain `Failed`只由
`SandboxRelayIntegrityFailureSummary`的显式完整性分类形成。

两个observation converter都先将传入attempt的六组关联与carrier逐项比较，再穷尽构造
`SandboxRelayDeliveryOutcome`，最后调用
`SandboxRelayDeliveryObservation::try_from_typed_outcome`。前者固定`PublisherCall`，后者固定
`AttemptInspection`且只能用于同一concrete adapter的typed inspect。`TrustedFeedback`必须先经过
worker入口的authentication/schema/attempt relation校验并走Step 8/9专属mapper，不经过本infra outcome；
caller不能传source kind来改变状态语义。

observation构造成功不等于relay已Published/Retryable/DeadLetter。application仍须对同一loaded
`SandboxEventRelayRecord`调用`apply_delivery_observation`并通过Version CAS提交；publisher failure不
回滚source truth或payload snapshot。本对象没有`to_relay_status`或`must_not_rollback_source`这种会让
caller跳过domain transition的helper。

### 10.9 `InfraError`: 18-variant exact technical failure closure

`InfraError`只保存finite kind、closed adapter/config角色和已脱敏reason。它不保存raw SDK/SQL/IO error、
HTTP status/header/body、DSN、endpoint、topic、path、secret、provider message、stack或panic。raw cause若需
排障，只能在发生点经§10.10允许的redacted diagnostic hook记录，不能进入error对象或public mapping。

```rust
/// config identity构造失败的closed角色。
#[derive(Clone, Copy, Debug, Eq, PartialEq)]
pub enum InfraConfigIdentityKind {
    /// validated runtime profile identity。
    RuntimeProfile,
    /// FZ-02 validated ordinary snapshot identity。
    ValidatedSnapshot,
}

/// infra config、builder、adapter、persistence和external side-effect的唯一module error。
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum InfraError {
    /// runtime profile或validated snapshot identity为空/错型。
    ConfigIdentityInvalid {
        /// 失败identity的closed角色，不携带实际ref。
        identity_kind: InfraConfigIdentityKind,
    },
    /// 一个logical slot的redacted binding marker为空、重复或错型。
    BindingMarkerInvalid {
        /// marker所属logical slot；尚未确定slot时为None。
        adapter_kind: Option<SandboxAdapterKind>,
    },
    /// binding set不是canonical 18/18 same-order unique coverage。
    AdapterBindingCoverageMismatch,
    /// activation kind与builder实际构造/禁用行为不一致。
    AdapterActivationMismatch {
        /// 发生不一致的logical slot。
        adapter_kind: SandboxAdapterKind,
    },
    /// availability set没有逐项覆盖matching 18-slot binding marker。
    AdapterAvailabilityCoverageMismatch,
    /// availability status、activation、reason或checked time关系不合法。
    AdapterAvailabilityRelationInvalid {
        /// relation不合法的logical slot。
        adapter_kind: SandboxAdapterKind,
        /// checker提供的actual technical status。
        availability_status: AdapterAvailabilityStatus,
    },
    /// LD-17/LD-22的status、time或reason矩阵不合法。
    RuntimeDispositionInvalid {
        /// summary携带的actual runtime config status。
        config_status: RuntimeConfigStatus,
    },
    /// LD-23没有形成required complete unpublished service/entry set。
    RuntimeBuilderIncomplete,
    /// LD-24发现config、adapter、service或entry set不是same generation。
    RuntimeGenerationConsistencyMismatch,
    /// validated且enabled的logical adapter当前不可调用。
    AdapterUnavailable {
        /// 不可用的logical slot。
        adapter_kind: SandboxAdapterKind,
        /// 已脱敏technical reason；不得用于状态重分类。
        reason: SandboxReason,
    },
    /// operation请求了validated activation plan明确Disabled的slot。
    AdapterDisabled {
        /// 被禁用的logical slot。
        adapter_kind: SandboxAdapterKind,
    },
    /// concrete adapter constructor无法形成当前generation的完整实现。
    AdapterConstructionFailed {
        /// 构造失败的logical slot。
        adapter_kind: SandboxAdapterKind,
        /// caller-safe construction reason。
        reason: SandboxReason,
    },
    /// finite outcome的optional字段不满足closed branch矩阵。
    AdapterOutcomeShapeInvalid {
        /// 产生非法shape的logical slot。
        adapter_kind: SandboxAdapterKind,
    },
    /// outcome的object/attempt/target/generation与call correlation不一致。
    AdapterOutcomeCorrelationMismatch {
        /// correlation失败的logical slot。
        adapter_kind: SandboxAdapterKind,
    },
    /// provider result不能安全映射到当前finite outcome闭集。
    AdapterOutcomeUnclassifiable {
        /// 无法分类result所属logical slot。
        adapter_kind: SandboxAdapterKind,
    },
    /// provider/config/persistence映射检测到禁止越过body-free边界的正文。
    ForbiddenExternalBody {
        /// 检测到正文的logical slot。
        adapter_kind: SandboxAdapterKind,
    },
    /// transaction commit返回未知，必须按exact persisted identity检查。
    PersistenceCommitUnknown {
        /// 发生unknown commit的store slot。
        adapter_kind: SandboxAdapterKind,
    },
    /// external call可能已产生side effect，必须inspect exact persisted attempt。
    ExternalSideEffectCommitUnknown {
        /// 发生unknown side effect的adapter slot。
        adapter_kind: SandboxAdapterKind,
    },
}
```

```rust
impl InfraError {
    /// 穷尽映射到application已有detail；不得使用wildcard arm。
    pub fn to_application_detail(&self) -> ApplicationErrorDetail;

    /// 穷尽映射caller-safe public category；结果必须等于application detail的public mapping。
    pub fn to_public_error_kind(&self) -> SandboxPublicErrorKind;

    /// 生成固定template或复用variant内safe reason；不得调用raw cause Display。
    pub fn safe_reason(&self) -> SandboxReason;

    /// 形成application-owned error，供concrete port implementation返回。
    pub fn into_application_error(
        self,
        trace_context: Option<SandboxTraceContext>,
    ) -> ApplicationError;

    /// 只有两个commit-unknown variant需要exact identity/attempt inspection。
    pub fn requires_exact_inspection(&self) -> bool;

    /// 返回是否允许在前置条件变化后重新尝试；不表示可blind retry当前side effect。
    pub fn retryable_after_revalidation(&self) -> bool;
}
```

18/18 mapping固定如下；实现必须逐variant match，新增variant会造成编译或静态closure失败：

| `InfraError` variant | `ApplicationErrorDetail` | public kind | retry / recovery rule |
|---|---|---|---|
| `ConfigIdentityInvalid` | `InternalInvariantViolation` | `Internal` | 修复validator/registry；不重用candidate |
| `BindingMarkerInvalid` | `InternalInvariantViolation` | `Internal` | 修复registry；不排序/补默认marker |
| `AdapterBindingCoverageMismatch` | `InternalInvariantViolation` | `Internal` | generation blocked；重建18/18 set |
| `AdapterActivationMismatch` | `InternalInvariantViolation` | `Internal` | generation blocked；不能把enabled required伪装为disabled或表外activation |
| `AdapterAvailabilityCoverageMismatch` | `InternalInvariantViolation` | `Internal` | LD-22不得运行；重做LD-21完整检查 |
| `AdapterAvailabilityRelationInvalid` | `InternalInvariantViolation` | `Internal` | 修复checker mapping；不猜reason/status |
| `RuntimeDispositionInvalid` | `InternalInvariantViolation` | `Internal` | generation blocked；重建FZ-02 candidate |
| `RuntimeBuilderIncomplete` | `InternalInvariantViolation` | `Internal` | LD-24发布0 handles；不partial expose |
| `RuntimeGenerationConsistencyMismatch` | `InternalInvariantViolation` | `Internal` | LD-24发布0 handles；重建same-generation set |
| `AdapterUnavailable` | `PortUnavailable` | `AdapterUnavailable` | availability recheck后可重试；不弱backend fallback |
| `AdapterDisabled` | `PortDisabled` | `Disabled` | 仅新validated config可改变；当前调用不重试 |
| `AdapterConstructionFailed` | `PortUnavailable` | `AdapterUnavailable` | 修复binding/material并构建新generation；当前candidate不重试 |
| `AdapterOutcomeShapeInvalid` | `InternalInvariantViolation` | `Internal` | implementation/fake parity修复；不应用domain transition |
| `AdapterOutcomeCorrelationMismatch` | `InternalInvariantViolation` | `Internal` | reload exact object/attempt；不改绑或生成新attempt |
| `AdapterOutcomeUnclassifiable` | `InternalInvariantViolation` | `Internal` | typed inspect/manual review；不按字符串分类 |
| `ForbiddenExternalBody` | `ForbiddenExternalBody` | `ForbiddenExternalBody` | reject/quarantine；不得删字段后继续 |
| `PersistenceCommitUnknown` | `InternalInvariantViolation` | `Internal` | exact key/bundle inspect；证明absent前禁止重写 |
| `ExternalSideEffectCommitUnknown` | `InternalInvariantViolation` | `Internal` | exact persisted attempt inspect；禁止blind retry |

`retryable_after_revalidation()`只对`AdapterUnavailable`返回true；
`AdapterConstructionFailed`需要new generation，不是同一operation retry；两个commit-unknown只设置
`requires_exact_inspection=true`，不设置retryable。`safe_reason()`对携带reason的两个variant复用已检查
reason，其余使用按variant固定、无ref值的英文ASCII模板；模板本身必须在unit test中通过
`SandboxReason::try_new`。public或diagnostic输出不得拼接adapter marker、config identity或attempt ref。

historical `OutcomeClassificationMissing`、`RuntimeBuilderFailed`、只有一个原因的generic
`AdapterUnavailable`和把disabled并入unavailable的写法全部invalidated，不提供type/variant alias。

### 10.10 Infra object closure、字段来源与下游差集

#### 10.10.1 Object-to-file owner matrix

本批不新增Step 4未规划文件。每个current type必须只在下表的一个Rust source owner定义；其他文件只能
`use`或调用其public constructor，不得复制private字段、wire shape或同名enum：

| current object family | canonical Rust file | construction owner | persist / serialize | 禁止落点 |
|---|---|---|---|---|
| `SandboxRuntimeProfileRef`;`SandboxInfraConfigRef`;`SandboxAdapterBindingMarkerRef`;`SandboxAdapterKind`;`SandboxAdapterActivationKind`;`SandboxAdapterBindingSummary(Set)` | `crates/infra/src/config.rs` | config validator / activation planner的typed mapper | builder-local；不作为public DTO；不保存raw config | `contracts`、`application`、adapter文件中的第二定义 |
| `SandboxRuntimeConfigSummary`;`AdapterAvailabilityState(Set)` | `crates/infra/src/runtime_builder.rs` | LD-17 summary、LD-21 checker、LD-22 disposition | generation assembly期间transient；formal availability audit另由既有domain carrier承接 | domain truth、config JSON schema、entry response |
| `IsolationBackendEstablishmentCorrelation`;`IsolationBackendAdapterOutcome`;`IsolationBackendOutcomeStatus` | `crates/infra/src/isolation_backend_adapters.rs` | concrete isolation adapter typed mapper | transient；provider raw response不得离开adapter | `application::ports`、run/release通用outcome |
| `MaterialHandoffAdapterOutcome`;`HandoffAdapterOutcomeStatus` | `crates/infra/src/handoff_adapters.rs` | concrete handoff adapter typed mapper | transient；attempt/progress truth仍由domain持久化 | handoff truth object、receipt DTO、job report |
| `EventPublisherAdapterOutcome`;`PublisherOutcomeStatus` | `crates/infra/src/publishers.rs` | concrete publisher typed mapper / exact attempt inspector | transient；relay attempt和payload snapshot仍由domain/store持久化 | relay truth、transport receipt DTO、worker feedback DTO |
| `InfraConfigIdentityKind`;`InfraError` | `crates/infra/src/errors.rs` | infra constructor / mapper | transient；只含finite role与safe reason | `contracts` public error、application generic union、raw diagnostic record |
| `IsolationEnvironmentEstablishmentResult`;`IsolationEnvironmentEstablishmentDisposition` | `crates/application/src/ports.rs` | application-owned port result factory；infra只能经§10.6 converter调用 | transient；不增加shared lifecycle status | `infra`定义、public response、boundary status owner |

`execution_capture`和`backend release`没有独立planned adapter文件，分别由
`isolation_backend_adapters.rs`的concrete implementation与现有application port实现承接；本批不会为其
新增stable infra outcome。run launch必须返回`ControlledRunLifecycleObservation`，inspect/release必须返回
`IsolationEnvironmentLifecycleObservation`。这项文件分配只固定owner，不提前定义Step 7 trait。

#### 10.10.2 Field-source closure matrix

| object / field family | exact source | constructor validation | 不得来源 |
|---|---|---|---|
| three config / binding refs | LD-16 validated identity、validated profile identity、registry slot marker | non-empty typed `ResourceRef`；marker按slot唯一 | raw JSON、endpoint、topic、path、secret、provider display |
| `SandboxAdapterKind` | compile-time 18-slot闭集 | enum声明顺序即canonical coverage顺序 | 40配置组、23 material slot或runtime探测结果动态生成 |
| activation kind | LD-15 validated feature plan | enabled slot=`Required`；合法feature-off slot=`Disabled`；表外值拒绝 | availability反推、constructor失败后降级、profile默认猜测 |
| binding set | activation plan + registry marker | 18/18、same order、kind完整、marker non-empty且unique | sort/dedup补齐、共享一个marker、provider locator |
| runtime config summary | FZ-02 identity + complete binding set + application clock | LD-17与LD-22 status/time/reason矩阵；不得二次evaluate | generation ref、material lease、service handle、40组/101项配置 |
| startup availability set | exact binding set + LD-21 typed checker | 18/18、kind/marker逐项相等；enabled required非Available即block | optional activation、missing disabled项、raw health payload |
| post-publication availability | FZ-03同一binding marker + runtime typed checker | 仍为18/18 exact coverage；只影响operation-specific surface | 回写activation/summary、混用新config marker、generic business allow |
| establishment correlation | accepted context、active identity、requirements、capability、pre-generated boundary ref | context/identity/requirement/capability/generation全相等 | provider response、handle string、latest object scan |
| establishment result fields | typed provider result + frozen correlation | status/descriptor/lease/reason矩阵；descriptor generation与requirements校验 | error string、product code、timeout推断environment absent |
| handoff outcome correlation | persisted `HandoffFact` target plan + current `Attempting` progress | handoff/target/attempt/start/generation exact match | target response回填attempt、切换target、未持久化attempt |
| handoff result fields | typed acknowledgement / temporary / terminal result | receipt exact target；retry age non-zero；reason矩阵 | HTTP status/message、capture rollback、cleanup release判断 |
| publisher correlation | persisted `SandboxRelayAttempt` getters | relay/attempt/ordinal/start/payload/target/generation完整复制 | current truth重建payload、caller逐字段拼装、topic/offset/body |
| publisher result fields | typed ack / temporary / publisher-terminal result | three-branch exclusive matrix；retry exhaustion不得冒充provider terminal | generic `Failed`、subscriber feedback、transport error string |
| infra error | failing finite role + checked safe reason | 18 variants exhaustive mapping；两个unknown variant only exact inspect | raw SQL/SDK/HTTP/IO error、stack、DSN、marker/ref value |

#### 10.10.3 Outcome conversion matrix

| infra input | exact converter output | 后续唯一接受动作 | conversion失败 | 禁止shortcut |
|---|---|---|---|---|
| `IsolationBackendAdapterOutcome::Established` | application `IsolationEnvironmentEstablishmentResult::Established` | application重验attempt后调用boundary/handle domain factory | `AdapterOutcomeCorrelationMismatch`；不创建handle | `to_boundary_decision_status`、直接写`Established` |
| `Unsupported` | application `BackendUnsupported` | 记录capability contradiction并走refresh/failure flow | 同上 | 把provider说法直接升级为capability truth |
| `Failed` with partial pair | application `Failed` + descriptor/lease | 创建可追踪cleanup obligation；禁止launch | shape/correlation error；partial不可丢弃 | 当成无side-effect error重试 |
| `Failed` without partial pair | application `Failed` | 形成诚实failed result | shape/correlation error | 自动改成`Unavailable` |
| `Unavailable` | application `Unavailable` | 只在typed proof确认无environment时返回 | commit unknown则exact inspect | timeout/reset推断无side effect |
| handoff `Delivered` | `HandoffTargetDeliveryOutcome::Delivered` observation | `HandoffFact::apply_target_observation` + Version CAS/UoW | `AdapterOutcomeCorrelationMismatch`；保持`Attempting` | `to_handoff_status`、receipt自动解除cleanup |
| handoff `Retryable` | matching retryable observation | domain factory决定progress与not-before | 同上；不得先开新attempt | adapter直接写`Retryable` truth |
| handoff `Failed` | matching failed observation | domain factory决定terminal progress | 同上 | 回滚capture/handoff source truth |
| publisher `Published` | `SandboxRelayDeliveryOutcome::Published` observation | relay record `apply_delivery_observation` + Version CAS | correlation mismatch；保留active attempt | `to_relay_status`、ack直接删relay truth |
| publisher `Retryable` | matching retryable observation | domain factory决定retry state/not-before | 同上 | blind retry或重建payload |
| publisher `DeadLetter` | publisher-terminal observation | domain factory决定dead-letter；source truth不变 | retry-exhausted basis拒绝 | publisher直接写status或伪造generic failed |
| provider side-effect unknown | `InfraError::ExternalSideEffectCommitUnknown` | exact persisted attempt/environment inspect | 不适用 | 猜成retryable/unavailable/failed |
| persistence commit unknown | `InfraError::PersistenceCommitUnknown` | exact persisted key/bundle inspect | 不适用 | 重写、补偿或按异常文本判定rollback |

converter只做typed carrier转换，不拥有transaction、status transition或public response mapping。application
trait在Step 7必须返回application/domain-owned type或`ApplicationError`；infra carrier只允许出现在concrete
adapter内部。adapter outcome成功仅说明provider result可分类，不说明domain已接受或UoW已提交。

#### 10.10.4 Negative cuts and diagnostic boundary

| negative cut | required result | forbidden result |
|---|---|---|
| 18-slot缺项、重复、乱序或marker错绑 | exact coverage error；LD-24发布0 handles | sort/dedup、按kind覆盖、补默认marker |
| selected projection/derived/reference store构造失败 | startup fail-fast / blocked | `OptionalDegradable` activation或带缺项generation |
| required slot startup health为Degraded/Unavailable | `StartupBlocked` | startup `Degraded` generation |
| optional external telemetry sink失效但formal audit/local diagnostic/redaction均完整 | infra-private reason可形成LD-22 `Degraded` | 新增第19 adapter kind或禁用audit |
| post-publication projection/reference/derived不可用 | exact runtime availability + operation-specific degraded/unavailable/no-write | 回写config summary或把mutation改为degraded allow |
| disabled slot被构造/探测 | `AdapterAvailabilityRelationInvalid` / activation mismatch | 暴露provider handle或标Available |
| provider返回raw body或adapter检测到forbidden external body | `ForbiddenExternalBody` + reject/quarantine + safe diagnostic | 删除字段后继续、保存body到error/audit/log |
| provider result无法进入finite branch | `AdapterOutcomeUnclassifiable` | 解析message/status code猜业务状态 |
| external call完成性未知 | `ExternalSideEffectCommitUnknown` + exact inspect | blind retry、新attempt、切target |
| repository commit完成性未知 | `PersistenceCommitUnknown` + exact identity inspect | 重新执行mutation或伪造rollback成功 |
| outcome correlation与loaded object不一致 | `AdapterOutcomeCorrelationMismatch` | 按latest scan改绑、丢弃后重试 |
| run launch/release使用establishment outcome | compile/static contract reject | 一个backend outcome覆盖三类生命周期 |
| infra error映射新增wildcard | closure gate失败 | `_ => Internal`或`to_string()` public reason |

允许的diagnostic hook只记录stable error variant、`SandboxAdapterKind`、startup/runtime phase、safe reason
或body-free diagnostic ref及低基数结果类；不得记录binding marker值、config/profile完整ref、generation、attempt、
endpoint、topic、path、credential、provider body、SQL/SDK/IO cause、stack或panic。formal audit仍由既有owner和UoW
形成，diagnostic不能替代accepted audit，也不能因外部sink不可用而输出raw troubleshooting内容。

#### 10.10.5 Historical consumer delta ledger

下表只登记后序回归义务。本批不修改Step 7/9/10/12，也不因旧消费者存在而为current contract保留alias：

| historical consumer | detected conflict | required later rewrite | current authority |
|---|---|---|---|
| Step 7 `IsolationBackendPort` | establish/launch/release都返回`IsolationBackendAdapterOutcome`，且application trait引用infra type | establish返回`IsolationEnvironmentEstablishmentResult`；launch返回`ControlledRunLifecycleObservation`；inspect/release返回`IsolationEnvironmentLifecycleObservation` | §9.10、§10.6 |
| Step 7 handoff port | application trait返回`MaterialHandoffAdapterOutcome` | trait返回domain-owned delivery observation或application-owned result；infra outcome仅在concrete adapter内部 | §10.7 |
| Step 7 publisher port | application trait返回`EventPublisherAdapterOutcome`，并写有delivered/retryable/dead-letter/failed四分支 | trait返回domain-owned relay observation；normal publisher闭集只`Published/Retryable/DeadLetter` | §10.8 |
| Step 7 runtime config port | 把summary当成一个可直接load的跨层port result | Step 14/Step 7按LD-17/21/22/24拆分builder-private assembly；application/domain不读取raw summary | §10.2~§10.5 |
| Step 9 infra mapping | 使用`InfraError::OutcomeClassificationMissing`并从generic outcome生成状态 | 改用18项exact error；先形成typed application/domain observation，再由domain factory接受 | §10.6~§10.9 |
| Step 10 boundary matrix | 调用不存在的`IsolationBackendAdapterOutcome::to_boundary_decision_status()` | 由application result correlation重验后调用exact boundary/handle domain factory | §9.10、§10.6 |
| Step 10 handoff / relay matrix | outcome/factory直接生成handoff或relay status，publisher可直接dead-letter | 只通过`apply_target_observation` / `apply_delivery_observation`及Version CAS推进 | §10.7~§10.8 |
| Step 10 runtime matrix | 单一`from_validated_config`混合LD-17、LD-22和LD-24 publication | 使用`from_validated_snapshot` + `evaluate_disposition`，LD-24独立原子发布 | §10.4 |
| Step 12 error model | 仅四项泛化`InfraError`，仍引用`OutcomeClassificationMissing` / `RuntimeBuilderFailed` | 重验为§10.9的18/18 variant、application/public mapping和exact inspection边界 | §10.9 |
| 正式historical `03` | 仍列旧五对象与四项error并可被误当实现输入 | 只在Step 19从回归确认产物重装配；当前不得定向patch正式文档 | 本文件 + flow/ledger freeze |

`OutcomeClassificationMissing`、`RuntimeBuilderFailed`、`to_boundary_decision_status`、
`to_handoff_status`、`to_relay_status`、generic publisher `Failed`和application trait中的三类infra outcome，
在current contract中均无兼容alias。后续回归若无法一次删除旧消费者，必须停为typed blocker，不能在
infra类型上补回shortcut。

#### 10.10.6 Static closure audit

| audit ID | current check | expected / result | design evidence / limitation |
|---|---|---|---|
| `6R05-AUD-INF-001` | canonical infra file owner | 6 planned infra files + 1 existing application `ports.rs`;duplicate owner 0 | §10.10.1；是设计映射，不是文件实现结果 |
| `6R05-AUD-INF-002` | logical adapter kind | 18/18 exact once | §10.3 enum与activation矩阵；telemetry/audit/diagnostic/entry不伪造slot |
| `6R05-AUD-INF-003` | activation closed values | 2 variants: `Required | Disabled` | selected projection/derived/reference均required；optional startup activation为0 |
| `6R05-AUD-INF-004` | binding / availability coverage | 18/18 same-order、same-marker | §10.3/§10.5；constructor禁止sort/dedup/missing disabled |
| `6R05-AUD-INF-005` | LD stage separation | LD-17 summary、LD-21 availability、LD-22 disposition、LD-24 publication各1 owner | §10.4；summary不携带generation/publication事实 |
| `6R05-AUD-INF-006` | startup / runtime degradation split | startup required failure blocked；post-publication按operation-specific surface | §10.3~§10.5与正式`04` §7.2.3/§9.3/§9.7~§9.9/§11.7 |
| `6R05-AUD-INF-007` | establishment outcome branch | 4/4；descriptor/lease/reason matrix closed | §10.6；failed partial保留cleanup obligation |
| `6R05-AUD-INF-008` | handoff outcome branch | 3/3；exact target attempt + generation | §10.7；provider unknown不猜Retryable |
| `6R05-AUD-INF-009` | publisher outcome branch | 3/3；`Published/Retryable/DeadLetter` | §10.8；generic `Failed/Delivered`为0 |
| `6R05-AUD-INF-010` | module dependency direction | application public signature引用infra type为0 | §9.10/§10.1/§10.10.3；Step 7 historical差集待后序改写 |
| `6R05-AUD-INF-011` | `InfraError` variant / mapping | 18/18 exact once；wildcard 0 | §10.9；设计静态计数，不是Rust exhaustiveness编译 |
| `6R05-AUD-INF-012` | forbidden body / raw cause | current stable field 0 | §10.2~§10.10；diagnostic只允许safe finite fields |
| `6R05-AUD-INF-013` | status shortcut | current `to_*_status` 0 | 三类converter只形成application/domain observation；status由domain factory推进 |
| `6R05-AUD-INF-014` | historical consumer inventory | 10/10 rows有later owner | §10.10.5；本批未跨步修改Step 7/9/10/12/正式`03` |
| `6R05-AUD-INF-015` | upstream semantic blocker | 0 new L1/L2 blocker | 当前差集均为Sandbox内部DesignReopen；既有implementation gate保持open |

上表的`pass`含义仅是文档声明、矩阵和名称的静态闭合。当前未创建Rust crate，未执行编译、lint、unit /
integration test、provider probe、startup、generation publication、数据库迁移、run、evidence或验收。

#### 10.10.7 Batch gate and next action

```text
current_document = 03-详细设计.md
current_step = Step 6 regression / 6R-05
current_batch = 6R-05 batch 2 infra
current_module = infra + application port result delta
current_object = config/binding/availability + establishment/handoff/publisher outcomes + InfraError
step_status = in_progress
batch_status = completed_wait_user_review
gate_status = completed_wait_user_review
object_gate_status = infra_contract_closed
next_allowed_action = wait_user_review_before_6R_05_batch_3_api_worker_jobs
adapter_kind = 18/18
activation_kind = 2/2_required_or_disabled
availability_coverage = 18/18
infra_error_mapping = 18/18_exact_once
application_infra_signature_dependency = 0_current_contract
historical_consumer_delta = 10/10_registered
formal_03_status = historical_reviewed_invalidated_by_design_reopen
implementation = CB-SBX-01A blocked / wait_design
real_test_execution = not_started
real_evidence_created = no
commit_required = no
```

本批完成后必须停审。用户确认前不得进入API/worker/jobs carrier、`6R-06`、Step 7或修改正式
`03~07`。用户确认后也只允许读取本节、Step 4/5 entry owner、shared registry与historical entry
consumers，开始`6R-05 batch 3 API/worker/jobs`；不得把一次“同意”扩展为完成整个Step 6。

## 11. Current canonical entry contract: API / worker / jobs batch 3

infra batch 2 已获用户确认，§10 保留为已确认历史停点。当前批次只定义 API、worker、jobs
模块拥有的 stable entry carrier 与模块错误；协议级 request / response / payload / receipt / report
schema 仍由回归后的 Step 8 拥有，exact callable 仍由回归后的 Step 7 拥有。

```text
current_document = 03-详细设计.md
current_step = Step 6 regression / 6R-05
current_batch = 6R-05 batch 3 API/worker/jobs
batch_status = historical_start_snapshot_consumed
gate_status = historical_start_snapshot_consumed
current_module = api + worker + jobs
current_object = entry envelopes/contexts/results/dispositions + ApiError/WorkerError/JobsError
next_allowed_action = superseded_by_§11.19.8
formal_03_status = historical_reviewed_invalidated_by_design_reopen
implementation = CB-SBX-01A blocked / wait_design
commit_required = no
```

上述代码块只保留batch 3开工事实；current恢复状态与下一动作只以§11.19.8为准。

### 11.1 输入、问题回答与 historical conflict ledger

| 问题 | current answer | 实现侧暂停条件 |
|---|---|---|
| entry carrier 是否拥有 protocol body | 否。只保存 selector、application call context、finite disposition、typed stored surface与body-free error。 | handler把request/response/event/job body写入entry object。 |
| entry 是否可读取 repository / adapter 反推结果 | 否。所有结果只来自application facade outcome、application error或stored replay。 | entry扫描repository、读取adapter private state或从counter反推refs。 |
| receipt / report status 是否是entry lifecycle | 否。它们是Step 8 public surface status；`EntryDisposition`只表达一次调用处置。 | Step 10把entry object当可迁移状态机。 |
| worker / jobs 是否可互调 | 否。二者只复用application facade；relay worker与relay job是不同运行形态。 | worker调用jobs crate，或jobs调用worker crate。 |
| raw cause是否进入module error | 否。只保存application body-free error、finite mismatch enum和固定safe reason。 | SQL/IO/HTTP/SDK/panic/config/body文本进入error字段。 |

| historical material | current disposition | reason / downstream action |
|---|---|---|
| generic `SandboxOpaqueRef`作为event、batch、run、cursor、report identity | invalidated | 分别使用closed selector、core `JobRunId`、typed stored surface或Step 7/8 exact carrier；不得兼容alias。 |
| `EntryDisposition`作为receipt/report状态 | invalidated | `EntryDisposition`非持久；public status继续使用shared §12.8 canonical enum。 |
| worker loop用`processed_refs/failed_refs`计数或repository scan生成结果 | invalidated | loop item必须保留application outcome/error，protocol mapper只能从该稳定输入展开。 |
| job accumulator只保留成功/失败计数 | invalidated | 每个target observation及其完整outcome/error必须移动到最终exit disposition并进入Step 8 report/stored replay。 |
| `SandboxConsumerApplicationReceipt` / `SandboxJobApplicationReport` | historical orphan | 不新增application同义对象；由`SandboxServiceOutcome`、stored surface和entry carrier分层承接。 |
| 原Step 10 receipt/report迁移矩阵 | downstream revalidation pending | batch 3只定义factory mapping；Step 10必须删除伪lifecycle transition。 |

### 11.2 Entry discovery: application context / accessor delta

Step 4同时规划常驻`event_relay_worker.rs`与one-shot`event_relay_publish.rs`。两者都消费既有
`SandboxJobKind::PublishSandboxEventRelay`语义，但前者必须保留`SandboxOperationChannel::Worker`，
不能伪装成`Job` channel，也不能新增第56个logical protocol。为此 application contract增加一个
checked factory；42项selector-to-operation mapping和duplicate identity均保持不变。

新增 callable 的 canonical 声明已回写§9.2、§9.4与§9.6，本节只登记消费关系，不形成第二份签名。
`from_worker_job`只复用§9.2既有10项job operation mapping，并由§9.2 allow-set进一步限制为
`PublishSandboxEventRelay`；factory校验顺序与`from_worker`一致并把channel固定为`Worker`。它不允许
caller传`OperationName`，不改变`matches_duplicate_identity`故意排除channel的规则。accessor全部
只读，`into_parts`是唯一owned consuming path；两者都不开放private field mutation、DTO body或
repository handle。

| discovery delta | before | current | downstream obligation |
|---|---|---|---|
| relay worker context | 只能误用`from_job`或无合法factory | `from_worker_job(PublishSandboxEventRelay, ...)` | Step 7 entry adapter与Step 9 relay worker flow必须使用该factory。 |
| outcome mapping | entry只能猜private status/ref | four read-only accessor families + lossless `into_parts` | 借用映射读取accessor；需要取得stored ownership的entry必须消费`into_parts`，禁止clone/serialization round-trip。 |
| stored result mapping | 只有surface accessor | operation/kind/status/surface accessor齐全 | API/worker/jobs必须验证expected surface kind；不得解析surface ref文本。 |

### 11.3 API capability、对象与文件 owner

| capability | input | output | side effect | object owner | defer |
|---|---|---|---|---|---|
| normalize command context | validated command selector + body-free metadata | `SandboxApiCommandEnvelope` | none | `command_handlers.rs` | exact request DTO / handler flow到Step 8/9。 |
| normalize query context | validated query selector + body-free metadata | `SandboxApiQueryEnvelope` | none / no-write | `query_handlers.rs` | exact query DTO / view到Step 8。 |
| map command/query/error surface | application outcome/query status/error | `SandboxApiDisposition` | none | `routes.rs` | transport code/body到Step 8。 |
| retain API-local mismatch | context/surface mapping failure | `ApiError` | none | `errors.rs` | recovery/telemetry到Step 12/15。 |

| object | category | capability | forbidden responsibility |
|---|---|---|---|
| `SandboxApiCommandEnvelope` | transient entry shell | bind command selector to exact application context | request body、route、repository、domain transition。 |
| `SandboxApiQueryEnvelope` | transient no-write entry shell | bind query selector to exact application context | idempotency key、write UoW、projection repair。 |
| `SandboxApiDisposition` | transient response-control union | exhaustive command/query/error disposition mapping | response DTO body、HTTP/RPC status code truth、persisted lifecycle。 |
| `ApiError` | API-local finite error | retain application error or exact mapping defect | raw cause、adapter error、public DTO。 |

### 11.4 `SandboxApiCommandEnvelope`

```rust
/// API handler在解析protocol DTO后形成的body-free command entry shell。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct SandboxApiCommandEnvelope {
    /// 由Step 8 request DTO closed variant确定的command selector。
    command_kind: SandboxCommandKind,
    /// 通过application checked factory形成的完整调用语境。
    call_context: SandboxServiceCallContext,
}

impl SandboxApiCommandEnvelope {
    /// 从已验证metadata和frozen request fingerprint构造command entry shell。
    pub fn try_new(
        command_kind: SandboxCommandKind,
        actor_ref: ActorRef,
        trace_context: SandboxTraceContext,
        request_digest: RequestPayloadFingerprint,
        idempotency_key: IdempotencyKey,
    ) -> Result<Self, ApiError>;

    /// 返回closed command selector；不得从route反向恢复。
    pub fn command_kind(&self) -> SandboxCommandKind;

    /// 返回已校验application调用语境。
    pub fn call_context(&self) -> &SandboxServiceCallContext;

    /// 移交application调用语境；不携带request DTO body。
    pub fn into_call_context(self) -> SandboxServiceCallContext;
}
```

| field | exact type | source | invariant / missing behavior |
|---|---|---|---|
| `command_kind` | `SandboxCommandKind` | Step 8 command DTO variant的1:1 mapping | 不从route、method string或`OperationName`反推。 |
| `call_context` | `SandboxServiceCallContext` | `SandboxServiceCallContext::from_command` | actor/trace/digest/key任一非法时返回`ApiError::Application`，不调用service。 |

`try_new`必须直接调用`from_command(command_kind, ...)`，不得自己复制operation-name映射或字段校验。
对象不实现protocol `Deserialize`；Step 8 DTO先做schema validation，再调用本factory。

### 11.5 `SandboxApiQueryEnvelope`

```rust
/// API handler在解析protocol DTO后形成的body-free、严格no-write query entry shell。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct SandboxApiQueryEnvelope {
    /// 由Step 8 request DTO closed variant确定的query selector。
    query_kind: SandboxQueryKind,
    /// 通过application query factory形成且不含idempotency key的调用语境。
    call_context: SandboxServiceCallContext,
}

impl SandboxApiQueryEnvelope {
    /// 从已验证metadata和frozen request fingerprint构造query entry shell。
    pub fn try_new(
        query_kind: SandboxQueryKind,
        actor_ref: ActorRef,
        trace_context: SandboxTraceContext,
        request_digest: RequestPayloadFingerprint,
    ) -> Result<Self, ApiError>;

    /// 返回closed query selector；不得从route反向恢复。
    pub fn query_kind(&self) -> SandboxQueryKind;

    /// 返回已校验no-write application调用语境。
    pub fn call_context(&self) -> &SandboxServiceCallContext;

    /// 移交no-write application调用语境。
    pub fn into_call_context(self) -> SandboxServiceCallContext;
}
```

| field | exact type | source | invariant / missing behavior |
|---|---|---|---|
| `query_kind` | `SandboxQueryKind` | Step 8 query DTO variant的1:1 mapping | 不从route、response kind或projection ref推导。 |
| `call_context` | `SandboxServiceCallContext` | `SandboxServiceCallContext::from_query` | channel必须`ApiQuery`且key必须`None`；非法时不创建UoW。 |

`try_new`必须直接调用`from_query(query_kind, ...)`。任何API local metadata中出现write idempotency
key时，Step 8 mapper必须在调用factory前拒绝；不得丢弃key后继续查询。

### 11.6 `SandboxApiDisposition`

```rust
/// API entry在transport rendering前形成的一次性、body-free处置结果。
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum SandboxApiDisposition {
    /// command拥有完整stored public surface，可按status渲染或duplicate replay。
    Command {
        /// 与stored operation严格一致的closed command selector。
        command_kind: SandboxCommandKind,
        /// Step 8 command result builder形成的caller-visible status。
        result_status: SandboxCommandResultStatus,
        /// application outcome携带的完整stored result carrier。
        stored_result: SandboxStoredOperationResult,
    },
    /// query只携带最终public surface status；response body由Step 8 DTO拥有。
    Query {
        /// access decision与exact reader共同形成的最终surface status。
        surface_status: SandboxQuerySurfaceStatus,
    },
    /// API-local或application error；transport只能读取其caller-safe mapping。
    Error(ApiError),
}

impl SandboxApiDisposition {
    /// 从Step 8 command status与application outcome构造command disposition。
    pub fn from_command_outcome(
        command_kind: SandboxCommandKind,
        result_status: SandboxCommandResultStatus,
        outcome: SandboxServiceOutcome,
    ) -> Result<Self, ApiError>;

    /// 从最终query surface构造query disposition，不接受access-only status。
    pub fn from_query_surface(surface_status: SandboxQuerySurfaceStatus) -> Self;

    /// 将API/application error保留为body-free error disposition。
    pub fn from_error(error: ApiError) -> Self;

    /// 穷尽派生本次entry调用的有限处置，不读取transport配置。
    pub fn entry_disposition(&self) -> EntryDisposition;

    /// 返回command stored surface；非command分支返回None。
    pub fn stored_result(&self) -> Option<&SandboxStoredOperationResult>;

    /// 移交command selector、public status和stored surface；非command分支原样返回自身。
    pub fn into_command_parts(
        self,
    ) -> Result<
        (
            SandboxCommandKind,
            SandboxCommandResultStatus,
            SandboxStoredOperationResult,
        ),
        Self,
    >;
}
```

`from_command_outcome`先调用`outcome.validate_shape()`，再调用`outcome.into_parts()`取得完整字段，
要求truth / side-effect / reason shape仍与status一致，并要求stored result存在、
`result_kind == CommandResult`，再调用`stored_result.validate_for_command(command_kind)`，最后执行下列
穷尽关系；任何不匹配都返回`ApiError`而不是改写status。
构造成功后只将owned stored result写入`Command`分支；truth/side-effect/reason已经由application
validator消费，不复制进API对象，也不得被API用于反推command语义：

| `ServiceOutcomeStatus` | allowed `SandboxCommandResultStatus` | required stored status | `EntryDisposition` |
|---|---|---|---|
| `Accepted` | `Accepted` | `Completed` | `Accepted` |
| `Rejected` | `Rejected` | `Rejected` | `Rejected` |
| `Degraded` | `Degraded` | `Completed` | `Accepted` |
| `NoChange` | `Pending` | `Completed` | `Accepted` |
| `NoWrite` | none | none | error `CommandOutcomeMissingStoredResult` |
| `Failed` | `Failed` | `Failed` | `Failed` |
| `DuplicateReplayed` | `DuplicateReplayed` | `Completed | Rejected | Failed` | `Accepted` |

`Pending`只表示完整command surface诚实记录后续前置未闭合，不表示entry或application outcome仍在
内存中运行。该调用已经合法进入application并保存可重放surface，因此其entry disposition必须为
`Accepted`；`Skipped`只保留给consumer `NoOp`、无eligible maintenance item或明确skip guard，不能把
command `Pending`伪装成未执行。duplicate必须移动既有完整stored result，不能读取current truth重建。
`into_command_parts`只消费已经构造成功的disposition，不读取repository；对非command返回原值，
调用方不得通过error分支丢弃`ApiError`。API response mapper必须使用返回的`command_kind`，不得从
route或stored operation字符串反向恢复selector。

query status到entry disposition固定为：

| query surface | entry disposition | boundary |
|---|---|---|
| `Visible | Empty | Restricted | Stale | Degraded` | `Accepted` | 合法public surface；不得因degraded改写成success truth。 |
| `NotVisible | Disabled` | `Rejected` | 不读取目标正文；transport不得泄露存在性。 |
| `Rebuilding | MissingProjection | Unavailable` | `Delayed` | 允许条件变化后重新查询；entry自身不触发repair/rebuild。 |
| `Failed` | `Failed` | 仅渲染caller-safe error surface，不暴露repository cause。 |

以上11/11 variant必须显式match，禁止wildcard。transport status/code、response DTO和retry header仍由
Step 8拥有；`SandboxApiDisposition`不实现`Serialize/Deserialize`，也不持久化。

`Error(ApiError)`到entry disposition固定为：

| error branch / application kind | entry disposition | boundary |
|---|---|---|
| `InvalidRequest | UnsupportedVersion | ForbiddenExternalBody` | `Rejected` | application调用前拒绝。 |
| three command relation defects | `Failed` | entry/application wiring缺陷。 |
| `Application(Validation | ForbiddenExternalBody | NotAuthorized | NotVisible | IdempotencyConflict | BoundaryRejected | PolicyFailClosed | UnsupportedVersion | Quarantined | Disabled)` | `Rejected` | caller或业务前置明确不允许。 |
| `Application(ReferenceUnresolved | VersionConflict | PortUnavailable)` | `Delayed` | 条件变化后可按Step 8/12 policy重试；entry不自行重试。 |
| `Application(DuplicateMissingResult | NoWriteViolation | Internal)` | `Failed` | 完整性或实现缺陷，不能重跑猜测。 |

16/16 `ApplicationErrorKind`和7/7 `ApiError` variant必须显式match，禁止以`is_retryable()`单独决定
entry disposition；retryable只进入Step 8 retry hint，不能把业务拒绝改写为延迟。

### 11.7 `ApiError`

```rust
/// API crate在application调用前后使用的body-free有限错误。
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum ApiError {
    /// application checked factory、service或outcome validator返回的稳定错误。
    Application(ApplicationError),
    /// API protocol输入在application调用前不满足最小结构要求。
    InvalidRequest {
        /// API boundary已脱敏的固定理由。
        reason: SandboxReason,
        /// 已验证时才保留的trace；不得临时生成。
        trace_context: Option<SandboxTraceContext>,
    },
    /// API protocol/schema version不受支持。
    UnsupportedVersion {
        /// 不包含request body或版本原文的安全理由。
        reason: SandboxReason,
        /// 已验证时才保留的trace。
        trace_context: Option<SandboxTraceContext>,
    },
    /// API request试图携带Sandbox禁止保存的外部正文。
    ForbiddenExternalBody {
        /// 由forbidden-body guard形成的安全理由。
        reason: SandboxReason,
        /// 已验证时才保留的trace。
        trace_context: Option<SandboxTraceContext>,
    },
    /// command outcome没有required stored surface。
    CommandOutcomeMissingStoredResult {
        /// 发生缺口时的finite outcome status。
        outcome_status: ServiceOutcomeStatus,
    },
    /// command outcome指向非command stored surface。
    CommandStoredResultKindMismatch {
        /// 实际closed surface kind。
        actual: SandboxStoredResultKind,
    },
    /// command public status、outcome status与stored status关系不一致。
    CommandStatusRelationMismatch {
        /// application finite outcome status。
        outcome_status: ServiceOutcomeStatus,
        /// Step 8 public command status。
        result_status: SandboxCommandResultStatus,
        /// persisted stored result status。
        stored_status: SandboxStoredOperationResultStatus,
    },
}

impl ApiError {
    /// 穷尽映射caller-safe public error kind。
    pub fn to_public_error_kind(&self) -> SandboxPublicErrorKind;

    /// 返回条件变化后是否允许由外层policy重试。
    pub fn is_retryable(&self) -> bool;

    /// 返回body-free safe reason；relation defect使用固定template构造值。
    pub fn safe_reason(&self) -> SandboxReason;

    /// 返回已验证trace；无trace的relation defect返回None。
    pub fn trace_context(&self) -> Option<&SandboxTraceContext>;
}

impl From<ApplicationError> for ApiError {
    /// 只包装application error，不重分类或保存Display文本。
    fn from(error: ApplicationError) -> Self;
}
```

| variant | public kind | retryable | safe reason source | forbidden payload |
|---|---|---:|---|---|
| `Application(error)` | `error.to_public_error_kind()` | `error.is_retryable()` | `error.reason()` | application raw cause / adapter detail。 |
| `InvalidRequest` | `Validation` | false | API fixed validation template | request body、route dump。 |
| `UnsupportedVersion` | `UnsupportedVersion` | false | API fixed compatibility template | raw envelope/body。 |
| `ForbiddenExternalBody` | `ForbiddenExternalBody` | false | body exclusion guard | external body或location secret。 |
| `CommandOutcomeMissingStoredResult` | `Internal` | false | fixed missing-stored-result template | serialized outcome、DTO、stack trace。 |
| `CommandStoredResultKindMismatch` | `Internal` | false | fixed stored-kind template | serialized outcome、DTO、stack trace。 |
| `CommandStatusRelationMismatch` | `Internal` | false | fixed command-relation template | serialized outcome、DTO、stack trace。 |

`ApiError`必须提供`to_public_error_kind()`、`is_retryable()`、`safe_reason()`和`trace_context()`，每个
method逐variant显式match。`ApplicationError`由`From<ApplicationError>`只包装不重分类；不存在
`From<InfraError>`、`From<Box<dyn Error>>`、`to_string()` reason或`_ => Internal`。

### 11.8 Worker capability、对象与文件 owner

| capability | input | output | side effect | object owner | defer |
|---|---|---|---|---|---|
| map trusted inbound consumer | validated event identity + context + application outcome | `SandboxConsumerReceipt` | none in worker；truth/stored surface已由application管理 | three `*_consumers.rs` | exact event DTO/ack flow到Step 8/9。 |
| drive controlled fulfillment | system actor + one frozen item request | `SandboxFulfillmentLoopResult` | none in worker | `fulfillment_worker.rs` | item selection/call order到Step 7/9。 |
| drive event relay batch | system actor + one frozen relay batch request | `SandboxRelayLoopResult` | none in worker；publisher no-rollback由application/infra执行 | `event_relay_worker.rs` | batch selection/retry到Step 7/9/13。 |
| provide runtime-safe run context | trusted runtime metadata | `SandboxWorkerRunContext` | none | `worker_runtime.rs` | runtime assembly/config binding到Step 7/14。 |
| retain worker-local mapping failure | application/error/relation mismatch | `WorkerError` | none | `errors.rs` | recovery/ack/telemetry到Step 9/12/15。 |

```rust
/// 常驻Sandbox worker运行形态闭集；不是protocol selector或lifecycle状态。
#[derive(Clone, Copy, Debug, Eq, Hash, Ord, PartialEq, PartialOrd)]
pub enum SandboxWorkerKind {
    /// 为已选中的controlled execution run驱动正式fulfillment调用。
    ControlledExecutionFulfillment,
    /// 以常驻loop运行既有PublishSandboxEventRelay maintenance语义。
    EventRelay,
}
```

| variant | Rustdoc / source | fixed selector | forbidden substitution |
|---|---|---|---|
| `ControlledExecutionFulfillment` | `sandbox-fulfillment-worker` runtime assembly | `StartControlledExecutionRun | RecordCaptureResult | OpenMaterialHandoff | ClassifySandboxFailure` closed allow-set | caller command string、runtime agent-loop action、control/cleanup/redline command。 |
| `EventRelay` | `sandbox-control-worker` event-relay assembly | `SandboxJobKind::PublishSandboxEventRelay` | jobs crate调用、topic string、publisher kind。 |

`SandboxWorkerKind`只分类runtime entry，不进入shared 39项status owner，不持久化为domain state，
也不扩大55项protocol selector。worker不能用配置添加第三种kind；新增运行形态必须先回到Step 4/5。

### 11.9 `SandboxWorkerRunContext`

```rust
/// 一次常驻worker loop invocation使用的body-free运行语境。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct SandboxWorkerRunContext {
    /// 由runtime assembly固定的worker形态。
    worker_kind: SandboxWorkerKind,
    /// 受信任system actor；不得从payload或binary username构造。
    system_actor_ref: ActorRef,
    /// 本次loop invocation继承的checked trace identity。
    trace_context: SandboxTraceContext,
    /// clock port提供的逻辑开始时间；不充当run identity或version。
    started_at: Timestamp,
}

impl SandboxWorkerRunContext {
    /// 构造controlled execution fulfillment worker语境。
    pub fn start_fulfillment(
        system_actor_ref: ActorRef,
        trace_context: SandboxTraceContext,
        started_at: Timestamp,
    ) -> Result<Self, WorkerError>;

    /// 构造常驻event relay worker语境。
    pub fn start_event_relay(
        system_actor_ref: ActorRef,
        trace_context: SandboxTraceContext,
        started_at: Timestamp,
    ) -> Result<Self, WorkerError>;

    /// 为一个frozen fulfillment item构造application Worker-channel context。
    pub fn fulfillment_call_context(
        &self,
        command_kind: SandboxCommandKind,
        request_digest: RequestPayloadFingerprint,
        idempotency_key: IdempotencyKey,
    ) -> Result<SandboxServiceCallContext, WorkerError>;

    /// 为一个frozen relay batch构造application Worker-channel job context。
    pub fn relay_call_context(
        &self,
        request_digest: RequestPayloadFingerprint,
        idempotency_key: IdempotencyKey,
    ) -> Result<SandboxServiceCallContext, WorkerError>;

    /// 返回固定worker形态。
    pub fn worker_kind(&self) -> SandboxWorkerKind;

    /// 返回受信任system actor。
    pub fn system_actor_ref(&self) -> &ActorRef;

    /// 返回本次loop trace，不生成子trace。
    pub fn trace_context(&self) -> &SandboxTraceContext;

    /// 返回clock port提供的开始时间。
    pub fn started_at(&self) -> &Timestamp;

}
```

| callable | exact delegation | wrong-kind behavior | prohibited behavior |
|---|---|---|---|
| `start_*` | 调用`SandboxServiceCallContext::validate_system_actor_ref`后固定kind；`SandboxTraceContext`已由其checked constructor/deserialize建立 | actor invalid时包装`WorkerError::Application`；不存在对已构造trace的二次字符串校验 | 不生成worker run ref；不读config body；不把System kind当业务授权。 |
| `fulfillment_call_context` | `from_worker(command_kind, ...)`，command必须命中四项closed allow-set | context kind不是fulfillment时`WorkerKindMismatch`；selector越界由`Application(ChannelMismatch)`拒绝 | selector来自Step 7 frozen fulfillment item，不来自CLI/body string；不承接tools/runtime semantic loop，不从run ref计算digest/key。 |
| `relay_call_context` | `from_worker_job(PublishSandboxEventRelay, ...)` | context kind不是event relay时`WorkerKindMismatch` | 不调用jobs crate；不从topic/publisher猜operation。 |

run context不持有batch ref、repository cursor、adapter handle或item列表。selection由Step 7 application
facade返回；request fingerprint和key由每个frozen item/batch输入提供，不能从`started_at`或trace派生。

### 11.10 `SandboxConsumerReceipt`

```rust
/// Worker在application consumer调用完成后持有的body-free receipt carrier。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct SandboxConsumerReceipt {
    /// Step 8 envelope提供的non-empty外部source event identity。
    source_event_ref: ResourceRef,
    /// 与application context operation mapping一致的closed consumer selector。
    consumer_kind: SandboxConsumerKind,
    /// 从validated inbound envelope继承的checked trace；不得在receipt阶段生成。
    trace_context: SandboxTraceContext,
    /// 由application consumer facade明确返回的public receipt status。
    receipt_status: SandboxConsumerReceiptStatus,
    /// 完整application outcome；保存truth/side-effect/stored-surface来源，不保存DTO body。
    outcome: SandboxServiceOutcome,
}

impl SandboxConsumerReceipt {
    /// 从application facade明确返回的status与outcome构造receipt。
    pub fn from_application_outcome(
        source_event_ref: ResourceRef,
        consumer_kind: SandboxConsumerKind,
        trace_context: SandboxTraceContext,
        receipt_status: SandboxConsumerReceiptStatus,
        outcome: SandboxServiceOutcome,
    ) -> Result<Self, WorkerError>;

    /// 返回source event identity；只用于ack/quarantine correlation。
    pub fn source_event_ref(&self) -> &ResourceRef;

    /// 返回closed consumer selector。
    pub fn consumer_kind(&self) -> SandboxConsumerKind;

    /// 返回从inbound envelope继承的trace identity。
    pub fn trace_context(&self) -> &SandboxTraceContext;

    /// 返回public receipt status。
    pub fn receipt_status(&self) -> SandboxConsumerReceiptStatus;

    /// 返回完整application outcome，供Step 8 mapper逐字段复制。
    pub fn outcome(&self) -> &SandboxServiceOutcome;

    /// 穷尽派生entry处置；transport ack/retry policy仍由Step 9/12拥有。
    pub fn entry_disposition(&self) -> EntryDisposition;

    /// 移交全部receipt字段；不得只取outcome而丢失source/selector/trace/status。
    pub fn into_parts(
        self,
    ) -> (
        ResourceRef,
        SandboxConsumerKind,
        SandboxTraceContext,
        SandboxConsumerReceiptStatus,
        SandboxServiceOutcome,
    );
}
```

factory固定执行：source event ref non-empty -> `outcome.validate_shape()` -> stored result存在 ->
`result_kind == ConsumerReceipt` -> `stored_result.validate_for_consumer(consumer_kind)` -> 下表status relation。
它不读取stored surface body，也不从source event ref反推consumer kind：

| receipt status | allowed outcome status | required stored status | entry disposition |
|---|---|---|---|
| `Accepted` | `Accepted` | `Completed` | `Accepted` |
| `Duplicate` | `DuplicateReplayed` | `Completed | Rejected | Failed` | `Accepted` |
| `Delayed` | `NoChange | Degraded` | `Completed` | `Delayed` |
| `Rejected` | `Rejected` | `Rejected` | `Rejected` |
| `Failed` | `Failed` | `Failed` | `Failed` |
| `Quarantined` | `Rejected | NoChange` | `Rejected | Completed` respectively | `Rejected` |
| `NoOp` | `NoChange` | `Completed` | `Skipped` |

7/7 receipt variants与7项application outcome variants必须显式match。`Quarantined + NoChange`仅在
quarantine marker已由正式application flow持久化并形成完整Completed receipt surface时允许；否则使用
Rejected。`Delayed/Failed`的transport ack/retry不能仅由public status推导，必须结合Step 12 exact error /
retry policy；本对象只返回finite entry disposition。

### 11.11 Fulfillment / relay loop results

```rust
/// 一次fulfillment worker item调用完成后的不可持久化结果carrier。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct SandboxFulfillmentLoopResult {
    /// 仅允许`ControlledExecutionFulfillment`的运行语境。
    run_context: SandboxWorkerRunContext,
    /// 本item实际调用的四项closed fulfillment command之一。
    command_kind: SandboxCommandKind,
    /// Step 8 command surface builder明确返回的public status。
    result_status: SandboxCommandResultStatus,
    /// application facade返回的完整outcome；不得由worker重建。
    outcome: SandboxServiceOutcome,
    /// clock port在application调用返回后提供的完成时间。
    finished_at: Timestamp,
}

/// 一次常驻event-relay worker batch调用完成后的不可持久化结果carrier。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct SandboxRelayLoopResult {
    /// 仅允许`EventRelay`的运行语境。
    run_context: SandboxWorkerRunContext,
    /// application relay facade明确返回的public job-report status。
    report_status: SandboxJobReportStatus,
    /// relay application facade返回的完整outcome；publish failure不回滚source truth。
    outcome: SandboxServiceOutcome,
    /// clock port在application调用返回后提供的完成时间。
    finished_at: Timestamp,
}

impl SandboxFulfillmentLoopResult {
    /// 从fulfillment run context与完整application outcome结束一次item调用。
    pub fn finish(
        run_context: SandboxWorkerRunContext,
        command_kind: SandboxCommandKind,
        result_status: SandboxCommandResultStatus,
        outcome: SandboxServiceOutcome,
        finished_at: Timestamp,
    ) -> Result<Self, WorkerError>;

    /// 返回完整outcome，供Step 8 command-result或stored-replay mapper读取。
    pub fn outcome(&self) -> &SandboxServiceOutcome;

    /// 返回经穷尽关系校验的public command status。
    pub fn result_status(&self) -> SandboxCommandResultStatus;

    /// 返回本item实际调用的closed command selector。
    pub fn command_kind(&self) -> SandboxCommandKind;

    /// 返回本次fulfillment loop运行语境。
    pub fn run_context(&self) -> &SandboxWorkerRunContext;

    /// 返回application调用完成后的正式clock时间。
    pub fn finished_at(&self) -> &Timestamp;

    /// 穷尽派生本次item entry disposition。
    pub fn entry_disposition(&self) -> EntryDisposition;

    /// 移交全部loop字段；不得只取outcome或计数。
    pub fn into_parts(
        self,
    ) -> (
        SandboxWorkerRunContext,
        SandboxCommandKind,
        SandboxCommandResultStatus,
        SandboxServiceOutcome,
        Timestamp,
    );
}

impl SandboxRelayLoopResult {
    /// 从relay run context与完整application outcome结束一次batch调用。
    pub fn finish(
        run_context: SandboxWorkerRunContext,
        report_status: SandboxJobReportStatus,
        outcome: SandboxServiceOutcome,
        finished_at: Timestamp,
    ) -> Result<Self, WorkerError>;

    /// 返回完整outcome，供Step 8 job-report/stored-replay mapper读取。
    pub fn outcome(&self) -> &SandboxServiceOutcome;

    /// 返回经穷尽关系校验的public relay report status。
    pub fn report_status(&self) -> SandboxJobReportStatus;

    /// 返回本次relay loop运行语境。
    pub fn run_context(&self) -> &SandboxWorkerRunContext;

    /// 返回application调用完成后的正式clock时间。
    pub fn finished_at(&self) -> &Timestamp;

    /// 穷尽派生本次batch entry disposition。
    pub fn entry_disposition(&self) -> EntryDisposition;

    /// 移交全部loop字段；不得只取relay counters或outcome。
    pub fn into_parts(
        self,
    ) -> (
        SandboxWorkerRunContext,
        SandboxJobReportStatus,
        SandboxServiceOutcome,
        Timestamp,
    );
}
```

| object | required worker kind | required stored kind | accepted outcome statuses | forbidden source |
|---|---|---|---|---|
| `SandboxFulfillmentLoopResult` | `ControlledExecutionFulfillment` | `CommandResult` | all except`NoWrite` | repository scan、backend handle state、run status推导；只记录四项Sandbox-owned fulfillment command之一，不代表runtime agent loop已执行。 |
| `SandboxRelayLoopResult` | `EventRelay` | `JobReport` | all except`NoWrite` | publisher private outcome、relay repository scan、counter-only summary；`JobReport`是application-owned stored public surface kind，不是jobs crate对象。 |

两个`finish`均执行：worker-kind check -> `outcome.validate_shape()` -> reject `NoWrite` -> required stored
result/kind check -> fulfillment调用`validate_for_command(command_kind)`并重验四项allow-set、relay调用
`validate_for_job(PublishSandboxEventRelay)` -> `finished_at >= started_at`。`DuplicateReplayed`仍必须携带原完整stored surface；
`NoChange`表示本批没有eligible item但已形成可重放surface。它们不实现`Serialize/Deserialize`，也不拥有
worker lifecycle status。

fulfillment与relay必须各自逐7项显式match，不能共用一个会丢失`Pending`与empty-selection差异的helper：

| outcome status | allowed fulfillment command status | fulfillment disposition |
|---|---|---|
| `Accepted` | `Accepted` | `Accepted` |
| `Rejected` | `Rejected` | `Rejected` |
| `Degraded` | `Degraded` | `Accepted` |
| `NoChange` | `Pending` | `Accepted` |
| `NoWrite` | none | construction error |
| `Failed` | `Failed` | `Failed` |
| `DuplicateReplayed` | `DuplicateReplayed` | `Accepted` |

| outcome status | allowed relay report status | relay disposition |
|---|---|---|
| `Accepted` | `Succeeded` | `Accepted` |
| `Rejected` | none | construction error |
| `Degraded` | `PartialFailed | Degraded` | `Accepted` |
| `NoChange` | `Skipped` | `Skipped` |
| `NoWrite` | none | construction error |
| `Failed` | `Failed` | `Failed` |
| `DuplicateReplayed` | `DuplicateReplayed` | `Accepted` |

fulfillment status来自Step 8 command surface builder，relay status来自application relay facade / stored
report finalizer；worker只能校验并保存，不能从truth refs、item counters、publisher outcome或repository
scan推导。关系不匹配分别返回`WorkerError::FulfillmentStatusRelationMismatch`或
`WorkerError::RelayStatusRelationMismatch`。relay `Rejected`不是合法batch report；selection/input级拒绝
应在构造loop result前返回`WorkerError`或application error，不伪造一个job report status。

### 11.12 `WorkerError`

```rust
/// Worker crate在consumer、fulfillment和relay entry边界使用的body-free有限错误。
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum WorkerError {
    /// application checked factory、service或outcome validator返回的稳定错误。
    Application(ApplicationError),
    /// inbound envelope在application调用前不满足最小结构要求。
    InvalidEnvelope {
        /// worker boundary固定的安全理由。
        reason: SandboxReason,
        /// envelope已验证时继承的trace。
        trace_context: Option<SandboxTraceContext>,
    },
    /// inbound schema version不受支持。
    UnsupportedVersion {
        /// 不含raw envelope/version body的安全理由。
        reason: SandboxReason,
        /// envelope已验证时继承的trace。
        trace_context: Option<SandboxTraceContext>,
    },
    /// inbound source/schema/body需要隔离处置。
    Quarantined {
        /// guard或source validator形成的安全理由。
        reason: SandboxReason,
        /// envelope已验证时继承的trace。
        trace_context: Option<SandboxTraceContext>,
    },
    /// run-context kind与调用的worker helper不一致。
    WorkerKindMismatch {
        /// helper要求的固定kind。
        expected: SandboxWorkerKind,
        /// context实际kind。
        actual: SandboxWorkerKind,
    },
    /// consumer或loop outcome缺少required stored surface。
    StoredResultMissing {
        /// consumer/worker调用的finite outcome status。
        outcome_status: ServiceOutcomeStatus,
    },
    /// consumer或loop stored surface kind不符合entry角色。
    StoredResultKindMismatch {
        /// 当前entry要求的surface kind。
        expected: SandboxStoredResultKind,
        /// application实际返回的surface kind。
        actual: SandboxStoredResultKind,
    },
    /// receipt status、outcome status与stored status关系不一致。
    ReceiptStatusRelationMismatch {
        /// public receipt status。
        receipt_status: SandboxConsumerReceiptStatus,
        /// application finite outcome status。
        outcome_status: ServiceOutcomeStatus,
        /// persisted stored-result status。
        stored_status: SandboxStoredOperationResultStatus,
    },
    /// worker-like调用错误返回了query-only NoWrite。
    NoWriteOutcomeForbidden {
        /// 发生缺口的worker形态。
        worker_kind: SandboxWorkerKind,
    },
    /// clock port返回的完成时间早于run context开始时间。
    CompletionTimeBeforeStart {
        /// 发生时间倒序的worker形态。
        worker_kind: SandboxWorkerKind,
    },
    /// fulfillment outcome、public command status与stored status关系不一致。
    FulfillmentStatusRelationMismatch {
        /// application finite outcome status。
        outcome_status: ServiceOutcomeStatus,
        /// public command result status。
        result_status: SandboxCommandResultStatus,
        /// persisted stored-result status。
        stored_status: SandboxStoredOperationResultStatus,
    },
    /// relay outcome、public job report status与stored status关系不一致。
    RelayStatusRelationMismatch {
        /// application finite outcome status。
        outcome_status: ServiceOutcomeStatus,
        /// public relay report status。
        report_status: SandboxJobReportStatus,
        /// persisted stored-result status。
        stored_status: SandboxStoredOperationResultStatus,
    },
}

impl WorkerError {
    /// 穷尽映射caller-safe public error kind；不得使用wildcard arm。
    pub fn to_public_error_kind(&self) -> SandboxPublicErrorKind;

    /// 返回条件变化后是否允许由外层worker policy重新调度。
    pub fn is_retryable(&self) -> bool;

    /// 返回body-free safe reason；结构/关系缺陷使用固定template构造值。
    pub fn safe_reason(&self) -> SandboxReason;

    /// 返回已验证trace；没有可信trace的worker-local缺陷返回None。
    pub fn trace_context(&self) -> Option<&SandboxTraceContext>;

    /// 穷尽派生一次worker entry处置；不决定transport ack、dead-letter或退避时间。
    pub fn entry_disposition(&self) -> EntryDisposition;
}

impl From<ApplicationError> for WorkerError {
    /// 只包装application error，不重分类、解析reason或保存Display文本。
    fn from(error: ApplicationError) -> Self;
}
```

12/12 variant的exact mapping如下；`entry_disposition()`必须逐variant match，不能只看public kind或
`is_retryable()`：

| `WorkerError` variant | public kind | retryable | safe reason source | entry disposition |
|---|---|---:|---|---|
| `Application(error)` | `error.to_public_error_kind()` | `error.is_retryable()` | `error.reason()`的checked clone | 按下方16/16 application-kind矩阵 |
| `InvalidEnvelope` | `Validation` | false | variant `reason` | `Rejected` |
| `UnsupportedVersion` | `UnsupportedVersion` | false | variant `reason` | `Rejected` |
| `Quarantined` | `Quarantined` | false | variant `reason` | `Rejected` |
| `WorkerKindMismatch` | `Internal` | false | fixed worker-kind template | `Failed` |
| `StoredResultMissing` | `Internal` | false | fixed stored-result template | `Failed` |
| `StoredResultKindMismatch` | `Internal` | false | fixed stored-kind template | `Failed` |
| `ReceiptStatusRelationMismatch` | `Internal` | false | fixed receipt-relation template | `Failed` |
| `NoWriteOutcomeForbidden` | `Internal` | false | fixed no-write template | `Failed` |
| `CompletionTimeBeforeStart` | `Internal` | false | fixed clock-order template | `Failed` |
| `FulfillmentStatusRelationMismatch` | `Internal` | false | fixed fulfillment-relation template | `Failed` |
| `RelayStatusRelationMismatch` | `Internal` | false | fixed relay-relation template | `Failed` |

`Application(error)`的worker boundary action固定如下；实现必须对16个`ApplicationErrorKind`显式
match，不能以retryable bool代替语义分类：

| application kind | worker entry disposition | boundary rule |
|---|---|---|
| `Validation`;`ForbiddenExternalBody`;`NotAuthorized`;`NotVisible`;`IdempotencyConflict`;`BoundaryRejected`;`PolicyFailClosed`;`UnsupportedVersion`;`Quarantined`;`Disabled` | `Rejected` | 不创建新的success truth；ack/quarantine/dead-letter仍由Step 9/12决定。 |
| `ReferenceUnresolved`;`VersionConflict`;`PortUnavailable` | `Delayed` | 仅允许外层在条件变化后重新调度；当前entry不blind retry。 |
| `DuplicateMissingResult`;`NoWriteViolation`;`Internal` | `Failed` | 完整性或wiring缺陷；不得重跑猜测或重建stored surface。 |

`trace_context()`只从`Application`或三个显式携带trace的inbound variant返回借用；其余8个
worker-local variant返回None，不临时生成trace。只有`Application`保留application error对象；其余
safe reason来自variant内已验证值或按variant固定的ASCII template。`UnsupportedVersion`在finite
entry层为`Rejected`，但Step 8/12仍可把transport message交给隔离或dead-letter策略；不得把这项
transport处置伪装成`EntryDisposition::Delayed`。禁止`From<InfraError>`、raw publisher/backend error、
payload body、repository handle、config path、stack trace和wildcard mapper。

### 11.13 Jobs discovery: application-owned maintenance item outcome

job report必须在逐项application调用全部结束后才冻结并保存，因此不能用要求预先携带完整stored
surface的`SandboxServiceOutcome`表示单个item。application增加以下transient carrier；它不属于public
protocol，不新增lifecycle status，也不允许jobs从repository扫描反推结果。

```rust
/// maintenance application callable可接受的单项target identity闭集。
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum SandboxMaintenanceTargetRef {
    /// body-free external selection target；仅允许正式job-kind relation表中的source kind。
    External(ExternalSourceRef),
    /// Sandbox committed truth target。
    Truth(SandboxTruthRef),
    /// read projection target。
    Projection(SandboxReadProjectionRef),
    /// derived inspect/preview/trend target。
    Derived(DerivedInspectPreviewTrendStateRef),
    /// event relay record target。
    EventRelay(SandboxEventRelayRecordRef),
    /// reconciliation report target或已有report复查target。
    ReconciliationReport(SandboxReconciliationReportRef),
}

/// maintenance item完成后可进入job report的local result identity闭集。
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum SandboxMaintenanceResultRef {
    /// 已提交或明确保持的Sandbox truth identity。
    Truth(SandboxTruthRef),
    /// 新建、重建或仍stale的read projection identity。
    Projection(SandboxReadProjectionRef),
    /// 更新或仍degraded的derived state identity。
    Derived(DerivedInspectPreviewTrendStateRef),
    /// 更新后的event relay record identity。
    EventRelay(SandboxEventRelayRecordRef),
    /// 形成的reconciliation report identity。
    ReconciliationReport(SandboxReconciliationReportRef),
    /// application正式形成的append-only audit identity。
    AuditTrace(SandboxAuditTraceRef),
}

/// 按application因果顺序保存的ordered-unique maintenance result refs。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct SandboxMaintenanceResultRefSet(Vec<SandboxMaintenanceResultRef>);

/// 单个maintenance target的transient完成分类；不是persisted lifecycle。
#[derive(Clone, Copy, Debug, Eq, Hash, Ord, PartialEq, PartialOrd)]
pub enum SandboxMaintenanceItemStatus {
    /// target按job contract完成并形成至少一个local result ref。
    Succeeded,
    /// target处理失败且保留non-empty safe reason。
    Failed,
    /// target按guard或selection规则安全跳过。
    Skipped,
    /// target形成诚实但不完整的结果与non-empty safe reason。
    Degraded,
}

/// application job-item callable返回给jobs entry的完整body-free结果。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct SandboxMaintenanceItemOutcome {
    /// 产生本结果的closed operations job selector。
    job_kind: SandboxJobKind,
    /// Step 7 selection plan返回的exact target identity。
    target_ref: SandboxMaintenanceTargetRef,
    /// finite item completion classification。
    item_status: SandboxMaintenanceItemStatus,
    /// application callable明确返回的完整local result refs。
    result_refs: SandboxMaintenanceResultRefSet,
    /// failed/skipped/degraded的ordered-unique safe reasons。
    reasons: SandboxReasonSet,
    /// 从job call context继承的checked trace identity。
    trace_context: SandboxTraceContext,
}

/// application maintenance facade返回的一页完整item outcomes与continuation。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct SandboxMaintenanceBatchOutcome {
    /// 本批唯一operations job selector。
    job_kind: SandboxJobKind,
    /// selection reader实际消费的page token；首批可为None。
    input_page_token: Option<PageToken>,
    /// 按selection reader稳定顺序返回的完整item outcomes。
    items: Vec<SandboxMaintenanceItemOutcome>,
    /// selection reader明确返回的下一页token；不得由jobs计数器构造。
    next_page_token: Option<PageToken>,
}
```

```rust
impl SandboxMaintenanceResultRefSet {
    /// 构造明确空集合；只允许failed/skipped/degraded shape使用。
    pub fn empty() -> Self;

    /// 校验typed duplicate、cross-variant identity collision和插入顺序。
    pub fn try_new(
        refs: Vec<SandboxMaintenanceResultRef>,
    ) -> Result<Self, ApplicationError>;

    /// 返回application提供的稳定因果顺序。
    pub fn as_slice(&self) -> &[SandboxMaintenanceResultRef];

    /// 判断是否没有local result identity。
    pub fn is_empty(&self) -> bool;
}

impl SandboxMaintenanceTargetRef {
    /// 判断两个target是否是同一exact typed identity；不比较body或状态。
    pub fn same_identity(&self, other: &Self) -> bool;

    /// 返回Sandbox-local object identity；external target返回None。
    pub fn as_object_ref(&self) -> Option<SandboxObjectRef>;
}

impl SandboxMaintenanceItemOutcome {
    /// 构造成功item；result refs必须non-empty且reasons必须为空。
    pub fn succeeded(
        job_kind: SandboxJobKind,
        target_ref: SandboxMaintenanceTargetRef,
        result_refs: SandboxMaintenanceResultRefSet,
        trace_context: SandboxTraceContext,
    ) -> Result<Self, ApplicationError>;

    /// 构造失败item；reasons必须non-empty，result refs允许为空。
    pub fn failed(
        job_kind: SandboxJobKind,
        target_ref: SandboxMaintenanceTargetRef,
        result_refs: SandboxMaintenanceResultRefSet,
        reasons: SandboxReasonSet,
        trace_context: SandboxTraceContext,
    ) -> Result<Self, ApplicationError>;

    /// 构造guard/selection跳过item；result refs必须为空且reasons non-empty。
    pub fn skipped(
        job_kind: SandboxJobKind,
        target_ref: SandboxMaintenanceTargetRef,
        reasons: SandboxReasonSet,
        trace_context: SandboxTraceContext,
    ) -> Result<Self, ApplicationError>;

    /// 构造诚实degraded item；reasons必须non-empty，result refs允许为空。
    pub fn degraded(
        job_kind: SandboxJobKind,
        target_ref: SandboxMaintenanceTargetRef,
        result_refs: SandboxMaintenanceResultRefSet,
        reasons: SandboxReasonSet,
        trace_context: SandboxTraceContext,
    ) -> Result<Self, ApplicationError>;

    /// 按job-kind target relation与status shape验证全部字段。
    pub fn validate_shape(&self) -> Result<(), ApplicationError>;

    /// 返回closed job selector。
    pub fn job_kind(&self) -> SandboxJobKind;

    /// 返回exact target identity。
    pub fn target_ref(&self) -> &SandboxMaintenanceTargetRef;

    /// 返回finite item classification。
    pub fn item_status(&self) -> SandboxMaintenanceItemStatus;

    /// 返回完整local result refs。
    pub fn result_refs(&self) -> &SandboxMaintenanceResultRefSet;

    /// 返回完整safe reason set。
    pub fn reasons(&self) -> &SandboxReasonSet;

    /// 返回从job context继承的trace identity。
    pub fn trace_context(&self) -> &SandboxTraceContext;
}

impl SandboxMaintenanceBatchOutcome {
    /// 从application selection/item facade的完整结果构造一页batch outcome。
    pub fn try_new(
        job_kind: SandboxJobKind,
        input_page_token: Option<PageToken>,
        items: Vec<SandboxMaintenanceItemOutcome>,
        next_page_token: Option<PageToken>,
    ) -> Result<Self, ApplicationError>;

    /// 返回本批closed job selector。
    pub fn job_kind(&self) -> SandboxJobKind;

    /// 返回selection reader实际消费的page token。
    pub fn input_page_token(&self) -> Option<&PageToken>;

    /// 返回完整、稳定有序的item outcomes。
    pub fn items(&self) -> &[SandboxMaintenanceItemOutcome];

    /// 返回application reader明确提供的continuation。
    pub fn next_page_token(&self) -> Option<&PageToken>;

    /// 移交本批全部字段；不得丢弃continuation或只返回计数。
    pub fn into_parts(
        self,
    ) -> (
        SandboxJobKind,
        Option<PageToken>,
        Vec<SandboxMaintenanceItemOutcome>,
        Option<PageToken>,
    );
}
```

batch constructor固定执行：所有present page token trim后非空 -> 每个item `validate_shape()` -> 每个
item `job_kind == batch.job_kind` -> target在本批ordered-unique -> `input != next` ->
`next_page_token.is_some()`时items必须non-empty。它不排序、不去重、不读取repository，也不从最后一个
target ref计算continuation。空items只允许`next_page_token=None`，表示selection已完整确认本页无target。

target relation固定如下；`Truth(...)`必须进一步检查embedded exact kind，不能只匹配外层variant：

| job kind | allowed target |
|---|---|
| `PublishSandboxEventRelay` | `EventRelay` |
| `RefreshSandboxReferenceStates` | `Truth(ReferenceResolutionState)` |
| `RefreshBackendCapabilitySummaries` | `Truth(BackendCapabilitySummary)`或`External(IsolationBackend)` |
| `RetryPendingMaterialHandoffs` | `Truth(HandoffFact)` |
| `RunLeaseOrphanReaper` | `Truth(LeaseRecord)` |
| `EvaluatePendingCleanupGuards` | `Truth(CleanupGuard)` |
| `MaintainRedlineContainmentHandoffs` | `Truth(RedlineContainment)` |
| `RebuildSandboxReadProjections` | `Projection` |
| `MaintainDerivedInspectPreviewTrend` | `Derived` |
| `RunSandboxReconciliation` | 任意`Truth`、`Projection`、`Derived`、`EventRelay`或`ReconciliationReport`；不允许external body target |

result ref只证明application明确返回的local identity，不证明对应对象fresh/success/visible。set constructor
不排序、不去重；同typed duplicate或不同variant复用同一`SandboxObjectRef` identity均返回
`ApplicationErrorDetail::MaintenanceResultSetInvalid`。target relation失败返回
`MaintenanceTargetKindMismatch`，status/reason/result shape失败返回`MaintenanceItemShapeInvalid`。

以上四个detail均映射`ApplicationErrorKind::Internal -> SandboxPublicErrorKind::Internal`且
`retryable=false`；application detail静态总数由37调整为41。它们表示Step 7 wiring / mapper defect，
不得被jobs改写为业务failed item，也不得携带raw repository/adapter cause。

### 11.14 Jobs capability、对象与文件 owner

| capability | input | output | side effect | object owner | defer |
|---|---|---|---|---|---|
| normalize one-shot job context | validated job metadata | `SandboxJobRunContext` | none | ten job runner files | exact job DTO/spec到Step 8。 |
| preserve application item outcomes | `SandboxMaintenanceBatchOutcome` | `SandboxJobReportAccumulator` | jobs-local memory only | ten job runner files | selection/cursor/retry flow到Step 7/9/13。 |
| finalize report/exit | accumulator + application report finalization outcome | `SandboxJobExitDisposition` | none in jobs | job binary runner | report DTO/store finalization到Step 7/8/9/13。 |
| retain jobs-local mapping failure | context/batch/report relation defect | `JobsError` | none | `errors.rs` | process exit/telemetry到Step 9/12/15。 |

| object | category | capability | forbidden responsibility |
|---|---|---|---|
| `SandboxJobRunContext` | transient entry context | bind job selector/run/actor/trace/digest/key and page start | job spec body、repository reader、schedule/config。 |
| `SandboxJobReportAccumulator` | transient report assembly helper | preserve every application batch/item outcome and continuation | repository scan、counter-only report、truth repair。 |
| `SandboxJobExitDisposition` | transient final result | bind moved accumulator to complete stored report outcome | process exit code、public report body、persisted job lifecycle。 |
| `JobsError` | jobs-local finite error | retain application error or exact relation defect | raw cause、worker/API error、adapter/repository object。 |

### 11.15 `SandboxJobRunContext`

```rust
/// 一次one-shot operations job invocation使用的body-free entry语境。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct SandboxJobRunContext {
    /// closed operations job selector；必须与runner file固定kind一致。
    job_kind: SandboxJobKind,
    /// core-owned invocation identity；不等于report/stored-result identity。
    job_run_id: JobRunId,
    /// 受信任system actor；不得从job spec body构造。
    system_actor_ref: ActorRef,
    /// 从validated job metadata继承的checked trace identity。
    trace_context: SandboxTraceContext,
    /// 对完整job input canonicalization形成的frozen fingerprint。
    request_digest: RequestPayloadFingerprint,
    /// one-shot job idempotency reservation key。
    idempotency_key: IdempotencyKey,
    /// clock port提供的逻辑开始时间。
    started_at: Timestamp,
    /// Step 8 public page request映射的起始token；None表示首批。
    initial_page_token: Option<PageToken>,
}

impl SandboxJobRunContext {
    /// 从validated job metadata构造one-shot job context。
    pub fn try_new(
        job_kind: SandboxJobKind,
        job_run_id: JobRunId,
        system_actor_ref: ActorRef,
        trace_context: SandboxTraceContext,
        request_digest: RequestPayloadFingerprint,
        idempotency_key: IdempotencyKey,
        started_at: Timestamp,
        initial_page_token: Option<PageToken>,
    ) -> Result<Self, JobsError>;

    /// 构造application Job-channel call context；不携带job spec body。
    pub fn call_context(&self) -> Result<SandboxServiceCallContext, JobsError>;

    /// 建立空report accumulator并复制job/run/start/initial token identity。
    pub fn start_accumulator(&self) -> SandboxJobReportAccumulator;

    /// 返回closed job selector。
    pub fn job_kind(&self) -> SandboxJobKind;

    /// 返回core job invocation identity。
    pub fn job_run_id(&self) -> &JobRunId;

    /// 返回受信任system actor；不把actor kind解释为业务授权。
    pub fn system_actor_ref(&self) -> &ActorRef;

    /// 返回从job metadata继承的trace identity。
    pub fn trace_context(&self) -> &SandboxTraceContext;

    /// 返回frozen request fingerprint；不从job spec重新计算。
    pub fn request_digest(&self) -> &RequestPayloadFingerprint;

    /// 返回one-shot invocation的idempotency key。
    pub fn idempotency_key(&self) -> &IdempotencyKey;

    /// 返回clock port提供的开始时间。
    pub fn started_at(&self) -> &Timestamp;

    /// 返回selection reader首批应消费的token。
    pub fn initial_page_token(&self) -> Option<&PageToken>;
}
```

`try_new`按job run id non-empty ->
`SandboxServiceCallContext::validate_system_actor_ref` -> checked trace carrier -> digest/key non-empty ->
present page token non-empty -> `SandboxServiceCallContext::from_job`验证operation mapping的顺序执行；
不保存重复的`OperationName`。每个runner file必须把自身固定`SandboxJobKind`与Step 8 DTO kind比较，
不得让caller用binary arg覆盖。accessor只服务application call-context、accumulator和Step 8 mapper，
不得暴露job spec body或repository handle。

### 11.16 `SandboxJobReportAccumulator`

```rust
/// 在jobs entry内完整累积application maintenance batch/item outcomes。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct SandboxJobReportAccumulator {
    /// 与run context完全一致的closed job selector。
    job_kind: SandboxJobKind,
    /// 与run context完全一致的core invocation identity。
    job_run_id: JobRunId,
    /// 从run context复制的开始时间。
    started_at: Timestamp,
    /// run context提供的首批token；None表示从selection起点开始。
    initial_page_token: Option<PageToken>,
    /// 已按application reader顺序完整保留的batch outcomes与continuation chain。
    batches: Vec<SandboxMaintenanceBatchOutcome>,
    /// 是否仅作为duplicate replay的空占位；该实例不能参与fresh report推导。
    replay_only: bool,
    /// selection是否已由`next_page_token=None`明确结束。
    exhausted: bool,
}

impl SandboxJobReportAccumulator {
    /// 只允许`SandboxJobRunContext::start_accumulator`构造空accumulator。
    fn from_run_context(run_context: &SandboxJobRunContext) -> Self;

    /// 为duplicate replay构造不参与fresh推导的显式空占位。
    fn for_duplicate_replay(run_context: &SandboxJobRunContext) -> Self;

    /// 记录application返回的一整批结果；逐项字段不得拆散或丢弃。
    pub fn record_batch(
        &mut self,
        batch: SandboxMaintenanceBatchOutcome,
    ) -> Result<(), JobsError>;

    /// 返回closed job selector。
    pub fn job_kind(&self) -> SandboxJobKind;

    /// 返回core job invocation identity。
    pub fn job_run_id(&self) -> &JobRunId;

    /// 返回job开始时间；供fresh/duplicate finalization校验。
    pub fn started_at(&self) -> &Timestamp;

    /// 返回run context提供的首批selection token。
    pub fn initial_page_token(&self) -> Option<&PageToken>;

    /// 返回完整batch outcomes；Step 8 mapper须逐batch、逐item复制。
    pub fn batches(&self) -> &[SandboxMaintenanceBatchOutcome];

    /// 从initial token或最后一批next token返回下一批必须消费的token。
    pub fn expected_page_token(&self) -> Option<&PageToken>;

    /// 返回全部item数量的checked累加；只用于report count，不保存第二计数真相。
    pub fn item_count(&self) -> Result<u64, JobsError>;

    /// 判断application selection已明确耗尽。
    pub fn is_exhausted(&self) -> bool;

    /// 判断当前实例是否只用于duplicate replay；该标记不是public report status。
    pub fn is_replay_only(&self) -> bool;

    /// 从完整items穷尽派生fresh report status；不用于duplicate replay。
    pub fn fresh_report_status(&self) -> Result<SandboxJobReportStatus, JobsError>;
}
```

`record_batch`固定验证：`replay_only == false` -> 未exhausted -> batch job kind一致 -> batch input token与
`expected_page_token()`完全一致 -> 每个item已通过application validator -> target不与所有既有batch
items重复 -> 原样append完整batch -> 仅由最后一批`next_page_token`派生exhausted。它不拆分
input/next token、result refs、reasons或trace，不把相同target最后写覆盖，不从target/ref文本生成token，
也不读取repository或adapter。`for_duplicate_replay`生成的
实例只能由`SandboxJobExitDisposition::duplicate_replayed`消费；对其调用`record_batch`或
`fresh_report_status`必须返回`JobsError::AccumulatorReplayOnly`。

fresh status矩阵固定如下：

| accumulated items | fresh report status |
|---|---|
| selection exhausted且items为空 | `Skipped` |
| 至少一项`Failed`且至少一项非`Failed` | `PartialFailed` |
| 非空且全部`Failed` | `Failed` |
| 无`Failed`且至少一项`Degraded` | `Degraded` |
| 无`Failed/Degraded`且全部`Skipped` | `Skipped` |
| 无`Failed/Degraded`且至少一项`Succeeded`（其余可为`Skipped`） | `Succeeded` |

未exhausted时调用返回`JobsError::AccumulatorNotExhausted`。`DuplicateReplayed`不能从accumulator推导，
只来自application stored report replay。`fresh_report_status`与`item_count`都遍历`batches()`；后者对
每批`items().len()`执行checked `usize -> u64`和checked add，溢出返回`JobsError::ItemCountOverflow`。
accumulator不维护扁平items副本、第二个计数或第二条continuation真相。

### 11.17 `SandboxJobExitDisposition`

```rust
/// jobs runner在完整report已由application保存后形成的一次性exit处置。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct SandboxJobExitDisposition {
    /// 已消费的完整accumulator；所有item refs/reasons/trace仍可被审计。
    accumulator: SandboxJobReportAccumulator,
    /// application report finalizer或duplicate replay返回的完整stored outcome。
    final_outcome: SandboxServiceOutcome,
    /// public job report status；必须与accumulator/outcome/stored surface一致。
    report_status: SandboxJobReportStatus,
    /// clock port在report finalizer返回后提供的完成时间。
    finished_at: Timestamp,
}

impl SandboxJobExitDisposition {
    /// 完成fresh job；accumulator必须exhausted且report已由application finalizer保存。
    pub fn finish_fresh(
        accumulator: SandboxJobReportAccumulator,
        final_outcome: SandboxServiceOutcome,
        report_status: SandboxJobReportStatus,
        finished_at: Timestamp,
    ) -> Result<Self, JobsError>;

    /// 完成duplicate replay；不执行selection或item callable，使用显式replay-only accumulator。
    pub fn duplicate_replayed(
        run_context: &SandboxJobRunContext,
        final_outcome: SandboxServiceOutcome,
        finished_at: Timestamp,
    ) -> Result<Self, JobsError>;

    /// 返回完整accumulator，供Step 8 report mapper与审计读取。
    pub fn accumulator(&self) -> &SandboxJobReportAccumulator;

    /// 返回application完整final outcome。
    pub fn final_outcome(&self) -> &SandboxServiceOutcome;

    /// 返回public report status。
    pub fn report_status(&self) -> SandboxJobReportStatus;

    /// 返回report finalizer提供的完成时间；不从current clock重新生成。
    pub fn finished_at(&self) -> &Timestamp;

    /// 穷尽派生entry disposition；不返回process exit code。
    pub fn entry_disposition(&self) -> EntryDisposition;

    /// 移交完整accumulator和final outcome，不丢逐项字段。
    pub fn into_parts(
        self,
    ) -> (
        SandboxJobReportAccumulator,
        SandboxServiceOutcome,
        SandboxJobReportStatus,
        Timestamp,
    );
}
```

fresh finalization关系固定如下；所有分支要求stored result存在、kind=`JobReport`、
`validate_for_job(accumulator.job_kind())`通过且`finished_at >= started_at`：

| report status | accumulator-derived status | allowed final outcome | stored status | entry disposition |
|---|---|---|---|---|
| `Succeeded` | `Succeeded` | `NoChange | Accepted` | `Completed` | `Accepted` |
| `PartialFailed` | `PartialFailed` | `Degraded` | `Completed` | `Accepted` |
| `Failed` | `Failed` | `Failed` | `Failed` | `Failed` |
| `Skipped` | `Skipped` | `NoChange` | `Completed` | `Skipped` |
| `Degraded` | `Degraded` | `Degraded` | `Completed` | `Accepted` |
| `DuplicateReplayed` | not derived | `DuplicateReplayed` | `Completed | Rejected | Failed` | `Accepted` |

`Succeeded + Accepted`仅允许job item callable已提交Sandbox maintenance truth/marker且final outcome truth refs
明确包含这些已提交结果；report finalizer自身仍不得创建业务truth。duplicate factory不调用
`start_accumulator`后record任何batch；它调用`for_duplicate_replay`构造一个显式replay-only空accumulator，
仅保留run/job/start identity，完整report从stored surface返回。duplicate factory固定
`report_status = DuplicateReplayed`，并要求`final_outcome.outcome_status() == DuplicateReplayed`、
stored kind=`JobReport`；不得从stored report正文读取原始status，也不得把原始status伪装成fresh status。
duplicate path同样必须调用`validate_for_job(run_context.job_kind())`，防止另一个job的stored report被
错误复用；它只跳过selection/item callable，不跳过stored identity和时间关系校验。

`SandboxJobExitDisposition`不保存`i32` exit code。binary process exit mapping属于Step 9/12 entry policy；
不得把process code写入stored report或当作job/domain状态。

### 11.18 `JobsError`

```rust
/// Jobs crate在one-shot input、accumulator和report finalization边界使用的body-free有限错误。
#[derive(Clone, Debug, Eq, PartialEq)]
pub enum JobsError {
    /// application checked factory、maintenance callable或finalizer返回的稳定错误。
    Application(ApplicationError),
    /// public job input在application调用前不满足最小结构要求。
    InvalidJobInput {
        /// jobs boundary固定的安全理由。
        reason: SandboxReason,
        /// metadata已验证时继承的trace。
        trace_context: Option<SandboxTraceContext>,
    },
    /// public job schema/version不受支持。
    UnsupportedVersion {
        /// 不含raw input/version body的安全理由。
        reason: SandboxReason,
        /// metadata已验证时继承的trace。
        trace_context: Option<SandboxTraceContext>,
    },
    /// validated runtime明确禁用当前one-shot job entry。
    DisabledJob {
        /// 被禁用的closed job selector。
        job_kind: SandboxJobKind,
        /// config mapper提供的安全理由；不含raw config。
        reason: SandboxReason,
        /// metadata已验证时继承的trace。
        trace_context: Option<SandboxTraceContext>,
    },
    /// job input试图携带Sandbox禁止保存的外部正文。
    ForbiddenExternalBody {
        /// body exclusion guard形成的安全理由。
        reason: SandboxReason,
        /// metadata已验证时继承的trace。
        trace_context: Option<SandboxTraceContext>,
    },
    /// runner file固定kind与public job input kind不一致。
    RunnerJobKindMismatch {
        /// runner file编译期固定kind。
        expected: SandboxJobKind,
        /// public input声明kind。
        actual: SandboxJobKind,
    },
    /// accumulator与application batch的job kind不一致。
    AccumulatorJobKindMismatch {
        /// accumulator固定kind。
        expected: SandboxJobKind,
        /// batch实际kind。
        actual: SandboxJobKind,
    },
    /// application batch input token不等于accumulator期望token。
    AccumulatorPageTokenMismatch {
        /// 当前closed job selector；不保存token原文。
        job_kind: SandboxJobKind,
    },
    /// 同一exact target identity跨batch重复出现。
    AccumulatorDuplicateTarget {
        /// 当前closed job selector；不保存target ref文本。
        job_kind: SandboxJobKind,
    },
    /// selection已耗尽后仍试图记录新batch。
    AccumulatorAlreadyExhausted {
        /// 当前closed job selector。
        job_kind: SandboxJobKind,
    },
    /// replay-only accumulator被错误用于fresh batch记录或status推导。
    AccumulatorReplayOnly {
        /// 当前closed job selector。
        job_kind: SandboxJobKind,
    },
    /// 完整batch序列的item数量无法安全表示为public report计数。
    ItemCountOverflow {
        /// 当前closed job selector。
        job_kind: SandboxJobKind,
    },
    /// report finalization发生在selection明确耗尽之前。
    AccumulatorNotExhausted {
        /// 当前closed job selector。
        job_kind: SandboxJobKind,
    },
    /// final outcome缺少required stored job report surface。
    StoredResultMissing {
        /// final application outcome status。
        outcome_status: ServiceOutcomeStatus,
    },
    /// final outcome的stored surface不是job report。
    StoredResultKindMismatch {
        /// 实际closed stored surface kind。
        actual: SandboxStoredResultKind,
    },
    /// accumulator status、public report status、outcome与stored status关系不一致。
    ReportStatusRelationMismatch {
        /// requested public report status。
        report_status: SandboxJobReportStatus,
        /// final application outcome status。
        outcome_status: ServiceOutcomeStatus,
        /// persisted stored-result status。
        stored_status: SandboxStoredOperationResultStatus,
    },
    /// clock port返回的report完成时间早于job开始时间。
    CompletionTimeBeforeStart {
        /// 当前closed job selector。
        job_kind: SandboxJobKind,
    },
}

impl JobsError {
    /// 穷尽映射caller-safe public error kind；不得使用wildcard arm。
    pub fn to_public_error_kind(&self) -> SandboxPublicErrorKind;

    /// 返回条件变化后是否允许由外层job scheduler重新调度。
    pub fn is_retryable(&self) -> bool;

    /// 返回body-free safe reason；accumulator/relation缺陷使用固定template构造值。
    pub fn safe_reason(&self) -> SandboxReason;

    /// 返回已验证trace；没有可信trace的jobs-local缺陷返回None。
    pub fn trace_context(&self) -> Option<&SandboxTraceContext>;

    /// 穷尽派生一次one-shot job entry处置；不返回process exit code。
    pub fn entry_disposition(&self) -> EntryDisposition;
}

impl From<ApplicationError> for JobsError {
    /// 只包装application error，不重分类、解析reason或保存Display文本。
    fn from(error: ApplicationError) -> Self;
}
```

17/17 variant的exact mapping如下；`entry_disposition()`必须逐variant match，不能从process exit code、
report status或public kind反推：

| `JobsError` variant | public kind | retryable | safe reason source | entry disposition |
|---|---|---:|---|---|
| `Application(error)` | `error.to_public_error_kind()` | `error.is_retryable()` | `error.reason()`的checked clone | 按下方16/16 application-kind矩阵 |
| `InvalidJobInput` | `Validation` | false | variant `reason` | `Rejected` |
| `UnsupportedVersion` | `UnsupportedVersion` | false | variant `reason` | `Rejected` |
| `DisabledJob` | `Disabled` | false | variant `reason` | `Skipped` |
| `ForbiddenExternalBody` | `ForbiddenExternalBody` | false | variant `reason` | `Rejected` |
| `RunnerJobKindMismatch` | `Validation` | false | fixed runner-kind template | `Rejected` |
| `AccumulatorJobKindMismatch` | `Internal` | false | fixed accumulator-kind template | `Failed` |
| `AccumulatorPageTokenMismatch` | `Internal` | false | fixed continuation template | `Failed` |
| `AccumulatorDuplicateTarget` | `Internal` | false | fixed duplicate-target template | `Failed` |
| `AccumulatorAlreadyExhausted` | `Internal` | false | fixed exhausted template | `Failed` |
| `AccumulatorReplayOnly` | `Internal` | false | fixed replay-only template | `Failed` |
| `ItemCountOverflow` | `Internal` | false | fixed count-overflow template | `Failed` |
| `AccumulatorNotExhausted` | `Internal` | false | fixed not-exhausted template | `Failed` |
| `StoredResultMissing` | `Internal` | false | fixed stored-result template | `Failed` |
| `StoredResultKindMismatch` | `Internal` | false | fixed stored-kind template | `Failed` |
| `ReportStatusRelationMismatch` | `Internal` | false | fixed report-relation template | `Failed` |
| `CompletionTimeBeforeStart` | `Internal` | false | fixed clock-order template | `Failed` |

`Application(error)`的jobs boundary action固定如下；job family对validated disabled采用安全skip，不能
直接复用API/worker的拒绝矩阵：

| application kind | job entry disposition | boundary rule |
|---|---|---|
| `Validation`;`ForbiddenExternalBody`;`NotAuthorized`;`NotVisible`;`IdempotencyConflict`;`BoundaryRejected`;`PolicyFailClosed`;`UnsupportedVersion`;`Quarantined` | `Rejected` | 在maintenance callable前拒绝或终止；不写success report。 |
| `Disabled` | `Skipped` | validated runtime禁用当前job；不弱化guard、不执行selection。 |
| `ReferenceUnresolved`;`VersionConflict`;`PortUnavailable` | `Delayed` | 只有依赖或ownership条件变化后可由scheduler重新调度。 |
| `DuplicateMissingResult`;`NoWriteViolation`;`Internal` | `Failed` | duplicate missing report和内部缺陷不得通过重跑重建。 |

`trace_context()`只从`Application`或四个显式携带trace的input variant返回借用；其余12个
jobs-local variant返回None。`DisabledJob`返回`Skipped`只表示本次entry未进入selection，不新增
persisted job lifecycle；runner kind mismatch仍是caller validation rejection。`ApplicationError`只被
包装，不保存其Display文本；不存在`From<InfraError>`、`From<WorkerError>`、
`From<Box<dyn Error>>`或wildcard。page token、target ref、job spec、report DTO、repository/adapter
handle、raw config、filesystem path、process output和stack trace均不得进入error字段。

### 11.19 Entry object closure、权限边界与下游差集

#### 11.19.1 Object-to-file唯一 owner

本批不新增Step 4未规划文件。下表固定定义落点；consumer/runner文件可以组合这些对象，但不能复制
private字段、同名enum、constructor或error mapper：

| current object family | canonical Rust file | construction owner | serialize / persist | 禁止落点 |
|---|---|---|---|---|
| `SandboxServiceCallContext`;`SandboxServiceOutcome`及其§11.2 accessor delta | `crates/application/src/services.rs` | application checked factory / facade | transient；不实现protocol serde | API/worker/jobs中的context/outcome副本 |
| `SandboxStoredOperationResult`及其§11.2 accessor / validator delta | `crates/application/src/idempotency.rs` | application result-store mapper | 既有checked persisted carrier | entry-local stored result wrapper |
| `SandboxMaintenanceTargetRef`;`SandboxMaintenanceResultRef`;`SandboxMaintenanceResultRefSet`;`SandboxMaintenanceItemStatus`;`SandboxMaintenanceItemOutcome`;`SandboxMaintenanceBatchOutcome` | `crates/application/src/services.rs` | application maintenance facade | transient；不作为public DTO或job state持久化 | 十个job runner文件中的同名item/report对象 |
| `SandboxApiCommandEnvelope` | `crates/api/src/command_handlers.rs` | command request mapper | transient；不serde | `contracts::commands`、`routes.rs`中的第二envelope |
| `SandboxApiQueryEnvelope` | `crates/api/src/query_handlers.rs` | query request mapper | transient；不serde | `contracts::queries`、`routes.rs`中的第二envelope |
| `SandboxApiDisposition` | `crates/api/src/routes.rs` | API outcome/surface mapper | transient；不serde、不持久化 | transport DTO或application outcome owner |
| `ApiError` | `crates/api/src/errors.rs` | API boundary mapper | transient | contracts/application/infra error副本 |
| `SandboxWorkerKind`;`SandboxWorkerRunContext`;`SandboxConsumerReceipt` | `crates/worker/src/worker_runtime.rs` | trusted worker runtime / consumer mapper | transient；不作为worker lifecycle持久化 | 三个consumer文件中的shared type副本 |
| `SandboxFulfillmentLoopResult` | `crates/worker/src/fulfillment_worker.rs` | fulfillment loop | transient | runtime agent-loop或tools execution对象 |
| `SandboxRelayLoopResult` | `crates/worker/src/event_relay_worker.rs` | relay loop | transient | jobs crate report对象 |
| `WorkerError` | `crates/worker/src/errors.rs` | worker boundary mapper | transient | application/infra raw error副本 |
| `SandboxJobRunContext`;`SandboxJobReportAccumulator`;`SandboxJobExitDisposition` | `crates/jobs/src/lib.rs` | shared one-shot job kernel | transient；完整report由application result store另行持久化 | 十个runner文件中的shared type副本 |
| `JobsError` | `crates/jobs/src/errors.rs` | jobs boundary mapper | transient | worker error、process error或raw cause wrapper |

`worker_runtime.rs`与`jobs/src/lib.rs`是既有规划文件，不是新建的泛化`common/types/status`模块。

---

## Historical-Position Foundation: `7R-06C-1B-R` Worker relay invocation metadata repair

> 本节因 owner-table patch anchor 命中文件中段，保留为 non-authoritative foundation，不改变本文恢复状态。
> 只有物理 EOF 的同批 activation 显式采纳后，以下 Worker relay 输入来源才成为 current authority。
> 前文把 relay batch 写成“frozen relay batch”但没有给出 `JobRunId`、selection、page limit、digest/key 和
> `context_ref` 的完整来源；该口径标记为 `historical_material_invalidated_by_7r_06c_1b_audit`。
> 本节只修复 Worker-local transient carrier，不新增 application callable、public protocol DTO、Jobs 依赖或持久化事实。

### 11.19.3A `SandboxRelayLoopInvocation` owner and shape

`SandboxWorkerRunContext` 继续只表达 Worker kind、trusted system actor、trace 和 loop start time；它不吸收 Job selection、
page state 或 invocation identity。Relay loop 需要的可信元数据由一个 Worker-local、body-free、checked carrier 一次性承接：

```rust
/// 常驻 EventRelay Worker 对一次 context-scoped relay invocation 冻结的入口元数据。
///
/// 该 carrier 只描述本次 Worker 调用的可信 identity 与 page ceiling；它不保存 relay target、payload、attempt、
/// repository cursor、batch outcome、report status 或任何外部正文。
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct SandboxRelayLoopInvocation {
    /// EventRelay Worker 的受信运行语境；kind必须为 `EventRelay`。
    run_context: SandboxWorkerRunContext,
    /// 本次 relay selection 的显式 context anchor；不得表示全局扫描。
    context_ref: ControlledExecutionContextRef,
    /// application paged facade 使用的 core invocation identity；不是 Worker lifecycle identity。
    job_run_id: JobRunId,
    /// 本次 invocation 的 immutable page ceiling；由 runtime binding 冻结，不由 application/reader放大。
    page_limit: NonZeroU32,
    /// 对 context-scoped relay invocation input 的 canonical fingerprint。
    request_digest: RequestPayloadFingerprint,
    /// 本次 invocation 的 reservation identity key；不得由 digest、时间或 topic 派生。
    idempotency_key: IdempotencyKey,
}

impl SandboxRelayLoopInvocation {
    /// 从 trusted runtime metadata 和显式 context-scoped trigger 构造 Worker relay invocation。
    pub fn try_new(
        run_context: SandboxWorkerRunContext,
        context_ref: ControlledExecutionContextRef,
        job_run_id: JobRunId,
        page_limit: NonZeroU32,
        request_digest: RequestPayloadFingerprint,
        idempotency_key: IdempotencyKey,
    ) -> Result<Self, WorkerError>;

    /// 返回冻结的 Worker 运行语境；不创建新 trace 或 start time。
    pub fn run_context(&self) -> &SandboxWorkerRunContext;

    /// 返回显式 context anchor；Worker 不得从 repository 或配置补造。
    pub fn context_ref(&self) -> &ControlledExecutionContextRef;

    /// 返回 application JobReport invocation identity。
    pub fn job_run_id(&self) -> &JobRunId;

    /// 返回本次 relay invocation 的 page ceiling。
    pub fn page_limit(&self) -> NonZeroU32;

    /// 返回已冻结 request fingerprint。
    pub fn request_digest(&self) -> &RequestPayloadFingerprint;

    /// 返回已冻结 idempotency key。
    pub fn idempotency_key(&self) -> &IdempotencyKey;

    /// 构造传给 application facade 的 Worker-channel context；operation固定为 relay Job。
    pub fn call_context(&self) -> Result<SandboxServiceCallContext, WorkerError>;

    /// 构造 current selector；cutoff固定复制自同一 run context 的 `started_at`。
    pub fn selection(&self) -> Result<PublishSandboxEventRelaySelection, WorkerError>;
}
```

`try_new` 的检查顺序固定为：

1. `run_context.worker_kind() == SandboxWorkerKind::EventRelay`，否则返回 `WorkerKindMismatch`。
2. `SandboxServiceCallContext::validate_system_actor_ref(run_context.system_actor_ref())` 通过；不从 binary username、
   payload actor 或配置 role string 重建 actor。
3. `context_ref`、`JobRunId`、`RequestPayloadFingerprint` 和 `IdempotencyKey` 的 core/non-empty checked constructor 约束通过。
4. `request_digest` 与 `idempotency_key` 必须是 runtime 在构造 carrier 前对同一 context-scoped trigger canonicalize 后的值；
   carrier 不重新序列化 body、不从 `JobRunId` 或 trace 派生二者。
5. `page_limit` 必须来自已验证的 `eventRelay.publishBatchSize` binding，并已受 profile ceiling 限制；invalid 或越界直接拒绝，
   不 clamp、不读取下一页配置。
6. `selection()` 用 `context_ref` 和 `run_context.started_at()` 调用
   `PublishSandboxEventRelaySelection::try_new(context_ref.clone(), run_context.started_at().clone())`；Worker 不读第二次 clock。
7. `call_context()` 只调用
   `run_context.relay_call_context(request_digest.clone(), idempotency_key.clone())`，并重验 channel=`Worker`、operation=`PublishSandboxEventRelay`。

### 11.19.3B Trusted source and trigger boundary

| carrier field | 唯一可信来源 | checked relation | 禁止替代 |
|---|---|---|---|
| `run_context` | `worker_runtime.rs` trusted runtime assembly | fixed `EventRelay` kind、system actor、trace、start time | binary name、payload actor、current clock二次读取 |
| `context_ref` | runtime 已验证的显式 context-scoped relay trigger / deployment binding | non-empty；与本次 selection、relay record lineage逐项匹配 | repository first-row、latest/all scan、topic、全局默认 context |
| `job_run_id` | runtime/job-invocation metadata allocator在进入 Worker loop 前提供的 core ID | non-empty；只作为 application invocation identity | digest、trace、timestamp、relay record ref、counter |
| `page_limit` | validated `eventRelay.publishBatchSize` snapshot | `1 <= page_limit <= configured ceiling` | publisher response、counter、reader自行放大 |
| `request_digest` | 同一 trigger 的 canonical input fingerprint | application context中的digest与carrier相等 | Debug/body reserialization、topic、page count |
| `idempotency_key` | 同一 trigger 的 checked retry/idempotency metadata | application reservation identity与carrier相等 | request id、trace id、job run id、retry count、random local key |
| `selection_cutoff` | 同一 `run_context.started_at()` | selector cutoff与permit started_at逐字段相等 | page clock、repository timestamp、publisher time |

这里的“显式 trigger”可以由 runtime deployment binding 或已验证的内部 control signal 提供，但必须在进入
`SandboxRelayLoopInvocation::try_new` 前已经完成 context identity、digest/key 和 page ceiling 的校验。当前设计没有
一个可从 relay repository 枚举所有 context 的 Worker port；因此：

- 没有显式 `context_ref` 的 Worker tick 不构造 invocation，也不调用 application facade。
- Worker 不以空 context、全局 context、首条 relay record 的 context 或配置默认值替代缺失字段。
- 跨 context 的 pending relay 扫描 / 恢复由 `PublishSandboxEventRelay` one-shot Job 的正式 Job metadata/selection 输入承接；
  Worker relay 不是第二个 scope expansion owner。
- 该 carrier 不持久化；process crash 后不得凭 `job_run_id` 重建 permit、selection 或 continuation。恢复遵循现有
  reserved-relation / same-attempt inspection 规则。

### 11.19.3C Relay status relation correction

`SandboxRelayLoopResult::finish` 的 relay branch 必须采用 application finalizer 与 JobReport surface 的 current relation；前文
“`Accepted -> Succeeded`、`NoChange -> Skipped`”的 Worker relay 表只保留为 historical material。current 关系为：

| application outcome status | fresh report status | stored status | Worker loop disposition | 允许来源 |
|---|---|---|---|---|
| `NoChange` | `Succeeded` | `Completed` | `Accepted` | finalizer 对全部 item `Succeeded` 的 report-only completion，或合法全量 `Skipped` 规则按 report status明确返回 |
| `Degraded` | `PartialFailed` 或 `Degraded` | `Completed` | `Accepted` | 完整 item reasons / report surface |
| `Failed` | `Failed` | `Failed` | `Failed` | 完整 failed item reasons / report surface |
| `DuplicateReplayed` | `DuplicateReplayed` | `Completed | Rejected | Failed` | `Accepted` | exact stored JobReport replay |
| `Accepted` | none for maintenance finalizer | none | construction error | 不得把 item truth completion重报为 finalizer outcome |
| `Rejected` | none | none | construction error | selection/input拒绝在 application error边界结束 |
| `NoWrite` | none | none | construction error | query-only结果禁止进入 relay loop |

`Skipped -> NoChange` 是 finalizer 的 report-to-outcome映射，但 Worker carrier只接受 application 明确返回的最终
`SandboxServiceOutcome` 与 `SandboxJobReportStatus`；Worker 不从 item counter 或空 batch自行选择 status。`NoChange + Succeeded`
与 `NoChange + Skipped` 的区别由 report status 字段保留，不能压成一个 boolean。`SandboxRelayLoopResult::finish` 必须逐项
校验 outcome、report status、stored kind/status、original JobReport relation 和 `finished_at >= started_at`，不允许 wildcard arm。

### 11.19.3D Worker-local lifecycle and boundary audit

| audit | current result |
|---|---|
| application callable delta | `0`；继续使用 `publish_sandbox_event_relay` 和 shared `finalize_job_report` |
| public protocol / DTO delta | `0`；carrier不进入 `contracts`或wire surface |
| Jobs crate dependency from Worker | `0`；Worker不引用 `SandboxJobRunContext`、`SandboxJobReportAccumulator` 或 `SandboxJobExitDisposition` |
| repository / UoW / publisher direct access from Worker | `0` by contract；Worker只调用 application facade |
| report truth owner | application finalizer唯一；Worker只保存 batch chain并消费最终 outcome |
| context scope expansion owner | one-shot Job / application selector reader；Worker不枚举或扩大 scope |
| persistence / serialization | `0`；carrier仅在一个 invocation 栈内存在，不作为 Worker lifecycle state |
| implementation/test/evidence fact | 未执行；本节仅为设计契约 |

### 11.19.3E Step 7 handoff

Step 7 必须消费本节 carrier，并在 service facade / entry artifact 中继续闭合以下链路：

```text
trusted explicit relay trigger
  -> SandboxRelayLoopInvocation::try_new(...)
  -> selection() + call_context()
  -> publish_sandbox_event_relay(Start / Continue)
  -> move-preserve every SandboxMaintenanceBatchOutcome in one Worker invocation
  -> exhausted SandboxFinalizableJobPermit::PublishSandboxEventRelay
  -> FinalizeSandboxJobReportInput::try_new(permit, full_batches)
  -> application::finalize_job_report(...)
  -> SandboxServiceOutcome + SandboxJobReportStatus
  -> SandboxRelayLoopResult::finish(...)
```

在上述链路的任一字段缺失、channel/kind不符、permit未耗尽、batch chain不完整、finalizer失败或 commit 状态未知时，Worker
不得构造成功 `SandboxRelayLoopResult`，不得从 counter/current truth 补字段；应返回现有 `WorkerError::Application` 或
relation-specific `WorkerError`，并把 recovery 留给 Step 12/13 owner。

```text
current_document = 03-详细设计.md
current_step = Step 7 regression / 7R-06
current_sub_batch = 7R-06C-1B-R Step 6 carrier repair completed_wait_user_review
artifact = 03_ddd_step_06_object_contracts_application_infra_entry.md
artifact_content_status = completed
artifact_review_status = user_review_pending
new_application_callable = 0
new_public_dto = 0
worker_jobs_dependency = 0
new_l1_l2_blocker = 0
internal_relay_blocker = remains_open_until_service_and_entry_reaudit
next_allowed_action = consume_step6_carrier_in_service_facade_then_entry_reaudit
formal_03_writeback = forbidden
implementation = not_started
real_test_execution = not_started
real_evidence_created = no
acceptance_signoff = no
commit_required = no
```
`lib.rs`在本处拥有jobs shared kernel，不代表它可以吸收十个runner的job-specific selection或spec；每个
runner仍只固定一个`SandboxJobKind`并调用application facade。

#### 11.19.2 字段来源闭合

| object / field family | authoritative source | checked conversion | missing / mismatch | 禁止替代来源 |
|---|---|---|---|---|
| API command/query selector | Step 8 closed DTO variant | envelope `try_new` -> application `from_command/from_query` | `ApiError::Application`或Step 8 input error | route、method、response kind、operation string |
| API actor/trace/digest/key | validated protocol metadata与canonical fingerprint | application context factory | application exact detail | request body、display name、clock、random key |
| API command result status | Step 8 command-result builder明确值 | `from_command_outcome`穷尽关系 | three API relation defects | truth refs、stored status或HTTP code反推 |
| API query surface status | application access-first query assembly | `from_query_surface` | final surface只能是11项closed enum | access-only decision、repository existence或transport code |
| worker kind / system actor / start time | runtime assembly + trusted principal + clock port | `start_fulfillment/start_event_relay` | `WorkerError::Application` | binary username、payload actor、config role string |
| worker fulfillment selector/digest/key | Step 7 frozen fulfillment item | `fulfillment_call_context` -> `from_worker` | wrong kind或closed allow-set error | tools action、runtime loop step、CLI command |
| worker relay digest/key | Step 7 frozen relay batch | `relay_call_context` -> `from_worker_job` | wrong kind或job allow-set error | topic、publisher status、jobs crate context |
| consumer source/selector/trace | validated inbound envelope | receipt factory + stored validator | `InvalidEnvelope`或receipt relation error | payload正文、topic string、stored operation text |
| consumer/loop public status | application facade / Step 8 surface builder明确返回 | receipt/loop exact relation matrix | relation-specific `WorkerError` | truth count、repository scan、publisher private outcome |
| maintenance target / page token | application selection reader明确返回 | batch/item checked factory | four maintenance application details | jobs计数器、latest scan、target text parser |
| maintenance result refs/reasons/status | application item callable明确返回 | item shape + ordered-unique result set | exact application detail | jobs补造ref、raw error、repository after-scan |
| job kind | runner file编译期固定kind并与Step 8 DTO比较 | `SandboxJobRunContext::try_new` | `RunnerJobKindMismatch` | CLI/body覆盖、binary name反向解析 |
| job run/actor/trace/digest/key/start token/time | validated job metadata、trusted runtime、clock与Step 8 page mapping | job context factory | `JobsError` exact input/application branch | current time重算digest/key、scope text生成token |
| accumulator batches/continuation | application `SandboxMaintenanceBatchOutcome`序列 | `record_batch`保持完整batch | exact accumulator error | flattened counters、第二items副本、target生成cursor |
| final job outcome/status/time | application report finalizer + complete accumulator + clock | `finish_fresh/duplicate_replayed` | exact result/relation/time error | process exit code、stored report body、current truth scan |
| entry error reason/trace | checked application error、validated boundary reason/trace或fixed template | exact error constructor / `From<ApplicationError>` | 无可信trace时保持None | raw cause Display、stack、path、body、临时trace |

所有`Timestamp`均来自clock port，所有request fingerprint与idempotency key均在entry输入冻结后传入；本批
没有任何factory通过当前时钟、trace、object ref或字符串拼接生成它们。

#### 11.19.3 Constructor、validator、accessor与owned move闭合

| family | only construction path | invariant validator | read / move surface | unchecked path |
|---|---|---|---|---|
| application context | six checked `from_*` + `validate_system_actor_ref` | selector/channel/actor/trace/digest/key | six read-only accessors | none；无public struct literal/operation setter |
| stored replay | checked `try_new` / checked deserialize | state shape + three `validate_for_*` | six read-only accessors | none；不解析surface ref文本 |
| service outcome | seven status-specific factories | `validate_shape` | five accessors + lossless `into_parts` | none；entry不能改private set |
| maintenance ref/item/batch | result-set `try_new`; four item factories; batch `try_new` | target relation、status shape、continuation | complete accessors + batch `into_parts` | none；不自动排序/去重/补reason |
| API envelope | command/query各一个`try_new` | delegated application factory | selector/context accessor + context move | none；不serde、不保存DTO body |
| API disposition | command/query/error三条factory | command/status/stored relation | disposition/stored accessor + command parts move | none；非command move保留原对象 |
| worker context | two `start_*` | system actor + fixed kind | four accessors + two call-context builders | none；无generic worker-kind constructor |
| consumer receipt | `from_application_outcome` | source/kind/stored/status relation | six accessors/derivation + lossless `into_parts` | none；不从stored body重建 |
| fulfillment / relay result | 各自唯一`finish` | kind/allow-set/stored/status/time relation | complete accessors + lossless `into_parts` | none；二者不共享有损mapper |
| job context | `try_new` | runner kind/system actor/metadata/page token | eight accessors + call context/accumulator | none；不保存重复operation |
| job accumulator | context-only fresh/replay constructors + `record_batch` | kind/token/target/continuation/exhaustion | complete batch accessors + checked status/count | none；无flat items/consumed count setter |
| job exit | `finish_fresh` / `duplicate_replayed` | accumulator/outcome/stored/status/time | five accessors/derivation + lossless `into_parts` | none；无process-code constructor |
| module errors | exact enum constructors + `From<ApplicationError>` | exhaustive mapper compile surface | public kind/retry/reason/trace/disposition | no raw-cause/wildcard conversion |

所有entry carrier字段保持private。Step 7/8若需要新字段，必须先回到本Step 6 owner审查；不得用serde
round-trip、clone整个DTO、repository reread或`pub`字段绕过accessor/move surface。

#### 11.19.4 Operation、surface与status穷尽覆盖

| coverage surface | current closed coverage | construction / validation owner | unresolved |
|---|---:|---|---:|
| selector -> operation | Command 10 + Query 13 + Consumer 9 + Job 10 = 42/42 | application context §9.2 | 0 |
| Worker-channel selector allow-set | fulfillment command 4/4 + relay job 1/1 | application context + worker context | 0 |
| stored surface validators | Command 10/10;Consumer 9/9;Job 10/10，kind 3/3 | stored result §9.4 | 0 |
| API command outcome relation | 7/7 service outcome branches；6 public command statuses | API disposition §11.6 | 0 |
| API query entry relation | 11/11 query surface statuses | API disposition §11.6 | 0 |
| API error action | 7/7 local variants + 16/16 application kinds | API disposition / error §11.6~§11.7 | 0 |
| consumer receipt relation | 7/7 receipt statuses + 7/7 outcome branches | receipt §11.10 | 0 |
| fulfillment relation | 7/7 outcome branches + 6 command statuses | fulfillment result §11.11 | 0 |
| relay relation | 7/7 outcome branches + 6 job report statuses | relay result §11.11 | 0 |
| worker error action | 12/12 local variants + 16/16 application kinds | worker error §11.12 | 0 |
| maintenance target relation | 10/10 jobs + closed target union | application maintenance §11.13 | 0 |
| maintenance item / fresh report | 4/4 item statuses + 6/6 report statuses | application item + jobs accumulator | 0 |
| fresh / duplicate finalization | 5 fresh statuses + 1 duplicate status = 6/6 | job exit §11.17 | 0 |
| jobs error action | 17/17 local variants + 16/16 application kinds | jobs error §11.18 | 0 |

`EntryDisposition`、public command/receipt/report status、application outcome status和stored result status
保持四层独立；上表的穷尽mapping不授予任何一层互相替代或持久化entry disposition的权限。新增任何
selector/status/error variant都必须使对应显式match和静态coverage失败，不能由wildcard继续编译。

#### 11.19.5 Actor authority与安全负向切口

| entry family | P0 accepted actor source | actor check | authority boundary | forbidden elevation |
|---|---|---|---|---|
| API command/query | validated non-empty `ActorRef` from protocol metadata | application普通actor校验 | application use-case仍执行exact authorization/visibility/guard | display name、role hint或System kind直接视为业务allow |
| inbound consumer | trusted entry绑定的non-empty actor，不从event body构造 | `from_consumer` | source/schema/dedup/guard仍独立验证 | external integration仅凭kind绕过source isolation |
| fulfillment / relay worker | runtime-provided non-empty core `ActorKind::System` | `validate_system_actor_ref` | 只进入4 command + 1 relay allow-set；业务guard不省略 | binary user、payload actor、config string扩权 |
| one-shot jobs | runtime-provided non-empty core `ActorKind::System` | context `try_new` + `from_job` | 只执行runner固定job kind；不替代业务command授权 | operator直接调用、Maintenance字符串角色、job绕过guard |

historical Step 8声明`System / Maintenance / operator-scoped actor`，并另造
`SandboxActorAuthorityKind::Maintenance`；当前可检索core `ActorKind`只有
`Human | AiMember | System | Integration`，不存在`Maintenance`。本批将该差异登记为Step 8回归义务，
P0保持worker/job system-only，不新增Sandbox actor kind、不把`Human`解释为operator authority，也不
修改core。若后续确需operator触发maintenance，必须先明确可信代理、delegation和审计来源，再回开
Step 6/8；当前差异不是新的L1/L2 blocker，也不阻塞本batch设计闭合。

以下负向切口全部为实现暂停条件：

- worker fulfillment只调用Sandbox-owned launch/capture/handoff/failure application surface，不执行
  tools semantic execution，不承载runtime agent loop，也不编排member lifecycle。
- application maintenance item/report只保存body-free local refs、safe reasons和trace；不保存artifact
  正文、stdout/stderr、外部文档、observability ledger正文或provider response。
- `ApiError/WorkerError/JobsError`是entry异常分类，不是business audit、diagnostic record或验收
  evidence；Step 15 hook可记录redacted diagnostic identity，但不能把error对象当审计真相。
- API/worker/jobs不直接读取repository、resolver、backend、publisher、handoff adapter或config body，
  不从其private state重建outcome/status/report。
- worker与jobs不互调；relay worker使用Worker channel，one-shot relay job使用Job channel，二者共享
  operation identity但不形成第二条idempotency truth。
- entry carrier、receipt、loop result、accumulator和exit disposition都不是domain lifecycle；Step 10
  不得为其创建迁移图，Step 8 DTO也不得反向成为其private字段owner。
- duplicate只返回exact stored surface；缺失、wrong-kind或损坏时失败，不重跑command/consumer/job。
- jobs不维护第二套flat item列表、success/failure计数真相或自行生成continuation；公开count必须从完整
  batch序列checked派生。
- entry不生成implementation commit、run id、evidence alias、测试结果、验收签署或process success
  事实；`JobRunId`只是core invocation identity，不是已执行run证据。

#### 11.19.6 Historical consumer delta ledger

下表只登记差异与后续rewrite owner。本批不跨步修改historical Step 7~15，也不patch正式`03~07`：

| historical consumer | detected conflict | required later rewrite | current authority |
|---|---|---|---|
| Step 7 API entry adapter §14.1 | `map_outcome(outcome)`缺command kind/public status；可绕过stored validator，且把application error直接映射disposition | `6R-06`/Step 7回归改为消费§11.4~§11.7 exact factory和parts；query/error分支独立 | §11.3~§11.7 |
| Step 7 worker entry adapter §14.2 | generic `consumer_context(run_context, SandboxOpaqueRef)`缺consumer selector/metadata；`map_loop_result(outcome)`丢worker kind、command/report status与finished time | Step 7按consumer、fulfillment、relay拆exact callable；source使用core `ResourceRef`，禁止worker/jobs互调 | §11.8~§11.12 |
| Step 7 jobs entry adapter §14.3 | `record_job_outcome(SandboxServiceOutcome)`无法保存逐项target/result/reason/continuation；`finish`无final outcome/status/time且不返回`Result` | Step 7消费application maintenance batch、完整accumulator和两个checked exit factory | §11.13~§11.18 |
| Step 7 id generator / repository | 为consumer receipt、worker run、job run、job report和service outcome生成`SandboxOpaqueRef`；entry transient identity被伪装为Sandbox object | 删除transient第二身份；仅stored public surface由result-store typed identity拥有；`JobRunId`复用core | §9.2~§9.6；§11.19.2 |
| Step 8 shared authority | 定义不存在于core的`Maintenance`并允许operator-scoped job actor | Step 8回归以system-only为P0；需要operator代理时必须先回开权限模型 | §11.19.5 |
| Step 8 command/query mapping | public DTO仍含大量`SandboxOpaqueRef`，且API disposition缺exact command/status/stored relation | 逐DTO字段改用current typed refs；mapper必须调用API exact factories，不从route/status text反推 | §11.4~§11.7；shared registry |
| Step 8 consumer receipt DTO | receipt字段与`SandboxConsumerReceipt`分层不清，并假定所有状态自行保存typed result | DTO从完整receipt/outcome/stored carrier逐字段复制；不得让DTO拥有application private fields | §11.10；§9.4/§9.6 |
| Step 8 job report DTO | 只保留`processed_count/succeeded_refs/failed_refs/.../next_cursor`，形成扁平第二真相并丢逐batch input/next chain、item reason/trace/result refs | report mapper逐batch逐item复制完整application outcome；count checked派生；duplicate返回stored report | §11.13/§11.16/§11.17 |
| Step 8 relay job | 要求jobs直接消费`EventPublisherAdapterOutcome`，越过application/domain owner | jobs只消费application maintenance outcome和finalizer；publisher private outcome止于infra mapper | §10.8；§11.13~§11.17 |
| Step 9 consumer flow | duplicate直接调用旧`SandboxConsumerReceipt::duplicate(stored)`，没有source/selector/trace/status relation与stored validator | Step 9使用`from_application_outcome`或exact stored replay mapper，缺stored result失败且不重跑 | §11.10 |
| Step 9 worker/relay flow | historical flow从adapter/repository status和计数生成loop结果 | 必须消费application明确status/outcome；fulfillment/relay分别调用唯一`finish` | §11.11 |
| Step 9 operations job template | counter/report-item组装早于完整application batch carrier，continuation与duplicate replay路径不闭合 | selection -> item callable -> batch outcome -> accumulator -> application finalizer -> exit disposition | §11.13~§11.17 |
| Step 10 entry/status matrix | 把receipt/report当可迁移entry lifecycle，使用无前缀status名、旧多factory与`finish_report(report_ref)`，并从count推status/exit code | 删除伪迁移；status只由checked constructor关系形成，`EntryDisposition`不持久化，process code后移Step 9/12 | §11.6/§11.10/§11.11/§11.17；shared §12.8 |
| Step 12 error recovery | 使用失效的`ApiError::InvalidEntryMetadata`、`WorkerError::EnvelopeInvalid/UnsafeExternalBody`、`JobsError::ReportPersistenceFailed`及旧infra errors | 逐项替换为7/12/17 exact entry variant；report persistence失败先由application/infra映射，不在jobs保存raw cause | §11.7/§11.12/§11.18；§10.9 |
| Step 13 idempotency | historical identity含channel，job duplicate/retry没有replay-only accumulator约束 | identity只operation/digest/key；duplicate使用explicit replay-only accumulator并验证stored job kind | §9.2~§9.4；§11.16~§11.17 |
| Step 15 observability | 日志表仍以flat success/failed/skipped/degraded counts和old report item ref为主，容易把error/diagnostic/audit混层 | 从完整batch items派生低基数count；entry error只提供safe kind/reason/trace，diagnostic/audit由各自owner创建 | §11.12/§11.16/§11.18/§11.19.5 |
| 正式historical `03`及正式`04~07` | 尚未包含current entry carrier、maintenance batch、actor restriction与exact error mapping | 仅在Step 19重装配及后续定向重验中传播；当前禁止定向patch正式文档 | 本文件 + flow/ledger freeze |

historical consumer共16行，均已指定later owner。它们是L4-sandbox内部回归义务，不是已修复事实；
`6R-06`必须重新扫描完整consumer集合并以差集为0作为门禁。

#### 11.19.7 Static closure audit

| audit ID | current check | result | design evidence / downstream obligation |
|---|---|---|---|
| `6R05-AUD-ENT-001` | registry current type均有唯一canonical section | pass_for_design | §3、§11.4~§11.18；`S6T-05-003D/006/007/008/011` |
| `6R05-AUD-ENT-002` | object-to-file owner均命中Step 4 planned tree | pass_for_design | §11.19.1；新增文件/模块=0 |
| `6R05-AUD-ENT-003` | entry private field都有authoritative source与missing behavior | pass_for_design | §11.19.2；字段来源行16/16 |
| `6R05-AUD-ENT-004` | checked constructor / validator / accessor / move闭合 | pass_for_design | §11.19.3；family 13/13，无unchecked path |
| `6R05-AUD-ENT-005` | selector/operation/stored validator coverage | pass_for_design | 42/42 operations；worker 4+1；stored 10+9+10 |
| `6R05-AUD-ENT-006` | API status/error mapping穷尽 | pass_for_design | command outcome 7/7；query 11/11；`ApiError` 7/7 + application kind 16/16 |
| `6R05-AUD-ENT-007` | worker receipt/loop/error mapping穷尽 | pass_for_design | receipt 7/7；fulfillment/relay outcome各7/7；`WorkerError` 12/12 + 16/16 |
| `6R05-AUD-ENT-008` | maintenance target/item/batch闭集 | pass_for_design | 10 job target relations；item 4/4；application detail 41/41 exact-once |
| `6R05-AUD-ENT-009` | jobs accumulator/finalization/error mapping穷尽 | pass_for_design | full batches only；fresh 5 + duplicate 1；`JobsError` 17/17 + 16/16 |
| `6R05-AUD-ENT-010` | actor authority与channel boundary闭合 | pass_for_design | worker/job system-only；API/consumer普通checked actor；historical Maintenance冲突已登记 |
| `6R05-AUD-ENT-011` | tools/runtime/member/artifact/observability越界 | pass_for_design | §11.19.5 negative cuts；entry-owned业务truth=0 |
| `6R05-AUD-ENT-012` | raw cause/body/config/path/process output进入entry error字段 | pass_for_design | API 7、worker 12、jobs 17 variants字段审计；raw payload slot=0 |
| `6R05-AUD-ENT-013` | historical consumer inventory | pass_for_design | §11.19.6；16/16 rows有later rewrite owner |
| `6R05-AUD-ENT-014` | protocol/trait/flow/state跨步写入 | pass_for_design | 只登记downstream delta；Step 7~15与正式`03~07`修改=0 |
| `6R05-AUD-ENT-015` | implementation/runtime事实边界 | pass_for_design | code/commit/run/evidence/test/acceptance fact均未创建 |

这里的`pass_for_design`只表示当前中间产物的静态字段与闭集审计通过，不表示Rust代码存在、可以编译、
任何测试已运行、runtime actor已装配、provider可用或验收通过。新的L1/L2上游blocker为0；historical
`Maintenance` authority差异登记为L4-sandbox Step 8回归义务。既有implementation activation blocker
继续开放。

#### 11.19.8 Batch gate and next action

```text
current_document = 03-详细设计.md
current_step = Step 6 regression / 6R-05
current_batch = 6R-05 batch 3 API/worker/jobs
current_module = api + worker + jobs + application maintenance carrier
batch_status = review_confirmed
gate_status = passed_to_6R_06
object_gate_status = entry_contract_review_confirmed
next_allowed_action = consumed_by_6R_06_full_closure_audit
application_error_detail_mapping = 41/41_exact_once
api_error_mapping = 7/7_exact_once
worker_error_mapping = 12/12_exact_once
jobs_error_mapping = 17/17_exact_once
entry_object_file_owner = 13/13_unique
entry_field_source = 16/16_closed
entry_constructor_accessor_family = 13/13_closed
historical_consumer_delta = 16/16_registered
new_l1_l2_blocker = 0
historical_actor_authority_conflict = registered_for_step_8_regression
formal_03_status = historical_reviewed_invalidated_by_design_reopen
implementation = CB-SBX-01A blocked / wait_design
real_test_execution = not_started
real_evidence_created = no
commit_required = no
```

本批已完成停审并获用户确认，当前只允许由`6R-06`消费。该确认不等于完成`6R-06~07`，不得进入
Step 7，不得修改正式`03~07`，不得激活implementation。

---

## EOF Current Overlay: `S7-02D-B5` capability maintenance target identity correction

> 本节是 Step 7 B5 对 Step 6 application maintenance carrier 的最小回开，覆盖 §11.13 中与
> `RefreshBackendCapabilitySummaries` target identity 冲突的定义。其它 Step 6 object contract 不变。本修正不新增
> domain truth、public DTO、repository method、application callable或状态；它只让既有 maintenance report 能无损表达
> B5 已确认的 `(backend source identity, immutable requirement ref)` 复合 target。

`BackendCapabilitySummary` 明确定义为“某一 backend generation 对某一个 immutable boundary requirement set 的 snapshot”。
`BoundaryRequirementSet` 由每次 accepted context / active identity / generation / ten-dimensional requirements 组合产生；
“one requirement truth only”禁止 boundary 复制 requirement body，不证明一个 context 永远只有一个历史或候选 requirement。
因此 `External(IsolationBackend)` 不能作为 capability refresh 的 exact target identity：同一 backend source 对两个不同
requirement refs 的 first materialization 会在 report、跨 batch 去重和 stored replay 中发生碰撞。

current `SandboxMaintenanceTargetRef` 使用下列 typed variant替换 historical generic `External(ExternalSourceRef)`：

```rust
/// capability refresh 的 exact body-free report identity；不是 capability summary truth。
BackendCapability {
    /// 必须为 `ExternalSourceKind::IsolationBackend` 的完整 external source ref。
    backend_ref: ExternalSourceRef,
    /// 本次 refresh 唯一评估的 immutable requirement set ref。
    requirement_ref: BoundaryRequirementSetRef,
},
```

该 variant 的 checked construction只能由 `BackendCapabilityRefreshTarget` lossless mapping完成，并验证 backend kind、ref
non-empty和 requirement ref non-empty；`same_identity()` 同时比较 backend 的 `same_source()` identity与
`requirement_ref`，不比较 source version/digest、current summary ref、status、freshness、Timestamp或repository `Version`。
`as_object_ref()` 对该 variant 返回 `None`，因为 backend 是 external source且复合 target 本身不是 Sandbox object truth。

generic `External(ExternalSourceRef)` 从 current union删除：其唯一历史positive consumer就是 capability first
materialization；其余九个Job均已有 `Truth | Projection | Derived | EventRelay | ReconciliationReport` exact target，
reconciliation也明确不接受external target。保留generic variant只会留下无consumer的宽泛入口。这里是variant replacement，
不是target union扩张，不提供compatibility constructor或adapter。

`RefreshBackendCapabilitySummaries` 的 current allowed target relation固定为
`BackendCapability { backend_ref, requirement_ref }`。first 与 replacement 都报告同一复合 target；新建或替换后的
`BackendCapabilitySummaryRef` 只进入 `result_refs`。历史 `Truth(BackendCapabilitySummary)` / `External(IsolationBackend)`
target relation降为 historical material，避免因 current summary 是否存在而改变同一 logical target 的 report identity。

同一current overlay还删除 `SandboxJobRunContext.initial_page_token` 及其constructor参数/accessor，并删除
`SandboxJobReportAccumulator.initial_page_token`及其accessor。十个Job均没有合法external initial continuation：九个paged
Job的first repository cursor固定为None，Continue只move permit内cursor；reconciliation不分页。accumulator在尚未记录batch
时的`expected_page_token()`固定返回None，之后只返回最后一批`next_page_token()`。`SandboxMaintenanceBatchOutcome`的
`input_page_token / next_page_token`继续保留，用于完整记录application内部cursor编码后的batch链；
`AccumulatorPageTokenMismatch`也继续校验“first input None / previous next equals current input”。这些token不进入下一次
invocation，不构成public request、restart或resume authority。

静态影响：maintenance job relation仍为10/10；target union以一个exact variant替换一个generic variant且不新增 job kind；application error detail
仍为41/41；42/42 callable、29/29 fresh reservation和 Query write `0/13`不变。新 L1/L2 blocker为0；这是 L4-sandbox
内部 carrier closure，正式 `03~07`仍等待后续重装配，implementation继续 `blocked / wait_design`。

---

## EOF Current Recovery Override: `7R-06C-1B-R` Worker relay invocation metadata repair consumed

> 本节位于本文物理 EOF，是 Worker relay invocation metadata 的唯一 current authority（2026-07-29）。本节显式采纳前部
> `Historical-Position Foundation: 7R-06C-1B-R Worker relay invocation metadata repair` 的 §§11.19.3A~11.19.3E
> 全部字段、constructor、source matrix、status correction、boundary audit 和 Step 7 handoff。若前部旧 `SandboxWorkerRunContext`、
> relay result matrix、“frozen relay batch”或 `S7-02D-B5` overlay 与该 foundation 冲突，以本节 activation 为准。

Step 7 service facade 与 entry adapter 已消费本契约并完成 C-1B-R 静态回审；以下字段/算法不变，仅将下游消费状态更新为
completed。因此本 artifact owner 对 `SBX-DDD-GRANULARITY-STEP7-RELAY-001` 的解除条件已经满足。

Current contract 固定为：

1. `SandboxWorkerRunContext` 不增加 Job/selection/page 字段；`SandboxRelayLoopInvocation` 是
   `crates/worker/src/event_relay_worker.rs` 唯一 Worker-local checked invocation carrier。
2. carrier 字段恰为 `run_context + context_ref + JobRunId + NonZeroU32 page_limit + request_digest + idempotency_key`；
   不保存 target、payload、attempt、cursor、batch、report status、repository handle 或 external body。
3. `context_ref` 必须来自 runtime 已验证的显式 context-scoped trigger；没有该 trigger 时 Worker 不调用 facade，不以
   global/latest/first-row/default context 补造。跨 context scope expansion 仍由 one-shot Job/application selector owner承接。
4. selector 固定为 `PublishSandboxEventRelaySelection::try_new(context_ref, run_context.started_at())`；同一时间同时作为
   Start `started_at` 和 selection cutoff，续页不重读 clock。
5. call context 只由 `SandboxServiceCallContext::from_worker_job(PublishSandboxEventRelay, ...)` 形成，channel固定为
   `Worker`；digest/key来自同一 trigger metadata，不从 `JobRunId`、time、trace、topic或counter派生。
6. Worker 可以在一个 async invocation 栈内 move-preserve完整 `Vec<SandboxMaintenanceBatchOutcome>` 与 linear permit；
   该 vector不是 report truth owner、不持久化、process crash后不可恢复为 continuation。
7. final report status只由 `FinalizeSandboxJobReportInput::try_new(exhausted permit, full batches)`机械派生；Worker不调用
   Jobs crate accumulator，不从 count/cursor/publisher/current truth 重组 status/outcome。
8. maintenance finalizer current status relation为：`Succeeded | Skipped -> NoChange/Completed`；
   `PartialFailed | Degraded -> Degraded/Completed`；`Failed -> Failed/Failed`；duplicate只返回
   `DuplicateReplayed` overlay。旧 `Accepted -> Succeeded` 和只允许 `NoChange -> Skipped` 的 Worker relay关系失效。

| activation audit | result |
|---|---:|
| Worker-local carrier | `1` exact type |
| carrier required fields | `6/6` |
| Worker -> Jobs dependency | `0` |
| Worker direct repository/UoW/publisher access | `0` |
| application callable / public DTO delta | `0 / 0` |
| second report/status truth owner | `0` |
| new L1/L2 blocker | `0` |
| implementation / test / evidence fact | `0 / 0 / 0` |

```text
current_document = 03-详细设计.md
current_step = Step 7 regression / 7R-06
current_sub_batch = 7R-06C-1B-R Step 6 carrier repair consumed_by_completed_entry_reaudit
artifact = 03_ddd_step_06_object_contracts_application_infra_entry.md
artifact_content_status = completed
artifact_review_status = consumed_by_completed_entry_reaudit
current_authority = physical_eof_7r_06c_1b_r_consumed_activation
new_application_callable = 0
new_public_dto = 0
worker_jobs_dependency = 0
new_l1_l2_blocker = 0
internal_relay_blocker = resolved_by_completed_entry_reaudit
resolved_blocker = SBX-DDD-GRANULARITY-STEP7-RELAY-001
next_allowed_action = wait_user_review_before_7r_06c_1c_jobs_mapping
formal_03_writeback = forbidden
implementation = not_started
real_test_execution = not_started
real_evidence_created = no
acceptance_signoff = no
commit_required = no
```

---

## EOF Current Owner Activation: `7R-06C-1C-R` Jobs finalization ownership repair

> 本节是本文物理EOF的唯一current authority（2026-07-29）。它完整采纳前部
> `Historical-Position Foundation: 7R-06C-1C-R Jobs finalization ownership repair`的§§11.20~11.24，并补充以下
> fresh/duplicate存储形态。若§§11.16~11.17、`7R-06C-1B-R`或旧consumer表与本activation冲突，仅在Jobs/Worker report
> finalization ownership、status provenance和completion time范围内以本节为准。

Current object contract固定为：

1. `SandboxJobReportAccumulator`不实现`Clone`，删除`fresh_report_status()`；它是Jobs中完整
   `Vec<SandboxMaintenanceBatchOutcome>`的唯一owner。
2. `FinalizeSandboxJobReportInput<'a>`只借用`accumulator.batches()`；application finalizer的future绑定`'a`，禁止
   `'static`、spawn、detach、borrow escape或把slice保存进service state。
3. application finalizer成功返回唯一不可外部构造的`SandboxFinalizedJobReport`；该witness同时证明job kind、原run id、
   五个fresh report status之一、完整stored outcome和application UoW的`report_recorded_at`。
4. Jobs `finish_fresh(accumulator, completion, entry_completed_at)`与Worker
   `finish_fresh(run_context, completion, entry_completed_at)`整体消费witness，不接受自由
   `report_status + outcome + finished_at`组合。
5. fresh `SandboxJobExitDisposition`保存从witness移出的`report_status/final_outcome/report_recorded_at`和单独的
   `entry_completed_at`；duplicate factory固定status=`DuplicateReplayed`，并从已验证JobReport stored carrier的
   `recorded_at`取得report time。两条路径都要求`entry_completed_at >= report_recorded_at >= started_at`。
6. Worker duplicate使用专用`duplicate_replayed(...)`，不接受caller status。Worker与Jobs都不得用entry clock覆盖stored
   report time；process exit code继续不属于本对象。

current exact shapes为：

```rust
/// application report已提交后，Jobs runner形成的一次性exit处置。
#[derive(Debug, Eq, PartialEq)]
pub struct SandboxJobExitDisposition {
    accumulator: SandboxJobReportAccumulator,
    final_outcome: SandboxServiceOutcome,
    report_status: SandboxJobReportStatus,
    report_recorded_at: Timestamp,
    entry_completed_at: Timestamp,
}

impl SandboxJobExitDisposition {
    pub fn finish_fresh(
        accumulator: SandboxJobReportAccumulator,
        completion: SandboxFinalizedJobReport,
        entry_completed_at: Timestamp,
    ) -> Result<Self, JobsError>;

    pub fn duplicate_replayed(
        run_context: &SandboxJobRunContext,
        final_outcome: SandboxServiceOutcome,
        entry_completed_at: Timestamp,
    ) -> Result<Self, JobsError>;

    pub fn accumulator(&self) -> &SandboxJobReportAccumulator;
    pub fn final_outcome(&self) -> &SandboxServiceOutcome;
    pub fn report_status(&self) -> SandboxJobReportStatus;
    pub fn report_recorded_at(&self) -> &Timestamp;
    pub fn entry_completed_at(&self) -> &Timestamp;
    pub fn entry_disposition(&self) -> EntryDisposition;

    pub fn into_parts(
        self,
    ) -> (
        SandboxJobReportAccumulator,
        SandboxServiceOutcome,
        SandboxJobReportStatus,
        Timestamp,
        Timestamp,
    );
}

/// application JobReport已提交后，EventRelay Worker形成的一次性loop结果。
#[derive(Debug, Eq, PartialEq)]
pub struct SandboxRelayLoopResult {
    run_context: SandboxWorkerRunContext,
    report_status: SandboxJobReportStatus,
    outcome: SandboxServiceOutcome,
    report_recorded_at: Timestamp,
    entry_completed_at: Timestamp,
}

impl SandboxRelayLoopResult {
    pub fn finish_fresh(
        run_context: SandboxWorkerRunContext,
        completion: SandboxFinalizedJobReport,
        entry_completed_at: Timestamp,
    ) -> Result<Self, WorkerError>;

    pub fn duplicate_replayed(
        run_context: SandboxWorkerRunContext,
        final_outcome: SandboxServiceOutcome,
        entry_completed_at: Timestamp,
    ) -> Result<Self, WorkerError>;

    pub fn run_context(&self) -> &SandboxWorkerRunContext;
    pub fn report_status(&self) -> SandboxJobReportStatus;
    pub fn outcome(&self) -> &SandboxServiceOutcome;
    pub fn report_recorded_at(&self) -> &Timestamp;
    pub fn entry_completed_at(&self) -> &Timestamp;
    pub fn entry_disposition(&self) -> EntryDisposition;

    pub fn into_parts(
        self,
    ) -> (
        SandboxWorkerRunContext,
        SandboxJobReportStatus,
        SandboxServiceOutcome,
        Timestamp,
        Timestamp,
    );
}
```

`SandboxFinalizedJobReport`的planned owner是`crates/application/src/services.rs`；它需要`pub`跨crate返回，但字段和constructor
保持application-private。`SandboxJobExitDisposition`仍由`crates/jobs/src/lib.rs`拥有，`SandboxRelayLoopResult`仍由
`crates/worker/src/event_relay_worker.rs`拥有，不新增文件。两个`into_parts`中前一个`Timestamp`恒为report persisted time，
后一个恒为entry completion time；不得交换或仅保留一个。

| owner closure | result |
|---|---:|
| complete owned batch chain | `1` |
| Jobs fresh status derivation owner | `0` |
| application fresh status/report owner | `1` |
| fresh completion witness constructor owner | `application only` |
| new public DTO / route / callable / job kind | `0 / 0 / 0 / 0` |
| new L1/L2 blocker | `0` |

```text
current_document = 03-详细设计.md
current_step = Step 7 regression / 7R-06
current_sub_batch = 7R-06C-1C-R Step 6 Jobs/Worker owner contract activated
artifact = 03_ddd_step_06_object_contracts_application_infra_entry.md
artifact_content_status = completed
artifact_review_status = consumed_by_step7_owner_pending
current_authority = physical_eof_7r_06c_1c_r_jobs_owner_activation
jobs_batch_owner_count = 1
jobs_fresh_status_deriver_count = 0
application_fresh_status_deriver_count = 1
report_time_owner = application_finalizer_uow
entry_completion_time_owner = jobs_or_worker_trusted_clock_after_finalizer
new_public_dto = 0
new_application_callable = 0
new_l1_l2_blocker = 0
next_allowed_action = update_step7_finalizer_and_typed_store_borrowed_write_contract
formal_03_writeback = forbidden
implementation = not_started
real_test_execution = not_started
real_evidence_created = no
acceptance_signoff = no
commit_required = no
```

---

## EOF Current Owner Amendment: `7R-06C-1C-R` complete entry report sources

> 本节取代上一C-1C-R Step 6 activation并成为本文物理EOF的唯一current authority。静态输出审计确认：body-free outcome与
> post-finalizer entry time都不能替代完整report source。本节消费Step 7 current
> `SandboxFinalizedMaintenanceJobReport`与`SandboxReplayedMaintenanceJobReport`，并关闭fresh/duplicate到Step 8 mapper的完整来源。

### 11.25 Accumulator current delta

`SandboxJobReportAccumulator`只服务fresh path。删除`replay_only`字段、`for_duplicate_replay`、`is_replay_only`和
`JobsError::AccumulatorReplayOnly`；duplicate不再伪造空accumulator。current shape为
`job_kind + job_run_id + started_at + batches + exhausted`，不实现Clone。fresh `record_batch`、token chain、target uniqueness、
`item_count`与exhaustion规则不变；fresh status仍只由application finalizer派生。

### 11.26 Jobs完整report source闭集

```rust
/// one-shot Jobs entry交给Step 8 mapper的两种完整report source。
#[derive(Debug, Eq, PartialEq)]
pub enum SandboxJobReportSource {
    /// 唯一fresh batch chain与同一次application commit返回的完整非batch header。
    Fresh {
        accumulator: SandboxJobReportAccumulator,
        report: SandboxFinalizedMaintenanceJobReport,
    },
    /// exact committed typed JobReport与matching duplicate outcome。
    DuplicateReplayed {
        report: SandboxReplayedMaintenanceJobReport,
    },
}

/// Jobs runner一次调用的typed最终处置；不保存process code或第二report time。
#[derive(Debug, Eq, PartialEq)]
pub struct SandboxJobExitDisposition {
    /// 当前entry invocation context；duplicate不得用它覆盖stored original report fields。
    run_context: SandboxJobRunContext,
    /// fresh/replay完整source闭集。
    report_source: SandboxJobReportSource,
}

impl SandboxJobExitDisposition {
    /// 只允许jobs-local terminal helper调用；runner不能自由拼接另一个accumulator/report。
    pub(crate) fn finish_fresh(
        run_context: SandboxJobRunContext,
        accumulator: SandboxJobReportAccumulator,
        report: SandboxFinalizedMaintenanceJobReport,
    ) -> Result<Self, JobsError>;

    pub fn duplicate_replayed(
        run_context: SandboxJobRunContext,
        report: SandboxReplayedMaintenanceJobReport,
    ) -> Result<Self, JobsError>;

    pub fn run_context(&self) -> &SandboxJobRunContext;
    pub fn report_source(&self) -> &SandboxJobReportSource;
    /// fresh返回fresh status；duplicate返回本次overlay `DuplicateReplayed`。
    pub fn report_status(&self) -> SandboxJobReportStatus;
    /// duplicate可读取原始fresh status；fresh与`report_status()`相同。
    pub fn original_report_status(&self) -> SandboxJobReportStatus;
    pub fn final_outcome(&self) -> &SandboxServiceOutcome;
    pub fn report_recorded_at(&self) -> &Timestamp;
    pub fn entry_disposition(&self) -> EntryDisposition;
    pub fn into_parts(self) -> (SandboxJobRunContext, SandboxJobReportSource);
}
```

`finish_fresh`验证run context、accumulator与report的job kind/run id/start time全等，accumulator exhausted、batch non-cloned，
report selection/header/status/outcome/time shape有效；status只读report，不重派生。duplicate factory验证current runner fixed kind与
replayed surface job kind相等；它不读取clock、不构造accumulator、不覆盖surface original run/trace/selection/status/time。

为保证borrowed chain与随后move的accumulator是同一对象，九个runner必须通过jobs-local terminal helper执行：

```rust
pub(crate) async fn finalize_paged_job_exit<'a>(
    service: &'a dyn SandboxJobService,
    run_context: SandboxJobRunContext,
    accumulator: SandboxJobReportAccumulator,
    permit: SandboxFinalizableJobPermit,
) -> Result<SandboxJobExitDisposition, JobsError> {
    require(accumulator.is_exhausted())?;
    let input = FinalizeSandboxJobReportInput::try_new(permit, accumulator.batches())?;
    let report = service.finalize_job_report(input).await?;
    SandboxJobExitDisposition::finish_fresh(run_context, accumulator, report)
}
```

该helper不是application callable、protocol handler或generic job dispatch。它按值封装唯一accumulator，使runner无法把另一个
accumulator与report拼接；future结束后borrow释放再move同一对象。九个exact permit constructor仍在调用helper前完成。

### 11.27 Worker完整report source闭集

```rust
/// EventRelay Worker交给Step 8 mapper的fresh/replay完整source。
#[derive(Debug, Eq, PartialEq)]
pub enum SandboxRelayReportSource {
    Fresh {
        batches: Vec<SandboxMaintenanceBatchOutcome>,
        report: SandboxFinalizedMaintenanceJobReport,
    },
    DuplicateReplayed {
        report: SandboxReplayedMaintenanceJobReport,
    },
}

#[derive(Debug, Eq, PartialEq)]
pub struct SandboxRelayLoopResult {
    run_context: SandboxWorkerRunContext,
    report_source: SandboxRelayReportSource,
}

impl SandboxRelayLoopResult {
    pub(crate) fn finish_fresh(
        run_context: SandboxWorkerRunContext,
        batches: Vec<SandboxMaintenanceBatchOutcome>,
        report: SandboxFinalizedMaintenanceJobReport,
    ) -> Result<Self, WorkerError>;

    pub fn duplicate_replayed(
        run_context: SandboxWorkerRunContext,
        report: SandboxReplayedMaintenanceJobReport,
    ) -> Result<Self, WorkerError>;

    pub fn run_context(&self) -> &SandboxWorkerRunContext;
    pub fn report_source(&self) -> &SandboxRelayReportSource;
    pub fn report_status(&self) -> SandboxJobReportStatus;
    pub fn original_report_status(&self) -> SandboxJobReportStatus;
    pub fn outcome(&self) -> &SandboxServiceOutcome;
    pub fn report_recorded_at(&self) -> &Timestamp;
    pub fn entry_disposition(&self) -> EntryDisposition;
    pub fn into_parts(self) -> (SandboxWorkerRunContext, SandboxRelayReportSource);
}
```

Worker fresh把borrow结束后的唯一local vector按值移入result，不drop也不clone；`finish_fresh`验证batch chain与report header，job
kind固定relay、started_at与Worker run context相等。duplicate持完整typed surface，clock read=`0`。entry completion timing若需
低基数诊断，由Step 15 hook在carrier外记录，不能污染public/stored report或主体结果对象。

### 11.28 Current Jobs error inventory delta

删除无consumer的`AccumulatorReplayOnly`后，current `JobsError`为`16`个variant；其它16项不变。新增的fresh/replay source关系
继续复用`AccumulatorJobKindMismatch`、`AccumulatorNotExhausted`、`StoredResultMissing`、`StoredResultKindMismatch`、
`ReportStatusRelationMismatch`和`CompletionTimeBeforeStart`，不新增同义error。下一批C-2必须按`API 7 / Worker 12 / Jobs 16`
重做exact-once mapping；历史`17/17`只作historical material。

| source closure | result |
|---|---:|
| Jobs fresh complete source | accumulator + finalized header = `1/1` |
| Worker fresh complete source | unique vector + finalized header = `1/1` |
| paged duplicate complete source | exact owned typed surface + outcome = `1/1` |
| replay-only empty accumulator | `0` |
| post-result clock in report carrier | `0` |
| complete batch clone/rebuild | `0 / 0` |
| current Jobs error variants | `16` |

```text
current_document = 03-详细设计.md
current_step = Step 7 regression / 7R-06
current_sub_batch = 7R-06C-1C-R complete entry report sources activated
artifact = 03_ddd_step_06_object_contracts_application_infra_entry.md
artifact_content_status = completed
artifact_review_status = consumed_by_entry_final_reaudit_complete
current_authority = physical_eof_7r_06c_1c_r_complete_entry_source_amendment
jobs_report_source = Fresh|DuplicateReplayed
worker_relay_report_source = Fresh|DuplicateReplayed
replay_only_accumulator = removed
jobs_error_variant_count = 16
new_public_dto = 0
new_application_callable = 0
new_l1_l2_blocker = 0
next_allowed_action = wait_user_review_before_7r_06c_2
formal_03_writeback = forbidden
implementation = not_started
real_test_execution = not_started
real_evidence_created = no
acceptance_signoff = no
commit_required = no
```

---

## EOF Current Owner Amendment: `7R-06C-2` JobsError 16-variant contract activated

> 本节取代上一C-1C-R owner恢复块并成为本文物理EOF的唯一current authority。它完整采纳同文件
> `Historical-Position Foundation: 7R-06C-2 JobsError 16-variant activation`的§§11.29~11.31，并继续保留
> C-1C-R §§11.25~11.27的fresh/replay完整report source。中段§11.18的17项enum和mapping只作historical material。

Current owner结论固定为：

1. `JobsError`恰为16项；`AccumulatorReplayOnly`不存在，不提供alias、constructor或match arm。
2. `Application(error)`完整委托application public kind、retry、reason和trace，并按16个kind显式映射entry disposition。
3. 15个Jobs-local variant的retryable全部为false；四个input/config variant可继承checked trace，其余11项trace为None。
4. `DisabledJob`和`Application(Disabled)`映射`Skipped`；它们不创建persisted lifecycle，也不等于scheduler ack。
5. `CompletionTimeBeforeStart`只表达application finalized/stored report time早于同一report run start，不读取第二个entry clock。
6. `entry_disposition()`不返回process code；exit、retry/backoff和telemetry action仍由Step 9/12定义。
7. 所有五个accessor逐16项显式match；禁止wildcard、raw cause、Display解析或跨entry error转换。

| owner audit | current result |
|---|---:|
| Jobs enum variants | `16/16` |
| removed replay-only variants | `1/1` |
| local retryable variants | `0/15` |
| local checked-trace variants | `4/15` |
| local no-trace variants | `11/15` |
| new public DTO/error variant/callable | `0/0/0` |
| new L1/L2 blocker | `0` |

```text
current_document = 03-详细设计.md
current_step = Step 7 regression / 7R-06
current_sub_batch = 7R-06C-2 JobsError current 16 owner activated
artifact = 03_ddd_step_06_object_contracts_application_infra_entry.md
artifact_content_status = completed
artifact_review_status = awaiting_entry_16_mapping
current_authority = physical_eof_7r_06c_2_jobs_error_16_activation
adopted_sections = historical_position_foundation_11_29_to_11_31
jobs_error_variant_count = 16
removed_variant = AccumulatorReplayOnly
jobs_report_source = Fresh|DuplicateReplayed
process_exit_code = undefined_deferred
new_public_dto = 0
new_error_variant = 0
new_application_callable = 0
new_l1_l2_blocker = 0
next_allowed_action = consume_jobs_error_16_in_entry_mapping
formal_03_writeback = forbidden
implementation = not_started
real_test_execution = not_started
real_evidence_created = no
acceptance_signoff = no
commit_required = no
```

---

## EOF Current Owner Amendment: `7R-06C-2` JobsError owner consumed by completed entry audit

> 本节位于本文物理EOF并取代上一owner activation恢复状态。Step 7 entry已按本文件current 16项`JobsError`完成
> `16/16 exact_once`正反向审计；本文件不因此新增transport、scheduler或process policy。

| owner/consumer check | current result |
|---|---:|
| current `JobsError` owner variants | `16/16` |
| Step 7 entry consumer variants | `16/16 exact_once` |
| omitted / duplicate / wildcard | `0/0/0` |
| `AccumulatorReplayOnly` positive variant/alias/constructor/match arm | `0/0/0/0` |
| local retryable variants | `0/15` |
| new public DTO/error variant/callable | `0/0/0` |
| new L1/L2 blocker | `0` |

```text
current_plan_version = v5.5-active
current_document = 03-详细设计.md
current_step = Step 7 regression / 7R-06
current_sub_batch = 7R-06C-2 JobsError owner consumed_by_completed_entry_audit
artifact = 03_ddd_step_06_object_contracts_application_infra_entry.md
artifact_content_status = completed
artifact_review_status = consumed_by_entry_16_mapping_static_audit_complete
current_authority = physical_eof_7r_06c_2_jobs_error_owner_consumption
jobs_error_variant_count = 16
entry_consumer_mapping = 16/16_exact_once
removed_variant = AccumulatorReplayOnly
jobs_report_source = Fresh|DuplicateReplayed
process_exit_code = undefined_deferred
new_public_dto = 0
new_error_variant = 0
new_application_callable = 0
new_l1_l2_blocker = 0
next_allowed_action = wait_user_review_before_7r_06c_3
formal_03_writeback = forbidden
implementation = not_started
real_test_execution = not_started
real_evidence_created = no
acceptance_signoff = no
commit_required = no
```
