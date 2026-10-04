# L6-bridges 03 Step6：API、Jobs、Worker稳定入口对象

## 1. API问题回答、诊断与取舍

API只做C/Q可信入口与条件HTTP E01/E03分派和protocol ACK，不拥有repo/domain writer。core actor/metadata不重定义，来源信任不能由header/payload自报。稳定entry context、finite disposition和private调用现在闭口；route/HTTP handler完整C/E/Q DTO在Step7/8/14，不用空request占位。采用字段级visibility、Query零写；拒绝ACK当durable接管、同步send/replay、平台签名生成内部审批权限。

| capability | 输入 | 输出 / 副作用 | 功能到对象 / 类别 | 后续 |
|---|---|---|---|---|
| P-C | core actor/CommandMetadata/受信来源 | 合格分派或finite拒绝 | CommandEntryContext/ApiAdmissionPlan / entry carrier | C01~06，Application metadata_validation |
| P-Q | core actor/QueryMetadata/受信来源 | 无写query分派 | QueryEntryContext/ApiAdmissionPlan / read entry | Q01~04及SafeReadQualificationPort |
| P-E | current installation/source mode/private借用 | E01/E03调用及独立ACK状态 | PlatformEntryCall/ProtocolAckExecution / transient entry | 平台验证/private reply seam |
| P-AVAIL | runtime required/source资格/预算 | 不可用时不激活handler | ApiAdmissionPlan / availability consumer | Step7/14装配 |

以下API类型属role内部，不是通用wire；core metadata的reason/external_ref/role hint整体不写日志/证据。constructor只shape/source匹配，不授业务current权限。API不新增business port。


### ApiTrustedContext
归属`management.rs`；入口context不能混命令/查询。
```rust
/// 入口context不能混命令/查询。
pub enum ApiTrustedContext {
    /// 受信Command入口。
    Command(CommandEntryContext),
    /// 受信Query入口，不允许write key。
    Query(QueryEntryContext),
}
```
| 变体 | Rustdoc注释 / 载荷语义 | 允许来源 | 允许去向 |
|---|---|---|---|
| Command | 受信Command入口；`CommandEntryContext` | 所属正式source/纯组装 | 不适用，无lifecycle |
| Query | 受信Query入口，不允许write key；`QueryEntryContext` | 所属正式source/纯组装 | 不适用，无lifecycle |

| 类别 | 完整签名 | 中文Rustdoc |
|---|---|---|
| 工厂 | `pub fn validate(self) -> Result<Self, ContractViolation>` | /// 核载荷一致和finite分支，拒绝未知标签；不授authority。 |


### ApiEntryDisposition
归属`lib.rs`；稳定入口处置，不是业务提交。
```rust
/// 稳定入口处置，不是业务提交。
pub enum ApiEntryDisposition {
    /// 入口资格允许交Application，尚无业务提交。
    AdmittedForDispatch,
    /// finite结构/来源拒绝。
    Rejected(SafeReasonCode),
    /// runtime/正式合同不能建立，非空成功。
    Unavailable(SafeReasonCode),
}
```
| 变体 | Rustdoc注释 / 载荷语义 | 允许来源 | 允许去向 |
|---|---|---|---|
| AdmittedForDispatch | 入口资格允许交Application，尚无业务提交 | 所属正式source/纯组装 | 不适用，无lifecycle |
| Rejected | finite结构/来源拒绝；`SafeReasonCode` | 所属正式source/纯组装 | 不适用，无lifecycle |
| Unavailable | runtime/正式合同不能建立，非空成功；`SafeReasonCode` | 所属正式source/纯组装 | 不适用，无lifecycle |

| 类别 | 完整签名 | 中文Rustdoc |
|---|---|---|
| 工厂 | `pub fn validate(self) -> Result<Self, ContractViolation>` | /// 核载荷一致和finite分支，拒绝未知标签；不授authority。 |


### PlatformPrivateCall<'call>
归属`platform.rs`；private调用不可序列化。
```rust
/// private调用不可序列化。
pub enum PlatformPrivateCall<'call> {
    /// 本次E01私有source验证材料。
    Ingress(PrivateIngressContext<'call>),
    /// 本次E03私有context/token材料。
    Callback(PrivateCallbackContext<'call>),
}
```
| 变体 | Rustdoc注释 / 载荷语义 | 允许来源 | 允许去向 |
|---|---|---|---|
| Ingress | 本次E01私有source验证材料；`PrivateIngressContext<'call>` | 所属正式source/纯组装 | 不适用，无lifecycle |
| Callback | 本次E03私有context/token材料；`PrivateCallbackContext<'call>` | 所属正式source/纯组装 | 不适用，无lifecycle |

| 类别 | 完整签名 | 中文Rustdoc |
|---|---|---|
| 工厂 | `pub fn validate(self) -> Result<Self, ContractViolation>` | /// 核载荷一致和finite分支，拒绝未知标签；不授authority。 |



### CommandEntryContext
归属`management.rs`；受信command actor/core metadata上下文。
```rust
/// 受信command actor/core metadata上下文。
pub struct CommandEntryContext {
    /// 正式actor/origin载体。
    actor: ActorContext,
    /// 原request metadata。
    metadata: CommandMetadata,
    /// 原trace。
    trace: TrustedTraceRef,
    /// 认证入口来源。
    source: SafeAuthorityRef,
}
```
| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| actor | `ActorContext` | 正式actor/origin载体；认证入口；role hint不授权、display_name=None |
| metadata | `CommandMetadata` | 原request metadata；原key required，不追加top key |
| trace | `TrustedTraceRef` | 原trace；同request |
| source | `SafeAuthorityRef` | 认证入口来源；exact kind CommandEntryContext；actual SecurityBoundary |

| 类别 | 完整签名 | 中文Rustdoc / 参数、返回和副作用 |
|---|---|---|
| 工厂 | `pub fn from_parts(actor: ActorContext, metadata: CommandMetadata, trace: TrustedTraceRef, source: SafeAuthorityRef) -> Result<Self, ContractViolation>` | /// 校验并完整复制上述全部入参；不生成ID/时间/权限，无IO |
| 成员 | `pub fn validate(&self, now: SafeInstant) -> Result<(), ContractViolation>` | /// source actor关联/窗口/origin/required key；reason/external_ref不能成为authority或证据 |


只读消费面：保持字段私有，不提供mutable getter或跳过factory；公开可读取不等于可以日志/外显；Application须重新核验current资格并过滤。

