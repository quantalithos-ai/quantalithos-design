# Step 6. 设计测试场景与用例矩阵

> 对应 SOP：`standards/document/测试方案讨论流程_SOP.md` Step 6
> 正式回填：`05-测试方案.md` §6
> 日期：2026-09-13
> 状态：`completed / pass_with_blocked_positive_lanes / continue_authorized`

## 1. Step 状态与 Step 内计划

| 项 | 结论 |
|---|---|
| 目标 | 将 Step 5 双向追溯落成可执行、可断言、可留证的 P0 用例候选，并逐 CUT 停审 |
| 输入 | Step 5、正式 03 协议/flow/state/UoW/error/idempotency、正式 04 配置门禁 |
| gate_status | `completed / pass_with_blocked_positive_lanes` |
| gate_reason | 102 个唯一 TC、18/18 CUT 停审与跨用例审计均完成；real-seam 正向继续 blocked，未生成执行事实 |
| next_allowed_action | 按连续授权创建并完成 Step 7 |
| source_files | 05 Step 3～5；03 §5～15 与 Step 08～13/16；04 §7～12/14 |

| 批次 | 产物 | 状态 | 完成门禁 |
|---|---|---|---|
| 6A | Contract、26 objects、18 states | done | 分母逐项可反查，状态正式名称无漂移 |
| 6B | 3 Command、5 Query、5 Consumer、17 Job | done | 30 logical/32 surfaces 无孤儿 |
| 6C | UoW、幂等、effect、authority、restore | done | 正负/并发/恢复和 blocker 姿态完整 |
| 6D | config/security/observe/dependency/resource/report | done | VETO、non-interference、evidence truth 完整 |
| 6E | 逐 CUT 停审与跨 phase 审计 | done | 18/18 通过且无 unresolved 冲突 |

## 2. 本步输入与用例语义

| 输入 | 使用方式 |
|---|---|
| 03 Step 06/08 | exact object、DTO、protocol、disposition、issue 名称 |
| 03 Step 09/10 | 30 flow、18 状态集合和合法/非法边 |
| 03 Step 11～13 | UoW/CAS/read-set/fence、error mapping、operation key、duplicate/reconcile |
| 03 Step 16 | minimum cut、positive proof 上限和 fake/durable parity |
| 04 §7～12 | 55 key、strict source、assembly、redaction、failure/config test cuts |
| Step 5 | F/BR/NFR/VETO 与 TC/EV 候选族 |

`TC-AR-*` 是正式测试设计 ID，但当前仅为 planned case specification；`EV-CAND-AR-*` 是候选证据槽位。二者均不表示测试文件、执行、artifact、报告或通过事实。

每个用例使用以下结果语义：

| 语义 | 定义 |
|---|---|
| local executable | 未来可由 pure/fake/spy/fault fixture 验证本地契约 |
| real-seam blocked | 正向结果依赖正式 owner/provider/durable 合同，当前执行状态必须为 blocked |
| negative executable | 即使正向阻塞，也必须能验证 fail-closed/no-dispatch/no-write |
| phase-local | 只断言当前入口承诺，不推导下一阶段或 owning-domain truth |

## 3. SOP 问题回答

| 问题 | 回答 |
|---|---|
| 每个 P0 正向主线怎么执行？ | 本地对象/编排使用 checked builders + fake/spy；真实 source、governance、integrity、storage、receiver 只在 formal fixture 齐备时执行，否则 positive blocked。 |
| 关键反向和边界如何触发？ | 缺字段/wrong typed ref、非法状态、L/L+1、same/different input、CAS/fence、late feedback、visibility revoke、mapping drift、dependency unavailable。 |
| 非法迁移如何断言？ | 对 18 状态主语逐行调用非法 edge，断言正式 `DomainError`，self/version/history/write/effect 不变。 |
| 事务和副作用如何验证？ | fault 注入每个 commit boundary，spy 记录 UoW、port、effect 顺序；intent 未提交不得 dispatch，Unknown 只 exact probe。 |
| 恢复如何复现？ | commit unknown、MayHaveDispatched、partial target、stored result missing、claim superseded、cursor expired，分别断言 probe/reconcile/new explicit invocation。 |
| 断言引用哪些正式名称？ | 只使用 03 §7 dispositions/issues、§9 状态、§11 error 与 Step 08 DTO；不使用旧 snapshot/index 状态。 |
| 是否有 phase 越界？ | 用例明确禁止 Accepted→archived、Sealed→project archived、Verified→storage committed、Succeeded→restored。 |
| 每 CUT 有哪些类型？ | 至少正向或 blocked-positive，加关键负向/边界；一致性 CUT 另含并发/恢复。 |
| 数据/自动化/证据是否明确？ | 本 Step 给数据前置类别、自动化候选和 EV-CAND；具体 DS、suite、路径分别留 Step 7/9/13。 |
| 如何停审？ | 18 CUT 逐项检查 truth source、断言、data prerequisite、automation、phase 和 evidence slot。 |

## 4. Historical material 诊断与改动前后对比

| 历史口径 | 问题 | 处置 |
|---|---|---|
| 旧 `TC-001～014` | 对象、状态、API 与当前 30 入口不一致 | 全部删除，不保留 alias |
| 单一“归档成功”断言 | 压平 18 状态和 external finality | 按 phase/axis 断言，不存在 global success case |
| mock storage 成功即 E2E | fake 不能证明 commit/durability | local orchestration 与 real-seam 分开 |
| 恢复写回数据库 | 越过 owner receiver | 只测 owner-specific handoff 与 no direct write |
| 查询触发验证/修复 | 违反 strict no-write | 每个 Query 都带 write/effect spy=0 |

| 项 | 改动前 | 改动后 |
|---|---|---|
| 协议覆盖 | 少量旧操作 | 3C/5Q/5E/17J 全部独立行 |
| 状态覆盖 | 口语成功/失败 | 18 正式状态主语逐项合法/非法断言 |
| 外部失败 | timeout→failed/retry | dispatch knowledge + CommitUnknown + exact probe |
| evidence | 查看日志 | 每个 case 预留 EV-CAND，Step 13 才固定 raw/report/EV |

