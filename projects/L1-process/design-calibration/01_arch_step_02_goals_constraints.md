# Step 2. 明确架构目标与约束

> 对应 SOP: `standards/document/架构设计讨论流程_SOP.md` Step 2
> 回填章节: `01-架构设计.md` §2 业务背景与驱动力、§3 约束条件
> 生成日期: 2026-06-05

---

## 1. 本步目标

把 Step 1 已收稳的需求边界、能力闭环、数据归属和依赖前提转译成架构必须确保成立的结构目标、不可变约束、当前阶段可接受取舍和架构非目标。本步不写容器、部署、依赖方向图、技术选型、协议、状态机或实现方案。

---

## 2. 本步输入

| 输入 | 当前状态 | 本步使用方式 |
|---|---|---|
| `design-calibration/01_arch_step_01_requirement_baseline.md` | Step 1 已完成 | 作为架构目标与约束的直接输入 |
| `projects/L1-process/00-需求文档.md` §2 / §7 / §9 / §10 / §11 / §13 / §14 / §15 | 已重建 | 提取仓定位、核心闭环、规则、数据、非功能、验收和风险 |
| `design-calibration/00_req_step_16_traceability_matrix.md` | 已完成 | 验证目标与功能 / 规则 / 数据 / 验收的对应关系 |
| 旧 `projects/L1-process/01-架构设计.md` | 旧 Draft | 仅作为旧目标、旧技术假设和旧性能目标诊断来源 |

---

## 3. SOP 问题回答

### 3.1 这个仓在架构层面要确保什么成立?

`L1-process` 架构必须确保“过程执行事实”作为独立真相成立,并让方法定义、项目工作、治理决策、产物证据、runtime 执行、conversation 显化、workspace 视图、observability 和 archive 都围绕它协作,而不是把这些相邻真相吸进 Process。

架构层必须守住以下结构性结果:

1. 运行时过程形态能从方法定义来源进入 Process,但不复制或接管定义正文。
2. ProcessProfile、ProcessInstance、Activity、Token / Gateway、waiting gate、checkpoint / recovery 能作为同一过程执行事实链条成立。
3. Activity / Token 语义不滑向 WorkItem、Iteration 或 runtime step。
4. waiting gate / recovery 语义不滑向 Governance decision、runtime checkpoint、reasoning trace 或 archive package。
5. 查询、投影、报告、对账和维护能力只能消费或修复派生结果,不得反向创造业务真相。
6. 跨仓依赖必须通过共享契约、引用、事件、快照、port / adapter 或 handoff 表达,不得把相邻仓写成编译期依赖。

### 3.2 哪些约束是不可变的?

不可变约束来自需求规则、数据归属和验收否决项:

| 约束来源 | 不可变约束 |
|---|---|
| method-library 边界 | Process 不拥有 ProcessTemplateDef、TaskDefinition、RoleDefinition、WorkProductDefinition、ViewProfile 或 Method Content 正文 |
| work 边界 | Process 不拥有 Project、ProjectMember、Backlog、WorkItem、child WorkItem 或 Iteration truth |
| governance 边界 | Process 不拥有 Gate、Policy、Control、Approval 或 decision truth |
| runtime / member-service 边界 | Process 不拥有 LLM / tool loop、runtime 微步 checkpoint、执行计划推进、容器生命周期或运行资源调度 |
| artifact / archive 边界 | Process 不拥有 Artifact、Evidence、Baseline、ImplementationPlan 或 Archive Package 正文 |
| conversation / workspace / observability 边界 | Process 不拥有 conversation truth、workspace 聚合视图、reasoning trace 正文、指标存储或审计总账 |
| 依赖边界 | `L0-core` 是唯一编译期上游;其他仓不得成为 package dependency |
| 写 / 读 / 维护边界 | 查询、投影、报告、恢复对账和维护任务不得隐式推进或改变 Process 真相 |

### 3.3 哪些约束是当前阶段可以接受的取舍?

当前可接受取舍只覆盖 Process 潜在能力范围内的架构收缩,不把边界外事项伪装为取舍:

| 取舍对象 | 当前处理 |
|---|---|
| 完整 BPMN 表达力 | 当前优先保证基础 Activity、Token / Gateway、waiting gate 和恢复连续性;复杂网关和全量 BPMN 形态作为演进事项 |
| 嵌套过程 / CallActivity | 当前保留为演进线索,不作为核心架构闭环成立条件 |
| 模板刚度分层和高级裁剪策略 | 当前只在架构层保留 method-library / governance 边界约束,不把 ADR-0010 候选方向硬化为当前主线 |
| 高级 timeline / dashboard / 趋势分析 | 当前只承认消费面和派生快照,不把高级视图作为 Process 架构主结构 |
| 自动调度、自动重试、补偿建议 | 当前只保留恢复 / 维护边界,不把自动化策略写成 Process 真相推进主路径 |
| 旧性能候选指标 | 当前作为质量目标候选和后续测试输入,不作为架构已验证硬指标 |

