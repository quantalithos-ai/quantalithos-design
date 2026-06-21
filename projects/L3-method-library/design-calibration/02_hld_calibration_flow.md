# L3-method-library 02 概要设计全量重启校准流程

> 创建日期: 2026-06-15
> 状态: completed
> 当前模式: full-restart
> 设计仓: `/home/aris/Projects/quantalithos-design`
> 项目目录: `projects/L3-method-library`
> 正式文档目标: `projects/L3-method-library/02-概要设计.md`
> 项目级台账: `design-calibration/project_execution_ledger.md`
> 本轮口径: 基于 2026-06-15 新版 `00-需求文档.md` 和 `01-架构设计.md` 重新讨论概要设计;旧 `02-概要设计.md`、旧 `02_hld_step_*`、历史 `03_ddd_*` 只作后置差异审计。

---

## 1. 文档级恢复点

| 当前 Step | 当前模块 | gate_status | gate_reason | next_allowed_action | source_files |
|---|---|---|---|---|---|
| 02 概要设计 | `completed` | pass | Step 14 主控 `R1.17` 已记录正式 `02-概要设计.md` 装配完成;§1~§14 来源追溯完整,`ML-S14-GAP-001` 已 resolved。 | 等待用户确认后启动 `03-详细设计` 讨论;不得自动生成 03 内容。 | `02_hld_step_14_formal_document_assembly.md#R1.17`;正式 `02-概要设计.md`;`project_execution_ledger.md` |

---

## 2. 执行纪律

本流程只负责 `L3-method-library` 的 `02-概要设计`。执行时必须按概要 SOP 一个 Step 一个 Step 推进。

固定纪律:

- 每个 Step 先列必读文档。
- 每个 Step 先搭整体模块,再逐模块先思考、后写入。
- 每个模块必须包含问题回答、诊断、取舍、结构化中间产物或回填草稿中对应内容。
- Step 5~9 必须按主要组成部分做小循环,不能一次性生成全仓对象、接口、处理流和状态总表。
- 旧 `02-概要设计.md`、旧 `02_hld_step_*`、历史 `03_ddd_*` 只能在当前 Step 独立结论形成后做差异审计。
- 未到达的 Step 只保留在本文总计划中,不得提前创建、替换、清空或写入未来 Step 文件。
- 正式 `02-概要设计.md` 每章必须能追溯到具体 `02_hld_step_*` 中间产物。
- 概要阶段不得写代码目录、完整字段全集、完整函数签名、函数实现、DDL、协议 schema、部署参数或运维细节。
- 单次写入以 100~300 行为宜;该限制只约束单次 patch / 写入批次,不限制 Step 文件、章节、表格或正式文档最终长度。

---

## 3. 公共必读文档

| 文档 | 用途 | 状态 |
|---|---|---|
| `standards/document/概要设计讨论流程_SOP.md` | 概要 Step 顺序、Step 内小阶段、Step 5~9 主要组成部分小循环和恢复门禁。 | read |
| `standards/document/概要设计书写规范.md` | 正式概要文档章节主链、图表规则、校准来源格式和禁止下沉内容。 | read |
| `standards/document/设计文档讨论中间产物规范.md` | 三层台账、三层门禁、模块级先思考后写入、长文档分批纪律。 | pending |
| `standards/document/设计文档编写通则.md` | 设计文档通用边界和表达原则。 | pending |
| `standards/document/设计真相源闭环与可落码性标准.md` | 防止概要结论诱发后续 schema / port / 状态 / 边界缺口。 | pending |
| `standards/document/全局项目依赖关系与裁剪规则.md` | 依赖方向、运行期协作、事件协作和跨仓裁剪输入。 | pending |

---

## 4. 本仓权威输入

