# Step 3. 职责边界

> 对应 SOP: `standards/document/架构设计讨论流程_SOP.md` Step 3
> 回填章节: `01-架构设计.md` §4 职责边界
> 生成日期: 2026-06-07
> 状态: 已完成

---

## 1. 本步目标

明确 `L1-governance` 在全局职责分工中的承担范围,收稳“做什么 / 不做什么 / 易混淆职责 / 边界红线”。本步不画系统上下文图,不展开限界上下文、容器部署、数据所有权矩阵、接口协议或实现层依赖。

---

## 2. 本步输入

| 输入 | 当前状态 | 本步使用方式 |
|---|---|---|
| `design-calibration/01_arch_step_01_requirement_baseline.md` | Step 1 已完成 | 承接需求基线、硬约束和旧架构残留诊断 |
| `design-calibration/01_arch_step_02_goals_constraints.md` | Step 2 已完成 | 承接架构目标、不可变约束、取舍和非目标 |
| `projects/L1-governance/00-需求文档.md` §2 / §7 / §10 / §11 / §14 | 已重建 | 校验职责边界、核心闭环、禁止行为、数据归属和验收否决项 |
| 旧 `projects/L1-governance/01-架构设计.md` | 旧 Draft | 仅作为旧职责、旧合规硬化和旧技术假设诊断来源 |

---

## 3. SOP 问题回答

### 3.1 这个仓具体做什么?

`L1-governance` 正式承担的职责是维护治理决策与治理控制事实,并让相邻仓围绕同一份 Governance truth 协作。职责不按“审批页面 / 合规工具 / 报表模块”划分,而按仓级真相和边界划分:

| 职责 | 判断 |
|---|---|
| 承载治理语境与适用对象 | 做。Governance 需要把 actor、scope、适用对象、治理目的和责任语境收束为正式治理入口。 |
| 承载治理输入与可裁决语境 | 做。系统触发、周期复核、风险信号和相邻仓请求只能形成可解释输入,不能绕过正式裁决。 |
| 承载 Gate / Decision truth | 做。关键节点的候选、依据、决策责任、结论、取消和过期都属于正式治理裁决事实。 |
| 承载 Approval / vote / authorization responsibility | 做。审批、投票、授权和替代裁决责任需要成为可追溯治理事实。 |
| 承载 Policy effective fact | 做。Policy 的生效、授权、范围、优先级、冲突和替代关系属于 Governance truth。 |
| 承载 shared rules / organization hard constraint | 做。组织级硬约束和不可被低 scope 覆盖的规则属于 Governance 职责。 |
| 承载 Control applicability / implementation / review fact | 做。控制适用、实施、复核、违反和整改关联是治理控制事实。 |
| 承载 AIIA / SoA governance conclusion | 做。影响评估和适用性声明的治理评审、适用性、覆盖和批准结论属于 Governance。 |
| 承载 Nonconformity corrective loop | 做。不符合、原因、纠正、复验、关闭和责任语境属于 Governance 纠正闭环。 |
| 承载治理追溯事实 | 做。治理语境、裁决、Policy / Control、AIIA / SoA、Nonconformity 的关键变化和消费结果必须可解释。 |
| 维护派生消费、报告、对账和归档准备材料 | 做。它们可以服务消费和交接,但只能从 Governance truth 派生,不得改变业务治理结论。 |

### 3.2 这个仓具体不做什么?

`L1-governance` 不承担相邻真相域职责,也不保存相邻仓正文:

| 非职责 | 归属 |
|---|---|
| ProcessInstance、Activity、waiting gate state、checkpoint、recovery truth | `L1-process` |
| Project、ProjectMember、Backlog、WorkItem、child WorkItem、Iteration、dependency、blocker truth | `L1-work` |
| Artifact、Evidence、Baseline、AIIA / SoA 文档正文、ImplementationPlan 正文、archive package 正文 | `L1-artifact` / archive 相关仓 |
| conversation fact、space、participant scope、visibility、Gate 显化卡片、review display、Chat UI | `L1-conversation` / 产品入口 |
| GlobalMember、Actor、Role、认证授权、成员生命周期 truth | `L1-identity` / `L0-core` / 安全入口 |
| AIPolicyDef、Control definition、ProcessTemplateDef、RoleDefinition、method、标准正文 source truth | `L3-method-library` |
| runtime enforcement、agent loop、tool execution、policy cache 命中、plan item progress、执行日志正文 | `L2-runtime` / `L2-member-service` |
| capability registration、tool adapter、provider contract、工具调用结果 | `L3-capability-hub` |
| audit log store、metrics、trace storage、alert stream、reasoning trace 正文 | `L4-observability` |
| workspace / console UI 状态、dashboard、inbox、外部 GRC 系统 truth | `L1-workspace` / `L5-console` / external GRC |

