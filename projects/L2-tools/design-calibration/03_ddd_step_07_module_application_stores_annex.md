# L2-tools Step 7 模块附录: application-owned store contracts

> 状态: completed / pass
> 主文件: `03_ddd_step_07_trait_port_adapter_contracts.md`
> 固定规模: 6 truth/attempt store groups + `ProjectionStore`
> 作用: 定义完整读取面、semantic unique key、expected-version 写入、UoW 参与和 projection watermark 规则；不选择数据库、表或索引产品。

## 1. Shared persistence rules

| Rule | Exact contract |
|---|---|
| Single authority | All seven logical stores and `IdempotencyStore` participating in one command use the same local persistence authority and `ToolsUnitOfWorkManager`. |
| Version source | Only `Loaded<T>::expected_version` returned by the adapter may be passed to a mutation save. Domain `version` is serialized truth, not the compare token. |
| Create source | Every create method returns `Loaded<T>` with the initial persisted compare token inside the same UoW. Rollback invalidates that token. |
| Immutable fact | Append uses a named semantic unique key and returns `AppendResult<Ref>`; equal duplicate and conflicting duplicate are distinct. |
| Query read | Read methods do not start hidden transactions, refresh external truth or acquire write ownership. |
| Page | Every list/search accepts a typed scope plus `RepositoryPageRequest` and returns watermark-bearing `RepositoryPage<T>`. |
| UoW | Every write receives the same application-owned `&dyn ToolsUnitOfWork`; adapter cannot commit, rollback, nest or retry. |
| External side effect | No store method publishes events, invokes external ports, writes telemetry backend or acknowledges a broker. |

```rust
/// Opaque bounded page request for internal repository scans.
pub struct RepositoryPageRequest {
    pub cursor: Option<RepositoryCursor>,
    pub limit: RepositoryPageLimit,
    pub filter_digest: RepositoryFilterDigest,
}
```

```rust
/// Builds the first bounded reverse-reference page for one Consumer invocation.
pub fn first_consumer_reverse_page(
    filter_digest: RepositoryFilterDigest,
    configured_limit: RepositoryPageLimit,
) -> RepositoryPageRequest {
    RepositoryPageRequest {
        cursor: None,
        limit: configured_limit,
        filter_digest,
    }
}
```

`configured_limit` is supplied by the composition/configuration binding; the helper never reads
configuration or expands an invalid limit. A Consumer passes the exact scope digest used by the
reverse lookup, and a continuation cursor is returned as `PropagationIncomplete` rather than
fetched in the same call.

`filter_digest` is computed by application from the exact typed scope. The adapter validates cursor schema, scope digest, sort position and watermark compatibility. Stable ordering and logical keys are fixed below; physical indexes remain Step 11/backend design.

## 2. `ToolContractStore`

### 2.1 Capability / read-write surface

| Object ability | Read needed by | Write needed by | Semantic unique key |
|---|---|---|---|
| Stable contract identity/current pointer/lifecycle | contract Commands, invocation, Queries, Jobs | establish/adopt/retire | `tool_id` |
| Immutable definition revision | establish/evolution/invocation/diff/guidance | establish/candidate/adopt | `(tool_id, definition_revision)` |
| Compatibility impact | assess/adopt/diff | assess change | `(tool_id, base_revision, candidate_revision, assessment_basis_digest)` |
| Evolution fact | contract history/events/audit | establish/adopt/retire | `evolution_fact_id`; correlation+kind digest for dedup |