| 文档 | 用途 | 状态 |
|---|---|---|
| `projects/L3-method-library/00-需求文档.md` | 本轮概要设计第一需求基线。 | read |
| `projects/L3-method-library/design-calibration/00_requirements_calibration_flow.md` | 确认 00 需求 Step 1~17 已完成。 | read |
| `projects/L3-method-library/design-calibration/00_req_step_01_upstream_relation.md` | 上游来源和承接口径输入。 | pending |
| `projects/L3-method-library/design-calibration/00_req_step_02_position_boundary.md` | 仓定位、边界和不做事项输入。 | pending |
| `projects/L3-method-library/design-calibration/00_req_step_07_core_capability_loop.md` | 核心能力闭环输入。 | pending |
| `projects/L3-method-library/design-calibration/00_req_step_09_functional_requirements.md` | 功能需求和能力口径输入。 | pending |
| `projects/L3-method-library/design-calibration/00_req_step_10_business_rules_boundaries.md` | 业务规则、边界红线和非范围输入。 | pending |
| `projects/L3-method-library/design-calibration/00_req_step_11_data_ownership.md` | 数据所有权和一致性输入。 | pending |
| `projects/L3-method-library/design-calibration/00_req_step_12_interfaces_dependencies.md` | 接口、上下游和依赖边界输入。 | pending |
| `projects/L3-method-library/design-calibration/00_req_step_16_traceability_matrix.md` | 需求追溯和孤儿项检查输入。 | pending |
| `projects/L3-method-library/01-架构设计.md` | 本轮概要设计第一架构基线。 | read |
| `projects/L3-method-library/design-calibration/01_architecture_calibration_flow.md` | 确认 01 架构 Step 1~16 已完成。 | read |
| `projects/L3-method-library/design-calibration/01_arch_step_03_responsibility_boundary.md` | 职责边界输入。 | pending |
| `projects/L3-method-library/design-calibration/01_arch_step_04_system_context.md` | 系统上下文和上下游输入。 | pending |
| `projects/L3-method-library/design-calibration/01_arch_step_05_bounded_context_subdomains.md` | 限界上下文和子域输入。 | pending |
| `projects/L3-method-library/design-calibration/01_arch_step_07_dependency_direction.md` | 依赖方向和层间约束输入。 | pending |
| `projects/L3-method-library/design-calibration/01_arch_step_08_data_ownership_consistency.md` | truth / projection / reference / consistency 架构输入。 | pending |
| `projects/L3-method-library/design-calibration/01_arch_step_09_interactions_communication.md` | 关键交互和通信方式输入。 | pending |
| `projects/L3-method-library/design-calibration/01_arch_step_12_cross_cutting_concerns.md` | 横切关注点输入。 | pending |
| `projects/L3-method-library/design-calibration/01_arch_step_14_risks_open_questions.md` | 架构风险和待确认事项输入。 | pending |
| `projects/L3-method-library/design-calibration/01_arch_step_16_formal_document_assembly.md` | 正式 01 装配口径输入。 | pending |

---

## 5. Step 总任务表

