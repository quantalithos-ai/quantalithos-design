# L4-observability 03-详细设计 Step 12 · 错误模型、异常分支与恢复口径

> 对应 SOP: `standards/document/详细设计讨论流程_SOP.md` Step 12
> 回填章节: `03-详细设计.md` §11 错误模型、异常分支与恢复口径
> 当前模式: `full-restart`
> 当前门禁: 本 Step 完成后停审,等待用户确认;不得自动进入后续 Step

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前文档 | `03-详细设计.md` |
| 当前 Step | Step 12 `定义错误模型、异常分支与恢复口径` |
| 输出文件 | `design-calibration/03_ddd_step_12_error_recovery.md` |
| flow 文件 | `design-calibration/03_ddd_calibration_flow.md` |
| Step 状态 | `completed_design_record_with_affected_open` |
| 正式回填状态 | blocked_until_step_19 |
| gate_status | `pass_with_affected_open` |
| next_allowed_action | continue_M2_step_13;stop_after_step_15_before_step_16 |

本文件的局部 `pass` 只表示错误类型或分支表已经有设计记录；当前聚合结论为
`pass_with_affected_open`。错误 owner、recovery class、Consumer action、外部 phase 和
result/report owner 的 inherited affected 不得被映射成默认 retry、默认 dead-letter 或无条件成功。

## 2. 本步目标与非目标

本 Step 把 Step 06 的对象构造 / policy / 状态迁移失败、Step 07 的 service / repository / UoW / resolver / publisher / delivery port失败、Step 08 的 Command / Query / Consumer / Job public surface、Step 09 的函数级异常分支、Step 10 的非法迁移和技术结果、Step 11 的事务 / consistency defect / recovery场景收束为可直接编码的错误模型。

实现者必须能仅凭本文件回答:

1. 错误由 `contracts`、`domain`、`application`、`api`、`worker`、`jobs` 还是 `infra` 检测和拥有。
2. 内部错误使用哪个精确 enum variant,不得依赖自由字符串或解析 adapter message。
3. Command、Query、Inbound Consumer、Outbox Publisher、Operations Job、Handoff / Export分别映射到哪个既有public outcome / surface。
4. 当前动作属于不可原样重试、输入修正后重试、状态变化后重试、reload后重试、依赖恢复后重试、只重做finalize、先probe再决定还是人工介入。
5. 失败前后哪些写入可见、必须rollback、必须保留或必须禁止。
6. 哪些失败只返回surface,哪些失败允许写本仓quarantine / gap / publication / maintenance / report marker,且为何不会反写业务truth。

本 Step 不定义:

- HTTP status、RPC code或worker exit code的具体数字。
- retry次数、backoff、lease、claim、幂等窗口和并发调度算法。
- transport route、topic、dead-letter queue、cron、timeout或adapter产品。
- 日志字段全集、metric名、trace span名、告警阈值和运维处置手册。
- SQL error code、driver exception、数据库产品或DDL。
- 实现任务、commit boundary、真实run id、验收签署、真实evidence alias或测试结果。

## 3. 输入材料

| 输入 | 状态 | 本步用途 |
|---|---|---|
| `standards/document/详细设计讨论流程_SOP.md` Step 12 | 已读取 | 固定五个SOP问题、四类强制输出和停审条件 |
| `standards/document/详细设计书写规范.md` 5.11 | 已读取 | 固定错误类型、映射、异常分支、恢复表及retry/manual分类 |
| `03_ddd_step_06_object_contracts.md` | pass | 提供对象factory、policy、27个状态owner、`JobReportState`、entry/worker/job carrier和现有error token |
| `03_ddd_step_07_trait_port_adapter_contracts.md` | pass | 提供统一 `ApplicationError` 签名面、repository/UoW/resolver/publisher/delivery port和query carrier |
| `03_ddd_step_08_protocol_contracts.md` | pass | 提供6种Command outcome、8种Consumer outcome、6种Job outcome、query surface和10种public error code |
| `03_ddd_step_09_function_flows.md` | pass | 提供16 Command、14 Query、9 Consumer、publisher和9 Job的rollback / no-write / partial failure分支 |
| `03_ddd_step_10_state_matrix.md` | pass | 提供27个状态机非法迁移、reserved transition、terminal state和技术结果分类 |
| `03_ddd_step_11_persistence_transaction_consistency.md` | pass | 提供CAS、cursor、outbox、projection、diagnostic、reference、handoff、job和commit outcome恢复场景 |
| `02_hld_step_12_detailed_design_handoff.md`;正式 `02-概要设计.md` | pass | 提供错误边界、恢复原则和不反写业务truth约束 |
| 旧 `03_ddd_step_12_error_recovery.md` | historical_material | 旧稿仅81行且混入废弃schema / 自动顺推门禁,只用于问题诊断 |
| L1-governance / L1-artifact Step 12 | 已读取 | 只作错误层级、mapping、recovery、consistency defect和停审粒度参考 |

## 4. 分批写入计划

| 批次 | 内容 | 当前状态 |
|---|---|---|
| 12.1 | 文件骨架、SOP回答、历史诊断、设计原则、错误层级和精确错误类型 | done |
| 12.2 | Command / Query / Consumer / Publisher / Job / Handoff映射 | done |
| 12.3 | 异常分支、恢复口径、审计/event/marker写入规则 | done |
| 12.4 | consistency defect、anti-pattern、前序回填、cross-step audit和停审 | done |

## 5. SOP 问题回答

| SOP问题 | 当前回答 |
|---|---|
| 每个模块有哪些错误类型? | `contracts` 使用 `ProtocolError` 和 `ObservationProtocolErrorCode`；`domain` 使用 `DomainError`；`application` 和所有port统一返回 `ApplicationError`；`api` 使用 `ApiError` 做entry-local映射；`worker` 使用 `WorkerError`；job report方法使用 `JobError`。infra raw exception只允许在adapter内部出现并立即映射。 |
| 哪些错误映射到HTTP / RPC / Event失败? | Command可预期拒绝映射到 `ObservationCommandOutcome` + `ObservationProtocolErrorSurface`；Query missing/not-visible/stale/rebuilding/disabled/degraded优先返回 `ObservationQuerySurface`；Consumer映射到 `ObservationConsumerOutcome`；Job映射到 `ObservationJobOutcome` + report；只有infra / consistency failure进入entry的semantic transport failure。 |
| 哪些可重试、不可重试、需人工介入? | 使用本Step正式 `ObservationRecoveryClass` 八类分类。invalid input / forbidden body / policy / idempotency digest conflict不可原样重试；optimistic conflict需reload；temporary dependency需恢复后重试；external success后的local failure只重做finalize；commit unknown先probe；missing durable sidecar / corrupt index / rollback unknown需人工介入。 |
| 事务失败、并发冲突、重复请求、外部依赖失败如何处理? | known transaction failure rollback；optimistic conflict rollback/reload；same digest duplicate rollback并replay immutable stored surface；different digest conflict且不覆盖；temporary dependency不补造truth；commit unknown和external finalize unknown先probe；所有重试策略参数留给后续Step。 |
| 哪些异常需要写审计、日志或事件? | 只有既有accepted flow明确拥有的observation truth/marker/history/outbox、quarantine/gap、publication state、projection/reference/maintenance、handoff/export record和job report可写。invalid request、普通domain rejection、not-visible Query、unsupported schema和未确认commit不得写success event。运行telemetry留给后续observability/audit Step。 |

## 6. Historical material诊断与上游缺口

| 位置 | 发现 | 当前处理 |
|---|---|---|
| 旧Step 12 | 81行通用模板,错误类型/映射/恢复均未定义 | 全量替换,不继承旧pass状态 |
| 旧Step 12 | 使用 `NormalizedLogRecord`、`MetricPoint`、`TraceSpanRecord`、`AuditEventProjection`、hash linkage等已废弃主语 | 仅记录为historical material,不得进入当前taxonomy |
| Step 06 | 多处函数返回 `DomainError` / `JobError`,但没有正式enum定义 | 本Step定义并回填Step 06 |
| Step 06 | `ProtocolError::InvalidRef`、`ApiError`、`WorkerError`只有引用 | 本Step定义最小精确错误面并回填 |
| Step 07 | 所有service/port返回 `ApplicationError`,但没有variant及raw adapter映射规则 | 本Step定义完整enum并回填Step 07 |
| Step 08 | public error code缺少invalid request、target missing、invalid state、policy rejected、version conflict、consistency failure等必要语义 | 本Step扩展code并补response/error互斥规则 |
| Step 09 | 已出现 `CompletedReservationResultMissing`、diagnostic linkage和UoW错误分支,尚无统一recovery class | 当前纳入正式taxonomy |
| Step 10 | 曾使用未统一的stored-result missing错误名 | 已统一为 `CompletedReservationResultMissing` |
| Step 11 | 已定义failure recovery但未固定public mapping / caller action | 本Step逐项映射,不改变transaction truth |

上述缺口均可在当前详细设计内部闭合,没有要求修改正式 `00`、`01` 或 `02` 的上游blocker。

## 7. 错误设计原则

| 原则 | 正式口径 |
|---|---|
| 分层ownership | domain只表达对象不变量/policy；application表达orchestration/port/consistency；entry只做protocol映射；infra raw error不穿透 |
| enum驱动 | control flow只能match typed enum / state / outcome；不得解析message、debug string、driver code文本或issue ref |
| public最小披露 | public surface只含typed code、body-free issue/gap refs和retryable bool；不得暴露SQL、path、secret、stack trace、raw payload或external body |
| Query no-write | missing/not-visible/stale/rebuilding/disabled/degraded是正常read surface；consistency error也只能fail closed,不得inline repair |
| accepted才写success副作用 | rejected/invalid/conflict/unsupported/not-visible不得append正常outbox/history或mark fresh |
| quarantine不是普通rejection | forbidden body只允许保存body-free quarantine/gap/decision marker；原正文不得持久化 |
| duplicate replay不重跑 | same operation/key/digest只读取stored result/receipt/report；missing stored surface是consistency defect |
| recovery不反写真相 | outbox/projection/reference/handoff/export/job失败只恢复本仓派生/交接状态,不得修改上游业务truth |
| commit unknown先probe | 在无法证明未提交前不得重执行mutation、publish或delivery |
| retry与manual分离 | transient failure可候选重试；deterministic serialization、broken invariant、dangling index和forbidden persisted body必须人工/运维介入 |
| 不提前定义调度 | 本Step只固定classification和允许动作,不定义次数、backoff、lease、claim或并发算法 |

## 8. 精确错误类型契约

### 8.1 错误层级

```text
contracts value/ref/envelope validation
  -> ProtocolError

domain factory / transition / policy
  -> DomainError

application service + repository/resolver/publisher/delivery/UoW ports
  -> ApplicationError

api mapper
  -> ApiError
  -> Command response / Query response or semantic transport failure

worker mapper
  -> WorkerError
  -> ObservationConsumerReceipt / ObservationPublicationBatchResult

job report methods
  -> JobError
  -> application maps to ObservationJobOutcome + durable report

infra adapter raw exception
  -> immediately mapped to ApplicationError
  -> never exposed or persisted verbatim
```

