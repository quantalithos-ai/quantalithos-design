# Step 5. 主要组成部分、职责与边界

> 对应 SOP: `standards/document/概要设计讨论流程_SOP.md` Step 5
> 回填章节: `02-概要设计.md` §5 主要组成部分、职责与边界
> 生成日期: 2026-06-08
> 状态: 已完成

---

## 1. 本步目标

在 Step 4 已经区分业务主要组成部分与实现分层的基础上,收稳 `L1-governance` 的主要组成部分、各自职责、不承担职责、包含的代码主体 / 模块和对象发现线索。

本步建立 Step 6 的对象候选池,但不展开对象字段、状态集合、成员函数、工厂函数、接口 schema、repository 函数或事务细节。

---

## 2. 本步输入

| 输入 | 状态 | 用途 |
|---|---|---|
| `02_hld_step_03_constraints.md` | 已完成 | 提供 Governance truth、正文排除、派生只读、同步 / 异步 / 后台分工和配置不可越界约束 |
| `02_hld_step_04_code_subject_framework.md` | 已完成 | 提供业务主要组成部分、代码主体骨架和实现分层区别 |
| `01-架构设计.md` §4 / §6 / §8 / §9 / §10 | 已完成 | 提供职责边界、上下文划分、依赖方向、数据所有权和通信方式 |
| 旧 `02-概要设计.md` | 未按最新 SOP 校准 | 作为旧概念线索和串层问题诊断输入 |

---

## 3. SOP 问题回答

### 3.1 当前概要设计层面,本仓应被划分为哪些主要组成部分?

当前概要设计层面,`L1-governance` 划分为 10 个主要组成部分:

1. `Governance truth core`
2. `Governance context and input management`
3. `Gate and decision management`
4. `Approval and responsibility management`
5. `Policy and shared rules management`
6. `Control and compliance conclusion management`
7. `Nonconformity corrective loop`
8. `Governance consumption and traceability`
9. `Derived maintenance and reconciliation`
10. `External context mirror support`

这些是业务结构主语,不是代码目录、外部系统、类名或函数名。每个主要组成部分后续都可以跨越 Inbound、Application Services、Domain Model、Ports、Persistence、Projection、Outbox、Operations 等实现分层。

### 3.2 每个主要组成部分分别承担什么职责?

| 组成部分 | 核心职责 | 主要代码主体 | 不承担什么 |
|---|---|---|---|
| `Governance truth core` | 保护治理决策与治理控制 truth 的统一边界、核心不变量、追溯和 outbox 成立口径 | `GovernanceTruthPolicy`、`GovernanceTruthRepository`、`GovernanceTraceRepository`、`GovernanceOutboxRepository`、`GovernanceAuditTrail` | 不定义 process、work、artifact、conversation、identity、method-library、runtime、observability、archive 或 external GRC truth |
| `Governance context and input management` | 让治理语境、适用对象、触发来源和可裁决输入正式成立 | `GovernanceContextService`、`GovernanceContext`、`GovernanceInput`、`GovernanceContextPolicy`、`GovernanceInputRepository` | 不拥有外部对象生命周期、正文、UI 请求正文或 runtime execution |
| `Gate and decision management` | 形成 Gate、正式 Decision、裁决结果、替代 / 修正和不可原地改写历史 | `GovernanceDecisionService`、`Gate`、`GovernanceDecision`、`DecisionRecord`、`DecisionPolicy`、`GovernanceDecisionRepository` | 不等同 process waiting state、conversation card、work lifecycle、runtime cache 或 report row |
| `Approval and responsibility management` | 表达审批、投票、授权、责任链、替代裁决和 risk owner 语境 | `ApprovalCoordinationService`、`ApprovalResponsibility`、`ApproverRequirement`、`ResponsibilityChain`、`ApprovalResponsibilityPolicy` | 不拥有 GlobalMember 生命周期、role truth、平台认证授权或工具权限 truth |
| `Policy and shared rules management` | 维护 Policy 生效事实、scope、priority、conflict、override 和 shared rules | `PolicyGovernanceService`、`PolicyEffectiveFact`、`SharedRuleSet`、`PolicyConflictRecord`、`SharedRulesPolicy`、`PolicyRepository` | 不拥有 AIPolicyDef / method 正文、runtime policy cache、capability whitelist 或 project local config truth |
| `Control and compliance conclusion management` | 维护 Control 适用 / 实施 / 复核事实、AIIA / SoA 治理结论和批准 / 排除口径 | `ControlComplianceService`、`ControlApplicability`、`ControlReview`、`AIIAConclusion`、`SoAConclusion`、`ComplianceConclusionPolicy` | 不保存 ControlDefinition、standard、artifact、evidence、AIIA / SoA 文档或 archive package 正文 |
| `Nonconformity corrective loop` | 维护不符合、原因、纠正、复验、关闭和责任语境 | `NonconformityService`、`NonconformityRecord`、`CorrectiveAction`、`VerificationResult`、`NonconformityClosurePolicy` | 不等同 bug、work blocker、runtime failure、observability alert 或维护备注 |
| `Governance consumption and traceability` | 提供授权查询、治理事实消费、审计复盘、trace / observability / archive / external GRC 交接 | `AuthorizedGovernanceQueryService`、`GovernanceTraceService`、`GovernanceTraceRecord`、`GovernanceAuditTrail`、`ArchiveHandoffPort` | 不拥有 workspace 聚合 truth、observability ledger、archive package 正文或 external GRC truth |
| `Derived maintenance and reconciliation` | 维护投影重建、报告、dashboard、external GRC export 准备、对账和维护证据 | `GovernanceDerivedMaintenanceService`、`GovernanceProjectionRebuildJob`、`ExternalContextSnapshotRefreshJob`、`GovernanceReconciliationJob`、`DerivedGovernanceViewState` | 不生成新业务事实,不批准 / 关闭 / 覆盖 Governance truth |
| `External context mirror support` | 承载外部引用、safe summary、snapshot、stale / unresolved / invalid marker 和本地影子索引 | `ExternalContextSnapshotRepository`、`ReferenceResolutionState`、`IdentityActorPort`、`MethodPolicyDefinitionPort`、`WorkContextPort`、`ArtifactEvidencePort` | 不保存外部正文,不替代来源仓 lifecycle、definition truth、execution truth 或 evidence body |

