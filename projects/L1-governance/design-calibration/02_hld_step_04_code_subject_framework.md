# Step 4. 代码主体框架映射

> 对应 SOP: `standards/document/概要设计讨论流程_SOP.md` Step 4
> 回填章节: `02-概要设计.md` §4 代码主体框架总览
> 生成日期: 2026-06-08
> 状态: 已完成

---

## 1. 本步目标

把架构设计中已经收稳的 Governance truth、内部语义上下文、运行承载、依赖方向和同步 / 异步 / 后台分工,转译为后续详细设计可以继续展开的代码主体骨架。重点是确认哪些名称是 `L1-governance` 的业务主要组成部分,哪些只是 Inbound / Operations / Application / Domain / Ports / Persistence / Projection / Outbox 等实现分层。

本步不定义代码目录、crate、文件路径、完整 trait、完整 struct、API schema、数据库表、topic、配置项或部署结构。

---

## 2. 本步输入

| 输入 | 状态 | 用途 |
|---|---|---|
| `02_hld_step_01_upstream_boundary.md` | 已完成 | 提供上游边界和旧文档不可继承口径 |
| `02_hld_step_02_goals_scope.md` | 已完成 | 提供代码主体骨架层的设计深度 |
| `02_hld_step_03_constraints.md` | 已完成 | 提供 Governance truth、依赖裁剪、数据归属、通信分层和配置不可越界约束 |
| `01-架构设计.md` §6 | 已完成 | 提供治理决策、Policy / shared rules、Control / AIIA / SoA、Nonconformity、traceability、derived consumption 和 reference / snapshot / projection 支撑上下文 |
| `01-架构设计.md` §7 | 已完成 | 提供同步治理入口、异步输入、后台维护、治理真相存储、派生承载和事件 / 追溯交接运行承载角色 |
| `01-架构设计.md` §8 | 已完成 | 提供核心语义、编排 / 承接、外部接缝、技术承载和查询 / 投影 / 维护派生面的依赖方向 |
| `01-架构设计.md` §9 / §10 / §11 | 已完成 | 提供数据所有权、一致性、通信方式和关键技术机制 |

---

## 3. SOP 问题回答

### 3.1 架构层已经收稳的模块,分别应落到哪些代码主体骨架上?

架构层的语义上下文不直接等同代码目录,而应先映射为代码主体骨架:

- `Governance truth core` 落到治理核心 domain model、truth repository、governance trace store 和 outbox 事件形成主体。
- `Governance context / input` 落到 governance context service、governance input intake、context validation policy、external object snapshot / reference resolver 和 input repository。
- `Gate / Decision management` 落到 decision command service、Gate、GovernanceDecision、DecisionRecord、DecisionPolicy、decision repository 和 decision changed outbox。
- `Approval / responsibility management` 落到 approval coordination service、ApprovalResponsibility、ApproverRequirement、ResponsibilityChain、actor capability resolver port 和 responsibility trace record。
- `Policy / shared rules management` 落到 policy command service、PolicyEffectiveFact、SharedRuleSet、PolicyConflictRecord、PolicyScopePolicy、policy repository 和 policy changed outbox。
- `Control / compliance conclusion management` 落到 control / compliance service、ControlApplicability、ControlReview、AIIAConclusion、SoAConclusion、compliance evidence reference port 和 control changed outbox。
- `Nonconformity corrective loop` 落到 nonconformity service、NonconformityRecord、CorrectiveAction、VerificationResult、closure policy、nonconformity repository 和 corrective loop outbox。
- `Governance consumption / traceability` 落到 authorized governance query service、GovernanceTraceRecord、GovernanceAuditTrail、report / dashboard projection 和 observability / archive handoff port。
- `Derived maintenance / reconciliation` 落到 projection rebuild service、external snapshot refresh service、governance reconciliation job、derived view state repository 和 reconciliation evidence。
- `External context mirrors` 落到 process / work / artifact / conversation / identity / method / runtime / capability / observability / archive reference stores、snapshot adapters 和 stale / unresolved / invalid marker。
- `运行承载角色` 落到 sync intake、async consumer、background jobs、state store adapter、event / infra boundary adapter 等实现分层,它们不是业务主要组成部分。

