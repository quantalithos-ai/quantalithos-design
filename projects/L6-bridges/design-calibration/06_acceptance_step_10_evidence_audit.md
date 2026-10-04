# L6-bridges 06 Step10：证据审计

## 1. Step状态

2026-10-04；done_design_static；对应验收SOP Step10 / 书写§5.10；回填正式06§10。full-restart / single-agent-serial，只设计；actual资格不释放。

| 模块 | gate_status | gate_reason | next_allowed_action | source_files |
|---|---|---|---|---|
| evidence_audit | pass | design_static_only_external_gates_open | enter_step_11 | Step9十六NFR；03§14/15安全出口；05§9/13七script/9DTO/schema/22EV/固定路径；case/evidence registry；全部前序门禁；Observability当前producer/consumer缺口。 |

### 1.1 Step内计划

| 小阶段 | 状态 | 产物位置 |
|---|---|---|
| 读取输入和前序结论 | done | §2 |
| SOP问题回答 | done | §3 |
| 当前材料诊断 | done | §4/5 |
| 验收裁决取舍 | done | §6 |
| 结构化中间产物 | done | §7 |
| 复杂度判断 | done | §6 |
| 回填草稿 | done | §8 |
| 实际自检和下一条件 | done | §10 |

### 1.2 整体模块骨架

22plannedEV逐项反查；另8个运行材料/报告/安全/人审门禁；Report完整性与acceptancehandoff闭环，人工finaladjudication在Step14定义，不改05schema。

### 正式回填门禁（Step15控制）

本Step八小阶段与设计静态审查已完成；Step15三处最小修正和139gate/跨文档十表已重审。正式06§10已从本Step§7回填，正文不含诊断/取舍/停审过程或新运行结果；当前回填权限冻结。前文enter_step记录仅为当时流程，当前恢复/推进许可只以项目台账/06 flow/Step15停审门禁为准。

```text
formal_backfill_gate_status = blocked
formal_backfill_gate_reason = formal_06_complete_wait_for_user_confirmation
formal_backfill_next_allowed_action = wait_for_user_confirmation_of_06
formal_document_write_allowed = false
next_document_allowed = false
implementation_write_allowed = false
test_execution_allowed = false
commit_required = false
```

## 2. 本步输入

Step9十六NFR；03§14/15安全出口；05§9/13七script/9DTO/schema/22EV/固定路径；case/evidence registry；全部前序门禁；Observability当前producer/consumer缺口。

前序Step的问题、诊断、取舍与未决均承接；上游blocker不关闭。旧06/README未作当前结论输入。

## 3. SOP问题回答

1~2. 关键actualmutation唯一safeaudit，no-op/query/technicalphase不补；四类观测出口只有获准有限分类/trace，不能正文/高基数/敏感派生。
3~5. 固定run按05artifact/report路径，先读reports再hash反查safe原artifact；缺材料pause/送验不成立，确证篡改/泄漏才失败/VETO。
6~8. EVindex全22 EV+具体TC/全部instance/context/suite/check；gateresults含local/real/release与§5~11人工门禁反查；redaction覆盖JSON/MD/safetokens等全部实际输出。
9~11. Handoff仅draft_for_review；HumanReview只有changes_requested或handoff_reviewed_no_acceptance_verdict，不改DTO添passed/verdict；veto/openissues/risk人审真实补，Step14人工最终裁决分离。
12~14. 每EV独立决策→规范卡→静态停审；runtime链必须从真实case/suite/check提取，不从本表物化；sharedEV不重复instance。

#### AC-EVID-BR-CONTRACT-001 可审查决策记录

- 问题/依据：EV-CONTRACT-001 / CUT-BR-SURFACE 实例链核验如何在05§13.3当前evidence_plan_registry；03§8/15.1/16.3~16.5；本06§5~9对应独立门禁的EvidencePage全部required owner/schema_version/kind/run_id/ev_id/status/tc_refs/instance_ids/context_ids/qualification_scope/context_ref/source_index_ref/case_refs/suite_refs/check_refs/ac_refs/veto_refs/failure_code/blockers；EV-CONTRACT-001、local_mechanism；05九root与ArtifactRef/ReportRef角色路径范围裁决，所需副作用是否同阶段成立？
- 诊断：EV-CONTRACT-001原计划映射只有材料方向，local_mechanism范围不能互代actualscope；当前相关TC/EV均planned，不能以静态资料报实际通过。
- 取舍：采用原合同逐字段/guard与真实同run断言；不采用“表中EV/TC都存在就算覆盖已通过”，原因是其不能证明本项authority、阶段或完整性。
- 结论边界：只定义下方门禁，不改DTO/枚举/owner权；完成本项静态停审后才开始下一项。

#### AC-EVID-BR-CONTRACT-002 可审查决策记录

- 问题/依据：EV-CONTRACT-002 / CUT-BR-BIND 实例链核验如何在05§13.3当前evidence_plan_registry；03§8 C01/C02/§9 M01/M02/§15.1；本06§5~9对应独立门禁的EvidencePage全部required owner/schema_version/kind/run_id/ev_id/status/tc_refs/instance_ids/context_ids/qualification_scope/context_ref/source_index_ref/case_refs/suite_refs/check_refs/ac_refs/veto_refs/failure_code/blockers；EV-CONTRACT-002、local_mechanism；05九root与ArtifactRef/ReportRef角色路径范围裁决，所需副作用是否同阶段成立？
- 诊断：EV-CONTRACT-002原计划映射只有材料方向，local_mechanism范围不能互代actualscope；当前相关TC/EV均planned，不能以静态资料报实际通过。
- 取舍：采用原合同逐字段/guard与真实同run断言；不采用“表中EV/TC都存在就算覆盖已通过”，原因是其不能证明本项authority、阶段或完整性。
- 结论边界：只定义下方门禁，不改DTO/枚举/owner权；完成本项静态停审后才开始下一项。

#### AC-EVID-BR-CONTRACT-003 可审查决策记录

- 问题/依据：EV-CONTRACT-003 / CUT-BR-MAP 实例链核验如何在05§13.3当前evidence_plan_registry；03§8 C03/§9 M03~M05/§15.1；本06§5~9对应独立门禁的EvidencePage全部required owner/schema_version/kind/run_id/ev_id/status/tc_refs/instance_ids/context_ids/qualification_scope/context_ref/source_index_ref/case_refs/suite_refs/check_refs/ac_refs/veto_refs/failure_code/blockers；EV-CONTRACT-003、local_mechanism；05九root与ArtifactRef/ReportRef角色路径范围裁决，所需副作用是否同阶段成立？
- 诊断：EV-CONTRACT-003原计划映射只有材料方向，local_mechanism范围不能互代actualscope；当前相关TC/EV均planned，不能以静态资料报实际通过。
- 取舍：采用原合同逐字段/guard与真实同run断言；不采用“表中EV/TC都存在就算覆盖已通过”，原因是其不能证明本项authority、阶段或完整性。
- 结论边界：只定义下方门禁，不改DTO/枚举/owner权；完成本项静态停审后才开始下一项。

#### AC-EVID-BR-CONTRACT-004 可审查决策记录

- 问题/依据：EV-CONTRACT-004 / CUT-BR-INBOUND 实例链核验如何在05§13.3当前evidence_plan_registry；03§8 E01/§9 M06/§15.1；本06§5~9对应独立门禁的EvidencePage全部required owner/schema_version/kind/run_id/ev_id/status/tc_refs/instance_ids/context_ids/qualification_scope/context_ref/source_index_ref/case_refs/suite_refs/check_refs/ac_refs/veto_refs/failure_code/blockers；EV-CONTRACT-004、local_mechanism；05九root与ArtifactRef/ReportRef角色路径范围裁决，所需副作用是否同阶段成立？
- 诊断：EV-CONTRACT-004原计划映射只有材料方向，local_mechanism范围不能互代actualscope；当前相关TC/EV均planned，不能以静态资料报实际通过。
- 取舍：采用原合同逐字段/guard与真实同run断言；不采用“表中EV/TC都存在就算覆盖已通过”，原因是其不能证明本项authority、阶段或完整性。
- 结论边界：只定义下方门禁，不改DTO/枚举/owner权；完成本项静态停审后才开始下一项。

#### AC-EVID-BR-CONTRACT-005 可审查决策记录

- 问题/依据：EV-CONTRACT-005 / CUT-BR-CHANGE 实例链核验如何在05§13.3当前evidence_plan_registry；03§8 E01/C03/§9 M04/M05/M13/M14/§15.2；本06§5~9对应独立门禁的EvidencePage全部required owner/schema_version/kind/run_id/ev_id/status/tc_refs/instance_ids/context_ids/qualification_scope/context_ref/source_index_ref/case_refs/suite_refs/check_refs/ac_refs/veto_refs/failure_code/blockers；EV-CONTRACT-005、local_mechanism；05九root与ArtifactRef/ReportRef角色路径范围裁决，所需副作用是否同阶段成立？
- 诊断：EV-CONTRACT-005原计划映射只有材料方向，local_mechanism范围不能互代actualscope；当前相关TC/EV均planned，不能以静态资料报实际通过。
- 取舍：采用原合同逐字段/guard与真实同run断言；不采用“表中EV/TC都存在就算覆盖已通过”，原因是其不能证明本项authority、阶段或完整性。
- 结论边界：只定义下方门禁，不改DTO/枚举/owner权；完成本项静态停审后才开始下一项。

#### AC-EVID-BR-CONTRACT-006 可审查决策记录

- 问题/依据：EV-CONTRACT-006 / CUT-BR-PRESENT 实例链核验如何在05§13.3当前evidence_plan_registry；03§8 C04/E02/§9 M07/§15.2；本06§5~9对应独立门禁的EvidencePage全部required owner/schema_version/kind/run_id/ev_id/status/tc_refs/instance_ids/context_ids/qualification_scope/context_ref/source_index_ref/case_refs/suite_refs/check_refs/ac_refs/veto_refs/failure_code/blockers；EV-CONTRACT-006、local_mechanism；05九root与ArtifactRef/ReportRef角色路径范围裁决，所需副作用是否同阶段成立？
- 诊断：EV-CONTRACT-006原计划映射只有材料方向，local_mechanism范围不能互代actualscope；当前相关TC/EV均planned，不能以静态资料报实际通过。
- 取舍：采用原合同逐字段/guard与真实同run断言；不采用“表中EV/TC都存在就算覆盖已通过”，原因是其不能证明本项authority、阶段或完整性。
- 结论边界：只定义下方门禁，不改DTO/枚举/owner权；完成本项静态停审后才开始下一项。

#### AC-EVID-BR-CONTRACT-007 可审查决策记录

- 问题/依据：EV-CONTRACT-007 / CUT-BR-ATTACH 实例链核验如何在05§13.3当前evidence_plan_registry；03§8 C04/E01/§13/§15.2；本06§5~9对应独立门禁的EvidencePage全部required owner/schema_version/kind/run_id/ev_id/status/tc_refs/instance_ids/context_ids/qualification_scope/context_ref/source_index_ref/case_refs/suite_refs/check_refs/ac_refs/veto_refs/failure_code/blockers；EV-CONTRACT-007、local_mechanism；05九root与ArtifactRef/ReportRef角色路径范围裁决，所需副作用是否同阶段成立？
- 诊断：EV-CONTRACT-007原计划映射只有材料方向，local_mechanism范围不能互代actualscope；当前相关TC/EV均planned，不能以静态资料报实际通过。
- 取舍：采用原合同逐字段/guard与真实同run断言；不采用“表中EV/TC都存在就算覆盖已通过”，原因是其不能证明本项authority、阶段或完整性。
- 结论边界：只定义下方门禁，不改DTO/枚举/owner权；完成本项静态停审后才开始下一项。

#### AC-EVID-BR-CONTRACT-008 可审查决策记录

- 问题/依据：EV-CONTRACT-008 / CUT-BR-DELIVERY 实例链核验如何在05§13.3当前evidence_plan_registry；03§8 C04/J01/§9 M08/M09/§10.3/§15.2；本06§5~9对应独立门禁的EvidencePage全部required owner/schema_version/kind/run_id/ev_id/status/tc_refs/instance_ids/context_ids/qualification_scope/context_ref/source_index_ref/case_refs/suite_refs/check_refs/ac_refs/veto_refs/failure_code/blockers；EV-CONTRACT-008、local_mechanism；05九root与ArtifactRef/ReportRef角色路径范围裁决，所需副作用是否同阶段成立？
- 诊断：EV-CONTRACT-008原计划映射只有材料方向，local_mechanism范围不能互代actualscope；当前相关TC/EV均planned，不能以静态资料报实际通过。
- 取舍：采用原合同逐字段/guard与真实同run断言；不采用“表中EV/TC都存在就算覆盖已通过”，原因是其不能证明本项authority、阶段或完整性。
- 结论边界：只定义下方门禁，不改DTO/枚举/owner权；完成本项静态停审后才开始下一项。

#### AC-EVID-BR-CONTRACT-009 可审查决策记录

- 问题/依据：EV-CONTRACT-009 / CUT-BR-CALLBACK 实例链核验如何在05§13.3当前evidence_plan_registry；03§8 C05/E03/§9 M10/M11/§15.2；本06§5~9对应独立门禁的EvidencePage全部required owner/schema_version/kind/run_id/ev_id/status/tc_refs/instance_ids/context_ids/qualification_scope/context_ref/source_index_ref/case_refs/suite_refs/check_refs/ac_refs/veto_refs/failure_code/blockers；EV-CONTRACT-009、local_mechanism；05九root与ArtifactRef/ReportRef角色路径范围裁决，所需副作用是否同阶段成立？
- 诊断：EV-CONTRACT-009原计划映射只有材料方向，local_mechanism范围不能互代actualscope；当前相关TC/EV均planned，不能以静态资料报实际通过。
- 取舍：采用原合同逐字段/guard与真实同run断言；不采用“表中EV/TC都存在就算覆盖已通过”，原因是其不能证明本项authority、阶段或完整性。
- 结论边界：只定义下方门禁，不改DTO/枚举/owner权；完成本项静态停审后才开始下一项。

#### AC-EVID-BR-CONTRACT-010 可审查决策记录

- 问题/依据：EV-CONTRACT-010 / CUT-BR-KEY 实例链核验如何在05§13.3当前evidence_plan_registry；03§11/§9 M12/§8 J05/§15.2；本06§5~9对应独立门禁的EvidencePage全部required owner/schema_version/kind/run_id/ev_id/status/tc_refs/instance_ids/context_ids/qualification_scope/context_ref/source_index_ref/case_refs/suite_refs/check_refs/ac_refs/veto_refs/failure_code/blockers；EV-CONTRACT-010、local_mechanism；05九root与ArtifactRef/ReportRef角色路径范围裁决，所需副作用是否同阶段成立？
- 诊断：EV-CONTRACT-010原计划映射只有材料方向，local_mechanism范围不能互代actualscope；当前相关TC/EV均planned，不能以静态资料报实际通过。
- 取舍：采用原合同逐字段/guard与真实同run断言；不采用“表中EV/TC都存在就算覆盖已通过”，原因是其不能证明本项authority、阶段或完整性。
- 结论边界：只定义下方门禁，不改DTO/枚举/owner权；完成本项静态停审后才开始下一项。

#### AC-EVID-BR-CONTRACT-011 可审查决策记录

- 问题/依据：EV-CONTRACT-011 / CUT-BR-CURSOR 实例链核验如何在05§13.3当前evidence_plan_registry；03§8 J03/§9 M13/M14/§15.2；本06§5~9对应独立门禁的EvidencePage全部required owner/schema_version/kind/run_id/ev_id/status/tc_refs/instance_ids/context_ids/qualification_scope/context_ref/source_index_ref/case_refs/suite_refs/check_refs/ac_refs/veto_refs/failure_code/blockers；EV-CONTRACT-011、local_mechanism；05九root与ArtifactRef/ReportRef角色路径范围裁决，所需副作用是否同阶段成立？
- 诊断：EV-CONTRACT-011原计划映射只有材料方向，local_mechanism范围不能互代actualscope；当前相关TC/EV均planned，不能以静态资料报实际通过。
- 取舍：采用原合同逐字段/guard与真实同run断言；不采用“表中EV/TC都存在就算覆盖已通过”，原因是其不能证明本项authority、阶段或完整性。
- 结论边界：只定义下方门禁，不改DTO/枚举/owner权；完成本项静态停审后才开始下一项。

#### AC-EVID-BR-CONTRACT-012 可审查决策记录

- 问题/依据：EV-CONTRACT-012 / CUT-BR-RATE 实例链核验如何在05§13.3 evidence_plan_registry；03§8 J01/J02/§9 M15/§11~12/§15.2；本06§5~9对应独立卡的EvidencePage全部required owner/schema_version/kind/run_id/ev_id/status/tc_refs/instance_ids/context_ids/qualification_scope/context_ref/source_index_ref/case_refs/suite_refs/check_refs/ac_refs/veto_refs/failure_code/blockers；EV-CONTRACT-012、local_mechanism；ArtifactRef/ReportRef及9roots范围裁决，所需副作用是否同阶段成立？
- 诊断：EV-CONTRACT-012必须核其独立local_mechanism闭包与actual成熟度，计划仅索引；当前相关TC/EV均planned，不能以静态资料报实际通过。
- 取舍：采用原合同逐字段/guard与真实同run断言；不采用“脚本exit0/文件存在或一个代表实例等同全部EV通过”，原因是其不能证明本项authority、阶段或完整性。
- 结论边界：只定义下方门禁，不改DTO/枚举/owner权；完成本项静态停审后才开始下一项。

#### AC-EVID-BR-CONTRACT-013 可审查决策记录

- 问题/依据：EV-CONTRACT-013 / CUT-BR-RECOVERY 实例链核验如何在05§13.3 evidence_plan_registry；03§8 C06/J02/J03/J04/§9 M16/§15.2；本06§5~9对应独立卡的EvidencePage全部required owner/schema_version/kind/run_id/ev_id/status/tc_refs/instance_ids/context_ids/qualification_scope/context_ref/source_index_ref/case_refs/suite_refs/check_refs/ac_refs/veto_refs/failure_code/blockers；EV-CONTRACT-013、local_mechanism；ArtifactRef/ReportRef及9roots范围裁决，所需副作用是否同阶段成立？
- 诊断：EV-CONTRACT-013必须核其独立local_mechanism闭包与actual成熟度，计划仅索引；当前相关TC/EV均planned，不能以静态资料报实际通过。
- 取舍：采用原合同逐字段/guard与真实同run断言；不采用“脚本exit0/文件存在或一个代表实例等同全部EV通过”，原因是其不能证明本项authority、阶段或完整性。
- 结论边界：只定义下方门禁，不改DTO/枚举/owner权；完成本项静态停审后才开始下一项。

#### AC-EVID-BR-CONTRACT-014 可审查决策记录

- 问题/依据：EV-CONTRACT-014 / CUT-BR-LOCAL 实例链核验如何在05§13.3 evidence_plan_registry；03§10.1~10.4/§15.2；本06§5~9对应独立卡的EvidencePage全部required owner/schema_version/kind/run_id/ev_id/status/tc_refs/instance_ids/context_ids/qualification_scope/context_ref/source_index_ref/case_refs/suite_refs/check_refs/ac_refs/veto_refs/failure_code/blockers；EV-CONTRACT-014、mixed；ArtifactRef/ReportRef及9roots范围裁决，所需副作用是否同阶段成立？
- 诊断：EV-CONTRACT-014必须核其独立mixed闭包与actual成熟度，计划仅索引；当前相关TC/EV均planned，不能以静态资料报实际通过。
- 取舍：采用原合同逐字段/guard与真实同run断言；不采用“脚本exit0/文件存在或一个代表实例等同全部EV通过”，原因是其不能证明本项authority、阶段或完整性。
- 结论边界：只定义下方门禁，不改DTO/枚举/owner权；完成本项静态停审后才开始下一项。

#### AC-EVID-BR-CONTRACT-015 可审查决策记录

- 问题/依据：EV-CONTRACT-015 / CUT-BR-READ 实例链核验如何在05§13.3 evidence_plan_registry；03§8 Q01~Q04/§16.4/§15.2；本06§5~9对应独立卡的EvidencePage全部required owner/schema_version/kind/run_id/ev_id/status/tc_refs/instance_ids/context_ids/qualification_scope/context_ref/source_index_ref/case_refs/suite_refs/check_refs/ac_refs/veto_refs/failure_code/blockers；EV-CONTRACT-015、local_mechanism；ArtifactRef/ReportRef及9roots范围裁决，所需副作用是否同阶段成立？
- 诊断：EV-CONTRACT-015必须核其独立local_mechanism闭包与actual成熟度，计划仅索引；当前相关TC/EV均planned，不能以静态资料报实际通过。
- 取舍：采用原合同逐字段/guard与真实同run断言；不采用“脚本exit0/文件存在或一个代表实例等同全部EV通过”，原因是其不能证明本项authority、阶段或完整性。
- 结论边界：只定义下方门禁，不改DTO/枚举/owner权；完成本项静态停审后才开始下一项。

#### AC-EVID-BR-CONTRACT-016 可审查决策记录

- 问题/依据：EV-CONTRACT-016 / CUT-BR-AUDIT 实例链核验如何在05§13.3 evidence_plan_registry；03§8 E04/O01/J04/§9 M17/§15.2；本06§5~9对应独立卡的EvidencePage全部required owner/schema_version/kind/run_id/ev_id/status/tc_refs/instance_ids/context_ids/qualification_scope/context_ref/source_index_ref/case_refs/suite_refs/check_refs/ac_refs/veto_refs/failure_code/blockers；EV-CONTRACT-016、local_mechanism；ArtifactRef/ReportRef及9roots范围裁决，所需副作用是否同阶段成立？
- 诊断：EV-CONTRACT-016必须核其独立local_mechanism闭包与actual成熟度，计划仅索引；当前相关TC/EV均planned，不能以静态资料报实际通过。
- 取舍：采用原合同逐字段/guard与真实同run断言；不采用“脚本exit0/文件存在或一个代表实例等同全部EV通过”，原因是其不能证明本项authority、阶段或完整性。
- 结论边界：只定义下方门禁，不改DTO/枚举/owner权；完成本项静态停审后才开始下一项。

#### AC-EVID-BR-CONTRACT-017 可审查决策记录

