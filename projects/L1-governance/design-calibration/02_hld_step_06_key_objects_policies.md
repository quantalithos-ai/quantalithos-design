# Step 6 附录 B1. Policy / Guard 关键对象

> 主控文件: `02_hld_step_06_key_objects.md`
> Policy 只表达判断边界,不保存业务 truth。

---

## B1. `GovernanceTruthPolicy`

| 项 | 内容 |
|---|---|
| 所属部分 | `Governance truth core` |
| 对象类型 | policy / guard |
| 结构责任 | 判断核心 Governance truth 变化是否允许成立 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `policy_scope` | `GovernancePolicyScope` | 限定判断范围 |
| `truth_snapshot` | `GovernanceTruthSnapshot` | 提供当前 Governance truth 摘要 |

| 成员函数 | 作用 |
|---|---|
| `assert_truth_change_allowed(GovernanceTruthChange change, ActorRef actor)` | 校验核心变化是否允许 |
| `assert_no_external_body(ExternalContextSummary source)` | 校验未吸收外部正文 |
| `assert_no_derived_writeback(DerivedGovernanceViewRef view_ref)` | 校验派生结构不反写真相 |

| 工厂函数 | 作用 |
|---|---|
| `from_snapshot(GovernanceTruthSnapshot truth_snapshot)` | 从当前 truth 摘要形成策略上下文 |

| 禁止事项 | 说明 |
|---|---|
| 不替代具体对象状态迁移 | 具体状态变化仍由对象自身表达 |
| 不允许配置改变 truth 归属 | 配置只能影响参数,不能改变边界 |

---

## B2. `GovernanceContextPolicy`

| 项 | 内容 |
|---|---|
| 所属部分 | `Governance context and input management` |
| 对象类型 | policy / guard |
| 结构责任 | 判断治理语境和输入是否具备可裁决条件 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `context_ref` | `GovernanceContextRef` | 被判断语境 |
| `reference_state` | `ReferenceResolutionState` | 外部引用解析状态 |

| 成员函数 | 作用 |
|---|---|
| `assert_context_ready(GovernanceContext context)` | 校验语境可裁决 |
| `assert_subject_visible(GovernedSubjectRef subject_ref, ActorRef actor)` | 校验 actor 可触达被治理对象 |
| `assert_input_acceptable(GovernanceInput input)` | 校验输入可以进入治理处理 |
| `assert_no_external_body(GovernanceSourceRef source_ref)` | 校验输入来源不携带正文 |

| 工厂函数 | 作用 |
|---|---|
| `for_context(GovernanceContext context)` | 从治理语境形成策略 |

| 禁止事项 | 说明 |
|---|---|
| 不补造外部 truth | 外部引用未解析时只能 pending / invalid |
| 不替代 Gate / Decision | 可裁决不等于已裁决 |

---

## B3. `DecisionPolicy`

| 项 | 内容 |
|---|---|
| 所属部分 | `Gate and decision management` |
| 对象类型 | policy / guard |
| 结构责任 | 判断 Gate 裁决是否满足责任、Policy、evidence 和 shared rules 要求 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `gate_ref` | `GateRef` | 被裁决 Gate |
| `responsibility_chain_ref` | `ResponsibilityChainRef` | 裁决责任链 |
| `shared_rule_set_ref` | `Option<SharedRuleSetRef>` | 适用 shared rules |

| 成员函数 | 作用 |
|---|---|
| `assert_can_decide(Gate gate, ResponsibilityChain chain, ActorRef actor)` | 校验 actor 和责任链允许裁决 |
| `assert_basis_sufficient(EvidenceSummaryRef basis_ref)` | 校验裁决依据足够 |
| `assert_shared_rules_satisfied(SharedRuleSet shared_rules)` | 校验未违反 shared rules |
| `assert_supersede_allowed(GovernanceDecision current, GovernanceDecision next)` | 校验替代裁决允许 |

| 工厂函数 | 作用 |
|---|---|
| `for_gate(Gate gate, ResponsibilityChain chain)` | 从 Gate 和责任链形成裁决策略 |

