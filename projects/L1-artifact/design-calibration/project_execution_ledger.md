# L1-artifact 项目设计讨论执行台账

> 创建日期: 2026-06-29
> 当前任务: 正式 `00-需求文档.md`、`01-架构设计.md`、`02-概要设计.md`、`03-详细设计.md`、`04-配置设计.md`、`05-测试方案.md`、`06-验收标准.md` 与 `07-实施计划.md` 已形成当前设计基线;`07-实施计划.md` Step 13 `整理正式实施计划文档` 已完成,implementation ledger 与全部 planned boundary skeleton 已创建,等待用户审查。
> 项目目录: `projects/L1-artifact`

---

## 1. 当前恢复点

| 当前文档 | 当前 Step | 当前模块 | gate_status | gate_reason | next_allowed_action | 细节入口 |
|---|---|---|---|---|---|---|
| `07-实施计划.md` | Step 13 | `整理正式实施计划文档:completed_wait_user_review` | pass | Step 12 已经用户确认并进入 Step 13;已创建 `07_implementation_plan_step_13_formal_document_assembly.md`、正式 `projects/L1-artifact/07-实施计划.md`、项目级 `implementation_execution_ledger.md` 和 `commit-01-a`~`commit-08-b` 全部 boundary skeleton。 | 等待用户审查正式 `07-实施计划.md`、implementation ledger 和 boundary skeleton;通过后按用户要求提交或移交实现。 | `design-calibration/07_implementation_plan_calibration_flow.md`;`design-calibration/07_implementation_plan_step_13_formal_document_assembly.md`;`projects/L1-artifact/07-实施计划.md`;`projects/L1-artifact/design-calibration/implementation_execution_ledger.md`;`projects/L1-artifact/design-calibration/implementation-boundaries/commit-01-a.md`;`projects/L1-artifact/00-需求文档.md`;`projects/L1-artifact/01-架构设计.md`;`projects/L1-artifact/02-概要设计.md`;`projects/L1-artifact/03-详细设计.md`;`projects/L1-artifact/04-配置设计.md`;`projects/L1-artifact/05-测试方案.md`;`projects/L1-artifact/06-验收标准.md`;`standards/document/实施计划讨论流程_SOP.md`;`standards/document/实施计划书写规范.md`;`standards/document/设计文档讨论中间产物规范.md`;`standards/document/设计真相源闭环与可落码性标准.md`;`standards/document/代码实施台账与门禁规范.md` |

---

## 2. 文档级进度

