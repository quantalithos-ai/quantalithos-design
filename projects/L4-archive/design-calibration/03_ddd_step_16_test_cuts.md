# L4-archive 03 Step 16：测试切口与最小验证清单

> 执行日期：2026-09-12。对应 `详细设计讨论流程_SOP.md` Step 16、`详细设计书写规范.md` §5.15；正式回填位置为 `03-详细设计.md` §15。
> 状态：`completed / pass_at_design_with_blocked_positive_integrations / continue_authorized`。所有 test、suite、script、artifact、report 与 evidence 均为 planned/not-run。

## 1. Step 状态、输入与完成上限

| 项 | 结论 |
|---|---|
| 用户授权 | 连续完成全部 03；本步完成后按顺序进入 Step 17 |
| 输入 | 正式 00/01/02，Step 04～15，SOP Step 16，书写规范 §5.15 |
| 粒度参考 | `L1-governance` 按模块/协议/状态/事务分层；`L1-workspace` 将外部 positive 与本地 fake 证明范围分离；不复制其对象或测试数量 |
| 分母 | 6 crates、26正式对象、8 application services、3 Command+5 Query+5 Consumer+17 Job=30 logical entries/32 method surfaces、18状态主语、8 source classes |
| 输出 | package-local suite、逐入口正反向切口、状态合法/非法切口、事务/并发/幂等/配置/观测切口、验证能力分级 |
| 不在本步 | 完整case、priority/coverage目标、fixture schema、环境矩阵、CI命令、报告模板、验收evidence与执行结果；留正式05～07 |
| 完成上限 | 关键契约均有可执行测试入口；blocked external positive不能被fake结果冒充完成 |

## 2. SOP 问题回答与设计取舍

| 问题 | 回答 |
|---|---|
| 每个模块至少测什么？ | contracts测typed DTO/ref/enum与安全serialization；domain测26对象的不变量和18状态；application测8 service、30入口编排/UoW/幂等/no-write；infra测port adapter/store/factory fail-closed；api测3C+5Q边界；worker测5E+17J、claim/fence/checkpoint与恢复。 |
| 每个接口正向和异常如何覆盖？ | §5～§8逐个入口列至少一个positive和一个abnormal，并附原子/零写/副作用断言。外部positive只在正式合同fixture可用后执行。 |
| 状态合法/非法如何测？ | 以Step10的18个状态主语为唯一枚举和边集合；每个至少覆盖主线合法、恢复/边界合法（存在时）和未列边非法且对象不变。 |
| 事务、一致性、幂等、并发如何验证？ | 使用可脚本化fake先验证逻辑语义，再由真实durable adapter contract验证CAS、read-set/range phantom、atomicity、commit probe、lease fence与重启；两层必须行为等价。 |
| 哪些留测试方案？ | exact case ID映射、fixtures/data、property generator、真实provider/bus/owner联调、test profiles、commands、CI gates、artifact/report/evidence、entry/exit标准和执行排期。 |

| 议题 | 取舍 |
|---|---|
| fake positive | 可用synthetic typed values测试本地mapping/invariant，但不得称owner contract、crypto、storage、receiver integration成功或关闭blocker |
| duplicate | 必须从stored complete result/receipt/report replay，不从current truth重算 |
| Query | 每个Query独立覆盖可见/不可见/陈旧/分页异常，并用write/effect spies断言严格no-write |
| partial | report必须保存全部processed detail与未决集合；resume只触及显式未决target |
| scripts | 当前03不新增script交付物；正式05/07若决定交付gate/report/redaction脚本，须先补命令/输入/输出/失败schema |

## 3. Planned suite 与模块测试切口

### 3.1 实现仓内测试发现路径

