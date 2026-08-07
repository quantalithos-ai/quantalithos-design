# L2-tools 03 详细设计 Step 7: 逐模块定义 Trait / Port / Adapter 契约

> 创建日期: 2026-08-05
> 状态: completed / pass; R-7 exact seam recalibration applied
> 当前模式: full-restart / single-agent-serial
> 文档级 flow: `design-calibration/03_ddd_calibration_flow.md`
> 正式文档目标: `projects/L2-tools/03-详细设计.md`
> 回填章节: 正式 03 §5、§6
> 当前写入许可: 只允许本 Step 中间产物；正式 03 仍禁止写入。

---

## 0. Step 开工确认

| 项目 | 记录 |
|---|---|
| 前序门禁 | Step 6 主文件、八份模块/工程附录均为 `completed / pass`;41 objects 与 stable carriers 已闭口。 |
| 直接输入 | Step 5 模块主轴；Step 6 主文件及附录；正式 01 数据/依赖结论；正式 02 §7 / §8 / §9 / §12。 |
| 标准输入 | 详细设计 SOP Step 7；详细设计书写规范 §5.5 / §5.6；真相源标准 callable/read/write closure。 |
| 固定规模 | 7 named external ports；6 truth/attempt store groups + `ProjectionStore`；application technical ports 另列。 |
| blocked seam | `L2T-UP-001~009` 只允许 blocked-aware resolution、negative adapter 与 deterministic fake，不允许 positive readiness 声明。 |
| Step 6 reopen | 未触发。没有新增 identity-bearing object、业务状态主语或 owner；本步新增的 helper 均为 technical carrier。 |

## 1. Step 7 写入批次状态表

| 批次 | 模块 / 接缝 | 写入状态 | 内容完整度 | 停审状态 | 后续批次 |
|---:|---|---|---|---|---|
| 0 | skeleton、inventory、async / loaded / page / error helper | done | complete | pass | 1 |
| 1 | `contracts` / `domain` no-I/O boundary | done | complete | pass | 2 |
| 2 | application foundation / UoW / clock / ID / visibility / idempotency | done | complete | pass | 3 |
| 3 | 6 truth/attempt store groups + `ProjectionStore` | done | complete | pass | 4 |
| 4 | 7 named external ports | done | complete | pass | 5 |
| 5 | infra adapter / durable-fake parity / composition boundary | done | complete | pass | 6 |
| 6 | api / worker / jobs entry callable boundary | done | complete | pass | 7 |
| 7 | module stop reviews + cross-seam audit + Step 8 handoff | done | complete | pass | gate |
| R-7 | exact method caller/implementer, Consumer append, continuation fence, adapter/entry parity recalibration | done | complete | pass | R-8 |

## 2. SOP 问题回答

### 2.1 哪些模块定义、实现和调用 trait / port

| Module | Defines | Implements | Calls | Forbidden shortcut |
|---|---|---|---|---|
| `contracts` | Public carrier behavior only; no I/O trait | none | none | Transport/framework/client trait |
| `domain` | Pure policy/helper traits only when state-free; current design needs none | none | none | Repository, clock, external resolver or async |
| `application` | All repository, UoW, technical, external and inbound use-case traits | Application service facades and `InvocationCallerPort` | All named stores / ports | Concrete backend/client/config parsing |
| `infra` | Adapter structs and mapping helpers, not business traits | Application-owned repository / external / technical traits | Backend/provider abstractions supplied at composition | Second business semantics or hidden commit/retry |
| `api` | Handler facade only | DTO-to-use-case entry | Command / Query use cases | Direct store/domain/external Port access |
| `worker` | Consumer/continuation runner only | Envelope dispatch entry | Consumer and continuation use cases | Direct subject write, broker truth or retry ownership |
| `jobs` | One-shot runner only | Job dispatch entry | Job use cases | Scheduler/run truth or subject repair |

### 2.2 哪些 Step 6 能力需要接缝