## 5. 测试设计取舍

| 议题 | 结论 | 理由 |
|---|---|---|
| 26 objects 是否每个单独 TC | 按 CP1～CP6 parameterized object family，行内枚举全部对象；每对象至少 factory/rehydrate/error-no-change vector | 保持分母完整又避免重复模板 |
| 18 states 是否聚合 | 不聚合；每个状态主语独立 TC | 防止状态名与边漂移 |
| 30 entries 是否聚合 | 不聚合主线；每个入口独立 TC，通用 duplicate/UoW 在横切表补强 | 保证 callable surface 无孤儿 |
| blocked positive 是否删除 | 不删除；同一入口保留 formal-fixture positive 和 local negative | P0 requiredness 可见 |
| evidence 是否正式编号 | 暂用 `EV-CAND-*`；Step 13 转正式 family | 不从静态表造 evidence |

## 6. 结构化中间产物

### 6.1 用例批次总表

| 批次 | CUT | 主要场景 | 优先级 | 前置类别 | evidence 候选 |
|---|---|---|---|---|---|
| A | CONTRACT/OBJECT/STATE | DTO/ref、26 object invariant、18 state edge | P0 | builders/property vectors | CONTRACT/OBJECT/STATE |
| B | COMMAND/QUERY/CONSUMER/JOB | 30 logical/32 methods、entry mapping、report/receipt | P0 | entry envelopes + service fixtures | COMMAND/QUERY/CONSUMER/JOB |
| C | UOW/IDEMPOTENCY/EFFECT/AUTHORITY/RESTORE | atomicity、replay、probe、source owner、handoff | P0 | fault/concurrency/formal-seam fixtures | UOW/IDEMP/EFFECT/AUTHORITY/RESTORE |
| D | CONFIG/SECURITY/OBSERVE/DEPENDENCY/RESOURCE/REPORT | config/VETO/redaction/static/bounds/evidence | P0 | config/canary/graph/run fixtures | CONFIG/SECURITY/OBSERVE/DEPENDENCY/NFR/REPORT |

### 6.2 Contract 与 26 个正式对象用例

| 用例 ID | 场景 | 前置/操作 | 预期与关键断言 | 自动化 | evidence 候选 |
|---|---|---|---|---|---|
| `TC-AR-CONTRACT-001` | public DTO round-trip | 构造 3C/5Q/5E/17J envelope、payload、response/receipt/report 全 variant 后 serialize/deserialize | typed ref、metadata、surface/disposition、item、issue、page、recorded_at 无丢失；domain/private cursor/raw body 不出现 | 是 | `EV-CAND-AR-CONTRACT-001` |
| `TC-AR-CONTRACT-002` | required metadata missing | 分别删除 command actor/key、event id/source/version/dedup/trace、job claim/run metadata | `MissingRequiredField/InvalidInput`；不解析 payload、不 begin UoW/reserve/claim/port | 是 | `EV-CAND-AR-CONTRACT-002` |
| `TC-AR-CONTRACT-003` | wrong kind/unsupported version | wrong finite protocol name、wrong typed ref、unknown event/schema version | `WrongKind/UnsupportedVersion/Mismatch`；无 accepted receipt 或 mutation | 是 | `EV-CAND-AR-CONTRACT-003` |
| `TC-AR-CONTRACT-004` | envelope/payload 与 public/private 边界 | payload 重复 actor/key/trace；public cursor 注入 repository cursor；raw provider field 注入 DTO | checked construction 拒绝；serialization surface 无 private/raw 字段 | 是 | `EV-CAND-AR-CONTRACT-004` |
| `TC-AR-OBJECT-001` | CP1 request/job objects | parameterize `DeclaredArchiveScope`,`ArchiveRequest`,`ArchiveJob`,`ArchiveJobStageRecord` 的 valid/invalid builder 与 rehydrate | scope 非空/版本固定；admission/stage/history 不变量；失败 self/version/history 不变 | 是 | `EV-CAND-AR-OBJECT-001` |
| `TC-AR-OBJECT-002` | CP2 source/capture objects | parameterize `ArchiveSourceBinding`,`CaptureAttempt`,`CaptureCoverage`,`SourceCaptureFinding` | authority/contract/fence/version/coverage/correlation 保真；late/conflict 不覆盖历史 | 是 | `EV-CAND-AR-OBJECT-002` |
| `TC-AR-OBJECT-003` | CP3 Bundle/manifest/closure objects | parameterize `ArchiveBundle`,`BundleManifest`,`ManifestEntry`,`ManifestClosure`,`ClosureFinding` | immutable revision、declared/actual exact set、difference/finding 与 seal basis 一致 | 是 | `EV-CAND-AR-OBJECT-003` |
| `TC-AR-OBJECT-004` | CP4 assessment objects | parameterize `VerificationAssessment`,`CompatibilityAssessment`,`VerificationFinding` | input/revision/target/capability 固定；Unknown/Unsupported/IntegrityFailed 不升格 | 是 | `EV-CAND-AR-OBJECT-004` |
| `TC-AR-OBJECT-005` | CP5 placement/lifecycle objects | parameterize `ArchivePlacement`,`GovernanceDecisionRef`,`LifecycleExecution`,`ExternalActionRecord` | decision applicability、effect target/key、placement/retrieval/lifecycle axes 独立；ACK≠commit | 是 | `EV-CAND-AR-OBJECT-005` |
| `TC-AR-OBJECT-006` | CP6 restore objects | parameterize `RestoreRequest`,`RestorePlan`,`RestoreItem`,`RestoreHandoff`,`HandoffOutcome`,`CompensationRecord` | owner/item set 与 revision 固定；outcome 隔离；compensation 不覆盖原 handoff | 是 | `EV-CAND-AR-OBJECT-006` |

以上六行覆盖 `2 contracts + 24 domain = 26` 的唯一正式对象分母；support carrier、DTO、view、runtime marker 不被误计为第 27 个业务对象。

### 6.3 十八个状态主语用例

