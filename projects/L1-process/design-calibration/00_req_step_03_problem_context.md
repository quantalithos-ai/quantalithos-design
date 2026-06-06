# Step 3. 背景与问题定义

> 对应 SOP: `standards/document/需求文档讨论流程_SOP.md` Step 3
> 回填章节: `00-需求文档.md` §3 背景与问题定义
> 生成日期: 2026-06-05

---

## 1. 本步目标

说明为什么 `L1-process` 值得在当前阶段单独校准:Quantalithos 需要一处统一的过程执行事实来源,否则过程进展、Activity 状态、等待治理决策、checkpoint 恢复和相邻仓协作会形成多真相。本步只写背景与问题,不写目标、功能、规则、接口、数据归属或实现方案。

---

## 2. 本步输入

| 输入 | 当前状态 | 本步使用方式 |
|---|---|---|
| `design-calibration/00_req_step_01_upstream_relation.md` | Step 1 已完成 | 固定上游来源,避免把相邻仓重新定义成问题来源 |
| `design-calibration/00_req_step_02_position_boundary.md` | Step 2 已完成 | 固定 `L1-process` 是过程执行真相仓 |
| `projects/L1-process/00-需求文档.md` §2 | 旧版背景与问题 | 提取“按过程模板推进、关键节点停下来、从 checkpoint 恢复”等背景线索 |
| `projects/L1-process/01-架构设计.md` ~ `06-验收标准.md` | 旧版下游文档 | 提取 process 与 method-library / work / governance / artifact / runtime 接缝混写的风险线索 |
| `domain/process/README.md` | 旧过程域详细设计 | 提取三段式、Activity、Token / Gateway、checkpoint、waiting_gate 和历史开放问题线索 |
| `product/最终目的.md` | 产品叙事上游 | 固定关键节点强制人类、过程始终可观察、工作对象是软件项目的产品背景 |
| `product/六域模型.md` | 领域模型上游 | 固定 Process 回答“按什么规矩推进”的领域背景 |
| `projects/L3-method-library/00-需求文档.md` ~ `07-实施计划.md` | 已完成深度校准 | 作为 definition truth 与 process runtime index 混淆风险输入 |
| `projects/L1-work/00-需求文档.md` ~ `07-实施计划.md` | 已完成深度校准 | 作为 WorkItem / Iteration truth 与 Activity / timebox 混淆风险输入 |
| ADR-0007 / ADR-0008 | Accepted ADR | 作为 checkpoint 归属、Activity / WorkItem 独立状态机问题已被识别的背景输入 |

---

## 3. SOP 问题回答

### 3.1 当前业务背景是什么？

Quantalithos 的产品叙事要求软件项目不是一次性对话或孤立任务,而是按规则推进、关键节点可停、失败后可恢复、全过程可观察的长期协作对象。随着 core、bus、sdk、identity、conversation、work 和 method-library 已经收稳,平台需要继续把“按什么规矩推进”收束成独立的 process 需求基线,让相邻仓围绕同一套过程执行事实协作。

### 3.2 当前的主要痛点或机会点是什么？

主要痛点不是“缺少某个 BPMN 引擎实现”,而是过程执行事实容易散落在多个相邻概念中:

- method-library 拥有过程和任务定义真相,process 需要运行时索引;若需求层不分清,Template 定义和执行副本会形成双真相。
- work 拥有 Project / WorkItem / Iteration 真相,process 拥有 Activity / timebox / instance 推进事实;若不分清,Activity 会被误当 WorkItem,process timing 会被误当 Iteration。
- governance、artifact、runtime、observability 分别拥有决策、产物、执行正文和观测正文;若不分清,waiting_gate、checkpoint、runtime feedback 和 reasoning trace 会混成一条不可恢复、不可审计的链。

### 3.3 这些问题能否量化？

当前不能可靠量化为运行时指标。旧文档中的 `10w 活跃 Instance / 5000w Activity/年`、`CompleteActivity P95 < 200ms`、checkpoint inline / external 延迟和恢复时间,更适合后续规模假设或非功能需求,不应在 Step 3 伪装成问题量化。

本步采用“当前表现 + 影响范围 / 后果”的方式表达问题:

| 问题 | 当前表现 | 影响范围 / 后果 |
|---|---|---|
| 过程执行事实缺少统一需求收束 | 旧 process 文档内容丰富,但正式需求层混有产品背景、标准、详细字段、状态机、实现技术栈和测试指标 | 相邻仓会各自解释当前过程进展、Activity 状态、等待点和恢复点 |
| 定义真相、工作真相与运行事实容易混淆 | ProcessTemplate / ProcessTemplateDef、Activity / WorkItem、timebox / Iteration、Artifact output / artifact truth 在旧文档和下游文档中交织 | 后续架构、详细设计和实现会在 method-library、work、artifact 和 process 之间反复选边 |
| 挂起与恢复链路缺少需求层问题收束 | waiting_gate、checkpoint、governance decision、runtime feedback、reasoning trace 和 recovery 在旧文档中已经出现,但没有先抽象成需求问题 | 过程停住后无法稳定说明为什么停、从哪里恢复、谁给出恢复依据、哪些正文不能进入 process |

### 3.4 哪些是业务问题,哪些是技术问题？

| 类型 | 内容 |
|---|---|
| 业务问题 | 平台缺少对“项目如何按规矩推进、在哪里等待人类决策、失败后如何恢复”的统一需求语言,用户和 AI member 难以稳定理解当前过程所处阶段、下一步、等待原因和恢复依据。 |
| 技术问题 | method-library definition / process runtime index、WorkItem / Activity、Iteration / timebox、Gate decision / waiting_gate、runtime checkpoint / Instance checkpoint / reasoning trace 等边界若不在需求层先讲清,后续设计与实现会反复出现 1:1 落码冲突。 |

---

## 4. 当前文档问题诊断

| 位置 | 当前表现 | 问题 | 处理口径 |
|---|---|---|---|
| `00-需求文档.md` §2.1 | 背景强调按过程模板推进、关键节点停下来、从 Checkpoint 恢复 | 方向正确,可保留 | 正式 §3 背景继续使用该产品背景,但不写成 BPMN 实现方案 |
| `00-需求文档.md` §2.2 | 用 `domain/process/README.md` 行数、ADR 状态、样板代码验证等表达痛点 | 部分是旧进度描述,部分滑入实现验证,不适合作为新版需求问题 | 转译为“旧设计未按最新 SOP 收束为过程执行需求问题” |
| `00-需求文档.md` §2.3 | 写 `10w 活跃 Instance / 5000w Activity/年` | 更像规模 / 非功能输入,不是 Step 3 问题定义 | 后移 Step 13 判断是否作为非功能或容量假设 |
| `00-需求文档.md` §2.4 | 技术问题列 BPMN、三段式、Tailoring、Checkpoint、Token、waiting_gate、AutoAction、嵌套 | 这是候选能力 / 设计主题,不等同问题定义 | 本步只抽象为执行事实、边界混淆、挂起恢复三类问题 |
| `01-架构设计.md` | 直接写 CompleteActivity P95、checkpoint QPS、Python / PostgreSQL、object storage | 对架构有用,但不属于需求问题 | 后移架构 / 非功能 / 配置阶段重新裁剪 |
| `02-概要设计.md` | 已明确 process 与 work / governance / artifact / runtime 分层 | 是有效问题线索 | 纳入 Step 3 的边界混淆问题 |
| `03-详细设计.md` | 已有 struct、函数、流程伪代码 | 层级过深,不能反向支配需求问题 | 仅作为旧问题线索,不引入字段和函数 |

---

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 背景主线 | “把阶段、里程碑、Gate、恢复变成 BPMN / SPEM / 29110 过程引擎” | “把按规矩推进收束为统一过程执行事实” | 避免 Step 3 写成实现方案或标准方案 |
| 问题表达 | 旧文档混有设计进度、代码验证、标准、功能名、性能指标 | 收敛为 3 个核心问题:过程执行事实未统一、定义 / 工作 / 运行事实混淆、挂起恢复链路未抽象 | 避免 Step 3 写成目标、功能、测试或非功能 |
| 量化处理 | 使用 `10w 活跃 Instance / 5000w Activity/年`、P95、恢复时间 | 不在 Step 3 采用运行时指标;记录为后续非功能候选 | 当前没有真实测量来源,不能伪量化 |
| 业务 / 技术分类 | 旧文档把 BPMN、Token、waiting_gate 等列成技术问题 | 业务问题聚焦过程可理解与可恢复;技术问题聚焦需求边界和后续落码冲突 | 更符合最新规范 4.3 |

