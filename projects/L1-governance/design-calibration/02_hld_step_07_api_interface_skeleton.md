# Step 7. API / 接口骨架

> 对应 SOP: `standards/document/概要设计讨论流程_SOP.md` Step 7
> 回填章节: `02-概要设计.md` §7 API / 接口骨架
> 生成日期: 2026-06-08
> 状态: 已完成

---

## 1. 本步目标

把 `L1-governance` 的正式入口按 Command、Query、Inbound Event Consumer、Outbound Event 和 Operations Job 分类,明确每类接口的输入骨架、输出骨架、读写性质和边界。

本步不写 HTTP path、RPC method、完整 JSON / proto schema、CloudEvent 字段全集、错误码、repository trait、事务细节或 handler 调用链。接口名称用于概要层锚定,详细字段、协议 envelope、错误映射和 port trait 留给 `03-详细设计.md`。

---

## 2. 本步输入

| 输入 | 状态 | 用途 |
|---|---|---|
| `02_hld_step_06_key_objects.md` + 五个对象附录 | 已完成 | 提供接口必须承接的对象主语 |
| `02_hld_step_05_components_boundary.md` | 已完成 | 提供主要组成部分和职责边界 |
| `01_arch_step_08_data_ownership_consistency.md` | 已完成 | 提供 truth / snapshot / reference / derived 分层 |
| `01_arch_step_09_interactions_communication.md` | 已完成 | 提供同步、异步和后台承接口径 |
| `00_req_step_09_functional_requirements.md` | 已完成 | 提供 C-GOV / FR-GOV 能力闭环 |
| `00_req_step_12_interfaces_dependencies.md` | 已完成 | 提供能力级接口面和依赖边界 |

---

## 3. SOP 问题回答

### 3.1 哪些接口属于 Command,负责改写真相?

Command 只覆盖会改写 Governance-owned truth、history、trace、outbox 或维护 marker 的用例入口。它们必须经过 actor、metadata、幂等和 policy 判断,不能由 Query、Consumer 或 Job 隐式替代。

| Command 组 | 负责改写的 Governance-owned 主语 |
|---|---|
| Context / input command | `GovernanceContext`、`GovernanceInput`、`GovernanceTraceRecord`、`GovernanceOutboxRecord` |
| Gate / decision command | `Gate`、`GovernanceDecision`、`DecisionRecord`、`GovernanceOutboxRecord` |
| Approval / responsibility command | `ApprovalResponsibility`、`ResponsibilityChain`、`ResponsibilityTraceRecord` |
| Policy / shared rules command | `PolicyEffectiveFact`、`SharedRuleSet`、`PolicyConflictRecord`、`PolicyChangeRecord` |
| Control / compliance command | `ControlApplicability`、`ControlReview`、`AIIAConclusion`、`SoAConclusion`、`ControlChangeRecord`、`ComplianceConclusionRecord` |
| Nonconformity command | `NonconformityRecord`、`CorrectiveAction`、`VerificationResult`、`NonconformityChangeRecord` |

### 3.2 哪些接口属于 Query,只读取投影或只读视图?

Query 只读取 truth summary、projection、trace、snapshot 或 degraded surface。Query 不得打开写事务,不得创建 Gate / Decision / Policy / Control / Nonconformity,不得刷新外部引用,不得修复 projection。

### 3.3 哪些外部事实需要通过 Inbound Event Consumer 进入本仓?

进入本仓的外部事实包括 identity actor / capability 变更、process governance context 变化、work governance context 变化、artifact evidence 变化、method policy / control definition 变化、runtime / capability signal、conversation context 变化、observability alert / audit summary。Consumer 只能更新本地 snapshot / reference / pending input / stale marker,不能绕过 Command 直接生成核心 Governance truth。

### 3.4 哪些已提交事实需要通过 Outbound Event 对外传播?

需要传播的事实包括 governance context / input 变化、Gate / Decision 变化、Approval responsibility 变化、Policy / shared rules 变化、Control applicability / review 变化、AIIA / SoA conclusion 变化、Nonconformity 变化、trace 可用性和 derived view freshness 变化。Outbound Event 只能来自已成立 truth 或维护状态,发布失败不得回滚 truth。

