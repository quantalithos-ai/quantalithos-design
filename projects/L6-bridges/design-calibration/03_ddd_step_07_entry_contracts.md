# L6-bridges 03 Step7：API / Jobs / Worker入口契约

## 1. 共同边界

本页按P -> J -> W顺序追加。entry只消费Application具名callable和Infra已qualified host，不得直接取得23port/repository/Domain对象或foreign client。路径均沿Step4现有文件，非已实现源码。server/CLI/scheduler/Bus/executor产品未选；Step8完整wire body、route/serde/status仍未到达。

所有输入先结构decode（Step8）再由actual principal/source组装trusted context；请求体不能自报ActorContext/TrustedJobContext/TrustedConsumerContext/authority。每次调用创建scoped `BridgeCallControl`，non-Send Future在当前受核executor poll；取消不证明无效果，unresolved原op/effect进入稳定结果和runtime state。

## 2. P / API typed admission与dispatch

### 2.1 API内部typed调用联合

计划归属`crates/api/src/management.rs`、`query.rs`、`platform.rs`；只在API内，不是wire enum或通用route selector。

~~~rust
/// 六个既有管理命令的静态分派联合。
pub enum ApiManagementCall {
    /// 唯一C01安全配置用例。
    Configure(ConfigureInstallationInput),
    /// 唯一C02显式relation用例。
    ManageBinding(ManageBindingInput),
    /// 唯一C03 typed mapping用例。
    MaintainMapping(MaintainMappingInput),
    /// 唯一C04准备用例，零send。
    PrepareDelivery(PrepareDeliveryInput),
    /// 唯一C05初绑用例，不执行审批。
    BindAction(BindActionInput),
    /// 唯一C06恢复请求，零probe。
    RequestRecovery(RequestRecoveryInput),
}

/// 四个既有只读查询的静态分派联合。
pub enum ApiQueryCall {
    /// 唯一Q01 binding/mapping受权只读。
    BindingMapping(GetBindingMappingViewInput),
    /// 唯一Q02原operation受权只读。
    BridgeOperation(GetBridgeOperationViewInput),
    /// 唯一Q03连续性受权只读。
    Continuity(GetContinuityViewInput),
    /// 唯一Q04或E04原safe handoff，所属联合决定调用族。
    SafeHandoff(GetSafeHandoffViewInput),
}

/// private平台entry lease；raw仅variant活着期间可短借。
pub enum ApiPlatformCall {
    /// E01 owning private输入/分阶段结果，ACK不等owner提交。
    Ingress(IngressEntryLease),
    /// E03 owning private输入/分阶段结果，签名不授owner动作权。
    Callback(CallbackEntryLease),
}

/// 即时入口稳定安全结果，协议层不能把variant合成success bool。
pub enum ApiDispatchResult {
    /// C组safe结果，不把local提交提升为外部送达。
    Command(BridgeCommandResult),
    /// Q组可见slice结果，不公开仓内cursor/token。
    Query(BridgeReadResult),
    /// E01 owning private输入/分阶段结果，ACK不等owner提交。
    Ingress(InboundConsumeResult),
    /// E03 owning private输入/分阶段结果，签名不授owner动作权。
    Callback(CallbackConsumeResult),
}
~~~

每个enum variant有中文Rustdoc并只允许对应处理器；无Unknown/Other/String/Any。factory是穷尽variant，member只能match/受限借用；不自动serde。ApiPlatformCall不可Clone/Debug/Display/serde/persist，lease raw无getter。

### 2.2 admission、dispatcher与完整签名

~~~rust
/// C01~06静态dispatcher，只持六个Application callable。
pub struct ManagementDispatcher<'a> {
    /// 注入同deadline clock域的actual技术时钟面，不授业务权限。
    clock: &'a dyn ScopedRuntimeClock,
    /// 唯一C01安全配置接纳，local提交不等provider可用的具名调用引用，不暴露其port。
    configure: &'a ConfigureBridgeInstallation<'a>,
    /// 唯一C02显式relation管理，授权与binding generation独立核验的具名调用引用，不暴露其port。
    binding: &'a ManageExternalBinding<'a>,
    /// 唯一C03受权typed mapping维护，不创建GlobalMember的具名调用引用，不暴露其port。
    mapping: &'a MaintainExternalMapping<'a>,
    /// 唯一C04仅准备原effect的plan/intent，不发送平台请求的具名调用引用，不暴露其port。
    delivery: &'a PrepareExternalDelivery<'a>,
    /// 唯一C05原known source初绑，不消费one-use或写owner Decision的具名调用引用，不暴露其port。
    action: &'a BindExternalAction<'a>,
    /// 唯一C06仅登记获准原subject恢复请求，不执行probe的具名调用引用，不暴露其port。
    recovery: &'a RequestBridgeRecovery<'a>,
}

