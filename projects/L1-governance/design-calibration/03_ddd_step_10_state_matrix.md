# Step 10. 状态机与转换矩阵

> 对应 SOP: `standards/document/详细设计讨论流程_SOP.md` Step 10

## 1. Step 状态

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 10 状态机与转换矩阵 |
| 当前状态 | 已完成;待用户审查 |
| 输入基线 | 需求、架构、概要、Step 1~9 详细设计校准文档 |
| 输出文件 | `projects/L1-governance/design-calibration/03_ddd_step_10_state_matrix.md` |
| 停审方式 | 每个状态机写状态集合、ASCII 图、转换矩阵和停审记录;全部完成后做跨状态机审计 |

## 2. 本步目标

本 Step 把 Step 6 的状态 enum、Step 6 domain method、Step 8 protocol intent 和 Step 9 function flow 串成可落码的状态矩阵。实现侧只能按本矩阵写状态校验和 transition method;如果 Step 6 / Step 9 与本 Step 冲突,必须先回设计修正,不得由实现侧选边。

本步不定义最终错误 enum 变体名、DDL、optimistic lock SQL、retry 数字、topic 名称、transport route 或实施 commit 边界。非法转换统一先标记为 `DomainError::InvalidStateTransition` / `ApplicationError::InvalidStateTransition` 占位;精确错误 taxonomy、API 映射、retry / dead-letter 恢复策略由 Step 12 / Step 13 闭合。

## 3. 输入材料

| 输入 | 状态 | 本 Step 用途 |
|---|---|---|
| `02_hld_step_09_state_machine.md` | 已完成 | 提供概要层状态集合和主迁移方向 |
| `03_ddd_step_06_object_contracts.md` | 已完成 | 提供 state enum、object 字段、factory 和 transition method |
| `03_ddd_step_07_trait_port_adapter_contracts.md` | 已完成 | 提供读取面、version source、projection / reference / outbox / handoff repository |
| `03_ddd_step_08_protocol_contracts.md` | 已完成 | 提供 command / query / event / job DTO intent |
| `03_ddd_step_09_function_flows.md` | 已完成 | 提供触发 flow、transaction 边界和副作用 |
| `standards/document/设计真相源闭环与可落码性标准.md` | 已检查 | 检查状态、字段、DTO、port、flow 是否闭合到可落码 |

## 4. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 当前仓有哪些正式状态机? | domain truth 状态、projection / reference / outbox / reconciliation / handoff / job report 维护状态、idempotency / API / worker / job entry 技术状态。 |
| 每个状态机归属于哪个模块和哪个 Step 6 状态 enum? | §6 批次表逐项列出;状态 enum 必须与 Step 6 §10 / §17.3 同名。 |
| 每个状态机的状态集合是什么? | 每个状态机小节的状态集合表逐项给出,不使用全局混表替代。 |
| 哪些函数会触发状态转换? | 每条矩阵行的触发函数必须回指 Step 6 object method 或 Step 9 flow。 |
| 每个转换的前置条件、副作用和错误是什么? | 每条矩阵行给出可落码前置条件、状态副作用、flow 副作用和非法错误占位。 |
| 非法转换是否写审计? | domain object 不写审计;application accepted path 在状态转换成功后写 trace / history / audit / outbox。非法转换是否写 rejected trace / audit 由 Step 12 错误恢复闭合。 |
| 每个状态机完成后如何停审? | 每个小节以停审表结束: enum、状态名、触发函数、前置条件、非法转换、副作用、测试切口。 |
| 全部状态机完成后如何审计? | §18 做跨状态机命名、触发、错误、测试、reserved 状态和跨状态机副作用审计。 |

## 5. 通用状态矩阵规则

| 规则 | 正式口径 |
|---|---|
| 状态名来源 | 必须使用 Step 6 已定义 enum variant;不得在实现中新增同义状态。 |
| trigger 来源 | 必须是 Step 6 object factory / method、Step 9 flow 中已列的 application service 或 Step 7 repository marker update。 |
| 前置条件来源 | 只能引用 loaded truth、DTO 字段、repository versioned read、resolver decision、policy guard、stored snapshot 或 job input。 |
| 副作用边界 | domain method 只更新 object 字段;trace、history、audit、outbox、projection stale、stored result 由 Step 9 application flow 同事务编排。 |
| 非法转换错误 | domain method 返回 `DomainError::InvalidStateTransition`;application / job 层映射为 `ApplicationError::InvalidStateTransition` 或 Step 12 具体错误。 |
| terminal 状态 | 标为终态的状态不得再迁移;需要重新处理时必须创建新 truth、new marker 或正式 replacement transition。 |
| query 状态 | query 只能读取并暴露状态;不得在 query path 修复 stale、刷新 snapshot、append trace 或写 projection。 |
| maintenance 状态 | projection/reference/outbox/handoff/job report 状态不得反写 Governance core truth。 |
| version 来源 | 任何 update existing state 的写路径必须使用 Step 7 / Step 11 正式 versioned read/list 来源。 |
| phase reserved | 若状态或迁移仅为后续阶段预留,必须写 `reserved` 且当前 boundary 不调用。 |

## 6. 状态矩阵批次表

| 批次 | 状态机 | 所属模块 | 状态 enum | 主要触发 flow / 函数 | 停审状态 |
|---|---|---|---|---|---|
| 10.1 | GovernanceContext | domain | `GovernanceContextState` | Create / context update / reference refresh | 已完成 |
| 10.1 | GovernanceInput | domain | `GovernanceInputState` | Submit / UpdateGovernanceInputState | 已完成 |
| 10.1 | Gate | domain | `GateState` | OpenGovernanceGate / RecordGovernanceDecision | 已完成 |
| 10.1 | GovernanceDecision | domain | `GovernanceDecisionState` | RecordGovernanceDecision / SupersedeGovernanceDecision | 已完成 |
| 10.1 | ApprovalResponsibility | domain | `ApprovalResponsibilityState` | Assign / Vote / Delegate | 已完成 |
| 10.1 | ResponsibilityChain | domain | `ResponsibilityChainState` | Assign / Vote / escalation flow | 已完成 |
| 10.2 | PolicyEffectiveFact | domain | `PolicyEffectiveState` | Import / UpdatePolicyEffectiveFactState | 已完成 |
| 10.2 | SharedRuleSet | domain | `SharedRuleSetState` | UpdateSharedRuleSet | 已完成 |
| 10.2 | PolicyConflictRecord | domain | `PolicyConflictState` | conflict detection / ResolvePolicyConflict | 已完成 |
| 10.3 | ControlApplicability | domain | `ControlApplicabilityState` | AssessControlApplicability | 已完成 |
| 10.3 | ControlReview | domain | `ControlReviewState` | RecordControlReview | 已完成 |
| 10.3 | AIIA / SoA Conclusion | domain | `ComplianceConclusionState` | Submit / ApproveComplianceConclusion | 已完成 |
| 10.3 | NonconformityRecord | domain | `NonconformityState` | Raise / Confirm / Plan / Verify | 已完成 |
| 10.3 | CorrectiveAction | domain | `CorrectiveActionState` | Plan / UpdateCorrectiveActionState | 已完成 |
| 10.3 | VerificationResult | domain | `VerificationState` | VerifyCorrectiveAction | 已完成 |
| 10.4 | DerivedGovernanceViewState | domain / projection | `DerivedGovernanceViewFreshnessState` | stale / rebuild / replace view | 已完成 |
| 10.4 | ReferenceResolutionState | contracts / reference | `ReferenceResolutionKind` | consumer / refresh job | 已完成 |
| 10.4 | GovernanceOutboxRecord | domain / outbox | `OutboxPublicationState` | append / publish / retry / dead-letter | 已完成 |
| 10.4 | GovernanceReconciliationReport | contracts / report | `ReconciliationReportState` | RunGovernanceReconciliation | 已完成 |
| 10.4 | GovernanceHandoffMarker | domain / handoff | `GovernanceHandoffState` | trace/archive/export handoff jobs | 已完成 |
| 10.4 | GovernanceJobReport | contracts / jobs | `GovernanceJobReportState` | operations job assembly | 已完成 |
| 10.5 | GovernanceIdempotencyRecord | application | `GovernanceIdempotencyState` | reserve / complete / conflict | 已完成 |
| 10.5 | API / worker / job entry | api / worker / jobs | entry disposition states | handler / worker / runner | 已完成 |
| 10.6 | final audit | cross-step | all states | naming / trigger / test audit | 已完成 |

## 7. 状态机写法模板

```text
[StateMachineName]
  StateA -> StateB -> StateC
  StateA -> TerminalX
```

| 状态 | 作用 | 是否终态 | 允许的关键操作 |
|---|---|---|---|

| From | To | 触发函数 | Step 9 flow | 前置条件 | 状态副作用 | Flow 副作用 | 非法时错误 |
|---|---|---|---|---|---|---|---|

| 停审项 | 结论 | 缺口 / 修正 |
|---|---|---|

## 8. domain context / decision / responsibility 状态矩阵

### 8.1 `GovernanceContextState`

```text
[GovernanceContext]
  Draft -> Ready -> Closed
  Draft -> PendingReference -> Ready
  Ready -> PendingReference
  Draft -> Invalid
  Ready -> Invalid
  PendingReference -> Invalid
  PendingReference -> Closed
```

| 状态 | 作用 | 是否终态 | 允许的关键操作 |
|---|---|---|---|
| `Draft` | context 已创建但未具备正式裁决条件 | 否 | `mark_ready`、`mark_pending_reference`、`invalidate` |
| `Ready` | 可进入 Gate / Decision / Control / Compliance / Nonconformity 主线 | 否 | `mark_pending_reference`、`invalidate`、`close`、被其他 flow 读取 |
| `PendingReference` | 等待 external reference / evidence summary 解析 | 否 | `mark_ready`、`invalidate`、`close` |
| `Invalid` | context 不合法或不再适用 | 是 | 无 |
| `Closed` | context 已关闭,不再接收新主线操作 | 是 | 无 |

| From | To | 触发函数 | Step 9 flow | 前置条件 | 状态副作用 | Flow 副作用 | 非法时错误 |
|---|---|---|---|---|---|---|---|
| factory | `Draft` | `GovernanceContext::from_subject(...)` | `CreateGovernanceContextFlow` | request subject/source/actor 非空;id 来自 `new_governance_context_id()` | 写 `context_id`、`subject_ref`、`source_ref`、`actor_ref`;pending / terminal reason 为空 | save context、append trace/audit/outbox、mark affected views stale、store result | `ApplicationError::InvalidCommandInput` |
| `Draft` | `Ready` | `mark_ready(actor)` | create context / reference refresh accepted path | `GovernanceContextPolicy::assert_context_ready(...)` 通过;pending reference 已 resolved 或无 pending | `context_state = Ready`;清空 `pending_reference_state`;更新 actor | save context with expected version;append trace/history/outbox/stale marker | `DomainError::InvalidStateTransition` |
| `PendingReference` | `Ready` | `mark_ready(actor)` | `RefreshExternalContextSnapshotsFlow` or context update | loaded `ReferenceResolutionState.kind == Resolved`;context still same subject/source | `context_state = Ready`;清空 pending reference;更新 actor | save context;store job/command result;stale affected views | `DomainError::InvalidStateTransition` |
| `Draft` | `PendingReference` | `mark_pending_reference(reference_state)` | create context / submit input precheck | reference state kind is `Unresolved` / `Stale` / `Unavailable`;reference state ref matches context source or required evidence | `context_state = PendingReference`;写 `pending_reference_state` | save context;append trace/audit/outbox if command accepted;job report if refresh path | `DomainError::InvalidStateTransition` |
| `Ready` | `PendingReference` | `mark_pending_reference(reference_state)` | external consumer / refresh stale path | previously resolved reference became stale/unavailable;affected context loaded with version | `context_state = PendingReference`;写 latest reference state | save context or save reference state plus stale view marker per Step 9;query exposes degraded | `DomainError::InvalidStateTransition` |
| `Draft` / `Ready` / `PendingReference` | `Invalid` | `invalidate(reason, actor)` | context update / policy invalidation path | `GovernanceContextInvalidReason` present;no accepted Gate / Decision requires context to remain active | `context_state = Invalid`;写 `invalid_reason`;更新 actor | save context;append trace/history/outbox;mark affected views stale;store result | `DomainError::InvalidStateTransition` |
| `Ready` / `PendingReference` | `Closed` | `close(reason, actor)` | context close / maintenance closure path | `GovernanceContextCloseReason` present;no active open gate / unresolved mandatory action per repository reads | `context_state = Closed`;写 `close_reason`;更新 actor | save context;append trace/history/outbox;mark affected views stale;store result | `DomainError::InvalidStateTransition` |

| 停审项 | 结论 | 缺口 / 修正 |
|---|---|---|
| enum 是否存在 | 通过 | `GovernanceContextState` 已在 Step 6 定义 |
| 状态名是否一致 | 通过 | `Draft/Ready/PendingReference/Invalid/Closed` 全部一致 |
| 触发函数是否存在 | 通过 | Step 6 `from_subject/mark_ready/mark_pending_reference/invalidate/close` |
| 前置条件是否闭合 | 通过 | context policy、reference state、active gate/repository read 均由 Step 7/9 承接 |
| 副作用是否闭合 | 通过 | accepted path 按 Step 9 写 trace/audit/outbox/stale/result |
| 测试切口 | 通过 | factory 初始 Draft、ready requires policy、pending reference blocks mainline、terminal cannot reopen |

### 8.2 `GovernanceInputState`

```text
[GovernanceInput]
  Received -> Accepted -> PendingEvidence -> Accepted
  Received -> PendingEvidence
  Received -> Rejected
  Received -> Superseded
  Accepted -> Superseded
  PendingEvidence -> Superseded
```

| 状态 | 作用 | 是否终态 | 允许的关键操作 |
|---|---|---|---|
| `Received` | input 已接收,尚未形成正式处理线索 | 否 | `accept`、`reject`、`wait_for_evidence`、`supersede` |
| `Accepted` | input 可作为正式治理处理线索 | 否 | `wait_for_evidence`、`supersede`;不得自动创建 Gate / Decision |
| `PendingEvidence` | 等待 evidence summary 或 external reference | 否 | `accept`、`supersede` |
| `Rejected` | input 不具备治理意义 | 是 | 无 |
| `Superseded` | input 被后续 input 替代 | 是 | 无 |