---

## 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A: 沿用旧文档的“过程引擎未落地”问题主线 | 简短,贴近旧描述 | 容易把 BPMN / Temporal / 技术栈当成需求问题 | 不采用 |
| 方案 B: 收敛为“过程执行事实缺少统一需求收束” | 与 Step 2 定位一致,能解释为什么当前需要先校准 Process | 需要后续 Step 4 再展开目标,不能在本步直接给解决路径 | 采用 |
| 方案 C: 把性能和规模作为主要问题 | 有数字,看起来可量化 | 旧数字不是当前真实测量,且性能问题不是本轮需求校准的主要矛盾 | 不采用 |
| 方案 D: 把 waiting_gate / checkpoint 作为唯一问题 | 抓住恢复链关键风险 | 过窄,无法覆盖 definition/runtime、work/process 和 artifact/runtime 边界 | 不采用 |

### 6.1 待确认问题的方案选择

#### 是否继续保留旧文档中的规模量化？

| 方案 | 内容 | 影响 |
|---|---|---|
| 方案 A | 在 Step 3 写 `10w 活跃 Instance / 5000w Activity/年` 和 P95 指标 | 看起来量化,但可能误导为当前已确认容量目标 |
| 方案 B | Step 3 不使用该数字,后续 Step 13 再判断是否作为容量假设 | 问题定义更干净,避免伪量化 |

推荐方案 B。原因是该数字没有来自当前已完成上游的正式测量或验收基线,更适合非功能需求阶段评估。

#### 是否把 BPMN / SPEM / 29110 写成问题本身？

| 方案 | 内容 | 影响 |
|---|---|---|
| 方案 A | 写成“缺少 BPMN / SPEM / 29110 引擎” | 会把实现或标准选择提前写成问题 |
| 方案 B | 写成“缺少统一过程执行事实收束”,标准作为后续能力和约束候选 | 保留旧线索,不把方案前置 |

推荐方案 B。原因是 Step 3 只说明为什么值得做,不确认具体实现形态。

---

## 7. 结构化中间产物

### 7.1 业务背景结论

`L1-process` 当前值得讨论,是因为产品要求软件项目能按规则推进、关键节点可等待人类、失败后可恢复、过程始终可观察。基础契约、事件协作、SDK、身份、对话、工作事实和方法定义已经收稳后,平台需要继续收束过程执行事实,避免相邻仓各自解释流程进展。

### 7.2 现状与问题结论

| 问题编号 | 问题 | 当前表现 | 影响范围 / 后果 |
|---|---|---|---|
| P-PROC-001 | 过程执行事实缺少统一需求收束 | 旧 process 文档内容丰富但层级混杂,正式需求未按最新 SOP 重建 | 相邻仓会各自解释过程进展、Activity 状态、等待点和恢复点 |
| P-PROC-002 | 定义真相、工作真相与运行事实容易混淆 | ProcessTemplate / ProcessTemplateDef、Activity / WorkItem、timebox / Iteration、Activity output / artifact truth 反复需要澄清 | method-library、work、artifact 和 process 之间容易形成多真相 |
| P-PROC-003 | 挂起与恢复链路缺少需求层问题收束 | waiting_gate、checkpoint、governance decision、runtime feedback、reasoning trace 和 recovery 混在旧描述中 | 停住、恢复、审计和正文边界无法稳定落码 |

### 7.3 问题分类结论

| 类型 | 内容 |
|---|---|
| 业务问题 | Quantalithos 缺少对“项目如何按规矩推进、在哪里等待人类决策、失败后如何恢复”的统一需求语言,用户和 AI member 难以稳定理解当前过程所处阶段、下一步、等待原因和恢复依据。 |
| 技术问题 | method-library definition / process runtime index、WorkItem / Activity、Iteration / timebox、Gate decision / waiting_gate、runtime checkpoint / Instance checkpoint / reasoning trace 等边界若不在需求层先讲清,后续设计与实现会反复出现 1:1 落码冲突。 |

