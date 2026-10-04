# L6-bridges 03 Step7：Infra Adapter契约

## 1. 边界与共同不变量

I问题/诊断/取舍已done。本页描述计划Adapter和未选产品必须满足的host requirement，不宣称SDK/API/账号/token/driver已存在。Application 23port仍是唯一业务边界；本页technical requirement、router、bound wrapper与host trait只在Infra/entry装配内，不注册成第24业务port，不可被Domain/Contracts依赖。

所有外部调用沿`BridgePortFuture<'call,T>`，不强制Send、不detached，且受`BridgeCallControl`。foreign raw error/body/header/token/URL/stack只在adapter栈帧内有限分类，不能成为`source`、Debug/Display、日志、metric label、audit/evidence或stored result。Cancelled只停止本地等待；已经过foreign dispatch boundary的原effect必须Indeterminate或actual known result。

typed stable adapter card继续复用Step6：四`*PlatformAdapter { context }`、六`*OwnerAdapter { binding }`、`LocalStoreAdapter/LocalCommitProbeAdapter { binding }`。Step7不修改这些card；新增的`Bound*`只把该safe合同与运行时actual product requirement绑定，不成为持久化对象或public DTO。构造必须核kind/source/revision/scope/window，产品未选/版本未pin/兼容未证为NotSelected/NotEstablished。

```text
foreign product/client observation
          |
          v
platform/owner/provider Bound adapter      local driver
          |                                    |
          +-- finite typed mapping ------------+
                          |
                          v
               Application 23 port
                          |
                          v
                 19 typed callable
```

图只表达依赖与反腐方向。adapter不能绕Application直接改Domain/repository，也不能把safe factory结构当actual foreign资格。

## 2. 四平台adapter-local requirement与router

### 2.1 产品binding形态

计划归属四个`crates/infra/src/platform/*.rs`和`platform/mod.rs`。

~~~rust
/// 未选平台产品wrapper必须实现的private technical requirement；不是业务port。
pub trait PlatformDriverRequirements {
    /// 返回产品kind，Bound构造必须与typed adapter一致。
    fn platform_kind(&self) -> PlatformKind;
    /// actual验E01来源并映射为finite safe结果；不得保存raw。
    fn verify_ingress<'a>(&'a self, context: &'a PlatformAdapterContext, input: &'a PrivateIngressContext<'a>, secret: Option<&'a PrivateSecretHandle<'a>>, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, IngressVerificationResult>;
    /// 核actual source-loss/epoch材料和原Protocol stream读资格，不伪消息/coverage。
    fn qualify_continuity_notice<'a>(&'a self, context: &'a PlatformAdapterContext, notice: &'a BridgeSourceContinuityNotice, consumer: &'a TrustedConsumerContext, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, BridgeQualificationOutcome<BridgeQualifiedContinuityNotice>>;
    /// actual验E03平台来源，输出source-only，不授owner动作权。
    fn verify_callback_source<'a>(&'a self, context: &'a PlatformAdapterContext, input: &'a PrivateCallbackContext<'a>, secret: Option<&'a PrivateSecretHandle<'a>>, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, BridgeCallbackSourceResult>;
    /// C05核原known source/message/action在平台侧当前关联；不伪callback发生。
    fn verify_bound_source<'a>(&'a self, context: &'a PlatformAdapterContext, source: &'a SourceIntentMessageRef, target: &'a OwnerTargetActionRef, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, BridgeQualificationOutcome<SafeAuthorityRef>>;
    /// 平台source与stored action/actor/owner资格齐后核完整verification identity。
    fn qualify_complete_callback<'a>(&'a self, context: &'a PlatformAdapterContext, source: &'a BridgeVerifiedCallbackSource, action: &'a ExternalActionBinding, actor: &'a ActorResponsibilityRef, owner: &'a OwnerActionQualificationRef, expiry: &'a ActionExpiryOneUseRef, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, BridgeQualificationOutcome<CallbackVerificationRef>>;
    /// 核该平台实际全部适用limit scope，不只单response bucket。
    fn qualify_rate_bounds<'a>(&'a self, context: &'a PlatformAdapterContext, scope: &'a QualifiedLaneOrderScope, capability: &'a CapabilitySnapshotRef, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, BridgeQualificationOutcome<QualifiedRateLimitBoundSet>>;
    /// 原attempt/effect最多一次产品method调用；SDK隐藏retry必须关闭或可证明同op。
    fn dispatch<'a>(&'a self, context: &'a PlatformAdapterContext, attempt: &'a DeliveryAttempt, intent: &'a DeliveryIntent, eligibility: &'a DispatchEligibilityRef, claim: &'a FencedClaimRef, payload: &'a PrivateQualifiedPayload<'a>, secret: &'a PrivateSecretHandle<'a>, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, BridgeDeliveryCallOutcome>;
    /// 只读原effect权威结果；unsupported返回typed Unknown/Unavailable。
    fn probe_original<'a>(&'a self, context: &'a PlatformAdapterContext, original: &'a OriginalOperationEffectRef, qualification: &'a RecoveryQualificationRef, secret: Option<&'a PrivateSecretHandle<'a>>, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, AuthoritativeProbeResultRef>;
    /// 核原platform/source的readonly恢复scope/window，不授send或换operation。
    fn qualify_recovery<'a>(&'a self, context: &'a PlatformAdapterContext, subject: &'a OriginalRecoverableSubjectRef, original: &'a OriginalOperationEffectRef, basis: &'a RecoveryAuthorizationRef, job: &'a TrustedJobContext, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, BridgeQualificationOutcome<RecoveryQualificationRef>>;
    /// 原source/epoch/range的权威coverage；secret只本call短借，缺method保Unknown。
    fn probe_gap<'a>(&'a self, context: &'a PlatformAdapterContext, gap: &'a GapRecord, qualification: &'a RecoveryQualificationRef, secret: Option<&'a PrivateSecretHandle<'a>>, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, AuthoritativeProbeResultRef>;
    /// 使用正式source comparator，不按opaque字符串、时间或消息ID排序。
    fn compare_position<'a>(&'a self, context: &'a PlatformAdapterContext, stream: &'a CursorNamespaceStream, epoch: &'a QualifiedStreamEpoch, base: &'a OpaqueStreamPositionSlot, candidate: &'a OpaqueStreamPosition, comparator: &'a AuthoritativeComparatorRef, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, BridgeQualificationOutcome<ComparablePositionRef>>;
    /// 按private reply route执行原ACK计划，绝不映射为owner/platform业务成功。
    fn execute_ack<'a>(&'a self, context: &'a PlatformAdapterContext, reply: &'a PrivateReplyContext<'a>, plan: &'a ProtocolAckPlan, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, ProtocolAckExecution>;
}

/// 各typed stable adapter与exact产品wrapper的本次runtime绑定。
pub struct BoundSlackPlatformAdapter<'d> {
    /// 原Step6 safe adapter合同，与actual driver kind/source/window逐项一致。
    contract: SlackPlatformAdapter,
    /// 本次actual平台product wrapper引用，未核兼容即NotEstablished。
    driver: &'d dyn PlatformDriverRequirements,
}
/// 原typed平台合同与actual产品wrapper的受核绑定；未核兼容不宣称可用。
pub struct BoundMattermostPlatformAdapter<'d> {
    /// 原Step6 safe adapter合同，与actual driver kind/source/window逐项一致。
    contract: MattermostPlatformAdapter,
    /// 本次actual平台product wrapper引用，未核兼容即NotEstablished。
    driver: &'d dyn PlatformDriverRequirements,
}
/// 原typed平台合同与actual产品wrapper的受核绑定；未核兼容不宣称可用。
pub struct BoundTelegramPlatformAdapter<'d> {
    /// 原Step6 safe adapter合同，与actual driver kind/source/window逐项一致。
    contract: TelegramPlatformAdapter,
    /// 本次actual平台product wrapper引用，未核兼容即NotEstablished。
    driver: &'d dyn PlatformDriverRequirements,
}
/// 原typed平台合同与actual产品wrapper的受核绑定；未核兼容不宣称可用。
pub struct BoundDiscordPlatformAdapter<'d> {
    /// 原Step6 safe adapter合同，与actual driver kind/source/window逐项一致。
    contract: DiscordPlatformAdapter,
    /// 本次actual平台product wrapper引用，未核兼容即NotEstablished。
    driver: &'d dyn PlatformDriverRequirements,
}

