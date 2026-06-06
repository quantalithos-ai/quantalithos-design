# Step 11. 数据需求与数据归属

> 对应 SOP: `standards/document/需求文档讨论流程_SOP.md` Step 11
> 回填章节: `00-需求文档.md` §11 数据需求与数据归属
> 生成日期: 2026-06-06

---

## 1. 本步目标

明确 `L1-governance` 在需求层拥有哪些治理决策与治理控制事实真相、哪些只是外部快照、哪些只是引用、哪些正文绝不能保存。本步不写字段清单、数据库表、索引、缓存、事务、outbox / projection / rebuild、repo / service / port、DDL、保留期或归档实现策略。

---

## 2. 本步输入

| 输入 | 当前状态 | 本步使用方式 |
|---|---|---|
| `design-calibration/00_req_step_02_position_boundary.md` | Step 2 已完成 | 固定 Governance 是治理决策与治理控制真相仓 |
| `design-calibration/00_req_step_06_consumers_dependencies.md` | Step 6 已完成 | 固定上游 / 下游依赖和禁止编译期依赖 |
| `design-calibration/00_req_step_09_functional_requirements.md` | Step 9 已完成 | 固定功能能力需要的数据支撑 |
| `design-calibration/00_req_step_10_business_rules_boundaries.md` | Step 10 已完成 | 固定禁止保存正文和相邻仓边界规则 |
| 旧 `projects/L1-governance/00-需求文档.md` §9 | 旧版数据需求 | 提取 Gate、Approval、Policy、Control、AIIA、SoA、Nonconformity 等数据线索 |
| `domain/governance/README.md` | 旧治理域详细设计 | 提取治理事实和相邻仓引用线索,不继承字段表、数据库表或事件 payload |

---

## 3. SOP 问题回答

### 3.1 哪些数据由本仓拥有真相?

`L1-governance` 拥有治理决策与治理控制事实本身的真相:

| 真相数据 | 原因 |
|---|---|
| governance context / 治理语境 | actor、scope、适用对象、治理目的和责任语境归 Governance |
| Gate / 决策请求语境 | 关键节点待裁决语境和正式治理裁决主语归 Governance |
| Decision / resolution | 正式裁决结论和依据归 Governance |
| Approval / vote / authorization responsibility | 审批、投票、授权和替代裁决责任归 Governance |
| Policy effective fact | Policy 生效、授权、范围、优先级、冲突和替代关系归 Governance |
| shared rules / organization hard constraint | 组织级硬约束和不可覆盖语义归 Governance |
| Control applicability / implementation / review fact | Control 适用、实施、复核和违反事实归 Governance |
| AIIA governance conclusion | 影响评估的治理评审、适用性、风险结论和批准结论归 Governance |
| SoA governance conclusion | 适用性声明的控制覆盖、适用 / 排除和批准结论归 Governance |
| Nonconformity corrective loop | 不符合、原因、纠正、复验、关闭和责任语境归 Governance |
| governance audit / traceability record | Governance 关键变化的追溯事实归 Governance |

### 3.2 哪些数据只是快照?

快照数据来自外部真相仓,Governance 可为稳定判断、裁决或追溯保留摘要,但不形成独立真相:

| 快照数据 | 上游真相 |
|---|---|
| process waiting / activity 摘要 | `L1-process` |
| project / work / iteration 摘要 | `L1-work` |
| artifact / evidence / baseline 摘要 | `L1-artifact` |
| conversation context / display 摘要 | `L1-conversation` |
| actor / member / role 可承担性摘要 | `L1-identity` |
| method / AIPolicyDef / control definition 摘要 | `L3-method-library` |
| runtime / capability / policy cache feedback 摘要 | `L2-runtime` / `L3-capability-hub` |
| observability alert / audit summary | `L4-observability` |
| governance read model / report / dashboard summary | Governance 真相派生,不是独立业务真相 |

### 3.3 哪些数据只是引用?

引用数据只保存外部对象的引用关系,不拥有正文或生命周期:

