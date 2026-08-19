# Step 7. 测试、验收与证据门禁

> 对应 SOP：`standards/document/实施计划讨论流程_SOP.md` Step 7
> 回填目标：正式 `07-实施计划.md` §7
> 本步状态：`completed / pass-designed`
> Canonical source：正式 `05-测试方案.md`、`06-验收标准.md` 及其 calibration artifacts

## 1. 本步目标与事实边界

本步把 39 个 implementation Gate 绑定到当前测试方案和验收标准。测试 registry 是未来 runner 的输入，不是测试结果；planned path、fake、设计表、退出码或空目录都不能成为 evidence、verdict、signoff 或 readiness。

当前唯一 canonical denominator：

```text
37 CUT
172 owning raw TC + 5 same-run aggregate TC = 177 TC/EV
8 owning suites: 35 / 32 / 32 / 16 / 25 / 15 / 17 / 5
9 mandatory checks
36 AC / 8 VF / 19 NFR / 18 EG
31 states / 7 UoW crash windows / 6 replay-concurrency families
13 external slots / 15 config slices
```

`TC-QUAL-SLOT01~13` 属于独立 positive qualification lane，不进入 G1 的 177。G2/G3 缺 owner contract、real adapter、profile、environment 或 independent oracle 时保持 `blocked_dependency/not_evaluated`。

## 2. Test / acceptance lane model

```text
formal source + immutable baseline (future)
        |
        v
exact case/selector manifest
        |
        v
same fixed run: raw case + suite report + 9 checks
        |
        v
mechanical evidence index / EV detail
        |
        v
review-required acceptance drafts
        |
        v
authorized 06 reviewer decision (outside implementation agent)
```

| Lane | Scope | Fixed-run rule | Maximum status |
|---|---|---|---|
| G1 local contract | 172 raw + 5 aggregate, 8 suites, 9 checks | one new `run_id`; no hidden filter/skip; local TestFake only where 05 permits | future `local_contract_complete_candidate`; current `not_entered` |
| G2 integration candidate | named owner/adapter seam | independent run/root; never merge with G1 | `candidate/blocked_dependency` |
| G3 positive qualification | `TC-QUAL-SLOT01~13` and dedicated EV namespace | real adapter, non-TestFake profile, owner environment and independent oracle | `qualified/blocked_dependency`; current blocked |
| acceptance/release | formal 06 authority | exact baseline tuple and matching evidence | no implementation-agent verdict; current `not_entered` |

## 3. Eight owning suites

| Suite | Planned selector family | Raw denominator | Profile | Primary CUT / oracle | Current |
|---|---|---:|---|---|---|
| `unit_state` | CAP-01; LOOP-002~003; OBS-001; SM-01~31 | 35 | `ci_contract/TestFake` | vocabulary, planner/yield, every state subject | `planned_not_created` |
| `contract_protocol` | Q01~12; O01~06; SLOT01~13; LPORT-001 | 32 | `ci_contract/TestFake` | protocol schema, query zero-write, immutable outbound, slot posture | `planned_not_created` |
| `service_semantics` | C01~17; CAP-02~12 variants; LOOP-001 | 32 | `ci_contract/TestFake` | operation service, UoW/write set, one-loop-step | `planned_not_created` |
| `entry_worker_job` | E01~06; J01~07; ENTRY-001~003 | 16 | `ci_contract/TestFake` | inbox/ACK, lease/page/cursor, facade dispatch | `planned_not_created` |
| `fault_replay_consistency` | LOOP-004~006; LPORT-002~003; UOW-001~007; REPLAY-001~006; ERR-001~007 | 25 | `ci_contract/fault` | crash windows, CAS/replay, Unknown, typed errors | `planned_not_created` |
| `config_builder` | CFG-01~15 | 15 | TestFake + cold simulation | strict roots/leaves/derived, slot/job matrix, V0~V12 | `planned_not_created` |
| `security_source_boundary` | BOUND-001~008; DEP-001; ENTRY-004; OBS-002~003; SEC-001~003; SOURCE/TRUTH-001 | 17 | static + TestFake | owner boundaries, dependency, redaction, status/source truth | `planned_not_created` |
| `local_e2e` | E2E-001~005 derived only | 5 aggregate | `ci_contract/TestFake` | same-run child aggregation; no new business flow | `planned_not_created` |

