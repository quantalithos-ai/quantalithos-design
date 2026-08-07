# L2-tools 07 实施计划校准流程

## 工作方式

- 采用 `full-restart / single-agent-serial`，不启用 fast-track。
- 按 Step 1～13 串行收敛；每个 Step 保留问题回答、诊断、取舍、结构化产物和回填草稿。
- 正式 `07-实施计划.md` 只在 Step 13 装配；本流程文件不是实施事实或执行结果。
- 本阶段只修改设计仓文档，不创建实现仓代码、不运行实现测试、不提交 commit。
- `L2T-UP-001~009` 继续作为上游 seam blocker；允许规划 local/negative/fail-closed 路径，不把 blocker 写成 positive readiness。

## Step 状态

- [x] Step 1. 确认实施输入边界
- [x] Step 2. 明确实施目标、范围和非范围
- [x] Step 3. 收稳前置条件与阅读清单
- [x] Step 4. 抽取实施对象与交付物
- [x] Step 5. 设计实施阶段与依赖顺序
- [x] Step 6. 拆分阶段任务、编写顺序与提交边界
- [x] Step 7. 嵌入测试与验收门禁
- [x] Step 8. 定义配置、环境与外部依赖准备
- [x] Step 9. 定义 Spike、风险与待确认事项
- [x] Step 10. 定义回退、暂停与变更控制
- [x] Step 11. 定义提交、评审与交付纪律
- [x] Step 12. 定义实施完成判定
- [x] Step 13. 整理正式实施计划文档（completed / pass; stop review）

## 当前恢复点

| field | value |
|---|---|
| project | `L2-tools` |
| current_document | `07-实施计划.md` |
| current_step | `Step 13 completed / pass; stop review` |
| current_module | `formal_document_assembly:completed_stop_review` |
| gate_status | `pass`（正式 07、implementation ledger 与 26 个 boundary skeleton 已完成终检） |
| next_allowed_action | `wait_for_user_review` |
| implementation_status | `not_started` |
| implementation_gate_status | `blocked` |
| current_boundary | `commit-01-a / blocked / wait_design` |
| implementation_repo | `/home/aris/Projects/quantalithos-tools`（不存在） |
| design_baseline | `not_fixed_until_handoff` |
| commit_required | `false` |

## Step 文件索引

| Step | 中间产物 |
|---:|---|
| 1 | `07_implementation_plan_step_01_input_boundary.md` |
| 2 | `07_implementation_plan_step_02_scope.md` |
| 3 | `07_implementation_plan_step_03_prerequisites_reading.md` |
| 4 | `07_implementation_plan_step_04_objects_deliverables.md` |
| 5 | `07_implementation_plan_step_05_phases_dependencies.md` |
| 6 | `07_implementation_plan_step_06_tasks_commit_boundaries.md` |
| 7 | `07_implementation_plan_step_07_tests_acceptance_gates.md` |
| 8 | `07_implementation_plan_step_08_config_environment_dependencies.md` |
| 9 | `07_implementation_plan_step_09_spikes_risks_open_questions.md` |
| 10 | `07_implementation_plan_step_10_rollback_pause_change_control.md` |
| 11 | `07_implementation_plan_step_11_commit_review_delivery.md` |
| 12 | `07_implementation_plan_step_12_completion_criteria.md` |
| 13 | `07_implementation_plan_step_13_formal_document_assembly.md` |

## 设计事实与事实边界

- 目标实现 workspace 计划为七个 member：`tools-contracts`、`tools-domain`、`tools-application`、`tools-infra`、`tools-api`、`tools-worker`、`tools-jobs`。
- 当前唯一 compile dependency candidate 是实际存在的 `/home/aris/Projects/quantalithos-core`；Hub/Auth/Sandbox/Runtime 是 runtime seam，Bus/Observability 是 event seam，SDK 是 future consumer。
- 计划规模为 11 个 phase、26 个 commit boundary、41 个正式对象、37 个 protocol、234 个 concrete TC、11 个 P0 suite、11 个 mandatory check、30 个 candidate evidence slot。
- `commit`、`run_id`、artifact、report、evidence、acceptance、signoff 和 readiness 均为 planned contract；当前没有真实实例。

## 完成后必须存在的交付文件

- `projects/L2-tools/07-实施计划.md`
- `projects/L2-tools/design-calibration/implementation_execution_ledger.md`
- `projects/L2-tools/design-calibration/implementation-boundaries/` 下 26 个 planned boundary skeleton
- 更新后的 `projects/L2-tools/design-calibration/project_execution_ledger.md`
