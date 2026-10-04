# L6-bridges 03 Step6：Infra adapter及runtime对象契约

## 1. 问题回答、诊断与取舍

Infra承接四平台协议反腐、六owner正式语义转换、23port实现、local storage/commit proof、private/secret/config/runtime/output。稳定配置、source模式、required-seam和availability不能全defer；实际SDK/client/executor/DB/Bus/KMS类型则必须先选择核验，不在本Step发明方法或pin。采用安全binding/context对象和明确NotEstablished；拒绝fake生产fallback、同源HTTP/poll/Gateway双模式、SDK自动retry/logging、NotFound推no-effect和反向依赖entry。

| capability | 输入 | 输出 / 副作用 | 功能到对象 / 类别 | 后续 |
|---|---|---|---|---|
| I-PLATFORM | qualified安装/namespace/config/private source/原effect | verified locators/ACK/known业务结果/limit/unknown | 四PlatformAdapter+PlatformAdapterContext+SourceRegistration / adapter-local | Step7四平台port映射；Step8协议；Step14真实client |
| I-OWNER | 正式source/版本/scope/current refs | 本地safe资格/actual同op结果 | 六OwnerAdapter+OwnerContractBinding / anti-corruption | Step7 owning port mapping，BR-UP保留 |
| I-STORE | 有界safe write set/CAS/原op | actual local commit/rollback/unknown与snapshot | LocalStoreAdapter/LocalCommitProbeAdapter / local driver binding | Step7/11/13；DB未选 |
| I-RUNTIME | safe settings/模式/required bindings/预算 | branch availability与bounded shutdown | SafeRuntimeSettings/Runtime* / stable runtime carrier | Step7装配调用；Step14/04真实产品 |
| I-PRIVATE/SECRET/OUTPUT | 精确version/scoped current refs与private借用 | transient材料/secret句柄或有限安全失败 | 绑定沿Application五private；无副本 | Step7 provider lifetime；Step12/15 sanitizer |

## 2. close/defer裁定

当前闭口以下adapter-local安全字段、source/mode注册、required seam/availability、composition/budget/shutdown和store binding；每独立adapter有factory及纯guard。产品client字段/trait impl函数和真实credential请求组合不在本Step假定，分别到Step7/14/04；未完成真实装配时available不得对外宣称operational。private/secret句柄复用Application，不复制public raw carrier。


## 3. mode、seam、availability与safe settings


### PlatformSourceMode
归属`platform/mod.rs`；逐安装及event family的排他source模式。
```rust
/// 逐安装及event family的排他source模式。
pub enum PlatformSourceMode {
    /// Slack Events HTTP。
    SlackEventsHttp,
    /// Slack Socket Mode。
    SlackSocket,
    /// 部署正式注册的HTTP/plugin/outgoing来源，不把incoming webhook当消息event。
    MattermostTrustedHttp,
    /// 部署合格的event WebSocket。
    MattermostWebSocket,
    /// Telegram webhook更新来源。
    TelegramWebhook,
    /// Telegram getUpdates来源。
    TelegramPolling,
    /// Discord HTTP interactions。
    DiscordHttpInteraction,
    /// Discord Gateway入口；不假定所有message intent已获准。
    DiscordGateway,
}
```
| 变体 | Rustdoc注释 / 载荷语义 | 允许来源 | 允许去向 |
|---|---|---|---|
| SlackEventsHttp | Slack Events HTTP | 所属正式source/纯组装 | 不适用，无lifecycle |
| SlackSocket | Slack Socket Mode | 所属正式source/纯组装 | 不适用，无lifecycle |
| MattermostTrustedHttp | 部署正式注册的HTTP/plugin/outgoing来源，不把incoming webhook当消息event | 所属正式source/纯组装 | 不适用，无lifecycle |
| MattermostWebSocket | 部署合格的event WebSocket | 所属正式source/纯组装 | 不适用，无lifecycle |
| TelegramWebhook | Telegram webhook更新来源 | 所属正式source/纯组装 | 不适用，无lifecycle |
| TelegramPolling | Telegram getUpdates来源 | 所属正式source/纯组装 | 不适用，无lifecycle |
| DiscordHttpInteraction | Discord HTTP interactions | 所属正式source/纯组装 | 不适用，无lifecycle |
| DiscordGateway | Discord Gateway入口；不假定所有message intent已获准 | 所属正式source/纯组装 | 不适用，无lifecycle |

| 类别 | 完整签名 | 中文Rustdoc |
|---|---|---|
| 工厂 | `pub fn validate(self) -> Result<Self, ContractViolation>` | /// 核载荷一致和finite分支，拒绝未知标签；不授authority。 |


### PlatformSourceFamily
归属`platform/mod.rs`；模式互斥按实际同源事件族。
```rust
/// 模式互斥按实际同源事件族。
pub enum PlatformSourceFamily {
    /// E01消息/变化来源。
    Inbound,
    /// E03交互回调来源。
    Callback,
}
```
| 变体 | Rustdoc注释 / 载荷语义 | 允许来源 | 允许去向 |
|---|---|---|---|
| Inbound | E01消息/变化来源 | 所属正式source/纯组装 | 不适用，无lifecycle |
| Callback | E03交互回调来源 | 所属正式source/纯组装 | 不适用，无lifecycle |

| 类别 | 完整签名 | 中文Rustdoc |
|---|---|---|
| 工厂 | `pub fn validate(self) -> Result<Self, ContractViolation>` | /// 核载荷一致和finite分支，拒绝未知标签；不授authority。 |


### RuntimeBranchKind
归属`runtime/composition.rs`；当前装配分支，不是服务或业务state。
```rust
/// 当前装配分支，不是服务或业务state。
pub enum RuntimeBranchKind {
    /// 受权C入口。
    Management,
    /// 安全E01入站。
    Inbound,
    /// C04/E02固化plan。
    Preparation,
    /// J01原intent投递。
    Dispatch,
    /// E03 owner交接。
    Callback,
    /// J02/J03原op或gap恢复。
    Recovery,
    /// Q01~04无写读取。
    SafeRead,
    /// J04/E04 canonical交接。
    SafeHandoff,
    /// J05显式维护。
    Qualification,
    /// 明确选用的Workspace条件读取。
    WorkspaceRead,
}
```
| 变体 | Rustdoc注释 / 载荷语义 | 允许来源 | 允许去向 |
|---|---|---|---|
| Management | 受权C入口 | 所属正式source/纯组装 | 不适用，无lifecycle |
| Inbound | 安全E01入站 | 所属正式source/纯组装 | 不适用，无lifecycle |
| Preparation | C04/E02固化plan | 所属正式source/纯组装 | 不适用，无lifecycle |
| Dispatch | J01原intent投递 | 所属正式source/纯组装 | 不适用，无lifecycle |
| Callback | E03 owner交接 | 所属正式source/纯组装 | 不适用，无lifecycle |
| Recovery | J02/J03原op或gap恢复 | 所属正式source/纯组装 | 不适用，无lifecycle |
| SafeRead | Q01~04无写读取 | 所属正式source/纯组装 | 不适用，无lifecycle |
| SafeHandoff | J04/E04 canonical交接 | 所属正式source/纯组装 | 不适用，无lifecycle |
| Qualification | J05显式维护 | 所属正式source/纯组装 | 不适用，无lifecycle |
| WorkspaceRead | 明确选用的Workspace条件读取 | 所属正式source/纯组装 | 不适用，无lifecycle |

| 类别 | 完整签名 | 中文Rustdoc |
|---|---|---|
| 工厂 | `pub fn validate(self) -> Result<Self, ContractViolation>` | /// 核载荷一致和finite分支，拒绝未知标签；不授authority。 |


