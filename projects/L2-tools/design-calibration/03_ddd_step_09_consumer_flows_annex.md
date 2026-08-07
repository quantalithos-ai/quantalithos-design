# L2-tools Step 9 函数流附录: 5 Inbound Consumer flows

> 状态: completed / pass
> 主文件: `03_ddd_step_09_function_flows.md`
> Public entry: `worker::InboundConsumerUseCases::consume`
> Protocol source: `03_ddd_step_08_consumer_protocols_annex.md`
> Blockers: `L2T-UP-001~006`; positive external bindings remain conditional/blocked.

## 1. Batch input and invariant

本批次将五个 Consumer 协议分别展开为可编码处理流。共同入口先执行
`InboundEventEnvelope<T>::validate_envelope(&SupportedContractVersions)`、trusted
source/actor binding、payload body-free 校验、canonical digest 和 scoped idempotency
replay precheck。所有 Consumer 都先提交一个只含技术 claim 的 phase-1 UoW，再执行
observational Port / bounded local read，最后以 phase-2 UoW 追加本地事实并完成 receipt；
这样同一 event 在并发 worker 中只有一个 active claim。phase-1 之后崩溃时，拥有相同 digest
的恢复者可以在 claim lease / recovery policy 允许时继续；观察性调用没有副作用，允许重新
读取，但不得在 claim 未完成时创建第二个 receipt。worker 不保存 source body，不确认 broker
ack/DLQ，也不直接访问 store。

Consumer idempotency scope 固定为：

```text
(consumer name, source authority ref, source event ID, deduplication key)
```

`received_at` 不进入 digest。已提交相同 digest 只回放原始 `ConsumerReceipt`；相同 key
不同 digest 是冲突；已 claimed 输入返回 `RetrySameInput`，不伪造 receipt。每条 flow 每次
只处理一个 bounded reverse-lookup page；有下一页时追加 `PropagationIncomplete` gap，后续
页由 Job 继续，不在 Consumer 内部循环。

`IF-03` 是唯一的 formal Command re-entry 例外：Consumer 先在 phase-1 UoW 提交 claim，再用
`InboundEventEnvelope::derive_integration_command_metadata(...)` 调用 `CF-11`。`CF-11`
拥有自己的 UoW 并提交/回放 outcome/audit；Consumer 随后用独立 UoW 保存 receipt 和
Consumer idempotency completion。不能把两个 application service 的 UoW 合并。普通
Consumer 的 phase-1 claim 只表示“此输入已被一个 worker 占用”，不表示 Port 已成功、Bus
已送达或 Observation 已产生。

## 2. Consumer batch table

| Flow | Protocol | Port mode | Local writes | External truth boundary | Status |
|---|---|---|---|---|---|
| `IF-01` | `ConsumeHubCapabilityChangeClue` | `HubControlledSourcePort::validate_change_clue` | snapshot, binding assessments, gaps, receipt | Hub only returns safe snapshot | pass |
| `IF-02` | `ConsumeAuthorizationResultChangeClue` | `AuthorizationConsumptionPort::validate_change_clue` | reference assessment/gap, receipt | Authorization owner remains blocked | pass |
| `IF-03` | `ConsumeSandboxExecutionSource` | `CF-11` exclusively calls source intake | source assessment, outcome/audit or gap, receipt | Sandbox source seam | pass |
| `IF-04` | `ConsumeBusDeliveryStatusFeedback` | `SafeEventCollaborationPort::resolve_bus_delivery(ValidateInbound)` | Bus status ref, gaps, receipt | Bus feedback conditional | pass |
| `IF-05` | `ConsumeObservationStatusFeedback` | `SafeEventCollaborationPort::resolve_observation(ValidateInbound)` | observation ref, gaps, receipt | Observability feedback conditional | pass |

## 3. Shared helper contracts used by every flow

