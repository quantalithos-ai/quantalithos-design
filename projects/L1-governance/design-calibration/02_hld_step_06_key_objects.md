# Step 6. 关键对象轮廓

> 对应 SOP: `standards/document/概要设计讨论流程_SOP.md` Step 6
> 回填章节: `02-概要设计.md` §6 关键对象轮廓
> 生成日期: 2026-06-08
> 状态: 已完成

---

## 1. 本步目标

从 Step 5 的对象候选池中筛出概要设计必须点名的关键对象,并给出对象类型、所属组成部分、关键字段骨架、状态候选、成员函数骨架、工厂函数骨架和禁止事项。

本步不写完整 Rust struct、完整 enum、DTO schema、repository trait、数据库表、索引、事件 payload 或事务细节。字段和函数只停在概要设计骨架层,后续 `03-详细设计.md` 必须在此基础上收敛正式对象契约。

---

## 2. 本步输入

| 输入 | 状态 | 用途 |
|---|---|---|
| `02_hld_step_03_constraints.md` | 已完成 | 提供 Governance truth、正文排除、派生只读、同步 / 异步 / 后台分工和配置不可越界门禁 |
| `02_hld_step_04_code_subject_framework.md` | 已完成 | 提供代码主体骨架和实现分层 |
| `02_hld_step_05_components_boundary.md` | 已完成 | 提供对象候选池和主要组成部分归属 |
| `00-需求文档.md` §10 / §11 / §14 | 已完成 | 提供业务规则、数据归属、审计追溯和验收否决项 |
| `01-架构设计.md` §6 / §8 / §9 / §10 | 已完成 | 提供限界上下文、依赖方向、一致性和通信分层 |

---

## 3. 对象候选池筛选说明

### 3.1 正式进入 Step 6 的关键对象

| 对象类别 | 正式关键对象 | 展开位置 |
|---|---|---|
| Truth / State | `GovernanceContext`、`GovernanceInput`、`Gate`、`GovernanceDecision`、`ApprovalResponsibility`、`ApproverRequirement`、`ResponsibilityChain`、`PolicyEffectiveFact`、`SharedRuleSet`、`PolicyConflictRecord`、`ControlApplicability`、`ControlReview`、`AIIAConclusion`、`SoAConclusion`、`NonconformityRecord`、`CorrectiveAction`、`VerificationResult`、`DerivedGovernanceViewState`、`ReferenceResolutionState` | `02_hld_step_06_key_objects_truth_context_decision.md`、`02_hld_step_06_key_objects_truth_policy_compliance.md` |
| Policy / Guard | `GovernanceTruthPolicy`、`GovernanceContextPolicy`、`DecisionPolicy`、`ApprovalResponsibilityPolicy`、`PolicyConflictPolicy`、`SharedRulesPolicy`、`PolicyScopePolicy`、`ControlApplicabilityPolicy`、`ComplianceConclusionPolicy`、`NonconformityClosurePolicy`、`ReadVisibilityPolicy`、`DerivedGovernanceViewPolicy` | `02_hld_step_06_key_objects_policies.md` |
| Projection / Read model | `GovernanceDashboardView`、`DecisionSummaryView`、`PolicyEffectiveView`、`ControlCoverageView`、`NonconformityStatusView`、`GovernanceReconciliationReport` | `02_hld_step_06_key_objects_projections.md` |
| Reference / Snapshot | `GovernedSubjectRef`、`GovernanceSourceRef`、`ActorCapabilitySnapshot`、`MethodPolicySnapshot`、`MethodControlSnapshot`、`EvidenceSummaryRef`、`ProcessGovernanceContextRef`、`WorkGovernanceContextRef`、`RuntimeSignalRef` | `02_hld_step_06_key_objects_references_audit.md` |
| Audit / History / Outbox | `GovernanceTraceRecord`、`GovernanceAuditTrail`、`GovernanceOutboxRecord`、`DecisionRecord`、`ResponsibilityTraceRecord`、`PolicyChangeRecord`、`ControlChangeRecord`、`ComplianceConclusionRecord`、`NonconformityChangeRecord` | `02_hld_step_06_key_objects_references_audit.md` |

