# L3-method-library 项目设计讨论执行台账

> 创建日期: 2026-06-15
> 最近更新: 2026-06-25
> 当前任务: `04-配置设计.md` full-restart 已启动;Step 9 `R9.2 开工与必读文档:再写入` completed_wait_user_confirm_to_R9.3;等待用户确认进入 Step 9 `R9.3 SOP 问题回答与加载机制候选:先思考`。
> 项目目录: `projects/L3-method-library`

---

## 1. 当前恢复点

| 当前文档 | 当前 Step | 当前模块 | gate_status | gate_reason | next_allowed_action | 细节入口 |
|---|---|---|---|---|---|---|
| `04-配置设计.md` | Step 9 定义配置加载、校验与生效机制 | `R9.4 开工与必读文档:再写入` | completed_wait_user_confirm_to_R10.1 | R9.4 已完成 Step 9 加载 / 校验 / 生效收口,等待用户确认进入 Step 10 `R10.1 开工与必读文档:先思考`。 | 等待用户确认后进入 Step 10 `R10.1 开工与必读文档:先思考`;只允许思考 Step 10 变更、审计与回滚的开工边界、必读文档、Step 9 / Step 10 交界、L1-governance 框架参考、watch / redline 和 R10.2 写入计划;不得创建正式 `04-配置设计.md`;不得写最终加载流程、最终校验流程、最终装配流程、runtime builder 代码、测试方案、验收标准、实施计划或代码。 | `design-calibration/04_config_calibration_flow.md`;`design-calibration/04_config_step_09_loading_validation_activation.md`

---

## 2. 文档级进度

| 文档 | flow 文件 | 状态 | 当前 Step | 文档切换门禁 | blocker |
|---|---|---|---|---|---|
| `00-需求文档.md` | `design-calibration/00_requirements_calibration_flow.md` | completed | completed | pass | 已完成,可作为后续设计输入。 |
| `01-架构设计.md` | `design-calibration/01_architecture_calibration_flow.md` | completed | completed | pass | 已完成,可作为后续设计输入。 |
| `02-概要设计.md` | `design-calibration/02_hld_calibration_flow.md` | completed | completed | pass | 已完成,可作为后续设计输入。 |
| `03-详细设计.md` | `design-calibration/03_ddd_calibration_flow.md` | completed | completed | R19.26_completed_wait_user_confirm_to_04 | 正式 `03-详细设计.md` 可作为配置设计输入。 |
| `04-配置设计.md` | `design-calibration/04_config_calibration_flow.md` | in_progress | Step 9 R9.4 completed_wait_user_confirm_to_R10.1 | R9.4_completed_wait_user_confirm_to_R10.1 | R9.4 已完成 Step 9 加载 / 校验 / 生效收口;等待用户确认进入 Step 10 `R10.1 开工与必读文档:先思考`。 |
| `05-测试方案.md` | not_restarted | blocked | not_started | blocked | blocked_by_04_not_completed |
| `06-验收标准.md` | not_restarted | blocked | not_started | blocked | blocked_by_05_not_completed |
| `07-实施计划.md` | not_restarted | blocked | not_started | blocked | blocked_by_06_not_completed |

---

## 3. 当前 full-restart 执行规则

| 规则 | 状态 | 说明 |
|---|---|---|
| 旧 `00-需求文档.md` 不作为本轮需求结论 | completed | 需求文档已在本轮重启中完成装配。 |
| 旧 `01-架构设计.md` 不作为本轮架构结论 | completed | 架构文档已按本轮重建完成。 |
| 旧 `02-概要设计.md` 不作为本轮概要结论 | completed | 概要文档已按本轮重建完成。 |
| 旧 `03-详细设计.md` 不作为本轮详细设计结论 | completed | 正式 03 已完成 full-restart 装配。 |
| `04-配置设计.md` 不得直接跳写正式正文 | active | 必须先走 `04_config_*` 中间产物,Step 15 才能装配正式 04。 |
| 旧 `05/06/07` 不作为配置真相源 | active | 只能作为下游方向输入,不得反向定义配置项、验收门禁或实施边界。 |
| 每个 Step 先列必读文档 | active | 必读文档摘要必须写入当前 Step 文件。 |
| 每个 Step 先搭整体模块,再逐模块先思考后写入 | active | 模块思考和写入记录在当前 Step 文件内。 |
| 每次用户确认只推进一个当前模块 | active | 不得把多个模块一次性自动推进。 |
| 单次写入批次不等于文件长度上限 | active | 100~300 行只约束单次 patch / 写入批次。 |