| 引用数据 | 外部对象 |
|---|---|
| ProcessInstanceRef / ActivityRef / WaitingGateRef | `L1-process` |
| ProjectRef / ProjectMemberRef / WorkItemRef / IterationRef / DependencyRef / BlockerRef | `L1-work` |
| ArtifactRef / EvidenceRef / BaselineRef / ImplementationPlanRef / ArchivePackageRef | `L1-artifact` / `L4-archive` |
| ConversationSpaceRef / ConversationFactRef / TraceContextRef / HandoffRef | `L1-conversation` |
| ActorRef / GlobalMemberRef / RoleRef | `L1-identity` / `L0-core` |
| AIPolicyDefRef / ControlDefinitionRef / MethodRef / ProcessTemplateDefRef | `L3-method-library` |
| RuntimeExecutionRef / CapabilityRef / ToolRef / ProviderRef | `L2-runtime` / `L3-capability-hub` |
| ObservabilityRef / AuditLogRef / MetricRef / AlertRef | `L4-observability` |

### 3.4 哪些内容绝不能保存正文?

| 禁止保存正文 | 原因 |
|---|---|
| ProcessInstance、Activity、waiting gate、checkpoint、recovery 正文 | process 真相不归 Governance |
| Project、ProjectMember、Backlog、WorkItem、Iteration、dependency、blocker 正文 | work 真相不归 Governance |
| Artifact、Evidence、Baseline、ImplementationPlan、AIIA / SoA 文档正文和 Archive Package 正文 | artifact / archive 正文不归 Governance |
| conversation fact、聊天消息、Gate 卡片、review display、visibility、trace / handoff 正文 | conversation 真相和 UI 显化不归 Governance |
| GlobalMember、Actor、Role、认证授权和成员生命周期正文 | identity 真相不归 Governance |
| AIPolicyDef、Control definition、method、template 和标准正文 | method-library / 标准原文不归 Governance |
| runtime enforcement、agent loop、tool execution、policy cache、plan item progress、execution log 正文 | runtime / capability 执行真相不归 Governance |
| audit log store、metrics、trace storage、alert stream、workspace dashboard 和 external GRC system 正文 | observability、workspace、console 和外部系统真相不归 Governance |

### 3.5 这些数据在需求层面的生命周期口径是什么?

| 数据类型 | 生命周期口径 |
|---|---|
| 真相数据 | 在 Governance 内由正式业务变化建立、变化和终止,形成完整 Governance 生命周期 |
| 快照数据 | 随上游正式真相变化而更新,只服务稳定判断、裁决和追溯解释,不形成独立生命周期 |
| 引用数据 | 随引用关系建立、变化或失效而变化,本仓不负责正文生命周期 |
| 禁止保存正文 | 不进入 Governance 仓生命周期 |

---

## 4. 当前文档问题诊断

| 位置 | 当前表现 | 问题 | 处理口径 |
|---|---|---|---|
| 旧 `00-需求文档.md` §9.1 | 把 Gate、Approval、Policy、Control、AIIA、SoA、Nonconformity 列为实体和状态 | 方向有价值,但以对象 / 状态表呈现,缺少快照、引用和禁止正文 | 保留为真相数据线索,补四类归属 |
| 旧 `00-需求文档.md` §9.2 | ER 草图把 Gate、Policy、Control、AIIA / SoA、Nonconformity 连接成对象图 | 有关系线索,但偏字段和对象关系 | 转译为需求层真相数据,不写字段关系 |
| 旧 `00-需求文档.md` §9.3 | 写 7 年保留、冷存、归档策略 | 滑入存储实现和归档策略 | 后移配置 / 架构 / 实施;本步只写需求层生命周期口径 |
| `domain/governance/README.md` | 字段表中包含 artifact_ref、audit_log_ref、policy cache、event data 等 | 可作引用和快照线索,但不能直接写成 Governance 正文 | 分别落入真相数据、快照、引用或禁止保存正文 |
| 旧文档整体 | AIIA / SoA 双身份、Control evidence、Policy cache、Gate UI、observability audit 多处混写 | 容易打穿 artifact、runtime、conversation、observability 边界 | 用四类数据归属明确正文不进入 Governance |

