# Step 8. 定义状态机、事务与一致性验收

> 对应 SOP：`standards/document/验收标准讨论流程_SOP.md` Step 8\
> 正式回填：`06-验收标准.md` §8\
> 日期：2026-09-13\
> 状态：`completed / eighteen_states_and_consistency_gates_closed / continue_authorized`

## 1. Step 状态与 Step 内计划

| 项 | 结论 |
|---|---|
| 当前 Step | Step 8：定义状态机、事务与一致性验收 |
| 目标 | 将 18 个正式状态主语、UoW、CAS/read-set、claim fence、幂等、external effect、partial resume 和 Query snapshot 转成可判定 P0 门禁 |
| gate_status | `completed / eighteen_states_and_consistency_gates_closed` |
| gate_reason | 18/18 状态均有独立 AC；合法/非法边、状态不传播和副作用明确；事务/并发/幂等/effect 均闭环到 exact TC、EV 与 fixed report path |
| next_allowed_action | 按连续授权创建并完成 Step 9 |
| source_files | 正式 03 §8～12；03 Step 10～13；正式 05 §6/9～11/13；05 Step 6；Step 5～7 |

| 小阶段 | 产物 | 状态 | 完成门禁 |
|---|---|---|---|
| 8A | 18 状态 AC | done | 正式 enum/variant、合法/非法边、触发 flow 完整 |
| 8B | transaction/read consistency AC | done | atomicity、CAS、range/negative read、snapshot 明确 |
| 8C | idempotency/concurrency/effect AC | done | replay、fence、unknown、partial 明确 |
| 8D | 逐项停审 | done | evidence 和副作用无缺口 |
| 8E | 跨状态一致性审计 | done | 无全局成功状态、phase 越界或 outbox 假定 |

## 2. 本步输入与状态边界

状态名称只取正式 03 §9 的 18 个状态主语。`CompatibilityPosture`、`ManifestClosurePosture`、`CaptureCoveragePosture`、receipt/report disposition、DTO surface、runtime assembly、owner archived/restored/deleted 均不是本仓可迁移状态主语。不存在全局 `ArchiveSuccess` 状态。

所有实际状态裁决须同时满足：对应 TC 在 fixed run 中真实执行、state raw 与 same-run report/EV 配对、非法迁移时 self/version/history 不变、允许边的副作用与 UoW 一致。仅检查 enum 存在不能通过。

## 3. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 哪些合法迁移必须通过？ | 正式 03 §9 中 18 个主语的全部允许边；每个 `TC-AR-STATE-001～018` 必须 parameterize 全部正式允许边。 |
| 哪些非法迁移必须拒绝？ | 跳 stage、终态原地修复、旧 revision/fence 覆盖、ACK→commit、unknown→success、跨 owner 传播、Query 触发迁移，以及所有矩阵外边。 |
| 哪些事务必须原子提交？ | request/job/stage/result/reservation；consumer mapped history/receipt/result；local job truth/report/checkpoint/result；manifest fixed revision aggregate；每次 outcome/history/result 关系。 |
| 哪些幂等和并发行为必须成立？ | full structured key unique、same/same 完整 replay、same/different Conflict、Completed-result 必存、Reserved 不 timeout takeover、CAS/range/negative read-set、claim fence、per-owner CAS。 |
| 失败如何判定？ | 任一 P0 state/transaction/idempotency/effect AC failed/blocked/not-run 都不能通过；状态传播、盲重放、跨域写或断链可触发 Step 11 VETO。 |
| 是否有旧/口语/后续 phase 状态？ | 无；本 Step 排除 historical `Archived/Restored`、泛化 `Success/Pending` 和 outbound delivery state。 |
| 能否回指状态矩阵、flow、TC、EV、report？ | 可以，见 §7；每个状态 AC 对齐同序号 `TC-AR-STATE-*`，横切项对齐 UOW/IDEMP/EFFECT/QUERY。 |
| 是否逐项停审？ | 是；18 状态与 9 个横切一致性项均完成设计停审。 |
| 跨状态是否有名称漂移、phase 越界或副作用缺口？ | 未发现；local commit、external finality、owner truth 和 runtime entry 继续独立。 |

