# L2-runtime 03 详细设计 Step 6: 逐对象实现契约索引与完整性审计

> 创建日期: 2026-08-09
> 状态: done
> 当前模式: controlled_reopen
> 回填位置: 正式 `03-详细设计.md` 第 6 章
> 本文件定位: Step 6 主索引、对象闭环审计和实现 Agent 入口；逐字段/逐函数契约位于 annex，不以本索引替代 annex

## 1. Step 6 目标和硬门禁

Step 6 把 Step 5 的 12 个 capability card 进一步展开为可直接落码的对象契约。实现 Agent 不得需要自行发明以下任一项：类型名、字段类型、enum variant、函数参数/返回/错误、字段来源/owner、版本 guard、事务参与、幂等 identity、错误映射、Port/协议/Flow/状态/测试回指。

禁止用 `...`、`same`、`同上`、`分别按`、未类型 `refs/sources/repos`、通用 `Manager`、一行合并多个对象或状态机来满足本 Step。

## 2. Annex 索引

| Annex | 批次 | 覆盖对象 | 状态 |
|---|---|---|---|
| `03_ddd_step_06_contracts_run_goal_plan.md` | 6.1~6.3 | `RuntimeScope`、`RuntimeCorrelation`、`CommandMetadata`、`QueryMetadata`、`SourceReference`、`SafeReason`、`IdempotencyReservation`、`RuntimeTriggerContext`、`RuntimeAdmissionDecision`、`ControlledRun`、`RuntimeControlIntent`、`ControlGuard`、`WorkingPlanItem`、`GoalPlanWorkspace`、`DecisionInputs`、`RunProgressDecision`、`RuntimeHistoryEntry`、`OperationContext` | done |
| `03_ddd_step_06_contracts_context_memory_model.md` | 6.4~6.6 | `SourceSnapshot`、`SourceAvailability`、`RetrievalRequest`、`MemoryCandidate`、`ContextBudget`、`ContextSegment`、`ContextCompositionDecision`、`WorkingContext`、`WorkingMemoryEntry`、`WorkingMemory`、`CompactionDecision`、`MemoryUseRecord`、`ModelIntent`、`LogicalModelSelection`、`ModelTurn`、`ModelSubmission`、`ModelSemanticResult`、`ModelDecision`、`SafeDecisionSummary`、`ModelAdapterAvailability` | done |
| `03_ddd_step_06_contracts_action_delegation_feedback.md` | 6.7~6.9 | `ActionCandidate`、`ActionBudget`、`ActionDecision`、`ActionPreconditionInputs`、`GovernancePreconditionView`、`CapabilityExposureView`、`ToolContractAvailability`、`SandboxRequirementAvailability`、`ActionPreconditionDecision`、`SideEffectMarker`、`ActionSubmissionAttempt`、`DelegationBudget`、`ChildContextBoundary`、`Delegation`、`ChildRunRequest`、`ChildResultEnvelope`、`ExternalActionFeedback`、`ActionFeedbackRecord`、`FeedbackIncorporationDecision`、`ReflectionTrigger`、`ReflectionDecision` | done |
| `03_ddd_step_06_contracts_recovery_outcome_handoff_projection.md` | 6.10~6.12 | `StableStateCandidate`、`EffectFenceSummary`、`RuntimeCheckpoint`、`CheckpointCommitRequest`、`CheckpointCommitReceipt`、`RecoveryInputs`、`RecoveryDecision`、`RecoveryContinuation`、`LocalOutcomeInputs`、`RuntimeOutcome`、`SafeHandoffMaterial`、`HandoffAttempt`、`HandoffAcknowledgement`、`HandoffGap`、`ProjectionState`、`SafeRuntimeView`、`ProjectionRebuildRecord`、`HandoffReconciliationRecord` | done |
| `03_ddd_step_06_application_infra_entry_objects.md` | 6.13~6.16 | `OperationContext`、`IdempotencyOperation`、`AggregateVersionSet`、`StoredOperationResult`、typed dependency bundles、13 application service objects、query/consumer/job service objects、config/adapter/builder/facade/entry carriers、job state/report carriers | done |

The first annex contains the shared vocabulary and run/goal-plan objects originally created before the granularity reopen. The remaining three annexes are the deep rebuild batches created during this controlled reopen.

## 3. Capability/object coverage

