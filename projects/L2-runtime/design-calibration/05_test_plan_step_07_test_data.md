# L2-runtime 05 测试方案 Step 7：测试数据设计

> 对应 SOP：`standards/document/测试方案讨论流程_SOP.md` Step 7
> 回填位置：正式 `05-测试方案.md` §7
> 输入：Step 6 总控与四个 annex、正式 `03` 对象/协议/状态/持久化契约、正式 `04` strict config
> 状态：`completed_continuous_authorized`
> 执行事实：仅定义 planned dataset/builder/seed contract；未创建 fixture、未运行测试、未生成 run 或证据

## 1. 本步结论与历史诊断

| SOP 问题 | 结论 |
|---|---|
| 基础数据 | typed actor/scope/ref/version/correlation/digest、fixed clock、per-kind ID queues、immutable config snapshot。 |
| 边界/异常/并发/恢复 | 与 happy path 分离为 single-field mutation、state edge、two-actor CAS、ordered failpoint、lease/page/event sequence corpus。 |
| 隔离 | 未来执行身份 `<run_id>` 只作路径占位；数据隔离使用 `fixture_namespace + case_id + typed identity/epoch`，不得把领域 run_ref 当 runner run_id。 |
| 清理 | local store namespace drop、fake script/call ledger reset、config candidate discard、dummy leak corpus delete；清理失败是 infra_error。 |
| external substitute | finite fake/spy/BlockedAdapter；无真实 owner body/secret/readiness，positive qualification data unavailable。 |

旧数据表基于 18 states、旧 CMD/QRY/INE 和真实 Sandbox-like seam，整体废弃；current denominator 是 31 states、17/12/6/6/7 protocols/jobs、13 slots、15 config slices。

## 2. Planned fixture manifest

未来每个 raw case 的 fixture manifest 至少包含：

| Field | Rule | Oracle use |
|---|---|---|
| `manifest_schema` | exact supported version | unknown version fail closed |
| `execution_run_id` | runner assigned；本文不生成 | artifact/report same-run binding |
| `case_id` | exact Step 6 TC identity | selector/denominator |
| `fixture_namespace` | unique per raw case/partition | store/fake/cleanup isolation |
| `dataset_ids` | nonempty ordered IDs from §4 | reproducibility/source |
| `seed_digest` | explicit seed digest, not secret | deterministic rebuild |
| `fixed_clock_script` | timestamp sequence + advances | expiry/late/lease determinism |
| `typed_id_queues` | separate queue per canonical ID kind | no cross-kind/random identity |
| `config_snapshot_ref_digest` | immutable exact pair | operation/page capture |
| `fault_script_ids` | finite ordered failpoints | phase reproduction |
| `expected_residue` | allow-list then cleanup assertions | pollution detection |

Seed derivation is `(dataset_id, case_id, partition, typed_kind, ordinal)` under a documented deterministic algorithm chosen at implementation time. Shrinking/property tests preserve original input, seed, shrink trace and fault script; wall-clock/random values may not appear in expected assertions.

## 3. Builder families

| Builder | Must construct | Mutation strategy | Forbidden shortcut |
|---|---|---|---|
| `PrimitiveBuilder` | typed IDs/refs/scope/metadata/version/correlation/digest/SafeReason | one missing/malformed/cross-scope/body-bearing field | random ID/time; string-cast typed refs |
| `ProtocolBuilder` | all C/Q/E/O/J envelopes and results from 03 §7 | canonical valid object then one-field/schema/digest mutation | unrelated malformed blob with ambiguous error |
| `AggregateBuilder` | minimal canonical object + required history/version | one invariant/guard mutation | repository overwrite to impossible state |
| `StateCorpusBuilder` | SM-01~31 source/target/guard/write set | enumerate legal L and `(SxT)-L`, stale/replay/unknown | 18-state subset/global state manager |
| `StoreJournalBuilder` | UoW/repository/inbox/outbox/history/lease/cursor | precise pre/post commit failpoint | broad panic without phase proof |
| `ExternalScriptBuilder` | exact 13 slot finite outcomes + call journal | per-method result/order/count/digest mismatch | default infinite success/owner truth fabrication |
| `ConfigCorpusBuilder` | 12 roots/153 leaves/39 derived/13x5/7x6/V0~12/CF-A/B | one path/relation/stage mutation | tolerant map parser/default/clamp |
| `SecurityCanaryBuilder` | unique dummy forbidden strings by material class/output surface | inject one canary before redaction/write/serialize | real secret/provider/tool/Sandbox/Artifact body |

