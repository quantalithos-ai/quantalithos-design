# Step 6 附录 A2. Policy / Compliance / Corrective 关键对象

> 主控文件: `02_hld_step_06_key_objects.md`
> 本文件只给概要骨架,不定义完整对象契约。

---

## A8. `PolicyEffectiveFact`

| 项 | 内容 |
|---|---|
| 所属部分 | `Policy and shared rules management` |
| 对象类型 | 聚合 / policy truth |
| 结构责任 | 表达已生效、可消费、带 scope / priority / version 语义的治理策略事实 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `policy_fact_id` | `PolicyEffectiveFactId` | 生效事实身份 |
| `policy_definition_ref` | `MethodPolicyRef` | 来源 Policy 定义引用 |
| `scope_ref` | `GovernanceScopeRef` | 生效范围 |
| `priority` | `PolicyPriority` | 冲突和覆盖判断优先级 |
| `policy_state` | `PolicyEffectiveState` | 生效、暂停或退役状态 |

| 状态 | 作用 |
|---|---|
| `Proposed` / `Effective` / `Suspended` / `Superseded` / `Retired` | 待生效、已生效、暂停、被替代和退役 |

| 成员函数 | 作用 |
|---|---|
| `activate(MethodPolicySnapshot snapshot, ActorRef actor)` | 基于定义快照生效 Policy |
| `suspend(PolicySuspendReason reason, ActorRef actor)` | 暂停 Policy 生效 |
| `supersede(PolicyEffectiveFactRef next_ref, ActorRef actor)` | 被新版本或新事实替代 |
| `retire(PolicyRetireReason reason, ActorRef actor)` | 退役不再适用的 Policy |

| 工厂函数 | 作用 |
|---|---|
| `propose(MethodPolicySnapshot snapshot, GovernanceScopeRef scope_ref, ActorRef actor)` | 从定义快照和 scope 形成待生效事实 |

| 禁止事项 | 说明 |
|---|---|
| 不拥有 AIPolicyDef 正文 | 只保存定义引用、版本和 safe summary 边界 |
| 不由 runtime cache 反向定义 | 执行层命中结果不能形成 Policy truth |

---

## A9. `SharedRuleSet`

| 项 | 内容 |
|---|---|
| 所属部分 | `Policy and shared rules management` |
| 对象类型 | 聚合 / organization hard constraint truth |
| 结构责任 | 表达组织级不可被低 scope 覆盖的治理硬约束集合 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `rule_set_id` | `SharedRuleSetId` | shared rules 集合身份 |
| `scope_ref` | `GovernanceScopeRef` | 规则适用范围 |
| `rule_refs` | `SharedRuleRefSet` | 规则引用集合 |
| `rule_set_state` | `SharedRuleSetState` | 集合生命周期 |

| 状态 | 作用 |
|---|---|
| `Draft` / `Active` / `Deprecated` / `Retired` | 草稿、生效、弃用和退役 |

| 成员函数 | 作用 |
|---|---|
| `activate(ActorRef actor)` | 生效 shared rules |
| `add_rule(SharedRuleRef rule_ref, ActorRef actor)` | 加入组织级规则引用 |
| `deprecate_rule(SharedRuleRef rule_ref, SharedRuleReason reason, ActorRef actor)` | 弃用单条规则 |
| `retire(SharedRuleReason reason, ActorRef actor)` | 退役规则集合 |

| 工厂函数 | 作用 |
|---|---|
| `draft(GovernanceScopeRef scope_ref, ActorRef actor)` | 为 scope 建立 shared rules 草稿 |

| 禁止事项 | 说明 |
|---|---|
| 不允许低 scope 覆盖 | project / runtime / local config 不得削弱 shared rules |
| 不保存标准正文 | 规则可引用标准或 policy,但不复制正文 |

---

## A10. `PolicyConflictRecord`

| 项 | 内容 |
|---|---|
| 所属部分 | `Policy and shared rules management` |
| 对象类型 | history / conflict record |
| 结构责任 | 表达 Policy scope、priority、shared rules 或 override 之间的冲突和处理结论 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `conflict_id` | `PolicyConflictId` | 冲突记录身份 |
| `conflicting_policy_refs` | `PolicyEffectiveFactRefSet` | 发生冲突的 Policy |
| `shared_rule_set_ref` | `Option<SharedRuleSetRef>` | 涉及的 shared rules |
| `conflict_state` | `PolicyConflictState` | 冲突处理状态 |
| `resolution_ref` | `Option<GovernanceDecisionRef>` | 冲突处理依据 |