| crate | planned suite | 最小覆盖 | 类型 |
|---|---|---|---|
| `archive-contracts` | `crates/contracts/tests/protocol_boundaries.rs` | 2 contracts对象、public refs/enums、3C/5Q/5E/17J DTO、safe view/error、round-trip与forbidden body | contract/schema unit |
| `archive-domain` | `crates/domain/tests/domain_invariants.rs` | 24 domain对象factory/rehydrate、字段不变量、失败不改self、history保真 | domain unit/property |
| `archive-domain` | `crates/domain/tests/state_axis_boundaries.rs` | 18状态主语、多轴独立、合法/非法转换、禁止跨状态推导 | state unit/table-driven |
| `archive-application` | `crates/application/tests/admission_consistency.rs` | 3 Command、E01 admission、operation reserve/result、request/job/stage atomicity | service/UoW fake |
| `archive-application` | `crates/application/tests/query_no_write.rs` | 5 Query、visibility先行、safe view/page/cursor、零write/effect | query service + spies |
| `archive-application` | `crates/application/tests/operation_boundaries.rs` | 5 Consumer + 17 Job、intent-before-effect、partial/reconcile/compensation | service/fault injection |
| `archive-infra` | `crates/infra/tests/adapter_contracts.rs` | Step07 port逐method mapping、dispatch knowledge、typed safe error、source/receiver exact binding | adapter contract/fake+integration |
| `archive-infra` | `crates/infra/tests/wiring_fail_closed.rs` | config/builder、required slots、handle-marker配对、fake隔离、dependency taxonomy | config/wiring/static scan |
| `archive-api` | `crates/api/tests/handler_boundaries.rs` | 3C+5Q metadata/validation、safe error/disclosure、无store/provider捷径 | handler/contract |
| `archive-worker` | `crates/worker/tests/consumer_boundaries.rs` | 5 inbound family的trust/schema/dedup/ACK/late/unmatched | consumer/transport seam |
| `archive-worker` | `crates/worker/tests/operation_recovery.rs` | 17Job选择、claim/fence/checkpoint、crash boundary、bounded resume | worker/service/restart |

`crates/application/tests/support/mod.rs` 和 `fakes.rs` 仅由test显式导入，不在production `lib.rs` export。目标实现仓当前不存在，上表是planned路径，不是已创建文件或Cargo发现结果。

### 3.2 六模块最小切口

| 测试切口 | 对应契约 | 核心断言 | 建议类型 |
|---|---|---|---|
| `contracts_source_authority_matrix` | Step06/07八类source | class/owner/material/requiredness合法组合；WorkspaceProjection始终Auxiliary；Artifact/Observability不升canonical | unit/table |
| `contracts_protocol_roundtrip` | Step08全部DTO | required字段、variant、typed ref不互换；payload不重复envelope metadata；raw body/secret absent | schema/property |
| `contracts_safe_view_disclosure` | Step06/08五safe view | hidden/absent统一NotAvailable；current disclosure可收紧；不暴露domain aggregate/provider body | unit |
| `domain_object_invariants` | Step06 24对象 | factory/transition/rehydrate拒绝不完整关联；immutable revision/history不覆盖 | unit/property |
| `domain_multi_axis_non_propagation` | Step10 | sealed≠archived、Committed≠Retrievable、handoff success≠restored、compensated不抹原history | unit/table |
| `application_eight_service_capabilities` | Step05～09 | 每service只用允许ports；无反向infra/provider依赖；30入口唯一owner | compile/service |
| `application_complete_result_replay` | Step07/11/13 | save result→complete reservation同UoW；same/same完整replay；missing result不重跑 | UoW fake/contract |
| `application_query_capability_isolation` | Step07～09 | read-only store+visibility only；所有write/external spies为0 | service |
| `infra_store_semantics` | Step07/11 | snapshot、CAS、unique、negative/range read-set、atomic rollback、stable commit probe | durable adapter contract |
| `infra_external_mapping` | Step07/12 | NotDispatched/MayHaveDispatched、invalid response、binding mismatch逐上下文映射，无raw body | adapter fault injection |
| `infra_runtime_wiring` | Step14 | required exact slot、marker+real handle、Degraded/Disabled/Blocked、new config new assembly | config/builder |
| `api_safe_mapping` | Step08/12 | logical surface正确；不自定HTTP数字码；visibility在error disclosure前 | handler |
| `worker_claim_and_resume` | Step07/11/13 | target排他、renew同fence、stale commit全abort、resume读取result/checkpoint/intent | concurrent/restart |
| `worker_inbound_ack_boundary` | Step08/09/12 | ACK policy不变更Archive/owner result；commit unknown不确认完成 | consumer harness |
| `telemetry_redaction_and_non_authority` | Step15 | allowlist、low-cardinality、sink failure、no recursion；日志不替native audit | capture/static/fault |

