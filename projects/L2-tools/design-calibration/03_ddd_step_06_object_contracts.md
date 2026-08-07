# L2-tools 03 详细设计 Step 6: 逐模块定义对象实现契约

> 创建日期: 2026-08-05
> 状态: completed / pass
> 当前模式: full-restart / single-agent-serial
> 文档级 flow: `design-calibration/03_ddd_calibration_flow.md`
> 正式文档目标: `projects/L2-tools/03-详细设计.md`
> 回填章节: 正式 03 §5、§6
> 当前写入许可: 只允许本 Step 中间产物；正式 03 仍禁止写入。

---

## 0. Step 开工确认与执行骨架

| 项目 | 记录 |
|---|---|
| 前序门禁 | Step 5 `completed / pass`;`next_allowed_action=create_step_06_object_contracts`。 |
| 直接输入 | 正式 02 §5~§6、§8~§9、§12；`03_ddd_step_05_module_contracts.md`。 |
| 强制顺序 | shared vocabulary -> `contracts` carriers -> 六 domain groups -> application carriers -> infra / entry carriers -> cross-module audit。 |
| 对象池 | 41 个对象，严格保持正式 02 的 `6/6/5/6/10/8` 分组。 |
| 非对象主线 | 不新增业务 identity、registry、policy、executor、provider、run、delivery、observation 或 SDK client 主语。 |
| 外部 blocker | `L2T-UP-001~009` 仍只允许 blocked-aware ref / assessment / negative carrier。 |

## 1. Step 6 写入批次状态表

| 批次 | 覆盖范围 | 写入状态 | 内容完整度 | 停审状态 | 后续批次 |
|---:|---|---|---|---|---|
| 0 | shared vocabulary / typed ref / public marker | done | complete | pass | 1 |
| 1 | `contracts` public carriers and stable summaries | done | complete | pass | 2 |
| 2 | 工具合同与演进 6 objects | done | complete | pass | 3 |
| 3 | Capability Binding 与受控来源 6 objects | done | complete | pass | 4 |
| 4 | 规范调用与受理 5 objects | done | complete | pass | 5 |
| 5 | 执行前置与条件交接 6 objects | done | complete | pass | 6 |
| 6 | Outcome / audit / safe handoff 10 objects | done | complete | pass | 7 |
| 7 | 引用完整性与受控派生 8 objects | done | complete | pass | 8 |
| 8 | application / infra / entry stable carriers | done | complete | pass | cross-module audit |
| 9 | 字段来源、状态闭环、Step 7 handoff | done | complete | pass | gate |

## 2. 模块执行顺序表

| 顺序 | 模块 / 对象组 | 输入来源 | 完成后停审点 |
|---:|---|---|---|
| 0 | `contracts` shared carriers | Core generic candidates + 02 public skeleton | No raw body; every carrier has source and visibility semantics. |
| 1 | `domain::contract` | 02 §6.2 | Identity, revision, impact and evolution owner closed. |
| 2 | `domain::binding` | 02 §6.3 | Relation vs external snapshot / assessment split closed. |
| 3 | `domain::invocation` | 02 §6.4 | Canonical anchor and admission before execution closed. |
| 4 | `domain::{precondition,handoff}` | 02 §6.5 | Requirement, blocked authorization, readiness and local attempt split closed. |
| 5 | `domain::{outcome,safe_handoff}` | 02 §6.6 | One terminal outcome, audit-first and external refs split closed. |
| 6 | `domain::integrity` | 02 §6.7 | Gap, report, projection freshness and Core authority split closed. |
| 7 | application carriers | Step 5 owner table | Stored result, idempotency, visibility, job report and entry disposition closed. |
| 8 | infra / entry carriers | Step 4 file tree + Step 5 owner table | Adapter state cannot become domain truth; entries have no write authority. |

## 3. Shared vocabulary / typed refs / public markers

The following types are canonical names used by all later Steps. They are L2-owned unless explicitly marked Core candidate. A ref locates an external fact; it never proves that fact is valid without an assessment.

```rust
/// Stable identifier for an L2-owned tool contract.
pub struct ToolId(pub String);

/// Immutable revision number of a formal tool definition.
pub struct DefinitionRevision(pub u64);

/// Identifier for one canonical invocation.
pub struct ToolInvocationId(pub String);

/// Correlates caller, invocation, handoff, source and outcome without carrying body data.
pub struct CorrelationRef(pub String);

/// Identifies a source event or operation input for deduplication.
pub struct SourceEventId(pub String);

/// Identifies an idempotent operation within its channel and actor scope.
pub struct IdempotencyKey(pub String);

/// Monotonic local version used by expected-version writes.
pub struct ExpectedVersion(pub u64);

/// Body-free source locator owned by another authority.
pub struct ExternalLocatorSummary { pub authority: String, pub locator: String, pub revision: String }
```

Shared marker enums are closed and documented in the implementation source:

| Marker | Variants | Owner / use |
|---|---|---|
| `BindingMode` | `Bound`, `ExplicitUnbound` | Tool contract classification; never authorization. |
| `ConsumptionVisibility` | `Visible`, `NotFound`, `Forbidden`, `Unavailable`, `Stale` | Query surface only. |
| `FreshnessState` | `Fresh`, `Stale`, `Rebuilding`, `Unavailable`, `Failed` | Derived projection / report only. |
| `AssessmentState` | `Accepted`, `Constrained`, `Missing`, `Stale`, `Conflicting`, `Unverifiable`, `Blocked` | Per-consumption assessment, never global lifecycle. |
| `SafeMaterialClass` | `ContractChange`, `BindingChange`, `OutcomeAudit`, `ConsistencyGap` | Event candidate classification. |
| `EntryDisposition` | `Accepted`, `Rejected`, `Awaiting`, `Unavailable`, `DuplicateReplay`, `Conflict` | Application / entry carrier; does not own subject truth. |

Common field source rules:

| Field family | Source | Rule |
|---|---|---|
| identity / revision | L2 owning Command and prior immutable fact | Never derive from name, inventory or adapter. |
| actor / trace / correlation | Command / Consumer / Job metadata | Store refs and safe summaries only. |
| external authority / revision | Typed external Port result | Missing or conflicting source yields blocked assessment. |
| time | Application-owned `ClockPort` at consumption boundary | No wall-clock call inside domain constructor. |
| expected version | Repository read + caller request | Conflict is typed; no last-write-wins. |
| body-free summary | Formal source adapter or local normalized outcome | Redaction is construction guard, not post-hoc promise. |

## 4. `contracts` object and carrier closure

