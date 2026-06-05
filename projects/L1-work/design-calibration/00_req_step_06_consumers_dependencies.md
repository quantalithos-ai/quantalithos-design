# Step 6. 使用方与依赖

> 对应 SOP: `standards/document/需求文档讨论流程_SOP.md` Step 6
> 回填章节: `00-需求文档.md` §6 使用方与依赖
> 生成日期: 2026-06-02

---

## 1. 本步目标

从 `standards/document/全局项目依赖关系与裁剪规则.md` 裁剪 `L1-work` 的依赖子图，明确本仓向哪些内部仓提供项目工作事实、依赖哪些内部仓的前置能力，以及每条关系属于编译期、运行期还是事件协作依赖。本步不写角色说明、用户故事、功能需求、接口签名、DTO、事件 schema、数据归属或实现组织。

---

## 2. 本步输入

| 输入 | 当前状态 | 本步使用方式 |
|---|---|---|
| `design-calibration/00_req_step_02_position_boundary.md` | Step 2 已完成 | 固定 Work 是项目工作事实真相仓 |
| `design-calibration/00_req_step_05_users_roles.md` | Step 5 已完成 | 固定角色与系统调用方，避免把依赖写成角色 |
| `standards/document/全局项目依赖关系与裁剪规则.md` | 总依赖基线 | 裁剪 `L1-work` 自己的相关依赖边 |
| `/tmp/quantalithos_subproject_discussion_plan.md` | 子项目总计划 | 参考当前已完成仓与后续仓顺序 |
| `projects/L1-work/00-需求文档.md` §10 | 旧版接口与依赖 | 提取 core / bus / identity / process / governance / artifact 等依赖线索 |
| `projects/L1-work/02-概要设计.md` §6 | 旧版交互边界 | 提取 identity、process、governance、artifact、runtime、conversation 的边界线索 |

---

## 3. SOP 问题回答

### 3.1 本仓向哪些仓 / 系统提供哪些能力？

`L1-work` 向相邻仓提供能力级项目工作事实，不提供相邻仓的真相正文：

| 方向 | 对方 | 提供 / 依赖内容 | 是否闭环前置 | 失效影响 |
|---|---|---|---|---|
| 输出 | `L1-process` | Project、WorkItem、Iteration 等项目工作事实锚点 | 否 | 流程侧难以稳定关联项目工作状态 |
| 输出 | `L1-governance` | 项目生命周期、工作项状态和高风险工作上下文 | 否 | 治理决策缺少项目事实背景 |
| 输出 | `L1-artifact` | Artifact / evidence / baseline 与项目工作事实的引用锚点 | 否 | 产物与工作项关系难以追溯 |
| 输出 | `L1-conversation` | 对话中可显化的项目、任务、迭代和成员承担事实 | 否 | 协作讨论缺少统一工作事实上下文 |
| 输出 | `L1-workspace` | 项目工作台和个人工作台所需的项目工作事实视图来源 | 否 | 聚合视图无法稳定展示项目工作状态 |
| 输出 | `L2-runtime` | 执行推进所需的正式 WorkItem 和 ProjectMember 上下文 | 否 | runtime 容易把执行步骤误当作正式工作事实 |
| 输出 | `L2-member-service` | ProjectMember 与项目承担关系 | 否 | 容器编排缺少项目内成员承担依据 |
| 输出 | `L4-archive` | 项目、工作项、迭代和成员承担的归档输入 | 否 | 项目归档与恢复缺少 Work 事实快照 |
| 输出 | `L0-sdk` | 面向产品和外部调用方封装 work 能力的类型 / client 入口 | 否 | 上层产品接入 Work 能力时缺少统一 SDK surface |

### 3.2 本仓依赖哪些仓 / 系统提供哪些能力？

