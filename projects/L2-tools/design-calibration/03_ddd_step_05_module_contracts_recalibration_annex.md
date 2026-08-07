# L2-tools Step 5 粒度再校准附录: 模块 implementation cards

> 对标: `projects/L1-governance/design-calibration/03_ddd_step_05_module_contracts.md`
> 主文件: `03_ddd_step_05_module_contracts.md`
> 状态: in_progress / R-5
> 写入规则: 本附录只补模块级 owner、文件、callable、错误、测试和回指；对象字段在 Step 6，trait 方法在 Step 7，协议 schema 在 Step 8，函数流在 Step 9。

## 1. R-5 开工门禁

| 项目 | 记录 |
|---|---|
| 重新读取 | `03_ddd_step_04_file_layout.md`;正式 `02-概要设计.md` §4~§7、§12; `详细设计讨论流程_SOP.md` Step 5; `详细设计书写规范.md` §5.5; L1 Step 5 对标文件 |
| 旧材料处理 | 旧 README / 正式 03 / 05 / 06 仍为 `historical_material`，不提供 module、crate、transport 或 persistence 事实 |
| 业务对象池 | 继续使用正式 02 的六组成部分和 41 对象；本附录不得新增 identity-bearing domain object |
| 目标 | 让实现者从一个模块卡知道“在哪个文件、由哪个 callable、调用哪些后续契约、返回什么错误、需要哪些最小测试” |
| 进入条件 | Step 4 `pass`; R-0 粒度审计已记录缺口 |
| 输出限制 | 不改正式 `03-详细设计.md`;不声称实现仓、测试结果或 provider readiness |

## 2. 模块卡固定模板

每个模块必须填满以下字段，缺一项不得标记 `pass`:

| 字段 | 最小内容 |
|---|---|
| implementation unit | planned crate/package、目录和文件职责 |
| owned surface | 本模块唯一拥有的对象、carrier、service 或 entry |
| capability callables | 按名称列出可被其他模块调用的入口；不能只写“service” |
| downstream references | Step 6 object、Step 7 Port/Store、Step 8 protocol、Step 9 flow 的精确文件和 ID |
| error boundary | 本模块产生/映射/禁止产生的错误 |
| side-effect boundary | 是否可写 truth、append-only、projection、idempotency 或 external Port |
| test cuts | 正常、确定性负面、冲突/重复、blocked/degraded 最小切口 |
| forbidden surface | 明确不拥有的相邻 truth |
| stop gate | 模块自检、跨模块回指、reopen 条件 |

## 3. `contracts` implementation card

### 3.1 Unit and files

| 文件 | 唯一职责 | 禁止承载 |
|---|---|---|
| `crates/contracts/src/refs.rs` | typed ID/ref、closed subject union、source/authority/ref-set | domain transition、字符串拼接的隐式 identity |
| `crates/contracts/src/metadata.rs` | `CommandMetadata`、`QueryMetadata`、`JobMetadata`、digest frame | transport header、认证实现、clock/ID 生成 |
| `crates/contracts/src/commands.rs` | 13 Command request/result DTO 和 closed dispatch enum | repository version、UoW handle、raw invocation body |
| `crates/contracts/src/queries.rs` | 11 Query request/response/page DTO | query-side refresh、external client type |
| `crates/contracts/src/consumers.rs` | 5 inbound envelope payloads、receipt carrier | broker ack、DLQ、source body |
| `crates/contracts/src/events.rs` | 4 semantic outbound event envelopes/payloads | route/topic/retry/delivery truth |
| `crates/contracts/src/jobs.rs` | 4 job request/report/output refs | scheduler/run/evidence/signoff truth |
| `crates/contracts/src/views.rs` | body-free views, visibility/freshness/degraded surfaces | domain invariant or mutable truth |
| `crates/contracts/src/errors.rs` | `ProtocolError` and stable code mapping target | backend/provider text, secrets, stack traces |

### 3.2 Owned callable surface