### 3.2 不作为关键对象展开的名称

| 名称类别 | 示例 | 处理口径 |
|---|---|---|
| API / DTO / request / result | open gate request、approve decision request、policy result、control query response | 留给 Step 7 和详细设计 |
| Repository / port / adapter | `GovernanceDecisionRepository`、`IdentityActorPort`、`ArtifactEvidencePort`、`GovernanceOutboxRepository` | 留给 Step 7 接口骨架和详细设计 |
| Inbound / job / trigger | command intake、event intake、snapshot refresh job、projection rebuild job、external GRC export job | 留给 Step 7 / Step 8 / operations 设计 |
| 数据库 / 投影实现 | table、index、materialized view、search backend、state store product | 不进入概要对象轮廓 |
| 外部正文对象 | process 正文、work 正文、artifact / evidence body、AIIA / SoA body、method definition body、runtime log、observability ledger、archive package、external GRC document | 只允许引用、摘要或快照,不得成为 Governance truth |

---

## 4. 关键对象与主要组成部分分布

| 主要组成部分 | 关键对象 |
|---|---|
| `Governance truth core` | `GovernanceTruthPolicy`、`GovernanceAuditTrail`、`GovernanceOutboxRecord` |
| `Governance context and input management` | `GovernanceContext`、`GovernanceInput`、`GovernanceContextPolicy`、`GovernedSubjectRef`、`GovernanceSourceRef` |
| `Gate and decision management` | `Gate`、`GovernanceDecision`、`DecisionPolicy`、`DecisionRecord`、`DecisionSummaryView` |
| `Approval and responsibility management` | `ApprovalResponsibility`、`ApproverRequirement`、`ResponsibilityChain`、`ApprovalResponsibilityPolicy`、`ActorCapabilitySnapshot`、`ResponsibilityTraceRecord` |
| `Policy and shared rules management` | `PolicyEffectiveFact`、`SharedRuleSet`、`PolicyConflictRecord`、`PolicyConflictPolicy`、`SharedRulesPolicy`、`PolicyScopePolicy`、`MethodPolicySnapshot`、`PolicyEffectiveView`、`PolicyChangeRecord` |
| `Control and compliance conclusion management` | `ControlApplicability`、`ControlReview`、`AIIAConclusion`、`SoAConclusion`、`ControlApplicabilityPolicy`、`ComplianceConclusionPolicy`、`ControlCoverageView`、`MethodControlSnapshot`、`EvidenceSummaryRef`、`ControlChangeRecord`、`ComplianceConclusionRecord` |
| `Nonconformity corrective loop` | `NonconformityRecord`、`CorrectiveAction`、`VerificationResult`、`NonconformityClosurePolicy`、`NonconformityStatusView`、`NonconformityChangeRecord` |
| `Governance consumption and traceability` | `GovernanceTraceRecord`、`ReadVisibilityPolicy` |
| `Derived maintenance and reconciliation` | `DerivedGovernanceViewState`、`DerivedGovernanceViewPolicy`、`GovernanceDashboardView`、`GovernanceReconciliationReport` |
| `External context mirror support` | `ReferenceResolutionState`、`ActorCapabilitySnapshot`、`MethodPolicySnapshot`、`MethodControlSnapshot`、`EvidenceSummaryRef`、`ProcessGovernanceContextRef`、`WorkGovernanceContextRef`、`RuntimeSignalRef` |

---

## 5. 对象展开文件

本步对象数量较多。为满足“每个关键对象独立成节”和“中间产物可维护”的要求,本步拆成主控文件和五个对象附录:

