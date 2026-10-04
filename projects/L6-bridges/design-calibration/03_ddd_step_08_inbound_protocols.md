# L6-bridges 03 Step8：Inbound consumer协议

## 1. E0共享范围与批次

主文件E0问题/诊断/取舍已done。只原四E；E01含原Protocol source-loss分支，不增第五consumer。新schema唯一计划归属`crates/contracts/src/consumers.rs`，metadata/ref/result唯一复用Step6；codec及finite ProtocolError沿[共享协议](03_ddd_step_08_shared_protocol.md)。E01/E03 raw只能在实际owning private lease活着的当前call内验源/转换，normalized安全schema不新增可直调入口。

| 批次 / 协议 | 模块 / 目标 | 既有port | future Step9 flow | 停审 |
|---|---|---|---|---|
| E0 shared | Contracts / safe envelope与receipt | 无新port；原host验证、原result mapper | 不单开flow | pass |
| E1 / E01 PlatformInputReceivedConsumer | U2 inbound / 原U5 continuity | 原Installation/Binding/Mapping/Actor/PlatformIngress/ConversationHandoff/Inbound/PrivateMaterial/Config/Secret及mutation/ACK | PlatformInputReceivedConsumer | pass |
| E1 / E03 PlatformCallbackReceivedConsumer | U4 action/callback | 原Installation/Binding/Mapping/Delivery/CallbackVerification/Actor/OwnerAction/Callback/Config/Secret及mutation/ACK | PlatformCallbackReceivedConsumer | pass |
| E2 / E02 CommittedSourceAvailableConsumer | U3 plan/intent | 原C04同prepare依赖 | CommittedSourceAvailableConsumer | pass |
| E2 / E04 SafeHandoffDispositionConsumer | U6原handoff | SafeObservationPort、SafeTraceRepository及mutation | SafeHandoffDispositionConsumer | pass |

## 2. 共享envelope、identity与receipt schema

```rust
/// 正式来源envelope pointer，不是event、record、payload或operation identity。
pub struct BridgeConsumerEnvelopeRef(SafeOpaqueId);

/// 四固定consumer的body-free规范化运输结构，不是来源验证证明。
pub struct BridgeInboundEventEnvelope<T> {
    /// Bridges本地schema版本，不等平台API或producer schema。
    version: BridgeProtocolVersion,
    /// exact正式envelope pointer，不从正文或本地随机ID替代。
    envelope_ref: BridgeConsumerEnvelopeRef,
    /// 原四字段metadata；event_id/source/scope/trace不可丢失。
    metadata: SafeEventMetadata,
    /// 正式source recipe的候选幂等身份，重验后才能qualification。
    event_key: SafeOpaqueId,
    /// 本固定surface唯一typed safe payload。
    payload: T,
}

/// 四原稳定result的有限包装，不复制或合并其独立阶段。
pub enum BridgeConsumerOutcome {
    /// E01原结果含独立ACK/local/owner。
    Inbound(InboundConsumeResult),
    /// E02原结果只准备原effect，不代表send。
    Source(SourceConsumeResult),
    /// E03原结果含一次claim/ACK/local/owner。
    Callback(CallbackConsumeResult),
    /// E04原consumer处置与local结果，非evidence。
    Handoff(HandoffConsumeResult),
}

/// 仅合资格内部调用方可读的安全消费receipt，无第二receipt ID或success字段。
pub struct BridgeConsumerReceipt {
    /// 本次固定协议版本。
    version: BridgeProtocolVersion,
    /// source未验证或不准披露时None，不回显candidate ref。
    envelope_ref: Option<BridgeConsumerEnvelopeRef>,
    /// 与envelope_ref同时Some或同时None，只有actual verified origin可回关联。
    event_id: Option<SafeOpaqueId>,
    /// 穷尽原四result，不向平台序列化内部owner refs。
    outcome: BridgeConsumerOutcome,
}
```

