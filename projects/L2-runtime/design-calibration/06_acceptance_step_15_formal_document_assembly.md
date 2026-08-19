# L2-runtime 06 验收标准 Step 15：正式文档装配

> 对应 SOP：`standards/document/验收标准讨论流程_SOP.md` Step 15
> 回填位置：完整正式 `06-验收标准.md`
> 状态：`completed_continuous_authorized`
> 输入：Step 1~14 全部 `completed_continuous_authorized`、验收标准书写规范、current formal 00~05 与 canonical 177-row registry
> 事实边界：本 Step 只装配 future acceptance decision contract；当前没有送验 tuple、run、artifact、report、evidence instance、defect closure、risk acceptance、verdict、signoff 或 readiness

## 1. 装配前门禁

> 以下两行是正式文件重建开始前的 `preassembly snapshot`，保留用于审计时间线；当前最终状态以本文第 9 节以及 `06_acceptance_calibration_flow.md` / `project_execution_ledger.md` 的 `closed_stop_review` 为准。

| Gate | Audit result | Assembly effect |
|---|---|---|
| project ledger (preassembly snapshot) | `06 / Step 15 / formal_document_assembly / in_progress` | only formal 06 may be rebuilt |
| document flow (preassembly snapshot) | Step 1~14 completed；Step 15 in progress | no Step skipped or merged |
| formal source | current Runtime 00~05 and current standards first | old 06 cannot be inherited |
| requirement truth | 20 core FR + 4 peripheral；44 BR；19 NFR；36 AC；8 VF | no new acceptance subject |
| design truth | 12 CAP；48 protocol/job surfaces；31 state subjects；13 slots；15 config slices | exact formal names only |
| test truth | 37 CUT；172 raw + 5 aggregate；177 TC/EV；8 suites；9 checks | registry is M0 identity, not evidence |
| acceptance steps | Step 5~11 P0 gates/evidence/VETO all design-stop-reviewed | formal pass conditions may be assembled |
| current actual state | `not_entered / none / not_bound / not_formed` | no actual verdict or readiness may be written |

Result: preassembly gate passes for writing the decision contract. It does not mean implementation, test, evidence or acceptance has passed.

## 2. Canonical denominator audit

```text
requirements  = 20 core FR + 4 peripheral FR + 44 BR + 19 NFR
acceptance    = 36 AC + 8 VF
design        = 12 CAP + 48 surfaces + 31 states + 13 external slots + 15 config slices
test          = 37 CUT + 172 raw TC + 5 aggregate TC = 177 TC
evidence M0   = 177 unique planned EV identities
suites        = 35/32/32/16/25/15/17/5 = 177
checks        = 9 mandatory
blockers      = 12 blocker/preflight rows
residual risk = 13 open/pending/blocked rows + RR014 design-closed-by-Step-15; accepted = 0
```

Mechanical registry audit:

| Audit | Result |
|---|---|
| canonical rows | 177 |
| unique TC / duplicate | 177 / 0 |
| unique EV / duplicate | 177 / 0 |
| suite ownership | `unit_state=35`,`contract_protocol=32`,`service_semantics=32`,`entry_worker_job=16`,`fault_replay_consistency=25`,`config_builder=15`,`security_source_boundary=17`,`local_e2e=5` |
| AC set | 36/36 formal AC appear；missing=0 |
| VF set | 8/8 formal VF appear；missing=0 |
| protocol inventory | `17 Command + 12 Query + 6 inbound Event + 6 outbound Event + 7 Job = 48` |
| state/consistency | `31 state + 7 UoW + 6 replay/concurrency` |
| positive slots | 13/13 local SLOT identities；dedicated QUAL identities absent and blocked by design |

## 3. 15 章来源映射

每个正式章节开头必须直接标注以下 calibration source，不得只在参考章汇总：

