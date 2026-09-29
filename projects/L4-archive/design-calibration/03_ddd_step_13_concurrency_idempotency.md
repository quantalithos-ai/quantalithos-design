# L4-archive 03 Step 13：并发、幂等与重入保护

> 对应 SOP：`standards/document/详细设计讨论流程_SOP.md` Step 13
> 回填位置：未来正式 `03-详细设计.md` §12
> 日期：2026-09-12
> 状态：`completed / pass_with_local_pending_and_upstream_blockers / continuous_authorization`

## 1. Step 状态、输入与上限

| 项目 | 本 Step 结论 |
|---|---|
| 前置与授权 | Step 01～12 已完成；“完成全部 03”连续授权包含本步及 Step 14 |
| 输入 | Step 07 `ArchiveOperationKey`/UoW/claim/result ports；Step 08 三 Command、五 Consumer、十七 Job schema；Step 09 flows；Step 11 read-set/transaction；Step 12 recovery |
| 规范 | SOP Step 13、书写规范 §5.12、真相源标准 metadata/idempotency/UoW 与 duplicate replay 条款 |
| 参考 | `L1-governance` Step 13 的覆盖粒度、`L1-workspace` key/digest/fence 粒度；不复制其 outbox/projection/领域主语 |
| 目标 | 固定真实冲突资源、operation key namespace、canonical input field set、duplicate/in-flight/unknown/reentry/partial resume 语义及测试切口 |
| 不在本步 | hash/encoding crate、key retention window、retry次数/退避/抖动/超时、scheduler、DB锁实现、provider external key算法 |
| readiness 上限 | 本地契约可落码；`AR-UP-*` 与算法/config 未闭合前正向 external execution 仍 blocked |

## 2. SOP 问题回答与诊断

| SOP 问题 | 回答 |
|---|---|
| 哪些 flow 会并发修改同一资源？ | 三 Command admission/lifecycle intent，五 Consumer 的 capture/action/handoff/lifecycle observation，J01～J17 的 job/binding/attempt/bundle/assessment/placement/lifecycle/restore/result/checkpoint；Query 无写并发。 |
| 哪些可能重复？ | 所有 3 Command、5 Consumer、17 Job 都可能因 caller retry、redelivery、worker crash/lease loss/commit unknown 重复；外部 effect 还可能重复 feedback/probe。 |
| key 来自哪里？ | Command 来自 validated `CommandMetadata` idempotency key；Consumer 来自 trusted envelope `dedup_key`；Job 来自 `ArchiveJobMetadata.idempotency_key`；三者经 context 形成完整 `ArchiveOperationKey`。DB unique guard 不能代替 stored replay。 |
| duplicate 怎么处理？ | completed same key/same canonical input 返回完整 stored payload；different input 返回 Conflict 且原 record不变；Reserved 不允许第二 writer；Query 每次当前读取。 |
| 如何测试？ | 必须覆盖 parallel reserve、CAS/read-set/range phantom、fence loss、same/same replay、same/different conflict、result missing、local/external unknown、partial resume 与 fake/durable parity。 |

| 当前缺口 | 风险 | 裁定 |
|---|---|---|
| Step 08 将 digest 算法同时指向 Step 13/`AR-UP-004` | 容易把业务幂等摘要和 Bundle 完整性摘要混为一个安全算法 | `AR-UP-004` 只阻断 Bundle digest/signature；operation digest 为本地技术契约，但具体 canonical codec/hash/config 未被正式选择，保持 local pending/fail-closed |
| `ArchiveOperationKey` 语义已描述，canonical namespace 尚未集中列出 | store/fake 可能各自拼字符串 | 本步固定结构化字段，不固定字符串编码；缺统一 codec 时生产 reserve blocked |
| expected version 出现在 Job payload | caller 可能用 stale 值重入并覆盖 | expected 属 canonical input；必须来自 current versioned read；变化意味着新 invocation/key，不修改历史 result |
| external key/digest 与 application key/digest 并存 | 可能用一个 key 跨层去重 | 明确两套 namespace 独立；external key随持久 intent固定，不能由 run id/application key替代 |
| retry budget 未知 | 自动循环可能无限或提前失败 | 不设计自动 retry counter/RetryExhausted state；Step 14 配置 authority 前只允许显式 probe/reconcile/new invocation |

## 3. 统一 operation key、canonical input 与窗口

### 3.1 结构化 key

