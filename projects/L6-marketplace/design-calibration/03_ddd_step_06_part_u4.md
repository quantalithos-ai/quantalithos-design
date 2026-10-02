# Step6 U4 受控分发对象小循环

## 思考、诊断与取舍

capability：受控分发，只承接本地truth/引用/guard/readsurface。前序HLD给轮廓，本批先检查功能与所有字段、factory、methods来源。采用分离实体/immutable组合/策略/视图，拒绝把qualified输入暴露给客户端或复制owner正文。所有ref不足以自证authority；当前owner/SDK positive仍blocked。

## capability与对象映射

| 对象 | 能力 / 功能 | 类别 / 归属 | 字段与函数 / 状态来源 | 后续承接 |
|---|---|---|---|---|
| DistributionIntent | 本地取消，发出/unknown不得假造外部取消；同version序列化下当前gate成立，初始Accepted | domain / statecarrier | intent_ref,version_ref,consumer_ref,receiver_ref,scope_ref,state,revision；Accepted/Cancelled | Step7 typed ports；8请求/结果；9独立flow；10矩阵 |
| DistributionRelation | 追加正式结果，迟到时触发影响补充；本地已知关系，未确认不能称安装 | domain / immutable/value | relation_ref,intent_ref,version_ref,consumer_ref,outcome_binding；无独立lifecycle | Step7 typed ports；8请求/结果；9独立flow；10矩阵 |
| DistributionAttempt | 已持久化许可，派发前重核验；正式匹配结果→Confirmed/Failed/CommitUnknown；未派发资格不成立，保存缺口；初始Prepared，intent先于外部effect | domain / statecarrier | attempt_ref,intent_ref,fence,outcome_binding,failure_ref,state,revision；Prepared/Dispatching/Confirmed/Failed/CommitUnknown/Blocked | Step7 typed ports；8请求/结果；9独立flow；10矩阵 |
| ReceiverOutcomeBinding | 逐binding匹配，ACK不等结果；不生成installed/paid | contracts / immutable/value | outcome_ref,intent_ref,version_ref,consumer_ref,receiver_ref,scope_ref；无独立lifecycle | Step7 typed ports；8请求/结果；9独立flow；10矩阵 |
| AcquisitionGatePolicy | 每次当前依据，免费不豁免；stateless策略/typed view assembler调用，不新增truth | domain / guard | requirements；无独立lifecycle | Step7 typed ports；8请求/结果；9独立flow；10矩阵 |
| DistributionReadView | immutable仅typed读取/校验；rehydrate后移03；不把confirmed展示Installed/支付成功 | contracts / readview | intent_ref,relation_ref,attempt_refs,read_context,status；无独立lifecycle | Step7 typed ports；8请求/结果；9独立flow；10矩阵 |

对象能力到字段/函数：上表每一行字段闭包承接该对象能力；下方每字段明确来源，完整签名承接对应状态，不以overview替代。初值只factory提供，其余owner/current字段由正式port与typed读取。修正Draft可无review、Blocked可无source摘要；公开视图采用SafeReadContext，不依赖domain。

### DistributionIntent