/// Q01~04静态dispatcher，无任何mutation callable。
pub struct QueryDispatcher<'a> {
    /// 注入同deadline clock域的actual技术时钟面，不授业务权限。
    clock: &'a dyn ScopedRuntimeClock,
    /// 唯一Q01 installation/binding/mapping受权只读view，零write的具名调用引用，不暴露其port。
    binding_mapping: &'a GetBindingMappingView<'a>,
    /// 唯一Q02原operation受权只读view，零probe/repair的具名调用引用，不暴露其port。
    operation: &'a GetBridgeOperationView<'a>,
    /// 唯一Q03 cursor/gap/lane/recovery受权只读view，零推进的具名调用引用，不暴露其port。
    continuity: &'a GetContinuityView<'a>,
    /// 唯一Q04 audit/handoff受权只读view，不造观测材料的具名调用引用，不暴露其port。
    handoff: &'a GetSafeHandoffView<'a>,
}

/// E01/E03即时private入口；ACK callback已注入对应Application callable。
pub struct PlatformDispatcher<'a> {
    /// 注入同deadline clock域的actual技术时钟面，不授业务权限。
    clock: &'a dyn ScopedRuntimeClock,
    /// 唯一E01 private入站或safe continuity接管，ACK/local/owner阶段独立的具名调用引用，不暴露其port。
    ingress: &'a PlatformInputReceivedConsumer<'a>,
    /// 唯一E03来源、责任、owner action验证及原claim交接，ACK独立的具名调用引用，不暴露其port。
    callback: &'a PlatformCallbackReceivedConsumer<'a>,
}

/// 核trusted context/runtime/预算；不解析业务body或授owner权限。
pub fn admit(context: ApiTrustedContext, availability: RuntimeAvailability, budget: RuntimeExecutionBudget, now: SafeInstant) -> Result<ApiAdmissionPlan, ApiEntryDisposition>;

impl ManagementDispatcher<'_> {
    /// 只穷尽分派到同variant用例，返回安全命令结果。
    pub fn dispatch<'call>(&'call self, plan: &'call ApiAdmissionPlan, call: ApiManagementCall, control: &'call BridgeCallControl<'call>) -> BridgePortFuture<'call, BridgeCommandResult>;
}
impl QueryDispatcher<'_> {
    /// 只穷尽分派到同variant只读用例，入口层没有write fallback。
    pub fn dispatch<'call>(&'call self, plan: &'call ApiAdmissionPlan, call: ApiQueryCall, control: &'call BridgeCallControl<'call>) -> BridgePortFuture<'call, BridgeReadResult>;
}
impl PlatformDispatcher<'_> {
    /// lease活着时短借private context，Application执行实际ACK callback并返回分阶段结果。
    pub fn dispatch<'call>(&'call self, consumer: TrustedConsumerContext, call: &'call ApiPlatformCall, control: &'call BridgeCallControl<'call>) -> BridgePortFuture<'call, ApiDispatchResult>;
}
~~~

三个dispatcher的`new`完整接struct中全部非Option引用（clock为第一参数）并返回Self，不做network探测；字段private，无callable/port getter。entry host先由`ScopedRuntimeClock::now(control)`取得实际时刻交`admit`，后者通过Step6 `ApiAdmissionPlan::evaluate(now)`要求Qualified availability未过期、budget非零、Command/Query context与handler种类一致；dispatcher在dispatch前再次读同clock核plan/current，不能复用早前timer timestamp。NotSelected/NotEstablished映射Unavailable，shape/principal/source失败Rejected。`AdmittedForDispatch`只表示可调用Application。

Management调用的input.context必须和plan CommandEntryContext逐字段同源，不能decoder另造；Query同理且禁止command key/maintenance。dispatcher匹配错误为InvalidInput，绝不按URL字符串动态选择。Application结果只有Step8 response mapper可投影，API不能读取hidden ref并加到error。

Platform dispatcher从lease只读取candidate event key、安全installation/source getter并短借private context；E01构造`BridgePlatformInboundInvocation::Private`，E03保持其原input，不交换。API不接受客户端自报`Continuity`notice。actual `BridgeProtocolAckExecutor`由Infra router根据reply basis执行；ACK disposition来自已重归Contracts的`ProtocolAckExecution`，API/HTTP status不得覆盖它。lease保持到Future及ACK完成，再结束borrow/drop；超deadline或client断开不证明owner/platform/local无效果。

### 2.3 API host与安全映射

| 文件 | 输入来源 | 允许输出 | 禁止 |
|---|---|---|---|
| management.rs | actual认证principal + Step8 C body + core CommandMetadata | BridgeCommandResult | handler直接repo/ID port、grant/binding、create Turn、send platform |
| query.rs | actual认证principal + Step8 Q body + core QueryMetadata | BridgeReadResult | 从ref推scope、count泄漏、repair/refresh/probe/audit |
| platform.rs | exact registered route/source创建的Ingress/CallbackEntryLease | Inbound/CallbackConsumeResult及协议ACK实际阶段 | raw inbox/dead-letter、header当Actor、HTTP 2xx当owner accepted |
| main.rs | RuntimeCompositionPlan、qualified dispatchers、未来server/executor host | RuntimeExecutionState | 缺配置自动启动listener、默认route/token/fake |