| Object / carrier capability | Required seam | Why it is not a domain method only |
|---|---|---|
| Contract/definition/history load and expected-version save | `ToolContractStore` + UoW | Stable reads, append-only history and atomic current switch require I/O. |
| Binding relation/snapshot/assessment/change | `CapabilityBindingStore`;`HubControlledSourcePort` | Relation is local truth; Hub snapshot is external consumption. |
| Invocation/admission/outcome link | `ToolInvocationStore`;`InvocationCallerPort` | Runtime/direct caller enters one canonical surface; local truth is persisted. |
| Requirement/auth/readiness/handoff/attempt | `ExecutionHandoffStore`;authorization/Sandbox ports | External owner results and local attempts must remain separate. |
| Source/outcome/audit | `OutcomeAuditStore`;`ExecutionSourceIntakePort` | Mapping is blocked-aware; outcome and audit require one local atomic pair. |
| Safe material/submission/feedback | `ExternalSubmissionStore`;`SafeEventCollaborationPort` | Local attempt is persisted; delivery/observation stays external. |
| Assessment/gap/report/projection | `ProjectionStore`;shared/source ports | Derived data needs watermark/read/write surfaces but cannot repair source truth. |
| Duplicate replay | `IdempotencyStore` | Key/digest/result is technical sidecar truth, not a domain aggregate. |
| Query visibility | `ReadVisibilityResolverPort` | Actor/consumer/local-owner scope must be resolved before view construction. |

### 2.3 Read and write closure

- Every versioned load returns `Loaded<T>` with an adapter-issued `ExpectedVersion`; application never reads an entity field or guesses create version as the compare token.
- Every list/scan returns `RepositoryPage<T>` with an opaque cursor and `LocalTruthWatermark`; Query and Job construction never scans adapter-private storage.
- A Query that combines multiple truth records into one value reads them through one named bundle carrying a single `LocalTruthWatermark`; it cannot fabricate a watermark from independent `Loaded<T>` values.
- Inbound clue fan-out uses only named local reverse-reference pages with a canonical filter digest and configured bound. One Consumer invocation processes one page and records an explicit continuation gap instead of scanning unbounded local or external inventories.
- Every write receives the same `&dyn ToolsUnitOfWork` and an explicit expected version for mutation. Adapter methods never start, commit, rollback or retry their own transaction.
- Immutable fact append methods accept a uniqueness key or rely on a named unique semantic key; duplicate equality and conflict remain distinguishable.
- Query reads do not accept a write UoW and cannot call external refresh ports. A stable read may return explicit stale/unavailable/gap material.
- Projection writes compare source watermarks and return `ProjectionWriteResult`; they never update T1/T2 source truth.

### 2.4 Blocked external closure

External calls return `PortResolution<T>` for expected blocked/unavailable states and reserve `PortCallError` for malformed responses or adapter failures. This prevents `Blocked` from being mislabeled as a provider error or a positive value. Fakes can emit every resolution deterministically but cannot establish integration readiness.

## 3. Module execution order and annex index

| Order | Module / seam | Annex | Stop-review focus |
|---:|---|---|---|
| 1 | contracts + domain | `03_ddd_step_07_module_contracts_domain_annex.md` | Public carriers remain I/O-free; domain stays synchronous/pure. |
| 2 | application foundation | `03_ddd_step_07_module_application_foundation_annex.md` | UoW, clock, ID, visibility and idempotency exact contract. |
| 3 | persistence groups | `03_ddd_step_07_module_application_stores_annex.md` | Full read surfaces, version source, atomic writes and page/watermark. |
| 4 | external seams | `03_ddd_step_07_module_application_external_ports_annex.md` | Caller/implementer/request/result/error/blocker for all 7 ports. |
| 5 | infra | `03_ddd_step_07_module_infra_adapters_annex.md` | Mapping, no hidden semantics, durable/fake parity and builder. |
| 6 | api/worker/jobs | `03_ddd_step_07_module_entry_boundaries_annex.md` | All public entries call application only and own no truth. |
| R-7 | exact seam closure | `03_ddd_step_07_trait_port_adapter_recalibration_annex.md` | Per-method caller/implementer/request/result/error/UoW/page/fake parity and unique authority. |

## 4. Shared trait helper contracts

### 4.1 Object-safe asynchronous call surface