### RuntimeSeamKind
归属`runtime/composition.rs`；23port及技术provider完整注册表。
```rust
/// 23port及技术provider完整注册表。
pub enum RuntimeSeamKind {
    /// 原命名port：BindingQualificationPort。
    BindingQualificationPort,
    /// 原命名port：MappingRepository。
    MappingRepository,
    /// 原命名port：InstallationRepository。
    InstallationRepository,
    /// 原命名port：PlatformIngressPort。
    PlatformIngressPort,
    /// 原命名port：ConversationHandoffPort。
    ConversationHandoffPort,
    /// 原命名port：InboundRepository。
    InboundRepository,
    /// 原命名port：PresentationQualificationPort。
    PresentationQualificationPort,
    /// 原命名port：PlatformDeliveryPort。
    PlatformDeliveryPort,
    /// 原命名port：DeliveryRepository。
    DeliveryRepository,
    /// 原命名port：CallbackVerificationPort。
    CallbackVerificationPort,
    /// 原命名port：ActorResponsibilityPort。
    ActorResponsibilityPort,
    /// 原命名port：OwnerActionPort。
    OwnerActionPort,
    /// 原命名port：CallbackRepository。
    CallbackRepository,
    /// 原命名port：ContinuityRepository。
    ContinuityRepository,
    /// 原命名port：AuthoritativeRecoveryPort。
    AuthoritativeRecoveryPort,
    /// 原命名port：LaneRepository。
    LaneRepository,
    /// 原命名port：SafeObservationPort。
    SafeObservationPort,
    /// 原命名port：SafeReadQualificationPort。
    SafeReadQualificationPort,
    /// 原命名port：SafeTraceRepository。
    SafeTraceRepository,
    /// 原命名port：PrivateMaterialPort。
    PrivateMaterialPort,
    /// 原命名port：SecretResolutionPort。
    SecretResolutionPort,
    /// 原命名port：ConfigQualificationPort。
    ConfigQualificationPort,
    /// 原命名port：LocalUnitOfWorkPort。
    LocalUnitOfWorkPort,
    /// 宿主受信clock技术源，不新增业务port。
    TrustedClock,
    /// 同UoW技术ID源，不从external ID/body生成。
    LocalIdSource,
    /// 当前模式合格transport宿主，不选择路由产品。
    TransportHost,
}
```
| 变体 | Rustdoc注释 / 载荷语义 | 允许来源 | 允许去向 |
|---|---|---|---|
| BindingQualificationPort | 原命名port：BindingQualificationPort | 所属正式source/纯组装 | 不适用，无lifecycle |
| MappingRepository | 原命名port：MappingRepository | 所属正式source/纯组装 | 不适用，无lifecycle |
| InstallationRepository | 原命名port：InstallationRepository | 所属正式source/纯组装 | 不适用，无lifecycle |
| PlatformIngressPort | 原命名port：PlatformIngressPort | 所属正式source/纯组装 | 不适用，无lifecycle |
| ConversationHandoffPort | 原命名port：ConversationHandoffPort | 所属正式source/纯组装 | 不适用，无lifecycle |
| InboundRepository | 原命名port：InboundRepository | 所属正式source/纯组装 | 不适用，无lifecycle |
| PresentationQualificationPort | 原命名port：PresentationQualificationPort | 所属正式source/纯组装 | 不适用，无lifecycle |
| PlatformDeliveryPort | 原命名port：PlatformDeliveryPort | 所属正式source/纯组装 | 不适用，无lifecycle |
| DeliveryRepository | 原命名port：DeliveryRepository | 所属正式source/纯组装 | 不适用，无lifecycle |
| CallbackVerificationPort | 原命名port：CallbackVerificationPort | 所属正式source/纯组装 | 不适用，无lifecycle |
| ActorResponsibilityPort | 原命名port：ActorResponsibilityPort | 所属正式source/纯组装 | 不适用，无lifecycle |
| OwnerActionPort | 原命名port：OwnerActionPort | 所属正式source/纯组装 | 不适用，无lifecycle |
| CallbackRepository | 原命名port：CallbackRepository | 所属正式source/纯组装 | 不适用，无lifecycle |
| ContinuityRepository | 原命名port：ContinuityRepository | 所属正式source/纯组装 | 不适用，无lifecycle |
| AuthoritativeRecoveryPort | 原命名port：AuthoritativeRecoveryPort | 所属正式source/纯组装 | 不适用，无lifecycle |
| LaneRepository | 原命名port：LaneRepository | 所属正式source/纯组装 | 不适用，无lifecycle |
| SafeObservationPort | 原命名port：SafeObservationPort | 所属正式source/纯组装 | 不适用，无lifecycle |
| SafeReadQualificationPort | 原命名port：SafeReadQualificationPort | 所属正式source/纯组装 | 不适用，无lifecycle |
| SafeTraceRepository | 原命名port：SafeTraceRepository | 所属正式source/纯组装 | 不适用，无lifecycle |
| PrivateMaterialPort | 原命名port：PrivateMaterialPort | 所属正式source/纯组装 | 不适用，无lifecycle |
| SecretResolutionPort | 原命名port：SecretResolutionPort | 所属正式source/纯组装 | 不适用，无lifecycle |
| ConfigQualificationPort | 原命名port：ConfigQualificationPort | 所属正式source/纯组装 | 不适用，无lifecycle |
| LocalUnitOfWorkPort | 原命名port：LocalUnitOfWorkPort | 所属正式source/纯组装 | 不适用，无lifecycle |
| TrustedClock | 宿主受信clock技术源，不新增业务port | 所属正式source/纯组装 | 不适用，无lifecycle |
| LocalIdSource | 同UoW技术ID源，不从external ID/body生成 | 所属正式source/纯组装 | 不适用，无lifecycle |
| TransportHost | 当前模式合格transport宿主，不选择路由产品 | 所属正式source/纯组装 | 不适用，无lifecycle |

| 类别 | 完整签名 | 中文Rustdoc |
|---|---|---|
| 工厂 | `pub fn validate(self) -> Result<Self, ContractViolation>` | /// 核载荷一致和finite分支，拒绝未知标签；不授authority。 |


### RuntimeSeamApplicability
归属`runtime/composition.rs`；required不能因缺adapter降成可选。
```rust
/// required不能因缺adapter降成可选。
pub enum RuntimeSeamApplicability {
    /// 本分支必须actual合格。
    Required,
    /// owner规则明确不mandatory且此分支未选用；不是任意配置开关。
    OwnerPermitsOmission(QualificationMaintenanceBasisRef),
}
```
| 变体 | Rustdoc注释 / 载荷语义 | 允许来源 | 允许去向 |
|---|---|---|---|
| Required | 本分支必须actual合格 | 所属正式source/纯组装 | 不适用，无lifecycle |
| OwnerPermitsOmission | owner规则明确不mandatory且此分支未选用；不是任意配置开关；`QualificationMaintenanceBasisRef` | 所属正式source/纯组装 | 不适用，无lifecycle |

| 类别 | 完整签名 | 中文Rustdoc |
|---|---|---|
| 工厂 | `pub fn validate(self) -> Result<Self, ContractViolation>` | /// 核载荷一致和finite分支，拒绝未知标签；不授authority。 |


### RuntimeAvailability
归属`runtime/composition.rs`；当前稳定装配结果，不是readiness。
```rust
/// 当前稳定装配结果，不是readiness。
pub enum RuntimeAvailability {
    /// 产品/provider或分支未选择。
    NotSelected(SafeReasonCode),
    /// 已选择但真实绑定/准入/资格缺失。
    NotEstablished(SafeReasonCode),
    /// 实际所有required注册及模式已核，有限期限；不替业务current授权。
    Qualified(SafeValidityWindow),
}
```
| 变体 | Rustdoc注释 / 载荷语义 | 允许来源 | 允许去向 |
|---|---|---|---|
| NotSelected | 产品/provider或分支未选择；`SafeReasonCode` | 所属正式source/纯组装 | 不适用，无lifecycle |
| NotEstablished | 已选择但真实绑定/准入/资格缺失；`SafeReasonCode` | 所属正式source/纯组装 | 不适用，无lifecycle |
| Qualified | 实际所有required注册及模式已核，有限期限；不替业务current授权；`SafeValidityWindow` | 所属正式source/纯组装 | 不适用，无lifecycle |

| 类别 | 完整签名 | 中文Rustdoc |
|---|---|---|
| 工厂 | `pub fn validate(self) -> Result<Self, ContractViolation>` | /// 核载荷一致和finite分支，拒绝未知标签；不授authority。 |


### RuntimeExecutionPhase
归属`runtime/execution.rs`；只有进程本地phase，不计入17业务机。
```rust
/// 只有进程本地phase，不计入17业务机。
pub enum RuntimeExecutionPhase {
    /// 未启动宿主。
    Constructed,
    /// 实际已开始本地执行。
    Active,
    /// 不接新项，保原unknown。
    Draining,
    /// 本地停止且无未决项。
    StoppedLocal,
    /// 本地已停止，但原operation/effect仍未决。
    StoppedWithUnknown,
}
```
| 变体 | Rustdoc注释 / 载荷语义 | 允许来源 | 允许去向 |
|---|---|---|---|
| Constructed | 未启动宿主 | from_parts固定初态 | begin且actual required当前齐 -> Active |
| Active | 实际已开始本地执行 | Constructed经begin | begin_shutdown -> Draining |
| Draining | 不接新项，保原unknown | Active经begin_shutdown | record_local_stop按未决集合 -> StoppedLocal/StoppedWithUnknown |
| StoppedLocal | 本地停止且无未决项 | Draining且实际未决为空 | 无本次实例回边；新宿主不能伪造业务已完成 |
| StoppedWithUnknown | 本地已停止，但原operation/effect仍未决 | Draining且仍有实际未决 | 无本次实例回边；Application原恢复责任保留 |