`contracts` does not duplicate the 41 domain objects. It closes stable public secondary types required to construct, return, page, replay, reject and observe those objects. Exact protocol schemas are repeated and expanded in Step 8; this Step fixes their carrier ownership and invariants.

| Carrier | Required fields | Construction source | Stable behavior |
|---|---|---|---|
| `CommandMetadata` | actor, request_id, trace_ref, idempotency_key, submitted_at | Command boundary | Missing actor / key rejects write. |
| `QueryMetadata` | actor, request_id, trace_ref, consumer_scope, read_at | Query boundary | No write or refresh. |
| `EventEnvelope` | source_event_id, source_authority, contract_version, correlation_ref, emitted_at, safe payload marker | Inbound event adapter | Unsupported version / body rejects or opens gap. |
| `JobMetadata` | system_actor, job_key, requested_at, source_watermark | Job entry | `job_key` is not a fabricated run_id. |
| `Page<T>` | items, next_cursor, source_watermark, freshness | Query repository / projection store | Empty and stale are explicit. |
| `ProtocolError` | stable_code, class, safe_message, retry_hint, correlation_ref | Application error mapping | Backend / raw body never leaks. |
| `StoredCommandResult` | operation, idempotency scope/key, request digest, disposition, closed typed value, result/error refs, committed version/time | Domain-to-public mapper + repository-returned refs + UoW commit candidate, confirmed by matching receipt | Duplicate same digest replays the exact immutable typed snapshot even after later subject mutation; conflict or unconfirmed stamp is explicit. |
| `JobReport` | job (`ToolJobName`), source_watermark, disposition, counts, typed output_refs, gap_refs, next_cursor | Job service | No real execution evidence implied; superseded `job_kind` / `ToolJobKind` wording is not a second carrier. |

### 4.1 `CommandMetadata`

```rust
/// Metadata required for every truth-changing command.
pub struct CommandMetadata {
    /// Authenticated or trusted actor reference; anonymous writes are invalid.
    pub actor_ref: ActorRef,
    /// Caller-generated request identity used for traceability.
    pub request_id: String,
    /// Correlation reference shared by all facts in this command.
    pub correlation_ref: CorrelationRef,
    /// Channel-scoped idempotency key.
    pub idempotency_key: IdempotencyKey,
    /// Application clock timestamp at command admission.
    pub submitted_at: String,
}
```

| Function | Signature | Contract |
|---|---|---|
| Validate | `fn validate(&self) -> Result<(), MetadataError>` | Rejects empty actor, request, correlation or key. |
| Digest input | `fn canonical_frame(&self) -> MetadataFrame` | Returns body-free stable metadata frame; excludes transport headers. |

### 4.2 `QueryMetadata`, `EventEnvelope`, `JobMetadata`, `Page<T>`, `ProtocolError`

Each is a public struct with the fields listed above, a `validate()` constructor guard, and no mutating method. `EventEnvelope` additionally exposes `dedup_key()` and `supports_version(ContractVersion)`. `Page<T>` has `empty(watermark, freshness)` and `map_items()` pure functions. `ProtocolError` has `from_application_error()` and redacted `safe_message()`; it never includes raw backend detail.

## 5. Domain object contracts

The following cards are the exact Step 6 domain contract. Every object is independently owned by its file from Step 4. Field types are L2 type names; fields marked `Ref`, `Summary`, `Assessment` and `Snapshot` are body-free carriers.

### 5.1 工具合同与演进 (6 objects)

#### `ToolContract`

```rust
/// Owns one stable tool identity and points to exactly one current definition.
pub struct ToolContract {
    pub tool_id: ToolId,
    pub current_definition_revision: DefinitionRevision,
    pub lifecycle_state: ToolContractLifecycleState,
    pub initial_binding_mode: BindingMode,
    pub established_at: DecisionTime,
    pub retirement_reason: Option<ContractRetirementReason>,
    pub retired_at: Option<DecisionTime>,
    pub version: ExpectedVersion,
}
```

| 字段 | 类型 | 来源 / 约束 |
|---|---|---|
| `tool_id` | `ToolId` | Establish command; immutable and unique. |
| `current_definition_revision` | `DefinitionRevision` | Formal definition accepted in same UoW. |
| `lifecycle_state` | `ToolContractLifecycleState` | Owning contract command only. |
| `initial_binding_mode` | `BindingMode` | Explicit establishment classification; not inferred from Hub and not a live Binding pointer. |
| `established_at` | `DecisionTime` | Application clock. |
| `retirement_reason` | `Option<ContractRetirementReason>` | Request-retirement Command; present only in pending/retired states. |
| `retired_at` | `Option<DecisionTime>` | Completion clock; present only in retired state. |
| `version` | `ExpectedVersion` | Repository optimistic concurrency. |

| Functions | Signature / result | Invariant |
|---|---|---|
| establish | `fn establish(tool_id: ToolId, definition_revision: DefinitionRevision, binding_mode: BindingMode, at: DecisionTime) -> Result<Self, DomainError>` | Creates active contract with one current revision. |
| accept new invocation | `fn accepts_new_invocation(&self) -> bool` | Only `Active` returns true. |
| adopt revision | `fn adopt_revision(&mut self, definition: &FormalToolDefinition, impact: &ToolCompatibilityImpact, closure: Option<&ConsumerMigrationClosureRef>) -> Result<(), DomainError>` | Exact pair; compatible forbids closure, conditional requires a report-verified matching closure, incompatible/unverifiable reject. |
| request retirement | `fn request_retirement(&mut self, reason: RetirementReason) -> Result<(), DomainError>` | Active -> pending only. |
| complete retirement | `fn complete_retirement(&mut self, closure: ImpactClosureRef, at: DecisionTime) -> Result<(), DomainError>` | Pending -> retired with completion time only after application verifies the matching current consistency report; no resurrection. |

```rust
/// Lifecycle of a stable tool contract.
pub enum ToolContractLifecycleState {
    /// The contract accepts new invocation admission.
    Active,
    /// Retirement was formally requested but is not complete.
    RetirementPending,
    /// The contract rejects new invocations while preserving history.
    Retired,
}
```

#### `FormalToolDefinition`

```rust
/// Immutable semantic definition for one tool revision.
pub struct FormalToolDefinition {
    pub definition_id: FormalToolDefinitionId,
    pub tool_id: ToolId,
    pub revision: DefinitionRevision,
    pub invocation_semantics: InvocationSemanticsSummary,
    pub outcome_semantics: OutcomeSemanticsSummary,
    pub execution_requirement_basis: ExecutionRequirementBasis,
    pub source_ref: DefinitionSourceRef,
    pub revision_state: DefinitionRevisionState,
}
```

