# L2-tools Step 7 模块附录: application-owned external Port contracts

> 状态: completed / pass
> 主文件: `03_ddd_step_07_trait_port_adapter_contracts.md`
> 固定规模: 7 named external ports
> Blockers: `L2T-UP-001~009`
> 作用: 固定 caller、implementer、request/result/error、authority/source/correlation guard 与 conservative behavior；不声明任何 provider、mapping、route、client 或 readiness 已存在。

## 1. Shared external-call discipline

| Rule | Exact contract |
|---|---|
| Caller ownership | Application owns every trait and validates local inputs before the call. `InvocationCallerPort` is the one inbound exception implemented by application. |
| Result shape | Expected availability uses `PortResolution<T>`; malformed/timeout/adapter failures use `PortCallError`. |
| Body boundary | Request/result carriers contain typed refs, safe summaries, closed classes and revisions only. Raw request/result/provider/capture/evidence/secret bytes are unrepresentable. |
| Authority | An adapter cannot substitute configured endpoint identity for a formal source authority/ref. Missing authority is `Blocked`/`Unverifiable`. |
| Time | External time is a referenced source field only. Application captures `ClockPort` consumption time for all L2 assessment objects. |
| Retry | A Port performs one logical call. It does not retry unless a later Step 12/13 contract explicitly assigns a bounded call policy; default is no hidden retry. |
| Fake | Fake emits the same typed outcomes and validation failures. It proves L2 behavior only, never integration availability. |

## 2. `SharedContractAuthorityPort`

### 2.1 Capability / request / response

| Item | Contract |
|---|---|
| Caller | Contract establishment/formalization, integrity Job, implementation preflight |
| Implementer | Infra adapter over the configured Core compile-authority inventory; deterministic fake |
| Request | Contract family + Core authority candidate + required semantic capability + optional expected revision |
| Response | `SharedContractAuthorityRef` candidate/resolution input; no copied Core schema |
| Blocker | `L2T-UP-007~008` |

```rust
/// Requests resolution of one shared-contract family against the formal Core authority.
pub struct SharedContractAuthorityRequest {
    pub contract_family: SharedContractFamily,
    pub core_authority_candidate: CoreSharedContractAuthorityRef,
    pub required_capability: SharedContractCapability,
    pub expected_revision: Option<ExternalRevisionRef>,
}

/// Resolves a compile-authority reference without manufacturing a package or type.
pub trait SharedContractAuthorityPort: Send + Sync {
    fn resolve<'a>(
        &'a self,
        request: &'a SharedContractAuthorityRequest,
    ) -> PortFuture<'a, Result<PortResolution<SharedContractAuthorityResolution>, PortCallError>>;
}

pub struct SharedContractAuthorityResolution {
    pub core_authority_ref: CoreSharedContractAuthorityRef,
    pub contract_family: SharedContractFamily,
    pub package_or_type_ref: Option<CorePackageOrTypeRef>,
    pub authority_revision: Option<ExternalRevisionRef>,
    pub compatibility: SharedContractCompatibility,
}
```

Application maps a verified compatible resolution to `SharedContractAuthorityRef::Resolved`; a real package candidate without a verified Tools schema maps to `CandidateOnly`. Workspace path/file discovery alone cannot produce `Available(compatible)` or a frozen revision.

Stop review: exact request/result/authority and candidate-only behavior are complete; no Core package/type/revision is invented; pass.

## 3. `HubControlledSourcePort`

```rust
/// Requests a body-free Hub-controlled capability snapshot for one binding consumption.
pub struct HubControlledSourceRequest {
    pub tool_id: ToolId,
    pub authority_candidate: HubAuthorityCandidateRef,
    pub capability_id: ExternalCapabilityId,
    pub capability_revision: ExternalRevisionRef,
    pub locator: ExternalLocatorSummary,
    pub required_source_revision: Option<ExternalRevisionRef>,
    pub consumption_purpose: HubConsumptionPurpose,
    pub correlation_ref: CorrelationRef,
}

pub struct HubControlledSourceResolution {
    pub authority_ref: HubAuthorityRef,
    pub capability_ref: HubCapabilityRef,
    pub source_revision: ExternalRevisionRef,
    pub safe_summary: HubCapabilitySafeSummary,
    pub source_freshness: ExternalSourceFreshness,
}

/// Body-free Hub change clue passed only after the common inbound envelope gate.
pub struct HubCapabilityChangeClueInput {
    pub source_event_id: SourceEventId,
    pub source_authority_ref: SourceAuthorityRef,
    pub contract_version: ToolProtocolSchemaVersion,
    pub correlation_ref: CorrelationRef,
    pub capability_ref: HubCapabilityRefSummary,
    pub previous_revision: Option<ExternalRevisionRef>,
    pub current_revision: ExternalRevisionRef,
    pub change_class: HubCapabilityChangeClass,
    pub safe_summary: HubCapabilitySafeSummary,
}

/// Resolves controlled Hub material without replicating registry truth.
pub trait HubControlledSourcePort: Send + Sync {
    fn resolve_snapshot<'a>(
        &'a self,
        request: &'a HubControlledSourceRequest,
    ) -> PortFuture<'a, Result<PortResolution<HubControlledSourceResolution>, PortCallError>>;

    fn validate_change_clue<'a>(
        &'a self,
        clue: &'a HubCapabilityChangeClueInput,
    ) -> PortFuture<'a, Result<PortResolution<HubControlledSourceResolution>, PortCallError>>;
}
```

