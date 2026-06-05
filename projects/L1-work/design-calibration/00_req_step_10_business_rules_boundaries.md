# Step 10. 业务规则与边界约束

> 对应 SOP: `standards/document/需求文档讨论流程_SOP.md` Step 10
> 回填章节: `00-需求文档.md` §10 业务规则与边界约束
> 生成日期: 2026-06-02

---

## 1. 本步目标

把 Step 2 的仓边界、Step 7 的核心能力闭环和 Step 9 的功能需求，用需求层硬规则钉住。本步只写必须始终成立的业务规则和边界约束，不写状态机编码、数据库约束、事务边界、接口签名、事件 schema、handler / service / repository 校验逻辑或具体错误码。

---

## 2. 本步输入

| 输入 | 当前状态 | 本步使用方式 |
|---|---|---|
| `design-calibration/00_req_step_02_position_boundary.md` | Step 2 已完成 | 固定 Work 与 identity / conversation / process / governance / artifact / runtime / workspace 的边界 |
| `design-calibration/00_req_step_07_core_capability_loop.md` | Step 7 已完成 | 固定 C-1~C-5 核心闭环 |
| `design-calibration/00_req_step_09_functional_requirements.md` | Step 9 已完成 | 作为规则约束的功能能力输入 |
| `design-calibration/00_req_step_06_consumers_dependencies.md` | Step 6 已完成 | 固定依赖裁剪和禁止编译期依赖边界 |
| `projects/L1-work/00-需求文档.md` §6.2 | 旧版业务规则 | 提取 done 判据、DAG 无环、Backlog / Iteration 等规则线索 |
| `projects/L1-work/02-概要设计.md` §8~§11 | 旧版关键取舍和横切关注点 | 提取 work / runtime、work / process、work / artifact 边界规则线索 |

---

## 3. SOP 问题回答

### 3.1 哪些不变量必须始终成立？

`L1-work` 的核心不变量围绕“项目工作事实不能被相邻仓或个人执行步骤污染”：

| 不变量 | 保护目的 |
|---|---|
| Project 必须是 Work 的项目工作事实主语 | 保护 C-1 项目主语成立 |
| ProjectMember 只能表达 GlobalMember 在项目内的承担事实 | 保护 C-2 项目内成员承担成立 |
| Backlog 只能包含正式协作级工作事实 | 保护 C-3 正式工作全集成立 |
| child WorkItem 必须仍是正式协作任务，不是个人执行步骤 | 保护 C-3 正式工作全集成立 |
| Iteration 必须是 Backlog 正式工作全集的承诺子集 | 保护 C-4 承诺子集成立 |
| Work 的消费视图、对账和维护结果不得成为新的业务真相写源 | 保护 C-5 可消费可追溯成立 |

### 3.2 哪些行为必须禁止？

必须禁止的行为集中在越界写真相：

| 禁止行为 | 禁止原因 |
|---|---|
| 把 conversation suggestion / discussion text 直接写成 WorkItem | 对话不是工作真相 |
| 把 runtime plan item 或 execution step 直接写入 Backlog | runtime 不拥有 Work 真相 |
| 让 process planning 创建或维护 Backlog 真相 | planning 是节奏，不是工作全集 |
| 让 governance / artifact / workspace 反向成为 Work 真相写源 | 相邻仓只能提供结论、引用或消费视图 |
| 让查询、看板、投影、对账任务隐式创建或修改业务真相 | 消费面和维护面不得变成写源 |

### 3.3 哪些状态变化必须显式发生，不能隐式发生？

需求层只说明显式变化要求，不写具体状态机：

| 显式变化 | 原因 |
|---|---|
| 项目进入正式工作管理语境必须显式发生 | 避免查询或对话隐式创建 Project |
| GlobalMember 成为 ProjectMember 承担关系必须显式发生 | 避免平台身份被自动误认为项目承担 |
| 对话建议、计划项或治理建议进入正式工作全集必须显式发生 | 避免 Backlog 被外部建议污染 |
| plan item promote 为 child WorkItem 必须显式发生 | 保护 ImplementationPlan / WorkItem 边界 |
| 工作进入或离开 Iteration 承诺范围必须显式发生 | 保护 Backlog 全集与承诺子集边界 |
| 完成依据、阻塞依据和解除依据必须显式可追溯 | 支撑审计和消费解释 |

### 3.4 哪些边界不能被打穿？