## 4. Dataset registry

| Dataset | Contents / purpose | Isolation key | Cleanup | Primary cases |
|---|---|---|---|---|
| `DS-L2R-PRIMITIVE` | fixed clock, per-kind IDs, actor/scope/ref/version/correlation/digest | namespace+typed kind | reset queues/clock | CAP01, VOCAB, all envelopes |
| `DS-L2R-PROTO-VALID` | exact 17 C + 12 Q + 6 E + 6 O + 7 J canonical objects | namespace+surface identity | no persistence/drop bytes | C/Q/E/O/J valid |
| `DS-L2R-PROTO-INVALID` | missing/unknown schema, scope/digest/body/cursor/limit mutations | namespace+case+mutation | delete case bytes | C/Q/E negatives, ERR |
| `DS-L2R-ADMISSION-RUN` | decisions, run/workspace/control/history/outcome variants | namespace+run/workspace refs | store namespace drop | CUT 03/04/17, SM01~03/13 |
| `DS-L2R-PLAN-LOOP` | revisions/items/proposals/wakeup/activation/step/continuation/yield/reservation | namespace+run+lease epoch | drop/reset lease | CUT 02/05, SM19~21/25~30 |
| `DS-L2R-CONTEXT-MEMORY` | safe source candidates, weights/freshness, context, window/use/compaction | namespace+source/context/window refs | store/fake reset | CUT 06/07/20 |
| `DS-L2R-MODEL` | intent/binding/materialization/turn/semantic result/safe summary finite refs | namespace+turn/submission | store/fake reset | CUT 08/09, SM06/17/22/23 |
| `DS-L2R-ACTION` | choice, five owner views, guard, attempt, marker, feedback order | namespace+action/attempt/event | store/fake reset | CUT 10/11/13, SM07/08/10/31 |
| `DS-L2R-DELEGATION` | parent/child scope subset, immutable boundary, budgets, result refs | namespace+delegation/child | store/fake reset | CUT 12, SM09 |
| `DS-L2R-RECOVERY` | checkpoint anchors/receipts/fences/recovery decisions/continuations | namespace+checkpoint/fence | store/fake reset | CUT 15/16, SM11/12/28 |
| `DS-L2R-HANDOFF` | local outcome, safe material, attempt/gap/ACK/outbox/projection cursor | namespace+outcome/attempt/gap | store/fake reset | CUT 17~19, SM13/14/16 |
| `DS-L2R-STATE-31` | generated legal/illegal/stale/replay/unknown partitions for every SM | namespace+SM ID+edge ID | aggregate namespace drop | TC-SM01~31 |
| `DS-L2R-COMMAND-REPLAY` | operation identities, same/different digests, stored results/corruption | namespace+operation identity | drop after replay pair | C01~17, SM30, REPLAY |
| `DS-L2R-EVENT-ORDER` | duplicate/collision/late/out-of-order/source/schema and inbox receipts | namespace+owner/event ID | drop sequence namespace | E01~06, feedback/source/handoff |
| `DS-L2R-OUTBOX` | immutable commit snapshots, later aggregate heads, publish receipts | namespace+event/outbox ref | drop/publisher reset | O01~06, J07, UOW06 |
| `DS-L2R-JOB-PAGE` | 7 operations, partitions, lease epochs, pages, reports, cursors | namespace+job+partition+epoch | drop/reset lease/store | J01~07, SM18, UOW07 |
| `DS-L2R-UOW-FAULT` | ordered failpoints for begin/write/commit/call/UoW-2/ACK | namespace+fault script+operation | reset script/journal | UOW01~07, FAULT cases |
| `DS-L2R-CAS-RACE` | two writers/read versions, uniqueness and permanent proof | namespace+aggregate+actor | join actors/drop | REPLAY04~06 |
| `DS-L2R-PORT-JOURNAL` | local Port and 13 external slot inputs/results/call order/count | namespace+slot+case | reset every ledger | LPORT/SLOT/BOUND |
| `DS-L2R-CFG-BASE` | exact valid strict documents for 4x4 allowed profiles | namespace+document digest | discard candidate | CFG01~12 valid |
| `DS-L2R-CFG-SHAPE` | duplicate-aware raw documents, 12/153/39 partitions, CFG-01~12 | namespace+path/mutation | delete raw bytes | CFG01~05/09/10/13 |
| `DS-L2R-CFG-SLOT-JOB` | 13x5 and 7x6 valid/invalid tuples, blocker matrix | namespace+slot/job+tuple | discard/reset fakes | CFG06~08/14/15 |
| `DS-L2R-CFG-COLD` | candidate/prior typed docs, canonical diff, owner replacement facts | namespace+attempt fingerprint | discard controller facts | CFG12 |
| `DS-L2R-SEC-CANARY` | dummy body/secret/route/endpoint/high-cardinality canaries per surface | namespace+canary class | delete + residue scan | OBS/SEC/CFG09/VF003 |
| `DS-L2R-SOURCE-GRAPH` | current requirement/design/CUT/TC/EV/dependency manifest + historical aliases | namespace+graph digest | delete generated graph | SOURCE/DEP/VF007/008 |

