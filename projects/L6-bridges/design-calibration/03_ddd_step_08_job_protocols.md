# L6-bridges 03 Step8：Operations Job协议

## 1. J范围、批次与统一metadata

主文件J问题/诊断/取舍已done。只五个原bounded动作，入口仍原`JobInvocationDispatcher::invoke(plan,control) -> BridgePortFuture<JobInvocationState>`、五bin与Worker调度；不新增HTTP/queue/通用replay。Contracts schema计划唯一归属`crates/contracts/src/jobs.rs`，原JobContinuityMetadata归shared/metadata，原Jobs plan/phase留`crates/jobs/src/invocation.rs`，Contracts不得反向依赖它们。严格safe字段codec/outer finite错误沿[共享协议](03_ddd_step_08_shared_protocol.md)。

| 协议 | 模块 / 原目标 | 既有port / current | future Step9 flow | 停审 |
|---|---|---|---|---|
| J01 DispatchQueuedDeliveryJob | U3/U5 intent/attempt/receipt/lane/known mapping | 原Installation/Config/Binding/Mapping/Presentation/Delivery/Lane/Platform/Private/Secret及mutation | DispatchQueuedDeliveryJob | pass_design_static_only |
| J02 ReconcileBridgeOperationJob | U5原recovery及affected original stage | 原Installation/Config/Secret/Binding/Mapping/Lane/Continuity/Recovery与原Inbound/Delivery/Callback/SafeTrace及mutation | ReconcileBridgeOperationJob | pass_design_static_only |
| J03 ReconcileStreamGapJob | U5原cursor/gap/epoch/range | 原Installation/Config/Secret/Continuity/AuthoritativeRecovery及mutation | ReconcileStreamGapJob | pass_design_static_only |
| J04 RetrySafeHandoffJob | U6原canonical/consumer op/handoff | 原Config/SafeObservation/SafeTrace及mutation | RetrySafeHandoffJob | pass_design_static_only |
| J05 RefreshBridgeQualificationJob | U1/U3/U4/U5/U6已有资格主语 | 原BridgeQualificationMaintenancePorts八repo/具名qualification及mutation | RefreshBridgeQualificationJob | pass_design_static_only |

```rust
/// 五J的规范化typed输入外层；不是任意客户端可调的新Job API。
pub struct BridgeJobRequest<T> {
    /// 当前local V1结构，与SDK job schema不混。
    version: BridgeProtocolVersion,
    /// 唯一原continuity，保operation/subject/trace/requested_at。
    metadata: JobContinuityMetadata,
    /// 本fixed J唯一safe typed body，不含runtime预算或authority。
    body: T,
}

/// 五原safe Job结果的有限包装，不创建run/report或GlobalSuccess。
pub enum BridgeJobOutcome {
    /// J01原intent/effect执行结果，accepted不等送达。
    Dispatch(DispatchJobResult),
    /// J02原op权威恢复结果，不重发。
    Recovery(RecoveryJobResult),
    /// J03原gap完整coverage结果，partial保gap。
    Gap(GapRecoveryJobResult),
    /// J04原canonical/op consumer结果，非evidence。
    Handoff(SafeHandoffJobResult),
    /// J05已有资格维护结果，不授新权。
    Qualification(QualificationJobResult),
}

/// 仅current允显的Job稳定输出，entry-local phase/unresolved不直接出wire。
pub struct BridgeJobResponse {
    /// 本次local协议版本。
    version: BridgeProtocolVersion,
    /// 原五result之一，完整summary保持不变。
    outcome: BridgeJobOutcome,
}
```

| 完整factory / 消费 | 中文Rustdoc |
|---|---|
| `BridgeJobRequest<T>::from_parts(version: BridgeProtocolVersion, metadata: JobContinuityMetadata, body: T) -> Result<Self, BridgeProtocolError>` | /// 完整接三字段，核V1/原metadata形状；本J body先所属factory，actual context/current不由本wrapper授予。 |
| `BridgeJobRequest<T>::into_parts(self) -> (BridgeProtocolVersion, JobContinuityMetadata, T)` | /// 原三字段交fixed mapper，不复制metadata/key到body。 |
| `BridgeJobOutcome::validate(self) -> Result<Self, ContractViolation>` | /// 穷尽核五原result allowed subject/stage/count及类型，不推成功。 |
| `BridgeJobResponse::from_result(version: BridgeProtocolVersion, outcome: BridgeJobOutcome) -> Result<Self, ContractViolation>` | /// 接纳current已过滤原结果，不凭错误制造summary或计数。 |
| `BridgeJobResponse::into_parts(self) -> (BridgeProtocolVersion, BridgeJobOutcome)` | /// 移交完整安全结果，不授owner/platform或读权限。 |

