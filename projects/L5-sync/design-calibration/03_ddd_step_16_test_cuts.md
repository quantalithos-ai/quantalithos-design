# Step 16. 测试切口与最小验证清单

> 对应 SOP：`standards/document/详细设计讨论流程_SOP.md` Step 16；回填正式 `03-详细设计.md` §15。
>
> 本步采用 `projects/L1-governance` Step 16 的“模块→协议→状态→一致性→错误/配置/观测”框架，并采用 `projects/L1-workspace` Step 16 的“每个入口独立、外部正向 fixture 不得由 fake 冒充”纪律。数量、对象与业务语义全部以 L5-sync Step 5～15 为准。

## 1. Step 状态与分批计划

| 项目 | 状态 |
|---|---|
| 当前 Step | Step 16：测试切口与最小验证清单 |
| 当前状态 | `completed / stop_review` |
| gate_status | `pass_with_upstream_blockers` |
| 输入基线 | Step 5～15 已停审中间产物；正式 00/01/02 |
| 回填位置 | 正式 `03-详细设计.md` §15 |
| 本步上限 | 只定义未来最小验证入口；不创建测试、fixture、script、artifact、report、evidence、verdict、signoff 或 readiness，不运行测试 |

### 1.1 分批计划

| 批次 | 内容 | 状态 | 停审结论 |
|---|---|---|---|
| 16.1 | 输入、SOP 回答、测试纪律与模块切口 | completed | 测试发现路径只到类别，工具/文件名仍待 04/05/07 |
| 16.2 | 10 Command 与 13 Query 独立切口 | completed | 每个入口均有正向、异常与禁止副作用断言 |
| 16.3 | 3 Consumer、Outbound N/A 与 3 Job 切口 | completed | blocked integration 不被 fake 关闭，job report 只是 local result |
| 16.4 | 17 状态机、持久化/UoW、一致性、错误/恢复 | completed | 合法与非法转换、commit/effect unknown 均有入口 |
| 16.5 | 并发/幂等、配置、观测、证据边界与总审计 | completed | Step 5～15 关键契约均可反查最小验证入口 |

## 2. 本步输入与覆盖责任

| 输入 | 本步承接的验证责任 |
|---|---|
| Step 5 模块主轴 | 五个业务 feature、CLI/orchestration/adapters/operations/composition/config 的职责、依赖方向和证据上限。 |
| Step 6 对象契约 | 29 个关键对象、17 个 lifecycle carrier、factory/helper、不变量、typed ref 与 body-free carrier。 |
| Step 7 Port/Adapter | versioned repository、UoW、idempotency、SDK/Git/fs/metadata/diagnostics/telemetry 接缝和失败归一。 |
| Step 8 协议 | 10 Command、13 Query、3 conditional Consumer、3 Job；Outbound Event=`not_applicable`。 |
| Step 9 flow | 29 条独立 flow、prepare→call→finalize、query zero-write、per-item job 与禁止副作用。 |
| Step 10 状态机 | 17 个正式状态主语、完整矩阵、表外转换非法、跨状态传播。 |
| Step 11～13 | logical persistence、UoW/atomic visibility、commit ambiguity、错误恢复、并发、幂等与 exact replay。 |
| Step 14 | typed runtime config、capability total mapping、immutable runtime binding snapshot、read/write graph 隔离。 |
| Step 15 | closed telemetry schema、低基数、redaction、local durable traceability 与 sink failure isolation。 |

本步不把旧正式 `05-测试方案.md` 当输入；它是 `historical_material`。正式 05 未来必须从本步重新展开，而不能反向改变本步真相源。

## 3. SOP 问题回答

| 问题 | L5-sync 回答 |
|---|---|
| 每个模块至少测什么？ | Feature domain 测 factory/helper/invariant/state；application/orchestration 测调用顺序、UoW/effect 分界、known/unknown；ports/adapters 测 typed mapping、拒绝与 failure normalization；CLI 测显式 intent 与 safe presentation；operations 测 envelope/job/replay；composition/config 测 total binding 与 read/write capability segregation。 |
| 每个接口的正向与异常是什么？ | §7～§10 逐一列出 10 Command、13 Query、3 Consumer、3 Job；正向只证明对应 local contract，异常至少覆盖 validation、blocked/unavailable、version/idempotency、unknown 或 no-write/no-effect。 |
| 状态机如何测？ | Step 10 的 17 个 enum/矩阵是唯一权威；每个状态机至少覆盖完整主线或所有转换表参数化入口，并显式覆盖表外转换、terminal reopen、跨 context/ref/generation 错配。 |
| 事务、一致性、幂等和并发如何测？ | 用 deterministic port/repository/UoW fakes 设计故障注入切口；真实 crash/durability/tool/SDK integration 只在正式 adapter 与上游合同可用后验证。断言 exact write set、call count、version、stored carrier 与 unknown posture，不用日志猜结果。 |
| 哪些内容留给 05？ | suite/case 编号、优先级、fixture 文件、runner、环境、覆盖率、真实联调矩阵、artifact/report/evidence schema、CI gate 与执行安排。 |

## 4. 测试纪律与验证能力分级

1. 本文件中的 `TC-*` 是设计级 test cut identity，不是已存在 test case、文件、运行、结果或证据。
2. `tests/unit`、`tests/contract`、`tests/flow`、`tests/fault` 仅是 Step 4 的 planned 类别；精确文件和 runner 受 `SYNC-LOCAL-004` 约束，不在本步发明。
3. Pure domain、DTO、local flow 的 fake 可证明局部实现遵守已定义契约；fake 不证明 `@quantalithos/sdk`、owner schema、Git/fs、metadata durability 或真实 integration。
4. `SYNC-UP-001~010` 约束的正向切口一律标记 `waiting/blocked`，直到正式 owner/tool/store contract 与 fixture 可构造；不得用 string alias、private endpoint、历史 payload 或手写“成功响应”关闭 blocker。
5. 所有 side-effect spy 以 typed port call count、repository write set 和 UoW boundary 为断言源；telemetry/log absence 不是业务未发生证据。
6. 本项目当前不交付 gate/report/evidence 脚本，因此书写规范 §5.15 的脚本契约表 `not_applicable_at_03`。若 05/07 后续要求脚本，必须先回流 03/04 锁定参数和机器输出，不得从本步虚构。

