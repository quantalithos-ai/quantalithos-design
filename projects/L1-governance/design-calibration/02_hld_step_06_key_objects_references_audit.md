# Step 6 附录 B3. Reference / Snapshot / Audit 关键对象

> 主控文件: `02_hld_step_06_key_objects.md`
> Reference / snapshot 只保存引用或摘要;history / audit / outbox 不替代当前 truth。

`GovernedSubjectRef`、`GovernanceSourceRef`、snapshot 和 signal 的字段表是详细设计的最小语义约束。详细设计必须对齐相邻仓正式 contracts,可以把 `ExternalSourceRef` 细化为对应 typed ref 或补充版本 / digest / captured_at 字段,但不得降级成裸字符串引用、删除摘要 / 验证 / 解析状态语义,也不得保存 process、work、artifact、conversation、runtime、observability、archive、method-library 或 external GRC 正文。

---

## B19. `GovernedSubjectRef`

| 项 | 内容 |
|---|---|
| 所属部分 | `Governance context and input management` |
| 对象类型 | reference object |
| 结构责任 | 指向被治理对象,例如 process、work、artifact、runtime、capability 或组织 scope |

| 字段 | 类型 | 作用 |
|---|---|---|
| `subject_kind` | `GovernedSubjectKind` | 被治理对象类别 |
| `external_ref` | `ExternalSourceRef` | 来源仓稳定引用 |
| `subject_digest` | `Option<SourceDigest>` | 对象摘要校验 |

| 成员函数 | 作用 |
|---|---|
| `is_process_subject()` | 判断是否为过程相关对象 |
| `is_work_subject()` | 判断是否为工作相关对象 |
| `same_subject(GovernedSubjectRef other)` | 判断是否同一被治理对象 |

| 工厂函数 | 作用 |
|---|---|
| `from_external(GovernedSubjectKind subject_kind, ExternalSourceRef external_ref)` | 从外部 typed ref 形成被治理对象引用 |

| 禁止事项 | 说明 |
|---|---|
| 不包含对象正文 | 只保存稳定引用和摘要 |
| 不替代来源仓 truth | 生命周期仍由来源仓拥有 |

---

## B20. `GovernanceSourceRef`

| 项 | 内容 |
|---|---|
| 所属部分 | `Governance context and input management` |
| 对象类型 | reference object |
| 结构责任 | 指向治理输入、证据、风险信号、周期复核或相邻仓请求来源 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `source_kind` | `GovernanceSourceKind` | 来源类别 |
| `external_ref` | `ExternalSourceRef` | 外部来源引用 |
| `source_version_ref` | `Option<ExternalSourceVersionRef>` | 来源版本引用 |
| `source_digest` | `Option<SourceDigest>` | 来源摘要校验 |

| 成员函数 | 作用 |
|---|---|
| `is_evidence_source()` | 判断是否为 evidence 来源 |
| `is_runtime_signal()` | 判断是否为 runtime / capability 信号 |
| `same_source(GovernanceSourceRef other)` | 判断是否同源 |

| 工厂函数 | 作用 |
|---|---|
| `from_external(GovernanceSourceKind source_kind, ExternalSourceRef external_ref)` | 从外部来源形成治理来源引用 |

| 禁止事项 | 说明 |
|---|---|
| 不包含来源正文 | 不保存 message、artifact、log、document 或 GRC record body |
| 不自动创建 Governance truth | 来源引用必须先经 GovernanceInput 收束 |

---

## B21. `ActorCapabilitySnapshot`

| 项 | 内容 |
|---|---|
| 所属部分 | `Approval and responsibility management` |
| 对象类型 | snapshot |
| 结构责任 | 保存 actor / member / role / capability 的本地可承担摘要 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `actor_ref` | `ActorRef` | 来源 actor |
| `role_refs` | `RoleRefSet` | actor 当前角色引用集合 |
| `capability_refs` | `CapabilityRefSet` | 可承担能力引用 |
| `snapshot_state` | `ReferenceResolutionState` | 快照解析和过期状态 |