## 4. Historical material 诊断与改动前后对比

| 旧口径 | 问题 | 当前处置 |
|---|---|---|
| 单一 archive status | 压平 18 个独立状态轴 | 逐主语 AC，无全局成功状态 |
| `sealed/verified/restored` 连续主链 | 把局部结果传播为 owner/project truth | Sealed、Verified、Succeeded/HandoffComplete 各自受限 |
| retry after timeout | 不知道 effect 是否已发出 | local transaction probe 与 external exact probe 分离 |
| 后到结果覆盖 | 破坏 fence/revision/history | CAS + immutable input + append-only late observation |
| job completed 即业务完成 | runtime/aggregate 与 durable truth 混同 | WorkerEntry、JobAggregate、owner outcome 分离 |
| transaction 包住网络调用 | 锁与外部 finality 混淆 | Tx1 intent → Tx 外 port → Tx2 outcome |

## 5. 验收裁决取舍

| 议题 | 采用方案 | 未采用方案 | 理由 |
|---|---|---|---|
| 状态 AC 粒度 | 18 个主语逐项 AC | 合并为一个状态机 smoke | 防 enum/edge/副作用漂移 |
| compatibility/coverage | immutable classification，由对象/功能 AC 验 | 伪造迁移状态 | 它们以新记录表达变化 |
| local unknown | 只用 `ArchiveTransactionRef` exact probe | absence 当 rollback 后重做 | 防重复本地 mutation |
| external unknown | original effect key/input exact reconcile | timeout 当 failed 或直接 retry | 防重复不可逆副作用 |
| outbox | 当前断言不存在 | 假定事务内有 outbox | `AR-HLD-Q-001` 未关闭 |

## 6. 统一证据路径

| 证据族 | exact TC | suite report | EV |
|---|---|---|---|
| state | `TC-AR-STATE-001～018` | `reports/runs/<run_id>/suites/archive-contract-domain.md` | `EV-AR-STATE-001` |
| transaction / CAS / fence | `TC-AR-UOW-001～004` | `reports/runs/<run_id>/suites/archive-consistency-replay.md` | `EV-AR-UOW-001` |
| idempotency / partial | `TC-AR-IDEMP-001～004` | 同上 | `EV-AR-IDEMP-001` |
| external effect | `TC-AR-EFFECT-001～004` | 同上；formal 另见 `archive-formal-seam.md` | `EV-AR-EFFECT-001` |
| Query snapshot/no-write | `TC-AR-QUERY-001～005` | `reports/runs/<run_id>/suites/archive-service-flow.md` | `EV-AR-QUERY-001` |

以上均须出现在 `reports/runs/<run_id>/evidence-index.md`，并回指 `artifacts/test/<run_id>/...`；formal effect 只有 `proof_level=formal_seam` 才能证明真实 finality。

## 7. 结构化中间产物

### 7.1 十八个状态验收项