| 完整factory / 消费签名 | 中文Rustdoc / guard |
|---|---|
| `BridgeConsumerEnvelopeRef::from_source(reference: SafeOpaqueId) -> Result<Self, ContractViolation>` | /// 校source-defined有界body-free pointer结构；来源proof仍须actual注册/decoder核验，零IO。 |
| `BridgeConsumerEnvelopeRef::as_id(&self) -> &SafeOpaqueId` | /// 只借原pointer，不推event/source/record或scope。 |
| `BridgeInboundEventEnvelope<T>::from_parts(version: BridgeProtocolVersion, envelope_ref: BridgeConsumerEnvelopeRef, metadata: SafeEventMetadata, event_key: SafeOpaqueId, payload: T) -> Result<Self, BridgeProtocolError>` | /// 完整接五字段且核V1/metadata形状；T必须经所属factory；不授current source/消费资格。 |
| `BridgeInboundEventEnvelope<T>::into_parts(self) -> (BridgeProtocolVersion, BridgeConsumerEnvelopeRef, SafeEventMetadata, SafeOpaqueId, T)` | /// 一次性移交原五字段到对应正式host mapper，不能交换surface。 |
| `BridgeConsumerOutcome::validate(self) -> Result<Self, ContractViolation>` | /// 穷尽核原result结构/optional/各stage，不从ACK补结果。 |
| `BridgeConsumerReceipt::from_result(version: BridgeProtocolVersion, envelope_ref: Option<BridgeConsumerEnvelopeRef>, event_id: Option<SafeOpaqueId>, outcome: BridgeConsumerOutcome) -> Result<Self, ContractViolation>` | /// 核ref/event_id成对及outcome原结构，完整接纳已过滤原结果；没有surface参数，不自证fixed route/source/result匹配。 |
| `BridgeConsumerReceipt::into_parts(self) -> (BridgeProtocolVersion, Option<BridgeConsumerEnvelopeRef>, Option<SafeOpaqueId>, BridgeConsumerOutcome)` | /// 移交完整安全receipt，仅内部qualified consumer可读。 |

generic envelope没有public free-form dispatch，只允许本附录四具名实例；source/topic/alias不匹配在任何业务接管前拒绝。source_id/producer schema版本来自正式binding，body内容与metadata符合也不证明准入。receipt factory只校shape，actual source验证及current读资格由host/Application决定；无ref getter绕过current披露。

fixed host mapper必须穷尽E01->Inbound、E02->Source、E03->Callback、E04->Handoff，并与该call已验证envelope ref/event_id/current disclosure核对后才调receipt factory；错pair有限WrongSurface、零额外业务IO。factory不凭版本或enum variant猜调用入口，也不把未verified关联回显；这不是新dispatcher/API/authority参数。

| 字段轴 | 唯一来源 / 去向 | 缺失行为 |
|---|---|---|
| envelope_ref | 正式producer envelope pointer；平台normalized场景为已核source给出的原envelope identity，不能伪造 | 未验证不输出；如平台mode没有可映射pointer则该normalized包装不可建立，原private入口仍按实际有限失败/结果，不造pointer。 |
| metadata.event_id | 正式source event identity，按source recipe重验 | 缺失不以requested_at/trace/body hash补，接管前reject/缺合同blocked。 |
| metadata.source / scope | actual registered source/version及scope，与TrustedConsumerContext同源 | 跨source/schema/scope拒绝；schema proof不从opaque值格式获得。 |
| metadata.trace | 实际trusted trace关联 | 不入meaning/key，不授participant/owner/外显权；来源未立则不可假造。 |
| event_key | E01/E03 actual lease候选、Continuity原notice、E02/E04正式producer recipe | 与verified recipe逐项一致才qualified；不是event_id自动复制或新local op。 |
| payload | 所属safe DTO，不含raw/body/token/private URL/审批选择 | unknown/duplicate字段/tag、错source、forbidden材料在dispatch前有限拒绝。 |
| outcome内operation/local_commit/result Slot | actual原reservation/UoW/owner/platform/consumer结果 | None不是成功或NoEffect；平台ACK不补owner Slot，不能新造result ID。 |

## 3. actor、disposition与安全失败

actual `TrustedConsumerContext {actor,scope,source,trace}`仅由qualified source host移交；source technical actor与外部mapped human/Integration/AI是两条不同责任链。E01 AppendFact正式Integration例外仅该target模式，不放宽active/source isolation、participant适用性、required digest、Policy/Gate或visibility；ManifestExternalFact仍按正式owner合同。E03 external actor必须已建立account责任与target/action/source条件，验签不替代owner权限。E02/E04只正式producer/consumer来源，不按Bot/OAuth身份生成GlobalMember。

| exact ConsumeDisposition | receipt / marker规则 |
|---|---|
| AcceptedLocal | 只actual本地接管，原result逐栏说明owner/ACK/local/consumer；local Unknown不能冒充已提交。 |
| Duplicate | 原same-key/same-meaning result及original复用；current允显才出ref；不重新解释raw或执行第二效果。 |
| Blocked | 正式必要资格/材料/source未成立；finite reason；无任意raw记录/自动重试。 |
| Rejected | 安全明确拒绝；未接管operation=None，未经source验证ref/event_id=None。 |
| Quarantined | 有限安全原因与已允许原关联；仅actual安全接管时可保local安全record，绝无raw inbox/dead-letter/正文hash。 |
| Indeterminate | 保原op及实际phase/result Slot，unknown由原subject恢复；不换key或推NoEffect。 |
| UnsupportedVersion | bridge或source schema不支持，禁止payload fallback，不能AcceptedLocal。 |
| delayed / no-op | 当前没有新增持久化Delayed/NoOp marker；暂缓按原Blocked/等待stage与finite reason，重复无效果是Duplicate；明确回环拒绝，不以“no-op成功”绕过验源。 |

