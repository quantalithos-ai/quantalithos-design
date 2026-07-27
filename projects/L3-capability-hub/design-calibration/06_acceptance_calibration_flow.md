# L3-capability-hub 06 验收标准校准工作台

> 对应 SOP: `standards/document/验收标准讨论流程_SOP.md`
> 书写规范: `standards/document/验收标准书写规范.md`
> 中间产物规范: `standards/document/设计文档讨论中间产物规范.md`
> 可落码性标准: `standards/document/设计真相源闭环与可落码性标准.md`
> 目标正式文档: `projects/L3-capability-hub/06-验收标准.md`
> 创建日期: 2026-07-25
> 当前模式: full-restart / continuous execution
> 当前状态: `06_completed_design_task_wait_implementation_handoff`

---

## 1. 本轮目标

按验收标准 SOP 将full-restart后的正式`00-需求文档.md`至`05-测试方案.md`转译为可判定、可追溯、可复验且可供正式`07-实施计划.md`消费的新验收标准。

正式`06-验收标准.md`只能在Step 15由Steps 1~14中间产物整体装配。本轮必须保持：

- 每个P0验收项形成`验收主题 -> AC/VF -> design contract -> TC/DS/EV contract -> raw/report path -> pass/fail -> verdict impact`闭环；
- formal 06只定义裁决合同，不声称交付物、实现仓、environment、run、artifact、report、evidence instance、defect、risk decision、review或signoff存在；
- `通过|有条件通过|不通过|不可裁决`的条件分离，draft或empty decision不被解释为通过；
- 13个`VF-CH-*`、confirmed S、current P0 A、evidence-integrity和责任红线不得进入风险接受；
- Capability Hub只验capability identity、registry、adapter descriptor、governance seam、method relation、formal exposure与SDK server boundary，不吸收runtime/tools execution、approval、method body、marketplace listing、provider route/cost或SDK client/cache责任；
- future Rust交付仍须以完整英文`///`覆盖declaration、每个struct field、enum variant/payload field、trait、method和callable，enum struct-variant field不得写field-level`pub`。

## 2. 权威输入

| Input | Authority | Acceptance use | Must not infer |
|---|---|---|---|
| `00-需求文档.md` | active formal requirement | 5 core closures、16 FR、37 BR、20 NFR、37 AC、13 VF、scope/responsibility/data redlines | execution result、risk decision、signoff |
| `01-架构设计.md` | active formal architecture | bounded ownership、dependency、data/consistency/security redlines | product/deployment readiness |
| `02-概要设计.md` | active formal HLD | 8 components、43 objects、interfaces/flows/states/errors | exact code or acceptance evidence |
| `03-详细设计.md` | direct contract source | 7 modules、250 protocols、36 Ports、22/110 repositories、83 flows、24/111/638 states、TX/binding/observation | implementation existence or test pass |
| `04-配置设计.md` | direct configuration source | strict sources、18/27/21 catalog、3 profiles/entries、9/6/10 bindings、failure/activation/redlines | selected config/product readiness |
| `05-测试方案.md` | direct test/evidence contract | 189 TC/DS/EV contracts、10 suites、5 gates、9 checks、4 builders、fixed roots、defect/regression/evidence rules | run-scoped evidence instance or result |
| `05_test_plan_step_05_traceability_coverage.md` | exact reverse registry | AC/VF to cut/case direction and orphan audit | acceptance verdict |
| `05_test_plan_step_13_evidence.md` | exact evidence contract | EV schemas、same-run pairing、AC 37/VF 13 consumers、review/retention | real alias/digest/report/review |
| `05_test_plan_step_14_regression_risks.md` | risk/retest input | R0~R4、13 change surfaces、16 current prerequisites/risks、never-acceptable set | accepted residual or person |
| current `06-验收标准.md` | historical material | old-object/topology/threshold/signature contamination diagnosis only | active acceptance item or baseline |
| current/missing `07-实施计划.md` | not an acceptance source | downstream target only after Step 15 | phase/boundary/commit/required-check fact |
| L1-governance/L1-artifact/L3-method-library acceptance Steps | framework reference | Step structure、item-loop、gate/evidence/risk/signoff depth | domain IDs、objects、thresholds、roles or results |

## 3. Historical-material disposition