未来HTTP/server host必须先按fixed route+content bounds收取有界body，构造lease但不log；signature verification仍在Application/Infra port，route匹配不等验签。过大/未知content/unknown installation在进入Application前finite拒绝，若平台要求ACK只能通过qualified platform host生成对应safe plan，不能回显raw错误。完整route/status/headers到Step8/14；本Step不预选axum/hyper或任何框架。

### 2.4 P草稿与停审

P人工设计自检pass：六C、四Q、E01/E03均静态一一分派；trusted context/runtime admission、private lease存活和actual ACK技术callback闭口；API没有repo/owner/platform SDK直达。测试切口`api/tests/inbound_dispatch_tests.rs`及management/query admission：wrong variant/context、runtime unavailable、raw leak、ACK failure/owner success独立、query零write；仅计划，未执行。下一仅Jobs J。

## 3. J / Jobs五个bounded invocation

### 3.1 dispatcher与完整签名

计划归属`crates/jobs/src/invocation.rs`及`lib.rs`。Jobs只依赖Application具名J callables，不能取得repo/port或定义第二套job业务。

~~~rust
/// 五个J Application callable的静态dispatcher。
pub struct JobInvocationDispatcher<'a> {
    /// 注入同deadline clock域的actual技术时钟面，不授业务权限。
    clock: &'a dyn ScopedRuntimeClock,
    /// 唯一J01既有intent的单次有界派发，actual claim先于外呼的具名调用引用，不暴露其port。
    dispatch: &'a DispatchQueuedDeliveryJob<'a>,
    /// 唯一J02原operation权威只读probe与known finalize，不换op的具名调用引用，不暴露其port。
    operation: &'a ReconcileBridgeOperationJob<'a>,
    /// 唯一J03原stream/epoch完整coverage恢复，partial保gap的具名调用引用，不暴露其port。
    gap: &'a ReconcileStreamGapJob<'a>,
    /// 唯一J04原canonical/consumer operation重试，不新建producer的具名调用引用，不暴露其port。
    handoff: &'a RetrySafeHandoffJob<'a>,
    /// 唯一J05既有subject资格维护，expected入幂等含义，不授新权的具名调用引用，不暴露其port。
    qualification: &'a RefreshBridgeQualificationJob<'a>,
}

impl JobInvocationDispatcher<'_> {
    /// 穷尽核plan kind/subject/context/continuity后调用唯一同名J用例。
    pub fn invoke<'call>(&'call self, plan: JobInvocationPlan, control: &'call BridgeCallControl<'call>) -> BridgePortFuture<'call, JobInvocationState>;
}

/// 只把Application selection原值装成Step6 plan；不生成key/op、预算或资格。
pub fn assemble_job_invocation_plan(
    subject: BridgeMaintenanceSubject,
    continuity: JobContinuityMetadata,
    qualified_key: QualifiedIdempotencyKey,
    context: &TrustedJobContext,
    availability: &RuntimeAvailability,
    budget: &RuntimeExecutionBudget,
) -> Result<JobInvocationPlan, ContractViolation>;
~~~

`assemble_job_invocation_plan`只接受`BridgeMaintenanceSelection::into_scheduling_parts`交出的原subject/continuity/qualified key；按五个subject变体穷尽映射kind与`JobInvocationSubject`，核key内的namespace/scope/recipe与context静态一致，再按各safe carrier的具名factory/getter精确重建context/runtime availability/budget并装入Step6 plan。借用参数允许同一bounded batch装多个plan，不允许worker修改或从raw配置重造它们。函数不把key放入plan、不生成operation、不读取repo，也不把runtime budget当业务retry许可。wrong subject/continuity/context/key组合立即拒绝。

X审计对Step6 JobInvocationSubject做两个精确variant补全：`Qualification(BridgeViewSubjectRef)`改为`Qualification { subject: BridgeViewSubjectRef, expected: ExpectedLocalRevision }`，`Operation(OriginalRecoverableSubjectRef)`改为`Operation { recovery: RecoveryRecordRef, subject: OriginalRecoverableSubjectRef }`；其余三variant和enum归属不变。每字段中文Rustdoc分别“既有受权维护主语 / actual行的local版本条件”和“actual原恢复记录 / 同记录既有业务主语”。来源只允许完整Application selection，去向分别J05/J02 input，Jobs不读取repo补丢失字段。JobContinuityMetadata只标同业务主语族，plan/input另保expected/recovery；无operation/trace时间充当版本或record条件。

`new(clock, dispatch, operation, gap, handoff, qualification) -> Self`完整接六个非Option引用，不探测provider、不接受map/selector。`invoke`消费plan，先调`clock.now(control)`取得actual now，再调用Step6既有`validate(now)`，核availability Qualified、runtime budget与control、TrustedJobContext、continuity trace/scope/subject及下表唯一组合，再构造A7 input：