| 用例 ID | 状态主语 | 正向边 | 关键非法/传播断言 | evidence 候选 |
|---|---|---|---|---|
| `TC-AR-STATE-001` | `RequestAdmissionState` | none→Accepted/Rejected/Blocked | 三者终态；Accepted≠archived/restored；终态不原地修复 | `EV-CAND-AR-STATE-001` |
| `TC-AR-STATE-002` | `JobAggregatePosture` | Queued→Running；Running↔Partial；→Blocked/Failed/Completed | 仅 exact committed components 聚合；单项成功不 Completed | `EV-CAND-AR-STATE-002` |
| `TC-AR-STATE-003` | `ArchiveJobStage` | archive/restore 各自 ordered path | 不跳 stage、不混 kind；Blocked/Failed 不伪装成 stage | `EV-CAND-AR-STATE-003` |
| `TC-AR-STATE-004` | `SourceBindingState` | Planned/Blocked→Bound；→Blocked/Retired | 无 authority/contract 不 Bound；workspace 不补；Retired 不复活 | `EV-CAND-AR-STATE-004` |
| `TC-AR-STATE-005` | `CaptureAttemptState` | Requested/Blocked→InProgress→Settled/Blocked/Failed；→Superseded | wrong fence/version 拒绝；unknown 不当 Failed/Settled；旧结果不覆盖 replacement | `EV-CAND-AR-STATE-005` |
| `TC-AR-STATE-006` | `ArchiveBundleState` | Draft/Blocked→Assembling→ClosureReady→Sealed | incomplete/old revision/assessment/storage basis 不 seal；Sealed≠project archived | `EV-CAND-AR-STATE-006` |
| `TC-AR-STATE-007` | `VerificationPosture` | Pending→InProgress→四类终态 | fake/config/digest ref 不造 Verified；重验创建新 assessment | `EV-CAND-AR-STATE-007` |
| `TC-AR-STATE-008` | `PlacementState` | IntentRecorded→Dispatched→Committed/Unknown/Blocked/Failed | ACK/timeout 不 Committed；CommitUnknown 只 exact probe | `EV-CAND-AR-STATE-008` |
| `TC-AR-STATE-009` | `RetrievalState` | Unknown/NotRequested→Requested→Retrievable/Unavailable/Failed/Unknown | placement committed 不推出 Retrievable；Unknown 不产 restore material | `EV-CAND-AR-STATE-009` |
| `TC-AR-STATE-010` | `LifecycleExecutionState` | Eligible→Intent→Dispatched→Acknowledged/Committed/Unknown/Blocked/Failed；→Compensated | decision/hold 重核；ACK≠commit；compensation 不抹历史 | `EV-CAND-AR-STATE-010` |
| `TC-AR-STATE-011` | `ExternalActionPosture` | Intent→Dispatched→Acknowledged/Committed/Unknown/Failed | mismatched target/key/digest 拒绝；unknown 不盲重发 | `EV-CAND-AR-STATE-011` |
| `TC-AR-STATE-012` | `RestorePlanState` | Draft/Blocked/Ready/InProgress/Partial→允许边/HandoffComplete | 聚合不隐藏 per-item unknown；HandoffComplete≠restored；Superseded 不复活 | `EV-CAND-AR-STATE-012` |
| `TC-AR-STATE-013` | `RestoreItemState` | Planned→MaterialReady→HandoffPending→InProgress→outcome/compensation | 一 item/owner 不改变其他项；Succeeded≠project restored | `EV-CAND-AR-STATE-013` |
| `TC-AR-STATE-014` | `RestoreHandoffState` | Intent→Dispatched/Acknowledged→outcome/ReconcileRequired | ACK≠receiver commit；late conflict append-only；reconcile 不重派 | `EV-CAND-AR-STATE-014` |
| `TC-AR-STATE-015` | `CompensationState` | Planned→InProgress→Completed/Failed/Unknown/Blocked | 无 authority 不开始；Completed 不改原 handoff 为成功 | `EV-CAND-AR-STATE-015` |
| `TC-AR-STATE-016` | `ArchiveIdempotencyState` | absent→Reserved→Completed/Conflict | Completed 缺 result 为 corrupt；Conflict/Completed 终态；无 timeout takeover | `EV-CAND-AR-STATE-016` |
| `TC-AR-STATE-017` | `WorkerEntryState` | Registered/Delayed→Running→Completed/Failed/Stopped | 仅进程内；不作为 durable business success 或 claim proof | `EV-CAND-AR-STATE-017` |
| `TC-AR-STATE-018` | `WorkerClaimState` | none→Active→renew/Released/Expired/Superseded | old fence 零 write/effect；expiry 不证明 external rollback | `EV-CAND-AR-STATE-018` |

每行必须 parameterize 全部正式允许边与至少一个非法边，并断言 `DomainError::InvalidTransition/VersionConflict/InputMismatch/StaleClaim` 中的正式适用 variant、self/version/history 不变。自动化候选均为“是”。

### 6.4 三个 Command 用例

| 用例 ID | 协议 | 前置与操作 | 预期结果与断言 | 执行姿态 | evidence 候选 |
|---|---|---|---|---|---|
| `TC-AR-COMMAND-001` | C01 `RequestArchive` | valid checked scope/authority；执行 first admission | request+job+Queued stage+complete result/reservation 同 UoW；`Accepted` 仅本地受理 | authority formal positive blocked；local vector executable | `EV-CAND-AR-COMMAND-001` |
| `TC-AR-COMMAND-002` | C01 | missing scope/authority、same/same、same/different、commit Unknown | Rejected/Blocked、完整 Duplicate、Conflict 原记录不变、Unknown 只 probe；无 owner write | negative executable | `EV-CAND-AR-COMMAND-002` |
| `TC-AR-COMMAND-003` | C02 `RequestRestore` | valid Bundle revision/non-empty unique owner set/authority；admit | restore request+job+Queued stage 原子；不 resolve receiver、不产 material、不写 owner | owner/authority positive blocked；local executable | `EV-CAND-AR-COMMAND-003` |
| `TC-AR-COMMAND-004` | C02 | stale/missing/integrity-failed/unsupported Bundle；empty/duplicate owners；duplicate/conflict | Blocked/Rejected/Conflict；no receiver call；Accepted 不等 restored | negative executable | `EV-CAND-AR-COMMAND-004` |
| `TC-AR-COMMAND-005` | C03 `RequestLifecycleExecution` | exact bundle revision/decision/action；current decision lookup | only `LifecycleExecution`+initial intent+result committed；zero storage dispatch | governance positive blocked；local executable | `EV-CAND-AR-COMMAND-005` |
| `TC-AR-COMMAND-006` | C03 | decision missing/stale/conflicting/hold、unsupported action、duplicate/commit unknown | Blocked/Rejected/Conflict/CommitUnknown；zero dispatch/delete；不创造 retention/risk decision | negative executable | `EV-CAND-AR-COMMAND-006` |