/// 仅四typed variant，不接受unknown/free-form platform。
pub enum BoundPlatformAdapter<'d> {
    /// exact Slack typed adapter，不能跨安装或换平台fallback。
    Slack(BoundSlackPlatformAdapter<'d>),
    /// exact Mattermost typed adapter，server/plugin能力必须实际核验。
    Mattermost(BoundMattermostPlatformAdapter<'d>),
    /// exact Telegram typed adapter，webhook/polling同updates原子排他。
    Telegram(BoundTelegramPlatformAdapter<'d>),
    /// exact Discord typed adapter，interaction/Gateway按family核模式。
    Discord(BoundDiscordPlatformAdapter<'d>),
}

/// 按actual installation/namespace/source排他选择typed adapter。
pub struct PlatformPortRouter<'d> {
    /// actual qualified四typed adapter集合，同installation/family禁止多命中。
    adapters: Vec<BoundPlatformAdapter<'d>>,
    /// actual正式来源/版本/scope依据；shape合法不等已授权。
    qualification: SafeAuthorityRef,
}
~~~

每个Bound factory完整接`contract, driver`，核driver kind、context installation/namespace/config/secret/route、source family排他及qualification Established；只读getter不返回driver/raw client。router factory完整接非空adapters及actual composition qualification，拒绝重复installation、namespace串绑、同family多mode、wrong platform kind、失效source。router分别实现`PlatformIngressPort`、`CallbackVerificationPort`的平台三方法及`PlatformDeliveryPort`；只按typed key委派，找不到返回NotEstablished，多命中InvariantViolation，不fallback到另一平台/安装。

`PlatformDriverRequirements`是未来产品wrapper的验收接口，不是已选统一SDK。具体四wrapper必须分别验证下表差异；不能用一个serde JSON passthrough实现四平台。

### 2.2 逐平台双向mapping

| 平台 | inbound / source与排他模式 | external identity/channel/message/thread映射 | callback/ACK | outbound/edit/delete/reply/附件 | rate/恢复与当前阻塞 |
|---|---|---|---|---|---|
| Slack | `SlackEventsHttp`或`SlackSocket`按installation+Inbound family排他；actual request/socket envelope、team/enterprise/app/source版本验真 | account=team/install+typed user/bot/app id；location=channel；message=ts；thread parent=thread_ts显式root/parent；subtype/change映射不能猜 | interaction来源、原message/action/actor/target/期限逐项；HTTP/socket/interactivity回复只ProtocolAckExecution | create/edit/delete/reply按capability；reply保thread_ts；附件只authorized ref经private provider，不能缓存file URL/token | actual method/workspace/channel及正式Retry-After下界；event id/position不等owner commit；SDK、OAuth/scopes与exact probe未选，blocked |
| Mattermost | `MattermostTrustedHttp`或`MattermostWebSocket`排他；部署正式server/plugin/outgoing source；incoming webhook不能冒充消息event | account含server/installation+typed user/bot；location=team/channel；message=post id；thread=root_id显式；edit/delete由actual post event | interactive action必须trusted integration/plugin context、nonce/actor/source；HTTP/plugin reply仅ACK | post/update/delete/reply按actual server capability；root_id差异显式；附件仅正式file reference/grant，不保存PAT/URL | server/method/resource下界及部署能力；PAT非内部授权，server/plugin/API版本/权威probe未pin，blocked |
| Telegram | `TelegramWebhook`或`TelegramPolling`按Inbound/Callback适用family排他；update来源/installation/secret路径实际核验 | account=bot installation+from/chat sender kind；location=chat+可选message_thread_id；message=message_id；callback原message显式 | callback_query id/from/message/data只在private语义准入；answer callback或webhook响应是ACK | send/edit/delete/reply按chat/message/topic/current capability；附件仅file ref/grant，禁止长期file URL/token | update_id/offset只transport cursor，不是owner commit；retry_after形成resource/global下界；poll/webhook、Bot API版本/token/probe未选，blocked |
| Discord | `DiscordHttpInteraction`或`DiscordGateway`按family排他；HTTP签名或Gateway session/sequence/intents current核验 | account=application/guild+user/member/bot；location=guild/channel/thread；message id；reply/thread parent显式；intent缺失不可声称全消息源 | interaction signature/type/token/deadline及原message/action/actor核验；interaction response/Gateway ACK非owner result | create/edit/delete/reply/followup按method/capability；attachment只授权引用/private upload；interaction token不持久化 | bucket+major resource+global及Retry-After取全部下界；sequence/resume gap保epoch/coverage；SDK/intents/token/probe未选，blocked |

所有external locator均保安装namespace和opaque ID，不记录显示名；平台不存在统一global message truth，mapping只是本地经授权relation。平台返回2xx/ACK只证明相应transport/method阶段；KnownPlatformBusinessResult必须actual业务响应，Accepted仍不等用户送达/阅读。foreign NotFound不能自动NoEffect，edit/delete/reply缺原mapping/dependency或能力一律Unsupported/Blocked。

### 2.3 private入口owning lease

计划归属`crates/infra/src/platform/mod.rs`及各平台文件；解决source reader异步返回borrow悬空问题。

~~~rust
/// E01 source host本call拥有的raw/verification/reply buffer。
pub struct IngressEntryLease {
    /// actual有界外部body私有buffer，不进durable/log/evidence。
    raw_body: Vec<u8>,
    /// actual签名/来源验证私有buffer，不提供raw getter。
    verification_inputs: Vec<u8>,
    /// 本次私有reply route/context，ACK后drop，不持久化。
    reply_context: Vec<u8>,
    /// 正式source recipe的opaque identity，不能用正文/时间/trace生成。
    candidate_event_key: SafeOpaqueId,
    /// 受权安装定位，仍须读取完整current安装，不以ref充当资格。
    installation: BridgeInstallationRef,
    /// actual注册安装的隔离域，任何source/actor/mapping不得跨域。
    namespace: InstallationNamespace,
    /// actual host接收时刻，仅来源事实，不充当current clock。
    received_at: SafeInstant,
    /// 同actual clock域的本call终止上界，超时不证明NoEffect。
    deadline: SafeInstant,
    /// actual qualified source/version/scope定位，不包含私有endpoint/token。
    basis: SafeAuthoritySourceRef,
}
/// E03 source host本call拥有的raw/verification/reply buffer。
pub struct CallbackEntryLease {
    /// actual有界callback私有buffer，选择/token不进入安全结果。
    raw_callback: Vec<u8>,
    /// actual签名/来源验证私有buffer，不提供raw getter。
    verification_inputs: Vec<u8>,
    /// 本次私有reply route/context，ACK后drop，不持久化。
    reply_context: Vec<u8>,
    /// 正式source recipe的opaque identity，不能用正文/时间/trace生成。
    candidate_event_key: SafeOpaqueId,
    /// 受权安装定位，仍须读取完整current安装，不以ref充当资格。
    installation: BridgeInstallationRef,
    /// actual注册安装的隔离域，任何source/actor/mapping不得跨域。
    namespace: InstallationNamespace,
    /// actual host接收时刻，仅来源事实，不充当current clock。
    received_at: SafeInstant,
    /// 同actual clock域的本call终止上界，超时不证明NoEffect。
    deadline: SafeInstant,
    /// actual qualified source/version/scope定位，不包含私有endpoint/token。
    basis: SafeAuthoritySourceRef,
}
~~~

两lease字段private，只有candidate event key、installation/namespace及安全期限/来源只读getter，无raw getter/Clone/Debug/serde/Display/Error-source；factory仅actual qualified host，candidate key只是结构输入，核byte budget/source registration/deadline。`borrow_context<'s>(&'s self) -> PrivateIngressContext<'s>`或`PrivateCallbackContext<'s>`只短借三个buffer并重建`PrivateReplyContext`，不授权。borrow必须在lease drop前结束；drop/取消不宣zeroize或外部无效果。HTTP server/Gateway/SDK host产品到Step14，当前不能创建假listener。

### 2.4 resident platform source host

计划归属`crates/infra/src/platform/mod.rs`及四平台文件；这是Worker消费的technical `TransportHost`分面，不是Application业务port。HTTP/webhook/interactions模式仍由API入口承接，只有Slack Socket、Mattermost WebSocket、Telegram polling、Discord Gateway等配置为resident且actual qualified时可建立连接。

~~~rust
/// 一次actual resident source连接证明；不是平台全局session truth或业务水位。
pub struct PlatformSourceConnection {
    /// actual当前排他installation/source/family/mode注册。
    registration: QualifiedPlatformSourceRegistration,
    /// actual原source epoch，不以reconnect或时间制造。
    epoch: QualifiedStreamEpoch,
    /// 正式source recipe的opaque identity，不能用正文/时间/trace生成。
    session_id: QualificationSlot<SafeOpaqueId>,
    /// actual正式来源/版本/scope依据；shape合法不等已授权。
    basis: SafeAuthorityRef,
    /// actual来源期限交集，不因host retry重造或延长。
    validity: SafeValidityWindow,
}

/// 未选产品source wrapper必须满足的bounded host；不读写Bridges repository。
pub trait PlatformSourceHost {
    /// 借用actual排他source注册，不返回raw client或授业务权。
    fn registration(&self) -> &QualifiedPlatformSourceRegistration;
    /// 仅resident qualified mode建立一次actual连接，失败不构造Active。
    fn connect<'a>(&'a self, budget: &'a RuntimeExecutionBudget, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, PlatformSourceConnection>;
    /// 仅Inbound family有界取一个owning lease；None不是coverage。
    fn next_ingress<'a>(&'a self, connection: &'a PlatformSourceConnection, budget: &'a RuntimeExecutionBudget, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, Option<IngressEntryLease>>;
    /// 仅Callback family有界取一个owning lease；None不是NoEffect。
    fn next_callback<'a>(&'a self, connection: &'a PlatformSourceConnection, budget: &'a RuntimeExecutionBudget, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, Option<CallbackEntryLease>>;
    /// 移交actual原stream断连/epoch材料；无正式identity/range则blocked。
    fn discontinuity_notice<'a>(&'a self, connection: &'a PlatformSourceConnection, reason: SafeGapReason, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, BridgeQualificationOutcome<BridgeSourceContinuityNotice>>;
    /// 消费原连接并停止本地source，不证明gap关闭或effect撤销。
    fn close<'a>(&'a self, connection: PlatformSourceConnection, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, ()>;
}
~~~

`PlatformSourceConnection::from_driver_parts(registration, epoch, session_id, basis, validity)`仅供bound Infra host，核registration current、mode/family、stream/epoch、basis exact kind及窗口；stateful模式session必须Established，polling可明确Missing，不用本地随机ID冒充平台session。只读getter覆盖五字段；无mutable getter、raw client、token、Clone/Debug/serde/Display/Error-source。

`connect`只返回actual driver证明，Worker随后才可`PlatformSourceSession::record_connected`。两个`next_*`按registration family严格二选一，错误family在任何source IO前InvalidInput；`None`只表示本次bounded poll没有item，不证明coverage、cursor完成或外部无消息。返回的owning lease继续受§2.3生命周期约束。driver断开/超时只形成有限Unavailable/Indeterminate，Worker保原epoch并标SourceDisconnected；`close`成功只表示本地host已请求关闭，不证明gap覆盖、ACK、owner结果或外部effect撤销。SDK/Gateway/WebSocket/poll client与executor仍未选，当前全部不得宣称可连接。

`discontinuity_notice`只根据actual断连/新epoch driver材料、已注册source recipe和原connection给出safe notice；无法提供正式event identity/range/basis时返回Blocked/Unavailable，不用clock/message ID/hash补identity或范围。notice交原E01 `Continuity`分支再次核source/current read并记录gap；host本身不调用repo。它可以为Callback family给原Protocol stream notice，但不能伪装成callback动作。重新connect不得清除旧gap；若notice无法durable接管，source branch保持blocked/manual，不能静默续接并报告无缺口。

## 3. 六owner adapter与组合port

### 3.1 adapter-local requirement

以下trait是Bridges对正式owner合同的**需求面**，不是声称上游已有同名方法；实际binding必须逐方法核正式版本/source/scope/visibility。缺兼容返回NotEstablished，不能访问owner私表或以SDK client通用request逃逸typed约束。

~~~rust
/// Conversation正式target/material/handoff需求。
pub trait ConversationOwnerRequirements {
    /// 按正式target/mapping/current责任解析模式，不由频道类型猜。
    fn resolve_target_mode<'a>(&'a self, binding: &'a OwnerContractBinding, mapping: &'a AuthorizedMappingContextRef, actor: &'a ActorRef, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, BridgeQualificationOutcome<BridgeTargetMode>>;
    /// 本call raw准入转exact safe材料资格，不存正文或hash。
    fn qualify_material<'a>(&'a self, binding: &'a OwnerContractBinding, ingress: &'a QualifiedIngressContext, mapping: &'a AuthorizedMappingContextRef, actor: &'a ActorRef, mode: &'a BridgeTargetMode, input: &'a PrivateIngressContext<'a>, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, BridgeQualificationOutcome<CurrentMaterialQualification>>;
    /// 只重验原safe材料/target/mode，不重新读取或制造raw输入。
    fn revalidate_material<'a>(&'a self, binding: &'a OwnerContractBinding, current: &'a CurrentMaterialQualification, mapping: &'a AuthorizedMappingContextRef, actor: &'a ActorRef, mode: &'a BridgeTargetMode, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, BridgeQualificationOutcome<CurrentMaterialQualification>>;
    /// actual durable claim后同operation交正式owner，不造Turn提交结果。
    fn handoff<'a>(&'a self, binding: &'a OwnerContractBinding, record: &'a InboundHandoffRecord, original: &'a OriginalOperationEffectRef, claim: &'a HandoffClaimRef, current: &'a CurrentBindingQualification, material: &'a TransientQualifiedMaterialHandle<'a>, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, OwnerHandoffResultRef>;
    /// 只读原owner operation实际阶段，NotFound不转NoEffect。
    fn read_original_result<'a>(&'a self, binding: &'a OwnerContractBinding, original: &'a OriginalOperationEffectRef, qualification: &'a RecoveryQualificationRef, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, OwnerHandoffResultRef>;
    /// 正式committed source/version及producer关联，不以event收到当owner提交。
    fn qualify_source<'a>(&'a self, binding: &'a OwnerContractBinding, source: &'a CommittedSourceVersionRef, consumer: &'a TrustedConsumerContext, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, BridgeQualificationOutcome<CommittedSourceVersionRef>>;
    /// 原Conversation subject/op的readonly恢复材料，不授创建Turn。
    fn qualify_recovery<'a>(&'a self, binding: &'a OwnerContractBinding, subject: &'a OriginalRecoverableSubjectRef, original: &'a OriginalOperationEffectRef, basis: &'a RecoveryAuthorizationRef, job: &'a TrustedJobContext, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, BridgeQualificationOutcome<RecoveryQualificationRef>>;
    /// 原正式owner event流同epoch/range coverage，partial保gap。
    fn probe_gap<'a>(&'a self, binding: &'a OwnerContractBinding, gap: &'a GapRecord, qualification: &'a RecoveryQualificationRef, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, AuthoritativeProbeResultRef>;
    /// 正式owner source comparator，opaque position不可本地猜序。
    fn compare_position<'a>(&'a self, binding: &'a OwnerContractBinding, stream: &'a CursorNamespaceStream, epoch: &'a QualifiedStreamEpoch, base: &'a OpaqueStreamPositionSlot, candidate: &'a OpaqueStreamPosition, comparator: &'a AuthoritativeComparatorRef, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, BridgeQualificationOutcome<ComparablePositionRef>>;
}

/// Identity只解析正式AI锚点，绝不为external account创建GlobalMember。
pub trait IdentityOwnerRequirements {
    /// 只核正式既有AI GlobalMember锚点，不创建任意external用户。
    fn qualify_ai_anchor<'a>(&'a self, binding: &'a OwnerContractBinding, actor: &'a ActorRef, account: Option<&'a ExternalAccountLocator>, target: &'a BridgeInternalTargetRef, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, BridgeQualificationOutcome<ActorResponsibilityRef>>;
}

/// Governance提供Policy/Gate/动作/可见性当前结论；不由Bridges写Decision。
pub trait GovernanceOwnerRequirements {
    /// Governance source的actual提交依据；通知事件不等Gate/Decision truth副本。
    fn qualify_source<'a>(&'a self, binding: &'a OwnerContractBinding, source: &'a CommittedSourceVersionRef, consumer: &'a TrustedConsumerContext, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, BridgeQualificationOutcome<CommittedSourceVersionRef>>;
    /// 核explicit两端/action/actor Policy授权，不由PAT/按钮授权。
    fn qualify_binding<'a>(&'a self, binding: &'a OwnerContractBinding, installation: &'a BridgeInstallationRef, external: &'a ExternalScopeLocator, target: &'a BridgeInternalTargetRef, actor: &'a ActorRef, actions: &'a BridgeDirectionActionSet, basis: &'a AuthorizedBindingBasisRef, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, BridgeQualificationOutcome<AuthorizedBindingBasisRef>>;
    /// 核本地主语读用途/授权，不能靠candidate shape授mutation或maintenance。
    fn qualify_local_read<'a>(&'a self, binding: &'a OwnerContractBinding, candidate: &'a BridgeLocalReadContext, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, BridgeQualificationOutcome<BridgeLocalReadContext>>;
    /// Pending/Suspended的显式activation；不得调用仅Active的current分支替代。
    fn qualify_activation<'a>(&'a self, binding: &'a OwnerContractBinding, relation: &'a ExternalBinding, expected: &'a ExpectedGeneration, actor: &'a ActorRef, basis: &'a AuthorizedBindingBasisRef, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, BridgeQualificationOutcome<BindingActivationQualification>>;
    /// 当前Active relation/action核验，Pending activation走独立方法。
    fn qualify_current_binding<'a>(&'a self, binding: &'a OwnerContractBinding, relation: &'a ExternalBinding, action: DirectionActionKind, actor: &'a ActorRef, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, BridgeQualificationOutcome<CurrentBindingQualification>>;
    /// 原relation的维护责任/动作当前资格，不授新binding权限。
    fn qualify_maintenance<'a>(&'a self, binding: &'a OwnerContractBinding, relation: &'a ExternalBinding, action: BindingMutationKind, actor: &'a ActorRef, basis: &'a QualificationMaintenanceBasisRef, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, BridgeQualificationOutcome<QualificationMaintenanceBasisRef>>;
    /// 显式撤销责任；ref shape不是撤销授权。
    fn qualify_revocation<'a>(&'a self, binding: &'a OwnerContractBinding, subject: &'a BridgeViewSubjectRef, actor: &'a ActorRef, basis: &'a RevocationBasisRef, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, BridgeQualificationOutcome<RevocationBasisRef>>;
    /// identity两端及same relation/action授权；AI另外核Identity正式锚点。
    fn qualify_identity_mapping<'a>(&'a self, binding: &'a OwnerContractBinding, current: &'a CurrentBindingQualification, external: &'a ExternalAccountLocator, actor: &'a ActorRef, basis: &'a IdentityMappingBasisRef, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, BridgeQualificationOutcome<IdentityMappingBasisRef>>;
    /// location/parent/target两端授权，不把频道可见性当内部target权限。
    fn qualify_location_mapping<'a>(&'a self, binding: &'a OwnerContractBinding, current: &'a CurrentBindingQualification, external: &'a ExternalLocationLocator, parent: &'a ParentLocationRefSlot, target: &'a BridgeInternalTargetRef, basis: &'a LocationMappingBasisRef, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, BridgeQualificationOutcome<LocationMappingBasisRef>>;
    /// 只核actual source/version/known结果回链，不授unknown消息映射。
    fn qualify_message_mapping<'a>(&'a self, binding: &'a OwnerContractBinding, current: &'a CurrentBindingQualification, message: &'a ExternalMessageLocator, source: &'a SafeSourceVersionRef, known: &'a KnownMappingResultRef, basis: &'a MappingBasisRef, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, BridgeQualificationOutcome<MappingBasisRef>>;
    /// 核原message/source/version/target的正式删除处置与actor/Delete/current；不是执行删除。
    fn qualify_tombstone<'a>(&'a self, binding: &'a OwnerContractBinding, mapping: &'a ExternalMessageMapping, current: &'a CurrentBindingQualification, actor: &'a ActorRef, disposition: &'a OwnerChangeDispositionRef, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, BridgeQualificationOutcome<OwnerChangeDispositionRef>>;
    /// 完整snapshot与current generation/action交集，不从一行ref补资格。
    fn qualify_mapping<'a>(&'a self, binding: &'a OwnerContractBinding, snapshot: &'a AuthorizedMappingSnapshot, current: &'a CurrentBindingQualification, action: DirectionActionKind, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, BridgeQualificationOutcome<AuthorizedMappingContextRef>>;
    /// 显式mapping失效basis，终态不得复活。
    fn qualify_mapping_invalidation<'a>(&'a self, binding: &'a OwnerContractBinding, mapping: &'a MappingRef, actor: &'a ActorRef, basis: &'a MappingInvalidationBasisRef, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, BridgeQualificationOutcome<MappingInvalidationBasisRef>>;
    /// 核current Policy/Gate/降级/附件外显交集，不默认批准。
    fn qualify_presentation<'a>(&'a self, binding: &'a OwnerContractBinding, source: &'a CommittedSourceVersionRef, target: &'a ImmutableDeliveryTargetRef, kind: ExternalDeliveryKind, actor: &'a ActorRef, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, BridgeQualificationOutcome<CurrentPresentationQualification>>;
    /// 原plan/target外显current重验，不以旧projection延长Gate/附件资格。
    fn revalidate_presentation<'a>(&'a self, binding: &'a OwnerContractBinding, plan: &'a SafePresentationPlan, target: &'a ImmutableDeliveryTargetRef, actor: &'a ActorRef, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, BridgeQualificationOutcome<CurrentPresentationQualification>>;
    /// 当前原effect派发许可与实际lane/bounds交集；不替本地claim CAS。
    fn qualify_dispatch<'a>(&'a self, binding: &'a OwnerContractBinding, delivery: &'a DeliverySnapshot, lane: &'a LaneSnapshot, presentation: &'a CurrentPresentationQualification, bounds: &'a QualifiedRateLimitBoundSet, job: &'a TrustedJobContext, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, BridgeQualificationOutcome<DispatchEligibilityRef>>;
    /// adapter-local组合要求：正式target/capability/rate/config预算齐才返回scope/dependency，不由Policy造平台下界。
    fn qualify_lane<'a>(&'a self, binding: &'a OwnerContractBinding, target: &'a ImmutableDeliveryTargetRef, presentation: &'a CurrentPresentationQualification, capability: &'a CapabilitySnapshotRef, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, BridgeQualificationOutcome<LanePreparationQualification>>;
    /// adapter-local五源原effect重试资格；正式NoEffect、预算、presentation、window、全部not_before齐，零发送。
    fn qualify_retry<'a>(&'a self, binding: &'a OwnerContractBinding, delivery: &'a DeliverySnapshot, lane: &'a LaneSnapshot, no_effect: &'a NoEffectBasisRef, current: &'a CurrentPresentationQualification, job: &'a TrustedJobContext, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, BridgeQualificationOutcome<RetryEligibilityRef>>;
    /// 只核原presentation失效理由，不授降级外显或重建投递权限。
    fn qualify_presentation_invalidation<'a>(&'a self, binding: &'a OwnerContractBinding, plan: &'a SafePresentationPlan, basis: &'a QualificationMaintenanceBasisRef, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, BridgeQualificationOutcome<PresentationInvalidationBasisRef>>;
    /// 核actual actor/target/action责任，不从bot/role hint推权限。
    fn qualify_responsibility<'a>(&'a self, binding: &'a OwnerContractBinding, actor: &'a ActorRef, target: &'a BridgeInternalTargetRef, action: DirectionActionKind, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, BridgeQualificationOutcome<ActorResponsibilityRef>>;
    /// 实际external account/mapping/current relation解析原责任，不自动创建actor。
    fn resolve_external<'a>(&'a self, binding: &'a OwnerContractBinding, account: &'a ExternalAccountLocator, mapping: &'a ExternalIdentityMapping, current: &'a CurrentBindingQualification, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, BridgeQualificationOutcome<ActorResponsibilityRef>>;
    /// owner动作前核same responsibility及撤销；AI正式锚点仍required。
    fn revalidate_responsibility<'a>(&'a self, binding: &'a OwnerContractBinding, responsibility: &'a ActorResponsibilityRef, action: &'a OwnerTargetActionRef, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, BridgeQualificationOutcome<ActorResponsibilityRef>>;
    /// C05初绑当前owner action/read/disclosure，不要求callback发生。
    fn qualify_action_binding<'a>(&'a self, binding: &'a OwnerContractBinding, current: &'a CurrentBindingQualification, source: &'a SourceIntentMessageRef, actor: &'a ActorResponsibilityRef, target: &'a OwnerTargetActionRef, source_verification: &'a SafeAuthorityRef, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, BridgeQualificationOutcome<ActionBindingQualification>>;
    /// 读当前owner action/revision/授权，按钮不充当状态。
    fn qualify_owner_action<'a>(&'a self, binding: &'a OwnerContractBinding, action: &'a ExternalActionBinding, actor: &'a ActorResponsibilityRef, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, BridgeQualificationOutcome<OwnerActionQualificationRef>>;
    /// actual owner expiry/one-use条件只读，不consume/claim。
    fn qualify_expiry<'a>(&'a self, binding: &'a OwnerContractBinding, action: &'a ExternalActionBinding, owner: &'a OwnerActionQualificationRef, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, BridgeQualificationOutcome<ActionExpiryOneUseRef>>;
    /// 敏感选择仅本call交owner准入，返回body-free含义ref。
    fn qualify_callback_semantics<'a>(&'a self, binding: &'a OwnerContractBinding, source: &'a BridgeVerifiedCallbackSource, action: &'a ExternalActionBinding, owner: &'a OwnerActionQualificationRef, input: &'a PrivateCallbackContext<'a>, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, BridgeQualificationOutcome<ActionOperationMeaning>>;
    /// 以原one-use claim/operation交owner，不由Bridges写Decision。
    fn handoff_action<'a>(&'a self, binding: &'a OwnerContractBinding, record: &'a CallbackHandoffRecord, current: &'a CurrentActionQualification, meaning: &'a ActionOperationMeaning, claim: &'a OneUseClaimRef, original: &'a OriginalOperationEffectRef, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, OwnerActionResultRef>;
    /// 原action operation的权威只读结果；不重approve或换operation。
    fn read_original_action_result<'a>(&'a self, binding: &'a OwnerContractBinding, original: &'a OriginalOperationEffectRef, qualification: &'a RecoveryQualificationRef, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, OwnerActionResultRef>;
    /// resolver-first current披露核验，隐藏存在性/ref/count。
    fn qualify_read<'a>(&'a self, binding: &'a OwnerContractBinding, actor: &'a ActorRef, namespace: &'a InstallationNamespace, subject: &'a BridgeViewSubjectRef, authority: &'a SafeAuthorityRef, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, BridgeQualificationOutcome<CurrentReadQualification>>;
    /// 当前visibility到受限committed local read；不能升级为任意维护或写权。
    fn qualify_read_context<'a>(&'a self, binding: &'a OwnerContractBinding, qualification: &'a CurrentReadQualification, limit: u32, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, BridgeQualificationOutcome<BridgeLocalReadContext>>;
    /// 返回前重核同subject visibility，失效不公开旧ref/count。
    fn revalidate_read<'a>(&'a self, binding: &'a OwnerContractBinding, qualification: &'a CurrentReadQualification, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, BridgeQualificationOutcome<CurrentReadQualification>>;
    /// C06原scope的恢复请求授权，不等readonly probe已执行或send许可。
    fn qualify_recovery_request<'a>(&'a self, binding: &'a OwnerContractBinding, subject: &'a OriginalRecoverableSubjectRef, original: &'a OriginalOperationEffectRef, basis: &'a RecoveryAuthorizationRef, actor: &'a ActorRef, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, BridgeQualificationOutcome<RecoveryAuthorizationRef>>;
    /// J02/J03原subject/op的维护及readonly恢复资格，不生成新效果。
    fn qualify_recovery<'a>(&'a self, binding: &'a OwnerContractBinding, subject: &'a OriginalRecoverableSubjectRef, original: &'a OriginalOperationEffectRef, basis: &'a RecoveryAuthorizationRef, job: &'a TrustedJobContext, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, BridgeQualificationOutcome<RecoveryQualificationRef>>;
    /// 原Governance event source coverage，不由按钮ACK证明无缺口。
    fn probe_gap<'a>(&'a self, binding: &'a OwnerContractBinding, gap: &'a GapRecord, qualification: &'a RecoveryQualificationRef, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, AuthoritativeProbeResultRef>;
    /// 正式Governance stream comparator；缺合同保持incomparable。
    fn compare_position<'a>(&'a self, binding: &'a OwnerContractBinding, stream: &'a CursorNamespaceStream, epoch: &'a QualifiedStreamEpoch, base: &'a OpaqueStreamPositionSlot, candidate: &'a OpaqueStreamPosition, comparator: &'a AuthoritativeComparatorRef, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, BridgeQualificationOutcome<ComparablePositionRef>>;
}

/// Artifact只给material/attachment安全准入，不返回正文或公开URL。
pub trait ArtifactOwnerRequirements {
    /// Artifact source的actual提交依据，仍只safe ref不返回附件正文。
    fn qualify_source<'a>(&'a self, binding: &'a OwnerContractBinding, source: &'a CommittedSourceVersionRef, consumer: &'a TrustedConsumerContext, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, BridgeQualificationOutcome<CommittedSourceVersionRef>>;
    /// 核owner material/digest/附件safe准入，不返回正文。
    fn qualify_material_refs<'a>(&'a self, binding: &'a OwnerContractBinding, current: &'a CurrentMaterialQualification, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, BridgeQualificationOutcome<CurrentMaterialQualification>>;
    /// 核current attachment grant/有效期，不保存公开下载URL。
    fn qualify_attachment_refs<'a>(&'a self, binding: &'a OwnerContractBinding, current: &'a CurrentPresentationQualification, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, BridgeQualificationOutcome<CurrentPresentationQualification>>;
}

/// Workspace仅条件safe read/export provenance，不是频道或permission owner。
pub trait WorkspaceOwnerRequirements {
    /// 选用Workspace source时核actual提交/provenance，不以其作为频道owner。
    fn qualify_source<'a>(&'a self, binding: &'a OwnerContractBinding, source: &'a CommittedSourceVersionRef, consumer: &'a TrustedConsumerContext, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, BridgeQualificationOutcome<CommittedSourceVersionRef>>;
    /// 仅选用分支追加正式provenance；缺合同不降optional。
    fn qualify_conditional_read<'a>(&'a self, binding: &'a OwnerContractBinding, current: &'a CurrentReadQualification, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, BridgeQualificationOutcome<CurrentReadQualification>>;
}

/// Observability正式producer/consumer需求，不把本地audit升级为evidence。
pub trait ObservabilityOwnerRequirements {
    /// 原canonical/source/window/预算只读资格，fresh无需RecoveryRecord；不授再次交接。
    fn qualify_consumer_probe<'a>(&'a self, binding: &'a OwnerContractBinding, record: &'a SafeHandoffRecord, job: &'a TrustedJobContext, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, BridgeQualificationOutcome<RecoveryQualificationRef>>;
    /// 正式原handoff结果/维护排除producer规则，local audit仍必需；缺规则NotEstablished。
    fn qualify_nonrecursive<'a>(&'a self, binding: &'a OwnerContractBinding, record: &'a SafeHandoffRecord, material: &'a BodyFreeMutationMaterial, actor: &'a ActorRef, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, BridgeQualificationOutcome<NonRecursiveObservationQualification>>;
    /// 核正式producer/schema/canonical准入，mandatory不足阻效果。
    fn qualify_requirement<'a>(&'a self, binding: &'a OwnerContractBinding, original: &'a OriginalOperationEffectRef, material: &'a BodyFreeMutationMaterial, actor: &'a ActorRef, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, BridgeQualificationOutcome<MutationObservationRequirement>>;
    /// 核原canonical/consumer operation当前准入，不创造证据。
    fn qualify_handoff<'a>(&'a self, binding: &'a OwnerContractBinding, record: &'a SafeHandoffRecord, job: &'a TrustedJobContext, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, BridgeQualificationOutcome<CurrentSafeHandoffQualification>>;
    /// actual claim/commit后同consumer operation交接，ACK不等Accepted。
    fn handoff<'a>(&'a self, binding: &'a OwnerContractBinding, record: &'a SafeHandoffRecord, current: &'a CurrentSafeHandoffQualification, claim: &'a SafeHandoffClaimRef, committed: &'a CommittedLocalMutationRef, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, ConsumerDispositionRef>;
    /// 只核原handoff/op正式处置，不从transport状态补成功。
    fn qualify_disposition<'a>(&'a self, binding: &'a OwnerContractBinding, disposition: &'a ConsumerDispositionRef, handoff: &'a SafeHandoffRecord, consumer: &'a TrustedConsumerContext, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, BridgeQualificationOutcome<ConsumerDispositionRef>>;
    /// actual同consumer operation权威结果，不以transport ACK或NotFound补Accepted/NoEffect。
    fn read_original_result<'a>(&'a self, binding: &'a OwnerContractBinding, original: &'a OriginalHandoffOperationRef, qualification: &'a RecoveryQualificationRef, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, ConsumerDispositionRef>;
    /// 原canonical/consumer operation的readonly恢复资格，不新建producer。
    fn qualify_recovery<'a>(&'a self, binding: &'a OwnerContractBinding, subject: &'a OriginalRecoverableSubjectRef, original: &'a OriginalOperationEffectRef, basis: &'a RecoveryAuthorizationRef, job: &'a TrustedJobContext, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, BridgeQualificationOutcome<RecoveryQualificationRef>>;
    /// 正式consumer disposition source的same epoch完整coverage；ACK不是coverage。
    fn probe_gap<'a>(&'a self, binding: &'a OwnerContractBinding, gap: &'a GapRecord, qualification: &'a RecoveryQualificationRef, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, AuthoritativeProbeResultRef>;
    /// 正式consumer source comparator，不比较transport token文本。
    fn compare_position<'a>(&'a self, binding: &'a OwnerContractBinding, stream: &'a CursorNamespaceStream, epoch: &'a QualifiedStreamEpoch, base: &'a OpaqueStreamPositionSlot, candidate: &'a OpaqueStreamPosition, comparator: &'a AuthoritativeComparatorRef, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, BridgeQualificationOutcome<ComparablePositionRef>>;
}
~~~

X审计已为Conversation `revalidate_material`、OwnerAction initial binding/expiry/result、Binding activation/maintenance/revoke/mapping、Presentation dispatch/invalidation、Actor external/revalidate、Read context/revalidate与Observability原result逐项补具名需求签名。无raw的重验不能调用必需PrivateIngressContext的初次准入，Pending activation不能复用仅Active的current方法；任何本地shape factory都不代替这些actual需求。它们仍是Bridges adapter-local需求，不是上游已有API；对应正式兼容未核，BR-UP保持open。

### 3.2 bound wrapper与组合facade

~~~rust
/// 原owner safe binding与正式需求wrapper组合；不声明上游已有同名方法。
pub struct BoundConversationOwnerAdapter<'d> {
    /// 原Step6 safe adapter合同，与actual driver kind/source/window逐项一致。
    contract: ConversationOwnerAdapter,
    /// 当前Conversation正式需求wrapper，非上游已有同名API声明。
    driver: &'d dyn ConversationOwnerRequirements,
}
/// 原owner safe binding与正式需求wrapper组合；不声明上游已有同名方法。
pub struct BoundIdentityOwnerAdapter<'d> {
    /// 原Step6 safe adapter合同，与actual driver kind/source/window逐项一致。
    contract: IdentityOwnerAdapter,
    /// 正式Identity AI锚点需求wrapper，不创建external human成员。
    driver: &'d dyn IdentityOwnerRequirements,
}
/// 原owner safe binding与正式需求wrapper组合；不声明上游已有同名方法。
pub struct BoundGovernanceOwnerAdapter<'d> {
    /// 原Step6 safe adapter合同，与actual driver kind/source/window逐项一致。
    contract: GovernanceOwnerAdapter,
    /// 正式Policy/Gate/action需求wrapper，不给Bridges Decision写权。
    driver: &'d dyn GovernanceOwnerRequirements,
}
/// 原owner safe binding与正式需求wrapper组合；不声明上游已有同名方法。
pub struct BoundArtifactOwnerAdapter<'d> {
    /// 原Step6 safe adapter合同，与actual driver kind/source/window逐项一致。
    contract: ArtifactOwnerAdapter,
    /// 正式material/附件安全准入wrapper，不返回公开URL/正文。
    driver: &'d dyn ArtifactOwnerRequirements,
}
/// 原owner safe binding与正式需求wrapper组合；不声明上游已有同名方法。
pub struct BoundWorkspaceOwnerAdapter<'d> {
    /// 原Step6 safe adapter合同，与actual driver kind/source/window逐项一致。
    contract: WorkspaceOwnerAdapter,
    /// 仅选用分支的safe provenance wrapper，不作频道/权限owner。
    driver: &'d dyn WorkspaceOwnerRequirements,
}
/// 原owner safe binding与正式需求wrapper组合；不声明上游已有同名方法。
pub struct BoundObservabilityOwnerAdapter<'d> {
    /// 原Step6 safe adapter合同，与actual driver kind/source/window逐项一致。
    contract: ObservabilityOwnerAdapter,
    /// 正式producer/consumer需求wrapper，缺准入仍blocked。
    driver: &'d dyn ObservabilityOwnerRequirements,
}