```rust
pub trait ToolContractStore: Send + Sync {
    fn get_contract<'a>(
        &'a self,
        tool_id: &'a ToolId,
    ) -> PortFuture<'a, Result<Option<Loaded<ToolContract>>, RepositoryError>>;

    fn get_contract_owner_scope<'a>(
        &'a self,
        tool_id: &'a ToolId,
    ) -> PortFuture<'a, Result<Option<OwnerScopeRef>, RepositoryError>>;

    fn get_definition<'a>(
        &'a self,
        tool_id: &'a ToolId,
        revision: DefinitionRevision,
    ) -> PortFuture<'a, Result<Option<Loaded<FormalToolDefinition>>, RepositoryError>>;

    fn get_current_bundle<'a>(
        &'a self,
        tool_id: &'a ToolId,
    ) -> PortFuture<'a, Result<Option<ToolContractReadBundle>, RepositoryError>>;

    fn get_definition_comparison_bundle<'a>(
        &'a self,
        tool_id: &'a ToolId,
        base_revision: DefinitionRevision,
        target_revision: DefinitionRevision,
    ) -> PortFuture<'a, Result<Option<ToolDefinitionComparisonReadBundle>, RepositoryError>>;

    fn get_compatibility_impact<'a>(
        &'a self,
        impact_ref: &'a CompatibilityImpactRef,
    ) -> PortFuture<'a, Result<Option<ToolCompatibilityImpact>, RepositoryError>>;

    fn get_evolution_fact<'a>(
        &'a self,
        fact_ref: &'a EvolutionFactRef,
    ) -> PortFuture<'a, Result<Option<ToolContractEvolutionFact>, RepositoryError>>;

    fn find_impact_for_pair<'a>(
        &'a self,
        tool_id: &'a ToolId,
        base_revision: DefinitionRevision,
        candidate_revision: DefinitionRevision,
    ) -> PortFuture<'a, Result<Option<ToolCompatibilityImpact>, RepositoryError>>;

    fn list_evolution_facts<'a>(
        &'a self,
        scope: ToolEvolutionScope,
        page: RepositoryPageRequest,
    ) -> PortFuture<'a, Result<RepositoryPage<ToolContractEvolutionFact>, RepositoryError>>;

    fn create_contract<'a>(
        &'a self,
        contract: ToolContract,
        uow: &'a dyn ToolsUnitOfWork,
    ) -> PortFuture<'a, Result<Loaded<ToolContract>, RepositoryError>>;

    fn save_contract<'a>(
        &'a self,
        contract: ToolContract,
        expected_version: ExpectedVersion,
        uow: &'a dyn ToolsUnitOfWork,
    ) -> PortFuture<'a, Result<Loaded<ToolContract>, RepositoryError>>;

    fn insert_definition<'a>(
        &'a self,
        definition: FormalToolDefinition,
        uow: &'a dyn ToolsUnitOfWork,
    ) -> PortFuture<'a, Result<AppendResult<FormalToolDefinitionRef>, RepositoryError>>;

    fn save_definition<'a>(
        &'a self,
        definition: FormalToolDefinition,
        expected_version: ExpectedVersion,
        uow: &'a dyn ToolsUnitOfWork,
    ) -> PortFuture<'a, Result<Loaded<FormalToolDefinition>, RepositoryError>>;

    fn append_compatibility_impact<'a>(
        &'a self,
        impact: ToolCompatibilityImpact,
        uow: &'a dyn ToolsUnitOfWork,
    ) -> PortFuture<'a, Result<AppendResult<CompatibilityImpactRef>, RepositoryError>>;

    fn append_evolution_fact<'a>(
        &'a self,
        fact: ToolContractEvolutionFact,
        uow: &'a dyn ToolsUnitOfWork,
    ) -> PortFuture<'a, Result<AppendResult<EvolutionFactRef>, RepositoryError>>;
}
```

```rust
/// One current contract snapshot used by truth reads and contract Commands.
pub struct ToolContractReadBundle {
    pub contract: Loaded<ToolContract>,
    pub current_definition: Loaded<FormalToolDefinition>,
    pub evolution_head: Option<EvolutionFactRef>,
    pub source_watermark: LocalTruthWatermark,
}

/// Two directional definition revisions and their optional impact at one read watermark.
pub struct ToolDefinitionComparisonReadBundle {
    pub base_definition: Loaded<FormalToolDefinition>,
    pub target_definition: Loaded<FormalToolDefinition>,
    pub matching_impact: Option<ToolCompatibilityImpact>,
    pub source_watermark: LocalTruthWatermark,
}
```

`ToolContractReadBundle` contains `Loaded<ToolContract>`, exact `Loaded<FormalToolDefinition>` current definition, optional evolution head and a single `LocalTruthWatermark`; adapters must reject current-pointer/definition mismatch rather than return a partial bundle. `ToolDefinitionComparisonReadBundle` contains exact base and target `Loaded<FormalToolDefinition>`, an optional matching `ToolCompatibilityImpact`, and one `LocalTruthWatermark` from the same local read snapshot. It returns `None` when either requested definition is absent and returns a serialization conflict rather than a partial/mismatched pair or alien impact. Establish writes contract, first definition and first evolution fact in one UoW. Adopt uses the loaded candidate/current compare tokens and writes candidate/current/superseded revision representation, contract pointer and evolution fact in one UoW; Step 11 fixes save order.

Stop review: current/read history/impact/view construction are complete; identity and revision uniqueness cannot be overwritten; pass.

Step 9 controlled callable correction: `get_definition` now returns `Loaded<FormalToolDefinition>` and `save_definition` persists the already-defined revision-state transitions under an adapter-issued compare token. Store/Port/object counts and definition semantics are unchanged.

Step 9 controlled Query-read correction: `get_definition_comparison_bundle` closes the already-declared direct comparison Query's common-watermark requirement. It is a read-only method on the existing store and adds only a technical carrier; no owner, store group, business object, write surface or external dependency is added.

## 3. `CapabilityBindingStore`

