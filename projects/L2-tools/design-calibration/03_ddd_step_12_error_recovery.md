# L2-tools 03 详细设计 Step 12: 错误模型、异常分支与恢复口径

> 创建日期: 2026-08-05
> 状态: completed / pass
> 模式: full-restart / single-agent-serial
> 正式文档: `projects/L2-tools/03-详细设计.md`（Step 19 前保持 write-closed）
> 回填章节: 正式 03 §11 错误模型、异常分支与恢复口径
> 对标粒度: `projects/L1-governance/design-calibration/03_ddd_step_12_error_recovery.md`

## 0. Step 开工确认

| 项目 | 记录 |
|---|---|
| 前序门禁 | Step 11 `completed / pass`；Store、UoW、version、projection 隔离和 commit/call unknown 已闭合。 |
| 直接输入 | Step 6 object/error carriers、Step 7 Store/Port errors、Step 8 `ProtocolError`/receipt/report、Step 9 37 flows、Step 10 state matrix、Step 11 persistence matrix。 |
| 本步模块顺序 | domain error -> application error -> repository/Port/UoW mapping -> protocol/worker/job surface -> flow exception matrix -> recovery owner。 |
| 物理后端 | 未选择；本步只定义 backend-neutral typed error contract。 |
| 外部 blocker | `L2T-UP-001~009` 继续开放；正向 provider、route、receipt、observation、SDK、readiness 不得被错误映射伪造成成功。 |
| 正式回填 | 本步只写中间产物；正式 §11 仅在 Step 19 整体装配。 |
| 提交 | 不需要，也未获授权。 |

## 1. 本步目标与边界

本步把 Step 6~11 中分散的 domain transition failure、repository/Port/UoW failure、协议拒绝、
worker receipt、Job report 和 side-effect uncertainty 收束为可以直接实现的错误合同。每个错误
必须能回答：产生层、稳定 code、是否可重试、谁拥有恢复、是否需要本地持久化，以及对外应返回哪一种
`ProtocolError`/`ConsumerReceipt`/`JobReport` surface。

本步不选择 HTTP/RPC 数字状态、队列名称、dead-letter 产品、日志后端、告警平台、重试次数或本地化
错误文案；这些细节由 transport/config/observability/implementation owner 在本合同内绑定。

## 2. SOP 问题回答

| 问题 | 收口回答 |
|---|---|
| 每个模块有哪些错误？ | `domain` 只返回纯 `DomainError`；`application` 将 domain、Store、Port、UoW 和 idempotency 错误归一为 `ApplicationError`；`api` 返回 `ProtocolError`；`worker` 返回 `ConsumerReceipt` 或安全错误；`jobs` 返回 `JobReport`/`ProtocolError`。 |
| 哪些错误映射到外部失败？ | Command 的 invalid/not-found/conflict/blocked/unavailable/integrity 分别映射到 Step 8 的 `ProtocolErrorClass`；Query 的 not-visible、missing、stale、rebuilding、unavailable、failed 保持结构化 query surface；Consumer 的 unsupported/duplicate/rejected/gap 进入 receipt；Job 的 partial/blocked/failed 进入 report。 |
| 哪些可重试？ | 只有依赖暂时不可用、明确 version conflict（重新读取后重新提交）、有界页 continuation 和同 key 的 commit rollback re-entry 可重试；不得自动重试 side-effect unknown、payload/result 缺失或 divergent duplicate。 |
| 事务失败如何处理？ | 已知失败回滚整个当前 UoW；commit unknown 只调用同 authority `resolve_commit`；未确认前不返回 committed、不补写、不重调外部 Port。 |
| 重复请求如何处理？ | 同 scope/key/digest 只读取 immutable stored result/receipt/report；同 key 异 digest 返回 conflict；in-flight 不产生第二个 mutation 或 side effect。 |
| 外部依赖失败如何处理？ | `PortResolution::Blocked/Unavailable/...` 是语义结果，保存 invocation-bound assessment/ref/gap；`PortCallError` 是 adapter failure，按 flow 映射为 unavailable/unknown；不制造 provider、Sandbox、Bus、Observation truth。 |
| 哪些异常写审计/事件？ | accepted local truth、正式 assessment/outcome/audit/material、projection/reference/handoff marker 和 stored result 按 Step 9/11 同 UoW 写入；纯 invalid/duplicate/not-visible 不写 success trace/outbox；错误 telemetry 留给 Step 15。 |

## 3. 当前材料问题诊断

| 材料 | 问题 | 当前处理 |
|---|---|---|
| Step 6 `DomainError` | 只给出非法转换/字段守卫，未定义 public code 和恢复 owner。 | 本步补 stable domain code 与 application mapping。 |
| Step 7 `RepositoryError`/`PortCallError` | 已区分 semantic resolution 与 adapter failure，但 protocol 映射分散。 | 保留 enum；集中写 mapping matrix，不新增第二套 Port error。 |
| Step 8 `ProtocolError` | class/retry hint 已固定，`ToolErrorCode` 具体分配未集中。 | 本步为每类错误绑定 code/class/hint/ref 规则。 |
| Step 9 flow annexes | 各 flow 有局部异常描述，跨 family 的 retry/receipt/report 口径需统一。 | 以 37-row matrix 和 phase exception matrix 收口。 |
| 旧 README/正式 03/05/06 | 含 RPC/HTTP、MCP、executor、SLA、旧 retry/DLQ 事实。 | `historical_material`，不作为当前错误合同。 |
| 上游 blockers | authorization/Sandbox/Bus/Observation positive schema 未闭口。 | 只设计 blocked/unavailable/unknown/error surface。 |

