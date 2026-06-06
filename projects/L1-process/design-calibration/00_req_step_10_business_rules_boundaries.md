# Step 10. 业务规则与边界约束

> 对应 SOP: `standards/document/需求文档讨论流程_SOP.md` Step 10
> 回填章节: `00-需求文档.md` §10 业务规则与边界约束
> 生成日期: 2026-06-05

---

## 1. 本步目标

把 Step 2 的仓边界、Step 7 的核心能力闭环和 Step 9 的功能需求,用需求层硬规则钉住。本步只写必须始终成立的业务规则和边界约束,不写状态机编码、数据库约束、事务边界、接口签名、事件 schema、handler / service / repository 校验逻辑、具体错误码或数据归属矩阵。

---

## 2. 本步输入

| 输入 | 当前状态 | 本步使用方式 |
|---|---|---|
| `design-calibration/00_req_step_02_position_boundary.md` | Step 2 已完成 | 固定 Process 与 method-library / work / governance / artifact / runtime / identity / conversation / workspace 的边界 |
| `design-calibration/00_req_step_07_core_capability_loop.md` | Step 7 已完成 | 固定 C-1~C-5 核心闭环 |
| `design-calibration/00_req_step_09_functional_requirements.md` | Step 9 已完成 | 作为规则约束的功能能力输入 |
| `design-calibration/00_req_step_06_consumers_dependencies.md` | Step 6 已完成 | 固定依赖裁剪和禁止编译期依赖边界 |
| `projects/L1-process/00-需求文档.md` §6.2 | 旧版业务规则 | 提取 Profile 冻结、checkpoint、waiting_gate、WorkItem 边界和 source drift 等规则线索 |
| `projects/L1-process/02-概要设计.md` §6~§8 | 旧版主流程和关键取舍 | 提取定义 / 运行态 / 节奏 / 恢复 / 投影边界规则线索 |

---

## 3. SOP 问题回答

### 3.1 哪些不变量必须始终成立？

`L1-process` 的核心不变量围绕“过程执行事实不能被方法定义、项目工作、治理决策、runtime 执行或展示投影污染”:

| 不变量 | 保护目的 |
|---|---|
| 运行时过程形态必须来自正式方法定义来源,但不能替代方法定义真相 | 保护 C-1 运行时过程形态成立 |
| 已被过程实例引用的运行时过程形态不得被隐式改写 | 保护 C-1 / C-2 的定义与运行稳定性 |
| ProcessInstance 必须是项目过程运行事实主语 | 保护 C-2 项目过程实例成立 |
| Activity / Token / Gateway 只能表达过程节点和流控位置 | 保护 C-3 过程节点和流控位置成立 |
| waiting gate 只能表达过程等待意图和等待语境 | 保护 C-4 暂停等待恢复连续成立 |
| checkpoint / recovery 只能表达 Instance 级恢复连续性 | 保护 C-4 暂停等待恢复连续成立 |
| Process 的读模型、投影、报告、维护和对账结果不得成为新的业务真相写源 | 保护 C-5 可消费可追溯成立 |

### 3.2 哪些行为必须禁止？

必须禁止的行为集中在越界写真相和隐式推进:

| 禁止行为 | 禁止原因 |
|---|---|
| 把 ProcessTemplateDef、TaskDefinition 或 Method Content 正文复制为 Process 真相 | 方法定义真相属于 method-library |
| 把 Project、WorkItem、Iteration 或 Backlog 变化直接写成 Process 事实 | 项目工作真相属于 work |
| 把 Process Activity 直接当成 WorkItem、ImplementationPlan step 或 runtime tool step | 会打穿 process / work / runtime 边界 |
| 把 governance Gate / Policy / decision 写成 Process 自有决策 | Process 只拥有等待意图,不拥有治理决策 |
| 把 artifact / evidence / baseline 正文写入 Process | Process 只保留过程语境和引用,不拥有产物正文 |
| 把 runtime 执行日志、工具调用正文或微步 checkpoint 写入 Process | Process 只拥有 Activity 执行语境和 Instance 级恢复事实 |
| 由查询、投影重建、报告生成或维护对账隐式创建、推进、暂停、恢复或完成过程事实 | 消费面和维护面不得成为写源 |

### 3.3 哪些状态变化必须显式发生,不能隐式发生？