## 4. Command 测试切口（C01～C03）

| 入口 | Positive（所需正式外部fixture齐全时） | Abnormal / recovery | 必须断言 |
|---|---|---|---|
| C01 `RequestArchive` | 合法scope/authority形成Accepted request、唯一Archive job、初始stage、visibility binding与完整result | invalid scope→Rejected；authority/contract unavailable→Blocked；same/same replay；same/different Conflict；commit Unknown probe | Accepted只是本地受理；request/job/stage/result原子；无source capture或archived状态 |
| C02 `RequestRestore` | 可见且固定revision、target owner set与restore authority形成Accepted request/job/result | bundle/assessment missing/stale/unsupported/integrity failed；hidden→NotAvailable；duplicate/conflict/Unknown | admission不解析receiver、不写owner；owner set冻结；Accepted不等restorable/restored |
| C03 `RequestLifecycleExecution` | matching revision与正式decision/ref形成execution intent/result | hold/decision missing/conflicting/stale；storage slot blocked；different digest；commit Unknown | 不解释RetentionPolicy、不授权delete；dispatch不在admission local Tx内；无project状态写入 |

每条Command均另测：metadata缺失、wrong-kind DTO、oversize、typed error映射、complete result replay时current disclosure收紧、telemetry无敏感字段。

## 5. Query 测试切口（Q01～Q05，全部 no-write）

| 入口 | Positive | Abnormal / disclosure | 严格零副作用断言 |
|---|---|---|---|
| Q01 `GetArchiveJobStatus` | 同一snapshot组装request/job/stages/components safe view与合法page | hidden/absent/revoked→NotAvailable；mixed revision/invalid cursor/stale snapshot拒绝 | 不推进job、不reserve/save result、不capture/probe/cache/audit write |
| Q02 `GetArchiveBundle` | matching bundle revision读取manifest/entries/closure/placement/lifecycle安全摘要 | missing sidecar/closure→Unknown/Blocked；hidden entry不泄露count；cursor mismatch | 不assemble/seal/retrieve/repair；不把workspace/artifact/audit ref升级 |
| Q03 `VerifyArchiveBundle` | 读取matching committed integrity+compatibility assessments/findings | 无assessment、input mismatch、Unsupported/IntegrityFailed/Unknown如实返回 | 不调用integrity/compatibility port、不创建assessment、不重验 |
| Q04 `GetRestorePlan` | 同snapshot返回plan与per-item safe posture | owner/item/handoff关联损坏→Unknown；hidden owner不泄露；stale page拒绝 | 不build material、resolve receiver、dispatch、recompute plan |
| Q05 `GetRestoreHandoffStatus` | exact handoff/item/outcome/compensation history安全返回 | absent/hidden统一NotAvailable；conflicting/commit unknown保留；invalid cursor | 不probe/retry/compensate、不将ACK变Success、不写read audit |

每条Query在telemetry enabled/disabled两种模式运行同一write/effect spy：`begin_uow/reserve/save/append/complete/claim/external port`调用总数均为0。public cursor未闭合时只验证fail-closed，不用fake私定codec宣称continuation成功。

## 6. Inbound Consumer 测试切口（E01～E05）

