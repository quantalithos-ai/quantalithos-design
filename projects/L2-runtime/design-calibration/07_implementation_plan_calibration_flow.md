# L2-runtime 07 实施计划全量校准流程

> 重开日期：2026-08-18
> 当前模式：`full-restart + single-agent-serial + continuous-user-authorization`
> 正式目标：`projects/L2-runtime/07-实施计划.md`
> 适用 SOP：`standards/document/实施计划讨论流程_SOP.md`
> 适用规范：`standards/document/实施计划书写规范.md`
> 事实边界：本流程只设计未来实现路径；当前没有目标实现仓、immutable design baseline、实现提交、测试 run、artifact、report、evidence、验收 verdict、signoff 或 readiness。

## 1. 文档级恢复点

| 当前 Step | 当前模块 | gate_status | gate_reason | next_allowed_action |
|---|---|---|---|---|
| Step 9 | `spikes_risks_open_questions` | `completed` | 11 Spike、20 risk、14 OQ 已绑定 boundary、输出、失败姿态、截止点与回写动作；`L2R-LANG-002` 和所有 source blocker 保持显式 | 进入 Step 10，重建回退、暂停与变更控制 |
| Step 10 | `rollback_pause_change_control` | `completed` | 13 个暂停触发器、12 个回退场景、10 类变更传播、Unknown/config/same-run/user-change 保护和 baseline 恢复协议已闭合 | 进入 Step 11，重建提交、评审与交付纪律 |
| Step 11 | `commit_review_delivery` | `completed` | 39 boundary、117 IMPL/BATCH、39 Gate、English message、9 子门禁、Commit Record 与 Handoff Record 已闭合；实际提交仍 none | 进入 Step 12，重建实施完成判定 |
| Step 12 | `completion_criteria` | `completed` | 13/39/117/117/39 identity、boundary/phase predicate、8 suite/9 check/177 TC-EV、lane distinction、incomplete rules 与 evidence ceiling 已闭合 | 进入 Step 13，重建正式 07、implementation ledger 和 39 skeleton |
| Step 13 | `formal_document_assembly` | `completed / closed_stop_review` | 正式 07 已重建为 13 章；Annex B 已改为 ph07_13；implementation ledger 与 39 planned skeleton 已装配；集合、编号、依赖、污染和事实边界审计完成 | 停审，等待用户后续明确指令；不进入实现 |

## 2. Full-restart 纪律

- 严格按 Step 1 -> Step 13 独立推进；每一步先更新本 flow 与项目 ledger，再删除并重建对应 Step 中间产物。
- 旧正式 `07-实施计划.md`、旧 `07_implementation_plan_step_*`、旧 implementation ledger 和 35 个 boundary skeleton 均为 `historical_material`，不得直接继承其 18-state、20-CUT、109-EV、12-suite、4-check 或旧 protocol/test alias。
- 正式 `07-实施计划.md` 仅在 Step 13 删除重建；Step 1~12 只形成校准产物、实施身份和正式章节回填草稿。
- 当前 canonical baseline：12 CAP、17 C、12 Q、6 inbound E、6 outbound O、7 J、31 state、7 UoW、6 replay family、15 config slice、13 external slot、37 CUT、172 raw + 5 aggregate = 177 TC/EV、8 suite、9 check、36 AC、8 VF、19 NFR。
- `compile/runtime/event/ref/adapter/fake` 必须显式区分；仅 verified `L0-core` contract 可成为 compile candidate，其他 sibling 不得伪装成 Cargo/package dependency。
- `L2R-UP-001~008`、`L2R-CP-001`、`L2R-ENTRY-001`、`L2R-IMPL-001`、`L2R-LANG-001` 原样传递为 activation/positive qualification blocker，Runtime 不私自补定义。
- 所有 phase、task、batch、gate、commit subject、path 和 skeleton 都是 planned contract；文件存在不代表实现、测试、证据或 readiness。
- Step 13 必须同时重建 implementation ledger 和全部 planned boundary skeleton；只能标记 `blocked/planned/waiting`，不能出现实际 pass、commit hash、run 或 evidence。
- 完成 Step 13 后立即停审；不进入实现，不创建目标仓，不提交 commit。

## 3. Step 总流程

| Step | 中间产物 | 主题 | 状态 |
|---:|---|---|---|
| 1 | `07_implementation_plan_step_01_input_boundary.md` | 实施输入边界 | `completed_continuous_authorized` |
| 2 | `07_implementation_plan_step_02_scope.md` | 实施目标、范围与非范围 | `completed_continuous_authorized` |
| 3 | `07_implementation_plan_step_03_prerequisites_reading.md` | 前置条件、阅读与永久记忆种子 | `completed_with_design_gate` |
| 4 | `07_implementation_plan_step_04_objects_deliverables.md` | 实施对象与交付物 | `completed` |
| 5 | `07_implementation_plan_step_05_phases_dependencies.md` | Phase 与依赖顺序 | `completed` |
| 6 | `07_implementation_plan_step_06_tasks_commit_boundaries.md` | Task、Batch 与 Commit boundary | `completed` |
| 7 | `07_implementation_plan_step_07_test_acceptance_gates.md` | 测试、验收与证据门禁 | `completed` |
| 8 | `07_implementation_plan_step_08_config_environment_dependencies.md` | 配置、环境与依赖准备 | `completed` |
| 9 | `07_implementation_plan_step_09_spikes_risks_open_questions.md` | Spike、风险与待确认 | `completed` |
| 10 | `07_implementation_plan_step_10_rollback_pause_change_control.md` | 回退、暂停与变更控制 | `completed` |
| 11 | `07_implementation_plan_step_11_commit_review_delivery.md` | 提交、评审与交付纪律 | `completed` |
| 12 | `07_implementation_plan_step_12_completion_criteria.md` | 完成判定 | `completed` |
| 13 | `07_implementation_plan_step_13_formal_document_assembly.md` | 正式 07、ledger 与 skeleton 装配 | `completed / closed_stop_review` |

## 4. 当前门禁

```text
current_document = 07-实施计划.md
current_step = Step 13
current_module = formal_document_assembly
gate_status = closed_stop_review
next_allowed_action = stop_review
formal_07_write_allowed = closed_after_step_13
implementation_ledger_write_allowed = planned_inventory_only
boundary_skeleton_write_allowed = planned_inventory_only
implementation_repo_write_allowed = false
implementation_status = not_started
actual_run_artifact_report_evidence = none
actual_verdict_signoff_readiness = none
next_step = stop_review_after_step_13
implementation_repo_write_allowed = false
next_step_allowed = stop_review
commit_required = false
```