| Layer | 可见错误 | 禁止事项 |
|---|---|---|
| `contracts` | malformed ref/envelope/schema/route | repository、network、SQL或domain state错误 |
| `domain` | required ref、scope、policy、boundary、state、invariant冲突 | adapter、UoW、HTTP、retry/backoff |
| `application` | domain error、port failure、transaction、consistency、external finalize | raw driver error、public transport数字 |
| `api` | protocol/application error | 直接暴露domain/adapter内部细节 |
| `worker` | envelope/application/publication marker failure | unsupported payload继续解析 |
| `jobs` | report transition、item/finalize failure | 把report outcome声明为验收或业务truth |
| `infra` | provider/runtime exception | 绕过application直接改domain或返回raw body |

### 8.2 Recovery classification

```rust
/// Allowed recovery posture for one classified observation failure.
pub enum ObservationRecoveryClass {
    /// Repeating the same operation with the same state is forbidden.
    DoNotRetrySameInput,
    /// The caller must correct metadata,body,scope,or typed references first.
    RetryAfterInputChange,
    /// A formal domain/reference/policy state must change before another attempt.
    RetryAfterStateChange,
    /// The caller may retry only after reloading the winning committed version.
    RetryAfterReload,
    /// A disabled or unavailable dependency must become available first.
    RetryAfterDependencyRecovery,
    /// Earlier work is durable;only the local finalize phase may be retried.
    RetryFinalizeOnly,
    /// The caller must probe durable state before deciding whether to replay or retry.
    ProbeBeforeRetry,
    /// Automated retry is forbidden until an operator repairs or classifies the defect.
    ManualIntervention,
}
```

| Recovery class | `retryable` public bool | 允许动作 | 禁止动作 |
|---|---:|---|---|
| `DoNotRetrySameInput` | false | return exact rejection/conflict/blocked surface | loop same request |
| `RetryAfterInputChange` | false | caller fixes typed input then creates a new attempt | silently normalize forbidden/missing data |
| `RetryAfterStateChange` | false | wait for formal state/reference/policy change | timer-only blind retry |
| `RetryAfterReload` | true | rollback,reload `Versioned<T>`,reevaluate | reuse old expected_version |
| `RetryAfterDependencyRecovery` | true | retry only after adapter/runtime availability recovery | fabricate dependency result |
| `RetryFinalizeOnly` | true | reuse durable preparation/receipt/item classification and rerun finalize only | repeat external delivery or completed item |
| `ProbeBeforeRetry` | false | probe idempotency/result/marker/external identity first | assume committed or rolled back |
| `ManualIntervention` | false | fail closed,retain evidence refs,raise operations-visible defect | reconstruct immutable history from current truth |

`retryable=true` only states that another attempt may be valid;it does not authorize an immediate loop。Actual retry count、backoff、claim和exhaustion不在本Step定义。

### 8.3 Contracts error

```rust
/// Validation failure produced before application orchestration.
pub enum ProtocolError {
    /// A body-free typed reference is empty,malformed,or owned by another boundary.
    InvalidRef,
    /// Required envelope or metadata fields are missing or inconsistent.
    InvalidEnvelope,
    /// The declared operation does not match the concrete body type.
    RouteBodyMismatch,
    /// The inbound event schema version is unsupported.
    UnsupportedSchemaVersion,
    /// A public page cursor cannot be decoded under the declared query.
    InvalidPageCursor,
}
```

All `ProtocolError` variants are detected before opening a write UoW。They map to `RetryAfterInputChange`,except `UnsupportedSchemaVersion`,which is `DoNotRetrySameInput` until the producer changes schema。

### 8.4 Domain error

```rust
/// Observation-domain factory,policy,and state-transition failure.
pub enum DomainError {
    /// A required body-free reference is absent.
    MissingRequiredReference,
    /// A supplied scope does not match the object's formal scope.
    ScopeMismatch,
    /// The requested lifecycle transition is not allowed.
    InvalidStateTransition,
    /// The transition is reserved and has no current callable flow.
    ReservedTransition,
    /// A domain policy rejected the requested effect.
    PolicyRejected,
    /// The current actor or visibility context cannot read the surface.
    ReadNotAllowed,
    /// Safety or redaction invariants were violated.
    SafetyBoundaryViolation,
    /// Raw or forbidden body crossed a body-free boundary.
    BodyFreeBoundaryViolation,
    /// Authenticity fields would claim evidence that is not formally linked.
    AuthenticityBoundaryViolation,
    /// A reference snapshot or subject crossed its ownership boundary.
    ReferenceBoundaryViolation,
    /// Replay attempted an effect outside the approved observation-only scope.
    ReplayBoundaryViolation,
    /// Correlation identity conflicts with the existing canonical binding.
    CorrelationConflict,
    /// Reference identity or state conflicts with the current snapshot.
    ReferenceConflict,
    /// Retention release conflicts with an active protection.
    RetentionConflict,
    /// Gap and degraded-output fields are mutually inconsistent.
    GapInvariantViolation,
    /// Rollup identity,scope,or source position is inconsistent.
    RollupInvariantViolation,
    /// Required rollup source material is incomplete.
    RollupIncomplete,
    /// Report handoff readiness guards are not satisfied.
    HandoffNotReady,
    /// A maintenance,rollup,or replay completion lacks required members or records.
    MaintenanceIncomplete,
}
```

| Domain error family | Recovery class | Application/public mapping |
|---|---|---|
| missing ref / scope mismatch | `RetryAfterInputChange` or `RetryAfterStateChange` by source | invalid reference / target missing / rejected |
| invalid/reserved transition | `DoNotRetrySameInput` | invalid state / rejected;no mutation |
| policy/read denied/handoff not ready | `RetryAfterStateChange` | policy rejected / blocked / not-visible |
| safety/body/authenticity/reference/replay boundary | `RetryAfterInputChange`;forbidden persisted body -> manual | boundary violation / quarantined / blocked |
| correlation/reference/retention conflict | `RetryAfterReload` when concurrent;otherwise state change | conflict / blocked |
| gap/rollup invariant | `ManualIntervention` if persisted;input change if pre-save | consistency failure / failed item |
| maintenance/rollup/replay incomplete | `RetryAfterStateChange` when valid inputs are pending;manual when persisted classification is impossible | non-Fresh/failed item or consistency failure |

### 8.5 Job error

```rust
/// Invariant failure while updating one durable observation job report.
pub enum JobError {
    /// A report identity required by the job flow is absent.
    MissingReportReference,
    /// The requested report lifecycle transition is invalid.
    InvalidReportTransition,
    /// One projection scope was classified as both success and failure.
    ScopeClassificationConflict,
    /// Report sets,progress refs,or terminal fields are inconsistent.
    ReportInvariantViolation,
}
```

`JobError` never escapes directly to public protocols。Application maps a pre-commit input defect to `FailedPermanent` / `Blocked`,a concurrent report CAS to `RetryAfterReload`,and a persisted report invariant to `ManualIntervention`。

### 8.6 Application error

```rust
/// Unified application and port error surface for observability services.
pub enum ApplicationError {
    /// Request mapping or required application input is invalid.
    InvalidRequest,
    /// A query page cursor is invalid for the selected operation.
    InvalidPageCursor,
    /// An inbound schema version is unsupported.
    UnsupportedSchemaVersion,
    /// Required observability-owned state does not exist.
    OwnedStateNotFound,
    /// A domain factory,policy,or transition rejected the operation.
    Domain(DomainError),
    /// The same idempotency key was used with a different digest.
    IdempotencyConflict,
    /// Another execution owns the same operation,actor,key,and digest.
    IdempotencyInFlight,
    /// A completed reservation points to no immutable stored result.
    CompletedReservationResultMissing,
    /// A stored result exists but has the wrong operation or surface kind.
    StoredResultKindMismatch,
    /// An application-owned technical state transition is invalid.
    InvalidStateTransition,
    /// An application-owned transition is reserved for a later flow.
    ReservedTransition,
    /// A compare-and-swap lost to a committed writer.
    OptimisticConflict,
    /// The current execution or item fencing token is no longer authoritative.
    ExecutionFenceConflict,
    /// A required repository is temporarily unavailable.
    RepositoryUnavailable,
    /// A required reference snapshot is unavailable or unresolved.
    ReferenceUnavailable,
    /// A reference resolver call is temporarily unavailable.
    ResolverUnavailable,
    /// The outbox publisher is temporarily unavailable.
    PublisherUnavailable,
    /// A handoff or export delivery adapter is temporarily unavailable.
    DeliveryUnavailable,
    /// A configured adapter or operation is disabled.
    AdapterDisabled,
    /// Deterministic body-free serialization failed.
    SerializationFailed,
    /// The UoW could not assign its single committed cursor.
    CursorAllocationFailed,
    /// Commit is known not to have succeeded.
    CommitFailed,
    /// Commit may or may not have succeeded.
    CommitOutcomeUnknown,
    /// Rollback outcome cannot be established.
    RollbackFailed,
    /// Outbox record and immutable payload invariants disagree.
    OutboxInvariantViolation,
    /// A committed outbox row has no immutable payload snapshot.
    OutboxPayloadMissing,
    /// A stored outbox payload fails schema or digest validation.
    OutboxPayloadCorrupt,
    /// A complete bounded source snapshot cannot assemble the requested view.
    ProjectionAssemblyFailed,
    /// A loaded projection does not match its canonical lookup scope.
    ProjectionScopeMismatch,
    /// A stale marker does not match the view's stable marker identity.
    ProjectionFreshnessMarkerMismatch,
    /// Projection source,lookup,dependency,or position indexes are inconsistent.
    ProjectionIndexCorrupt,
    /// A rebuilding diagnostic names no matching progress row.
    RebuildProgressLinkMissing,
    /// Rebuild progress names no matching maintenance state.
    RebuildMaintenanceLinkMissing,
    /// Rebuild progress names no matching immutable target binding.
    RebuildTargetBindingMissing,
    /// A requested maintenance target does not exist.
    MaintenanceTargetMissing,
    /// A maintenance target has no scope binding.
    MaintenanceTargetBindingMissing,
    /// A retry attempted to change an immutable target binding.
    MaintenanceTargetBindingConflict,
    /// An approved replay scope required by the operation does not exist.
    ReplayScopeMissing,
    /// A durable job report required by the current phase does not exist.
    JobReportMissing,
    /// Target or item completeness cannot support a successful finalize.
    MaintenanceIncomplete,
    /// Evidence-index input is ref-only,missing,or differs from its constituents.
    EvidenceIndexInputMismatch,
    /// Diagnostic view,scope,summary,or pointer invariants are broken.
    DiagnosticCompositeCorrupt,
    /// Another persisted composite invariant is broken.
    PersistenceInvariantViolation,
    /// A formal external delivery attempt failed.
    ExternalDeliveryFailed,
    /// External delivery returned but local finalize outcome is unknown.
    ExternalFinalizeUnknown,
    /// A no-write violation could not be persisted while the attempted write stayed blocked.
    NoWritePersistenceFailed,
    /// Job report mutation failed its own invariant.
    Job(JobError),
}
```

The variant name is the control-flow authority。Optional issue、subject、gap和trace refs are carried by the surrounding error context / protocol surface and never change classification。Raw adapter message、SQL code、path、stack trace和external response body are not fields of this enum。

### 8.7 Application error recovery groups

