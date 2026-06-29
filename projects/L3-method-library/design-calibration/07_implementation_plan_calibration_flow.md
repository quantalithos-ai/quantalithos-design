# 07 实施计划校准流程

> 对应 SOP: `standards/document/实施计划讨论流程_SOP.md`
> 中间产物规范: `standards/document/设计文档讨论中间产物规范.md`
> 书写规范: `standards/document/实施计划书写规范.md`
> 代码实施台账规范: `standards/document/代码实施台账与门禁规范.md`
> 目标正式文档: `projects/L3-method-library/07-实施计划.md`

## 1. 当前状态

| 项目 | 状态 |
|---|---|
| 当前文档 | `07-实施计划.md` |
| 当前阶段 | Step 13 整理正式实施计划文档 |
| 当前模块 | `R13.1 formal document assembly:正式装配` |
| 当前状态 | completed |
| 正式文档状态 | full-restart formal assembly completed |
| 当前设计基线 | working tree formal assembly pending commit |
| 当前输入形态 | `00`~`06` 已完成 full-restart 装配并可作为新版 `07` 输入 |
| 目标实现仓 | `/home/aris/Projects/quantalithos-method-library`;Step 3 已确认存在、干净且 git config 正确,但当前 layout 属旧实现形态,需在 PH-01 / 首个 boundary 迁移 |

## 2. 工作方式

- 每个 Step 单独生成 `design-calibration/07_implementation_plan_step_*.md` 中间产物。
- 每个 Step 单独更新本 flow 状态,不得跨 Step 自动合并。
- Step 文件必须保留 Step 状态、本步输入、SOP 问题回答、旧材料诊断、改动前后对比、设计取舍、结构化中间产物、回填草稿、待确认事项和进入下一步条件。
- 正式 `07-实施计划.md` 在 Step 13 之前不修改。
- 旧 `07-实施计划.md` 仅作为 old direction input 和污染风险样本,不得作为 phase、commit boundary、suite、gate、artifact、evidence 或 implementation ledger 真相源。
- 长内容先搭骨架,再按 Step / 模块分批写入;100~300 行是单次写入批次建议,不是最终文档长度上限。
- `07` 必须承接代码实施台账与门禁规范,在设计阶段收敛项目级 implementation ledger、boundary ledger、required reads、allowed scope、forbidden scope、required checks、Commit Gate 和 Handoff Gate。
- 每个 phase / commit boundary 的设计闭环复核和经验复核由设计侧在实现移交前完成;实现 agent 只做二次校验和 blocker 回报。

## 3. 权威输入

| 输入 | 当前状态 | 用途 |
|---|---|---|
| `projects/L3-method-library/00-需求文档.md` | full-restart completed | 实施目标、需求范围、非范围、FR/BR/NFR、验收方向和相邻仓边界 |
| `projects/L3-method-library/01-架构设计.md` | completed | truth owner、Definition vs Use、依赖方向、职责边界、数据所有权和架构红线 |
| `projects/L3-method-library/02-概要设计.md` | completed | 八组件代码主体框架、主要组成部分、对象轮廓、接口骨架、处理流、状态和配置影响 |
| `projects/L3-method-library/03-详细设计.md` | formal assembly completed | 对象、port、protocol、flow、state、transaction、error、config、observability、test cut 和 implementation handoff |
| `projects/L3-method-library/04-配置设计.md` | formal assembly completed | profile、config source、adapter binding、secret / redaction、loading validation、degradation 和 downstream handoff |
| `projects/L3-method-library/05-测试方案.md` | formal assembly completed | `TC-ML-*`、suite family、gate、artifact/report、`EV-ML-*` 和 regression / risk 规则 |
| `projects/L3-method-library/06-验收标准.md` | formal assembly completed | AC / VETO / baseline / evidence / risk acceptance / final decision 口径 |
| `standards/document/实施计划讨论流程_SOP.md` | 标准输入 | Step 1~13 讨论顺序、停审和中间产物要求 |
| `standards/document/实施计划书写规范.md` | 标准输入 | 正式 `07` 章节结构、phase / commit boundary、门禁和完成判定 |
| `standards/document/代码实施台账与门禁规范.md` | 标准输入 | implementation ledger、boundary ledger、Commit Gate、Handoff Gate 和 blocker 回流 |
| `standards/document/设计真相源闭环与可落码性标准.md` | 标准输入 | schema / port / state / mapper / config / evidence 闭口和经验复核规则 |
| `projects/L1-governance/design-calibration/07_implementation_plan_*` | framework_reference | 只参考框架、表格和门禁粒度,不得复制 governance 领域事实 |

## 4. Step 状态