| kind | 唯一JobInvocationSubject | Application input | 禁止 |
|---|---|---|---|
| Dispatch | Delivery(DeliveryIntentEffectRef) | DispatchDeliveryJobInput(job, delivery, continuity) | 新建intent/effect、任意send |
| ReconcileOperation | Operation { recovery: RecoveryRecordRef, subject: OriginalRecoverableSubjectRef } | ReconcileOperationJobInput(job, recovery, subject, continuity) | 从ID猜主语、换op、同步重发、NotFound=no-effect |
| ReconcileGap | Gap(GapRef) | ReconcileGapJobInput(job, gap, continuity) | raw replay、跨stream/epoch推进 |
| SafeHandoff | Handoff(SafeHandoffRef) | RetryHandoffJobInput(job, handoff, continuity) | 换canonical/op/consumer |
| RefreshQualification | Qualification { subject: BridgeViewSubjectRef, expected: ExpectedLocalRevision } | RefreshQualificationJobInput(job, subject, expected, continuity) | 新grant、复活终态、默换expected/key、通用refresh |

JobContinuityMetadata.operation/subject须与variant主语一致；它可以是selection复用的实际原operation，也可以是确认无既有dedup/result后由Application分配的fresh未执行本地维护operation。requested_at只参与调用窗口，不进idempotency key。invoke后的Application从typed input subject（J05另含expected）和TrustedJobContext重新调用LocalUnitOfWorkPort生成同一key并重读dedup/result/current；若已存在不同原operation则以committed记录为准，返回stale/original-reused而不执行第二effect。业务RetryBudgetRef只取实际row/qualification；五个Application input不接收key、runtime budget、token或body hash。dispatcher保原plan进入state，以safe getter和具名factory按字段精确重建input，不Clone whole plan或延长current资格；input含借用重建的safe metadata而非原plan第二份truth。

### 3.2 JobInvocationState阶段映射

assembler对`BridgeMaintenanceSubject::Intent`直接移交完整DeliveryIntentEffectRef到Delivery variant，对Recovery named variant原值移交record/subject到Operation named variant；Gap/Handoff/Qualification分别原值移交各自字段。所有effect/recovery/expected均来自Application完整行，不能仅凭一个opaque ID、continuity.trace或外部body重建；这些增量覆盖Step6的简化草案，Step8/9/正式03装配须采用本Step最终形态。

`JobInvocationState::from_parts(plan, Pending, None, vec![])`仅建立合法初态，不是run started。实际交Application前调用`mark_dispatched(now)`；返回各wrapper的`SafeJobResultSummary`后调用`record_returned(summary, unresolved)`。本地取消只调用`cancel_local_wait(unresolved)`并保原未决；Indeterminate收集结果声明的原op/effect，不能由error字符串推。CompletedLocal只表示本次bounded调用返回，不表示平台/owner/consumer成功或全部候选完成。

Application的`BridgePortError::Indeterminate`必须携original；Jobs将其加入unresolved并返回Indeterminate state。Unavailable/Denied等finite错误只映安全reason，不生成假summary计数。panic/raw error不能转换成successful state；产品host负责进程故障边界，但不得写伪job report。

为使Worker在不Clone state/plan的情况下收集batch结果，`JobInvocationState`增加一次性`into_parts(self) -> (JobInvocationPlan, JobInvocationPhase, Option<SafeJobResultSummary>, Vec<OriginalOperationEffectRef>)`；只移出原字段、零IO，不改变phase/result或清除unresolved。只有`CompletedLocal + Some(result)`可把原returned plan及result交`WorkerSchedulingBatch::record_returned`；CancelledLocal/Indeterminate或无result必须转入batch停止/未决分支。

### 3.3 Worker和bin共用一条调用链

worker的`ScheduledJobCandidate`新增消费成员（计划`crates/worker/src/scheduling.rs`）：

~~~rust
impl ScheduledJobCandidate {
    /// 消费唯一Application selection，经jobs assembler装plan并原样保留选择依据。
    pub fn from_selection(
        selection: BridgeMaintenanceSelection,
        context: &TrustedJobContext,
        availability: &RuntimeAvailability,
        budget: &RuntimeExecutionBudget,
    ) -> Result<Self, ContractViolation>;
    /// 当前validation后消费候选并交出原plan；不Clone或续期selection资格。
    pub fn into_plan(self, now: SafeInstant) -> Result<JobInvocationPlan, ContractViolation>;
}
~~~

`from_selection`消费selection，调用其`into_scheduling_parts`后把subject/continuity/key原值交`assemble_job_invocation_plan`，再以返回plan和原read_basis/selection_basis/validity调用Step6既有factory；worker不得读取、记录、替换或持久化key。`into_plan`只核validity、plan与selection_read/basis静态一致并消费self；Application调用仍重新read/current。ScheduledJobCandidate不进入jobs crate，因此依赖保持worker -> jobs -> application。五bin从受信operations host取得`JobInvocationPlan`后调用同一dispatcher；CLI flag/env/ref文本不能构造TrustedJobContext、authority、new subject/op/effect。若没有正式invocation provider或runtime required seams，bin返回NotEstablished并不启动。

