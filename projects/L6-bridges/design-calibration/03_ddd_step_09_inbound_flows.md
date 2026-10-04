# L6-bridges 03 Step9：Inbound独立处理流

四E由既有registered host调用原consume，不新增safe-message直调入口；safe envelope只是验证后规范化材料。private raw/reply/secret only call-owned短借，无durable inbox/dead-letter/body hash。所有local阶段执行[G0](03_ddd_step_09_shared_flow_contracts.md)的具名stage/immutable seed/actual commit纪律；伪代码列阶段关键调用，阶段间不持tx。每个Result顺序核成功，任何tx内失败立即独占actual rollback；代码不宣编译/平台运行。

## 1. E01 PlatformInputReceivedConsumer

### 1.1 入口与目标

API PlatformDispatcher或Worker qualified source host -> `PlatformInputReceivedInput::from_parts(consumer, invocation)` -> `PlatformInputReceivedConsumer::consume(input, control)`；invocation的exact类型BridgePlatformInboundInvocation仅Private(candidate_event_key, PrivateIngressContext短借)或Continuity(原notice)。Application/U2或Protocol U5；[Step8§5/7/8](03_ddd_step_08_inbound_protocols.md)、Step6 InboundHandoffRecord/StreamCursor/Gap、Step7 ingress/owner/private/secret/current/mutation ports。

问题/诊断：平台来源/ACK不等材料或owner许可，首建local1不能把未提交候选版本当existing CAS。采用A verified接管、B actual claim、C result finalize三个local阶段；每段有独立mutation而业务original/key不换。原stored A只local proof，B/C复用原immutable payload，结果在原record Slot（G0§4）。不采用fresh候选连调成员再伪造Present baseline、raw重放或query repair。既有Verified原生命周期初次B可继续；Blocked/Indeterminate重入必须原权威NoEffect/恢复窗口/current，不能由A proof自动放行。

受权R3已闭口`S9-GAP-CONTINUITY-MEANING`：使用Step6新增ContinuityNoticeMeaning及Inbound namespace下独立continuity_notice.v1 recipe；不是消息Inbound meaning，不借mapping/source/Recovery或正文hash。qualified notice六字段明确取得comparator/range/epoch_change/window，只有actual Established与原G0全部门禁通过才cursor/gap安全mutation。缺source/codec/规则仍zero durable，host保Disconnected责任；不宣gap已生成或历史已覆盖。

同一反查还定位`S9-GAP-INBOUND-MEANING`：Private验源后仍缺mapping context或safe source/version时，SourceOperationMeaning的三个必需字段同样不能闭口。即使from_verified的Slot允许Missing，也不得据此提交Verified/Blocked/Quarantined记录；当前这些fresh拒绝分支零record/dedup/audit/stored-result，只有host有限安全处置与原ACK责任。已有actual原meaning/result且正式同义证明成立可受权复用；不能把raw identity/hash或最新mapping替成原含义。Mapping/source齐而其他material/current缺口的合法原记录维护仍须G0完整meaning和原CAS。

| DTO / 构造全集 | 唯一来源与缺失出口 |
|---|---|
| consumer/Private | actual host actor/scope/source/trace，lease活着的candidate key/raw/reply；完整installation来自registered router+InstallationRepository；source-mode排他/required config重验 |
| source八字段 | ingress.verify -> namespace/source/account/message/change/origin/material_source/ack；未验真零record/dedup；verified origin+原effect/source匹配防回环，非bot_id猜测 |
| mapping/责任/mode/material | find_bindings_for_external完整有界候选，唯一受权relation；get/find identity/location/message及read_authorized_snapshot；Binding current/Actor resolve_external；resolve_target_mode/qualify_material正式owner返回；缺parent/edit/delete原mapping隔离或Blocked |
| from_verified十二参 | 仅完整qualified Inbound meaning实际可构造时：UoW record/op、verified source/origin/safe source Slot、actual mapping/mode/actor/material/digest Slots或Missing、actual ACK或NotSent、owner result Missing；Verified/local1。需block/quarantine在actual原行下一local阶段；缺mapping/source则受S9-GAP-INBOUND-MEANING阻fresh durable，不造新行revision |
| claim与begin_handoff七参 | B uow.reserve_handoff_claim返回same subject/op/window的reservation；actual baseline local CAS + current binding/material + 首次resume/recovery None或合法same-op证明 + actual now；B actual commit后才owner IO |
| 私有material/secret | source-mode正式required SecretUsePurpose、qualify_secret_use -> resolve owning lease/last revalidate -> borrow_secret；owner current material -> read_material owning lease -> last revalidate_material -> borrow_handle；ref/key/version/purpose精确，不能读最新fallback |
| finalize / mapping | actual same-op OwnerHandoffResultRef -> apply_owner_result/mark_unknown；known且current允许才qualify_message_mapping并link_known。E01当前不从owner Accepted或平台Delete构造OwnerChangeDispositionRef，零隐式Tombstone；原mapping的删除处置走C03显式candidate+qualify_tombstone，不伪回链。ACK独立record_protocol_disposition |
| Continuity七字段 | event_key+stream/previous/next/range/reason/basis，qualify_continuity_notice输出notice+实际Ingress purpose read；仅Protocol、same source/installation/window，不授owner/消息权 |
| cursor initialize八参 | 技术cursor ID、已核stream/previous、Uninitialized、actual comparator或Missing、coverage Missing、CursorRevision1、uow now；Absent/None cursor expected/local1，不造可比position |
| gap detect八参 | gap ID、actual cursor ref、原tracking operation、QualifiedGapRangeRef(stream,epoch,bounds,formal exact basis)、notice reason、coverage Missing、原recovery或Missing、formal recovery window或Missing；Open/local1，Unknown界保Unknown |
| existing cursor变化 | 只有next Established+formal epoch change可构造StreamEpochChangeRef后mark_incomparable；Missing/Stale next不造change；缺维护依据不调用lose_comparator/block，不替原position/epoch |

### 1.2 函数级调用图：PlatformInputReceivedConsumer

```text
[Qualified API/Worker source host -> E01.consume]
  +--> Private
  |     call PlatformIngressPort.verify (raw and required secret short borrow)
  |     call ACK executor only as formal source deadline permits
  |     query original key/record; call mapping/actor/owner material qualification
  |     missing mapping/source meaning -> Blocked, zero durable mutation
  |     tx A only full meaning: save verified + original set; commit
  |     tx B: reserve_handoff_claim; call begin_handoff; save original set; commit
  |     call final current/material/secret checks; call ConversationHandoffPort.handoff
  |     tx C: call apply_owner_result/mark_unknown; save result/known mapping; commit
  |     return distinct Protocol/Local/Owner stages
  +--> Continuity
        call qualify_continuity_notice for exact registered Protocol source
        call typed notice meaning/key/current/source/recipe guards
        required missing -> Blocked, zero durable; host retains responsibility
        qualified -> tx cursor/gap legal candidates + original dedup/audit/result
        actual commit/rollback; zero owner/ACK/advance
```

关键说明：

- Private必须验源和构造完整typed meaning后才能A接管，B实际claim提交才owner IO，ACK独立。
- notice只在独立Protocol全部门禁成立时可局部持久化；fresh Private缺meaning只保host责任，均不授重放或coverage。