| Callable | Caller | Input source | Output | Side effect |
|---|---|---|---|---|
| `CommandMetadata::validate` | api/application | command entry metadata | `Result<(), MetadataError>` | none |
| `CommandMetadata::canonical_digest_frame` | application idempotency | validated metadata + semantic request | `CommandMetadataDigestFrame` | none |
| `QueryMetadata::visibility_input` | query service | validated query metadata | `VisibilityInput` | none |
| `InboundEventEnvelope<T>::validate_envelope` | worker | supported version set + envelope | `Result<(), EnvelopeError>` | none |
| `InboundEventEnvelope<T>::dedup_key` | consumer service | validated envelope | scoped source key | none |
| `InboundEventEnvelope<T>::derive_integration_command_metadata` | IF-03 only | validated envelope + command kind | `CommandMetadata` | deterministic only; does not call ID port |
| `Page::empty` / `Page::map_items` | query mapper | watermark/freshness + items | public page | none |
| `ConsumerReceipt::{accepted,duplicate,rejected,quarantined,gap_recorded}` | application consumer | typed refs/gaps/retry hint | `ConsumerReceipt` | none |
| `JobReport::validate` | jobs entry/application | report counts/cursor/watermark | `Result<(), JobReportError>` | none |
| `ProtocolError::from_application_error` | api/worker/jobs | typed application error + correlation | redacted `ProtocolError` | none |

### 3.3 Capability-to-downstream matrix

| Capability | Domain source | Step 7 consumer | Step 8 surface | Step 9 flow |
|---|---|---|---|---|
| contract view | `ToolContractView` | `ToolContractStore` read bundle | `GetToolContract`, contract Commands | `CF-01~04`, `QF-01~02` |
| binding view | `CapabilityBindingView` | `CapabilityBindingStore` | binding Commands/Query | `CF-05~07`, `QF-03`, `IF-01` |
| invocation/admission view | `ToolInvocationView` | `ToolInvocationStore` | `SubmitToolInvocation`, `GetToolInvocation` | `CF-08`, `QF-04` |
| precondition/handoff view | `ExecutionPreconditionView`, `ExecutionHandoffCommandView` | `ExecutionHandoffStore`, external Ports | `EvaluateExecutionPreconditions`, `PrepareExecutionHandoff`, query | `CF-09~10`, `QF-05` |
| outcome/audit view | `OutcomeAuditView` | `OutcomeAuditStore` | `AcceptExecutionSource`, `GetOutcomeAudit` | `CF-11`, `QF-06`, `IF-03` |
| safe material/attempt view | `SafeExternalHandoffView`, `ExternalSubmissionAttemptView` | `ExternalSubmissionStore`, collaboration Port | `PrepareSafeExternalHandoff`, four Event envelopes | `CF-12`, `OF-01~04`, `IF-04~05` |
| integrity/report view | `ConsistencyGapView`, report/projection views | `ProjectionStore` | `RecordConsistencyGapResolution`, queries/jobs | `CF-13`, `QF-07~11`, `JF-01~04` |

### 3.4 Error and test cuts

| Error family | Contract mapping | Minimum test |
|---|---|---|
| unsupported protocol/version | `ProtocolErrorClass::InvalidInput` | unknown command/query/event/job version produces no domain/store call |
| missing metadata/actor/correlation | `InvalidInput` with no subject refs | each entry rejects before idempotency reserve |
| forbidden body | `InvalidInput` or `IntegrityFailure` | prompt/capture/provider body cannot cross contract boundary |
| duplicate/equal digest | `EntryDisposition::DuplicateReplay` or `ConsumerDisposition::Duplicate` | replay preserves stored typed snapshot, not current truth |
| same key/different digest | `Conflict` | no overwrite and no second domain call |
| blocked authority/mapping/route | `Blocked`/`Unavailable` | redacted stable error, no positive readiness/delivery claim |

### 3.5 Module stop gate

| Check | Result |
|---|---|
| Every public carrier has a file and one construction owner | pass |
| Metadata/authority is not duplicated in request payloads | pass |
| Public types do not depend on domain/application/infra types | pass |
| Error mapping has no raw body/backend detail | pass |
| Step 6/7/8/9 downstream IDs are listed for each capability | pass |
| Reopen trigger | new public carrier, transport-specific field, or truth-bearing state is proposed |

## 4. `domain` implementation card

### 4.1 Unit and files

| 文件 | 六组成部分承接 | 唯一 owner |
|---|---|---|
| `contract.rs` | 工具合同与演进 | `ToolContract`, `FormalToolDefinition`, impact/fact lifecycle |
| `binding.rs` | Capability Binding 与受控来源 | relation, snapshot/assessment symmetry, binding change fact |
| `invocation.rs` | 规范调用与受理 | canonical invocation, anchor and admission decision |
| `precondition.rs` | 执行前置 | requirement derivation, authorization consumption assessment |
| `handoff.rs` | 条件交接 | handoff eligibility/state and local handoff attempt semantics |
| `outcome.rs` | Outcome/审计 | source assessment, terminal outcome, audit pair invariants |
| `safe_handoff.rs` | 安全交接 | four-gate eligibility, immutable safe material, submission attempt local state |
| `integrity.rs` | 引用完整性/派生 | validity assessment, gap, projection/report pure derivation |
| `shared.rs` | domain-local pure values | canonical identity checks, correlation/ref symmetry, body-free guards |
| `policies.rs` | policy boundary | visibility and invariant policies; no external authority decision |
| `errors.rs` | domain errors | typed invariant/state/body/identity failures |