```rust
pub struct ArchiveOperationKey {
    pub scope: ArchiveDedupScopeRef,
    pub channel: ArchiveOperationChannel,
    pub operation_name: ArchiveOperationName,
    pub idempotency_key: ArchiveOperationIdempotencyKey,
}
```

| 字段 | 唯一来源 | 规则 |
|---|---|---|
| `scope` | Command 的正式 subject/scope；Consumer 的 source family+source identity；Job 的 persisted target | 不从 actor role、route、topic、ref 字符串或 fake map猜；无法构造即 ContractBlocked |
| `channel` | `ArchiveOperationContext::{from_command,from_inbound_event,from_job}` | `Command/InboundEvent/OperationJob` 隔离；Query 无 key |
| `operation_name` | Step 08 finite registry | E04/J12 routed branch由 persisted target决定，但仍保留同一 logical operation name；不从 handler类型猜 |
| `idempotency_key` | Command metadata、event dedup key、job metadata key 的受控 normalization | event id、run id、trace id、result id不得替代 |

唯一约束是完整结构体相等，不先将它拼为未定义字符串。key 的序列化/normalization codec 属 Step 14 local pending；codec 未确定时不能生产持久去重，但 fake 也不得私定编码。

### 3.2 Canonical input 规则

`ArchiveOperationInputDigest` 表示“稳定输入等价性”，不是 Archive Bundle digest、签名或 evidence。canonical input 是 typed tuple，先完成字段规范化和稳定排序，再交给未来绑定的 codec/digest capability；本步不选择 hash 算法。

统一包含：`channel + operation_name + scope + exact payload semantic fields + explicit selector/target variant + expected local versions + fixed authority/evidence refs + fixed source/receiver/storage effect identity`。

统一排除：idempotency key 本身、request/event/run/result/transaction/trace ID、occurred/recorded/current time、delivery attempt、retry counter、worker claim ID/holder/lease expiry、随机生成的 Archive object ID、public/repository cursor（除非 cursor 是该 Query 的只读输入；Query 不 digest）。

集合必须按 typed canonical key 排序并拒绝重复；`None` 与空集合、variant name 与 payload、optional evidence absence 都必须有不同编码。不能用 debug/JSON/URL/string concatenation 作为隐式 canonicalization。

### 3.3 3 Command canonical input

| Command | scope | 必须进入 canonical input | 排除 |
|---|---|---|---|
| C01 RequestArchive | declared archive subject/scope binding | `DeclaredArchiveScopeDto` 全部语义字段、authority ref、command variant | actor/trace/request time、新 request/job IDs |
| C02 RequestRestore | immutable Bundle + target owner set | bundle ref、排序后 owner set、restore authority ref | receiver mapping（由J13/J15解析）、新 request/job IDs |
| C03 RequestLifecycleExecution | bundle revision + governance decision scope | revision ref、decision ref、action kind | current decision lookup outcome、action/execution IDs |

### 3.4 5 Consumer canonical input

| Consumer | key scope | canonical payload | 重复窗口 / 处理 |
|---|---|---|---|
| E01 ArchiveTrigger | source family+event source | request scope、trigger kind、authority ref optional、event schema/source version | durable while receipt/result retained；same/same replay；arrival不等批准 |
| E02 SourceExportFeedback | source owner+attempt | binding/attempt、完整 typed feedback variant及body-free refs、source version/fence | late same key不同输入 Conflict/Quarantined；不覆盖 attempt |
| E03 GovernanceDecisionChange | governance source+decision | decision/revision/change kind/source version | replay receipt；新正式 decision event用新 dedup key |
| E04 StorageActionFeedback | storage source+action | action、typed target、feedback variant/evidence/correlation | persisted target二选一；same key异target Conflict |
| E05 RestoreReceiverFeedback | receiver source+handoff | handoff/item/owner、feedback variant/evidence/key/digest correlation | per-owner独立；success不推 restored |

窗口不写时间常量：只要对应 operation result/receipt 与被引用 Archive truth 仍受保留规则管理，reservation 不得先行丢弃。精确 retention 由治理决定和 Step 14/04 绑定；未闭合时不得清理幂等记录。

### 3.5 17 Job canonical input