### 1.3 关键伪代码

```rust
match invocation {
    BridgePlatformInboundInvocation::Private { .. } => {
        // [PlatformIngressPort.verify(PrivateIngressContext input, BridgeInstallation installation, Option<PrivateSecretHandle> secret, BridgeCallControl control)]
        let verified = ingress.verify(&private_input, &installation, secret_borrow, control).await?;
        // Rejected/Unavailable只有限失败和正式ACK；不能造Verified record。验源成功后才G0 key/result查询。
        // [BridgeProtocolAckExecutor.execute(PrivateReplyContext reply, ProtocolAckPlan plan, BridgeCallControl control)]
        let ack_execution = /* deadline/order rule below only */ ack.execute(&reply, &ack_plan, control).await;
        // [ConversationHandoffPort.resolve_target_mode(AuthorizedMappingContextRef mapping, ActorRef actor, BridgeCallControl control)]
        let mode_q = owner.resolve_target_mode(&mapping_context, &responsible_actor, control).await?;
        // [ConversationHandoffPort.qualify_material(QualifiedIngressContext ingress, AuthorizedMappingContextRef mapping, ActorRef actor, BridgeTargetMode mode, PrivateIngressContext input, BridgeCallControl control)]
        let material_q = owner.qualify_material(&safe_ingress, &mapping_context, &responsible_actor, &mode, &private_input, control).await?;
        // [InboundHandoffRecord.from_verified(InboundRecordRef record_ref, VerifiedPlatformSourceRef verified_source, VerifiedOriginMarkerRef origin_marker, SafeSourceRefSlot source_ref, BridgeOperationRef operation_ref, AuthorizedMappingContextRefSlot mapping_context, BridgeTargetModeSlot target_mode, ActorRefSlot actor_ref, QualifiedMaterialRefSlot material_ref, OwnerRequiredDigestRefSlot required_digest_ref, ProtocolAckDisposition protocol_disposition, OwnerHandoffResultRefSlot owner_result)]
        let verified_record = /* complete qualified Inbound meaning only; otherwise finite blocked before IDs/tx */ InboundHandoffRecord::from_verified(record_ref, source, origin, source_slot, operation_ref, mapping_slot, mode_slot, actor_slot, material_slot, digest_slot, actual_ack, OwnerHandoffResultRefSlot::Missing)?;
        // A: G0 begin -> InboundRepository.stage(Absent)+dedup/audit/seed/condition -> seal -> actual commit.
        // A未知不能进入B；B的read/CAS来源为actual A row，不以candidate.local_revision伪existing。
        // [LocalUnitOfWorkPort.begin(LocalMutationRef mutation, OriginalOperationEffectRef original, ExpectedLocalRevisionSet expected, MutationObservationRequirement observation, BridgeLocalReadContext read, BridgeCallControl control)]
        let begun_b = uow.begin(&mutation_b, &original, &expected_b, &observation_b, &read, control).await;
        let mut tx = match begun_b {
            Ok(tx) => tx,
            Err(_) => {
                // A已actual接管；宿主保原mutation_b、original和A原结果，不新begin或外呼。
                return Err(BridgePortError::Indeterminate { original, phase: BridgeCallPhase::LocalStage });
            }
        };
        // [LocalUnitOfWorkPort.reserve_handoff_claim(OriginalRecoverableSubjectRef subject, OriginalOperationEffectRef original, SafeValidityWindow validity, ExpectedLocalRevisionSet expected, BridgeLocalTransaction tx, BridgeCallControl control)]
        let reserved = uow.reserve_handoff_claim(&subject, &original, &validity, &expected_b, &mut tx, control).await;
        // [InboundHandoffRecord.begin_handoff(HandoffClaimRef claim, CurrentBindingQualification current, CurrentMaterialQualification material, Option<NoEffectBasisRef> resume, Option<RecoveryQualificationRef> recovery, ExpectedLocalRevision local, SafeInstant now)]
        let candidate_b = /* reservation success only */ record.begin_handoff(actual_reservation, current_binding, current_material, resume, recovery_q, actual_local_cas, now);
        // [InboundRepository.stage(InboundHandoffRecord candidate, LocalRevisionCondition expected, BridgeLocalTransaction tx, BridgeCallControl control)]
        let stage = records.stage(&record, local_expected_b, &mut tx, control).await;
        // G0 immutable A seed reuse + audit/condition, validate/seal; failure -> exclusive rollback.
        // [LocalUnitOfWorkPort.commit(BridgeLocalTransaction tx, BridgeCallControl control)]
        let committed_b = /* full successful set */ uow.commit(tx, control).await;
        // Only matching actual Committed B permits IO; tx no longer held.
        // [ConversationHandoffPort.revalidate_material(CurrentMaterialQualification current, AuthorizedMappingContextRef mapping, ActorRef actor, BridgeTargetMode mode, BridgeCallControl control)]
        let final_material_q = owner.revalidate_material(&current_material, &mapping_context, &responsible_actor, &mode, control).await;
        // [PrivateMaterialPort.read_material(CurrentMaterialQualification current, SafeScopeRef scope, BridgeCallControl control)]
        let lease = /* current established */ material.read_material(&current_material, &scope, control).await;
        // After lease acquisition revalidate again, then short borrow; post-commit errors retain original/B phase.
        // [BridgeMaterialLease.borrow_handle(CurrentMaterialQualification current, SafeInstant now)]
        let handle = actual_lease.borrow_handle(final_current_material, now);
        // [ConversationHandoffPort.handoff(InboundHandoffRecord record, OriginalOperationEffectRef original, HandoffClaimRef claim, CurrentBindingQualification binding, TransientQualifiedMaterialHandle material, BridgeCallControl control)]
        let owner_result = owner.handoff(&actual_record_b, &original, &actual_claim_b, &final_binding, &handle, control).await;
        // [InboundHandoffRecord.apply_owner_result(OwnerHandoffResultRef result, ExpectedLocalRevision local)]
        let finalized = /* known/Pending actual branch */ record_c.apply_owner_result(actual_owner_result, actual_local_cas_c);
        // [InboundHandoffRecord.mark_unknown(SafeReasonCode reason, ExpectedLocalRevision local)]
        let unknown = /* unknown/Err/cancel exclusive branch */ record_c.mark_unknown(reason, actual_local_cas_c);
        // C: G0 typed stage + actual result Slot/dedup attach only actual stored + immutable seed reuse + audit/condition; actual commit.
    }
    BridgePlatformInboundInvocation::Continuity(notice) => {
        // [PlatformIngressPort.qualify_continuity_notice(BridgeSourceContinuityNotice notice, BridgeInstallation installation, TrustedConsumerContext consumer, BridgeCallControl control)]
        let qualified = ingress.qualify_continuity_notice(&notice, &installation, &consumer, control).await?;
        // [ContinuityNoticeMeaning.from_parts(SafeOpaqueId event_key, CursorNamespaceStream stream, QualifiedStreamEpoch previous, QualificationSlot<QualifiedStreamEpoch> next, GapRangeBounds range, SafeGapReason reason, SafeAuthorityRef basis)]
        let typed = ContinuityNoticeMeaning::from_parts(event_key, stream, previous, next, range, reason, original_source_basis)?;
        // [LocalUnitOfWorkPort.qualify_meaning(BodyFreeOperationMeaningRef meaning, DedupNamespaceScope scope, BridgeCallControl control)]
        let meaning = uow.qualify_meaning(&BodyFreeOperationMeaningRef::ContinuityNotice(typed), &notice_scope, control).await?;
        // exact original key/result优先；qualified.read只原Protocol stream，现有row完整同read取得。
        // [StreamCursor.initialize(StreamCursorRef cursor_ref, CursorNamespaceStream namespace_stream, QualifiedStreamEpoch epoch, OpaqueStreamPositionSlot position, AuthoritativeComparatorRefSlot comparator_ref, ContinuityCoverageRefSlot coverage_ref, CursorRevision revision, SafeInstant now)]
        let cursor_candidate = /* actual absent only */ StreamCursor::initialize(cursor_ref, stream, previous, OpaqueStreamPositionSlot::Uninitialized, comparator_slot, ContinuityCoverageRefSlot::Missing, initial_cursor_revision, now)?;
        // [GapRecord.detect(GapRef gap_ref, StreamCursorRef cursor_ref, BridgeOperationRef operation_ref, QualifiedGapRangeRef range_ref, SafeGapReason reason, AuthoritativeCoverageRefSlot coverage_ref, RecoveryRecordRefSlot recovery_ref, RecoveryWindowRefSlot window_basis)]
        let gap_candidate = /* qualified.range Established only */ GapRecord::detect(gap_ref, actual_cursor_ref, original_operation, qualified_range, reason, AuthoritativeCoverageRefSlot::Missing, RecoveryRecordRefSlot::Missing, qualified_window)?;
        // existing cursor: mark_incomparable仅next/change Established；Missing不造变更；原position不advance。
        // same qualified.notice/read supplies all seven meaning fields; qualification Slots are separate current evaluations.
        // [LocalUnitOfWorkPort.begin(LocalMutationRef mutation, OriginalOperationEffectRef original, ExpectedLocalRevisionSet expected, MutationObservationRequirement observation, BridgeLocalReadContext read, BridgeCallControl control)]
        let begun = uow.begin(&notice_mutation, &notice_original, &notice_expected, &notice_observation, &notice_read, control).await;
        // Ok unique tx_notice only; error retains original/host responsibility and performs zero stages.
        // [ContinuityRepository.stage_cursor(StreamCursor candidate, Option<ExpectedCursorRevision> cursor_expected, LocalRevisionCondition expected, BridgeLocalTransaction tx, BridgeCallControl control)]
        let cursor_stage = /* only actual initialize/mark_incomparable change */ continuity.stage_cursor(&cursor_candidate, cursor_expected, cursor_local_condition, &mut tx_notice, control).await;
        // [ContinuityRepository.stage_gap(GapRecord candidate, LocalRevisionCondition expected, BridgeLocalTransaction tx, BridgeCallControl control)]
        let gap_stage = /* qualified.range Established and actual absent only */ continuity.stage_gap(&gap_candidate, LocalRevisionCondition::Absent, &mut tx_notice, control).await;
        // G0 exact dedup/audit/seed/conditional set -> validate/seal. First failed stage consumes tx through rollback.
        // [LocalUnitOfWorkPort.commit(BridgeLocalTransaction tx, BridgeCallControl control)]
        let actual_notice = /* full successful set only */ uow.commit(tx_notice, control).await;
        // 任一required source/codec/rule缺失zero stage；actual Unknown保original/mutation和host通知责任；零owner/ACK/coverage/Recovery创建。
    }
}
// [LocalUnitOfWorkPort.rollback(BridgeLocalTransaction tx, BridgeCallControl control)]
let rollback = /* any tx stage/guard/seal error, exclusive phase handle */ uow.rollback(tx, control).await;
```

