# Step 8. 关键处理流 / 重要函数数据流

> 对应 SOP: `standards/document/概要设计讨论流程_SOP.md` Step 8
> 回填章节: `02-概要设计.md` §8 关键处理流 / 重要函数数据流
> 生成日期: 2026-06-08
> 状态: 已完成

---

## 1. 本步目标

围绕 Step 7 已收敛的 Command、Query、Inbound Event Consumer、Outbound Event 和 Operations Job 骨架,说明关键接口如何经过 inbound、application service、domain object / policy、repository / port、projection、trace、audit 和 outbox 形成可继续详细设计的处理流。

本步不写完整 DTO schema、完整 Rust 函数签名、repository trait、事务脚本、错误码全集、重试参数、SQL、topic 名称或测试用例。

---

## 2. 本步输入

| 输入 | 状态 | 用途 |
|---|---|---|
| `02_hld_step_05_components_boundary.md` | 已完成 | 提供主要组成部分、职责与边界 |
| `02_hld_step_06_key_objects.md` 及五个对象附录 | 已完成 | 提供处理流中允许点名的对象和 policy |
| `02_hld_step_07_api_interface_skeleton.md` | 已完成 | 提供接口骨架和 Command / Query / Event / Job 分类 |
| `01-架构设计.md` §8 / §9 / §10 | 已完成 | 提供依赖方向、数据归属、一致性和通信方式 |
| `00-需求文档.md` §10 / §11 / §14 | 已完成 | 提供业务规则、正文排除、追溯和验收红线 |

---

## 3. SOP 问题回答

### 3.1 每个关键 Command 的写路径如何进入 application service、domain object、repository / outbox?

关键 Command 共用一个治理写入骨架:

1. Inbound adapter 验证 `ActorContext`、`CommandMetadata` 和 idempotency key。
2. Application service 读取或解析 `GovernedSubjectRef`、`GovernanceSourceRef`、snapshot / summary 和当前 truth。
3. Domain policy 判断治理语境、裁决、责任、Policy、Control、Compliance 或 Nonconformity 的不变量。
4. Domain object factory / transition 形成本仓 truth / history 变化。
5. 同一写入边界保存 truth、history / trace、audit、outbox、projection stale marker 和 command result。
6. Outbound event 只从 `GovernanceOutboxRecord` 发布,不得由 publisher 重新计算 truth。

### 3.2 每个关键 Query 如何读取 projection 或只读视图?

Query 只读,必须携带 `ActorContext` 和 `QueryMetadata`。简单 ref 查询可走通用读路径;包含 visibility 裁剪、projection stale / missing / fallback 的查询必须经过 `AuthorizedGovernanceQueryService`、`ReadVisibilityPolicy` 和 `DerivedGovernanceViewState` surface。

### 3.3 每个关键 Inbound Event 如何解析、幂等、转成本地索引或记录?

Inbound Event Consumer 必须先验证 envelope、source event id、schema version、source ref、dedup key 和 trace context。Consumer 只写 snapshot、reference state、pending input marker 或 derived stale marker,不得直接创建 `GovernanceDecision`、`PolicyEffectiveFact`、`ControlApplicability`、`AIIAConclusion`、`SoAConclusion` 或 `NonconformityRecord` truth。

### 3.4 Operations Job 如何基于已持久化事实做发布、重建或对账?

Operations Job 必须从已持久化 truth、trace、outbox、snapshot 或 projection state 出发。`PublishGovernanceOutbox` 影响传播可靠性;`RebuildGovernanceProjections`、`RefreshExternalContextSnapshots` 和 `RunGovernanceReconciliation` 影响查询一致性;trace / archive / external GRC handoff 影响追溯和导出证据。Job 不得静默修正业务 truth。

### 3.5 处理流中点名的关键函数调用,参数分别是什么类型?

本步只点名概要层函数骨架,参数必须带类型名:

| 函数骨架 | 参数类型骨架 | 使用流 |
|---|---|---|
| `GovernanceContextPolicy.assert_context_allowed(...)` | `GovernedSubjectRef subject_ref`;`GovernanceSourceRef source_ref`;`ActorContext actor_context` | context / input |
| `GovernanceContextService.create_context(...)` | `GovernedSubjectRef subject_ref`;`GovernanceSourceRef source_ref`;`CommandMetadata command_metadata` | context / input |
| `DecisionPolicy.assert_decision_allowed(...)` | `Gate gate`;`GovernanceDecision decision`;`EvidenceSummaryRef evidence_ref`;`ActorContext actor_context` | gate / decision |
| `ApprovalResponsibilityPolicy.assert_actor_can_approve(...)` | `ApprovalResponsibility responsibility`;`ActorCapabilitySnapshot actor_snapshot`;`ActorContext actor_context` | approval |
| `PolicyConflictPolicy.assert_resolution_allowed(...)` | `PolicyConflictRecord conflict`;`GovernanceDecision decision`;`ActorContext actor_context` | policy / shared rules |
| `ControlApplicabilityPolicy.assert_control_assessment_allowed(...)` | `GovernanceContext context`;`MethodControlSnapshot control_snapshot`;`EvidenceSummaryRef evidence_ref` | control |
| `ComplianceConclusionPolicy.assert_conclusion_allowed(...)` | `AIIAConclusion aiia_conclusion`;`SoAConclusion soa_conclusion`;`EvidenceSummaryRef evidence_ref` | compliance |
| `NonconformityClosurePolicy.assert_closure_allowed(...)` | `NonconformityRecord nonconformity`;`VerificationResult verification`;`EvidenceSummaryRef evidence_ref` | nonconformity |
| `ReadVisibilityPolicy.assert_can_read(...)` | `GovernanceReadSubjectRef subject_ref`;`ActorContext actor_context` | query |
| `DerivedGovernanceViewPolicy.assert_view_readable(...)` | `DerivedGovernanceViewState view_state`;`QueryMetadata query_metadata` | query / projection |
| `DerivedGovernanceViewPolicy.assert_rebuild_source_allowed(...)` | `GovernanceTraceRecord trace_record`;`DerivedGovernanceViewState view_state` | rebuild |

这些名称是概要层处理流锚点,详细设计必须决定正式签名、返回类型、错误映射和事务切口。

### 3.6 哪些步骤必须在概要设计点名,哪些留给详细设计?

概要设计必须点名入口分类、policy guard、truth / history / trace / outbox / projection stale 的顺序、consumer 不写核心 truth、query no-write、job 不修复 truth。完整 DTO 字段、repository 函数、id generator、optimistic version、dedup result、rollback、retry 和 dead letter 细节留给详细设计。

### 3.7 哪些 P0 Command、Consumer、Job 必须画独立处理流?

本步按“处理流族”画独立流。每个流族覆盖 Step 7 中同构接口,避免 20 多个 Command 机械重复:

- governance context / input command flow
- gate / decision command flow
- approval responsibility command flow
- policy / shared rules command flow
- control / compliance conclusion command flow
- nonconformity corrective command flow
- authorized query flow
- external context consumer flow
- outbox publish job flow
- projection / snapshot / reconciliation maintenance job flow
- trace / archive / external GRC handoff job flow

### 3.8 哪些 Query 只走通用读路径,哪些必须独立处理?

`GetGovernanceContext`、`GetGovernanceInput`、`GetPolicyConflict`、`GetComplianceConclusion` 这类单对象只读可走通用读路径。`ListPendingGovernanceDecisions`、`SearchGovernanceFacts`、`GetGovernanceDashboard`、`GetGovernanceTrace`、`GetControlCoverage` 和 `GetNonconformityStatus` 涉及 visibility、projection、fallback、stale 或 page surface,必须走授权查询处理流。

---

## 4. 通用处理流骨架

### 4.1 通用 Command 写路径

```text
+====================================================================+
|                 Generic Governance Command Write Path               |
+====================================================================+
| Command envelope                                                    |
|   | validate ActorContext + CommandMetadata + idempotency key        |
|   v                                                                 |
| Application service                                                  |
|   | load governed subject / source refs / snapshots / current truth  |
|   v                                                                 |
| Domain policy + domain object                                        |
|   | assert allowed + apply factory / transition                      |
|   v                                                                 |
| Governance truth persistence                                         |
|   | save truth + history + trace + audit + outbox + stale marker     |
|   v                                                                 |
| Command result                                                       |
|   | save result surface + commit / duplicate replay surface          |
+====================================================================+
```