### 4.2 Callable index

| Callable family | Exact members | Consumed by |
|---|---|---|
| contract lifecycle | `ToolContract::establish`, `FormalToolDefinition::formalize`, `ToolContract::adopt_revision`, `ToolContract::retire`, `ToolCompatibilityImpact::assess` | `CF-01~04`, `QF-01~02` |
| binding lifecycle | `CapabilityBinding::{declare,replace,invalidate}`, `HubControlledSnapshot::from_port`, `CapabilityBindingAssessment::assess`, `CapabilityBindingChangeFact::record` | `CF-05~07`, `IF-01`, `QF-03` |
| invocation admission | `ToolInvocation::canonicalize`, `InvocationContractAnchor::anchor`, `InvocationAdmission::{admit,reject,unavailable}`, `InvocationContextRefs::from_formal_context` | `CF-08`, `CF-11`, `QF-04` |
| precondition | `ExecutionRequirement::derive`, `AuthorizationConsumptionAssessment::{consume,fail_closed}`, `SandboxReadinessSnapshot::{from_port,mapping_blocked,unavailable}` | `CF-09`, `IF-02`, `QF-05` |
| handoff | `SafeHandoffEligibility::evaluate`, `ExecutionHandoff::{prepare,record_*}`, `ExecutionHandoffAttempt::{prepared,record_*}` | `CF-10`, `QF-05` |
| outcome/audit | `ExecutionSourceAssessment::{accept,reject,missing,conflicting,mapping_blocked,unverifiable}`, `ToolInvocationOutcome::establish`, `ToolAuditEntry::record` | `CF-11`, `IF-03`, `QF-06` |
| safe handoff | `SafeHandoffMaterial::prepare`, `ExternalSubmissionAttempt::{prepare,record_submission,record_local_failure,record_route_blocked,record_outcome_unknown}`, `SafeHandoffEligibility::source_key` | `CF-12`, `OF-01~04`, `QF-06` |
| integrity | `ReferenceValidityAssessment::assess`, `ConsistencyGap::{detect,resolve}`, `ReferenceConsistencyReport::project`, derived view `project/mark_stale` | `CF-13`, `QF-07~11`, `JF-01~04` |

### 4.3 Domain invariants and forbidden calls

| Invariant | Enforcement point | Forbidden |
|---|---|---|
| no raw request/result/provider body | `canonicalize`, safe summary factories, `record` | storing bytes, prompt, capture or secret |
| one terminal outcome/audit pair per invocation | `ToolInvocationOutcome::establish`, `ToolAuditEntry::record` and pair store | late material overwrite |
| binding relation is Command-owned | `CapabilityBinding` transitions | Consumer/Query/Job mutation |
| authorization is consumed, not decided | `AuthorizationConsumptionAssessment` | local allowlist/self-authorization |
| Sandbox lifecycle remains external | `ExecutionHandoff`/`SandboxExecutionSourceRef` | run/receipt/cleanup/retry state |
| safe material requires four checks | `SafeHandoffEligibility::evaluate` | config/test bypass |
| projection/gap is derived or diagnostic | `integrity.rs` factories | repair subject truth from Job/Query |

### 4.4 Domain test cuts and stop gate

| Cut | Minimum assertion |
|---|---|
| factory valid path | all required refs/correlation/state created from named source |
| deterministic invalid | missing identity, mismatched revision, forbidden body, illegal transition returns typed `DomainError` |
| duplicate/late | equal append is idempotent; different terminal/source basis is conflict; no overwrite |
| blocked external | absent authority/mapping produces `Unverifiable`/`MappingBlocked`, never positive state |
| policy boundary | policy guard remains pure and cannot call store/Port |

Module gate: **pass pending R-6 object carrier audit**. Reopen if a proposed callable introduces a new identity, state subject or external lifecycle field.

## 5. `application` implementation card

### 5.1 Unit and files

