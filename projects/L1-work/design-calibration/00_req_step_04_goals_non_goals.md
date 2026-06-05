# Step 4. 目标与非目标

> 对应 SOP: `standards/document/需求文档讨论流程_SOP.md` Step 4
> 回填章节: `00-需求文档.md` §4 目标与非目标
> 生成日期: 2026-06-02

---

## 1. 本步目标

从 Step 2 的边界和 Step 3 的问题主线中收束 `L1-work` 本次需求要达成的状态、边界和能力范围，并明确哪些相关事项不纳入当前仓或当前需求范围。本步不写核心能力闭环、用户故事、功能需求、业务规则、接口、数据归属、事务、表结构、结构体或代码目录。

---

## 2. 本步输入

| 输入 | 当前状态 | 本步使用方式 |
|---|---|---|
| `design-calibration/00_req_step_02_position_boundary.md` | Step 2 已完成 | 固定 `L1-work` 是项目工作事实真相仓，非 identity / conversation / method-library / process / governance / artifact / runtime / workspace |
| `design-calibration/00_req_step_03_problem_context.md` | Step 3 已完成 | 固定问题主线：项目工作事实未统一、正式工作项与执行步骤混淆、相邻仓边界影响 Work 真相 |
| `projects/L1-work/00-需求文档.md` §3 | 旧版目标与非目标 | 提取 Project 生命周期、双层 Member、WorkItem DAG、Backlog / Iteration、done 判据等目标线索 |
| `projects/L1-work/02-概要设计.md` §3 | 旧版概要目标与非目标 | 提取工作事实层、planning 边界、ImplementationPlan 边界和 promote 原则 |
| ADR-0004 / ADR-0008 / ADR-0009 | 已接受 ADR | 固定双层 Member、WorkItem / Activity 独立状态机、ViewProfile 归属 method-library 的目标边界 |

---

## 3. SOP 问题回答

### 3.1 本次需求结束后，应成立哪些状态、边界或能力？

本次需求结束后，应成立以下目标：

| 目标 | 说明 | 验证方式 |
|---|---|---|
| 建立项目工作事实主题的需求边界 | 明确 `L1-work` 承载的是 Project、ProjectMember、Backlog、WorkItem、child WorkItem、Iteration 和 promote 边界，不是泛项目管理或前台看板 | 后续章节不再把身份真相、对话真相、方法定义、流程执行、治理决策、产物正文、运行时执行或 workspace 视图写入 Work 范围 |
| 收束 ProjectMember 的项目内承担边界 | 明确 ProjectMember 是 GlobalMember 在项目内的承担事实，不能反向覆盖 GlobalMember 生命周期和角色定义 | 用户与角色、功能需求、数据归属和接口依赖章节均能区分 GlobalMember 与 ProjectMember |
| 收束正式工作项与执行步骤的边界 | 明确 Backlog、WorkItem 和 child WorkItem 是团队协作级正式工作事实，ImplementationPlan / plan item / conversation suggestion / runtime step 不默认进入 Backlog | 后续用户故事、功能需求和验收方向中不把个人步骤或对话建议直接写成正式 WorkItem |
| 收束 Iteration 与 planning timing 的边界 | 明确 Iteration 是从 Backlog 选择出的承诺子集，process planning 只提供时机或节奏，不拥有 Backlog 真相 | 后续章节不把 Sprint Planning 写成创建 Backlog 真相或 Process Activity 真相 |
| 收束 ImplementationPlan promote 边界 | 明确本仓只处理计划项进入协作、依赖、排期、验收或风险视野后的升级边界，不拥有执行计划正文或 runtime 推进 | 后续功能、规则和测试能围绕 promote 边界展开，而不把 Work 写成执行计划仓 |

### 3.2 这些目标如何被验证？

这些目标的验证方式不是立即写测试用例或接口，而是在后续需求章节中持续检查：