| 完整签名 | 中文Rustdoc / 副作用 |
|---|---|
| `pub fn actor(&self) -> &ActorContext` | /// 借用原actor字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn metadata(&self) -> &CommandMetadata` | /// 借用原metadata字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn trace(&self) -> &TrustedTraceRef` | /// 借用原trace字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn source(&self) -> &SafeAuthorityRef` | /// 借用原source字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |

不变量/禁止：结构校验不授权；完整复制全部字段，缺正式来源拒绝。

### QueryEntryContext
归属`query.rs`；受信query context，scope仍由Application resolver确定。
```rust
/// 受信query context，scope仍由Application resolver确定。
pub struct QueryEntryContext {
    /// 正式actor/origin。
    actor: ActorContext,
    /// 原Query request/page/consistency。
    metadata: QueryMetadata,
    /// 原trace。
    trace: TrustedTraceRef,
    /// 实际principal来源。
    source: SafeAuthorityRef,
}
```
| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| actor | `ActorContext` | 正式actor/origin；认证入口；display_name=None |
| metadata | `QueryMetadata` | 原Query request/page/consistency；key必须None |
| trace | `TrustedTraceRef` | 原trace；同request |
| source | `SafeAuthorityRef` | 实际principal来源；exact kind QueryEntryContext |

| 类别 | 完整签名 | 中文Rustdoc / 参数、返回和副作用 |
|---|---|---|
| 工厂 | `pub fn from_parts(actor: ActorContext, metadata: QueryMetadata, trace: TrustedTraceRef, source: SafeAuthorityRef) -> Result<Self, ContractViolation>` | /// 校验并完整复制上述全部入参；不生成ID/时间/权限，无IO |
| 成员 | `pub fn validate(&self, now: SafeInstant) -> Result<(), ContractViolation>` | /// current入口与safe page token核验；scope hint不授target read权限，无audit/dedup/refresh/probe |


只读消费面：保持字段私有，不提供mutable getter或跳过factory；公开可读取不等于可以日志/外显；Application须重新核验current资格并过滤。

| 完整签名 | 中文Rustdoc / 副作用 |
|---|---|
| `pub fn actor(&self) -> &ActorContext` | /// 借用原actor字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn metadata(&self) -> &QueryMetadata` | /// 借用原metadata字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn trace(&self) -> &TrustedTraceRef` | /// 借用原trace字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn source(&self) -> &SafeAuthorityRef` | /// 借用原source字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |

不变量/禁止：结构校验不授权；完整复制全部字段，缺正式来源拒绝。

### ApiAdmissionPlan
归属`lib.rs`；稳定入口与runtime可用性检查。
```rust
/// 稳定入口与runtime可用性检查。
pub struct ApiAdmissionPlan {
    /// 原C/Q可信context。
    context: ApiTrustedContext,
    /// actual bootstrap状态。
    availability: RuntimeAvailability,
    /// 本次有限入口预算。
    budget: RuntimeExecutionBudget,
}
```
| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| context | `ApiTrustedContext` | 原C/Q可信context；同入口 |
| availability | `RuntimeAvailability` | actual bootstrap状态；infra runtime |
| budget | `RuntimeExecutionBudget` | 本次有限入口预算；受权profile |

| 类别 | 完整签名 | 中文Rustdoc / 参数、返回和副作用 |
|---|---|---|
| 工厂 | `pub fn from_parts(context: ApiTrustedContext, availability: RuntimeAvailability, budget: RuntimeExecutionBudget) -> Result<Self, ContractViolation>` | /// 校验并完整复制上述全部入参；不生成ID/时间/权限，无IO |
| 成员 | `pub fn evaluate(&self, now: SafeInstant) -> Result<ApiEntryDisposition, ContractViolation>` | /// actual runtime Qualified及当前入口合法才AdmittedForDispatch，后续仍需owner Policy/Gate |


只读消费面：保持字段私有，不提供mutable getter或跳过factory；公开可读取不等于可以日志/外显；Application须重新核验current资格并过滤。

| 完整签名 | 中文Rustdoc / 副作用 |
|---|---|
| `pub fn context(&self) -> &ApiTrustedContext` | /// 借用原context字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn availability(&self) -> &RuntimeAvailability` | /// 借用原availability字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn budget(&self) -> &RuntimeExecutionBudget` | /// 借用原budget字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |

不变量/禁止：结构校验不授权；完整复制全部字段，缺正式来源拒绝。

### PlatformEntryCall<'call>
归属`platform.rs`；本次平台private source调用上下文。
```rust
/// 本次平台private source调用上下文。
pub struct PlatformEntryCall<'call> {
    /// current排他source。
    source: QualifiedPlatformSourceRegistration,
    /// 本次raw/context借用。
    private: PlatformPrivateCall<'call>,
    /// 材料/等待预算。
    budget: RuntimeExecutionBudget,
}
```
| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| source | `QualifiedPlatformSourceRegistration` | current排他source；actual bootstrap |
| private | `PlatformPrivateCall<'call>` | 本次raw/context借用；trusted transport |
| budget | `RuntimeExecutionBudget` | 材料/等待预算；source profile |

| 类别 | 完整签名 | 中文Rustdoc / 参数、返回和副作用 |
|---|---|---|
| 工厂 | `pub fn from_parts(source: QualifiedPlatformSourceRegistration, private: PlatformPrivateCall<'call>, budget: RuntimeExecutionBudget) -> Result<Self, ContractViolation>` | /// 校验并完整复制上述全部入参；不生成ID/时间/权限，无IO |
| 成员 | `pub fn assert_source(&self, now: SafeInstant) -> Result<(), ContractViolation>` | /// family/mode/installation/current资格匹配，HTTP入口只支持HTTP注册模式 |


只读消费面：保持字段私有，不提供mutable getter或跳过factory；公开可读取不等于可以日志/外显；Application须重新核验current资格并过滤。

| 完整签名 | 中文Rustdoc / 副作用 |
|---|---|
| `pub fn source(&self) -> &QualifiedPlatformSourceRegistration` | /// 借用原source字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn private(&self) -> &PlatformPrivateCall<'call>` | /// 借用原private字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn budget(&self) -> &RuntimeExecutionBudget` | /// 借用原budget字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |

不变量/禁止：不derive Debug/Clone/serde/Display；raw不跨call，同源只一入口；同Application E01/E03，不直调repo/owner。

