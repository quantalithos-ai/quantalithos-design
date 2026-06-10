# Step 9. 状态机与状态流转

> 对应 SOP: `standards/document/概要设计讨论流程_SOP.md` Step 9
> 回填章节: `02-概要设计.md` §9 状态定义与状态流转
> 生成日期: 2026-06-08
> 状态: 已完成

---

## 1. 本步目标

把 Step 6 已点名对象中的正式状态候选收束成概要层状态机,说明状态含义、主迁移方向、禁止迁移和状态传播关系。后续 `03-详细设计.md` 必须在本步基础上继续展开正式 enum、字段、guard、错误、事务和测试矩阵。

本步不写状态机代码实现、完整错误码、数据库状态列、配置 JSON、UI 展示规则或逐字段 DTO schema。

---

## 2. 本步输入

| 输入 | 状态 | 用途 |
|---|---|---|
| `02_hld_step_06_key_objects.md` 及对象附录 | 已完成 | 提供状态对象、状态候选、成员函数骨架和禁止事项 |
| `02_hld_step_07_api_interface_skeleton.md` | 已完成 | 提供触发状态变化的 Command、Consumer 和 Job 骨架 |
| `02_hld_step_08_processing_flows.md` | 已完成 | 提供 command / query / consumer / job 对状态变化的处理顺序 |
| `02_hld_step_03_constraints.md` | 已完成 | 提供 query no-write、consumer 不写核心 truth、job 不修复 truth 等硬约束 |
| `01-架构设计.md` §8 / §9 / §10 | 已完成 | 提供一致性、通信和数据归属边界 |

---

## 3. SOP 问题回答

### 3.1 本仓有哪些影响主线成立的正式状态?

本仓存在正式状态机,但不是单一全局状态机。状态分为 7 组:

1. governance context / input readiness。
2. gate / formal decision / approval responsibility。
3. policy effective / shared rules / policy conflict。
4. control applicability / control review / compliance conclusion。
5. nonconformity corrective loop。
6. derived view freshness / external reference resolution。
7. outbox publication / trace handoff marker。

这些状态由 Step 6 正式对象承载。Projection、report、handoff 和 outbox 状态不能替代核心 truth 状态。

### 3.2 每个状态的含义是什么,是否可以进入正常主线?

正常主线只能依赖明确可消费状态:

- `GovernanceContextState::Ready`。
- `GovernanceInputState::Accepted`。
- `GateState::PendingDecision` 或 `GateState::Decided`。
- `GovernanceDecisionState::Approved` / `Rejected` / `Waived`。
- `PolicyEffectiveState::Effective`。
- `SharedRuleSetState::Active`。
- `ControlApplicabilityState::Applicable` / `NotApplicable` / `Excluded`。
- `ComplianceConclusionState::Approved` / `Rejected`。
- `NonconformityState::Closed` 或仍在纠正流中的非终态。
- `DerivedGovernanceViewFreshnessState::Fresh` 可直接供给查询,`Stale` / `Failed` / `Unavailable` 必须带 degraded / freshness surface。
- `ReferenceResolutionKind::Resolved` 才能作为已解析外部输入;其他状态只能触发 pending、stale 或 degraded。

### 3.3 哪些接口、事件或动作会触发状态迁移?

- Command 触发核心 truth 状态迁移,例如 context、input、gate、decision、approval、policy、control、conclusion 和 nonconformity。
- Inbound Event Consumer 只触发 external snapshot / reference / stale marker 状态迁移,不得直接触发 decision、policy、control、conclusion 或 nonconformity 核心 truth。
- Operations Job 只触发 outbox publication、derived view freshness、reference refresh、reconciliation report、handoff / export marker 状态迁移,不得修正核心 truth。
- Query 不触发任何持久状态迁移。

### 3.4 哪些迁移明确允许,哪些迁移明确禁止?

允许迁移见 §7。禁止迁移见 §8。概要层只保留主线迁移和红线迁移;详细设计必须补齐状态矩阵、幂等重复、并发冲突、expected version 和错误映射。

### 3.5 状态变化如何影响 outbox、projection、下游感知或只读供给?

核心 truth 状态变化必须产生 trace / audit,按需要生成 outbox record,并标记受影响 derived view stale。Consumer 和 maintenance job 可改变 reference / snapshot / projection 状态并生成 job report,但不能回写核心 truth。Publisher 只改变 outbox publication state,不能重新计算或改变已成立 truth。

---

## 4. 状态机边界总览

| 状态组 | 承载对象 | 主要触发 | 说明 |
|---|---|---|---|
| Context / input readiness | `GovernanceContext`、`GovernanceInput` | context / input command; external reference refresh | 判断治理语境和输入是否可进入正式裁决 |
| Gate / decision | `Gate`、`GovernanceDecision`、`DecisionRecord` | gate / decision command | 表达正式裁决等待、结果、替代和撤销 |
| Approval responsibility | `ApprovalResponsibility`、`ResponsibilityChain` | approval command; actor capability snapshot | 表达责任是否满足裁决要求 |
| Policy / shared rules | `PolicyEffectiveFact`、`SharedRuleSet`、`PolicyConflictRecord` | policy command; conflict resolution command | 表达 policy 生效事实、组织级硬约束和冲突状态 |
| Control / compliance | `ControlApplicability`、`ControlReview`、`AIIAConclusion`、`SoAConclusion` | control / compliance command | 表达控制适用、复核和 AIIA / SoA 结论 |
| Nonconformity corrective | `NonconformityRecord`、`CorrectiveAction`、`VerificationResult` | nonconformity command | 表达不符合提出、纠正、复验和关闭 |
| Derived / reference | `DerivedGovernanceViewState`、`ReferenceResolutionState` | consumer; rebuild / refresh job | 表达只读视图新鲜度和外部引用解析 |
| Publication / handoff | `GovernanceOutboxRecord`、`GovernanceTraceRecord` | outbox / handoff job | 表达传播、交接和导出状态 |

