# Step 6 附录 A1. Context / Decision 关键对象

> 主控文件: `02_hld_step_06_key_objects.md`
> 本文件只给概要骨架,不定义完整对象契约。

---

## A1. `GovernanceContext`

| 项 | 内容 |
|---|---|
| 所属部分 | `Governance context and input management` |
| 对象类型 | 聚合 / context truth |
| 结构责任 | 表达 actor、scope、被治理对象、治理目的和责任语境形成的可裁决入口 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `context_id` | `GovernanceContextId` | 稳定治理语境身份 |
| `actor_ref` | `ActorRef` | 发起或承担治理动作的 actor |
| `subject_ref` | `GovernedSubjectRef` | 被治理对象引用 |
| `context_state` | `GovernanceContextState` | 表达语境是否可裁决、挂起或失效 |
| `source_ref` | `GovernanceSourceRef` | 触发来源或外部线索引用 |

| 状态 | 作用 |
|---|---|
| `Draft` / `Ready` / `PendingReference` / `Invalid` / `Closed` | 草稿、可裁决、等待引用解析、无效和已关闭 |

| 成员函数 | 作用 |
|---|---|
| `mark_ready(ActorRef actor)` | 标记语境已经具备可裁决条件 |
| `mark_pending_reference(ReferenceResolutionState reference_state)` | 因外部引用未解析进入挂起 |
| `invalidate(GovernanceContextInvalidReason reason, ActorRef actor)` | 标记语境不可用于正式裁决 |
| `close(GovernanceContextCloseReason reason, ActorRef actor)` | 在语境不再需要时关闭 |

| 工厂函数 | 作用 |
|---|---|
| `from_subject(GovernedSubjectRef subject_ref, GovernanceSourceRef source_ref, ActorRef actor)` | 从被治理对象和来源引用形成治理语境 |

| 禁止事项 | 说明 |
|---|---|
| 不拥有外部对象 truth | 只保存 subject 引用和摘要边界 |
| 不保存外部正文 | 不保存 process、work、artifact、conversation、runtime 或 external GRC 正文 |

---

## A2. `GovernanceInput`

| 项 | 内容 |
|---|---|
| 所属部分 | `Governance context and input management` |
| 对象类型 | 实体 / input truth |
| 结构责任 | 表达外部触发、周期复核、风险信号或相邻仓请求进入 Governance 的可解释输入 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `input_id` | `GovernanceInputId` | 输入身份 |
| `context_ref` | `GovernanceContextRef` | 所属治理语境 |
| `input_kind` | `GovernanceInputKind` | 输入类别 |
| `input_state` | `GovernanceInputState` | 输入收束状态 |
| `source_ref` | `GovernanceSourceRef` | 输入来源引用 |

| 状态 | 作用 |
|---|---|
| `Received` / `Accepted` / `Rejected` / `PendingEvidence` / `Superseded` | 已接收、已接受、已拒绝、等待依据和被替代 |

| 成员函数 | 作用 |
|---|---|
| `accept(GovernanceContext context, ActorRef actor)` | 接受输入进入正式治理处理 |
| `reject(GovernanceInputRejectReason reason, ActorRef actor)` | 拒绝不具备治理意义的输入 |
| `wait_for_evidence(EvidenceSummaryRef evidence_ref)` | 因依据未闭合进入等待 |
| `supersede(GovernanceInputRef next_input_ref, ActorRef actor)` | 被新的输入替代 |

| 工厂函数 | 作用 |
|---|---|
| `receive(GovernanceInputKind input_kind, GovernanceSourceRef source_ref, GovernanceContextRef context_ref)` | 从正式来源引用接收治理输入 |

| 禁止事项 | 说明 |
|---|---|
| 不替代正式 Decision | 输入只是可裁决线索,不是裁决结论 |
| 不保存来源正文 | 只保存 source ref、summary 或解析状态 |

---

## A3. `Gate`

| 项 | 内容 |
|---|---|
| 所属部分 | `Gate and decision management` |
| 对象类型 | 聚合 / decision gate truth |
| 结构责任 | 表达关键节点需要正式 Governance 裁决的等待点和裁决入口 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `gate_id` | `GateId` | Gate 身份 |
| `context_ref` | `GovernanceContextRef` | 所属治理语境 |
| `gate_kind` | `GateKind` | Gate 类别 |
| `gate_state` | `GateState` | Gate 是否等待、已裁决或失效 |
| `required_responsibility_ref` | `Option<ApprovalResponsibilityRef>` | 需要的审批 / 授权责任 |