| 字段 | 类型 | 来源 / 约束 |
|---|---|---|
| `definition_id` | `FormalToolDefinitionId` | Formalization command; unique per revision. |
| `tool_id` / `revision` | `ToolId` / `DefinitionRevision` | Owning contract; immutable pair. |
| `invocation_semantics` | `InvocationSemanticsSummary` | L2 semantic intent; no raw transport body. |
| `outcome_semantics` | `OutcomeSemanticsSummary` | Normalized result / error classes. |
| `execution_requirement_basis` | `ExecutionRequirementBasis` | L2 requirement only; no authorization decision. |
| `source_ref` | `DefinitionSourceRef` | Formal source locator and revision. |
| `revision_state` | `DefinitionRevisionState` | Adopt / supersede / withdraw command. |

| Functions | Signature / result | Invariant |
|---|---|---|
| formalize | `fn formalize(tool_id: ToolId, revision: DefinitionRevision, intent: FormalDefinitionIntent, source: DefinitionSourceRef) -> Result<Self, DomainError>` | All required semantic fields supplied. |
| supports intent | `fn supports_invocation(&self, intent: &CanonicalInvocationIntent) -> bool` | Does not consult external provider. |
| requirement flags | `fn requires_authorization(&self) -> bool`; `fn requires_sandbox(&self) -> bool` | Derived only from stored requirement basis. |
| supersede | `fn supersede(&mut self, replacement: DefinitionRevision) -> Result<(), DomainError>` | Current -> superseded; replacement is new fact. |

#### `ToolCompatibilityImpact`

```rust
/// Records whether a candidate definition can replace a baseline revision.
pub struct ToolCompatibilityImpact {
    pub tool_id: ToolId,
    pub base_revision: DefinitionRevision,
    pub candidate_revision: DefinitionRevision,
    pub impact_class: CompatibilityImpactClass,
    pub affected_consumption_refs: Vec<ConsumerReferenceSummary>,
    pub assessed_at: AssessmentTime,
}
```

| Capability | Functions | Rules |
|---|---|---|
| Compare revisions | `assess(base: &FormalToolDefinition, candidate: &FormalToolDefinition, refs: Vec<ConsumerReferenceSummary>) -> Self` | Pure assessment; no current write. |
| Adoption guard | `blocks_adoption(&self) -> bool`; `requires_re_evaluation(&self) -> bool` | Incompatible / unverifiable blocks. |
| Coverage | `covers(&self, reference: &ConsumerReferenceSummary) -> bool` | No text diff treated as proof. |

```rust
/// Compatibility conclusion for a candidate definition.
pub enum CompatibilityImpactClass {
    /// Existing consumption semantics remain compatible.
    Compatible,
    /// Adoption requires an explicit constrained migration or re-evaluation.
    ConditionallyCompatible,
    /// Candidate breaks a protected consumption contract.
    Incompatible,
    /// Required source or consumer impact cannot be verified.
    Unverifiable,
}
```

#### `ToolContractView`

```rust
/// Body-free stable read model for a tool contract and its current definition.
pub struct ToolContractView {
    pub tool_id: ToolId,
    pub current_revision: DefinitionRevision,
    pub lifecycle: ToolContractLifecycleSummary,
    pub definition_summary: FormalDefinitionSafeSummary,
    pub binding_summary: BindingModeSafeSummary,
    pub evolution_head: Option<EvolutionFactRef>,
    pub visibility: ConsumptionVisibility,
}
```

| Functions | Signature / result | Rule |
|---|---|---|
| project | `fn project(contract: &ToolContract, definition: &FormalToolDefinition, evolution: Option<EvolutionFactRef>) -> Self` | Read-only projection. |
| consumable | `fn is_consumable(&self) -> bool` | Retired / unavailable never reports consumable. |
| revision match | `fn matches_revision(&self, revision: DefinitionRevision) -> bool` | Exact revision comparison. |

#### `DefinitionSourceRef`

```rust
/// Locates the formal source of a definition without copying source content.
pub struct DefinitionSourceRef {
    pub source_ref_id: DefinitionSourceRefId,
    pub authority_ref: ContractAuthorityRef,
    pub source_locator: ExternalLocatorSummary,
    pub source_revision: ExternalRevisionRef,
    pub resolution_state: ExternalReferenceState,
    pub consumed_at: ConsumptionTime,
}
```

| Functions | Contract |
|---|---|
| `from_authority(authority_ref, locator, revision, consumed_at) -> Result<Self, DomainError>` | Requires non-empty authority and locator; body-free. |
| `supports_formalization(&self) -> bool` | True only when resolution is `Resolved`. |
| `mark_stale(&mut self, change: SourceChangeRef) -> ()` | Creates new assessment input; does not rewrite consumed time. |

#### `ToolContractEvolutionFact`

```rust
/// Append-only record of a formally accepted contract lifecycle or revision change.
pub struct ToolContractEvolutionFact {
    pub evolution_fact_id: EvolutionFactId,
    pub tool_id: ToolId,
    pub change_kind: ContractEvolutionKind,
    pub previous_revision: Option<DefinitionRevision>,
    pub current_revision: Option<DefinitionRevision>,
    pub actor_ref: ActorRef,
    pub reason: ChangeReason,
    pub correlation_ref: CorrelationRef,
    pub recorded_at: DecisionTime,
}
```

`record(...)` is the only factory. It requires the owning Command's actor, reason and correlation; it is append-only, never generated by Query / Job / external clue, and never stores source body.

### 5.2 Capability Binding 与受控来源 (6 objects)

#### `CapabilityBinding`

```rust
/// Owns the body-free relation between a local tool and a Hub capability reference.
pub struct CapabilityBinding {
    pub binding_id: CapabilityBindingId,
    pub tool_id: ToolId,
    pub mode: BindingMode,
    pub capability_ref: Option<HubCapabilityRef>,
    pub lifecycle_state: BindingLifecycleState,
    pub replacement_binding_id: Option<CapabilityBindingId>,
    pub invalidation_reason: Option<BindingInvalidationReason>,
    pub version: ExpectedVersion,
}
```

`declare`, `replace`, `invalidate` enforce `ExplicitUnbound` iff `capability_ref` is `None` by explicit command choice, not null inference. `replacement_binding_id` is required only in `Replaced`; `invalidation_reason` is required only in `Invalidated`. A bound relation cannot be replaced without expected version and append-only change fact.

#### `CapabilityBindingAssessment`

