# L2-tools Step 6 模块附录: Outcome、审计与安全交接对象契约

> 状态: completed / pass
> 主文件: `03_ddd_step_06_object_contracts.md`
> Authority: 正式 `02-概要设计.md` §6.6 / §12.2.5
> Blockers: `L2T-UP-003~006`
> 作用: 补齐十个对象的 exact fields、callables、状态与停审；坚持 local outcome / audit first。

## 1. Capability 到对象

| Capability | Owner object | Non-negotiable invariant |
|---|---|---|
| 判断 source 可归因 / 可映射 | `ExecutionSourceAssessment` | Delivery or capture existence is not semantic acceptance |
| 建立消费者可见唯一终态 | `ToolInvocationOutcome` | Exactly one immutable terminal outcome per invocation |
| 解释终态依据 | `ToolAuditEntry` | Same local UoW as outcome; append-only, body-free |
| 定位 Sandbox material | `SandboxExecutionSourceRef` | No run/capture/failure body or lifecycle ownership |
| 引用 Bus status | `BusDeliveryStatusRef` | Submitted locally is not delivered |
| 引用 observation material/status | `ObservationMaterialRef` | Audit is not observation; route currently blocked |
| 判断安全外发资格 | `SafeHandoffEligibility` | Four checks are a conjunction and target-specific |
| 固化安全材料 | `SafeHandoffMaterial` | Immutable, minimal, body-free, redacted, correlated |
| 记录本地外发尝试 | `ExternalSubmissionAttempt` | Post-truth fact; no rollback of outcome/audit |
| 稳定读取分层状态 | `OutcomeAuditView` | External refs do not become local terminal state |

## 2. `ExecutionSourceAssessment`

| Field | Type | Required source / guard |
|---|---|---|
| `assessment_id` | `ExecutionSourceAssessmentId` | `IdGeneratorPort` |
| `invocation_id` | `ToolInvocationId` | Envelope / source ref; must match local invocation |
| `source_ref` | `Option<SandboxExecutionSourceRef>` | Present only when a formal Sandbox source ref can be constructed; absent for missing/unverifiable candidate source |
| `source_class` | `ExecutionSourceClass` | Formal source mapping candidate |
| `state` | `ExecutionSourceAssessmentState` | Authority, correlation, version, source-class and mapping validation |
| `safe_summary` | `Option<ExecutionSourceSafeSummary>` | Accepted body-free source mapper only |
| `basis_refs` | `ExecutionSourceBasisRefSet` | Handoff / attempt / source / mapping refs |
| `consumed_at` | `ConsumptionTime` | Application clock |

| Factory / callable | Preconditions | Result / effect |
|---|---|---|
| `accept(...)` | Formal authority, exact invocation/handoff correlation, supported version and closed mapping | `Accepted`; source ref and safe summary required |
| `reject(...)` | Source formally attributable but not acceptable for the invocation | `Rejected`; no outcome |
| `missing(...)` | Required source ref absent | `Missing`; gap candidate |
| `conflicting(...)` | Authority, invocation, handoff, class or revision conflict | `Conflicting`; gap candidate |
| `mapping_blocked(...)` | Source locatable but mapping contract absent / unsupported | `MappingBlocked`; gap candidate |
| `unverifiable(...)` | Cannot prove formal authority or source version | `Unverifiable`; gap candidate |
| `permits_outcome_normalization()` | none | True only for `Accepted` |

| Variant | English rustdoc | Allowed destination |
|---|---|---|
| `Accepted` | `/// The source is attributable, correlated and mapped under a formal contract.` | none; later material creates another assessment |
| `Rejected` | `/// The source is attributable but cannot be accepted for this invocation.` | none |
| `Missing` | `/// The required execution source reference is absent.` | none |
| `Conflicting` | `/// Authority, invocation, handoff, class or revision inputs conflict.` | none |
| `MappingBlocked` | `/// The source can be located but its tool-semantic mapping is not closed.` | none |
| `Unverifiable` | `/// The source cannot be proven to come from the formal execution boundary.` | none |

Accepted requires a resolved formal source ref; `Rejected` may retain an attributable ref, while Missing/Conflicting/MappingBlocked/Unverifiable may retain one only when the candidate was safely attributable. No conservative factory invents a `SandboxAuthorityRef`. Stop review: all conservative states are immutable, open a typed gap and never form a guessed outcome; pass after Step 9 source-ref correction.