metadata exact `JobContinuityMetadata {operation: OriginalOperationRef,subject: JobSubjectRef,trace: TrustedTraceRef,requested_at: SafeInstant}`，唯一来自Application selection/原qualified operations provider；主体族必须same input，trace同实际TrustedJobContext，requested_at只调用窗口不入key。actual `TrustedJobContext {actor,scope,basis,trace}`、RuntimeAvailability、RuntimeExecutionBudget由已核host/原plan分离提供，不接受CLI/env/JSON自报。source/runtime未建立即不启动，SDK要求job_run_id的surface未绑定，不新建SDK facade/run或伪run receipt。

## 2. J01 DispatchQueuedDeliveryJob

| 项 | 完整合同 |
|---|---|
| trigger / fixed library surface | 原Application `select_dispatch_candidates` -> Jobs plan/dispatcher；或qualified operations provider给单个原plan -> `dispatch_queued_delivery` bin；非HTTP |
| handler / exact callable | `DispatchQueuedDeliveryJob::execute<'a>(&'a self, input: DispatchDeliveryJobInput, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, DispatchJobResult>` |
| request / response | `BridgeJobRequest<DispatchQueuedDeliveryJobRequest>` / BridgeJobResponse::Dispatch；实际Jobs返回原JobInvocationState |

```rust
/// J01单个原intent/effect，不接受all/broadcast/send payload。
pub struct DispatchQueuedDeliveryJobRequest {
    /// selection完整保留原intent与不可变effect关联。
    delivery: DeliveryIntentEffectRef,
}
```

| 完整factory / 消费 | 中文Rustdoc |
|---|---|
| `pub fn from_delivery(delivery: DeliveryIntentEffectRef) -> Result<Self, ContractViolation>` | /// 校原typed intent/effect结构，不生成new effect或send权限。 |
| `pub fn into_delivery(self) -> DeliveryIntentEffectRef` | /// 原关联交DispatchDeliveryJobInput.delivery，不只取intent ID后猜effect。 |

input完整三字段=actual plan/host.job、body.delivery、wrapper.metadata.continuity。actual完整Installation/Binding/Mapping/Delivery/Lane snapshot与source/projection/target/generation/action current重验，原intent/plan/operation/effect与continuity同源；phase与显示名不是资格。初建lane如需要，只原QualifiedLaneOrderScope、实际dependency、claim Missing/unresolved None、all rate_bounds/RetryBudget/rate_basis及技术ID/revision1构造`DispatchLane::for_scope`，缺正式资格不能造Ready。

DeliveryAttempt::claim_for七入参闭口：attempt ID=UoW；intent_effect=body经原完整行核验；claim_ref=actual LaneRepository fenced claim；qualification_ref/attempt_window=current DispatchEligibility及正式窗口；result_ref初始Missing；now actual UoW。原intent.claim、lane claim及attempt/dedup/audit/result同UoW actual commit先于任何PlatformDeliveryPort IO；stage或占租不等已commit。IO前再核所有current、PrivateMaterialPort完整private qualified payload、Config/SecretResolution exact purpose/provider/key/version/撤销和预算，最多一次method。

