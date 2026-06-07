# Step 8. 数据所有权与一致性策略

> 对应 SOP: `standards/document/架构设计讨论流程_SOP.md` Step 8
> 回填章节: `01-架构设计.md` §9 数据所有权与一致性策略
> 生成日期: 2026-06-07
> 状态: 已完成

---

## 1. 本步目标

明确 `L1-governance` 拥有哪些正式真相数据,哪些只是快照 / 投影数据,哪些只是引用关系数据,哪些正文 / 真相必须明确排除在本仓之外;并在这些归属判断成立的前提下,说明不同数据关系应采用什么一致性口径,以及一致性暂时不成立时的架构层处理原则。

本步不写数据库表、字段、DDL、缓存策略、outbox、事务机制、事件 schema、重试脚本、repository / service / adapter 或代码对象模型。

---

## 2. 本步输入

| 输入 | 状态 | 用途 |
|---|---|---|
| `01_arch_step_03_responsibility_boundary.md` | 已完成 | 提供做 / 不做、易混淆职责和边界红线 |
| `01_arch_step_04_system_context.md` | 已完成 | 提供正式上下文对象、输入 / 输出面和外部降级口径 |
| `01_arch_step_05_bounded_context_subdomains.md` | 已完成 | 提供核心子域、支撑上下文和本地索引 / 投影 / 引用层 |
| `01_arch_step_06_container_deployment.md` | 已完成 | 提供真相承载、派生承载和后台维护运行边界 |
| `01_arch_step_07_dependency_direction.md` | 已完成 | 提供依赖方向、倒置边界和禁止反向依赖 |
| `00_req_step_11_data_ownership.md` | 已完成 | 提供需求层真相 / 快照 / 引用 / 禁止保存正文结论 |
| 旧 `01-架构设计.md` §8 / §9 | 旧 Draft | 作为旧数据归属、一致性、审计和合规设施混写问题诊断输入 |

---

## 3. SOP 问题回答

### 3.1 哪些数据由本仓拥有正式真相?

`L1-governance` 拥有治理决策与治理控制事实本身的正式真相。它拥有的是治理语境、裁决、责任、Policy 生效、shared rules、Control 适用、AIIA / SoA 治理结论、Nonconformity 纠正闭环和治理追溯事实,不是相邻仓正文、定义正文、运行正文或 UI 显化。

| 正式真相数据 | 判断 |
|---|---|
| governance context / 治理语境 | actor、scope、适用对象、治理目的和责任语境由 Governance 拥有正式真相。 |
| Gate / 决策请求语境 | 关键节点待裁决语境和正式治理裁决主语由 Governance 拥有正式真相。 |
| Decision / resolution | 正式裁决结论、裁决结果和依据语义由 Governance 拥有正式真相。 |
| Approval / vote / authorization responsibility | 审批、投票、授权、替代裁决和责任语境由 Governance 拥有正式真相。 |
| Policy effective fact | Policy 生效、授权、范围、优先级、冲突和替代关系由 Governance 拥有正式真相。 |
| shared rules / organization hard constraint | 组织级硬约束和不可被低 scope 覆盖的规则由 Governance 拥有正式真相。 |
| Control applicability / implementation / review fact | Control 适用、实施、复核、违反和整改关联由 Governance 拥有正式真相。 |
| AIIA governance conclusion | 影响评估的治理评审、适用性、风险结论和批准结论由 Governance 拥有正式真相。 |
| SoA governance conclusion | 适用性声明的控制覆盖、适用 / 排除和批准结论由 Governance 拥有正式真相。 |
| Nonconformity corrective loop | 不符合、原因、纠正、复验、关闭和责任语境由 Governance 拥有正式真相。 |
| governance audit / traceability record | Governance 关键变化、消费、报告、对账和交接的可解释追溯事实由 Governance 拥有正式真相。 |

### 3.2 哪些数据只是快照 / 投影?

快照 / 投影只服务稳定判断、裁决、解释、查询、报告、对账和交接,不得成为独立治理真相。