```rust
pub trait CapabilityBindingStore: Send + Sync {
    fn get_binding<'a>(
        &'a self,
        binding_id: &'a CapabilityBindingId,
    ) -> PortFuture<'a, Result<Option<Loaded<CapabilityBinding>>, RepositoryError>>;

    fn find_current_by_tool<'a>(
        &'a self,
        tool_id: &'a ToolId,
    ) -> PortFuture<'a, Result<Option<Loaded<CapabilityBinding>>, RepositoryError>>;

    fn get_binding_owner_scope<'a>(
        &'a self,
        binding_id: &'a CapabilityBindingId,
    ) -> PortFuture<'a, Result<Option<OwnerScopeRef>, RepositoryError>>;

    fn get_snapshot<'a>(
        &'a self,
        snapshot_ref: &'a HubSnapshotRef,
    ) -> PortFuture<'a, Result<Option<HubControlledSnapshot>, RepositoryError>>;

    fn get_assessment<'a>(
        &'a self,
        assessment_ref: &'a BindingAssessmentRef,
    ) -> PortFuture<'a, Result<Option<CapabilityBindingAssessment>, RepositoryError>>;

    fn get_latest_assessment_for_binding<'a>(
        &'a self,
        binding_id: &'a CapabilityBindingId,
    ) -> PortFuture<'a, Result<Option<CapabilityBindingAssessment>, RepositoryError>>;

    fn list_bindings_by_hub_capability<'a>(
        &'a self,
        scope: HubCapabilityBindingLookupScope,
        page: RepositoryPageRequest,
    ) -> PortFuture<'a, Result<RepositoryPage<Loaded<CapabilityBinding>>, RepositoryError>>;

    fn get_change_fact<'a>(
        &'a self,
        fact_ref: &'a BindingChangeFactRef,
    ) -> PortFuture<'a, Result<Option<CapabilityBindingChangeFact>, RepositoryError>>;

    fn list_assessments<'a>(
        &'a self,
        scope: BindingAssessmentScope,
        page: RepositoryPageRequest,
    ) -> PortFuture<'a, Result<RepositoryPage<CapabilityBindingAssessment>, RepositoryError>>;

    fn list_change_facts<'a>(
        &'a self,
        scope: BindingChangeScope,
        page: RepositoryPageRequest,
    ) -> PortFuture<'a, Result<RepositoryPage<CapabilityBindingChangeFact>, RepositoryError>>;

    fn create_binding<'a>(
        &'a self,
        binding: CapabilityBinding,
        uow: &'a dyn ToolsUnitOfWork,
    ) -> PortFuture<'a, Result<Loaded<CapabilityBinding>, RepositoryError>>;

    fn save_binding<'a>(
        &'a self,
        binding: CapabilityBinding,
        expected_version: ExpectedVersion,
        uow: &'a dyn ToolsUnitOfWork,
    ) -> PortFuture<'a, Result<Loaded<CapabilityBinding>, RepositoryError>>;

    fn append_snapshot<'a>(
        &'a self,
        snapshot: HubControlledSnapshot,
        uow: &'a dyn ToolsUnitOfWork,
    ) -> PortFuture<'a, Result<AppendResult<HubSnapshotRef>, RepositoryError>>;

    fn append_assessment<'a>(
        &'a self,
        assessment: CapabilityBindingAssessment,
        uow: &'a dyn ToolsUnitOfWork,
    ) -> PortFuture<'a, Result<AppendResult<BindingAssessmentRef>, RepositoryError>>;

    fn append_change_fact<'a>(
        &'a self,
        fact: CapabilityBindingChangeFact,
        uow: &'a dyn ToolsUnitOfWork,
    ) -> PortFuture<'a, Result<AppendResult<BindingChangeFactRef>, RepositoryError>>;
}
```

`HubSnapshotRef` is the only current Step 6/7 Rust-facing snapshot reference. The older
`HubControlledSnapshotRef` wording from 02-era material is a superseded alias and must not be
implemented as a second newtype or assembled into formal 03.

```rust
/// Exact local reverse-lookup key for one formal Hub capability identity.
pub struct HubCapabilityBindingLookupScope {
    pub authority_ref: HubAuthorityRef,
    pub capability_id: ExternalCapabilityId,
    pub locator_digest: Option<ExternalLocatorDigest>,
    pub include_terminal: bool,
}

impl HubCapabilityBindingLookupScope {
    /// Returns the canonical filter digest used by repository cursors and continuation gaps.
    pub fn filter_digest(&self) -> RepositoryFilterDigest {
        RepositoryFilterDigest::from_canonical(self)
    }
}

/// Version-tagged canonical digest of one normalized body-free external locator.
pub struct ExternalLocatorDigest(pub String);
```

`find_current_by_tool` returns at most one nonterminal relation and includes explicit-unbound. `get_latest_assessment_for_binding` orders immutable assessments by `(consumed_at, assessment_id)` and returns a conflict instead of choosing when equal ordering frames have different canonical content. Invalidated/history relations are excluded but remain available by ID/change history. Snapshot unique key is `(Hub authority, capability identity, source revision, safe summary digest)`; assessment unique key is `(binding, snapshot/ref basis, consumption frame)`; a new snapshot/assessment never updates old invocation anchors.

