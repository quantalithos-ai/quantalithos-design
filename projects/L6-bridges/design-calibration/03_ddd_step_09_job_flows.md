# L6-bridges 03 Step9：Operations Job独立处理流

五J只由原Jobs dispatcher/五bin/Worker selection移交完整原plan；无新增HTTP、queue、raw replay或通用maintenance service。图和Rust块是函数级设计，不是源码或编译结果；变量均按构造表绑定已有typed字段。每个Result必须当场分支：tx内失败立即独占rollback，取得原operation以后所有异常保original/phase；互斥候选分支不顺序执行。各阶段具体业务stage在本页，共享audit/immutable seed/condition/seal/commit完整步骤沿[G0](03_ddd_step_09_shared_flow_contracts.md)，不能省略或在foreign IO时持tx。

## 1. J01 DispatchQueuedDeliveryJob

### 1.1 入口与目标

`select_dispatch_candidates`从LaneRepository::list_eligible_intents取得原完整行 -> 原JobInvocationPlan -> fixed mapper -> `DispatchDeliveryJobInput::from_parts(job, delivery, continuity)` -> `DispatchQueuedDeliveryJob::execute(input, control)`。归Application/U3+U5；[Step8 J01/§7~8](03_ddd_step_08_job_protocols.md)、Step6 DeliveryIntent/DeliveryAttempt/PlatformReceipt/DispatchLane、[Step7 callables§9](03_ddd_step_07_application_callables.md)及ports§4/6/8是唯一调用面。后续Step10只承接本页状态候选，本步不建矩阵。

问题/诊断：原“claim+结果两事务”摘要不足以表达DeliveryAttempt::begin_io的**先实际提交再跨private seam**约束。采用A claim -> B InFlight -> 一次dispatch -> C结果；每段独立local mutation但业务original/key/effect不变。首建Claimed/local1必须A实际提交后读回，不能由新候选制造Present CAS。不采用claim reservation即IO、超时重发、隐藏SDK retry、new target/effect或把HTTP 2xx当所有method业务成功。

| DTO / factory或成员参数全集 | actual来源 / 不足出口 |
|---|---|
| request三层 | wrapper version/原JobContinuityMetadata(operation,subject,trace,requested_at)；body唯一DeliveryIntentEffectRef；host实际TrustedJobContext。`into_delivery`不丢effect，runtime budget/availability在原plan，不进body或业务retry预算 |
| input(job,delivery,continuity) | actual host job+body原值+原metadata；job scope/trace、原intent/op/effect必须一致。invoke按BridgeMaintenanceSubject::Intent重新qualify_job_key，查询原dedup/result；selection不证明执行 |
| 完整baseline | Config.qualify_maintenance_read -> UoW/read driver原Maintenance session；Delivery.read_snapshot(intent)含plan/intent/all attempts/receipts/original/read_basis，Lane.read_snapshot(intent.lane_ref)含head/active attempt/依赖，Installation/Mapping完整行及current relation/action/generation。缺required行/集合/时间依据安全Unavailable，无截断猜测 |
| meaning/effect | `DeliveryOperationMeaning::from_parts(kind,projection,target)`只原intent三字段；BodyFreeOperationMeaningRef::Outbound及original实际StableEffectSubject；原effect唯一不由new attempt替代。完整recipe/codec不成立NotEstablished |
| current/bounds | Config.qualify_installation、Binding.qualify_current/qualify_mapping、Presentation.revalidate、Platform.qualify_rate_bounds、Lane.read_shared_bounds；全适用scope去重合并向量+正式完整qualification -> QualifiedRateLimitBoundSet::from_parts(bounds,qualification)，not_before(now)取max；再qualify_dispatch(delivery,lane,presentation,bounds,job)得七字段DispatchEligibilityRef。欠缺任一依据零IO |
| lane初建九参 | `DispatchLane::for_scope(lane_ref,order_scope,head_dependency,claim_fence,unresolved_head,rate_bounds,retry_budget,revision,rate_basis)`；完整受权scope/依赖/预算/全部bounds，初claim Missing、head None、LaneRevision1。首建仅C04/E02通过insert_for_scope的LaneRevisionCondition::Absent与local Absent同UoW；J01只读取actual既有完整lane并按两轴Present CAS，不假造existing1或从技术ID猜lane |
| A attempt七参 | UoW Attempt ID、input delivery完整关联、same-tx Lane.reserve_claim的fence、actual DispatchEligibilityRef、其AuthorizedAttemptWindowRef、PlatformBusinessResultRefSlot::Missing、UoW now -> DeliveryAttempt::claim_for；Claimed/local1。intent.claim与lane.claim都取actual原行local CAS，lane另有ExpectedLaneRevision |
| B begin_io四参 | actual A读回attempt/claim与最后current eligibility、actual attempt local CAS、now；Claimed -> InFlight。B commit后的原claim/fence/current/window才允许借payload/secret并调用；commit未知零IO |
| payload/secret | render_payload(plan,AttemptEffectRef,current) -> owning BridgePayloadLease；Config.qualify_secret_use exact SecretUsePurpose::Deliver -> Secret.resolve owning BridgeSecretLease；lease取得后重验presentation/binding/secret/原fence/bounds/window，再borrow_payload/borrow_secret本call短借。无正文/URL/token durable缓存；不换最新secret版本 |
| C known receipt八参 | UoW receipt ID、known原AttemptEffectRef、actual known kind、VerifiedExternalMessageLocatorSlot、PlatformResultAuthorityRef、NoEffectBasisRefSlot、finite reason、完整KnownPlatformBusinessResult -> PlatformReceipt::from_known；unknown零receipt，create accepted需locator，delete只有正式NotApplicable |
| C result/映射 | attempt.record_result实际known.result；intent.apply_receipt只终态known，或从原Dispatching直接schedule_retry（不先KnownRejected再复活）；known create/edit/reply仅actual source/version/target/origin+current MappingBasisRef下qualify_message_mapping -> ExternalMessageMapping::link_known七字段沿C03。delete须原OwnerChangeDispositionRef，不由平台结果制造owner处置；欠缺只保存known receipt |
| retry五参 | `RetryEligibilityRef::from_parts(no_effect,budget,presentation,window,not_before)`：明确same-op NoEffectBasisRef、实际业务预算、原plan current、原window、所有rate/backoff最大下界；NoIoProofRef不是该第一参，只有NoIo不足不能schedule_retry |
| lane处置三参 | `LocalAttemptDispositionRef::from_parts(attempt,kind,basis)`，kind仅actual KnownFinal/Unknown/NoIo，basis实际已核来源；Unknown不可分类KnownFinal。release或apply_bounds使用same claim和两轴CAS，Unknown仍保unresolved_head |
| safe结果六参 | SafeJobResultSummary::from_parts(actual disposition,获准Intent subjects,获准maintenance_subjects,counts或None,独立stages,finite reason) -> DispatchJobResult::from_summary；current过滤在factory前后均需成立。Completed只本bounded动作，零run/report/全局送达 |

### 1.2 函数级调用图：DispatchQueuedDeliveryJob

```text
[Jobs fixed mapper -> J01.execute]
  | query complete intent/plan/lane/installation/mapping + original key/result
  | call current qualifications + all shared rate bounds
  v
[tx A]
  | call LaneRepository.reserve_claim
  | call DeliveryAttempt.claim_for + DeliveryIntent.claim + DispatchLane.claim
  | save attempt/intent/lane + dedup/audit/seed/conditional handoff
  | actual commit; Unknown -> zero IO, original recovery only
  v
[actual A read + final current eligibility]
  | tx B: call DeliveryAttempt.begin_io; save original set; actual commit
  | call render_payload + resolve secret + final revalidate + short borrow
  | call PlatformDeliveryPort.dispatch exactly once, no tx held
  v
[tx C: actual result or unknown]
  | Known -> append receipt; save attempt/intent/qualified mapping/lane
  | Indeterminate -> save unknown attempt/intent + unresolved lane head
  | NotDispatched -> preserve formal NoIo, legal staged handling below
  | audit + original immutable seed reuse; seal; actual commit/rollback
  v
[current filtered DispatchJobResult or original unresolved responsibility]
```

关键说明：

- A claim和B InFlight各自actual提交后，最后current允许才单次原effect dispatch，网络不持tx。
- C结果和合法NoIo D不重send；known receipt、NoIo、NoEffect及unknown head分别处理，图不证明用户送达。

### 1.3 关键伪代码

```rust
// [ConfigQualificationPort.qualify_maintenance_read(SafeScopeRef scope, TrustedJobContext job, u32 limit, BridgeCallControl control)]
let read_q = config.qualify_maintenance_read(&scope, &job, limit, control).await;
// Established Maintenance session only; all failures retain supplied original continuity, zero IO.
// [DeliveryRepository.read_snapshot(DeliveryIntentRef intent, BridgeLocalReadSession read, BridgeCallControl control)]
let delivery_row = delivery.read_snapshot(&intent_ref, &session, control).await;
// [LaneRepository.read_snapshot(DispatchLaneRef lane, BridgeLocalReadSession read, BridgeCallControl control)]
let lane_row = lanes.read_snapshot(&lane_ref, &session, control).await;
// [LocalUnitOfWorkPort.qualify_job_key(BridgeMaintenanceSubject subject, TrustedJobContext job, BridgeCallControl control)]
let key_result = uow.qualify_job_key(&maintenance_subject, &job, control).await;
// G0 find_dedup/find_result_for_key/reuse before any claim. Missing/terminal/unknown are distinct.
// [PresentationQualificationPort.revalidate(SafePresentationPlan plan, ImmutableDeliveryTargetRef target, ActorRef actor, BridgeCallControl control)]
let presentation_q = qualification.revalidate(&plan, &target, &actor, control).await;
// [PlatformDeliveryPort.qualify_rate_bounds(QualifiedLaneOrderScope scope, CapabilitySnapshotRef capability, BridgeCallControl control)]
let platform_bounds = platform.qualify_rate_bounds(&order_scope, &capability, control).await;
// [LaneRepository.read_shared_bounds(QualifiedLaneOrderScope scope, BridgeLocalReadSession read, BridgeCallControl control)]
let shared_bounds = lanes.read_shared_bounds(&order_scope, &session, control).await;
// [QualifiedRateLimitBoundSet.not_before(SafeInstant now)]
let lower_bound = complete_bounds.not_before(now);
// [PresentationQualificationPort.qualify_dispatch(DeliverySnapshot delivery, LaneSnapshot lane, CurrentPresentationQualification presentation, QualifiedRateLimitBoundSet bounds, TrustedJobContext job, BridgeCallControl control)]
let eligibility_q = qualification.qualify_dispatch(&delivery_snapshot, &lane_snapshot, &presentation, &complete_bounds, &job, control).await;
// Ready/head/current/window/budget guard; same-driver CAS rechecks all shared scopes during reservation.
// [LocalUnitOfWorkPort.begin(LocalMutationRef mutation, OriginalOperationEffectRef original, ExpectedLocalRevisionSet expected, MutationObservationRequirement observation, BridgeLocalReadContext read, BridgeCallControl control)]
let begin_a = uow.begin(&mutation_a, &original, &expected_a, &observation_a, &read, control).await;
// Only Ok owns tx; errors stop with original. Every following failed Result -> exclusive G0 rollback.
// [LaneRepository.reserve_claim(DispatchLaneRef lane, AttemptEffectRef attempt, DispatchEligibilityRef eligibility, ExpectedLaneRevision lane_expected, ExpectedLocalRevisionSet expected, BridgeLocalTransaction tx, BridgeCallControl control)]
let reservation = lanes.reserve_claim(&lane_ref, &attempt_effect, &eligibility, &lane_expected_a, &expected_a, &mut tx_a, control).await;
// [DeliveryAttempt.claim_for(AttemptRef attempt_ref, DeliveryIntentEffectRef intent_effect, FencedClaimRef claim_ref, DispatchEligibilityRef qualification_ref, AuthorizedAttemptWindowRef attempt_window, PlatformBusinessResultRefSlot result_ref, SafeInstant now)]
let attempt_a = DeliveryAttempt::claim_for(attempt_ref, intent_effect, reserved_claim, eligibility, attempt_window, PlatformBusinessResultRefSlot::Missing, now);
// [DeliveryIntent.claim(DispatchEligibilityRef qualification, FencedClaimRef claim, ExpectedLocalRevision local, SafeInstant now)]
let intent_change = intent_a.claim(current_eligibility, claim_a, intent_expected_a, now);
// [DispatchLane.claim(DeliveryIntentRef intent, DispatchEligibilityRef qualification, FencedClaimRef claim, ExpectedLaneRevision expected, ExpectedLocalRevision local, SafeInstant now)]
let lane_change = lane_a.claim(original_intent, current_eligibility, claim_a, lane_expected_a, lane_local_a, now);
// [DeliveryRepository.stage_attempt(DeliveryAttempt candidate, LocalRevisionCondition expected, BridgeLocalTransaction tx, BridgeCallControl control)]
let staged_attempt = delivery.stage_attempt(&attempt_a, LocalRevisionCondition::Absent, &mut tx_a, control).await;
// [DeliveryRepository.stage_intent(DeliveryIntent candidate, StableEffectIdentity effect, LocalRevisionCondition expected, BridgeLocalTransaction tx, BridgeCallControl control)]
let staged_intent = delivery.stage_intent(&intent_a, &original_effect, intent_condition_a, &mut tx_a, control).await;
// [LaneRepository.stage(DispatchLane candidate, ExpectedLaneRevision lane_expected, LocalRevisionCondition expected, BridgeLocalTransaction tx, BridgeCallControl control)]
let staged_lane = lanes.stage(&lane_a, &lane_expected_a, lane_condition_a, &mut tx_a, control).await;
// A: G0 dedup/audit/seed/condition -> validate/seal -> actual commit, matching proof + stored result read.
// B uses actual A committed baseline, not first candidate revision; all current preflight outside tx.
// [DeliveryAttempt.begin_io(FencedClaimRef claim, DispatchEligibilityRef qualification, ExpectedLocalRevision local, SafeInstant now)]
let inflight = attempt_b.begin_io(claim_b, final_eligibility_b, attempt_expected_b, now_b);
// B G0 stage_attempt(Present actual A)/audit/original immutable seed/condition -> seal/commit.
// [PrivateMaterialPort.render_payload(SafePresentationPlan plan, AttemptEffectRef attempt, CurrentPresentationQualification current, BridgeCallControl control)]
let payload_lease = material.render_payload(&plan, &attempt_effect, &current_presentation, control).await;
// [SecretResolutionPort.resolve(QualifiedSecretUseContext current, BridgeCallControl control)]
let secret_lease = secrets.resolve(&qualified_secret, control).await;
// [SecretResolutionPort.revalidate(QualifiedSecretUseContext current, SafeRevision revision, BridgeCallControl control)]
let final_secret_q = secrets.revalidate(&qualified_secret, &exact_revision, control).await;
// Current binding/presentation/bounds/fence/window also rechecked after leases; any failure => zero dispatch, retain B.
// [BridgePayloadLease.borrow_payload(CurrentPresentationQualification current, SafeInstant now)]
let payload = actual_payload_lease.borrow_payload(final_presentation, final_now);
// [BridgeSecretLease.borrow_secret(QualifiedSecretUseContext current, SafeInstant now)]
let secret = actual_secret_lease.borrow_secret(final_secret, final_now);
// [PlatformDeliveryPort.dispatch(DeliveryAttempt attempt, DeliveryIntent intent, DispatchEligibilityRef eligibility, FencedClaimRef claim, PrivateQualifiedPayload payload, PrivateSecretHandle secret, BridgeCallControl control)]
let result = platform.dispatch(&actual_attempt_b, &actual_intent_a, &final_eligibility, &actual_claim_a, &payload, &secret, control).await;
// Mutually exclusive result branches; each requires actual post-B baseline and its own G0 tx C.
// [PlatformReceipt.from_known(PlatformReceiptRef receipt_ref, AttemptEffectRef attempt_effect, KnownPlatformBusinessResultKind result_kind, VerifiedExternalMessageLocatorSlot external_locator, PlatformResultAuthorityRef authority_basis, NoEffectBasisRefSlot no_effect_basis, SafeReasonCode safe_reason, KnownPlatformBusinessResult known)]
let receipt = /* Known only */ PlatformReceipt::from_known(receipt_ref, attempt_effect, known_kind, locator_slot, authority, no_effect_slot, reason, known);
// [DeliveryAttempt.record_result(PlatformBusinessResultRef result, ExpectedLocalRevision local)]
let known_attempt = /* Known only */ attempt_c.record_result(actual_result, attempt_expected_c);
// [DeliveryIntent.apply_receipt(PlatformReceipt receipt, ExpectedLocalRevision local)]
let known_intent = /* terminal Known only */ intent_c.apply_receipt(&receipt, intent_expected_c);
// [DeliveryRepository.append_receipt(PlatformReceipt candidate, LocalRevisionCondition expected, BridgeLocalTransaction tx, BridgeCallControl control)]
let receipt_stage = /* Known only */ delivery.append_receipt(&receipt, LocalRevisionCondition::Absent, &mut tx_c, control).await;
// [DeliveryAttempt.mark_unknown(SafeReasonCode reason, ExpectedLocalRevision local)]
let unknown_attempt = /* Indeterminate or defensive NoIo first stage only */ attempt_c.mark_unknown(reason, attempt_expected_c);
// [DeliveryIntent.mark_unknown(AttemptEffectRef attempt, SafeReasonCode reason, ExpectedLocalRevision local)]
let unknown_intent = /* Indeterminate/NoIo first stage only */ intent_c.mark_unknown(attempt_effect, reason, intent_expected_c);
// [DispatchLane.release(LocalAttemptDispositionRef disposition, ExpectedLaneRevision expected, ExpectedLocalRevision local)]
let lane_release = /* no response bounds; Unknown preserves unresolved_head */ lane_c.release(actual_disposition, lane_expected_c, lane_local_c);
// [DispatchLane.apply_bounds(QualifiedRateLimitBoundSet bounds, Option<LocalAttemptDispositionRef> release, ExpectedLaneRevision expected, ExpectedLocalRevision local)]
let lane_wait = /* complete new bounds branch instead of release */ lane_c.apply_bounds(actual_complete_bounds, Some(actual_disposition), lane_expected_c, lane_local_c);
// C stages original typed set plus mapping when qualified; G0 seal/actual commit. Foreign result never undone by local rollback.
// [LocalUnitOfWorkPort.rollback(BridgeLocalTransaction tx, BridgeCallControl control)]
let rollback = /* any tx failure: that phase handle only */ uow.rollback(tx, control).await;
// [SafeJobResultSummary.from_parts(JobResultDisposition disposition, Vec<OriginalRecoverableSubjectRef> subjects, Vec<BridgeViewSubjectRef> maintenance_subjects, Option<QualifiedJobCounts> counts, SafeStageSlice stages, SafeReasonCode reason)]
let summary = SafeJobResultSummary::from_parts(disposition, visible_intents, visible_maintenance, permitted_counts, distinct_stages, finite_reason);
// [DispatchJobResult.from_summary(SafeJobResultSummary summary)]
let safe_result = DispatchJobResult::from_summary(actual_filtered_summary);
```