## 4. 设计取舍

| 议题 | 选择 | 原因 |
|---|---|---|
| domain 与 public error | domain error 不穿透；application exhaustive map | 防止 transport/backend 类型污染领域层。 |
| semantic blocked vs adapter failure | `PortResolution<T>` 与 `PortCallError` 保持二分 | blocked 是可归因业务/依赖状态，call error 是调用未形成合法结果。 |
| stored error | 仅对已提交、必须可重放的 semantic rejection 存 `StoredApplicationError` | pre-write invalid 不需要制造业务事实；sidecar 缺失不能由 current truth 重建。 |
| query failure | 结构化 surface 而非普通 error | missing/stale/rebuilding/unavailable/failed 不能混成空结果。 |
| unknown | fail closed + named recovery owner | 不把未知状态猜成成功、失败或未调用。 |
| retry | error contract 给出类别和 owner；具体次数留 Step 13/04 | 避免设计层伪造运行参数。 |

## 5. 错误层级与稳定 code

### 5.1 分层规则

```text
domain factory / transition / invariant
  -> DomainError

application orchestration / repository / external Port / UoW / idempotency
  -> ApplicationError

api / worker / job entry
  -> ProtocolError / ConsumerReceipt / JobReport
```

| 层 | 可以看到 | 禁止暴露 |
|---|---|---|
| `domain` | typed value、状态、policy input、local reason | Store、Port、UoW、transport、backend body |
| `application` | domain error、typed refs、Store/Port/UoW error | SQL、HTTP body、provider response、stack trace |
| `api` | `ApplicationError` 映射后的 safe code/class/ref | domain enum 内部、repository type、raw detail |
| `worker` | envelope metadata、safe payload、consumer result | 未支持 payload body、broker receipt/DLQ truth |
| `jobs` | typed job scope、bounded item result、report | scheduler/run/evidence/signoff truth |
| `infra` | backend/adapter exception | 直接修改 L2 truth 或制造 positive source |

### 5.2 Domain error catalog

| Stable code | Domain variant | 触发条件 | Retry | Owner / public mapping |
|---|---|---|---|---|
| `L2-DOM-001` | `InvalidStateTransition` | Step 10 矩阵外的迁移、terminal 回退、Prepared 重复终结 | `DoNotRetry` | owning Command；`InvalidState` |
| `L2-DOM-002` | `MissingRequiredValue` | reason/basis/actor/ref/target/trace set 缺失 | `DoNotRetry` | caller/application；`InvalidInput` |
| `L2-DOM-003` | `InvalidAssessmentInput` | subject/source/mode/ref 不对称 | `DoNotRetry` | source-consuming flow；`IntegrityFailure` |
| `L2-DOM-004` | `PolicyRejected` | L2 execution requirement/eligibility guard 不满足 | `DoNotRetry` unless new source | owning service；`InvalidState` or `Blocked` |
| `L2-DOM-005` | `ExternalBodyRejected` | raw provider/capture/prompt/secret/body enters typed carrier | `DoNotRetry` | boundary owner；`InvalidInput`/`IntegrityFailure` |
| `L2-DOM-006` | `ReferenceNotUsable` | ref missing/stale/conflicting/unverifiable where current path requires usable source | dependency-dependent | source owner; `Blocked`/`Unavailable` |
| `L2-DOM-007` | `InvariantViolation` | impossible local field combination or half-pair construction | `ManualOwnerAction` | integrity owner; `IntegrityFailure` |
| `L2-DOM-008` | `UnsafeMaterialRejected` | four-gate material check fails or target symmetry breaks | `DoNotRetry` | safe-handoff owner; `Blocked` |
| `L2-DOM-009` | `AttemptTransitionRejected` | local attempt transition conflicts with call fence | `ResolveConflict` or manual | handoff owner; `Conflict`/`IntegrityFailure` |

Domain variants carry typed safe summaries only. They never carry an external response body, transport
status, SQL detail, retry counter, route, run ID or acceptance claim.

### 5.3 Application error catalog

| Stable code | Application variant | Trigger | Retry class | Required refs / surface |
|---|---|---|---|---|
| `L2-APP-001` | `InvalidRequest` | metadata, DTO, page, scope, body or digest invalid | no | `InvalidInput`; no subject write |
| `L2-APP-002` | `NotFound` | requested L2 truth/ref/projection absent | no by default | `NotFound` or query `Missing` |
| `L2-APP-003` | `NotVisible` | visibility resolver denies a safe read | no | query not-visible surface; no write |
| `L2-APP-004` | `DomainRejected` | mapped `DomainError` | no unless caller changes state | `InvalidState`/`Blocked` |
| `L2-APP-005` | `VersionConflict` | adapter compare token is stale | reload then retry | `Conflict`, no current body leak |
| `L2-APP-006` | `IdempotencyConflict` | same scope/key but different digest | no under same key | `Conflict` |
| `L2-APP-007` | `DuplicateResultMissing` | completed claim points to missing/wrong stored surface | manual | `IntegrityFailure` |
| `L2-APP-008` | `DependencyUnavailable` | Store/UoW/observational Port temporarily unavailable | after recovery | `Unavailable`, `RetryAfterDependencyRecovery` |
| `L2-APP-009` | `ExternalReferenceUnresolved` | owner ref unavailable/blocked/invalid | state-dependent | `Blocked`/`Unavailable`, assessment/gap if attributable |
| `L2-APP-010` | `IntegrityFailure` | symmetry, pair, watermark, candidate/receipt or sidecar defect | manual | `IntegrityFailure`, gap if local subject exists |
| `L2-APP-011` | `UnsupportedSchema` | unknown protocol/event/job schema | upgrade handler | `InvalidInput` or worker unsupported |
| `L2-APP-012` | `CommitOutcomeUnknown` | UoW authority cannot prove commit result | manual/idempotency audit | `Unavailable`, `ManualOwnerAction` |
| `L2-APP-013` | `SideEffectOutcomeUnknown` | Sandbox/collaboration call may have crossed boundary | manual | `IntegrityFailure`/`Unavailable`, claim incomplete |
| `L2-APP-014` | `CursorInvalid` | page cursor/scope/filter/watermark mismatch | caller regenerates | `InvalidInput` |
| `L2-APP-015` | `ProjectionUnavailable` | projection/index unavailable without source mutation | after maintenance | query degraded surface or Job item failure |