### ProtocolAckExecution
归属`platform.rs`；ACK计划与实际发送状态分开。
```rust
/// ACK计划与实际发送状态分开。
pub struct ProtocolAckExecution {
    /// qualified计划。
    plan: ProtocolAckPlan,
    /// 实际阶段。
    disposition: ProtocolAckDisposition,
    /// reply source合同。
    source: SafeAuthoritySourceRef,
}
```
| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| plan | `ProtocolAckPlan` | qualified计划；actual verifier |
| disposition | `ProtocolAckDisposition` | 实际阶段；初始NotSent |
| source | `SafeAuthoritySourceRef` | reply source合同；trusted private transport |

| 类别 | 完整签名 | 中文Rustdoc / 参数、返回和副作用 |
|---|---|---|
| 工厂 | `pub fn from_parts(plan: ProtocolAckPlan, disposition: ProtocolAckDisposition, source: SafeAuthoritySourceRef) -> Result<Self, ContractViolation>` | /// 校验并完整复制上述全部入参；不生成ID/时间/权限，无IO |
| 成员 | `pub fn record_actual(&mut self, disposition: ProtocolAckDisposition, basis: SafeAuthorityRef, now: SafeInstant) -> Result<(), ContractViolation>` | /// 原source actual回复结果；basis exact kind ProtocolAckExecution；不由plan推成功，不改owner/Turn/consumer |
| 成员 | `pub fn disposition(&self) -> &ProtocolAckDisposition` | /// pure finite读取，不输出private token/URL |


只读消费面：保持字段私有，不提供mutable getter或跳过factory；公开可读取不等于可以日志/外显；Application须重新核验current资格并过滤。

| 完整签名 | 中文Rustdoc / 副作用 |
|---|---|
| `pub fn plan(&self) -> &ProtocolAckPlan` | /// 借用原plan字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn source(&self) -> &SafeAuthoritySourceRef` | /// 借用原source字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |

不变量/禁止：from_parts只允许NotSent；实际reply callable/deadline/失败到Step7/8/9，不宣称ACK已发。

### API草稿与模块停审
C/Q trusted context/key约束、source-mode/private寿命、availability及ACK计划/实际处置均闭口，public出口只contracts filtered结果。no direct writer，Query零副作用。完整handlers/route/HTTP与DTO defer Step7/8/14；原C01~06/Q01~04/E01/E03不增flow。能力/字段/factory/finite disposition/安全依赖自检pass，下一Jobs。

## 2. Jobs问题回答、诊断与取舍

五J只bounded invocation同Application编排，worker与bin复用同库。original subject/op、scope/source、取消/部分结果必须现在闭口；J05维护非recoverable installation/binding/mapping，不能假造Intent作主语。补JobSubjectRef使JobContinuityMetadata精确表达两族。采用typed InvocationSubject和受限budget；拒绝默认operator、new effect、通用replay/run_all或CLI exit0当投递成功。真实run身份由Step8实际invocation给入，本步不填造run值。

| capability | 输入 | 输出 / 副作用 | 对象 / 类别 | 后续 |
|---|---|---|---|---|
| J-INVOCATION | TrustedJobContext/原subject/op/metadata | finite分派或blocked | JobInvocationPlan/Subject / entry carrier | 五Application J01~05 |
| J-BOUND | 当前预算/cancel/actual逐项结果 | Partial/Unknown/Cancelled，非外部成功 | JobInvocationState / local runtime | jobs同库及contracts五J result |


### BoundedJobKind
归属`invocation.rs`；五个显式维护动作。
```rust
/// 五个显式维护动作。
pub enum BoundedJobKind {
    /// J01既有intent。
    Dispatch,
    /// J02原op/effect。
    ReconcileOperation,
    /// J03原gap/range。
    ReconcileGap,
    /// J04原canonical。
    SafeHandoff,
    /// J05既有资格主语。
    RefreshQualification,
}
```
| 变体 | Rustdoc注释 / 载荷语义 | 允许来源 | 允许去向 |
|---|---|---|---|
| Dispatch | J01既有intent | 所属正式source/纯组装 | 不适用，无lifecycle |
| ReconcileOperation | J02原op/effect | 所属正式source/纯组装 | 不适用，无lifecycle |
| ReconcileGap | J03原gap/range | 所属正式source/纯组装 | 不适用，无lifecycle |
| SafeHandoff | J04原canonical | 所属正式source/纯组装 | 不适用，无lifecycle |
| RefreshQualification | J05既有资格主语 | 所属正式source/纯组装 | 不适用，无lifecycle |

| 类别 | 完整签名 | 中文Rustdoc |
|---|---|---|
| 工厂 | `pub fn validate(self) -> Result<Self, ContractViolation>` | /// 核载荷一致和finite分支，拒绝未知标签；不授authority。 |


### JobInvocationSubject
归属`invocation.rs`；动作与既有主语一一对应。
```rust
/// 动作与既有主语一一对应。
pub enum JobInvocationSubject {
    /// J01原intent/effect。
    Delivery(DeliveryIntentEffectRef),
    /// J02原恢复记录及该记录既有业务主语。
    Operation {
        /// actual原恢复记录，不由subject推造。
        recovery: RecoveryRecordRef,
        /// 同记录既有业务主语。
        subject: OriginalRecoverableSubjectRef,
    },
    /// J03原gap。
    Gap(GapRef),
    /// J04原handoff。
    Handoff(SafeHandoffRef),
    /// J05既有受权维护主语及actual local版本条件。
    Qualification {
        /// 既有受权维护主语。
        subject: BridgeViewSubjectRef,
        /// actual行的local版本条件。
        expected: ExpectedLocalRevision,
    },
}
```
| 变体 | Rustdoc注释 / 载荷语义 | 允许来源 | 允许去向 |
|---|---|---|---|
| Delivery | J01原intent/effect；`DeliveryIntentEffectRef` | 所属正式source/纯组装 | 不适用，无lifecycle |
| Operation | J02原恢复记录`RecoveryRecordRef`及同记录`OriginalRecoverableSubjectRef` | 完整Application selection原值 | J02 input；无独立lifecycle |
| Gap | J03原gap；`GapRef` | 所属正式source/纯组装 | 不适用，无lifecycle |
| Handoff | J04原handoff；`SafeHandoffRef` | 所属正式source/纯组装 | 不适用，无lifecycle |
| Qualification | J05主语`BridgeViewSubjectRef`与版本条件`ExpectedLocalRevision` | 完整Application selection原值 | J05 input；无独立lifecycle |