| Formal chapter | Required calibration source | Required conclusion |
|---:|---|---|
| 1 | `06_acceptance_step_01_input_boundary.md` | current input precedence、six dependency types、historical boundary |
| 2 | `06_acceptance_step_02_scope.md` | G0/G1/G2/G3/product scope and conclusion ceiling |
| 3 | `06_acceptance_step_03_baseline.md` | immutable tuple、denominator、fixed paths、change invalidation |
| 4 | `06_acceptance_step_04_entry_exit.md` | process states、entry/exit、pause/re-entry |
| 5 | `06_acceptance_step_05_function_gate.md` | AC001~020 and exact TC/EV/report closure |
| 6 | `06_acceptance_step_06_data_arch_redlines.md` | AC021~030、ownership/no-body/no-write/phase redlines |
| 7 | `06_acceptance_step_07_interfaces_events_sync.md` | 48 surfaces、13 slots、dependency and positive qualification split |
| 8 | `06_acceptance_step_08_state_tx_consistency.md` | 31 states、7 UoW、6 replay、CAS/lease/cursor/fence |
| 9 | `06_acceptance_step_09_nonfunctional.md` | NFR001~019、structural gate、characterization-only performance |
| 10 | `06_acceptance_step_10_observability_evidence.md` | observation/audit/evidence split、M0~M5、177 eligibility、9 checks |
| 11 | `06_acceptance_step_11_veto.md` | VF001~008 all S and non-acceptable |
| 12 | `06_acceptance_step_12_defect_release.md` | S/A/B/C、new-run retest、G0~G3 release gates |
| 13 | `06_acceptance_step_13_risk_residual.md` | RR001~014、risk fields、blocker sync、accepted=0 |
| 14 | `06_acceptance_step_14_verdict_signoff.md` | three-value verdict、dimension isolation、roles/archive/readiness split |
| 15 | this Step 15 artifact | formal sources、standards、current actual boundary and self-audit |

## 4. Cross-gate decision audit

| Decision chain | Closed design contract | Orphan/conflict audit |
|---|---|---|
| AC001~020 | capability/FR/Flow/state -> exact registry TC/EV -> owning suite/report -> failure/VF effect | 20/20 present；no representative-only shortcut |
| AC021~030 | owner/data/phase redline -> exact registry TC/EV -> VETO interaction | 10/10 present；no owner truth transfer |
| AC031~036 | 19 NFR + protocol/state/config/observation/evidence sources -> registry rows/checks | 6/6 present；no numeric threshold invention |
| VF001~008 | formal redline -> case/check -> fixed path -> S stop/new run | 8/8；none risk-acceptable |
| protocols | exact C/Q/E/O/J name -> one primary TC/EV + companions -> phase/dependency ceiling | 48/48；logical pass not delivery/readiness |
| slots | local finite posture -> G2 candidate -> G3 dedicated QUAL | 13/13 positive qualification blocked；G1 denominator unchanged |
| state/UoW/replay | legal/illegal transition + version/fence/order -> raw/report/EV | 31/7/6；no old 18-state alias |
| evidence | M0 registry -> M1 raw -> M2 report -> M3 EV -> M4 draft -> M5 review | no skipped maturity or cross-run/static promotion |
| defects/risks/verdict | failure truth -> defect/retest -> eligible residual -> three-value verdict/signoff | actual records absent；no fabricated closure |

## 5. Historical pollution rejection

The existing formal 06 is `historical_material` and must be deleted before reconstruction. Its following assertions conflict with current formal truth:

| Historical assertion | Current disposition |
|---|---|
| 20 CUT | reject；current CUT denominator is 37 |
| 18 state machines | reject；current canonical state denominator is 31 |
| 109 planned EV | reject；current registry has 177 unique TC/EV pairs |
| 12 suites / 4 checks | reject；current contract is 8 suites / 9 checks |
| legacy `TC-CMD/QRY/INE/OUT/JOB/SM-*` aliases | reject；use current exact `TC-Cxx/Qxx/Exx/Oxx/Jxx/SMnn-*` identities |
| old suite/report owners | reject；use current eight owning suite names and fixed same-run roots |
| current readiness/verdict wording | reject；actual process is `not_entered` and no decision package exists |

Historical strings may appear in the new document only inside an explicit rejection statement. They must never be used as a denominator, identity, gate or evidence source.

## 6. Formal assembly contract

