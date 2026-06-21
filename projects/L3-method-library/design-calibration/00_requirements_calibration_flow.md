# L3-method-library 00 需求文档全量重启校准流程

> 创建日期: 2026-06-15
> 状态: completed
> 当前模式: full-restart
> 设计仓: `/home/aris/Projects/quantalithos-design`
> 项目目录: `projects/L3-method-library`
> 正式文档目标: `projects/L3-method-library/00-需求文档.md`
> 项目级台账: `design-calibration/project_execution_ledger.md`
> 本轮口径: 把 `L3-method-library` 当作本轮未完成项目,从 `00-需求文档` Step 1 重新建立结论。

---

## 1. 文档级恢复点

| 当前 Step | 当前模块 | gate_status | gate_reason | next_allowed_action | source_files |
|---|---|---|---|---|---|
| 00 completed | 正式 `00-需求文档.md` 已装配完成 | pass | Step 17 已完成并通过自检。 | 允许以新版 `00-需求文档.md` 和 `00_req_step_01`~`00_req_step_17` 作为输入,进入 `01-架构设计.md` 重启讨论。 | `project_execution_ledger.md`;`00_req_step_01_upstream_relation.md`~`00_req_step_17_formal_document_assembly.md`;`00-需求文档.md`;`standards/document/需求文档讨论流程_SOP.md`;`standards/document/需求文档书写规范.md` |

---

## 2. 执行纪律

本流程只负责 `L3-method-library` 的 `00-需求文档`。执行时必须按需求 SOP 一个 Step 一个 Step 推进。

固定纪律:

- 每个 Step 先列必读文档。
- 每个 Step 先搭整体模块,再逐模块先思考、后写入。
- 模块思考和模块写入记录在当前 Step 文件内,不拆分成额外文件。
- 旧 `L3-method-library` 正式文档、历史 `02_hld_*` 和历史 `03_ddd_*` 只能在对应 Step 形成独立结论后做差异审计。
- 正式 `00-需求文档.md` 每章必须能追溯到具体 `00_req_step_*` 中间产物。
- 需求阶段不得写数据库表、Rust struct、repository、port、handler、事务流程或代码目录。
- 单次写入以 100~300 行为宜;该限制只约束单次写入批次,不限制 Step 文件、章节或正式文档最终长度。

---

## 3. 公共必读文档

| 文档 | 用途 | 状态 |
|---|---|---|
| `standards/document/需求文档讨论流程_SOP.md` | 需求 Step 顺序、Step 内小阶段、核心能力小循环。 | read |
| `standards/document/需求文档书写规范.md` | 正式需求文档章节结构和校准来源格式。 | read |
| `standards/document/设计文档讨论中间产物规范.md` | 中间产物结构、状态表、停审和长文档分批纪律。 | read |
| `standards/document/设计真相源闭环与可落码性标准.md` | 防止后续需求结论诱发不可落码设计缺口。 | read |
| `standards/document/全局项目依赖关系与裁剪规则.md` | 后续 Step 6/12 的依赖裁剪规则。 | read |
| `/tmp/l3_method_library_00_requirements_discussion_steps.md` | 本轮全量重启讨论计划。 | read |
| `/tmp/quantalithos_subproject_discussion_plan.md` | 当前项目讨论顺序和 L3-method-library 入口。 | read |

---

## 4. Step 总任务表