`ApplicationError` may retain a typed source enum and safe reason ref, but never raw lower-layer text.
`RepositoryError::CommitOutcomeUnknown` and `UnitOfWorkError::CommitOutcomeUnknown` both map to
`L2-APP-012`; `PortCallError::SideEffectOutcomeUnknown` maps to `L2-APP-013`, not to ordinary timeout.

### 5.4 Port, Store and technical errors

| Lower-layer error | Application mapping | Retry | Recovery owner |
|---|---|---|---|
| `RepositoryError::Unavailable` | `DependencyUnavailable` | yes after dependency recovery | adapter/operator |
| `RepositoryError::SerializationConflict` | `IntegrityFailure` | no | persistence/integrity owner |
| `RepositoryError::VersionConflict` | `VersionConflict` | reload + explicit retry | owning flow |
| `RepositoryError::UniquenessConflict` | equal duplicate -> replay; divergent -> `IntegrityFailure`/`Conflict` | no blind retry | owning flow/integrity |
| `RepositoryError::CursorInvalid` | `CursorInvalid` | regenerate request | caller/job owner |
| `RepositoryError::CommitOutcomeUnknown` | `CommitOutcomeUnknown` | no blind retry | persistence authority |
| `PortResolution::Blocked` | `ExternalReferenceUnresolved` or `DomainRejected` by flow | no positive retry until owner closes | upstream owner + L2 consumer |
| `PortResolution::Unavailable` | `DependencyUnavailable` | yes after recovery | external seam owner |
| `PortResolution::Unsupported` | `UnsupportedSchema`/blocked | no until contract upgrade | upstream/schema owner |
| `PortResolution::Conflicting` | `IntegrityFailure` or conservative assessment | manual/new source | source owner |
| `PortResolution::Unverifiable` | `ExternalReferenceUnresolved` | refresh may retry | source owner |
| `PortCallError::Timeout` | `DependencyUnavailable`, except side-effect ambiguity | observational retry; side-effect only if pre-call proven | adapter/flow owner |
| `PortCallError::SideEffectOutcomeUnknown` | `SideEffectOutcomeUnknown` | no | named manual owner |
| `PortCallError::InvalidResponse` | `IntegrityFailure` | no until adapter fixed | adapter owner |
| `PortCallError::ForbiddenBody` | `InvalidRequest`/`IntegrityFailure` | no | boundary owner |
| `PortCallError::AdapterFailure` | `DependencyUnavailable` or `IntegrityFailure` by classification | bounded recovery only | adapter/operator |
| `UnitOfWorkError::BeginFailed` | `DependencyUnavailable` | yes | persistence operator |
| `UnitOfWorkError::CommitFailedKnownRolledBack` | dependency failure; safe re-entry only if flow allows | same key only | application owner |
| `UnitOfWorkError::CommitOutcomeUnknown` | `CommitOutcomeUnknown` | no blind retry | persistence authority |
| `UnitOfWorkError::RollbackFailed` | `IntegrityFailure` | manual | persistence/operator |
| `TechnicalPortError` from clock/ID | `DependencyUnavailable` or `IntegrityFailure` | only before side effect | composition owner |
| `IdempotencyStore` in-flight | `DependencyUnavailable` with `RetrySameInput` | yes later same key | operation owner |
| `IdempotencyStore` result missing | `DuplicateResultMissing` | no | persistence/integrity owner |

## 6. Public error surface

### 6.1 `ProtocolError` mapping rules

`ProtocolError::from_application_error(error, correlation_ref)` is exhaustive over the stable code
catalog. It copies only typed `subject_refs`, `gap_refs`, `blocker` and bounded safe message parameters.
The following mapping is canonical:

| Application code/class | `ProtocolErrorClass` | `RetryHint` | Value/result behavior |
|---|---|---|---|
| `InvalidRequest`, `ExternalBodyRejected`, `CursorInvalid` | `InvalidInput` | `DoNotRetry` | no value; zero mutation for pre-write rejection |
| `NotFound` | `NotFound` | `DoNotRetry` | no value; existing refs only |
| `NotVisible` | `NotVisible` | `DoNotRetry` | query surface, no identifying body |
| `DomainRejected`, invalid transition | `InvalidState` | `DoNotRetry` | no accepted value; semantic rejection may have stored error |
| `IdempotencyConflict`, `VersionConflict` | `Conflict` | `ResolveConflict` | no value; conflict refs only |
| blocked/unresolved/unsupported source | `Blocked` | `RetryAfterDependencyRecovery` or `DoNotRetry` | no positive value; blocker/gap refs |
| temporary Store/UoW/Port unavailable | `Unavailable` | `RetryAfterDependencyRecovery` | no committed value; no fabricated status |
| `IntegrityFailure`, `DuplicateResultMissing` | `IntegrityFailure` | `ManualOwnerAction` | no synthetic value; attributable gap if safe |
| `CommitOutcomeUnknown`, `SideEffectOutcomeUnknown` | `Unavailable` or `IntegrityFailure` per phase | `ManualOwnerAction` | no committed response; marker/attempt refs only |