### 3.5 哪些恢复、发布、重建、对账动作属于 Operations Job,而不是业务 command?

outbox 发布、projection rebuild、external snapshot refresh、reconciliation、trace / archive handoff、external GRC export preparation 属于 Operations Job。Job 可以维护派生面、快照、报告、handoff marker、export marker 或 failed marker,不得静默改写业务 truth。

### 3.6 Command 输入骨架是否需要 `ActorContext`、`CommandMetadata`、`IdempotencyKey`?

需要。所有 Command 输入都必须携带 `ActorContext`、`CommandMetadata` 和 `CommandMetadata.request.idempotency_key`。缺失时不得进入 Governance truth 写路径。

### 3.7 Query 输入骨架是否需要 `ActorContext`?

需要。所有 Query 输入都必须携带 `ActorContext` 和 `QueryMetadata`,用于授权、可见性、分页、consistency hint 和审计关联。

### 3.8 Event Consumer 输入骨架是否需要 event id、幂等键或 envelope?

需要。所有 Inbound Event Consumer 输入都必须携带来源 envelope、source event id、source ref、schema version、trace context 和 dedup key 语义。重复、乱序或 unsupported version 必须有正式处置面,不能直接写核心 truth。

---

## 4. 接口分类说明

| 接口类别 | 读写性质 | 主要用途 | 必须携带的上下文 | 不得做什么 |
|---|---|---|---|---|
| Command | 改写 Governance truth / history / trace / outbox | context、decision、approval、policy、control、compliance、nonconformity 的正式变化 | `ActorContext`、`CommandMetadata`、idempotency key、trace context | 不保存相邻仓正文;不绕过 policy |
| Query | 只读 | 读取 Governance truth summary、dashboard、decision summary、policy view、control coverage、nonconformity status、trace、reconciliation surface | `ActorContext`、`QueryMetadata`、page / consistency hint | 不写 truth、projection、snapshot、outbox |
| Inbound Event Consumer | 写 snapshot / reference / pending input / stale marker | 承接 identity / process / work / artifact / method / runtime / conversation / observability 外部事实 | event envelope、source event id、source ref、dedup key、trace context | 不直接创建裁决、Policy、Control、Nonconformity;不自造外部 truth |
| Outbound Event | 输出已成立事实或维护状态 | 向 process、work、artifact、conversation、runtime、workspace、observability、archive、external GRC 消费面传播 Governance 事实 | outbox event id、truth ref、trace context | 不携带外部正文;不让下游失败回滚 truth |
| Operations Job | 后台维护 / 派生 / 对账 / 交接 / 导出准备 | publish、rebuild、refresh、reconcile、handoff、external GRC export preparation | job metadata、system / operator actor、job idempotency key | 不作为业务 command;不静默修正 Governance truth |

---

## 5. Command API 骨架表

所有 Command 输入中的 `context` 均表示 `ActorContext` + `CommandMetadata` + idempotency key + trace context。本表只写输入骨架,不定义 DTO 字段表。