/// 六owner正式binding的组合反腐层，唯一实现跨owner qualification ports。
pub struct OwnerPortFacade<'d> {
    /// exact Conversation正式binding；required缺失保持blocked。
    conversation: BoundConversationOwnerAdapter<'d>,
    /// exact Identity正式binding；required缺失保持blocked。
    identity: BoundIdentityOwnerAdapter<'d>,
    /// exact Governance正式binding；required缺失保持blocked。
    governance: BoundGovernanceOwnerAdapter<'d>,
    /// exact Artifact正式binding；required缺失保持blocked。
    artifact: BoundArtifactOwnerAdapter<'d>,
    /// exact Workspace正式binding；required缺失保持blocked。
    workspace: Option<BoundWorkspaceOwnerAdapter<'d>>,
    /// exact Observability正式binding；required缺失保持blocked。
    observability: BoundObservabilityOwnerAdapter<'d>,
    /// actual正式来源/版本/scope依据；shape合法不等已授权。
    qualification: SafeAuthorityRef,
}
~~~

Bound factory核OwnerContractBinding.owner exact kind、source/version/scope/window和driver compatibility；不返回driver getter。Workspace Option仅当当前分支及owner规则明确不适用时None，不能用配置开关省略required provenance。Facade实现下表Application port；每个Qualified结果取所有required owner validity交集，任一Blocked/Unavailable不取旧快照放行。

