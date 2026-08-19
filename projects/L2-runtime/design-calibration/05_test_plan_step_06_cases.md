# L2-runtime 05 测试方案 Step 6：测试场景与用例设计

> 对应 SOP：`standards/document/测试方案讨论流程_SOP.md` Step 6
> 回填位置：正式 `05-测试方案.md` §6
> 输入：Step 5 双向覆盖矩阵、正式 `03` §§5~15、正式 `04` §12.1
> 状态：`completed_continuous_authorized`
> 证据状态：所有 TC/EV 均为 planned identity；没有执行、run、artifact、report、evidence 或 verdict

## 1. 本步输出与 annex

| Annex | 内容 | Exact denominator |
|---|---|---:|
| `05_test_plan_step_06_cases_capability_boundaries.md` | CAP、loop、13 slots、local Ports、entry/dependency/owner boundary | 12 CAP + 6 loop + 13 slots + boundary families |
| `05_test_plan_step_06_cases_commands.md` | mutation protocol 与 Flow | C01~C17 = 17 |
| `05_test_plan_step_06_cases_queries_events_jobs.md` | read/event/job protocol 与 phase | Q01~12 + E01~06 + O01~06 + J01~07 = 31 |
| `05_test_plan_step_06_cases_states_tx_config.md` | states、UoW、replay、errors、config、security | SM-01~31 + CFG-T01~15 + cross-cut families |

每个 P0 用例必须按 annex 中的前置、操作/故障、canonical state/result、write/call journal、negative oracle 和 planned EV identity 实现。Step 7 才固定 fixture/data；Step 9 才固定 suite/gate/script contract；Step 13 才固定 evidence manifest/path。

## 2. 用例执行模型

```text
[canonical source + deterministic fixture]
                   |
                   v
           [one owning raw TC]
       input -> call -> result/state
              |       |
              v       v
        write journal  Port call journal
              \       /
               v     v
        [assertions + raw candidate slot]
                     |
            same run refs only
                     v
          [optional local aggregate]
```

关键说明：

- Owning raw TC 是唯一 oracle owner；annex companion case 可以交叉验证，但不得用 aggregate 覆盖底层失败。
- external fake/spy 只记录有限请求、顺序、digest 和 outcome；不提供 owner readiness oracle。
- 同一 case 的 valid、negative、boundary、replay、fault partitions 必须分别报告，不能以一个 case name 掩盖过滤/skip。
- 任一 child raw result 非 pass、缺失、blocked 或 infra_error 时，local aggregate 不得成为 pass。

## 3. 37 CUT 到 owning case batch