| 类别 | 完整签名 | 中文Rustdoc |
|---|---|---|
| 工厂 | `pub fn validate(self) -> Result<Self, ContractViolation>` | /// 核载荷一致和finite分支，拒绝未知标签；不授authority。 |


### QualifiedPlatformSourceRegistration
归属`platform/mod.rs`；逐source identity及family的current注册。
```rust
/// 逐source identity及family的current注册。
pub struct QualifiedPlatformSourceRegistration {
    /// 原安装。
    installation: BridgeInstallationRef,
    /// E01或E03来源族。
    family: PlatformSourceFamily,
    /// 唯一source模式。
    mode: PlatformSourceMode,
    /// 实际source identity。
    source_id: SafeOpaqueId,
    /// 受权source scope。
    scope: SafeScopeRef,
    /// current有限资格。
    qualification: QualificationSlot<InstallationQualificationRef>,
}
```
| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| installation | `BridgeInstallationRef` | 原安装；qualified config |
| family | `PlatformSourceFamily` | E01或E03来源族；registered capability |
| mode | `PlatformSourceMode` | 唯一source模式；明确adapter config |
| source_id | `SafeOpaqueId` | 实际source identity；platform/deployment注册，不是message ID |
| scope | `SafeScopeRef` | 受权source scope；formal admission |
| qualification | `QualificationSlot<InstallationQualificationRef>` | current有限资格；ConfigQualificationPort，缺失不启动 |

| 类别 | 完整签名 | 中文Rustdoc / 参数、返回和副作用 |
|---|---|---|
| 工厂 | `pub fn from_parts(installation: BridgeInstallationRef, family: PlatformSourceFamily, mode: PlatformSourceMode, source_id: SafeOpaqueId, scope: SafeScopeRef, qualification: QualificationSlot<InstallationQualificationRef>) -> Result<Self, ContractViolation>` | /// 校验并完整复制上述全部入参；不生成ID/时间/权限，无IO |
| 成员 | `pub fn assert_exclusive(&self, other: &Self) -> Result<(), ContractViolation>` | /// 同安装/family/source_id只能一个active模式；mode不同不能通过去重容忍双消费 |


只读消费面：保持字段私有，不提供mutable getter或跳过factory；公开可读取不等于可以日志/外显；Application须重新核验current资格并过滤。

| 完整签名 | 中文Rustdoc / 副作用 |
|---|---|
| `pub fn installation(&self) -> &BridgeInstallationRef` | /// 借用原installation字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn family(&self) -> &PlatformSourceFamily` | /// 借用原family字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn mode(&self) -> &PlatformSourceMode` | /// 借用原mode字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn source_id(&self) -> &SafeOpaqueId` | /// 借用原source_id字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn scope(&self) -> &SafeScopeRef` | /// 借用原scope字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn qualification(&self) -> &QualificationSlot<InstallationQualificationRef>` | /// 借用原qualification字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |

不变量/禁止：结构校验不授权；完整复制全部字段，缺正式来源拒绝。

### RuntimeSeamBinding
归属`runtime/composition.rs`；一个port/provider的safe绑定状态。
```rust
/// 一个port/provider的safe绑定状态。
pub struct RuntimeSeamBinding {
    /// 精确seam。
    kind: RuntimeSeamKind,
    /// 真实来源/版本。
    source: SafeAuthoritySourceRef,
    /// 该seam实际资格。
    qualification: QualificationSlot<SafeAuthorityRef>,
    /// Required或正式允许省略。
    applicability: RuntimeSeamApplicability,
}
```
| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| kind | `RuntimeSeamKind` | 精确seam；branch静态需求表 |
| source | `SafeAuthoritySourceRef` | 真实来源/版本；qualified bootstrap映射 |
| qualification | `QualificationSlot<SafeAuthorityRef>` | 该seam实际资格；exact kind RuntimeSeamBinding，wrong source拒绝 |
| applicability | `RuntimeSeamApplicability` | Required或正式允许省略；formal branch/owner rule |

| 类别 | 完整签名 | 中文Rustdoc / 参数、返回和副作用 |
|---|---|---|
| 工厂 | `pub fn from_parts(kind: RuntimeSeamKind, source: SafeAuthoritySourceRef, qualification: QualificationSlot<SafeAuthorityRef>, applicability: RuntimeSeamApplicability) -> Result<Self, ContractViolation>` | /// 校验并完整复制上述全部入参；不生成ID/时间/权限，无IO |
| 成员 | `pub fn assert_current(&self, now: SafeInstant) -> Result<(), ContractViolation>` | /// Required必须Established且actual source/window当前有效；不做network refresh |


只读消费面：保持字段私有，不提供mutable getter或跳过factory；公开可读取不等于可以日志/外显；Application须重新核验current资格并过滤。

| 完整签名 | 中文Rustdoc / 副作用 |
|---|---|
| `pub fn kind(&self) -> &RuntimeSeamKind` | /// 借用原kind字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn source(&self) -> &SafeAuthoritySourceRef` | /// 借用原source字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn qualification(&self) -> &QualificationSlot<SafeAuthorityRef>` | /// 借用原qualification字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn applicability(&self) -> &RuntimeSeamApplicability` | /// 借用原applicability字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |

不变量/禁止：结构校验不授权；完整复制全部字段，缺正式来源拒绝。

### RuntimeRequiredSeams
归属`runtime/composition.rs`；选用分支所需完整seam集合。
```rust
/// 选用分支所需完整seam集合。
pub struct RuntimeRequiredSeams {
    /// 明确选用分支。
    branches: Vec<RuntimeBranchKind>,
    /// 完整实际绑定状态。
    bindings: Vec<RuntimeSeamBinding>,
    /// 按family排他source注册。
    sources: Vec<QualifiedPlatformSourceRegistration>,
}
```
| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| branches | `Vec<RuntimeBranchKind>` | 明确选用分支；受权settings |
| bindings | `Vec<RuntimeSeamBinding>` | 完整实际绑定状态；bootstrap registered adapters，无重复 |
| sources | `Vec<QualifiedPlatformSourceRegistration>` | 按family排他source注册；qualified config |

| 类别 | 完整签名 | 中文Rustdoc / 参数、返回和副作用 |
|---|---|---|
| 工厂 | `pub fn from_parts(branches: Vec<RuntimeBranchKind>, bindings: Vec<RuntimeSeamBinding>, sources: Vec<QualifiedPlatformSourceRegistration>) -> Result<Self, ContractViolation>` | /// 校验并完整复制上述全部入参；不生成ID/时间/权限，无IO |
| 成员 | `pub fn evaluate(&self, now: SafeInstant) -> Result<RuntimeAvailability, ContractViolation>` | /// 检查下方branch完整需求与source互斥；缺任何mandatory则NotEstablished，不默认省略 |


只读消费面：保持字段私有，不提供mutable getter或跳过factory；公开可读取不等于可以日志/外显；Application须重新核验current资格并过滤。

| 完整签名 | 中文Rustdoc / 副作用 |
|---|---|
| `pub fn branches(&self) -> &Vec<RuntimeBranchKind>` | /// 借用原branches字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn bindings(&self) -> &Vec<RuntimeSeamBinding>` | /// 借用原bindings字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn sources(&self) -> &Vec<QualifiedPlatformSourceRegistration>` | /// 借用原sources字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |

不变量/禁止：结构校验不授权；完整复制全部字段，缺正式来源拒绝。

#### RuntimeRequiredSeams分支需求闭环

以下是evaluate消费的静态责任表，不是新的trait/产品选择。CommonRead为ConfigQualificationPort、InstallationRepository和TrustedClock；受信入口/网络宿主另要求TransportHost。MutatingLocal为LocalUnitOfWorkPort、ContinuityRepository、SafeTraceRepository和LocalIdSource，不能套用到Query。各分支所列required为受影响能力的合集；C04/C05/C06再叠加所属Preparation/Callback绑定准备/Recovery请求的读取资格，不能由请求自由选择省略seam。