`NotDispatched`在B后不能直接调用只允许Claimed/Indeterminate的record_not_dispatched。采用C防守性提交Indeterminate并保实际NoIoProof，只有C实际提交、actual原Indeterminate行和同attempt proof仍可用时，下一独立local finalize D调用`DeliveryAttempt::record_not_dispatched(proof,actual local)`，同UoW保intent/lane/原immutable结果与审计。C或D未知不重发；proof不可再取只原J02权威只读恢复。Intent只有另有正式NoEffectBasisRef和完整RetryEligibilityRef时才`DeliveryIntent::schedule_retry(retry,actual local,now)`从Indeterminate进入RetryWait；不能把NoIo强转NoEffect。D不是第二dispatch；所有分支均不从InFlight非法直跳NotDispatched。若没有可建立的正式安全审计规则，C/D也阻写并保host原result/phase，不伪造durable处置。

### 1.4 事务边界

| 阶段 | all-or-none内容 / 独立IO |
|---|---|
| selection/invoke read | 原eligible仅候选；完整current/meaning/key/result优先，zero effect、zero run。初建lane资格/CAS不足保持blocked |
| A | same driver shared bound/依赖/fence/业务预算 reservation + intent Dispatching + attempt Claimed/Absent + lane Held + dedup/audit/seed/条件handoff；seal全等，actual proof才B |
| B | actual A attempt CAS -> InFlight、原immutable A seed复用、真实audit/条件规则；actual B proof与最后current齐才借材料并外呼；取消/commit未知零IO |
| dispatch | 一次原method，零tx；lease/Future完成或本地终止后结束短借。外部未知不由drop/clock/lease证明NoIo |
| C / D | 实际结果及所有需要的原关联完整CAS；receipt只Absent immutable。C Unknown head不越；D只真实C后NoIo合法边，不多次IO。known回链缺current可仅记录原known结果；缺complete shared bounds保旧下界和未知head，不提早Ready |
| result | immutable首接管proof复用，不升外部终态；实际当前stages从committed snapshot取。每阶段不同mutation，original/key/effect不换，commit/rollback异常保原mutation并只权威查询 |

### 1.5 错误映射

| 情形 | 有限处置 / 禁止 |
|---|---|
| wrong effect/op/metadata/namespace；same key不同meaning | InvalidInput/Conflict，zero claim/IO；不返回hidden winner、不换key |
| plan/source/generation/Gate/附件/secret stale、unsupported edit/delete/thread | original已知情况下保phase，安全Blocked或finite Stale/Unsupported；Planned/RetryWait才能block/mark_unsupported，不把Dispatching复活 |
| all bounds不齐、clock/route/provider/store/source未建立 | Blocked/NotEstablished/Unavailable；429提示必须已核单位/clock，不能默认零等待或硬编码quota |
| actual claim/one-use/CAS loser或A/B未知 | actual rollback或original unknown；zero dispatch，no lease到期重抢 |
| dispatch timeout/cancel/Err/业务字段不足 | actual Indeterminate original attempt/effect，原head保存；无receipt/NoEffect/retry，无普通error丢identity |
| known effect后C/D失败 | 保actual known/no-IO安全结果和original/local mutation，J02只权威恢复；local rollback不撤销外部效果 |
| output current不可见 | 不暴露ref/count/stage，有限不披露错误；不造0计数或JobResultDisposition::Unavailable |

### 1.6 状态与事件副作用

候选逐Step6：DeliveryIntent Planned/RetryWait -> Dispatching -> PlatformAccepted/KnownRejected或Indeterminate；有正式NoEffect全资格才RetryWait。DeliveryAttempt新Claimed -> InFlight -> KnownAccepted/KnownRejected或Indeterminate；真实NoIo经actual Indeterminate才能NotDispatched。DispatchLane Ready -> Held -> Ready/Blocked/Cooldown；Unknown保unresolved_head，即使Cooldown到期也不能finish_cooldown越过。QualifiedRateLimitBoundSet所有scope取最大下界；Slack method/workspace/app/channel、Mattermost server/method/resource、Telegram bot/global/chat/resource/retry_after、Discord bucket/major resource/global/Retry-After都需正式adapter合同。跨lane新bound以list_affected_by_bounds完整页和same-driver scope原子条件合并；bounded读不足不能宣称global完成。

每个actual变化沿G0唯一安全audit/result及条件O01；不建通用outbox/TraceRecord/平台truth镜像。仅known+current的message mapping可Linked；delete欠owner处置不Tombstoned。ACK、Local commit、Platform business result、用户送达/已读彼此独立；本flow零owner Turn/Decision/Artifact/Workspace mutation，敏感Gate降级无action，附件仅有效授权引用。

### 1.7 测试切口与停审

沿Step4 planned `crates/application/tests/authorization_flow_tests.rs`、`crates/application/tests/continuity_flow_tests.rs`、`crates/infra/tests/platform_boundary_tests.rs`、`crates/infra/tests/local_commit_boundary_tests.rs`、`crates/infra/tests/private_material_boundary_tests.rs`及Jobs/Worker调用边界，不创建或运行测试：A/B commit每类结果与崩溃点零send；first local1不可当actual CAS；同effect并发claim最多一次；global/shared bucket最大下界与page不足；SDK隐藏retry拒绝；known reject无NoEffect不RetryWait；NoIo非NoEffect及InFlight非法边；Unknown head阻后序；取消不造proof；known create locator、delete NotApplicable/owner tombstone缺口；secret轮换/附件撤销/线程parent stale；结果不可披露与零raw材料泄漏。

| 停审项 | 本flow设计结论 / 缺口 |
|---|---|
| DTO/factory/port | 全三字段input、七参attempt/八参receipt/九参lane/五参retry及具名调用回指已核；没有新port/helper |
| 事务/状态 | A/B/C分阶段actual baseline，NoIo D合法后置；同keyimmutable seed与mutable业务结果分开，无预造commit |
| 限流/恢复/current | all scopes max、actual claim/fence/budget和最后重验；无隐藏retry，unknown/manual安全，NoIo不足不schedule_retry |
| 副作用/结果/测试 | 仅local owned对象，条件O01仍受BR-UP-006，safe summary及planned切口齐，无运行事实 |
| positive边界 | J01只消费actual完整intent/lane；受权R2首建归C04/E02且双轴Absent，J01不隐式首建；产品/current缺口与BR-UP不关闭 |

J01人工设计停审`pass_fail_closed_design`；不是投递或编译ready。下一只读取J02原recovery/subject/权威probe来源，再思考写入，不进入后续Step，无需提交。

## 2. J02 ReconcileBridgeOperationJob

### 2.1 入口与目标

`select_recovery_candidates` -> 原plan Operation {recovery,subject} -> wrapper/`ReconcileBridgeOperationJobRequest::into_parts` -> `ReconcileOperationJobInput::from_parts(job,recovery,subject,continuity)` -> `ReconcileBridgeOperationJob::execute(input,control)`。Application/U5；[Step8 J02/§7~8](03_ddd_step_08_job_protocols.md)、Step6 RecoveryRecord与各原subject对象、Step7 AuthoritativeRecoveryPort/ContinuityRepository及J02注入的Inbound/Delivery/Callback/Mapping/Lane/SafeTrace读写面。Gap在body/input admission即拒绝，只J03负责，不扩大RecoveryJobResult allowlist。

问题/诊断：恢复授权、只读来源、业务效果、local commit是四个独立条件。采用原record进入Probing的实际local提交、事务外原stage readonly probe、actual known的后续完整CAS finalize；不采用重新append/approve/send、同ID“重新试一次”或NotFound=NoEffect。已有Probing在原current window/budget内只读续查，不重做begin_probe或生成第二recovery。

受权R4闭口S9-GAP-LOCAL-PROBE：AuthoritativeRecoveryPort.locate_local_unknown从actual retained同driver journal取same subject/original唯一未决阶段LocalMutationRef，多个阶段歧义Conflict，无locator None；不能从op造mutation或选latest。probe_local_commit仍独立LocalCommitDisposition，known只更新该local阶段观察/读actual baseline。当前明确local-only不产生Resolved，保持原责任或合法Manual；已有foreign来源及原资格才继续readonly probe，zero业务reapply。

受权R4闭口S9-GAP-RECOVERY-RECEIPT：ProbeOutcome::Platform载荷为完整KnownPlatformBusinessResult（actual结果+同次已核bounds）；readonly正式方法无法给完整值则Unknown/Unavailable，不能用现时shared bounds补原响应。actual匹配immutable receipt先复用，否则全八参from_known/Absent append与原attempt/intent/lane全CAS finalize；known业务结果不推用户送达或已读。

| DTO / 构造全集 | 唯一来源 / 缺失出口 |
|---|---|
| input四字段 | actual host job、body原recovery+subject、selection原continuity；同record subject/op/effect/scope/trace一致。先get_recovery再按BridgeMaintenanceSubject::Recovery重新qualify_job_key，不从subject猜record |
| read/原关联 | Config.qualify_maintenance_read取得Maintenance session；Continuity.get_recovery实际完整行，原subject分别Inbound.read_snapshot、Callback.read_snapshot、Delivery.read_snapshot或SafeTrace.read_handoff_snapshot。原mutation仅actual exact retained来源，缺或歧义不猜 |
| meaning三参 | RecoveryOperationMeaning::from_parts(subject,original.operation,authorization) -> BodyFreeOperationMeaningRef::Recovery；authorization实际record并经qualify；key仍包括原recovery/subject/op及trusted scope recipe，不纳trace/requested_at/new record |
| current资格六字段 | recovery.qualify(subject,original,record.authorization_basis,job)实际输出RecoveryQualificationRef {subject,original,authorization,window,budget,source}；assert_original核全same关联，authorization不自动授新effect |
| begin_probe二参 | actual current RecoveryQualificationRef、actual Requested/Manual/Blocked的ExpectedLocalRevision；Manual/Blocked仅正式显式重新建立授权，原op不换。Probing续查不重复转态 |
| secret | 从actual原subject/source关联取得完整Installation；只有正式Platform/source readonly方法要求credential时，Config.qualify_installation/qualify_secret_use AuthoritativeProbe -> resolve owning lease -> final revalidate -> borrow_secret；local/owner/consumer正式不需secret给None，无PAT权限推导 |
| probe四字段 | AuthoritativeRecoveryPort原实际结果 -> AuthoritativeProbeResultRef(subject,original,ProbeOutcome,basis)；每variant与所查stage相符，wrong kind拒绝，结构合法不代表权威 |
| known finalize | Inbound.apply_owner_result、CallbackHandoffRecord.apply_owner_result、DeliveryAttempt.record_result、有actual receipt的DeliveryIntent.apply_receipt、SafeHandoffRecord.apply_consumer_result；每参actual same-op outcome+完整原行CAS。原action Claimed无Active回边；无owner/platform重执行 |
| retry/resolve四参 | RecoveryRecord::resolve(result,kind,retry,local)：FinalizeOnly仅actual known且required local关联完整；SameEffectRetryEligible仅actual NoEffect+RetryEligibilityRef全部五源齐，no next IO；Unknown/Pending/Unavailable/Unresolved不Resolved。GapCovered仅J03，不在J02输出 |
| 阻断/人工 | RecoveryRecord::block(maintenance_basis,reason,actual local)须正式维护basis；require_manual(reason,actual local)仅Requested/Probing合法。Manual/Blocked无变化不造新mutation，raw日志不能补依据 |
| safe结果六参 | SafeJobResultSummary(actual disposition,可见Inbound/Callback/Intent/Handoff subjects,获准maintenance_subjects,授权counts或None,独立stages,finite reason) -> RecoveryJobResult::from_summary；不可见ref/count不出 |