### 6.2 Command surface

| Branch | Public result | Stored error/result | Side effect |
|---|---|---|---|
| accepted | `ToolCommandResponse::Accepted` | immutable value + refs before claim complete | truth/fact/audit/stale writes as flow defines |
| semantic no-execution / blocked | `Err(ProtocolError)` or `Unavailable` response per Step 8 | `StoredApplicationError` with committed assessment/gap/pair | no external success claim |
| deterministic invalid before reserve | `Err(ProtocolError)` | none | zero writes |
| same digest duplicate | exact `DuplicateReplay` | read stored value/error | zero mutation/Port calls |
| different digest | `Conflict` | no new record | zero mutation |
| commit unknown | safe unavailable/unknown | claim remains unresolved | no replay completion/no external call |

### 6.3 Query surface

Query never converts a repository failure into an empty success page. `Missing`, `Readable(Fresh/Stale)`,
`Rebuilding`, `Unavailable` and `Failed` are distinct `ProjectionRead`/`ProjectionPageRead` variants.
Visibility failure returns `NotVisible`, not `NotFound` unless the owner scope intentionally hides
existence. Query performs no UoW, repair, refresh or external Port call.

### 6.4 Consumer and Job surface

| Surface | Allowed dispositions | Error mapping |
|---|---|---|
| `ConsumerReceipt` | `Accepted`, `Duplicate`, `Rejected`, `Quarantined`, `GapRecorded` | unsupported version/body -> rejected/quarantined; blocked source -> gap; in-flight -> protocol retry-same-input, no fabricated receipt |
| `JobReport` | `Completed`, `Partial`, `NoOpDuplicate`, `Blocked`, `Failed` | item failures are typed refs/counts; job-level store/claim failure returns `ProtocolError` or failed report only when report can be stored |
| outbound continuation view | local attempt disposition | route blocked/local failure/unknown are local states; none means delivered/observed |

## 7. Recovery class and owner model

| Recovery class | Definition | Automatic action | Owner |
|---|---|---|---|
| `RetryAfterDependencyRecovery` | known transient Store/observational Port/adapter unavailability | same semantic key after health/dependency recovers | application/worker/job owner |
| `ReloadAndReevaluate` | optimistic version conflict | reload exact `Loaded<T>`, rerun domain guard, submit a new explicit attempt | owning Command |
| `ContinueBoundedPage` | deterministic next cursor | process next page in a new bounded UoW | maintenance Job |
| `ReplayStoredSurface` | equal duplicate with completed immutable result | read exact stored value/error/receipt/report | operation owner |
| `ResolveCommit` | local commit unknown | query same authority with same transaction ref | persistence owner |
| `ResolveCallOutcome` | side-effect call may have crossed boundary | inspect persisted attempt/owner evidence; no automatic Port call | named handoff/recovery owner |
| `ManualIntegrityRepair` | missing sidecar/payload/pair/index or divergent duplicate | repair technical storage through formal repair procedure | persistence/integrity owner |
| `UpgradeContract` | unsupported schema/provider/route | update authoritative contract/config, then new input | upstream contract owner |

No recovery class may mutate another owner's truth, infer a result from a locator, or replace an
unknown outcome with a failure solely because the caller timed out.

## 8. Flow-to-error mapping matrix

The following matrix is the implementation-level dispatch contract. `pre` means the error occurs
before the named UoW; `uow` means all staged writes roll back; `post` means the local truth was already
committed and only the named peripheral marker/report may be updated.

### 8.1 Command flows `CF-01`~`CF-13`

