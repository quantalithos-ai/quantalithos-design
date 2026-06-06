# Step 6. 使用方与依赖

> 对应 SOP: `standards/document/需求文档讨论流程_SOP.md` Step 6
> 回填章节: `00-需求文档.md` §6 使用方与依赖
> 生成日期: 2026-06-05

---

## 1. 本步目标

从 `standards/document/全局项目依赖关系与裁剪规则.md` 裁剪 `L1-process` 的依赖子图,明确本仓向哪些内部仓提供过程执行事实、依赖哪些内部仓的前置能力,以及每条关系属于编译期、运行期还是事件协作依赖。本步不写角色说明、用户故事、功能需求、接口签名、DTO、事件 schema、数据归属或实现组织。

---

## 2. 本步输入

| 输入 | 当前状态 | 本步使用方式 |
|---|---|---|
| `design-calibration/00_req_step_02_position_boundary.md` | Step 2 已完成 | 固定 Process 是过程执行真相仓 |
| `design-calibration/00_req_step_05_users_roles.md` | Step 5 已完成 | 固定角色与系统调用方,避免把依赖写成角色 |
| `standards/document/全局项目依赖关系与裁剪规则.md` | 总依赖基线 | 裁剪 `L1-process` 自己的相关依赖边 |
| `projects/L1-work/00-需求文档.md` ~ `07-实施计划.md` | 已完成深度校准 | 承接 Work 的 Project / WorkItem / Iteration / ProcessTimeboxRef 边界 |
| `projects/L3-method-library/00-需求文档.md` ~ `07-实施计划.md` | 已完成深度校准 | 承接 ProcessTemplateDef / TaskDefinition / RoleDefinition 等定义真相来源 |
| `projects/L1-process/00-需求文档.md` §10 | 旧版接口与依赖 | 提取 core、bus、method-library、work、governance、artifact、runtime 等依赖线索 |
| `projects/L1-process/02-概要设计.md` §6 | 旧版交互边界 | 提取 method-library、work、governance、artifact、runtime、member-service、conversation 的边界线索 |

---

## 3. SOP 问题回答

### 3.1 本仓向哪些仓 / 系统提供哪些能力？

`L1-process` 向相邻仓提供能力级过程执行事实,不提供相邻仓的真相正文:

| 方向 | 对方 | 提供 / 依赖内容 | 是否闭环前置 | 失效影响 |
|---|---|---|---|---|
| 输出 | `L1-work` | ProcessInstance、Activity、过程节奏、ProcessTimeboxRef / timing 边界 | 是 | 项目过程与 WorkItem / Iteration 的节奏关联无法稳定闭合 |
| 输出 | `L1-governance` | waiting gate 意图、过程上下文和决策恢复所需的过程引用 | 是 | 治理无法知道哪个过程节点正在等待决策,过程也无法形成可恢复等待链 |
| 输出 | `L1-artifact` | Activity output 引用语境、过程阶段和证据 / baseline 回链上下文 | 否 | 产物与过程节点的追溯关系降级 |
| 输出 | `L1-conversation` | 可显化的过程进展、waiting gate、checkpoint 和 trace / handoff 过程语境 | 否 | 对话中难以稳定展示过程推进与暂停原因 |
| 输出 | `L1-workspace` | workspace / console 只读视图所需的过程状态、进度和待处理摘要 | 否 | 聚合视图无法稳定展示过程运行状态 |
| 输出 | `L2-runtime` | Activity 执行意图、过程上下文、恢复边界和反馈锚点 | 是 | runtime 执行反馈无法绑定到正式过程节点 |
| 输出 | `L2-member-service` | Activity assignment / execution context 所需的过程节点和成员承担语境 | 是 | member 容器编排难以理解当前执行对应的过程节点 |
| 输出 | `L4-observability` | 过程 checkpoint、恢复、等待和维护材料的 trace / audit 上下文 | 否 | 观测与审计材料难以还原过程推进链 |
| 输出 | `L4-archive` | 过程实例、Activity、checkpoint 和恢复链的归档输入 | 否 | 项目归档与恢复缺少过程执行事实快照 |
| 输出 | `L0-sdk` | 面向产品和外部调用方封装 process 能力的类型 / client 入口 | 否 | 上层产品接入 Process 能力时缺少统一 SDK surface |

