# L2-runtime 06 验收标准 Step 6：数据边界与架构红线

> 对应 SOP：`standards/document/验收标准讨论流程_SOP.md` Step 6
> 回填位置：正式 `06-验收标准.md` §6
> 状态：`completed_continuous_authorized`
> 输入：formal 00 AC021~030/VF、formal 01~03 owner/data/phase contract、formal 05 canonical registry
> 事实边界：本 Step 定义 future P0 redline decision contract；当前无 actual evidence 或 redline disposition

## 1. Redline decision contract

```text
redline_pass(AC) :=
  all registry rows mapped to AC are eligible in one fixed run
  AND Runtime write/call/source graphs contain only declared local ownership
  AND every external value retains owner/scope/version/freshness/ref semantics
  AND candidate/snapshot/projection/summary/receipt/report retains its phase
  AND forbidden material is absent from all persistence/handoff/output surfaces
  AND all mapped applicable VF dispositions are not_triggered
```

任一明确 owner write、secret/body persistence、fail-open、phase promotion 或 sibling compile dependency 都是 P0 failure；若同时命中 `VF-L2R-001~008`，总体结论必须为 `不通过`，不得风险接受。缺少有效 evidence 则为 `not_evaluable/not_decidable`，不能静态推导红线“未触发”。

## 2. Ownership and carrier matrix

| Data family | Runtime may own/write | Runtime may consume/emit | Runtime must never own/write |
|---|---|---|---|
| local run | admission/control decision、ControlledRun、goal/plan working state、loop cursor/history | body-free run/decision/event/view refs | Work/Process/ImplementationPlan/product completion |
| context/memory | composition decision、WorkingContext、working-memory entry/use/window | source snapshot/ref/availability、durable retrieval/candidate/ref/gap | source/method body、durable body/index/retention/delete/rebuild truth |
| model | provider-neutral intent/binding/turn/disposition/safe summary | ephemeral material ref、finite provider result category | provider registry/route/endpoint/secret/quota/cost/raw response/hidden reasoning |
| action/delegation | local choice/guard/attempt/marker、delegation boundary/result incorporation | Governance/Hub/Tools/Sandbox safe views/results/refs | approval/policy、registry/exposure、tools execution/receipt body、isolation/cleanup、member/container/image truth |
| recovery/outcome | checkpoint local record/status/fence、recovery/reflection、local outcome | physical commit proof/ref/status、handoff ACK/ref | physical durability owner truth、delivery/Observed/downstream acceptance |
| projection/handoff | derived body-free view/material、attempt/gap/cursor | immutable committed fact snapshot/event receipt | domain mutation、Artifact/Evidence/report body、Obs backend/audit truth |

Only application/domain UoW may mutate Runtime-owned facts. API/Worker/Jobs/Query/projection/adapter/fake are not alternate truth owners. External owner state may be represented only through typed Port results and immutable safe refs/views; no generic repository or write Port may target external truth.

## 3. AC021~030 redline gates

