# L6-bridges 03 Step7：19个Application仓内callable

## 1. 范围与共用规则

A7问题/诊断/取舍已done。本页先完整仓内input/依赖注入，再逐个用例给出方法、port、结果、事务与测试切口。19个既有use case保持独立，不增加第20入口、通用Application service、selector或replay。

计划路径沿Step4既有用例、`metadata_validation.rs`与`local_mutation.rs`；以下input是Application参数，不是Step8尚未定义的wire body。构造只校shape，实际资格由port取得。所有边界Future统一`BridgePortFuture<'call,T>`，错误统一`BridgePortError`。

mutable流程均为：trusted context -> 完整local snapshot/version/read_basis -> qualified key/meaning/current -> pure Domain候选 -> 同driver UoW/CAS/stage/audit/result -> actual commit；外部IO只在actual claim和最后current核验后执行。ACK、local commit、owner/platform/consumer结果保持独立。Query无mutation/UoW/refresh/probe/repair。

private raw只在本次call验证或provider转换，不能进入日志、证据、stored result或跨Future缓存；duplicate复用原safe result/阶段，不重新解释正文或执行新效果，但仍须按协议需要完成来源验签。

## 2. 仓内调用上下文

计划归属`crates/application/src/metadata_validation.rs`。

~~~rust
/// trusted命令上下文，不由请求体自报authority。
pub struct BridgeCommandCallContext {
    /// 实际认证入口提供的core actor/origin，role hint不授owner权限。
    actor: ActorContext,
    /// 原命令core metadata，required key不从正文/trace重造。
    metadata: CommandMetadata,
    /// actual正式来源/版本/scope依据；shape合法不等已授权。
    authority: SafeAuthorityRef,
    /// 同一次trusted调用的安全trace，不作为semantic identity。
    trace: TrustedTraceRef,
}

/// trusted查询上下文，不能携带写/维护开关。
pub struct BridgeQueryCallContext {
    /// 实际认证入口提供的core actor/origin，role hint不授owner权限。
    actor: ActorContext,
    /// 原查询core metadata，不携写/维护key或修复开关。
    metadata: QueryMetadata,
    /// actual正式来源/版本/scope依据；shape合法不等已授权。
    authority: SafeAuthorityRef,
    /// 同一次trusted调用的安全trace，不作为semantic identity。
    trace: TrustedTraceRef,
}
~~~

`BridgeCommandCallContext`要求core metadata的idempotency key存在并来自真实入口；`BridgeQueryCallContext`只承接query page/consistency输入，不能转维护读。两者的factory不生成Actor/trace/权限。

计划归属`crates/application/src/local_mutation.rs`的私有依赖聚合：

~~~rust
/// 具名mutation用例的内部依赖聚合，不是第24业务port。
pub struct BridgeMutationPorts<'p> {
    /// 注入技术clock/ID/key及同driver原子提交面，不以stage代commit。
    pub(crate) uow: &'p dyn LocalUnitOfWorkPort,
    /// 注入完整dedup/cursor/gap/recovery读及同tx CAS暂存面。
    pub(crate) continuity: &'p dyn ContinuityRepository,
    /// 注入完整immutable audit/result和handoff CAS读写面。
    pub(crate) trace: &'p dyn SafeTraceRepository,
    /// 注入正式producer/consumer准入面，缺mandatory资格阻效果。
    pub(crate) observation: &'p dyn SafeObservationPort,
    /// 注入resolver-first current披露面，hidden ref/count不可输出。
    pub(crate) read: &'p dyn SafeReadQualificationPort,
}
~~~

该聚合不对外导出、不提供通用execute/route/replay方法；各用例仍只注入自己需要的既有port。

## 3. C01～C03 command input

### ConfigureInstallationInput

计划归属`crates/application/src/commands/configure_bridge_installation.rs`。

~~~rust
/// C01完整配置输入；不携凭据值或平台body。
pub struct ConfigureInstallationInput {
    /// actual认证入口完整命令上下文，不由请求体自报权限。
    context: BridgeCommandCallContext,
    /// 受权安装定位，仍须读取完整current安装，不以ref充当资格。
    installation: Option<BridgeInstallationRef>,
    /// 显式配置动作；仅Configure允许Absent初建条件。
    action: ConfigurationMutationKind,
    /// 完整structured安全draft，仅含opaque secret/route引用。
    draft: InstallationConfigDraft,
    /// actual原config版本条件；Configure外的动作必须Some，不由local revision代替。
    config_expected: Option<ExpectedConfigRevision>,
    /// actual local CAS条件，Absent/Present不得默换。
    local_expected: LocalRevisionCondition,
}
~~~

`None` installation和`None` config_expected仅允许Configure；ApplyRevision/Suspend/Retire必须实际安装、config revision和local Present 条件。C01先调用ConfigQualificationPort，再由InstallationRepository stage；不因配置接受宣称provider/SDK/secret可用。

### ManageBindingInput

计划归属`crates/application/src/commands/manage_external_binding.rs`。

~~~rust
/// C02显式relation管理输入。
pub struct ManageBindingInput {
    /// actual认证入口完整命令上下文，不由请求体自报权限。
    context: BridgeCommandCallContext,
    /// 受权安装定位，仍须读取完整current安装，不以ref充当资格。
    installation: BridgeInstallationRef,
    /// 原受权relation定位，creation动作以None单独标明。
    binding: Option<ExternalBindingRef>,
    /// body-free relation动作含义，重复key须逐字段一致。
    meaning: BindingMeaning,
    /// 原subject维护依据，仅对应动作允许Some，不续授权限。
    maintenance: Option<QualificationMaintenanceBasisRef>,
    /// 显式撤销依据，非动作需要时不得带入。
    revocation: Option<RevocationBasisRef>,
    /// actual local CAS条件，Absent/Present不得默换。
    local_expected: LocalRevisionCondition,
}
~~~

None binding仅Propose，由Application技术ID来源创建候选；Activate/Suspend/Expire/Revoke必须实际原relation。Activation用`BindingActivationQualification`和ExpectedGeneration，不把Pending当Active；actor责任、target、动作和安装generation逐项核验。

### MaintainMappingInput

计划归属`crates/application/src/commands/maintain_external_mapping.rs`。

~~~rust
/// C03三类mapping的严格typed输入，不接受任意map或raw String。
pub struct MaintainMappingInput {
    /// actual认证入口完整命令上下文，不由请求体自报权限。
    context: BridgeCommandCallContext,
    /// 原受权relation定位，creation动作以None单独标明。
    binding: ExternalBindingRef,
    /// actual binding generation条件，不由local revision替代。
    generation: ExpectedGeneration,
    /// 穷尽mapping动作，required字段由variant决定。
    change: BridgeMappingChange,
    /// actual local CAS条件，Absent/Present不得默换。
    local_expected: LocalRevisionCondition,
}
~~~

~~~rust
/// mapping kind决定必需字段；每个分支只能建立对应对象。
pub enum BridgeMappingChange {
    /// 建立explicit identity relation，不将external account变GlobalMember。
    LinkIdentity {
        /// 安装隔离的actual external账号，不是GlobalMember/Actor授权。
        account: ExternalAccountLocator,
        /// 明确Human/Integration/AI责任族，不能从bot标志猜内部角色。
        kind: BridgeActorKind,
        /// 正式既有actor定位，须再核责任/授权，不自动创建。
        actor: ActorRef,
        /// 两端identity映射的正式当前依据，不从external_id自签。
        basis: IdentityMappingBasisRef,
    },
    /// 建立explicit location/parent/target映射，缺父级不猜root。
    LinkLocation {
        /// 安装隔离的actual频道/topic/thread定位，不拥有平台truth。
        location: ExternalLocationLocator,
        /// 显式parent或正式Missing，缺父级不能猜root。
        parent: ParentLocationRefSlot,
        /// 正式内部target定位，仍须owner mode/visibility核验。
        target: BridgeInternalTargetRef,
        /// location/parent/内部target两端正式授权依据。
        basis: LocationMappingBasisRef,
    },
    /// 只由actual known结果建立原消息回链，unknown不能使用。
    LinkMessage {
        /// 安装隔离的actual消息定位，不代表owner已提交。
        message: ExternalMessageLocator,
        /// safe source及exact原版本，禁止正文hash或换新版本。
        source: SafeSourceVersionRef,
        /// actual create/edit/delete变化语义，缺能力不默换create。
        change: ExternalChangeKind,
        /// actual known owner/platform结果回链，unknown不可生成。
        result: KnownMappingResultRef,
        /// 显式双向mapping生成方向，不从状态字符串推断。
        direction: MappingGenerationDirection,
        /// actual验源origin/原effect依据，用于anti-loop，不只看bot_id。
        origin: VerifiedOriginMarkerRef,
        /// 原message/source/version/known结果的正式映射依据。
        basis: MappingBasisRef,
    },
    /// 按原mapping及explicit basis失效，不复活旧generation。
    Invalidate {
        /// 既有typed mapping定位，必须same relation/namespace。
        mapping: MappingRef,
        /// 原mapping显式失效依据，终态不得复活。
        basis: MappingInvalidationBasisRef,
    },
    /// 按owner处置保留原message回链墓碑，不删原result。
    Tombstone {
        /// 原消息mapping定位，不因delete删除原result。
        mapping: MessageMappingRef,
        /// 正式owner change处置依据，不由外部ACK生成。
        disposition: OwnerChangeDispositionRef,
    },
}
~~~