| 成员函数 | 作用 |
|---|---|
| `supports(ApproverRequirement requirement)` | 判断 actor 是否满足审批要求 |
| `mark_stale(ReferenceStaleReason reason)` | 标记快照过期 |

| 工厂函数 | 作用 |
|---|---|
| `from_identity(ActorRef actor_ref, RoleRefSet role_refs, CapabilityRefSet capability_refs)` | 从 identity / capability 摘要形成快照 |

| 禁止事项 | 说明 |
|---|---|
| 不成为 identity truth | 不保存成员生命周期或认证凭据 |
| 不直接授权平台动作 | 只为 Governance 责任判断提供摘要 |

---

## B22. `MethodPolicySnapshot`

| 项 | 内容 |
|---|---|
| 所属部分 | `Policy and shared rules management` |
| 对象类型 | snapshot |
| 结构责任 | 保存 AIPolicyDef / method policy 的定义引用、版本和 safe summary |

| 字段 | 类型 | 作用 |
|---|---|---|
| `policy_ref` | `MethodPolicyRef` | method-library Policy 定义引用 |
| `policy_version_ref` | `MethodPolicyVersionRef` | 来源版本 |
| `scope_ref` | `GovernanceScopeRef` | body-free policy summary 声明的适用治理范围 |
| `summary_ref` | `SafeSummaryRef` | safe summary 引用 |
| `snapshot_state` | `ReferenceResolutionState` | 快照解析和过期状态 |

| 成员函数 | 作用 |
|---|---|
| `matches_scope(GovernanceScopeRef scope_ref)` | 只比较 snapshot 的 `scope_ref` 与入参是否为同一 stable scope identity |
| `mark_stale(ReferenceStaleReason reason)` | 标记快照过期 |

| 工厂函数 | 作用 |
|---|---|
| `from_method_library(MethodPolicyRef policy_ref, MethodPolicyVersionRef policy_version_ref, GovernanceScopeRef scope_ref, SafeSummaryRef summary_ref)` | 从 method-library 摘要形成快照 |

| 禁止事项 | 说明 |
|---|---|
| 不保存 AIPolicyDef 正文 | 只保存 ref、version 和 safe summary |
| 不形成 Policy truth | 生效事实由 PolicyEffectiveFact 表达 |
| 不做 scope 继承判断 | 跨 scope 继承 / 覆盖由详细设计中的 `PolicyScopePolicy` 承接 |

---

## B23. `MethodControlSnapshot`

| 项 | 内容 |
|---|---|
| 所属部分 | `Control and compliance conclusion management` |
| 对象类型 | snapshot |
| 结构责任 | 保存 ControlDefinition / standard control 的定义引用、版本和 safe summary |

| 字段 | 类型 | 作用 |
|---|---|---|
| `control_ref` | `MethodControlRef` | 控制定义引用 |
| `control_version_ref` | `MethodControlVersionRef` | 来源版本 |
| `summary_ref` | `SafeSummaryRef` | 控制摘要引用 |
| `snapshot_state` | `ReferenceResolutionState` | 快照解析和过期状态 |

| 成员函数 | 作用 |
|---|---|
| `matches_context(GovernanceContext context)` | 判断控制摘要是否可用于语境 |
| `mark_stale(ReferenceStaleReason reason)` | 标记快照过期 |

| 工厂函数 | 作用 |
|---|---|
| `from_method_library(MethodControlRef control_ref, MethodControlVersionRef control_version_ref, SafeSummaryRef summary_ref)` | 从 method-library 摘要形成快照 |

| 禁止事项 | 说明 |
|---|---|
| 不保存标准或控制正文 | 只保存 ref、version 和 summary |
| 不替代 ControlApplicability | 适用结论归 Governance truth |

---

## B24. `EvidenceSummaryRef`

| 项 | 内容 |
|---|---|
| 所属部分 | `Control and compliance conclusion management` |
| 对象类型 | reference object |
| 结构责任 | 指向 artifact / evidence / baseline / archive 等外部依据摘要 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `evidence_kind` | `EvidenceKind` | 依据类别 |
| `external_ref` | `ExternalSourceRef` | 外部依据引用 |
| `verified_state` | `EvidenceVerifiedState` | 依据是否已验证 |
| `summary_digest` | `Option<SourceDigest>` | 摘要校验 |