| Command | 输入骨架 | 输出骨架 | 写入对象 | 主要组成部分 | 边界 |
|---|---|---|---|---|---|
| `CreateGovernanceContext` | governed subject ref + source ref + purpose / scope + context | `GovernanceContextCommandResult` | `GovernanceContext`、`GovernanceTraceRecord`、`GovernanceOutboxRecord` | Governance context and input management | 建立可裁决语境,不保存外部 subject 正文 |
| `SubmitGovernanceInput` | governance context ref + input kind + source ref + context | `GovernanceInputCommandResult` | `GovernanceInput`、`GovernanceTraceRecord`、`GovernanceOutboxRecord` | Governance context and input management | 输入只是线索收束,不等于正式裁决 |
| `UpdateGovernanceInputState` | governance input ref + target state + reason + context | `GovernanceInputCommandResult` | `GovernanceInput`、`GovernanceTraceRecord` | Governance context and input management | accepted / rejected / pending evidence 必须显式记录 |
| `OpenGovernanceGate` | governance context ref + gate kind + approver requirement hint + context | `GateCommandResult` | `Gate`、`GovernanceTraceRecord`、`GovernanceOutboxRecord` | Gate and decision management | Gate 不等同 process waiting gate 或 conversation card |
| `RecordGovernanceDecision` | gate ref + decision kind + outcome intent + evidence summary ref + context | `GovernanceDecisionCommandResult` | `GovernanceDecision`、`DecisionRecord`、`Gate`、`GovernanceOutboxRecord` | Gate and decision management | 决策必须可追溯,不得由 runtime cache 或 report 反向定义 |
| `SupersedeGovernanceDecision` | current decision ref + next decision intent + reason + context | `GovernanceDecisionCommandResult` | `GovernanceDecision`、`DecisionRecord`、`GovernanceOutboxRecord` | Gate and decision management | 修正必须显式替代,不得原地改写历史 |
| `AssignApprovalResponsibility` | governance context ref + approver requirement + actor ref + context | `ApprovalResponsibilityCommandResult` | `ApprovalResponsibility`、`ResponsibilityChain`、`ResponsibilityTraceRecord` | Approval and responsibility management | 只表达治理责任,不改变 identity truth |
| `RecordApprovalVote` | responsibility ref + vote + optional evidence summary ref + context | `ApprovalResponsibilityCommandResult` | `ApprovalResponsibility`、`ResponsibilityTraceRecord`、`ResponsibilityChain` | Approval and responsibility management | 投票只满足责任条件,不自动形成 Decision |
| `DelegateApprovalResponsibility` | responsibility ref + delegate actor ref + delegation reason + context | `ApprovalResponsibilityCommandResult` | `ApprovalResponsibility`、`ResponsibilityChain`、`ResponsibilityTraceRecord` | Approval and responsibility management | 委托不得削弱 shared rules 或审批要求 |
| `ActivatePolicyEffectiveFact` | method policy snapshot ref + governance scope ref + effective intent + context | `PolicyCommandResult` | `PolicyEffectiveFact`、`PolicyChangeRecord`、`GovernanceOutboxRecord` | Policy and shared rules management | 生效事实归 Governance,不保存 AIPolicyDef 正文 |
| `UpdatePolicyEffectiveFactState` | policy fact ref + target state + policy reason + context | `PolicyCommandResult` | `PolicyEffectiveFact`、`PolicyChangeRecord`、`GovernanceOutboxRecord` | Policy and shared rules management | suspend / retire / supersede 必须显式发生 |
| `UpdateSharedRuleSet` | shared rule set ref or scope + rule changes + reason + context | `SharedRuleCommandResult` | `SharedRuleSet`、`PolicyChangeRecord`、`GovernanceOutboxRecord` | Policy and shared rules management | 低 scope 不得覆盖组织级规则 |
| `ResolvePolicyConflict` | policy conflict ref + resolution decision ref + context | `PolicyConflictCommandResult` | `PolicyConflictRecord`、`PolicyChangeRecord`、`GovernanceOutboxRecord` | Policy and shared rules management | 冲突处理必须有正式依据,不得由 runtime cache 解决 |
| `AssessControlApplicability` | governance context ref + method control snapshot ref + applicability intent + evidence summary ref + context | `ControlCommandResult` | `ControlApplicability`、`ControlChangeRecord`、`GovernanceOutboxRecord` | Control and compliance conclusion management | 只形成适用 / 排除结论,不保存 ControlDefinition 正文 |
| `RecordControlReview` | control applicability ref + review outcome + evidence summary ref + context | `ControlReviewCommandResult` | `ControlReview`、`ControlChangeRecord`、`GovernanceOutboxRecord` | Control and compliance conclusion management | 复核失败可触发 Nonconformity 线索,但不自动关闭纠正闭环 |
| `SubmitAIIAConclusion` | governance context ref + artifact ref + evidence summary ref + context | `ComplianceConclusionCommandResult` | `AIIAConclusion`、`ComplianceConclusionRecord`、`GovernanceOutboxRecord` | Control and compliance conclusion management | AIIA 正文归 artifact,本仓只保存治理结论和引用 |
| `SubmitSoAConclusion` | governance context ref + artifact ref + control coverage ref + evidence summary ref + context | `ComplianceConclusionCommandResult` | `SoAConclusion`、`ComplianceConclusionRecord`、`GovernanceOutboxRecord` | Control and compliance conclusion management | SoA 结论必须回链控制覆盖,不保存 SoA 正文 |
| `ApproveComplianceConclusion` | compliance conclusion ref + governance decision ref + context | `ComplianceConclusionCommandResult` | `AIIAConclusion` / `SoAConclusion`、`ComplianceConclusionRecord`、`GovernanceOutboxRecord` | Control and compliance conclusion management | 批准必须引用正式 Decision |
| `RaiseNonconformity` | governance context ref + severity + source ref + owner actor ref + context | `NonconformityCommandResult` | `NonconformityRecord`、`NonconformityChangeRecord`、`GovernanceOutboxRecord` | Nonconformity corrective loop | 外部 alert / blocker 只能作为线索,不直接成为闭环 |
| `ConfirmNonconformityCause` | nonconformity ref + cause ref + context | `NonconformityCommandResult` | `NonconformityRecord`、`NonconformityChangeRecord` | Nonconformity corrective loop | 原因确认必须显式记录 |
| `PlanCorrectiveAction` | nonconformity ref + owner actor ref + optional work context ref + context | `CorrectiveActionCommandResult` | `CorrectiveAction`、`NonconformityChangeRecord` | Nonconformity corrective loop | 纠正动作可引用 Work,但不是 WorkItem truth |
| `CompleteCorrectiveAction` | corrective action ref + evidence summary ref + context | `CorrectiveActionCommandResult` | `CorrectiveAction`、`NonconformityChangeRecord` | Nonconformity corrective loop | 完成必须有依据引用,不保存 evidence body |
| `VerifyNonconformity` | nonconformity ref + verification state + evidence summary ref + context | `NonconformityCommandResult` | `VerificationResult`、`NonconformityRecord`、`NonconformityChangeRecord`、`GovernanceOutboxRecord` | Nonconformity corrective loop | 关闭必须基于通过复验;失败进入继续纠正或重开 |

