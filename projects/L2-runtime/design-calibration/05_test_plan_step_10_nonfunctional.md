# L2-runtime 05 测试方案 Step 10：专项测试与非功能验证

> 对应 SOP：`standards/document/测试方案讨论流程_SOP.md` Step 10
> 回填位置：正式 `05-测试方案.md` §10
> 输入：正式 `00` NFR/VF、正式 `03` §§9~14、正式 `04`、Step 6/7/8/9
> 状态：`completed_continuous_authorized`
> 事实边界：没有 workload、benchmark、实现、环境、run、measurement、artifact 或 evidence；以下均为 planned oracle

## 1. 专项目标与阈值 authority

专项验证回答性能分解、安全红线、可用性降级、事务一致性、幂等并发、故障恢复、观测审计、配置和依赖边界如何被自动化证明。它不把观察候选当 Observability truth，不把 fake 当真实依赖，不新增 provider/Sandbox/backend 语义。

| 类别 | Authority | 当前通过口径 |
|---|---|---|
| `NFR-L2R-001~003` 性能/预算 | 正式 00 只给 measurement dimension；04 给确定的预算/页/lease 配置语义 | 固定 workload/profile 可重放、stage 分解完整、work/bound 单调可解释、配置 hard bound 生效；无 P95/P99/QPS/SLA/capacity 数值 verdict |
| `NFR-L2R-004~019` | 正式 00 的可判定行为、03 state/UoW/error/observation、04 fail-closed | canonical state/write/call/fence/redaction/source assertions 全部满足 |
| `VF-L2R-001~008` | 正式 00 一票否决边界 | 任一命中即未来 gate hard failure；不得降级为普通性能风险 |

NFR 专项不创建额外虚拟 TC/EV。每项由 Step 6 canonical raw cases 及其 owning EV 留证；性能 measurement 是 raw case artifact 的附件，只有真实 raw/report pair 才有资格进入 Step 13 evidence index。

## 2. NFR-L2R-001~019 可执行专项矩阵