| 快照 / 投影数据 | 上游或来源 |
|---|---|
| process waiting / activity 摘要 | `L1-process` |
| project / work / iteration 摘要 | `L1-work` |
| artifact / evidence / baseline 摘要 | `L1-artifact` |
| conversation context / display 摘要 | `L1-conversation` |
| actor / member / role 可承担性摘要 | `L1-identity` |
| method / AIPolicyDef / control definition 摘要 | `L3-method-library` |
| runtime / capability / policy cache feedback 摘要 | `L2-runtime` / `L3-capability-hub` |
| observability alert / audit summary | `L4-observability` |
| governance read model / report / dashboard / reconciliation summary | Governance truth 派生 |
| archive handoff preparation summary | Governance truth 和外部引用派生 |

### 3.3 哪些数据只是引用关系?

引用关系只保存指向外部对象、正文或正式材料的稳定回链,不保存外部正文,也不承担外部生命周期。

| 引用关系数据 | 外部对象 |
|---|---|
| ActorRef / GlobalMemberRef / RoleRef | `L1-identity` / `L0-core` |
| ProcessInstanceRef / ActivityRef / WaitingGateRef | `L1-process` |
| ProjectRef / ProjectMemberRef / WorkItemRef / IterationRef / DependencyRef / BlockerRef | `L1-work` |
| ArtifactRef / EvidenceRef / BaselineRef / ImplementationPlanRef / ArchivePackageRef | `L1-artifact` / `L4-archive` |
| ConversationSpaceRef / ConversationFactRef / TraceContextRef / HandoffRef | `L1-conversation` / `L0-core` |
| AIPolicyDefRef / ControlDefinitionRef / MethodRef / ProcessTemplateDefRef / StandardRef | `L3-method-library` |
| RuntimeExecutionRef / CapabilityRef / ToolRef / ProviderRef | `L2-runtime` / `L3-capability-hub` |
| ObservabilityRef / AuditLogRef / MetricRef / AlertRef | `L4-observability` |

### 3.4 哪些正文 / 真相本仓明确不拥有?

`L1-governance` 明确不拥有相邻仓正文、运行正文、观测正文、UI 正文、外部 GRC 正文或方法定义正文。即便这些正文参与裁决,也只能以引用、摘要、safe summary 或治理结论进入。

| 明确不拥有的正文 / 真相 | 原因 |
|---|---|
| ProcessInstance、Activity、waiting gate、checkpoint、recovery 正文 | process execution truth 属于 `L1-process`。 |
| Project、ProjectMember、Backlog、WorkItem、Iteration、dependency、blocker 正文 | work truth 属于 `L1-work`。 |
| Artifact、Evidence、Baseline、ImplementationPlan、AIIA / SoA 文档正文和 archive package 正文 | artifact / archive 正文不属于 Governance。 |
| conversation fact、聊天消息、Gate 卡片、review display、visibility、handoff 正文 | conversation truth 和显化正文不属于 Governance。 |
| GlobalMember、Actor、Role、认证授权和成员生命周期正文 | identity truth 不属于 Governance。 |
| AIPolicyDef、Control definition、method、template 和标准正文 | method-library / 标准正文不属于 Governance。 |
| runtime enforcement、agent loop、tool execution、policy cache truth、plan item progress、execution log 正文 | runtime / capability execution truth 不属于 Governance。 |
| audit log store、metrics、trace storage、alert stream、workspace dashboard、console UI 和 external GRC system 正文 | observability、workspace、console 和外部系统 truth 不属于 Governance。 |

### 3.5 哪些关系必须强一致?

强一致只用于 Governance 正式真相内部关系,以及正式真相与必要引用有效性的边界判断。治理裁决、Policy 生效、Control 适用、合规结论和纠正闭环不能被写成半成立状态。