| 验收项 ID | 状态主语 / 触发 flow | 通过条件 | 失败条件 / 禁止传播 | exact 证据 | 裁决影响 |
|---|---|---|---|---|---|
| `AC-AR-STATE-001` | `RequestAdmissionState`；C01/C02 | none→`Accepted/Rejected/Blocked`，三者终态；basis/result 同 UoW | 终态原地修复；Accepted→archived/restored | STATE-001；STATE | 失败不得通过；传播可能 VETO |
| `AC-AR-STATE-002` | `JobAggregatePosture`；J01 | `Queued→Running↔Partial`，可 Blocked/Failed/Completed；仅 exact committed components 保守聚合 | 单项成功或 unknown 被聚合 Completed；Completed 重开 | STATE-002；STATE/JOB | 失败不得通过 |
| `AC-AR-STATE-003` | `ArchiveJobStage`；J01 | archive/restore 各自 ordered path，stage history append-only | 跳 stage、混 kind、把 Blocked/Failed 当 stage | STATE-003；STATE/JOB | 失败不得通过 |
| `AC-AR-STATE-004` | `SourceBindingState`；J02 | `Planned/Blocked→Bound` 需 exact authority/contract；可 Blocked/Retired | workspace fallback 使 Bound；Retired 复活 | STATE-004；STATE/AUTHORITY | formal basis blocked 时不得通过 |
| `AC-AR-STATE-005` | `CaptureAttemptState`；J03/J04/E02 | Requested/Blocked→InProgress→Settled/Blocked/Failed；replacement 可 Superseded | wrong fence/version、unknown settle、late 覆盖 replacement | STATE-005；STATE/AUTHORITY/EFFECT | formal positive blocked |
| `AC-AR-STATE-006` | `ArchiveBundleState`；J05/J06 | Draft/Blocked→Assembling→ClosureReady→Sealed；exact closure/assessment/placement basis | incomplete/old/ACK-only seal；Sealed→project archived | STATE-006；STATE/UOW | 假 seal/传播可能 VETO |
| `AC-AR-STATE-007` | `VerificationPosture`；J07/Q03 | Pending→InProgress→Verified/IntegrityFailed/Unknown/Blocked；重验新 assessment | fake/config/ref 造 Verified；终态原地覆盖 | STATE-007；STATE/JOB | formal capability blocked |
| `AC-AR-STATE-008` | `PlacementState`；J09/J12/E04 | IntentRecorded→Dispatched→Committed/CommitUnknown/Blocked/Failed；unknown exact probe | ACK/timeout→Committed；CommitUnknown 盲重派 | STATE-008；STATE/EFFECT | formal storage blocked；假 commit 可 VETO |
| `AC-AR-STATE-009` | `RetrievalState`；J10 | Unknown/NotRequested→Requested→Retrievable/Unavailable/Failed/Unknown | placement commit 推导 Retrievable；Unknown 产 material | STATE-009；STATE/EFFECT | formal retrieval blocked |
| `AC-AR-STATE-010` | `LifecycleExecutionState`；C03/J11/J12/E03 | Eligible→IntentRecorded→Dispatched→typed terminal/intermediate；decision/hold current；compensation 独立 | ACK=Committed；无 authority dispatch；Compensated 抹历史 | STATE-010；STATE/EFFECT | fail-open 可能 VETO |
| `AC-AR-STATE-011` | `ExternalActionPosture`；J09/J11/J12/E04 | intent、dispatch、ack/commit/unknown/fail 依 exact target/key/input append | target/key mismatch 接受；unknown 重派；覆盖 history | STATE-011；STATE/EFFECT | 断链/盲重放可能 VETO |
| `AC-AR-STATE-012` | `RestorePlanState`；J13/J16 | Draft/Blocked/Ready/InProgress/Partial/HandoffComplete/Failed/Superseded 保守聚合 frozen items | 隐藏 per-item unknown；HandoffComplete→restored；Superseded 复活 | STATE-012；STATE/RESTORE | 传播可能 VETO |
| `AC-AR-STATE-013` | `RestoreItemState`；J13～J17/E05 | Planned/Blocked→MaterialReady→HandoffPending/InProgress→逐项 outcome/compensation | 一 item 改其他 owner；Succeeded→project restored | STATE-013；STATE/RESTORE | 传播/跨 owner 写可能 VETO |
| `AC-AR-STATE-014` | `RestoreHandoffState`；J15/J16/E05 | IntentRecorded→Dispatched/Acknowledged→typed outcome/ReconcileRequired；exact reconcile | ACK=receiver commit；reconcile 重派；late conflict 覆盖 | STATE-014；STATE/RESTORE/EFFECT | formal receiver blocked |
| `AC-AR-STATE-015` | `CompensationState`；J17 | Planned→InProgress→Completed/Failed/CommitUnknown/Blocked；formal authority + probe | 无 authority 开始；Completed 改原 handoff 成功 | STATE-015；STATE/RESTORE | fail-open 可能 VETO |
| `AC-AR-STATE-016` | `ArchiveIdempotencyState`；C/E/J | absent→Reserved→Completed/Conflict；Completed 必有 immutable full result | timeout takeover；Completed 缺 result；Conflict/Completed 被改写 | STATE-016；STATE/IDEMP | consistency defect，断链可 VETO |
| `AC-AR-STATE-017` | `WorkerEntryState`；worker entry | Registered/Delayed→Running→Completed/Failed；可 Stopped；仅进程内 | 当 durable truth/claim/business success；私造 Blocked variant | STATE-017；STATE/JOB | 失败不得通过 |
| `AC-AR-STATE-018` | `WorkerClaimState`；worker control | none→Active→renew/Released/Expired/Superseded；每次写/effect校验 fence | old fence 写 truth/result/checkpoint/effect；expiry 推导 rollback | STATE-018；STATE/UOW | old-fence effect 可 VETO |

