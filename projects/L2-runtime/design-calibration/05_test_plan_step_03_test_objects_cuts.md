# L2-runtime 05 测试方案 Step 3：测试对象与测试切口

> 对应 SOP：`standards/document/测试方案讨论流程_SOP.md` Step 3
> 回填位置：正式 `05-测试方案.md` §3
> 输入：Step 2、正式 `02` §§4~10、`03` §§4~15、`04` §12.1
> 状态：`completed_continuous_authorized`

## 1. 本步判断与旧材料诊断

测试切口按“一个稳定 oracle + 一个主要风险发现位置”拆分，而不是按 crate、测试层或旧 TC 库机械分类。旧 20 CUT 同时压缩了新增 loop/plan/model binding/attempt 状态与配置生命周期，且仍引用 18 SM，因此整体废弃。

| 诊断项 | 当前处理 |
|---|---|
| 只按 unit/service/integration 列对象 | 拒绝；先按 design risk/canonical owner 建 cut，Step 4 再分层 |
| capability 与 protocol 合并 | 拒绝；能力语义 cut 与 exact public surface cut 分列 |
| 31 个状态只设一个 smoke | 拒绝；三组 cut 管理，但每个 SM 保留独立 case identity |
| external blocker 导致对象消失 | 拒绝；保留 negative/blocked-aware cut，positive lane 单独 blocked |
| 配置只测 parser | 拒绝；schema/assembly 与 profile-slot-job/capture/change 分列 |
| observation 与 evidence 混同 | 拒绝；本 Step 只测 observation carrier/redaction；evidence 属 Step 13 |

## 2. Canonical 测试切口总表