For declaration/replacement, application maps `HubCapabilityCandidateInput` directly to `HubControlledSourceRequest`; it cannot construct `HubCapabilityRef` before the Port has resolved the formal authority. An `Available` resolution must echo the candidate capability identity/revision/locator under a verified `HubAuthorityRef`; application then calls `HubCapabilityRef::resolve(...)`. `HubCapabilityChangeClueInput::from_validated_envelope(...)` copies only the named envelope identity/authority/version/correlation and body-free payload fields; source actor, ordering and forbidden-body checks have already passed and cannot be overridden here. It is not a registry entry. Both methods require exact candidate/result or existing-ref/result symmetry. `Unavailable`, stale, conflict or unverifiable resolution forms an assessment/gap and never converts a relation to explicit-unbound or valid.

Stop review: synchronous resolution and async clue validation share one source contract; neither writes Binding or copies Hub truth; pass.

## 4. `InvocationCallerPort`

This is the canonical inbound application port. Runtime, management callers and direct integration adapters call one surface; L2 does not implement a caller-specific contract or an SDK client.

```rust
/// Canonical inbound application surface for one formal tool invocation request.
pub trait InvocationCallerPort: Send + Sync {
    fn submit<'a>(
        &'a self,
        request: SubmitToolInvocationRequest,
        metadata: CommandMetadata,
    ) -> PortFuture<'a, Result<SubmitToolInvocationResult, ApplicationError>>;
}
```

`SubmitToolInvocationRequest` and result receive exact schemas in Step 8. The fixed semantic frame is tool selector, formal invocation intent and typed context refs; prompt, conversation, Runtime plan/loop/checkpoint and carrier-specific body are forbidden. Application `invocation_service` implements this trait and delegates to the same `ToolCommandUseCases::submit_tool_invocation`; infra does not implement it. API may expose the same application method but cannot create an alternate invocation meaning. `L2T-UP-009` means no existing SDK wrapper/client can be claimed.

Stop review: one inbound semantic seam, one application implementation and one Step 8 protocol mapping are fixed; no client/readiness claim; pass.

## 5. `AuthorizationConsumptionPort`

```rust
/// Invocation-bound request for a formal external authorization result.
pub struct AuthorizationConsumptionRequest {
    pub invocation_id: ToolInvocationId,
    pub tool_id: ToolId,
    pub definition_revision: DefinitionRevision,
    pub actor_ref: ActorRef,
    pub requirement_ref: ExecutionRequirementRef,
    pub authorization_class: AuthorizationRequirementClass,
    pub selector: AuthorizationResultSelector,
    pub constraint_capabilities: AuthorizationConstraintCapabilitySet,
    pub correlation_ref: CorrelationRef,
}

pub struct AuthorizationConsumptionResolution {
    pub authority_ref: AuthorizationAuthorityRef,
    pub external_result_id: ExternalAuthorizationResultId,
    pub subject_ref: ExternalAuthorizationSubjectRef,
    pub result_revision: ExternalRevisionRef,
    pub decision: AuthorizationDecisionSafeSummary,
    pub typed_constraints: AuthorizationConstraintSet,
}

/// Body-free authorization-result change clue after the common inbound gate.
pub struct AuthorizationResultChangeClueInput {
    pub source_event_id: SourceEventId,
    pub source_authority_ref: SourceAuthorityRef,
    pub contract_version: ToolProtocolSchemaVersion,
    pub correlation_ref: CorrelationRef,
    pub external_result_id: ExternalAuthorizationResultId,
    pub subject_ref: ExternalAuthorizationSubjectRef,
    pub result_revision: ExternalRevisionRef,
    pub change_class: AuthorizationResultChangeClass,
    pub safe_change_summary: AuthorizationResultChangeSafeSummary,
}

/// Consumes a formal result; it never evaluates policy or creates a decision.
pub trait AuthorizationConsumptionPort: Send + Sync {
    fn consume_result<'a>(
        &'a self,
        request: &'a AuthorizationConsumptionRequest,
    ) -> PortFuture<'a, Result<PortResolution<AuthorizationConsumptionResolution>, PortCallError>>;

    fn validate_change_clue<'a>(
        &'a self,
        clue: &'a AuthorizationResultChangeClueInput,
    ) -> PortFuture<'a, Result<PortResolution<AuthorizationConsumptionResolution>, PortCallError>>;
}
```