The planned application crate uses the standard library only for the trait-level async abstraction. This avoids selecting an async runtime or an `async-trait` macro while keeping composition through `dyn Trait` possible.

```rust
/// Sendable boxed future returned by an object-safe I/O boundary.
pub type PortFuture<'a, T> =
    core::pin::Pin<Box<dyn core::future::Future<Output = T> + Send + 'a>>;
```

Rules:

- Every I/O trait is `Send + Sync` and every returned future is `Send`.
- Methods borrow `self` and inputs for the future lifetime only; public DTO results are owned.
- Domain constructors, guards, state transitions and mappers remain synchronous.
- No trait exposes a framework request, database transaction, broker message, SDK client or runtime handle.
- Step 14 may bind an executor/runtime product, but cannot change these semantic signatures without reopening Step 7.

### 4.2 Loaded, page and write-result helpers

```rust
/// A persisted value paired with the only valid optimistic-write token.
pub struct Loaded<T> {
    pub value: T,
    pub expected_version: ExpectedVersion,
}

/// A stable repository page produced at one local truth watermark.
pub struct RepositoryPage<T> {
    pub items: Vec<T>,
    pub next_cursor: Option<RepositoryCursor>,
    pub source_watermark: LocalTruthWatermark,
}

/// Result of inserting an immutable fact under its semantic uniqueness key.
pub enum AppendResult<R> {
    /// The fact was inserted and this stable reference identifies it.
    Appended(R),
    /// An equal fact already exists and its stable reference is returned.
    ExistingEqual(R),
    /// The uniqueness key exists with different canonical content.
    Conflict(AppendConflict),
}

/// Read surface for one persisted derived value without triggering a rebuild.
pub enum ProjectionRead<T> {
    /// No derived value or build marker exists for the scoped lookup.
    Missing,
    /// A safe value is readable and explicitly fresh or stale.
    Readable {
        value: T,
        source_watermark: LocalTruthWatermark,
        freshness: ReadableFreshness,
        gap_refs: ConsistencyGapRefSet,
    },
    /// The requested derived value is being rebuilt and no value is exposed.
    Rebuilding {
        source_watermark: Option<LocalTruthWatermark>,
        gap_refs: ConsistencyGapRefSet,
    },
    /// The derived persistence authority cannot provide a readable value.
    Unavailable {
        source_watermark: Option<LocalTruthWatermark>,
        gap_refs: ConsistencyGapRefSet,
    },
    /// The latest derivation failed and no value is exposed.
    Failed {
        source_watermark: Option<LocalTruthWatermark>,
        gap_refs: ConsistencyGapRefSet,
    },
}

/// Page read surface that distinguishes a visible empty page from an unavailable projection.
pub enum ProjectionPageRead<T> {
    /// A fresh or stale page is readable; its item list may be empty.
    Readable {
        page: RepositoryPage<T>,
        freshness: ReadableFreshness,
        gap_refs: ConsistencyGapRefSet,
    },
    /// The requested page scope is rebuilding and exposes no items.
    Rebuilding {
        source_watermark: Option<LocalTruthWatermark>,
        gap_refs: ConsistencyGapRefSet,
    },
    /// The page projection is unavailable and exposes no items.
    Unavailable {
        source_watermark: Option<LocalTruthWatermark>,
        gap_refs: ConsistencyGapRefSet,
    },
    /// Page derivation failed and exposes no items.
    Failed {
        source_watermark: Option<LocalTruthWatermark>,
        gap_refs: ConsistencyGapRefSet,
    },
}

/// Freshness classes for a derived value that is safe to return.
pub enum ReadableFreshness {
    /// The value covers its declared local truth watermark.
    Fresh,
    /// Newer local truth exists, but the protocol explicitly permits this safe stale value.
    Stale,
}

/// Selects one exact watermark or the latest completed projection index entry.
pub enum ProjectionWatermarkSelector {
    /// Read material for this exact local truth watermark.
    Exact(LocalTruthWatermark),
    /// Resolve the latest completed local projection entry without a live truth fallback.
    LatestCompleted,
}

/// Selects one exact revision or the revision captured by a persisted guidance index.
pub enum GuidanceRevisionSelector {
    /// Read guidance built for this exact formal definition revision.
    Exact(DefinitionRevision),
    /// Resolve the revision marked current by the persisted completed guidance index.
    BuiltCurrent,
}
```