| 文件 | Callable responsibility | Write authority |
|---|---|---|
| `contract_service.rs` | CF-01~04, QF-01~02 command/query facades | ToolContractStore + UoW |
| `binding_service.rs` | CF-05~07, QF-03, IF-01 local application mapping | CapabilityBindingStore + UoW; no relation write for IF-01 |
| `invocation_service.rs` | CF-08, QF-04 and formal invocation caller seam | ToolInvocationStore + UoW |
| `precondition_service.rs` | CF-09, QF-05, IF-02 consumption | HandoffStore + observational Authorization/Sandbox Ports |
| `handoff_service.rs` | CF-10, QF-05 handoff branch | HandoffStore + SandboxExecutionPort; two-phase side-effect fence |
| `outcome_service.rs` | CF-11, QF-06, IF-03 formal re-entry | OutcomeAuditStore + source intake Port |
| `safe_handoff_service.rs` | CF-12, OF-01~04 continuation | ExternalSubmissionStore + collaboration Port |
| `integrity_service.rs` | CF-13, QF-07~11 read/resolve mapping | ProjectionStore; never repairs truth |
| `consumer_service.rs` | IF-01~05 phase-1 claim/phase-2 receipt | IdempotencyStore + named stores; no direct entry writes |
| `job_service.rs` | JF-01~04 bounded maintenance | Job report/result store + named maintenance Port |
| `ports.rs` / `unit_of_work.rs` | all caller-owned traits and transaction helpers | application owns trait definitions |
| `idempotency.rs` | scope/digest/reserve/replay/claim completion | technical sidecar only |
| `errors.rs` | exhaustive application error union | body-free, owner-qualified |

### 5.2 Application facade callable matrix

| Facade | Exact callable | Main Port/Store calls | UoW/phase |
|---|---|---|---|
| Command | `ToolCommandUseCases::execute(ToolCommandRequest, CommandMetadata)` | dispatches exactly one CF-01~13 handler | command-specific UoW or named two-phase flow |
| Query | `ToolQueryUseCases::execute(ToolQueryRequest, QueryMetadata)` | visibility then exact read method | zero UoW/external Port |
| Consumer | `ToolConsumerUseCases::consume(ToolInboundConsumerInput)` | phase-1 claim, one observational call/page, phase-2 append/receipt | two local UoWs; IF-03 re-enters CF-11 |
| Continuation | `SafeMaterialContinuationUseCases::continue_material(SafeMaterialContinuationInput)` | material read, attempt store, one collaboration submit | phase-1 Prepared, external call, phase-2 local result |
| Job | `ToolJobUseCases::run(ToolJobRequest, JobMetadata)` | bounded store scan and optional blocked resolver | one bounded item/slice UoW per job policy |

### 5.3 Application error ownership

| Error | Produced by | Public mapping | Recovery owner |
|---|---|---|---|
| `Validation` | entry/application metadata and DTO guards | `InvalidInput` | caller |
| `NotFound` / `NotVisible` | visibility/read bundle | `NotFound`/`NotVisible` | caller; no retry by default |
| `Conflict` / `VersionConflict` | idempotency/store/domain | `Conflict` | owning Command or manual owner |
| `Blocked` | external Port/authority/mapping gate | `Blocked` | upstream owner; L2 fail closed |
| `Unavailable` | store/adapter/observational Port | `Unavailable` | configured dependency/recovery policy |
| `IntegrityFailure` | symmetry, candidate/receipt mismatch, late material | `IntegrityFailure` + gap if attributable | manual design/implementation owner |
| `CommitOutcomeUnknown` | UoW commit resolution | `ManualOwnerAction` | persistence authority; no blind replay |

### 5.4 Application test cuts and stop gate

| Cut | Minimum assertion |
|---|---|
| per-command accepted/rejected | exact CF callable, stored result snapshot, same-UoW local writes |
| query | visibility-first, zero UoW/external calls, explicit stale/unavailable surface |
| consumer | one claim under concurrency, one page, gap-only receipt, no body persistence |
| continuation | Prepared before one Port call; unknown never auto-retries; terminal replay exact |
| job | bounded deterministic slice, report replay, no subject repair |
| blocked dependency | typed blocker and retry hint, no positive readiness/delivery/observation |

Application gate: **pass pending R-7 exact seam audit**. Reopen if a service calls a method not listed in Step 7 or owns an external lifecycle.

## 6. `infra` implementation card

### 6.1 Unit and files