| From | To | 触发函数 | Step 9 flow | 前置条件 | 状态副作用 | Flow 副作用 | 非法时错误 |
|---|---|---|---|---|---|---|---|
| factory | `Received` | `GovernanceInput::receive(...)` | `SubmitGovernanceInputFlow` | `context_ref` 指向已存在 context 且 context 非 `Invalid` / `Closed`;request kind/source 非空;id 来自 `new_governance_input_id()`;actor 来自 command actor context | 写 input id、actor、kind、source、context;terminal fields 为空 | save input as `Received`;append trace/audit/outbox/stale/result;不继续 accept 或 pending | `ApplicationError::InvalidCommandInput` |
| `Received` / `PendingEvidence` | `Accepted` | `accept(context, actor)` | `UpdateGovernanceInputStateFlow` | loaded context ref 等于 input.context_ref;context `Ready`;若 input 有 pending evidence,`ExternalGovernanceSourceResolverPort.resolve_evidence_summary(...)` 返回 resolved / verified surface | `input_state = Accepted`;清空 `pending_evidence_ref`;更新 accepted actor surface | save input with expected version;append trace/history/outbox;mark affected views stale;store result | `DomainError::InvalidStateTransition` |
| `Received` | `Rejected` | `reject(reason, actor)` | `UpdateGovernanceInputStateFlow` | request target `Rejected`;`reject_reason` 存在;input 尚未 terminal | `input_state = Rejected`;更新 actor surface;写 `reject_reason` | save input;append trace/history/outbox/stale/result | `DomainError::InvalidStateTransition` |
| `Received` / `Accepted` | `PendingEvidence` | `wait_for_evidence(evidence_ref, actor)` | `UpdateGovernanceInputStateFlow` | request `pending_evidence_ref` 存在;caller 明确要求等待该 evidence summary;本 flow 不从 `SubmitGovernanceInputRequest.source_ref` 推导 evidence | `input_state = PendingEvidence`;更新 actor surface;写 pending evidence ref | save input;append trace/history/outbox when command accepted;query exposes pending | `DomainError::InvalidStateTransition` |
| `Received` / `Accepted` / `PendingEvidence` | `Superseded` | `supersede(next_input_ref, actor)` | `UpdateGovernanceInputStateFlow` | `superseded_by` 存在;next ref 不等于 self;next input 已存在或同 transaction 创建 | `input_state = Superseded`;更新 actor surface;写 `superseded_by` | save input;append trace/history/outbox/stale/result | `DomainError::InvalidStateTransition` |

| 停审项 | 结论 | 缺口 / 修正 |
|---|---|---|
| enum 是否存在 | 通过 | `GovernanceInputState` 已在 Step 6 定义 |
| 状态名是否一致 | 通过 | `Received/Accepted/Rejected/PendingEvidence/Superseded` 全部一致 |
| 触发函数是否存在 | 通过 | Step 6 `receive/accept/reject/wait_for_evidence/supersede` |
| 前置条件是否闭合 | 通过 | DTO target state、context repository、evidence summary ref 均已闭合 |
| 副作用是否闭合 | 通过 | Step 9 已要求 trace/history/outbox/stale/stored result |
| 测试切口 | 通过 | accepted requires ready context;rejected requires reason;pending evidence requires ref;terminal cannot reopen |

### 8.3 `GateState`

```text
[Gate]
  Open -> PendingDecision -> Decided
  Open -> Expired
  PendingDecision -> Expired
  Open -> Cancelled
  PendingDecision -> Cancelled
```

| 状态 | 作用 | 是否终态 | 允许的关键操作 |
|---|---|---|---|
| `Open` | gate 已打开,尚未请求正式 decision | 否 | `request_decision_by_ref`、`expire`、`cancel` |
| `PendingDecision` | gate 已绑定责任或 requirement,等待正式裁决 | 否 | `attach_decision`、`expire`、`cancel` |
| `Decided` | gate 已绑定正式 `GovernanceDecisionRef` | 是 | 无 |
| `Expired` | gate 超时或不再有效 | 是 | 无 |
| `Cancelled` | gate 被显式取消 | 是 | 无 |

| From | To | 触发函数 | Step 9 flow | 前置条件 | 状态副作用 | Flow 副作用 | 非法时错误 |
|---|---|---|---|---|---|---|---|
| factory | `Open` | `Gate::open(...)` | `OpenGovernanceGateFlow` | context loaded and `Ready`;gate id 来自 `new_gate_id()`;gate kind 非空 | 写 gate id/context/kind;decision and terminal reason 为空 | no requirement path saves final `Open` gate;requirement path continues to `request_decision_by_ref(...)` before final save;append trace/audit/outbox/stale/result | `DomainError::InvalidStateTransition` |
| `Open` | `PendingDecision` | `request_decision_by_ref(responsibility_ref, responsibility_context_ref, actor)` | `OpenGovernanceGateFlow` approver requirement path / later formal approval binding path | responsibility context ref 等于 gate context;for `OpenGovernanceGateFlow`, responsibility/chain created or loaded in same command;`RecordGovernanceDecisionFlow` only accepts already `PendingDecision` gate and never performs this transition in precheck | `gate_state = PendingDecision`;写 `required_responsibility_ref` | save final gate with created responsibility/chain;append history/trace/outbox/stale/result | `DomainError::InvalidStateTransition` |
| `PendingDecision` | `Decided` | `attach_decision(decision, actor)` | `RecordGovernanceDecisionFlow` | decision gate ref 等于 self;decision `Approved/Rejected/Waived`;commit-03-c `DecisionPolicy` 已通过 chain guard;PH-04 shared rules guard 如适用已由 `SharedRulesPolicy` 处理 | `gate_state = Decided`;写 `decision_ref` | save gate and decision in same transaction;append decision record, trace, outbox, stale, result | `DomainError::InvalidStateTransition` |
| `Open` / `PendingDecision` | `Expired` | `expire(reason)` | gate timeout / maintenance path | `GateExpireReason` present;no finalized decision already attached | `gate_state = Expired`;写 `expire_reason` | save gate;append trace/history/outbox/stale/ops report as configured | `DomainError::InvalidStateTransition` |
| `Open` / `PendingDecision` | `Cancelled` | `cancel(reason, actor)` | gate cancel / superseded context path | `GateCancelReason` present;caller authorized;no finalized decision already attached | `gate_state = Cancelled`;写 `cancel_reason` | save gate;append trace/history/outbox/stale/result | `DomainError::InvalidStateTransition` |

| 停审项 | 结论 | 缺口 / 修正 |
|---|---|---|
| enum 是否存在 | 通过 | `GateState` 已在 Step 6 定义 |
| 状态名是否一致 | 通过 | `Open/PendingDecision/Decided/Expired/Cancelled` 全部一致 |
| 触发函数是否存在 | 通过 | Step 6 `open/request_decision_by_ref/attach_decision/expire/cancel` |
| 前置条件是否闭合 | 通过 | ready context、responsibility、decision、chain/policy reads 由 Step 7/9 承接 |
| 副作用是否闭合 | 通过 | gate accepted path 写 trace/history/outbox/stale/result |
| 测试切口 | 通过 | non-ready context rejected;decided requires finalized decision;expired/cancelled cannot attach decision |

### 8.4 `GovernanceDecisionState`

```text
[GovernanceDecision]
  Proposed -> Approved -> Superseded
  Proposed -> Rejected -> Superseded
  Proposed -> Waived -> Superseded
  Approved -> Revoked
  Rejected -> Revoked
  Waived -> Revoked
```

| 状态 | 作用 | 是否终态 | 允许的关键操作 |
|---|---|---|---|
| `Proposed` | decision 已提出但未形成 final outcome | 否 | `approve`、`reject`、`waive` |
| `Approved` | 正式批准 | 稳定结果,但可被替代/撤销 | `supersede`、`revoke` |
| `Rejected` | 正式拒绝 | 稳定结果,但可被替代/撤销 | `supersede`、`revoke` |
| `Waived` | 正式豁免 | 稳定结果,但可被替代/撤销 | `supersede`、`revoke` |
| `Superseded` | 被后续 decision 替代 | 是 | 无 |
| `Revoked` | finalized decision 被撤销 | 是 | 无 |

| From | To | 触发函数 | Step 9 flow | 前置条件 | 状态副作用 | Flow 副作用 | 非法时错误 |
|---|---|---|---|---|---|---|---|
| factory | `Proposed` | `GovernanceDecision::propose(...)` | `RecordGovernanceDecisionFlow` / `SupersedeGovernanceDecisionFlow` | gate loaded;gate `PendingDecision` 或 supersede flow 中 same gate;decision id 来自 id generator;outcome ref 非空 | 写 decision id/gate/kind/outcome;state `Proposed`;terminal fields 为空 | save decision after optional finalization;append decision record/trace/outbox/stale/result | `DomainError::InvalidStateTransition` |
| `Proposed` | `Approved` | `approve(basis_ref, actor)` | `RecordGovernanceDecisionFlow` / supersede next finalization | `GovernanceDecisionFinalizationIntent::Approve`;basis evidence summary acceptable;commit-03-c responsibility/chain guard 通过;PH-04 shared rules guard 如适用由 `SharedRulesPolicy` 处理 | `decision_state = Approved`;写 `basis_ref` | save decision;gate attach decision when finalized;append history/trace/outbox/stale/result | `DomainError::InvalidStateTransition` |
| `Proposed` | `Rejected` | `reject(reason, basis_ref, actor)` | `RecordGovernanceDecisionFlow` / supersede next finalization | finalization intent reject;`GovernanceRejectReason` present;optional basis ref 来自 `GovernanceDecisionFinalizationIntent::Reject` | `decision_state = Rejected`;写 `reject_reason`;若 `basis_ref` 为 `Some` 则写 decision `basis_ref` | save decision;gate attach decision when finalized;append history/trace/outbox/stale/result | `DomainError::InvalidStateTransition` |
| `Proposed` | `Waived` | `waive(reason, basis_ref, actor)` | `RecordGovernanceDecisionFlow` / supersede next finalization | finalization intent waive;`GovernanceWaiveReason` present;optional basis ref 来自 `GovernanceDecisionFinalizationIntent::Waive` | `decision_state = Waived`;写 `waive_reason`;若 `basis_ref` 为 `Some` 则写 decision `basis_ref` | save decision;gate attach decision when finalized;append history/trace/outbox/stale/result | `DomainError::InvalidStateTransition` |
| `Approved` / `Rejected` / `Waived` | `Superseded` | `supersede(next_decision_ref, actor)` | `SupersedeGovernanceDecisionFlow` | current finalized;next decision exists, same gate, and is proposed/finalized per `DecisionPolicy::assert_supersede_allowed` | `decision_state = Superseded`;写 `superseded_by` | save current and next;append trace/history/outbox/stale/result | `DomainError::InvalidStateTransition` |
| `Approved` / `Rejected` / `Waived` | `Revoked` | `revoke(reason, actor)` | revoke decision command / Step 12 recovery path | formal revoke reason and actor;no later superseding decision already set | `decision_state = Revoked`;写 `revoke_reason` | save decision;append trace/history/outbox/stale/result | `DomainError::InvalidStateTransition` |

| 停审项 | 结论 | 缺口 / 修正 |
|---|---|---|
| enum 是否存在 | 通过 | `GovernanceDecisionState` 已在 Step 6 定义 |
| 状态名是否一致 | 通过 | `Proposed/Approved/Rejected/Waived/Superseded/Revoked` 全部一致 |
| 触发函数是否存在 | 通过 | Step 6 `propose/approve/reject/waive/supersede/revoke` |
| 前置条件是否闭合 | 通过 | Step 8 finalization intent、basis/reason、Step 9 gate/chain/policy reads 闭合 |
| 副作用是否闭合 | 通过 | finalized path 与 gate attach 同 transaction,并写 outbox/stale/result |
| 测试切口 | 通过 | proposed not final;final outcomes cannot switch;supersede same gate;revoked terminal |

### 8.5 `ApprovalResponsibilityState`

```text
[ApprovalResponsibility]
  Required -> Assigned -> Accepted -> Voted -> Released
  Assigned -> Voted
  Assigned -> Delegated -> Released
  Accepted -> Delegated
  Required -> Released
```

| 状态 | 作用 | 是否终态 | 允许的关键操作 |
|---|---|---|---|
| `Required` | 责任要求已生成但未分配 actor | 否 | `assign`、`release` |
| `Assigned` | 已分配给 actor | 否 | `accept`、`record_vote`、`delegate_to`、`release` |
| `Accepted` | actor 已接受责任 | 否 | `record_vote`、`delegate_to`、`release` |
| `Voted` | 已记录投票或审批动作 | 否 | `release`;被 chain satisfaction 读取 |
| `Delegated` | 已委托给另一个 actor | 否 | `release`;后续责任由新 responsibility 或 chain 处理 |
| `Released` | 责任已释放 | 是 | 无 |

| From | To | 触发函数 | Step 9 flow | 前置条件 | 状态副作用 | Flow 副作用 | 非法时错误 |
|---|---|---|---|---|---|---|---|
| factory | `Required` | `ApprovalResponsibility::require(...)` | `OpenGovernanceGateFlow` / `AssignApprovalResponsibilityFlow` | context `Ready`;requirement exists;responsibility id 来自 id generator | 写 context/ref/requirement;actor/vote/delegation/release 为空 | save responsibility;optional append chain;trace/history/outbox/stale/result | `DomainError::InvalidStateTransition` |
| `Required` | `Assigned` | `assign(snapshot, assigned_by)` | `AssignApprovalResponsibilityFlow` | actor capability snapshot resolved;requirement matches snapshot;actor not already assigned | `responsibility_state = Assigned`;写 `actor_ref` | save responsibility;append responsibility trace/outbox/stale/result | `DomainError::InvalidStateTransition` |
| `Assigned` | `Accepted` | `accept(actor)` | approval accept path / reserved in command boundary | actor 等于 `actor_ref`;responsibility not terminal | `responsibility_state = Accepted` | save responsibility;append trace/history/outbox/stale/result | `DomainError::InvalidStateTransition` |
| `Assigned` / `Accepted` | `Voted` | `record_vote(vote, actor)` | `RecordApprovalVoteFlow` | actor 等于 assigned actor;vote present;duplicate vote absent unless idempotency duplicate replay | `responsibility_state = Voted`;写 `vote` | save responsibility;possibly mark chain `Satisfied`;append history/trace/outbox/stale/result | `DomainError::InvalidStateTransition` |
| `Assigned` / `Accepted` | `Delegated` | `delegate_to(delegate_ref, reason, actor)` | `DelegateApprovalResponsibilityFlow` | actor 等于 assigned actor;delegation reason present;delegation policy and delegate snapshot permit | `responsibility_state = Delegated`;写 `delegate_ref` / reason | save responsibility;append trace/history/outbox/stale/result;new responsibility only if Step 9 command says so | `DomainError::InvalidStateTransition` |
| `Required` / `Assigned` / `Accepted` / `Delegated` / `Voted` | `Released` | `release(reason, actor)` | release responsibility / chain close path | release reason present;caller authorized;not already released | `responsibility_state = Released`;写 `release_reason` | save responsibility;append trace/history/outbox/stale/result | `DomainError::InvalidStateTransition` |

| 停审项 | 结论 | 缺口 / 修正 |
|---|---|---|
| enum 是否存在 | 通过 | `ApprovalResponsibilityState` 已在 Step 6 定义 |
| 状态名是否一致 | 通过 | `Required/Assigned/Accepted/Voted/Delegated/Released` 全部一致 |
| 触发函数是否存在 | 通过 | Step 6 `require/assign/accept/record_vote/delegate_to/release` |
| 前置条件是否闭合 | 通过 | requirement、actor snapshot、delegation policy、vote DTO 均有来源 |
| 副作用是否闭合 | 通过 | vote 可触发 chain satisfied,但不直接形成 decision |
| 测试切口 | 通过 | assignment requires resolved snapshot;wrong actor rejected;vote not decision;released terminal |

