# Step 4. 目标与非目标

> 对应 SOP: `standards/document/需求文档讨论流程_SOP.md` Step 4
> 回填章节: `00-需求文档.md` §4 目标与非目标
> 生成日期: 2026-06-05

---

## 1. 本步目标

从 Step 2 的边界和 Step 3 的问题主线中收束 `L1-process` 本次需求要达成的状态、边界和能力范围,并明确哪些相关事项不纳入当前仓或当前需求范围。本步不写核心能力闭环、用户故事、功能需求、业务规则、接口、数据归属、事务、表结构、结构体或代码目录。

---

## 2. 本步输入

| 输入 | 当前状态 | 本步使用方式 |
|---|---|---|
| `design-calibration/00_req_step_02_position_boundary.md` | Step 2 已完成 | 固定 `L1-process` 是过程执行真相仓,非 method-library / work / governance / artifact / runtime / workspace |
| `design-calibration/00_req_step_03_problem_context.md` | Step 3 已完成 | 固定问题主线:过程执行事实未统一、定义 / 工作 / 运行事实混淆、挂起恢复链路未抽象 |
| `projects/L1-process/00-需求文档.md` §3 / §6 / §7 | 旧版目标、功能和非功能 | 提取三段式、checkpoint、waiting_gate、recovery、WorkItem 交汇和非目标线索 |
| `projects/L1-process/01-架构设计.md` ~ `03-详细设计.md` | 旧版下游文档 | 提取 Template / Profile / Instance、Activity / Token、checkpoint / recovery、相邻仓边界线索,但不继承结构体和实现路径 |
| ADR-0007 / ADR-0008 | Accepted ADR | 固定 Instance checkpoint 归属和 Activity / WorkItem 独立状态机边界 |
| `projects/L3-method-library` 正式文档 | 已完成深度校准 | 固定 ProcessTemplateDef / TaskDefinition 定义真相属于 method-library |
| `projects/L1-work` 正式文档 | 已完成深度校准 | 固定 WorkItem / Iteration truth 不归 process |

---

## 3. SOP 问题回答

### 3.1 本次需求结束后,应成立哪些状态、边界或能力？

本次需求结束后,应成立以下目标:

| 目标 | 说明 | 验证方式 |
|---|---|---|
| 建立过程执行事实主题的需求边界 | 明确 `L1-process` 承载的是过程推进事实,不是方法定义、项目工作事实、治理决策、产物正文或 runtime 执行正文 | 后续章节不再把 method-library、work、governance、artifact、runtime、workspace 等相邻仓真相写入 Process 范围 |
| 收束过程定义运行时索引与 Profile 边界 | 明确 process 只消费 method-library 的过程 / 任务定义并维护运行时索引,同时表达项目上下文中的裁剪后过程形态 | 后续章节能稳定区分 ProcessTemplateDef / TaskDefinition 定义真相、process runtime index 和 ProcessProfile |
| 收束 ProcessInstance / Activity / Token 运行事实边界 | 明确实例、过程节点和流控是 process 的运行事实,不等同 Project lifecycle、WorkItem、Iteration、runtime plan step 或 workspace projection | 后续用户故事、功能需求和数据归属不把 Activity 写成 WorkItem 或 runtime 执行步骤 |
| 收束 waiting gate / checkpoint / recovery 边界 | 明确 process 拥有等待治理决策的过程意图、Instance 级 checkpoint 和恢复事实,不拥有 Gate 决策、runtime 微步 checkpoint 或 reasoning trace 正文 | 后续章节能稳定表达“为什么停、从哪里恢复、恢复依据来自哪里、哪些正文不得进入 process” |
| 收束相邻仓协作边界 | 明确 process 与 work、governance、artifact、runtime、conversation、workspace、observability、archive 的关系是引用、事件、查询或投影协作,不转移来源真相 | 后续依赖、接口、规则和验收章节都能验证 process 不反写或接管相邻仓 truth |

### 3.2 这些目标如何被验证？

