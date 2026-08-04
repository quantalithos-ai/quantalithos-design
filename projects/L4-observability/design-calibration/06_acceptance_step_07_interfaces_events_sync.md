# L4-observability 06-验收标准 Step 07：定义接口、事件与跨仓同步验收

## Step 状态

| 字段 | 当前值 |
|---|---|
| project / document | `L4-observability` / `06-验收标准.md` |
| step | `07 / 定义接口、事件与跨仓同步验收` |
| mode | `full-restart` |
| status | `completed_current_design_record_with_inherited_affected_open` |
| current_module | `sixty_exact_protocol_and_cross_repo_seam_gates` |
| formal_document_write | `not_allowed_until_step_15` |
| real protocol execution | `not_run`;以下是未来验收合同 |
| new_upstream_blocker | `none` |
| inherited blocker / affected | 12 项保持开放，见 §10 |
| gate_status | `pass_for_protocol_sync_gate_design` |
| next_allowed_action | `start_current_06_step_08` |
| commit | 不需要；用户未要求提交 |

本文件替换同名旧模板。旧模板没有列出 16 Command、14 Query、9 Inbound Consumer、12 Outbound Event 和
9 Operations Job，也未区分编译期、运行期、事件协作和 handoff 依赖，不能进入 current 验收。

## 1. 本步目标、输入与计划

### 1.1 目标

对 current `03` 的 60 个 exact protocol 建立逐项验收入口，固定 operation/schema/source/outcome/side-effect/no-write
和 evidence 关系；同时明确跨仓验收只验证本仓 seam，不要求相邻仓完整实现，也不通过源码依赖证明运行协作。

### 1.2 输入

| 输入 | 使用内容 |
|---|---|
| 验收 SOP Step 07 / 书写规范 §5.7 | protocol、dependency type、下游未就绪和停审规则 |
| Step 01~06 | baseline、功能门禁、truth/data/dependency redline |
| `03-详细设计.md` §7~§8、§12~§14 | wrapper、60 protocol、flow、idempotency、binding、telemetry |
| `05-测试方案.md` §3~§9、§13 | 60 protocol closure、99 TC、suite/lane/evidence mapping |
| 全局依赖裁剪规则 | compile/runtime/event/handoff 判定 |

### 1.3 Step 内计划完成情况

| 计划项 | 产物 | 状态 |
|---|---|---|
| 固定 shared wrapper / route / binding 判定 | §4 | done |
| 逐项裁决 16 Command、14 Query | §5~§6 | done |
| 逐项裁决 9 Consumer、12 Event、9 Job | §7~§9 | done |
| 收口跨仓依赖类型和下游未就绪语义 | §10~§11 | done |
| 完成停审、跨协议审计和正式回填草稿 | §12~§15 | done |

## 2. SOP 问题回答

| 问题 | Current 回答 |
|---|---|
| Command / Query 如何验收 | Command 验 exact metadata/body/result/outcome、accepted write-set 与负向零写；14 Query 逐项验 total surface 和 strict zero-write。 |
| Event 如何证明可消费 / 可重放 | 只验证 committed source -> immutable outbox snapshot -> exact event/binding/token -> publication marker；不声称 downstream consumed 或 cross-system exactly-once。 |
| Job 如何证明幂等和恢复 | 逐 Job 验 immutable plan/config/work-set、claim/fence、item outcome、report fold、stored duplicate、probe/manual；J06 positive 保持 blocked。 |
| 跨仓同步成功标准 | 本仓使用 typed ref/snapshot/event/handoff seam，accepted local fact和外部 phase状态可追溯，且相邻 truth writer 始终为 0。 |
| 下游未就绪如何验 | product-neutral contract、disabled/unavailable/fail-closed、no fallback 和 no-write 可验；若 selected scope 要求真实 seam，缺失为 blocked/not_evaluated。 |
| 依赖类型 | compile-time 仅 core-contracts；相邻仓为 runtime adapter、event collaboration 或 body-free handoff/reference。 |
| 如何避免误要求源码依赖 | 用 contract roundtrip、binding catalog、controlled adapter、outbox/consumer artifact 和 dependency graph 验证，不引入 sibling package。 |
| 是否使用正式名称 | 60/60 使用 `03` §7 exact operation；无旧 route/topic/job alias。 |
| 固定 surface / evidence | operation name 是 product-neutral canonical surface；runtime topic/endpoint 由 frozen binding ref 证明，report 走 exact primary suite。 |
| 下游未就绪的三值裁决 | P0 local seam 可验证则只对 seam 裁决；required external lane 缺失不得通过；不补造 downstream success。 |