| 成员函数 | 作用 |
|---|---|
| `is_acceptable_for_decision()` | 判断是否可作为裁决依据 |
| `is_acceptable_for_compliance()` | 判断是否可作为合规评审依据 |
| `is_verified()` | 判断依据是否已验证 |

| 工厂函数 | 作用 |
|---|---|
| `from_verified(EvidenceKind evidence_kind, ExternalSourceRef external_ref, SourceDigest summary_digest)` | 从已验证依据形成引用 |

| 禁止事项 | 说明 |
|---|---|
| 不保存 evidence / artifact body | 只保存引用、摘要校验和验证状态 |
| 不替代 Evidence truth | Evidence 生命周期归 artifact 边界 |

---

## B25. `ProcessGovernanceContextRef`

| 项 | 内容 |
|---|---|
| 所属部分 | `External context mirror support` |
| 对象类型 | reference object |
| 结构责任 | 指向 process waiting、activity、checkpoint 或 recovery 相关治理语境 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `process_ref` | `ProcessInstanceRef` | 过程实例引用 |
| `activity_ref` | `Option<ActivityRef>` | 可选活动引用 |
| `waiting_gate_ref` | `Option<WaitingGateRef>` | 可选 process waiting gate 引用 |
| `snapshot_state` | `ReferenceResolutionState` | 引用解析状态 |

| 成员函数 | 作用 |
|---|---|
| `requires_decision()` | 判断 process 语境是否需要 Governance decision |
| `mark_stale(ReferenceStaleReason reason)` | 标记 process 语境过期 |

| 工厂函数 | 作用 |
|---|---|
| `from_process(ProcessInstanceRef process_ref, Option<ActivityRef> activity_ref)` | 从 process 引用形成治理上下文引用 |

| 禁止事项 | 说明 |
|---|---|
| 不拥有 process truth | 只保存引用和摘要状态 |
| 不替代 waiting gate | process waiting gate 归 L1-process |

---

## B26. `WorkGovernanceContextRef`

| 项 | 内容 |
|---|---|
| 所属部分 | `External context mirror support` |
| 对象类型 | reference object |
| 结构责任 | 指向 project、work、iteration、dependency 或 blocker 相关治理语境 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `project_ref` | `ProjectRef` | 项目引用 |
| `work_ref` | `Option<FormalWorkRef>` | 可选正式工作引用 |
| `iteration_ref` | `Option<IterationRef>` | 可选迭代引用 |
| `snapshot_state` | `ReferenceResolutionState` | 引用解析状态 |

| 成员函数 | 作用 |
|---|---|
| `requires_policy_check()` | 判断是否需要 Policy / shared rules 判断 |
| `mark_stale(ReferenceStaleReason reason)` | 标记 work 语境过期 |

| 工厂函数 | 作用 |
|---|---|
| `from_work(ProjectRef project_ref, Option<FormalWorkRef> work_ref)` | 从 work 引用形成治理上下文引用 |

| 禁止事项 | 说明 |
|---|---|
| 不拥有 Work truth | 项目和工作生命周期归 L1-work |
| 不把 blocker 当 Nonconformity | blocker 只能作为线索或语境 |

---

## B27. `RuntimeSignalRef`

| 项 | 内容 |
|---|---|
| 所属部分 | `External context mirror support` |
| 对象类型 | reference object |
| 结构责任 | 指向 runtime / capability feedback、autonomy signal 或 execution risk 摘要 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `signal_kind` | `RuntimeSignalKind` | 信号类别 |
| `external_ref` | `ExternalSourceRef` | 外部信号引用 |
| `signal_state` | `ReferenceResolutionState` | 信号解析状态 |
| `captured_at` | `RuntimeSignalCapturedAt` | 信号捕获时间 |