| Application port | owner组合与双向mapping | 明确禁止 |
|---|---|---|
| BindingQualificationPort | Governance显式Policy/basis/target/action；Identity仅AI锚点；actual relation/local snapshot由Application传入 | external_id/PAT/role/ref shape授relation或GlobalMember |
| ConversationHandoffPort | Conversation target/mode/result + Artifact material/attachment；Governance current binding | 本地造Turn/participant/digest、平台ACK收owner结果 |
| PresentationQualificationPort | Governance disclosure/Gate/degraded + Artifact grant + 条件Workspace provenance；source owner committed | 低敏感默认批准、敏感审批正文降级、公开附件URL |
| ActorResponsibilityPort | Human/Integration由正式认证+Governance责任；AI再核Identity锚点；relation/current共同约束 | 任意平台user/bot变内部Actor/审批者 |
| OwnerActionPort | Governance target/kind/revision/authorization/semantic/result；平台完整verification另由router | Bridges直接写Decision、按钮/签名等同approve |
| SafeObservationPort | Observability producer schema/canonical/admission/consumer result；actual audit/commit由Application给 | 复用其他producer family、ACK=evidence/verdict |
| SafeReadQualificationPort | subject owner visibility + Governance disclosure；选用Workspace时追加safe provenance | 查询触发repair/probe或泄hidden ref/count |

