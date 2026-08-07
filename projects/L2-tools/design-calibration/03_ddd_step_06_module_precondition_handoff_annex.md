# L2-tools Step 6 模块附录: 执行前置与条件交接对象契约

> 状态: completed / pass
> 主文件: `03_ddd_step_06_object_contracts.md`
> Authority: 正式 `02-概要设计.md` §6.5 / §12.2.4
> Blockers: `L2T-UP-001~004`
> 作用: 补齐六个对象 exact contract；只闭口 blocked-aware L2 schema，不声明 authorization / Sandbox provider ready。

## 1. Capability 到对象

| Capability | Owner object | Boundary |
|---|---|---|
| 从正式工具语义派生适用前置 | `ExecutionRequirement` | Requirement is not effective authorization |
| 消费 invocation-bound authorization result | `AuthorizationConsumptionAssessment` | Owner / source unverifiable -> fail closed |
| 准备最小 execution context | `ExecutionHandoff` | Eligible is not Sandbox accepted |
| 记录本地 Port call | `ExecutionHandoffAttempt` | Attempt is not run / receipt / capture |
| 定位 external decision | `AuthorizationResultRef` | Ref contains no policy / evidence body |
| 保存 Sandbox consumption-time readiness | `SandboxReadinessSnapshot` | Snapshot does not own environment / lifecycle |

## 2. `ExecutionRequirement`

| Field | Type | Source / guard |
|---|---|---|
| `requirement_id` | `ExecutionRequirementId` | ID generator |
| `invocation_id` | `ToolInvocationId` | Admitted / awaiting invocation |
| `authorization_class` | `AuthorizationRequirementClass` | Formal definition requirement basis |
| `isolation_class` | `IsolationRequirementClass` | Formal definition requirement basis |
| `carrier_class` | `ExecutionCarrierRequirement` | Definition / binding-safe semantic constraint; no provider route |
| `basis_refs` | `ExecutionRequirementBasisRefSet` | Anchor, definition and binding assessment refs |
| `decided_at` | `DecisionTime` | Clock before handoff |

| Callable | Preconditions | Result |
|---|---|---|
| `derive(ExecutionRequirementId, &ToolInvocation, &FormalToolDefinition, Option<&CapabilityBindingAssessment>, DecisionTime)` | Admission permits evaluation; anchor matches | Requirement or `UnsupportedRequirement` |
| `requires_authorization()` / `requires_sandbox()` | none | Pure booleans |
| `permits_carrier(ExecutionCarrierClass)` | Candidate class provided | Pure contract-class comparison |
| `is_supported()` | none | False for unsupported combination |

| Variant | English rustdoc | Meaning |
|---|---|---|
| `NoExternalGovernance` | `/// No authorization result is required by this tool definition.` | Other gates still apply |
| `AuthorizationRequired` | `/// A formal invocation-bound authorization result must be consumed.` | Blocked if owner/schema unavailable |
| `SandboxRequired` | `/// Execution must cross the formal Sandbox isolation boundary.` | No host fallback |
| `AuthorizationAndSandboxRequired` | `/// Both formal authorization and Sandbox isolation are mandatory.` | Both must pass |
| `Unsupported` | `/// The current formal contracts cannot express or satisfy the requirement.` | No execution |

Stop review: requirement classification is local and deterministic; no allow / deny field; pass.

## 3. `AuthorizationConsumptionAssessment`

| Field | Type | Source |
|---|---|---|
| `assessment_id` | `AuthorizationAssessmentId` | ID generator |
| `invocation_id` | `ToolInvocationId` | Requirement subject |
| `result_ref` | `Option<AuthorizationResultRef>` | Blocked Port result |
| `decision_summary` | `Option<AuthorizationDecisionSafeSummary>` | Formal Port mapping only |
| `state` | `AuthorizationConsumptionState` | Authority/subject/revision/freshness/decision validation |
| `consumed_at` | `ConsumptionTime` | Clock at synchronous consumption |

