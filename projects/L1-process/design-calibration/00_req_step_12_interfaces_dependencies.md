# Step 12. 接口与依赖

> 对应 SOP: `standards/document/需求文档讨论流程_SOP.md` Step 12
> 回填章节: `00-需求文档.md` §12 接口与依赖
> 生成日期: 2026-06-05

---

## 1. 本步目标

说明 `L1-process` 在需求层对外体现为哪些能力级接口面,以及它消费哪些外部能力级输入面。本步承接 Step 6 的依赖裁剪、Step 9 的功能需求和 Step 11 的数据归属,只写能力边界,不写 API 路径、Command 名、DTO schema、事件 schema、字段名、handler / service / repository、outbox、重试、fallback、relay 或 transaction。

---

## 2. 本步输入

| 输入 | 当前状态 | 本步使用方式 |
|---|---|---|
| `design-calibration/00_req_step_06_consumers_dependencies.md` | Step 6 已完成 | 固定编译期、运行期、事件协作、追溯交接和下游消费依赖裁剪 |
| `design-calibration/00_req_step_09_functional_requirements.md` | Step 9 已完成 | 固定本仓对外体现的能力主题 |
| `design-calibration/00_req_step_11_data_ownership.md` | Step 11 已完成 | 固定真相、快照、引用和禁止正文边界 |
| `design-calibration/00_req_step_10_business_rules_boundaries.md` | Step 10 已完成 | 固定接口不能打穿的规则边界 |
| `projects/L1-process/00-需求文档.md` §10 | 旧版接口与依赖 | 作为 core / bus / method-library / work / governance / artifact / member-service 等线索,不继承接口名 |
| `projects/L1-process/02-概要设计.md` §6 | 旧版交互边界 | 提取能力边界线索,不继承调用链和接口签名 |

---

## 3. SOP 问题回答

### 3.1 本仓对外提供哪些能力级接口?

`L1-process` 对外提供的是过程执行事实能力边界,不是协议方法清单:

| 能力级接口面 | 说明 |
|---|---|
| 运行时过程形态变更入口 | 对外体现为形成、采用、调整和切换项目可执行过程形态的能力入口。 |
| 项目过程实例变更入口 | 对外体现为正式建立、推进、暂停、恢复、结束或取消项目过程运行事实的能力入口。 |
| 过程节点与执行反馈入口 | 对外体现为承接 Activity 执行语境和反馈,并将其绑定到正式过程节点的能力入口。 |
| 暂停等待与恢复入口 | 对外体现为表达 waiting gate、外部等待、人工处理和恢复连续性的能力入口。 |
| 过程执行事实查询入口 | 对外体现为读取、检索和引用过程实例、过程节点、等待语境、恢复语境和追溯信息的能力入口。 |
| 过程执行事实事件输出 | 对外体现为过程执行事实关键变化可被相邻仓持续消费的输出能力。 |
| 过程执行事实维护入口 | 对外体现为后台维护、对账、恢复消费面和生成维护证据的任务能力。 |
| 过程事实快照 / 归档输入 | 对外体现为 archive、observability、workspace、conversation 等消费方获取过程事实快照或追溯材料的能力。 |

### 3.2 本仓消费哪些能力级输入?

`L1-process` 消费外部能力级输入,但不接管外部真相:

| 输入面 | 来源 | 说明 |
|---|---|---|
| 共享契约输入 | `L0-core` | 使用跨仓 ID、ActorRef、TraceContext、Error、CloudEvents、metadata 和 evidence 基线。 |
| 事件协作输入 / 输出 | `L0-bus` | 通过事件协作传播 Process 事实变化并消费外部变化。 |
| 方法定义输入 | `L3-method-library` | 用于形成运行时过程形态和项目过程裁剪语境,不保存定义正文。 |
| 项目工作语境输入 | `L1-work` | 用于绑定 Project、WorkItem、Iteration 和 ProcessTimeboxRef 等工作语境,不写工作真相。 |
| 成员身份与承担语境输入 | `L1-identity` | 用于 Activity 承担、actor 语境和审计解释,不保存成员正文。 |
| 治理结论输入 | `L1-governance` | 用于 waiting gate 恢复、高风险裁剪和关键过程规矩变更的结论引用。 |
| 产物与证据引用输入 | `L1-artifact` | 用于 Activity 输出、证据和 baseline 追溯,不保存正文。 |
| 执行反馈输入 | `L2-runtime` / `L2-member-service` | 用于 Activity 执行结果、失败、重试或恢复反馈,不保存执行正文。 |
| 对话上下文输入 | `L1-conversation` | 用于过程显化和上下文回链,不保存对话正文。 |