```rust
/// Performs envelope and digest replay precheck without reserving or writing.
async fn begin_consumer_claim<T>(
    envelope: &InboundEventEnvelope<T>,
    consumer: ToolInboundConsumerName,
    metadata: &ConsumerMetadata,
    idempotency: &dyn IdempotencyStore,
) -> Result<ConsumerPrecheck, ProtocolError>;

/// Reserves and durably commits a Consumer phase-1 claim before observation/read work.
async fn reserve_consumer_claim_phase1(
    metadata: &ConsumerMetadata,
    idempotency: &dyn IdempotencyStore,
    uow_manager: &dyn ToolsUnitOfWorkManager,
) -> Result<ConsumerClaim, ProtocolError>;

/// Aborts a phase-1 claim only when no side-effecting external call was started.
async fn abort_consumer_claim_before_effect(
    claim: ConsumerClaim,
    reason: LocalAbortReason,
    idempotency: &dyn IdempotencyStore,
    uow_manager: &dyn ToolsUnitOfWorkManager,
) -> Result<(), ProtocolError>;

/// Applies typed local appends, builds the receipt from committed refs, and completes the claim.
async fn complete_consumer_effect_claim<T>(
    claim: ConsumerClaim,
    append_plan: ConsumerAppendPlan,
    consumer: ToolInboundConsumerName,
    envelope: &InboundEventEnvelope<T>,
    idempotency: &dyn IdempotencyStore,
    uow_manager: &dyn ToolsUnitOfWorkManager,
) -> Result<ConsumerReceipt, ProtocolError>;

/// Stores a prebuilt receipt and completes a claim after a formal Command re-entry.
async fn complete_consumer_receipt_claim(
    claim: ConsumerClaim,
    receipt: ConsumerReceipt,
    idempotency: &dyn IdempotencyStore,
    uow_manager: &dyn ToolsUnitOfWorkManager,
) -> Result<ConsumerReceipt, ProtocolError>;

/// Closed local append plan; every variant maps to one Step 7 store method.
pub enum ConsumerAppendOperation {
    HubSnapshot(HubControlledSnapshot),
    BindingAssessment(CapabilityBindingAssessment),
    ReferenceAssessment(ReferenceValidityAssessment),
    BusStatus(BusDeliveryStatusRef),
    ObservationStatus(ObservationMaterialRef),
    Gap(ConsistencyGap),
}

/// Maps one planned Consumer append to the only repository method allowed to execute it.
pub async fn execute_consumer_append(
    operation: ConsumerAppendOperation,
    stores: &ConsumerStoreBundle<'_>,
    uow: &dyn ToolsUnitOfWork,
) -> Result<LocalResultRefSet, ProtocolError>;

/// The stores and unit-of-work dependencies used by the ordered append executor.
pub struct ConsumerStoreBundle<'a> {
    pub binding_store: &'a dyn CapabilityBindingStore,
    pub handoff_store: &'a dyn ExecutionHandoffStore,
    pub projection_store: &'a dyn ProjectionStore,
    pub submission_store: &'a dyn ExternalSubmissionStore,
}

/// Ordered, bounded local writes committed with one Consumer receipt.
pub struct ConsumerAppendPlan {
    pub operations: Vec<ConsumerAppendOperation>,
}

impl ConsumerAppendPlan {
    /// Creates an empty plan; operation order is the deterministic flow order.
    fn new() -> Self;
    /// Adds one typed operation without executing it.
    fn push(&mut self, operation: ConsumerAppendOperation);
    /// Returns true when any planned gap has Blocking or IntegrityCritical impact.
    fn has_blocking_gap(&self) -> bool;
}

/// Builds the one closed receipt disposition for Consumer-owned effects.
fn receipt_for_effect(
    consumer: ToolInboundConsumerName,
    envelope: &InboundEventEnvelope<impl Sized>,
    result_refs: LocalResultRefSet,
    gap_refs: ConsistencyGapRefSet,
    has_blocking_gap: bool,
) -> Result<ConsumerReceipt, ProtocolError>;

/// Maps an already committed or exactly replayed CF-11 result to a receipt.
fn receipt_for_command_result(
    consumer: ToolInboundConsumerName,
    envelope: &InboundEventEnvelope<SandboxExecutionSourcePayload>,
    disposition: ConsumerDisposition,
    result_refs: LocalResultRefSet,
    gap_refs: ConsistencyGapRefSet,
) -> Result<ConsumerReceipt, ProtocolError>;

/// Converts a stored receipt into the exact public response without rescanning truth.
fn replay_consumer_receipt(
    stored: ConsumerReceipt,
    expected: &ConsumerReplayFrame,
) -> Result<ConsumerReceipt, ProtocolError>;

/// Maps an idempotency record read to the precheck result; no Port or write is performed.
fn classify_consumer_precheck(
    metadata: &ConsumerMetadata,
    existing: Option<Loaded<IdempotencyRecord>>,
) -> Result<ConsumerPrecheck, ProtocolError>;

/// Maps a Port resolution to an optional snapshot and an attributable gap.
fn map_hub_clue_resolution(
    snapshot_id: HubSnapshotId,
    gap_id: ConsistencyGapId,
    clue: &HubCapabilityChangeClueInput,
    resolution: Result<PortResolution<HubControlledSourceResolution>, PortCallError>,
    consumed_at: ConsumptionTime,
) -> Result<(Option<HubControlledSnapshot>, Option<ConsistencyGap>), ProtocolError>;

/// Maps an authorization clue resolution to one immutable reference assessment.
fn map_authorization_clue_resolution(
    assessment_id: ReferenceAssessmentId,
    clue: &AuthorizationResultChangeClueInput,
    resolution: Result<PortResolution<AuthorizationConsumptionResolution>, PortCallError>,
    consumed_at: ConsumptionTime,
) -> Result<ReferenceValidityAssessment, ProtocolError>;

/// Maps formal Bus feedback; `None` means gap-only and is never a successful status.
fn map_bus_feedback_resolution(
    status_id: BusDeliveryStatusRefId,
    gap_id: ConsistencyGapId,
    attempt: &ExternalSubmissionAttempt,
    candidate: &BusDeliveryInboundFeedbackCandidate,
    resolution: Result<PortResolution<BusDeliveryFeedbackSafeResolution>, PortCallError>,
    consumed_at: ConsumptionTime,
) -> Result<(Option<BusDeliveryStatusRef>, Option<ConsistencyGap>), ProtocolError>;

/// Maps formal Observation feedback; `None` means gap-only and is never an observed result.
fn map_observation_feedback_resolution(
    status_id: ObservationMaterialRefId,
    gap_id: ConsistencyGapId,
    attempt: &ExternalSubmissionAttempt,
    candidate: &ObservationInboundFeedbackCandidate,
    resolution: Result<PortResolution<ObservationFeedbackSafeResolution>, PortCallError>,
    consumed_at: ConsumptionTime,
) -> Result<(Option<ObservationMaterialRef>, Option<ConsistencyGap>), ProtocolError>;

/// Converts an ordered gap list to typed local append results.
async fn append_gaps(
    projection_store: &dyn ProjectionStore,
    gaps: Vec<ConsistencyGap>,
    uow: &dyn ToolsUnitOfWork,
) -> Result<ConsistencyGapRefSet, ProtocolError>;

/// Converts an optional immutable append result into a one-member local result-ref set.
fn optional_refs<T: Into<LocalResultRef>>(value: Option<AppendResult<T>>) -> LocalResultRefSet;

/// Closed local result reference used by Consumer receipts and replay checks.
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

/// Closed application result consumed by the Sandbox source Consumer before public mapping.
pub enum CommandUseCaseResult<T> {
    Committed(ToolCommandResponse<T>),
    CommittedError(StoredApplicationError, StoredCommandResultRef),
    Transient(ProtocolError),
}

/// Maps only a committed/replayed CF-11 value or committed safe error to Consumer refs.
fn map_cf11_result_to_consumer_receipt(
    envelope: &InboundEventEnvelope<SandboxExecutionSourcePayload>,
    result: CommandUseCaseResult<OutcomeAuditView>,
) -> Result<(ConsumerDisposition, LocalResultRefSet, ConsistencyGapRefSet), ProtocolError>;

/// Detects Bus status gaps from one formal ref; `None` is handled only by resolution gap.
fn gaps_for_external_status(
    status: Option<&BusDeliveryStatusRef>,
    attempt: &ExternalSubmissionAttempt,
    envelope: &InboundEventEnvelope<BusDeliveryStatusFeedbackPayload>,
) -> Result<Vec<ConsistencyGap>, ProtocolError>;

/// Detects Observation status gaps from one formal ref; never creates observed truth.
fn gaps_for_observation_status(
    status: Option<&ObservationMaterialRef>,
    attempt: &ExternalSubmissionAttempt,
    envelope: &InboundEventEnvelope<ObservationStatusFeedbackPayload>,
) -> Result<Vec<ConsistencyGap>, ProtocolError>;
```

