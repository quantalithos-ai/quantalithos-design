# L2-tools Step 6 粒度再校准附录: object and carrier closure

> 对标: `projects/L1-governance/design-calibration/03_ddd_step_06_object_contracts.md`
> 主文件: `03_ddd_step_06_object_contracts.md`
> 状态: in_progress / R-6
> 目标: 让每个 domain object、public carrier 和 application technical carrier 都有唯一 authority、字段来源、factory/member、状态/非法分支、协议回指和最小测试切口。

## 1. R-6 开工门禁

| 项目 | 记录 |
|---|---|
| 前序 | R-5 module implementation cards `gate_status=pass` |
| 必读 | `03_ddd_step_06_object_contracts.md`; 六个 Step 6 object annex; `03_ddd_step_06_non_core_carriers_annex.md`;正式 02 §6/§7/§9/§12;详细设计 SOP/书写规范; L1 Step 6 对标 |
| 保持不变 | 正式 02 的 `6/6/5/6/10/8` 对象池、owner、状态主语和 L2T-UP-001~009 blocker |
| 本批次允许 | 补唯一 authority、carrier schema、source/member/invalid matrix；修正跨 Step 名称冲突 |
| 本批次禁止 | 新增 business identity、registry truth、authorization owner、Sandbox lifecycle、Bus/Obs store、SDK client 或实现事实 |
| 正式文档 | `03-详细设计.md` 继续 write-closed |

## 2. 唯一 authority 规则

同名类型只能有一个 canonical definition。其他文件只能引用本附录或指定 Step 6 annex，不得重新声明另一套字段。

| Type family | Canonical authority | Consumers |
|---|---|---|
| 41 domain objects | `03_ddd_step_06_object_contracts.md` §5 and six module annexes | Step 7 stores/ports, Step 8 mappers, Step 9 flows |
| public metadata/envelope/page/receipt/report/error | `03_ddd_step_06_module_contracts_shared_annex.md` | Step 7 entry seams, Step 8 protocols, Step 9 entries |
| replay/claim/visibility/adapter/projection carriers | `03_ddd_step_06_non_core_carriers_annex.md` | Step 7 foundation/stores, Step 8 shared surface, Step 9 guards |
| `ContinuationKey` / `SafeMaterialContinuationInput` / attempt view | this addendum + `03_ddd_step_07_module_entry_boundaries_annex.md` | Step 8 Event surface, Step 9 OF flows |
| `ToolEventId` / semantic event union | `03_ddd_step_08_event_protocols_annex.md` and canonical card §5 | Step 6 attempt, Step 7 submission store, Step 9 OF flows |
| `CommandUseCaseResult<T>` | this addendum §6 | IF-03 and API command mapper |
| `LocalResultRef` / `LocalAbortReason` | this addendum §6 | Consumer receipt and claim recovery |

## 3. 41-object closure matrix

The matrix is an index, not a replacement for the full cards in Step 6. A row is closed only when
the referenced card contains a field table and a callable/factory table; `pending` means the
implementation must stop at the named blocker rather than invent a field.

### 3.1 Tool contract and evolution (6)