Link只允许Absent；Invalidate/Tombstone只允许实际Present。external account不创建GlobalMember，message必须有真实source/version与known result；unknown、Stale、Revoked、缺parent或跨generation返回有限失败，不自动修复或换target。

## 4. C04～C06 command input

### PrepareDeliveryInput

计划归属`crates/application/src/commands/prepare_external_delivery.rs`。

~~~rust
/// C04只准备原投递effect，不直接send。
pub struct PrepareDeliveryInput {
    /// actual认证入口完整命令上下文，不由请求体自报权限。
    context: BridgeCommandCallContext,
    /// actual owner committed source/version，平台ACK不生成。
    source: CommittedSourceVersionRef,
    /// 原effect的不可变受权target，不因retry换频道/收件人。
    target: ImmutableDeliveryTargetRef,
    /// 明确create/edit/delete/reply动作，不自动降为其他method。
    kind: ExternalDeliveryKind,
}
~~~

C04先从Installation/Mapping读取完整安装与绑定两端，BindingQualificationPort及ActorResponsibilityPort核当前relation/action/actor，再PresentationQualificationPort核source/projection/Gate/附件/explicit degraded；DeliveryRepository按C04/E02相同`StableEffectIdentity`查重并stage plan/intent。不调用PlatformDeliveryPort，不从source正文生成meaning或新effect；ConfigQualification只核准备分支所需配置，不要求实际send provider已经可用。

### BindActionInput

计划归属`crates/application/src/commands/bind_external_action.rs`。

~~~rust
/// C05初始known source-action绑定输入，不是callback消费。
pub struct BindActionInput {
    /// actual认证入口完整命令上下文，不由请求体自报权限。
    context: BridgeCommandCallContext,
    /// 原受权relation定位，creation动作以None单独标明。
    binding: ExternalBindingRef,
    /// 原known intent/message/source关联，仍须两端current核验。
    source: SourceIntentMessageRef,
    /// 正式owner target/action kind定位，按钮不授执行权。
    target: OwnerTargetActionRef,
    /// actual account/actor/target/action责任依据，调用前再核撤销。
    responsibility: ActorResponsibilityRef,
}
~~~

C05由InstallationRepository读取完整实际安装，CallbackVerificationPort按该安装核known source绑定，再调用ActorResponsibilityPort与OwnerActionPort建立当前`ActionBindingQualification`；不得要求尚不存在的callback `CallbackVerificationRef`，也不消费one-use、发送审批或写owner Decision。

### RequestRecoveryInput

计划归属`crates/application/src/commands/request_bridge_recovery.rs`。

~~~rust
/// C06只请求已有subject/op的有界恢复维护。
pub struct RequestRecoveryInput {
    /// actual认证入口完整命令上下文，不由请求体自报权限。
    context: BridgeCommandCallContext,
    /// 原可恢复subject及所属stage定位，不创建新效果。
    subject: OriginalRecoverableSubjectRef,
    /// actual原operation/effect定位，unknown不得替换或清除。
    original: OriginalOperationEffectRef,
    /// 原scope恢复授权候选，必须经正式qualify_request/current重验。
    authorization: RecoveryAuthorizationRef,
}
~~~

C06先调用AuthoritativeRecoveryPort::qualify_request核原subject/op与actual actor的请求授权，再查重/建立原subject recovery记录，调用ContinuityRepository stage；不执行probe、重发、推进cursor或清除unknown。原subject、operation、effect、scope必须实际关联，不能把请求体的RecoveryAuthorizationRef当成已授权。

## 5. C01～C06 callable签名与结果

统一计划归属各对应command文件的`pub struct <UseCase>`；所有依赖通过构造注入，入口方法只接对应input和`&BridgeCallControl`。

~~~rust
/// C01安全配置接纳，local提交不等provider可用。
pub struct ConfigureBridgeInstallation<'p> {
    /// 注入安全配置、maintenance read和exact secret用途资格面。
    config: &'p dyn ConfigQualificationPort,
    /// 注入完整安装/config/local revision读取与同tx暂存面。
    installation: &'p dyn InstallationRepository,
    /// 本用例private共享mutation依赖，不暴露通用service locator。
    mutation: BridgeMutationPorts<'p>,
}
/// C02显式relation管理，授权与binding generation独立核验。
pub struct ManageExternalBinding<'p> {
    /// 注入显式relation/action/两端mapping当前授权面。
    qualification: &'p dyn BindingQualificationPort,
    /// 注入完整安装/config/local revision读取与同tx暂存面。
    installation: &'p dyn InstallationRepository,
    /// 注入完整relation及三mapping双向读与同tx CAS面。
    mapping: &'p dyn MappingRepository,
    /// 本用例private共享mutation依赖，不暴露通用service locator。
    mutation: BridgeMutationPorts<'p>,
}
/// C03受权typed mapping维护，不创建GlobalMember。
pub struct MaintainExternalMapping<'p> {
    /// 注入显式relation/action/两端mapping当前授权面。
    qualification: &'p dyn BindingQualificationPort,
    /// 注入原actor/account责任解析面，不从external_id创建成员。
    actors: &'p dyn ActorResponsibilityPort,
    /// 注入完整relation及三mapping双向读与同tx CAS面。
    mapping: &'p dyn MappingRepository,
    /// 本用例private共享mutation依赖，不暴露通用service locator。
    mutation: BridgeMutationPorts<'p>,
}
/// C04仅准备原effect的plan/intent，不发送平台请求。
pub struct PrepareExternalDelivery<'p> {
    /// 注入完整安装/config/local revision读取与同tx暂存面。
    installation: &'p dyn InstallationRepository,
    /// 注入安全配置、maintenance read和exact secret用途资格面。
    config: &'p dyn ConfigQualificationPort,
    /// 注入显式relation/action/两端mapping当前授权面。
    binding: &'p dyn BindingQualificationPort,
    /// 注入完整relation及三mapping双向读与同tx CAS面。
    mapping: &'p dyn MappingRepository,
    /// 注入原actor/account责任解析面，不从external_id创建成员。
    actors: &'p dyn ActorResponsibilityPort,
    /// 注入current Policy/Gate/附件/原projection外显资格面。
    qualification: &'p dyn PresentationQualificationPort,
    /// 注入完整plan/intent/attempt和immutable receipt读写面。
    delivery: &'p dyn DeliveryRepository,
    /// 按正式scope复用或原子首建共享lane，不每intent造私有lane。
    lanes: &'p dyn LaneRepository,
    /// 本用例private共享mutation依赖，不暴露通用service locator。
    mutation: BridgeMutationPorts<'p>,
}
/// C05原known source初绑，不消费one-use或写owner Decision。
pub struct BindExternalAction<'p> {
    /// 注入完整安装/config/local revision读取与同tx暂存面。
    installation: &'p dyn InstallationRepository,
    /// 注入显式relation/action/两端mapping当前授权面。
    binding: &'p dyn BindingQualificationPort,
    /// 注入平台callback source及known source核验面，不授审批权。
    verification: &'p dyn CallbackVerificationPort,
    /// 注入原actor/account责任解析面，不从external_id创建成员。
    actors: &'p dyn ActorResponsibilityPort,
    /// 注入正式owner action/current语义及原result面，不本地写Decision。
    owner: &'p dyn OwnerActionPort,
    /// 注入完整relation及三mapping双向读与同tx CAS面。
    mapping: &'p dyn MappingRepository,
    /// 注入完整plan/intent/attempt和immutable receipt读写面。
    delivery: &'p dyn DeliveryRepository,
    /// 注入完整action/callback及one-use claim同tx CAS面。
    callbacks: &'p dyn CallbackRepository,
    /// 本用例private共享mutation依赖，不暴露通用service locator。
    mutation: BridgeMutationPorts<'p>,
}
/// C06仅登记获准原subject恢复请求，不执行probe。
pub struct RequestBridgeRecovery<'p> {
    /// 注入完整dedup/cursor/gap/recovery读及同tx CAS暂存面。
    continuity: &'p dyn ContinuityRepository,
    /// 注入原subject/op权威readonly恢复面，NotFound不等NoEffect。
    recovery: &'p dyn AuthoritativeRecoveryPort,
    /// 本用例private共享mutation依赖，不暴露通用service locator。
    mutation: BridgeMutationPorts<'p>,
}