| AC | Redline / formal anchors | Pass condition | Failure condition | Rows | VF / decision effect |
|---|---|---|---|---:|---|
| `AC-L2R-021` | HLC001/002；ExternalTruthView/SourceSnapshot；source flows | source/snapshot/candidate always retains owner/scope/version/freshness/completeness/ref；local composition records use/decision only；new owner event stales dependents without replacing committed facts | Runtime copies external body or becomes second owner；candidate/snapshot promoted to Runtime truth；late/stale source overwrites current | 10 | `VF001/003/005/006` as applicable；P0 fail |
| `AC-L2R-022` | owner no-write；13 slots；Port/source/dependency graph；builder | Tools/Hub/Method/Governance/Sandbox/Obs/Artifact and provider surfaces expose only declared read/call/event/ref methods；owner spies unchanged；only Core compile candidate | any mutation method/path/repository toward owner；direct Sandbox/provider route；fake in non-test；sibling package dependency；config enables bypass | 17 | `VF001/002/003/006/007/008`；hard fail/VETO |
| `AC-L2R-023` | action five-owner guard；AdapterPosture；CF-B；BOUND004/008 | governed/sandbox-required/capability-bound action with missing/denied/stale/pending/unknown prerequisite produces exact Reject/Wait/Blocked/Gap, zero guarded invocation/direct fallback | default allow、host fallback、Candidate/Bound/design/ping/fake treated ready、call occurs before all current views | 18 | `VF001/002/006`；hard fail/VETO |
| `AC-L2R-024` | Outcome/Handoff/Projection phase；SM13/14/16；outbox/publisher | local outcome/checkpoint/run immutable after commit；summary/receipt/ACK/Observed/report may update only exact attempt/gap/projection/cursor allowed by matching identity/CAS | downstream material changes local outcome/checkpoint/run；receipt=delivery；ACK=acceptance；projection repairs domain truth | 22 | `VF005/006`；hard fail/VETO |
| `AC-L2R-025` | feedback/inbox/wakeup/history；SM10/25；replay/late/collision | model/memory/tool/child/source late/duplicate/out-of-order input is exact replay、record-only、stale no-op or quarantine；one committed history and at most one incorporation/effect | late overwrites turn/plan/outcome；duplicate creates second fact/effect；collision accepted；unknown ACK/drop or re-exec | 27 | `VF004/005` as applicable；P0 fail/VETO |
| `AC-L2R-026` | Runtime owned-truth allow-list；O02；BOUND001/006；SEC003 | source graph, repository traits and write journal show only run/working state/decision/checkpoint/recovery/outcome/local handoff/history/inbox/outbox/projection/job facts | any external owner/body/product truth stored as Runtime aggregate/fact；entry/projection/adapter writes domain outside service UoW | 4 | `VF001/008`；hard fail |
| `AC-L2R-027` | ExternalReference/SafeSnapshot；goal/plan/delegation；dependency graph | Method/Policy/Tool/Sandbox/Artifact/Identity/Work/Process enter only as typed owner/ref/version/scope/freshness/safe view；no body/write or compile dependency | body/source copied；display text infers identity；owner ref mutated；Process/Work completion asserted；sibling package import | 10 | `VF001/003/007/008`；hard fail |
| `AC-L2R-028` | working vs durable memory；CAP05；slot04；SM05 | durable interaction is retrieval request/result ref/candidate/gap with explicit unavailable posture；working fallback marked non-equivalent；no durable calls on local query/compaction | Runtime stores durable body/index or owns retention/delete/rebuild；working entry claimed committed durable；fake closes owner blocker | 7 | `VF001/006`；P0 fail; slot04 positive separate |
| `AC-L2R-029` | HLC003；SafeReason/SafeSummary/SafeMaterial；CFG09/OBS/SEC | canaries prove secret/token/endpoint/raw external/model/tool/Sandbox/Artifact/Evidence/report body/hidden reasoning absent from config、object、history、checkpoint、outbox、event、view、log、report candidate、handoff | any forbidden material persists or leaves boundary；redaction truncates instead of reject; digest/preimage includes forbidden body | 12 | `VF003`；hard fail/VETO/quarantine |
| `AC-L2R-030` | lifecycle/authority axis；context/projection/handoff/config snapshots | candidate/snapshot/projection/summary/report and committed truth have distinct closed types/states/owner/version/source；only explicit transition with proof; projection rebuild from contiguous committed history | mapper/type alias/status conflates phases；candidate becomes committed; report repairs truth; old config/source recaptured mid-operation; gap skipped | 20 | `VF005/006/008` as applicable；P0 fail |

## 4. Fixed evidence path and report rule

For every row in this Step:

```text
TC -> artifacts/test/<run_id>/suites/<suite>/cases/<case_id>.json
EV -> reports/runs/<run_id>/evidence/<evidence_id>.md
suite -> reports/runs/<run_id>/suites/<suite>.md
redline review -> reports/acceptance/veto-checklist.md + handoff.md
```

Static source/dependency/security cases may prove structural absence only when their check artifact records the exact source/build manifest, scanner version, denominator and digest in the same run. A design table, source directory or empty search result without fixed manifest is not evidence.

## 5. Exact TC/EV mapping AC021~025