| 状态 | 作用 |
|---|---|
| `Detected` / `PendingDecision` / `Resolved` / `Waived` / `Invalid` | 已发现、待裁决、已解决、已豁免和无效 |

| 成员函数 | 作用 |
|---|---|
| `mark_pending_decision(Gate gate)` | 因冲突需要正式裁决 |
| `resolve(GovernanceDecision decision, ActorRef actor)` | 基于正式裁决解决冲突 |
| `waive(GovernanceWaiveReason reason, ActorRef actor)` | 豁免冲突并保留依据 |
| `invalidate(PolicyConflictInvalidReason reason)` | 标记冲突不成立 |

| 工厂函数 | 作用 |
|---|---|
| `detect(PolicyEffectiveFactRefSet conflicting_policy_refs, GovernanceScopeRef scope_ref)` | 从 Policy 集合中发现冲突记录 |

| 禁止事项 | 说明 |
|---|---|
| 不自动削弱 shared rules | shared rules 冲突必须显式处理 |
| 不替代 Policy truth | conflict record 只记录冲突和处理,不保存完整 Policy |

---

## A11. `ControlApplicability`

| 项 | 内容 |
|---|---|
| 所属部分 | `Control and compliance conclusion management` |
| 对象类型 | 聚合 / control truth |
| 结构责任 | 表达控制项在治理语境下的适用、排除或待评估事实 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `applicability_id` | `ControlApplicabilityId` | 控制适用事实身份 |
| `control_ref` | `MethodControlRef` | 控制定义引用 |
| `context_ref` | `GovernanceContextRef` | 治理语境 |
| `applicability_state` | `ControlApplicabilityState` | 适用性状态 |
| `basis_ref` | `Option<EvidenceSummaryRef>` | 适用 / 排除依据 |

| 状态 | 作用 |
|---|---|
| `PendingAssessment` / `Applicable` / `NotApplicable` / `Excluded` / `Superseded` | 待评估、适用、不适用、排除和被替代 |

| 成员函数 | 作用 |
|---|---|
| `mark_applicable(EvidenceSummaryRef basis_ref, ActorRef actor)` | 标记控制适用 |
| `mark_not_applicable(ControlExcludeReason reason, ActorRef actor)` | 标记控制不适用 |
| `exclude(ControlExcludeReason reason, EvidenceSummaryRef basis_ref, ActorRef actor)` | 基于依据排除控制 |
| `supersede(ControlApplicabilityRef next_ref, ActorRef actor)` | 被后续适用性判断替代 |

| 工厂函数 | 作用 |
|---|---|
| `assess(GovernanceContext context, MethodControlSnapshot control_snapshot)` | 为治理语境创建控制适用性评估 |

| 禁止事项 | 说明 |
|---|---|
| 不保存 ControlDefinition 正文 | 只保存定义引用和 safe summary |
| 不由 report 反写适用性 | 报告只能消费适用事实 |

---

## A12. `ControlReview`

| 项 | 内容 |
|---|---|
| 所属部分 | `Control and compliance conclusion management` |
| 对象类型 | 实体 / control review truth |
| 结构责任 | 表达控制实施、复核、违反、整改关联和复核结论 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `review_id` | `ControlReviewId` | 复核身份 |
| `applicability_ref` | `ControlApplicabilityRef` | 对应控制适用事实 |
| `review_state` | `ControlReviewState` | 复核状态 |
| `reviewer_ref` | `ActorRef` | 复核责任 actor |
| `evidence_ref` | `Option<EvidenceSummaryRef>` | 复核依据 |

| 状态 | 作用 |
|---|---|
| `Planned` / `InReview` / `Passed` / `Failed` / `Waived` / `Superseded` | 计划、复核中、通过、失败、豁免和被替代 |

| 成员函数 | 作用 |
|---|---|
| `start(ActorRef reviewer_ref)` | 开始复核 |
| `pass(EvidenceSummaryRef evidence_ref, ActorRef actor)` | 基于依据通过复核 |
| `fail(ControlFailureReason reason, EvidenceSummaryRef evidence_ref, ActorRef actor)` | 记录复核失败 |
| `waive(GovernanceDecision decision, ActorRef actor)` | 基于正式裁决豁免复核 |