## 3. `ToolInvocationOutcome`

| Field | Type | Required source / symmetry |
|---|---|---|
| `outcome_id` | `ToolInvocationOutcomeId` | ID generator before UoW |
| `invocation_id` | `ToolInvocationId` | Local invocation; unique terminal index key |
| `outcome_class` | `ToolOutcomeClass` | Accepted source mapping or pre-execution no-execution branch |
| `result_summary` | `Option<ToolResultSafeSummary>` | Required only for `Succeeded`; forbidden for all failure classes |
| `error_summary` | `Option<ToolErrorSafeSummary>` | Required for tool/execution/capture failure and no-execution; forbidden for success |
| `basis_ref` | `OutcomeBasisRef` | Accepted source assessment, admission rejection, authorization denial or blocked precondition |
| `recorded_at` | `OutcomeTime` | Application clock |

| Factory | Preconditions | Outcome |
|---|---|---|
| `succeeded(...)` | Accepted source and normalized body-free result | `Succeeded` with result only |
| `tool_failed(...)` | Accepted source proves tool semantic failure | `ToolFailed` with safe error |
| `execution_failed(...)` | Accepted source maps formal execution failure | `ExecutionFailed` with safe error |
| `capture_failed(...)` | Accepted source maps formal capture failure | `CaptureFailed` with safe error |
| `no_execution_rejected(...)` | Admission rejection or formal authorization deny before execution | `NoExecutionRejected` |
| `no_execution_unavailable(...)` | Required source, mapping, carrier or precondition unavailable before execution | `NoExecutionUnavailable` |
| `matches_invocation(ToolInvocationId)` | none | Exact identity guard |

| Variant | English rustdoc | Terminal | Required payload |
|---|---|---:|---|
| `Succeeded` | `/// The tool completed with a normalized body-free result.` | yes | result summary |
| `ToolFailed` | `/// The execution completed but the tool reported a semantic failure.` | yes | tool error summary |
| `ExecutionFailed` | `/// The formal execution carrier failed before a tool result was produced.` | yes | execution error summary |
| `CaptureFailed` | `/// The formal carrier could not produce acceptable result material.` | yes | capture error summary |
| `NoExecutionRejected` | `/// A formal pre-execution decision rejected execution.` | yes | rejection summary and decision basis |
| `NoExecutionUnavailable` | `/// A required precondition or carrier was unavailable, so execution did not occur.` | yes | unavailable summary and gap basis |

Repository uniqueness on `invocation_id` plus UoW serialization rejects a second outcome. A duplicate with the same canonical digest replays the stored result; different late material creates `ConsistencyGap::TerminalConflict` and never overwrites outcome.

Stop review: result/error symmetry, terminal uniqueness and no-execution distinction exact; pass.

## 4. `ToolAuditEntry`

| Field | Type | Source / guard |
|---|---|---|
| `audit_entry_id` | `ToolAuditEntryId` | ID generator |
| `tool_id` | `ToolId` | Invocation anchor |
| `invocation_id` | `ToolInvocationId` | Invocation |
| `contract_anchor_ref` | `InvocationContractAnchorRef` | Invocation repository |
| `judgment_refs` | `ToolJudgmentRefSet` | Admission, requirement, authorization assessment and handoff refs that apply |
| `outcome_id` | `ToolInvocationOutcomeId` | Outcome created in same UoW |
| `source_refs` | `AllowedSourceRefSet` | Typed body-free refs only |
| `known_gap_refs` | `ConsistencyGapRefSet` | Gaps known when audit is recorded |
| `actor_ref` | `ActorRef` | Original Command / trusted source context |
| `correlation_ref` | `CorrelationRef` | Invocation context |
| `recorded_at` | `AuditTime` | Same application clock frame as outcome |

| Callable | Contract |
|---|---|
| `record(...) -> Result<Self, DomainError>` | Tool/invocation/outcome/correlation symmetry; every required judgment present; no forbidden body |
| `explains_outcome(&ToolInvocationOutcome)` | Outcome ID and basis refs fully match |
| `has_known_gap(&ConsistencyGapRef)` | Exact membership |
| `is_body_free()` / `is_correlated()` | Construction invariants |