| Capability | Required object group | Object annex | Protocol/Flow/State/Test handoff |
|---|---|---|---|
| CAP-01 Shared Runtime Vocabulary | identity, scope, metadata, source, reason, idempotency | run/goal-plan annex | Step 7 technical ports; Step 8 envelopes; Step 10 metadata/control states |
| CAP-02 Admission & Control | trigger, admission, run, control guard | run/goal-plan annex | Accept/Control; admission/run matrices |
| CAP-03 Goal & Plan | working item, workspace, progress decision, history | run/goal-plan annex | Progress; goal-plan/run matrices |
| CAP-04 Context Composition | snapshot, budget, segment, composition decision, frozen context | context/memory/model annex | Compose; context/source matrices |
| CAP-05 Memory Mediation | retrieval request, candidate, working entry/window, use/compaction | context/memory/model annex | Resolve/Record; memory matrix |
| CAP-06 Model Decision | logical intent, turn, submission, semantic result, decision, safe summary, availability | context/memory/model annex | Start/Classify/Consume; turn/disposition matrices |
| CAP-07 Action Orchestration | candidate, action choice, guard inputs/decision, attempt, effect marker | action/delegation/feedback annex | Propose/Evaluate/Submit; action/effect matrices |
| CAP-08 Delegation | budget, child boundary, delegation, child request/result | action/delegation/feedback annex | Propose/Submit/Consume; delegation matrix |
| CAP-09 Feedback/Reflection | external feedback, immutable record, incorporation decision, reflection trigger/decision | action/delegation/feedback annex | feedback consumer/reflect; ordering/reflection matrices |
| CAP-10 Checkpoint & Recovery | stable candidate, effect fence, checkpoint, commit receipt, recovery/continuation | recovery/outcome/handoff annex | Prepare/Commit/Request/Resume; checkpoint/recovery matrices |
| CAP-11 Local Outcome | outcome inputs and immutable local outcome | recovery/outcome/handoff annex | Finalize; outcome matrix |
| CAP-12 Handoff & Projection | material, attempt, ack, gap, projection, safe view, rebuild/reconcile records | recovery/outcome/handoff annex | Create/Submit/Consume/Rebuild/Reconcile; handoff/projection matrices |

## 4. Object closure audit

| Audit | Result | Evidence |
|---|---|---|
| Typed fields | pass | Every object card uses explicit Rust-shaped field type; collection element and optional payload types are named |
| Enum completeness | pass | Each state/disposition enum lists variants and payload fields; no compressed variant list remains in new annexes |
| Function signatures | pass | Constructors, mutations, predicates, validation and history conversion include parameters, result/error type and version/time guards where applicable |
| Field authority | pass | Tables distinguish Runtime-owned local fields from external source/version/ref fields and forbidden body |
| State transitions | pass | Every lifecycle object names legal mutation methods and unknown/pending/blocked posture; Step 10 will expand matrices independently |
| Transaction boundary | pass | Application objects identify UoW participation; physical checkpoint commit remains `L2R-CP-001` pending |
| Idempotency identity | pass | Command reservation, memory use, feedback event, child incorporation, checkpoint commit and job cursor identities are explicit |
| Protocol mapping | pass | Every object group points to command/query/event/job families; Step 8 owns full wire schema |
| Port mapping | pass | Each external or repository capability has a named injected Port; Step 7 owns trait/adapter/fake details |
| Flow mapping | pass | Each group maps to an independent operation/consumer/job; Step 9 owns call-by-call flows |
| Test mapping | pass | Each group has minimum assertions; Step 16 expands executable test cuts without claiming results |
| Owner separation | pass_with_pending | Tools/Sandbox/Governance/Capability/Method/Memory/Observability remain external; positive seams remain blocked |

## 5. Explicit unresolved dependencies

| Blocker | Affected object groups | Required posture |
|---|---|---|
| `L2R-UP-001` | action attempt, side-effect marker, feedback | pending/fail-closed; no execution or cleanup truth |
| `L2R-UP-002` | safe handoff material, handoff attempt/gap, outbound snapshot | candidate/gap only; no delivered/observed claim |
| `L2R-UP-003` | tool contract/input refs | consume future typed contract; no local schema duplication |
| `L2R-UP-004` | logical model selection/turn/submission | provider-neutral candidate; no route/secret/quota/cost |
| `L2R-UP-005` | retrieval/candidate/working memory | working-only refs; durable owner pending |
| `L2R-UP-006` | shared envelopes/event/projection types | Core/Bus/Obs schemas and routes pending; no local authority claim |
| `L2R-UP-007` | checkpoint/handoff/projection adapter availability | blocked/candidate only; no readiness |
| `L2R-UP-008` | source/definition refs | current workspace input; no immutable commit claim |
| `L2R-CP-001` | checkpoint commit receipt/physical UoW | commit unknown remains explicit; qualification blocked |
| `L2R-ENTRY-001` | API/worker/job entry carriers | actor/member/product boundary external and pending |
| `L2R-IMPL-001` | all planned file mappings | target implementation repository absent; design-only |

## 6. Step 6 gate

```text
step_05 = done
step_06 = done
next_allowed_action = start_step_07_trait_port_adapter_contracts
formal_03_assembly = blocked_until_steps_07_18_and_step_19
```

The formal `03-详细设计.md` remains historical material until Step 19. No future formal document may be assembled from this file alone; Step 7 must read all four object annexes and audit every Port against them.