---

## 6. Query API 骨架表

所有 Query 输入中的 `context` 均表示 `ActorContext` + `QueryMetadata`。Query 可以返回 stale / degraded / missing / not visible surface,但不得修复状态。

| Query | 输入骨架 | 输出骨架 | 读取来源 | 主要组成部分 | 边界 |
|---|---|---|---|---|---|
| `GetGovernanceContext` | governance context ref + context | `GovernanceContextView` | context truth + reference state summary | Governance context and input management | 不刷新外部引用 |
| `GetGovernanceInput` | governance input ref + context | `GovernanceInputView` | input truth + source summary | Governance context and input management | 不把 source body 拉入响应 |
| `GetGateDecision` | gate ref or decision ref + context | `DecisionSummaryView` | Gate / Decision truth + decision summary projection | Gate and decision management | 不修改 Gate / Decision state |
| `ListPendingGovernanceDecisions` | scope / subject filters + page + context | `DecisionSummaryPage` | decision projection / truth summary | Gate and decision management | 只读待裁决项,不自动分配责任 |
| `GetApprovalResponsibility` | responsibility ref or context ref + context | `ApprovalResponsibilityView` | responsibility truth + actor snapshot summary | Approval and responsibility management | 不读取 identity 正文 |
| `GetPolicyEffectiveView` | governance scope ref + context | `PolicyEffectiveView` | policy truth + projection | Policy and shared rules management | projection stale 时返回 freshness surface |
| `GetPolicyConflict` | policy conflict ref + context | `PolicyConflictView` | conflict truth + policy summary | Policy and shared rules management | 不自动 resolve conflict |
| `GetControlCoverage` | governance context ref + context | `ControlCoverageView` | control truth + coverage projection | Control and compliance conclusion management | 不修改 Control / SoA truth |
| `GetComplianceConclusion` | AIIA / SoA conclusion ref + context | `ComplianceConclusionView` | conclusion truth + evidence refs | Control and compliance conclusion management | 不读取 artifact 正文 |
| `GetNonconformityStatus` | nonconformity ref + context | `NonconformityStatusView` | nonconformity truth + status projection | Nonconformity corrective loop | 不关闭或重开不符合 |
| `SearchGovernanceFacts` | scope / subject / fact kind filters + page + context | `GovernanceFactSearchResultPage` | governance projection / read model | Governance consumption and traceability | projection stale 时返回 stale 标记 |
| `GetGovernanceTrace` | trace subject ref + page + context | `GovernanceTraceView` | `GovernanceTraceRecord` / `GovernanceAuditTrail` | Governance consumption and traceability | 不替代 observability ledger |
| `GetGovernanceDashboard` | governance scope ref + filters + context | `GovernanceDashboardView` | dashboard projection | Derived maintenance and reconciliation | 高级 dashboard 只读且可滞后 |
| `GetGovernanceReconciliationReport` | reconciliation scope / report ref + context | `GovernanceReconciliationReportView` | reconciliation report / derived state | Derived maintenance and reconciliation | 只读报告,不修复 truth |

