# L4-observability 06-验收标准 Step 08：定义状态机、事务与一致性验收

## Step 状态

| 字段 | 当前值 |
|---|---|
| project / document | `L4-observability` / `06-验收标准.md` |
| step | `08 / 定义状态机、事务与一致性验收` |
| mode | `full-restart` |
| status | `completed_current_design_record_with_inherited_affected_open` |
| current_module | `formal_state_uow_idempotency_concurrency_recovery_gates` |
| formal_document_write | `not_allowed_until_step_15` |
| real execution | `not_run`;本 Step 只定义未来一致性裁决 |
| new_upstream_blocker | `none` |
| inherited blocker / affected | 12 项保持开放，见 §10 |
| gate_status | `pass_for_state_tx_consistency_design` |
| next_allowed_action | `start_current_06_step_09` |
| commit | 不需要；用户未要求提交 |

本文件替换同名旧模板。旧模板没有使用 27 个 current formal state owner、technical item state、accepted UoW
顺序、atomic reservation、source ordering、claim/fence、external split transaction 或 typed recovery，不能构成一致性门禁。

## 1. 本步目标、输入与计划

### 1.1 目标

把 `03` §9~§12 的状态、事务、一致性、错误恢复、并发、幂等和重入契约转成可判定门禁。状态门禁必须同时
断言 exact from/to、trigger、native record/history、outbox/stale/result 副作用以及非法分支零写；技术协调状态不得
冒充第 28 个业务/投影 truth owner。

### 1.2 输入

| 输入 | 本步使用 |
|---|---|
| 验收 SOP Step 08 / 书写规范 §5.8 | 状态、事务、幂等、并发、停审和跨状态审计 |
| Step 01~07 | baseline、31 AC、数据红线、60 protocol 与 cross-repo seam |
| `03-详细设计.md` §8~§12 | flow、27+1 state、UoW、error/recovery、idempotency/claim/fence |
| `05-测试方案.md` §6~§7、§9~§14 | state corpus、UOW/REB/RET/RPT tests、suite/lane/evidence |

### 1.3 Step 内计划完成情况

| 计划项 | 产物 | 状态 |
|---|---|---|
| 固定状态共同规则和 27+1 inventory | §4~§5 | done |
| 逐 owner 定义 legal / illegal / side-effect / evidence | §5 | done |
| 定义 accepted UoW / rollback / cursor / projection consistency | §6 | done |
| 定义 idempotency / concurrency / external / recovery | §7 | done |
| 完成停审、跨一致性审计、回填草稿和 gate | §8~§13 | done |

## 2. SOP 问题回答

| 问题 | Current 回答 |
|---|---|
| 哪些合法状态迁移必须通过 | `03` §9 明确可调用的 factory / transition 全部通过；每个 owner 至少有合法、非法/terminal/reserved 和副作用断言。 |
| 哪些非法迁移必须拒绝 | terminal reopen、reserved phase、wrong owner/ref、missing guard、older source、stale version/fence、outcome 当 state 等均 typed reject 且零写。 |
| 哪些事务必须原子 | accepted Command/Consumer、owner+history+index+outbox+stale+result+completion、projection composite、Job start/item/finalize、local external intent/finalize。 |
| 哪些幂等/并发行为必须成立 | actor-scoped reservation、same digest replay、different digest conflict、in-flight single writer、source-event secondary identity、CAS/cursor、immutable plan、monotonic fence、same-token probe。 |
| 失败时如何判定不通过 | partial commit、blind retry、duplicate二写、stale claimant提交、unknown猜成功、false Fresh、source truth write 或关联 VF 触发。 |
| 是否存在旧/口语/后续状态 | 无；只使用 current exact variants。Accepted/Rejected outcomes、availability 和 technical item state 不计入 27 formal owners。 |
| 是否回指状态/flow/evidence | 27+1 行均回指 `03` §9/§10、trigger family 和 exact TC/candidate EV。 |
| 跨状态冲突 | 无 unresolved 命名/phase冲突；inherited UoW/recovery/external/consumer/report gaps 继续 conditional。 |

