# Step 2. 明确架构目标与约束

> 对应 SOP: `standards/document/架构设计讨论流程_SOP.md` Step 2
> 回填章节: `01-架构设计.md` §2 业务背景与驱动力 / §3 约束条件
> 生成日期: 2026-06-02
> 状态: 已完成

---

## 1. 本步目标

把需求层已经收稳的边界、能力和数据前提转译成架构必须确保成立的结构目标、不可变约束、当前阶段可接受取舍和架构非目标。

---

## 2. 本步输入

| 输入 | 状态 | 用途 |
|---|---|---|
| `01_arch_step_01_requirement_baseline.md` | 已完成 | 提供架构需求基线、硬约束和未关闭需求风险 |
| `00-需求文档.md` §2 / §7 / §10 / §11 / §14 / §15 | 已完成 | 提供仓定位、核心闭环、业务规则、数据归属、验收底线和风险 |
| `projects/L0-core/00~07` | 已完成深度校准 | 提供共享契约、actor、metadata、error、trace、evidence 边界 |
| `projects/L0-bus/00~07` | 已完成深度校准 | 提供事件协作、outbox、投递和重放语义 |
| `projects/L1-identity/00~07` | 已完成深度校准 | 提供 GlobalMember、ActorRef、role 和成员生命周期引用来源 |
| `projects/L1-conversation/00~07` | 已完成深度校准 | 提供 conversation fact、trace / handoff 和授权查询来源 |
| `projects/L3-method-library/00~07` | 已完成深度校准 | 提供 role / task / work product / process template / view profile 定义来源 |
| 旧 `01-架构设计.md` §1~§3 | 未按最新 SOP 校准 | 作为旧目标、约束和量化指标问题诊断输入 |

---

## 3. SOP 问题回答

### 3.1 这个仓在架构层面要确保什么成立？

`L1-work` 在架构层面必须确保以下结构成立:

- Project 有独立的项目工作事实真相边界,不能退化为 conversation topic、ProcessInstance、workspace view 或 runtime context。
- ProjectMember 能表达 GlobalMember 在项目内的承担事实,同时不拥有平台成员身份生命周期。
- Backlog / WorkItem / child WorkItem 能承载正式协作级工作全集,并阻止个人执行步骤、对话建议和 runtime plan item 直接污染正式任务真相。
- Iteration 能作为正式工作全集中的承诺子集成立,不被 process planning timing 或看板展示反向定义。
- ImplementationPlan promote / formalize 能作为边界能力存在,但 Work 不拥有 ImplementationPlan 正文或执行推进。
- 查询、看板、投影、对账和维护报告只能消费或派生 Work 真相,不得成为新的业务写源。
- 与 identity、conversation、method-library、process、governance、artifact、runtime、workspace 的协作必须通过引用、快照、事件或运行期边界完成。

### 3.2 哪些约束是不可变的？

不可变约束来自需求一票否决项和数据归属红线:

- 不允许相邻仓正文进入 Work 真相。
- 不允许 process、governance、artifact、conversation、runtime、workspace 或外部消费方反向定义 Work 真相。
- 不允许 Work 拥有 GlobalMember、Role、Actor 生命周期或身份正文。
- 不允许 conversation suggestion、discussion text 或 chat UI 动作直接创建正式 WorkItem。
- 不允许 runtime plan item、tool execution step 或 agent local checklist 直接写入 Backlog。
- 不允许 query、projection rebuild、对账或 report generation 隐式创建或修改 Project、ProjectMember、WorkItem、child WorkItem 或 Iteration。
- 不允许除 `L0-core` 外形成编译期依赖。
- 不允许关键变化缺少可追溯入口。

### 3.3 哪些约束是当前阶段可以接受的取舍？

当前可接受的取舍主要围绕外围增强能力、未定技术指标和未定实现形态:

- 高级看板、多视图展示和容量趋势当前作为消费增强处理,架构只保留派生 / 查询边界,不把它们作为核心真相路径。
- 自动解除阻塞、自动 spillover 和自动维护建议当前作为后续增强处理,不得替代显式业务变化。
- 跨项目依赖当前作为演进能力处理,不阻塞单项目 Work 闭环。
- 旧 `CreateWorkItem P95 < 100ms`、`GetProjectBoard P95 < 300ms`、`10w 项目 x 50 WorkItem` 当前不写成架构硬指标,后续在技术选型、测试方案或实施阶段验证。
- 存储、索引、物化视图和缓存形态当前不在 Step 2 锁定,后续由容器、数据一致性和技术选型 Step 收敛。

### 3.4 哪些目标可以明确判断,甚至量化？

当前可以明确判断的目标:

