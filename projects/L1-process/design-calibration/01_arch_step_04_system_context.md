# Step 4. 系统边界与上下文

> 对应 SOP: `standards/document/架构设计讨论流程_SOP.md` Step 4
> 回填章节: `01-架构设计.md` §5 系统边界与上下文
> 生成日期: 2026-06-05

---

## 1. 本步目标

说明 `L1-process` 在全局系统中的位置,明确它有哪些正式上下文对象、输入面、输出面以及外部边界。本步只表达正式上下文关系和输入 / 输出方向,不展开内部职责划分、限界上下文、容器部署、数据所有权、接口 schema、DTO、route、事件名或实现层依赖方向。

---

## 2. 本步输入

| 输入 | 当前状态 | 本步使用方式 |
|---|---|---|
| `design-calibration/01_arch_step_01_requirement_baseline.md` | Step 1 已完成 | 承接需求基线和上下文边界 |
| `design-calibration/01_arch_step_02_goals_constraints.md` | Step 2 已完成 | 承接架构目标、约束、取舍和非目标 |
| `design-calibration/01_arch_step_03_responsibility_boundary.md` | Step 3 已完成 | 承接做 / 不做 / 易混淆职责和红线 |
| `design-calibration/00_req_step_06_consumers_dependencies.md` | 已完成 | 承接依赖裁剪和上下游对象 |
| `design-calibration/00_req_step_12_interfaces_dependencies.md` | 已完成 | 承接能力级输入 / 输出面 |

---

## 3. SOP 问题回答

### 3.1 这个仓在全局系统中的位置是什么?

`L1-process` 位于 L1 六域服务层,是过程执行真相仓。它上承 `L0-core` 共享契约和 `L0-bus` 事件协作主干,从 `L3-method-library`、`L1-work`、`L1-identity`、`L1-governance`、`L1-artifact`、`L2-runtime`、`L2-member-service`、`L1-conversation` 等对象接收定义、项目、身份、治理、产物、执行反馈和上下文输入,并向 SDK、workspace、conversation、observability、archive 和其他相邻仓输出过程执行事实消费面。

### 3.2 它有哪些正式上游?

| 上游对象 | 上游性质 |
|---|---|
| `L0-core` | 共享契约来源 |
| `L0-bus` | 事件协作主干 |
| `L3-method-library` | 方法定义来源 |
| `L1-work` | 项目工作语境来源 |
| `L1-identity` | actor / member 语境来源 |
| `L1-governance` | waiting gate 恢复和高风险裁剪所需的正式结论来源 |
| `L1-artifact` | artifact / evidence / baseline 引用语境来源 |
| `L2-runtime` / `L2-member-service` | Activity 执行反馈和运行语境来源 |
| `L1-conversation` | conversation context 和过程显化回链来源 |

### 3.3 它有哪些正式下游?

| 下游对象 | 下游性质 |
|---|---|
| `L0-sdk` | 上层产品和外部调用方的 process 能力接入封装 |
| `L1-work` | 项目过程语境、Activity 语境和 process timing 消费方 |
| `L1-governance` | waiting gate 上下文和过程引用消费方 |
| `L1-artifact` | Activity output 过程语境和 evidence / baseline 回链消费方 |
| `L1-conversation` | 过程进展、暂停原因和 trace / handoff 过程语境显化消费方 |
| `L1-workspace` | 过程状态、进度和待处理摘要的聚合视图消费方 |
| `L2-runtime` / `L2-member-service` | Activity 执行意图和反馈锚点消费方 |
| `L4-observability` | checkpoint、等待、恢复和维护材料的观测 / 审计消费方 |
| `L4-archive` | Process fact snapshot / export 和恢复链归档消费方 |

### 3.4 它从外部接收哪些输入面?

| 输入面 | 说明 |
|---|---|
| 共享契约输入 | 跨仓 ID、ActorRef、TraceContext、Error、CloudEvents、metadata 和 evidence 基线 |
| 事件协作输入 | 外部能力级变化和 Process 事实变化传播主干 |
| 方法定义输入 | 过程、任务、角色、工作产物和视图定义来源 |
| 项目工作语境输入 | Project、ProjectMember、WorkItem、Iteration 和 ProcessTimeboxRef 语境 |
| 身份与承担语境输入 | GlobalMember、actor、成员生命周期和承担边界 |
| 治理结论输入 | Gate / Policy / decision 引用和恢复判断依据 |
| 产物与证据引用输入 | artifact / evidence / baseline / implementation plan 引用和摘要 |
| 执行反馈输入 | Activity 执行结果、失败、重试和恢复反馈 |
| 对话上下文输入 | conversation context、trace / handoff 相关上下文回链 |