impl ConfigureBridgeInstallation<'_> {
    /// C01安全配置接纳，local提交不等provider可用，仅返回独立安全结果。
    pub fn execute<'a>(&'a self, input: ConfigureInstallationInput, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, BridgeCommandResult>;
}
impl ManageExternalBinding<'_> {
    /// C02显式relation管理，授权与binding generation独立核验，仅返回独立安全结果。
    pub fn execute<'a>(&'a self, input: ManageBindingInput, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, BridgeCommandResult>;
}
impl MaintainExternalMapping<'_> {
    /// C03受权typed mapping维护，不创建GlobalMember，仅返回独立安全结果。
    pub fn execute<'a>(&'a self, input: MaintainMappingInput, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, BridgeCommandResult>;
}
impl PrepareExternalDelivery<'_> {
    /// C04仅准备原effect的plan/intent，不发送平台请求，仅返回独立安全结果。
    pub fn execute<'a>(&'a self, input: PrepareDeliveryInput, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, BridgeCommandResult>;
}
impl BindExternalAction<'_> {
    /// C05原known source初绑，不消费one-use或写owner Decision，仅返回独立安全结果。
    pub fn execute<'a>(&'a self, input: BindActionInput, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, BridgeCommandResult>;
}
impl RequestBridgeRecovery<'_> {
    /// C06仅登记获准原subject恢复请求，不执行probe，仅返回独立安全结果。
    pub fn execute<'a>(&'a self, input: RequestRecoveryInput, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, BridgeCommandResult>;
}
~~~

结果`BridgeCommandResult`仅在visibility通过后返回LocalCommitted/OriginalReused/Indeterminate view；Rejected/Unavailable/NotDisclosed不透露隐藏ref。每个execute调用前先验证metadata、control、key、current，重复key按既有stored result零新业务IO；commit未知只能Indeterminate并交J02原op恢复。

### C组最小测试切口

| callable | 必测切口 | 禁止假设 |
|---|---|---|
| C01 | Absent/Present config CAS、required seam缺失、retire不可重启 | 配置成功不等provider可用 |
| C02 | Pending activation、旧generation、跨namespace、explicit revoke | actor/target ref不等授权 |
| C03 | 三kind必需字段、unknown message、AI/human责任、tombstone | external_id不创建GlobalMember |
| C04 | same effect duplicate、Gate degraded、attachment expiry | prepare不等send |
| C05 | 初绑无callback、owner action current/expiry、重复source | 签名/按钮不等审批 |
| C06 | 原subject查重、probe未执行、unknown保留 | request不等recovery resolved |

## 6. E01～E04 consumer input

### PlatformInputReceivedInput<'call>

计划归属`crates/application/src/consumers/platform_input_received.rs`。

~~~rust
/// 原E01的两条穷尽仓内输入：private消息或safe source discontinuity。
pub enum BridgePlatformInboundInvocation<'call> {
    /// 实际private入站；仍由PlatformIngressPort验证。
    Private {
        /// actual source recipe候选key，尚未qualified。
        candidate_event_key: SafeOpaqueId,
        /// owning entry lease的本call短借，不持久化。
        private: PrivateIngressContext<'call>,
    },
    /// actual source host的原Protocol stream缺口，不是新外部消息。
    Continuity(BridgeSourceContinuityNotice),
}

/// E01实际private入站和可信消费上下文；raw止于本call。
pub struct PlatformInputReceivedInput<'call> {
    /// actual已注册consumer上下文，不由queue/body自报来源。
    consumer: TrustedConsumerContext,
    /// E01穷尽Private或Continuity原输入，不能混用ACK/owner语义。
    invocation: BridgePlatformInboundInvocation<'call>,
}
~~~

`Private`分支先按registered installation/source/mode取得Installation与secret lease，再调用PlatformIngressPort。Verified后candidate event key须与actual source注册recipe一致，才可qualify key/meaning；binding/mapping/actor/material均继续current核验。验证失败仍由注入的ACK callback执行协议计划，不创建Inbound/Dedup或owner operation。actual ACK可按Step9平台deadline在可靠接管前后执行/记录，始终不等owner提交。

`Continuity`分支只按actual notice安装读取Installation，调用`PlatformIngressPort::qualify_continuity_notice`取得原Protocol stream/current读资格；用notice key正式recipe去重、既有cursor/gap完整read、pure incomparability/gap候选、原UoW/result/audit及mandatory preflight完成本地记录。绝不调用Conversation/Actor/PrivateMaterial/OwnerAction/PlatformDelivery或协议ACK；InboundConsumeResult只承接实际local disposition/operation/commit，owner slot保持Missing、ACK=NotSent，不创建fake inbound message。qualification/commit未知时worker保原Disconnected/unknown，不用通知成功当gap durable。此分支仍属于E01现有U5 source-continuity责任，wire envelope到Step8，不新增consumer。

### CommittedSourceAvailableInput

计划归属`crates/application/src/consumers/committed_source_available.rs`。

~~~rust
/// E02 owner已提交safe source事件，不包含source正文。
pub struct CommittedSourceAvailableInput {
    /// actual已注册consumer上下文，不由queue/body自报来源。
    consumer: TrustedConsumerContext,
    /// 正式source recipe的opaque identity，不能用正文/时间/trace生成。
    event_key: SafeOpaqueId,
    /// actual owner committed source/version，平台ACK不生成。
    source: CommittedSourceVersionRef,
    /// 原effect的不可变受权target，不因retry换频道/收件人。
    target: ImmutableDeliveryTargetRef,
    /// 明确create/edit/delete/reply动作，不自动降为其他method。
    kind: ExternalDeliveryKind,
}
~~~

source必须actual owner committed；event key由正式producer envelope，不从source body生成。E02复用C04完全相同`StableEffectIdentity`和prepare helper，只stage同一plan/intent或复用原结果，不调用PlatformDeliveryPort。

### PlatformCallbackReceivedInput<'call>

计划归属`crates/application/src/consumers/platform_callback_received.rs`。

~~~rust
/// E03 private callback本call输入，ACK与owner结果独立。
pub struct PlatformCallbackReceivedInput<'call> {
    /// actual已注册consumer上下文，不由queue/body自报来源。
    consumer: TrustedConsumerContext,
    /// 正式source recipe的opaque identity，不能用正文/时间/trace生成。
    candidate_event_key: SafeOpaqueId,
    /// owning lease的本call短借，callback choice/token不存储或日志。
    private: PrivateCallbackContext<'call>,
}
~~~

CallbackVerificationPort先只产`BridgeVerifiedCallbackSource`，然后读取actual action/source，ActorResponsibilityPort、OwnerActionPort核owner semantic/action，最后生成完整CallbackVerificationRef/CurrentActionQualification。actual one-use claim、callback/dedup/result/audit commit之后才可owner handoff；敏感选择只在本call交owner semantic qualification，不能存raw或log。

### SafeHandoffDispositionInput

计划归属`crates/application/src/consumers/safe_handoff_disposition.rs`。

~~~rust
/// E04正式consumer disposition safe引用，不创建producer材料。
pub struct SafeHandoffDispositionInput {
    /// actual已注册consumer上下文，不由queue/body自报来源。
    consumer: TrustedConsumerContext,
    /// 正式source recipe的opaque identity，不能用正文/时间/trace生成。
    event_key: SafeOpaqueId,
    /// 原canonical handoff定位，不新生成producer材料。
    handoff: SafeHandoffRef,
    /// actual同consumer原operation，ACK不能替consumer结果。
    original: OriginalHandoffOperationRef,
    /// 正式consumer safe处置依据，不以transport ACK代Accepted。
    disposition: ConsumerDispositionRef,
}
~~~

E04须SafeObservationPort核consumer/source/schema/op，读取原handoff并apply result。transport ACK不等Consumer Accepted；无匹配producer/handoff/op或raw evidence字段拒绝。它不新建canonical、audit、evidence、report或verdict。

## 7. E01～E04 callable签名与结果