### 3.2 本仓依赖哪些仓 / 系统提供哪些能力？

| 方向 | 对方 | 提供 / 依赖内容 | 是否闭环前置 | 失效影响 |
|---|---|---|---|---|
| 输入 | `L0-core` | 共享 ID、ActorRef、TraceContext、Error、CloudEvents、metadata、evidence 基线 | 是 | Process 无法获得统一跨仓契约 |
| 输入 / 输出 | `L0-bus` | 跨仓事件协作主干 | 是 | 过程事件无法稳定传播,也无法消费定义 / 工作 / 治理 / 执行变化 |
| 输入 | `L3-method-library` | ProcessTemplateDef、TaskDefinition、RoleDefinition、WorkProductDefinition、ViewProfile 等定义来源 | 是 | ProcessTemplate runtime index / ProcessProfile 无法从正式定义形成 |
| 输入 | `L1-work` | Project、ProjectMember、WorkItem、Iteration 和 ProcessTimeboxRef 协作边界 | 是 | 项目上下文中的 ProcessInstance / Activity 无法稳定绑定工作事实 |
| 输入 | `L1-identity` | GlobalMember、actor、成员生命周期和角色引用边界 | 是 | Activity 分派、反馈和审计 actor 语境无法闭合 |
| 输入 | `L1-governance` | Gate / Policy / decision 结果和恢复判断边界 | 是 | waiting gate 无法收到正式决策结果并恢复 |
| 输入 | `L1-artifact` | artifact / evidence / baseline / output ref 正文归属和引用边界 | 否 | Activity 输出和证据回链降级 |
| 输入 | `L1-conversation` | conversation context、trace / handoff 相关引用边界 | 否 | 对话来源的过程上下文无法稳定回链 |
| 输入 | `L2-runtime` | Activity 执行反馈、失败 / 重试 / 恢复信号边界 | 是 | ProcessInstance 无法根据正式执行反馈推进 Activity |
| 输入 | `L2-member-service` | 成员容器执行反馈和运行环境状态边界 | 否 | 成员执行协作降级,但过程执行真相仍可通过受控系统反馈维护 |

### 3.3 哪些依赖是闭环前置？

闭环强前置只保留能让“定义转运行、项目内执行、等待决策、执行反馈”成立的依赖:

| 前置依赖 | 原因 |
|---|---|
| `L0-core` | 没有共享契约,ProcessProfile、ProcessInstance、Activity、checkpoint、gate wait 和事件引用无法跨仓稳定表达 |
| `L0-bus` | 没有事件协作主干,过程执行事实无法成为平台可消费的跨仓事实 |
| `L3-method-library` | 没有模板 / 任务定义来源,ProcessTemplate runtime index 和 ProcessProfile 无法从正式定义形成 |
| `L1-work` | 没有 Project / WorkItem / Iteration 语境,项目过程执行闭环无法绑定工作事实 |
| `L1-identity` | 没有 GlobalMember / actor 边界,Activity 分派、反馈和审计语境无法成立 |
| `L1-governance` | 没有正式决策来源,waiting gate / resume 链路无法闭合 |
| `L2-runtime` | 没有执行反馈来源,Activity 从执行意图到完成 / 失败 / 恢复的链路无法闭合 |

artifact、conversation、workspace、member-service、observability、archive、SDK 都重要,但在本步不全部写成基础闭环强前置。它们分别影响证据回链、协作显化、聚合视图、容器执行协作、观测审计、归档恢复和上层接入。

### 3.4 是否存在需要纳入当前阶段主线的正式外部系统依赖？

当前阶段无需要纳入需求主链的正式外部系统依赖。旧文档中的 PostgreSQL、BPMN 引擎、对象存储、分区表和运行指标是后续架构、详细设计、配置设计或实施阶段的候选输入,不在需求 Step 6 作为外部系统依赖定稿。

---

## 4. 当前文档问题诊断