| Historical content | Conflict | Disposition |
|---|---|---|
| old 10-chapter formal 06 | current standard requires 15 chapters and exact calibration sources | replace-only in Step 15；no partial patch |
| `MCPServer/A2ANode/ProviderContract/CapabilityDecision/CostRecord` acceptance owners | conflict with identity/registry/descriptor/seam/relation/exposure truth model | no rename or alias；exclude from active gates |
| KMS/Vault/test PG/bus/runtime-tools dry-run topology | products/environments unselected and responsibilities crossed | record as historical；selected facts remain prerequisites |
| `QueryCapabilities`、policy 30s、P95<50ms、100% allow/cost/recovery | no active workload/topology/run provenance and formal 00 explicitly retires these | deny historical threshold re-entry；numeric verdict remains not-evaluated unless controlled reopen |
| API/DB/log/model-review evidence labels | no canonical TC/EV、run、raw/report/digest provenance | replace with Step 13 fixed evidence contracts |
| S/A/B waiver prose | current P0 A is blocking and all VF/S non-waivable | rebuild exact release/risk eligibility in Steps 11~13 |
| risk rows with named team/person-like acceptors | no authorization/decision/timestamp/evidence | not accepted；do not carry forward |
| empty final conclusion/signature cells | historical placeholder, not a decision | Step 14 defines schema only；keep all actual values absent |

旧formal 06在Step 15整体替换前始终不是active acceptance authority。它不能证明任何gate、result、risk或signoff，也不能通过同义词迁移回新主线。

## 4. Step status table

| Step | Topic | Calibration artifact | Status |
|---|---|---|---|
| Step 1 | 确认验收输入边界 | `06_acceptance_step_01_input_boundary.md` | [x] completed；active authority、14 must-answer、11 must-not-answer、future baseline and historical isolation closed |
| Step 2 | 明确验收目标与范围 | `06_acceptance_step_02_scope.md` | [x] completed；12 goals、four scope layers、12 P0 subjects、37 AC owners、13 VF and adjacent seams closed |
| Step 3 | 固定验收基线 | `06_acceptance_step_03_baseline.md` | [x] completed；189/189/189 contracts、638 pairs、83 flows、fixed roots、baseline drift/new-run rules closed；real execution values remain absent |
| Step 4 | 定义进入条件与退出条件 | `06_acceptance_step_04_entry_exit.md` | [x] completed；entry/exit layers、189/638 denominators、blocked/invalid/not-evaluated semantics and pause rules closed；no execution fact |
| Step 5 | 定义功能验收门禁 | `06_acceptance_step_05_function_gate.md` | [x] completed；5 core + 16 FR + peripheral isolation，22/22 functional rows closed |
| Step 6 | 定义数据边界与架构红线验收 | `06_acceptance_step_06_data_arch_redlines.md` | [x] completed；AC023..032、truth/snapshot/ref/forbidden redlines and adjacent boundaries closed |
| Step 7 | 定义接口、事件与跨仓同步验收 | `06_acceptance_step_07_interfaces_events_sync.md` | [x] completed；83/83 protocols, dependency-type seams, query/event/job synchronization closed |
| Step 8 | 定义状态机、事务与一致性验收 | `06_acceptance_step_08_state_tx_consistency.md` | [x] completed；24/111/638 state registry, 22 TX, idempotency/CAS/commit-unknown and no-repair closed |
| Step 9 | 定义非功能验收门禁 | `06_acceptance_step_09_nonfunctional.md` | [x] completed；20/20 NFR primary mapping、AC-CH-033..037 structural gates、numeric not_evaluated and residual boundary closed |
| Step 10 | 定义可观测性、审计与证据门禁 | `06_acceptance_step_10_observability_evidence.md` | [x] completed；six-layer/four-plane authority、189 EV instance chain、fixed roots、same-run pairing、redaction/dependency/report audit and handoff separation closed |
| Step 11 | 定义一票否决项 | `06_acceptance_step_11_veto.md` | [x] completed；13/13 VF 一对一 VETO、10/10 过程硬红线、闭环矩阵、停审与跨覆盖审计闭合；无真实执行事实 |
| Step 12 | 定义缺陷分级、复验与放行规则 | `06_acceptance_step_12_defects_retest_release.md` | [x] completed；7类观察分类、S/A/B/R、VETO/P0 A阻断、R0~R4、13类变更面、distinct-run与immutable evidence closure已闭合；无真实缺陷或执行事实 |
| Step 13 | 定义风险接受与遗留项 | `06_acceptance_step_13_risk_acceptance.md` | [x] completed；16项风险逐项承接，eligible residual predicate、不可接受矩阵、acceptance record schema、后续同步与受控重开已闭合；accepted=0 |
| Step 14 | 定义最终结论与签署口径 | `06_acceptance_step_14_final_decision_signoff.md` | [x] completed；三值结论、内部暂停状态、P0/selected/release/handoff分层、固定证据入口、六类签署责任和风险接受分离已闭合；无真实verdict/signoff |
| Step 15 | 整理正式验收标准文档 | `06_acceptance_step_15_formal_document_assembly.md` | [x] completed；正式文档已整体装配并通过静态审计 |

## 5. Acceptance inventory lock at initialization