### 2.2 函数级调用图：ReconcileBridgeOperationJob

```text
[Jobs original recovery + subject -> J02.execute]
  | query actual recovery + subject snapshot + original key/result
  | call AuthoritativeRecoveryPort.qualify, verify exact source/window/budget
  | tx A: call RecoveryRecord.begin_probe; save recovery/audit/seed; actual commit
  v
[readonly stage-specific probe, no tx held]
  +--> local: exact mutation -> probe_local_commit -> LocalCommitDisposition
  |           missing exact locator -> blocked, preserve original unresolved
  +--> owner/action/platform/consumer: probe_original -> same-op ProbeOutcome
  v
[tx B on complete actual post-A baseline]
  | known -> call original result-only Domain methods + full associated CAS
  | no-effect + all retry sources -> record eligibility only, zero effect
  | pending/unknown/unavailable -> manual/preserve, never Resolved
  | save recovery + original subject/receipt/mapping/lane when legal
  | append safe audit; reuse original immutable seed; no recursive O01
  | seal then actual commit/rollback
  v
[current filtered RecoveryJobResult; original stage identity retained]
```

关键说明：

- local commit只查exact mutation；foreign只读原stage，两种结果不互转、不重apply业务动作。
- 完整required receipt/current/finalize不足不Resolved或清head；Gap只J03，结果裁剪不制造证据。

### 2.3 关键伪代码

```rust
// [ContinuityRepository.get_recovery(RecoveryRecordRef recovery, BridgeLocalReadSession read, BridgeCallControl control)]
let recovery_row = continuity.get_recovery(&input_recovery, &session, control).await;
// Actual complete row required; compare input subject/continuity/op/effect before any qualification/probe.
// [LocalUnitOfWorkPort.qualify_job_key(BridgeMaintenanceSubject subject, TrustedJobContext job, BridgeCallControl control)]
let key_result = uow.qualify_job_key(&maintenance_subject, &job, control).await;
// G0 original dedup/result; actual known terminal reuse, nonterminal same-op read-only continuation only.
// [AuthoritativeRecoveryPort.qualify(OriginalRecoverableSubjectRef subject, OriginalOperationEffectRef original, RecoveryAuthorizationRef basis, TrustedJobContext job, BridgeCallControl control)]
let qualification_q = recovery.qualify(&subject, &original, &authorization, &job, control).await;
// [RecoveryQualificationRef.assert_original(OriginalRecoverableSubjectRef subject, OriginalOperationEffectRef original)]
let source_guard = actual_qualification.assert_original(&subject, &original);
// Consumer recovery A is also original handoff lifecycle; qualification is outside every local tx.
// [SafeObservationPort.qualify_nonrecursive(SafeHandoffRecord record, BodyFreeMutationMaterial material, ActorRef actor, BridgeCallControl control)]
let rule_a_q = /* Consumer subject only */ mutation.observation.qualify_nonrecursive(&actual_handoff, &actual_probe_phase_material, &job_actor, control).await;
// Consumer A requires Qualified whole A subjects/phase -> NonRecursiveResultOnly; missing rule zero begin/stage/probe.
// [RecoveryRecord.begin_probe(RecoveryQualificationRef qualification, ExpectedLocalRevision local)]
let probing_candidate = /* Requested/explicitly authorized Manual/Blocked only */ record_a.begin_probe(current_qualification, record_expected_a);
// [ContinuityRepository.stage_recovery(RecoveryRecord candidate, LocalRevisionCondition expected, BridgeLocalTransaction tx, BridgeCallControl control)]
let probing_stage = continuity.stage_recovery(&record_a, record_condition_a, &mut tx_a, control).await;
// A G0 begin precedes stage, audit/seed/observation/seal/actual commit; failures rollback, zero foreign probe.
// Probing already actual committed: no fresh begin_probe; verify original budget/window again outside tx.
// [AuthoritativeRecoveryPort.probe_local_commit(LocalMutationRef mutation, OriginalOperationEffectRef original, BridgeLocalReadContext read, BridgeCallControl control)]
// [AuthoritativeRecoveryPort.locate_local_unknown(OriginalRecoverableSubjectRef subject, OriginalOperationEffectRef original, BridgeLocalReadContext read, BridgeCallControl control)]
let retained = recovery.locate_local_unknown(&subject, &original, &read, control).await?;
// None or multiple unresolved phases: no local probe; preserve actual original/manual, not NoEffect.
let local = /* exact actual locator branch only */ recovery.probe_local_commit(&original_mutation, &original, &read, control).await;
match local {
    Ok(LocalCommitDisposition::Committed(proof)) => { /* verify mutation/original/revisions; read actual rows, no effect replay. */ }
    Ok(LocalCommitDisposition::RolledBack(proof)) => { /* only original local not committed; foreign status remains independent. */ }
    Ok(LocalCommitDisposition::Indeterminate(mutation)) => { /* stop local recovery, retain original identity. */ }
    Err(_) => { /* finite failure with original retained; no fabricated local result/NoEffect. */ }
}
// Exclusive foreign branch, secret None unless actual source requires exact AuthoritativeProbe use.
// [AuthoritativeRecoveryPort.probe_original(RecoveryQualificationRef qualification, Option<PrivateSecretHandle> secret, BridgeCallControl control)]
let foreign = recovery.probe_original(&actual_qualification, secret_borrow, control).await;
// [AuthoritativeProbeResultRef.assert_original(OriginalOperationEffectRef original)]
let same_op = actual_probe.assert_original(&original);
// No local tx held. Consume exact foreign result, then preflight every branch-specific qualification.
if /* actual NoEffect for Platform subject */ no_effect_branch {
    // [PresentationQualificationPort.revalidate(SafePresentationPlan plan, ImmutableDeliveryTargetRef target, ActorRef actor, BridgeCallControl control)]
    let current_q = presentation.revalidate(&actual_plan, &original_target, &job_actor, control).await;
    // [PresentationQualificationPort.qualify_retry(DeliverySnapshot delivery, LaneSnapshot lane, NoEffectBasisRef no_effect, CurrentPresentationQualification current, TrustedJobContext job, BridgeCallControl control)]
    let retry_q = /* only Qualified current */ presentation.qualify_retry(&actual_delivery, &actual_lane, &no_effect, &current_presentation, &job, control).await;
    // Nonqualified -> manual/preserve; no early ? drops original/A responsibility. Qualified retained for tx B pure branch.
}
if /* actual Consumer subject: known finalize or legal maintenance */ consumer_branch {
    // [SafeObservationPort.qualify_nonrecursive(SafeHandoffRecord record, BodyFreeMutationMaterial material, ActorRef actor, BridgeCallControl control)]
    let rule_q = mutation.observation.qualify_nonrecursive(&actual_handoff, &actual_consumer_material, &job_actor, control).await;
    // Qualified covering handoff+recovery+dedup/audit/result/whole writes only -> NonRecursiveResultOnly, handoff=None.
    // Missing rule retains actual result and A/original responsibility; zero tx B/producer, no fallback.
}
// Complete B expected/material/seed/formal observation outside tx; immutable receipt lookup first.
// [LocalUnitOfWorkPort.begin(LocalMutationRef mutation, OriginalOperationEffectRef original, ExpectedLocalRevisionSet expected, MutationObservationRequirement observation, BridgeLocalReadContext read, BridgeCallControl control)]
let begun_b = uow.begin(&mutation_b, &original, &complete_expected_b, &formal_observation_b, &read, control).await;
// Only actual Ok unique tx_b enters pure/stage match below; first failure exclusive rollback.
match actual_probe.outcome() {
    ProbeOutcome::Owner(owner_result) => {
        // [InboundHandoffRecord.apply_owner_result(OwnerHandoffResultRef result, ExpectedLocalRevision local)]
        let change = /* Known only, Pending only legal original state */ inbound_candidate.apply_owner_result(actual_owner_result, inbound_expected);
        // [InboundRepository.stage(InboundHandoffRecord candidate, LocalRevisionCondition expected, BridgeLocalTransaction tx, BridgeCallControl control)]
        let staged = inbound.stage(&inbound_candidate, inbound_condition, &mut tx_b, control).await;
    }
    ProbeOutcome::Action(action_result) => {
        // [CallbackHandoffRecord.apply_owner_result(OwnerActionResultRef result, ExpectedLocalRevision local)]
        let change = callback_candidate.apply_owner_result(actual_action_result, callback_expected);
        // [CallbackRepository.stage_callback(CallbackHandoffRecord candidate, LocalRevisionCondition expected, BridgeLocalTransaction tx, BridgeCallControl control)]
        let staged = callbacks.stage_callback(&callback_candidate, callback_condition, &mut tx_b, control).await;
        // Claimed action unchanged; no claim_once/reserve_one_use/owner action again.
    }
    ProbeOutcome::Platform(known) => {
        // [DeliveryAttempt.record_result(PlatformBusinessResultRef result, ExpectedLocalRevision local)]
        let change = attempt_candidate.record_result(actual_platform_result, attempt_expected);
        // [DeliveryRepository.stage_attempt(DeliveryAttempt candidate, LocalRevisionCondition expected, BridgeLocalTransaction tx, BridgeCallControl control)]
        let staged = delivery.stage_attempt(&attempt_candidate, attempt_condition, &mut tx_b, control).await;
        // [PlatformReceipt.from_known(PlatformReceiptRef receipt_ref, AttemptEffectRef attempt_effect, KnownPlatformBusinessResultKind result_kind, VerifiedExternalMessageLocatorSlot external_locator, PlatformResultAuthorityRef authority_basis, NoEffectBasisRefSlot no_effect_basis, SafeReasonCode safe_reason, KnownPlatformBusinessResult known)]
        let receipt = /* matching original receipt reuse first, else full actual known */ PlatformReceipt::from_known(receipt_ref, attempt_effect, known_kind, actual_locator, actual_authority, actual_no_effect, reason, known)?;
        // [DeliveryIntent.apply_receipt(PlatformReceipt receipt, ExpectedLocalRevision local)]
        let intent_change = intent_candidate.apply_receipt(&receipt, intent_expected);
        // [DeliveryRepository.append_receipt(PlatformReceipt candidate, LocalRevisionCondition expected, BridgeLocalTransaction tx, BridgeCallControl control)]
        let receipt_stage = /* only new actual known receipt */ delivery.append_receipt(&receipt, LocalRevisionCondition::Absent, &mut tx_b, control).await;
        // [DeliveryRepository.stage_intent(DeliveryIntent candidate, StableEffectIdentity effect, LocalRevisionCondition expected, BridgeLocalTransaction tx, BridgeCallControl control)]
        let intent_stage = delivery.stage_intent(&intent_candidate, &original_effect, intent_condition, &mut tx_b, control).await;
        // [DispatchLane.apply_bounds(QualifiedRateLimitBoundSet bounds, Option<LocalAttemptDispositionRef> release, ExpectedLaneRevision expected, ExpectedLocalRevision local)]
        let bounds_change = /* Held/Ready only, full same-response bounds + original disposition */ lane_candidate.apply_bounds(actual_all_bounds, Some(actual_known_disposition), lane_expected, lane_local_expected);
        // Blocked original head remains unless full current/finalize qualifies restore_ready; no blind release.
        // [LaneRepository.stage(DispatchLane candidate, ExpectedLaneRevision lane_expected, LocalRevisionCondition expected, BridgeLocalTransaction tx, BridgeCallControl control)]
        let lane_stage = /* legal actual changed lane only */ lanes.stage(&lane_candidate, &lane_expected, lane_condition, &mut tx_b, control).await;
        // Same attempt/intent/lane complete CAS; existing receipt reused, never append overwrite.
    }
    ProbeOutcome::Consumer(consumer_result) => {
        // [SafeHandoffRecord.apply_consumer_result(ConsumerDispositionRef result, ExpectedLocalRevision local)]
        let change = handoff_candidate.apply_consumer_result(actual_consumer_result, handoff_expected);
        // [SafeTraceRepository.stage_handoff(SafeHandoffRecord candidate, LocalRevisionCondition expected, BridgeLocalTransaction tx, BridgeCallControl control)]
        let staged = trace_repo.stage_handoff(&handoff_candidate, handoff_condition, &mut tx_b, control).await;
        // Formal current canonical/admission required; no recursive handoff creation.
    }
    ProbeOutcome::NoEffect(no_effect) => {
        // Pure branch consumes only complete retry eligibility obtained before begin_b; no network in tx.
        // [DeliveryIntent.schedule_retry(RetryEligibilityRef retry, ExpectedLocalRevision local, SafeInstant now)]
        let retry_change = /* Qualified same original effect only */ intent_candidate.schedule_retry(actual_retry, intent_expected, now);
        // Nonqualified chose Manual/preserve before begin_b; zero new attempt/IO, NoIo not cast to NoEffect.
    }
    ProbeOutcome::Coverage(_) => { /* InvalidInput: Gap is J03, never produce J02 Gap result. */ }
    ProbeOutcome::Unknown(_) | ProbeOutcome::Unavailable(_) => { /* legal require_manual only; no Resolved/no-effect. */ }
}
// [RecoveryRecord.resolve(AuthoritativeProbeResultRef result, SafeRecoveryResolutionKind kind, Option<RetryEligibilityRef> retry, ExpectedLocalRevision local)]
let resolved = /* full known finalize or complete NoEffect retry eligibility only */ record_b.resolve(actual_probe, actual_resolution, retry, recovery_expected_b);
// [RecoveryRecord.require_manual(SafeReasonCode reason, ExpectedLocalRevision local)]
let manual = /* unresolved/partial exclusive branch */ record_b.require_manual(reason, recovery_expected_b);
// B G0 begin/full expected precedes all stages; original dedup/seed, audit, formal nonrecursive consumer rule.
// [LocalUnitOfWorkPort.commit(BridgeLocalTransaction tx, BridgeCallControl control)]
let actual_b = /* validated/sealed complete set only */ uow.commit(tx_b, control).await;
// [LocalUnitOfWorkPort.rollback(BridgeLocalTransaction tx, BridgeCallControl control)]
let rollback = /* first tx failure, exclusive handle */ uow.rollback(tx, control).await;
// [RecoveryJobResult.from_summary(SafeJobResultSummary summary)]
let result = RecoveryJobResult::from_summary(current_filtered_actual_summary);
```

每个match分支先核kind、actual subject/op/effect/authority；unknown不写终态；Pending只原pending同态，Indeterminate无Pending回边则保未知/manual。同结果零revision/audit。受权R4已显式注入PresentationQualificationPort，revalidate原plan后qualify_retry取得NoEffect/budget/presentation/window/not_before五源齐的原effect资格；缺任一Manual，NoIo不替NoEffect，已known成功不retry/重新claim。