| actual platform result | 完整目标 / mandatory guard |
|---|---|
| KnownPlatformBusinessResult | `PlatformReceipt::from_known`八入参=receipt ID、原AttemptEffectRef、实际kind、actual verified locator Slot、正式authority、实际NoEffect Slot、finite reason、完整known结果；Unknown禁止receipt。create accepted要求locator，delete按method明确NotApplicable，不造message locator。 |
| accepted/rejected known | 原attempt/intent纯apply、actual receipt、lane原claim与known message mapping/墓碑、原dedup/result/audit在后续same-UoW finalize；create/edit/reply已知回链沿C03 LinkMessage guard，source/version/target/origin/current一致。delete不走link_known，墓碑须原owner change disposition及actual原mapping；缺依据仅保known receipt/原历史，不用平台结果自造owner disposition。不能把2xx视为所有动作accepted。 |
| Indeterminate / post-call cancel / response缺失 | 原attempt/effect/head保未知，不释放lane、不换target/effect/key；J02只权威只读恢复；NoEffect不能从timeout/NotFound推。 |
| NoIo / authoritative NoEffect（独立证明） | NoIoProofRef仅原attempt合法NotDispatched本地处置，不能替NoEffectBasisRef；same-effect RetryWait另须authoritative NoEffect及完整RetryEligibility、current/原plan/window/业务retry budget和全部等待下界；runtime预算不授业务retry。 |

顺序/限流：lane original head/dependency/fence；所有适用rate scope取**最大不早于下界**，并与retry policy backoff、source/attempt窗口交集。Slack method/workspace/app/channel；Mattermost server/method/resource；Telegram bot/global/chat/resource及retry_after；Discord bucket+major resource+global及Retry-After。跨lane共享bucket下界由LaneRepository同源原子合并，不能仅当前response bucket。response delay必须已核来源/单位/时钟，缺合同Blocked，不硬编码配额或用时间排序message。SDK隐藏重试关闭，或必须正式证明same-op且落同attempt/fence合同；产品不满足不可绑定。

业务变义（source/projection/target/method/generation）拒绝旧effect执行，不以retry再prepare；edit/delete/reply必须原mapping/parent且actual capability，不能自动send替edit或drop thread。附件与敏感Gate只原explicit外显/Artifact grant/window，安全降级禁止动作。结果仅原DispatchJobResult，同bounded scope安全stage/count，不声明送达/已读。

## 3. J02 ReconcileBridgeOperationJob

| 项 | 完整合同 |
|---|---|
| trigger / fixed library surface | `select_recovery_candidates`或qualified单原plan -> `reconcile_bridge_operation` bin / 原dispatcher |
| exact callable | `ReconcileBridgeOperationJob::execute<'a>(&'a self, input: ReconcileOperationJobInput, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, RecoveryJobResult>` |
| request / response | `BridgeJobRequest<ReconcileBridgeOperationJobRequest>` / BridgeJobResponse::Recovery |

```rust
/// J02必须保完整原recovery与业务subject，两者不能互推。
pub struct ReconcileBridgeOperationJobRequest {
    /// actual同selection行的原recovery identity。
    recovery: RecoveryRecordRef,
    /// 同record的原Inbound/Callback/Intent/Handoff主语。
    subject: OriginalRecoverableSubjectRef,
}
```

| 完整factory / 消费 | 中文Rustdoc |
|---|---|
| `pub fn from_parts(recovery: RecoveryRecordRef, subject: OriginalRecoverableSubjectRef) -> Result<Self, ContractViolation>` | /// 只Inbound/Callback/Intent/Handoff，Gap拒绝并归J03；完整校same namespace，真实原关联由repository核，不猜ID。 |
| `pub fn into_parts(self) -> (RecoveryRecordRef, OriginalRecoverableSubjectRef)` | /// 两字段原值移交ReconcileOperationJobInput，不换recovery/op。 |

input四字段=host.job、body两字段、原continuity。ContinuityRepository::get_recovery完整actual row，核subject/original op/effect/scope与selection一致；原RequestRecovery登记的recovery authorization只候选，AuthoritativeRecoveryPort当前qualify、正式source/readonly method/窗口/预算齐后才原record.begin_probe。missing原行或关联冲突不造新record、不换op。

OriginalRecoverableSubjectRef另有Gap，但RecoveryJobResult原allowlist只有上述四族；J02 body factory、fixed plan mapper及Application input admission都须在业务IO前拒绝Gap，不能靠view enum或共用subject类型扩大恢复入口。Gap的C06原请求仍合法，coverage执行只J03，不将Gap混入RecoveryJobResult或新建J02别名。

