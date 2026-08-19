# L2-runtime Step 5 capability cards: CAP-07~09

> 状态: done
> 当前 Step: 5
> 批次: action orchestration、sub-agent delegation、feedback incorporation
> 输入: CAP-01 vocabulary、CAP-02 run、CAP-06 model decision、L2-tools/Sandbox/Governance open seams

## 1. CAP-07 Action Orchestration

### 1.1 Capability contract

| 项目 | 契约 |
|---|---|
| 目标 | 将 model action candidate 转为 Runtime local action decision；读取 Governance/Capability/Tools/Sandbox formal preconditions；提交稳定 action intent candidate，并维护 effect uncertainty marker |
| typed input | `EvaluateActionPreconditions`、`SubmitActionCandidate`、`ActionCandidate`、formal precondition safe views |
| typed output | `PreconditionResult`、`ActionSubmissionResult`、`ActionPreconditionDecision`、`SideEffectMarker`、history/outbox facts |
| local truth | action choice、guard decision、submission attempt identity、local effect marker |
| external owner | approval/policy、capability registry/exposure、tool execution、sandbox isolation/capture/cleanup |
| forbidden | choice/submit receipt 推导 execution；missing/unknown guard fail-open；Runtime 定义 Tools action body；unknown submission ordinary retry |

### 1.2 File allocation

| layer | files | responsibility |
|---|---|---|
| contracts | `commands.rs` | evaluate/submit commands and results |
| contracts | `events.rs` | action-attempt outbound and feedback inbound carriers |
| contracts | `queries.rs`、`views.rs` | `GetActionState` and action/marker/feedback safe views |
| domain | `action.rs` | candidate、action decision、guard decision、effect marker and policies |
| application | `action_service.rs` | evaluate/submit independent Flows |
| application | `ports/repositories.rs` | action/guard/effect repositories |
| application | `ports/external.rs` | governance/capability/tools/sandbox Ports |
| infra | `adapters.rs` | explicit blocked or candidate external adapters |
| api/worker | command handlers and feedback consumer entry |
| tests | action state/invariant、guard Flow、submission Flow、seam negative qualification |

### 1.3 Object allocation

| object | required fields | functions |
|---|---|---|
| `ActionCandidate` | candidate_id、run_id、kind、target_ref、canonical_input_ref、scope、budget、source_decision_ref、source_refs | `from_model_decision`、`validate_scope`、`canonical_digest_input` |
| `ActionDecision` | action_id、run_id、candidate_ref、kind、target_ref、scope、budget、status、source_refs、version | `propose`、`apply_precondition`、`cancel`、`is_submittable` |
| `PreconditionInputs` | governance_ref、capability_ref、tool_contract_ref、isolation_requirement_ref、source_versions | `validate_complete`、`has_unknown` |
| `ActionPreconditionDecision` | decision_id、action_id、disposition、input_refs、reason、source_refs、decided_at | `evaluate`、`permits_submission`、`to_history_fact` |
| `CanonicalActionIntentRef` | intent_ref、owner_ref、action_id、schema_version、digest、scope | `validate_owner`、`validate_digest` |
| `ActionSubmissionAttempt` | attempt_id、action_id、submission_ref、intent_digest、adapter_slot、status、created_at | `create`、`mark_submitted`、`mark_rejected`、`mark_unknown` |
| `SideEffectMarker` | marker_id、run_id、action_id、effect_class、status、submission_ref、feedback_ref、version | `mark_requested`、`mark_completed`、`mark_failed`、`mark_unknown` |
| `ActionApplicationService` | action/guard/effect/history/idempotency/UoW/outbox + four owner Ports | `evaluate`、`submit` |

### 1.4 Port and Flow allocation