这些目标的验证方式不是立即写测试用例或接口,而是在后续需求章节中持续检查:

- Step 5 用户与角色不把相邻仓使用方误写成本仓拥有角色。
- Step 6 使用方与依赖能从全局依赖关系中裁剪出 Process 自己的部分。
- Step 7 核心能力闭环围绕过程执行事实,不是方法定义、工作事实、治理决策或 runtime 执行。
- Step 9 功能需求不出现 method definition 管理、Backlog / WorkItem 维护、Gate decision、artifact body 持久化、runtime loop 执行或 workspace 视图改写能力。
- Step 10 / Step 11 / Step 12 能分别守住规则、数据归属和接口边界。
- Step 13 再判断旧 P95、容量、恢复时间和 checkpoint 延迟是否成为非功能指标。

### 3.3 哪些事项虽然相关,但明确不纳入当前范围？

| 非目标 | 不做原因 |
|---|---|
| Method Content / ProcessTemplateDef / TaskDefinition 定义管理 | 属于 `L3-method-library`;process 只消费定义 snapshot / event 并维护运行时索引 |
| Backlog / WorkItem / child WorkItem / Iteration truth | 属于 `L1-work`;process 只表达 Activity、timebox、instance 和过程节奏引用 |
| Gate / Policy / Approval / decision truth | 属于 `L1-governance`;process 只表达 waiting gate 意图、gate ref 和恢复输入 |
| Artifact / Evidence / Baseline 正文 | 属于 `L1-artifact`;process 只表达 Activity output ref、artifact ref 或 checkpoint ref |
| Runtime execution / tool loop / runtime 微步 checkpoint | 属于 `L2-runtime` 或 `L2-member-service`;process 只表达 Activity 执行意图、反馈和 Instance 级 checkpoint |
| GlobalMember / actor lifecycle / role definition | 成员生命周期属于 `L1-identity`,角色定义属于 `L3-method-library`;process 只引用 actor / role ref |
| conversation truth / Chat UI | 对话空间、参与范围、对话事实、trace / handoff 正文和聊天呈现属于 `L1-conversation` 或上层产品入口 |
| workspace progress view / project dashboard | 聚合工作台视图属于 `L1-workspace` 或上层消费方;process 可提供只读过程事实或 projection 输入 |
| reasoning trace 正文、指标存储、归档包正文 | 属于 `L4-observability` / `L4-archive`;process 只保存恢复所需引用 |
| 当前性能 / 容量指标定稿 | `10w 活跃 Instance / 5000w Activity/年`、P95、checkpoint 延迟和恢复时间后移 Step 13 非功能需求 |
| ADR-0010 / ADR-0011 完整落地 | 当前状态为 Proposed;刚度分层和流程嵌套可作为候选线索,后续 Step 15 和设计阶段继续确认 |

### 3.4 哪些事情必须交给相邻仓或后续阶段处理？

必须交给相邻仓的事项:

- 方法定义、模板正文、任务定义和 ViewProfile 交给 `L3-method-library`。
- 项目、项目成员、Backlog、WorkItem、child WorkItem、Iteration 和承诺子集交给 `L1-work`。
- Gate、Policy、Approval 和 decision 交给 `L1-governance`。
- Artifact、Evidence、Baseline 和归档包正文交给 `L1-artifact` / `L4-archive`。
- runtime 内部执行、工具调用、LLM loop、runtime 微步 checkpoint 和容器编排交给 `L2-runtime` / `L2-member-service`。
- 对话事实和可见性交给 `L1-conversation`。
- 聚合工作台视图交给 `L1-workspace`。
- reasoning trace、指标、日志和审计横切存储交给 `L4-observability`。

必须后续阶段处理的事项:

- 核心能力闭环后移 Step 7。
- 用户故事后移 Step 8。
- 功能需求清单后移 Step 9。
- 业务规则和状态约束后移 Step 10。
- 数据归属后移 Step 11。
- 接口与依赖后移 Step 12。
- 性能、容量、可用性、恢复时间等非功能指标后移 Step 13。
- 验收标准后移 Step 14。