| 方向 | 对方 | 提供 / 依赖内容 | 是否闭环前置 | 失效影响 |
|---|---|---|---|---|
| 输入 | `L0-core` | 共享 ID、ActorRef、TraceContext、Error、CloudEvents、metadata、evidence 基线 | 是 | Work 无法获得统一跨仓契约 |
| 输入 / 输出 | `L0-bus` | 跨仓事件协作主干 | 是 | Work 事实无法稳定向相邻仓传播或接收外部变化 |
| 输入 | `L1-identity` | GlobalMember 锚点、actor、成员生命周期和角色引用边界 | 是 | ProjectMember 项目内承担事实无法闭合 |
| 输入 | `L3-method-library` | task / work product / process template / view profile 等定义来源 | 否 | 方法化项目工作语境降级，但基础工作事实仍可收束 |
| 输入 | `L1-conversation` | conversation context、trace / handoff 相关引用边界 | 否 | 对话来源的工作上下文无法稳定回链 |
| 输入 | `L1-process` | planning / review / timing 等流程节奏和过程实例引用边界 | 否 | Iteration 与流程节奏联动降级 |
| 输入 | `L1-governance` | Gate / Policy / Approval 等治理结论引用边界 | 否 | 高风险生命周期和工作变更只能等待治理结论 |
| 输入 | `L1-artifact` | artifact / evidence / baseline / implementation plan 正文归属和引用边界 | 否 | 完成依据、证据回链和 promote 来源降级 |
| 输入 | `L2-runtime` | execution plan 进展和 promote 需求边界 | 否 | plan item 升级为 child WorkItem 的协作入口缺少触发来源 |

### 3.3 哪些依赖是闭环前置？

闭环强前置只保留三类：

| 前置依赖 | 原因 |
|---|---|
| `L0-core` | 没有共享契约，项目、成员、工作项和事件引用无法跨仓稳定表达 |
| `L0-bus` | 没有事件协作主干，Work 事实无法成为平台可消费的跨仓事实 |
| `L1-identity` | 没有 GlobalMember / actor 边界，ProjectMember 项目内承担事实无法成立 |

process、governance、artifact、conversation、method-library、runtime、workspace、member-service、archive、SDK 都重要，但在本步不全部写成基础闭环强前置。它们分别影响流程节奏、治理判断、证据追溯、协作显化、方法定义、执行推进、聚合视图、容器编排、归档恢复和上层接入。

### 3.4 是否存在需要纳入当前阶段主线的正式外部系统依赖？

当前阶段无需要纳入需求主链的正式外部系统依赖。旧文档中的 PostgreSQL 是后续架构、详细设计、配置设计或实施阶段的存储实现候选，不在需求 Step 6 作为外部系统依赖定稿。

---

## 4. 当前文档问题诊断

| 位置 | 当前表现 | 问题 | 处理口径 |
|---|---|---|---|
| `00-需求文档.md` §10 | 把 PostgreSQL、core、bus、identity、process、governance、artifact 放在同一外部系统依赖表 | 混合外部系统、内部仓、编译期、运行期和事件协作 | 按全局裁剪规则分表重写 |
| `00-需求文档.md` §10.2 | 写 core proto、bus、identity、process、conversation 等上下游接口约定 | 接口和依赖混写，且出现接口级语义 | Step 6 只保留能力级关系，接口后移 Step 12 |
| `02-概要设计.md` §6 | 对 identity / process / governance / artifact / runtime / conversation 的边界描述较清楚 | 有价值，但概要图包含交互方向和局部流程 | 转译为需求层依赖裁剪，不继承流程表达 |
| 旧文档整体 | 容易把运行期 / 事件协作依赖写成源码依赖 | 会导致实现仓 Cargo dependency 失控 | 明确只有 `L0-core` 可作为编译期依赖 |

---

## 5. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A: 沿用旧依赖表 | 快，保留旧线索 | 混合内部仓和外部系统，且不区分依赖类型 | 不采用 |
| 方案 B: 按全局依赖规则裁剪 `L1-work` 子图 | 依赖类型清晰，能防止错误 package dependency | 表格更多，需要后续 Step 12 再展开接口 | 采用 |
| 方案 C: 只写闭环强前置依赖 | 文档短 | 会漏掉 Work 向 process / governance / artifact / workspace 等提供项目事实的关系 | 不采用 |
| 方案 D: 把所有相邻关系都写成闭环前置 | 强调重要性 | 会夸大依赖阻塞程度，导致核心闭环过重 | 不采用 |

---

## 6. 结构化中间产物

### 6.1 本仓依赖裁剪表