### 3.3 哪些能力看起来相关但必须属于其他仓?

| 易混淆能力 | 必须归属 / 边界 |
|---|---|
| process waiting gate vs Governance Gate / Decision | waiting gate 是过程等待状态;正式裁决结论属于 Governance。 |
| WorkItem lifecycle / blocker vs Governance decision / Nonconformity | work 状态和 blocker 属于 Work;治理裁决和纠正闭环属于 Governance。 |
| artifact / evidence body vs AIIA / SoA conclusion | 正文和 evidence body 属于 Artifact;治理评审、批准和适用性结论属于 Governance。 |
| AIPolicyDef / ControlDefinition vs Policy effective fact / Control applicability | 定义来源属于 Method Library;生效事实和适用事实属于 Governance。 |
| runtime policy cache / tool execution vs Policy truth | cache、执行和工具调用属于 Runtime / Capability;Policy 生效和授权边界属于 Governance。 |
| identity role lifecycle vs Approval / responsibility | 成员、actor 和角色生命周期属于 Identity;审批和裁决责任事实属于 Governance。 |
| conversation Gate card / review display vs Decision truth | 显化和 UI 状态属于 Conversation / 产品入口;正式结论属于 Governance。 |
| observability audit ledger vs governance traceability fact | 物理日志、指标和 trace store 属于 Observability;治理事实的可解释追溯属于 Governance。 |
| external GRC tool vs Governance source truth | 外部 GRC 只能消费或导出 Governance facts,不得成为本仓真相来源。 |
| dashboard / report vs Governance truth | 看板和报告可以派生,不得成为新的治理业务写源。 |

### 3.4 哪些行为绝不能隐式发生?

| 禁止隐式行为 | 原因 |
|---|---|
| process waiting state、Activity、checkpoint 或 recovery 隐式创建 Gate / Decision truth | 会让过程状态替代治理裁决。 |
| Project、WorkItem、Iteration、blocker 或 dependency 状态隐式成为治理裁决 | 会让工作事实变成第二治理真相。 |
| Artifact、Evidence、AIIA / SoA 正文、baseline 或 archive package 正文写入 Governance truth | 会打穿正文归属边界。 |
| conversation turn、Gate 卡片、review display 或 UI 操作成为治理事实写源 | 会让显化层替代正式裁决。 |
| runtime cache、tool execution、agent loop、capability whitelist 或工具结果反向定义 Policy truth | 会让执行层替代治理控制事实。 |
| AIPolicyDef、control definition、template、method 或标准正文复制为 Governance source truth | 会让定义来源与生效事实混成一份真相。 |
| 低 scope Policy 覆盖 shared rules 或组织级硬约束 | 会破坏组织级治理安全边界。 |
| 自动化或默认超时在无正式 Policy 授权时完成高影响裁决 | 会绕过正式决策责任和依据要求。 |
| 查询、报表、投影重建、对账、归档准备或维护任务创建、修改、批准、关闭治理事实 | 会让读 / 维护路径反写真相。 |
| 除 `L0-core` 外把相邻仓写成编译期依赖 | 会破坏 L1 真相域平权和全局依赖裁剪。 |

### 3.5 哪些边界如果不写清,后续设计最容易串线?

最容易串线的边界是:

1. Gate / Decision truth 与 process waiting state。
2. Policy effective fact 与 AIPolicyDef、runtime cache、capability whitelist。
3. Control applicability / SoA coverage 与 Control definition / standard body。
4. AIIA / SoA governance conclusion 与 artifact / evidence body。
5. Nonconformity corrective loop 与 work blocker / bug / observability alert。
6. Approval / responsibility 与 identity role lifecycle。
7. governance traceability fact 与 observability audit ledger。
8. Governance read model / report / dashboard summary 与 Governance truth。

