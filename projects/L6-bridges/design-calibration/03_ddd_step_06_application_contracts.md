# L6-bridges 03 Step6：Application稳定对象契约

## 1. 问题回答、诊断与取舍

Application承接19编排/23ports、唯一local mutation、current资格、原result复用、private material和只读visibility。五private/九snapshot/三个internal名称已由Step4唯一归属，本步必须给完整字段和生命周期，不能全defer。采用borrowed call lifetime+safe refs；拒绝通用String handle、raw durable inbox、snapshot作public wire、query触发维护和存储result替代当前read授权。事务准备与实际commit证明采用不同类型，不在提交前构造CommittedLocalMutationRef。

| capability | 输入 | 输出 / 副作用 | 功能到对象 / 类别 | 后续 |
|---|---|---|---|---|
| A-PRIVATE | trusted transport/provider和本次current资格 | 五private借用句柄，不落store | PrivateIngress/CallbackContext、TransientQualifiedMaterialHandle、PrivateQualifiedPayload、PrivateSecretHandle / transient carrier | named private/secret/platform ports Step7 |
| A-SNAPSHOT | 受权repo consistent local read | 九local snapshot/原revision/typed ref | 各Snapshot / internal read carrier | 八repo/LocalUoW/Step11 |
| A-MUTATION | current受权pure Domain变化及预期CAS | 完整staged write/result/audit/conditional canonical计划 | QualifiedLocalMutationPlan/Prepared* / internal helper | LocalUnitOfWorkPort Step7/11 |
| A-INVALIDATION | 正式generation/basis失效 | 原已知对象有界失效计划 | QualificationInvalidationPlan / internal plan | Mapping/Delivery/Callback/Continuity/SafeTrace repositories |
| A-READ-RESULT | resolver-first current read、既有snapshot/原meaning | no-write filtered view/复用或安全否定结果 | LocalViewProjector/StoredResultReusePolicy / stateless helper | SafeReadQualificationPort/Step8/9 |
| A-VERIFY | private platform验证实际结果 | safe verification carrier或finite失败 | IngressVerificationResult / internal result | PlatformIngressPort/Step7 |

## 2. 当前闭口与defer

| 对象组 | 当前裁定 | 后续明确点 |
|---|---|---|
| 五private、九snapshot、mutation/invalidation/verification | close_now；唯一stable归属，不机械defer | port传递lifetime/读写/authority/error Step7 |
| stored-result reuse、visibility、producer requirement | close_now；不能由API/infra临时猜 | Step9顺序/Step11 atomic/Step13 canonical |
| 既有19用例对象及仓内facade导出 | defer_callable_and_port_bundle；先23trait/协议闭口；不增加通用service/execute/replay或空壳struct | Step7十port文件，Step8十九入口DTO，Step9十九flow |

## 3. private共同材料与存活纪律

以下五名称的公有constructor仅供受信Application/infra seam合作，不是外部请求API或认证来源；构造只校结构，actual current来源由owning port证明。所有bytes只在这次call lifetime借用；不能Clone/Debug/Display/Serialize/Deserialize/Error-source或进日志/trace/panic/evidence/store/dead-letter；不跨detached task、缓存或checkpoint。drop只结束borrow，不虚称内存已cryptographic zeroize；buffer owning provider的销毁/取消/上限合同到Step7/14核验。


### PrivateReplyContext<'call>
归属`private_material.rs`；瞬时协议回复通道上下文，不导出token/URL。
```rust
/// 瞬时协议回复通道上下文，不导出token/URL。
pub struct PrivateReplyContext<'call> {
    /// raw reply路由/token/provider上下文。
    opaque_context: &'call [u8],
    /// 实际mode deadline。
    deadline: SafeInstant,
    /// 原安装。
    namespace: InstallationNamespace,
    /// 回复通道模式依据。
    basis: SafeAuthoritySourceRef,
}
```
| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| opaque_context | `&'call [u8]` | raw reply路由/token/provider上下文；trusted ingress transport；private有界借用 |
| deadline | `SafeInstant` | 实际mode deadline；qualified platform source |
| namespace | `InstallationNamespace` | 原安装；trusted config |
| basis | `SafeAuthoritySourceRef` | 回复通道模式依据；registered adapter source |

| 类别 | 完整签名 | 中文Rustdoc / 参数、返回和副作用 |
|---|---|---|
| 工厂 | `pub fn from_parts(opaque_context: &'call [u8], deadline: SafeInstant, namespace: InstallationNamespace, basis: SafeAuthoritySourceRef) -> Result<Self, ContractViolation>` | /// 校验并完整复制上述全部入参；不生成ID/时间/权限，无IO |
| 成员 | `pub fn assert_deadline(&self, now: SafeInstant) -> Result<(), ContractViolation>` | /// 只核当前期限；实际ACK发送函数/取消合同交Step7 |
| 受限借用成员 | `pub fn borrow_for_protocol_reply(&self, namespace: &InstallationNamespace, basis: &SafeAuthoritySourceRef, now: SafeInstant) -> Result<&[u8], ContractViolation>` | /// 仅registered protocol回复executor在同source/namespace及deadline内借用opaque_context；不复制token/URL，不产生业务授权、durable接管或owner结果；借用不能逃逸本次call。 |


只读消费面：保持字段私有，不提供mutable getter或跳过factory；只借用safe字段/原private context，借用不逃逸本次call，不导出原始字节。

| 完整签名 | 中文Rustdoc / 副作用 |
|---|---|
| `pub fn deadline(&self) -> &SafeInstant` | /// 借用原deadline字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn namespace(&self) -> &InstallationNamespace` | /// 借用原namespace字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn basis(&self) -> &SafeAuthoritySourceRef` | /// 借用原basis字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |

不变量/禁止：无默认Debug/Clone/serde/Display；只能原source private回复，不能当业务授权或把原token导出。

### PrivateIngressContext<'call>
归属`private_material.rs`；未持久化平台输入的本次借用上下文。
```rust
/// 未持久化平台输入的本次借用上下文。
pub struct PrivateIngressContext<'call> {
    /// 验证用原始字节。
    raw_body: &'call [u8],
    /// 原请求签名/header材料。
    verification_inputs: &'call [u8],
    /// private ACK上下文。
    reply: PrivateReplyContext<'call>,
    /// 原安装。
    installation: BridgeInstallationRef,
    /// 实际接收时刻。
    received_at: SafeInstant,
}
```
| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| raw_body | `&'call [u8]` | 验证用原始字节；trusted transport收到，不等verified |
| verification_inputs | `&'call [u8]` | 原请求签名/header材料；同transport；不输出 |
| reply | `PrivateReplyContext<'call>` | private ACK上下文；同source |
| installation | `BridgeInstallationRef` | 原安装；trusted source binding |
| received_at | `SafeInstant` | 实际接收时刻；trusted host clock |

| 类别 | 完整签名 | 中文Rustdoc / 参数、返回和副作用 |
|---|---|---|
| 工厂 | `pub fn from_parts(raw_body: &'call [u8], verification_inputs: &'call [u8], reply: PrivateReplyContext<'call>, installation: BridgeInstallationRef, received_at: SafeInstant) -> Result<Self, ContractViolation>` | /// 校验并完整复制上述全部入参；不生成ID/时间/权限，无IO |
| 成员 | `pub fn assert_installation(&self, installation: &BridgeInstallationRef) -> Result<(), ContractViolation>` | /// pure结构匹配；所有验证仍PlatformIngressPort负责 |
| 受限借用成员 | `pub fn borrow_for_ingress_verifier(&self, installation: &BridgeInstallationRef) -> Result<(&[u8], &[u8]), ContractViolation>` | /// 同安装的registered PlatformIngressPort verifier只在本次call借用raw_body与verification_inputs；这些仍未verified，不能送owner/日志/持久化；shape mismatch拒绝且零修改。 |


只读消费面：保持字段私有，不提供mutable getter或跳过factory；只借用safe字段/原private context，借用不逃逸本次call，不导出原始字节。

| 完整签名 | 中文Rustdoc / 副作用 |
|---|---|
| `pub fn reply(&self) -> &PrivateReplyContext<'call>` | /// 借用原reply字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn installation(&self) -> &BridgeInstallationRef` | /// 借用原installation字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn received_at(&self) -> &SafeInstant` | /// 借用原received_at字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |

不变量/禁止：不允许Debug/Clone/serde/Display/自由Error-source；constructor完整输入且仅结构核验，不创建authority；借用不跨本次call，IO前重新核current资格。

### PrivateCallbackContext<'call>
归属`private_material.rs`；本次callback敏感context和回复通道借用。
```rust
/// 本次callback敏感context和回复通道借用。
pub struct PrivateCallbackContext<'call> {
    /// 原callback内容。
    raw_callback: &'call [u8],
    /// 签名/nonce/interaction材料。
    verification_inputs: &'call [u8],
    /// 原token/response route私有通道。
    reply: PrivateReplyContext<'call>,
    /// 原安装。
    installation: BridgeInstallationRef,
    /// 实际接收时刻。
    received_at: SafeInstant,
}
```
| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| raw_callback | `&'call [u8]` | 原callback内容；trusted transport输入；先验证 |
| verification_inputs | `&'call [u8]` | 签名/nonce/interaction材料；同source |
| reply | `PrivateReplyContext<'call>` | 原token/response route私有通道；同source |
| installation | `BridgeInstallationRef` | 原安装；trusted adapter binding |
| received_at | `SafeInstant` | 实际接收时刻；trusted clock |

| 类别 | 完整签名 | 中文Rustdoc / 参数、返回和副作用 |
|---|---|---|
| 工厂 | `pub fn from_parts(raw_callback: &'call [u8], verification_inputs: &'call [u8], reply: PrivateReplyContext<'call>, installation: BridgeInstallationRef, received_at: SafeInstant) -> Result<Self, ContractViolation>` | /// 校验并完整复制上述全部入参；不生成ID/时间/权限，无IO |
| 成员 | `pub fn assert_installation(&self, installation: &BridgeInstallationRef) -> Result<(), ContractViolation>` | /// 只核安装；signed/unsigned结果不等有审批权 |
| 受限借用成员 | `pub fn borrow_for_callback_verifier(&self, installation: &BridgeInstallationRef) -> Result<(&[u8], &[u8]), ContractViolation>` | /// 同安装的registered CallbackVerificationPort verifier仅本次call借用raw_callback与verification_inputs；验证前不交owner，成功仍须current actor/target/action核验；禁止raw输出或缓存。 |