| 验证层级 | 能证明 | 当前姿态 |
|---|---|---|
| pure unit/property | typed value、factory、policy、状态和 canonicalization 的局部契约 | `planned`；不受真实外部设施影响 |
| application/flow fake | call order、write set、duplicate、known/unknown、禁止调用 | `planned`；只证明 local orchestration |
| repository/UoW contract | version、unique、atomic visibility、commit ambiguity reload | `blocked` by `SYNC-UP-006` physical backend |
| Git/filesystem contract | inspect/stage/apply、dirty/path/symlink、partial/unknown | `blocked` by `SYNC-UP-007/009/010` |
| SDK/owner integration | permission/posture/source/handoff/Decision/probe schema与映射 | `blocked` by `SYNC-UP-001~005/008` |
| end-to-end / CLI | configured runtime + real adapters + presentation | `waiting` for 04/05/07 and all required bindings；不等于 readiness |

## 5. 模块测试切口汇总表

| 测试切口 | 对应契约 | 验证内容 | 建议测试类型 |
|---|---|---|---|
| `TC-SYNC-MOD-001` selection/access invariants | Step 5/6 CP1 | explicit selection 六维完整、owner ref 不可互换、Fresh+Eligible 才可形成 proof、unknown/blocked fail closed | unit/property |
| `TC-SYNC-MOD-002` working-copy metadata invariants | Step 5/6 CP2 | binding/generation/manifest/cursor/mapping同 context；old generation/provenance保留；query observation不持久化 | unit + flow |
| `TC-SYNC-MOD-003` materialization invariants | Step 5/6 CP3 | delta/plan/path/run一次性关系；只有 Finalized 同 UoW 推进 cursor/mapping；dirty/path不覆盖 | unit + flow/fault |
| `TC-SYNC-MOD-004` conflict/recovery invariants | Step 5/6 CP4 | conflict fact、resolution intent、checkpoint、probe 与 actual effect 分层；possible effect 不 blind replay | unit + flow |
| `TC-SYNC-MOD-005` handoff/provenance invariants | Step 5/6 CP5 | candidate/attempt/Decision layers分离；ACK≠accepted；provenance append/protect/no delete | unit + flow |
| `TC-SYNC-MOD-006` orchestration order | Step 5/9 | validation→reserve→versioned load→prepare commit→outside effect→finalize；pure local flow不造effect phase | application/flow |
| `TC-SYNC-MOD-007` inward port boundary | Step 7 | domain不依赖adapter/provider；entry不直连repository；adapter error归一为typed result | architecture + contract |
| `TC-SYNC-MOD-008` CLI intent/presentation | Step 4/5/8 | clone/pull/status/push-review均要求显式选择；输出只呈现typed safe layers，不输出raw body/path/secret | entry contract |
| `TC-SYNC-MOD-009` operations discipline | Step 8/9 | consumer只保守失效；job只scan/probe/stale；无auto pull/apply/repair/handoff/submit | consumer/job flow |
| `TC-SYNC-MOD-010` composition segregation | Step 14 | Query graph无UoW/write/lock/probe/diagnostic emit；mutation graph缺hard capability即不构造 | composition test |
| `TC-SYNC-MOD-011` diagnostics/telemetry isolation | Step 7/15 | support diagnostic与runtime telemetry分离；sink failure不改变任何业务 result/state/call count | contract/fault |

## 6. Shared protocol 与 carrier 测试切口

| 测试切口 | 对应契约 | 最小断言 | 建议类型 |
|---|---|---|---|
| `TC-SYNC-PROTO-001` envelope validation | Step 8 §7 | Command/Query/Consumer/Job各自required metadata；缺actor/correlation/key/schema/source时在可信边界前拒绝 | contract |
| `TC-SYNC-PROTO-002` typed ref separation | Step 6/8 | Project/Version/Source/Target/Artifact/Workspace/Governance/local refs不可互换或由opaque字符串猜型 | compile/type + runtime validator |
| `TC-SYNC-PROTO-003` result layer separation | Step 8/12 | local/commit/effect/transport/probe/external owner/read completeness各自disposition；无top-level `success/accepted/ready` | contract |
| `TC-SYNC-PROTO-004` body-free public surface | Step 8/12/15 | raw provider response、file content/diff/path、stdout/stderr、stack、credential均无法进入result/view/receipt/job result | contract/redaction |
| `TC-SYNC-PROTO-005` page/view completeness | Step 8 | missing/not_visible/restricted/unavailable/stale/partial不折叠为空或clean；public cursor不泄露store cursor | query contract |
| `TC-SYNC-PROTO-006` replay carrier kind | Step 6～8/11/13 | Command/Consumer/Job completed identity分别绑定完整正确variant；wrong kind/missing carrier为consistency defect | repository/application |

## 7. Command 接口测试切口汇总表

所有 Command 共同断言：same identity+digest duplicate原样回放；different digest冲突且zero effect；invalid envelope不begin UoW；首次 operation、runtime binding snapshot与initial transition同 UoW；外部/tool effect前有durable prepare；effect后commit不确定不得blind retry。

