# L1-artifact 01 架构设计全量重启校准流程

> 创建日期: 2026-07-03
> 状态: completed
> 当前模式: full-restart
> 设计仓: `/home/aris/Projects/quantalithos-design`
> 项目目录: `projects/L1-artifact`
> 正式文档目标: `projects/L1-artifact/01-架构设计.md`
> 项目级台账: `design-calibration/project_execution_ledger.md`
> 本轮口径: 新版 `00-需求文档.md` 是直接需求基线;旧 `01-架构设计.md` 只作历史材料和差异审计输入。

---

## 1. 文档级恢复点

| 当前 Step | 当前模块 | gate_status | gate_reason | next_allowed_action | source_files |
|---|---|---|---|---|---|
| Step 16 | `整理正式文档:completed` | pass | 正式 `projects/L1-artifact/01-架构设计.md` 已按 Step 1~15 结论重建,Step 16 装配审计已完成。 | 等待用户确认后启动 `02-概要设计.md` full-restart;不得自动创建 02 flow。 | `project_execution_ledger.md`;`01_arch_step_01_requirement_baseline.md`;`01_arch_step_02_goals_constraints.md`;`01_arch_step_03_responsibility_boundary.md`;`01_arch_step_04_system_context.md`;`01_arch_step_05_bounded_context_subdomains.md`;`01_arch_step_06_container_deployment.md`;`01_arch_step_07_dependency_direction.md`;`01_arch_step_08_data_ownership_consistency.md`;`01_arch_step_09_interactions_communication.md`;`01_arch_step_10_technology_choices.md`;`01_arch_step_11_alternatives_tradeoffs.md`;`01_arch_step_12_cross_cutting_concerns.md`;`01_arch_step_13_evolution_path.md`;`01_arch_step_14_risks_open_questions.md`;`01_arch_step_15_adr_traceability.md`;`01_arch_step_16_formal_document_assembly.md`;`projects/L1-artifact/00-需求文档.md`;`projects/L1-artifact/01-架构设计.md`;`standards/document/架构设计讨论流程_SOP.md`;`standards/document/架构设计书写规范.md`;`standards/document/全局项目依赖关系与裁剪规则.md` |

---

## 2. 执行纪律

本流程只负责 `L1-artifact` 的 `01-架构设计.md` full-restart。执行时必须按架构 SOP 一个 Step 一个 Step 推进。

固定纪律:

- 每次恢复先读取 `project_execution_ledger.md`,再读取本 flow,再读取当前 Step 文件。
- 正式 `01-架构设计.md` 只在 Step 16 `整理正式文档` 时重建。
- 旧 `01-架构设计.md` 只能在当前 Step 独立结论形成后做差异审计,不得作为新版架构真相源直接继承。
- flow 可以一次列出 Step 1~16,但不得提前创建 Step 2~16 的中间产物文件。
- 当前 Step 文件必须记录 Step 内计划、问题回答、旧材料诊断、取舍、结构化中间产物、回填草稿和自检。
- 每次用户确认只推进一个当前 Step;不得跨 Step 合并。
- 架构阶段不得写数据库表、Rust struct、repository、handler、DTO schema、事件 payload、测试用例或实施 commit boundary。
- 单次写入以 100~300 行为宜;该限制只约束单次 patch / 写入批次,不限制 Step 文件或正式文档最终长度。

---

## 3. 公共必读文档

| 文档 | 用途 | 状态 |
|---|---|---|
| `standards/document/架构设计讨论流程_SOP.md` | 架构 Step 顺序、Step 内问题、门禁和未来 Step 不得提前落盘规则。 | read |
| `standards/document/架构设计书写规范.md` | 正式架构文档章节结构、校准来源和图表规范。 | read |
| `standards/document/设计文档讨论中间产物规范.md` | 三层台账、Step 中间产物、分批写入和恢复规则。 | read |
| `projects/L1-artifact/00-需求文档.md` | 当前架构设计直接需求基线。 | read |
| `projects/L1-artifact/design-calibration/00_requirements_calibration_flow.md` | 需求阶段状态与 00 完成门禁。 | read |
| `projects/L1-artifact/design-calibration/00_req_step_*.md` | 需求基线、边界、依赖、数据、验收、风险和追溯来源。 | read_on_demand |
| `projects/L1-artifact/01-架构设计.md` | 当前正式架构结果;如需审计旧口径,只能参考本轮 Step 文件中的污染诊断记录。 | read_current_formal_result |
| `projects/README.md` | L1 项目清单和仓级定位线索。 | read_on_demand |
| `architecture/仓库拆分方案.md` | L1-artifact 全局仓级职责线索。 | read_on_demand |
| `standards/document/全局项目依赖关系与裁剪规则.md` | 后续 Step 7 依赖裁剪输入。 | read_on_demand |

---

## 4. Step 总任务表