| Axis | Current design contract | Acceptance treatment |
|---|---:|---|
| core closures | 5 | each closure gets explicit gate and all-node/source/evidence condition |
| FR / BR / NFR | 16 / 37 / 20 | preserve formal IDs；no requirement rewriting |
| AC / VF | 37 / 13 | all AC get determinable evidence conditions；all VF become explicit non-waivable vetoes |
| canonical test/data/evidence | 189 / 189 / 189 | evidence contract is not evidence instance；no orphan consumer |
| state | 24 families / 111 variants / 638 pairs | full registry required where acceptance scope applies |
| flows | 26 C + 33 Q + 6 I + 10 O + 8 J = 83 | interface/event/job gates retain exact phase/no-write/reentry rules |
| suites/gates/checks/builders | 10 / 5 / 9 / 4 | future evidence readiness and release handoff only |
| NFR specialties | 20 across 6 categories | structural gates active；numeric threshold absent/not-evaluated |
| current risks/prerequisites | 16 | no accepted row；only future evidence-backed eligible B residual can be reviewed |
| accepted risk / verdict / signoff | 0 / 0 / 0 | actual fields remain absent until real authorized process |

Any count/source discrepancy reopens the owning 00~05 Step；formal 06 cannot repair it by editing acceptance prose。

## 6. Execution discipline

1. 每次Step开工先读project ledger、本flow、current Step、SOP对应Step和active upstream；再先思考、后写artifact。
2. 每个Step独立，不合并function/data/interface/state/NFR/evidence/veto/defect/risk/signoff裁决。
3. 每个P0 acceptance item执行小循环：subject -> formal AC/VF -> exact design source -> TC/DS/EV -> report/raw path -> pass/fail -> verdict impact -> stop-review。
4. 正式06只在Step 15装配；Steps 1~14不得修改formal 06。
5. `EV-CH-*`是formal evidence contract，不是alias或instance；只有explicit run + same-run raw/report/digest/redaction/pairing/no-static成立后才可能被review。
6. `reports/acceptance/*`是future path contract；目录或draft不能自带verdict、acceptor或signature。
7. `latest`、implicit run、cross-run stitching、manual result map、static evidence和retry overwrite全部禁止。
8. Missing/blocked/invalid/incomplete不是pass；P1 unavailable不补偿P0，nightly/release不补偿main。
9. Formal 06不得发明commit、implementation boundary、CI status、selected product、threshold、retention days、person、timestamp或signing key。
10. 用户已授权按`/tmp/L3-capability-hub_full_restart_remaining_tasks.md`连续执行；每项完成后同步本flow、project ledger和`/tmp`，直至T072。

## 7. Truthfulness status

| Fact class | Current value |
|---|---|
| implementation repository/source revision | not established |
| delivery/version/environment baseline | not established |
| test execution/run ID | none |
| artifact/report/digest | none |
| evidence instance/alias | none |
| defect/retest closure | none |
| residual acceptance | none |
| acceptance review/verdict | none |
| named acceptor/signature/timestamp | none |
| unresolved upstream design blocker | none |

“None/not established”不表示failed，也不表示可以进入验收；Step 3~4将其转成future baseline与entry gate。

## 8. Current recovery point

| Current Step | Module | Gate status | Gate reason | Next allowed action | Required reading |
|---|---|---|---|---|---|
| Step 15 `整理正式验收标准文档` | completed | `design_task_completed` | Formal `06-验收标准.md` was rebuilt from Steps 1~14 and passed static assembly audits: 15/15 chapters, 37/37 AC, 13/13 VF, 189/189/189 contracts, 638 state pairs and fixed evidence roots. No actual verdict/review/signoff exists; subsequent `07` and T070/T071/T072 are complete. | `wait_for_authorized_implementation_handoff` | `project_execution_ledger.md`;formal `06/07`;`T071_full_restart_final_audit.md` |

```text
document = 06-验收标准.md
flow = completed
current_step = 15_completed
next_allowed_action = initialize_07_implementation_plan
formal_06_authority = active
acceptance_verdict = not_entered
accepted_risk_count = 0
unresolved_upstream_blocker = none
commit_required = no
```
## Final closure overlay

T072 已关闭本轮设计任务。本文前部的 Step 状态、历史恢复点和文档切换记录保留原始讨论轨迹；当前项目级恢复入口以 `project_execution_ledger.md` 和 `T071_full_restart_final_audit.md` 为准。

| field | value |
|---|---|
| formal_document | `06-验收标准.md` |
| document_status | `acceptance design completed` |
| current_step | `Step 15 completed` |
| final_audit | `design-calibration/T071_full_restart_final_audit.md` |
| unresolved_upstream_design_blocker | `0` |
| implementation_status | `pre_implementation_blocked` |
| implementation_current_boundary | `commit-01-a` |
| implementation_next_allowed_action | `wait_design` |
| commit_required | `no` |

不得依据本文历史段落中的旧 `next_allowed_action` 重新进入已完成 Step。有效的下一动作是 `wait_for_authorized_implementation_handoff`；目标实现仓、immutable baseline、实现代码、测试 run、evidence instance、verdict、signoff 和 commit 均不存在。