| Object | Field/source closure | Factory/member closure | State/illegal branch | Protocol/flow/test cut |
|---|---|---|---|---|
| `ToolContract` | `tool_id` + initial revision from CF-01; lifecycle/revision/version from local UoW/store | `establish`; `accepts_new_invocation`; `adopt_revision`; `request_retirement`; `complete_retirement` | Active -> RetirementPending -> Retired; no resurrection, no Query/Job mutation | `Establish/Adopt/Retire`; CF-01/03/04, QF-01; invalid lifecycle/version |
| `FormalToolDefinition` | tool/revision from contract command; semantic summaries from typed request; source from `DefinitionSourceRef` | `formalize`; `supports_invocation`; `requires_authorization`; `requires_sandbox`; `supersede` | immutable revision; duplicate revision or missing source rejects | CF-02/03, QF-01/02; forbidden body/revision conflict |
| `ToolCompatibilityImpact` | base/candidate definitions + local consumer refs | `assess`; `blocks_adoption`; `requires_re_evaluation`; `covers` | Compatible/Conditional/Incompatible/Unverifiable; no adoption side effect | CF-02/03, QF-02; reversed pair and incomplete coverage |
| `ToolContractView` | contract/definition/evolution refs and visibility from read bundle | `project`; `is_consumable`; `matches_revision` | view freshness/visibility only; never truth mutation | QF-01/02, stored command replay; stale/hidden view |
| `DefinitionSourceRef` | authority/locator/revision from formal source candidate | `from_authority`; `supports_formalization`; `mark_stale` | Resolved/Candidate/Unverifiable; no body or live rewrite | CF-02/03, JF-02/04; blocked authority |
| `ToolContractEvolutionFact` | owning command actor/reason/correlation and prior/current revision | `record` only; append-only | fact immutable; external clue/Query/Job cannot create | CF-01/03/04, OF-01; duplicate/equal vs conflict |

### 3.2 Capability binding and controlled source (6)

| Object | Field/source closure | Factory/member closure | State/illegal branch | Protocol/flow/test cut |
|---|---|---|---|---|
| `CapabilityBinding` | tool/mode from Binding command; Hub ref only from resolved Port; version from Store | `declare`; `replace`; `invalidate`; `is_bound` | Bound/ExplicitUnbound/Invalidated; null inference and consumer mutation forbidden | CF-05~07, QF-03; replacement identity/version conflict |
| `CapabilityBindingAssessment` | binding + snapshot/basis + consumption time from Port/local clock | `assess`; `matches_binding`; `is_current_for` | Accepted/Constrained/Missing/Stale/Conflicting/Unverifiable/Blocked; no relation mutation | IF-01, QF-03, JF-01; clue mismatch/blocked |
| `HubControlledSnapshot` | authority/capability/revision/safe summary from Hub Port only | `from_port`; `mark_stale`; `matches_candidate` | immutable snapshot; stale creates new assessment | IF-01, CF-05/06; source authority mismatch |
| `CapabilityBindingView` | relation + latest assessment/snapshot refs from read bundle | `project`; `is_explicit_unbound`; `is_current_for` | visibility/freshness explicit; no authorization meaning | CF-05~07, QF-03; missing assessment |
| `HubCapabilityRef` | identity/authority/revision/locator from formal Hub resolution | `resolve`; `matches`; `supports_assessment` | Candidate/Resolved/Unverifiable; name-only or local inventory never resolves | CF-05/06, IF-01; unresolved owner |
| `CapabilityBindingChangeFact` | owning Binding command + previous/current relation refs | `record`; `is_replacement` | Declared/Replaced/Invalidated; successor only for Replaced | CF-05~07, OF-02; successor symmetry |

### 3.3 Invocation and admission (5)

| Object | Field/source closure | Factory/member closure | State/illegal branch | Protocol/flow/test cut |
|---|---|---|---|---|
| `ToolInvocation` | formal intent + typed context from caller; IDs/time from application ports | `canonicalize`; `matches_tool`; `has_correlation` | immutable canonical frame; raw prompt/plan/loop/checkpoint forbidden | CF-08, QF-04, IF-03; missing context |
| `InvocationAdmission` | invocation/anchor + gate basis from CF-08/09 | `admit`; `await_precondition`; `reject`; `unavailable` | Admitted/AwaitingPrecondition/Rejected/Unavailable; immutable decision | CF-08/09/11, QF-04/05; late re-admission conflict |
| `InvocationContractAnchor` | explicit contract/binding mode and exact assessment refs at admission | `anchor`; `matches_tool`; `matches_revision` | anchor immutable; `Bound+None` only conservative non-admissible context | CF-08/09/11, QF-04; revision drift |
| `ToolInvocationView` | invocation/admission/outcome refs from local read bundle | `project`; `is_admitted`; `has_terminal_outcome`; `is_body_free` | absent outcome remains None; no external status inference | QF-04, stored replay; half pair/hidden body |
| `InvocationContextRefs` | typed actor/consumer/process/work/context refs from formal caller | `from_formal_context`; `has_required_refs` | Sufficient/Degraded/Insufficient; missing required ref fail closed | CF-08/11; forbidden carrier/body |