- 问题/依据：EV-CONTRACT-017 / CUT-BR-CONFIG 实例链核验如何在05§13.3 evidence_plan_registry；04§7/9/11/12.2；03§13；本06§5~9对应独立卡的EvidencePage全部required owner/schema_version/kind/run_id/ev_id/status/tc_refs/instance_ids/context_ids/qualification_scope/context_ref/source_index_ref/case_refs/suite_refs/check_refs/ac_refs/veto_refs/failure_code/blockers；EV-CONTRACT-017、local_mechanism；ArtifactRef/ReportRef及9roots范围裁决，所需副作用是否同阶段成立？
- 诊断：EV-CONTRACT-017必须核其独立local_mechanism闭包与actual成熟度，计划仅索引；当前相关TC/EV均planned，不能以静态资料报实际通过。
- 取舍：采用原合同逐字段/guard与真实同run断言；不采用“脚本exit0/文件存在或一个代表实例等同全部EV通过”，原因是其不能证明本项authority、阶段或完整性。
- 结论边界：只定义下方门禁，不改DTO/枚举/owner权；完成本项静态停审后才开始下一项。

#### AC-EVID-BR-CONTRACT-018 可审查决策记录

- 问题/依据：EV-CONTRACT-018 / CUT-BR-PRIVATE 实例链核验如何在05§13.3 evidence_plan_registry；03§13~15；04§8；本06§5~9对应独立卡的EvidencePage全部required owner/schema_version/kind/run_id/ev_id/status/tc_refs/instance_ids/context_ids/qualification_scope/context_ref/source_index_ref/case_refs/suite_refs/check_refs/ac_refs/veto_refs/failure_code/blockers；EV-CONTRACT-018、local_mechanism；ArtifactRef/ReportRef及9roots范围裁决，所需副作用是否同阶段成立？
- 诊断：EV-CONTRACT-018必须核其独立local_mechanism闭包与actual成熟度，计划仅索引；当前相关TC/EV均planned，不能以静态资料报实际通过。
- 取舍：采用原合同逐字段/guard与真实同run断言；不采用“脚本exit0/文件存在或一个代表实例等同全部EV通过”，原因是其不能证明本项authority、阶段或完整性。
- 结论边界：只定义下方门禁，不改DTO/枚举/owner权；完成本项静态停审后才开始下一项。

#### AC-EVID-BR-CONTRACT-019 可审查决策记录

- 问题/依据：EV-CONTRACT-019 / CUT-BR-ENTRY 实例链核验如何在05§13.3 evidence_plan_registry；03§7外层/§8 J/§9 M18~M21/§15；04§12 CFG-CUT-011；本06§5~9对应独立卡的EvidencePage全部required owner/schema_version/kind/run_id/ev_id/status/tc_refs/instance_ids/context_ids/qualification_scope/context_ref/source_index_ref/case_refs/suite_refs/check_refs/ac_refs/veto_refs/failure_code/blockers；EV-CONTRACT-019、local_mechanism；ArtifactRef/ReportRef及9roots范围裁决，所需副作用是否同阶段成立？
- 诊断：EV-CONTRACT-019必须核其独立local_mechanism闭包与actual成熟度，计划仅索引；当前相关TC/EV均planned，不能以静态资料报实际通过。
- 取舍：采用原合同逐字段/guard与真实同run断言；不采用“脚本exit0/文件存在或一个代表实例等同全部EV通过”，原因是其不能证明本项authority、阶段或完整性。
- 结论边界：只定义下方门禁，不改DTO/枚举/owner权；完成本项静态停审后才开始下一项。

#### AC-EVID-BR-CONTRACT-020 可审查决策记录

- 问题/依据：EV-CONTRACT-020 / CUT-BR-STATE 实例链核验如何在05§13.3 evidence_plan_registry；03§9/§16.6/§15.2；本06§5~9对应独立卡的EvidencePage全部required owner/schema_version/kind/run_id/ev_id/status/tc_refs/instance_ids/context_ids/qualification_scope/context_ref/source_index_ref/case_refs/suite_refs/check_refs/ac_refs/veto_refs/failure_code/blockers；EV-CONTRACT-020、local_mechanism；ArtifactRef/ReportRef及9roots范围裁决，所需副作用是否同阶段成立？
- 诊断：EV-CONTRACT-020必须核其独立local_mechanism闭包与actual成熟度，计划仅索引；当前相关TC/EV均planned，不能以静态资料报实际通过。
- 取舍：采用原合同逐字段/guard与真实同run断言；不采用“脚本exit0/文件存在或一个代表实例等同全部EV通过”，原因是其不能证明本项authority、阶段或完整性。
- 结论边界：只定义下方门禁，不改DTO/枚举/owner权；完成本项静态停审后才开始下一项。

#### AC-EVID-BR-CONTRACT-021 可审查决策记录

- 问题/依据：EV-CONTRACT-021 / CUT-BR-EVIDENCE 实例链核验如何在05§13.3 evidence_plan_registry；03§15脚本边界；00 AC037/038；测试规范§4.6/5.13；本06§5~9对应独立卡的EvidencePage全部required owner/schema_version/kind/run_id/ev_id/status/tc_refs/instance_ids/context_ids/qualification_scope/context_ref/source_index_ref/case_refs/suite_refs/check_refs/ac_refs/veto_refs/failure_code/blockers；EV-CONTRACT-021、local_mechanism；ArtifactRef/ReportRef及9roots范围裁决，所需副作用是否同阶段成立？
- 诊断：EV-CONTRACT-021必须核其独立local_mechanism闭包与actual成熟度，计划仅索引；当前相关TC/EV均planned，不能以静态资料报实际通过。
- 取舍：采用原合同逐字段/guard与真实同run断言；不采用“脚本exit0/文件存在或一个代表实例等同全部EV通过”，原因是其不能证明本项authority、阶段或完整性。
- 结论边界：只定义下方门禁，不改DTO/枚举/owner权；完成本项静态停审后才开始下一项。

#### AC-EVID-BR-REAL-001 可审查决策记录

- 问题/依据：EV-REAL-001 / CUT-BR-REAL 实例链核验如何在05§13.3 evidence_plan_registry；03§14~17；04§14/平台核验附录；本06§5~9对应独立卡的EvidencePage全部required owner/schema_version/kind/run_id/ev_id/status/tc_refs/instance_ids/context_ids/qualification_scope/context_ref/source_index_ref/case_refs/suite_refs/check_refs/ac_refs/veto_refs/failure_code/blockers；EV-REAL-001、real_seam；ArtifactRef/ReportRef及9roots范围裁决，所需副作用是否同阶段成立？
- 诊断：EV-REAL-001必须核其独立real_seam闭包与actual成熟度，计划仅索引；当前相关TC/EV均planned，不能以静态资料报实际通过。
- 取舍：采用原合同逐字段/guard与真实同run断言；不采用“脚本exit0/文件存在或一个代表实例等同全部EV通过”，原因是其不能证明本项authority、阶段或完整性。
- 结论边界：只定义下方门禁，不改DTO/枚举/owner权；完成本项静态停审后才开始下一项。

#### AC-REPORT-BR-001 可审查决策记录

- 问题/依据：run context/基线/expected manifest固定如何在03§14/15；05§9/13 schema/digest/paths/跨字段；本06§3/10/14人工边界的RunContext全15required/ExecutionContext/ExpectedInstance；00~05 DesignDigest；actualsource_revision/source_tree/build/tool/approvedsafeprofile；artifacts/test/<run_id>/context.json范围裁决，所需副作用是否同阶段成立？
- 诊断：材料是否存在、可读、安全与source/status/authority一致要独立核实，计划path本身不是材料；当前相关TC/EV均planned，不能以静态资料报实际通过。
- 取舍：采用原合同逐字段/guard与真实同run断言；不采用“只看文件存在或aggregateexit0即送验完整”，原因是其不能证明本项authority、阶段或完整性。
- 结论边界：只定义下方门禁，不改DTO/枚举/owner权；完成本项静态停审后才开始下一项。

#### AC-REPORT-BR-002 可审查决策记录

- 问题/依据：case/suite/check状态与真实执行闭包如何在03§14/15；05§9/13 schema/digest/paths/跨字段；本06§3/10/14人工边界的CaseResult.executed/status/assertions/call_counters/target_id；SuiteResult.runner_results/runner_exit/case_refs/missing_instance_ids；CheckResult.check_id/input_index_ref；固定cases/suites/checks路径范围裁决，所需副作用是否同阶段成立？
- 诊断：材料是否存在、可读、安全与source/status/authority一致要独立核实，计划path本身不是材料；当前相关TC/EV均planned，不能以静态资料报实际通过。
- 取舍：采用原合同逐字段/guard与真实同run断言；不采用“只看文件存在或aggregateexit0即送验完整”，原因是其不能证明本项authority、阶段或完整性。
- 结论边界：只定义下方门禁，不改DTO/枚举/owner权；完成本项静态停审后才开始下一项。

#### AC-REPORT-BR-003 可审查决策记录

- 问题/依据：schema/CJSON/hash/角色路径与writer-reader如何在03§14/15；05§9/13 schema/digest/paths/跨字段；本06§3/10/14人工边界的05 harnessschema9root/34defs/106ref；22封闭object全部propsrequired；ArtifactRef/ReportRef.path/sha256/byte_length/media_type；CJSON+LF及DAG；四root固定目录范围裁决，所需副作用是否同阶段成立？
- 诊断：材料是否存在、可读、安全与source/status/authority一致要独立核实，计划path本身不是材料；当前相关TC/EV均planned，不能以静态资料报实际通过。
- 取舍：采用原合同逐字段/guard与真实同run断言；不采用“只看文件存在或aggregateexit0即送验完整”，原因是其不能证明本项authority、阶段或完整性。
- 结论边界：只定义下方门禁，不改DTO/枚举/owner权；完成本项静态停审后才开始下一项。

#### AC-REPORT-BR-004 可审查决策记录

- 问题/依据：全部artifact/report/redaction与出站禁材如何在03§14/15；05§9/13 schema/digest/paths/跨字段；本06§3/10/14人工边界的两个CheckResult/test-evidence；reports/runs/<run_id>/redaction-check.md；allJSON/MD/ASCIIstdoutstderr/trace/log/metrics/handoff/decision人材；SafeProtocolError范围裁决，所需副作用是否同阶段成立？
- 诊断：材料是否存在、可读、安全与source/status/authority一致要独立核实，计划path本身不是材料；当前相关TC/EV均planned，不能以静态资料报实际通过。
- 取舍：采用原合同逐字段/guard与真实同run断言；不采用“只看文件存在或aggregateexit0即送验完整”，原因是其不能证明本项authority、阶段或完整性。
- 结论边界：只定义下方门禁，不改DTO/枚举/owner权；完成本项静态停审后才开始下一项。

#### AC-REPORT-BR-005 可审查决策记录

- 问题/依据：ArtifactIndex/ReportIndex/EVindex/gate报告完整如何在03§14/15；05§9/13 schema/digest/paths/跨字段；本06§3/10/14人工边界的ArtifactIndex.stage/status/coverage/generation；ReportIndex.stage/status/evidence_refs/missing_ev_ids；reports/runs/<run_id>/{index.json,summary.md,evidence-index.md,gate-results.md}及suite/EVjsonmd范围裁决，所需副作用是否同阶段成立？
- 诊断：材料是否存在、可读、安全与source/status/authority一致要独立核实，计划path本身不是材料；当前相关TC/EV均planned，不能以静态资料报实际通过。
- 取舍：采用原合同逐字段/guard与真实同run断言；不采用“只看文件存在或aggregateexit0即送验完整”，原因是其不能证明本项authority、阶段或完整性。
- 结论边界：只定义下方门禁，不改DTO/枚举/owner权；完成本项静态停审后才开始下一项。

#### AC-REPORT-BR-006 可审查决策记录

- 问题/依据：四成熟度/审计材料/测试EV authority分开如何在03§14/15；05§9/13 schema/digest/paths/跨字段；本06§3/10/14人工边界的scriptcapability/minimalindexshell/finalEVpages/acceptancehandoff四层；SafeAuditRecord/CanonicalSafeMaterialRef/O01disposition与test-onlyEvidencePage区别范围裁决，所需副作用是否同阶段成立？
- 诊断：材料是否存在、可读、安全与source/status/authority一致要独立核实，计划path本身不是材料；当前相关TC/EV均planned，不能以静态资料报实际通过。
- 取舍：采用原合同逐字段/guard与真实同run断言；不采用“只看文件存在或aggregateexit0即送验完整”，原因是其不能证明本项authority、阶段或完整性。
- 结论边界：只定义下方门禁，不改DTO/枚举/owner权；完成本项静态停审后才开始下一项。

#### AC-REPORT-BR-007 可审查决策记录

- 问题/依据：acceptance draft与真实人工review交接如何在03§14/15；05§9/13 schema/digest/paths/跨字段；本06§3/10/14人工边界的reports/acceptance/<run_id>/{handoff.json,handoff.md,veto-checklist.md,open-issues.md,risk-acceptance.md}；reports/review/<run_id>/{review.json,reviewer-notes.md}；Handoff/HumanReview原required范围裁决，所需副作用是否同阶段成立？
- 诊断：材料是否存在、可读、安全与source/status/authority一致要独立核实，计划path本身不是材料；当前相关TC/EV均planned，不能以静态资料报实际通过。
- 取舍：采用原合同逐字段/guard与真实同run断言；不采用“只看文件存在或aggregateexit0即送验完整”，原因是其不能证明本项authority、阶段或完整性。
- 结论边界：只定义下方门禁，不改DTO/枚举/owner权；完成本项静态停审后才开始下一项。

#### AC-REPORT-BR-008 可审查决策记录

- 问题/依据：失败留存/复验新run/安全retention策略如何在03§14/15；05§9/13 schema/digest/paths/跨字段；本06§3/10/14人工边界的05safeoutput/writeconflict/partial/missing/finitefailure；approvedartifactpolicy/retention scope；§12retest及原businessoriginal/unknown/key/window范围裁决，所需副作用是否同阶段成立？
- 诊断：材料是否存在、可读、安全与source/status/authority一致要独立核实，计划path本身不是材料；当前相关TC/EV均planned，不能以静态资料报实际通过。
- 取舍：采用原合同逐字段/guard与真实同run断言；不采用“只看文件存在或aggregateexit0即送验完整”，原因是其不能证明本项authority、阶段或完整性。
- 结论边界：只定义下方门禁，不改DTO/枚举/owner权；完成本项静态停审后才开始下一项。

逐项可审查决策记录均已先于各自规范卡落盘；局部自检记录见§10。

## 4. 当前材料问题诊断

report生成与acceptancefinalverdict是两套authority。现05schema已闭口、但实现/测试/actualrun均不存在，不能建预填报告目录；actualregistration/basis需private渠道核验，只safequalification槽入报告。

## 5. 改动前后对比

| 问题 | 非充分材料 | 本步完整要求 |
|---|---|---|
| EV完整 | 静态22条映射 | 每TC完整expectedmanifest→实际case/suite/check→EV/reporthash |
| 报告 | 文件存在或exit0 | schema/rolepath/canonicalbytes/digest/status/current/closure全核 |
| 交接 | 自动初稿 | actualhumanassignment+review+veto/issue/risk，不自动signoff |
| 安全 | 后脱敏raw | prewriterallowlist及全出口safe，unknown不伪pass |

## 6. 验收裁决取舍与复杂度

复杂度高；22EV各卡+8共用report/检查门禁逐项停审。acceptance§5.10等价固定run路径已经05定，不新TC/EV/JSONroot/script；Step14仅人工有限字段审核材料，不改05Handoff/HumanReview。

## 7. 结构化中间产物

### 10.1 证据真实性共同规则

本章22EV均沿05 planned ID，不是EV实例。未来审查顺序：固定`reports/runs/<run_id>/summary.md`/`evidence-index.md`→每EV JSON/MD→同run case/context/suite/two checks及各文件实际安全bytes/digest；当前没有目录、实例、run或测得结论。

05九root/34defs/封闭对象和所有required字段保持不变；context绑定00~05设计hash、actual source/build/tool/approvedsafeprofile与完整expectedmanifest。06标准hash只在§14人工裁决材料另绑定，不塞05RunContext新增字段。所有artifact/report refs按角色限定路径，不latest/跨run/absolute/.. /symlink。JSON CJSON包括唯一末LF，实际sha/byte_length/media全核；只安全harness输出是“原始artifact”，不是业务raw。

合法完整failedrun也可schema/check通过并生成failedEV；missingcase/check/scope/qualification只partial或blocked，不造finalEV。未测、blocked、unavailable与缺case不能reportedpassed。22 EV可被多卡引用但每expectedinstance只有一个suite/target路由并只执行一次。

### 10.2 逐EV验收索引

#### AC-EVID-BR-CONTRACT-001 EV-CONTRACT-001 / CUT-BR-SURFACE 实例链核验

| 项 | 可判定合同（P0；当前planned/not_evaluated） |
|---|---|
| 原需求/设计 | AC-BR-006、AC-BR-013、AC-BR-020、AC-BR-026、AC-BR-035、AC-BR-037、AC-BR-038；05§13.3当前evidence_plan_registry；03§8/15.1/16.3~16.5；本06§5~9对应独立门禁 |
| 正式对象/字段/协议/状态 | EvidencePage全部required owner/schema_version/kind/run_id/ev_id/status/tc_refs/instance_ids/context_ids/qualification_scope/context_ref/source_index_ref/case_refs/suite_refs/check_refs/ac_refs/veto_refs/failure_code/blockers；EV-CONTRACT-001、local_mechanism；05九root与ArtifactRef/ReportRef角色路径 |
| 通过条件 | 该EV exacttc_refs=["TC-SURFACE-001","TC-SURFACE-002","TC-SURFACE-003","TC-SURFACE-004"]；从每TC全部expectedinstance真实case/target/suite/context推导闭包、实际两个checks通过及digest/schema/status/scope吻合；passed要求全真实实例passed，不以静态表造材料；local只已实际执行局部机制，承诺actualpositive由对应门禁另核 |
| 失败条件 | orphan/missingparameter/case/check/suite/context/digest/current不符，或reportpassed而某expectedinstance未executed/failed/blocked/unavailable；归错scope或静态物化EV |
| 副作用断言 | reader/reportwriter只读取真实safeharness文件，zero业务网络/probe/send/mutation；不能补case/check/EVpassed、改旧failure或删missing；该EV不赋Observability证据裁决authority |
| 具体TC | ["TC-SURFACE-001","TC-SURFACE-002","TC-SURFACE-003","TC-SURFACE-004"]；每TC全部封闭参数及expected断言，不能代表实例 |
| planned EV | ["EV-CONTRACT-001"]；只由未来真实case/suite/check生成，不从表物化 |
| 固定report path | `reports/runs/<run_id>/evidence/EV-CONTRACT-001.json`及同ID`.md`；`reports/runs/<run_id>/evidence-index.md` |
| 原safe artifact | `artifacts/test/<run_id>/cases/<instance_id>.json`、`suites/<suite_id>/<context_id>/report.json`与两check；按05注册表精确反查 |
| scope/actual缺失 | synthetic只本项local机制；positive实际local_mechanism actualharness/完整instance；所声称actualpositive另须对应真实资格须真实资格。缺case/参数/check/basis/资格=blocked/not_evaluated，不skip后pass |
| 裁决影响 | 实际P0失败阻总体正向；若构成原六VETO按§11、S/A按§12；P0不风险接受。无材料暂停，不臆判失败或签署 |

| EV独立反查 | 固定合同 |
|---|---|
| DS与suite | ["DS-SURFACE-001"]；["SUITE-S","SUITE-C","SUITE-D"]；按05§9.2 expectedmanifest每instance唯一路由，不复制到多个suite |
| 原safeartifact | `artifacts/test/<run_id>/context.json`、`index.json`、`cases/<instance_id>.json`、`suites/<suite_id>/<context_id>/report.json`及safe stdout/stderr；`checks/run-context.json`和`checks/test-evidence.json` |
| 消费本EV的06门禁 | AC-FUNC-BR-003、AC-FUNC-BR-016、AC-BOUND-BR-017、AC-SYNC-BR-C01、AC-SYNC-BR-C02、AC-SYNC-BR-C03、AC-SYNC-BR-C04、AC-SYNC-BR-C05、AC-SYNC-BR-C06、AC-SYNC-BR-Q01、AC-SYNC-BR-Q02、AC-SYNC-BR-Q03、AC-SYNC-BR-Q04、AC-SYNC-BR-SHARED、AC-SYNC-BR-COMPILE、AC-NFR-BR-014；多卡引用同instance只执行/计数一次 |
| 原AC/VETO方向 | AC-BR-006、AC-BR-013、AC-BR-020、AC-BR-026、AC-BR-035、AC-BR-037、AC-BR-038；无独立VETO，按原AC；不是通过结论 |
| 缺失影响 | 暂停受影响P0正向/交接；实际失败按本EV真实assertion及§11/12处理，不补finalEV |

#### AC-EVID-BR-CONTRACT-002 EV-CONTRACT-002 / CUT-BR-BIND 实例链核验

| 项 | 可判定合同（P0；当前planned/not_evaluated） |
|---|---|
| 原需求/设计 | AC-BR-001、AC-BR-003、AC-BR-005、AC-BR-006、AC-BR-007、AC-BR-022、VETO-BR-002；05§13.3当前evidence_plan_registry；03§8 C01/C02/§9 M01/M02/§15.1；本06§5~9对应独立门禁 |
| 正式对象/字段/协议/状态 | EvidencePage全部required owner/schema_version/kind/run_id/ev_id/status/tc_refs/instance_ids/context_ids/qualification_scope/context_ref/source_index_ref/case_refs/suite_refs/check_refs/ac_refs/veto_refs/failure_code/blockers；EV-CONTRACT-002、local_mechanism；05九root与ArtifactRef/ReportRef角色路径 |
| 通过条件 | 该EV exacttc_refs=["TC-BIND-001","TC-BIND-002","TC-BIND-003","TC-BIND-004"]；从每TC全部expectedinstance真实case/target/suite/context推导闭包、实际两个checks通过及digest/schema/status/scope吻合；passed要求全真实实例passed，不以静态表造材料；local只已实际执行局部机制，承诺actualpositive由对应门禁另核 |
| 失败条件 | orphan/missingparameter/case/check/suite/context/digest/current不符，或reportpassed而某expectedinstance未executed/failed/blocked/unavailable；归错scope或静态物化EV |
| 副作用断言 | reader/reportwriter只读取真实safeharness文件，zero业务网络/probe/send/mutation；不能补case/check/EVpassed、改旧failure或删missing；该EV不赋Observability证据裁决authority |
| 具体TC | ["TC-BIND-001","TC-BIND-002","TC-BIND-003","TC-BIND-004"]；每TC全部封闭参数及expected断言，不能代表实例 |
| planned EV | ["EV-CONTRACT-002"]；只由未来真实case/suite/check生成，不从表物化 |
| 固定report path | `reports/runs/<run_id>/evidence/EV-CONTRACT-002.json`及同ID`.md`；`reports/runs/<run_id>/evidence-index.md` |
| 原safe artifact | `artifacts/test/<run_id>/cases/<instance_id>.json`、`suites/<suite_id>/<context_id>/report.json`与两check；按05注册表精确反查 |
| scope/actual缺失 | synthetic只本项local机制；positive实际local_mechanism actualharness/完整instance；所声称actualpositive另须对应真实资格须真实资格。缺case/参数/check/basis/资格=blocked/not_evaluated，不skip后pass |
| 裁决影响 | 实际P0失败阻总体正向；若构成原六VETO按§11、S/A按§12；P0不风险接受。无材料暂停，不臆判失败或签署 |