## 3. 问题诊断与裁决取舍

| 旧写法 / 方案 | 结论 | Current 处理 |
|---|---|---|
| “API 可调用、事件可发布、Job 可运行” | 拒绝 | 无 exact schema、状态、副作用、错误和 evidence；改为 60 行 closure |
| 固定 HTTP path/topic/vendor 名 | 拒绝 | current contract route-neutral/product-neutral；验 operation + frozen binding ref |
| 下游未实现则要求 sibling 源码依赖 | 拒绝 | 以 runtime/event/handoff seam 验收，compile graph 仍 only-core |
| provider ack = Published/Delivered/Consumed | 拒绝 | 只有 local finalize commit 拥有本地状态；Consumed 不在本仓 truth |
| family summary 代替逐协议 | 拒绝 | family 规则只作 shared invariant，60 exact row 均保留 |
| I05/J06 建正向 fake | 拒绝 | 只允许 fail-closed / controlled blocked；不伪造上游 schema/H13 |

## 4. Shared protocol 与证据判定

| Gate | 通过条件 | 失败条件 | Evidence |
|---|---|---|---|
| `IF-OBS-001` finite operation map | public name、family、concrete body、typed operation total static 1:1；unknown 不 trim/case-fold/fallback | free-text parse、alias、route猜 operation | contract roundtrip + `DEP-002`; contract/static reports |
| `IF-OBS-002` metadata / envelope | required actor/idempotency/trace/schema/producer/source/version 字段按 family lossless；Query 无 reservation | metadata 默认、payload重复 header、time/route 推导 source version | `ING-*`,`COR-*`,`QRY-*`,`CFG-*` |
| `IF-OBS-003` body-free schema | request/response/event/job/report/error 仅 typed safe fields，redaction 在 serialization 前 | raw body/secret/provider response/real run/evidence/verdict 字段 | `RED-*`,`RPT-005`,`AUT-003`; redaction check |
| `IF-OBS-004` public outcome | Command/Consumer/Job exact outcome 与 result/error/changed/outbox/gap refs 组合合法 | rejected 伪 result、duplicate 新 refs、blocked 写 success | service/contract exact rows |
| `IF-OBS-005` runtime binding | operation/event/job 与 exact historical `effect_binding_ref` / capability snapshot 绑定；public payload不泄露 binding detail | current binding fallback、endpoint/topic/credential 入 DTO、missing binding 仍执行 | `CFG-003~005`,`DEP-003`,`UOW-006~007` |
| `IF-OBS-006` evidence path | 每个 exact TC 可回到唯一 primary suite raw case/report，同 run candidate linkage | wildcard evidence、第二 primary suite、跨 run join | `evidence-index.json/.md` + report-audit |

## 5. Command 16/16 验收门禁

Command 统一要求：valid request 的 accepted/committed-negative path 使用 actor-scoped reservation 和 formal UoW；ordinary
reject/Conflict/InFlight 无新 owner/history/outbox/result；Duplicate 读取 original stored surface。表中 TC range 必须在真实
index 展开，report path 由其唯一 primary suite 确定。