`ExternalLocatorDigest::from_normalized(&ExternalLocatorSummary)` uses the repository filter digest algorithm/version and rejects an empty or unsupported tag. It is not an endpoint, row address or registry key. The lookup returns only local bound relations whose stored `HubCapabilityRef` matches authority/capability and, when supplied, locator digest, including terminal history only when `include_terminal=true`; it never queries Hub, resolves a name, or enumerates provider inventory. Stable ordering is `(binding_id)` and every Consumer call processes one configured-bounded page.

Stop review: current relation, explicit-unbound, historical changes and per-consumption assessment reads are separated; Hub source cannot overwrite relation; pass.

## 4. `ToolInvocationStore`

```rust
pub trait ToolInvocationStore: Send + Sync {
    fn get_invocation<'a>(
        &'a self,
        invocation_id: &'a ToolInvocationId,
    ) -> PortFuture<'a, Result<Option<ToolInvocation>, RepositoryError>>;

    fn get_invocation_owner_scope<'a>(
        &'a self,
        invocation_id: &'a ToolInvocationId,
    ) -> PortFuture<'a, Result<Option<OwnerScopeRef>, RepositoryError>>;

    fn get_admission<'a>(
        &'a self,
        invocation_id: &'a ToolInvocationId,
    ) -> PortFuture<'a, Result<Option<InvocationAdmission>, RepositoryError>>;

    fn get_invocation_read_bundle<'a>(
        &'a self,
        invocation_id: &'a ToolInvocationId,
    ) -> PortFuture<'a, Result<Option<ToolInvocationReadBundle>, RepositoryError>>;

    fn list_by_tool<'a>(
        &'a self,
        scope: ToolInvocationScope,
        page: RepositoryPageRequest,
    ) -> PortFuture<'a, Result<RepositoryPage<ToolInvocation>, RepositoryError>>;

    fn insert_invocation<'a>(
        &'a self,
        invocation: ToolInvocation,
        uow: &'a dyn ToolsUnitOfWork,
    ) -> PortFuture<'a, Result<AppendResult<ToolInvocationRef>, RepositoryError>>;

    fn append_admission<'a>(
        &'a self,
        admission: InvocationAdmission,
        uow: &'a dyn ToolsUnitOfWork,
    ) -> PortFuture<'a, Result<AppendResult<InvocationAdmissionRef>, RepositoryError>>;
}
```

`ToolInvocationReadBundle` contains invocation + matching admission + optional local outcome ref + one local watermark. The optional outcome ref is resolved through the same persistence authority but does not pull outcome body or external systems. Unique keys are `invocation_id` and one admission per invocation. A late alternate admission is a conflict/gap, not a state update.

```rust
/// One canonical invocation, its immutable admission and terminal-link index at one watermark.
pub struct ToolInvocationReadBundle {
    pub invocation: ToolInvocation,
    pub admission: InvocationAdmission,
    pub outcome_ref: Option<ToolInvocationOutcomeRef>,
    pub source_watermark: LocalTruthWatermark,
}
```

Stop review: canonical invocation/admission and Query read bundle are complete; immutable decision uniqueness is explicit; pass.

## 5. `ExecutionHandoffStore`