| 原probe族 | actual资格/结果 -> 完整local finalize |
|---|---|
| local mutation | LocalUnitOfWorkPort原commit权威查询，仅Committed/RolledBack/Indeterminate；known rollback仅证明local未提交，不推出owner/platform无效果。 |
| owner inbound/action | Conversation/OwnerAction正式same-op只读结果；Known Accepted/Rejected/Pending/Unknown各原stage；不再次append/approve。 |
| platform effect | same AttemptEffect/immutable target/source版本正式readonly probe；Config/SecretUsePurpose::AuthoritativeProbe及本call secret lease只该实际方法需要时使用；unsupported/NotFound/超时=>未知/manual，不send。 |
| consumer handoff | 原canonical/source/schema/op正式只读consumer结果，producer admission仍required；transport ACK不等NoEffect/Accepted。 |

known结果只原Inbound/Callback/Intent/Attempt/Receipt/Handoff/Dedup/result及Recovery pure finalize；需要known mapping/lane关联必须完整read/CAS/current；若current不允许回链，仅记录原known结果不建新授权mapping。RecoveryRecord.resolve只有FinalizeOnly(actual known)、GapCovered(full原range)或SameEffectRetryEligible(authoritative NoEffect+全部current/window/budget)可Resolved；Unknown/Unavailable/Unresolved不能Resolved。J02不执行后者retry效果，不重发、换op或清unknown；结果RecoveryJobResult只当前可见原subject/stage。

## 4. J03 ReconcileStreamGapJob

| 项 | 完整合同 |
|---|---|
| trigger / fixed library surface | `select_gap_candidates`或qualified原plan -> `reconcile_stream_gap` bin / 原dispatcher |
| exact callable | `ReconcileStreamGapJob::execute<'a>(&'a self, input: ReconcileGapJobInput, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, GapRecoveryJobResult>` |
| request / response | `BridgeJobRequest<ReconcileStreamGapJobRequest>` / BridgeJobResponse::Gap |

```rust
/// J03仅原gap的权威coverage恢复，不接受raw replay/cursor set。
pub struct ReconcileStreamGapJobRequest {
    /// actual原gap/range定位，不由CLI字符串生成。
    gap: GapRef,
}
```

| 完整factory / 消费 | 中文Rustdoc |
|---|---|
| `pub fn from_gap(gap: GapRef) -> Result<Self, ContractViolation>` | /// 核原typed gap结构，不能证明coverage或source window。 |
| `pub fn into_gap(self) -> GapRef` | /// 原定位交ReconcileGapJobInput，不推cursor identity。 |

input=actual job、body gap、原continuity。ContinuityRepository完整GapRecord/StreamCursor及原RecoveryRecord，核GapRecord.recovery_ref Established且同gap/原tracking op、qualified stream/epoch/range/window/comparator/claim版本；actual installation/source/read-only method与原RecoveryRecord.authorization_basis经AuthoritativeRecoveryPort::qualify取得原RecoveryQualificationRef后，GapRecord::begin_probe(recovery,qualification,actual local expected)才合法。缺原受权recovery关联或资格则Blocked/manual，不能由Gap ID/TrustedJobContext猜RecoveryAuthorizationRef或自建record；C06只负责显式申请。实际只读probe_gap仍原方法，凭据仅exact AuthoritativeProbe用途本call lease且该平台source正式需要时，其他local/owner/consumer probe None；secret不是恢复permission。

factory承接不是创建gap：原GapRecord字段rehydrate来源全部actual store/hydration；probe得AuthoritativeCoverageRef及原comparator/window/current条件，pure `GapRecord::close(coverage,local)`与`StreamCursor::advance(candidate,coverage,cursor_expected,local)`仅**full原range、same stream/epoch/stage/comparator**；cursor local revision与CursorRevision两轴独立，原compare_position证明方向，不以opaque lexicographic/时间/message ID决定。partial沿原retain_uncovered回Open，unknown/欠缺沿require_manual到Manual；cursor保原Incomparable/Blocked或已知原水位，GapState没有Partial。不得关闭gap或jump到最新epoch；owner stage覆盖不能推进Protocol/Delivery cursor。No item不等coverage，reconnect不清gap，无raw body补齐来源。