| 工厂函数 | 作用 |
|---|---|
| `plan(ControlApplicability applicability, ActorRef reviewer_ref)` | 为适用控制创建复核 |

| 禁止事项 | 说明 |
|---|---|
| 不保存 evidence body | 只保存证据引用或摘要 |
| 不替代 Nonconformity | 失败可触发不符合,但不等于纠正闭环 |

---

## A13. `AIIAConclusion`

| 项 | 内容 |
|---|---|
| 所属部分 | `Control and compliance conclusion management` |
| 对象类型 | 聚合 / compliance conclusion truth |
| 结构责任 | 表达 AI impact assessment 的治理评审、风险、适用性和批准结论 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `aiia_conclusion_id` | `AIIAConclusionId` | AIIA 结论身份 |
| `context_ref` | `GovernanceContextRef` | 所属治理语境 |
| `artifact_ref` | `ArtifactRef` | AIIA 正文来源引用 |
| `conclusion_state` | `ComplianceConclusionState` | 结论生命周期 |
| `approval_decision_ref` | `Option<GovernanceDecisionRef>` | 批准或拒绝依据 |

| 状态 | 作用 |
|---|---|
| `Drafted` / `InReview` / `Approved` / `Rejected` / `Superseded` / `Revoked` | 草稿、评审中、批准、拒绝、被替代和撤销 |

| 成员函数 | 作用 |
|---|---|
| `submit_for_review(EvidenceSummaryRef evidence_ref, ActorRef actor)` | 提交治理评审 |
| `approve(GovernanceDecision decision, ActorRef actor)` | 基于正式裁决批准 |
| `reject(GovernanceRejectReason reason, ActorRef actor)` | 拒绝结论 |
| `supersede(AIIAConclusionRef next_ref, ActorRef actor)` | 被新结论替代 |

| 工厂函数 | 作用 |
|---|---|
| `from_artifact(GovernanceContext context, ArtifactRef artifact_ref, ActorRef actor)` | 从 artifact 正文引用形成 AIIA 治理结论 |

| 禁止事项 | 说明 |
|---|---|
| 不保存 AIIA 正文 | 正文属于 artifact / archive 边界 |
| 不自动批准 | 自动草拟或建议不能替代正式评审 |

---

## A14. `SoAConclusion`

| 项 | 内容 |
|---|---|
| 所属部分 | `Control and compliance conclusion management` |
| 对象类型 | 聚合 / compliance conclusion truth |
| 结构责任 | 表达 Statement of Applicability 的控制覆盖、适用 / 排除和批准结论 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `soa_conclusion_id` | `SoAConclusionId` | SoA 结论身份 |
| `context_ref` | `GovernanceContextRef` | 所属治理语境 |
| `artifact_ref` | `ArtifactRef` | SoA 正文来源引用 |
| `control_coverage_ref` | `ControlCoverageRef` | 控制覆盖摘要引用 |
| `conclusion_state` | `ComplianceConclusionState` | 结论生命周期 |

| 状态 | 作用 |
|---|---|
| `Drafted` / `InReview` / `Approved` / `Rejected` / `Superseded` / `Revoked` | 草稿、评审中、批准、拒绝、被替代和撤销 |

| 成员函数 | 作用 |
|---|---|
| `attach_control_coverage(ControlCoverageRef coverage_ref)` | 绑定控制覆盖摘要 |
| `submit_for_review(EvidenceSummaryRef evidence_ref, ActorRef actor)` | 提交治理评审 |
| `approve(GovernanceDecision decision, ActorRef actor)` | 基于正式裁决批准 |
| `reject(GovernanceRejectReason reason, ActorRef actor)` | 拒绝结论 |
| `supersede(SoAConclusionRef next_ref, ActorRef actor)` | 被新结论替代 |

| 工厂函数 | 作用 |
|---|---|
| `from_artifact(GovernanceContext context, ArtifactRef artifact_ref, ActorRef actor)` | 从 artifact 正文引用形成 SoA 治理结论 |

| 禁止事项 | 说明 |
|---|---|
| 不保存 SoA 正文 | 正文属于 artifact / archive 边界 |
| 不遗漏控制覆盖判断 | SoA 结论必须可回链控制覆盖摘要 |