```rust
pub trait ExecutionHandoffStore: Send + Sync {
    fn get_requirement<'a>(&'a self, invocation_id: &'a ToolInvocationId)
        -> PortFuture<'a, Result<Option<ExecutionRequirement>, RepositoryError>>;

    fn get_authorization_assessment<'a>(&'a self, assessment_ref: &'a AuthorizationAssessmentRef)
        -> PortFuture<'a, Result<Option<AuthorizationConsumptionAssessment>, RepositoryError>>;

    fn get_latest_authorization_assessment<'a>(&'a self, invocation_id: &'a ToolInvocationId)
        -> PortFuture<'a, Result<Option<AuthorizationConsumptionAssessment>, RepositoryError>>;

    fn list_authorization_assessments_by_result<'a>(
        &'a self,
        scope: AuthorizationAssessmentLookupScope,
        page: RepositoryPageRequest,
    ) -> PortFuture<'a, Result<RepositoryPage<AuthorizationConsumptionAssessment>, RepositoryError>>;

    fn get_sandbox_readiness<'a>(&'a self, readiness_ref: &'a SandboxReadinessSnapshotRef)
        -> PortFuture<'a, Result<Option<SandboxReadinessSnapshot>, RepositoryError>>;

    fn get_handoff<'a>(&'a self, handoff_id: &'a ExecutionHandoffId)
        -> PortFuture<'a, Result<Option<Loaded<ExecutionHandoff>>, RepositoryError>>;

    fn get_latest_handoff_by_invocation<'a>(&'a self, invocation_id: &'a ToolInvocationId)
        -> PortFuture<'a, Result<Option<Loaded<ExecutionHandoff>>, RepositoryError>>;

    fn get_handoff_attempt<'a>(&'a self, attempt_id: &'a ExecutionHandoffAttemptId)
        -> PortFuture<'a, Result<Option<Loaded<ExecutionHandoffAttempt>>, RepositoryError>>;

    fn list_handoff_attempts<'a>(
        &'a self,
        scope: ExecutionHandoffAttemptScope,
        page: RepositoryPageRequest,
    ) -> PortFuture<'a, Result<RepositoryPage<ExecutionHandoffAttempt>, RepositoryError>>;

    fn get_precondition_read_bundle<'a>(&'a self, invocation_id: &'a ToolInvocationId)
        -> PortFuture<'a, Result<Option<ExecutionPreconditionReadBundle>, RepositoryError>>;

    fn append_requirement<'a>(&'a self, value: ExecutionRequirement, uow: &'a dyn ToolsUnitOfWork)
        -> PortFuture<'a, Result<AppendResult<ExecutionRequirementRef>, RepositoryError>>;

    fn append_authorization_assessment<'a>(&'a self, value: AuthorizationConsumptionAssessment, uow: &'a dyn ToolsUnitOfWork)
        -> PortFuture<'a, Result<AppendResult<AuthorizationAssessmentRef>, RepositoryError>>;

    fn append_sandbox_readiness<'a>(&'a self, value: SandboxReadinessSnapshot, uow: &'a dyn ToolsUnitOfWork)
        -> PortFuture<'a, Result<AppendResult<SandboxReadinessSnapshotRef>, RepositoryError>>;

    fn create_handoff<'a>(&'a self, value: ExecutionHandoff, uow: &'a dyn ToolsUnitOfWork)
        -> PortFuture<'a, Result<Loaded<ExecutionHandoff>, RepositoryError>>;

    fn save_handoff<'a>(&'a self, value: ExecutionHandoff, expected_version: ExpectedVersion, uow: &'a dyn ToolsUnitOfWork)
        -> PortFuture<'a, Result<Loaded<ExecutionHandoff>, RepositoryError>>;

    fn create_handoff_attempt<'a>(&'a self, value: ExecutionHandoffAttempt, uow: &'a dyn ToolsUnitOfWork)
        -> PortFuture<'a, Result<Loaded<ExecutionHandoffAttempt>, RepositoryError>>;

    fn save_handoff_attempt<'a>(
        &'a self,
        value: ExecutionHandoffAttempt,
        expected_version: ExpectedVersion,
        uow: &'a dyn ToolsUnitOfWork,
    ) -> PortFuture<'a, Result<Loaded<ExecutionHandoffAttempt>, RepositoryError>>;
}
```

```rust
/// Exact local reverse-lookup key for assessments that consumed one external result.
pub struct AuthorizationAssessmentLookupScope {
    pub external_result_id: ExternalAuthorizationResultId,
    pub subject_ref: ExternalAuthorizationSubjectRef,
}

impl AuthorizationAssessmentLookupScope {
    /// Returns the canonical filter digest used by repository cursors and continuation gaps.
    pub fn filter_digest(&self) -> RepositoryFilterDigest {
        RepositoryFilterDigest::from_canonical(self)
    }
}
```

One requirement is permitted per invocation/anchor/evaluation version; repeated exact evaluation returns the same ref. Authorization/readiness assessments are immutable per source/basis/consumption frame. Each handoff is versioned only from `Preparing` to one terminal local state. Each handoff attempt is versioned only from `Prepared` to one terminal local-call disposition and supplies the durable fence for exactly one Port call; no attempt update to external run/receipt exists.

`AuthorizationAssessmentLookupScope` requires both fields and returns only immutable local assessments whose stored `AuthorizationResultRef` matches both; assessments with no result ref are excluded. Stable ordering is `(invocation_id, consumed_at, assessment_id)`. The lookup never queries authorization policy/result inventory or changes an assessment.

```rust
/// Optional precondition and handoff material for one invocation at one local watermark.
pub struct ExecutionPreconditionReadBundle {
    pub requirement: Option<ExecutionRequirement>,
    pub authorization_assessment: Option<AuthorizationConsumptionAssessment>,
    pub sandbox_readiness: Option<SandboxReadinessSnapshot>,
    pub latest_handoff: Option<Loaded<ExecutionHandoff>>,
    pub latest_attempt: Option<Loaded<ExecutionHandoffAttempt>>,
    pub no_execution_outcome_ref: Option<ToolInvocationOutcomeRef>,
    pub source_watermark: LocalTruthWatermark,
}
```

Stop review: Step 8 precondition view and Step 10 state matrices have complete reads; handoff version and attempt append semantics are explicit; pass.

## 6. `OutcomeAuditStore`