---

## 4. 当前文档问题诊断

| 位置 | 当前表现 | 问题 | 处理口径 |
|---|---|---|---|
| `00-需求文档.md` §3.1 | 目标写 Template / Profile / Instance 三聚合、两种模板、checkpoint、waiting_gate、P95、恢复时间 | 部分目标有效,但混入功能、测试、非功能指标和实现验收 | Step 4 只保留状态 / 边界 / 能力范围,细节后移 |
| `00-需求文档.md` §3.2 | 非目标列 Method Content、Gate 决策、WorkItem、Artifact、容器执行 | 方向正确,但缺少 conversation、workspace、observability / archive、runtime 微步 checkpoint、ADR-0010 / 0011 状态口径 | 正式 §4 补齐相邻仓非目标和后续阶段口径 |
| `00-需求文档.md` §6 | 功能清单 F-001~F-013 直接写 ProcessTemplate 索引、Profile、Instance、Activity、Gateway、Checkpoint 等 | 这些是后续功能需求候选,不应反向进入目标表 | 后移 Step 9 按核心闭环裁剪 |
| `00-需求文档.md` §7 | 非功能指标直接写 P95、恢复时间、checkpoint 覆盖率 | 这些是 Step 13 非功能候选 | Step 4 只标记“当前性能 / 容量指标不定稿” |
| `01-架构设计.md` / `03-详细设计.md` | 已有结构体、component、repository、函数和具体流程 | 对后续设计有参考价值,但目标层不能写实现路径 | 只抽取边界目标,不继承实现结构 |

---

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 目标数量 | 6 个旧目标,含功能、性能和测试指标 | 5 个目标,按过程执行事实、运行时索引 / Profile、实例运行、挂起恢复、相邻仓协作边界收束 | 避免 Step 4 写成规则、功能、验收或非功能 |
| 目标主轴 | Template / Profile / Instance 三聚合、checkpoint、waiting_gate、P95 | 过程执行事实边界和相邻 truth 防串线 | 对齐 Step 2 / Step 3 的问题主线 |
| 非目标范围 | method content、Gate、WorkItem、Artifact、容器执行 | 补齐 method-library、work、governance、artifact、runtime、member-service、identity、conversation、workspace、observability、archive、Proposed ADR | 对齐已完成上游和当前相邻仓边界 |
| 验证方式 | 单元、集成、E2E、benchmark | 后续章节是否越界、是否能映射到功能 / 规则 / 验收 | Step 4 不直接定义测试方案 |

---

## 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A: 保留旧 G-1~G-6 目标表 | 内容完整,接近实现验收 | 混入功能、性能、测试和具体场景,不符合 Step 4 粒度 | 不采用 |
| 方案 B: 按过程执行事实边界重写目标 | 对齐 Step 2 / Step 3,可防止后续串线 | 需要在后续 Step 7~14 再展开闭环、功能、规则和验收 | 采用 |
| 方案 C: 只写一个总目标“统一过程执行事实” | 简洁 | 不足以约束 runtime index、Profile、Instance、waiting gate / checkpoint 等关键边界 | 不采用 |
| 方案 D: 把 BPMN / 29110 / Temporal 作为目标主轴 | 能保留旧标准对齐 | 会把标准和实现倾向提前写成目标,并可能压过边界问题 | 不采用 |

### 6.1 待确认问题的方案选择

#### 是否把 P95 / 恢复时间写入 Step 4 目标？

| 方案 | 内容 | 影响 |
|---|---|---|
| 方案 A | 写成目标:“CompleteActivity P95 < 200ms / 小 Instance 恢复 < 30s” | 看起来可验证,但属于非功能指标且来源未重新校准 |
| 方案 B | 后移 Step 13 非功能需求 | 避免伪量化,保留后续评估空间 |

推荐方案 B。原因是 Step 3 已确认旧性能数字不作为当前问题量化,Step 4 也不应提前写非功能指标。