---

## 7. Inbound Event Consumer 骨架表

所有 Consumer 输入都必须携带来源 envelope、source event id、source ref、schema version、dedup key 语义和 trace context。Consumer 写入通常是 snapshot、reference state、pending input 或 projection stale marker。

| Consumer | 来源 | 输入骨架 | 写入结果 | 主要组成部分 | 边界 |
|---|---|---|---|---|---|
| `ConsumeIdentityActorCapabilityChanged` | `L1-identity` | actor / member / role / capability changed envelope + actor ref + source version | `ActorCapabilitySnapshot`、`ReferenceResolutionState` | Approval and responsibility management / External context mirror support | 不拥有 GlobalMember / Role lifecycle |
| `ConsumeProcessGovernanceContextChanged` | `L1-process` | process waiting / activity / recovery changed envelope + process governance context ref | `ProcessGovernanceContextRef`、`ReferenceResolutionState`、related view stale marker | Governance context and input management / External context mirror support | 不写 ProcessInstance、Activity 或 waiting gate truth |
| `ConsumeWorkGovernanceContextChanged` | `L1-work` | project / work / iteration / blocker changed envelope + work governance context ref | `WorkGovernanceContextRef`、`ReferenceResolutionState`、related view stale marker | Governance context and input management / External context mirror support | 不写 Project、WorkItem、Iteration 或 blocker truth |
| `ConsumeArtifactEvidenceChanged` | `L1-artifact` | evidence / baseline / AIIA / SoA artifact changed envelope + evidence ref | `EvidenceSummaryRef`、`ReferenceResolutionState`、compliance view stale marker | Control and compliance conclusion management / External context mirror support | 不保存 artifact / evidence / AIIA / SoA 正文 |
| `ConsumeMethodPolicyDefinitionChanged` | `L3-method-library` | AIPolicyDef / policy definition changed envelope + method policy ref | `MethodPolicySnapshot`、`ReferenceResolutionState`、policy view stale marker | Policy and shared rules management / External context mirror support | 不保存 AIPolicyDef 正文 |
| `ConsumeMethodControlDefinitionChanged` | `L3-method-library` | ControlDefinition / standard changed envelope + method control ref | `MethodControlSnapshot`、`ReferenceResolutionState`、control coverage stale marker | Control and compliance conclusion management / External context mirror support | 不保存标准或控制正文 |
| `ConsumeRuntimeSignalRecorded` | `L2-runtime` / `L3-capability-hub` | runtime / capability signal envelope + runtime signal ref | `RuntimeSignalRef`、`ReferenceResolutionState`、pending `GovernanceInput` marker | Governance context and input management / External context mirror support | 不保存 execution log;不反向定义 Policy truth |
| `ConsumeConversationContextChanged` | `L1-conversation` | conversation context envelope + conversation ref | `GovernanceSourceRef` resolution marker、trace / decision view stale marker | Governance consumption and traceability / External context mirror support | 不保存 conversation fact 或 message body |
| `ConsumeObservabilityAlertRaised` | `L4-observability` | alert / audit summary envelope + observability ref | `GovernanceSourceRef` / `RuntimeSignalRef` marker、pending Nonconformity input marker | Nonconformity corrective loop / External context mirror support | alert 只是线索,不得直接关闭或创建 Nonconformity truth |