```rust
/// Evaluates whether a binding is usable at one consumption time.
pub struct CapabilityBindingAssessment {
    pub assessment_id: BindingAssessmentId,
    pub binding_id: CapabilityBindingId,
    pub snapshot_ref: Option<HubSnapshotRef>,
    pub assessment_state: AssessmentState,
    pub basis_refs: Vec<BindingBasisRef>,
    pub consumed_at: ConsumptionTime,
}
```

`assess(...)` checks subject, authority, revision and freshness; it never mutates `CapabilityBinding` and never maps to authorization.

#### `HubControlledSnapshot`

```rust
/// Body-free point-in-time summary consumed from the Hub owner.
pub struct HubControlledSnapshot {
    pub snapshot_id: HubSnapshotId,
    pub authority_ref: HubAuthorityRef,
    pub capability_ref: HubCapabilityRef,
    pub source_revision: ExternalRevisionRef,
    pub safe_summary: HubCapabilitySafeSummary,
    pub observed_at: ConsumptionTime,
    pub resolution_state: ExternalReferenceState,
}
```

Only `from_port(...)` and `mark_stale(...)` are allowed. The snapshot cannot create or replace a binding.

#### `CapabilityBindingView`

```rust
/// Stable read model for a binding, selected assessment and known gaps.
pub struct CapabilityBindingView {
    pub binding_id: CapabilityBindingId,
    pub tool_id: ToolId,
    pub mode: BindingMode,
    pub selected_assessment: Option<BindingAssessmentSummary>,
    pub source_summary: Option<HubCapabilitySafeSummary>,
    pub gap_refs: Vec<ConsistencyGapRef>,
    pub visibility: ConsumptionVisibility,
}
```

`project(...)` is pure; missing assessment remains explicit and does not become `ExplicitUnbound`.

#### `HubCapabilityRef`

```rust
/// Typed locator for a Hub capability; it does not contain registry content.
pub struct HubCapabilityRef {
    pub authority_ref: HubAuthorityRef,
    pub capability_id: String,
    pub capability_revision: ExternalRevisionRef,
    pub locator: ExternalLocatorSummary,
}
```

`resolve(...)` validates authority / identity / revision; string name matching is never resolution.

#### `CapabilityBindingChangeFact`

```rust
/// Append-only formal change fact for a binding relation.
pub struct CapabilityBindingChangeFact {
    pub change_fact_id: BindingChangeFactId,
    pub binding_id: CapabilityBindingId,
    pub successor_binding_id: Option<CapabilityBindingId>,
    pub change_kind: BindingChangeKind,
    pub previous_ref: Option<HubCapabilityRefSummary>,
    pub current_ref: Option<HubCapabilityRefSummary>,
    pub actor_ref: ActorRef,
    pub reason: ChangeReason,
    pub correlation_ref: CorrelationRef,
    pub recorded_at: DecisionTime,
}
```

`record(...)` only accepts an owning Binding Command and expected prior state.

### 5.3 规范调用与受理 (5 objects)

#### `ToolInvocation`

```rust
/// Canonical, body-free invocation anchored to one tool definition context.
pub struct ToolInvocation {
    pub invocation_id: ToolInvocationId,
    pub contract_anchor: InvocationContractAnchor,
    pub canonical_intent: CanonicalInvocationIntent,
    pub context_refs: InvocationContextRefs,
    pub established_at: DecisionTime,
}
```

`canonicalize(...)` rejects raw prompt / transport body and requires a stable anchor, correlation and attributable context carrier; an explicit insufficient context is still canonicalized so the separate immutable admission decision can reject it. `matches_tool`, `matches_revision`, and `has_correlation` are pure guards.

#### `InvocationAdmission`

```rust
/// Immutable decision fact established before any real execution attempt.
pub struct InvocationAdmission {
    pub admission_id: InvocationAdmissionId,
    pub invocation_id: ToolInvocationId,
    pub state: AdmissionState,
    pub reason: AdmissionDecisionReason,
    pub basis_refs: AdmissionBasisRefSet,
    pub decided_at: DecisionTime,
}
```

```rust
/// Pre-execution admission conclusion.
pub enum AdmissionState {
    /// The invocation may enter applicable precondition evaluation.
    Admitted,
    /// The invocation is rejected and must not execute.
    Rejected,
    /// The invocation is accepted but awaits applicable preconditions.
    AwaitingPrecondition,
    /// A required contract or source is unavailable for admission.
    Unavailable,
}
```

Factories `admit`, `reject`, `await_precondition`, `unavailable` all require `decided_at`; no later source can mutate the fact.

#### `InvocationContractAnchor`

```rust
/// Immutable contract, definition and binding assessment context for an invocation.
pub struct InvocationContractAnchor {
    pub tool_id: ToolId,
    pub definition_revision: DefinitionRevision,
    pub binding_mode: BindingMode,
    pub binding_assessment_ref: Option<BindingAssessmentRef>,
    pub anchored_at: ConsumptionTime,
}
```

`anchor(...)` freezes the explicit binding mode plus any exact accepted or conservative assessment ref. `Bound + None` is permitted only as a non-admissible missing context so the same atomic flow can record rejected/unavailable admission and no-execution; it never means explicit-unbound. Current contract changes never rewrite an existing anchor.

#### `ToolInvocationView`

```rust
/// Body-free read model for an invocation, admission and optional terminal outcome.
pub struct ToolInvocationView {
    pub invocation_id: ToolInvocationId,
    pub anchor_summary: InvocationContractAnchorSummary,
    pub intent_summary: CanonicalIntentSafeSummary,
    pub context_summary: InvocationContextRefSummary,
    pub admission_summary: InvocationAdmissionSummary,
    pub outcome_ref: Option<ToolInvocationOutcomeRef>,
    pub visibility: ConsumptionVisibility,
}
```

`project(...)` is read-only and does not fetch Runtime body or external lifecycle.

#### `InvocationContextRefs`

```rust
/// Typed caller, actor, work, trace and correlation references for one invocation.
pub struct InvocationContextRefs {
    pub caller_ref: CallerRef,
    pub actor_ref: ActorRef,
    pub work_ref: Option<WorkRef>,
    pub trace_ref: TraceRef,
    pub correlation_ref: CorrelationRef,
    pub sufficiency: ContextSufficiency,
}
```

`from_formal_context(...)` rejects forbidden body; `has_required_refs(...)` distinguishes `Sufficient`, `Degraded` and `Insufficient`. Required missing refs fail closed.

### 5.4 执行前置与条件交接 (6 objects)

#### `ExecutionRequirement`