### 3.3 哪些内容虽然相关,但必须由相邻部分或边界外能力承担?

| 相关内容 | 归属 | 本仓正确处理方式 |
|---|---|---|
| GlobalMember、Actor、Role、认证授权和成员生命周期 | `L1-identity` / `L0-core` | 保存 actor / member / role 引用、责任语境和可承担性摘要 |
| ProcessInstance、Activity、waiting gate、checkpoint、recovery | `L1-process` | 保存 process / activity / waiting / recovery 语境引用、裁决回链或摘要 |
| Project、WorkItem、Iteration、dependency、blocker、项目成员 | `L1-work` | 保存被治理对象引用、工作语境摘要、Policy / Gate / Control 消费回链 |
| Artifact、Evidence、baseline、AIIA / SoA 正文、archive package 正文 | `L1-artifact` / `L4-archive` | 保存正文来源引用、证据摘要、批准结论和 archive handoff 材料 |
| conversation fact、Gate 显化卡片、review display、聊天 UI 状态 | `L1-conversation` / 产品入口 | 保存 conversation context ref、显化回链和消费标记 |
| AIPolicyDef、ControlDefinition、method、template、standard body | `L3-method-library` | 保存定义 ref、版本、safe summary 和生效 / 适用结论 |
| runtime execution、tool invocation、policy cache、capability registry | `L2-runtime` / `L3-capability-hub` | 保存运行反馈摘要、自动化边界判断输入和正式 Policy 消费结论 |
| observability ledger、metrics、trace store、alert stream | `L4-observability` | 保存治理追溯事实、观测 handoff ref 或 alert summary |
| workspace dashboard、console admin view、external GRC record | `L1-workspace` / `L5-console` / external GRC | 只消费或导出 Governance facts,不得反向定义 truth |

### 3.4 哪些候选对象必须进入 Step 6 独立成节展开?

Step 6 必须从本步对象候选池中正式筛选并独立展开以下对象候选:

- truth / state:`GovernanceContext`、`GovernanceInput`、`Gate`、`GovernanceDecision`、`ApprovalResponsibility`、`ResponsibilityChain`、`PolicyEffectiveFact`、`SharedRuleSet`、`ControlApplicability`、`ControlReview`、`AIIAConclusion`、`SoAConclusion`、`NonconformityRecord`、`CorrectiveAction`、`VerificationResult`、`DerivedGovernanceViewState`、`ReferenceResolutionState`
- policy / invariant:`GovernanceTruthPolicy`、`GovernanceContextPolicy`、`DecisionPolicy`、`ApprovalResponsibilityPolicy`、`PolicyConflictPolicy`、`SharedRulesPolicy`、`PolicyScopePolicy`、`ControlApplicabilityPolicy`、`ComplianceConclusionPolicy`、`NonconformityClosurePolicy`、`ReadVisibilityPolicy`、`DerivedGovernanceViewPolicy`
- projection / read model:`GovernanceDashboardView`、`DecisionSummaryView`、`PolicyEffectiveView`、`ControlCoverageView`、`NonconformityStatusView`、`GovernanceReconciliationReport`
- reference / boundary:`GovernedSubjectRef`、`GovernanceSourceRef`、`ActorCapabilitySnapshot`、`MethodPolicySnapshot`、`MethodControlSnapshot`、`EvidenceSummaryRef`、`ProcessGovernanceContextRef`、`WorkGovernanceContextRef`、`RuntimeSignalRef`
- audit / history:`GovernanceTraceRecord`、`GovernanceAuditTrail`、`GovernanceOutboxRecord`、`DecisionRecord`、`ResponsibilityTraceRecord`、`PolicyChangeRecord`、`ControlChangeRecord`、`ComplianceConclusionRecord`、`NonconformityChangeRecord`

Repository、port、adapter、trigger、DTO、HTTP body、CloudEvent schema、database table 和 job runner 不在 Step 6 当领域对象展开;它们后续进入 Step 7、Step 8 或详细设计。

---

## 4. 结构化中间产物

### 4.1 对象发现维度表

