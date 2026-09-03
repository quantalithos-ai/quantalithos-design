# L2-member-images 06 验收标准校准流程

> 创建日期：2026-09-02
> 最近更新：2026-09-03
> 状态：`completed_stop_review`
> 文档模式：`full-restart`
> 正式文档目标：`projects/L2-member-images/06-验收标准.md`
> 项目级台账：`design-calibration/project_execution_ledger.md`

## 1. 文档级恢复点

| 项目 | 记录 |
|---|---|
| 当前文档 | `06-验收标准.md` |
| 当前 Step | 06 已完成停审（Step 15 `formal_document_assembly` 已完成）；等待用户确认后才可进入 07。 |
| 当前模块 | `formal_06_rebuild_and_cross_gate_audit`。 |
| gate_status | `completed_stop_review`。 |
| gate_reason | 用户已明确要求“完成全部 06”。Step 1~15 已完成；historical 06 已整文件审计并重建，正式 15 章、来源、编号、TC/EV/path、VETO、风险和签署边界已通过静态总审计。实际 risk acceptance、conditional pass、defect、run、evidence 和 release verdict 仍不存在。 |
| next_allowed_action | `await_user_confirmation_for_07`；不得自动进入 07、实施或执行。 |
| source_files | `project_execution_ledger.md`；正式 `00~05`；`06_acceptance_step_09_nonfunctional.md`；`06_acceptance_step_10_evidence_audit.md`；`06_acceptance_step_11_veto.md`；`06_acceptance_step_12_defects_release.md`；`06_acceptance_step_13_risk_acceptance.md`；`06_acceptance_step_08_state_tx_consistency.md`；`06_acceptance_step_06_boundary_gate.md`；`00_req_step_14_acceptance_criteria.md`；`03_ddd_step_08/09/10/11/12/13/15/16/18_*.md`；`04_config_step_09/11/12/14_*.md`；`05_test_plan_step_05/06/09/10/13/14_*.md`；验收标准 SOP / 书写规范；中间产物规范。 |

## 2. 本轮授权与执行纪律

- 用户以“同意 完成全部 06”并随后按 Step 逐次确认；本轮授权解除 06 Step 13→14→15 停审。每一 Step 均独立形成中间产物、自审并更新 flow/项目台账；Step 15 已完成，正式 06 已重建并在 06 停审。
- `06` 是裁决标准，不是测试方案、验收报告、实施计划、发布 runbook 或运行记录。它只能在后续 Step 将已有设计契约、规划 TC/EV 和固定路径转为可判定的门禁。
- 正式 `00~05` 是当前本仓设计输入。旧 README、旧正式 `06` 和旧正式 `00/01/02/03/05` 仅作 historical-material / pollution audit；不得直接继承对象、接口、数值、环境、证据、结论或签署。
- `L2-member`、`L2-member-service` 仍处 Layer 3 并行窗口，未停审内容只能形成 pending/blocker；不得写为 manifest、variant、ref、host/container、launch、qualification、confirmation 或 consumer readiness 的已闭合合同。
- 跨仓关系继续使用 `compile`、`runtime`、`event`、`ref`、`adapter`、`fake` 分类；消费关系不自动成为源码依赖，fake/adapter 结果不构成外部成功。
- 当前 Step 15 已完成正式装配与静态总审计；仍不填写真实接受人、日期、risk acceptance、conditional pass、delivery ref、`run_id`、digest、report、evidence instance、verdict、signoff 或 readiness。

## 3. Step 总流程台账