```rust
/// L2-owned statement of which external preconditions an invocation must consume.
pub struct ExecutionRequirement {
    pub requirement_id: ExecutionRequirementId,
    pub invocation_id: ToolInvocationId,
    pub authorization_class: AuthorizationRequirementClass,
    pub isolation_class: IsolationRequirementClass,
    pub carrier_class: ExecutionCarrierRequirement,
    pub basis_refs: ExecutionRequirementBasisRefSet,
    pub decided_at: DecisionTime,
}
```

`derive(...)` can return `NoGovernance`, `AuthorizationRequired`, `SandboxRequired`, `AuthorizationAndSandboxRequired` or `Unsupported`; it never returns allow / deny.

#### `AuthorizationConsumptionAssessment`

```rust
/// Invocation-bound L2 assessment of whether an external authorization result is consumable.
pub struct AuthorizationConsumptionAssessment {
    pub assessment_id: AuthorizationAssessmentId,
    pub invocation_id: ToolInvocationId,
    pub result_ref: Option<AuthorizationResultRef>,
    pub decision_summary: Option<AuthorizationDecisionSafeSummary>,
    pub state: AuthorizationConsumptionState,
    pub consumed_at: ConsumptionTime,
}
```

States: `AcceptedAllow`, `AcceptedConstrained`, `AcceptedDeny`, `Missing`, `Stale`, `Conflicting`, `Unverifiable`. `consume(...)` checks subject / authority / freshness; `fail_closed(...)` creates conservative state. No local allowlist fallback.

#### `ExecutionHandoff`

```rust
/// Minimal body-free context prepared for an execution boundary.
pub struct ExecutionHandoff {
    pub handoff_id: ExecutionHandoffId,
    pub invocation_id: ToolInvocationId,
    pub requirement_ref: ExecutionRequirementRef,
    pub authorization_assessment_ref: Option<AuthorizationAssessmentRef>,
    pub sandbox_readiness_ref: Option<SandboxReadinessSnapshotRef>,
    pub canonical_summary: CanonicalExecutionSafeSummary,
    pub correlation_ref: CorrelationRef,
    pub state: HandoffState,
}
```

`evaluate_eligibility(...)` yields `Preparing`, `Eligible`, `Blocked` or `Invalidated`; eligible is not Sandbox accepted.

#### `ExecutionHandoffAttempt`

```rust
/// Versioned local attempt fencing one call to the execution seam.
pub struct ExecutionHandoffAttempt {
    pub attempt_id: ExecutionHandoffAttemptId,
    pub handoff_id: ExecutionHandoffId,
    pub invocation_id: ToolInvocationId,
    pub state: HandoffAttemptState,
    pub local_response: Option<ExecutionPortSafeResponse>,
    pub failure: Option<LocalExecutionFailureSummary>,
    pub attempted_at: AttemptTime,
}
```

Factories `prepared`, `record_local_submission`, `record_local_failure`, `record_carrier_unavailable`, `record_mapping_blocked`, `record_outcome_unknown` permit only `Prepared -> one local terminal` and never create `run`, `capture`, `receipt` or external lifecycle.

#### `AuthorizationResultRef`

```rust
/// Body-free pointer to an authorization owner's result for one invocation.
pub struct AuthorizationResultRef {
    pub authority_ref: AuthorizationAuthorityRef,
    pub result_id: ExternalAuthorizationResultId,
    pub subject_ref: ExternalAuthorizationSubjectRef,
    pub result_revision: ExternalRevisionRef,
    pub consumed_at: ConsumptionTime,
}
```

Only `from_port(...)` can create it; absent owner / schema remains blocked.

#### `SandboxReadinessSnapshot`

```rust
/// Point-in-time safe summary of whether a Sandbox handoff can be attempted.
pub struct SandboxReadinessSnapshot {
    pub snapshot_id: SandboxReadinessSnapshotId,
    pub authority_ref: SandboxAuthorityRef,
    pub carrier_class: ExecutionCarrierClass,
    pub mapping_state: SandboxMappingState,
    pub safe_summary: SandboxReadinessSafeSummary,
    pub observed_at: ConsumptionTime,
}
```

States include `Available`, `Unavailable`, `MappingBlocked`, `Conflicting`, `Unverifiable`; it never owns Sandbox environment / run lifecycle.

### 5.5 Outcome、审计与安全交接 (10 objects)

#### `ExecutionSourceAssessment`

```rust
/// L2 assessment of whether an external execution source is attributable and mappable.
pub struct ExecutionSourceAssessment {
    pub assessment_id: ExecutionSourceAssessmentId,
    pub invocation_id: ToolInvocationId,
    pub source_ref: Option<SandboxExecutionSourceRef>,
    pub mapping_state: SourceMappingState,
    pub source_class: ExecutionSourceClass,
    pub safe_summary: Option<ExecutionSourceSafeSummary>,
    pub consumed_at: ConsumptionTime,
}
```

`accept`, `reject`, `mapping_blocked`, `unverifiable` are append-only assessments. A resolved ref still requires normalization.

#### `ToolInvocationOutcome`

```rust
/// Exactly one immutable L2 terminal semantic result for an invocation.
pub struct ToolInvocationOutcome {
    pub outcome_id: ToolInvocationOutcomeId,
    pub invocation_id: ToolInvocationId,
    pub outcome_class: ToolOutcomeClass,
    pub result_summary: Option<ToolResultSafeSummary>,
    pub error_summary: Option<ToolErrorSafeSummary>,
    pub basis_ref: OutcomeBasisRef,
    pub recorded_at: OutcomeTime,
}
```

`OutcomeClass` variants: `Succeeded`, `ToolFailed`, `ExecutionFailed`, `CaptureFailed`, `NoExecutionRejected`, `NoExecutionUnavailable`. `establish(...)` enforces one terminal outcome per invocation; late material creates conflict / gap, never overwrite.

#### `ToolAuditEntry`

```rust
/// Append-only body-free audit fact that explains one tool outcome.
pub struct ToolAuditEntry {
    pub audit_entry_id: ToolAuditEntryId,
    pub invocation_id: ToolInvocationId,
    pub contract_anchor_ref: InvocationContractAnchorRef,
    pub judgment_refs: ToolJudgmentRefSet,
    pub outcome_id: ToolInvocationOutcomeId,
    pub source_refs: AllowedSourceRefSet,
    pub gap_refs: ConsistencyGapRefSet,
    pub recorded_at: AuditTime,
}
```

`record(...)` is in the same UoW as outcome; it cannot contain body or delivery history.

#### `SandboxExecutionSourceRef`

```rust
/// Typed reference to an attributable Sandbox source without execution body.
pub struct SandboxExecutionSourceRef {
    pub source_ref_id: SandboxExecutionSourceRefId,
    pub authority_ref: SandboxAuthorityRef,
    pub external_execution_ref: ExternalSandboxExecutionRef,
    pub handoff_correlation_ref: CorrelationRef,
    pub source_class: ExecutionSourceClass,
    pub resolution_state: ExternalReferenceState,
}
```