| Step | 输出文件 | 主题 | 状态 | gate_status | next_allowed_action | 完成门禁 |
|---:|---|---|---|---|---|---|
| 1 | `01_arch_step_01_requirement_baseline.md` | 确认需求基线 | done | pass | 等待用户确认进入 Step 2。 | 已明确架构前提、硬约束和未关闭风险,足以支撑架构目标与约束讨论。 |
| 2 | `01_arch_step_02_goals_constraints.md` | 明确架构目标与约束 | done | pass | 等待用户确认进入 Step 3。 | 架构目标、不可变约束、可接受取舍和架构非目标已收敛。 |
| 3 | `01_arch_step_03_responsibility_boundary.md` | 职责边界 | done | pass | 等待用户确认进入 Step 4。 | 做 / 不做、易混淆职责和边界红线已收敛。 |
| 4 | `01_arch_step_04_system_context.md` | 系统边界与上下文 | done | pass | 等待用户确认进入 Step 5。 | 正式上下文图、输入面、输出面和边界说明已收敛。 |
| 5 | `01_arch_step_05_bounded_context_subdomains.md` | 限界上下文与子域划分 | done | pass | 等待用户确认进入 Step 6。 | 子域、上下文、投影 / 引用边界和统一语言已收敛。 |
| 6 | `01_arch_step_06_container_deployment.md` | 容器 / 部署架构 | done | pass | 等待用户确认进入 Step 7。 | 容器、部署职责和运行边界已收敛,未下沉到实施脚本。 |
| 7 | `01_arch_step_07_dependency_direction.md` | 依赖方向与层间约束 | done | pass | 等待用户确认进入 Step 8。 | 依赖裁剪表、分类表、禁止依赖表和裁剪图已收敛。 |
| 8 | `01_arch_step_08_data_ownership_consistency.md` | 数据所有权与一致性策略 | done | pass | 等待用户确认进入 Step 9。 | truth / snapshot / ref / forbidden body 和一致性策略已收敛。 |
| 9 | `01_arch_step_09_interactions_communication.md` | 关键交互与通信方式 | done | pass | 等待用户确认进入 Step 10。 | 关键交互、通信方式和失败语义已收敛,未写协议 schema。 |
| 10 | `01_arch_step_10_technology_choices.md` | 关键技术选型 | done | pass | 等待用户确认进入 Step 11。 | 技术选型、保留项和不选项已给出架构理由。 |
| 11 | `01_arch_step_11_alternatives_tradeoffs.md` | 备选方案与取舍 | done | pass | 等待用户确认进入 Step 12。 | 备选方案、取舍理由和弃用方案已收敛。 |
| 12 | `01_arch_step_12_cross_cutting_concerns.md` | 横切关注点 | done | pass | 等待用户确认进入 Step 13。 | 安全、审计、观测、配置、性能和降级边界已按本仓裁剪。 |
| 13 | `01_arch_step_13_evolution_path.md` | 演进路线 | done | pass | 等待用户确认进入 Step 14。 | 当前核心架构、外围增强和后续演进边界已收敛。 |
| 14 | `01_arch_step_14_risks_open_questions.md` | 风险与待确认事项 | done | pass | 等待用户确认进入 Step 15。 | 架构风险、待确认项和后续阻塞条件已明确。 |
| 15 | `01_arch_step_15_adr_traceability.md` | ADR 与需求追溯 | done | pass | 等待用户确认进入 Step 16。 | ADR 候选索引、需求追溯矩阵、漏项检查和架构决定停审已收敛。 |
| 16 | `01_arch_step_16_formal_document_assembly.md` | 整理正式文档 | done | pass | 等待用户确认是否启动 `02-概要设计.md` full-restart。 | 正式 `01-架构设计.md` 已按 Step 1~15 结论重建,无新增未确认结论。 |

---

## 5. 正式 / 旧材料处理状态

| 材料 | 当前状态 | 使用规则 |
|---|---|---|
| `projects/L1-artifact/00-需求文档.md` | current_baseline | 新版需求基线,架构设计直接承接。 |
| `projects/L1-artifact/design-calibration/00_req_step_*.md` | current_baseline_detail | 按需读取,用于解释正式 00 的来源和取舍。 |
| `projects/L1-artifact/01-架构设计.md` | current_formal_result | 本轮已按 Step 1~15 结论重建为当前正式架构文档。 |
| `projects/L1-artifact/02/03/05/06` | historical_material | 后续对应文档重启时再审计,不得反推当前架构。 |
| `projects/L1-artifact/04-配置设计.md` | missing | 后续进入配置设计时补齐。 |
| `projects/L1-artifact/07-实施计划.md` | missing | 后续进入实施计划时补齐。 |

---

## 6. 文档级 blocker 台账

| Blocker ID | Step | 状态 | 描述 | 处理口径 |
|---|---|---|---|---|
| ART-ARCH-BOOT-001 | Step 1 | resolved | L1-artifact 缺 01 架构校准 flow。 | 本文件已创建。 |
| ART-ARCH-DOC-GAP-001 | downstream | open | 正式 04 / 07 缺失。 | 记录为后续文档链缺口;不阻塞 01 Step 1。 |

---

## 7. 当前 next_allowed_action

```text
`01-架构设计.md` full-restart 已完成;
Step 16 `整理正式文档` 已完成,gate_status = pass;
正式 `projects/L1-artifact/01-架构设计.md` 已按 Step 1~15 结论重建;
next_allowed_action = 等待用户确认后启动 `02-概要设计.md` full-restart;
在用户确认前不得创建 `02-概要设计.md` flow 或提前进入后续文档。
```
