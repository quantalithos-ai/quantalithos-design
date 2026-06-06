# Step 3. 职责边界

> 对应 SOP: `standards/document/架构设计讨论流程_SOP.md` Step 3
> 回填章节: `01-架构设计.md` §4 职责边界
> 生成日期: 2026-06-05

---

## 1. 本步目标

明确 `L1-process` 在全局职责分工中的承担范围,收稳“做什么 / 不做什么 / 易混淆职责 / 边界红线”。本步不画系统上下文图,不展开限界上下文、容器部署、数据所有权矩阵、接口协议或实现层依赖。

---

## 2. 本步输入

| 输入 | 当前状态 | 本步使用方式 |
|---|---|---|
| `design-calibration/01_arch_step_01_requirement_baseline.md` | Step 1 已完成 | 承接需求基线和架构硬约束 |
| `design-calibration/01_arch_step_02_goals_constraints.md` | Step 2 已完成 | 承接架构目标、不可变约束、取舍和非目标 |
| `projects/L1-process/00-需求文档.md` §2 / §10 / §11 / §14 | 已重建 | 校验职责边界、禁止行为、数据归属和验收否决项 |
| 旧 `projects/L1-process/01-架构设计.md` | 旧 Draft | 仅作为旧职责线索和残留风险诊断来源 |

---

## 3. SOP 问题回答

### 3.1 这个仓具体做什么?

`L1-process` 正式承担的职责是维护过程执行事实,并让相邻仓围绕这些事实协作。职责不按“功能按钮”划分,而按仓级真相和边界划分:

| 职责 | 判断 |
|---|---|
| 承载运行时过程形态 | 做。Process 消费方法定义来源,形成可执行的 runtime process shape / runtime index。 |
| 承载 ProcessProfile | 做。Process 维护项目采用和裁剪后的过程语境。 |
| 承载 ProcessInstance | 做。Process 维护项目过程运行事实。 |
| 承载 Activity / Token / Gateway | 做。Process 维护过程节点、承担语境和流控位置。 |
| 承载 waiting gate / pause context | 做。Process 维护过程等待意图、等待原因和恢复语境。 |
| 承载 checkpoint / recovery fact | 做。Process 维护 Instance 级恢复连续性。 |
| 承载 process timing / stage / rhythm fact | 做。Process 可表达过程节奏和阶段语境,但不拥有 work Iteration truth。 |
| 提供过程执行事实消费和追溯面 | 做。Process 提供授权读取、追溯和派生消费基础。 |
| 维护派生结果和对账证据 | 做。Process 可维护 read model、projection、report 和 reconciliation evidence,但不得改变业务真相。 |

### 3.2 这个仓具体不做什么?

`L1-process` 不承担相邻真相域职责,也不保存相邻仓正文:

| 非职责 | 归属 |
|---|---|
| ProcessTemplateDef、TaskDefinition、RoleDefinition、WorkProductDefinition、ViewProfile 和 Method Content 正文 | `L3-method-library` |
| Project、ProjectMember、Backlog、WorkItem、child WorkItem、Iteration 和 commitment truth | `L1-work` |
| Gate、Policy、Control、Approval、decision truth 和治理裁决 | `L1-governance` |
| Artifact、Evidence、Baseline、ImplementationPlan 和产物正文 | `L1-artifact` |
| LLM / tool loop、runtime 微步 checkpoint、执行计划推进和工具调用正文 | `L2-runtime` |
| 容器生命周期、运行资源调度和 member process 管理 | `L2-member-service` |
| GlobalMember、Actor、Role 和成员生命周期 | `L1-identity` |
| conversation space、participant scope、conversation fact、可见性和聊天 UI | `L1-conversation` |
| workspace dashboard、跨域聚合视图和项目工作台主视图 | `L1-workspace` |
| reasoning trace 正文、指标存储、审计总账和归档包正文 | `L4-observability` / `L4-archive` |

### 3.3 哪些能力看起来相关但必须属于其他仓?

