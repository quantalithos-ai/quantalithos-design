# Step 7. 依赖方向与层间约束

> 对应 SOP: `standards/document/架构设计讨论流程_SOP.md` Step 7
> 回填章节: `01-架构设计.md` §8 依赖方向与层间约束
> 生成日期: 2026-06-05

---

## 1. 本步目标

明确 `L1-process` 内部架构责任层 / 依赖角色如何划分,允许哪些依赖方向,禁止哪些反向依赖,哪些外部能力必须通过正式边界进入,并从全局依赖基线裁剪出本仓跨仓依赖子图。本步不重写子域结构、运行承载图、通信协议、代码调用链、数据库细节或部署参数。

---

## 2. 本步输入

| 输入 | 当前状态 | 本步使用方式 |
|---|---|---|
| `design-calibration/01_arch_step_05_bounded_context_subdomains.md` | Step 5 已完成 | 承接核心语义和本地影子结构边界 |
| `design-calibration/01_arch_step_06_container_deployment.md` | Step 6 已完成 | 承接运行承载角色 |
| `design-calibration/00_req_step_06_consumers_dependencies.md` | 已完成 | 承接本仓依赖裁剪表 |
| `standards/document/全局项目依赖关系与裁剪规则.md` | 已读取 | 控制跨仓依赖类型和裁剪图格式 |
| `projects/L1-process/00-需求文档.md` §6 / §12 / §14 | 已重建 | 校验依赖裁剪、接口能力和否决项 |

---

## 3. SOP 问题回答

### 3.1 本仓内部层次如何划分?

本章使用架构责任层 / 依赖角色,不使用代码目录或子域层名:

| 架构责任层 / 依赖角色 | 作用 |
|---|---|
| 核心语义角色 | 承载 Process truth、核心规则、状态判断和边界不变量。 |
| 编排 / 承接角色 | 承接正式输入,协调同步入口、异步输入、后台维护与核心语义之间的业务处理。 |
| 外部接缝角色 | 承接外部入口、运行期依赖、事件协作、SDK / API / adapter / consumer / publisher 等边界。 |
| 技术承载角色 | 承载正式状态存储、基础设施、总线绑定、定时触发、外部正文 / 大对象引用等运行支撑。 |

### 3.2 允许哪些依赖方向?

| 允许方向 | 说明 |
|---|---|
| 外部接缝角色 -> 编排 / 承接角色 | 外部能力必须先进入正式边界,不得直接打穿核心语义。 |
| 编排 / 承接角色 -> 核心语义角色 | 编排可以调用核心语义判断和规则,但不能把外部 truth 直接注入核心。 |
| 编排 / 承接角色 -> 技术承载角色 | 编排可以使用正式状态存储和基础设施支撑运行。 |
| 外部接缝角色 -> 技术承载角色 | 外部接缝可绑定总线、SDK、运行期 adapter 或基础设施边界。 |
| 核心语义角色 -> `L0-core` shared contracts | 核心语义可以使用共享 ID、ActorRef、TraceContext、Error、metadata 等基础契约。 |

### 3.3 禁止哪些反向依赖?

| 禁止方向 | 原因 |
|---|---|
| 核心语义角色 -> 外部接缝角色 | 会让核心业务规则依赖外部协议或相邻仓实现。 |
| 核心语义角色 -> 技术承载角色 | 会让存储、总线或基础设施反向决定 Process truth。 |
| 核心语义角色 -> 非 `L0-core` sibling repo | 会把运行期 / 事件协作依赖写成编译期依赖。 |
| 技术承载角色 -> 核心语义角色定义权 | 存储或基础设施不得定义业务规则或状态语义。 |
| 外部接缝角色绕过编排 / 承接角色直接改写 Process truth | 会破坏校验、幂等、授权、边界和事务语义。 |
| 查询 / 投影 / 报告依赖反向进入写模型 | 会让派生面成为业务真相写源。 |

### 3.4 外部系统通过哪些正式边界接入?

| 外部能力 | 正式接入边界 |
|---|---|
| SDK / 上层产品入口 | 外部接缝角色 -> 编排 / 承接角色 |
| method-library 定义来源 | 外部接缝角色形成 definition snapshot / ref 后进入编排判断 |
| work / identity / governance / artifact / runtime / member-service / conversation 运行期输入 | 外部接缝角色形成 ref、snapshot、feedback 或 resolved context 后进入编排判断 |
| L0-bus 事件协作 | 外部接缝角色消费 / 发布事件,编排 / 承接角色处理业务边界 |
| observability / archive handoff | 外部接缝角色处理交接,不得让 L4 反向控制 Process truth |