| Cut | 测试对象 / design truth | 主要来源 | 主要风险 | 最早推荐层 | Step 6 最小要求 |
|---|---|---|---|---|---|
| `CUT-L2R-01-VOCAB` | IDs/refs/scope/correlation/metadata/digest/SafeReason/envelopes/errors | `03` CAP-01、§6.2~6.3、§7.1、§11 | identity/scope/body 混同 | unit/contract | valid/missing/mismatch/roundtrip/forbidden body |
| `CUT-L2R-02-LOOP` | activation/snapshot/decision/T1-T2-T3/continuation/yield/wakeup | `03` §§5.3、6.4、8、9 SM-25~29 | 多 operation、spin、stale lease、lost wakeup | unit/service/fault | one activation/step/service、budget、lease、no-progress、replay |
| `CUT-L2R-03-ADMISSION` | trigger/admission decision/workspace shell | CAP-02、C01、SM-01/03/30 | negative admission 建 run、source/guard fail-open | unit/service | accepted atomic create；reject/wait/block/unknown zero run |
| `CUT-L2R-04-RUN-CONTROL` | ControlledRun/control intent/status/history | CAP-02、C02/C03、SM-02 | terminal rewrite、resume without proof、external cleanup inference | unit/service | pause/resume/cancel/terminal/version/unknown |
| `CUT-L2R-05-PLAN` | workspace/revision/item/proposal/progress | CAP-03、C03、SM-03/19/20/21 | invalid graph、accepted=active、implicit external completion | unit/service | graph/base CAS/dependency/once-only/no body |
| `CUT-L2R-06-CONTEXT` | candidate/decision/WorkingContext | CAP-04、C04/Q04、SM-04/15 | stale mandatory source、silent truncation、mutable frozen input | unit/service | order/freshness/budget/omission/freeze/body-free |
| `CUT-L2R-07-MEMORY` | WorkingMemory/RetrievalRequest/Candidate/UseRecord/compaction | CAP-05、C05/Q05/J03、SM-05 | durable owner leakage、double use、unknown compaction | unit/service/job | working-only、candidate eligibility、use unique、old window authority |
| `CUT-L2R-08-MODEL-BIND` | ModelInputBinding/materialization/submission identity | CAP-06、C06、SM-22/23 | body persistence、digest drift、call before binding | unit/service/adapter | ephemeral body、stable digest、pending zero provider call |
| `CUT-L2R-09-MODEL-DECISION` | intent/turn/semantic result/decision/summary | CAP-06、C06/C07/E01/Q06、SM-06 | provider truth leak、late result rewrite、unknown resubmit | unit/service/event | finite disposition、late/duplicate/unknown、safe summary |
| `CUT-L2R-10-ACTION-GUARD` | ActionDecision/precondition inputs/guard | CAP-07、C08/C09/Q07、SM-07 | choice=execution、missing/stale guard allow | unit/service | all five guards、owner/scope/version/freshness、zero submit |
| `CUT-L2R-11-ACTION-SUBMIT` | attempt/marker/invocation/reconcile | CAP-07、internal submit、SM-08/31 | external call before record、duplicate effect、Executed fabrication | service/adapter/fault | UoW-1 before one call、finite outcome、unknown status-only |
| `CUT-L2R-12-DELEGATION` | delegation/boundary/budget/child result | CAP-08、C10/E03/Q08、SM-09 | scope expansion、shared mutable context、double child submit | unit/service/event | strict subset/budgets/isolation/once incorporation |
| `CUT-L2R-13-FEEDBACK` | feedback receipt/order/incorporation | CAP-09、C11/E02、SM-10 | late/duplicate/mismatch reverse-write | service/worker | inbox identity/order/quarantine/once progress |
| `CUT-L2R-14-REFLECTION` | reflection proposal/decision | CAP-09、internal reflection、SM-21/24 | reflection overwrites history or external truth | unit/service | committed-source-only/new candidate/new decision/no rewrite |
| `CUT-L2R-15-CHECKPOINT` | candidate/digest/fence/physical commit receipt | CAP-10、C12/C13/Q09、SM-11 | Prepared=Committed、mismatch receipt promotion | unit/service/adapter/fault | minimal body-free material、matching proof、CommitUnknown |
| `CUT-L2R-16-RECOVERY` | recovery decision/continuation/resume/reconcile | CAP-10、C14/J04/J05、SM-12/28/29 | blind retry/resume unknown/unbounded continuation | unit/service/job | closed fence、finite action、manual/status-only/lease |
| `CUT-L2R-17-OUTCOME` | RuntimeOutcome/terminal summary | CAP-11、C15/Q10、SM-13 | multiple outcome、downstream status changes local truth | unit/service | terminal eligibility、one local outcome、body-free/local-first |
| `CUT-L2R-18-HANDOFF` | material/attempt/gap/ack/reconcile | CAP-12、C16/E06/J06/Q11、SM-14 | ACK=delivery/observed、gap self-close | unit/service/event/job | stable digest、matching/late/unknown ack、no outcome rewrite |
| `CUT-L2R-19-PROJECTION` | safe view/projection state/rebuild cursor | CAP-12、Q12/O06/J01、SM-16 | projection becomes truth、cursor skip、false Current | unit/service/job | history-only、contiguous cursor、CAS/stale/degraded/no writeback |
| `CUT-L2R-20-SOURCE` | SourceReference/Snapshot/Availability/capture/refresh | CAP-04/05、C17/E04/J02、SM-15 | owner/body copy、stale/current substitution | unit/service/event/job | owner/version/freshness/order/body-free/by-ref semantics |
| `CUT-L2R-21-COMMAND` | C01~C17 contracts and handlers | `03` §§7.2、8.2 | collapsed command identities/schema/UoW drift | contract/service | every named command valid/missing/replay/conflict/error/order |
| `CUT-L2R-22-QUERY` | Q01~Q12 views/mappers | §§7.3、8.3 | read writes/refreshes/existence leak | contract/service | every query visibility-first/zero UoW/write/call; empty/stale/unknown |
| `CUT-L2R-23-IN-EVENT` | E01~E06 consumers | §§7.4、8.4 | early ACK/late reverse-write/digest collision | contract/worker | every event source/schema/order/dedupe/late/collision/receipt |
| `CUT-L2R-24-OUT-EVENT` | O01~O06 materializers/outbox publisher | §§7.5、8.5 | payload rebuilt from current truth、receipt promotion | contract/integration | every event commit snapshot/stable ID/exact republish/no observed |
| `CUT-L2R-25-JOB` | J01~J07 page runners | §§7.6、8.6、13.4 | unleased/unbounded work、cursor advance on unknown | service/job/fault | every job metadata/lease/page/item/report/replay/stop |
| `CUT-L2R-26-STATE-A` | SM-01~SM-10 | `03` §§9.2~9.3 | illegal transition/state-axis flatten | unit | per SM every listed legal/nonlisted illegal/stale/replay/history |
| `CUT-L2R-27-STATE-B` | SM-11~SM-18 | §§9.2、9.4 | checkpoint/outcome/handoff/adapter/job posture mixing | unit/fault | per SM proof/unknown/terminal/lease/fence |
| `CUT-L2R-28-STATE-C` | SM-19~SM-31 | §§9.2、9.5 | new plan/model/loop/reservation/attempt states omitted | unit/fault | per SM construction/transition/stale/replay/unknown |
| `CUT-L2R-29-LOCAL-PORT` | clock/ID/digest/UoW/repository/inbox/outbox/lease/config snapshot | `03` §6.8.1~3 | generic save/LWW/hidden write/commit false success | contract/integration | every method input/version/UoW/error/call capability |
| `CUT-L2R-30-EXTERNAL-PORT` | 13 canonical owner slots and blocked/fake adapters | §§6.8.4~5、13.3 | schema substitution/fake Ready/direct Sandbox | contract/adapter | per slot request/outcome/error/zero call/blocker/direction |
| `CUT-L2R-31-UOW` | reservation + local write sets + outbox/result | §§8.1、10 | partial commit/result without fact/call inside TX | service/fault | begin/read/write/outbox/result/commit/rollback/unknown journals |
| `CUT-L2R-32-REPLAY-CONC` | idempotency/CAS/inbox/outbox/lease/cursor/re-entry | §§10.3、12 | duplicate truth/LWW/late overwrite/stale worker | unit/service/fault | same/different digest、winner、collision、epoch/page exact replay |
| `CUT-L2R-33-ERROR` | Domain/Repository/Commit/External/Config/Build/Public errors | §11 | generic swallow、raw error leak、wrong recovery action | unit/contract/service | per finite class mapping + phase-valid recovery + redaction |
| `CUT-L2R-34-CFG-SCHEMA` | selector/parser/12 roots/153 leaves/39 derived/V0~V8 | `04` §§5、7、9、12 CFG-T01~05/09/13 | alias/default/coercion/secret/partial typed output | unit/config | exhaustive partitions、whole reject、stable safe issue |
| `CUT-L2R-35-CFG-RUNTIME` | profile/13 slots/7 jobs/V9~V12/builder/capture/cold change | `04` §§6、7.5~7.7、9~12 CFG-T06~08/10~15 | fake leak、Bound=Ready、mid-op drift、online reload | unit/service/config/fault | 4x4、tuples、jobs、atomic publish、by-ref、cold rollback ceiling |
| `CUT-L2R-36-OBS-SEC` | RuntimeObservation/redaction/cardinality/forbidden material/owner no-write | `03` §14；`00` VF-001~006 | body/secret/high-cardinality/evidence fabrication | unit/static/service | phase/ref/disposition、redact-before-serialize、no evidence/observed |
| `CUT-L2R-37-ENTRY-DEP` | Builder/Api/Worker/Jobs/TestFake/dependency graph | `03` §§3~4、6.8.6、13.5；VF-007/008 | direct repo I/O、fake leakage、sibling compile dep、source drift | contract/entry/static | facade-only、profile authority、only-Core candidate、trace source |