结构缺失/unsupported/forbidden先有限ProtocolError；可定位且实际可信源分支由原Application产生所属result，不用generic decoder写quarantine/audit/dedup。actual ACK必须qualified driver执行，safe transport ACK与platform ACK各自沿原callback；receipt不能把planned ACK写Sent。发生owner/平台/local IO后取消或错误保original/phase，外层未知不能清除原恢复责任。

## 4. E0复杂度、草稿与停审

四共享声明只包装原metadata/result，未增加consumer、authority、业务对象、receipt truth或一般payload接口。所有factory有完整输入/消费面，结果有限各族不混；E01/E03安全schema只能验证后产生，E02/E04 source registration还待正式核验。future正式03§7 shared consumer段承接上述结构，不装配过程记录。

人工检查方向、actor双链、四result/no raw、identity轴和缺失规则pass；静态审计后才开放E1。计划测试沿protocol_surface/consumer各原target：source/schema/scope混用、event/ref/key轴互换、receipt成对关联、unknown/duplicate字段、未验源零record、quarantine无raw、ACK独立、duplicate current隐藏；全部planned，未运行。

E0静态停审pass：七文档52表/34围栏行，结构错误0、diff-check通过；只开放E1。

## 5. E01 PlatformInputReceivedConsumer

| 项 | 完整合同 |
|---|---|
| logical event / publisher | `bridge.v1.platform-input-received` / actual registered四平台source host，仅logical label，不声称外部原event名或topic已建 |
| subscriber / transport | 原PlatformInputReceivedConsumer；HTTP private lease或resident host private lease；source-loss同原consumer Continuity分支，无第三safe-message直调入口 |
| exact callable | `consume<'a>(&'a self, input: PlatformInputReceivedInput<'a>, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, InboundConsumeResult>` |
| result / receipt | 原InboundConsumeResult；仅qualified内部结果可包装BridgeConsumerOutcome::Inbound；外部只实际ProtocolAckPlan/Execution，不序列化内部receipt |

```rust
/// E01原Protocol stream缺口数据，不引用Application notice或伪coverage。
pub struct InboundContinuityPayload {
    /// 原installation/family/source/Protocol stream定位。
    stream: CursorNamespaceStream,
    /// actual原epoch，不由reconnect时间生成。
    previous: QualifiedStreamEpoch,
    /// actual新epoch或明确缺口，不默认续接。
    next: QualificationSlot<QualifiedStreamEpoch>,
    /// 正式可比range或Unknown，不能用0/时间补界。
    range: GapRangeBounds,
    /// 正式有限断连/换epoch原因。
    reason: SafeGapReason,
    /// actual host材料来源依据候选，仍须port重验。
    basis: SafeAuthorityRef,
}

/// 原E01两分支的验证后safe规范化数据，不能从客户端自报消费。
pub enum InboundSafePayload {
    /// 原private来源验真形成完整八字段context，不代表owner获准。
    Message(QualifiedIngressContext),
    /// actual host的原Protocol source loss，零message/owner/ACK。
    Continuity(InboundContinuityPayload),
}

/// HLD deferred body完整闭口；只原E01验证链内部消费。
pub type InboundSafeEnvelope = BridgeInboundEventEnvelope<InboundSafePayload>;
```

| 完整factory / 消费 | 中文Rustdoc |
|---|---|
| `InboundContinuityPayload::from_parts(stream: CursorNamespaceStream, previous: QualifiedStreamEpoch, next: QualificationSlot<QualifiedStreamEpoch>, range: GapRangeBounds, reason: SafeGapReason, basis: SafeAuthorityRef) -> Result<Self, ContractViolation>` | /// 核Protocol stream/epoch/source/range完整结构，保Unknown，不能授写或coverage资格。 |
| `InboundContinuityPayload::into_parts(self) -> (CursorNamespaceStream, QualifiedStreamEpoch, QualificationSlot<QualifiedStreamEpoch>, GapRangeBounds, SafeGapReason, SafeAuthorityRef)` | /// 原六字段加envelope原event_key显式映射Application notice七字段，不替换任何轴。 |
| `InboundSafePayload::validate(self) -> Result<Self, ContractViolation>` | /// 穷尽Message/Continuity，核原context或纯safe payload，零IO，不授owner权。 |