```rust
pub trait OutcomeAuditStore: Send + Sync {
    fn get_source_assessment<'a>(&'a self, assessment_ref: &'a ExecutionSourceAssessmentRef)
        -> PortFuture<'a, Result<Option<ExecutionSourceAssessment>, RepositoryError>>;

    fn list_source_assessments<'a>(
        &'a self,
        scope: ExecutionSourceAssessmentScope,
        page: RepositoryPageRequest,
    ) -> PortFuture<'a, Result<RepositoryPage<ExecutionSourceAssessment>, RepositoryError>>;

    fn get_outcome_audit_pair<'a>(&'a self, invocation_id: &'a ToolInvocationId)
        -> PortFuture<'a, Result<Option<OutcomeAuditPair>, RepositoryError>>;

    fn get_outcome<'a>(&'a self, outcome_id: &'a ToolInvocationOutcomeId)
        -> PortFuture<'a, Result<Option<ToolInvocationOutcome>, RepositoryError>>;

    fn get_audit_entry<'a>(&'a self, audit_entry_id: &'a ToolAuditEntryId)
        -> PortFuture<'a, Result<Option<ToolAuditEntry>, RepositoryError>>;

    fn append_source_assessment<'a>(&'a self, value: ExecutionSourceAssessment, uow: &'a dyn ToolsUnitOfWork)
        -> PortFuture<'a, Result<AppendResult<ExecutionSourceAssessmentRef>, RepositoryError>>;

    fn insert_outcome_audit_pair<'a>(
        &'a self,
        pair: OutcomeAuditPair,
        uow: &'a dyn ToolsUnitOfWork,
    ) -> PortFuture<'a, Result<OutcomeAuditInsertResult, RepositoryError>>;
}
```

```rust
/// The indivisible local terminal truth pair for one invocation.
pub struct OutcomeAuditPair {
    pub outcome: ToolInvocationOutcome,
    pub audit_entry: ToolAuditEntry,
}

/// Atomic insert result under the unique invocation terminal key.
pub enum OutcomeAuditInsertResult {
    /// Both outcome and audit were inserted in the current UoW.
    Inserted(OutcomeAuditPairRef),
    /// An exactly equal committed pair already exists.
    ExistingEqual(OutcomeAuditPairRef),
    /// A different terminal outcome or audit basis already owns the invocation key.
    TerminalConflict(ExistingOutcomeAuditPairRef),
}
```

The store has no independent `insert_outcome` or `insert_audit` method. Reads must never expose a half pair; detecting historical half data returns `RepositoryError::SerializationConflict` and opens an integrity path outside Query. Unique source-assessment key includes source ref, mapping revision and consumption basis; terminal key is `invocation_id`.

Stop review: outcome/audit atomicity is structurally enforced and terminal conflict has a typed zero-overwrite result; pass.

## 7. `ExternalSubmissionStore`

```rust
pub trait ExternalSubmissionStore: Send + Sync {
    fn get_eligibility<'a>(&'a self, eligibility_id: &'a SafeHandoffEligibilityId)
        -> PortFuture<'a, Result<Option<SafeHandoffEligibility>, RepositoryError>>;

    fn find_eligibility<'a>(&'a self, source_key: &'a SafeHandoffSourceKey, target: ExternalCollaborationClass)
        -> PortFuture<'a, Result<Option<SafeHandoffEligibility>, RepositoryError>>;

    fn get_material<'a>(&'a self, material_id: &'a SafeHandoffMaterialId)
        -> PortFuture<'a, Result<Option<SafeHandoffMaterial>, RepositoryError>>;

    fn find_material_for_eligibility<'a>(
        &'a self,
        eligibility_id: &'a SafeHandoffEligibilityId,
    ) -> PortFuture<'a, Result<Option<SafeHandoffMaterial>, RepositoryError>>;

    fn get_attempt<'a>(&'a self, attempt_id: &'a ExternalSubmissionAttemptId)
        -> PortFuture<'a, Result<Option<Loaded<ExternalSubmissionAttempt>>, RepositoryError>>;

    fn find_attempt_for_event<'a>(
        &'a self,
        material_id: &'a SafeHandoffMaterialId,
        event_id: &'a ToolEventId,
        target: ExternalCollaborationClass,
    ) -> PortFuture<'a, Result<Option<Loaded<ExternalSubmissionAttempt>>, RepositoryError>>;

    fn list_attempts<'a>(
        &'a self,
        scope: ExternalSubmissionAttemptScope,
        page: RepositoryPageRequest,
    ) -> PortFuture<'a, Result<RepositoryPage<Loaded<ExternalSubmissionAttempt>>, RepositoryError>>;

    fn get_latest_bus_status<'a>(&'a self, attempt_id: &'a ExternalSubmissionAttemptId)
        -> PortFuture<'a, Result<Option<BusDeliveryStatusRef>, RepositoryError>>;

    fn get_latest_observation_status<'a>(&'a self, attempt_id: &'a ExternalSubmissionAttemptId)
        -> PortFuture<'a, Result<Option<ObservationMaterialRef>, RepositoryError>>;

    fn append_eligibility<'a>(&'a self, value: SafeHandoffEligibility, uow: &'a dyn ToolsUnitOfWork)
        -> PortFuture<'a, Result<AppendResult<SafeHandoffEligibilityRef>, RepositoryError>>;

    fn append_material<'a>(&'a self, value: SafeHandoffMaterial, uow: &'a dyn ToolsUnitOfWork)
        -> PortFuture<'a, Result<AppendResult<SafeHandoffMaterialRef>, RepositoryError>>;

    fn create_attempt<'a>(&'a self, value: ExternalSubmissionAttempt, uow: &'a dyn ToolsUnitOfWork)
        -> PortFuture<'a, Result<Loaded<ExternalSubmissionAttempt>, RepositoryError>>;

    fn save_attempt<'a>(&'a self, value: ExternalSubmissionAttempt, expected_version: ExpectedVersion, uow: &'a dyn ToolsUnitOfWork)
        -> PortFuture<'a, Result<Loaded<ExternalSubmissionAttempt>, RepositoryError>>;

    fn append_bus_status<'a>(&'a self, value: BusDeliveryStatusRef, uow: &'a dyn ToolsUnitOfWork)
        -> PortFuture<'a, Result<AppendResult<BusDeliveryStatusRefId>, RepositoryError>>;

    fn append_observation_status<'a>(&'a self, value: ObservationMaterialRef, uow: &'a dyn ToolsUnitOfWork)
        -> PortFuture<'a, Result<AppendResult<ObservationMaterialRefId>, RepositoryError>>;
}
```