### 7.2 事务、幂等、并发与 effect 门禁

| 验收项 ID | 主题 / 设计契约 | 通过条件 | 失败条件 | exact TC / EV / report | 裁决影响 |
|---|---|---|---|---|---|
| `AC-AR-TX-001` | local UoW atomicity；03 §10.3 | truth/history/result/receipt/report/checkpoint/reservation complete 全部可见或全不可见 | 任一半提交、Completed-without-result、失败仍留 accepted truth | UOW-001；UOW；consistency report | 失败不得通过；断链可能 VETO |
| `AC-AR-TX-002` | create/CAS/read-set/immutable append | `Absent` 仅 create、`Exact` 仅 current version；guard/negative/range/fence 入 read-set；异内容 unique conflict | upsert/last-write-wins、phantom seal、hard-coded version、silent merge | UOW-002/004；UOW | 失败不得通过 |
| `AC-AR-TX-003` | Query committed snapshot/no-write | 一个 `ArchiveReadSession`；cursor 绑定 principal/visibility/selector/snapshot/order/kind；所有 write/effect=0 | 混 snapshot、私有 cursor 出站、cache/audit repair 或 external call | QUERY-001～005；QUERY | 失败不得通过；写入可 VETO |
| `AC-AR-TX-004` | external effect transaction split | Tx1 immutable intent commit→Tx 外 exact port→Tx2 typed outcome/history/result；不持锁跨网络 | intent 前调用、网络在 Tx 内、response lost 被当成功/失败 | EFFECT-001～004；EFFECT；consistency/formal report | formal blocked 时不得通过 |
| `AC-AR-TX-005` | local commit Unknown | stable `ArchiveTransactionRef` exact `probe_commit` 后读取原 result；unknown 可保持 | absence 当 aborted、重做 mutation、用 external probe 代替 local probe | UOW-003；UOW | 盲重做可能 VETO |
| `AC-AR-IDEM-001` | duplicate/conflict/result | same key+same canonical input field-equivalent replay；different input Conflict；Reserved one writer；Completed result必存 | 重算 current truth/effect、volatile field入 digest、timeout takeover、缺 result仍重跑 | IDEMP-001～003；IDEMP | 失败不得通过；造成功可 VETO |
| `AC-AR-IDEM-002` | partial resume | 新 operation key + explicit unresolved target set + old report/checkpoint ref；成功 target 零调用/零改写 | 扫描全量重跑、覆盖已成功、丢失原报告关联 | IDEMP-004；IDEMP | 失败不得通过 |
| `AC-AR-CONC-001` | claim/fence + per-owner CAS | old fence 的 truth/result/checkpoint/effect 全拒；lease 不替代 CAS；owner/item 独立 | stale worker 写入或派发；一 owner conflict 回滚/覆盖其他 owner | UOW-004、RESTORE-004；UOW/RESTORE | old-fence/cross-owner effect 可 VETO |
| `AC-AR-EFFECT-001` | dispatch knowledge/reconcile | `NotDispatched` 与 `MayHaveDispatched` 分开；后者只用 original effect key/input exact probe，NotFound 不等 no effect | timeout→Failed/Success；blind redispatch；ACK/commit/retrievable/receiver success 横向传播 | EFFECT-001～004；EFFECT；consistency/formal report | 失败不得通过；盲重放可 VETO |