### 3.5 它向外部提供哪些输出面?

| 输出面 | 说明 |
|---|---|
| 过程运行事实输出 | ProcessProfile、ProcessInstance、Activity、Token / Gateway、waiting gate、checkpoint / recovery 等事实消费面 |
| 过程语境输出 | Activity 执行语境、waiting gate 上下文、过程阶段和节奏引用 |
| 过程事实查询输出 | 授权读取、检索、引用、timeline / summary 等消费基础 |
| 过程变化输出 | 运行时过程形态、实例、节点、等待、恢复和维护状态的能力级变化输出 |
| 维护与对账输出 | 派生结果状态、reconciliation evidence 和维护报告消费面 |
| 追溯 / 归档输出 | checkpoint、等待、恢复和过程事实 snapshot / export 交接面 |

### 3.6 哪些外部系统或相邻仓构成正式上下文边界?

正式上下文边界包括:

| 边界类别 | 对象 |
|---|---|
| 基础平台边界 | `L0-core`;`L0-bus`;`L0-sdk` |
| 定义来源边界 | `L3-method-library` |
| L1 相邻真相域边界 | `L1-work`;`L1-identity`;`L1-governance`;`L1-artifact`;`L1-conversation`;`L1-workspace` |
| L2 执行边界 | `L2-runtime`;`L2-member-service` |
| L4 追溯 / 归档边界 | `L4-observability`;`L4-archive` |

PostgreSQL、object storage、BPMN engine 或 queue implementation 当前不作为 Step 4 正式上下文对象;它们属于后续容器、技术选型、配置或实施阶段的候选运行设施。

### 3.7 依赖失效时,本仓的降级口径是什么?

| 失效对象 | 降级口径 |
|---|---|
| `L0-core` | 不可降级;共享契约缺失时不能启动正式实现边界。 |
| `L0-bus` | 事件传播和消费暂停或进入待发送 / 待处理语境;不得改写业务真相来补偿总线缺失。 |
| `L3-method-library` | 新 runtime process shape / Profile 形成暂停;已有已冻结语境不得被静默改写。 |
| `L1-work` | 依赖项目 / 工作语境的变更暂停或降级为等待外部语境;不得自造 Project / WorkItem / Iteration truth。 |
| `L1-identity` | 依赖 actor / member 解析的分派、反馈和审计语境暂停或标记 unresolved;不得自造身份真相。 |
| `L1-governance` | waiting gate 保持等待;不得由 Process 自行制造 decision。 |
| `L1-artifact` | Activity output / evidence 回链降级为引用待解析或等待;不得保存产物正文。 |
| `L2-runtime` / `L2-member-service` | Activity execution feedback 等待或失败可解释;不得把 runtime 执行正文写入 Process。 |
| `L1-conversation` / `L1-workspace` | 显化和聚合视图降级,Process 主事实不受反向影响。 |
| `L4-observability` / `L4-archive` | 观测、审计或归档交接延迟;Process 主事实仍需保留可追溯材料和后续交接依据。 |

---

## 4. 当前文档问题诊断

| 位置 | 当前表现 | 问题 | 本步处理 |
|---|---|---|---|
| 旧 `01-架构设计.md` §4.1 | 系统上下文图只画 Owner / PM / AI Runtime、method-library、governance、work、artifact、member-service | 角色和运行方混入系统上下文,且缺新版上下文对象 | 改为只画正式仓 / 能力对象 |
| 旧 `01-架构设计.md` §4.3 | PostgreSQL、object storage 被写入外部依赖 | 当前需求已把这些后移为候选实现设施 | 不进入 Step 4 正式上下文 |
| 旧 `01-架构设计.md` | 上下文图和职责说明混写 | Step 3 已收敛职责,Step 4 只表达上下文关系 | 分离职责和上下文 |
| 旧 `01-架构设计.md` | 缺 L0-sdk、conversation、workspace、observability、archive 等消费 / 追溯对象 | 新版需求已将这些纳入边界 | 表中补齐完整对象 |