| 文档 | flow 文件 | 状态 | 当前 Step | 文档切换门禁 | blocker |
|---|---|---|---|---|---|
| `00-需求文档.md` | `design-calibration/00_requirements_calibration_flow.md` | done | Step 17 | completed | Step 17 `自检与停审` 已完成,正式 `00-需求文档.md` full-restart 完成。 |
| `01-架构设计.md` | `design-calibration/01_architecture_calibration_flow.md` | done | Step 16 | completed | Step 16 `整理正式文档` 已完成;正式 01 已重建并已作为 02 的当前架构基线生效。 |
| `02-概要设计.md` | `design-calibration/02_hld_calibration_flow.md` | done | Step 14 | completed | Step 14 `整理正式概要设计文档` 已完成;正式 `02-概要设计.md` full-restart 完成。 |
| `03-详细设计.md` | `design-calibration/03_ddd_calibration_flow.md` | done | Step 19 | completed | Step 19 `整理正式详细设计文档` 已完成;正式 `03-详细设计.md` 已作为 `04/05` 当前直接基线。 |
| `04-配置设计.md` | `design-calibration/04_config_calibration_flow.md` | done | Step 15 | completed | Step 15 `整理正式配置设计文档` 已完成;正式 `04-配置设计.md` 已装配,包含 15 章主链、配置项总表、模块 demo、完整 JSONC 示例和下游承接口径,现为 `05` 当前直接配置基线。 | `design-calibration/04_config_calibration_flow.md`;`design-calibration/04_config_step_01_upstream_boundary.md`;`design-calibration/04_config_step_02_scope.md`;`design-calibration/04_config_step_03_control_plane.md`;`design-calibration/04_config_step_04_categories_boundaries.md`;`design-calibration/04_config_step_05_sources_priority_conflicts.md`;`design-calibration/04_config_step_06_environment_profiles_matrix.md`;`design-calibration/04_config_step_07_config_items.md`;`design-calibration/04_config_step_08_sensitive_secrets.md`;`design-calibration/04_config_step_09_loading_validation_activation.md`;`design-calibration/04_config_step_10_change_audit_rollback.md`;`design-calibration/04_config_step_11_failure_degradation.md`;`design-calibration/04_config_step_12_downstream_handoff.md`;`design-calibration/04_config_step_13_migration_deprecation_evolution.md`;`design-calibration/04_config_step_14_risks_open_questions.md`;`design-calibration/04_config_step_15_formal_document_assembly.md`;`projects/L1-artifact/04-配置设计.md`;`projects/L1-artifact/00-需求文档.md`;`projects/L1-artifact/01-架构设计.md`;`projects/L1-artifact/02-概要设计.md`;`projects/L1-artifact/03-详细设计.md`;`projects/L1-artifact/05-测试方案.md`;`projects/L1-artifact/06-验收标准.md` |
| `05-测试方案.md` | `design-calibration/05_test_plan_calibration_flow.md` | done | Step 15 | completed | Step 15 `整理正式测试方案文档` 已完成;正式 `05-测试方案.md` 已装配,保留 candidate evidence、直引 `14.1~14.5` / `VF-ART-*`、四个 P0 profile、relay facade 独立口径和测试/证据边界,现为 `06` 当前直接测试基线。 | `design-calibration/05_test_plan_calibration_flow.md`;`design-calibration/05_test_plan_step_01_input_boundary.md`;`design-calibration/05_test_plan_step_02_scope.md`;`design-calibration/05_test_plan_step_03_test_objects_cuts.md`;`design-calibration/05_test_plan_step_04_strategy_layers.md`;`design-calibration/05_test_plan_step_05_traceability_coverage.md`;`design-calibration/05_test_plan_step_06_cases.md`;`design-calibration/05_test_plan_step_07_test_data.md`;`design-calibration/05_test_plan_step_08_environment_config.md`;`design-calibration/05_test_plan_step_09_automation_gates.md`;`design-calibration/05_test_plan_step_10_nonfunctional.md`;`design-calibration/05_test_plan_step_11_defects_retest.md`;`design-calibration/05_test_plan_step_12_entry_exit.md`;`design-calibration/05_test_plan_step_13_evidence.md`;`design-calibration/05_test_plan_step_14_regression_risks.md`;`design-calibration/05_test_plan_step_15_formal_document_assembly.md`;`projects/L1-artifact/05-测试方案.md`;`projects/L1-artifact/06-验收标准.md`;`projects/L1-artifact/03-详细设计.md`;`projects/L1-artifact/04-配置设计.md` |
| `06-验收标准.md` | `design-calibration/06_acceptance_calibration_flow.md` | done | Step 15 | completed_user_review_passed | Step 15 `整理正式验收标准文档` 已完成;正式 `06-验收标准.md` 已装配并经用户审查通过。 | `design-calibration/06_acceptance_calibration_flow.md`;`design-calibration/06_acceptance_step_01_input_boundary.md`;`design-calibration/06_acceptance_step_02_scope.md`;`design-calibration/06_acceptance_step_03_baseline.md`;`design-calibration/06_acceptance_step_04_entry_exit.md`;`design-calibration/06_acceptance_step_05_function_gate.md`;`design-calibration/06_acceptance_step_06_data_arch_redlines.md`;`design-calibration/06_acceptance_step_07_interfaces_events_sync.md`;`design-calibration/06_acceptance_step_08_state_tx_consistency.md`;`design-calibration/06_acceptance_step_09_nonfunctional.md`;`design-calibration/06_acceptance_step_10_observability_evidence.md`;`design-calibration/06_acceptance_step_11_veto.md`;`design-calibration/06_acceptance_step_12_defects_retest_release.md`;`design-calibration/06_acceptance_step_13_risk_acceptance.md`;`design-calibration/06_acceptance_step_14_final_decision_signoff.md`;`design-calibration/06_acceptance_step_15_formal_document_assembly.md`;`projects/L1-artifact/00-需求文档.md`;`projects/L1-artifact/01-架构设计.md`;`projects/L1-artifact/02-概要设计.md`;`projects/L1-artifact/03-详细设计.md`;`projects/L1-artifact/04-配置设计.md`;`projects/L1-artifact/05-测试方案.md`;`projects/L1-artifact/06-验收标准.md` |
| `07-实施计划.md` | `design-calibration/07_implementation_plan_calibration_flow.md` | active | Step 13 | completed_wait_user_review | Step 13 `整理正式实施计划文档` 已完成;正式 `07`、implementation ledger 和全部 boundary skeleton 已创建,等待用户审查。 | `design-calibration/07_implementation_plan_calibration_flow.md`;`design-calibration/07_implementation_plan_step_01_input_boundary.md`;`design-calibration/07_implementation_plan_step_02_scope.md`;`design-calibration/07_implementation_plan_step_03_prerequisites_reading.md`;`design-calibration/07_implementation_plan_step_04_objects_deliverables.md`;`design-calibration/07_implementation_plan_step_05_phases_dependencies.md`;`design-calibration/07_implementation_plan_step_06_tasks_commit_boundaries.md`;`design-calibration/07_implementation_plan_step_07_test_acceptance_gates.md`;`design-calibration/07_implementation_plan_step_08_config_environment_dependencies.md`;`design-calibration/07_implementation_plan_step_09_spikes_risks_open_questions.md`;`design-calibration/07_implementation_plan_step_10_rollback_pause_change_control.md`;`design-calibration/07_implementation_plan_step_11_commit_review_delivery.md`;`design-calibration/07_implementation_plan_step_12_completion_criteria.md`;`design-calibration/07_implementation_plan_step_13_formal_document_assembly.md`;`projects/L1-artifact/07-实施计划.md`;`projects/L1-artifact/design-calibration/implementation_execution_ledger.md`;`projects/L1-artifact/design-calibration/implementation-boundaries/commit-01-a.md`;`projects/L1-artifact/00-需求文档.md`;`projects/L1-artifact/01-架构设计.md`;`projects/L1-artifact/02-概要设计.md`;`projects/L1-artifact/03-详细设计.md`;`projects/L1-artifact/04-配置设计.md`;`projects/L1-artifact/05-测试方案.md`;`projects/L1-artifact/06-验收标准.md`;`standards/document/实施计划讨论流程_SOP.md`;`standards/document/实施计划书写规范.md`;`standards/document/代码实施台账与门禁规范.md` |

