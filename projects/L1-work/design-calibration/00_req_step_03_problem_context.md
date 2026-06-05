# Step 3. 背景与问题定义

> 对应 SOP: `standards/document/需求文档讨论流程_SOP.md` Step 3
> 回填章节: `00-需求文档.md` §3 背景与问题定义
> 生成日期: 2026-06-02

---

## 1. 本步目标

说明为什么 `L1-work` 值得在当前阶段单独校准：Quantalithos 需要一处统一的项目工作事实来源，否则项目状态、正式任务、执行步骤、对话上下文、流程节奏、产物证据和运行时推进会形成多真相。本步只写背景与问题，不写目标、功能、规则、接口、数据归属或实现方案。

---

## 2. 本步输入

| 输入 | 当前状态 | 本步使用方式 |
|---|---|---|
| `design-calibration/00_req_step_01_upstream_relation.md` | Step 1 已完成 | 固定上游来源，避免把相邻仓重新定义成问题来源 |
| `design-calibration/00_req_step_02_position_boundary.md` | Step 2 已完成 | 固定 `L1-work` 是项目工作事实真相仓 |
| `projects/L1-work/00-需求文档.md` §2 | 旧版背景与问题 | 提取“用户管理项目而不是孤立 Agent”“work 是业务主干”“相邻仓依赖 work 事实”等背景线索 |
| `projects/L1-work/02-概要设计.md` §2 | 旧版概要问题定义 | 提取“Backlog 被个人步骤污染”“planning 与工作事实混层”“child WorkItem 与 plan item 混淆”等问题线索 |
| `architecture/adr/0004-global-vs-project-member.md` | 已接受 ADR | 作为双层 Member 问题已被识别的背景输入 |
| `architecture/adr/0008-activity-completion-policy.md` | 已接受 ADR | 作为 WorkItem 与 Activity 独立状态机问题已被识别的背景输入 |
| `architecture/adr/0009-viewprofile-in-method-library.md` | 已接受 ADR | 作为 L1 真相与视图策略分离问题已被识别的背景输入 |

---

## 3. SOP 问题回答

### 3.1 当前业务背景是什么？

Quantalithos 的协作对象不是一次性会话、单个 Agent 或孤立执行步骤，而是长期推进、可审计、可被多仓引用的软件项目。随着 `L0-core`、`L0-bus`、`L0-sdk`、`L1-identity`、`L1-conversation` 和 `L3-method-library` 已经收稳，平台开始需要把项目、项目成员、待办、正式工作项、迭代和执行计划升级边界收束成统一的仓级需求，否则后续 process、governance、artifact、workspace、runtime 和产品入口都会缺少共同项目事实源。

### 3.2 当前的主要痛点或机会点是什么？

主要痛点不是“缺少某个具体接口”，而是项目工作事实容易散落在多个相邻概念中：

- 对话里产生的建议、执行计划里的个人步骤、流程节点和产物证据都可能被误当作正式任务。
- ProjectMember、WorkItem、Iteration、ImplementationPlan、Activity 等概念若不在需求层先分清，后续设计会反复在对象、状态、测试和实现阶段返工。
- 已有旧 work 文档包含大量详细设计和不变量，但它还没有按最新 SOP 重新转译成清晰的仓级需求问题。

### 3.3 这些问题能否量化？

当前不能可靠量化为运行时指标。旧文档中的 `10w 项目 x 50 WorkItem`、`CreateWorkItem P95 < 100ms`、`GetProjectBoard P95 < 300ms` 更适合后续规模假设或非功能需求，不应在 Step 3 伪装成问题量化。

本步采用“当前表现 + 影响范围 / 后果”的方式表达问题：

| 问题 | 当前表现 | 影响范围 / 后果 |
|---|---|---|
| 项目工作事实缺少统一需求收束 | 旧文档把 work 称为业务主干仓，但正式需求层仍混有产品叙事、详细字段、状态机、功能和依赖描述 | 后续 process、governance、artifact、workspace、runtime 和产品入口会各自解释项目状态与工作事实 |
| 正式工作项与执行步骤容易混淆 | Backlog / WorkItem / child WorkItem 可能被 conversation suggestion、ImplementationPlan plan item 或 runtime execution step 污染 | Backlog 膨胀，正式协作任务和个人执行步骤混在一起，审计时无法判断哪些工作真正进入协作承诺 |
| 相邻仓边界会影响 Work 真相稳定性 | GlobalMember / ProjectMember、WorkItem / Activity、ViewProfile / board view、Artifact evidence / done 判据等边界若不先收紧 | 后续需求、架构、详细设计和实现会在身份、流程、视图、证据和运行时之间形成多真相 |

### 3.4 哪些是业务问题，哪些是技术问题？

| 类型 | 内容 |
|---|---|
| 业务问题 | 平台缺少对“软件项目如何被正式管理、拆分、承诺、追踪和审计”的仓级需求收束，导致用户与 AI member 围绕项目协作时缺少共同的项目工作事实语言。 |
| 技术问题 | Project / ProjectMember、Backlog / WorkItem / child WorkItem、Iteration / planning timing、ImplementationPlan / plan item、Activity / WorkItem、Artifact evidence / done 判据等边界若不在需求层先讲清，会导致后续设计和实现反复在相邻仓之间选边。 |