| EV独立反查 | 固定合同 |
|---|---|
| DS与suite | ["DS-BIND-001"]；["SUITE-A"]；按05§9.2 expectedmanifest每instance唯一路由，不复制到多个suite |
| 原safeartifact | `artifacts/test/<run_id>/context.json`、`index.json`、`cases/<instance_id>.json`、`suites/<suite_id>/<context_id>/report.json`及safe stdout/stderr；`checks/run-context.json`和`checks/test-evidence.json` |
| 消费本EV的06门禁 | AC-FUNC-BR-001、AC-FUNC-BR-002、AC-FUNC-BR-010、AC-BOUND-BR-002、AC-BOUND-BR-003、AC-BOUND-BR-004、AC-SYNC-BR-C01、AC-SYNC-BR-C02、AC-SYNC-BR-Q01、AC-STATE-BR-M01、AC-STATE-BR-M02、AC-NFR-BR-001、AC-NFR-BR-002、AC-NFR-BR-008；多卡引用同instance只执行/计数一次 |
| 原AC/VETO方向 | AC-BR-001、AC-BR-003、AC-BR-005、AC-BR-006、AC-BR-007、AC-BR-022；VETO-BR-002；不是通过结论 |
| 缺失影响 | 暂停受影响P0正向/交接；实际失败按本EV真实assertion及§11/12处理，不补finalEV |

#### AC-EVID-BR-CONTRACT-003 EV-CONTRACT-003 / CUT-BR-MAP 实例链核验

| 项 | 可判定合同（P0；当前planned/not_evaluated） |
|---|---|
| 原需求/设计 | AC-BR-001、AC-BR-004、AC-BR-005、AC-BR-006、AC-BR-011、AC-BR-023、VETO-BR-001；05§13.3当前evidence_plan_registry；03§8 C03/§9 M03~M05/§15.1；本06§5~9对应独立门禁 |
| 正式对象/字段/协议/状态 | EvidencePage全部required owner/schema_version/kind/run_id/ev_id/status/tc_refs/instance_ids/context_ids/qualification_scope/context_ref/source_index_ref/case_refs/suite_refs/check_refs/ac_refs/veto_refs/failure_code/blockers；EV-CONTRACT-003、local_mechanism；05九root与ArtifactRef/ReportRef角色路径 |
| 通过条件 | 该EV exacttc_refs=["TC-MAP-001","TC-MAP-002","TC-MAP-003","TC-MAP-004","TC-MAP-005"]；从每TC全部expectedinstance真实case/target/suite/context推导闭包、实际两个checks通过及digest/schema/status/scope吻合；passed要求全真实实例passed，不以静态表造材料；local只已实际执行局部机制，承诺actualpositive由对应门禁另核 |
| 失败条件 | orphan/missingparameter/case/check/suite/context/digest/current不符，或reportpassed而某expectedinstance未executed/failed/blocked/unavailable；归错scope或静态物化EV |
| 副作用断言 | reader/reportwriter只读取真实safeharness文件，zero业务网络/probe/send/mutation；不能补case/check/EVpassed、改旧failure或删missing；该EV不赋Observability证据裁决authority |
| 具体TC | ["TC-MAP-001","TC-MAP-002","TC-MAP-003","TC-MAP-004","TC-MAP-005"]；每TC全部封闭参数及expected断言，不能代表实例 |
| planned EV | ["EV-CONTRACT-003"]；只由未来真实case/suite/check生成，不从表物化 |
| 固定report path | `reports/runs/<run_id>/evidence/EV-CONTRACT-003.json`及同ID`.md`；`reports/runs/<run_id>/evidence-index.md` |
| 原safe artifact | `artifacts/test/<run_id>/cases/<instance_id>.json`、`suites/<suite_id>/<context_id>/report.json`与两check；按05注册表精确反查 |
| scope/actual缺失 | synthetic只本项local机制；positive实际local_mechanism actualharness/完整instance；所声称actualpositive另须对应真实资格须真实资格。缺case/参数/check/basis/资格=blocked/not_evaluated，不skip后pass |
| 裁决影响 | 实际P0失败阻总体正向；若构成原六VETO按§11、S/A按§12；P0不风险接受。无材料暂停，不臆判失败或签署 |

| EV独立反查 | 固定合同 |
|---|---|
| DS与suite | ["DS-MAP-001"]；["SUITE-A"]；按05§9.2 expectedmanifest每instance唯一路由，不复制到多个suite |
| 原safeartifact | `artifacts/test/<run_id>/context.json`、`index.json`、`cases/<instance_id>.json`、`suites/<suite_id>/<context_id>/report.json`及safe stdout/stderr；`checks/run-context.json`和`checks/test-evidence.json` |
| 消费本EV的06门禁 | AC-FUNC-BR-003、AC-FUNC-BR-006、AC-BOUND-BR-001、AC-BOUND-BR-003、AC-BOUND-BR-007、AC-BOUND-BR-016、AC-SYNC-BR-C03、AC-STATE-BR-M03、AC-STATE-BR-M04、AC-STATE-BR-M05、AC-NFR-BR-002；多卡引用同instance只执行/计数一次 |
| 原AC/VETO方向 | AC-BR-001、AC-BR-004、AC-BR-005、AC-BR-006、AC-BR-011、AC-BR-023；VETO-BR-001；不是通过结论 |
| 缺失影响 | 暂停受影响P0正向/交接；实际失败按本EV真实assertion及§11/12处理，不补finalEV |

#### AC-EVID-BR-CONTRACT-004 EV-CONTRACT-004 / CUT-BR-INBOUND 实例链核验

| 项 | 可判定合同（P0；当前planned/not_evaluated） |
|---|---|
| 原需求/设计 | AC-BR-008、AC-BR-009、AC-BR-010、AC-BR-012、AC-BR-013、AC-BR-014、VETO-BR-004；05§13.3当前evidence_plan_registry；03§8 E01/§9 M06/§15.1；本06§5~9对应独立门禁 |
| 正式对象/字段/协议/状态 | EvidencePage全部required owner/schema_version/kind/run_id/ev_id/status/tc_refs/instance_ids/context_ids/qualification_scope/context_ref/source_index_ref/case_refs/suite_refs/check_refs/ac_refs/veto_refs/failure_code/blockers；EV-CONTRACT-004、local_mechanism；05九root与ArtifactRef/ReportRef角色路径 |
| 通过条件 | 该EV exacttc_refs=["TC-INBOUND-001","TC-INBOUND-002","TC-INBOUND-003","TC-INBOUND-004","TC-INBOUND-005"]；从每TC全部expectedinstance真实case/target/suite/context推导闭包、实际两个checks通过及digest/schema/status/scope吻合；passed要求全真实实例passed，不以静态表造材料；local只已实际执行局部机制，承诺actualpositive由对应门禁另核 |
| 失败条件 | orphan/missingparameter/case/check/suite/context/digest/current不符，或reportpassed而某expectedinstance未executed/failed/blocked/unavailable；归错scope或静态物化EV |
| 副作用断言 | reader/reportwriter只读取真实safeharness文件，zero业务网络/probe/send/mutation；不能补case/check/EVpassed、改旧failure或删missing；该EV不赋Observability证据裁决authority |
| 具体TC | ["TC-INBOUND-001","TC-INBOUND-002","TC-INBOUND-003","TC-INBOUND-004","TC-INBOUND-005"]；每TC全部封闭参数及expected断言，不能代表实例 |
| planned EV | ["EV-CONTRACT-004"]；只由未来真实case/suite/check生成，不从表物化 |
| 固定report path | `reports/runs/<run_id>/evidence/EV-CONTRACT-004.json`及同ID`.md`；`reports/runs/<run_id>/evidence-index.md` |
| 原safe artifact | `artifacts/test/<run_id>/cases/<instance_id>.json`、`suites/<suite_id>/<context_id>/report.json`与两check；按05注册表精确反查 |
| scope/actual缺失 | synthetic只本项local机制；positive实际local_mechanism actualharness/完整instance；所声称actualpositive另须对应真实资格须真实资格。缺case/参数/check/basis/资格=blocked/not_evaluated，不skip后pass |
| 裁决影响 | 实际P0失败阻总体正向；若构成原六VETO按§11、S/A按§12；P0不风险接受。无材料暂停，不臆判失败或签署 |

| EV独立反查 | 固定合同 |
|---|---|
| DS与suite | ["DS-INBOUND-001"]；["SUITE-I"]；按05§9.2 expectedmanifest每instance唯一路由，不复制到多个suite |
| 原safeartifact | `artifacts/test/<run_id>/context.json`、`index.json`、`cases/<instance_id>.json`、`suites/<suite_id>/<context_id>/report.json`及safe stdout/stderr；`checks/run-context.json`和`checks/test-evidence.json` |
| 消费本EV的06门禁 | AC-FUNC-BR-004、AC-FUNC-BR-005、AC-BOUND-BR-005、AC-BOUND-BR-006、AC-SYNC-BR-E01、AC-SYNC-BR-OWNER、AC-SYNC-BR-PLATFORM、AC-STATE-BR-M06、AC-TX-BR-002、AC-NFR-BR-003、AC-NFR-BR-004；多卡引用同instance只执行/计数一次 |
| 原AC/VETO方向 | AC-BR-008、AC-BR-009、AC-BR-010、AC-BR-012、AC-BR-013、AC-BR-014；VETO-BR-004；不是通过结论 |
| 缺失影响 | 暂停受影响P0正向/交接；实际失败按本EV真实assertion及§11/12处理，不补finalEV |

#### AC-EVID-BR-CONTRACT-005 EV-CONTRACT-005 / CUT-BR-CHANGE 实例链核验

| 项 | 可判定合同（P0；当前planned/not_evaluated） |
|---|---|
| 原需求/设计 | AC-BR-004、AC-BR-011、AC-BR-012、AC-BR-019、VETO-BR-001；05§13.3当前evidence_plan_registry；03§8 E01/C03/§9 M04/M05/M13/M14/§15.2；本06§5~9对应独立门禁 |
| 正式对象/字段/协议/状态 | EvidencePage全部required owner/schema_version/kind/run_id/ev_id/status/tc_refs/instance_ids/context_ids/qualification_scope/context_ref/source_index_ref/case_refs/suite_refs/check_refs/ac_refs/veto_refs/failure_code/blockers；EV-CONTRACT-005、local_mechanism；05九root与ArtifactRef/ReportRef角色路径 |
| 通过条件 | 该EV exacttc_refs=["TC-CHANGE-001","TC-CHANGE-002","TC-CHANGE-003","TC-CHANGE-004"]；从每TC全部expectedinstance真实case/target/suite/context推导闭包、实际两个checks通过及digest/schema/status/scope吻合；passed要求全真实实例passed，不以静态表造材料；local只已实际执行局部机制，承诺actualpositive由对应门禁另核 |
| 失败条件 | orphan/missingparameter/case/check/suite/context/digest/current不符，或reportpassed而某expectedinstance未executed/failed/blocked/unavailable；归错scope或静态物化EV |
| 副作用断言 | reader/reportwriter只读取真实safeharness文件，zero业务网络/probe/send/mutation；不能补case/check/EVpassed、改旧failure或删missing；该EV不赋Observability证据裁决authority |
| 具体TC | ["TC-CHANGE-001","TC-CHANGE-002","TC-CHANGE-003","TC-CHANGE-004"]；每TC全部封闭参数及expected断言，不能代表实例 |
| planned EV | ["EV-CONTRACT-005"]；只由未来真实case/suite/check生成，不从表物化 |
| 固定report path | `reports/runs/<run_id>/evidence/EV-CONTRACT-005.json`及同ID`.md`；`reports/runs/<run_id>/evidence-index.md` |
| 原safe artifact | `artifacts/test/<run_id>/cases/<instance_id>.json`、`suites/<suite_id>/<context_id>/report.json`与两check；按05注册表精确反查 |
| scope/actual缺失 | synthetic只本项local机制；positive实际local_mechanism actualharness/完整instance；所声称actualpositive另须对应真实资格须真实资格。缺case/参数/check/basis/资格=blocked/not_evaluated，不skip后pass |
| 裁决影响 | 实际P0失败阻总体正向；若构成原六VETO按§11、S/A按§12；P0不风险接受。无材料暂停，不臆判失败或签署 |

| EV独立反查 | 固定合同 |
|---|---|
| DS与suite | ["DS-CHANGE-001"]；["SUITE-B"]；按05§9.2 expectedmanifest每instance唯一路由，不复制到多个suite |
| 原safeartifact | `artifacts/test/<run_id>/context.json`、`index.json`、`cases/<instance_id>.json`、`suites/<suite_id>/<context_id>/report.json`及safe stdout/stderr；`checks/run-context.json`和`checks/test-evidence.json` |
| 消费本EV的06门禁 | AC-FUNC-BR-006、AC-BOUND-BR-005、AC-BOUND-BR-007、AC-BOUND-BR-013、AC-SYNC-BR-C03、AC-SYNC-BR-E01、AC-SYNC-BR-PLATFORM、AC-TX-BR-004、AC-NFR-BR-004、AC-NFR-BR-013；多卡引用同instance只执行/计数一次 |
| 原AC/VETO方向 | AC-BR-004、AC-BR-011、AC-BR-012、AC-BR-019；VETO-BR-001；不是通过结论 |
| 缺失影响 | 暂停受影响P0正向/交接；实际失败按本EV真实assertion及§11/12处理，不补finalEV |

#### AC-EVID-BR-CONTRACT-006 EV-CONTRACT-006 / CUT-BR-PRESENT 实例链核验

| 项 | 可判定合同（P0；当前planned/not_evaluated） |
|---|---|
| 原需求/设计 | AC-BR-015、AC-BR-016、AC-BR-019、AC-BR-021、VETO-BR-002、VETO-BR-003；05§13.3当前evidence_plan_registry；03§8 C04/E02/§9 M07/§15.2；本06§5~9对应独立门禁 |
| 正式对象/字段/协议/状态 | EvidencePage全部required owner/schema_version/kind/run_id/ev_id/status/tc_refs/instance_ids/context_ids/qualification_scope/context_ref/source_index_ref/case_refs/suite_refs/check_refs/ac_refs/veto_refs/failure_code/blockers；EV-CONTRACT-006、local_mechanism；05九root与ArtifactRef/ReportRef角色路径 |
| 通过条件 | 该EV exacttc_refs=["TC-PRESENT-001","TC-PRESENT-002","TC-PRESENT-003","TC-PRESENT-004"]；从每TC全部expectedinstance真实case/target/suite/context推导闭包、实际两个checks通过及digest/schema/status/scope吻合；passed要求全真实实例passed，不以静态表造材料；local只已实际执行局部机制，承诺actualpositive由对应门禁另核 |
| 失败条件 | orphan/missingparameter/case/check/suite/context/digest/current不符，或reportpassed而某expectedinstance未executed/failed/blocked/unavailable；归错scope或静态物化EV |
| 副作用断言 | reader/reportwriter只读取真实safeharness文件，zero业务网络/probe/send/mutation；不能补case/check/EVpassed、改旧failure或删missing；该EV不赋Observability证据裁决authority |
| 具体TC | ["TC-PRESENT-001","TC-PRESENT-002","TC-PRESENT-003","TC-PRESENT-004"]；每TC全部封闭参数及expected断言，不能代表实例 |
| planned EV | ["EV-CONTRACT-006"]；只由未来真实case/suite/check生成，不从表物化 |
| 固定report path | `reports/runs/<run_id>/evidence/EV-CONTRACT-006.json`及同ID`.md`；`reports/runs/<run_id>/evidence-index.md` |
| 原safe artifact | `artifacts/test/<run_id>/cases/<instance_id>.json`、`suites/<suite_id>/<context_id>/report.json`与两check；按05注册表精确反查 |
| scope/actual缺失 | synthetic只本项local机制；positive实际local_mechanism actualharness/完整instance；所声称actualpositive另须对应真实资格须真实资格。缺case/参数/check/basis/资格=blocked/not_evaluated，不skip后pass |
| 裁决影响 | 实际P0失败阻总体正向；若构成原六VETO按§11、S/A按§12；P0不风险接受。无材料暂停，不臆判失败或签署 |

| EV独立反查 | 固定合同 |
|---|---|
| DS与suite | ["DS-PRESENT-001"]；["SUITE-A"]；按05§9.2 expectedmanifest每instance唯一路由，不复制到多个suite |
| 原safeartifact | `artifacts/test/<run_id>/context.json`、`index.json`、`cases/<instance_id>.json`、`suites/<suite_id>/<context_id>/report.json`及safe stdout/stderr；`checks/run-context.json`和`checks/test-evidence.json` |
| 消费本EV的06门禁 | AC-FUNC-BR-007、AC-BOUND-BR-008、AC-BOUND-BR-009、AC-SYNC-BR-C04、AC-SYNC-BR-E02、AC-SYNC-BR-OWNER、AC-STATE-BR-M07、AC-NFR-BR-005、AC-NFR-BR-006；多卡引用同instance只执行/计数一次 |
| 原AC/VETO方向 | AC-BR-015、AC-BR-016、AC-BR-019、AC-BR-021；VETO-BR-002、VETO-BR-003；不是通过结论 |
| 缺失影响 | 暂停受影响P0正向/交接；实际失败按本EV真实assertion及§11/12处理，不补finalEV |

#### AC-EVID-BR-CONTRACT-007 EV-CONTRACT-007 / CUT-BR-ATTACH 实例链核验

| 项 | 可判定合同（P0；当前planned/not_evaluated） |
|---|---|
| 原需求/设计 | AC-BR-015、AC-BR-017、AC-BR-020、VETO-BR-003；05§13.3当前evidence_plan_registry；03§8 C04/E01/§13/§15.2；本06§5~9对应独立门禁 |
| 正式对象/字段/协议/状态 | EvidencePage全部required owner/schema_version/kind/run_id/ev_id/status/tc_refs/instance_ids/context_ids/qualification_scope/context_ref/source_index_ref/case_refs/suite_refs/check_refs/ac_refs/veto_refs/failure_code/blockers；EV-CONTRACT-007、local_mechanism；05九root与ArtifactRef/ReportRef角色路径 |
| 通过条件 | 该EV exacttc_refs=["TC-ATTACH-001","TC-ATTACH-002","TC-ATTACH-003","TC-ATTACH-004"]；从每TC全部expectedinstance真实case/target/suite/context推导闭包、实际两个checks通过及digest/schema/status/scope吻合；passed要求全真实实例passed，不以静态表造材料；local只已实际执行局部机制，承诺actualpositive由对应门禁另核 |
| 失败条件 | orphan/missingparameter/case/check/suite/context/digest/current不符，或reportpassed而某expectedinstance未executed/failed/blocked/unavailable；归错scope或静态物化EV |
| 副作用断言 | reader/reportwriter只读取真实safeharness文件，zero业务网络/probe/send/mutation；不能补case/check/EVpassed、改旧failure或删missing；该EV不赋Observability证据裁决authority |
| 具体TC | ["TC-ATTACH-001","TC-ATTACH-002","TC-ATTACH-003","TC-ATTACH-004"]；每TC全部封闭参数及expected断言，不能代表实例 |
| planned EV | ["EV-CONTRACT-007"]；只由未来真实case/suite/check生成，不从表物化 |
| 固定report path | `reports/runs/<run_id>/evidence/EV-CONTRACT-007.json`及同ID`.md`；`reports/runs/<run_id>/evidence-index.md` |
| 原safe artifact | `artifacts/test/<run_id>/cases/<instance_id>.json`、`suites/<suite_id>/<context_id>/report.json`与两check；按05注册表精确反查 |
| scope/actual缺失 | synthetic只本项local机制；positive实际local_mechanism actualharness/完整instance；所声称actualpositive另须对应真实资格须真实资格。缺case/参数/check/basis/资格=blocked/not_evaluated，不skip后pass |
| 裁决影响 | 实际P0失败阻总体正向；若构成原六VETO按§11、S/A按§12；P0不风险接受。无材料暂停，不臆判失败或签署 |

| EV独立反查 | 固定合同 |
|---|---|
| DS与suite | ["DS-ATTACH-001"]；["SUITE-A","SUITE-B"]；按05§9.2 expectedmanifest每instance唯一路由，不复制到多个suite |
| 原safeartifact | `artifacts/test/<run_id>/context.json`、`index.json`、`cases/<instance_id>.json`、`suites/<suite_id>/<context_id>/report.json`及safe stdout/stderr；`checks/run-context.json`和`checks/test-evidence.json` |
| 消费本EV的06门禁 | AC-FUNC-BR-008、AC-BOUND-BR-009、AC-SYNC-BR-C04、AC-SYNC-BR-E02、AC-SYNC-BR-OWNER、AC-NFR-BR-006；多卡引用同instance只执行/计数一次 |
| 原AC/VETO方向 | AC-BR-015、AC-BR-017、AC-BR-020；VETO-BR-003；不是通过结论 |
| 缺失影响 | 暂停受影响P0正向/交接；实际失败按本EV真实assertion及§11/12处理，不补finalEV |

#### AC-EVID-BR-CONTRACT-008 EV-CONTRACT-008 / CUT-BR-DELIVERY 实例链核验