### 3.4 哪些目标可以明确判断,甚至量化?

当前可明确判断的目标是结构目标,不是实现指标:

| 目标类型 | 当前判断 |
|---|---|
| 真相独立性 | 必须成立。Process truth 不能被相邻仓 truth 覆盖或替代。 |
| 核心闭环 | 必须成立。C-1~C-5 是当前架构主线。 |
| 边界保护 | 必须成立。正文入仓、truth 串仓、非 core 编译依赖均为否决。 |
| 可追溯性 | 必须成立。运行时过程形态、实例、节点、等待、恢复和维护动作必须可解释。 |
| 幂等 / 恢复连续 | 必须成立。重复输入不得产生重复真相,恢复不得产生第二份过程真相。 |
| 旧性能数字 | 当前不能量化为硬目标。`200ms / 50ms / 500ms / 30s` 只作为后续压测和容量评估候选。 |

### 3.5 哪些事情虽然相关,但不是本仓架构当前要解决的问题?

| 相关事项 | 当前架构判断 |
|---|---|
| 方法库定义建模 | 由 `L3-method-library` 拥有,Process 只消费定义来源形成 runtime index |
| Project / WorkItem / Iteration 架构 | 由 `L1-work` 拥有,Process 只保留过程语境、引用和反馈边界 |
| Gate / Policy / decision 架构 | 由 `L1-governance` 拥有,Process 只表达 waiting gate / pause context |
| Artifact / Evidence / Baseline 正文架构 | 由 `L1-artifact` 和 archive 相关仓拥有 |
| Runtime loop / tool execution / container orchestration | 由 `L2-runtime` / `L2-member-service` 拥有 |
| Conversation UI / workspace dashboard / observability metrics store | 由对应显化、聚合和横切仓拥有 |

---

## 4. 当前文档问题诊断

| 位置 | 当前表现 | 问题 | 本步处理 |
|---|---|---|---|
| 旧 `01-架构设计.md` §1.3 | 直接列 `CompleteActivity P95 < 200ms`、checkpoint P95 等目标 | 新版需求已经把旧数字降为候选目标 | Step 2 只保留为候选质量输入 |
| 旧 `01-架构设计.md` §3 | 把“流程引擎 + persisted state machine”写成当前架构风格 | 这是技术机制 / 方案,应后移到 Step 10 / Step 11 重新论证 | 本步不继承为目标 |
| 旧 `01-架构设计.md` §2.2 | 语言栈写 Python | 属于技术选型,不应由 Step 2 固定 | 后移 Step 10 |
| 旧 `01-架构设计.md` | 对 Process / Work / Runtime / Governance 边界有描述但不完整 | 新版需求已补齐更多相邻仓边界和禁止正文 | 本步按新版需求重新收束 |
| 旧 `01-架构设计.md` | 外围能力和核心闭环混杂 | 容易把完整 BPMN / 嵌套 / 高级视图误写为当前主线 | 本步明确可接受取舍 |

---

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 架构目标表达 | 偏功能和技术机制 | 改为结构性结果 | 对齐架构规范 4.2 |
| 不可变约束 | 只覆盖部分旧边界 | 覆盖 method-library、work、governance、artifact、runtime、identity、conversation、workspace、observability、archive 和依赖裁剪 | 对齐新版需求 |
| 可接受取舍 | 未清晰区分 | 明确完整 BPMN、嵌套、模板刚度、高级视图、自动化建议和旧性能指标的当前口径 | 防止范围膨胀 |
| 架构非目标 | 隐含在正文 | 形成独立非目标表 | 便于后续审查 |

---

## 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A: 继续沿用旧架构目标和旧技术风格 | 复用快 | 与新版需求和文档链不一致 | 不采用 |
| 方案 B: 从新版需求基线重新推导架构目标与约束 | 可追溯,边界完整 | 需要重写正式文档 | 采用 |
| 方案 C: Step 2 直接选择流程引擎、数据库和语言 | 进展快 | 越过技术选型和取舍步骤 | 不采用 |
| 方案 D: 把所有外围增强都列为非目标 | 范围最小 | 会丢失 Process 演进线索 | 不采用,改列为当前阶段取舍 |

### 6.1 待确认问题的方案选择

#### 完整 BPMN / 嵌套过程如何处理?

| 方案 | 内容 | 影响 |
|---|---|---|
| 方案 A | 当前架构主线必须覆盖完整 BPMN 和嵌套过程 | 会扩大当前架构闭环,并提前固化 ADR-0011 |
| 方案 B | 当前架构守住基础 Activity / Token / Gateway / waiting gate / recovery,复杂表达力进入演进 | 与需求外围增强口径一致 |