| 易混淆能力 | 必须归属 / 边界 |
|---|---|
| ProcessTemplate runtime index vs ProcessTemplateDef | runtime index 属于 Process;定义正文属于 method-library。 |
| Activity vs WorkItem | Activity 是过程节点和承担语境;WorkItem 是工作事实。 |
| process timebox / rhythm vs Iteration | Process 可提供过程节奏引用;Iteration truth 属于 Work。 |
| waiting gate vs Gate decision | waiting gate 是等待意图;decision truth 属于 Governance。 |
| checkpoint / recovery vs runtime checkpoint | Process checkpoint 是 Instance 级恢复事实;runtime 微步 checkpoint 属于 Runtime。 |
| Activity feedback vs execution log | Process 只承接执行反馈摘要 / 引用;执行日志和工具调用正文属于 Runtime。 |
| process traceability vs reasoning trace | Process 追溯记录只解释过程变化;reasoning trace 正文属于 Observability。 |
| read model / timeline vs workspace dashboard | Process 可提供过程事实消费基础;跨域 dashboard 属于 Workspace。 |
| archive handoff vs archive package | Process 可交接过程事实 snapshot / export;归档包正文属于 Archive。 |

### 3.4 哪些行为绝不能隐式发生?

| 禁止隐式行为 | 原因 |
|---|---|
| 方法定义更新后静默改写已被实例引用的 runtime process shape | 会破坏运行时过程形态的显式变化和追溯。 |
| ProcessInstance 完成、暂停或失败后直接改写 Project / WorkItem / Iteration 状态 | 会打穿 process / work 边界。 |
| Activity 推进直接创建、关闭或重排 WorkItem | 会把过程节点变成工作事实写源。 |
| waiting gate 进入或恢复直接制造 governance decision | 会把等待意图变成治理真相。 |
| runtime feedback 把执行正文、tool log 或 agent loop 写入 Process | 会把 Process 变成执行正文仓。 |
| query / projection / report / reconciliation 隐式推进、暂停、恢复或完成过程事实 | 会让消费面或维护面反写真相。 |
| checkpoint recovery 创建第二份 ProcessInstance 或平行 Activity 真相 | 会破坏恢复连续性。 |
| 除 `L0-core` 外把相邻仓写成编译期依赖 | 会破坏全局依赖裁剪和仓际边界。 |

### 3.5 哪些边界如果不写清,后续设计最容易串线?

最容易串线的边界是:

1. method-library definition 与 Process runtime index。
2. Activity / Token 与 WorkItem / Iteration / runtime step。
3. waiting gate / pause context 与 Governance decision。
4. checkpoint / recovery 与 runtime checkpoint / reasoning trace / archive package。
5. read model / timeline / report 与 workspace dashboard / observability report。
6. Process 运行期协作与 Cargo / package 编译期依赖。

---

## 4. 当前文档问题诊断

| 位置 | 当前表现 | 问题 | 本步处理 |
|---|---|---|---|
| 旧 `01-架构设计.md` §4.2 | 做 / 不做边界相对简短 | 缺 identity、conversation、workspace、observability、archive 等新版需求边界 | 按新版需求补全职责边界 |
| 旧 `01-架构设计.md` §5 | Definition / Runtime / Recovery / Coordination 已有上下文雏形 | 这些属于 Step 5 限界上下文,不应混进职责边界 | 本步只写职责归属 |
| 旧 `01-架构设计.md` | Activity / WorkItem 边界存在但不够系统 | 后续设计最容易串线 | 本步写入易混淆职责和红线 |
| 旧 `01-架构设计.md` | checkpoint 与 runtime / observability / archive 边界不完整 | 新版需求强调正文禁止和恢复连续性 | 本步补入红线 |

---

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 职责表达 | 做什么 / 不做什么分散在旧文档多个章节 | 汇总为职责边界表和红线清单 | 对齐架构规范 4.4 |
| 易混淆职责 | 主要靠自然语言说明 | 单独列出 runtime index、Activity、waiting gate、checkpoint 等易混淆项 | 防止后续设计串仓 |
| 边界红线 | 没有统一红线清单 | 明确隐式变化、正文入仓、恢复分叉、编译期依赖等红线 | 对齐需求一票否决项 |

---