## 3. 问题诊断与裁决取舍

| 旧写法 / 方案 | 结论 | Current 处理 |
|---|---|---|
| 只检查最终状态值 | 拒绝 | 必须同时检查 trigger、expected version、history/outbox/stale/result 和零写分支 |
| 同名 Pending/Failed/Blocked 自动传播 | 拒绝 | variant 只在 exact owner 内成立，不跨对象推导 |
| `Accepted` / `DuplicateReplayed` 当 lifecycle state | 拒绝 | 它们是 protocol outcome，不建立 state repository |
| Job item state 算第 28 个 formal truth owner | 拒绝 | 它是 application technical coordination state，只服从 plan/claim/fence/report |
| duplicate 从 current truth 重建 response | 拒绝 | 只能读取 compatible immutable stored result/report |
| commit unknown 直接重跑 | 拒绝 | 先 probe reservation/result/marker；unknown 保持 indeterminate/manual |
| external call 放在长事务中 | 拒绝 | intent commit -> call/probe outside tx -> short local finalize |

## 4. 状态门禁共同规则

| Gate | 通过条件 | 失败条件 | Evidence |
|---|---|---|---|
| `ST-OBS-001` exact owner/variant | state 名逐字来自 `03` §9，same-name variant不跨 owner；owner count 27 | alias/口语状态、outcome/availability误作 owner、第 28 owner | contract/domain state corpus + `HIST-*` |
| `ST-OBS-002` legal transition | formal factory/trigger、exact from/to、guard 与 expected version 成立 | application 直接改字段、missing guard、wrong owner/version | domain + service rows、state DS |
| `ST-OBS-003` illegal/terminal/reserved | typed error；owner/version/history/outbox/stale/result 不变 | silent no-op、terminal reopen、reserved action落盘 | negative state corpus + UoW before/after |
| `ST-OBS-004` side-effect parity | accepted state change与 native history/index/applicable outbox/stale/result 同 UoW | owner单独提交、generic log替代 history、outbox来自 old/current state | `UOW-001~002`,`AUD-004`,`RET-004` |
| `ST-OBS-005` Query no-state | Query只投影 committed state，write capability/spy=0 | miss/stale/unavailable时推进 state/rebuild/refresh | `QRY-001~004`,`NW-001/005` |
| `ST-OBS-006` recovery identity | terminal recovery按正式规则创建新 object/scope/execution/preparation | 原对象历史被改写或 terminal 状态回退 | state negative + `REB/RPT/UOW` recovery rows |

## 5. 27 个 formal state owner 与 1 个技术协调状态

### 5.1 Observation truth / safety：6 个 owner

| # / owner | 合法迁移门禁 | 非法 / terminal / reserved 门禁 | 必须副作用 | Exact TC / candidate EV |
|---|---|---|---|---|
| 1 `ObservationReceiptState` | factory->Received；Received/Degraded按 guard -> Accepted/Rejected/Quarantined/Degraded | Rejected/Superseded terminal；Superseded current reserved；Accepted不能回Received | receipt + intake decision + source index + applicable E01/result | `ING-001/002`,`RED-002`,`UOW-001/002` / matching EV |
| 2 `SafetyDispositionState` | Pending -> Safe/Redacted/Rejected/Quarantined；Quarantined -> Rejected | Safe/Redacted/Rejected terminal；marker-summary不兼容拒绝 | disposition + decision + applicable E02/stale/result | `RED-001/002/004`,`UOW-001/002` |
| 3 `CorrelationContextState` | Unbound/Partial -> Bound；formal Partial/Invalid；Bound保态 append link | Invalid terminal；source mismatch/opaque relation冲突拒绝 | context + correlation link + stale/result | `COR-001~003`,`UOW-001/005` |
| 4 `SafeSignalState` | Candidate/Stale -> Recorded；Recorded -> Stale；nonterminal -> Suppressed | Suppressed terminal；raw/missing context不迁移 | signal + link/history + E03/rollup stale/result | `SIG-001~005`,`UOW-001/002` |
| 5 `AuditProjectionState` | PendingAppend/VisibilityRestricted -> Appended；formal restricted path | Suppressed current reserved/terminal；wrong relation不 append | projection + audit record + E04/stale/result | `AUD-001~004`,`UOW-001/002` |
| 6 `EvidenceLinkageState` | Candidate/Stale/NotVisible -> Linked；Candidate -> BodyBlocked/NotVisible | BodyBlocked terminal；body/wrong owner不 Linked | linkage + audit record + E05/handoff stale/result | `EVD-001~003`,`UOW-001/002` |