Message payload唯一`QualifiedIngressContext { namespace,source,account,message,change,origin,material_source,ack }`，完整schema/factory已见Step6§17：PlatformIngressPort.verify从同call private lease、完整安装/current source/capability/适用secret得出；safe metadata/event key/envelope ref只有正式source recipe可提供，缺pointer不可制造normalized envelope。实际input仍`consumer + Private(candidate_event_key,lease.borrow_context())`，**不从safe payload重新造private或绕过verify**。SafeEnvelope是验证后字段传递/设计序列化契约，不新建API。

| 字段 / 动作 | 来源 -> Step6对象 / Step7调用 | 缺失 / 禁止 |
|---|---|---|
| source/namespace/account/message/change/origin/material_source/ack | actual平台verifier -> 原QualifiedIngressContext，之后正式mapping/actor/target/material资格重验 | 无platform truth所有权；body-free ref缺失保Missing，不存正文做replay fallback；ACK只计划。 |
| initial InboundHandoffRecord::from_verified十二入参 | record ID/op=UoW/dedup reservation；verified_source/origin/source Slot=verifier；mapping/mode/actor/material/digest Slots=actual正式资格或Missing；protocol_disposition=actual ACK或NotSent；owner_result初始Missing | source未验真零记录；Verified不等可owner handoff。缺actor/mode/digest/material/current不可begin_handoff。 |
| owner required资格 | Binding/Mapping原完整两端/generation/action；ActorResponsibility；ConversationHandoff target模式；PrivateMaterial合格source/material/required digest/附件 | AppendFact仅正式Integration/BridgeMapped/required digest；ManifestExternalFact仅原ref模式；未选Workspace不加默认依赖，选用required则正式read/export/provenance欠缺阻对应分支。 |
| begin_handoff | 原HandoffClaimRef/current binding/current material、same-op recovery/no-effect条件、actual expected/local now | durable原record/claim/dedup/audit/result实际commit先于owner IO；owner返原result，不能自造Turn。 |
| edit/delete/reply | actual change+原message mapping/source版本/current generation/parent | 缺原mapping隔离/blocked，不降为create；late create不复活tombstone；delete只正式owner disposition，保locator/result，不能直接删Conversation。 |
| attachments | actual平台file引用 -> Artifact准入/授权material/ref/grant及必要window | raw file URL/token/bytes只qualified private material seam；未建合同不下载/公开、不持久化附件正文。 |
| Continuity六字段+envelope.event_key | actual source host -> 原BridgeSourceContinuityNotice七字段 -> qualify_continuity_notice | only Protocol；source/epoch/recipe/current读资格齐备才原Cursor/Gap安全mutation；不建Inbound record/owner/ACK，不advance/close gap。 |

Continuity的Cursor/Gap初建完整字段来自原qualified stream/current read、actual previous/next/comparator/range与source window（缺则Slot Missing）、UoW ID；既有完整row来自ContinuityRepository。无comparator不能填range，unknown/incomparable按原Domain状态；ACK=NotSent、owner Slot=Missing，返回实际local result，commit未知保原Disconnected/unknown。不得用通知已发/再次连接证明coverage。

| 原pure factory / transition | exact必填来源及分支 |
|---|---|
| StreamCursor::initialize八参 | cursor_ref=actual UoW ID；namespace_stream/epoch=已核notice.stream/previous；position=Uninitialized；comparator_ref=actual正式同stream comparator或Missing；coverage_ref=Missing；CursorRevision=1；now=UoW。Absent与local1固定，Missing comparator只Incomparable，不造Ready/coverage。 |
| QualifiedGapRangeRef::from_parts四参 | stream/epoch=原cursor与已核notice；bounds=notice.range原Known/Unknown；basis必须formal source核准的exact QualifiedGapRangeRef kind/scope/source/window依据，不能把任意notice.basis改kind。缺依据无gap record，host保Disconnected/有限Blocked。 |
| GapRecord::detect八参 | gap_ref=UoW ID；cursor_ref=同cursor；operation_ref=实际本地tracking reservation；range_ref=上行qualified原range；reason=notice.reason；coverage_ref=Missing；recovery_ref=Missing，或真实same-gap原受权关联；window_basis=正式原source RecoveryWindow或Missing。Open/local1，window Missing不授probe。 |
| existing cursor mark_incomparable | 只next Established且同stream、formal epoch change成立时，以actual previous/next/reason构造原StreamEpochChangeRef并调用mark_incomparable(change,local)。next Missing/Stale不能造new epoch；无正式maintenance依据也不调用lose_comparator/block，而是保原cursor/position与获准Open gap、host Disconnected，由current/source与gap guard继续阻推进。 |

以上只是输入到原对象的必填/shape/资格闭环，不执行处理流或创建新port。初建cursor/gap与原dedup/audit/result必须原同UoW actual commit；任何current/read/authority kind不符零自签资格、零unknown范围补值。