## 3. Exact inventory reservations

这些是 design denominator，不是 TC 数量、suite 数或执行结果。

| Family | Canonical denominator | Step 6 identity requirement | 禁止替代 |
|---|---:|---|---|
| capability | 12 | `CAP-01~12` 每项至少一个 owning case batch | 仅按 crate smoke |
| Commands | 17 | C01~C17 每项独立 base TC + required variants | generic command decoder |
| Queries | 12 | Q01~Q12 每项独立 base TC + zero-write variants | generic read test |
| inbound Events | 6 | E01~E06 每项独立 consumer TC | worker smoke |
| outbound Events | 6 | O01~O06 每项独立 materializer TC | publisher smoke |
| Jobs | 7 | J01~J07 每项独立 page-runner TC | shared runner only |
| states | 31 | SM-01~SM-31 每项独立 state TC | 18-state subset 或 global state table |
| external slots | 13 | 每 slot 至少 negative/blocked contract row | generic unavailable adapter |
| config slices | 15 | CFG-T01~15 每 slice 独立 mapping | parser-only suite |
| VF directions | 8 | 每 VF 至少一个 executable/static veto path | documentation assertion only |

## 4. P0 cut stop-review

| Cut group | Source exact | Risk concrete | Earliest layer valid | Future case executable | 结论 |
|---|---|---|---|---|---|
| 01~07 vocabulary/loop/run/plan/context/memory | yes | yes | yes | yes | pass |
| 08~14 model/action/delegation/feedback/reflection | yes | yes | yes | yes，positive seam 可 blocked | pass |
| 15~20 checkpoint/recovery/outcome/handoff/projection/source | yes | yes | yes | yes，external truth ceiling 明确 | pass |
| 21~25 protocols/jobs | exact 17/12/6/6/7 | per protocol family | contract/service/worker/job | exact identity reserved | pass |
| 26~28 states | exact SM-01~31 | per canonical subject | unit/fault | every SM independent | pass |
| 29~33 Ports/UoW/replay/errors | method/phase/error source | concrete | contract/integration/fault | journal/spy oracle available | pass |
| 34~35 configuration | exact `04` slices/inventory | concrete | unit/config/service/fault | exhaustive partition possible | pass |
| 36~37 observation/security/entry/dependency | formal carrier/redline/layout | concrete | unit/static/entry | executable/static oracle possible | pass |