### 5.2 Handoff / retention / gap：9 个 owner

| # / owner | 合法迁移门禁 | 非法 / terminal / reserved 门禁 | 必须副作用 | Exact TC / candidate EV |
|---|---|---|---|---|
| 7 `ReportHandoffState` | Draft/Failed -> Prepared；Prepared -> Delivered/Failed；Draft -> Failed | Delivered/Cancelled terminal；Cancel current reserved；Draft不可直达Delivered | immutable input + lifecycle + E06/report/result | `RPT-001~005`,`UOW-007/008` |
| 8 `HandoffReadinessState` | complete input+visibility/gap/retention/no-write评估 -> PendingEvidence/Ready/Blocked/Degraded | blocking gap/NotVisible/hold下 Ready；Query持久 reevaluate | handoff same-version readiness + lifecycle | `RPT-001/002`,`QRY-003` |
| 9 `AuthenticityHintState` | Unassessed/Insufficient -> RealEvidenceLinked/PlaceholderDetected；Unassessed->Insufficient | Real/Placeholder terminal；no-origin Real；terminal rewrite | hint + handoff link/lifecycle + applicable E06 | `AUT-001~003` |
| 10 `RetentionMarkerState` | Unmarked/ReleaseEligible/Conflict -> ActiveHold；formal ReleaseEligible/Conflict | Released terminal；release current reserved；active ref下 ReleaseEligible/Released | marker + retention record + E07/stale | `RET-001~005`,`UOW-002/005` |
| 11 `ActiveReferenceProtectionState` | attach -> Protected；Protected -> Expired/Conflicted；guarded empty -> Released | Released terminal；non-empty consumer release；lost-update | protection + canonical set + retention record/E07 | `RET-002~005` |
| 12 `ReplayScopeState` | Defined -> Approved/Blocked；Approved future controlled completion only when owner gate closes | Blocked/Completed/Cancelled terminal；empty/source-write/external target；H13 absent completion | scope + replay record/report/no-write refs | `REB-005/006`,`NW-002` |
| 13 `NoWriteViolationState` | Detected -> Blocked/Escalated；Blocked -> Escalated/Closed；Escalated->Closed | Closed terminal；missing target/reason；persistence失败不得放行 attempted write | violation + record + E08/result | `NW-003`,`DIA-002`,`UOW-002/003` |
| 14 `GapLifecycleState` | Open -> Acknowledged；mitigate；formal basis -> Resolved | Resolved terminal；suppress/unsuppress reserved；no-basis close | gap + transition record + E09/stale | `DEG-002/005`,`UOW-005` |
| 15 `DegradedOutputKind` | policy creates new None/Active/Blocked replacement | Active/Blocked原地 reset；Blocked返回替代 success | exact gap/policy relation；Query只读 | `DEG-001~005` |

### 5.3 Read / reference / maintenance：7 个 owner