Raw sum is `35+32+32+16+25+15+17=172`; aggregate sum is `5`. One raw case has one owning suite. An aggregate may only reference complete child raw results from the same immutable run.

## 4. Nine mandatory checks

| Check identity | Planned script | Required assertion | Applies |
|---|---|---|---|
| `SRC` | `scripts/checks/check_source_manifest.sh` | current FR/BR/NFR/VF/CUT/TC/EV/source resolve; historical aliases rejected | all lanes |
| `DEN` | `scripts/checks/check_test_denominators.sh` | exact 172+5, 12 CAP, 17/12/6/6/7, 31 SM, 13 slots, 15 config; one raw owner | all G1 |
| `DEP` | `scripts/checks/check_dependency_boundaries.sh` | only Core compile candidate; runtime/event/ref/adapter/fake remain typed seams | all |
| `FORBID` | `scripts/checks/check_forbidden_material.sh` | no body, secret, route, quota, cost, hidden reasoning or owner truth | all |
| `FAKE` | `scripts/checks/check_fake_profile_leak.sh` | TestFake only in permitted test profile; production graph has no fake binding | G1/G2/G3 |
| `TRUTH` | `scripts/checks/check_status_truth.sh` | planned/blocked/not-run/fake/ACK/receipt not promoted | all |
| `REDACT` | `scripts/checks/check_redaction.sh` | raw/log/report/draft redaction before evidence eligibility | all evidence lanes |
| `PAIR` | `scripts/checks/check_artifact_report_pairing.sh` | each EV candidate has same-run raw, owning suite report and matching digests | PH-13/evidence lanes |
| `NOSTATIC` | `scripts/checks/check_no_static_evidence.sh` | evidence index derives from raw/report/checks, never a table or handwritten status | PH-13/evidence lanes |

All check scripts are `planned_not_created`; a command name is not a run result. A future caller must provide nonempty `--run-id`, `--artifact-root`, `--config-profile` and exact case manifest; `latest`, implicit selectors and project-nested roots are invalid.

## 5. 39-Gate matrix

The matrix is the canonical binding from Step 6 boundary to tests, acceptance dimensions and failure action. `raw` and `report` are future outputs; during design they remain `not_generated`.