| Application variants | Recovery class | 说明 |
|---|---|---|
| `InvalidRequest`,`InvalidPageCursor` | `RetryAfterInputChange` | UoW前拒绝 |
| `UnsupportedSchemaVersion`,`IdempotencyConflict` | `DoNotRetrySameInput` | producer/caller必须改变schema或key/digest |
| `IdempotencyInFlight` | `RetryAfterStateChange` | 当前attempt不得进入第二writer；等待reservation/report变化，public retryable=false |
| `OwnedStateNotFound`,`ReferenceUnavailable`,domain state/policy rejection | `RetryAfterStateChange` | 不得补造target/reference |
| `OptimisticConflict`,并发型binding/reference/retention conflict | `RetryAfterReload` | rollback后重新读version/state |
| `ExecutionFenceConflict` | `RetryAfterStateChange` | stale claimant先reload immutable plan/current claim/item/report outcome；不得复用旧token |
| repository/resolver/publisher/delivery unavailable、cursor allocation known transient | `RetryAfterDependencyRecovery` | 不代表业务失败 |
| `AdapterDisabled` | `RetryAfterStateChange` | 配置变化前不自动重试 |
| `CommitFailed` | `RetryAfterDependencyRecovery` | 仅在backend证明未提交后可新attempt |
| `CommitOutcomeUnknown`,`ExternalFinalizeUnknown` | `ProbeBeforeRetry` | probe key/result/marker/external identity |
| external success + known local finalize failure | `RetryFinalizeOnly` | 不重复external call |
| completed result missing、wrong result kind、rollback unknown、serialization deterministic failure、outbox/projection/diagnostic/persistence corruption | `ManualIntervention` | fail closed,不得重建immutable evidence |
| projection item bounded/incomplete/fence conflict | input/consistency -> manual；concurrent fence -> reload | 按检测原因精确分类,不得统一标retryable |
| `MaintenanceIncomplete` | `RetryAfterStateChange` or manual | expected partial state进入report,broken classification进入manual |
| `NoWritePersistenceFailed` | `ManualIntervention` | attempted forbidden write仍必须blocked |

### 8.8 API、Worker与infra-local错误

```rust
/// Entry-local error before or while mapping one API response.
pub enum ApiError {
    /// Request validation failed before application invocation.
    Protocol(ProtocolError),
    /// Application orchestration returned a classified failure.
    Application(ApplicationError),
    /// A typed application result cannot be mapped losslessly.
    ResponseMappingFailed,
}

/// Worker-local envelope,ack,publication,or application failure.
pub enum WorkerError {
    /// Inbound envelope validation failed.
    Protocol(ProtocolError),
    /// Consumer or publication application logic failed.
    Application(ApplicationError),
    /// Runtime acknowledgement failed after a response was classified.
    AckFailed,
    /// Runtime dead-letter handoff failed.
    DeadLetterFailed,
    /// Publication marker finalization failed.
    PublicationFinalizeFailed,
}
```

Infra adapters may define private provider-specific errors,但port boundary必须立即映射:

| Raw adapter class | Required `ApplicationError` | 禁止映射 |
|---|---|---|
| not-found row | caller-specific `OwnedStateNotFound` / typed missing variant | `RepositoryUnavailable` |
| CAS affected rows = 0 | `OptimisticConflict` | generic persistence failed |
| claim acquire conflict / commit-time stale fencing token | `ExecutionFenceConflict` | `OptimisticConflict`或generic repository failure |
| temporary connection/service unavailable | corresponding unavailable variant | domain policy rejection |
| deterministic serialization/schema/digest mismatch | serialization/corruption variant | retryable unavailable |
| known transaction abort | `CommitFailed` | accepted outcome |
| ambiguous commit/timeout after send | `CommitOutcomeUnknown` | known failure |
| raw provider invalid credentials/config | `AdapterDisabled` or manual configuration defect | public raw message |
| external formal failure outcome | `ExternalDeliveryFailed` or publication Failed marker | repository failure |

### 8.9 Public error surface closure

Step 08 existing `ObservationProtocolErrorCode` remains the public code owner,但必须补充以下variant才能lossless映射本Step:

| 新增 public code | 触发来源 | semantic transport class |
|---|---|---|
| `InvalidRequest` | route/body/digest/page组合无效 | invalid-request equivalent |
| `TargetNotFound` | Command target或required owned state不存在 | not-found equivalent |
| `InvalidStateTransition` | domain/application lifecycle不允许 | conflict/semantic-rejection equivalent |
| `PolicyRejected` | 非actor-specific policy/readiness/retention guard拒绝 | semantic-rejection equivalent |
| `VersionConflict` | optimistic CAS conflict | conflict equivalent |
| `ConsistencyFailure` | missing stored result/payload、corrupt index/composite、rollback unknown | internal-consistency equivalent |
| `CommitOutcomeUnknown` | commit/finalize无法确认 | unavailable/indeterminate equivalent |
| `ExternalDeliveryFailure` | formal handoff/export/publish failure | dependency/delivery equivalent |

既有 `MissingRequiredField`、`InvalidReference`、`ActorNotAllowed`、`BodyFreeBoundaryViolation`、`IdempotencyConflict`、`NotVisible`、`StaleProjection`、`DependencyUnavailable`、`UnsupportedSchemaVersion`、`NoWriteGuardViolation` 保持不变。

| Public code | Default recovery class | `retryable` | 例外 |
|---|---|---:|---|
| `MissingRequiredField` / `InvalidRequest` / `InvalidReference` | `RetryAfterInputChange` | false | required owner row真实缺失时使用TargetNotFound,不伪装input错误 |
| `ActorNotAllowed` / `NotVisible` | `RetryAfterStateChange` | false | Query通常返回normal visibility surface而非error |
| `BodyFreeBoundaryViolation` | `RetryAfterInputChange` | false | forbidden body已持久化升级为ManualIntervention |
| `IdempotencyConflict` | `DoNotRetrySameInput` | false | same digest duplicate不是error |
| `DependencyUnavailable` for typed in-flight | `RetryAfterStateChange` | false | `IdempotencyInFlight`是already-owned semantic，不是adapter unavailable；entry必须覆盖default dependency recovery |
| `StaleProjection` | `RetryAfterStateChange` | false | caller可走独立maintenance protocol,不得inline retry Query |
| `DependencyUnavailable` | `RetryAfterDependencyRecovery` | true | adapter disabled需state/config change,public仍不自动enable |
| `UnsupportedSchemaVersion` | `DoNotRetrySameInput` | false | producer改变schema后是新input |
| `NoWriteGuardViolation` | `DoNotRetrySameInput` | false | no-write marker保存失败不允许原write通过 |
| `TargetNotFound` | `RetryAfterStateChange` | false | caller ref本身malformed则InvalidReference |
| `InvalidStateTransition` | `DoNotRetrySameInput` | false | state改变后可作为新attempt重新评估 |
| `PolicyRejected` | `RetryAfterStateChange` | false | deterministic boundary policy可能要求input change |
| `VersionConflict` | `RetryAfterReload` | true | reload后必须重新跑guard,不是blind retry |
| `VersionConflict` for execution fence | `RetryAfterStateChange` | false | runner先等claim变化并reload plan/item；不得把old claimant立即重试 |
| `ConsistencyFailure` | `ManualIntervention` | false | pre-save bad input应映射InvalidRequest而非consistency |
| `CommitOutcomeUnknown` | `ProbeBeforeRetry` | false | probe证明未提交后才转成其他class |
| `ExternalDeliveryFailure` | formal outcome决定dependency recovery或manual | derived | external success + local failure改用finalize-only/probe |

Command response、Consumer receipt和Job response必须新增 `error: Option<ObservationProtocolErrorSurface>`。此外,Command response和Consumer receipt的 `result_ref` 必须改为 `Option<ObservationProtocolResultRef>`；UoW前拒绝/unsupported branch不得伪造stored result identity。Job input若在合法report创建前失败,entry直接返回protocol error surface,不构造假的 `ObservationJobResponse` / report。

| Carrier | `error=None` | `error=Some` |
|---|---|---|
| Command | `Accepted` / `DuplicateReplayed` | `Rejected` / `Conflict` / `Delayed` / `Quarantined` |
| Consumer receipt | `Accepted` / `Duplicate` / `NoOp` | `Delayed` / `Rejected` / `Quarantined` / `DeadLettered` / `UnsupportedSchema` |
| Job response | `Completed` / `DuplicateReplayed`;partial可由report完全解释时允许None | `PartiallyCompleted` / `FailedRetryable` / `FailedPermanent` / `Blocked`需要top-level原因时 |

| Carrier / outcome | `result_ref` invariant |
|---|---|
| Command `Accepted` / committed `Quarantined` | `Some`,且指向本次已提交exact replay surface |
| Command `DuplicateReplayed` | `Some`,且等于原stored result ref |
| Command pre-UoW `Rejected` / `Conflict` / no-write `Delayed` | `None`;不得生成或借用其他operation的ref |
| Consumer committed `Accepted` / `Quarantined` / stored `NoOp` | `Some` |
| Consumer `Duplicate` | `Some`,且等于原stored receipt result ref |
| Consumer pre-UoW `Rejected` / `UnsupportedSchema` / no-write `Delayed` | `None` |
| Job response任一outcome | required existing result/report pair；否则不构造response |

Public `retryable` derives from `ObservationRecoveryClass`;entry不得自行猜测。For `ProbeBeforeRetry` and `ManualIntervention`,public value is false。

## 9. 内部错误到public surface映射

### 9.1 映射总原则与semantic transport class

本设计只固定transport-neutral语义,不提前绑定HTTP/RPC数字:

| Semantic transport class | 典型public code / surface | Caller action |
|---|---|---|
| invalid request | `MissingRequiredField`;`InvalidRequest`;`InvalidReference` | 修正metadata/body/ref/page后创建新attempt |
| not found | `TargetNotFound`或Query `missing=NotFound` | 不得从body猜target；等待或创建正式owner object |
| forbidden / not visible | `ActorNotAllowed`;`NotVisible`;`NoWriteGuardViolation` | 不得扩大visibility或绕过guard |
| semantic rejection | `InvalidStateTransition`;`PolicyRejected`;boundary code | 同输入不重试,除非正式state/policy变化 |
| conflict | `IdempotencyConflict`;`VersionConflict` | digest conflict不得重试；version conflict reload后reevaluate |
| unavailable | `DependencyUnavailable`;Query availability | 依赖恢复后新attempt；不得补默认值 |
| already-owned | `DependencyUnavailable` with typed in-flight semantic | 等待reservation/report或claim state变化；不得立即第二writer |
| indeterminate | `CommitOutcomeUnknown` | 先probe durable state,不直接重放 |
| internal consistency | `ConsistencyFailure` | fail closed,operations/manual classification |
| external delivery | `ExternalDeliveryFailure` | formal retryable/permanent outcome或finalize-only recovery |

Entry mapping必须以 `(operation family, ApplicationError variant, current durable phase)` 三元组决定public surface。同一个 `OwnedStateNotFound` 在Command是`TargetNotFound`,在Query通常是normal missing surface,在Job item是failed ref；不得建立不带调用上下文的全局一对一shortcut。

### 9.2 Shared Command mapping