| 边界 | 不能被打穿的内容 |
|---|---|
| Work / identity | Work 不拥有 GlobalMember、Role 或 actor 生命周期 |
| Work / conversation | Work 不拥有 conversation fact 正文、聊天消息或 trace / handoff 正文 |
| Work / method-library | Work 不拥有 TaskDefinition、WorkProductDefinition、ProcessTemplateDef 或 ViewProfile |
| Work / process | Work 不拥有 Activity、ProcessInstance 或流程推进状态 |
| Work / governance | Work 不拥有 Gate、Policy、Control、Approval 决策真相 |
| Work / artifact | Work 不拥有 Artifact、evidence、baseline 或 ImplementationPlan 正文 |
| Work / runtime | Work 不拥有 agent loop、工具调用、plan item progress 或执行步骤推进 |
| Work / workspace | Work 不拥有 PersonalWorkspace / ProjectWorkspace 聚合视图 |

### 3.5 哪些操作必须附带治理、审计或引用条件？

| 条件类型 | 操作 / 变化 | 需求层要求 |
|---|---|---|
| 治理约束 | 高风险项目生命周期变化 | 必须引用正式治理结论或受控前置 |
| 治理约束 | 高风险工作拆分、promote 或工具能力调整 | 必须满足治理 / 方法定义约束，不得由 Work 自行发明决策 |
| 引用约束 | WorkItem 完成依据 | 必须引用 artifact / evidence / baseline 等外部依据，Work 不保存正文 |
| 审计约束 | Project、ProjectMember、WorkItem、child WorkItem、Iteration 和 promote 的关键变化 | 必须形成可追溯记录 |
| 审计约束 | 对账、重建和维护动作 | 必须能说明来源、范围和结果，不得静默改变业务真相 |

---

## 4. 当前文档问题诊断

| 位置 | 当前表现 | 问题 | 处理口径 |
|---|---|---|---|
| `00-需求文档.md` §6.2 | 写 `done` 必须有 approved Artifact、DAG 无环、Project.dissolved 单向等 | 有价值，但规则与功能章节混写 | 迁移到 Step 10 规则表 |
| `00-需求文档.md` §6.2 | `Project active` 必须绑定 active ProcessProfile / ProcessInstance | 可能把 process 真相和 Work 真相绑死过重 | 改成 process 节奏 / 引用约束，具体规则后续再由详细设计收敛 |
| `00-需求文档.md` §6.2 | `tool_scope` 超出 Role 默认必须有 evidence + Policy | 方向有效，但属于外围增强和治理约束 | 保留为治理约束，不作为核心闭环规则 |
| `02-概要设计.md` §8~§9 | 强调 WorkItem / ImplementationPlan 分层、planning 不持有 Backlog、promote 走正式入口 | 是当前最重要边界 | 提升为需求层不变量 / 禁止行为 / 显式变化 |
| `02-概要设计.md` §10~§11 | 接口、数据流和横切关注点中混有规则 | 粒度偏概要和实现 | 只提取需求层硬约束，不继承接口名和数据流 |

---

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 规则位置 | 混在功能需求和概要横切关注点中 | 独立 Step 10 规则表 | 规则需要单独约束功能不串线 |
| 规则类型 | 条件 / 结果扁平列表 | 不变量、禁止行为、显式变化、边界约束、治理约束、审计约束 | 能审查规则在保护什么 |
| done 判据 | 写成业务规则但与 artifact 正文边界不清 | 写为引用 / 审计约束，正文归属后移 Step 11 | 保留完成依据，不让 Work 拥有 artifact 正文 |
| promote 规则 | 概要设计中的取舍说明 | 写成显式变化和禁止行为 | 防止 runtime 越界污染 Backlog |
| Iteration 规则 | Sprint / Iteration 与 Backlog 混写 | 写成承诺子集不变量和显式变化 | 保护全集 / 子集边界 |

---

## 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A: 沿用旧 BR-001~BR-009 | 快，保留旧规则 | 规则类型不足，混入过重 process / artifact 口径 | 不采用 |
| 方案 B: 按规则类型重写 | 能钉住边界并支撑 Step 11 数据归属 | 需要后续再细化对象状态和接口 | 采用 |
| 方案 C: 只写核心不变量 | 简洁 | 会漏掉禁止行为、显式变化和审计 / 治理要求 | 不采用 |
| 方案 D: 直接写完整状态机规则 | 看似可实现 | 超出需求层，容易和详细设计冲突 | 不采用 |

### 6.1 待确认问题的方案选择

#### 是否保留 `Project.dissolved` 单向不可恢复规则？