只读消费面：保持字段私有，不提供mutable getter或跳过factory；只借用safe字段/原private context，借用不逃逸本次call，不导出原始字节。

| 完整签名 | 中文Rustdoc / 副作用 |
|---|---|
| `pub fn reply(&self) -> &PrivateReplyContext<'call>` | /// 借用原reply字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn installation(&self) -> &BridgeInstallationRef` | /// 借用原installation字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn received_at(&self) -> &SafeInstant` | /// 借用原received_at字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |

不变量/禁止：不允许Debug/Clone/serde/Display/自由Error-source；constructor完整输入且仅结构核验，不创建authority；借用不跨本次call，IO前重新核current资格。

### TransientQualifiedMaterialHandle<'call>
归属`private_material.rs`；owner已准入材料的本次只读借用。
```rust
/// owner已准入材料的本次只读借用。
pub struct TransientQualifiedMaterialHandle<'call> {
    /// 材料瞬时字节。
    bytes: &'call [u8],
    /// exact source/version。
    source: SafeSourceVersionRef,
    /// 当前target/material/digest/附件资格。
    qualification: CurrentMaterialQualification,
    /// 本次读取scope。
    scope: SafeScopeRef,
}
```
| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| bytes | `&'call [u8]` | 材料瞬时字节；PrivateMaterialPort actual provider，不由ref合成 |
| source | `SafeSourceVersionRef` | exact source/version；same provider |
| qualification | `CurrentMaterialQualification` | 当前target/material/digest/附件资格；formal current owner |
| scope | `SafeScopeRef` | 本次读取scope；resolver-first material port |

| 类别 | 完整签名 | 中文Rustdoc / 参数、返回和副作用 |
|---|---|---|
| 工厂 | `pub fn from_parts(bytes: &'call [u8], source: SafeSourceVersionRef, qualification: CurrentMaterialQualification, scope: SafeScopeRef) -> Result<Self, ContractViolation>` | /// 校验并完整复制上述全部入参；不生成ID/时间/权限，无IO |
| 成员 | `pub fn assert_current(&self, current: &CurrentMaterialQualification, now: SafeInstant) -> Result<(), ContractViolation>` | /// same source/material/target/version及期限，失效立即拒绝 |
| 成员 | `pub fn borrow_for_qualified_owner(&self) -> &[u8]` | /// 仅受审owner codec消费，禁止调试/持久化/日志/通用API |


只读消费面：保持字段私有，不提供mutable getter或跳过factory；只借用safe字段/原private context，借用不逃逸本次call，不导出原始字节。

| 完整签名 | 中文Rustdoc / 副作用 |
|---|---|
| `pub fn source(&self) -> &SafeSourceVersionRef` | /// 借用原source字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn qualification(&self) -> &CurrentMaterialQualification` | /// 借用原qualification字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn scope(&self) -> &SafeScopeRef` | /// 借用原scope字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |

不变量/禁止：不允许Debug/Clone/serde/Display/自由Error-source；constructor完整输入且仅结构核验，不创建authority；借用不跨本次call，IO前重新核current资格。

### PrivateQualifiedPayload<'call>
归属`private_material.rs`；原获准projection的本次平台渲染借用。
```rust
/// 原获准projection的本次平台渲染借用。
pub struct PrivateQualifiedPayload<'call> {
    /// 实际获准渲染payload。
    bytes: &'call [u8],
    /// 原attempt/effect。
    attempt: AttemptEffectRef,
    /// 原plan/source/projection/target current资格。
    qualification: CurrentPresentationQualification,
    /// 本次payload交集窗口。
    validity: SafeValidityWindow,
}
```
| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| bytes | `&'call [u8]` | 实际获准渲染payload；PrivateMaterialPort+registered codec |
| attempt | `AttemptEffectRef` | 原attempt/effect；same local committed original |
| qualification | `CurrentPresentationQualification` | 原plan/source/projection/target current资格；actual ports |
| validity | `SafeValidityWindow` | 本次payload交集窗口；current source，不能续期 |

| 类别 | 完整签名 | 中文Rustdoc / 参数、返回和副作用 |
|---|---|---|
| 工厂 | `pub fn from_parts(bytes: &'call [u8], attempt: AttemptEffectRef, qualification: CurrentPresentationQualification, validity: SafeValidityWindow) -> Result<Self, ContractViolation>` | /// 校验并完整复制上述全部入参；不生成ID/时间/权限，无IO |
| 成员 | `pub fn assert_effect(&self, attempt: &AttemptEffectRef, now: SafeInstant) -> Result<(), ContractViolation>` | /// full same-effect/current/期限；已批准降级不得含action或敏感审批正文 |
| 成员 | `pub fn borrow_for_qualified_adapter(&self) -> &[u8]` | /// 仅registered outbound codec，SDK raw logging/retry必须禁用 |


只读消费面：保持字段私有，不提供mutable getter或跳过factory；只借用safe字段/原private context，借用不逃逸本次call，不导出原始字节。

| 完整签名 | 中文Rustdoc / 副作用 |
|---|---|
| `pub fn attempt(&self) -> &AttemptEffectRef` | /// 借用原attempt字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn qualification(&self) -> &CurrentPresentationQualification` | /// 借用原qualification字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn validity(&self) -> &SafeValidityWindow` | /// 借用原validity字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |

不变量/禁止：不允许Debug/Clone/serde/Display/自由Error-source；constructor完整输入且仅结构核验，不创建authority；借用不跨本次call，IO前重新核current资格。

### PrivateSecretHandle<'call>
归属`private_material.rs`；本次精确provider版本的secret借用。
```rust
/// 本次精确provider版本的secret借用。
pub struct PrivateSecretHandle<'call> {
    /// 原凭据字节。
    secret: &'call [u8],
    /// 本次installation/purpose/scope/route资格。
    use_context: QualifiedSecretUseContext,
    /// 实际provider版本。
    provider_revision: SafeRevision,
}
```
| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| secret | `&'call [u8]` | 原凭据字节；SecretResolutionPort actual provider |
| use_context | `QualifiedSecretUseContext` | 本次installation/purpose/scope/route资格；current provider/config |
| provider_revision | `SafeRevision` | 实际provider版本；same returned provider version |

| 类别 | 完整签名 | 中文Rustdoc / 参数、返回和副作用 |
|---|---|---|
| 工厂 | `pub fn from_parts(secret: &'call [u8], use_context: QualifiedSecretUseContext, provider_revision: SafeRevision) -> Result<Self, ContractViolation>` | /// 校验并完整复制上述全部入参；不生成ID/时间/权限，无IO |
| 成员 | `pub fn assert_use(&self, current: &QualifiedSecretUseContext, now: SafeInstant) -> Result<(), ContractViolation>` | /// 版本/用途/安装/route/期限exact，轮换/撤销每次重新核 |
| 成员 | `pub fn borrow_for_qualified_provider(&self) -> &[u8]` | /// 仅registered private provider消费，禁止任何字符串转换或公开输出 |


只读消费面：保持字段私有，不提供mutable getter或跳过factory；只借用safe字段/原private context，借用不逃逸本次call，不导出原始字节。

| 完整签名 | 中文Rustdoc / 副作用 |
|---|---|
| `pub fn use_context(&self) -> &QualifiedSecretUseContext` | /// 借用原use_context字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn provider_revision(&self) -> &SafeRevision` | /// 借用原provider_revision字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |

不变量/禁止：不允许Debug/Clone/serde/Display/自由Error-source；constructor完整输入且仅结构核验，不创建authority；借用不跨本次call，IO前重新核current资格。


## 4. 九类internal snapshot及读取依据


### LocalSnapshotReadBasis
归属`ports/local_snapshots.rs`；actual受权consistent local read来源。
```rust
/// actual受权consistent local read来源。
pub struct LocalSnapshotReadBasis {
    /// 实际对象及revision读取证明。
    hydration: Vec<LocalHydrationBasisRef>,
    /// 本次完整CAS条件。
    expected: ExpectedLocalRevisionSet,
    /// internal read准入依据。
    access: SafeAuthorityRef,
    /// 受权读上限。
    row_limit: u32,
    /// 实际读时刻。
    observed_at: SafeInstant,
}
```
| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| hydration | `Vec<LocalHydrationBasisRef>` | 实际对象及revision读取证明；各named repository；全对象覆盖 |
| expected | `ExpectedLocalRevisionSet` | 本次完整CAS条件；same read |
| access | `SafeAuthorityRef` | internal read准入依据；exact kind LocalSnapshotReadBasis；actual resolver/technical scope |
| row_limit | `u32` | 受权读上限；配置/maintenance current，非零 |
| observed_at | `SafeInstant` | 实际读时刻；trusted clock |

| 类别 | 完整签名 | 中文Rustdoc / 参数、返回和副作用 |
|---|---|---|
| 工厂 | `pub fn from_parts(hydration: Vec<LocalHydrationBasisRef>, expected: ExpectedLocalRevisionSet, access: SafeAuthorityRef, row_limit: u32, observed_at: SafeInstant) -> Result<Self, ContractViolation>` | /// 校验并完整复制上述全部入参；不生成ID/时间/权限，无IO |
| 成员 | `pub fn assert_closed(&self, subjects: &[BridgeViewSubjectRef]) -> Result<(), ContractViolation>` | /// subjects/proof/CAS完整无重复且行数不超上限，不能借ref反推read权限 |


只读消费面：保持字段私有，不提供mutable getter或跳过factory；公开可读取不等于可以日志/外显；Application须重新核验current资格并过滤。