~~~rust
/// E01 private入站或safe continuity接管，ACK/local/owner阶段独立。
pub struct PlatformInputReceivedConsumer<'p> {
    /// 注入完整安装/config/local revision读取与同tx暂存面。
    installation: &'p dyn InstallationRepository,
    /// 注入显式relation/action/两端mapping当前授权面。
    binding: &'p dyn BindingQualificationPort,
    /// 注入完整relation及三mapping双向读与同tx CAS面。
    mapping: &'p dyn MappingRepository,
    /// 注入原actor/account责任解析面，不从external_id创建成员。
    actors: &'p dyn ActorResponsibilityPort,
    /// 注入本call验源或原Protocol continuity资格面，不保存raw。
    ingress: &'p dyn PlatformIngressPort,
    /// 注入正式target/material及原operation交接面，不造Turn。
    owner: &'p dyn ConversationHandoffPort,
    /// 注入完整safe inbound record/source/op读取与同tx CAS面。
    records: &'p dyn InboundRepository,
    /// 注入本call owning材料/投递payload面，raw不durable。
    material: &'p dyn PrivateMaterialPort,
    /// 注入安全配置、maintenance read和exact secret用途资格面。
    config: &'p dyn ConfigQualificationPort,
    /// 注入exact provider/key/version本call lease及撤销重验面。
    secrets: &'p dyn SecretResolutionPort,
    /// 由qualified reply host注入的本call ACK动作，actual结果与local/owner阶段独立。
    ack: &'p dyn BridgeProtocolAckExecutor,
    /// 本用例private共享mutation依赖，不暴露通用service locator。
    mutation: BridgeMutationPorts<'p>,
}
/// E02 owner committed source准备，复用C04同effect，零send。
pub struct CommittedSourceAvailableConsumer<'p> {
    /// 注入完整安装/config/local revision读取与同tx暂存面。
    installation: &'p dyn InstallationRepository,
    /// 注入安全配置、maintenance read和exact secret用途资格面。
    config: &'p dyn ConfigQualificationPort,
    /// 注入显式relation/action/两端mapping当前授权面。
    binding: &'p dyn BindingQualificationPort,
    /// 注入完整relation及三mapping双向读与同tx CAS面。
    mapping: &'p dyn MappingRepository,
    /// 注入原actor/account责任解析面，不从external_id创建成员。
    actors: &'p dyn ActorResponsibilityPort,
    /// 注入current Policy/Gate/附件/原projection外显资格面。
    qualification: &'p dyn PresentationQualificationPort,
    /// 注入完整plan/intent/attempt和immutable receipt读写面。
    delivery: &'p dyn DeliveryRepository,
    /// 与C04共用qualified scope/unique/双轴首建面。
    lanes: &'p dyn LaneRepository,
    /// 本用例private共享mutation依赖，不暴露通用service locator。
    mutation: BridgeMutationPorts<'p>,
}
/// E03来源、责任、owner action验证及原claim交接，ACK独立。
pub struct PlatformCallbackReceivedConsumer<'p> {
    /// 注入完整安装/config/local revision读取与同tx暂存面。
    installation: &'p dyn InstallationRepository,
    /// 注入显式relation/action/两端mapping当前授权面。
    binding: &'p dyn BindingQualificationPort,
    /// 注入完整relation及三mapping双向读与同tx CAS面。
    mapping: &'p dyn MappingRepository,
    /// 注入完整plan/intent/attempt和immutable receipt读写面。
    delivery: &'p dyn DeliveryRepository,
    /// 注入平台callback source及known source核验面，不授审批权。
    verification: &'p dyn CallbackVerificationPort,
    /// 注入原actor/account责任解析面，不从external_id创建成员。
    actors: &'p dyn ActorResponsibilityPort,
    /// 注入正式owner action/current语义及原result面，不本地写Decision。
    owner: &'p dyn OwnerActionPort,
    /// 注入完整action/callback及one-use claim同tx CAS面。
    records: &'p dyn CallbackRepository,
    /// 注入安全配置、maintenance read和exact secret用途资格面。
    config: &'p dyn ConfigQualificationPort,
    /// 注入exact provider/key/version本call lease及撤销重验面。
    secrets: &'p dyn SecretResolutionPort,
    /// 由qualified reply host注入的本call ACK动作，actual结果与local/owner阶段独立。
    ack: &'p dyn BridgeProtocolAckExecutor,
    /// 本用例private共享mutation依赖，不暴露通用service locator。
    mutation: BridgeMutationPorts<'p>,
}
/// E04原consumer disposition落本地，不创造canonical或evidence。
pub struct SafeHandoffDispositionConsumer<'p> {
    /// 注入正式producer/consumer准入面，缺mandatory资格阻效果。
    observation: &'p dyn SafeObservationPort,
    /// 注入完整immutable audit/result和handoff CAS读写面。
    trace: &'p dyn SafeTraceRepository,
    /// 本用例private共享mutation依赖，不暴露通用service locator。
    mutation: BridgeMutationPorts<'p>,
}

impl PlatformInputReceivedConsumer<'_> {
    /// E01 private入站或safe continuity接管，ACK/local/owner阶段独立，仅返回独立安全结果。
    pub fn consume<'a>(&'a self, input: PlatformInputReceivedInput<'a>, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, InboundConsumeResult>;
}
impl CommittedSourceAvailableConsumer<'_> {
    /// E02 owner committed source准备，复用C04同effect，零send，仅返回独立安全结果。
    pub fn consume<'a>(&'a self, input: CommittedSourceAvailableInput, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, SourceConsumeResult>;
}
impl PlatformCallbackReceivedConsumer<'_> {
    /// E03来源、责任、owner action验证及原claim交接，ACK独立，仅返回独立安全结果。
    pub fn consume<'a>(&'a self, input: PlatformCallbackReceivedInput<'a>, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, CallbackConsumeResult>;
}
impl SafeHandoffDispositionConsumer<'_> {
    /// E04原consumer disposition落本地，不创造canonical或evidence，仅返回独立安全结果。
    pub fn consume<'a>(&'a self, input: SafeHandoffDispositionInput, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, HandoffConsumeResult>;
}
~~~

四个结果均是Step6既有稳定carrier，各自保protocol/local/owner或consumer阶段，不能用一个“success”替代。E01/E03完成私有协议ACK由Contracts唯一的`ProtocolAckExecution`记录实际执行；Application只产计划和业务阶段，不能宣称回复已发。

### E组最小测试切口

| callable | 必测切口 |
|---|---|
| E01 | invalid signature零record、回环、edit/delete缺mapping、durable接管后owner unknown、ACK lost |
| E02 | owner committed依据、C04同effect、duplicate零新prepare、source版本变更 |
| E03 | source-only非授权、cross-actor/target/message、one-use CAS、敏感raw不存、owner unknown |
| E04 | transport ACK非accepted、wrong schema/op/source、原result复用、无Bridges producer admission |

## 8. Q01～Q04 query input与callable

四Q均只接trusted query context和显式typed subject，不接Step8 deferred body、repair/refresh/probe开关或仓内cursor。

~~~rust
/// Q01 exact installation/binding/mapping主语。
pub struct GetBindingMappingViewInput {
    /// actual认证入口完整查询上下文，不转为mutation/maintenance。
    context: BridgeQueryCallContext,
    /// exact typed本地主语；各Q/J校allowlist与当前visibility。
    subject: BridgeViewSubjectRef,
}
/// Q02 exact入站/投递/callback operation主语。
pub struct GetBridgeOperationViewInput {
    /// actual认证入口完整查询上下文，不转为mutation/maintenance。
    context: BridgeQueryCallContext,
    /// exact typed本地主语；各Q/J校allowlist与当前visibility。
    subject: BridgeViewSubjectRef,
}
/// Q03 exactdedup/cursor/gap/lane/recovery主语。
pub struct GetContinuityViewInput {
    /// actual认证入口完整查询上下文，不转为mutation/maintenance。
    context: BridgeQueryCallContext,
    /// exact typed本地主语；各Q/J校allowlist与当前visibility。
    subject: BridgeViewSubjectRef,
}
/// Q04 exactaudit/handoff主语。
pub struct GetSafeHandoffViewInput {
    /// actual认证入口完整查询上下文，不转为mutation/maintenance。
    context: BridgeQueryCallContext,
    /// exact typed本地主语；各Q/J校allowlist与当前visibility。
    subject: BridgeViewSubjectRef,
}