## 5. Cross-cut source audit

| 审计项 | 结论 | 修正 / 防重规则 |
|---|---|---|
| `03` §15 object groups 是否全部承接 | pass | 分布于 CUT 01~20、29~33 |
| 48 protocol/job 是否都有独立入口 | pass | CUT 21~25，Step 6 不得合并 identity |
| 31 state 是否孤儿 | pass | CUT 26~28，逐 SM case reservation |
| loop/plan/model-binding/attempt 新增设计是否遗漏 | pass | CUT 02/05/08/11/28 |
| Query no-write 是否仅隐含 | no | CUT-22 与 CUT-29 独立 |
| external owner negative 是否被 positive blocker吞掉 | no | CUT-30/36/37 保留 blocked-aware oracle |
| configuration online reload 污染 | removed | CUT-35 只承接 startup/capture/cold replacement |
| cut 重叠是否会重复 evidence | controlled | Step 5 为每 requirement/cut 指定 primary EV candidate；辅助映射不重复 owner |
| phase boundary 越界 | none | local fact/attempt/receipt/delivery/observed/evidence 分层 |

## 6. 正式 §3 回填草稿

本测试方案采用 37 个风险导向测试切口。能力语义、公共协议、状态主体、Port、事务、配置和横切红线分别建 cut：一个能力 smoke 不能替代 exact protocol，一个 protocol smoke 不能替代 state/UoW/fault，一个 fake adapter 不能替代 positive integration。`SM-01~SM-31`、C01~C17、Q01~Q12、E01~E06、O01~O06、J01~J07、13 external slots 和 `CFG-T01~15` 都保留独立身份。

每个 P0 cut 必须在 Step 6 形成正向或明确 blocked local posture、关键负向/边界、适用的并发/replay/recovery、数据前置、自动化 owner 和候选证据。具体 product/owner integration 不可用时，cut 仍验证 zero-call、no-write、typed blocked/unknown 和 forbidden promotion，不能静默 skip。

## 7. Step 3 停审

```text
cut_count = 37
protocol_denominator = 17/12/6/6/7
state_denominator = 31
external_slot_denominator = 13
config_slice_denominator = 15
unresolved_orphan = 0
step_status = completed_continuous_authorized
next_step = Step 4
```