### 8.6 `ResponsibilityChainState`

```text
[ResponsibilityChain]
  Open -> Satisfied -> Closed
  Open -> Escalated -> Closed
  Escalated -> Blocked -> Closed
  Open -> Blocked -> Closed
```

| 状态 | 作用 | 是否终态 | 允许的关键操作 |
|---|---|---|---|
| `Open` | 责任链等待责任满足 | 否 | `append`、`mark_satisfied`、`escalate`、`block` |
| `Satisfied` | 责任链满足正式裁决要求 | 否 | `close`;被 decision flow 读取 |
| `Escalated` | 责任链升级处理 | 否 | `block`、`close` |
| `Blocked` | 责任链无法满足要求 | 否 | `close` |
| `Closed` | 责任链结束 | 是 | 无 |

| From | To | 触发函数 | Step 9 flow | 前置条件 | 状态副作用 | Flow 副作用 | 非法时错误 |
|---|---|---|---|---|---|---|---|
| factory | `Open` | `ResponsibilityChain::start_for_context(...)` | `OpenGovernanceGateFlow` / `AssignApprovalResponsibilityFlow` | context `Ready`;requirement exists;chain id 来自 id generator | 写 chain id/context;refs empty;reason fields 空 | save chain;append initial responsibility separately;trace/outbox/stale/result | `DomainError::InvalidStateTransition` |
| `Open` | `Open` | `append(responsibility)` | `AssignApprovalResponsibilityFlow` | responsibility context 等于 chain context;responsibility ref not duplicate | ordered unique append responsibility ref;state 不变 | save chain with version;append trace/history/outbox/stale/result | `DomainError::InvalidStateTransition` |
| `Open` | `Satisfied` | `mark_satisfied(actor)` | `RecordApprovalVoteFlow` | threshold / requirement satisfied by loaded responsibility refs and votes;no blocking conflict | `chain_state = Satisfied` | save chain;decision flow may proceed;append trace/history/outbox/stale/result | `DomainError::InvalidStateTransition` |
| `Open` | `Escalated` | `escalate(reason, actor)` | escalation command / policy path | escalation reason present;threshold not satisfied;policy permits escalation | `chain_state = Escalated`;写 `escalation_reason` | save chain;append trace/history/outbox/stale/result | `DomainError::InvalidStateTransition` |
| `Open` / `Escalated` | `Blocked` | `block(reason)` | approval policy / capability missing path | block reason present;repository evidence proves threshold impossible or required actor unavailable | `chain_state = Blocked`;写 `block_reason` | save chain;append trace/history/outbox/stale/result;query exposes blocked | `DomainError::InvalidStateTransition` |
| `Satisfied` / `Blocked` / `Escalated` | `Closed` | `close(reason, actor)` | decision accepted / cleanup path | close reason present;no pending required responsibility remains for the chain | `chain_state = Closed`;写 `close_reason` | save chain;append trace/history/outbox/stale/result | `DomainError::InvalidStateTransition` |

| 停审项 | 结论 | 缺口 / 修正 |
|---|---|---|
| enum 是否存在 | 通过 | `ResponsibilityChainState` 已在 Step 6 定义 |
| 状态名是否一致 | 通过 | `Open/Satisfied/Escalated/Blocked/Closed` 全部一致 |
| 触发函数是否存在 | 通过 | Step 6 `start_for_context/append/mark_satisfied/escalate/block/close` |
| 前置条件是否闭合 | 通过 | threshold、responsibility refs、actor snapshot、policy decision 由 Step 7/9 承接 |
| 副作用是否闭合 | 通过 | chain satisfied 只支持 decision,不自动批准 |
| 测试切口 | 通过 | append only open;threshold satisfaction;blocked reason;closed terminal |

## 9. domain policy / shared rules / conflict 状态矩阵

### 9.1 `PolicyEffectiveState`

```text
[PolicyEffectiveFact]
  Proposed -> Effective -> Suspended -> Effective
  Proposed -> Superseded
  Effective -> Superseded
  Suspended -> Superseded
  Proposed -> Retired
  Effective -> Retired
  Suspended -> Retired
```

| 状态 | 作用 | 是否终态 | 允许的关键操作 |
|---|---|---|---|
| `Proposed` | policy fact 已提出,尚未生效 | 否 | `activate`、`supersede`、`retire` |
| `Effective` | policy fact 在 scope 内正式生效 | 否 | `suspend`、`supersede`、`retire`;被 guard 消费 |
| `Suspended` | policy fact 暂停生效 | 否 | `activate`、`supersede`、`retire` |
| `Superseded` | 被后续 fact 替代 | 是 | 无 |
| `Retired` | 退役不再适用 | 是 | 无 |

| From | To | 触发函数 | Step 9 flow | 前置条件 | 状态副作用 | Flow 副作用 | 非法时错误 |
|---|---|---|---|---|---|---|---|
| factory | `Proposed` | `PolicyEffectiveFact::propose(...)` | `ActivatePolicyEffectiveFactFlow` | method policy snapshot resolved/body-free;request `subject_ref` and `scope_ref` present;`resolve_scope_subject_relation(subject_ref, scope_ref)` returns `Allowed`;`PolicyScopePolicy::assert_scope_matches_subject(relation)` passes;`policy_snapshot.matches_scope(scope_ref)`;scope/priority present;id 来自 id generator | 写 policy definition/snapshot/scope/priority;state `Proposed` | save policy fact;detect optional conflict;append trace/history/outbox/stale/result | `DomainError::InvalidStateTransition` |
| `Proposed` / `Suspended` | `Effective` | `activate(snapshot, actor)` | `ActivatePolicyEffectiveFactFlow` / `UpdatePolicyEffectiveFactStateFlow` | snapshot resolved and same policy definition;`snapshot.matches_scope(self.scope_ref)`;shared rules / scope policy pass using Step 7 relation decision or loaded truth subject source;conflict policy permits activation | `policy_state = Effective`;更新 snapshot;清空 suspend reason | save policy;detect conflicts;append policy history/outbox/stale/result | `DomainError::InvalidStateTransition` |
| `Effective` | `Suspended` | `suspend(reason, actor)` | `UpdatePolicyEffectiveFactStateFlow` | suspend reason present;caller authorized;not terminal | `policy_state = Suspended`;写 `suspend_reason` | save policy;append trace/history/outbox/stale/result | `DomainError::InvalidStateTransition` |
| `Proposed` / `Effective` / `Suspended` | `Superseded` | `supersede(next_ref, actor)` | `UpdatePolicyEffectiveFactStateFlow` | next ref exists or same transaction creates next fact;same policy/scope replacement;next != self | `policy_state = Superseded`;写 `superseded_by` | save current and maybe next;append trace/history/outbox/stale/result | `DomainError::InvalidStateTransition` |
| `Proposed` / `Effective` / `Suspended` | `Retired` | `retire(reason, actor)` | `UpdatePolicyEffectiveFactStateFlow` | retire reason present;retirement does not violate active shared rules without replacement or conflict record | `policy_state = Retired`;写 `retire_reason` | save policy;append trace/history/outbox/stale/result;mark policy views stale | `DomainError::InvalidStateTransition` |

| 停审项 | 结论 | 缺口 / 修正 |
|---|---|---|
| enum 是否存在 | 通过 | `PolicyEffectiveState` 已在 Step 6 定义 |
| 状态名是否一致 | 通过 | `Proposed/Effective/Suspended/Superseded/Retired` 全部一致 |
| 触发函数是否存在 | 通过 | Step 6 `propose/activate/suspend/supersede/retire` |
| 前置条件是否闭合 | 通过 | method snapshot、request subject/scope、scope relation resolver、shared rules、conflict repository reads 已在 Step 7/9 闭合;Activate flow 不从 `scope_ref` 反推 `subject_ref`,也不做恒真同一性检查 |
| 副作用是否闭合 | 通过 | policy change history/outbox/stale/result and optional conflict record |
| 测试切口 | 通过 | body-free snapshot;effective requires resolved snapshot;suspended not consumed;terminal cannot activate |

### 9.2 `SharedRuleSetState`

```text
[SharedRuleSet]
  Draft -> Active -> Deprecated -> Retired
  Draft -> Retired
  Active -> Retired
```

| 状态 | 作用 | 是否终态 | 允许的关键操作 |
|---|---|---|---|
| `Draft` | shared rules 草稿 | 否 | `activate`、`add_rule`、`retire` |
| `Active` | shared rules 作为硬约束生效 | 否 | `add_rule`、`deprecate_rule`、`retire` |
| `Deprecated` | rule set 或其中规则已弃用但仍可追溯 | 否 | `retire` |
| `Retired` | rule set 退役 | 是 | 无 |

| From | To | 触发函数 | Step 9 flow | 前置条件 | 状态副作用 | Flow 副作用 | 非法时错误 |
|---|---|---|---|---|---|---|---|
| factory | `Draft` | `SharedRuleSet::draft(...)` | `UpdateSharedRuleSetFlow` | request `subject_ref` and `scope_ref` present;`resolve_scope_subject_relation(subject_ref, scope_ref)` returns `Allowed`;`PolicyScopePolicy::assert_scope_matches_subject(relation)` passes;rule set id 来自 id generator;no existing active set conflict unless policy permits | 写 rule set id/scope;rule refs empty;state `Draft` | save rule set;append trace/history/outbox/stale/result | `DomainError::InvalidStateTransition` |
| `Draft` | `Active` | `activate(actor)` | `UpdateSharedRuleSetFlow` | service/policy 校验 rule set completeness;does not weaken higher-scope hard rules | `rule_set_state = Active` | save rule set;detect policy conflicts;append history/outbox/stale/result | `DomainError::InvalidStateTransition` |
| `Draft` / `Active` | same state | `add_rule(rule_ref, actor)` | `UpdateSharedRuleSetFlow` | rule ref present;not duplicate;rule body not stored;active path does not create unresolved conflict silently | append rule ref;state 不变 | save rule set;detect optional conflict;append trace/history/outbox/stale/result | `DomainError::InvalidStateTransition` |
| `Active` | `Deprecated` | `deprecate_rule(rule_ref, reason, actor)` | `UpdateSharedRuleSetFlow` | rule exists;reason present;deprecation visible to query;not silently weakening hard rule without conflict/decision | `rule_set_state = Deprecated`;append deprecated rule;write reason | save rule set;append history/outbox/stale/result;mark policy views stale | `DomainError::InvalidStateTransition` |
| `Draft` / `Active` / `Deprecated` | `Retired` | `retire(reason, actor)` | `UpdateSharedRuleSetFlow` | retire reason present;retirement has replacement or formal decision when hard rule removal affects active policies | `rule_set_state = Retired`;write reason | save rule set;detect conflicts if needed;append trace/history/outbox/stale/result | `DomainError::InvalidStateTransition` |

| 停审项 | 结论 | 缺口 / 修正 |
|---|---|---|
| enum 是否存在 | 通过 | `SharedRuleSetState` 已在 Step 6 定义 |
| 状态名是否一致 | 通过 | `Draft/Active/Deprecated/Retired` 全部一致 |
| 触发函数是否存在 | 通过 | Step 6 `draft/activate/add_rule/deprecate_rule/retire` |
| 前置条件是否闭合 | 通过 | scope、rule ref、reason、conflict detection 均由 Step 7/9 承接 |
| 副作用是否闭合 | 通过 | shared rule change and optional conflict changed outbox/stale/result |
| 测试切口 | 通过 | active hard rule cannot be silently weakened;deprecated visible;retired terminal |

### 9.3 `PolicyConflictState`

```text
[PolicyConflictRecord]
  Detected -> PendingDecision -> Resolved
  PendingDecision -> Waived
  PendingDecision -> Invalid
  Detected -> Resolved
  Detected -> Waived
  Detected -> Invalid
```

| 状态 | 作用 | 是否终态 | 允许的关键操作 |
|---|---|---|---|
| `Detected` | policy conflict 已发现,尚未处理 | 否 | `mark_pending_decision`、`resolve`、`waive`、`invalidate` |
| `PendingDecision` | 等待 formal Governance decision | 否 | `resolve`、`waive`、`invalidate` |
| `Resolved` | 冲突已基于正式依据解决 | 是 | 无 |
| `Waived` | 冲突被正式豁免并保持可追溯 | 是 | 无 |
| `Invalid` | 冲突记录不成立或不再适用 | 是 | 无 |

| From | To | 触发函数 | Step 9 flow | 前置条件 | 状态副作用 | Flow 副作用 | 非法时错误 |
|---|---|---|---|---|---|---|---|
| factory | `Detected` | `PolicyConflictRecord::detect(...)` | `ActivatePolicyEffectiveFactFlow` / `UpdateSharedRuleSetFlow` | conflicting policy refs non-empty;scope present;shared rule set ref optional and stable;id from generator | write conflict refs/scope/shared rules;state `Detected` | save conflict;append policy history/trace/outbox/stale/result | `DomainError::InvalidStateTransition` |
| `Detected` | `PendingDecision` | `mark_pending_decision(gate, actor)` | `ResolvePolicyConflictFlow` | gate exists, same scope/context relation;gate can wait for decision;no prior resolution | `conflict_state = PendingDecision`;write `pending_gate_ref` | save conflict;append history/trace/outbox/stale/result | `DomainError::InvalidStateTransition` |
| `Detected` / `PendingDecision` | `Resolved` | `resolve(decision, actor)` | `ResolvePolicyConflictFlow` | decision finalized and formally resolves conflict;decision gate matches pending gate when present | `conflict_state = Resolved`;write `resolution_ref`;clear pending gate | save conflict;append policy history/outbox/stale/result;does not mutate policy facts | `DomainError::InvalidStateTransition` |
| `Detected` / `PendingDecision` | `Waived` | `waive(decision, reason, actor)` | `ResolvePolicyConflictFlow` | finalized decision supports waiver;waive reason present;shared rules policy permits waiver | `conflict_state = Waived`;write resolution and waive reason;clear pending gate | save conflict;append trace/history/outbox/stale/result;query exposes waived | `DomainError::InvalidStateTransition` |
| `Detected` / `PendingDecision` | `Invalid` | `invalidate(reason, actor)` | `ResolvePolicyConflictFlow` | invalid reason present;loaded policy/shared rule state proves conflict no longer applies | `conflict_state = Invalid`;write invalid reason;clear pending gate | save conflict;append trace/history/outbox/stale/result | `DomainError::InvalidStateTransition` |

| 停审项 | 结论 | 缺口 / 修正 |
|---|---|---|
| enum 是否存在 | 通过 | `PolicyConflictState` 已在 Step 6 定义 |
| 状态名是否一致 | 通过 | `Detected/PendingDecision/Resolved/Waived/Invalid` 全部一致 |
| 触发函数是否存在 | 通过 | Step 6 `detect/mark_pending_decision/resolve/waive/invalidate` |
| 前置条件是否闭合 | 通过 | conflict refs、gate、decision、reason、shared rules policy 均已闭合 |
| 副作用是否闭合 | 通过 | conflict handling 不改写 policy truth,只写 conflict/history/outbox/stale/result |
| 测试切口 | 通过 | waived requires decision;resolved clears pending gate;terminal cannot reopen |