| 入口 | Positive（正式schema/source fixture前提） | Abnormal / duplicate | ACK与持久断言 |
|---|---|---|---|
| E01 `ConsumeArchiveTrigger` | trusted trigger映射到既有admission流程并保存完整receipt/result | unsupported schema不解析；untrusted/quarantined；authority blocked；same/same replay；异digest conflict | event arrival不等批准；local result commit后才可按host policy确认；不造archived状态 |
| E02 `ConsumeSourceExportFeedback` | exact binding/attempt/fence/version反馈settle coverage/material refs/findings | unmatched/late/stale/conflicting/unknown；wrong source class；duplicate | 不跨attempt覆盖；Incomplete不变Complete；raw owner body不存；commit unknown不ACK完成 |
| E03 `ConsumeGovernanceDecisionChange` | matching lifecycle/decision ref重评并保存block/current history | older decision、scope mismatch、conflicting hold、unsupported schema | event不解释policy；旧release/delete不覆盖新hold；无Archive自主动作授权 |
| E04 `ConsumeStorageActionFeedback` | persisted target精确路由Placement或Lifecycle并追加observation | ambiguous/wrong target、key/digest mismatch、late conflict、ACK-only、commit unknown | 两branch互斥；ACK不等Committed；无blind redispatch；完整receipt replay |
| E05 `ConsumeRestoreReceiverFeedback` | exact owner/receiver/item/handoff反馈追加outcome并保守更新item/plan | unknown owner、mapping/input mismatch、late conflicting、partial、commit unknown | per-owner隔离；不写owner DB、不发布restored；duplicate不追加第二outcome |

## 7. Operations Job 测试切口（J01～J17）

| Job | Positive（所需能力fixture齐全时） | Abnormal / recovery | 原子/副作用断言 |
|---|---|---|---|
| J01 `AdvanceArchiveJob` | exact component set推动合法stage/posture | missing/partial/blocked component、stale version、terminal reentry | stage+record+report+result+checkpoint同UoW；不跳stage |
| J02 `PlanArchiveSources` | 从冻结scope建立逐source Planned，正式bind后Bound | Auxiliary冒充required、contract blocked、bind MayHaveDispatched | Planned先commit；无bind probe时Unknown/Blocked且不重bind |
| J03 `CaptureArchiveSource` | fixed attempt/fence先提交，capture结果按source保存 | stale fence、partial/missing/conflict、NotDispatched/MayHaveDispatched | intent-before-effect；后者只交J04；不从workspace补canonical |
| J04 `ReconcileSourceCapture` | exact attempt/probe ref收敛known outcome | probe unsupported/notfound/unknown/input mismatch | probe-only，不recapture；旧attempt/history保留 |
| J05 `AssembleBundleManifest` | exact binding/attempt集合形成immutable revision/entries/closure | missing/unexpected/duplicate/phantom source、page未尽、sidecar缺失 | complete range read-set；失败不append半manifest |
| J06 `SealArchiveBundle` | matching closure+assessment+placement seal basis封印revision | old revision/input、Incomplete/Unknown/Unsupported、integrity slot blocked | seal basis全量且same revision；不生成digest/signature |
| J07 `AssessBundleIntegrity` | fixed revision/input经正式capability得Verified或typed result | missing material、invalid response、IntegrityFailed/Unknown/Blocked | intent/input先存；evidence ref正式；无算法/key fake readiness |
| J08 `AssessBundleCompatibility` | fixed target/schema/revision形成immutableassessment | unsupported/conflicting/unknown/target drift | 不复用“最新成功”；新target/input新assessment/key |
| J09 `PlaceArchiveBundle` | placement/action/fixed input先存，正式commit反馈写location/tier | ACK-only、provider unavailable、MayHaveDispatched | 只有commit evidence→Committed/location；unknown交J12，不blind place |
| J10 `RetrieveArchiveBundle` | exact placement/revision/retrieval intent产生Retrievable证据 | cold wait/unavailable/unknown/mismatch | retrieval轴独立；等待不生成新intent；未retrievable不造material |
| J11 `ExecuteArchiveLifecycle` | dispatch前current decision/hold重验，通过后执行固定action | hold变化、decision stale/conflict、MayHaveDispatched | governance不在Archive；intent先存；unknown交J12；无project状态写 |
| J12 `ReconcileExternalAction` | persisted target路由placement/lifecycle并exact probe | target ambiguity、probe unsupported/unknown/conflicting | probe-only；两branch互斥；原effect key/input不变 |
| J13 `BuildRestorePlan` | 冻结owner set并逐owner resolve形成plan/items | receiver missing/mapping partial、assessment stale、version conflict | item set/revision完整；mapping变化需新plan revision |
| J14 `PrepareRestoreMaterial` | exact owner/revision/entry set形成最小material ref | source missing/stale/conflicting/integrity failed/unsupported | 不混owner；fixed material sidecar与item transition同UoW；不复制owner truth |
| J15 `DispatchRestoreHandoff` | current resolve等于plan mapping后先存handoff intent再dispatch | mapping drift、authority revoked、receiver unavailable/MayHaveDispatched | 不直写DB；unknown交J16；每owner独立key/result |
| J16 `ReconcileRestoreHandoff` | exact handoff key正式probe并追加outcome | probe notfound/unknown/conflicting/mismatch | probe-only不重发；conflict保留全部history；不影响其他owner |
| J17 `ExecuteRestoreCompensation` | 双重authority与独立input/key成立后执行并记录result | authority missing、action unsupported、MayHaveDispatched/late original success | 不复用handoff key、不抹原outcome、不推project restored |