| 强一致关系 | 原因 |
|---|---|
| governance context 与 Gate / Decision / Approval / responsibility | 裁决必须绑定明确治理语境和责任语境。 |
| Decision 与 Approval / vote / authorization responsibility | 正式结论不能脱离谁批准、谁授权或谁承担责任。 |
| Policy effective fact 与 shared rules / scope / priority / conflict | Policy 生效必须服从组织级硬约束和冲突规则。 |
| Control applicability 与 Control review / violation / remediation 关联 | 控制适用、违反和整改必须围绕同一治理语境解释。 |
| AIIA / SoA governance conclusion 与 evidence / baseline 引用有效性 | 评审和批准必须能指向正式材料来源,不能凭空成立。 |
| Nonconformity corrective loop 与原因 / 纠正 / 复验 / 关闭 | 纠正闭环不能出现无原因、无复验或无责任语境的终态。 |
| governance traceability record 与关键 Governance truth 变化 | 关键变化必须可追溯,不能只形成业务状态而无解释事实。 |

### 3.6 哪些关系可以最终一致?

最终一致用于派生消费、下游显化、报告、对账、归档交接、事件协作和外部快照刷新。这些关系可以延迟、重建或挂起,但不能反向改变 Governance truth。

| 最终一致关系 | 原因 |
|---|---|
| Governance truth 到 read model / dashboard / report / reconciliation | 派生消费可延迟和重建,不得成为业务写源。 |
| Governance truth 到 conversation / workspace / console 显化 | 下游入口不可用只影响消费体验,不改变正式裁决。 |
| Governance truth 到 observability / archive handoff | 追溯和归档交接可延迟,但 Governance truth 不因交接失败而变更。 |
| 外部 truth 到 Governance 本地快照 | 上游摘要可能滞后,本仓只表达 stale / unresolved / pending 状态。 |
| 事件协作输出 / 输入 | 事件传播和消费可延迟,但重复或乱序不能产生重复治理事实。 |

### 3.7 失败时靠什么口径约束、补偿或挂起?

| 失败类型 | 架构层处理口径 |
|---|---|
| Governance 主真相内部强一致失败 | 明确失败或保持原状态,不得写成部分完成。 |
| 外部快照缺失 / 过期 | 标记 unresolved / stale / pending / waiting,不得补造外部 truth。 |
| 外部引用目标不存在或不可解析 | 挂起相关裁决、退回待补语境或显式拒绝,不得保存正文补齐。 |
| 派生视图 / 报告 / 对账滞后 | 暴露 stale / rebuilding / unavailable,不得反写真相。 |
| conversation / workspace / console 显化失败 | 只影响显化和协作入口,不得改变 Governance truth。 |
| observability / archive handoff 失败 | 保留待交接 / failed / retryable 语义,不得接管物理日志或归档包正文。 |
| event 重复 / 乱序 | 保持幂等、拒绝回退或挂起对账,不得生成重复裁决或 sequence regression。 |
| 自动化边界依据不足 | 保守挂起、升级人工裁决或拒绝自动完成,不得用默认超时绕过正式 Policy 授权。 |

### 3.8 哪些数据边界如果不写清,后续最容易串仓?

最容易串仓的数据边界是:

1. Gate / Decision truth 与 process waiting state。
2. Policy effective fact 与 AIPolicyDef、runtime policy cache、capability whitelist。
3. Control applicability / SoA coverage 与 Control definition、standard body。
4. AIIA / SoA governance conclusion 与 artifact / evidence / document body。
5. Nonconformity corrective loop 与 work blocker、bug、observability alert。
6. Approval / responsibility 与 identity role lifecycle。
7. governance traceability record 与 observability audit ledger / trace store。
8. Governance read model / report / dashboard / reconciliation 与 Governance truth。

---

## 4. 当前文档问题诊断