| Flow | Detection point | Application mapping | Retry / owner | Write and audit rule |
|---|---|---|---|---|
| `CF-01 EstablishToolContract` | metadata/body, authority resolution, identity/revision uniqueness | `InvalidRequest`, `ExternalReferenceUnresolved`, `Conflict`, `IntegrityFailure` | invalid no; blocked only after authority closes; owner contract service | pre errors zero-write; accepted contract/definition/fact/result atomic |
| `CF-02 AssessToolDefinitionChange` | current bundle, candidate source, protected scope, impact construction | `NotFound`, `InvalidRequest`, `Blocked`, `IntegrityFailure` | source dependency may retry; candidate conflict no | candidate definition + impact + stored result atomic; current contract untouched |
| `CF-03 AdoptToolDefinitionRevision` | current/candidate/impact mismatch, closure report stale, CAS, stale propagation | `NotFound`, `InvalidStateTransition`, `VersionConflict`, `ProjectionUnavailable`, `IntegrityFailure` | reload/re-evaluate for version; report/projection owner for unavailable | old/current definitions, pointer, fact, bounded stale/gap and replay all rollback together |
| `CF-04 RetireToolContract` | lifecycle transition or exact closure report | `InvalidStateTransition`, `NotFound`, `ExternalReferenceUnresolved`, `VersionConflict` | explicit new command after closure; no resurrection | lifecycle/fact/stale/gap/replay atomic; no delete |
| `CF-05 DeclareCapabilityBinding` | contract/mode symmetry, Hub resolution, source mismatch | `NotFound`, `InvalidRequest`, `Blocked`, `Unavailable`, `IntegrityFailure` | Hub owner/dependency retry; no local positive inference | accepted relation/snapshot/assessment/change fact/replay atomic; blocked branch records safe assessment/gap only when attributable |
| `CF-06 ReplaceCapabilityBinding` | current relation CAS, successor identity, Hub result | `NotFound`, `InvalidStateTransition`, `VersionConflict`, `Blocked`, `IntegrityFailure` | reload/re-evaluate; Hub recovery | old relation, new relation, fact, stale/gap/replay atomic; no partial replacement |
| `CF-07 InvalidateCapabilityBinding` | relation missing/terminal, CAS, reason | `NotFound`, `InvalidStateTransition`, `VersionConflict`, `IntegrityFailure` | explicit reload for version; invalid input no | relation + invalidation fact + stale/gap/replay atomic |
| `CF-08 SubmitToolInvocation` | contract/definition/binding/admission guard, safe argument validation, pair insert | `NotFound`, `InvalidStateTransition`, `InvalidRequest`, `Blocked`, `Unavailable`, `IntegrityFailure` | source/dependency retry only before accepted call; no second invocation | invocation/admission and semantic no-execution outcome/audit/error pair atomic |
| `CF-09 EvaluateExecutionPreconditions` | requirement, authorization or Sandbox readiness resolution | `InvalidRequest`, `Blocked`, `Unavailable`, `ExternalReferenceUnresolved`, `IntegrityFailure` | external recovery may retry same key; fail closed while blocked | requirement/assessments/readiness and accepted deny/no-execution pair/result atomic |
| `CF-10 PrepareExecutionHandoff` | selected refs, handoff guard, phase-1 commit, Sandbox Port response | `InvalidStateTransition`, `Conflict`, `Blocked`, `Unavailable`, `SideEffectOutcomeUnknown`, `IntegrityFailure` | pre-call known failure may retry; unknown/manual only | Prepared marker/claim commits before Port; phase-2 local disposition/gap/result separate; no host fallback |
| `CF-11 AcceptExecutionSource` | source mapper, identity/revision/correlation, outcome/audit pair | `InvalidRequest`, `Blocked`, `Unavailable`, `IntegrityFailure`, `Conflict` | observational dependency may retry; terminal conflict/manual | assessment/gap and indivisible outcome/audit/result atomic; no guessed outcome |
| `CF-12 PrepareSafeExternalHandoff` | source selector, four-gate material check, material append | `NotFound`, `InvalidRequest`, `Blocked`, `Unavailable`, `IntegrityFailure` | source dependency may retry; safety failure no | eligibility and error/result atomic; eligible material commits before OF continuation; no Port call here |
| `CF-13 RecordConsistencyGapResolution` | gap state, evidence/ref symmetry, owner re-read, CAS | `NotFound`, `InvalidStateTransition`, `Blocked`, `Unavailable`, `VersionConflict`, `IntegrityFailure` | owner dependency may retry; CAS reload; unverifiable stays pending | pending/resolved decision and replay atomic; never repairs the referenced subject |

### 8.2 Query flows `QF-01`~`QF-11`

| Flow | Detection point | Public surface | Retry / owner | Write rule |
|---|---|---|---|---|
| `QF-01 GetToolContract` | owner scope, bundle missing/mismatch, visibility | `NotFound`, not-visible surface, `Unavailable`, `IntegrityFailure` | caller may retry unavailable | zero UoW/store write/external call |
| `QF-02 CompareToolDefinitionRevisions` | pair absent, reversed/mismatched impact, watermark conflict | missing/empty diff, stale/degraded, unavailable/failed | query caller/Projection Job | never build or repair in Query |
| `QF-03 GetCapabilityBinding` | relation/snapshot/assessment mismatch or visibility | not-visible/missing/stale/blocked surface | source refresh is separate Job | zero write; no Hub lookup |
| `QF-04 GetToolInvocation` | invocation/admission/outcome link mismatch | missing/not-visible/degraded outcome surface | no replay mutation | zero write; half pair is integrity surface |
| `QF-05 GetExecutionPreconditionView` | requirement/assessment/readiness refs missing | blocked/unavailable/stale precondition view | owner/refresh Job | no authorization/Sandbox call or repair |
| `QF-06 GetOutcomeAudit` | pair missing/half pair/status conflict | missing, readable, degraded/unknown external refs | caller may retry read dependency | no outcome/audit reconstruction |
| `QF-07 GetReferenceConsistencyReport` | selector/index/report unavailable | missing/rebuilding/unavailable/failed/stale report surface | Projection Job/operator | no report build in Query |
| `QF-08 SearchToolContracts` | cursor/filter/watermark invalid or projection unavailable | invalid cursor error; empty vs stale/rebuilding/unavailable/failed page | caller regenerates cursor; Job rebuilds | no live truth fallback or write |
| `QF-09 CompareToolContracts` | exact pair or projection missing | structured diff/degraded surface | retry only read dependency | no direct definition adoption |
| `QF-10 GetToolDiagnostic` | subject projection missing/stale/failed | diagnostic surface with freshness/gaps | Job/operator | no health/readiness inference or repair |
| `QF-11 GetToolConsumerGuidance` | revision selector/index mismatch | missing/stale/blocked/unavailable guidance | Projection Job / contract owner | no current-definition fallback that changes selector semantics |

### 8.3 Inbound Consumers `IF-01`~`IF-05`