| 完整签名 | 中文Rustdoc / 副作用 |
|---|---|
| `pub fn hydration(&self) -> &Vec<LocalHydrationBasisRef>` | /// 借用原hydration字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn expected(&self) -> &ExpectedLocalRevisionSet` | /// 借用原expected字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn access(&self) -> &SafeAuthorityRef` | /// 借用原access字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn row_limit(&self) -> &u32` | /// 借用原row_limit字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn observed_at(&self) -> &SafeInstant` | /// 借用原observed_at字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |

不变量/禁止：结构校验不授权；完整复制全部字段，缺正式来源拒绝。

### InstallationSnapshot
归属`ports/local_snapshots.rs`；InstallationSnapshot只代表一次local读取，不是public DTO。
```rust
/// InstallationSnapshot只代表一次local读取，不是public DTO。
pub struct InstallationSnapshot {
    /// actual配置对象。
    installation: BridgeInstallation,
    /// scope/版本/行上限完整来源。
    read_basis: LocalSnapshotReadBasis,
}
```
| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| installation | `BridgeInstallation` | actual配置对象；InstallationRepository |
| read_basis | `LocalSnapshotReadBasis` | scope/版本/行上限完整来源；same actual consistent read |

| 类别 | 完整签名 | 中文Rustdoc / 参数、返回和副作用 |
|---|---|---|
| 工厂 | `pub fn from_parts(installation: BridgeInstallation, read_basis: LocalSnapshotReadBasis) -> Result<Self, ContractViolation>` | /// 校验并完整复制上述全部入参；不生成ID/时间/权限，无IO |
| 成员 | `pub fn assert_closed(&self) -> Result<(), ContractViolation>` | /// all objects同scope/op/target关联，proof覆盖每对象/版本及bounded行数；不刷新外部资格 |


只读消费面：保持字段私有，不提供mutable getter或跳过factory；公开可读取不等于可以日志/外显；Application须重新核验current资格并过滤。

| 完整签名 | 中文Rustdoc / 副作用 |
|---|---|
| `pub fn installation(&self) -> &BridgeInstallation` | /// 借用原installation字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn read_basis(&self) -> &LocalSnapshotReadBasis` | /// 借用原read_basis字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |

不变量/禁止：只载local Domain对象/原op/actual read来源，不载raw/private/foreign truth副本；缺失是明确None，不能猜目标；无业务state或写入方法。

### AuthorizedMappingSnapshot
归属`ports/local_snapshots.rs`；AuthorizedMappingSnapshot只代表一次local读取，不是public DTO。
```rust
/// AuthorizedMappingSnapshot只代表一次local读取，不是public DTO。
pub struct AuthorizedMappingSnapshot {
    /// actual原relation。
    binding: ExternalBinding,
    /// 明确存在或欠缺账号mapping。
    identity: Option<ExternalIdentityMapping>,
    /// 明确位置mapping或欠缺。
    location: Option<ExternalLocationMapping>,
    /// 原change mapping或不适用。
    message: Option<ExternalMessageMapping>,
    /// scope/版本/行上限完整来源。
    read_basis: LocalSnapshotReadBasis,
}
```
| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| binding | `ExternalBinding` | actual原relation；MappingRepository |
| identity | `Option<ExternalIdentityMapping>` | 明确存在或欠缺账号mapping；same bounded read |
| location | `Option<ExternalLocationMapping>` | 明确位置mapping或欠缺；same read |
| message | `Option<ExternalMessageMapping>` | 原change mapping或不适用；same read |
| read_basis | `LocalSnapshotReadBasis` | scope/版本/行上限完整来源；same actual consistent read |

| 类别 | 完整签名 | 中文Rustdoc / 参数、返回和副作用 |
|---|---|---|
| 工厂 | `pub fn from_parts(binding: ExternalBinding, identity: Option<ExternalIdentityMapping>, location: Option<ExternalLocationMapping>, message: Option<ExternalMessageMapping>, read_basis: LocalSnapshotReadBasis) -> Result<Self, ContractViolation>` | /// 校验并完整复制上述全部入参；不生成ID/时间/权限，无IO |
| 成员 | `pub fn assert_closed(&self) -> Result<(), ContractViolation>` | /// all objects同scope/op/target关联，proof覆盖每对象/版本及bounded行数；不刷新外部资格 |


只读消费面：保持字段私有，不提供mutable getter或跳过factory；公开可读取不等于可以日志/外显；Application须重新核验current资格并过滤。

| 完整签名 | 中文Rustdoc / 副作用 |
|---|---|
| `pub fn binding(&self) -> &ExternalBinding` | /// 借用原binding字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn identity(&self) -> &Option<ExternalIdentityMapping>` | /// 借用原identity字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn location(&self) -> &Option<ExternalLocationMapping>` | /// 借用原location字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn message(&self) -> &Option<ExternalMessageMapping>` | /// 借用原message字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn read_basis(&self) -> &LocalSnapshotReadBasis` | /// 借用原read_basis字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |

不变量/禁止：只载local Domain对象/原op/actual read来源，不载raw/private/foreign truth副本；缺失是明确None，不能猜目标；无业务state或写入方法。

### InboundSnapshot
归属`ports/local_snapshots.rs`；InboundSnapshot只代表一次local读取，不是public DTO。
```rust
/// InboundSnapshot只代表一次local读取，不是public DTO。
pub struct InboundSnapshot {
    /// actual原inbound。
    record: InboundHandoffRecord,
    /// 原namespace dedup或缺口。
    dedup: Option<DedupRecord>,
    /// 原op/effect。
    original: OriginalOperationEffectRef,
    /// scope/版本/行上限完整来源。
    read_basis: LocalSnapshotReadBasis,
}
```
| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| record | `InboundHandoffRecord` | actual原inbound；InboundRepository |
| dedup | `Option<DedupRecord>` | 原namespace dedup或缺口；ContinuityRepository same-op read |
| original | `OriginalOperationEffectRef` | 原op/effect；record/dedup一致 |
| read_basis | `LocalSnapshotReadBasis` | scope/版本/行上限完整来源；same actual consistent read |

| 类别 | 完整签名 | 中文Rustdoc / 参数、返回和副作用 |
|---|---|---|
| 工厂 | `pub fn from_parts(record: InboundHandoffRecord, dedup: Option<DedupRecord>, original: OriginalOperationEffectRef, read_basis: LocalSnapshotReadBasis) -> Result<Self, ContractViolation>` | /// 校验并完整复制上述全部入参；不生成ID/时间/权限，无IO |
| 成员 | `pub fn assert_closed(&self) -> Result<(), ContractViolation>` | /// all objects同scope/op/target关联，proof覆盖每对象/版本及bounded行数；不刷新外部资格 |


只读消费面：保持字段私有，不提供mutable getter或跳过factory；公开可读取不等于可以日志/外显；Application须重新核验current资格并过滤。

| 完整签名 | 中文Rustdoc / 副作用 |
|---|---|
| `pub fn record(&self) -> &InboundHandoffRecord` | /// 借用原record字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn dedup(&self) -> &Option<DedupRecord>` | /// 借用原dedup字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn original(&self) -> &OriginalOperationEffectRef` | /// 借用原original字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn read_basis(&self) -> &LocalSnapshotReadBasis` | /// 借用原read_basis字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |

不变量/禁止：只载local Domain对象/原op/actual read来源，不载raw/private/foreign truth副本；缺失是明确None，不能猜目标；无业务state或写入方法。

### DeliverySnapshot
归属`ports/local_snapshots.rs`；DeliverySnapshot只代表一次local读取，不是public DTO。
```rust
/// DeliverySnapshot只代表一次local读取，不是public DTO。
pub struct DeliverySnapshot {
    /// 实际原plan或缺口。
    plan: Option<SafePresentationPlan>,
    /// actual原intent。
    intent: DeliveryIntent,
    /// 本次有限原attempt集合。
    attempts: Vec<DeliveryAttempt>,
    /// 本次known原receipt集合。
    receipts: Vec<PlatformReceipt>,
    /// 原op/effect。
    original: OriginalOperationEffectRef,
    /// scope/版本/行上限完整来源。
    read_basis: LocalSnapshotReadBasis,
}
```
| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| plan | `Option<SafePresentationPlan>` | 实际原plan或缺口；DeliveryRepository |
| intent | `DeliveryIntent` | actual原intent；same read |
| attempts | `Vec<DeliveryAttempt>` | 本次有限原attempt集合；bounded read，不是全量mirror |
| receipts | `Vec<PlatformReceipt>` | 本次known原receipt集合；same attempt/effect |
| original | `OriginalOperationEffectRef` | 原op/effect；existing intent |
| read_basis | `LocalSnapshotReadBasis` | scope/版本/行上限完整来源；same actual consistent read |

| 类别 | 完整签名 | 中文Rustdoc / 参数、返回和副作用 |
|---|---|---|
| 工厂 | `pub fn from_parts(plan: Option<SafePresentationPlan>, intent: DeliveryIntent, attempts: Vec<DeliveryAttempt>, receipts: Vec<PlatformReceipt>, original: OriginalOperationEffectRef, read_basis: LocalSnapshotReadBasis) -> Result<Self, ContractViolation>` | /// 校验并完整复制上述全部入参；不生成ID/时间/权限，无IO |
| 成员 | `pub fn assert_closed(&self) -> Result<(), ContractViolation>` | /// all objects同scope/op/target关联，proof覆盖每对象/版本及bounded行数；不刷新外部资格 |


只读消费面：保持字段私有，不提供mutable getter或跳过factory；公开可读取不等于可以日志/外显；Application须重新核验current资格并过滤。

| 完整签名 | 中文Rustdoc / 副作用 |
|---|---|
| `pub fn plan(&self) -> &Option<SafePresentationPlan>` | /// 借用原plan字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn intent(&self) -> &DeliveryIntent` | /// 借用原intent字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn attempts(&self) -> &Vec<DeliveryAttempt>` | /// 借用原attempts字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn receipts(&self) -> &Vec<PlatformReceipt>` | /// 借用原receipts字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn original(&self) -> &OriginalOperationEffectRef` | /// 借用原original字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn read_basis(&self) -> &LocalSnapshotReadBasis` | /// 借用原read_basis字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |

不变量/禁止：只载local Domain对象/原op/actual read来源，不载raw/private/foreign truth副本；缺失是明确None，不能猜目标；无业务state或写入方法。

