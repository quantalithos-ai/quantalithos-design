
# L4-observability 06-验收标准 校准流程工作台

## 执行状态

| 字段 | 值 |
|---|---|
| project | `L4-observability` |
| document | `06-验收标准` |
| mode | `full-restart` |
| started_at | `2026-07-06` |
| source_policy | 旧正式文档和 README 只作为 `historical_material`;正式结论以本轮 Step 产物和新版正式文档为准 |
| gate_status | `step_15_complete_design_only_waiting_before_07` |
| gate_reason | Step 15 已完成跨门禁总审计和正式 `06-验收标准.md` 装配：15/15 章节、31/31 AC、24/24 NFR、10/10 VF、99/99 planned TC/candidate linkage、82 DS、9 suite、5 script/check、60 exact protocol、27+1 state 和 23 transaction gate 均有 current 设计闭环；12 项 inherited affected 仍开放，未生成真实验收结论、run、evidence、verdict 或 signoff。 |
| next_allowed_action | `wait_user_confirmation_before_07_full_restart` |

## 总流程计划

| Step | 必读文档 | 输出文件 | 模块骨架 | 当前模块 | 思考记录 | 写入记录 | 自检状态 | gate_status | gate_reason | 下一动作 | blocker |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Step 01 确认验收输入边界 | current `00~05`;验收 SOP / 书写规范;通用标准;送验说明（若存在） | `design-calibration/06_acceptance_step_01_input_boundary.md` | done | input_boundary_and_truthfulness | done | done | done | pass_for_acceptance_design_only | current 输入、31 AC / 10 VF、canonical evidence path、下游边界、历史材料和 12 affected 已收口 | start current Step 02 | inherited affected；无新增 blocker |
| Step 02 明确验收目标与范围 | current `00~05`;current Step 01;验收 SOP / 书写规范 | `design-calibration/06_acceptance_step_02_scope.md` | done | acceptance_scope_priority_and_seams | done | done | done | pass_for_acceptance_scope_design | P0/P1/P2/Forbidden、接缝、非范围、正式名称和 VF 影响已收口；未生成真实验收结论 | start current Step 03 | inherited affected；no new blocker |
| Step 03 固定验收基线 | current `00~05`;current Step 01~02;验收 SOP / 书写规范 | `design-calibration/06_acceptance_step_03_baseline.md` | done | immutable_acceptance_baseline_and_evidence_roots | done | done | done | pass_for_acceptance_baseline_design | 设计基线、送验字段、run/artifact/report/acceptance 路径、provenance 和基线变更规则已收口；不伪造不存在的版本或 run | wait_user_confirmation_before_step_04 | target reality absent；inherited affected |
| Step 04 定义进入条件与退出条件 | current Step 01~03;current `05`;验收 SOP / 书写规范 | `design-calibration/06_acceptance_step_04_entry_exit.md` | done | entry_exit_pause_resume_and_truthfulness | done | done | done | pass_for_entry_exit_design | 进入、正向放行讨论、暂停/恢复、退出与不得退出条件均可判定；材料足够裁决不等于足够正向放行 | start current Step 05 | target reality absent；inherited affected |
| Step 05 定义功能验收门禁 | current `00~05`;Step 01~04;验收 SOP / 书写规范 | `design-calibration/06_acceptance_step_05_function_gate.md` | done | ac_001_031_function_decision_closure | done | done | done | pass_for_function_gate_design | `AC-OBS-001~031` 31/31 具有设计契约、通过/失败、TC/candidate EV 和裁决影响；5 个组合 REL 不覆盖基础 family 失败 | start current Step 06 | inherited affected；no new blocker |
| Step 06 定义数据边界与架构红线验收 | current `00~05`;Step 01~05;验收 SOP / 书写规范 | `design-calibration/06_acceptance_step_06_data_arch_redlines.md` | done | truth_owner_writer_capability_and_dependency_redlines | done | done | done | pass_for_data_arch_redline_design | observation-side fact/projection/marker/handoff owner、body-free 边界、writer capability、only core-contracts compile dependency 和 historical-material 红线已闭合 | start current Step 07 | inherited affected；no new blocker |
| Step 07 定义接口、事件与跨仓同步验收 | current `03~05`;Step 01~06;依赖裁剪规则;验收 SOP / 书写规范 | `design-calibration/06_acceptance_step_07_interfaces_events_sync.md` | done | sixty_exact_protocol_and_cross_repo_seams | done | done | done | pass_for_interface_event_sync_design | 16 Command + 14 Query + 9 Consumer + 12 Event + 9 Job = 60/60 exact protocol 均有 seam、failure、evidence 和停审；无 orphan | start current Step 08 | I05 two upstream bindings remain open；J06 controlled |
| Step 08 定义状态机、事务与一致性验收 | current `03~05`;Step 01~07;验收 SOP / 书写规范 | `design-calibration/06_acceptance_step_08_state_tx_consistency.md` | done | formal_state_uow_idempotency_concurrency_recovery_gates | done | done | done | pass_for_state_tx_consistency_design | 27/27 formal state owner + 1 technical coordination state、23 transaction gates、幂等/并发/恢复门禁和零写负向断言已停审 | start current Step 09 | UoW/recovery/external/consumer/report affected remain open |
| Step 09 定义非功能验收门禁 | current `00~05`;Step 01~08;验收 SOP / 书写规范 | `design-calibration/06_acceptance_step_09_nonfunctional.md` | done | nfr_source_threshold_lane_and_release_decision_gates | done | done | done | pass_for_nonfunctional_gate_design | 24/24 NFR、8 gate、threshold source、三 profile/六 lane、未执行和风险转移规则已闭合；无来源数字未硬化 | start current Step 10 | no hard threshold source；inherited affected |
| Step 10 定义可观测性、审计与证据门禁 | current `03~05`;Step 01~09;验收 SOP / 书写规范 | `design-calibration/06_acceptance_step_10_observability_evidence.md` | done | runtime_observation_and_acceptance_evidence_chain | done | done | done | pass_for_observability_evidence_gate_design | `OBS-MAT-001~010`、`EVG-OBS-001~009`、99/99 planned provenance、82 DS、9 suite、5 scripts/checks、same-run 与 review handoff 规则已收口；真实执行仍未建立 | start current Step 11 | inherited affected；target reality absent |
| Step 11 定义一票否决项 | current `00~05`;Step 01~10;验收 SOP / 书写规范 | `design-calibration/06_acceptance_step_11_veto.md` | done | veto_redline_coverage_and_non_overridable_decision | done | done | done | pass_for_veto_redline_design | `VF-OBS-001~010` 作为唯一正式否决集合逐项闭合到正式来源、exact TC/candidate linkage、primary suite/check、canonical report path、触发裁决和不可风险接受边界；无真实 VETO checklist、run、artifact 或 evidence | start current Step 12 | inherited affected；target reality absent |
| Step 12 定义缺陷分级、复验与放行规则 | current `05`;Step 01~11;验收 SOP / 书写规范 | `design-calibration/06_acceptance_step_12_defects_retest_release.md` | done | defect_severity_retest_and_release_disposition | done | done | done | pass_for_defect_retest_release_design | `S/A/B/R`、VF/S 不可降级、11 类复验影响面、生命周期、关闭证据、自动化回写和放行矩阵已闭合；blocked/not_run/not_evaluated 未折叠为 pass | start current Step 13 | inherited affected；target reality absent |
| Step 13 定义风险接受与遗留项 | current `00~05`;Step 01~12;验收 SOP / 书写规范 | `design-calibration/06_acceptance_step_13_risk_acceptance.md` | done | residual_eligibility_acceptance_record_and_expiry | done | done | done | pass_for_risk_acceptance_design | 10 个 eligibility gate、9 个 residual source 分流、风险记录字段、失效/重开、职责和 affected 隔离已闭合；没有真实 accepted risk | start current Step 14 | 12 inherited affected；真实 acceptor 未分配；无新增 blocker |
| Step 14 定义最终结论与签署口径 | current `00~05`;Step 01~13;验收 SOP / 书写规范 | `design-calibration/06_acceptance_step_14_final_decision_signoff.md` | done | final_three_value_decision_and_role_signoff_contract | done | done | done | pass_for_final_decision_signoff_design | 三值结论、暂停状态、fail-first 聚合、发布准备边界、六类签署职责、验收包和失效规则已闭合；无真实结论或签署 | start current Step 15 | 12 inherited affected；无新增 blocker |
| Step 15 正式整理为 06-验收标准 | current `00~05`;Step 01~14;验收 SOP / 书写规范 | `design-calibration/06_acceptance_step_15_formal_document_assembly.md` | done | cross_gate_audit_and_formal_06_assembly | done | done | done | pass_design_with_affected_open | 跨门禁总审计和 15 章正式 `06` 已完成；所有 current 设计集合无 orphan/duplicate/conflict，12 项 inherited affected 保持开放；不产生真实验收结果 | wait user confirmation before `07` full-restart | 12 inherited affected；target reality absent |