| Gate | Boundary / Phase | Planned test selector and CUT | Suites | Checks | AC / VF / NFR / EG focus | Failure / stop action |
|---|---|---|---|---|---|---|
| `GATE-01` | `commit-01-a` / PH-01 | workspace, crate/package, dependency graph; CUT-37 | security_source_boundary, contract_protocol | SRC, DEP, FORBID | AC-022/030/036; VF-007/008; NFR-019; EG-010/018 | target repo/Core/name mismatch => `blocked/wait_design`; no source edit |
| `GATE-02` | `commit-01-b` / PH-01 | `TC-CAP01-001`, `TC-LPORT-001`; CUT-01/29 | unit_state, contract_protocol | SRC, DEN, FORBID | AC-021/022; VF-003/008; NFR-011/019; EG-001/010 | field/ref/body mismatch => return 03; no private type |
| `GATE-03` | `commit-01-c` / PH-01 | reason/error/digest/context negatives; CUT-01/33/36 | unit_state, security_source_boundary | SRC, FORBID, REDACT | AC-029/034/036; VF-003/008; NFR-010/019; EG-009/018 | raw/unsafe error or Rustdoc conflict => `L2R-LANG-002` |
| `GATE-04` | `commit-02-a` / PH-02 | LPORT-001~003, Port conformance, zero hidden write; CUT-29 | contract_protocol, fault_replay_consistency | DEP, FORBID, TRUTH | AC-022/026/035; VF-001/007; NFR-011/013; EG-002/010 | missing callable/read-write source => `wait_design` |
| `GATE-05` | `commit-02-b` / PH-02 | UOW-001/003~006, REPLAY-001~003, known commit/rollback | fault_replay_consistency, service_semantics | DEN, TRUTH, NOSTATIC | AC-025/026/035; VF-004; NFR-012/014; EG-003/006 | partial/LWW/second effect => preserve journal, block successor |
| `GATE-06` | `commit-02-c` / PH-02 | UOW-002/007/008, lease/page/cursor, Unknown; CUT-25/31/32 | fault_replay_consistency, entry_worker_job, unit_state | TRUTH, DEP, NOSTATIC | AC-017/018/030/035; VF-004/005; NFR-013/015; EG-005/006 | Unknown promotion/cursor skip/work after lease => hard stop |
| `GATE-07` | `commit-03-a` / PH-03 | SM-25/26/27, loop cursor/snapshot/activation/step; CUT-02/28 | unit_state, service_semantics | SRC, DEN, TRUTH | AC-001/006/008/035; VF-004/008; NFR-004/011; EG-001/003 | second active step or noncanonical state => return 03 |
| `GATE-08` | `commit-03-b` / PH-03 | SM-28/29/30, wakeup/continuation/yield/reservation, replay; CUT-02/16/32 | unit_state, fault_replay_consistency | DEN, TRUTH, NOSTATIC | AC-005/017/018/035; VF-004/006; NFR-004/013; EG-003/006 | lost wakeup, spin, digest conflict or expiry uniqueness breach => block |
| `GATE-09` | `commit-03-c` / PH-03 | loop planner, T1/T2/T3, one service/step, NoProgressGuard; CUT-02/21/28 | service_semantics, fault_replay_consistency, local_e2e | SRC, DEN, TRUTH | AC-001/005/020/035; VF-004/005; NFR-004/005/013; EG-001/003/006 | recursive dispatch/multi-service step/current reconstruction => hard stop |
| `GATE-10` | `commit-04-a` / PH-04 | C01/C02 carriers, SM-01~03/19~21 factories; CUT-03~05/26/28 | unit_state, contract_protocol | SRC, DEN, FORBID | AC-001/006/007/008; VF-001/008; NFR-011/019; EG-001/010 | accepted/active/state-axis ambiguity => return 03 |
| `GATE-11` | `commit-04-b` / PH-04 | C01/C02 service UoW, negative admission, control fence/replay; CUT-03/04/21/31 | service_semantics, fault_replay_consistency | TRUTH, DEN, NOSTATIC | AC-001/006/008/035; VF-004/005; NFR-011/012; EG-003/006 | rejected admission creates run or control bypasses fence => block |
| `GATE-12` | `commit-04-c` / PH-04 | C03/Q01~03, progress/history/visibility/no-write; CUT-04/05/22 | service_semantics, contract_protocol | TRUTH, FORBID, PAIR | AC-006/007/008/020; VF-005/008; NFR-011/019; EG-002/010 | query writes or projection repair => block; no report pass |
| `GATE-13` | `commit-05-a` / PH-05 | C04/C17/Q04, source/context SM-04/15; CUT-06/20/34 | contract_protocol, service_semantics, security_source_boundary | SRC, DEN, FORBID | AC-002/009/028/031; VF-001/003/008; NFR-006/011; EG-001/009 | stale/current substitution or body copy => return 03/04 |
| `GATE-14` | `commit-05-b` / PH-05 | C05/Q05, working memory use/exclusion/compaction; CUT-07/20/35 | service_semantics, unit_state, fault_replay_consistency | DEN, TRUTH, REDACT | AC-002/009/010/029; VF-001/003/006; NFR-006/013; EG-003/009 | durable owner leak or duplicate use => `L2R-UP-005` block |
| `GATE-15` | `commit-05-c` / PH-05 | E04/J02/J03, ACK/lease/page/cursor/working-only; CUT-20/23/25 | entry_worker_job, fault_replay_consistency | TRUTH, DEP, NOSTATIC | AC-009/010/025/035; VF-004/005; NFR-013/015; EG-005/006 | early ACK/lease loss/cursor advance Unknown => stop |
| `GATE-16` | `commit-06-a` / PH-06 | C06/C07/Q06/E01, SM-06/17/22/23; CUT-08/09/26/28 | unit_state, contract_protocol, service_semantics | SRC, FORBID, REDACT | AC-003/011/012/029; VF-003/007; NFR-006/010; EG-001/009 | provider/body/route field or missing factory => return 03 |
| `GATE-17` | `commit-06-b` / PH-06 | model submission two-UoW, stable identity, blocked adapter; CUT-08/09/31/33 | service_semantics, fault_replay_consistency, security_source_boundary | TRUTH, FORBID, DEP | AC-003/011/012/035; VF-003/004/006; NFR-006/013; EG-003/006 | call-before-record/Unknown retry/provider leak => hard stop |
| `GATE-18` | `commit-06-c` / PH-06 | E01/Q06 classification, late/duplicate/mismatch, safe summary; CUT-09/23/36 | entry_worker_job, contract_protocol, security_source_boundary | TRUTH, REDACT, PAIR | AC-003/012/024/029; VF-003/005/008; NFR-010/018; EG-009/013 | late rewrite/raw response/Observed promotion => block |
| `GATE-19` | `commit-07-a` / PH-07 | C08/C09/Q07/O03, SM-07/08; CUT-10/11/24/26 | contract_protocol, unit_state, service_semantics | SRC, DEN, FORBID | AC-004/014/015/023; VF-001/002/008; NFR-006/008; EG-001/010 | action phase collapse or owner truth mutation => VETO direction |
| `GATE-20` | `commit-07-b` / PH-07 | five-owner guard missing/stale/denied/unknown; CUT-10/30/37 | service_semantics, security_source_boundary | DEP, TRUTH, FORBID | AC-004/014/015/023; VF-001/002/005; NFR-006/008; EG-005/010 | any non-allow guard calls external action => hard stop |
| `GATE-21` | `commit-07-c` / PH-07 | record-before-call, one invocation, SM-31, Unknown reconcile; CUT-11/24/31/32 | service_semantics, fault_replay_consistency, security_source_boundary | TRUTH, PAIR, NOSTATIC | AC-014/015/025/035; VF-002/004/006; NFR-008/013; EG-003/006 | direct execution/duplicate effect/new identity => S/VF stop |
| `GATE-22` | `commit-08-a` / PH-08 | C10/Q08/E03, child subset/budget/depth, SM-09; CUT-12/28/37 | contract_protocol, unit_state, security_source_boundary | SRC, DEP, FORBID | AC-004/016/033; VF-001/008; NFR-007/016; EG-001/010 | scope expansion/member lifecycle => return 03 |
| `GATE-23` | `commit-08-b` / PH-08 | child request/result receipt, once-only incorporate, late/duplicate; CUT-12/13/23 | service_semantics, entry_worker_job, fault_replay_consistency | TRUTH, DEN, NOSTATIC | AC-004/016/024/035; VF-004/005; NFR-007/013; EG-003/006 | ACK before receipt/double incorporation => block |
| `GATE-24` | `commit-08-c` / PH-08 | C11/E02 feedback ordering, reflection SM-10/21/24; CUT-13/14/28 | service_semantics, entry_worker_job, unit_state | SRC, TRUTH, FORBID | AC-004/019/024/027; VF-001/005/008; NFR-007/011; EG-001/005 | late reverse write/history overwrite => stop and rebaseline |
| `GATE-25` | `commit-09-a` / PH-09 | C12/Q09 checkpoint candidate/Prepared/fence; CUT-15/27/31 | unit_state, service_semantics, fault_replay_consistency | SRC, TRUTH, NOSTATIC | AC-005/017/018/035; VF-004/005; NFR-004/013; EG-003/006 | Prepared presented as Committed => CP-001 blocker |
| `GATE-26` | `commit-09-b` / PH-09 | C13/C14 matching receipt, CommitUnknown, recovery decision; CUT-15/16/31/32 | service_semantics, fault_replay_consistency, unit_state | TRUTH, DEP, PAIR | AC-005/017/018/035; VF-004/005/006; NFR-004/013; EG-003/006 | mismatch promotion/blind resume/new effect => hard stop |
| `GATE-27` | `commit-09-c` / PH-09 | J04/J05/Q09 continuation, lease/page/cursor, status-only reconcile; CUT-16/25/32 | entry_worker_job, fault_replay_consistency, contract_protocol | TRUTH, DEN, NOSTATIC | AC-018/030/035; VF-004/005; NFR-013/015; EG-005/006 | lease loss work/cursor skip/repair truth => block |
| `GATE-28` | `commit-10-a` / PH-10 | C15/Q10/O04 terminal proof and one local outcome; CUT-17/26/31 | service_semantics, unit_state, contract_protocol | SRC, TRUTH, FORBID | AC-005/020/024; VF-001/005/008; NFR-011/018; EG-001/005 | multiple outcome/downstream overwrite => block |
| `GATE-29` | `commit-10-b` / PH-10 | C16/Q11/O05 body-free handoff material/attempt/gap; CUT-18/24/36 | service_semantics, contract_protocol, security_source_boundary | FORBID, REDACT, PAIR | AC-020/024/025/027; VF-003/005/006; NFR-010/018; EG-009/013 | body/delivery/Observed promotion => UP-002 block |
| `GATE-30` | `commit-10-c` / PH-10 | E06/J06 ACK/gap reconciliation, no self-close; CUT-18/23/25/32 | entry_worker_job, fault_replay_consistency, service_semantics | TRUTH, DEN, NOSTATIC | AC-020/024/025/035; VF-004/005/006; NFR-013/018; EG-005/006 | mismatch self-close/ACK changes outcome => stop |
| `GATE-31` | `commit-11-a` / PH-11 | Q12/J01/O06 projection rebuild/cursor/no-write; CUT-19/22/25 | contract_protocol, entry_worker_job, fault_replay_consistency | TRUTH, DEP, NOSTATIC | AC-020/024/030; VF-005/007; NFR-011/015; EG-005/010 | projection becomes truth/cursor skip => block |
| `GATE-32` | `commit-11-b` / PH-11 | E05/O01/O02 immutable fact/decision event and invalidation; CUT-23/24/36 | entry_worker_job, security_source_boundary, contract_protocol | FORBID, TRUTH, REDACT | AC-021/024/025/027; VF-001/003/005; NFR-010/018; EG-009/013 | mutable payload/owner mutation/early ACK => VETO direction |
| `GATE-33` | `commit-11-c` / PH-11 | J07 outbox publisher, attempt/cursor/Unknown, OBS seam; CUT-24/25/36 | entry_worker_job, fault_replay_consistency, security_source_boundary | TRUTH, PAIR, NOSTATIC | AC-020/024/030/034/036; VF-005/006; NFR-013/018; EG-013/018 | payload regeneration/delivery/Observed claim => block |
| `GATE-34` | `commit-12-a` / PH-12 | 12 config roots, 153 leaves, 39 derived semantics, V0~V12; CUT-34/35 | config_builder, security_source_boundary | SRC, DEN, FORBID, REDACT | AC-021/023/029/031/032/033/036; VF-003/006/008; NFR-006/010/019; EG-001/009/018 | partial publish/secret/default/denominator drift => return 04 |
| `GATE-35` | `commit-12-b` / PH-12 | 13 slots, 7 jobs, builder, TestFake isolation, only-Core; CUT-30/35/37 | config_builder, security_source_boundary, contract_protocol | DEP, FAKE, TRUTH, DEN | AC-022/023/030/033/036; VF-001/006/007/008; NFR-011/019; EG-010/018 | Candidate/Bound->Ready, fake leak, new sibling dependency => hard block |
| `GATE-36` | `commit-12-c` / PH-12 | facade-only C/Q/E/J registries, exact 17/12/6/6/7 entry mapping; CUT-21~25/37 | entry_worker_job, contract_protocol, security_source_boundary | DEN, DEP, TRUTH | AC-020/022/023/030/036; VF-001/006/007/008; NFR-011/019; EG-010/018 | direct store write/missing handler/lifecycle creep => ENTRY-001 block |
| `GATE-37` | `commit-13-a` / PH-13 | exact 37 CUT, 172 raw + 5 aggregate, 8 suites, raw writer/path | all 8 suites (runner dry-run) | SRC, DEN, FORBID, FAKE | AC-036; VF-006/008; NFR-019; EG-001/002/003/005/011/018 | empty/filter/duplicate/path/redaction failure => no raw eligibility |
| `GATE-38` | `commit-13-b` / PH-13 | nine checks, same-run suite reports, evidence index/digest pairing | all owning suites + checks | all 9 (`SRC,DEN,DEP,FORBID,FAKE,TRUTH,REDACT,PAIR,NOSTATIC`) | AC-022/029/030/036; VF-003/006/007/008; NFR-010/019; EG-004/007/009/010/012/017/018 | static/cross-run/orphan/invalid => evidence ineligible; retain raw |
| `GATE-39` | `commit-13-c` / PH-13 | full local aggregation, 5 same-run E2E, four acceptance drafts | 8 suites + `local_e2e`; G2/G3 separate | all 9 checks | AC-001~036; VF-001~008; NFR-001~019; EG-001~018 | any local P0 missing/non-green => no handoff; drafts only, no verdict/signoff |