| # / owner | 合法迁移门禁 | 非法 / terminal / reserved 门禁 | 必须副作用 | Exact TC / candidate EV |
|---|---|---|---|---|
| 16 `SignalRollupState` | Pending/Fresh/Stale/Failed -> formal Rebuilding；full fixed cursor complete -> Fresh | incomplete/raw source -> Fresh；Query start；wrong target | rollup + rebuild/progress/history/E11/report | `SIG-004/005`,`REB-001~004` |
| 17 `ReadVisibilityKind` | 每 request 独立生成 Visible/Restricted/NotVisible/Blocked | NotVisible->Missing、跨 actor/context复用、持久推进 | response-only decision；durable writes=0 | `QRY-001~004`,`NW-001` |
| 18 `DiagnosticFreshnessState` | assembler Fresh/Partial/Unavailable；accepted mutation -> Stale；maintenance replacement | Query repair、old summary原地 Fresh、missing progress默认 Fresh | diagnostic composite + dual marker atomicity | `DIA-001/002`,`DEG-003~005` |
| 19 `ReferenceSnapshotStateKind` | Pending -> formal Resolved/Stale/Unresolved/Unavailable/Invalid；comparable newer update | Invalid terminal；Older覆盖、Uncomparable猜 winner、Resolved无 safe summary | snapshot + refresh record + E10/reference cursor | `DEG-001/004/005`,`UOW-005` |
| 20 `ProjectionMaintenanceStateKind` | Fresh/Failed -> Stale；Stale -> Rebuilding；fenced complete -> Fresh/Failed | incomplete capture Fresh、Query start、wrong target/progress relation | maintenance/progress/binding + E11/report | `REB-001~004`,`QRY-003` |
| 21 `ReplayCoordinationKind` | Pending -> Coordinating/Blocked；current落地仅 controlled Blocked/manual | terminal reopen、scope mismatch、H13 absent Completed | coordination + execution record/report/no-write refs | `REB-005/006` |
| 22 `RollupRebuildKind` | Pending -> Running -> Completed/Failed；Completed需 fixed cursor + seal | terminal回Running；Cancel current reserved；raw source | rebuild + item/report + rollup seal | `REB-001~004`,`SIG-005` |

### 5.4 Propagation / idempotency / report：5 个 owner

| # / owner | 合法迁移门禁 | 非法 / terminal / reserved 门禁 | 必须副作用 | Exact TC / candidate EV |
|---|---|---|---|---|
| 23 `PeripheralDeliveryKind` | Pending/Failed/Blocked -> Prepared；Prepared -> Delivered/Failed/Blocked | Delivered/Cancelled terminal；Cancel reserved；body receipt | intent/lifecycle/E12/report；consumer truth不变 | `EXT-001/002`,`UOW-007/008` |
| 24 `ExportPreparationState` | Draft/Failed/Blocked -> Prepared；Prepared -> Delivered/Failed/Blocked | Delivered terminal；final conclusion字段；Blocked仍外调 | preparation/intent/E12/report；audit truth不变 | `EXT-001~003`,`UOW-007/008` |
| 25 `OutboxPublicationState` | Pending -> Published/Failed/DeadLettered；Failed same-token -> terminal outcome | Failed->Pending；Published/DeadLettered重开；current payload rebuild | immutable snapshot不变；marker CAS/report；owner不回滚 | `UOW-006/007`,`REB-003/004` |
| 26 `IdempotencyReservationState` | atomic empty -> Reserved；result-before-complete -> Completed | Completed->Reserved；different digest覆盖；missing result replay | duplicate current attempt writes=0；stored surface exact | `ING-003/004`,`UOW-003/004` |
| 27 `JobReportState` | Draft -> exact Completed/PartiallyCompleted/FailedRetryable/FailedPermanent/Blocked fold | terminal edit/refinalize；DuplicateReplayed写 state；有 Planned/Running 时 finalize | report + result + reservation complete same UoW | `REB-004/005`,`UOW-008` |

### 5.5 `ObservationJobPlanItemState` 技术协调状态