| 测试切口 | 正向切口 | 异常 / 边界切口 | 禁止副作用与证据上限 | 建议类型 / 状态 |
|---|---|---|---|---|
| `TC-SYNC-CMD-001` `CloneWorkingCopy` | explicit selection、empty/compatible target、Fresh+Eligible、source continuity与safe path成立；prepare后bounded local apply；Finalized/cursor/mapping/binding/provenance原子可见 | missing selection、existing incompatible target、owner/source blocked、gap、dirty/untracked/symlink、partial/outcome unknown、finalize conflict | 无fetch/push/merge/rebase/stash/overwrite；local Finalized不证明Artifact/Baseline或owner success | flow/fault；positive integration `blocked` |
| `TC-SYNC-CMD-002` `MigrateSyncMetadata` | expected generation匹配、supported target schema、old chain完整；创建new generation并保护old records | generation conflict、schema unsupported、dangling/corrupt/unknown、commit unknown | query/scan不触发；无in-place rewrite/delete provenance；只证明local logical migration | flow/repository；physical positive `blocked` |
| `TC-SYNC-CMD-003` `RebindWorkingCopy` | explicit new selection与reason，safety/provenance guard通过；new binding/generation + transition provenance | same-context no-op、dirty/unknown、owner/path/schema blocked、generation race、selection mismatch | 不从目录/Git/default推断；不materialize/overwrite/删除old history | flow；owner/store positive `blocked` |
| `TC-SYNC-CMD-004` `PullWorkingCopy` | formal incremental/full/no-op proof，same generation，safe plan/run；known apply后atomic finalize | gap/out-of-order/comparator unsupported、rename/delete collision、dirty/drift、partial/unknown、finalize version conflict | cursor only on Finalized；无remote Git/auto merge/rebase/stash；no-op不由empty array猜 | flow/fault；source/tool positive `blocked` |
| `TC-SYNC-CMD-005` `RecordConflictResolution` | human actor、active conflict、bounded scope；Recorded→Validated与conflict ResolutionRecorded同 UoW | system actor、scope escape、stale/closed conflict、invalid decision、version conflict | KeepLocal/ApplySource只记录intent；zero file/cursor/source/handoff calls | unit/flow；local seam `planned` |
| `TC-SYNC-CMD-006` `ResumeSyncOperation` | exact checkpoint/fingerprint/generation/resolution；按typed next action进入revalidate/replan/resume-local/probe/manual | drift、invalidated/terminal checkpoint、unvalidated resolution、possible external effect、duplicate unknown | 不“continue PC”、force retry或绕过CP1/2/3/5；new plan/run/checkpoint identity按需创建 | flow/fault；effect branches `blocked` |
| `TC-SYNC-CMD-007` `ProbeUnknownOutcome` | durable prior attempt + ProbeRequired；new probe/invocation先commit；formal result映射ResolvedKnown/StillUnknown/Unsupported/FailedKnown | no prior attempt、wrong context、capability absent、timeout/malformed、duplicate | zero original submit；ResolvedKnown不自动accepted/terminal；telemetry不作probe | flow/SDK fake；formal probe `blocked` |
| `TC-SYNC-CMD-008` `CancelSyncOperation` | 每个non-terminal local operation显式取消，保存local result/provenance；possible external refs保留 | terminal reopen、missing operation、version conflict、attempt/checkpoint mismatch | 无remote cancel、file cleanup/rollback claim、attempt/provenance delete | unit/flow；local seam `planned` |
| `TC-SYNC-CMD-009` `PushReviewCandidate` | access/source/binding/cursor/observation/conflict gates通过；Frozen candidate + Prepared attempt；pre-call revalidate；known transport分层保存 | archived/denied/stale/dirty/open conflict、pre-call drift、known reject、ACK、timeout/lost response、finalize conflict | 无Git push；Git commit不升格Artifact/Baseline；ACK不升格Decision/accepted；unknown不resubmit | flow/fault；handoff positive `blocked` |
| `TC-SYNC-CMD-010` `RefreshReviewHandoffStatus` | known external ref走Decision read，OutcomeUnknown走formal probe；body-free snapshot/attempt layers保存 | invisible/missing/stale/unmatched ref、probe仍unknown/unsupported、read ambiguity、duplicate | 不创建/改变Gate或Decision；不把missing默认pending/accepted；不同时盲调read+probe | flow/SDK fake；positive `blocked` |

## 8. Query 接口测试切口汇总表

每个 Query 必须使用 read-only composition，并统一断言：`LocalStateUnitOfWorkPort.begin=0`、idempotency reserve/complete=0、write repository=0、metadata lock=0、probe/handoff=0、diagnostic emit=0。Best-effort telemetry允许发生但不得改变响应；Query不得刷新owner/source、repair、persist observation或创建 provenance。