关键说明:

- `GovernanceTruthPolicy` 是统一边界检查,但不替代各业务对象的 policy。
- Command 写路径只能保存本仓 truth、引用、摘要和 marker,不得保存外部正文。
- trace、audit、outbox 和 result 是 accepted truth 的伴随证据,不能由 Query 或 publisher 补造。

### 4.2 通用 Query 只读路径

```text
+====================================================================+
|                    Generic Governance Query Read Path               |
+====================================================================+
| Query request                                                       |
|   | validate ActorContext + QueryMetadata                           |
|   v                                                                 |
| AuthorizedGovernanceQueryService                                    |
|   | ReadVisibilityPolicy.assert_can_read(subject, actor_context)     |
|   v                                                                 |
| Truth summary / projection / trace repository                        |
|   | read only; no refresh, no repair, no outbox                      |
|   v                                                                 |
| View assembler                                                       |
|   | return view / page + visibility + freshness + degraded surface   |
+====================================================================+
```

关键说明:

- Query 不打开写事务,不刷新 external snapshot,不修复 stale projection。
- projection missing、failed、stale 或 not visible 必须显式进入 response surface。
- trace / dashboard / search 查询只读已提交 trace 和 derived view,不得生成审计记录。

---

## 5. 关键接口处理流

#### CreateGovernanceContext / SubmitGovernanceInput 处理流

```text
+====================================================================+
|              Governance Context and Input Command Flow              |
+====================================================================+
| CreateGovernanceContext / SubmitGovernanceInput                     |
|   | ActorContext + CommandMetadata + GovernedSubjectRef              |
|   v                                                                 |
| GovernanceContextService                                            |
|   | resolve GovernanceSourceRef through allowed snapshot / summary   |
|   v                                                                 |
| GovernanceContextPolicy                                             |
|   | assert_context_allowed(GovernedSubjectRef, GovernanceSourceRef,  |
|   |                        ActorContext)                             |
|   v                                                                 |
| GovernanceContext / GovernanceInput                                 |
|   | create / accept / reject / mark pending evidence                 |
|   v                                                                 |
| Repositories + trace + audit + outbox                               |
|   | save context or input; append trace; mark related views stale     |
+====================================================================+
```

关键设计点:

- 外部 process / work / artifact / method / runtime / conversation 只能以 `GovernedSubjectRef`、`GovernanceSourceRef`、snapshot 或 summary 进入。
- `GovernanceInput` 是可裁决输入,不是正式 Decision。
- `UpdateGovernanceInputState` 继承本流,只改变 input readiness / acceptance surface。

#### OpenGovernanceGate / RecordGovernanceDecision 处理流

```text
+====================================================================+
|                    Gate and Decision Command Flow                   |
+====================================================================+
| OpenGovernanceGate / RecordGovernanceDecision                       |
|   | load GovernanceContext + Gate / Decision candidate               |
|   v                                                                 |
| GovernanceDecisionService                                           |
|   | load SharedRuleSet + ApprovalResponsibility + evidence summary   |
|   v                                                                 |
| DecisionPolicy                                                       |
|   | assert_decision_allowed(Gate, GovernanceDecision,                |
|   |                         EvidenceSummaryRef, ActorContext)        |
|   v                                                                 |
| Gate + GovernanceDecision + DecisionRecord                          |
|   | open gate / record outcome / supersede or revoke by record       |
|   v                                                                 |
| Truth + history + outbox                                             |
|   | save gate / decision; append DecisionRecord; enqueue event       |
+====================================================================+
```

关键设计点:

- `Gate` 不等同 process waiting gate 或 conversation card;它是 Governance-owned 裁决语境。
- `GovernanceDecision` 不得原地改写历史;修正、替代、撤销必须通过 `DecisionRecord`。
- `SupersedeGovernanceDecision` 继承本流,但必须加载 current decision 和 next decision intent。

#### AssignApprovalResponsibility / RecordApprovalVote 处理流