| Internal error / branch | Command outcome | Public code | Recovery | Durable effect |
|---|---|---|---|---|
| `ProtocolError::InvalidEnvelope` / missing field | `Rejected` | `MissingRequiredField` / `InvalidRequest` | input change | none;UoW不得begin |
| route/body mismatch / digest derivation failure | `Rejected` | `InvalidRequest` | input change | none |
| malformed/wrong-owner ref | `Rejected` | `InvalidReference` | input change | none |
| target owner row missing | `Rejected` | `TargetNotFound` | state/input change | staged reservation rollback |
| `DomainError::InvalidStateTransition` / `ReservedTransition` | `Rejected` | `InvalidStateTransition` | no same-input retry | rollback;no normal outbox |
| generic policy/readiness hard reject | `Rejected` | `PolicyRejected` | state change | rollback;no success history/outbox |
| actor/visibility denied | `Rejected` | `ActorNotAllowed` / `NotVisible` | state change | rollback;existing gap ref may be returned |
| forbidden body / safety hard boundary before accepted quarantine flow | `Quarantined` or `Rejected` | `BodyFreeBoundaryViolation` | input change | only formal body-free quarantine/gap/decision flow may commit |
| attempted write outside ownership | `Rejected` | `NoWriteGuardViolation` | no same-input retry | attempted write blocked;separate/local violation flow only |
| same operation/key/digest completed | `DuplicateReplayed` | none | replay stored surface | current UoW rollback;no new writes |
| same operation/actor/key/digest still Reserved | `Delayed` | `DependencyUnavailable` | wait for state change；retryable=false | rollback；no resolver/domain/body execution |
| same operation/key,different digest | `Conflict` | `IdempotencyConflict` | no same-input retry | rollback;old reservation/result unchanged |
| optimistic CAS conflict | `Conflict` | `VersionConflict` | reload | rollback;no last-write-wins |
| temporary repository/resolver unavailable before accepted commit | `Delayed` | `DependencyUnavailable` | dependency recovery | rollback;no synthetic gap unless a separate accepted gap flow runs |
| adapter disabled | `Delayed` or `Rejected` by operation contract | `DependencyUnavailable` | state/config change | no auto-enable/write |
| known save/history/cursor/outbox/result/commit failure | no success response;entry failure | dependency or consistency code by exact variant | dependency recovery/manual | whole accepted UoW rollback |
| commit outcome unknown | no accepted/rejected claim | `CommitOutcomeUnknown` | probe | do not start a second mutation |
| completed reservation result missing / wrong kind | no replay response | `ConsistencyFailure` | manual | fail closed;do not reconstruct |

For a normal Command rejection,本Step选择“不另开事务保存rejection”。只有既有正式Command本身就是 `RecordNoWriteViolation`、`RecordGapState`、quarantine/safety decision等local observation-side mutation时,其accepted marker/history可按Step 09/11提交。实现者不得借“审计拒绝”临时新增隐藏write path。

### 9.3 Per-Command exceptional mapping

| Command flow | 预期非成功domain state是否仍可commit | Hard error / mapping | Recovery detail |
|---|---|---|---|
| `SubmitObservationMaterialFlow` | receipt `Rejected` / `Quarantined` / `Degraded`及linked decision可作为body-free accepted intake fact提交 | malformed source -> `InvalidReference`;forbidden body -> `Quarantined` + boundary code;source resolver call unavailable -> `Delayed` | never persist source body;quarantine write failure remains fail closed |
| `RecordSafetyDispositionFlow` | safety `Rejected` / `Quarantined`可提交 | receipt missing -> `TargetNotFound`;terminal transition -> `InvalidStateTransition`;unsafe body -> boundary code | reload only for optimistic conflict |
| `BindCorrelationContextFlow` | `Partial` / `Invalid`可在formal policy outcome下提交 | receipt missing;scope mismatch;canonical binding conflict | conflict reloads existing binding;never mint a second correlation truth for same receipt |
| `RecordSafeSignalFlow` | `Suppressed` / `Stale` and rollup stale marker may commit | context missing/invalid;rollup incomplete;runtime resolver call unavailable | incomplete source is state/input change,not default-value retry |
| `AppendAuditProjectionFlow` | `Restricted` can commit as observation audit projection state | subject/context missing;scope mismatch;forbidden external audit body | do not reconstruct source audit truth or raw event |
| `LinkBodyFreeEvidenceFlow` | `BodyBlocked` / `NotVisible` / `Stale` can commit when linkage fact itself is valid | evidence body supplied;digest/purpose/ref invalid;resolver call unavailable | body boundary is input change;unavailable resolver is dependency recovery |
| `PrepareReportHandoffFlow` | handoff/readiness `Blocked` / `Degraded` can commit with exact gap refs | evidence-index preview ref-only/mismatch -> `InvalidRequest`;constituent missing -> target missing;hard readiness reject before valid marker -> policy code | immutable input is never reconstructed during delivery |
| `EvaluateAuthenticityHintFlow` | `PlaceholderDetected` / `Insufficient` are valid committed hints | handoff missing;attempt to claim real evidence without formal origin -> boundary violation | caller must provide formal linkage,new hint flow may reevaluate only where state matrix allows |
| `SetRetentionMarkerFlow` | `HoldActive` / `Conflicted` are valid marker outcomes | invalid protected ref;illegal release transition | active protection conflict is state result when persisted;CAS conflict still reloads |
| `ProtectActiveReferenceFlow` | `Protected` / `Conflicted` can commit | protected target missing;consumer set malformed;illegal release | no physical delete/cleanup |
| `DefineReplayScopeFlow` | `Blocked` scope can commit | target/effect crosses observation ownership -> `NoWriteGuardViolation` / domain replay boundary | same input not retried until formal scope/effect changes |
| `RecordNoWriteViolationFlow` | `Blocked` / `Escalated` / `Closed` are normal local states | attempted target/reason malformed;violation persistence fails | attempted forbidden write remains blocked even if marker write fails |
| `RecordGapStateFlow` | `Open` / `Acknowledged` / `Suppressed` / `Resolved` are normal local states | source/ref/reason mismatch;gap/degraded invariant | persisted invariant defect manual;pre-save bad input rejected |
| `PrepareExternalAuditExportFlow` | preparation/delivery `Blocked` can commit | view missing;consumer mismatch;visibility/no-write hard reject;projection store unavailable | never treat Prepared/Blocked as external audit verdict |
| `RegisterReferenceSnapshotFlow` | `Unresolved` / `Stale` / `Invalid` / `Unavailable` are formal snapshot outcomes and may commit | malformed subject;resolver call failed before formal outcome;external body returned | call failure may retry;formal Invalid requires new explicit snapshot,not in-place repair |
| `UpdateReferenceSnapshotStateFlow` | formal `Unavailable` / `Unresolved` transition may commit | snapshot missing;invalid transition;expected version conflict | missing target is not resolver unavailable;version conflict reloads |

### 9.4 Query mapping

Query `Ok(ObservationQueryResult<T>)` can carry missing/not-visible/stale/rebuilding/disabled/unavailable/degraded without treating them as `ApplicationError`。Only malformed request/page, repository call failure, or broken persisted invariant returns entry failure。

| Query flow | Normal empty/degraded surface | Error surface / recovery |
|---|---|---|
| `GetObservationReceiptFlow` | receipt absent -> `missing=NotFound`;not-visible -> body none | malformed ref -> invalid request;repository unavailable -> dependency recovery |
| `GetIntakeStatusFlow` | empty page is visible success | invalid page cursor -> input change;page index corruption -> manual |
| `GetSafeSignalFlow` | signal/context absent -> missing;restricted -> body none | owner/ref mismatch -> consistency failure |
| `GetSignalRollupFlow` | Stale/Rebuilding returned exactly;consistency hint only gates body | marker/ref mismatch -> consistency failure;no inline rebuild |
| `GetAuditTimelineFlow` | empty timeline valid;not-visible entries omitted/redacted under policy | unstable/invalid page index -> consistency/input error by cause |
| `GetEvidenceIndexInputFlow` | missing linkage represented by existing gaps/missing surface | constituent/index mismatch -> consistency failure;never construct evidence alias |
| `GetReportHandoffFlow` | missing -> NotFound;Blocked/Degraded readiness remains body/surface by visibility | handoff/hint pointer mismatch -> consistency failure |
| `GetRetentionProtectionFlow` | absent marker -> explicit unmarked/missing;active conflict is data | retention/protection pointer mismatch -> consistency failure;no cleanup |
| `GetObservationReadModelFlow` | missing/Stale/Rebuilding/Disabled exact surface | lookup/view/marker mismatch -> consistency failure |
| `GetDiagnosticViewFlow` | canonical lookup absent -> missing;summary Unavailable -> availability surface | scope/marker mismatch or broken progress/maintenance/binding linkage -> `ConsistencyFailure`,manual,no-write |
| `GetGapStatusFlow` | missing vs not-visible distinct;empty page valid | gap/view source mismatch -> consistency failure |
| `GetPeripheralExportViewFlow` | Disabled/Blocked/NotVisible exact surface | consumer/scope/ref mismatch -> consistency failure |
| `GetReferenceSnapshotViewFlow` | Unresolved/Stale/Invalid/Unavailable exact body/surface by policy | snapshot/view/marker mismatch -> consistency failure |
| `GetRebuildProgressFlow` | no progress -> missing or formal fresh target surface | progress/target/maintenance mismatch -> consistency failure |

| Query branch | Public mapping | Recovery/write rule |
|---|---|---|
| not visible / blocked | `ObservationQuerySurface.visibility`;body none | no retry flag,no write |
| stale | exact stale marker;body per consistency hint | caller may request rebuild through separate protocol only |
| rebuilding | validated exact rebuild surface | do not wait or start/finalize job |
| unavailable/disabled | availability surface | dependency/config change;no refresh |
| unknown freshness | body none | operations may inspect separately;no default Fresh |
| repository unavailable | semantic transport `DependencyUnavailable` | dependency recovery |
| persisted invariant broken | `ConsistencyFailure` | manual;fail closed;no repair |

### 9.5 Inbound Consumer mapping

| Internal branch | Consumer outcome | Error code | Write / ack rule |
|---|---|---|---|
| envelope field missing / malformed | `Rejected` | missing/invalid request | no payload parse,no local mutation |
| unsupported schema | `UnsupportedSchema` | `UnsupportedSchemaVersion` | no payload parse,no stale/outbox;runtime disposition later |
| same dedup key/digest | `Duplicate` | none | rollback current UoW,replay stored receipt |
| same operation/system actor/dedup key/digest still Reserved | `Delayed` | `DependencyUnavailable` | no payload parse/apply；transport retry/ack binding later；no immediate loop |
| same key,different digest | `Rejected` or `Quarantined` | `IdempotencyConflict` | old receipt unchanged;do not parse/reapply body |
| same source-event identity with changed dedup key | follows original reservation:Duplicate/Delayed/Rejected | none / `DependencyUnavailable` / `IdempotencyConflict` | secondary unique prevents second reservation；mismatch quarantined,never reapply |
| older/equal source version | `NoOp` / `Duplicate` / `Delayed` by exact flow | optional stale/degraded code | no local regression；never order byoccurred_at/clock/schema/cursor/repository version |
| forbidden/raw body | `Quarantined` | `BodyFreeBoundaryViolation` | only body-free quarantine marker/receipt may commit |
| temporary resolver/repository unavailable before local accepted write | `Delayed` | `DependencyUnavailable` | no fabricated snapshot;ack/retry runtime policy later |
| formal unresolved/not-visible external reference | `Accepted` / `NoOp` / `Delayed` per flow | optional gap/stale code | may commit explicit snapshot/gap marker if flow owns it |
| accepted local mutation committed | `Accepted` | none | ack only after commit;outbox from stored snapshot |
| valid event causes no state change | `NoOp` | none | no hidden write unless stored duplicate/receipt contract requires it |
| permanent envelope/body/reference defect with safe envelope | `DeadLettered` only when formal marker commit succeeds | matching error code | raw payload never stored in dead-letter marker |