| Job | stable target / canonical input（除共享 operation key 字段） | duplicate / new invocation 边界 |
|---|---|---|
| J01 AdvanceArchiveJob | job ref、expected job version、requested stage、排序 component postures+basis | same report replay；version变化需新 key |
| J02 PlanArchiveSources | request/scope/declaration version、排序 owner selectors | same binding plan replay；source合同变化需新 key |
| J03 CaptureArchiveSource | binding/attempt、完整 fixed capture input、expected attempt version | 不因 timeout换 key；unknown交 J04 |
| J04 ReconcileSourceCapture | attempt、expected version、probe ref、mode | 每次 formal probe是新显式 key；不 recapture |
| J05 AssembleBundleManifest | bundle/request、完整排序 binding+attempt sets、expected bundle version | new inventory/revision用新 key |
| J06 SealArchiveBundle | bundle/revision、完整 seal basis、expected bundle version | basis变化是新 key；旧 report不重算 |
| J07 AssessBundleIntegrity | revision、完整 verification binding、assessment ref optional、expected version | new assessment/fixed input用新 key |
| J08 AssessBundleCompatibility | revision、完整 target/schema selection、assessment ref optional、expected version | target/schema变化用新 key |
| J09 PlaceArchiveBundle | placement/revision、完整 storage intent/action、expected version | application key与 external key分离；unknown交J12 |
| J10 RetrieveArchiveBundle | placement/revision/retrieval action、expected version、probe context optional | 不因冷存等待生成重复 retrieval intent |
| J11 ExecuteArchiveLifecycle | lifecycle/revision/decision/action、expected version | 每次派发前重验决定；新决定/动作新 key |
| J12 ReconcileExternalAction | action、persisted routed target、expected version、probe ref、mode | 每次 formal probe新 key；P/L互斥 |
| J13 BuildRestorePlan | restore request/revision、冻结 owner set、expected plan/request versions | receiver outcomes是执行结果；mapping变化需新 plan revision/key |
| J14 PrepareRestoreMaterial | plan/item/revision/owner、完整排序 entry/source tuples、expected item version | material input变化新 key；旧material不覆盖 |
| J15 DispatchRestoreHandoff | item/material/receiver/handoff、完整 handoff input、expected item version | external receiver key独立固定；unknown交J16 |
| J16 ReconcileRestoreHandoff | handoff/item、expected version、probe ref、mode | probe-only；不重派 handoff |
| J17 ExecuteRestoreCompensation | compensation/handoff/item/authority/receiver/action、expected version | compensation external key独立；不借原 handoff key |

J13 receiver resolve outcome 不进入首次 operation digest，因为它是外部执行结果；但保存的 plan/item/result 必须包含 exact outcome/evidence。若希望针对新 mapping 重建 plan，必须以新 expected plan revision 与新 operation key 发起，不能让同一 invocation 的 replay随 current mapping变化。

## 4. 并发场景表

| 场景 | 冲突资源 | 控制方式 | 失败错误 | 测试切口 |
|---|---|---|---|---|
| 同一 non-Query 入口并发 | operation-key reservation/result | atomic unique reserve；same digest只一个writer | Existing/Replay/Conflict | parallel same/same exactly-one body |
| 同 request 并发创建 job | request→job unique relation | negative read + unique guard + same UoW | UniqueConflict/ConsistencyDefect | no two jobs per request |
| job/stage并发推进 | ArchiveJob + `(job,ordinal)` | current version CAS + stage unique + range read-set | VersionConflict | no skipped/duplicate stage |
| 同 source binding plan/retire | binding identity/replacement | selector uniqueness、CAS、negative guard | Conflict/InputMismatch | no duplicate active binding |
| capture feedback vs reconcile/replacement | attempt/input/final inventory | attempt CAS、immutable sidecar、one final inventory | VersionConflict/Conflicting | late feedback preserves history |
| manifest assembly并发 | bundle current revision、entry/closure set | bundle CAS、revision/entry unique、complete range predicate | VersionConflict/ClosureIncomplete | phantom required source blocks seal |
| assessment duplicate/late result | assessment identity+fixed input | immutable key/input uniqueness；new input new ref | InputConflict | no cross-target reuse |
| placement/lifecycle feedback vs probe | action/target/observation | action CAS + immutable effect input + append observation | VersionConflict/CommitUnknown | ACK/commit conflict retained |
| legal hold变化 vs lifecycle dispatch | current decision/hold + action intent | dispatch前 current check；commit前 guard read revalidation | ContractBlocked/Conflict | new hold prevents dispatch |
| restore plan并发 build | request/plan revision/item exact set | transactional ordinal + unique revision + owner range read | VersionConflict/InputConflict | complete frozen owner set |
| material/handoff/feedback并发 | item/handoff/outcome/material | per-item CAS、effect unique、append outcome | VersionConflict/Conflicting | owner isolation/no overwrite |
| compensation vs late success | handoff/item/compensation | exact current refs + append-only history + CAS | Conflict/CommitUnknown | original success not erased |
| worker lease loss during UoW | claim/fence/business target | `protect_with_claim` at commit | FenceRejected/StaleClaim | old worker cannot commit |
| different jobs same target | business target exclusion group | WorkerLeasePort target lock + store guard/read-set | ClaimUnavailable/VersionConflict | lease alone never replaces CAS |
| Query vs mutation | committed read snapshot/current disclosure | one snapshot、no write、output disclosure recheck | SnapshotExpired/NotAvailable | no mixed revision/page |