## 5. External substitute matrix

| Slot group | Substitute | Allowed scripted output | Required journal | Forbidden conclusion |
|---|---|---|---|---|
| Governance/Definition/Source/Capability | immutable safe-view fake | current/denied/stale/pending/unavailable/unknown refs | method/scope/version/freshness/order | owner truth created/updated |
| Durable memory | bounded candidate-page fake | refs/status/empty/unavailable/unknown | request/page/cursor/call count | body/index/write/delete/retention ready |
| Invocation | finite spy/fake | Accepted/Rejected/PendingContract/Unavailable/Unknown refs | request digest, call phase/count, reconcile ID | executed/Sandbox cleanup/tool truth |
| Model materializer/decision | finite semantic fake | resolved/degraded/rejected/pending/finite result ref/unknown | binding/digest/submission order/count | route/secret/quota/cost/provider quality |
| Child | finite child seam fake | accepted/result/failure/wait/unknown refs | boundary digest/scope/budget/count | member/container/image lifecycle |
| Checkpoint/Handoff/Publisher | receipt/status fake | matching/mismatch/reject/pending/unknown | request/attempt/event identity and digest | durability/delivery/observed/acceptance |
| Projection | fault-capable logical store | Empty/Current/Stale/Rebuilding/Degraded/Unknown | cursor/CAS/history reads/writes | physical store ready/domain authority |

No real-like or positive fixture is currently available. `TC-QUAL-SLOT01~13` has no dataset and remains `blocked_dependency/not_runnable`; this is deliberate, not a P0 data gap.

## 6. CUT-to-data mapping