| Port/Flow | exact role |
|---|---|
| `ActionRepositoryPort` | versioned action choice get/save |
| `ActionPreconditionRepositoryPort` | latest guard read and append-only decision |
| `SideEffectRepositoryPort` | marker get/save/list unresolved |
| `GovernancePreconditionPort` | read/evaluate formal result; no local approval write |
| `CapabilityExposurePort` | resolve target identity/formal exposure only |
| `ToolActionPort` | get contract、submit stable canonical intent、get feedback/status candidate |
| `SandboxHandoffPort` | get isolation requirement、submit stable requirement、get safe result ref |
| `EvaluateActionPreconditionsFlow` | load candidate/version -> resolve all formal inputs -> domain guard -> guard/history/result/outbox UoW |
| `SubmitActionCandidateFlow` | require allowed guard/current version -> marker/attempt/history/outbox UoW -> post-commit external submit -> posture UoW |
| `GetActionStateFlow` | read action/guard/marker/feedback view without external refresh |

### 1.5 State, transaction and tests

```text
action: proposed -> allowed | denied | waiting | unknown | cancelled
effect: none -> requested -> completed | failed | unknown
```

| case | transaction/posture | test assertion |
|---|---|---|
| complete verified inputs | guard decision committed | only `Allowed` permits separate submit command |
| any input missing/stale/conflict | denied/waiting/unknown | `permits_submission=false` |
| local submit intent | marker requested + attempt committed before adapter | spy proves no external call before commit |
| adapter blocked | attempt rejected/blocked | no execution fact |
| receipt unknown | marker/attempt unknown | same identity retained; no ordinary retry |
| verified feedback success/failure | CAP-09 advances marker | transport ACK alone cannot advance |
| concurrent guard/action version | conflict | no last-write-wins |
| Tools/Sandbox seam incomplete | blocked adapter | negative qualification only |

### 1.6 Stop review

CAP-07 independently allocates action choice, guard and external attempt; no state or result conflates execution, sandbox truth or Governance approval.

## 2. CAP-08 Sub-agent Delegation

### 2.1 Capability contract

| 项目 | 契约 |
|---|---|
| 目标 | 从 parent run/frozen context 派生受限 child scope、budget 和 body-free context boundary；创建 stable child request；一次性吸收 child result 到 parent history/progress |
| typed input | `CreateDelegation`、`ConsumeChildResult`、`ChildResultAvailable`、`DelegationBudget`、`WorkingContext` |
| typed output | `DelegationResult`、`Delegation`、`ChildContextBoundary`、parent progress/history fact |
| local truth | delegation identity/state、parent-child correlation、child scope/budget/context ref allow-list、once-only incorporation marker |
| external owner | child Runtime execution、member/container/process lifecycle、child local memory/body |
| forbidden | parent/child shared mutable body；child scope wider than parent；Runtime 创建 member/container；duplicate child result incorporation；unknown create retry with new child ID |

### 2.2 File allocation

| layer | files | responsibility |
|---|---|---|
| contracts | `commands.rs` | create/consume child commands, budget/context carriers, results |
| contracts | `events.rs` | `ChildResultAvailable` |
| contracts | `queries.rs`、`views.rs` | `GetDelegationState` and safe child linkage view |
| domain | `delegation.rs` | delegation aggregate、boundary、state、incorporation guard |
| application | `delegation_service.rs` | create/incorporate Flows |
| application | `ports/repositories.rs` | delegation/history/run repositories |
| application | `ports/external.rs` | `ChildRuntimePort` |
| infra | child adapter slot or explicit blocked adapter |
| api/worker | create command handler and child-result consumer |
| tests | scope/budget/boundary/identity/order/once/unknown cases |

### 2.3 Object allocation