| Flow | Failure point | Receipt/error | Retry / owner | Phase-2 writes |
|---|---|---|---|---|
| `IF-01 ConsumeHubCapabilityChangeClue` | envelope/version/body, Hub clue resolution, bounded reverse page | rejected/quarantined for envelope; `GapRecorded` for attributable blocked clue; protocol unavailable for in-flight | Hub/dependency recovery; claim owner | snapshot/assessment/gap + receipt + claim completion atomically; no Binding mutation |
| `IF-02 ConsumeAuthorizationResultChangeClue` | envelope/source symmetry, authorization resolver | rejected or `GapRecorded`; no positive authorization state | authorization owner; fail closed | assessment/ref/gap + receipt; no earlier assessment rewrite |
| `IF-03 ConsumeSandboxExecutionSource` | envelope then formal `CF-11` re-entry | exact Command result refs become receipt; transient Command failure leaves claim incomplete | Sandbox/source owner; same source key only | CF-11 commits first; separate Consumer UoW stores receipt/claim; no direct outcome write |
| `IF-04 ConsumeBusDeliveryStatusFeedback` | feedback resolver, attempt/status symmetry | accepted/gap/rejected; blocked source is gap | Bus owner; no delivery inference | append independent Bus status ref + receipt; attempt unchanged |
| `IF-05 ConsumeObservationStatusFeedback` | feedback resolver, observation/attempt symmetry | accepted/gap/rejected | Observation owner | append independent Observation ref + receipt; no audit/outcome rewrite |

### 8.4 Outbound continuations `OF-01`~`OF-04`

| Flow | Failure point | Local result | Retry / owner | Port rule |
|---|---|---|---|---|
| `OF-01 ToolContractChanged` | material/event symmetry, prepared commit, collaboration response | `LocallyRejected`, `RouteBlocked`, `SubmissionOutcomeUnknown`, or `SubmittedLocally` | route blocked/dependency retry only when not ambiguous; unknown manual | one call after committed Prepared; phase-2 save/gap/result; no delivery claim |
| `OF-02 CapabilityBindingChanged` | formal-change vs gap branch, target mismatch, call result | same local attempt states | collaboration owner | binding relation is never changed by continuation |
| `OF-03 ToolOutcomeAuditMaterialAvailable` | pair/material ref mismatch, call result | same local attempt states | collaboration owner; unknown manual | outcome/audit remain immutable; status refs separate |
| `OF-04 ToolConsistencyGapChanged` | gap/material selector mismatch, call result | same local attempt states | integrity/route owner | gap source remains local; no external resolution inference |

### 8.5 Jobs `JF-01`~`JF-04`

| Flow | Item error | Run-level surface | Retry / owner |
|---|---|---|---|
| `JF-01 RefreshHubControlledSnapshots` | resolver blocked/unavailable, source mismatch, reverse-page conflict | `Partial`, `Blocked` or `Failed` report | bounded page retry; Hub owner for persistent blocker |
| `JF-02 ReconcileReferenceConsistency` | missing assessment/ref, report assembly/store failure | `Partial` for findings; `Failed` for run dependency failure | report replay; manual for index corruption |
| `JF-03 RebuildDerivedProjections` | target missing, source missing, stale write, mapper failure | `Partial`/`Failed`; never success with fabricated view | projection owner; stale page continuation |
| `JF-04 RefreshExternalStatusReferences` | Bus/Observation blocked, status conflict, attempt missing | `Partial`/`Blocked` report with typed status/gap refs | external owner/dependency retry; no attempt mutation |

## 9. Exception branch matrix

| Scenario | Detection location | Local action | Audit/event/marker | Retry class |
|---|---|---|---|---|
| invalid metadata/body before idempotency lookup | entry validator | return `ProtocolError(InvalidInput)` | none | no |
| same idempotency key + equal digest + committed result | `IdempotencyStore::get` | rollback provisional UoW if opened; load exact stored surface | none | replay only |
| same key + different digest | idempotency classifier | return conflict; do not reserve or mutate | optional redacted log only | no |
| same key in-flight | claim lookup | return retry-same-input/unavailable; no second claim | no success trace | later same key |
| domain transition rejection inside UoW | domain method | rollback all staged rows | no success trace/outbox | no |
| expected-version conflict | mutable Store save | rollback; return conflict without current body | no success event | reload/re-evaluate |
| append equal vs divergent | append Store | equal may reuse ref; divergent rollback and integrity error | gap only if attributable in same UoW | no blind retry |
| UoW begin failure | transaction manager | no writes/claim | no | dependency retry |
| UoW commit known rollback | commit manager | no visible local state; same-key re-entry only where flow permits | no | explicit safe re-entry |
| UoW commit unknown | commit manager | `resolve_commit` same authority; leave claim unresolved if still unknown | unknown marker/gap only if already attributable | manual |
| stored result/receipt/report write fails | result Store | rollback local atomic family; never complete claim | no partial accepted result | dependency retry after diagnosis |
| required stale-marker write fails in truth Command | ProjectionStore | rollback source mutation if stale mark is part of atomic set | no source truth committed | explicit retry |
| projection Job write fails after source commit | ProjectionStore maintenance UoW | source remains; mark projection failed/gap | projection marker/report | bounded retry |
| external semantic resolution blocked | Port returns `Blocked` | persist assessment/ref/gap if flow owns it; fail closed | assessment/gap/receipt as named | owner closes blocker |
| external adapter timeout before side effect | PortCallError `Timeout` | dependency unavailable; no attempt terminal success | no external-success marker | retry after recovery |
| side-effect response ambiguous | PortCallError `SideEffectOutcomeUnknown` | persist unknown attempt; claim incomplete | unknown gap/attempt marker | manual only |
| forbidden body/invalid response | Port boundary | reject/quarantine; no raw body | redacted issue ref only | no |
| Query projection missing/stale | Query resolver | return structural surface | none | Job refresh |
| Consumer unsupported version | worker gate | do not parse; rejected/quarantined receipt | optional technical dead-letter by owner | upgrade contract |
| Consumer phase-2 failure | Consumer UoW | leave claim recoverable; no broker acknowledgement | no fabricated receipt | same source key |
| Job item failure | bounded item handler | commit other valid items only if job policy allows; count typed failure | JobReport | retry failed subset |
| Job report save failure | Idempotency/Job store | do not mark Job complete; preserve claim/incomplete state | no fake report | manual/dependency retry |