---

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 图对象 | 角色、旧外部系统和少量仓混写 | 只保留正式上下文对象,消费方用收缩节点表达 | 对齐架构规范 4.5 |
| 上下文关系 | 偏自然语言和旧依赖表 | 明确输入 / 输出面和关系类型 | 便于后续交互与通信方式展开 |
| 降级口径 | 旧文档偏 SLA / 技术设施 | 按真相边界和依赖失效处理 | 防止外部失效时自造真相 |

---

## 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A: 上下文图画出所有相邻仓 | 信息完整 | 图超过 7 个对象,可读性差 | 不采用 |
| 方案 B: 图只画关键对象和消费 / 追溯收缩节点,表列完整对象 | 图清晰,表完整 | 图中需要解释收缩节点 | 采用 |
| 方案 C: 沿用旧图并局部补对象 | 修改少 | 角色、技术设施和旧边界残留 | 不采用 |
| 方案 D: 把 PostgreSQL / object storage / BPMN engine 画入上下文图 | 提前接近部署视图 | 越过容器和技术选型步骤 | 不采用 |

### 6.1 待确认问题的方案选择

#### 是否在上下文图里画角色?

| 方案 | 内容 | 影响 |
|---|---|---|
| 方案 A | 画 Owner / PM / AI Runtime | 违反 Step 4 图对象规则,且角色属于需求层 |
| 方案 B | 不画角色,只画正式系统 / 仓 / 能力对象 | 对齐规范 |

推荐方案 B。

#### 是否把所有相邻仓都画进单图?

| 方案 | 内容 | 影响 |
|---|---|---|
| 方案 A | 画完整对象 | 图复杂且不符合关键对象数量建议 |
| 方案 B | 图收缩关键对象,表完整列出 | 兼顾可读性和完整性 |

推荐方案 B。

---

## 7. 结构化中间产物

### 7.1 系统上下文图

```text
                     +----------------------+
                     |  L3-method-library   |
                     |  method definitions  |
                     +----------+-----------+
                                |
                                v

+------------------+     +---------------+     +------------------+
|     L0-core      |     |  L1-process   |     |      L0-bus      |
| shared contracts |---->| process truth |<--->| event backbone   |
+------------------+     +-------+-------+     +------------------+
                                ^
                                |
             +------------------+-------------------+
             |                                      |
+------------+-------------+          +-------------+------------+
| L1-work / L1-governance  |          | L2-runtime / member svc  |
| project and decision ctx |          | execution feedback ctx   |
+------------+-------------+          +-------------+------------+
             |                                      |
             +------------------+-------------------+
                                |
                                v
              +-----------------+------------------+
              | process consumers and handoff sinks |
              | SDK / conversation / workspace      |
              | observability / archive / artifact  |
              +-------------------------------------+
```

该图仅表达本仓与正式上下文对象之间的边界关系与输入 / 输出方向,不表达接口、事件、实现组件或运行时顺序。

图示说明:

- `L1-process` 位于中心,表示它是过程执行事实仓。
- `L0-core` 和 `L0-bus` 分别表达共享契约和事件协作基础,不是业务相邻真相仓。
- 图中 `L1-work / L1-governance` 和 `L2-runtime / member svc` 是关键输入协作对象的收缩节点;完整对象在 §7.2 表中列出。
- 图底部消费和交接节点收缩了 SDK、conversation、workspace、observability、archive、artifact 等下游消费或追溯对象。

### 7.2 上下游与输入 / 输出面表