```text
+====================================================================+
|              Approval and Responsibility Command Flow               |
+====================================================================+
| AssignApprovalResponsibility / RecordApprovalVote / Delegate        |
|   | GovernanceContextRef + ActorRef / approver requirement           |
|   v                                                                 |
| ApprovalCoordinationService                                         |
|   | resolve ActorCapabilitySnapshot and current ResponsibilityChain  |
|   v                                                                 |
| ApprovalResponsibilityPolicy                                        |
|   | assert_actor_can_approve(ApprovalResponsibility,                 |
|   |                          ActorCapabilitySnapshot, ActorContext)  |
|   v                                                                 |
| ApprovalResponsibility + ResponsibilityChain                        |
|   | assign / vote / delegate / satisfy requirement                   |
|   v                                                                 |
| ResponsibilityTraceRecord + stale marker                            |
|   | save responsibility truth and trace approval queue views         |
+====================================================================+
```

关键设计点:

- 本仓只保存 actor / capability summary,不拥有 identity truth。
- 投票或责任满足不自动形成 `GovernanceDecision`;正式裁决仍走 decision flow。
- 委托不得绕过 shared rules、scope policy 或 approver requirement。

#### ActivatePolicyEffectiveFact / UpdateSharedRuleSet 处理流

```text
+====================================================================+
|                  Policy and Shared Rules Command Flow               |
+====================================================================+
| ActivatePolicyEffectiveFact / UpdateSharedRuleSet / ResolveConflict |
|   | governance scope + MethodPolicySnapshot + rule change intent     |
|   v                                                                 |
| PolicyGovernanceService                                             |
|   | load active policy facts, SharedRuleSet and conflict candidates  |
|   v                                                                 |
| PolicyScopePolicy + PolicyConflictPolicy + SharedRulesPolicy        |
|   | assert scope, priority, conflict and override boundaries         |
|   v                                                                 |
| PolicyEffectiveFact / SharedRuleSet / PolicyConflictRecord          |
|   | activate / suspend / retire / update / resolve                   |
|   v                                                                 |
| PolicyChangeRecord + outbox + projection stale                      |
|   | save policy truth and mark policy effective views stale          |
+====================================================================+
```

关键设计点:

- `PolicyEffectiveFact` 是本仓生效事实,不是 method-library `AIPolicyDef` 正文。
- `SharedRuleSet` 的 scope / priority / override 边界必须先由概要层保留,详细设计再落字段。
- conflict resolve 必须引用正式依据,不得由 runtime cache 或 external GRC 反写。

#### AssessControlApplicability / SubmitComplianceConclusion 处理流

```text
+====================================================================+
|            Control and Compliance Conclusion Command Flow           |
+====================================================================+
| AssessControlApplicability / RecordControlReview / SubmitAIIA/SoA   |
|   | GovernanceContextRef + MethodControlSnapshot + EvidenceSummary   |
|   v                                                                 |
| ControlComplianceService                                            |
|   | load control truth, artifact/evidence summary and decision refs  |
|   v                                                                 |
| ControlApplicabilityPolicy + ComplianceConclusionPolicy             |
|   | assert control assessment and conclusion approval boundaries      |
|   v                                                                 |
| ControlApplicability / ControlReview / AIIAConclusion / SoAConclusion|
|   | assess / review / submit / approve conclusion                    |
|   v                                                                 |
| ControlChangeRecord / ComplianceConclusionRecord + outbox           |
|   | save conclusion truth; mark coverage and dashboard views stale   |
+====================================================================+
```

关键设计点:

- AIIA / SoA 正文归 artifact;Governance 只保存结论、引用、摘要和批准关系。
- Control applicability / exclusion / review 必须可追溯到 method control summary 和 evidence summary。
- `ApproveComplianceConclusion` 继承本流,但必须引用正式 `GovernanceDecision`。

#### RaiseNonconformity / VerifyNonconformity 处理流