| 位置 | 当前表现 | 问题 | 本步处理 |
|---|---|---|---|
| 需求 Step 11 | 已有真相 / 快照 / 引用 / 禁止正文分类 | 需求层不展开架构一致性口径 | 本步补数据归属到一致性策略的映射 |
| 旧 `01-架构设计.md` | Gate、Policy、Control、AIIA、SoA、Nonconformity 与审计 / 报告设施混写 | 容易把正式真相、派生消费和技术承载混成一类数据 | 改为正式真相、快照 / 投影、引用关系、明确不拥有四类 |
| 旧 `01-架构设计.md` | audit store、report system、external GRC、policy engine 较早进入数据策略 | 技术设施和外围增强不能决定数据所有权 | 后移到技术选型、配置、演进或实施讨论 |
| Step 5 本地影子层 | 已定义索引 / 投影 / 引用层 | 仍需在数据所有权层说明哪些本地存在不等于拥有真相 | 本步用归属表和一致性表补边界 |
| Step 6 派生承载 | 已区分真相承载和派生承载 | 尚未说明派生滞后、失败、重建时不能反写真相 | 本步补最终一致和失败处理口径 |

---

## 5. 改动前后对比

| 维度 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 数据主语 | Gate / Policy / Control 对象线索与审计、报告、外部系统混列 | Governance 正式真相、快照 / 投影、引用关系、明确不拥有正文四类 | 架构层先判断归属,不提前进入对象模型或设施 |
| Policy 数据 | 容易与 AIPolicyDef、runtime cache、capability whitelist 合并 | Governance 只拥有 Policy effective fact 和 shared rules | 防止定义层 / 执行层反向定义 Policy truth |
| 合规数据 | AIIA / SoA 结论、正文、evidence 和 artifact 容易合并 | Governance 只拥有治理结论和引用,正文归 Artifact / Archive | 保护正文边界 |
| 派生数据 | report / dashboard / reconciliation 容易被看作事实源 | 派生消费可延迟、可重建、不得反写真相 | 防止第二 truth |
| 一致性策略 | 倾向写存储、审计和同步机制 | 按数据归属推导强一致、最终一致、引用有效性和边界约束 | 保持架构层粒度 |

---

## 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A: 沿用旧对象 / 审计 / 报告混合数据图 | 改动少 | 无法防止外部正文和派生结果反写真相 | 不采用 |
| 方案 B: 先按四类数据归属划边界,再推导一致性策略 | 能保护 Governance truth,可支撑后续详细设计 | 表格较长,后续仍需落对象 schema | 采用 |
| 方案 C: 所有治理相关数据都强一致 | 语义最硬 | 外部快照、下游显化、报告、对账和归档交接会难以实现 | 不采用 |
| 方案 D: 所有数据都最终一致 | 起步简单 | 会破坏裁决、责任、Policy、Control、合规结论和纠正闭环主真相 | 不采用 |
| 方案 E: 把 external GRC 或 audit store 写成 truth source | 贴近传统合规系统 | 会让外部系统或观测设施反向定义 Governance truth | 不采用 |

### 6.1 待确认问题的方案选择

#### AIIA / SoA 文档正文是否进入 Governance truth?

| 方案 | 内容 | 影响 |
|---|---|---|
| 方案 A | Governance 保存 AIIA / SoA 正文 | Governance 会接管 artifact / archive 正文 |
| 方案 B | Governance 只保存治理评审结论、适用性、批准结论和正文引用 | 保留治理语义,守住正文边界 |

推荐方案 B。

#### Policy cache 命中和工具执行结果是否进入 Policy truth?

| 方案 | 内容 | 影响 |
|---|---|---|
| 方案 A | 保存 cache / execution 正文作为 Policy 状态 | Runtime / capability 会反向定义 Policy |
| 方案 B | 只保存必要反馈摘要和引用,Policy effective fact 仍归 Governance | 保留追溯线索,不接管执行 truth |

推荐方案 B。

#### report / dashboard / reconciliation 是否可以作为事实来源?

| 方案 | 内容 | 影响 |
|---|---|---|
| 方案 A | 可以作为治理事实来源 | 派生层会成为第二 truth |
| 方案 B | 只能从 Governance truth 派生,不得反写 | 支撑消费和维护,同时保护核心 truth |