| AC | Exact canonical TC set | Exact planned EV set | Owning suites |
|---|---|---|---|
| `AC-L2R-021` | `TC-SM15-001`,`TC-SLOT03-001`,`TC-CAP04-001`,`TC-C04-001`,`TC-C17-001`,`TC-E04-001`,`TC-E05-001`,`TC-J02-001`,`TC-BOUND-002`,`TC-E2E-002` | `EV-UNIT-615`,`EV-CON-448`,`EV-SVC-405`,`EV-SVC-454`,`EV-FAULT-467`,`EV-ENTRY-524`,`EV-ENTRY-525`,`EV-JOB-542`,`EV-SVC-439`,`EV-E2E-002` | `unit_state`,`contract_protocol`,`service_semantics`,`entry_worker_job`,`security_source_boundary`,`local_e2e` |
| `AC-L2R-022` | `TC-SLOT01-001`,`TC-SLOT02-001`,`TC-SLOT05-001`,`TC-SLOT06-001`,`TC-ENTRY-001`,`TC-CFG06-001`,`TC-CFG07-001`,`TC-CFG10-001`,`TC-CFG15-001`,`TC-BOUND-001`,`TC-BOUND-003`,`TC-BOUND-004`,`TC-BOUND-005`,`TC-BOUND-006`,`TC-DEP-001`,`TC-ENTRY-004`,`TC-SEC-003` | `EV-CON-446`,`EV-CON-447`,`EV-CON-450`,`EV-CON-451`,`EV-ENTRY-433`,`EV-CFG-676`,`EV-CFG-677`,`EV-CFG-680`,`EV-STATIC-685`,`EV-STATIC-438`,`EV-STATIC-440`,`EV-FAULT-441`,`EV-STATIC-442`,`EV-STATIC-443`,`EV-STATIC-437`,`EV-STATIC-436`,`EV-STATIC-696` | `contract_protocol`,`entry_worker_job`,`config_builder`,`security_source_boundary` |
| `AC-L2R-023` | `TC-SM17-001`,`TC-SLOT01-001`,`TC-SLOT05-001`,`TC-SLOT06-001`,`TC-CAP07-001`,`TC-CAP07-002`,`TC-C09-001`,`TC-E05-001`,`TC-ERR-004`,`TC-CFG06-001`,`TC-CFG07-001`,`TC-CFG10-001`,`TC-CFG14-001`,`TC-CFG15-001`,`TC-BOUND-004`,`TC-BOUND-008`,`TC-ENTRY-004`,`TC-E2E-004` | `EV-UNIT-617`,`EV-CON-446`,`EV-CON-450`,`EV-CON-451`,`EV-SVC-408`,`EV-FAULT-409`,`EV-SVC-459`,`EV-ENTRY-525`,`EV-CON-664`,`EV-CFG-676`,`EV-CFG-677`,`EV-CFG-680`,`EV-FAULT-684`,`EV-STATIC-685`,`EV-FAULT-441`,`EV-STATIC-445`,`EV-STATIC-436`,`EV-E2E-004` | `unit_state`,`contract_protocol`,`service_semantics`,`entry_worker_job`,`fault_replay_consistency`,`config_builder`,`security_source_boundary`,`local_e2e` |
| `AC-L2R-024` | `TC-SM13-001`,`TC-SM14-001`,`TC-SM16-001`,`TC-Q10-001`,`TC-Q11-001`,`TC-O04-001`,`TC-O05-001`,`TC-SLOT11-001`,`TC-SLOT12-001`,`TC-SLOT13-001`,`TC-CAP11-001`,`TC-CAP12-001`,`TC-C15-001`,`TC-C16-001`,`TC-E06-001`,`TC-J01-001`,`TC-J06-001`,`TC-UOW-006`,`TC-BOUND-002`,`TC-BOUND-007`,`TC-OBS-003`,`TC-E2E-005` | `EV-UNIT-613`,`EV-UNIT-614`,`EV-UNIT-616`,`EV-CON-510`,`EV-CON-511`,`EV-CON-534`,`EV-CON-535`,`EV-CON-456`,`EV-CON-457`,`EV-CON-458`,`EV-SVC-414`,`EV-FAULT-415`,`EV-SVC-465`,`EV-SVC-466`,`EV-ENTRY-526`,`EV-JOB-541`,`EV-JOB-546`,`EV-FAULT-646`,`EV-SVC-439`,`EV-FAULT-444`,`EV-FAULT-693`,`EV-E2E-005` | `unit_state`,`contract_protocol`,`service_semantics`,`entry_worker_job`,`fault_replay_consistency`,`security_source_boundary`,`local_e2e` |
| `AC-L2R-025` | `TC-SM10-001`,`TC-SM25-001`,`TC-CAP06-001`,`TC-CAP08-001`,`TC-CAP09-001`,`TC-CAP09-002`,`TC-C06-001`,`TC-C07-001`,`TC-C11-001`,`TC-C17-001`,`TC-E01-001`,`TC-E02-001`,`TC-E03-001`,`TC-E04-001`,`TC-E05-001`,`TC-E06-001`,`TC-J02-001`,`TC-ENTRY-002`,`TC-UOW-005`,`TC-REPLAY-002`,`TC-ERR-002`,`TC-ERR-004`,`TC-ERR-006`,`TC-CFG14-001`,`TC-BOUND-007`,`TC-E2E-003`,`TC-E2E-004` | `EV-UNIT-610`,`EV-UNIT-625`,`EV-SVC-407`,`EV-SVC-410`,`EV-FAULT-411`,`EV-SVC-412`,`EV-FAULT-456`,`EV-SVC-457`,`EV-FAULT-461`,`EV-FAULT-467`,`EV-ENTRY-521`,`EV-ENTRY-522`,`EV-ENTRY-523`,`EV-ENTRY-524`,`EV-ENTRY-525`,`EV-ENTRY-526`,`EV-JOB-542`,`EV-ENTRY-434`,`EV-FAULT-645`,`EV-FAULT-649`,`EV-CON-662`,`EV-CON-664`,`EV-FAULT-666`,`EV-FAULT-684`,`EV-FAULT-444`,`EV-E2E-003`,`EV-E2E-004` | `unit_state`,`service_semantics`,`entry_worker_job`,`fault_replay_consistency`,`config_builder`,`security_source_boundary`,`local_e2e` |