| 测试切口 | 正向切口 | 异常 / degraded 切口 | 专属 zero-write 断言 | 建议类型 |
|---|---|---|---|---|
| `TC-SYNC-QRY-001` `GetAccessEvaluation` | by-ref / by-context exact selector，返回persisted outcome/freshness/snapshot refs | selector xor失败、missing/not-visible、snapshot missing/stale/unavailable→partial | zero `OwnerAccessPort` refresh与stale write | query service |
| `TC-SYNC-QRY-002` `GetSyncOperation` | Planned/NeedsAction/terminal views均保留local-only语义与runtime snapshot ref | missing/not-visible、referenced checkpoint/result unavailable | no transition/checkpoint/result creation | query service |
| `TC-SYNC-QRY-003` `GetWorkingCopyBinding` | by-ref / by-target，显示Bound/Restricted/NeedsMigration/NeedsRebind/Invalidated | selector xor失败、missing/not-visible、manifest slice unavailable | no canonical repair/migrate/rebind/observation attach | query service |
| `TC-SYNC-QRY-004` `GetMetadataHealth` | bounded summaries纯计算health，Valid/各degraded姿态显式 | dangling/corrupt/unknown、page unavailable、scope mismatch | no scan/save/repair/delete/provenance fabrication | query service |
| `TC-SYNC-QRY-005` `InspectWorkingCopy` | read-only canonicalize/inspect返回dirty/untracked/conflicted/tool axes safe view | path unsafe/symlink/tool unsupported/unavailable/raw output canary | zero repository append/lock/fetch/fix；observation只在内存 | query + adapter contract |
| `TC-SYNC-QRY-006` `GetMaterializationStatus` | plan/run/cursor/checkpoint层显示AppliedPendingFinalize/Finalized/Partial/OutcomeUnknown | requested run missing、slice unavailable、context mismatch | zero source resolve/readDelta/Git/fs apply/resume | query service |
| `TC-SYNC-QRY-007` `GetConflict` | 每个ConflictState及checkpoint/resolution safe refs | missing/not-visible/related record missing→partial | no resolution/close/next-action persistence | query service |
| `TC-SYNC-QRY-008` `ListConflicts` | operation/binding scope、filter、pagination，Open/Unknown不隐藏 | no scope、invalid page、hidden items、index unavailable | no全库scan/ref解析/write；cursor仅public opaque mapper | query/repository fake |
| `TC-SYNC-QRY-009` `GetRecoveryStatus` | Captured/Resumable/ProbeRequired/Invalidated等persisted-only suggestion | missing/stale/mismatched probe/attempt/run slices | no re-observe、resume、probe或checkpoint transition | query service |
| `TC-SYNC-QRY-010` `GetSyncStatus` | CP1～CP5 slices + optional ephemeral observation；read completeness显式 | every missing/restricted/stale/unavailable slice、dirty observation、archived posture、ACK-only | optional fs/Git只读；zero persist/probe/diagnostic emit；CompleteRead≠ready | aggregate query |
| `TC-SYNC-QRY-011` `GetReviewHandoffStatus` | candidate/attempt/probe/snapshot四层，TransportKnown/ExternalPending/TerminalKnown逐层显示 | selector缺失、ACK-only、ProbeRequired、Decision restricted/missing | zero Decision read/probe/write；no accepted inference | query service |
| `TC-SYNC-QRY-012` `GetProvenance` | direct/parents body-free分页，Active/Protected/Superseded/IntegrityUnknown可见 | cycle、duplicate/missing parent、cursor invalid、not-visible | no synthesize/repair/delete/supersede | query/repository fake |
| `TC-SYNC-QRY-013` `GetSyncDiagnosticSummary` | operation/correlation scope，从persisted safe slices + current capability snapshot组合 | empty-existing/missing scope、slice outage、redaction canary | no telemetry sink read、diagnostic emit、artifact/report/evidence/readiness生成 | query/observability contract |

## 9. Conditional Consumer 测试切口

三个 Consumer 的 integration 均为 `planned/blocked`。局部 handler test 只可验证 envelope validation、conservative transition与 exact replay；正式 source/schema/topic/order fixture 缺失时，不得写“accepted integration passed”。

| 测试切口 | 正向切口（正式合同齐全时） | 异常 / duplicate 切口 | 禁止副作用 | 建议类型 / 状态 |
|---|---|---|---|---|
| `TC-SYNC-EVT-001` `ConsumeAccessOrPostureInvalidated` | official source/order匹配；Fresh snapshot/evaluation与affected unconsumed plan/candidate只变保守；receipt/provenance同 UoW | capability blocked/no subscription、duplicate exact receipt、unsupported version、invalid source、stale event no-op、ambiguous targets quarantine、commit unknown | no cancel/pull/apply/handoff/owner write；no raw payload persistence | consumer flow；integration `blocked` |
| `TC-SYNC-EVT-002` `ConsumeMaterialSourceInvalidated` | exact source mapping；cursor→Unknown、unconsumed plan/frozen candidate→Invalidated，Finalized history不变 | duplicate、source mismatch/order stale/gap、ambiguous target quarantine、version conflict | no source call/auto pull/apply/rollback/delete/overwrite；applied cursor值不重写 | consumer flow；integration `blocked` |
| `TC-SYNC-EVT-003` `ConsumeReviewDecisionChanged` | official Governance event exact handoff mapping；body-free Decision snapshot关联attempt并保留owner state | duplicate、unsupported/invalid source、missing/ambiguous external ref quarantine、restricted/malformed state | no Gate/Decision create/write、no candidate content、no new handoff/probe/elevation | consumer flow；integration `blocked` |

### 9.1 Outbound Event 适用性

Outbound Event test cut 为 `not_applicable`：当前没有 outbound envelope、outbox、publisher 或 delivery lifecycle。未来若新增，必须回退 00/01/02 与 Step 6～13，而不是在 Step 16 添加 publisher test 来暗示已有合同。

## 10. Operations Job 测试切口

| 测试切口 | 正向切口 | 异常 / replay 切口 | 禁止副作用与结果上限 | 建议类型 / 状态 |
|---|---|---|---|---|
| `TC-SYNC-JOB-001` `ScanMetadataIntegrity` | bounded targets逐项pure evaluate；仅把manifest/binding收紧为明确degraded姿态；完整typed item results + `SyncJobReport`存储 | invalid scope/page、dangling/corrupt/unknown/read-only、page outage、version conflict、partial、duplicate exact result replay | 不repair/migrate/rebind/delete；job completed不表示metadata globally healthy；local report非formal report/evidence | job flow；physical store `blocked` |
| `TC-SYNC-JOB-002` `ProbePendingHandoffAttempts` | 只处理persisted ProbeRequired；per item复用durable prepare→formal probe→finalize；known/unknown/unsupported逐项保存 | scope xor失败、state drift skip、probe unavailable/still unknown、partial crash、duplicate不scan/probe | zero submit/resubmit；batch completed不表示all resolved/accepted/ready | job/fault；formal probe `blocked` |
| `TC-SYNC-JOB-003` `MarkStaleOwnerSnapshots` | formal freshness rule下Fresh→Stale/Invalidated/Unavailable并保守传播；per-item UoW | boundary time、already non-fresh no-op、version conflict、target resolver outage、partial、duplicate | zero owner refresh；non-Fresh不恢复Fresh；本地时间不自创authorization TTL | job flow；freshness integration `blocked` |