| 场景 | 合法 transition / guard | 非法 / race 断言 | Report / effect 断言 | Exact TC |
|---|---|---|---|---|
| create / claim | factory -> Planned；Draft report + fresh Active claim/fence -> Running | duplicate work key、stale/released/expired claim、terminal report启动 | Running前无 effect/outcome | `REB-003`,`UOW-008` |
| success | Running -> Succeeded，要求 effect + item/plan/report CAS 同 fenced UoW | stale fence、effect rollback、incompatible outcome | exact refs fold一次 | `REB-001/003`,`UOW-008` |
| failure | Running -> FailedRetryable/FailedPermanent/Blocked，要求 typed class/guard | effect未 rollback、reason/digest/refs不兼容 | protected effect不执行；lossless fold | `REB-002/003`,`UOW-008` |
| equivalent terminal | Running -> SkippedTerminal，仅 probe证明 same work identity/token/material | timeout/lease/telemetry推断 terminal | 引用 existing fact，不重做 effect | `REB-004`,`UOW-007/008` |
| retry | FailedRetryable -> Running；input/plan不变、report仍Draft、fresh fence | permanent/blocked/skipped重进、旧 fence、terminal report | previous attempt append-only | `REB-003/004`,`UOW-008` |

## 6. 事务与持久化一致性门禁

### 6.1 Accepted Command / Consumer UoW

| Gate | 必须顺序 / atomic set | 失败条件 | Exact TC / evidence |
|---|---|---|---|
| `TX-OBS-001` pre-UoW | static route/schema/metadata、canonical digest 和 protocol errors 在 begin 前完成 | invalid/unsupported 仍 reserve、parse body或写 marker | `ING-002`,`EVD-004`,`CFG-002` |
| `TX-OBS-002` reserve first | begin 后先 `reserve_or_load(operation,actor,key,digest,identity)`；Replay/Conflict/InFlight 在 resolver/domain 前分支 | resolver/domain先执行、second writer、different digest覆盖 | `ING-003/004`,`UOW-004` |
| `TX-OBS-003` owner + policy | versioned load body-free owner/prerequisite，formal policy/domain transition，stage post-state | default expected version、upsert、body fallback、direct field mutation | `UOW-001/002/005`,`OWN-*` |
| `TX-OBS-004` one tagged cursor | 每 accepted UoW 只分配 Observation 或 Reference cursor；namespace保留 tag | 双 cursor、cursor/version/time混用、rollback gap复用 | `COR-003`,`UOW-005` |
| `TX-OBS-005` mandatory set | owner/post-state + native history + source membership/position + applicable immutable outbox + affected stale + stored result + reservation completion 全有或全无 | 任一 mandatory stage失败仍 commit owner，或补偿式异步修复 | `UOW-001/002`,`AUD-004`,`RET-004` |
| `TX-OBS-006` exact result | stored result operation/actor/digest/kind/schema/surface compatible，先 save result 后 Completed | completed 无 result、从 current truth 重建、duplicate产生新 refs | `UOW-003/004/006` |
| `TX-OBS-007` commit outcome | known failure只有 backend 证明 abort 才可 retry；unknown 先 probe reservation/result/marker | unknown 当 accepted/rejected、blind rerun、补偿 event | `UOW-003`,`NFR-003` |

### 6.2 Consumer / source ordering / ack

| Gate | 通过条件 | 失败条件 | Exact TC |
|---|---|---|---|
| `TX-OBS-008` envelope gate | unsupported schema / producer/source mismatch 在 parse/reserve 前 fail closed | payload parse、reroute、fallback consumer、normal marker | `EVD-004`,`DEP-003`,`ING-002` |
| `TX-OBS-009` source order | same producer/source + formal comparator 才得 Older/Equal/Newer；Uncomparable显式 | timestamp/cursor/schema/digest/row version猜顺序 | `DEG-005`,`UOW-005` |
| `TX-OBS-010` duplicate receipt | secondary source-event identity命中 original reservation，rollback incoming UoW，读 exact stored receipt | reparse payload、resolver call、local/outbox二写 | `ING-003/004`,`UOW-004` |
| `TX-OBS-011` completion | local commit known 后才 ack；commit unknown按 typed probe/manual；ack failure不回滚 truth | ack before commit、unknown默认 ack/retry、redelivery二写 | `UOW-003/004`,`NFR-003` |

### 6.3 Projection / source index / freshness