---

## A15. `NonconformityRecord`

| 项 | 内容 |
|---|---|
| 所属部分 | `Nonconformity corrective loop` |
| 对象类型 | 聚合 / corrective truth |
| 结构责任 | 表达正式不符合事实、严重度、原因、责任和闭环状态 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `nonconformity_id` | `NonconformityId` | 不符合身份 |
| `context_ref` | `GovernanceContextRef` | 所属治理语境 |
| `severity` | `NonconformitySeverity` | 严重度 |
| `record_state` | `NonconformityState` | 不符合闭环状态 |
| `owner_ref` | `ActorRef` | 处置责任 actor |
| `source_ref` | `GovernanceSourceRef` | 来源线索 |

| 状态 | 作用 |
|---|---|
| `Raised` / `CauseConfirmed` / `Correcting` / `ReadyForVerification` / `Closed` / `Reopened` / `Rejected` | 已提出、原因已确认、纠正中、待复验、已关闭、重开和已拒绝 |

| 成员函数 | 作用 |
|---|---|
| `confirm_cause(NonconformityCauseRef cause_ref, ActorRef actor)` | 确认原因 |
| `start_correction(CorrectiveAction action, ActorRef actor)` | 开始纠正 |
| `mark_ready_for_verification(ActorRef actor)` | 标记待复验 |
| `close(VerificationResult result, ActorRef actor)` | 基于复验结果关闭 |
| `reopen(NonconformityReopenReason reason, ActorRef actor)` | 重开不符合闭环 |
| `reject(NonconformityRejectReason reason, ActorRef actor)` | 拒绝不成立的不符合线索 |

| 工厂函数 | 作用 |
|---|---|
| `raise(GovernanceContext context, NonconformitySeverity severity, GovernanceSourceRef source_ref, ActorRef actor)` | 从正式治理语境提出不符合 |

| 禁止事项 | 说明 |
|---|---|
| 不等同 bug / blocker / alert | 外部线索可以触发,但不能替代正式纠正闭环 |
| 不无依据关闭 | 关闭必须基于复验结果 |

---

## A16. `CorrectiveAction`

| 项 | 内容 |
|---|---|
| 所属部分 | `Nonconformity corrective loop` |
| 对象类型 | 实体 / corrective action truth |
| 结构责任 | 表达纠正动作、责任、目标结果和执行状态 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `action_id` | `CorrectiveActionId` | 纠正动作身份 |
| `nonconformity_ref` | `NonconformityRef` | 所属不符合 |
| `owner_ref` | `ActorRef` | 纠正责任 actor |
| `action_state` | `CorrectiveActionState` | 纠正动作状态 |
| `work_ref` | `Option<WorkGovernanceContextRef>` | 可选工作协作引用 |

| 状态 | 作用 |
|---|---|
| `Planned` / `InProgress` / `Completed` / `Cancelled` / `Failed` | 已计划、执行中、已完成、已取消和失败 |

| 成员函数 | 作用 |
|---|---|
| `start(ActorRef actor)` | 开始纠正动作 |
| `complete(EvidenceSummaryRef evidence_ref, ActorRef actor)` | 基于依据完成纠正 |
| `cancel(CorrectiveActionCancelReason reason, ActorRef actor)` | 取消纠正动作 |
| `fail(CorrectiveActionFailureReason reason, ActorRef actor)` | 标记纠正失败 |

| 工厂函数 | 作用 |
|---|---|
| `plan(NonconformityRecord record, ActorRef owner_ref)` | 为不符合记录规划纠正动作 |

| 禁止事项 | 说明 |
|---|---|
| 不替代 WorkItem | 可引用工作协作,但纠正责任事实归 Governance |
| 不保存执行正文 | 只保存动作状态和依据引用 |

---

## A17. `VerificationResult`

| 项 | 内容 |
|---|---|
| 所属部分 | `Nonconformity corrective loop` |
| 对象类型 | value object / verification result |
| 结构责任 | 表达复验结论、失败原因和关闭依据 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `verification_id` | `VerificationResultId` | 复验结果身份 |
| `nonconformity_ref` | `NonconformityRef` | 被复验的不符合 |
| `verification_state` | `VerificationState` | 复验是否通过 |
| `evidence_ref` | `EvidenceSummaryRef` | 复验依据引用 |
| `verifier_ref` | `ActorRef` | 复验 actor |

