# L2-runtime 05 测试方案 Step 11：缺陷管理与复验规则

> 对应 SOP：`standards/document/测试方案讨论流程_SOP.md` Step 11
> 回填位置：正式 `05-测试方案.md` §11
> 输入：Step 6 canonical cases、Step 9 gates/status、Step 10 NFR/VF redlines
> 状态：`completed_continuous_authorized`
> 当前事实：没有真实 defect、issue、fix、commit、run、retest、closure、risk acceptance 或 signoff

## 1. Defect、execution incident、blocker 与 residual 的分界

| Record kind | Definition | Examples | Can count as pass? | Route |
|---|---|---|---|---|
| `product_defect_candidate` | canonical oracle/check 与目标实现行为不一致，已排除 fixture/runner 误用 | illegal state accepted、half write、query write、secret leak | no | triage severity |
| `test_tooling_defect_candidate` | selector、fixture、fake、runner、check、report generator 自身违约 | zero selector、wrong seed、report drops failure | no | fix tooling + rerun new run |
| `execution_incident` | toolchain/runner/namespace/cleanup/environment failure，产品归因尚不成立 | compiler unavailable、cleanup failed | no | retain `infra_error`; investigate |
| `dependency_blocker` | real positive prerequisite/owner contract/adapter/environment absent | 13 slot qualification not runnable | no | blocker ledger; no retry-to-green |
| `residual_risk_candidate` | future/P1/P2/unmeasured or explicitly out-of-scope exposure | numeric capacity unknown、real owner quality unqualified | no | Step 14 + future 06 owner decision |

Expected fail-closed negative case can pass when its declared oracle observes `Blocked/Unknown/Unavailable` and zero bypass. This does not close the corresponding positive `dependency_blocker`.

## 2. Planned defect record schema

Future records must bind failure truth before discussion or closure:

| Field | Required rule |
|---|---|
| `defect_ref` | assigned by future issue authority；this design creates none |
| `record_kind` | one of §1；may change only with triage history |
| `severity` | `S/A/B/C` after triage；null before triage |
| `status` | exact lifecycle from §3；no free-text pass/closed shortcut |
| `first_run_id` | fixed failed/infra run, never `latest`; absent only for static design review finding |
| `source_suite/source_case_or_check` | canonical owning suite + TC/variant or check ID |
| `first_artifact_ref/report_ref` | raw failure/incident and readable report; immutable refs |
| `design_refs` | exact FR/BR/NFR/VF/CUT/03/04 anchors |
| `fixture_manifest_digest` | exact data/seed/fault schedule; null only for pure source check |
| `config_snapshot_ref_digest` | exact pair used by operation/page |
| `observed/expected` | typed status/state/write/call/phase difference; body-free |
| `owner_boundary` | Runtime local / test tooling / named external owner / pending |
| `impact_scope` | cases/suites/gates/config profiles/dependency slots potentially affected |
| `reproduction_disposition` | deterministic/flaky/not_reproduced/blocked/infra with retained attempts |
| `fix_ref` | future change reference; never invented here |
| `retest_plan_ref` | targeted + impacted + gate scope and required checks |
| `retest_run_ids` | new immutable runs only; first failure never overwritten |
| `closure_evidence_refs` | valid raw/report/check refs from new run(s) |
| `residual_risk_ref` | required when B/C/future exposure remains; no implicit acceptance |
| `triage_history` | append-only actor role/time/from/to/reason refs; no erased classification |

No raw secret/body is copied into defect records. Diagnostics use canary class、safe field path、digest、error category and artifact refs.

## 3. Defect lifecycle and state rules

```text
[Observed]
    |
    v
[TriagePending] --> [ClassifiedIncident] --> [ResolvedIncident]
    |                       |
    |                       +--> product impact found -> [Triaged]
    v
[Triaged] --> [FixPlanned] --> [FixCandidate] --> [RetestPending]
                                                    |
                                      +-------------+-------------+
                                      v                           v
                               [RetestFailed]                 [RetestPassed]
                                      |                           |
                                      +--> [Reopened]             +--> [ClosureReview]
                                                                      |
                                                                      v
                                                                   [Closed]

[DependencyBlocked] -- owner/blocker fact changes --> [TriagePending]
```

Rules:

1. `Observed` is not a severity or product verdict.
2. `infra_error` enters `ClassifiedIncident`; it cannot become `RetestPassed` without a new valid run.
3. `DependencyBlocked` remains open until formal owner prerequisite changes; time, retry, fake or ping does not transition it.
4. `FixCandidate` is not fixed/closed. Only a new valid targeted + impacted retest can reach `RetestPassed`.
5. Any recurrence after closure creates `Reopened` and links the prior closure; it never deletes history.
6. `Closed` requires §8 evidence. Chat approval、commit existence、green exit code without denominator or static mapping is insufficient.

## 4. Severity matrix