推荐方案 B。

---

## 7. 结构化中间产物

### 7.1 数据归属表

| 数据项 | 数据类型 | 归属说明 | 边界说明 |
|---|---|---|---|
| governance context / 治理语境 | 正式真相数据 | 由 Governance 拥有 actor、scope、适用对象、治理目的和责任语境真相。 | 不等于 process context、work context、conversation context 或 runtime context 正文。 |
| Gate / 决策请求语境 | 正式真相数据 | 由 Governance 拥有关键节点待裁决语境和正式治理裁决主语。 | 不等于 process waiting gate、conversation Gate 卡片或 UI review display。 |
| Decision / resolution | 正式真相数据 | 由 Governance 拥有正式裁决结论、结果和依据语义。 | 不等于 work lifecycle、artifact approval UI 或 external GRC status。 |
| Approval / vote / authorization responsibility | 正式真相数据 | 由 Governance 拥有审批、投票、授权、替代裁决和责任语境事实。 | 不拥有 GlobalMember、RoleDefinition、认证授权或成员生命周期正文。 |
| Policy effective fact | 正式真相数据 | 由 Governance 拥有 Policy 生效、授权、范围、优先级、冲突和替代关系。 | 不等于 AIPolicyDef、runtime cache、capability whitelist 或 tool policy implementation。 |
| shared rules / organization hard constraint | 正式真相数据 | 由 Governance 拥有组织级不可覆盖治理硬约束。 | 不得被低 scope Policy、runtime 默认值或产品入口配置覆盖。 |
| Control applicability / implementation / review fact | 正式真相数据 | 由 Governance 拥有 Control 适用、实施、复核、违反和整改关联。 | 不等于 Control definition、standard body 或 evidence body。 |
| AIIA governance conclusion | 正式真相数据 | 由 Governance 拥有影响评估的治理评审、适用性、风险和批准结论。 | AIIA 文档正文、证据正文和 baseline 正文不归 Governance。 |
| SoA governance conclusion | 正式真相数据 | 由 Governance 拥有适用性声明的控制覆盖、适用 / 排除和批准结论。 | SoA 文档正文和控制定义正文不归 Governance。 |
| Nonconformity corrective loop | 正式真相数据 | 由 Governance 拥有不符合、原因、纠正、复验、关闭和责任语境。 | 不等于 work blocker、bug、process failure 或 observability alert。 |
| governance audit / traceability record | 正式真相数据 | 由 Governance 拥有关键治理变化和消费交接的可解释追溯事实。 | 不等于 observability audit ledger、metric body、trace store 或 archive package body。 |
| process waiting / activity 摘要 | 快照 / 投影数据 | Governance 可为裁决判断保留 process 摘要。 | process 正式真相仍归 `L1-process`。 |
| project / work / iteration 摘要 | 快照 / 投影数据 | Governance 可为适用对象、风险和控制判断保留 work 摘要。 | work 正式真相仍归 `L1-work`。 |
| artifact / evidence / baseline 摘要 | 快照 / 投影数据 | Governance 可为合规评审和追溯解释保留摘要。 | artifact / evidence / baseline 正文仍归 `L1-artifact`。 |
| conversation context / display 摘要 | 快照 / 投影数据 | Governance 可保留裁决背景和显化回链摘要。 | conversation fact、消息和 UI 正文仍归 `L1-conversation` / 产品入口。 |
| actor / member / role 可承担性摘要 | 快照 / 投影数据 | Governance 可为责任和授权判断保留摘要。 | identity 正式真相仍归 `L1-identity` / `L0-core`。 |
| method / AIPolicyDef / control definition 摘要 | 快照 / 投影数据 | Governance 可为 Policy 和 Control 判断保留定义摘要。 | method-library / standard 正文仍归 `L3-method-library`。 |
| runtime / capability / policy cache feedback 摘要 | 快照 / 投影数据 | Governance 可为自动化边界和风险判断保留反馈摘要。 | runtime execution、tool result 和 cache truth 不归 Governance。 |
| observability alert / audit summary | 快照 / 投影数据 | Governance 可为复核和追溯解释保留观测摘要。 | observability ledger、metrics 和 trace store 不归 Governance。 |
| governance read model / report / dashboard / reconciliation summary | 快照 / 投影数据 | 由 Governance truth 派生,服务查询、报告、对账和管理入口消费。 | 可延迟、可重建,不得反写真相。 |
| archive handoff preparation summary | 快照 / 投影数据 | 由 Governance truth 和外部引用派生,服务归档 / 恢复交接。 | archive package body 不归 Governance。 |
| identity 相关 Ref | 引用关系数据 | Governance 只保存 actor、member、role 的引用关系。 | 引用存在不代表拥有身份正文。 |
| process 相关 Ref | 引用关系数据 | Governance 只保存 process instance、activity、waiting gate 的引用关系。 | 引用存在不代表拥有 process state 正文。 |
| work 相关 Ref | 引用关系数据 | Governance 只保存 project、work、iteration、dependency、blocker 的引用关系。 | 引用存在不代表拥有 work truth。 |
| artifact / evidence / archive 相关 Ref | 引用关系数据 | Governance 只保存 artifact、evidence、baseline、ImplementationPlan、archive package 的引用关系。 | 引用存在不代表拥有正文或归档包。 |
| conversation / trace / handoff 相关 Ref | 引用关系数据 | Governance 只保存 conversation、trace、handoff 回链。 | 引用存在不代表拥有 conversation 正文。 |
| method-library 相关 Ref | 引用关系数据 | Governance 只保存定义来源引用。 | 引用存在不代表拥有 AIPolicyDef、Control definition、method 或 standard body。 |
| runtime / capability 相关 Ref | 引用关系数据 | Governance 只保存 runtime execution、capability、tool、provider 的引用关系。 | 引用存在不代表拥有执行正文或工具结果。 |
| observability 相关 Ref | 引用关系数据 | Governance 只保存 alert、audit、metric、trace 的引用关系。 | 引用存在不代表拥有物理观测存储。 |
| process / work / artifact / conversation / identity / method-library / runtime / capability / observability / workspace / console / external GRC 正文 | 明确不拥有的正文 / 真相 | 这些正文或主真相由相邻仓、运行层、横切系统、产品入口或外部系统拥有。 | 如需参与治理语义,只能通过引用、快照、摘要、safe summary 或 Governance 自身结论表达。 |