## 6. Exact TC/EV mapping AC026~030

| AC | Exact canonical TC set | Exact planned EV set | Owning suites |
|---|---|---|---|
| `AC-L2R-026` | `TC-O02-001`,`TC-BOUND-001`,`TC-BOUND-006`,`TC-SEC-003` | `EV-CON-532`,`EV-STATIC-438`,`EV-STATIC-443`,`EV-STATIC-696` | `contract_protocol`,`security_source_boundary` |
| `AC-L2R-027` | `TC-Q03-001`,`TC-O02-001`,`TC-SLOT02-001`,`TC-CAP03-001`,`TC-C10-001`,`TC-BOUND-001`,`TC-BOUND-005`,`TC-BOUND-006`,`TC-DEP-001`,`TC-SEC-003` | `EV-CON-503`,`EV-CON-532`,`EV-CON-447`,`EV-SVC-404`,`EV-SVC-460`,`EV-STATIC-438`,`EV-STATIC-442`,`EV-STATIC-443`,`EV-STATIC-437`,`EV-STATIC-696` | `contract_protocol`,`service_semantics`,`security_source_boundary` |
| `AC-L2R-028` | `TC-SM05-001`,`TC-Q05-001`,`TC-SLOT04-001`,`TC-CAP05-001`,`TC-C05-001`,`TC-J03-001`,`TC-E2E-002` | `EV-UNIT-605`,`EV-CON-505`,`EV-CON-449`,`EV-SVC-406`,`EV-SVC-455`,`EV-JOB-543`,`EV-E2E-002` | `unit_state`,`contract_protocol`,`service_semantics`,`entry_worker_job`,`local_e2e` |
| `AC-L2R-029` | `TC-SLOT07-001`,`TC-C04-001`,`TC-C06-001`,`TC-C12-001`,`TC-C16-001`,`TC-CFG09-001`,`TC-BOUND-003`,`TC-BOUND-005`,`TC-OBS-002`,`TC-SEC-001`,`TC-SEC-002`,`TC-E2E-003` | `EV-CON-452`,`EV-SVC-454`,`EV-FAULT-456`,`EV-SVC-462`,`EV-SVC-466`,`EV-STATIC-679`,`EV-STATIC-440`,`EV-STATIC-442`,`EV-STATIC-692`,`EV-STATIC-694`,`EV-STATIC-695`,`EV-E2E-003` | `contract_protocol`,`service_semantics`,`config_builder`,`security_source_boundary`,`local_e2e` |
| `AC-L2R-030` | `TC-SM04-001`,`TC-SM16-001`,`TC-Q04-001`,`TC-Q12-001`,`TC-O06-001`,`TC-SLOT13-001`,`TC-CAP04-001`,`TC-CAP12-001`,`TC-C04-001`,`TC-C08-001`,`TC-C16-001`,`TC-C17-001`,`TC-E04-001`,`TC-J01-001`,`TC-CFG04-001`,`TC-CFG11-001`,`TC-CFG12-001`,`TC-BOUND-002`,`TC-BOUND-007`,`TC-E2E-002` | `EV-UNIT-604`,`EV-UNIT-616`,`EV-CON-504`,`EV-CON-512`,`EV-CON-536`,`EV-CON-458`,`EV-SVC-405`,`EV-FAULT-415`,`EV-SVC-454`,`EV-SVC-458`,`EV-SVC-466`,`EV-FAULT-467`,`EV-ENTRY-524`,`EV-JOB-541`,`EV-CFG-674`,`EV-CFG-681`,`EV-CFG-682`,`EV-SVC-439`,`EV-FAULT-444`,`EV-E2E-002` | `unit_state`,`contract_protocol`,`service_semantics`,`entry_worker_job`,`config_builder`,`security_source_boundary`,`local_e2e` |