---

## 8. 回填草稿

以下内容供 Step 17 重建正式 `00-需求文档.md` 时回填到 §3。

```md
## 3. 背景与问题定义

> 校准来源：
> - `design-calibration/00_req_step_03_problem_context.md`
>
> 延伸阅读：
> - 建议继续阅读上述中间产物的“SOP 问题回答”“当前文档问题诊断”和“设计取舍”小节，了解本章如何从旧文档中的背景、痛点和边界风险收敛为当前问题主线。

### 3.1 业务背景

Quantalithos 的产品叙事要求软件项目不是一次性对话或孤立任务，而是按规则推进、关键节点可停、失败后可恢复、全过程可观察的长期协作对象。随着 core、bus、sdk、identity、conversation、work 和 method-library 已经收稳，平台需要继续把“按什么规矩推进”收束成独立的 process 需求基线，让相邻仓围绕同一套过程执行事实协作。

### 3.2 现状与问题

| 问题 | 当前表现 | 影响范围 / 后果 |
|---|---|---|
| 过程执行事实缺少统一需求收束 | 旧 process 文档内容丰富但层级混杂，正式需求未按最新 SOP 重建 | 相邻仓会各自解释过程进展、Activity 状态、等待点和恢复点 |
| 定义真相、工作真相与运行事实容易混淆 | ProcessTemplate / ProcessTemplateDef、Activity / WorkItem、timebox / Iteration、Activity output / artifact truth 反复需要澄清 | method-library、work、artifact 和 process 之间容易形成多真相 |
| 挂起与恢复链路缺少需求层问题收束 | waiting_gate、checkpoint、governance decision、runtime feedback、reasoning trace 和 recovery 混在旧描述中 | 停住、恢复、审计和正文边界无法稳定落码 |

### 3.3 业务问题 vs 技术问题

| 类型 | 内容 |
|---|---|
| 业务问题 | Quantalithos 缺少对“项目如何按规矩推进、在哪里等待人类决策、失败后如何恢复”的统一需求语言，用户和 AI member 难以稳定理解当前过程所处阶段、下一步、等待原因和恢复依据。 |
| 技术问题 | method-library definition / process runtime index、WorkItem / Activity、Iteration / timebox、Gate decision / waiting_gate、runtime checkpoint / Instance checkpoint / reasoning trace 等边界若不在需求层先讲清，后续设计与实现会反复出现 1:1 落码冲突。 |
```

---

## 9. 待确认事项

| 编号 | 待确认事项 | 方案 A | 方案 B | 推荐 |
|---|---|---|---|---|
| Q-001 | 是否在 Step 3 保留旧规模量化 | 保留 `10w 活跃 Instance / 5000w Activity/年` 和 P95 指标 | 后移到 Step 13 非功能需求评估 | 推荐 B。原因是 Step 3 不应伪量化,也不应提前写非功能指标 |
| Q-002 | 是否把问题主线写成“过程引擎未落地” | 使用旧问题主线 | 改为“过程执行事实缺少统一需求收束” | 推荐 B。原因是“过程引擎”过早绑定实现形态 |
| Q-003 | 是否把 waiting_gate / checkpoint 作为唯一问题 | 只写恢复链 | 写成三类问题之一,同时保留 definition/runtime 和 work/process 边界 | 推荐 B。原因是恢复链关键但不足以覆盖 process 需求问题全貌 |

当前建议:接受上述推荐后进入 Step 4。

---

## 10. 进入下一步条件

- 已说明当前业务背景:平台需要统一过程执行事实,支撑按规则推进、等待人类决策和失败恢复。
- 已列出 3 个主要问题:过程执行事实缺少统一需求收束、定义 / 工作 / 运行事实混淆、挂起与恢复链路未抽象。
- 已说明旧量化指标不在 Step 3 使用,后移非功能需求阶段。
- 已区分业务问题与技术问题。
- 未把目标、功能、规则、接口、数据归属或实现方案写进问题定义。