### 7.2 一致性策略表

| 数据关系 / 场景 | 关联数据类型 | 一致性口径 | 失败处理口径 | 说明 |
|---|---|---|---|---|
| governance context 与 Gate / Decision / Approval / responsibility | 正式真相数据 ↔ 正式真相数据 | 强一致 | 明确失败或保持原状态,不得形成无语境裁决 | 裁决必须绑定明确适用对象和责任语境。 |
| Decision 与 Approval / vote / authorization responsibility | 正式真相数据 ↔ 正式真相数据 | 强一致 | 责任或授权不闭合时不得形成正式结论 | 防止无责任主体的治理裁决。 |
| Policy effective fact 与 shared rules / scope / priority / conflict | 正式真相数据 ↔ 正式真相数据 | 强一致 | 冲突未闭合或违反 shared rules 时拒绝生效 | 组织级硬约束优先于低 scope 策略。 |
| Control applicability 与 review / violation / remediation 关联 | 正式真相数据 ↔ 正式真相数据 / 引用关系数据 | 强一致 + 引用有效性一致 | 控制语境或整改引用不可解释时挂起或失败 | 控制事实必须围绕同一治理语境可解释。 |
| AIIA / SoA governance conclusion 与 evidence / baseline / document 引用 | 正式真相数据 ↔ 引用关系数据 / 快照 / 投影数据 | 强一致 + 引用有效性一致 | 证据或正文引用不可解析时挂起评审或批准 | Governance 拥有结论,但结论必须能回链材料来源。 |
| Nonconformity corrective loop 内部状态 | 正式真相数据 ↔ 正式真相数据 / 引用关系数据 | 强一致 | 原因、纠正、复验或关闭依据缺失时不得闭环 | 防止不符合被无依据关闭。 |
| governance traceability record 与关键 Governance truth 变化 | 正式真相数据 ↔ 正式真相数据 | 强一致 | 关键变化缺追溯时失败或保持原状态 | 治理事实必须可解释、可审计、可交接。 |
| 外部 truth 到 Governance 本地快照 | 明确不拥有的正文 / 真相 ↔ 快照 / 投影数据 | 最终一致 + 边界约束一致 | 标记 stale / unresolved / pending / waiting,不得复制正文补齐 | 本地快照只服务判断和解释。 |
| 外部对象引用有效性 | 引用关系数据 ↔ 明确不拥有的正文 / 真相 | 引用有效性一致 | 保持 missing / invalid / unresolved,或挂起相关裁决 | 引用成立不等于正文归属转移。 |
| Governance truth 到 read model / report / dashboard / reconciliation | 正式真相数据 ↔ 快照 / 投影数据 | 最终一致 | 暴露 stale / rebuilding / unavailable,不得反写真相 | 派生消费可延迟和重建。 |
| Governance truth 到 conversation / workspace / console 显化 | 正式真相数据 ↔ 快照 / 投影数据 / 引用关系数据 | 最终一致 | 显化失败只影响入口体验,不得改变正式裁决 | 产品入口不是 Governance truth source。 |
| Governance truth 到 observability / archive handoff | 正式真相数据 ↔ 快照 / 投影数据 / 引用关系数据 | 最终一致 + 边界约束一致 | 保留待交接 / failed / retryable 语义,不得接管日志或归档正文 | 交接失败不能改变治理事实含义。 |
| 事件协作重复或乱序 | 正式真相数据 / 快照 / 投影数据 / 引用关系数据 | 幂等一致 + 顺序约束 | 重复输入返回同一结果或忽略;乱序不得回退状态 | 防止重复裁决、重复生效和 sequence regression。 |
| 查询 / 报告 / 对账 / 归档准备维护 | 快照 / 投影数据 ↔ 正式真相数据 | 只读一致 + 不反写真相 | 维护失败只影响派生状态,不得推进业务治理事实 | 读 / 维护路径不能成为写源。 |
| 明确不拥有正文被请求写入 Governance | 明确不拥有的正文 / 真相 ↔ 正式真相数据 | 边界约束一致 | 拒绝、挂起或转换为引用 / 摘要 / safe summary,不得保存为 Governance truth | 这是防止串仓的最高优先级边界。 |