| bin | 允许的一次调用 | 不允许 |
|---|---|---|
| dispatch_queued_delivery | 单个既有Delivery plan | all、broadcast、force-send、无限loop |
| reconcile_bridge_operation | 单个原subject/op | change-op、assume rollback、new effect |
| reconcile_stream_gap | 单个原gap | raw event replay、跨epoch cursor set |
| retry_safe_handoff | 单个原handoff/op | regenerate canonical、ACK当accepted |
| refresh_bridge_qualification | 单个已有qualification subject | create grant、revive revoked/expired/retired |

### 3.4 J草稿与停审

J人工设计自检pass：五kind/subject/input/result一一对应；qualified key只用于selection/plan静态移交并由Application invoke重推，runtime与业务retry预算来源分开；worker候选消费不引反向依赖；bin与worker复用同dispatcher且无通用replay。计划测试`jobs/tests/job_invocation_tests.rs`：25种wrong pair、selection key/context不一致、并发原operation胜出、unqualified runtime、candidate expiry、Cancelled/Indeterminate unresolved、五bin禁用bulk；未实现/执行，不创建run/report/artifact。下一仅Worker W。

## 4. W / Worker三类bounded runner

### 4.1 共同边界与所有权纠正

计划归属`crates/worker/src/consumers.rs`、`platform_sessions.rs`、`scheduling.rs`、`lib.rs`及`main.rs`。Worker只消费Infra qualified technical host、四个Application E callable、五个Application selector和Jobs dispatcher；不取得任何repository/业务port、domain transition、raw client或owner/platform API。

Step6两个借用签名在本Step发现无法把owned结果交给下游，作以下精确替换。X进一步发现batch移出plan后无法再比对actual returned主语：只在既有WorkerSchedulingBatch追加entry-local `in_flight`，不增加job业务truth/状态/入口。

~~~rust
/// batch唯一在途项的原安全identity；不是第二份plan、run或claim。
pub struct WorkerBatchInFlight {
    /// 从即将交Jobs的原plan完整保留typed subject，J05包含expected。
    subject: JobInvocationSubject,
    /// 原plan continuity的operation，仅用于local返回/取消关联。
    original: OriginalOperationRef,
}

impl WorkerConsumerItem {
    /// actual返回后同时记录新获知的原operation及独立transport ACK。
    pub fn record_returned(
        &mut self,
        disposition: ConsumeDisposition,
        original: Option<OriginalOperationRef>,
        ack: ProtocolAckDisposition,
    ) -> Result<(), ContractViolation>;
}

impl WorkerSchedulingBatch {
    /// 按eligible顺序消费一个candidate并取得owned plan，供Jobs dispatcher消费。
    pub fn take_next_plan(&mut self, now: SafeInstant) -> Result<Option<JobInvocationPlan>, ContractViolation>;
    /// 原returned plan与唯一在途identity匹配后接纳实际summary，并合并未知集合。
    pub fn record_returned(&mut self, returned_plan: JobInvocationPlan, result: SafeJobResultSummary, unresolved: Vec<OriginalOperationEffectRef>) -> Result<(), ContractViolation>;
}
~~~

`WorkerConsumerItem::record_returned`替换Step6缺少`original`参数的草案：E02初始None，只能由actual `SourceConsumeResult.operation`建立；E04必须与初始`OriginalHandoffOperationRef`同operation，任何分支不得清除或换原operation。disposition与ACK分别取Application/transport实际结果，ACK失败不覆盖Application disposition。

`WorkerBatchInFlight::from_parts(subject: JobInvocationSubject, original: OriginalOperationRef) -> Result<Self, ContractViolation>`只校原subject/op结构及族一致；getter分别`subject() -> &JobInvocationSubject`、`original() -> &OriginalOperationRef`，无mutable/IO/Clone/serde。仅take_next_plan从原plan的safe getter/factory精确重建；不允许queue/CLI直接提供该carrier。

WorkerSchedulingBatch唯一字段增量`in_flight: Option<WorkerBatchInFlight>`；完整factory覆盖为`from_parts(context: TrustedJobContext, candidates: Vec<ScheduledJobCandidate>, limit: u32, next_index: usize, phase: WorkerBatchPhase, returned: Vec<SafeJobResultSummary>, unresolved: Vec<OriginalOperationEffectRef>, in_flight: Option<WorkerBatchInFlight>) -> Result<Self, ContractViolation>`，仍只初态Collected/index=0/returned空且in_flight=None。新增只读`in_flight(&self) -> &Option<WorkerBatchInFlight>`，其余字段/getter/stop_local归属不变。

`take_next_plan`替换Step6返回`&JobInvocationPlan`的不可消费草案：先在remaining candidates头部借用原candidate调用`validate_before_invocation(now)`并完整核context/budget/phase/in_flight=None；再从原plan准备安全in-flight identity，所有pure guard成功后才移出candidate，以同一now调用`into_plan(now)`并保原owned plan，仅成功后递增processed next_index、设in_flight=Some并进入Dispatching。这个移交区间零IO/await/current clock更新，不允许先消费再执行可失败的新guard；失败零修改。空集合仅在in_flight=None才CompletedLocal。不得Clone plan、跳项、因candidate过期生成新operation或把Vec empty解释为外部coverage。