### 3.4 Preconditions and conditional handoff (6)

| Object | Field/source closure | Factory/member closure | State/illegal branch | Protocol/flow/test cut |
|---|---|---|---|---|
| `ExecutionRequirement` | invocation + definition/binding assessment; pure derivation | `derive`; `classes`; `requires_authorization/sandbox` | NoGovernance/Auth/Sandbox/Both/Unsupported; never allow/deny | CF-09/10, QF-05; unsupported basis |
| `AuthorizationConsumptionAssessment` | invocation-bound result/authority/revision from Authorization Port | `consume`; `fail_closed`; `matches_requirement` | AcceptedAllow/AcceptedConstrained/AcceptedDeny/Missing/Stale/Conflicting/Unverifiable | CF-09, IF-02, QF-05; self-auth forbidden |
| `ExecutionHandoff` | invocation/requirement/readiness/eligibility refs from local and Sandbox Port | `prepare`; `evaluate_eligibility`; `record_*` | Preparing/Ready/Blocked/Invalidated; no external run state | CF-10, QF-05; mapping blocked |
| `ExecutionHandoffAttempt` | handoff ID + local Port response/failure | `prepared`; `record_local_submission`; `record_local_failure`; `record_mapping_blocked`; `record_outcome_unknown` | Prepared -> one local terminal; ambiguous call not retried | CF-10, QF-05; exactly-one call |
| `AuthorizationResultRef` | authority/result/subject/revision from formal resolution | `from_port`; `matches_invocation`; `supports_consumption` | no decision owner; absent owner remains blocked | CF-09, IF-02; result mismatch |
| `SandboxReadinessSnapshot` | Sandbox authority/carrier/mapping/safe summary from Port | `from_port`; `mapping_blocked`; `unavailable`; `supports_handoff` | Ready/Blocked/Unavailable/Conflicting/Unverifiable; no cached bypass | CF-09/10, QF-05; upstream mapping blocker |

### 3.5 Outcome, audit and safe handoff (10)

| Object | Field/source closure | Factory/member closure | State/illegal branch | Protocol/flow/test cut |
|---|---|---|---|---|
| `ExecutionSourceAssessment` | source envelope/Port + handoff correlation | `accept/reject/missing/conflicting/mapping_blocked/unverifiable`; `permits_outcome_normalization` | immutable assessment; no guessed Accepted | CF-11, IF-03; source attribution |
| `ToolInvocationOutcome` | source assessment or no-execution basis + safe result/error | `succeeded/tool_failed/execution_failed/capture_failed/no_execution_*`; `matches_invocation` | exactly one terminal; late material opens gap | CF-08/11, QF-06; terminal conflict |
| `ToolAuditEntry` | invocation/anchor/judgment/outcome/source/gap refs | `record`; `explains_outcome`; `is_body_free` | append-only, same UoW as outcome | CF-08/11, QF-06, OF-03; half pair |
| `SandboxExecutionSourceRef` | formal Sandbox authority/execution locator/revision | `from_sandbox`; `mapping_blocked`; `matches_handoff` | ref only; no run/capture/receipt | IF-03, CF-11; blocked mapping |
| `BusDeliveryStatusRef` | formal Bus feedback authority/attempt/status | `from_feedback`; `unknown`; `has_verified_delivery_ref` | Unknown/Referenced/Stale/Conflicting/Unverifiable | IF-04, JF-04, QF-06; not delivered inference |
| `ObservationMaterialRef` | formal Obs authority/attempt/material/status | `from_formal_source`; `route_blocked`; `unknown` | RouteBlocked/Unknown/Referenced/Stale/Conflicting/Unverifiable | IF-05, JF-04, QF-06; not observed inference |
| `SafeHandoffEligibility` | four checks from committed source set + target sensitivity | `evaluate`; `all_checks_pass`; `permits_material_preparation` | Eligible/Ineligible/Unverifiable; target-specific | CF-12, OF-01~04; no config bypass |
| `SafeHandoffMaterial` | eligible assessment, safe summary, typed refs/correlation/time | `prepare`; `is_body_free`; `matches_eligibility` | immutable; no mutable aggregate reconstruction | CF-12, OF-01~04; body/redaction |
| `ExternalSubmissionAttempt` | material/event/target plus local response or uncertainty | canonical `prepare` + `record_*` family | Prepared -> one local terminal; no delivery/observation | CF-12, OF-01~04, IF-04/05; ambiguous call |
| `OutcomeAuditView` | atomic outcome/audit pair + independent external refs/gaps/visibility | `project`; `has_terminal_outcome`; `external_status_is_unknown` | read-only layered surface | QF-06, OF-03; stale/degraded |