需求层只说明显式变化要求,不写具体状态机:

| 显式变化 | 原因 |
|---|---|
| 方法定义进入 Process 运行时过程形态必须显式发生 | 避免方法库定义更新静默改变项目过程 |
| 运行时过程形态被项目采用或调整必须显式发生 | 避免 Profile / tailoring 语义被隐式重写 |
| 项目过程实例开始、暂停、恢复、结束或取消必须显式发生 | 避免视图、查询或外部事件隐式改变过程运行事实 |
| Activity 执行反馈影响过程推进必须显式发生 | 避免 runtime 日志或工具结果自动污染过程状态 |
| 过程进入等待治理、外部反馈或人工处理语境必须显式发生 | 避免等待原因不可解释 |
| 从 checkpoint / recovery 语境继续服务同一过程事实必须显式发生 | 避免恢复时产生多份不一致过程真相 |
| 过程执行事实被发布、投影、重建或对账时必须保留来源和范围 | 支撑消费与追溯 |

### 3.4 哪些边界不能被打穿？

| 边界 | 不能被打穿的内容 |
|---|---|
| Process / method-library | Process 不拥有 ProcessTemplateDef、TaskDefinition、RoleDefinition、WorkProductDefinition、ViewProfile 或 Method Content 正文 |
| Process / work | Process 不拥有 Project、ProjectMember、Backlog、WorkItem、child WorkItem 或 Iteration truth |
| Process / governance | Process 不拥有 Gate、Policy、Control、Approval 或 decision truth |
| Process / artifact | Process 不拥有 Artifact、Evidence、Baseline、ImplementationPlan 或 Archive Package 正文 |
| Process / runtime | Process 不拥有 agent loop、工具调用、plan item progress、runtime 微步 checkpoint 或执行日志正文 |
| Process / member-service | Process 不拥有容器生命周期、运行资源调度或 member process 管理 |
| Process / identity | Process 不拥有 GlobalMember、Actor、Role 和成员生命周期 |
| Process / conversation | Process 不拥有 conversation space、participant scope、conversation fact、可见性或聊天 UI 状态 |
| Process / workspace | Process 不拥有 workspace dashboard、跨域聚合视图或产品界面状态 |
| Process / observability / archive | Process 不拥有 reasoning trace 正文、指标存储、审计总账或归档包正文 |

### 3.5 哪些操作必须附带治理、审计或引用条件？

| 条件类型 | 操作 / 变化 | 需求层要求 |
|---|---|---|
| 治理约束 | 过程进入或离开 waiting gate | 必须能引用正式等待原因和外部决策 / 处理依据,但 Process 不拥有决策真相 |
| 治理约束 | 高风险裁剪、强制 gate 移除或关键过程规矩变更 | 必须满足正式治理或方法定义约束,不得由 Process 自行发明决策 |
| 引用约束 | Activity 关联 WorkItem、Artifact output、conversation context 或 runtime feedback | 必须以引用方式表达相邻语境,不得保存正文或接管相邻 truth |
| 审计约束 | 运行时过程形态形成、项目采用、实例运行、节点推进、等待、恢复和结束 | 必须形成可追溯记录 |
| 审计约束 | 投影重建、恢复、对账和维护动作 | 必须能说明来源、范围和结果,不得静默改变业务真相 |

---

## 4. 当前文档问题诊断

| 位置 | 当前表现 | 问题 | 处理口径 |
|---|---|---|---|
| `00-需求文档.md` §6.2 | 写 `Profile active 后 effective_activity_graph 冻结` | 有价值,但命名和字段过细 | 改为运行时过程形态被实例引用后不得隐式改写 |
| `00-需求文档.md` §6.2 | 写 `Activity complete 必写 checkpoint` | 恢复价值明确,但把机制和触发条件写得过实 | 改为影响恢复连续性的关键推进必须可恢复、可追溯 |
| `00-需求文档.md` §6.2 | 写 `Gate pending -> Activity 进 waiting_gate` | 有价值,但把状态变化和治理协作写成实现式规则 | 改为 waiting gate 只能表达等待意图,决策真相不归 Process |
| `00-需求文档.md` §6.2 | 写 `ProcessInstance.completed 不代表项目完成` | 方向正确 | 保留为 process / work 边界约束 |
| `00-需求文档.md` §6.2 | 写 planning / refinement 类 Activity 不创建 Backlog 真相 | 方向正确 | 保留为禁止行为和边界约束 |
| `00-需求文档.md` §6.2 | 写 mandatory Gate 不得被 Tailoring 去掉 | 有价值,但需要治理 / 方法定义条件 | 改为高风险裁剪和强制 gate 移除需治理或方法定义约束 |
| `00-需求文档.md` §6.2 | 写 source_fingerprint 不一致触发 drift | 有价值,但事件 / 字段细节后移 | 改为定义来源变化不得静默改变运行时过程形态 |
| 旧文档整体 | 规则与功能、接口、状态机、非功能混写 | Step 10 与后续章节边界不清 | 只提取需求层硬约束 |