### 3.3 哪些是同步能力边界,哪些是异步能力边界?

| 边界类型 | 能力边界 | 说明 |
|---|---|---|
| 同步能力边界 | 运行时过程形态变更入口 | 需要立即判断过程形态是否可形成、采用或调整。 |
| 同步能力边界 | 项目过程实例变更入口 | 需要按规则判断过程运行事实是否可建立或变化。 |
| 同步能力边界 | 过程执行事实查询入口 | 需要按授权和一致性口径读取当前过程执行事实。 |
| 同步 / 后台能力边界 | 暂停等待与恢复入口 | 可由人工、系统或后台维护语境触发,但必须保持同一过程事实连续。 |
| 同步 / 后台能力边界 | 过程执行事实维护入口 | 可由后台任务触发,也可由运维能力入口触发。 |
| 异步能力边界 | 过程执行事实事件输出 | 变化发生后供相邻仓持续消费。 |
| 异步能力边界 | 方法定义、项目工作、治理、artifact、runtime、conversation 等输入 | 可通过事件或运行期协作影响 Process 判断,但不改变依赖类型为编译期。 |

### 3.4 哪些依赖是输入型,哪些结果是输出型?

| 方向 | 能力边界 |
|---|---|
| 输入型 | `L0-core` 共享契约、method-library 方法定义、work 项目语境、identity 成员语境、governance 结论、artifact 证据引用、runtime / member-service 执行反馈、conversation 上下文 |
| 输出型 | Process 运行时过程形态、ProcessInstance / Activity / waiting gate / recovery 过程事实变化、过程查询结果、过程归档 / 观测 / workspace / conversation 消费快照 |
| 双向协作型 | `L0-bus` 事件协作、work / process timing 协作、governance waiting gate 协作、runtime 执行反馈协作、conversation 显化与上下文回链 |

### 3.5 哪些能力边界属于当前阶段核心闭环,哪些只是外围增强?

| 能力边界 | 能力层级 |
|---|---|
| 运行时过程形态变更入口 | 核心闭环能力 |
| 项目过程实例变更入口 | 核心闭环能力 |
| 过程节点与执行反馈入口 | 核心闭环能力 |
| 暂停等待与恢复入口 | 核心闭环能力 |
| 过程执行事实查询入口 | 核心闭环能力 |
| 过程执行事实事件输出 | 核心闭环能力 |
| 过程执行事实维护入口 | 核心闭环能力 |
| 高级 timeline / dashboard、完整 BPMN / 嵌套过程、模板刚度、高级自动化和容量趋势 | 外围增强能力 |

### 3.6 哪些能力边界来自 Step 6 的编译期 / 运行期 / 事件协作依赖判断?

| 来源依赖类型 | 能力边界 |
|---|---|
| 编译期依赖 | `L0-core` 共享契约输入 |
| 事件协作依赖 | `L0-bus` 事件协作、Process 事件输出、work / governance / runtime / conversation / workspace 等事件消费或显化协作 |
| 运行期依赖 | `L3-method-library`、`L1-work`、`L1-identity`、`L1-governance`、`L1-artifact`、`L2-runtime`、`L2-member-service` 的能力级输入边界 |
| 下游消费 / 追溯交接 | `L1-workspace`、`L1-conversation`、`L4-observability`、`L4-archive`、`L0-sdk` 的过程能力、snapshot 或追溯材料消费边界 |

---

## 4. 当前文档问题诊断