所有Job共用测试：same/same完整report replay、same/different Conflict、claim失效、crash在intent/effect/finalize各边界、result/checkpoint缺失、partial显式未决集合、telemetry sink失败不影响业务结果。每次positive external test只能证明test adapter映射；正式integration仍由blocker控制。

## 8. 18 状态主语测试切口

| 状态主语 | 合法覆盖 | 非法 / 边界覆盖 |
|---|---|---|
| `RequestAdmissionState` | none→Accepted/Rejected/Blocked | 三终态不原地转Accepted；Accepted不推出archived/restored |
| `JobAggregatePosture` | Queued→Running→Partial/Blocked→Running→Completed；definite→Failed | Completed/Failed不复活；单component不推aggregate Completed |
| `ArchiveJobStage` | Archive与Restore两条逐stage主线 | 跨kind/跳stage/前提缺失拒绝；reconcile/compensation不凭retry config进入 |
| `SourceBindingState` | Planned/Blocked→Bound；非终态→Retired | Retired不复活；workspace projection不能使canonical Bound |
| `CaptureAttemptState` | Requested→InProgress→Settled；Blocked→InProgress；definite Failed/Superseded | timeout不直接Failed；Settled/Failed/Superseded不覆盖 |
| `ArchiveBundleState` | Planned→Assembling→ClosureReady→Sealed；Blocked解阻同输入 | missing/overfull/old assessment不能seal；Sealed不改revision |
| `VerificationPosture` | Pending→InProgress→四类终态 | Verified无formal evidence拒绝；终态新输入必须新assessment |
| `PlacementState` | IntentRecorded→Dispatched→Acknowledged/Committed/Unknown/Failed/Blocked | ACK不等Committed；location仅commit evidence；Committed不回退 |
| `RetrievalState` | NotRequested→Requested→Retrievable/Unavailable/Failed/Unknown | placement Committed不推Retrievable；unknown不造material |
| `LifecycleExecutionState` | Eligible→Intent→Dispatched→Ack/Committed/Unknown；Blocked/Failed→Compensated合法条件 | 新hold保留已知effect；ACK不等commit；Compensated不抹history |
| `ExternalActionPosture` | Intent→Dispatched→typed outcome；Unknown经probe收敛 | wrong target/input拒绝；timeout不推Failed/NotDispatched |
| `RestorePlanState` | Draft→Ready→InProgress/Partial→HandoffComplete；非终态→Superseded | frozen set不可换；item failure不推plan Failed；Complete不等restored |
| `RestoreItemState` | Planned→MaterialReady→HandoffPending→InProgress→per-owner outcome/compensation | 跨owner/mixedmaterial拒绝；一个owner不传播其他owner |
| `RestoreHandoffState` | Intent→Dispatched→Ack/terminal/Unknown→ReconcileRequired→terminal | ACK不等Succeeded；unknown不重发；terminal conflict保留历史 |
| `CompensationState` | Planned→InProgress→Completed/Failed/Unknown/Blocked | 无authority拒绝；Completed不修改原handoff/owner truth |
| `ArchiveIdempotencyState` | absent→Reserved→Completed；正式原reservation非法时Conflict | same key异digest不改原record；Completed缺result为defect；Query不进入 |
| `WorkerEntryState` | Registered/Delayed→Running→Completed/Failed；受控Stopped | process Completed不替代durable result；非法转换无business write |
| `WorkerClaimState` | none→Active→renew/Released/Expired/Superseded | old fence所有commit拒绝；lease不替CAS或external lock |