### 6.5 五个 Query 用例（strict no-write）

每行都在 telemetry enabled/disabled 两组运行，并断言 `begin_uow/reserve/save/append/complete/claim/external_port = 0`。

| 用例 ID | 协议 | 场景与操作 | 预期结果与断言 | evidence 候选 |
|---|---|---|---|---|
| `TC-AR-QUERY-001` | Q01 `GetArchiveJobStatus` | visible job/page；absent/hidden/revoked；cursor snapshot/selector mismatch | `Visible/NotAvailable/Stale/Unknown`；stage/components同 snapshot；不推导 project state | `EV-CAND-AR-QUERY-001` |
| `TC-AR-QUERY-002` | Q02 `GetArchiveBundle` | exact revision；incomplete closure；hidden；page continuation | manifest/closure/placement/lifecycle 同 revision；`Partial/NotAvailable/Stale`；不 assembly/repair/retrieve | `EV-CAND-AR-QUERY-002` |
| `TC-AR-QUERY-003` | Q03 `VerifyArchiveBundle` | read existing matching assessments；missing/wrong target/Unknown/Unsupported/IntegrityFailed | posture 原样；不调用 integrity/compatibility、不创建 assessment、不假 Verified | `EV-CAND-AR-QUERY-003` |
| `TC-AR-QUERY-004` | Q04 `GetRestorePlan` | visible multi-owner plan；missing item；superseded revision；visibility filtering | plan state不由可见子集重算；`Partial/Stale/NotAvailable`；zero material/receiver/compensation | `EV-CAND-AR-QUERY-004` |
| `TC-AR-QUERY-005` | Q05 `GetRestoreHandoffStatus` | exact handoff/item history；CommitUnknown/ReconcileRequired；hidden | per-owner history与姿态保真；不 probe/retry/compensate；不推导 restored | `EV-CAND-AR-QUERY-005` |

### 6.6 五个 Inbound Consumer 用例

| 用例 ID | 协议 | 主线与关键负向 | 预期结果与断言 | 执行姿态 | evidence 候选 |
|---|---|---|---|---|---|
| `TC-AR-CONSUMER-001` | E01 `ConsumeArchiveTrigger` | valid owner trigger；unsupported/unknown source/missing envelope；duplicate | 只形成 local observation/admission context + complete receipt；不绕 authority、不改 project；envelope invalid 不 parse payload | real event blocked；local mapping executable | `EV-CAND-AR-CONSUMER-001` |
| `TC-AR-CONSUMER-002` | E02 `ConsumeSourceExportFeedback` | exact attempt/fence/material/coverage；wrong attempt/fence、partial/stale/missing/conflict、late duplicate | exact feedback 才 settle；异常保留 finding；不把 unknown 当 empty；完整 receipt replay | owner positive blocked；negative executable | `EV-CAND-AR-CONSUMER-002` |
| `TC-AR-CONSUMER-003` | E03 `ConsumeGovernanceDecisionChange` | correlated change；stale/conflicting/hold/revoked；dependency unavailable | event 不等 current decision；保存 blocked/re-evaluation basis；zero lifecycle dispatch/compensate/owner write | governance positive blocked | `EV-CAND-AR-CONSUMER-003` |
| `TC-AR-CONSUMER-004` | E04 `ConsumeStorageActionFeedback` | persisted target 分别为 Placement/Lifecycle；ACK/commit/unknown/wrong key/target | 两个 method surface 互斥；ACK≠commit；lifecycle 重核 decision；不得双路写 | storage positive blocked；routing negative executable | `EV-CAND-AR-CONSUMER-004` |
| `TC-AR-CONSUMER-005` | E05 `ConsumeRestoreReceiverFeedback` | exact owner/receiver/effect；ACK/succeeded/rejected/partial/conflict/unknown；duplicate | per-owner outcome append；一项不广播；Succeeded 不等 restored；zero owner DB write | receiver positive blocked；negative executable | `EV-CAND-AR-CONSUMER-005` |

所有 consumer 还共享：unsupported version 在 payload parse 前返回；`ArchiveConsumerReceipt` 的 disposition/result/item/issues/local_commit 全字段 round-trip；`Accepted` 只证明 Archive-local commit，transport ACK/delivery truth 仍不由本仓声称。

### 6.7 十七个 Operations Job 用例