`from_sandbox(...)` and `mapping_blocked(...)` are the only factories; no run / capture / receipt truth is copied.

#### `BusDeliveryStatusRef`

```rust
/// Optional body-free pointer to a Bus delivery status for one local submission.
pub struct BusDeliveryStatusRef {
    pub ref_id: BusDeliveryStatusRefId,
    pub authority_ref: BusAuthorityRef,
    pub submission_attempt_id: ExternalSubmissionAttemptId,
    pub external_delivery_ref: Option<ExternalBusDeliveryRef>,
    pub status: ExternalStatusState,
    pub consumed_at: ConsumptionTime,
}
```

`Unknown`, `Referenced`, `Stale`, `Conflicting`, `Unverifiable` are independent from local submission and outcome.

#### `ObservationMaterialRef`

```rust
/// Optional pointer to an Observability material status without observation body.
pub struct ObservationMaterialRef {
    pub ref_id: ObservationMaterialRefId,
    pub authority_ref: ObservationAuthorityRef,
    pub submission_attempt_id: ExternalSubmissionAttemptId,
    pub external_material_ref: Option<ExternalObservationMaterialRef>,
    pub status: ObservationStatusState,
    pub consumed_at: ConsumptionTime,
}
```

Current default is `RouteBlocked` until producer/source/route authority closes; it must not be called observed.

#### `SafeHandoffEligibility`

```rust
/// Target-specific conjunction of the four safe-material checks.
pub struct SafeHandoffEligibility {
    pub eligibility_id: SafeHandoffEligibilityId,
    pub source: SafeHandoffSourceRefs,
    pub fact_class: SafeMaterialClass,
    pub target_class: ExternalCollaborationClass,
    pub minimal_check: SafetyCheckResult,
    pub body_free_check: SafetyCheckResult,
    pub redaction_check: SafetyCheckResult,
    pub correlation_check: SafetyCheckResult,
    pub state: SafeHandoffEligibilityState,
}
```

`evaluate(...)` returns `Eligible` only if all four checks pass; `Ineligible` / `Unverifiable` never create material.

#### `SafeHandoffMaterial`

```rust
/// Immutable minimal, body-free, redacted and correlated collaboration material.
pub struct SafeHandoffMaterial {
    pub material_id: SafeHandoffMaterialId,
    pub eligibility_id: SafeHandoffEligibilityId,
    pub target_class: ExternalCollaborationClass,
    pub fact_class: SafeMaterialClass,
    pub safe_summary: BodyFreeFactSummary,
    pub correlation_refs: SafeCorrelationRefSet,
    pub truth_refs: LocalTruthRefSet,
    pub prepared_at: MaterialPreparationTime,
}
```

`prepare(...)` requires eligible assessment and typed refs; material is immutable.

#### `ExternalSubmissionAttempt`

```rust
/// Append-only local attempt to submit safe material to an external collaboration seam.
pub struct ExternalSubmissionAttempt {
    pub attempt_id: ExternalSubmissionAttemptId,
    pub material_id: SafeHandoffMaterialId,
    pub event_id: ToolEventId,
    pub event_name: ToolOutboundEventName,
    pub event_schema_version: ToolProtocolSchemaVersion,
    pub target_class: ExternalCollaborationClass,
    pub state: ExternalSubmissionAttemptState,
    pub local_failure: Option<SubmissionLocalFailureSummary>,
    pub external_submission_locator: Option<ExternalSubmissionLocator>,
    pub route_contract_revision: Option<ExternalRevisionRef>,
    pub attempted_at: AttemptTime,
}
```

States: `Prepared`, `SubmittedLocally`, `LocallyFailed`, `RouteBlocked`, `Degraded`, `SubmissionOutcomeUnknown`. Event identity is deterministically bound before the first local call; successful/degraded local response stores only safe locator/revision material. Bus/Observation feedback remains separate append-only ref truth and never changes attempt/outcome/audit.

#### `OutcomeAuditView`

```rust
/// Stable read model combining local outcome/audit and independent external references.
pub struct OutcomeAuditView {
    pub invocation_id: ToolInvocationId,
    pub outcome_summary: ToolOutcomeSafeSummary,
    pub audit_summary: ToolAuditSafeSummary,
    pub handoff_summary: SafeHandoffStateSummary,
    pub delivery_status: Option<BusDeliveryStatusRef>,
    pub observation_status: Option<ObservationMaterialRef>,
    pub visibility: ConsumptionVisibility,
}
```

`project(...)` is pure and preserves unknown external status; it never pulls body or writes state.

### 5.6 引用完整性与受控派生 (8 objects)

#### `ReferenceValidityAssessment`

```rust
/// Point-in-time validity assessment for a typed reference.
pub struct ReferenceValidityAssessment {
    pub assessment_id: ReferenceAssessmentId,
    pub subject_ref: TypedSubjectRef,
    pub authority_ref: Option<ExternalAuthorityRef>,
    pub state: ReferenceValidityState,
    pub impact: ReferenceImpactClass,
    pub consumed_at: ConsumptionTime,
}
```

States: `Valid`, `Stale`, `Conflicting`, `Missing`, `Unverifiable`. `assess(...)` never mutates subject / ref.

#### `ConsistencyGap`

```rust
/// Local, typed record of a truth, mapping, route or reference gap.
pub struct ConsistencyGap {
    pub gap_id: ConsistencyGapId,
    pub scope: ConsistencyGapScope,
    pub subject_refs: GapSubjectRefSet,
    pub gap_class: ConsistencyGapClass,
    pub impact: GapImpactClass,
    pub state: ConsistencyGapState,
    pub detected_at: DetectionTime,
    pub resolution_evidence_ref: Option<GapResolutionEvidenceRef>,
}
```

States: `Open`, `ResolutionPending`, `Resolved`, `Superseded`. `resolve(...)` requires formal owner evidence and a resolution decision ref; no guessed commit / run / evidence alias.

#### `ReferenceConsistencyReport`

```rust
/// Rebuildable read-only report over reference assessments and gaps.
pub struct ReferenceConsistencyReport {
    pub report_id: ReferenceConsistencyReportId,
    pub scope: ReferenceInspectionScope,
    pub assessment_refs: ReferenceAssessmentRefSet,
    pub gap_refs: ConsistencyGapRefSet,
    pub source_watermark: LocalTruthWatermark,
    pub state: DerivedReportState,
    pub generated_at: ProjectionTime,
}
```