### 1.4 事务边界与ACK顺序

| 阶段 | 原子内容 / 外部边界 |
|---|---|
| private验证/current | required secret仅短借verifier，source未验真零local。平台challenge/PING仅host协议处理，不强建message；不能没有正式验证outcome就发业务accepted |
| ACK | 只actual source计划规定可先defer/协议ACK且deadline足够时，在A前实际执行；不支持可靠defer/replay的mode不能承诺后续owner执行。正式要求durable后ACK的mode先A actual commit，再剩余deadline内执行；超时/未知原NotSent/Indeterminate，不续token或伪Sent。无平台默认ACK常数 |
| A verified | 必须已有完整qualified typed Inbound meaning，缺mapping/source时当前零durable；合法fresh local1记录含完整safe Slots或非required Missing、dedup Reserved、seed LocalMutation(A)、唯一audit/条件handoff；不含claim或owner未来结果 |
| B claim | actual A baseline -> same-tx reserve claim + HandoffPending + 原key/result seed复用 + audit/condition；actual B unknown或CAS loser零owner IO；最后current重新核准后最多一次same-op handoff |
| C finalize | same actual B/op owner outcome/Pending/Unknown、必要actual known mapping/tombstone、dedup实际原result关联、audit/seed复用/condition；owner已发生后本地失败不能当owner撤销，保真实结果及original/mutation恢复责任 |
| ACK落盘 | 若实际ACK在A后，则在下一actual原行阶段record_protocol_disposition(ack, local)；若无下一阶段，独立原local mutation仅该字段+G0材料。重复同ACK无变化不写；ACK变更不升owner stage |
| Continuity | qualified ContinuityNotice meaning+actual current source/recipe/读资格 -> 唯一Protocol cursor/gap/dedup/audit/result/条件handoff tx；field不变不stage，无range exact basis不建gap；epoch_change缺失不改epoch，零advance/owner/ACK。缺实际门禁host保Disconnected责任 |

AppendFact只正式Integration/BridgeMapped/required owner digest，例外不取消active space/visibility/source isolation/Policy；mapped human责任保独立，不自行变GlobalMember/participant。ManifestExternalFact只ref与owner实际模式。owner/platform缺明确same-op no-effect/idempotent恢复资格不重交；材料不能正式再取则Blocked/manual，无raw cache。四平台locator/edit/delete/thread/attachment/source-mode/ACK差异沿Step8§7实际required核验；没有选定SDK/OAuth/API Key/KMS/router/pin或安装。

### 1.5 错误映射

source/schema/签名错有限Rejected/UnsupportedVersion且未verified关联不出；verified loop/late create vs tombstone/edit缺mapping有限拒绝或Blocked，不写raw。只有原meaning齐且已有合法actual记录才Quarantined/Blocked local维护；fresh缺mapping/source走S9-GAP-INBOUND-MEANING零durable。缺actor/mode/material/digest/附件/secret/current/observation=Blocked；actual source discontinuity缺meaning/basis只保host责任，不造coverage。post-A/B/owner取消或Err保完整original/phase；owner Pending非Rejected，owner未知非platform no-effect；current不允披露只finite outcome，宿主保原恢复责任。

### 1.6 状态与事件副作用