### 3.5 本仓在全局依赖基线中涉及哪些跨仓依赖边?

涉及的跨仓依赖边见 §7.5~§7.8。核心结论:

- `L0-core` 是唯一编译期依赖。
- `L0-bus` 是事件协作依赖。
- `L3-method-library` 是运行期定义来源依赖。
- `L1-work`、`L1-identity`、`L1-governance`、`L1-artifact`、`L1-conversation`、`L2-runtime`、`L2-member-service` 是运行期 / 事件协作边界。
- `L0-sdk`、`L1-workspace`、`L4-observability`、`L4-archive` 是下游消费、追溯交接或运行期提供关系。

### 3.6 哪些依赖边进入本仓架构主链,哪些被裁剪出去?

进入主链的依赖边是与 Process truth 形成、推进、等待恢复、消费和追溯相关的跨仓关系。被裁剪出去的是旧文档中的 PostgreSQL、BPMN engine、object storage、分区表、具体 queue implementation 和部署产品假设;它们可以作为后续技术选型 / 配置 / 实施候选,但不进入跨仓依赖裁剪主链。

### 3.7 哪些依赖必须倒置,不能直接侵入核心语义层?

| 依赖 | 倒置口径 |
|---|---|
| method-library | 核心语义只接收定义 snapshot / ref / resolved shape,不依赖 method-library 源码。 |
| work | 核心语义只接收 Project / WorkItem / Iteration 语境引用或摘要,不依赖 work 源码。 |
| identity | 核心语义只接收 actor / member ref 或 resolved context,不依赖 identity 源码。 |
| governance | 核心语义只接收 decision / policy / gate 引用或结果,不依赖 governance 源码。 |
| artifact | 核心语义只接收 artifact / evidence / baseline ref 或摘要,不依赖 artifact 源码。 |
| runtime / member-service | 核心语义只接收 execution feedback ref / summary,不依赖 L2 源码。 |
| conversation / observability / archive | 核心语义只保存 context / handoff ref,不依赖显化、观测或归档实现。 |
| bus / storage / infra | 核心语义不依赖具体总线、存储、队列、对象存储或 timer 实现。 |

### 3.8 哪些规则若不先写清,后续实现最容易失控?

最容易失控的依赖规则是:

1. 非 `L0-core` sibling repo 不得进入 package dependency。
2. 运行期依赖和事件协作依赖必须经外部接缝角色和编排 / 承接角色进入。
3. 核心语义角色不得依赖外部接缝、技术承载或相邻仓源码。
4. 读模型、投影、报告和维护不得反向依赖进入写模型并改变业务真相。
5. 技术承载角色不得定义 Process truth、状态语义或边界规则。

---

## 4. 当前文档问题诊断

| 位置 | 当前表现 | 问题 | 本步处理 |
|---|---|---|---|
| 旧 `01-架构设计.md` | 依赖方向未按编译期 / 运行期 / 事件协作区分 | 容易把 method-library / work / runtime 写成源码依赖 | 按全局依赖裁剪重写 |
| 旧 `01-架构设计.md` | API / worker / storage 等运行对象容易当成依赖层 | 运行承载不等于依赖角色 | 本步使用核心语义、编排、外部接缝、技术承载四类角色 |
| 旧 `01-架构设计.md` | PostgreSQL / object storage 作为实现候选提前出现 | 这不是跨仓依赖主链 | 裁剪出主链,后续 Step 10 再判断 |
| 新版需求 §15 | 后续 Agent 可能自行补 API / 状态机 / 存储 | 风险真实存在 | 本步明确核心不能直接依赖外部协议或技术承载 |

---

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 依赖类型 | 混合描述 | 编译期 / 运行期 / 事件协作 / 下游消费分开 | 对齐全局依赖规范 |
| 内部依赖角色 | 隐含在旧架构风格中 | 核心语义、编排 / 承接、外部接缝、技术承载 | 明确允许和禁止方向 |
| 跨仓依赖 | 容易沿用旧源码依赖直觉 | 只允许 `L0-core` 编译期依赖 | 保护 L1 / L2 / L3 边界 |
| 技术承载 | 容易决定业务语义 | 明确不得定义核心语义 | 防止存储 / 总线 / infra 反向污染业务规则 |

---