### 7.3 简化关系示意图

```text
+====================================================================+
|                       L1-governance 数据边界                        |
|                                                                    |
|   +-----------------------------+                                  |
|   | 正式真相数据                |                                  |
|   | decision / policy / control |                                  |
|   | compliance / correction     |                                  |
|   +--------------+--------------+                                  |
|                  | 派生 / 回链                                      |
|                  v                                                  |
|   +--------------+--------------+       +-------------------------+ |
|   | 快照 / 投影数据             |       | 引用关系数据            | |
|   | views / reports / summaries |       | refs / handoff links    | |
|   +--------------+--------------+       +------------+------------+ |
|                  | 不反写                            | 只引用        |
+==================+===================================+=============+
                   |                                   |
                   v                                   v
       明确不拥有的外部正文 / 外部主真相
       process / work / artifact / conversation / identity
       method / runtime / capability / observability / archive / UI / GRC
```

图示说明:

- `正式真相数据` 是 `L1-governance` 唯一可以主张拥有的治理业务真相。
- `快照 / 投影数据` 和 `引用关系数据` 可以本地存在,但不能反写核心真相或吸收外部正文。
- `明确不拥有的外部正文 / 外部主真相` 只能通过引用、摘要、safe summary 或 Governance 自身结论参与。
- 该图不表达存储设计、同步流程、事件流、对象模型或事务边界。