### CallbackSnapshot
归属`ports/local_snapshots.rs`；CallbackSnapshot只代表一次local读取，不是public DTO。
```rust
/// CallbackSnapshot只代表一次local读取，不是public DTO。
pub struct CallbackSnapshot {
    /// 原action或不可用。
    action: Option<ExternalActionBinding>,
    /// actual原callback。
    record: CallbackHandoffRecord,
    /// 原owner op/effect。
    original: OriginalOperationEffectRef,
    /// scope/版本/行上限完整来源。
    read_basis: LocalSnapshotReadBasis,
}
```
| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| action | `Option<ExternalActionBinding>` | 原action或不可用；CallbackRepository |
| record | `CallbackHandoffRecord` | actual原callback；same read |
| original | `OriginalOperationEffectRef` | 原owner op/effect；same record/dedup |
| read_basis | `LocalSnapshotReadBasis` | scope/版本/行上限完整来源；same actual consistent read |

| 类别 | 完整签名 | 中文Rustdoc / 参数、返回和副作用 |
|---|---|---|
| 工厂 | `pub fn from_parts(action: Option<ExternalActionBinding>, record: CallbackHandoffRecord, original: OriginalOperationEffectRef, read_basis: LocalSnapshotReadBasis) -> Result<Self, ContractViolation>` | /// 校验并完整复制上述全部入参；不生成ID/时间/权限，无IO |
| 成员 | `pub fn assert_closed(&self) -> Result<(), ContractViolation>` | /// all objects同scope/op/target关联，proof覆盖每对象/版本及bounded行数；不刷新外部资格 |


只读消费面：保持字段私有，不提供mutable getter或跳过factory；公开可读取不等于可以日志/外显；Application须重新核验current资格并过滤。

| 完整签名 | 中文Rustdoc / 副作用 |
|---|---|
| `pub fn action(&self) -> &Option<ExternalActionBinding>` | /// 借用原action字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn record(&self) -> &CallbackHandoffRecord` | /// 借用原record字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn original(&self) -> &OriginalOperationEffectRef` | /// 借用原original字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn read_basis(&self) -> &LocalSnapshotReadBasis` | /// 借用原read_basis字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |

不变量/禁止：只载local Domain对象/原op/actual read来源，不载raw/private/foreign truth副本；缺失是明确None，不能猜目标；无业务state或写入方法。

### ContinuitySnapshot
归属`ports/local_snapshots.rs`；ContinuitySnapshot只代表一次local读取，不是public DTO。
```rust
/// ContinuitySnapshot只代表一次local读取，不是public DTO。
pub struct ContinuitySnapshot {
    /// 本次受限dedup集合。
    dedup: Vec<DedupRecord>,
    /// stage独立cursor集合。
    cursors: Vec<StreamCursor>,
    /// 原gap集合。
    gaps: Vec<GapRecord>,
    /// 实际原recovery集合。
    recoveries: Vec<RecoveryRecord>,
    /// scope/版本/行上限完整来源。
    read_basis: LocalSnapshotReadBasis,
}
```
| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| dedup | `Vec<DedupRecord>` | 本次受限dedup集合；ContinuityRepository |
| cursors | `Vec<StreamCursor>` | stage独立cursor集合；same scope bounded read |
| gaps | `Vec<GapRecord>` | 原gap集合；same stream/epoch |
| recoveries | `Vec<RecoveryRecord>` | 实际原recovery集合；same bounded read |
| read_basis | `LocalSnapshotReadBasis` | scope/版本/行上限完整来源；same actual consistent read |

| 类别 | 完整签名 | 中文Rustdoc / 参数、返回和副作用 |
|---|---|---|
| 工厂 | `pub fn from_parts(dedup: Vec<DedupRecord>, cursors: Vec<StreamCursor>, gaps: Vec<GapRecord>, recoveries: Vec<RecoveryRecord>, read_basis: LocalSnapshotReadBasis) -> Result<Self, ContractViolation>` | /// 校验并完整复制上述全部入参；不生成ID/时间/权限，无IO |
| 成员 | `pub fn assert_closed(&self) -> Result<(), ContractViolation>` | /// all objects同scope/op/target关联，proof覆盖每对象/版本及bounded行数；不刷新外部资格 |


只读消费面：保持字段私有，不提供mutable getter或跳过factory；公开可读取不等于可以日志/外显；Application须重新核验current资格并过滤。

| 完整签名 | 中文Rustdoc / 副作用 |
|---|---|
| `pub fn dedup(&self) -> &Vec<DedupRecord>` | /// 借用原dedup字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn cursors(&self) -> &Vec<StreamCursor>` | /// 借用原cursors字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn gaps(&self) -> &Vec<GapRecord>` | /// 借用原gaps字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn recoveries(&self) -> &Vec<RecoveryRecord>` | /// 借用原recoveries字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn read_basis(&self) -> &LocalSnapshotReadBasis` | /// 借用原read_basis字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |

不变量/禁止：只载local Domain对象/原op/actual read来源，不载raw/private/foreign truth副本；缺失是明确None，不能猜目标；无业务state或写入方法。

### LaneSnapshot
归属`ports/local_snapshots.rs`；LaneSnapshot只代表一次local读取，不是public DTO。
```rust
/// LaneSnapshot只代表一次local读取，不是public DTO。
pub struct LaneSnapshot {
    /// actual原lane。
    lane: DispatchLane,
    /// 本地due候选或无候选。
    candidate: Option<DeliveryIntent>,
    /// 原held/unknown attempt。
    active_attempt: Option<DeliveryAttempt>,
    /// scope/版本/行上限完整来源。
    read_basis: LocalSnapshotReadBasis,
}
```
| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| lane | `DispatchLane` | actual原lane；LaneRepository |
| candidate | `Option<DeliveryIntent>` | 本地due候选或无候选；local read，不授current派发许可 |
| active_attempt | `Option<DeliveryAttempt>` | 原held/unknown attempt；same lane/effect |
| read_basis | `LocalSnapshotReadBasis` | scope/版本/行上限完整来源；same actual consistent read |

| 类别 | 完整签名 | 中文Rustdoc / 参数、返回和副作用 |
|---|---|---|
| 工厂 | `pub fn from_parts(lane: DispatchLane, candidate: Option<DeliveryIntent>, active_attempt: Option<DeliveryAttempt>, read_basis: LocalSnapshotReadBasis) -> Result<Self, ContractViolation>` | /// 校验并完整复制上述全部入参；不生成ID/时间/权限，无IO |
| 成员 | `pub fn assert_closed(&self) -> Result<(), ContractViolation>` | /// all objects同scope/op/target关联，proof覆盖每对象/版本及bounded行数；不刷新外部资格 |


只读消费面：保持字段私有，不提供mutable getter或跳过factory；公开可读取不等于可以日志/外显；Application须重新核验current资格并过滤。

| 完整签名 | 中文Rustdoc / 副作用 |
|---|---|
| `pub fn lane(&self) -> &DispatchLane` | /// 借用原lane字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn candidate(&self) -> &Option<DeliveryIntent>` | /// 借用原candidate字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn active_attempt(&self) -> &Option<DeliveryAttempt>` | /// 借用原active_attempt字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn read_basis(&self) -> &LocalSnapshotReadBasis` | /// 借用原read_basis字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |

不变量/禁止：只载local Domain对象/原op/actual read来源，不载raw/private/foreign truth副本；缺失是明确None，不能猜目标；无业务state或写入方法。

### SafeHandoffSnapshot
归属`ports/local_snapshots.rs`；SafeHandoffSnapshot只代表一次local读取，不是public DTO。
```rust
/// SafeHandoffSnapshot只代表一次local读取，不是public DTO。
pub struct SafeHandoffSnapshot {
    /// 真实原producer。
    audit: SafeAuditRecord,
    /// 实际canonical交接或未建立。
    handoff: Option<SafeHandoffRecord>,
    /// 有handoff则必Some原op。
    original: Option<OriginalOperationEffectRef>,
    /// scope/版本/行上限完整来源。
    read_basis: LocalSnapshotReadBasis,
}
```
| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| audit | `SafeAuditRecord` | 真实原producer；SafeTraceRepository |
| handoff | `Option<SafeHandoffRecord>` | 实际canonical交接或未建立；same safe read |
| original | `Option<OriginalOperationEffectRef>` | 有handoff则必Some原op；actual SafeTraceRepository本地handoff/result读取 |
| read_basis | `LocalSnapshotReadBasis` | scope/版本/行上限完整来源；same actual consistent read |

| 类别 | 完整签名 | 中文Rustdoc / 参数、返回和副作用 |
|---|---|---|
| 工厂 | `pub fn from_parts(audit: SafeAuditRecord, handoff: Option<SafeHandoffRecord>, original: Option<OriginalOperationEffectRef>, read_basis: LocalSnapshotReadBasis) -> Result<Self, ContractViolation>` | /// 校验并完整复制上述全部入参；不生成ID/时间/权限，无IO |
| 成员 | `pub fn assert_closed(&self) -> Result<(), ContractViolation>` | /// all objects同scope/op/target关联，proof覆盖每对象/版本及bounded行数；不刷新外部资格 |


只读消费面：保持字段私有，不提供mutable getter或跳过factory；公开可读取不等于可以日志/外显；Application须重新核验current资格并过滤。

| 完整签名 | 中文Rustdoc / 副作用 |
|---|---|
| `pub fn audit(&self) -> &SafeAuditRecord` | /// 借用原audit字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn handoff(&self) -> &Option<SafeHandoffRecord>` | /// 借用原handoff字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn original(&self) -> &Option<OriginalOperationEffectRef>` | /// 借用原original字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn read_basis(&self) -> &LocalSnapshotReadBasis` | /// 借用原read_basis字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |

不变量/禁止：只载local Domain对象/原op/actual read来源，不载raw/private/foreign truth副本；缺失是明确None，不能猜目标；无业务state或写入方法。

### OperationSnapshot

归属`ports/local_snapshots.rs`；Application-only，SafeTraceRepository从原immutable stored-result索引按BridgeOperationRef精确取得；不新增业务truth或持久化投影。