/// Q01 installation/binding/mapping受权只读view，零write。
pub struct GetBindingMappingView<'p> {
    /// 注入resolver-first current披露面，hidden ref/count不可输出。
    read: &'p dyn SafeReadQualificationPort,
    /// 注入完整安装/config/local revision读取与同tx暂存面。
    installation: &'p dyn InstallationRepository,
    /// 注入完整relation及三mapping双向读与同tx CAS面。
    mapping: &'p dyn MappingRepository,
    /// 无IO受限view投影器，不直接序列化Domain model。
    projector: LocalViewProjector,
}
/// Q02原operation受权只读view，零probe/repair。
pub struct GetBridgeOperationView<'p> {
    /// 注入resolver-first current披露面，hidden ref/count不可输出。
    read: &'p dyn SafeReadQualificationPort,
    /// 注入完整safe inbound record/source/op读取与同tx CAS面。
    inbound: &'p dyn InboundRepository,
    /// 注入完整plan/intent/attempt和immutable receipt读写面。
    delivery: &'p dyn DeliveryRepository,
    /// 注入完整action/callback及one-use claim同tx CAS面。
    callback: &'p dyn CallbackRepository,
    /// 注入完整dedup/cursor/gap/recovery读及同tx CAS暂存面。
    continuity: &'p dyn ContinuityRepository,
    /// 注入完整immutable audit/result和handoff CAS读写面。
    trace: &'p dyn SafeTraceRepository,
    /// 无IO受限view投影器，不直接序列化Domain model。
    projector: LocalViewProjector,
}
/// Q03 cursor/gap/lane/recovery受权只读view，零推进。
pub struct GetContinuityView<'p> {
    /// 注入resolver-first current披露面，hidden ref/count不可输出。
    read: &'p dyn SafeReadQualificationPort,
    /// 注入完整dedup/cursor/gap/recovery读及同tx CAS暂存面。
    continuity: &'p dyn ContinuityRepository,
    /// 注入全部shared rate下界、顺序/fence及claim同tx CAS面。
    lanes: &'p dyn LaneRepository,
    /// 无IO受限view投影器，不直接序列化Domain model。
    projector: LocalViewProjector,
}
/// Q04 audit/handoff受权只读view，不造观测材料。
pub struct GetSafeHandoffView<'p> {
    /// 注入resolver-first current披露面，hidden ref/count不可输出。
    read: &'p dyn SafeReadQualificationPort,
    /// 注入完整immutable audit/result和handoff CAS读写面。
    trace: &'p dyn SafeTraceRepository,
    /// 无IO受限view投影器，不直接序列化Domain model。
    projector: LocalViewProjector,
}

impl GetBindingMappingView<'_> {
    /// Q01 installation/binding/mapping受权只读view，零write，仅返回独立安全结果。
    pub fn execute<'a>(&'a self, input: GetBindingMappingViewInput, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, BridgeReadResult>;
}
impl GetBridgeOperationView<'_> {
    /// Q02原operation受权只读view，零probe/repair，仅返回独立安全结果。
    pub fn execute<'a>(&'a self, input: GetBridgeOperationViewInput, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, BridgeReadResult>;
}
impl GetContinuityView<'_> {
    /// Q03 cursor/gap/lane/recovery受权只读view，零推进，仅返回独立安全结果。
    pub fn execute<'a>(&'a self, input: GetContinuityViewInput, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, BridgeReadResult>;
}
impl GetSafeHandoffView<'_> {
    /// Q04 audit/handoff受权只读view，不造观测材料，仅返回独立安全结果。
    pub fn execute<'a>(&'a self, input: GetSafeHandoffViewInput, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, BridgeReadResult>;
}
~~~

每个query注入SafeReadQualificationPort、对应repository及无IO `LocalViewProjector`。先qualify subject/current visibility，再构造Committed read session、具名完整snapshot、project、返回前revalidate。Q01只Installation/Binding/Mapping；Q02只Operation/Inbound/Presentation/Intent/Attempt/Receipt/Action/Callback；Q03只Dedup/Cursor/Gap/Lane/Recovery；Q04只Audit/Handoff，错族InvalidInput。NotFound只受权exact subject，Denied隐藏存在性/ref/count。QueryMetadata.page不直接映repository cursor；当前`BridgeLocalView`非page，Step8若协议承接分页须另行明确，不能暴露store token。

四Q测试统一覆盖：未授权存在性隐藏、stale/degraded visible slice、wrong subject族、snapshot required set超预算安全Unavailable、全程port mock断言零write/clock-ID/eligible/probe/audit；未执行。

## 9. J01～J05仓内input、选择与callable

Jobs入口的Step6 `JobInvocationPlan`属于jobs crate，Application不得反向依赖。jobs runner按plan的具体variant解出以下仓内input；worker eligible选择使用本节`BridgeMaintenanceSelection`，再由jobs装配plan。二者不是第二套job truth。

`BridgeMaintenanceSubject`与`BridgeMaintenanceSelection`唯一schema见Application端口附录§8，正式归属`crates/application/src/jobs/mod.rs`。本页只消费，不重复声明；jobs通过其只读getter装配Step6 `ScheduledJobCandidate`，不能修改selection或取得可写port。

J01～J04的既有原operation必须与实际行一致；J05或尚无job operation的eligible subject可由Application分配fresh未执行operation。selection从具名eligible repo页取得完整行/read_basis/current scope，不能由worker构造、租约时间或raw queue payload声明；它携带Application按typed subject/trusted job scope资格化的key和完整continuity，但不携带业务retry budget。到invoke时Application按input subject与TrustedJobContext重新推导同一key、重读dedup/result/CAS/current并核continuity；预算只从实际subject/qualification取得。

~~~rust
/// J01原intent的单次有界派发。
pub struct DispatchDeliveryJobInput {
    /// actual受信job scope/maintenance basis，不从CLI/env拼权限。
    job: TrustedJobContext,
    /// 既有intent及原effect关联，不允许job新建effect。
    delivery: DeliveryIntentEffectRef,
    /// Application移交的原operation/subject/scope，requested_at不入key。
    continuity: JobContinuityMetadata,
}
/// J02原恢复记录/same operation的只读probe与本地finalize。
pub struct ReconcileOperationJobInput {
    /// actual受信job scope/maintenance basis，不从CLI/env拼权限。
    job: TrustedJobContext,
    /// actual选择行的原recovery定位，invoke读取完整original/qualification，不解析ID。
    recovery: RecoveryRecordRef,
    /// 原可恢复subject及所属stage定位，不创建新效果。
    subject: OriginalRecoverableSubjectRef,
    /// Application移交的原operation/subject/scope，requested_at不入key。
    continuity: JobContinuityMetadata,
}
/// J03原gap/stream/epoch的coverage恢复。
pub struct ReconcileGapJobInput {
    /// actual受信job scope/maintenance basis，不从CLI/env拼权限。
    job: TrustedJobContext,
    /// 原stream/epoch缺口定位，partial coverage不能关闭。
    gap: GapRef,
    /// Application移交的原operation/subject/scope，requested_at不入key。
    continuity: JobContinuityMetadata,
}
/// J04原canonical handoff/same consumer operation重试。
pub struct RetryHandoffJobInput {
    /// actual受信job scope/maintenance basis，不从CLI/env拼权限。
    job: TrustedJobContext,
    /// 原canonical handoff定位，不新生成producer材料。
    handoff: SafeHandoffRef,
    /// Application移交的原operation/subject/scope，requested_at不入key。
    continuity: JobContinuityMetadata,
}
/// J05仅维护既有资格subject，不授新权。
pub struct RefreshQualificationJobInput {
    /// actual受信job scope/maintenance basis，不从CLI/env拼权限。
    job: TrustedJobContext,
    /// exact typed本地主语；各Q/J校allowlist与当前visibility。
    subject: BridgeViewSubjectRef,
    /// actual行的预期local revision，J05 key必须保留该条件。
    expected: ExpectedLocalRevision,
    /// Application移交的原operation/subject/scope，requested_at不入key。
    continuity: JobContinuityMetadata,
}
~~~