上述两个coverage参数**类型不同**：close只接原`AuthoritativeCoverageRef`；advance必须另有`ContinuityCoverageRef {stream,epoch,range,closed_gaps,basis}`，来自同stage完整committed事实、全部原gap权威覆盖、正式comparator/连续性依据，再核assert_candidate。单个gap完整覆盖或source ACK不能强转stage coverage；无后者时最多合法close该gap，保cursor原position，不调用advance。候选位置必须原AuthoritativeRecoveryPort::compare_position给ComparablePositionRef，不取opaque字符串自行比较。

actual cursor/gap/recovery/dedup/audit/result同UoW CAS；commit未知保原op/epoch/gap等待权威恢复。输出GapRecoveryJobResult只原Gap主语及获准阶段/count，不能以bounded Completed宣称全外部流无gap。

## 5. J04 RetrySafeHandoffJob

| 项 | 完整合同 |
|---|---|
| trigger / fixed library surface | `select_handoff_candidates`或qualified原plan -> `retry_safe_handoff` bin / 原dispatcher |
| exact callable | `RetrySafeHandoffJob::execute<'a>(&'a self, input: RetryHandoffJobInput, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, SafeHandoffJobResult>` |
| request / response | `BridgeJobRequest<RetrySafeHandoffJobRequest>` / BridgeJobResponse::Handoff |

```rust
/// J04仅原canonical/consumer op，不再建producer或新材料。
pub struct RetrySafeHandoffJobRequest {
    /// actual存在的原handoff定位。
    handoff: SafeHandoffRef,
}
```

| 完整factory / 消费 | 中文Rustdoc |
|---|---|
| `pub fn from_handoff(handoff: SafeHandoffRef) -> Result<Self, ContractViolation>` | /// 校原ref结构，不能授consumer准入或same-op重交权。 |
| `pub fn into_handoff(self) -> SafeHandoffRef` | /// 原值交RetryHandoffJobInput，不改canonical/source/op/schema。 |

input=actual job、body handoff、原continuity。SafeTraceRepository完整原handoff/audit/material/schema/admission/retention/result/claim/hydration；SafeObservationPort.qualify_handoff/current与formal readonly result重验。known consumer结果only local finalize；unknown没有权威NoEffect或正式同op幂等消费保证不能重交。原Blocked/Indeterminate如需resume_pending必须actual NoEffect+全部current/原canonical/预算/window，不能用NotFound/ACK/timeout。

begin_handoff原current/claim/local expected/actual now纯迁移，claim由原SafeTraceRepository reserve，原state/dedup/audit/result actual commit后才`SafeObservationPort::handoff(record,current,claim,committed,control)`。schema/material/event identity/source audit/consumer op不换，不从current truth重新生成canonical；unknown保original/claim，consumer Accepted只该阶段。当前Bridges producer compatibility仍blocked，不能创建O01空材料或fake consumer success；输出只原SafeHandoffJobResult。

## 6. J05 RefreshBridgeQualificationJob

| 项 | 完整合同 |
|---|---|
| trigger / fixed library surface | `select_qualification_candidates`或qualified原plan -> `refresh_bridge_qualification` bin / 原dispatcher |
| exact callable | `RefreshBridgeQualificationJob::execute<'a>(&'a self, input: RefreshQualificationJobInput, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, QualificationJobResult>` |
| request / response | `BridgeJobRequest<RefreshBridgeQualificationJobRequest>` / BridgeJobResponse::Qualification |

```rust
/// J05原既有subject条件维护，expected不可由当前行默换。
pub struct RefreshBridgeQualificationJobRequest {
    /// 原允许的既有资格主语，不能自建installation/relation。
    subject: BridgeViewSubjectRef,
    /// actual selection行的local CAS条件，入key与meaning。
    expected: ExpectedLocalRevision,
}
```

| 完整factory / 消费 | 中文Rustdoc |
|---|---|
| `pub fn from_parts(subject: BridgeViewSubjectRef, expected: ExpectedLocalRevision) -> Result<Self, ContractViolation>` | /// 核J05 maintenance allowlist和same主语local条件结构，不授新grant。 |
| `pub fn into_parts(self) -> (BridgeViewSubjectRef, ExpectedLocalRevision)` | /// 原两字段交RefreshQualificationJobInput，不换expected或key。 |