## 10. domain control / compliance / corrective 状态矩阵

### 10.1 `ControlApplicabilityState`

```text
[ControlApplicability]
  PendingAssessment -> Applicable -> Superseded
  PendingAssessment -> NotApplicable -> Superseded
  PendingAssessment -> Excluded -> Superseded
```

| 状态 | 作用 | 是否终态 | 允许的关键操作 |
|---|---|---|---|
| `PendingAssessment` | 控制适用性等待评估 | 否 | `mark_applicable`、`mark_not_applicable`、`exclude` |
| `Applicable` | 控制适用于 context | 稳定结论,可被 supersede | `supersede`;被 review / coverage 读取 |
| `NotApplicable` | 控制不适用于 context | 稳定结论,可被 supersede | `supersede` |
| `Excluded` | 控制被有依据排除 | 稳定结论,可被 supersede | `supersede` |
| `Superseded` | 被后续 applicability fact 替代 | 是 | 无 |

| From | To | 触发函数 | Step 9 flow | 前置条件 | 状态副作用 | Flow 副作用 | 非法时错误 |
|---|---|---|---|---|---|---|---|
| factory | `PendingAssessment` | `ControlApplicability::assess(...)` | `AssessControlApplicabilityFlow` | context `Ready`;method control snapshot resolved/body-free;id from generator | write applicability id/context/control snapshot;state pending;basis/reason empty | save applicability;append control history/trace/outbox/stale/result | `DomainError::InvalidStateTransition` |
| `PendingAssessment` | `Applicable` | `mark_applicable(basis_ref, actor)` | `AssessControlApplicabilityFlow` | evidence summary ref acceptable;control policy says applicable;not body-derived locally | `applicability_state = Applicable`;write basis;clear reason | save applicability;append history/outbox/stale/result;coverage becomes stale | `DomainError::InvalidStateTransition` |
| `PendingAssessment` | `NotApplicable` | `mark_not_applicable(reason, actor)` | `AssessControlApplicabilityFlow` | reason present;control policy says not applicable;basis not required | `applicability_state = NotApplicable`;write reason | save applicability;append trace/history/outbox/stale/result | `DomainError::InvalidStateTransition` |
| `PendingAssessment` | `Excluded` | `exclude(reason, basis_ref, actor)` | `AssessControlApplicabilityFlow` | reason and evidence basis present;formal exclusion policy permits | `applicability_state = Excluded`;write reason and basis | save applicability;append history/outbox/stale/result;query exposes exclusion | `DomainError::InvalidStateTransition` |
| `Applicable` / `NotApplicable` / `Excluded` | `Superseded` | `supersede(next_ref, actor)` | reassessment / replacement path | next applicability exists or same transaction creates it;next ref != self;same context/control | `applicability_state = Superseded`;write `superseded_by` | save current/new;append trace/history/outbox/stale/result | `DomainError::InvalidStateTransition` |

| 停审项 | 结论 | 缺口 / 修正 |
|---|---|---|
| enum 是否存在 | 通过 | `ControlApplicabilityState` 已在 Step 6 定义 |
| 状态名是否一致 | 通过 | `PendingAssessment/Applicable/NotApplicable/Excluded/Superseded` 全部一致 |
| 触发函数是否存在 | 通过 | Step 6 `assess/mark_applicable/mark_not_applicable/exclude/supersede` |
| 前置条件是否闭合 | 通过 | context、snapshot、basis/reason、control policy 来源闭合 |
| 副作用是否闭合 | 通过 | applicability change writes history/outbox/stale/result;coverage does not write back |
| 测试切口 | 通过 | applicable/excluded require basis;not-applicable distinct from excluded;superseded terminal |

### 10.2 `ControlReviewState`

```text
[ControlReview]
  Planned -> InReview -> Passed
  InReview -> Failed
  InReview -> Waived
  Planned -> Superseded
  InReview -> Superseded
```

| 状态 | 作用 | 是否终态 | 允许的关键操作 |
|---|---|---|---|
| `Planned` | review 已计划 | 否 | `start`、`supersede` |
| `InReview` | review 正在执行 | 否 | `pass`、`fail`、`waive`、`supersede` |
| `Passed` | review 通过 | 是 | 无 |
| `Failed` | review 失败 | 是 | 无;可作为 nonconformity 输入线索 |
| `Waived` | review 被 formal decision 豁免 | 是 | 无 |
| `Superseded` | review 被后续 review 替代 | 是 | 无 |

| From | To | 触发函数 | Step 9 flow | 前置条件 | 状态副作用 | Flow 副作用 | 非法时错误 |
|---|---|---|---|---|---|---|---|
| factory | `Planned` | `ControlReview::plan(...)` | `RecordControlReviewFlow` | applicability loaded and `Applicable`;reviewer ref present;id from generator | write review id/applicability/reviewer;state planned | save review;append control history/trace/ControlReviewChanged outbox/stale/result using `control_review_subjects(review_ref)` | `DomainError::InvalidStateTransition` |
| `Planned` | `InReview` | `start(reviewer_ref)` | `RecordControlReviewFlow` | reviewer ref authorized;review not terminal | `review_state = InReview`;may update reviewer | save review;append history/ControlReviewChanged outbox/stale/result using `control_review_subjects(review_ref)` | `DomainError::InvalidStateTransition` |
| `InReview` | `Passed` | `pass(evidence_ref, actor)` | `RecordControlReviewFlow` | evidence summary acceptable;actor authorized reviewer | `review_state = Passed`;write evidence;clear failure/waiver | save review;append trace/history/ControlReviewChanged outbox/stale/result using `control_review_subjects(review_ref)` | `DomainError::InvalidStateTransition` |
| `InReview` | `Failed` | `fail(reason, evidence_ref, actor)` | `RecordControlReviewFlow` | failure reason and evidence present;actor authorized | `review_state = Failed`;write reason/evidence | save review;append control history/ControlReviewChanged outbox/stale/result using `control_review_subjects(review_ref)`;does not create nonconformity automatically | `DomainError::InvalidStateTransition` |
| `InReview` | `Waived` | `waive(decision, actor)` | `RecordControlReviewFlow` | decision finalized and permits waiver;not from config/runtime only | `review_state = Waived`;write waiver decision ref | save review;append trace/history/ControlReviewChanged outbox/stale/result using `control_review_subjects(review_ref)` | `DomainError::InvalidStateTransition` |
| `Planned` / `InReview` | `Superseded` | `supersede(next_ref, actor)` | `RecordControlReviewFlow` | next review exists or same transaction creates it;same applicability;next != self | `review_state = Superseded`;write `superseded_by` | save review;append trace/history/ControlReviewChanged outbox/stale/result using `control_review_subjects(review_ref)` | `DomainError::InvalidStateTransition` |

| 停审项 | 结论 | 缺口 / 修正 |
|---|---|---|
| enum 是否存在 | 通过 | `ControlReviewState` 已在 Step 6 定义 |
| 状态名是否一致 | 通过 | `Planned/InReview/Passed/Failed/Waived/Superseded` 全部一致 |
| 触发函数是否存在 | 通过 | Step 6 `plan/start/pass/fail/waive/supersede` |
| 前置条件是否闭合 | 通过 | applicability、reviewer、evidence、decision、reason 均有 DTO / repository 来源 |
| 副作用是否闭合 | 通过 | failed review does not create nonconformity;only history/outbox/stale/result |
| 测试切口 | 通过 | plan requires applicable;waive requires decision;terminal cannot reopen |

### 10.3 `ComplianceConclusionState`

```text
[AIIAConclusion / SoAConclusion]
  Drafted -> InReview -> Approved -> Superseded
  InReview -> Rejected -> Superseded
  Drafted -> Superseded
  InReview -> Superseded
  Approved -> Revoked
  Rejected -> Revoked
```

| 状态 | 作用 | 是否终态 | 允许的关键操作 |
|---|---|---|---|
| `Drafted` | AIIA / SoA conclusion 草稿 | 否 | `submit_for_review`、`supersede`;SoA 可 `attach_control_coverage` |
| `InReview` | conclusion 正在治理评审 | 否 | `approve`、`reject`、`supersede` |
| `Approved` | conclusion 被正式批准 | 稳定结论,可 supersede/revoke | `supersede`、`revoke` |
| `Rejected` | conclusion 被正式拒绝 | 稳定结论,可 supersede/revoke | `supersede`、`revoke` |
| `Superseded` | 被后续 conclusion 替代 | 是 | 无 |
| `Revoked` | finalized conclusion 被 formal decision 撤销 | 是 | 无 |

| From | To | 触发函数 | Step 9 flow | 前置条件 | 状态副作用 | Flow 副作用 | 非法时错误 |
|---|---|---|---|---|---|---|---|
| factory | `Drafted` | `AIIAConclusion::from_artifact(...)` / `SoAConclusion::from_artifact(...)` | `SubmitAIIAConclusionFlow` / `SubmitSoAConclusionFlow` | context `Ready`;artifact ref body-free;id from generator | write conclusion id/context/artifact;state drafted;decision/evidence fields empty | save conclusion;append compliance history/trace/outbox/stale/result | `DomainError::InvalidStateTransition` |
| `Drafted` | `Drafted` | `SoAConclusion::attach_control_coverage(...)` | `SubmitSoAConclusionFlow` | branch is SoA;coverage ref present and stable;state still drafted | write `control_coverage_ref`;state 不变 | save SoA;append trace/history/outbox/stale/result if accepted | `DomainError::InvalidStateTransition` |
| `Drafted` | `InReview` | `submit_for_review(evidence_ref, actor)` | `SubmitAIIAConclusionFlow` / `SubmitSoAConclusionFlow` | evidence summary acceptable;SoA requires `control_coverage_ref`;artifact body not stored | `conclusion_state = InReview`;write review evidence | save conclusion;append compliance history/outbox/stale/result | `DomainError::InvalidStateTransition` |
| `InReview` | `Approved` | `approve(decision, actor)` | `ApproveComplianceConclusionFlow` | decision finalized and permits approval;SoA coverage present;formal evidence surface exists | `conclusion_state = Approved`;write decision ref;clear reject reason | save conclusion;append trace/history/outbox/stale/result | `DomainError::InvalidStateTransition` |
| `InReview` | `Rejected` | `reject(decision, reason, actor)` | `ApproveComplianceConclusionFlow` | decision finalized;reject reason present | `conclusion_state = Rejected`;write decision ref and reject reason | save conclusion;append trace/history/outbox/stale/result | `DomainError::InvalidStateTransition` |
| `Drafted` / `InReview` / `Approved` / `Rejected` | `Superseded` | `supersede(next_ref, actor)` | conclusion replacement path | next conclusion exists or same transaction creates it;same branch/context;next != self | `conclusion_state = Superseded`;write `superseded_by` | save current/new;append compliance history/outbox/stale/result | `DomainError::InvalidStateTransition` |
| `Approved` / `Rejected` | `Revoked` | `revoke(decision, actor)` | `ApproveComplianceConclusionFlow` revoke intent / recovery path | revocation decision finalized;original decision retained;conclusion not superseded | `conclusion_state = Revoked`;write `revocation_decision_ref` | save conclusion;append trace/history/outbox/stale/result | `DomainError::InvalidStateTransition` |

| 停审项 | 结论 | 缺口 / 修正 |
|---|---|---|
| enum 是否存在 | 通过 | `ComplianceConclusionState` 已在 Step 6 定义 |
| 状态名是否一致 | 通过 | `Drafted/InReview/Approved/Rejected/Superseded/Revoked` 全部一致 |
| 触发函数是否存在 | 通过 | AIIA / SoA factory, submit, approve, reject, supersede, revoke 均存在 |
| 前置条件是否闭合 | 通过 | artifact ref、evidence、decision、SoA coverage 均由 Step 8/9 明确 |
| 副作用是否闭合 | 通过 | compliance changed history/outbox/stale/result;does not save artifact body |
| 测试切口 | 通过 | SoA coverage required;finalized requires decision;revoked preserves original decision;terminal cannot reopen |

### 10.4 `NonconformityState`

```text
[NonconformityRecord]
  Raised -> CauseConfirmed -> Correcting -> ReadyForVerification -> Closed -> Reopened -> Correcting
  Raised -> Rejected
```

| 状态 | 作用 | 是否终态 | 允许的关键操作 |
|---|---|---|---|
| `Raised` | 不符合已正式提出 | 否 | `confirm_cause`、`reject` |
| `CauseConfirmed` | 原因已确认 | 否 | `start_correction` |
| `Correcting` | 正在纠正 | 否 | `mark_ready_for_verification` |
| `ReadyForVerification` | 等待复验 | 否 | `close` with passed verification |
| `Closed` | 复验通过后关闭 | 否,可显式重开 | `reopen` |
| `Reopened` | 已关闭不符合被重开 | 否 | `start_correction` |
| `Rejected` | 不符合线索不成立 | 是 | 无 |

| From | To | 触发函数 | Step 9 flow | 前置条件 | 状态副作用 | Flow 副作用 | 非法时错误 |
|---|---|---|---|---|---|---|---|
| factory | `Raised` | `NonconformityRecord::raise(...)` | `RaiseNonconformityFlow` | context `Ready`;source ref body-free;severity/owner present;id from generator | write context/severity/source/owner;state raised;closure fields empty | save record;append nonconformity history/trace/outbox/stale/result | `DomainError::InvalidStateTransition` |
| `Raised` | `CauseConfirmed` | `confirm_cause(cause_ref, actor)` | `ConfirmNonconformityCauseFlow` | cause ref present and body-free;record not terminal | `record_state = CauseConfirmed`;write cause ref | save record;append history/outbox/stale/result | `DomainError::InvalidStateTransition` |
| `CauseConfirmed` / `Reopened` | `Correcting` | `start_correction(action, actor)` | `PlanCorrectiveActionFlow` | action belongs to record;action state `Planned`;closure policy allows correction | `record_state = Correcting`;write active action ref | save action and record;append history/trace/outbox/stale/result | `DomainError::InvalidStateTransition` |
| `Correcting` | `ReadyForVerification` | `mark_ready_for_verification(actor)` | `CompleteCorrectiveActionFlow` | active corrective action is `Completed`;completion evidence present;policy permits verification | `record_state = ReadyForVerification` | save action and record;append history/outbox/stale/result | `DomainError::InvalidStateTransition` |
| `ReadyForVerification` | `Closed` | `close(result, actor)` | `VerifyNonconformityFlow` | verification result belongs to record and `VerificationState::Passed`;result evidence body-free | `record_state = Closed`;write closure verification ref | save verification and record;append closure history/trace/outbox/stale/result | `DomainError::InvalidStateTransition` |
| `Closed` | `Reopened` | `reopen(reason, actor)` | reopen nonconformity command / recovery path | reopen reason present;caller authorized;record closed | `record_state = Reopened`;write reopen reason;keep closure verification ref | save record;append trace/history/outbox/stale/result | `DomainError::InvalidStateTransition` |
| `Raised` | `Rejected` | `reject(reason, actor)` | reject nonconformity path | reject reason present;no confirmed cause/correction exists | `record_state = Rejected`;write reject reason | save record;append trace/history/outbox/stale/result | `DomainError::InvalidStateTransition` |