## 11. 17 个状态机测试切口

建议使用Step 10转换矩阵驱动的参数化测试：每一表内 `From→To` 至少命中一次合法 helper；每一表外pair断言 `invalid_transition` 或矩阵指定错误，且原对象、repository write set、provenance与effect call count不变。

| 测试切口 | 状态主语 | 合法覆盖 | 非法 / 边界覆盖 |
|---|---|---|---|
| `TC-SYNC-STATE-001` | `SyncOperationState` | Planned→Validating→Ready→Running→Completed；NeedsAction→Validating；Ready no-op→Completed；各active→Cancelled/FailedKnown | terminal reopen、Planned→Ready、NeedsAction→Running/Completed、无result complete、Cancelled冒充external rollback |
| `TC-SYNC-STATE-002` | `EligibilityOutcome` | factory四结论；非Stale→Stale；Eligible/Denied/Unknown→Blocked；construction snapshot去重 | non-positive/Stale→Eligible、跨selection/action复用、缺check default allow、persisted basis暗扩充 |
| `TC-SYNC-STATE-003` | `FreshnessState` | factory五variant；Fresh→Stale/Invalidated/Unavailable | non-Fresh→Fresh、clock/cache恢复Fresh、subject/version mismatch、raw owner body保存 |
| `TC-SYNC-STATE-004` | `WorkingCopyBindingState` | init→bound；bound→restricted/migration/rebind/invalidated；migration→new generation bound；explicit new identity | partial/unknown run→Bound、Restricted→Bound、Invalidated复活、silent selection rewrite、query attach observation |
| `TC-SYNC-STATE-005` | `MetadataIntegrityState` | Valid factory；四类degrade；same-generation attach；degraded旧record→new generation manifest | invalid init→Valid、query/scan repair、protected ref removal、cross-generation attach、in-place migration |
| `TC-SYNC-STATE-006` | `CursorContinuityState` | Unset→Continuous；Continuous self-advance；Gap/Unknown/Unsupported；generation invalidation | observe即advance、gap无proof→Continuous、old generation advance、cursor comparator猜测 |
| `TC-SYNC-STATE-007` | `MappingIntegrityState` | init/update；Valid→Conflict/Unknown/Invalidated；known finalized resolution形成新Valid revision | actor intent直接Conflict→Valid、Invalidated复活、cross-generation mapping、missing entry默认为valid |
| `TC-SYNC-STATE-008` | `MaterializationPlanState` | Draft→Validated；Draft/Validated→Invalidated；Validated→Consumed exactly once | Draft→Consumed、Consumed复用/复活、generation/observation mismatch仍执行、invalidated resume原identity |
| `TC-SYNC-STATE-009` | `PathChangeSafetyState` | Draft→Safe/Conflict/Blocked/Unknown；Safe→Conflict；scope narrowing | non-Safe stage、scope expansion、fingerprint unknown当匹配、path/symlink escape、dirty overwrite |
| `TC-SYNC-STATE-010` | `MaterializationRunState` | Prepared→Applying→AppliedPendingFinalize→Finalized；Partial/OutcomeUnknown/Blocked/FailedKnown分支 | partial/unknown→Finalized、cursor先行、terminal reopen、无checkpoint unknown、finalize generation mismatch |
| `TC-SYNC-STATE-011` | `ConflictState` | detect→Open/AwaitingDecision→ResolutionRecorded→Closed；active→Superseded | ResolutionRecorded直接等同effect、无known result close、Closed复活、replacement self/cross operation |
| `TC-SYNC-STATE-012` | `RecoveryCheckpointState` | capture后分类Resumable/ProbeRequired/ManualRequired/Invalidated；known result完成 | Invalidated→Resumable、Captured direct Completed、possible effect→Resumable、ACK/pending→Completed |
| `TC-SYNC-STATE-013` | `ManualResolutionState` | Recorded→Validated→Applied；Recorded→Rejected；Recorded/Validated→Superseded | Recorded→Applied、terminal复活、scope escape、system actor冒充human、intent执行file change |
| `TC-SYNC-STATE-014` | `ProbeRecordState` | Prepared→InFlight→ResolvedKnown/StillUnknown/Unsupported/FailedKnown；Prepared→Unsupported | no prior attempt、Prepared→ResolvedKnown、terminal reopen、StillUnknown重放submit、telemetry作known |
| `TC-SYNC-STATE-015` | `ReviewCandidateState` | Inspecting→Eligible→Frozen→HandedOff；任一active→Invalidated；pre-call unchanged guard | Inspecting→Frozen、Eligible→HandedOff、Invalidated复活、Frozen scope/digest修改、multiple attempts |
| `TC-SYNC-STATE-016` | `HandoffAttemptState` | Prepared→Calling→TransportKnown→ExternalPending→TerminalKnown；Calling→OutcomeUnknown→ProbeRequired→known layers | Prepared→TransportKnown、unknown/probe→Calling、ACK→TerminalKnown、missing official ref→pending、terminal reopen |
| `TC-SYNC-STATE-017` | `ProvenanceRecordState` | Active link/protect/supersede/degrade；Protected→supersede/degrade | Superseded/IntegrityUnknown→Active、missing parent synthesize、protected delete、raw body/digest placeholder |

## 12. 持久化、事务与一致性测试切口