input=actual job、body subject/expected、原continuity。受权expiry repair后allowlist严格映射Step7 `BridgeQualificationSnapshot`十一variant，映到九种BridgeViewSubjectRef；只增加Dedup原保留资格维护，不因通用view enum支持某族就开放维护。`LocalUnitOfWorkPort::read_qualification_subject`与`list_eligible_qualification_subjects`只读actual完整snapshot/local revision/hydration，八repo负责具名关联的完整bounded读取及同UoW暂存；读取不齐/超预算暂停对应维护，不partial invalidate后假称完整。

| allowed body subject | exact原snapshot / current资格来源 | 必须守卫 |
|---|---|---|
| Installation | Installation(BridgeVersioned<BridgeInstallation>)；ConfigQualificationPort | 原config revision/source/installation同域；不启用未建立source或续期secret。 |
| Binding | Binding(BridgeVersioned<ExternalBinding>)；BindingQualificationPort | 显式relation/两端/generation/maintenance或revocation依据，不能新grant。 |
| Mapping::Identity | Identity(BridgeVersioned<ExternalIdentityMapping>)；BindingQualificationPort + ActorResponsibilityPort | 同relation/generation/两端及当前责任；external_id不建GlobalMember。 |
| Mapping::Location | Location(BridgeVersioned<ExternalLocationMapping>)；BindingQualificationPort | 同relation/generation/两端/能力；不remap旧effect。 |
| Mapping::Message | Message(BridgeVersioned<ExternalMessageMapping>)；BindingQualificationPort及原known结果依据 | 原source/version/target/origin/known receipt；unknown不补known或重发。 |
| Presentation | Presentation(BridgeVersioned<SafePresentationPlan>)；PresentationQualificationPort | 原projection/Gate/附件/target/digest/window；不重建内容或发送。 |
| Action | Action(BridgeVersioned<ExternalActionBinding>)；BindingQualificationPort + ActorResponsibilityPort + OwnerActionPort | 原source/action语义与current责任；不claim、审批或复活终态。 |
| Cursor | Cursor(BridgeVersioned<StreamCursor>)；ConfigQualificationPort及原qualified stream/comparator依据 | 同source/stream/epoch/stage/comparator；维护不凭时间推进coverage。 |
| Lane | Lane(BridgeVersioned<DispatchLane>)；ConfigQualificationPort及原dispatch/rate依据 | 原head/fence/all shared bounds；不因维护释放unknown head或授retry。 |
| Handoff | Handoff(BridgeVersioned<SafeHandoffRecord>)；SafeObservationPort | 原canonical/source/schema/consumer admission/retention；不新producer或交接。 |
| Dedup | Dedup(BridgeVersioned<DedupRecord>)；ConfigQualificationPort.qualify_dedup_expiry | 原六namespace/key/meaning/op/window及input expected，实际批准maintenance/current proof；只expire保tombstone/result/unknown，不删键重执行。 |

Operation、Inbound、Intent、Attempt、Receipt、Callback、Gap、Recovery、Audit均不在此snapshot联合；wrapper factory和Application入口对这些subject返回有限InvalidInput，零维护/IO。Gap/Recovery由J03/J02处理，不能借J05通用refresh清未知。Dedup.expire不属于业务恢复，原unknown责任保留；allowed结构不授资格，各current需求仍原正式port，缺其exact合同Blocked，不由以上表虚构foreign API。J05的Job dedup与被维护目标Dedup是不同namespace/key，须分别CAS；禁止将自身新reservation到期，结果subjects仍空、只可见maintenance_subjects。

只原Domain合法record_qualification、expiry/revoke/invalidate/block/maintenance及受影响mapping/plan/action/lane/cursor纯变更；原config/generation/source/window与local条件各自守卫，必要new资格来自正式owner/current，不由job生成授权。Revoked/Expired/Retired/Tombstoned等终态不复活，new config不覆历史effect，无send/approve/probe修truth。维护资格缺失按有限Blocked/Unavailable，不能“刷新成功”续期secret或owner授权。