| 状态 | 作用 |
|---|---|
| `Open` / `PendingDecision` / `Decided` / `Expired` / `Cancelled` | 已打开、待裁决、已裁决、已过期和已取消 |

| 成员函数 | 作用 |
|---|---|
| `request_decision(ApprovalResponsibility responsibility, ActorRef actor)` | 进入待裁决状态并绑定责任 |
| `attach_decision(GovernanceDecision decision, ActorRef actor)` | 关联正式裁决并关闭等待 |
| `expire(GateExpireReason reason)` | 标记 Gate 过期 |
| `cancel(GateCancelReason reason, ActorRef actor)` | 取消不再适用的 Gate |

| 工厂函数 | 作用 |
|---|---|
| `open(GovernanceContext context, GateKind gate_kind, ActorRef actor)` | 从治理语境打开 Gate |

| 禁止事项 | 说明 |
|---|---|
| 不等同 process waiting gate | Process waiting 只可引用 Governance Gate / Decision |
| 不由 UI 显化替代 | conversation card 只能显化,不能形成 Gate truth |

---

## A4. `GovernanceDecision`

| 项 | 内容 |
|---|---|
| 所属部分 | `Gate and decision management` |
| 对象类型 | 聚合 / decision truth |
| 结构责任 | 表达正式治理裁决结论、依据、责任和后续消费边界 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `decision_id` | `GovernanceDecisionId` | 裁决身份 |
| `gate_ref` | `GateRef` | 对应 Gate |
| `decision_kind` | `GovernanceDecisionKind` | 裁决类别 |
| `decision_state` | `GovernanceDecisionState` | 裁决生命周期 |
| `outcome_ref` | `GovernanceDecisionOutcomeRef` | 裁决结果引用 |
| `basis_ref` | `Option<EvidenceSummaryRef>` | 裁决依据引用 |

| 状态 | 作用 |
|---|---|
| `Proposed` / `Approved` / `Rejected` / `Waived` / `Superseded` / `Revoked` | 已提出、批准、拒绝、豁免、被替代和撤销 |

| 成员函数 | 作用 |
|---|---|
| `approve(EvidenceSummaryRef basis_ref, ActorRef actor)` | 基于依据形成批准结论 |
| `reject(GovernanceRejectReason reason, ActorRef actor)` | 形成拒绝结论 |
| `waive(GovernanceWaiveReason reason, ActorRef actor)` | 形成可追溯豁免结论 |
| `supersede(GovernanceDecisionRef next_decision_ref, ActorRef actor)` | 被后续裁决替代 |
| `revoke(GovernanceRevokeReason reason, ActorRef actor)` | 撤销错误或不再适用的裁决 |

| 工厂函数 | 作用 |
|---|---|
| `propose(Gate gate, GovernanceDecisionKind decision_kind, ActorRef actor)` | 从 Gate 形成待裁决对象 |

| 禁止事项 | 说明 |
|---|---|
| 不原地改写历史 | 修正必须通过 supersede / revoke 等显式变化表达 |
| 不由 runtime cache 定义 | 执行层缓存不能形成正式裁决 |

---

## A5. `ApprovalResponsibility`

| 项 | 内容 |
|---|---|
| 所属部分 | `Approval and responsibility management` |
| 对象类型 | 实体 / responsibility truth |
| 结构责任 | 表达单个治理语境中的审批、投票、授权或 risk owner 责任 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `responsibility_id` | `ApprovalResponsibilityId` | 责任身份 |
| `context_ref` | `GovernanceContextRef` | 所属治理语境 |
| `actor_ref` | `ActorRef` | 承担责任的 actor |
| `requirement_ref` | `ApproverRequirementRef` | 责任要求 |
| `responsibility_state` | `ApprovalResponsibilityState` | 责任承担状态 |

| 状态 | 作用 |
|---|---|
| `Required` / `Assigned` / `Accepted` / `Voted` / `Delegated` / `Released` | 已要求、已分配、已接受、已投票、已委托和已释放 |