| 方案 | 内容 | 影响 |
|---|---|---|
| 方案 A | 在 Step 10 定死 dissolved 为单向终态 | 可能提前固定生命周期细节 |
| 方案 B | 在 Step 10 写“高风险项目终止 / 归档变化必须显式且可治理可追溯”，具体状态后移详细设计 | 保留风险控制，不提前定死状态机 |

推荐方案 B。原因是需求层要钉住显式和治理要求，具体 lifecycle 状态集后续详细设计再定。

#### 是否把 `done 必有 approved Artifact` 写成硬规则？

| 方案 | 内容 | 影响 |
|---|---|---|
| 方案 A | 原样写入 | 可能把 artifact evidence 类型提前锁死 |
| 方案 B | 写成“正式完成必须有可追溯完成依据引用，正文不归 Work”，具体 artifact 类型后移 Step 11 / Step 12 / Step 14 | 保护完成依据，同时不越界 |

推荐方案 B。原因是 Work 应钉住完成依据可追溯，不应在需求 Step 10 锁死 artifact 细节。

#### 是否把自动解除 blocked 写成规则？

| 方案 | 内容 | 影响 |
|---|---|---|
| 方案 A | 写成自动解除必须发生 | 会把外围增强升级为核心规则 |
| 方案 B | 写成阻塞和解除依据必须可解释，自动提示属于外围增强 | 保持核心规则干净 |

推荐方案 B。原因是阻塞关系必须可解释，但自动解除不是核心闭环条件。

---

## 7. 结构化中间产物

### 7.1 规则编号结论

| 规则编号 | 规则类型 | 规则内容 | 约束对象 |
|---|---|---|---|
| BR-WORK-001 | 不变量 | Project 必须作为 `L1-work` 的项目工作事实主语存在，不能退化为 conversation topic、ProcessInstance、workspace view 或 runtime context。 | Project / 仓边界 |
| BR-WORK-002 | 不变量 | ProjectMember 只能表达 GlobalMember 在具体项目内的承担事实，不得成为平台级成员身份真相。 | ProjectMember / identity 边界 |
| BR-WORK-003 | 不变量 | Backlog 只能表示项目正式工作全集，不能混入个人执行步骤、聊天建议或 runtime 局部计划项。 | Backlog / WorkItem |
| BR-WORK-004 | 不变量 | child WorkItem 必须是协作级正式子任务，不能等同于 ImplementationPlan step 或 runtime execution step。 | child WorkItem / promote 边界 |
| BR-WORK-005 | 不变量 | Iteration 必须是从正式工作全集中选择出的承诺子集，不能等同于 Backlog 全集或 process planning 活动。 | Iteration / Backlog / process 边界 |
| BR-WORK-006 | 不变量 | Work 的读模型、看板、投影、对账结果和维护报告不得成为新的业务真相写源。 | 消费面 / 维护面 |
| BR-WORK-007 | 禁止行为 | 不得由 conversation suggestion、discussion text 或 chat UI 动作直接创建正式 WorkItem。 | conversation / WorkItem 边界 |
| BR-WORK-008 | 禁止行为 | 不得由 runtime plan item、tool execution step 或 agent local checklist 直接写入 Backlog。 | runtime / Backlog 边界 |
| BR-WORK-009 | 禁止行为 | 不得由 process planning、review 或 Activity 推进直接创建或维护 Backlog 真相。 | process / Backlog 边界 |
| BR-WORK-010 | 禁止行为 | 不得由 artifact、governance、workspace 或外部消费方反向持有 Work 正式任务真相。 | 相邻仓 / Work 边界 |
| BR-WORK-011 | 禁止行为 | 查询、投影重建、对账或报告生成不得隐式创建或修改 Project、ProjectMember、WorkItem、child WorkItem 或 Iteration。 | 读 / 维护动作 |
| BR-WORK-012 | 显式变化 | 项目进入正式工作管理语境必须通过显式业务变化发生，不得由查询、对话引用或外部计划引用隐式创建。 | Project |
| BR-WORK-013 | 显式变化 | GlobalMember 成为 ProjectMember 承担关系必须显式发生，不得因成员被查询或被提及而隐式成立。 | ProjectMember |
| BR-WORK-014 | 显式变化 | 对话建议、治理建议、计划项或外部输入进入正式工作全集必须显式发生，并能说明正式化理由。 | WorkItem / Backlog |
| BR-WORK-015 | 显式变化 | plan item promote 为 child WorkItem 必须显式发生，并保留来源引用和升级理由。 | child WorkItem / promote |
| BR-WORK-016 | 显式变化 | 工作进入或离开 Iteration 承诺范围必须显式发生，不得由 process timing 或看板展示隐式改变。 | Iteration |
| BR-WORK-017 | 边界约束 | Work 不拥有 GlobalMember、Role、Actor 生命周期或身份正文。 | Work / identity 边界 |
| BR-WORK-018 | 边界约束 | Work 不拥有 conversation fact 正文、聊天消息、trace / handoff 正文或聊天界面状态。 | Work / conversation 边界 |
| BR-WORK-019 | 边界约束 | Work 不拥有 TaskDefinition、WorkProductDefinition、ProcessTemplateDef 或 ViewProfile 定义正文。 | Work / method-library 边界 |
| BR-WORK-020 | 边界约束 | Work 不拥有 Activity、ProcessInstance、checkpoint 或流程推进状态。 | Work / process 边界 |
| BR-WORK-021 | 边界约束 | Work 不拥有 Gate、Policy、Control、Approval 决策真相。 | Work / governance 边界 |
| BR-WORK-022 | 边界约束 | Work 不拥有 Artifact、evidence、baseline 或 ImplementationPlan 正文。 | Work / artifact 边界 |
| BR-WORK-023 | 边界约束 | Work 不拥有 agent loop、tool invocation、plan item progress 或执行步骤推进。 | Work / runtime 边界 |
| BR-WORK-024 | 边界约束 | Work 不拥有 PersonalWorkspace、ProjectWorkspace 或跨域 dashboard 聚合真相。 | Work / workspace 边界 |
| BR-WORK-025 | 治理约束 | 高风险项目终止、归档、恢复、关键承担变化、风险工作拆分或工具能力调整必须满足正式治理或方法定义约束。 | 高风险工作变化 |
| BR-WORK-026 | 审计约束 | Project、ProjectMember、WorkItem、child WorkItem、Iteration、promote 和完成依据等关键变化必须可追溯。 | 工作事实审计 |
| BR-WORK-027 | 审计约束 | 阻塞、解除阻塞、完成、spillover、对账和维护动作必须能解释来源、范围和结果。 | 追溯 / 维护 |