---

## 5. 状态定义表

### 5.1 Context / Input 状态

| 状态类型 | 状态 | 含义 | 是否可进入正常主线 |
|---|---|---|---|
| `GovernanceContextState` | `Draft` | 语境已创建但裁决条件未闭合 | 否 |
| `GovernanceContextState` | `Ready` | subject、source、actor 和基础引用满足裁决入口 | 是 |
| `GovernanceContextState` | `PendingReference` | 外部引用或摘要暂未解析 | 否,只能等待 refresh 或补 evidence |
| `GovernanceContextState` | `Invalid` | 语境不合法或不再适用 | 否,终态 |
| `GovernanceContextState` | `Closed` | 语境已结束,不再接收新裁决 | 否,终态 |
| `GovernanceInputState` | `Received` | 输入已接收,尚未收束 | 否 |
| `GovernanceInputState` | `Accepted` | 输入被接受为正式治理处理线索 | 是 |
| `GovernanceInputState` | `Rejected` | 输入不成立或不具备治理意义 | 否,终态 |
| `GovernanceInputState` | `PendingEvidence` | 等待依据摘要或外部证据解析 | 否 |
| `GovernanceInputState` | `Superseded` | 已被后续输入替代 | 否,终态 |

### 5.2 Gate / Decision / Responsibility 状态

| 状态类型 | 状态 | 含义 | 是否可进入正常主线 |
|---|---|---|---|
| `GateState` | `Open` | Gate 已打开,尚未要求正式裁决 | 是,但不能作为裁决结果 |
| `GateState` | `PendingDecision` | 已绑定责任或要求,等待裁决 | 是 |
| `GateState` | `Decided` | 已绑定正式 GovernanceDecision | 是 |
| `GateState` | `Expired` | Gate 超时或不再可用 | 否,终态 |
| `GateState` | `Cancelled` | Gate 被取消 | 否,终态 |
| `GovernanceDecisionState` | `Proposed` | 裁决对象已提出,尚未形成结果 | 否 |
| `GovernanceDecisionState` | `Approved` | 正式批准 | 是,终态但可被 supersede / revoke 显式替代 |
| `GovernanceDecisionState` | `Rejected` | 正式拒绝 | 是,终态但可被 supersede / revoke 显式替代 |
| `GovernanceDecisionState` | `Waived` | 正式豁免 | 是,终态但可被 supersede / revoke 显式替代 |
| `GovernanceDecisionState` | `Superseded` | 被新裁决替代 | 否,历史可追溯 |
| `GovernanceDecisionState` | `Revoked` | 被撤销 | 否,历史可追溯 |
| `ApprovalResponsibilityState` | `Required` | 责任要求已生成但未分配 | 否 |
| `ApprovalResponsibilityState` | `Assigned` | 已分配给 actor | 是 |
| `ApprovalResponsibilityState` | `Accepted` | actor 接受责任 | 是 |
| `ApprovalResponsibilityState` | `Voted` | 已记录投票或审批动作 | 是,但不等同裁决 |
| `ApprovalResponsibilityState` | `Delegated` | 已委托给替代 actor | 是,但需保留责任链 |
| `ApprovalResponsibilityState` | `Released` | 责任释放 | 否,终态 |
| `ResponsibilityChainState` | `Open` | 责任链待满足 | 是 |
| `ResponsibilityChainState` | `Satisfied` | 责任链满足裁决要求 | 是 |
| `ResponsibilityChainState` | `Escalated` | 责任链升级处理 | 是,但需显式可见 |
| `ResponsibilityChainState` | `Blocked` | 责任链无法满足 | 否 |
| `ResponsibilityChainState` | `Closed` | 责任链结束 | 否,终态 |

### 5.3 Policy / Shared Rules 状态

| 状态类型 | 状态 | 含义 | 是否可进入正常主线 |
|---|---|---|---|
| `PolicyEffectiveState` | `Proposed` | policy 生效事实待批准或待激活 | 否 |
| `PolicyEffectiveState` | `Effective` | policy 在 scope 内正式生效 | 是 |
| `PolicyEffectiveState` | `Suspended` | 暂停生效 | 否 |
| `PolicyEffectiveState` | `Superseded` | 被后续 policy fact 替代 | 否,历史可追溯 |
| `PolicyEffectiveState` | `Retired` | 退役不再适用 | 否,终态 |
| `SharedRuleSetState` | `Draft` | shared rules 草稿 | 否 |
| `SharedRuleSetState` | `Active` | 组织级硬约束生效 | 是 |
| `SharedRuleSetState` | `Deprecated` | 部分规则或集合被弃用,等待替代或退役 | 是,但查询必须显式暴露 |
| `SharedRuleSetState` | `Retired` | 规则集合退役 | 否,终态 |
| `PolicyConflictState` | `Detected` | 冲突已发现 | 否,需处理 |
| `PolicyConflictState` | `PendingDecision` | 冲突等待正式裁决 | 否 |
| `PolicyConflictState` | `Resolved` | 冲突已基于正式依据解决 | 是 |
| `PolicyConflictState` | `Waived` | 冲突被正式豁免 | 是,但必须可追溯 |
| `PolicyConflictState` | `Invalid` | 冲突记录不成立 | 否,终态 |

