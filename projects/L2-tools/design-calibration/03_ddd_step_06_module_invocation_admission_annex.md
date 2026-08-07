# L2-tools Step 6 模块附录: 规范调用与受理对象契约

> 状态: completed / pass
> 主文件: `03_ddd_step_06_object_contracts.md`
> Authority: 正式 `02-概要设计.md` §6.4 / §12.2.3
> 作用: 补齐五个对象的 exact fields、callables、状态与停审；不承载 Runtime plan / loop。

## 1. Capability 到对象

| Capability | Owner object | Invariant |
|---|---|---|
| 建立 canonical invocation | `ToolInvocation` | Caller / carrier cannot create private semantic variants |
| 记录执行前受理事实 | `InvocationAdmission` | Must precede any real execution; immutable |
| 锚定消费时点合同 | `InvocationContractAnchor` | Current changes never rewrite history |
| 稳定读取 invocation | `ToolInvocationView` | Body-free, read-only, external lifecycle excluded |
| 聚合 caller / actor / work / trace refs | `InvocationContextRefs` | Typed refs only; missing required refs fail closed |

## 2. `ToolInvocation`

| Field | Type | Required source / guard |
|---|---|---|
| `invocation_id` | `ToolInvocationId` | `IdGeneratorPort` before UoW write; may be caller supplied only if protocol validates namespace |
| `contract_anchor` | `InvocationContractAnchor` | Contract / definition / binding reads in same application snapshot |
| `canonical_intent` | `CanonicalInvocationIntent` | `SubmitToolInvocationRequest.intent`, normalized by formal definition semantics |
| `context_refs` | `InvocationContextRefs` | Formal caller context mapper |
| `established_at` | `DecisionTime` | `ClockPort.now()` after validation, before UoW begin/save |

| Callable | Preconditions | Result / errors |
|---|---|---|
| `canonicalize(ToolInvocationId, FormalInvocationIntent, InvocationContractAnchor, InvocationContextRefs, DecisionTime)` | Definition supports intent; context carrier is attributable/body-free, including an explicit insufficient state | `Result<Self, DomainError>`; `IntentOutsideContract`, `InvalidContextCarrier`, `ForbiddenBody` |
| `matches_tool(ToolId)` | none | Exact anchor comparison |
| `matches_revision(DefinitionRevision)` | none | Exact anchor comparison |
| `accepts_admission(&InvocationAdmission)` | Same invocation; decision time not before invocation and before execution ref | `Result<(), DomainError>` |
| `has_correlation(&CorrelationRef)` | none | Exact typed ref comparison |

Canonicalization stores safe typed arguments / semantic selectors only. It does not decide whether context sufficiency permits admission: `InvocationAdmission::admit/await_precondition/reject` owns that immutable judgment. It never stores prompt, conversation, raw transport request, Runtime action choice, plan, loop, checkpoint, retry or recovery.

Stop review: all required fields are supplied by the Submit flow; no carrier-specific variant or execution state; pass.

## 3. `InvocationAdmission`

| Field | Type | Required source |
|---|---|---|
| `admission_id` | `InvocationAdmissionId` | ID generator |
| `invocation_id` | `ToolInvocationId` | Canonical invocation |
| `state` | `AdmissionState` | Domain guard result |
| `reason` | `AdmissionDecisionReason` | Closed reason derived from contract / binding / context validation |
| `basis_refs` | `AdmissionBasisRefSet` | Contract, definition, binding assessment and context refs |
| `decided_at` | `DecisionTime` | Clock before any execution attempt |

| Factory | State | Required condition |
|---|---|---|
| `admit(...)` | `Admitted` | Contract active; intent/context valid; no applicable unconsumed precondition |
| `await_precondition(...)` | `AwaitingPrecondition` | Contract valid and one or more applicable precondition classes remain |
| `reject(...)` | `Rejected` | Deterministic contract/context/binding rejection |
| `unavailable(...)` | `Unavailable` | Required formal source is unavailable / unverifiable |

| Variant | English rustdoc | Allowed destination |
|---|---|---|
| `Admitted` | `/// The invocation may enter its next applicable execution boundary.` | none; immutable fact |
| `Rejected` | `/// The invocation is rejected before any real execution.` | none; immutable fact |
| `AwaitingPrecondition` | `/// The invocation is accepted but awaits one or more formal preconditions.` | none; later assessment is a separate fact |
| `Unavailable` | `/// A required contract or source is unavailable for admission.` | none; later source is a separate fact |

Callables `permits_precondition_evaluation()`, `requires_no_execution_outcome()`, and `is_decided_before(ExecutionStartRef)` are pure. No state mutation API exists. Rejected / unavailable branches create a terminal no-execution outcome and audit through application UoW; admission itself is not consumer-visible outcome.