- Step 5 用户与角色不把相邻仓使用方误写成本仓角色。
- Step 6 使用方与依赖能从全局依赖关系中裁剪出 Work 自己的部分。
- Step 7 核心能力闭环围绕项目工作事实，而不是流程、治理、产物或 runtime。
- Step 9 功能需求不出现身份、对话、方法定义、流程、治理、产物正文、运行时执行和 workspace 聚合视图的越界能力。
- Step 10 / Step 11 / Step 12 能分别守住规则、数据归属和接口边界。

### 3.3 哪些事项虽然相关，但明确不纳入当前范围？

| 非目标 | 不做原因 |
|---|---|
| GlobalMember 管理 | 平台级成员身份、生命周期和角色真相属于 `L1-identity`，Work 只处理 ProjectMember 项目内承担事实 |
| conversation truth / Chat UI | 对话空间、参与范围、对话事实、trace / handoff 正文和聊天呈现属于 `L1-conversation` 或上层产品入口 |
| method definition / ViewProfile | RoleDefinition、TaskDefinition、WorkProductDefinition、ProcessTemplateDef 和 ViewProfile 属于 `L3-method-library` |
| process execution / Activity state | Activity、ProcessInstance、checkpoint 和流程节奏执行属于 `L1-process`，Work 只保留项目工作事实边界 |
| governance decision truth | Gate、Policy、Control、Approval 的决策真相属于 `L1-governance` |
| artifact / evidence / baseline 正文 | 产物、证据、基线和 ImplementationPlan 正文属于 `L1-artifact` 或相邻仓，Work 只在后续步骤讨论引用边界 |
| runtime execution | agent loop、工具调用、执行步骤、plan item progress 属于 `L2-runtime` |
| workspace 聚合视图 | PersonalWorkspace、ProjectWorkspace、board 聚合视图属于 `L1-workspace` 或上层消费方 |
| 当前性能 / 容量指标定稿 | `CreateWorkItem P95`、`GetProjectBoard P95`、`10w 项目 x 50 WorkItem` 等后移到非功能需求阶段判断 |

### 3.4 哪些事情必须交给相邻仓或后续阶段处理？

必须交给相邻仓的事项：

- 成员身份真相交给 `L1-identity`。
- 对话事实、trace / handoff 正文交给 `L1-conversation`。
- 方法定义、视图策略交给 `L3-method-library`。
- 流程执行和 Activity 状态交给 `L1-process`。
- Gate / Policy / Approval 决策交给 `L1-governance`。
- 产物、证据、基线和 ImplementationPlan 正文交给 `L1-artifact` 或后续 artifact/runtime 设计。
- 执行推进交给 `L2-runtime`。
- 聚合工作台视图交给 `L1-workspace`。

必须后续阶段处理的事项：

- 功能需求清单后移 Step 9。
- WorkItem / child WorkItem 的规则后移 Step 10。
- 数据归属后移 Step 11。
- 接口与依赖后移 Step 12。
- 性能、容量、可用性等非功能指标后移 Step 13。
- 验收标准后移 Step 14。

---

## 4. 当前文档问题诊断

| 位置 | 当前表现 | 问题 | 处理口径 |
|---|---|---|---|
| `00-需求文档.md` §3.1 | 目标写 Project 生命周期、双层 Member、WorkItem DAG、Backlog / Iteration、done 判据、性能 | 部分目标有效，但混入状态机、规则、验收和非功能指标 | Step 4 只保留状态 / 边界 / 能力范围，细节后移 |
| `00-需求文档.md` §3.2 | 非目标列 GlobalMember、过程引擎、Gate 决策、Artifact 正文、对话推送 | 方向正确，但缺少 method-library、conversation truth、runtime execution、workspace 视图等最新边界 | 正式 §4 补齐相邻仓非目标 |
| `02-概要设计.md` §3 | 目标集中在工作事实层、planning、执行计划、promote | 更贴近当前主线，但部分写成概要设计目标 | 转译为需求层可验证边界 |
| 旧文档整体 | 把“状态机测试”“E2E”“benchmark”等写入目标表 | 验证方式有价值，但部分粒度过细 | Step 4 只写需求章节验证方式，具体测试后移 |