| branch | 必需seam / 资格闭包 | source及owner限制 | 不可用姿态 |
|---|---|---|---|
| Management | CommonRead、MutatingLocal、TransportHost、BindingQualificationPort、MappingRepository、ActorResponsibilityPort；C04/C05按所属准备能力叠加PresentationQualificationPort/DeliveryRepository或OwnerActionPort/CallbackRepository | 配置接纳、显式relation/mapping/绑定action/请求维护；不require实际平台send才能接受安全配置；不启用不可用C04/C05分支 | 管理认证/授权或required local seam缺失拒绝；平台产品未选不因此造Qualified installation |
| Inbound | CommonRead、MutatingLocal、TransportHost、BindingQualificationPort、ActorResponsibilityPort、MappingRepository、PlatformIngressPort、ConversationHandoffPort、InboundRepository、PrivateMaterialPort、SecretResolutionPort | qualified E01来源family；owner target/mode/material/digest/附件current；verification secret仅当前source用途 | 缺owning合同/source/method/材料先阻owner IO；可给安全protocol ACK也不宣owner accepted |
| Preparation | CommonRead、MutatingLocal、BindingQualificationPort、ActorResponsibilityPort、MappingRepository、PresentationQualificationPort、DeliveryRepository | C04/E02 qualified committed source，source/target/Gate/附件及effect唯一；E02另TransportHost及正式producer来源 | 缺safe projection/disclosure/current basis不构造可执行intent；不会为了准备调用send |
| Dispatch | CommonRead、MutatingLocal、TransportHost、BindingQualificationPort、MappingRepository、PresentationQualificationPort、PlatformDeliveryPort、DeliveryRepository、LaneRepository、PrivateMaterialPort、SecretResolutionPort | 已有intent、original plan/target/effect/attempt/fence、逐method与所有limit/window/预算；网络前durable阶段及current重核 | required/secret/method/lane任一缺失不离开private IO seam；不借SDK隐式retry补资格 |
| Callback | CommonRead、MutatingLocal、TransportHost、BindingQualificationPort、MappingRepository、CallbackVerificationPort、ActorResponsibilityPort、OwnerActionPort、CallbackRepository、SecretResolutionPort | qualified E03来源family，原action/source/actor/target/owner revision/expiry；C05只是绑定准备，不执行owner action | 验签失败不造Verified；safe owner action ref缺失blocked；签名或token不授权审批 |
| Recovery | CommonRead、MutatingLocal、TransportHost、BindingQualificationPort、AuthoritativeRecoveryPort、MappingRepository、InboundRepository、DeliveryRepository、CallbackRepository、LaneRepository | 注册本branch完整原subject读取/finalize能力；同driver的local probe及正式owner/platform/consumer原op读取；gap同epoch/comparator/full coverage | 未核probe/window时manual/blocked；unknown保持；不包含send/action作为默认恢复步骤 |
| SafeRead | CommonRead、TransportHost、SafeReadQualificationPort、MappingRepository、InboundRepository、DeliveryRepository、CallbackRepository、ContinuityRepository、LaneRepository、SafeTraceRepository | Q01~04 resolver-first，原snapshot/stage/ref/count逐字段可见性；不需要LocalUnitOfWorkPort/LocalIdSource作为Query副作用 | 缺read资格finite denied/unavailable；禁止refresh/probe/repair/dedup/audit写入；缺required不返回空成功 |
| SafeHandoff | CommonRead、MutatingLocal、TransportHost、SafeObservationPort、AuthoritativeRecoveryPort | 原canonical/schema/admission/producer/consumer op与qualified J04/E04；同op result读取不是新producer | canonical/admission/result合同缺失不交接；consumer未知不造accepted/evidence |
| Qualification | CommonRead、MutatingLocal、BindingQualificationPort、ActorResponsibilityPort、MappingRepository、InboundRepository、DeliveryRepository、CallbackRepository、LaneRepository | J05只已存在JobSubjectRef；Config/Mapping/各所属carrier bounded失效；维护不能生成新权限或跨epoch清gap | 缺maintenance scope/source有限blocked；expiry在每IO即时核，不依赖job准时 |
| WorkspaceRead | SafeReadQualificationPort或已选PresentationQualificationPort中实际WorkspaceOwnerAdapter binding，并继承相应SafeRead/Preparation分支required | 只有明确选用Workspace safe read/export/provenance时才required；没有新Workspace业务port；不是频道或权限owner | 未选用不阻其他branch；选用却formal资格/开放项未释放则对应branch unavailable |

任何mutation若正式producer规则为OwnerMandatory，**额外SafeObservationPort及actual canonical/schema/admission资格必须先齐**，不能因runtime配置关掉；SafeHandoff本身总required。OwnerPermitsOmission只接受正式非mandatory依据，不接受布尔audit_only/fallback。Workspace未选用属于明确非消费，不可类推为Observability mandatory也能省略。

source互斥键为installation + actual source identity + family，按注册资格定义其scope；同一E01或E03来源不能同时active HTTP与Socket/poll/Gateway模式。Discord E01 Gateway与E03 HTTP可以是不同family，不笼统互禁整个安装；Telegram webhook/polling接收同一updates来源时同时包含其消息/回调family，整体切换须原子排他，不只切其中一族。缺method/family资格不得猜已有source能够承接；断连/换epoch保gap，protocol位置不当owner进度。

RuntimeSeamBinding的qualification须涵盖settings所有选中installation/scope/source，而不是只注册一个kind就证明每安装可用；多安装中缺一项按受影响branch拒绝，不能把其他安装的Qualified借给它。实际builder依赖对象/SDK client/transport host按Step7/14验证，本表不声称任何运行资格已建立。

### RuntimeExecutionBudget
归属`runtime/execution.rs`；宿主有界执行与private存活预算。
```rust
/// 宿主有界执行与private存活预算。
pub struct RuntimeExecutionBudget {
    /// 并发上限。
    max_inflight: u32,
    /// 单batch上限。
    max_batch: u32,
    /// 单call私有材料上限。
    max_private_bytes: u64,
    /// 本地等待上限。
    max_wait_millis: u64,
    /// 实际本次停止deadline。
    shutdown_deadline: SafeInstant,
}
```
| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| max_inflight | `u32` | 并发上限；受权profile，非零 |
| max_batch | `u32` | 单batch上限；同profile |
| max_private_bytes | `u64` | 单call私有材料上限；同profile |
| max_wait_millis | `u64` | 本地等待上限；同profile，不缩平台rate下界 |
| shutdown_deadline | `SafeInstant` | 实际本次停止deadline；host clock+受权窗口 |

| 类别 | 完整签名 | 中文Rustdoc / 参数、返回和副作用 |
|---|---|---|
| 工厂 | `pub fn from_parts(max_inflight: u32, max_batch: u32, max_private_bytes: u64, max_wait_millis: u64, shutdown_deadline: SafeInstant) -> Result<Self, ContractViolation>` | /// 校验并完整复制上述全部入参；不生成ID/时间/权限，无IO |
| 成员 | `pub fn assert_bounded(&self) -> Result<(), ContractViolation>` | /// 非零且合法profile；到期只停止本地等候，未知保留 |


只读消费面：保持字段私有，不提供mutable getter或跳过factory；公开可读取不等于可以日志/外显；Application须重新核验current资格并过滤。

| 完整签名 | 中文Rustdoc / 副作用 |
|---|---|
| `pub fn max_inflight(&self) -> &u32` | /// 借用原max_inflight字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn max_batch(&self) -> &u32` | /// 借用原max_batch字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn max_private_bytes(&self) -> &u64` | /// 借用原max_private_bytes字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn max_wait_millis(&self) -> &u64` | /// 借用原max_wait_millis字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn shutdown_deadline(&self) -> &SafeInstant` | /// 借用原shutdown_deadline字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |

不变量/禁止：结构校验不授权；完整复制全部字段，缺正式来源拒绝。

shutdown消费闭环（04 CFG-03-001）：装配时shutdown_deadline由actual同域clock与批准窗口生成有限seed，仅满足原carrier构造/shape；Active期间不能把它当进程TTL或沿用为未来停止期限。实际停止事件由受信host重新读取同域clock，以checked加法和批准shutdown窗口派生deadline，并用原四项资源元组构造新RuntimeExecutionBudget传入RuntimeExecutionState::begin_shutdown。state先核phase/bounded/四元组全等，全部guard通过后才替换预算并合并unresolved；不增加state迁移边或公开setter。clock/profile不能核时停止新IO、宿主隔离/取消且保actual unknown，不虚构deadline/StoppedLocal/NoEffect。