~~~rust
/// J01既有intent的单次有界派发，actual claim先于外呼。
pub struct DispatchQueuedDeliveryJob<'p> {
    /// 注入完整安装/config/local revision读取与同tx暂存面。
    installation: &'p dyn InstallationRepository,
    /// 注入显式relation/action/两端mapping当前授权面。
    binding: &'p dyn BindingQualificationPort,
    /// 注入完整relation及三mapping双向读与同tx CAS面。
    mapping: &'p dyn MappingRepository,
    /// 注入current Policy/Gate/附件/原projection外显资格面。
    qualification: &'p dyn PresentationQualificationPort,
    /// 注入完整plan/intent/attempt和immutable receipt读写面。
    delivery: &'p dyn DeliveryRepository,
    /// 注入全部shared rate下界、顺序/fence及claim同tx CAS面。
    lanes: &'p dyn LaneRepository,
    /// 注入原attempt/effect单次dispatch或readonly probe，禁隐藏retry。
    platform: &'p dyn PlatformDeliveryPort,
    /// 注入本call owning材料/投递payload面，raw不durable。
    material: &'p dyn PrivateMaterialPort,
    /// 注入安全配置、maintenance read和exact secret用途资格面。
    config: &'p dyn ConfigQualificationPort,
    /// 注入exact provider/key/version本call lease及撤销重验面。
    secrets: &'p dyn SecretResolutionPort,
    /// 本用例private共享mutation依赖，不暴露通用service locator。
    mutation: BridgeMutationPorts<'p>,
}
/// J02原operation权威只读probe与known finalize，不换op。
pub struct ReconcileBridgeOperationJob<'p> {
    /// 注入完整安装/config/local revision读取与同tx暂存面。
    installation: &'p dyn InstallationRepository,
    /// 注入安全配置、maintenance read和exact secret用途资格面。
    config: &'p dyn ConfigQualificationPort,
    /// 注入exact provider/key/version本call lease及撤销重验面。
    secrets: &'p dyn SecretResolutionPort,
    /// 注入显式relation/action/两端mapping当前授权面。
    binding: &'p dyn BindingQualificationPort,
    /// 注入完整relation及三mapping双向读与同tx CAS面。
    mapping: &'p dyn MappingRepository,
    /// 注入全部shared rate下界、顺序/fence及claim同tx CAS面。
    lanes: &'p dyn LaneRepository,
    /// 注入完整dedup/cursor/gap/recovery读及同tx CAS暂存面。
    continuity: &'p dyn ContinuityRepository,
    /// 注入原subject/op权威readonly恢复面，NotFound不等NoEffect。
    recovery: &'p dyn AuthoritativeRecoveryPort,
    /// 注入完整safe inbound record/source/op读取与同tx CAS面。
    inbound: &'p dyn InboundRepository,
    /// 注入完整plan/intent/attempt和immutable receipt读写面。
    delivery: &'p dyn DeliveryRepository,
    /// 重验原plan及五源同effect retry资格，不授new effect/send。
    presentation: &'p dyn PresentationQualificationPort,
    /// 注入完整action/callback及one-use claim同tx CAS面。
    callbacks: &'p dyn CallbackRepository,
    /// 注入完整immutable audit/result和handoff CAS读写面。
    trace: &'p dyn SafeTraceRepository,
    /// 本用例private共享mutation依赖，不暴露通用service locator。
    mutation: BridgeMutationPorts<'p>,
}
/// J03原stream/epoch完整coverage恢复，partial保gap。
pub struct ReconcileStreamGapJob<'p> {
    /// 注入完整安装/config/local revision读取与同tx暂存面。
    installation: &'p dyn InstallationRepository,
    /// 注入安全配置、maintenance read和exact secret用途资格面。
    config: &'p dyn ConfigQualificationPort,
    /// 注入exact provider/key/version本call lease及撤销重验面。
    secrets: &'p dyn SecretResolutionPort,
    /// 注入完整dedup/cursor/gap/recovery读及同tx CAS暂存面。
    continuity: &'p dyn ContinuityRepository,
    /// 注入原subject/op权威readonly恢复面，NotFound不等NoEffect。
    recovery: &'p dyn AuthoritativeRecoveryPort,
    /// 本用例private共享mutation依赖，不暴露通用service locator。
    mutation: BridgeMutationPorts<'p>,
}
/// J04原canonical/consumer operation重试，不新建producer。
pub struct RetrySafeHandoffJob<'p> {
    /// 注入安全配置、maintenance read和exact secret用途资格面。
    config: &'p dyn ConfigQualificationPort,
    /// 注入正式producer/consumer准入面，缺mandatory资格阻效果。
    observation: &'p dyn SafeObservationPort,
    /// 注入完整immutable audit/result和handoff CAS读写面。
    trace: &'p dyn SafeTraceRepository,
    /// 本用例private共享mutation依赖，不暴露通用service locator。
    mutation: BridgeMutationPorts<'p>,
}
/// J05 typed资格与八repository依赖聚合，不是业务port或新权限来源。
pub struct BridgeQualificationMaintenancePorts<'p> {
    /// 正式取得stage committed coverage/comparator，不用source gap coverage替代。
    recovery: &'p dyn AuthoritativeRecoveryPort,
    /// 注入安全配置、maintenance read和exact secret用途资格面。
    config: &'p dyn ConfigQualificationPort,
    /// 注入显式relation/action/两端mapping当前授权面。
    binding: &'p dyn BindingQualificationPort,
    /// 注入current Policy/Gate/附件/原projection外显资格面。
    presentation: &'p dyn PresentationQualificationPort,
    /// 注入原actor/account责任解析面，不从external_id创建成员。
    actors: &'p dyn ActorResponsibilityPort,
    /// 注入正式owner action/current语义及原result面，不本地写Decision。
    actions: &'p dyn OwnerActionPort,
    /// 注入正式producer/consumer准入面，缺mandatory资格阻效果。
    observation: &'p dyn SafeObservationPort,
    /// 注入完整安装/config/local revision读取与同tx暂存面。
    installation: &'p dyn InstallationRepository,
    /// 注入完整relation及三mapping双向读与同tx CAS面。
    mapping: &'p dyn MappingRepository,
    /// 注入完整safe inbound record/source/op读取与同tx CAS面。
    inbound: &'p dyn InboundRepository,
    /// 注入完整plan/intent/attempt和immutable receipt读写面。
    delivery: &'p dyn DeliveryRepository,
    /// 注入完整action/callback及one-use claim同tx CAS面。
    callbacks: &'p dyn CallbackRepository,
    /// 注入完整dedup/cursor/gap/recovery读及同tx CAS暂存面。
    continuity: &'p dyn ContinuityRepository,
    /// 注入全部shared rate下界、顺序/fence及claim同tx CAS面。
    lanes: &'p dyn LaneRepository,
    /// 注入完整immutable audit/result和handoff CAS读写面。
    trace: &'p dyn SafeTraceRepository,
}
/// J05既有subject资格维护，expected入幂等含义，不授新权。
pub struct RefreshBridgeQualificationJob<'p> {
    /// J05各subject的具名资格/八repo依赖，不提供新grant。
    qualifications: BridgeQualificationMaintenancePorts<'p>,
    /// 本用例private共享mutation依赖，不暴露通用service locator。
    mutation: BridgeMutationPorts<'p>,
}

impl DispatchQueuedDeliveryJob<'_> {
    /// J01既有intent的单次有界派发，actual claim先于外呼，仅返回独立安全结果。
    pub fn execute<'a>(&'a self, input: DispatchDeliveryJobInput, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, DispatchJobResult>;
}
impl ReconcileBridgeOperationJob<'_> {
    /// J02原operation权威只读probe与known finalize，不换op，仅返回独立安全结果。
    pub fn execute<'a>(&'a self, input: ReconcileOperationJobInput, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, RecoveryJobResult>;
}
impl ReconcileStreamGapJob<'_> {
    /// J03原stream/epoch完整coverage恢复，partial保gap，仅返回独立安全结果。
    pub fn execute<'a>(&'a self, input: ReconcileGapJobInput, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, GapRecoveryJobResult>;
}
impl RetrySafeHandoffJob<'_> {
    /// J04原canonical/consumer operation重试，不新建producer，仅返回独立安全结果。
    pub fn execute<'a>(&'a self, input: RetryHandoffJobInput, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, SafeHandoffJobResult>;
}
impl RefreshBridgeQualificationJob<'_> {
    /// J05既有subject资格维护，expected入幂等含义，不授新权，仅返回独立安全结果。
    pub fn execute<'a>(&'a self, input: RefreshQualificationJobInput, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, QualificationJobResult>;
}
~~~

J01读Delivery/Lane snapshot与all shared bounds，current qualification+payload+secret后先同UoW实际claim commit，再外呼；actual result在第二个UoW写attempt/receipt/lane/result。unknown不释放head，retry只same intent/effect且有NoEffect/NoIo/current预算。J02只AuthoritativeRecoveryPort原subject/op probe，known才同UoW finalize；local commit用LocalCommitDisposition独立分支。J03只same stream/epoch/comparator/range coverage，完整coverage才close gap/advance cursor。J04仅same canonical/op/current admission，actual claim后交接；consumer unknown不新operation。J05逐typed snapshot调用对应qualification port并只做合法失效/maintenance迁移；Revoked/Expired/Retired不复活，missing不生成grant。

X读面/credential纠正：J01从Installation/Mapping读取原安装与实际relation/mapping，BindingQualification核同generation/action后才做presentation/secret/dispatch。J02的known finalize需Mapping/Lane完整行与CAS，不能只更新recovery标签；若当前binding不允许回链，只记录实际known结果，不生成新的授权mapping。J02/J03先按actual recovery subject/source取得原Installation完整行，ConfigQualification核`SecretUsePurpose::AuthoritativeProbe`（既有用途）和exact route/provider/version，SecretResolution返回owning lease并最后重验；只有Platform或正式source要求凭据的probe才短借secret给RecoveryPort。local/owner/consumer probe及正式不需凭据的source给None，禁止解析secret作恢复permission。qualification、provider或readonly method缺失即Blocked/Unavailable/manual，不调用send，不因NotFound新建效果。

### Application eligible选择函数

这些函数是jobs模块内具名Application函数，不是新的业务port：