---

## 8. Outbound Event 骨架表

Outbound Event 只能从已提交 Governance truth change、维护状态变化或 handoff / export intent 形成。事件 payload 后续由详细设计定义,本步只给输出骨架和边界。

| Event | 触发来源 | 输出骨架 | 主要消费方 | 边界 |
|---|---|---|---|---|
| `GovernanceContextChanged` | `GovernanceContext` / `GovernanceInput` change | context ref + input ref + change kind + trace context | process、work、conversation、workspace | 不携带外部 source body |
| `GateChanged` | `Gate` open / pending / expired / cancelled | gate ref + context ref + gate state + trace context | process、conversation、workspace | 不等同 process waiting state |
| `GovernanceDecisionChanged` | `GovernanceDecision` approved / rejected / waived / superseded / revoked | decision ref + gate ref + outcome summary + trace context | process、work、artifact、runtime、conversation、workspace | 不携带 evidence / decision body |
| `ApprovalResponsibilityChanged` | `ApprovalResponsibility` / `ResponsibilityChain` change | responsibility ref + chain state + actor ref summary + trace context | conversation、workspace、audit consumers | 不改变 identity truth |
| `PolicyEffectiveFactChanged` | `PolicyEffectiveFact` lifecycle change | policy fact ref + scope ref + effective state + trace context | runtime、capability、work、workspace | 不携带 AIPolicyDef 正文 |
| `SharedRuleSetChanged` | `SharedRuleSet` change | rule set ref + scope ref + change kind + trace context | runtime、capability、workspace、audit consumers | 低 scope consumer 不得覆盖组织级规则 |
| `PolicyConflictChanged` | `PolicyConflictRecord` detected / resolved / waived | conflict ref + conflict state + resolution ref + trace context | workspace、audit consumers | 不由下游处理结果反写冲突 truth |
| `ControlApplicabilityChanged` | `ControlApplicability` / `ControlReview` change | control applicability ref + review state + trace context | artifact、workspace、archive、external GRC export | 不携带 ControlDefinition 或 evidence body |
| `ComplianceConclusionChanged` | `AIIAConclusion` / `SoAConclusion` change | conclusion ref + conclusion kind + state + trace context | artifact、workspace、archive、external GRC export | 不携带 AIIA / SoA 正文 |
| `NonconformityChanged` | `NonconformityRecord` / `CorrectiveAction` / `VerificationResult` change | nonconformity ref + corrective state + trace context | work、artifact、observability、workspace、archive | 不把 bug / alert 当闭环 truth |
| `GovernanceTraceAvailable` | `GovernanceTraceRecord` ready / handoff prepared | trace subject ref + trace ref + handoff ref + trace context | observability、archive、conversation | 不替代 observability ledger |
| `DerivedGovernanceViewChanged` | `DerivedGovernanceViewState` freshness change | view ref + freshness state + source cursor | workspace、SDK、console | 派生变化不代表新业务 truth |

---

## 9. Operations Job 骨架表

Operations Job 必须携带 job metadata、system / operator actor、job idempotency key 和 run id。Job 只能维护派生、快照、outbox、对账、handoff 或 export marker。

