# L3-method-library 项目设计讨论执行台账

> 创建日期: 2026-06-15
> 最近更新: 2026-06-29
> 当前任务: `commit-01-a` implementation handoff 已关闭;当前推进到 `commit-01-b`,formal `04/07` 已闭合 `OQ-ML-003`,实现侧下一步必须从 `read_docs` 恢复并重跑当前 boundary Design Gate。
> 项目目录: `projects/L3-method-library`

---

## 1. 当前恢复点

| 当前文档 | 当前 Step | 当前模块 | gate_status | gate_reason | next_allowed_action | 细节入口 |
|---|---|---|---|---|---|---|
| `07-实施计划.md` | implementation boundary handoff | `commit-01-b read_docs recovery` | ready_for_design_gate | `commit-01-a` 已由实现仓提交 `1a7137f9adcefc76796c6e896a0ec4d15c2b4241` 关闭;formal `04/07` 已闭合 `OQ-ML-003`。 | 实现 agent 必须先重读 project ledger、current boundary ledger、formal `07` 和 required reads,然后重跑 `commit-01-b` Design Gate;通过前不得改实现仓代码。 | `design-calibration/implementation_execution_ledger.md`;`design-calibration/implementation-boundaries/commit-01-b.md`;`projects/L3-method-library/07-实施计划.md` |

---

## 2. 文档级进度

| 文档 | flow 文件 | 状态 | 当前 Step | 文档切换门禁 | blocker |
|---|---|---|---|---|---|
| `00-需求文档.md` | `design-calibration/00_requirements_calibration_flow.md` | completed | completed | pass | 已完成,可作为后续设计输入。 |
| `01-架构设计.md` | `design-calibration/01_architecture_calibration_flow.md` | completed | completed | pass | 已完成,可作为后续设计输入。 |
| `02-概要设计.md` | `design-calibration/02_hld_calibration_flow.md` | completed | completed | pass | 已完成,可作为后续设计输入。 |
| `03-详细设计.md` | `design-calibration/03_ddd_calibration_flow.md` | completed | completed | R19.26_completed_wait_user_confirm_to_04 | 正式 `03-详细设计.md` 可作为配置设计输入。 |
| `04-配置设计.md` | `design-calibration/04_config_calibration_flow.md` | completed | completed | R15.18_completed_wait_user_confirm_to_05 | 正式 `04-配置设计.md` 可作为测试方案输入。 |
| `05-测试方案.md` | `design-calibration/05_test_plan_calibration_flow.md` | completed | Step 15 completed | R15.2_completed_wait_user_confirm_to_06 | 正式 `05-测试方案.md` 已按 Step 1~14 完成 full-restart 装配,可作为 `06` 输入。 |
| `06-验收标准.md` | `design-calibration/06_acceptance_calibration_flow.md` | completed | Step 15 R15.2 completed_wait_user_confirm_to_07 | pass | 正式 `06-验收标准.md` 已按 Step 1~14 中间产物完成 full-restart 装配,可作为 `07` 输入。 |
| `07-实施计划.md` | `design-calibration/07_implementation_plan_calibration_flow.md` | implementation_handoff_active | Step 13 completed + `commit-01-b` read_docs recovery | ready_for_design_gate | 正式 `07-实施计划.md` 已完成 full-restart 装配;`commit-01-a` handoff 已关闭;formal `04/07` 已闭合 `OQ-ML-003`,当前等待实现侧重读台账并重跑 `commit-01-b` Design Gate。 |

---

## 3. 当前 full-restart 执行规则

| 规则 | 状态 | 说明 |
|---|---|---|
| 旧 `00-需求文档.md` 不作为本轮需求结论 | completed | 需求文档已在本轮重启中完成装配。 |
| 旧 `01-架构设计.md` 不作为本轮架构结论 | completed | 架构文档已按本轮重建完成。 |
| 旧 `02-概要设计.md` 不作为本轮概要结论 | completed | 概要文档已按本轮重建完成。 |
| 旧 `03-详细设计.md` 不作为本轮详细设计结论 | completed | 正式 03 已完成 full-restart 装配。 |
| `04-配置设计.md` 不得直接跳写正式正文 | completed | 已按 `04_config_*` 中间产物完成 Step 15 装配。 |
| `05-测试方案.md` 不得直接跳写正式正文 | completed | 已按 `05_test_plan_*` 中间产物完成 Step 15 装配。 |
| `06-验收标准.md` 不得直接跳写正式正文 | completed | 已按 `06_acceptance_*` 中间产物完成 Step 15 装配。 |
| 旧 `05/06/07` 不作为测试真相源 | active | 旧 `05/06` 已被 full-restart 正式文档替换;旧 `07` 只作方向输入,不得反向定义 evidence、验收门禁或实施边界。 |
| `07-实施计划.md` 不得直接跳写正式正文 | active | 必须先走 `07_implementation_plan_*` 中间产物,Step 13 才能装配正式 07。 |
| 每个 Step 先列必读文档 | active | 必读文档摘要必须写入当前 Step 文件。 |
| 每个 Step 先搭整体模块,再逐模块先思考后写入 | active | 模块思考和写入记录在当前 Step 文件内。 |
| 每次用户确认只推进一个当前模块 | active | 不得把多个模块一次性自动推进。 |
| 单次写入批次不等于文件长度上限 | active | 100~300 行只约束单次 patch / 写入批次。 |