## 10. Audit, trace, outbox and marker rules

| Branch | L2 truth/history | Projection/reference | Outbound/material | Stored surface |
|---|---|---|---|---|
| accepted contract/binding/invocation change | write required fact/assessment/audit in same UoW | bounded stale/gap in same UoW when flow requires | material only when CF-12 | command value/result |
| semantic no-execution or blocked admission | outcome/audit pair plus safe assessment/gap | no unrelated projection repair | no external success event | stored error if committed |
| deterministic invalid pre-write | none | none | none | no result required |
| duplicate replay | none | none | no Port call | read exact stored value/error/receipt/report |
| Consumer accepted source | source snapshot/assessment/gap as owner flow defines | bounded stale/gap | no outbound event unless explicit material exists | receipt + claim completion |
| Consumer rejected/unsupported | none | no projection mutation | no payload parse/publish | receipt only if protocol defines it |
| prepared side effect | local Prepared attempt/claim | none beyond local gap | Port call only after commit | incomplete claim until disposition |
| side-effect local result | attempt disposition + status/gap | no core truth rewrite | no inferred delivery/observation | stored continuation/command result |
| projection/reference Job | no T1/T2 truth mutation | write own state/report | no implicit event | JobReport |
| reconciliation finding | no repair | report/gap only | none | report + JobReport |

Accepted truth rollback rule: if a required audit/history/outbox snapshot/stale marker/result or
idempotency write fails before commit, the entire accepted family rolls back. A later repair may only
be introduced as an explicitly named Job/Command in a future Step; the error path cannot silently
commit core truth and promise to backfill.

## 11. Delayed, rejected, quarantined and dead-letter semantics

| Surface/state | Exact meaning | Allowed writes | Retry rule |
|---|---|---|---|
| `Rejected` | input/body/state is deterministically invalid at the current boundary | redacted protocol error; committed stored error only when a local semantic subject must be replayable | no same-input retry |
| `Quarantined` | inbound event cannot be safely interpreted or conflicts with source identity | typed gap/receipt if attribution is safe; never parsed payload body | owner inspection/contract upgrade |
| `GapRecorded` | a known local subject has an attributable blocked/unverifiable dependency | assessment/ref/gap/receipt in one Consumer UoW | retry after owner/dependency recovery |
| `Unavailable` | no valid semantic result because a dependency is temporarily unavailable | no positive truth; optional local attempt/gap per flow | same key after recovery |
| `Delayed` (internal worker/job disposition only) | work is accepted by the local owner but cannot finish in this invocation | claim remains incomplete or report carries typed failed/deferred refs | bounded retry by Step 13 policy |
| `DeadLettered` (external publication marker only) | one outbound publication failed terminally for its transport/contract | update publication/attempt marker; preserve source truth and payload snapshot | manual/config repair; never delete source event |
| `SubmissionOutcomeUnknown` / `CallOutcomeUnknown` | side-effect call may have crossed adapter boundary without attributable result | persist unknown attempt/gap; claim incomplete | no automatic second Port call |

`Delayed` is not a new public Consumer disposition in the current Step 8 contract. An in-flight claim
returns a typed retry-same-input error, while Job reports may express `Partial`/`Failed` with a cursor
or gap. `DeadLettered` is not a Contract, Binding, Invocation, Outcome or Audit state.

## 12. Consistency defect catalog

These conditions are not normal business rejections. They require integrity visibility and a named
manual/repair owner; the system must not conceal them by reconstructing from current truth.

| Defect | Detection | Required response | Forbidden response |
|---|---|---|---|
| completed idempotency record points to missing result | duplicate replay | `DuplicateResultMissing`, open attributable gap if possible | rerun Command/Job or rebuild from current truth |
| stored result kind/digest/ref mismatch | replay mapper | `IntegrityFailure`, claim unresolved | cast to another result variant |
| outcome without audit or audit without outcome | pair read | serialization/integrity failure | expose half pair or synthesize missing side |
| outbox/material payload snapshot missing | continuation/publisher | failed/dead-letter marker + manual repair | rebuild payload from current Contract/Binding |
| projection dependency index lacks known target | stale propagation/rebuild | failed item/gap; rebuild index through Job | concatenate a guessed view ID |
| reference assessment lacks owner/authority/source basis | query/job | blocked/unverifiable assessment; manual review | infer validity from locator string |
| handoff marker lacks required trace refs | marker factory/save | reject marker/job item | save marker without provenance |
| prepared attempt has no phase-2 disposition after authority resolution | recovery scan | manual unknown disposition | assume call did not happen and resubmit |
| commit candidate/receipt mismatch | UoW commit mapper | `IntegrityFailure`, no public committed result | treat candidate as receipt/evidence |
| forbidden body persisted in any L2 surface | adapter/audit check | quarantine/repair and fail closed | redact after persistence and continue |
| external status conflicts by authority/revision | feedback append | preserve attributable refs + gap | choose latest arrival and mutate attempt |
| projection says fresh but source watermark is older | query/rebuild | stale/failed surface and repair index | report current readiness |