`CompatibilityPosture`、coverage/closure classification、DTO disposition、runtime assembly与owner project state不是这18个业务flow状态机；分别按immutable classification、protocol或Step14 builder contract测试，不能强行加入同一global state。

## 9. 事务、一致性、并发与幂等切口

| ID | 场景 / 注入 | 必须断言 | 验证层 |
|---|---|---|---|
| `TC-AR-TX-001` | request/job/stage/result任一点失败 | 全部回滚或全部可见；无Accepted半记录 | UoW fake+durable |
| `TC-AR-TX-002` | manifest entry/closure/source sidecar中断 | 无半revision；range/negative guard阻止phantom seal | durable concurrency |
| `TC-AR-TX-003` | outcome/history/result/checkpoint中断 | reservation不Completed或完整集合全commit | UoW fault injection |
| `TC-AR-TX-004` | commit返回Unknown | `probe_commit`+exact result/reservation；absence不等Aborted | store contract/restart |
| `TC-AR-IDEM-001` | parallel same key/same digest | exactly one writer；其余Existing/Replay；body/effect一次 | concurrent barrier |
| `TC-AR-IDEM-002` | same key/different canonical field | Conflict；原reservation/result byte-equivalent | property/service |
| `TC-AR-IDEM-003` | Completed result missing/wrong kind | ResultMissing/CorruptRecord；零mutation/effect | corruption injection |
| `TC-AR-IDEM-004` | operation codec absent/drift | production reserve Blocked；fake不产生另一等价关系 | config/parity |
| `TC-AR-CAS-001` | two writers same expected version | 一胜一VersionConflict；无last-write-wins | durable barrier |
| `TC-AR-RANGE-001` | source/item phantom during closure/freeze | stale UoW abort；未漏required member | durable serializable-equivalent |
| `TC-AR-FENCE-001` | claim expiry/new fence before commit | old worker truth/result/checkpoint全不提交 | worker+store |
| `TC-AR-EFFECT-001` | crash before intent commit | 无external call；probe local outcome再决定 | restart/fault |
| `TC-AR-EFFECT-002` | crash after intent/before or during call | fixed input/key保留；unknown只exact probe，不换keydispatch | adapter/restart |
| `TC-AR-PARTIAL-001` | multi-owner部分成功 | 完整report；new invocation只含未决target；已成功不重做 | service/property |
| `TC-AR-RESTORE-001` | two owner outcomes concurrent | 独立CAS/history；一方失败/unknown不改另一方 | concurrent service |
| `TC-AR-RESTORE-002` | receiver mapping drift | J15零intent/dispatch；需new plan revision | adapter/service |
| `TC-AR-QUERY-001` | mutation between pages | snapshot/cursor mismatch拒绝；不混页、不写 | query/store |
| `TC-AR-PARITY-001` | same scripted race on fake/durable | reservation/CAS/read-set/fence/result outcome相同 | conformance |

## 10. 错误、配置、观测与边界切口

| 测试切口 | 对应契约 | 断言 | 类型 |
|---|---|---|---|
| `six_error_owner_mapping` | Step12 | Contract/Domain/Application/Infra/Api/Worker逐层contextual mapping；无blanket success/retry | table unit |
| `public_disclosure_error_equivalence` | Step12 | absent/hidden/revoked统一NotAvailable；内部reason不出站 | handler/query |
| `external_dispatch_knowledge` | Step07/12 | NotDispatched与MayHaveDispatched分开；后者只probe/reconcile | adapter fault |
| `runtime_required_slot_gate` | Step14 | missing/Degraded/required Disabled均无facade；marker-only不Ready | builder |
| `source_receiver_exact_binding` | Step14 | payload slot按exact SourceClass/Owner匹配，不fallback | config/property |
| `cross_repo_dependency_scan` | Step03/14 | 除core-contracts外无sibling/SDK/provider Cargo path | static scan |
| `forbidden_config_body_scan` | Step14 | config/runtime/error无endpoint/credential/secret/provider body | schema/static |
| `telemetry_allowlist` | Step15 | raw body/key/digest/ref/secret/stack canary零出现 | capture/security |
| `metric_label_cardinality` | Step15 | label keys和值只来自有限enum，不含IDs/free text | static/runtime capture |
| `telemetry_sink_failure` | Step15 | 不rollback/retry/change result；无self-observation ingress | fault injection |
| `native_audit_atomicity` | Step11/15 | mandatory history/finding/intent/result失败使accepted UoW不成立 | UoW fault |
| `source_authority_negative_matrix` | formal00/Step06 | workspace/artifact/observability material不补canonical或写owner truth | table/property |