| Gate | 通过条件 | 失败条件 | Exact TC |
|---|---|---|---|
| `TX-OBS-012` source membership | accepted source mutation原子更新 current source、exact membership、member/target position/revision；withdrawal显式 | partial index、retained不推进、timestamp当position、跨 namespace比较 | `UOW-001/002/005`,`REB-001` |
| `TX-OBS-013` capture / replace | bounded complete capture + read fence；body/version/lookup/dependency/dual watermark atomic replace | truncate、N+1拼接、old/new transaction混合、partial bundle | `REB-001/002`,`QRY-004`,`DEG-004` |
| `TX-OBS-014` stale / Fresh | stale marker随 source accepted UoW；Fresh需 observation/reference applied>=stale + all-member target fence | lower stale被清、一个 item推进whole target Fresh、cross-tag裸值比较 | `SIG-004/005`,`REB-001~004`,`UOW-005` |
| `TX-OBS-015` rebuilding relation | persisted progress ref、target binding、maintenance state、scope coverage 一致 | missing/wrong progress被 Query猜测或修复 | `DIA-002`,`QRY-003`,`REB-002` |

### 6.4 Job staged transaction

| Gate | 通过条件 | 失败条件 | Exact TC |
|---|---|---|---|
| `TX-OBS-016` start UoW | reservation + one execution + immutable plan/config/work-set/binding + Draft report + target/progress atomically commit | start后再补 plan/report/binding；resume重新 list/current config | `REB-001/002/004`,`UOW-008` |
| `TX-OBS-017` item UoW | load plan/config、fresh global claim/fence、guard/capture、one compatible effect/outcome/report update in short UoW | whole Job长 tx、stale fence commit、一个 item改全 target | `REB-001~003`,`UOW-008` |
| `TX-OBS-018` failure accounting | effect UoW rollback后，在 valid claim下独立短 UoW只写 typed failed/gap outcome + Draft report | partial effect + failed outcome共存、earlier item概念回滚 | `REB-002/003`,`UOW-002/008` |
| `TX-OBS-019` finalize | 无 Planned/Running；report exact fold；target recapture；terminal report/result/Completed same UoW | tampered fold、terminal refinalize、incomplete target Fresh | `REB-004`,`UOW-008` |

### 6.5 Outbox / external split transaction

| Gate | 通过条件 | 失败条件 | Exact TC |
|---|---|---|---|
| `TX-OBS-020` outbox append | event name/binding/subject/cursor/schema/body-free bytes/digest同 accepted source UoW冻结 | publish无 snapshot、current truth重建、append失败仍 commit owner | `UOW-001/002/006`,`AUD-004` |
| `TX-OBS-021` publication | plan/claim/fence；external call无 DB tx；short finalize CAS marker/report；same token | owner rollback、Failed回Pending、换 token/binding/bytes、ack=consumed | `UOW-006/007`,`REB-003/004` |
| `TX-OBS-022` handoff/export intent | phase-local intent+historical binding+material digest+token先 commit，call/probe outside tx，short local finalize | 无 intent external call、长 tx、current destination/material替代 | `RPT-003/004`,`UOW-007` |
| `TX-OBS-023` unknown/finalize | known success + local finalize fail只做 same-token finalize；unknown probe；Unsupported/manual | immediate redelivery、new token、guess Delivered/Published | `RPT-004`,`UOW-003/007`,`NFR-003` |

## 7. 幂等、并发、恢复与错误裁决

### 7.1 Reservation / digest / duplicate

| 场景 | 通过条件 | 不通过条件 | Evidence |
|---|---|---|---|
| new operation | logical `(typed operation, actor, key)` 原子 reserve；canonical digest排除time/trace/attempt | process mutex、check-then-insert、unstable serializer | `ING-003/004`,`UOW-004` |
| same key + same digest Reserved | InFlight/Delayed，当前写集和 external call=0 | 第二 writer或盲等待/重试 | `UOW-004` |
| same key + same digest Completed | rollback current，校验并返回 exact stored surface/report | 从 current owner重建、追加 history/outbox | `ING-003`,`UOW-003/004` |
| same key + different digest | Conflict，original winner不变 | overwrite/merge/last-write-wins | `ING-004`,`UOW-004` |
| corrupt completed result | ConsistencyFailure/Manual，不能 rerun | 当 missing reservation、重建成功 surface | `UOW-003/006` |

