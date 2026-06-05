# Step 9. 功能需求

> 对应 SOP: `standards/document/需求文档讨论流程_SOP.md` Step 9
> 回填章节: `00-需求文档.md` §9 功能需求
> 生成日期: 2026-06-02

---

## 1. 本步目标

把 Step 8 的用户故事归并为 `L1-work` 必须提供的业务能力，并区分核心闭环能力与外围增强能力。本步不按对象 CRUD、API、Command、事件、DTO、状态机或代码模块拆分功能，也不把用户故事原样改写成功能项。

---

## 2. 本步输入

| 输入 | 当前状态 | 本步使用方式 |
|---|---|---|
| `design-calibration/00_req_step_07_core_capability_loop.md` | Step 7 已完成 | 固定 C-1~C-5 核心能力闭环 |
| `design-calibration/00_req_step_08_user_stories.md` | Step 8 已完成 | 作为功能归并的直接故事输入 |
| `design-calibration/00_req_step_02_position_boundary.md` | Step 2 已完成 | 防止功能越界到 identity / conversation / process / governance / artifact / runtime / workspace |
| `design-calibration/00_req_step_06_consumers_dependencies.md` | Step 6 已完成 | 固定编译期、运行期和事件协作边界 |
| `projects/L1-work/00-需求文档.md` §6 | 旧版功能清单 | 作为能力线索，不继承 CRUD / API / 规则 / 非功能混写 |
| `projects/L1-work/02-概要设计.md` §5 | 旧版主要组成部分 | 提取项目主语、成员承担、正式工作项、Iteration、投影、promote 等能力线索 |

---

## 3. SOP 问题回答

### 3.1 根据这些用户故事，系统必须提供哪些业务能力？

`L1-work` 必须提供的业务能力不是“创建 / 查询 / 更新 / 删除 Project 或 WorkItem”，而是围绕项目工作事实闭环形成的能力主题：

1. 项目工作主语成立能力。
2. 项目内成员承担表达能力。
3. 正式工作全集收束能力。
4. 正式工作拆分与升级边界能力。
5. 正式工作依赖与阻塞表达能力。
6. Iteration 承诺子集形成能力。
7. 项目工作事实消费与追溯能力。
8. 项目工作事实维护与对账能力。

这些能力共同支撑核心闭环。旧文档中的 `Project CRUD`、`WorkItem CRUD`、`GetProjectBoard`、`process 事件联动`、`artifact 关联` 等只作为后续设计或接口线索，不能作为需求层功能主题。

### 3.2 每个能力的输入、输出、触发条件、失败情况是什么？

需求阶段只写能力级输入、输出、触发和失败，不写字段、DTO、函数、事件 schema 或事务处理：

| 能力 | 能力级输入 | 能力级输出 | 触发条件 | 失败情况 |
|---|---|---|---|---|
| 项目工作主语成立能力 | 项目进入正式管理语境所需的业务上下文 | 可被引用和追溯的项目工作主语 | 项目从想法 / 对话 / 外部计划进入正式工作管理 | 项目主语缺少必要上下文；治理或身份前置未满足 |
| 项目内成员承担表达能力 | GlobalMember 引用、项目内承担意图、角色 / 责任上下文 | ProjectMember 项目内承担事实 | 项目需要把人类或 AI 成员纳入工作承担 | GlobalMember 不存在或状态不可承担；承担关系冲突 |
| 正式工作全集收束能力 | 项目内正式工作意图、来源上下文、承担 / 优先级 / 约束线索 | Backlog 中可追踪的正式工作全集 | 工作从讨论、计划、治理建议或成员输入进入协作视野 | 输入只是个人步骤或对话建议；缺少正式化理由 |
| 正式工作拆分与升级边界能力 | 协作级拆分需求或 plan item promote 需求 | 正式 child WorkItem 或拒绝升级结果 | 工作进入协作、依赖、排期、验收或风险视野 | 仍属于个人执行步骤；来源计划不可追溯 |
| 正式工作依赖与阻塞表达能力 | 工作之间的依赖、阻塞或风险关系 | 可解释的正式工作关系和阻塞状态 | 工作需要声明依赖、阻塞或解除阻塞依据 | 依赖关系不合法；形成循环；引用不存在 |
| Iteration 承诺子集形成能力 | 当前时间窗口、候选工作、规划节奏和承诺意图 | 从正式工作全集中选择出的承诺子集 | 项目进入 planning / commitment 语境 | 候选项不属于正式工作全集；承诺范围与当前约束冲突 |
| 项目工作事实消费与追溯能力 | 项目、成员、工作、Iteration 和完成依据的读取需求 | 可授权消费和可解释的工作事实视图 | 成员、审计者或相邻仓需要理解项目工作状态 | 请求方无权读取；派生视图滞后且无法解释 |
| 项目工作事实维护与对账能力 | 派生结果、投影、外部协作状态和一致性检查需求 | 对账结果、重建结果或维护证据 | 后台任务或运维需要维护消费面一致性 | 维护动作试图改变业务真相；对账来源不完整 |