---

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 目标数量 | 7 个目标，含状态机、DAG、done 判据、性能 | 5 个目标，按边界和能力范围收束 | 避免 Step 4 写成规则、验收或非功能 |
| 目标主轴 | Project lifecycle / DAG / performance | 项目工作事实、ProjectMember、正式工作项、Iteration、promote 边界 | 对齐 Step 2 和 Step 3 的项目工作事实主线 |
| 非目标范围 | identity / process / governance / artifact / conversation | 补齐 identity、conversation、method-library、process、governance、artifact、runtime、workspace、非功能指标 | 对齐已完成上游和当前相邻仓边界 |
| 验证方式 | 状态机测试、E2E、benchmark | 后续章节不越界、目标能映射到后续需求与验收 | Step 4 不直接定义测试方案 |

---

## 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A: 保留旧 G-1~G-7 目标表 | 内容完整，接近实现验收 | 混入状态机、规则、性能和测试方式，不符合 Step 4 粒度 | 不采用 |
| 方案 B: 按项目工作事实边界重写目标 | 对齐 Step 2 / Step 3，可防止后续串线 | 需要在后续 Step 9~14 再展开功能、规则和验收 | 采用 |
| 方案 C: 只写一个总目标“统一项目工作事实” | 简洁 | 不足以约束 ProjectMember、Iteration、ImplementationPlan 等关键边界 | 不采用 |
| 方案 D: 把 ImplementationPlan promote 放到后续详细设计再说 | Step 4 更轻 | 当前最容易混淆的边界缺少目标约束，后续仍可能串线 | 不采用 |

### 6.1 待确认问题的方案选择

#### 是否把 done 判据写入 Step 4 目标？

| 方案 | 内容 | 影响 |
|---|---|---|
| 方案 A | 写成目标：“done 必有 approved Artifact” | 太具体，属于规则和验收方向 |
| 方案 B | 在 Step 4 只保留“正式工作项边界”，done 判据后移 Step 10 / Step 14 | 目标层更干净，后续规则可展开 |

推荐方案 B。原因是 done 判据会涉及 artifact evidence、规则和验收，不适合在目标层定死具体规则。

#### 是否把性能目标写入 Step 4？

| 方案 | 内容 | 影响 |
|---|---|---|
| 方案 A | 保留 CreateWorkItem / GetProjectBoard P95 | 提前给出可测指标，但来源不稳且属于非功能 |
| 方案 B | 后移 Step 13 非功能需求 | 避免伪量化，保留后续评估空间 |

推荐方案 B。原因是 Step 3 已确认旧性能数字不作为当前问题量化，Step 4 也不应提前写非功能指标。

#### 是否把 `ImplementationPlan` promote 放入目标？

| 方案 | 内容 | 影响 |
|---|---|---|
| 方案 A | 不写，避免复杂 | 可能导致后续继续把 plan item 和 child WorkItem 混写 |
| 方案 B | 写“收束 ImplementationPlan promote 边界”，不写正文归属和执行推进 | 能守住边界，又不越界到 artifact / runtime |

推荐方案 B。原因是 promote 边界已经是 Step 2 / Step 3 共同确认的核心风险。

---

## 7. 结构化中间产物

### 7.1 目标结论

| 目标 | 说明 | 验证方式 |
|---|---|---|
| 建立项目工作事实主题的需求边界 | 明确 Work 承载正式项目工作事实，不承载泛项目管理或前台看板 | 后续章节不把相邻仓真相写入 Work |
| 收束 ProjectMember 项目内承担边界 | 明确 ProjectMember 与 GlobalMember 的关系 | 后续章节能稳定区分 identity 与 work |
| 收束正式工作项与执行步骤边界 | 明确 WorkItem / child WorkItem 与 plan item / conversation suggestion / runtime step 的区别 | 后续章节不把个人步骤直接写成正式任务 |
| 收束 Iteration 与 planning timing 边界 | 明确 Iteration 是承诺子集，planning timing 不拥有 Backlog 真相 | 后续章节不把 process planning 写成 Work 真相 |
| 收束 ImplementationPlan promote 边界 | 明确 Work 只处理升级边界，不拥有执行计划正文或执行推进 | 后续章节围绕 promote 边界展开，不把 Work 写成执行计划仓 |

