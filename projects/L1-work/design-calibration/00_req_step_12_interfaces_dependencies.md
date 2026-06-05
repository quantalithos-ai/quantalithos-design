# Step 12. 接口与依赖

> 对应 SOP: `standards/document/需求文档讨论流程_SOP.md` Step 12
> 回填章节: `00-需求文档.md` §12 接口与依赖
> 生成日期: 2026-06-02

---

## 1. 本步目标

说明 `L1-work` 在需求层对外体现为哪些能力级接口面，以及它消费哪些外部能力级输入面。本步承接 Step 6 的依赖裁剪、Step 9 的功能需求和 Step 11 的数据归属，只写能力边界，不写 API 路径、Command 名、DTO schema、事件 schema、字段名、handler / service / repository、outbox、重试、fallback、relay 或 transaction。

---

## 2. 本步输入

| 输入 | 当前状态 | 本步使用方式 |
|---|---|---|
| `design-calibration/00_req_step_06_consumers_dependencies.md` | Step 6 已完成 | 固定编译期、运行期、事件协作 / 追溯交接和下游消费依赖裁剪 |
| `design-calibration/00_req_step_09_functional_requirements.md` | Step 9 已完成 | 固定本仓对外体现的能力主题 |
| `design-calibration/00_req_step_11_data_ownership.md` | Step 11 已完成 | 固定真相、快照、引用和禁止正文边界 |
| `design-calibration/00_req_step_10_business_rules_boundaries.md` | Step 10 已完成 | 固定接口不能打穿的规则边界 |
| `projects/L1-work/00-需求文档.md` §10 | 旧版接口与依赖 | 作为 core / bus / identity / process / governance / artifact 等线索，不继承接口名 |
| `projects/L1-work/02-概要设计.md` §6 / §10 | 旧版模块交互和概要接口 | 提取能力边界线索，不继承调用链和接口签名 |

---

## 3. SOP 问题回答

### 3.1 本仓对外提供哪些能力级接口？

`L1-work` 对外提供的是项目工作事实能力边界，而不是协议方法清单：

| 能力级接口面 | 说明 |
|---|---|
| 项目工作事实变更入口 | 对外体现为建立项目主语、项目内承担、正式工作全集、正式子任务、依赖阻塞和 Iteration 承诺范围的变更能力。 |
| 项目工作事实查询入口 | 对外体现为读取项目、成员承担、正式工作、Iteration、依赖、完成依据和追溯历史的能力。 |
| 项目工作事实事件输出 | 对外体现为项目工作事实关键变化可被相邻仓持续消费的输出能力。 |
| 项目工作事实维护入口 | 对外体现为后台维护、对账、重建消费面和生成维护证据的任务能力。 |
| 项目工作事实快照 / 归档输入 | 对外体现为 archive、observability、workspace 等消费方获取项目工作事实快照或追溯材料的能力。 |

### 3.2 本仓消费哪些能力级输入？

`L1-work` 消费外部能力级输入，但不接管外部真相：

| 输入面 | 来源 | 说明 |
|---|---|---|
| 共享契约输入 | `L0-core` | 使用跨仓 ID、ActorRef、TraceContext、Error、CloudEvents、metadata 和 evidence 基线。 |
| 事件协作输入 / 输出 | `L0-bus` | 通过事件协作传播 Work 事实变化并消费外部变化。 |
| 成员身份与生命周期输入 | `L1-identity` | 用于 ProjectMember 承担关系建立、暂停、恢复和审计解释。 |
| 方法定义输入 | `L3-method-library` | 用于任务、工作产物、流程模板和视图策略的定义引用。 |
| 对话上下文输入 | `L1-conversation` | 用于把对话来源上下文回链到正式工作事实，不保存对话正文。 |
| 流程节奏输入 | `L1-process` | 用于 planning / review / timing 等节奏背景，不让 process 写 Backlog 真相。 |
| 治理结论输入 | `L1-governance` | 用于高风险项目变化、风险工作拆分和工具能力调整的结论引用。 |
| 完成依据与计划来源输入 | `L1-artifact` | 用于完成依据、baseline、evidence 和 ImplementationPlan 来源引用。 |
| 执行推进与 promote 需求输入 | `L2-runtime` | 用于 plan item promote 需求和执行上下文引用，不保存执行进度正文。 |