| Callable | Contract |
|---|---|
| `consume(&ToolInvocation, &ExecutionRequirement, AuthorizationResultRef, AuthorizationDecisionSafeSummary, ConsumptionTime)` | Exact invocation / authority / revision; constraints body-free |
| `fail_closed(ToolInvocationId, AuthorizationGapReason, ConsumptionTime)` | Creates missing/stale/conflict/unverifiable, never deny or allow |
| `permits_handoff_preparation()` | True for accepted allow, or constrained when every constraint is representable |
| `requires_no_execution()` | True for accepted deny and all fail-closed states |

| Variant | English rustdoc | Effect |
|---|---|---|
| `AcceptedAllow` | `/// A verifiable external result allows this invocation to continue.` | May continue applicable gates |
| `AcceptedConstrained` | `/// A verifiable result allows continuation only under typed constraints.` | Constraints must be proven in handoff |
| `AcceptedDeny` | `/// A verifiable external result denies execution of this invocation.` | No-execution rejected |
| `Missing` | `/// The required external result is absent.` | No-execution unavailable |
| `Stale` | `/// The result is not valid for the current consumption time.` | No-execution unavailable |
| `Conflicting` | `/// Authority, subject, invocation or revision inputs conflict.` | No-execution unavailable |
| `Unverifiable` | `/// The result cannot be proven to come from the formal owner.` | Fail closed |

Stop review: positive variants are schema placeholders only until blockers close; no cached last-known-good; pass.

## 4. `ExecutionHandoff`

| Field | Type | Source / guard |
|---|---|---|
| `handoff_id` | `ExecutionHandoffId` | ID generator |
| `invocation_id` | `ToolInvocationId` | Invocation |
| `requirement_ref` | `ExecutionRequirementRef` | Current requirement |
| `authorization_assessment_ref` | `Option<AuthorizationAssessmentRef>` | Required when authorization applies |
| `sandbox_readiness_ref` | `Option<SandboxReadinessSnapshotRef>` | Required when Sandbox applies |
| `canonical_summary` | `CanonicalExecutionSafeSummary` | Definition-authorized, body-free mapping |
| `correlation_ref` | `CorrelationRef` | Invocation context |
| `state` | `HandoffState` | Eligibility guard result |

| Callable | Result / invariant |
|---|---|
| `prepare(...)` | `Preparing`; all ref symmetry checked |
| `evaluate_eligibility(&mut self, &ExecutionRequirement, Option<&AuthorizationConsumptionAssessment>, Option<&SandboxReadinessSnapshot>)` | `Eligible`, `Blocked`, or `Invalidated`; never external accepted |
| `mark_blocked(&mut self, ExecutionHandoffGapReason)` | Only from preparing; retains reason ref outside body |
| `matches_correlation(&CorrelationRef)` | Pure exact match |
| `is_body_free()` | Must be true before save / Port call |

| Variant | English rustdoc | Destination |
|---|---|---|
| `Preparing` | `/// The handoff is validating all applicable preconditions.` | `Eligible`, `Blocked`, `Invalidated` |
| `Eligible` | `/// L2 permits one local attempt to call the execution seam.` | none; attempt is separate fact |
| `Blocked` | `/// A required authorization, Sandbox, mapping or carrier condition failed.` | none; re-evaluation creates new context |
| `Invalidated` | `/// The invocation anchor or consumed snapshot is no longer applicable before handoff.` | none |

Stop review: safe context exact, no request body / route / provider; pass.

## 5. `ExecutionHandoffAttempt`

| Field | Type | Source |
|---|---|---|
| `attempt_id` | `ExecutionHandoffAttemptId` | ID generator per local call |
| `handoff_id`, `invocation_id` | typed IDs | Eligible handoff |
| `state` | `HandoffAttemptState` | Port call disposition |
| `local_response` | `Option<ExecutionPortSafeResponse>` | Adapter-safe local response; never receipt/run |
| `failure` | `Option<LocalExecutionFailureSummary>` | Local timeout/unavailable/mapping failure |
| `attempted_at` | `AttemptTime` | Clock |