---

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 规则位置 | 混在功能需求和旧概要横切关注点中 | 独立 Step 10 规则表 | 规则需要单独约束功能不串线 |
| 规则类型 | 条件 / 结果扁平列表 | 不变量、禁止行为、显式变化、边界约束、治理约束、审计约束 | 能审查规则在保护什么 |
| Profile 冻结 | 字段级 effective graph 冻结 | 被实例引用的运行时过程形态不得隐式改写 | 保留语义,避免提前锁字段 |
| checkpoint | 每 Activity 完成写 checkpoint | 恢复连续性必须可解释、可追溯 | 保留恢复价值,不提前写事务机制 |
| waiting gate | Gate pending 导致 Activity 状态 | waiting gate 是过程等待意图,不等同 governance decision | 防止 Process 接管治理 |
| 相邻协作 | artifact outputs、workitem completion policy 作为规则 / 功能 | 改为引用约束和边界约束 | 防止 Process 接管 artifact / work truth |

---

## 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A: 沿用旧 BR-001~BR-007 | 快,保留旧规则 | 字段、状态、事件和机制过实,不能覆盖最新边界 | 不采用 |
| 方案 B: 按规则类型重写 | 能钉住边界并支撑 Step 11 数据归属 | 需要后续再细化对象状态和接口 | 采用 |
| 方案 C: 只写核心不变量 | 简洁 | 会漏掉禁止行为、显式变化和审计 / 治理要求 | 不采用 |
| 方案 D: 直接写完整状态机规则 | 看似可实现 | 超出需求层,容易和详细设计冲突 | 不采用 |

### 6.1 待确认问题的方案选择

#### 是否原样保留 `Activity complete 必写 checkpoint`?

| 方案 | 内容 | 影响 |
|---|---|---|
| 方案 A | 原样写入 | 会把 checkpoint 触发机制和事务口径提前锁死 |
| 方案 B | 写成关键推进和恢复连续性必须可追溯,具体 checkpoint 规则后移设计 | 保留恢复目标,不提前写机制 |

推荐方案 B。原因是需求层要钉住恢复连续性,不是 checkpoint 写入时机和事务细节。

#### 是否原样保留 `mandatory Gate 不得被 Tailoring 去掉`?

| 方案 | 内容 | 影响 |
|---|---|---|
| 方案 A | 原样写入 | 会在需求层提前定义 gate 分类和裁剪规则 |
| 方案 B | 写成高风险裁剪、强制 gate 移除或关键过程规矩变更必须满足治理 / 方法定义约束 | 保留安全边界,细节后移规则和设计 |

推荐方案 B。原因是 mandatory gate 的具体 schema 后续再收敛,本步先钉住不能无依据移除关键规矩。

#### 是否把 `ProcessInstance completed 不代表项目完成` 保留为硬规则?

| 方案 | 内容 | 影响 |
|---|---|---|
| 方案 A | 保留 | 能清晰防止 process 接管 work 项目完成 truth |
| 方案 B | 删除 | 会削弱 process / work 边界 |

推荐方案 A。原因是这是 process 与 work 最关键的边界规则之一。

---

## 7. 结构化中间产物

### 7.1 规则编号结论