`begin_consumer_claim` validates the envelope and calls only `IdempotencyStore::get`. It returns
`ConsumerPrecheck::Replay` for a committed equal-digest receipt, `ProtocolError::Conflict` for a
same-key different digest, `RetrySameInput` for an active equal-digest claim, or `Ready` for no
record. `reserve_consumer_claim_phase1` starts a local UoW, calls `IdempotencyStore::reserve`,
requires `Reserved(Loaded<IdempotencyRecord>)`, stages the `Claimed` state and commits before any
Port/read call; an `Existing` result is classified and the phase-1 UoW is rolled back. A phase-1
commit unknown is resolved by the same persistence authority and never followed by a Port call.

`complete_consumer_effect_claim` starts a new local UoW, reloads the exact claim using its
scope/key/digest, executes `ConsumerAppendPlan` in listed order (`append_snapshot`/`append_assessment`
or the corresponding `ExternalSubmissionStore`/`ProjectionStore` method), appends gaps through
`ProjectionStore::create_gap`, maps the returned refs through `receipt_for_effect`, stores that
receipt, calls `IdempotencyRecord::commit_consumer_receipt(...)` with the same commit candidate, and
commits. `complete_consumer_receipt_claim` performs the same final receipt/idempotency sequence with
no new domain append after `CF-11`. Both accept `AppendResult::ExistingEqual` only after canonical
equality and source-event attribution; `Conflict` is an integrity error. If no side-effecting
external call has started, a failed read/Port may call `abort_consumer_claim_before_effect`; after an
external call or a Command re-entry, the claim is not silently aborted. Neither helper acknowledges
a broker or persists source body.

`execute_consumer_append` has this closed operation-to-store mapping; no generic dispatcher or
string-selected repository method is permitted:

| Operation | Exact store method | Returned `LocalResultRef` | Conflict handling |
|---|---|---|---|
| `HubSnapshot(value)` | `CapabilityBindingStore::append_snapshot(value, uow)` | `HubSnapshotRef` | `ExistingEqual` only after canonical source equality; `Conflict` is integrity failure |
| `BindingAssessment(value)` | `CapabilityBindingStore::append_assessment(value, uow)` | `BindingAssessmentRef` | Same equality rule; never updates `CapabilityBinding` |
| `ReferenceAssessment(value)` | `ProjectionStore::append_reference_assessment(value, uow)` | `ReferenceAssessmentRef` | Different basis under the same unique key is integrity failure |
| `BusStatus(value)` | `ExternalSubmissionStore::append_bus_status(value, uow)` | `BusDeliveryStatusRefId` | Existing equal is replayable; conflict opens integrity path |
| `ObservationStatus(value)` | `ExternalSubmissionStore::append_observation_status(value, uow)` | `ObservationMaterialRefId` | Existing equal is replayable; conflict opens integrity path |
| `Gap(value)` | `ProjectionStore::create_gap(value, uow)` | `ConsistencyGapRef` | Existing open gap must be canonical-equal; otherwise conflict |

`ConsumerAppendPlan` is built before phase 2 and cannot contain an operation outside this table.
The executor returns refs in plan order; the receipt mapper verifies each ref is attributable to
the current consumer/source event. A plan containing only gaps maps to
`ConsumerReceipt::gap_recorded`, never to a fixed `Accepted` disposition.