`record_returned`精确替换Step6两参数草案；先核returned_plan原subject/op/context与in_flight完全一致、结果可见主语仅是该plan允许的slice（隐藏可为空，不伪0），然后append actual summary、并集合并unresolved并清in_flight。没有in_flight、wrong原plan或重复returned都零修改拒绝。stop_local若in_flight仍Some必须保其identity及actual unknown，不以取消清空；已知未执行也必须由实际NoIo/known出口说明，不把plan移交当效果证明。

### 4.2 E02 / E04 safe event consumer runner

~~~rust
/// 只把Infra safe transport item分派到E02或E04。
pub struct SafeEventConsumerRunner<'p> {
    /// 注入同deadline clock域的actual技术时钟面，不授业务权限。
    clock: &'p dyn ScopedRuntimeClock,
    /// 注入actual safe source单项owning lease宿主，不提供raw delivery handle。
    transport: &'p dyn SafeEventTransportHost,
    /// 唯一E02 owner committed source准备，复用C04同effect，零send的具名调用引用，不暴露其port。
    source: &'p CommittedSourceAvailableConsumer<'p>,
    /// 唯一E04原consumer disposition落本地，不创造canonical或evidence的具名调用引用，不暴露其port。
    handoff: &'p SafeHandoffDispositionConsumer<'p>,
}

impl SafeEventConsumerRunner<'_> {
    /// 最多读取并处理一个safe item；None仅本次bounded poll为空。
    pub fn run_one<'a>(
        &'a self,
        budget: &'a RuntimeExecutionBudget,
        control: &'a BridgeCallControl<'a>,
    ) -> BridgePortFuture<'a, Option<WorkerConsumerItem>>;
}
~~~

`new(clock, transport, source, handoff) -> Self`完整接四个非Option引用，只接受actual Qualified source registration；不探测网络或取repo。`run_one`先调clock.now(control)核实际validity，在标dispatched/returned等纯guard前重取actual now；顺序固定：

1. 调`next_event`取得owning `SafeTransportEventLease`，在validity/budget内一次性拆出call/context/metadata/original/ACK executor；构造Pending/NotSent `WorkerConsumerItem`，family由call穷尽决定，不按topic字符串猜。
2. 核call内consumer/event key与外层context/metadata/original一致，`mark_dispatched`后只调用E02或E04同名Application consumer；E02不得调用PlatformDeliveryPort，E04不得创建canonical/evidence。
3. 将Application实际结果的finite `ConsumeDisposition`及actual operation按原variant重建；outer finite error只映Rejected/Blocked/Indeterminate，raw error不出worker。
4. 把该disposition短借给一次性`ack.execute(disposition, control)`，消费boxed private ACK host；显式Self:call保持captured driver/handle与control存活，Future结束后不留第二调用路径。记录真实ProtocolAckDisposition，再调用三参数`record_returned`。ACK result不改owner/platform/consumer阶段；ACK调用失败记Failed并保Application结果/原operation。

lease与boxed ACK host只活到`run_one` Future结束，不能进队列、detached task、dead-letter或日志。cancel发生在Application/ACK任一阶段时，只停止本地poll；若actual operation/effect已建立则加入runtime unresolved，未知ACK保持NotSent/Failed，不重取同event生成新key。计划测试`worker/tests/consumer_dispatch_tests.rs`覆盖wrong family/source、E02/E04互换、duplicate、ACK lost、Application indeterminate、cancel和raw不可见；未执行。

### 4.3 E01 / E03 resident platform session runner

~~~rust
/// 单个resident source item的安全本地结果；Idle不是coverage。
pub enum PlatformSessionItemResult {
    /// 本次bounded poll为空，不证明coverage或NoEffect。
    Idle,
    /// actual E01 local/protocol/owner分阶段结果。
    Inbound(InboundConsumeResult),
    /// E03 owning private输入/分阶段结果，签名不授owner动作权。
    Callback(CallbackConsumeResult),
    /// actual source断连有限原因，只有Application提交才有durable gap。
    Disconnected {
        /// actual source有限断连原因，不代表gap durable或NoEffect。
        reason: SafeGapReason,
        /// 原E01 Continuity的实际分阶段结果；无正式notice只能None并blocked/manual。
        continuity: Option<InboundConsumeResult>,
    },
}

/// 一个qualified registration的entry-local连接与E01/E03分派器。
pub struct PlatformSessionRunner<'p> {
    /// 注入同deadline clock域的actual技术时钟面，不授业务权限。
    clock: &'p dyn ScopedRuntimeClock,
    /// 注入排他resident source连接宿主，不直达业务repository。
    host: &'p dyn PlatformSourceHost,
    /// 唯一E01 private入站或safe continuity接管，ACK/local/owner阶段独立的具名调用引用，不暴露其port。
    inbound: &'p PlatformInputReceivedConsumer<'p>,
    /// 唯一E03来源、责任、owner action验证及原claim交接，ACK独立的具名调用引用，不暴露其port。
    callback: &'p PlatformCallbackReceivedConsumer<'p>,
    /// actual已注册consumer上下文，不由queue/body自报来源。
    context: TrustedConsumerContext,
    /// entry-local actual连接proof，None不等gap coverage。
    connection: Option<PlatformSourceConnection>,
}