---

## 3. 当前 full-restart 执行规则

| 规则 | 状态 | 说明 |
|---|---|---|
| 正式 `00-需求文档.md` 作为当前需求基线 | active | 当前架构与后续文档必须直接承接本轮重建后的正式 00。 |
| 旧 `02/03/05/06` 不反推当前结论 | active | 后续只用于反向污染检查或依赖线索,不能提前定义需求或架构。 |
| `07` 按实施计划 SOP 逐 Step 生成 | active | 当前 `07-实施计划.md` Step 13 已完成;正式 `07`、implementation ledger 和全部 boundary skeleton 已创建,等待用户审查。 |
| 每个 Step 先列必读文档 | active | 必读文档摘要必须写入当前 Step 文件。 |
| 每个 Step 先搭整体模块,再逐模块先思考后写入 | active | 模块思考和写入记录在当前 Step 文件内。 |
| 每次用户确认只推进一个当前模块或一份新文档 | active | 不自动跨 Step,也不自动从 06 跳到 07。 |
| 单次写入批次不等于文件长度上限 | active | 100~300 行只约束单次 patch / 写入批次。 |

---

## 4. 正式 / 历史材料处理台账

| 材料 | 当前定位 | 处理口径 |
|---|---|---|
| `projects/L1-artifact/README.md` | historical_material | 可作定位线索;不得继承目录结构、技术栈或实现口径。 |
| `projects/L1-artifact/00-需求文档.md` | current_baseline | 当前直接需求基线。 |
| `projects/L1-artifact/01-架构设计.md` | current_formal_result | 本轮已按 Step 1~16 结论重建为当前正式架构文档。 |
| `projects/L1-artifact/02-概要设计.md` | current_formal_result | 已按 Step 1~14 full-restart 重建完成,现为当前正式概要设计基线。 |
| `projects/L1-artifact/03-详细设计.md` | current_formal_result | 已按 Step 1~19 full-restart 重建完成,现为当前正式详细设计基线。 |
| `projects/L1-artifact/04-配置设计.md` | current_formal_result | 已按 Step 1~15 full-restart 重建完成,现为当前正式配置设计基线。 |
| `projects/L1-artifact/05-测试方案.md` | current_formal_result | 已按 Step 1~15 full-restart 重建完成,现为当前正式测试方案基线。 |
| `projects/L1-artifact/06-验收标准.md` | current_formal_result | 已按验收标准 SOP Step 1~15 full-restart 重建完成,现为当前正式验收标准基线。 |
| `projects/L1-artifact/07-实施计划.md` | current_formal_result | 已按实施计划 SOP Step 1~13 装配完成,包含正式实施计划、项目级 implementation ledger 和 `commit-01-a`~`commit-08-b` boundary skeleton,等待用户审查。 |