| 禁止事项 | 说明 |
|---|---|
| 不允许无责任裁决 | 高影响或正式 Gate 必须有责任依据 |
| 不让 process waiting 替代裁决 | 等待状态只能消费正式 Decision |

---

## B4. `ApprovalResponsibilityPolicy`

| 项 | 内容 |
|---|---|
| 所属部分 | `Approval and responsibility management` |
| 对象类型 | policy / guard |
| 结构责任 | 判断责任承担、委托、投票和授权是否允许 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `responsibility_ref` | `ApprovalResponsibilityRef` | 被判断责任 |
| `actor_snapshot` | `ActorCapabilitySnapshot` | actor 可承担摘要 |

| 成员函数 | 作用 |
|---|---|
| `assert_can_assign(ApproverRequirement requirement, ActorCapabilitySnapshot snapshot)` | 校验 actor 满足责任要求 |
| `assert_can_vote(ApprovalResponsibility responsibility, ActorRef actor)` | 校验 actor 可投票 |
| `assert_can_delegate(ApprovalResponsibility responsibility, ActorRef delegate_ref)` | 校验可委托 |
| `assert_chain_satisfied(ResponsibilityChain chain)` | 校验责任链满足裁决要求 |

| 工厂函数 | 作用 |
|---|---|
| `from_snapshot(ApprovalResponsibility responsibility, ActorCapabilitySnapshot snapshot)` | 从责任和 actor 摘要形成策略 |

| 禁止事项 | 说明 |
|---|---|
| 不修改 identity truth | 只消费 actor / role / capability 摘要 |
| 不绕过 shared rules | 委托或替代不得削弱组织级约束 |

---

## B5. `PolicyConflictPolicy`

| 项 | 内容 |
|---|---|
| 所属部分 | `Policy and shared rules management` |
| 对象类型 | policy / guard |
| 结构责任 | 判断 Policy scope、priority、conflict 和 override 是否成立 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `scope_ref` | `GovernanceScopeRef` | 被判断范围 |
| `policy_refs` | `PolicyEffectiveFactRefSet` | 参与判断的 Policy |

| 成员函数 | 作用 |
|---|---|
| `detect_conflicts(PolicyEffectiveFactRefSet policy_refs)` | 发现冲突候选 |
| `assert_override_allowed(PolicyEffectiveFact higher, PolicyEffectiveFact lower)` | 校验 override 是否允许 |
| `assert_resolution_required(PolicyConflictRecord conflict)` | 判断冲突是否必须进入正式裁决 |

| 工厂函数 | 作用 |
|---|---|
| `for_scope(GovernanceScopeRef scope_ref, PolicyEffectiveFactRefSet policy_refs)` | 从 scope 和 Policy 集合形成冲突策略 |

| 禁止事项 | 说明 |
|---|---|
| 不让低 scope 覆盖高 scope | priority 和 shared rules 必须受保护 |
| 不由 runtime cache 处理冲突 | 冲突处理归 Governance truth |

---

## B6. `SharedRulesPolicy`

| 项 | 内容 |
|---|---|
| 所属部分 | `Policy and shared rules management` |
| 对象类型 | policy / guard |
| 结构责任 | 判断 shared rules 是否被违反或被低 scope 越权覆盖 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `rule_set_ref` | `SharedRuleSetRef` | 被判断规则集合 |
| `scope_ref` | `GovernanceScopeRef` | 当前治理范围 |

| 成员函数 | 作用 |
|---|---|
| `assert_rule_satisfied(SharedRuleRef rule_ref, GovernanceContext context)` | 校验单条 shared rule |
| `assert_no_lower_scope_override(PolicyEffectiveFact policy_fact)` | 校验低 scope Policy 没有覆盖组织级规则 |
| `requires_manual_decision(SharedRuleViolation violation)` | 判断违反是否必须人工裁决 |

| 工厂函数 | 作用 |
|---|---|
| `for_rule_set(SharedRuleSet rule_set)` | 从 shared rules 形成策略 |