impl PlatformSessionRunner<'_> {
    /// actual host proof后才记录Active，失败保持Unavailable/Disconnected。
    pub fn connect<'a>(&'a mut self, session: &'a mut PlatformSourceSession, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, ()>;
    /// 按resident source family处理一个E01/E03项，owning lease活过ACK。
    pub fn dispatch_next<'a>(&'a mut self, session: &'a mut PlatformSourceSession, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, PlatformSessionItemResult>;
    /// 停止新source项并消费原connection，unknown进入runtime集合。
    pub fn stop<'a>(&'a mut self, session: &'a mut PlatformSourceSession, control: &'a BridgeCallControl<'a>) -> BridgePortFuture<'a, ()>;
}
~~~

`new(clock, host, inbound, callback, context) -> Result<Self, ContractViolation>`核host registration与context installation/scope/source完全一致、qualification Established且只允许resident mode；Slack Events HTTP、Mattermost trusted HTTP、Telegram webhook、Discord HTTP interaction在任何connect前拒绝。connect/dispatch_next/stop用同clock取得actual now供session/connection纯guard，不能以事件received_at或sequence作当前时刻。中央RuntimeCompositionPlan仍按installation+actual source identity+family核exact一个mode；Telegram同updates来源的Inbound/Callback切换必须原子，不能各启一半。

`connect`只在session Configured/Disconnected/NotEstablished且runner connection=None调用host；actual `PlatformSourceConnection`成功后先核registration/epoch/session/basis/validity，再`record_connected`并保存connection。失败只`record_unavailable`，不构造Active。`dispatch_next`只在Active+Some(connection)运行，按registration.family调用唯一`next_ingress`或`next_callback`；`None -> Idle`，不推进cursor或关闭gap。owning lease必须活过Application consume及其协议ACK，private borrow不得离开Future。

source EOF/error先保留connection的原epoch/session，session转Disconnected(SourceDisconnected)；永久EOF由host返回finite Unavailable，不用本次空poll的None表示。调用`host.discontinuity_notice`获得actual safe材料后，通过原E01 `PlatformInputReceivedInput { consumer, invocation: Continuity(notice) }`记录Protocol gap，只有该Application actual commit才能宣称通知已durable，之后返回`Disconnected { reason, continuity: Some(actual_result) }`。调用方从原safe结果保local commit/operation及actual unresolved；host无法提供正式notice时只能None并blocked/manual，已建立operation却unknown时必须保Some安全结果或返回携original的Indeterminate，不能缩成不带原op的reason。notice无private ACK/owner handoff，不伪消息或第20业务入口。notice资格/commit失败仍保Disconnected及未知，source branch blocked/manual，不静默续接。

reconnect前须消费/close失效connection并把runner.connection置None，保session历史epoch；actual新proof才可`record_connected`。same epoch不证明中间coverage，新epoch禁止与旧position比较；已存Protocol gap只能J03原stream/epoch完整权威coverage关闭。actual event的owner/delivery coverage仍由所属Application stage核验，Worker不直写cursor/gap。缺正式marker或comparator时保持incomparable/open，不用session sequence、message ID、timestamp或队列空补水位。

`stop`先停止接新item，再消费connection调用host.close并`session.stop_local`；close/stop不证明ACK、owner action、外部无效果或gap覆盖。in-flight Application/ACK结果未知时交runtime unresolved；不能在新session自动重放raw lease。四平台source client、OAuth/token、Gateway intents、poll参数和executor仍not_selected/not_established。

### 4.4 eligible scheduling runner

~~~rust
/// 五个Application selector与同一Jobs dispatcher的bounded调度入口。
pub struct WorkerSchedulingRunner<'p> {
    /// 注入同deadline clock域的actual技术时钟面，不授业务权限。
    clock: &'p dyn ScopedRuntimeClock,
    /// 唯一J01既有intent的单次有界派发，actual claim先于外呼的具名调用引用，不暴露其port。
    dispatch: &'p DispatchQueuedDeliveryJob<'p>,
    /// 唯一J02原operation权威只读probe与known finalize，不换op的具名调用引用，不暴露其port。
    operation: &'p ReconcileBridgeOperationJob<'p>,
    /// 唯一J03原stream/epoch完整coverage恢复，partial保gap的具名调用引用，不暴露其port。
    gap: &'p ReconcileStreamGapJob<'p>,
    /// 唯一J04原canonical/consumer operation重试，不新建producer的具名调用引用，不暴露其port。
    handoff: &'p RetrySafeHandoffJob<'p>,
    /// 唯一J05既有subject资格维护，expected入幂等含义，不授新权的具名调用引用，不暴露其port。
    qualification: &'p RefreshBridgeQualificationJob<'p>,
    /// 唯一五kind Jobs dispatcher，不直达repo/platform。
    jobs: &'p JobInvocationDispatcher<'p>,
}