| 位置 | 当前表现 | 问题 | 处理口径 |
|---|---|---|---|
| `00-需求文档.md` §10 | 把 core、event bus、method-library、work、governance、artifact、runtime、PostgreSQL 等放在同一依赖区 | 混合内部仓、外部系统、编译期、运行期和事件协作 | 按全局裁剪规则分表重写 |
| `00-需求文档.md` §10.2 | 写 ProcessService proto、bus、method-library fingerprint 等接口级约定 | 接口和依赖混写,且出现协议 / API 粒度 | Step 6 只保留能力级关系,接口后移 Step 12 |
| `02-概要设计.md` §6 | 对 method-library / work / governance / artifact / runtime 的交互边界有价值 | 但包含交互方向、候选流程和实现倾向 | 转译为需求层依赖裁剪,不继承流程表达 |
| 旧文档整体 | 容易把运行期 / 事件协作依赖写成源码依赖 | 会导致 L1 / L2 / L3 之间 package dependency 失控 | 明确只有 `L0-core` 可作为 `L1-process` 编译期依赖 |
| 旧文档整体 | PostgreSQL、BPMN 引擎和对象存储提前出现 | 把实现候选误写成需求阶段外部依赖 | 后移架构、配置和实施阶段重新评估 |

---

## 5. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A: 沿用旧依赖表 | 快,保留旧线索 | 混合内部仓、外部系统和接口细节,不区分依赖类型 | 不采用 |
| 方案 B: 按全局依赖规则裁剪 `L1-process` 子图 | 依赖类型清晰,能防止错误 package dependency | 表格更多,需要后续 Step 12 再展开接口 | 采用 |
| 方案 C: 只写闭环强前置依赖 | 文档短 | 会漏掉 Process 向 work / governance / artifact / workspace / runtime 等提供过程执行事实的关系 | 不采用 |
| 方案 D: 把所有相邻关系都写成闭环前置 | 强调重要性 | 会夸大依赖阻塞程度,导致核心闭环过重 | 不采用 |

---

## 6. 结构化中间产物

### 6.1 本仓依赖裁剪表

| 关联项目 | 全局关系 | 本仓角色 | 依赖类型 | 是否进入当前文档主链 | 裁剪理由 |
|---|---|---|---|---|---|
| `L0-core` | `L1-process` 编译期依赖 `L0-core` | 依赖方 | 编译期 | 是 | 共享契约是 Process 执行事实跨仓表达基础 |
| `L0-bus` | `L1-process` 通过 `L0-bus` 发布流程和 Activity 事件 | 协作方 | 事件协作 | 是 | 过程执行事实需要跨仓发布 / 消费能力级变化 |
| `L0-sdk` | `L0-sdk` 运行期封装 L1+ API | 被依赖方 | 运行期 | 是 | 上层产品和外部调用方默认经 SDK 消费 Process 能力 |
| `L3-method-library` | `L1-process` 消费模板 / 方法定义 | 依赖方 | 运行期 | 是 | Template 定义不归 process,但 runtime index / Profile 必须有定义来源 |
| `L1-work` | work 与 process 围绕项目、WorkItem、Iteration 和 timebox 协作 | 协作方 | 运行期 / 事件协作 | 是 | Project / WorkItem / Iteration truth 不归 process,但项目过程闭环依赖其语境 |
| `L1-identity` | process 运行期引用 identity 成员锚点 | 依赖方 | 运行期 | 是 | Activity 分派、反馈和审计需要 GlobalMember / actor 边界 |
| `L1-governance` | governance 与 process 围绕 waiting gate 和 decision 协作 | 协作方 | 运行期 / 事件协作 | 是 | waiting gate / resume 需要正式决策来源 |
| `L1-artifact` | artifact 与 process 围绕 activity outputs / evidence / baseline 引用协作 | 协作方 | 运行期 / 事件协作 | 是 | Activity 输出和证据回链需要 artifact 边界 |
| `L1-conversation` | conversation 与 process 在过程显化、trace / handoff 和上下文引用中协作 | 协作方 | 事件协作 / 运行期 | 是 | 对话需要显化过程进展,process 也需要保留 conversation context 回链 |
| `L1-workspace` | workspace 只读消费 L1 真相域查询 / 投影 | 被依赖方 | 运行期 / 事件协作 | 是 | 项目工作台需要 Process 事实作为视图来源 |
| `L2-runtime` | runtime 围绕 Activity 执行意图和反馈协作 | 协作方 | 运行期 / 事件协作 | 是 | Activity 执行反馈是过程推进闭环的一部分 |
| `L2-member-service` | member-service 订阅身份、项目成员和 policy 事件,并承接成员容器执行 | 协作方 | 运行期 / 事件协作 | 是 | 容器执行协作需要 Activity / ProjectMember / policy 语境 |
| `L4-observability` | observability 消费 audit / trace / metrics material | 被依赖方 | 追溯交接 / 事件协作 | 是 | checkpoint、等待、恢复和维护材料需要观测 / 审计上下文,但不反写真相 |
| `L4-archive` | archive 消费 L1 domain snapshot / export 能力,并承接归档相关事件 | 被依赖方 | 下游消费 / 追溯交接 | 是 | 过程归档和恢复需要 Process 事实快照与归档交接 |
| PostgreSQL / BPMN 引擎 / 对象存储 | 旧文档实现候选 | 非正式外部依赖 | 运行期 | 否 | 属于后续架构 / 详细 / 配置 / 实施选择,不在需求 Step 6 定稿 |