| Consumer flow | 特有错误分类 | 固定恢复口径 |
|---|---|---|
| `ConsumeBusObservationMaterialFlow` | safe summary missing -> delayed;raw body -> quarantined | producer supplies safe summary;never derive from raw body |
| `ConsumeSourceAuditMaterialFlow` | correlation missing -> gap/delayed;source audit body forbidden | wait for formal context;do not create source audit truth |
| `ConsumeIdentityObservationContextFlow` | formal unresolved may commit snapshot;resolver call failure delayed | refresh/new event after dependency recovery |
| `ConsumeGovernanceAuditContextFlow` | not-visible may commit body-free restricted snapshot/gap | never copy governance decision/control body |
| `ConsumeArtifactEvidenceContextFlow` | digest missing invalid/delayed by contract;body quarantined | producer must provide digest/body-free ref |
| `ConsumeRuntimeSignalSummaryFlow` | correlation missing partial/gap;runtime summary body forbidden | wait for correlation;no execution truth write |
| `ConsumeSandboxSignalSummaryFlow` | unsafe quarantined;no matching receipt may be NoOp/delayed | never persist sandbox result body |
| `ConsumeArchiveHandoffFeedbackFlow` | unknown handoff delayed then formal dead-letter classification | do not create handoff from feedback |
| `ConsumeReportConsumerFeedbackFlow` | unknown delivery delayed;formal gap feedback may open local gap | do not claim consumer acceptance truth |

### 9.6 Outbox Publisher mapping

| Branch | Publication state / job outcome | Recovery | Forbidden |
|---|---|---|---|
| pending item + valid snapshot + publish success | `Published`;job completed/partial | short CAS UoW | mutate source truth |
| publisher temporary failure | `Failed`;job `FailedRetryable` / partial | dependency recovery;later policy decides retry | rebuild payload |
| publisher formal permanent failure | `DeadLettered`;job failed permanent/partial | operations/manual as classified | retry as temporary without policy |
| snapshot missing | consistency failure;item not published | manual;may mark/report dead-letter only through valid short UoW | read current truth to reconstruct |
| snapshot digest/schema corrupt | consistency failure / dead-letter marker | manual | publish corrupt bytes |
| publication CAS conflict | another worker won | reload;classify current terminal state | overwrite winner |
| marker commit known failure after publisher return | source/outbox payload remain committed,publish outcome not locally final | retry marker finalize under external publication identity if supported | republish immediately |
| marker commit unknown | indeterminate | probe outbox marker and publisher idempotency identity | assume success/failure |
| duplicate publication job | replay stored report | no list/publish | scan again |

### 9.7 Operations Job mapping

Job input/runner validation before start UoW maps to `FailedPermanent` or `Blocked` report only when a valid report can be created；otherwise entry returns protocol failure。After a Draft report commits,item failures must be recorded under staged-job rules。

| Job flow | Retryable / partial causes | Permanent / blocked / manual causes | Recovery boundary |
|---|---|---|---|
| `PublishObservationOutboxFlow` | publisher unavailable,item CAS conflict | payload missing/corrupt manual;formal permanent publish failure | per-item marker;duplicate replays report |
| `RebuildObservationReadModelsFlow` | concurrent fence/CAS conflict after reload;temporary store unavailable | incomplete/oversized source by contract,corrupt index/composite,binding mismatch | failed item rollback + separate accounting;finalize only after complete classification |
| `RebuildSignalRollupsFlow` | temporary repository unavailable,CAS conflict | rollup invariant/incomplete source that cannot be bounded | retain old rollup;never read raw metric/trace |
| `RefreshReferenceSnapshotsFlow` | resolver unavailable,temporary adapter failure | forbidden body,invalid subject,deterministic mapping defect | formal Unresolved/Unavailable outcome may still be successful item |
| `ScanObservationGapsFlow` | temporary repository/projection unavailable | gap/degraded invariant or forbidden synthetic source | preserve existing gaps;do not fabricate material |
| `CoordinateObservationReplayFlow` | temporary projection/reference unavailable | replay/no-write/retention boundary -> Blocked;corrupt scope -> manual | no source repair;resume only allowed derived phases |
| `PrepareReportHandoffDeliveryFlow` | adapter temporary failure;known local finalize failure -> finalize-only | readiness/no-write hard block;invalid immutable input;external permanent failure | external call outside UoW;reuse same preparation/receipt |
| `PrepareExternalAuditExportDeliveryFlow` | adapter temporary failure;known local finalize failure | consumer/view mismatch,blocked visibility,external permanent failure | no external audit truth or signoff |
| `RebuildPeripheralViewsFlow` | store unavailable,CAS/fence conflict | dependency index corruption,consumer/scope mismatch | old peripheral view remains stale/blocked |

| Job branch | `ObservationJobOutcome` | Report state / rule |
|---|---|---|
| all items and finalize complete | `Completed` | `Completed` |
| at least one item failed but valid successes remain | `PartiallyCompleted` | `PartiallyCompleted`;failed/gap refs exact |
| transient run/item failure with no valid completion | `FailedRetryable` | `FailedRetryable`;does not authorize same execution mutation |
| deterministic/permanent failure | `FailedPermanent` | `FailedPermanent` |
| policy/no-write/retention/visibility hard block | `Blocked` | `Blocked` |
| same key/digest terminal report exists | `DuplicateReplayed` | original terminal report unchanged |
| terminal report/result missing or malformed | no replay outcome | consistency failure/manual;do not rerun body |

### 9.8 Handoff / Export phase mapping

| Phase / failure | Public/job mapping | Recovery | Durable truth boundary |
|---|---|---|---|
| prepare validation/readiness blocked before valid marker | rejected/blocked code | state/input change | no external call |
| valid local Blocked/Degraded preparation committed | Command accepted or Job blocked/partial with exact state | later new formal operation after state change | local observation-side marker only |
| external adapter temporary failure | failed retryable / delivery unavailable | dependency recovery | preparation remains;business truth unchanged |
| external formal permanent failure | failed permanent / external delivery failure | manual/new operation by policy | save body-free failure/receipt only |
| external success + local finalize known failure | no Delivered claim yet | retry finalize only with same preparation/receipt | do not redeliver |
| external success + local finalize commit unknown | indeterminate | probe local marker/result and external idempotency identity | do not assume acceptance |
| external receipt claims verdict/signoff/evidence body | boundary violation / blocked | input/provider correction + manual if persisted | never save or expose claim as truth |

Delivery `Prepared` / `Delivered` only expresses transport lifecycle。It never maps to final verdict、acceptance、signoff、真实run id或真实evidence alias。

## 10. 异常分支处理表

### 10.1 Entry与UoW前分支

| 场景 | 检测位置 | 处理方式 | 是否写审计 / event |
|---|---|---|---|
| command/query operation与body type不匹配 | api static route mapper | `ProtocolError::RouteBodyMismatch`;invalid request surface | 否 |
| required command metadata缺失 | api metadata validator | reject before digest/UoW | 否 |
| query actor/visibility metadata缺失 | api query mapper | invalid request;不读取projection | 否 |
| typed ref为空/owner不符 | contracts constructor | `InvalidRef`;不调用application | 否 |
| page cursor非法 | query page mapper | `InvalidPageCursor`;不执行repository page | 否 |
| inbound envelope字段缺失 | worker envelope validator | Rejected receipt surface;不解析payload | 否 |
| inbound schema unsupported | worker schema router | UnsupportedSchema;不解析payload | 否；不得mark stale |
| normalized digest无法构造 | entry digest mapper | InvalidRequest;不reserve idempotency | 否 |
| job metadata/scope malformed | jobs runner mapper | protocol error;不创建假report | 否 |
| adapter configured disabled before operation | application availability guard | Delayed/Blocked/availability surface by family | 否；不自动改配置 |
| actor不允许Command | authorization/read policy | Rejected/ActorNotAllowed | 否；Step 15可另定义异步telemetry |
| Query not visible | read policy | `Ok` response,body none,exact visibility | 否 |

### 10.2 Single-UoW Command / Consumer分支

| 场景 | 检测位置 | 处理方式 | 是否写审计 / event |
|---|---|---|---|
| reserve returns same digest completed | idempotency repository | rollback current UoW;load exact stored result | 不写新记录/event |
| completed reservation points to missing result | stored result lookup | rollback;consistency failure/manual | 只允许operations-visible telemetry later;不重建result |
| stored result kind/operation mismatch | replay assembler | consistency failure/manual | 否 |
| same key different digest | idempotency repository | rollback;Conflict | 否；old result不变 |
| required owner state missing | versioned load | rollback;TargetNotFound/Delayed by source semantics | 否 |
| domain factory/transition rejected | domain call | rollback;map exact domain code | 普通拒绝不写；formal quarantine/gap/no-write flow例外 |
| reserved transition called | domain/application state guard | rollback;InvalidStateTransition | 否 |
| forbidden body detected | boundary validator | never stage body;reject or stage only formal quarantine marker | quarantine flow可写body-free history/event |
| evidence-index preview ref-only/mismatch | handoff application guard | rollback;InvalidRequest | 否 |
| optimistic save conflict | repository CAS | rollback;VersionConflict | 否；reload后才可新attempt |
| mandatory history append fails | repository | rollback whole accepted UoW | 否；不能提交无history truth |
| membership planner cannot bound closure | planner | rollback;ProjectionIndexCorrupt/AssemblyFailed by cause | 否 |
| cursor allocation fails | UoW | rollback;dependency failure | 否 |
| source index/position/target aggregate update fails | projection store | rollback accepted mutation | 否 |
| outbox snapshot serialization fails | payload builder/append | rollback;SerializationFailed | 否；不提交truth后补event |
| outbox identity/digest invariant fails | outbox repository | rollback;OutboxInvariantViolation | 否 |
| stale marker mandatory write fails | projection store | rollback accepted mutation | 否；不得留下known view Fresh |
| stored result save fails | result repository | rollback whole UoW | 否 |
| idempotency complete fails | idempotency repository | rollback whole UoW | 否；不得留下dangling result semantics |
| commit known failure | UoW manager | return CommitFailed after backend confirms no commit | 否 |
| commit outcome unknown | UoW manager | return indeterminate;probe operation/key/result before action | 不写补偿event |
| rollback failure/unknown | UoW manager | fail closed;manual classification | 不得返回Rejected/Accepted as certain |
| no-write marker persistence fails | no-write repository | attempted forbidden write remains blocked;return failure | no normal event;lateroperations telemetry only |