1. Delete the old formal `06-验收标准.md`, then create a new file; do not patch the old acceptance subject in place.
2. Use exactly 15 numbered chapters and place the concrete calibration source block at the beginning of every chapter.
3. Preserve exact design identifiers, pass condition, failure condition, canonical TC/EV source and fixed report path for every P0 acceptance gate.
4. Keep detailed exact mapping authority in the formal gate tables and the 177-row registry; do not replace it with “see test report”.
5. Keep `compile/runtime/event/ref/adapter/fake` explicit and never infer package dependency from runtime/event collaboration.
6. State all blocker/positive-lane ceilings; never shrink the local 177 denominator because an external seam is blocked.
7. Write normative future rules only. Do not write SOP questions, execution logs, test results, actual defects, accepted risks, names, dates, verdicts, signatures or readiness.
8. Use `artifacts/test/<run_id>`、`reports/runs/<run_id>` and `reports/acceptance/*`; prohibit moving aliases and project-nested paths.
9. Keep `not_entered/not_decidable` separate from `通过/有条件通过/不通过`.
10. Complete syntax, chapter-source, identity-count, path, status-truth and historical-pollution audits before closing Step 15.

Planned write batches:

```text
batch A: metadata + chapters 1~4
batch B: chapters 5~7
batch C: chapters 8~11
batch D: chapters 12~15
batch E: self-audit fixes and ledger/flow closure
```

## 7. Current actual boundary

| Actual subject | Current value |
|---|---|
| process state | `not_entered` |
| acceptance instance / immutable tuple | absent |
| implementation revision / build / environment | absent |
| run / artifact / report / EV instance | none |
| AC / VF disposition | none / not bound |
| defect / retest / closure | none / not measured |
| risk acceptance | none；accepted count=0 |
| verdict / signoff / readiness | none / not bound / not formed |
| external positive qualification | 13/13 `blocked_dependency/not_runnable` |

These are absence-of-entry facts, not a fabricated “不通过” result.

## 8. Preassembly stop-review (historical snapshot)

> 本节记录正式装配前的门禁快照；其中 `Step 15 active/in_progress` 是装配开始时的历史状态，不能覆盖本文件末尾及 flow/ledger 的最终 `closed_stop_review` 状态。

| Audit | Result |
|---|---|
| Step status (preassembly snapshot) | Step 1~14 completed；Step 15 active |
| source/denominator | exact current formal sources and counts verified |
| P0 decision closure | AC/VF/protocol/state/NFR/evidence/VETO chains design-closed |
| fixed paths | canonical raw/report/acceptance roots fixed |
| blocker/readiness | open facts retained；no inferred closure |
| historical material | stale old 06 identities identified for deletion |
| actual facts | all execution/acceptance values remain absent/none |
| formal write gate | passed for full-restart assembly only |

```text
step_status = completed_continuous_authorized
preassembly_audit = passed
formal_06_write_allowed = false_after_completion
actual_acceptance_state = not_entered
assembly_result = formal_06_rebuilt_and_self_audited
next_action = stop_review_and_user_report
next_document = none_until_explicit_next_document_authorization
commit_required = false
```

## 9. Post-assembly final audit

| Audit | Result |
|---|---|
| formal file lifecycle | old `06-验收标准.md` deleted first, then recreated in five apply-patch batches |
| chapter structure | 15 numbered chapters; 15 concrete `06_acceptance_step_*` source blocks |
| requirement closure | 36 explicit AC rows; 8 explicit VF rows; 19 explicit NFR rows |
| functional/redline/NFR | AC001~020 = 20 rows; AC021~030 = 10 rows; AC031~036 = 6 rows |
| protocol closure | 17 Commands + 12 Queries + 6 inbound Events + 6 outbound Events + 7 Jobs = 48 rows |
| external seam closure | 13 SLOT rows; positive `TC-QUAL-SLOTnn` remains separate and blocked |
| state/transaction closure | 31 SM rows + 7 UoW rows + 6 replay rows |
| evidence closure | registry 177/177 unique TC/EV; suite counts `35/32/32/16/25/15/17/5`; 9 checks |
| evidence identity audit | every concrete formal TC/EV token resolves to current registry; only future QUAL placeholder and explicitly forbidden `EV-CAND-*` namespace are non-registry markers |
| path/status audit | fixed raw/report/acceptance roots; no `latest`, project-nested path, static evidence or status promotion |
| historical pollution | old 20 CUT/18 state/109 EV/12 suite/4 check identities appear only as explicit rejection, never as active denominator |
| residual risks | 14 rows retained; 13 open/pending/blocked/characterization, RR014 design-closed by Step 15; accepted=0 |
| actual acceptance | no tuple/run/artifact/report/EV/defect/retest/verdict/signoff/readiness; process=`not_entered` |
| downstream serial gate | 07 untouched; no implementation or commit action |

The final audit is a design/document audit only. It does not create a run, evidence instance, verdict, risk acceptance or readiness claim.