### 3.3 哪些是同步能力边界，哪些是异步能力边界？

| 边界类型 | 能力边界 | 说明 |
|---|---|---|
| 同步能力边界 | 项目工作事实变更入口 | 需要立即判断 Work 真相是否可建立或调整。 |
| 同步能力边界 | 项目工作事实查询入口 | 需要按授权和一致性口径读取当前项目工作事实。 |
| 同步 / 后台能力边界 | 项目工作事实维护入口 | 可由后台任务触发，也可由运维能力入口触发。 |
| 异步能力边界 | 项目工作事实事件输出 | 变化发生后供相邻仓持续消费。 |
| 异步能力边界 | 成员身份、治理、流程、artifact、runtime 等输入 | 通过事件、回调或运行期协作影响 Work 判断，但不改变依赖类型为编译期。 |

### 3.4 哪些依赖是输入型，哪些结果是输出型？

| 方向 | 能力边界 |
|---|---|
| 输入型 | `L0-core` 共享契约、identity 成员事实、method-library 定义、conversation 上下文、process 节奏、governance 结论、artifact 完成依据、runtime promote 需求 |
| 输出型 | Work 项目事实变更、Work 查询结果、Work 事件输出、Work 归档 / 观测 / workspace 消费快照 |
| 双向协作型 | `L0-bus` 事件协作、conversation 显化与上下文回链、runtime promote 需求与正式化结果回链 |

### 3.5 哪些能力边界属于当前阶段核心闭环，哪些只是外围增强？

| 能力边界 | 能力层级 |
|---|---|
| 项目工作事实变更入口 | 核心闭环能力 |
| 项目工作事实查询入口 | 核心闭环能力 |
| 项目工作事实事件输出 | 核心闭环能力 |
| 成员身份与生命周期输入 | 核心闭环能力 |
| 流程节奏 / 治理结论 / 完成依据 / promote 需求输入 | 核心闭环能力或关键规则前置 |
| 高级看板、多视图、容量趋势、跨项目依赖 | 外围增强能力 |

### 3.6 哪些能力边界来自 Step 6 的编译期 / 运行期 / 事件协作 / 追溯交接 / 下游消费依赖判断？

| 来源依赖类型 | 能力边界 |
|---|---|
| 编译期依赖 | `L0-core` 共享契约输入 |
| 事件协作 / 追溯交接依赖 | `L0-bus` 事件协作、Work 事件输出、conversation / member-service 事件消费、observability / archive handoff |
| 运行期依赖 | identity、method-library、process、governance、artifact、runtime 的能力级输入边界 |
| 下游消费 / 运行期提供 | workspace、archive、SDK 的 Work 能力、snapshot 或 export 消费边界 |

---

## 4. 当前文档问题诊断

| 位置 | 当前表现 | 问题 | 处理口径 |
|---|---|---|---|
| `00-需求文档.md` §10.1 | 把 PostgreSQL、core、bus、identity、process、governance、artifact 放入同一外部系统依赖表 | 混合外部系统、内部仓、实现候选和依赖类型 | Step 12 只写能力级依赖边界，PostgreSQL 后移架构 / 配置 / 实施 |
| `00-需求文档.md` §10.2 | 写 core proto、bus、identity、process 等上下游接口约定 | 已滑入接口协议和实现协作 | 改为输入 / 输出能力边界 |
| `02-概要设计.md` §6 | 交互边界清楚，但含模块交互图和主流程位置 | 对概要设计有价值，但需求阶段不能继承调用链 | 转译为能力边界 |
| `02-概要设计.md` §10.1 | 列出 CreateProject、CreateWorkItem 等接口 | 是 API / Command 候选，不属于需求 Step 12 粒度 | 后续详细设计再展开 |

---

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 接口表达 | API / RPC / 事件线索 | 查询接口、变更接口、事件输入 / 输出、后台任务能力 | 对齐需求规范 4.12 |
| 依赖表达 | 仓列表 + SLA + 降级 | 能力输入 / 输出边界 + 全局依赖类型 | 避免把运行期或事件协作写成 package dependency |
| PostgreSQL | 写为外部系统依赖 | 当前需求 Step 12 不定稿 | 存储实现属于后续架构 / 配置 / 实施 |
| process / artifact / runtime | 容易写成 Work 接管其对象 | 只作为节奏、依据、promote 输入面 | 守住正文和真相边界 |