---

## 4. 当前文档问题诊断

| 位置 | 当前表现 | 问题 | 本步处理 |
|---|---|---|---|
| 旧 `01-架构设计.md` | Gate、Policy、Control、AIIA、SoA、Nonconformity 与旧对象草案混写 | 容易把对象细节、合规正文和技术实现直接写成职责 | 本步只按做 / 不做 / 易混淆职责收束 |
| 旧 `01-架构设计.md` | PostgreSQL、audit store、外部 GRC 和 report system 假设较早出现 | 这些属于技术选型、配置或外部集成候选,不是职责边界 | 本步不继承为职责 |
| 旧 `01-架构设计.md` | Gate 六段式和 SoA 38 控制项容易硬化为当前职责 | 新版需求已把字段级和控制基线细节后移 | 本步只固定治理语境、结论和引用边界 |
| 新版需求 §10 / §11 | 边界规则已经完整但分散 | 后续架构若不集中重述,实现阶段仍会串线 | 本步集中形成职责边界表和红线清单 |

---

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 职责表达 | Gate / Policy / Control / AIIA / SoA / Nonconformity 与实现草案混写 | 汇总为 Governance truth、控制事实、纠正闭环、追溯和维护消费职责 | 对齐架构规范 4.4 |
| 不做事项 | 旧文档只覆盖部分相邻边界 | 明确排除 process、work、artifact、conversation、identity、method-library、runtime、capability、observability、workspace、archive、external GRC | 对齐新版需求 |
| 易混淆职责 | 分散在问题和规则章节 | 单独列出 waiting gate、Policy definition、artifact body、runtime cache、identity role、observability ledger 等混淆点 | 防止后续设计串仓 |
| 边界红线 | 分散在需求规则和验收否决项 | 集中列出不得隐式发生的行为 | 便于 Step 4 之后继续承接 |

---

## 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A: 只写“Governance 做审批和合规” | 简短 | 会把 Gate、Policy、Control、AIIA、SoA、Nonconformity 压扁成泛审批 / 泛合规 | 不采用 |
| 方案 B: 按做 / 不做 / 易混淆职责拆分 | 可审查,能防串线 | 文档更长 | 采用 |
| 方案 C: 在职责边界中同时画上下文图 | 读者直观 | 越过 Step 4,混淆职责与外部关系 | 不采用 |
| 方案 D: 把所有相邻仓职责都只写成非目标 | 范围最小 | 不能解释那些必须协作但不拥有 truth 的边界 | 不采用,改为补易混淆职责 |

### 6.1 待确认问题的方案选择

#### 是否把 read model / report / reconciliation 写成 Governance 职责?

| 方案 | 内容 | 影响 |
|---|---|---|
| 方案 A | 完全排除 | 会丢失 FR-GOV-009 / FR-GOV-010 的消费、追溯、报告、对账和归档准备能力 |
| 方案 B | 写成派生消费 / 维护职责,但明确不得反写真相 | 既承接需求,又保护业务治理真相 |

推荐方案 B。

#### 是否把外部 GRC 写成 Governance 职责?

| 方案 | 内容 | 影响 |
|---|---|---|
| 方案 A | 外部 GRC 作为当前正式职责和 truth 来源 | 会让外部系统反向定义 Governance truth |
| 方案 B | 当前只作为导出 / 下游消费 / 外围增强,不拥有外部 GRC truth | 对齐需求和 Step 2 取舍 |

推荐方案 B。

#### 是否把 Policy DSL / engine 写成 Governance 职责?

| 方案 | 内容 | 影响 |
|---|---|---|
| 方案 A | 当前职责固定 DSL / engine | 会把实现机制写成职责,并提前固化技术路线 |
| 方案 B | 当前职责只固定 Policy effective fact、shared rules、scope、priority、conflict 和 authorization boundary | 保持职责清晰,技术机制后续再定 |

推荐方案 B。

---

## 7. 结构化中间产物

### 7.1 职责边界表