| NFR | 专项 / 风险 | Planned method / environment | Source-based pass condition | Canonical TC / EV source |
|---|---|---|---|---|
| 001 | local work 被 report/observed/SDK 路径放大 | fixed `DS-L2R-PLAN-LOOP/CONTEXT-MEMORY/RECOVERY/HANDOFF`; `ci_contract`;分别开/关外围 spy | 相同输入下 local stage/call/write identity 不因 report/observed/SDK 存在而新增；记录 count/duration sample，不设数字阈值 | `TC-LOOP-001`,`TC-C04-001`,`TC-C12-001`,`TC-C16-001`; owning EV |
| 002 | local latency 与 model/memory/tool/handoff wait 混淆 | finite Port wait scripts；每 stage 单独计时；fixed seed/profile | local/UoW/Port-wait/report stage 均有 provenance；总时延不得替代分段；Unknown/timeout 保留 disposition | `TC-C06-001`,`TC-CAP07-002`,`TC-CAP12-001`,`TC-OBS-001` |
| 003 | context/child/checkpoint/handoff/job 无界 | exact/exceed boundary corpus；`ci_contract/fault` | 04 配置的 context/action/delegation/checkpoint/handoff/page/lease bounds 均生效；超界 typed reject/block/HardYield；缺 authority 不生成 capacity verdict | `TC-C04-001`,`TC-C10-001`,`TC-C12-001`,`TC-J01~07-001`,`TC-CFG03/05/08-001` |
| 004 | unavailable/timeout/late 覆盖历史或压平 posture | each external finite outcome + event/order faults | `Waiting/Blocked/Degraded/Unknown/Unavailable` 按正式载体区分；history append-only；无 local truth overwrite | `TC-CAP02-001`,`TC-CAP09-001`,`TC-ERR-001~007`,`TC-OBS-003` |
| 005 | model/memory seam 缺失被伪装成等价 fallback | slots 04/07/08 Disabled/Blocked/unknown；working-only/no-model variants | 只影响依赖能力；working-only/no-model 明示非等价；zero provider/durable write/readiness | `TC-SLOT04/07/08-001`,`TC-CAP05/06-001`,`TC-BOUND-002` |
| 006 | Tools/Governance/Sandbox 缺失时 fail-open/host bypass | missing/stale/unknown guard matrix + direct Sandbox forbidden fixture | guard 不全即 zero invocation；无 host/direct fallback；blocked local fact retained | `TC-C09-001`,`TC-CAP07-001`,`TC-SLOT01/05/06-001`,`TC-BOUND-004/008` |
| 007 | forbidden material 进入 truth/checkpoint/event/handoff/report | unique dummy canary across every write/output surface；static + runtime scan | raw secret/body/hidden reasoning/route/cost/capture absent；redaction failure blocks emission/evidence eligibility | `TC-CFG09-001`,`TC-OBS-002`,`TC-SEC-001/002`,`TC-BOUND-003` |
| 008 | governed/capability/sandbox-required action 使用错误 owner/scope/version/freshness | five-view guard permutations and version change between read/attach | Allowed only when every required owner view current and unchanged；no local approval/registry/isolation truth | `TC-CAP07-001`,`TC-C09-001`,`TC-SLOT01/05/06-001` |
| 009 | child scope/context/budget/authority 越父级或共享 mutable state | strict subset/exact/equal/superset/overflow/mutable allow-list corpus | only immutable strict-contained boundary accepted；invalid has zero child call/member/container fields | `TC-CAP08-001`,`TC-C10-001`,`TC-SLOT09-001`,`TC-BOUND-005` |
| 010 | run/goal/plan/source/turn/action/checkpoint/outcome/handoff 关联断裂 | deterministic typed ref graph and 5 local aggregate validation | every conclusion follows typed correlation/causation/source/version chain；no guessed identity/body | `TC-CAP01-001`,`TC-OBS-001`,`TC-SOURCE-001`,`TC-E2E-001~005` |
| 011 | local outcome、attempt、receipt、delivery、observed、consumption 混层 | downstream ACK/receipt/report replay after immutable outcome | local outcome/checkpoint/run unchanged；only matching local attempt/gap/projection fact may change | `TC-C15/16-001`,`TC-O04/05-001`,`TC-BOUND-007`,`TC-TRUTH-001` |
| 012 | stale/conflict/re-resolution 覆盖旧历史 | source version and recovery/reflection conflict corpus | append new fact/decision/gap with prior links；old source/turn/history immutable | `TC-C14/17-001`,`TC-CAP09-002`,`TC-E04-001`,`TC-SM15/24-001` |
| 013 | duplicate trigger/feedback/checkpoint/resume/handoff 分叉或重效 | same identity/digest, collision digest, two actor, commit unknown | exact replay one truth/effect；collision conflict；unknown fence and status-only reconcile | `TC-C01~17-001` shared variants、`TC-REPLAY-001~006`,`TC-UOW-001~007` |
| 014 | duplicate source read 生成第二 truth 或 candidate/snapshot/commit 混同 | repeat/stale/conflict source and memory candidate scripts | ref/snapshot/use/commit identities stay distinct；no second owner truth/durable write | `TC-C04/05/17-001`,`TC-E04-001`,`TC-SLOT03/04-001` |
| 015 | late model/tool/child result 覆盖新 decision/outcome | duplicate/late/out-of-order/mismatch/collision sequences | quarantine/record-only or one valid apply；no newer decision/terminal outcome reverse-write | `TC-C07/11-001`,`TC-E01/02/03-001`,`TC-REPLAY-003` |
| 016 | failure/wait/unknown/recovery/handoff gap 缺低敏材料 | observation carrier matrix for all phases/dispositions | required safe refs/phase/disposition/reason/gap/fence present；carrier remains candidate | `TC-OBS-001/003`,`TC-SOURCE-001`; `EV-UNIT-691`,`EV-FAULT-693` |
| 017 | observation/log/metric/report 泄漏或高基数爆炸 | canary + allow-list scan before/after serialization | closed low-cardinality labels only；no user/provider/body/secret/high-cardinality value | `TC-OBS-002`,`TC-SEC-001/002`,`TC-CFG09-001` |
| 018 | observation/event handoff failure 被解释为 Runtime success/failure | rejecting/unknown/duplicate handoff/publisher/observation scripts | local attempt/gap/cursor explicit；receipt != delivered/observed；domain truth unchanged | `TC-SLOT11/12/13-001`,`TC-J07-001`,`TC-OBS-003`,`TC-BOUND-007` |
| 019 | planned/blocked/not_run/fake 被晋升为 evidence/readiness | source/status mapper and gate/report negative corpus | status preserved；no positive EV/readiness/acceptance；only Core compile candidate | `TC-TRUTH-001`,`TC-SOURCE-001`,`TC-DEP-001`,`TC-BOUND-008`,`TC-CFG15-001` |