| 禁止事项 | 说明 |
|---|---|
| 不被配置关闭核心约束 | 配置不得绕过组织级硬约束 |
| 不保存标准正文 | shared rule 可以引用标准,但不复制正文 |

---

## B7. `PolicyScopePolicy`

| 项 | 内容 |
|---|---|
| 所属部分 | `Policy and shared rules management` |
| 对象类型 | policy / guard |
| 结构责任 | 判断 Policy 生效范围、继承和适用对象是否一致 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `scope_ref` | `GovernanceScopeRef` | 被判断 scope |
| `subject_ref` | `GovernedSubjectRef` | 被治理对象 |

| 成员函数 | 作用 |
|---|---|
| `assert_scope_matches_subject(GovernanceScopeRef scope_ref, GovernedSubjectRef subject_ref)` | 校验 scope 与对象匹配 |
| `assert_scope_inheritance_allowed(GovernanceScopeRef parent_scope_ref, GovernanceScopeRef child_scope_ref)` | 校验 scope 继承允许 |
| `assert_effective_at(GovernanceEffectiveAt effective_at)` | 校验生效时间语义 |

| 工厂函数 | 作用 |
|---|---|
| `for_subject(GovernedSubjectRef subject_ref)` | 从被治理对象形成 scope 策略 |

| 禁止事项 | 说明 |
|---|---|
| 不把 project config 当 Policy truth | 项目配置只能作为输入或候选 |
| 不跨越被治理对象边界 | scope 不得扩大到无关对象 |

---

## B8. `ControlApplicabilityPolicy`

| 项 | 内容 |
|---|---|
| 所属部分 | `Control and compliance conclusion management` |
| 对象类型 | policy / guard |
| 结构责任 | 判断控制适用、排除、复核和违反是否允许成立 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `control_ref` | `MethodControlRef` | 被判断控制 |
| `context_ref` | `GovernanceContextRef` | 治理语境 |
| `control_snapshot` | `MethodControlSnapshot` | 控制定义摘要 |

| 成员函数 | 作用 |
|---|---|
| `assert_can_assess(GovernanceContext context, MethodControlSnapshot snapshot)` | 校验控制可评估 |
| `assert_applicability_basis(EvidenceSummaryRef basis_ref)` | 校验适用 / 排除依据 |
| `assert_review_required(ControlApplicability applicability)` | 判断是否必须复核 |
| `assert_no_definition_body(MethodControlSnapshot snapshot)` | 校验未保存定义正文 |

| 工厂函数 | 作用 |
|---|---|
| `for_control(GovernanceContext context, MethodControlSnapshot snapshot)` | 从治理语境和控制摘要形成策略 |

| 禁止事项 | 说明 |
|---|---|
| 不保存 ControlDefinition 正文 | 只保存 ref / version / safe summary |
| 不由 report 改写适用事实 | report 只能消费 |

---

## B9. `ComplianceConclusionPolicy`

| 项 | 内容 |
|---|---|
| 所属部分 | `Control and compliance conclusion management` |
| 对象类型 | policy / guard |
| 结构责任 | 判断 AIIA / SoA 覆盖、证据、批准和替代是否允许 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `context_ref` | `GovernanceContextRef` | 治理语境 |
| `evidence_ref` | `Option<EvidenceSummaryRef>` | 评审依据 |
| `control_coverage_ref` | `Option<ControlCoverageRef>` | 控制覆盖摘要 |

| 成员函数 | 作用 |
|---|---|
| `assert_aiia_review_ready(AIIAConclusion conclusion)` | 校验 AIIA 可进入评审 |
| `assert_soa_control_coverage(SoAConclusion conclusion, ControlCoverageRef coverage_ref)` | 校验 SoA 控制覆盖 |
| `assert_approval_decision(GovernanceDecision decision)` | 校验批准裁决有效 |
| `assert_no_artifact_body(EvidenceSummaryRef evidence_ref)` | 校验未保存正文 |

| 工厂函数 | 作用 |
|---|---|
| `for_context(GovernanceContext context)` | 从治理语境形成合规结论策略 |