| 停审项 | 结论 | 缺口 / 修正 |
|---|---|---|
| enum 是否存在 | 通过 | `NonconformityState` 已在 Step 6 定义 |
| 状态名是否一致 | 通过 | `Raised/CauseConfirmed/Correcting/ReadyForVerification/Closed/Reopened/Rejected` 全部一致 |
| 触发函数是否存在 | 通过 | Step 6 `raise/confirm_cause/start_correction/mark_ready_for_verification/close/reopen/reject` |
| 前置条件是否闭合 | 通过 | cause/action/verification/evidence/reason refs 均由 DTO / repository 提供 |
| 副作用是否闭合 | 通过 | corrective and verification changes write history/outbox/stale/result;external defect never overwrites state |
| 测试切口 | 通过 | closed requires passed verification;failed verification cannot close;reopen keeps history;rejected terminal |

### 10.5 `CorrectiveActionState`

```text
[CorrectiveAction]
  Planned -> InProgress -> Completed
  Planned -> Cancelled
  InProgress -> Cancelled
  Planned -> Failed
  InProgress -> Failed
```

| 状态 | 作用 | 是否终态 | 允许的关键操作 |
|---|---|---|---|
| `Planned` | action 已计划但未开始 | 否 | `start`、`cancel`、`fail` |
| `InProgress` | action 正在执行 | 否 | `complete`、`cancel`、`fail` |
| `Completed` | action 已完成并有 evidence | 是 | 无;可使 record 进入 ready for verification |
| `Cancelled` | action 已取消 | 是 | 无 |
| `Failed` | action 执行失败 | 是 | 无 |

| From | To | 触发函数 | Step 9 flow | 前置条件 | 状态副作用 | Flow 副作用 | 非法时错误 |
|---|---|---|---|---|---|---|---|
| factory | `Planned` | `CorrectiveAction::plan(...)` | `PlanCorrectiveActionFlow` | nonconformity can start correction;owner ref present;optional work ref body-free;id from generator | write action id/nonconformity/owner/work;state planned | save action;record may start correction;append history/outbox/stale/result | `DomainError::InvalidStateTransition` |
| `Planned` | `InProgress` | `start(actor)` | `CompleteCorrectiveActionFlow` start intent | actor authorized;action not terminal | `action_state = InProgress` | save action;append corrective history/trace/outbox/stale/result | `DomainError::InvalidStateTransition` |
| `InProgress` | `Completed` | `complete(evidence_ref, actor)` | `CompleteCorrectiveActionFlow` complete intent | completion evidence summary present and acceptable;action belongs to active nonconformity | `action_state = Completed`;write completion evidence | save action;mark record ready for verification;append history/outbox/stale/result | `DomainError::InvalidStateTransition` |
| `Planned` / `InProgress` | `Cancelled` | `cancel(reason, actor)` | `CompleteCorrectiveActionFlow` cancel intent | cancel reason present;record policy permits cancellation | `action_state = Cancelled`;write cancel reason | save action;append trace/history/outbox/stale/result;record not closed | `DomainError::InvalidStateTransition` |
| `Planned` / `InProgress` | `Failed` | `fail(reason, actor)` | `CompleteCorrectiveActionFlow` fail intent | failure reason present;record policy permits failure marker | `action_state = Failed`;write failure reason | save action;append trace/history/outbox/stale/result;record not closed | `DomainError::InvalidStateTransition` |

| 停审项 | 结论 | 缺口 / 修正 |
|---|---|---|
| enum 是否存在 | 通过 | `CorrectiveActionState` 已在 Step 6 定义 |
| 状态名是否一致 | 通过 | `Planned/InProgress/Completed/Cancelled/Failed` 全部一致 |
| 触发函数是否存在 | 通过 | Step 6 `plan/start/complete/cancel/fail` |
| 前置条件是否闭合 | 通过 | action ref、owner、evidence、reason、record read 均有来源 |
| 副作用是否闭合 | 通过 | completed only moves record to ready-for-verification,not closed |
| 测试切口 | 通过 | complete requires evidence;cancel/fail reason;terminal cannot restart |

### 10.6 `VerificationState`

```text
[VerificationResult]
  factory -> Passed
  factory -> Failed
  factory -> Inconclusive
  Passed -> consumed by NonconformityRecord::close
```

| 状态 | 作用 | 是否终态 | 允许的关键操作 |
|---|---|---|---|
| `Passed` | 复验通过,可支持关闭 nonconformity | 结果终态 | 被 `NonconformityRecord::close` 消费 |
| `Failed` | 复验失败,需要重新纠正或处置 | 结果终态 | 无;flow 不关闭 record |
| `Inconclusive` | 复验无法形成可靠结论 | 结果终态 | 无;flow 不关闭 record |

| From | To | 触发函数 | Step 9 flow | 前置条件 | 状态副作用 | Flow 副作用 | 非法时错误 |
|---|---|---|---|---|---|---|---|
| factory | `Passed` | `VerificationResult::from_evidence(..., VerificationState::Passed)` | `VerifyNonconformityFlow` | record `ReadyForVerification`;evidence summary present;verifier present;id from generator | create immutable verification result with state `Passed` | save verification;then close record in same transaction;append history/outbox/stale/result | `DomainError::InvalidStateTransition` |
| factory | `Failed` | `VerificationResult::from_evidence(..., VerificationState::Failed)` | `VerifyNonconformityFlow` | record ready for verification;evidence/verifier present | create immutable result with state `Failed` | save verification;do not close record;append verification history/result | `DomainError::InvalidStateTransition` |
| factory | `Inconclusive` | `VerificationResult::from_evidence(..., VerificationState::Inconclusive)` | `VerifyNonconformityFlow` | record ready for verification;evidence/verifier present | create immutable result with state `Inconclusive` | save verification;do not close record;append verification history/result | `DomainError::InvalidStateTransition` |

| 停审项 | 结论 | 缺口 / 修正 |
|---|---|---|
| enum 是否存在 | 通过 | `VerificationState` 已在 Step 6 定义 |
| 状态名是否一致 | 通过 | `Passed/Failed/Inconclusive` 全部一致 |
| 触发函数是否存在 | 通过 | Step 6 `VerificationResult::from_evidence` |
| 前置条件是否闭合 | 通过 | record/evidence/verifier/state 均来自 request + repository |
| 副作用是否闭合 | 通过 | only Passed can close record;failed/inconclusive remain visible |
| 测试切口 | 通过 | result immutable;failed/inconclusive cannot close;passed result must relate to record |

## 11. projection / reference / outbox / report / handoff 状态矩阵

### 11.1 `DerivedGovernanceViewFreshnessState`

```text
[DerivedGovernanceViewState]
  Fresh -> Stale -> Rebuilding -> Fresh
  Stale -> Failed -> Rebuilding
  Rebuilding -> Failed
  Unavailable -> Rebuilding
```

| 状态 | 作用 | 是否终态 | 允许的关键操作 |
|---|---|---|---|
| `Fresh` | view 已追上 source cursor | 否 | `mark_stale`;query 可无 degraded marker 返回 |
| `Stale` | view 落后于 truth / snapshot | 否 | `start_rebuild`、`mark_failed`;query 必须暴露 freshness |
| `Rebuilding` | view 正在重建 | 否 | `mark_fresh`、`mark_failed`;query 按 Step 8/9 fallback surface |
| `Failed` | 最近维护失败 | 否 | `start_rebuild`;query 必须 degraded |
| `Unavailable` | view 不可服务 | 否 | `start_rebuild`;query 不得伪装 fresh |

| From | To | 触发函数 | Step 9 flow | 前置条件 | 状态副作用 | Flow 副作用 | 非法时错误 |
|---|---|---|---|---|---|---|---|
| factory | `Fresh` | `DerivedGovernanceViewState::for_view(...)` | projection state init / `RebuildGovernanceProjectionsFlow` | formal `DerivedGovernanceViewRef` exists;source cursor present;expected version `None` | create state with `Fresh`;failure ref empty | save/replace view state with view body in projection repo | `DomainError::InvalidStateTransition` |
| `Fresh` | `Stale` | `mark_stale(cursor)` | command accepted / consumer accepted / refresh success stale marking | affected view refs come from Step 7 repository;cursor >= current source cursor | `freshness_state = Stale`;update source cursor;keep last failure visible | projection_repo.mark_stale;append optional `DerivedGovernanceViewChanged` outbox if configured | `DomainError::InvalidStateTransition` |
| `Stale` / `Failed` / `Unavailable` | `Rebuilding` | `start_rebuild(cursor)` | `RebuildGovernanceProjectionsFlow` | job has versioned state read;target resolved by `resolve_projection_target`;source reads available enough to attempt rebuild | `freshness_state = Rebuilding`;update source cursor | save state/replace view in job transaction;report view scanned | `DomainError::InvalidStateTransition` |
| `Rebuilding` | `Fresh` | `mark_fresh(cursor)` | `RebuildGovernanceProjectionsFlow` | typed view body built from committed truth/snapshots;replace_*_view succeeded | `freshness_state = Fresh`;update source cursor;clear failure ref | replace public view + state atomically;record rebuilt view ref in job report | `DomainError::InvalidStateTransition` |
| `Stale` / `Rebuilding` | `Failed` | `mark_failed(failure_ref)` | rebuild item failure | failure marker/report item ref persisted;source truth missing or builder failure not classified unavailable | `freshness_state = Failed`;write last failure ref | save state with expected version;record failed item;do not create placeholder view | `DomainError::InvalidStateTransition` |
| `Fresh` / `Stale` / `Rebuilding` / `Failed` | `Unavailable` | repository state update by maintenance policy | rebuild / query degraded path | projection source or storage unavailable and formal issue/failure ref exists | `freshness_state = Unavailable`;preserve cursor and failure context | save state;query returns unavailable/degraded;job report records failed view | `ApplicationError::InvalidStateTransition` |

| 停审项 | 结论 | 缺口 / 修正 |
|---|---|---|
| enum 是否存在 | 通过 | `DerivedGovernanceViewFreshnessState` 已在 Step 6 定义 |
| 状态名是否一致 | 通过 | `Fresh/Stale/Rebuilding/Failed/Unavailable` 全部一致 |
| Step 9 待决点 | 已闭口 | rebuild success uses `Rebuilding -> Fresh`;item failure uses `Stale/Rebuilding -> Failed`;source/storage unavailable uses `Unavailable` |
| 前置条件是否闭合 | 通过 | affected views and projection targets come from Step 7,not ad hoc ids |
| 副作用是否闭合 | 通过 | projection state does not repair truth;query no-write |
| 测试切口 | 通过 | stale visible;failed rebuild no placeholder;unavailable degraded;fresh replacement atomic |

### 11.2 `ReferenceResolutionKind`

```text
[ReferenceResolutionState]
  Unresolved -> Resolved -> Stale -> Resolved
  Resolved -> Unavailable -> Resolved
  Unresolved -> Unavailable -> Resolved
  Unresolved -> Invalid
  Resolved -> Invalid
  Stale -> Invalid
```

| 状态 | 作用 | 是否终态 | 允许的关键操作 |
|---|---|---|---|
| `Resolved` | external ref 已解析到 source version | 否 | `mark_stale`、`mark_invalid`、`mark_unavailable`;被 domain policy/query 消费 |
| `Unresolved` | 暂未解析 | 否 | `mark_resolved`、`mark_invalid`、`mark_unavailable` |
| `Stale` | source version 过期 | 否 | `mark_resolved`、`mark_invalid`、`mark_unavailable` |
| `Invalid` | reference 无效 | 是 | 无;恢复必须新建或 formal replacement |
| `Unavailable` | source 暂不可用 | 否 | `mark_resolved` |

| From | To | 触发函数 | Step 9 flow | 前置条件 | 状态副作用 | Flow 副作用 | 非法时错误 |
|---|---|---|---|---|---|---|---|
| factory | `Unresolved` | `ReferenceResolutionState::for_reference(...)` | consumer pending / refresh tracking | external reference ref and `GovernanceReferenceRefreshTarget` present;checked_at from clock;no source version yet | state unresolved;refresh target stored;failure reason empty or pending reason by flow | save reference state with expected version `None`;query degraded | `ContractError::InvalidStateTransition` |
| `Unresolved` / `Stale` / `Unavailable` | `Resolved` | `mark_resolved(version, checked_at)` | inbound consumer / `RefreshExternalContextSnapshotsFlow` | resolver returned source version and body-free snapshot;version matches reference | state resolved;write source version;clear failure reason;update checked_at | save reference state with version;save typed snapshot;mark affected views stale | `ContractError::InvalidStateTransition` |
| `Resolved` | `Stale` | `mark_stale(reason, checked_at)` | inbound external changed consumer | source version moved or stale event accepted;reason present | state stale;keep or update source version per Step 11;write checked_at | save reference state;mark affected views stale;store consumer receipt | `ContractError::InvalidStateTransition` |
| `Unresolved` / `Resolved` / `Stale` | `Unavailable` | `mark_unavailable(reason, checked_at)` | refresh resolver unavailable path | resolver failure classified temporary;reason redacted/body-free | state unavailable;write failure reason/checked_at | save state with expected version;job report failed refs;no implicit stale unless Step 13 says so | `ContractError::InvalidStateTransition` |
| `Unresolved` / `Resolved` / `Stale` | `Invalid` | `mark_invalid(reason, checked_at)` | consumer delete/invalid signal / refresh validation failure | invalid reason present;source says ref invalid or schema not acceptable | state invalid;write failure reason/checked_at | save state;mark affected views stale/degraded;do not delete snapshots unless Step 11 says | `ContractError::InvalidStateTransition` |

| 停审项 | 结论 | 缺口 / 修正 |
|---|---|---|
| enum 是否存在 | 通过 | `ReferenceResolutionKind` 已在 Step 6 定义 |
| 状态名是否一致 | 通过 | `Resolved/Unresolved/Stale/Invalid/Unavailable` 全部一致 |
| 触发函数是否存在 | 通过 | Step 6 `for_reference/mark_resolved/mark_unresolved/mark_stale/mark_invalid` and unavailable path |
| 前置条件是否闭合 | 通过 | Step 7 list/read with version and resolver result are formal |
| 副作用是否闭合 | 通过 | reference state/snapshot/stale marker only;never sibling truth |
| 测试切口 | 通过 | resolved requires version;invalid terminal;failure uses expected version;affected views from repository |

### 11.3 `OutboxPublicationState`

```text
[GovernanceOutboxRecord]
  Pending -> Published
  Pending -> Failed -> Pending
  Pending -> DeadLettered
  Failed -> DeadLettered
```