Rows using ranges must expand to canonical IDs in the case manifest. A range is documentation shorthand, not a runner selector.

## 3. Performance characterization contract

Future measurement attachment for NFR-001~003 must include:

| Field | Rule |
|---|---|
| `run_id/case_id/variant_id` | bind same raw case and fixed run; never `latest` |
| `workload_manifest_digest` | binds dataset counts, weights, pages, stage and seed |
| `config_snapshot_ref/digest` | exact immutable snapshot captured by the operation/page |
| `dependency_posture` | per slot Disabled/Blocked/Candidate + scripted outcome; no Ready |
| `stage_samples` | local validation/read/UoW/call-wait/UoW-2/report separated; unit and clock source declared |
| `work_counters` | candidate/item/page/call/write/retry counts; no aggregate-only total |
| `semantic_result_ref` | ties measurement to passed/failed/blocked raw oracle without rewriting it |
| `characterization_status` | `recorded/invalid/infra_error/blocked_dependency`; not performance-pass |

No P95/P99、throughput、QPS、capacity、SLA or production suitability threshold exists. A future numeric gate requires a formal authority, workload baseline and review recorded in the then-current design chain; it cannot be retrofitted from one measurement run.

## 4. Fault injection and consistency matrix

| Fault window | Injection / owning cases | Required journal oracle | Forbidden recovery |
|---|---|---|---|
| validation before reserve | missing/schema/scope/body/authority | zero reservation/write/call; typed public error | coercion/default/fallback |
| reservation commit | UoW known fail / unknown | no semantic execution if not committed；unknown fence if indeterminate | call before durable identity |
| domain write before commit | fail each declared write | whole UoW rollback; no outbox/result visibility | compensate partial truth |
| local commit | known failure vs commit unknown | statuses distinct；unknown has stable reconcile refs | infer success or repeat operation |
| external call | timeout/reject/pending/unknown after durable attempt | at most one call; same identity; finite posture | new request key/blind retry |
| UoW-2 result attach | CAS/fault/mismatch | prior attempt remains; marker/gap/manual posture | overwrite newer aggregate |
| inbound receipt/ACK | commit fail/unknown/duplicate/collision | receipt/fact known committed before ACK；unknown ACK=0 | ACK-before-commit |
| outbound publish | reject/unknown after stored snapshot | exact same event bytes/ID/digest; cursor retained | rebuild from current truth/delivery claim |
| lease/job page | lose lease before read/commit; cursor unknown | stale epoch zero writes；last committed cursor authoritative | skip page/unbounded rescan |
| checkpoint recovery | mismatching receipt/open fence/unknown | only Committed + closed fence resumes | Prepared=stable/unknown retry |
| handoff/observation | reject/unknown/mismatched ACK | local gap retained; outcome immutable | observed/acceptance promotion |
| cleanup | namespace/fake/canary residue | `infra_error`; evidence ineligible | count product result as qualified pass |

The owning suite is `fault_replay_consistency` unless the fault belongs to a protocol/entry/config/security owning case. Cross-suite companion assertions may reference the same semantic invariant but cannot duplicate raw ownership.

## 5. Security and boundary veto matrix

| VF | Executable trigger | Required result / Gate |
|---|---|---|
| `VF-L2R-001` owner reverse-write | attempt Runtime mutation of Tools/Hub/Method/Governance/Sandbox/Observability/Artifact/provider | no write trait/method, owner spy unchanged；`TC-BOUND-001/006`,`TC-SEC-003` |
| `VF-L2R-002` fail-open/bypass | missing/unknown guard + sandbox-required action + legacy host/direct path | Blocked/Unknown, invocation zero, direct route forbidden；`TC-BOUND-004/008` |
| `VF-L2R-003` forbidden material | canary raw body/secret/capture/Artifact/Evidence/hidden reasoning across every surface | closed-schema rejection or zero leak；`TC-CFG09-001`,`TC-OBS-002`,`TC-SEC-001/002` |
| `VF-L2R-004` unknown replay | commit/effect unknown then ordinary retry/new key | same fence/status-only/manual; external call count unchanged；UOW/REPLAY/CAP07/CAP10 |
| `VF-L2R-005` phase promotion | apply receipt/ACK/Observed/report/downstream acceptance to local truth | immutable outcome/checkpoint/run；`TC-BOUND-007`,`TC-TRUTH-001` |
| `VF-L2R-006` fake/evidence promotion | map fake/planned/blocked/not_run/pending to pass/ready/evidence | mapping rejected/status exact；`TC-TRUTH-001`,`TC-BOUND-008`,`check_status_truth.sh` |
| `VF-L2R-007` dependency disguise | introduce non-Core sibling package/Cargo/path dependency | dependency check failure；`TC-DEP-001`,`check_dependency_boundaries.sh` |
| `VF-L2R-008` orphan identity | unresolved/legacy requirement, field, state, error, TC or EV | source/denominator check failure；`TC-SOURCE-001`,`check_source_manifest.sh` |