### 6.2 本仓依赖类型分类表

| 依赖类型 | 关联项目 | 本仓如何使用 / 提供能力 | 后续文档落点 |
|---|---|---|---|
| 编译期依赖 | `L0-core` | 使用共享 ID、错误、trace、event envelope、metadata 和 evidence 契约 | 详细设计 / 实施计划 |
| 事件协作依赖 | `L0-bus`、`L1-work`、`L1-governance`、`L1-artifact`、`L1-conversation`、`L1-workspace`、`L2-runtime`、`L2-member-service` | 通过事件协作传播或消费过程 / Activity / waiting gate / execution feedback 相关能力级变化 | 架构设计 / 测试方案 |
| 运行期依赖 | `L3-method-library`、`L1-work`、`L1-identity`、`L1-governance`、`L1-artifact`、`L2-runtime`、`L2-member-service` | 运行时消费定义、项目工作、成员、治理、证据和执行反馈边界 | 架构设计 / 详细设计 |
| 下游消费 / 运行期提供 | `L0-sdk`、`L1-conversation`、`L1-workspace`、`L4-observability`、`L4-archive` | 向 SDK、对话显化、workspace 视图、观测审计和归档恢复提供过程执行事实能力或快照来源 | 架构设计 / 实施计划 |

`L1-work`、`L1-governance`、`L1-artifact`、`L1-conversation`、`L2-runtime`、`L2-member-service` 具有双向协作特征:它们不是 `L1-process` 的编译期依赖,而是运行期 / 事件协作边界。`L4-observability` 只消费 trace、audit 和维护状态材料,不得被写成 Process 的运行期上游真相。

### 6.3 本仓禁止依赖表

| 禁止依赖 | 禁止原因 | 正确协作方式 |
|---|---|---|
| `L1-process` -> `L3-method-library` 编译期依赖 | 会把方法定义源码和过程执行真相耦合 | 通过正式定义读取、snapshot 或事件同步形成 runtime index |
| `L1-process` -> `L1-work` 编译期依赖 | 会把 Project / WorkItem / Iteration truth 引入 process | 使用 `L0-core` 共享引用,运行期 / 事件协作对齐 |
| `L1-process` -> `L1-identity` 编译期依赖 | 会把 GlobalMember / Actor 生命周期真相引入 process | 使用共享 actor / member 引用,运行期 / 事件协作对齐 |
| `L1-process` -> `L1-governance` / `L1-artifact` 编译期依赖 | 会破坏 L1 真相域平权并形成循环风险 | 运行期边界或事件协作 |
| `L1-process` -> `L1-conversation` / `L1-workspace` 编译期依赖 | 会把显化和聚合视图状态引入过程执行真相仓 | 使用引用边界、查询和事件 / 投影协作 |
| `L1-process` -> `L2-runtime` / `L2-member-service` 编译期依赖 | 会让 L1 反向依赖运行层 | 运行期 / 事件协作,由 L2 承接执行并反馈 |
| `L1-process` -> `L4-observability` / `L4-archive` 编译期依赖 | 会把横切观测或归档实现引入业务真相仓 | trace / audit / archive handoff、snapshot / export 边界 |
| `L5/L6` 产品绕过 `L0-sdk` 直接绑定 `L1-process` 源码 | 会破坏 SDK 统一接入层 | 经 SDK 或正式 API 边界消费 |