## 6. Artifact, report and evidence rules

### 6.1 Fixed paths and maturity

```text
M0 planned identity
  -> M1 raw: artifacts/test/<run_id>/
  -> M2 report: reports/runs/<run_id>/
  -> M3 derived EV/index (same run)
  -> M4 reports/acceptance/* draft/review_required
```

| Material | Writer | Fixed path | Current | Human edit |
|---|---|---|---|---|
| run context/manifest/selector/blockers | runner/orchestrator | `artifacts/test/<run_id>/meta/*.json` | not_generated | prohibited |
| raw check/case/suite | named runner/check | `artifacts/test/<run_id>/checks|suites/...` | not_generated | prohibited |
| report/gate summary | report generator | `reports/runs/<run_id>/...` | not_generated | separate review note only |
| evidence detail/index | evidence generator | same-run report/evidence roots | not_generated | prohibited before review |
| acceptance drafts | handoff generator | `reports/acceptance/{handoff,veto-checklist,risk-acceptance,open-issues}.md` | not_generated | review additions cannot alter raw/status |

Evidence identity is `(run_id, evidence_id, case_id, owning_suite, case_artifact_digest, suite_report_digest)`. No `latest`, cross-run merge, static table, handwritten EV or second candidate namespace is allowed. Failed, blocked, infra, invalid and cancelled outputs are retained and remain ineligible; a retry creates a new run.