| 类别 | 完整签名 | 中文Rustdoc |
|---|---|---|
| 工厂 | `pub fn validate(self) -> Result<Self, ContractViolation>` | /// 核载荷一致和finite分支，拒绝未知标签；不授authority。 |


### JobInvocationPhase
归属`invocation.rs`；本地调用phase非投递状态。
```rust
/// 本地调用phase非投递状态。
pub enum JobInvocationPhase {
    /// 尚未dispatch。
    Pending,
    /// 已交Application，不等外部成功。
    Dispatched,
    /// 本次有界调用已返回。
    CompletedLocal,
    /// 本地等待结束，保外部unknown。
    CancelledLocal,
    /// 调用结果或原效果未知。
    Indeterminate,
}
```
| 变体 | Rustdoc注释 / 载荷语义 | 允许来源 | 允许去向 |
|---|---|---|---|
| Pending | 尚未dispatch | from_parts固定初态且result=None | mark_dispatched -> Dispatched；cancel_local_wait -> CancelledLocal |
| Dispatched | 已交Application，不等外部成功 | Pending经实际dispatch | record_returned -> CompletedLocal/Indeterminate；cancel_local_wait -> CancelledLocal |
| CompletedLocal | 本次有界调用已返回且无未决；非全平台成功 | Dispatched actual返回 | 无本次调用回边 |
| CancelledLocal | 本地等待结束，保外部unknown | Pending/Dispatched实际取消 | 无本次调用回边；原恢复另由Application承接 |
| Indeterminate | 调用结果或原效果未知 | Dispatched actual unknown返回 | 无本次调用回边；原op不丢失 |

| 类别 | 完整签名 | 中文Rustdoc |
|---|---|---|
| 工厂 | `pub fn validate(self) -> Result<Self, ContractViolation>` | /// 核载荷一致和finite分支，拒绝未知标签；不授authority。 |


### JobInvocationPlan
归属`invocation.rs`；五J有界受信入口计划。
```rust
/// 五J有界受信入口计划。
pub struct JobInvocationPlan {
    /// 明确J动作。
    kind: BoundedJobKind,
    /// 原typed subject。
    subject: JobInvocationSubject,
    /// 当前维护actor/scope/basis。
    context: TrustedJobContext,
    /// 原subject/op/trace。
    continuity: JobContinuityMetadata,
    /// 实际装配资格。
    availability: RuntimeAvailability,
    /// 有限预算。
    budget: RuntimeExecutionBudget,
}
```
| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| kind | `BoundedJobKind` | 明确J动作；registered dispatcher |
| subject | `JobInvocationSubject` | 原typed subject；caller；existing/authority由Application正式解析 |
| context | `TrustedJobContext` | 当前维护actor/scope/basis；bootstrap或认证operator |
| continuity | `JobContinuityMetadata` | 原subject/op/trace；actual read/正式invocation关联 |
| availability | `RuntimeAvailability` | 实际装配资格；infra bootstrap |
| budget | `RuntimeExecutionBudget` | 有限预算；current profile |

| 类别 | 完整签名 | 中文Rustdoc / 参数、返回和副作用 |
|---|---|---|
| 工厂 | `pub fn from_parts(kind: BoundedJobKind, subject: JobInvocationSubject, context: TrustedJobContext, continuity: JobContinuityMetadata, availability: RuntimeAvailability, budget: RuntimeExecutionBudget) -> Result<Self, ContractViolation>` | /// 校验并完整复制上述全部入参；不生成ID/时间/权限，无IO |
| 成员 | `pub fn validate(&self, now: SafeInstant) -> Result<(), ContractViolation>` | /// kind/subject/continuity相符、trusted scope/窗口/预算和runtimeQualified；只entry分派，不授业务current权或新effect |


只读消费面：保持字段私有，不提供mutable getter或跳过factory；公开可读取不等于可以日志/外显；Application须重新核验current资格并过滤。

| 完整签名 | 中文Rustdoc / 副作用 |
|---|---|
| `pub fn kind(&self) -> &BoundedJobKind` | /// 借用原kind字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn subject(&self) -> &JobInvocationSubject` | /// 借用原subject字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn context(&self) -> &TrustedJobContext` | /// 借用原context字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn continuity(&self) -> &JobContinuityMetadata` | /// 借用原continuity字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn availability(&self) -> &RuntimeAvailability` | /// 借用原availability字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn budget(&self) -> &RuntimeExecutionBudget` | /// 借用原budget字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |

不变量/禁止：结构校验不授权；完整复制全部字段，缺正式来源拒绝。

### JobInvocationState
归属`invocation.rs`；本次有界调用状态和actual未决操作。
```rust
/// 本次有界调用状态和actual未决操作。
pub struct JobInvocationState {
    /// 原计划。
    plan: JobInvocationPlan,
    /// local调用phase。
    phase: JobInvocationPhase,
    /// 实际filtered结果或None。
    result: Option<SafeJobResultSummary>,
    /// actual未决原op/effect。
    unresolved: Vec<OriginalOperationEffectRef>,
}
```
| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| plan | `JobInvocationPlan` | 原计划；trusted invocation |
| phase | `JobInvocationPhase` | local调用phase；初始Pending |
| result | `Option<SafeJobResultSummary>` | 实际filtered结果或None；Application返回 |
| unresolved | `Vec<OriginalOperationEffectRef>` | actual未决原op/effect；Application/driver阶段，不用run/time生成 |

| 类别 | 完整签名 | 中文Rustdoc / 参数、返回和副作用 |
|---|---|---|
| 工厂 | `pub fn from_parts(plan: JobInvocationPlan, phase: JobInvocationPhase, result: Option<SafeJobResultSummary>, unresolved: Vec<OriginalOperationEffectRef>) -> Result<Self, ContractViolation>` | /// 完整复制且只接受Pending、result=None，unresolved只actual继承原op集合；不可用任意phase/result绕过dispatch；不生成ID/时间/权限，无IO。 |
| 成员 | `pub fn mark_dispatched(&mut self, now: SafeInstant) -> Result<(), ContractViolation>` | /// Pending->Dispatched仅validate合法且实际交Application |
| 成员 | `pub fn record_returned(&mut self, result: SafeJobResultSummary, unresolved: Vec<OriginalOperationEffectRef>) -> Result<(), ContractViolation>` | /// Dispatched->CompletedLocal/Indeterminate依同invocation actual结果；合并未决集合，不能以空返回覆盖旧unknown；CompletedLocal要求无未决且非所有外部送达；guard失败零修改。 |
| 成员 | `pub fn cancel_local_wait(&mut self, unresolved: Vec<OriginalOperationEffectRef>) -> Result<(), ContractViolation>` | /// Pending/Dispatched->CancelledLocal，只停止本地等待；未决原op并集合并不丢既有项，不撤回IO/one-use或生成新op；不能从取消造no-effect。 |
| 成员 | `pub fn into_parts(self) -> (JobInvocationPlan, JobInvocationPhase, Option<SafeJobResultSummary>, Vec<OriginalOperationEffectRef>)` | /// 一次移出原四字段，零IO；不改变phase/result或清unknown，只有CompletedLocal+Some可交batch原returned-plan路径。 |