| 项 | 可判定合同（P0；当前planned/not_evaluated） |
|---|---|
| 原需求/设计 | AC-BR-015、AC-BR-018、AC-BR-019、AC-BR-020、AC-BR-021、AC-BR-030、VETO-BR-004；05§13.3当前evidence_plan_registry；03§8 C04/J01/§9 M08/M09/§10.3/§15.2；本06§5~9对应独立门禁 |
| 正式对象/字段/协议/状态 | EvidencePage全部required owner/schema_version/kind/run_id/ev_id/status/tc_refs/instance_ids/context_ids/qualification_scope/context_ref/source_index_ref/case_refs/suite_refs/check_refs/ac_refs/veto_refs/failure_code/blockers；EV-CONTRACT-008、local_mechanism；05九root与ArtifactRef/ReportRef角色路径 |
| 通过条件 | 该EV exacttc_refs=["TC-DELIVERY-001","TC-DELIVERY-002","TC-DELIVERY-003","TC-DELIVERY-004","TC-DELIVERY-005"]；从每TC全部expectedinstance真实case/target/suite/context推导闭包、实际两个checks通过及digest/schema/status/scope吻合；passed要求全真实实例passed，不以静态表造材料；local只已实际执行局部机制，承诺actualpositive由对应门禁另核 |
| 失败条件 | orphan/missingparameter/case/check/suite/context/digest/current不符，或reportpassed而某expectedinstance未executed/failed/blocked/unavailable；归错scope或静态物化EV |
| 副作用断言 | reader/reportwriter只读取真实safeharness文件，zero业务网络/probe/send/mutation；不能补case/check/EVpassed、改旧failure或删missing；该EV不赋Observability证据裁决authority |
| 具体TC | ["TC-DELIVERY-001","TC-DELIVERY-002","TC-DELIVERY-003","TC-DELIVERY-004","TC-DELIVERY-005"]；每TC全部封闭参数及expected断言，不能代表实例 |
| planned EV | ["EV-CONTRACT-008"]；只由未来真实case/suite/check生成，不从表物化 |
| 固定report path | `reports/runs/<run_id>/evidence/EV-CONTRACT-008.json`及同ID`.md`；`reports/runs/<run_id>/evidence-index.md` |
| 原safe artifact | `artifacts/test/<run_id>/cases/<instance_id>.json`、`suites/<suite_id>/<context_id>/report.json`与两check；按05注册表精确反查 |
| scope/actual缺失 | synthetic只本项local机制；positive实际local_mechanism actualharness/完整instance；所声称actualpositive另须对应真实资格须真实资格。缺case/参数/check/basis/资格=blocked/not_evaluated，不skip后pass |
| 裁决影响 | 实际P0失败阻总体正向；若构成原六VETO按§11、S/A按§12；P0不风险接受。无材料暂停，不臆判失败或签署 |

| EV独立反查 | 固定合同 |
|---|---|
| DS与suite | ["DS-DELIVERY-001"]；["SUITE-C"]；按05§9.2 expectedmanifest每instance唯一路由，不复制到多个suite |
| 原safeartifact | `artifacts/test/<run_id>/context.json`、`index.json`、`cases/<instance_id>.json`、`suites/<suite_id>/<context_id>/report.json`及safe stdout/stderr；`checks/run-context.json`和`checks/test-evidence.json` |
| 消费本EV的06门禁 | AC-FUNC-BR-009、AC-BOUND-BR-002、AC-BOUND-BR-010、AC-BOUND-BR-014、AC-SYNC-BR-C04、AC-SYNC-BR-Q02、AC-SYNC-BR-E02、AC-SYNC-BR-J01、AC-SYNC-BR-J02、AC-SYNC-BR-PLATFORM、AC-STATE-BR-M08、AC-STATE-BR-M09、AC-TX-BR-002、AC-TX-BR-003、AC-TX-BR-005、AC-NFR-BR-005、AC-NFR-BR-007、AC-NFR-BR-011；多卡引用同instance只执行/计数一次 |
| 原AC/VETO方向 | AC-BR-015、AC-BR-018、AC-BR-019、AC-BR-020、AC-BR-021、AC-BR-030；VETO-BR-004；不是通过结论 |
| 缺失影响 | 暂停受影响P0正向/交接；实际失败按本EV真实assertion及§11/12处理，不补finalEV |

#### AC-EVID-BR-CONTRACT-009 EV-CONTRACT-009 / CUT-BR-CALLBACK 实例链核验

| 项 | 可判定合同（P0；当前planned/not_evaluated） |
|---|---|
| 原需求/设计 | AC-BR-014、AC-BR-022、AC-BR-023、AC-BR-024、AC-BR-025、AC-BR-026、AC-BR-027、VETO-BR-002、VETO-BR-004、VETO-BR-006；05§13.3当前evidence_plan_registry；03§8 C05/E03/§9 M10/M11/§15.2；本06§5~9对应独立门禁 |
| 正式对象/字段/协议/状态 | EvidencePage全部required owner/schema_version/kind/run_id/ev_id/status/tc_refs/instance_ids/context_ids/qualification_scope/context_ref/source_index_ref/case_refs/suite_refs/check_refs/ac_refs/veto_refs/failure_code/blockers；EV-CONTRACT-009、local_mechanism；05九root与ArtifactRef/ReportRef角色路径 |
| 通过条件 | 该EV exacttc_refs=["TC-CALLBACK-001","TC-CALLBACK-002","TC-CALLBACK-003","TC-CALLBACK-004","TC-CALLBACK-005"]；从每TC全部expectedinstance真实case/target/suite/context推导闭包、实际两个checks通过及digest/schema/status/scope吻合；passed要求全真实实例passed，不以静态表造材料；local只已实际执行局部机制，承诺actualpositive由对应门禁另核 |
| 失败条件 | orphan/missingparameter/case/check/suite/context/digest/current不符，或reportpassed而某expectedinstance未executed/failed/blocked/unavailable；归错scope或静态物化EV |
| 副作用断言 | reader/reportwriter只读取真实safeharness文件，zero业务网络/probe/send/mutation；不能补case/check/EVpassed、改旧failure或删missing；该EV不赋Observability证据裁决authority |
| 具体TC | ["TC-CALLBACK-001","TC-CALLBACK-002","TC-CALLBACK-003","TC-CALLBACK-004","TC-CALLBACK-005"]；每TC全部封闭参数及expected断言，不能代表实例 |
| planned EV | ["EV-CONTRACT-009"]；只由未来真实case/suite/check生成，不从表物化 |
| 固定report path | `reports/runs/<run_id>/evidence/EV-CONTRACT-009.json`及同ID`.md`；`reports/runs/<run_id>/evidence-index.md` |
| 原safe artifact | `artifacts/test/<run_id>/cases/<instance_id>.json`、`suites/<suite_id>/<context_id>/report.json`与两check；按05注册表精确反查 |
| scope/actual缺失 | synthetic只本项local机制；positive实际local_mechanism actualharness/完整instance；所声称actualpositive另须对应真实资格须真实资格。缺case/参数/check/basis/资格=blocked/not_evaluated，不skip后pass |
| 裁决影响 | 实际P0失败阻总体正向；若构成原六VETO按§11、S/A按§12；P0不风险接受。无材料暂停，不臆判失败或签署 |

| EV独立反查 | 固定合同 |
|---|---|
| DS与suite | ["DS-CALLBACK-001"]；["SUITE-A","SUITE-P"]；按05§9.2 expectedmanifest每instance唯一路由，不复制到多个suite |
| 原safeartifact | `artifacts/test/<run_id>/context.json`、`index.json`、`cases/<instance_id>.json`、`suites/<suite_id>/<context_id>/report.json`及safe stdout/stderr；`checks/run-context.json`和`checks/test-evidence.json` |
| 消费本EV的06门禁 | AC-FUNC-BR-010、AC-FUNC-BR-011、AC-BOUND-BR-002、AC-BOUND-BR-003、AC-BOUND-BR-011、AC-SYNC-BR-C05、AC-SYNC-BR-E03、AC-SYNC-BR-OWNER、AC-SYNC-BR-PLATFORM、AC-STATE-BR-M10、AC-STATE-BR-M11、AC-TX-BR-003、AC-NFR-BR-003、AC-NFR-BR-008、AC-NFR-BR-009；多卡引用同instance只执行/计数一次 |
| 原AC/VETO方向 | AC-BR-014、AC-BR-022、AC-BR-023、AC-BR-024、AC-BR-025、AC-BR-026、AC-BR-027；VETO-BR-002、VETO-BR-004、VETO-BR-006；不是通过结论 |
| 缺失影响 | 暂停受影响P0正向/交接；实际失败按本EV真实assertion及§11/12处理，不补finalEV |

#### AC-EVID-BR-CONTRACT-010 EV-CONTRACT-010 / CUT-BR-KEY 实例链核验

| 项 | 可判定合同（P0；当前planned/not_evaluated） |
|---|---|
| 原需求/设计 | AC-BR-003、AC-BR-007、AC-BR-009、AC-BR-012、AC-BR-018、AC-BR-023、AC-BR-026、AC-BR-027、AC-BR-029、AC-BR-031、AC-BR-034、AC-BR-035、VETO-BR-005；05§13.3当前evidence_plan_registry；03§11/§9 M12/§8 J05/§15.2；本06§5~9对应独立门禁 |
| 正式对象/字段/协议/状态 | EvidencePage全部required owner/schema_version/kind/run_id/ev_id/status/tc_refs/instance_ids/context_ids/qualification_scope/context_ref/source_index_ref/case_refs/suite_refs/check_refs/ac_refs/veto_refs/failure_code/blockers；EV-CONTRACT-010、local_mechanism；05九root与ArtifactRef/ReportRef角色路径 |
| 通过条件 | 该EV exacttc_refs=["TC-KEY-001","TC-KEY-002","TC-KEY-003","TC-KEY-004","TC-KEY-005"]；从每TC全部expectedinstance真实case/target/suite/context推导闭包、实际两个checks通过及digest/schema/status/scope吻合；passed要求全真实实例passed，不以静态表造材料；local只已实际执行局部机制，承诺actualpositive由对应门禁另核 |
| 失败条件 | orphan/missingparameter/case/check/suite/context/digest/current不符，或reportpassed而某expectedinstance未executed/failed/blocked/unavailable；归错scope或静态物化EV |
| 副作用断言 | reader/reportwriter只读取真实safeharness文件，zero业务网络/probe/send/mutation；不能补case/check/EVpassed、改旧failure或删missing；该EV不赋Observability证据裁决authority |
| 具体TC | ["TC-KEY-001","TC-KEY-002","TC-KEY-003","TC-KEY-004","TC-KEY-005"]；每TC全部封闭参数及expected断言，不能代表实例 |
| planned EV | ["EV-CONTRACT-010"]；只由未来真实case/suite/check生成，不从表物化 |
| 固定report path | `reports/runs/<run_id>/evidence/EV-CONTRACT-010.json`及同ID`.md`；`reports/runs/<run_id>/evidence-index.md` |
| 原safe artifact | `artifacts/test/<run_id>/cases/<instance_id>.json`、`suites/<suite_id>/<context_id>/report.json`与两check；按05注册表精确反查 |
| scope/actual缺失 | synthetic只本项local机制；positive实际local_mechanism actualharness/完整instance；所声称actualpositive另须对应真实资格须真实资格。缺case/参数/check/basis/资格=blocked/not_evaluated，不skip后pass |
| 裁决影响 | 实际P0失败阻总体正向；若构成原六VETO按§11、S/A按§12；P0不风险接受。无材料暂停，不臆判失败或签署 |

| EV独立反查 | 固定合同 |
|---|---|
| DS与suite | ["DS-KEY-001"]；["SUITE-C"]；按05§9.2 expectedmanifest每instance唯一路由，不复制到多个suite |
| 原safeartifact | `artifacts/test/<run_id>/context.json`、`index.json`、`cases/<instance_id>.json`、`suites/<suite_id>/<context_id>/report.json`及safe stdout/stderr；`checks/run-context.json`和`checks/test-evidence.json` |
| 消费本EV的06门禁 | AC-FUNC-BR-002、AC-FUNC-BR-005、AC-FUNC-BR-009、AC-FUNC-BR-012、AC-BOUND-BR-011、AC-BOUND-BR-012、AC-SYNC-BR-E03、AC-SYNC-BR-J05、AC-STATE-BR-M12、AC-TX-BR-001、AC-TX-BR-002、AC-TX-BR-006、AC-NFR-BR-002、AC-NFR-BR-004、AC-NFR-BR-007、AC-NFR-BR-009、AC-NFR-BR-011、AC-NFR-BR-013；多卡引用同instance只执行/计数一次 |
| 原AC/VETO方向 | AC-BR-003、AC-BR-007、AC-BR-009、AC-BR-012、AC-BR-018、AC-BR-023、AC-BR-026、AC-BR-027、AC-BR-029、AC-BR-031、AC-BR-034、AC-BR-035；VETO-BR-005；不是通过结论 |
| 缺失影响 | 暂停受影响P0正向/交接；实际失败按本EV真实assertion及§11/12处理，不补finalEV |

#### AC-EVID-BR-CONTRACT-011 EV-CONTRACT-011 / CUT-BR-CURSOR 实例链核验

| 项 | 可判定合同（P0；当前planned/not_evaluated） |
|---|---|
| 原需求/设计 | AC-BR-012、AC-BR-028、AC-BR-029、AC-BR-031、AC-BR-034、AC-BR-035、VETO-BR-005；05§13.3当前evidence_plan_registry；03§8 J03/§9 M13/M14/§15.2；本06§5~9对应独立门禁 |
| 正式对象/字段/协议/状态 | EvidencePage全部required owner/schema_version/kind/run_id/ev_id/status/tc_refs/instance_ids/context_ids/qualification_scope/context_ref/source_index_ref/case_refs/suite_refs/check_refs/ac_refs/veto_refs/failure_code/blockers；EV-CONTRACT-011、local_mechanism；05九root与ArtifactRef/ReportRef角色路径 |
| 通过条件 | 该EV exacttc_refs=["TC-CURSOR-001","TC-CURSOR-002","TC-CURSOR-003","TC-CURSOR-004"]；从每TC全部expectedinstance真实case/target/suite/context推导闭包、实际两个checks通过及digest/schema/status/scope吻合；passed要求全真实实例passed，不以静态表造材料；local只已实际执行局部机制，承诺actualpositive由对应门禁另核 |
| 失败条件 | orphan/missingparameter/case/check/suite/context/digest/current不符，或reportpassed而某expectedinstance未executed/failed/blocked/unavailable；归错scope或静态物化EV |
| 副作用断言 | reader/reportwriter只读取真实safeharness文件，zero业务网络/probe/send/mutation；不能补case/check/EVpassed、改旧failure或删missing；该EV不赋Observability证据裁决authority |
| 具体TC | ["TC-CURSOR-001","TC-CURSOR-002","TC-CURSOR-003","TC-CURSOR-004"]；每TC全部封闭参数及expected断言，不能代表实例 |
| planned EV | ["EV-CONTRACT-011"]；只由未来真实case/suite/check生成，不从表物化 |
| 固定report path | `reports/runs/<run_id>/evidence/EV-CONTRACT-011.json`及同ID`.md`；`reports/runs/<run_id>/evidence-index.md` |
| 原safe artifact | `artifacts/test/<run_id>/cases/<instance_id>.json`、`suites/<suite_id>/<context_id>/report.json`与两check；按05注册表精确反查 |
| scope/actual缺失 | synthetic只本项local机制；positive实际local_mechanism actualharness/完整instance；所声称actualpositive另须对应真实资格须真实资格。缺case/参数/check/basis/资格=blocked/not_evaluated，不skip后pass |
| 裁决影响 | 实际P0失败阻总体正向；若构成原六VETO按§11、S/A按§12；P0不风险接受。无材料暂停，不臆判失败或签署 |

| EV独立反查 | 固定合同 |
|---|---|
| DS与suite | ["DS-CURSOR-001"]；["SUITE-C"]；按05§9.2 expectedmanifest每instance唯一路由，不复制到多个suite |
| 原safeartifact | `artifacts/test/<run_id>/context.json`、`index.json`、`cases/<instance_id>.json`、`suites/<suite_id>/<context_id>/report.json`及safe stdout/stderr；`checks/run-context.json`和`checks/test-evidence.json` |
| 消费本EV的06门禁 | AC-FUNC-BR-006、AC-FUNC-BR-012、AC-FUNC-BR-014、AC-BOUND-BR-007、AC-BOUND-BR-013、AC-BOUND-BR-016、AC-SYNC-BR-Q03、AC-SYNC-BR-E01、AC-SYNC-BR-J03、AC-SYNC-BR-EVENT、AC-STATE-BR-M13、AC-STATE-BR-M14、AC-TX-BR-004、AC-NFR-BR-004、AC-NFR-BR-013、AC-NFR-BR-014；多卡引用同instance只执行/计数一次 |
| 原AC/VETO方向 | AC-BR-012、AC-BR-028、AC-BR-029、AC-BR-031、AC-BR-034、AC-BR-035；VETO-BR-005；不是通过结论 |
| 缺失影响 | 暂停受影响P0正向/交接；实际失败按本EV真实assertion及§11/12处理，不补finalEV |

#### AC-EVID-BR-CONTRACT-012 EV-CONTRACT-012 / CUT-BR-RATE 实例链核验

| 项 | 可判定合同（P0；当前planned/not_evaluated） |
|---|---|
| 原需求/设计 | AC-BR-030、AC-BR-034、AC-BR-036、VETO-BR-005；05§13.3 evidence_plan_registry；03§8 J01/J02/§9 M15/§11~12/§15.2；本06§5~9对应独立卡 |
| 正式对象/字段/协议/状态 | EvidencePage全部required owner/schema_version/kind/run_id/ev_id/status/tc_refs/instance_ids/context_ids/qualification_scope/context_ref/source_index_ref/case_refs/suite_refs/check_refs/ac_refs/veto_refs/failure_code/blockers；EV-CONTRACT-012、local_mechanism；ArtifactRef/ReportRef及9roots |
| 通过条件 | exacttc_refs=["TC-RATE-001","TC-RATE-002","TC-RATE-003","TC-RATE-004","TC-RATE-005"]；全部TCexpectedinstance→真实case/suite/context/target/output/两个check→EV；schema/CJSON/digest/rolepath/status/actualscope全核；passed须实例全passed，plan不生成result；local实例只局部机制actualharness执行，声明actualpositive另需所用current资格 |
| 失败条件 | 漏case/parameter/expectedassertion/check/target、suiteexit不符；staticpass/newEV补洞，failed/blocked/unavailable隐去；digest/crossrun/current不匹配或scope夸大 |
| 副作用断言 | reader/reportzerobusinessIO；writer先safeallowlist不archive raw；safefailedrun允许真实failedEV，missingcheck/case只partial；旧output/unknown原责任保留，无fakehumanreview |
| 具体TC | ["TC-RATE-001","TC-RATE-002","TC-RATE-003","TC-RATE-004","TC-RATE-005"]；每TC全部封闭参数及expected断言，不能代表实例 |
| planned EV | ["EV-CONTRACT-012"]；只由未来真实case/suite/check生成，不从表物化 |
| 固定report path | `reports/runs/<run_id>/evidence/EV-CONTRACT-012.json`及同ID`.md`；`reports/runs/<run_id>/evidence-index.md` |
| 原safe artifact | `artifacts/test/<run_id>/cases/<instance_id>.json`、`suites/<suite_id>/<context_id>/report.json`与两check；按05注册表精确反查 |
| scope/actual缺失 | synthetic只本项local机制；positive实际local_mechanism actualharness/expectedinstances，actualpositive与current资格独立须真实资格。缺case/参数/check/basis/资格=blocked/not_evaluated，不skip后pass |
| 裁决影响 | 实际P0失败阻总体正向；若构成原六VETO按§11、S/A按§12；P0不风险接受。无材料暂停，不臆判失败或签署 |

| EV独立反查 | 固定合同 |
|---|---|
| DS与suite | ["DS-RATE-001"]；["SUITE-C","SUITE-B"]；05唯一target路由，不复制instance |
| 原safeartifact | `artifacts/test/<run_id>/context.json`、`index.json`、`cases/<instance_id>.json`、`suites/<suite_id>/<context_id>/report.json`和safe stdout/stderr；`checks/run-context.json`、`checks/test-evidence.json` |
| 消费本EV的06门禁 | AC-FUNC-BR-013、AC-BOUND-BR-014、AC-SYNC-BR-J01、AC-SYNC-BR-PLATFORM、AC-STATE-BR-M15、AC-TX-BR-003、AC-TX-BR-005、AC-NFR-BR-010；多卡引用不增加execute/count |
| 原AC/VETO方向 | AC-BR-030、AC-BR-034、AC-BR-036；VETO-BR-005；只是planned方向 |
| 缺失影响 | 对应P0正向/交接暂停，不用riskacceptance或其他EV取代该scope；确证失败按§11/12 |

#### AC-EVID-BR-CONTRACT-013 EV-CONTRACT-013 / CUT-BR-RECOVERY 实例链核验

| 项 | 可判定合同（P0；当前planned/not_evaluated） |
|---|---|
| 原需求/设计 | AC-BR-021、AC-BR-028、AC-BR-031、AC-BR-034、AC-BR-036、VETO-BR-005；05§13.3 evidence_plan_registry；03§8 C06/J02/J03/J04/§9 M16/§15.2；本06§5~9对应独立卡 |
| 正式对象/字段/协议/状态 | EvidencePage全部required owner/schema_version/kind/run_id/ev_id/status/tc_refs/instance_ids/context_ids/qualification_scope/context_ref/source_index_ref/case_refs/suite_refs/check_refs/ac_refs/veto_refs/failure_code/blockers；EV-CONTRACT-013、local_mechanism；ArtifactRef/ReportRef及9roots |
| 通过条件 | exacttc_refs=["TC-RECOVERY-001","TC-RECOVERY-002","TC-RECOVERY-003","TC-RECOVERY-004","TC-RECOVERY-005"]；全部TCexpectedinstance→真实case/suite/context/target/output/两个check→EV；schema/CJSON/digest/rolepath/status/actualscope全核；passed须实例全passed，plan不生成result；local实例只局部机制actualharness执行，声明actualpositive另需所用current资格 |
| 失败条件 | 漏case/parameter/expectedassertion/check/target、suiteexit不符；staticpass/newEV补洞，failed/blocked/unavailable隐去；digest/crossrun/current不匹配或scope夸大 |
| 副作用断言 | reader/reportzerobusinessIO；writer先safeallowlist不archive raw；safefailedrun允许真实failedEV，missingcheck/case只partial；旧output/unknown原责任保留，无fakehumanreview |
| 具体TC | ["TC-RECOVERY-001","TC-RECOVERY-002","TC-RECOVERY-003","TC-RECOVERY-004","TC-RECOVERY-005"]；每TC全部封闭参数及expected断言，不能代表实例 |
| planned EV | ["EV-CONTRACT-013"]；只由未来真实case/suite/check生成，不从表物化 |
| 固定report path | `reports/runs/<run_id>/evidence/EV-CONTRACT-013.json`及同ID`.md`；`reports/runs/<run_id>/evidence-index.md` |
| 原safe artifact | `artifacts/test/<run_id>/cases/<instance_id>.json`、`suites/<suite_id>/<context_id>/report.json`与两check；按05注册表精确反查 |
| scope/actual缺失 | synthetic只本项local机制；positive实际local_mechanism actualharness/expectedinstances，actualpositive与current资格独立须真实资格。缺case/参数/check/basis/资格=blocked/not_evaluated，不skip后pass |
| 裁决影响 | 实际P0失败阻总体正向；若构成原六VETO按§11、S/A按§12；P0不风险接受。无材料暂停，不臆判失败或签署 |