### SafeRuntimeSettings
归属`configuration/settings.rs`；只有refs/profile的稳定配置对象。
```rust
/// 只有refs/profile的稳定配置对象。
pub struct SafeRuntimeSettings {
    /// 受权安全配置。
    installations: Vec<InstallationConfigDraft>,
    /// 选用分支。
    branches: Vec<RuntimeBranchKind>,
    /// 完整有界预算。
    budget: RuntimeExecutionBudget,
    /// 设置来源。
    configuration_basis: ConfigurationBasisRef,
}
```
| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| installations | `Vec<InstallationConfigDraft>` | 受权安全配置；structured配置输入；无raw secret/URL |
| branches | `Vec<RuntimeBranchKind>` | 选用分支；受权配置，不是grant |
| budget | `RuntimeExecutionBudget` | 完整有界预算；正式profile，具体值到04 |
| configuration_basis | `ConfigurationBasisRef` | 设置来源；当前配置授权 |

| 类别 | 完整签名 | 中文Rustdoc / 参数、返回和副作用 |
|---|---|---|
| 工厂 | `pub fn from_parts(installations: Vec<InstallationConfigDraft>, branches: Vec<RuntimeBranchKind>, budget: RuntimeExecutionBudget, configuration_basis: ConfigurationBasisRef) -> Result<Self, ContractViolation>` | /// 校验并完整复制上述全部入参；不生成ID/时间/权限，无IO |
| 成员 | `pub fn validate_shape(&self) -> Result<(), ContractViolation>` | /// namespace不重复、refs/kinds匹配、预算完整；不声明平台安装已qualified |


只读消费面：保持字段私有，不提供mutable getter或跳过factory；公开可读取不等于可以日志/外显；Application须重新核验current资格并过滤。

| 完整签名 | 中文Rustdoc / 副作用 |
|---|---|
| `pub fn installations(&self) -> &Vec<InstallationConfigDraft>` | /// 借用原installations字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn branches(&self) -> &Vec<RuntimeBranchKind>` | /// 借用原branches字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn budget(&self) -> &RuntimeExecutionBudget` | /// 借用原budget字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn configuration_basis(&self) -> &ConfigurationBasisRef` | /// 借用原configuration_basis字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |

不变量/禁止：结构校验不授权；完整复制全部字段，缺正式来源拒绝。

### RuntimeCompositionPlan
归属`runtime/composition.rs`；actual装配前的稳定计划。
```rust
/// actual装配前的稳定计划。
pub struct RuntimeCompositionPlan {
    /// safe settings。
    settings: SafeRuntimeSettings,
    /// 完整binding/source资格状态。
    required: RuntimeRequiredSeams,
}
```
| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| settings | `SafeRuntimeSettings` | safe settings；structured loader |
| required | `RuntimeRequiredSeams` | 完整binding/source资格状态；actual bootstrap registry |

| 类别 | 完整签名 | 中文Rustdoc / 参数、返回和副作用 |
|---|---|---|
| 工厂 | `pub fn from_parts(settings: SafeRuntimeSettings, required: RuntimeRequiredSeams) -> Result<Self, ContractViolation>` | /// 校验并完整复制上述全部入参；不生成ID/时间/权限，无IO |
| 成员 | `pub fn evaluate(&self, now: SafeInstant) -> Result<RuntimeAvailability, ContractViolation>` | /// settings选择与branch集合一致；纯评估，真实builder/client构建和产品绑定到Step7/14 |


只读消费面：保持字段私有，不提供mutable getter或跳过factory；公开可读取不等于可以日志/外显；Application须重新核验current资格并过滤。

| 完整签名 | 中文Rustdoc / 副作用 |
|---|---|
| `pub fn settings(&self) -> &SafeRuntimeSettings` | /// 借用原settings字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn required(&self) -> &RuntimeRequiredSeams` | /// 借用原required字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |

不变量/禁止：结构校验不授权；完整复制全部字段，缺正式来源拒绝。

### RuntimeExecutionState
归属`runtime/execution.rs`；宿主本地phase及未决原操作集合。
```rust
/// 宿主本地phase及未决原操作集合。
pub struct RuntimeExecutionState {
    /// 宿主phase。
    phase: RuntimeExecutionPhase,
    /// actual装配资格。
    availability: RuntimeAvailability,
    /// 有界停止预算。
    budget: RuntimeExecutionBudget,
    /// 实际未决原op/effect。
    unresolved: Vec<OriginalOperationEffectRef>,
}
```
| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| phase | `RuntimeExecutionPhase` | 宿主phase；初始Constructed |
| availability | `RuntimeAvailability` | actual装配资格；bootstrap evaluated结果；无假Qualified |
| budget | `RuntimeExecutionBudget` | 有界停止预算；same profile |
| unresolved | `Vec<OriginalOperationEffectRef>` | 实际未决原op/effect；Application/driver actual outcomes，不构造示例值 |

| 类别 | 完整签名 | 中文Rustdoc / 参数、返回和副作用 |
|---|---|---|
| 工厂 | `pub fn from_parts(phase: RuntimeExecutionPhase, availability: RuntimeAvailability, budget: RuntimeExecutionBudget, unresolved: Vec<OriginalOperationEffectRef>) -> Result<Self, ContractViolation>` | /// 完整复制且phase只接受Constructed，availability仅actual纯评估结果，unresolved仅actual继承原op集合；不以构造跳过begin的required核验，不生成ID/时间/权限，无IO。 |
| 成员 | `pub fn begin(&mut self, current: RuntimeRequiredSeams, now: SafeInstant) -> Result<(), ContractViolation>` | /// Constructed->Active仅actual全部required资格成立 |
| 成员 | `pub fn begin_shutdown(&mut self, shutdown_budget: RuntimeExecutionBudget, unresolved: Vec<OriginalOperationEffectRef>) -> Result<(), ContractViolation>` | /// Active->Draining；先核shutdown_budget有界且四资源字段与原budget全等，其deadline由受信host在actual停止事件以同域clock及批准窗口派生；guard通过后替换停止budget并合并actual unknown，空集合不清既有未决；不读取clock或签发权限，guard失败零修改。 |
| 成员 | `pub fn record_local_stop(&mut self) -> Result<(), ContractViolation>` | /// Draining->StoppedLocal/StoppedWithUnknown依实际未决集合；不证明外部已撤销 |


只读消费面：保持字段私有，不提供mutable getter或跳过factory；公开可读取不等于可以日志/外显；Application须重新核验current资格并过滤。

| 完整签名 | 中文Rustdoc / 副作用 |
|---|---|
| `pub fn phase(&self) -> &RuntimeExecutionPhase` | /// 借用原phase字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn availability(&self) -> &RuntimeAvailability` | /// 借用原availability字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn budget(&self) -> &RuntimeExecutionBudget` | /// 借用原budget字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn unresolved(&self) -> &Vec<OriginalOperationEffectRef>` | /// 借用原unresolved字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |

不变量/禁止：phase/stopping属adapter-local runtime；没有reset未知、删claim或重建effect的成员；业务恢复只Application原subject。


## 4. 四平台独立adapter-local对象


### PlatformAdapterContext
归属`platform/mod.rs`；本平台安全配置及source注册上下文。
```rust
/// 本平台安全配置及source注册上下文。
pub struct PlatformAdapterContext {
    /// 原installation。
    installation: BridgeInstallationRef,
    /// 原platform/server/environment安装scope。
    namespace: InstallationNamespace,
    /// 当前配置版本。
    config_revision: ConfigRevision,
    /// 逐method/presentation能力依据。
    capability: CapabilitySnapshotRef,
    /// 精确provider/key/version引用。
    secret: OpaqueSecretBindingRef,
    /// 正式路由ref。
    route: RoutePolicyRef,
    /// 排他注册的入口。
    sources: Vec<QualifiedPlatformSourceRegistration>,
    /// current安装seam资格。
    qualification: InstallationQualificationRefSlot,
}
```
| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| installation | `BridgeInstallationRef` | 原installation；trusted config |
| namespace | `InstallationNamespace` | 原platform/server/environment安装scope；same config |
| config_revision | `ConfigRevision` | 当前配置版本；actual InstallationRepository |
| capability | `CapabilitySnapshotRef` | 逐method/presentation能力依据；qualified adapter/config source |
| secret | `OpaqueSecretBindingRef` | 精确provider/key/version引用；ConfigQualificationPort/SecretResolutionPort |
| route | `RoutePolicyRef` | 正式路由ref；same current config，不存私有URL |
| sources | `Vec<QualifiedPlatformSourceRegistration>` | 排他注册的入口；实际selected注册 |
| qualification | `InstallationQualificationRefSlot` | current安装seam资格；缺失保持not_established，不能构造fake grant |