推荐方案 B。

#### 旧性能数字是否进入架构目标?

| 方案 | 内容 | 影响 |
|---|---|---|
| 方案 A | 直接作为硬架构目标 | 与需求 §13 / §15 冲突,缺少验证来源 |
| 方案 B | 作为候选 SLO 和后续测试输入 | 保留旧线索,不伪量化 |

推荐方案 B。

#### 是否在 Step 2 选择技术栈?

| 方案 | 内容 | 影响 |
|---|---|---|
| 方案 A | 直接继承旧 Python 或改成新语言 | Step 顺序错位 |
| 方案 B | 只写架构结构目标,技术栈留到 Step 10 | 对齐 SOP |

推荐方案 B。

---

## 7. 结构化中间产物

### 7.1 业务背景结论

Quantalithos 需要让项目不是孤立任务和一次性对话的堆叠,而是按明确过程规矩推进、在关键节点可等待人类或治理结论、失败后能从同一过程事实恢复、并能被相邻仓持续消费和追溯。`L1-process` 值得单独做架构设计,是因为过程执行事实跨越 method-library、work、governance、artifact、runtime、conversation、workspace、observability 和 archive;如果没有独立架构边界,这些事实会散落在定义、任务、审批、执行日志和视图中,形成多真相。

### 7.2 驱动力结论

| 驱动力 | 说明 |
|---|---|
| 过程执行真相需要独立承载 | ProcessInstance、Activity、Token / Gateway、waiting gate、checkpoint / recovery 不能散落在相邻仓 |
| 定义来源与运行时索引必须分离 | method-library 是定义权威源,Process 只能形成可执行过程语境 |
| 工作事实与过程事实必须分离 | WorkItem / Iteration truth 不应由 Activity 或 ProcessInstance 隐式改写 |
| 暂停等待和恢复必须可解释 | waiting gate 和 recovery 需要保留等待原因、外部依据和恢复连续性 |
| 消费与维护不能反写真相 | read model、timeline、报告、对账和维护路径必须有明确边界 |
| 跨仓协作必须裁剪依赖 | 除 `L0-core` 外不得把相邻仓变成编译期依赖 |

### 7.3 架构目标表

| 架构目标 | 说明 |
|---|---|
| 承载独立的过程执行事实真相 | 否则过程状态会退化为 work 状态、runtime 记录、workspace 进度或 conversation 显化的附属物。 |
| 支撑运行时过程形态从定义来源稳定进入项目语境 | 否则 method-library 定义和 Process 运行时索引会混成同一份真相。 |
| 支撑 ProcessProfile、ProcessInstance、Activity、Token / Gateway 的连续推进语义 | 否则项目过程无法围绕同一实例和节点位置解释当前推进状态。 |
| 守住 Activity / WorkItem / runtime step 的语义边界 | 否则 Process 会接管工作事实或执行事实。 |
| 支撑 waiting gate、checkpoint 和 recovery 的同一事实连续性 | 否则暂停、恢复和故障处理会产生不可解释的分叉过程真相。 |
| 允许相邻仓通过引用、快照、事件和运行期边界协作 | 否则 Process 要么吸收相邻仓正文,要么无法被相邻仓稳定消费。 |
| 守住写路径、读路径和维护路径的真相边界 | 否则查询、投影、报告或对账会成为隐式业务写源。 |
| 支撑关键变化、边界异常和恢复动作可追溯 | 否则过程规矩推进无法被审计、复盘或交接给 observability / archive。 |

### 7.4 不可变约束表

| 约束 | 说明 |
|---|---|
| 不拥有 method-library 定义正文 | 否则运行时过程形态会替代 ProcessTemplateDef / TaskDefinition 等定义真相。 |
| 不拥有 work truth | 否则 ProcessInstance、Activity 或 Token 会被误写为 Project、WorkItem、Iteration 或 Backlog 状态。 |
| 不拥有 governance decision truth | 否则 waiting gate 会变成 Gate / Policy / Approval / decision 的第二真相。 |
| 不拥有 artifact、evidence、baseline、implementation plan 或 archive package 正文 | 否则 Process 会成为产物或归档正文仓。 |
| 不拥有 runtime 执行正文、tool loop、agent loop、plan item progress 或微步 checkpoint | 否则 Activity feedback 会吞并 L2-runtime / member-service 事实。 |
| 不拥有 identity、conversation、workspace、observability 正文或主视图真相 | 否则 Process 会打穿身份、对话、工作台和横切观测边界。 |
| 不允许查询、投影、报告、维护和对账隐式改变业务真相 | 否则派生面会反向污染 Process 主事实。 |
| 不允许恢复产生第二份过程真相 | 否则 checkpoint / recovery 失去连续性意义。 |
| 不允许除 `L0-core` 外的 sibling repo 成为编译期依赖 | 否则全局依赖裁剪和 L1 真相域平权被破坏。 |