```rust
/// 已提交原operation的完整安全结果root；不授重执行权。
pub struct OperationSnapshot {
    /// stored result实际完整original，不能从id拼kind/effect。
    original: OriginalOperationEffectRef,
    /// same original全部已提交安全结果；非空、按原result identity去重排序。
    results: Vec<SafeOriginalResultRef>,
    /// same consistent read的hydration/CAS/受权scope与完整性预算。
    read_basis: LocalSnapshotReadBasis,
}
```

| 字段 | 来源 / required与校验 |
|---|---|
| original | actual原result/operation索引；请求operation须与original.operation一致；多种effect/kind冲突不得取first |
| results | 正式get_result同源完整材料；每项original一致；超过预算Unavailable，不静默截断；无结果且已知存在注册行为Unavailable |
| read_basis | exact consistent baseline，覆盖全部result行、权限/scope/版本；不能生成用于授权的假hydration |

| 完整签名 | 中文Rustdoc |
|---|---|
| `pub fn from_parts(original: OriginalOperationEffectRef, results: Vec<SafeOriginalResultRef>, read_basis: LocalSnapshotReadBasis) -> Result<Self, ContractViolation>` | /// 完整复制输入并核same original/非空/去重排序/basis覆盖；零IO、ID、权限。 |
| `pub fn assert_closed(&self) -> Result<(), ContractViolation>` | /// 核上述完整关联；Missing/bounded partial不可作为完整root。 |
| `pub fn original(&self) -> &OriginalOperationEffectRef` | /// 纯读原定位，不授执行或披露权。 |
| `pub fn results(&self) -> &Vec<SafeOriginalResultRef>` | /// 纯读实际stored安全结果，外显仍须current裁剪。 |
| `pub fn read_basis(&self) -> &LocalSnapshotReadBasis` | /// 纯读原consistent baseline。 |

### PresentationSnapshot

归属`ports/local_snapshots.rs`；不创造缺失intent，不以plan的Ready推平台已投递。

```rust
/// standalone安全presentation读取root。
pub struct PresentationSnapshot {
    /// actual已提交完整plan。
    plan: SafePresentationPlan,
    /// 同read的原plan版本/权限/预算证明。
    read_basis: LocalSnapshotReadBasis,
}
```

| 完整签名 | 中文Rustdoc |
|---|---|
| `pub fn from_parts(plan: SafePresentationPlan, read_basis: LocalSnapshotReadBasis) -> Result<Self, ContractViolation>` | /// 复制全部字段；basis覆盖原plan及revision；零IO/授权。 |
| `pub fn assert_closed(&self) -> Result<(), ContractViolation>` | /// 检查same plan/scope/版本与原basis完整；不刷新资格。 |
| `pub fn plan(&self) -> &SafePresentationPlan` | /// 纯读原完整plan，不生成intent。 |
| `pub fn read_basis(&self) -> &LocalSnapshotReadBasis` | /// 纯读actual baseline。 |

### ActionSnapshot

归属`ports/local_snapshots.rs`；C05初绑后即可安全读取，不需要伪callback或owner Decision。

```rust
/// standalone外部action读取root，非审批truth。
pub struct ActionSnapshot {
    /// actual已提交完整action binding，保原source/one-use Slot。
    action: ExternalActionBinding,
    /// 同read的原action版本/权限/预算证明。
    read_basis: LocalSnapshotReadBasis,
}
```

| 完整签名 | 中文Rustdoc |
|---|---|
| `pub fn from_parts(action: ExternalActionBinding, read_basis: LocalSnapshotReadBasis) -> Result<Self, ContractViolation>` | /// 复制全部字段；basis覆盖action及revision；零IO/审批/授权。 |
| `pub fn assert_closed(&self) -> Result<(), ContractViolation>` | /// 核same action/scope/版本/basis，不消费one-use。 |
| `pub fn action(&self) -> &ExternalActionBinding` | /// 纯读actual action，不创建callback。 |
| `pub fn read_basis(&self) -> &LocalSnapshotReadBasis` | /// 纯读actual baseline。 |

### ExistingLocalSnapshot
归属`ports/local_snapshots.rs`；受权修订后十一variant的internal只读联合，非独立状态机。
```rust
/// 十一variant的完整internal只读联合，不是wire或业务truth。
pub enum ExistingLocalSnapshot {
    /// 实际已提交operation journal完整安全root，不是全局状态。
    Operation(OperationSnapshot),
    /// 无intent也可读取的原plan root。
    Presentation(PresentationSnapshot),
    /// 无callback也可读取的原action root。
    Action(ActionSnapshot),
    /// 该族actual consistent local snapshot，不是wire。
    Installation(InstallationSnapshot),
    /// 该族actual consistent local snapshot，不是wire。
    AuthorizedMapping(AuthorizedMappingSnapshot),
    /// 该族actual consistent local snapshot，不是wire。
    Inbound(InboundSnapshot),
    /// 该族actual consistent local snapshot，不是wire。
    Delivery(DeliverySnapshot),
    /// 该族actual consistent local snapshot，不是wire。
    Callback(CallbackSnapshot),
    /// 该族actual consistent local snapshot，不是wire。
    Continuity(ContinuitySnapshot),
    /// 该族actual consistent local snapshot，不是wire。
    Lane(LaneSnapshot),
    /// 该族actual consistent local snapshot，不是wire。
    SafeHandoff(SafeHandoffSnapshot),
}
```
| 变体 | Rustdoc注释 / 载荷语义 | 允许来源 | 允许去向 |
|---|---|---|---|
| Installation | 该族actual consistent local snapshot，不是wire；`InstallationSnapshot` | 所属正式source/纯组装 | 不适用，无lifecycle |
| AuthorizedMapping | 该族actual consistent local snapshot，不是wire；`AuthorizedMappingSnapshot` | 所属正式source/纯组装 | 不适用，无lifecycle |
| Inbound | 该族actual consistent local snapshot，不是wire；`InboundSnapshot` | 所属正式source/纯组装 | 不适用，无lifecycle |
| Delivery | 该族actual consistent local snapshot，不是wire；`DeliverySnapshot` | 所属正式source/纯组装 | 不适用，无lifecycle |
| Callback | 该族actual consistent local snapshot，不是wire；`CallbackSnapshot` | 所属正式source/纯组装 | 不适用，无lifecycle |
| Continuity | 该族actual consistent local snapshot，不是wire；`ContinuitySnapshot` | 所属正式source/纯组装 | 不适用，无lifecycle |
| Lane | 该族actual consistent local snapshot，不是wire；`LaneSnapshot` | 所属正式source/纯组装 | 不适用，无lifecycle |
| SafeHandoff | 该族actual consistent local snapshot，不是wire；`SafeHandoffSnapshot` | 所属正式source/纯组装 | 不适用，无lifecycle |
| Operation | actual已提交operation/results/read_basis；`OperationSnapshot` | SafeTraceRepository | 只current安全投影 |
| Presentation | 原plan/read_basis；`PresentationSnapshot` | DeliveryRepository | 只current安全投影 |
| Action | 原action/read_basis；`ActionSnapshot` | CallbackRepository | 只current安全投影 |

| 类别 | 完整签名 | 中文Rustdoc |
|---|---|---|
| 工厂 | `pub fn validate(self) -> Result<Self, ContractViolation>` | /// 核载荷一致和finite分支，拒绝未知标签；不授authority。 |

ExistingLocalSnapshot的factory为exact variant加validate，member只`pub fn read_basis(&self) -> &LocalSnapshotReadBasis`（///纯读actual来源，零write/refresh）；根据variant从内含snapshot取唯一basis，不能由用户selector合成scope。



## 5. staged mutation、失效、原结果与visibility