| Step | 主题 | 中间产物 | 状态 |
|---|---|---|---|
| Step 1 | 确认实施输入边界 | `07_implementation_plan_step_01_input_boundary.md` | completed_confirmed |
| Step 2 | 明确实施目标、范围和非范围 | `07_implementation_plan_step_02_scope.md` | completed_confirmed |
| Step 3 | 收稳前置条件与阅读清单 | `07_implementation_plan_step_03_prerequisites_reading.md` | completed_confirmed |
| Step 4 | 抽取实施对象与交付物 | `07_implementation_plan_step_04_objects_deliverables.md` | completed_confirmed |
| Step 5 | 设计实施阶段与依赖顺序 | `07_implementation_plan_step_05_phases_dependencies.md` | completed_confirmed |
| Step 6 | 拆分阶段任务、编写顺序与提交边界 | `07_implementation_plan_step_06_tasks_commit_boundaries.md` | completed_confirmed |
| Step 7 | 嵌入测试与验收门禁 | `07_implementation_plan_step_07_test_acceptance_gates.md` | completed_confirmed |
| Step 8 | 定义配置、环境与外部依赖准备 | `07_implementation_plan_step_08_config_environment_dependencies.md` | completed_confirmed |
| Step 9 | 定义 Spike、风险与待确认事项 | `07_implementation_plan_step_09_spikes_risks_open_questions.md` | completed_confirmed |
| Step 10 | 定义回退、暂停与变更控制 | `07_implementation_plan_step_10_rollback_pause_change_control.md` | completed_confirmed |
| Step 11 | 定义提交、评审与交付纪律 | `07_implementation_plan_step_11_commit_review_delivery.md` | completed_confirmed |
| Step 12 | 定义实施完成判定 | `07_implementation_plan_step_12_completion_criteria.md` | completed_confirmed |
| Step 13 | 整理正式实施计划文档 | `07_implementation_plan_step_13_formal_document_assembly.md` | completed |

## 5. 当前停审点

| 项 | 状态 | 说明 |
|---|---|---|
| 用户确认进入 `07` | 已确认 | 用户已说“继续 L3-method-library 的讨论”。 |
| 文档级 flow | completed | 本文件负责记录 `07` full-restart 状态。 |
| Step 1 中间产物 | completed_confirmed | 已整理输入边界和旧材料污染风险,并经用户确认。 |
| Step 2 中间产物 | completed_confirmed | 已整理实施目标、范围、非范围和 P1/P2 防误入口径,并经用户确认。 |
| Step 3 中间产物 | completed_confirmed | 已整理前置条件、阅读清单、目标仓检查、台账前置和永久记忆种子,并经用户确认。 |
| Step 4 中间产物 | completed_confirmed | 已抽取实施对象、代码交付物、测试 / 证据交付物、非交付物和跨仓依赖交付物,并经用户确认。 |
| Step 5 中间产物 | completed_confirmed | 已形成实施阶段、依赖顺序、phase gate、跨 phase 审计和回填草稿,并经用户确认。 |
| Step 6 中间产物 | completed_confirmed | 已形成阶段任务、写入顺序、候选 commit boundary、通用门禁和台账承接口径思考稿,并经用户确认。 |
| Step 7 中间产物 | completed_confirmed | 已形成 phase / boundary 测试门禁、EV / VETO 映射、artifact/report 规则和失败处理思考稿,并经用户确认。 |
| Step 8 中间产物 | completed_confirmed | 已形成配置、环境与外部依赖准备思考稿,并经用户确认。 |
| Step 9 中间产物 | completed_confirmed | 已形成 Spike、风险与待确认事项思考稿,并经用户确认。 |
| Step 10 中间产物 | completed_confirmed | 已形成回退、暂停与变更控制思考稿,并经用户确认。 |
| Step 11 中间产物 | completed_confirmed | 已形成提交、评审与交付纪律思考稿,并经用户确认。 |
| Step 12 中间产物 | completed_confirmed | 已形成实施完成判定思考稿,并经用户确认。 |
| Step 13 中间产物 | completed | 已形成正式文档装配记录。 |
| 正式 `07` | completed | 已按 Step 1~12 中间产物完成 full-restart 装配。 |
| 下一步 | `commit-01-b` Design Gate blocked | `commit-01-a` implementation handoff 已关闭;当前 boundary 推进到 `commit-01-b`,但 `OQ-ML-003` 未闭合,不得自动创建 CI、脚本、代码或 evidence。 |

## 6. 恢复顺序

任意后续 agent 收到“继续 / 同意 / 开始下一步”时,必须按以下顺序恢复:

```text
1. 读取 `design-calibration/project_execution_ledger.md`
2. 读取本文件 `design-calibration/07_implementation_plan_calibration_flow.md`
3. 读取 `design-calibration/07_implementation_plan_step_13_formal_document_assembly.md`
4. 确认正式 `projects/L3-method-library/07-实施计划.md` 已完成 full-restart 装配
5. 读取 `design-calibration/implementation_execution_ledger.md`
6. 读取 `design-calibration/implementation-boundaries/commit-01-b.md`
7. 确认当前 implementation next_allowed_action = `wait_design`
8. 不得用旧 `07` 的 MethodContent / publish / snapshot / outbox / PostgreSQL / GATE-T 口径定义当前实施计划
9. 未通过当前 boundary 门禁前,不得创建 CI、脚本、代码或 evidence
```

## 7. 当前 next_allowed_action

```text
Step 13 `R13.1 formal document assembly:正式装配` completed;
正式 `07-实施计划.md` 已完成 full-restart 装配并提交;
implementation handoff 台账已推进:
- `design-calibration/implementation_execution_ledger.md`
- `design-calibration/implementation-boundaries/commit-01-b.md`
当前 `commit-01-b` Design Gate blocked by `OQ-ML-003`;
下一步只允许设计侧闭合 config skeleton file format、directory 和 CLI parameter names;
不得创建 CI、脚本、代码或 evidence,除非当前 boundary 门禁重新推进到对应动作.
```