### 3.6 Integrity and controlled derivation (8)

| Object | Field/source closure | Factory/member closure | State/illegal branch | Protocol/flow/test cut |
|---|---|---|---|---|
| `ReferenceValidityAssessment` | typed subject/ref/authority/revision/freshness at consumption time | `assess`; `assess_stale`; `assess_conflicting`; `assess_missing`; `assess_unverifiable` | Valid/Stale/Conflicting/Missing/Unverifiable | IF-01/02, QF-07, JF-01/02/04; no repair |
| `ConsistencyGap` | canonical subject set/class/basis/impact/time | `detect`; `detect_propagation_incomplete`; `resolve` | Open/ResolutionPending/Resolved/Superseded; evidence locator only | CF-13, OF-04, JF-01/02; illegal transition |
| `ReferenceConsistencyReport` | scoped refs + partition/watermark/coverage | `build_current/partial/stale/failed`; `covers` | Current/Partial/Stale/Failed; no subject mutation | QF-07, JF-02; missing partition |
| `ToolContractSearchProjection` | local contract/definition/binding safe summary + watermark/schema | `project`; `mark_stale`; `is_fresh_for`; `matches_filter` | Fresh/Stale/Rebuilding/Unavailable/Failed | QF-08, JF-03; no live current lookup |
| `ToolContractDiffSummary` | formal base/target pair + impact ref + watermark | `compare`; `matches_pair`; `requires_impact_assessment` | immutable comparison; no adopt | QF-02/QF-09; reversed pair |
| `ToolDiagnosticSummary` | local truth/assessment/attempt/gap safe aggregations | `derive`; `is_body_free` | explicit freshness/failed; no repair | QF-10; unavailable dependency |
| `ToolConsumerGuidanceView` | tool revision + invocation/precondition/binding safe guidance + gaps | `derive`; `is_body_free`; `matches_revision` | read-only; no client/plan/auth decision | QF-11; stale revision |
| `SharedContractAuthorityRef` | Core candidate/authority/family/revision resolution | `candidate_only/resolved/missing/conflicting/unverifiable` | only owner can resolve; Tools schema remains blocked | Step 8 shared; JF-02; L2T-UP-008 |

## 4. Stable carrier canonical cards

### 4.1 `ToolEventId`

```rust
/// Deterministic identity of one semantic outbound event.
pub struct ToolEventId(pub String);

impl ToolEventId {
    /// Derives identity from the complete canonical event frame.
    pub fn derive(
        event_name: ToolOutboundEventName,
        schema_version: ToolProtocolSchemaVersion,
        material_id: SafeHandoffMaterialId,
        source_truth_refs: &LocalTruthRefSet,
    ) -> Result<Self, ProtocolError>;
}
```

The canonical frame is exactly `(event_name, schema_version, material_id, canonical_source_truth_refs)`.
Refs are sorted, typed and version-tagged before hashing. The historical three-field description
is superseded; no caller may derive an ID without `source_truth_refs`. A non-canonical set, empty
required source set or digest collision is `IntegrityFailure`. `ExternalSubmissionAttempt` stores
this exact ID before the first collaboration Port call.