Platform字段绑定：`known.result()`六字段按原`PlatformBusinessResultRef::from_parts(attempt,kind,authority,locator,no_effect,reason)`完整安全重建供attempt消费，零新结果依据、无隐式Clone/private复制；receipt八参的attempt_effect/kind/locator/authority/no_effect/reason全部与actual六字段相等，receipt_ref只实际existing或UoW Receipt-purpose技术ID，known最后一参是原同响应result+rate_bounds。existing receipt从DeliveryRepository.get_receipt/read_snapshot取得并比全业务字段，冲突不覆盖；新receipt仅Absent append。已知结果与same-response bounds同时保留，缺完整readonly合同不能造receipt/Resolved。Lane KnownFinal依据取实际same-attempt正式结果，restore_ready前需原subject结果完整finalize与current scope/依赖/预算资格；不足保Blocked head，不夸大可retry。

### 2.4 事务边界

| 阶段 | 原子集 / 边界 |
|---|---|
| admission/read | 四subject allowlist、原recovery/subject完整关联与original result优先；缺exact local mutation定位零local probe，缺source/window零foreign probe |
| A Probing | actual原RecoveryRecord CAS + 正式current qualification + 原dedup/seed/audit/condition；actual commit后才能对应只读probe，unknown只原mutation查询，不重复apply |
| readonly | local commit独立LocalCommitDisposition；foreign只原正式method，secret只required source短借，无tx、零apply/send。request authorization或secret存在不等probe source兼容 |
| B finalize | recovery+original mutable结果及实际known receipt/qualified映射/lane全CAS；局部不足不得Resolved/释放未知head。foreign已发生不被local rollback撤销，失败保actual result及original/mutation |
| consumer | 原result-only+正式非递归audit规则，handoff=None；没有该规则Blocked，不把BR-UP-006回执变新producer |
| summary | 真实bounded结果/独立stage/current获准count，不以local Committed推Owner/Platform/Consumer成功 |

### 2.5 错误映射

| 条件 | 有限结果 / 恢复责任 |
|---|---|
| missing record、wrong input subject/op/effect、Gap | authorized absence有限NotFound/InvalidInput；禁止补新record/op或Gap包装结果 |
| raw source/日志/NotFound/ACK/lease expiry/timeout | Unknown/Unavailable/manual；无NoEffect/NoIo/coverage推导 |
| local locator None/多阶段歧义或local-only completion | 受权R4：None保原unresolved，多阶段Conflict；local-only不Resolved，不伪造mutation或ProbeOutcome::Local |
| platform probe缺receipt所需完整known | 受权R4：readonly返回Unknown/Unavailable、保原known责任与head，Manual而非伪Resolved |
| current授权、readonly method、安装/secret/window/budget缺失 | finite Blocked/Denied/Stale/NotEstablished；不调用send或authority fallback，原subject/op保存 |
| post-A/known结果后的tx error/cancel | actual rollback或Indeterminate {original,phase}，原mutation/result责任保留；无ordinary early error丢identity |
| output隐藏 | refs/count/stage裁剪，counts None，不造空subject“全部成功”或运行report |

### 2.6 状态与事件副作用

Recovery Requested/显式再受权Manual/Blocked -> Probing -> Resolved只FinalizeOnly/SameEffectRetryEligible；Unknown/Unavailable/Pending/缺required构造留Manual或合法Blocked。Inbound HandoffPending/Indeterminate -> OwnerAccepted/OwnerRejected；Callback OwnerPending/Indeterminate同样只真实结果；原action Claimed不释放、不回Active。Attempt InFlight/Indeterminate -> KnownAccepted/KnownRejected，Claimed未知只能mark_unknown实际提交后再恢复，不非法直apply。Intent Dispatching/Indeterminate只actual receipt终态或完整NoEffect RetryWait；Handoff Dispatching/Indeterminate只actual consumer终态。Lane恢复unknown head只同原attempt权威结果+完整finalize/current；不能有known attempt就清未终结intent依赖。

只维护原local受权记录，body-free audit/immutable result及条件规则沿G0；缺准入不造canonical/事件。consumer result-finalize零递归O01；无Turn/Decision/Artifact/Workspace/platform truth、raw补档、run/report/evidence/signoff。

### 2.7 测试切口与停审

沿Step4 planned `crates/application/tests/authorization_flow_tests.rs`、`crates/application/tests/continuity_flow_tests.rs`、`crates/infra/tests/platform_boundary_tests.rs`、`crates/infra/tests/local_commit_boundary_tests.rs`、`crates/infra/tests/private_material_boundary_tests.rs`、`crates/jobs/tests/job_invocation_tests.rs`：四subject/五probe类型wrong组合；Gap在IO前拒绝；recovery ID/subject/op不匹配；缺exact local mutation与local RolledBack非foreign NoEffect；platform probe缺同次bounds不造receipt；known current失效仅保结果不补mapping；Claimed callback不重批；Pending/Unknown/NotFound/timeout不Resolved；授权重建Manual/Blocked与Probing续查预算；result-finalize无递归handoff；A/B每崩溃点original retained及current隐藏count。均planned，未执行。

| 停审项 | 设计结论 / 缺口 |
|---|---|
| DTO/port/factory | 四字段input保record+subject，原qualification/probe完整schema、typed finalize存在；local/foreign不混型 |
| 事务/状态/错误 | A actual Probing与B known/manual全CAS，Unknown不重apply；原immutable proof/result与阶段结果分开 |
| positive边界 | 受权R4/R5本地locator/known/retry/非递归规则消费闭合；正式source/budget/current/admission/rule不足仍有限blocked，BR-UP不关闭 |
| 边界/测试/结果 | zero business IO/new permission，原安全结果和known责任保留，planned切口齐，不宣运行ready |

J02人工设计停审`pass_fail_closed_design`；完整positive恢复尚受记录缺口阻断。下一只读J03原gap/recovery/cursor、comparator和两种coverage，再独立思考写入，无需提交。

## 3. J03 ReconcileStreamGapJob

### 3.1 入口与目标

`select_gap_candidates` -> 原Gap plan -> `ReconcileStreamGapJobRequest::into_gap` -> `ReconcileGapJobInput::from_parts(job,gap,continuity)` -> `ReconcileStreamGapJob::execute(input,control)`。Application/U5；[Step8 J03](03_ddd_step_08_job_protocols.md)、Step6 GapRecord/StreamCursor/RecoveryRecord与coverage/comparator卡、Step7 continuity/recovery/config/secret/mutation注入面。只原gap、原range、原tracking op的readonly coverage恢复，不重放raw item、不重新append或从新epoch跳水位。

问题/诊断：gap完整source覆盖不证明目标stage全部处理已commit；partial结果也不是GapState::Partial。采用A原gap+recovery Probing实际提交、事务外probe_gap、B full close或retain/manual；cursor.advance单独要求完整ContinuityCoverageRef、same-stage committed事实、current comparator和双CAS。不采用空页=coverage、范围按token/时间排序或source ACK推进Owner/Delivery stage。

受权R4闭口S9-GAP-GAP-RECOVERY-LINK：C06对Gap subject调用GapRecord.attach_recovery，原gap Present CAS和Requested recovery Absent同UoW/同subject/tracking op/受权依据；actual commit后才Established。J03只读该已提交关联，不临时find后cast Slot、不新建recovery。

受权R4闭口S9-GAP-STAGE-COVERAGE：AuthoritativeRecoveryPort.qualify_stage_coverage明确same stream/epoch/stage/formal comparator/full range与全部actual committed阶段依据，返回ContinuityCoverageRef；不能拿source gap proof或read_basis自签。部分/未知Unavailable；full gap close独立成立，cursor只有Qualified stage coverage+After+两轴CAS才advance，零时间/offset猜测。J05也显式注入该port，同epoch requalify不advance。

| DTO / factory或成员参数全集 | actual来源 / 缺失出口 |
|---|---|
| input三字段 | host job、body原GapRef、selection完整continuity；Gap subject/op/scope/trace完全一致，requested_at不入key、不当now |
| 完整read | Config.qualify_maintenance_read；Continuity.get_gap、get_cursor、get_recovery/read_snapshot及list_gaps完整页，同source/stream/epoch/stage及read_basis。recovery Slot Missing/Stale或association歧义Blocked，不由job actor猜恢复授权 |
| original/key/meaning | 原gap tracking operation及actual original effect、原受权recovery.authorization_basis；BridgeMaintenanceSubject::Gap重推key，RecoveryOperationMeaning(subject Gap,original.operation,authorization)及BodyFreeOperationMeaningRef::Recovery，原key/result优先。原完整original读取不足拒绝，不造second op |
| current qualification六参 | AuthoritativeRecoveryPort.qualify(actual Gap subject,original,actual authorization,job) -> RecoveryQualificationRef；same range/stream/epoch/window/source/budget，qualification不是Gap ID权限 |
| A两对象成员 | GapRecord::begin_probe(recovery_ref,qualification,actual gap local)；RecoveryRecord::begin_probe(qualification,actual recovery local)。只有Open/显式再授权Manual gap及Requested/显式再授权Manual/Blocked recovery；已有实际Probing按原budget只读续查，不重复迁移 |
| readonly secret | actual gap/source的Installation+Config AuthoritativeProbe资格；正式source需要时owning Secret lease最后revalidate/短借，其余None。readonly API/mode/window未核不调用；secret存在不授coverage |
| probe结果四字段 | actual AuthoritativeProbeResultRef {subject Gap,original,outcome,basis}；Coverage里AuthoritativeCoverageRef(gap,原range,实际ComparableRangeBounds,formal完整性basis)；assert_covers必须source comparator证明，Unknown range需明确原gap全覆盖，不补范围界 |
| close/retain/manual | GapRecord::close(actual full coverage,actual local)；retain_uncovered(actual same-gap authoritative result,actual local)仅明确满足原未覆盖语义；不可表示的partial/Unknown/Unavailable沿require_manual(finite reason,actual local)。不能制造ProbeOutcome::Partial或缩range丢历史 |
| 两种coverage | B gap close只AuthoritativeCoverageRef。C cursor另需qualify_stage_coverage取得ContinuityCoverageRef五源：same-stage/source、原epoch、原base到candidate全range、全部actual Closed gap proof、阶段全部committed basis；新B candidate不能预先参与stage证明。缺typed来源C零advance，非结构factory授予 |
| comparator/advance四参 | candidate取full coverage.covered.end合法source候选；recovery.compare_position(stream,epoch,cursor.position,candidate,actual comparator) -> ComparablePositionRef；assert_base/coverage.assert_candidate通过且After才StreamCursor::advance(candidate,coverage,actual ExpectedCursorRevision,actual local)。Equal no-op、Before拒绝、Incomparable保水位 |
| requalify六参 | StreamCursor::requalify_same_epoch(epoch,comparator,stage coverage,actual cursor expected,actual local,now)；只原epoch全资格重建，不推进position。必须actual提交该Ready阶段后才后续advance，不由fresh candidate冒actual CAS |
| recovery resolve四参 | original actual Coverage probe -> RecoveryRecord::resolve(result,GapCovered,None,actual recovery local)；仅full原range，关闭一个gap不等whole stream recovered。partial/Unknown不Resolved |
| safe输出六参 | SafeJobResultSummary(actual disposition,当前获准Gap subjects,当前maintenance subjects,授权counts或None,独立stages,finite reason) -> GapRecoveryJobResult::from_summary；Partial是本bounded结果标签，不是gap state |

rehydrate只repo hydration重建完整原模型，本flow不重新调用detect/initialize制造相同gap或空cursor。

### 3.2 函数级调用图：ReconcileStreamGapJob

```text
[Jobs original Gap -> J03.execute]
  | query actual gap + cursor + Established recovery + all required gap rows
  | query original key/result; call exact source/window/budget qualification
  v
[tx A]
  | call GapRecord.begin_probe + RecoveryRecord.begin_probe when legal
  | save both original CAS rows + dedup/audit/seed/conditional handoff
  | actual commit; Unknown -> zero probe, preserve original
  v
[AuthoritativeRecoveryPort.probe_gap, optional required secret, no tx]
  +--> full original range -> AuthoritativeCoverageRef.assert_covers
  |     tx B: call GapRecord.close + RecoveryRecord.resolve(GapCovered)
  |     actual B commit; then query complete committed stage/gap proof
  |     +--> phase C complete stage coverage + comparator available:
  |     |      call compare_position; tx C advance(After) with two CAS axes
  |     +--> no stage coverage: preserve actual Closed, cursor unchanged
  +--> actual uncovered -> call retain_uncovered, Gap Open
  +--> unknown/source/window failure -> call require_manual, Gap Manual
  | save original full set + audit/immutable seed; seal/commit or rollback
  v
[current filtered GapRecoveryJobResult; no whole-stream success inference]
```

关键说明：

- 只原gap/Established recovery/range受权probe，partial/空页不等覆盖，不新建关联或重放raw。
- source gap coverage只关原gap，cursor推进另需阶段committed coverage、正式comparator及两轴CAS。

### 3.3 关键伪代码