| 用例 ID | Job | 主线/故障注入 | 核心断言 | 执行姿态 | evidence 候选 |
|---|---|---|---|---|---|
| `TC-AR-JOB-001` | J01 `AdvanceArchiveJob` | exact committed components；illegal skip/kind、stale version/fence | 只推进合法 stage/posture；job+stage+checkpoint+report 同提交；不从局部成功聚合 Completed | local executable | `EV-CAND-AR-JOB-001` |
| `TC-AR-JOB-002` | J02 `PlanArchiveSources` | declared scope→8-class required bindings；missing contract/Auxiliary fallback；bind unknown | Planned set 完整先提交；workspace 永 Auxiliary；无 exact bind probe 时保留 Blocked/Unknown | owner positive blocked | `EV-CAND-AR-JOB-002` |
| `TC-AR-JOB-003` | J03 `CaptureArchiveSource` | exact binding/attempt/fence capture；partial/stale/missing/MayHaveDispatched | intent/attempt 先 durable；coverage/finding 保真；unknown 不 blind recapture | owner positive blocked | `EV-CAND-AR-JOB-003` |
| `TC-AR-JOB-004` | J04 `ReconcileSourceCapture` | persisted fixed input→probe；NotFound/unknown/conflict/late result | 仅 exact probe；NotFound≠no effect；old attempt 不覆盖 replacement | owner positive blocked | `EV-CAND-AR-JOB-004` |
| `TC-AR-JOB-005` | J05 `AssembleBundleManifest` | committed frozen inventory；missing/extra/phantom/range race | immutable manifest revision；exact difference/finding；incomplete/overfull 不 ClosureReady | local executable | `EV-CAND-AR-JOB-005` |
| `TC-AR-JOB-006` | J06 `SealArchiveBundle` | exact closure/assessment/placement basis；old/mismatch/Unknown/ACK-only | 只有 exact Complete+Verified+Supported+Committed 才 Sealed；不生成 digest/signature；Sealed≠archived | local guard executable；positive inputs blocked | `EV-CAND-AR-JOB-006` |
| `TC-AR-JOB-007` | J07 `AssessBundleIntegrity` | fixed binding→typed assessment；capability absent/mismatch/unknown/failure | assessment immutable；无正式算法/key 不造 Verified；finding/result 同提交 | capability positive blocked | `EV-CAND-AR-JOB-007` |
| `TC-AR-JOB-008` | J08 `AssessBundleCompatibility` | exact revision/schema/target；unsupported/conflict/unknown | target-specific immutable result；不自动 migrate、不复用其他 target success | capability positive blocked | `EV-CAND-AR-JOB-008` |
| `TC-AR-JOB-009` | J09 `PlaceArchiveBundle` | intent commit→storage call→outcome；crash before/after call；ACK/timeout | no intent commit→zero call；ACK≠Committed；MayHaveDispatched→CommitUnknown/J12 | storage positive blocked | `EV-CAND-AR-JOB-009` |
| `TC-AR-JOB-010` | J10 `RetrieveArchiveBundle` | exact placement/revision→retrieval；unavailable/unknown/mismatch | retrieval intent与placement commit分离；Retrievable需正式 observation；unknown不产 restore material | storage positive blocked | `EV-CAND-AR-JOB-010` |
| `TC-AR-JOB-011` | J11 `ExecuteArchiveLifecycle` | current decision/hold check→intent→effect；hold appears before dispatch；unknown | dispatch前重核/read-set；无 authority/hold→Blocked/zero effect；ACK≠commit | governance/storage positive blocked | `EV-CAND-AR-JOB-011` |
| `TC-AR-JOB-012` | J12 `ReconcileExternalAction` | persisted target分别路由 placement/lifecycle；probe result/NotFound/unknown | 两 surfaces 互斥；original effect key/input；NotFound不重派；history append-only | storage positive blocked | `EV-CAND-AR-JOB-012` |
| `TC-AR-JOB-013` | J13 `BuildRestorePlan` | fixed request/Bundle/owner set；per-owner receiver resolution；one missing/mismatch | immutable plan revision与完整 item set；一 owner Blocked不隐藏；无跨 owner transaction | receiver positive blocked | `EV-CAND-AR-JOB-013` |
| `TC-AR-JOB-014` | J14 `PrepareRestoreMaterial` | exact item/revision/eligibility；partial/stale/missing/unsupported/integrity-failed | 只 owner-approved minimum material/ref；任一 fail-closed posture 不 MaterialReady；无 Bundle 写权转换 | source/material positive blocked | `EV-CAND-AR-JOB-014` |
| `TC-AR-JOB-015` | J15 `DispatchRestoreHandoff` | current receiver exact match→intent→dispatch；mapping drift/crash/unknown | drift时 zero intent/dispatch且需新 plan revision；intent-before-effect；unknown→J16 | receiver positive blocked | `EV-CAND-AR-JOB-015` |
| `TC-AR-JOB-016` | J16 `ReconcileRestoreHandoff` | original handoff/effect probe；late accepted/rejected/conflict/unknown | exact receiver/key/input；unknown可保持；late outcome append且不改其他 owner | receiver positive blocked | `EV-CAND-AR-JOB-016` |
| `TC-AR-JOB-017` | J17 `ExecuteRestoreCompensation` | formal compensation authority→intent/effect/probe；missing/stale/unknown | 无 authority零 effect；compensation 独立记录；Completed不把原 handoff改为 Succeeded | receiver/governance positive blocked | `EV-CAND-AR-JOB-017` |

每个 Job 还必须执行 common vectors：wrong claim/fence、same/same完整 report replay、same/different conflict、completed-result missing、local commit unknown、cancellation at each commit boundary、partial 新 invocation 只含显式 unresolved targets。E04/J12 两个 method surfaces 均已覆盖，入口分母仍为 30 logical / 32 methods。

### 6.8 UoW、幂等、外部 effect 与恢复用例

