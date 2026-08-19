# Step 4. 抽取实施对象、路径与交付物

> 对应 SOP：`standards/document/实施计划讨论流程_SOP.md` Step 4
> 回填目标：正式 `07-实施计划.md` §4
> 本步状态：`completed / pass-designed-with-L2R-LANG-002`

## 1. 本步目标与输入

本步把正式 03 的能力、技术层、Loop Kernel、协议、状态、事务和 Port 真相转译为“实现者需要创建或修改的对象和交付物”。本步不决定 Phase 顺序（Step 5）或 commit boundary（Step 6），也不创建目标实现仓文件。

输入为正式 `03-详细设计.md` §3~§16、`04-配置设计.md` §3~§14、`05-测试方案.md` §3~§14、`06-验收标准.md` §3~§14 及 Step 3 的 Required Reads。旧 Step 4 的 `18 state / 12 suite / 4 check / 109 slot` 已 reject；当前分母以 Step 3 表为准。

## 2. 对象分层：七个技术层与一个显式 Loop Kernel

Loop Kernel 是跨能力的应用协调内核，不是第八个业务 owner，也不是独立 truth store。它横跨 `domain` 的纯规划对象和 `application` 的 T1/T2/T3 service；必须在对象清单中单独列出，避免实现者把 runtime loop 递归散落到各 capability service。

```text
entry (api / worker / jobs)
        |
        v
contracts ---- typed DTO/ref/envelope ----> application facade
        |                                      |
        v                                      v
domain objects <---- pure rules ---- loop kernel (plan / reserve / invoke / apply)
        |                                      |
        +---------------- local truth --------+
                                               v
                                         infra Ports/adapters
                                               |
                  runtime/ref | event | adapter | fake seams
        +-------------+-----------+-------------+---------------+
     Tools       Hub/Method/Gov   Model/Memory   Sandbox/Obs/Bus
```

| 层/对象族 | 所有权 | 必须交付 | 禁止承接 |
|---|---|---|---|
| `contracts` | Runtime wire contract candidate | IDs/refs、metadata、reasons/errors、17 C、12 Q、6+6 E、7 J、views/envelopes | repository、clock、adapter body、业务状态迁移 |
| `domain` | Runtime local truth | aggregate/value object、四轴状态、policy、transition、loop planner objects | I/O、async runtime、外部 owner truth |
| `application` | orchestration and UoW order | EntryAuthority、service、Loop Engine、Ports、idempotency、error mapping | 具体 DB/broker/provider、递归调用下一个 loop operation |
| `infra` | Port implementation seam | repository/UoW、CAS、inbox/outbox、lease/page、projection、builder、blocked fake | 业务决策、正向 qualification、owner body |
| `api` | protocol entry | decode/validate/facade/safe response | direct repository/domain writes、authority inference |
| `worker` | event entry | envelope decode、inbox reserve、consumer、ACK-after-commit | ACK before local receipt、direct Sandbox/Tools call |
| `jobs` | bounded operations | J01~J07 page runner、lease/cursor、status-only reconcile | scheduler/container lifecycle、unbounded retry |
| `loop kernel` | local coordination only | cursor/snapshot/activation/step/wakeup/continuation/yield/reservation、planner、T1/T2/T3 | capability truth、external call、second global state manager |

## 3. Planned workspace、文件与模块对象

以下是正式 03 §4 的 planned path；路径存在不代表仓已创建。文件名必须表达职责，不能用顶层 `utils.rs`、`manager.rs` 或 `helper.rs` 桶文件。

| package / crate | planned modules and object groups | 交付状态 |
|---|---|---|
| `runtime-contracts` / `runtime_contracts` | `ids_refs.rs`、`metadata.rs`、`reasons.rs`、`commands.rs`、`queries.rs`、`events.rs`、`jobs.rs`、`views.rs`、`errors.rs` | `not_created` |
| `runtime-domain` / `runtime_domain` | `run.rs`、`goal_plan.rs`、`history.rs`、`source.rs`、`context.rs`、`memory.rs`、`model.rs`、`action.rs`、`delegation.rs`、`feedback.rs`、`checkpoint.rs`、`recovery.rs`、`outcome.rs`、`handoff.rs`、`projection.rs`、`policies.rs`、`loop.rs`、`loop_kernel.rs`、`wakeup.rs`、`continuation.rs` | `not_created` |
| `runtime-application` / `runtime_application` | `facade.rs`、`operation_context.rs`、`idempotency.rs`、`errors.rs`、`loop_engine.rs`; `ports/{clock,identity,digest,repositories,unit_of_work,lease,loop,external,events,projection,config}.rs`; `services/` named by C/Q/E/J | `not_created` |
| `runtime-infra` / `runtime_infra` | `repositories/`、`unit_of_work.rs`、`inbox.rs`、`outbox.rs`、`idempotency.rs`、`loop_state.rs`、`lease.rs`、`projection.rs`、`config.rs`、`builder.rs`、`adapters/`、`fakes/` | `not_created` |
| `runtime-api` / `runtime_api` | `command_handlers.rs`、`query_handlers.rs`、`routes.rs`、`errors.rs` | `not_created` |
| `runtime-worker` / `runtime_worker` | `consumers.rs`、`continuation.rs`、`errors.rs` | `not_created` |
| `runtime-jobs` / `runtime_jobs` | `runners.rs`、`rebuild.rs`、`refresh.rs`、`compact.rs`、`resume.rs`、`reconcile.rs`、`publish.rs`、`errors.rs` | `not_created` |