| EV独立反查 | 固定合同 |
|---|---|
| DS与suite | ["DS-RECOVERY-001"]；["SUITE-C"]；05唯一target路由，不复制instance |
| 原safeartifact | `artifacts/test/<run_id>/context.json`、`index.json`、`cases/<instance_id>.json`、`suites/<suite_id>/<context_id>/report.json`和safe stdout/stderr；`checks/run-context.json`、`checks/test-evidence.json` |
| 消费本EV的06门禁 | AC-FUNC-BR-005、AC-FUNC-BR-011、AC-FUNC-BR-014、AC-BOUND-BR-010、AC-BOUND-BR-013、AC-BOUND-BR-014、AC-SYNC-BR-C06、AC-SYNC-BR-J02、AC-SYNC-BR-J03、AC-SYNC-BR-J04、AC-STATE-BR-M16、AC-TX-BR-004、AC-TX-BR-006、AC-NFR-BR-005、AC-NFR-BR-007、AC-NFR-BR-011、AC-NFR-BR-013；多卡引用不增加execute/count |
| 原AC/VETO方向 | AC-BR-021、AC-BR-028、AC-BR-031、AC-BR-034、AC-BR-036；VETO-BR-005；只是planned方向 |
| 缺失影响 | 对应P0正向/交接暂停，不用riskacceptance或其他EV取代该scope；确证失败按§11/12 |

#### AC-EVID-BR-CONTRACT-014 EV-CONTRACT-014 / CUT-BR-LOCAL 实例链核验

| 项 | 可判定合同（P0；当前planned/not_evaluated） |
|---|---|
| 原需求/设计 | AC-BR-007、AC-BR-018；05§13.3 evidence_plan_registry；03§10.1~10.4/§15.2；本06§5~9对应独立卡 |
| 正式对象/字段/协议/状态 | EvidencePage全部required owner/schema_version/kind/run_id/ev_id/status/tc_refs/instance_ids/context_ids/qualification_scope/context_ref/source_index_ref/case_refs/suite_refs/check_refs/ac_refs/veto_refs/failure_code/blockers；EV-CONTRACT-014、mixed；ArtifactRef/ReportRef及9roots |
| 通过条件 | exacttc_refs=["TC-LOCAL-001","TC-LOCAL-002","TC-LOCAL-003","TC-LOCAL-004","TC-LOCAL-005","TC-LOCAL-006"]；全部TCexpectedinstance→真实case/suite/context/target/output/两个check→EV；schema/CJSON/digest/rolepath/status/actualscope全核；passed须实例全passed，plan不生成result；包含LOCAL-006真实driver材料，不从其余local成功释放actualstore |
| 失败条件 | 漏case/parameter/expectedassertion/check/target、suiteexit不符；staticpass/newEV补洞，failed/blocked/unavailable隐去；digest/crossrun/current不匹配或scope夸大 |
| 副作用断言 | reader/reportzerobusinessIO；writer先safeallowlist不archive raw；safefailedrun允许真实failedEV，missingcheck/case只partial；旧output/unknown原责任保留，无fakehumanreview |
| 具体TC | ["TC-LOCAL-001","TC-LOCAL-002","TC-LOCAL-003","TC-LOCAL-004","TC-LOCAL-005","TC-LOCAL-006"]；每TC全部封闭参数及expected断言，不能代表实例 |
| planned EV | ["EV-CONTRACT-014"]；只由未来真实case/suite/check生成，不从表物化 |
| 固定report path | `reports/runs/<run_id>/evidence/EV-CONTRACT-014.json`及同ID`.md`；`reports/runs/<run_id>/evidence-index.md` |
| 原safe artifact | `artifacts/test/<run_id>/cases/<instance_id>.json`、`suites/<suite_id>/<context_id>/report.json`与两check；按05注册表精确反查 |
| scope/actual缺失 | synthetic只本项local机制；positive实际mixed actualharness/expectedinstances，actualpositive与current资格独立须真实资格。缺case/参数/check/basis/资格=blocked/not_evaluated，不skip后pass |
| 裁决影响 | 实际P0失败阻总体正向；若构成原六VETO按§11、S/A按§12；P0不风险接受。无材料暂停，不臆判失败或签署 |

| EV独立反查 | 固定合同 |
|---|---|
| DS与suite | ["DS-LOCAL-001"]；["SUITE-L","SUITE-REAL"]；05唯一target路由，不复制instance |
| 原safeartifact | `artifacts/test/<run_id>/context.json`、`index.json`、`cases/<instance_id>.json`、`suites/<suite_id>/<context_id>/report.json`和safe stdout/stderr；`checks/run-context.json`、`checks/test-evidence.json` |
| 消费本EV的06门禁 | AC-FUNC-BR-002、AC-FUNC-BR-003、AC-FUNC-BR-009、AC-FUNC-BR-014、AC-BOUND-BR-001、AC-BOUND-BR-006、AC-BOUND-BR-012、AC-BOUND-BR-014、AC-BOUND-BR-016、AC-SYNC-BR-C02、AC-SYNC-BR-C06、AC-SYNC-BR-J01、AC-SYNC-BR-J02、AC-SYNC-BR-J03、AC-SYNC-BR-J04、AC-SYNC-BR-J05、AC-SYNC-BR-LOCAL、AC-STATE-BR-M01、AC-STATE-BR-M02、AC-STATE-BR-M03、AC-STATE-BR-M04、AC-STATE-BR-M05、AC-STATE-BR-M06、AC-STATE-BR-M07、AC-STATE-BR-M08、AC-STATE-BR-M09、AC-STATE-BR-M10、AC-STATE-BR-M11、AC-STATE-BR-M12、AC-STATE-BR-M13、AC-STATE-BR-M14、AC-STATE-BR-M15、AC-STATE-BR-M16、AC-STATE-BR-M17、AC-TX-BR-001、AC-TX-BR-002、AC-TX-BR-003、AC-TX-BR-004、AC-TX-BR-005、AC-TX-BR-006、AC-TX-BR-007、AC-NFR-BR-002、AC-NFR-BR-007、AC-NFR-BR-009、AC-NFR-BR-010、AC-NFR-BR-012、AC-NFR-BR-013；多卡引用不增加execute/count |
| 原AC/VETO方向 | AC-BR-007、AC-BR-018；无独立VETO，沿原AC；只是planned方向 |
| 缺失影响 | 对应P0正向/交接暂停，不用riskacceptance或其他EV取代该scope；确证失败按§11/12 |

#### AC-EVID-BR-CONTRACT-015 EV-CONTRACT-015 / CUT-BR-READ 实例链核验

| 项 | 可判定合同（P0；当前planned/not_evaluated） |
|---|---|
| 原需求/设计 | AC-BR-026、AC-BR-033、AC-BR-034、AC-BR-036、VETO-BR-005；05§13.3 evidence_plan_registry；03§8 Q01~Q04/§16.4/§15.2；本06§5~9对应独立卡 |
| 正式对象/字段/协议/状态 | EvidencePage全部required owner/schema_version/kind/run_id/ev_id/status/tc_refs/instance_ids/context_ids/qualification_scope/context_ref/source_index_ref/case_refs/suite_refs/check_refs/ac_refs/veto_refs/failure_code/blockers；EV-CONTRACT-015、local_mechanism；ArtifactRef/ReportRef及9roots |
| 通过条件 | exacttc_refs=["TC-READ-001","TC-READ-002","TC-READ-003","TC-READ-004"]；全部TCexpectedinstance→真实case/suite/context/target/output/两个check→EV；schema/CJSON/digest/rolepath/status/actualscope全核；passed须实例全passed，plan不生成result；local实例只局部机制actualharness执行，声明actualpositive另需所用current资格 |
| 失败条件 | 漏case/parameter/expectedassertion/check/target、suiteexit不符；staticpass/newEV补洞，failed/blocked/unavailable隐去；digest/crossrun/current不匹配或scope夸大 |
| 副作用断言 | reader/reportzerobusinessIO；writer先safeallowlist不archive raw；safefailedrun允许真实failedEV，missingcheck/case只partial；旧output/unknown原责任保留，无fakehumanreview |
| 具体TC | ["TC-READ-001","TC-READ-002","TC-READ-003","TC-READ-004"]；每TC全部封闭参数及expected断言，不能代表实例 |
| planned EV | ["EV-CONTRACT-015"]；只由未来真实case/suite/check生成，不从表物化 |
| 固定report path | `reports/runs/<run_id>/evidence/EV-CONTRACT-015.json`及同ID`.md`；`reports/runs/<run_id>/evidence-index.md` |
| 原safe artifact | `artifacts/test/<run_id>/cases/<instance_id>.json`、`suites/<suite_id>/<context_id>/report.json`与两check；按05注册表精确反查 |
| scope/actual缺失 | synthetic只本项local机制；positive实际local_mechanism actualharness/expectedinstances，actualpositive与current资格独立须真实资格。缺case/参数/check/basis/资格=blocked/not_evaluated，不skip后pass |
| 裁决影响 | 实际P0失败阻总体正向；若构成原六VETO按§11、S/A按§12；P0不风险接受。无材料暂停，不臆判失败或签署 |

| EV独立反查 | 固定合同 |
|---|---|
| DS与suite | ["DS-READ-001"]；["SUITE-R"]；05唯一target路由，不复制instance |
| 原safeartifact | `artifacts/test/<run_id>/context.json`、`index.json`、`cases/<instance_id>.json`、`suites/<suite_id>/<context_id>/report.json`和safe stdout/stderr；`checks/run-context.json`、`checks/test-evidence.json` |
| 消费本EV的06门禁 | AC-FUNC-BR-016、AC-BOUND-BR-016、AC-SYNC-BR-Q01、AC-SYNC-BR-Q02、AC-SYNC-BR-Q03、AC-SYNC-BR-Q04、AC-SYNC-BR-SHARED、AC-SYNC-BR-OWNER、AC-TX-BR-007、AC-NFR-BR-014；多卡引用不增加execute/count |
| 原AC/VETO方向 | AC-BR-026、AC-BR-033、AC-BR-034、AC-BR-036；VETO-BR-005；只是planned方向 |
| 缺失影响 | 对应P0正向/交接暂停，不用riskacceptance或其他EV取代该scope；确证失败按§11/12 |

#### AC-EVID-BR-CONTRACT-016 EV-CONTRACT-016 / CUT-BR-AUDIT 实例链核验

| 项 | 可判定合同（P0；当前planned/not_evaluated） |
|---|---|
| 原需求/设计 | AC-BR-028、AC-BR-032、AC-BR-034、AC-BR-035、AC-BR-036、VETO-BR-004；05§13.3 evidence_plan_registry；03§8 E04/O01/J04/§9 M17/§15.2；本06§5~9对应独立卡 |
| 正式对象/字段/协议/状态 | EvidencePage全部required owner/schema_version/kind/run_id/ev_id/status/tc_refs/instance_ids/context_ids/qualification_scope/context_ref/source_index_ref/case_refs/suite_refs/check_refs/ac_refs/veto_refs/failure_code/blockers；EV-CONTRACT-016、local_mechanism；ArtifactRef/ReportRef及9roots |
| 通过条件 | exacttc_refs=["TC-AUDIT-001","TC-AUDIT-002","TC-AUDIT-003","TC-AUDIT-004","TC-AUDIT-005"]；全部TCexpectedinstance→真实case/suite/context/target/output/两个check→EV；schema/CJSON/digest/rolepath/status/actualscope全核；passed须实例全passed，plan不生成result；local实例只局部机制actualharness执行，声明actualpositive另需所用current资格 |
| 失败条件 | 漏case/parameter/expectedassertion/check/target、suiteexit不符；staticpass/newEV补洞，failed/blocked/unavailable隐去；digest/crossrun/current不匹配或scope夸大 |
| 副作用断言 | reader/reportzerobusinessIO；writer先safeallowlist不archive raw；safefailedrun允许真实failedEV，missingcheck/case只partial；旧output/unknown原责任保留，无fakehumanreview |
| 具体TC | ["TC-AUDIT-001","TC-AUDIT-002","TC-AUDIT-003","TC-AUDIT-004","TC-AUDIT-005"]；每TC全部封闭参数及expected断言，不能代表实例 |
| planned EV | ["EV-CONTRACT-016"]；只由未来真实case/suite/check生成，不从表物化 |
| 固定report path | `reports/runs/<run_id>/evidence/EV-CONTRACT-016.json`及同ID`.md`；`reports/runs/<run_id>/evidence-index.md` |
| 原safe artifact | `artifacts/test/<run_id>/cases/<instance_id>.json`、`suites/<suite_id>/<context_id>/report.json`与两check；按05注册表精确反查 |
| scope/actual缺失 | synthetic只本项local机制；positive实际local_mechanism actualharness/expectedinstances，actualpositive与current资格独立须真实资格。缺case/参数/check/basis/资格=blocked/not_evaluated，不skip后pass |
| 裁决影响 | 实际P0失败阻总体正向；若构成原六VETO按§11、S/A按§12；P0不风险接受。无材料暂停，不臆判失败或签署 |

| EV独立反查 | 固定合同 |
|---|---|
| DS与suite | ["DS-AUDIT-001"]；["SUITE-C","SUITE-A"]；05唯一target路由，不复制instance |
| 原safeartifact | `artifacts/test/<run_id>/context.json`、`index.json`、`cases/<instance_id>.json`、`suites/<suite_id>/<context_id>/report.json`和safe stdout/stderr；`checks/run-context.json`、`checks/test-evidence.json` |
| 消费本EV的06门禁 | AC-FUNC-BR-011、AC-FUNC-BR-015、AC-BOUND-BR-015、AC-SYNC-BR-Q04、AC-SYNC-BR-E04、AC-SYNC-BR-O01、AC-SYNC-BR-J04、AC-SYNC-BR-OWNER、AC-SYNC-BR-EVENT、AC-STATE-BR-M17、AC-TX-BR-001、AC-TX-BR-007、AC-NFR-BR-012、AC-NFR-BR-014、AC-NFR-BR-015、AC-NFR-BR-016；多卡引用不增加execute/count |
| 原AC/VETO方向 | AC-BR-028、AC-BR-032、AC-BR-034、AC-BR-035、AC-BR-036；VETO-BR-004；只是planned方向 |
| 缺失影响 | 对应P0正向/交接暂停，不用riskacceptance或其他EV取代该scope；确证失败按§11/12 |

#### AC-EVID-BR-CONTRACT-017 EV-CONTRACT-017 / CUT-BR-CONFIG 实例链核验

| 项 | 可判定合同（P0；当前planned/not_evaluated） |
|---|---|
| 原需求/设计 | AC-BR-001、AC-BR-002、AC-BR-006；05§13.3 evidence_plan_registry；04§7/9/11/12.2；03§13；本06§5~9对应独立卡 |
| 正式对象/字段/协议/状态 | EvidencePage全部required owner/schema_version/kind/run_id/ev_id/status/tc_refs/instance_ids/context_ids/qualification_scope/context_ref/source_index_ref/case_refs/suite_refs/check_refs/ac_refs/veto_refs/failure_code/blockers；EV-CONTRACT-017、local_mechanism；ArtifactRef/ReportRef及9roots |
| 通过条件 | exacttc_refs=["TC-CONFIG-001","TC-CONFIG-002","TC-CONFIG-003","TC-CONFIG-004","TC-CONFIG-005","TC-CONFIG-006","TC-CONFIG-007","TC-CONFIG-008","TC-CONFIG-009","TC-CONFIG-010","TC-CONFIG-011","TC-CONFIG-012"]；全部TCexpectedinstance→真实case/suite/context/target/output/两个check→EV；schema/CJSON/digest/rolepath/status/actualscope全核；passed须实例全passed，plan不生成result；local实例只局部机制actualharness执行，声明actualpositive另需所用current资格 |
| 失败条件 | 漏case/parameter/expectedassertion/check/target、suiteexit不符；staticpass/newEV补洞，failed/blocked/unavailable隐去；digest/crossrun/current不匹配或scope夸大 |
| 副作用断言 | reader/reportzerobusinessIO；writer先safeallowlist不archive raw；safefailedrun允许真实failedEV，missingcheck/case只partial；旧output/unknown原责任保留，无fakehumanreview |
| 具体TC | ["TC-CONFIG-001","TC-CONFIG-002","TC-CONFIG-003","TC-CONFIG-004","TC-CONFIG-005","TC-CONFIG-006","TC-CONFIG-007","TC-CONFIG-008","TC-CONFIG-009","TC-CONFIG-010","TC-CONFIG-011","TC-CONFIG-012"]；每TC全部封闭参数及expected断言，不能代表实例 |
| planned EV | ["EV-CONTRACT-017"]；只由未来真实case/suite/check生成，不从表物化 |
| 固定report path | `reports/runs/<run_id>/evidence/EV-CONTRACT-017.json`及同ID`.md`；`reports/runs/<run_id>/evidence-index.md` |
| 原safe artifact | `artifacts/test/<run_id>/cases/<instance_id>.json`、`suites/<suite_id>/<context_id>/report.json`与两check；按05注册表精确反查 |
| scope/actual缺失 | synthetic只本项local机制；positive实际local_mechanism actualharness/expectedinstances，actualpositive与current资格独立须真实资格。缺case/参数/check/basis/资格=blocked/not_evaluated，不skip后pass |
| 裁决影响 | 实际P0失败阻总体正向；若构成原六VETO按§11、S/A按§12；P0不风险接受。无材料暂停，不臆判失败或签署 |

| EV独立反查 | 固定合同 |
|---|---|
| DS与suite | ["DS-CONFIG-001"]；["SUITE-B","SUITE-I","SUITE-A","SUITE-P","SUITE-C","SUITE-W","SUITE-J"]；05唯一target路由，不复制instance |
| 原safeartifact | `artifacts/test/<run_id>/context.json`、`index.json`、`cases/<instance_id>.json`、`suites/<suite_id>/<context_id>/report.json`和safe stdout/stderr；`checks/run-context.json`、`checks/test-evidence.json` |
| 消费本EV的06门禁 | AC-FUNC-BR-001、AC-FUNC-BR-007、AC-FUNC-BR-013、AC-BOUND-BR-002、AC-BOUND-BR-004、AC-BOUND-BR-012、AC-BOUND-BR-017、AC-SYNC-BR-C01、AC-SYNC-BR-J05、AC-SYNC-BR-COMPILE、AC-SYNC-BR-PLATFORM、AC-SYNC-BR-LOCAL、AC-TX-BR-005、AC-TX-BR-006、AC-NFR-BR-001、AC-NFR-BR-003、AC-NFR-BR-005、AC-NFR-BR-010、AC-NFR-BR-011、AC-NFR-BR-015；多卡引用不增加execute/count |
| 原AC/VETO方向 | AC-BR-001、AC-BR-002、AC-BR-006；无独立VETO，沿原AC；只是planned方向 |
| 缺失影响 | 对应P0正向/交接暂停，不用riskacceptance或其他EV取代该scope；确证失败按§11/12 |

#### AC-EVID-BR-CONTRACT-018 EV-CONTRACT-018 / CUT-BR-PRIVATE 实例链核验

| 项 | 可判定合同（P0；当前planned/not_evaluated） |
|---|---|
| 原需求/设计 | AC-BR-002、AC-BR-005、AC-BR-013、AC-BR-016、AC-BR-017、AC-BR-020、AC-BR-025、AC-BR-037、AC-BR-038、VETO-BR-003；05§13.3 evidence_plan_registry；03§13~15；04§8；本06§5~9对应独立卡 |
| 正式对象/字段/协议/状态 | EvidencePage全部required owner/schema_version/kind/run_id/ev_id/status/tc_refs/instance_ids/context_ids/qualification_scope/context_ref/source_index_ref/case_refs/suite_refs/check_refs/ac_refs/veto_refs/failure_code/blockers；EV-CONTRACT-018、local_mechanism；ArtifactRef/ReportRef及9roots |
| 通过条件 | exacttc_refs=["TC-PRIVATE-001","TC-PRIVATE-002","TC-PRIVATE-003","TC-PRIVATE-004","TC-PRIVATE-005"]；全部TCexpectedinstance→真实case/suite/context/target/output/两个check→EV；schema/CJSON/digest/rolepath/status/actualscope全核；passed须实例全passed，plan不生成result；local实例只局部机制actualharness执行，声明actualpositive另需所用current资格 |
| 失败条件 | 漏case/parameter/expectedassertion/check/target、suiteexit不符；staticpass/newEV补洞，failed/blocked/unavailable隐去；digest/crossrun/current不匹配或scope夸大 |
| 副作用断言 | reader/reportzerobusinessIO；writer先safeallowlist不archive raw；safefailedrun允许真实failedEV，missingcheck/case只partial；旧output/unknown原责任保留，无fakehumanreview |
| 具体TC | ["TC-PRIVATE-001","TC-PRIVATE-002","TC-PRIVATE-003","TC-PRIVATE-004","TC-PRIVATE-005"]；每TC全部封闭参数及expected断言，不能代表实例 |
| planned EV | ["EV-CONTRACT-018"]；只由未来真实case/suite/check生成，不从表物化 |
| 固定report path | `reports/runs/<run_id>/evidence/EV-CONTRACT-018.json`及同ID`.md`；`reports/runs/<run_id>/evidence-index.md` |
| 原safe artifact | `artifacts/test/<run_id>/cases/<instance_id>.json`、`suites/<suite_id>/<context_id>/report.json`与两check；按05注册表精确反查 |
| scope/actual缺失 | synthetic只本项local机制；positive实际local_mechanism actualharness/expectedinstances，actualpositive与current资格独立须真实资格。缺case/参数/check/basis/资格=blocked/not_evaluated，不skip后pass |
| 裁决影响 | 实际P0失败阻总体正向；若构成原六VETO按§11、S/A按§12；P0不风险接受。无材料暂停，不臆判失败或签署 |

| EV独立反查 | 固定合同 |
|---|---|
| DS与suite | ["DS-PRIVATE-001"]；["SUITE-P"]；05唯一target路由，不复制instance |
| 原safeartifact | `artifacts/test/<run_id>/context.json`、`index.json`、`cases/<instance_id>.json`、`suites/<suite_id>/<context_id>/report.json`和safe stdout/stderr；`checks/run-context.json`、`checks/test-evidence.json` |
| 消费本EV的06门禁 | AC-FUNC-BR-001、AC-FUNC-BR-004、AC-FUNC-BR-007、AC-FUNC-BR-008、AC-FUNC-BR-010、AC-FUNC-BR-015、AC-FUNC-BR-016、AC-BOUND-BR-001、AC-BOUND-BR-004、AC-BOUND-BR-005、AC-BOUND-BR-008、AC-BOUND-BR-009、AC-BOUND-BR-011、AC-BOUND-BR-015、AC-SYNC-BR-E01、AC-SYNC-BR-E03、AC-SYNC-BR-SHARED、AC-SYNC-BR-PLATFORM、AC-NFR-BR-001、AC-NFR-BR-006、AC-NFR-BR-008、AC-NFR-BR-012、AC-NFR-BR-015、AC-NFR-BR-016；多卡引用不增加execute/count |
| 原AC/VETO方向 | AC-BR-002、AC-BR-005、AC-BR-013、AC-BR-016、AC-BR-017、AC-BR-020、AC-BR-025、AC-BR-037、AC-BR-038；VETO-BR-003；只是planned方向 |
| 缺失影响 | 对应P0正向/交接暂停，不用riskacceptance或其他EV取代该scope；确证失败按§11/12 |