| 用例 ID | 场景 | 操作/注入 | 预期与关键断言 | evidence 候选 |
|---|---|---|---|---|
| `TC-AR-UOW-001` | local atomic rollback | 在 request/job/stage/result/receipt/report 任一点 fail | accepted truth、history、complete result 与 reservation 全部可见或全部不可见 | `EV-CAND-AR-UOW-001` |
| `TC-AR-UOW-002` | CAS + range/negative read-set | concurrent version change、required manifest/source/item phantom | stale writer `VersionConflict/Aborted`；不可 seal/complete；无 last-write-wins | `EV-CAND-AR-UOW-002` |
| `TC-AR-UOW-003` | commit unknown probe | commit response lost，probe returns committed/aborted/unknown | 仅 `transaction_ref` exact probe；unknown不重做 mutation；结果关系一致 | `EV-CAND-AR-UOW-003` |
| `TC-AR-UOW-004` | claim fence | old worker在new fence后保存 truth/result/checkpoint或派发 | 所有 old-fence commit/effect 被拒绝；lease不替代CAS | `EV-CAND-AR-UOW-004` |
| `TC-AR-IDEMP-001` | same key/same canonical input | 并发/顺序重复 Command/Consumer/Job | exactly one body/effect；后续完整 field-equivalent result/receipt/report replay | `EV-CAND-AR-IDEMP-001` |
| `TC-AR-IDEMP-002` | same key/different input | 改任一语义字段，保持 volatile metadata变化对照 | semantic diff→Conflict且原记录不变；仅 trace/time/attempt diff 不改变 digest | `EV-CAND-AR-IDEMP-002` |
| `TC-AR-IDEMP-003` | Reserved/Completed corrupt | second writer、completed result missing/wrong kind | 不 timeout takeover；`ResultMissing/ConsistencyDefect`；zero recompute/effect | `EV-CAND-AR-IDEMP-003` |
| `TC-AR-IDEMP-004` | partial resume | first report has mixed outcomes；new key targets explicit unresolved subset | 已成功 target 零调用/零改写；新 report保留关联；不扫描全量重跑 | `EV-CAND-AR-IDEMP-004` |
| `TC-AR-EFFECT-001` | intent-before-effect | fail before intent commit / after commit before dispatch | 前者 zero port；后者可由 fixed intent恢复，不伪造 outcome | `EV-CAND-AR-EFFECT-001` |
| `TC-AR-EFFECT-002` | dispatch knowledge | NotDispatched vs MayHaveDispatched timeout/error | 前者仅依正式政策；后者 CommitUnknown + exact reconcile，禁止 blind retry | `EV-CAND-AR-EFFECT-002` |
| `TC-AR-EFFECT-003` | correlation mismatch/late outcome | wrong target/key/input、superseded attempt、late feedback | `InputMismatch/Conflict`，原历史不覆盖；late observation可追溯 | `EV-CAND-AR-EFFECT-003` |
| `TC-AR-EFFECT-004` | external finality axes | ACK、commit、retrievable、receiver success、compensation combinations | 每一轴独立；无横向传播或 global success | `EV-CAND-AR-EFFECT-004` |

UoW/durable restart 的真实正向因 `AR-03-LOCAL-001/003/004` 保持 blocked；scripted fake 只能证明调用序与映射，不能成为 durability/restart evidence。

### 6.9 Source authority 与 restore 边界用例

| 用例 ID | 场景 | 输入/操作 | 必须断言 | evidence 候选 |
|---|---|---|---|---|
| `TC-AR-AUTHORITY-001` | 8 source classes totality | identity/conversation/work/process/governance/artifact/workspace/observability 各建 binding vector | class、formal owner、requiredness、version/fence/coverage/provenance独立；无 universal schema | `EV-CAND-AR-AUTHORITY-001` |
| `TC-AR-AUTHORITY-002` | owner/source mismatch | 用 identity contract 绑定其他 class，或跨 owner opaque version 比较 | `Mismatch/ContractBlocked`；不 fallback/fill | `EV-CAND-AR-AUTHORITY-002` |
| `TC-AR-AUTHORITY-003` | workspace Auxiliary | workspace projection complete但 canonical source missing | global closure仍 partial/blocked；projection 永不升格 | `EV-CAND-AR-AUTHORITY-003` |
| `TC-AR-AUTHORITY-004` | artifact/observability ref/body | 仅 ref或摘要尝试声称正文/lineage/完整审计链 | closure/verification拒绝；raw body不入 Archive truth | `EV-CAND-AR-AUTHORITY-004` |
| `TC-AR-AUTHORITY-005` | cross-domain write absence | 对所有 source/receiver adapter spy、store schema与call graph扫描 | Archive只写自身对象；owner DB/import内部不可访问 | `EV-CAND-AR-VETO-001` |
| `TC-AR-RESTORE-001` | plan owner set totality | multi-owner plan含 ready/blocked/unsupported/unknown items | frozen set全保留；plan posture保守；一 owner不传播 | `EV-CAND-AR-RESTORE-001` |
| `TC-AR-RESTORE-002` | material eligibility | stale/missing/conflicting/unsupported/integrity-failed/retrieval unknown combinations | 每一组合 fail-closed；不生成/派发 material | `EV-CAND-AR-RESTORE-002` |
| `TC-AR-RESTORE-003` | receiver mapping drift | plan receiver与dispatch-time current mapping不同 | J15 zero intent/effect；old plan不原地改，需新 revision | `EV-CAND-AR-RESTORE-003` |
| `TC-AR-RESTORE-004` | outcome isolation | concurrent accepted/rejected/partial/unknown across owners/items | per-item CAS/history；无 all-owner rollback/success；HandoffComplete≠restored | `EV-CAND-AR-RESTORE-004` |
| `TC-AR-RESTORE-005` | compensation authority | missing/conflicting/formal authority，原 handoff failed/unknown | only exact authorized action executes；compensation不抹原 outcome或改 owner truth | `EV-CAND-AR-RESTORE-005` |

### 6.10 配置、安全、观测、依赖、资源与报告用例