### 3.2 哪些主体属于 Inbound / Operations,哪些属于 Application Services?

| 分层类别 | 代码主体骨架 | 判断口径 |
|---|---|---|
| Inbound | command intake、query intake、event / callback intake、SDK-facing governance entry | 只负责把同步请求、查询请求、异步事件或外部反馈转成 application input,不做业务判定 |
| Operations | projection rebuild job、snapshot refresh job、reconciliation job、trace handoff job、archive preparation job、external GRC export job | 只负责受控维护、重建、对账、导出准备或交接触发,不得生成新业务事实 |
| Application Services | governance context service、decision command service、approval coordination service、policy command service、control / compliance service、nonconformity service、authorized query service、trace service、derived maintenance service | 负责事务编排、幂等、domain 调用、repository / port 调用、outbox 形成和失败状态落点 |

Inbound 和 Operations 是进入系统的承载形态;Application Services 是用例编排主体。它们都不是业务主要组成部分名称。

### 3.3 哪些主体属于 Domain Model,哪些属于 Ports / Persistence / Projection / Outbox?

| 分层类别 | 代码主体骨架 | 判断口径 |
|---|---|---|
| Domain Model | `GovernanceContext`、`GovernanceInput`、`Gate`、`GovernanceDecision`、`DecisionRecord`、`ApprovalResponsibility`、`ResponsibilityChain`、`PolicyEffectiveFact`、`SharedRuleSet`、`ControlApplicability`、`AIIAConclusion`、`SoAConclusion`、`NonconformityRecord`、`CorrectiveAction`、`GovernanceTraceRecord`、`DerivedGovernanceViewState` | 表达本仓业务规则、状态、不变量和禁止事项 |
| Domain Policy / Guard | `GovernanceContextPolicy`、`DecisionPolicy`、`ApprovalResponsibilityPolicy`、`PolicyConflictPolicy`、`SharedRulesPolicy`、`ControlApplicabilityPolicy`、`ComplianceConclusionPolicy`、`NonconformityClosurePolicy`、`ReadVisibilityPolicy`、`DerivedGovernanceViewPolicy` | 判断治理语境、正式裁决、审批责任、策略冲突、shared rules、控制适用、合规结论、纠正关闭和派生读取是否允许 |
| Ports | identity actor / capability port、process gate context port、work context port、artifact evidence port、method policy / control definition port、runtime signal port、conversation context port、bus event port、observability handoff port、archive handoff port、external GRC export port | 表达外部协作能力,不把外部仓正文拉进 Governance truth |
| Persistence | governance context repository、decision repository、approval responsibility repository、policy repository、control repository、compliance conclusion repository、nonconformity repository、governance trace repository | 保存本仓正式 truth 和追溯记录 |
| Projection | governance dashboard projection、decision summary projection、policy effective view、control coverage view、nonconformity status view、external reference snapshot projection、reconciliation projection、derived view status | 保存派生只读结构,可延迟、可重建、不得反写 |
| Outbox | context changed outbox、decision changed outbox、policy changed outbox、control changed outbox、compliance conclusion changed outbox、nonconformity changed outbox、trace / archive handoff outbox、external GRC export outbox | 记录已成立事实传播和交接意图,传播失败不取消 truth |

### 3.4 哪些名称必须在概要设计层先点名,否则详细设计会重新发明主语?

必须先点名的代码主体名称包括:

- 业务主要组成部分:Governance truth core、governance context and input management、gate and decision management、approval and responsibility management、policy and shared rules management、control and compliance conclusion management、nonconformity corrective loop、governance consumption and traceability、derived maintenance and reconciliation、external context mirror support。
- Application services:GovernanceContextService、GovernanceDecisionService、ApprovalCoordinationService、PolicyGovernanceService、ControlComplianceService、NonconformityService、AuthorizedGovernanceQueryService、GovernanceTraceService、GovernanceDerivedMaintenanceService。
- Domain objects / policies:GovernanceContext、GovernanceInput、Gate、GovernanceDecision、DecisionRecord、ApprovalResponsibility、ResponsibilityChain、PolicyEffectiveFact、SharedRuleSet、ControlApplicability、ControlReview、AIIAConclusion、SoAConclusion、NonconformityRecord、CorrectiveAction、GovernanceTraceRecord、DecisionPolicy、ApprovalResponsibilityPolicy、PolicyConflictPolicy、SharedRulesPolicy、ControlApplicabilityPolicy、ComplianceConclusionPolicy、NonconformityClosurePolicy、DerivedGovernanceViewPolicy。
- Ports / stores:GovernanceContextRepository、GovernanceDecisionRepository、ApprovalResponsibilityRepository、PolicyRepository、ControlRepository、ComplianceConclusionRepository、NonconformityRepository、GovernanceTraceRepository、GovernanceProjectionRepository、ExternalContextSnapshotRepository、GovernanceOutboxRepository、IdentityActorPort、ProcessGateContextPort、WorkContextPort、ArtifactEvidencePort、MethodPolicyDefinitionPort、MethodControlDefinitionPort、RuntimeSignalPort、ConversationContextPort、BusEventPort、ObservabilityHandoffPort、ArchiveHandoffPort、ExternalGrcExportPort。
- Operations jobs:GovernanceProjectionRebuildJob、ExternalContextSnapshotRefreshJob、GovernanceReconciliationJob、GovernanceTraceHandoffJob、GovernanceArchivePreparationJob、ExternalGrcExportJob。

这些名称先作为骨架主语出现,完整字段、函数签名、DTO、错误码、事务边界和测试切口留到详细设计。

### 3.5 哪些内容已经是代码目录、文件路径或框架实现,不应在本步展开?

本步不展开具体目录和文件路径、HTTP / gRPC / message consumer / job runner 框架、完整 Rust struct / enum / trait、repository 函数签名、事务句柄、数据库表、索引、迁移脚本、CloudEvent / JSON / proto schema、错误码、幂等键格式、缓存、搜索、队列、数据库、Policy engine、external GRC 产品、对象存储、调度产品或部署拓扑。

---

## 4. 架构模块到代码主体映射图

```text
+==================================================================+
|                 L1-governance code subject map                   |
+==================================================================+
|                                                                  |
|  Architecture context                       Code subjects        |
|                                                                  |
|  Governance truth core              -> domain truth objects      |
|     context / decision / policy        truth repositories        |
|     control / nonconformity / trace    trace and outbox          |
|                                                                  |
|  Governance context and input       -> context service           |
|     request source / subject scope     input validation policy   |
|                                        external context ports    |
|                                                                  |
|  Gate and Decision management       -> decision command svc      |
|     gate / formal decision             decision policy           |
|                                        decision repository       |
|                                                                  |
|  Approval and responsibility        -> approval coordination svc |
|     approver / vote / risk owner       responsibility policy     |
|                                        identity capability port  |
|                                                                  |
|  Policy and shared rules            -> policy command svc        |
|     effective policy / conflict        shared rules policy       |
|                                        policy repository         |
|                                                                  |
|  Control and compliance conclusion  -> control compliance svc    |
|     control / AIIA / SoA conclusion    evidence ref ports        |
|                                        conclusion repository     |
|                                                                  |
|  Nonconformity corrective loop      -> nonconformity service     |
|     issue / corrective action          closure policy            |
|                                        corrective repository     |
|                                                                  |
|  Consumption and Traceability       -> query / trace svc         |
|     dashboard / report / audit         read projections          |
|                                        handoff ports             |
|                                                                  |
|  Maintenance and Reconciliation     -> maintenance jobs          |
|     rebuild / refresh / reconcile      derived state stores      |
|                                        export records            |
|                                                                  |
|  External Context Mirrors           -> snapshot adapters         |
|     process / work / artifact /        reference stores          |
|     identity / method / runtime        stale marker states       |
|                                                                  |
+==================================================================+
```