## 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A: 用 controller / service / domain / repository 写依赖图 | 接近实现 | 违反架构规范,提前进入代码层 | 不采用 |
| 方案 B: 用核心语义 / 编排 / 外部接缝 / 技术承载写依赖角色 | 可审查,能保护边界 | 后续还需概要 / 详细设计映射到代码结构 | 采用 |
| 方案 C: 只复用需求 Step 6 的依赖裁剪表 | 省事 | 缺内部层间依赖规则 | 不采用 |
| 方案 D: 允许运行期依赖直接进入核心语义 | 简化实现 | 会导致仓际源码耦合和真相串仓 | 不采用 |

### 6.1 待确认问题的方案选择

#### 核心语义能否直接依赖 method-library / work / governance 等仓?

| 方案 | 内容 | 影响 |
|---|---|---|
| 方案 A | 可以直接依赖源码 | 会破坏唯一编译期依赖和真相域边界 |
| 方案 B | 只能接收经边界转换后的 ref / snapshot / resolved context | 保持运行期依赖倒置 |

推荐方案 B。

#### 技术承载能否定义状态语义?

| 方案 | 内容 | 影响 |
|---|---|---|
| 方案 A | 由存储或事件实现决定状态 | 会让技术实现反向定义业务真相 |
| 方案 B | 状态语义由核心语义角色定义,技术承载只负责承载 | 保护核心边界 |

推荐方案 B。

---

## 7. 结构化中间产物

### 7.1 依赖方向图

```text
============================================================+
|                 L1-process dependency boundary            |
|                                                            |
|  external seam role                                       |
|  +---------------------------+                             |
|  | entry / adapter / event   |                             |
|  | / handoff boundary        |                             |
|  +-------------+-------------+                             |
|                | boundary access                           |
|                v                                           |
|  +---------------------------+                             |
|  | orchestration / intake    |                             |
|  | role                      |                             |
|  +-------------+-------------+                             |
|                | allowed dependency                        |
|                v                                           |
|  +---------------------------+                             |
|  | core semantic role        |                             |
|  | Process truth and rules   |                             |
|  +---------------------------+                             |
|                                                            |
|  technical carrier role                                    |
|  +---------------------------+                             |
|  | state / infra support     |                             |
|  +---------------------------+                             |
|                                                            |
+============================================================+
```

图示说明:

- 箭头只表达允许依赖和边界接入方向,不表达调用顺序、协议、事件传播顺序或代码函数调用链。
- 核心语义角色承载 Process truth 和规则,只能被编排 / 承接角色依赖,不得反向依赖外部接缝或技术承载。
- 外部能力必须通过 external seam role 和 orchestration / intake role 进入核心判断。
- technical carrier role 只承载状态和基础设施支撑,不得定义核心语义。

### 7.2 层间约束表

| 架构责任层 / 依赖角色 | 允许依赖 | 禁止依赖 | 说明 |
|---|---|---|---|
| 核心语义角色 | `L0-core` 共享契约;本仓内核心规则和语义对象 | 外部接缝角色;技术承载角色;非 `L0-core` sibling repo;外部协议和实现细节 | 保护 Process truth、状态语义和边界规则不被外部或技术实现反向定义。 |
| 编排 / 承接角色 | 核心语义角色;外部接缝角色提供的 resolved context;技术承载角色 | 绕过核心规则直接写 Process truth;直接接管外部 truth;把查询 / 维护当业务写源 | 承接入口、异步输入和后台维护时必须统一经过核心规则判断。 |
| 外部接缝角色 | 编排 / 承接角色;技术承载角色;运行期 / 事件协作 / SDK 边界 | 直接定义核心语义;直接改写 Process truth;把相邻仓源码作为编译期依赖 | 外部能力只能作为边界输入或输出,不能侵入核心规则。 |
| 技术承载角色 | 被编排 / 承接和外部接缝使用;承载正式状态与基础设施 | 定义业务状态;决定边界规则;把存储 / 总线实现暴露给核心语义 | 技术承载只支撑运行,不拥有 Process truth 定义权。 |
| 查询 / 投影 / 维护派生面 | 核心事实读取边界;派生状态承载;维护证据边界 | 反向推进、暂停、恢复、完成或取消 Process truth | 派生面只能消费或修复派生结果,不得成为业务写源。 |

### 7.3 依赖倒置结论