| 位置 | 当前表现 | 问题 | 处理口径 |
|---|---|---|---|
| `00-需求文档.md` §10.1 | 把 PostgreSQL、object storage、method-library、governance、artifact、work、member-service 放入同一外部系统依赖表 | 混合外部系统、内部仓、实现候选和依赖类型 | Step 12 只写能力级依赖边界,PostgreSQL / object storage 后移架构 / 配置 / 实施 |
| `00-需求文档.md` §10.2 | 写 core(ProcessService proto)、Project.started / gate.decided / Activity.outputs 等上下游接口约定 | 已滑入协议、事件名和实现协作 | 改为输入 / 输出能力边界 |
| `02-概要设计.md` §6.7 | 交互清单包含 method-library、work、governance、artifact、runtime、conversation | 有价值,但仍表达交互流和落点部分 | 转译为能力边界 |
| `02-概要设计.md` §10` | 旧概要接口和模块调用链 | 对设计有参考价值,但需求阶段不能继承调用链 | 后续详细设计再展开 |

---

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 接口表达 | proto / event / upstream / downstream 线索 | 查询接口、变更接口、事件输入 / 输出、后台任务能力 | 对齐需求规范 4.12 |
| 依赖表达 | 仓列表 + SLA + 降级 | 能力输入 / 输出边界 + 全局依赖类型 | 避免把运行期或事件协作写成 package dependency |
| PostgreSQL / object storage | 写为外部系统依赖 | 当前需求 Step 12 不定稿 | 存储实现属于后续架构 / 配置 / 实施 |
| governance / artifact / runtime | 容易写成 Process 接管其对象 | 只作为等待依据、证据引用和执行反馈输入面 | 守住正文和真相边界 |

---

## 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A: 沿用旧上下游接口表 | 快,覆盖已知依赖 | 混入协议、事件名、实现和错误依赖类型 | 不采用 |
| 方案 B: 按能力级接口与依赖边界重写 | 能支撑后续架构设计和依赖裁剪 | 后续仍需详细设计拆协议 | 采用 |
| 方案 C: 只写对外接口,不写输入依赖 | 简洁 | 会漏掉 method-library、work、identity、governance、artifact、runtime 等关键输入边界 | 不采用 |
| 方案 D: 在需求层直接列 Command / Query / Event | 接近实现 | 违反需求粒度,容易和详细设计冲突 | 不采用 |

### 6.1 待确认问题的方案选择

#### 是否在 Step 12 写 API / Command / event 名?

| 方案 | 内容 | 影响 |
|---|---|---|
| 方案 A | 写 StartInstance、ActivityCompleted、gate.decided 等名称 | 会提前固定协议和实现边界 |
| 方案 B | 只写能力级接口面 | 保护需求层粒度,后续详细设计再拆协议 |

推荐方案 B。原因是 Step 12 目标是接口面,不是协议契约。

#### 是否把 PostgreSQL / object storage 写入外部依赖边界?

| 方案 | 内容 | 影响 |
|---|---|---|
| 方案 A | 写入 Step 12 | 会把存储实现提前固化 |
| 方案 B | 不写入,后移架构 / 配置 / 实施 | 保持需求层只表达能力依赖 |

推荐方案 B。原因是 Step 6 已确认当前阶段无正式外部系统依赖。

#### 是否把 bus 作为编译期依赖?

| 方案 | 内容 | 影响 |
|---|---|---|
| 方案 A | 写成 package dependency | 会破坏 Step 6 的依赖裁剪 |
| 方案 B | 写成事件协作依赖 | 对齐全局依赖类型 |

推荐方案 B。原因是当前 `L1-process` 唯一编译期依赖只允许 `L0-core`。

---

## 7. 结构化中间产物

### 7.1 对外能力接口结论

| 接口类型 | 名称 | 说明 | 所属能力层级 |
|---|---|---|---|
| 变更接口 | 运行时过程形态变更 | 对外体现为形成、采用、调整和切换项目可执行过程形态的能力入口。 | 核心闭环能力 |
| 变更接口 | 项目过程实例运行变更 | 对外体现为正式建立、推进、暂停、恢复、结束或取消项目过程运行事实的能力入口。 | 核心闭环能力 |
| 变更接口 | 过程节点与执行反馈绑定 | 对外体现为承接 Activity 执行语境和反馈,并将其绑定到正式过程节点的能力入口。 | 核心闭环能力 |
| 变更接口 | 暂停等待与恢复变更 | 对外体现为表达 waiting gate、外部等待、人工处理和恢复连续性的能力入口。 | 核心闭环能力 |
| 查询接口 | 过程执行事实查询与引用 | 对外体现为稳定读取、检索和引用过程实例、节点、等待、恢复和追溯信息的能力入口。 | 核心闭环能力 |
| 查询接口 | 过程执行事实消费视图 | 对外体现为管理者、审计者、workspace、conversation 等消费方理解过程运行状态的能力入口。 | 核心闭环能力 |
| 事件输出 | 过程执行事实变化输出 | 对外体现为运行时过程形态、实例、节点、等待、恢复、追溯等关键变化可被持续消费的输出能力。 | 核心闭环能力 |
| 后台任务接口 | 过程执行事实维护与对账 | 对外体现为维护派生结果、对账、恢复消费面和生成维护证据的后台能力入口。 | 核心闭环能力 |
| 查询接口 | 高级过程投影视图消费 | 对外体现为高级 timeline、dashboard、容量趋势和恢复趋势的消费能力。 | 外围增强能力 |

### 7.2 外部依赖边界结论

| 依赖方向 | 依赖类型 | 关联方 | 全局依赖类型 | 说明 | 所属能力层级 |
|---|---|---|---|---|---|
| 输入 | 定义来源依赖 | `L0-core` | 编译期依赖 | Process 使用共享 ID、ActorRef、TraceContext、Error、CloudEvents、metadata 和 evidence 基线。 | 核心闭环能力 |
| 输入 / 输出 | 下游消费依赖 | `L0-bus` | 事件协作依赖 | Process 通过事件协作发布过程执行事实变化并消费外部变化。 | 核心闭环能力 |
| 输入 | 定义来源依赖 | `L3-method-library` | 运行期依赖 | Process 消费过程 / 任务 / 角色 / 工作产物 / 视图定义来源,形成运行时过程形态。 | 核心闭环能力 |
| 输入 | 外部能力依赖 | `L1-work` | 运行期 / 事件协作依赖 | Process 消费 Project、WorkItem、Iteration 和 ProcessTimeboxRef 语境,不拥有工作真相。 | 核心闭环能力 |
| 输入 | 外部能力依赖 | `L1-identity` | 运行期依赖 | Process 消费 GlobalMember、actor 和成员生命周期语境,形成 Activity 承担和审计边界。 | 核心闭环能力 |
| 输入 | 治理结论依赖 | `L1-governance` | 运行期 / 事件协作依赖 | Process 消费 Gate / Policy / decision 等结论引用,用于 waiting gate 恢复和高风险裁剪判断。 | 核心闭环能力 |
| 输入 | 外部能力依赖 | `L1-artifact` | 运行期 / 事件协作依赖 | Process 消费 artifact / evidence / baseline / ImplementationPlan 引用和摘要,不保存正文。 | 核心闭环能力 |
| 输入 | 外部能力依赖 | `L2-runtime` / `L2-member-service` | 运行期 / 事件协作依赖 | Process 消费 Activity 执行反馈和运行语境,不保存执行正文。 | 核心闭环能力 |
| 输入 / 输出 | 下游消费依赖 | `L1-conversation` | 事件协作 / 运行期依赖 | Process 提供过程显化输入并消费 conversation context 回链,不保存对话正文。 | 核心闭环能力 |
| 输出 | 下游消费依赖 | `L1-workspace` | 下游消费 / 运行期提供 | Process 向 workspace 提供过程事实消费面。 | 核心闭环能力 / 外围增强能力 |
| 输出 / 交接 | 下游消费 / 追溯交接依赖 | `L4-observability` | 事件协作 / 追溯交接 | Process 输出 checkpoint、等待、恢复和维护材料的观测 / 审计上下文。 | 核心闭环能力 |
| 输出 / 交接 | 下游消费 / 追溯交接依赖 | `L4-archive` | 下游消费 / 运行期提供 + 事件协作 / 追溯交接 | Process 提供过程实例、Activity、checkpoint 和恢复链的归档 snapshot / export 来源。 | 核心闭环能力 |
| 输出 | 下游消费依赖 | `L0-sdk` | 下游消费 / 运行期提供 | Process 能力由 SDK 封装给产品入口和外部调用方消费。 | 核心闭环能力 |

### 7.3 接口类型结论

| 接口类型 | 本仓使用情况 |
|---|---|
| 查询接口 | 过程执行事实查询与引用、过程执行事实消费视图、高级过程投影视图消费 |
| 变更接口 | 运行时过程形态变更、项目过程实例运行变更、过程节点与执行反馈绑定、暂停等待与恢复变更 |
| 事件输出 | 过程执行事实变化输出 |
| 事件输入 | 方法定义、项目工作、治理结论、artifact、runtime、conversation 等事件协作输入;具体 schema 后续详细设计再定 |
| 后台任务接口 | 过程执行事实维护与对账 |

### 7.4 依赖类型结论

| 依赖类型 | 本仓使用情况 |
|---|---|
| 定义来源依赖 | `L0-core` 共享契约;`L3-method-library` 方法定义来源 |
| 治理结论依赖 | `L1-governance` 的 Gate / Policy / decision 结论引用 |
| 下游消费依赖 | `L0-bus`、`L1-conversation`、`L1-workspace`、`L4-observability`、`L4-archive`、`L0-sdk` 对 Process 输出的消费 |
| 外部能力依赖 | `L1-work`、`L1-identity`、`L1-artifact`、`L2-runtime`、`L2-member-service` 的能力级输入 |

### 7.5 能力边界与全局依赖类型映射结论

| 能力边界 | 关联方 | 全局依赖类型 | 约束 |
|---|---|---|---|
| 共享契约输入 | `L0-core` | 编译期依赖 | 唯一允许进入 package dependency 的上游 |
| 事件协作主干 | `L0-bus` | 事件协作依赖 | 不得转写成 Cargo path dependency |
| 方法定义输入 | `L3-method-library` | 运行期依赖 | 不保存定义正文 |
| 项目工作语境输入 | `L1-work` | 运行期 / 事件协作依赖 | 不让 Process 写工作真相 |
| 成员承担语境输入 | `L1-identity` | 运行期依赖 | 只消费 GlobalMember / actor 边界 |
| 治理结论输入 | `L1-governance` | 运行期 / 事件协作依赖 | 不拥有决策正文 |
| 产物 / 证据 / 计划来源输入 | `L1-artifact` | 运行期 / 事件协作依赖 | 不保存 artifact / evidence / ImplementationPlan 正文 |
| 执行反馈输入 | `L2-runtime` / `L2-member-service` | 运行期 / 事件协作依赖 | 不保存 execution progress 或 runtime checkpoint 正文 |
| 对话上下文输入 / 显化输出 | `L1-conversation` | 事件协作 / 运行期依赖 | 不保存 conversation 正文 |
| workspace / observability / archive / SDK 输出 | `L1-workspace`、`L4-observability`、`L4-archive`、`L0-sdk` | 下游消费 / 追溯交接 | 只输出 Process 能力、快照或 export 来源,不输出相邻仓正文 |

---

## 8. 回填草稿

以下内容供 Step 17 重建正式 `00-需求文档.md` 时回填到 §12。正式文档可摘录本文件 §7.1~§7.5 的表格,不重复扩写 SOP 问题回答、文档诊断和设计取舍。

```md
## 12. 接口与依赖