| 文件 | 唯一职责 | 实现的 application seam |
|---|---|---|
| `config.rs` | typed configuration candidate、外部绑定状态和 blocked defaults | `AdapterAvailability`, dependency binding helpers |
| `runtime_builder.rs` | composition root、adapter/store/fake 注入和 dependency graph assertion | `ToolsUnitOfWorkManager`, all Store/Port trait objects |
| `repositories.rs` | six local truth/append-only Store implementations | `ToolContractStore`, `CapabilityBindingStore`, `ToolInvocationStore`, `ExecutionHandoffStore`, `OutcomeAuditStore`, `ExternalSubmissionStore` |
| `projection_store.rs` | gap/reference/projection/report read/write and stale marker implementation | `ProjectionStore` |
| `idempotency_store.rs` | claim/result/receipt/report sidecar persistence | `IdempotencyStore` |
| `reference_store.rs` | body-free reference assessment persistence helper | `ProjectionStore` reference methods; no new Port |
| `source_resolvers.rs` | blocked/formal external resolver adapters | `SharedContractAuthorityPort`, `HubControlledSourcePort`, `AuthorizationConsumptionPort`, `ExecutionSourceIntakePort` |
| `publishers.rs` | safe material collaboration adapter and feedback resolver | `SafeEventCollaborationPort` |
| `handoff_adapters.rs` | Sandbox readiness/handoff adapter | `SandboxExecutionPort` |
| `clock_id.rs` | application `ClockPort` / `IdGeneratorPort` implementation | local time and ID generation only |
| `fakes.rs` | deterministic in-memory adapters with parity assertions | every application-owned trait |
| `errors.rs` | map backend-neutral adapter failures to `InfraError` | no raw backend detail crosses boundary |

### 6.2 Adapter implementation rules

| Rule | Required behavior | Negative test |
|---|---|---|
| caller-owned trait | adapter implements exact application trait without adding semantic method | compile/contract test rejects alternate method as flow dependency |
| version source | expected version/cursor/watermark comes from adapter/store authority | service-supplied timestamp/digest cannot be accepted as version |
| UoW | every local write receives the same `ToolsUnitOfWork` selected by application | cross-UoW partial pair is rejected by fake |
| durable/fake parity | fake returns same typed states, conflict categories and blocked states | each fake scenario has a corresponding adapter contract case |
| external mapping | unresolved owner/schema/route returns `AdapterAvailability::Blocked` | no “available” fallback from config presence |
| redaction | adapter error maps to safe enum/ref only | raw body, SQL, URL, token and stack trace absent |
| side-effect ownership | external adapter only calls named Port operation; no retry/DLQ/observation store | exactly-one-call assertion on ambiguous response |

### 6.3 Infra error map

| Infra condition | `InfraError` | Application mapping |
|---|---|---|
| local store unavailable | `StoreUnavailable` | `ApplicationError::Unavailable` |
| serialization/type mismatch | `SerializationMismatch` | `IntegrityFailure` |
| expected version mismatch | `OptimisticConflict` | `VersionConflict` |
| adapter not configured | `AdapterUnavailable` | `Unavailable` |
| owner/schema/route absent | `AdapterBlocked` | `Blocked` |
| side-effect call outcome ambiguous | `CallOutcomeUnknown` | `CommitOutcomeUnknown`/manual owner path |

### 6.4 Infra test cuts and stop gate

| Cut | Minimum assertion |
|---|---|
| repository append/read round trip | loaded value carries adapter-issued version and exact refs |
| optimistic conflict | stale expected version cannot overwrite newer state |
| UoW rollback/commit unknown | no visible partial outcome/audit/result after rollback; unknown blocks replay |
| fake parity | fake and durable-neutral adapter expose identical typed disposition/state |
| blocked adapter | missing authority/mapping/route remains blocked, not available |
| redaction | no backend/provider body enters `InfraError` or public result |

Infra gate: **pass pending R-7 seam audit**. Reopen if an adapter introduces a concrete provider type into `contracts`, `domain` or an application signature.

## 7. `api` implementation card

| 文件 / callable | Responsibility | Exact downstream |
|---|---|---|
| `command_handlers.rs::handle_command` | decode logical Command version, validate metadata/request, call `ToolCommandUseCases::execute`, map result/error | `CF-01~13`; `ProtocolError` |
| `query_handlers.rs::handle_query` | validate Query metadata/request, call `ToolQueryUseCases::execute`, preserve visibility/freshness | `QF-01~11`; zero writes |
| `routes.rs` | transport-neutral logical operation registration only | Step 8 logical names; no HTTP/RPC choice |
| `errors.rs::map_application_error` | exhaustive body-free mapping | `ProtocolError::from_application_error` |
| `bin/tools_api.rs` | composition/wiring entry only | runtime builder; no domain/store access |