顺序：same typed subject+expected+trusted scope推原key，先查原dedup/result；同expected duplicate复用原result，即使当前row已新版本也不默换expected/key再执行；没有原result才校actual expected=current row，冲突零覆盖。成功pure candidates按同UoW CAS/audit/result/required observation原合同实际提交；output QualificationJobResult.subjects必须空，可见已有subject仅maintenance_subjects，hidden计数None，不伪recoverable/run/report。

## 7. 幂等recipe、完整plan/phase与错误

| J | invoke typed key/meaning输入（均actual受权） | 不得替代 |
|---|---|---|
| J01 | 原IntentEffect + trusted maintenance scope/namespace + fixed Dispatch recipe；semantic完整原intent/source/target/kind/effect/条件 | attempt/new trace/event ID/now不生成第二逻辑effect；按原result优先。 |
| J02 | 原RecoveryRecord + 原subject/op/effect + trusted scope + fixed ReconcileOperation recipe | subject不能漏recovery；record ID不等operation/结果NoEffect。 |
| J03 | 原gap/range/stream/epoch/op + trusted scope + fixed ReconcileGap recipe | timestamp/message ID/poll offset不替comparator/coverage/epoch。 |
| J04 | 原handoff/canonical/schema/consumer op + trusted scope + fixed SafeHandoff recipe | ACK/local commit不替consumer结果，重试不换材料/producer。 |
| J05 | 原typed subject + **原expected** + trusted scope + fixed Qualification recipe | 当前新revision、资格续期时刻、requested_at不替旧expected或生成second run。 |

QualifiedIdempotencyKey/BodyFreeOperationMeaningRef由原LocalUnitOfWorkPort按已核recipe生成，schema/authority kind/scope/version合同仍须current成立；所有typedstable字段比较原factory/semantic ref，不做JSON/hash正文identity。selection先重读原dedup/result；确认无已存在原operation才Application可分配fresh**未执行**local operation，不是run/effect；invoke再重推key并以actual committed winner为准，不执行第二effect。

| 原entry carrier / 完整字段 | 唯一来源 / 转换规则 |
|---|---|
| JobInvocationPlan：kind、subject、context、continuity、availability、budget | Application selection完整主语/原continuity + actual operations host context/runtime；kind由固定J决定，Jobs assembler零IO。J02 subject为Operation {recovery,subject}，J05为Qualification {subject,expected}，J01 Delivery保effect，其他Gap/Handoff原ref。 |
| 五Contracts Request / BridgeJobRequest | plan的typedsubject/原continuity作临时规范化转换，逐字段原值保留，不持久化第二plan；Jobs dispatcher仍接唯一原plan，不增加第二入口。 |
| input | 本节body全部字段+原metadata连续性+actual job context -> Step7 exact五input factory；无需Jobs/Contracts读repo补失字段。 |
| JobInvocationState：plan、phase、result、unresolved | plan原owned值；初态Pending/None；actual dispatch后Dispatched；actual filtered result与unresolved并集后CompletedLocal或Indeterminate；取消CancelledLocal保原in-flight identity。 |
| WorkerSchedulingBatch | 原returned plan必须与in_flight typed subject/op一致；summary原值加入returned，unresolved并集合并；无result/unknown/取消不得记录CompletedLocal假返回。 |

| 失败 / 取消 | 有限结果及责任 |
|---|---|
| pre-dispatch shape/version/context/runtime/source失败 | ProtocolError或原finite entry failure，零业务IO/record，不造summary count或run/report。 |
| current/retry/rate/window/secret/source合同缺失 | 有actual bounded summary时仅原JobResultDisposition::Blocked及安全reason；无summary时原BridgePortError::Unavailable/Denied等finite错误。没有JobResultDisposition::Unavailable，隐藏scope/ref/count不出，不按bool自动retry。 |
| Conflict / original result已有 | current可见才有限冲突或原JobResultDisposition::Duplicate；以原subject/op/effect为准，不替candidate operation或expected继续效果；OriginalReused是Command词汇，不移植到Job enum。 |
| post-effect local/foreign unknown、cancel/timeout | BridgePortError::Indeterminate带完整original/phase；原Jobs state/unresolved保留，只有actual原result可出safe summary；不用error制造response/view。 |
| raw error/panic | 不转成success或fake test report；host故障边界保原已移交identity，日志finite stage/reason，无raw payload/token/stack。 |

