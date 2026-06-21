# L3-method-library 01 架构设计全量重启校准流程

> 创建日期: 2026-06-15
> 状态: completed
> 当前模式: full-restart
> 设计仓: `/home/aris/Projects/quantalithos-design`
> 项目目录: `projects/L3-method-library`
> 正式文档目标: `projects/L3-method-library/01-架构设计.md`
> 项目级台账: `design-calibration/project_execution_ledger.md`
> 本轮口径: 基于 2026-06-15 新版 `00-需求文档.md` 重新讨论架构;旧 `01`、旧 `01_arch_step_*`、旧 `02_hld_*` 和旧 `03_ddd_*` 只作后置差异审计。

---

## 1. 文档级恢复点

| 当前 Step | 当前模块 | gate_status | gate_reason | next_allowed_action | source_files |
|---|---|---|---|---|---|
| `01-架构设计.md` completed | 正式文档装配完成 | pass | Step 16 已完成,正式 `01-架构设计.md` 已按 Step 1~15 结论装配并停审。 | 可进入 `02-概要设计.md` full-restart;启动前必须先建立 02 的文档级 flow 和项目级恢复点。 | `01_arch_step_01_requirement_baseline.md`~`01_arch_step_16_formal_document_assembly.md`;`projects/L3-method-library/01-架构设计.md` |

---

## 2. 执行纪律

本流程只负责 `L3-method-library` 的 `01-架构设计`。执行时必须按架构 SOP 一个 Step 一个 Step 推进。

固定纪律:

- 每个 Step 先列必读文档。
- 每个 Step 先搭整体模块,再逐模块先思考、后写入。
- 每个模块必须包含问题回答、诊断、取舍、结构化中间产物或回填草稿中对应内容。
- 旧 `01-架构设计.md`、旧 `01_arch_step_*`、历史 `02_hld_*` 和历史 `03_ddd_*` 只能在当前 Step 独立结论形成后做差异审计。
- 未到达的 Step 只保留在本文总计划中,不得提前创建、替换、清空或写入未来 Step 文件。
- 正式 `01-架构设计.md` 每章必须能追溯到具体 `01_arch_step_*` 中间产物。
- 架构阶段不得写数据库表、Rust struct、repository、port、handler、事务流程、协议 schema、事件 payload、代码目录或测试脚本。
- 单次写入以 100~300 行为宜;该限制只约束单次 patch / 写入批次,不限制 Step 文件、章节、表格或正式文档最终长度。

---

## 3. 公共必读文档

| 文档 | 用途 | 状态 |
|---|---|---|
| `standards/document/架构设计讨论流程_SOP.md` | 架构 Step 顺序、Step 内小阶段、架构单元小循环和恢复门禁。 | read |
| `standards/document/架构设计书写规范.md` | 正式架构文档章节结构、图表规则和校准来源格式。 | read |
| `standards/document/设计文档讨论中间产物规范.md` | 三层台账、三层门禁、模块级先思考后写入、长文档分批纪律。 | read |
| `standards/document/设计文档编写通则.md` | 设计文档通用边界和表达原则。 | read |
| `standards/document/设计真相源闭环与可落码性标准.md` | 防止架构结论诱发后续 schema / port / 状态 / 边界缺口。 | read |
| `standards/document/全局项目依赖关系与裁剪规则.md` | Step 7 依赖方向与跨仓依赖裁剪输入。 | read |

---

## 4. 本仓权威输入

| 文档 | 用途 | 状态 |
|---|---|---|
| `projects/L3-method-library/00-需求文档.md` | 本轮架构设计第一权威输入。 | read |
| `projects/L3-method-library/design-calibration/00_requirements_calibration_flow.md` | 确认 00 需求 Step 1~17 已完成。 | read |
| `projects/L3-method-library/design-calibration/00_req_step_01_upstream_relation.md` | Step 1 来源承接和上游关系输入。 | read |
| `projects/L3-method-library/design-calibration/00_req_step_02_position_boundary.md` | 仓定位、边界和职责输入。 | read |
| `projects/L3-method-library/design-calibration/00_req_step_06_consumers_dependencies.md` | 使用方、依赖方向和上下游输入。 | read |
| `projects/L3-method-library/design-calibration/00_req_step_07_core_capability_loop.md` | 核心能力闭环和架构主线输入。 | read |
| `projects/L3-method-library/design-calibration/00_req_step_09_functional_requirements.md` | 功能能力输入,用于推导后续容器和交互边界。 | read |
| `projects/L3-method-library/design-calibration/00_req_step_10_business_rules_boundaries.md` | 业务规则、边界红线和架构硬约束输入。 | read |
| `projects/L3-method-library/design-calibration/00_req_step_11_data_ownership.md` | 数据所有权和一致性策略输入。 | read |
| `projects/L3-method-library/design-calibration/00_req_step_12_interfaces_dependencies.md` | 能力接口和依赖边界输入。 | read |
| `projects/L3-method-library/design-calibration/00_req_step_13_non_functional_requirements.md` | NFR、横切关注点和技术选型约束输入。 | read |
| `projects/L3-method-library/design-calibration/00_req_step_15_risks_open_questions.md` | 架构风险和待确认事项输入。 | read |
| `projects/L3-method-library/design-calibration/00_req_step_16_traceability_matrix.md` | 需求追溯和孤儿项检查输入。 | read |
| `projects/L3-method-library/design-calibration/00_req_step_17_formal_document_assembly.md` | 正式 00 装配口径输入。 | read |