| Job | 输入骨架 | 输出骨架 | 允许写入 | 主要组成部分 | 边界 |
|---|---|---|---|---|---|
| `PublishGovernanceOutbox` | outbox range / page + run metadata | publication report | `GovernanceOutboxRecord.publication_state` | Governance truth core | 发布失败不回滚 Governance truth |
| `RebuildGovernanceProjections` | projection set + governance scope + run metadata | rebuild report | `GovernanceDashboardView`、`DecisionSummaryView`、`PolicyEffectiveView`、`ControlCoverageView`、`NonconformityStatusView`、`DerivedGovernanceViewState` | Derived maintenance and reconciliation | 只从 committed truth / trace 重建 |
| `RefreshExternalContextSnapshots` | reference scope + source filters + run metadata | refresh report | `ActorCapabilitySnapshot`、`MethodPolicySnapshot`、`MethodControlSnapshot`、`EvidenceSummaryRef`、`ProcessGovernanceContextRef`、`WorkGovernanceContextRef`、`RuntimeSignalRef`、`ReferenceResolutionState` | External context mirror support | 不复制外部正文 |
| `RunGovernanceReconciliation` | reconciliation scope + cursor / report target + run metadata | `GovernanceReconciliationReport` | reconciliation report / derived marker | Derived maintenance and reconciliation | 只报告或标记,不直接修正业务 truth |
| `PrepareGovernanceTraceHandoff` | trace scope + observability target + run metadata | handoff report | trace handoff marker / optional outbox | Governance consumption and traceability | 不保存 observability 正文 |
| `PrepareGovernanceArchiveHandoff` | governance subject / compliance / trace scope + archive target + run metadata | archive handoff report | archive handoff marker / optional outbox | Governance consumption and traceability | 不保存 archive package 正文 |
| `PrepareExternalGrcExport` | export scope + target system ref + run metadata | export preparation report | export marker / optional outbox / derived export view | Derived maintenance and reconciliation | external GRC 只能消费导出,不得成为 Governance truth |

---

## 10. 接口到主要组成部分映射

| 主要组成部分 | Command | Query | Consumer | Outbound Event | Job |
|---|---|---|---|---|---|
| Governance truth core | 所有 truth command 间接经过 | - | - | 所有 truth event 经 outbox | `PublishGovernanceOutbox` |
| Governance context and input management | `CreateGovernanceContext`、`SubmitGovernanceInput`、`UpdateGovernanceInputState` | `GetGovernanceContext`、`GetGovernanceInput` | process / work / runtime / observability context consumers | `GovernanceContextChanged` | snapshot refresh / reconciliation jobs |
| Gate and decision management | `OpenGovernanceGate`、`RecordGovernanceDecision`、`SupersedeGovernanceDecision` | `GetGateDecision`、`ListPendingGovernanceDecisions` | process / work / conversation context consumers | `GateChanged`、`GovernanceDecisionChanged` | projection rebuild / outbox publish |
| Approval and responsibility management | `AssignApprovalResponsibility`、`RecordApprovalVote`、`DelegateApprovalResponsibility` | `GetApprovalResponsibility` | `ConsumeIdentityActorCapabilityChanged` | `ApprovalResponsibilityChanged` | snapshot refresh / reconciliation jobs |
| Policy and shared rules management | `ActivatePolicyEffectiveFact`、`UpdatePolicyEffectiveFactState`、`UpdateSharedRuleSet`、`ResolvePolicyConflict` | `GetPolicyEffectiveView`、`GetPolicyConflict` | `ConsumeMethodPolicyDefinitionChanged`、runtime signal consumers | `PolicyEffectiveFactChanged`、`SharedRuleSetChanged`、`PolicyConflictChanged` | projection rebuild / external snapshot refresh |
| Control and compliance conclusion management | `AssessControlApplicability`、`RecordControlReview`、`SubmitAIIAConclusion`、`SubmitSoAConclusion`、`ApproveComplianceConclusion` | `GetControlCoverage`、`GetComplianceConclusion` | `ConsumeArtifactEvidenceChanged`、`ConsumeMethodControlDefinitionChanged` | `ControlApplicabilityChanged`、`ComplianceConclusionChanged` | projection rebuild / archive handoff / external GRC export |
| Nonconformity corrective loop | `RaiseNonconformity`、`ConfirmNonconformityCause`、`PlanCorrectiveAction`、`CompleteCorrectiveAction`、`VerifyNonconformity` | `GetNonconformityStatus` | `ConsumeObservabilityAlertRaised`、work / artifact context consumers | `NonconformityChanged` | projection rebuild / archive handoff |
| Governance consumption and traceability | trace / handoff related command only if detailed design keeps sync entry | `GetGovernanceTrace`、`SearchGovernanceFacts` | `ConsumeConversationContextChanged` | `GovernanceTraceAvailable` | trace / archive handoff |
| Derived maintenance and reconciliation | - | `GetGovernanceDashboard`、`GetGovernanceReconciliationReport` | stale marker consumers | `DerivedGovernanceViewChanged` | `RebuildGovernanceProjections`、`RunGovernanceReconciliation`、`PrepareExternalGrcExport` |
| External context mirror support | - | snapshot-backed queries | all external context consumers | derived / stale event only | `RefreshExternalContextSnapshots` |