### 7.4 数据边界说明

`L1-governance` 的数据所有权边界是“拥有治理决策与治理控制事实,本地保留判断和消费辅助,引用外部对象和材料,明确排除外部正文”。Gate / Decision、Approval、Policy effective fact、shared rules、Control、AIIA / SoA governance conclusion、Nonconformity 和治理追溯属于 Governance;process、work、artifact、conversation、identity、method-library、runtime、capability、observability、workspace、console、archive 和 external GRC 正文不属于 Governance。快照、投影、报告、dashboard、对账和归档准备可以提升消费、解释和交接能力,但它们的延迟、失效或重建不能改变正式治理事实。后续设计如果需要写字段、表、事件、补偿或索引,必须从本章归属和一致性口径继续下沉,不能反向修改本章边界。

---

## 8. 回填草稿

正式 `01-架构设计.md` 后续整理时:

- §9 “数据所有权与一致性策略”直接摘录并整理本文件 §7.1、§7.2、§7.3 和 §7.4。
- 不在本 Step 重复粘贴完整正式章节,后续 Step 16 从结构化中间产物摘录生成正式文档。

```md
## 9. 数据所有权与一致性策略

> 校准来源:
> - `design-calibration/01_arch_step_08_data_ownership_consistency.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“SOP 问题回答”“数据归属表”“一致性策略表”“简化关系示意图”和“数据边界说明”小节,了解本章如何先确认数据归属,再推导一致性策略。

正式章节应摘录:

- `design-calibration/01_arch_step_08_data_ownership_consistency.md` §7.1 数据归属表。
- `design-calibration/01_arch_step_08_data_ownership_consistency.md` §7.2 一致性策略表。
- `design-calibration/01_arch_step_08_data_ownership_consistency.md` §7.3 简化关系示意图。
- `design-calibration/01_arch_step_08_data_ownership_consistency.md` §7.4 数据边界说明。
```

---

## 9. 待确认事项

### 9.1 待确认项处理建议

| 待确认项 | 备选方案 | 推荐方案 | 推荐理由 | 当前状态 |
|---|---|---|---|---|
| AIIA / SoA 文档正文是否进入 Governance truth | A. 进入;B. 不进入,只保存治理结论和正文引用 | B | Governance 拥有治理结论,artifact / archive 拥有正文 | 已确认采用 B |
| Policy cache / tool execution 是否进入 Policy truth | A. 进入;B. 不进入,只保存反馈摘要和引用 | B | 执行层和能力层不能反向定义 Policy effective fact | 已确认采用 B |
| report / dashboard / reconciliation 是否能作为治理写源 | A. 能;B. 不能,只能派生 | B | 派生消费和维护结果可延迟、可重建,不得成为第二 truth | 已确认采用 B |
| external GRC 是否作为 Governance truth source | A. 是;B. 否,只作为导出 / 消费 / 外围增强候选 | B | 外部系统不能替代本仓正式治理事实 | 已确认采用 B |

### 9.2 本 Step 未确认事项

本步不新增阻塞 Step 9 的待确认事项。具体字段、对象 schema、状态机、接口、事件、事务、投影、重建、报告、对账和归档交接实现留到概要 / 详细设计、关键交互、技术选型、测试方案和实施计划继续收敛。

---

## 10. 进入下一步条件

- 已明确正式真相数据、快照 / 投影数据、引用关系数据和明确不拥有的正文 / 真相。
- 已说明每类数据为什么属于当前归属边界。
- 已明确核心治理真相内部强一致、外部快照和派生最终一致、引用有效性一致、边界约束一致。
- 已明确一致性暂时不成立时的显式失败、挂起、旧视图、未解析引用、stale / pending / retryable 和禁止伪造正文口径。
- 未写数据库表、缓存 / 投影 / outbox 实现、事务机制、协议交互、事件 schema 或代码对象模型。
- 可以进入 Step 9“关键交互与通信方式”。