---

## 5. Step 总任务表

| Step | 输出文件 | 主题 | 状态 | gate_status | next_allowed_action | 完成门禁 |
|---:|---|---|---|---|---|---|
| 1 | `01_arch_step_01_requirement_baseline.md` | 确认需求基线 | completed | pass | 已完成,允许进入 Step 2。 | 架构需求基线、硬约束、未关闭需求风险三类分清。 |
| 2 | `01_arch_step_02_goals_constraints.md` | 明确架构目标与约束 | completed | pass | 已完成,允许进入 Step 3。 | 目标、约束、取舍、非目标均可追溯到需求。 |
| 3 | `01_arch_step_03_responsibility_boundary.md` | 职责边界 | completed | pass | 已完成,允许进入 Step 4。 | 做 / 不做 / 易混淆 / 红线闭合。 |
| 4 | `01_arch_step_04_system_context.md` | 系统边界与上下文 | completed | pass | 已完成,允许进入 Step 5。 | 上下文图、上下游表、边界说明闭合。 |
| 5 | `01_arch_step_05_bounded_context_subdomains.md` | 限界上下文与子域划分 | completed | pass | 已完成,允许进入 Step 6。 | 架构单元逐个停审,跨上下文语义边界审计完成。 |
| 6 | `01_arch_step_06_container_deployment.md` | 容器 / 部署架构 | completed | pass | 已完成,允许进入 Step 7。 | 运行单元图和说明不下沉到目录、handler 或部署脚本。 |
| 7 | `01_arch_step_07_dependency_direction.md` | 依赖方向与层间约束 | completed | pass | 已完成,允许进入 Step 8。 | 依赖裁剪表、类型分类表、禁止依赖表和 ASCII 图完成。 |
| 8 | `01_arch_step_08_data_ownership_consistency.md` | 数据所有权与一致性策略 | completed | pass | 已完成,允许进入 Step 9。 | truth / snapshot / projection / ref / forbidden body 和一致性口径闭合。 |
| 9 | `01_arch_step_09_interactions_communication.md` | 关键交互与通信方式 | completed | pass | 已完成,允许进入 Step 10。 | 每类交互有通信方式和失败口径,不写协议 schema。 |
| 10 | `01_arch_step_10_technology_choices.md` | 关键技术选型 | completed | pass | 已完成,允许进入 Step 11。 | 选型有约束来源和反向影响,不写 crate / adapter 细节。 |
| 11 | `01_arch_step_11_alternatives_tradeoffs.md` | 备选方案与取舍 | completed | pass | 已完成,允许进入 Step 12。 | 每个取舍有选择、放弃原因、代价和后续承接。 |
| 12 | `01_arch_step_12_cross_cutting_concerns.md` | 横切关注点 | completed | pass | 已完成,允许进入 Step 13。 | 按架构单元判断适用性,无模板化空话。 |
| 13 | `01_arch_step_13_evolution_path.md` | 演进路线 | completed | pass | 已完成,允许进入 Step 14。 | 阶段演进不破坏 truth / dependency / data 边界。 |
| 14 | `01_arch_step_14_risks_open_questions.md` | 风险与待确认事项 | completed | pass | 已完成,允许进入 Step 15。 | 风险、待确认、当前处理口径分清。 |
| 15 | `01_arch_step_15_adr_traceability.md` | ADR 与需求追溯 | completed | pass | 已完成,允许进入 Step 16。 | ADR 索引、追溯矩阵、孤儿项审计完成。 |
| 16 | `01_arch_step_16_formal_document_assembly.md` | 整理正式文档 | completed | pass | 已完成,允许 `01-架构设计.md` 作为后续 `02-概要设计.md` 输入。 | 正式每章有具体校准来源,正文未新增未确认结论。 |

---

## 6. 旧材料处理状态

| 材料 | 当前状态 | 使用规则 |
|---|---|---|
| `projects/L3-method-library/01-架构设计.md` | completed_current_truth | 已按本轮 Step 1~16 完成装配,可作为 `02-概要设计.md` 输入。 |
| `projects/L3-method-library/design-calibration/01_arch_step_*` | completed_current_truth | Step 1~16 已逐步重写完成,作为正式架构结论的校准来源。 |
| `projects/L3-method-library/02~07` | historical_material | 只用于后置反向污染检查。 |
| `projects/L3-method-library/design-calibration/02_hld_*` | historical_material | 按需审计;不得反推架构。 |
| `projects/L3-method-library/design-calibration/03_ddd_*` | historical_material | 按需审计;不得反推架构。 |

---

## 7. 文档级 blocker 台账

| Blocker ID | Step | 状态 | 描述 | 处理口径 |
|---|---|---|---|---|
| none | not_applicable | not_applicable | 当前未发现 blocker。 | `01-架构设计.md` 已完成;下一步进入 `02-概要设计.md` 开工门禁。 |