| 职责项 | 类型 | 说明 |
|---|---|---|
| 治理语境与适用对象承载 | 做 | 这是所有裁决、Policy、Control 和合规结论锚定同一治理上下文的入口职责。 |
| 治理输入与可裁决语境承载 | 做 | 系统触发、周期复核、风险信号和相邻仓请求必须先成为可解释输入。 |
| Gate / Decision 正式治理裁决承载 | 做 | 关键节点谁决定、依据什么、结论是什么必须由本仓形成正式事实。 |
| Approval / vote / authorization responsibility 承载 | 做 | 审批、投票、授权和替代裁决责任需要可追溯。 |
| Policy effective fact 承载 | 做 | Policy 生效、范围、优先级、冲突和替代关系不能由定义层或执行层反向定义。 |
| shared rules / organization hard constraint 承载 | 做 | 组织级硬约束必须在本仓形成不可被低 scope 覆盖的治理事实。 |
| Control applicability / implementation / review fact 承载 | 做 | 控制适用、实施、复核、违反和整改关联属于治理控制事实。 |
| AIIA / SoA governance conclusion 承载 | 做 | 影响评估和适用性声明的评审、覆盖、适用 / 排除和批准结论属于本仓。 |
| Nonconformity corrective loop 承载 | 做 | 不符合、原因、纠正、复验和关闭必须保持治理纠正语义。 |
| governance traceability fact 承载 | 做 | 治理关键变化、消费、报告、对账和归档准备必须能解释来源、范围和结果。 |
| 派生消费、报告、对账和归档准备材料维护 | 做 | 这些材料可以服务消费和交接,但只能从 Governance truth 派生。 |
| process execution truth 管理 | 不做 | ProcessInstance、Activity、waiting gate、checkpoint 和 recovery 属于 `L1-process`。 |
| work truth 管理 | 不做 | Project、WorkItem、Iteration、dependency、blocker 和项目成员事实属于 `L1-work`。 |
| artifact / evidence / AIIA / SoA / archive 正文管理 | 不做 | 正文和生命周期属于 artifact / archive 相关仓,Governance 只承载结论和引用。 |
| conversation truth / Gate 显化 / Chat UI 管理 | 不做 | 对话事实、显化卡片和 UI 状态属于 `L1-conversation` / 产品入口。 |
| identity lifecycle / authentication / platform authorization 管理 | 不做 | 成员、actor、role 生命周期和安全入口不属于 Governance truth。 |
| method definition / standard body 管理 | 不做 | AIPolicyDef、Control definition、method、template 和标准正文属于 `L3-method-library`。 |
| runtime enforcement / tool execution / policy cache 管理 | 不做 | 执行正文、cache 命中、工具调用和 plan item progress 属于运行与能力层。 |
| observability ledger / metrics / trace store 管理 | 不做 | 物理审计存储和观测正文属于 `L4-observability`。 |
| workspace / console UI 状态和 external GRC truth 管理 | 不做 | 上层入口和外部系统只能消费或导出 Governance facts。 |
| Gate / Decision 与 process waiting gate 边界 | 易混淆职责 | waiting gate 是过程等待状态,不是正式治理裁决。 |
| Policy effective fact 与 AIPolicyDef / runtime cache 边界 | 易混淆职责 | 定义和缓存可以作为来源或消费方,但不能替代本仓生效事实。 |
| Control applicability 与 Control definition / standard body 边界 | 易混淆职责 | 控制定义和标准正文不等于本仓适用、实施和复核事实。 |
| AIIA / SoA conclusion 与 artifact / evidence body 边界 | 易混淆职责 | 本仓拥有治理结论,不拥有评估文档或证据正文。 |
| Nonconformity 与 bug / blocker / alert 边界 | 易混淆职责 | 不符合纠正是治理闭环,不是普通工作阻塞或观测告警。 |
| Approval / responsibility 与 identity role lifecycle 边界 | 易混淆职责 | 裁决责任事实不等于成员或角色生命周期。 |
| governance traceability 与 observability audit ledger 边界 | 易混淆职责 | 本仓拥有可解释追溯事实,不拥有物理日志存储。 |
| Governance read model / report 与 Governance truth 边界 | 易混淆职责 | 派生消费面不得成为新的业务治理写源。 |

### 7.2 做 / 不做清单