### 4.2 `ContinuationKey` and `SafeMaterialContinuationInput`

```rust
/// Stable idempotency identity for one safe-material continuation.
pub struct ContinuationKey(pub String);

impl ContinuationKey {
    /// Derives a key from material identity and semantic event class/target/version.
    pub fn derive(
        material_ref: SafeHandoffMaterialRef,
        material_class: SafeMaterialClass,
        target_class: ExternalCollaborationClass,
        schema_version: ToolProtocolSchemaVersion,
    ) -> Result<Self, ProtocolError>;
}

/// Validated application input for one committed safe-material continuation.
pub struct SafeMaterialContinuationInput {
    pub material_ref: SafeHandoffMaterialRef,
    pub material_class: SafeMaterialClass,
    pub target_class: ExternalCollaborationClass,
    pub continuation_key: ContinuationKey,
    pub correlation_ref: CorrelationRef,
}

impl SafeMaterialContinuationInput {
    /// Builds the input only from a committed material read, never from a worker guess.
    pub fn from_committed_material(
        material: &SafeHandoffMaterial,
        schema_version: ToolProtocolSchemaVersion,
        correlation_ref: CorrelationRef,
    ) -> Result<Self, ProtocolError>;

    /// Revalidates key/class/target/correlation symmetry before any attempt lookup/write.
    pub fn validate(&self, material: &SafeHandoffMaterial) -> Result<(), ProtocolError>;

    /// Returns the canonical request digest used by continuation idempotency.
    pub fn canonical_digest(&self) -> CanonicalRequestDigest;
}
```

The key excludes worker run, scheduler lease, transport route, retry count and provider body.
`from_committed_material` rejects an uncommitted/empty material, unsupported schema or missing
correlation. `validate` rejects material/class/target/key/correlation mismatch. A missing material
is mapped to `ProtocolError::blocked_without_subject` and creates no attempt.

### 4.3 `CommandUseCaseResult<T>`

```rust
/// Internal result used by a Consumer that must inspect commitment before public mapping.
pub enum CommandUseCaseResult<T> {
    /// A typed command response and its local commit are confirmed.
    Committed(ToolCommandResponse<T>),
    /// A typed safe error and stored result reference are committed and replayable.
    CommittedError(StoredApplicationError, StoredCommandResultRef),
    /// No replayable local result exists; the caller must not create a receipt.
    Transient(ProtocolError),
}
```

Only `IF-03` consumes this union before the API mapper. `Committed` requires a confirmed stored
result and candidate symmetry; `CommittedError` requires matching error/result refs; `Transient`
maps only to an incomplete claim with `RetrySameInput` and never to Accepted, GapRecorded or
Quarantined.

### 4.4 `LocalResultRef` and `LocalAbortReason`

```rust
/// Closed local result reference carried by a Consumer receipt.
pub enum LocalResultRef {
    HubSnapshot(HubSnapshotRef),
    BindingAssessment(BindingAssessmentRef),
    ReferenceAssessment(ReferenceAssessmentRef),
    BusStatus(BusDeliveryStatusRefId),
    ObservationStatus(ObservationMaterialRefId),
    Gap(ConsistencyGapRef),
    CommandResult(StoredCommandResultRef),
    OutcomeAudit(OutcomeAuditPairRef),
}

/// Reason why a technical Consumer claim can be aborted before side effects.
pub enum LocalAbortReason {
    /// Input validation failed before an observational dependency call.
    InvalidInput,
    /// The source envelope was unsupported or not attributable.
    UnsupportedSource,
    /// A read-only dependency was unavailable before any side-effecting call.
    DependencyUnavailable,
    /// A required external resolution could not be attributed to the local subject.
    UnattributableExternalResolution,
    /// Local transaction failed before a committed receipt existed.
    LocalTransactionFailure,
}
```