dedup：namespace包含installation+source family+schema/stage，actual recipe event key重验后qualify；同key比较message/change/source版本/origin及原meaning，不用raw/hash/时间。source replay只原source window、same-op与权威no-effect/current资格齐；若材料不能正式再取，只blocked/manual，不缓存raw。回环核verified origin+原effect/source，不按bot_id一刀排除普通bot。

受权R3闭口：Continuity使用Step6 `ContinuityNoticeMeaning`七字段，与envelope.event_key和payload六字段一一映射；Inbound namespace下注册独立`continuity_notice.v1` recipe，不能与Message recipe互换。qualify_continuity_notice返回notice/read/comparator/range/epoch_change/window六字段，正式Established才能推进相应cursor/gap；缺range无gap、next Missing无epoch change；不授owner/probe/coverage。Private Message验源后缺正式mapping或safe source/version时明确零durable拒绝：不分配record/op、不reserve dedup、不写audit/result/Quarantined行，宿主保原ACK/隔离责任。原actual meaning/result可受权复用，禁止latest mapping/dummy source/body hash替代。此carve-out是当前完整拒绝合同，不承诺持久化所有外部坏输入。

## 6. E03 PlatformCallbackReceivedConsumer

| 项 | 完整合同 |
|---|---|
| logical event / publisher | `bridge.v1.platform-callback-received` / actual qualified平台注册交互source |
| subscriber / transport | 原PlatformCallbackReceivedConsumer；callback owning private lease，HTTP或正式resident source；token/choice只当call短借 |
| exact callable | `consume<'a>(&'a self, input: PlatformCallbackReceivedInput<'a>, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, CallbackConsumeResult>` |
| result / receipt | 原CallbackConsumeResult -> 内部BridgeConsumerOutcome::Callback；外部只实际ACK，无审批/owner/claim细节 |

```rust
/// 原callback完成来源/责任/owner语义资格后的safe数据，无raw choice或token。
pub struct CallbackSafePayload {
    /// 原六字段qualified context，factory不替actual验证/授权链。
    context: QualifiedCallbackContext,
}
/// HLD deferred callback envelope完整闭口，不新增已验证客户端入口。
pub type CallbackSafeEnvelope = BridgeInboundEventEnvelope<CallbackSafePayload>;
```

| 完整factory / 消费 | 中文Rustdoc |
|---|---|
| `CallbackSafePayload::from_context(context: QualifiedCallbackContext) -> Result<Self, ContractViolation>` | /// 接纳完整safe context并核形状，不授action/one-use或owner执行权。 |
| `CallbackSafePayload::into_context(self) -> QualifiedCallbackContext` | /// 原context移交验证链内部，不重造PrivateCallbackContext。 |

context唯一完整字段`namespace,verification,action_binding,source_intent,current,ack`；对应Step6 factory。actual input仍`consumer,candidate_event_key,lease.borrow_context()`三字段。CallbackVerificationPort.verify_source先source-only结果；完整原action/known source/target/current owner读取，ActorResponsibilityPort和OwnerActionPort核raw semantic choice（当前call，绝无durable/log），最后qualify_complete_callback形成真实verification/current/context，不准只凭签名返回QualifiedCallbackContext。

| factory / transition | 全部必填来源 | 缺失行为 / 边界 |
|---|---|---|
| CallbackHandoffRecord::from_verified九入参 | callback ID/op=原dedup/UoW；action/verification/owner_action三Slot由actual完整qualified context必须Established；one_use/owner_result初始Missing；ACK=actual或NotSent；current=原context。 | 来源/语义未齐不能创建Verified record。 |
| ExternalActionBinding::claim_once / CallbackHandoffRecord::begin_handoff | 原action/source/message/account/actor/target/action kind/owner revision/generation/expiry/one-use/授权全部current一致；OneUseClaimRef由CallbackRepository actual reserve，同op/callback/action CAS及dedup/audit/result实际commit后owner IO | 两回调并发只原claim winner；duplicate复用原result，不重新consume choice/重签op；claimed未知保original，不能释放再执行。 |
| owner结果finalize | actual same-op OwnerActionResultRef -> 原callback apply_owner_result、dedup/result/audit；owner二次核Policy/Gate | ACK不生成Decision/审批；callback token有效不授owner权限；timeout/取消后Indeterminate原op，J02只只读probe/finalize。 |

按原source recipe key去重，meaning含原action/source/message/account/target/action/owner-state/generation/expiry与正式semantic依据ref；敏感choice、token、正文以及其hash/base64不能入key/meaning/log/evidence。source signature验证仍按正式协议需要进行；验证失败zero record/one-use，finite拒绝。按钮必须explicit动作/披露授权，安全降级内容不能保可执行审批。

## 7. 四平台private source、ACK与双向差异