| 类别 | 完整签名 | 中文Rustdoc / 参数、返回和副作用 |
|---|---|---|
| 工厂 | `pub fn from_parts(installation: BridgeInstallationRef, namespace: InstallationNamespace, config_revision: ConfigRevision, capability: CapabilitySnapshotRef, secret: OpaqueSecretBindingRef, route: RoutePolicyRef, sources: Vec<QualifiedPlatformSourceRegistration>, qualification: InstallationQualificationRefSlot) -> Result<Self, ContractViolation>` | /// 校验并完整复制上述全部入参；不生成ID/时间/权限，无IO |
| 成员 | `pub fn assert_current(&self, now: SafeInstant) -> Result<(), ContractViolation>` | /// 同namespace/config/capability/route/secret当前依据完整且source模式排他；每次private IO另重核 |


只读消费面：保持字段私有，不提供mutable getter或跳过factory；公开可读取不等于可以日志/外显；Application须重新核验current资格并过滤。

| 完整签名 | 中文Rustdoc / 副作用 |
|---|---|
| `pub fn installation(&self) -> &BridgeInstallationRef` | /// 借用原installation字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn namespace(&self) -> &InstallationNamespace` | /// 借用原namespace字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn config_revision(&self) -> &ConfigRevision` | /// 借用原config_revision字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn capability(&self) -> &CapabilitySnapshotRef` | /// 借用原capability字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn secret(&self) -> &OpaqueSecretBindingRef` | /// 借用原secret字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn route(&self) -> &RoutePolicyRef` | /// 借用原route字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn sources(&self) -> &Vec<QualifiedPlatformSourceRegistration>` | /// 借用原sources字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn qualification(&self) -> &InstallationQualificationRefSlot` | /// 借用原qualification字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |

不变量/禁止：结构校验不授权；完整复制全部字段，缺正式来源拒绝。

### SlackPlatformAdapter
归属`platform/slack.rs`；I-PLATFORM Slack反腐adapter-local。
```rust
/// I-PLATFORM Slack反腐adapter-local。
pub struct SlackPlatformAdapter {
    /// 本平台current安全context。
    context: PlatformAdapterContext,
}
```
| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| context | `PlatformAdapterContext` | 本平台current安全context；same registered platform，不保存raw SDK response |

| 类别 | 完整签名 | 中文Rustdoc / 参数、返回和副作用 |
|---|---|---|
| 工厂 | `pub fn from_parts(context: PlatformAdapterContext) -> Result<Self, ContractViolation>` | /// 校验并完整复制上述全部入参；不生成ID/时间/权限，无IO |
| 成员 | `pub fn context(&self) -> &PlatformAdapterContext` | /// 纯读safe配置，不是IO或授权 |
| 成员 | `pub fn assert_source_mode(&self, source: &QualifiedPlatformSourceRegistration, now: SafeInstant) -> Result<(), ContractViolation>` | /// 核Slack namespace/family/mode及current qualifier；team/installation/user/channel/message ts原样opaque；Events HTTP/Socket源按family互斥，签名/重放窗口、3s类期限按实际mode合同；threads/edit/delete/Files/OAuth scope各须实际method资格 |
不变量/禁止：constructor全输入只检查namespace.platform=Slack及字段闭包，不建立连接；实际client/port async方法defer Step7/14；缺version/method/scope/pin必blocked或明确unsupported，禁止log raw、默认SDK retry和猜locator。

### MattermostPlatformAdapter
归属`platform/mattermost.rs`；I-PLATFORM Mattermost反腐adapter-local。
```rust
/// I-PLATFORM Mattermost反腐adapter-local。
pub struct MattermostPlatformAdapter {
    /// 本平台current安全context。
    context: PlatformAdapterContext,
}
```
| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| context | `PlatformAdapterContext` | 本平台current安全context；same registered platform，不保存raw SDK response |

| 类别 | 完整签名 | 中文Rustdoc / 参数、返回和副作用 |
|---|---|---|
| 工厂 | `pub fn from_parts(context: PlatformAdapterContext) -> Result<Self, ContractViolation>` | /// 校验并完整复制上述全部入参；不生成ID/时间/权限，无IO |
| 成员 | `pub fn context(&self) -> &PlatformAdapterContext` | /// 纯读safe配置，不是IO或授权 |
| 成员 | `pub fn assert_source_mode(&self, source: &QualifiedPlatformSourceRegistration, now: SafeInstant) -> Result<(), ContractViolation>` | /// 核Mattermost namespace/family/mode及current qualifier；server/version/team/user/channel/post/root/部署plugin信任链；不套Slack signing headers、Blocks或固定限流；incoming webhook是写平台seam，不能冒充inbound消息源 |
不变量/禁止：constructor全输入只检查namespace.platform=Mattermost及字段闭包，不建立连接；实际client/port async方法defer Step7/14；缺version/method/scope/pin必blocked或明确unsupported，禁止log raw、默认SDK retry和猜locator。

### TelegramPlatformAdapter
归属`platform/telegram.rs`；I-PLATFORM Telegram反腐adapter-local。
```rust
/// I-PLATFORM Telegram反腐adapter-local。
pub struct TelegramPlatformAdapter {
    /// 本平台current安全context。
    context: PlatformAdapterContext,
}
```
| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| context | `PlatformAdapterContext` | 本平台current安全context；same registered platform，不保存raw SDK response |

| 类别 | 完整签名 | 中文Rustdoc / 参数、返回和副作用 |
|---|---|---|
| 工厂 | `pub fn from_parts(context: PlatformAdapterContext) -> Result<Self, ContractViolation>` | /// 校验并完整复制上述全部入参；不生成ID/时间/权限，无IO |
| 成员 | `pub fn context(&self) -> &PlatformAdapterContext` | /// 纯读safe配置，不是IO或授权 |
| 成员 | `pub fn assert_source_mode(&self, source: &QualifiedPlatformSourceRegistration, now: SafeInstant) -> Result<(), ContractViolation>` | /// 核Telegram namespace/family/mode及current qualifier；bot安装/chat/message/topic/callback；webhook与polling同源互斥，offset只protocol来源位置，非owner提交；callback query ACK/token与业务分开，retry_after取权威下界 |
不变量/禁止：constructor全输入只检查namespace.platform=Telegram及字段闭包，不建立连接；实际client/port async方法defer Step7/14；缺version/method/scope/pin必blocked或明确unsupported，禁止log raw、默认SDK retry和猜locator。

### DiscordPlatformAdapter
归属`platform/discord.rs`；I-PLATFORM Discord反腐adapter-local。
```rust
/// I-PLATFORM Discord反腐adapter-local。
pub struct DiscordPlatformAdapter {
    /// 本平台current安全context。
    context: PlatformAdapterContext,
}
```
| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| context | `PlatformAdapterContext` | 本平台current安全context；same registered platform，不保存raw SDK response |

| 类别 | 完整签名 | 中文Rustdoc / 参数、返回和副作用 |
|---|---|---|
| 工厂 | `pub fn from_parts(context: PlatformAdapterContext) -> Result<Self, ContractViolation>` | /// 校验并完整复制上述全部入参；不生成ID/时间/权限，无IO |
| 成员 | `pub fn context(&self) -> &PlatformAdapterContext` | /// 纯读safe配置，不是IO或授权 |
| 成员 | `pub fn assert_source_mode(&self, source: &QualifiedPlatformSourceRegistration, now: SafeInstant) -> Result<(), ContractViolation>` | /// 核Discord namespace/family/mode及current qualifier；application/guild/channel/message/thread/interaction；同源HTTP/Gateway排他，Gateway intents/session/resume序列及interaction deadline/token lifespan按资格；Snowflake不是默认跨流cursor，bucket/major-resource/global下界全保留 |
不变量/禁止：constructor全输入只检查namespace.platform=Discord及字段闭包，不建立连接；实际client/port async方法defer Step7/14；缺version/method/scope/pin必blocked或明确unsupported，禁止log raw、默认SDK retry和猜locator。
| adapter | inbound/callback来源验证 | outbound/change/thread/附件 | 连续性/恢复/secret裁定 |
|---|---|---|---|
| Slack | verified签名或registered Socket来源；来源ACK独立 | 原locator/thread，逐方法edit/delete/文件引用；敏感Gate只explicit获准无动作降级 | 不是全量event回放；真实event身份/comparator/window缺失保gap；OAuth/app/bot token均只secret ref |
| Mattermost | 实例/版本/plugin/trusted context actual合同；PAT不是内部actor认证 | channel/DM/post/root实际字段；消息格式、附件及interactive兼容不能照搬Slack | server限流配置/response按实例核；无来源断言完整续传；API Key/PAT候选仍未选 |
| Telegram | webhook secret或bot polling实际source；callback需full actor/target/action验证 | chat权限/topic/root/编辑删除窗口及附件file引用各需资格；不保存download token URL | getUpdates offset推进只protocol层，确认持久接管与owner提交独立；token仅private handle |
| Discord | HTTP verification或registered Gateway/session/intents；按钮ID不是owner权限 | 原guild/channel/thread/message定位，按method权限及期限支持；interaction token/route只瞬时 | resume可比性只实际same session/comparator；跨session留gap，429/global范围完整，不把API rejected默认no-effect |