当前Observability正式static producer map没有Bridges producer family，`ConsumeSourceAuditMaterial`也不接Bridges来源；因此对应Mandatory/OptionalQualified路径保持NotEstablished/Blocked。不得由本项目发明family/schema或跨项目回写。Workspace开放项同样保留，只有选择该分支才required，但选择后不能降成optional。

受权R1/R2/R4/R5的具名方法仍是Bridges adapter-local requirement，不宣称上游已有同名API。OwnerPortFacade按原binding把新增tombstone/lane/retry/consumer-probe/nonrecursive方法逐字段委派上面的Requirements，附同source/scope/version/window核验。lane/retry的组合wrapper必须从正式平台capability/rate registry与配置预算引用取得scope/dependency/all bounds、从Governance取得Policy/presentation交集；不能只凭Governance规则生成外部bucket、只凭capability ref猜major_resource，或重置原scope预算。任一引用无正式可解引用兼容面NotEstablished，厂商SDK/OAuth/API Key/KMS/route选择仍未建立；不新增业务port或外部truth。

## 4. local store、commit probe与recovery组合

### 4.1 LocalStoreAdapter实现面

`LocalStoreAdapter`唯一实现八repository及`LocalUnitOfWorkPort`；所有实例必须同一`LocalStorageBinding`的scope/schema/driver/config。不能把各repo绑定到不同DB、不同transaction manager或测试memory store后声称原子。具体DB/ORM/DDL未选，当前adapter availability为NotSelected/NotEstablished。