| 用例 ID | 场景 | 前置/操作 | 预期与断言 | evidence 候选 |
|---|---|---|---|---|
| `TC-AR-CONFIG-001` | 55-key strict profile coverage | 对 12 配置域逐键提供 valid/absent/invalid candidate；覆盖 `local-dev`、`ci-test`、`integration-like`、`operations-replay` 语义 | 55/55 键均有 owner、类型、requiredness、失败姿态；未知/重复/非法值 fail-fast；不产生隐式默认 | `EV-CAND-AR-CONFIG-001` |
| `TC-AR-CONFIG-002` | source priority/conflict | `DECL < JSON < ENV` 正常和高优先级非法 winner、duplicate/alias/unknown key | 合法高优先级胜出；非法 winner 拒绝而不回退旧值；candidate 不部分激活 | `EV-CAND-AR-CONFIG-002` |
| `TC-AR-CONFIG-003` | exact assembly gate | 缺 required slot、mismatch、Degraded、required Disabled、fake marker | `ArchiveRuntimeAssembly` 不暴露 capability facade；production 不注册 fake；Ready 不被解释为 integration/readiness | `EV-CAND-AR-CONFIG-003` |
| `TC-AR-CONFIG-004` | pinning/change/rollback | 新 config identity 与旧 work/run 并存；尝试 hot/reload/current config 重建旧 effect | old operation 使用 pinned identity；unsupported reload/override rejected；历史不删、不漂移 | `EV-CAND-AR-CONFIG-004` |
| `TC-AR-SECURITY-001` | redaction denylist | 将 raw secret/token/private key、provider/body、业务正文、selector/key/digest/location 作为 canary 输入 | logs/metrics/spans/native records/reports/API error 均零泄露；hash/trace 不绕过 denylist | `EV-CAND-AR-SECURITY-001` |
| `TC-AR-SECURITY-002` | visibility/authority disclosure | absent/hidden/revoked/unsafe-to-decide 与 current visibility 变化 | Query 统一 `NotAvailable` 或 safe posture；不枚举隐藏对象、不复活旧 payload、不改 truth | `EV-CAND-AR-SECURITY-002` |
| `TC-AR-OBSERVE-001` | telemetry non-interference | telemetry enabled/disabled、sink unavailable、redaction failure | 业务结果/native durable records 不因 sink 改变；Query 两组仍零写；sink 失败只 degraded/drop | `EV-CAND-AR-OBSERVE-001` |
| `TC-AR-OBSERVE-002` | durable review boundary | request/binding/finding/intent/outcome/result/checkpoint 与 runtime signal 对照 | native records 可随 UoW 追溯；runtime telemetry 不冒充 truth/evidence；observability handoff 未闭合保持 blocked | `EV-CAND-AR-OBSERVE-002` |
| `TC-AR-DEPENDENCY-001` | dependency type classification | 静态 graph 检查 core-contracts candidate、L1/runtime/ref/adapter/event、SDK/provider | 只有核验 shared contract 可 compile；无 SDK 反向 compile、无 provider package、无伪造 outbound | `EV-CAND-AR-DEPENDENCY-001` |
| `TC-AR-DEPENDENCY-002` | outbound absence | 搜索 outbox/publisher/topic/delivery/ready event surface 与配置 | `AR-HLD-Q-001` 未解锁时全部 absent/blocked；不产 outbound evidence | `EV-CAND-AR-DEPENDENCY-002` |
| `TC-AR-RESOURCE-001` | bounded work | request/page/source/bundle/restore/worker positive bound 的 L/L+1 与 empty/full vectors | 超界返回 typed invalid/partial/blocked；不静默截断或 Complete；不填来源外数字 | `EV-CAND-AR-NFR-001` |
| `TC-AR-RESOURCE-002` | dependency degradation | 单 source/storage/receiver/visibility/telemetry sink 失败 | 已知局部记录可读；global posture 保守；无 timeout→success 或无限 retry | `EV-CAND-AR-NFR-002` |
| `TC-AR-REPORT-001` | report completeness | 成功、失败、partial、blocked、unknown 的 command/consumer/job report | result_ref、processed items、related refs、continuation、stage、issues 全在报告；failure 仍产出可审查结构 | `EV-CAND-AR-REPORT-001` |
| `TC-AR-REPORT-002` | raw/report pairing | run-scoped raw artifact 与 human report 配对；缺 raw、跨 run、latest、静态手写 index | pairing 缺失即 blocked；只允许固定 `<run_id>`；不由静态映射制造 EV | `EV-CAND-AR-REPORT-002` |

### 6.11 VETO / phase boundary 组合用例

| 用例 ID | 一票否决风险 | 组合操作 | 必须阻断的结果 |
|---|---|---|---|
| `TC-AR-VETO-001` | cross-domain write | 让 restore/lifecycle/source adapter 尝试写 owner DB、project state 或 governance decision | 入口拒绝或零调用；只允许 owner-specific handoff/ref；VETO |
| `TC-AR-VETO-002` | false global state | 组合 `Accepted`、`Sealed`、`Verified`、`Eligible`、`MaterialReady`、item `Succeeded` | 不出现 archived/dissolved/restored/owner committed/global complete 推断；VETO |
| `TC-AR-VETO-003` | missing authority success | 缺 source/decision/hold/integrity/storage/receiver/schema 任一正式 basis | `Blocked/Unknown/Unsupported/IntegrityFailed`；不派发、不 seal、不 material-ready；VETO |
| `TC-AR-VETO-004` | projection/ref/fake truth | workspace projection、artifact ref 集合、observability summary、test fake 代替 canonical/material | classification reject 或 Auxiliary/blocked；不 closure/verified/restore success；VETO |
| `TC-AR-VETO-005` | untraceable/blind replay | 删除 result/history/effect key 或注入 external unknown 后直接 retry | `ResultMissing/ConsistencyDefect/CommitUnknown`；exact probe only；VETO |

## 7. 逐 CUT 停审记录