## 7. Per-redline stop-review

| AC | Formal owner/data source | Registry rows exact | No-write/body/phase oracle | VETO interaction | Stop-review |
|---|---|---:|---|---|---|
| `AC-L2R-021` | 01 owner boundary；03 SourceSnapshot/Context | 10 | yes；owner/version/freshness/ref retained | applicable VF001/003/005/006 cannot be accepted | closed_design |
| `AC-L2R-022` | 01 dependency direction；03 Port/builder；04 slots | 17 | yes；owner spies and dependency graph | any owner write/sibling package is hard VETO | closed_design |
| `AC-L2R-023` | 03 guard/action/adapter posture；04 CF-B | 18 | yes；zero call on missing guard | default allow/direct route is hard VETO | closed_design |
| `AC-L2R-024` | 03 outcome/handoff/projection phases | 22 | yes；matching CAS only | receipt/Observed reverse-write is hard VETO | closed_design |
| `AC-L2R-025` | 03 inbox/history/replay/feedback | 27 | yes；late/duplicate/unknown quarantine | unknown retry or duplicate effect is VETO where applicable | closed_design |
| `AC-L2R-026` | 01 local truth owner；02 allow-list | 4 | yes；write graph bounded | external truth persistence is hard VETO | closed_design |
| `AC-L2R-027` | 01 typed seams；03 refs/snapshots | 10 | yes；body-free typed refs only | body/identity inference/package edge is VETO | closed_design |
| `AC-L2R-028` | 02/03 working-memory/durable seam；slot04 | 7 | yes；candidate/gap not durable truth | durable body/write or fake promotion is VETO | closed_design |
| `AC-L2R-029` | 02 HLC003；03 safe carriers；04 redaction | 12 | yes；canary scan across all surfaces | any secret/body leak is immediate VETO/quarantine | closed_design |
| `AC-L2R-030` | 03 lifecycle/state axes；04 snapshot semantics | 20 | yes；closed types/owner/version/phase | phase conflation/report repair is VETO where applicable | closed_design |

## 8. Redline coverage and conflict audit

| Audit | Result |
|---|---|
| AC coverage | AC021~030 each has one explicit P0 redline and one exact registry mapping |
| Mapping counts | `10/17/18/22/27/4/10/7/12/20`, matching registry |
| Owner coverage | Tools, Hub, Method, Governance, Sandbox, Observability, Artifact, provider, memory and product/member boundaries all represented |
| Truth phases | committed local truth, candidate, snapshot, projection, summary, receipt, report, delivery, Observed and acceptance are distinct |
| Forbidden material | secret/raw body/capture/hidden reasoning/report body checked across persistence, events, views, logs and handoff |
| Dependency type | compile only Core; runtime/ref/event/adapter/fake remain seams |
| VETO/risk | redline/VF failures cannot be risk accepted; missing evidence remains not_evaluable |
| P1/P2 pollution | external positive qualification is separate; local redline denominator is not reduced |
| Actual status | all 10 are design-closed only; no actual EV, redline result or VETO disposition |

## 9. 回填草稿与 Step stop-review

Formal §6 应写 ownership/carrier matrix、AC021~030 redline gates、exact TC/EV evidence mapping、VETO interaction 和 no-static-evidence rule。正文不得把 owner spy、source graph、canary 或 design audit 的 planned checks 当作 actual pass。

```text
step_status = completed_continuous_authorized
redline_subjects = 10
mapping_rows_by_ac = 10/17/18/22/27/4/10/7/12/20
actual_redline_disposition = none
current_process_state = not_entered
next_step = Step 7
formal_06_write_allowed = false_until_step_15
```