| 测试切口 | 对应契约 | 故障 / 竞争注入 | 必须断言 | 建议类型 |
|---|---|---|---|---|
| `TC-SYNC-PERSIST-001` expected version | Step 7/11 | stale `Versioned<T>` save；absent-create race | one winner；losertyped conflict；无last-write-wins或stale recompute | repository contract |
| `TC-SYNC-PERSIST-002` materialization atomic visibility | Step 11 §9 | run/cursor/mapping/manifest/binding/provenance/result各写点中断 | Finalized集合全部不可见或全部可见；never half cursor/mapping | UoW fault |
| `TC-SYNC-PERSIST-003` operation terminal atomicity | Step 6/11 | result/transition/provenance/idempotency completion任一点失败 | terminal state与exact local/stored result不可分离；failure rollback | UoW fault |
| `TC-SYNC-PERSIST-004` handoff durable-before-call | Step 9/11 | crash before/after Prepared、invocation、Calling commit | call只在matching invocation durable后；恢复不创建第二submit | flow/fault |
| `TC-SYNC-PERSIST-005` probe durable-before-call | Step 9/11 | crash before/after ProbeRecord/Invocation/InFlight | prior attempt与invocation逐ref匹配；无记录不probe | flow/fault |
| `TC-SYNC-PERSIST-006` commit ambiguity reload | Step 11/12 | commit response lost；reload complete/in-flight/missing/mismatch | same key/digest先读；complete exact replay；in-flight unknown；missing carrier defect；zero new effect | UoW/repository fake |
| `TC-SYNC-PERSIST-007` provenance protection | Step 11 | parent missing/digest mismatch/supersede race | preserve records；mark IntegrityUnknown/typed conflict；never fabricate/delete | repository contract |
| `TC-SYNC-PERSIST-008` generation switch | Step 10/11 | migrate/rebind visibility point中断 | new manifest/cursor/mapping/binding/index与transition provenance一致；old generation readable | UoW fault |
| `TC-SYNC-PERSIST-009` consumer atomic receipt | Step 11 | target transition后、receipt/idempotency前失败 | conservative transitions与stored receipt/idempotency complete同commit；duplicate不二写 | consumer/UoW |
| `TC-SYNC-PERSIST-010` job result completeness | Step 8/11 | per-item partial/unknown；final store失败 | stored result含全部已处理item dispositions与counts一致；无“completed但carrier缺失” | job/UoW |
| `TC-SYNC-PERSIST-011` runtime snapshot consistency | Step 11/14 | missing snapshot、same ref different content、config rebuild后duplicate | initial operation+snapshot同commit；plan/candidate/attempt同ref；历史语境不可热改 | repository/composition |
| `TC-SYNC-PERSIST-012` Query staged isolation | Step 11 | staged uncommitted records存在 | Query只见committed state；不得通过cache暴露prepared success | repository/query |

## 13. 错误与恢复测试切口

| 测试切口 | 对应契约 | 验证内容 | 禁止解释 |
|---|---|---|---|
| `TC-SYNC-ERR-001` validation before reserve | Step 12 | missing/invalid body、scope、selection、metadata在UoW前stable reject | 不补default/猜path/cache值 |
| `TC-SYNC-ERR-002` domain reject isolation | Step 10/12 | invalid transition/context/invariant不写state/provenance/stored completion，不调用effect | 不写success/accepted signal |
| `TC-SYNC-ERR-003` adapter error normalization | Step 7/12 | rejected promise、exit/malformed/timeout/credential/local I/O映射typed safe error | raw exception/stdout/stderr/stack不穿透 |
| `TC-SYNC-ERR-004` known vs unknown effect | Step 12 | proven pre-effect reject→known；ambiguous call/apply→checkpoint + outcome unknown | timeout/error text不等于未发生 |
| `TC-SYNC-ERR-005` rollback failure | Step 11/12 | rollback port失败暴露dependency/consistency posture并保留correlation | 不隐藏补偿或声称rollback成功 |
| `TC-SYNC-ERR-006` dirty/path recovery | Step 12 | explicit human resolution + fresh Resume/new plan only | 不stash/merge/rebase/overwrite/auto delete |
| `TC-SYNC-ERR-007` handoff unknown recovery | Step 12 | formal probe或manual；StillUnknown保留 | 不换key或resubmit candidate |
| `TC-SYNC-ERR-008` stored carrier missing | Step 12/13 | `duplicate_result_missing`/consistency defect + manual intervention | 不从current truth重构“原结果” |
| `TC-SYNC-ERR-009` provenance/metadata defect | Step 12 | degraded visible，dependent mutation blocked，old records保留 | 不补造parent/ref/digest或silent repair |
| `TC-SYNC-ERR-010` consumer quarantine | Step 12 | invalid source/order/schema/digest只保存允许的body-free safe marker/receipt（若合同允许） | 不保存raw payload或自动处理 |
| `TC-SYNC-ERR-011` job partial | Step 12 | item failure/unknown在typed result显式，batch disposition不遮蔽 | completed不解释为all resolved/readiness |
| `TC-SYNC-ERR-012` Query dependency failure | Step 12 | missing/restricted/unavailable/partial safe surface | 不repair/write/probe/refresh |

## 14. 并发、幂等与重入测试切口

本节承接 Step 13 已编号切口，编号与语义不得另造同义版本。