```text
+====================================================================+
|                 Nonconformity Corrective Command Flow              |
+====================================================================+
| RaiseNonconformity / PlanCorrectiveAction / VerifyNonconformity     |
|   | GovernanceContextRef + severity / cause / evidence summary       |
|   v                                                                 |
| NonconformityService                                                |
|   | load nonconformity, corrective actions and verification state    |
|   v                                                                 |
| NonconformityClosurePolicy                                          |
|   | assert_closure_allowed(NonconformityRecord, VerificationResult,  |
|   |                        EvidenceSummaryRef)                       |
|   v                                                                 |
| NonconformityRecord + CorrectiveAction + VerificationResult         |
|   | raise / confirm cause / plan / complete / verify / close          |
|   v                                                                 |
| NonconformityChangeRecord + outbox + projection stale               |
|   | save corrective loop evidence and status view marker             |
+====================================================================+
```

关键设计点:

- observability alert、work blocker 或 bug 只能作为 source / evidence,不直接成为 `NonconformityRecord` truth。
- 关闭必须基于 `VerificationResult`,不能因为 corrective action 完成而自动关闭。
- corrective action 可引用 work context,但不创建或修改 WorkItem truth。

#### AuthorizedGovernanceQuery 处理流

```text
+====================================================================+
|                    Authorized Governance Query Flow                 |
+====================================================================+
| Query request                                                       |
|   | ActorContext + QueryMetadata + GovernanceReadSubjectRef          |
|   v                                                                 |
| AuthorizedGovernanceQueryService                                    |
|   | ReadVisibilityPolicy.assert_can_read(GovernanceReadSubjectRef,   |
|   |                                      ActorContext)               |
|   v                                                                 |
| Projection / truth / trace read                                     |
|   | load view, page, trace records, reference state and view state   |
|   v                                                                 |
| DerivedGovernanceViewPolicy                                        |
|   | assert_view_readable(DerivedGovernanceViewState, QueryMetadata)  |
|   v                                                                 |
| Response assembler                                                   |
|   | return body-free view + visibility / degraded / freshness marker |
+====================================================================+
```

关键设计点:

- dashboard、decision queue、policy effective view、control coverage、nonconformity status、trace 和 search 都走本流。
- not visible、missing、stale、failed 和 unresolved reference 必须出现在 response surface。
- Query 不写 audit、outbox、snapshot、projection 或 idempotency result。

#### ExternalContextConsumer 处理流

```text
+====================================================================+
|                   External Context Consumer Flow                    |
+====================================================================+
| Inbound event envelope                                              |
|   | validate source event id + schema version + dedup key            |
|   v                                                                 |
| Consumer application service                                        |
|   | map event to allowed summary / snapshot / reference marker       |
|   v                                                                 |
| External context mirror support                                     |
|   | save ActorCapabilitySnapshot / MethodPolicySnapshot /            |
|   | MethodControlSnapshot / EvidenceSummaryRef / Process or Work ref |
|   v                                                                 |
| ReferenceResolutionState + stale markers                            |
|   | mark resolved / stale / unresolved; mark affected views stale     |
|   v                                                                 |
| Consumer receipt                                                     |
|   | record accepted / duplicate / delayed / rejected disposition     |
+====================================================================+
```

关键设计点:

- Consumer 写入本地 mirror / marker,不直接形成 Decision、Policy、Control、Compliance 或 Nonconformity truth。
- unsupported version、dedup duplicate、source unavailable 和 body rejected 的完整处置留给详细设计。
- affected view 范围必须由详细设计定义,不能在实现侧临时拼 projection identity。

#### PublishGovernanceOutbox 处理流

```text
+====================================================================+
|                     Publish Governance Outbox Flow                  |
+====================================================================+
| PublishGovernanceOutbox job input                                  |
|   | JobMetadata + outbox page / range                               |
|   v                                                                 |
| GovernanceOutboxService                                             |
|   | list pending GovernanceOutboxRecord                             |
|   v                                                                 |
| BusEventPort                                                        |
|   | publish payload snapshot from GovernanceOutboxRecord             |
|   v                                                                 |
| Outbox publication marker                                           |
|   | mark published / failed / retry pending                          |
|   v                                                                 |
| Job report                                                          |
|   | record scanned / published / failed refs and duplicate replay    |
+====================================================================+
```

关键设计点:

- publisher 只能复制 outbox payload snapshot,不得按 current truth 重新构造 payload。
- 单条发布失败不回滚已成立 Governance truth。
- duplicate job 必须返回可审查的 stored job report surface。