`selector` is a locator choice (`ResolveCurrentForInvocation` or exact external result ID), never an allow/deny input. `AuthorizationResultChangeClueInput::from_validated_envelope(...)` preserves the source event, authority, protocol version and correlation together with the exact external result/subject/revision clue; it contains no decision, policy or evidence body. Positive resolution is conditional on closure of owner/source/schema/freshness (`L2T-UP-001~002`). Until then, the production binding must return `Blocked(AuthorizationContractOpen)`; a fake may return typed allow/constrained/deny only for local negative/branch tests. The sync method is the execution-precondition authority path. Async clues only append validity assessment/gap and never replace the sync result or mutate an earlier assessment.

Stop review: invocation/actor/tool/revision/requirement/constraint inputs and safe output are exact; no policy/evidence body or self-authorization exists; pass.

## 6. `SandboxExecutionPort`

### 6.1 Readiness and handoff carriers

```rust
pub struct SandboxReadinessRequest {
    pub invocation_id: ToolInvocationId,
    pub requirement_ref: ExecutionRequirementRef,
    pub required_carrier: ExecutionCarrierRequirement,
    pub isolation_class: IsolationRequirementClass,
    pub correlation_ref: CorrelationRef,
}

pub struct SandboxReadinessResolution {
    pub authority_ref: SandboxAuthorityRef,
    pub carrier_class: ExecutionCarrierClass,
    pub mapping_revision: ExternalRevisionRef,
    pub safe_summary: SandboxReadinessSafeSummary,
}

pub struct SandboxExecutionHandoffRequest {
    pub handoff_id: ExecutionHandoffId,
    pub invocation_id: ToolInvocationId,
    pub requirement_ref: ExecutionRequirementRef,
    pub canonical_execution_summary: CanonicalExecutionSafeSummary,
    pub correlation_ref: CorrelationRef,
    pub mapping_revision: ExternalRevisionRef,
}

pub struct SandboxExecutionHandoffLocalResponse {
    pub local_disposition: ExecutionPortLocalDisposition,
    pub source_locator_candidate: Option<ExternalSandboxExecutionRef>,
    pub response_contract_revision: ExternalRevisionRef,
    pub safe_response_summary: ExecutionPortSafeResponse,
}
```

```rust
/// Checks a formal carrier mapping and performs one local execution-seam handoff call.
pub trait SandboxExecutionPort: Send + Sync {
    fn resolve_readiness<'a>(
        &'a self,
        request: &'a SandboxReadinessRequest,
    ) -> PortFuture<'a, Result<PortResolution<SandboxReadinessResolution>, PortCallError>>;

    fn submit_handoff<'a>(
        &'a self,
        request: &'a SandboxExecutionHandoffRequest,
    ) -> PortFuture<'a, Result<PortResolution<SandboxExecutionHandoffLocalResponse>, PortCallError>>;
}
```

`ExecutionPortLocalDisposition` variants are `CallAcceptedLocally`, `CallRejectedLocally`, `CarrierUnavailable`, `MappingBlocked`; `CallAcceptedLocally` means only that the local adapter call returned a valid response. There are no run/accepted/running/completed/capture/receipt/retry/DLQ/cleanup fields or states. When mapping/receipt contracts are open (`L2T-UP-003~004`), production returns `Blocked`; host/direct fallback is forbidden.

Stop review: readiness and local call are separate, exact mapping revision is carried, and external execution lifecycle cannot enter L2; pass.

## 7. `ExecutionSourceIntakePort`