只读消费面：保持字段私有，不提供mutable getter或跳过factory；公开可读取不等于可以日志/外显；Application须重新核验current资格并过滤。

| 完整签名 | 中文Rustdoc / 副作用 |
|---|---|
| `pub fn plan(&self) -> &JobInvocationPlan` | /// 借用原plan字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn phase(&self) -> &JobInvocationPhase` | /// 借用原phase字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn result(&self) -> &Option<SafeJobResultSummary>` | /// 借用原result字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn unresolved(&self) -> &Vec<OriginalOperationEffectRef>` | /// 借用原unresolved字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |

不变量/禁止：from_parts只Pending/result=None；未开始不得填造成功或未决operation；原subject/op贯穿退出；CLI只safe job result并受current visibility。
### Jobs草稿与模块停审
五J typed主语、continuity/J05资格族匹配、runtime预算和local cancel/returned结果闭口，contracts五result不复制。worker -> jobs库单向，Jobs无worker依赖/repo writer/内部retry循环。actual run/完整J envelope/CLI/callable交Step7/8/9/14，不能临时mint run。能力/字段/factory/finite phase/unknown保留自检pass；下一Worker。

## 3. Worker问题回答、诊断与取舍

Worker承接qualified E02/E04、排他platform E01/E03 session、Application给出的有界既有subject调度及停止。稳定source/mode/epoch/session/candidate/ACK/disposition当前闭口；subscription/HTTP/poll/Gateway/runner与wire需Step7/8/14真实绑定。采用source模式排他、epoch欠缺Slot、原job计划；不由disconnect/reconnect/empty batch当coverage，不直写cursor/业务、不自动retry原unknown。

| capability | 输入 | 输出 / 副作用 | 对象 / 类别 | 后续 |
|---|---|---|---|---|
| W-SOURCE | actual source/mode/family/session/epoch | connected/disconnected/not established | PlatformSourceSession / entry-local | E01/E03 qualified platform |
| W-CONSUME | trusted producer/scope/safe meta | 分派/独立ACK/拒绝/未知 | WorkerConsumerItem / ephemeral entry | E02/E04 Application |
| W-SCHEDULE | qualified既有candidate/原J plan/预算 | bounded调用jobs同库 | ScheduledJobCandidate/WorkerSchedulingBatch | Application qualified读取；jobs库 |


### SourceSessionPhase
归属`platform_sessions.rs`；adapter-local source session phase。
```rust
/// adapter-local source session phase。
pub enum SourceSessionPhase {
    /// 尚未连接/建立epoch。
    Configured,
    /// actual qualified来源已建立。
    Active,
    /// 实际来源断开，保原epoch/gap。
    Disconnected,
    /// current mode/source资格不足。
    NotEstablished,
    /// 本地停止，不证明已覆盖历史。
    Stopped,
}
```
| 变体 | Rustdoc注释 / 载荷语义 | 允许来源 | 允许去向 |
|---|---|---|---|
| Configured | 尚未连接/建立epoch | from_parts固定初态 | record_connected -> Active；record_unavailable -> NotEstablished；stop_local -> Stopped |
| Active | actual qualified来源已建立 | Configured/Disconnected/NotEstablished经actual连接proof | record_disconnect -> Disconnected；stop_local -> Stopped |
| Disconnected | 实际来源断开，保原epoch/gap | Active实际断开 | record_connected -> Active；record_unavailable -> NotEstablished；stop_local -> Stopped |
| NotEstablished | current mode/source资格不足 | Configured/Disconnected实际资格缺口 | record_connected -> Active须完整proof；stop_local -> Stopped |
| Stopped | 本地停止，不证明已覆盖历史 | 任一非Stopped phase实际停止 | 无本次实例回边；原gap/未知由Application保存 |

| 类别 | 完整签名 | 中文Rustdoc |
|---|---|---|
| 工厂 | `pub fn validate(self) -> Result<Self, ContractViolation>` | /// 核载荷一致和finite分支，拒绝未知标签；不授authority。 |


### WorkerEventFamily
归属`consumers.rs`；仅正式source/consumer事件族。
```rust
/// 仅正式source/consumer事件族。
pub enum WorkerEventFamily {
    /// E02原owner committed source。
    CommittedSource,
    /// E04原handoff consumer结果。
    ConsumerDisposition,
}
```
| 变体 | Rustdoc注释 / 载荷语义 | 允许来源 | 允许去向 |
|---|---|---|---|
| CommittedSource | E02原owner committed source | 所属正式source/纯组装 | 不适用，无lifecycle |
| ConsumerDisposition | E04原handoff consumer结果 | 所属正式source/纯组装 | 不适用，无lifecycle |

| 类别 | 完整签名 | 中文Rustdoc |
|---|---|---|
| 工厂 | `pub fn validate(self) -> Result<Self, ContractViolation>` | /// 核载荷一致和finite分支，拒绝未知标签；不授authority。 |


### WorkerItemDisposition
归属`consumers.rs`；单项entry处置与transport ACK独立。
```rust
/// 单项entry处置与transport ACK独立。
pub enum WorkerItemDisposition {
    /// 尚未交Application。
    Pending,
    /// 实际交Application，不表示提交。
    Dispatched,
    /// 实际Application已返回安全结果。
    ReturnedLocal,
    /// finite来源/协议拒绝。
    Rejected(SafeReasonCode),
    /// 本地等待或原op结果未知。
    Indeterminate(SafeReasonCode),
}
```
| 变体 | Rustdoc注释 / 载荷语义 | 允许来源 | 允许去向 |
|---|---|---|---|
| Pending | 尚未交Application | 所属正式source/纯组装 | 不适用，无lifecycle |
| Dispatched | 实际交Application，不表示提交 | 所属正式source/纯组装 | 不适用，无lifecycle |
| ReturnedLocal | 实际Application已返回安全结果 | 所属正式source/纯组装 | 不适用，无lifecycle |
| Rejected | finite来源/协议拒绝；`SafeReasonCode` | 所属正式source/纯组装 | 不适用，无lifecycle |
| Indeterminate | 本地等待或原op结果未知；`SafeReasonCode` | 所属正式source/纯组装 | 不适用，无lifecycle |