---

## 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A: 沿用旧上下游接口表 | 快，覆盖已知依赖 | 混入协议、实现和错误依赖类型 | 不采用 |
| 方案 B: 按能力级接口与依赖边界重写 | 能支撑后续架构设计和依赖裁剪 | 后续仍需详细设计拆协议 | 采用 |
| 方案 C: 只写对外接口，不写输入依赖 | 简洁 | 会漏掉 identity、process、governance、artifact、runtime 等关键输入边界 | 不采用 |
| 方案 D: 在需求层直接列 Command / Query / Event | 接近实现 | 违反需求粒度，容易和详细设计冲突 | 不采用 |

### 6.1 待确认问题的方案选择

#### 是否在 Step 12 写 API / Command 名？

| 方案 | 内容 | 影响 |
|---|---|---|
| 方案 A | 写 CreateProject、CreateWorkItem 等名称 | 会提前固定协议和实现边界 |
| 方案 B | 只写能力级接口面 | 保护需求层粒度，后续详细设计再拆协议 |

推荐方案 B。原因是 Step 12 目标是接口面，不是协议契约。

#### 是否把 PostgreSQL 写入外部依赖边界？

| 方案 | 内容 | 影响 |
|---|---|---|
| 方案 A | 写入 Step 12 | 会把存储实现提前固化 |
| 方案 B | 不写入，后移架构 / 配置 / 实施 | 保持需求层只表达能力依赖 |

推荐方案 B。原因是 Step 6 已确认当前阶段无正式外部系统依赖。

#### 是否把 bus 作为编译期依赖？

| 方案 | 内容 | 影响 |
|---|---|---|
| 方案 A | 写成 package dependency | 会破坏 Step 6 的依赖裁剪 |
| 方案 B | 写成事件协作依赖 | 对齐全局依赖类型 |

推荐方案 B。原因是当前 `L1-work` 唯一编译期依赖只允许 `L0-core`。

---

## 7. 结构化中间产物

### 7.1 对外能力接口结论

| 接口类型 | 名称 | 说明 | 所属能力层级 |
|---|---|---|---|
| 变更接口 | 项目工作主语与成员承担变更 | 对外体现为正式建立或调整 Project 与 ProjectMember 项目内承担事实的能力入口。 | 核心闭环能力 |
| 变更接口 | 正式工作全集与拆分升级变更 | 对外体现为正式收束 WorkItem、child WorkItem、依赖阻塞和 promote 结果的能力入口。 | 核心闭环能力 |
| 变更接口 | Iteration 承诺子集变更 | 对外体现为正式形成或调整当前承诺范围的能力入口。 | 核心闭环能力 |
| 查询接口 | 项目工作事实查询与引用 | 对外体现为稳定读取、检索和引用 Project、ProjectMember、WorkItem、child WorkItem、Iteration 和追溯信息的能力入口。 | 核心闭环能力 |
| 查询接口 | 项目工作事实消费视图 | 对外体现为成员、审计者、workspace、conversation 等消费方理解项目工作状态的能力入口。 | 核心闭环能力 |
| 事件输出 | 项目工作事实变化输出 | 对外体现为 Project、ProjectMember、WorkItem、child WorkItem、Iteration、promote、完成依据等变化可被持续消费的输出能力。 | 核心闭环能力 |
| 后台任务接口 | 项目工作事实维护与对账 | 对外体现为维护派生结果、对账、重建消费面和生成维护证据的后台能力入口。 | 核心闭环能力 |
| 查询接口 | 高级看板与容量分析消费 | 对外体现为高级过滤、多视图、容量趋势和跨项目依赖理解的消费能力。 | 外围增强能力 |

### 7.2 外部依赖边界结论