上述是基于已有PS-01~14登记与前序能力结论的本地contract，不是本轮网络/实际installation验证；任何平台版本/method能力未建立仍BR-UP-007/008/009，不能声称4/4投递成功。

## 5. 六owner adapter与local store/probe


### OwnerContractBinding
归属`owners/mod.rs`；正式owner合同的safe绑定状态。
```rust
/// 正式owner合同的safe绑定状态。
pub struct OwnerContractBinding {
    /// 实际语义owner。
    owner: SafeOwnerKind,
    /// 真实source/version。
    source: SafeAuthoritySourceRef,
    /// 该adapter获准scope。
    scope: SafeScopeRef,
    /// 实际compat/current资格。
    qualification: QualificationSlot<SafeAuthorityRef>,
}
```
| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| owner | `SafeOwnerKind` | 实际语义owner；正式设计owner，不由adapter名字授truth |
| source | `SafeAuthoritySourceRef` | 真实source/version；formal contract与registered foreign adapter |
| scope | `SafeScopeRef` | 该adapter获准scope；正式owner resolver |
| qualification | `QualificationSlot<SafeAuthorityRef>` | 实际compat/current资格；exact kind OwnerContractBinding，missing不映射猜测方法 |

| 类别 | 完整签名 | 中文Rustdoc / 参数、返回和副作用 |
|---|---|---|
| 工厂 | `pub fn from_parts(owner: SafeOwnerKind, source: SafeAuthoritySourceRef, scope: SafeScopeRef, qualification: QualificationSlot<SafeAuthorityRef>) -> Result<Self, ContractViolation>` | /// 校验并完整复制上述全部入参；不生成ID/时间/权限，无IO |
| 成员 | `pub fn assert_owner(&self, expected: SafeOwnerKind, now: SafeInstant) -> Result<(), ContractViolation>` | /// 要求exact owner/source/version/scope/window；query不在此refresh |


只读消费面：保持字段私有，不提供mutable getter或跳过factory；公开可读取不等于可以日志/外显；Application须重新核验current资格并过滤。

| 完整签名 | 中文Rustdoc / 副作用 |
|---|---|
| `pub fn owner(&self) -> &SafeOwnerKind` | /// 借用原owner字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn source(&self) -> &SafeAuthoritySourceRef` | /// 借用原source字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn scope(&self) -> &SafeScopeRef` | /// 借用原scope字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn qualification(&self) -> &QualificationSlot<SafeAuthorityRef>` | /// 借用原qualification字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |

不变量/禁止：结构校验不授权；完整复制全部字段，缺正式来源拒绝。

### ConversationOwnerAdapter
归属`owners/conversation.rs`；I-OWNER Conversation语义反腐。
```rust
/// I-OWNER Conversation语义反腐。
pub struct ConversationOwnerAdapter {
    /// 正式owner绑定。
    binding: OwnerContractBinding,
}
```
| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| binding | `OwnerContractBinding` | 正式owner绑定；现有正式合同，bridge-specific兼容仍待核 |

| 类别 | 完整签名 | 中文Rustdoc / 参数、返回和副作用 |
|---|---|---|
| 工厂 | `pub fn from_parts(binding: OwnerContractBinding) -> Result<Self, ContractViolation>` | /// 校验并完整复制上述全部入参；不生成ID/时间/权限，无IO |
| 成员 | `pub fn assert_binding(&self, now: SafeInstant) -> Result<(), ContractViolation>` | /// 核exact Conversation来源及current有限资格；正式target_mode/ActorRef/BridgeMapped/required material-digest及原op accepted/source版本；不自动submitTurn，不以ACK造Turn |


只读消费面：保持字段私有，不提供mutable getter或跳过factory；公开可读取不等于可以日志/外显；Application须重新核验current资格并过滤。

| 完整签名 | 中文Rustdoc / 副作用 |
|---|---|
| `pub fn binding(&self) -> &OwnerContractBinding` | /// 借用原binding字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |

不变量/禁止：constructor只safe结构；正式foreign callable/错误/result mapping到Step7逐port核验，不复制owner实体或source真相。

### IdentityOwnerAdapter
归属`owners/identity.rs`；I-OWNER Identity语义反腐。
```rust
/// I-OWNER Identity语义反腐。
pub struct IdentityOwnerAdapter {
    /// 正式owner绑定。
    binding: OwnerContractBinding,
}
```
| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| binding | `OwnerContractBinding` | 正式owner绑定；现有正式合同，bridge-specific兼容仍待核 |

| 类别 | 完整签名 | 中文Rustdoc / 参数、返回和副作用 |
|---|---|---|
| 工厂 | `pub fn from_parts(binding: OwnerContractBinding) -> Result<Self, ContractViolation>` | /// 校验并完整复制上述全部入参；不生成ID/时间/权限，无IO |
| 成员 | `pub fn assert_binding(&self, now: SafeInstant) -> Result<(), ContractViolation>` | /// 核exact Identity来源及current有限资格；只正式AI identity锚点；human/account责任链缺口由owning安全来源补，不自动GlobalMember/participant |


只读消费面：保持字段私有，不提供mutable getter或跳过factory；公开可读取不等于可以日志/外显；Application须重新核验current资格并过滤。

| 完整签名 | 中文Rustdoc / 副作用 |
|---|---|
| `pub fn binding(&self) -> &OwnerContractBinding` | /// 借用原binding字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |

不变量/禁止：constructor只safe结构；正式foreign callable/错误/result mapping到Step7逐port核验，不复制owner实体或source真相。

### GovernanceOwnerAdapter
归属`owners/governance.rs`；I-OWNER Governance语义反腐。
```rust
/// I-OWNER Governance语义反腐。
pub struct GovernanceOwnerAdapter {
    /// 正式owner绑定。
    binding: OwnerContractBinding,
}
```
| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| binding | `OwnerContractBinding` | 正式owner绑定；现有正式合同，bridge-specific兼容仍待核 |

| 类别 | 完整签名 | 中文Rustdoc / 参数、返回和副作用 |
|---|---|---|
| 工厂 | `pub fn from_parts(binding: OwnerContractBinding) -> Result<Self, ContractViolation>` | /// 校验并完整复制上述全部入参；不生成ID/时间/权限，无IO |
| 成员 | `pub fn assert_binding(&self, now: SafeInstant) -> Result<(), ContractViolation>` | /// 核exact Governance来源及current有限资格；current Policy/Gate披露及owner正式action二次验证；签名/secret/route/低敏感label不能批准 |


只读消费面：保持字段私有，不提供mutable getter或跳过factory；公开可读取不等于可以日志/外显；Application须重新核验current资格并过滤。

| 完整签名 | 中文Rustdoc / 副作用 |
|---|---|
| `pub fn binding(&self) -> &OwnerContractBinding` | /// 借用原binding字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |

不变量/禁止：constructor只safe结构；正式foreign callable/错误/result mapping到Step7逐port核验，不复制owner实体或source真相。

### ArtifactOwnerAdapter
归属`owners/artifact.rs`；I-OWNER Artifact语义反腐。
```rust
/// I-OWNER Artifact语义反腐。
pub struct ArtifactOwnerAdapter {
    /// 正式owner绑定。
    binding: OwnerContractBinding,
}
```
| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| binding | `OwnerContractBinding` | 正式owner绑定；现有正式合同，bridge-specific兼容仍待核 |

| 类别 | 完整签名 | 中文Rustdoc / 参数、返回和副作用 |
|---|---|---|
| 工厂 | `pub fn from_parts(binding: OwnerContractBinding) -> Result<Self, ContractViolation>` | /// 校验并完整复制上述全部入参；不生成ID/时间/权限，无IO |
| 成员 | `pub fn assert_binding(&self, now: SafeInstant) -> Result<(), ContractViolation>` | /// 核exact Artifact来源及current有限资格；authorized附件准入、source/version/期限/传播范围；不公开下载URI或持久化附件bytes |