| Level | Exact definition | L2-runtime examples | Immediate handling | Exit/risk rule |
|---|---|---|---|---|
| `S` | any `VF-L2R-001~008`, safety/truth/phase/evidence/dependency redline, or failure that can fabricate irreversible/accepted truth | owner reverse-write；default allow/host bypass；secret/body leak；unknown retry；ACK/Observed -> outcome；fake/static evidence -> ready/pass；non-Core compile dep；orphan source accepted | stop affected/full release-design lane；preserve artifacts；security/architecture/test review | always blocks；cannot risk-accept or downgrade by schedule |
| `A` | P0 canonical semantic/protocol/state/UoW/idempotency/config/entry failure not already S | legal edge wrong；command result/write set mismatch；query writes；ACK before commit；cursor advances on unknown；31-state or 177-case denominator gap | block owning suite and all gates containing it；fix/retest required | blocks current P0 exit；only formal scope rebaseline can move it out, not ad hoc waiver |
| `B` | P1/P2/future or bounded diagnostic/tooling issue with no P0 truth/security impact | missing characterization attachment；nonblocking report readability；future candidate adapter mismatch | record, plan, keep residual and affected lane non-qualified | may be deferred only with named future acceptance authority and residual record |
| `C` | documentation/usability issue proven to have zero semantic, evidence and execution impact | typo、non-normative wording、broken explanatory link | correct in documentation cycle | no test exit impact after link/source check |

Severity follows impact, not runner exit code. A test tooling bug that could erase failures, shrink denominators, leak material or synthesize pass/evidence is `S`; other tooling faults are `A/B` by affected P0 scope.

## 5. Mandatory S classification matrix

| Trigger | Source | Minimum detection |
|---|---|---|
| Runtime owns/writes external truth | VF001 | BOUND001/006、SEC003、dependency/source scan |
| missing/unknown action guard permits call or host/direct Sandbox fallback | VF002 | C09/CAP07/SLOT01/05/06、BOUND004/008 call journal |
| forbidden body/secret/capture/hidden reasoning/provider route/cost leaks | VF003 | CFG09/OBS02/SEC01/02 + redaction scan |
| commit/effect unknown causes ordinary retry or new identity | VF004 | CAP07/CAP10/UOW/REPLAY fault journal |
| receipt/delivery/Observed/acceptance rewrites outcome/checkpoint/run | VF005 | BOUND007/TRUTH001 immutable version proof |
| fake/planned/blocked/not-run/pending becomes positive EV/pass/readiness | VF006 | TRUTH001/BOUND008/status truth/no-static-evidence checks |
| non-Core runtime/event/ref/adapter/fake seam becomes package dependency | VF007 | DEP001/dependency graph check |
| requirement/design/field/state/error/TC/EV cannot resolve current source or historical alias accepted | VF008 | SOURCE001/source/denominator checks |
| selector empty/filtered/skipped yet gate passes | Step 9 execution truth | selector + manifest + gate summary audit |
| first failure deleted/retry results merged/cherry-picked | Step 9 retry truth | run lineage and immutable artifact audit |

## 6. Triage decision matrix

| Observed disposition | First questions | Classification ceiling | Required next action |
|---|---|---|---|
| `failed` | canonical manifest? fixture/config/fault exact? implementation behavior differs? | product or tooling defect candidate | reproduce exact first manifest; preserve failed run |
| `invalid_execution` | empty selector/filter/skip/schema/root mismatch? | tooling `S/A` by concealment impact | fix gate/manifest; rerun full affected denominator |
| `infra_error` | toolchain/runner/namespace/cleanup/environment? product residue/leak? | incident; can become S/A if product caused | retain incident; no product pass; new run after correction |
| flaky/timeout | same seed/fault schedule reproducible? shared mutable resource? wall clock? | at least A for P0 until proven infra | bounded diagnostic attempts, all retained; remove nondeterminism |
| `blocked_dependency` | required owner contract/adapter/profile/environment absent? | blocker, not defect unless fallback/promotion occurs | update blocker evidence only when owner fact changes |
| expected negative `Blocked/Unknown` | call/write/history assertions all match? | case may pass locally | keep positive lane blocked |
| check/report failure | can it hide/leak/synthesize evidence? | S if yes, otherwise A/B | fix tooling and rerun source suites + checks/reports |
| cleanup failure | residue contains sensitive/cross-run truth? | infra or S | quarantine artifact namespace; residue/redaction audit |

## 7. Targeted and impacted retest matrix

Every retest begins with the exact original manifest and creates a new `<run_id>`. “Original case” below includes all failing variant IDs and fault schedules.