```rust
// [ContinuityRepository.get_gap(GapRef gap, BridgeLocalReadSession read, BridgeCallControl control)]
let gap_row = continuity.get_gap(&input_gap, &session, control).await;
// [ContinuityRepository.get_cursor(StreamCursorRef cursor, BridgeLocalReadSession read, BridgeCallControl control)]
let cursor_row = continuity.get_cursor(&actual_cursor_ref, &session, control).await;
// [ContinuityRepository.get_recovery(RecoveryRecordRef recovery, BridgeLocalReadSession read, BridgeCallControl control)]
let recovery_row = /* Established original association only */ continuity.get_recovery(&actual_recovery_ref, &session, control).await;
// Validate all original associations + G0 key/dedup/result; missing link does not mint a recovery.
// [AuthoritativeRecoveryPort.qualify(OriginalRecoverableSubjectRef subject, OriginalOperationEffectRef original, RecoveryAuthorizationRef basis, TrustedJobContext job, BridgeCallControl control)]
let qualification_q = recovery.qualify(&gap_subject, &original, &actual_authorization, &job, control).await;
// [GapRecord.begin_probe(RecoveryRecordRef recovery, RecoveryQualificationRef qualification, ExpectedLocalRevision local)]
let gap_probing = /* legal Open/explicitly reauthorized Manual only */ gap_a.begin_probe(actual_recovery_ref, current_q, gap_expected_a);
// [RecoveryRecord.begin_probe(RecoveryQualificationRef qualification, ExpectedLocalRevision local)]
let recovery_probing = /* legal original recovery only */ record_a.begin_probe(current_q, recovery_expected_a);
// A G0 begin/full expected -> stage_gap/stage_recovery + audit/seed/condition -> seal/actual commit.
// [AuthoritativeRecoveryPort.probe_gap(GapRecord gap, RecoveryQualificationRef qualification, Option<PrivateSecretHandle> secret, BridgeCallControl control)]
let probe = recovery.probe_gap(&actual_gap_a, &current_q, required_secret_borrow, control).await;
// No tx held; source current/window/budget rechecked. Err retains original/A phase, no coverage invented.
match actual_probe.outcome() {
    ProbeOutcome::Coverage(full) => {
        // [AuthoritativeCoverageRef.assert_covers(GapRef gap, QualifiedGapRangeRef range)]
        let covers = full.assert_covers(&input_gap, &original_range);
        // [GapRecord.close(AuthoritativeCoverageRef coverage, ExpectedLocalRevision local)]
        let closed = /* full guard only */ gap_b.close(actual_full, gap_expected_b);
        // [RecoveryRecord.resolve(AuthoritativeProbeResultRef result, SafeRecoveryResolutionKind kind, Option<RetryEligibilityRef> retry, ExpectedLocalRevision local)]
        let resolved = record_b.resolve(actual_probe, SafeRecoveryResolutionKind::GapCovered, None, recovery_expected_b);
        // B only closes gap/resolves recovery. New gap coverage is not yet committed and cannot prove stage continuity.
        // Optional cursor work is phase C below, after actual B commit and a new complete committed read.
    }
    ProbeOutcome::Unknown(_) | ProbeOutcome::Unavailable(_) => {
        // [GapRecord.require_manual(SafeReasonCode reason, ExpectedLocalRevision local)]
        let manual_gap = gap_b.require_manual(finite_reason, gap_expected_b);
        // [RecoveryRecord.require_manual(SafeReasonCode reason, ExpectedLocalRevision local)]
        let manual_recovery = record_b.require_manual(finite_reason, recovery_expected_b);
        // No cursor change/advance, no Resolved. Representable uncovered result uses retain_uncovered below instead.
    }
    _ => { /* wrong stage/kind: finite conflict/manual, zero advance or Closed. */ }
}
// [GapRecord.retain_uncovered(AuthoritativeProbeResultRef probe, ExpectedLocalRevision local)]
let retained = /* exclusive actual authoritative uncovered branch only */ gap_b.retain_uncovered(actual_uncovered_probe, gap_expected_b);
// B begins after readonly compare/current, with complete actual post-A CAS baseline and original immutable seed.
// [ContinuityRepository.stage_gap(GapRecord candidate, LocalRevisionCondition expected, BridgeLocalTransaction tx, BridgeCallControl control)]
let staged_gap = continuity.stage_gap(&gap_b, gap_condition_b, &mut tx_b, control).await;
// [ContinuityRepository.stage_recovery(RecoveryRecord candidate, LocalRevisionCondition expected, BridgeLocalTransaction tx, BridgeCallControl control)]
let staged_recovery = continuity.stage_recovery(&record_b, recovery_condition_b, &mut tx_b, control).await;
// B all required stages/audit/seed/condition -> validate/seal -> actual commit. First failure -> exclusive rollback.
// [LocalUnitOfWorkPort.commit(BridgeLocalTransaction tx, BridgeCallControl control)]
let actual = uow.commit(tx_b, control).await;
// C is optional local cursor continuation only after actual full Closed/Resolved; zero second gap probe or closure.
// Re-read complete ContinuitySnapshot through original committed Maintenance session; new own cursor/local expected.
// [AuthoritativeRecoveryPort.qualify_stage_coverage(StreamCursor cursor, ContinuitySnapshot snapshot, AuthoritativeComparatorRef comparator, BridgeLocalReadContext read, TrustedJobContext job, BridgeCallControl control)]
let coverage_c_q = /* outside tx C */ recovery.qualify_stage_coverage(&actual_cursor_c, &actual_continuity_c, &current_comparator, &read, &job, control).await;
// [AuthoritativeRecoveryPort.compare_position(CursorNamespaceStream stream, QualifiedStreamEpoch epoch, OpaqueStreamPositionSlot base, OpaqueStreamPosition candidate, AuthoritativeComparatorRef comparator, BridgeCallControl control)]
let comparison_c_q = /* complete coverage Qualified only */ recovery.compare_position(&stream, &original_epoch, &actual_position_c, &covered_candidate_c, &current_comparator, control).await;
// [ContinuityCoverageRef.assert_candidate(ComparablePositionRef candidate)]
let full_c_guard = actual_coverage_c.assert_candidate(&actual_comparison_c);
// [StreamCursor.advance(ComparablePositionRef candidate, ContinuityCoverageRef coverage, ExpectedCursorRevision expected, ExpectedLocalRevision local)]
let advanced = /* Ready + After only */ cursor_c.advance(actual_comparison_c, actual_coverage_c, cursor_expected_c, cursor_local_c);
// Nonqualified/Equal/Before/incomplete stage => zero C mutation; B actual Closed stays true, no cursor-success claim.
// C G0 preflight/audit rule and begin (same original, distinct local mutation) precedes typed stage.
// [LocalUnitOfWorkPort.begin(LocalMutationRef mutation, OriginalOperationEffectRef original, ExpectedLocalRevisionSet expected, MutationObservationRequirement observation, BridgeLocalReadContext read, BridgeCallControl control)]
let begun_c = uow.begin(&mutation_c, &original, &expected_c, &observation_c, &read, control).await;
// Only actual Ok tx_c continues; failed/unknown begin retains original/C identity, no stage.
// [ContinuityRepository.stage_cursor(StreamCursor candidate, Option<ExpectedCursorRevision> cursor_expected, LocalRevisionCondition expected, BridgeLocalTransaction tx, BridgeCallControl control)]
let staged_cursor_c = /* changed only, actual C tx */ continuity.stage_cursor(&cursor_c, Some(&cursor_expected_c), cursor_condition_c, &mut tx_c, control).await;
// Original seed/audit/conditional set, validate/seal, actual commit; no gap/recovery rewrite in C.
// [LocalUnitOfWorkPort.commit(BridgeLocalTransaction tx, BridgeCallControl control)]
let actual_c = /* full successful C set only */ uow.commit(tx_c, control).await;
// [LocalUnitOfWorkPort.rollback(BridgeLocalTransaction tx, BridgeCallControl control)]
let rollback = /* tx failure, phase handle only */ uow.rollback(tx, control).await;
// [GapRecoveryJobResult.from_summary(SafeJobResultSummary summary)]
let result = GapRecoveryJobResult::from_summary(actual_current_filtered_summary);
```

source只可表达full Coverage/Unknown/Unavailable的现有ProbeOutcome时，不能在代码外制造“PartialCoverage”类型；未覆盖的具体range若无正式typed结果合同，安全走Manual保原range，而非调用full factory、关闭后重建更小gap或把partial当零条。

受权X次序修正：B新coverage不能在提交前当actual Closed/stage proof。C从actual B后的完整原stage/gap结果读取取得新的覆盖，仅当前Ready+同epoch+After才推进；缺stage proof保Closed而零advance。重入若gap已Closed/recovery已Resolved，复用实际原结果、零B/foreign gap probe，可在原Maintenance/current/budget范围内继续C的单调local工作；Equal/Before/已满足时零写。C不是重执gap业务效果或新operation，只有原tracking op下独立local mutation/CAS；C unknown只该mutation probe，不能重apply，输出分开gap Closed与cursor未推进。

### 3.4 事务边界

| 阶段 | all-or-none / current边界 |
|---|---|
| admission | 原gap/Established recovery/op/epoch/range完整；关联只C06已提交，stage覆盖只具名qualified来源；零new record/grant |
| A | gap+recovery原Probing迁移及本地dedup/audit/seed/条件规则同tx；already Probing不重复stage，预算与window仍current；Unknown不发probe |
| probe/compare | 只读原source和正式comparator，required credential本call短借；无tx，无raw replay；不在事务中持网络请求 |
| B | actual A gap/recovery全CAS close/retain/manual，不stage cursor；range/epoch/原op保持。B新coverage未提交时不证明stage continuity |
| C（条件） | actual Closed/Resolved后的完整committed stage读取、qualify_stage_coverage/compare在tx外，After+Ready才独立cursor/local双CAS及原seed/audit/条件规则同tx。缺coverage/Equal零C写，B结果不撤回；C unknown只原mutation恢复 |
| requalify | 如原cursor Incomparable/Blocked且完整same-epoch资格实际已成立，独立local提交requalify；不能同一fresh候选再用伪actual版本advance；没有coverage/source资格继续原state |
| unknown/reentry | commit/rollback异常保original+mutation，no new apply/rekey；原只读probe仅正式窗口/预算继续，terminal Closed/Resolved current复用，不能重新Open |

### 3.5 错误映射

| 情形 | 有限处置 |
|---|---|
| missing gap/recovery/cursor或关联冲突 | authorized NotFound/InvalidInput/Conflict；关联仅C06 actual同tx attach，J03不自建record或拼Slot |
| window/comparator/source readonly/secret资格缺失 | legal Manual或Blocked summary/finite NotEstablished，保原gap/range/position，不按ACK/count补完 |
| partial/Unknown/Unavailable/空页/NotFound | Gap Open（仅正式retain语义）或Manual；无Partial state/Closed/Resolved，无jump水位 |
| full gap但无stage coverage | B实际close独立成立；C typed覆盖不足零advance，不把B未提交candidate/source proof提升stage |
| wrong stream/epoch/stage、Before/Incomparable、revision冲突 | finite Conflict/Stale/Unavailable，rollback候选，保原水位；不做opaque Ord、time排序、epoch替换 |
| A/B提交未知、取消/结果已known后错误 | original/phase retained，只有原mutation权威读；不能新op或重apply，不伪造coverage已durable |
| disclosure不足 | summary仅获准Gap/maintenance refs与独立stage/count，hidden counts None，不宣whole-stream recovered |

### 3.6 状态与事件副作用

Gap Open/显式受权Manual -> Probing -> Closed只full覆盖；Probing -> Open只真实未覆盖，Open/Probing -> Manual只缺来源/未知。Recovery同原Probing -> Resolved(GapCovered)只full，partial/manual不Resolved。Cursor Ready -> Ready advance需After+完整stage覆盖+双版本；无推进依据维持原position/state，合法same-epoch requalify只Incomparable/Blocked -> Ready且不推进。没有GapState::Partial，也没有CloseAll/新epoch拼接/ACK stage冒充。

实际local变化有唯一body-free audit、原dedup/immutable结果，条件O01仍受BR-UP-006；无每item outbox/持久projection/新source truth。raw消息不保存或纳入日志/evidence；没有新Turn/Decision/Artifact、coverage测试成功、stream readiness或run/report。

### 3.7 测试切口与停审

沿Step4 planned `crates/application/tests/authorization_flow_tests.rs`、`crates/application/tests/continuity_flow_tests.rs`、`crates/infra/tests/platform_boundary_tests.rs`、`crates/infra/tests/local_commit_boundary_tests.rs`、`crates/infra/tests/private_material_boundary_tests.rs`、`crates/jobs/tests/job_invocation_tests.rs`：Missing recovery首次关联、same gap/op/range一致性；full single-gap无stage coverage零advance；跨Protocol/Owner/Delivery coverage拒绝；Unknown range明确full source证明；partial/空页/NotFound保gap；opaque token/时间不能排序；After/Equal/Before/Incomparable；CursorRevision与local revision独立CAS；epoch变更保旧水位；requalify actual提交前不可advance；A/B/readonly取消与原mutation未知；授权count裁剪与zero raw。未执行。

| 停审项 | 设计结论 / 缺口 |
|---|---|
| DTO/object/port | input全三字段、原get/probe_gap/compare/stage面与三对象合法边齐；两种coverage严格不混 |
| 事务/状态/错误 | A/B与条件C实际baseline顺序、双CAS、full/partial/manual完整分流；网络不持tx，未知不重apply |
| positive边界 | 受权R4/X：C06 actual关联、具名stage覆盖、B close后独立C的actual读/CAS闭合；正式source/comparator/current不足仍blocked |
| 输出/副作用/测试 | current bounded Gap结果，zero replay/new permission，条件audit/O01与planned切口齐；无whole-stream成功 |

J03人工设计停审`pass_fail_closed_design`；不是全部gap可自动恢复或cursor推进ready。下一只读J04原canonical/op、claim/current/readonly consumer结果和非递归audit规则，无需提交。

## 4. J04 RetrySafeHandoffJob

### 4.1 入口与目标

`select_handoff_candidates` -> 原Handoff plan -> `RetrySafeHandoffJobRequest::into_handoff` -> `RetryHandoffJobInput::from_parts(job,handoff,continuity)` -> `RetrySafeHandoffJob::execute(input,control)`。Application/U6；[Step8 J04](03_ddd_step_08_job_protocols.md)、Step6 SafeHandoffRecord/SafeHandoffSnapshot/CurrentSafeHandoffQualification、Step7 SafeObservation/SafeTrace/Config及原mutation注入面。只原canonical/source audit/schema/consumer operation，不从当前truth重新生产材料，不造新O01来源。

问题/诊断：consumer结果、NoEffect、same-op正式幂等保证不同；ACK lost不许盲重交。采用current准入后**先原consumer只读结果**，known只local finalize，初次原Pending或正式允许same-op续交才actual claim commit后handoff；Indeterminate/Blocked恢复Pending必须actual NoEffect+原current/窗口和合法预算，先实际提交resume再下一claim，不能未提交候选连跳。consumer result-finalize只正式非递归audit规则；无规则不fallback，不生成下一条handoff。

受权R5闭口S9-GAP-J04-PROBE-QUALIFICATION：SafeObservationPort.qualify_consumer_probe从原record、trusted job及正式readonly source取得完整RecoveryQualificationRef，fresh不需伪RecoveryRecord，不cast CurrentSafeHandoffQualification或retention。read_original_result始终先行；只有actual原恢复记录的同op/no-newer-effect NoEffect及当前provider合同可核才resume。Rejected/Pending/Indeterminate/NotFound不强转NoEffect；缺正式来源继续NotEstablished/Manual，不重交。

| DTO / 构造全集 | actual来源 / 不足出口 |
|---|---|
| input三字段 | host job、body原SafeHandoffRef、selection原continuity；same原consumer op/subject/trace/scope，不复制producer业务op作consumer op |
| 完整读取 | Config.qualify_maintenance_read -> Maintenance session；SafeTrace.get_handoff -> get_audit/read_handoff_snapshot含原audit/可选handoff/original/read_basis、完整material/schema/admission/retention/claim/result。audit无handoff不能创建新Pending |
| key/meaning | BridgeMaintenanceSubject::Handoff按原ref/op/scope recipe qualify_job_key；SafeHandoffMeaning::from_parts(actual audit,canonical,admission) -> BodyFreeOperationMeaningRef::Handoff，schema/material/op保持exact；G0原result/dedup先读取，变义有限Conflict |
| current八字段 | observation.qualify_handoff(actual record,job)得到handoff/original/audit/material/schema/admission/retention/validity；assert_original(op,now)，shape不是准入。正式Observability03§7.4九行没有Bridges、SourceAudit四family不含本项目，BR-UP-006使runtime positive blocked |
| readonly资格 | qualify_consumer_probe实际Qualified的same original/source/window/budget；read_original_result最后current核验，不要求新RecoveryRecord。result四字段只actual正式readonly返回，不由caller/ACK生成 |
| resume四参 | SafeHandoffRecord::resume_pending(current,actual NoEffectBasisRef,actual local,now)；Indeterminate/Blocked -> Pending，原canonical/consumer op不换，same op no newer IO+current窗口/预算正式成立。先actual local提交，缺NoEffect零resume |
| claim/begin四参 | SafeTrace.reserve_handoff_claim(handoff,current,actual local,tx,control)返回reservation；SafeHandoffRecord::begin_handoff(current,claim,actual local,now)只actual Pending -> Dispatching；same UoW actual提交才handoff，reservation不能证明已commit |
| handoff五参 | actual committed原record、最后current、actual原claim/fence、actual matching CommittedLocalMutationRef、control；不接新material body/新operation。当前准入/provider无同op资格拒绝IO，不能交空canonical |
| finalize二参 | apply_consumer_result(actual ConsumerDispositionRef,actual local)；known Accepted/Rejected合法原stage，Pending只Dispatching同态，Indeterminate子kind走mark_unknown(reason,actual local)。原Indeterminate无Pending回边不复活 |
| safe输出六参 | SafeJobResultSummary(actual disposition,当前可见Handoff subjects,获准maintenance subjects,许可counts或None,独立stages,finite reason) -> SafeHandoffJobResult::from_summary；consumer Accepted不等evidence/report/verdict/signoff |