### 5.4 Control / Compliance 状态

| 状态类型 | 状态 | 含义 | 是否可进入正常主线 |
|---|---|---|---|
| `ControlApplicabilityState` | `PendingAssessment` | 控制适用性待评估 | 否 |
| `ControlApplicabilityState` | `Applicable` | 控制适用 | 是 |
| `ControlApplicabilityState` | `NotApplicable` | 控制不适用 | 是 |
| `ControlApplicabilityState` | `Excluded` | 控制被有依据排除 | 是,但必须带依据 |
| `ControlApplicabilityState` | `Superseded` | 被后续适用性判断替代 | 否 |
| `ControlReviewState` | `Planned` | 复核已计划 | 是 |
| `ControlReviewState` | `InReview` | 复核进行中 | 是 |
| `ControlReviewState` | `Passed` | 复核通过 | 是 |
| `ControlReviewState` | `Failed` | 复核失败 | 是,但可能触发 nonconformity |
| `ControlReviewState` | `Waived` | 复核被正式豁免 | 是,必须引用裁决 |
| `ControlReviewState` | `Superseded` | 被后续复核替代 | 否 |
| `ComplianceConclusionState` | `Drafted` | AIIA / SoA 结论草稿 | 否 |
| `ComplianceConclusionState` | `InReview` | 结论进入治理评审 | 是 |
| `ComplianceConclusionState` | `Approved` | 结论被正式批准 | 是 |
| `ComplianceConclusionState` | `Rejected` | 结论被正式拒绝 | 是 |
| `ComplianceConclusionState` | `Superseded` | 被新结论替代 | 否 |
| `ComplianceConclusionState` | `Revoked` | 结论撤销 | 否 |

### 5.5 Nonconformity Corrective 状态

| 状态类型 | 状态 | 含义 | 是否可进入正常主线 |
|---|---|---|---|
| `NonconformityState` | `Raised` | 不符合已提出 | 是 |
| `NonconformityState` | `CauseConfirmed` | 原因已确认 | 是 |
| `NonconformityState` | `Correcting` | 正在纠正 | 是 |
| `NonconformityState` | `ReadyForVerification` | 等待复验 | 是 |
| `NonconformityState` | `Closed` | 复验通过后关闭 | 是,终态但可重开 |
| `NonconformityState` | `Reopened` | 已关闭不符合被重开 | 是 |
| `NonconformityState` | `Rejected` | 线索不成立 | 否,终态 |
| `CorrectiveActionState` | `Planned` | 纠正动作已计划 | 是 |
| `CorrectiveActionState` | `InProgress` | 纠正执行中 | 是 |
| `CorrectiveActionState` | `Completed` | 纠正动作完成 | 是,但不自动关闭不符合 |
| `CorrectiveActionState` | `Cancelled` | 纠正动作取消 | 否 |
| `CorrectiveActionState` | `Failed` | 纠正动作失败 | 否,需重新规划或升级 |
| `VerificationState` | `Passed` | 复验通过 | 是,可支持关闭 |
| `VerificationState` | `Failed` | 复验失败 | 否,需重新纠正 |
| `VerificationState` | `Inconclusive` | 复验无法确认 | 否,需补 evidence 或重新复核 |

### 5.6 Derived / Reference / Outbox 状态

| 状态类型 | 状态 | 含义 | 是否可进入正常主线 |
|---|---|---|---|
| `DerivedGovernanceViewFreshnessState` | `Fresh` | 视图已追上来源 cursor | 是 |
| `DerivedGovernanceViewFreshnessState` | `Stale` | 视图落后于 truth 或 snapshot | 是,但 query 必须暴露 freshness / degraded |
| `DerivedGovernanceViewFreshnessState` | `Rebuilding` | 视图重建中 | 是,但 query 需暴露 rebuilding / fallback |
| `DerivedGovernanceViewFreshnessState` | `Failed` | 视图维护失败 | 否,除非 response 明确 failed / fallback |
| `DerivedGovernanceViewFreshnessState` | `Unavailable` | 视图不可用 | 否 |
| `ReferenceResolutionKind` | `Resolved` | 外部引用已解析到版本 | 是 |
| `ReferenceResolutionKind` | `Unresolved` | 未能解析 | 否 |
| `ReferenceResolutionKind` | `Stale` | 来源版本过期 | 否,需 refresh 或重新确认 |
| `ReferenceResolutionKind` | `Invalid` | 引用无效 | 否 |
| `ReferenceResolutionKind` | `Unavailable` | 来源暂不可用 | 否,可延迟或 degraded |
| `OutboxPublicationState` | `Pending` | 已成立 truth 待传播 | 是,传播未完成 |
| `OutboxPublicationState` | `Published` | 已成功发布 | 是 |
| `OutboxPublicationState` | `Failed` | 发布失败,可重试或进入死信 | 是,但需 operational visibility |
| `OutboxPublicationState` | `DeadLettered` | 不可恢复发布失败 | 否,需人工或运维处置 |

---

## 6. 状态流转图

### 6.1 Context / Input Readiness