---

## 4. 当前文档问题诊断

| 位置 | 当前表现 | 问题 | 处理口径 |
|---|---|---|---|
| `00-需求文档.md` §2.1 | 背景强调用户管理项目，不是管理孤立 Agent | 方向正确，可保留 | 正式 §3 背景继续使用该产品背景，但压缩为短段落 |
| `00-需求文档.md` §2.2 | 用“设计文档 1776 行”“代码未验证”“复杂依赖未验证”等表述问题 | 部分是旧进度描述，部分滑入实现验证，不适合作为新版需求问题 | 转译为“旧设计未按最新 SOP 收束为仓级需求问题” |
| `00-需求文档.md` §2.3 | 写 `10w 项目 x 50 WorkItem` 和性能目标 | 更像规模 / 非功能输入，不是 Step 3 问题定义 | 后移 Step 13 判断是否作为非功能或容量假设 |
| `00-需求文档.md` §3 | 直接写 Project lifecycle、DAG、done 判据和性能目标 | 已进入目标与验收 | 后移 Step 4、Step 10、Step 13 |
| `02-概要设计.md` §2.1 | 明确长期管理和审计对象不是流程节点或 Agent 内部步骤，而是项目工作事实 | 符合当前问题主线 | 纳入正式 §3 背景和问题表 |
| `02-概要设计.md` §2.2 | 使用“当前值 / 目标值 / 差距”表 | 有助于说明差距，但 “目标值” 会滑入 Step 4 | 只保留当前表现与影响后果 |
| `domain/work/README.md` | 已包含大量对象、字段和不变量 | 不能直接作为问题定义 | 作为问题线索，不在 Step 3 展开对象设计 |

---

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 背景主线 | work 是业务主干，conversation / process / governance / artifact 都依赖它 | 平台需要统一项目工作事实，供多仓共同引用 | “业务主干”太泛，统一项目事实更贴近 Step 2 定位 |
| 问题表达 | 旧文档混有设计进度、代码验证、性能指标和功能依赖 | 收敛为 3 个核心问题：事实未统一、任务与步骤混淆、相邻仓边界串线 | 避免 Step 3 写成目标、功能、测试或非功能 |
| 量化处理 | 使用 `10w 项目 x 50 WorkItem`、P95 等数字 | 不在 Step 3 采用运行时指标；记录为后续非功能候选 | 当前没有真实测量来源，不能伪量化 |
| 业务 / 技术分类 | 旧文档用一句话区分 | 业务问题聚焦项目协作语言，技术问题聚焦需求边界与后续设计实现选边 | 更符合最新规范 4.3 |

---

## 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A: 沿用旧文档的业务主干 + 五仓依赖问题 | 简短，保留旧表述 | 容易滑入依赖章节，且无法解释 child WorkItem / ImplementationPlan 的当前核心风险 | 不采用 |
| 方案 B: 收敛为“项目工作事实缺少统一需求收束” | 与 Step 2 定位一致，能解释为什么当前需要先校准 Work | 需要后续 Step 4 再展开目标，不能在本步直接给解决路径 | 采用 |
| 方案 C: 把性能和规模作为主要问题 | 有数字，看起来可量化 | 旧数字不是当前真实测量，且性能问题不是本轮需求校准的主要矛盾 | 不采用 |
| 方案 D: 把 Backlog / ImplementationPlan 混淆作为唯一问题 | 抓住关键概念风险 | 过窄，无法覆盖 Project / ProjectMember / Iteration 和相邻仓协作 | 不采用 |

### 6.1 待确认问题的方案选择

#### 是否继续保留旧文档中的规模量化？

| 方案 | 内容 | 影响 |
|---|---|---|
| 方案 A | 在 Step 3 写 `10w 项目 x 50 WorkItem` | 看起来量化，但可能误导为当前已确认容量目标 |
| 方案 B | Step 3 不使用该数字，后续 Step 13 再判断是否作为容量假设 | 问题定义更干净，避免伪量化 |

推荐方案 B。原因是该数字没有来自当前已完成上游的正式测量或验收基线，更适合非功能需求阶段评估。

#### 是否把 `ImplementationPlan` 问题写进 Step 3？

| 方案 | 内容 | 影响 |
|---|---|---|
| 方案 A | 不写，避免提前引入复杂概念 | 背景更短，但会漏掉当前 work 讨论中最重要的串线风险 |
| 方案 B | 写为“正式工作项与执行步骤容易混淆”，不写对象设计和状态流 | 能解释为什么后续必须处理 promote 边界，同时不进入详细设计 |

推荐方案 B。原因是 Step 2 已把 ImplementationPlan promote 边界纳入定位，Step 3 必须解释这个边界为什么值得关注。

---

## 7. 结构化中间产物

### 7.1 业务背景结论