`CommandUseCaseResult<T>` is the application-internal closed union `Committed(ToolCommandResponse<T>)`,
`CommittedError(StoredApplicationError, StoredCommandResultRef)` or `Transient(ProtocolError)`.
The API maps it to the public `Result`; `IF-03` consumes it before that mapping so only a committed
value/error can become a receipt. A transient result keeps the Consumer claim incomplete and returns
`RetrySameInput`; it cannot be converted to a quarantined or gap receipt.

`receipt_for_effect` calls `ConsumerReceipt::accepted(...)` only when `has_blocking_gap == false`
and all required result refs are present; otherwise it calls `ConsumerReceipt::gap_recorded(...)`
with the exact gap refs. A gap-only branch therefore never uses a fixed Accepted receipt. The mapper
rejects `has_blocking_gap == false` with an empty effect set and rejects any ref not attributable to
the current envelope/consumer. `optional_refs` maps `Appended` and `ExistingEqual` identically after
the equality check and maps `None`/no status to an empty set; it never converts a `Conflict` into a
status ref.

## 4. `IF-01 ConsumeHubCapabilityChangeClue`

### 4.1 Entry, target and source closure

| Item | Contract |
|---|---|
| Entry | `InboundConsumerUseCases::consume_hub_capability_change(InboundEventEnvelope<HubCapabilityChangeCluePayload>)` |
| Target | one body-free Hub change clue and the locally known bindings for its exact Hub identity |
| Result | `ConsumerReceipt` with snapshot/assessment/gap refs; relation remains unchanged |
| Port | `HubControlledSourcePort::validate_change_clue(&HubCapabilityChangeClueInput)` outside UoW |
| Reverse lookup | `CapabilityBindingStore::list_bindings_by_hub_capability(HubCapabilityBindingLookupScope, RepositoryPageRequest)` |
| Owner objects | `HubControlledSnapshot`, `CapabilityBindingAssessment`, `ConsistencyGap` |

### 4.2 ASCII call graph

```text
[worker::consume]
  | validate envelope + trusted Hub source + digest
  v
[phase-1 UoW: IdempotencyStore::reserve -> commit]
  |
  v
[HubCapabilityChangeClueInput::from_validated_envelope]
  | call HubControlledSourcePort::validate_change_clue (read/call)
  v
[HubControlledSnapshot::from_port or attributable gap]
  | local page read by exact Hub identity when snapshot exists
  v
[CapabilityBindingAssessment::assess]
  | phase-2 UoW: append facts + receipt + claim completion
  v
[IdempotencyStore::commit_consumer_receipt]
```

### 4.3 Typed pseudocode

```rust
let consumer = ToolInboundConsumerName::ConsumeHubCapabilityChangeClue;
let metadata = ConsumerMetadata::from_envelope(&envelope, consumer)?;
match begin_consumer_claim(&envelope, consumer, &metadata, idempotency).await? {
    ConsumerPrecheck::Replay(receipt) => return Ok(receipt),
    ConsumerPrecheck::Ready(_) => {}
}
let claim = reserve_consumer_claim_phase1(&metadata, idempotency, uow_manager).await?;
let clue = HubCapabilityChangeClueInput::from_validated_envelope(
    &envelope, &envelope.payload,
)?;
let resolution = hub_source.validate_change_clue(&clue).await;
let now = clock.now()?.as_consumption_time();
let (snapshot, resolution_gap) = map_hub_clue_resolution(
    ids.new_hub_snapshot_id()?, ids.new_gap_id()?, &clue, resolution, now,
)?;
let mut gaps = Vec::new();
if let Some(gap) = resolution_gap {
    gaps.push(gap);
}
let mut append_plan = ConsumerAppendPlan::new();
if let Some(snapshot) = snapshot {
    let scope = HubCapabilityBindingLookupScope {
        authority_ref: snapshot.authority_ref.clone(),
        capability_id: snapshot.capability_ref.capability_id.clone(),
        locator_digest: Some(ExternalLocatorDigest::from_normalized(&snapshot.capability_ref.locator)?),
        include_terminal: false,
    };
    let page_request = first_consumer_reverse_page(
        scope.filter_digest(), configured_binding_page_limit(),
    )?;
    let page = binding_store.list_bindings_by_hub_capability(scope.clone(), page_request).await?;
    append_plan.push(ConsumerAppendOperation::HubSnapshot(snapshot.clone()));
    for binding in page.items.iter() {
        let assessment = CapabilityBindingAssessment::assess(
            &binding.value, Some(&snapshot), now,
        )?;
        if assessment.requires_gap() {
            gaps.push(ConsistencyGap::detect(
                ids.new_gap_id()?, ConsistencyGapScope::CapabilityBinding,
                GapSubjectRefSet::for_binding(&binding.value, &snapshot),
                require_some(assessment.gap_class())?, GapImpactClass::Degraded,
                assessment.basis_refs(), clock.now()?.as_detection_time(),
            )?);
        }
        append_plan.push(ConsumerAppendOperation::BindingAssessment(assessment));
    }
    if page.next_cursor.is_some() {
        gaps.push(ConsistencyGap::detect_propagation_incomplete(
            ids.new_gap_id()?, TypedSubjectRef::ReferenceInspection(
                ReferenceInspectionScopeDigest::for_hub_capability_clue(&scope),
            ),
            page.next_cursor.clone()?, now,
        )?);
    }
} else if gaps.is_empty() {
    abort_consumer_claim_before_effect(
        claim, LocalAbortReason::UnattributableExternalResolution, idempotency, uow_manager,
    ).await?;
    return Err(ProtocolError::blocked_without_subject(metadata.correlation_ref));
}
for gap in gaps { append_plan.push(ConsumerAppendOperation::Gap(gap)); }
complete_consumer_effect_claim(
    claim, append_plan, consumer, &envelope, idempotency, uow_manager,
).await
```