```text
+====================================================================+
|                   Governance Context / Input Flow                  |
+====================================================================+
| GovernanceContext                                                  |
|   Draft                                                            |
|    | mark_ready                                                    |
|    v                                                               |
|   Ready <------------------------------+                           |
|    |                                   | reference resolved         |
|    | mark_pending_reference            |                           |
|    v                                   |                           |
|   PendingReference --------------------+                           |
|    | invalidate / close                                             |
|    v                                                               |
|   Invalid / Closed                                                  |
|                                                                    |
| GovernanceInput                                                    |
|   Received                                                         |
|    | accept             | reject              | wait_for_evidence   |
|    v                    v                     v                    |
|   Accepted            Rejected             PendingEvidence          |
|    | supersede                               | evidence accepted    |
|    v                                         v                     |
|   Superseded                              Accepted                 |
+====================================================================+
```

关键说明:

- `Ready` context 是 gate、decision、control、compliance 和 nonconformity command 的前置条件。
- `PendingReference` 不允许直接进入正式裁决,必须由 reference refresh 或补充 evidence 推动。
- `GovernanceInput::Accepted` 只说明输入成立,不自动创建 Gate 或 Decision。
- `Invalid`、`Closed`、`Rejected` 和 `Superseded` 是不可继续主线的终态或历史态。

### 6.2 Gate / Decision / Responsibility

```text
+====================================================================+
|                Gate / Decision / Responsibility Flow               |
+====================================================================+
| Gate                                                               |
|   Open                                                            |
|    | request_decision                                              |
|    v                                                              |
|   PendingDecision ---- attach_decision ----> Decided               |
|    | expire / cancel                                              |
|    v                                                              |
|   Expired / Cancelled                                              |
|                                                                   |
| GovernanceDecision                                                |
|   Proposed                                                        |
|    | approve        | reject        | waive                        |
|    v                v              v                              |
|   Approved        Rejected       Waived                            |
|    | supersede / revoke                                            |
|    v                                                              |
|   Superseded / Revoked                                             |
|                                                                   |
| ResponsibilityChain                                                |
|   Open ---- mark_satisfied ----> Satisfied                         |
|    | escalate                 | block                              |
|    v                          v                                    |
|   Escalated                 Blocked                                |
|    | close                                                        |
|    v                                                              |
|   Closed                                                          |
+====================================================================+
```

关键说明:

- `GateState::Decided` 必须引用正式 `GovernanceDecision`,不能只记录 UI 或外部系统结果。
- `GovernanceDecision` 的替代和撤销是显式迁移,不是原地修改 outcome。
- `ResponsibilityChainState::Satisfied` 只说明可裁决,不会自动把 decision 推到 `Approved`。
- `Expired`、`Cancelled`、`Blocked` 和 `Closed` 影响 query / dashboard 可见性,但不删除历史。

### 6.3 Policy / Shared Rules / Conflict

```text
+====================================================================+
|                  Policy / Shared Rules State Flow                  |
+====================================================================+
| PolicyEffectiveFact                                                |
|   Proposed ---- activate ----> Effective                           |
|      |                         | suspend                           |
|      |                         v                                   |
|      |                      Suspended                              |
|      |                         | activate                          |
|      +-------------------------+                                   |
|      | supersede / retire                                          |
|      v                                                            |
|   Superseded / Retired                                             |
|                                                                   |
| SharedRuleSet                                                      |
|   Draft ---- activate ----> Active ---- deprecate_rule ----> Deprecated |
|    |                         | retire                 | retire     |
|    v                         v                        v            |
|   Retired                  Retired                 Retired          |
|                                                                   |
| PolicyConflictRecord                                               |
|   Detected ---- mark_pending_decision ----> PendingDecision         |
|      | resolve / waive / invalidate                                |
|      v                                                            |
|   Resolved / Waived / Invalid                                      |
+====================================================================+
```

关键说明:

- `Effective` policy 和 `Active` shared rules 才能作为正式裁决 guard 的主输入。
- `Deprecated` shared rules 仍可被查询和追溯,但详细设计必须明确是否还能阻断低 scope override。
- `PolicyConflictRecord` 不修改 policy truth;它只记录冲突和处理结论。
- conflict waive 必须可回链正式依据,不能由 runtime 或配置直接跳过。

### 6.4 Control / Compliance

```text
+====================================================================+
|                  Control / Compliance State Flow                   |
+====================================================================+
| ControlApplicability                                               |
|   PendingAssessment                                                |
|    | mark_applicable | mark_not_applicable | exclude               |
|    v                 v                     v                       |
|   Applicable       NotApplicable          Excluded                 |
|    | supersede       | supersede           | supersede              |
|    v                 v                     v                       |
|   Superseded       Superseded             Superseded               |
|                                                                   |
| ControlReview                                                      |
|   Planned ---- start ----> InReview                                |
|     |                    | pass / fail / waive                     |
|     v                    v                                         |
|   Superseded          Passed / Failed / Waived                     |
|                                                                   |
| AIIAConclusion / SoAConclusion                                     |
|   Drafted ---- submit_for_review ----> InReview                    |
|      |                             | approve / reject              |
|      v                             v                               |
|   Superseded                    Approved / Rejected                |
|                                    | supersede / revoke            |
|                                    v                               |
|                                 Superseded / Revoked               |
+====================================================================+
```

关键说明:

- `ControlReviewState::Failed` 可触发 nonconformity flow,但不自动创建 `NonconformityRecord`。
- AIIA / SoA 正文状态不归 Governance;Governance 只保存结论状态和正文引用。
- `Approved` / `Rejected` conclusion 必须来自正式治理评审或 decision,不能由 artifact 版本变更自动推出。
- `Superseded` 保留历史追溯,不删除旧结论或旧适用性判断。