| 规则编号 | 规则类型 | 规则内容 | 约束对象 |
|---|---|---|---|
| BR-PROC-001 | 不变量 | 运行时过程形态必须来自正式方法定义来源,但不得替代 ProcessTemplateDef / TaskDefinition / Method Content 定义真相。 | runtime process shape / method-library 边界 |
| BR-PROC-002 | 不变量 | 已被项目过程实例引用的运行时过程形态不得被隐式改写;需要变化时必须形成可追溯的新语境或显式切换。 | runtime process shape / ProcessInstance |
| BR-PROC-003 | 不变量 | ProcessInstance 必须作为项目过程运行事实存在,不能退化为 workspace 进度条、runtime 执行记录或 WorkItem 状态字段。 | ProcessInstance |
| BR-PROC-004 | 不变量 | Activity / Token / Gateway 只能表达过程节点、承担语境和流控位置,不得等同 WorkItem、ImplementationPlan step 或 runtime tool step。 | Activity / Token / Gateway |
| BR-PROC-005 | 不变量 | waiting gate 只能表达过程等待意图和等待语境,不得成为 Gate / Policy / decision 真相。 | waiting gate / governance 边界 |
| BR-PROC-006 | 不变量 | checkpoint / recovery 只能表达 Instance 级恢复连续性,不得替代 runtime 微步 checkpoint、reasoning trace 或归档包正文。 | checkpoint / recovery |
| BR-PROC-007 | 不变量 | Process 的读模型、投影、报告、维护和对账结果不得成为新的过程业务真相写源。 | 消费面 / 维护面 |
| BR-PROC-008 | 禁止行为 | 不得把 ProcessTemplateDef、TaskDefinition、RoleDefinition、WorkProductDefinition、ViewProfile 或 Method Content 正文复制为 Process 自有真相。 | Process / method-library 边界 |
| BR-PROC-009 | 禁止行为 | 不得由 process planning、review、retro 或 Activity 推进直接创建或维护 Backlog / WorkItem / Iteration truth。 | Process / work 边界 |
| BR-PROC-010 | 禁止行为 | 不得把 ProcessInstance 完成、暂停或失败直接解释为 Project / WorkItem / Iteration 的完成、暂停或失败。 | Process / work 边界 |
| BR-PROC-011 | 禁止行为 | 不得把 governance 决策、approval 或 policy 判断写成 Process 自有业务决策。 | Process / governance 边界 |
| BR-PROC-012 | 禁止行为 | 不得把 Artifact、Evidence、Baseline、ImplementationPlan 或 Archive Package 正文写入 Process。 | Process / artifact 边界 |
| BR-PROC-013 | 禁止行为 | 不得把 runtime 执行日志、工具调用正文、agent loop、plan item progress 或微步 checkpoint 写入 Process。 | Process / runtime 边界 |
| BR-PROC-014 | 禁止行为 | 查询、投影重建、报告生成、恢复对账或维护任务不得隐式创建、推进、暂停、恢复或完成过程事实。 | 读 / 维护动作 |
| BR-PROC-015 | 显式变化 | 方法定义进入运行时过程形态必须显式发生,并能说明定义来源和适用语境。 | runtime process shape |
| BR-PROC-016 | 显式变化 | 项目采用、调整或切换运行时过程形态必须显式发生,不得由方法定义更新静默改变。 | process profile / tailoring |
| BR-PROC-017 | 显式变化 | 项目过程实例开始、暂停、恢复、结束或取消必须显式发生,不得由视图、查询或相邻仓状态隐式触发。 | ProcessInstance |
| BR-PROC-018 | 显式变化 | Activity 执行反馈影响过程推进必须显式发生,并绑定到正式过程节点语境。 | Activity feedback |
| BR-PROC-019 | 显式变化 | 过程进入等待治理、外部反馈或人工处理语境必须显式发生,并能说明等待原因。 | waiting gate / pause context |
| BR-PROC-020 | 显式变化 | 从 checkpoint / recovery 语境继续服务同一过程事实必须显式发生,不得静默生成第二份过程真相。 | recovery |
| BR-PROC-021 | 边界约束 | Process 不拥有 ProcessTemplateDef、TaskDefinition、RoleDefinition、WorkProductDefinition、ViewProfile 或 Method Content 正文。 | method-library 边界 |
| BR-PROC-022 | 边界约束 | Process 不拥有 Project、ProjectMember、Backlog、WorkItem、child WorkItem 或 Iteration truth。 | work 边界 |
| BR-PROC-023 | 边界约束 | Process 不拥有 Gate、Policy、Control、Approval 或 decision truth。 | governance 边界 |
| BR-PROC-024 | 边界约束 | Process 不拥有 Artifact、Evidence、Baseline、ImplementationPlan 或 Archive Package 正文。 | artifact / archive 边界 |
| BR-PROC-025 | 边界约束 | Process 不拥有 agent loop、工具调用、plan item progress、runtime 微步 checkpoint、容器生命周期或运行资源调度。 | runtime / member-service 边界 |
| BR-PROC-026 | 边界约束 | Process 不拥有 GlobalMember、Actor、Role 和成员生命周期。 | identity 边界 |
| BR-PROC-027 | 边界约束 | Process 不拥有 conversation space、participant scope、conversation fact、可见性或聊天 UI 状态。 | conversation 边界 |
| BR-PROC-028 | 边界约束 | Process 不拥有 workspace dashboard、跨域聚合视图、reasoning trace 正文、指标存储或审计总账。 | workspace / observability 边界 |
| BR-PROC-029 | 治理约束 | 高风险裁剪、强制 gate 移除或关键过程规矩变更必须满足正式治理或方法定义约束。 | tailoring / gate safety |
| BR-PROC-030 | 治理约束 | 过程进入或离开 waiting gate 必须能引用正式等待原因和外部决策 / 处理依据,但 Process 不拥有决策真相。 | waiting gate |
| BR-PROC-031 | 审计约束 | 运行时过程形态形成、项目采用、实例运行、节点推进、等待、恢复、结束和取消等关键变化必须可追溯。 | process audit |
| BR-PROC-032 | 审计约束 | 投影重建、恢复、对账和维护动作必须能说明来源、范围和结果,不得静默改变业务真相。 | maintenance audit |