record首Verified；actual必要维护可Verified -> Blocked/Quarantined；B合法 -> HandoffPending；C known -> OwnerAccepted/OwnerRejected，Pending同态结果字段，Unknown -> Indeterminate。Protocol独立字段，不能回滚owner。受权R3后Continuity仅允许完整current source/recipe/meaning/读资格下实际cursor首建Ready（actual comparator）或Incomparable、Open gap首建、原Ready合法 -> Incomparable；next/change Missing/Stale不伪epoch_change，保旧position。zero advance/Closed/Recovery创建。两分支actual局部变化均G0 audit/result/qualified条件O01；外部门禁不足零stage并保host责任。Step10候选InboundHandoffState/StreamCursorState/GapState/DedupState，不宣actual notice已投递或持久化成功。

### 1.7 测试切口与停审

沿Step4 `authorization_flow_tests.rs`/`continuity_flow_tests.rs`/`platform_boundary_tests.rs`/`private_material_boundary_tests.rs`/`local_commit_boundary_tests.rs`/`inbound_dispatch_tests.rs`/`consumer_dispatch_tests.rs`：两input分支、未验源零record、verified anti-loop、required Slots/actor模式/附件、edit/delete/thread缺映射、A local1/B实际CAS、claim前零ownerIO、B未知/one winner、C保owner事实、same-key immutable seed复用、ACK前后/丢失与owner独立、deadline/cancel/drop原责任；Continuity无typed meaning时零ID/tx/dedup/gap/audit且host责任不消失、禁止dummy mapping/source及borrow Recovery meaning；合同释放后再测Protocol-only、Unknown range/next Missing/Stale、comparator/Absent/range basis与非coverage。只planned。

| 停审项 | 结论 / 修正 |
|---|---|
| DTO/对象/port | 受权R3 pass_design；完整notice meaning与六字段qualified来源齐；fresh缺mapping/source明确零durable carve-out，safe envelope非直调 |
| tx/error/state/副作用 | pass_design_only；A/B/C及独立notice tx实际baseline/typed stage闭合，B actual commit先owner IO、immutable A不提升终态；ACK独立，notice外部门禁不足零写 |
| 测试/phase/复杂度 | pass_design_only；原targets、上游/actual source缺口fail-closed，零新增replay或platform truth；下一E02 |

## 2. E02 CommittedSourceAvailableConsumer

### 2.1 入口与目标

Worker SafeEventConsumerRunner固定CommittedSource分支 -> `CommittedSourceAvailableInput::from_parts(consumer, event_key, source, target, kind)` -> `CommittedSourceAvailableConsumer::consume`。Application/U3；[Step8§9](03_ddd_step_08_inbound_protocols.md)、Step6 plan/intent、Step7 presentation/delivery和当前[C04](03_ddd_step_09_command_flows.md)§4。问题：Bus ACK或candidate commit ref不是owner提交证明。采用先qualify_source、完整current与跨C04 effect unique；不调C04 execute代替E02、不send或自造producer。

| 字段/目标全集 | 来源与缺失处理 |
|---|---|
| consumer/event_key | registered owning SafeTransportEventLease，metadata/source/schema/scope/trace/envelope身份各自核；original初始None。key来自正式recipe，经qualify_event_key，不自动event_id复制 |
| source/target/kind | 原CommittedSourcePayload三字段，source actual owner committed_basis由qualify_source核；target五字段完整，kind显式，无edit/delete/reply fallback |
| plan十参/intent十二参 | 同C04已完整来源表：原安装/relation/mapping/责任/current presentation、技术ID和actual now；缺投影/Gate/附件Blocked，Degraded只explicit无动作许可 |
| effect/key/meaning | event namespace与Command不同，typed DeliveryOperationMeaning与StableEffectIdentity同source/version/projection/target/kind完全一致；find_by_effect实际winner优先，不把producer event ID当effect |
| lane/source上限 | 受权R2同C04：本consumer显式lanes注入，qualify_lane取得scope/依赖/bounds/budget/rate依据，existing唯一复用或insert_for_scope同UoW两轴Absent；缺实际current资格仍Blocked，不造intent成功 |
| result五字段 | disposition/operation/intent/local_commit/reason分别actual consumer结论/原op/真实intent关联/实际提交/有限reason；None非成功，不补receipt/attempt |

### 2.2 函数级调用图：CommittedSourceAvailableConsumer

```text
[SafeEventConsumerRunner -> E02.consume]
  | call Input.from_parts; verify registered source/recipe
  v
[PresentationQualificationPort + full local current ports]
  | call qualify_source; query installation/relation/mapping
  | call qualify; qualify_effect; query find_by_effect and original result
  +--> same effect: safe original reuse
  +--> missing fresh lane: Blocked, zero planned intent/send
  v
[SafePresentationPlan / qualified DeliveryIntent]
  | call prepare / from_plan only full sources
  v
[LocalUnitOfWorkPort + DeliveryRepository]
  | tx begin; save exact plan/qualified intent + G0 original set; commit/rollback
  v
[Worker one-use SafeTransportAckCall]
  | protocol ACK actual application disposition; no platform delivery
```

关键说明：

- registered producer和owner committed_basis是输入资格，不由Bus ACK或candidate ref证明。
- 与C04同effect/scope unique与双轴Absent合同；实际qualified来源不足仍阻，transport ACK不提升为外部送达。

### 2.3 关键伪代码

E02与C04的scope/首建规则完全相同但保持独立consumer入口：在原find_by_effect缺失、完整current presentation成立后，调用本consumer已注入的qualification/lanes。已有lane保其ID/预算/head/CAS；首建只有同UoW两轴Absent。qualified scope/rate来源缺失有限NotEstablished，不能以event_id或source ID当lane。

```rust
// [PresentationQualificationPort.qualify_lane(ImmutableDeliveryTargetRef target, CurrentPresentationQualification presentation, CapabilitySnapshotRef capability, BridgeCallControl control)]
let lane_q = qualification.qualify_lane(&target, &current, &capability, control).await?;
// [LaneRepository.find_for_scope(QualifiedLaneOrderScope scope, BridgeLocalReadSession read, BridgeCallControl control)]
let actual_lane = lanes.find_for_scope(qualified_lane.scope(), &session, control).await?;
// absent: DispatchLane::for_scope全九参同C04，纯构造；已有则零首建。
// This is preflight only; new_lane is constructed outside tx, insert is in the next transaction block.
```