资料沿00平台核验PS-01~14与Step7 Infra§2；本次只是合同反查，不冒称新增官方全文/实例测试。PS-07 Telegram官网仍unavailable，PS-08/09仅selected source读过；当前四平台SDK/API/安装/OAuth/API Key/KMS/router/source-mode/pin/scopes/probe均未核定/未建立。

| 平台 / fixed planned HTTP route | verify / complete locator / callback | ACK与变化差异 / 恢复约束 |
|---|---|---|
| Slack：`POST /bridges/v1/platform/slack/events`；`POST /bridges/v1/platform/slack/interactions` | raw签名/接收timestamp/current安装team-enterprise-app；Socket envelope/session mode另由registered host；account typed user/bot/app，channel，message ts，explicit thread_ts/root；interaction原message/action/user与owner完整资格 | Events HTTP deadline沿正式source规范，Socket actual envelope ACK；url-verification/challenge只private协议响应，不建message record。subtype的edit/delete/reply不可guess；method/workspace/channel多scope rate下界；ts/event_id不当global cursor，history不保证coverage。 |
| Mattermost：`POST /bridges/v1/platform/mattermost/events`；`POST /bridges/v1/platform/mattermost/interactions` | 只部署已注册trusted integration/plugin source或resident WS；incoming webhook只是出站注入不能冒充event。server+install+team/channel/user/bot/post id/root_id；interaction context/nonce/account/source逐核 | 正式server/plugin版本/来源认证/期限合同缺则blocked；原post update/delete、root_id父级差异；PAT只是secret用途，不授internal action。ACK为实际integration协议回复，不证明owner执行。 |
| Telegram：`POST /bridges/v1/platform/telegram/updates` | webhook原secret header/source/installation与Polling互斥；JSON update按fixed kind分派E01/E03，不按body claimed actor。bot-install+from/chat sender kind+chat+message_id+message_thread_id；callback_query原id/from/message/data当前call语义 | webhook HTTP接收ACK、answerCallbackQuery协议响应各按source计划实际记录，不是owner accepted；update_id/offset只transport轴。正文不建safe durable inbox；topic/reply/edit/delete按Bot API能力，不能把topic当channel。缺官方pin/权威probe保未知。 |
| Discord：`POST /bridges/v1/platform/discord/interactions`；消息来源一般registered Gateway host | HTTP Ed25519签名/timestamp/application；Gateway session/sequence/intents/installation当前核；interaction HTTP/Gateway按family排他。application/guild+user/member/bot、channel/thread、message/reply parent；interaction type/token/原source/action完整校 | PING/challenge是private协议响应；初始3秒/后续token15分钟只PS-11来源约束，runtime须以实际source/request窗口校期限，不沿统一常数续期。message E01仅正式source-kind映射，interactions不冒充任意消息源；rate bucket+major-resource+global全部下界，resume不得默认无gap。 |

fixed route必须由已qualified registry解析唯一安装/source/family/secret用途，不能在URL写token或按外部ID创建安装；错签名/未知installation/大小上限/不支持kind先finite拒绝。任何平台raw协议decode可有平台规定字段集，G0 strict codec只约束本地safe schema，不能把foreign兼容字段误认Bridges任意字段；具体source codec/pin尚缺时runtime不可用。

ACK执行边界：ProtocolAckPlan完整action/source/deadline/reason/basis来自actual verifier；accept/defer所需verified source必须Established，execute由原BridgeProtocolAckExecutor/PlatformDriverRequirements.execute_ack短借private reply，真实ProtocolAckExecution分列。平台签名/协议失败映射其正式要求的拒绝（如Discord无效签名401），不能套Command 200/422表；deadline失效只未发/unknown，不延长token、不伪Sent。durable接管不足时是否ACK/defer/reject按该source mode正式合同，若它不支持可靠defer/replay，则不承诺补偿或至少一次；ACK可能先于owner结果，owner结果可已知而ACK lost，二者不互相回滚。

外部四平台编辑/删除/线程差异的outbound由原J01 typed method逐capability执行；同message/source版本/parent/target-generation完整映射，不能自动send替edit、reply丢parent、delete销毁owner或用外部NotFound清unknown。附件只有Artifact authorized ref/grant/private lease，material/provider/scopes未核则blocked。rate/retry/probe合同在J与原Step7沿same effect/所有下界，不容SDK隐藏重试。

## 8. E1结果逐字段、复杂度与停审

| 原result | exact字段 / 来源 |
|---|---|
| InboundConsumeResult | disposition=actual有限处置；operation=原reservation或未接管None；ack=actual执行；owner=原owner结果Slot（Continuity必须Missing）；local_commit=actual UoW或未写None；reason=finite。 |
| CallbackConsumeResult | disposition、operation、ack、local_commit、reason同义但来源本callback；owner为原OwnerActionResultRefSlot，不能用Inbound owner Slot或平台signature填。 |

