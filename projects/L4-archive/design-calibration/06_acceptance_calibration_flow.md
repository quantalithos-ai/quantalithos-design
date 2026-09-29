# L4-archive 06 验收标准校准流程

> 创建日期：2026-09-13；模式：`full-restart / single-agent-serial`。
> 用户授权：连续完成正式 06 Step 1～15；正式 06 完成后停审。用户随后已明确授权在 06 停审后继续完成全部 07。
> 当前恢复点：正式 06 Step 15 已完成，正式 `06-验收标准.md` 已整体重建并停审；旧 `06-验收标准.md` 仅作 `historical_material`，当前正文由 Step 1～14 的已停审产物装配。

## 1. 本轮目标与事实边界

依据验收标准 SOP，把已停审的正式 00～05 转译为可判定、可追溯、不可越权的验收裁决规则。正式 `06-验收标准.md` 只在 Step 15 由 Step 1～14 的已完成中间产物整体重建。

本轮只修改 `projects/L4-archive/` 下设计文档、校准材料和项目台账；不实现代码或测试，不创建目标实现仓，不执行测试或验收，不生成真实 `run_id`、bundle、digest、artifact、report、evidence instance、defect、verdict、risk acceptance、signoff 或 readiness，不提交 commit。

## 2. 权威输入与历史材料

| 输入 | 状态 | 使用方式 |
|---|---|---|
| 正式 `00-需求文档.md`～`05-测试方案.md` | `formal / stop_review` | 需求、边界、对象、协议、状态、配置、测试用例、证据与退出规则的唯一项目内输入 |
| `05_test_plan_step_05_traceability_coverage.md`、Step 6、Step 12～15 | completed | 需求—TC—EV、102 TC、进退准则、19 EV、残余风险和测试设计停审 |
| 验收标准 SOP / 书写规范及通用标准 | current | Step 顺序、15 章、三值裁决、证据真实性、风险接受和依赖裁剪 |
| L1-governance、L1-artifact、L1-workspace 正式 06 与 calibration | 参考 | 只借鉴门禁粒度、闭环矩阵和停审方法，不复制领域主语、ID、数量或已验收事实 |
| 旧 `06-验收标准.md`、README、draft | historical material | 只作污染诊断；旧 snapshot/index/ticket、固定供应商/期限/性能/成功率/角色不得继承 |

## 3. 总流程计划与状态台账

| Step | 主题 | 输出文件 | 主要产物 | 状态 | 下一许可 |
|---:|---|---|---|---|---|
| 1 | 验收输入边界 | `06_acceptance_step_01_input_boundary.md` | 输入映射、必须/不再回答、缺口姿态 | completed / design_inputs_ready_delivery_evidence_absent | Step 2 已允许 |
| 2 | 验收目标与范围 | `06_acceptance_step_02_scope.md` | P0/P1/P2、范围/非范围、裁决目标 | completed / p0_scope_fixed_required_formal_lanes_retained | Step 3 已允许 |
| 3 | 验收基线 | `06_acceptance_step_03_baseline.md` | design/source/delivery/run/env/data 基线 | completed / baseline_contract_fixed_actual_values_absent | Step 4 已允许 |
| 4 | 进入与退出条件 | `06_acceptance_step_04_entry_exit.md` | entry/exit/pause/不可裁决 | completed / criteria_closed_current_acceptance_not_entered | Step 5 已允许 |
| 5 | 功能验收门禁 | `06_acceptance_step_05_function_gate.md` | 功能 AC、闭环、逐项停审 | completed / nine_p0_function_ac_closed_formal_positive_lanes_blocked | Step 6 已允许 |
| 6 | 数据与架构红线 | `06_acceptance_step_06_data_arch_redlines.md` | ownership/redline AC | completed / twelve_p0_redlines_closed_with_authority_matrix | Step 7 已允许 |
| 7 | 接口、事件与同步 | `06_acceptance_step_07_interfaces_events_sync.md` | C/Q/E/J、依赖类型、formal seam | completed / thirty_entry_ac_closed_formal_seams_required_blocked | Step 8 已允许 |
| 8 | 状态、事务与一致性 | `06_acceptance_step_08_state_tx_consistency.md` | 18 状态、UoW、幂等、effect | completed / eighteen_states_and_consistency_gates_closed | Step 9 已允许 |
| 9 | 非功能门禁 | `06_acceptance_step_09_nonfunctional.md` | 安全、兼容、恢复、资源门禁 | completed / structural_p0_closed_measured_p2_blocked | Step 10 已允许 |
| 10 | 观测、审计与证据 | `06_acceptance_step_10_observability_evidence.md` | 19 EV、raw/report/handoff 门禁 | completed / nineteen_ev_and_report_chain_closed_no_instances | Step 11 已允许 |
| 11 | 一票否决 | `06_acceptance_step_11_veto.md` | exact VETO、不可接受规则 | completed / ten_exact_vetoes_closed_no_trigger_instances | Step 12 已允许 |
| 12 | 缺陷、复验与放行 | `06_acceptance_step_12_defects_retest_release.md` | S/A/B/R、复验、关闭与放行 | completed / defect_retest_release_rules_closed_no_instances | Step 13 已允许 |
| 13 | 风险接受与遗留项 | `06_acceptance_step_13_risk_acceptance.md` | residual、接受结构、不可接受项 | completed / risk_eligibility_and_all_current_dispositions_closed_no_acceptance_instances | Step 14 已允许 |
| 14 | 结论与签署 | `06_acceptance_step_14_final_decision_signoff.md` | 三值聚合、签署职责、验收包 | completed / three_value_aggregation_and_signoff_closed_unsigned | Step 15 已允许 |
| 15 | 正式文档装配 | `06_acceptance_step_15_formal_document_assembly.md` | 重建正式 06、总审计、停审 | completed / formal_stop_review | 等待/承接用户对 07 的明确连续授权 |