Eligibility uniqueness is `(closed source key, target, four-check input digest)`, where the source key is exactly one evolution fact, Binding fact/binding-scoped gap, outcome-audit pair, or general gap. Material uniqueness is eligibility plus safe-content digest. One semantic `(material, event ID, target)` has at most one attempt unless a future explicit retry contract introduces another attempt generation; current Commands/continuations return the existing prepared/terminal attempt and never issue a second Port call. Attempt state is local `Prepared -> one local terminal disposition`; its terminal local response may store only the safe external submission locator and route contract revision. External feedback appends separate refs and never mutates the attempt/source truth. Bus and Observability latest reads use authority consumption time and preserve conflicting refs as gaps rather than choosing by arrival time.

Stop review: material/attempt/feedback reads and local versioned transition are complete; submitted/delivered/observed remain separate; pass.

## 8. `ProjectionStore`

```rust
pub trait ProjectionStore: Send + Sync {
    fn append_reference_assessment<'a>(&'a self, value: ReferenceValidityAssessment, uow: &'a dyn ToolsUnitOfWork)
        -> PortFuture<'a, Result<AppendResult<ReferenceAssessmentRef>, RepositoryError>>;

    fn list_reference_assessments<'a>(
        &'a self,
        scope: ReferenceAssessmentScope,
        page: RepositoryPageRequest,
    ) -> PortFuture<'a, Result<RepositoryPage<ReferenceValidityAssessment>, RepositoryError>>;

    fn get_gap<'a>(&'a self, gap_id: &'a ConsistencyGapId)
        -> PortFuture<'a, Result<Option<Loaded<ConsistencyGap>>, RepositoryError>>;

    fn find_open_gap<'a>(&'a self, key: &'a ConsistencyGapKey)
        -> PortFuture<'a, Result<Option<Loaded<ConsistencyGap>>, RepositoryError>>;

    fn list_gaps<'a>(
        &'a self,
        scope: ConsistencyGapQueryScope,
        page: RepositoryPageRequest,
    ) -> PortFuture<'a, Result<RepositoryPage<Loaded<ConsistencyGap>>, RepositoryError>>;

    fn create_gap<'a>(&'a self, value: ConsistencyGap, uow: &'a dyn ToolsUnitOfWork)
        -> PortFuture<'a, Result<Loaded<ConsistencyGap>, RepositoryError>>;

    fn save_gap<'a>(&'a self, value: ConsistencyGap, expected_version: ExpectedVersion, uow: &'a dyn ToolsUnitOfWork)
        -> PortFuture<'a, Result<Loaded<ConsistencyGap>, RepositoryError>>;

    fn get_consistency_report<'a>(&'a self, key: &'a ReferenceConsistencyReportKey)
        -> PortFuture<'a, Result<ProjectionRead<ReferenceConsistencyReport>, RepositoryError>>;

    fn write_consistency_report<'a>(&'a self, value: ReferenceConsistencyReport, uow: &'a dyn ToolsUnitOfWork)
        -> PortFuture<'a, Result<ProjectionWriteResult, RepositoryError>>;

    fn get_search_projection<'a>(&'a self, tool_id: &'a ToolId)
        -> PortFuture<'a, Result<Option<ToolContractSearchProjection>, RepositoryError>>;

    fn search_tool_contracts<'a>(
        &'a self,
        scope: ToolContractSearchScope,
        page: RepositoryPageRequest,
    ) -> PortFuture<'a, Result<ProjectionPageRead<ToolContractSearchProjection>, RepositoryError>>;

    fn write_search_projection<'a>(&'a self, value: ToolContractSearchProjection, uow: &'a dyn ToolsUnitOfWork)
        -> PortFuture<'a, Result<ProjectionWriteResult, RepositoryError>>;

    fn get_diff_summary<'a>(&'a self, key: &'a ToolContractDiffKey)
        -> PortFuture<'a, Result<ProjectionRead<ToolContractDiffSummary>, RepositoryError>>;

    fn write_diff_summary<'a>(&'a self, value: ToolContractDiffSummary, uow: &'a dyn ToolsUnitOfWork)
        -> PortFuture<'a, Result<ProjectionWriteResult, RepositoryError>>;

    fn get_diagnostic_summary<'a>(&'a self, key: &'a ToolDiagnosticKey)
        -> PortFuture<'a, Result<ProjectionRead<ToolDiagnosticSummary>, RepositoryError>>;

    fn write_diagnostic_summary<'a>(&'a self, value: ToolDiagnosticSummary, uow: &'a dyn ToolsUnitOfWork)
        -> PortFuture<'a, Result<ProjectionWriteResult, RepositoryError>>;

    fn get_consumer_guidance<'a>(&'a self, key: &'a ToolConsumerGuidanceKey)
        -> PortFuture<'a, Result<ProjectionRead<ToolConsumerGuidanceView>, RepositoryError>>;

    fn write_consumer_guidance<'a>(&'a self, value: ToolConsumerGuidanceView, uow: &'a dyn ToolsUnitOfWork)
        -> PortFuture<'a, Result<ProjectionWriteResult, RepositoryError>>;

    fn list_projection_targets<'a>(
        &'a self,
        scope: ProjectionRebuildScope,
        page: RepositoryPageRequest,
    ) -> PortFuture<'a, Result<RepositoryPage<ProjectionTargetRef>, RepositoryError>>;

    fn mark_affected_stale<'a>(
        &'a self,
        source_ref: &'a LocalTruthRef,
        source_watermark: LocalTruthWatermark,
        page: RepositoryPageRequest,
        uow: &'a dyn ToolsUnitOfWork,
    ) -> PortFuture<'a, Result<RepositoryPage<ProjectionWriteResult>, RepositoryError>>;
}
```