| Factory | State / symmetry |
|---|---|
| `prepared(...)` | `Prepared`; response/failure absent |
| `record_local_submission(...)` | `AttemptedLocally`; safe response present, failure absent |
| `record_local_failure(...)` | `LocallyFailed`; failure present |
| `record_carrier_unavailable(...)` | `CarrierUnavailable`; failure present |
| `record_mapping_blocked(...)` | `MappingBlocked`; typed gap reason present |
| `record_outcome_unknown(...)` | `CallOutcomeUnknown`; side-effect uncertainty ref present, no external lifecycle inference |

The attempt is a versioned local fencing object with exactly one transition from `Prepared` to one local terminal state. `HandoffAttemptState` variants are `Prepared`, `AttemptedLocally`, `LocallyFailed`, `CarrierUnavailable`, `MappingBlocked`, and `CallOutcomeUnknown`. The prepared row and durable idempotency claim commit before the Port call; the terminal save uses the `Loaded<ExecutionHandoffAttempt>::expected_version` token afterward. `CallOutcomeUnknown` means only that L2 cannot prove whether the side-effecting adapter call crossed its boundary; it creates no no-execution outcome and requires formal recovery/feedback. There are no `Accepted`, `Running`, `Completed`, `ReceiptReceived`, `Retrying`, `DeadLettered` or `Cleaned` variants. Stop review: attempt / external lifecycle split exact; pass after Step 9 persistence/uncertainty correction.

## 6. `AuthorizationResultRef`

| Field | Type | Source / guard |
|---|---|---|
| `authority_ref` | `AuthorizationAuthorityRef` | Formal provider result; currently blocked |
| `result_id` | `ExternalAuthorizationResultId` | Provider result |
| `subject_ref` | `ExternalAuthorizationSubjectRef` | Must map exactly to invocation / actor / tool subject |
| `result_revision` | `ExternalRevisionRef` | Provider result contract revision |
| `consumed_at` | `ConsumptionTime` | Clock |

`from_port(...) -> Result<Self, PortContractError>` is the only constructor. `matches_invocation`, `matches_authority`, `supports_consumption` are pure. No policy, evidence, approval body, token or secret field exists. Stop review: `L2T-UP-001~002` remains explicit; pass.

## 7. `SandboxReadinessSnapshot`

| Field | Type | Source / guard |
|---|---|---|
| `snapshot_id` | `SandboxReadinessSnapshotId` | ID generator |
| `authority_ref` | `SandboxAuthorityRef` | Sandbox Port / configured formal adapter |
| `carrier_class` | `ExecutionCarrierClass` | Requested vs returned class must match |
| `mapping_state` | `SandboxMappingState` | Mapping/readiness result |
| `safe_summary` | `SandboxReadinessSafeSummary` | Body-free availability / gap summary |
| `observed_at` | `ConsumptionTime` | Clock at consumption |

| Variant | English rustdoc | Effect |
|---|---|---|
| `Available` | `/// The formal seam reports a compatible carrier and mapping at this time.` | May make handoff eligible; not accepted/run |
| `Unavailable` | `/// The required Sandbox carrier is unavailable.` | Block handoff |
| `MappingBlocked` | `/// The L2-to-Sandbox command or source mapping is not formally closed.` | Block handoff |
| `Conflicting` | `/// Authority, carrier, subject or mapping inputs conflict.` | Block handoff |
| `Unverifiable` | `/// Readiness cannot be attributed to the formal Sandbox boundary.` | Fail closed |

`from_port(...)`, `mapping_blocked(...)`, `unavailable(...)`, `conflicting(...)`, `unverifiable(...)`, and `supports_handoff(...)` are the only callables. The four conservative factories accept only invocation/requirement/carrier/typed blocker or safe failure refs and consumption time; they cannot manufacture a formal Sandbox authority or positive mapping. Snapshot never includes environment, command body, run, capture, receipt, cleanup or recovery. Stop review: pass after Step 9 resolution-branch closure.

## 8. Module Gate

| Check | Result |
|---|---|
| Six objects cover requirement, authorization consumption, handoff and local attempt | pass |
| All fields have local or blocked-Port sources | pass |
| Positive auth / Sandbox variants remain conditional on upstream closure | pass |
| Fail-closed and no-host-fallback exact | pass |
| Handoff eligible / local attempt / external lifecycle remain distinct | pass |
| No provider / receipt / run / retry / cleanup fact invented | pass |