receipt只能当前内部scope允显时包装原结果；外部从ACK计划执行，不能编码以上owner/ref/op或敏感reason。post-effect失败必须原original/phase还在实际调用宿主/worker unresolved集合，既有stored原safe result保持原语义；不以receipt新增stage/记录或新result ID。

五新增声明仅闭两个deferred envelope与typed payload/原source-loss纯数据；四平台表不是统一SDK或实测能力。所有input/完整factory/current/claim/ACK/original有来源，future正式03§7装配两个独立协议及差异表。人工方向/private生命周期/原两个callable/19入口总量与no raw/no owner truth自检pass；静态审计后才开放E2。最小计划测试沿原E01/E03与platform/worker target：bad signature零record、wrong mode、原parent缺失、已删mapping、bot anti-loop、sensitive choice无日志、one-use并发、deadline/ACK lost、post-effect原op、source loss不建message/ACK；全部planned，未运行。

E1静态停审pass：callback表两处列位错误已修正并重跑，七文档60表/38围栏行、593唯一定义，缺类型/重复/结构错误0；diff-check通过，只开放E2。

## 9. E02 CommittedSourceAvailableConsumer

| 项 | 完整合同 |
|---|---|
| logical event / publisher | `bridge.v1.committed-source-available` / 正式owner actual committed source publisher，经exact受核adapter转换；不是声称上游已有此同名event |
| subscriber / transport | 原CommittedSourceAvailableConsumer；qualified SafeEventTransportHost -> 原owning SafeTransportEventLease -> worker静态分派；Bus/topic/server产品未选 |
| exact callable | `consume<'a>(&'a self, input: CommittedSourceAvailableInput, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, SourceConsumeResult>` |

```rust
/// E02完整safe来源准备字段，不含owner/body/附件正文。
pub struct CommittedSourcePayload {
    /// actual owner提交来源及exact版本候选，须正式owner重验。
    source: CommittedSourceVersionRef,
    /// 原不可变两端/generation/位置/parent target候选。
    target: ImmutableDeliveryTargetRef,
    /// 明确create/edit/delete/reply，不从event名猜method。
    kind: ExternalDeliveryKind,
}
/// HLD deferred source envelope闭口，metadata不代表owner commit。
pub type CommittedSourceRefEnvelope = BridgeInboundEventEnvelope<CommittedSourcePayload>;
```

| 完整factory / 消费 | 中文Rustdoc |
|---|---|
| `CommittedSourcePayload::from_parts(source: CommittedSourceVersionRef, target: ImmutableDeliveryTargetRef, kind: ExternalDeliveryKind) -> Result<Self, ContractViolation>` | /// 核完整原source/target/kind结构，不能授外显、生成effect或冒称commit。 |
| `CommittedSourcePayload::into_parts(self) -> (CommittedSourceVersionRef, ImmutableDeliveryTargetRef, ExternalDeliveryKind)` | /// 原三字段移交CommittedSourceAvailableInput，不同source版本不得归并。 |

| envelope / payload -> input | 正式来源 / 构造闭环 / 缺失处理 |
|---|---|
| consumer | actual注册source host给TrustedConsumerContext；不接payload actor。source/version/scope与metadata/current installation必须一致。 |
| event_key | envelope原source recipe key -> input.event_key；producer event ID/envelope pointer/recipe各自核验，不以event_id自动充key。 |
| source / target / kind | payload原三字段 -> input同名；CommittedSourceVersionRef.source含exact SafeSourceVersionRef，committed_basis只正式owner结果可提供。 |
| owner current source | 按source来源穷尽受核Conversation/Governance/Artifact/选用WorkspaceOwnerAdapter要求`qualify_source`；这里只Bridges需求，actual foreign callable/schema/event/source version/visibility兼容仍BR-UP待核，不能虚构。 |
| plan / intent | 完全同Command附录C04全部factory来源、current installation/binding/actor/mapping、Gate/附件/explicit degraded及stable effect；UoW only。缺正式source/codec/admission不构造committed或可派发intent。 |

E02 event dedup独立于C04 Command key；两入口以同actual source/version/projection/immutable target/kind的`StableEffectIdentity`统一effect。source重复只原结果/current过滤；同key变义Conflict/Quarantined，不prepare第二份，迟到旧版本不得覆盖新版本或改原target。source提交不等可披露，敏感Gate同C04，attachment依原Artifact grant窗口，不默空。

result exact `SourceConsumeResult {disposition,operation,intent,local_commit,reason}`：operation=原event reservation或未接管None，intent只有actual original intent/effect关联；local_commit实际UoW、reason有限。Intent存在不等已send/平台accepted。只内部current允显可包装Source receipt；transport ACK由actual一次性SafeTransportAckCall据原disposition执行，lease original初始None，不能据ACK构造commit/effect。