### 6.5 Nonconformity Corrective Loop

```text
+====================================================================+
|                Nonconformity Corrective State Flow                 |
+====================================================================+
| NonconformityRecord                                                |
|   Raised ---- confirm_cause ----> CauseConfirmed                   |
|     | reject                         | start_correction            |
|     v                                v                             |
|   Rejected                       Correcting                        |
|                                      | mark_ready_for_verification  |
|                                      v                             |
|                                  ReadyForVerification              |
|                                      | close with Passed            |
|                                      v                             |
|                                    Closed                          |
|                                      | reopen                       |
|                                      v                             |
|                                    Reopened ---- start_correction --+
|                                                                   |
| CorrectiveAction                                                   |
|   Planned ---- start ----> InProgress ---- complete ----> Completed |
|      | cancel / fail              | cancel / fail                  |
|      v                            v                                |
|   Cancelled / Failed            Cancelled / Failed                 |
|                                                                   |
| VerificationResult                                                 |
|   Passed / Failed / Inconclusive                                   |
+====================================================================+
```

关键说明:

- `CorrectiveActionState::Completed` 不自动关闭 nonconformity,关闭必须基于 `VerificationResult::Passed`。
- `VerificationResult::Failed` 或 `Inconclusive` 必须回到纠正或补 evidence,不能进入 `Closed`。
- `Rejected` 和 `Closed` 是正常可审查终态;`Closed` 可通过显式 reopen 回到纠正流。
- 外部 work blocker、bug 或 alert 只能作为 source / evidence,不能替代本状态机。

### 6.6 Derived / Reference / Outbox

```text
+====================================================================+
|               Derived View / Reference / Outbox Flow               |
+====================================================================+
| DerivedGovernanceViewState                                         |
|   Fresh ---- mark_stale ----> Stale ---- start_rebuild ----> Rebuilding |
|    ^                              | mark_failed             | mark_fresh |
|    |                              v                         v          |
|    +--------------------------- Failed <-------------- Unavailable      |
|                                                                   |
| ReferenceResolutionState                                           |
|   Unresolved ---- mark_resolved ----> Resolved ---- mark_stale ----> Stale |
|       | mark_invalid / unavailable       | mark_invalid / unavailable |
|       v                                  v                          |
|   Invalid / Unavailable              Invalid / Unavailable          |
|                                                                   |
| GovernanceOutboxRecord                                             |
|   Pending ---- mark_published ----> Published                      |
|      | mark_failed                                                   |
|      v                                                              |
|   Failed ---- retry ----> Pending ---- mark_dead_lettered ----> DeadLettered |
+====================================================================+
```

关键说明:

- Derived view 状态只影响 read surface 和维护任务,不能反写 core truth。
- Reference refresh 只改变本地解析状态和 affected view freshness,不改变外部 source truth。
- Outbox `Pending` 已表示核心 truth 成立;发布失败不回滚 truth。
- `DeadLettered` 必须进入运维和验收可见面,不能被 query 静默隐藏。

---

## 7. 允许迁移清单

### 7.1 Context / Input

| 对象 | 允许迁移 | 触发动作 |
|---|---|---|
| `GovernanceContext` | `Draft -> Ready` | `mark_ready` |
| `GovernanceContext` | `Draft / Ready -> PendingReference` | `mark_pending_reference` |
| `GovernanceContext` | `PendingReference -> Ready` | reference resolved 或 evidence 补齐 |
| `GovernanceContext` | `Draft / Ready / PendingReference -> Invalid` | `invalidate` |
| `GovernanceContext` | `Ready / PendingReference -> Closed` | `close` |
| `GovernanceInput` | `Received -> Accepted` | `accept` |
| `GovernanceInput` | `Received -> Rejected` | `reject` |
| `GovernanceInput` | `Received / Accepted -> PendingEvidence` | `wait_for_evidence` |
| `GovernanceInput` | `PendingEvidence -> Accepted` | evidence resolved / accepted |
| `GovernanceInput` | `Received / Accepted / PendingEvidence -> Superseded` | `supersede` |

### 7.2 Gate / Decision / Responsibility

| 对象 | 允许迁移 | 触发动作 |
|---|---|---|
| `Gate` | `Open -> PendingDecision` | `request_decision` |
| `Gate` | `PendingDecision -> Decided` | `attach_decision` |
| `Gate` | `Open / PendingDecision -> Expired` | `expire` |
| `Gate` | `Open / PendingDecision -> Cancelled` | `cancel` |
| `GovernanceDecision` | `Proposed -> Approved` | `approve` |
| `GovernanceDecision` | `Proposed -> Rejected` | `reject` |
| `GovernanceDecision` | `Proposed -> Waived` | `waive` |
| `GovernanceDecision` | `Approved / Rejected / Waived -> Superseded` | `supersede` |
| `GovernanceDecision` | `Approved / Rejected / Waived -> Revoked` | `revoke` |
| `ApprovalResponsibility` | `Required -> Assigned` | `assign` |
| `ApprovalResponsibility` | `Assigned -> Accepted` | `accept` |
| `ApprovalResponsibility` | `Assigned / Accepted -> Voted` | `record_vote` |
| `ApprovalResponsibility` | `Assigned / Accepted -> Delegated` | `delegate_to` |
| `ApprovalResponsibility` | `Required / Assigned / Accepted / Delegated -> Released` | `release` |
| `ResponsibilityChain` | `Open -> Satisfied` | `mark_satisfied` |
| `ResponsibilityChain` | `Open -> Escalated` | `escalate` |
| `ResponsibilityChain` | `Open / Escalated -> Blocked` | `block` |
| `ResponsibilityChain` | `Satisfied / Blocked / Escalated -> Closed` | `close` |