### 3.3 哪些能力共同构成闭环核心？哪些只是外围增强？

核心闭环能力是没有它就无法成立 `L1-work` 的能力；外围增强能力可以提升体验、自动化或管理分析，但不决定项目工作事实是否成立。

| 分类 | 能力 |
|---|---|
| 核心闭环能力 | 项目工作主语成立能力；项目内成员承担表达能力；正式工作全集收束能力；正式工作拆分与升级边界能力；正式工作依赖与阻塞表达能力；Iteration 承诺子集形成能力；项目工作事实消费与追溯能力；项目工作事实维护与对账能力 |
| 外围增强能力 | 高级看板与多视图消费能力；自动化维护建议能力；容量趋势与负载风险提示能力；项目内工具能力调整协同能力；跨项目依赖理解能力 |
| 边界外能力 | GlobalMember 管理；conversation fact 正文；Process Activity 推进；Gate / Approval 决策；Artifact 正文；agent plan item progress；workspace dashboard 聚合 |

---

## 4. 当前文档问题诊断

| 位置 | 当前表现 | 问题 | 处理口径 |
|---|---|---|---|
| `00-需求文档.md` §6.1 | `Project CRUD`、`WorkItem CRUD`、`GetProjectBoard` 等功能名 | 退化成对象操作 / API / 查询清单 | 改为能力主题，不固定接口名 |
| `00-需求文档.md` §6.1 | `artifact 关联`、`process 事件联动`、`kickoff / archive Gate 联动` 与功能并列 | 依赖、规则、事件协作和功能混写 | 本步只写 Work 自身业务能力，协作细节后移 Step 12 |
| `00-需求文档.md` §6.2 | 业务规则与功能清单混在一起 | Step 9 与 Step 10 边界不清 | 规则后移 Step 10 |
| `00-需求文档.md` §6.3 | 对象依赖图写入功能章节 | 图有线索价值，但仍是对象关系图 | 后续数据归属或概要设计使用，不作为功能需求 |
| `02-概要设计.md` §5.3 | 主要组成部分按项目主语、正式工作项、Iteration、投影、promote 划分 | 粒度更接近能力主题 | 转译为需求层功能能力 |

---

## 5. 改动前后对比

| 项 | 改动前 | 改动后 | 原因 |
|---|---|---|---|
| 功能组织方式 | 对象 CRUD / 查询 / 事件联动 | 核心闭环能力 + 外围增强能力 | 对齐需求规范，支撑追溯矩阵 |
| WorkItem 表达 | WorkItem CRUD + DAG | 正式工作全集收束 + 拆分升级边界 + 依赖阻塞表达 | 更能保护正式工作事实不被个人步骤污染 |
| Iteration 表达 | Iteration / Sprint | Iteration 承诺子集形成能力 | 强调它是 Backlog 全集的时间窗口子集 |
| Board 表达 | GetProjectBoard 看板 | 项目工作事实消费与追溯能力；高级看板作为外围增强 | 避免需求层绑定接口名 |
| 相邻仓协作 | process / governance / artifact 作为功能项 | 作为能力触发、约束或后续接口依赖线索 | 防止 Work 接管相邻仓真相 |

---

## 6. 设计取舍