`Loaded<T>::expected_version` is adapter-issued from the same persistence authority used for compare-and-swap. `RepositoryCursor` is opaque to application; every scope supplies a canonical filter digest so a cursor cannot be reused under another scope. `AppendResult::ExistingEqual` is idempotent only after canonical equality validation. `ProjectionRead::Readable` and `ProjectionPageRead::Readable` permit only `ReadableFreshness::Fresh/Stale`; rebuilding, unavailable and failed variants structurally carry no value/items. `Missing` is distinct from dependency unavailability. `ProjectionWatermarkSelector::LatestCompleted` and `GuidanceRevisionSelector::BuiltCurrent` resolve only already-persisted completed index entries; neither reads current T1/T2 truth nor starts a build.

### 4.3 Common error and external resolution helpers

```rust
/// Stable application-facing repository failures.
pub enum RepositoryError {
    Unavailable(DependencyFailureSummary),
    SerializationConflict(SerializationConflictSummary),
    VersionConflict(VersionConflictSummary),
    UniquenessConflict(UniquenessConflictSummary),
    CursorInvalid(CursorFailureSummary),
    CommitOutcomeUnknown(CommitReference),
}

/// Expected semantic availability of one external Port call.
pub enum PortResolution<T> {
    Available(T),
    Blocked(PortBlocker),
    Unavailable(DependencyFailureSummary),
    Unsupported(UnsupportedContractSummary),
    Conflicting(ExternalConflictSummary),
    Unverifiable(UnverifiableSourceSummary),
}

/// Adapter failure before a valid semantic resolution can be produced.
pub enum PortCallError {
    Timeout(DependencyFailureSummary),
    SideEffectOutcomeUnknown(SideEffectUncertaintySummary),
    InvalidResponse(ExternalContractViolation),
    ForbiddenBody(ForbiddenBodySummary),
    AdapterFailure(DependencyFailureSummary),
}
```

All variants require English Rustdoc in implementation. `Timeout` is permitted only when the adapter can prove the side-effecting operation was not started, or for observational calls. Once a side-effecting call may have crossed the adapter boundary without a valid semantic result, the adapter must return `SideEffectOutcomeUnknown`; application persists uncertainty, leaves the durable claim incomplete and never blind-retries. Safe summaries contain stable codes and typed refs only; raw backend/provider bodies are forbidden. Exact recovery ownership is closed in Step 12/13.

## 5. Trait inventory

### 5.1 Application technical and persistence traits

| Trait | Category | Defines | Implementer | Core purpose |
|---|---|---|---|---|
| `ToolsUnitOfWork` | local transaction marker | application | infra | Stable transaction ref and repository participation. |
| `ToolsUnitOfWorkManager` | local transaction control | application | infra | Begin/commit/rollback/commit-resolution. |
| `ClockPort` | technical | application | infra/fake | Authoritative application boundary time. |
| `IdGeneratorPort` | technical | application | infra/fake | Typed system-generated IDs only. |
| `ReadVisibilityResolverPort` | read gate | application | infra/fake | Actor/consumer/local owner-scope decision; no policy truth. |
| `IdempotencyStore` | technical persistence | application | infra/fake | Atomic reserve, stored result/receipt/report and replay. |
| `ToolContractStore` | truth store 1 | application | infra/fake | Contract, definition, impact and evolution. |
| `CapabilityBindingStore` | truth store 2 | application | infra/fake | Relation, snapshot, assessment and change fact. |
| `ToolInvocationStore` | truth store 3 | application | infra/fake | Invocation and immutable admission. |
| `ExecutionHandoffStore` | truth/attempt store 4 | application | infra/fake | Requirement, auth assessment, readiness, handoff and attempt. |
| `OutcomeAuditStore` | truth store 5 | application | infra/fake | Source assessment plus atomic outcome/audit pair. |
| `ExternalSubmissionStore` | attempt/ref store 6 | application | infra/fake | Eligibility, material, local attempt and feedback refs. |
| `ProjectionStore` | D1 store 7 | application | infra/fake | Ref assessments, gaps, reports and rebuildable projections. |