| 成员函数 | 作用 |
|---|---|
| `requires_governance_input()` | 判断信号是否应进入 GovernanceInput |
| `mark_stale(ReferenceStaleReason reason)` | 标记信号过期 |

| 工厂函数 | 作用 |
|---|---|
| `from_runtime(RuntimeSignalKind signal_kind, ExternalSourceRef external_ref)` | 从 runtime / capability 信号形成引用 |

| 禁止事项 | 说明 |
|---|---|
| 不保存 runtime log | 只保存引用和摘要边界 |
| 不反向定义 Policy truth | runtime feedback 只能作为治理输入 |

---

## B28. `GovernanceTraceRecord`

| 项 | 内容 |
|---|---|
| 所属部分 | `Governance consumption and traceability` |
| 对象类型 | trace record |
| 结构责任 | 记录治理事实变化、来源、消费、报告、对账和交接的追溯线索 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `trace_id` | `GovernanceTraceId` | 追溯记录身份 |
| `subject_ref` | `GovernanceTraceSubjectRef` | 被追溯对象 |
| `trace_kind` | `GovernanceTraceKind` | 追溯类别 |
| `trace_context` | `TraceContext` | L0-core trace 关联 |

| 成员函数 | 作用 |
|---|---|
| `relates_to(GovernanceTraceSubjectRef subject_ref)` | 判断是否属于某对象 |
| `prepare_handoff(TraceHandoffTargetRef target_ref)` | 形成 trace handoff 交接意图 |
| `requires_archive()` | 判断是否需要归档交接 |

| 工厂函数 | 作用 |
|---|---|
| `from_truth_change(GovernanceTruthChange change, TraceContext trace_context)` | 从已成立变化形成追溯记录 |

| 禁止事项 | 说明 |
|---|---|
| 不包含外部正文 | 不保存 artifact、conversation、runtime 或 observability body |
| 不替代业务对象当前状态 | 当前状态仍由 truth 对象表达 |

---

## B29. `GovernanceAuditTrail`

| 项 | 内容 |
|---|---|
| 所属部分 | `Governance truth core` |
| 对象类型 | audit trail |
| 结构责任 | 汇聚关键治理变化、责任、依据和消费的审计链路 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `audit_trail_id` | `GovernanceAuditTrailId` | 审计链身份 |
| `subject_ref` | `GovernanceAuditSubjectRef` | 审计对象 |
| `record_refs` | `GovernanceTraceRecordRefSet` | 关联追溯记录 |

| 成员函数 | 作用 |
|---|---|
| `append(GovernanceTraceRecord record)` | 追加追溯记录引用 |
| `has_gap()` | 判断审计链是否存在缺口 |
| `covers_subject(GovernanceAuditSubjectRef subject_ref)` | 判断是否覆盖指定审计对象 |

| 工厂函数 | 作用 |
|---|---|
| `start_for_subject(GovernanceAuditSubjectRef subject_ref)` | 为对象建立审计链 |

| 禁止事项 | 说明 |
|---|---|
| 不用审计链替代 truth repository | audit 只追溯,不表达当前业务状态 |
| 不成为 observability ledger | 物理观测账本归 L4-observability |

---

## B30. `GovernanceOutboxRecord`

| 项 | 内容 |
|---|---|
| 所属部分 | `Governance truth core` |
| 对象类型 | outbox record |
| 结构责任 | 表达已成立 Governance 事实需要传播、消费或交接 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `outbox_id` | `GovernanceOutboxId` | outbox 记录身份 |
| `event_kind` | `GovernanceOutboxEventKind` | 变化类别 |
| `subject_ref` | `GovernanceOutboxSubjectRef` | 对应变化对象 |
| `publication_state` | `OutboxPublicationState` | 传播状态 |

| 状态 | 作用 |
|---|---|
| `Pending` / `Published` / `Failed` / `DeadLettered` | 待发布、已发布、失败和死信 |

| 成员函数 | 作用 |
|---|---|
| `mark_published(OutboxPublicationRef publication_ref)` | 记录发布成功 |
| `mark_failed(OutboxFailureReason reason)` | 记录发布失败 |
| `mark_dead_lettered(OutboxDeadLetterReason reason)` | 记录不可恢复发布失败 |