## 11. 验证能力分级与 blocker

| 验证层 | 可证明 | 当前状态 / 不可声称 |
|---|---|---|
| contracts/domain unit/property | 本地类型、factory、不变量、状态、mapping纯逻辑 | planned/not-run；不证明外部合同 |
| application scripted fakes | orchestration、顺序、negative/unknown/partial/replay逻辑 | planned/not-run；synthetic proof不是真authority/evidence |
| durable store adapter contract | atomic UoW、CAS/read-set/range、probe、fence、restart | provider/backend未选，blocked |
| owner/source integration | exact snapshot/export/version/fence/coverage | `AR-UP-001/006/007/008` blocked |
| governance/integrity/storage integration | decision applicability、crypto/schema、commit/probe | `AR-UP-003/004/005` blocked |
| bus consumer integration | trusted envelope/schema/redelivery/ACK |正式producer/transport合同未闭合；受`AR-UP-*`与配置阻断 |
| restore receiver integration | per-owner resolve/handoff/outcome/probe/compensation | `AR-UP-009` blocked |
| SDK/downstream | public client/read mapping | `AR-ARCH-001`；Archive server不依赖SDK |
| outbound event | event/outbox/delivery | `AR-HLD-Q-001`：不存在可测positive surface |
| workload/NFR | latency/capacity/recovery目标 | `AR-HLD-Q-002`：无阈值、无通过结论 |

## 12. 脚本与证据边界

当前详细设计不交付 gate/report/check 脚本，因此没有可诚实填写的命令、artifact或report schema。正式05若决定需要脚本，必须先定义：脚本路径、参数、输入、`artifacts/test/<run_id>`输出、`reports/`输出与非零失败语义，再由07规划实现 boundary。此处的 `TC-AR-*` 是设计切口ID，不是已创建case、run、artifact、evidence alias或验收编号。

## 13. 跨 Step 审计、回填草稿与门禁

| 审计项 | 结论 |
|---|---|
| 6 crates / planned test files | pass：均有package owner；无根目录幽灵suite |
| 26正式对象 | pass：contracts/source矩阵与domain invariants覆盖 |
| 30 logical / 32 surfaces | pass：3C、5Q、5E、17J逐条positive/abnormal |
| 18状态主语 | pass：每项合法/非法与禁止推导均有切口 |
| transaction/concurrency/idempotency | pass_at_design：fake+durable parity要求明确，真实adapter blocked |
| config/observability/security | pass_at_design：fail-closed与字段scan入口明确 |
| external positive | correctly_blocked：不由fake或文档自检伪造 |
| 测试执行/evidence | not_run / none |

正式 §15 应保留suite映射、逐协议族索引、18状态表、事务/一致性表、配置/观测边界与能力分级；完整case/data/env/gate/report留正式05～07。

| 完成门禁 | 结果 |
|---|---|
| 每模块最小切口 | pass |
| 每关键协议正/异常 | pass |
| 状态合法/非法 | pass |
| 事务/一致性/幂等/并发 | pass_at_design |
| blocker与fake证明上限 | pass |
| 正式03写入 | not allowed until Step19 |
| 下一动作 | 按连续授权进入Step17 |

本 Step 未创建实现测试文件或脚本、未运行任何命令级测试、未生成run/artifact/report/evidence/verdict/readiness，也未提交 commit。