The fixed `6 + ProjectionStore` count is preserved. `infra/reference_store.rs` is an implementation file for the assessment/gap methods of `ProjectionStore`; it does not define an eighth application trait.

### 5.2 Seven named external ports

| Port | Direction | Caller | Implementer / adapter | Current positive status |
|---|---|---|---|---|
| `SharedContractAuthorityPort` | outbound compile-authority resolution | contract/integrity services | infra Core authority adapter/fake | Tools-specific schema blocked (`L2T-UP-008`) |
| `HubControlledSourcePort` | outbound runtime source consumption | binding services/jobs | infra Hub source adapter/fake | logical seam; exact source contract conditional |
| `InvocationCallerPort` | inbound canonical runtime/direct caller | Runtime/direct caller/api adapter | application invocation facade | logical L2 server contract; SDK client excluded |
| `AuthorizationConsumptionPort` | outbound invocation-bound result consumption | precondition service | infra blocked/formal adapter/fake | blocked (`L2T-UP-001~002`) |
| `SandboxExecutionPort` | outbound readiness + execution handoff | handoff service | infra blocked/formal adapter/fake | mapping/receipt blocked (`L2T-UP-003~004`) |
| `ExecutionSourceIntakePort` | inbound source-safe mapping boundary | consumer/outcome service | infra blocked/formal source adapter/fake | positive mapping blocked (`L2T-UP-003~004`) |
| `SafeEventCollaborationPort` | outbound safe material + optional feedback resolution | safe-handoff/feedback services | infra blocked Bus/Obs adapter/fake | routes/feedback blocked (`L2T-UP-004~006`) |

## 6. Application service callable boundary index

| Facade | Exact methods | Consumer | Implementation owner |
|---|---:|---|---|
| `ToolCommandUseCases` | 13 | api / `InvocationCallerPort` / formal consumer re-entry | application services |
| `ToolQueryUseCases` | 11 | api / future direct consumers | application services |
| `ToolConsumerUseCases` | 5 | worker | application consumer service |
| `ToolJobUseCases` | 4 | jobs | application job service |
| `SafeMaterialContinuationUseCases` | 4 event classes through one typed continuation method | worker | application safe-handoff service |

Step 8 fixes every DTO field and public mapping. This Step fixes that each method accepts exactly one owned request plus its matching metadata carrier and returns one owned typed result/receipt/report or `ApplicationError`; entries cannot bypass these facades.

## 7. Module stop reviews

| Module / group | Object ability carried | Caller / implementer | Read closure | Write/version/UoW closure | Boundary | Result |
|---|---|---|---|---|---|---|
| contracts/domain | Validators, mappers, pure constructors/guards | contracts/domain -> application | no I/O needed | no I/O allowed | sealed body-free policy | pass |
| application foundation | transaction/time/ID/visibility/idempotency | services -> infra/fake | paired replay reads | adapter-issued versions; same UoW | no policy/backend truth | pass |
| seven store groups | 41 objects and stable carriers | services -> infra/fake | all DTO/state/scan surfaces | exact create/save/append and semantic keys | 6 + Projection fixed | pass |
| seven external ports | compile/runtime/event consumption | services/entries -> named adapter/fake | typed resolutions | external calls outside local UoW | blocker-aware/body-free | pass |
| infra | mapping/storage/composition | implements application traits | parity | no hidden tx/retry | no second semantics | pass |
| api/worker/jobs | entry conversion/lifecycle | external caller -> application facade | public carrier only | no direct write | no truth owner | pass |

## 8. Cross-module seam closure audit