### 7.2 CAS / claim / fence / races

| Race | Required winner/loser behavior | Failure | Evidence |
|---|---|---|---|
| owner CAS | one expected-version winner；loser rollback + reload/new decision | `None` upsert、constant version、last-write-wins | `COR-003`,`RET-003`,`UOW-005` |
| source version | formal comparator winner；Older no-write；Equal mismatch conflict | time-based winner、Uncomparable覆盖 | `DEG-005`,`UOW-005` |
| global work claim | one Active owner；reacquire fence严格递增；stale claimant零写 | lease expiry即成功、旧 fence提交、process-only lock | `REB-003`,`UOW-008` |
| retention release | active consumer / hold / referenced set优先；concurrent attach阻断 stale release | cleanup与attach竞态误删 | `RET-002~004` |
| projection replace | source read fence + row CAS + target fence；loser保留新 stale watermark | old capture覆盖新 source/stale | `QRY-004`,`REB-001/003` |
| external effect | stable token/material/binding；ambiguous先 probe | blind retry、attempt ID token、current binding fallback | `RPT-003/004`,`UOW-007` |

### 7.3 Typed recovery

| Recovery class / family | 允许动作 | 禁止动作 | Evidence |
|---|---|---|---|
| input change | 修正 required field/schema/ref 后新 attempt | 同输入 timer retry、创建默认值 | negative protocol rows |
| state change | 等 owner/reference/policy/config/claim 改变 | 忽略 block、自动推进 state | `DEG-*`,`RET-*`,`REB-*` |
| reload | rollback + reload current version/state/fence | same stale version直接 retry | `UOW-005`,`REB-003` |
| probe before retry | probe reservation/result/outbox/token/receipt，再按 formal outcome决定 | unknown盲 rerun/re-publish/re-deliver | `UOW-003/007`,`RPT-004` |
| finalize only | known external effect后只重做 local finalize | 重新 external call或换 binding/token | `RPT-003/004`,`UOW-007` |
| manual intervention | corrupt result/index/composite、unsupported probe、persistent impossible classification | fallback current truth、删除错误材料、伪造 success | `DEG-004`,`UOW-003/006`,`NFR-003` |

`S08-RECOVERY-CLASS-OWNER-01` 未闭合时，具体 positive recovery mapper 必须保持 conditional；不得在验收标准中创建
第二套 runtime enum。所有 public error 仍使用 `03` §7.1.4 的 typed code 和 body-free issue/gap ref。

## 8. 状态 / 事务验收项停审记录

| 审查组 | 数量 | exact name / contract | legal + illegal / failure | evidence | 结论 |
|---|---:|---|---|---|---|
| formal state owners | 27 | 27/27 | 27/27 | state corpus + exact TC | pass_design_with_affected |
| technical coordination state | 1 | 1/1；未计入27 | plan/claim/fence/terminal完整 | REB/UOW | pass_design |
| common state gates | 6 | complete | complete | contract/domain/service | pass_design |
| transaction gates | 23 | complete | rollback/unknown/phase complete | UOW/REB/RPT/RET | pass_design_with_affected |
| idempotency/race/recovery | 6 categories + 6 races + 6 recovery classes | complete | complete | exact TC families | pass_design_with_affected |

## 9. 跨状态一致性门禁审计

| 审计项 | 结果 | 处理 |
|---|---|---|
| formal owner count | 27 | pass |
| technical state mistaken as truth owner | 0 | pass |
| old/colloquial state alias | 0 | pass |
| legal transition without side-effect assertion | 0 | pass |
| illegal/terminal/reserved without zero-write assertion | 0 | pass |
| Query state/write transition | 0 | pass |
| accepted UoW partial-commit allowance | 0 | pass |
| duplicate current-truth reconstruction allowance | 0 | pass |
| unknown outcome blind retry allowance | 0 | pass |
| external/business truth write allowance | 0 | pass |
| unresolved current design conflict | 0；affected 明确条件化 | 可进入 Step 09 |