---

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 数据表达 | 核心实体 + 生命周期 + ER 草图 + 保留策略 | 真相 / 快照 / 引用 / 禁止保存正文 | 对齐需求规范 4.11 |
| Gate / Approval | 以字段和状态呈现 | 作为治理裁决和责任真相,字段后移 | 保留裁决价值,不提前设计 |
| Policy | 容易与 runtime cache、capability whitelist 和 AIPolicyDef 混写 | Governance 拥有 Policy effective fact,其他只可快照或引用 | 防止执行层和定义层反向定义 Policy truth |
| AIIA / SoA | 容易把治理结论和文档正文合并 | Governance 拥有评审结论,artifact 拥有正文 | 保护 artifact / Governance 边界 |
| audit / report | 容易成为 audit store 或 dashboard 数据 | Governance 只拥有自身追溯事实和派生报告语境 | 保护 observability / workspace 边界 |

---

## 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A: 沿用旧实体 / 状态表 | 快,能覆盖主要对象 | 漏掉快照 / 引用 / 禁止正文,并容易混入字段和保留策略 | 不采用 |
| 方案 B: 按四类数据归属重写 | 能防止相邻仓正文进入 Governance | 表格更多,需要后续详细设计再落字段 | 采用 |
| 方案 C: 只写 Governance 真相数据 | 简洁 | 无法约束外部快照、引用和禁止正文 | 不采用 |
| 方案 D: 直接写字段级归属和保留期 | 接近实现 | 违反需求层粒度,容易和详细设计 / 配置冲突 | 不采用 |

### 6.1 待确认问题的方案选择

#### 是否把 AIIA / SoA 文档正文作为 Governance 真相数据?

| 方案 | 内容 | 影响 |
|---|---|---|
| 方案 A | Governance 保存 AIIA / SoA 正文 | Governance 会越界成为 artifact / compliance document 仓 |
| 方案 B | Governance 只保存治理评审结论、适用性和正文引用 | 守住 artifact 正文边界 |

推荐方案 B。原因是 Step 10 已明确 Governance 不拥有 artifact / evidence 正文。

#### 是否把 Policy cache 命中和工具执行结果作为 Policy 真相?

| 方案 | 内容 | 影响 |
|---|---|---|
| 方案 A | 保存 cache / execution 正文方便追溯 | 会让 runtime / capability-hub 反向定义 Policy |
| 方案 B | 只保存必要反馈摘要和引用,Policy effective fact 仍归 Governance | 保留追溯价值,不接管执行 truth |

推荐方案 B。原因是 Step 10 已明确执行层消费 Policy,不定义 Policy truth。

#### 是否把 audit log store 写成 Governance 数据?

| 方案 | 内容 | 影响 |
|---|---|---|
| 方案 A | Governance 拥有审计存储 | 会与 observability 边界冲突 |
| 方案 B | Governance 拥有自身追溯事实和 AuditLogRef,物理 audit store 属于 observability | 保留可审计性,不接管观测存储 |

推荐方案 B。原因是 Governance facts 必须可审计,但 audit log store 不归 Governance。

---

## 7. 结构化中间产物

### 7.1 数据项分类结论