候选 binary 为 `runtime-api`、`runtime-worker`；job binary 只有在正式 03/entry contract 确认后才能命名。任何 `L2`/`l2_` 泄漏、额外 sibling path dependency 或未经确认的 binary 都是 implementation Design Gate 失败。

## 4. Loop Kernel 对象与实现闭合

| 对象 | planned owner/path | 构造输入 | 关键不变量/写权 | 关联状态/测试 |
|---|---|---|---|---|
| `RuntimeLoopCursor` | domain `loop.rs` | committed anchor、activation、versions、budget、lease epoch | 只由 T3 前进；旧 epoch/stale version 拒绝 | SM-25/26/27/28/29/30；CUT loop |
| `LoopSnapshot` | domain `loop.rs` | 同一 committed anchor 的 run/plan/context/memory/model/action/effects/wakeup heads | 不持久化为第二 aggregate；禁止 projection-current 猜 truth | SM-25~30、TX-001/002 |
| `NextOperationKind` / `NextOperationDecision` | domain `loop_kernel.rs` | snapshot、control posture、wake condition、budget | 封闭 enum；无 `execute_any`/字符串 dispatch | SM-25/26、CAP loop cases |
| `LoopActivation` | domain `loop.rs` | run ref、lease binding、activation budget | 每 run 至多一个 Executing；activation budget 不重置 run budget | SM-25/26、lease cases |
| `LoopStep` | domain `loop.rs` | operation identity、expected versions、input digest | T1 prepare -> T2 one service -> T3 apply；结果不可从 current aggregate 重建 | SM-26/27/28、UoW crash cases |
| `RuntimeWakeup` / `ClaimedWakeupBatch` | domain `wakeup.rs` | event/fact identity、condition、digest | claim 不等于 consume；duplicate/coalesce/quarantine 有显式状态 | SM-28/29、inbound event cases |
| `LocalContinuation` / `HardYield` | domain `continuation.rs` | source step、next decision、cursor/fence、wait condition | no-progress 不 self-wakeup；stale delivery no-op | SM-28/29、recovery/job cases |
| `OperationReservation` | domain `loop_kernel.rs` | operation identity、request digest、expiry | same digest replay typed result；different digest conflict；expiry 不删除 uniqueness | SM-30、replay families |
| `RuntimeLoopApplicationService` | application `loop_engine.rs` | typed ports + capability service traits | 只执行一项 operation；处理 T1/T2/T3、lease、replay、yield | loop flow/CUT/state/fault suites |
| `LoopStateRepositoryPort` 等 | application `ports/loop.rs` | CAS/version/epoch/reservation refs | adapter-neutral；Unknown 必须保留 | TX-001~010、dependency checks |

## 5. Capability 交付对象（CAP-01~12）

| CAP | Runtime-owned object set | service/flow surface | 外部消费但不拥有 |
|---|---|---|---|
| CAP-01 Shared vocabulary | `RuntimeScope`、correlation、metadata、`SafeReason`、`OperationContext`、clock/ID/digest contracts | common mutation/query envelope | Core IDs/codecs（待兼容验证） |
| CAP-02 Admission & Control | admission decision、`ControlledRun`、control decision、history record | C01/C02 + SM-01/02 flows | Governance approval/policy truth |
| CAP-03 Goal & Plan | workspace、revision、item、dependency、proposal、progress | C03/Q03 + loop plan operations | Method definition/ref |
| CAP-04 Context Composition | source snapshot、candidate、budget、segment、`WorkingContext`、use/exclusion | C04/Q04/C17/E04/J02 | Hub registry/descriptor、source owner |
| CAP-05 Memory mediation | working memory/window/entry/compaction/use; episodic/semantic refs/gaps | C05/Q05/J03 + memory seam | durable memory body/index/retention |
| CAP-06 Model decision | intent、binding、materialization ref、turn、submission、result、decision | C06/C07/Q06/E01 + model adapter | provider route/secret/quota/cost/raw body |
| CAP-07 Action orchestration | choice、five owner views、guard、precondition、attempt、marker、feedback | C08/C09/Q07/E02 + internal submit | L2-tools execution/receipt/Sandbox truth |
| CAP-08 Sub-agent | request、strict context boundary、budget、child result | C10/Q08/E03 + child handoff | member-service lifecycle/container/images |
| CAP-09 Feedback/reflection | ordering key、incorporation、reflection decision/trigger | C11 + E02/E03 + loop wakeup | owner feedback source truth |
| CAP-10 Checkpoint/recovery | candidate、prepared/commit receipt、fence、decision、continuation/lease | C12~C14/Q09/J04/J05 | physical checkpoint product/atomicity (`L2R-CP-001`) |
| CAP-11 Local outcome | terminal proof、unique `RuntimeOutcome` | C15/Q10/O04 | downstream acceptance/Observed |
| CAP-12 Handoff/projection | safe material、attempt、ack/gap、outbox、projection/cursor | C16/Q11/Q12/E06/O01~06/J01/J06/J07 | Bus delivery, Observability backend, Artifact evidence truth |