#### AC-EVID-BR-CONTRACT-019 EV-CONTRACT-019 / CUT-BR-ENTRY 实例链核验

| 项 | 可判定合同（P0；当前planned/not_evaluated） |
|---|---|
| 原需求/设计 | AC-BR-008、AC-BR-014、AC-BR-027；05§13.3 evidence_plan_registry；03§7外层/§8 J/§9 M18~M21/§15；04§12 CFG-CUT-011；本06§5~9对应独立卡 |
| 正式对象/字段/协议/状态 | EvidencePage全部required owner/schema_version/kind/run_id/ev_id/status/tc_refs/instance_ids/context_ids/qualification_scope/context_ref/source_index_ref/case_refs/suite_refs/check_refs/ac_refs/veto_refs/failure_code/blockers；EV-CONTRACT-019、local_mechanism；ArtifactRef/ReportRef及9roots |
| 通过条件 | exacttc_refs=["TC-ENTRY-001","TC-ENTRY-002","TC-ENTRY-003","TC-ENTRY-004","TC-ENTRY-005","TC-ENTRY-006","TC-ENTRY-007"]；全部TCexpectedinstance→真实case/suite/context/target/output/两个check→EV；schema/CJSON/digest/rolepath/status/actualscope全核；passed须实例全passed，plan不生成result；local实例只局部机制actualharness执行，声明actualpositive另需所用current资格 |
| 失败条件 | 漏case/parameter/expectedassertion/check/target、suiteexit不符；staticpass/newEV补洞，failed/blocked/unavailable隐去；digest/crossrun/current不匹配或scope夸大 |
| 副作用断言 | reader/reportzerobusinessIO；writer先safeallowlist不archive raw；safefailedrun允许真实failedEV，missingcheck/case只partial；旧output/unknown原责任保留，无fakehumanreview |
| 具体TC | ["TC-ENTRY-001","TC-ENTRY-002","TC-ENTRY-003","TC-ENTRY-004","TC-ENTRY-005","TC-ENTRY-006","TC-ENTRY-007"]；每TC全部封闭参数及expected断言，不能代表实例 |
| planned EV | ["EV-CONTRACT-019"]；只由未来真实case/suite/check生成，不从表物化 |
| 固定report path | `reports/runs/<run_id>/evidence/EV-CONTRACT-019.json`及同ID`.md`；`reports/runs/<run_id>/evidence-index.md` |
| 原safe artifact | `artifacts/test/<run_id>/cases/<instance_id>.json`、`suites/<suite_id>/<context_id>/report.json`与两check；按05注册表精确反查 |
| scope/actual缺失 | synthetic只本项local机制；positive实际local_mechanism actualharness/expectedinstances，actualpositive与current资格独立须真实资格。缺case/参数/check/basis/资格=blocked/not_evaluated，不skip后pass |
| 裁决影响 | 实际P0失败阻总体正向；若构成原六VETO按§11、S/A按§12；P0不风险接受。无材料暂停，不臆判失败或签署 |

| EV独立反查 | 固定合同 |
|---|---|
| DS与suite | ["DS-ENTRY-001"]；["SUITE-I","SUITE-W","SUITE-J"]；05唯一target路由，不复制instance |
| 原safeartifact | `artifacts/test/<run_id>/context.json`、`index.json`、`cases/<instance_id>.json`、`suites/<suite_id>/<context_id>/report.json`和safe stdout/stderr；`checks/run-context.json`、`checks/test-evidence.json` |
| 消费本EV的06门禁 | AC-FUNC-BR-004、AC-FUNC-BR-013、AC-BOUND-BR-015、AC-BOUND-BR-017、AC-SYNC-BR-E01、AC-SYNC-BR-E02、AC-SYNC-BR-E03、AC-SYNC-BR-E04、AC-SYNC-BR-O01、AC-SYNC-BR-J01、AC-SYNC-BR-J02、AC-SYNC-BR-J03、AC-SYNC-BR-J04、AC-SYNC-BR-J05、AC-SYNC-BR-EVENT、AC-SYNC-BR-LOCAL、AC-STATE-BR-M18、AC-STATE-BR-M19、AC-STATE-BR-M20、AC-STATE-BR-M21、AC-TX-BR-003、AC-TX-BR-007、AC-NFR-BR-003、AC-NFR-BR-009、AC-NFR-BR-010、AC-NFR-BR-011、AC-NFR-BR-015、AC-NFR-BR-016；多卡引用不增加execute/count |
| 原AC/VETO方向 | AC-BR-008、AC-BR-014、AC-BR-027；无独立VETO，沿原AC；只是planned方向 |
| 缺失影响 | 对应P0正向/交接暂停，不用riskacceptance或其他EV取代该scope；确证失败按§11/12 |

#### AC-EVID-BR-CONTRACT-020 EV-CONTRACT-020 / CUT-BR-STATE 实例链核验

| 项 | 可判定合同（P0；当前planned/not_evaluated） |
|---|---|
| 原需求/设计 | AC-BR-034、AC-BR-038；05§13.3 evidence_plan_registry；03§9/§16.6/§15.2；本06§5~9对应独立卡 |
| 正式对象/字段/协议/状态 | EvidencePage全部required owner/schema_version/kind/run_id/ev_id/status/tc_refs/instance_ids/context_ids/qualification_scope/context_ref/source_index_ref/case_refs/suite_refs/check_refs/ac_refs/veto_refs/failure_code/blockers；EV-CONTRACT-020、local_mechanism；ArtifactRef/ReportRef及9roots |
| 通过条件 | exacttc_refs=["TC-STATE-001","TC-STATE-002","TC-STATE-003","TC-STATE-004","TC-STATE-005","TC-STATE-006"]；全部TCexpectedinstance→真实case/suite/context/target/output/两个check→EV；schema/CJSON/digest/rolepath/status/actualscope全核；passed须实例全passed，plan不生成result；local实例只局部机制actualharness执行，声明actualpositive另需所用current资格 |
| 失败条件 | 漏case/parameter/expectedassertion/check/target、suiteexit不符；staticpass/newEV补洞，failed/blocked/unavailable隐去；digest/crossrun/current不匹配或scope夸大 |
| 副作用断言 | reader/reportzerobusinessIO；writer先safeallowlist不archive raw；safefailedrun允许真实failedEV，missingcheck/case只partial；旧output/unknown原责任保留，无fakehumanreview |
| 具体TC | ["TC-STATE-001","TC-STATE-002","TC-STATE-003","TC-STATE-004","TC-STATE-005","TC-STATE-006"]；每TC全部封闭参数及expected断言，不能代表实例 |
| planned EV | ["EV-CONTRACT-020"]；只由未来真实case/suite/check生成，不从表物化 |
| 固定report path | `reports/runs/<run_id>/evidence/EV-CONTRACT-020.json`及同ID`.md`；`reports/runs/<run_id>/evidence-index.md` |
| 原safe artifact | `artifacts/test/<run_id>/cases/<instance_id>.json`、`suites/<suite_id>/<context_id>/report.json`与两check；按05注册表精确反查 |
| scope/actual缺失 | synthetic只本项local机制；positive实际local_mechanism actualharness/expectedinstances，actualpositive与current资格独立须真实资格。缺case/参数/check/basis/资格=blocked/not_evaluated，不skip后pass |
| 裁决影响 | 实际P0失败阻总体正向；若构成原六VETO按§11、S/A按§12；P0不风险接受。无材料暂停，不臆判失败或签署 |

| EV独立反查 | 固定合同 |
|---|---|
| DS与suite | ["DS-STATE-001"]；["SUITE-D","SUITE-I","SUITE-J","SUITE-W"]；05唯一target路由，不复制instance |
| 原safeartifact | `artifacts/test/<run_id>/context.json`、`index.json`、`cases/<instance_id>.json`、`suites/<suite_id>/<context_id>/report.json`和safe stdout/stderr；`checks/run-context.json`、`checks/test-evidence.json` |
| 消费本EV的06门禁 | AC-FUNC-BR-012、AC-SYNC-BR-J05、AC-SYNC-BR-LOCAL、AC-STATE-BR-M01、AC-STATE-BR-M02、AC-STATE-BR-M03、AC-STATE-BR-M04、AC-STATE-BR-M05、AC-STATE-BR-M06、AC-STATE-BR-M07、AC-STATE-BR-M08、AC-STATE-BR-M09、AC-STATE-BR-M10、AC-STATE-BR-M11、AC-STATE-BR-M12、AC-STATE-BR-M13、AC-STATE-BR-M14、AC-STATE-BR-M15、AC-STATE-BR-M16、AC-STATE-BR-M17、AC-STATE-BR-M18、AC-STATE-BR-M19、AC-STATE-BR-M20、AC-STATE-BR-M21、AC-TX-BR-001；多卡引用不增加execute/count |
| 原AC/VETO方向 | AC-BR-034、AC-BR-038；无独立VETO，沿原AC；只是planned方向 |
| 缺失影响 | 对应P0正向/交接暂停，不用riskacceptance或其他EV取代该scope；确证失败按§11/12 |

#### AC-EVID-BR-CONTRACT-021 EV-CONTRACT-021 / CUT-BR-EVIDENCE 实例链核验

| 项 | 可判定合同（P0；当前planned/not_evaluated） |
|---|---|
| 原需求/设计 | AC-BR-032、AC-BR-037、AC-BR-038、VETO-BR-003、VETO-BR-004；05§13.3 evidence_plan_registry；03§15脚本边界；00 AC037/038；测试规范§4.6/5.13；本06§5~9对应独立卡 |
| 正式对象/字段/协议/状态 | EvidencePage全部required owner/schema_version/kind/run_id/ev_id/status/tc_refs/instance_ids/context_ids/qualification_scope/context_ref/source_index_ref/case_refs/suite_refs/check_refs/ac_refs/veto_refs/failure_code/blockers；EV-CONTRACT-021、local_mechanism；ArtifactRef/ReportRef及9roots |
| 通过条件 | exacttc_refs=["TC-EVIDENCE-001","TC-EVIDENCE-002","TC-EVIDENCE-003","TC-EVIDENCE-004","TC-EVIDENCE-005"]；全部TCexpectedinstance→真实case/suite/context/target/output/两个check→EV；schema/CJSON/digest/rolepath/status/actualscope全核；passed须实例全passed，plan不生成result；local实例只局部机制actualharness执行，声明actualpositive另需所用current资格 |
| 失败条件 | 漏case/parameter/expectedassertion/check/target、suiteexit不符；staticpass/newEV补洞，failed/blocked/unavailable隐去；digest/crossrun/current不匹配或scope夸大 |
| 副作用断言 | reader/reportzerobusinessIO；writer先safeallowlist不archive raw；safefailedrun允许真实failedEV，missingcheck/case只partial；旧output/unknown原责任保留，无fakehumanreview |
| 具体TC | ["TC-EVIDENCE-001","TC-EVIDENCE-002","TC-EVIDENCE-003","TC-EVIDENCE-004","TC-EVIDENCE-005"]；每TC全部封闭参数及expected断言，不能代表实例 |
| planned EV | ["EV-CONTRACT-021"]；只由未来真实case/suite/check生成，不从表物化 |
| 固定report path | `reports/runs/<run_id>/evidence/EV-CONTRACT-021.json`及同ID`.md`；`reports/runs/<run_id>/evidence-index.md` |
| 原safe artifact | `artifacts/test/<run_id>/cases/<instance_id>.json`、`suites/<suite_id>/<context_id>/report.json`与两check；按05注册表精确反查 |
| scope/actual缺失 | synthetic只本项local机制；positive实际local_mechanism actualharness/expectedinstances，actualpositive与current资格独立须真实资格。缺case/参数/check/basis/资格=blocked/not_evaluated，不skip后pass |
| 裁决影响 | 实际P0失败阻总体正向；若构成原六VETO按§11、S/A按§12；P0不风险接受。无材料暂停，不臆判失败或签署 |

| EV独立反查 | 固定合同 |
|---|---|
| DS与suite | ["DS-EVIDENCE-001"]；["SUITE-TOOLS"]；05唯一target路由，不复制instance |
| 原safeartifact | `artifacts/test/<run_id>/context.json`、`index.json`、`cases/<instance_id>.json`、`suites/<suite_id>/<context_id>/report.json`和safe stdout/stderr；`checks/run-context.json`、`checks/test-evidence.json` |
| 消费本EV的06门禁 | AC-FUNC-BR-015、AC-BOUND-BR-006、AC-BOUND-BR-015、AC-SYNC-BR-E04、AC-SYNC-BR-O01、AC-SYNC-BR-EVENT、AC-NFR-BR-012、AC-NFR-BR-015、AC-NFR-BR-016；多卡引用不增加execute/count |
| 原AC/VETO方向 | AC-BR-032、AC-BR-037、AC-BR-038；VETO-BR-003、VETO-BR-004；只是planned方向 |
| 缺失影响 | 对应P0正向/交接暂停，不用riskacceptance或其他EV取代该scope；确证失败按§11/12 |

#### AC-EVID-BR-REAL-001 EV-REAL-001 / CUT-BR-REAL 实例链核验

| 项 | 可判定合同（P0；当前planned/not_evaluated） |
|---|---|
| 原需求/设计 | AC-BR-002、AC-BR-008、AC-BR-010、AC-BR-014、AC-BR-024、AC-BR-038、VETO-BR-001、VETO-BR-006；05§13.3 evidence_plan_registry；03§14~17；04§14/平台核验附录；本06§5~9对应独立卡 |
| 正式对象/字段/协议/状态 | EvidencePage全部required owner/schema_version/kind/run_id/ev_id/status/tc_refs/instance_ids/context_ids/qualification_scope/context_ref/source_index_ref/case_refs/suite_refs/check_refs/ac_refs/veto_refs/failure_code/blockers；EV-REAL-001、real_seam；ArtifactRef/ReportRef及9roots |
| 通过条件 | exacttc_refs=["TC-REAL-001","TC-REAL-002","TC-REAL-003","TC-REAL-004","TC-REAL-005","TC-REAL-006","TC-REAL-007"]；全部TCexpectedinstance→真实case/suite/context/target/output/两个check→EV；schema/CJSON/digest/rolepath/status/actualscope全核；passed须实例全passed，plan不生成result；TC-REAL-001~007逐actual平台/owner/store/secret/producer及原效应资格，不用controlledport释放 |
| 失败条件 | 漏case/parameter/expectedassertion/check/target、suiteexit不符；staticpass/newEV补洞，failed/blocked/unavailable隐去；digest/crossrun/current不匹配或scope夸大 |
| 副作用断言 | reader/reportzerobusinessIO；writer先safeallowlist不archive raw；safefailedrun允许真实failedEV，missingcheck/case只partial；旧output/unknown原责任保留，无fakehumanreview |
| 具体TC | ["TC-REAL-001","TC-REAL-002","TC-REAL-003","TC-REAL-004","TC-REAL-005","TC-REAL-006","TC-REAL-007"]；每TC全部封闭参数及expected断言，不能代表实例 |
| planned EV | ["EV-REAL-001"]；只由未来真实case/suite/check生成，不从表物化 |
| 固定report path | `reports/runs/<run_id>/evidence/EV-REAL-001.json`及同ID`.md`；`reports/runs/<run_id>/evidence-index.md` |
| 原safe artifact | `artifacts/test/<run_id>/cases/<instance_id>.json`、`suites/<suite_id>/<context_id>/report.json`与两check；按05注册表精确反查 |
| scope/actual缺失 | synthetic只本项local机制；positive实际real_seam actualharness/expectedinstances，actualpositive与current资格独立须真实资格。缺case/参数/check/basis/资格=blocked/not_evaluated，不skip后pass |
| 裁决影响 | 实际P0失败阻总体正向；若构成原六VETO按§11、S/A按§12；P0不风险接受。无材料暂停，不臆判失败或签署 |

| EV独立反查 | 固定合同 |
|---|---|
| DS与suite | ["DS-REAL-001"]；["SUITE-REAL"]；05唯一target路由，不复制instance |
| 原safeartifact | `artifacts/test/<run_id>/context.json`、`index.json`、`cases/<instance_id>.json`、`suites/<suite_id>/<context_id>/report.json`和safe stdout/stderr；`checks/run-context.json`、`checks/test-evidence.json` |
| 消费本EV的06门禁 | AC-FUNC-BR-001、AC-FUNC-BR-008、AC-BOUND-BR-007、AC-BOUND-BR-008、AC-BOUND-BR-010、AC-BOUND-BR-017、AC-SYNC-BR-COMPILE、AC-SYNC-BR-OWNER、AC-SYNC-BR-PLATFORM、AC-SYNC-BR-EVENT、AC-SYNC-BR-LOCAL、AC-NFR-BR-003、AC-NFR-BR-006、AC-NFR-BR-008、AC-NFR-BR-016；多卡引用不增加execute/count |
| 原AC/VETO方向 | AC-BR-002、AC-BR-008、AC-BR-010、AC-BR-014、AC-BR-024、AC-BR-038；VETO-BR-001、VETO-BR-006；只是planned方向 |
| 缺失影响 | 对应P0正向/交接暂停，不用riskacceptance或其他EV取代该scope；确证失败按§11/12 |

#### AC-REPORT-BR-001 run context/基线/expected manifest固定

| 项 | 可判定合同（P0；当前planned/not_evaluated） |
|---|---|
| 原需求/设计 | FR-BR-015、FR-BR-016、AC-BR-037、AC-BR-038；03§14/15；05§9/13 schema/digest/paths/跨字段；本06§3/10/14人工边界 |
| 正式对象/字段/协议/状态 | RunContext全15required/ExecutionContext/ExpectedInstance；00~05 DesignDigest；actualsource_revision/source_tree/build/tool/approvedsafeprofile；artifacts/test/<run_id>/context.json |
| 通过条件 | 真实repo/build/tool/profile/context存在且唯一同run不可变；sixdesignhash匹配§3，expectedmanifest来自已实现批准参数注册且覆盖20protocol/19model/21机150+375/guard/82key22CF27F12CFG/全部selectedscope；instance_id唯一suite/target路由 |
| 失败条件 | staticplan补context/run/case；变基线仍复用passed、删参数、hash原secret/config/业务body、fixture当approvedprofile |
| 副作用断言 | 无法safecontext只有finiteexit2/3/4，不产生checker/artifact；无网络/owner效果；change走newrun及影响回归不覆旧 |
| 具体TC | ["TC-EVIDENCE-001","TC-EVIDENCE-002","TC-EVIDENCE-003","TC-EVIDENCE-004","TC-EVIDENCE-005","TC-SURFACE-001","TC-SURFACE-002","TC-SURFACE-003","TC-SURFACE-004","TC-CONFIG-001","TC-CONFIG-002","TC-CONFIG-003","TC-CONFIG-004","TC-CONFIG-005","TC-CONFIG-006","TC-CONFIG-007","TC-CONFIG-008","TC-CONFIG-009","TC-CONFIG-010","TC-CONFIG-011","TC-CONFIG-012","TC-REAL-001","TC-REAL-002","TC-REAL-003","TC-REAL-004","TC-REAL-005","TC-REAL-006","TC-REAL-007"]；每TC全部封闭参数及expected断言，不能代表实例 |
| planned EV | ["EV-CONTRACT-021","EV-CONTRACT-001","EV-CONTRACT-017","EV-REAL-001"]；只由未来真实case/suite/check生成，不从表物化 |
| 固定report path | `reports/runs/<run_id>/evidence/EV-CONTRACT-021.json`及同ID`.md`；`reports/runs/<run_id>/evidence/EV-CONTRACT-001.json`及同ID`.md`；`reports/runs/<run_id>/evidence/EV-CONTRACT-017.json`及同ID`.md`；`reports/runs/<run_id>/evidence/EV-REAL-001.json`及同ID`.md`；`reports/runs/<run_id>/evidence-index.md` |
| 原safe artifact | `artifacts/test/<run_id>/cases/<instance_id>.json`、`suites/<suite_id>/<context_id>/report.json`与两check；按05注册表精确反查 |
| scope/actual缺失 | synthetic只本项local机制；positive实际actualharness/tool/source/build/profile/report+authorizedhumanassignment，不要求把业务raw放证据须真实资格。缺case/参数/check/basis/资格=blocked/not_evaluated，不skip后pass |
| 裁决影响 | 实际P0失败阻总体正向；若构成原六VETO按§11、S/A按§12；P0不风险接受。无材料暂停，不臆判失败或签署 |

#### AC-REPORT-BR-002 case/suite/check状态与真实执行闭包

| 项 | 可判定合同（P0；当前planned/not_evaluated） |
|---|---|
| 原需求/设计 | FR-BR-015、FR-BR-016、AC-BR-037、AC-BR-038；03§14/15；05§9/13 schema/digest/paths/跨字段；本06§3/10/14人工边界 |
| 正式对象/字段/协议/状态 | CaseResult.executed/status/assertions/call_counters/target_id；SuiteResult.runner_results/runner_exit/case_refs/missing_instance_ids；CheckResult.check_id/input_index_ref；固定cases/suites/checks路径 |
| 通过条件 | 每actualcase与expected tuple完全一致；executedtrue只能passed/failed且全expectedassertions；false仅真实preflightblocked/unavailable counters0；suite所有runner真实互斥instance并等expected；两个checker真实structure/safety/closurepassed，不把合法failedcase当schema错 |
| 失败条件 | exit0代case，missing补notrun文件；skip/timeout/flaky当passed，runner缺失或suiteexit不同；not_reachedassertion写passed；checker不可用造记录 |
| 副作用断言 | 保既有safe失败和missing；不重dispatch/retryeffects求绿；没有case/check不生成finalEV，只安全partial或finitefailure |
| 具体TC | ["TC-EVIDENCE-001","TC-EVIDENCE-002","TC-EVIDENCE-003","TC-EVIDENCE-004","TC-EVIDENCE-005","TC-STATE-001","TC-STATE-002","TC-STATE-003","TC-STATE-004","TC-STATE-005","TC-STATE-006","TC-LOCAL-001","TC-LOCAL-002","TC-LOCAL-003","TC-LOCAL-004","TC-LOCAL-005","TC-LOCAL-006","TC-ENTRY-001","TC-ENTRY-002","TC-ENTRY-003","TC-ENTRY-004","TC-ENTRY-005","TC-ENTRY-006","TC-ENTRY-007"]；每TC全部封闭参数及expected断言，不能代表实例 |
| planned EV | ["EV-CONTRACT-021","EV-CONTRACT-020","EV-CONTRACT-014","EV-CONTRACT-019"]；只由未来真实case/suite/check生成，不从表物化 |
| 固定report path | `reports/runs/<run_id>/evidence/EV-CONTRACT-021.json`及同ID`.md`；`reports/runs/<run_id>/evidence/EV-CONTRACT-020.json`及同ID`.md`；`reports/runs/<run_id>/evidence/EV-CONTRACT-014.json`及同ID`.md`；`reports/runs/<run_id>/evidence/EV-CONTRACT-019.json`及同ID`.md`；`reports/runs/<run_id>/evidence-index.md` |
| 原safe artifact | `artifacts/test/<run_id>/cases/<instance_id>.json`、`suites/<suite_id>/<context_id>/report.json`与两check；按05注册表精确反查 |
| scope/actual缺失 | synthetic只本项local机制；positive实际actualharness/tool/source/build/profile/report+authorizedhumanassignment，不要求把业务raw放证据须真实资格。缺case/参数/check/basis/资格=blocked/not_evaluated，不skip后pass |
| 裁决影响 | 实际P0失败阻总体正向；若构成原六VETO按§11、S/A按§12；P0不风险接受。无材料暂停，不臆判失败或签署 |