| 外部依赖 | 倒置边界 | 核心可见形态 |
|---|---|---|
| `L3-method-library` | method definition seam | runtime process shape / definition ref / snapshot |
| `L1-work` | work context seam | Project / WorkItem / Iteration context ref or snapshot |
| `L1-identity` | identity actor seam | actor / member ref or resolved context |
| `L1-governance` | governance decision seam | decision / policy / gate ref or outcome marker |
| `L1-artifact` | artifact reference seam | artifact / evidence / baseline ref or summary |
| `L2-runtime` / `L2-member-service` | execution feedback seam | Activity feedback summary / ref |
| `L1-conversation` | conversation context seam | conversation context ref |
| `L4-observability` / `L4-archive` | handoff seam | trace / archive handoff ref |
| `L0-bus` | event seam | accepted / emitted capability-level change envelope |
| state store / infra | technical carrier seam | persisted Process fact / derived state / evidence handle |

### 7.4 层间红线结论

| 红线 | 保护目标 |
|---|---|
| 核心语义不得直接依赖非 `L0-core` sibling repo | 保护唯一编译期依赖和真相域边界 |
| 外部接缝不得绕过编排 / 承接角色直接改写核心事实 | 保护校验、幂等、授权和事务边界 |
| 技术承载不得定义业务规则、状态语义或边界不变量 | 保护 Process truth 不被存储 / 总线实现污染 |
| 查询 / 投影 / 报告 / reconciliation 不得反向成为业务写源 | 保护读 / 维护路径不污染写模型 |
| runtime、conversation、observability、archive 正文不得进入核心语义 | 保护禁止正文边界 |

### 7.5 本仓依赖裁剪表

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
| `L4-observability` | observability 消费 audit / trace / metrics material | 被依赖方 | 事件协作 / 追溯交接 | 是 | checkpoint、等待、恢复和维护材料需要观测 / 审计上下文,但不反写真相 |
| `L4-archive` | archive 消费 L1 domain snapshot / export 能力,并承接归档相关事件 | 被依赖方 | 运行期 / 事件协作 / 追溯交接 | 是 | 过程归档和恢复需要 Process 事实快照与归档交接 |
| PostgreSQL / BPMN 引擎 / 对象存储 | 旧文档实现候选 | 非正式外部依赖 | 运行期 | 否 | 属于后续架构 / 详细 / 配置 / 实施选择,不进入跨仓依赖主链 |

### 7.6 本仓依赖类型分类表

| 依赖类型 | 关联项目 | 本仓如何使用 / 提供能力 | 后续文档落点 |
|---|---|---|---|
| 编译期依赖 | `L0-core` | 使用共享 ID、错误、trace、event envelope、metadata 和 evidence 契约 | 详细设计 / 实施计划 |
| 事件协作依赖 | `L0-bus`、`L1-work`、`L1-governance`、`L1-artifact`、`L1-conversation`、`L1-workspace`、`L2-runtime`、`L2-member-service`、`L4-observability`、`L4-archive` | 通过事件协作传播或消费过程 / Activity / waiting gate / execution feedback / handoff 相关能力级变化 | 架构设计 / 测试方案 |
| 运行期依赖 | `L3-method-library`、`L1-work`、`L1-identity`、`L1-governance`、`L1-artifact`、`L1-conversation`、`L2-runtime`、`L2-member-service`、`L4-archive` | 运行时消费定义、项目工作、成员、治理、证据、上下文、执行反馈和归档交接边界 | 架构设计 / 详细设计 |
| 下游消费 / 运行期提供 | `L0-sdk`、`L1-conversation`、`L1-workspace`、`L4-observability`、`L4-archive` | 向 SDK、对话显化、workspace 视图、观测审计和归档恢复提供过程执行事实能力或快照来源 | 架构设计 / 实施计划 |

### 7.7 本仓禁止依赖表

