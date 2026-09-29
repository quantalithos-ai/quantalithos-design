# L4-archive 07 实施计划校准流程

> 创建日期：2026-09-14；模式：`full-restart / single-agent-serial / continuous_authorization`。
> 用户授权：正式 06 完成并停审后，连续完成正式 07 Step 1～13、实施执行台账和全部 planned boundary skeleton；完成后停审。
> 事实边界：本轮只修改 `projects/L4-archive/`；不创建或核验目标实现仓，不写代码，不执行测试/验收，不生成 baseline、commit、run、Bundle、digest、artifact、report、evidence、verdict、risk acceptance、signoff 或 readiness，不提交 commit。

## 1. 文档级恢复点

| 项 | 当前值 |
|---|---|
| current_document | `07-实施计划.md` |
| current_step | `13` |
| current_module | `formal_document_assembly_and_planned_ledgers` |
| gate_status | `completed / formal_stop_review` |
| next_allowed_action | `wait_for_user_review_and_explicit_implementation_authorization` |
| formal_07_status | `formal / stop_review` |
| formal_07_write_allowed | `false_except_review_fixes` |
| implementation_write_allowed | `false` |
| implementation_execution_allowed | `false` |
| test_execution_allowed | `false` |
| commit_required | `false` |

## 2. 权威输入与顺序

正式 `00-需求文档.md`～`06-验收标准.md` 均为 `formal / stop_review`，是本计划唯一项目内正式输入；`03` 提供 6 crates、26 objects、8 services、7 port families、30 logical/32 method surfaces、18 states 与逐入口契约，`04` 提供 12 domains/55 P0 keys，`05` 提供 18 CUT/102 TC/13 suites/5 gates/14 scripts/19 EV，`06` 提供 9 FUNC/12 RL/34 protocol-sync/27 state-consistency/8 NFR/10 EVID/10 VETO 和三值裁决。

专项上游按正式 owner 文档读取：`L1-identity`、`L1-conversation`、`L1-work`、`L1-process`、`L1-governance`、`L1-artifact`、`L1-workspace`、`L4-observability`、`L0-core`、`L0-bus`、`L0-sdk`。它们只提供 owner truth、formal seam、依赖分类和粒度参考，不成为 Archive 的第二真相源或未经核验的 compile dependency。

README、旧正式 00/01/02/03/05/06 与 draft 只保留 historical material 身份；本项目此前不存在正式 07，已按门禁仅在 Step 13 创建。

## 3. 总流程计划与状态台账

| Step | 主题 | 输入 | 输出文件 | 前序依赖 | 状态 | 完成门禁 / 下一许可 |
|---:|---|---|---|---|---|---|
| 1 | 实施输入边界 | 正式 00～06、标准、project ledger、专项 owner | `07_implementation_plan_step_01_input_boundary.md` | 06 stop_review + 用户授权 | completed / pass_with_blocked_implementation_lanes | 输入、冲突、blocker 与可继续范围明确；Step 2 已允许 |
| 2 | 实施目标、范围与非范围 | Step 1、正式 00～06 | `07_implementation_plan_step_02_scope.md` | Step 1 | completed / p0_vertical_scope_fixed | P0/P1/P2 与禁止实现明确；Step 3 已允许 |
| 3 | 前置条件与阅读清单 | Step 2、03/04/05/06、目录/编码/台账规范 | `07_implementation_plan_step_03_prerequisites_reading.md` | Step 2 | completed / prerequisites_closed_with_blockers | 阅读矩阵、台账与记忆种子已闭合；Step 4 已允许 |
| 4 | 实施对象与交付物 | Step 3、03 §4～§16 | `07_implementation_plan_step_04_objects_deliverables.md` | Step 3 | completed / planned_surface_closed | 交付面、非交付面和 source-authority 矩阵已闭合；Step 5 已允许 |
| 5 | 阶段与依赖顺序 | Step 4、能力/风险/外部接缝 | `07_implementation_plan_step_05_phases_dependencies.md` | Step 4 | completed / phase_graph_fixed_with_blocked_lanes | 8 Phase、可验证增量、停审和跨 phase 审计完成；Step 6 已允许 |
| 6 | 任务、批次与提交边界 | Step 5、03/05/06、闭环标准 §九 | `07_implementation_plan_step_06_tasks_commit_boundaries.md` | Step 5 | completed / boundary_plan_closed_with_blockers | 16 个 boundary、批次、scope、经验复核和跨 boundary 审计完成；Step 7 已允许 |
| 7 | 测试与验收门禁 | Step 6、正式 05/06 | `07_implementation_plan_step_07_test_acceptance_gates.md` | Step 6 | completed / gates_planned_with_blocked_positive_lanes | TC/EV/AC/VETO、raw/report 与失败姿态闭合；Step 8 已完成 |
| 8 | 配置、环境与依赖准备 | Step 7、正式 01/03/04 | `07_implementation_plan_step_08_config_environment_dependencies.md` | Step 7 | completed / dependency_matrix_closed_with_blockers | 依赖类型、profile、slot、fake 与不可用姿态闭合；Step 9 已完成 |
| 9 | Spike、风险与待确认 | Step 8、18 blocker/pending | `07_implementation_plan_step_09_spikes_risks_open_questions.md` | Step 8 | completed / risks_bounded_with_explicit_deadlines | 12 Spike、15 风险、18 blocker 和 9 项待确认均有 owner/输出/截止；Step 10 已允许 |
| 10 | 回退、暂停与变更控制 | Step 9、state/UoW/effect/evidence 边界 | `07_implementation_plan_step_10_rollback_pause_change_control.md` | Step 9 | completed / pause_rollback_change_rules_closed | 触发、历史保护、补偿/对账、新 baseline 与 16 boundary 恢复规则明确；Step 11 已允许 |
| 11 | 提交、评审与交付纪律 | Step 6/7/10、提交/台账规范 | `07_implementation_plan_step_11_commit_review_delivery.md` | Step 10 | completed / sixteen_boundary_disciplines_closed | 16 boundary 的 type/scope/body/evidence/Commit/Handoff 纪律逐项停审，跨提交审计无冲突；Step 12 已允许 |
| 12 | 实施完成判定 | Step 2/4/7/9/11、正式 06 | `07_implementation_plan_step_12_completion_criteria.md` | Step 11 | completed / future_criteria_closed_current_not_entered | future completion、16-row closure、evidence、未完成处理和当前 not_entered/blocked 判定明确；Step 13 已允许 |
| 13 | 正式文档装配 | Step 1～12、实施计划书写规范 | `07_implementation_plan_step_13_formal_document_assembly.md`、正式 07、implementation ledger、boundary skeleton | Step 12 | completed / formal_stop_review | 13 章、台账/skeleton、跨文档总审计已通过；等待用户审查和明确 implementation authorization |