| 类别 | 完整签名 | 中文Rustdoc |
|---|---|---|
| 工厂 | `pub fn validate(self) -> Result<Self, ContractViolation>` | /// 核载荷一致和finite分支，拒绝未知标签；不授authority。 |


### WorkerBatchPhase
归属`scheduling.rs`；有界调度的本地phase。
```rust
/// 有界调度的本地phase。
pub enum WorkerBatchPhase {
    /// 实际qualified候选已读取。
    Collected,
    /// 依次调用同jobs库。
    Dispatching,
    /// 本batch调用返回，非全平台成功。
    CompletedLocal,
    /// 本地停止且无已知未决项。
    StoppedLocal,
    /// 本地停止仍保原unknown。
    StoppedWithUnknown,
}
```
| 变体 | Rustdoc注释 / 载荷语义 | 允许来源 | 允许去向 |
|---|---|---|---|
| Collected | 实际qualified候选已读取 | from_parts固定初态，index=0/returned空/in_flight=None | take_next_plan有项 -> Dispatching；无项且无在途 -> CompletedLocal；stop_local -> 两Stopped |
| Dispatching | 依次调用同jobs库 | Collected/Dispatching有界take_next_plan | 有项继续；actual所有返回 -> CompletedLocal；stop_local -> 两Stopped |
| CompletedLocal | 本batch调用返回，非全平台成功；原unknown仍保留 | 空batch或actual最后返回 | 无本batch回边 |
| StoppedLocal | 本地停止且无已知未决项 | Collected/Dispatching且实际未决为空 | 无本batch回边 |
| StoppedWithUnknown | 本地停止仍保原unknown | Collected/Dispatching且实际未决非空 | 无本batch回边；Application原恢复责任不变 |

| 类别 | 完整签名 | 中文Rustdoc |
|---|---|---|
| 工厂 | `pub fn validate(self) -> Result<Self, ContractViolation>` | /// 核载荷一致和finite分支，拒绝未知标签；不授authority。 |


### PlatformSourceSession
归属`platform_sessions.rs`；current模式/epoch与实际连接的entry-local载体。
```rust
/// current模式/epoch与实际连接的entry-local载体。
pub struct PlatformSourceSession {
    /// 实际source注册。
    registration: QualifiedPlatformSourceRegistration,
    /// actual session/source epoch或欠缺。
    epoch: QualificationSlot<QualifiedStreamEpoch>,
    /// actual session identity或不适用欠缺。
    session_id: QualificationSlot<SafeOpaqueId>,
    /// 来源phase。
    phase: SourceSessionPhase,
    /// 有界private处理/等待。
    budget: RuntimeExecutionBudget,
}
```
| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| registration | `QualifiedPlatformSourceRegistration` | 实际source注册；qualified config，worker只poll/Socket/WebSocket/Gateway模式 |
| epoch | `QualificationSlot<QualifiedStreamEpoch>` | actual session/source epoch或欠缺；qualified source；Configured可Missing，Active必须Established |
| session_id | `QualificationSlot<SafeOpaqueId>` | actual session identity或不适用欠缺；stateful mode实际来源；poll无session不伪造外部ID |
| phase | `SourceSessionPhase` | 来源phase；初始Configured |
| budget | `RuntimeExecutionBudget` | 有界private处理/等待；受权profile |

| 类别 | 完整签名 | 中文Rustdoc / 参数、返回和副作用 |
|---|---|---|
| 工厂 | `pub fn from_parts(registration: QualifiedPlatformSourceRegistration, epoch: QualificationSlot<QualifiedStreamEpoch>, session_id: QualificationSlot<SafeOpaqueId>, phase: SourceSessionPhase, budget: RuntimeExecutionBudget) -> Result<Self, ContractViolation>` | /// 完整复制且phase只Configured，epoch/session来自实际注册或明确Missing；不能构造Active跳过连接proof；不生成ID/时间/权限，无IO。 |
| 成员 | `pub fn record_connected(&mut self, epoch: QualifiedStreamEpoch, session: QualificationSlot<SafeOpaqueId>, basis: SafeAuthorityRef, now: SafeInstant) -> Result<(), ContractViolation>` | /// Configured/Disconnected/NotEstablished->Active只actual source proof，basis exact kind PlatformSourceSession；same registered source/current mode；stateful session必须Established |
| 成员 | `pub fn record_disconnect(&mut self, reason: SafeGapReason) -> Result<(), ContractViolation>` | /// Active->Disconnected，保旧epoch/位置；通知Application记录gap，不直写cursor或声称resume成功 |
| 成员 | `pub fn record_unavailable(&mut self, reason: SafeReasonCode) -> Result<(), ContractViolation>` | /// Configured/Disconnected->NotEstablished只实际连接资格缺口，保旧epoch/session历史不造新的Active；reason只finite返回材料；无网络/业务写，guard失败零修改。 |
| 成员 | `pub fn stop_local(&mut self) -> Result<(), ContractViolation>` | /// Configured/Active/Disconnected/NotEstablished->Stopped只停止宿主；未知原operation由Application/runtime保留 |


只读消费面：保持字段私有，不提供mutable getter或跳过factory；公开可读取不等于可以日志/外显；Application须重新核验current资格并过滤。

| 完整签名 | 中文Rustdoc / 副作用 |
|---|---|
| `pub fn registration(&self) -> &QualifiedPlatformSourceRegistration` | /// 借用原registration字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn epoch(&self) -> &QualificationSlot<QualifiedStreamEpoch>` | /// 借用原epoch字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn session_id(&self) -> &QualificationSlot<SafeOpaqueId>` | /// 借用原session_id字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn phase(&self) -> &SourceSessionPhase` | /// 借用原phase字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn budget(&self) -> &RuntimeExecutionBudget` | /// 借用原budget字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |

不变量/禁止：initial Configured，HTTP来源属于API不重复active；epoch是qualified source/adapter-local隔离依据，不宣称平台全局水位；新epoch无法比较旧epoch。