## 历史材料处理

旧 `README.md`、旧 `00/01/02/03/05/06` 和旧性能 / DB / TimescaleDB / Grafana / 147 event / P95 数字只作为 historical_material。新版结论必须从当前 SOP、上游正式文档和本 Step 结构化产物重新进入正式正文。旧 `04/07` 缺失记录为历史链路缺口,本轮已补建。

当前重建规则：旧 06 正文、旧 Step 01~15、旧 AC/VETO 关联和任何 `passed` / `signoff` 文本均不作为 current
验收事实。`07-实施计划.md` 是下游输入，不是本轮 06 的验收输入；只有已定义的实施 handoff 约束可在 Step 04、12、13、14
作为 future precondition 或 residual 记录。目标实现仓 `/home/aris/Projects/quantalithos-observability`、CI、RuntimeLike、
durable store、真实 run/artifact/report/evidence 均未建立，所有当前状态保持 `planned`、`blocked`、`conditional`、
`not_run` 或 `not_evaluated`。

## 跨 Step 审计结论

| 审计项 | 结论 |
|---|---|
| 是否存在未生成 Step 文件 | Step 01~15 current 产物均已存在并取得设计 gate；Step 15 已完成正式装配，旧模板不计为完成 |
| 是否存在正式正文无具体校准来源 | current 正式 `06` 的 15/15 章节均引用具体 Step 产物；旧正式正文来源仅保留为 historical_material |
| 是否沿用旧 README 或旧正式文档作为当前 truth | 不允许；旧材料仅作 historical_material 和冲突诊断 |
| 是否存在业务 truth 反写 | Step 06~08 已固定 owner、writer capability、Query/Consumer/Job/UoW no-write 门禁；Step 10/11 继续闭合证据与 VETO |
| 是否伪造 commit / run_id / evidence alias / 测试结果 | 不允许；当前仅有 planned candidate linkage |

## 当前 Step 15 完成与停审

| 项 | 当前值 |
|---|---|
| formal document | `projects/L4-observability/06-验收标准.md` |
| current step | `Step 15 / 正式整理为 06-验收标准` |
| step status | `completed_current_formal_assembly` |
| design gate | `pass_design_with_affected_open` |
| new upstream blocker | `none` |
| inherited affected | `12` 项保持 `open/controlled/conditional`，不由 Step 15 关闭 |
| target reality | implementation/CI/RuntimeLike/real run/artifact/report/evidence/signoff 均不存在 |
| next allowed action | `wait_user_confirmation_before_07_full_restart` |
| current commit | 不需要；用户未要求提交 |

Step 15 已完成。当前只完成设计文档装配，不代表真实验收通过；未经用户连续确认，不读取、不修改、不推进
`07-实施计划.md` 或其 implementation ledger、planned boundary skeleton。