| CUT | Owning case batch | 必须包含的 partitions | Planned EV owner | 停审 |
|---|---|---|---|---|
| 01 VOCAB | `TC-CAP01-001`,`TC-ERR-001` | valid/missing/mismatch/roundtrip/body/security | UNIT/CON/STATIC | pass |
| 02 LOOP | `TC-LOOP-001~006`,`TC-SM25~29-001` | one-step/budget/no-progress/lease/wakeup/replay/unknown | UNIT/SVC/FAULT | pass |
| 03 ADMISSION | `TC-CAP02-001`,`TC-C01-001`,`TC-SM01-001` | accepted atomic + all negative zero-run + replay | SVC/UNIT | pass |
| 04 RUN-CONTROL | `TC-CAP02-002`,`TC-C02-001`,`TC-SM02-001` | pause/resume/cancel/terminal/stale/unknown | SVC/UNIT | pass |
| 05 PLAN | `TC-CAP03-001`,`TC-C03-001`,`TC-SM03/19/20/21-001` | graph/base/dependency/proposal/activation/history | SVC/UNIT | pass |
| 06 CONTEXT | `TC-CAP04-001`,`TC-C04-001`,`TC-Q04-001`,`TC-SM04-001` | ordering/freshness/budget/omission/freeze/body-free | SVC/CON/UNIT | pass |
| 07 MEMORY | `TC-CAP05-001`,`TC-C05/Q05/J03-001`,`TC-SM05-001` | working-only/use unique/compaction/fault/no durable write | SVC/CON/JOB/UNIT | pass |
| 08 MODEL-BIND | `TC-CAP06-001`,`TC-C06-001`,`TC-SM22/23-001` | frozen binding/digest/ephemeral material/pending zero-call | SVC/UNIT/FAULT | pass |
| 09 MODEL-DECISION | `TC-CAP06-001`,`TC-C07/E01/Q06-001`,`TC-SM06-001` | finite result/late/mismatch/unknown/safe summary | SVC/ENTRY/CON/UNIT | pass |
| 10 ACTION-GUARD | `TC-CAP07-001`,`TC-C08/C09-001`,`TC-SM07-001` | all choices/five guards/stale/zero submit | SVC/UNIT | pass |
| 11 ACTION-SUBMIT | `TC-CAP07-002`,`TC-SLOT06-001`,`TC-SM08/31-001`,`TC-UOW-002~004` | record-before-call/one call/finite posture/unknown reconcile | SVC/UNIT/FAULT | pass |
| 12 DELEGATION | `TC-CAP08-001`,`TC-C10/E03/Q08-001`,`TC-SM09-001` | subset/budget/isolation/record-before-call/incorporate once | SVC/ENTRY/CON/UNIT | pass |
| 13 FEEDBACK | `TC-CAP09-001`,`TC-C11/E02-001`,`TC-SM10-001` | source/order/dedupe/collision/late/ACK-after-commit | SVC/ENTRY/FAULT | pass |
| 14 REFLECTION | `TC-CAP09-002`,`TC-SM24-001` | committed anchor/new candidate/new decision/no rewrite/body | SVC/UNIT | pass |
| 15 CHECKPOINT | `TC-CAP10-001`,`TC-C12/C13-001`,`TC-SLOT10-001`,`TC-SM11-001` | Prepared/receipt mismatch/CommitUnknown/no resume | SVC/UNIT/FAULT | pass |
| 16 RECOVERY | `TC-CAP10-001`,`TC-C14/J04/J05-001`,`TC-SM12/28-001` | finite decision/closed fence/lease/status-only/no retry | SVC/JOB/UNIT/FAULT | pass |
| 17 OUTCOME | `TC-CAP11-001`,`TC-C15/Q10-001`,`TC-SM13-001` | terminal proof/one outcome/local-first/immutable | SVC/CON/UNIT | pass |
| 18 HANDOFF | `TC-CAP12-001`,`TC-C16/E06/J06/Q11-001`,`TC-SM14-001` | material/attempt/gap/ack/reconcile/no promotion | SVC/ENTRY/JOB/CON/FAULT | pass |
| 19 PROJECTION | `TC-CAP12-001`,`TC-Q12/O06/J01-001`,`TC-SM16-001` | history-only/contiguous cursor/CAS/gap/no domain write | CON/JOB/UNIT/FAULT | pass |
| 20 SOURCE | `TC-C17/E04/J02-001`,`TC-SLOT03-001`,`TC-SM15-001` | owner/version/freshness/completeness/body-free/order | SVC/ENTRY/JOB/UNIT | pass |
| 21 COMMAND | `TC-C01-001~TC-C17-001` | 17 identities x valid/replay/collision/commit-unknown + flow negatives | SVC/FAULT | pass |
| 22 QUERY | `TC-Q01-001~TC-Q12-001` | 12 identities x visibility/present/missing/stale/unknown/zero-write | CON | pass |
| 23 IN-EVENT | `TC-E01-001~TC-E06-001` | 6 identities x source/schema/order/dedupe/collision/commit/ACK | ENTRY/FAULT | pass |
| 24 OUT-EVENT | `TC-O01-001~TC-O06-001`,`TC-UOW-006` | 6 identities x commit snapshot/rollback/exact republish/no observed | CON/FAULT | pass |
| 25 JOB | `TC-J01-001~TC-J07-001`,`TC-UOW-007` | 7 identities x lease/page/report/cursor/replay/fault/stop | JOB/FAULT | pass |
| 26 STATE-A | `TC-SM01-001~TC-SM10-001` | every formal edge/nonlisted edge/stale/replay/unknown | UNIT | pass |
| 27 STATE-B | `TC-SM11-001~TC-SM18-001` | every formal edge/nonlisted edge/stale/replay/unknown | UNIT/FAULT | pass |
| 28 STATE-C | `TC-SM19-001~TC-SM31-001` | every formal edge/nonlisted edge/stale/replay/unknown | UNIT/FAULT | pass |
| 29 LOCAL-PORT | `TC-LPORT-001~003`,`TC-UOW-001~007` | method capability/version/scope/UoW/CAS/append/lease/cursor | CON/FAULT | pass |
| 30 EXTERNAL-PORT | `TC-SLOT01-001~TC-SLOT13-001` | exact tuple/request/result/error/zero-call/blocker/direction | CON/ADAPTER; QUAL blocked | pass |
| 31 UOW | `TC-UOW-001~007` | all local sets + crash before/after call + commit unknown | FAULT | pass |
| 32 REPLAY-CONC | `TC-REPLAY-001~006`,`TC-LOOP-004/005` | same/different digest/CAS winner/epoch/page/permanent uniqueness | FAULT | pass |
| 33 ERROR | `TC-ERR-001~007` | every layer class/public map/recovery phase/redaction | CON/FAULT/STATIC | pass |
| 34 CFG-SCHEMA | `TC-CFG01~05/09/13-001` | selector/12 roots/153 leaves/39 derived/relations/security/CF-A | CFG/STATIC | pass |
| 35 CFG-RUNTIME | `TC-CFG06~08/10~12/14/15-001` | 4x4/13x5/7x6/V0~12/capture/cold/fault/blockers | CFG/FAULT/STATIC | pass |
| 36 OBS-SEC | `TC-OBS-001~003`,`TC-SEC-001~003`,`TC-TRUTH/SOURCE-001` | carrier/redact/cardinality/no-owner-write/no evidence fabrication | UNIT/SVC/FAULT/STATIC | pass |
| 37 ENTRY-DEP | `TC-ENTRY-001~004`,`TC-DEP-001`,`TC-BOUND-001~008` | authority/facade/ACK/profile/fake/dependency/source/owner redlines | ENTRY/STATIC/FAULT | pass |