| CUT | 设计来源 | 正向/负向/边界 | 数据前置 | 自动化与 evidence | 停审结论 |
|---|---|---|---|---|---|
| `CUT-AR-CONTRACT` | 03 §7、Step 08 | round-trip、metadata、unsupported、private/raw boundary | typed DTO builders | automated；EV-CAND-CONTRACT | 通过 |
| `CUT-AR-OBJECT` | 03 §5.2、Step 06 | 26 object factory/rehydrate/invariant | object fixture vectors | automated；EV-CAND-OBJECT | 通过 |
| `CUT-AR-STATE` | 03 §9、Step 10 | 18 state legal/illegal/non-propagation | state seed + expected edge | automated；EV-CAND-STATE | 通过 |
| `CUT-AR-COMMAND` | 03 C01～C03/flows | accepted/rejected/blocked/duplicate/conflict/unknown | command envelope + local store fake | automated；EV-CAND-COMMAND | 通过，real owner positive blocked |
| `CUT-AR-QUERY` | 03 Q01～Q05 | visible/not available/partial/stale/unknown/no-write | committed read snapshot + visibility | automated spies；EV-CAND-QUERY | 通过，cursor positive blocked |
| `CUT-AR-CONSUMER` | 03 E01～E05 | envelope/dedup/late/ACK/receipt | trusted event envelope | automated；EV-CAND-CONSUMER | 通过，real event blocked |
| `CUT-AR-JOB` | 03 J01～J17 | claim/fence/checkpoint/partial/report/replay | job metadata + fault harness | automated；EV-CAND-JOB | 通过，real seam blocked |
| `CUT-AR-UOW` | 03 §10/11 | atomicity/CAS/range/fence/probe | faulting UoW/store | automated；EV-CAND-UOW | 通过，durable proof blocked |
| `CUT-AR-IDEMPOTENCY` | 03 §12 | same/same、same/different、missing result、partial resume | operation key/input vectors | automated；EV-CAND-IDEMP | 通过，codec/durable blocked |
| `CUT-AR-EFFECT` | 03 §9/11/12 | intent/dispatch knowledge/reconcile/finality axes | effect adapter spy/fault | automated；EV-CAND-EFFECT | 通过，provider blocked |
| `CUT-AR-AUTHORITY` | 00 §11、03 §7.5 | source matrix、owner mismatch、Auxiliary/ref/body | per-source authority vectors | automated negative；EV-CAND-AUTHORITY | 通过，owner positive blocked |
| `CUT-AR-RESTORE` | 03 CP6/J13～J17 | owner set/material/handoff/outcome/compensation | multi-owner plan vectors | automated negative；EV-CAND-RESTORE | 通过，receiver blocked |
| `CUT-AR-CONFIG` | 04 §7～12 | 55 keys、strict load、assembly、pinning | profile/config candidates | automated static/contract；EV-CAND-CONFIG | 通过，production assembly blocked |
| `CUT-AR-SECURITY` | 03 §14、04 §8 | denylist/visibility/disclosure | canary sensitive values | automated scans；EV-CAND-SECURITY | 通过 |
| `CUT-AR-OBSERVE` | 03 §14、04 §12 | telemetry/native/handoff non-interference | sink modes/failure | automated; EV-CAND-OBSERVE | 通过，handoff blocked |
| `CUT-AR-DEPENDENCY` | 01 §8、03 §13 | compile/runtime/event/ref/adapter/fake/outbound absence | graph/config scan | automated static；EV-CAND-DEPENDENCY | 通过，SDK direction blocked |
| `CUT-AR-RESOURCE` | 00 §13、04 budgets | bound L/L+1、degraded progress | bounded profile vectors | automated, thresholds pending；EV-CAND-NFR | 通过，numeric claim blocked |
| `CUT-AR-REPORT` | 03 §7/15、test standard | report complete、raw pairing、no static/latest | run-scoped artifact fixture | automated audit；EV-CAND-REPORT | 通过 |

## 8. 跨用例 / phase 审计

| 审计项 | 结论 | 说明 |
|---|---|---|
| 30 logical / 32 method surfaces | 通过 | 3C + 5Q + 5E + 17J；E04/J12 placement/lifecycle 互斥分支均有用例 |
| 26 objects / 18 states | 通过 | 对象族完整；18 状态逐行覆盖合法/非法边 |
| 正向与负向平衡 | 通过 | 每族有主线、失败、边界；blocked positive 不被删除 |
| duplicate/unknown/recovery | 通过 | same/same、same/different、result missing、commit unknown、probe、partial resume 均有 case |
| Query no-write | 通过 | 五 Query 每行及 telemetry on/off 均有 zero-write/effect spy |
| phase boundary | 通过 | 不把本地 Accepted/Sealed/Verified 或 item outcome 升格 owner/project 状态 |
| fake vs real seam | 通过 | fake 仅 local contract；owner/storage/receiver/durable positive 明确 blocked |
| evidence ID/路径 | 通过 | 当前仅 EV-CAND；正式 EV/path/script 留 Step 9/13 |
| P0 自动化缺口 | 无 | 所有本地 P0 有自动化候选；real seam 是 blocker 而非人工通过 |
| 旧状态/对象漂移 | 无 | 未使用 historical `ArchivedSnapshot`、固定 provider/期限/性能 |

## 9. 复杂度判断

本 Step 形成 4 个设计批次加 1 个审计批次、6 个对象族、18 状态、30/32 协议面及横切恢复/VETO 组合，共 102 个唯一具体用例候选。继续拆分会重复相同 guard；Step 7 将按 CUT/TC 分配 fixture 与隔离键，Step 9/13 再固定 suite、脚本、artifact/report 和正式 evidence。

## 10. 回填草稿

正式 §6 应回填：用例批次表、协议逐入口主线、18 状态断言、UoW/幂等/effect/restore 组合、配置/安全/观测/依赖/资源/报告用例，以及逐 CUT 停审和跨 phase 审计。正文只能写 planned 测试设计，不得把候选 evidence、fake positive 或 blocker negative 写成执行通过。

## 11. 对上游设计的影响与待确认事项

| 项 | 结论 |
|---|---|
| 03/04 回写缺口 | 无；用例均可使用正式对象、入口、状态、错误和配置 key 表达 |
| 新 owning-project blocker | 无 |
| 持续 blocker/pending | `AR-UP-001～009`、`AR-ARCH-001`、`AR-HLD-Q-001～002`、`AR-03-LOCAL-001～006` |
| 待后续 Step | fixture/seed/cleanup→Step 7；环境/55 key matrix→Step 8；suite/script→Step 9；NFR threshold→Step 10；EV/path→Step 13 |

## 12. 进入 Step 7 门禁

- [x] 每个 P0 CUT 至少有正向或 blocked-positive 主线、关键负向/边界、明确断言和 evidence candidate。
- [x] 3 Command、5 Query、5 Consumer、17 Job 全部有独立主线用例；E04/J12 双 method surface 已覆盖。
- [x] 26 正式对象和 18 状态均可反查具体用例；无孤儿协议/状态/对象。
- [x] Query no-write、duplicate replay、commit unknown、partial resume、authority/no-owner-write、redaction、dependency/outbound absence 已单列。
- [x] 每个 CUT 已停审；跨用例没有重复 ID、phase 越界或 fake closure。
- [ ] 真实测试执行、suite、artifact、report、正式 EV、验收 verdict：未授权/未执行，不能作为本 Step 门禁条件。

当前 `gate_status`：`completed / pass_with_blocked_positive_lanes`。

`next_allowed_action`：按连续授权创建并完成 Step 7；在进入下一步前保留本 Step 停审记录。