## 8. 输出字段级schema与report非适用

五原result均`<Name>(SafeJobResultSummary)` newtype，only本J allowed subject/stage/count，factory原`from_summary`；BridgeJobOutcome只是finite transport包装，无第二业务结果。safe summary唯一Step6 `jobs.rs`，完整字段如下。

规范化response mapper在实际JobInvocationDispatcher返回后核原plan.kind/subject，穷尽J01->Dispatch、J02->Recovery、J03->Gap、J04->Handoff、J05->Qualification；只有actual current过滤后的原summary/result可进该variant。BridgeJobOutcome::validate及response factory只校自身结构，不接plan参数，不能自证请求/结果匹配。CancelledLocal/Indeterminate且无原summary保entry-local原phase/unresolved并给有限失败，不制造response/result；复用只原stored结果/原op，允许的Duplicate呈现不覆盖immutable原记录。

| exact字段 | type / 来源 / 限制 |
|---|---|
| disposition | JobResultDisposition；exact Completed/Partial/Blocked/Indeterminate/Duplicate/Cancelled，按actual bounded结果，不外部全局成功；Rejected/Unavailable归finite错误而非新增enum标签。 |
| subjects | Vec<OriginalRecoverableSubjectRef>；actual允许的本J原主语，current读过滤；J05为空，不造subject。 |
| maintenance_subjects | Vec<BridgeViewSubjectRef>；同次当前可见已有维护主语，特别J05保原subject族。 |
| counts | Option<QualifiedJobCounts>；未准披露None，不填0；Some exact `{selected:u32,processed:u32,remaining:u32,basis:AuthorizedReadScopeRef}`，processed+remaining=selected（checked），仅本bounded已获准集合。 |
| stages | SafeStageSlice；actual local/ACK/owner/platform/consumer/Business stage按current披露交集，schema沿Query附录，不合GlobalSuccess。 |
| reason | SafeReasonCode；actual有限安全原因，无raw错误/正文/审批。 |

`JobResultDisposition`、SafeStageSlice及ref所有secondary schema唯一沿Step6。JobInvocationState/phase不是public report；没有run ID、report ID、artifact/evidence、平台投递成功列表或自动acceptance字段。current不可见不输出旧ref或hidden count；phase CompletedLocal只是本调用返回。

## 9. J复杂度、草稿与停审

八新声明=五独立Request+一个metadata wrapper+有限五result联合+response；业务input不添key/预算/context，保持原五callable/五selector/五bin、20协议/19入口。plan/current/factory、same-op/expected、rate/retry/NoIo-NoEffect、secret短借和所有safe结果完整闭口。future正式03§7承接五独立协议与此map，完整处理顺序待Step9，不提前创建。

J组回读发现初稿误用Command结果词汇、J05误纳Gap/Recovery；当步已归回六个exact原Job标签与十snapshot/eight subject-kind映射，前序不改。完整plan/input/source/result/entry phase/unresolved、J02 record+subject、J05 expected/allowlist、Contracts方向及no-run/no-report在实际静态审计后登记，不预填pass。计划测试沿Step4已有`crates/contracts/tests/protocol_surface_tests.rs`、`crates/jobs/tests/job_invocation_tests.rs`及Application continuity/authorization、Infra平台/secret/store、Worker shutdown目标：25种wrong kind/subject、元数据与主语不符、concurrent winner、J05重复旧expected及unsupported subject、all bounds最大下界、claim commit unknown零send、SDK隐藏retry、NoIo/NoEffect区别、partial gap、consumer ACK lost、mandatory缺口与raw泄漏。全部planned，未执行。

实际组内审计：九文档90表/56围栏行/12本地相对链接，结构错误0；双围栏Rust声明扫描606唯一定义=前序559+当步47，重复/当步字段类型缺失0。五J完整input字段及execute签名、六原Job标签、十原snapshot、两个显式测试路径逐项对照通过，errors=[]；git diff-check通过。人工factory/current/phase/unresolved、资格与IO分离、全rate下界及safe输出审查pass。首个只识别backtick的声明脚本统计511只是限定扫描，补tilde后实际重跑为606，不冒充compiler/borrow检查。J组停审，只开放X跨协议审计及必要当步纠正。