#### 是否把 Template / Profile / Instance 三段式直接写成目标？

| 方案 | 内容 | 影响 |
|---|---|---|
| 方案 A | 写成目标:“Template / Profile / Instance 三段式落地” | 简短,但可能把旧 ProcessTemplate 定义真相带回 process |
| 方案 B | 写“过程定义运行时索引与 Profile 边界”和“ProcessInstance / Activity / Token 运行事实边界” | 能保留三段式主线,同时防止覆盖 method-library 定义真相 |

推荐方案 B。原因是 Step 2 已收稳 ProcessTemplate runtime index / execution copy 口径。

#### 是否把 ADR-0010 / ADR-0011 纳入目标？

| 方案 | 内容 | 影响 |
|---|---|---|
| 方案 A | 直接写 Template 刚度和流程嵌套目标 | 会把 Proposed ADR 当 Accepted 真相 |
| 方案 B | 列为非目标 / 后续确认项,在风险与待确认事项处理 | 保留线索,不把未定 ADR 硬化 |

推荐方案 B。原因是两个 ADR 当前仍为 Proposed。

---

## 7. 结构化中间产物

### 7.1 目标结论

| 目标 | 说明 | 验证方式 |
|---|---|---|
| 建立过程执行事实主题的需求边界 | 明确 Process 承载过程推进事实,不承载方法定义、工作事实、治理决策、产物正文或 runtime 执行正文 | 后续章节不把相邻仓真相写入 Process |
| 收束过程定义运行时索引与 Profile 边界 | 明确 process 消费 method-library 定义并维护运行时索引和裁剪后过程形态 | 后续章节能区分定义真相、运行时索引和 Profile |
| 收束 ProcessInstance / Activity / Token 运行事实边界 | 明确实例、过程节点和流控是 process 运行事实 | 后续章节不把 Activity 写成 WorkItem 或 runtime 执行步骤 |
| 收束 waiting gate / checkpoint / recovery 边界 | 明确等待意图、Instance checkpoint 和恢复事实归 process,但决策、微步和 trace 正文不归 process | 后续章节能稳定表达停住、恢复、依据和正文边界 |
| 收束相邻仓协作边界 | 明确 process 与相邻仓是引用、事件、查询或投影协作,不转移来源 truth | 后续依赖、接口、规则和验收章节可验证不反写相邻仓 truth |

### 7.2 非目标结论

| 非目标 | 不做原因 |
|---|---|
| Method Content / ProcessTemplateDef / TaskDefinition 定义管理 | 属于 `L3-method-library` |
| Backlog / WorkItem / child WorkItem / Iteration truth | 属于 `L1-work` |
| Gate / Policy / Approval / decision truth | 属于 `L1-governance` |
| Artifact / Evidence / Baseline 正文 | 属于 `L1-artifact` |
| Runtime execution / tool loop / runtime 微步 checkpoint | 属于 `L2-runtime` 或 `L2-member-service` |
| GlobalMember / actor lifecycle / role definition | 属于 `L1-identity` 和 `L3-method-library` |
| conversation truth / Chat UI | 属于 `L1-conversation` 或上层产品入口 |
| workspace progress view / project dashboard | 属于 `L1-workspace` 或上层消费方 |
| reasoning trace 正文、指标存储、归档包正文 | 属于 `L4-observability` / `L4-archive` |
| 当前性能 / 容量指标定稿 | 后移 Step 13 非功能需求 |
| ADR-0010 / ADR-0011 完整落地 | 仍为 Proposed ADR,后续确认 |

### 7.3 范围收束结论

本次需求的范围是过程执行事实主题的需求收束,而不是完整 BPMN 产品、方法定义系统、项目管理系统、治理审批系统、产物系统、runtime 调度系统或工作台 UI。后续章节必须围绕 runtime index / Profile、ProcessInstance、Activity / Token、waiting gate / checkpoint / recovery 和相邻仓协作边界展开。

---

## 8. 回填草稿

以下内容供 Step 17 重建正式 `00-需求文档.md` 时回填到 §4。