### 7.2 规则类型结论

| 规则类型 | 规则编号 |
|---|---|
| 不变量 | BR-PROC-001;BR-PROC-002;BR-PROC-003;BR-PROC-004;BR-PROC-005;BR-PROC-006;BR-PROC-007 |
| 禁止行为 | BR-PROC-008;BR-PROC-009;BR-PROC-010;BR-PROC-011;BR-PROC-012;BR-PROC-013;BR-PROC-014 |
| 显式变化 | BR-PROC-015;BR-PROC-016;BR-PROC-017;BR-PROC-018;BR-PROC-019;BR-PROC-020 |
| 边界约束 | BR-PROC-021;BR-PROC-022;BR-PROC-023;BR-PROC-024;BR-PROC-025;BR-PROC-026;BR-PROC-027;BR-PROC-028 |
| 治理约束 | BR-PROC-029;BR-PROC-030 |
| 审计约束 | BR-PROC-031;BR-PROC-032 |

### 7.3 规则内容结论

本步规则内容收敛为三条主线:

1. 过程执行事实不被污染:运行时过程形态、ProcessInstance、Activity / Token / Gateway、waiting gate 和 recovery 必须保持 Process 自己的事实边界。
2. 边界外真相不被接管:method-library、work、governance、artifact、runtime、identity、conversation、workspace、observability、archive 的正文和决策真相不进入 Process。
3. 关键变化必须显式可追溯:定义进入运行时形态、项目采用、实例运行、节点推进、等待、恢复、发布、投影、对账和维护都不能隐式发生。

### 7.4 约束对象结论

| 约束对象 | 相关规则 |
|---|---|
| runtime process shape / process profile | BR-PROC-001;BR-PROC-002;BR-PROC-015;BR-PROC-016;BR-PROC-029 |
| ProcessInstance | BR-PROC-003;BR-PROC-017;BR-PROC-020;BR-PROC-031 |
| Activity / Token / Gateway | BR-PROC-004;BR-PROC-018;BR-PROC-031 |
| waiting gate / pause context | BR-PROC-005;BR-PROC-019;BR-PROC-030;BR-PROC-031 |
| checkpoint / recovery | BR-PROC-006;BR-PROC-020;BR-PROC-031;BR-PROC-032 |
| 消费 / 投影 / 维护 | BR-PROC-007;BR-PROC-014;BR-PROC-028;BR-PROC-032 |
| 相邻仓边界 | BR-PROC-008~BR-PROC-013;BR-PROC-021~BR-PROC-028 |

### 7.5 规则与功能映射结论