States: `Current`, `Partial`, `Stale`, `Failed`; report state never defines subject health.

#### `ToolContractSearchProjection`

```rust
/// Rebuildable body-free search projection of stable tool contract data.
pub struct ToolContractSearchProjection {
    pub projection_id: ToolContractSearchProjectionId,
    pub tool_id: ToolId,
    pub definition_revision: DefinitionRevision,
    pub search_safe_summary: ToolSearchSafeSummary,
    pub binding_summary: BindingModeSafeSummary,
    pub source_watermark: LocalTruthWatermark,
    pub freshness: FreshnessState,
}
```

`project(...)`, `mark_stale(...)`, `is_fresh_for(...)` are pure / maintenance functions; projection is not registry or authorization truth.

#### `ToolContractDiffSummary`

```rust
/// Body-free semantic difference between two formal definition revisions.
pub struct ToolContractDiffSummary {
    pub diff_id: ToolContractDiffSummaryId,
    pub tool_id: ToolId,
    pub base_revision: DefinitionRevision,
    pub target_revision: DefinitionRevision,
    pub change_summary: DefinitionSemanticChangeSummary,
    pub impact_ref: Option<CompatibilityImpactRef>,
    pub freshness: FreshnessState,
}
```

`compare(...)` requires two formal revisions and does not adopt or approve target.

#### `ToolDiagnosticSummary`

```rust
/// Body-free diagnostic aggregation of local truth, assessments, attempts and gaps.
pub struct ToolDiagnosticSummary {
    pub diagnostic_id: ToolDiagnosticSummaryId,
    pub subject_ref: ToolDiagnosticSubjectRef,
    pub local_state: ToolLocalStateSafeSummary,
    pub assessments: ExternalAssessmentSafeSummary,
    pub attempts: LocalAttemptSafeSummary,
    pub gap_refs: ConsistencyGapRefSet,
    pub freshness: FreshnessState,
}
```

`derive(...)` is read-only; `FreshnessState::Failed` describes the diagnostic material only.

#### `ToolConsumerGuidanceView`

```rust
/// Body-free guidance view for Runtime, direct callers and future SDK consumers.
pub struct ToolConsumerGuidanceView {
    pub guidance_id: ToolConsumerGuidanceViewId,
    pub tool_id: ToolId,
    pub definition_revision: DefinitionRevision,
    pub invocation_guidance: CanonicalInvocationGuidanceSummary,
    pub precondition_guidance: ExecutionPreconditionGuidanceSummary,
    pub binding_guidance: BindingModeSafeSummary,
    pub gap_refs: ConsistencyGapRefSet,
    pub freshness: FreshnessState,
}
```

It never generates a client, plan, authorization decision or Sandbox readiness fact.

#### `SharedContractAuthorityRef`

```rust
/// References the Core compile authority for a shared contract category.
pub struct SharedContractAuthorityRef {
    pub authority_ref_id: SharedContractAuthorityRefId,
    pub core_authority_ref: CoreSharedContractAuthorityRef,
    pub contract_family: SharedContractFamily,
    pub package_or_type_ref: Option<CorePackageOrTypeRef>,
    pub authority_revision: Option<ExternalRevisionRef>,
    pub state: SharedAuthorityResolutionState,
}
```

`Resolved`, `CandidateOnly`, `Missing`, `Conflicting`, `Unverifiable` are explicit. Current L2 state is `CandidateOnly` for Tools-specific types (`L2T-UP-008`).

## 6. Application / infra / entry stable carriers

These are not additional business objects. They are implementation carriers with one stable purpose and are closed in Step 6 because deferring them would make Step 7/8 invent public semantics.

| Carrier | Module | Exact responsibility | Step 6 decision |
|---|---|---|---|
| `StoredCommandResult` | application | Stage operation, idempotency identity, exact closed typed response snapshot, refs and authority-issued candidate/version in one UoW; replay only after matching commit confirmation. | closed after Step 9 controlled commit-stamp and typed-snapshot correction |
| `IdempotencyRecord` | application | Channel-aware key / digest / lifecycle and conflict surface. | closed |
| `EntryDisposition` | application / contracts | Accepted / rejected / awaiting / unavailable / duplicate replay / conflict mapping. | closed |
| `VisibilityDecision` | application | Actor / consumer / owner scope decision for Query reads; no policy truth. | closed; Step 9 fixed the existing `TypedSubjectRef` carrier variants |
| `JobReport` | jobs / contracts | Typed cursor, watermark, counts, output refs, gap refs and disposition. | closed; Step 8 controlled carrier-readability correction added typed output refs without adding business truth |
| `AdapterAvailability` | infra | Available / unavailable / blocked / unsupported adapter state. | closed |
| `ProjectionWriteResult` | infra / application | Applied / stale / conflict / unavailable projection write result. | closed |
| `ConsumerReceipt` | worker / contracts | Accepted / duplicate / rejected / quarantined / gap receipt; not external delivery receipt. | closed |

All later trait signatures must use these carriers rather than anonymous maps or strings.

## 7. Object capability-to-field/function/state mapping

| Object group | Core capability | Required identity / fields | Constructor / function | State / marker | Field source |
|---|---|---|---|---|---|
| Contract | stable identity, revision, lifecycle | tool id, revision, semantic summaries, source ref, version | `establish`, `formalize`, `adopt_revision`, `retire` | `Active / RetirementPending / Retired`; `Current / Superseded / Withdrawn` | owning Commands + immutable facts |
| Binding | relation and time assessment | binding id, tool id, mode, Hub ref, snapshot / basis, version | `declare`, `replace`, `invalidate`, `assess` | `Bound / ExplicitUnbound`; assessment states | Binding Command + Hub Port |
| Invocation | canonical call and pre-execution decision | invocation id, anchor, intent summary, context refs | `canonicalize`, `admit`, `reject` | admission states | Runtime caller formal intent + contract Query |
| Precondition / handoff | requirement, consumption assessment, local attempt | requirement classes, auth ref / state, readiness ref, safe summary | `derive`, `consume`, `evaluate`, `record_attempt` | requirement / assessment / handoff / attempt states | Definition + external Port + application clock |
| Outcome / audit | normalized terminal truth and safe external submission | outcome class, basis refs, audit refs, target, material, attempt | `establish`, `record`, `evaluate`, `prepare`, `submit` | terminal classes, eligibility, local submission | Source intake / no-execution branch + UoW |
| Integrity / derived | assess refs, gap, report, projection, guidance | subject refs, impact, watermark, freshness | `assess`, `detect`, `resolve`, `project`, `rebuild` | validity / gap / freshness / authority states | Integrity Job / stable truth refs |
| Application carriers | replay, visibility, entry disposition | key, digest, result ref, actor scope, disposition | `store`, `replay`, `conflict`, `decide` | duplicate / conflict / unavailable | service boundary + repository result |
| Infra carriers | adapter availability, projection write | adapter id, capability, blocked reason, version | `available`, `blocked`, `write_result` | available / blocked / unsupported | composition / adapter call |
| Entry carriers | envelope, receipt, report | source event, dedup, cursor, watermark, safe reason | `accept`, `duplicate`, `reject`, `quarantine` | disposition / receipt states | consumer / job boundary |