| 方案 | 优点 | 缺点 | 结论 |
|---|---|---|---|
| 方案 A: 保留旧 F-001~F-012 | 覆盖面广，接近旧实现想象 | CRUD、依赖、规则、非功能混写，无法直接追溯闭环 | 不采用 |
| 方案 B: 按核心闭环归并能力主题 | 能从故事追到能力，也能给规则、数据、验收提供结构锚点 | 后续需要再拆接口和对象 | 采用 |
| 方案 C: 按旧概要的五个组成部分直接做功能 | 比 CRUD 更好 | 组成部分偏概要结构，仍不是完整功能需求 | 部分吸收 |
| 方案 D: 把外围增强全部删除 | 核心非常清晰 | 会丢失旧文档中已识别的增强线索 | 不采用 |

### 6.1 待确认问题的方案选择

#### 是否把 `WorkItem DAG` 写成独立核心功能？

| 方案 | 内容 | 影响 |
|---|---|---|
| 方案 A | 写成独立功能需求 | 可强调依赖重要性，但容易滑向规则和数据结构 |
| 方案 B | 归入“正式工作依赖与阻塞表达能力” | 保持能力级表达，规则后移 Step 10 |

推荐方案 B。原因是依赖图无环、blocked 解除等属于重要规则，但 Step 9 应先表达能力主题。

#### 是否把 done 判据写成功能？

| 方案 | 内容 | 影响 |
|---|---|---|
| 方案 A | 写成“Artifact done criterion link”功能 | 容易把 artifact 协作、规则和验收混在功能章节 |
| 方案 B | 写入“项目工作事实消费与追溯能力”的完成依据线索，具体规则后移 Step 10 / Step 14 | 能保留追溯价值，又不越界到 artifact 正文 |

推荐方案 B。原因是 done 判据重要，但它是规则与验收方向，不是独立能力主题。

#### 是否把 Project lifecycle 写成核心功能？

| 方案 | 内容 | 影响 |
|---|---|---|
| 方案 A | 写成 Project lifecycle 功能 | 易变成状态机章节 |
| 方案 B | 归入“项目工作主语成立能力”，生命周期规则后移 Step 10 | 保持需求层能力表达 |

推荐方案 B。原因是项目主语成立包含生命周期需求线索，但状态集和迁移规则不应在 Step 9 展开。

---

## 7. 结构化中间产物

### 7.1 功能需求结论