```rust
// [PresentationQualificationPort.qualify_source(CommittedSourceVersionRef source, TrustedConsumerContext consumer, BridgeCallControl control)]
let committed_q = presentation.qualify_source(&source, &consumer, control).await?;
// [LocalUnitOfWorkPort.qualify_event_key(SafeOpaqueId value, SafeAuthorityRef source, DedupNamespaceScope scope, TrustedConsumerContext consumer, BridgeCallControl control)]
let key = uow.qualify_event_key(&event_key, &source_authority, &namespace_scope, &consumer, control).await?;
// [PresentationQualificationPort.qualify(CommittedSourceVersionRef source, ImmutableDeliveryTargetRef target, ExternalDeliveryKind kind, ActorRef actor, BridgeCallControl control)]
let presentation_q = presentation.qualify(&actual_source, &target, kind, &source_actor, control).await?;
// [LocalUnitOfWorkPort.qualify_effect(StableEffectIdentity effect, BridgeCallControl control)]
let effect = uow.qualify_effect(&typed_delivery_effect, control).await?;
// [DeliveryRepository.find_by_effect(StableEffectIdentity effect, BridgeLocalReadSession read, BridgeCallControl control)]
let winner = delivery.find_by_effect(&effect, &session, control).await?;
// G0原key/result与完整winner/current过滤；同effect跨C04复用，不mint第二ID。
// Complete qualified scope selects existing lane or exact absent-scope pure candidate; missing qualification -> Blocked, zero from_plan.
// [LocalUnitOfWorkPort.begin(LocalMutationRef mutation, OriginalOperationEffectRef original, ExpectedLocalRevisionSet expected, MutationObservationRequirement observation, BridgeLocalReadContext read, BridgeCallControl control)]
let begun = uow.begin(&mutation, &original, &expected_set, &observation, &read, control).await;
let mut tx = match begun {
    Ok(tx) => tx,
    Err(_) => {
        // 原source/prepare operation与mutation保留，transport ACK不能替actual local proof。
        return Err(BridgePortError::Indeterminate { original, phase: BridgeCallPhase::LocalStage });
    }
};
// [LaneRepository.insert_for_scope(DispatchLane candidate, LanePreparationQualification qualification, BridgeLocalTransaction tx, BridgeCallControl control)]
let lane_stage = /* only exact absent scope; tx already exists */ lanes.insert_for_scope(&new_lane, &qualified_lane, &mut tx, control).await;
// Existing lane skips insert; first failure consumes tx via rollback. Same scope/effect race reads actual winner only.
// [DeliveryRepository.stage_plan(SafePresentationPlan candidate, LocalRevisionCondition expected, BridgeLocalTransaction tx, BridgeCallControl control)]
let staged = delivery.stage_plan(&actual_plan_candidate, LocalRevisionCondition::Absent, &mut tx, control).await;
// [DeliveryRepository.stage_intent(DeliveryIntent candidate, StableEffectIdentity effect, LocalRevisionCondition expected, BridgeLocalTransaction tx, BridgeCallControl control)]
let intent_stage = /* complete qualified Planned only */ delivery.stage_intent(&actual_intent_candidate, &effect, LocalRevisionCondition::Absent, &mut tx, control).await;
// No PlatformDeliveryPort call; Blocked-plan branch omits lane insertion/intent/effect from writes and expected.
// G0 dedup/audit/seed/condition、validate/seal；任何失败actual rollback。
// [LocalUnitOfWorkPort.commit(BridgeLocalTransaction tx, BridgeCallControl control)]
let actual = /* full set successful */ uow.commit(tx, control).await;
// [LocalUnitOfWorkPort.rollback(BridgeLocalTransaction tx, BridgeCallControl control)]
let failed = /* exclusive failure */ uow.rollback(tx, control).await;
```

### 2.4 事务边界

owner/current/source/recipe/preflight在tx外；唯一local tx原plan、合法intent/effect唯一（若有）、dedup/audit/result/条件handoff。跨入口冲突只有受权same effect/meaning winner复用；变义Conflict，不重plan/target。actual未知保原mutation/operation；外层transport ACK只消费该实际disposition，不替commit。没有私有payload/secret解析、attempt、receipt、平台调用或owner修改。

### 2.5 错误映射

错source/schema/event_key或ownercommit依据缺失先Rejected/UnsupportedVersion/Blocked；sensitive/附件/current不足Blocked；missing lane NotEstablished/Blocked；不同义key/effect冲突有限Rejected/Quarantined，零raw DLQ。actual local unknown=Indeterminate original，不因Bus ack标AcceptedLocal。只有current允显receipt原关联。

### 2.6 状态与事件副作用

plan裁定Qualified/Degraded/Blocked；受权R2后fresh Planned只在完整qualified lane与actual同UoW plan/intent成立；same effect只复用原stage，不覆盖迟到旧版本。zero dispatch/attempt/receipt/message mapping。actual local变更G0唯一audit/seed/condition O01；producer真相/SourceAudit准入不归Bridges，日志无source正文。Step10候选plan/intent/lane/dedup状态。

### 2.7 测试切口与停审

`authorization_flow_tests.rs`/`continuity_flow_tests.rs`/`consumer_dispatch_tests.rs`/`protocol_surface_tests.rs`：source注册/schema/committed proof、C04两key同effect unique race、typed target/kind/版本、敏感降级与附件、missing lane zero-intent/send、same-key immutable结果、transport ACK lost与local unknown独立、zero raw材料。仅planned。

| 停审项 | 结论 / 缺口 |
|---|---|
| DTO/对象/port | 受权R2 pass_design；五参input与三payload、source/factory、显式lanes注入、qualified scope/首建两轴Absent闭合；外部不足仍blocked |
| tx/error/state/副作用 | pass_design_only；same C04 effect、原结果/target不换、zero-send与ACK独立 |
| 测试/phase/复杂度 | pass_design_only；原targets和上游缺口保持，无新prepare入口/observer producer；下一E03 |

## 3. E03 PlatformCallbackReceivedConsumer

### 3.1 入口与目标

qualified PlatformDispatcher/PlatformSourceRunner -> `PlatformCallbackReceivedInput::from_parts(consumer, candidate_event_key, private)` -> `PlatformCallbackReceivedConsumer::consume`。Application/U4；[Step8§6~8](03_ddd_step_08_inbound_protocols.md)、Step6 action/callback、Step7 verification/actor/owner/one-use/secret/ACK。

问题/诊断：source-only不能创建Verified callback；raw选择不能入meaning/log，one-use reservation不等actual消费。采用source -> actual action/known message -> 责任/owner/current/expiry -> owner安全语义 -> complete verification -> A verified -> B atomic one-use -> owner -> C结果。重复仍验source；只有正式immutable source identity与原stored meaning的同义证明成立才复用，不能根据key猜raw相同；没有证明只Blocked/Conflict，不重解释choice/重批准或造hash。C05初绑资格不能冒充本次callback资格。

| DTO / 目标参数全集 | actual来源与guard |
|---|---|
| consumer/key/private | actual host注册source/schema/scope/trace；owning private callback/reply lease本call短借；required secret/config按原安装精确purpose核 |
| source七字段 | verify_source -> namespace/source/action locator/account/message/platform_basis/ack；不含owner批准；Rejected/Unavailable零callback/one-use |
| 原action/known source/actor | CallbackRepository.get_action、MappingRepository完整原relation/identity/message、DeliveryRepository原known source；current binding/generation；resolve_external真正责任，不自动GlobalMember/Integration |
| owner/expiry/semantic | qualify_action、qualify_expiry、qualify_callback_semantics；ActionOperationMeaning四字段action/target/state_revision/opaque semantic_ref全部owner认可，choice原字节及可还原hash禁止durable |
| complete/context | qualify_complete(source, actual action, actor, owner, expiry)实际CallbackVerificationRef；CurrentActionQualification六字段binding/action/owner_revision/authorization/expiry/verification；QualifiedCallbackContext六字段namespace/verification/action_binding/source_intent/current/ack |
| from_verified九参 | UoW callback/op、action/verification/owner_action三Established Slot、one-use/owner result两Missing、actual ACK或NotSent、上述context；Verified/local1 |
| B reserve/Domain | reserve_one_use(action, callback, original,current,actual action local,tx) -> reservation；claim_once(operation,claim,current,actual action local,now)与record.begin_handoff(claim,owner,current,actual callback local,now)；action与callback同tx实际commit |
| C finalize/ACK | same-op OwnerActionResultRef -> apply_owner_result/mark_unknown；record_protocol_disposition只actual ACK，不改变one-use/owner state；原A immutable seed复用，actual business结果写原record Slot |