### 7.2 规则类型结论

| 规则类型 | 规则编号 |
|---|---|
| 不变量 | BR-WORK-001；BR-WORK-002；BR-WORK-003；BR-WORK-004；BR-WORK-005；BR-WORK-006 |
| 禁止行为 | BR-WORK-007；BR-WORK-008；BR-WORK-009；BR-WORK-010；BR-WORK-011 |
| 显式变化 | BR-WORK-012；BR-WORK-013；BR-WORK-014；BR-WORK-015；BR-WORK-016 |
| 边界约束 | BR-WORK-017；BR-WORK-018；BR-WORK-019；BR-WORK-020；BR-WORK-021；BR-WORK-022；BR-WORK-023；BR-WORK-024 |
| 治理约束 | BR-WORK-025 |
| 审计约束 | BR-WORK-026；BR-WORK-027 |

### 7.3 规则内容结论

本步规则内容收敛为三条主线：

1. 正式工作事实不被污染：Project、ProjectMember、Backlog、WorkItem、child WorkItem 和 Iteration 必须保持正式工作事实边界。
2. 边界外真相不被接管：identity、conversation、method-library、process、governance、artifact、runtime、workspace 的正文和决策真相不进入 Work。
3. 关键变化必须显式可追溯：项目主语、成员承担、正式工作、promote、Iteration、完成依据、阻塞 / 解除、维护对账都不能隐式发生。

### 7.4 约束对象结论

| 约束对象 | 相关规则 |
|---|---|
| Project | BR-WORK-001；BR-WORK-012；BR-WORK-025；BR-WORK-026 |
| ProjectMember | BR-WORK-002；BR-WORK-013；BR-WORK-017；BR-WORK-025；BR-WORK-026 |
| Backlog / WorkItem | BR-WORK-003；BR-WORK-007；BR-WORK-008；BR-WORK-009；BR-WORK-014；BR-WORK-026 |
| child WorkItem / promote | BR-WORK-004；BR-WORK-015；BR-WORK-023；BR-WORK-025；BR-WORK-026 |
| Iteration | BR-WORK-005；BR-WORK-016；BR-WORK-020；BR-WORK-026 |
| 消费 / 投影 / 维护 | BR-WORK-006；BR-WORK-011；BR-WORK-024；BR-WORK-027 |
| 相邻仓边界 | BR-WORK-017；BR-WORK-018；BR-WORK-019；BR-WORK-020；BR-WORK-021；BR-WORK-022；BR-WORK-023；BR-WORK-024 |