```rust
/// Body-free source candidate received from the formal Sandbox source seam.
pub struct ExecutionSourceIntakeRequest {
    pub source_event_id: SourceEventId,
    pub source_authority_ref: SourceAuthorityRef,
    pub contract_version: ToolProtocolSchemaVersion,
    pub invocation_id: ToolInvocationId,
    pub handoff_correlation_ref: CorrelationRef,
    pub external_execution_ref: ExternalSandboxExecutionRef,
    pub source_class: ExecutionSourceClass,
    pub source_revision: ExternalRevisionRef,
    pub safe_summary: ExecutionSourceCandidateSafeSummary,
}

pub struct ExecutionSourceIntakeResolution {
    pub sandbox_authority_ref: SandboxAuthorityRef,
    pub external_execution_ref: ExternalSandboxExecutionRef,
    pub source_class: ExecutionSourceClass,
    pub mapping_revision: ExternalRevisionRef,
    pub normalized_safe_summary: ExecutionSourceSafeSummary,
}

/// Validates and maps one delivered source candidate without establishing outcome truth.
pub trait ExecutionSourceIntakePort: Send + Sync {
    fn map_source<'a>(
        &'a self,
        request: &'a ExecutionSourceIntakeRequest,
    ) -> PortFuture<'a, Result<PortResolution<ExecutionSourceIntakeResolution>, PortCallError>>;
}
```

The worker validates the common envelope before this call. The adapter then validates formal Sandbox authority, invocation/handoff correlation, contract/source/mapping revision, source class and forbidden-body rules. `Available` only permits application to build `SandboxExecutionSourceRef` and `ExecutionSourceAssessment`; application must still call the formal `AcceptExecutionSource` Command flow to establish an outcome/audit pair. Delivery or locator presence never means accepted source.

Stop review: envelope/ref/mapping/safe-summary fields and formal re-entry are exact; positive mapping remains blocked until `L2T-UP-003~004` closes; pass.

## 8. `SafeEventCollaborationPort`

### 8.1 Submission and feedback carriers

```rust
pub struct SafeEventSubmissionRequest {
    pub material_ref: SafeHandoffMaterialRef,
    pub target_class: ExternalCollaborationClass,
    pub event: ToolSemanticEventEnvelope,
}

pub struct SafeEventSubmissionLocalResponse {
    pub local_disposition: SafeEventLocalDisposition,
    pub external_submission_locator: Option<ExternalSubmissionLocator>,
    pub route_contract_revision: Option<ExternalRevisionRef>,
}

/// Stored local attempt inputs used by the bounded refresh Job.
pub struct StoredBusDeliveryResolutionRequest {
    pub submission_attempt_id: ExternalSubmissionAttemptId,
    pub target_class: ExternalCollaborationClass,
    pub external_submission_locator: Option<ExternalSubmissionLocator>,
    pub route_contract_revision: Option<ExternalRevisionRef>,
    pub correlation_ref: CorrelationRef,
}

/// Untrusted body-free Bus feedback candidate after envelope validation.
pub struct BusDeliveryInboundFeedbackCandidate {
    pub source_event_id: SourceEventId,
    pub source_authority_ref: SourceAuthorityRef,
    pub contract_version: ToolProtocolSchemaVersion,
    pub correlation_ref: CorrelationRef,
    pub submission_attempt_id: ExternalSubmissionAttemptId,
    pub external_submission_locator: ExternalSubmissionLocator,
    pub external_delivery_ref: Option<ExternalBusDeliveryRef>,
    pub delivery_status: BusDeliverySafeStatus,
    pub feedback_revision: ExternalRevisionRef,
}

/// Closed Bus feedback mode; active resolution and inbound validation cannot be confused.
pub enum BusDeliveryFeedbackRequest {
    ResolveStored(StoredBusDeliveryResolutionRequest),
    ValidateInbound(BusDeliveryInboundFeedbackCandidate),
}

/// Formal body-free Bus feedback resolution used to construct one local status ref.
pub struct BusDeliveryFeedbackSafeResolution {
    pub bus_authority_ref: BusAuthorityRef,
    pub submission_attempt_id: ExternalSubmissionAttemptId,
    pub external_submission_locator: ExternalSubmissionLocator,
    pub external_delivery_ref: Option<ExternalBusDeliveryRef>,
    pub status: ExternalStatusState,
    pub status_safe_summary: Option<BusDeliverySafeSummary>,
    pub feedback_revision: ExternalRevisionRef,
}

/// Stored local attempt inputs used by the bounded observation refresh Job.
pub struct StoredObservationResolutionRequest {
    pub submission_attempt_id: ExternalSubmissionAttemptId,
    pub target_class: ExternalCollaborationClass,
    pub external_submission_locator: Option<ExternalSubmissionLocator>,
    pub route_contract_revision: Option<ExternalRevisionRef>,
    pub correlation_ref: CorrelationRef,
}

/// Untrusted body-free observation feedback candidate after envelope validation.
pub struct ObservationInboundFeedbackCandidate {
    pub source_event_id: SourceEventId,
    pub source_authority_ref: SourceAuthorityRef,
    pub contract_version: ToolProtocolSchemaVersion,
    pub correlation_ref: CorrelationRef,
    pub submission_attempt_id: ExternalSubmissionAttemptId,
    pub external_submission_locator: Option<ExternalSubmissionLocator>,
    pub external_material_ref: Option<ExternalObservationMaterialRef>,
    pub observation_status: ObservationSafeStatus,
    pub source_revision: ExternalRevisionRef,
    pub route_revision: ExternalRevisionRef,
}

/// Closed observation feedback mode; active resolution and inbound validation cannot be confused.
pub enum ObservationFeedbackRequest {
    ResolveStored(StoredObservationResolutionRequest),
    ValidateInbound(ObservationInboundFeedbackCandidate),
}

/// Formal body-free observation resolution used to construct one local material ref.
pub struct ObservationFeedbackSafeResolution {
    pub observation_authority_ref: ObservationAuthorityRef,
    pub submission_attempt_id: ExternalSubmissionAttemptId,
    pub external_submission_locator: Option<ExternalSubmissionLocator>,
    pub external_material_ref: Option<ExternalObservationMaterialRef>,
    pub status: ObservationStatusState,
    pub observation_safe_summary: Option<ObservationStatusSafeSummary>,
    pub source_revision: ExternalRevisionRef,
    pub route_revision: ExternalRevisionRef,
}
```