```rust
/// Carries DistributionIntent with explicit sources and no upstream body.
pub struct DistributionIntent {
    /// Carries intent_ref; see the source and invariant table.
    pub intent_ref: DistributionIntentRef,
    /// Carries version_ref; see the source and invariant table.
    pub version_ref: MarketVersionRef,
    /// Carries consumer_ref; see the source and invariant table.
    pub consumer_ref: DistributionConsumerRef,
    /// Carries receiver_ref; see the source and invariant table.
    pub receiver_ref: DistributionReceiverRef,
    /// Carries scope_ref; see the source and invariant table.
    pub scope_ref: MarketScopeRef,
    /// Carries state; see the source and invariant table.
    pub state: DistributionIntentState,
    /// Carries revision; see the source and invariant table.
    pub revision: MarketRevision,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| intent_ref | `DistributionIntentRef` | 本地ID |
| version_ref | `MarketVersionRef` | 用户明确选择，不latest |
| consumer_ref | `DistributionConsumerRef` | 正式receiver/scope绑定 |
| receiver_ref | `DistributionReceiverRef` | 正式typed receiver，不猜类型→安装目标 |
| scope_ref | `MarketScopeRef` | 当前authority范围 |
| state | `DistributionIntentState` | Accepted/Cancelled |
| revision | `MarketRevision` | repo并发版本 |

归属：domain；该对象只承接所属U能力；domain纯同步，无ownerbody/外部approval；字段必填完整才factory，optional以生命周期约束。

#### 成员函数

| 完整签名 | 作用 | 参数来源 | 返回 / 副作用 |
|---|---|---|---|
| `pub fn cancel(&mut self, input: DistributionCancelInput) -> Result<(), DomainError>` | 本地取消，发出/unknown不得假造外部取消 | DistributionCancelInput input：typed原对象/正式port qualified输入，不调用I/O | Result<(), DomainError>；只按Step10合法pair改变本对象；持久化/审计/必要work由application同UoW |
| `pub fn validate(&self) -> Result<(), DomainError>` | 完整字段/state不变量 | 当前本体 | 不做I/O；缺必填/binding/state错配拒绝 |

#### 工厂 / rehydrate

| 完整签名 | 必填字段来源 / 初始化 | 不变量 |
|---|---|---|
| `pub fn accept(input: QualifiedAcquisitionInput) -> Result<Self, DomainError>` | QualifiedAcquisitionInput的独立字段schema见shared_types；Accepted；revision=0 | 同version序列化下当前gate成立，初始Accepted；qualified字段只内侧构造，factory不是approval |
| `pub fn rehydrate(row: DistributionIntentRow) -> Result<Self, DomainError>` | Row与本对象逐字段同构；state/optional/revision全校验；repo读取来源 | 禁止SQL/rawbody进入domain，既有ref不能重factory以复活状态 |

#### 不变量与禁止

初始：Accepted；revision=0。binding只exacttyped比较，缺合同不fallback，state/status语义不外推。version/source_material/fixedbasis不可修改，revision镜像repo单一column；views只currentdisclosure之后构造，NotVisible/Missing/Degraded使用ReadSurface而非假填必需ref。unknown只能formal原intentprobe，终态不可任意复活。方法不得返回body/approval/payment/evidence/readiness。


### DistributionRelation

```rust
/// Carries DistributionRelation with explicit sources and no upstream body.
pub struct DistributionRelation {
    /// Carries relation_ref; see the source and invariant table.
    pub relation_ref: DistributionRelationRef,
    /// Carries intent_ref; see the source and invariant table.
    pub intent_ref: DistributionIntentRef,
    /// Carries version_ref; see the source and invariant table.
    pub version_ref: MarketVersionRef,
    /// Carries consumer_ref; see the source and invariant table.
    pub consumer_ref: DistributionConsumerRef,
    /// Carries outcome_binding; see the source and invariant table.
    pub outcome_binding: OptionalReceiverOutcomeBinding,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| relation_ref | `DistributionRelationRef` | 与intent同UoW分配 |
| intent_ref | `DistributionIntentRef` | 唯一意图关联 |
| version_ref | `MarketVersionRef` | 固定版本 |
| consumer_ref | `DistributionConsumerRef` | 正式消费关联 |
| outcome_binding | `OptionalReceiverOutcomeBinding` | 仅匹配正式结果回指 |

归属：domain；该对象只承接所属U能力；domain纯同步，无ownerbody/外部approval；字段必填完整才factory，optional以生命周期约束。

#### 成员函数

| 完整签名 | 作用 | 参数来源 | 返回 / 副作用 |
|---|---|---|---|
| `pub fn attach(&mut self, binding: ReceiverOutcomeBinding) -> Result<(), DomainError>` | 追加正式结果，迟到时触发影响补充 | ReceiverOutcomeBinding binding：typed原对象/正式port qualified输入，不调用I/O | Result<(), DomainError>；只按Step10合法pair改变本对象；持久化/审计/必要work由application同UoW |
| `pub fn validate(&self) -> Result<(), DomainError>` | 完整字段/state不变量 | 当前本体 | 不做I/O；缺必填/binding/state错配拒绝 |

#### 工厂 / rehydrate

| 完整签名 | 必填字段来源 / 初始化 | 不变量 |
|---|---|---|
| `pub fn for_intent(input: AcceptedDistributionInput) -> Result<Self, DomainError>` | AcceptedDistributionInput的独立字段schema见shared_types；outcome_binding=None | 本地已知关系，未确认不能称安装；qualified字段只内侧构造，factory不是approval |
| `pub fn rehydrate(row: DistributionRelationRow) -> Result<Self, DomainError>` | Row与本对象逐字段同构；state/optional/revision全校验；repo读取来源 | 禁止SQL/rawbody进入domain，既有ref不能重factory以复活状态 |

#### 不变量与禁止

初始：outcome_binding=None。binding只exacttyped比较，缺合同不fallback，state/status语义不外推。version/source_material/fixedbasis不可修改，revision镜像repo单一column；views只currentdisclosure之后构造，NotVisible/Missing/Degraded使用ReadSurface而非假填必需ref。unknown只能formal原intentprobe，终态不可任意复活。方法不得返回body/approval/payment/evidence/readiness。


### DistributionAttempt

```rust
/// Carries DistributionAttempt with explicit sources and no upstream body.
pub struct DistributionAttempt {
    /// Carries attempt_ref; see the source and invariant table.
    pub attempt_ref: DistributionAttemptRef,
    /// Carries intent_ref; see the source and invariant table.
    pub intent_ref: DistributionIntentRef,
    /// Carries fence; see the source and invariant table.
    pub fence: DispatchFence,
    /// Carries outcome_binding; see the source and invariant table.
    pub outcome_binding: OptionalReceiverOutcomeBinding,
    /// Carries failure_ref; see the source and invariant table.
    pub failure_ref: OptionalSafeFailureRef,
    /// Carries state; see the source and invariant table.
    pub state: DistributionAttemptState,
    /// Carries revision; see the source and invariant table.
    pub revision: MarketRevision,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| attempt_ref | `DistributionAttemptRef` | 本地ID |
| intent_ref | `DistributionIntentRef` | 原意图不变 |
| fence | `DispatchFence` | 本地claim/dispatch许可版本，非外部授权 |
| outcome_binding | `OptionalReceiverOutcomeBinding` | Confirmed必有matching结果 |
| failure_ref | `OptionalSafeFailureRef` | Failed/Blocked/Unknown安全来源 |
| state | `DistributionAttemptState` | Prepared/Dispatching/Confirmed/Failed/CommitUnknown/Blocked |
| revision | `MarketRevision` | 原子保存/旧fence拒绝 |

归属：domain；该对象只承接所属U能力；domain纯同步，无ownerbody/外部approval；字段必填完整才factory，optional以生命周期约束。

#### 成员函数

| 完整签名 | 作用 | 参数来源 | 返回 / 副作用 |
|---|---|---|---|
| `pub fn begin(&mut self, input: CurrentDispatchGateInput) -> Result<(), DomainError>` | 已持久化许可，派发前重核验 | CurrentDispatchGateInput input：typed原对象/正式port qualified输入，不调用I/O | Result<(), DomainError>；只按Step10合法pair改变本对象；持久化/审计/必要work由application同UoW |
| `pub fn settle(&mut self, input: ReceiverOutcomeInput) -> Result<(), DomainError>` | 正式匹配结果→Confirmed/Failed/CommitUnknown | ReceiverOutcomeInput input：typed原对象/正式port qualified输入，不调用I/O | Result<(), DomainError>；只按Step10合法pair改变本对象；持久化/审计/必要work由application同UoW |
| `pub fn block(&mut self, gap: ContractGapInput) -> Result<(), DomainError>` | 未派发资格不成立，保存缺口 | ContractGapInput gap：typed原对象/正式port qualified输入，不调用I/O | Result<(), DomainError>；只按Step10合法pair改变本对象；持久化/审计/必要work由application同UoW |
| `pub fn validate(&self) -> Result<(), DomainError>` | 完整字段/state不变量 | 当前本体 | 不做I/O；缺必填/binding/state错配拒绝 |

#### 工厂 / rehydrate

| 完整签名 | 必填字段来源 / 初始化 | 不变量 |
|---|---|---|
| `pub fn prepare(input: DistributionDispatchInput) -> Result<Self, DomainError>` | DistributionDispatchInput的独立字段schema见shared_types；Prepared；outcome/failure=None；revision=0 | 初始Prepared，intent先于外部effect；qualified字段只内侧构造，factory不是approval |
| `pub fn rehydrate(row: DistributionAttemptRow) -> Result<Self, DomainError>` | Row与本对象逐字段同构；state/optional/revision全校验；repo读取来源 | 禁止SQL/rawbody进入domain，既有ref不能重factory以复活状态 |

#### 不变量与禁止

初始：Prepared；outcome/failure=None；revision=0。binding只exacttyped比较，缺合同不fallback，state/status语义不外推。version/source_material/fixedbasis不可修改，revision镜像repo单一column；views只currentdisclosure之后构造，NotVisible/Missing/Degraded使用ReadSurface而非假填必需ref。unknown只能formal原intentprobe，终态不可任意复活。方法不得返回body/approval/payment/evidence/readiness。


### ReceiverOutcomeBinding

```rust
/// Carries ReceiverOutcomeBinding with explicit sources and no upstream body.
pub struct ReceiverOutcomeBinding {
    /// Carries outcome_ref; see the source and invariant table.
    pub outcome_ref: ReceiverOutcomeRef,
    /// Carries intent_ref; see the source and invariant table.
    pub intent_ref: DistributionIntentRef,
    /// Carries version_ref; see the source and invariant table.
    pub version_ref: MarketVersionRef,
    /// Carries consumer_ref; see the source and invariant table.
    pub consumer_ref: DistributionConsumerRef,
    /// Carries receiver_ref; see the source and invariant table.
    pub receiver_ref: DistributionReceiverRef,
    /// Carries scope_ref; see the source and invariant table.
    pub scope_ref: MarketScopeRef,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| outcome_ref | `ReceiverOutcomeRef` | receiver正式结果 |
| intent_ref | `DistributionIntentRef` | 原外部幂等意图 |
| version_ref | `MarketVersionRef` | 与sourcebinding匹配 |
| consumer_ref | `DistributionConsumerRef` | 指定consumer |
| receiver_ref | `DistributionReceiverRef` | 来源owner匹配 |
| scope_ref | `MarketScopeRef` | 正式结果范围 |

归属：contracts；该对象只承接所属U能力；domain纯同步，无ownerbody/外部approval；字段必填完整才factory，optional以生命周期约束。

#### 成员函数

| 完整签名 | 作用 | 参数来源 | 返回 / 副作用 |
|---|---|---|---|
| `pub fn matches(&self, input: DistributionOutcomeContext) -> bool` | 逐binding匹配，ACK不等结果 | DistributionOutcomeContext input：typed原对象/正式port qualified输入，不调用I/O | bool；纯读取，不改变状态 |
| `pub fn validate(&self) -> Result<(), DomainError>` | 完整字段/state不变量 | 当前本体 | 不做I/O；缺必填/binding/state错配拒绝 |

#### 工厂 / rehydrate

| 完整签名 | 必填字段来源 / 初始化 | 不变量 |
|---|---|---|
| `pub fn from_receiver(input: QualifiedReceiverOutcome) -> Result<Self, DomainError>` | QualifiedReceiverOutcome的独立字段schema见shared_types；完整copy typed输入；immutable固定不替换 | 不生成installed/paid；qualified字段只内侧构造，factory不是approval |
| `pub fn rehydrate(row: ReceiverOutcomeBindingRow) -> Result<Self, DomainError>` | Row与本对象逐字段同构；state/optional/revision全校验；repo读取来源 | 禁止SQL/rawbody进入domain，既有ref不能重factory以复活状态 |

#### 不变量与禁止

binding只exacttyped比较，缺合同不fallback，state/status语义不外推。version/source_material/fixedbasis不可修改，revision镜像repo单一column；views只currentdisclosure之后构造，NotVisible/Missing/Degraded使用ReadSurface而非假填必需ref。unknown只能formal原intentprobe，终态不可任意复活。方法不得返回body/approval/payment/evidence/readiness。


### AcquisitionGatePolicy

```rust
/// Carries AcquisitionGatePolicy with explicit sources and no upstream body.
pub struct AcquisitionGatePolicy {
    /// Carries requirements; see the source and invariant table.
    pub requirements: AcquisitionRequirements,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| requirements | `AcquisitionRequirements` | 正式source/auth/Gov/receiver与market未撤回要求 |

归属：domain；该对象只承接所属U能力；domain纯同步，无ownerbody/外部approval；字段必填完整才factory，optional以生命周期约束。

#### 成员函数

| 完整签名 | 作用 | 参数来源 | 返回 / 副作用 |
|---|---|---|---|
| `pub fn evaluate(&self, version: MarketVersion, current: CurrentQualificationInput, target: AcquisitionTargetInput) -> Result<LocalGateResult, DomainError>` | 每次当前依据，免费不豁免 | MarketVersion version；CurrentQualificationInput current；AcquisitionTargetInput target：typed原对象/正式port qualified输入，不调用I/O | Result<LocalGateResult, DomainError>；纯读取，不改变状态 |
| `pub fn validate(&self) -> Result<(), DomainError>` | 完整字段/state不变量 | 当前本体 | 不做I/O；缺必填/binding/state错配拒绝 |

#### 工厂 / rehydrate

| 完整签名 | 必填字段来源 / 初始化 | 不变量 |
|---|---|---|
| `pub fn new(requirements: AcquisitionRequirements) -> Result<Self, DomainError>` | formal适用规则输入，禁config豁免 | stateless guard，不新增truth |
| `pub fn rehydrate(row: AcquisitionGatePolicyRow) -> Result<Self, DomainError>` | Row与本对象逐字段同构；state/optional/revision全校验；repo读取来源 | 禁止SQL/rawbody进入domain，既有ref不能重factory以复活状态 |

#### 不变量与禁止

binding只exacttyped比较，缺合同不fallback，state/status语义不外推。version/source_material/fixedbasis不可修改，revision镜像repo单一column；views只currentdisclosure之后构造，NotVisible/Missing/Degraded使用ReadSurface而非假填必需ref。unknown只能formal原intentprobe，终态不可任意复活。方法不得返回body/approval/payment/evidence/readiness。


### DistributionReadView

```rust
/// Carries DistributionReadView with explicit sources and no upstream body.
pub struct DistributionReadView {
    /// Carries intent_ref; see the source and invariant table.
    pub intent_ref: OptionalDistributionIntentRef,
    /// Carries relation_ref; see the source and invariant table.
    pub relation_ref: OptionalDistributionRelationRef,
    /// Carries attempt_refs; see the source and invariant table.
    pub attempt_refs: DistributionAttemptRefSet,
    /// Carries read_context; see the source and invariant table.
    pub read_context: SafeReadContext,
    /// Carries status; see the source and invariant table.
    pub status: ReadSurfaceKind,
}
```

| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| intent_ref | `OptionalDistributionIntentRef` | 资格读面可无意图，不自动建 |
| relation_ref | `OptionalDistributionRelationRef` | 已知局部关系 |
| attempt_refs | `DistributionAttemptRefSet` | 已保存历史及unknown |
| read_context | `SafeReadContext` | 当前范围，不因旧成功泄漏 |
| status | `ReadSurfaceKind` | 结果安全姿态 |

归属：contracts；该对象只承接所属U能力；domain纯同步，无ownerbody/外部approval；字段必填完整才factory，optional以生命周期约束。

#### 成员函数

| 完整签名 | 作用 | 参数来源 | 返回 / 副作用 |
|---|---|---|---|
| 无业务变更成员 | immutable/view不修改truth | 不适用 | 只校验/typed读 |
| `pub fn validate(&self) -> Result<(), DomainError>` | 完整字段/state不变量 | 当前本体 | 不做I/O；缺必填/binding/state错配拒绝 |

#### 工厂 / rehydrate

| 完整签名 | 必填字段来源 / 初始化 | 不变量 |
|---|---|---|
| `pub fn assemble(input: DistributionReadInput) -> Result<Self, DomainError>` | DistributionReadInput的独立字段schema见shared_types；完整copy typed输入；immutable固定不替换 | 不把confirmed展示Installed/支付成功；qualified字段只内侧构造，factory不是approval |
| `pub fn rehydrate(row: DistributionReadViewRow) -> Result<Self, DomainError>` | Row与本对象逐字段同构；state/optional/revision全校验；repo读取来源 | 禁止SQL/rawbody进入domain，既有ref不能重factory以复活状态 |

#### 不变量与禁止

binding只exacttyped比较，缺合同不fallback，state/status语义不外推。version/source_material/fixedbasis不可修改，revision镜像repo单一column；views只currentdisclosure之后构造，NotVisible/Missing/Degraded使用ReadSurface而非假填必需ref。unknown只能formal原intentprobe，终态不可任意复活。方法不得返回body/approval/payment/evidence/readiness。


## Step10派发fence字段维护

DistributionAttempt.begin在Prepared合法分支将fence更新为CurrentDispatchGateInput.permission.fence：work_ref必须与原Prepared fence一致，generation仅当前Workclaim合法推进，保存Dispatching与许可同UoW。Failed/Blocked旧attempt终态不通过此字段更新复活；safe retry新attempt sameintent。NoticeIntent.begin同样保存原notice intent的current dispatch_fence，旧permission/checkpoint仍immutable，后续probe不能将新fence当第二send许可。

## 模块内停审

功能均有独立对象承接；字段来源含candidate/lookup/formalport/ID/CAS；factory与typedrow完整，views与业务state分轴。当前批次结构审查通过，外部positive blocked不改变。下一模块才创建其附录；不会提前创建Step7/8文件。