关键说明:

- 左侧是架构层已收稳的语义上下文,右侧是概要设计需要先点名的代码主体骨架。
- 该图不表达源码目录、crate、文件路径、接口协议、数据库表、topic 或运行时调用顺序。
- `process`、`work`、`artifact`、`conversation`、`identity`、`method-library`、`runtime`、`capability`、`observability`、`archive` 和 external GRC 只能通过 reference、snapshot、event、port、export 或 handoff 边界出现,不能成为本仓内部代码主体 owner。
- 本地 snapshot / projection / reference support 是辅助主体,只能服务治理判定、降级解释、稳定消费、追溯和派生,不得保存外部正文。

---

## 5. 实现分层视图

```text
+==================================================================+
|                    L1-governance layer view                      |
+==================================================================+
|                                                                  |
|  Inbound / Operations                                            |
|  command intake / query intake / event intake / callback intake /|
|  rebuild jobs / refresh jobs / reconciliation jobs / export jobs |
|                              |                                   |
|                              v                                   |
|  Application Services                                             |
|  context / decision / approval / policy / control-compliance /   |
|  nonconformity / authorized query / trace / derived maintenance  |
|                              |                                   |
|                              v                                   |
|  Domain Model and Policies                                        |
|  GovernanceContext / Gate / GovernanceDecision / Approval /      |
|  PolicyEffectiveFact / SharedRuleSet / ControlApplicability /    |
|  AIIAConclusion / SoAConclusion / Nonconformity / TraceRecord    |
|                              |                                   |
|                 +------------+-------------+                     |
|                 |                          |                     |
|                 v                          v                     |
|  Ports and External Seams             Persistence / Projection    |
|  identity / process / work /          truth repos / trace store   |
|  artifact / method / runtime /        dashboard / reports         |
|  conversation / bus / handoff         snapshots / reconciliation  |
|                              |                                   |
|                              v                                   |
|  Outbox and Handoff                                              |
|  context changed / decision changed / policy changed / control   |
|  changed / compliance changed / nonconformity / trace handoff    |
|                                                                  |
+==================================================================+
```

关键说明:

- 该图表达实现分层和依赖方向,不表达业务模块拆分、部署拓扑、具体框架或目录结构。
- Inbound / Operations 只负责进入和触发;Application Services 负责用例编排;Domain Model and Policies 负责业务不变量。
- Ports and External Seams 只能表达外部能力边界;Persistence / Projection 分别承载 truth 和派生只读结构。
- Outbox and Handoff 表达已成立 Governance 事实传播和追溯 / 归档 / external GRC 交接,不能反向决定 Governance truth。

---

## 6. 业务主要组成部分与实现分层关系说明

### 6.1 业务主要组成部分