| 组成部分 | Truth / State | Policy / Invariant | Projection / Read model | Reference / Boundary | Audit / History | Step 6 必须独立展开 |
|---|---|---|---|---|---|---|
| `Governance truth core` | unified governance truth state 线索 | `GovernanceTruthPolicy` | - | - | `GovernanceAuditTrail`、`GovernanceOutboxRecord` | `GovernanceTruthPolicy`、`GovernanceAuditTrail`、`GovernanceOutboxRecord` |
| `Governance context and input management` | `GovernanceContext`、`GovernanceInput` | `GovernanceContextPolicy` | context summary 线索 | `GovernedSubjectRef`、`GovernanceSourceRef` | input accepted / rejected 线索 | `GovernanceContext`、`GovernanceInput`、`GovernanceContextPolicy`、`GovernedSubjectRef`、`GovernanceSourceRef` |
| `Gate and decision management` | `Gate`、`GovernanceDecision` | `DecisionPolicy` | `DecisionSummaryView` | process / work / conversation refs | `DecisionRecord` | `Gate`、`GovernanceDecision`、`DecisionPolicy`、`DecisionRecord`、`DecisionSummaryView` |
| `Approval and responsibility management` | `ApprovalResponsibility`、`ResponsibilityChain` | `ApprovalResponsibilityPolicy` | approver queue 线索 | `ActorCapabilitySnapshot` | `ResponsibilityTraceRecord` | `ApprovalResponsibility`、`ResponsibilityChain`、`ApprovalResponsibilityPolicy`、`ActorCapabilitySnapshot`、`ResponsibilityTraceRecord` |
| `Policy and shared rules management` | `PolicyEffectiveFact`、`SharedRuleSet` | `PolicyConflictPolicy`、`SharedRulesPolicy`、`PolicyScopePolicy` | `PolicyEffectiveView` | `MethodPolicySnapshot` | `PolicyChangeRecord` | `PolicyEffectiveFact`、`SharedRuleSet`、`PolicyConflictPolicy`、`SharedRulesPolicy`、`PolicyScopePolicy`、`MethodPolicySnapshot` |
| `Control and compliance conclusion management` | `ControlApplicability`、`ControlReview`、`AIIAConclusion`、`SoAConclusion` | `ControlApplicabilityPolicy`、`ComplianceConclusionPolicy` | `ControlCoverageView` | `MethodControlSnapshot`、`EvidenceSummaryRef` | `ControlChangeRecord`、`ComplianceConclusionRecord` | `ControlApplicability`、`ControlReview`、`AIIAConclusion`、`SoAConclusion`、`ControlApplicabilityPolicy`、`ComplianceConclusionPolicy` |
| `Nonconformity corrective loop` | `NonconformityRecord`、`CorrectiveAction`、`VerificationResult` | `NonconformityClosurePolicy` | `NonconformityStatusView` | evidence / work / actor refs | `NonconformityChangeRecord` | `NonconformityRecord`、`CorrectiveAction`、`VerificationResult`、`NonconformityClosurePolicy`、`NonconformityChangeRecord` |
| `Governance consumption and traceability` | trace state 线索 | `ReadVisibilityPolicy` | governance query / report 线索 | archive / observability / external GRC refs | `GovernanceTraceRecord` | `GovernanceTraceRecord`、`ReadVisibilityPolicy` |
| `Derived maintenance and reconciliation` | `DerivedGovernanceViewState` | `DerivedGovernanceViewPolicy` | `GovernanceDashboardView`、`GovernanceReconciliationReport` | projection source refs | rebuild / reconciliation history 线索 | `DerivedGovernanceViewState`、`DerivedGovernanceViewPolicy`、`GovernanceDashboardView`、`GovernanceReconciliationReport` |
| `External context mirror support` | `ReferenceResolutionState` | reference validity 线索 | external context projection 线索 | `ActorCapabilitySnapshot`、`MethodPolicySnapshot`、`MethodControlSnapshot`、`ProcessGovernanceContextRef`、`WorkGovernanceContextRef`、`RuntimeSignalRef` | refresh history 线索 | `ReferenceResolutionState`、`ActorCapabilitySnapshot`、`MethodPolicySnapshot`、`MethodControlSnapshot` |

### 4.2 各部分交互总图

```text
+====================================================================+
|                    L1-governance component flow                    |
+====================================================================+
|                                                                    |
|  Governance context and input management                           |
|       | establishes governed context and decisionable input         |
|       v                                                            |
|  +------------------------+        +-----------------------------+  |
|  | Governance truth core  |<-------| Gate and decision management|  |
|  +-----------+------------+        +--------------+--------------+  |
|              ^                                    |                 |
|              |                                    v                 |
|              |                         Approval and responsibility  |
|              |                                    |                 |
|              +------ Policy and shared rules -----+                 |
|              |                                    |                 |
|              +------ Control and compliance ------+                 |
|              |                                    |                 |
|              +------ Nonconformity corrective ----+                 |
|                                                                   |
|  Governance consumption and traceability ---- handoff ----> sinks   |
|              ^                                                     |
|              | read / rebuild                                      |
|  Derived maintenance and reconciliation <---- External mirrors      |
|                                                                    |
+====================================================================+
```

关键说明:

- 图只表达主要组成部分之间的大体交互和交接方向,不表达协议字段、函数调用链、详细时序或数据库结构。
- `Governance truth core` 是统一 truth 边界,但业务操作由 context / input、decision、approval、policy、control、nonconformity、trace 和 derived support 分别承接。
- Derived maintenance 和 External context mirrors 只能支撑读取、解释、对账、刷新和降级显示,不能反写真相。
- 图中 sinks 表示 SDK、conversation、workspace、observability、archive、external GRC 等消费或交接方向,不是本仓内部主要组成部分。