`L1-work` 当前值得讨论，是因为基础契约、事件协作、SDK、身份、对话和方法定义已经收稳，平台需要继续收束项目工作事实。该事实层是后续 process、governance、artifact、workspace、runtime、member-service 和产品入口共同引用的项目锚点。

### 7.2 现状与问题结论

| 问题编号 | 问题 | 当前表现 | 影响范围 / 后果 |
|---|---|---|---|
| P-001 | 项目工作事实缺少统一需求收束 | 旧 work 文档内容丰富但层级混杂，正式需求未按最新 SOP 重建 | 相邻仓会各自解释项目状态、任务、迭代和完成判据 |
| P-002 | 正式工作项与执行步骤容易混淆 | child WorkItem、ImplementationPlan、conversation suggestion、runtime plan item 在旧文档和讨论中反复需要澄清 | Backlog 可能被个人步骤污染，正式协作任务边界失真 |
| P-003 | 相邻仓边界影响 Work 真相稳定 | identity、conversation、method-library、process、governance、artifact、runtime、workspace 均与 Work 共享项目上下文 | 若需求层不先收紧，后续设计和实现会出现多真相和选边冲突 |

### 7.3 问题分类结论

| 类型 | 内容 |
|---|---|
| 业务问题 | Quantalithos 缺少对项目工作事实的统一需求语言，用户与 AI member 围绕项目协作时，难以稳定判断哪些工作已正式存在、被谁承担、是否进入承诺范围、为什么完成。 |
| 技术问题 | Work 与身份、对话、方法定义、流程、治理、产物、运行时和工作台视图的边界会直接影响对象、状态、测试和实现签名；若问题不先收束，后续实现 agent 容易遇到 1:1 落码冲突。 |

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

Quantalithos 的协作对象不是一次性会话、单个 Agent 或孤立执行步骤，而是长期推进、可审计、可被多仓引用的软件项目。随着基础契约、事件协作、SDK、身份、对话和方法定义已经收稳，平台需要把 Project、ProjectMember、Backlog、WorkItem、child WorkItem、Iteration 和 ImplementationPlan promote 边界收束为统一的项目工作事实需求。

### 3.2 现状与问题

| 问题 | 当前表现 | 影响范围 / 后果 |
|---|---|---|
| 项目工作事实缺少统一需求收束 | 旧 work 文档内容丰富但层级混杂，正式需求未按最新 SOP 重建 | 相邻仓会各自解释项目状态、任务、迭代和完成判据 |
| 正式工作项与执行步骤容易混淆 | child WorkItem、ImplementationPlan、conversation suggestion、runtime plan item 在旧文档和讨论中反复需要澄清 | Backlog 可能被个人步骤污染，正式协作任务边界失真 |
| 相邻仓边界影响 Work 真相稳定 | identity、conversation、method-library、process、governance、artifact、runtime、workspace 均与 Work 共享项目上下文 | 若需求层不先收紧，后续设计和实现会出现多真相和选边冲突 |

### 3.3 业务问题 vs 技术问题

| 类型 | 内容 |
|---|---|
| 业务问题 | Quantalithos 缺少对项目工作事实的统一需求语言，用户与 AI member 围绕项目协作时，难以稳定判断哪些工作已正式存在、被谁承担、是否进入承诺范围、为什么完成。 |
| 技术问题 | Work 与身份、对话、方法定义、流程、治理、产物、运行时和工作台视图的边界会直接影响对象、状态、测试和实现签名；若问题不先收束，后续实现 agent 容易遇到 1:1 落码冲突。 |
```

---

## 9. 待确认事项

| 编号 | 待确认事项 | 方案 A | 方案 B | 推荐 |
|---|---|---|---|---|
| Q-001 | 是否在 Step 3 保留旧规模量化 | 保留 `10w 项目 x 50 WorkItem` 和 P95 指标 | 后移到 Step 13 非功能需求评估 | 推荐 B。原因是 Step 3 不应伪量化，也不应提前写非功能指标 |
| Q-002 | 是否把问题主线写成“业务主干仓未实现” | 使用旧问题主线 | 改为“项目工作事实缺少统一需求收束” | 推荐 B。原因是“业务主干”过泛，无法指导后续边界裁剪 |
| Q-003 | 是否把 ImplementationPlan 混淆写入问题表 | 不写，避免复杂 | 写成“正式工作项与执行步骤容易混淆” | 推荐 B。原因是这是 child WorkItem / promote 边界的核心问题来源 |

当前建议：接受上述推荐后进入 Step 4。

---

## 10. 进入下一步条件

- 已说明当前业务背景：平台需要统一项目工作事实，支撑后续多仓协作。
- 已列出 3 个主要问题：项目事实缺少统一需求收束、正式工作项与执行步骤混淆、相邻仓边界影响 Work 真相稳定。
- 已说明旧量化指标不在 Step 3 使用，后移非功能需求阶段。
- 已区分业务问题与技术问题。
- 未把目标、功能、规则、接口、数据归属或实现方案写进问题定义。