Audit entry is append-only. It is not log output, Bus history, Observability material or Runtime checkpoint. Outcome and audit must be saved atomically; an outcome-only visible state is forbidden.

Stop review: local audit truth has exact source fields and atomic boundary; pass.

## 5. `SandboxExecutionSourceRef`

| Field | Type | Required source / guard |
|---|---|---|
| `source_ref_id` | `SandboxExecutionSourceRefId` | ID generator |
| `authority_ref` | `SandboxAuthorityRef` | Formal source adapter; blocker-aware |
| `external_execution_ref` | `ExternalSandboxExecutionRef` | External locator only |
| `handoff_correlation_ref` | `CorrelationRef` | Local handoff / invocation correlation |
| `source_class` | `ExecutionSourceClass` | Formal source class mapping candidate |
| `source_revision` | `ExternalRevisionRef` | Envelope / source contract version |
| `resolution_state` | `ExternalReferenceState` | Authority / locator / mapping validation |

Callables: `from_sandbox(...) -> Result<Self, PortContractError>`; `mapping_blocked(...) -> Self`; `matches_handoff(&CorrelationRef) -> bool`; `is_from_authority(&SandboxAuthorityRef) -> bool`; `supports_assessment() -> bool`. There are no bytes, stdout, stderr, capture body, provider response, run status, receipt, cleanup or retry fields.

Stop review: logical source ref exists without fabricating `L2T-UP-003~004` mapping / receipt; pass.

## 6. `BusDeliveryStatusRef`

| Field | Type | Source / guard |
|---|---|---|
| `delivery_status_ref_id` | `BusDeliveryStatusRefId` | ID generator |
| `bus_authority_ref` | `BusAuthorityRef` | Conditional formal feedback source |
| `submission_attempt_id` | `ExternalSubmissionAttemptId` | Local attempt |
| `external_delivery_ref` | `Option<ExternalBusDeliveryRef>` | Feedback; absent for unknown |
| `status_safe_summary` | `Option<BusDeliverySafeSummary>` | Feedback body-free mapper |
| `status` | `ExternalStatusState` | Validation result |
| `consumed_at` | `ConsumptionTime` | Clock |

| Variant | English rustdoc | Local meaning |
|---|---|---|
| `Unknown` | `/// No formal delivery feedback is available for this local submission.` | Do not infer failure/success |
| `Referenced` | `/// A formal external delivery reference is associated with the local submission.` | Still does not make L2 owner of delivery |
| `Stale` | `/// The consumed delivery summary may no longer be current.` | External status gap |
| `Conflicting` | `/// Attempt, authority or delivery reference inputs conflict.` | External status gap |
| `Unverifiable` | `/// Delivery feedback cannot be attributed to the formal Bus boundary.` | External status gap |

Factories `from_feedback(...)` and `unknown(...)` enforce attempt symmetry. `has_verified_delivery_ref()` is true only for referenced state with a ref. No local function changes outcome or submission state.

Stop review: local submitted and external delivered remain independent; pass.

## 7. `ObservationMaterialRef`

| Field | Type | Source / guard |
|---|---|---|
| `observation_ref_id` | `ObservationMaterialRefId` | ID generator |
| `observation_authority_ref` | `ObservationAuthorityRef` | Formal source if/when closed |
| `submission_attempt_id` | `ExternalSubmissionAttemptId` | Local attempt |
| `external_material_ref` | `Option<ExternalObservationMaterialRef>` | Formal feedback; absent while blocked/unknown |
| `observation_safe_summary` | `Option<ObservationStatusSafeSummary>` | Body-free mapper |
| `status` | `ObservationStatusState` | Route/source validation |
| `consumed_at` | `ConsumptionTime` | Clock |

| Variant | English rustdoc | Local meaning |
|---|---|---|
| `RouteBlocked` | `/// The producer, source or route contract is not formally closed.` | Current conservative default |
| `Unknown` | `/// A route may exist, but no verifiable observation status is available.` | No inference |
| `Referenced` | `/// A formal external observation material reference is available.` | Does not replace Tool audit |
| `Stale` | `/// The consumed observation summary may no longer be current.` | Gap / degraded read |
| `Conflicting` | `/// Attempt, authority or material inputs conflict.` | Gap |
| `Unverifiable` | `/// The material cannot be attributed to a formal observation source.` | Gap |