| object | required fields | functions |
|---|---|---|
| `DelegationBudget` | max_child_steps、max_safe_context_refs、deadline_ref、effect_policy、profile_ref | `validate`、`fits_parent_budget` |
| `ChildContextBoundary` | parent_context_ref、allowed_source_refs、excluded_source_refs、redaction、budget、boundary_digest | `derive_from`、`contains`、`validate_body_free` |
| `ChildRunRequest` | delegation_id、parent_run_id、child_run_ref、child_scope、budget、context_boundary_ref、correlation、digest | `new`、`validate_identity` |
| `Delegation` | delegation_id、parent_run_id、child_run_ref、scope、budget、context_boundary、status、result_ref、version | `create`、`mark_submitted`、`mark_waiting`、`accept_result`、`mark_unknown`、`close` |
| `ChildResultRef` | result_ref、child_run_ref、source_owner、schema_version、digest、completed_at | `validate_source`、`validate_correlation` |
| `DelegationApplicationService` | run/context/delegation/history/idempotency/UoW/outbox/child Ports | `create(CreateDelegation)`、`incorporate(ConsumeChildResult or event)` |

### 2.4 Port, protocols and Flows

| boundary | contract |
|---|---|
| parent reads | exact run version and frozen context; no mutable borrow |
| delegation repository | get/get-for-update/save with expected version |
| child Port | `create(ChildRunRequest) -> ChildSubmission`; `get_result(ChildRunRef) -> Option<ChildResultRef>` |
| create command | `CreateDelegation` -> `CreateDelegationFlow` -> `DelegationResult` |
| result command/event | `ConsumeChildResult` / `ChildResultAvailable` -> `ConsumeChildResultFlow` -> receipt/result |
| query | `GetDelegationState` -> delegation safe view |
| outbound | child request/parent incorporation local facts only; no member lifecycle event |

### 2.5 State and transaction

```text
proposed -> submitted -> waiting -> incorporated -> closed
proposed -> blocked
submitted -> unknown -> manual_review
```

| stage | boundary |
|---|---|
| create UoW | boundary/child request identity/delegation/history/outbox commit |
| post commit | call child Port with same request/digest |
| receipt UoW | submitted/blocked/unknown posture |
| result UoW | dedupe/order/source validation -> delegation.accept_result -> parent progress/history commit |
| close | only incorporated result and parent progress decision committed |

### 2.6 Errors and tests

| case | posture/assertion |
|---|---|
| child scope not subset | rejected; no delegation saved |
| budget exceeds parent | blocked; no child call |
| context ref not allow-listed/body present | rejected/redacted; no shared mutable body |
| child Port pending | delegation blocked; no container fallback |
| create receipt unknown | delegation unknown; no new child ID retry |
| duplicate result event | stored duplicate receipt; one parent incorporation |
| late result after close | linked late fact; parent decision unchanged |
| correlation/source mismatch | rejected; no result_ref stored |

### 2.7 Stop review

CAP-08 closes parent/child identity, scope, context and result-incorporation boundaries without owning child execution or member lifecycle.

## 3. CAP-09 Feedback Incorporation

### 3.1 Capability contract

| 项目 | 契约 |
|---|---|
| 目标 | 对 action/model/child feedback 做 envelope/source/correlation/dedupe/ordering classification，追加 immutable feedback fact，并生成新的 marker/progress/recovery decision |
| typed input | `ActionFeedbackReceived`、`ModelResultAvailable`、`ChildResultAvailable`、`IncorporateActionFeedback` |
| typed output | `EventReceipt`、`IncorporationResult`、feedback records、new progress/recovery refs |
| local truth | source-event reservation、feedback record/order classification、incorporation fact、linked late/duplicate fact |
| external owner | source delivery/execution result body、transport ACK、external audit log |
| forbidden | ACK 推导 completion；late/duplicate 逆写旧 decision/outcome；无 source identity 的 feedback；跨 target correlation |

### 3.2 File and object allocation

| file | objects/responsibility |
|---|---|
| `contracts/events.rs` | feedback payload types、`EventEnvelope<T>`、`EventReceipt` |
| `contracts/commands.rs` | explicit `IncorporateActionFeedback` command for controlled ingestion |
| `domain/action.rs` | `ActionFeedbackRecord` and effect marker transition input |
| `domain/model.rs` | `ModelFeedbackRecord` and semantic result incorporation input |
| `domain/delegation.rs` | child result incorporation marker |
| `domain/history.rs` | feedback/late/duplicate fact factories |
| `application/feedback_service.rs` | action feedback Flow |
| `application/model_service.rs` | model result Flow |
| `application/delegation_service.rs` | child result Flow |
| `application/ports/repositories.rs` | feedback/dedupe/target/history repositories |
| `worker/consumers.rs` | three independent consumer mappings |