### 6.4 依赖裁剪图

#### 依赖裁剪图: L1-process

```text
Global baseline
  |
  | crop only L1-process related edges
  v
+-----------+ [compile]   +-------------+   [runtime] +-------------------+
| L0-core   +------------>| L1-process  |<------------+ L3-method-library |
+-----------+             +------+------+             +-------------------+
                                  ^
                                  | [event]
                              +---+----+
                              | L0-bus |
                              +---+----+
                                  |
        +-------------------------+------------------------------+
        | [runtime/event] related collaboration and consumers    |
        v                                                        v
 identity / work / governance / artifact / conversation / workspace
 runtime / member-service / observability / archive / SDK
```

图示说明:

- 本图只展示 `L1-process` 相关依赖,不展示全 27 仓。
- `[compile]` 只有 `L0-core` 可进入 package dependency。
- `[runtime]` 和 `[event]` 不得写成 Cargo path dependency。
- 图中箭头表达依赖 / 消费 / 协作方向,不表达调用顺序、接口时序或实现流程。

---

## 7. 回填草稿

以下内容供 Step 17 重建正式 `00-需求文档.md` 时回填到 §6。若完全引用中间产物已有表格,正式文档可摘录本文件 §6 的表格,不重复扩写。

```md
## 6. 使用方与依赖

> 校准来源:
> - `design-calibration/00_req_step_06_consumers_dependencies.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“SOP 问题回答”“本仓依赖裁剪表”“本仓依赖类型分类表”“本仓禁止依赖表”和“依赖裁剪图”小节,了解本章如何从全局依赖基线裁剪出 `L1-process` 的依赖子图。

本文采用 `design-calibration/00_req_step_06_consumers_dependencies.md` §6 的依赖裁剪结果:`L1-process` 的唯一编译期依赖是 `L0-core`;`L0-bus` 是事件协作主干;`L3-method-library` 是过程定义来源;`L1-work` 提供项目工作语境;`L1-identity` 提供 actor / member 引用边界;`L1-governance` 提供 waiting gate 恢复所需的正式决策来源;`L2-runtime` 提供 Activity 执行反馈来源。artifact、conversation、workspace、member-service、observability、archive 和 SDK 均按运行期、事件协作或下游消费关系处理,不得写成 package dependency。

当前阶段无需要纳入需求主链的正式外部系统依赖。旧文档中的 PostgreSQL、BPMN 引擎、对象存储和分区表属于后续架构、详细设计、配置设计或实施阶段的实现候选,不在本章定稿。
```

---

## 8. 待确认事项

| 编号 | 待确认事项 | 方案 A | 方案 B | 推荐 |
|---|---|---|---|---|
| Q-001 | 是否把 PostgreSQL / BPMN 引擎 / 对象存储写为正式外部系统依赖 | 写入需求 Step 6 | 后移架构 / 配置 / 实施阶段 | 推荐 B。原因是当前需求层只需收束能力依赖,存储和引擎实现不在本步定稿 |
| Q-002 | 是否把 artifact / conversation / workspace / member-service / observability / archive 全部写成闭环强前置 | 是 | 只写成重要运行期协作方、下游消费方或追溯交接方 | 推荐 B。原因是它们影响特定能力,但不应加重 Process 核心闭环 |
| Q-003 | 是否允许 Process 直接编译依赖 method-library / work / governance / artifact / runtime | 允许 | 禁止,只允许 `L0-core` 编译期依赖 | 推荐 B。原因是 L1 / L2 / L3 应通过共享契约、运行期边界和事件协作保持解耦 |

当前建议:接受上述推荐后进入 Step 7。

---

## 9. 进入下一步条件

- 已明确 `L1-process` 的输入依赖、输出能力和闭环前置关系。
- 已从全局依赖基线裁剪出 `L1-process` 的相关依赖边。
- 已区分编译期、运行期和事件协作依赖。
- 已明确禁止把相邻 L1 / L2 / L3 / L4 仓写成 Cargo path dependency。
- 已明确 PostgreSQL、BPMN 引擎、对象存储和分区表不是需求 Step 6 的正式外部依赖。
- 未把角色说明、接口名、事件名、用户故事、核心闭环步骤或数据归属混写进本章。