#### Rebuild / Refresh / Reconcile 维护处理流

```text
+====================================================================+
|             Projection, Snapshot and Reconciliation Job Flow        |
+====================================================================+
| Rebuild / Refresh / Reconcile job input                             |
|   | JobMetadata + projection set / reference scope / reconcile scope |
|   v                                                                 |
| GovernanceDerivedMaintenanceService                                 |
|   | load committed truth, trace, snapshots or reference states       |
|   v                                                                 |
| DerivedGovernanceViewPolicy                                         |
|   | assert_rebuild_source_allowed(GovernanceTraceRecord,             |
|   |                               DerivedGovernanceViewState)        |
|   v                                                                 |
| Projection / snapshot / reconciliation stores                       |
|   | replace derived views / refresh markers / save report            |
|   v                                                                 |
| Job report + outbox optional marker                                 |
|   | expose changed views, unresolved refs, issues and failures       |
+====================================================================+
```

关键设计点:

- rebuild 只从 committed Governance truth / trace / safe summary 构造 projection。
- refresh 只更新 reference / snapshot / stale marker,不改核心 truth。
- reconciliation 只报告 drift 或写 derived marker,不直接修复业务对象。

#### Trace / Archive / External GRC Handoff 处理流

```text
+====================================================================+
|                 Trace, Archive and External GRC Handoff Flow        |
+====================================================================+
| Handoff / export job input                                          |
|   | JobMetadata + trace scope / archive scope / external target ref  |
|   v                                                                 |
| GovernanceTraceService / DerivedMaintenanceService                  |
|   | load GovernanceTraceRecord, GovernanceAuditTrail and safe refs   |
|   v                                                                 |
| Handoff / export port                                               |
|   | prepare observability handoff, archive material or GRC export    |
|   v                                                                 |
| Handoff / export marker                                             |
|   | save prepared / delivered / failed marker and optional outbox    |
|   v                                                                 |
| Job report                                                          |
|   | record package refs, target refs, failed refs and review surface |
+====================================================================+
```

关键设计点:

- archive package、observability ledger 和 external GRC record 都不是 Governance truth。
- handoff / export 只能保存 marker、receipt、package ref 或 target ref,不得保存外部正文。
- external GRC 只能消费或导出 Governance facts,不得反向定义 Governance state。

---

## 6. 接口到处理流族映射

| 接口组 | 处理流族 | 说明 |
|---|---|---|
| `CreateGovernanceContext`、`SubmitGovernanceInput`、`UpdateGovernanceInputState` | Context / input command flow | input state update 只改变 input readiness / acceptance surface |
| `OpenGovernanceGate`、`RecordGovernanceDecision`、`SupersedeGovernanceDecision` | Gate and decision command flow | supersede / revoke 通过 decision record 表达历史 |
| `AssignApprovalResponsibility`、`RecordApprovalVote`、`DelegateApprovalResponsibility` | Approval responsibility command flow | 不自动形成 formal decision |
| `ActivatePolicyEffectiveFact`、`UpdatePolicyEffectiveFactState`、`UpdateSharedRuleSet`、`ResolvePolicyConflict` | Policy and shared rules command flow | conflict / override / scope 留给详细设计定字段 |
| `AssessControlApplicability`、`RecordControlReview`、`SubmitAIIAConclusion`、`SubmitSoAConclusion`、`ApproveComplianceConclusion` | Control and compliance command flow | artifact / evidence / AIIA / SoA 正文排除 |
| `RaiseNonconformity`、`ConfirmNonconformityCause`、`PlanCorrectiveAction`、`CompleteCorrectiveAction`、`VerifyNonconformity` | Nonconformity corrective command flow | verification 通过后才允许关闭 |
| 14 个 Query | Authorized query flow 或 generic query read path | 单对象读取可用通用读路径;projection / visibility / trace / dashboard 查询走授权流 |
| 9 个 Inbound Event Consumer | External context consumer flow | 只写 mirror / marker / stale,不写核心 truth |
| 12 个 Outbound Event | Publish outbox flow | outbound event 从 outbox payload snapshot 发布 |
| 7 个 Operations Job | Outbox publish、maintenance、handoff 三个 job flow | 按传播可靠性、查询一致性、追溯交接分流 |