| Test cut | 最小断言 | 建议层级 |
|---|---|---|
| `TC-SYNC-IDEM-001` | same channel/operation/key/digest exact replay；zero second domain/port/effect call | application + repository fake |
| `TC-SYNC-IDEM-002` | same identity different digest conflict；zero write/effect | application |
| `TC-SYNC-IDEM-003` | reserved/in-flight same digest delayed；single writer | repository barrier |
| `TC-SYNC-IDEM-004` | same raw key across operation/channel namespace隔离 | contract/repository |
| `TC-SYNC-IDEM-005` | canonical digest deterministic；volatile metadata/body排除；semantic selection/scope/expected值包含 | digest contract |
| `TC-SYNC-DUP-RESULT-001` | completed missing/wrong typed carrier→consistency defect；no recompute | result store fake |
| `TC-SYNC-COMMIT-UNKNOWN-001` | same identity/digest reload before any mutation/effect | service + UoW fake |
| `TC-SYNC-CONC-TARGET-001` | dual clone same target only one binding/generation；no overwrite | metadata contract |
| `TC-SYNC-CONC-GEN-001` | Pull vs Migrate/Rebind generation race blocks stale writer | repository/flow |
| `TC-SYNC-CONC-APPLY-001` | dual run consumes plan once；loser zero Git/fs calls | flow + spies |
| `TC-SYNC-CONC-DIRTY-001` | user change after plan/pre-stage→conflict/unknown，never overwrite/stash | fs/Git contract |
| `TC-SYNC-CONC-FINALIZE-001` | effect known + finalize conflict不reapply、不advance cursor | flow/UoW |
| `TC-SYNC-CONC-RECOVERY-001` | resolution/resume race requires exact versions/context | application |
| `TC-SYNC-CONC-CANCEL-001` | cancel race preserves possible/known external effect refs | state/application |
| `TC-SYNC-CONC-CANDIDATE-001` | drift invalidates frozen basis before handoff，zero submit | application + read spies |
| `TC-SYNC-CONC-HANDOFF-001` | duplicate/unknown attempt zero second submit；probe invocation unique | handoff/probe fake |
| `TC-SYNC-EVENT-IDEM-001` | Consumer duplicate exact receipt；different digest conflict/quarantine；no target resolve | consumer service |
| `TC-SYNC-JOB-IDEM-001` | duplicate Job exact full result/item replay；zero scan/probe | job service |
| `TC-SYNC-JOB-CONC-001` | dual item expected-version控制；one change + one no-op/conflict | job/repository |
| `TC-SYNC-JOB-REENTRY-001` | partial crash不收养旧key；new authorized run重读committed items并有distinct result | job/UoW fake |
| `TC-SYNC-CONC-PROV-001` | append race不overwrite/fabricate/delete provenance | repository |
| `TC-SYNC-QUERY-NOWRITE-001` | repeated all 13 Queries仍zero UoW/idempotency/lock/write/probe | query composition |

## 15. 配置与依赖绑定测试切口

| Test cut | 验证内容 | 建议层级 |
|---|---|---|
| `TC-SYNC-CONFIG-001` | raw `unknown`→typed config；unknown/conflicting field fail closed，不回显raw value/source path | config validator |
| `TC-SYNC-CONFIG-002` | zero/negative/non-integer/non-finite budgets拒绝；无clamp、zero或infinity default | config validator |
| `TC-SYNC-CONFIG-003` | 每个hard-boundary override拒绝：auto Git、dirty overwrite、review bypass、provenance delete等不可配置开启 | config/architecture |
| `TC-SYNC-CONFIG-004` | exact capability total mapping；missing/duplicate/unknown capability拒绝 | composition |
| `TC-SYNC-CONFIG-005` | `bound`不等于authorized/healthy/ready；每个route仍执行owner/local guards | composition/flow |
| `TC-SYNC-CONFIG-006` | immutable snapshot exact ensure；operation/plan/candidate/attempt同ref；config变化不改历史 | repository/composition |
| `TC-SYNC-CONFIG-007` | metadata adapter缺atomic/version/append/replay/lock任一能力时mutation graph不构造 | adapter/composition |
| `TC-SYNC-CONFIG-008` | Query graph无法获得write/UoW/lock/probe/diagnostic emit | compile/composition |
| `TC-SYNC-CONFIG-009` | external/tool effect timeout→unknown且zero implicit retry；read timeout保持typed unavailable | wrapper/fault |
| `TC-SYNC-CONFIG-010` | credential/raw body/output不进入snapshot/metadata/status/error | redaction/contract |
| `TC-SYNC-CONFIG-011` | consumer adapter ref存在但formal source/schema capability缺失时仍`blocked` | composition |
| `TC-SYNC-CONFIG-012` | LFS/shallow/GUI/Tauri配置不能生成positive capability或目录/route | config/architecture |
| `TC-SYNC-CONFIG-013` | runtime builder失败不暴露half facade；read/write graphs与snapshot classification一致 | composition fault |
| `TC-SYNC-CONFIG-014` | 只有`@quantalithos/sdk`可作为当前TS compile candidate；无sibling private source/Cargo依赖 | architecture check |

## 16. 可观测性与 local durable traceability 测试切口

| Test cut | 验证内容 | 建议层级 |
|---|---|---|
| `TC-SYNC-OBS-001` | 10 Command、13 Query、3 Consumer、3 Job entry只生成对应closed event/metric/span variants | telemetry contract |
| `TC-SYNC-OBS-002` | exact entry/commit/effect/handoff dispositions分层；无top-level success/accepted/readiness | schema/constructor |
| `TC-SYNC-OBS-003` | secret/body/path/stdout/stderr/stack canary不进入log/metric/span/diagnostic | redaction property |
| `TC-SYNC-OBS-004` | metric labels仅closed low-cardinality allowlist；任意ID/ref/key/digest/version/cursor/path拒绝 | metric constructor |
| `TC-SYNC-OBS-005` | Query可发best-effort signal但zero UoW/write/provenance/diagnostic emit | query + telemetry spy |
| `TC-SYNC-OBS-006` | sink throw/drop/unavailable归一化，不改变business result/state/port call count | fault injection |
| `TC-SYNC-OBS-007` | duplicate replay可记录replay signal，但不新增transition/provenance/effect | application + telemetry spy |
| `TC-SYNC-OBS-008` | commit/effect unknown不被log/span/metric改为known或触发retry | fault injection |
| `TC-SYNC-OBS-009` | ACK/HTTP/local Git/span status不产生Review accepted、Artifact、Baseline字段/claim | schema/redaction |
| `TC-SYNC-OBS-010` | `GetSyncDiagnosticSummary`只读persisted safe slices，不查询telemetry sink | query contract |
| `TC-SYNC-OBS-011` | committed local transition/provenance/invocation/receipt/job result与signal delivery分离；log不可替代durable record | UoW + sink fault |
| `TC-SYNC-OBS-012` | diagnostic emission result不进入Command success、rollback或unknown recovery | application fault |
| `TC-SYNC-OBS-013` | span start/end类别错配、negative/non-finite duration、forbidden field由constructor drop且non-throwing | telemetry unit |
| `TC-SYNC-OBS-014` | telemetry drop observation递归终止；drop-counter失败不再生成新signal | telemetry fault |