`HubCapabilityChangeCluePayload` is never copied into a registry object. An `Available` Port result
must echo authority, capability identity, revision and safe summary before `HubControlledSnapshot`
can be built. A blocked/unavailable/unverifiable result cannot create a snapshot or lookup scope;
when the clue identity is attributable it creates only a typed gap, otherwise the flow returns a
blocked/unavailable error with no receipt. A `Withdrawn` clue does not invalidate or replace a
Binding. The page cursor is opaque and scoped to the exact lookup digest; no second page is fetched
in this call.

### 4.4 Errors, state and side effects

| Concern | Exact behavior |
|---|---|
| Envelope | Missing/unsupported -> `Rejected`; untrusted authority/order/body -> `Quarantined`; same-key digest conflict -> conflict, zero target writes. |
| Port | `Unavailable`/timeout returns dependency retry hint before any UoW; blocked/stale/conflict resolution may commit typed gap/assessment only when the clue is attributable. |
| Store | Missing local bindings is a valid zero-item page; page/read failure rolls back all local facts. |
| State | Snapshot is immutable; each assessment is a new point-in-time fact; Binding state and invocation anchors never change. |
| Side effects | One safe Port call, bounded local snapshot/assessment/gap appends, one receipt and idempotency completion; no event, broker ack, external registry write or Runtime action. |

### 4.5 Test cuts and stop review

| Cut | Expected |
|---|---|
| valid bound, explicit-unbound excluded, terminal history excluded | snapshot and applicable assessments only |
| valid clue with no local matching bindings | accepted snapshot with no relation mutation |
| Hub resolution blocked/stale/conflicting/unverifiable | typed assessment/gap; never explicit-unbound |
| page has continuation | one `PropagationIncomplete` gap; no second page call |
| duplicate same digest / different digest / in-flight | exact replay / conflict / retry-same-input |
| append or commit failure | complete rollback or commit-unknown recovery; no partial receipt |

Stop review: DTO, Port, reverse lookup, object factories, bounded page, UoW, error/state and tests are closed; `IF-01` pass.

## 5. `IF-02 ConsumeAuthorizationResultChangeClue`

### 5.1 Entry, target and source closure

| Item | Contract |
|---|---|
| Entry | `InboundConsumerUseCases::consume_authorization_result_change(InboundEventEnvelope<AuthorizationResultChangeCluePayload>)` |
| Target | one typed external result/subject/revision clue; no decision body and no prior assessment mutation |
| Result | `Accepted` only when a formal assessment/gap is appended; under open owner contract normally `GapRecorded` |
| Port | `AuthorizationConsumptionPort::validate_change_clue(&AuthorizationResultChangeClueInput)` outside UoW |
| Reverse lookup | `ExecutionHandoffStore::list_authorization_assessments_by_result(AuthorizationAssessmentLookupScope, RepositoryPageRequest)` |
| Owner objects | `ReferenceValidityAssessment`, `ConsistencyGap` |

### 5.2 ASCII call graph

```text
[worker::consume]
  | envelope/source/digest gate + phase-1 claim commit
  v
[AuthorizationResultChangeClueInput::from_validated_envelope]
  | call AuthorizationConsumptionPort::validate_change_clue
  v
[ReferenceValidityAssessment::assess_*]
  | optional bounded local reverse lookup for impact clues
  v
[phase-2 UoW: append assessment + gap + receipt/claim completion]
```

### 5.3 Typed pseudocode

```rust
let consumer = ToolInboundConsumerName::ConsumeAuthorizationResultChangeClue;
let metadata = ConsumerMetadata::from_envelope(&envelope, consumer)?;
match begin_consumer_claim(&envelope, consumer, &metadata, idempotency).await? {
    ConsumerPrecheck::Replay(receipt) => return Ok(receipt),
    ConsumerPrecheck::Ready(_) => {}
}
let claim = reserve_consumer_claim_phase1(&metadata, idempotency, uow_manager).await?;
let clue = AuthorizationResultChangeClueInput::from_validated_envelope(
    &envelope, &envelope.payload,
)?;
let resolution = authorization.validate_change_clue(&clue).await;
let now = clock.now()?.as_consumption_time();
let scope = AuthorizationAssessmentLookupScope {
    external_result_id: clue.external_result_id.clone(),
    subject_ref: clue.subject_ref.clone(),
};
let subject = TypedSubjectRef::ReferenceInspection(
    ReferenceInspectionScopeDigest::for_authorization_change(
        &scope.external_result_id, &scope.subject_ref,
    ),
);
let assessment = ReferenceValidityAssessment::for_authorization_change(
    ids.new_reference_assessment_id()?, subject.clone(), &clue, resolution, now,
)?;
let page_request = first_consumer_reverse_page(
    scope.filter_digest(), configured_authorization_page_limit(),
)?;
let page = handoff_store.list_authorization_assessments_by_result(
    scope, page_request,
).await?;
let mut gaps = Vec::new();
if assessment.requires_gap() {
    gaps.push(ConsistencyGap::detect(
        ids.new_gap_id()?, ConsistencyGapScope::ReferenceIntegrity,
        GapSubjectRefSet::for_external_result(&clue), require_some(assessment.gap_class())?,
        GapImpactClass::Blocking, assessment.basis_refs(), clock.now()?.as_detection_time(),
    )?);
}
if page.next_cursor.is_some() {
    gaps.push(ConsistencyGap::detect_propagation_incomplete(
        ids.new_gap_id()?, subject.clone(), page.next_cursor.clone()?, now,
    )?);
}
let mut append_plan = ConsumerAppendPlan::new();
append_plan.push(ConsumerAppendOperation::ReferenceAssessment(assessment));
for gap in gaps { append_plan.push(ConsumerAppendOperation::Gap(gap)); }
complete_consumer_effect_claim(
    claim, append_plan, consumer, &envelope, idempotency, uow_manager,
).await
```