| local对象族 | Application port读面 | write/唯一/version合同 | 禁止 |
|---|---|---|---|
| BridgeInstallation | Installation get/namespace/snapshot/page | namespace唯一；LocalRevision + ConfigRevision；stage同tx | raw settings/secret值/默认tenant |
| ExternalBinding及三mapping | Mapping relation/ref/外部/内部双向lookup、完整snapshot/关联页 | installation+external/target/action候选不歧义；typed mapping unique；LocalRevision + BindingGeneration | owner actor/channel/message truth、first row猜target |
| InboundHandoffRecord | ref/source/original/snapshot | verified source和original关联；claim/dedup/result同tx；LocalRevision | raw message/inbox、ACK=owner commit |
| Plan/Intent/Attempt/Receipt | ref/effect/original/snapshot/binding/intent页 | StableEffectIdentity唯一；attempt+fence；receipt immutable Absent append；LocalRevision | platform truth镜像、unknown造receipt |
| Action/Callback | action/source/verification/original/snapshot/page | source-action唯一；one-use fence/claim + callback/result同tx；LocalRevision | token/callback正文、claimed复活 |
| Dedup/Cursor/Gap/Recovery | exact key/stream/epoch/range/original/snapshot/eligible页 | key+meaning唯一；LocalRevision + CursorRevision；coverage完整；same-op recovery | expired覆盖、offset字符串比较、NotFound=no-effect |
| DispatchLane | scope/snapshot/shared bounds/affected/eligible页 | scope唯一；LocalRevision + LaneRevision + monotonic fence；所有共享下界 | process mutex冒充跨实例协调、unknown清head |
| SafeAudit/SafeHandoff/result sidecar | audit/mutation、handoff/op、safe result key/op、eligible页 | audit/result immutable；handoff CAS/claim；与所有subject/result/canonical同tx | HandoffRepository、第九repo、raw/evidence |

受权首建/新read root：LaneRepository.insert_for_scope必须固定lane/local两轴Absent与qualified scope唯一，初始两revision均1，同tx plan/intent/effect/dedup完整compare，冲突零局部落盘。OperationSnapshot按实际同driver operation/result journal精确读取完整original+非空全量safe results+read_basis；PresentationSnapshot、ActionSnapshot直接完整get原plan/action，不要求存在intent/callback。所有新增读root执行同read资格、hydration/schema与row budget，截断/未建立读合同Unavailable，不改旧result或伪NoEffect。

每个get/find/list必须按Application签名重建完整typed model、actual LocalRevision和`LocalHydrationBasisRef`；decoder核stored kind/schema/namespace/field closure，wrong/unknown schema为InvariantViolation或NotEstablished，不能丢字段默认。transaction baseline只一致已提交数据，不返回staged candidate作hydration。分页cursor由driver opaque生成并绑定actor/access/namespace/scope/filter/order/source/window；普通跨页不是历史snapshot，最终mutation按实际CAS重核。

### 4.2 driver最低能力与commit proof

计划`crates/infra/src/persistence/local_store.rs`的具体产品wrapper必须提供以下能力，未满足不能绑定：

| driver能力 | typed输入 | 必需结果 / failure |
|---|---|---|
| consistent read | LocalStorageBinding、BridgeLocalReadSession、具名key/filter/page | 完整committed rows+hydration+expected set；budget/qualification enforced |
| begin registry | mutation/original/expected/schema/source/deadline | actual registered unique BridgeLocalTransaction；同mutation重复只原状态 |
| CAS/unique compare | ExpectedLocalRevisionSet及config/generation/cursor/lane独立条件 | LocalCasDisposition；任一失败零stage覆盖 |
| staged writes | 19 PreparedLocalChange、safe result/audit/conditional handoff/claims | 每subject BridgeStagedWriteRef；write set与plan可全等核验 |
| seal/commit | QualifiedLocalMutationPlan与实际stage registry | all-or-none LocalCommitDisposition；Committed带完整revision changes/authority |
| rollback | 未提交原tx | actual LocalRollbackProof或Indeterminate；drop/timeout不是proof |
| original probe | exact mutation/original/same schema/source | only Committed/RolledBack/Indeterminate，NotFound不转RolledBack |
| shared coordination | lane scope/bucket/unique key/fence | 跨实例原子约束；不能只单process lock/cache |

技术clock、LocalObjectId、fence和cursor token由同qualified composition中的真实provider提供；算法/entropy/clock/codec未选时相应方法NotEstablished。ID不从external ID/body/trace/time派生，meaning不hash正文；safe opaque token不可泄SQL/DSN/raw主键。commit proof不能由affected row count、client ACK或写后自行构造basis代替。

### 4.3 LocalCommitProbeAdapter与RecoveryPortFacade

~~~rust
/// local、owner、platform与consumer原阶段只读probe的组合选择器。
pub struct RecoveryPortFacade<'d> {
    /// 同storage binding的原mutation只读probe，不从日志推commit。
    local: &'d LocalCommitProbeAdapter,
    /// exact installation/platform/source router，禁止跨安装fallback。
    platforms: &'d PlatformPortRouter<'d>,
    /// 六owner正式绑定组合，不访问owner私表或自由request。
    owners: &'d OwnerPortFacade<'d>,
    /// actual正式来源/版本/scope依据；shape合法不等已授权。
    qualification: SafeAuthorityRef,
}
~~~

`LocalCommitProbeAdapter`只与LocalStoreAdapter同binding/driver/schema，执行`probe_local_commit`，不访问日志/副本猜结果。`RecoveryPortFacade`实现AuthoritativeRecoveryPort：从`RecoveryQualificationRef.subject/source`排他选择local mutation、Conversation inbound、Governance action、platform effect、Observability consumer或gap coverage；wrong stage/source拒绝，不fallback到另owner。`probe_original`无权发送新请求效果；只允许owner/platform正式readonly查询。gap comparator/coverage来自source正式合同，partial/Unavailable保gap/manual。所有probe预算来自原qualification，不由job续租生成新permission。

| RecoveryPort方法 | exact需求承接 / private边界 |
|---|---|
| qualify_request | Governance `qualify_recovery_request`核actor请求权限；subject/op/source实际关联由所属正式owner核验，无probe/send。 |
| qualify | Governance `qualify_recovery`核维护授权，再按actual subject/source选择Conversation/Governance/Observability同名需求或platform `qualify_recovery`；local仅同driver原mutation/source。required结果逐字段一致并取窗口交集，不能跨owner复制ref。 |
| probe_local_commit | 同binding LocalCommitProbeAdapter，只LocalCommitDisposition；不套外部ProbeOutcome。 |
| locate_local_unknown | 同binding LocalCommitProbeAdapter的下列具名方法，唯一actual unresolved mutation；多阶段Conflict、无行None，不按latest推断。 |
| qualify_stage_coverage | 同binding LocalCommitProbeAdapter的下列具名方法 + 正式source comparator；Maintenance read预算内完整stage/gap结果，不取source coverage冒充stage。 |
| probe_original | Conversation `read_original_result`、Governance `read_original_action_result`、Observability `read_original_result`，按原stage转既有AuthoritativeProbeResultRef；platform转同router/driver `probe_original`并短借Application提供的actual secret。local调用此方法拒绝，应走独立local分支。 |
| probe_gap / compare_position | actual stream.source排他选择PlatformDriverRequirements或Conversation/Governance/Observability同名需求；没有正式source coverage/comparator的Local/Artifact/Workspace或其他分支返回Unavailable/Unsupported、保gap/manual，不能由通用API拼覆盖。 |

`probe_original`/`probe_gap`的Option secret不由facade解析或缓存：平台readonly method要求凭据却None即NotEstablished；正式无凭据method只按actual capability依据允许None；owner/local/consumer分支必须None。J02/J03的owning lease须活过probe Future；facade不读repository、env/KMS或secret settings补凭据，不新增效果。Known/NoEffect转换只采用正式原op结果依据；没有兼容result/stage转换同样blocked。

受权R4新增的local技术方法归`persistence/commit_probe.rs`，只使用原binding同driver已登记能力，不增加repository：

| 完整签名 | 中文Rustdoc / 来源与结果 |
|---|---|
| `pub fn locate_local_unknown<'a>(&'a self, subject: &'a OriginalRecoverableSubjectRef, original: &'a OriginalOperationEffectRef, read: &'a BridgeLocalReadContext, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, Option<LocalMutationRef>>` | /// 有界actual原journal unique未决阶段定位；None不证无效果，多阶段Conflict，缺产品能力NotEstablished。 |
| `pub fn qualify_stage_coverage<'a>(&'a self, cursor: &'a StreamCursor, snapshot: &'a ContinuitySnapshot, comparator: &'a AuthoritativeComparatorRef, read: &'a BridgeLocalReadContext, job: &'a TrustedJobContext, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, BridgeQualificationOutcome<ContinuityCoverageRef>>` | /// 按Application原五字段来源合同核全部committed stage与closed gaps；qualified Maintenance/read/budget、formal comparator、same driver/schema必要，partial/unknown不能Qualified。 |

platform `probe_original`只在正式readonly结果具备完整`KnownPlatformBusinessResult { result, bounds }`（同一次业务响应，或actual原immutable receipt完整重建）时返回ProbeOutcome::Platform。无法取得同次bounds则Unknown/Unavailable，禁止取现时rate补原结果。owner/local/consumer结果不得装此variant；实际known result仍保原责任，不因local finalize失败重发。

## 5. private material、secret、config与event/audit adapter

### 5.1 qualified provider requirement