---

## 5. 各主要组成部分

### 5.1 Governance truth core

#### 5.1.1 本部分职责

维护治理决策与治理控制 truth 的统一边界、不变量、一致性、审计和 outbox 成立口径。

#### 5.1.2 本部分包含的代码主体 / 模块

| 代码主体 / 模块 | 类型 | 作用 | 后续展开位置 |
|---|---|---|---|
| `GovernanceTruthPolicy` | policy | 判断治理事实写入、传播和派生边界是否守住 truth 归属 | Step 6 |
| `GovernanceTruthRepository` | persistence | 保存本仓核心 truth 的统一持久化入口骨架 | 详细设计 |
| `GovernanceTraceRepository` | persistence / audit | 保存治理追溯记录和审计复盘线索 | Step 7 / 详细设计 |
| `GovernanceOutboxRepository` | persistence / outbox | 保存已成立 Governance fact 的传播意图 | Step 7 / 详细设计 |
| `GovernanceAuditTrail` | audit | 承载关键变化、判断和维护动作的审计线索 | Step 6 |
| `GovernanceOutboxRecord` | event record | 记录 truth change 到 outbound event / handoff 的本地证据 | Step 6 |

#### 5.1.3 本部分对象发现线索

| 维度 | 候选对象 | Step 6 展开要求 |
|---|---|---|
| Policy / Invariant | `GovernanceTruthPolicy` | Step 6 独立成节 |
| Audit / History | `GovernanceAuditTrail` | Step 6 独立成节 |
| Audit / History | `GovernanceOutboxRecord` | Step 6 独立成节 |

#### 5.1.4 本部分不承担什么

不定义 process、work、artifact、conversation、identity、method-library、runtime、observability、archive、workspace、console 或 external GRC 的 truth、正文、生命周期或产品状态。

#### 5.1.5 与其他部分的接缝

接收 context、decision、approval、policy、control、compliance、nonconformity 等部分的已成立变化,为 consumption、traceability、derived maintenance、external GRC export 和 outbox 提供统一来源。

### 5.2 Governance context and input management

#### 5.2.1 本部分职责

让 actor、scope、适用对象、治理目的、触发来源、证据来源和可裁决输入形成正式治理语境。

#### 5.2.2 本部分包含的代码主体 / 模块

| 代码主体 / 模块 | 类型 | 作用 | 后续展开位置 |
|---|---|---|---|
| `GovernanceContextService` | application service | 编排治理语境创建、输入收束和可裁决性检查 | Step 8 |
| `GovernanceContext` | domain object | 表达可裁决治理语境和被治理对象锚点 | Step 6 |
| `GovernanceInput` | domain object | 表达外部触发、周期复核、风险信号或相邻仓请求 | Step 6 |
| `GovernanceContextPolicy` | policy | 判断输入是否有足够 actor、scope、subject、source 和 purpose | Step 6 |
| `GovernanceInputRepository` | persistence | 保存输入收束结果和可裁决状态 | 详细设计 |
| `GovernanceSourceResolverPort` | port | 解析外部来源 ref / summary / snapshot | Step 7 / 详细设计 |

#### 5.2.3 本部分对象发现线索

| 维度 | 候选对象 | Step 6 展开要求 |
|---|---|---|
| Truth / State | `GovernanceContext` | Step 6 独立成节 |
| Truth / State | `GovernanceInput` | Step 6 独立成节 |
| Policy / Invariant | `GovernanceContextPolicy` | Step 6 独立成节 |
| Reference / Boundary | `GovernedSubjectRef`、`GovernanceSourceRef` | Step 6 独立成节 |

#### 5.2.4 本部分不承担什么

不拥有 process、work、artifact、conversation、runtime、identity 或 method-library 对象生命周期;不保存外部请求正文、artifact body、evidence body、conversation message body 或 runtime execution body。

#### 5.2.5 与其他部分的接缝

向 Gate and decision、Policy and shared rules、Control and compliance、Nonconformity 提供同一治理语境;通过 External context mirror support 读取外部引用、snapshot 和解析状态。

### 5.3 Gate and decision management

#### 5.3.1 本部分职责

形成关键节点 Gate、正式治理 Decision、裁决结果、裁决依据、替代 / 修正关系和不可原地改写历史。

#### 5.3.2 本部分包含的代码主体 / 模块

| 代码主体 / 模块 | 类型 | 作用 | 后续展开位置 |
|---|---|---|---|
| `GovernanceDecisionService` | application service | 编排 Gate 打开、裁决、拒绝、豁免、替代或修正 | Step 8 |
| `Gate` | domain object | 表达等待正式治理裁决的关键节点语义 | Step 6 |
| `GovernanceDecision` | domain object | 表达正式治理裁决结论 | Step 6 |
| `DecisionRecord` | audit / history | 记录裁决变化、依据和修正 / 替代关系 | Step 6 |
| `DecisionPolicy` | policy | 判断裁决是否满足责任、Policy、evidence 和 shared rules 要求 | Step 6 |
| `GovernanceDecisionRepository` | persistence | 保存 Gate / Decision truth | 详细设计 |

#### 5.3.3 本部分对象发现线索