| 功能需求 | 主要规则 |
|---|---|
| FR-PROC-001 运行时过程形态形成 | BR-PROC-001;BR-PROC-002;BR-PROC-015;BR-PROC-016;BR-PROC-021;BR-PROC-029 |
| FR-PROC-002 项目过程实例成立 | BR-PROC-003;BR-PROC-010;BR-PROC-017;BR-PROC-022;BR-PROC-031 |
| FR-PROC-003 过程节点与流控位置表达 | BR-PROC-004;BR-PROC-009;BR-PROC-018;BR-PROC-022;BR-PROC-031 |
| FR-PROC-004 Activity 执行语境与反馈绑定 | BR-PROC-004;BR-PROC-013;BR-PROC-018;BR-PROC-025;BR-PROC-031 |
| FR-PROC-005 暂停等待与恢复语境表达 | BR-PROC-005;BR-PROC-011;BR-PROC-019;BR-PROC-023;BR-PROC-030;BR-PROC-031 |
| FR-PROC-006 过程事实恢复连续性维护 | BR-PROC-006;BR-PROC-020;BR-PROC-025;BR-PROC-028;BR-PROC-031;BR-PROC-032 |
| FR-PROC-007 过程执行事实消费与追溯 | BR-PROC-007;BR-PROC-014;BR-PROC-021~BR-PROC-028;BR-PROC-031 |
| FR-PROC-008 过程执行事实维护与对账 | BR-PROC-007;BR-PROC-014;BR-PROC-020;BR-PROC-032 |

---

## 8. 回填草稿

以下内容供 Step 17 重建正式 `00-需求文档.md` 时回填到 §10。正式文档可摘录本文件 §7.1、§7.2、§7.4 和 §7.5 的表格,不重复扩写 SOP 问题回答、文档诊断和设计取舍。

```md
## 10. 业务规则与边界约束

> 校准来源:
> - `design-calibration/00_req_step_10_business_rules_boundaries.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“SOP 问题回答”“结构化中间产物”和“规则与功能映射结论”小节,了解本章如何用规则钉住功能不串线。

本文采用 `design-calibration/00_req_step_10_business_rules_boundaries.md` §7 的业务规则结论。规则分为不变量、禁止行为、显式变化、边界约束、治理约束和审计约束六类,用于保护过程执行事实不被 method-library、work、governance、artifact、runtime、identity、conversation、workspace、observability、archive 等相邻仓污染。

正式规则表应摘录:

- `design-calibration/00_req_step_10_business_rules_boundaries.md` §7.1 规则编号结论。
- `design-calibration/00_req_step_10_business_rules_boundaries.md` §7.2 规则类型结论。
- `design-calibration/00_req_step_10_business_rules_boundaries.md` §7.4 约束对象结论。
- `design-calibration/00_req_step_10_business_rules_boundaries.md` §7.5 规则与功能映射结论。
```

---

## 9. 待确认事项

| 编号 | 待确认事项 | 方案 A | 方案 B | 推荐 |
|---|---|---|---|---|
| Q-001 | 是否原样保留 `Activity complete 必写 checkpoint` | 原样写入 | 改为恢复连续性必须可追溯,checkpoint 细节后移 | 推荐 B。原因是需求层要钉住恢复连续性,不是写入时机 |
| Q-002 | 是否原样保留 `mandatory Gate 不得被 Tailoring 去掉` | 原样写入 | 改为高风险裁剪、强制 gate 移除或关键过程规矩变更必须满足治理 / 方法定义约束 | 推荐 B。原因是 mandatory gate schema 后续再收敛 |
| Q-003 | 是否保留 `ProcessInstance completed 不代表项目完成` | 保留 | 删除 | 推荐 A。原因是这是 process / work 边界的关键规则 |
| Q-004 | 是否把 process planning 设为 Backlog 变更写源 | 允许 | 禁止,planning 只提供节奏或触发背景 | 推荐 B。原因是 Backlog 真相归 Work |

当前建议:接受上述推荐后进入 Step 11。

---

## 10. 进入下一步条件

- 已覆盖不变量、禁止行为、显式变化、边界约束、治理约束和审计约束。
- 规则已经足以保护 C-1~C-5 核心能力闭环不串线。
- 每条规则都有规则编号、规则类型、规则内容和约束对象。
- 已说明规则与 Step 9 功能需求的映射关系。
- 未把实现校验逻辑、接口约束、数据库约束、事务、DTO、状态机细节或数据归属矩阵写入规则表。