## 10. E04 SafeHandoffDispositionConsumer

| 项 | 完整合同 |
|---|---|
| logical event / publisher | `bridge.v1.safe-handoff-disposition` / 正式Observability consumer result source，exact兼容未建立，不代表真实publisher/topic已存在 |
| subscriber / transport | 原SafeHandoffDispositionConsumer；qualified safe transport lease原handoff operation必须Some，不复用E02 original=None |
| exact callable | `consume<'a>(&'a self, input: SafeHandoffDispositionInput, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, HandoffConsumeResult>` |

```rust
/// E04正式consumer原handoff处置，不创建producer或观测证据。
pub struct SafeConsumerResultPayload {
    /// 原actual canonical handoff定位，必须存在。
    handoff: SafeHandoffRef,
    /// 原consumer operation，不换ID/namespace。
    original: OriginalHandoffOperationRef,
    /// 原consumer正式safe结果，不是transport ACK。
    disposition: ConsumerDispositionRef,
}
/// HLD deferred consumer-result envelope完整闭口。
pub type SafeConsumerResultEnvelope = BridgeInboundEventEnvelope<SafeConsumerResultPayload>;
```

| 完整factory / 消费 | 中文Rustdoc |
|---|---|
| `SafeConsumerResultPayload::from_parts(handoff: SafeHandoffRef, original: OriginalHandoffOperationRef, disposition: ConsumerDispositionRef) -> Result<Self, ContractViolation>` | /// 校original与disposition原op相同及safe结构，不能宣称consumer准入/接纳。 |
| `SafeConsumerResultPayload::into_parts(self) -> (SafeHandoffRef, OriginalHandoffOperationRef, ConsumerDispositionRef)` | /// 原三字段交SafeHandoffDispositionInput，不生成canonical或source audit。 |

consumer/context/event_key来源同E02，payload三字段逐一input同名，SafeTransportEventLease.original必须和payload original/原handoff原op一致。SafeTraceRepository完整原handoff/audit/retained result/hydration读取；不存在不能创建from_canonical或造producer。SafeObservationPort::qualify_disposition正式核consumer/source/schema/operation、authority kind/scope/window及原canonical/admission，缺则Blocked/Unavailable。

`SafeHandoffRecord::apply_consumer_result(disposition,actual local expected)`只actual原Dispatching/Indeterminate可known finalize；ConsumerResultKind.Pending只原Dispatching同态记录，Unknown/Unavailable保Indeterminate/Blocked与original，不把ACK/Pending作ConsumerAccepted。immutable原result/dedup/local finalize按原UoW提交；不回写Observability truth、不制造source audit、canonical、producer/evidence/report/verdict或递归O01。安全local变更记录只沿原实际mutation/history合同，不从external result建立第二producer。

去重namespace=原consumer/source/schema/scope，key=正式source recipe；同key含义完整handoff/original/disposition稳定kind/authority/reason版本，Duplicate原HandoffConsumeResult。result exact `{disposition,operation,consumer,local_commit,reason}`，consumer=actual ConsumerDispositionRefSlot或Missing/Stale；operation必须原handoff op，None只未接管；receipt外层可见关联仍current过滤。

当前positive限制：已实际复核Observability正式03§7.4九行static producer map，SourceAuditMaterial的explicit family只Governance/Artifact/Runtime/Sandbox；没有Bridges。不得把本地Bridges audit改label为SourceOwner/Governance/Bus注册，不能以payload/schema已设计声称O01 producer/E04 consumer链已准入。BR-UP-006与十二affected保持开放，缺兼容运行slot不得激活；本节schema提供安全拒绝及未来正式兼容目标，不伪造accepted。

## 11. E2版本、错误、复杂度与停审

两个payload各三字段/两个deferred alias；不复制foreign schema、不增加source producer或业务port。local bridge.v1与upstream source schema独立，exact接受集需已qualified binding；未知schema/payload在reserve/write/ACK策略前有限拒绝，禁止decode fallback。safe运输ACK不等业务成功，finite receipt disposition需actual Application结果；没有raw DLQ、retry-after自由值或造placeholder canonical。

人工逐input/两个factory/跨C04 effect/原handoff current/receipt与transport ACK分离检查pass，静态审计后才开放O。future正式03§7承接两个独立协议与source/admission blocked规则。计划测试沿E02/E04/transport与protocol_surface原target：producer/schema错配、metadata/key双承载、source committed依据缺失、C04跨入口重复、未知consumer结果、E04无原handoff、ACK丢失、Forbidden body、source producer冒名；全部planned，未执行。

E2静态停审pass：七文档65表/42围栏行、结构错误0、diff-check通过，人工四E完整input/factory/current/原result无raw检查pass；只开放O，不关闭任何准入缺口。