## 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A: 只写“Process 做流程引擎” | 简短 | 会把定义、工作、治理、runtime 和恢复边界压扁 | 不采用 |
| 方案 B: 按做 / 不做 / 易混淆职责拆分 | 可审查,能防串线 | 文档更长 | 采用 |
| 方案 C: 在职责边界中同时画上下文图 | 读者直观 | 越过 Step 4,混淆职责与外部关系 | 不采用 |
| 方案 D: 把所有相邻仓职责都写成 Process 非目标即可 | 表面清晰 | 易混淆的协作边界仍不清楚 | 不采用 |

### 6.1 待确认问题的方案选择

#### 是否把 read model / report / reconciliation 写成 Process 职责?

| 方案 | 内容 | 影响 |
|---|---|---|
| 方案 A | 完全排除 | 会丢失需求 FR-PROC-007 / FR-PROC-008 的消费和维护能力 |
| 方案 B | 写成派生消费 / 维护职责,但明确不得反写真相 | 既承接需求,又保护业务真相 |

推荐方案 B。

#### 是否把 process timebox / rhythm 写成 Work 职责?

| 方案 | 内容 | 影响 |
|---|---|---|
| 方案 A | 全部归 Work | Process 无法表达过程节奏语境 |
| 方案 B | Process 只拥有过程节奏事实和引用语境,Iteration truth 归 Work | 保持边界清晰 |

推荐方案 B。

---

## 7. 结构化中间产物

### 7.1 职责边界表

| 职责项 | 类型 | 说明 |
|---|---|---|
| 运行时过程形态承载 | 做 | 这是 Process 从 method-library 定义来源形成可执行过程语境的正式职责。 |
| ProcessProfile 承载 | 做 | 这是项目采用和裁剪后过程语境的正式 Process 事实。 |
| ProcessInstance 承载 | 做 | 这是项目过程运行事实的核心承载。 |
| Activity / Token / Gateway 承载 | 做 | 这是过程节点、承担语境和流控位置的正式 Process 事实。 |
| waiting gate / pause context 承载 | 做 | 这是过程等待意图、等待原因和恢复语境的正式 Process 事实。 |
| checkpoint / recovery fact 承载 | 做 | 这是 Instance 级恢复连续性的正式 Process 事实。 |
| process timing / stage / rhythm fact 承载 | 做 | 这是过程节奏语境,但不得接管 Work 的 Iteration truth。 |
| 过程执行事实消费和追溯 | 做 | 授权读取、追溯和派生消费是 Process 事实可被协作使用的职责。 |
| 派生结果维护与对账证据 | 做 | 维护 read model、projection、report 和 reconciliation evidence 可以存在,但不得改变业务真相。 |
| method-library 定义正文管理 | 不做 | Process 只消费定义来源,定义正文属于 `L3-method-library`。 |
| Project / WorkItem / Iteration truth 管理 | 不做 | 这些工作事实属于 `L1-work`,不属于 Process。 |
| Governance decision truth 管理 | 不做 | Gate、Policy、Approval 和 decision truth 属于 `L1-governance`。 |
| Artifact / Evidence / Baseline / ImplementationPlan 正文管理 | 不做 | 这些正文属于 artifact 相关仓,Process 只能引用或承接摘要。 |
| Runtime execution / tool loop / micro checkpoint 管理 | 不做 | 执行正文和微步状态属于 L2 runtime 边界。 |
| GlobalMember / actor lifecycle 管理 | 不做 | 身份真相属于 `L1-identity`。 |
| conversation truth / visibility / Chat UI 管理 | 不做 | 对话事实和显化属于 `L1-conversation`。 |
| workspace dashboard / cross-domain view 管理 | 不做 | 聚合工作台视图属于 `L1-workspace`。 |
| reasoning trace、metrics、audit ledger、archive package 正文管理 | 不做 | 这些正文和横切存储属于 observability / archive 相关仓。 |
| ProcessTemplate runtime index 与 ProcessTemplateDef 边界 | 易混淆职责 | 前者属于 Process 运行时索引,后者属于 method-library 定义真相。 |
| Activity 与 WorkItem / runtime step 边界 | 易混淆职责 | Activity 只表达过程节点和流控语境,不能成为工作或执行步骤真相。 |
| process timing 与 Iteration 边界 | 易混淆职责 | Process 可表达过程节奏,但 Iteration truth 属于 Work。 |
| waiting gate 与 governance decision 边界 | 易混淆职责 | waiting gate 是等待意图,不是正式决策。 |
| checkpoint / recovery 与 runtime checkpoint / reasoning trace 边界 | 易混淆职责 | Process 只拥有 Instance 级恢复连续性,不拥有微步或 trace 正文。 |
| read model / timeline 与 workspace / observability 报告边界 | 易混淆职责 | Process 可提供事实消费基础,但不拥有跨域 dashboard 或观测正文。 |