- 是否有独立 Work 真相边界。
- 是否区分 truth / snapshot / reference / derived view。
- 是否 ProjectMember 与 GlobalMember 生命周期分离。
- 是否 Backlog 只接收正式协作级 WorkItem / child WorkItem。
- 是否 Iteration 只表达正式工作全集中的承诺子集。
- 是否查询、看板、投影和维护报告不反写真相。
- 是否除 `L0-core` 外没有编译期依赖。
- 是否关键变化保留 trace / audit / outbox / evidence 接缝。

当前不强行量化:

- WorkItem 创建延迟。
- Board 查询延迟。
- 活跃项目 / WorkItem 容量。
- DAG 查询规模。
- 事件输出吞吐。

这些旧指标可能仍有价值,但缺少新版需求基线中的正式负载模型,应后移到技术选型、测试方案或实施阶段验证。

### 3.5 哪些事情虽然相关,但不是本仓架构当前要解决的问题？

- GlobalMember、actor、role 生命周期和认证授权架构。
- Conversation truth、聊天消息、trace / handoff 正文和 Chat UI。
- TaskDefinition、WorkProductDefinition、ProcessTemplateDef、ViewProfile 等方法定义架构。
- ProcessInstance、Activity、checkpoint、planning / review timing 等流程执行架构。
- Gate、Policy、Control、Approval 等治理决策架构。
- Artifact、evidence、baseline、ImplementationPlan 正文和产物生命周期架构。
- Runtime agent loop、tool invocation、plan item progress 和执行步骤推进架构。
- PersonalWorkspace、ProjectWorkspace、dashboard、inbox 等聚合视图架构。

---

## 4. 当前文档问题诊断

| 旧架构内容 | 问题 | 本轮处理 |
|---|---|---|
| 旧 `业务背景` 直接把 Project / WorkItem / Iteration 当作实现聚合展开 | 缺少从新版需求边界到结构目标的转译 | Step 2 改为从“项目工作事实真相仓必须独立”推导架构目标 |
| 旧 `成功标准` 直接写 P95、规模和 DAG 健康指标 | 当前需求文档没有正式负载模型,直接继承会变成伪约束 | 后移到技术选型、测试方案或实施验证,本步不作为架构硬约束 |
| 旧 `不可变约束` 混合 ADR、不变量和实现方案 | 把领域规则、架构约束和详细设计对象混写 | Step 2 只写仓级职责、数据、依赖、显式变化和追溯红线 |
| 旧文档过早进入 PostgreSQL、递归 CTE、read model 设计 | Step 2 不应提前进入技术选型和数据实现 | 后移到 Step 8 数据一致性、Step 10 技术选型和 Step 11 取舍 |

---

## 5. 改动前后对比

| 维度 | 旧口径 | 新口径 |
|---|---|---|
| 架构目标 | 支持 Project / ProjectMember / Backlog / WorkItem / Iteration 实现 | 确保 Work 真相边界、核心闭环、数据归属、promote 边界和派生结果边界成立 |
| 约束条件 | 把 PostgreSQL、DAG 查询、done 判据和性能数字混写为约束 | 只把仓级职责、数据、依赖、显式变化和追溯写成不可变约束 |
| 当前取舍 | 没有明确取舍,容易把外围增强写成目标或 TODO | 外围增强能力以“可派生、不反写真相”的方式暂存 |
| 非目标 | 分散写在职责边界和依赖关系中 | 集中明确本架构不设计 identity、conversation、method-library、process、governance、artifact、runtime、workspace 主体架构 |

---

## 6. 结构化中间产物

### 6.1 业务背景与结构性驱动力

Quantalithos 的协作对象最终需要落在可追溯的软件项目上,但项目工作事实不能散落在 conversation、process、runtime、artifact 或 workspace 的局部视图中。随着 `L0-core`、`L0-bus`、`L0-sdk`、`L1-identity`、`L1-conversation` 和 `L3-method-library` 已经稳定,`L1-work` 需要在架构层把 Project、ProjectMember、Backlog、WorkItem、child WorkItem、Iteration 和 promote 边界收束为独立项目工作事实真相。

### 6.2 架构目标表

| 架构目标 | 说明 |
|---|---|
| 承载独立的项目工作事实真相边界 | 否则项目会退化为对话主题、流程实例、执行上下文或 workspace 视图。 |
| 支撑核心 Work 能力闭环完整成立 | 否则项目主语、成员承担、正式工作全集、承诺子集和追溯消费会断裂。 |
| 稳定区分真相数据、快照数据、引用数据和派生视图 | 否则相邻仓正文和辅助结果会混入 Work 真相。 |
| 守住 ProjectMember 与 GlobalMember 生命周期边界 | 否则 Work 会接管身份仓的成员生命周期。 |
| 守住 Backlog 与个人执行步骤 / 对话建议 / runtime plan item 的边界 | 否则正式工作全集会被非协作级步骤污染。 |
| 允许 ImplementationPlan promote 成为显式 formalize 边界 | 否则 Work 要么无法接收执行计划升级,要么会吞入执行计划正文。 |
| 让查询、看板、投影和维护报告只能从真相派生 | 否则消费增强能力会成为第二业务事实来源。 |
| 保留关键变化的追溯接缝 | 否则项目、成员承担、工作拆分、承诺范围和完成依据无法支撑复盘与审计。 |