~~~rust
/// 由Application取得maintenance read并选择原dispatch候选；完整key/continuity/read basis一次移交，不执行效果。
pub fn select_dispatch_candidates<'a>(ports: &'a DispatchQueuedDeliveryJob<'a>, job: &'a TrustedJobContext, scope: &'a SafeScopeRef, as_of: SafeInstant, page: &'a BridgeRepositoryPageRequest, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, BridgeRepositoryPage<BridgeMaintenanceSelection>>;
/// 由Application取得maintenance read并选择原recovery候选；完整key/continuity/read basis一次移交，不执行效果。
pub fn select_recovery_candidates<'a>(ports: &'a ReconcileBridgeOperationJob<'a>, job: &'a TrustedJobContext, scope: &'a SafeScopeRef, as_of: SafeInstant, page: &'a BridgeRepositoryPageRequest, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, BridgeRepositoryPage<BridgeMaintenanceSelection>>;
/// 由Application取得maintenance read并选择原gap候选；完整key/continuity/read basis一次移交，不执行效果。
pub fn select_gap_candidates<'a>(ports: &'a ReconcileStreamGapJob<'a>, job: &'a TrustedJobContext, scope: &'a SafeScopeRef, as_of: SafeInstant, page: &'a BridgeRepositoryPageRequest, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, BridgeRepositoryPage<BridgeMaintenanceSelection>>;
/// 由Application取得maintenance read并选择原handoff候选；完整key/continuity/read basis一次移交，不执行效果。
pub fn select_handoff_candidates<'a>(ports: &'a RetrySafeHandoffJob<'a>, job: &'a TrustedJobContext, scope: &'a SafeScopeRef, as_of: SafeInstant, page: &'a BridgeRepositoryPageRequest, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, BridgeRepositoryPage<BridgeMaintenanceSelection>>;
/// 由Application取得maintenance read并选择原qualification候选；完整key/continuity/read basis一次移交，不执行效果。
pub fn select_qualification_candidates<'a>(ports: &'a RefreshBridgeQualificationJob<'a>, job: &'a TrustedJobContext, scope: &'a SafeScopeRef, as_of: SafeInstant, page: &'a BridgeRepositoryPageRequest, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, BridgeRepositoryPage<BridgeMaintenanceSelection>>;
~~~

`ports`参数表示具体use-case对象持有的私有依赖；函数不暴露dyn port给worker。五函数都先以`ports.config.qualify_maintenance_read(scope, job, *page.limit(), control)`取得Maintenance purpose read，核job scope、kind/as_of和page Eligible筛选完全一致后才调用具名repository；worker不能提供或伪造`BridgeLocalReadContext`。J02/J03/J04因此显式注入ConfigQualificationPort，J01已有config，J05由qualification bundle持有config。

每个完整row依次转唯一`BridgeMaintenanceSubject`，J05同时带actual `ExpectedLocalRevision`，调用`qualify_job_key(subject, job, control)`并生成对应body-free meaning；随后在同一read basis查询dedup与原result/operation。已有记录只接受key/meaning/subject一致并复用原operation；Conflict、expired-unknown或partial read不生成候选。确无记录时仅Application可`allocate_id(..., Operation, ...)`形成fresh未执行operation；此时没有dedup reservation、run或效果。selection携subject、continuity、key、read_basis、selection_basis、validity，Jobs只能读取并装plan。invoke再次从typed input+job推同key并重读：若并发已有原operation/result则以committed记录为准并stale/reuse本candidate，绝不以fresh operation发第二次效果；J05先按input expected/key查原result，同expected duplicate复用原结果，再核current actual revision，不能先以新行版本默换key。返回page cursor仍Application-local，worker只在当前qualified session内继续，不能持久化为产品token。

### J组最小测试切口

X完整传递补全：J01 selector从actual DeliveryIntent行保`DeliveryIntentEffectRef`，不能只移交intent ID再让Jobs猜effect；J02 selector从同一个actual RecoveryRecord保`recovery + subject`两字段及原continuity。J02 invoke先`ContinuityRepository::get_recovery(input.recovery, ...)`取得完整行，核input.subject/continuity原operation/current scope与actual row完全一致，然后以同`BridgeMaintenanceSubject::Recovery`推key/meaning并读取原result；缺行或关联不一致不换record/key/operation。J01/J05同样保原effect/expected，Jobs assembler只移交这些safe原值，不取得repository补字段。

| callable | 必测切口 |
|---|---|
| J01 | actual claim前零IO、shared bounds最大下界、unknown head、SDK无隐藏retry |
| J02 | local/owner/platform/consumer分阶段、NotFound非no-effect、same-op finalize |
| J03 | epoch不可比、partial coverage保gap、cursor两个revision轴 |
| J04 | admission stale、claim commit未知、consumer ACK非accepted |
| J05 | typed eligible scope、关联分页不足、终态不复活、no new grant |
| J05 / Dedup受权补口 | 十一snapshot/九body族；qualify_dedup_expiry当前核原window+维护authority，目标Dedup与本Job去重key/op独立；未知/原result保持，expiry不重execute；zero secret/material/业务probe |

## 10. 19 callable依赖/读写闭环与A7停审

Step13受权同义补口（不新增business入口/port）：以下原Input的public纯成员是完整command meaning唯一取得面，均位于原Input既有源文件。

| 完整签名 | 原字段来源 / 返回载荷 / 禁止 |
|---|---|
| `ConfigureInstallationInput::canonical_meaning(&self) -> Result<BodyFreeOperationMeaningRef, ContractViolation>` | 原五body字段逐项重建原Request -> ManagementBody::ConfigureInstallation；保config/local CAS与installation optional。 |
| `ManageBindingInput::canonical_meaning(&self) -> Result<BodyFreeOperationMeaningRef, ContractViolation>` | 原installation/binding/meaning/maintenance/revocation/local_expected -> 完整proposal/Request -> ManagementBody::ManageBinding。 |
| `MaintainMappingInput::canonical_meaning(&self) -> Result<BodyFreeOperationMeaningRef, ContractViolation>` | 原binding/generation/local_expected与BridgeMappingChange五variant零IO逆映射Step8 AuthorizedMappingChange，逐字段保parent/source/result/direction/origin/全部basis -> ManagementBody::MaintainMapping。 |
| `BindActionInput::canonical_meaning(&self) -> Result<BodyFreeOperationMeaningRef, ContractViolation>` | 原binding/source/target/responsibility四字段 -> 原Request -> ManagementBody::BindAction；没有new action ID。 |

这些成员使用原safe字段的完整受控值复制/原factory重建（保持id/kind/scope/source/revision，不签新authority）；不要求Input/DTO整体Clone、不触private/secret，context/metadata不入body，零IO/clock/ID/current刷新。保原Input继续供Domain组装，错误沿CV，Application随后仍调用原qualify_meaning。完整typed逆映射不是generic serializer；mapper需要保exact five variant所有值，拒绝unknown。`BodyFreeOperationMeaningRef::validate/assert_equal`、canonical codec与StoredResultReusePolicy同步穷尽新ManagementBody，原十variant语义不变。

| callable组 | 注入的既有port | 主要读 / write配对 | stable结果 |
|---|---|---|---|
| C01 | ConfigQualification、InstallationRepository、MutationPorts | installation get/snapshot -> stage | BridgeCommandResult |
| C02/C03 | BindingQualification、MappingRepository、ActorResponsibility、MutationPorts | binding/mapping get/find/list -> typed stage | BridgeCommandResult |
| C04/E02 | Installation/Config/Binding/Mapping/Actor、PresentationQualification、DeliveryRepository、MutationPorts | actual installation/relation/mapping/source/effect/snapshot -> plan+intent stage | BridgeCommandResult / SourceConsumeResult |
| C05 | Installation/Binding/CallbackVerification/Actor/OwnerAction、Mapping/Delivery/Callback、MutationPorts | actual installation及known source/action find -> action stage | BridgeCommandResult |
| C06 | ContinuityRepository、AuthoritativeRecoveryPort、MutationPorts | actual request authorization + recovery find/get -> recovery stage；零probe | BridgeCommandResult |
| E01 | Installation/Mapping/Inbound、PlatformIngress、Conversation、Private/Secret、MutationPorts | source/op/snapshot -> inbound/dedup/result stage；外部owner另阶段 | InboundConsumeResult |
| E03 | Installation/Mapping/Callback、verification/actor/owner/private/secret、MutationPorts | source/action/callback/op -> one-use/callback/result；owner另阶段 | CallbackConsumeResult |
| E04 | SafeObservation/SafeTrace、MutationPorts | handoff/op -> handoff/result stage | HandoffConsumeResult |
| Q01~04 | SafeReadQualification、对应八repo、LocalViewProjector | only committed get/snapshot，zero write | BridgeReadResult |
| J01 | Installation/Config/Binding/Mapping、Delivery/Lane/Presentation/Platform/Private/Secret、MutationPorts | full installation/relation/intent/lane -> claim；平台后result/receipt/lane | DispatchJobResult |
| J02/J03 | Installation/Config/Secret/Continuity/AuthoritativeRecovery；J02另Binding/Mapping/Lane及受影响repo、MutationPorts | qualified eligible read；actual credential只短借readonly probe；original/gap -> known finalize，unknown保留 | Recovery/GapRecoveryJobResult |
| J04 | Config/SafeObservation/SafeTrace、MutationPorts | qualified eligible read；handoff -> claim/result | SafeHandoffJobResult |
| J05 | Config/Binding/Presentation/Actor/Owner/SafeObservation、八repo/UoW、MutationPorts | typed snapshot/list -> only valid invalidation/maintenance stage | QualificationJobResult |