### WorkerConsumerItem
归属`consumers.rs`；受信安全E02/E04单项dispatch载体。
```rust
/// 受信安全E02/E04单项dispatch载体。
pub struct WorkerConsumerItem {
    /// 实际event族。
    family: WorkerEventFamily,
    /// trusted actor/scope/source。
    context: TrustedConsumerContext,
    /// body-free event meta。
    metadata: SafeEventMetadata,
    /// 原handoff op或source尚未local接管None。
    original: Option<OriginalOperationRef>,
    /// 实际entry处置。
    disposition: WorkerItemDisposition,
    /// 实际transport ACK。
    ack: ProtocolAckDisposition,
}
```
| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| family | `WorkerEventFamily` | 实际event族；registered source |
| context | `TrustedConsumerContext` | trusted actor/scope/source；bootstrap admission |
| metadata | `SafeEventMetadata` | body-free event meta；qualified producer，原trace |
| original | `Option<OriginalOperationRef>` | 原handoff op或source尚未local接管None；E04必须实际原op，E02不先mint新effect |
| disposition | `WorkerItemDisposition` | 实际entry处置；初始Pending |
| ack | `ProtocolAckDisposition` | 实际transport ACK；初始NotSent，owner/consumer业务独立 |

| 类别 | 完整签名 | 中文Rustdoc / 参数、返回和副作用 |
|---|---|---|
| 工厂 | `pub fn from_parts(family: WorkerEventFamily, context: TrustedConsumerContext, metadata: SafeEventMetadata, original: Option<OriginalOperationRef>, disposition: WorkerItemDisposition, ack: ProtocolAckDisposition) -> Result<Self, ContractViolation>` | /// 校验并完整复制上述全部入参；不生成ID/时间/权限，无IO |
| 成员 | `pub fn mark_dispatched(&mut self) -> Result<(), ContractViolation>` | /// Pending->Dispatched仅actual交同Application E02/E04；source/scope/schema先核 |
| 成员 | `pub fn record_returned(&mut self, disposition: ConsumeDisposition, original: Option<OriginalOperationRef>, ack: ProtocolAckDisposition) -> Result<(), ContractViolation>` | /// Dispatched->ReturnedLocal/Indeterminate按actual safe结果；E02原operation仅actual SourceConsumeResult建立，E04不得换原op；ACK独立不推consumer accepted。 |


只读消费面：保持字段私有，不提供mutable getter或跳过factory；公开可读取不等于可以日志/外显；Application须重新核验current资格并过滤。

| 完整签名 | 中文Rustdoc / 副作用 |
|---|---|
| `pub fn family(&self) -> &WorkerEventFamily` | /// 借用原family字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn context(&self) -> &TrustedConsumerContext` | /// 借用原context字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn metadata(&self) -> &SafeEventMetadata` | /// 借用原metadata字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn original(&self) -> &Option<OriginalOperationRef>` | /// 借用原original字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn disposition(&self) -> &WorkerItemDisposition` | /// 借用原disposition字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn ack(&self) -> &ProtocolAckDisposition` | /// 借用原ack字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |

不变量/禁止：不包含完整协议envelope/foreign payload；E02/E04 body到Step8 typed safe引用；无private/raw durable queue/dead-letter。

### ScheduledJobCandidate
归属`scheduling.rs`；Application当前筛选出的既有原subject候选。
```rust
/// Application当前筛选出的既有原subject候选。
pub struct ScheduledJobCandidate {
    /// 原J plan/subject/op。
    plan: JobInvocationPlan,
    /// 本次真实read/scope/CAS。
    selection_read: LocalSnapshotReadBasis,
    /// 实际资格筛选来源。
    selection_basis: SafeAuthorityRef,
    /// 候选有限窗口。
    validity: SafeValidityWindow,
}
```
| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| plan | `JobInvocationPlan` | 原J plan/subject/op；Application qualified candidate接口，worker不造新请求 |
| selection_read | `LocalSnapshotReadBasis` | 本次真实read/scope/CAS；Application bounded repositories读取 |
| selection_basis | `SafeAuthorityRef` | 实际资格筛选来源；exact kind ScheduledJobCandidate，正式current维护范围 |
| validity | `SafeValidityWindow` | 候选有限窗口；current source交集 |

| 类别 | 完整签名 | 中文Rustdoc / 参数、返回和副作用 |
|---|---|---|
| 工厂 | `pub fn from_parts(plan: JobInvocationPlan, selection_read: LocalSnapshotReadBasis, selection_basis: SafeAuthorityRef, validity: SafeValidityWindow) -> Result<Self, ContractViolation>` | /// 校验并完整复制上述全部入参；不生成ID/时间/权限，无IO |
| 成员 | `pub fn validate_before_invocation(&self, now: SafeInstant) -> Result<(), ContractViolation>` | /// 当前原subject/op/版本及scope一致、未到期；jobs/Application在IO前另current重核；unknown不能被调度器重置 |
| 工厂 | `pub fn from_selection(selection: BridgeMaintenanceSelection, context: &TrustedJobContext, availability: &RuntimeAvailability, budget: &RuntimeExecutionBudget) -> Result<Self, ContractViolation>` | /// 消费Application唯一selection，经jobs assembler装原plan并保read/basis/window；零IO/新key-op。 |
| 成员 | `pub fn into_plan(self, now: SafeInstant) -> Result<JobInvocationPlan, ContractViolation>` | /// 当前validation后消费候选，交出owned原plan；不Clone/续期资格或换subject。 |


只读消费面：保持字段私有，不提供mutable getter或跳过factory；公开可读取不等于可以日志/外显；Application须重新核验current资格并过滤。

| 完整签名 | 中文Rustdoc / 副作用 |
|---|---|
| `pub fn plan(&self) -> &JobInvocationPlan` | /// 借用原plan字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn selection_read(&self) -> &LocalSnapshotReadBasis` | /// 借用原selection_read字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn selection_basis(&self) -> &SafeAuthorityRef` | /// 借用原selection_basis字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn validity(&self) -> &SafeValidityWindow` | /// 借用原validity字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |

不变量/禁止：结构校验不授权；完整复制全部字段，缺正式来源拒绝。

### WorkerBatchInFlight
归属`scheduling.rs`；Step7已确认的batch在途安全identity，不是第二份plan/run/claim。
```rust
/// batch唯一在途项的原安全identity；不是第二份plan、run或claim。
pub struct WorkerBatchInFlight {
    /// 从即将交Jobs的原plan完整保留typed subject，J05包含expected。
    subject: JobInvocationSubject,
    /// 原plan continuity的operation，仅用于local返回/取消关联。
    original: OriginalOperationRef,
}
```
| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| subject | `JobInvocationSubject` | take_next_plan从原plan完整字段重建，J02含recovery/subject、J05含subject/expected；不由CLI/candidate key推造 |
| original | `OriginalOperationRef` | 原plan continuity.operation，仅entry-local返回/取消关联，不是新业务操作 |