`LocalResultRef` variants map only to committed local Store results listed in Step 7; it cannot
carry a broker receipt, run ID, evidence alias, provider body or delivery/observation assertion.
`UnattributableExternalResolution` is never used to erase a claim after a side-effecting call or
formal CF-11 re-entry. After ambiguity the claim remains incomplete and an integrity/manual-owner
path is opened.

### 4.5 `ProtocolError` blocked subject constructor

`ProtocolError` remains canonically defined in `03_ddd_step_06_module_contracts_shared_annex.md`.
The following constructor is added to that authority and is the only mapping for a missing subject
on a continuation or other blocked path:

```rust
impl ProtocolError {
    /// Returns a body-free blocked error when no attributable local subject exists.
    pub fn blocked_without_subject(correlation_ref: CorrelationRef) -> Self;
}
```

It uses a stable `ToolErrorCode::SubjectUnavailable`, `ProtocolErrorClass::Blocked`,
`RetryHint::RetryAfterDependencyRecovery`, empty `subject_refs` and empty `gap_refs`. It must not
be used when a local subject or attributable gap exists; those branches carry typed refs. The
constructor never embeds a material ID guess, external locator or backend detail.

## 5. Source/function/invalid audit

| Object family | Required source | Factory/member | Illegal branch | Public/protocol back-reference |
|---|---|---|---|---|
| contract/evolution | owning Command + formal source + local clock/version | §3.1 six rows | duplicate revision, retirement resurrection, source body | CF-01~04/QF-01~02/OF-01 |
| binding/source | Binding Command or named Hub Port + assessment time | §3.2 six rows | null inference, source mismatch, consumer relation mutation | CF-05~07/IF-01/QF-03/OF-02 |
| invocation/admission | formal caller + contract/binding read bundle | §3.3 five rows | raw body, missing context, late re-admission | CF-08/11/QF-04/IF-03 |
| precondition/handoff | definition + invocation + blocked-aware external Port | §3.4 six rows | self-authorization, Sandbox lifecycle leakage, second call | CF-09~10/QF-05 |
| outcome/audit/safe material | source assessment/no-execution basis + four safety gates | §3.5 ten rows | outcome overwrite, half pair, body or delivery inference | CF-11~12/QF-06/OF-01~04/IF-04~05 |
| integrity/derived | typed refs + local watermark + bounded jobs | §3.6 eight rows | subject repair, stale-as-current, guessed Core schema | CF-13/QF-07~11/JF-01~04 |
| technical carriers | metadata/envelope/claim/store/Port result | §§4.1~4.5 | anonymous map, unconfirmed commit, transient receipt | IF-03/OF-01~04/Step 7~9 |

## 6. R-6 stop review and gate

| Review item | Result | Evidence |
|---|---|---|
| All 41 objects retain exact `6/6/5/6/10/8` grouping | pass | §3 matrices + Step 6 source cards |
| Each object has source, factory/member, state and illegal branch | pass | §3 rows and referenced cards |
| Each object maps to at least one protocol/flow or is explicitly internal | pass | protocol/flow column |
| Stable carriers have one canonical definition | pass | §2 and §4; old duplicate descriptions are references only |
| `ToolEventId` canonical frame is unique | pass | §4.1; old three-field frame superseded |
| IF-03 result, Consumer refs and abort reasons are constructible | pass | §§4.3~4.4 |
| Missing subject and blocked positive branch are distinct | pass | §4.5 and L2T-UP-001~009 |
| New business identity/provider/implementation fact introduced | none | R-6 only closes technical carriers |

```text
batch = R-6_object_and_carrier_closure
step_status = completed
gate_status = pass
gate_reason = 41 domain objects and cross-flow technical carriers now have unique authority, field/source mapping, factory/member/invalid semantics and protocol/flow back-references; no domain owner or external lifecycle was added.
next_allowed_action = start R-7 exact trait/Port/Store/entry seam audit
formal_document_write_allowed = false
next_formal_document_allowed = false
commit_required = false
```