| 业务主要组成部分 | 从架构承接 | 后续 Step 5 展开方向 |
|---|---|---|
| Governance truth core | 独立 Governance truth、数据归属和一致性主线 | 定义本仓拥有的 context、input、decision、approval、policy、control、compliance、nonconformity、trace 和 outbox 核心边界 |
| Governance context and input management | 治理语境与可裁决输入 | 定义外部请求、治理对象、subject scope、evidence / source ref 和可裁决输入成立边界 |
| Gate and decision management | Gate / Decision 正式裁决 | 定义 Gate、formal decision、decision record、decision correction / superseding 和正式裁决不可替代边界 |
| Approval and responsibility management | Approval / responsibility | 定义审批责任、投票、授权、替代裁决、risk owner 和 identity 引用边界 |
| Policy and shared rules management | Policy effective fact / shared rules | 定义 policy 生效、scope、priority、conflict、override 和组织级 shared rules 边界 |
| Control and compliance conclusion management | Control、AIIA / SoA governance conclusion | 定义 control applicability / implementation / review、AIIA / SoA 结论和正文排除边界 |
| Nonconformity corrective loop | Nonconformity | 定义不符合、原因、纠正、复验、关闭和责任语境边界 |
| Governance consumption and traceability | 消费、报告、审计复盘和 handoff | 定义授权查询、dashboard / report、traceability、observability / archive / external GRC 交接 |
| Derived maintenance and reconciliation | 派生、刷新、对账和维护 | 定义 projection rebuild、snapshot refresh、reconciliation 和派生失败可见性 |
| External context mirror support | 外部引用 / 快照 / marker | 定义 process、work、artifact、identity、method、runtime、conversation 等外部引用、摘要、快照、stale / unresolved / invalid marker 承载边界 |

### 6.2 实现分层不是业务主要组成部分

| 实现分层 | 作用 | 为什么不能当业务主要组成部分 |
|---|---|---|
| Inbound adapters | 接收 command、query、event、callback 或 job trigger | 它描述进入方式,不描述业务职责 |
| Operations jobs | 执行投影重建、快照刷新、对账、导出准备、追溯交接等维护任务 | 它描述运行触发形态,不拥有新的业务事实 |
| Application services | 编排用例、事务、幂等、domain 调用和 port 调用 | 它横跨多个业务组成部分,不是业务分解维度 |
| Domain model | 承载对象、状态、不变量和 policy | 它是实现层承载,具体对象归属于不同业务组成部分 |
| Ports / adapters | 表达外部能力接缝和技术适配 | 它们不能反向定义 Governance truth |
| Persistence / projection / outbox | 持久化 truth、派生视图和传播意图 | 它们是技术承载和一致性边界,不是业务模块名称 |

### 6.3 关键判断

- 业务主要组成部分回答“本仓有哪些可被设计和评审的业务主体”。
- 实现分层回答“每个业务主体在代码中通过什么层次被承载”。
- 同一个业务主要组成部分会跨越多个实现分层,例如 `Gate and decision management` 同时需要 inbound、application service、domain object、truth repository 和 outbox。
- 同一个实现分层会服务多个业务主要组成部分,例如 Application Services 同时承接 context、decision、approval、policy、control / compliance、nonconformity、query、trace 和 derived maintenance。
- 后续 Step 5 必须按业务主要组成部分展开,不能按 Inbound / Application / Domain / Ports 这些实现分层展开。

---

## 7. 当前文档问题诊断

| 旧 `02-概要设计.md` 内容 | 问题 | 本轮处理 |
|---|---|---|
| 将 Gate、Decision、Governance Request、Exception、Responsibility Chain 逐词解释作为第一层结构 | 旧概念线索直接充当主要结构,缺少代码主体框架 | 改为先从架构上下文映射出业务主要组成部分和实现分层 |
| 旧图和旧叙事把 process、work、artifact、conversation、runtime、external GRC 等线索混入 Governance 解释 | 容易把外部上下文对象误认为本仓内部代码主体 | Step 4 明确外部对象只能通过 port、event、snapshot、reference、export 或 handoff 出现 |
| 旧文档直接谈外部 GRC、Policy engine、旧性能数字等实现候选 | 技术产品和性能数字前置,可能反向塑造核心主体 | Step 4 仅点名 repository / projection / outbox / job 等代码主体骨架,不锁技术产品 |
| 缺少 Application / Domain / Port / Projection / Outbox 的承载关系 | 详细设计会重新发明 service、object、port、store 和 outbox 主语 | 本步先点名关键代码主体骨架 |

---