| 关联项目 | 全局关系 | 本仓角色 | 依赖类型 | 是否进入当前文档主链 | 裁剪理由 |
|---|---|---|---|---|---|
| `L0-core` | `L1-work` 编译期依赖 `L0-core` | 依赖方 | 编译期 | 是 | 共享契约是 Work 项目事实跨仓表达基础 |
| `L0-bus` | `L1-work` 通过 `L0-bus` 事件协作 | 协作方 | 事件协作 | 是 | Work 事实需要跨仓发布 / 消费能力级变化 |
| `L0-sdk` | `L0-sdk` 运行期封装 L1+ API | 被依赖方 | 运行期 | 是 | 上层产品和外部调用方默认经 SDK 消费 Work 能力 |
| `L1-identity` | `L1-work` 运行期引用 identity 成员锚点 | 依赖方 | 运行期 | 是 | ProjectMember 需要 GlobalMember / actor 边界 |
| `L1-conversation` | conversation 与 work 在项目协作上下文中互相消费 | 协作方 | 事件协作 | 是 | Work 事实需要在对话中显化，对话上下文也需被 Work 引用 |
| `L3-method-library` | Work 消费方法定义和模板引用 | 依赖方 | 运行期 | 是 | 方法化项目工作需要 task / work product / template 定义来源 |
| `L1-process` | process 与 work 围绕项目和 iteration 协作 | 协作方 | 运行期 | 是 | 流程节奏影响 planning / review timing，Work 提供项目事实 |
| `L1-governance` | governance 与 work 围绕项目高风险变更协作 | 协作方 | 运行期 | 是 | Gate / Policy 结论影响项目生命周期和高风险工作边界 |
| `L1-artifact` | artifact 与 work 围绕 evidence / baseline / plan 引用协作 | 协作方 | 运行期 | 是 | Work 完成依据和产物回链需要 artifact 边界 |
| `L1-workspace` | workspace 只读消费 L1 真相域查询 / 投影 | 被依赖方 | 运行期 | 是 | 项目工作台需要 Work 事实作为视图来源 |
| `L2-runtime` | runtime 围绕 WorkItem 推进执行并提出 promote 需求 | 协作方 | 运行期 | 是 | ImplementationPlan promote 边界需要 runtime 侧输入 |
| `L2-member-service` | member-service 订阅身份、项目成员和 policy 事件 | 被依赖方 | 事件协作 | 是 | 容器编排需要 ProjectMember 承担事实 |
| `L4-archive` | archive 消费 L1 domain snapshot / export 能力,并承接 trace / archive handoff 材料 | 被依赖方 | 下游消费 / 追溯交接 | 是 | 项目归档和恢复需要 Work 事实快照与归档交接 |
| `L4-observability` | observability 消费 audit / trace / metrics material | 被依赖方 | 追溯交接 / 事件协作 | 否 | 当前需求主链先不展开观测仓,但必须保留观测消费和交接边界 |
| PostgreSQL | 旧文档实现候选 | 非正式外部依赖 | 运行期 | 否 | 属于后续架构 / 详细 / 配置的实现选择，不在需求 Step 6 定稿 |

### 6.2 本仓依赖类型分类表

| 依赖类型 | 关联项目 | 本仓如何使用 / 提供能力 | 后续文档落点 |
|---|---|---|---|
| 编译期依赖 | `L0-core` | 使用共享 ID、错误、trace、event envelope、metadata 和 evidence 契约 | 详细设计 / 实施计划 |
| 事件协作 / 追溯交接依赖 | `L0-bus`、`L1-conversation`、`L2-member-service`、`L4-observability`、`L4-archive` | 通过事件协作传播或消费项目工作事实变化,并承接 trace / audit / archive handoff 材料 | 架构设计 / 测试方案 |
| 运行期依赖 | `L1-identity`、`L3-method-library`、`L1-process`、`L1-governance`、`L1-artifact`、`L2-runtime` | 运行时消费成员、定义、流程、治理、证据和执行推进边界 | 架构设计 / 详细设计 |
| 下游消费 / 运行期提供 | `L0-sdk`、`L1-workspace`、`L4-archive` | 向 SDK、workspace 和 archive 提供项目工作事实能力、快照来源或 export 来源 | 架构设计 / 实施计划 |

`L4-archive` 具有双角色:handoff / 回链属于事件协作 / 追溯交接,snapshot / export 读取属于下游消费 / 运行期提供。`L4-observability` 只消费 trace、audit 和维护状态材料,不得被写成 Work 的运行期上游依赖。

### 6.3 本仓禁止依赖表