> 校准来源:
> - `design-calibration/00_req_step_12_interfaces_dependencies.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“SOP 问题回答”“结构化中间产物”和“能力边界与全局依赖类型映射结论”小节,了解本章如何承接依赖裁剪与数据归属。

本文采用 `design-calibration/00_req_step_12_interfaces_dependencies.md` §7 的能力级接口与依赖结论。`L1-process` 对外提供运行时过程形态变更、项目过程实例运行变更、过程节点与执行反馈绑定、暂停等待与恢复、查询、事件输出、维护对账和消费快照能力;外部输入来自 core 共享契约、bus 事件协作、method-library 方法定义、work 项目语境、identity 成员语境、governance 结论、artifact 证据引用、runtime / member-service 执行反馈和 conversation 上下文。除 `L0-core` 外,其他关系不得写成编译期依赖。

正式接口与依赖表应摘录:

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
| Q-001 | 是否在 Step 12 写 API / Command / event 名 | 写 | 只写能力级接口面 | 推荐 B。原因是协议契约属于详细设计 |
| Q-002 | 是否把 PostgreSQL / object storage 写入外部依赖 | 写入 | 后移架构 / 配置 / 实施 | 推荐 B。原因是存储实现不是需求层正式依赖 |
| Q-003 | 是否把 bus 写成编译期依赖 | 是 | 否,写为事件协作依赖 | 推荐 B。原因是唯一编译期依赖只允许 `L0-core` |
| Q-004 | 是否把 Step 6 依赖表原样复制到 Step 12 | 是 | 否,只转译为能力边界 | 推荐 B。原因是 Step 12 关注接口面,不重复仓际依赖矩阵 |

当前建议:接受上述推荐后进入 Step 13。

---

## 10. 进入下一步条件

- 已明确对外能力接口结论和外部依赖边界结论。
- 已区分查询接口、变更接口、事件输入 / 输出和后台任务接口。
- 已区分定义来源依赖、治理结论依赖、下游消费依赖和外部能力依赖。
- 已承接 Step 6 的编译期 / 运行期 / 事件协作 / 追溯交接 / 下游消费依赖判断。
- 未写 API 路径、Command 名、DTO schema、事件 schema、字段、handler / service / repository、outbox、重试、fallback、relay 或 transaction。