| ID / exact Command | 正向通过条件 | 失败 / no-write 条件 | Exact TC / candidate EV | 裁决 |
|---|---|---|---|---|
| C01 `SubmitObservationMaterial` | safe source/purpose -> receipt + disposition + intake record/result | missing/raw/unresolved 分支显式；无 partial accepted truth | `ING-001~004`,`RED-004` / matching EV | P0 |
| C02 `RecordSafetyDisposition` | versioned legal safety transition + decision record | missing receipt、illegal/terminal、unsafe summary -> zero partial | `RED-001~004` / matching EV | P0 |
| C03 `BindCorrelationContext` | typed receipt/source/trace/causation -> Bound/Partial + link record | source mismatch、opaque derivation、Invalid reopen 拒绝 | `COR-001~003` / matching EV | P0 |
| C04 `RecordSafeSignal` | safe context/summary -> signal + optional rollup/stale/event | raw signal、missing context、rollup CAS failure rollback all | `SIG-001~006` / matching EV | P0 |
| C05 `AppendAuditProjection` | body-free subject/context/source-audit -> projection + append record | source body、wrong owner、missing relation不造 projection | `AUD-001~004` / matching EV | P0 |
| C06 `LinkBodyFreeEvidence` | boundary/digest/purpose -> unique linkage + audit record | body/wrong owner/missing digest；I05 source未闭合不造 positive | `EVD-001~004` / matching EV | P0 conditional affected |
| C07 `PrepareReportHandoff` | complete immutable input + consumer/visibility -> handoff/readiness/lifecycle | ref-only/mismatch/blocking gap/hold 不生成 Prepared/Delivered | `RPT-001~005` / matching EV | P0 conditional |
| C08 `EvaluateAuthenticityHint` | formal origin + same input/gaps -> exact hint/lifecycle | no-origin Real、placeholder terminal rewrite、alias/verdict fabrication | `AUT-001~003` / matching EV | P0 |
| C09 `SetRetentionMarker` | protected ref/purpose -> hold/eligibility/conflict + record | active protection、ambiguous release、cleanup action 阻断 | `RET-001~005` / matching EV | P0 |
| C10 `ProtectActiveReference` | canonical consumer set attach/versioned state + record | mismatched consumer、non-empty release、concurrent lost update | `RET-002~005` / matching EV | P0 |
| C11 `DefineReplayScope` | canonical derived targets + no-write boundary -> Defined/Approved/Blocked | empty/source/external write target不可 Approved | `REB-005~006`,`NW-002` / matching EV | P0; H13 positive blocked |
| C12 `RecordNoWriteViolation` | attempted target stays blocked；violation + native record原子 | target/reason缺失、marker save failure后放行 attempted write | `NW-003`,`DIA-002`,`UOW-002` / matching EV | P0 |
| C13 `RecordGapState` | typed source/kind/basis -> local gap/degraded transition | no-basis close、missing/wrong source、synthetic success | `DEG-002/005`,`UOW-005` / matching EV | P0 |
| C14 `PrepareExternalAuditExport` | matching view/consumer/visibility -> local preparation only | body/unsupported consumer/blocked visibility不得 external call | `EXT-001~003`,`NW-004` / matching EV | P0 seam |
| C15 `RegisterReferenceSnapshot` | typed subject -> Pending / formal safe resolver outcome + record | body/wrong owner/duplicate mismatch；不注册即伪 Resolved/Fresh | `DEG-001/004/005`,`OWN-004` / matching EV | P0 affected |
| C16 `UpdateReferenceSnapshotState` | versioned snapshot + comparable source -> legal state/record | Older/Uncomparable 不覆盖，Invalid 不复活 | `DEG-004~005`,`UOW-005` / matching EV | P0 affected |

## 6. Query 14/14 验收门禁

所有 Query 的共同 required assertion 是 `begin/save/append/replace/mark_stale/refresh/reserve/publish = 0`。Missing、
NotVisible、Blocked、Stale、Rebuilding、Unavailable、Failed 和 visible empty 必须保持 distinct；consistency hint 只控制已有
committed body 是否返回。