| Change/failure surface | Targeted retest | Impacted regression | Mandatory checks / release escalation |
|---|---|---|---|
| primitive/envelope/digest/shared DTO | original + `TC-CAP01-001` + affected C/Q/E/O/J | `unit_state` + `contract_protocol` + affected service/entry | source、denominator、forbidden material |
| state/invariant/error mapping | original SM/ERR + owning CAP/C/E/J | `unit_state` + owning suite + `fault_replay_consistency` where Unknown/replay | full 31-state denominator |
| Command/service/write set | original C/CAP + companion SM/UOW | `service_semantics` + affected contract/fault/entry | pairing/redaction; S/A may trigger full main |
| Query visibility/no-write | original Q + hidden/stale/cursor variants | full 12 Q in `contract_protocol` + related state | no write/call journal + redaction |
| inbound Event/ACK | original E + receipt duplicate/collision/unknown | `entry_worker_job` + UOW/replay companions | ACK-after-commit + pairing |
| outbound Event/publisher | original O/J07/SLOT12 | `contract_protocol` + `entry_worker_job` + fault companions | exact snapshot digest + status truth |
| Job lease/page/cursor | original J + lease/fault variants | all 7 J + relevant SM18/UOW/REPLAY | denominator + cleanup/residue |
| external slot/owner boundary | original SLOT + owning CAP/C/BOUND | `contract_protocol` + service/fault/security affected suites | dependency/fake leak/status/redaction |
| checkpoint/recovery/effect fence | CAP10/C12~14/J04/05/SM11/12/28 | service + fault + entry job + E2E005 aggregate | no-blind-retry/status truth |
| config parser/builder/profile | original CFG + related slot/job/entry | all 15 CFG + affected suite; exact 12/153/39/13x5/7x6 | denominator/fake leak/forbidden material |
| security/redaction/source/dependency | original security/source case | full `security_source_boundary` + affected suite samples | every mandatory check; S requires full local gate |
| selector/gate/report/evidence tooling | failing check/generator with synthetic failed/blocked/infra corpus | all checks + representative case from every 7 raw suites + aggregate | nightly/full run required before closure |
| local E2E aggregate | aggregate + every missing/non-pass child | child owning suites; then rebuild all 5 aggregates | same-run/no-cherry-pick audit |

An S fix requires a complete new main/release-design local run of all 177 identities and all mandatory checks after targeted reproduction passes. It does not require impossible positive qualification to pass, but all relevant positive blockers must remain explicitly disclosed.

## 8. Closure evidence by severity

| Required record | S | A | B | C |
|---|:---:|:---:|:---:|:---:|
| immutable first failure/incident artifact + report | yes | yes | when execution exists | design review ref allowed |
| exact original manifest/seed/config/fault script | yes | yes | when applicable | no |
| fix ref and impact analysis | yes | yes | yes | document diff ref |
| targeted retest new run | yes | yes | when implemented | link/source check |
| impacted suite regression new run | full 177 + checks | matrix-required suites | affected lane | no semantic suite |
| raw/report/redaction/pairing validity | yes | yes | when execution exists | source link |
| no new blocker/status promotion | yes | yes | yes | yes |
| automation prevention added/expanded | required if prior suite/check missed | required if coverage gap | as justified | no |
| independent closure review role | security + architecture + test | implementation owner + test | test/risk owner | document owner |
| risk acceptance | prohibited | prohibited within current P0 | future named authority required if deferred | not required after correction |

This table defines future evidence requirements; it does not claim reviewers, approvals or records exist.

## 9. Automation prevention triggers

| Discovery path | Required prevention change |
|---|---|
| manual/design review finds executable P0 bug absent from 177 cases | add/expand canonical raw variant under one owning suite; update denominator/source mapping |
| local E2E finds failure not caught by child raw oracle | move precise assertion/data/fault into child owning case; aggregate remains reference-only |
| release check finds leak/dependency/status issue missed by suite | add negative case/canary and expand check scan scope |
| flake caused by time/random/shared state | fixed clock/seed/typed queue/namespace/fault schedule; retain reproducer |
| unknown/replay duplicate effect | add exact phase failpoint and call/write journal assertion |
| report/evidence hides failed/blocked/infra status | expand status corpus, pairing/no-static checks, and representative failed suite report test |
| owner contract closes or changes | add future integration/qualification case only after formal rebaseline; never mutate local fake case into positive proof |

Adding a case requires updating Step 5/6/7/9/13/14 and later 06/07 denominators. A one-off unregistered regression test cannot be used as formal closure evidence.

## 10. Step 11 stop-review

| Audit | Result |
|---|---|
| record kinds separated | product/tooling/incident/blocker/residual explicit |
| lifecycle | observation, triage, fix, new-run retest, closure/reopen executable |
| severity | S/A/B/C impact-based; all 8 VF forced S |
| P0 waiver | S and A cannot be ad hoc risk-accepted |
| retest | every surface has targeted + impacted suite/check scope |
| first failure truth | immutable; no overwrite/cherry-pick/retry merge |
| closure | raw/report/check/review requirements explicit; no actual evidence invented |
| prevention | uncovered P0/manual/E2E/check/flake paths require registered automation update |

```text
step_status = completed_continuous_authorized
actual_defect_count = unknown_not_measured
actual_retest_or_closure = false
vf_severity = S_8_of_8
next_step = Step 12
formal_05_write_allowed = false_until_step_15
```
