# L5-console 07 实施计划校准流程

> 对应 SOP：`standards/document/实施计划讨论流程_SOP.md`
> 中间产物规范：`standards/document/设计文档讨论中间产物规范.md`
> 书写规范：`standards/document/实施计划书写规范.md`
> 代码实施台账规范：`standards/document/代码实施台账与门禁规范.md`
> 目标正式文档：`projects/L5-console/07-实施计划.md`
> 启动日期：2026-09-19

## 1. 当前状态

| 项目 | 状态 |
|---|---|
| 当前文档 | `07-实施计划.md` |
| 当前 Step | Step 13 · 整理正式实施计划文档 |
| 当前模块 | `formal-document-assembly` |
| 当前状态 | `done / pass / self_reviewed / formal_stop_review` |
| 正式 06 前置 | `formal_stop_review`，已授权进入 07 |
| 正式 07 写入 | `false`；Step 13 full-restart 装配已完成 |
| 实现仓 | `/home/aris/Projects/quantalithos-console` 不存在 |
| 实际实现状态 | `not_started / blocked_by_missing_implementation_repo_and_contracts` |
| 下一动作 | 等待用户明确授权实际实现；不得创建实现仓、运行测试或提交 |

## 2. 工作方式与硬边界

- 本项目内部严格按 `Step 1 → Step 13` 串行推进；每个 Step 单独创建中间产物、完成自审、更新本 flow 和项目级台账后才进入下一 Step。
- 当前 agent 单独完成全部阅读、分析、写入和审计；不创建、调用或委派 sub-agent、worker、agent team 或并行代理。
- 只修改 `projects/L5-console/` 下的正式 07、07 calibration、实施台账和 planned boundary skeleton；不修改其他项目正式文档，不实现代码，不创建实现仓，不运行项目测试，不创建真实 artifact/report/evidence，不提交 commit。
- 正式 `00`～`06` 是实施输入真相源；对应 calibration 只提供决策追溯。若正式文档与 calibration 冲突，以正式文档为准；仍不清楚时将 boundary 标为 `blocked / wait_design`，不得由实施计划发明 schema、Port、状态、错误码或 owner contract。
- `07` 只能安排如何落地已收稳设计，不能重定义需求、架构、详细设计、测试或验收结论。
- 所有 phase、commit boundary、门禁、脚本、路径和 evidence 均为 planned contract；未执行的项只能写 `planned / pending / blocked / waiting`，不得写成实现、通过、commit、run、测试结果或 readiness。

## 3. Step 状态台账

| Step | 主题 | 中间产物 | 状态 | 正式回填 |
|---|---|---|---|---|
| 1 | 确认实施输入边界 | `07_implementation_plan_step_01_input_boundary.md` | `done / pass / self_reviewed` | §1 |
| 2 | 明确实施目标、范围和非范围 | `07_implementation_plan_step_02_scope.md` | `done / pass / self_reviewed` | §2 |
| 3 | 收稳前置条件与阅读清单 | `07_implementation_plan_step_03_prerequisites_reading.md` | `done / pass / self_reviewed` | §3 |
| 4 | 抽取实施对象与交付物 | `07_implementation_plan_step_04_deliverables.md` | `done / pass / self_reviewed` | §4 |
| 5 | 设计实施阶段与依赖顺序 | `07_implementation_plan_step_05_phases_dependencies.md` | `done / pass / self_reviewed` | §5 |
| 6 | 拆分阶段任务、编写顺序与提交边界 | `07_implementation_plan_step_06_tasks_commits.md` | `done / pass / self_reviewed` | §6 |
| 7 | 嵌入测试与验收门禁 | `07_implementation_plan_step_07_test_acceptance_gates.md` | `done / pass / self_reviewed` | §7 |
| 8 | 定义配置、环境与外部依赖准备 | `07_implementation_plan_step_08_config_environment_dependencies.md` | `done / pass / self_reviewed` | §8 |
| 9 | 定义 Spike、风险与待确认事项 | `07_implementation_plan_step_09_spikes_risks.md` | `done / pass / self_reviewed` | §9 |
| 10 | 定义回退、暂停与变更控制 | `07_implementation_plan_step_10_rollback_pause_change_control.md` | `done / pass / self_reviewed` | §10 |
| 11 | 定义提交、评审与交付纪律 | `07_implementation_plan_step_11_commit_review_delivery.md` | `done / pass / self_reviewed` | §11 |
| 12 | 定义实施完成判定 | `07_implementation_plan_step_12_completion_criteria.md` | `done / pass / self_reviewed / step_stop_review` | §12 |
| 13 | 整理正式实施计划文档 | `07_implementation_plan_step_13_formal_document_assembly.md` | `done / pass / self_reviewed / formal_stop_review` | 全文 / §13 |