---

## 11. 当前文档问题诊断

| 旧 `02-概要设计.md` 内容 | 问题 | 本轮处理 |
|---|---|---|
| 以 Gate / Decision / Request / Exception 教学线索组织接口 | 无法支撑详细设计拆 Command / Query / Event / Job | 本步按正式接口类别重建骨架 |
| 旧接口线索混合 process、work、artifact、conversation、runtime 和 external GRC | 容易误解为同步调用链、编译期依赖或正文同步 | 本步区分 Command、Consumer、Outbound Event 和 Job,并标注 ref / summary 边界 |
| Policy / Control / AIIA / SoA / Nonconformity 没有清楚区分写入口和消费面 | 后续会把 report / external GRC / artifact 正文当 truth source | 本步把核心变化列为 Command,消费和导出列为 Event / Query / Job |
| report、dashboard、audit、archive 和 external GRC 混入核心写路径 | 派生 / 交接可能反写真相 | 本步把它们列为 Query / Job / Outbound,并标注 no-write |
| 外部事件输入缺少幂等和来源边界 | Consumer 可能直接写核心 truth 或复制正文 | 本步要求 envelope、source event id、dedup key、trace context 和 snapshot / marker 写入边界 |

---

## 12. 设计取舍

| 取舍 | 结论 | 理由 |
|---|---|---|
| 是否在概要层点名 Command / Query / Event / Job | 点名 | SOP Step 7 允许点名接口骨架,有助于 Step 8 / Step 9 反查 |
| 是否写 HTTP path / topic / DTO schema | 不写 | 这些属于详细设计协议契约 |
| 是否让 Inbound Event 直接生成 Decision / Policy / Control / Nonconformity truth | 不允许 | 外部事实只能经 snapshot / pending input / stale marker,核心 truth 必须走 command / policy |
| 是否让 Job 修复业务 truth | 不允许 | Job 只能维护派生、快照、对账、handoff 和 export marker |
| 是否保留 external GRC export | 保留为 Operations Job / outbound preparation | 外部 GRC 是消费 / 导出边界,不得成为本仓 truth |

---

## 13. 回填草稿

正式 `02-概要设计.md` 后续整理时:

- §7 “API / 接口骨架”引用本文件 §4 的接口分类说明。
- §7 摘录 §5~§9 五张骨架表,必要时压缩外围增强 Query 和 Job。
- §7 保留 §10 的接口到主要组成部分映射。
- 详细设计必须基于这些骨架继续定义正式 command / query / event / job DTO、错误码、幂等结果、repository / port 和事务边界。

---

## 14. 进入下一步条件

- 已明确本仓接口按 Command / Query / Inbound Event Consumer / Outbound Event / Operations Job 分类。
- 已显式说明 Command 需要 `ActorContext`、`CommandMetadata` 和 idempotency key。
- 已显式说明 Query 需要 `ActorContext` 和 `QueryMetadata`。
- 已显式说明 Event Consumer 需要 envelope、source event id、source ref、dedup key 和 trace context。
- 已明确 Job 不得作为业务 command 或 truth repair 入口。
- 未写入 HTTP path、完整 DTO schema、topic 名称、repository 函数或事务细节。
- 可以进入 Step 8 “关键处理流 / 重要函数数据流”。