| 文件 | 内容 |
|---|---|
| `02_hld_step_06_key_objects.md` | 筛选说明、对象分布、反查清单、回填口径 |
| `02_hld_step_06_key_objects_truth_context_decision.md` | GovernanceContext、GovernanceInput、Gate、GovernanceDecision、ApprovalResponsibility、ApproverRequirement、ResponsibilityChain 骨架 |
| `02_hld_step_06_key_objects_truth_policy_compliance.md` | PolicyEffectiveFact、SharedRuleSet、PolicyConflictRecord、ControlApplicability、ControlReview、AIIAConclusion、SoAConclusion、NonconformityRecord、CorrectiveAction、VerificationResult、DerivedGovernanceViewState、ReferenceResolutionState 骨架 |
| `02_hld_step_06_key_objects_policies.md` | policy / guard 对象骨架 |
| `02_hld_step_06_key_objects_projections.md` | projection / read model / report 对象骨架 |
| `02_hld_step_06_key_objects_references_audit.md` | reference、snapshot、audit、history、outbox 对象骨架 |

六个文件共同构成 Step 6 的完整产物。正式 `02-概要设计.md` 后续只摘录主表和必要对象摘要,不把全部附录机械粘贴。

---

## 6. Step 8 / Step 9 反查清单

### 6.1 关键处理流反查

| 预计处理流 | 必须能反查到的对象 |
|---|---|
| 治理语境与输入收束 | `GovernanceContext`、`GovernanceInput`、`GovernanceContextPolicy`、`GovernedSubjectRef`、`GovernanceSourceRef`、`ReferenceResolutionState` |
| Gate 打开 / 裁决 / 修正 / 替代 | `Gate`、`GovernanceDecision`、`DecisionPolicy`、`DecisionRecord`、`ApprovalResponsibility`、`SharedRuleSet`、`GovernanceOutboxRecord` |
| 审批责任建立 / 投票 / 授权 / 替代责任 | `ApprovalResponsibility`、`ApproverRequirement`、`ResponsibilityChain`、`ApprovalResponsibilityPolicy`、`ActorCapabilitySnapshot`、`ResponsibilityTraceRecord` |
| Policy 生效 / 停用 / 冲突处理 / shared rules 更新 | `PolicyEffectiveFact`、`SharedRuleSet`、`PolicyConflictRecord`、`PolicyConflictPolicy`、`SharedRulesPolicy`、`PolicyScopePolicy`、`PolicyChangeRecord` |
| Control 适用 / 实施 / 复核 | `ControlApplicability`、`ControlReview`、`ControlApplicabilityPolicy`、`MethodControlSnapshot`、`EvidenceSummaryRef`、`ControlChangeRecord` |
| AIIA / SoA 治理评审结论 | `AIIAConclusion`、`SoAConclusion`、`ComplianceConclusionPolicy`、`EvidenceSummaryRef`、`ComplianceConclusionRecord` |
| Nonconformity 登记 / 纠正 / 复验 / 关闭 | `NonconformityRecord`、`CorrectiveAction`、`VerificationResult`、`NonconformityClosurePolicy`、`NonconformityChangeRecord` |
| 授权查询 / 消费 / trace handoff | `ReadVisibilityPolicy`、`GovernanceTraceRecord`、`GovernanceAuditTrail`、`DecisionSummaryView`、`GovernanceDashboardView` |
| projection rebuild / reconciliation / external GRC export preparation | `DerivedGovernanceViewState`、`DerivedGovernanceViewPolicy`、`GovernanceReconciliationReport`、`GovernanceOutboxRecord` |
| 外部引用解析 / snapshot refresh | `ReferenceResolutionState`、`ActorCapabilitySnapshot`、`MethodPolicySnapshot`、`MethodControlSnapshot`、`EvidenceSummaryRef`、`ProcessGovernanceContextRef`、`WorkGovernanceContextRef`、`RuntimeSignalRef` |

### 6.2 状态机反查

