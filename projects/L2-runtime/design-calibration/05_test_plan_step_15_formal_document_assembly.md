# L2-runtime 05 测试方案 Step 15：正式文档装配

> 对应 SOP：`standards/document/测试方案讨论流程_SOP.md` Step 15
> 目标：删除重建 `projects/L2-runtime/05-测试方案.md`
> 状态：`closed_stop_review`
> 事实边界：只装配测试设计；不运行测试、不生成 artifact/report/evidence/verdict/signoff/readiness

## 1. 三层装配门禁

| Gate | Preassembly result | Evidence |
|---|---|---|
| project ledger | pass | 当前文档 05、Step 15、仅允许正式 05 装配 |
| document flow | pass | Steps 1~14 `completed_continuous_authorized`; Step 15 `in_progress` |
| Step modules | pass | 37 CUT、177 registry、8 suites、evidence DTO、regression/risk 均已停审 |
| serial order | pass | 00~04 正式输入已闭合；06 仍 historical/not entered |
| write scope | pass | 只修改 design repo 05 calibration/formal files；不实现代码 |
| commit | not requested | 本轮不提交 |

## 2. Canonical assembly baseline

```text
20 core FR + 4 peripheral future FR
44 BR + 19 NFR + 36 AC + 8 VF
37 CUT
12 capabilities
17 Commands + 12 Queries + 6 inbound Events + 6 outbound Events + 7 Jobs
31 state subjects
13 external slots
15 config slices
172 owning raw TC + 5 same-run aggregate TC = 177 TC
177 planned EV identities
8 owning suites = 35/32/32/16/25/15/17/5
9 mandatory checks
13 positive qualification slots = blocked_dependency/not_runnable
```

No item above is an implementation/run/result/evidence fact.

## 3. Formal chapter source map

| Formal chapter | Required calibration source |
|---:|---|
| 1 | `05_test_plan_step_01_input_boundary.md` |
| 2 | `05_test_plan_step_02_scope.md` |
| 3 | `05_test_plan_step_03_test_objects_cuts.md` |
| 4 | `05_test_plan_step_04_strategy_layers.md` |
| 5 | `05_test_plan_step_05_traceability_coverage.md` |
| 6 | `05_test_plan_step_06_cases.md` and four Step 6 annexes |
| 7 | `05_test_plan_step_07_test_data.md` |
| 8 | `05_test_plan_step_08_environment_config.md` |
| 9 | `05_test_plan_step_09_automation_gates.md` |
| 10 | `05_test_plan_step_10_nonfunctional.md` |
| 11 | `05_test_plan_step_11_defects_retest.md` |
| 12 | `05_test_plan_step_12_entry_exit.md` |
| 13 | `05_test_plan_step_13_evidence.md` and `05_test_plan_step_13_evidence_registry.md` |
| 14 | `05_test_plan_step_14_regression_risks.md` |
| 15 | standards、current formal `00~04` and all current 05 calibration artifacts |

Every chapter begins with its exact source block. Formal prose may compact discussion but cannot add a new TC、EV、state、Port、config、gate、status or risk disposition.

## 4. Historical pollution hard rejects

| Historical material | Formal assembly rule |
|---|---|
| old 20-CUT registry | reject; current denominator is 37 |
| old SM-01~18 / 18-state claim | reject; current state subjects are SM-01~31 |
| old `TC-CMD/QRY/INE/OUT/JOB-*` identities | reject; use current `TC-C/Q/E/O/Jxx-001` identities |
| old suite names `unit/contract/service/query/worker_event/jobs/fault_tx/config_entry/security_boundary` | reject; use current eight-suite registry |
| old 109 EV or requirement-level candidate EV as raw evidence | reject; only Step 6 canonical 177 pairs |
| positive integration implied by fake/Candidate/Bound/ping/design | reject; 13 qualification lanes remain blocked |
| fixed implementation/run/result/report/evidence/risk/verdict facts | reject; none exists |
| `latest` or project-qualified artifact/report roots | reject; fixed run roots only |

## 5. Write batches

| Batch | Content | Gate before next batch |
|---|---|---|
| A | metadata + §§1~4 | source blocks, 37 CUT and 31-state strategy visible |
| B | §§5~8 | coverage/cases/data/environment denominators exact |
| C | §§9~12 | 8 suites、9 checks、G0~G3、S/A rules exact |
| D | §§13~15 | evidence DTO/registry、regression/risk、references/self-audit exact |

The historical formal file is deleted before Batch A and never used as a copy source.

## 6. Final self-audit

Completion requires all of the following:

- 15 required chapter headings and 15 exact calibration source blocks.
- 37 CUTs, 31 state subjects, 177 TC/EV identities, current protocol/slot/config denominators.
- Eight suite names/counts and nine check scripts match Steps 9/13/14.
- Every P0 case family has design source, precondition/action/oracle, data/environment/gate/evidence path via §6 and annex links.
- `AC-L2R-001~036` and `VF-L2R-001~008` direction is consumable by future 06; registry table is not misrepresented as proof.
- G1 local, G2 candidate and G3 positive qualification remain independent.
- `L2R-UP-001~008`,`L2R-CP-001`,`L2R-ENTRY-001`,`L2R-IMPL-001`,`L2R-LANG-001` remain open as applicable.
- `L2R-RR-001~014` remain unaccepted.
- No old identity/state/suite/path assertion and no fabricated execution/evidence/verdict/readiness.
- `git diff --check` passes for L2-runtime changed documents.

```text
preassembly_gate = pass
formal_write_allowed = false_after_close_except_authorized_reopen
step_status = closed_stop_review
next_action = stop_review_wait_explicit_user_authorization_for_06
next_document = none_until_user_confirms_06
commit_required = false
```

## 7. Final assembly result

| Audit | Result |
|---|---|
| formal structure | 15/15 required headings and 15/15 calibration source blocks |
| formal length/granularity | 2020 lines; detailed data/environment/gate/NFR/defect/evidence/regression implementation contracts retained |
| registry identity | 177 TC unique, 177 EV unique, 177 explicit pairs |
| suite denominator | exact `35/32/32/16/25/15/17/5` |
| acceptance/veto trace | `AC-L2R-001~036` and `VF-L2R-001~008` all represented in registry |
| canonical inventory | 37 CUT; 12 CAP; 17/12/6/6/7 protocols/jobs; 31 SM; 13 slots; 15 config slices |
| automation/evidence | 8 suites, 9 checks, fixed DTO/path/digest/status/writer/derivation rules |
| blocker/risk truth | 12 blocker/preflight re-entry rows open as applicable; 14 risks not accepted |
| historical pollution | old 20 CUT, 18-state, legacy TC/suite/path assertions rejected or named only as rejected material |
| fabricated facts | zero implementation/run/result/artifact/report/evidence/verdict/signoff/readiness facts |
| whitespace audit | `git diff --check` pass for the formal and closure files |

```text
formal_05_rebuild = complete
final_audit = pass
formal_status = closed_stop_review
actual_run_artifact_report_evidence = 0
actual_verdict_signoff_readiness = 0
next_formal_document_allowed = false_until_explicit_user_confirmation
```