### 4.2 函数级调用图：RetrySafeHandoffJob

```text
[Jobs original Handoff -> J04.execute]
  | query actual handoff/audit/canonical/schema/claim/result + key/dedup
  | call qualify_handoff; no Bridges admission -> blocked, zero IO
  | query actual original RecoveryQualificationRef or block missing qualification
  | call read_original_result, no tx
  +--> known consumer outcome -> tx result-only finalize; zero handoff again
  +--> pending/unknown without qualified same-op/no-effect -> preserve/manual
  +--> actual NoEffect + current original record:
        tx R: call resume_pending when required; actual commit
        tx A: reserve_handoff_claim + begin_handoff; save original full set; commit
        call final qualify_handoff + same-op/fence/window guard
        call SafeObservationPort.handoff, no tx
        tx B: apply_consumer_result/mark_unknown; save original result only
  | append nonrecursive safe audit; reuse immutable seed; seal/actual commit
  v
[current filtered SafeHandoffJobResult, original consumer identity retained]
```

原Pending初次交接也必须先满足readonly资格/正式source合同；Pending标签不是consumer从未接纳证明。已Dispatching的续交只有正式原op幂等provider合同及actual原claim/current/预算允许才可，不再次begin_handoff；不能把provider“应该幂等”作为保证。缺正式保证及NoEffect时保持原unknown。

关键说明：

- 原consumer结果先以qualify_consumer_probe取得正式readonly资格；known只finalize，未知不盲交，正式source/window不足先blocked。
- 必要resume、claim、result分别actual提交，canonical/op不换；没有非递归audit规则不生成新handoff。

### 4.3 关键伪代码

```rust
// [SafeTraceRepository.get_handoff(SafeHandoffRef handoff, BridgeLocalReadSession read, BridgeCallControl control)]
let handoff_row = trace_repo.get_handoff(&input_handoff, &session, control).await;
// [SafeTraceRepository.read_handoff_snapshot(SafeAuditRef audit, BridgeLocalReadSession read, BridgeCallControl control)]
let complete = trace_repo.read_handoff_snapshot(&actual_audit_ref, &session, control).await;
// G0 original key/meaning/dedup/result; no missing record creates canonical or another operation.
// [SafeObservationPort.qualify_handoff(SafeHandoffRecord record, TrustedJobContext job, BridgeCallControl control)]
let current_q = observation.qualify_handoff(&actual_record, &job, control).await;
// [CurrentSafeHandoffQualification.assert_original(OriginalHandoffOperationRef original, SafeInstant now)]
let current_guard = actual_current.assert_original(&consumer_original, now);
// [ContinuityRepository.find_recovery(OriginalRecoverableSubjectRef subject, OriginalOperationEffectRef original, BridgeLocalReadSession read, BridgeCallControl control)]
let recovery_row = mutation.continuity.find_recovery(&handoff_subject, &original, &session, control).await;
// [SafeObservationPort.qualify_consumer_probe(SafeHandoffRecord record, TrustedJobContext job, BridgeCallControl control)]
let readonly_q = observation.qualify_consumer_probe(&actual_record, &job, control).await;
// Established same original/source/window/budget only; no cast from CurrentSafeHandoffQualification, no new RecoveryRecord.
// [SafeObservationPort.read_original_result(OriginalHandoffOperationRef original, RecoveryQualificationRef qualification, BridgeCallControl control)]
let previous = observation.read_original_result(&consumer_original, &actual_readonly_qualification, control).await;
// [SafeObservationPort.qualify_nonrecursive(SafeHandoffRecord record, BodyFreeMutationMaterial material, ActorRef actor, BridgeCallControl control)]
let result_rule_q = /* R preflight only, actual proposed resume material */ observation.qualify_nonrecursive(&actual_record, &actual_resume_material, &job_actor, control).await;
// Qualified formal rule only -> NonRecursiveResultOnly; every actual R/A/B mutation must be rule-covered, local audit mandatory, handoff=None.
// Known accepted/rejected -> result-only finalize below; other outcomes do not prove NoEffect.
// [SafeHandoffRecord.resume_pending(CurrentSafeHandoffQualification current, NoEffectBasisRef no_effect, ExpectedLocalRevision local, SafeInstant now)]
let resumed = /* verified actual NoEffect exclusive branch only */ record_r.resume_pending(current_r, actual_no_effect, actual_expected_r, now_r);
// R G0 local stage/audit/original seed/nonrecursive rule -> actual commit then read actual Pending; zero consumer IO yet.
// [SafeObservationPort.qualify_nonrecursive(SafeHandoffRecord record, BodyFreeMutationMaterial material, ActorRef actor, BridgeCallControl control)]
let rule_a_q = /* outside tx A, actual original Pending row */ observation.qualify_nonrecursive(&actual_pending_record, &actual_claim_phase_material, &job_actor, control).await;
// Qualified A rule/current only; R rule does not automatically cover changed phase/subjects/window.
// [LocalUnitOfWorkPort.begin(LocalMutationRef mutation, OriginalOperationEffectRef original, ExpectedLocalRevisionSet expected, MutationObservationRequirement observation, BridgeLocalReadContext read, BridgeCallControl control)]
let begin_a = uow.begin(&mutation_a, &original, &expected_a, &observation_a, &read, control).await;
// Ok handle only; failures retain original/phase. Any tx failure -> exclusive rollback, no handoff.
// [SafeTraceRepository.reserve_handoff_claim(SafeHandoffRef handoff, CurrentSafeHandoffQualification current, ExpectedLocalRevision expected, BridgeLocalTransaction tx, BridgeCallControl control)]
let reserved = trace_repo.reserve_handoff_claim(&input_handoff, &current_a, actual_expected_a, &mut tx_a, control).await;
// [SafeHandoffRecord.begin_handoff(CurrentSafeHandoffQualification current, SafeHandoffClaimRef claim, ExpectedLocalRevision local, SafeInstant now)]
let dispatching = /* reservation successful */ record_a.begin_handoff(current_a, claim_a, actual_expected_a, now_a);
// [SafeTraceRepository.stage_handoff(SafeHandoffRecord candidate, LocalRevisionCondition expected, BridgeLocalTransaction tx, BridgeCallControl control)]
let staged = trace_repo.stage_handoff(&record_a, actual_condition_a, &mut tx_a, control).await;
// A G0 original dedup/seed + safe audit/nonrecursive rule -> validate/seal -> actual matching commit.
// [SafeObservationPort.qualify_handoff(SafeHandoffRecord record, TrustedJobContext job, BridgeCallControl control)]
let final_q = observation.qualify_handoff(&actual_dispatching_record, &job, control).await;
// Only established final current, actual committed original claim/fence/window/budget and source guarantee permit IO.
// [SafeObservationPort.handoff(SafeHandoffRecord record, CurrentSafeHandoffQualification current, SafeHandoffClaimRef claim, CommittedLocalMutationRef committed, BridgeCallControl control)]
let consumer_result = observation.handoff(&actual_dispatching_record, &final_current, &actual_claim, &actual_committed_a, control).await;
// No tx held; raw error/ACK/cancel -> original unknown, no new canonical/op or blind second call.
// [SafeObservationPort.qualify_nonrecursive(SafeHandoffRecord record, BodyFreeMutationMaterial material, ActorRef actor, BridgeCallControl control)]
let rule_b_q = /* outside tx B; known readonly result also enters here without R/A */ observation.qualify_nonrecursive(&actual_dispatching_record, &actual_result_phase_material, &job_actor, control).await;
// Missing B rule retains actual result/claim/original at host; zero B tx/new producer, no ordinary early error.
// [SafeHandoffRecord.apply_consumer_result(ConsumerDispositionRef result, ExpectedLocalRevision local)]
let finalized = /* actual known/Pending legal state only */ record_b.apply_consumer_result(actual_disposition, actual_expected_b);
// [SafeHandoffRecord.mark_unknown(SafeReasonCode reason, ExpectedLocalRevision local)]
let unknown = /* exclusive Indeterminate/Err/cancel only */ record_b.mark_unknown(reason, actual_expected_b);
// B begins on complete actual baseline; stage_handoff + actual dedup/immutable seed/audit; handoff=None by formal nonrecursive rule.
// [LocalUnitOfWorkPort.commit(BridgeLocalTransaction tx, BridgeCallControl control)]
let committed_b = /* complete validated/sealed set */ uow.commit(tx_b, control).await;
// [LocalUnitOfWorkPort.rollback(BridgeLocalTransaction tx, BridgeCallControl control)]
let rollback = /* failed phase handle only */ uow.rollback(tx, control).await;
// [SafeHandoffJobResult.from_summary(SafeJobResultSummary summary)]
let result = SafeHandoffJobResult::from_summary(actual_current_filtered_summary);
```

当前准入缺口在任何claim/consumer IO之前停止；以上展示已有port可支持的条件阶段，不证明Bridges canonical/admission或fresh readonly资格已建立。原业务audit的O01附着与J04操作本身的安全audit不能混：R/A/B若正式requirement要求再生成handoff会递归，必须先Blocked并保原责任，不能自行默认OwnerPermitsAuditOnly。

### 4.4 事务边界

| 阶段 | all-or-none内容 / IO边界 |
|---|---|
| read/current/readonly | actual原producer/audit/canonical/consumer op/schema/窗口，readonly资格来源必须完整；zero producer/canonical生成，zero effect，network无tx |
| R（需要时） | actual NoEffect+current原record -> Pending的合法local mutation；actual提交后才下一claim，unknown不能重apply/claim |
| A | actual Pending baseline的claim reservation+Dispatching+原dedup/immutable seed/audit与正式非递归规则；实际commit才能外呼，CAS loser零consumer IO |
| handoff | 原record/current/claim/actual commit proof五参，最后准入/retention/fence核验，no tx；与直接mutation交接共用该唯一claim，不各自发一次 |
| B / known-only | actual原op consumer结果与mutable Slot+dedup真实result关联+immutable seed复用+唯一安全audit；result-only零new producer/O01，known-only路径不发handoff |
| failure/reentry | local rollback不撤销consumer效果；Err/cancel/Indeterminate保原operation/claim/local mutation。consumer终态只current复用，no terminal back edge |

### 4.5 错误映射

producer准入/schema/canonical/current未立：Blocked/NotEstablished零claim/IO；qualify_consumer_probe未Qualified不能cast retention/job权限。wrong op/material/source/version：InvalidInput/Conflict，zero replacement。readonly Pending/Indeterminate、NotFound/ACK lost或窗口超时：原unknown/manual，zero NoEffect。claim/commit未知：Indeterminate {original,phase}并保原mutation；formal非递归audit规则缺失：对应R/A/B blocked且host保实际结果，资格逐阶段核材料/全部subjects/当前窗口。known consumer后local error不能ordinary early Err抹原identity；output不可见不输出hidden refs/count，不造report。

### 4.6 状态与事件副作用

原SafeHandoff Pending -> Dispatching -> ConsumerAccepted/ConsumerRejected只真实结果；Pending子结果仅Dispatching同态。Dispatching -> Indeterminate只未知；Indeterminate/Blocked -> Pending只actual NoEffect+原current合法恢复，并先actual提交。Claim/schema/op/producer revision不被新材料替换。当前Bridges正式SourceAudit producer不受准入：O01/J04/E04 positive保持BR-UP-006 blocked，不能冒用Governance/Artifact/Runtime/Sandbox family。R/A/B安全audit不是消费者evidence，无递归new handoff/outbox、TraceRecord、run/report/verdict/signoff/readiness。

### 4.7 测试切口与停审

沿Step4 planned `crates/application/tests/authorization_flow_tests.rs`、`crates/application/tests/continuity_flow_tests.rs`、`crates/infra/tests/local_commit_boundary_tests.rs`、`crates/jobs/tests/job_invocation_tests.rs`：无Bridges admission零claim/handoff；wrong canonical/source/schema/op/retention；CurrentHandoff不能作RecoveryQualification；fresh无readonly资格不跳过；ConsumerRejected/ACK lost不是NoEffect；已Dispatching无same-op正式保证不续交；resume actual提交前不可claim；concurrent直接交接与J04共享claim只一次；A unknown零IO、known-only zero resend；B失败保actual consumer结果；R/A/B audit-only必须正式且零递归O01；隐藏ref/count与no fake evidence。未执行。

| 停审项 | 结论 / 缺口 |
|---|---|
| DTO/port/factory | 全三字段input、完整原snapshot/current、readonly资格来源、claim/handoff/finalize参数已独立闭口；缺fresh资格不临时造方法 |
| 事务/错误/状态 | R/A/B actual baseline、同claim/consumer op、最后current和known-only零IO；immutable结果不覆盖、终态不复活 |
| 正式准入/递归 | BR-UP-006仍blocked；每阶段无正式非递归audit规则也blocked，zero fake canonical/admission/新O01 |
| 测试/结果 | planned切口齐，原安全bounded结果，consumer成功不冒运行evidence或ready |

J04人工设计停审`pass_fail_closed_design`；不是producer准入或交接ready。下一只读J05十snapshot/eight subject allowlist、expected key及原对象合法维护方法，无需提交。

## 5. J05 RefreshBridgeQualificationJob

### 5.1 入口与目标

`select_qualification_candidates`从LocalUnitOfWorkPort::list_eligible_qualification_subjects读取actual行 -> 原Qualification {subject,expected} plan -> `RefreshBridgeQualificationJobRequest::into_parts` -> `RefreshQualificationJobInput::from_parts(job,subject,expected,continuity)` -> `RefreshBridgeQualificationJob::execute(input,control)`。Application/U1/U3/U4/U5/U6；[Step8 J05](03_ddd_step_08_job_protocols.md)、Step6十一Domain模型/QualificationInvalidationPlan（受权增加Dedup保留维护）、Step7 BridgeQualificationSnapshot/BridgeQualificationMaintenancePorts及八repository。不是定时授权续期、所有对象refresh或source truth repair。