### 3.2 函数级调用图：PlatformCallbackReceivedConsumer

```text
[Qualified platform host -> E03.consume]
  | call verify_source; actual ACK as source deadline rule
  v
[Callback/Mapping/Delivery repositories + binding/actor ports]
  | query full action/known source/account mapping
  | call current relation/resolve_external
  v
[OwnerActionPort + CallbackVerificationPort]
  | call qualify_action/qualify_expiry/qualify_callback_semantics
  | call qualify_complete; construct current/context; zero owner effect
  v
[LocalUnitOfWorkPort + CallbackRepository]
  | tx A: save Verified callback + original mutation set; actual commit
  | tx B: reserve_one_use; call claim_once/begin_handoff; save both; actual commit
  v
[Last current responsibility/owner/source checks]
  | call OwnerActionPort.handoff once, original operation only
  v
[LocalUnitOfWorkPort + CallbackRepository]
  | tx C: call apply_owner_result/mark_unknown; save actual stages + original set
  | return Protocol/Local/Owner separately; no Decision truth
```

关键说明：

- 验签、责任、owner认可安全语义和complete验证是分别必要的输入，choice不入durable/log。
- A/B/C分阶段；one-use原子提交先owner，未知不释放重批，ACK从不等于审批成功。

### 3.3 关键伪代码

```rust
// [CallbackVerificationPort.verify_source(PrivateCallbackContext input, BridgeInstallation installation, Option<PrivateSecretHandle> secret, BridgeCallControl control)]
let source_result = verification.verify_source(&private, &installation, secret_borrow, control).await?;
// Only Verified(source-only) continues; rejection just formal actual ACK and finite reason.
// [CallbackRepository.get_action(ExternalActionBindingRef action, BridgeLocalReadSession read, BridgeCallControl control)]
let action_row = callbacks.get_action(&actual_source_action_ref, &session, control).await?;
// [ActorResponsibilityPort.resolve_external(ExternalAccountLocator account, ExternalIdentityMapping mapping, CurrentBindingQualification binding, BridgeCallControl control)]
let actor_q = actors.resolve_external(&account, &identity_mapping, &current_binding, control).await?;
// [OwnerActionPort.qualify_action(ExternalActionBinding action, ActorResponsibilityRef actor, BridgeCallControl control)]
let owner_q = owner.qualify_action(&action, &current_responsibility, control).await?;
// [OwnerActionPort.qualify_expiry(ExternalActionBinding action, OwnerActionQualificationRef owner, BridgeCallControl control)]
let expiry_q = owner.qualify_expiry(&action, &owner_current, control).await?;
// [OwnerActionPort.qualify_callback_semantics(BridgeVerifiedCallbackSource source, ExternalActionBinding action, OwnerActionQualificationRef owner, PrivateCallbackContext input, BridgeCallControl control)]
let action_meaning_q = /* fresh only */ owner.qualify_callback_semantics(&source, &action, &owner_current, &private, control).await?;
// [CallbackVerificationPort.qualify_complete(BridgeVerifiedCallbackSource source, ExternalActionBinding action, ActorResponsibilityRef actor, OwnerActionQualificationRef owner, ActionExpiryOneUseRef expiry, BridgeCallControl control)]
let complete_q = verification.qualify_complete(&source, &action, &current_responsibility, &owner_current, &expiry, control).await?;
// Complete current/context use full field factories; G0 qualified callback key/meaning and original lookup before durable mutation.
// [CallbackHandoffRecord.from_verified(CallbackRecordRef callback_ref, BridgeOperationRef operation_ref, ExternalActionBindingRefSlot action_binding_ref, CallbackVerificationRefSlot verification_ref, OwnerTargetActionRefSlot owner_action_ref, OneUseClaimRefSlot one_use_claim, ProtocolAckDisposition protocol_disposition, OwnerActionResultRefSlot owner_result, QualifiedCallbackContext current)]
let verified_record = CallbackHandoffRecord::from_verified(callback_ref, operation_ref, action_slot, verification_slot, target_slot, OneUseClaimRefSlot::Missing, actual_ack, OwnerActionResultRefSlot::Missing, context)?;
// A stage_callback Absent + G0 set -> actual commit. B reads actual A and original C05 action baseline.
// [LocalUnitOfWorkPort.begin(LocalMutationRef mutation, OriginalOperationEffectRef original, ExpectedLocalRevisionSet expected, MutationObservationRequirement observation, BridgeLocalReadContext read, BridgeCallControl control)]
let begun_b = uow.begin(&mutation_b, &original, &expected_b, &observation_b, &read, control).await;
let mut tx = match begun_b {
    Ok(tx) => tx,
    Err(_) => {
        // A已actual接管；宿主保mutation_b、original和A原结果，零one-use/owner IO。
        return Err(BridgePortError::Indeterminate { original, phase: BridgeCallPhase::LocalStage });
    }
};
// [CallbackRepository.reserve_one_use(ExternalActionBindingRef action, CallbackRecordRef callback, OriginalOperationEffectRef original, CurrentActionQualification current, ExpectedLocalRevision expected, BridgeLocalTransaction tx, BridgeCallControl control)]
let reservation = callbacks.reserve_one_use(&action_ref, &callback_ref, &original, &current, action_local_cas, &mut tx, control).await;
// [ExternalActionBinding.claim_once(BridgeOperationRef operation, OneUseClaimRef claim, CurrentActionQualification current, ExpectedLocalRevision local, SafeInstant now)]
let action_transition = /* reservation success */ action_candidate.claim_once(operation_ref, one_use_reservation, current, action_local_cas, now);
// [CallbackHandoffRecord.begin_handoff(OneUseClaimRef claim, OwnerActionQualificationRef qualification, CurrentActionQualification current, ExpectedLocalRevision local, SafeInstant now)]
let callback_transition = record_candidate.begin_handoff(one_use_reservation, owner_current, current, callback_local_cas, now);
// [CallbackRepository.stage_action(ExternalActionBinding candidate, LocalRevisionCondition expected, BridgeLocalTransaction tx, BridgeCallControl control)]
let action_stage = callbacks.stage_action(&action_candidate, action_expected, &mut tx, control).await;
// [CallbackRepository.stage_callback(CallbackHandoffRecord candidate, LocalRevisionCondition expected, BridgeLocalTransaction tx, BridgeCallControl control)]
let callback_stage = callbacks.stage_callback(&record_candidate, callback_expected, &mut tx, control).await;
// G0 original A immutable seed reuse, audit/condition, validate/seal; any failure actual rollback, no owner IO.
// [LocalUnitOfWorkPort.commit(BridgeLocalTransaction tx, BridgeCallControl control)]
let actual_b = /* full successful set */ uow.commit(tx, control).await;
// After matching actual commit only, final actor/owner/source/expiry revalidation; preserve already Claimed same-op instead of requiring Active again.
// [ActorResponsibilityPort.revalidate(ActorResponsibilityRef responsibility, OwnerTargetActionRef action, BridgeCallControl control)]
let final_actor = actors.revalidate(&current_responsibility, &target_action, control).await;
// [OwnerActionPort.handoff(CallbackHandoffRecord record, CurrentActionQualification current, ActionOperationMeaning meaning, OneUseClaimRef claim, OriginalOperationEffectRef original, BridgeCallControl control)]
let owner_result = /* all final current match */ owner.handoff(&actual_record_b, &final_current, &original_action_meaning, &actual_claim_b, &original, control).await;
// [CallbackHandoffRecord.apply_owner_result(OwnerActionResultRef result, ExpectedLocalRevision local)]
let finalized = /* actual known/Pending branch */ record_c.apply_owner_result(actual_owner_result, actual_local_cas_c);
// [CallbackHandoffRecord.mark_unknown(SafeReasonCode reason, ExpectedLocalRevision local)]
let unknown = /* exclusive unknown/Err/cancel */ record_c.mark_unknown(reason, actual_local_cas_c);
// C original record+G0 set, same original/meaning/A payload -> actual commit. Never release/reclaim action or execute another choice.
// [LocalUnitOfWorkPort.rollback(BridgeLocalTransaction tx, BridgeCallControl control)]
let failed = /* exclusive tx error branch */ uow.rollback(tx, control).await;
```