| CUT group | TC families | Required datasets | Stop-review |
|---|---|---|---|
| 01~05 vocabulary/loop/run/plan | CAP01~03,C01~03,LOOP,SM01~03/19~21/25~30 | PRIMITIVE,PROTO,ADMISSION-RUN,PLAN-LOOP,STATE-31,REPLAY/UOW | pass |
| 06~09 context/memory/model | CAP04~06,C04~07,Q04~06,E01,J03,SM04~06/15/17/22/23 | CONTEXT-MEMORY,MODEL,PORT-JOURNAL,STATE-31,UOW | pass |
| 10~14 action/delegation/feedback/reflection | CAP07~09,C08~11,Q07/08,E02/03,SM07~10/24/31 | ACTION,DELEGATION,EVENT-ORDER,UOW,STATE-31 | pass |
| 15~20 checkpoint/recovery/outcome/handoff/projection/source | CAP10~12,C12~17,Q09~12,E04/06,O04~06,J01/02/04~07,SM11~16/28 | RECOVERY,HANDOFF,OUTBOX,JOB-PAGE,UOW,STATE-31 | pass |
| 21~25 protocols/jobs | all C/Q/E/O/J identities | PROTO-VALID/INVALID plus owning domain data, EVENT/OUTBOX/JOB | pass |
| 26~28 states | SM01~31 | STATE-31 + owning domain + UOW/CAS | pass |
| 29~33 Ports/UoW/replay/errors | LPORT/SLOT/UOW/REPLAY/ERR | PORT-JOURNAL,UOW-FAULT,CAS-RACE,PROTO-INVALID | pass |
| 34~35 config | CFG01~15 | CFG-BASE/SHAPE/SLOT-JOB/COLD,SEC-CANARY | pass |
| 36~37 observation/security/entry/dependency | OBS/SEC/TRUTH/SOURCE/ENTRY/DEP/BOUND | SEC-CANARY,SOURCE-GRAPH,PORT-JOURNAL,PROTO | pass |

## 7. Isolation and cleanup rules

| Mutable resource | Isolation | Required cleanup assertion |
|---|---|---|
| logical repositories/UoW | fixture namespace + typed aggregate | namespace absent except explicitly retained replay pair |
| operation/inbox/outbox | namespace + canonical identity | unrelated keys unchanged; exact pair removed after assertions |
| fake scripts/call journals | namespace + slot + case partition | expected script fully/partially consumed as declared; ledger reset |
| clocks/ID queues | namespace + typed kind | restored/closed; no queue shared in parallel |
| leases/pages/cursors | namespace + job/partition/epoch | no live lease; no uncommitted cursor advance |
| config snapshots/candidates | document fingerprint + namespace | invalid/candidate never replaces published fixture snapshot |
| security canary bytes | namespace + canary class | files/buffers/log captures removed and residue scan clean |

Parallel cases may not share a mutable namespace, clock, ID queue, adapter script, active snapshot, lease token or output directory. Cleanup failure is `infra_error`, blocks evidence qualification and cannot be counted as product pass.

## 8. Cross-data audit and formal §7 draft

| Audit | Result |
|---|---|
| 37 CUT data mapping | 37/37 |
| 31 state corpus | 31/31 identities + edge partitions |
| 48 protocol/job data | all exact identities |
| 13 external slots | finite negative/blocked scripts; positive dataset intentionally unavailable |
| 15 config slices | 15/15 through four config datasets |
| manual temporary data | none |
| nondeterministic time/ID | prohibited |
| real secret/body | prohibited; dummy canaries only |
| cleanup/isolation gap | none designed |

正式 §7 应说明：所有 P0 raw cases 由显式 manifest、stable seed、fixed clock、typed ID queues 和 current DTO/state/config builders 重复构造。negative、state、concurrency、fault、config 和 security 数据与 happy path 分离；external finite fakes 只证明 local branch。真实 positive qualification 当前没有数据集且明确 blocked。

```text
cut_data_stop_reviews = 37/37
manual_data_dependency = 0
positive_qualification_dataset = unavailable_blocked
actual_fixture_created = false
step_status = completed_continuous_authorized
next_step = Step 8
formal_05_write_allowed = false_until_step_15
```