| ID / exact Query | 可判定通过条件 | 失败条件 | Exact TC / candidate EV | 裁决 |
|---|---|---|---|---|
| Q01 `GetObservationReceipt` | typed receipt view；absent vs not-visible distinct | body泄露或 read access write | `QRY-001/003`,`NW-001` / matching EV | P0 |
| Q02 `GetIntakeStatus` | stable page；pending safety不等 missing；visible empty valid | cursor漂移、dangling relation伪成功 | `QRY-001~003` / matching EV | P0 |
| Q03 `GetSafeSignal` | unambiguous selector；safe summary/freshness surface | raw signal、双 selector猜测、blocked body | `SIG-003`,`QRY-001/003` / matching EV | P0 |
| Q04 `GetSignalRollup` | window/scope page、count/cursor/freshness一致 | stale时 inline rebuild 或 incomplete->Fresh | `SIG-003~005`,`QRY-003` / matching EV | P0 |
| Q05 `GetAuditTimeline` | canonical subject order/page；restricted/empty明确 | source audit body、hidden 当 missing、order漂移 | `AUD-003`,`QRY-001~003` / matching EV | P0 |
| Q06 `GetEvidenceIndexInput` | sorted unique linkage/audit/gap preview；不保存 | incomplete input伪 complete、preview mint durable alias | `EVD-003`,`QRY-001/003` / matching EV | P0 |
| Q07 `GetReportHandoff` | handoff/readiness/hint/gap same committed surface | Query prepare/deliver、blocked/degraded吞掉 | `RPT-001/002`,`QRY-003` / matching EV | P0 |
| Q08 `GetRetentionProtection` | marker/protection/consumer conflict完整 | Query release/delete、active relation丢失 | `RET-002`,`QRY-001/003` / matching EV | P0 |
| Q09 `GetObservationReadModel` | stable view/marker/scope composite；hint控制 stale body | missing lookup在线create、mark/rebuild/repair | `DEG-003/004`,`QRY-001/003/004` / matching EV | P0 |
| Q10 `GetDiagnosticView` | scope/view/summary/current pointer/dual freshness/progress原子 | partial/corrupt bundle拼接、递归持久化 | `DIA-001~003`,`QRY-003/004` / matching EV | P0 |
| Q11 `GetGapStatus` | point/page selector total；Suppressed != Resolved | missing/no-gap猜测、ack/close写入 | `DEG-001/002`,`QRY-001~003` / matching EV | P0 |
| Q12 `GetPeripheralExportView` | consumer+scope product-neutral view；availability明确 | external call、consumer truth update、Disabled 当 empty | `EXT-001/002`,`QRY-003`,`NW-001` / matching EV | P0 seam |
| Q13 `GetReferenceSnapshotView` | snapshot/subject selector total；six state/dual freshness完整 | refresh/resolver call、Invalid过滤、time猜 current | `DEG-001/004/005`,`QRY-003` / matching EV | P0 |
| Q14 `GetRebuildProgress` | target/progress/plan/report/marker relation一致 | no-progress伪 complete、Query start/finalize | `REB-001~004`,`QRY-003` / matching EV | P0 |

## 7. Inbound Consumer 9/9 验收门禁

共同 validation 顺序固定为 route/operation -> required header -> schema intersection -> producer static map -> optional
source-version equality -> typed payload/source compatibility -> route-bound actor/digest/event identity -> atomic reserve。Ack 只能在
known local completion 后发生；unsupported schema 不 parse、不 reserve、不 ack、不写。