| 维度 | 候选对象 | Step 6 展开要求 |
|---|---|---|
| Truth / State | `Gate` | Step 6 独立成节 |
| Truth / State | `GovernanceDecision` | Step 6 独立成节 |
| Policy / Invariant | `DecisionPolicy` | Step 6 独立成节 |
| Audit / History | `DecisionRecord` | Step 6 独立成节 |
| Projection / Read model | `DecisionSummaryView` | Step 6 独立成节 |

#### 5.3.4 本部分不承担什么

不等同 process waiting state、work lifecycle、conversation card、runtime cache、workspace action 或 report row;不自行生成 identity role 或 evidence 正文。

#### 5.3.5 与其他部分的接缝

消费 Governance context、Approval responsibility、Policy / shared rules、Control 语境和外部 evidence summary;向 process、work、artifact、conversation、runtime、workspace 等消费方输出正式 decision fact 或 outbox。

### 5.4 Approval and responsibility management

#### 5.4.1 本部分职责

表达审批、投票、授权、责任链、替代裁决责任、risk owner 和责任变化可追溯语境。

#### 5.4.2 本部分包含的代码主体 / 模块

| 代码主体 / 模块 | 类型 | 作用 | 后续展开位置 |
|---|---|---|---|
| `ApprovalCoordinationService` | application service | 编排审批责任建立、投票、授权校验和责任变更 | Step 8 |
| `ApprovalResponsibility` | domain object | 表达单个治理语境中的审批 / 授权责任 | Step 6 |
| `ApproverRequirement` | domain object / value object | 表达责任要求、可承担条件和替代限制 | Step 6 |
| `ResponsibilityChain` | domain object | 表达多责任人、替代、升级和 risk owner 链路 | Step 6 |
| `ApprovalResponsibilityPolicy` | policy | 判断责任承担、替代、投票和授权是否允许 | Step 6 |
| `IdentityActorPort` | port | 读取 actor / member / role / capability 摘要 | Step 7 / 详细设计 |

#### 5.4.3 本部分对象发现线索

| 维度 | 候选对象 | Step 6 展开要求 |
|---|---|---|
| Truth / State | `ApprovalResponsibility` | Step 6 独立成节 |
| Truth / State | `ResponsibilityChain` | Step 6 独立成节 |
| Policy / Invariant | `ApprovalResponsibilityPolicy` | Step 6 独立成节 |
| Reference / Boundary | `ActorCapabilitySnapshot` | Step 6 独立成节 |
| Audit / History | `ResponsibilityTraceRecord` | Step 6 独立成节 |

#### 5.4.4 本部分不承担什么

不拥有 GlobalMember、Actor、Role、认证授权、platform permission、tool permission 或 identity lifecycle truth。

#### 5.4.5 与其他部分的接缝

为 Gate / Decision、Policy override、Control review、AIIA / SoA approval 和 Nonconformity closure 提供责任语境;通过 External context mirror support 消费 identity / capability snapshot。

### 5.5 Policy and shared rules management

#### 5.5.1 本部分职责

维护 Policy 生效事实、scope、priority、conflict、override、shared rules 和自动化治理边界。

#### 5.5.2 本部分包含的代码主体 / 模块

| 代码主体 / 模块 | 类型 | 作用 | 后续展开位置 |
|---|---|---|---|
| `PolicyGovernanceService` | application service | 编排 Policy 生效、停用、冲突处理和 shared rules 更新 | Step 8 |
| `PolicyEffectiveFact` | domain object | 表达已生效且可消费的治理策略事实 | Step 6 |
| `SharedRuleSet` | domain object | 表达组织级不可被低 scope 覆盖的硬约束集合 | Step 6 |
| `PolicyConflictRecord` | domain object / audit | 表达冲突、override、豁免或降级决策线索 | Step 6 |
| `PolicyConflictPolicy` | policy | 判断 Policy scope、priority、冲突和 override 是否成立 | Step 6 |
| `SharedRulesPolicy` | policy | 判断 shared rules 是否被违反或被低 scope 越权覆盖 | Step 6 |
| `MethodPolicyDefinitionPort` | port | 读取 AIPolicyDef ref / version / safe summary | Step 7 / 详细设计 |

#### 5.5.3 本部分对象发现线索

| 维度 | 候选对象 | Step 6 展开要求 |
|---|---|---|
| Truth / State | `PolicyEffectiveFact` | Step 6 独立成节 |
| Truth / State | `SharedRuleSet` | Step 6 独立成节 |
| Policy / Invariant | `PolicyConflictPolicy`、`SharedRulesPolicy`、`PolicyScopePolicy` | Step 6 独立成节 |
| Reference / Boundary | `MethodPolicySnapshot` | Step 6 独立成节 |
| Audit / History | `PolicyConflictRecord`、`PolicyChangeRecord` | Step 6 独立成节 |

#### 5.5.4 本部分不承担什么

不拥有 AIPolicyDef、method、template 或 standard 正文;不接受 runtime policy cache、capability whitelist、project local config 或 tool execution 反向定义 Policy truth。

#### 5.5.5 与其他部分的接缝

支撑 Gate / Decision、Approval responsibility、Control applicability、AIIA / SoA conclusion、Nonconformity closure 和 runtime / capability 消费;通过 External context mirror support 承接 method-library 定义引用和运行反馈摘要。

### 5.6 Control and compliance conclusion management

#### 5.6.1 本部分职责

维护 Control 适用 / 实施 / 复核事实、Control coverage、AIIA / SoA 治理结论、适用 / 排除、批准和责任结论。