每个mutating callable还使用LocalUnitOfWorkPort key/meaning/ID/clock/UoW、ContinuityRepository dedup、SafeTraceRepository result/audit及SafeObservation mandatory preflight；表不重复这些共享列。所有use-case对象的`new(...) -> Self`必须完整接收表中dyn引用和共享聚合，拒绝Option必需port；构造不探测网络或宣告ready。具体函数内顺序到Step9，但本Step已关闭“能调用什么、完整传什么、结果是什么”。

A7人工设计自检pass：19/19 callable逐名存在，六C/四E/四Q/五J独立；所有input为当前已定义仓内type，不引用十个deferred wire body；Query无write seam；eligible不形成application->jobs反向依赖；private input只E01/E03，lease只具名IO；技术clock/ID/key/meaning只既有UoW port。下一仅Infra I。

### 10.1 Factory、getter与注入闭口

所有input字段保持private；每个`from_parts`完整接收下列参数并返回`Result<Self, ContractViolation>`，只做kind-required/Option组合/namespace及静态范围校验，不生成ID、authority、current时间或IO proof。每个字段有同名只读getter，owned字段返回`&T`，private borrowed context返回原`&...<'call>`；无mutable getter、默认serde/Debug或通用map构造。

| input | 完整factory参数（按顺序） |
|---|---|
| ConfigureInstallationInput | `context: BridgeCommandCallContext, installation: Option<BridgeInstallationRef>, action: ConfigurationMutationKind, draft: InstallationConfigDraft, config_expected: Option<ExpectedConfigRevision>, local_expected: LocalRevisionCondition` |
| ManageBindingInput | `context: BridgeCommandCallContext, installation: BridgeInstallationRef, binding: Option<ExternalBindingRef>, meaning: BindingMeaning, maintenance: Option<QualificationMaintenanceBasisRef>, revocation: Option<RevocationBasisRef>, local_expected: LocalRevisionCondition` |
| MaintainMappingInput | `context: BridgeCommandCallContext, binding: ExternalBindingRef, generation: ExpectedGeneration, change: BridgeMappingChange, local_expected: LocalRevisionCondition` |
| PrepareDeliveryInput | `context: BridgeCommandCallContext, source: CommittedSourceVersionRef, target: ImmutableDeliveryTargetRef, kind: ExternalDeliveryKind` |
| BindActionInput | `context: BridgeCommandCallContext, binding: ExternalBindingRef, source: SourceIntentMessageRef, target: OwnerTargetActionRef, responsibility: ActorResponsibilityRef` |
| RequestRecoveryInput | `context: BridgeCommandCallContext, subject: OriginalRecoverableSubjectRef, original: OriginalOperationEffectRef, authorization: RecoveryAuthorizationRef` |
| PlatformInputReceivedInput<'call> | `consumer: TrustedConsumerContext, invocation: BridgePlatformInboundInvocation<'call>`；Private完整两字段或Continuity原notice，互斥且不得默造空private |
| CommittedSourceAvailableInput | `consumer: TrustedConsumerContext, event_key: SafeOpaqueId, source: CommittedSourceVersionRef, target: ImmutableDeliveryTargetRef, kind: ExternalDeliveryKind` |
| PlatformCallbackReceivedInput<'call> | `consumer: TrustedConsumerContext, candidate_event_key: SafeOpaqueId, private: PrivateCallbackContext<'call>` |
| SafeHandoffDispositionInput | `consumer: TrustedConsumerContext, event_key: SafeOpaqueId, handoff: SafeHandoffRef, original: OriginalHandoffOperationRef, disposition: ConsumerDispositionRef` |
| 四Query input | 分别`context: BridgeQueryCallContext, subject: BridgeViewSubjectRef`；各factory校subject属于本Q allowlist |
| DispatchDeliveryJobInput | `job: TrustedJobContext, delivery: DeliveryIntentEffectRef, continuity: JobContinuityMetadata` |
| ReconcileOperationJobInput | `job: TrustedJobContext, recovery: RecoveryRecordRef, subject: OriginalRecoverableSubjectRef, continuity: JobContinuityMetadata` |
| ReconcileGapJobInput | `job: TrustedJobContext, gap: GapRef, continuity: JobContinuityMetadata` |
| RetryHandoffJobInput | `job: TrustedJobContext, handoff: SafeHandoffRef, continuity: JobContinuityMetadata` |
| RefreshQualificationJobInput | `job: TrustedJobContext, subject: BridgeViewSubjectRef, expected: ExpectedLocalRevision, continuity: JobContinuityMetadata` |

十九use-case对象的`new`参数与其private字段逐项同名同序，全部必需dyn依赖为非Option；`BridgeMutationPorts::new(uow, continuity, trace, observation, read)`及`BridgeQualificationMaintenancePorts::new(recovery, config, binding, presentation, actors, actions, observation, installation, mapping, inbound, delivery, callbacks, continuity, lanes, trace)`仅聚合引用。返回`Self`不做network/provider probe，运行装配资格归Infra composition。每个`execute`/`consume` Rustdoc须明确对应C/E/Q/J编号、结果阶段和副作用上限；上述方法签名是唯一公开仓内callable，不另导出repo getter或generic execute。

| use-case factory | exact依赖参数 |
|---|---|
| ConfigureBridgeInstallation::new | `config, installation, mutation`（类型同§5 struct字段） |
| ManageExternalBinding::new | `qualification, installation, mapping, mutation` |
| MaintainExternalMapping::new | `qualification, actors, mapping, mutation` |
| PrepareExternalDelivery::new | `installation, config, binding, mapping, actors, qualification, delivery, lanes, mutation` |
| BindExternalAction::new | `installation, binding, verification, actors, owner, mapping, delivery, callbacks, mutation` |
| RequestBridgeRecovery::new | `continuity, recovery, mutation` |
| PlatformInputReceivedConsumer::new | `installation, binding, mapping, actors, ingress, owner, records, material, config, secrets, ack, mutation` |
| CommittedSourceAvailableConsumer::new | `installation, config, binding, mapping, actors, qualification, delivery, lanes, mutation` |
| PlatformCallbackReceivedConsumer::new | `installation, binding, mapping, delivery, verification, actors, owner, records, config, secrets, ack, mutation` |
| SafeHandoffDispositionConsumer::new | `observation, trace, mutation` |
| GetBindingMappingView::new | `read, installation, mapping, projector` |
| GetBridgeOperationView::new | `read, inbound, delivery, callback, continuity, trace, projector` |
| GetContinuityView::new | `read, continuity, lanes, projector` |
| GetSafeHandoffView::new | `read, trace, projector` |
| DispatchQueuedDeliveryJob::new | `installation, binding, mapping, qualification, delivery, lanes, platform, material, config, secrets, mutation` |
| ReconcileBridgeOperationJob::new | `installation, config, secrets, binding, mapping, lanes, continuity, recovery, inbound, delivery, presentation, callbacks, trace, mutation` |
| ReconcileStreamGapJob::new | `installation, config, secrets, continuity, recovery, mutation` |
| RetrySafeHandoffJob::new | `config, observation, trace, mutation` |
| RefreshBridgeQualificationJob::new | `qualifications, mutation` |

设计卡中的字段名就是构造参数名，类型就是对应struct字段类型；此表不允许实现者追加默认port、静态单例或Infra具体类型。所有new/execute/consume/select函数计划中文Rustdoc，实际源码标识仍英文。

受权R2/R4：C04/E02的`lanes: &'p dyn LaneRepository`为必需注入，factory上表同序；J02的`presentation: &'p dyn PresentationQualificationPort`为必需注入，位于delivery后、callbacks前。`BridgeQualificationMaintenancePorts::new`同其字段顺序显式接收新增`recovery: &'p dyn AuthoritativeRecoveryPort`，不由J05运行时定位全局service；相关new仅组装引用、零IO。新端口方法与snapshot消费以受权修订后的原卡为准，原停审统计是历史checkpoint。

计划测试按上述各组归入Step4既有`crates/application/tests/authorization_flow_tests.rs`、`crates/application/tests/continuity_flow_tests.rs`和`crates/application/tests/safe_read_tests.rs`；不新增泛化flow target。当前未编译/执行。BR-UP-001~009仍open，产品均not_selected/not_established。