| 成员函数 | 作用 |
|---|---|
| `assign(ActorCapabilitySnapshot snapshot, ActorRef assigned_by)` | 绑定可承担 actor |
| `accept(ActorRef actor)` | actor 接受责任 |
| `record_vote(GovernanceVote vote, ActorRef actor)` | 记录审批或投票结果 |
| `delegate_to(ActorRef delegate_ref, DelegationReason reason, ActorRef actor)` | 委托给替代 actor |
| `release(ResponsibilityReleaseReason reason, ActorRef actor)` | 释放责任并保留原因 |

| 工厂函数 | 作用 |
|---|---|
| `require(GovernanceContext context, ApproverRequirement requirement)` | 从治理语境和责任要求形成责任对象 |

| 禁止事项 | 说明 |
|---|---|
| 不拥有 identity truth | 只引用 actor / member / role 摘要 |
| 不替代平台授权 | 平台认证授权仍属于安全 / identity 边界 |

---

## A6. `ApproverRequirement`

| 项 | 内容 |
|---|---|
| 所属部分 | `Approval and responsibility management` |
| 对象类型 | value object / responsibility requirement |
| 结构责任 | 表达裁决所需审批角色、能力、人数、替代和风险承担条件 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `requirement_id` | `ApproverRequirementId` | 要求身份 |
| `required_role_ref` | `Option<RoleRef>` | 需要的角色引用 |
| `required_capability_refs` | `CapabilityRefSet` | 需要的能力引用 |
| `approval_threshold` | `ApprovalThreshold` | 通过所需数量或比例 |
| `delegation_rule` | `DelegationRule` | 是否允许替代或升级 |

| 状态 | 作用 |
|---|---|
| 不适用 | 要求对象本身不表达生命周期 |

| 成员函数 | 作用 |
|---|---|
| `matches(ActorCapabilitySnapshot snapshot)` | 判断 actor 是否满足责任要求 |
| `allows_delegation(ActorRef delegate_ref)` | 判断是否允许委托 |
| `requires_human_review()` | 判断是否必须人工裁决 |

| 工厂函数 | 作用 |
|---|---|
| `from_policy(PolicyEffectiveFact policy_fact, GovernanceContext context)` | 从已生效 Policy 和治理语境形成审批要求 |

| 禁止事项 | 说明 |
|---|---|
| 不保存 role definition body | 只保存 role / capability 引用 |
| 不降低 shared rules | 低层 policy 不得削弱组织级要求 |

---

## A7. `ResponsibilityChain`

| 项 | 内容 |
|---|---|
| 所属部分 | `Approval and responsibility management` |
| 对象类型 | 聚合 / responsibility chain |
| 结构责任 | 表达多责任人、替代、升级和 risk owner 的责任链路 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `chain_id` | `ResponsibilityChainId` | 责任链身份 |
| `context_ref` | `GovernanceContextRef` | 所属治理语境 |
| `responsibility_refs` | `ApprovalResponsibilityRefSet` | 链上责任对象集合 |
| `chain_state` | `ResponsibilityChainState` | 责任链是否满足裁决要求 |

| 状态 | 作用 |
|---|---|
| `Open` / `Satisfied` / `Escalated` / `Blocked` / `Closed` | 待满足、已满足、已升级、被阻塞和已关闭 |

| 成员函数 | 作用 |
|---|---|
| `append(ApprovalResponsibility responsibility)` | 加入新的责任节点 |
| `mark_satisfied(ActorRef actor)` | 标记责任链已经满足裁决要求 |
| `escalate(EscalationReason reason, ActorRef actor)` | 升级责任链 |
| `block(ResponsibilityBlockReason reason)` | 标记责任链无法满足 |
| `close(ResponsibilityCloseReason reason, ActorRef actor)` | 关闭责任链 |

| 工厂函数 | 作用 |
|---|---|
| `start_for_context(GovernanceContext context, ApproverRequirement requirement)` | 为治理语境建立初始责任链 |

| 禁止事项 | 说明 |
|---|---|
| 不替代 Decision | 责任链满足只说明可裁决,不等于裁决结论 |
| 不接管 identity 生命周期 | 责任链只保存责任事实和 actor 引用 |