未来 Step 文件只在真正进入该 Step 时创建。连续授权免除 Step 间再次询问，但不允许跳过任一 Step、合并中间产物、提前创建正式 07 或伪造完成事实。

## 4. 每 Step 的统一小阶段

每个 Step 串行执行：`开工确认 → 读取输入 → Step 内计划 → SOP 问题回答 → historical/当前材料诊断 → 设计取舍 → 结构化产物 → 复杂度判断 → 回填草稿 → 待确认/上游影响 → 自检/停审 → 同步 flow/project ledger`。Step 5～7、11 必须按 phase/commit boundary 小循环逐项停审后再做跨项审计。

## 5. 固定实施原则

- Phase 按可验证归档/恢复功能纵切，不按对象、文件或个人待办拆分。
- 每个 commit boundary 只能承接一个可独立 review、验证、回退的增量，必须有 `design_baseline`、`required_reads`、`allowed_scope`、`forbidden_scope`、`required_checks`、Design/Scope/Build/Test/Evidence/Commit/Handoff Gate。
- 每个 boundary 开工前必须按真相源闭环标准复核字段/DTO、Query/view、public protocol、状态、ref/validation、metadata/idempotency/UoW、source/material、accepted side effect、artifact/report/evidence 和 phase boundary。
- formal seam 未闭合时保留 required P0 + blocked；fake 仅证明 local/negative/controlled 行为，不能证明 owner authority、durability、external commit 或 readiness。
- 当前只创建 planned/blocked/waiting 台账骨架；任何 gate 都不得标 `pass`，任何真实标识或结果都不得填写。

## 6. 持续 blocker 与设计完成上限

`AR-UP-001～009`、`AR-ARCH-001`、`AR-HLD-Q-001～002`、`AR-03-LOCAL-001～006` 全部开放。它们不阻止实施计划设计完成，但阻止相应 positive adapter、formal conformance、量化 NFR、测试退出、验收和 readiness。07 必须把每项绑定到具体 Phase/boundary、开工条件、禁止 workaround 和回写 owner；不得自行关闭。

## 7. 当前三层门禁

```text
project_gate_status = formal_06_completed_07_continuously_authorized
document_gate_status = implementation_plan_step_13_completed_formal_stop_review
step_gate_status = step_13_completed_formal_stop_review
implementation_plan_authorized_through = step_13_and_formal_07_completion
formal_07_status = formal / stop_review
formal_07_write_allowed = false_except_review_fixes
implementation_write_allowed = false
implementation_execution_allowed = false
test_execution_allowed = false
acceptance_execution_allowed = false
next_allowed_action = wait_for_user_review_and_explicit_implementation_authorization
commit_required = false
```