`ConsistencyGapKey` is canonical `(scope, gap_class, sorted subject refs, basis class)` and prevents duplicate open gaps; different basis/content under the same key is a conflict. Projection lookup keys contain canonical subject/scope fields, the applicable schema version and `ProjectionWatermarkSelector`; an `Exact` selector binds that watermark, while `LatestCompleted` resolves a persisted latest-completed index and returns its resolved watermark in `ProjectionRead`/`ProjectionPageRead`. Guidance keys additionally use `Exact(revision)` or the persisted `BuiltCurrent` projection-key selector; `BuiltCurrent` never performs a live current-definition lookup. `Missing`, readable fresh/stale, rebuilding, unavailable and failed are structurally distinct; adapters cannot encode them as an empty row/page. `mark_affected_stale` uses an explicit reverse dependency index and an explicit scoped page request; it cannot scan external systems or mark source truth stale. A truth-changing Command processes exactly one configured-bounded first page in its UoW and returns/records a continuation gap when another page exists; maintenance Jobs may continue later pages. It never stretches one Command transaction across an unbounded scan.

Stop review: assessments, gap lifecycle, report/search/diff/diagnostic/guidance and stale propagation have paired complete read/write surfaces; D1 cannot become T1/T2 truth; pass.

## 9. Store group cross-audit

| Audit item | Result | Closure |
|---|---|---|
| Fixed store count | pass | Six named truth/attempt groups plus `ProjectionStore`; reference adapter is not a new trait. |
| Query DTO construction | pass | Each stable view has direct bundle/read methods; no external pull or adapter scan. |
| Query D1 surface | pass after Step 9 controlled correction | `ProjectionRead`/`ProjectionPageRead` distinguish empty from rebuilding/unavailable/failed and return the resolved watermark. |
| State matrix support | pass | Every mutable subject returns `Loaded<T>` and has exact save; immutable facts have named unique append. |
| Expected-version source | pass | Adapter-issued token only; create returns loaded token. |
| Atomic pair/family | pass | Outcome/audit has one indivisible method; other family writes share UoW. |
| Duplicate/late material | pass | `AppendResult`/unique keys distinguish equal/conflict; no arrival-time overwrite. |
| Projection freshness | pass | Source watermark, deterministic key, compare result and reverse stale propagation complete. |
| Backend neutrality | pass | No DB/table/index/serialization/broker product appears. |