### 7.5 当前阶段可接受取舍表

| 取舍 | 当前口径 |
|---|---|
| 完整 BPMN 和复杂网关表达力 | 当前作为表达力增强处理,基础架构优先守住 Activity、Token / Gateway 和 waiting gate 的核心推进语义。 |
| 嵌套过程 / CallActivity | 当前作为演进事项处理,不作为 C-1~C-5 核心闭环成立前置。 |
| 模板刚度分层和高级裁剪策略 | 当前只保留 method-library / governance 约束边界,不硬化 Proposed ADR 的具体方案。 |
| 高级过程投影视图 / timeline / dashboard | 当前作为消费面增强处理,不进入 Process 主真相结构。 |
| 自动调度、自动重试和补偿建议 | 当前只保留维护与恢复边界,不纳入自动推进主路径。 |
| 旧性能和恢复数字 | 当前作为候选质量目标和测试输入,不写成已验证硬指标。 |

### 7.6 架构非目标表

| 非目标 | 不展开原因 |
|---|---|
| 不设计 method-library 定义架构 | Process 只消费定义来源形成 runtime index,定义正文属于 `L3-method-library`。 |
| 不设计 work 项目 / 工作项 / 迭代架构 | Project、WorkItem、Iteration 和 Backlog truth 属于 `L1-work`。 |
| 不设计 governance 决策架构 | Gate、Policy、Approval 和 decision truth 属于 `L1-governance`。 |
| 不设计 artifact / archive 正文存储架构 | 产物、证据、基线、实施计划和归档包正文属于 artifact / archive 相关仓。 |
| 不设计 runtime 执行和 member 容器调度架构 | LLM / tool loop、执行计划、容器生命周期和运行资源属于 L2 运行层。 |
| 不设计 identity、conversation、workspace、observability 主系统架构 | Process 只与这些仓通过引用、快照、事件或消费面协作。 |
| 不在架构目标层定义 API / DTO / 状态机 / 数据库表 | 这些属于概要、详细、配置、测试或实施阶段。 |

---

## 8. 回填草稿

以下内容供 Step 16 重建正式 `01-架构设计.md` 时回填。正式文档可摘录本文件 §7 的结构化结论。

```md
## 2. 业务背景与驱动力

> 校准来源:
> - `design-calibration/01_arch_step_02_goals_constraints.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“SOP 问题回答”“结构化中间产物”和“设计取舍”小节,了解本章如何把需求闭环转译为架构目标。

正式章节应摘录:

- `design-calibration/01_arch_step_02_goals_constraints.md` §7.1 业务背景结论。
- `design-calibration/01_arch_step_02_goals_constraints.md` §7.2 驱动力结论。
- `design-calibration/01_arch_step_02_goals_constraints.md` §7.3 架构目标表。
```

```md
## 3. 约束条件

> 校准来源:
> - `design-calibration/01_arch_step_01_requirement_baseline.md`
> - `design-calibration/01_arch_step_02_goals_constraints.md`
>
> 延伸阅读:
> - 建议继续阅读上述中间产物的“架构硬约束结论”“不可变约束表”“当前阶段可接受取舍表”和“架构非目标表”小节,了解本章约束如何从需求边界和架构目标收敛而来。

正式章节应摘录:

- `design-calibration/01_arch_step_02_goals_constraints.md` §7.4 不可变约束表。
- `design-calibration/01_arch_step_02_goals_constraints.md` §7.5 当前阶段可接受取舍表。
- `design-calibration/01_arch_step_02_goals_constraints.md` §7.6 架构非目标表。
```

---

## 9. 待确认事项

| 编号 | 待确认事项 | 当前状态 |
|---|---|---|
| Q-001 | Step 10 是否采用 Rust / Python / 其他技术栈 | 后续关键技术选型再收敛 |
| Q-002 | 旧性能候选数字是否转为测试目标 | 后续测试方案和容量验证再收敛 |
| Q-003 | 完整 BPMN / 嵌套过程 / 模板刚度进入哪个演进阶段 | 后续演进路线和详细设计范围再收敛 |

---

## 10. 进入下一步条件

- 已明确架构必须确保什么结构成立。
- 已明确不可变约束、可接受取舍和架构非目标。
- 未把技术选型、容器、协议、字段、状态机或数据库写入本步。
- 当前没有阻塞 Step 3 的架构目标或约束缺口。

结论:可以进入 Step 3 `职责边界`。