| Step | 主题 | 输出文件 | 当前状态 | gate_status | 完成门禁 / 当前原因 | 下一步许可 |
|---:|---|---|---|---|---|---|
| 1 | 确认验收输入边界 | `06_acceptance_step_01_input_boundary.md` | `completed_stop_review` | `passed_for_step_02` | 输入权威顺序、必须/不得回答事项、planned evidence 与 actual-evidence 边界、历史污染和 blocker 已收稳。 | 已获用户授权，进入 Step 2。 |
| 2 | 明确验收目标与范围 | `06_acceptance_step_02_scope.md` | `completed_stop_review` | `passed_for_step_03` | 五节点、P0/P1/P2、接缝、非范围和 VETO 候选已独立收稳；无真实执行事实。 | 已进入 Step 3。 |
| 3 | 固定验收基线 | `06_acceptance_step_03_baseline.md` | `completed_stop_review` | `passed_for_step_04` | source、delivery、profile/config、fixture、run、artifact/report/acceptance 槽位、固定路径、变更与拒绝规则已收稳；真实值仍缺失。 | 已进入 Step 4。 |
| 4 | 定义进入条件与退出条件 | `06_acceptance_step_04_entry_exit.md` | `completed_stop_review` | `passed_for_step_05` | 已将基线、证据、VETO、缺陷、风险接受和暂停条件收敛为可判定清单；当前无真实验收事实。 | 已授权进入 Step 5。 |
| 5 | 定义功能验收门禁 | `06_acceptance_step_05_function_gate.md` | `completed_stop_review` | `passed_for_step_06` | 五 capability、跨链、P0 pass/fail、planned TC/EV/path、逐项停审和跨功能审计已收稳；无真实结果。 | 已授权进入 Step 6。 |
| 6 | 定义数据边界与架构红线验收 | `06_acceptance_step_06_boundary_gate.md` | `completed_stop_review` | `passed_for_step_07` | `AC-RED-MI-001~010` 已覆盖 four data classes、forbidden body、no-write/no-truth-source、history、staged isolation、dependency crop 和 P1/P2 isolation；真实 evidence/VETO 尚缺。 | 已进入 Step 7。 |
| 7 | 定义接口、事件与跨仓同步验收 | `06_acceptance_step_07_interface_sync_gate.md` | `completed_stop_review` | `passed_for_step_08` | AC-SYNC-MI-001~030 已覆盖 10 Command、10 Query、2 marker inbound、6 Job、0 outbound、依赖分类与下游未就绪裁决；真实 evidence 仍缺失。 | 当前 06 连续授权已解除 Step 8；开始状态机/事务/一致性验收。 |
| 8 | 定义状态机、事务与一致性验收 | `06_acceptance_step_08_state_tx_consistency.md` | `completed_stop_review` | `passed_for_step_09` | `AC-STATE-MI-001~007`、`AC-TX-MI-001~007`、`AC-IDEM-MI-001~006` 已覆盖 19 matrix / 20 subject、UoW/version/history、current zero-effect、Query/inbound no-write、projection 与 replay/concurrency；实际 evidence 仍缺失。 | 已获连续授权，严格进入 Step 9。 |
| 9 | 定义非功能验收门禁 | `06_acceptance_step_09_nonfunctional.md` | `completed_stop_review` | `passed_for_step_10` | `AC-NFR-MI-001~009` 已覆盖 22 条 NFR 的 P0 structural gate、离散阈值来源、TC/EV/path、P1/P2 residual、failure disposition 与逐项/跨门禁审计；实际 evidence、quantitative baseline 与 external oracle仍缺失。 | 已获连续授权，严格进入 Step 10。 |
| 10 | 定义可观测性、审计与证据门禁 | `06_acceptance_step_10_evidence_audit.md` | `completed_stop_review` | `passed_for_step_11` | 已完成 same-run artifact/report pair、EV index、redaction、dependency、report-audit、handoff 和状态分离；实际 evidence 仍 absent。 | 已进入 Step 11。 |
| 11 | 定义一票否决项 | `06_acceptance_step_11_veto.md` | `completed_stop_review` | `passed_for_step_12` | 已固定 `VETO-MI-001~007` 的正式来源、TC/EV/report 回指、过程硬门禁、不可风险接受口径、逐项停审和跨 VETO 审计；实际 VETO instance 仍 absent。 | 已进入 Step 12。 |
| 12 | 定义缺陷分级、复验与放行规则 | `06_acceptance_step_12_defects_release.md` | `completed_stop_review` | `passed_for_step_13` | 已区分 planned/blocker/expected-negative/finding/not-evaluable/residual；固定 S/A/B/R、VETO=S、new-run 复验、关闭证据、回归升级和放行门禁；实际 defect/retest/release 仍 absent。 | 用户已确认，已进入 Step 13。 |
| 13 | 定义风险接受与遗留项 | `06_acceptance_step_13_risk_acceptance.md` | `completed_stop_review` | `passed_for_step_14` | 已固定 residual 资格谓词、S/VETO/过程硬门禁不可接受边界、`DDD/MI-UP/Q-MI/PF` blocker 分离、七列表风险登记、责任/接受角色槽位、动作/截止触发、报告/问题/实施/运维同步与重开规则；实际 risk acceptance/conditional pass 仍 absent。 | Step 14 已获授权并完成。 |
| 14 | 定义最终结论与签署口径 | `06_acceptance_step_14_conclusion_signoff.md` | `completed_stop_review` | `passed_for_step_15` | 已固定三值结论、P0/VETO/S/A/B/R 与证据关系、发布准备/下一阶段闸门、业务/架构/测试/实施/运维安全合规/验收签署槽位及风险接受边界；未填写实际结论或签署。 | 进入 Step 15 正式装配与总审计。 |
| 15 | 正式装配与跨门禁总审计 | `06_acceptance_step_15_formal_document_assembly.md` | `completed_stop_review` | `completed_stop_review` | 已完成 historical 正式 06 污染审计、整文件重建、15 章/来源块/编号/TC/EV/path/VETO/风险/签署总审计；未生成任何实际验收或发布事实。 | 立即停审；等待用户确认后才可进入 07。 |