| object | required fields | functions |
|---|---|---|
| `EventIdentity` | source_owner、event_id、schema_version、payload_digest | `validate`、`dedupe_key` |
| `EventOrdering` | target_ref、source_sequence、source_version、occurred_at | `classify_against` |
| `ActionFeedbackRecord` | feedback_id、event_identity、action_id、submission_ref、disposition、ordering、result_ref、correlation、recorded_at | `incorporate`、`is_duplicate`、`is_late`、`to_history_fact` |
| `ModelFeedbackRecord` | feedback_id、event_identity、turn_id、submission_ref、semantic_result_ref、ordering、correlation | `incorporate`、`validate_semantic_only` |
| `ChildIncorporationRecord` | incorporation_id、event_identity、delegation_id、child_result_ref、ordering、parent_decision_ref | `create_once`、`is_duplicate` |
| `FeedbackApplicationService` | feedback/action/effect/run/history/idempotency/UoW/outbox Ports | `consume(IncorporateActionFeedback or event)` |

### 3.3 Flow allocation

| Flow | target reads | domain mutation | result |
|---|---|---|---|
| `ConsumeActionFeedbackFlow` | action、submission、marker、existing event receipt | feedback record + marker transition + new progress/recovery fact | event receipt/integration result |
| `ConsumeModelResultFlow` | turn/submission/existing receipt | model feedback + turn classification + decision/summary | event receipt/model result |
| `ConsumeChildResultFlow` | delegation/child identity/existing receipt | once incorporation + parent progress fact | event receipt/delegation result |

Each Flow has its own payload schema, target repository reads, ordering rule, state transition and result mapping. They share envelope validation utilities only; one Flow cannot call another as a generic feedback handler.

### 3.4 Transaction and ordering

| phase | rule |
|---|---|
| validate | schema/source owner/target/correlation/payload digest before UoW mutation |
| reserve | atomically reserve `EventIdentity`; duplicate loads stored `EventReceipt` |
| classify | compare target current state and source sequence/version; timestamp only tiebreaker |
| apply | accepted event invokes target-specific domain function; late event only constructs linked fact |
| UoW write | feedback/incorporation、target transition、new decision/history、stored receipt、outbox |
| ACK | transport ACK only after business receipt commit |
| commit unknown | return unknown receipt/fence; source re-delivery uses same event identity |

### 3.5 State and tests

```text
pending -> accepted -> incorporated
pending -> duplicate | late | rejected | unknown
```

| case | assertion |
|---|---|
| accepted action feedback | exactly one feedback and marker transition |
| duplicate same digest | stored receipt; no target/domain call |
| same event ID different digest | protocol conflict/rejected |
| late terminal feedback | old decision/outcome unchanged; optional linked fact |
| out-of-order sequence | explicit ordering result; no inferred latest by timestamp |
| target/source mismatch | rejected/not-visible; no leak/body |
| commit unknown | target completion not claimed; same identity reconciliation |
| raw feedback body | mapping rejection/redaction before persistence/log/event |

### 3.6 Stop review

CAP-09 has three distinct target-specific feedback Flows with shared envelope vocabulary, append-only truth, explicit ordering and once-only incorporation.

## 4. Batch audit

| audit | result |
|---|---|
| action choice/guard/attempt/execution truth are separated | pass |
| delegation scope/context/member ownership are separated | pass |
| action/model/child feedback Flows are independently allocated | pass |
| unknown, late, duplicate and out-of-order postures have state/transaction/test ownership | pass |
| Tools/Sandbox/Governance/child external seams remain fail-closed | pass |