All eight are P0 veto candidates. This test plan only defines detection evidence; the future rebuilt `06-验收标准.md` owns the formal verdict.

## 6. Observation and audit surface

| Surface | Required candidate material | Prohibited material / truth claim | Case/check |
|---|---|---|---|
| state transition | subject ref、from/to typed variant、expected/new version、operation/causation/history、safe reason、fence/source refs | body、hidden reasoning、owner audit truth | SM01~31、OBS001 |
| command/loop | operation/run/scope、phase T1/T2/T3、disposition、budget/lease posture | full input/current-state dump、implicit retry | C/LOOP/OBS |
| external slot | slot key、binding posture、request digest/ref、finite result category、gap | endpoint/secret/route/quota/cost/provider body、Ready | SLOT01~13、OBS002 |
| event/job | event/job/partition/page/epoch/cursor、receipt/posture | payload body、ACK=acceptance、receipt=delivery | E/O/J、SEC |
| checkpoint/handoff | checkpoint/effect fence/outcome/material/attempt/gap refs | full context、delivered/observed/accepted claim | CAP10~12、BOUND007 |
| artifact/report | fixed run/case/suite/status/digest refs | raw secret/body、static evidence、signoff/readiness | TRUTH/SOURCE + Step 9 checks |

Observation adapter or backend absence leaves a candidate/gap and blocks positive observed/audit qualification. It does not block local carrier/redaction tests and cannot be hidden as a skipped pass.

## 7. Suite/check mapping and current blockers

| Specialty | Owning suites | Mandatory checks | Positive limitation |
|---|---|---|---|
| performance/bounds | unit_state、service_semantics、entry_worker_job、config_builder | denominator/source | characterization only; toolchain/implementation absent |
| availability/dependency | service_semantics、contract_protocol、fault_replay_consistency | status truth、fake leak | all real owner seams unqualified |
| security/owner boundary | security_source_boundary、config_builder、contract_protocol | forbidden material、dependency、redaction、status truth | owner/backend positive facts blocked |
| consistency/recovery | fault_replay_consistency、service_semantics、entry_worker_job | denominator、artifact pairing | physical DB/broker/checkpoint qualification blocked |
| observation/audit | security_source_boundary、contract_protocol、entry_worker_job | redaction、no-static-evidence、pairing | Observability delivery/backend/evidence blocked |

`L2R-UP-001~008`、`L2R-CP-001`、`L2R-ENTRY-001`、`L2R-IMPL-001` remain open. `L2R-LANG-001` keeps Rust 2024 / planned 1.93 as unverified preflight; no toolchain, async runtime, DB, broker or scheduler result exists.

## 8. Step 10 stop-review

| Audit | Result |
|---|---|
| NFR denominator | 19/19 mapped to method, source-based condition and canonical cases |
| performance thresholds | zero fabricated numeric threshold; characterization schema complete |
| VF denominator | 8/8 executable hard-redline mappings |
| fault windows | validation/reserve/write/commit/call/UoW-2/event/publish/job/checkpoint/handoff/cleanup covered |
| observation surfaces | state/command/external/event/job/checkpoint/report covered with redaction boundary |
| positive qualification | remains blocked; no local/fake promotion |
| new actual TC/EV/result | none; all evidence derives from canonical raw owners in future runs |

```text
step_status = completed_continuous_authorized
nfr_coverage = 19/19
vf_coverage = 8/8
numeric_performance_verdict = none
actual_measurement_or_evidence = false
next_step = Step 11
formal_05_write_allowed = false_until_step_15
```