#### 5.6.2 本部分包含的代码主体 / 模块

| 代码主体 / 模块 | 类型 | 作用 | 后续展开位置 |
|---|---|---|---|
| `ControlComplianceService` | application service | 编排 Control applicability、review、AIIA / SoA 结论和批准 | Step 8 |
| `ControlApplicability` | domain object | 表达控制项在治理语境中的适用 / 排除事实 | Step 6 |
| `ControlReview` | domain object | 表达控制实施、复核、违反或整改关联 | Step 6 |
| `AIIAConclusion` | domain object | 表达 AI 影响评估的治理评审结论 | Step 6 |
| `SoAConclusion` | domain object | 表达适用性声明的治理评审结论 | Step 6 |
| `ControlApplicabilityPolicy` | policy | 判断控制适用、排除、复核或违反是否成立 | Step 6 |
| `ComplianceConclusionPolicy` | policy | 判断 AIIA / SoA 覆盖、证据和批准是否成立 | Step 6 |

#### 5.6.3 本部分对象发现线索

| 维度 | 候选对象 | Step 6 展开要求 |
|---|---|---|
| Truth / State | `ControlApplicability`、`ControlReview`、`AIIAConclusion`、`SoAConclusion` | Step 6 独立成节 |
| Policy / Invariant | `ControlApplicabilityPolicy`、`ComplianceConclusionPolicy` | Step 6 独立成节 |
| Projection / Read model | `ControlCoverageView` | Step 6 独立成节 |
| Reference / Boundary | `MethodControlSnapshot`、`EvidenceSummaryRef` | Step 6 独立成节 |
| Audit / History | `ControlChangeRecord`、`ComplianceConclusionRecord` | Step 6 独立成节 |

#### 5.6.4 本部分不承担什么

不保存 ControlDefinition、standard、method body、artifact body、evidence body、AIIA / SoA document body、baseline body 或 archive package body。

#### 5.6.5 与其他部分的接缝

消费 Governance context、Policy / shared rules、Approval responsibility、artifact / evidence summary 和 method control definition snapshot;向 Nonconformity、traceability、report、archive 和 external GRC export 输出治理结论。

### 5.7 Nonconformity corrective loop

#### 5.7.1 本部分职责

维护不符合发现、原因、纠正动作、责任、复验、关闭和重新打开的正式治理闭环。

#### 5.7.2 本部分包含的代码主体 / 模块

| 代码主体 / 模块 | 类型 | 作用 | 后续展开位置 |
|---|---|---|---|
| `NonconformityService` | application service | 编排不符合登记、纠正、复验、关闭和重开 | Step 8 |
| `NonconformityRecord` | domain object | 表达正式不符合事实和责任语境 | Step 6 |
| `CorrectiveAction` | domain object | 表达纠正动作、责任和目标结果 | Step 6 |
| `VerificationResult` | domain object | 表达复验结论、失败原因和关闭依据 | Step 6 |
| `NonconformityClosurePolicy` | policy | 判断纠正闭环是否允许关闭或重开 | Step 6 |
| `NonconformityRepository` | persistence | 保存 nonconformity truth | 详细设计 |

#### 5.7.3 本部分对象发现线索

| 维度 | 候选对象 | Step 6 展开要求 |
|---|---|---|
| Truth / State | `NonconformityRecord`、`CorrectiveAction`、`VerificationResult` | Step 6 独立成节 |
| Policy / Invariant | `NonconformityClosurePolicy` | Step 6 独立成节 |
| Projection / Read model | `NonconformityStatusView` | Step 6 独立成节 |
| Reference / Boundary | evidence / work / actor refs | Step 6 判断是否独立或作为字段类型 |
| Audit / History | `NonconformityChangeRecord` | Step 6 独立成节 |

#### 5.7.4 本部分不承担什么

不等同 bug、work blocker、runtime failure、observability alert、maintenance report 或普通备注;不保存证据正文或工作项正文。

#### 5.7.5 与其他部分的接缝

可由 Control / compliance、Policy violation、audit finding、runtime / observability signal 或外部复核触发;向 Work、Artifact、Traceability、Report、Archive 和 external GRC export 输出正式闭环状态。

### 5.8 Governance consumption and traceability

#### 5.8.1 本部分职责

提供授权查询、治理事实消费、审计复盘、责任解释、report / dashboard 来源、observability / archive / external GRC 交接材料。

#### 5.8.2 本部分包含的代码主体 / 模块

| 代码主体 / 模块 | 类型 | 作用 | 后续展开位置 |
|---|---|---|---|
| `AuthorizedGovernanceQueryService` | application service | 编排授权读取和可见性判断 | Step 8 |
| `GovernanceTraceService` | application service | 编排追溯记录、消费回链和 handoff 准备 | Step 8 |
| `GovernanceTraceRecord` | audit / history | 表达治理事实变化、消费、报告和交接语境 | Step 6 |
| `ReadVisibilityPolicy` | policy | 判断 actor 对治理事实、投影或报告是否可见 | Step 6 |
| `ObservabilityHandoffPort` | port | 交接治理追溯材料给观测边界 | Step 7 / 详细设计 |
| `ArchiveHandoffPort` | port | 交接治理事实和合规材料给归档边界 | Step 7 / 详细设计 |
| `ExternalGrcExportPort` | port | 输出 external GRC export 材料 | Step 7 / 详细设计 |