The local reverse lookup is informational and bounded: it identifies affected invocations but does
not rewrite their immutable authorization assessments. Under `L2T-UP-001~002`, a blocked Port
resolution becomes a typed `Unverifiable`/`Missing` assessment and gap; no allow/deny is inferred.

### 5.4 Errors, state and side effects

| Concern | Exact behavior |
|---|---|
| Invalid/quarantined envelope | Reject/quarantine before Port or store effect. |
| Owner unavailable/blocked | `GapRecorded` only if typed identity is safe; otherwise dependency error with no receipt. |
| Matching prior assessments | Read-only bounded page; no mutation or replacement. Continuation is represented by gap. |
| State | `ReferenceValidityAssessment` immutable; `AuthorizationConsumptionAssessment` immutable and untouched. |
| Side effects | At most one Port call, one assessment/gap UoW, one receipt; no policy evaluation, outcome, invocation or external owner write. |

### 5.5 Test cuts and stop review

| Cut | Expected |
|---|---|
| complete typed clue with formal owner available | valid assessment/ref only; no decision mutation |
| owner contract blocked/unavailable | gap or typed unavailable, fail closed |
| result/subject mismatch or forbidden body | quarantine/reject, zero target write |
| reverse lookup continuation | one `PropagationIncomplete` gap, one page only |
| duplicate/conflict/in-flight | exact replay/conflict/retry |
| rollback/commit unknown | no partial receipt; same-authority resolution |

Stop review: `IF-02` pass.

## 6. `IF-03 ConsumeSandboxExecutionSource`

### 6.1 Entry, target and phase boundary

| Item | Contract |
|---|---|
| Entry | `InboundConsumerUseCases::consume_sandbox_execution_source(InboundEventEnvelope<SandboxExecutionSourcePayload>)` |
| Target | validated source candidate re-entering `CF-11 AcceptExecutionSource` |
| Result | receipt refs point to exact stored Command result/error and any gap refs |
| External Port owner | `CF-11` alone calls `ExecutionSourceIntakePort::map_source` |
| UoW | Consumer claim UoW; independent `CF-11` UoW; final Consumer receipt UoW |

### 6.2 ASCII call graph

```text
[worker::consume]
  | validate envelope + phase-1 Consumer claim commit
  v
[InboundEventEnvelope::derive_integration_command_metadata]
  | call ToolCommandUseCases::accept_execution_source (CF-11)
  | CF-11 calls ExecutionSourceIntakePort and commits/replays outcome/audit
  v
[Consumer result mapper]
  | tx: store receipt + complete Consumer idempotency
  v
[worker receipt]
```

### 6.3 Typed pseudocode

```rust
let consumer = ToolInboundConsumerName::ConsumeSandboxExecutionSource;
let metadata = ConsumerMetadata::from_envelope(&envelope, consumer)?;
match begin_consumer_claim(&envelope, consumer, &metadata, idempotency).await? {
    ConsumerPrecheck::Replay(receipt) => return Ok(receipt),
    ConsumerPrecheck::Ready(_) => {}
}
let claim = reserve_consumer_claim_phase1(&metadata, idempotency, uow_manager).await?;
let command_metadata = envelope.derive_integration_command_metadata(
    consumer, ToolCommandName::AcceptExecutionSource,
)?;
let request = AcceptExecutionSourceRequest::from_consumer_payload(
    envelope.payload.clone(), command_metadata.correlation_ref,
)?;
let command_result = command_use_cases.accept_execution_source(request, command_metadata).await;
let (disposition, result_refs, gap_refs) = map_cf11_result_to_consumer_receipt(
    &envelope, command_result,
)?;
let receipt = receipt_for_command_result(
    consumer, &envelope, disposition, result_refs, gap_refs,
)?;
complete_consumer_receipt_claim(claim, receipt, idempotency, uow_manager).await
```

If the process fails after `CF-11` commits but before the receipt UoW commits, re-entry sees the
same Consumer claim and derives byte-identical Command metadata. `CF-11` returns its exact stored
typed result without calling the Sandbox Port again; the Consumer then completes the receipt. If
`CF-11` returns a transient unavailable error before committing a result, the Consumer claim stays
incomplete and returns `RetrySameInput`; it never stores an optimistic receipt. If `CF-11` reports
terminal conflict, the Consumer stores a quarantined/gap receipt only when the conflict refs are
committed by `CF-11`; otherwise it returns the error without fabricating refs.

### 6.4 Errors, state and side effects