| Step | 输出文件 | 主题 | 状态 | gate_status | next_allowed_action | 完成门禁 |
|---:|---|---|---|---|---|---|
| 1 | `02_hld_step_01_upstream_boundary.md` | 确认上游输入边界 | completed | pass | 已完成。 | 已明确概要设计承接哪些需求与架构结论,以及本文不再回答 / 必须回答什么。 |
| 2 | `02_hld_step_02_scope.md` | 明确本仓设计目标与当前范围 | completed | pass | 已完成。 | 已明确本次概要设计目标、范围、非范围和设计深度。 |
| 3 | `02_hld_step_03_constraints.md` | 收稳约束条件 | completed | pass | 已完成。 | 约束能指导后续代码主体、对象、接口、处理流或状态机判断。 |
| 4 | `02_hld_step_04_code_subject_framework.md` | 代码主体框架映射 | completed | pass | 已完成。 | 架构模块到代码主体、实现分层和关键判断闭合。 |
| 5 | `02_hld_step_05_components_boundary.md` | 主要组成部分、职责与边界 | rewritten_completed | pass | 已完成;正式 §5 已回填。 | 新 Step 5 已支撑 Step 6 对象、Step 7 接口、Step 8 流程、Step 9 状态来源的反查入口。 |
| 6 | `02_hld_step_06_key_objects.md` | 关键对象轮廓 | completed | pass | 已完成;正式 §6 已回填并完成回填后检查。 | `8.45` 已关闭 Step 6;正式 §6 resolved_for_current_step。 |
| 7 | `02_hld_step_07_api_interface_skeleton.md` | API / 接口骨架 | completed_formal_backfilled | pass | 已完成;正式 §7 已按 `R1.42` 回填并由 `R1.45` 记录。 | `R1.45` 已关闭 Step 7;正式 §7 resolved_for_current_step。 |
| 8 | `02_hld_step_08_processing_flows.md` | 关键处理流 / 重要函数数据流 | completed_formal_backfilled | pass | 已完成;正式 §8 已按 `R1.30` 回填并由 `R1.33` 记录。 | `R1.33` 已关闭 Step 8;正式 §8 resolved_for_current_step。 |
| 9 | `02_hld_step_09_state_machine.md` | 状态机与状态流转 | completed_formal_backfilled | pass | 已完成;正式 §9 已按 `R1.31` 回填并完成回填后检查。 | `R1.31` 已关闭 Step 9;正式 §9 resolved_for_current_step。 |
| 10 | `02_hld_step_10_exceptions_boundaries.md` | 异常与边界场景轮廓 | completed_formal_backfilled | pass | 已完成;正式 §10 已按 `R1.24` 回填并由 `R1.27` 记录。 | `R1.27` 已关闭 Step 10;正式 §10 resolved_for_current_step。 |
| 11 | `02_hld_step_11_configuration_impact.md` | 配置影响轮廓 | completed_formal_backfilled | pass | 已完成;正式 `§11` 已按 `R1.25` 回填。 | `R1.25` 已关闭 Step 11;正式 `§11` resolved_for_current_step。 |
| 12 | `02_hld_step_12_detailed_design_handoff.md` | 详细设计承接清单 | completed_formal_backfilled | pass | 已完成;正式 `§12` 已按 `R1.23` 回填。 | `R1.23` 已关闭 Step 12;正式 `§12` resolved_for_current_step。 |
| 13 | `02_hld_step_13_risks_open_questions.md` | 设计风险与待确认事项 | completed_formal_backfilled | pass | 已完成;正式 §13 已按 `R1.18` 回填并由 `R1.21` 记录。 | `R1.21` 已关闭 Step 13;正式 §13 resolved_for_current_step。 |
| 14 | `02_hld_step_14_formal_document_assembly.md` | 整理正式概要设计文档 | completed | pass | 已完成。 | `R1.17` 已记录正式 02 装配完成。 |

---

## 6. 旧材料处理状态

| 材料 | 当前状态 | 使用规则 |
|---|---|---|
| `projects/L3-method-library/02-概要设计.md` | current_for_§1_to_§13_with_historical_step14 | §1~§13 已按本轮回填;§14 继续按当前流程逐步重审。 |
| `projects/L3-method-library/design-calibration/02_hld_step_*` | historical_material | 到达对应 Step 时才允许重写;不得视为本轮已完成。 |
| `projects/L3-method-library/03~07` | historical_material | 只用于后置反向污染检查。 |
| `projects/L3-method-library/design-calibration/03_ddd_*` | historical_material | 按需审计;不得反推概要。 |

---

## 7. 文档级 blocker 台账

| Blocker ID | Step | 状态 | 描述 | 处理口径 |
|---|---|---|---|---|
| ML-S5-GAP-001 | Step 5 / flow / 台账 | resolved | flow 和项目台账曾指向 Step 12,但当前裁决要求回退 Step 5 rewrite。 | Step 5 已完成并切到 Step 6 recheck 入口。 |
| ML-S5-GAP-002 | 正式 `02-概要设计.md` §8~§9 | resolved | 正式 §8 和 §9 已按本轮回填。 | Step 10 起必须以当前正式 §5~§9 和对应中间产物为第一来源。 |
| ML-S5-GAP-003 | Step 9 状态机 | resolved | Step 9 当前中间产物和正式 §9 已完成重写、停审和回填。 | Step 10 只能承接当前状态组与传播红线,不得回流旧状态主线。 |
| ML-S14-GAP-001 | Step 14 / 正式 §2~§4 | resolved | 正式 `02-概要设计.md` §2、§3、§4 缺 `延伸阅读` 块,导致 `R1.16` 自检未通过;`R1.16b` 已执行三处最小补丁,`R1.16c` 复检通过,`R1.16d` 已关闭。 | 无后续动作。 |