| ID | 功能需求 | 能力类型 | 说明 | 支撑的核心能力闭环 | 对应的用户故事 |
|---|---|---|---|---|---|
| FR-WORK-001 | 项目工作主语成立 | 核心闭环能力 | 系统必须支持把软件项目作为正式工作对象建立和引用，而不是把项目散落成对话主题、流程实例或执行计划。 | C-1 项目主语成立 | US-WORK-001；US-WORK-002 |
| FR-WORK-002 | 项目内成员承担表达 | 核心闭环能力 | 系统必须支持表达 GlobalMember 在项目内的承担关系，使项目成员身份和平台成员身份分离但可追溯关联。 | C-2 项目内成员承担成立 | US-WORK-003；US-WORK-004 |
| FR-WORK-003 | 正式工作全集收束 | 核心闭环能力 | 系统必须支持把进入协作视野的工作收束为正式工作全集，并把对话建议、个人步骤和 runtime step 排除在默认 Backlog 真相之外。 | C-3 正式工作全集成立 | US-WORK-004；US-WORK-005 |
| FR-WORK-004 | 正式工作拆分与升级边界 | 核心闭环能力 | 系统必须支持把协作级拆分或符合条件的 plan item 升级为正式 child WorkItem，同时拒绝仍属于个人执行层的步骤污染正式工作全集。 | C-3 正式工作全集成立 | US-WORK-005；US-WORK-006 |
| FR-WORK-005 | 正式工作依赖与阻塞表达 | 核心闭环能力 | 系统必须支持表达正式工作之间的依赖、阻塞和解除依据，使成员能够按共同项目事实协作。 | C-3 正式工作全集成立；C-5 可消费可追溯成立 | US-WORK-008；US-WORK-009 |
| FR-WORK-006 | Iteration 承诺子集形成 | 核心闭环能力 | 系统必须支持从正式工作全集中形成当前时间窗口内承诺完成的工作集合，并保持它与 Backlog 全集的边界。 | C-4 承诺子集成立 | US-WORK-007；US-WORK-008 |
| FR-WORK-007 | 项目工作事实消费与追溯 | 核心闭环能力 | 系统必须支持成员、审计者和相邻仓以授权方式理解项目、成员承担、工作、Iteration 和完成依据的当前状态与历史轨迹。 | C-5 可消费可追溯成立 | US-WORK-002；US-WORK-008；US-WORK-009 |
| FR-WORK-008 | 项目工作事实维护与对账 | 核心闭环能力 | 系统必须支持后台任务在不改变业务真相的前提下维护派生结果、检查一致性并生成可解释的维护证据。 | C-5 可消费可追溯成立 | US-WORK-010 |
| FR-WORK-E01 | 高级看板与多视图消费 | 外围增强能力 | 系统可进一步支持更丰富的过滤、排序、分组和偏好视图，以提升项目工作事实消费效率。 | 外围增强能力 | US-WORK-E01 |
| FR-WORK-E02 | 自动化维护建议 | 外围增强能力 | 系统可进一步提示可解除阻塞、应 spillover 或需要协调的工作，但不替代正式规则和人工确认。 | 外围增强能力 | US-WORK-E02 |
| FR-WORK-E03 | 容量趋势与负载风险提示 | 外围增强能力 | 系统可进一步基于项目成员承担和承诺范围形成容量趋势与负载风险提示。 | 外围增强能力 | US-WORK-E03 |
| FR-WORK-E04 | 项目内工具能力调整协同 | 外围增强能力 | 系统可进一步支持项目内更高工具能力调整的受控协同，但治理和方法定义真相不归 Work。 | 外围增强能力 | US-WORK-E04 |
| FR-WORK-E05 | 跨项目依赖理解 | 外围增强能力 | 系统可进一步表达多个项目之间的依赖和组合风险，但不阻塞单项目工作事实闭环。 | 外围增强能力 | US-WORK-E05 |

### 7.2 能力类型结论

| 能力类型 | 功能需求 |
|---|---|
| 核心闭环能力 | FR-WORK-001；FR-WORK-002；FR-WORK-003；FR-WORK-004；FR-WORK-005；FR-WORK-006；FR-WORK-007；FR-WORK-008 |
| 外围增强能力 | FR-WORK-E01；FR-WORK-E02；FR-WORK-E03；FR-WORK-E04；FR-WORK-E05 |
| 边界外能力 | GlobalMember 管理；conversation fact 正文；Activity 推进；Gate / Approval 决策；Artifact 正文；agent plan item progress；workspace dashboard 聚合 |

### 7.3 闭环映射结论

| 闭环节点 | 功能需求 |
|---|---|
| C-1 项目主语成立 | FR-WORK-001 |
| C-2 项目内成员承担成立 | FR-WORK-002 |
| C-3 正式工作全集成立 | FR-WORK-003；FR-WORK-004；FR-WORK-005 |
| C-4 承诺子集成立 | FR-WORK-006 |
| C-5 可消费可追溯成立 | FR-WORK-005；FR-WORK-007；FR-WORK-008 |
| 外围增强 | FR-WORK-E01；FR-WORK-E02；FR-WORK-E03；FR-WORK-E04；FR-WORK-E05 |

### 7.4 故事映射结论

| 用户故事 | 功能需求 |
|---|---|
| US-WORK-001 | FR-WORK-001 |
| US-WORK-002 | FR-WORK-001；FR-WORK-007 |
| US-WORK-003 | FR-WORK-002 |
| US-WORK-004 | FR-WORK-002；FR-WORK-003 |
| US-WORK-005 | FR-WORK-003；FR-WORK-004 |
| US-WORK-006 | FR-WORK-004 |
| US-WORK-007 | FR-WORK-006 |
| US-WORK-008 | FR-WORK-005；FR-WORK-006；FR-WORK-007 |
| US-WORK-009 | FR-WORK-005；FR-WORK-007 |
| US-WORK-010 | FR-WORK-008 |
| US-WORK-E01 | FR-WORK-E01 |
| US-WORK-E02 | FR-WORK-E02 |
| US-WORK-E03 | FR-WORK-E03 |
| US-WORK-E04 | FR-WORK-E04 |
| US-WORK-E05 | FR-WORK-E05 |