| 状态 | 作用 | 是否终态 | 允许的关键操作 |
|---|---|---|---|
| `Pending` | accepted truth 等待发布 | 否 | `mark_published`、`mark_failed`、`mark_dead_lettered` |
| `Published` | 发布成功 | 是 | 无 |
| `Failed` | 可重试发布失败 | 否 | `retry`、`mark_dead_lettered` |
| `DeadLettered` | 不可恢复发布失败 | 是 | 无;恢复必须由后续 Step 12/13 formal operation |

| From | To | 触发函数 | Step 9 flow | 前置条件 | 状态副作用 | Flow 副作用 | 非法时错误 |
|---|---|---|---|---|---|---|---|
| factory | `Pending` | `GovernanceOutboxRecord::from_truth_change(...)` | command accepted outbox append | accepted truth change committed in same transaction;trace ref saved;payload snapshot saved;outbox id from generator | state pending;write event kind/subject/cursor/trace;publication fields empty | append outbox and payload snapshot in same transaction as truth change | `DomainError::InvalidStateTransition` |
| `Pending` | `Published` | `mark_published(publication_ref)` | `PublishGovernanceOutboxFlow` | publisher sent stored payload snapshot successfully;expected version from pending record | state published;write publication ref | outbox_repo.mark_published;job report changed count;no truth write | `DomainError::InvalidStateTransition` |
| `Pending` | `Failed` | `mark_failed(reason)` | `PublishGovernanceOutboxFlow` | publisher failure classified retryable by Step 13 policy;reason redacted | state failed;write last failure reason | mark_failed with expected version;job report failed count;truth unchanged | `DomainError::InvalidStateTransition` |
| `Failed` | `Pending` | `retry()` | publish retry scheduling path | retry policy permits another attempt;record not dead-lettered;expected version from failed record | state pending;preserve last failure reason for visibility | mark_pending_for_retry with expected version;job report scheduled retry | `DomainError::InvalidStateTransition` |
| `Pending` / `Failed` | `DeadLettered` | `mark_dead_lettered(reason)` | fatal publish failure / retry exhausted path | failure classified unrecoverable or retry exhausted;dead-letter reason present | state dead-lettered;write dead-letter reason | mark_dead_lettered with expected version;job report failed/dead-letter count;no truth rollback | `DomainError::InvalidStateTransition` |

| 停审项 | 结论 | 缺口 / 修正 |
|---|---|---|
| enum 是否存在 | 通过 | `OutboxPublicationState` 已在 Step 6 定义 |
| 状态名是否一致 | 通过 | `Pending/Published/Failed/DeadLettered` 全部一致 |
| Step 9 待决点 | 已闭口 | retryable failure uses `Failed -> Pending`;unrecoverable or exhausted uses `Failed/Pending -> DeadLettered` |
| 前置条件是否闭合 | 通过 | publisher only uses stored payload snapshot and expected version |
| 副作用是否闭合 | 通过 | publish state never rolls back truth or rebuilds payload from current truth |
| 测试切口 | 通过 | pending publish;retry preserves failure;dead-letter terminal;publisher does not recalc payload |

### 11.4 `ReconciliationReportState`

```text
[GovernanceReconciliationReport]
  factory -> Generated -> Superseded
  factory -> Failed -> Superseded
```

| 状态 | 作用 | 是否终态 | 允许的关键操作 |
|---|---|---|---|
| `Generated` | 对账报告成功生成 | 否,可被后续报告替代 | `supersede` by later report |
| `Failed` | 对账失败但形成可见失败报告 | 否,可被后续报告替代 | `supersede` by later report |
| `Superseded` | 被后续 report 替代 | 是 | 无 |

| From | To | 触发函数 | Step 9 flow | 前置条件 | 状态副作用 | Flow 副作用 | 非法时错误 |
|---|---|---|---|---|---|---|---|
| factory | `Generated` | `GovernanceReconciliationReport::from_reconciliation(...)` | `RunGovernanceReconciliationFlow` | input valid;truth snapshot/projection/outbox reads completed;report id from generator | report state generated;copy scope/cursor/finding refs/view/outbox refs | save report;store job report;does not repair truth | `ContractError::InvalidStateTransition` |
| factory | `Failed` | `GovernanceReconciliationReport::failed(...)` | `RunGovernanceReconciliationFlow` | input valid enough to persist failure;failure finding refs present or failure surface built | report state failed;copy input and failure findings | save failed report;job report failed/partial;no repair | `ContractError::InvalidStateTransition` |
| `Generated` / `Failed` | `Superseded` | report repository supersede operation | later reconciliation for same scope/report lineage | later report exists and is saved;current report loaded with version | state superseded or repository latest pointer updated per Step 11 | save superseded marker/latest pointer;query latest excludes old report by default | `ApplicationError::InvalidStateTransition` |

| 停审项 | 结论 | 缺口 / 修正 |
|---|---|---|
| enum 是否存在 | 通过 | `ReconciliationReportState` 已在 Step 6 定义 |
| 状态名是否一致 | 通过 | `Generated/Failed/Superseded` 全部一致 |
| 触发函数是否存在 | 通过 | Step 6 report factories exist;supersede persistence pointer belongs Step 11 |
| 前置条件是否闭合 | 通过 | reconciliation input, report id, finding refs, surface are defined |
| 副作用是否闭合 | 通过 | report only saves findings/result,never repairs truth/projection/outbox inline |
| 测试切口 | 通过 | no findings generated report;failed report visible;later report supersedes old |

### 11.5 `GovernanceHandoffState`

```text
[GovernanceHandoffMarker]
  factory -> Prepared -> Delivered
  factory -> Prepared -> Failed
  factory -> Failed
```

| 状态 | 作用 | 是否终态 | 允许的关键操作 |
|---|---|---|---|
| `Prepared` | handoff / export package 已准备 | 否 | `mark_delivered`、`mark_failed` |
| `Delivered` | package 已被 target 接收 | 是 | 无 |
| `Failed` | prepare 或 delivery 失败 | 是 | 无;retry creates new marker or formal retry operation |

| From | To | 触发函数 | Step 9 flow | 前置条件 | 状态副作用 | Flow 副作用 | 非法时错误 |
|---|---|---|---|---|---|---|---|
| factory | `Prepared` | `GovernanceHandoffMarker::prepared(...)` | trace/archive/export handoff success prepare path | marker ref from id generator;trace_refs non-empty;target enabled;package ref returned by adapter | state prepared;write package ref;receipt/failure empty | save marker;record marker ref in job report;no external body saved | `ContractError::InvalidStateTransition` |
| factory | `Failed` | `GovernanceHandoffMarker::failed(...)` | handoff/export prepare failure path | marker ref from id generator;trace_refs non-empty;target ref present;failure reason redacted | state failed;write failure reason;package/receipt empty | save marker;record failed target as `ExternalGovernanceReferenceRef(target_ref.0)` | `ContractError::InvalidStateTransition` |
| `Prepared` | `Delivered` | `mark_delivered(receipt_ref)` | trace handoff deliver / external GRC deliver success path | adapter returned receipt ref;marker package ref exists;target same | state delivered;write receipt ref | save marker with expected version;store job report;optional outbox if configured | `ContractError::InvalidStateTransition` |
| `Prepared` | `Failed` | `mark_failed(reason)` | deliver failure or late validation failure | redacted failure reason present;marker not delivered | state failed;write failure reason;keep package ref | save marker;job report partial/failed;no package deletion | `ContractError::InvalidStateTransition` |

#### 11.5.1 External GRC export trace refs closure

Step 10 正式选择:所有 `GovernanceHandoffMarker.trace_refs` 必须非空,包括 external GRC export marker。`PrepareExternalGrcExportFlow` 在创建 marker 前必须先创建并保存一条 marker trace:

```text
[PrepareExternalGrcExportFlow trace closure]
  validate body-free truth snapshot
  marker_trace = GovernanceTraceRecord::from_marker(new_trace_id, export_subject_ref, export_trace_kind, core_trace_id, Some(snapshot.source_cursor))
  trace_repo.append_trace(marker_trace, tx)
  trace_refs = GovernanceTraceRecordRefSet([marker_trace.to_ref()])
  marker = GovernanceHandoffMarker::prepared(...) or failed(...), using non-empty trace_refs
```

| 规则 | 说明 |
|---|---|
| empty trace refs | 禁止。任何 `GovernanceHandoffMarker::prepared/failed` 收到 empty `trace_refs` 必须返回 `ContractError::InvalidStateTransition` 或 validation error。 |
| export trace subject | 使用 Step 6 `GovernanceTraceRecord::from_marker(...)` 支持的 formal marker subject;不得把 external GRC document body 伪装成 trace subject。 |
| failure marker | 即使 export prepare 失败,也必须先创建 marker trace,再保存 failed marker。 |
| job report | report 记录 handoff marker ref;target failure 仍映射为 `ExternalGovernanceReferenceRef(target_ref.0)`。 |
| Step 9 open item | 本节已闭口:external GRC export marker 不允许 empty `trace_refs`。 |

| 停审项 | 结论 | 缺口 / 修正 |
|---|---|---|
| enum 是否存在 | 通过 | `GovernanceHandoffState` 已在 Step 6 定义 |
| 状态名是否一致 | 通过 | `Prepared/Delivered/Failed` 全部一致 |
| 触发函数是否存在 | 通过 | `prepared/failed/mark_delivered/mark_failed` 已定义 |
| 前置条件是否闭合 | 通过 | target, package, receipt, failure reason, marker id and non-empty trace refs are formal |
| 副作用是否闭合 | 通过 | marker/job report only;no package body;no truth mutation |
| 测试切口 | 通过 | empty trace refs rejected;export creates marker trace;deliver failure keeps package ref;failed terminal |

### 11.6 `GovernanceJobReportState`

```text
[GovernanceJobReport]
  assembly -> Completed
  assembly -> PartiallyCompleted
  assembly -> Failed
```

| 状态 | 作用 | 是否终态 | 允许的关键操作 |
|---|---|---|---|
| `Completed` | job 完成全部请求工作 | 报告终态 | duplicate replay returns stored report |
| `PartiallyCompleted` | job 完成部分工作,存在 failed refs | 报告终态 | duplicate replay returns stored report |
| `Failed` | job 未能产生请求结果或全部失败 | 报告终态 | duplicate replay returns stored report |

| From | To | 触发函数 | Step 9 flow | 前置条件 | 状态副作用 | Flow 副作用 | 非法时错误 |
|---|---|---|---|---|---|---|---|
| assembly | `Completed` | `GovernanceJobReportAssembly::finish_from_counts(...)` | operations job shared template | scanned count valid;failed refs empty;all required marker/report refs saved;for outbox publish, `published_outbox_refs` carries every successful item | report state completed;write refs/counters | save stored job report;complete idempotency;commit | `ApplicationError::InvalidStateTransition` |
| assembly | `PartiallyCompleted` | `finish_from_counts(...)` | operations job shared template | at least one item changed/ref saved and at least one failed ref/item;for outbox publish, success/failure split is present in `published_outbox_refs` / `failed_outbox_refs` | report state partially completed;write success and failed refs | save stored job report;complete idempotency;commit | `ApplicationError::InvalidStateTransition` |
| assembly | `Failed` | `finish_from_counts(...)` / rejected-to-report path | no successful item or fatal accepted job failure;failure refs/issues present | report state failed;write failed refs/report refs as applicable | save stored job report if accepted;or rejected job result before mutation | `ApplicationError::InvalidStateTransition` |

| 停审项 | 结论 | 缺口 / 修正 |
|---|---|---|
| enum 是否存在 | 通过 | `GovernanceJobReportState` 已在 Step 6 定义 |
| 状态名是否一致 | 通过 | `Completed/PartiallyCompleted/Failed` 全部一致 |
| 触发函数是否存在 | 通过 | Step 6 job report assembly and Step 9 job template |
| 前置条件是否闭合 | 通过 | counts, marker refs, report refs, outbox scanned/published/failed refs and failed refs are carried by assembly |
| 副作用是否闭合 | 通过 | report is stored result surface;duplicate returns stored report |
| 测试切口 | 通过 | partial counts;failed refs type;duplicate replay does not rerun job |

## 12. application / infra / api / worker / jobs 技术状态矩阵

### 12.1 `GovernanceIdempotencyState`

```text
[GovernanceIdempotencyRecord]
  factory -> Reserved -> Completed
  Reserved -> Conflict
```

| 状态 | 作用 | 是否终态 | 允许的关键操作 |
|---|---|---|---|
| `Reserved` | operation key/digest 已预留,结果尚未保存 | 否 | `complete`、`mark_conflict` |
| `Completed` | operation 已完成并指向 stored result | 是 | duplicate replay 读取 stored result |
| `Conflict` | 同 key 被不同 operation/digest 重用 | 是 | 返回 conflict;不得执行业务 mutation |

| From | To | 触发函数 | Step 9 flow | 前置条件 | 状态副作用 | Flow 副作用 | 非法时错误 |
|---|---|---|---|---|---|---|---|
| factory | `Reserved` | `GovernanceIdempotencyRecord::reserve(...)` / repository reserve | command / consumer / job shared template | channel requires idempotency;key non-empty;stable digest excludes volatile fields | state reserved;result/conflict empty | idempotency_repo.reserve before domain transition;duplicate same digest returns existing result | `ApplicationError::InvalidStateTransition` |
| `Reserved` | `Completed` | `complete(result_ref)` | accepted command / consumer / job completion | stored result surface saved;result operation matches record operation | state completed;write result ref | idempotency complete in same transaction as stored result;commit | `ApplicationError::InvalidStateTransition` |
| `Reserved` | `Conflict` | `mark_conflict(reason)` | key reused with different digest | same key found but channel/operation/digest mismatch;reason redacted | state conflict;write conflict reason;result ref empty | rollback or save conflict marker per Step 13;do not run mutation | `ApplicationError::InvalidStateTransition` |

| 停审项 | 结论 | 缺口 / 修正 |
|---|---|---|
| enum 是否存在 | 通过 | `GovernanceIdempotencyState` 已在 Step 6 定义 |
| 状态名是否一致 | 通过 | `Reserved/Completed/Conflict` 全部一致 |
| 触发函数是否存在 | 通过 | reserve/complete/conflict are application/repository operations |
| 前置条件是否闭合 | 通过 | operation context、key、digest、stored result ref are formal |
| 副作用是否闭合 | 通过 | duplicate replay uses stored result;query never reserves |
| 测试切口 | 通过 | same digest duplicate;different digest conflict;volatile fields excluded from digest |

### 12.2 `GovernanceAdapterAvailabilityState`

```text
[GovernanceAdapterAvailabilityMarker]
  factory -> Enabled -> Degraded -> Unavailable
  factory -> DisabledByConfig
  Enabled -> Unavailable
  Degraded -> Enabled
  Unavailable -> Enabled
```

| 状态 | 作用 | 是否终态 | 允许的关键操作 |
|---|---|---|---|
| `Enabled` | adapter configured and usable | 否 | `mark_degraded`、`mark_unavailable`;runtime may inject |
| `DisabledByConfig` | adapter intentionally disabled | runtime terminal until config reload | no runtime call |
| `Degraded` | adapter usable but response must expose degraded | 否 | recover to `Enabled` or become `Unavailable` |
| `Unavailable` | adapter configured but not usable | 否 | recover to `Enabled`;operations delayed/failed |