| 依赖方向 | 依赖类型 | 关联方 | 全局依赖类型 | 说明 | 所属能力层级 |
|---|---|---|---|---|---|
| 输入 | 定义来源依赖 | `L0-core` | 编译期依赖 | Work 使用共享 ID、ActorRef、TraceContext、Error、CloudEvents、metadata 和 evidence 基线。 | 核心闭环能力 |
| 输入 / 输出 | 下游消费依赖 | `L0-bus` | 事件协作依赖 | Work 通过事件协作发布项目工作事实变化并消费外部变化。 | 核心闭环能力 |
| 输入 | 外部能力依赖 | `L1-identity` | 运行期依赖 | Work 消费 GlobalMember、actor 和成员生命周期能力，形成 ProjectMember 承担边界。 | 核心闭环能力 |
| 输入 | 定义来源依赖 | `L3-method-library` | 运行期依赖 | Work 消费 task / work product / process template / view profile 等定义引用。 | 核心闭环能力 / 外围增强能力 |
| 输入 | 外部能力依赖 | `L1-conversation` | 事件协作依赖 | Work 消费 conversation context / trace / handoff 引用，不保存对话正文。 | 核心闭环能力 |
| 输入 | 外部能力依赖 | `L1-process` | 运行期依赖 | Work 消费 planning / review / timing 等节奏输入，不让 process 写 Backlog 真相。 | 核心闭环能力 |
| 输入 | 治理结论依赖 | `L1-governance` | 运行期依赖 | Work 消费 Gate / Policy / Approval 等治理结论引用，不拥有决策正文。 | 核心闭环能力 |
| 输入 | 外部能力依赖 | `L1-artifact` | 运行期依赖 | Work 消费 artifact / evidence / baseline / ImplementationPlan 引用和摘要，不保存正文。 | 核心闭环能力 |
| 输入 | 外部能力依赖 | `L2-runtime` | 运行期依赖 | Work 消费 execution context 和 promote 需求，不保存 runtime progress 正文。 | 核心闭环能力 |
| 输出 | 下游消费依赖 | `L1-workspace` | 下游消费 / 运行期提供 | Work 向 workspace 提供项目工作事实消费面。 | 核心闭环能力 / 外围增强能力 |
| 输出 | 下游消费依赖 | `L2-member-service` | 事件协作依赖 | Work 输出 ProjectMember 和项目承担变化供容器编排消费。 | 核心闭环能力 |
| 输出 / 交接 | 下游消费 / 追溯交接依赖 | `L4-archive` | 下游消费 / 运行期提供 + 事件协作 / 追溯交接 | Work 提供项目、工作项、迭代和成员承担的归档 snapshot / export 来源,并输出 archive handoff 材料。 | 核心闭环能力 |
| 输出 | 下游消费依赖 | `L0-sdk` | 下游消费 / 运行期提供 | Work 能力由 SDK 封装给产品入口和外部调用方消费。 | 核心闭环能力 |

### 7.3 接口类型结论

| 接口类型 | 本仓使用情况 |
|---|---|
| 查询接口 | 项目工作事实查询与引用、消费视图、高级看板与容量分析消费 |
| 变更接口 | 项目主语 / 成员承担、正式工作全集 / 拆分升级、Iteration 承诺子集 |
| 事件输出 | 项目工作事实变化输出 |
| 事件输入 | identity、conversation、member-service 等事件协作输入；具体 schema 后续详细设计再定 |
| 后台任务接口 | 项目工作事实维护与对账 |

### 7.4 依赖类型结论

| 依赖类型 | 本仓使用情况 |
|---|---|
| 定义来源依赖 | `L0-core` 共享契约；`L3-method-library` 方法定义引用 |
| 治理结论依赖 | `L1-governance` 的 Gate / Policy / Approval 结论引用 |
| 下游消费依赖 | `L0-bus`、`L1-workspace`、`L2-member-service`、`L4-archive`、`L0-sdk` 对 Work 输出的消费 |
| 外部能力依赖 | `L1-identity`、`L1-conversation`、`L1-process`、`L1-artifact`、`L2-runtime` 的能力级输入 |

### 7.5 能力边界与全局依赖类型映射结论