---

## 4. 历史材料处理台账

| 材料 | 当前定位 | 处理口径 |
|---|---|---|
| `projects/L3-method-library/04-配置设计.md` | absent_target | 当前不存在,不得假设已有配置结论。 |
| `projects/L3-method-library/05-测试方案.md` | old_direction_input | 当前仍含旧 MethodContent / publish / snapshot / outbox 口径,只作测试环境方向输入。 |
| `projects/L3-method-library/06-验收标准.md` | old_direction_input | 当前仍含旧 P0 MethodContent 验收口径,只作验收方向输入。 |
| `projects/L3-method-library/07-实施计划.md` | old_direction_input | 不作为 phase / commit / config key 真相源。 |
| `projects/L1-governance/design-calibration/04_config_*` | framework_reference | 只参考流程、表格和门禁深度,不得复制 governance 领域事实。 |

---

## 5. 全局 blocker 台账

| Blocker ID | 位置 | 状态 | 描述 | 处理口径 |
|---|---|---|---|---|
| ML-S14-GAP-001 | 正式 `02-概要设计.md` §2~§4 | resolved | §2、§3、§4 缺 `延伸阅读` 块。 | 已在 `02-概要设计` Step 14 修复并关闭。 |
| ML-D03-RESET-001 | `03-详细设计.md`;旧 `03_ddd_*` | resolved | 旧 03 曾含旧正向主线,容易污染新 03。 | Step 19 已完成正式 03 full-restart 装配;旧材料已隔离。 |
| ML-D03-S3-RESET-001 | `design-calibration/03_ddd_step_03_runtime_constraints.md` | resolved | 旧 Step 3 文件曾是旧 P0 / MethodContent 口径且标记已确认。 | Step 3 已重启并关闭旧 completed 污染。 |

---

## 6. 恢复顺序

任意后续 agent 收到“继续 / 同意 / 开始下一步”时,必须按以下顺序恢复:

```text
1. 读取本文件 `project_execution_ledger.md`
2. 读取 `design-calibration/04_config_calibration_flow.md`
3. 读取当前 Step 文件 `design-calibration/04_config_step_09_loading_validation_activation.md`
4. 确认当前文档 = `04-配置设计.md`
5. 确认当前 Step = Step 9 `定义配置加载、校验与生效机制`
6. 确认当前模块 = Step 9 `R9.4 开工与必读文档:再写入`
7. 确认 gate_status = completed_wait_user_confirm_to_R10.1
8. 确认 next_allowed_action = 等待用户确认后进入 Step 10 `R10.1 开工与必读文档:先思考`
9. 读取 `standards/document/配置设计讨论流程_SOP.md`
10. 读取 `standards/document/配置设计书写规范.md`
11. 读取 `standards/document/设计文档讨论中间产物规范.md`
12. 读取 `standards/document/设计真相源闭环与可落码性标准.md`
13. 读取正式 `00-需求文档.md` / `01-架构设计.md` / `02-概要设计.md` / `03-详细设计.md`
14. 不得直接写正式 `04-配置设计.md`
```

---

## 7. 当前 next_allowed_action

```text
等待用户确认后进入 `04-配置设计.md` Step 10 `R10.1 开工与必读文档:先思考`;
只允许思考 Step 10 变更、审计与回滚的开工边界、必读文档、Step 9 / Step 10 交界、L1-governance 框架参考、watch / redline 和 R10.2 写入计划;
不得创建正式 `04-配置设计.md`;
不得写最终变更流程、最终审计流程、最终回滚流程、审计 / 回滚代码、测试方案、验收标准、实施计划或代码.
```