#### 5.8.3 本部分对象发现线索

| 维度 | 候选对象 | Step 6 展开要求 |
|---|---|---|
| Truth / State | trace state 线索 | Step 6 判断是否并入 `GovernanceTraceRecord` |
| Policy / Invariant | `ReadVisibilityPolicy` | Step 6 独立成节 |
| Projection / Read model | governance query / report 线索 | Step 6 判断是否独立 |
| Reference / Boundary | archive / observability / external GRC refs | Step 6 判断是否独立或作为字段类型 |
| Audit / History | `GovernanceTraceRecord` | Step 6 独立成节 |

#### 5.8.4 本部分不承担什么

不拥有 workspace 聚合 truth、observability ledger、archive package 正文、external GRC truth、conversation display state 或长期物理审计存储。

#### 5.8.5 与其他部分的接缝

读取 Governance truth core 和 Derived maintenance 输出;向 SDK、workspace、conversation、observability、archive、external GRC 和相邻 truth 仓提供授权消费或交接。

### 5.9 Derived maintenance and reconciliation

#### 5.9.1 本部分职责

维护投影重建、dashboard / report、Control coverage view、Policy effective view、Nonconformity status view、external GRC export preparation、对账和维护证据。

#### 5.9.2 本部分包含的代码主体 / 模块

| 代码主体 / 模块 | 类型 | 作用 | 后续展开位置 |
|---|---|---|---|
| `GovernanceDerivedMaintenanceService` | application service | 编排派生视图、报告、对账和维护材料 | Step 8 |
| `GovernanceProjectionRebuildJob` | operations job | 从 Governance truth 重建派生视图 | Step 7 / Step 8 |
| `ExternalContextSnapshotRefreshJob` | operations job | 刷新外部引用和 snapshot 支撑材料 | Step 7 / Step 8 |
| `GovernanceReconciliationJob` | operations job | 对账 truth、projection、snapshot 和 outbox 语义一致性 | Step 7 / Step 8 |
| `DerivedGovernanceViewState` | domain state / projection state | 表达派生视图 stale / rebuilding / ready / failed 等维护状态线索 | Step 6 |
| `GovernanceProjectionRepository` | projection | 保存治理 dashboard、summary、coverage、status 和 report 投影 | 详细设计 |

#### 5.9.3 本部分对象发现线索

| 维度 | 候选对象 | Step 6 展开要求 |
|---|---|---|
| Truth / State | `DerivedGovernanceViewState` | Step 6 独立成节 |
| Policy / Invariant | `DerivedGovernanceViewPolicy` | Step 6 独立成节 |
| Projection / Read model | `GovernanceDashboardView`、`PolicyEffectiveView`、`ControlCoverageView`、`NonconformityStatusView`、`GovernanceReconciliationReport` | Step 6 独立成节 |
| Reference / Boundary | projection source refs | Step 6 判断是否独立或作为字段类型 |
| Audit / History | rebuild / reconciliation history 线索 | Step 6 判断是否独立 |

#### 5.9.4 本部分不承担什么

不生成新业务事实,不批准 / 拒绝 / 豁免 / 关闭治理对象,不修正核心 truth,不把 report、dashboard、external GRC export 或 reconciliation result 当成第二 truth。

#### 5.9.5 与其他部分的接缝

从 Governance truth core 和 External context mirror support 读取正式来源;向 consumption and traceability 提供只读视图、维护报告和交接材料。

### 5.10 External context mirror support

#### 5.10.1 本部分职责

承载外部引用、safe summary、snapshot、stale / unresolved / invalid marker、本地解析状态和不保存正文的影子索引。

#### 5.10.2 本部分包含的代码主体 / 模块

| 代码主体 / 模块 | 类型 | 作用 | 后续展开位置 |
|---|---|---|---|
| `ExternalContextSnapshotRepository` | snapshot / reference store | 保存外部 ref、summary、snapshot 和解析状态 | 详细设计 |
| `ReferenceResolutionState` | domain state / reference state | 表达外部引用 resolved / unresolved / stale / invalid 等状态线索 | Step 6 |
| `IdentityActorPort` | port | 读取 actor / member / role / capability summary | Step 7 / 详细设计 |
| `MethodPolicyDefinitionPort` | port | 读取 AIPolicyDef ref / version / safe summary | Step 7 / 详细设计 |
| `MethodControlDefinitionPort` | port | 读取 ControlDefinition ref / version / safe summary | Step 7 / 详细设计 |
| `ProcessGateContextPort` | port | 读取 process waiting / activity / recovery governance context | Step 7 / 详细设计 |
| `WorkContextPort` | port | 读取 project / work / iteration / dependency governance context | Step 7 / 详细设计 |
| `ArtifactEvidencePort` | port | 读取 artifact / evidence / AIIA / SoA 正文来源引用和 safe summary | Step 7 / 详细设计 |
| `RuntimeSignalPort` | port | 读取 runtime / capability feedback summary | Step 7 / 详细设计 |
| `ConversationContextPort` | port | 读取 conversation context ref 和显化回链 | Step 7 / 详细设计 |

#### 5.10.3 本部分对象发现线索