### 6.3 不可变约束表

| 约束 | 说明 |
|---|---|
| 不允许 Work 拥有 GlobalMember、Role、Actor 生命周期或身份正文 | 否则 `L1-identity` 边界被打穿。 |
| 不允许 conversation 正文、聊天消息或 UI 动作直接成为 Work 真相 | 否则对话建议会污染正式工作全集。 |
| 不允许 method-library 定义正文进入 Work 真相 | 否则定义仓与项目执行事实混淆。 |
| 不允许 process planning、review 或 Activity 推进直接维护 Backlog 真相 | 否则流程节奏会反向写工作事实。 |
| 不允许 governance / artifact / workspace / runtime 反向持有或改写 Work 正式任务真相 | 否则多个仓会各自形成任务真相。 |
| 不允许 runtime plan item、tool execution step 或 local checklist 直接写入 Backlog | 否则个人执行层会污染协作级任务层。 |
| 不允许 query、projection、对账或 report generation 写业务真相 | 否则派生和维护能力会成为隐藏写源。 |
| 不允许除 `L0-core` 外形成编译期依赖 | 否则 L1 平权真相域会形成循环和强耦合。 |
| 不允许关键变化不可追溯 | 否则项目工作事实无法支撑审计、复盘和责任解释。 |

### 6.4 当前阶段可接受取舍表

| 取舍 | 当前口径 |
|---|---|
| 高级看板与多视图消费 | 当前作为外围增强处理,架构只要求从 Work 真相派生且不反写真相。 |
| 自动解除阻塞 / 自动 spillover / 自动维护建议 | 当前作为后续增强处理,不得替代显式业务变化和审计解释。 |
| 容量趋势和负载风险提示 | 当前只保留可观测和后续分析接缝,不作为核心闭环前置。 |
| 项目内工具能力调整协同 | 当前只保留与 governance / method-library 的边界,不把治理能力放入 Work 核心。 |
| 跨项目依赖理解 | 当前作为演进能力处理,单项目 Work 闭环优先成立。 |
| 旧性能 / 容量指标 | 当前不继承为硬约束,后续在技术选型、测试方案和实施阶段评估。 |
| 存储 / 索引 / 物化视图方案 | 当前不在 Step 2 锁定,后续由数据一致性和技术选型 Step 决定。 |

### 6.5 架构非目标表

| 非目标 | 不展开原因 |
|---|---|
| 不设计 Identity 生命周期和认证授权架构 | GlobalMember、actor、role 生命周期属于 `L1-identity` / `L0-core` 和安全 / 治理边界。 |
| 不设计 Conversation truth 或 Chat UI 架构 | 对话事实、trace / handoff 和聊天界面属于 `L1-conversation` / `L5-chat`。 |
| 不设计 Method Library 定义架构 | 任务定义、工作产物定义、流程模板和视图定义属于 `L3-method-library`。 |
| 不设计 Process 执行架构 | Activity、ProcessInstance、checkpoint 和流程推进属于 `L1-process`。 |
| 不设计 Governance 裁决架构 | Gate、Policy、Control、Approval 结论属于 `L1-governance`。 |
| 不设计 Artifact 正文和证据链架构 | 产物正文、evidence、baseline、ImplementationPlan 正文属于 `L1-artifact`。 |
| 不设计 Runtime 执行架构 | agent loop、tool invocation、plan item progress 和执行步骤推进属于 `L2-runtime` / `L2-tools`。 |
| 不设计 Workspace 聚合视图架构 | PersonalWorkspace、ProjectWorkspace、dashboard 和 inbox 属于 `L1-workspace`。 |

---

## 7. 回填草稿

正式 `01-架构设计.md` 后续整理时,本步内容应回填到:

- §2 业务背景与驱动力:回填“业务背景与结构性驱动力”和“架构目标表”。
- §3 约束条件:回填“不可变约束表”“当前阶段可接受取舍表”“架构非目标表”。

---

## 8. 待确认事项

本步不新增阻塞性待确认事项。已知待确认项沿用 Step 1 的风险清单,后续分别在职责边界、数据所有权、技术选型、演进路线和风险章节承接。

---

## 9. 进入下一步条件

- 已明确架构必须确保成立的结构性目标。
- 已明确不可变约束、当前阶段取舍和架构非目标。
- 未提前进入系统上下文图、容器、部署、数据库或技术选型。
- 可以进入 Step 3“职责边界”。