## 5. 重复与 in-flight 处理矩阵

| Reservation / evidence | 当前调用 | 返回 | 是否执行 body/effect |
|---|---|---|---|
| absent | valid canonical input | create Reserved；成为唯一 writer | yes，按 flow |
| Reserved same key/digest | duplicate caller/worker | Existing/Delayed；读取 transaction/intent/checkpoint | no second writer |
| Reserved different operation/digest | key reuse | Conflict；原 reservation不变 | no |
| Completed same key/digest + result complete | duplicate | Replay 完整 immutable response/receipt/report；出站重验 disclosure | no |
| Completed same key/digest + result missing/wrong | consistency defect | ResultMissing/CorruptRecord | no |
| Completed different input | key reuse | Conflict；原 result保留 | no |
| original local commit Unknown | retry | transaction probe→exact reservation/result read | unresolved时 no |
| committed external intent + no definite result | worker restart | read intent/effect key；走对应 probe/reconcile | no redispatch |
| definite NotDispatched + policy允许 | explicit retry/reconcile operation | 使用原 fixed external input/key；新 application result | only after formal safety check |
| partial prior report | resume | new key + explicit unresolved target set + old report/checkpoint ref | only unresolved targets |

`ArchiveIdempotencyRecord::mark_conflict` 只处置被正式证明本身非法的 Reserved record；新到异 digest 永远不调用它。Reserved 不设置超时后自动抢占，因为 lease/time 不能证明原 transaction/effect 未发生。

## 6. 重入保护表

| 场景 | 重入来源 | 保护方式 | 恢复方式 |
|---|---|---|---|
| Command response丢失 | client retry | operation key/digest + stored result | replay；current disclosure可收紧输出但不改原payload |
| Consumer ACK丢失/redelivery | bus redelivery | envelope dedup key + complete receipt | replay receipt；local commit未决不ACK完成 |
| Job crash before intent commit | worker crash | transaction probe；无 committed intent且Aborted才可新 run | reacquire claim，用新 job key或正式same-key恢复规则 |
| Job crash after intent before external call | restart | persisted intent/fixed input/checkpoint | 先确认该 port尚未调用；无法证明则保守probe/manual |
| Job crash during/after external call | timeout/process loss | immutable effect key/input + CommitUnknown | J04/J12/J16/probe；不换 key dispatch |
| Worker lease过期 | scheduling race | commit fence + CAS/read-set | 新 worker读完整 result/checkpoint/intent |
| Late feedback | delayed event | event key + exact effect correlation + append-only history | duplicate replay或存conflict finding，不覆盖 |
| Partial multi-item execution | bounded failure | report逐项refs + continuation + checkpoint | new invocation显式选未决项；不扫描重做已成功项 |
| Receiver mapping变化 | owner contract drift | J13 fixed mapping + J15 current resolve exact-match | Blocked；新 plan revision/new handoff intent |
| Config/provider变化 | deployment drift | fixed sidecar and adapter binding ref | 原 intent继续用原 binding或Blocked；不按current config重构 |
| Query cursor重放 | caller retry/actor change | cursor绑定principal/selector/snapshot/order/model | mismatch/expired拒绝；重新首读 |

J02 `bind_source` 没有 probe，且其 may-have-dispatched 无法借 capture probe判定：未知时保持 Blocked/Unknown，只有 owning contract新增正式 bind probe或人工正式处置后才能再绑定。

## 7. 外部 effect 与 application 幂等隔离