| ID / exact Consumer | Accepted local seam | 失败 / completion 条件 | Exact TC / candidate EV | closure |
|---|---|---|---|---|
| I01 `ConsumeBusObservationMaterial` | body-free material -> local receipt/safety/H1/E01/E02/result | unsupported/raw/Older/digest conflict/commit unknown；Bus truth writer=0 | `ING-001~004`,`RED-004`,`UOW-001~004` | conditional |
| I02 `ConsumeSourceAuditMaterial` | valid relation -> local audit projection/H3/E04 | missing context/body/Older/Equal conflict/rollback；source audit writer=0 | `AUD-001~004`,`UOW-003~005` | conditional |
| I03 `ConsumeIdentityObservationContext` | supported safe ref/freshness -> local reference snapshot | schema/owner/body/order/unknown completion fail closed；Identity writer=0 | `DEG-001/004/005`,`DEP-002`,`UOW-004` | conditional affected |
| I04 `ConsumeGovernanceAuditContext` | supported body-free evidence context -> local ref/gap | decision body、binding/authority缺失、writer capability越权阻断 | `EVD-002/003`,`DEP-002`,`UOW-002` | conditional affected |
| I05 `ConsumeArtifactEvidenceContext` | current 无正向激活 | canonical payload/schema/binding缺失时 pre-parse fail closed，ack/write/outbox=0 | `EVD-004`,`CFG-005`,`HIST-002` | `blocked_upstream` |
| I06 `ConsumeRuntimeSignalSummary` | safe summary/context -> local signal/reference/E03/E10 | raw runtime/log/metric/trace、Older、resolver unavailable、duplicate | `SIG-001~005`,`UOW-003/004` | conditional |
| I07 `ConsumeSandboxSignalSummary` | safe branch -> local safety/signal or formal NoOp | unsafe quarantine；missing relation不造 receipt；unknown completion无默认 action | `SIG-001~003`,`RED-002/004`,`UOW-003` | conditional |
| I08 `ConsumeArchiveHandoffFeedback` | matching phase/token/binding -> local lifecycle | stale/mismatch/body/absence/unknown 不证明 Delivered；Archive truth writer=0 | `RPT-003~005`,`UOW-007` | conditional |
| I09 `ConsumeReportConsumerFeedback` | matching consumer/delivery -> local marker/gap/E09/E12 | wrong consumer/receipt/stale/body/disabled/unknown；consumer truth writer=0 | `EXT-001~003`,`UOW-003/007` | conditional |

## 8. Outbound Event 12/12 验收门禁

每个 event 都必须由 accepted UoW 的 committed typed source 构造 immutable snapshot。Subject、tagged cursor、schema、
historical binding 和 digest 在 append 时冻结；publisher 不读 current truth。Publication failure 只更新 local marker/report，
不回滚 owner，也不证明 downstream consumed。

| ID / exact Event | Committed source / payload gate | Failure / forbidden gate | Exact TC / candidate EV | closure |
|---|---|---|---|---|
| E01 `ObservationReceiptChanged` | receipt/source/admission/disposition parity | raw material；encoder/binding失败回滚 source UoW | `ING-001`,`UOW-002/006/007` | planned |
| E02 `SafetyDispositionChanged` | disposition/receipt/state/redaction marker parity | forbidden-body evidence；current disposition重建 | `RED-001/004`,`UOW-006/007` | planned |
| E03 `SafeSignalRecorded` | signal/kind/context/rollup/safe summary parity | raw log/metric/trace；current signal重建 | `SIG-001/002/006`,`UOW-006/007` | planned |
| E04 `AuditProjectionAppended` | projection/subject/source-audit/state/visibility parity | source audit body/business verdict | `AUD-001/004`,`UOW-006/007` | planned |
| E05 `EvidenceLinkageChanged` | linkage/boundary/state/digest/visibility parity | evidence body/real alias；missing linkage重建 | `EVD-001~003`,`UOW-006/007` | conditional |
| E06 `ReportHandoffChanged` | handoff/consumer/state/readiness/hint parity | verdict/signoff/run/evidence alias；phase提前 | `RPT-001~005`,`UOW-006/007` | conditional |
| E07 `RetentionMarkerChanged` | protected/marker/protection/state parity | source cleanup completed claim；publish失败触发 cleanup | `RET-001~005`,`UOW-006/007` | planned |
| E08 `NoWriteViolationRecorded` | violation/context/target/state parity | compensation/source write、locator/body；outbox失败后放行 | `DIA-002`,`NW-003`,`UOW-002/006` | planned |
| E09 `GapStateChanged` | gap/source/kind/state/degraded parity | synthetic source material / success；publisher repair | `DEG-001/002/005`,`UOW-006` | planned |
| E10 `ReferenceSnapshotChanged` | snapshot/subject/state/safe summary parity | external body/lifecycle truth；old snapshot覆盖 | `DEG-001/004/005`,`UOW-006` | planned |
| E11 `DerivedProjectionChanged` | target/maintenance/freshness/progress parity | false Fresh、business/source truth claim | `REB-001~004`,`UOW-006/008` | planned |
| E12 `PeripheralDeliveryChanged` | delivery/consumer/state/preparation parity | provider body、consumer/audit truth；unknown 当 Delivered | `EXT-001~003`,`RPT-003/004`,`UOW-007` | conditional |