问题/诊断：subject ID不含版本；若重复时先按新row重推key，会生成第二维护含义并掩盖原调用结果。采用input原subject+expected+trusted job scope/basis重推key/meaning，**先原dedup/result，再actual expected/CAS**；完整现有行与关联当前正式资格才合法维护，不采用timer/trace滚动key或用通用view enum扩大allowlist。无变化只current复用/有限结果，zero mutation/audit；mandatory缺口先阻，不为返回“成功”制造写入。

| DTO / 构造全集 | 唯一来源 / 缺失出口 |
|---|---|
| input四字段 | actual job、body subject+expected原值、selection原continuity；job.basis exact QualificationMaintenanceBasisRef、actor/scope/trace正式；只有同expected确无原op时Application能分配fresh未执行local op，无external effect/run |
| maintenance/key/meaning | BridgeMaintenanceSubject::Qualification {subject,expected} -> qualify_job_key；QualificationOperationMeaning::from_parts(subject,input expected,job.basis) -> BodyFreeOperationMeaningRef::Qualification -> qualify_meaning，stable basis身份/version但不是checked_at/TTL。known winner operation优先；current新row不替input expected |
| 完整读取 | Config.qualify_maintenance_read -> Maintenance session；UoW.read_qualification_subject(actual subject)仅十一variant完整BridgeVersioned对象/hydration/local revision；对应八repo完整关联read/list及full page proof。required集合超budget/缺页不做部分失效再声称全量完成 |
| expected | subject当步input expected核actual original行local revision；关联完整CAS集另取actual各行，config/generation/cursor/lane轴独立。first insert不适用，本J不能Absent建主语 |
| 原current资格 | 下表各具名port，来源必须actual caller受权候选+owner/provider当前核验；Blocked/Stale(reason,checked_at)不是RevocationBasisRef/MappingInvalidationBasisRef，不从reason/time mint新authority |
| binding传播六参 | Config.qualify_binding_invalidation(binding,job.basis,job)返回Qualified的QualificationInvalidationPlan(binding,previous,current,basis,affected,expected)；actual受权generation来源、bounded全部关联/expected、assert_generation齐。不能自造previous/current或用更高generation顺便改旧effect/source/target |
| 纯候选与local提交 | 每variant只下表已有Domain member；具名typed stage + 原dedup/真实audit/immutable seed/正式observation，G0 plan/seal完整相等后actual commit。generation即时current拒绝旧IO不依赖Job完成；background失效不足仍fail closed |
| safe输出六参 | SafeJobResultSummary(actual disposition,**subjects为空**,当前可见维护主语,授权counts或None,独立stages,finite reason) -> QualificationJobResult::from_summary；不捏造Recoverable subject、run/report或“全平台qualified” |

受权expiry repair后九body主语族=Installation、Binding、Mapping（三kind）、Presentation、Action、Cursor、Lane、Handoff、Dedup，对应十一snapshot。Operation/Inbound/Intent/Attempt/Receipt/Callback/Gap/Recovery/Audit全部admission拒绝；关联读取既有Intent/Inbound/Callback是required guard，不因此把它们开放为J05 body或授新恢复入口。

| exact snapshot / body族 | current读取/资格调用 | 原Domain合法维护 / typed stage | 边界 |
|---|---|---|---|
| Installation / Installation | Installation.get/read_snapshot；Config.qualify_installation(actual required SecretUsePurpose，按原mode/seams核全体) | BridgeInstallation.record_qualification(qualified,actual config expected,actual local,now)只Configured/Blocked -> Qualified；或block(actual maintenance basis,reason,local)；Installation.stage | Suspended/Retired不restart，不解析secret/激活source；new资格只正式provider非Job mint |
| Binding / Binding | Mapping.get_binding及全部原关联页；Binding.qualify_maintenance原Suspend/Expire，qualify_revocation仅有actual正式RevocationBasis候选时；Config.qualify_binding_invalidation | ExternalBinding.suspend/expire或有完整正式依据才revoke，generation与local双guard；Mapping.stage_binding及qualified affected集合 | 不调用activate/new propose；缺revocation candidate不由maintenance basis强转；Revoked/Expired不复活 |
| Identity / Mapping::Identity | get_identity/get_binding；Actor.resolve_external或qualify_actor核原责任；Binding current/qualify_mapping_invalidation或正式qualify_revocation | ExternalIdentityMapping.invalidate(actual MappingInvalidationBasisRef,local)或revoke(actual RevocationBasisRef,local)；Mapping.stage_identity | 不创建GlobalMember/默认Integration，不重写两端，Valid/Stale以外无维护回边 |
| Location / Mapping::Location | get_location/get_binding/actual parent/root/target完整；Binding current/qualify_mapping_invalidation或正式revocation | ExternalLocationMapping.invalidate/revoke实际basis+local；Mapping.stage_location | 不建外部频道/内部Conversation/Workspace，不挪旧effect target；缺parent不能猜 |
| Message / Mapping::Message | get_message，原known source/version/result/origin及current；Binding.qualify_mapping_invalidation | ExternalMessageMapping.invalidate(actual basis,local)；Mapping.stage_message | unknown不Linked，无自动delete/Tombstone；Tombstoned终态不复活，S9-GAP-TOMBSTONE仍不被maintenance绕过 |
| Presentation / Presentation | Delivery.get_plan，完整原source/target及关联；Presentation.revalidate/qualify_invalidation(plan,job.basis) | SafePresentationPlan.invalidate(actual PresentationInvalidationBasisRef,local)或block(actual basis,reason,local)；Delivery.stage_plan | Qualified/Degraded -> Stale/Blocked，旧plan无restore；敏感Gate不可重渲染为无许可降级或新增action |
| Action / Action | Callback.get_action，known source intent/message；原责任Actor revalidate，OwnerAction.qualify_action/qualify_expiry，Binding current/正式revocation候选 | ExternalActionBinding.expire(actual ActionExpiryOneUseRef,local,now)，或有actual RevocationBasisRef才revoke；Callback.stage_action | 只Active可维护终态，Claimed/Expired/Revoked不回Active；zero claim_once/owner.handoff/approval，不续one-use |
| Cursor / Cursor | Continuity.get_cursor/read_snapshot、same source/epoch/comparator/basis current；Config Maintenance scope与formal stream依据；qualify_stage_coverage | StreamCursor.lose_comparator(actual job basis,local)或block(reason,basis,local)；完整原same-epoch资格可requalify_same_epoch六参；Continuity.stage_cursor | 不advance/拼新epoch/close Gap；新typed stage覆盖未Qualified仍阻requalify，不mintcomparator |
| Lane / Lane | Lane.get/read_snapshot/read_shared_bounds、原head/active attempt/intent；Presentation current及qualify_dispatch只原完整actual bounds/预算/window齐 | DispatchLane.block(basis,reason,actual lane expected,actual local)；仅完整current且无unknown head/claim可finish_cooldown；已先实际known finalize且正式resolved_head可restore_ready；Lane.stage双CAS | 本J不probe/finalize未知头、reserve_claim或grant retry，不因clock/lease expiry释放head；欠原platform/source current只Blocked |
| Handoff / Handoff | SafeTrace.get_handoff/read_handoff_snapshot；SafeObservation.qualify_handoff；原canonical/op/schema/current准入/retention | SafeHandoffRecord.block(reason,actual basis,local)仅Pending/Dispatching；SafeTrace.stage_handoff | 不from_canonical/resume_pending/consumer IO；unknown保claim/result，终态不复活；BR-UP-006仍blocked |
| Dedup / Dedup | UoW完整Dedup snapshot，Continuity.get_dedup核原key/meaning/op/window/result；Config.qualify_dedup_expiry(record,read,job,now,control) | DedupRecord.expire(actual RetentionExpiryBasisRef,input expected,actual now)；Continuity.stage_dedup(target,Present(input expected),tx,control) | Reserved/ResultRecorded/Indeterminate -> Expired；原key/meaning/op/result/window保留，zero delete/re-execute/NoEffect/probe；Expired no-op，proof缺失zero U |

revocation/失效candidate必须有actual typed来源，具名qualify方法只是核候选。若输入/完整原row/正式provider均不给该basis，本flow只安全不执行对应positive；不造新J05参数/typed输出。Installation required purposes是原config/mode具体合同，不能只“Deliver一次Qualified”就宣全安装运行qualified。Cursor/Lane恢复Ready只保原既有资格与状态，不能授新增stage连续性、业务retry或外部效果。

### 5.2 函数级调用图：RefreshBridgeQualificationJob

```text
[Jobs original Qualification(subject, expected) -> J05.execute]
  | call Config.qualify_maintenance_read and UoW.qualify_job_key(original expected)
  | query original dedup/result, before replacing any current revision
  +--> original same expected result -> current filtered reuse, zero writes
  +--> conflict/unknown -> stop, preserve original
  +--> fresh local maintenance allowed:
        query UoW.read_qualification_subject + complete typed associated rows
        call input expected vs actual row/CAS guard
        call exact variant current owner qualification and maintenance basis
        call legal Domain member, no new grant or business IO
        tx: save typed candidates + original dedup/audit/seed/conditional rule
        call validate/seal, actual commit/rollback
  v
[QualificationJobResult: subjects empty, visible maintenance slice only]
```

关键说明：

- 输入subject/expected及原key/result先固定，再核actual原row；不能用最新revision改变旧维护含义。
- 十一snapshot/九主语族只沿既有维护边，资格在tx外、全关联stage同tx，zero新授权或业务IO。目标Dedup的原business operation不替换成Job continuity；本Job reservation是独立key/op，完整expected同时含目标Present与Job去重唯一条件，禁止目标等于自身新reservation。

### 5.3 关键伪代码

先完成以下事务外分支。`installation/relation/identity/...`分别是§5.1完整原row按原rehydrate消费面取得的纯候选，actual baseline/expected独立保留；不借mutable getter改已提交snapshot。选中分支只把自己的候选交下面的typed stage片段，其他分支不执行；两片段的数据移交不是新增helper/API或新类型。

```rust
// [LocalUnitOfWorkPort.qualify_job_key(BridgeMaintenanceSubject subject, TrustedJobContext job, BridgeCallControl control)]
let key_result = uow.qualify_job_key(&original_subject_and_expected, &job, control).await;
// [QualificationOperationMeaning.from_parts(BridgeViewSubjectRef subject, ExpectedLocalRevision expected, QualificationMaintenanceBasisRef basis)]
let raw_meaning = QualificationOperationMeaning::from_parts(input_subject, input_expected, actual_job_basis);
// G0 qualify_meaning/find_dedup/find_result_for_key/reuse now; never swap expected from a new row before lookup.
// [LocalUnitOfWorkPort.read_qualification_subject(BridgeViewSubjectRef subject, BridgeLocalReadSession read, BridgeCallControl control)]
let snapshot = uow.read_qualification_subject(&input_subject, &session, control).await;
// Compare original input expected with actual row. Wrong kind/None/required pages incomplete => no mutation.
match actual_snapshot {
    BridgeQualificationSnapshot::Installation(row) => {
        // [ConfigQualificationPort.qualify_installation(BridgeInstallation installation, SecretUsePurpose purpose, BridgeCallControl control)]
        let current = config.qualify_installation(&installation, required_purpose, control).await;
        // [BridgeInstallation.record_qualification(InstallationQualificationRef qualification, ExpectedConfigRevision expected, ExpectedLocalRevision local, SafeInstant now)]
        let change = /* all required current qualified only */ installation.record_qualification(actual_q, actual_config_expected, input_expected, now);
    }
    BridgeQualificationSnapshot::Binding(row) => {
        // [BindingQualificationPort.qualify_maintenance(ExternalBinding binding, BindingMutationKind action, ActorRef actor, QualificationMaintenanceBasisRef basis, BridgeCallControl control)]
        let basis_q = binding.qualify_maintenance(&relation, exact_action, &actor, &actual_job_basis, control).await;
        // [ExternalBinding.expire(QualificationMaintenanceBasisRef basis, ExpectedGeneration expected, ExpectedLocalRevision local, SafeInstant now)]
        let change = /* expiry exclusive branch */ relation.expire(actual_basis, generation_expected, input_expected, now);
        // [ConfigQualificationPort.qualify_binding_invalidation(ExternalBinding binding, QualificationMaintenanceBasisRef basis, TrustedJobContext job, BridgeCallControl control)]
        let plan_q = /* outside tx, full actual authorized association */ config.qualify_binding_invalidation(&relation_baseline, &actual_job_basis, &job, control).await;
        // [QualificationInvalidationPlan.assert_generation()]
        let plan_guard = actual_invalidation_plan.assert_generation();
        // 全部affected mapping/plan/action/lane也在此完成资格和纯候选，actual完整页/CAS保存后才begin。
    }
    BridgeQualificationSnapshot::Identity(row) => {
        // [ExternalIdentityMapping.invalidate(MappingInvalidationBasisRef basis, ExpectedLocalRevision local)]
        let change = identity.invalidate(actual_identity_invalidation, input_expected);
    }
    BridgeQualificationSnapshot::Location(row) => {
        // [ExternalLocationMapping.invalidate(MappingInvalidationBasisRef basis, ExpectedLocalRevision local)]
        let change = location.invalidate(actual_location_invalidation, input_expected);
    }
    BridgeQualificationSnapshot::Message(row) => {
        // [ExternalMessageMapping.invalidate(MappingInvalidationBasisRef basis, ExpectedLocalRevision local)]
        let change = message.invalidate(actual_message_invalidation, input_expected);
    }
    BridgeQualificationSnapshot::Presentation(row) => {
        // [PresentationQualificationPort.qualify_invalidation(SafePresentationPlan plan, QualificationMaintenanceBasisRef basis, BridgeCallControl control)]
        let basis_q = presentation.qualify_invalidation(&original_plan, &actual_job_basis, control).await;
        // [SafePresentationPlan.invalidate(PresentationInvalidationBasisRef basis, ExpectedLocalRevision local)]
        let change = original_plan.invalidate(actual_presentation_invalidation, input_expected);
    }
    BridgeQualificationSnapshot::Action(row) => {
        // [OwnerActionPort.qualify_expiry(ExternalActionBinding action, OwnerActionQualificationRef owner, BridgeCallControl control)]
        let expiry_q = actions.qualify_expiry(&original_action, &actual_owner_q, control).await;
        // [ExternalActionBinding.expire(ActionExpiryOneUseRef basis, ExpectedLocalRevision local, SafeInstant now)]
        let change = original_action.expire(actual_expiry, input_expected, now);
    }
    BridgeQualificationSnapshot::Cursor(row) => {
        // [StreamCursor.lose_comparator(QualificationMaintenanceBasisRef basis, ExpectedLocalRevision local)]
        let change = /* actual lost comparator only */ cursor.lose_comparator(actual_job_basis, input_expected);
        // [AuthoritativeRecoveryPort.qualify_stage_coverage(StreamCursor cursor, ContinuitySnapshot snapshot, AuthoritativeComparatorRef comparator, BridgeLocalReadContext read, TrustedJobContext job, BridgeCallControl control)]
        let coverage_q = qualifications.recovery.qualify_stage_coverage(&actual_cursor, &actual_continuity, &current_comparator, &read, &job, control).await;
        // No advance; same-epoch requalify only Qualified complete stage proof, actual cursor/local CAS, zero new source truth.
    }
    BridgeQualificationSnapshot::Lane(row) => {
        // [DispatchLane.block(QualificationMaintenanceBasisRef basis, SafeReasonCode reason, ExpectedLaneRevision expected, ExpectedLocalRevision local)]
        let change = lane.block(actual_job_basis, finite_reason, actual_lane_expected, input_expected);
        // No unknown head release/probe/claim; any optional Ready recovery only under full table guards.
    }
    BridgeQualificationSnapshot::Handoff(row) => {
        // [SafeObservationPort.qualify_handoff(SafeHandoffRecord record, TrustedJobContext job, BridgeCallControl control)]
        let current = observation.qualify_handoff(&handoff, &job, control).await;
        // [SafeObservationPort.qualify_nonrecursive(SafeHandoffRecord record, BodyFreeMutationMaterial material, ActorRef actor, BridgeCallControl control)]
        let rule_q = observation.qualify_nonrecursive(&actual_handoff, &actual_maintenance_material, &actor, control).await;
        // Qualified formal rule covers whole maintenance set -> NonRecursiveResultOnly; otherwise retain original, no tx.
        // [SafeHandoffRecord.block(SafeReasonCode reason, QualificationMaintenanceBasisRef basis, ExpectedLocalRevision local)]
        let change = /* formal lost admission and legal state only */ handoff.block(finite_reason, actual_job_basis, input_expected);
    }
    BridgeQualificationSnapshot::Dedup(row) => {
        // [ConfigQualificationPort.qualify_dedup_expiry(DedupRecord record, BridgeLocalReadContext read, TrustedJobContext job, SafeInstant now, BridgeCallControl control)]
        let expiry_q = config.qualify_dedup_expiry(&target_dedup, &read, &job, now, control).await;
        // Only Qualified(actual proof), not TTL/job.basis. Expired no-op; other outcomes zero U.
        // [DedupRecord.expire(RetentionExpiryBasisRef basis, ExpectedLocalRevision local, SafeInstant now)]
        let change = target_dedup.expire(actual_expiry_basis, input_expected, now);
        // Preserve target original key/meaning/op/result/window and unresolved effect. Job key/op is separate.
    }
}
// 以上只有外部资格和pure候选；尚无tx。缺basis或无合法变化时停止，不进入下面片段。
```