| effect family | external unique identity | 必须固定 | Unknown 后动作 |
|---|---|---|---|
| source bind/capture/material | owner+contract+binding/attempt/material operation key | exact request/scope/selector/fence/input | bind无probe→Blocked/manual；capture→J04；material按formal source能力 |
| storage place/retrieve/lifecycle | capability+target+action+external key | revision、operation、attempt、digest、policy/decision proof | J12 exact probe；不新 key绕过 |
| restore handoff | owner+receiver+item+material+receiver key | plan revision、eligibility、material、receiver evidence、digest | J16 probe；per-owner独立 |
| compensation | owner+receiver+compensation ref+independent key | original handoff、formal authority、action、digest | probe_compensation/manual；不复用handoff key |

application operation Completed 只说明其本地完整 result 已提交；external effect 可以在该 result 中是 `CommitUnknown`。后续 reconcile 是新的 application operation，但使用原 external key/input 查证；两层状态不得合并。

## 8. 测试切口与 fake/durable parity

| ID | 测试切口 | 核心断言 |
|---|---|---|
| TC-AR-CONC-001 | parallel reserve same/same | 一个 writer；其余 Existing/Replay；body一次 |
| TC-AR-IDEM-001 | same key/different canonical field | Conflict；原 reservation/result byte-equivalent |
| TC-AR-IDEM-002 | duplicate complete result | 返回原完整 item/details/recorded_at，overlay不改存储 |
| TC-AR-IDEM-003 | Completed result missing/wrong kind | ResultMissing/CorruptRecord；零 mutation/effect |
| TC-AR-CONC-002 | two expected versions | stale writer abort；无 last-write-wins |
| TC-AR-CONC-003 | range phantom during closure | manifest/seal commit失败，不漏 required source |
| TC-AR-FENCE-001 | lease expires before commit | old worker business/result/checkpoint全不提交 |
| TC-AR-REENTRY-001 | crash at each intent/effect/finalize boundary | readback决定；unknown无blind dispatch |
| TC-AR-EFFECT-001 | adapter MayHaveDispatched | CommitUnknown + exact reconcile only |
| TC-AR-RESTORE-001 | two owners concurrent outcomes | 一 owner失败/unknown不改另一 owner |
| TC-AR-RESTORE-002 | receiver mapping drift | J15不创建/派发新 intent；new plan required |
| TC-AR-QUERY-001 | mutation between pages | snapshot/cursor mismatch拒绝，不混页、不写 |
| TC-AR-PARITY-001 | same scripted race in fake/durable | reservation/CAS/read-set/fence/result语义一致 |

这只是未来 Step 16 的测试设计输入，不是已执行测试。由于 codec/hash/retention/retry budget未绑定，相关生产正向测试必须标 blocked，不得在 fake 使用方便默认值。

## 9. 回填草稿、待确认与完成门禁

正式 §12 回填：保留 §3 的 key/canonical input规则与 3+5+17 矩阵、§4并发资源、§5 duplicate matrix、§6重入保护、§7外部 effect隔离和 §8 测试切口。不得把 key编码、digest算法、window时长、retry budget写成既定值。

| 待确认 | owner / 影响 | 当前姿态 |
|---|---|---|
| operation key normalization/canonical codec/digest binding | 本项目 Step14/04 + security/config authority | local pending；production reserve fail-closed |
| idempotency/result retention window | governance/retention owner | 无时间常量；不得提前清理 |
| retry/backoff/attempt/deadline budget | runtime/config/workload authority | 无自动循环；显式 reconcile only |
| external effect key/probe support | `AR-UP-001/005/009` owners | fixed intent；unsupported保持Blocked/Unknown |

持续 blocker `AR-UP-001~009`、`AR-ARCH-001`、`AR-HLD-Q-001~002` 不变，无新增跨仓 blocker ID。本地 pending 进入 Step 14，不代表可实施默认。

| 完成门禁 | 结果 |
|---|---|
| 并发场景表 | pass |
| 3+5+17 key/canonical input | pass_with_local_codec_pending |
| duplicate/in-flight/result replay | pass |
| external unknown/reentry | pass_with_upstream_blockers |
| test cut mapping | pass_at_design |
| formal 03 写入 | not allowed until Step 19 |
| 下一动作 | 按连续授权进入 Step 14 |

本 Step 未实现代码、未执行测试、未生成真实 digest/result/report/evidence/verdict/readiness、未提交 commit。