## 9. Operations Job 9/9 验收门禁

所有 Job 都必须有 immutable start plan + complete config snapshot + Draft report，逐 item 使用 global typed work claim 和
monotonic fence，finalize 验证无 Planned/Running 后把 terminal report、stored result、reservation complete 同 UoW 提交。

| ID / exact Job | 正向通过条件 | 失败 / duplicate / recovery 条件 | Exact TC / candidate EV | closure |
|---|---|---|---|---|
| J01 `PublishObservationOutbox` | frozen eligible snapshots逐 item same binding/token/bytes publish，local marker/report fold | corrupt/missing、unknown probe、stale fence；terminal duplicate不 relist/republish | `UOW-006~008`,`REB-003/004` | conditional |
| J02 `RebuildObservationReadModels` | complete bounded capture -> atomic read/diagnostic replacement + progress/report | incomplete/fence/CAS失败不 truncate/Fresh；source writer=0 | `REB-001~004/006`,`UOW-008` | conditional |
| J03 `RebuildSignalRollups` | stored Recorded SafeSignal + fixed cursor -> rollup/report | raw fallback/incomplete cursor/stale fence/duplicate不 Fresh | `REB-001~004/006`,`SIG-005` | planned |
| J04 `RefreshReferenceSnapshots` | immutable target + formal resolver outcome -> local snapshot/report | unavailable/unresolved/invalid distinct；body copy/stale fence阻断 | `DEG-001/004/005`,`REB-003/004`,`UOW-008` | conditional |
| J05 `ScanObservationGaps` | complete expected-source scan -> proven gap outcome/report | timeout/incomplete != no-gap；no-basis不 close；无 synthetic material | `DEG-002/005`,`REB-002~004/006` | planned |
| J06 `CoordinateObservationReplay` | current 只允许 immutable plan/guard + controlled Blocked/manual | H13 未闭合不得 positive execution/Completed；source replay/repair=0 | `REB-005/006`,`UOW-008` | `blocked_controlled` |
| J07 `PrepareReportHandoffDelivery` | immutable handoff/binding；prepare/call/probe/finalize；same token；report | mismatch/unavailable/unknown/finalize failure；无 verdict/signoff | `RPT-002~005`,`UOW-007/008` | conditional affected |
| J08 `PrepareExternalAuditExport` | immutable preparation/view/consumer；symmetric intents/tokens；local result/report | body/wrong target/unknown/finalize failure；无 external audit truth | `EXT-001~003`,`UOW-007/008`,`NW-004` | conditional affected |
| J09 `RebuildPeripheralViews` | complete product-neutral source capture -> atomic local view/progress/report | visibility/retention/no-write/incomplete/fence failure保留 old stale view | `EXT-001/002`,`REB-001~004/006` | conditional |