---

## 4. 历史材料处理台账

| 材料 | 当前定位 | 处理口径 |
|---|---|---|
| `projects/L3-method-library/04-配置设计.md` | formal_completed | R15.18 已完成 §1~§15 正文装配、final self-check 和 Step 15 completed stop-review。 |
| `projects/L3-method-library/05-测试方案.md` | formal_completed | 已完成 full-restart 装配,使用当前 `TC-ML-*` / `EV-ML-*` 口径,可作为新版 `06` 输入。 |
| `projects/L3-method-library/06-验收标准.md` | formal_completed | 已按当前 `00`~`05` 和 `06_acceptance_step_01`~`15` 完成 full-restart 装配;旧主语、旧同步路径、旧基础设施和旧硬阈值口径已隔离。 |
| `projects/L3-method-library/07-实施计划.md` | formal_completed | 已按 Step 1~13 完成 full-restart 装配并提交;旧版 MethodContent / publish / snapshot / outbox / PostgreSQL 方向只作为历史污染样本隔离。 |
| `projects/L1-governance/design-calibration/06_acceptance_*` | framework_reference | 只参考流程、表格和门禁深度,不得复制 governance 领域事实。 |

---

## 5. 全局 blocker 台账

| Blocker ID | 位置 | 状态 | 描述 | 处理口径 |
|---|---|---|---|---|
| ML-S14-GAP-001 | 正式 `02-概要设计.md` §2~§4 | resolved | §2、§3、§4 缺 `延伸阅读` 块。 | 已在 `02-概要设计` Step 14 修复并关闭。 |
| ML-D03-RESET-001 | `03-详细设计.md`;旧 `03_ddd_*` | resolved | 旧 03 曾含旧正向主线,容易污染新 03。 | Step 19 已完成正式 03 full-restart 装配;旧材料已隔离。 |
| ML-D03-S3-RESET-001 | `design-calibration/03_ddd_step_03_runtime_constraints.md` | resolved | 旧 Step 3 文件曾是旧 P0 口径且标记已确认。 | Step 3 已重启并关闭旧 completed 污染。 |

---

## 6. 恢复顺序

任意后续 agent 收到“继续 / 同意 / 开始下一步”时,必须按以下顺序恢复:

```text
1. 读取本文件 `project_execution_ledger.md`
2. 读取 `design-calibration/07_implementation_plan_calibration_flow.md`
3. 读取 `design-calibration/07_implementation_plan_step_13_formal_document_assembly.md`
4. 读取 `design-calibration/implementation_execution_ledger.md`
5. 读取 `design-calibration/implementation-boundaries/commit-01-b.md`
6. 确认正式 `projects/L3-method-library/07-实施计划.md` 已完成 full-restart 装配
7. 确认 implementation ledger 的 next_allowed_action = `read_docs`
8. 重读 formal `04/07` 中关于 `config/profiles/` strict JSON skeleton 和 `--config-profile` / `--run-id` / `--artifact-root` / `--report-root` 的闭口后,再重跑 `commit-01-b` Design Gate;未通过前不得修改实现仓代码、CI、脚本或 evidence
```

---

## 7. 当前 next_allowed_action

```text
`commit-01-a` implementation handoff 已关闭,实现仓提交为 `1a7137f9adcefc76796c6e896a0ec4d15c2b4241`;
当前 boundary 已推进到 `commit-01-b`;
formal `04/07` 已闭合 `OQ-ML-003`;
下一步只允许实现侧从 `read_docs` 恢复并重跑 `commit-01-b` Design Gate;
在当前 boundary Design Gate 真正通过前,仍不得创建 CI YAML、脚本实现、真实执行结论、evidence 或 implementation code.
```