| 禁止依赖 | 禁止原因 | 正确协作方式 |
|---|---|---|
| `L1-work` -> `L1-identity` 编译期依赖 | 会把 GlobalMember 真相和 Work 真相耦合 | 使用 `L0-core` 共享引用，运行期 / 事件协作对齐 |
| `L1-work` -> `L1-conversation` 编译期依赖 | 会把对话真相引入工作事实仓 | 使用引用边界和事件 / 查询协作 |
| `L1-work` -> `L3-method-library` 编译期依赖 | 会把方法定义源码并入 Work | 通过正式定义读取边界消费 |
| `L1-work` -> `L1-process` / `L1-governance` / `L1-artifact` 编译期依赖 | 会破坏 L1 真相域平权并形成循环风险 | 运行期边界或事件协作 |
| `L1-work` -> `L2-runtime` / `L2-member-service` 编译期依赖 | 会让 L1 反向依赖运行层 | 运行期 / 事件协作，由 L2 消费 Work 事实 |
| `L5/L6` 产品绕过 `L0-sdk` 直接绑定 `L1-work` 源码 | 会破坏 SDK 统一接入层 | 经 SDK 或正式 API 边界消费 |

### 6.4 依赖裁剪图

#### 依赖裁剪图: L1-work

```text
Global baseline
  |
  | crop only L1-work related edges
  v
                         +----------------+
                         | L1-identity    |
                         +--------+-------+
                                  | [runtime]
                                  v
+-----------+ [compile]   +-------+-------+   [runtime] +-------------------+
| L0-core   +------------>| L1-work       |<------------+ L3-method-library |
+-----------+             +-------+-------+             +-------------------+
                                  ^
                                  | [event]
                              +---+----+
                              | L0-bus |
                              +---+----+
                                  |
        +-------------------------+-------------------------+
        | [runtime/event] related collaboration and consumers|
        v                                                   v
 process / governance / artifact / conversation / runtime / workspace / member-service / archive / SDK
```

图示说明:

- 本图只展示 `L1-work` 相关依赖，不展示全 27 仓。
- `[compile]` 只有 `L0-core` 可进入 package dependency。
- `[runtime]` 和 `[event]` 不得写成 Cargo path dependency。
- 图中箭头表达依赖 / 消费 / 协作方向，不表达调用顺序、接口时序或实现流程。

---

## 7. 回填草稿

以下内容供 Step 17 重建正式 `00-需求文档.md` 时回填到 §6。若完全引用中间产物已有表格，正式文档可摘录本文件 §6 的表格，不重复扩写。

```md
## 6. 使用方与依赖

> 校准来源：
> - `design-calibration/00_req_step_06_consumers_dependencies.md`
>
> 延伸阅读：
> - 建议继续阅读上述中间产物的“SOP 问题回答”“本仓依赖裁剪表”“本仓依赖类型分类表”“本仓禁止依赖表”和“依赖裁剪图”小节，了解本章如何从全局依赖基线裁剪出 `L1-work` 的依赖子图。

本文采用 `design-calibration/00_req_step_06_consumers_dependencies.md` §6 的依赖裁剪结果：`L1-work` 的唯一编译期依赖是 `L0-core`；`L0-bus` 是事件协作主干；`L1-identity` 是 ProjectMember 闭环强前置；process、governance、artifact、conversation、runtime、workspace、member-service、archive 和 SDK 均按运行期或事件协作关系处理，不得写成 package dependency。

当前阶段无需要纳入需求主链的正式外部系统依赖。旧文档中的 PostgreSQL 属于后续架构、详细设计、配置设计或实施阶段的存储实现候选，不在本章定稿。
```

---

## 8. 待确认事项

| 编号 | 待确认事项 | 方案 A | 方案 B | 推荐 |
|---|---|---|---|---|
| Q-001 | 是否把 PostgreSQL 写为正式外部系统依赖 | 写入需求 Step 6 | 后移架构 / 配置 / 实施阶段 | 推荐 B。原因是当前需求层只需收束能力依赖，存储实现不在本步定稿 |
| Q-002 | 是否把 process / governance / artifact 全部写成闭环强前置 | 是 | 只写成重要运行期协作方 | 推荐 B。原因是它们影响特定能力，但基础项目工作事实闭环不应被过度加重 |
| Q-003 | 是否允许 Work 直接编译依赖 identity / artifact / process | 允许 | 禁止，只允许 `L0-core` 编译期依赖 | 推荐 B。原因是 L1 真相域应通过共享契约、运行期边界和事件协作保持平权 |

当前建议：接受上述推荐后进入 Step 7。

---

## 9. 进入下一步条件

- 已明确 `L1-work` 的输入依赖、输出能力和闭环前置关系。
- 已从全局依赖基线裁剪出 `L1-work` 的相关依赖边。
- 已区分编译期、运行期和事件协作依赖。
- 已明确禁止把相邻 L1 / L2 仓写成 Cargo path dependency。
- 未把角色说明、接口名、事件名、用户故事、核心闭环步骤或数据归属混写进本章。