| 禁止事项 | 说明 |
|---|---|
| 不自动批准草稿 | 自动草拟或周期建议不能替代正式评审 |
| 不保存 AIIA / SoA 正文 | 正文归 artifact / archive 边界 |

---

## B10. `NonconformityClosurePolicy`

| 项 | 内容 |
|---|---|
| 所属部分 | `Nonconformity corrective loop` |
| 对象类型 | policy / guard |
| 结构责任 | 判断不符合纠正闭环是否允许进入复验、关闭或重开 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `nonconformity_ref` | `NonconformityRef` | 被判断不符合 |
| `severity` | `NonconformitySeverity` | 严重度 |

| 成员函数 | 作用 |
|---|---|
| `assert_can_confirm_cause(NonconformityRecord record, NonconformityCauseRef cause_ref)` | 校验原因可确认 |
| `assert_can_start_correction(NonconformityRecord record, CorrectiveAction action)` | 校验可开始纠正 |
| `assert_can_close(NonconformityRecord record, VerificationResult result)` | 校验可关闭 |
| `assert_can_reopen(NonconformityRecord record, NonconformityReopenReason reason)` | 校验可重开 |

| 工厂函数 | 作用 |
|---|---|
| `for_record(NonconformityRecord record)` | 从不符合记录形成关闭策略 |

| 禁止事项 | 说明 |
|---|---|
| 不允许无复验关闭 | 关闭必须有通过的复验结果 |
| 不把 bug / alert 当闭环 | 外部线索不能直接关闭 Governance truth |

---

## B11. `ReadVisibilityPolicy`

| 项 | 内容 |
|---|---|
| 所属部分 | `Governance consumption and traceability` |
| 对象类型 | policy / guard |
| 结构责任 | 判断 actor 对治理事实、投影、报告或追溯记录是否可见 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `actor_ref` | `ActorRef` | 读取 actor |
| `scope_ref` | `GovernanceScopeRef` | 查询范围 |
| `subject_ref` | `Option<GovernedSubjectRef>` | 被查询对象 |

| 成员函数 | 作用 |
|---|---|
| `assert_can_read_decision(GovernanceDecisionRef decision_ref)` | 校验可读取裁决 |
| `assert_can_read_policy(PolicyEffectiveFactRef policy_ref)` | 校验可读取 Policy |
| `assert_can_read_compliance(ComplianceConclusionRef conclusion_ref)` | 校验可读取合规结论 |
| `assert_can_read_trace(GovernanceTraceRecord record)` | 校验可读取追溯记录 |

| 工厂函数 | 作用 |
|---|---|
| `for_actor(ActorRef actor_ref, GovernanceScopeRef scope_ref)` | 从 actor 和 scope 形成读取策略 |

| 禁止事项 | 说明 |
|---|---|
| 不绕过授权查询 | query 必须经可见性判断 |
| 不泄露外部正文 | 即使可读,也只能输出 Governance fact / summary |

---

## B12. `DerivedGovernanceViewPolicy`

| 项 | 内容 |
|---|---|
| 所属部分 | `Derived maintenance and reconciliation` |
| 对象类型 | policy / guard |
| 结构责任 | 保护派生视图只读、可重建、不反写 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `view_ref` | `DerivedGovernanceViewRef` | 被维护视图 |
| `source_cursor` | `GovernanceTruthCursor` | 派生来源位置 |

| 成员函数 | 作用 |
|---|---|
| `assert_rebuild_source(GovernanceTruthCursor cursor)` | 校验重建来源 |
| `assert_no_truth_write(DerivedGovernanceViewRef view_ref)` | 校验视图不会反写真相 |
| `assert_report_derived_from_truth(GovernanceReportRef report_ref)` | 校验报告来源于 truth 或 projection |

| 工厂函数 | 作用 |
|---|---|
| `for_view(DerivedGovernanceViewRef view_ref, GovernanceTruthCursor source_cursor)` | 从视图和来源位置形成策略 |

| 禁止事项 | 说明 |
|---|---|
| 不生成业务事实 | 维护动作只能更新派生状态 |
| 不阻塞核心 truth 成立 | 派生失败只影响消费可见性 |