## 4. Step 1~4 已收稳的输入纪律

| 输入类别 | 当前可用性 | 用于 06 的边界 |
|---|---|---|
| 本仓正式 `00~05` | 当前设计基线 | 提供需求、owner/架构、对象/协议/状态、配置和 planned TC/EV；不等于实现或验收完成。 |
| `03` / `04` / `05` 指定 calibration | 当前补充输入 | 解释 test seam、风险、配置下游承接、entry/exit、evidence 与 regression 的收敛过程；正式正文最终仍以正式 `00~05` 为准。 |
| 已闭合上游正式边界与台账 | owner input | 只消费各 owner 已闭合职责与 ref/seam 边界；未闭合字段、产品或结果继续 pending。 |
| `L2-member` / `L2-member-service` 材料 | sibling pending | 只保留供给/消费方向与 `MI-UP-001/002` 等 gap；不形成正向联合验收。 |
| `L1-governance` 的 06 成品 / Step 1 | 格式参考 | 只参考验收项小循环、停审粒度和 15 章组织，不继承治理对象、EV、VETO、阈值或结论。 |
| old `06` / README / prior formal material | historical only | 仅诊断旧 persona/toolset/seed 主线、泛化 API/DB 证据、未来源量化阈值和旧签署占位；不得复用。 |

## 5. 06 设计与实际验收的分界

| 事项 | 当前 Step 15 可做 | 当前不得声称 / 生成 |
|---|---|---|
| 裁决输入 | 指定未来风险记录必须引用的需求、设计、TC、EV、固定路径与 owner 边界。 | 某一能力、P0、VETO、风险接受或总体已通过。 |
| 送验基线 | 列出后续必须固定的 delivery ref、profile、fixture、`run_id`、artifact/report/handoff 槽位。 | 真实版本、commit、image ref、digest、config digest、`run_id` 或环境可用。 |
| 测试证据 | 继承 `EV-UNIT/SVC/ENTRY/INT/CONFIG/SEC/OBS/GATE/REC/PERF-*` 的规划 family 与路径规则。 | artifact、report、EV instance、evidence alias、gate result 或测试结果。 |
| 风险和外部关系 | 记录 `DDD-*`、`PF-*`、`MI-UP-*`、`Q-MI-*` 的分类、影响、重开条件与 role slots。 | owner 已确认、Artifact handoff、consumer confirmation、build/publish/event 成功、risk accepted 或 readiness。 |
| 正式文档 | 已完成固定 15 章正式 06 装配和静态总审计。 | 未经重新授权不得修改正式 06；任何实际验收值仍须 future execution 回填。 |

## 6. 当前门禁

```text
document_status = completed_stop_review
current_step = 06_completed_stop_review
completed_step = 15_formal_document_assembly
current_module = formal_06_rebuild_and_cross_gate_audit
gate_status = completed_stop_review
gate_reason = step_1_to_15_completed_stop_review; user_authorized_complete_all_06; historical_formal_06_audit_and_rebuild_completed; static_cross_gate_audit_passed; actual_risk_acceptance_conditional_pass_defect_retest_release_evidence_are_absent
next_allowed_action = await_user_confirmation_for_07
formal_06_write_allowed = false_until_reopen
step_10_status = completed_stop_review
step_11_status = completed_stop_review
step_12_status = completed_stop_review
step_13_status = completed_stop_review
step_14_status = completed_stop_review
step_15_status = completed_stop_review
step_14_creation_allowed = completed
step_14_to_15_creation_allowed = completed
formal_06_rebuild_in_progress = false
formal_06_status = rebuilt_and_audited
acceptance_execution_status = not_entered
implementation_allowed = false
test_execution_allowed = false
implementation_ledger_allowed = false
planned_boundary_skeleton_allowed = false
commit_required = false
```

Step 10 的实质性自审为 `pass_with_explicit_blockers`：same-run evidence、报告完整性、脱敏、依赖和 handoff 规则已收稳，但实际验收仍缺送验基线和 evidence。Step 11 的实质性自审为 `pass_with_explicit_blockers`：七项正式 VETO、过程硬门禁和跨项覆盖已收稳，但实际 VETO instance 仍不存在。Step 12 的实质性自审为 `pass_with_explicit_blockers`：记录类型、S/A/B/R、复验身份、关闭证据和放行条件已收稳，但实际 defect/retest/release 仍不存在。Step 13 的实质性自审为 `pass_with_explicit_blockers`：risk qualification、不可接受边界、责任/接受槽位、动作/截止触发、同步和重开规则已收稳，但实际 risk acceptance、conditional pass、evidence、verdict 和 signoff 仍不存在。Step 14 已完成三值结论与签署口径并停审；Step 15 已完成 historical 06 污染审计、正式重建和跨门禁总审计。06 当前为 `completed_stop_review`，仍不授权 07-实施计划或任何实施活动。