| 数据项 | 数据类型 | 归属说明 | 生命周期口径 |
|---|---|---|---|
| governance context / 治理语境 | 真相数据 | 治理语境由 Governance 拥有正式 truth。 | 随正式治理语境建立、变化或失效而变化。 |
| Gate / 决策请求语境 | 真相数据 | 关键节点待裁决语境和正式治理裁决主语由 Governance 拥有 truth。 | 随 Gate 显式提出、评审、裁决、取消或过期而变化。 |
| Decision / resolution | 真相数据 | 正式裁决结论和依据由 Governance 拥有 truth。 | 随正式裁决形成而建立;纠正或改变必须形成新治理事实。 |
| Approval / vote / authorization responsibility | 真相数据 | 审批、投票、授权和替代裁决责任由 Governance 拥有 truth。 | 随责任建立、投票、撤销或替代而变化。 |
| Policy effective fact | 真相数据 | Policy 生效、授权、范围、优先级、冲突和替代关系由 Governance 拥有 truth。 | 随 Policy 显式生效、替代、退役或冲突处理而变化。 |
| shared rules / organization hard constraint | 真相数据 | 组织级硬约束和不可覆盖语义由 Governance 拥有 truth。 | 随正式治理评审或批准条件变化而变化。 |
| Control applicability / implementation / review fact | 真相数据 | Control 适用、实施、复核和违反事实由 Governance 拥有 truth。 | 随控制适用、实施、复核、违反或整改关联而变化。 |
| AIIA governance conclusion | 真相数据 | AIIA 治理评审、适用性、风险和批准结论由 Governance 拥有 truth。 | 随提交、评审、批准、替代或作废而变化。 |
| SoA governance conclusion | 真相数据 | SoA 控制覆盖、适用 / 排除和批准结论由 Governance 拥有 truth。 | 随适用性声明评审、批准、替代或作废而变化。 |
| Nonconformity corrective loop | 真相数据 | 不符合、原因、纠正、复验、关闭和责任语境由 Governance 拥有 truth。 | 随提出、原因确认、纠正、复验和关闭而变化。 |
| governance audit / traceability record | 真相数据 | Governance 关键变化的追溯事实由 Governance 拥有 truth。 | 随关键治理变化形成,不被读模型或外部审计存储替代。 |
| process waiting / activity 摘要 | 快照数据 | process 正文不属于 Governance,但 Governance 可保留裁决所需摘要。 | 随 process 上游正式真相变化而更新,不形成独立生命周期。 |
| project / work / iteration 摘要 | 快照数据 | work 正文不属于 Governance,但 Governance 可保留治理判断所需摘要。 | 随 work 上游正式真相变化而更新,不形成独立生命周期。 |
| artifact / evidence / baseline 摘要 | 快照数据 | artifact 正文不属于 Governance,但 Governance 可保留评审和追溯所需摘要。 | 随 artifact 上游正式真相变化而更新,不形成独立生命周期。 |
| conversation context / display 摘要 | 快照数据 | conversation 正文和 UI 显化不属于 Governance,但可保留裁决背景摘要。 | 随 conversation 上游正式真相变化而更新,不形成独立生命周期。 |
| actor / member / role 可承担性摘要 | 快照数据 | identity 正文不属于 Governance,但可保留责任判断所需摘要。 | 随 identity 上游正式真相变化而更新,不形成独立生命周期。 |
| method / AIPolicyDef / control definition 摘要 | 快照数据 | method-library 定义正文不属于 Governance,但可保留策略 / 控制判断所需摘要。 | 随 method-library 上游正式真相变化而更新,不形成独立生命周期。 |
| runtime / capability / policy cache feedback 摘要 | 快照数据 | runtime / capability 执行正文不属于 Governance,但可保留反馈判断所需摘要。 | 随 runtime / capability 上游正式真相变化而更新,不形成独立生命周期。 |
| observability alert / audit summary | 快照数据 | observability 存储不属于 Governance,但可保留治理判断所需摘要。 | 随 observability 上游正式真相变化而更新,不形成独立生命周期。 |
| governance read model / report / dashboard summary | 快照数据 | Governance read model 由 Governance truth 派生,但不形成新的业务真相。 | 随 Governance 正式真相变化而更新,不形成独立生命周期。 |
| process 相关 Ref | 引用数据 | Governance 只保存 process 引用关系,不拥有过程正文。 | 随引用关系建立、变化或失效而变化,本仓不负责正文生命周期。 |
| work 相关 Ref | 引用数据 | Governance 只保存项目工作引用关系,不拥有工作正文。 | 随引用关系建立、变化或失效而变化,本仓不负责正文生命周期。 |
| artifact / evidence / archive 相关 Ref | 引用数据 | Governance 只保存产物、证据和归档引用关系,不拥有外部正文。 | 随引用关系建立、变化或失效而变化,本仓不负责正文生命周期。 |
| conversation / trace / handoff 相关 Ref | 引用数据 | Governance 只保存对话和 trace / handoff 引用,不拥有 conversation 正文。 | 随引用关系建立、变化或失效而变化,本仓不负责正文生命周期。 |
| identity 相关 Ref | 引用数据 | Governance 只保存成员、actor 和角色引用,不拥有身份正文。 | 随引用关系建立、变化或失效而变化,本仓不负责正文生命周期。 |
| method-library 相关 Ref | 引用数据 | Governance 只保存定义引用,不拥有定义正文。 | 随引用关系建立、变化或失效而变化,本仓不负责正文生命周期。 |
| runtime / capability 相关 Ref | 引用数据 | Governance 只保存执行或能力相关引用,不拥有运行正文。 | 随引用关系建立、变化或失效而变化,本仓不负责正文生命周期。 |
| observability 相关 Ref | 引用数据 | Governance 只保存观测或审计引用,不拥有观测正文或存储。 | 随引用关系建立、变化或失效而变化,本仓不负责正文生命周期。 |
| 外部正文集合 | 禁止保存正文 | 相邻仓正文不属于 Governance truth 范围,本仓不得保存其正文。 | 不进入 Governance 仓生命周期。 |