| Concern | Exact behavior |
|---|---|
| Envelope | Missing/unsupported/unsafe source fields reject or quarantine before Command entry. |
| Command | Mapping blocked/conflicting/missing commits CF-11 assessment/gap/error; accepted source commits exactly one outcome/audit pair. |
| Replay | Same derived key/digest replays CF-11; no second source Port call or outcome. |
| State | Source assessment immutable; outcome/audit indivisible; Consumer idempotency moves Claimed -> Committed only after receipt commit. |
| Side effects | One formal Command invocation, at most one source Port call owned by CF-11, local receipt UoW; no broker ack/DLQ/run/capture truth. |

### 6.5 Test cuts and stop review

| Cut | Expected |
|---|---|
| four accepted semantic input variants | matching terminal outcome/audit and accepted receipt |
| mapping blocked/conflict/missing | CF-11 typed assessment/gap/error; no outcome on conservative path |
| crash between CF-11 and receipt commit | deterministic CF-11 replay, one final receipt |
| same envelope duplicate/digest conflict/in-flight | replay/conflict/retry |
| CF-11 side-effect unknown | no blind retry, no fabricated receipt/outcome |
| direct CF-11 vs IF-03 parity | identical Command result for same derived semantic frame |

Stop review: `IF-03` pass; its two-UoW exception is explicitly recorded in Step 8 and Step 13 handoff.

## 7. `IF-04 ConsumeBusDeliveryStatusFeedback`

### 7.1 Entry and target

| Item | Contract |
|---|---|
| Entry | `InboundConsumerUseCases::consume_bus_delivery_feedback(InboundEventEnvelope<BusDeliveryStatusFeedbackPayload>)` |
| Target | one append-only `BusDeliveryStatusRef` plus applicable gap; attempt/outcome/audit immutable |
| Port | `SafeEventCollaborationPort::resolve_bus_delivery(BusDeliveryFeedbackRequest::ValidateInbound(...))` outside UoW |
| Store | `ExternalSubmissionStore::get_attempt`, `append_bus_status`; `ProjectionStore::create_gap` |

### 7.2 ASCII call graph

```text
[worker::consume]
  | envelope/source/digest gate + phase-1 claim commit
  v
[BusDeliveryInboundFeedbackCandidate]
  | call SafeEventCollaborationPort::resolve_bus_delivery(ValidateInbound)
  v
[BusDeliveryStatusRef::from_feedback]
  | tx: append status + gap + receipt/claim
  v
[ConsumerReceipt]
```

### 7.3 Typed pseudocode

```rust
let consumer = ToolInboundConsumerName::ConsumeBusDeliveryStatusFeedback;
let metadata = ConsumerMetadata::from_envelope(&envelope, consumer)?;
match begin_consumer_claim(&envelope, consumer, &metadata, idempotency).await? {
    ConsumerPrecheck::Replay(receipt) => return Ok(receipt),
    ConsumerPrecheck::Ready(_) => {}
}
let claim = reserve_consumer_claim_phase1(&metadata, idempotency, uow_manager).await?;
let attempt = require_some(submission_store.get_attempt(
    &envelope.payload.submission_attempt_id,
).await?);
ensure_attempt_feedback_identity(&attempt.value, &envelope.payload)?;
let candidate = BusDeliveryInboundFeedbackCandidate::from_envelope(&envelope)?;
let resolution = collaboration.resolve_bus_delivery(
    &BusDeliveryFeedbackRequest::ValidateInbound(candidate),
).await;
let (status, resolution_gap) = map_bus_feedback_resolution(
    ids.new_bus_delivery_status_ref_id()?, ids.new_gap_id()?, &attempt.value, &candidate, resolution,
    clock.now()?.as_consumption_time(),
)?;
let mut gaps = gaps_for_external_status(status.as_ref(), &attempt.value, &envelope)?;
if let Some(gap) = resolution_gap { gaps.push(gap); }
let mut append_plan = ConsumerAppendPlan::new();
if let Some(status) = status { append_plan.push(ConsumerAppendOperation::BusStatus(status)); }
for gap in gaps { append_plan.push(ConsumerAppendOperation::Gap(gap)); }
complete_consumer_effect_claim(
    claim, append_plan, consumer, &envelope, idempotency, uow_manager,
).await
```

Inbound payload locator is a candidate; the Port must prove Bus authority, attempt identity,
correlation and feedback revision. No local `SubmittedLocally` state is upgraded. If the formal
feedback binding is disabled (`L2T-UP-004`), no `BusAuthorityRef` is fabricated: the flow appends
only an attributable `RouteBlocked`/`Unverifiable` gap, or returns a blocked error without a
receipt when attribution is insufficient.

### 7.4 Errors, state and side effects

| Concern | Exact behavior |
|---|---|
| Unknown attempt | `NotFound`/quarantine according to anti-enumeration policy; no external call. |
| Candidate mismatch | conflict/quarantine; no status append. |
| Port blocked/unavailable | typed gap if safely attributable; otherwise rollback and dependency error. |
| State | status ref is immutable; attempt, outcome and audit are never saved. |
| Side effects | one feedback Port call, one local status/gap/receipt UoW; no Bus polling loop or broker operation. |

### 7.5 Test cuts and stop review

| Cut | Expected |
|---|---|
| referenced/unknown/stale/conflicting/unverifiable result | corresponding status ref; never `Delivered` |
| attempt locator/correlation mismatch | quarantine/conflict, zero status write |
| route contract blocked | typed blocked gap or safe blocked error |
| duplicate/conflict/in-flight | replay/conflict/retry |
| append/commit failure | rollback or same-authority commit resolution |