### 7.3 Policy / Control / Compliance / Corrective

| 对象 | 允许迁移 | 触发动作 |
|---|---|---|
| `PolicyEffectiveFact` | `Proposed -> Effective` | `activate` |
| `PolicyEffectiveFact` | `Effective -> Suspended` | `suspend` |
| `PolicyEffectiveFact` | `Suspended -> Effective` | re-activate with valid policy basis |
| `PolicyEffectiveFact` | `Proposed / Effective / Suspended -> Superseded` | `supersede` |
| `PolicyEffectiveFact` | `Proposed / Effective / Suspended -> Retired` | `retire` |
| `SharedRuleSet` | `Draft -> Active` | `activate` |
| `SharedRuleSet` | `Active -> Deprecated` | `deprecate_rule` |
| `SharedRuleSet` | `Draft / Active / Deprecated -> Retired` | `retire` |
| `PolicyConflictRecord` | `Detected -> PendingDecision` | `mark_pending_decision` |
| `PolicyConflictRecord` | `Detected / PendingDecision -> Resolved` | `resolve` |
| `PolicyConflictRecord` | `Detected / PendingDecision -> Waived` | `waive` |
| `PolicyConflictRecord` | `Detected / PendingDecision -> Invalid` | `invalidate` |
| `ControlApplicability` | `PendingAssessment -> Applicable` | `mark_applicable` |
| `ControlApplicability` | `PendingAssessment -> NotApplicable` | `mark_not_applicable` |
| `ControlApplicability` | `PendingAssessment -> Excluded` | `exclude` |
| `ControlApplicability` | `Applicable / NotApplicable / Excluded -> Superseded` | `supersede` |
| `ControlReview` | `Planned -> InReview` | `start` |
| `ControlReview` | `InReview -> Passed / Failed / Waived` | `pass` / `fail` / `waive` |
| `ControlReview` | `Planned / InReview -> Superseded` | superseding review |
| `AIIAConclusion` / `SoAConclusion` | `Drafted -> InReview` | `submit_for_review` |
| `AIIAConclusion` / `SoAConclusion` | `InReview -> Approved / Rejected` | `approve` / `reject` |
| `AIIAConclusion` / `SoAConclusion` | `Drafted / InReview / Approved / Rejected -> Superseded` | `supersede` |
| `AIIAConclusion` / `SoAConclusion` | `Approved / Rejected -> Revoked` | `revoke` |
| `NonconformityRecord` | `Raised -> CauseConfirmed` | `confirm_cause` |
| `NonconformityRecord` | `Raised -> Rejected` | `reject` |
| `NonconformityRecord` | `CauseConfirmed / Reopened -> Correcting` | `start_correction` |
| `NonconformityRecord` | `Correcting -> ReadyForVerification` | `mark_ready_for_verification` |
| `NonconformityRecord` | `ReadyForVerification -> Closed` | `close` with passed verification |
| `NonconformityRecord` | `Closed -> Reopened` | `reopen` |
| `CorrectiveAction` | `Planned -> InProgress` | `start` |
| `CorrectiveAction` | `InProgress -> Completed` | `complete` |
| `CorrectiveAction` | `Planned / InProgress -> Cancelled` | `cancel` |
| `CorrectiveAction` | `Planned / InProgress -> Failed` | `fail` |

### 7.4 Derived / Reference / Outbox

| 对象 | 允许迁移 | 触发动作 |
|---|---|---|
| `DerivedGovernanceViewState` | `Fresh -> Stale` | core truth / snapshot changed |
| `DerivedGovernanceViewState` | `Stale -> Rebuilding` | rebuild job starts |
| `DerivedGovernanceViewState` | `Rebuilding -> Fresh` | rebuild succeeds |
| `DerivedGovernanceViewState` | `Stale / Rebuilding -> Failed` | rebuild fails |
| `DerivedGovernanceViewState` | `Failed -> Rebuilding` | retry rebuild |
| `ReferenceResolutionState` | `Unresolved / Stale / Unavailable -> Resolved` | refresh succeeds |
| `ReferenceResolutionState` | `Resolved -> Stale` | source version moved |
| `ReferenceResolutionState` | `Unresolved / Resolved / Stale -> Invalid` | reference invalidated |
| `ReferenceResolutionState` | `Unresolved / Resolved / Stale -> Unavailable` | source unavailable |
| `GovernanceOutboxRecord` | `Pending -> Published` | publish succeeds |
| `GovernanceOutboxRecord` | `Pending -> Failed` | publish fails |
| `GovernanceOutboxRecord` | `Failed -> Pending` | retry scheduled |
| `GovernanceOutboxRecord` | `Pending / Failed -> DeadLettered` | unrecoverable publish failure |

---

## 8. 禁止迁移清单