### PreparedLocalChange
归属`local_mutation.rs`；只允许本仓十九模型的安全write set。
```rust
/// 只允许本仓十九模型的安全write set。
pub enum PreparedLocalChange {
    /// 该对象纯内存候选变化，不是已提交truth。
    BridgeInstallation(BridgeInstallation),
    /// 该对象纯内存候选变化，不是已提交truth。
    ExternalBinding(ExternalBinding),
    /// 该对象纯内存候选变化，不是已提交truth。
    ExternalIdentityMapping(ExternalIdentityMapping),
    /// 该对象纯内存候选变化，不是已提交truth。
    ExternalLocationMapping(ExternalLocationMapping),
    /// 该对象纯内存候选变化，不是已提交truth。
    ExternalMessageMapping(ExternalMessageMapping),
    /// 该对象纯内存候选变化，不是已提交truth。
    InboundHandoffRecord(InboundHandoffRecord),
    /// 该对象纯内存候选变化，不是已提交truth。
    SafePresentationPlan(SafePresentationPlan),
    /// 该对象纯内存候选变化，不是已提交truth。
    DeliveryIntent(DeliveryIntent),
    /// 该对象纯内存候选变化，不是已提交truth。
    DeliveryAttempt(DeliveryAttempt),
    /// 该对象纯内存候选变化，不是已提交truth。
    PlatformReceipt(PlatformReceipt),
    /// 该对象纯内存候选变化，不是已提交truth。
    ExternalActionBinding(ExternalActionBinding),
    /// 该对象纯内存候选变化，不是已提交truth。
    CallbackHandoffRecord(CallbackHandoffRecord),
    /// 该对象纯内存候选变化，不是已提交truth。
    DedupRecord(DedupRecord),
    /// 该对象纯内存候选变化，不是已提交truth。
    StreamCursor(StreamCursor),
    /// 该对象纯内存候选变化，不是已提交truth。
    GapRecord(GapRecord),
    /// 该对象纯内存候选变化，不是已提交truth。
    DispatchLane(DispatchLane),
    /// 该对象纯内存候选变化，不是已提交truth。
    RecoveryRecord(RecoveryRecord),
    /// 该对象纯内存候选变化，不是已提交truth。
    SafeAuditRecord(SafeAuditRecord),
    /// 该对象纯内存候选变化，不是已提交truth。
    SafeHandoffRecord(SafeHandoffRecord),
}
```
| 变体 | Rustdoc注释 / 载荷语义 | 允许来源 | 允许去向 |
|---|---|---|---|
| BridgeInstallation | 该对象纯内存候选变化，不是已提交truth；`BridgeInstallation` | 所属正式source/纯组装 | 不适用，无lifecycle |
| ExternalBinding | 该对象纯内存候选变化，不是已提交truth；`ExternalBinding` | 所属正式source/纯组装 | 不适用，无lifecycle |
| ExternalIdentityMapping | 该对象纯内存候选变化，不是已提交truth；`ExternalIdentityMapping` | 所属正式source/纯组装 | 不适用，无lifecycle |
| ExternalLocationMapping | 该对象纯内存候选变化，不是已提交truth；`ExternalLocationMapping` | 所属正式source/纯组装 | 不适用，无lifecycle |
| ExternalMessageMapping | 该对象纯内存候选变化，不是已提交truth；`ExternalMessageMapping` | 所属正式source/纯组装 | 不适用，无lifecycle |
| InboundHandoffRecord | 该对象纯内存候选变化，不是已提交truth；`InboundHandoffRecord` | 所属正式source/纯组装 | 不适用，无lifecycle |
| SafePresentationPlan | 该对象纯内存候选变化，不是已提交truth；`SafePresentationPlan` | 所属正式source/纯组装 | 不适用，无lifecycle |
| DeliveryIntent | 该对象纯内存候选变化，不是已提交truth；`DeliveryIntent` | 所属正式source/纯组装 | 不适用，无lifecycle |
| DeliveryAttempt | 该对象纯内存候选变化，不是已提交truth；`DeliveryAttempt` | 所属正式source/纯组装 | 不适用，无lifecycle |
| PlatformReceipt | 该对象纯内存候选变化，不是已提交truth；`PlatformReceipt` | 所属正式source/纯组装 | 不适用，无lifecycle |
| ExternalActionBinding | 该对象纯内存候选变化，不是已提交truth；`ExternalActionBinding` | 所属正式source/纯组装 | 不适用，无lifecycle |
| CallbackHandoffRecord | 该对象纯内存候选变化，不是已提交truth；`CallbackHandoffRecord` | 所属正式source/纯组装 | 不适用，无lifecycle |
| DedupRecord | 该对象纯内存候选变化，不是已提交truth；`DedupRecord` | 所属正式source/纯组装 | 不适用，无lifecycle |
| StreamCursor | 该对象纯内存候选变化，不是已提交truth；`StreamCursor` | 所属正式source/纯组装 | 不适用，无lifecycle |
| GapRecord | 该对象纯内存候选变化，不是已提交truth；`GapRecord` | 所属正式source/纯组装 | 不适用，无lifecycle |
| DispatchLane | 该对象纯内存候选变化，不是已提交truth；`DispatchLane` | 所属正式source/纯组装 | 不适用，无lifecycle |
| RecoveryRecord | 该对象纯内存候选变化，不是已提交truth；`RecoveryRecord` | 所属正式source/纯组装 | 不适用，无lifecycle |
| SafeAuditRecord | 该对象纯内存候选变化，不是已提交truth；`SafeAuditRecord` | 所属正式source/纯组装 | 不适用，无lifecycle |
| SafeHandoffRecord | 该对象纯内存候选变化，不是已提交truth；`SafeHandoffRecord` | 所属正式source/纯组装 | 不适用，无lifecycle |

| 类别 | 完整签名 | 中文Rustdoc |
|---|---|---|
| 工厂 | `pub fn validate(self) -> Result<Self, ContractViolation>` | /// 核载荷一致和finite分支，拒绝未知标签；不授authority。 |


### NonRecursiveObservationQualification

归属`local_mutation.rs`；Application-only。正式source规则给出的原handoff结果/维护审计排除资格，不是本地config fallback，不创建Observability准入。

```rust
/// 仅原consumer交接生命周期的非递归审计规则。
pub struct NonRecursiveObservationQualification {
    /// 原canonical/consumer operation，不得换新producer。
    original: OriginalHandoffOperationRef,
    /// exact本次原handoff及关联recovery/result受权主体集合。
    subjects: AuthorizedSafeSubjectRefSet,
    /// 正式owner规则身份/版本/scope，不能用任意maintenance ref代替。
    rule: SafeAuthorityRef,
    /// current规则适用窗口。
    validity: SafeValidityWindow,
}
```

| 完整签名 | 中文Rustdoc |
|---|---|
| `pub fn from_parts(original: OriginalHandoffOperationRef, subjects: AuthorizedSafeSubjectRefSet, rule: SafeAuthorityRef, validity: SafeValidityWindow) -> Result<Self, ContractViolation>` | /// 完整复制四字段；rule本地exact kind NonRecursiveObservationQualification且同正式source/原handoff scope；factory零授权。 |
| `pub fn assert_scope(&self, original: &OriginalHandoffOperationRef, subjects: &AuthorizedSafeSubjectRefSet, now: SafeInstant) -> Result<(), ContractViolation>` | /// 核same原operation/全部拟写subjects被formal集合覆盖及current窗口；仅交集不足，拒绝scope扩大。 |
| `pub fn original(&self) -> &OriginalHandoffOperationRef` | /// 纯读原交接定位。 |
| `pub fn subjects(&self) -> &AuthorizedSafeSubjectRefSet` | /// 纯读原受权主体。 |
| `pub fn rule(&self) -> &SafeAuthorityRef` | /// 纯读formal rule，不授新producer权。 |
| `pub fn validity(&self) -> &SafeValidityWindow` | /// 纯读原窗口。 |

本地kind登记复用本卡完整名称`NonRecursiveObservationQualification`，不新增foreign规则名或声称Observability已有对应kind。`assert_scope`要求实际拟写主体集合是正式规则授权集合的子集（含原handoff、关联recovery/result/dedup/audit），不是只要有交集就通过；本次local original须能由actual关联行回指`original`。若正式规则不覆盖claim/resume/block等维护阶段，相应阶段也不得默认免producer；formal producer map/rule缺失仍NotEstablished。

### MutationObservationRequirement
归属`local_mutation.rs`；producer门禁须正式来源，不默认audit-only。
```rust
/// producer门禁须正式来源，不默认audit-only。
pub enum MutationObservationRequirement {
    /// 正式非递归原handoff结果/维护规则；local audit必需，但不创建canonical/outbox/O01。
    NonRecursiveResultOnly(NonRecursiveObservationQualification),
    /// 当前mandatory schema/canonical/admission条件，缺一阻对应mutation/IO。
    Mandatory(MandatoryObservationQualification),
    /// owner允许且实际canonical具备的条件交接。
    OptionalQualified(MandatoryObservationQualification),
    /// owner明确不mandatory且许可audit-only；无every-mutation outbox。
    OwnerPermitsAuditOnly(QualificationMaintenanceBasisRef),
}
```
| 变体 | Rustdoc注释 / 载荷语义 | 允许来源 | 允许去向 |
|---|---|---|---|
| Mandatory | 当前mandatory schema/canonical/admission条件，缺一阻对应mutation/IO；`MandatoryObservationQualification` | 所属正式source/纯组装 | 不适用，无lifecycle |
| OptionalQualified | owner允许且实际canonical具备的条件交接；`MandatoryObservationQualification` | 所属正式source/纯组装 | 不适用，无lifecycle |
| OwnerPermitsAuditOnly | owner明确不mandatory且许可audit-only；无every-mutation outbox；`QualificationMaintenanceBasisRef` | 所属正式source/纯组装 | 不适用，无lifecycle |
| NonRecursiveResultOnly | formal recursion exclusion只覆盖原handoff结果/维护；`NonRecursiveObservationQualification` | SafeObservationPort.qualify_nonrecursive | 本地audit/seed/原handoff CAS，handoff=None，零新canonical/O01 |

| 类别 | 完整签名 | 中文Rustdoc |
|---|---|---|
| 工厂 | `pub fn validate(self) -> Result<Self, ContractViolation>` | /// 核载荷一致和finite分支，拒绝未知标签；不授authority。 |


### PreparedResultPayload
归属`local_mutation.rs`；提交前只准备result材料。
```rust
/// 提交前只准备result材料。
pub enum PreparedResultPayload {
    /// 仅同UoW mutation身份，driver成功commit后才形成Committed ref。
    LocalMutation(LocalMutationRef),
    /// 实际已知安全阶段结果，不预填未来owner/platform/consumer accepted。
    Known(StoredResultPayload),
}
```
| 变体 | Rustdoc注释 / 载荷语义 | 允许来源 | 允许去向 |
|---|---|---|---|
| LocalMutation | 仅同UoW mutation身份，driver成功commit后才形成Committed ref；`LocalMutationRef` | 所属正式source/纯组装 | 不适用，无lifecycle |
| Known | 实际已知安全阶段结果，不预填未来owner/platform/consumer accepted；`StoredResultPayload` | 所属正式source/纯组装 | 不适用，无lifecycle |

| 类别 | 完整签名 | 中文Rustdoc |
|---|---|---|
| 工厂 | `pub fn validate(self) -> Result<Self, ContractViolation>` | /// 核载荷一致和finite分支，拒绝未知标签；不授authority。 |


### StoredResultReuseDecision
归属`result_mapping.rs`；原结果复用决定不运行新效果。
```rust
/// 原结果复用决定不运行新效果。
pub enum StoredResultReuseDecision {
    /// 当前key无原record，只允许后续qualified本地接管，不授外呼。
    FreshReservationAllowed,
    /// 同meaning原结果当前可见复用。
    Visible(BridgeLocalView),
    /// 原结果存在但当前不许披露。
    NotDisclosed(SafeReasonCode),
    /// 已reserved或未知，无结果不重新执行。
    OriginalPending(OriginalOperationEffectRef),
    /// 同key变义，原record不覆盖。
    Conflict(SafeReasonCode),
    /// 去重/恢复窗口过期，不许可换新op。
    Expired(SafeReasonCode),
    /// 当前正式资格/读取不可用，安全停。
    Unavailable(SafeReasonCode),
}
```
| 变体 | Rustdoc注释 / 载荷语义 | 允许来源 | 允许去向 |
|---|---|---|---|
| FreshReservationAllowed | 当前key无原record，只允许后续qualified本地接管，不授外呼 | 所属正式source/纯组装 | 不适用，无lifecycle |
| Visible | 同meaning原结果当前可见复用；`BridgeLocalView` | 所属正式source/纯组装 | 不适用，无lifecycle |
| NotDisclosed | 原结果存在但当前不许披露；`SafeReasonCode` | 所属正式source/纯组装 | 不适用，无lifecycle |
| OriginalPending | 已reserved或未知，无结果不重新执行；`OriginalOperationEffectRef` | 所属正式source/纯组装 | 不适用，无lifecycle |
| Conflict | 同key变义，原record不覆盖；`SafeReasonCode` | 所属正式source/纯组装 | 不适用，无lifecycle |
| Expired | 去重/恢复窗口过期，不许可换新op；`SafeReasonCode` | 所属正式source/纯组装 | 不适用，无lifecycle |
| Unavailable | 当前正式资格/读取不可用，安全停；`SafeReasonCode` | 所属正式source/纯组装 | 不适用，无lifecycle |