只读消费面：保持字段私有，不提供mutable getter或跳过factory；公开可读取不等于可以日志/外显；Application须重新核验current资格并过滤。

| 完整签名 | 中文Rustdoc / 副作用 |
|---|---|
| `pub fn binding(&self) -> &OwnerContractBinding` | /// 借用原binding字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |

不变量/禁止：constructor只safe结构；正式foreign callable/错误/result mapping到Step7逐port核验，不复制owner实体或source真相。

### WorkspaceOwnerAdapter
归属`owners/workspace.rs`；I-OWNER Workspace语义反腐。
```rust
/// I-OWNER Workspace语义反腐。
pub struct WorkspaceOwnerAdapter {
    /// 正式owner绑定。
    binding: OwnerContractBinding,
}
```
| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| binding | `OwnerContractBinding` | 正式owner绑定；现有正式合同，bridge-specific兼容仍待核 |

| 类别 | 完整签名 | 中文Rustdoc / 参数、返回和副作用 |
|---|---|---|
| 工厂 | `pub fn from_parts(binding: OwnerContractBinding) -> Result<Self, ContractViolation>` | /// 校验并完整复制上述全部入参；不生成ID/时间/权限，无IO |
| 成员 | `pub fn assert_binding(&self, now: SafeInstant) -> Result<(), ContractViolation>` | /// 核exact Workspace来源及current有限资格；条件safe read/export/provenance；不是频道、权限或内部target默认来源；未选用不成为所有分支强前置 |


只读消费面：保持字段私有，不提供mutable getter或跳过factory；公开可读取不等于可以日志/外显；Application须重新核验current资格并过滤。

| 完整签名 | 中文Rustdoc / 副作用 |
|---|---|
| `pub fn binding(&self) -> &OwnerContractBinding` | /// 借用原binding字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |

不变量/禁止：constructor只safe结构；正式foreign callable/错误/result mapping到Step7逐port核验，不复制owner实体或source真相。

### ObservabilityOwnerAdapter
归属`owners/observability.rs`；I-OWNER Observability语义反腐。
```rust
/// I-OWNER Observability语义反腐。
pub struct ObservabilityOwnerAdapter {
    /// 正式owner绑定。
    binding: OwnerContractBinding,
}
```
| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| binding | `OwnerContractBinding` | 正式owner绑定；现有正式合同，bridge-specific兼容仍待核 |

| 类别 | 完整签名 | 中文Rustdoc / 参数、返回和副作用 |
|---|---|---|
| 工厂 | `pub fn from_parts(binding: OwnerContractBinding) -> Result<Self, ContractViolation>` | /// 校验并完整复制上述全部入参；不生成ID/时间/权限，无IO |
| 成员 | `pub fn assert_binding(&self, now: SafeInstant) -> Result<(), ContractViolation>` | /// 核exact Observability来源及current有限资格；actual canonical/schema/admission/result与原consumer op；mandatory条件先阻对应IO，不产生evidence/report/verdict/readiness |


只读消费面：保持字段私有，不提供mutable getter或跳过factory；公开可读取不等于可以日志/外显；Application须重新核验current资格并过滤。

| 完整签名 | 中文Rustdoc / 副作用 |
|---|---|
| `pub fn binding(&self) -> &OwnerContractBinding` | /// 借用原binding字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |

不变量/禁止：constructor只safe结构；正式foreign callable/错误/result mapping到Step7逐port核验，不复制owner实体或source真相。

### LocalStorageBinding
归属`persistence/local_store.rs`；本仓safe local schema/driver资格引用。
```rust
/// 本仓safe local schema/driver资格引用。
pub struct LocalStorageBinding {
    /// 限定Bridges namespace。
    scope: SafeScopeRef,
    /// 本仓schema版本。
    schema_revision: SafeRevision,
    /// 实际driver/source资格。
    driver: QualificationSlot<SafeAuthorityRef>,
    /// driver配置依据。
    configuration: ConfigurationBasisRef,
}
```
| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| scope | `SafeScopeRef` | 限定Bridges namespace；受权配置 |
| schema_revision | `SafeRevision` | 本仓schema版本；formal schema；真实DDL到Step11 |
| driver | `QualificationSlot<SafeAuthorityRef>` | 实际driver/source资格；exact kind LocalStorageBinding；DB产品未选时Missing |
| configuration | `ConfigurationBasisRef` | driver配置依据；受权configuration |

| 类别 | 完整签名 | 中文Rustdoc / 参数、返回和副作用 |
|---|---|---|
| 工厂 | `pub fn from_parts(scope: SafeScopeRef, schema_revision: SafeRevision, driver: QualificationSlot<SafeAuthorityRef>, configuration: ConfigurationBasisRef) -> Result<Self, ContractViolation>` | /// 校验并完整复制上述全部入参；不生成ID/时间/权限，无IO |
| 成员 | `pub fn assert_current(&self, now: SafeInstant) -> Result<(), ContractViolation>` | /// driver必须actual qualified且本仓schema/CAS/UoW/probe能力已核；无in-memory生产fallback |


只读消费面：保持字段私有，不提供mutable getter或跳过factory；公开可读取不等于可以日志/外显；Application须重新核验current资格并过滤。

| 完整签名 | 中文Rustdoc / 副作用 |
|---|---|
| `pub fn scope(&self) -> &SafeScopeRef` | /// 借用原scope字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn schema_revision(&self) -> &SafeRevision` | /// 借用原schema_revision字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn driver(&self) -> &QualificationSlot<SafeAuthorityRef>` | /// 借用原driver字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn configuration(&self) -> &ConfigurationBasisRef` | /// 借用原configuration字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |

不变量/禁止：结构校验不授权；完整复制全部字段，缺正式来源拒绝。

### LocalStoreAdapter
归属`persistence/local_store.rs`；八repo和本地UoW的安全binding。
```rust
/// 八repo和本地UoW的安全binding。
pub struct LocalStoreAdapter {
    /// 实际safe driver绑定。
    binding: LocalStorageBinding,
}
```
| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| binding | `LocalStorageBinding` | 实际safe driver绑定；bootstrap actual注册 |

| 类别 | 完整签名 | 中文Rustdoc / 参数、返回和副作用 |
|---|---|---|
| 工厂 | `pub fn from_parts(binding: LocalStorageBinding) -> Result<Self, ContractViolation>` | /// 校验并完整复制上述全部入参；不生成ID/时间/权限，无IO |
| 成员 | `pub fn binding(&self) -> &LocalStorageBinding` | /// 只读配置；trait impl/read/write/CAS/driver transaction细节到Step7/11 |
不变量/禁止：结构校验不授权；完整复制全部字段，缺正式来源拒绝。

### LocalCommitProbeAdapter
归属`persistence/commit_probe.rs`；原mutation本地权威probe binding。
```rust
/// 原mutation本地权威probe binding。
pub struct LocalCommitProbeAdapter {
    /// 同write driver及schema。
    binding: LocalStorageBinding,
}
```
| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| binding | `LocalStorageBinding` | 同write driver及schema；same original store |

| 类别 | 完整签名 | 中文Rustdoc / 参数、返回和副作用 |
|---|---|---|
| 工厂 | `pub fn from_parts(binding: LocalStorageBinding) -> Result<Self, ContractViolation>` | /// 校验并完整复制上述全部入参；不生成ID/时间/权限，无IO |
| 成员 | `pub fn assert_same_store(&self, write: &LocalStorageBinding) -> Result<(), ContractViolation>` | /// 必须同driver/scope/schema；只能same mutation/op read-only probe，NotFound不是rollback/no-effect |


只读消费面：保持字段私有，不提供mutable getter或跳过factory；公开可读取不等于可以日志/外显；Application须重新核验current资格并过滤。

| 完整签名 | 中文Rustdoc / 副作用 |
|---|---|
| `pub fn binding(&self) -> &LocalStorageBinding` | /// 借用原binding字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |

不变量/禁止：结构校验不授权；完整复制全部字段，缺正式来源拒绝。
### Infra草稿与模块停审
四adapter各独立卡、同型context唯一；六owner各独立卡不新增foreign API；actual store/probe同源、required seams/availability/composition/预算/source排他有完整shape及纯guard。构造不运行、不授权限；SDK/OAuth/API Key/KMS/router/executor/HTTP/DB/Bus/cache仍not_selected/not_established，真实client/driver/port callable精确defer Step7/11/14/04，raw/private只Application原五载体。所有对象capability/字段/factory/runtime有限phase/安全依赖自检pass；下一API。

<!-- step06-infra-tail -->