```md
## 4. 目标与非目标

> 校准来源：
> - `design-calibration/00_req_step_04_goals_non_goals.md`
>
> 延伸阅读：
> - 建议继续阅读上述中间产物的“SOP 问题回答”“设计取舍”和“结构化中间产物”小节，了解本章如何从旧目标表收敛为当前需求边界。

### 4.1 目标

| 目标 | 说明 | 验证方式 |
|---|---|---|
| 建立过程执行事实主题的需求边界 | 明确 Process 承载过程推进事实，不承载方法定义、工作事实、治理决策、产物正文或 runtime 执行正文 | 后续章节不把相邻仓真相写入 Process |
| 收束过程定义运行时索引与 Profile 边界 | 明确 process 消费 method-library 定义并维护运行时索引和裁剪后过程形态 | 后续章节能区分定义真相、运行时索引和 Profile |
| 收束 ProcessInstance / Activity / Token 运行事实边界 | 明确实例、过程节点和流控是 process 运行事实 | 后续章节不把 Activity 写成 WorkItem 或 runtime 执行步骤 |
| 收束 waiting gate / checkpoint / recovery 边界 | 明确等待意图、Instance checkpoint 和恢复事实归 process，但决策、微步和 trace 正文不归 process | 后续章节能稳定表达停住、恢复、依据和正文边界 |
| 收束相邻仓协作边界 | 明确 process 与相邻仓是引用、事件、查询或投影协作，不转移来源 truth | 后续依赖、接口、规则和验收章节可验证不反写相邻仓 truth |

### 4.2 非目标

| 非目标 | 不做原因 |
|---|---|
| Method Content / ProcessTemplateDef / TaskDefinition 定义管理 | 属于 `L3-method-library` |
| Backlog / WorkItem / child WorkItem / Iteration truth | 属于 `L1-work` |
| Gate / Policy / Approval / decision truth | 属于 `L1-governance` |
| Artifact / Evidence / Baseline 正文 | 属于 `L1-artifact` |
| Runtime execution / tool loop / runtime 微步 checkpoint | 属于 `L2-runtime` 或 `L2-member-service` |
| GlobalMember / actor lifecycle / role definition | 属于 `L1-identity` 和 `L3-method-library` |
| conversation truth / Chat UI | 属于 `L1-conversation` 或上层产品入口 |
| workspace progress view / project dashboard | 属于 `L1-workspace` 或上层消费方 |
| reasoning trace 正文、指标存储、归档包正文 | 属于 `L4-observability` / `L4-archive` |
| 当前性能 / 容量指标定稿 | 后移到非功能需求阶段评估，不在目标层定死 |
| ADR-0010 / ADR-0011 完整落地 | 当前仍为 Proposed ADR，保留为后续确认事项，不在目标层硬化 |
```

---

## 9. 待确认事项

| 编号 | 待确认事项 | 方案 A | 方案 B | 推荐 |
|---|---|---|---|---|
| Q-001 | 是否保留旧 G-1~G-6 目标表 | 原样保留 | 按过程执行事实边界重写 | 推荐 B。原因是旧目标混入功能、测试和非功能指标 |
| Q-002 | 是否把 P95 / 容量 / 恢复时间作为目标 | 写入目标 | 后移 Step 13 | 推荐 B。原因是它们属于非功能候选 |
| Q-003 | 是否把 ADR-0010 / ADR-0011 纳入目标 | 直接纳入 | 作为 Proposed 后续确认项 | 推荐 B。原因是 ADR 状态未 Accepted |

当前建议:接受上述推荐后进入 Step 5。

---

## 10. 进入下一步条件

- 每个目标都可通过后续章节是否越界、是否可映射到功能 / 规则 / 验收来验证。
- 每个非目标都具体指向相邻仓或后续阶段。
- 未把功能、接口、业务规则、实现路径或空洞口号写进目标。
- 已明确性能、容量、恢复时间、具体状态机细节和 Proposed ADR 后移到后续 Step。