---

## 5. 全局 blocker 台账

| Blocker ID | 位置 | 状态 | 描述 | 处理口径 |
|---|---|---|---|---|
| ART-BOOT-001 | `design-calibration/` | resolved | L1-artifact 缺设计讨论台账和需求 flow。 | 本文件、`00_requirements_calibration_flow.md` 和 Step 1 文件已创建。 |
| ART-ARCH-BOOT-001 | `design-calibration/01_architecture_calibration_flow.md` | resolved | L1-artifact 缺 01 架构校准 flow。 | 已创建架构 flow 和 Step 1 中间产物。 |
| ART-DOC-GAP-001 | `projects/L1-artifact/07-实施计划.md` | resolved_wait_review | 当前正式 `07-实施计划.md` 尚未建立。 | Step 13 已创建正式 `07`、implementation ledger 和全部 boundary skeleton,等待用户审查。 |

---

## 6. 恢复顺序

任意后续 agent 收到“继续 / 同意 / 开始下一步”时,必须按以下顺序恢复:

```text
1. 读取本文件 `project_execution_ledger.md`
2. 读取 `design-calibration/07_implementation_plan_calibration_flow.md`
3. 读取当前 Step 文件 `design-calibration/07_implementation_plan_step_13_formal_document_assembly.md`
4. 读取 `standards/document/实施计划讨论流程_SOP.md`
5. 读取 `standards/document/实施计划书写规范.md`
6. 读取 `standards/document/代码实施台账与门禁规范.md`
7. 读取正式 `projects/L1-artifact/06-验收标准.md`
8. 读取 `design-calibration/06_acceptance_step_15_formal_document_assembly.md`
9. 读取正式 `projects/L1-artifact/05-测试方案.md`
10. 读取正式 `projects/L1-artifact/04-配置设计.md`
11. 读取正式 `projects/L1-artifact/03-详细设计.md`
12. 读取 `design-calibration/03_ddd_step_17_implementation_handoff.md`
13. 读取正式 `projects/L1-artifact/02-概要设计.md`
14. 读取正式 `projects/L1-artifact/00-需求文档.md`
15. 读取正式 `projects/L1-artifact/01-架构设计.md`
16. 确认当前 next_allowed_action
17. 当前 Step 13 已完成;审查正式 `07-实施计划.md`、implementation ledger 和全部 boundary skeleton
```

---

## 7. 当前 next_allowed_action

```text
`06-验收标准.md` 已完成 Step 15 并经用户审查通过;
当前已创建 `design-calibration/07_implementation_plan_calibration_flow.md`、`design-calibration/07_implementation_plan_step_01_input_boundary.md` 至 `design-calibration/07_implementation_plan_step_13_formal_document_assembly.md`;
正式 `projects/L1-artifact/07-实施计划.md` 已创建;
项目级 `projects/L1-artifact/design-calibration/implementation_execution_ledger.md` 已创建;
`projects/L1-artifact/design-calibration/implementation-boundaries/commit-01-a.md` 至 `commit-08-b.md` 全部 skeleton 已创建;
next_allowed_action = 等待用户审查 Step 13 正式装配结果;
用户确认后可按要求提交或把 `commit-01-a` 移交实现 agent;
后续不得发明真实 `run_id`、真实执行结论、`EV-ART-*` evidence alias、真实签署或静态 VETO passed;
后续必须承接 Step 6 已固定的 boundary gate matrix,从 implementation ledger 和当前 boundary ledger 恢复。
```