| 工厂函数 | 作用 |
|---|---|
| `from_truth_change(GovernanceTruthChange change)` | 从已成立 truth 变化形成 outbox |

| 禁止事项 | 说明 |
|---|---|
| 不由 outbox 决定 truth 是否成立 | outbox 只传播已成立事实 |
| 不保存 event payload 全字段 | 详细 event schema 留给详细设计 |

---

## B31. `DecisionRecord`

| 项 | 内容 |
|---|---|
| 所属部分 | `Gate and decision management` |
| 对象类型 | decision history |
| 结构责任 | 记录裁决变化、依据、actor、修正和替代关系 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `record_id` | `DecisionRecordId` | 记录身份 |
| `decision_ref` | `GovernanceDecisionRef` | 对应裁决 |
| `change_kind` | `DecisionChangeKind` | 变化类别 |
| `basis_ref` | `Option<EvidenceSummaryRef>` | 变化依据 |

| 成员函数 | 作用 |
|---|---|
| `is_terminal_change()` | 判断是否为终态变化 |
| `relates_to(GovernanceDecisionRef decision_ref)` | 判断是否属于指定裁决 |

| 工厂函数 | 作用 |
|---|---|
| `from_decision_change(GovernanceDecision decision, DecisionChangeKind change_kind, ActorRef actor)` | 从裁决变化形成记录 |

| 禁止事项 | 说明 |
|---|---|
| 不修改已成立 Decision | 记录只追溯变化 |
| 不保存 evidence body | 只保存依据引用 |

---

## B32. `ResponsibilityTraceRecord`

| 项 | 内容 |
|---|---|
| 所属部分 | `Approval and responsibility management` |
| 对象类型 | history record |
| 结构责任 | 记录责任分配、投票、委托、升级和释放变化 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `record_id` | `ResponsibilityTraceRecordId` | 记录身份 |
| `responsibility_ref` | `ApprovalResponsibilityRef` | 对应责任 |
| `change_kind` | `ResponsibilityChangeKind` | 变化类别 |
| `actor_ref` | `ActorRef` | 执行动作 actor |

| 成员函数 | 作用 |
|---|---|
| `relates_to(ApprovalResponsibilityRef responsibility_ref)` | 判断是否属于指定责任 |
| `requires_audit()` | 判断是否需要进入审计链 |

| 工厂函数 | 作用 |
|---|---|
| `from_responsibility_change(ApprovalResponsibility responsibility, ResponsibilityChangeKind change_kind, ActorRef actor)` | 从责任变化形成记录 |

| 禁止事项 | 说明 |
|---|---|
| 不替代责任当前状态 | 当前状态以 ApprovalResponsibility 为准 |
| 不保存 identity body | 只保存 actor ref |

---

## B33. `PolicyChangeRecord`

| 项 | 内容 |
|---|---|
| 所属部分 | `Policy and shared rules management` |
| 对象类型 | history record |
| 结构责任 | 记录 Policy 生效、停用、冲突处理、shared rules 变化 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `record_id` | `PolicyChangeRecordId` | 记录身份 |
| `policy_ref` | `Option<PolicyEffectiveFactRef>` | 相关 Policy |
| `shared_rule_set_ref` | `Option<SharedRuleSetRef>` | 相关 shared rules |
| `change_kind` | `PolicyChangeKind` | 变化类别 |

| 成员函数 | 作用 |
|---|---|
| `relates_to_policy(PolicyEffectiveFactRef policy_ref)` | 判断是否影响某 Policy |
| `relates_to_shared_rules(SharedRuleSetRef rule_set_ref)` | 判断是否影响 shared rules |

| 工厂函数 | 作用 |
|---|---|
| `from_policy_change(PolicyEffectiveFact policy_fact, PolicyChangeKind change_kind, ActorRef actor)` | 从 Policy 变化形成记录 |