#### AC-REPORT-BR-003 schema/CJSON/hash/角色路径与writer-reader

| 项 | 可判定合同（P0；当前planned/not_evaluated） |
|---|---|
| 原需求/设计 | FR-BR-015、FR-BR-016、AC-BR-037、AC-BR-038；03§14/15；05§9/13 schema/digest/paths/跨字段；本06§3/10/14人工边界 |
| 正式对象/字段/协议/状态 | 05 harnessschema9root/34defs/106ref；22封闭object全部propsrequired；ArtifactRef/ReportRef.path/sha256/byte_length/media_type；CJSON+LF及DAG；四root固定目录 |
| 通过条件 | 实际validator支持Draft2020-12及跨字段检查；strictUTF8/unknown/duplicate/null/enum/array/identity/bytebudget；canon原bytes等CJSON+LF；rolepath无symlink/../absolute/latest/crossrun，hashmedia/length真文件；DAG无自hash循环，safeexclusiveatomicwriter |
| 失败条件 | 宽松schema、check只重算字段而不核真实bytes、Rolepattern扩大可替context/check/suite、默截array或覆盖immutablecase、raw临时文件 |
| 副作用断言 | readerzeroprobesend/业务IO；writerboundedmemory先allowlist后安全候选rename，writeconflict不改旧安全记录；当前AJV2020不可用不声称真实validation已跑 |
| 具体TC | ["TC-EVIDENCE-001","TC-EVIDENCE-002","TC-EVIDENCE-003","TC-EVIDENCE-004","TC-EVIDENCE-005","TC-SURFACE-001","TC-SURFACE-002","TC-SURFACE-003","TC-SURFACE-004","TC-PRIVATE-001","TC-PRIVATE-002","TC-PRIVATE-003","TC-PRIVATE-004","TC-PRIVATE-005"]；每TC全部封闭参数及expected断言，不能代表实例 |
| planned EV | ["EV-CONTRACT-021","EV-CONTRACT-001","EV-CONTRACT-018"]；只由未来真实case/suite/check生成，不从表物化 |
| 固定report path | `reports/runs/<run_id>/evidence/EV-CONTRACT-021.json`及同ID`.md`；`reports/runs/<run_id>/evidence/EV-CONTRACT-001.json`及同ID`.md`；`reports/runs/<run_id>/evidence/EV-CONTRACT-018.json`及同ID`.md`；`reports/runs/<run_id>/evidence-index.md` |
| 原safe artifact | `artifacts/test/<run_id>/cases/<instance_id>.json`、`suites/<suite_id>/<context_id>/report.json`与两check；按05注册表精确反查 |
| scope/actual缺失 | synthetic只本项local机制；positive实际actualharness/tool/source/build/profile/report+authorizedhumanassignment，不要求把业务raw放证据须真实资格。缺case/参数/check/basis/资格=blocked/not_evaluated，不skip后pass |
| 裁决影响 | 实际P0失败阻总体正向；若构成原六VETO按§11、S/A按§12；P0不风险接受。无材料暂停，不臆判失败或签署 |

#### AC-REPORT-BR-004 全部artifact/report/redaction与出站禁材

| 项 | 可判定合同（P0；当前planned/not_evaluated） |
|---|---|
| 原需求/设计 | FR-BR-015、FR-BR-016、AC-BR-037、AC-BR-038；03§14/15；05§9/13 schema/digest/paths/跨字段；本06§3/10/14人工边界 |
| 正式对象/字段/协议/状态 | 两个CheckResult/test-evidence；reports/runs/<run_id>/redaction-check.md；allJSON/MD/ASCIIstdoutstderr/trace/log/metrics/handoff/decision人材；SafeProtocolError |
| 通过条件 | 实际所有safe产物/输出经prewriterallowlist及registeredfinitegrammar、安全syntheticcanary/可还原派生反例；0 forbidden实际材料；扫描与sourcehash/同run完整覆盖，报告只有finiteclassification不输出匹配值 |
| 失败条件 | 一出口漏扫描、先落raw后脱敏、body/secret/privatecallback/Gate/rawerror/hash/凭证URL或隐藏存在性泄露，Markdowntemplate注入 |
| 副作用断言 | 不安全候选拒归档，不写canary/匹配片段/digest/sensitivepath；只保先前safeoutput；实际泄漏按原VETO003，不能删问题改passed |
| 具体TC | ["TC-PRIVATE-001","TC-PRIVATE-002","TC-PRIVATE-003","TC-PRIVATE-004","TC-PRIVATE-005","TC-EVIDENCE-001","TC-EVIDENCE-002","TC-EVIDENCE-003","TC-EVIDENCE-004","TC-EVIDENCE-005","TC-CONFIG-001","TC-CONFIG-002","TC-CONFIG-003","TC-CONFIG-004","TC-CONFIG-005","TC-CONFIG-006","TC-CONFIG-007","TC-CONFIG-008","TC-CONFIG-009","TC-CONFIG-010","TC-CONFIG-011","TC-CONFIG-012","TC-AUDIT-001","TC-AUDIT-002","TC-AUDIT-003","TC-AUDIT-004","TC-AUDIT-005"]；每TC全部封闭参数及expected断言，不能代表实例 |
| planned EV | ["EV-CONTRACT-018","EV-CONTRACT-021","EV-CONTRACT-017","EV-CONTRACT-016"]；只由未来真实case/suite/check生成，不从表物化 |
| 固定report path | `reports/runs/<run_id>/evidence/EV-CONTRACT-018.json`及同ID`.md`；`reports/runs/<run_id>/evidence/EV-CONTRACT-021.json`及同ID`.md`；`reports/runs/<run_id>/evidence/EV-CONTRACT-017.json`及同ID`.md`；`reports/runs/<run_id>/evidence/EV-CONTRACT-016.json`及同ID`.md`；`reports/runs/<run_id>/evidence-index.md` |
| 原safe artifact | `artifacts/test/<run_id>/cases/<instance_id>.json`、`suites/<suite_id>/<context_id>/report.json`与两check；按05注册表精确反查 |
| scope/actual缺失 | synthetic只本项local机制；positive实际actualharness/tool/source/build/profile/report+authorizedhumanassignment，不要求把业务raw放证据须真实资格。缺case/参数/check/basis/资格=blocked/not_evaluated，不skip后pass |
| 裁决影响 | 实际P0失败阻总体正向；若构成原六VETO按§11、S/A按§12；P0不风险接受。无材料暂停，不臆判失败或签署 |

#### AC-REPORT-BR-005 ArtifactIndex/ReportIndex/EVindex/gate报告完整

| 项 | 可判定合同（P0；当前planned/not_evaluated） |
|---|---|
| 原需求/设计 | FR-BR-015、FR-BR-016、AC-BR-037、AC-BR-038；03§14/15；05§9/13 schema/digest/paths/跨字段；本06§3/10/14人工边界 |
| 正式对象/字段/协议/状态 | ArtifactIndex.stage/status/coverage/generation；ReportIndex.stage/status/evidence_refs/missing_ev_ids；reports/runs/<run_id>/{index.json,summary.md,evidence-index.md,gate-results.md}及suite/EVjsonmd |
| 通过条件 | actualfinalindex全expectedslot每个recorded恰一真实case；ReportIndexfinal含22 EV全集及hash，不等全部passed；gateresults全local/real/release实际checks/status与§5~11人工门禁逐项来源；EVindex真实artifact推导，缺项exactmissing/partial |
| 失败条件 | shell即final、静态表造覆盖、漏EV/report/machine/actualscope或failedcount隐藏，otherEV补对应instance/current |
| 副作用断言 | 聚合仅同run读，zero效果重跑；没有真实source/check只安全partial有限失败，缺report=送验不成立，不伪断言failedrun为passed |
| 具体TC | ["TC-EVIDENCE-001","TC-EVIDENCE-002","TC-EVIDENCE-003","TC-EVIDENCE-004","TC-EVIDENCE-005","TC-REAL-001","TC-REAL-002","TC-REAL-003","TC-REAL-004","TC-REAL-005","TC-REAL-006","TC-REAL-007","TC-LOCAL-001","TC-LOCAL-002","TC-LOCAL-003","TC-LOCAL-004","TC-LOCAL-005","TC-LOCAL-006"]；每TC全部封闭参数及expected断言，不能代表实例 |
| planned EV | ["EV-CONTRACT-021","EV-REAL-001","EV-CONTRACT-014"]；只由未来真实case/suite/check生成，不从表物化 |
| 固定report path | `reports/runs/<run_id>/evidence/EV-CONTRACT-021.json`及同ID`.md`；`reports/runs/<run_id>/evidence/EV-REAL-001.json`及同ID`.md`；`reports/runs/<run_id>/evidence/EV-CONTRACT-014.json`及同ID`.md`；`reports/runs/<run_id>/evidence-index.md` |
| 原safe artifact | `artifacts/test/<run_id>/cases/<instance_id>.json`、`suites/<suite_id>/<context_id>/report.json`与两check；按05注册表精确反查 |
| scope/actual缺失 | synthetic只本项local机制；positive实际actualharness/tool/source/build/profile/report+authorizedhumanassignment，不要求把业务raw放证据须真实资格。缺case/参数/check/basis/资格=blocked/not_evaluated，不skip后pass |
| 裁决影响 | 实际P0失败阻总体正向；若构成原六VETO按§11、S/A按§12；P0不风险接受。无材料暂停，不臆判失败或签署 |

#### AC-REPORT-BR-006 四成熟度/审计材料/测试EV authority分开

| 项 | 可判定合同（P0；当前planned/not_evaluated） |
|---|---|
| 原需求/设计 | FR-BR-015、FR-BR-016、AC-BR-037、AC-BR-038；03§14/15；05§9/13 schema/digest/paths/跨字段；本06§3/10/14人工边界 |
| 正式对象/字段/协议/状态 | scriptcapability/minimalindexshell/finalEVpages/acceptancehandoff四层；SafeAuditRecord/CanonicalSafeMaterialRef/O01disposition与test-onlyEvidencePage区别 |
| 通过条件 | 各层实际自身材料且不能上升推论；实际local audit≠testEV、producer交接≠consumer接受≠Observabilityevidenceverdict；局部negative/localpass不释放actualowner/platform/storecurrent或allfour資格 |
| 失败条件 | 设计pass/脚本存在/shell/审计ref即EV/signoff/ready；把平台receipt称Turn/已读，把ConsumerAccepted称验收通过 |
| 副作用断言 | 自动script无risk接受/verdict/signoff权限；currentproducer缺口与scopeblocked如实，不能造SourceOwner label借准入 |
| 具体TC | ["TC-AUDIT-001","TC-AUDIT-002","TC-AUDIT-003","TC-AUDIT-004","TC-AUDIT-005","TC-EVIDENCE-001","TC-EVIDENCE-002","TC-EVIDENCE-003","TC-EVIDENCE-004","TC-EVIDENCE-005","TC-ENTRY-001","TC-ENTRY-002","TC-ENTRY-003","TC-ENTRY-004","TC-ENTRY-005","TC-ENTRY-006","TC-ENTRY-007","TC-REAL-001","TC-REAL-002","TC-REAL-003","TC-REAL-004","TC-REAL-005","TC-REAL-006","TC-REAL-007"]；每TC全部封闭参数及expected断言，不能代表实例 |
| planned EV | ["EV-CONTRACT-016","EV-CONTRACT-021","EV-CONTRACT-019","EV-REAL-001"]；只由未来真实case/suite/check生成，不从表物化 |
| 固定report path | `reports/runs/<run_id>/evidence/EV-CONTRACT-016.json`及同ID`.md`；`reports/runs/<run_id>/evidence/EV-CONTRACT-021.json`及同ID`.md`；`reports/runs/<run_id>/evidence/EV-CONTRACT-019.json`及同ID`.md`；`reports/runs/<run_id>/evidence/EV-REAL-001.json`及同ID`.md`；`reports/runs/<run_id>/evidence-index.md` |
| 原safe artifact | `artifacts/test/<run_id>/cases/<instance_id>.json`、`suites/<suite_id>/<context_id>/report.json`与两check；按05注册表精确反查 |
| scope/actual缺失 | synthetic只本项local机制；positive实际actualharness/tool/source/build/profile/report+authorizedhumanassignment，不要求把业务raw放证据须真实资格。缺case/参数/check/basis/资格=blocked/not_evaluated，不skip后pass |
| 裁决影响 | 实际P0失败阻总体正向；若构成原六VETO按§11、S/A按§12；P0不风险接受。无材料暂停，不臆判失败或签署 |

#### AC-REPORT-BR-007 acceptance draft与真实人工review交接

| 项 | 可判定合同（P0；当前planned/not_evaluated） |
|---|---|
| 原需求/设计 | FR-BR-015、FR-BR-016、AC-BR-037、AC-BR-038；03§14/15；05§9/13 schema/digest/paths/跨字段；本06§3/10/14人工边界 |
| 正式对象/字段/协议/状态 | reports/acceptance/<run_id>/{handoff.json,handoff.md,veto-checklist.md,open-issues.md,risk-acceptance.md}；reports/review/<run_id>/{review.json,reviewer-notes.md}；Handoff/HumanReview原required |
| 通过条件 | validatedsameReportIndex初稿，38AC仅available_for_review/blocked/not_evaluated；真实authorizedassignment审查exactscope/current缺陷/VETO/risk及报告链接；HumanReview只两原disposition；人工最终结论另按§14，不改draftschema |
| 失败条件 | 未review即送验完整，脚本填签名/acceptor或HumanReview添passed/verdict；跨run/基线漂移；只有口头确认无材料/authority |
| 副作用断言 | 只安全测试plan/refrelativepaths/finitecommentcode，不公开业务ref/账号身份凭证；review不是finalsignoff，无补造实际角色；当前全部waiting |
| 具体TC | ["TC-EVIDENCE-001","TC-EVIDENCE-002","TC-EVIDENCE-003","TC-EVIDENCE-004","TC-EVIDENCE-005","TC-AUDIT-001","TC-AUDIT-002","TC-AUDIT-003","TC-AUDIT-004","TC-AUDIT-005","TC-READ-001","TC-READ-002","TC-READ-003","TC-READ-004","TC-REAL-001","TC-REAL-002","TC-REAL-003","TC-REAL-004","TC-REAL-005","TC-REAL-006","TC-REAL-007"]；每TC全部封闭参数及expected断言，不能代表实例 |
| planned EV | ["EV-CONTRACT-021","EV-CONTRACT-016","EV-CONTRACT-015","EV-REAL-001"]；只由未来真实case/suite/check生成，不从表物化 |
| 固定report path | `reports/runs/<run_id>/evidence/EV-CONTRACT-021.json`及同ID`.md`；`reports/runs/<run_id>/evidence/EV-CONTRACT-016.json`及同ID`.md`；`reports/runs/<run_id>/evidence/EV-CONTRACT-015.json`及同ID`.md`；`reports/runs/<run_id>/evidence/EV-REAL-001.json`及同ID`.md`；`reports/runs/<run_id>/evidence-index.md` |
| 原safe artifact | `artifacts/test/<run_id>/cases/<instance_id>.json`、`suites/<suite_id>/<context_id>/report.json`与两check；按05注册表精确反查 |
| scope/actual缺失 | synthetic只本项local机制；positive实际actualharness/tool/source/build/profile/report+authorizedhumanassignment，不要求把业务raw放证据须真实资格。缺case/参数/check/basis/资格=blocked/not_evaluated，不skip后pass |
| 裁决影响 | 实际P0失败阻总体正向；若构成原六VETO按§11、S/A按§12；P0不风险接受。无材料暂停，不臆判失败或签署 |

#### AC-REPORT-BR-008 失败留存/复验新run/安全retention策略

| 项 | 可判定合同（P0；当前planned/not_evaluated） |
|---|---|
| 原需求/设计 | FR-BR-015、FR-BR-016、AC-BR-037、AC-BR-038；03§14/15；05§9/13 schema/digest/paths/跨字段；本06§3/10/14人工边界 |
| 正式对象/字段/协议/状态 | 05safeoutput/writeconflict/partial/missing/finitefailure；approvedartifactpolicy/retention scope；§12retest及原businessoriginal/unknown/key/window |
| 通过条件 | failed/blocked/unavailable保原safe材料与来源missing，unsafe候选不归档；新actualauthorizedretest新run及明确supersedesplan，不改旧passed/fail；真实批准retention/incident/对账范围，不能无限保留/默认purge |
| 失败条件 | 删旧失败/改case掩覆盖、原unknown换ID自动effectretry、无policy自称完整留存或执行purge，unsaferaw留给人工复核 |
| 副作用断言 | 报告/验收只读不消费或刷新businessstate；缺approvedpolicy阻相应purge/留存承诺；design不创建files/run或执行clean |
| 具体TC | ["TC-EVIDENCE-001","TC-EVIDENCE-002","TC-EVIDENCE-003","TC-EVIDENCE-004","TC-EVIDENCE-005","TC-PRIVATE-001","TC-PRIVATE-002","TC-PRIVATE-003","TC-PRIVATE-004","TC-PRIVATE-005","TC-RECOVERY-001","TC-RECOVERY-002","TC-RECOVERY-003","TC-RECOVERY-004","TC-RECOVERY-005","TC-CONFIG-001","TC-CONFIG-002","TC-CONFIG-003","TC-CONFIG-004","TC-CONFIG-005","TC-CONFIG-006","TC-CONFIG-007","TC-CONFIG-008","TC-CONFIG-009","TC-CONFIG-010","TC-CONFIG-011","TC-CONFIG-012"]；每TC全部封闭参数及expected断言，不能代表实例 |
| planned EV | ["EV-CONTRACT-021","EV-CONTRACT-018","EV-CONTRACT-013","EV-CONTRACT-017"]；只由未来真实case/suite/check生成，不从表物化 |
| 固定report path | `reports/runs/<run_id>/evidence/EV-CONTRACT-021.json`及同ID`.md`；`reports/runs/<run_id>/evidence/EV-CONTRACT-018.json`及同ID`.md`；`reports/runs/<run_id>/evidence/EV-CONTRACT-013.json`及同ID`.md`；`reports/runs/<run_id>/evidence/EV-CONTRACT-017.json`及同ID`.md`；`reports/runs/<run_id>/evidence-index.md` |
| 原safe artifact | `artifacts/test/<run_id>/cases/<instance_id>.json`、`suites/<suite_id>/<context_id>/report.json`与两check；按05注册表精确反查 |
| scope/actual缺失 | synthetic只本项local机制；positive实际actualharness/tool/source/build/profile/report+authorizedhumanassignment，不要求把业务raw放证据须真实资格。缺case/参数/check/basis/资格=blocked/not_evaluated，不skip后pass |
| 裁决影响 | 实际P0失败阻总体正向；若构成原六VETO按§11、S/A按§12；P0不风险接受。无材料暂停，不臆判失败或签署 |

### 10.3 全22EV→TC/suite/raw/report/验收方向闭环