Stop review: `IF-04` pass.

## 8. `IF-05 ConsumeObservationStatusFeedback`

### 8.1 Entry and target

| Item | Contract |
|---|---|
| Entry | `InboundConsumerUseCases::consume_observation_feedback(InboundEventEnvelope<ObservationStatusFeedbackPayload>)` |
| Target | one append-only `ObservationMaterialRef` plus applicable gap; no observation body or audit mutation |
| Port | `SafeEventCollaborationPort::resolve_observation(ObservationFeedbackRequest::ValidateInbound(...))` outside UoW |
| Store | `ExternalSubmissionStore::get_attempt`, `append_observation_status`; `ProjectionStore::create_gap` |

### 8.2 ASCII call graph

```text
[worker::consume]
  | envelope/source/digest gate + phase-1 claim commit
  v
[ObservationInboundFeedbackCandidate]
  | call SafeEventCollaborationPort::resolve_observation(ValidateInbound)
  v
[ObservationMaterialRef::from_formal_source|route_blocked]
  | tx: append observation ref + gap + receipt/claim
  v
[ConsumerReceipt]
```

### 8.3 Typed pseudocode

```rust
let consumer = ToolInboundConsumerName::ConsumeObservationStatusFeedback;
let metadata = ConsumerMetadata::from_envelope(&envelope, consumer)?;
match begin_consumer_claim(&envelope, consumer, &metadata, idempotency).await? {
    ConsumerPrecheck::Replay(receipt) => return Ok(receipt),
    ConsumerPrecheck::Ready(_) => {}
}
let claim = reserve_consumer_claim_phase1(&metadata, idempotency, uow_manager).await?;
let attempt = require_some(submission_store.get_attempt(
    &envelope.payload.submission_attempt_id,
).await?);
ensure_attempt_feedback_identity(&attempt.value, &envelope.payload)?;
let candidate = ObservationInboundFeedbackCandidate::from_envelope(&envelope)?;
let resolution = collaboration.resolve_observation(
    &ObservationFeedbackRequest::ValidateInbound(candidate),
).await;
let (status, resolution_gap) = map_observation_feedback_resolution(
    ids.new_observation_material_ref_id()?, ids.new_gap_id()?, &attempt.value, &candidate, resolution,
    clock.now()?.as_consumption_time(),
)?;
let mut gaps = gaps_for_observation_status(status.as_ref(), &attempt.value, &envelope)?;
if let Some(gap) = resolution_gap { gaps.push(gap); }
let mut append_plan = ConsumerAppendPlan::new();
if let Some(status) = status { append_plan.push(ConsumerAppendOperation::ObservationStatus(status)); }
for gap in gaps { append_plan.push(ConsumerAppendOperation::Gap(gap)); }
complete_consumer_effect_claim(
    claim, append_plan, consumer, &envelope, idempotency, uow_manager,
).await
```

`ObservationMaterialRef` can retain only formal authority, status-safe summary and optional typed
material ref. It cannot contain store locator, retention, evidence, alert or observed-result body.
Under `L2T-UP-005~006`, production remains blocked; no authority-bearing ref is created without a
formal resolution, and the blocked path records only an attributable local gap.

### 8.4 Errors, state and side effects

| Concern | Exact behavior |
|---|---|
| Unknown attempt | safe not-found/quarantine; no feedback call. |
| Source/route/correlation mismatch | conflict/quarantine, no append. |
| Port blocked/unavailable | typed route/source gap when attributable; otherwise rollback/error. |
| State | observation ref immutable and independent from local attempt/outcome/audit. |
| Side effects | one feedback Port call, one local ref/gap/receipt UoW; no observation store/retention/alert or Runtime recovery. |

### 8.5 Test cuts and stop review

| Cut | Expected |
|---|---|
| route blocked/unknown/referenced/stale/conflicting/unverifiable | exact status state, no `ObservedSuccess` inference |
| locator/material symmetry mismatch | quarantine/conflict, zero write |
| duplicate/conflict/in-flight | replay/conflict/retry |
| append/commit failure | rollback or commit resolution |
| feedback binding disabled | no positive external readiness claim |

Stop review: `IF-05` pass.

## 9. Consumer family cross-audit

| Audit item | Result | Closure |
|---|---|---|
| Five protocol-to-flow mappings | pass | `IF-01~05` each independent |
| Envelope and source actor authority | pass | worker gate; no payload override |
| DTO -> Port/object/store construction | pass | all fields have envelope, payload, Port, local store or clock source |
| Reverse lookup boundedness | pass | one page per Consumer; continuation gap, Job-only continuation |
| Core write boundary | pass | clues/feedback append facts only; source re-enters `CF-11` |
| UoW and commit-unknown | pass | local effects plus receipt atomic; `IF-03` explicit two-stage exception |
| Idempotency/replay | pass | stored typed receipt and deterministic Command replay; no blind rerun |
| External lifecycle boundary | pass | no ack/DLQ/run/delivery/observation/readiness truth |
| Blockers | pass | `L2T-UP-001~006` remain open; no provider/readiness fabricated |

Consumer Batch 3 gate: **pass**. Next allowed action is Step 9 Batch 4 `OF-01~04`; formal `03-详细设计.md` remains write-closed.