## 8. 改动前后对比

| 维度 | 改动前 | 改动后 |
|---|---|---|
| 第一层结构 | Gate / Decision / Request / Exception 教学线索 | 新版 Governance truth core 下的业务主要组成部分 |
| 实现层表达 | 未清楚区分业务模块和实现分层 | 明确 Inbound、Operations、Application、Domain、Ports、Persistence、Projection、Outbox 是实现分层 |
| 外部关系 | 外部仓和 external GRC 容易进入内部结构图 | 外部仓只能通过接缝、引用、快照、事件、export 或交接出现 |
| 下游承接 | 详细设计需要自行补 service、object、port、store 主语 | Step 4 先提供可继续展开的代码主体骨架 |
| 越界防护 | 依赖旧非目标提醒 | 用 Step 3 约束门禁检查每个代码主体 |

---

## 9. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A: 按 Inbound / Application / Domain / Ports 直接作为主要章节 | 容易对接代码分层 | 会把实现分层误当业务模块,不符合概要设计“主要组成部分”要求 | 不采用 |
| 方案 B: 先列业务主要组成部分,再说明它们落到哪些实现分层 | 既能表达业务结构,又能承接详细设计代码主体 | 需要多一层映射说明 | 采用 |
| 方案 C: 直接设计 crate / module / 文件路径 | 对实现最直接 | 过早进入详细设计和实施计划,也容易受仓库结构变化影响 | 不采用 |
| 方案 D: 沿用旧 Gate / Decision / Request 教学主线 | 迁移成本低 | 无法覆盖 policy、control、compliance、nonconformity、traceability、maintenance 和 external mirrors 的完整骨架 | 不采用 |

---

## 10. 结构化中间产物

### 10.1 架构模块到代码主体映射图

见 §4。

### 10.2 实现分层视图

见 §5。

### 10.3 业务主要组成部分与实现分层关系

见 §6。

---

## 11. 回填草稿

正式 `02-概要设计.md` 后续整理时:

- §4 “代码主体框架总览”引用本文件 §4、§5 和 §6,生成正式文档时从这些小节摘录。
- §4 必须同时保留“架构模块到代码主体映射图”和“实现分层视图”两张 ASCII 图。
- §4 必须说明业务主要组成部分与实现分层不能混用;后续 Step 5 按业务主要组成部分展开。
- 不在本 Step 重复粘贴正式全文,后续 Step 14 从结构化中间产物摘录生成正式文档。

---

## 12. 待确认事项

### 12.1 待确认项处理建议

| 待确认项 | 备选方案 | 推荐方案 | 推荐理由 | 当前状态 |
|---|---|---|---|---|
| Step 4 是否按实现分层作为业务主结构 | A. 是;B. 否,业务主要组成部分和实现分层分开 | B | 概要设计主线必须先表达业务主体,实现分层只用于承载关系 | 已确认采用 B |
| 是否在 Step 4 直接给出 crate / module / file path | A. 是;B. 否,只点名代码主体骨架 | B | 代码目录和文件路径属于详细设计 / 实施计划层 | 已确认采用 B |
| external GRC export 是否作为 Governance truth 代码主体 | A. 是;B. 否,只作为 export / handoff / projection 辅助主体 | B | external GRC 不得成为本仓 truth owner | 已确认采用 B |

### 12.2 本 Step 未确认事项

本步不新增阻塞 Step 5 的待确认事项。具体每个业务主要组成部分的职责、不承担职责和边界接缝将在 Step 5 独立收敛。

---

## 13. 进入下一步条件

- 已明确架构模块如何映射为代码主体骨架。
- 已明确业务主要组成部分与实现分层的关系。
- 已输出架构模块到代码主体映射图和实现分层视图。
- 未提前下沉到代码目录、文件路径、完整 trait / struct、协议 schema、数据库表或部署结构。
- 可以进入 Step 5“主要组成部分、职责与边界”。