| 类别 | 完整签名 | 中文Rustdoc |
|---|---|---|
| 工厂 | `pub fn validate(self) -> Result<Self, ContractViolation>` | /// 核载荷一致和finite分支，拒绝未知标签；不授authority。 |


### IngressVerificationResult
归属`ports/inbound.rs`；safe验证结果不包含private context。
```rust
/// safe验证结果不包含private context。
pub enum IngressVerificationResult {
    /// actual来源完整qualified，不授内部owner权。
    Verified(QualifiedIngressContext),
    /// finite拒绝及协议ACK计划。
    Rejected(VerificationFailure),
    /// 来源/能力不能建立，不以空safe_source伪造verified。
    Unavailable(VerificationFailure),
}
```
| 变体 | Rustdoc注释 / 载荷语义 | 允许来源 | 允许去向 |
|---|---|---|---|
| Verified | actual来源完整qualified，不授内部owner权；`QualifiedIngressContext` | 所属正式source/纯组装 | 不适用，无lifecycle |
| Rejected | finite拒绝及协议ACK计划；`VerificationFailure` | 所属正式source/纯组装 | 不适用，无lifecycle |
| Unavailable | 来源/能力不能建立，不以空safe_source伪造verified；`VerificationFailure` | 所属正式source/纯组装 | 不适用，无lifecycle |

| 类别 | 完整签名 | 中文Rustdoc |
|---|---|---|
| 工厂 | `pub fn validate(self) -> Result<Self, ContractViolation>` | /// 核载荷一致和finite分支，拒绝未知标签；不授authority。 |


### MandatoryObservationQualification
归属`local_mutation.rs`；实际producer条件preflight资格，不是consumer accepted。
```rust
/// 实际producer条件preflight资格，不是consumer accepted。
pub struct MandatoryObservationQualification {
    /// actual qualified canonical ref。
    canonical: CanonicalSafeMaterialRef,
    /// 实际consumer准入。
    admission: ProducerAdmissionRef,
    /// 明确producer schema。
    schema: SafeProducerSchemaRevision,
    /// 该mutation/IO适用scope。
    scope: SafeScopeRef,
    /// preflight交集期限。
    validity: SafeValidityWindow,
}
```
| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| canonical | `CanonicalSafeMaterialRef` | actual qualified canonical ref；SafeObservationPort |
| admission | `ProducerAdmissionRef` | 实际consumer准入；Observability current |
| schema | `SafeProducerSchemaRevision` | 明确producer schema；same canonical/admission |
| scope | `SafeScopeRef` | 该mutation/IO适用scope；current producer rule |
| validity | `SafeValidityWindow` | preflight交集期限；actual current sources |

| 类别 | 完整签名 | 中文Rustdoc / 参数、返回和副作用 |
|---|---|---|
| 工厂 | `pub fn from_parts(canonical: CanonicalSafeMaterialRef, admission: ProducerAdmissionRef, schema: SafeProducerSchemaRevision, scope: SafeScopeRef, validity: SafeValidityWindow) -> Result<Self, ContractViolation>` | /// 校验并完整复制上述全部入参；不生成ID/时间/权限，无IO |
| 成员 | `pub fn assert_current(&self, now: SafeInstant) -> Result<(), ContractViolation>` | /// 缺准入/schema/material窗口立即拒绝，不能默认audit-only |


只读消费面：保持字段私有，不提供mutable getter或跳过factory；公开可读取不等于可以日志/外显；Application须重新核验current资格并过滤。

| 完整签名 | 中文Rustdoc / 副作用 |
|---|---|
| `pub fn canonical(&self) -> &CanonicalSafeMaterialRef` | /// 借用原canonical字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn admission(&self) -> &ProducerAdmissionRef` | /// 借用原admission字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn schema(&self) -> &SafeProducerSchemaRevision` | /// 借用原schema字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn scope(&self) -> &SafeScopeRef` | /// 借用原scope字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn validity(&self) -> &SafeValidityWindow` | /// 借用原validity字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |

不变量/禁止：结构校验不授权；完整复制全部字段，缺正式来源拒绝。

### PreparedStoredResultSeed
归属`local_mutation.rs`；同UoW的安全result准备材料。
```rust
/// 同UoW的安全result准备材料。
pub struct PreparedStoredResultSeed {
    /// 技术result identity。
    result_id: LocalObjectId,
    /// 原op/effect。
    original: OriginalOperationEffectRef,
    /// 原入口结果族。
    kind: BridgeStoredResultKind,
    /// 准备材料或actual known阶段。
    payload: PreparedResultPayload,
    /// 正式结果scope。
    scope: SafeScopeRef,
}
```
| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| result_id | `LocalObjectId` | 技术result identity；首次UoW生成/原ID |
| original | `OriginalOperationEffectRef` | 原op/effect；same reservation |
| kind | `BridgeStoredResultKind` | 原入口结果族；C/E/J固定映射 |
| payload | `PreparedResultPayload` | 准备材料或actual known阶段；不是Commit proof |
| scope | `SafeScopeRef` | 正式结果scope；current resolver |

| 类别 | 完整签名 | 中文Rustdoc / 参数、返回和副作用 |
|---|---|---|
| 工厂 | `pub fn from_parts(result_id: LocalObjectId, original: OriginalOperationEffectRef, kind: BridgeStoredResultKind, payload: PreparedResultPayload, scope: SafeScopeRef) -> Result<Self, ContractViolation>` | /// 校验并完整复制上述全部入参；不生成ID/时间/权限，无IO |
| 成员 | `pub fn assert_original(&self, original: &OriginalOperationEffectRef) -> Result<(), ContractViolation>` | /// driver只有commit成立才输出CommittedLocalMutationRef并持久化/重建真实SafeOriginalResultRef |


只读消费面：保持字段私有，不提供mutable getter或跳过factory；公开可读取不等于可以日志/外显；Application须重新核验current资格并过滤。

| 完整签名 | 中文Rustdoc / 副作用 |
|---|---|
| `pub fn result_id(&self) -> &LocalObjectId` | /// 借用原result_id字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn original(&self) -> &OriginalOperationEffectRef` | /// 借用原original字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn kind(&self) -> &BridgeStoredResultKind` | /// 借用原kind字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn payload(&self) -> &PreparedResultPayload` | /// 借用原payload字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn scope(&self) -> &SafeScopeRef` | /// 借用原scope字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |

不变量/禁止：结构校验不授权；完整复制全部字段，缺正式来源拒绝。

### QualifiedLocalMutationPlan
归属`local_mutation.rs`；唯一有界本地变更计划。
```rust
/// 唯一有界本地变更计划。
pub struct QualifiedLocalMutationPlan {
    /// 技术mutation identity。
    mutation: LocalMutationRef,
    /// 原op/effect。
    original: OriginalOperationEffectRef,
    /// 十九模型候选write set。
    writes: Vec<PreparedLocalChange>,
    /// Absent/Present完整条件。
    expected: ExpectedLocalRevisionSet,
    /// 同UoW结果材料。
    result_seed: PreparedStoredResultSeed,
    /// 唯一安全producer记录候选。
    audit: SafeAuditRecord,
    /// 正式mandatory/optional/audit-only规则。
    observation: MutationObservationRequirement,
    /// 条件canonical交接候选。
    handoff: Option<SafeHandoffRecord>,
}
```
| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| mutation | `LocalMutationRef` | 技术mutation identity；Application ID/UoW |
| original | `OriginalOperationEffectRef` | 原op/effect；dedup reservation |
| writes | `Vec<PreparedLocalChange>` | 十九模型候选write set；pure Domain合法变化；非空有界无重复subject |
| expected | `ExpectedLocalRevisionSet` | Absent/Present完整条件；consistent snapshot及唯一接管 |
| result_seed | `PreparedStoredResultSeed` | 同UoW结果材料；same original真实阶段 |
| audit | `SafeAuditRecord` | 唯一安全producer记录候选；same mutation/body-free material |
| observation | `MutationObservationRequirement` | 正式mandatory/optional/audit-only规则；actual current owner准入 |
| handoff | `Option<SafeHandoffRecord>` | 条件canonical交接候选；Mandatory须Some且源audit/schema/material/admission一致 |

| 类别 | 完整签名 | 中文Rustdoc / 参数、返回和副作用 |
|---|---|---|
| 工厂 | `pub fn from_parts(mutation: LocalMutationRef, original: OriginalOperationEffectRef, writes: Vec<PreparedLocalChange>, expected: ExpectedLocalRevisionSet, result_seed: PreparedStoredResultSeed, audit: SafeAuditRecord, observation: MutationObservationRequirement, handoff: Option<SafeHandoffRecord>) -> Result<Self, ContractViolation>` | /// 校验并完整复制上述全部入参；不生成ID/时间/权限，无IO |
| 成员 | `pub fn validate_before_commit(&self, now: SafeInstant) -> Result<(), ContractViolation>` | /// subject变化与expected全集一致、初始Absent/ref唯一、同本次op/mutation/audit/result；既有维护目标保其原业务op，只按正式Qualification meaning的subject/expected/basis及原row派生合法迁移；不能统一改成维护Job op。穷尽四种observation并核全current/关联；不产生IO或committed proof |