Factories `from_formal_source`, `route_blocked`, and `unknown` preserve blocker state. No store, retention, evidence body or `ObservedSuccess` variant exists.

Stop review: `L2T-UP-005~006` remains visible and observation cannot drive Runtime recovery; pass.

## 8. `SafeHandoffEligibility`

| Field | Type | Required source / symmetry |
|---|---|---|
| `eligibility_id` | `SafeHandoffEligibilityId` | ID generator |
| `source` | `SafeHandoffSourceRefs` | Exact committed evolution fact, Binding fact/binding gap, outcome-audit pair, or general gap selected by the Command |
| `fact_class` | `SafeMaterialClass` | Closed source-to-event class mapping; cannot be caller-overridden |
| `target_class` | `ExternalCollaborationClass` | Command target closed enum; no route |
| `minimal_necessary_check` | `SafetyCheckResult` | Domain safe material policy |
| `body_free_check` | `SafetyCheckResult` | Domain forbidden-body scan over typed source summary |
| `redaction_check` | `SafetyCheckResult` | Redaction policy and sensitivity context |
| `correlation_check` | `SafetyCheckResult` | Typed correlation set validation |
| `state` | `SafeHandoffEligibilityState` | Conjunction result |

| Variant | English rustdoc | Material creation |
|---|---|---|
| `Eligible` | `/// All four target-specific safety checks passed.` | Allowed |
| `Ineligible` | `/// At least one target-specific safety check failed.` | Forbidden |
| `Unverifiable` | `/// One or more required safety checks cannot be proven.` | Forbidden / fail closed |

`SafeHandoffSourceRefs` variants are `ContractChange(EvolutionFactRef)`, `BindingFormalChange(BindingChangeFactRef)`, `BindingConsistencyGap(ConsistencyGapRef, CapabilityBindingId)`, `OutcomeAudit(ToolInvocationOutcomeId, ToolAuditEntryId)`, and `ConsistencyGap(ConsistencyGapRef)`. `evaluate(...) -> Result<Self, DomainError>` requires the exact committed source read set and target-specific sensitivity context. The Binding gap branch proves binding subject symmetry and maps to `BindingChange`; the general gap branch maps to `ConsistencyGap`. `all_checks_pass`, `permits_material_preparation`, `failed_checks`, `matches_target`, and `source_key()` are pure. Encryption and test profiles do not bypass any check.

Stop review: four-gate conjunction and all four event-source classes are exact and non-configurable; pass after Step 9 source-coverage correction.

## 9. `SafeHandoffMaterial`

| Field | Type | Required source / guard |
|---|---|---|
| `material_id` | `SafeHandoffMaterialId` | ID generator |
| `eligibility_id` | `SafeHandoffEligibilityId` | Eligible assessment |
| `target_class` | `ExternalCollaborationClass` | Must equal eligibility target |
| `fact_class` | `SafeMaterialClass` | Committed source truth class |
| `safe_summary` | `BodyFreeFactSummary` | Domain safe mapper after four gates |
| `correlation_refs` | `SafeCorrelationRefSet` | Typed minimal correlation refs |
| `source_truth_refs` | `LocalTruthRefSet` | Committed local fact/outcome/audit/gap refs |
| `prepared_at` | `MaterialPreparationTime` | Clock |

`prepare(...) -> Result<Self, DomainError>` is the only factory. `is_body_free`, `is_correlated`, `is_for_target`, `matches_eligibility` are construction invariants. Material is immutable and is not the final wire event payload / topic schema; Step 8 maps it to a logical event candidate.

Stop review: no raw result, audit, evidence, secret or external body; pass.

## 10. `ExternalSubmissionAttempt`