| 状态主题 | Step 6 对象来源 |
|---|---|
| governance context / input readiness | `GovernanceContext`、`GovernanceInput` |
| Gate lifecycle | `Gate` |
| formal decision lifecycle | `GovernanceDecision` |
| approval / responsibility lifecycle | `ApprovalResponsibility`、`ResponsibilityChain` |
| policy effective lifecycle and conflict | `PolicyEffectiveFact`、`PolicyConflictRecord` |
| shared rules lifecycle | `SharedRuleSet` |
| control applicability / review lifecycle | `ControlApplicability`、`ControlReview` |
| AIIA / SoA conclusion lifecycle | `AIIAConclusion`、`SoAConclusion` |
| nonconformity corrective lifecycle | `NonconformityRecord`、`CorrectiveAction`、`VerificationResult` |
| derived freshness / rebuild | `DerivedGovernanceViewState` |
| reference resolution | `ReferenceResolutionState` |
| outbox publication / handoff | `GovernanceOutboxRecord`、`GovernanceTraceRecord` |

---

## 7. 本步设计取舍

| 取舍 | 结论 | 理由 |
|---|---|---|
| 是否把 `GovernanceDecisionRepository` 等接口当对象展开 | 不展开 | repository / port 属于 Step 7 和详细设计 |
| 是否把所有 ID / Ref 都独立成节 | 不展开 | 普通 ID / Ref 作为字段类型出现;只有带边界语义的 governed subject / source / snapshot / signal 独立展开 |
| 是否把外部仓对象正文纳入 Governance 对象 | 不纳入 | 只保存引用、摘要、快照和解析状态 |
| 是否把 projection / report / external GRC export 视为 truth | 不视为 truth | projection 和 export preparation 只能只读、可重建、可延迟 |
| 是否提前锁定完整状态矩阵 | 不锁定 | 本步只给状态候选与语义边界,正式迁移规则由 Step 9 和详细设计收敛 |

---

## 8. 当前文档问题诊断

| 旧 `02-概要设计.md` 内容 | 问题 | 本轮处理 |
|---|---|---|
| Gate、Decision、Governance Request、Exception、Responsibility Chain 作为教学解释散落出现 | 缺少对象类型、归属、关键字段、状态候选和禁止事项 | 改为逐对象骨架和主要组成部分回指 |
| process waiting、conversation card、work lifecycle 与 governance decision 混写 | 容易让相邻仓状态替代正式裁决 | 独立 `Gate`、`GovernanceDecision`、`DecisionRecord` 和外部 ref / snapshot 边界 |
| Policy、shared rules、Control、AIIA / SoA、Nonconformity 只作为概念解释 | 缺少正式 truth 对象、policy guard、history 和 projection 边界 | 分别独立关键对象,并明确正文排除 |
| report、dashboard、external GRC、audit 和 archive 线索混入核心对象 | 派生和交接结构可能成为第二 truth | 改为 projection / trace / outbox / handoff 边界,明确只读或追溯 |
| 外部上下文对象直接进入 Governance 叙事 | 容易打穿正文排除和依赖裁剪 | 改为 reference / snapshot / marker 对象 |

---

## 9. 回填草稿

正式 `02-概要设计.md` 后续整理时:

- §6 “关键对象轮廓”引用本文件 §3.1 的对象筛选表和 §4 的分布表。
- §6 对核心 truth 对象摘录 `GovernanceContext`、`GovernanceInput`、`Gate`、`GovernanceDecision`、`ApprovalResponsibility`、`PolicyEffectiveFact`、`SharedRuleSet`、`ControlApplicability`、`AIIAConclusion`、`SoAConclusion`、`NonconformityRecord`。
- §6 对辅助对象摘录 policy、projection、reference、audit / outbox 的对象组摘要,详细骨架保留在 Step 6 附录文件。
- Step 8 和 Step 9 必须使用 §6 的反查清单,不能引入 Step 6 未点名的新正式对象。

---

## 10. 进入下一步条件

- 已从 Step 5 对象候选池完成对象正式化筛选。
- 已明确正式关键对象、字段类型骨架、状态候选、函数骨架、工厂骨架和禁止事项的承载文件。
- 已排除 API、repository、port、trigger、DTO、数据库表和外部正文对象。
- Step 8 / Step 9 预计使用的对象均可反查到 Step 6。
- 可以进入 Step 7 “API / 接口骨架”。