~~~rust
/// 实际材料provider的本call owning读取/渲染要求。
pub trait PrivateMaterialProviderRequirements {
    /// 受限bytes budget内owning读取原qualified材料，禁止durable缓存。
    fn read_material<'a>(&'a self, current: &'a CurrentMaterialQualification, scope: &'a SafeScopeRef, max_bytes: u64, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, BridgeMaterialLease>;
    /// 按原plan/attempt/current只渲染获准payload，不加入secret。
    fn render_payload<'a>(&'a self, plan: &'a SafePresentationPlan, attempt: &'a AttemptEffectRef, current: &'a CurrentPresentationQualification, max_bytes: u64, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, BridgePayloadLease>;
}
/// 实际secret provider的exact版本owning解析要求。
pub trait SecretProviderRequirements {
    /// exact用途/provider/key/version owning解析，secret只本call。
    fn resolve<'a>(&'a self, current: &'a QualifiedSecretUseContext, max_bytes: u64, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, BridgeSecretLease>;
    /// 最后IO前重核same secret版本/撤销/窗口，不自动续期。
    fn revalidate<'a>(&'a self, current: &'a QualifiedSecretUseContext, revision: &'a SafeRevision, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, BridgeQualificationOutcome<QualifiedSecretUseContext>>;
}
/// actual材料provider的scoped绑定，不产生durable正文缓存。
pub struct BoundPrivateMaterialAdapter<'d> {
    /// actual受核材料provider引用，只本call owning读取。
    driver: &'d dyn PrivateMaterialProviderRequirements,
    /// actual qualified source/version/scope定位，不包含私有endpoint/token。
    source: SafeAuthoritySourceRef,
    /// 受核非零private byte上限，超限拒绝且不落raw。
    limit: u64,
}
/// actual exact secret provider绑定，不提供生产fallback或secret getter。
pub struct BoundSecretAdapter<'d> {
    /// actual exact secret provider引用，不以env/test fake生产fallback。
    driver: &'d dyn SecretProviderRequirements,
    /// actual qualified source/version/scope定位，不包含私有endpoint/token。
    source: SafeAuthoritySourceRef,
    /// 受核非零private byte上限，超限拒绝且不落raw。
    limit: u64,
}
~~~

Bound factory核实际source/version/scope/provider qualification及非零limit，不返回driver；分别实现PrivateMaterialPort/SecretResolutionPort。provider不得写durable cache/temp file/dead-letter或把bytes放Error/source/log；实际复制与销毁策略到Step14/04绑定。KMS/Vault/env/OAuth/token provider均未选，环境变量明文或test fake不能作为生产fallback。secret rotation/revoke每次call核，OAuth scope也不等内部authority。

### 5.2 ConfigQualificationAdapter

计划`configuration/settings.rs/load.rs/validate.rs/qualification.rs`只消费结构化safe settings、opaque refs和正式source，不读任意JSON map或把secret body放settings。

~~~rust
/// current safe配置及required seam的qualified绑定，不拥有平台安装truth。
pub struct BoundConfigQualificationAdapter {
    /// structured安全settings与opaque refs，不包含secret值。
    settings: SafeRuntimeSettings,
    /// 已选分支的完整required集合，不能配置关闭mandatory观测。
    required: RuntimeRequiredSeams,
    /// actual qualified source/version/scope定位，不包含私有endpoint/token。
    source: SafeAuthoritySourceRef,
    /// actual装配处置及窗口，Qualified不替每次业务current。
    availability: RuntimeAvailability,
}
~~~

该adapter实现ConfigQualificationPort；factory核installation namespace唯一、platform kind、config revision、capability/method、route、opaque secret ref、source family mode排他、rate scope及每branch required seam。Qualified availability有有限窗口且不替每次业务current；owner允许省略只能`OwnerPermitsOmission`实际basis。配置优先级、文件/env/remote provider、router、SDK feature、HTTP server、Bus与executor均到Step14/04选定；当前不能声称loader路径可用。

受权expiry repair：同adapter实现 `ConfigQualificationPort::qualify_dedup_expiry`（完整签名见Step7 Application原trait）。只消费批准的safe retention config source/revision、实际原Dedup/window、Maintenance read/job actor/basis及正式Policy/Gate适用性，不拥有上游Policy或Observability retention/protection truth。Config只是seam，本地TTL设置和clock不签发authority；缺批准来源/治理兼容合同BR-UP-003/009保持NotEstablished。符合来源合同后才构造原safe thin proof，proof window独立于已到期保留窗口；不增加secret/material/业务probe或第24port。LocalStoreAdapter同步支持十一variant snapshot及九body族J05选择，实际Dedup版本行从原Continuity存储取得；候选只到期非Expired行，selection不是expiry授权，invoke重读核原expected。

### 5.3 Event transport与safe audit

`events/transport.rs`的transport wrapper只允许将已验证safe envelope转成Application的`CommittedSourceAvailableInput`或`SafeHandoffDispositionInput`，并将transport ACK单独映射；不得传external body、secret、完整owner对象或把ACK变consumer accepted。为使Worker没有raw delivery handle仍可一次性dispatch/ACK，定义以下technical host；它不计第24业务port：

~~~rust
/// 两个safe event入口的穷尽Application调用，不是通用event payload。
pub enum SafeTransportApplicationCall {
    /// 仅E02正式owner committed source input，不含正文。
    CommittedSource(CommittedSourceAvailableInput),
    /// 唯一Q04或E04原safe handoff，所属联合决定调用族。
    SafeHandoff(SafeHandoffDispositionInput),
}

/// 捕获本次private delivery handle的一次性ACK动作；只返回actual transport阶段。
pub type SafeTransportAckExecutor<'host> = Box<dyn SafeTransportAckCall + 'host>;

/// 一次性消费本次private delivery handle的technical ACK分面，不是业务port。
pub trait SafeTransportAckCall {
    /// Future拥有boxed宿主；显式Self:call保证捕获的driver/handle借用仍存活。
    fn execute<'call>(
        self: Box<Self>,
        disposition: &'call ConsumeDisposition,
        control: &'call BridgeCallControl<'call>,
    ) -> BridgePortFuture<'call, ProtocolAckDisposition>
    where Self: 'call;
}

/// actual safe source单项owning lease；ACK handle不可见且只能消费一次。
pub struct SafeTransportEventLease<'host> {
    /// 穷尽E02/E04调用，不接受free-form payload。
    call: SafeTransportApplicationCall,
    /// actual已注册consumer上下文，不由queue/body自报来源。
    context: TrustedConsumerContext,
    /// 正式safe envelope metadata，不能生成owner提交/accepted依据。
    metadata: SafeEventMetadata,
    /// actual原operation定位；E02起始None，E04必须Some且不得换op。
    original: Option<OriginalOperationRef>,
    /// 捕获private delivery handle的一次性ACK动作，无raw getter。
    ack: SafeTransportAckExecutor<'host>,
    /// actual来源期限交集，不因host retry重造或延长。
    validity: SafeValidityWindow,
}

/// 未选Bus/transport产品的safe source host要求；不暴露raw envelope或delivery token。
pub trait SafeEventTransportHost {
    /// 借用actual safe source注册，不授producer或consumer truth。
    fn source(&self) -> &SafeAuthoritySourceRef;
    /// 有界取一个safe E02/E04 owning lease，私有delivery handle不可见。
    fn next_event<'a>(&'a self, budget: &'a RuntimeExecutionBudget, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, Option<SafeTransportEventLease<'a>>>;
}
~~~

`SafeTransportEventLease`无public通用factory；仅bound Infra host可由正式producer registration、schema/version和actual delivery构造。其`into_dispatch_parts(self)`一次移交`(call, context, metadata, original, ack, validity)`；factory须逐字段核call内consumer/event key与外层context/metadata同源，E02初始original=None，E04必须Some且匹配原handoff operation。lease/ACK callback无Clone/Debug/serde/Display/Error-source，worker不能取得或记录private delivery handle。

ACK executor消费一次：输入只是Application实际`ConsumeDisposition`，source合同据此执行ACK/defer/reject并返回真实`ProtocolAckDisposition`；它不得把AcceptedLocal、Duplicate或transport ACK提升为owner/platform/consumer accepted。Application调用outer error只可先映为finite Rejected/Blocked/Indeterminate再交ACK策略，raw error/stack不进入参数。`None`仍只表示本次bounded poll为空，不是coverage或no-effect。Bus/topic/client未选，E02/E04 source registration缺失时NotEstablished。Source event的committed依据与consumer disposition必须由各owner正式签发，transport metadata只routing/trace，不生成truth。

`audit.rs`只执行allowlist清洗：可记录有限kind/stage/reason、安全opaque correlation及无敏感计数；禁止外部消息体、callback choice、附件正文/URL、token/secret、raw header、外部ID明文、敏感审批内容、可还原hash或stack。它不实现SafeTraceRepository、不建第二mutation producer、不提交Observability evidence/report/verdict；Query不因“审计”写业务记录。

封存复查最终ACK规则：SafeTransportAckCall是既有TransportHost的technical分面，由actual transport wrapper独占private delivery handle；execute消费Box<Self>，Self:call保证所有captured driver/handle至少活过返回Future，只能execute一次。它替换原HRTB FnOnce草案，不假定static client或延长lease；不进入Application 23业务port/registry。PlatformPortRouter另实现Application的BridgeProtocolAckExecutor technical分面，以self短借调用原driver.execute_ack，三个业务platform port责任不变。

## 6. runtime composition与required seam

### 6.1 唯一port注册表

计划归属`crates/infra/src/runtime/composition.rs`。此对象只在Infra构造19用例后消耗，api/jobs/worker不能取得它直接调用repo。