### 7.2 做 / 不做清单

| 类型 | 清单 |
|---|---|
| 做 | 运行时过程形态;ProcessProfile;ProcessInstance;Activity;Token / Gateway;waiting gate / pause context;checkpoint / recovery fact;process timing / stage / rhythm fact;过程执行事实消费和追溯;派生结果维护与对账证据 |
| 不做 | method-library 定义正文;work truth;governance decision truth;artifact / archive 正文;runtime 执行正文;identity truth;conversation truth;workspace 主视图;observability metrics / reasoning trace 正文 |
| 易混淆职责 | runtime index vs definition;Activity vs WorkItem / runtime step;process timing vs Iteration;waiting gate vs decision;checkpoint vs runtime checkpoint;read model vs dashboard / observability report |

### 7.3 边界红线清单

| 红线 | 说明 |
|---|---|
| 不得把 ProcessTemplateDef / TaskDefinition / Method Content 正文保存为 Process 真相 | 否则 method-library 边界被打穿。 |
| 不得把 Activity、Token 或 ProcessInstance 直接解释为 WorkItem / Iteration / Project 状态 | 否则 work truth 被 Process 接管。 |
| 不得由 Process waiting gate 生成或替代 governance decision | 否则治理决策出现第二真相。 |
| 不得把 runtime execution log、tool call、agent loop 或 runtime micro checkpoint 写入 Process | 否则 runtime 正文进入 Process。 |
| 不得把 Artifact、Evidence、Baseline、ImplementationPlan、Archive Package 正文写入 Process | 否则产物或归档正文边界被打穿。 |
| 不得让 query、projection、report、reconciliation 或 recovery maintenance 隐式推进、暂停、恢复、结束或取消 Process truth | 否则读 / 维护路径反写真相。 |
| 不得在 recovery 中创建第二份过程真相 | 否则 checkpoint / recovery 连续性失效。 |
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
> - 建议继续阅读上述中间产物的“SOP 问题回答”“结构化中间产物”和“边界红线清单”小节,了解本章如何区分 Process 做什么、不做什么和最易混淆的仓际职责。

正式章节应摘录:

- `design-calibration/01_arch_step_03_responsibility_boundary.md` §7.1 职责边界表。
- `design-calibration/01_arch_step_03_responsibility_boundary.md` §7.2 做 / 不做清单。
- `design-calibration/01_arch_step_03_responsibility_boundary.md` §7.3 边界红线清单。
```

---

## 9. 待确认事项

| 编号 | 待确认事项 | 当前状态 |
|---|---|---|
| Q-001 | process timing / stage / rhythm fact 的详细对象形态 | 后续概要 / 详细设计收敛;当前只固定职责边界 |
| Q-002 | read model / timeline / report 的派生类型边界 | 后续数据所有权、交互和详细设计收敛;当前只固定不得反写真相 |
| Q-003 | checkpoint / recovery 的具体机制 | 后续架构 Step 8~10 和详细设计收敛;当前只固定 Instance 级恢复职责 |

---

## 10. 进入下一步条件

- 已明确本仓做什么、不做什么和易混淆职责。
- 已形成边界红线清单。
- 未把系统上下文、子域划分、数据所有权、接口协议或实现方案写入本步。
- 当前没有阻塞 Step 4 的职责缺口。

结论:可以进入 Step 4 `系统边界与上下文`。