## 4. Same-run local aggregate cases

| Aggregate | Child raw cases from the same run | Aggregate assertion | 禁止结论 | Planned EV |
|---|---|---|---|---|
| `TC-E2E-001` admission/plan loop | C01/C03/Q01/Q03 + SM01~03/19/20/25~30 + loop | formal trigger -> accepted run/workspace -> one bounded progress step；all child refs/digests align | scheduler/product readiness | `EV-E2E-001` |
| `TC-E2E-002` context/memory | C04/C05/Q04/Q05/J03 + SM04/05/15 | source refs -> deterministic frozen context + working use/compaction；negative owner gaps retained | durable memory readiness/body | `EV-E2E-002` |
| `TC-E2E-003` model decision | C06/C07/E01/Q06 + SM06/17/22/23 | frozen binding -> one finite fake submission/result -> safe decision summary | provider quality/route/readiness | `EV-E2E-003` |
| `TC-E2E-004` action/delegation feedback | C08~11/E02/E03/Q07/Q08 + SM07~10/31 | choice -> guard -> local attempt or child boundary -> normalized feedback once；blocked variants zero bypass | Tool/Sandbox/child real execution | `EV-E2E-004` |
| `TC-E2E-005` checkpoint/recovery/outcome/handoff | C12~16/E06/Q09~12/J04~07 + SM11~18/24/28 | stable local facts -> checkpoint posture -> recovery/outcome -> attempt/gap/projection with phase separation | physical durability/delivery/observed/acceptance | `EV-E2E-005` |

Aggregate status is a pure manifest function: `pass` only when every required child raw case in the same immutable run is pass and none is missing/filtered/blocked/infra_error. It cannot turn a blocked qualification into pass.

## 5. Data preconditions handed to Step 7

| Data class | Required identity |
|---|---|
| base | typed actor/scope/ref/version/correlation/digest + fixed clock/ID |
| boundary | empty/nonempty/exact/exceed counts, weights, pages, budgets, durations |
| state | per-SM source/target/guard/expected-version partitions |
| concurrency | two-actor CAS, duplicate/collision IDs, lease epochs, page digests |
| fault | ordered UoW/Port/commit/ACK/lease fault schedule + journals |
| external | finite scripted outcomes for each slot; no owner body/readiness |
| config | exact 12/153/39/13x5/7x6, V0~12, CF-A/B and blocker corpus |
| security | canary forbidden material detectable in every output surface |

## 6. Cross-case assertion and phase audit

| Audit | Result | Correction rule |
|---|---|---|
| 37 CUT have owning case | 37/37 | no orphan |
| capabilities/protocols/states/slots/config exact denominators | 12;17/12/6/6/7;31;13;15 | aggregate/smoke cannot reduce |
| positive + negative/boundary | all P0 cuts | positive external path may be blocked, local negative remains |
| replay/concurrency/rollback/recovery | all applicable surfaces | exact identity and phase journal mandatory |
| canonical state/error/protocol names | current 03 only | historical alias fails source manifest |
| phase boundaries | call-before-record, ACK-before-commit, Prepared=Committed, ACK=acceptance all prohibited | dedicated fault cases |
| duplicate assertion ownership | companion refs allowed; one planned EV owner per raw TC | aggregate references raw only |
| evidence conflict | none at design level | Step 13 manifest must enforce uniqueness |
| TC / EV identity closure | 172 owning raw TC + 5 aggregate TC；177/177 have one planned EV identity | slot EV canonicalized as `EV-CON-446~458`；aggregate EV can only reference same-run raw results |
| filtered/skip/empty denominator | cannot pass | invalid execution/gate failure |
| actual run/result/evidence/readiness | none | all remain planned/blocked |

## 7. 正式 §6 回填草稿

测试场景按 37 个 CUT 组织，并通过四个 annex 保留 12 个 capability、17 Commands、12 Queries、6 inbound Events、6 outbound Events、7 Jobs、31 个 state subjects、13 external slots 和 15 个配置切片的独立用例身份。每个 mutation case 同时断言 typed result/state、local write set、history/outbox、Port call order、replay/collision 和 commit-unknown；Query 强制 visibility-first/zero-write；Event 强制 receipt commit 后 ACK；Job 强制 lease/page/report/cursor 原子性。

五个 local E2E 仅聚合同 run 的 raw cases。fake/blocked adapter 不证明 external positive integration；Tools/Sandbox/model/memory/checkpoint/Bus/Observability/entry qualification 仍由 blocker 阻断。用例均为 planned contract，不代表已实现或已执行。

## 8. Step 6 停审

```text
cut_stop_reviews = 37/37
capability_identity = 12/12
protocol_job_identity = 17/12/6/6/7
state_identity = 31/31
external_slot_identity = 13/13
config_slice_identity = 15/15
local_e2e_aggregate = 5_planned
tc_ev_identity = 177/177_planned_not_generated
unresolved_assertion_conflict = 0
actual_test_execution = false
step_status = completed_continuous_authorized
next_step = Step 7
formal_05_write_allowed = false_until_step_15
```