| Audit item | Result | Closure |
|---|---|---|
| Duplicate ports / owner drift | pass | Each trait is application-owned; seven named external ports remain exactly seven. |
| Reverse dependency | pass | Domain/contracts never depend on application/infra; entries receive facade only. |
| Missing Query read surface | pass after Step 9 controlled correction | Owner-scope, common-watermark truth bundles and explicit D1 read/page surfaces are named. |
| Missing expected-version source | pass | `Loaded<T>` from create/load is sole compare token. |
| Partial atomic facts | pass | Outcome/audit pair structurally indivisible; all families share UoW. |
| Public page helper | pass | Internal repository page and public Page mapping both have cursor/watermark/freshness contracts. |
| Idempotency replay | pass | Stored result/receipt/report paired reads prevent rerun reconstruction. |
| Blocked external seam | pass | Positive auth/Sandbox/route/source/Core schemas remain conditional; blocked adapters explicit. |
| Durable/fake parity | pass | Same signatures, versions, UoW, unique keys, pages and failures. |
| Entry ownership | pass | API/worker/jobs cannot directly access stores/ports/domain. |
| Step 6 reopen watchpoint | pass | No identity/state/history business subject added. |
| Historical pollution | pass | No old registry/policy/executor/MCP/builtin/RPC/HTTP/DB/cache/bus assumptions restored. |

## 9. Step 8 / 9 / 10 / 11 handoff

| Downstream Step | Exact input from Step 7 |
|---|---|
| Step 8 | `13/11/5/4/4` facade boundary, shared metadata/page/error/result/receipt/report carriers and seven external Port request/result families. |
| Step 9 | Every repository/external/UoW/idempotency call allowed in a flow; no flow may invent another method. |
| Step 10 | Mutable `Loaded<T>` subjects, immutable append facts and exact trigger surfaces. |
| Step 11 | Seven logical store traits, semantic unique keys, compare tokens, UoW participation, pages/watermarks and atomic pair constraints. |

## 10. Completion conclusion

Step 7 closes all cross-layer, persistence and external seams needed by the fixed object/protocol inventory. No unresolved local trait/read/write conflict remains. Open upstream contracts remain typed blockers and do not prevent Step 8 from defining L2-owned protocol schema and negative behavior.

Step 8 pre-entry construction audit added `JobReport.output_refs` and completed the existing `IdGeneratorPort` method set for already-defined local IDs. This is a controlled technical-carrier/readability correction: trait/store/external-port counts, business objects, owners and state semantics are unchanged.

Step 8 outbound exact-source audit then bound `SafeEventSubmissionRequest` to the closed four-event semantic envelope and added event ID/name/schema to the existing `ExternalSubmissionAttempt`. This closes durable submission identity without adding a Port, business object, lifecycle state or physical route.

Step 9 pre-entry callable audit changed `ToolContractStore::get_definition` to return `Loaded<FormalToolDefinition>` and added `save_definition`, closing optimistic persistence for the already-defined candidate/current/superseded/withdrawn transitions. No inventory or ownership changed.

Step 9 transaction-callable audit added `ToolsUnitOfWork::commit_candidate()`. This closes construction of replayable results and committed idempotency records inside the same UoW while requiring `commit` / `resolve_commit` to confirm the exact stamp before response or replay. No business object, public protocol, store, Port, state family or backend product was added.

Step 9 replay-constructability audit added the closed `StoredCommandValue` payload to `StoredCommandResult`. Durable and fake adapters persist the same typed snapshot and reject operation/value/ref mismatches; neither reconstructs a historical value from current truth. This is an application-carrier correction, not a new store or domain truth.

Step 9 stale-propagation audit added the missing `RepositoryPageRequest` parameter to `ProjectionStore::mark_affected_stale` and fixed Command behavior to one bounded page plus an explicit continuation gap. This makes the previously stated pagination contract callable without adding a projection kind or store.

Step 9 Binding-flow audit changed `HubControlledSourceRequest` from an impossible pre-resolved `HubCapabilityRef` input to the existing candidate fields and added `successor_binding_id` to the existing replacement fact/event branch. The Port still returns formal authority material, and replacement remains one old/new atomic operation; no new owner, relation type, Port or protocol entry was added.

Step 9 result-constructability audit named the pure Step 8 `map_*_view` functions and their closed input carriers. They perform no I/O and add no trait; they only make the already-defined public views directly callable from loaded objects and adapter-issued versions.

Step 9 final Command DTO/replay audit made protected-consumer emptiness explicit, added the missing current Binding-assessment read, carried source event/version identity into source intake, and stored a closed safe error snapshot beside its ref. These corrections prevent empty-scope inference, scan-based latest selection, fabricated envelope metadata and non-exact error replay without adding a Command, business truth group or external Port.