## 4. 固定状态和值域

| 范围 | 允许值 |
|---|---|
| 设计 Step | `pending`、`in_progress`、`done / pass / self_reviewed`、`blocked` |
| implementation ledger `gate_status` | `pending`、`pass`、`blocked`、`not_applicable` |
| implementation ledger `next_allowed_action` | `read_docs`、`open_boundary`、`implement`、`run_gates`、`fix_gate_failure`、`commit`、`wait_design`、`handoff`、`start_next_boundary` |
| planned boundary | `status=planned`、`next_allowed_action=wait_until_current`；不得写 `pass` |
| 当前项目事实 | `implementation_repo=not_created`、`design_baseline=not_fixed`、`run/artifact/report/evidence=not_created` |

## 5. 正式装配门禁

- Step 1～12 必须都有问题回答、诊断、取舍、结构化产物、回填草稿、待确认事项和进入下一步条件。
- Step 5～7 必须按 phase / commit boundary 做小循环和跨边界审计；不能只给对象或文件清单。
- Step 3 必须产出阶段阅读矩阵、永久记忆种子、项目级实施台账入口和 Boundary Gate Matrix 规则。
- Step 6 必须为全部 boundary 产出开工前设计闭环复核、经验复核和 planned ledger 路径。
- Step 12 必须按 `03/05/06/07` 对每个 phase / boundary 做交付实现前可落码审计；任何未闭口项均不得移交实现。
- Step 13 才允许 full-restart 重建正式 `07-实施计划.md`；装配后必须执行章节来源、占位、编号、边界、事实诚实和 `git diff --check` 审计。

## 6. 当前恢复点

```text
current_document = 07-实施计划.md
current_step = 07_implementation_plan_step_13_formal_document_assembly
current_module = formal-document-assembly
gate_status = formal_stop_review
next_allowed_action = wait_for_explicit_implementation_authorization
formal_07_write_allowed = false
implementation_write_allowed = false
test_execution_allowed = false
commit_required = false
```

## 7. Step 13 完成与停审

| 项目 | 结果 |
|---|---|
| 正式文档 | `07-实施计划.md` 已按 13 章 full-restart 装配；每章有具体 calibration 来源块。 |
| 实施台账 | `implementation_execution_ledger.md` 已创建；当前 `commit-01-a` 为 `blocked / wait_design`，其余 boundary 为 `planned / wait_until_current`。 |
| Boundary skeleton | `implementation-boundaries/` 已创建 22/22 个 planned skeleton；无真实 hash、run、artifact、report、evidence 或结果。 |
| 一致性审计 | 8 phase、22 boundary、13 章、13 来源块、5 Command/16 Query/1 conditional consumer、四项配置、0 Event/0 Job 与正式 03/05/06 一致。 |
| 事实审计 | 目标实现仓不存在，design/delivery/environment/dependency baseline 未固定；未实现代码、未运行项目测试、未生成执行证据、未提交 commit。 |
| 静态审计 | `git diff --check -- projects/L5-console` 通过。 |
| 停审动作 | 关闭 `formal_07_write_allowed`、`implementation_write_allowed`、`test_execution_allowed`；下一动作仅为等待用户明确实现授权。 |