候选、所有关联expected及正式observation均齐后，唯一事务阶段如下；`actual_condition`在每个分支指该行自己的Present条件，cursor/lane另有独立版本轴，不复用body expected给关联对象。

```rust
// [LocalUnitOfWorkPort.begin(LocalMutationRef mutation, OriginalOperationEffectRef original, ExpectedLocalRevisionSet expected, MutationObservationRequirement observation, BridgeLocalReadContext read, BridgeCallControl control)]
let begun = uow.begin(&mutation, &original, &complete_expected, &formal_observation, &read, control).await;
// Ok唯一handle才继续；Err保原mutation/original/phase，零stage，非普通early error丢关联。
// 以下按上段原snapshot kind执行唯一typed stage；只有Binding传播时另stage全部qualified affected候选。
match actual_snapshot_kind {
    BridgeQualificationSnapshot::Installation(_) => {
        // [InstallationRepository.stage(BridgeInstallation candidate, LocalRevisionCondition expected, BridgeLocalTransaction tx, BridgeCallControl control)]
        let staged = installation_repo.stage(&installation, actual_condition, &mut tx, control).await;
    }
    BridgeQualificationSnapshot::Binding(_) => {
        // [MappingRepository.stage_binding(ExternalBinding candidate, LocalRevisionCondition expected, BridgeLocalTransaction tx, BridgeCallControl control)]
        let staged = mappings.stage_binding(&relation, actual_condition, &mut tx, control).await;
        // 每个qualified affected行按下列自身kind的具名stage，第一次失败立即rollback，不继续其他行。
    }
    BridgeQualificationSnapshot::Identity(_) => {
        // [MappingRepository.stage_identity(ExternalIdentityMapping candidate, LocalRevisionCondition expected, BridgeLocalTransaction tx, BridgeCallControl control)]
        let staged = mappings.stage_identity(&identity, actual_condition, &mut tx, control).await;
    }
    BridgeQualificationSnapshot::Location(_) => {
        // [MappingRepository.stage_location(ExternalLocationMapping candidate, LocalRevisionCondition expected, BridgeLocalTransaction tx, BridgeCallControl control)]
        let staged = mappings.stage_location(&location, actual_condition, &mut tx, control).await;
    }
    BridgeQualificationSnapshot::Message(_) => {
        // [MappingRepository.stage_message(ExternalMessageMapping candidate, LocalRevisionCondition expected, BridgeLocalTransaction tx, BridgeCallControl control)]
        let staged = mappings.stage_message(&message, actual_condition, &mut tx, control).await;
    }
    BridgeQualificationSnapshot::Presentation(_) => {
        // [DeliveryRepository.stage_plan(SafePresentationPlan candidate, LocalRevisionCondition expected, BridgeLocalTransaction tx, BridgeCallControl control)]
        let staged = delivery.stage_plan(&original_plan, actual_condition, &mut tx, control).await;
    }
    BridgeQualificationSnapshot::Action(_) => {
        // [CallbackRepository.stage_action(ExternalActionBinding candidate, LocalRevisionCondition expected, BridgeLocalTransaction tx, BridgeCallControl control)]
        let staged = callbacks.stage_action(&original_action, actual_condition, &mut tx, control).await;
    }
    BridgeQualificationSnapshot::Cursor(_) => {
        // [ContinuityRepository.stage_cursor(StreamCursor candidate, Option<ExpectedCursorRevision> cursor_expected, LocalRevisionCondition expected, BridgeLocalTransaction tx, BridgeCallControl control)]
        let staged = continuity.stage_cursor(&cursor, Some(&actual_cursor_expected), actual_condition, &mut tx, control).await;
    }
    BridgeQualificationSnapshot::Lane(_) => {
        // [LaneRepository.stage(DispatchLane candidate, ExpectedLaneRevision lane_expected, LocalRevisionCondition expected, BridgeLocalTransaction tx, BridgeCallControl control)]
        let staged = lanes.stage(&lane, &actual_lane_expected, actual_condition, &mut tx, control).await;
    }
    BridgeQualificationSnapshot::Handoff(_) => {
        // [SafeTraceRepository.stage_handoff(SafeHandoffRecord candidate, LocalRevisionCondition expected, BridgeLocalTransaction tx, BridgeCallControl control)]
        let staged = trace_repo.stage_handoff(&handoff, actual_condition, &mut tx, control).await;
    }
    BridgeQualificationSnapshot::Dedup(_) => {
        // [ContinuityRepository.stage_dedup(DedupRecord candidate, LocalRevisionCondition expected, BridgeLocalTransaction tx, BridgeCallControl control)]
        let staged = continuity.stage_dedup(&target_dedup, actual_condition, &mut tx, control).await;
        // The separate original Job dedup/audit/seed is staged by G0; do not overwrite target operation/result.
    }
}
// tx内只有same-driver stages；每个Result立即核验，首失败独占rollback，不执行seal/commit。
// G0 exact dedup/audit/seed/conditional set -> validate/seal后才actual commit；零foreign qualification。
// [LocalUnitOfWorkPort.commit(BridgeLocalTransaction tx, BridgeCallControl control)]
let actual = uow.commit(tx, control).await;
// [LocalUnitOfWorkPort.rollback(BridgeLocalTransaction tx, BridgeCallControl control)]
let rollback = /* first tx failure, unique handle */ uow.rollback(tx, control).await;
// [QualificationJobResult.from_summary(SafeJobResultSummary summary)]
let result = QualificationJobResult::from_summary(actual_filtered_summary_with_empty_recoverable_subjects);
```

没有合法变更（已终态、已记录同资格、已Blocked且无新basis）不stage空候选，也不为Duplicate/no-op制造audit/计数proof。关联subject用自身actual expected，不把body主语input_expected复用于不同对象；Config/generation/cursor/lane轴和uniqueness同driver再核。Stale reason、clock expiry和missing snapshot不足以生成typed维护/撤销basis；来源不齐本flow安全Blocked，无伪造mutation事实。

### 5.4 事务边界

| 阶段 | 原子集 / 上限 |
|---|---|
| original lookup | old expected/key/result优先，实际已提交winner current可见才Duplicate；不以current row new revision改变原请求 |
| qualification | subject allowlist、原current scope/basis、全部required关联页完整；网络资格在tx外，zero send/approve/probe/material/secret解析 |
| local mutation | 原body subject及qualified affected集合的全部actual CAS/独立版本轴、原dedup/audit/seed/正式observation同UoW；seal全集，page/预算不足不partial invalidate后宣全量完成 |
| Dedup expiry | 目标既有Dedup Present(input expected)+独立Job key/meaning/op reservation+实际safe audit/result seed/正式条件规则同U；原目标结果/unknown不覆写，不含业务owner/platform/consumer IO。commit未知只原Job mutation权威读取，不能再次expire/apply |
| immediate revocation | owner/provider current一旦失效所有C/E/J IO立即拒绝，不等待Job追赶；Job落盘只记已有失效历史，不延长授权或改原effect |
| original result/output | actual commit才事实，unknown保原mutation/op不重复apply；current refs/stages/count许可过滤，subjects空，count未知None |

### 5.5 错误映射

unsupported body族/metadata/expected形状：InvalidInput零读写effect；受权原行不存在有限NotFound，不新建grant。same expected原result：current可见Duplicate，否则不披露；same key变义Conflict。actual revision不同：Stale/Conflict，zero overwrite，禁止new key重做。basis/资格/关联页/codec/source/产品不足：Blocked/Unavailable/NotEstablished，Stale reason不伪basis。terminal illegal back edge：拒绝或原安全no-op，zero resurrection。commit/rollback异常、已原operation的cancel：original/mutation/phase retained，zero generic retry/run。safe summary不可见：隐藏ref/count，不输出旧grant或“刷新成功”授新权。

### 5.6 状态与事件副作用

只上表Step6允许边：Installation Configured/Blocked -> Qualified或Configured/Qualified -> Blocked；Binding受权Suspended/Expired/Revoked；三Mapping只Stale/Revoked等既有维护，Message不造新Linked/Tombstoned；Presentation Qualified/Degraded -> Stale/Blocked；Action Active -> Expired/Revoked，无claim；Cursor保旧position的Incomparable/Blocked及有完整原资格same-epoch Ready，零advance；Lane current不足Blocked、无unknown head时有全资格才Ready；Handoff Pending/Dispatching -> Blocked并保原claim/result。关联QualifiedInvalidationPlan必须actual两代际且expected全等，不改owner/platform既有结果。

每个actual变化唯一safe audit/原result及正式条件O01；Handoff维护没有正式非递归规则也blocked，不递归new producer。zero通用outbox/stale projection/cache、new identity/workspace/member、raw材料/secret/sensitive approval日志、run/report/evidence/readiness。资格再成立不是Turn/Gate/Artifact/platform truth生成。

### 5.7 测试切口与停审

沿Step4 planned `authorization_flow_tests.rs`、`continuity_flow_tests.rs`、`local_guards_tests.rs`、`local_commit_boundary_tests.rs`、`private_material_boundary_tests.rs`、`job_invocation_tests.rs`：十一snapshot/九body族一一映射，九禁止族IO前拒绝；input expected/key/meaning保持，重复old expected先原结果；并发winner原op优先；全部关联分页/row budget不足zero全量宣称；wrong namespace/generation/config/CursorRevision/LaneRevision；formal维护basis不足不由Stale reason伪造；终态不复活；unknown lane head不清；Action维护无one-use claim/owner action；Installation不激活source/续secret；Handoff audit非递归；safe current裁剪/subjects空/count None、零raw/run。均planned未执行。

| 停审项 | 设计结论 / 缺口 |
|---|---|
| DTO/schema/calls | input四字段、原expected/basis/continuity闭合，十一variant穷尽、八repo具名读写和Domain维护方法回指；无refresh新API |
| 受权expiry重审承接 | 当前十一variant/九body族，同原Request/input/selector/execute；Dedup来源port/expire/stage及独立Job dedup全CAS，planned D/C/L/J/S/R/P覆盖三边、not-due、无authority、目标自身、unknown保留及commit未知 |
| tx/state/reentry | old expected原result优先、whole required CAS/页完整、终态不复活、不清unknown/改effect、网络不持tx |
| positive资格不足 | formal basis/revocation/source及新stage coverage/全rate current不足分别Blocked，不由typed shape伪current或扩注入面；BR-UP保持 |
| 副作用/结果/测试 | 条件实际audit/result/O01，Handoff非递归；subjects空/maintenance-only current结果，planned切口齐，无实现或运行ready |

J05人工设计停审`pass_fail_closed_design`。五J均已各自完成来源/问题/诊断/取舍/独立草稿与停审；下一只X逐flow/跨flow、精确名与调用反查、后置历史差异及真实格式/范围检查，无需提交。

## 6. J批次汇总

| flow / 原协议 | 所属模块 / 目标对象 | 原注入读写/IO面 | actual事务/状态 / 副作用 | 停审 |
|---|---|---|---|---|
| J01 DispatchQueuedDeliveryJob | U3/U5；Intent/Attempt/Receipt/Lane/qualified MessageMapping | 原Step7 J01注入全集；单次Platform.dispatch | A claim/B InFlight/C结果、NoIo合法D；原effect/unknown head/all rate；actual safe audit/result/条件O01 | pass_design；actual lane/current/产品不足仍blocked |
| J02 ReconcileBridgeOperationJob | U5及四原subject；Recovery+结果/必要lane/mapping | 受权修订后J02完整注入；AuthoritativeRecovery readonly | A Probing/B full known或manual；local独立、五源retry preflight、consumer非递归 | 受权R4/R5 pass_design；外部current/source/rule不足仍blocked |
| J03 ReconcileStreamGapJob | U5；Gap/Cursor/原Recovery | 原Step7 J03注入全集；probe_gap/compare_position readonly | A两原对象Probing/B full close或retain/manual，cursor仅完整stage coverage；safe audit/result/condition | pass_fail_closed_design，首次recovery link/new stage coverage blocked |
| J04 RetrySafeHandoffJob | U6；原Handoff/canonical/consumer op | Config/Observation/SafeTrace/MutationPorts | readonly先行、需要时R resume/A claim/B result；同op、zero递归producer/O01 | pass_fail_closed_design，BR-UP-006/fresh readonly资格blocked |
| J05 RefreshBridgeQualificationJob | U1/U3/U4/U5/U6；十一snapshot/九subject族 | 原QualificationMaintenancePorts+MutationPorts/八repo；新增原Config port的expiry核验方法 | 原expected/key/result优先，whole typed维护CAS，目标Dedup保tombstone/unknown，zero新grant/业务IO/unknown head清除 | pass_fail_closed_design，typed basis/source不齐blocked |

共五独立flow、原五input/五execute/五selector/五bin；所有summary六原字段、六JobResultDisposition、完整原continuity与current裁剪，不新增job truth/run/report。此表不称positive路径全部可执行，最后资格以X缺口登记和用户审查为准。