| 能力边界 | 关联方 | 全局依赖类型 | 约束 |
|---|---|---|---|
| 共享契约输入 | `L0-core` | 编译期依赖 | 唯一允许进入 package dependency 的上游 |
| 事件协作主干 | `L0-bus` | 事件协作依赖 | 不得转写成 Cargo path dependency |
| 成员承担输入 | `L1-identity` | 运行期依赖 | 只消费 GlobalMember / actor 边界 |
| 对话上下文输入 / 显化输出 | `L1-conversation` | 事件协作依赖 | 不保存 conversation 正文 |
| 方法定义输入 | `L3-method-library` | 运行期依赖 | 不保存定义正文 |
| 流程节奏输入 | `L1-process` | 运行期依赖 | 不让 process 写 Backlog 真相 |
| 治理结论输入 | `L1-governance` | 运行期依赖 | 不拥有决策正文 |
| 完成依据 / 计划来源输入 | `L1-artifact` | 运行期依赖 | 不保存 artifact / evidence / ImplementationPlan 正文 |
| promote 需求输入 | `L2-runtime` | 运行期依赖 | 不保存 execution progress 正文 |
| workspace / archive / SDK 输出 | `L1-workspace`、`L4-archive`、`L0-sdk` | 下游消费 / 运行期提供 | 只输出 Work 能力、快照或 export 来源，不输出相邻仓正文 |

---

## 8. 回填草稿

以下内容供 Step 17 重建正式 `00-需求文档.md` 时回填到 §12。正式文档可摘录本文件 §7.1~§7.5 的表格，不重复扩写 SOP 问题回答、文档诊断和设计取舍。

```md
## 12. 接口与依赖

> 校准来源：
> - `design-calibration/00_req_step_12_interfaces_dependencies.md`
>
> 延伸阅读：
> - 建议继续阅读上述中间产物的“SOP 问题回答”“结构化中间产物”和“能力边界与全局依赖类型映射结论”小节，了解本章如何承接依赖裁剪与数据归属。

本文采用 `design-calibration/00_req_step_12_interfaces_dependencies.md` §7 的能力级接口与依赖结论。`L1-work` 对外提供项目工作事实变更、查询、事件输出、维护对账和消费快照能力；外部输入来自 core 共享契约、bus 事件协作、identity 成员事实、method-library 定义、conversation 上下文、process 节奏、governance 结论、artifact 完成依据和 runtime promote 需求。除 `L0-core` 外，其他关系不得写成编译期依赖。

正式接口与依赖表应摘录：

- `design-calibration/00_req_step_12_interfaces_dependencies.md` §7.1 对外能力接口结论。
- `design-calibration/00_req_step_12_interfaces_dependencies.md` §7.2 外部依赖边界结论。
- `design-calibration/00_req_step_12_interfaces_dependencies.md` §7.3 接口类型结论。
- `design-calibration/00_req_step_12_interfaces_dependencies.md` §7.4 依赖类型结论。
- `design-calibration/00_req_step_12_interfaces_dependencies.md` §7.5 能力边界与全局依赖类型映射结论。
```

---

## 9. 待确认事项

| 编号 | 待确认事项 | 方案 A | 方案 B | 推荐 |
|---|---|---|---|---|
| Q-001 | 是否在 Step 12 写 API / Command 名 | 写 | 只写能力级接口面 | 推荐 B。原因是协议契约属于详细设计 |
| Q-002 | 是否把 PostgreSQL 写入外部依赖 | 写入 | 后移架构 / 配置 / 实施 | 推荐 B。原因是存储实现不是需求层正式依赖 |
| Q-003 | 是否把 bus 写成编译期依赖 | 是 | 否，写为事件协作依赖 | 推荐 B。原因是唯一编译期依赖只允许 `L0-core` |
| Q-004 | 是否把 Step 6 依赖表原样复制到 Step 12 | 是 | 否，只转译为能力边界 | 推荐 B。原因是 Step 12 关注接口面，不重复仓际依赖矩阵 |

当前建议：接受上述推荐后进入 Step 13。

---

## 10. 进入下一步条件

- 已明确对外能力接口结论和外部依赖边界结论。
- 已区分查询接口、变更接口、事件输入 / 输出和后台任务接口。
- 已区分定义来源依赖、治理结论依赖、下游消费依赖和外部能力依赖。
- 已承接 Step 6 的编译期 / 运行期 / 事件协作 / 追溯交接 / 下游消费依赖判断。
- 未写 API 路径、Command 名、DTO schema、事件 schema、字段、handler / service / repository、outbox、重试、fallback、relay 或 transaction。