Stop review: admission state is immutable and does not flip on late external material; pass.

## 4. `InvocationContractAnchor`

| Field | Type | Source / symmetry |
|---|---|---|
| `tool_id` | `ToolId` | Active contract |
| `definition_revision` | `DefinitionRevision` | Contract current definition at submit time |
| `binding_mode` | `BindingMode` | Contract / current relation classification |
| `binding_assessment_ref` | `Option<BindingAssessmentRef>` | Accepted/conservative assessment when one exists; `Bound + None` means the relation/assessment was missing at this attempted consumption and can only support rejected/unavailable admission |
| `anchored_at` | `ConsumptionTime` | Clock at snapshot consumption |

| Callable | Contract |
|---|---|
| `anchor(&ToolContract, &FormalToolDefinition, BindingMode, Option<&CapabilityBinding>, Option<&CapabilityBindingAssessment>, ConsumptionTime)` | Same tool/current revision and explicit mode; freezes accepted or conservative/missing Binding context without deciding admission |
| `matches_contract(&ToolContract)` | Tool identity and current-at-construction revision match; used only at creation |
| `matches_definition(&FormalToolDefinition)` | Same tool and revision |
| `requires_binding_assessment()` | True for `Bound`; absence is an explicit non-admissible context, never implicit-unbound |
| `binding_context_permits_admission(Option<&CapabilityBinding>, Option<&CapabilityBindingAssessment>)` | True only for matching Active relation and accepted consumption-time assessment |

Anchor is immutable and contains no current-pointer reference that could move. Contract lifecycle, relation applicability, assessment state and context sufficiency are captured as `InvocationAdmission` basis/reason in the same UoW; the anchor does not self-authorize. Stop review: historical interpretation survives contract / Binding changes and conservative rejection remains constructible; pass after Step 9 admission correction.

## 5. `ToolInvocationView`

| Field | Type | Construction source |
|---|---|---|
| `invocation_id` | `ToolInvocationId` | Invocation repository |
| `anchor_summary` | `InvocationContractAnchorSummary` | Domain-to-contract mapper |
| `intent_summary` | `CanonicalIntentSafeSummary` | Invocation safe mapper |
| `context_summary` | `InvocationContextRefSummary` | Context safe mapper |
| `admission_summary` | `InvocationAdmissionSummary` | Admission repository |
| `outcome_ref` | `Option<ToolInvocationOutcomeRef>` | Outcome index; no external pull |
| `visibility` | `ConsumptionVisibility` | Application read visibility |

Callables: `project(...) -> Result<Self, ProjectionError>` validates invocation/admission/outcome identity symmetry; `is_admitted`, `has_terminal_outcome`, `is_body_free` are pure. Missing outcome is represented as `None` and must not be guessed from Sandbox / Runtime status.

Stop review: response is fully constructible from local reads; Query has no write / refresh path; pass.

## 6. `InvocationContextRefs`

| Field | Type | Formal source / guard |
|---|---|---|
| `caller_ref` | `CallerRef` | Inbound caller adapter; authority and caller class required |
| `actor_ref` | `ActorRef` | Command metadata / Core generic candidate after exact mapping |
| `work_ref` | `Option<WorkRef>` | Caller-provided typed external ref when definition requires work context |
| `trace_ref` | `TraceRef` | Command metadata / Core generic candidate |
| `correlation_ref` | `CorrelationRef` | Command metadata; stable across handoff/outcome |
| `sufficiency` | `ContextSufficiency` | Domain validation against definition required classes |

| Callable | Result |
|---|---|
| `from_formal_context(FormalCallerContext, RequiredContextClassSet)` | Rejects raw body and creates `Sufficient`, `Degraded`, or `Insufficient` |
| `has_required_refs(&RequiredContextClassSet)` | `bool`; only blocking required classes matter |
| `matches_correlation(&CorrelationRef)` | Exact match |
| `contains_forbidden_body()` | Construction-time guard; a valid object returns false |

| Variant | English rustdoc | Effect |
|---|---|---|
| `Sufficient` | `/// All required typed context references are present and verifiable.` | May canonicalize invocation |
| `Degraded` | `/// A non-blocking context reference is missing or stale.` | May proceed only when definition marks it non-blocking |
| `Insufficient` | `/// A required caller, actor, work, trace or correlation reference is missing.` | Reject / unavailable before execution |

Stop review: no anonymous identity is invented; raw request / Runtime state absent; pass.

## 7. Module Gate

| Check | Result |
|---|---|
| Five objects cover canonicalization, anchor, admission, context and read | pass |
| Factory inputs cover every required field | pass |
| Admission is established before execution and immutable | pass |
| Bound anchor requires exact assessment ref | pass |
| Query view is locally constructible and no-write | pass |
| Runtime plan / body / carrier lifecycle excluded | pass |