## 17. Evidence、report 与 readiness 边界

| 项目 | 本步允许的断言 | 本步禁止的断言 |
|---|---|---|
| test cut | 未来应如何发现契约偏差 | 测试已创建、执行、通过或覆盖率已达标 |
| fake / in-memory seam | local function/call-order/negative behavior可验证 | 真实SDK/Git/fs/metadata integration可用 |
| `SyncJobReport` | 一个bounded local operations typed result的schema与exact replay | 测试报告、验收报告、formal evidence或readiness |
| telemetry | signal schema、redaction与failure isolation | owner truth、external effect、review verdict或业务成功证明 |
| durable provenance | local relation/action history与完整性姿态 | 平台Evidence、Artifact、Baseline、Review acceptance、signoff |
| static audit | 文档契约之间可追溯 | 编译、运行、性能、安全、恢复或生产行为已验证 |

当前 03 不交付任何测试脚本，因此不创建 `scripts/` planned contract，也不固定 `artifacts/test/<run_id>`、`reports/` 或 evidence ID。那些必须由正式 05/06/07 在真实实现边界明确后承接。

## 18. 覆盖审计

| 审计项 | 结论 | 依据 / 剩余边界 |
|---|---|---|
| 五 feature 与正交模块 | pass as design | §5 共11个模块级切口；不声明文件已存在。 |
| 10 Command 正向+异常 | pass_with_blockers | §7逐项；positive SDK/source/Git/fs/store/handoff仍受上游阻塞。 |
| 13 Query 正向+异常+zero-write | pass | §8逐项；external read-only tool正向能力仍可blocked。 |
| 3 Consumer 正向+异常 | pass_with_blockers | §9逐项；formal event合同未闭合，integration保持blocked。 |
| Outbound Event | pass / N/A | 明确无event/outbox/publisher，不伪造测试项。 |
| 3 Job 正向+异常+replay | pass_with_blockers | §10逐项；无scheduler/run事实。 |
| 17 状态机合法/非法 | pass as design | §11逐状态主语；矩阵驱动，表外非法。 |
| persistence/UoW/commit unknown | pass as design | §12；physical durability需真实adapter后验证。 |
| error/recovery | pass as design | §13；known/unknown、manual/probe边界闭合。 |
| concurrency/idempotency | pass as design | §14完整承接Step 13已有22个编号切口。 |
| config/dependency | pass as design | §15承接并扩展runtime build boundary。 |
| observability/redaction | pass as design | §16承接closed schemas、sink isolation与durable separation。 |
| evidence boundary | pass | §17；未生成或声称任何run/artifact/report/evidence/verdict/readiness。 |

## 19. 回填草稿

> 校准来源：
> - `projects/L5-sync/design-calibration/03_ddd_step_16_test_cuts.md`
>
> 延伸阅读：§4验证能力、§5模块切口、§7～§10逐入口、§11状态机、§12～§16一致性/错误/幂等/配置/观测、§17证据边界。

正式 §15 应保留以下最小主链：

1. 测试切口不等于测试方案或测试结果。
2. 模块汇总表。
3. 10 Command、13 Query、3 conditional Consumer、Outbound N/A、3 Job的逐入口汇总；每项同时有positive/negative/forbidden断言。
4. 17状态机合法/非法矩阵索引。
5. persistence/UoW、error/recovery、concurrency/idempotency、config、observability最小切口。
6. blocked正向integration与fake证据上限。

正式正文可压缩单项描述，但不得把29个入口合并为无法反查的通用一句，也不得删掉Query zero-write、unknown no-replay、dirty non-overwrite、ACK≠accepted、provenance/evidence边界。

## 20. 待确认事项

| 待确认项 | 当前影响 | 未确认前姿态 |
|---|---|---|
| `SYNC-UP-001~010` | 正向 SDK/owner/source/handoff/probe/metadata/Git/fs fixture与integration不可构造 | test cut保留；相关integration标`blocked/waiting`，fake不得关闭 |
| `SYNC-LOCAL-001~005` | Node/package manager/package-bin/parser-validator/test runner/Git library/SDK dependency syntax未选 | 不固定测试命令、文件扩展约定、runner/config或dependency-specific mock |
| physical `.qs-sync` backend | crash、atomicity、lock、retention需真实adapter验证 | logical contract cut可写，durability result不得声称 |
| formal event transport/schema | consumer integration和redelivery/order测试不可执行 | composition保持blocked，无private topic fixture |
| test artifact/report/evidence schema | 属于05/06/07 | 本步不创建脚本、路径、ID或静态结果 |

## 21. 进入 Step 17 条件与停审记录

- [x] 五个业务feature与所有正交技术层均有最小测试入口。
- [x] 10 Command、13 Query、3 Consumer、3 Job逐一具有正向、异常与禁止副作用切口；Outbound Event明确N/A。
- [x] 17状态主语均有合法与非法转换验证入口。
- [x] persistence/UoW/commit unknown、error/recovery、concurrency/idempotency、config与observability均有可反查切口。
- [x] Query zero-write、Job no auto repair、duplicate exact replay、unknown no blind retry、dirty non-overwrite与ACK≠accepted均被显式断言。
- [x] upstream-blocked positive fixture未被fake替代，evidence ceiling已写明。
- [x] 未创建/运行测试，未生成artifact/report/evidence/verdict/signoff/readiness。

结论：Step 16 `gate_status=pass_with_upstream_blockers`；允许按用户授权进入 Step 17。