| 禁止依赖 | 禁止原因 | 正确协作方式 |
|---|---|---|
| `L1-process` -> `L3-method-library` 编译期依赖 | 会把方法定义源码和过程执行真相耦合 | 通过正式定义读取、snapshot、adapter 或事件同步形成 runtime index |
| `L1-process` -> `L1-work` 编译期依赖 | 会把 Project / WorkItem / Iteration truth 引入 Process | 使用 `L0-core` 共享引用,通过运行期 / 事件协作对齐 |
| `L1-process` -> `L1-identity` 编译期依赖 | 会把 GlobalMember / Actor 生命周期真相引入 Process | 使用共享 actor / member 引用,通过运行期边界解析 |
| `L1-process` -> `L1-governance` / `L1-artifact` 编译期依赖 | 会破坏 L1 真相域平权并形成循环风险 | 运行期边界、引用或事件协作 |
| `L1-process` -> `L1-conversation` / `L1-workspace` 编译期依赖 | 会把显化和聚合视图状态引入过程执行真相仓 | 使用引用边界、查询和事件 / 投影协作 |
| `L1-process` -> `L2-runtime` / `L2-member-service` 编译期依赖 | 会让 L1 反向依赖运行层 | 运行期 / 事件协作,由 L2 承接执行并反馈 |
| `L1-process` -> `L4-observability` / `L4-archive` 编译期依赖 | 会把横切观测或归档实现引入业务真相仓 | trace / audit / archive handoff、snapshot / export 边界 |
| `L1-process` -> PostgreSQL / BPMN engine / object storage 作为业务语义依赖 | 会让技术实现定义 Process truth | 作为技术选型或基础设施承载,不得定义核心语义 |
| `L5/L6` 产品绕过 `L0-sdk` 直接绑定 `L1-process` 源码 | 会破坏 SDK 统一接入层 | 经 SDK 或正式 API 边界消费 |

### 7.8 依赖裁剪图

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
- 图中箭头表达依赖 / 消费 / 协作方向,不表达调用顺序、接口时序、事件传播顺序或实现流程。

### 7.9 依赖边界说明短文

`L1-process` 的核心语义必须被外部接缝和技术承载隔离,因为它承载的是过程执行事实和边界规则,不是相邻仓源码、协议或存储实现。运行期依赖和事件协作依赖都必须先进入外部接缝角色,再由编排 / 承接角色转换为核心可判断的 ref、snapshot、resolved context 或 feedback summary。只有 `L0-core` 可以作为编译期依赖进入后续 Cargo / package dependency 讨论。PostgreSQL、BPMN engine、object storage、queue implementation 等技术候选只进入技术选型和配置设计,不得成为业务语义依赖。

---

## 8. 回填草稿

以下内容供 Step 16 重建正式 `01-架构设计.md` 时回填。正式文档可摘录本文件 §7 的结构化结论。

```md
## 8. 依赖方向与层间约束

> 校准来源:
> - `design-calibration/01_arch_step_07_dependency_direction.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“SOP 问题回答”“依赖方向图”“层间约束表”“依赖倒置结论”“本仓依赖裁剪表”和“本仓禁止依赖表”小节,了解本章如何保护核心语义不被外部接缝、技术承载或相邻仓源码打穿。

正式章节应摘录:

- `design-calibration/01_arch_step_07_dependency_direction.md` §7.1 依赖方向图。
- `design-calibration/01_arch_step_07_dependency_direction.md` §7.2 层间约束表。
- `design-calibration/01_arch_step_07_dependency_direction.md` §7.3 依赖倒置结论。
- `design-calibration/01_arch_step_07_dependency_direction.md` §7.4 层间红线结论。
- `design-calibration/01_arch_step_07_dependency_direction.md` §7.5 本仓依赖裁剪表。
- `design-calibration/01_arch_step_07_dependency_direction.md` §7.6 本仓依赖类型分类表。
- `design-calibration/01_arch_step_07_dependency_direction.md` §7.7 本仓禁止依赖表。
- `design-calibration/01_arch_step_07_dependency_direction.md` §7.8 依赖裁剪图。
- `design-calibration/01_arch_step_07_dependency_direction.md` §7.9 依赖边界说明短文。
```

---

## 9. 待确认事项

| 编号 | 待确认事项 | 当前状态 |
|---|---|---|
| Q-001 | 运行期依赖具体采用 API、SDK、adapter 还是 event projection | 后续交互方式、详细设计和实施计划收敛 |
| Q-002 | 技术承载角色具体映射到哪些 crate / module / infrastructure | 后续概要 / 详细 / 配置 / 实施计划收敛 |
| Q-003 | PostgreSQL / BPMN engine / object storage 是否采用 | Step 10 技术选型和配置设计收敛 |

---

## 10. 进入下一步条件

- 已明确内部依赖角色和允许方向。
- 已明确禁止依赖、依赖倒置和层间红线。
- 已裁剪本仓跨仓依赖子图,并区分编译期 / 运行期 / 事件协作依赖。
- 未写代码调用链、接口协议、运行拓扑、数据库细节或部署参数。

结论:可以进入 Step 8 `数据所有权与一致性策略`。