| From | To | 触发函数 | Step 9 flow | 前置条件 | 状态副作用 | Flow 副作用 | 非法时错误 |
|---|---|---|---|---|---|---|---|
| factory | `Enabled` | `GovernanceAdapterAvailabilityMarker::enabled(...)` | runtime assembly | adapter config ref valid;adapter factory success | marker enabled;issue empty | runtime builder may inject adapter;no domain truth write | `InfraError::InvalidStateTransition` |
| factory | `DisabledByConfig` | `disabled_by_config(...)` | runtime assembly | validated config disables optional slot;issue optional/redacted | marker disabled;optional issue | runtime excludes optional adapter;external GRC export rejected/delayed if disabled | `InfraError::InvalidStateTransition` |
| `Enabled` / `Degraded` | `Unavailable` | `mark_unavailable(issue_ref)` | health probe / adapter call failure | redacted issue ref present;failure classified blocking | marker unavailable;write issue | worker/job delayed or failed;query degraded;no truth mutation | `InfraError::InvalidStateTransition` |
| `Enabled` | `Degraded` | `mark_degraded(issue_ref)` | health probe / partial capability path | redacted issue present;adapter still usable | marker degraded;write issue | query/job surfaces degraded marker;no invariant change | `InfraError::InvalidStateTransition` |
| `Degraded` / `Unavailable` | `Enabled` | availability recovery operation | health probe success / config reload | same slot/config ref healthy;blocking issue no longer active | marker enabled;clear or supersede issue by Step 11 policy | runtime may resume worker/job;no truth mutation | `InfraError::InvalidStateTransition` |

| 停审项 | 结论 | 缺口 / 修正 |
|---|---|---|
| enum 是否存在 | 通过 | `GovernanceAdapterAvailabilityState` 已在 Step 6 定义 |
| 状态名是否一致 | 通过 | `Enabled/DisabledByConfig/Degraded/Unavailable` 全部一致 |
| 触发函数是否存在 | 通过 | marker factories and mark_degraded/mark_unavailable exist;recovery is infra operation |
| 前置条件是否闭合 | 通过 | config ref、slot、redacted issue are formal |
| 副作用是否闭合 | 通过 | availability only affects runtime/degraded/delayed surfaces |
| 测试切口 | 通过 | disabled optional external GRC;unavailable does not alter domain state;degraded visible |

### 12.3 `GovernanceRuntimeBuildState`

```text
[GovernanceRuntimeBuilderState]
  NotStarted -> ValidatingConfig -> Assembling -> Ready
  NotStarted -> Failed
  ValidatingConfig -> Failed
  Assembling -> Failed
```

| 状态 | 作用 | 是否终态 | 允许的关键操作 |
|---|---|---|---|
| `NotStarted` | builder 尚未校验 config | 否 | `start_validation`、`mark_failed` |
| `ValidatingConfig` | 正在校验 config refs / slots | 否 | `start_assembly`、`mark_failed` |
| `Assembling` | 正在组装 store / adapter / service | 否 | `record_adapter`、`mark_ready`、`mark_failed` |
| `Ready` | runtime facade 可暴露 | 是 for build run | no mutation;new config requires new builder |
| `Failed` | runtime assembly failed | 是 for build run | no facade exposure |

| From | To | 触发函数 | Step 9 flow | 前置条件 | 状态副作用 | Flow 副作用 | 非法时错误 |
|---|---|---|---|---|---|---|---|
| factory | `NotStarted` | `GovernanceRuntimeBuilderState::for_config(...)` | infra runtime assembly | validated runtime config ref exists;profile present | state not started;markers/issues empty | no service exposed | `InfraError::InvalidStateTransition` |
| `NotStarted` | `ValidatingConfig` | `start_validation()` | runtime builder | config refs loaded;raw config/secret not stored | state validating | validate refs/slots;record redacted issues | `InfraError::InvalidStateTransition` |
| `ValidatingConfig` | `Assembling` | `start_assembly()` | runtime builder | no blocking validation issue;required store/adapter refs present | state assembling | create stores/adapters/services;record availability markers | `InfraError::InvalidStateTransition` |
| `Assembling` | `Ready` | `mark_ready()` | runtime builder | blocking slots not unavailable;facade services assembled;config invariant safe | state ready | expose application facade to API/worker/jobs | `InfraError::InvalidStateTransition` |
| `NotStarted` / `ValidatingConfig` / `Assembling` | `Failed` | `mark_failed(issue_ref)` | runtime builder failure | redacted issue ref present;blocking validation/assembly failure | state failed;append issue | no facade exposure;startup fails or runtime unavailable | `InfraError::InvalidStateTransition` |

| 停审项 | 结论 | 缺口 / 修正 |
|---|---|---|
| enum 是否存在 | 通过 | `GovernanceRuntimeBuildState` 已在 Step 6 定义 |
| 状态名是否一致 | 通过 | `NotStarted/ValidatingConfig/Assembling/Ready/Failed` 全部一致 |
| 触发函数是否存在 | 通过 | Step 6 builder methods exist |
| 前置条件是否闭合 | 通过 | config refs, issues, adapter markers are body-free |
| 副作用是否闭合 | 通过 | runtime build state does not change business invariants |
| 测试切口 | 通过 | ready before facade exposure;failed no half-runtime;raw config not saved |

### 12.4 `GovernanceApiHandlerDisposition`

```text
[GovernanceApiHandlerResult]
  entry validation -> Accepted
  entry validation -> Rejected
  query visible non-degraded -> Accepted
  query visibility -> NotVisible
  query degraded -> Degraded
```

| 状态 | 作用 | 是否终态 | 允许的关键操作 |
|---|---|---|---|
| `Accepted` | handler 调用 application 并返回 command result ref,或 query handler 返回 visible non-degraded surface | result disposition | transport maps success |
| `Rejected` | pre-application validation rejected | result disposition | transport maps validation/error response |
| `NotVisible` | query 被 visibility policy 隐藏 | result disposition | transport returns not-visible surface with marker |
| `Degraded` | query 成功但结果 degraded | result disposition | transport returns degraded marker |

| From | To | 触发函数 | Step 9 flow | 前置条件 | 状态副作用 | Flow 副作用 | 非法时错误 |
|---|---|---|---|---|---|---|---|
| entry validation | `Accepted` | `GovernanceApiHandlerResult::accepted_command(...)` | API command handler -> command service | command metadata complete;application returned stored result ref | build result shell with application result ref | transport response only;no domain mutation in API layer | `ApiError::InvalidStateTransition` |
| entry validation | `Rejected` | `GovernanceApiHandlerResult::rejected(...)` | API command/query validation | missing metadata/body forbidden/invalid route;redacted issue refs present | build rejected result;no application result | application service not called;no id generated for domain | `ApiError::InvalidStateTransition` |
| query surface assembly | `Accepted` | `GovernanceApiHandlerResult::query_surface(...)` | query flows | visibility marker is visible;no degraded marker with `is_degraded = true`;query remains read-only | result disposition accepted;attach visibility marker;`application_result_ref = None` | transport returns visible query surface;no stored result,trace,audit,outbox,projection/reference repair | `ApiError::InvalidStateTransition` |
| query visibility | `NotVisible` | query surface result assembly | query flows | visibility policy returns not-visible marker;query remains read-only | result disposition not visible;attach marker | transport returns not-visible;no projection/reference repair | `ApiError::InvalidStateTransition` |
| query degraded | `Degraded` | query surface result assembly | query flows | query surface has degraded marker from stale/unavailable/reference/adapter | result disposition degraded;attach degraded marker | transport returns degraded;query no-write | `ApiError::InvalidStateTransition` |

| 停审项 | 结论 | 缺口 / 修正 |
|---|---|---|
| enum 是否存在 | 通过 | `GovernanceApiHandlerDisposition` 已在 Step 6 定义 |
| 状态名是否一致 | 通过 | `Accepted/Rejected/NotVisible/Degraded` 全部一致 |
| 触发函数是否存在 | 通过 | `accepted_command(...)`,`rejected(...)` and `query_surface(...)` exist;query visible success maps to `Accepted` |
| 前置条件是否闭合 | 通过 | metadata, result ref, visibility marker, degraded marker are formal |
| 副作用是否闭合 | 通过 | API layer never writes domain truth except through application service |
| 测试切口 | 通过 | not visible includes marker;rejected no application call;query no idempotency |

### 12.5 worker states

```text
[GovernanceWorkerEntryState]
  Registered -> Running -> Delayed -> Running
  Registered -> Stopped
  Running -> Stopped
  Running -> Failed
  Delayed -> Failed

[GovernanceWorkerDisposition]
  item -> Accepted
  item -> Duplicate
  item -> Delayed
  item -> Rejected
  item -> UnsupportedVersion
```

| 状态 | 作用 | 是否终态 | 允许的关键操作 |
|---|---|---|---|
| `Registered` | worker entry 已注册但未运行 | 否 | start/run, stop |
| `Running` | worker 正在消费或发布 | 否 | produce item result, delay, stop, fail |
| `Delayed` | source unavailable/backoff | 否 | retry to running, fail |
| `Stopped` | config 停止 | runtime terminal until config reload | no item processing |
| `Failed` | worker 失败需人工处理 | runtime terminal until recovery | no item processing |
| `Accepted` | item 被 application 接受 | item terminal | store item result |
| `Duplicate` | item 已处理 | item terminal | return stored receipt/result |
| `Delayed` | item 延迟重试 | item non-terminal | retry later |
| `Rejected` | item pre-application 拒绝 | item terminal | record redacted issue |
| `UnsupportedVersion` | schema version 不支持 | item terminal/dead-letter candidate | do not parse payload |

| From | To | 触发函数 | Step 9 flow | 前置条件 | 状态副作用 | Flow 副作用 | 非法时错误 |
|---|---|---|---|---|---|---|---|
| `Registered` / `Delayed` | `Running` | worker runtime start/retry | inbound consumer / outbox publisher loop | source/adapter availability enabled or degraded but usable | entry running;issues retained or superseded | poll/consume/publish through application service | `WorkerError::InvalidStateTransition` |
| `Running` | `Delayed` | loop delay operation | worker loop | temporary source/adapter unavailable;redacted issue present | entry delayed;write issue | no domain mutation;retry scheduled by runtime | `WorkerError::InvalidStateTransition` |
| `Registered` / `Running` | `Stopped` | config stop operation | worker runtime | validated config disables entry | entry stopped | stop polling;no item processing | `WorkerError::InvalidStateTransition` |
| `Running` / `Delayed` | `Failed` | loop fail operation | worker runtime | fatal worker issue present | entry failed;write issue | operator attention;no truth repair | `WorkerError::InvalidStateTransition` |
| item | `Accepted` | `GovernanceWorkerItemResult::accepted(...)` | consumer accepted / publisher accepted | application service returned result ref;event/outbox ref present for path | item result accepted | store worker result;do not bypass application | `WorkerError::InvalidStateTransition` |
| item | `Duplicate` | `duplicate(...)` | consumer duplicate path | dedup/idempotency found same key;stored receipt/result available when required | item result duplicate | return stored result;no transition rerun | `WorkerError::InvalidStateTransition` |
| item | `Delayed` | worker delayed item result | source/backoff path | issue present;retry class temporary | item delayed | no snapshot/outbox update;retry later | `WorkerError::InvalidStateTransition` |
| item | `Rejected` | `rejected(...)` | envelope validation / forbidden body | missing metadata/body forbidden/invalid ref;issue refs present | item rejected | application not called;no snapshot/state write | `WorkerError::InvalidStateTransition` |
| item | `UnsupportedVersion` | `unsupported_version(...)` | inbound consumer version gate | schema version not supported;issue ref present | item unsupported | no payload parsing;receipt/dead-letter per Step 13 | `WorkerError::InvalidStateTransition` |

| 停审项 | 结论 | 缺口 / 修正 |
|---|---|---|
| enum 是否存在 | 通过 | `GovernanceWorkerEntryState` and `GovernanceWorkerDisposition` 已在 Step 6 定义 |
| 状态名是否一致 | 通过 | entry and item states 全部一致 |
| 触发函数是否存在 | 通过 | worker entry/result helper methods exist |
| 前置条件是否闭合 | 通过 | schema version, dedup key, adapter availability, result refs are formal |
| 副作用是否闭合 | 通过 | worker never writes truth directly;unsupported version does not parse payload |
| 测试切口 | 通过 | duplicate replay;unsupported version;source delayed;stopped no processing |

### 12.6 job entry / run disposition states

```text
[GovernanceJobEntryState]
  Registered -> Running -> Completed
  Registered -> Delayed -> Running
  Running -> Failed
  Delayed -> Failed

[GovernanceJobRunDisposition]
  run -> Completed
  run -> PartiallyCompleted
  run -> Failed
  duplicate -> DuplicateReplayed
  validation -> Rejected
```

| 状态 | 作用 | 是否终态 | 允许的关键操作 |
|---|---|---|---|
| `Registered` | job entry registered | 否 | `mark_running`、`mark_delayed` |
| `Running` | job running | 否 | complete, fail |
| `Delayed` | job delayed by config/dependency/backoff | 否 | `mark_running`、`mark_failed` |
| `Completed` | entry current run completed | run terminal | no mutation |
| `Failed` | entry current run failed | run terminal | no mutation |
| `Completed` disposition | job report completed | result terminal | return report |
| `PartiallyCompleted` disposition | partial report | result terminal | return report |
| `Failed` disposition | failed report/result | result terminal | return failed surface |
| `DuplicateReplayed` disposition | stored report replayed | result terminal | no job body run |
| `Rejected` disposition | validation rejected before app execution | result terminal | no mutation |

| From | To | 触发函数 | Step 9 flow | 前置条件 | 状态副作用 | Flow 副作用 | 非法时错误 |
|---|---|---|---|---|---|---|---|
| `Registered` / `Delayed` | `Running` | `GovernanceOperationsJobEntry::mark_running()` | job runner | job metadata complete;job enabled;adapter availability usable | entry running | build operation context;reserve idempotency | `JobError::InvalidStateTransition` |
| `Registered` | `Delayed` | `mark_delayed(issue_ref)` | job runner precheck | dependency unavailable or config delayed;issue present | entry delayed;write issue | no application job body;retry later | `JobError::InvalidStateTransition` |
| `Running` | `Completed` | runner completion update | operations job success/partial success | application service returned stored result/report | entry completed | return `GovernanceOperationsJobRunResult::completed(...)` | `JobError::InvalidStateTransition` |
| `Running` / `Delayed` | `Failed` | `mark_failed(issue_ref)` | job runner failure | fatal issue present | entry failed;write issue | return failed run result;no truth repair | `JobError::InvalidStateTransition` |
| run | `Completed` | `GovernanceOperationsJobRunResult::completed(...)` | job runner | report state `Completed`;stored result ref saved | disposition completed | transport/scheduler sees success | `JobError::InvalidStateTransition` |
| run | `PartiallyCompleted` | `completed(...)` with partial report | job runner | report state `PartiallyCompleted`;stored result ref saved | disposition partially completed | transport/scheduler sees partial;no retry unless configured | `JobError::InvalidStateTransition` |
| run | `Failed` | failed run result factory | job runner | accepted job produced failed report or fatal runtime failure | disposition failed;issues/report visible | no hidden repair;stored failed report when accepted | `JobError::InvalidStateTransition` |
| duplicate | `DuplicateReplayed` | `duplicate_replayed(...)` | job idempotency duplicate path | same idempotency key/digest;stored job report result ref exists | disposition duplicate replayed | return stored report;do not scan/rebuild/publish/export | `JobError::InvalidStateTransition` |
| validation | `Rejected` | `rejected(...)` | job runner validation | missing metadata, disabled job, invalid scope/page;issue refs present | disposition rejected | application service not called;no idempotency mutation unless Step 13 says | `JobError::InvalidStateTransition` |