API ordering is fixed: version -> metadata -> body-free request -> application facade -> typed response/error. Missing metadata, unsupported version, forbidden body or invalid actor stops before any repository/Port call. Query never reserves idempotency or invokes a refresh path.

API tests: one handler test per protocol family, metadata/body rejection, typed result round-trip, duplicate replay shape, query zero-write assertion, blocked/error redaction. Reopen if a handler constructs a domain object or calls a Store directly.

## 8. `worker` implementation card

| 文件 / callable | Responsibility | Exact downstream |
|---|---|---|
| `consumers.rs::dispatch` | validate envelope/source isolation and dispatch one `ToolInboundConsumerInput` | `IF-01~05` |
| `collaboration_worker.rs::continue_material` | validate committed material input and call `SafeMaterialContinuationUseCases` | `OF-01~04` |
| `projection_worker.rs::run_maintenance_slice` | invoke bounded projection maintenance facade only | projection job seam; no direct repair |
| `errors.rs::map_application_error` | map worker result to safe receipt/error surface | `ConsumerReceipt`, `ProtocolError` |
| `bin/tools_worker.rs` | dependency injection and process wiring | infra builder only |

Worker may validate source authority, version, correlation and body-free payload shape, but cannot classify external delivery/observation or acknowledge broker semantics. It never writes a subject, calls a Store, calls Sandbox/Bus/Observability directly, or retries an ambiguous side-effecting Port.

Worker tests: duplicate/out-of-order envelope, unsupported version, forbidden body, phase-1 claim race, gap-only receipt, IF-03 committed-error/transient mapping, Prepared/unknown continuation re-entry, exactly-one collaboration call. Reopen if worker input contains raw source body or an unbounded loop.

## 9. `jobs` implementation card

| 文件 / callable | Responsibility | Exact downstream |
|---|---|---|
| `runners.rs::run` | validate `JobMetadata`, dispatch one `ToolJobRequest`, return `JobReport` | `JF-01~04` |
| `runners.rs::check_binding_consistency` | bounded binding/source assessment slice | `JF-01`, CapabilityBindingStore + Hub Port if closed |
| `runners.rs::check_reference_integrity` | bounded typed-ref assessment/gap slice | `JF-02`, ProjectionStore |
| `runners.rs::rebuild_derived_views` | bounded projection rebuild at explicit watermark | `JF-03`, ProjectionStore |
| `runners.rs::refresh_external_status_refs` | bounded Bus/Observation status resolution | `JF-04`, ExternalSubmissionStore + SafeEventCollaborationPort |
| action binaries | parse job input and wire dependencies only | no scheduler/run evidence |

Job rules: one deterministic bounded slice, explicit cursor/watermark, no subject repair, no fabricated run/evidence/signoff, no automatic widening. A blocked external resolver creates a typed `Partial`/`Blocked` report and gap refs; it does not claim successful refresh.

Job tests: same key/digest replay, cursor scope mismatch, empty bounded slice, partial next cursor, blocked resolver, projection stale/rebuild conflict, no subject mutation assertion. Reopen if a Job calls a Command mutation or invents a scheduler status.

## 10. R-5 cross-module stop review

| Review item | Result | Evidence |
|---|---|---|
| Seven implementation modules have independent cards | pass | §§3~9 |
| Six business components have one truth owner and one application owner | pass | main Step 5 §§2~3 + §4 cards |
| Every public entry maps to one application facade | pass | application/API/worker/jobs matrices |
| Every domain capability has Step 6/7/8/9 downstream IDs | pass | contracts/domain/application matrices |
| Entry modules cannot own truth or external lifecycle | pass | §§7~9 forbidden surfaces |
| Error and test cuts are module-specific | pass | each card's error/test sections |
| New identity/state/Port introduced by R-5 | none | R-5 only adds module-level references |
| Formal 03 changed | no | write-closed |

## 11. R-5 gate

```text
batch = R-5_module_implementation_cards
step_status = completed
gate_status = pass
gate_reason = Seven module cards now expose unique files, capability callables, downstream Step references, error ownership, side-effect boundaries, forbidden surfaces and minimum test cuts; no owner or business object changed.
next_allowed_action = start R-6 object/carrier closure after reading Step 6 source and L1 object-granularity sample
formal_document_write_allowed = false
next_formal_document_allowed = false
commit_required = false
```