### 7.2 非目标结论

| 非目标 | 不做原因 |
|---|---|
| GlobalMember 管理 | 属于 `L1-identity` |
| conversation truth / Chat UI | 属于 `L1-conversation` 或上层产品入口 |
| method definition / ViewProfile | 属于 `L3-method-library` |
| process execution / Activity state | 属于 `L1-process` |
| governance decision truth | 属于 `L1-governance` |
| artifact / evidence / baseline / ImplementationPlan 正文 | 属于 `L1-artifact` 或后续 artifact/runtime 边界 |
| runtime execution | 属于 `L2-runtime` |
| workspace 聚合视图 | 属于 `L1-workspace` |
| 当前性能 / 容量指标定稿 | 后移 Step 13 非功能需求 |

### 7.3 范围收束结论

本次需求的范围是项目工作事实主题的需求收束，而不是完整项目管理产品、流程引擎、执行系统或看板 UI。后续章节必须围绕项目事实、项目内成员承担、正式工作项、迭代承诺子集和 promote 边界展开。

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
| 建立项目工作事实主题的需求边界 | 明确 Work 承载正式项目工作事实，不承载泛项目管理或前台看板 | 后续章节不把相邻仓真相写入 Work |
| 收束 ProjectMember 项目内承担边界 | 明确 ProjectMember 与 GlobalMember 的关系 | 后续章节能稳定区分 identity 与 work |
| 收束正式工作项与执行步骤边界 | 明确 WorkItem / child WorkItem 与 plan item / conversation suggestion / runtime step 的区别 | 后续章节不把个人步骤直接写成正式任务 |
| 收束 Iteration 与 planning timing 边界 | 明确 Iteration 是承诺子集，planning timing 不拥有 Backlog 真相 | 后续章节不把 process planning 写成 Work 真相 |
| 收束 ImplementationPlan promote 边界 | 明确 Work 只处理升级边界，不拥有执行计划正文或执行推进 | 后续章节围绕 promote 边界展开，不把 Work 写成执行计划仓 |

### 4.2 非目标

| 非目标 | 不做原因 |
|---|---|
| GlobalMember 管理 | 属于 `L1-identity`，Work 只处理 ProjectMember 项目内承担事实 |
| conversation truth / Chat UI | 属于 `L1-conversation` 或上层产品入口 |
| method definition / ViewProfile | 属于 `L3-method-library` |
| process execution / Activity state | 属于 `L1-process` |
| governance decision truth | 属于 `L1-governance` |
| artifact / evidence / baseline / ImplementationPlan 正文 | 属于 `L1-artifact` 或后续 artifact/runtime 边界 |
| runtime execution | 属于 `L2-runtime` |
| workspace 聚合视图 | 属于 `L1-workspace` |
| 当前性能 / 容量指标定稿 | 后移到非功能需求阶段评估，不在目标层定死 |
```

---

## 9. 待确认事项

| 编号 | 待确认事项 | 方案 A | 方案 B | 推荐 |
|---|---|---|---|---|
| Q-001 | 是否保留旧 G-1~G-7 目标表 | 原样保留 | 按项目工作事实边界重写 | 推荐 B。原因是旧目标混入状态机、规则、测试和非功能指标 |
| Q-002 | 是否把 done 判据作为目标 | 写成目标 | 后移 Step 10 / Step 14 | 推荐 B。原因是它属于规则和验收方向 |
| Q-003 | 是否把 ImplementationPlan promote 纳入目标 | 不纳入 | 纳入边界目标但不写执行计划正文 | 推荐 B。原因是它是当前最重要的串线风险之一 |

当前建议：接受上述推荐后进入 Step 5。

---

## 10. 进入下一步条件

- 每个目标都可通过后续章节是否越界、是否可映射到功能 / 规则 / 验收来验证。
- 每个非目标都具体指向相邻仓或后续阶段。
- 未把功能、接口、业务规则、实现路径或空洞口号写进目标。
- 已明确性能、容量、done 判据和具体状态机细节后移到后续 Step。
