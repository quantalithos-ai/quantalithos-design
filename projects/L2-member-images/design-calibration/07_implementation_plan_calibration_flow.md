# L2-member-images 07 实施计划校准流程

## 工作方式

- 采用 `full-restart`：旧 README、旧正式 00/01/02/03/05/06 只作 historical pollution audit，不直接继承。
- 严格按 `Step 1 -> Step 13` 串行推进；本轮用户已授权一次性完成全部 13 Step，但每个 Step 仍保留独立输入、问题回答、回填草稿与停审记录。
- 本文档与本目录其他 07 校准文件只记录设计期 planned/blocked/waiting，不记录代码实现、commit、run、artifact、report、evidence、verdict、signoff 或 readiness。
- 仅修改 `projects/L2-member-images/`；不创建、修改或接管目标实现仓，不提交 commit。
- 正式 00~07 文档是实现基线；`design-calibration` 解释决策与来源。若二者冲突，以正式文档为准；仍不清楚时回写设计并暂停相应 boundary。

## 输入与边界

| 项 | 当前结论 |
|---|---|
| 正式输入 | `00-需求文档.md`、`01-架构设计.md`、`02-概要设计.md`、`03-详细设计.md`、`04-配置设计.md`、`05-测试方案.md`、`06-验收标准.md` |
| 目标实现仓 | `/home/aris/Projects/quantalithos-member-images`；当前不存在，不能作为实现事实 |
| planned workspace | `contracts`、`domain`、`application`、`infra`、`api`、`worker`、`jobs` 七职责单元 |
| 逻辑库存 | 10 Command、10 Query、2 marker-only conditional inbound、6 bounded Job、0 outbound |
| 当前实现状态 | `not_started`; acceptance `not_entered`; implementation `not_authorized` |
| 当前唯一激活边界 | `commit-01-a`；因目标仓、baseline 和依赖核验缺失为 `blocked / wait_design` |
| 未来边界 | 全部 `planned / wait_until_current`，不预授权实现 |

## Step 状态

- [x] Step 1. 确认实施输入边界（当前工作台入口）
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
- [x] Step 13. 整理正式实施计划文档

## 全局实施期事实上限

1. `planned` 只表示计划身份，不表示可运行或通过。
2. `blocked`、`unknown`、`unavailable`、`gap`、`not_evaluable` 不得被改写为 ready、pass、digest、release 或 consumer confirmation。
3. `DDD-S9-B01/B02`、`DDD-S11-B03`、`DDD-S13-OPEN-01/02`、`PF-UNAVAILABLE-RECOVERY` 和 `MI-UP-001~009`、`Q-MI-001~004` 继续按正式 03/05/06 处理；07 不能自行补口。
4. 所有真实检查只能在未来目标仓和执行授权成立后产生；本轮不生成 `artifacts/test/<run_id>`、`reports/runs/<run_id>` 或 `reports/acceptance/*` 实例。

## Step 文件索引

| Step | 文件 |
|---:|---|
| 1 | `07_implementation_plan_step_01_input_boundary.md` |
| 2 | `07_implementation_plan_step_02_scope.md` |
| 3 | `07_implementation_plan_step_03_prerequisites_reading.md` |
| 4 | `07_implementation_plan_step_04_objects_deliverables.md` |
| 5 | `07_implementation_plan_step_05_phases_dependencies.md` |
| 6 | `07_implementation_plan_step_06_tasks_commit_boundaries.md` |
| 7 | `07_implementation_plan_step_07_test_acceptance_gates.md` |
| 8 | `07_implementation_plan_step_08_config_environment_dependencies.md` |
| 9 | `07_implementation_plan_step_09_spikes_risks_open_questions.md` |
| 10 | `07_implementation_plan_step_10_rollback_pause_change_control.md` |
| 11 | `07_implementation_plan_step_11_commit_review_delivery.md` |
| 12 | `07_implementation_plan_step_12_completion_criteria.md` |
| 13 | `07_implementation_plan_step_13_formal_document_assembly.md` |

## Step 记录最低字段

每个 Step 文件必须包含：Step 状态、本步输入、SOP 问题回答、当前文档问题诊断、改动前后对比、设计取舍、结构化中间产物、回填草稿、待确认事项、进入下一步条件。正式 07 只回填收口结论，过程性讨论留在 Step 文件。

## 当前 07 总状态

| 项 | 状态 |
|---|---|
| Step 1~6 | `completed_with_explicit_blockers` |
| Step 7~12 | `completed_with_explicit_blockers` |
| Step 13 | `completed_stop_review` |
| formal `07-实施计划.md` | `completed_stop_review` |
| implementation ledger | `created_planned_not_started` |
| planned boundary skeleton | `24_created_with_required_checks_gate_matrix_commit_record_and_blockers; only commit-01-a current` |
| current boundary | `commit-01-a / blocked / wait_design` |
| implementation | `not_started` |
| test/run/artifact/report/evidence | `not_started / not_generated` |
| acceptance/release/readiness | `not_entered` |
| commit | `none; user did not request commit` |

完成 07 不解除任何上游或本仓 blocker；若要开始实现，必须先按项目级 implementation ledger、当前 boundary ledger、formal 00~07 和目标仓 preflight 恢复。