每一项都必须在后续 boundary 中回答 constructor、field source、validation、write set、UoW、expected version/idempotency、failure recovery、test cut、check 和 evidence status。无法回答时不得激活 boundary。

## 6. 固定协议与状态交付物

| 交付族 | canonical set | 需要创建的对象/流程 | 当前状态 |
|---|---|---|---|
| Commands | C01~C17 | typed request/result、facade entry、named service、replay/conflict/UoW path | planned/not_created |
| Queries | Q01~Q12 | visibility-first view、cursor/freshness、zero-write service | planned/not_created |
| Inbound events | E01~E06 | envelope、inbox reserve、ordering/dedupe/late/mismatch consumer | planned/not_created |
| Outbound events | O01~O06 | commit-time immutable material、outbox record、publisher/replay port | planned/not_created |
| Jobs | J01~J07 | bounded request/report、lease/page/cursor、partial/Unknown behavior | planned/not_created |
| States | SM-01~SM-31 | canonical enum/object owner、legal/illegal/stale/replay/Unknown transitions | planned/not_created |
| UoW | TX/UOW-01~07 | write-set and crash windows、CAS/fence/inbox/outbox order | planned/not_created |
| replay | REPLAY-01~06 | same/different digest、stored result、corruption/Unknown/expiry | planned/not_created |

状态不能合并为全局 `StateManager`；四轴 `FactoryPhase/DomainState/Disposition/Posture` 保持分离。Loop Kernel 的 SM-25~30 必须在 Step 5 中获得独立 phase/boundary 覆盖。

## 7. 配置、外部 slot 与测试/验收交付物

| 类别 | canonical output | 交付内容 | 状态 |
|---|---|---|---|
| config roots | 12 roots / 153 leaves / 39 derived | strict schema、source/profile/snapshot、whole-candidate validation、activation/failure posture | not_created |
| external slots | SLOT-01~13 | identity、owner、direction、schema、status、Disabled/Blocked/Candidate；不出现 Ready | not_created |
| CUT | 37 | CUT registry 与 owning module/flow/negative seam | planned |
| TC/EV | 172 raw + 5 aggregate = 177 | explicit manifest、one raw owner、same-run derivation | planned_not_generated |
| suites | 8 owning suites，counts `35/32/32/16/25/15/17/5` | runner selector、raw writer、aggregate-only local_e2e | planned_not_created |
| mandatory checks | 9 | source/denominator/dependency/forbidden/fake/status/redaction/pairing/no-static | planned_not_created |
| acceptance | 36 AC / 8 VF / 19 NFR | trace/handoff/veto/risk draft；不生成 verdict/signoff | planned_not_created |

G2/G3 positive slot identities、real owner evidence 和 product readiness 不属于本地 177 交付物；其状态固定为 `blocked_dependency/not_evaluated` 直到 owner-qualified run。

## 8. 交付物状态边界

```text
planned contract
  -> source/test/script implementation (future)
  -> fixed-run raw (future)
  -> same-run report/index (future)
  -> review-required acceptance drafts (future)
  -> authorized verdict/signoff (outside implementation plan)
```

当前所有 source/config/test/script/artifact/report/evidence/acceptance output 均为 `not_created` 或 `not_generated`。文件、目录、fake、Candidate、ping、设计表和 planned identity 不能升级为 implementation、run、evidence、accepted 或 ready。

## 9. Step 门禁与下一步

| 检查 | 结论 |
|---|---|
| 七技术层职责与 Loop Kernel 独立对象边界 | `pass-designed` |
| 12 CAP 对象/流程/外部 owner 边界 | `pass-designed` |
| 17/12/6/6/7 protocol 与 31 state/UoW/replay 交付物 | `pass-designed` |
| 12 config roots、13 slots、37 CUT、177 TC/EV、8 suite、9 checks | `pass` |
| source/config/test/script/artifact/report/evidence status 未伪造 | `pass` |
| formal 03 Rustdoc 冲突 | `L2R-LANG-002` 继续作为 activation blocker |
| target repo/implementation ledger/skeleton | 仍 absent；只允许 Step 13 创建 |

```text
step_04 = completed
next_allowed_action = rebuild_step_05_phase_graph
formal_07_write_allowed = false
implementation_status = not_started
```