| 停审项 | 结论 | 缺口 / 修正 |
|---|---|---|
| enum 是否存在 | 通过 | `GovernanceJobEntryState` and `GovernanceJobRunDisposition` 已在 Step 6 定义 |
| 状态名是否一致 | 通过 | entry and disposition states 全部一致 |
| 触发函数是否存在 | 通过 | job entry/result helpers exist |
| 前置条件是否闭合 | 通过 | metadata, idempotency key, stored report, issue refs are formal |
| 副作用是否闭合 | 通过 | duplicate does not rerun job;rejected no application mutation |
| 测试切口 | 通过 | duplicate stored report;partial report;disabled job rejected;failed no repair |

## 13. query helper / external marker 状态矩阵

### 13.1 `DecisionSummaryState`

```text
[DecisionSummaryView]
  projection/query assembly -> Readable
  projection/query assembly -> Stale
  visibility policy -> NotVisible
  source/projection missing -> Unavailable
```

| 状态 | 作用 | 是否终态 | 允许的关键操作 |
|---|---|---|---|
| `Readable` | authorized reader can read current summary | query surface | return view |
| `Stale` | summary stale but readable with freshness marker | query surface | return view with marker |
| `NotVisible` | reader cannot see summary | query surface | return not-visible marker |
| `Unavailable` | summary cannot be assembled | query surface | return unavailable/degraded marker |

| From | To | 触发函数 | Step 9 flow | 前置条件 | 状态副作用 | Flow 副作用 | 非法时错误 |
|---|---|---|---|---|---|---|---|
| query assembly | `Readable` | `DecisionSummaryView::from_decision(...)` | decision summary query / rebuild projection | visibility allowed;projection state fresh or truth loaded;required gate/decision refs present | view state readable in response body only | query no-write;projection rebuild may replace view separately | `ApplicationError::InvalidStateTransition` |
| query assembly | `Stale` | query/projection assembler | decision summary query | projection freshness stale or source cursor lag;visibility allowed | response carries stale marker;no truth mutation | query no-write;maintenance job can rebuild later | `ApplicationError::InvalidStateTransition` |
| visibility policy | `NotVisible` | `ReadVisibilityPolicy` result | query flows | visibility denied marker available | response carries not-visible marker | no repository writes;no hidden error without marker | `ApplicationError::InvalidStateTransition` |
| query assembly | `Unavailable` | query/projection assembler | query / rebuild failure surface | required source truth/view state missing or unavailable;degraded marker present | response carries unavailable/degraded surface | no placeholder truth/view created | `ApplicationError::InvalidStateTransition` |

| 停审项 | 结论 | 缺口 / 修正 |
|---|---|---|
| enum 是否存在 | 通过 | `DecisionSummaryState` 已在 Step 6 定义 |
| 状态名是否一致 | 通过 | `Readable/Stale/NotVisible/Unavailable` 全部一致 |
| 前置条件是否闭合 | 通过 | visibility marker and freshness marker are formal |
| 副作用是否闭合 | 通过 | query no-write;projection rebuild separate |
| 测试切口 | 通过 | not visible includes marker;stale visible;unavailable no placeholder |

### 13.2 `ControlCoverageState`

```text
[ControlCoverageView]
  projection/query assembly -> Complete
  projection/query assembly -> GapDetected
  projection/query assembly -> PendingEvidence
  source/projection lag -> Stale
```

| 状态 | 作用 | 是否终态 | 允许的关键操作 |
|---|---|---|---|
| `Complete` | required control coverage complete | query/view summary | return coverage |
| `GapDetected` | coverage gap exists | query/view summary | return gap refs/surface |
| `PendingEvidence` | coverage waits for evidence/reference | query/view summary | return pending marker |
| `Stale` | coverage view stale | query/view summary | return freshness marker |

| From | To | 触发函数 | Step 9 flow | 前置条件 | 状态副作用 | Flow 副作用 | 非法时错误 |
|---|---|---|---|---|---|---|---|
| assembly | `Complete` | `ControlCoverageView::from_control_truth(...)` | control coverage query / rebuild | all required applicability/review/conclusion refs support coverage;freshness acceptable | response/view state complete | query no-write;projection replace if rebuild job | `ApplicationError::InvalidStateTransition` |
| assembly | `GapDetected` | coverage assembler | control coverage query / rebuild | required control missing/applicability/review/conclusion gap found from formal reads | response/view state gap detected | no automatic nonconformity;report/query only | `ApplicationError::InvalidStateTransition` |
| assembly | `PendingEvidence` | coverage assembler | control coverage query / rebuild | reference/evidence state unresolved/stale/unavailable blocks coverage conclusion | response/view state pending evidence | may mark affected projection stale via maintenance,not query | `ApplicationError::InvalidStateTransition` |
| assembly | `Stale` | coverage assembler | query / projection stale path | projection freshness stale or source cursor lag | response/view state stale | query exposes freshness;does not update control truth | `ApplicationError::InvalidStateTransition` |

| 停审项 | 结论 | 缺口 / 修正 |
|---|---|---|
| enum 是否存在 | 通过 | `ControlCoverageState` 已在 Step 6 定义 |
| 状态名是否一致 | 通过 | `Complete/GapDetected/PendingEvidence/Stale` 全部一致 |
| 前置条件是否闭合 | 通过 | formal reads from control/compliance/reference/projection are defined |
| 副作用是否闭合 | 通过 | coverage view never writes `ControlApplicability` or `ControlReview` |
| 测试切口 | 通过 | gap does not create nonconformity;pending evidence visible;stale explicit |

### 13.3 `EvidenceVerifiedState`

```text
[EvidenceSummaryRef]
  resolver -> Verified
  resolver -> Pending
  resolver -> Failed
```

| 状态 | 作用 | 是否终态 | 允许的关键操作 |
|---|---|---|---|
| `Verified` | evidence summary verified by source boundary | marker state | usable as basis if policy permits |
| `Pending` | evidence verification pending | marker state | blocks accepted basis or returns pending |
| `Failed` | evidence could not be verified | marker state | blocks basis;may raise degraded/failure surface |

| From | To | 触发函数 | Step 9 flow | 前置条件 | 状态副作用 | Flow 副作用 | 非法时错误 |
|---|---|---|---|---|---|---|---|
| resolver | `Verified` | evidence resolver / consumer snapshot save | artifact evidence consumer / command resolver | source boundary provides verified summary ref/digest;no body saved | marker verified in summary | save body-free summary/ref;may unblock command/ref state | `ApplicationError::InvalidStateTransition` |
| resolver | `Pending` | evidence resolver / consumer snapshot save | command precheck / refresh | evidence exists but verification not complete | marker pending | command may set PendingEvidence;query degraded/pending | `ApplicationError::InvalidStateTransition` |
| resolver | `Failed` | evidence resolver / consumer snapshot save | refresh / command precheck | source says summary failed verification or resolver validation failed | marker failed | command basis rejected;job report failed ref;no evidence body saved | `ApplicationError::InvalidStateTransition` |

| 停审项 | 结论 | 缺口 / 修正 |
|---|---|---|
| enum 是否存在 | 通过 | `EvidenceVerifiedState` 已在 Step 6 定义 |
| 状态名是否一致 | 通过 | `Verified/Pending/Failed` 全部一致 |
| 前置条件是否闭合 | 通过 | evidence summary ref/digest/source resolver are formal |
| 副作用是否闭合 | 通过 | evidence state does not own artifact/evidence truth |
| 测试切口 | 通过 | pending blocks accepted basis;failed cannot support decision/closure |

## 14. 跨状态机副作用一致性

| 副作用 | 允许来源 | 禁止事项 |
|---|---|---|
| trace append | accepted command/consumer/job marker after domain transition succeeds | domain object method 直接 append trace |
| history append | accepted truth transition,with transitioned object state copied into record | history factory 解析 change kind 字符串推断 state |
| audit append | application flow after trace exists and audit policy requires | query path 修复 audit gap |
| outbox append | accepted Governance truth change and saved payload snapshot | publisher 回查 current truth 重构 payload |
| projection stale | affected view refs from formal repository/helper | ad hoc 拼接 `DerivedGovernanceViewRef` |
| reference update | consumer / refresh job with versioned reference state | command/query 保存 sibling body |
| job report | operations job accepted path or stored duplicate replay | duplicate 重跑 job scan 伪装 replay |
| handoff marker | trace/archive/export job with non-empty trace refs | empty trace_refs marker or package body saved |
| API/worker/job entry result | boundary/runner technical result | entry result 反写 domain truth |

## 15. forbidden transition summary

| 状态机 | Forbidden transition | 正式处理 |
|---|---|---|
| `GovernanceContext` | `Invalid/Closed -> any` | reject with invalid transition;new context required |
| `GovernanceInput` | `Rejected/Superseded -> Accepted/PendingEvidence` | reject;new input required |
| `Gate` | `Decided/Expired/Cancelled -> PendingDecision/Decided` | reject;new gate required |
| `GovernanceDecision` | finalized outcome switching directly to another outcome | supersede/revoke only |
| `ApprovalResponsibility` | `Released -> any` | reject;new responsibility required |
| `ResponsibilityChain` | `Closed -> any` | reject;new chain required |
| `PolicyEffectiveFact` | `Superseded/Retired -> Effective` | reject;new policy fact required |
| `SharedRuleSet` | `Retired -> Active` | reject;new rule set required |
| `PolicyConflictRecord` | terminal conflict reopening | reject;new conflict record required |
| `ControlApplicability` | `Applicable/NotApplicable/Excluded` switching directly | supersede with new applicability fact |
| `ControlReview` | terminal review reopening | reject;new review required |
| `ComplianceConclusion` | `Superseded/Revoked -> InReview/Approved` | reject;new conclusion required |
| `NonconformityRecord` | `ReadyForVerification -> Closed` with failed/inconclusive verification | reject;requires passed verification |
| `CorrectiveAction` | `Completed/Cancelled/Failed -> InProgress` | reject;new corrective action required |
| `DerivedGovernanceViewState` | query-triggered repair | query returns stale/degraded;maintenance job repairs |
| `ReferenceResolutionState` | `Invalid -> Resolved` implicit recovery | new/replacement state required unless Step 11 defines explicit recovery |
| `GovernanceOutboxRecord` | `Published/DeadLettered -> Pending/Failed` | reject;formal operator recovery required by Step 12/13 |
| `GovernanceHandoffMarker` | `Delivered/Failed -> Prepared` | reject;retry creates new marker |
| idempotency | `Completed/Conflict -> Reserved` | reject;new key required |

## 16. Step 10 对 Step 9 待决项的闭口

| Step 9 item | Step 10 决议 | 实现口径 |
|---|---|---|
| external GRC export marker trace refs 是否允许空 | 不允许空 | `PrepareExternalGrcExportFlow` must create `GovernanceTraceRecord::from_marker(...)` first,then create marker with non-empty trace refs |
| `DerivedGovernanceViewState` rebuild item failure / unavailable / fresh replacement | 已定义 | failure -> `Failed`;storage/source unavailable -> `Unavailable`;successful replace -> `Fresh` |
| outbox `Failed -> Pending` retry vs `Failed -> DeadLettered` | 已定义 | retryable and policy-permitted failure -> `Pending`;fatal or exhausted -> `DeadLettered` |

## 17. Step 11~16 handoff items

| 后续 Step | 需要承接的事项 |
|---|---|
| Step 11 persistence | versioned save semantics for state updates,report supersede pointer,reference invalid recovery,projection unavailable persistence |
| Step 12 errors | replace placeholder invalid-transition errors with exact domain/application/API/worker/job variants and response mapping |
| Step 13 idempotency/concurrency | retry exhaustion policy,outbox dead-letter recovery,job duplicate stored report,reference state optimistic lock |
| Step 14 config | adapter availability recovery,external GRC enabled/disabled,target registry,optional outbox notifications |
| Step 15 observability | trace/audit/report surfaces for failed transitions,not-visible/degraded/unavailable markers |
| Step 16 tests | state transition unit tests,forbidden transition tests,query no-write tests,job duplicate replay tests,outbox retry/dead-letter tests |

## 18. 跨状态机命名 / 触发 / 测试审计表

| 审计项 | 结论 | 缺口 / 修正 |
|---|---|---|
| 状态名是否全部来自 Step 6 enum | 通过 | 未新增 Step 6 之外的业务状态名 |
| 同名 / 近义状态是否混用 | 通过 | `Rejected` 分别限定 input/decision/conclusion/nonconformity signal;context 终态使用 `Invalid/Closed` |
| 触发函数是否回指 Step 6 / Step 9 | 通过 | 每条矩阵均指向 factory/method/repository marker update/job assembly |
| 前置条件是否可落码 | 通过 | 均回指 DTO、loaded truth、versioned repository、resolver result、policy guard 或 stored snapshot |
| 非法转换错误是否明确 | 通过 | 暂用 module-level invalid transition placeholder,Step 12 精确化 |
| 副作用是否跨对象一致 | 通过 | domain 不写 repository;application accepted path 串 trace/history/outbox/stale/result |
| query no-write 是否保持 | 通过 | query helper state 只读;stale/unavailable 不在 query path 修复 |
| maintenance job 是否不修复 core truth | 通过 | 只维护 projection/reference/outbox/report/handoff/job report |
| handoff marker trace_refs 是否闭口 | 通过 | 所有 marker 非空 trace refs,external GRC export 先建 marker trace |
| tests / acceptance 状态名是否可回指 | 通过 | Step 16 可按本 Step 状态机逐项生成 state transition tests |

## 19. Step 完成条件

| 条件 | 结论 |
|---|---|
| 状态集合表 | 已完成 |
| ASCII 状态图 | 已完成 |
| 状态转换矩阵 | 已完成 |
| 非法转换处理表 | 已完成 |
| 单状态机停审记录 | 已完成 |
| Step 9 待决项闭口 | 已完成 |
| 跨状态机审计 | 已完成 |

本 Step 完成后,下一步进入 Step 11 `03_ddd_step_11_persistence_transaction_consistency.md`,集中收口持久化 schema、transaction ordering、optimistic version、outbox payload snapshot、projection/reference state version、stored result 和 handoff marker persistence。