| 维度 | 候选对象 | Step 6 展开要求 |
|---|---|---|
| Truth / State | `ReferenceResolutionState` | Step 6 独立成节 |
| Policy / Invariant | reference validity 线索 | Step 6 判断是否形成独立 policy |
| Projection / Read model | external context projection 线索 | Step 6 判断是否独立 |
| Reference / Boundary | `ActorCapabilitySnapshot`、`MethodPolicySnapshot`、`MethodControlSnapshot`、`EvidenceSummaryRef`、`ProcessGovernanceContextRef`、`WorkGovernanceContextRef`、`RuntimeSignalRef` | Step 6 独立成节或明确作为字段类型 |
| Audit / History | refresh history 线索 | Step 6 判断是否独立 |

#### 5.10.4 本部分不承担什么

不保存 identity、process、work、artifact、conversation、method-library、runtime、capability、observability、archive 或 external GRC 正文;不替代来源仓 lifecycle、definition truth、execution truth 或 evidence truth。

#### 5.10.5 与其他部分的接缝

为 context / input、decision、approval、policy、control、nonconformity、trace、derived maintenance 提供引用解析、safe summary、旧快照、未解析状态和失效解释。

---

## 6. 总体边界说明与 Step 6 门禁

- Step 5 的对象发现线索只是候选池,不等于最终对象定义。
- Step 6 必须从本文件 §4.1 和 §5 逐项筛选正式关键对象,并说明对象所属主要组成部分。
- API、repository、port、trigger、DTO、数据库表、HTTP 请求体、CloudEvent schema 和 job runner 默认不作为 Step 6 领域对象展开。
- 如果 Step 8 处理流或 Step 9 状态机使用了某个对象,必须能在 Step 6 找到正式对象骨架。
- 任何对象候选不得保存相邻仓正文、runtime execution body、conversation message body、observability body、archive package body 或 external GRC body。
- 派生视图、报告、对账、external GRC export 和 handoff 材料只能从 Governance truth 派生或交接,不得反写核心 truth。

---

## 7. 当前文档问题诊断

| 旧 `02-概要设计.md` 内容 | 问题 | 本轮处理 |
|---|---|---|
| Gate、Decision、Governance Request、Exception、Responsibility Chain 直接作为解释主线 | 缺少主要组成部分、对象发现维度和代码主体边界 | 改为 10 个业务组成部分,再沉淀对象候选池 |
| process waiting、work lifecycle、conversation card 与 governance decision 混合讲解 | 容易让等待状态、工作状态或显化卡片替代正式裁决 | 将 Gate and decision management 独立成正式 truth 组成部分 |
| Policy、Control、AIIA / SoA、Nonconformity 以概念解释为主 | 没有明确它们分别承担的 truth、policy、reference 和 projection 边界 | 分别拆成 policy / shared rules、control / compliance conclusion、nonconformity corrective loop |
| report、dashboard、audit、external GRC 和 archive 线索混入核心叙事 | 派生和交接能力容易成为第二 truth | 独立为 consumption / traceability 与 derived maintenance,并声明只读可重建 |
| 外部仓和运行线索容易混入 Governance 内部对象 | 容易打穿数据归属和正文排除 | 用 External context mirror support 限定为引用、snapshot、safe summary 和解析状态 |

---

## 8. 回填草稿

正式 `02-概要设计.md` 后续整理时:

- §5 “主要组成部分、职责与边界”引用本文件 §3.2 的组成部分总表和 §4.1 的对象发现维度表。
- §5 引用本文件 §4.2 的各部分交互总图。
- §5 按本文件 §5 的 10 个主要组成部分生成正式章节。
- Step 6 “关键对象轮廓”必须引用本文件 §6 的门禁,从对象候选池正式筛选。

---

## 9. 待确认事项

### 9.1 待确认项处理建议

| 待确认项 | 备选方案 | 推荐方案 | 推荐理由 | 当前状态 |
|---|---|---|---|---|
| 是否按旧 Gate / Decision / Request 教学线索拆主要组成部分 | A. 是;B. 否,按 Governance truth 主线和业务职责拆分 | B | 旧线索不足以承接 policy、control、compliance、nonconformity、trace 和 derived 维护 | 已确认采用 B |
| Policy / shared rules 是否与 Control / compliance 合并成一个组成部分 | A. 合并;B. 分开 | B | Policy 生效事实和 Control / AIIA / SoA 结论生命周期不同,合并会让 Step 6 对象边界模糊 | 已确认采用 B |
| Traceability、derived maintenance、external mirror 是否进入核心 truth 部分 | A. 进入;B. 独立为支撑组成部分 | B | 它们支撑消费、维护、引用和交接,不能反写核心 truth | 已确认采用 B |

### 9.2 本 Step 未确认事项

本步不新增阻塞 Step 6 的待确认事项。具体哪些候选对象最终正式独立成节,将在 Step 6 “关键对象轮廓”中收敛。

---

## 10. 进入下一步条件

- 已明确 `L1-governance` 由哪些主要组成部分构成。
- 已明确每个主要组成部分承担什么、不承担什么。
- 已明确每个主要组成部分包含哪些代码主体 / 模块,且后续展开位置没有悬空。
- 已形成对象发现维度表和各主要组成部分对象发现线索。
- 已形成各部分交互总图,且未表达协议字段、函数调用链或详细时序。
- 对象字段、状态集合、成员函数和工厂函数细节仍保留给 Step 6 独立展开。
- 可以进入 Step 6 “关键对象轮廓”。