| plannedEV | exactTC数组/全部参数 | suite artifact | report path | 门禁/原AC/VETO | 缺失影响 |
|---|---|---|---|---|---|
| EV-CONTRACT-001 | ["TC-SURFACE-001","TC-SURFACE-002","TC-SURFACE-003","TC-SURFACE-004"] | SUITE-S/SUITE-C/SUITE-D；`artifacts/test/<run_id>/suites/<suite_id>/<context_id>/report.json`+cases+context+checks | `reports/runs/<run_id>/evidence/EV-CONTRACT-001.json`及.md | AC-EVID-BR-CONTRACT-001；AC-BR-006/AC-BR-013/AC-BR-020/AC-BR-026/AC-BR-035/AC-BR-037/AC-BR-038；无独立VETO | 缺失/不足暂停受影响P0；确证失败按其实际assertion/§11；不补EV |
| EV-CONTRACT-002 | ["TC-BIND-001","TC-BIND-002","TC-BIND-003","TC-BIND-004"] | SUITE-A；`artifacts/test/<run_id>/suites/<suite_id>/<context_id>/report.json`+cases+context+checks | `reports/runs/<run_id>/evidence/EV-CONTRACT-002.json`及.md | AC-EVID-BR-CONTRACT-002；AC-BR-001/AC-BR-003/AC-BR-005/AC-BR-006/AC-BR-007/AC-BR-022；VETO-BR-002 | 缺失/不足暂停受影响P0；确证失败按其实际assertion/§11；不补EV |
| EV-CONTRACT-003 | ["TC-MAP-001","TC-MAP-002","TC-MAP-003","TC-MAP-004","TC-MAP-005"] | SUITE-A；`artifacts/test/<run_id>/suites/<suite_id>/<context_id>/report.json`+cases+context+checks | `reports/runs/<run_id>/evidence/EV-CONTRACT-003.json`及.md | AC-EVID-BR-CONTRACT-003；AC-BR-001/AC-BR-004/AC-BR-005/AC-BR-006/AC-BR-011/AC-BR-023；VETO-BR-001 | 缺失/不足暂停受影响P0；确证失败按其实际assertion/§11；不补EV |
| EV-CONTRACT-004 | ["TC-INBOUND-001","TC-INBOUND-002","TC-INBOUND-003","TC-INBOUND-004","TC-INBOUND-005"] | SUITE-I；`artifacts/test/<run_id>/suites/<suite_id>/<context_id>/report.json`+cases+context+checks | `reports/runs/<run_id>/evidence/EV-CONTRACT-004.json`及.md | AC-EVID-BR-CONTRACT-004；AC-BR-008/AC-BR-009/AC-BR-010/AC-BR-012/AC-BR-013/AC-BR-014；VETO-BR-004 | 缺失/不足暂停受影响P0；确证失败按其实际assertion/§11；不补EV |
| EV-CONTRACT-005 | ["TC-CHANGE-001","TC-CHANGE-002","TC-CHANGE-003","TC-CHANGE-004"] | SUITE-B；`artifacts/test/<run_id>/suites/<suite_id>/<context_id>/report.json`+cases+context+checks | `reports/runs/<run_id>/evidence/EV-CONTRACT-005.json`及.md | AC-EVID-BR-CONTRACT-005；AC-BR-004/AC-BR-011/AC-BR-012/AC-BR-019；VETO-BR-001 | 缺失/不足暂停受影响P0；确证失败按其实际assertion/§11；不补EV |
| EV-CONTRACT-006 | ["TC-PRESENT-001","TC-PRESENT-002","TC-PRESENT-003","TC-PRESENT-004"] | SUITE-A；`artifacts/test/<run_id>/suites/<suite_id>/<context_id>/report.json`+cases+context+checks | `reports/runs/<run_id>/evidence/EV-CONTRACT-006.json`及.md | AC-EVID-BR-CONTRACT-006；AC-BR-015/AC-BR-016/AC-BR-019/AC-BR-021；VETO-BR-002/VETO-BR-003 | 缺失/不足暂停受影响P0；确证失败按其实际assertion/§11；不补EV |
| EV-CONTRACT-007 | ["TC-ATTACH-001","TC-ATTACH-002","TC-ATTACH-003","TC-ATTACH-004"] | SUITE-A/SUITE-B；`artifacts/test/<run_id>/suites/<suite_id>/<context_id>/report.json`+cases+context+checks | `reports/runs/<run_id>/evidence/EV-CONTRACT-007.json`及.md | AC-EVID-BR-CONTRACT-007；AC-BR-015/AC-BR-017/AC-BR-020；VETO-BR-003 | 缺失/不足暂停受影响P0；确证失败按其实际assertion/§11；不补EV |
| EV-CONTRACT-008 | ["TC-DELIVERY-001","TC-DELIVERY-002","TC-DELIVERY-003","TC-DELIVERY-004","TC-DELIVERY-005"] | SUITE-C；`artifacts/test/<run_id>/suites/<suite_id>/<context_id>/report.json`+cases+context+checks | `reports/runs/<run_id>/evidence/EV-CONTRACT-008.json`及.md | AC-EVID-BR-CONTRACT-008；AC-BR-015/AC-BR-018/AC-BR-019/AC-BR-020/AC-BR-021/AC-BR-030；VETO-BR-004 | 缺失/不足暂停受影响P0；确证失败按其实际assertion/§11；不补EV |
| EV-CONTRACT-009 | ["TC-CALLBACK-001","TC-CALLBACK-002","TC-CALLBACK-003","TC-CALLBACK-004","TC-CALLBACK-005"] | SUITE-A/SUITE-P；`artifacts/test/<run_id>/suites/<suite_id>/<context_id>/report.json`+cases+context+checks | `reports/runs/<run_id>/evidence/EV-CONTRACT-009.json`及.md | AC-EVID-BR-CONTRACT-009；AC-BR-014/AC-BR-022/AC-BR-023/AC-BR-024/AC-BR-025/AC-BR-026/AC-BR-027；VETO-BR-002/VETO-BR-004/VETO-BR-006 | 缺失/不足暂停受影响P0；确证失败按其实际assertion/§11；不补EV |
| EV-CONTRACT-010 | ["TC-KEY-001","TC-KEY-002","TC-KEY-003","TC-KEY-004","TC-KEY-005"] | SUITE-C；`artifacts/test/<run_id>/suites/<suite_id>/<context_id>/report.json`+cases+context+checks | `reports/runs/<run_id>/evidence/EV-CONTRACT-010.json`及.md | AC-EVID-BR-CONTRACT-010；AC-BR-003/AC-BR-007/AC-BR-009/AC-BR-012/AC-BR-018/AC-BR-023/AC-BR-026/AC-BR-027/AC-BR-029/AC-BR-031/AC-BR-034/AC-BR-035；VETO-BR-005 | 缺失/不足暂停受影响P0；确证失败按其实际assertion/§11；不补EV |
| EV-CONTRACT-011 | ["TC-CURSOR-001","TC-CURSOR-002","TC-CURSOR-003","TC-CURSOR-004"] | SUITE-C；`artifacts/test/<run_id>/suites/<suite_id>/<context_id>/report.json`+cases+context+checks | `reports/runs/<run_id>/evidence/EV-CONTRACT-011.json`及.md | AC-EVID-BR-CONTRACT-011；AC-BR-012/AC-BR-028/AC-BR-029/AC-BR-031/AC-BR-034/AC-BR-035；VETO-BR-005 | 缺失/不足暂停受影响P0；确证失败按其实际assertion/§11；不补EV |
| EV-CONTRACT-012 | ["TC-RATE-001","TC-RATE-002","TC-RATE-003","TC-RATE-004","TC-RATE-005"] | SUITE-C/SUITE-B；`artifacts/test/<run_id>/suites/<suite_id>/<context_id>/report.json`+cases+context+checks | `reports/runs/<run_id>/evidence/EV-CONTRACT-012.json`及.md | AC-EVID-BR-CONTRACT-012；AC-BR-030/AC-BR-034/AC-BR-036；VETO-BR-005 | 缺失/不足暂停受影响P0；确证失败按其实际assertion/§11；不补EV |
| EV-CONTRACT-013 | ["TC-RECOVERY-001","TC-RECOVERY-002","TC-RECOVERY-003","TC-RECOVERY-004","TC-RECOVERY-005"] | SUITE-C；`artifacts/test/<run_id>/suites/<suite_id>/<context_id>/report.json`+cases+context+checks | `reports/runs/<run_id>/evidence/EV-CONTRACT-013.json`及.md | AC-EVID-BR-CONTRACT-013；AC-BR-021/AC-BR-028/AC-BR-031/AC-BR-034/AC-BR-036；VETO-BR-005 | 缺失/不足暂停受影响P0；确证失败按其实际assertion/§11；不补EV |
| EV-CONTRACT-014 | ["TC-LOCAL-001","TC-LOCAL-002","TC-LOCAL-003","TC-LOCAL-004","TC-LOCAL-005","TC-LOCAL-006"] | SUITE-L/SUITE-REAL；`artifacts/test/<run_id>/suites/<suite_id>/<context_id>/report.json`+cases+context+checks | `reports/runs/<run_id>/evidence/EV-CONTRACT-014.json`及.md | AC-EVID-BR-CONTRACT-014；AC-BR-007/AC-BR-018；无独立VETO | 缺失/不足暂停受影响P0；确证失败按其实际assertion/§11；不补EV |
| EV-CONTRACT-015 | ["TC-READ-001","TC-READ-002","TC-READ-003","TC-READ-004"] | SUITE-R；`artifacts/test/<run_id>/suites/<suite_id>/<context_id>/report.json`+cases+context+checks | `reports/runs/<run_id>/evidence/EV-CONTRACT-015.json`及.md | AC-EVID-BR-CONTRACT-015；AC-BR-026/AC-BR-033/AC-BR-034/AC-BR-036；VETO-BR-005 | 缺失/不足暂停受影响P0；确证失败按其实际assertion/§11；不补EV |
| EV-CONTRACT-016 | ["TC-AUDIT-001","TC-AUDIT-002","TC-AUDIT-003","TC-AUDIT-004","TC-AUDIT-005"] | SUITE-C/SUITE-A；`artifacts/test/<run_id>/suites/<suite_id>/<context_id>/report.json`+cases+context+checks | `reports/runs/<run_id>/evidence/EV-CONTRACT-016.json`及.md | AC-EVID-BR-CONTRACT-016；AC-BR-028/AC-BR-032/AC-BR-034/AC-BR-035/AC-BR-036；VETO-BR-004 | 缺失/不足暂停受影响P0；确证失败按其实际assertion/§11；不补EV |
| EV-CONTRACT-017 | ["TC-CONFIG-001","TC-CONFIG-002","TC-CONFIG-003","TC-CONFIG-004","TC-CONFIG-005","TC-CONFIG-006","TC-CONFIG-007","TC-CONFIG-008","TC-CONFIG-009","TC-CONFIG-010","TC-CONFIG-011","TC-CONFIG-012"] | SUITE-B/SUITE-I/SUITE-A/SUITE-P/SUITE-C/SUITE-W/SUITE-J；`artifacts/test/<run_id>/suites/<suite_id>/<context_id>/report.json`+cases+context+checks | `reports/runs/<run_id>/evidence/EV-CONTRACT-017.json`及.md | AC-EVID-BR-CONTRACT-017；AC-BR-001/AC-BR-002/AC-BR-006；无独立VETO | 缺失/不足暂停受影响P0；确证失败按其实际assertion/§11；不补EV |
| EV-CONTRACT-018 | ["TC-PRIVATE-001","TC-PRIVATE-002","TC-PRIVATE-003","TC-PRIVATE-004","TC-PRIVATE-005"] | SUITE-P；`artifacts/test/<run_id>/suites/<suite_id>/<context_id>/report.json`+cases+context+checks | `reports/runs/<run_id>/evidence/EV-CONTRACT-018.json`及.md | AC-EVID-BR-CONTRACT-018；AC-BR-002/AC-BR-005/AC-BR-013/AC-BR-016/AC-BR-017/AC-BR-020/AC-BR-025/AC-BR-037/AC-BR-038；VETO-BR-003 | 缺失/不足暂停受影响P0；确证失败按其实际assertion/§11；不补EV |
| EV-CONTRACT-019 | ["TC-ENTRY-001","TC-ENTRY-002","TC-ENTRY-003","TC-ENTRY-004","TC-ENTRY-005","TC-ENTRY-006","TC-ENTRY-007"] | SUITE-I/SUITE-W/SUITE-J；`artifacts/test/<run_id>/suites/<suite_id>/<context_id>/report.json`+cases+context+checks | `reports/runs/<run_id>/evidence/EV-CONTRACT-019.json`及.md | AC-EVID-BR-CONTRACT-019；AC-BR-008/AC-BR-014/AC-BR-027；无独立VETO | 缺失/不足暂停受影响P0；确证失败按其实际assertion/§11；不补EV |
| EV-CONTRACT-020 | ["TC-STATE-001","TC-STATE-002","TC-STATE-003","TC-STATE-004","TC-STATE-005","TC-STATE-006"] | SUITE-D/SUITE-I/SUITE-J/SUITE-W；`artifacts/test/<run_id>/suites/<suite_id>/<context_id>/report.json`+cases+context+checks | `reports/runs/<run_id>/evidence/EV-CONTRACT-020.json`及.md | AC-EVID-BR-CONTRACT-020；AC-BR-034/AC-BR-038；无独立VETO | 缺失/不足暂停受影响P0；确证失败按其实际assertion/§11；不补EV |
| EV-CONTRACT-021 | ["TC-EVIDENCE-001","TC-EVIDENCE-002","TC-EVIDENCE-003","TC-EVIDENCE-004","TC-EVIDENCE-005"] | SUITE-TOOLS；`artifacts/test/<run_id>/suites/<suite_id>/<context_id>/report.json`+cases+context+checks | `reports/runs/<run_id>/evidence/EV-CONTRACT-021.json`及.md | AC-EVID-BR-CONTRACT-021；AC-BR-032/AC-BR-037/AC-BR-038；VETO-BR-003/VETO-BR-004 | 缺失/不足暂停受影响P0；确证失败按其实际assertion/§11；不补EV |
| EV-REAL-001 | ["TC-REAL-001","TC-REAL-002","TC-REAL-003","TC-REAL-004","TC-REAL-005","TC-REAL-006","TC-REAL-007"] | SUITE-REAL；`artifacts/test/<run_id>/suites/<suite_id>/<context_id>/report.json`+cases+context+checks | `reports/runs/<run_id>/evidence/EV-REAL-001.json`及.md | AC-EVID-BR-REAL-001；AC-BR-002/AC-BR-008/AC-BR-010/AC-BR-014/AC-BR-024/AC-BR-038；VETO-BR-001/VETO-BR-006 | 缺失/不足暂停受影响P0；确证失败按其实际assertion/§11；不补EV |

### 10.4 report完整性与acceptancehandoff检查

| 必查材料 | 固定路径 | 通过条件 | 缺失/实际失败 |
|---|---|---|---|
| context/原安全产物 | `artifacts/test/<run_id>/context.json`、`index.json`、`cases/<instance_id>.json`、`suites/<suite_id>/<context_id>/report.json`和safe .log | schema/digest/fullmanifest/真实执行/实际scope，与05rolepath一致 | 缺则pause/partial，禁材/伪造确证失败 |
| 两check | `artifacts/test/<run_id>/checks/run-context.json`、`checks/test-evidence.json` | actualchecker及完整结构/关联/安全检查 | 不允许report/finalEV报passed |
| runreport | `reports/runs/<run_id>/index.json`、`summary.md`、`evidence-index.md`、`gate-results.md`、`redaction-check.md` | 22EV及全部releasegate真实报告反查，所有safe bytes | 送验不成立或对应确证失败 |
| suite/EV可读页 | `reports/runs/<run_id>/suites/<suite_id>/<context_id>.md`、`evidence/<EV-ID>.json`与.md | 与actualartifact/status/有限模板精确同源 | 无原artifact/错误digest不完整 |
| acceptance初稿 | `reports/acceptance/<run_id>/handoff.json`与.md、`veto-checklist.md`、`open-issues.md`、`risk-acceptance.md` | true draft+exactReportIndex，人工补6VETO/缺陷/risk，无fakeacceptor | 未人审不能送验/签署 |
| actualreview | `reports/review/<run_id>/review.json`、`reviewer-notes.md` | 实际授权assignment+两原disposition/schema+safecommentcode | 缺review/changes_requested按§14暂停 |
| 最终人工裁决 | §14计划`reports/acceptance/<run_id>/decision.md`和`signatures.md` | 独立安全人材，实际authority及基线绑定，非05DTO/tool输出 | 当前waiting未创建，不能自动verdict |

这些固定run细化路径是标准§5.10允许的等价入口；不存在无run别名、latest或全局交接路径替代。全22EV/116TC/38原AC方向须按05registry逐项反查，gate共享引用不重复case。实际检查须从真实材料复核，不能把这张表当作证据索引。

### 10.5 证据缺失与真实性处理规则

22EV与八report门禁须独立裁决，source path/TC/EV/AC/VETO反查遵守05registry；九DTO语义及四成熟度不变。实际orphan、digest、redaction、missing、qualification不足阻送验；充分确证的伪造或禁材按§11/12裁失败，不能借人工签署覆盖VETO/P0。报告初稿不产生actual verdict/readiness；当前没有run、artifact、report或review实例，不能把计划条目作为实际材料。

## 8. 回填草稿

正式06§10直接摘录§7全部规范卡与共同规则；§3逐项决策和§10设计静态停审不进入正式正文，不增加运行结果。

## 9. 待确认事项

BR-UP-001~009、Workspace十二open、Observability十二affected原状态/实施blocked与实际平台/owner/secret/route/driver/executor/producer/批准预算和retention资格不由本Step关闭；没有测试结果或验收签署。

## 10. 自检与进入下一步条件

### Step15装配前过程归档

以下为本Step原§7末的设计静态审查记录，仅留过程区，不进入正式正文，不代表运行。

### 10.5 跨证据停审

22EV+8report项独立decision/card/staticstop；当前artifact/report/run/review全部未生成。设计中sourcepaths/TC/EV/AC/VETO反查完整，所有9DTO语义及四成熟度不变。actualorphan/digest/redaction/missing/qualification不足将阻送验，不以人工签署覆盖VETO/P0，不以报告初稿产生实际verdict/readiness。

### 逐项停审

| 验收项 | 设计来源/字段/TC/EV/path/副作用静态审查 | 门禁 | 下一动作 |
|---|---|---|---|
| AC-EVID-BR-CONTRACT-001 | 正式合同/原字段、通过/失败/副作用、4个具体TC和1个EV固定路径已逐项检查；errors=[]，非运行结果 | pass_design_static_only | next_item_only |
| AC-EVID-BR-CONTRACT-002 | 正式合同/原字段、通过/失败/副作用、4个具体TC和1个EV固定路径已逐项检查；errors=[]，非运行结果 | pass_design_static_only | next_item_only |
| AC-EVID-BR-CONTRACT-003 | 正式合同/原字段、通过/失败/副作用、5个具体TC和1个EV固定路径已逐项检查；errors=[]，非运行结果 | pass_design_static_only | next_item_only |
| AC-EVID-BR-CONTRACT-004 | 正式合同/原字段、通过/失败/副作用、5个具体TC和1个EV固定路径已逐项检查；errors=[]，非运行结果 | pass_design_static_only | next_item_only |
| AC-EVID-BR-CONTRACT-005 | 正式合同/原字段、通过/失败/副作用、4个具体TC和1个EV固定路径已逐项检查；errors=[]，非运行结果 | pass_design_static_only | next_item_only |
| AC-EVID-BR-CONTRACT-006 | 正式合同/原字段、通过/失败/副作用、4个具体TC和1个EV固定路径已逐项检查；errors=[]，非运行结果 | pass_design_static_only | next_item_only |
| AC-EVID-BR-CONTRACT-007 | 正式合同/原字段、通过/失败/副作用、4个具体TC和1个EV固定路径已逐项检查；errors=[]，非运行结果 | pass_design_static_only | next_item_only |
| AC-EVID-BR-CONTRACT-008 | 正式合同/原字段、通过/失败/副作用、5个具体TC和1个EV固定路径已逐项检查；errors=[]，非运行结果 | pass_design_static_only | next_item_only |
| AC-EVID-BR-CONTRACT-009 | 正式合同/原字段、通过/失败/副作用、5个具体TC和1个EV固定路径已逐项检查；errors=[]，非运行结果 | pass_design_static_only | next_item_only |
| AC-EVID-BR-CONTRACT-010 | 正式合同/原字段、通过/失败/副作用、5个具体TC和1个EV固定路径已逐项检查；errors=[]，非运行结果 | pass_design_static_only | next_item_only |
| AC-EVID-BR-CONTRACT-011 | 正式合同/原字段、通过/失败/副作用、4个具体TC和1个EV固定路径已逐项检查；errors=[]，非运行结果 | pass_design_static_only | next_item_only |
| AC-EVID-BR-CONTRACT-012 | 正式合同/原字段、通过/失败/副作用、5个具体TC和1个EV固定路径已逐项检查；errors=[]，非运行结果 | pass_design_static_only | next_item_only |
| AC-EVID-BR-CONTRACT-013 | 正式合同/原字段、通过/失败/副作用、5个具体TC和1个EV固定路径已逐项检查；errors=[]，非运行结果 | pass_design_static_only | next_item_only |
| AC-EVID-BR-CONTRACT-014 | 正式合同/原字段、通过/失败/副作用、6个具体TC和1个EV固定路径已逐项检查；errors=[]，非运行结果 | pass_design_static_only | next_item_only |
| AC-EVID-BR-CONTRACT-015 | 正式合同/原字段、通过/失败/副作用、4个具体TC和1个EV固定路径已逐项检查；errors=[]，非运行结果 | pass_design_static_only | next_item_only |
| AC-EVID-BR-CONTRACT-016 | 正式合同/原字段、通过/失败/副作用、5个具体TC和1个EV固定路径已逐项检查；errors=[]，非运行结果 | pass_design_static_only | next_item_only |
| AC-EVID-BR-CONTRACT-017 | 正式合同/原字段、通过/失败/副作用、12个具体TC和1个EV固定路径已逐项检查；errors=[]，非运行结果 | pass_design_static_only | next_item_only |
| AC-EVID-BR-CONTRACT-018 | 正式合同/原字段、通过/失败/副作用、5个具体TC和1个EV固定路径已逐项检查；errors=[]，非运行结果 | pass_design_static_only | next_item_only |
| AC-EVID-BR-CONTRACT-019 | 正式合同/原字段、通过/失败/副作用、7个具体TC和1个EV固定路径已逐项检查；errors=[]，非运行结果 | pass_design_static_only | next_item_only |
| AC-EVID-BR-CONTRACT-020 | 正式合同/原字段、通过/失败/副作用、6个具体TC和1个EV固定路径已逐项检查；errors=[]，非运行结果 | pass_design_static_only | next_item_only |
| AC-EVID-BR-CONTRACT-021 | 正式合同/原字段、通过/失败/副作用、5个具体TC和1个EV固定路径已逐项检查；errors=[]，非运行结果 | pass_design_static_only | next_item_only |
| AC-EVID-BR-REAL-001 | 正式合同/原字段、通过/失败/副作用、7个具体TC和1个EV固定路径已逐项检查；errors=[]，非运行结果 | pass_design_static_only | next_item_only |
| AC-REPORT-BR-001 | 正式合同/原字段、通过/失败/副作用、28个具体TC和4个EV固定路径已逐项检查；errors=[]，非运行结果 | pass_design_static_only | next_item_only |
| AC-REPORT-BR-002 | 正式合同/原字段、通过/失败/副作用、24个具体TC和4个EV固定路径已逐项检查；errors=[]，非运行结果 | pass_design_static_only | next_item_only |
| AC-REPORT-BR-003 | 正式合同/原字段、通过/失败/副作用、14个具体TC和3个EV固定路径已逐项检查；errors=[]，非运行结果 | pass_design_static_only | next_item_only |
| AC-REPORT-BR-004 | 正式合同/原字段、通过/失败/副作用、27个具体TC和4个EV固定路径已逐项检查；errors=[]，非运行结果 | pass_design_static_only | next_item_only |
| AC-REPORT-BR-005 | 正式合同/原字段、通过/失败/副作用、18个具体TC和3个EV固定路径已逐项检查；errors=[]，非运行结果 | pass_design_static_only | next_item_only |
| AC-REPORT-BR-006 | 正式合同/原字段、通过/失败/副作用、24个具体TC和4个EV固定路径已逐项检查；errors=[]，非运行结果 | pass_design_static_only | next_item_only |
| AC-REPORT-BR-007 | 正式合同/原字段、通过/失败/副作用、21个具体TC和4个EV固定路径已逐项检查；errors=[]，非运行结果 | pass_design_static_only | next_item_only |
| AC-REPORT-BR-008 | 正式合同/原字段、通过/失败/副作用、27个具体TC和4个EV固定路径已逐项检查；errors=[]，非运行结果 | pass_design_static_only | next_item_only |


实际只读文档检查：十节结构/围栏/尾空白审查，errors=[]。22EV+8report项逐项停审完成；registry映射实际比对22/116/38无孤儿，不物化任何运行证据，Handoff/HumanReview原schema不改。

设计自检=pass_design_static_only；没有运行测试/实际EV或签署。gate_reason=design_static_only_external_gates_open，next_allowed_action=enter_step_11。

完成本步八小阶段及实际文档静态检查后，才允许下一Step；正式06完成即停审，不进入07/实施/运行/stage/commit。