## 10. 跨仓依赖类型与验收方式

| 对象 / 仓 | 依赖类型 | 本仓协作方式 | 验收证据 | 不验 / 禁止 |
|---|---|---|---|---|
| `L0-core/core-contracts` | compile-time | typed ref/metadata/error/schema 基础 contract | package/source digest、compile graph、roundtrip | 不重定义 shared contract |
| `L0-bus` | event collaboration / runtime transport | inbound observation material、outbox publication adapter | envelope/schema/binding、stored snapshot、ack-after-commit、publication marker | 不引入 Bus package；不验投递主干 truth |
| `L1-identity` | event / body-free reference | identity observation context -> local snapshot | producer static map、safe ref、zero Identity writer | 不验身份 lifecycle/body |
| `L1-governance` | event / body-free audit context | governance audit/evidence ref -> local projection/reference | schema/binding、body-free resolver、zero Governance writer | 不验 Decision/Policy truth |
| `L1-artifact` | event / evidence reference | artifact evidence context -> local linkage | 当前只验 I05 fail-closed；future canonical schema/binding | 不造 payload；不验 Artifact/evidence body |
| runtime / sandbox | event / runtime adapter | safe signal summary、correlation/ref snapshot | safe summary/schema/order/degraded、zero execution writer | 不验 execution truth/control |
| archive / report consumer | handoff + inbound feedback | prepare/deliver intent、body-free receipt、local marker | binding/token/probe/finalize + feedback consumer | 不验 archive package/verdict |
| external APM/GRC/dashboard | optional runtime/product seam | product-neutral read/export adapter | Disabled/Unavailable/Degraded、no owner transfer | 不作 compile dependency/truth/hard prerequisite |

## 11. 下游未就绪与跨仓裁决规则

| 情形 | 可通过的 seam | 不可声称 | 总体影响 |
|---|---|---|---|
| external product 未选择 | product-neutral DTO/port/config disabled path、no-write | 产品可用、SLA、真实 delivery | P0 core 可继续；selected P1 未评估 |
| upstream schema/binding 未闭合 | pre-parse reject、no ack/no write/no fallback | positive parse/accepted/consumer result | 对应 positive P0 blocked |
| transport unavailable | intent/snapshot持久、typed unavailable/retry class | publish/deliver success、Consumed | selected seam blocked/conditional |
| external outcome unknown | same-token probe/manual、local state未升级 | retry success、Delivered/Published | indeterminate，不得通过该 gate |
| RuntimeLike 未建立 | ISO/INT contract/durable behavior各自可判 | RuntimeLike release result | required RT scope not_evaluated |

## 12. 接口 / 事件验收项停审记录

| Family | exact 数量 | formal name/schema | positive + negative gate | evidence/report | current closure |
|---|---:|---|---|---|---|
| Command | 16 | 16/16 | 16/16 | 16/16有 exact TC family | pass_design_with_affected |
| Query | 14 | 14/14 | 14/14；zero-write共同强制 | 14/14由 QRY/NW/主题 rows覆盖 | pass_design |
| Inbound Consumer | 9 | 9/9 | 8 conditional + I05 blocked | 9/9有 negative/controlled入口 | pass_design_with_affected |
| Outbound Event | 12 | 12/12 | 12/12 committed snapshot + failure | 12/12有 TC mapping | pass_design_with_affected |
| Operations Job | 9 | 9/9 | 8 conditional/planned + J06 blocked | 9/9有 TC mapping | pass_design_with_affected |
| **总计** | **60** | **60/60** | **60/60** | **0 orphan** | `pass_design` |

停审共同检查：protocol 名正式；dependency type 正确；runtime binding 与 canonical operation 分离；下游未就绪语义清楚；
TC/EV/report path 固定；没有将 external ack、report 或 Job outcome 写成业务 truth。

## 13. 跨接口同步门禁审计