### 10.3 Query异常分支

| 场景 | 检测位置 | 处理方式 | 是否写审计 / event |
|---|---|---|---|
| canonical lookup absent | read service | normal missing surface | 否 |
| empty list/page | repository/page mapper | visible empty success | 否 |
| not-visible / blocked | visibility policy | body none,not-visible/blocked surface | 否 |
| stale/rebuilding | freshness mapper | exact marker/progress surface;body byhint | 否 |
| dependency disabled/unavailable | availability mapper | exact availability;no enable/refresh | 否 |
| repository temporary unavailable | read port | semantic dependency failure | 否 |
| lookup row points to missing body/marker | projection adapter | consistency failure | 否；不构造placeholder |
| diagnostic scope/view/summary mismatch | diagnostic read | `DiagnosticCompositeCorrupt` | 否；no-write/manual |
| diagnostic Rebuilding progress missing | by-ref lookup | `RebuildProgressLinkMissing` | 否 |
| progress/maintenance/binding/request scope mismatch | linkage validator | matching consistency error | 否 |
| consistency hint RequireFresh sees stale | body gate | body none,exact stale surface | 否；不等待 |
| BestEffort sees unavailable without allowed degraded surface | body gate | body none | 否；不补默认body |

### 10.4 Consumer与Publisher异常分支

| 场景 | 检测位置 | 处理方式 | 是否写审计 / event |
|---|---|---|---|
| consumer duplicate same digest | idempotency branch | rollback/replay receipt | 无新event |
| consumer digest conflict | idempotency branch | reject/quarantine by protocol;old result unchanged | 无正常event |
| producer raw body | boundary validator | quarantine/reject;never persist body | formal quarantine marker/event only |
| temporary resolver failure | resolver port | Delayed;no fabricated snapshot | optional existing gap ref,无normal event |
| formal resolver outcome Unresolved/Unavailable | application mapper | may commit explicit reference state | reference change event only if committed |
| ack fails after committed consumer result | worker runtime | WorkerError::AckFailed;durable local result remains | 不回滚local truth；broker retry将duplicate replay |
| dead-letter runtime handoff fails | worker runtime | WorkerError::DeadLetterFailed | 已有local marker保持；不复制raw payload |
| outbox payload missing/corrupt | publisher preflight | no publish;consistency/dead-letter classification | valid short UoW可写dead-letter marker |
| publisher temporary failure | publisher port | mark Failed with expected version | publication marker only |
| publisher permanent failure | publisher formal outcome | mark DeadLettered | publication marker only |
| publication marker CAS conflict | outbox repository | reload current state;winner terminal wins | 无额外event |
| publisher success then marker known failure | short finalize UoW | retain receipt context;retry finalize only if publisher identity supports | 不重新发布 |
| publisher success then marker commit unknown | UoW manager | probe marker/provider identity | 不假定成功或失败 |

### 10.5 Staged Job与external call异常分支

| 场景 | 检测位置 | 处理方式 | 是否写审计 / event |
|---|---|---|---|
| duplicate terminal job | start reservation | rollback/replay stored report | 无新scan/item/event |
| same-digest nonterminal job with Active claim | start/resume gate | return already-running/in-progress；`IdempotencyInFlight` | 无new plan/report/candidate scan |
| same-digest nonterminal job with Released/Expired claim | execution repository | acquire fresh monotonic fence and resume exact immutable plan | claim write only before item work；不得regenerate plan |
| duplicate points to missing report/result | start replay | consistency failure/manual | 否；不得rerun body |
| target binding differs | start UoW guard | conflict/block before items | report仅在valid start时存在 |
| first-bind member position missing | target aggregate init | rollback entire start UoW | 否 |
| item capture incomplete/oversized | source reader | rollback item;separate failure accounting | failure report classification only |
| item assembly fails | pure assembler | rollback item;failure accounting | 不保存partial view |
| item source-read/CAS conflict | replace/commit | rollback item；reload source/view/version then classify | failure/ref report按policy |
| item/execution claim fence conflict | commit validation | `ExecutionFenceConflict`；rollback,reload current claim/plan/item/report and wait/resume bystate | stale worker不得写failure classification |
| item failure accounting fails | short accounting UoW | stop scheduling;retain prior durable items | 不遗忘或假装该item已分类 |
| finalize sees incomplete classification | finalize guard | report partial/failed;target non-Fresh | report/progress marker可写 |
| finalize CAS conflict | finalize UoW | reload,finalize-only reevaluation | 不重做items |
| reference resolver formal Invalid | refresh item | commit Invalid if valid outcome | reference event/report,不修external truth |
| replay/no-write/retention hard block | policy guard | Blocked report/maintenance | body-free violation/gap marker only whereformal flow owns |
| handoff/export adapter temporary failure | external phase after committed intent | report failed retryable；intent/preparation retained,same token only | local failure marker only |
| handoff/export call outcome unknown | external phase | probe exact stable token；Unknown/Unsupported -> stop/manual | probe只读；不得blind retry或new token |
| external formal permanent failure | external phase | failed permanent + body-free receipt/failure ref | local delivery record only |
| external success,local finalize known failure | finalize UoW | retry finalize only withsame receipt | 不重复external call |
| external success,local finalize unknown | finalize commit | probe local/external identity | 不声称Delivered/accepted |
| final report save/result complete failure | finalize UoW | rollback finalize;earlier items remain | no terminal claim |

## 11. 恢复口径表

### 11.1 Recovery decision algorithm

```text
1. Identify the durable phase: before UoW / staged / committed / external returned / finalize unknown.
2. Match the exact typed error variant;never parse message text.
3. If outcome is unknown,probe before any repeat.
4. If a winner may have committed,reload version/state before reevaluation.
5. If external work succeeded,retry finalize only.
6. If immutable sidecar/index/payload is missing or corrupt,fail closed and require manual intervention.
7. Only an existing formal flow may write recovery marker/history/outbox.
8. Never repair or compensate by mutating upstream business truth.
```

### 11.2 Recovery matrix

| Failure | Durable state at detection | Recovery class / exact action | Stop / manual condition |
|---|---|---|---|
| invalid metadata/body/ref/page | none | input change | repeated unchanged input |
| unsupported event schema | none | do not retry same input;producer upgrades schema | no parser fallback |
| actor/not-visible/policy blocked | no mutation or formal blocked marker | state change | no privilege widening |
| idempotency digest conflict | old reservation/result | do not retry same operation/key/input | new key cannot be used to bypass same logical operation policy |
| idempotency same-digest in-flight | Reserved original execution | state change；wait for reservation/report/claim progression | no second writer,timeout alone不证明abort |
| duplicate same digest | old completed result | replay exact stored surface | missing result -> manual |
| optimistic conflict | concurrent winner committed | rollback,reload,reevaluate | repeated conflict policy later;never overwrite |
| execution fence conflict | current worker lost durable authority | rollback,reload plan/current claim/item/report；fresh claim only after formal Released/Expired | stale token never reused；lease expiry不证明item rollback |
| repository/resolver unavailable | no accepted commit or old state retained | dependency recovery | adapter reports deterministic/config defect -> manual/state change |
| known commit failure | backend proves no commit | dependency recovery then new attempt | if proof unavailable -> probe/manual |
| commit outcome unknown | may be committed | probe exact `(operation,actor,key)` reservation and exact result | ambiguous probe -> manual |
| rollback outcome unknown | staged effects uncertain | manual/probe backend transaction state | never return certain success/rejection |
| cursor gap after rollback | no visible row uses value | continue with next monotonic cursor | never reuse/infer data loss |
| stored result missing/wrong kind | completed reservation corrupt | manual | never reconstruct from current truth |
| history/outbox/result write failed before commit | all changes staged | rollback whole accepted UoW | rollback unknown -> manual |
| payload missing/corrupt after commit | source/outbox row committed | manual/dead-letter marker if valid | never rebuild bytes |
| publisher temporary failure | source/payload committed,marker Pending/Failed | dependency recovery;future publication attempt | exhaustion policy not defined here |
| publisher call outcome unknown | stable publication token committed/planned | probe exact token；Published -> finalize-only,NotPublished + formal abort proof -> same-token retry | Unknown/Unsupported -> manual；no blind publish |
| publisher permanent failure | source/payload committed,marker DeadLettered | manual/new operator action only | never mutate payload/source |
| publish success + local marker known failure | provider may have accepted | finalize only using provider identity | identity unavailable -> probe/manual |
| projection source closure incomplete | source truth committed,old view retained | input/state change or manual by cause | do not truncate/default |
| projection fence/CAS conflict | concurrent source/view change | reload/new item UoW | repeated policy later |
| projection index/composite corrupt | committed derived metadata broken | manual;old safe surface unavailable/stale | no Query repair |
| diagnostic rebuilding linkage broken | committed diagnostic metadata broken | manual;return consistency failure | do not drop rebuild or guess target |
| target binding mismatch | immutable old binding/report | no same-target retry with changed set | create formal new target/operation only if protocol permits |
| target member position missing | no valid start commit | state/data repair | no zero/None fabrication |
| job item failed | earlier items may be committed | rollback item,separate failure accounting | accounting failure stops scheduling |
| job finalize failed known | item classifications committed | finalize only after completeness audit | no item rerun |
| job finalize unknown | terminal may be committed | probe report/result/idempotency | ambiguous -> manual |
| reference formal Unresolved/Unavailable | valid snapshot state committed | state/dependency change then explicit refresh | no external body copy |
| reference Invalid | terminal snapshot | new explicit snapshot under formal protocol | no in-place Invalid->Resolved |
| retention/protection conflict | concurrent/current protection wins | reload and reevaluate | no source delete |
| no-write marker persistence failure | attempted write blocked,no marker guaranteed | manual/operations signal | forbidden write never allowed through |
| external delivery temporary failure | local preparation retained | dependency recovery | no source truth rollback |
| external prepare/deliver outcome unknown | immutable intent token exists | exact token probe before any repeat | Unknown/Unsupported -> manual；no new token/material |
| external success + local finalize known failure | receipt/preparation available | finalize only | no redelivery |
| external success + local finalize unknown | local state uncertain | probe local marker/result + external identity | ambiguous -> manual |
| forbidden body already persisted | invalid committed state | immediate fail closed/manual containment | no normal read/export/publish |

### 11.3 Recovery ownership

| Recovery target | Allowed owner | Allowed effect | Forbidden effect |
|---|---|---|---|
| command retry/replay | application service + idempotency/result repos | reload/replay/new accepted UoW | bypass policy or overwrite winner |
| consumer retry | worker runtime + inbound service | redeliver envelope;duplicate replay | parse unsupported/raw body |
| outbox publication | publication service | publish stored snapshot;update marker | rebuild payload/source |
| projection/read model | maintenance service | rebuild derived bundle/progress/report | change source truth |
| reference snapshot | refresh job + resolver port | new safe snapshot/refresh record | copy external body or alter external owner |
| handoff/export | maintenance service + delivery port | prepare/deliver/finalize local marker | claim external verdict/signoff |
| consistency defect | operations/manual path to be bound later | inspect body-free refs,repair derived metadata through formal flow | ad hoc DB edit represented as normal success |

## 12. 审计、event、marker与stored surface写入规则

### 12.1 Error branch write matrix