| 类别 | 完整签名 | 中文Rustdoc / 副作用 |
|---|---|---|
| 工厂 | `pub fn from_parts(subject: JobInvocationSubject, original: OriginalOperationRef) -> Result<Self, ContractViolation>` | /// 只校原subject/op结构及族一致；零IO，不复制plan或生成operation。 |
| 成员 | `pub fn subject(&self) -> &JobInvocationSubject` | /// 只短借原subject，零修改，不授资格。 |
| 成员 | `pub fn original(&self) -> &OriginalOperationRef` | /// 只短借原operation，零修改，不变效果证明。 |

不变量/禁止：只由take_next_plan在全部pure guard通过后形成；无mutable getter、Clone/serde或queue/CLI构造，停止仍保identity。

### WorkerSchedulingBatch
归属`scheduling.rs`；同jobs库的有限候选调度batch。
```rust
/// 同jobs库的有限候选调度batch。
pub struct WorkerSchedulingBatch {
    /// 本次scope/actor/basis。
    context: TrustedJobContext,
    /// 实际qualified候选。
    candidates: Vec<ScheduledJobCandidate>,
    /// 本batch上限。
    limit: u32,
    /// 本地调度index。
    next_index: usize,
    /// batch localphase。
    phase: WorkerBatchPhase,
    /// 实际返回safe结果。
    returned: Vec<SafeJobResultSummary>,
    /// actual未决原op/effect。
    unresolved: Vec<OriginalOperationEffectRef>,
    /// 唯一已移交owned plan的原identity，返回或停止仍需精确关联。
    in_flight: Option<WorkerBatchInFlight>,
}
```
| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| context | `TrustedJobContext` | 本次scope/actor/basis；受信scheduler，不默认operator |
| candidates | `Vec<ScheduledJobCandidate>` | 实际qualified候选；Application bounded读取；无重复original |
| limit | `u32` | 本batch上限；受权profile，非零 |
| next_index | `usize` | 本地调度index；初始0，不是stream cursor |
| phase | `WorkerBatchPhase` | batch localphase；初始Collected |
| returned | `Vec<SafeJobResultSummary>` | 实际返回safe结果；初始空，jobs library actual返回 |
| unresolved | `Vec<OriginalOperationEffectRef>` | actual未决原op/effect；停止仍保留，不以timeout推无效果 |
| in_flight | `Option<WorkerBatchInFlight>` | 初始None；take_next_plan形成，record_returned核原returned plan后清除；stop_local不丢原identity |

| 类别 | 完整签名 | 中文Rustdoc / 参数、返回和副作用 |
|---|---|---|
| 工厂 | `pub fn from_parts(context: TrustedJobContext, candidates: Vec<ScheduledJobCandidate>, limit: u32, next_index: usize, phase: WorkerBatchPhase, returned: Vec<SafeJobResultSummary>, unresolved: Vec<OriginalOperationEffectRef>, in_flight: Option<WorkerBatchInFlight>) -> Result<Self, ContractViolation>` | /// 完整复制且只接受Collected/index0/returned空/in_flight=None；candidates不超limit，unresolved仅actual继承；零IO/新ID/权限。 |
| 成员 | `pub fn take_next_plan(&mut self, now: SafeInstant) -> Result<Option<JobInvocationPlan>, ContractViolation>` | /// 所有pure guard通过后才消费candidate并建立in_flight/递增index；返回owned原plan；无候选且无在途才CompletedLocal；失败零修改。 |
| 成员 | `pub fn record_returned(&mut self, returned_plan: JobInvocationPlan, result: SafeJobResultSummary, unresolved: Vec<OriginalOperationEffectRef>) -> Result<(), ContractViolation>` | /// 先核原returned_plan与in_flight subject/op/context及可见slice，再append实际summary/并集合并unknown并清在途；重复/wrong返回零修改。 |
| 成员 | `pub fn stop_local(&mut self, unresolved: Vec<OriginalOperationEffectRef>) -> Result<(), ContractViolation>` | /// Collected/Dispatching->StoppedLocal/StoppedWithUnknown，停止新项；并集合并actual未决原op且保已有集合，空输入不得清除；同original恢复责任仍由Application持有。 |


只读消费面：保持字段私有，不提供mutable getter或跳过factory；公开可读取不等于可以日志/外显；Application须重新核验current资格并过滤。

| 完整签名 | 中文Rustdoc / 副作用 |
|---|---|
| `pub fn context(&self) -> &TrustedJobContext` | /// 借用原context字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn candidates(&self) -> &Vec<ScheduledJobCandidate>` | /// 借用原candidates字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn limit(&self) -> &u32` | /// 借用原limit字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn next_index(&self) -> &usize` | /// 借用原next_index字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn phase(&self) -> &WorkerBatchPhase` | /// 借用原phase字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn returned(&self) -> &Vec<SafeJobResultSummary>` | /// 借用原returned字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn unresolved(&self) -> &Vec<OriginalOperationEffectRef>` | /// 借用原unresolved字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn in_flight(&self) -> &Option<WorkerBatchInFlight>` | /// 短借原在途identity，不清除unknown或授执行资格。 |

不变量/禁止：constructor仅Collected/index0/returned空/in_flight=None，candidates<=limit且当前受权read闭包；调用同jobs库而非复制Application J。take/return区间不换key/op，stop_local保在途identity与actual unknown，CompletedLocal非foreign成功；完整owned-plan guard沿Step7§4.1/4.4、Step10 M21，不新增状态边。
### Worker草稿与模块停审
source注册按同installation/family/source互斥，epoch欠缺明确NotEstablished；disconnect/new session不关闭gap。safe consumer实际disposition/ACK独立，bounded候选由Application给出并按原job plan交同jobs库；取消只本地停止保实际未决操作。callable/subscription/poll/Gateway/producer envelope/调度读port细节到Step7/8/9/14，constructor不能模拟连接、ACK、run、投递或测试成功。capability/字段/factory/runtime与entry状态/compile边界自检pass，当前七module和六Domain组均完成，下一只X跨审。

<!-- step06-entry-tail -->