### 7.2 数据类型结论

| 数据类型 | 数据项 |
|---|---|
| 真相数据 | governance context / 治理语境;Gate / 决策请求语境;Decision / resolution;Approval / vote / authorization responsibility;Policy effective fact;shared rules / organization hard constraint;Control applicability / implementation / review fact;AIIA governance conclusion;SoA governance conclusion;Nonconformity corrective loop;governance audit / traceability record |
| 快照数据 | process waiting / activity 摘要;project / work / iteration 摘要;artifact / evidence / baseline 摘要;conversation context / display 摘要;actor / member / role 可承担性摘要;method / AIPolicyDef / control definition 摘要;runtime / capability / policy cache feedback 摘要;observability alert / audit summary;governance read model / report / dashboard summary |
| 引用数据 | process 相关 Ref;work 相关 Ref;artifact / evidence / archive 相关 Ref;conversation / trace / handoff 相关 Ref;identity 相关 Ref;method-library 相关 Ref;runtime / capability 相关 Ref;observability 相关 Ref |
| 禁止保存正文 | process 正文;work 正文;artifact / evidence / baseline / AIIA / SoA / archive 正文;conversation / UI 正文;identity 正文;method-library / 标准原文;runtime / capability 执行正文;observability / workspace / console / external GRC 正文 |

### 7.3 归属说明结论

| 归属类别 | 结论 |
|---|---|
| Governance 真相 | Governance 只拥有治理决策与治理控制事实真相,包含治理语境、Gate / Decision、Approval、Policy、shared rules、Control、AIIA / SoA 结论、Nonconformity 和追溯记录。 |
| 外部快照 | Governance 可保存必要摘要以支撑稳定判断、裁决和追溯解释,但快照不得成为独立真相。 |
| 外部引用 | Governance 可保存对相邻仓对象的引用关系,但不得负责外部正文生命周期。 |
| 禁止正文 | 所有相邻仓正文、运行时执行正文、观测正文、UI 显化正文和外部 GRC 正文都不得进入 Governance truth 范围。 |

### 7.4 生命周期口径结论

| 数据类型 | 生命周期口径 |
|---|---|
| 真相数据 | 在 Governance 内由正式业务变化建立、变化和终止,形成完整 Governance 生命周期。 |
| 快照数据 | 随上游正式真相变化而更新,只服务稳定判断、裁决和追溯解释,不形成独立生命周期。 |
| 引用数据 | 随引用关系建立、变化或失效而变化,本仓不负责正文生命周期。 |
| 禁止保存正文 | 不进入 Governance 仓生命周期。 |