## 10. Inherited affected

无新增上游 blocker。12 项 inherited affected 继续开放，其中本 Step 直接受影响的是：

- `R06-F-AFFECT-UOW-01`：accepted write sequence 必须在实现后逐 flow 复验，不能由共享模板宣布通过。
- `S08-RECOVERY-CLASS-OWNER-01`：positive recovery mapper 保持 conditional，禁止默认 retry。
- `R07-EXTERNAL-PHASE-LINK-01` / `R07-EXTERNAL-PHASE-RETRY-ACCOUNTING-01`：J07/J08 phase 与 retry accounting 必须保留 intent/token/binding/probe/finalize 关系。
- `S08-CONSUMER-OUTBOX-SURFACE-01` / `S08-CONSUMER-INDETERMINATE-COMPLETION-01`：Consumer positive outbox/ack/completion 不得默认闭合。
- `S08-JOB-REPORT-REF-OWNER-01` / `S08-M1-SECONDARY-TYPE-OWNER-01` / `03-RPR-S09-PER-FLOW`：missing owner 或 per-flow proof 使对应 positive gate blocked/conditional。
- I05/J06 两组 upstream gap 继续按 Step 07 的 fail-closed/controlled blocked 处置。

## 11. 正式 `06` §8 回填草稿

> 校准来源：
> - `design-calibration/06_acceptance_step_08_state_tx_consistency.md`
>
> 延伸阅读：
> - 建议继续阅读本文件的“状态门禁共同规则”“27 个 formal state owner 与 1 个技术协调状态”“事务与持久化一致性门禁”“幂等、并发、恢复与错误裁决”和“跨状态一致性门禁审计”小节。

正式 §8 应保留 27+1 状态逐项表、`TX-OBS-001~023`、reservation/race/recovery 表，以及当前未执行和 affected
条件。状态名不得摘要成“正常/失败”；事务门禁不得只写“原子提交”。

## 12. 待确认事项

| ID | 事项 | 状态 | 影响 |
|---|---|---|---|
| `Q-06-08-01` | accepted UoW per-flow 实现证据 | not implemented | future positive consistency gate blocked |
| `Q-06-08-02` | recovery class 唯一 owner / mapper | open inherited | positive retry/finalize classifier conditional |
| `Q-06-08-03` | Consumer indeterminate completion / ack owner | open inherited | Consumer completion positive gate conditional |
| `Q-06-08-04` | external product probe capability | not selected | Unsupported 必须 manual，不得假定可 probe |

## 13. Step 自检与 gate

| 检查项 | 结论 |
|---|---|
| 27 formal state owner 是否全部逐项出现 | `27/27` |
| technical state 是否独立且未冒充业务 truth | yes |
| 每 owner 是否有 legal、illegal、side-effect、TC | yes |
| accepted UoW、rollback、projection、Job、external 是否可判定 | yes |
| duplicate、race、unknown、recovery 是否有明确禁止行为 | yes |
| 是否伪造执行、run、evidence 或 closure | no |
| 新 upstream blocker | none |
| inherited affected | open，positive gates 条件化 |
| `gate_status` | `pass_for_state_tx_consistency_design` |
| `next_allowed_action` | `start_current_06_step_09` |
| 正式 `06` 是否修改 | no；Step 15 前禁止 |

## 14. 参考

- `standards/document/验收标准讨论流程_SOP.md` Step 08
- `standards/document/验收标准书写规范.md` §5.8
- `projects/L4-observability/03-详细设计.md` §8~§12
- `projects/L4-observability/05-测试方案.md` §6~§7、§9~§14
- `projects/L4-observability/design-calibration/06_acceptance_step_01_input_boundary.md` through `06_acceptance_step_07_interfaces_events_sync.md`
- `projects/L1-governance/design-calibration/06_acceptance_step_08_state_tx_consistency.md`
- `projects/L1-artifact/design-calibration/06_acceptance_step_08_state_tx_consistency.md`