| Step | 输出文件 | 主题 | 状态 | gate_status | next_allowed_action | 完成门禁 |
|---:|---|---|---|---|---|---|
| 1 | `00_req_step_01_upstream_relation.md` | 与上游文档的关系声明 | done | pass | 进入 Step 2。 | 权威输入、辅助输入、旧材料审计输入三层分清,且不提前写边界/能力/接口。 |
| 2 | `00_req_step_02_position_boundary.md` | 本仓定位与边界 | done | pass | 进入 Step 3。 | 明确本仓是什么、不是什么、拥有和不拥有的真相范围。 |
| 3 | `00_req_step_03_problem_context.md` | 背景与问题定义 | done | pass | 进入 Step 4。 | 只描述平台能力缺口和问题背景,不写实现方案。 |
| 4 | `00_req_step_04_goals_non_goals.md` | 目标与非目标 | done | pass | 进入 Step 5。 | 每个目标可验收,每个非目标有归属和理由。 |
| 5 | `00_req_step_05_users_roles.md` | 用户与角色 | done | pass | 进入 Step 6。 | 区分人类角色、系统消费者和操作语境,不提前定义权限实现。 |
| 6 | `00_req_step_06_consumers_dependencies.md` | 使用方与依赖 | done | pass | 进入 Step 7。 | 输出依赖裁剪表、类型分类表、禁止依赖表和 ASCII 图。 |
| 7 | `00_req_step_07_core_capability_loop.md` | 核心能力闭环 | done | pass | 进入 Step 8。 | 核心能力节点能驱动 Step 8~14,无孤立能力。 |
| 8 | `00_req_step_08_user_stories.md` | 用户故事 | done | pass | 进入 Step 9。 | 每个故事回指核心能力节点,无通用故事堆砌。 |
| 9 | `00_req_step_09_functional_requirements.md` | 功能需求 | done | pass | 进入 Step 10。 | 功能需求只写外部可见行为,不写实现组织。 |
| 10 | `00_req_step_10_business_rules_boundaries.md` | 业务规则与边界约束 | done | pass | 进入 Step 11。 | 每条规则有能力来源、边界理由和后续验收承接。 |
| 11 | `00_req_step_11_data_ownership.md` | 数据需求与数据归属 | done | pass | 进入 Step 12。 | 明确真相数据、快照数据、引用数据和禁止保存正文。 |
| 12 | `00_req_step_12_interfaces_dependencies.md` | 接口与依赖 | done | pass | 进入 Step 13。 | 只写接口能力边界,不写协议 schema、port trait 或 adapter 实现。 |
| 13 | `00_req_step_13_non_functional_requirements.md` | 非功能需求 | done | pass | 进入 Step 14。 | 每条 NFR 是可判断句,并回指能力或全局目标。 |
| 14 | `00_req_step_14_acceptance_criteria.md` | 验收标准 | done | pass | 进入 Step 15。 | 验收项覆盖能力、功能、规则、数据、接口、NFR 和一票否决项。 |
| 15 | `00_req_step_15_risks_open_questions.md` | 风险与待确认事项 | done | pass | 进入 Step 16。 | 风险有当前处理口径;待确认项不伪装成正式结论。 |
| 16 | `00_req_step_16_traceability_matrix.md` | 需求追溯矩阵 | done | pass | 进入 Step 17。 | 无孤儿故事、功能、规则、数据、接口和验收。 |
| 17 | `00_req_step_17_formal_document_assembly.md` | 整理正式文档 | done | pass | 进入 `01-架构设计.md` 重启讨论。 | 正式每章有具体校准来源,正文不新增未确认结论。 |

---

## 5. 旧材料处理状态

| 材料 | 当前状态 | 使用规则 |
|---|---|---|
| `projects/L3-method-library/00-需求文档.md` | historical_material | 只在当前 Step 独立结论形成后做差异审计。 |
| `projects/L3-method-library/design-calibration/00_req_step_*` | historical_material | 到达对应 Step 时重写;不得视为本轮已完成。 |
| `projects/L3-method-library/01~07` | historical_material | 只用于后置反向污染检查。 |
| `projects/L3-method-library/design-calibration/02_hld_*` | historical_material | Step 7 后按需审计;不得反推需求。 |
| `projects/L3-method-library/design-calibration/03_ddd_*` | historical_material | Step 9 后按需审计;不得反推需求。 |
| `projects/L3-method-library/legacy/03-详细设计.v0.1.0.md` | historical_material | 必要时只作旧口径风险排查。 |

---

## 6. 文档级 blocker 台账

| Blocker ID | Step | 状态 | 描述 | 处理口径 |
|---|---|---|---|---|
| none | not_applicable | not_applicable | 当前未发现 blocker。 | `00-需求文档.md` 已完成,允许进入 `01-架构设计.md`。 |