### 7.5 边界外能力排除结论

| 排除能力 | 不进入原因 | 正确归属 |
|---|---|---|
| 平台级成员身份和生命周期管理 | Work 只表达 ProjectMember 项目内承担 | `L1-identity` |
| 对话事实、聊天消息和 trace / handoff 正文 | Work 只引用或显化工作相关上下文 | `L1-conversation` |
| 方法定义、任务定义和视图策略 | Work 只消费定义引用 | `L3-method-library` |
| Process Activity 推进和 ProcessInstance 状态 | Work 只接收 planning / review / timing 边界 | `L1-process` |
| Gate / Policy / Approval 决策 | Work 只消费治理结论 | `L1-governance` |
| Artifact / evidence / baseline / ImplementationPlan 正文 | Work 只引用完成依据和计划来源 | `L1-artifact` / runtime 边界 |
| agent loop、工具调用和 plan item progress | Work 只处理 promote 后的正式工作事实 | `L2-runtime` |
| PersonalWorkspace / ProjectWorkspace 聚合 dashboard | Work 提供事实，不拥有跨域聚合视图 | `L1-workspace` |

---

## 8. 回填草稿

以下内容供 Step 17 重建正式 `00-需求文档.md` 时回填到 §9。正式文档可摘录本文件 §7.1~§7.4 的表格，不重复扩写 SOP 问题回答、文档诊断和设计取舍。

```md
## 9. 功能需求

> 校准来源：
> - `design-calibration/00_req_step_09_functional_requirements.md`
>
> 延伸阅读：
> - 建议继续阅读上述中间产物的“SOP 问题回答”“结构化中间产物”和“边界外能力排除结论”小节，了解本章如何从用户故事归并为业务能力。

本文采用 `design-calibration/00_req_step_09_functional_requirements.md` §7 的功能需求结论。核心功能需求包括项目工作主语成立、项目内成员承担表达、正式工作全集收束、正式工作拆分与升级边界、正式工作依赖与阻塞表达、Iteration 承诺子集形成、项目工作事实消费与追溯、项目工作事实维护与对账。外围增强功能只作为后续能力线索，不作为当前核心闭环成立条件。

正式功能需求表应摘录：

- `design-calibration/00_req_step_09_functional_requirements.md` §7.1 功能需求结论。
- `design-calibration/00_req_step_09_functional_requirements.md` §7.2 能力类型结论。
- `design-calibration/00_req_step_09_functional_requirements.md` §7.3 闭环映射结论。
- `design-calibration/00_req_step_09_functional_requirements.md` §7.4 故事映射结论。
```

---

## 9. 待确认事项

| 编号 | 待确认事项 | 方案 A | 方案 B | 推荐 |
|---|---|---|---|---|
| Q-001 | 是否保留旧 F-001~F-012 功能清单 | 原样保留 | 按核心闭环能力重写 | 推荐 B。原因是旧清单混入 CRUD、接口、规则和依赖 |
| Q-002 | 是否把 WorkItem DAG 写成独立功能 | 独立写 | 归入正式工作依赖与阻塞表达能力 | 推荐 B。原因是 DAG 细节属于规则和数据结构，能力层先写依赖 / 阻塞表达 |
| Q-003 | 是否把 done 判据写成功能 | 独立写 artifact done criterion | 后移 Step 10 / Step 14，功能层只保留完成依据追溯线索 | 推荐 B。原因是 done 判据是规则和验收方向 |
| Q-004 | 是否把高级看板作为核心功能 | 是 | 外围增强 | 推荐 B。原因是基础消费追溯是核心，高级展示不是核心事实条件 |

当前建议：接受上述推荐后进入 Step 10。

---

## 10. 进入下一步条件

- 每项功能需求都有编号、能力类型、说明、闭环映射和用户故事映射。
- 核心闭环能力覆盖 C-1~C-5。
- 每个 Step 8 的核心用户故事至少映射到一个功能需求。
- 已区分核心闭环能力、外围增强能力和边界外能力。
- 未把功能写成 CRUD / API / Command / 事件 / 数据表 / 代码模块清单。