```rust
/// Submits immutable safe material and optionally resolves formal external status refs.
pub trait SafeEventCollaborationPort: Send + Sync {
    fn submit<'a>(
        &'a self,
        request: &'a SafeEventSubmissionRequest,
    ) -> PortFuture<'a, Result<PortResolution<SafeEventSubmissionLocalResponse>, PortCallError>>;

    fn resolve_bus_delivery<'a>(
        &'a self,
        request: &'a BusDeliveryFeedbackRequest,
    ) -> PortFuture<'a, Result<PortResolution<BusDeliveryFeedbackSafeResolution>, PortCallError>>;

    fn resolve_observation<'a>(
        &'a self,
        request: &'a ObservationFeedbackRequest,
    ) -> PortFuture<'a, Result<PortResolution<ObservationFeedbackSafeResolution>, PortCallError>>;
}
```

`ToolSemanticEventEnvelope` is the Step 8 closed union of the four exact event envelopes. Application constructs it from the immutable material and validates `material_ref`, source refs, event ID/name/schema and target before calling the Port; adapter never interprets a generic summary into an event. `SafeEventLocalDisposition` variants are `SubmittedLocally`, `LocallyRejected`, `RouteBlocked`; none means delivered. `ResolveStored` is legal only for `JF-04` and must match the stored attempt locator/revision; `ValidateInbound` is legal only for `IF-04/05` and treats every payload field as a candidate until the Port returns the formal authority-bound resolution. Bus resolution contains formal Bus authority/delivery ref/status-safe summary/contract revision; Observability resolution contains formal observation authority/material ref/status-safe summary/source+route revision. These types are different and cannot substitute for each other. No method owns publish retry, DLQ, replay, observation storage, retention or alerting. Current production bindings may only return route/source `Blocked` for affected paths (`L2T-UP-004~006`).

Stop review: truth-first safe submission and two independent optional feedback families are exact; local submitted cannot become delivered/observed; pass.

## 9. Caller / implementer / error / blocker audit

| Port | Caller complete | Implementer complete | Request/result complete | Failure/blocker complete | Result |
|---|---|---|---|---|---|
| Shared authority | yes | Core inventory adapter/fake | yes | candidate/missing/conflict/unverifiable | pass |
| Hub source | yes | Hub adapter/fake | yes | unavailable/stale/conflict/unverifiable | pass |
| Invocation caller | yes | application facade | Step 8 exact DTO handoff | ApplicationError; SDK excluded | pass |
| Authorization | yes | blocked/formal adapter/fake | yes | owner/source/schema/freshness blocked | pass |
| Sandbox | yes | blocked/formal adapter/fake | yes, two operations | mapping/receipt/carrier blocked | pass |
| Source intake | yes | blocked/formal adapter/fake | yes | mapping/source/forbidden-body blocked | pass |
| Event collaboration | yes | blocked Bus/Obs adapter/fake | yes, submit + two feedback operations | route/source/feedback blocked | pass |

No external Port returns a framework/client/backend type, owns an external lifecycle or is a sibling Cargo dependency. Seven named ports remain exactly seven.