Step 9 admission/authorization audit made insufficient-but-well-formed context reachable by the existing admission decision and added the already-defined result selector to the authorization request. This removes an unreachable admission branch and a DTO-to-Port construction hole without moving authorization truth into L2.

Step 9 adoption audit added the protocol-required optional `ConsumerMigrationClosureRef` to `ToolContract::adopt_revision` and fixed its validation against the existing consistency-report read surface. This closes conditional adoption without treating a locator as migration evidence or adding an external Port.

Step 9 Query audit added one common-watermark definition-comparison bundle, exact fields for the existing contract/invocation/precondition read bundles, and explicit `ProjectionRead` / `ProjectionPageRead` surfaces with persisted watermark/revision selectors. These technical carriers make every T1/T2/D1 Query result constructible without hidden refresh, live-current fallback or fabricated freshness; store groups, write surfaces, business objects, external Ports and owners remain unchanged.

Step 9 side-effect sequencing audit allowed an idempotency claim to persist only across the named durable phases of `CF-10` and `CF-12`, expanded conservative Sandbox-readiness factories, and removed `Loaded<T>` from a pure mapper input. Side-effecting Ports now run only after a durable prepared marker and never auto-retry an ambiguous call.

Step 9 lifecycle/read-model audit added already-promised retirement and Binding lifecycle fields and changed `ExecutionHandoffAttempt` persistence from impossible append-only transition to versioned create/save fencing. These are existing state meanings and public-view sources; no external execution lifecycle was introduced.

Step 9 negative-admission/recovery audit allowed the immutable invocation anchor to record conservative/missing Binding context, added direct reads for both local attempt types, enforced one current submission attempt per semantic event, and allowed a pending gap to re-enter read-only owner verification with the same evidence. These close required no-execution and crash-recovery paths without adding a new truth owner.

Step 9 event-source coverage audit generalized the existing safe-handoff eligibility/store key and the existing Prepare Command from outcome-only IDs to a closed typed source union covering all four Step 8 event classes. This removes three unreachable event flows while preserving one Command, truth-first source loading and target-specific four-gate evaluation.

Step 9 live-binding audit renamed the contract-owned field to `initial_binding_mode` in the exact object/public view. `CapabilityBinding.mode` remains the current relation classification and is the only mode used by new invocation anchors; the initial declaration is checked when the first relation is created but is not rewritten by replacement.

Step 9 immutable-source audit added direct by-ref reads for evolution/Binding facts and eligibility material, and made `ExecutionSourceAssessment.source_ref` optional for genuinely missing/unverifiable source candidates. Accepted source still requires a formal ref; conservative branches no longer fabricate one.

Step 9 side-effect uncertainty audit added `PortCallError::SideEffectOutcomeUnknown` and matching local attempt states. This distinguishes a proven pre-call failure from an ambiguous Sandbox/collaboration submission and forbids both false no-execution and blind retry.

R-7 exact seam recalibration then expanded every foundation/Store/external/entry callable to the
`L1-governance` review grain. It fixed the six `ConsumerAppendOperation` variants to one Store
method and one `LocalResultRef` each, fixed the complete two-phase outbound continuation fence and
the exact `ExternalSubmissionAttempt::prepare` input surface, and made blocked production adapter
and durable/fake parity method-specific. It also resolved the only local ref-name drift:
`HubSnapshotRef` is the current Step 6/7 authority; the older `HubControlledSnapshotRef` wording is
superseded. No Store/Port/business object/state/owner was added.

```text
step_status = completed
current_batch = R-7_exact_seam_closure_completed
gate_status = pass
gate_reason = every current foundation/store/external/entry seam has an exact caller, implementer, request/result authority, UoW/version/page rule, error/recovery owner and durable/fake parity; continuation and Consumer append wiring are callable and unique
next_allowed_action = read Step 8 protocol main/annexes and L1-governance Step 8, then create R-8 protocol closure addendum
formal_document_write_allowed = false
next_formal_document_allowed = false
commit_required = false
```