### 6.2 PH-01~PH-12 evidence ceiling

Before `commit-13-a`, gate scripts and report generators are not created. A boundary may record a real repository-local command and status in its future ledger, or exact `not_applicable: PH-13 tooling not implemented`; it may not write a fake path, report, EV or pass. `commit-13-a` creates raw only; `commit-13-b` derives reports/index; `commit-13-c` creates review-required drafts.

## 7. Acceptance responsibility and veto handling

| Artifact/output | Maximum implementation-plan status | Authority |
|---|---|---|
| raw case/suite/check | `passed/failed/blocked_dependency/infra_error/invalid_execution` as actually emitted | test owner/reviewer |
| evidence index/EV | `derived/ineligible/unavailable/invalid` | evidence reviewer |
| `handoff.md` | `draft/review_required` | acceptance coordinator |
| `veto-checklist.md` | per VF `not_evaluable` until reviewed | formal 06 authorized reviewer |
| `risk-acceptance.md` | candidate/draft only; no invented acceptor/date | named risk authority |
| overall verdict/signoff/readiness | none in implementation plan | formal 06 authority only |

`VF-L2R-001~008` are hard veto subjects. Triggered VETO creates S-level stop and a new fixed run; `not_evaluable` cannot be written as `not_triggered`; VETO and S/A/P0 risk cannot be accepted by implementation agent.