### 7.5 规则与功能映射结论

| 功能需求 | 主要规则 |
|---|---|
| FR-WORK-001 项目工作主语成立 | BR-WORK-001；BR-WORK-012；BR-WORK-025；BR-WORK-026 |
| FR-WORK-002 项目内成员承担表达 | BR-WORK-002；BR-WORK-013；BR-WORK-017；BR-WORK-025；BR-WORK-026 |
| FR-WORK-003 正式工作全集收束 | BR-WORK-003；BR-WORK-007；BR-WORK-008；BR-WORK-009；BR-WORK-010；BR-WORK-014 |
| FR-WORK-004 正式工作拆分与升级边界 | BR-WORK-004；BR-WORK-008；BR-WORK-015；BR-WORK-022；BR-WORK-023；BR-WORK-025 |
| FR-WORK-005 正式工作依赖与阻塞表达 | BR-WORK-003；BR-WORK-014；BR-WORK-026；BR-WORK-027 |
| FR-WORK-006 Iteration 承诺子集形成 | BR-WORK-005；BR-WORK-016；BR-WORK-020；BR-WORK-026 |
| FR-WORK-007 项目工作事实消费与追溯 | BR-WORK-006；BR-WORK-011；BR-WORK-017~BR-WORK-024；BR-WORK-026 |
| FR-WORK-008 项目工作事实维护与对账 | BR-WORK-006；BR-WORK-011；BR-WORK-027 |

---

## 8. 回填草稿

以下内容供 Step 17 重建正式 `00-需求文档.md` 时回填到 §10。正式文档可摘录本文件 §7.1、§7.2、§7.4 和 §7.5 的表格，不重复扩写 SOP 问题回答、文档诊断和设计取舍。

```md
## 10. 业务规则与边界约束

> 校准来源：
> - `design-calibration/00_req_step_10_business_rules_boundaries.md`
>
> 延伸阅读：
> - 建议继续阅读上述中间产物的“SOP 问题回答”“结构化中间产物”和“规则与功能映射结论”小节，了解本章如何用规则钉住功能不串线。

本文采用 `design-calibration/00_req_step_10_business_rules_boundaries.md` §7 的业务规则结论。规则分为不变量、禁止行为、显式变化、边界约束、治理约束和审计约束六类，用于保护项目工作事实不被 conversation、process、artifact、runtime、workspace 等相邻仓或个人执行步骤污染。

正式规则表应摘录：

- `design-calibration/00_req_step_10_business_rules_boundaries.md` §7.1 规则编号结论。
- `design-calibration/00_req_step_10_business_rules_boundaries.md` §7.2 规则类型结论。
- `design-calibration/00_req_step_10_business_rules_boundaries.md` §7.4 约束对象结论。
- `design-calibration/00_req_step_10_business_rules_boundaries.md` §7.5 规则与功能映射结论。
```

---

## 9. 待确认事项

| 编号 | 待确认事项 | 方案 A | 方案 B | 推荐 |
|---|---|---|---|---|
| Q-001 | 是否在 Step 10 定死 Project dissolved 为单向终态 | 定死 | 只写高风险终止 / 归档变化必须显式、治理和可追溯 | 推荐 B。原因是具体 lifecycle 状态后移详细设计 |
| Q-002 | 是否原样写 `done 必有 approved Artifact` | 原样写 | 写正式完成必须有可追溯完成依据引用，正文不归 Work | 推荐 B。原因是 artifact 类型和证据 schema 后移 |
| Q-003 | 是否把自动解除 blocked 写成核心规则 | 写成必须自动解除 | 只要求阻塞和解除依据可解释，自动提示作为外围增强 | 推荐 B。原因是自动化不是核心闭环条件 |
| Q-004 | 是否把 process planning 设为 Backlog 变更写源 | 允许 | 禁止，planning 只提供节奏或触发背景 | 推荐 B。原因是 Backlog 真相归 Work |

当前建议：接受上述推荐后进入 Step 11。

---

## 10. 进入下一步条件

- 已覆盖不变量、禁止行为、显式变化、边界约束、治理约束和审计约束。
- 规则已经足以保护 C-1~C-5 核心能力闭环不串线。
- 每条规则都有规则编号、规则类型、规则内容和约束对象。
- 已说明规则与 Step 9 功能需求的映射关系。
- 未把实现校验逻辑、接口约束、数据库约束、事务、DTO、状态机细节或数据归属矩阵写入规则表。