| 禁止迁移或行为 | 原因 |
|---|---|
| `GovernanceInput::Accepted` 自动生成 `GovernanceDecision::Approved` | 输入成立不等于裁决成立 |
| `GovernanceContext::PendingReference` 直接进入 Gate / Decision / Control / Conclusion 主线 | 外部引用未解析,无法形成可审查依据 |
| `GateState::Open` 直接作为下游 approved / rejected / waived 消费 | Gate 只是等待点,不是裁决结果 |
| `GateState::Decided` 无 `GovernanceDecisionRef` | Decided 必须绑定正式裁决 |
| `GovernanceDecision::Approved / Rejected / Waived` 原地修改 outcome | 修正必须通过 `Superseded` 或 `Revoked` 保留历史 |
| `ApprovalResponsibilityState::Voted` 自动推动 `GovernanceDecisionState::Approved` | 投票或责任满足不替代正式裁决 |
| `ResponsibilityChainState::Satisfied` 自动关闭 Gate | 满足责任只说明可裁决,不能代替 decision command |
| 低 scope policy 或配置把 `SharedRuleSetState::Active` 的约束降级 | shared rules 是组织级硬约束 |
| `PolicyConflictRecord::Waived` 无正式依据 | 冲突豁免必须可追溯 |
| `ControlReviewState::Failed` 自动关闭或替代 `NonconformityRecord` | 复核失败只是输入线索,纠正闭环必须显式创建 |
| `CorrectiveActionState::Completed` 自动关闭 `NonconformityRecord` | 关闭必须基于 `VerificationResult::Passed` |
| `VerificationState::Failed / Inconclusive` 推动 `NonconformityState::Closed` | 复验失败或无法确认不能关闭 |
| Query 改变任何 truth、reference、projection、outbox 或 report 状态 | Query no-write 是架构红线 |
| Inbound Event Consumer 直接创建或修改 `GovernanceDecision`、`PolicyEffectiveFact`、`ControlApplicability`、`AIIAConclusion`、`SoAConclusion`、`NonconformityRecord` | Consumer 只写 mirror / reference / stale marker |
| Rebuild / refresh / reconcile job 修改核心 truth | Job 只维护派生、快照、报告或交接 |
| Outbox `Failed` 回滚已成立 truth | outbox 传播失败不影响 truth 成立 |
| `DerivedGovernanceViewState::Fresh` 反写核心 truth | projection 是可重建只读视图 |
| `ReferenceResolutionKind::Resolved` 替代外部仓对象状态 | 本仓只保存解析状态和 summary,不拥有外部 truth |

---

## 9. 状态传播关系

```text
+====================================================================+
|                    Governance State Propagation                    |
+====================================================================+
| Core truth command accepted                                        |
|   |                                                                |
|   +--> GovernanceTraceRecord / GovernanceAuditTrail                |
|   |                                                                |
|   +--> GovernanceOutboxRecord(Pending)                             |
|   |                                                                |
|   +--> DerivedGovernanceViewState(Stale)                           |
|   |                                                                |
|   +--> Query response freshness / visibility surface               |
|                                                                    |
| Inbound external event accepted                                    |
|   |                                                                |
|   +--> ReferenceResolutionState / local snapshot state             |
|   |                                                                |
|   +--> DerivedGovernanceViewState(Stale)                           |
|   |                                                                |
|   +--> Consumer receipt / delayed / duplicate surface              |
|                                                                    |
| Operations job result                                              |
|   |                                                                |
|   +--> OutboxPublicationState or DerivedGovernanceViewFreshnessState |
|   |                                                                |
|   +--> ReconciliationReport / handoff marker / job report          |
+====================================================================+
```

关键说明:

- 核心 truth 状态变化是 trace、audit、outbox 和 projection stale 的来源。
- Consumer 状态变化只来自外部事件和 snapshot / reference store,不能跳过 Command 写核心 truth。
- Job 状态变化只影响运维可见面、派生可见面和传播可见面。
- Query 只能读取传播后的 surface,不能为了“看起来新鲜”触发 refresh 或 rebuild。

### 9.1 状态变化对下游的影响

| 来源状态变化 | 必须传播到 | 不允许传播到 |
|---|---|---|
| Context / input accepted / rejected / pending | trace、audit、context / input views、outbox optional | decision truth |
| Gate / decision changed | trace、audit、decision summary、dashboard、outbox | process / conversation truth |
| Approval responsibility changed | responsibility trace、approval queue view、dashboard | decision outcome |
| Policy / shared rules changed | policy effective view、control guard inputs、dashboard、outbox | method-library policy body |
| Policy conflict changed | policy conflict view、decision queue、dashboard | policy definition body |
| Control / conclusion changed | control coverage view、compliance view、dashboard、outbox | artifact AIIA / SoA body |
| Nonconformity changed | nonconformity status view、dashboard、outbox | WorkItem truth |
| Reference state changed | affected derived views、degraded query surface | external source truth |
| Projection freshness changed | query freshness / degraded surface | core truth |
| Outbox publication changed | operations report、publication audit | accepted truth state |

---

## 10. 处理流与状态机对应关系