### 7.5 数据归属与规则映射结论

| 规则 | 数据归属支撑 |
|---|---|
| BR-GOV-001~BR-GOV-011 | 通过真相数据范围保护 governance context、Gate / Decision、Approval、Policy、Control、AIIA / SoA、Nonconformity 和消费面边界 |
| BR-GOV-012~BR-GOV-020 | 通过禁止正文和快照 / 引用分类防止外部内容隐式写入 Governance truth |
| BR-GOV-021~BR-GOV-027 | 通过真相数据生命周期要求关键变化显式发生 |
| BR-GOV-028~BR-GOV-035 | 通过禁止保存正文和引用数据分类保护相邻仓边界 |
| BR-GOV-036~BR-GOV-040 | 通过外部引用、快照和审计 / 追溯 truth 支撑治理、自动化、严重不符合、消费和维护解释 |

---

## 8. 回填草稿

以下内容供 Step 17 重建正式 `00-需求文档.md` 时回填到 §11。正式文档可摘录本文件 §7.1~§7.5 的表格,不重复扩写 SOP 问题回答、文档诊断和设计取舍。

```md
## 11. 数据需求与数据归属

> 校准来源:
> - `design-calibration/00_req_step_11_data_ownership.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“SOP 问题回答”“结构化中间产物”和“数据归属与规则映射结论”小节,了解本章如何用数据归属承接边界规则。

本文采用 `design-calibration/00_req_step_11_data_ownership.md` §7 的数据归属结论。`L1-governance` 只拥有治理决策与治理控制事实真相;相邻仓数据只可作为快照或引用进入;process、work、artifact、conversation、identity、method-library、runtime、capability-hub、observability、workspace、console 和外部 GRC 的正文不得保存到 Governance。

正式数据归属表应摘录:

- `design-calibration/00_req_step_11_data_ownership.md` §7.1 数据项分类结论。
- `design-calibration/00_req_step_11_data_ownership.md` §7.2 数据类型结论。
- `design-calibration/00_req_step_11_data_ownership.md` §7.3 归属说明结论。
- `design-calibration/00_req_step_11_data_ownership.md` §7.4 生命周期口径结论。
- `design-calibration/00_req_step_11_data_ownership.md` §7.5 数据归属与规则映射结论。
```

---

## 9. 待确认事项

| 编号 | 待确认事项 | 方案 A | 方案 B | 推荐 |
|---|---|---|---|---|
| Q-001 | 是否把 AIIA / SoA 文档正文作为 Governance 真相数据 | 是 | 只保存治理评审结论、适用性和正文引用 | 推荐 B。原因是 artifact / evidence 正文不归 Governance |
| Q-002 | 是否把 Policy cache 命中和工具执行结果作为 Policy 真相 | 是 | 只保存必要反馈摘要和引用 | 推荐 B。原因是执行层消费 Policy,不定义 Policy truth |
| Q-003 | 是否把 audit log store 写成 Governance 数据 | 是 | Governance 拥有自身追溯事实和 AuditLogRef,物理 audit store 属于 observability | 推荐 B。原因是 audit log store 不归 Governance |
| Q-004 | 是否把 read model / report / dashboard 作为独立真相数据 | 是 | 作为派生快照 / 消费数据 | 推荐 B。原因是读模型和报表不得成为写源 |

当前建议:接受上述推荐后进入 Step 12。

---

## 10. 进入下一步条件

- 已明确真相数据、快照数据、引用数据和禁止保存正文四类数据。
- 每条数据项都有数据类型、归属说明和生命周期口径。
- 已明确 process、work、artifact、conversation、identity、method-library、runtime、capability-hub、observability、workspace、console 和 external GRC 等外部正文不得进入 Governance。
- 已说明数据归属如何支撑 Step 10 的边界规则。
- 未写字段清单、表结构、索引、事务、缓存、outbox / projection / rebuild、repo / service / port、DDL、保留期或归档实现策略。