## 8. Phase and boundary stop review

| Phase | Exit gate | Test closure | Acceptance/redline closure | Design-period status |
|---|---|---|---|---|
| PH-01 | GATE-03 | vocabulary/dependency/error cases | VF-003/007/008 direction | pass-designed; actual not_run |
| PH-02 | GATE-06 | Port/UoW/replay/lease/Unknown cases | VF-004/005 direction | pass-designed; actual not_run |
| PH-03 | GATE-09 | CUT-02, SM-25~30, loop faults | AC-001/005/035; VF-004/006 | pass-designed; actual not_run |
| PH-04 | GATE-12 | admission/run/plan/query | AC-001/006~008; VF-004/005 | pass-designed; actual not_run |
| PH-05 | GATE-15 | context/memory/source/jobs | AC-002/009/010/028; VF-001/003/006 | pass-designed; positive blocked |
| PH-06 | GATE-18 | model two-UoW/classification | AC-003/011/012; VF-003/004 | pass-designed; provider blocked |
| PH-07 | GATE-21 | guards/attempt/SM-31 | AC-004/014/015; VF-001/002/004 | pass-designed; tools blocked |
| PH-08 | GATE-24 | delegation/feedback/reflection | AC-004/016/019/024; VF-001/005 | pass-designed |
| PH-09 | GATE-27 | checkpoint/recovery/jobs | AC-005/017/018; VF-004/005 | pass-designed; CP blocked |
| PH-10 | GATE-30 | outcome/handoff/ACK/gap | AC-005/020/024/025; VF-005/006 | pass-designed; route blocked |
| PH-11 | GATE-33 | projection/events/publisher/jobs | AC-020/024/030/034; VF-005/006/007 | pass-designed; Bus/Obs blocked |
| PH-12 | GATE-36 | config/slot/builder/entry | AC-021~023/029/030/033/036; VF-001/006/007/008 | pass-designed; Entry blocked |
| PH-13 | GATE-39 | exact 177, 8 suites, 9 checks, same-run aggregates | all AC/VF/NFR/EG only as review inputs | pass-designed; no evidence/verdict |

Each Phase and each boundary stops for review before the successor activates. The reviewer checks selector non-emptiness, owner uniqueness, failure preservation, redaction, AC/VF/NFR/EG trace, external blocker posture and phase boundary. Any unresolved design conflict returns to the owning formal document.

## 9. Step gate

| Check | Result |
|---|---|
| 39 boundary Gate rows map one-to-one to Step 6 | `pass-designed` |
| canonical 37/177/8/9 denominator retained | `pass` |
| 31 states/7 UoW/6 replay and 13 slots/15 config covered | `pass-designed` |
| every Gate has test family, suite, checks, AC/VF/NFR/EG and failure action | `pass-designed` |
| same-run paths and evidence maturity explicit | `pass-designed` |
| G2/G3 separate and blocked-aware | `pass-designed` |
| acceptance authority remains outside implementation agent | `pass` |
| actual test/run/artifact/report/evidence/verdict/signoff | `none/not_started` |

```text
step_07 = completed
next_allowed_action = rebuild_step_08_config_environment_dependencies
formal_07_write_allowed = false
```