impl WorkerSchedulingRunner<'_> {
    /// 读取一个Application-local eligible页并装成同kind batch；next cursor只限当前qualified session。
    pub fn collect_page<'a>(
        &'a self,
        kind: BoundedJobKind,
        context: TrustedJobContext,
        as_of: SafeInstant,
        page: BridgeRepositoryPageRequest,
        availability: &'a RuntimeAvailability,
        budget: &'a RuntimeExecutionBudget,
        control: &'a BridgeCallControl<'a>,
    ) -> BridgePortFuture<'a, (WorkerSchedulingBatch, Option<BridgeRepositoryCursor>)>;
    /// 逐项调用同一Jobs dispatcher并返回完整local batch状态。
    pub fn run_batch<'a>(
        &'a self,
        batch: WorkerSchedulingBatch,
        control: &'a BridgeCallControl<'a>,
    ) -> BridgePortFuture<'a, WorkerSchedulingBatch>;
}
~~~

`new(clock, dispatch, operation, gap, handoff, qualification, jobs) -> Self`完整接七个非Option引用，不取得dyn业务port。`collect_page`先由clock.now(control)核actual runtime/window与as_of合法范围，再核budget.max_batch、page limit/filter与`context.scope()`，然后按kind调用唯一`select_*_candidates`；Application内部取得maintenance read。它消费`BridgeRepositoryPage::into_parts`，逐selection调用`ScheduledJobCandidate::from_selection`，以Step6 factory建立Collected batch；next cursor原样返回且只可在同actor/scope/filter/order/source/validity session继续，不能写配置、queue payload或public token。

`run_batch`只用`take_next_plan(now)`取得owned plan并调用`jobs.invoke`。每个返回state经`into_parts`：仅CompletedLocal+Some(summary)以原returned_plan交`record_returned(returned_plan, summary, unresolved)`；CancelledLocal/Indeterminate、outer error或本地cancel调用`stop_local`并保in_flight identity、合并actual unresolved，不重入队、不换operation/key。candidate过期、current stale、claim竞争、rate下界或业务retry budget不足都保持有限结果；Worker不得sleep后直接调用平台、缩短not-before或重建candidate。一个batch最多budget.max_batch且不跨scope/kind，empty batch不是外部队列完成。

### 4.5 main、shutdown与错误边界

`run_batch`在每次`take_next_plan(now)`及batch纯guard前调用`clock.now(control)`；Jobs invoke自行再核actual now，不靠Worker的早前时刻续期资格。shutdown guard同样取actual clock，产品clock未建立时不宣称停止窗口/资格已核；当前已知unresolved仍须保留。以上clock引用只technical TrustedClock，不开放Application业务port或repository给entry。

`main.rs`只消费actual `RuntimeCompositionPlan`、qualified Infra hosts及上述三runner。`RuntimeExecutionState::begin`成功前不poll source、不collect candidate；任何required host/provider/source/owner/Observability seam为NotSelected/NotEstablished时对应branch不启动，其他installation的资格不能借用。

shutdown顺序固定为：停止接新项 -> 受信host在actual停止事件读取同域clock，以checked加法和批准窗口构造同四资源元组的`shutdown_budget` -> `begin_shutdown(shutdown_budget, actual in-flight unresolved)` -> 停止新`next_event`/`dispatch_next`/`collect_page` -> 取消并等待scoped non-Send Future至本次bounded deadline -> 调各session `stop` -> 将Application/Jobs/ACK/driver仍unknown的原operation/effect并集合并 -> `record_local_stop`。不得沿用启动seed deadline或在每call无限顺延。clock/profile不能核时停止新IO、宿主隔离/取消并保actual未决，不虚构deadline/StoppedLocal/NoEffect。只有实际集合为空才StoppedLocal；deadline、disconnect、drop、lease expiry、进程退出或ACK成功均不能删除unknown。不得spawn detached task、写伪run/report/evidence或在日志记录外部消息体、token/secret、callback选择、附件URL、敏感Gate内容及可还原hash。

Worker surface错误只允许`BridgePortError`的有限安全字段、`WorkerItemDisposition`、`PlatformSessionItemResult`、`WorkerBatchPhase`和`RuntimeExecutionPhase`；raw SDK/Bus/HTTP/DB错误须由Infra清洗。panic不是成功/ACK依据。完整loop/executor、信号处理和产品client到Step14/04绑定；本Step没有启动进程或伪造运行结果。

### 4.6 W草稿、复杂度与停审

W人工设计自检pass：E02/E04只经safe transport lease与一次性ACK callback，E01/E03只经排他resident source host与owning private lease；五eligible selector到ScheduledJobCandidate到Jobs dispatcher单向闭合。两个Step6 ownership签名已精确替换，empty/disconnect/cancel/ACK均不推coverage/no-effect/accepted。技术host仍属Infra TransportHost分面，23业务port与19业务callable不增。计划测试除上述切口外包含四平台HTTP-vs-resident互斥、Telegram family原子切换、epoch change、page cursor换scope、batch plan一次消费及shutdown unknown并集；未实现/执行。下一仅X跨模块审计。