| 状态 | 作用 |
|---|---|
| `Passed` / `Failed` / `Inconclusive` | 通过、失败和无法确认 |

| 成员函数 | 作用 |
|---|---|
| `is_passed()` | 判断是否可支持关闭 |
| `requires_rework()` | 判断是否需要重新纠正 |
| `relates_to(NonconformityRef nonconformity_ref)` | 判断是否属于指定不符合 |

| 工厂函数 | 作用 |
|---|---|
| `from_evidence(NonconformityRef nonconformity_ref, EvidenceSummaryRef evidence_ref, ActorRef verifier_ref, VerificationState state)` | 从复验证据形成结果 |

| 禁止事项 | 说明 |
|---|---|
| 不保存 evidence body | 只保存依据引用 |
| 不单独关闭不符合 | 关闭由 NonconformityRecord 基于本结果执行 |

---

## A18. `DerivedGovernanceViewState`

| 项 | 内容 |
|---|---|
| 所属部分 | `Derived maintenance and reconciliation` |
| 对象类型 | projection state |
| 结构责任 | 表达派生治理视图的 freshness、rebuild 和失败状态 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `view_ref` | `DerivedGovernanceViewRef` | 被维护视图 |
| `freshness_state` | `DerivedGovernanceViewFreshnessState` | 新鲜度状态 |
| `source_cursor` | `GovernanceTruthCursor` | 派生来源位置 |
| `last_failure_ref` | `Option<DerivedViewFailureRef>` | 最近失败引用 |

| 状态 | 作用 |
|---|---|
| `Fresh` / `Stale` / `Rebuilding` / `Failed` / `Unavailable` | 新鲜、过期、重建中、失败和不可用 |

| 成员函数 | 作用 |
|---|---|
| `mark_stale(GovernanceTruthCursor cursor)` | 标记视图需要重建 |
| `start_rebuild(GovernanceTruthCursor cursor)` | 开始重建 |
| `mark_fresh(GovernanceTruthCursor cursor)` | 标记视图已追上来源 |
| `mark_failed(DerivedViewFailureReason reason)` | 记录维护失败 |

| 工厂函数 | 作用 |
|---|---|
| `for_view(DerivedGovernanceViewRef view_ref)` | 为派生视图建立状态对象 |

| 禁止事项 | 说明 |
|---|---|
| 不反写真相 | 派生状态不能修改 Governance truth |
| 不阻塞核心成立 | 视图失败只影响消费和维护可见性 |

---

## A19. `ReferenceResolutionState`

| 项 | 内容 |
|---|---|
| 所属部分 | `External context mirror support` |
| 对象类型 | reference state |
| 结构责任 | 表达外部引用 resolved、unresolved、stale、invalid 等解析状态 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `reference_ref` | `ExternalGovernanceReferenceRef` | 被解析引用 |
| `resolution_state` | `ReferenceResolutionKind` | 当前解析状态 |
| `source_version_ref` | `Option<ExternalSourceVersionRef>` | 来源版本引用 |
| `checked_at` | `ReferenceCheckedAt` | 最近检查时间 |
| `failure_reason` | `Option<ReferenceResolutionFailureReason>` | 失败原因 |

| 状态 | 作用 |
|---|---|
| `Resolved` / `Unresolved` / `Stale` / `Invalid` / `Unavailable` | 已解析、未解析、过期、无效和来源不可用 |

| 成员函数 | 作用 |
|---|---|
| `mark_resolved(ExternalSourceVersionRef source_version_ref)` | 标记引用已解析 |
| `mark_unresolved(ReferenceResolutionFailureReason reason)` | 标记无法解析 |
| `mark_stale(ReferenceStaleReason reason)` | 标记来源过期 |
| `mark_invalid(ReferenceInvalidReason reason)` | 标记引用无效 |

| 工厂函数 | 作用 |
|---|---|
| `for_reference(ExternalGovernanceReferenceRef reference_ref)` | 为外部引用建立解析状态 |

| 禁止事项 | 说明 |
|---|---|
| 不替代外部 truth | 只表达本地解析状态 |
| 不保存外部正文 | 不保存来源对象 body、message、log、document 或 package |