### 3.4 事务边界与ACK

source/known source/责任/owner safe semantic/private验源在tx外，raw只有当前call。A fresh Verified/local1 + original dedup/audit/seed/条件handoff；B actual A与action baseline同tx one-use reservation + action Claimed + callback OwnerPending + immutable seed复用/audit/condition；commit unknown或loser零ownerIO。最后current重核允许的是该same-op已Claimed继续交接，不重新assert Active/再claim；owner仍二次核Policy/Gate。C真实owner结果仅原callback/dedup/result/audit/condition；不能把本地失败当owner未执行或release one-use。

ACK沿E01§1.4的actual source-mode deadline/defer vs durable后ACK规则；初始ACK成功不等审批，后续token期限不能自行续。实际ACK字段若后发生，只在next原local mutation record_protocol_disposition；变更需actual proof，无业务变化不重复audit。PrivateCallback选择/token/签名输入及可还原派生禁止日志/evidence/stored seed，安全semantic ABI欠缺即BR-UP-003 blocked。

### 3.5 错误映射

wrong signature/nonce/source安装/schema有限Rejected/UnsupportedVersion且零record/claim；source-only缺责任/owner/known message/expiry/semantic/ref=Blocked；cross account/source/action/kind/generation/version=Rejected/Stale；one-use/CAS winner不同义Conflict，无隐含retry。post-A/B/owner取消/Err保original+phase，Pending/Unknown不作OwnerRejected或NoEffect；current披露不足不暴露审批存在性/claim/ref。

### 3.6 状态与事件副作用

callback Verified -> OwnerPending -> OwnerAccepted/OwnerRejected或Indeterminate，Pending同态safe结果；action Active -> Claimed，终态不复活、不释放重批。源/语义不齐不创建Verified；协议ACK独立。实际local阶段audit/result/qualified条件O01但无Decision/Gate/Turn truth、raw审批或新run/evidence。Step10候选ExternalActionState/CallbackHandoffState/DedupState。

### 3.7 测试切口与停审

`authorization_flow_tests.rs`/`continuity_flow_tests.rs`/`platform_boundary_tests.rs`/`private_material_boundary_tests.rs`/`local_commit_boundary_tests.rs`/`inbound_dispatch_tests.rs`：source-only非Verified、raw语义只owner、角色/target/action/message/version/nonce/expiry、wrong semantic与同key冲突、duplicate不重解析choice、A local1/B actual CAS、双callback one-use winner、claim commit未知零owner、last-current撤销、owner二次Gate/unknown、C失败保真实结果/原claim、ACK deadline与owner独立、zero敏感durable/hash/debug。均planned未运行。

| 停审项 | 结论 / 缺口 |
|---|---|
| DTO/对象/port | pass_design_only；三input/七source/六context/九record完整，fresh安全semantic与实际complete验证来源 |
| tx/error/state/副作用 | pass_design_only；A/B/C、same-op one-use actual claim先owner、postclaim不要求Active或再claim，ACK不批复 |
| 测试/phase/复杂度 | pass_design_only；BR-UP-003/008 ABI/source未核positive blocked，原targets，zero新approval/replay；下一E04 |

## 4. E04 SafeHandoffDispositionConsumer

### 4.1 入口与目标

Worker SafeEventConsumerRunner固定SafeHandoff分支 -> `SafeHandoffDispositionInput::from_parts(consumer, event_key, handoff, original, disposition)` -> `SafeHandoffDispositionConsumer::consume`。Application/U6；[Step8§10/11](03_ddd_step_08_inbound_protocols.md)、Step6 SafeHandoffRecord、Step7 SafeObservation/SafeTrace/UoW。

问题/诊断：consumer结果回执不能建立producer/canonical，transport ACK不等consumer accepted。采用qualified原op result-only finalize；不调用from_canonical、handoff/send、重签op或新O01。当前正式Observability03§7.4 static map没有Bridges，explicit SourceAudit family不含本项目，故positive runtime链保持blocked；字段schema不是准入证明。

| DTO / 构造全集 | 原来源与guard |
|---|---|
| consumer/event_key | actual registered result source的owning transport lease；original必须Some并等payload original/实际handoff op；recipe qualified key不等event ID |
| handoff/original/disposition | 原三payload字段逐一入input；get_handoff/read_handoff_snapshot完整audit/canonical/op/claim/result/hydration，原行不存在拒绝，不造producer |
| actual current disposition | qualify_disposition(disposition, actual handoff, consumer)核exact source/kind/schema/scope/window/op/canonical/admission；caller仅候选，不从ACK生成ConsumerDispositionRef |
| Domain/result | apply_consumer_result(actual disposition,actual local_cas)或mark_unknown(reason,actual local_cas)，不重新begin_handoff；原业务result Slot可变，G0原immutable stored seed只同义复用 |
| audit/observation | 仅actual local result变化的安全audit与stored result；只有formal OwnerPermitsAuditOnly的result-finalize规则可零handoff提交；无此规则或mandatory无法无递归闭合则Blocked，不默认audit-only、不生成递归O01 |
| 返回五字段 | disposition/operation/consumer/local_commit/reason分别实际接管、原handoff op、actual consumer Slot、实际local proof、有限reason；consumer accepted不是evidence/signoff |

### 4.2 函数级调用图：SafeHandoffDispositionConsumer