只读消费面：保持字段私有，不提供mutable getter或跳过factory；公开可读取不等于可以日志/外显；Application须重新核验current资格并过滤。

| 完整签名 | 中文Rustdoc / 副作用 |
|---|---|
| `pub fn mutation(&self) -> &LocalMutationRef` | /// 借用原mutation字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn original(&self) -> &OriginalOperationEffectRef` | /// 借用原original字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn writes(&self) -> &Vec<PreparedLocalChange>` | /// 借用原writes字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn expected(&self) -> &ExpectedLocalRevisionSet` | /// 借用原expected字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn result_seed(&self) -> &PreparedStoredResultSeed` | /// 借用原result_seed字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn audit(&self) -> &SafeAuditRecord` | /// 借用原audit字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn observation(&self) -> &MutationObservationRequirement` | /// 借用原observation字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn handoff(&self) -> &Option<SafeHandoffRecord>` | /// 借用原handoff字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |

不变量/禁止：既有对象after local revision必须checked successor，insert必须1；unknown commit不重新apply本计划；local CAS/audit/result/conditional handoff同UoW，网络不在UoW。

受权修订后的穷尽规则：Mandatory和OptionalQualified均须Some原合法handoff及完整schema/canonical/admission；OwnerPermitsAuditOnly须正式不mandatory依据且handoff=None；NonRecursiveResultOnly须上述formal rule覆盖本次全部拟写subjects/阶段，audit与result仍必需、handoff=None、拒绝任何新canonical/producer。`from_parts`、`validate_before_commit`与同driver`seal_plan`使用同一分支约束，unknown tag拒绝，不以None省略Mandatory。

### QualificationInvalidationPlan
归属`qualification_invalidation.rs`；原已知关联的有界失效计划。
```rust
/// 原已知关联的有界失效计划。
pub struct QualificationInvalidationPlan {
    /// 原relation。
    binding: ExternalBindingRef,
    /// 旧generation。
    previous: BindingGeneration,
    /// 受权新generation。
    current: BindingGeneration,
    /// 正式失效依据。
    basis: MappingInvalidationBasisRef,
    /// 已知受权关联主语。
    affected: AuthorizedSafeSubjectRefSet,
    /// 完整CAS条件。
    expected: ExpectedLocalRevisionSet,
}
```
| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| binding | `ExternalBindingRef` | 原relation；consistent snapshot |
| previous | `BindingGeneration` | 旧generation；same read |
| current | `BindingGeneration` | 受权新generation；actual relation mutation，checked next |
| basis | `MappingInvalidationBasisRef` | 正式失效依据；current authority |
| affected | `AuthorizedSafeSubjectRefSet` | 已知受权关联主语；actual bounded repositories |
| expected | `ExpectedLocalRevisionSet` | 完整CAS条件；same read |

| 类别 | 完整签名 | 中文Rustdoc / 参数、返回和副作用 |
|---|---|---|
| 工厂 | `pub fn from_parts(binding: ExternalBindingRef, previous: BindingGeneration, current: BindingGeneration, basis: MappingInvalidationBasisRef, affected: AuthorizedSafeSubjectRefSet, expected: ExpectedLocalRevisionSet) -> Result<Self, ContractViolation>` | /// 校验并完整复制上述全部入参；不生成ID/时间/权限，无IO |
| 成员 | `pub fn assert_generation(&self) -> Result<(), ContractViolation>` | /// 新代际>旧，按实际变化传播；不改已发生owner/platform结果、不给旧queued effect换plan |


只读消费面：保持字段私有，不提供mutable getter或跳过factory；公开可读取不等于可以日志/外显；Application须重新核验current资格并过滤。

| 完整签名 | 中文Rustdoc / 副作用 |
|---|---|
| `pub fn binding(&self) -> &ExternalBindingRef` | /// 借用原binding字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn previous(&self) -> &BindingGeneration` | /// 借用原previous字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn current(&self) -> &BindingGeneration` | /// 借用原current字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn basis(&self) -> &MappingInvalidationBasisRef` | /// 借用原basis字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn affected(&self) -> &AuthorizedSafeSubjectRefSet` | /// 借用原affected字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |
| `pub fn expected(&self) -> &ExpectedLocalRevisionSet` | /// 借用原expected字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |

不变量/禁止：结构校验不授权；完整复制全部字段，缺正式来源拒绝。

### VerificationFailure
归属`ports/inbound.rs`；finite来源失败的safe返回。
```rust
/// finite来源失败的safe返回。
pub struct VerificationFailure {
    /// 当前模式合法ACK或Reject计划。
    ack: ProtocolAckPlan,
    /// finite失败分类。
    reason: SafeReasonCode,
}
```
| 字段 | 类型 | 作用 / 约束 / 来源 |
|---|---|---|
| ack | `ProtocolAckPlan` | 当前模式合法ACK或Reject计划；registered ingress验证实际结论 |
| reason | `SafeReasonCode` | finite失败分类；private error sanitizer |

| 类别 | 完整签名 | 中文Rustdoc / 参数、返回和副作用 |
|---|---|---|
| 工厂 | `pub fn from_parts(ack: ProtocolAckPlan, reason: SafeReasonCode) -> Result<Self, ContractViolation>` | /// 校验并完整复制上述全部入参；不生成ID/时间/权限，无IO |
| 成员 | `pub fn ack(&self) -> &ProtocolAckPlan` | /// 不含raw body/headers/signature/token或敏感存在性提示 |


只读消费面：保持字段私有，不提供mutable getter或跳过factory；公开可读取不等于可以日志/外显；Application须重新核验current资格并过滤。

| 完整签名 | 中文Rustdoc / 副作用 |
|---|---|
| `pub fn reason(&self) -> &SafeReasonCode` | /// 借用原reason字段；零IO/修改，不授current执行或披露资格；调用方仍按所属安全边界消费。 |

不变量/禁止：结构校验不授权；完整复制全部字段，缺正式来源拒绝。
### LocalViewProjector
归属`result_mapping.rs`；stateless纯helper，不是额外业务truth。
```rust
/// A-READ只读过滤既有local snapshot，不包含repo/provider/clock依赖。
pub struct LocalViewProjector;
```
| 字段 | 来源 / 约束 |
|---|---|
| 无 | 全部依赖显式函数入参；不持有owner权限/缓存，状态不适用 |

| 类别 | 完整签名 | 中文Rustdoc |
|---|---|---|
| 工厂 | `pub fn new() -> Self` | /// 创建无状态helper，不初始化资格或数据。 |
| 成员 | `pub fn project(&self, read: CurrentReadQualification, snapshot: Option<ExistingLocalSnapshot>, now: SafeInstant) -> Result<BridgeReadResult, ContractViolation>` | /// resolver-first的已解析subject/scope及期限先成立；Denied/Unavailable零输出hidden ref/count；authorized absent才NotFound；stage按read.disclosure筛、refs按visible集合交集、count只Allowed且filtered；无write/audit/dedup/refresh/probe。 |

受权R1新增variant消费：`project`与`ExistingLocalSnapshot::read_basis`必须穷尽Operation/Presentation/Action以及原九variant，不使用默认wildcard。Operation只从实际journal提取原op及各stored payload自身stage，Local proof不升级owner/platform/consumer结果；Presentation独立plan仅外显其安全资格/原source和获准refs，不要求dummy intent；Action独立原action的Active/Claimed等标签仅映callback局部阶段，不要求dummy callback。exact selector/namespace/read_basis/原subject不匹配为InconsistentFields/OutOfScope，完整数据或current规则不足返回既有Unavailable，不输出raw scope/hidden ref/count。这三个root不新增wire字段、状态或store truth。

受权expiry repair限定：J05目标`PreparedLocalChange::DedupRecord`只能由实际目标row在原Present条件下`expire`，仅state/local revision变化；保原key/meaning/op/result/window。另一个Job dedup承接本次Qualification meaning和Job original，与audit/result_seed/plan.original一致；目标与Job dedup不得同ref/key。seal核exact body subject/expected/basis、当前expiry资格及完整两个CAS/唯一集，拒绝任意异op写、目标首建、删键/改结果/清unknown。不是通用跨op事务豁免；后续driver/fake必须同判据。

### StoredResultReusePolicy
归属`result_mapping.rs`；stateless纯helper，不是额外业务truth。
```rust
/// A-READ-RESULT同义原结果安全复用，不包含repo/provider/clock依赖。
pub struct StoredResultReusePolicy;
```
| 字段 | 来源 / 约束 |
|---|---|
| 无 | 全部依赖显式函数入参；不持有owner权限/缓存，状态不适用 |

| 类别 | 完整签名 | 中文Rustdoc |
|---|---|---|
| 工厂 | `pub fn new() -> Self` | /// 创建无状态helper，不初始化资格或数据。 |
| 成员 | `pub fn decide(&self, dedup: Option<&DedupRecord>, stored: Option<&SafeOriginalResultRef>, incoming: &BodyFreeOperationMeaningRef, read: Option<&CurrentReadQualification>, now: SafeInstant) -> Result<StoredResultReuseDecision, ContractViolation>` | /// 先原namespace/key/meaning；Conflict/Expired不覆盖，original unknown/result缺失只OriginalPending；仅current read允许才project原safe result，不能因loaded ref跳过resolver或调用owner/platform补结果。 |

### Application回填草稿与模块停审
五private+一个private回复context有真实来源/borrow lifetime/无泄漏派生；九snapshot含actual读取proof和Absent/Present版本集合，不作wire或foreign mirror。Domain只读getter为跨模块结构消费补齐。staged write/result材料区别committed proof，唯一mutation plan同UoW维护result/audit及条件canonical；missing mandatory条件先阻对应IO，Query helper strictly pure。新增support对象都有A-PRIVATE/SNAPSHOT/MUTATION/READ/VERIFY来源，不增20业务模型或19入口。能力/字段/工厂/转移边界/compile方向自检pass；23trait、既有19用例输入DTO/网络/事务签名逐名称defer，不声称可运行、上游资格或验收。下一Infra。

<!-- step06-application-tail -->