| Field | Type | Source / symmetry |
|---|---|---|
| `attempt_id` | `ExternalSubmissionAttemptId` | ID generator per local call |
| `material_id` | `SafeHandoffMaterialId` | Prepared material |
| `event_id` | `ToolEventId` | Deterministic Step 8 mapping from event name, schema version, material ID and canonical source-truth refs |
| `event_name` | `ToolOutboundEventName` | Closed mapping from `SafeMaterialClass` |
| `event_schema_version` | `ToolProtocolSchemaVersion` | Exact semantic envelope version used by this attempt |
| `target_class` | `ExternalCollaborationClass` | Same as material |
| `state` | `ExternalSubmissionAttemptState` | Local Port disposition only |
| `local_failure_summary` | `Option<SubmissionLocalFailureSummary>` | Required only for local failure / route blocked / degradation when known |
| `external_submission_locator` | `Option<ExternalSubmissionLocator>` | Valid local Port response; correlation locator only, never delivery truth |
| `route_contract_revision` | `Option<ExternalRevisionRef>` | Valid local Port response when a formal route contract revision is known |
| `attempted_at` | `AttemptTime` | Clock |

| Variant | English rustdoc | Required fields |
|---|---|---|
| `Prepared` | `/// Safe material is ready, but the collaboration Port was not called.` | no failure / external refs |
| `SubmittedLocally` | `/// L2 called the local collaboration Port and stored its valid local response without claiming delivery.` | no local failure; target-required locator/revision symmetry satisfied |
| `LocallyFailed` | `/// The local adapter call failed before an external delivery fact was known.` | local failure required |
| `RouteBlocked` | `/// The target route or source contract is not formally closed.` | typed blocked reason |
| `Degraded` | `/// Local submission exists, but its safe local response lacks a target-required locator or route revision.` | typed local degradation summary; no external status inference |
| `SubmissionOutcomeUnknown` | `/// The side-effecting collaboration call may have crossed the adapter boundary, but no valid local disposition is known.` | uncertainty ref required; no delivery/observation inference |

Factories `prepare`, `record_submission`, `record_local_failure`, `record_route_blocked`, and `record_outcome_unknown` validate material/event/target/response symmetry and return versioned local snapshots according to the persistence model. `record_submission` stores the safe locator/route revision and selects `SubmittedLocally` or `Degraded` once; later Bus/Observation feedback appends separate refs and never mutates this attempt. No factory transitions to `Delivered`, `Observed`, `Accepted`, `Retrying` or `DeadLettered`. `SubmissionOutcomeUnknown` leaves the owning claim incomplete and never causes automatic resubmission.

Stop review: post-truth attempt is distinct from execution handoff attempt and does not control outcome; pass.

## 11. `OutcomeAuditView`

| Field | Type | Construction source |
|---|---|---|
| `invocation_id` | `ToolInvocationId` | Query target |
| `outcome_summary` | `ToolInvocationOutcomeSummary` | Local outcome mapper |
| `audit_summary` | `ToolAuditSafeSummary` | Matching audit mapper |
| `safe_handoff_summary` | `SafeHandoffStateSummary` | Eligibility/material/latest local attempt reads |
| `delivery_status_ref` | `Option<BusDeliveryStatusRef>` | Stored external ref only |
| `observation_material_ref` | `Option<ObservationMaterialRef>` | Stored external ref only |
| `gap_refs` | `ConsistencyGapRefSet` | Subject gap query |
| `visibility` | `ConsumptionVisibility` | Application visibility decision |

`project(...) -> Result<Self, ProjectionError>` validates outcome/audit identity and treats external refs independently. `has_terminal_outcome`, `has_explainable_audit`, `has_submission_gap`, and `external_status_is_unknown` are pure. Query does not pull external systems or write state.

Stop review: stable local truth is readable even when peripheral route/feedback is degraded; pass.

## 12. Module Gate

| Check | Result |
|---|---|
| Ten objects map to source, outcome, audit, safe material and external refs | pass |
| Every field has a local / formal Port / derived source | pass |
| One terminal outcome and audit same-UoW invariant exact | pass |
| Outcome class payload symmetry exact | pass |
| Four safe checks are target-specific conjunction | pass |
| Execution attempt and external submission attempt remain distinct | pass |
| Submission attempt permanently binds exact event ID/name/schema before call | pass after Step 8 controlled exact-source correction |
| Submitted, delivered and observed remain three independent facts | pass after Step 9 Consumer correction; feedback refs are separate append-only records, not attempt fields |
| Blocked mapping / route does not become readiness | pass |