## 8. Module and object stop review

| Module / group | Function coverage | Object source | Field source | State closure | Boundary result |
|---|---|---|---|---|---|
| contracts | all public secondary types | 02 §7 + domain object refs | metadata / domain summary / Core generic candidate | marker enums closed | pass |
| domain contract | establish, evolve, retire, read | 02 §6.2 | owning Command / immutable history | lifecycle + revision closed | pass |
| domain binding | declare, replace, invalidate, assess | 02 §6.3 | Binding Command / Hub Port snapshot | relation + assessment closed | pass |
| domain invocation | canonicalize, admit, reject | 02 §6.4 | caller context / contract anchor | admission closed | pass |
| domain precondition | derive requirement, assess readiness | 02 §6.5 | definition / external ref / time | requirement + handoff closed | pass |
| domain outcome | normalize, audit, safe handoff | 02 §6.6 | source / UoW / safe summary | terminal + submission split closed | pass |
| domain integrity | assess, gap, report, projection | 02 §6.7 | refs / watermark / jobs | gap + freshness closed | pass |
| application / infra / entry | replay, visibility, availability, receipt, report | Step 5 stable carriers | service / port / adapter results | disposition markers closed | pass |

## 9. 对象组字段来源审计

| 对象组 | 已闭合来源 | 后续必须闭合 | 暂停条件 |
|---|---|---|---|
| IDs / revisions / versions | L2 owning Command + repository expected version | Serialization and persistence encoding in Step 11 | Duplicate identity or last-write-wins assumption. |
| actor / trace / correlation | Command / Consumer / Job metadata and Core generic candidate | Exact Core field reuse in Step 8 / 14 | Missing or conflicting authority. |
| external refs / snapshots | Named external Port result and consumption time | Trait result / adapter mapping in Step 7 | Invented provider schema or source body. |
| safe summaries | Domain normalization / body-free constructor | Public DTO and redaction checks in Step 8 / 15 | Raw body or secret field appears. |
| outcome / audit / attempts | L2 UoW and append-only facts | Atomic persistence in Step 11 | Outcome-only or external lifecycle leakage. |
| projections / reports | Stable truth watermark + rebuild job | Projection store and rebuild algorithm in Step 11 / 13 | Projection used as truth or hidden stale. |
| application / entry carriers | Service / port result | Protocol mapping and test cuts | Anonymous map / untyped string introduced. |

## 10. 状态闭环审计

| 状态族 | 状态主语 | 初始 / active | 关键迁移 | 终态 / special | 后续闭合 |
|---|---|---|---|---|---|
| Contract lifecycle | `ToolContract` | Active | Active -> RetirementPending -> Retired | Retired; no resurrection | Step 10 |
| Definition revision | `FormalToolDefinition` | Current / candidate | Candidate -> Current -> Superseded / Withdrawn | immutable revision | Step 10 |
| Binding | `CapabilityBinding` | Bound / ExplicitUnbound | replacement / invalidation by Command | Invalidated relation | Step 10 |
| Admission | `InvocationAdmission` | Awaiting / Admitted | -> Rejected / Unavailable | immutable decision | Step 10 |
| Requirement / handoff | `ExecutionRequirement` / `ExecutionHandoff` | derived / Preparing | -> Eligible / Blocked / Invalidated | local attempt separate | Step 10 |
| Outcome / audit | `ToolInvocationOutcome` / `ToolAuditEntry` | no terminal | establish exactly one | terminal immutable | Step 10 / 11 |
| Safe submission | `ExternalSubmissionAttempt` | Prepared | -> SubmittedLocally / LocallyFailed / RouteBlocked / Degraded | external refs independent | Step 10 / 11 |
| Integrity / derived | `ConsistencyGap` / projections | Open / Fresh | resolution / stale / rebuild | Resolved / Failed / Unavailable | Step 10 / 11 |
| Shared authority | `SharedContractAuthorityRef` | CandidateOnly | formal upstream re-evaluation | Resolved only by Core owner | Step 12 / 14 |

## 11. Step 7 承接清单

| 契约组 | Step 6 已确定 | Step 7 必须输出 | 未承接 blocker |
|---|---|---|---|
| Truth stores | Aggregate / fact identity, expected version, append-only facts | Repository methods, UoW, conflict errors, fake parity | Partial truth or last-write-wins. |
| External Ports | Typed request / response refs and blocked states | Trait signatures, caller / implementer, adapter mapping, unavailable errors | Positive provider / mapping / route fabricated. |
| ProjectionStore | Projection / report fields, watermark and freshness | Read / write / rebuild trait, cursor, stale / failed result | Projection becomes second truth. |
| Idempotency | Key / digest / stored result carrier | Repository contract, duplicate replay, conflict semantics | Duplicate creates second subject. |
| Visibility | Actor / consumer scope carrier | Resolver / visibility Port and no-write Query path | Query pulls forbidden body. |
| Consumer / Job carriers | Envelope / receipt / report states | Dedup / ordering / job runner Port and quarantine | Consumer or Job repairs core subject. |
| Safe handoff | Four checks, material and attempt fields | Collaboration Port, local response, route-blocked mapping | Submitted becomes delivered / observed. |

## 12. Current batch conclusion and reopen conditions

Step 6 closes the 41 object contracts and stable technical carriers at logical Rust type level. It does not close external positive schemas, persistence backend, protocol transport, config values, test execution or implementation phase. Reopen Step 6 if a later Step requires a new identity-bearing object, changes an owner, introduces raw body, merges execution and submission attempts, or changes any terminal state semantics. Otherwise Step 7 may proceed.

```text
step_status = completed
gate_status = pass
gate_reason = all 41 objects were expanded by module with typed fields, constructors, callable guards, state markers and forbidden-boundary rules; application/infra/entry carriers were explicitly closed and cross-module field/state audits passed
next_allowed_action = create_step_07_trait_port_adapter_contracts
formal_document_write_allowed = false
next_formal_document_allowed = false
commit_required = false
```