| 禁止事项 | 说明 |
|---|---|
| 不保存 Policy definition body | 只追溯生效事实变化 |
| 不用 history 覆盖当前 Policy | 当前状态以 PolicyEffectiveFact / SharedRuleSet 为准 |

---

## B34. `ControlChangeRecord`

| 项 | 内容 |
|---|---|
| 所属部分 | `Control and compliance conclusion management` |
| 对象类型 | history record |
| 结构责任 | 记录 Control applicability、review、违反或整改关联变化 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `record_id` | `ControlChangeRecordId` | 记录身份 |
| `control_ref` | `ControlApplicabilityRef` | 对应控制适用事实 |
| `change_kind` | `ControlChangeKind` | 变化类别 |
| `basis_ref` | `Option<EvidenceSummaryRef>` | 变化依据 |

| 成员函数 | 作用 |
|---|---|
| `relates_to(ControlApplicabilityRef control_ref)` | 判断是否属于指定控制事实 |
| `requires_nonconformity()` | 判断是否可能触发不符合 |

| 工厂函数 | 作用 |
|---|---|
| `from_control_change(ControlApplicability applicability, ControlChangeKind change_kind, ActorRef actor)` | 从控制变化形成记录 |

| 禁止事项 | 说明 |
|---|---|
| 不保存控制定义正文 | 只保存 ref 和变化语义 |
| 不替代 ControlReview | 复核 truth 由 ControlReview 表达 |

---

## B35. `ComplianceConclusionRecord`

| 项 | 内容 |
|---|---|
| 所属部分 | `Control and compliance conclusion management` |
| 对象类型 | history record |
| 结构责任 | 记录 AIIA / SoA 提交、评审、批准、拒绝、替代或撤销 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `record_id` | `ComplianceConclusionRecordId` | 记录身份 |
| `conclusion_ref` | `ComplianceConclusionRef` | 对应 AIIA / SoA 结论 |
| `change_kind` | `ComplianceConclusionChangeKind` | 变化类别 |
| `basis_ref` | `Option<EvidenceSummaryRef>` | 变化依据 |

| 成员函数 | 作用 |
|---|---|
| `relates_to(ComplianceConclusionRef conclusion_ref)` | 判断是否属于指定结论 |
| `requires_archive()` | 判断是否需要归档交接 |

| 工厂函数 | 作用 |
|---|---|
| `from_conclusion_change(ComplianceConclusionRef conclusion_ref, ComplianceConclusionChangeKind change_kind, ActorRef actor)` | 从结论变化形成记录 |

| 禁止事项 | 说明 |
|---|---|
| 不保存 AIIA / SoA 正文 | 正文归 artifact / archive 边界 |
| 不替代结论当前状态 | 当前状态以 AIIAConclusion / SoAConclusion 为准 |

---

## B36. `NonconformityChangeRecord`

| 项 | 内容 |
|---|---|
| 所属部分 | `Nonconformity corrective loop` |
| 对象类型 | history record |
| 结构责任 | 记录不符合提出、原因确认、纠正、复验、关闭和重开变化 |

| 字段 | 类型 | 作用 |
|---|---|---|
| `record_id` | `NonconformityChangeRecordId` | 记录身份 |
| `nonconformity_ref` | `NonconformityRef` | 对应不符合 |
| `change_kind` | `NonconformityChangeKind` | 变化类别 |
| `basis_ref` | `Option<EvidenceSummaryRef>` | 变化依据 |

| 成员函数 | 作用 |
|---|---|
| `relates_to(NonconformityRef nonconformity_ref)` | 判断是否属于指定不符合 |
| `is_closure_change()` | 判断是否为关闭变化 |
| `requires_trace()` | 判断是否需要追溯交接 |

| 工厂函数 | 作用 |
|---|---|
| `from_nonconformity_change(NonconformityRecord record, NonconformityChangeKind change_kind, ActorRef actor)` | 从不符合变化形成记录 |

| 禁止事项 | 说明 |
|---|---|
| 不替代 Nonconformity truth | 当前状态以 NonconformityRecord 为准 |
| 不保存外部正文 | 只保存依据引用和变化语义 |