| 对象 | 关系方向 | 关系类型 | 输入/输出面 | 说明 |
|---|---|---|---|---|
| `L0-core` | 输入 | 来源 | 共享契约输入 | Process 依赖统一 ID、actor、trace、error、event envelope、metadata 和 evidence 基线。 |
| `L0-bus` | 输入 / 输出 | 来源 / 消费 | 事件协作主干 | Process 通过总线消费外部变化并输出过程事实变化。 |
| `L3-method-library` | 输入 | 来源 | 方法定义输入 | Process 从定义来源形成 runtime process shape 和 ProcessProfile。 |
| `L1-work` | 输入 / 输出 | 来源 / 消费 | 项目工作语境与过程语境 | Process 消费 Project / WorkItem / Iteration 语境,并输出 Activity / process timing 过程语境。 |
| `L1-identity` | 输入 | 来源 | 身份与承担语境 | Process 消费 actor / member 语境,但不拥有成员生命周期。 |
| `L1-governance` | 输入 / 输出 | 治理依赖 / 消费 | waiting gate 上下文与治理结论引用 | Process 提供等待语境并消费正式 decision 引用。 |
| `L1-artifact` | 输入 / 输出 | 来源 / 消费 | 产物与证据引用语境 | Process 消费 artifact / evidence 引用并提供 Activity output 过程语境。 |
| `L2-runtime` | 输入 / 输出 | 来源 / 消费 | Activity 执行反馈与执行语境 | Process 输出 Activity 执行锚点并消费执行反馈。 |
| `L2-member-service` | 输入 / 输出 | 来源 / 消费 | member 执行协作语境 | Process 与 member 执行协作,但不拥有容器生命周期。 |
| `L1-conversation` | 输入 / 输出 | 来源 / 消费 | 过程显化和 conversation context 回链 | Process 可被对话显化消费,也可保留上下文引用。 |
| `L1-workspace` | 输出 | 消费 | 过程状态和摘要消费面 | workspace 消费 Process 事实形成聚合视图。 |
| `L4-observability` | 输出 | 消费 | 观测 / 审计上下文 | observability 消费 checkpoint、等待、恢复和维护材料。 |
| `L4-archive` | 输出 | 消费 | 归档 snapshot / export | archive 消费过程事实和恢复链的归档输入。 |
| `L0-sdk` | 输出 | 入口 | SDK process 能力封装 | SDK 向上层产品和外部调用方封装 Process 能力。 |

### 7.3 边界说明

本章只把 `L1-process` 放入正式系统上下文,不表达内部子域或运行时部署。`L0-core` 和 `L0-bus` 是基础协作对象,`L3-method-library`、`L1-work`、`L1-identity`、`L1-governance`、`L1-artifact`、`L2-runtime`、`L2-member-service` 和 `L1-conversation` 是主要输入或双向协作对象,SDK、workspace、observability 和 archive 是主要消费或交接对象。PostgreSQL、object storage、BPMN engine 和队列实现不进入本章主图,因为它们属于后续容器、技术选型、配置或实施阶段的运行设施候选。这个划法保证上下文对象是系统和仓边界,而不是角色、文档来源、协议名或实现组件。

---

## 8. 回填草稿

以下内容供 Step 16 重建正式 `01-架构设计.md` 时回填。正式文档可摘录本文件 §7 的结构化结论。

```md
## 5. 系统边界与上下文

> 校准来源:
> - `design-calibration/01_arch_step_04_system_context.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“SOP 问题回答”“系统上下文图”“上下游与输入 / 输出面表”和“边界说明”小节,了解本章如何把职责边界放入全局系统关系中。

正式章节应摘录:

- `design-calibration/01_arch_step_04_system_context.md` §7.1 系统上下文图。
- `design-calibration/01_arch_step_04_system_context.md` §7.2 上下游与输入 / 输出面表。
- `design-calibration/01_arch_step_04_system_context.md` §7.3 边界说明。
```

---

## 9. 待确认事项

| 编号 | 待确认事项 | 当前状态 |
|---|---|---|
| Q-001 | PostgreSQL、object storage、BPMN engine 是否进入正式架构 | 后续 Step 6 / Step 10 和配置设计再判断 |
| Q-002 | `L1-artifact` 在图中是否应与消费 / 交接节点分离 | 当前表中已完整列出,图中收缩以保持可读性 |
| Q-003 | SDK 是否作为入口系统还是下游消费对象表达 | 当前按输出入口表达,不展开产品入口或外部调用方角色 |

---

## 10. 进入下一步条件

- 已明确本仓在全局系统中的位置。
- 已画出只含正式对象的系统上下文图。
- 已用表格解释上下游、输入 / 输出面和关系语义。
- 未写接口名、事件名、DTO、内部模块、容器部署或实现组件。

结论:可以进入 Step 5 `限界上下文与子域划分`。