| Branch | Local durable write | Outbox / event | Stored replay surface | 说明 |
|---|---|---|---|---|
| invalid request/ref/page/route | none | none | none | entry-local rejection only |
| unsupported inbound schema | none | none | none | payload not parsed |
| Command ordinary domain/policy rejection before accepted state | none;staged reservation rollback | none | none | 不另开隐藏rejection transaction |
| accepted intake decision with receipt/safety `Rejected` state | receipt/safety/decision/history under formal Command | exact body-free changed event if Step 09 flow requires | yes | negative domain decision is still an owned fact |
| accepted quarantine | quarantine receipt/decision/gap/no-write marker only | quarantine/gap/violation event only | yes when transaction commits | raw body never stored |
| idempotency duplicate | none in current UoW | none | read original | no new issue/event ref |
| idempotency in-flight | none in incoming UoW | none | none | original reservation/plan/report unchanged；second body forbidden |
| idempotency conflict | none | none | none;old surface retained | do not expose old result body/ref as new result |
| optimistic conflict | none after rollback | none | none | conflict telemetry later only |
| temporary dependency failure before accepted write | none | none | none by default | existing gap ref may be returned;new gap requires formal flow |
| accepted reference Unresolved/Unavailable outcome | snapshot/refresh record | reference changed event if defined | job/consumer result | formal outcome,not adapter call failure |
| accepted gap/degraded/blocked marker | exact owning object/history | matching gap/handoff/export event | result/report as flow defines | marker may describe failure without becoming business truth |
| known accepted-UoW failure | rollback all staged writes | none | none | no partial success |
| commit unknown | no compensating write | none | none until probe | response indeterminate |
| publisher failure | outbox publication marker + fenced plan/report classification only | no new source event | publication report/result | source/payload/token immutable；Failed不回Pending |
| projection item failure | separate fenced plan/report failure classification only | no projection-changed event | job report draft | old bundle remains |
| projection item success | view/composite + report success classification | derived changed event only if formal flow defines | job report draft | target not Fresh until finalize |
| external delivery failure | local preparation/delivery failure record + fenced plan/report | handoff/delivery event if committed | job result/report | body-free intent/receipt/failure only |
| external success + finalize failure | no Delivered marker until finalize commits | none | no terminal result | retry finalize/probe |
| consistency defect detected by Query | none | none | none | no read-access history or repair |
| no-write marker save failure | no marker guaranteed;attempted write blocked | none | none | fail closed |

### 12.2 Error context and redaction

Public / durable error detail may carry only:

- `ObservationProtocolErrorCode`。
- `ObservationProtocolSurfaceRef`、`ReasonRef`、`GapStateRef`、typed subject/progress/report/outbox refs。
- `ObservationRecoveryClass` derived `retryable` bool。
- body-free safe summary / failure class already defined by protocol or job report。
- trace correlation ref when already present in trusted metadata。

It must never carry:

- raw request/event/body、raw log/metric/trace/evidence或external response body。
- SQL/driver message、stack trace、file path、credential、endpoint secret或provider payload。
- fabricated evidence alias、run id、test result、acceptance/signoff或business verdict。
- error message text used as a control-flow discriminator。

### 12.3 Success event gate

```text
normal outbound event allowed
  iff owning local mutation + mandatory history + source index + outbox snapshot
      + stored result/idempotency completion all commit in the formal UoW

failure/diagnostic event allowed
  iff an existing formal flow owns that body-free marker/history/event

otherwise
  no durable event;Step 15 may later define redacted runtime telemetry
```

No implementation may add a generic `ErrorOccurred` durable event as a shortcut。Such an event would need its own protocol、owner、schema、transaction、retention和consumer contract and therefore requires reopening the relevant design Step。

## 13. Public outcome semantics

### 13.1 Command outcome

| Outcome | Exact meaning | Mutation semantics | Error field |
|---|---|---|---|
| `Accepted` | formal local operation committed,even if resulting owned state records rejection/blocked/degraded fact | committed exact writes | None |
| `DuplicateReplayed` | original stored result returned | no new write | None |
| `Rejected` | no formal local mutation committed for this attempt | none | Some |
| `Conflict` | idempotency digest or version semantics rejected attempt | none | Some |
| `Delayed` | operation did not commit requested mutation because dependency/state is not ready | none by default | Some |
| `Quarantined` | a formal body-free quarantine/decision marker committed;normal path blocked | only quarantine family | Some boundary code |

An object state named `Rejected` is not automatically `ObservationCommandOutcome::Rejected`。If a valid intake/safety decision was committed as an owned observation fact,the operation outcome is `Accepted` or committed `Quarantined` according to the flow。

### 13.2 Query surface versus error

| Condition | `Ok(ObservationQueryResult<T>)` | Entry error |
|---|---:|---:|
| not found / empty | yes | no |
| not visible / blocked | yes | no |
| stale / rebuilding / unknown freshness | yes | no |
| disabled / unavailable with valid persisted surface | yes | no |
| invalid request/page/ref | no | yes |
| repository call unavailable before a valid surface can be read | no | yes |
| dangling lookup/index/composite/progress linkage | no | yes,consistency failure |

### 13.3 Consumer outcome

| Outcome | Exact meaning | Runtime implication deferred |
|---|---|---|
| `Accepted` | local observation-side mutation committed | ack after commit |
| `Duplicate` | stored receipt replayed | ack without reapply |
| `Delayed` | no requested mutation committed;dependency/state not ready | retry/ack policy later |
| `Rejected` | validly classified but no local mutation | ack/dead-letter policy later |
| `Quarantined` | body-free quarantine marker committed | isolate;never replay raw body into normal path |
| `DeadLettered` | formal local dead-letter marker committed | runtime handoff must still be confirmed |
| `UnsupportedSchema` | body not parsed | producer/runtime policy later |
| `NoOp` | valid event required no state change | no hidden mutation |

### 13.4 Job/report outcome

`ObservationJobOutcome` is a response classification；`JobReportState` is durable one-execution state。They map as defined in §9.7 but are not interchangeable。In particular `DuplicateReplayed` never rewrites the original report,while terminal `JobReportState::FailedRetryable` does not itself schedule or authorize mutation in that sealed execution。Step 13 may retry an item classified `ObservationJobPlanItemState::FailedRetryable` only while the owning report remains Draft,under the same immutable plan and a fresh durable claim/fence；the two enums must not be conflated。

### 13.5 Unavailable,failed,and consistency defect

| Class | Meaning | Recovery owner |
|---|---|---|
| unavailable | dependency/runtime cannot currently serve a valid operation | dependency owner + future retry policy |
| formal failed outcome | publisher/delivery/resolver returned a valid body-free failure outcome | local marker/report owner |
| domain rejected/blocked | policy or state disallows effect | caller waits/changes formal state or input |
| consistency defect | committed rows/refs/invariants cannot all be true | operations/manual;never normal Query repair |
| indeterminate | commit/finalize may have succeeded | probe owner before classification |

## 14. Consistency defect catalog

| Defect ID | Detection invariant | Internal error | Public behavior | Recovery |
|---|---|---|---|---|
| `ECD-OBS-001` | completed reservation -> result row exists | `CompletedReservationResultMissing` | ConsistencyFailure;no replay | manual |
| `ECD-OBS-002` | stored result operation/kind/digest matches reservation | `StoredResultKindMismatch` | ConsistencyFailure | manual |
| `ECD-OBS-003` | outbox row -> exactly one immutable payload snapshot | `OutboxPayloadMissing` | publisher item failed/manual | never reconstruct |
| `ECD-OBS-004` | payload digest/schema/event/subject/cursor match | `OutboxPayloadCorrupt` / `OutboxInvariantViolation` | dead-letter/consistency | manual |
| `ECD-OBS-005` | projection lookup -> existing matching view/marker | `ProjectionScopeMismatch` / marker mismatch | Query consistency failure | manual/formal rebuild after repair |
| `ECD-OBS-006` | source record/item/ref/owner agree | `ProjectionIndexCorrupt` | rebuild item failed | manual |
| `ECD-OBS-007` | exact membership and positions/revisions agree | `ProjectionIndexCorrupt` | old view stale/unavailable | manual |
| `ECD-OBS-008` | diagnostic view/scope/summary/current pointer same composite | `DiagnosticCompositeCorrupt` | body unavailable;no-write | manual |
| `ECD-OBS-009` | diagnostic Rebuilding ref -> exact progress row | `RebuildProgressLinkMissing` | Query consistency failure | manual |
| `ECD-OBS-010` | progress -> same target Rebuilding maintenance | `RebuildMaintenanceLinkMissing` | Query consistency failure | manual |
| `ECD-OBS-011` | progress target -> immutable binding covering request scope | `RebuildTargetBindingMissing` | Query consistency failure | manual |
| `ECD-OBS-012` | target binding is immutable for one target | `MaintenanceTargetBindingConflict` | conflict/blocked | new formal target only |
| `ECD-OBS-013` | first-bind aggregate equals member positions | `PersistenceInvariantViolation` | start/finalize failed | manual/data repair |
| `ECD-OBS-014` | report scope classified exactly once | `JobError::ScopeClassificationConflict` | job consistency failure | manual/finalize audit |
| `ECD-OBS-015` | terminal report -> exact stored result/idempotency | result/report consistency error | no duplicate replay | manual |
| `ECD-OBS-016` | evidence-index input ref -> exact immutable constituents | `EvidenceIndexInputMismatch` | handoff rejected/consistency | input correction/manual if persisted |
| `ECD-OBS-017` | reference view -> matching snapshot/marker | `PersistenceInvariantViolation` | Query consistency failure | manual/formal refresh after repair |
| `ECD-OBS-018` | one UoW has one tagged cursor namespace | `PersistenceInvariantViolation` | commit rejected | manual adapter defect |
| `ECD-OBS-019` | rollback/commit outcome is classifiable | `RollbackFailed` / `CommitOutcomeUnknown` | indeterminate | probe/manual |
| `ECD-OBS-020` | no forbidden body exists in durable/public surface | domain boundary or persistence invariant | fail closed/quarantine | immediate manual containment |
| `ECD-OBS-021` | one reservation scope / inbound event identity maps to one compatible result/execution | idempotency/result consistency error | no replay or second writer | manual |
| `ECD-OBS-022` | Job plan/report/reservation identities,digests and item classifications are lossless and compatible | `PersistenceInvariantViolation` / `JobError::ReportInvariantViolation` | failed permanent/manual | manual；never regenerate plan |
| `ECD-OBS-023` | current item/report/marker writer holds the authoritative Active claim and fencing token | `ExecutionFenceConflict` when merely stale；persistence invariant if store admits stale commit | wait/reload or consistency failure | stale attempt rolls back；persisted stale write manual |
| `ECD-OBS-024` | external marker/receipt/material matches the committed immutable intent token | `PersistenceInvariantViolation` / `ExternalFinalizeUnknown` | consistency/indeterminate | probe/manual；never rebuild material |

Consistency defect refs may be exposed only through existing body-free issue/gap/report fields。The catalog ID is a design identifier,not a runtime evidence alias、acceptance ID、error database primary key或automatic telemetry name。

## 15. Error anti-patterns