`outbox/publisher/delivery state` 当前必须为 0；因此事务副作用断言是“没有 outbound effect”，不是等待一个不存在的 outbox 成功。

### 7.3 状态 / 事务验收项停审记录

| 范围 | 正式分母 | 合法/非法与副作用 | TC/EV/report | phase 边界 | 停审 |
|---|---:|---|---|---|---|
| business/source/assessment states | 7/7 | 完整 | fixed | local state 不传播 owner truth | 通过设计停审 |
| external-effect states | 4/4 | 完整 | fixed | ACK/commit/retrieval/unknown 分开 | 通过设计停审 |
| restore/handoff states | 4/4 | 完整 | fixed | per owner/item，不推导 restored | 通过设计停审 |
| idempotency/runtime control states | 3/3 | 完整 | fixed | runtime 不当 durable success | 通过设计停审 |
| TX/IDEM/CONC/EFFECT | 9/9 | atomic/zero-write/probe/replay/fence/partial 完整 | fixed | no outbox；formal positive blocked | 通过设计停审 |

### 7.4 跨状态一致性门禁审计表

| 审计项 | 结论 | 缺口 / 修正 |
|---|---|---|
| 18 状态主语 | 18/18；与正式 03 和 TC 同序 | 无旧/口语状态 |
| 合法边与非法边 | 全部以正式矩阵为准 | formal 06 不复制不存在的快捷边 |
| 状态传播 | 无全局 success；Accepted/Sealed/Verified/Succeeded/HandoffComplete 受限 | owner project state 不在本仓 |
| transaction relation | result/reservation/history/checkpoint 原子 | 无 Completed-without-result |
| Query | snapshot + telemetry 两姿态绝对 no-write | cursor pending 导致 continuation blocked，不 fallback |
| concurrency | CAS/read-set/fence/per-owner 隔离 | lease 不替代 CAS |
| unknown/replay | local/external probe 分离，partial 显式 target | 无盲重放 |
| external network | intent-before-effect，Tx 外调用 | 无跨网络持锁 |
| outbox | 正式分母为 0，absence 与 Step 7 一致 | 不假定 topic/delivery |
| evidence | exact TC/EV/fixed report 完整 | 实际 instance 仍为 0 |

## 8. 回填草稿

正式 §8 应回填 18 个状态 AC 和 9 个事务/一致性门禁，并保留统一证据路径。正文必须使用正式 enum variant，明确非法边副作用为零、local/external unknown 分离、Query no-write、same/same full replay、old fence zero effect、partial explicit subset、owner/item isolation 和 outbox absence。当前没有状态或事务执行结论。

## 9. 对上游影响与待确认事项

| 项 | 结论 |
|---|---|
| 03/05 回写 | 无；状态、flow、TC 与 EV 一致 |
| 新 blocker | 无 |
| 持续 blocker | durable store/codec/cursor/formal effects 继续受既有 blocker/pending 约束 |
| Step 9/10/11 | 非功能结构门禁、真实 evidence、状态传播/盲重放 VETO 继续加严 |

## 10. 进入 Step 9 条件

- [x] 18/18 状态主语均有可裁决 AC。
- [x] 合法/非法边、触发 flow、事务与副作用明确。
- [x] UoW、CAS/read-set/fence、幂等、unknown、partial、external effect 可裁决。
- [x] 逐项停审和跨状态审计无 unresolved 冲突。
- [x] 未新增全局成功状态、outbox 或无来源恢复动作。

当前 `gate_status`：`completed / eighteen_states_and_consistency_gates_closed`。

`next_allowed_action`：按连续授权创建并完成 Step 9。