```text
[SafeEventConsumerRunner -> E04.consume]
  | call Input.from_parts; verify result source/recipe/lease original
  v
[SafeTraceRepository + SafeObservationPort]
  | query get_handoff/read_handoff_snapshot and original result
  | call qualify_disposition; absent admission -> Blocked
  v
[SafeHandoffRecord]
  | call apply_consumer_result or mark_unknown (same-op only)
  v
[LocalUnitOfWorkPort + SafeTraceRepository]
  | tx begin; save stage_handoff + actual dedup/result/audit
  | seal; tx commit/rollback; no new canonical/handoff/O01
  v
[Worker one-use transport ACK]
  | ACK actual local disposition, separate from consumer result
```

关键说明：

- 回执只更新原handoff/op outcome，不建立producer或canonical；Bridges准入缺失仍blocked。
- 正式非递归审计规则是finalize前置，未知或规则欠缺保原责任，零新O01与evidence。

### 4.3 关键伪代码

```rust
// [SafeTraceRepository.get_handoff(SafeHandoffRef handoff, BridgeLocalReadSession read, BridgeCallControl control)]
let row = trace.get_handoff(&handoff_ref, &session, control).await?;
// [SafeObservationPort.qualify_disposition(ConsumerDispositionRef disposition, SafeHandoffRecord handoff, TrustedConsumerContext consumer, BridgeCallControl control)]
let disposition_q = observation.qualify_disposition(&candidate_disposition, &actual_handoff, &consumer, control).await?;
// [SafeObservationPort.qualify_nonrecursive(SafeHandoffRecord record, BodyFreeMutationMaterial material, ActorRef actor, BridgeCallControl control)]
let result_rule_q = observation.qualify_nonrecursive(&actual_handoff, &actual_result_material, &consumer_actor, control).await?;
// Qualified -> NonRecursiveResultOnly; local audit/result required, zero new canonical/outbox/O01. No compatible formal rule -> zero stage, host retains actual result.
// G0 original key/meaning/result; terminal same disposition only reuse, terminal different authority/result Conflict.
// [SafeHandoffRecord.apply_consumer_result(ConsumerDispositionRef result, ExpectedLocalRevision local)]
let applied = /* known/Pending actual */ candidate.apply_consumer_result(actual_disposition, local_cas)?;
// [SafeHandoffRecord.mark_unknown(SafeReasonCode reason, ExpectedLocalRevision local)]
let unknown = /* exclusive Unknown branch from Dispatching */ candidate.mark_unknown(reason, local_cas)?;
// Existing Indeterminate same unknown no mutation; unavailable basis lacking formal maintenance does not call block.
// [LocalUnitOfWorkPort.begin(LocalMutationRef mutation, OriginalOperationEffectRef original, ExpectedLocalRevisionSet expected, MutationObservationRequirement observation, BridgeLocalReadContext read, BridgeCallControl control)]
let begun = uow.begin(&mutation, &original_effect, &expected_set, &formal_result_observation, &read, control).await;
let mut tx = match begun {
    Ok(tx) => tx,
    Err(_) => {
        // 已知consumer处置及原operation/mutation仍由host保留；不造新producer或抹实际结果。
        return Err(BridgePortError::Indeterminate { original: original_effect, phase: BridgeCallPhase::LocalStage });
    }
};
// [SafeTraceRepository.stage_handoff(SafeHandoffRecord candidate, LocalRevisionCondition expected, BridgeLocalTransaction tx, BridgeCallControl control)]
let staged = trace.stage_handoff(&candidate, actual_expected, &mut tx, control).await;
// G0 actual seed/original dedup/audit; result-finalize formal audit-only => handoff=None; validate/seal.
// [LocalUnitOfWorkPort.commit(BridgeLocalTransaction tx, BridgeCallControl control)]
let actual = /* full successful set */ uow.commit(tx, control).await;
// [LocalUnitOfWorkPort.rollback(BridgeLocalTransaction tx, BridgeCallControl control)]
let failed = /* exclusive failure */ uow.rollback(tx, control).await;
```

### 4.4 事务边界

source/原snapshot/consumer current/preflight tx外；一个local tx仅原handoff outcome/dedup/stored result/audit，zero producer/canonical/claim/resend。J04/J02/E04竞争同local CAS；loser受权读winner，同义terminal复用，不覆盖known结果。post-result local unknown保真实foreign处置及原mutation/op，actual consumer不会因rollback被撤回。运输ACK按Worker原一次性executor单独记录，无法替local proof。

### 4.5 错误映射

无原handoff/wrong original/source/schema=Rejected/Blocked，不制造New；producer链不准入=Blocked/NotEstablished；Pending只Dispatching同态，Unknown/Unavailable保原Indeterminate/Blocked，不当accepted/no-effect。不同known authority/result conflict不覆盖。已接管后取消/commitErr保完整原op/phase/current不允披露则有限安全输出。

### 4.6 状态与事件副作用

Dispatching/Indeterminate -> ConsumerAccepted/ConsumerRejected仅actual known；Pending仅Dispatching同态字段；Dispatching -> Indeterminate仅未知；已有Indeterminate未知不造重复mutation。no new Pending/handoff/producer/trace/outbox/O01/evidence/report/verdict/signoff/readiness。actual result更新仅safe audit/result；Step10候选SafeHandoffState/DedupState。

### 4.7 测试切口与停审

`authorization_flow_tests.rs`/`continuity_flow_tests.rs`/`local_commit_boundary_tests.rs`/`consumer_dispatch_tests.rs`/`protocol_surface_tests.rs`：static-map无Bridges阻positive、wrong original/schema/source、原handoff不存在零from_canonical、Pending/ACK非accepted、E04/J04/J02同CAS winner、immutable原结果、local unknown保foreign真实处置、zero递归O01/raw/evidence。只planned。

| 停审项 | 结论 / 缺口 |
|---|---|
| DTO/对象/port | pass_fail_closed_design；五input/三payload，原handoff/qualification/result-only；正向admission保持blocked |
| tx/error/state/副作用 | pass_design_only；only original outcome、无producer创建或递归O01，ACK与actual结果独立 |
| 测试/phase/复杂度 | pass_design_only；BR-UP-006与十二affected不关闭，原targets，下一O |

## 5. Inbound批次与组内审计

| Flow / 协议 | 模块 / 对象 | port与阶段副作用 | 停审 |
|---|---|---|---|
| E01 PlatformInputReceivedConsumer | U2 inbound / Protocol U5 cursor+gap | ingress/owner/current/private/ACK；private A/B/C，qualified notice独立tx | 受权R3 pass_design；实际source/codec/rule不足仍blocked |
| E02 CommittedSourceAvailableConsumer | U3 plan/intent/lane | formal source/presentation/full mapping；C04同effect/scope、Absent首建、zero-send | 受权R2 pass_design；实际current/rate/准入不足仍blocked |
| E03 PlatformCallbackReceivedConsumer | U4 action/callback | source/责任/owner semantic/one-use/ACK；A/B/C | pass_design_only；owner ABI/source缺口blocked |
| E04 SafeHandoffDispositionConsumer | U6原handoff | observation/trace result-only；zero新producer/O01 | pass_fail_closed_design；准入blocked |

四flow的safe normalized输入不产生第五consumer；原private仍mandatory验源。跨阶段immutable A payload不可覆写，所有状态来自原具名成员/actual baseline；post-effect未知保原operation，不造GlobalSuccess。组内实际静态审计到X执行，不充运行证据。