---

## 7. 当前文档问题诊断

| 旧 `02-概要设计.md` 内容 | 问题 | 本轮处理 |
|---|---|---|
| Gate / Decision / Request 解释没有处理流边界 | 详细设计会自行补 command 编排和 truth / outbox 顺序 | 本步给出 command 写路径和 decision / approval / policy / control / nonconformity 流 |
| 外部事件、query、job 与 command 混合叙述 | 容易让 consumer / query / job 直接改写核心 truth | 本步明确 consumer 只写 mirror / marker,query no-write,job no truth repair |
| report、dashboard、archive、external GRC 容易被看成第二 truth | 会让派生或导出反写 Governance state | 本步把它们放入 derived / handoff / export 维护流 |
| 旧文档缺少函数参数类型骨架 | 不满足概要 SOP 对处理流函数参数的约束 | 本步点名关键函数骨架并给出参数类型 |

---

## 8. 改动前后对比

| 维度 | 改动前 | 改动后 |
|---|---|---|
| 处理流粒度 | 业务概念解释 | command / query / consumer / job 流族 |
| 写入边界 | 未明确 truth、history、trace、outbox 顺序 | 明确 accepted truth 伴随 trace / audit / outbox / result |
| 外部事实 | 容易进入核心裁决 | 只能进入 snapshot、reference、pending input 或 stale marker |
| 查询 | 未区分读取和维护 | Query 明确 no-write、visibility、degraded 和 freshness surface |
| 后台任务 | report / export / handoff 混入业务主线 | Job 分为 publish、maintenance、handoff,且不修复业务 truth |

---

## 9. 设计取舍

| 取舍 | 结论 | 理由 |
|---|---|---|
| 是否为每个 Command 单独画完全重复的图 | 不逐个机械画,按流族覆盖 | Step 7 command 数量较多,概要层应保留差异点并避免重复噪声 |
| 是否把所有 Query 单独画图 | 不全部画 | 简单只读走通用读路径;带 visibility / projection / trace 的 query 走授权查询流 |
| 是否在 Consumer 中直接创建 GovernanceInput | 仅允许写 pending input marker,正式 input command 另行成立 | 防止外部事件绕过 actor / policy / idempotency 写核心 truth |
| 是否让 maintenance job 修复 truth | 不允许 | 符合架构与约束:job 只能维护派生、快照、报告和交接 |
| 是否提前定义 transaction / repository trait | 不定义 | 留给 `03-详细设计.md` |

---

## 10. 回填草稿

正式 `02-概要设计.md` 后续整理时:

- §8 引用本文件 §4 的通用 command / query 处理流。
- §8 摘录本文件 §5 的 11 个关键处理流图,必要时压缩图后说明。
- §8 引用本文件 §6 的接口到处理流族映射,避免正式文档逐接口重复同一图。
- 详细设计必须基于本文件继续定义正式 DTO、函数签名、repository / port、事务、异常分支、幂等、版本和测试切口。

---

## 11. 待确认事项

本步不新增阻塞 Step 9 的待确认事项。详细设计阶段仍需逐接口补齐:

- 每个 Command 的正式 DTO 字段、expected version、id generator 和 stored result surface。
- Inbound Event 的 unsupported version、quarantine、delayed、dead-letter 和 duplicate replay 语义。
- Projection / snapshot refresh 的 affected view 读取面和 stale marker 来源。
- Handoff / external GRC export 的 marker、receipt、failed refs 和 report schema。

这些属于 `03-详细设计.md` 契约闭口,不阻塞概要设计进入状态机 Step。

---

## 12. 进入下一步条件

- 已明确关键接口如何通过主要对象和主要组成部分形成处理流。
- 已覆盖 Command、Query、Inbound Event Consumer、Outbound Event 和 Operations Job 的主路径。
- 已点名关键函数骨架且参数包含类型名。
- 已说明未逐接口重复画图的取舍。
- 未写入完整 DTO schema、repository trait、事务脚本、错误码全集或配置 / 测试细节。
- 可以进入 Step 9 “状态机与状态流转”。