| Step 8 处理流族 | 主要状态机 | 输出状态影响 |
|---|---|---|
| Governance Context and Input Command Flow | `GovernanceContextState`、`GovernanceInputState`、`ReferenceResolutionKind` | context / input truth、trace、stale marker |
| Gate and Decision Command Flow | `GateState`、`GovernanceDecisionState`、`ResponsibilityChainState` | decision truth、decision record、outbox、decision view stale |
| Approval and Responsibility Command Flow | `ApprovalResponsibilityState`、`ResponsibilityChainState` | responsibility trace、approval queue stale |
| Policy and Shared Rules Command Flow | `PolicyEffectiveState`、`SharedRuleSetState`、`PolicyConflictState` | policy change record、policy view stale、outbox |
| Control and Compliance Conclusion Command Flow | `ControlApplicabilityState`、`ControlReviewState`、`ComplianceConclusionState` | control / conclusion records、coverage view stale、outbox |
| Nonconformity Corrective Command Flow | `NonconformityState`、`CorrectiveActionState`、`VerificationState` | corrective trace、status view stale、outbox |
| Authorized Governance Query Flow | 只读所有状态 | 不产生状态变化 |
| External Context Consumer Flow | `ReferenceResolutionKind`、snapshot verified state、`DerivedGovernanceViewFreshnessState` | reference / snapshot state、stale marker、consumer receipt |
| Publish Governance Outbox Flow | `OutboxPublicationState` | publication marker、job report |
| Rebuild / Refresh / Reconcile Job Flow | `DerivedGovernanceViewFreshnessState`、`ReferenceResolutionKind`、reconciliation report state | derived view、reference state、report |
| Trace / Archive / External GRC Handoff Flow | trace handoff marker、job report state | handoff / export marker、report |

---

## 11. 当前文档问题诊断

| 旧 `02-概要设计.md` 内容 | 问题 | 本轮处理 |
|---|---|---|
| Gate、Decision、Responsibility 的生命周期散落在解释文字里 | 详细设计无法判断哪些状态可进入主线 | 本步收束 Gate / Decision / Responsibility 状态表和流转图 |
| Policy、Control、Compliance、Nonconformity 状态没有统一传播口径 | 容易把 report / dashboard / external GRC 当成 truth | 本步明确 core truth、derived、outbox 和 handoff 的状态边界 |
| 外部引用状态与核心裁决状态混写 | Consumer 可能绕过 command 直接创建裁决 | 本步规定 consumer 只改变 reference / snapshot / stale marker |
| projection freshness 与查询 degraded surface 未分离 | Query 可能隐式修复 projection | 本步规定 Query no-write, freshness 只读暴露 |
| outbox publication 和 truth 成立关系不清 | 可能错误地让发布失败回滚 truth | 本步明确 outbox 只传播已成立 truth |

---

## 12. 改动前后对比

| 维度 | 改动前 | 改动后 |
|---|---|---|
| 状态机数量 | 业务概念中隐含 | 按 7 个状态组明确承载对象 |
| 正常主线条件 | 未逐状态说明 | 每类状态标明是否可进入正常主线 |
| 迁移边界 | 依赖详细设计自行判断 | 概要层给出允许 / 禁止迁移骨架 |
| 状态传播 | trace、outbox、projection、reference 混合 | 分清 core truth、derived、reference、publication、handoff |
| Query / Consumer / Job 状态影响 | 容易越界 | Query no-write,consumer 不写核心 truth,job 不修复 truth |

---

## 13. 设计取舍

| 取舍 | 结论 | 理由 |
|---|---|---|
| 是否建立单一 `GovernanceLifecycleState` | 不建立 | 本仓对象状态语义差异大,单一状态会掩盖裁决、责任、policy、control 和纠正闭环差异 |
| 是否提前写完整状态矩阵 | 不写 | 概要层只写主迁移和红线,详细设计再补所有 guard、错误、幂等和并发 |
| 是否把 projection / report 状态纳入核心 truth | 不纳入 | projection / report 只读可重建,不能成为第二 truth |
| 是否让 Consumer 触发核心业务状态 | 不允许 | 外部事件只能进入 mirror、reference 或 stale marker,正式业务变化必须走 Command |
| 是否用 UI 状态表达 Gate 或 Decision | 不允许 | conversation / dashboard 只显化,不能形成 Governance truth |

---

## 14. 回填草稿

正式 `02-概要设计.md` 后续整理时:

- §9 引用本文件 §4 的状态机边界总览。
- §9 摘录本文件 §5 的状态定义表,必要时压缩为核心状态组表。
- §9 摘录本文件 §6 的 6 个状态流转图,保留图后的关键说明。
- §9 摘录本文件 §7 和 §8 中的允许 / 禁止迁移红线。
- §9 引用本文件 §9 的状态传播关系图,作为 outbox、projection、reference 和 handoff 的概要边界。
- `03-详细设计.md` 必须基于本文件继续展开正式 enum、字段、repository / port、guard、错误、事务、幂等和测试矩阵。

---

## 15. 待确认事项

本步不新增阻塞 Step 10 的待确认事项。详细设计阶段需要继续闭合:

- 每个状态类型的正式 enum variant、初始态、终态和可重入迁移。
- 每个迁移的 actor、basis、expected version、idempotency 和错误映射。
- Derived view affected scope、reference refresh affected view 和 outbox retry / dead-letter 规则。
- Handoff / export marker 的正式状态名和 report result surface。
- Query response 中 freshness、visibility、degraded 和 unavailable 的正式字段。

这些属于详细设计契约闭口,不阻塞概要设计进入异常与边界场景 Step。

---

## 16. 进入下一步条件

- 已明确 `L1-governance` 存在多个正式状态机,并列出承载对象。
- 已给出状态集合、状态含义和是否可进入正常主线。
- 已用 `text` 图说明核心状态流转和状态传播关系。
- 已给出允许迁移和禁止迁移清单。
- 已明确 Query、Consumer、Job 对状态的影响边界。
- 未写入状态机代码实现、完整错误码、数据库列、UI 规则或完整 DTO schema。
- 可以进入 Step 10 “异常与边界场景轮廓”。