未来 Step 文件只在真正到达该 Step 后创建；本计划不构成未来 Step 已开始、已完成或验收已执行。

## 4. 每 Step 的统一小阶段与门禁

每个 Step 串行执行：`读取输入 → Step 内计划 → SOP 问题回答 → historical 诊断 → 取舍 → 结构化产物 → 逐项停审/跨项审计（适用时） → 回填草稿 → 上游影响判定 → 自检 → 同步 flow/项目台账`。

每个 Step 文件显式记录 `gate_status`、`gate_reason`、`next_allowed_action` 和 `source_files`。连续授权只免除 Step 间再次询问，不允许合并 Step、提前创建未来 Step 或跳过内部停审。

## 5. 固定验收分母与裁决纪律

| 分母 / 纪律 | 固定值或姿态 |
|---|---|
| 上游设计分母 | 6 crates、26 objects、8 services、7 port families、30 logical entries / 32 methods、18 states、8 source classes、12 config domains / 55 P0 keys |
| 测试设计分母 | 18 CUT、102 `TC-AR-*`、26 `DS-AR-*`、13 suites、5 gates、14 scripts、19 `EV-AR-*` families |
| 验收结论 | 只允许 `通过`、`有条件通过`、`不通过`；本文当前不产生结论实例 |
| P0 AC | 必须有正式设计、exact TC 范围、planned EV、固定 report path、通过/失败条件和裁决影响 |
| required blocked lane | 保留为 P0 且阻断完整验收；不得 skip、降级、删除或由 fake 替代 |
| VETO | 命中即 `不通过`，不得风险接受 |
| 风险接受 | 仅非 P0 红线且具备正式接受人、依据、动作、期限、再触发条件后才可能支持有条件通过；当前实例为 0 |
| 完成上限 | 文档完成只表示裁决规则可供 07 使用，不表示送验、通过、放行或 readiness |

## 6. 持续 blocker 与验收转译规则

`AR-UP-001～009`、`AR-ARCH-001`、`AR-HLD-Q-001～002` 与 `AR-03-LOCAL-001～006` 全部保持开放。每项必须同时映射为：相关 P0 AC 的 blocked prerequisite、可执行的本地反向门禁、证据证明上限、退出/VETO/residual 条件，以及明确 owning project/owner。fake、ACK、日志、配置存在、静态矩阵或本文完成均不能关闭 blocker。

## 7. 当前三层门禁

```text
project_gate_status = formal_05_completed_06_authorized
document_gate_status = formal_06_completed_stop_review
step_gate_status = step_15_completed_formal_stop_review
acceptance_authorized_through = step_15_and_formal_06_completion
formal_06_status = formal / stop_review
formal_06_write_allowed = false_except_review_fixes
acceptance_execution_allowed = false
test_execution_allowed = false
implementation_write_allowed = false
next_allowed_action = proceed_to_07_under_explicit_user_authorization
commit_required = false
```