| 审计项 | 结果 | 处理 |
|---|---|---|
| exact protocol orphan / duplicate | 0 / 0 | Step 15 再审计正文 |
| family count | 16 + 14 + 9 + 12 + 9 = 60 | pass |
| old protocol/route/topic alias | 0 | pass |
| Query writer | 0 | pass |
| sibling compile dependency requirement | 0 | pass |
| downstream full implementation requirement | 0 | 只验 seam |
| provider ack -> business truth | 0 | local finalize boundary明确 |
| I05 / J06 fabricated positive | 0 | blocked/controlled |
| unresolved dependency type conflict | 0 | 可进入 Step 08 |

## 14. Inherited affected

12 项 inherited affected 均继续开放。Step 07 的直接处置：

- I05 只验 canonical schema/binding 缺失时 pre-parse fail closed，不创建 positive DTO / fixture / event binding。
- J06 只验 observation-side controlled Blocked/manual，不创建 H13 execution record、external receipt或 Completed truth。
- accepted UoW、recovery class、Consumer outbox/completion、external phase/retry accounting、Job report ref、secondary type owner
  和 per-flow propagation 在 positive gate 中保持 conditional；关闭后必须新 baseline / 新 run。

## 15. 正式 `06` §7 回填草稿

> 校准来源：
> - `design-calibration/06_acceptance_step_07_interfaces_events_sync.md`
>
> 延伸阅读：
> - 建议继续阅读本文件的“Shared protocol 与证据判定”“Command / Query / Consumer / Event / Job 验收门禁”“跨仓依赖类型与验收方式”“下游未就绪与跨仓裁决规则”和“跨接口同步门禁审计”小节。

正式 §7 必须保留 60 个 exact protocol 的逐项门禁和 family count，不用 family wildcard 替代正式行；同时保留
cross-repo dependency type 和 selected-seam 缺失语义。

## 16. 待确认事项

| ID | 事项 | 状态 | 影响 |
|---|---|---|---|
| `Q-06-07-01` | I05 canonical upstream payload/schema/binding owner | open inherited | positive Consumer/evidence gate blocked |
| `Q-06-07-02` | J06 H13 upstream phase owner | open controlled | positive replay completion blocked |
| `Q-06-07-03` | selected runtime topic/endpoint/product binding | not selected | current只验 frozen binding semantic，不写具体值 |
| `Q-06-07-04` | selected P1 cross-repo E2E scope | not frozen | 未选择时不要求下游完整实现；选择需新 baseline |

## 17. Step 自检与 gate

| 检查项 | 结论 |
|---|---|
| 60 exact protocol 是否逐项出现 | `60/60` |
| 每项是否有正向、失败/no-write、TC/EV 和影响 | pass |
| 是否区分 compile/runtime/event/handoff | pass |
| 是否要求 sibling 源码依赖或下游完整实现 | no |
| 是否伪造 topic、binding、external result 或 evidence | no |
| 新 upstream blocker | none |
| inherited affected | open，处置明确 |
| `gate_status` | `pass_for_protocol_sync_gate_design` |
| `next_allowed_action` | `start_current_06_step_08` |
| 正式 `06` 是否修改 | no；Step 15 前禁止 |

## 18. 参考

- `standards/document/验收标准讨论流程_SOP.md` Step 07
- `standards/document/验收标准书写规范.md` §5.7
- `standards/document/全局项目依赖关系与裁剪规则.md`
- `projects/L4-observability/03-详细设计.md` §7~§8、§12~§14
- `projects/L4-observability/05-测试方案.md` §3~§9、§13
- `projects/L4-observability/design-calibration/06_acceptance_step_01_input_boundary.md` through `06_acceptance_step_06_data_arch_redlines.md`
- `projects/L1-governance/design-calibration/06_acceptance_step_07_interfaces_events_sync.md`
- `projects/L1-artifact/design-calibration/06_acceptance_step_07_interfaces_events_sync.md`