~~~rust
/// 实际qualified的23 Application port集合；不是service locator公共API。
pub struct QualifiedInfraPorts<'p> {
    /// 注入显式relation/action/两端mapping当前授权面。
    binding_qualification: &'p dyn BindingQualificationPort,
    /// 注入完整relation及三mapping双向读与同tx CAS面。
    mappings: &'p dyn MappingRepository,
    /// 注入完整安装/config/local revision读取与同tx暂存面。
    installations: &'p dyn InstallationRepository,
    /// 注入本call验源或原Protocol continuity资格面，不保存raw。
    platform_ingress: &'p dyn PlatformIngressPort,
    /// 注入正式target/material及原operation交接面，不造Turn。
    conversation: &'p dyn ConversationHandoffPort,
    /// 注入完整safe inbound record/source/op读取与同tx CAS面。
    inbound: &'p dyn InboundRepository,
    /// 注入current Policy/Gate/附件/原projection外显资格面。
    presentation: &'p dyn PresentationQualificationPort,
    /// 注入原attempt/effect单次dispatch或readonly probe，禁隐藏retry。
    platform_delivery: &'p dyn PlatformDeliveryPort,
    /// 注入完整plan/intent/attempt和immutable receipt读写面。
    delivery: &'p dyn DeliveryRepository,
    /// 注入平台callback source及known source核验面，不授审批权。
    callback_verification: &'p dyn CallbackVerificationPort,
    /// 注入原actor/account责任解析面，不从external_id创建成员。
    actors: &'p dyn ActorResponsibilityPort,
    /// 注入正式owner action/current语义及原result面，不本地写Decision。
    owner_actions: &'p dyn OwnerActionPort,
    /// 注入完整action/callback及one-use claim同tx CAS面。
    callbacks: &'p dyn CallbackRepository,
    /// 注入完整dedup/cursor/gap/recovery读及同tx CAS暂存面。
    continuity: &'p dyn ContinuityRepository,
    /// 注入原subject/op权威readonly恢复面，NotFound不等NoEffect。
    recovery: &'p dyn AuthoritativeRecoveryPort,
    /// 注入全部shared rate下界、顺序/fence及claim同tx CAS面。
    lanes: &'p dyn LaneRepository,
    /// 注入正式producer/consumer准入面，缺mandatory资格阻效果。
    observation: &'p dyn SafeObservationPort,
    /// 注入resolver-first current披露面，hidden ref/count不可输出。
    safe_read: &'p dyn SafeReadQualificationPort,
    /// 注入完整immutable audit/result和handoff CAS读写面。
    trace: &'p dyn SafeTraceRepository,
    /// 注入本call owning材料/投递payload面，raw不durable。
    private_material: &'p dyn PrivateMaterialPort,
    /// 注入exact provider/key/version本call lease及撤销重验面。
    secrets: &'p dyn SecretResolutionPort,
    /// 注入安全配置、maintenance read和exact secret用途资格面。
    config: &'p dyn ConfigQualificationPort,
    /// 注入技术clock/ID/key及同driver原子提交面，不以stage代commit。
    local_uow: &'p dyn LocalUnitOfWorkPort,
    /// actual来源期限交集，不因host retry重造或延长。
    validity: SafeValidityWindow,
}
~~~

factory完整接上述23非Option引用和validity，逐`RuntimeSeamKind`核source/qualification/applicability、same local binding、platform/owner kind、分支及source registration；无public getter，只有runtime内部`build_application_callables(&self)`按A7 exact constructor创建具名use case。任何缺required、重复、expired、wrong source/schema或owner-permits依据不成立均返回NotEstablished/InvariantViolation，不能用空adapter/fake补齐。

TrustedClock和LocalIdSource虽然在LocalUnitOfWorkPort实现内，仍作为独立RuntimeSeamBinding核实际provider；TransportHost只供entry/source/ACK，不流入Application port注册。三者不把23变26个业务port。

### 6.2 分支最低required矩阵

表中`local common`=`LocalUnitOfWorkPort + ContinuityRepository + SafeTraceRepository + SafeObservationPort + SafeReadQualificationPort + TrustedClock + LocalIdSource`；mutating分支只要owner规则mandatory就不得省Observation。具体19 use case还按A7精确依赖取子集，矩阵是装配下限而非运行权限。

| RuntimeBranchKind | required业务port / technical host | 条件或排他 |
|---|---|---|
| Management | BindingQualification、Installation/Mapping/Delivery/Callback/Continuity repositories、Presentation/Actor/OwnerAction/Config/Recovery；local common | 只实际启用C01~06的并集；未启用入口不能暗开 |
| Inbound | Installation/Mapping/Inbound、PlatformIngress、ConversationHandoff、ActorResponsibility、PrivateMaterial/Secret/Config；local common；TransportHost | E01同family一个HTTP/socket/poll/gateway mode |
| Preparation | PresentationQualification、DeliveryRepository；local common；E02时TransportHost | C04和E02同effect recipe；E02 source需正式owner event |
| Dispatch | Delivery/Lane、Presentation/PlatformDelivery、PrivateMaterial/Secret/Config；local common | J01无隐藏SDK retry；platform exact installation |
| Callback | Installation/Mapping/Delivery/Callback、CallbackVerification/Actor/OwnerAction、Secret/Config；local common；TransportHost | E03 source family排他，C05不需要private callback |
| Recovery | Continuity及受影响repo、AuthoritativeRecovery、PlatformDelivery/owner readonly seam、Secret/Config；local common | 只original probe，无new effect |
| SafeRead | SafeReadQualification及被查询repo；无mutation/eligible/probe；TrustedClock只current window | Workspace仅选用时required；Query不需LocalIdSource/UoW write |
| SafeHandoff | SafeObservation/SafeTrace；local common；E04时TransportHost | Observability producer/consumer合同未建立时blocked |
| Qualification | Config/Binding/Presentation/Actor/OwnerAction/SafeObservation、八repo/UoW；local common | J05只既有subject、bounded page，不授新权 |
| WorkspaceRead | Workspace owner requirement + SafeReadQualification | 仅owner规则/产品选择明确启用；不作其他分支fallback |

同一installation+family的source mode必须exact一个；Telegram polling/webhook、Slack Events/Socket、Mattermost trusted HTTP/WebSocket、Discord interaction/Gateway不能对同一source重复消费。不同family是否可各选模式必须平台capability/部署合同明确，不由router推断。source断开/重连不证明coverage，session epoch/gap按Worker合同保留。

### 6.3 runtime execution边界

计划归属既有`crates/infra/src/runtime/execution.rs`的TrustedClock technical分面：

~~~rust
/// entry获取本次actual时刻的scoped技术宿主；不是Application第24业务port。
pub trait ScopedRuntimeClock {
    /// 与control deadline/资格窗口同clock域；只核cancel/预算并读一次实际provider。
    fn now<'a>(&'a self, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, SafeInstant>;
}
~~~

runtime以既有TrustedClock seam核source/version/scope/clock域和实际provider；clock产品未建立则NotEstablished，不接受客户端timestamp、timer tick或worker自造now。此宿主只供API/Jobs/Worker admission、phase和纯guard，不能分配ID/生成权限/推进cursor；Application仍通过LocalUnitOfWorkPort::now或所属qualification的actual clock independently核业务current。两分面须绑定同一actual provider/clock域，调用now先检查cancel/预算、取得实际时刻后核deadline，不递归调用自身。Query只用technical clock，不注入UoW写port。

本Step required表是对Step6 RuntimeRequiredSeams闭包的补全，不删除其CommonRead、MutatingLocal、TransportHost或各分支既有required；最终装配取Step6表与当前19callable exact依赖、technical host的并集，再按实际启用分支裁剪。不得因某一callable当前未直接调用port就把已声明的分支资格移除。Preparation新增Installation/Config/Binding/Mapping/Actor实际读取；Dispatch新增Installation/Binding/Mapping；Recovery新增原Installation、current Secret及Mapping/Lane finalize读写，仍不具备send/action默认路径。

`execution.rs`只把`RuntimeCompositionPlan`和actual qualified ports/host交给未来executor，维护`RuntimeExecutionState`；不执行business route。max_inflight/max_batch/private bytes/wait/shutdown deadline全部nonzero有界，实际executor若不能scoped poll非Send Future则NotEstablished，不能偷偷spawn detached任务。Draining停止接新item但等待中的owner/platform可能unknown；shutdown后有未决原op/effect必须`StoppedWithUnknown`并交原恢复记录，不标rollback/no-effect。

HTTP server/router、worker loop、job CLI与executor产品未选；runtime不会通过URL路径、环境变量或二进制名称推断安装/actor/action。route只能从qualified registration匹配exact protocol family/version/content type/installation，unknown route拒绝且不记录body。

## 7. Infra草稿、复杂度与停审

未来正式§5 Infra小节引用：四typed platform mapping、六owner需求与组合facade、同源LocalStore/commit probe、private/secret/config/event/audit及runtime required matrix；§6只列adapter/helper索引，不把technical requirement计业务port。

| 审查项 | 结论 |
|---|---|
| 23port实现 | router 3 platform ports；owner facade 7 owner/read ports；LocalStore 8 repo+UoW；Recovery facade 1；private/secret/config 3，总计23且每个唯一实现责任可定位 |
| 双向mapping | 四平台分别覆盖source/account/location/message/thread/change/callback/ACK/outbound/rate/probe；不宣平台truth |
| owner | 六owner职责不混；Identity不建human，Governance不被本地写，Workspace条件，Observability producer缺口保留 |
| private/secret | owning lease -> short borrow，no raw log/store，drop非zeroize；KMS/OAuth/API Key未选 |
| storage | 19模型+safe result、8repo/UoW同driver，CAS/unique/claim/result/audit/handoff原子；DB未选 |
| runtime | 23+3 technical seam逐branch核，entry无法取得repo；source mode排他、cancel/unknown保留 |
| 复杂度 | 新helper只消除heterogeneous adapter/runtime装配，不增加业务truth/state/request/port；产品差异保逐平台表 |

I人工设计自检pass。X路径审计已把切口归回Step4既有文件：`crates/infra/tests/platform_boundary_tests.rs`承接四平台mapping/ACK/rate/unknown、六owner blocked/current及runtime required/mode/expiry分组；`crates/infra/tests/local_commit_boundary_tests.rs`承接重建/CAS/unique/UoW/probe；`crates/infra/tests/private_material_boundary_tests.rs`承接no raw/lease/secret。只在既有target内规划分组，不新增owner/runtime测试文件。均只定义切口，未实现/执行，不产生report/evidence。BR-UP-001~009仍open，下一仅API P。