| 类型 | 清单 |
|---|---|
| 做 | 治理语境;治理输入;Gate / Decision;Approval / responsibility;Policy effective fact;shared rules;Control;AIIA / SoA governance conclusion;Nonconformity;governance traceability;派生消费 / 报告 / 对账 / 归档准备 |
| 不做 | process truth;work truth;artifact / evidence / archive body;conversation truth / UI;identity lifecycle / auth;method definition / standard body;runtime / capability execution;observability ledger;workspace / console UI;external GRC truth |
| 易混淆职责 | Gate vs waiting gate;Policy fact vs definition / cache;Control applicability vs definition / standard;AIIA / SoA conclusion vs body;Nonconformity vs bug / blocker / alert;Approval responsibility vs role lifecycle;traceability fact vs audit ledger;read model vs truth |

### 7.3 边界红线清单

| 红线 | 说明 |
|---|---|
| 不得把 process waiting state、Activity、checkpoint 或 recovery 写成 Gate / Decision truth | 否则过程状态会替代治理裁决。 |
| 不得把 Project、WorkItem、Iteration、blocker 或 dependency 状态写成治理裁决 | 否则工作事实会变成第二治理真相。 |
| 不得把 Artifact、Evidence、AIIA / SoA 正文、baseline 或 archive package 正文写入 Governance truth | 否则正文归属边界被打穿。 |
| 不得把 conversation turn、Gate 卡片、review display 或 UI 操作当成治理事实写源 | 否则显化层会替代正式裁决。 |
| 不得把 runtime policy cache、tool execution、agent loop、capability whitelist 或工具调用结果写成 Policy truth | 否则执行层会反向定义治理控制事实。 |
| 不得把 AIPolicyDef、control definition、template、method 或标准正文复制为 Governance source truth | 否则定义来源与生效事实混淆。 |
| 不得让低 scope Policy 覆盖 shared rules 或组织级硬约束 | 否则组织级治理安全边界失效。 |
| 不得让自动化或默认超时在无正式 Policy 授权时完成高影响裁决 | 否则正式决策责任和依据要求被绕过。 |
| 不得让查询、报表、投影重建、对账、归档准备或维护任务隐式创建、修改、批准、关闭治理事实 | 否则读 / 维护路径反写真相。 |
| 不得把除 `L0-core` 外的 sibling repo 写成编译期依赖 | 否则全局依赖裁剪失效。 |

---

## 8. 回填草稿

以下内容供 Step 16 重建正式 `01-架构设计.md` 时回填。正式文档可摘录本文件 §7 的结构化结论。

```md
## 4. 职责边界

> 校准来源:
> - `design-calibration/01_arch_step_03_responsibility_boundary.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“SOP 问题回答”“结构化中间产物”和“边界红线清单”小节,了解本章如何区分 Governance 做什么、不做什么和最易混淆的仓际职责。

正式章节应摘录:

- `design-calibration/01_arch_step_03_responsibility_boundary.md` §7.1 职责边界表。
- `design-calibration/01_arch_step_03_responsibility_boundary.md` §7.2 做 / 不做清单。
- `design-calibration/01_arch_step_03_responsibility_boundary.md` §7.3 边界红线清单。
```

---

## 9. 待确认事项

本步不新增阻塞性待确认事项。后续 Step 4 需要把这些职责边界转换为正式系统上下文关系,但不应改变本步职责归属。

| 编号 | 待确认事项 | 当前状态 |
|---|---|---|
| Q-001 | Policy DSL / engine 是否进入正式技术机制 | 后续技术选型收敛;当前只固定 Policy truth 职责 |
| Q-002 | 外部 GRC 是否进入主链集成 | 当前按外围增强和下游消费处理;后续交互 / 演进章节再判断 |
| Q-003 | governance traceability fact 与 observability audit ledger 的交接方式 | 后续系统上下文、数据所有权和关键交互章节收敛 |

---

## 10. 进入下一步条件

- 已明确本仓做什么、不做什么和易混淆职责。
- 已形成边界红线清单。
- 未把系统上下文、子域划分、数据所有权、接口协议或实现方案写入本步。
- 当前没有阻塞 Step 4 的职责缺口。

结论:可以进入 Step 4 `系统边界与上下文`。