| Anti-pattern | Why invalid | Correct rule |
|---|---|---|
| return generic `Failed` | caller cannot decide retry/recovery | exact typed variant + recovery class |
| parse error message | text/localization/provider changes control flow | match enum variant |
| expose raw adapter exception | leaks implementation/secret/body | map at port boundary |
| map every Query missing to error | breaks normal missing/degraded contract | return Query surface |
| map every Blocked/Rejected object state to operation rejection | loses committed negative fact | distinguish state from one-shot outcome |
| set retryable=true for commit unknown | authorizes duplicate mutation | ProbeBeforeRetry,false until probe |
| retry optimistic conflict with same version | guaranteed repeat conflict/overwrite temptation | reload version/state |
| retry stale execution fence as optimistic CAS | old claimant has no authority even after row reload | wait/reacquire formal claim,then use new token |
| rebuild missing stored result | falsifies original response | manual consistency failure |
| rebuild outbox payload from current truth | changes committed event history | dead-letter/manual |
| inline Query repair | hidden write/no-write violation | fail closed,separate formal maintenance flow |
| save rejected request for audit by default | introduces unowned hidden write | no write unless formal flow owns marker |
| persist raw body in quarantine/error | violates body-free boundary | only refs/digest/safe reason |
| ack consumer before commit | loses event on commit failure | ack after committed receipt/result |
| rollback source truth after publish failure | source transaction already committed | update publication marker only |
| redeliver after external success + local finalize failure | duplicates external effect | finalize-only/probe |
| treat probe Unsupported/Unknown as NotDelivered | authorizes duplicate external effect | stop/manual until target capability/state is known |
| mark whole target Fresh after last item succeeds | ignores failed/stale members | target completeness/fence audit |
| convert reference call failure to formal Invalid | confuses adapter failure with domain outcome | unavailable error vs valid resolution outcome |
| treat cursor gap as lost event | rollback may consume cursor | cursor opaque;inspect committed records |
| edit terminal job report on duplicate | corrupts execution evidence | replay immutable report |
| use dead-letter as raw payload archive | leaks unsupported/forbidden body | body-free marker only |
| let no-write marker failure allow attempted write | fail-open boundary | attempted write remains blocked |
| claim Delivered as acceptance/signoff | transport fact is not business verdict | preserve ownership boundary |
| invent HTTP/RPC numbers here | binds transport before adapter design | semantic transport class only |
| define retry count/backoff here | crosses into later concurrency/config design | only recovery classification |

## 16. 前序契约回填计划

| 文件 | 必须回填 | 状态 |
|---|---|---|
| `03_ddd_step_06_object_contracts.md` | 已回填`ProtocolError`、19个`DomainError`、4个`JobError`及owner边界 | done |
| `03_ddd_step_07_trait_port_adapter_contracts.md` | 已回填`ApplicationError`含`IdempotencyInFlight` / `ExecutionFenceConflict`、`ApiError`、`WorkerError`、8类`ObservationRecoveryClass`和raw adapter映射 | done |
| `03_ddd_step_08_protocol_contracts.md` | 已回填8个public code、Command/Consumer optional result ref、三个carrier error field、field source与互斥不变量 | done |
| `03_ddd_step_09_function_flows.md` | 已回填typed domain-to-application mapping、Step 12 closure row并完成variant definition-use审计 | done |
| `03_ddd_step_10_state_matrix.md` | 已将旧stored-result missing名称统一为`CompletedReservationResultMissing` | done |
| `03_ddd_step_11_persistence_transaction_consistency.md` | 已增加Step 12 recovery overlay；Step 13继续回填actor-scoped reservation、source version、immutable plan/claim/fence和external intent/probe transaction contract | done |

## 17. Cross-step closure audit

| 审查项 | 当前结论 | 证据 / 待办 |
|---|---|---|
| Step 06所有error token是否有定义 | pass | Protocol/Domain/Job enums + exact use audit |
| Step 07所有service/port error是否可分类 | pass | Application/Api/Worker enums + RecoveryClass |
| Step 08所有outcome/surface是否可承载error | pass | 18 public codes + optional result/error invariants |
| 16 Command是否有mapping | pass | §9.2~§9.3 |
| 14 Query是否区分normal surface与error | pass | §9.4 |
| 9 Consumer是否有mapping | pass | §9.5 |
| publisher是否区分source commit与publication failure | pass | §9.6 |
| 9 Job及staged phase是否有mapping | pass | §9.7~§10.5 |
| handoff/export是否有external/finalize cut | pass | §9.8 / §11 |
| Step 10非法/reserved transition是否映射 | pass | §8.4 / §9.2 |
| Step 11 failure recovery是否逐类承接 | pass | §10~§14 |
| in-flight与execution fence是否有typed classification | pass | §8.6~§11；不得降级为generic unavailable/CAS |
| Query no-write是否保持 | pass | §9.4 / §10.3 / §12 |
| raw body/no-signoff/no-truth-write是否保持 | pass | §7 / §12 / §15 |

### 17.1 Protocol-family error and recovery closure index

| 协议族 | 数量 | 必须覆盖的错误面 | recovery / write rule | 当前状态 |
|---|---:|---|---|---|
| Command C01-C16 | 16 | validation、domain transition、policy/boundary、missing relation、CAS、UoW/commit unknown、stored-result inconsistency | typed `DomainError` / `ApplicationError`；失败事务 rollback；commit unknown 先 probe 原 reservation/result/marker，不重复 mutation | `pass_with_affected_open`; result-body、recovery-class、UoW affected 保留 |
| Query Q01-Q14 | 14 | malformed selector、missing/hidden、stale/rebuilding、relation corruption、availability/read failure | response surface 与 error 互斥；Query 无写 UoW、无 repair/refresh/gap/read-audit；consistency defect fail closed | `pass_with_affected_open`; Q-specific source/precedence/carrier affected 保留 |
| Consumer I01-I09 | 9 | header/schema/producer binding、payload redaction、source-version、duplicate/in-flight、commit unknown、worker action | header failure 不解析 payload；known committed result按 exact mapper 选择 receipt/action；indeterminate 不 wildcard ack/retry/dead-letter | `pass_with_affected_open`; `S08-E-I05-*`、`S08-RECOVERY-CLASS-OWNER-01`、`S08-CONSUMER-INDETERMINATE-COMPLETION-01` 保留 |
| Outbound Event E01-E12 | 12 | encoder/schema/binding、source UoW rollback、payload corruption、publication unavailable、CAS/finalize unknown | source commit 与 publication 分离；publisher 只读 stored snapshot；Unknown 先 same-token probe；不得从 current truth 重建 | `pass_with_affected_open`; producer schema/binding 与 external phase affected 保留 |
| Operations Job J01-J09 | 9 | plan/claim/fence、item failure、partial report、resume、external prepare/delivery/probe/finalize | immutable plan；item failure fold 为 typed outcome；Failed 不自动回 Pending；J06 H13 controlled/manual；J07/J08 phase 不合并 | `pass_with_affected_open`; H13、job report ref、external phase/retry accounting 保留 |
| 合计 | 60 | 五协议族的 typed error、public/worker/job surface 与 recovery class | `60/60` 有错误/恢复映射；`0/60` 无条件完成 | `pass_with_affected_open` |

`DomainError::ReservedTransition` 与 `ApplicationError::ReservedTransition` 保持不同层级：前者
表示 domain transition guard，后者表示 application protocol/phase guard，不能因同名而合并或删除。

## 18. 后续详细设计承接边界

本Step只向后续详细设计提供以下固定输入,不进入其内部讨论:

- retry classification已经固定；Step 13已补claim/fence、same-execution重入和stable external token/probe语义，具体次数、duration、backoff、heartbeat和exhaustion数字仍未定义。
- adapter disabled/unavailable/timeout的具体配置key、binding和transport行为仍未定义。
- error telemetry、structured log、metric、trace span和operations alert切口仍未定义。
- 每类error/recovery的最小测试切口仍需在对应测试Step收口。

后续Step不得把 `ProbeBeforeRetry` 简化为automatic retry,不得把 `ManualIntervention` 改成silent repair,也不得改变本Step的public outcome语义。

## 19. 回填草稿

正式 `03-详细设计.md` Step 19装配时,§11至少包含:

```md
## 11. 错误模型、异常分支与恢复口径

### 11.1 错误层级与类型
写入 Protocol / Domain / Application / API / Worker / Job error owner和RecoveryClass。

### 11.2 Public mapping
写入Command、Query、Consumer、Publisher、Job、Handoff/Export映射和carrier互斥规则。

### 11.3 Exception and recovery
写入UoW、duplicate、conflict、unknown outcome、projection/reference、staged Job、external finalize恢复表。

### 11.4 Consistency defects and write rules
写入durable sidecar/index/payload/report defect、no-write、event gate和anti-pattern。
```

正式正文不得压缩为“统一返回错误并重试”,也不得恢复旧schema、raw body、产品错误码或自动顺推心智。

## 20. 待确认事项与blocker

| 项目 | 当前结论 | 是否阻塞本Step |
|---|---|---|
| 具体HTTP/RPC code数字 | 留给transport adapter | 否 |
| retry次数/backoff/lease/claim/exhaustion | 留给后续详细设计 | 否 |
| dead-letter queue/topic/runtime ack策略 | 留给external binding | 否 |
| error log/metric/trace/alert名称 | 留给observability/audit埋点Step | 否 |
| SQL/driver/provider raw error映射细节 | adapter实现必须满足§8.8,具体产品后移 | 否 |
| 目标实现仓当前未发现 | 实施前置gate仍在Step 17 / `07` | 否,不阻塞design |
| 上游 `00/01/02` truth conflict | 未发现 | 否 |

## 21. 自检与进入下一步条件

| 检查项 | 当前结论 |
|---|---|
| 是否读取Step 12 SOP/5.11、Step 06~11和L1参考 | pass |
| 是否把旧81行Step 12降级为historical material并全量替换 | pass |
| 是否输出错误类型表 | pass |
| 是否输出错误映射表 | pass |
| 是否输出异常分支处理表 | pass |
| 是否输出恢复口径表 | pass |
| 是否区分不可重试、input/state/reload/dependency/finalize/probe/manual | pass |
| 是否覆盖Command/Query/Consumer/Publisher/Job/Handoff | pass |
| 是否避免HTTP/RPC数字、retry参数、配置和telemetry越界 | pass |
| 是否完成前序回填和definition-use审计 | pass |
| 是否未修改正式 `03-详细设计.md` | pass |
| 是否发现新的上游blocker | no |
| inherited affected 是否保留 | yes | `S08-E-I05-PAYLOAD-SCHEMA-01`、`S08-E-I05-PRODUCER-EVENT-BINDING-01`、`R06-F-AFFECT-UOW-01`、`S08-RECOVERY-CLASS-OWNER-01`、`R07-EXTERNAL-PHASE-*`、`S08-CONSUMER-INDETERMINATE-COMPLETION-01`、`S08-JOB-REPORT-REF-OWNER-01` |

## 22. 门禁

| gate_status | gate_reason | next_allowed_action |
|---|---|---|
| `pass_with_affected_open` | 错误类型、public mapping、异常分支、recovery class、write rule、consistency defect及Step 06~11回填均有记录；inherited owner/action/phase affected 仍开放 | continue_M2_step_13;stop_after_step_15_before_step_16 |