## 13. Error anti-patterns

| Anti-pattern | Why invalid | Required implementation |
|---|---|---|
| return generic `Err("failed")` | loses stable mapping and owner | exhaustive `ApplicationError` -> `ProtocolError`/receipt/report |
| expose `RepositoryError` or HTTP/backend text | leaks implementation and unsafe body | map to typed safe code/ref only |
| map `PortResolution::Blocked` to success with empty value | turns missing contract into positive readiness | `Blocked`/gap/fail closed |
| map side-effect timeout to `LocallyFailed` without proof | call may have happened | `SideEffectOutcomeUnknown` when ambiguity exists |
| retry unknown with a new idempotency key | duplicates external side effect | resolve same claim/marker manually |
| treat query missing as empty successful page | hides unavailable projection | structural `Missing` vs `Unavailable`/`Failed` |
| acknowledge Consumer before phase-2 commit | loses source message or fabricates completion | ack only after durable receipt/claim completion by owner |
| complete idempotency before result save | replay points to nothing | result/receipt/report first, claim completion second |
| rebuild historical result from current truth | later mutation changes original response | immutable stored surface is sole replay authority |
| let reconciliation repair data | hidden write authority | report finding; separate formal repair flow |
| store raw body in error/gap/report | violates owner boundary | typed digest/ref/safe summary only |
| use dead-letter as business state | confuses transport with L2 truth | update external publication marker only |

## 14. 前序契约回填

| Formal target | Required conclusion | Calibration source |
|---|---|---|
| `03-详细设计.md` §5 domain modules | domain returns only pure typed `DomainError`; no Store/Port/transport errors | §§5.1~5.2 |
| §5 application module | application is the exhaustive error mapping and recovery-owner boundary | §§5.3~5.4, §7 |
| §7 protocol contracts | `ProtocolError` code/class/hint/ref symmetry; Consumer and Job surfaces use closed dispositions | §6 |
| §8 function flows | every flow's pre/uow/post errors, replay, blocked and unknown branches | §8~§10 |
| §9 state/side-effect | unknown and prepared states never infer external success/failure | §§7, 9, 11 |
| §10 persistence | rollback, commit-resolution, stored sidecar and projection isolation rules | Step 11 + §§9~§12 |
| §11 error/recovery | this Step's type, mapping, exception, recovery, dead-letter and defect tables | §§5~§13 |
| §15 test cuts | each stable code and branch gets deterministic fake/durable parity cut | §§8~§13 |

## 15. Cross-step closure audit

| Audit item | Result | Evidence |
|---|---|---|
| Step 6 domain invalid transitions/guards map to stable application codes | pass | §5.2~§5.3 |
| Step 7 Store/UoW/Port/idempotency errors preserve semantic vs adapter distinction | pass | §5.4 |
| Step 8 `ProtocolErrorClass`/`RetryHint` and public carrier symmetry are consumed | pass | §6 |
| All 13 Commands have exact error owner and atomicity rule | pass | §8.1, §9 |
| All 11 Queries retain zero-write and structural degraded surfaces | pass | §8.2, §6.3 |
| All 5 Consumers have claim/receipt/error mapping | pass | §8.3, §9 |
| All 4 outbound continuations fence unknown calls | pass | §8.4, §11 |
| All 4 Jobs distinguish item failure, partial and run failure | pass | §8.5, §11 |
| Step 11 commit/sidecar/projection defects have recovery owner | pass | §§9~§12 |
| L2T-UP-001~009 remain blocked and no external truth was invented | pass | §§3, 5.4, 8 |
| No new error enum conflicts with Step 6/7/8 authority | pass | existing canonical names retained |

## 16. 待确认事项与进入下一步条件

| Item | Owner | Impact | Before implementation |
|---|---|---|---|
| exact transport code mapping and localized safe messages | API/SDK owner | adapter presentation only | bind to `ToolErrorCode`, never expose lower-layer detail |
| retry limits/backoff and dead-letter mechanism | Step 13/04/transport owner | runtime policy | preserve no-retry/manual branches |
| positive authorization/Sandbox/Bus/Observation contracts | `L2T-UP-001~006` | positive status and readiness | retain blocked/unavailable/unknown mappings |
| Core tools-specific schema and SDK client | `L2T-UP-008~009` | cross-repo compatibility | no duplicate authority |
| persistence repair procedure for missing sidecars | implementation/integrity owner | operational recovery | repair-only path; no business rerun |

Entry condition for Step 13 is satisfied: every current L2 error can be classified, mapped, replayed
or assigned to a recovery owner; retry/dead-letter semantics remain policy-neutral where not yet
authorized; no new blocker was found.

## 17. Stop review and completion record

| Check | Result |
|---|---|
| domain/application/port/technical error catalogs | pass |
| ProtocolError, Query, Consumer and Job mappings | pass |
| 37 flow exception and recovery matrix | pass |
| rollback/commit-unknown/side-effect-unknown rules | pass |
| delayed/rejected/quarantined/dead-letter distinction | pass |
| consistency defect catalog and anti-patterns | pass |
| historical material / blocker audit | pass; `L2T-UP-001~009` remain open |
| formal document write | closed until Step 19 |

```text
step_status = completed / pass
current_module = error_recovery:typed_taxonomy_and_flow_mapping
next_allowed_action = create 03_ddd_step_13_concurrency_idempotency.md
formal_document_write_allowed = false
commit_required = false
```
